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
import { Mail, User, Building2, Globe, MapPin, Phone, Hash } from 'lucide-react'

// Schema for admin profile form
const adminProfileSchema = z.object({
  // Admin user fields
  email: z.string().email('Invalid email address'),
  firstNames: z.string().min(1, 'First name(s) required'),
  lastNames: z.string().min(1, 'Last name(s) required'),
  
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
    resolver: zodResolver(adminProfileSchema),
    defaultValues: {
      email: '',
      firstNames: '',
      lastNames: '',
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
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Admin User Information Card */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <User className="h-5 w-5" />
                Admin Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4" />
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
                    <FormItem className="md:col-span-2">
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="admin@institution.edu" type="email" {...field} />
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
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Institution Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Institution Name */}
                <FormField
                  control={form.control}
                  name="institutionName"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Institution Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter institution name" {...field} />
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
                      <FormLabel className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Domain
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="institution.edu" {...field} />
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
                      <FormLabel className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        Slug
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="institution-slug" {...field} />
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
                      <FormLabel className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Country
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter country" {...field} />
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
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        City
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city" {...field} />
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
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234 567 8900" {...field} />
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
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Contact Email
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="contact@institution.edu" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
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