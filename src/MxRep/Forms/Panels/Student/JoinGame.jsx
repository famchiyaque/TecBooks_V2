import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
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
import { Hash, X } from 'lucide-react'

const joinGameSchema = z.object({
  code: z.string().min(1, 'Game code is required'),
})

function JoinGame({ onSubmit, onCancel, isJoining }) {
  const form = useForm({
    resolver: zodResolver(joinGameSchema),
    defaultValues: {
      code: ''
    }
  })

  const handleSubmit = (data) => {
    if (onSubmit) {
      onSubmit(data.code)
    }
  }

  const handleClear = () => {
    form.reset({
      code: ''
    })
  }

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900">Join Game</CardTitle>
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
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Game Code
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter game code (e.g., NS-2025-001)" 
                      {...field}
                      className="uppercase"
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the game code provided by your professor
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-2">
              <Button 
                type="button"
                variant="outline" 
                onClick={handleClear}
                className="flex-1 gap-2"
                disabled={isJoining}
              >
                Clear
              </Button>
              <Button 
                type="submit"
                disabled={isJoining || !form.formState.isValid}
                className="flex-1 gap-2"
              >
                {isJoining ? 'Joining...' : 'Join Game'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default JoinGame

