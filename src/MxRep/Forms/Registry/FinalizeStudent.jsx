import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams, useNavigate } from 'react-router-dom'
import Loader from '@/Global Components/Loader'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormLabel, FormItem, FormMessage } from '@/components/ui/form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { finalizeStudentSchema } from '@/MxRep/utils/schemas/form.schemas'
import { defaultFinalizeStudent } from '@/MxRep/utils/schemas/form.defaults'
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function FinalizeStudent() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [verificationError, setVerificationError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [userEmail, setUserEmail] = useState(null)
  const [institution, setInstitution] = useState(null)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm({
    resolver: zodResolver(finalizeStudentSchema),
    defaultValues: defaultFinalizeStudent,
    mode: "onChange" // Validate on change to show errors immediately
  })

  useEffect(() => {
    // Get token from URL - try multiple possible parameter names
    const token = searchParams.get('token') || searchParams.get('jwt') || searchParams.get('t')
    
    console.log("Token from URL:", token)
    console.log("All search params:", Object.fromEntries(searchParams.entries()))
    console.log("Current URL:", window.location.href)
    
    if (!token) {
      console.log("No token found in URL parameters, redirecting to login")
      // No token, redirect to login
      setTimeout(() => {
        navigate('/mxrep/auth/login')
      }, 1000)
      return
    }

    let isMounted = true

    async function verifyToken() {
      try {
        console.log("Verifying token with backend...")
        const response = await fetch(`${API_BASE_URL}/mxrep/register/student/verify-token`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true"
          },
        })

        console.log("Verification response status:", response.status)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("Verification error:", errorData)
          if (isMounted) {
            throw new Error(errorData.error || errorData.message || "Invalid or expired token")
          }
          return
        }

        const data = await response.json()
        console.log("Verification response data:", data)
        
        if (!isMounted) return
        
        const userData = data.data || data
        
        // Backend returns institutionId and institutionName directly
        // We need to fetch institution details to get domain for schema validation
        try {
          const instResponse = await fetch(`${API_BASE_URL}/mxrep/register/get-institutions`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true"
            },
          })
          
          if (instResponse.ok) {
            const instData = await instResponse.json()
            const institutions = instData.data || instData
            const foundInstitution = institutions.find(inst => 
              (inst.id || inst._id) === userData.institutionId || inst.name === userData.institutionName
            )
            
            if (foundInstitution) {
              setInstitution({
                name: foundInstitution.name,
                id: foundInstitution.id || foundInstitution._id,
                domain: foundInstitution.domain || "",
                slug: foundInstitution.slug || ""
              })
              
              form.setValue('institution', {
                name: foundInstitution.name,
                id: foundInstitution.id || foundInstitution._id,
                domain: foundInstitution.domain || "",
                slug: foundInstitution.slug || ""
              })
            } else {
              // Fallback if institution not found
              setInstitution({
                name: userData.institutionName,
                id: userData.institutionId,
                domain: "",
                slug: ""
              })
              
              form.setValue('institution', {
                name: userData.institutionName,
                id: userData.institutionId,
                domain: "",
                slug: ""
              })
            }
          }
        } catch (instErr) {
          console.warn("Could not fetch institution details:", instErr)
          // Use basic data without domain
          setInstitution({
            name: userData.institutionName,
            id: userData.institutionId,
            domain: "",
            slug: ""
          })
          
          form.setValue('institution', {
            name: userData.institutionName,
            id: userData.institutionId,
            domain: "",
            slug: ""
          })
        }
        
        setUserEmail(userData.email)
        form.setValue('email', userData.email)
      } catch (err) {
        console.error("Error verifying token:", err)
        if (isMounted) {
          setVerificationError(err.message || "Failed to verify token. Please request a new verification email.")
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    verifyToken()
    
    return () => {
      isMounted = false
    }
  }, [searchParams, navigate, form])

  const onSubmit = async (data) => {
    console.log("Form submitted with data:", data)
    console.log("Form errors:", form.formState.errors)
    
    const token = searchParams.get('token')
    
    if (!token) {
      setSubmitError("No verification token found. Please request a new verification email.")
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      const response = await fetch(`${API_BASE_URL}/mxrep/register/student/finalize`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({
          firstNames: data.firstNames,
          lastNames: data.lastNames,
          password: data.newPassword,
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to finalize registration")
      }

      const result = await response.json()
      
      if (result.success) {
        setSubmitSuccess(true)
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/mxrep/auth/login')
        }, 3000)
      } else {
        throw new Error(result.message || "Failed to finalize registration")
      }
    } catch (err) {
      console.error("Error finalizing student registration:", err)
      setSubmitError(err.message || "Failed to finalize registration. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <Loader message="Verifying token..." />

  if (verificationError) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{verificationError}</AlertDescription>
          </Alert>
          <Button 
            onClick={() => navigate('/mxrep/login')} 
            className="w-full mt-4"
          >
            Go to Login
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader> {/* Added text-left here */}
        <CardTitle className="text-2xl">Finalize Account</CardTitle>
        <CardDescription>Choose and confirm your password to finish your account setup</CardDescription>
      </CardHeader>

      <CardContent>
        {submitSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Account created successfully!</strong> Redirecting to login...
            </AlertDescription>
          </Alert>
        )}

        {submitError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution</FormLabel>
                  <Input disabled value={institution?.name || ""} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input disabled value={userEmail || ""} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField 
              control={form.control}
              name="firstNames"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name(s)</FormLabel>
                  <Input placeholder="Enter your first names" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField 
              control={form.control}
              name="lastNames"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name(s)</FormLabel>
                  <Input placeholder="Enter your last names" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>New Password</FormLabel>
                  <div className="relative flex items-center">
                    <Input 
                      type={showNewPassword ? "text" : "password"} 
                      placeholder="Enter your new password" 
                      {...field} 
                      className="pr-10"
                      onChange={(e) => {
                        field.onChange(e)
                        // Trigger validation on confirmNewPassword when newPassword changes
                        if (form.getValues('confirmNewPassword')) {
                          form.trigger('confirmNewPassword')
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="absolute right-2 p-1 hover:bg-slate-100 rounded"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      tabIndex={-1}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-500" />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Confirm Password</FormLabel>
                  <div className="relative flex items-center">
                    <Input 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="Confirm your new password" 
                      {...field} 
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-2 p-1 hover:bg-slate-100 rounded"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-500" />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting || submitSuccess}
            >
              {isSubmitting ? "Creating Account..." : submitSuccess ? "Account Created!" : "Finish"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default FinalizeStudent