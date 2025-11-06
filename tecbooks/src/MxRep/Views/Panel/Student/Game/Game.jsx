import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { useGetGame, useGetTeamRuns, useGetGroupStudents, useInviteStudent } from '@/MxRep/utils/hooks/student.hooks'
import Loader from '@/Global Components/Loader'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import InviteStudent from '@/MxRep/Forms/Panels/Student/InviteStudent'
import { ArrowLeft, AlertCircle, UserPlus, Users, PlayCircle, Hash, Building2, ChevronDown, ChevronUp, Factory, Package, Briefcase, Receipt, Settings, Pause, CheckCircle2, Trophy, Clock, Gamepad2 } from 'lucide-react'

function Game() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const { user, isLoading, isInitialized } = useAuth()
  const { getGame, gameIsLoading, error, game } = useGetGame()
  const { getTeamRuns, runsIsLoading, runs } = useGetTeamRuns()
  const { getGroupStudents, studentsIsLoading, students } = useGetGroupStudents()
  const { inviteStudent, isInviting, error: inviteError } = useInviteStudent()
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [activeTab, setActiveTab] = useState('game')
  const [expandedSections, setExpandedSections] = useState({
    gameSettings: false,
    boms: false,
    expenses: false,
    assets: false,
    employees: false,
    materials: false,
    processes: false
  })
  const [userTeam, setUserTeam] = useState(null)

  useEffect(() => {
    if (!isInitialized || isLoading || !user) {
      return
    }
    console.log("[GAME VIEW] getting game data for gameId: ", gameId)
    getGame(gameId)
  }, [isInitialized, isLoading, user, gameId, getGame])

  // Find user's team and fetch their runs
  useEffect(() => {
    if (game && game.teams && user) {
      const team = game.teams.find(t => 
        t.members.some(m => m.id === user.userId)
      )
      setUserTeam(team)
      
      if (team) {
        console.log("[GAME VIEW] getting team runs for teamId: ", team.id)
        getTeamRuns(gameId, team.id)
      }
    }
  }, [game, user, gameId, getTeamRuns])

  useEffect(() => {
    if (showInviteModal && game?.groupId && user?.userId) {
      console.log("[GAME VIEW] getting group students for groupId: ", game.groupId)
      getGroupStudents(game.groupId, gameId, user.userId)
    }
  }, [showInviteModal, game?.groupId, gameId, user?.userId, getGroupStudents])

  const handleBack = () => {
    const slug = user?.institution?.slug
    navigate(`/mxrep/${slug}/student-panel/my-games`)
  }

  const handleDashboardClick = (runId) => {
    const slug = user?.institution?.slug
    navigate(`/mxrep/${slug}/dashboard/${gameId}/${runId}`)
  }

  const handleInviteStudent = () => {
    setShowInviteModal(true)
  }

  const handleInviteSubmit = async (studentId) => {
    if (!userTeam?.id) {
      return
    }
    
    const result = await inviteStudent(userTeam.id, studentId)
    if (result.success) {
      setShowInviteModal(false)
      // Refresh game data to get updated team
      getGame(gameId)
    }
  }

  const handleInviteCancel = () => {
    setShowInviteModal(false)
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
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
    } else if (status === 'paused') {
      return 'bg-yellow-100 text-yellow-800'
    } else {
      return 'bg-slate-100 text-slate-800'
    }
  }

  const getRunStatusIcon = (status) => {
    if (status === 'in-progress') {
      return <PlayCircle className="h-4 w-4 text-green-600" />
    } else if (status === 'completed') {
      return <CheckCircle2 className="h-4 w-4 text-gray-600" />
    } else if (status === 'paused') {
      return <Pause className="h-4 w-4 text-yellow-600" />
    }
    return null
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
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {userTeam && (
              <Button 
                onClick={handleInviteStudent}
                variant="outline"
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

      <div className='max-w-7xl mx-auto'>
        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="game">Game</TabsTrigger>
            <TabsTrigger value="runs">Runs</TabsTrigger>
          </TabsList>

          <TabsContent value="game" className="space-y-4">
            {/* Game Description */}
            {game.description && (
              <Card className="border-slate-200">
                <CardContent className="pt-6">
                  <p className="text-slate-600">{game.description}</p>
                </CardContent>
              </Card>
            )}
          
          {/* Teams List */}
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4" />
                Teams
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {!game.teams || game.teams.length === 0 ? (
                <div className="text-sm text-slate-500">No teams yet</div>
              ) : (
                <>
                  {/* User's Team First */}
                  {userTeam && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-900">{userTeam.name}</span>
                        <span className="text-xs text-blue-600 font-medium">Your Team</span>
                      </div>
                      <div className="space-y-1">
                        {userTeam.members.map((member) => (
                          <div key={member.id} className="text-sm text-left">
                            <span className="text-slate-900">{member.firstNames} {member.lastNames}</span>
                            <span className="text-slate-500 ml-2">({member.email})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Other Teams */}
                  {game.teams.filter(t => t.id !== userTeam?.id).map((team) => (
                    <div key={team.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="text-sm font-medium text-slate-900 mb-2">{team.name}</div>
                      <div className="space-y-1">
                        {team.members.map((member) => (
                          <div key={member.id} className="text-sm text-left">
                            <span className="text-slate-700">{member.firstNames} {member.lastNames}</span>
                            <span className="text-slate-500 ml-2">({member.email})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* No Team Warning */}
                  {!userTeam && (
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <span className="text-sm text-amber-800 font-medium">You are not part of any team yet</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

            {/* Game Configuration Section */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Game Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {game.configuration ? (
                  <>
                    {/* Game Settings */}
                    <div className="border-b border-slate-100">
                      <button
                        type="button"
                        onClick={() => toggleSection('gameSettings')}
                        className="w-full flex items-center justify-between py-3 text-left hover:bg-slate-50 rounded-lg px-2 -mx-2"
                      >
                        <div className="flex items-center gap-2">
                          <Gamepad2 className="h-4 w-4 text-slate-600" />
                          <span className="font-medium text-slate-900">Game Settings</span>
                        </div>
                        {expandedSections.gameSettings ? (
                          <ChevronUp className="h-4 w-4 text-slate-600" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-600" />
                        )}
                      </button>
                      {expandedSections.gameSettings && (
                        <div className="pb-3 px-2 space-y-2">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-slate-500">Game Code: </span>
                              <div className="flex items-center gap-2 mt-1">
                                <Hash className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-900 font-medium font-mono">{game.code}</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-slate-500">Status: </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(game.status)}`}>
                                {game.status}
                              </span>
                            </div>
                            {game.configuration.initialCapital !== undefined && (
                              <div>
                                <span className="text-slate-500">Initial Capital: </span>
                                <span className="text-slate-900 font-medium">${game.configuration.initialCapital?.toLocaleString()}</span>
                              </div>
                            )}
                            {game.configuration.gameDurationMonths !== undefined && (
                              <div>
                                <span className="text-slate-500">Duration: </span>
                                <span className="text-slate-900 font-medium">{game.configuration.gameDurationMonths} months</span>
                              </div>
                            )}
                            {game.configuration.name && (
                              <div className="col-span-2">
                                <span className="text-slate-500">Configuration Name: </span>
                                <span className="text-slate-900 font-medium">{game.configuration.name}</span>
                              </div>
                            )}
                            {game.configuration.description && (
                              <div className="col-span-2">
                                <span className="text-slate-500">Description: </span>
                                <span className="text-slate-900">{game.configuration.description}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* BOMs Section */}
                    {game.configuration?.availableBOMIds && game.configuration.availableBOMIds.length > 0 && (
                      <div className="border-b border-slate-100">
                        <button
                          type="button"
                          onClick={() => toggleSection('boms')}
                          className="w-full flex items-center justify-between py-3 text-left hover:bg-slate-50 rounded-lg px-2 -mx-2"
                        >
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-slate-600" />
                            <span className="font-medium text-slate-900">Available BOMs ({game.configuration.availableBOMIds.length})</span>
                          </div>
                          {expandedSections.boms ? (
                            <ChevronUp className="h-4 w-4 text-slate-600" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-slate-600" />
                          )}
                        </button>
                        {expandedSections.boms && (
                          <div className="pb-3 px-2 space-y-2">
                            {game.configuration.availableBOMIds.map((bom, index) => (
                              <div key={bom._id || bom.id || index} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="font-medium text-slate-900 text-sm">{bom.name}</p>
                                {bom.description && (
                                  <p className="text-xs text-slate-600 mt-1">{bom.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Expenses Section */}
                    {game.configuration?.availableExpenseIds && game.configuration.availableExpenseIds.length > 0 && (
                      <div className="border-b border-slate-100">
                        <button
                          type="button"
                          onClick={() => toggleSection('expenses')}
                          className="w-full flex items-center justify-between py-3 text-left hover:bg-slate-50 rounded-lg px-2 -mx-2"
                        >
                          <div className="flex items-center gap-2">
                            <Receipt className="h-4 w-4 text-slate-600" />
                            <span className="font-medium text-slate-900">Available Expenses ({game.configuration.availableExpenseIds.length})</span>
                          </div>
                          {expandedSections.expenses ? (
                            <ChevronUp className="h-4 w-4 text-slate-600" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-slate-600" />
                          )}
                        </button>
                        {expandedSections.expenses && (
                          <div className="pb-3 px-2 space-y-2">
                            {game.configuration.availableExpenseIds.map((expense, index) => (
                              <div key={expense._id || expense.id || index} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="font-medium text-slate-900 text-sm">{expense.name}</p>
                                {expense.description && (
                                  <p className="text-xs text-slate-600 mt-1">{expense.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Assets Section */}
                    {game.configuration?.availableAssetIds && game.configuration.availableAssetIds.length > 0 && (
                      <div className="border-b border-slate-100">
                        <button
                          type="button"
                          onClick={() => toggleSection('assets')}
                          className="w-full flex items-center justify-between py-3 text-left hover:bg-slate-50 rounded-lg px-2 -mx-2"
                        >
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-slate-600" />
                            <span className="font-medium text-slate-900">Available Assets ({game.configuration.availableAssetIds.length})</span>
                          </div>
                          {expandedSections.assets ? (
                            <ChevronUp className="h-4 w-4 text-slate-600" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-slate-600" />
                          )}
                        </button>
                        {expandedSections.assets && (
                          <div className="pb-3 px-2 space-y-2">
                            {game.configuration.availableAssetIds.map((asset, index) => (
                              <div key={asset._id || asset.id || index} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="font-medium text-slate-900 text-sm">{asset.name}</p>
                                {asset.description && (
                                  <p className="text-xs text-slate-600 mt-1">{asset.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Employees Section */}
                    {game.configuration?.availableEmployeeIds && game.configuration.availableEmployeeIds.length > 0 && (
                      <div className="border-b border-slate-100">
                        <button
                          type="button"
                          onClick={() => toggleSection('employees')}
                          className="w-full flex items-center justify-between py-3 text-left hover:bg-slate-50 rounded-lg px-2 -mx-2"
                        >
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-slate-600" />
                            <span className="font-medium text-slate-900">Available Employees ({game.configuration.availableEmployeeIds.length})</span>
                          </div>
                          {expandedSections.employees ? (
                            <ChevronUp className="h-4 w-4 text-slate-600" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-slate-600" />
                          )}
                        </button>
                        {expandedSections.employees && (
                          <div className="pb-3 px-2 space-y-2">
                            {game.configuration.availableEmployeeIds.map((employee, index) => (
                              <div key={employee._id || employee.id || index} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="font-medium text-slate-900 text-sm">{employee.name}</p>
                                {employee.description && (
                                  <p className="text-xs text-slate-600 mt-1">{employee.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Materials Section */}
                    {game.configuration?.availableMaterialIds && game.configuration.availableMaterialIds.length > 0 && (
                      <div className="border-b border-slate-100">
                        <button
                          type="button"
                          onClick={() => toggleSection('materials')}
                          className="w-full flex items-center justify-between py-3 text-left hover:bg-slate-50 rounded-lg px-2 -mx-2"
                        >
                          <div className="flex items-center gap-2">
                            <Factory className="h-4 w-4 text-slate-600" />
                            <span className="font-medium text-slate-900">Available Materials ({game.configuration.availableMaterialIds.length})</span>
                          </div>
                          {expandedSections.materials ? (
                            <ChevronUp className="h-4 w-4 text-slate-600" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-slate-600" />
                          )}
                        </button>
                        {expandedSections.materials && (
                          <div className="pb-3 px-2 space-y-2">
                            {game.configuration.availableMaterialIds.map((material, index) => (
                              <div key={material._id || material.id || index} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="font-medium text-slate-900 text-sm">{material.name}</p>
                                {material.description && (
                                  <p className="text-xs text-slate-600 mt-1">{material.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Processes Section */}
                    {game.configuration?.availableProcessIds && game.configuration.availableProcessIds.length > 0 && (
                      <div className="border-b border-slate-100 last:border-0">
                        <button
                          type="button"
                          onClick={() => toggleSection('processes')}
                          className="w-full flex items-center justify-between py-3 text-left hover:bg-slate-50 rounded-lg px-2 -mx-2"
                        >
                          <div className="flex items-center gap-2">
                            <Settings className="h-4 w-4 text-slate-600" />
                            <span className="font-medium text-slate-900">Available Processes ({game.configuration.availableProcessIds.length})</span>
                          </div>
                          {expandedSections.processes ? (
                            <ChevronUp className="h-4 w-4 text-slate-600" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-slate-600" />
                          )}
                        </button>
                        {expandedSections.processes && (
                          <div className="pb-3 px-2 space-y-2">
                            {game.configuration.availableProcessIds.map((process, index) => (
                              <div key={process._id || process.id || index} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="font-medium text-slate-900 text-sm">{process.name}</p>
                                {process.description && (
                                  <p className="text-xs text-slate-600 mt-1">{process.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Settings className="h-12 w-12 mx-auto mb-3 text-slate-400" />
                    <p>No configuration data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="runs" className="space-y-4">
          
          {!userTeam ? (
            <Card className="border-slate-200">
              <CardContent className="py-8">
                <div className="flex flex-col items-center gap-3 text-center">
                  <AlertCircle className="h-12 w-12 text-amber-400" />
                  <div>
                    <p className="text-slate-900 font-medium">No Team Yet</p>
                    <p className="text-sm text-slate-600 mt-1">You need to be part of a team to view runs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : runsIsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader message="Loading runs..." />
            </div>
          ) : !runs || runs.length === 0 ? (
            <Card className="border-slate-200">
              <CardContent className="py-8">
                <div className="flex flex-col items-center gap-3 text-center">
                  <PlayCircle className="h-12 w-12 text-slate-400" />
                  <div>
                    <p className="text-slate-900 font-medium">No Runs Yet</p>
                    <p className="text-sm text-slate-600 mt-1">Your team hasn't started any runs for this game</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {runs.map((run) => (
                <Card key={run.id} className="border-slate-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        {getRunStatusIcon(run.status)}
                        Run #{run.id.slice(-4)}
                      </CardTitle>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(run.status)}`}>
                        {run.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Run Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <span>Period: {run.currentPeriod}/{run.totalPeriods}</span>
                      </div>
                      {run.score !== undefined && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <Trophy className="h-4 w-4 flex-shrink-0" />
                          <span>Score: {run.score.toFixed(1)}</span>
                        </div>
                      )}
                      <div className="text-xs text-slate-500">
                        Started: {formatDateTime(run.startedAt)}
                      </div>
                      {run.endedAt && (
                        <div className="text-xs text-slate-500">
                          Ended: {formatDateTime(run.endedAt)}
                        </div>
                      )}
                    </div>

                    {/* Dashboard Button */}
                    <Button 
                      onClick={() => handleDashboardClick(run.id)}
                      className="w-full mt-2"
                      variant={run.status === 'in-progress' ? 'default' : 'outline'}
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Go to Dashboard
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Invite Student Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <InviteStudent 
              onSubmit={handleInviteSubmit}
              onCancel={handleInviteCancel}
              isInviting={isInviting}
              availableStudents={students}
              currentTeamSize={userTeam?.members?.length || 0}
              currentTeamMemberIds={userTeam?.members?.map(m => m.id) || []}
              maxTeamSize={4}
            />
            {inviteError && (
              <div className="px-6 pb-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{inviteError}</AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Game
