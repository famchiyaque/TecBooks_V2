import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { BookOpen, Hash, X } from 'lucide-react'

const createClassSchema = z.object({
  name: z.string().min(3, 'Class name must be at least 3 characters'),
  code: z.string().min(2, 'Class code must be at least 2 characters'),
  description: z.string().optional(),
})

function CreateClass({ onSubmit, isCreating }) {
  const form = useForm({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      name: '',
      code: '',
      description: ''
    }
  })

  const handleSubmit = (data) => {
    if (onSubmit) {
      onSubmit(data)
    }
  }

  const handleClear = () => {
    form.reset({
      name: '',
      code: '',
      description: ''
    })
  }

  return (
    <Card className="border-slate-200">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Class Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Class Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Network Security" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Class Code */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Class Code
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., CS-401" {...field} />
                  </FormControl>
                  <FormDescription>
                    A short identifier for this class
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
                      placeholder="Optional description of the class"
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
                <BookOpen className="h-4 w-4" />
                {isCreating ? 'Creating...' : 'Create Class'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default CreateClass

