import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { useGetStudent } from '@/MxRep/utils/hooks/admin.hooks'
import Loader from '@/Global Components/Loader'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, AlertCircle, Trash2 } from 'lucide-react'

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
                {student.studentId} • {student.email}
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

      {/* Content Placeholder */}
      <div className="max-w-5xl mx-auto">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
          <p className="text-slate-600">
            Student details and management features will be implemented here.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Student