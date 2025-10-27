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
import { Gamepad2, Calendar, Users, Trophy, X } from 'lucide-react'

const createGameSchema = z.object({
  name: z.string().min(3, 'Game name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  maxScore: z.string().min(1, 'Max score is required'),
  teamSize: z.string().min(1, 'Team size is required'),
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
  message: "End date must be after start date",
  path: ["endDate"]
})

function CreateGame({ onSubmit, isCreating }) {
  const form = useForm({
    resolver: zodResolver(createGameSchema),
    defaultValues: {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      maxScore: '',
      teamSize: ''
    }
  })

  const handleSubmit = (data) => {
    if (onSubmit) {
      onSubmit({
        ...data,
        maxScore: parseInt(data.maxScore),
        teamSize: parseInt(data.teamSize)
      })
    }
  }

  const handleClear = () => {
    form.reset({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      maxScore: '',
      teamSize: ''
    })
  }

  return (
    <Card className="border-slate-200">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Game Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4" />
                    Game Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter game name" {...field} />
                  </FormControl>
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
                      placeholder="Describe the game objectives and content"
                      className="resize-none h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a clear description of what students will learn
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Start Date
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Date */}
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      End Date
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Max Score */}
              <FormField
                control={form.control}
                name="maxScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      Maximum Score
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="1000"
                        min="1"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Team Size */}
              <FormField
                control={form.control}
                name="teamSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Team Size
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="4"
                        min="1"
                        {...field} 
                      />
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
                <Gamepad2 className="h-4 w-4" />
                {isCreating ? 'Creating...' : 'Create Game'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default CreateGame

