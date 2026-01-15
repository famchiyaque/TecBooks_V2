import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormLabel, FormItem, FormMessage } from '@/components/ui/form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { useParams } from 'react-router-dom'
import Loader from '@/Global Components/Loader'
import { newPasswordSchema } from '@/MxRep/utils/schemas/form.schemas';
import FAQHelpButton from '@/faq/components/FAQHelpButton'

function ResetPassword() {
  const [isLoading, setIsLoading] = useState(true)
  const [userEmail, setUserEmail] = useState(null)
  // some kind of hook here to validate the jwt passed from email
  // in params (simple call to backend to verify signature, ensure expiration)
  // 

  useEffect(() => {
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
    setIsLoading(false)
  }, [])

  const form = useForm({
    resolver: zodResolver(newPasswordSchema)
  })

  const onSubmit = (data) => {
    // make call to backend /auth/login POST with
    // email, password 
    console.log("Submitting forgot password email: ", data)
  }

  if (isLoading) return <Loader />

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="relative"> {/* Added text-left here */}
        <div className="absolute top-4 right-4">
          <FAQHelpButton faqSectionId="accounts" />
        </div>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>
          Enter your new password and confirm it to regain access to your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form} className="text-left">
          <form onSubmit={form.handleSubmit(onSubmit)}>
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

            <Button type="submit" className="w-full">Confirm</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default ResetPassword