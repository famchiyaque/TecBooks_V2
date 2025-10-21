import React from 'react'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormLabel, FormItem, FormMessage } from '@/components/ui/form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { signInSchema } from '@/MxRep/Schemas/form.schemas';

function SignIn() {
  const form = useForm({
    resolver: zodResolver(signInSchema)
  })

  const onSubmit = (data) => {
    // make call to backend /auth/login POST with
    // email, password 
    console.log("Submitting login email/password: ", data)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader> {/* Added text-left here */}
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>Enter your email and password to access your account</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input placeholder="email" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField 
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" placeholder="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-right mb-4">
              <a 
                href="/mxrep/auth/forgot-password" 
                className="text-sm text-primary hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <Button type="submit" className="w-full">Sign In</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default SignIn