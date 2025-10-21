import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
// import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormLabel, FormItem, FormMessage } from '@/components/ui/form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { finalizeProfessorSchema } from '@/MxRep/Schemas/form.schemas'
import { defaultFinalizeProfessor } from '@/MxRep/Schemas/form.defaults'

function FinalizeProfessor() {
  const [isLoading, setIsLoading] = useState(true)
  const [userEmail, setUserEmail] = useState(null)
  const [institution, setInstitution] = useState(null)
  const [firstNames, setFirstNames] = useState(null)
  const [lastNames, setLastNames] = useState(null)
  const [department, setDeparment] = useState(null)

  const form = useForm({
    resolver: zodResolver(finalizeProfessorSchema),
    defaultValues: defaultFinalizeProfessor
  })

  const onSubmit = (data) => {
    // make call to backend /register/professor/finalize POST with
    // full object, should return success message, and then redirect to panel
    console.log("Submitting login email/password: ", data)
  }

  useEffect(() => {
    // verify token in params
    // get token back in response
    // extract and set userEmail, institution

      // try {
      //   const jwt = useParams('jwt')
      //   const response = verifyTokenHook(jwt)
      //   if (response.ok) {
      //     setUserEmail(jwt.email)
      //   }
      // } catch (e) {
      //   console.error("Error verifiying token from email: ", e)
      // } finally {
      //   setIsLoading(false)
      // }
      setUserEmail("jimmy@john.com")
      setInstitution({ name: "Hogwarts", id: "123456", domain: "hogwarts.com" })
      setFirstNames("Jimmy Long")
      setLastNames("John Baun")
      setDeparment("Arts and Recreation")
      setIsLoading(false)
    }, [])

    if (isLoading) return <Loader />

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader> {/* Added text-left here */}
        <CardTitle className="text-2xl">Finalize Account</CardTitle>
        <CardDescription>Choose and confirm your password to finish your account setup</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
              // control={form.control}
              name="institution"
              render={() => (
                <FormItem>
                  <FormLabel>Institution</FormLabel>
                  {/* how to make the whole institution by the value for submit, 
                  but only show the name in the input */}
                  <Input disabled value={institution.name} />
                  <FormMessage />
                </FormItem>
              )}
          />

            <FormField
              // control={form.control}
              name="email"
              render={() => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input disabled value={userEmail} />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* How to make the following two required here or with zod in order 
            to be able to show and input the password fields */}
            <FormField 
            //   control={form.control}
              name="firstNames"
              render={() => (
                <FormItem>
                  <FormLabel>First Name(s)</FormLabel>
                  <Input disabled value={firstNames} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField 
            //   control={form.control}
              name="lastNames"
              render={() => (
                <FormItem>
                  <FormLabel>Last Name(s)</FormLabel>
                  <Input disabled value={lastNames} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField 
            //   control={form.control}
              name="department"
              render={() => (
                <FormItem>
                  <FormLabel>Last Name(s)</FormLabel>
                  <Input disabled value={department} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <Input type="password" placeholder="Enter your new passsword" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input type="password" placeholder="Confirm your new password" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
            />

            <Button type="submit" className="w-full">Finish</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default FinalizeProfessor