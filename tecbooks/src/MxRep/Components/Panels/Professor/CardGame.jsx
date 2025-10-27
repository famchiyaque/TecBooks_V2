import React from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Users, Trophy, Calendar, TrendingUp } from 'lucide-react'

function CardGame({ game, onClick }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getStatusColor = (status) => {
    return status === 'active' 
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
          <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">
            {game.name}
          </h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(game.status)}`}>
            {game.status}
          </span>
        </div>
        <p className="text-sm text-slate-600 line-clamp-2">
          {game.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Date Range */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">
            {formatDate(game.startDate)} - {formatDate(game.endDate)}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500">Teams</p>
              <p className="text-sm font-semibold text-slate-900">{game.numTeams}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500">Students</p>
              <p className="text-sm font-semibold text-slate-900">{game.numStudents}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
              <Trophy className="h-4 w-4 text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500">Max Score</p>
              <p className="text-sm font-semibold text-slate-900">{game.maxScore}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500">Avg Score</p>
              <p className="text-sm font-semibold text-slate-900">{game.avgScore.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CardGame

