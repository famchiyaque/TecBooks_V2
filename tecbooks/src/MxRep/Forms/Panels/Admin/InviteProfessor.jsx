import React from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormLabel, FormItem, FormMessage, FormControl } from '@/components/ui/form'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, User, Briefcase, X } from 'lucide-react'

// Schema for invite form (simpler than registration)
const inviteProfessorSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstNames: z.string().min(1, 'First name is required'),
  lastNames: z.string().min(1, 'Last name is required'),
  department: z.string().min(1, 'Department is required')
})

function InviteProfessor({ institutionName, onClear, onCancel }) {
  const form = useForm({
    resolver: zodResolver(inviteProfessorSchema),
    defaultValues: {
      email: '',
      firstNames: '',
      lastNames: '',
      department: ''
    }
  })

  const handleClear = () => {
    form.reset({
      email: '',
      firstNames: '',
      lastNames: '',
      department: ''
    })
    if (onClear) onClear()
  }

  return (
    <Card className="border-slate-200">
      <CardContent className="pt-6">
        <Form {...form}>
          <form className="space-y-6">
            {/* Institution (Read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Institution
              </label>
              <Input
                value={institutionName}
                disabled
                className="bg-slate-50 cursor-not-allowed"
              />
              <p className="text-xs text-slate-500">
                The professor will be invited to join this institution
              </p>
            </div>

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="professor@institution.edu" 
                      type="email"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* First Names */}
            <FormField
              control={form.control}
              name="firstNames"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    First Name(s)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter first name(s)" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Names */}
            <FormField
              control={form.control}
              name="lastNames"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Last Name(s)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter last name(s)" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Department */}
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Department
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Computer Science, Mathematics" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="button"
                variant="outline" 
                onClick={handleClear}
                className="flex-1 gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default InviteProfessor