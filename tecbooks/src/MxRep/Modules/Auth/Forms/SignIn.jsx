import React from 'react'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormLabel, FormItem, FormMessage } from '@/components/ui/form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

function SignIn() {
  const schema = z.object({
    email: z.string(),
    password: z.string()
  })

  const form = useForm({
    resolver: zodResolver(schema)
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
        <Form {...form} className="text-left">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="text-left">
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
                <FormItem className="text-left">
                  <FormLabel>Password</FormLabel>
                  <Input type="password" placeholder="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Sign In</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default SignIn