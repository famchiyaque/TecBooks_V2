import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormLabel, FormItem, FormMessage } from '@/components/ui/form'
import { useParams } from 'react-router-dom'
import Loader from '@/Global Components/Loader'
import { resetPasswordSchema } from '../Schemas/schemas';

function ResetPassword() {
  const [isLoading, setIsLoading] = useState(true)
  const [userEmail, setUserEmail] = useState(null)
  // some kind of hook here to validate the jwt passed from email
  // in params (simple call to backend to verify signature, ensure expiration)
  // 

  // useEffect(() => {
  //   try {
  //     const jwt = useParams('jwt')
  //     const response = verifyTokenHook(jwt)
  //     if (response.ok) {
  //       setUserEmail(jwt.email)
  //     }
  //   } catch (e) {
  //     console.error("Error verifiying token from email: ", e)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }, [])

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema)
  })

  const onSubmit = (data) => {
    // make call to backend /auth/login POST with
    // email, password 
    console.log("Submitting forgot password email: ", data)
  }

  if (isLoading) return <Loader />

  return (
    <Form {...form}>
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

        <Button type="submit" className="w-full">Sign In</Button>
      </form>
    </Form>
  )
}

export default ResetPassword