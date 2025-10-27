import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import StatusBadge from '@/MxRep/Components/Panels/Common/StatusBadge'
import { User, BookOpen, Users, Gamepad2 } from 'lucide-react'

function CardProfessor({ professor, onClick }) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-slate-200"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
              {professor.firstNames?.[0]}{professor.lastNames?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">
                {professor.firstNames} {professor.lastNames}
              </CardTitle>
              <CardDescription className="truncate">{professor.email}</CardDescription>
            </div>
          </div>
          <StatusBadge isActive={professor.aStatus} size="sm" />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
            <BookOpen className="w-4 h-4 text-slate-600" />
            <span className="text-xs text-slate-500">Classes</span>
            <span className="text-sm font-semibold text-slate-700">{professor.numClasses || 0}</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
            <Users className="w-4 h-4 text-slate-600" />
            <span className="text-xs text-slate-500">Groups</span>
            <span className="text-sm font-semibold text-slate-700">{professor.numGroups || 0}</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
            <Gamepad2 className="w-4 h-4 text-slate-600" />
            <span className="text-xs text-slate-500">Games</span>
            <span className="text-sm font-semibold text-slate-700">{professor.numGames || 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CardProfessor