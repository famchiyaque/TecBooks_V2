import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormLabel, FormItem, FormMessage, FormDescription, FormControl } from '@/components/ui/form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { registerInstitution } from '@/MxRep/utils/schemas/form.schemas'
import { defaultRegisterInstitution } from '@/MxRep/utils/schemas/form.defaults'
import Loader from '@/Global Components/Loader'
import { AlertCircle, CheckCircle, Building2, Mail, Phone, MapPin, User, Briefcase } from 'lucide-react'
import { cn } from '@/components/lib/utils'

function RegisterInstitution() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const form = useForm({
    resolver: zodResolver(registerInstitution),
    defaultValues: defaultRegisterInstitution
  })

  const role = form.watch('role')

  const onSubmit = async (data) => {
    console.log("Submitting institution request ", data)
    setIsLoading(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/mxrep/register/institution/request`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to submit institution request: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      console.log("Institution request submitted successfully:", result)
      
      setSubmitSuccess(true)
      form.reset()
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/mxrep/auth/login')
      }, 3000)
    } catch (err) {
      console.error("Error submitting institution request:", err)
      setSubmitError(err.message || 'Failed to submit institution request. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto px-6 py-8">
        <Loader message="Submitting your request..." />
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-8">
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Institution Registry
          </CardTitle>
          <CardDescription>
            Fill out the required information to submit an approval request and gain access for all your teachers and students
          </CardDescription>
        </CardHeader>
      
        <CardContent>
          {submitSuccess && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Request submitted successfully!</strong> An email has been sent to the system administrator. 
                You will be notified via email when your request has been reviewed. Redirecting to login...
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Institution Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Institution Information
                </h3>
                
                <FormField 
                  control={form.control}
                  name="institution.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter the name of your institution" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField 
                    control={form.control}
                    name="institution.slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="institution-slug" {...field} />
                        </FormControl>
                        <FormDescription>
                          URL-friendly identifier for your institution
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField 
                    control={form.control}
                    name="institution.domain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Domain</FormLabel>
                        <FormControl>
                          <Input placeholder="example.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your institution's email domain (e.g., example.com)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField 
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Country
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField 
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          City
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField 
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="tel"
                            placeholder="+1 (555) 123-4567" 
                            {...field}
                            onChange={(e) => {
                              // Allow only numbers, spaces, dashes, parentheses, and +
                              const value = e.target.value.replace(/[^\d\s\-()\+]/g, '')
                              field.onChange(value)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField 
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Contact Email
                        </FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="contact@institution.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          Primary contact email for your institution
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* User Information Section */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Your Information
                </h3>

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <div className="flex gap-4">
                          <label className={cn(
                            "flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition-colors",
                            field.value === "admin" 
                              ? "border-blue-500 bg-blue-50" 
                              : "border-slate-200 hover:border-slate-300"
                          )}>
                            <input
                              type="radio"
                              value="admin"
                              checked={field.value === "admin"}
                              onChange={() => field.onChange("admin")}
                              className="sr-only"
                            />
                            <span className={cn(
                              "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                              field.value === "admin" 
                                ? "border-blue-500" 
                                : "border-slate-300"
                            )}>
                              {field.value === "admin" && (
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                              )}
                            </span>
                            <span className="text-sm font-medium">Admin</span>
                          </label>
                          <label className={cn(
                            "flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition-colors",
                            field.value === "professor" 
                              ? "border-blue-500 bg-blue-50" 
                              : "border-slate-200 hover:border-slate-300"
                          )}>
                            <input
                              type="radio"
                              value="professor"
                              checked={field.value === "professor"}
                              onChange={() => field.onChange("professor")}
                              className="sr-only"
                            />
                            <span className={cn(
                              "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                              field.value === "professor" 
                                ? "border-blue-500" 
                                : "border-slate-300"
                            )}>
                              {field.value === "professor" && (
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                              )}
                            </span>
                            <span className="text-sm font-medium">Professor</span>
                          </label>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Select whether you'll be registering as an admin or professor
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField 
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@institution.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Use your institution email address
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField 
                    control={form.control}
                    name="firstNames"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name(s)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your first names" {...field} />
                        </FormControl>
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
                        <FormControl>
                          <Input placeholder="Enter your last names" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Department - only show if role is professor */}
                {role === "professor" && (
                  <FormField 
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          Department
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="What department do you work in?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || submitSuccess}
                >
                  {submitSuccess ? 'Submitted!' : 'Submit Request'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterInstitution
