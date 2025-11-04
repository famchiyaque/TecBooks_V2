import React, { useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Clock, UserPlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'

function CardInstitutionRequest({ notification, onReview }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleReview = () => {
    if (onReview) {
      onReview(notification)
    } else {
      console.log("Navigating to institution request view")
      navigate(`/mxrep/super-admin-panel/inbox/${notification._id}`)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const fullName = `${notification.firstNames || ''} ${notification.lastNames || ''}`.trim()

  return (
    <Card className="border-slate-200 hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Main title */}
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
              <h3 className="text-base font-semibold text-slate-900 truncate">
                New institution request: {notification.name}
              </h3>
            </div>

            {/* Date + requester info */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatDate(notification.createdAt)}</span>
              {fullName && (
                <>
                  <span>•</span>
                  <span className="font-medium text-slate-700">{fullName}</span>
                </>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button onClick={handleReview} size="sm" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Review
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="border-t border-slate-100 pt-4 space-y-2 text-sm text-slate-700">
            <div>
              <span className="text-slate-500 font-medium">Institution: </span>
              {notification.name} ({notification.city}, {notification.country})
            </div>
            <div>
              <span className="text-slate-500 font-medium">Domain: </span>
              {notification.domain}
            </div>
            <div>
              <span className="text-slate-500 font-medium">Contact Email: </span>
              {notification.contactEmail}
            </div>
            <div>
              <span className="text-slate-500 font-medium">Applicant: </span>
              {fullName} ({notification.email})
            </div>
            {notification.department && (
              <div>
                <span className="text-slate-500 font-medium">Department: </span>
                {notification.department}
              </div>
            )}
            <div>
              <span className="text-slate-500 font-medium">Status: </span>
              <span
                className={`font-semibold ${
                  notification.status === 'pending'
                    ? 'text-yellow-600'
                    : notification.status === 'approved'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {notification.status}
              </span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export default CardInstitutionRequest
