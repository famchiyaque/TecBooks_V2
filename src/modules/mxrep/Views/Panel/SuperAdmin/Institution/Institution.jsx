import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { useGetInstitution, useToggleInstitutionStatus } from '@/MxRep/utils/hooks/superadmin.hooks'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Loader from '@/components/global/Loader'
import { 
  ArrowLeft, 
  AlertCircle,
  Building2,
  Mail,
  MapPin,
  Globe,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Power,
  PowerOff,
  Users,
  UserCog,
  GraduationCap
} from 'lucide-react'

function Institution() {
  const { institutionId } = useParams()
  const navigate = useNavigate()
  const { user, isLoading: authLoading, isInitialized } = useAuth()
  const { institution, institutionIsLoading, error, getInstitution } = useGetInstitution()
  const { toggleInstitutionStatus, isToggling, error: toggleError } = useToggleInstitutionStatus()
  const [actionError, setActionError] = useState(null)

  useEffect(() => {
    if (!isInitialized || authLoading || !user) return
    
    if (institutionId) {
      getInstitution(institutionId)
    }
  }, [isInitialized, authLoading, user, institutionId, getInstitution])

  const handleBack = () => {
    navigate(`/mxrep/super-admin-panel/manage-institutions`)
  }

  const handleToggleStatus = async () => {
    setActionError(null)
    const result = await toggleInstitutionStatus(institutionId)
    
    if (result.success) {
      // Refresh institution data
      getInstitution(institutionId)
    } else {
      setActionError(result.error || 'Failed to update institution status')
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
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
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800'
  }

  const getPaymentStatusColor = (paymentStatus) => {
    if (paymentStatus === 'on-time') {
      return 'bg-green-100 text-green-800'
    } else if (paymentStatus === 'overdue') {
      return 'bg-red-100 text-red-800'
    } else {
      return 'bg-yellow-100 text-yellow-800'
    }
  }

  if (!isInitialized || authLoading) {
    return <Loader message="Loading session..." />
  }

  if (!user) {
    return <div>Not authenticated</div>
  }

  if (institutionIsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader message="Loading institution..." />
      </div>
    )
  }

  if (error || !institution) {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Institution not found'}</AlertDescription>
        </Alert>
        <Button onClick={handleBack} className="mt-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Institutions
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
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-slate-900">
                  {institution.name}
                </h1>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(institution.status)}`}>
                  {institution.status}
                </span>
              </div>
              <p className="text-slate-600 mt-1">
                {institution.city}, {institution.country}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleToggleStatus}
              disabled={isToggling}
              variant={institution.status === 'active' ? 'destructive' : 'default'}
              className="gap-2"
            >
              {institution.status === 'active' ? (
                <>
                  <PowerOff className="h-4 w-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <Power className="h-4 w-4" />
                  Activate
                </>
              )}
            </Button>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 mt-6" />
      </div>

      {/* Error Messages */}
      {(actionError || toggleError) && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{actionError || toggleError}</AlertDescription>
        </Alert>
      )}

      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Institution Details */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Institution Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Name</p>
                <p className="text-base font-medium text-slate-900">{institution.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Slug</p>
                <p className="text-sm font-mono font-medium text-slate-900">{institution.slug}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Email</p>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <p className="text-sm font-medium text-slate-900">{institution.email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Domain</p>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-slate-400" />
                  <p className="text-sm font-medium text-slate-900">{institution.domain}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Location</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <p className="text-sm font-medium text-slate-900">{institution.city}, {institution.country}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Registered</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <p className="text-sm font-medium text-slate-900">{formatDate(institution.createdAt)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Users</p>
                  <p className="text-2xl font-bold text-slate-900">{institution.numUsers || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <UserCog className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Professors</p>
                  <p className="text-2xl font-bold text-slate-900">{institution.numProfessors || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Students</p>
                  <p className="text-2xl font-bold text-slate-900">{institution.numStudents || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Information */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Payment Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(institution.paymentStatus)}`}>
                  {institution.paymentStatus === 'on-time' ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      On Time
                    </>
                  ) : institution.paymentStatus === 'overdue' ? (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      Overdue
                    </>
                  ) : (
                    'Pending'
                  )}
                </span>
              </div>
              {institution.subscriptionPlan && (
                <div>
                  <p className="text-sm text-slate-500 mb-1">Subscription Plan</p>
                  <p className="text-base font-medium text-slate-900">{institution.subscriptionPlan}</p>
                </div>
              )}
              {institution.billingCycle && (
                <div>
                  <p className="text-sm text-slate-500 mb-1">Billing Cycle</p>
                  <p className="text-base font-medium text-slate-900 capitalize">{institution.billingCycle}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        {institution.paymentHistory && institution.paymentHistory.length > 0 && (
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {institution.paymentHistory.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {payment.currency} {payment.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-500">
                          Invoice: {payment.invoiceId}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">
                        {formatDateTime(payment.date)}
                      </p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Institution

