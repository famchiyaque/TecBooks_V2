import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormLabel, FormItem, FormMessage } from '@/components/ui/form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { registerInstitution } from '@/MxRep/utils/schemas/form.schemas'
import { defaultRegisterInstitution } from '@/MxRep/utils/schemas/form.defaults'
import Loader from '@/Global Components/Loader'

function RegisterProfessor() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(registerInstitution),
    defaultValues: defaultRegisterInstitution
  })

  const onSubmit = (data) => {
    // make call to backend at /register/professor/request
    // should return 200 Ok and success message,
    // 'wait for approval message, and email has been sent to system admin'
    console.log("Submitting institution request ", data)
    setIsLoading(true)
    setTimeout(() => {
      // set message to 'email has been sent, you will be notified when your 
      // request has been reviewed via email
      // send message-title in params to 'message' component?
      setIsLoading()
    }, 3000)
  }

  if (isLoading) return <Loader />

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader> {/* Added text-left here */}
        <CardTitle className="text-2xl">Institution Registry</CardTitle>
        <CardDescription>
          Fill out the required information in order to submit a approval request and gain
          access for all your teachers and students
        </CardDescription>
      </CardHeader>
    
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField 
              control={form.control}
              name="institution.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <Input placeholder="Enter the name of your institution" {...field} />
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
                  <Input placeholder="@: {school-name}.com" {...field} />
                  <FormMessage />
                </FormItem>
              )}
          />

          <FormField 
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  {/* select, special input if possible with shadcn */}
                  <FormMessage />
                </FormItem>
              )}
          />

          <FormField 
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  {/* select, special input if possible with shadcn */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField 
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  {/* special input if possible with shadcn */}
                  {/* <Input placeholder="Enter the best email to contact your insitution" {...field} /> */}
                  <FormMessage />
                </FormItem>
              )}
            />
    
            <FormField 
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <Input placeholder="Enter the best email to contact your insitution" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* User info section, will be first user of this organization */}

            <FormField
              control=""
              name="userType"
              // maybe radio group, select, idk, but they have to indicate whether
              //they'd like to be registered as an admin (default) or professor
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  {/* idk what kind of input type */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField 
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input placeholder="Enter your institution email" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

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

            {/* only if they chose professor in the userType form */}
            <FormField 
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Input placeholder="What department do you work in" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
            />
    
            <Button type="submit" className="w-full">Submit Request</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default RegisterProfessor