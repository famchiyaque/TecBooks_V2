import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Building2, CheckCircle, XCircle, Clock, DollarSign, Calendar } from 'lucide-react'

function CardInstitution({ institution, onClick }) {
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

  const getPaymentStatusIcon = (paymentStatus) => {
    if (paymentStatus === 'on-time') {
      return <CheckCircle className="h-4 w-4" />
    } else if (paymentStatus === 'overdue') {
      return <XCircle className="h-4 w-4" />
    } else {
      return <Clock className="h-4 w-4" />
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-slate-200"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">
                {institution.name}
              </CardTitle>
              <CardDescription className="truncate">{institution.city}, {institution.country}</CardDescription>
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(institution.status)}`}>
            {institution.status}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Payment Status */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-slate-600" />
            <span className="text-xs text-slate-500">Payment Status</span>
          </div>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getPaymentStatusColor(institution.paymentStatus)}`}>
            {getPaymentStatusIcon(institution.paymentStatus)}
            {institution.paymentStatus === 'on-time' ? 'On Time' : institution.paymentStatus === 'overdue' ? 'Overdue' : 'Pending'}
          </span>
        </div>

        {/* Date Registered */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">Registered: {formatDate(institution.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default CardInstitution

