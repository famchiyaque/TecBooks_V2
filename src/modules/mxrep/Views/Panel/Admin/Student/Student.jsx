import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { useGetStudent } from '@/MxRep/utils/hooks/admin.hooks'
import Loader from '@/components/global/Loader'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, AlertCircle, Trash2, User } from 'lucide-react'

function Student() {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const { user, isLoading, isInitialized } = useAuth()
  const { getStudent, removeStudent, studentIsLoading, error, student } = useGetStudent()
  const [isRemoving, setIsRemoving] = useState(false)

  useEffect(() => {
    if (!isInitialized || isLoading || !user) {
      return
    }
    console.log("[STUDENT VIEW] getting student data for studentId: ", studentId)
    getStudent(studentId)
  }, [isInitialized, isLoading, user, studentId, getStudent])

  const handleBack = () => {
    const slug = user?.institution?.slug
    navigate(`/mxrep/${slug}/admin-panel/manage-students`)
  }

  const handleRemove = async () => {
    if (!window.confirm(`Are you sure you want to remove ${student?.firstNames} ${student?.lastNames}? This action cannot be undone.`)) {
      return
    }

    setIsRemoving(true)
    const result = await removeStudent(studentId)
    setIsRemoving(false)

    if (result.success) {
      // Navigate back to students list after successful removal
      handleBack()
    } else {
      alert(`Failed to remove student: ${result.error}`)
    }
  }

  // Show loader while auth is initializing
  if (!isInitialized || isLoading) {
    return <Loader message="Loading session..." />
  }

  // After initialization, if no user, show error
  if (!user) {
    return <div>Not authenticated</div>
  }

  if (studentIsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader message="Loading student data..." />
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Student not found'}</AlertDescription>
        </Alert>
        <Button onClick={handleBack} className="mt-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Students
        </Button>
      </div>
    )
  }

  return (
    <div className='w-full px-6 py-8'>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-2">
          <div className='flex items-start gap-4'>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleBack}
              className="mt-1 h-8 w-8 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className='text-left'>
              <h1 className="text-3xl font-bold text-slate-900">
                {student.firstNames} {student.lastNames}
              </h1>
              <p className="text-slate-600 mt-1">
                {student.email}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="destructive"
              onClick={handleRemove}
              disabled={isRemoving}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {isRemoving ? 'Removing...' : 'Remove'}
            </Button>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 mt-6" />
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Student Information */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-500 mb-1.5">Full Name</p>
                <p className="text-base font-medium text-slate-900">
                  {student.firstNames} {student.lastNames}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1.5">Email</p>
                <p className="text-base font-medium text-slate-900">{student.email}</p>
              </div>
              {student.department && (
                <div>
                  <p className="text-sm text-slate-500 mb-1.5">Department</p>
                  <p className="text-base font-medium text-slate-900">{student.department}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-slate-500 mb-1.5">Role</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {student.role || 'student'}
                </span>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1.5">Account Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  student.needsToConfigurePass 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {student.needsToConfigurePass ? 'Setup Required' : 'Active'}
                </span>
              </div>
              {student.createdAt && (
                <div>
                  <p className="text-sm text-slate-500 mb-1.5">Created At</p>
                  <p className="text-base font-medium text-slate-900">
                    {new Date(student.createdAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Student