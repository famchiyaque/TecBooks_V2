import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Loader from '@/Global Components/Loader'
import GenericHeader from '@/Global Components/GenericHeader'
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function InstitutionRequestView() {
  const { requestId } = useParams()
  const navigate = useNavigate()
  const { user, token, isLoading, isInitialized } = useAuth()
  const [request, setRequest] = useState(null)
  const [requestLoading, setRequestLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (!isInitialized || isLoading || !user || !requestId) {
      return
    }

    async function fetchInstitutionRequest() {
      try {
        const response = await fetch(`${API_BASE_URL}/mxrep/super-admin-panel/get-institution-request?requestId=${requestId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) throw new Error("Error fetching institution request")

        const data = await response.json()
        setRequest(data)
      } catch (e) {
        console.error("Error fetching institution request:", e)
        setError("Failed to load institution request details")
      } finally {
        setRequestLoading(false)
      }
    }

    setRequestLoading(true)
    fetchInstitutionRequest()
  }, [isInitialized, isLoading, user, token, requestId])

  const handleAction = async (actionType) => {
    setActionLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/mxrep/super-admin-panel/${actionType}-institution-request`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId: request._id }),
      })

      if (!response.ok) throw new Error(`Error ${actionType}ing institution request`)

      // Optionally, navigate back to inbox or update local state
      navigate('/mxrep/super-admin/inbox')
    } catch (e) {
      console.error(`Error ${actionType}ing institution request:`, e)
      setError(`Failed to ${actionType} institution request`)
    } finally {
      setActionLoading(false)
    }
  }

  const fullName = `${request?.firstNames || ''} ${request?.lastNames || ''}`.trim()

  if (!isInitialized || isLoading || requestLoading) {
    return <Loader message="Loading institution request..." />
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error: {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Institution request not found.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      <GenericHeader
        title={`Request for ${request.name}`}
        subtitle="Review institution details and take action"
        rightContent={
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
        }
      />

      {actionLoading && (
        <Alert className="mb-4">
          <AlertDescription>Processing request...</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-white shadow-sm rounded-lg p-6 space-y-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Institution Name</p>
          <p className="text-base text-slate-900">{request.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Domain</p>
          <p className="text-base text-slate-900">{request.domain}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Location</p>
          <p className="text-base text-slate-900">{request.city}, {request.country}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Contact Email</p>
          <p className="text-base text-slate-900">{request.contactEmail}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Phone Number</p>
          <p className="text-base text-slate-900">{request.phoneNumber}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Applicant Name</p>
          <p className="text-base text-slate-900">{fullName}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Applicant Email</p>
          <p className="text-base text-slate-900">{request.email}</p>
        </div>
        {request.department && (
          <div>
            <p className="text-sm font-medium text-slate-500">Department</p>
            <p className="text-base text-slate-900">{request.department}</p>
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-slate-500">Applicant Role</p>
          <p className="text-base text-slate-900">{request.role}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Status</p>
          <p
            className={`text-base font-semibold ${
              request.status === 'pending'
                ? 'text-yellow-600'
                : request.status === 'approved'
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {request.status}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Requested On</p>
          <p className="text-base text-slate-900">{new Date(request.createdAt).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Request ID</p>
          <p className="text-base text-slate-900">{request._id}</p>
        </div>
      </div>
    </div>
  )
}

export default InstitutionRequestView
