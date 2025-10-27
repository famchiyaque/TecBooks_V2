import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { useGetGame } from '@/MxRep/utils/hooks/professor.hooks'
import Loader from '@/Global Components/Loader'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, AlertCircle, Settings, Users, Trophy, Calendar } from 'lucide-react'

function Game() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const { user, isLoading, isInitialized } = useAuth()
  const { getGame, gameIsLoading, error, game } = useGetGame()
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!isInitialized || isLoading || !user) {
      return
    }
    console.log("[GAME VIEW] getting game data for gameId: ", gameId)
    getGame(gameId)
  }, [isInitialized, isLoading, user, gameId, getGame])

  const handleBack = () => {
    const slug = user?.institution?.slug
    navigate(`/mxrep/${slug}/professor-panel/manage-games`)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
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

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800'
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
            <Button 
              variant="outline"
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 mt-6" />
      </div>

      <div className='max-w-7xl mx-auto'>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Teams</p>
                  <p className="text-2xl font-bold text-slate-900">{game.numTeams}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Students</p>
                  <p className="text-2xl font-bold text-slate-900">{game.numStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Max Score</p>
                  <p className="text-2xl font-bold text-slate-900">{game.maxScore}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Avg Score</p>
                  <p className="text-2xl font-bold text-slate-900">{game.avgScore.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="configurations">Configurations</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Game Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Start Date</p>
                    <p className="text-base font-medium text-slate-900">{formatDate(game.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">End Date</p>
                    <p className="text-base font-medium text-slate-900">{formatDate(game.endDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Created</p>
                    <p className="text-base font-medium text-slate-900">{formatDate(game.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(game.status)}`}>
                      {game.status}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configurations">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Game Configurations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
                  <p className="text-slate-600">
                    Configuration settings will be displayed here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
                  <p className="text-slate-600">
                    Team information and performance will be displayed here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Available Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
                  <p className="text-slate-600">
                    Student roster and assignments will be displayed here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Game