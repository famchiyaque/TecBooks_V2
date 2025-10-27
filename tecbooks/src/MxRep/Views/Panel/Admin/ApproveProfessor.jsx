import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import Loader from '@/Global Components/Loader'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import ApproveProfessorForm from '@/MxRep/Forms/Panels/Admin/ApproveProfessor'
import { ArrowLeft, AlertCircle } from 'lucide-react'

function ApproveProfessor() {
  const { requestId } = useParams()
  const navigate = useNavigate()
  const { user, isLoading, isInitialized } = useAuth()
  const [professorData, setProfessorData] = useState(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isInitialized || isLoading || !user) {
      return
    }

    // TODO: Fetch professor request data from backend
    // For now, using mock data based on requestId
    const mockData = {
      'prof-req-001': {
        id: 'prof-req-001',
        institution: user.institution?.name || 'Hogwarts',
        firstNames: 'Jane',
        lastNames: 'Smith',
        email: 'jane.smith@hogwarts.edu',
        department: 'Computer Science',
        requestDate: new Date().toISOString()
      },
      'prof-req-002': {
        id: 'prof-req-002',
        institution: user.institution?.name || 'Hogwarts',
        firstNames: 'John',
        lastNames: 'Doe',
        email: 'john.doe@hogwarts.edu',
        department: 'Mathematics',
        requestDate: new Date(Date.now() - 86400000).toISOString()
      },
      'prof-req-003': {
        id: 'prof-req-003',
        institution: user.institution?.name || 'Hogwarts',
        firstNames: 'Emily',
        lastNames: 'Chen',
        email: 'emily.chen@hogwarts.edu',
        department: 'Physics',
        requestDate: new Date(Date.now() - 259200000).toISOString()
      }
    }

    const data = mockData[requestId]
    if (data) {
      setProfessorData(data)
    } else {
      setError('Professor request not found')
    }
    setDataLoading(false)
  }, [isInitialized, isLoading, user, requestId])

  const handleBack = () => {
    const slug = user?.institution?.slug
    navigate(`/mxrep/${slug}/admin-panel/inbox`)
  }

  const handleApprove = () => {
    console.log('Approving professor:', professorData)
    // TODO: Implement approval logic
    // After successful approval, navigate back to inbox
    handleBack()
  }

  const handleReject = () => {
    console.log('Rejecting professor:', professorData)
    // TODO: Implement rejection logic
    // After successful rejection, navigate back to inbox
    handleBack()
  }

  // Show loader while auth is initializing
  if (!isInitialized || isLoading) {
    return <Loader message="Loading session..." />
  }

  // After initialization, if no user, show error
  if (!user) {
    return <div>Not authenticated</div>
  }

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader message="Loading professor request..." />
      </div>
    )
  }

  if (error || !professorData) {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Professor request not found'}</AlertDescription>
        </Alert>
        <Button onClick={handleBack} className="mt-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Inbox
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
              <h1 className="text-3xl font-bold text-slate-900">Review Professor Request</h1>
              <p className="text-slate-600 mt-1">
                Review and approve or reject this registration request
              </p>
            </div>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 mt-6" />
      </div>

      <div className='max-w-5xl mx-auto'>
        {/* Form Section */}
        <ApproveProfessorForm 
          professorData={professorData}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </div>
  )
}

export default ApproveProfessor