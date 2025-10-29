import React from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Users, Calendar, Hash } from 'lucide-react'

function CardGroup({ group, onClick }) {
  const getStatusColor = (status) => {
    return status === 'current' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800'
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
              {group.groupCode}
            </h3>
            <p className="text-sm text-slate-600 truncate">
              {group.className}
            </p>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(group.status)}`}>
            {group.status}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Semester and Subperiod */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-slate-500 flex-shrink-0" />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-700 font-medium">{group.semester}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">Period {group.subperiod}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500">Students</p>
              <p className="text-sm font-semibold text-slate-900">{group.numStudents}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
              <Hash className="h-4 w-4 text-purple-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500">Class ID</p>
              <p className="text-sm font-semibold text-slate-900 truncate">{group.classId}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CardGroup

