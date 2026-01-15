import React from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Users, Hash, BookOpen } from 'lucide-react'

function CardGroup({ group, onClick }) {
  const getStatusColor = (status) => {
    if (status === 'active' || status === 'current') {
      return 'bg-green-100 text-green-800'
    }
    return 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <Card 
      className="border-slate-200 hover:shadow-lg transition-all duration-200 cursor-pointer h-full"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              {group.name || group.code}
            </h3>
            <p className="text-sm text-slate-600 truncate">
              {group.className || (group.classId?.name) || 'Unknown Class'}
            </p>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 capitalize ${getStatusColor(group.status)}`}>
            {group.status || 'unknown'}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Group Code */}
        {group.code && (
          <div className="flex items-center gap-2 text-sm">
            <Hash className="h-4 w-4 text-slate-500 flex-shrink-0" />
            <span className="text-slate-700 font-mono">{group.code}</span>
          </div>
        )}

        {/* Created Date */}
        {group.createdAt && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Created: {formatDate(group.createdAt)}</span>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500">Students</p>
              <p className="text-sm font-semibold text-slate-900">{group.numStudents || 0}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-4 w-4 text-purple-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500">Class</p>
              <p className="text-sm font-semibold text-slate-900 truncate">
                {group.className || (group.classId?.name) || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CardGroup

