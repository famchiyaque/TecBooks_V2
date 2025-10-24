import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormLabel, FormItem, FormMessage } from '@/components/ui/form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import FormAlert from '@/MxRep/Components/General/FormAlert'
import { loginSchema } from '@/MxRep/utils/schemas/form.schemas'
import Loader from '@/Global Components/Loader'
import { useLogin } from '@/MxRep/utils/hooks/auth.hooks'

function Login() {
  const { login, isLoading, error } = useLogin()
  const loadingMessage = "Logging in to your account..."
  const errorMessage = "Make sure your credentials are correct and try again"

  const form = useForm({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data) => {
    console.log("Submitting login email/password: ", data)
    await login(data)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      {isLoading ? (
        <Loader message={loadingMessage} />
      ) : (
        <div>
          <CardHeader> {/* Added text-left here */}
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>Enter your email and password to access your account</CardDescription>
          </CardHeader>

          {error && (
            <FormAlert title={error} message={errorMessage} />
          )}
      
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
        </div>
      )}

    </Card>
  )
}

export default Login