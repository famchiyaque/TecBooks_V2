import React from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
// import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormLabel, FormItem, FormMessage } from '@/components/ui/form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { finalizeStudentSchema } from '@/MxRep/utils/schemas/form.schemas'
import { defaultFinalizeStudent } from '@/MxRep/utils/schemas/form.defaults'

function FinalizeStudent() {
  const [isLoading, setIsLoading] = useState(true)
  const [userEmail, setUserEmail] = useState(null)
  const [institution, setInstitution] = useState(null)

  const form = useForm({
    resolver: zodResolver(finalizeStudentSchema),
    defaultValues: defaultFinalizeStudent
  })

  const onSubmit = (data) => {
    // make call to backend /auth/login POST with
    // email, password 
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
              render={({ field }) => (
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
              render={({ field }) => (
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

export default FinalizeStudent