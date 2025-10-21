import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormLabel, FormItem, FormMessage } from '@/components/ui/form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { registerProfessorSchema } from '@/MxRep/Schemas/form.schemas'
import { defaultRegisterProfessor } from '@/MxRep/Schemas/form.defaults'
import Loader from '@/Global Components/Loader'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'

function RegisterProfessor() {
  const [institutions, setInstitutions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const form = useForm({
    resolver: zodResolver(registerProfessorSchema),
    defaultValues: defaultRegisterProfessor
  })

  const onSubmit = (data) => {
    // make call to backend at /register/professor/request
    // should return 200 Ok and success message,
    // 'wait' for approval message
    console.log("Submitting email to backend for verification email ", data)
  }

  useEffect(() => {
    async function fetchInstitutions() {
      try {
        // make call to /utility/get-institutions to fetch
        // all registered institutions
        const response = fetch('/api/utility/get-institutions', {
          method: "GET",
        })
        if (!response.ok) throw new Error("Error fetching institutions")
        const data = response.json()
          setInstitutions(data)
  
      } catch (e) {
        console.error("Error fetching registered institutions or there were none: ", e)
        setError("Failed to fetch institutions")
      } finally {
        setIsLoading(false)
      }
    }
    setInstitutions([
      { name: "Hogwarts", domain: "hogwarts.com" },
      { name: "Hufflepuff", domain: "huffle.puff" },
      { name: "Slytherin", domain: "snake.io" },
      { name: "Ravenclaw", domain: "raven.claw" },
      { name: "Gryffindor", domain: "gryffin.xyz" },
    ])
    setIsLoading(false)
    // fetchInstitutions()
  }, [])

  if (isLoading) return <Loader />

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader> {/* Added text-left here */}
        <CardTitle className="text-2xl">Professor Registry</CardTitle>
        <CardDescription>
          Choose the institution you belong to as well as the rest of the required information in order to
          request a registry
        </CardDescription>
      </CardHeader>
    
      <CardContent>
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
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(institutions.find(inst => inst._id === e.target.value))}
                    >
                      {institutions.map((inst) => (
                        <MenuItem key={inst._id} value={inst._id}>
                          {inst.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage>{error}</FormMessage>
                </FormItem>
              )}
            />
    
            <FormField 
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution Email</FormLabel>
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
    
            <Button type="submit" className="w-full">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default RegisterProfessor