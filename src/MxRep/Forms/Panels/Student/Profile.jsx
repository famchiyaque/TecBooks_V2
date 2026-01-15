import React, { useEffect } from 'react'
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
} from '@/components/ui/form'
import { Mail, User, Building2, Globe, MapPin, Phone, Hash, GraduationCap } from 'lucide-react'

// Schema for student profile form
const studentProfileSchema = z.object({
  // Student user fields
  email: z.string().email('Invalid email address'),
  firstNames: z.string().min(1, 'First name(s) required'),
  lastNames: z.string().min(1, 'Last name(s) required'),
  major: z.string().min(1, 'Major required'),
  studentId: z.string().optional(),
  
  // Institution fields
  institutionName: z.string().min(1, 'Institution name required'),
  domain: z.string().min(1, 'Domain required'),
  slug: z.string().min(1, 'Slug required'),
  country: z.string().min(1, 'Country required'),
  city: z.string().min(1, 'City required'),
  phoneNumber: z.string().min(1, 'Phone number required'),
  contactEmail: z.string().email('Invalid contact email'),
  institutionId: z.string()
})

function Profile({ profileData, onSave, isSaving }) {
  const form = useForm({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: {
      email: '',
      firstNames: '',
      lastNames: '',
      major: '',
      studentId: '',
      institutionName: '',
      domain: '',
      slug: '',
      country: '',
      city: '',
      phoneNumber: '',
      contactEmail: '',
      institutionId: ''
    }
  })

  // Update form when profileData changes
  useEffect(() => {
    if (profileData) {
      form.reset({
        email: profileData.user.email || '',
        firstNames: profileData.user.firstNames || '',
        lastNames: profileData.user.lastNames || '',
        major: profileData.user.major || '',
        studentId: profileData.user.studentId || '',
        institutionName: profileData.institution.name || '',
        domain: profileData.institution.domain || '',
        slug: profileData.institution.slug || '',
        country: profileData.institution.country || '',
        city: profileData.institution.city || '',
        phoneNumber: profileData.institution.phoneNumber || '',
        contactEmail: profileData.institution.contactEmail || '',
        institutionId: profileData.institution.institutionId || ''
      })
    }
  }, [profileData, form])

  const handleSubmit = (data) => {
    if (onSave) {
      onSave(data)
    }
  }

  const handleClear = () => {
    if (profileData) {
      form.reset({
        email: profileData.user.email || '',
        firstNames: profileData.user.firstNames || '',
        lastNames: profileData.user.lastNames || '',
        major: profileData.user.major || '',
        studentId: profileData.user.studentId || '',
        institutionName: profileData.institution.name || '',
        domain: profileData.institution.domain || '',
        slug: profileData.institution.slug || '',
        country: profileData.institution.country || '',
        city: profileData.institution.city || '',
        phoneNumber: profileData.institution.phoneNumber || '',
        contactEmail: profileData.institution.contactEmail || '',
        institutionId: profileData.institution.institutionId || ''
      })
    }
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* Student User Information Card */}
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <User className="h-4 w-4" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Names */}
                <FormField
                  control={form.control}
                  name="firstNames"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm">
                        <User className="h-3.5 w-3.5" />
                        First Name(s)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name(s)" {...field} />
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
                      <FormLabel className="flex items-center gap-2 text-sm">
                        <User className="h-3.5 w-3.5" />
                        Last Name(s)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name(s)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm">
                        <Mail className="h-3.5 w-3.5" />
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="student@institution.edu" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Major */}
                <FormField
                  control={form.control}
                  name="major"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm">
                        <GraduationCap className="h-3.5 w-3.5" />
                        Major
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter major" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Student ID */}
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm">
                        <Hash className="h-3.5 w-3.5" />
                        Student ID
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter student ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Institution Information Card */}
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Institution Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Institution Name */}
                <FormField
                  control={form.control}
                  name="institutionName"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="flex items-center gap-2 text-sm">
                        <Building2 className="h-3.5 w-3.5" />
                        Institution Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter institution name" {...field} disabled className="bg-slate-50 cursor-not-allowed" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Domain */}
                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm">
                        <Globe className="h-3.5 w-3.5" />
                        Domain
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="institution.edu" {...field} disabled className="bg-slate-50 cursor-not-allowed" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Slug */}
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm">
                        <Hash className="h-3.5 w-3.5" />
                        Slug
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="institution-slug" {...field} disabled className="bg-slate-50 cursor-not-allowed" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Country */}
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm">
                        <Globe className="h-3.5 w-3.5" />
                        Country
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter country" {...field} disabled className="bg-slate-50 cursor-not-allowed" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* City */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm">
                        <MapPin className="h-3.5 w-3.5" />
                        City
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city" {...field} disabled className="bg-slate-50 cursor-not-allowed" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm">
                        <Phone className="h-3.5 w-3.5" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234 567 8900" {...field} disabled className="bg-slate-50 cursor-not-allowed" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact Email */}
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm">
                        <Mail className="h-3.5 w-3.5" />
                        Contact Email
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="contact@institution.edu" type="email" {...field} disabled className="bg-slate-50 cursor-not-allowed" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button 
              type="button"
              variant="outline" 
              onClick={handleClear}
              className="flex-1 gap-2"
              disabled={isSaving}
            >
              Clear Changes
            </Button>
            <Button 
              type="submit"
              disabled={isSaving || !form.formState.isDirty}
              className="flex-1 gap-2"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default Profile

