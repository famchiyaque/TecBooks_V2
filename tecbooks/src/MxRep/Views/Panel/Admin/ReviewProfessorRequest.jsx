import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Loader from '@/Global Components/Loader'
import fetchWithAuth from '@/MxRep/utils/apis/api.service'
import { 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  User,
  Calendar
} from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function ReviewProfessorRequest() {
  const { requestId } = useParams()
  const navigate = useNavigate()
  const { user, token, isLoading, isInitialized } = useAuth()
  const [request, setRequest] = useState(null)
  const [requestLoading, setRequestLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState(null)

  useEffect(() => {
    if (!isInitialized || isLoading || !user || !requestId || !token) {
      return
    }

    async function fetchProfessorRequest() {
      try {
        setTimeout(async () => {
        const data = await fetchWithAuth(
          `${API_BASE_URL}/mxrep/admin-panel/get-professor-request?requestId=${requestId}`,
            token,
            { method: "GET" }
          )
          setRequest(data.data)
          setError(null)
        }, 6000)
      } catch (e) {
        console.error("Error fetching professor request:", e)
        setError(e.message || "Failed to load professor request details")
      } finally {
        setRequestLoading(false)
      }
    }

    setRequestLoading(true)
    fetchProfessorRequest()
  }, [isInitialized, isLoading, user, token, requestId])

  const handleBack = () => {
    const slug = user?.institution?.slug
    navigate(`/mxrep/${slug}/admin-panel/inbox`)
  }

  const handleAction = async (actionType) => {
    setActionLoading(true)
    setActionError(null)
    setError(null)
    try {
      await fetchWithAuth(
        `${API_BASE_URL}/mxrep/admin-panel/${actionType}-professor`,
        token,
        {
          method: "POST",
          body: { requestId: request._id }
        }
      )

      const slug = user?.institution?.slug
      navigate(`/mxrep/${slug}/admin-panel/inbox`)
    } catch (e) {
      console.error(`Error ${actionType}ing professor request:`, e)
      setActionError(e.message || `Failed to ${actionType} professor request`)
    } finally {
      setActionLoading(false)
    }
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    if (status === 'pending') {
      return 'bg-yellow-100 text-yellow-800'
    } else if (status === 'approved') {
      return 'bg-green-100 text-green-800'
    } else {
      return 'bg-red-100 text-red-800'
    }
  }

  const fullName = `${request?.firstNames || ''} ${request?.lastNames || ''}`.trim()

  if (!isInitialized || isLoading) {
    return <Loader message="Loading session..." />
  }

  if (!user) {
    return <div>Not authenticated</div>
  }

  if (requestLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader message="Loading professor request..." />
      </div>
    )
  }

  if (error || !request) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || 'Professor request not found'}
          </AlertDescription>
        </Alert>
        <Button onClick={handleBack} className="mt-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Inbox
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full px-6 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-start gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleBack}
              className="mt-1 h-8 w-8 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-left">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-slate-900">
                  Professor Request
                </h1>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>
              <p className="text-slate-600 mt-1">
                {fullName}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => handleAction('approve')} 
              disabled={actionLoading || request.status !== 'pending'}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve
            </Button>
            <Button 
              onClick={() => handleAction('decline')} 
              disabled={actionLoading || request.status !== 'pending'}
              variant="destructive" 
              className="gap-2"
            >
              <XCircle className="h-4 w-4" />
              Decline
            </Button>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 mt-6" />
      </div>

      {/* Error Messages */}
      {actionError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{actionError}</AlertDescription>
        </Alert>
      )}

      {actionLoading && (
        <Alert className="mb-6">
          <AlertDescription>Processing request...</AlertDescription>
        </Alert>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Professor Information */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Professor Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-500 mb-1.5">Full Name</p>
                <p className="text-base font-medium text-slate-900">{fullName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1.5">Email</p>
                <p className="text-base font-medium text-slate-900">{request.email}</p>
              </div>
              {request.department && (
                <div>
                  <p className="text-sm text-slate-500 mb-1.5">Department</p>
                  <p className="text-base font-medium text-slate-900">{request.department}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Request Information */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Request Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-500 mb-1.5">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                  {request.status === 'pending' && <AlertCircle className="h-3 w-3 mr-1" />}
                  {request.status === 'approved' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                  {request.status === 'declined' && <XCircle className="h-3 w-3 mr-1" />}
                  {request.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1.5">Requested On</p>
                <p className="text-base font-medium text-slate-900">{formatDateTime(request.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1.5">Request ID</p>
                <p className="text-xs font-mono font-medium text-slate-900">{request._id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ReviewProfessorRequest