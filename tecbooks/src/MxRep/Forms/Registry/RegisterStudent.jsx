import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormLabel, FormItem, FormMessage } from '@/components/ui/form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { registerStudentSchema } from '@/MxRep/utils/schemas/form.schemas'
import { defaultRegisterStudent } from '@/MxRep/utils/schemas/form.defaults'
import Loader from '@/Global Components/Loader'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'

function RegisterStudent() {
  const [institutions, setInstitutions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const form = useForm({
    resolver: zodResolver(registerStudentSchema),
    defaultValues: defaultRegisterStudent
  })

  const onSubmit = (data) => {
    // make call to backend at /register/student/request
    // should return 
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
    console.log(institutions)
    setIsLoading(false)
    // fetchInstitutions()
  }, [])

  if (isLoading) return <Loader />

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader> {/* Added text-left here */}
        <CardTitle className="text-2xl">Student Registry</CardTitle>
        <CardDescription>
          Choose the institution to which you belong and enter your associated email to start your registration
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
                    value={field.value?.name || ""} // only store the name
                    onChange={(e) => {
                      const selected = institutions.find(inst => inst.name === e.target.value)
                      field.onChange(selected)
                    }}
                  >
                    {institutions.map((inst) => (
                      <MenuItem key={inst.name} value={inst.name}>
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
                  <FormLabel>School Email</FormLabel>
                  <Input placeholder="Enter your school email" {...field} />
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

export default RegisterStudent