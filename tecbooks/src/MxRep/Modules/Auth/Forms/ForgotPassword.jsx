import React from 'react'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormLabel, FormItem, FormMessage } from '@/components/ui/form'

function ForgotPassword() {
  const schema = z.object({
    email: z.string()
  })

  const form = useForm({
    resolver: zodResolver(schema)
  })

  const onSubmit = (data) => {
    // make call to backend /auth/login POST with
    // email, password 
    console.log("Submitting forgot password email: ", data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Input placeholder="Enter your email" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Sign In</Button>
      </form>
    </Form>
  )
}

export default ForgotPassword