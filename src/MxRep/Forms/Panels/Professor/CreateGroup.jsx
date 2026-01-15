import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Select, MenuItem, InputLabel, FormControl as MUIFormControl } from '@mui/material'
import { Textarea } from '@/components/ui/textarea'
import { useGetProfessorClasses } from '@/MxRep/utils/hooks/professor.hooks'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { Users, Hash, X } from 'lucide-react'

const createGroupSchema = z.object({
  code: z.string().min(2, 'Group code must be at least 2 characters'),
  classId: z.string().min(1, 'Class is required'),
  name: z.string().min(3, 'Group name must be at least 3 characters'),
  description: z.string().optional(),
})

function CreateGroup({ onSubmit, isCreating, preselectedClassId }) {
  const { user } = useAuth()
  const { classes, getProfessorClasses } = useGetProfessorClasses()
  const form = useForm({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      code: '',
      classId: preselectedClassId || '',
      name: '',
      description: ''
    }
  })

  useEffect(() => {
    if (user?.userId) {
      getProfessorClasses(user.userId)
    }
  }, [user, getProfessorClasses])

  useEffect(() => {
    if (preselectedClassId) {
      form.setValue('classId', preselectedClassId)
    }
  }, [preselectedClassId, form])

  const handleSubmit = (data) => {
    if (onSubmit) {
      onSubmit(data)
    }
  }

  const handleClear = () => {
    form.reset({
      code: '',
      classId: preselectedClassId || '',
      name: '',
      description: ''
    })
  }

  return (
    <Card className="border-slate-200">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Class Selection */}
            <FormField
              control={form.control}
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Class
                  </FormLabel>
                  <FormControl>
                    <MUIFormControl fullWidth>
                      <InputLabel id="class-select-label">Select Class</InputLabel>
                      <Select
                        labelId="class-select-label"
                        {...field}
                        value={field.value || ""}
                        label="Select Class"
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        {classes.map((classItem) => (
                          <MenuItem key={classItem.id} value={classItem.id}>
                            {classItem.name} ({classItem.code})
                          </MenuItem>
                        ))}
                      </Select>
                    </MUIFormControl>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Group Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Group Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Group A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Group Code */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Group Code
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., NS-G1" {...field} />
                  </FormControl>
                  <FormDescription>
                    A short identifier for this group
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Optional description of the group"
                      className="resize-none h-24"
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
                disabled={isCreating}
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
              <Button 
                type="submit"
                disabled={isCreating || !form.formState.isValid}
                className="flex-1 gap-2"
              >
                <Users className="h-4 w-4" />
                {isCreating ? 'Creating...' : 'Create Group'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default CreateGroup

