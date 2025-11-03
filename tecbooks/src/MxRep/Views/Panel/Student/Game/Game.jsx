import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { useGetStudentGame } from '@/MxRep/utils/hooks/student.hooks'
import Loader from '@/Global Components/Loader'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, AlertCircle, UserPlus, Users, Calendar, DollarSign, PlayCircle, Hash, Building2 } from 'lucide-react'

function Game() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const { user, isLoading, isInitialized } = useAuth()
  const { getStudentGame, gameIsLoading, error, game } = useGetStudentGame()

  useEffect(() => {
    if (!isInitialized || isLoading || !user) {
      return
    }
    console.log("[GAME VIEW] getting student game data for gameId: ", gameId)
    getStudentGame(gameId, user.userId)
  }, [isInitialized, isLoading, user, gameId, getStudentGame])

  const handleBack = () => {
    const slug = user?.institution?.slug
    navigate(`/mxrep/${slug}/student-panel/my-games`)
  }

  const handleInviteStudent = () => {
    // TODO: Open modal/form to invite another student to the team
    console.log("Invite student to team:", game?.team?.id)
    alert('Invite student functionality coming soon!')
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
    if (status === 'active' || status === 'in-progress') {
      return 'bg-green-100 text-green-800'
    } else if (status === 'ended' || status === 'completed') {
      return 'bg-gray-100 text-gray-800'
    } else {
      return 'bg-yellow-100 text-yellow-800'
    }
  }

  if (!isInitialized || isLoading) {
    return <Loader message="Loading session..." />
  }

  if (!user) {
    return <div>Not authenticated</div>
  }

  if (gameIsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader message="Loading game..." />
      </div>
    )
  }

  if (error || !game) {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Game not found'}</AlertDescription>
        </Alert>
        <Button onClick={handleBack} className="mt-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Games
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
                  {game.name}
                </h1>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(game.status)}`}>
                  {game.status}
                </span>
              </div>
              <p className="text-slate-600 mt-1">
                {game.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {game.team && (
              <Button 
                onClick={handleInviteStudent}
                className="gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Invite Student
              </Button>
            )}
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 mt-6" />
      </div>

      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Team Section */}
        {game.team && (
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Your Team
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Team Name</p>
                <p className="text-lg font-semibold text-slate-900">{game.team.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-slate-500 mb-3">Team Members</p>
                <div className="space-y-2">
                  {game.team.members && game.team.members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">
                          {member.firstNames} {member.lastNames}
                        </p>
                        <p className="text-xs text-slate-600 truncate">{member.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Run Section */}
        {game.run && (
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5" />
                Your Team's Run
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(game.run.status)}`}>
                    {game.run.status}
                  </span>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500 mb-1">Team Capital</p>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-slate-400" />
                    <p className="text-base font-semibold text-slate-900">
                      {game.run.teamCapital?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-1">Started At</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <p className="text-sm font-medium text-slate-900">
                      {formatDateTime(game.run.startedAt)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-1">Ended At</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <p className="text-sm font-medium text-slate-900">
                      {game.run.endedAt ? formatDateTime(game.run.endedAt) : 'In Progress'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-1">Number of Lines</p>
                  <p className="text-base font-semibold text-slate-900">
                    {game.run.lines?.length || game.run.lineIds?.length || 0}
                  </p>
                </div>
              </div>

              {/* Lines Details */}
              {game.run.lines && game.run.lines.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <p className="text-sm text-slate-500 mb-3">Production Lines</p>
                  <div className="space-y-2">
                    {game.run.lines.map((line) => (
                      <div key={line.id} className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-slate-900">{line.name}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-xs">
                          <div>
                            <p className="text-slate-500">Throughput</p>
                            <p className="font-semibold text-slate-900">{line.throughput}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Downtime</p>
                            <p className="font-semibold text-slate-900">{line.downtime}%</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Quality</p>
                            <p className="font-semibold text-slate-900">{(line.quality * 100).toFixed(1)}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Game Details Section */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Game Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Game Code</p>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-slate-400" />
                  <p className="text-sm font-mono font-medium text-slate-900">{game.code}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-1">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(game.status)}`}>
                  {game.status}
                </span>
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-1">Group ID</p>
                <p className="text-sm font-medium text-slate-900">{game.groupId}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-1">Configuration ID</p>
                <p className="text-sm font-medium text-slate-900">{game.configurationId}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-1">Created At</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <p className="text-sm font-medium text-slate-900">
                    {formatDate(game.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Game
