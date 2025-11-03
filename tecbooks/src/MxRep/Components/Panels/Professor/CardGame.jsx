import React from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlayCircle, CircleOff, Users, Gamepad2 } from 'lucide-react'

function CardGame({ game, onClick, onDashboardClick, isProfessor = false }) {
  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800'
  }

  const hasRun = game.run && game.run.status === 'in-progress'

  // Professor view: show teams and runs
  if (isProfessor) {
  return (
    <Card 
        className="border-slate-200 hover:shadow-lg transition-all duration-200 h-full flex flex-col"
    >
        <CardHeader className="pb-3 cursor-pointer" onClick={onClick}>
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

        <CardContent className="space-y-3 flex-1 flex flex-col">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500">Teams</p>
                <p className="text-sm font-semibold text-slate-900">{game.numTeams || 0}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                <Gamepad2 className="h-4 w-4 text-purple-600" />
            </div>
            <div className="min-w-0">
                <p className="text-xs text-slate-500">Runs</p>
                <p className="text-sm font-semibold text-slate-900">{game.numRuns || 0}</p>
            </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Student view: show run status and dashboard button
  return (
    <Card 
      className="border-slate-200 hover:shadow-lg transition-all duration-200 h-full flex flex-col"
    >
      <CardHeader className="pb-3 cursor-pointer" onClick={onClick}>
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

      <CardContent className="space-y-3 flex-1 flex flex-col">
        {/* Run Status */}
        <div className="flex items-center gap-2 text-sm">
          {hasRun ? (
            <>
              <PlayCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span className="text-slate-700">Run in progress</span>
            </>
          ) : (
            <>
              <CircleOff className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span className="text-slate-500">No active run</span>
            </>
          )}
        </div>

        {/* Dashboard Button */}
        {hasRun && onDashboardClick && (
          <Button 
            onClick={(e) => {
              e.stopPropagation()
              onDashboardClick(game)
            }}
            className="w-full mt-auto"
          >
            Go to Dashboard
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default CardGame

