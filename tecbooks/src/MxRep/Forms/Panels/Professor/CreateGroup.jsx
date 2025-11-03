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
import { useGetProfessorClasses } from '@/MxRep/utils/hooks/professor.hooks'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { Users, Hash, Calendar, X } from 'lucide-react'

const createGroupSchema = z.object({
  groupCode: z.string().min(2, 'Group code must be at least 2 characters'),
  classId: z.string().min(1, 'Class is required'),
  semester: z.string().min(1, 'Semester is required'),
  subperiod: z.string().min(1, 'Subperiod is required'),
})

function CreateGroup({ onSubmit, isCreating, preselectedClassId }) {
  const { user } = useAuth()
  const { classes, getProfessorClasses } = useGetProfessorClasses()
  const form = useForm({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      groupCode: '',
      classId: preselectedClassId || '',
      semester: '',
      subperiod: ''
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
      // Find the class name from classes
      const selectedClass = classes.find(c => c.id === data.classId)
      onSubmit({
        ...data,
        className: selectedClass?.name || '',
      })
    }
  }

  const handleClear = () => {
    form.reset({
      groupCode: '',
      classId: preselectedClassId || '',
      semester: '',
      subperiod: ''
    })
  }

  const subperiodOptions = ['1', '2', '3', '1-2', '1-3', '2-3']

  // Generate semester options (current and next few semesters)
  const getSemesterOptions = () => {
    const options = []
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1
    
    // Generate semesters for current year and next year
    for (let year = currentYear - 1; year <= currentYear + 1; year++) {
      options.push(`Feb-Jun-${year}`)
      options.push(`Aug-Dec-${year}`)
    }
    
    return options
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

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Group Code */}
              <FormField
                control={form.control}
                name="groupCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
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

              {/* Semester */}
              <FormField
                control={form.control}
                name="semester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Semester
                    </FormLabel>
                    <FormControl>
                      <MUIFormControl fullWidth>
                        <InputLabel id="semester-select-label">Select Semester</InputLabel>
                        <Select
                          labelId="semester-select-label"
                          {...field}
                          value={field.value || ""}
                          label="Select Semester"
                          onChange={(e) => field.onChange(e.target.value)}
                        >
                          {getSemesterOptions().map((semester) => (
                            <MenuItem key={semester} value={semester}>
                              {semester}
                            </MenuItem>
                          ))}
                        </Select>
                      </MUIFormControl>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Subperiod */}
              <FormField
                control={form.control}
                name="subperiod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Subperiod
                    </FormLabel>
                    <FormControl>
                      <MUIFormControl fullWidth>
                        <InputLabel id="subperiod-select-label">Select Subperiod</InputLabel>
                        <Select
                          labelId="subperiod-select-label"
                          {...field}
                          value={field.value || ""}
                          label="Select Subperiod"
                          onChange={(e) => field.onChange(e.target.value)}
                        >
                          {subperiodOptions.map((period) => (
                            <MenuItem key={period} value={period}>
                              {period}
                            </MenuItem>
                          ))}
                        </Select>
                      </MUIFormControl>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

