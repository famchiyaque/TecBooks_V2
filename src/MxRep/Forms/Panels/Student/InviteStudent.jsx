import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { UserPlus, X, Users } from 'lucide-react'
import { cn } from '@/components/lib/utils'

const inviteStudentSchema = z.object({
  studentId: z.string().min(1, 'Please select a student'),
})

function InviteStudent({ onSubmit, onCancel, isInviting, availableStudents = [], currentTeamSize, currentTeamMemberIds = [], maxTeamSize = 4 }) {
  const form = useForm({
    resolver: zodResolver(inviteStudentSchema),
    defaultValues: {
      studentId: ''
    }
  })

  const handleSubmit = (data) => {
    if (onSubmit) {
      onSubmit(data.studentId)
    }
  }

  const canInviteMore = currentTeamSize < maxTeamSize
  const slotsRemaining = maxTeamSize - currentTeamSize

  // Filter out students already in the current team
  const filteredStudents = availableStudents.filter(student => 
    !currentTeamMemberIds.includes(student.id) && student.status === 'available'
  )

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite Student to Team
          </CardTitle>
          {onCancel && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {!canInviteMore ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Your team is full. Maximum team size is {maxTeamSize} members.
                </p>
              </div>
            ) : (
              <>
                <div className="text-sm text-slate-600 mb-4">
                  <p>Select a student from your group to invite to your team.</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {slotsRemaining} slot{slotsRemaining !== 1 ? 's' : ''} remaining (max {maxTeamSize} members)
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Select Student
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className={cn(
                            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
                            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                            "disabled:cursor-not-allowed disabled:opacity-50"
                          )}
                          disabled={isInviting}
                        >
                          <option value="">-- Select a student --</option>
                          {filteredStudents.map((student) => (
                            <option 
                              key={student.id} 
                              value={student.id}
                            >
                              {student.firstNames} {student.lastNames} ({student.email})
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormDescription>
                        Only available students can be invited. Students already in a team are disabled.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {filteredStudents.length === 0 && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-sm text-slate-600">
                      No available students in this group. All students are already in teams or are already part of your team.
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={onCancel}
                    className="flex-1"
                    disabled={isInviting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isInviting || !form.formState.isValid || !canInviteMore}
                    className="flex-1 gap-2"
                  >
                    {isInviting ? 'Inviting...' : 'Send Invitation'}
                  </Button>
                </div>
              </>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default InviteStudent

