import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormLabel, FormItem, FormMessage } from '@/components/ui/form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { registerStudentSchema } from '@/MxRep/utils/schemas/form.schemas'
import { defaultRegisterStudent } from '@/MxRep/utils/schemas/form.defaults'
import Loader from '@/components/global/Loader'
import { AlertCircle, CheckCircle } from 'lucide-react'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function RegisterStudent() {
  const [institutions, setInstitutions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const form = useForm({
    resolver: zodResolver(registerStudentSchema),
    defaultValues: defaultRegisterStudent
  })

  const onSubmit = async (data) => {
    console.log("Submitting student registration: ", data)
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      const response = await fetch(`${API_BASE_URL}/mxrep/register/student/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({
          institution: data.institution,
          email: data.email
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to submit registration request")
      }

      const result = await response.json()
      
      if (result.success) {
        setSubmitSuccess(true)
        form.reset()
      } else {
        throw new Error(result.message || "Failed to submit registration request")
      }
    } catch (err) {
      console.error("Error submitting student registration:", err)
      setSubmitError(err.message || "Failed to submit registration request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    async function fetchInstitutions() {
      try {
        const response = await fetch(`${API_BASE_URL}/mxrep/register/get-institutions`, {
          method: "GET",
        })

        if (!response.ok) throw new Error("Error fetching institutions")

        const data = await response.json()
        console.log("Data, ", data)
        setInstitutions(data.data)

      } catch (e) {
        console.error("Error fetching registered institutions:", e)
        setError("Failed to fetch institutions")
      } finally {
        setIsLoading(false)
      }
    }

    fetchInstitutions()
  }, [])

  if (isLoading) return <Loader message="Loading institutions..." />

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Student Registry</CardTitle>
        <CardDescription>
          Choose the institution to which you belong and enter your associated email to start your registration
        </CardDescription>
      </CardHeader>
    
      <CardContent>
        {submitSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Verification email sent successfully!</strong> Please check your inbox and follow the instructions to complete your registration.
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
                  <FormLabel>Choose your institution</FormLabel>
                  <FormControl fullWidth>
                    <InputLabel id="institution-label">Institution</InputLabel>
                    <Select
                      labelId="institution-label"
                      value={field.value?.id || field.value?._id || ""}
                      onChange={(e) => {
                        const selected = institutions.find(inst => (inst.id || inst._id) === e.target.value)
                        if (selected) {
                          // Format the institution object to match the schema
                          field.onChange({
                            name: selected.name,
                            domain: selected.domain,
                            id: selected.id || selected._id,
                            slug: selected.slug
                          })
                        }
                      }}
                    >
                      {institutions.map((inst) => (
                        <MenuItem key={inst._id || inst.id || inst.name} value={inst.id || inst._id || inst.name}>
                          {inst.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField 
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Email</FormLabel>
                  <Input placeholder="Enter your school email" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
    
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || submitSuccess}
            >
              {isSubmitting ? "Submitting..." : submitSuccess ? "Email Sent!" : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default RegisterStudent
