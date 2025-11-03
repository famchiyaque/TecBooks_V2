import React from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlayCircle, CircleOff } from 'lucide-react'

function CardGame({ game, onClick, onDashboardClick }) {
  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800'
  }

  const hasRun = game.run && game.run.status === 'in-progress'

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

