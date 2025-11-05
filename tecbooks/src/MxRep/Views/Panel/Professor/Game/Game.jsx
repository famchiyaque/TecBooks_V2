import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { useGetGame, useGameActions, useGetTeamsByGame, useGetStudentsByGroup } from '@/MxRep/utils/hooks/professor.hooks'
import Loader from '@/Global Components/Loader'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, AlertCircle, Settings, Users, Trophy, Calendar, Gamepad2, Building2, Package, Factory, Briefcase, Receipt, ChevronDown, ChevronUp, Hash, Play, Pause, CheckCircle, Trash2, DollarSign } from 'lucide-react'

function Game() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const { user, isLoading, isInitialized } = useAuth()
  const { getGame, gameIsLoading, error, game } = useGetGame()
  const { activateGame, pauseGame, completeGame, deleteGame, isLoading: actionLoading, error: actionError } = useGameActions()
  const { getTeamsByGame, teamsIsLoading, teams } = useGetTeamsByGame()
  const { getStudentsByGroup, studentsIsLoading, students } = useGetStudentsByGroup()
  const [activeTab, setActiveTab] = useState('overview')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    gameSettings: false,
    boms: false,
    expenses: false,
    assets: false,
    employees: false,
    materials: false,
    processes: false
  })

  useEffect(() => {
    if (!isInitialized || isLoading || !user) {
      return
    }
    console.log("[GAME VIEW] getting game data for gameId: ", gameId)
    getGame(gameId)
  }, [isInitialized, isLoading, user, gameId, getGame])

  useEffect(() => {
    if (game && gameId) {
      // Load teams for this game
      getTeamsByGame(gameId)
      
      // Load students from the group
      if (game.groupId) {
        getStudentsByGroup(game.groupId)
      }
    }
  }, [game, gameId, getTeamsByGame, getStudentsByGroup])

  const handleBack = () => {
    const slug = user?.institution?.slug
    navigate(`/mxrep/${slug}/professor-panel/manage-games`)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleActivateGame = async () => {
    if (window.confirm('Are you sure you want to activate this game? Students will be able to access it.')) {
      const result = await activateGame(gameId)
      if (result.success) {
        alert('Game activated successfully!')
        getGame(gameId) // Refresh game data
      } else {
        alert(`Failed to activate game: ${result.error}`)
      }
    }
  }

  const handlePauseGame = async () => {
    if (window.confirm('Are you sure you want to pause this game?')) {
      const result = await pauseGame(gameId)
      if (result.success) {
        alert('Game paused successfully!')
        getGame(gameId)
      } else {
        alert(`Failed to pause game: ${result.error}`)
      }
    }
  }

  const handleCompleteGame = async () => {
    if (window.confirm('Are you sure you want to mark this game as completed? This action cannot be undone.')) {
      const result = await completeGame(gameId)
      if (result.success) {
        alert('Game completed successfully!')
        getGame(gameId)
      } else {
        alert(`Failed to complete game: ${result.error}`)
      }
    }
  }

  const handleDeleteGame = async () => {
    if (window.confirm('⚠️ WARNING: Are you absolutely sure you want to DELETE this game? This will remove all associated data and CANNOT be undone!')) {
      const result = await deleteGame(gameId)
      if (result.success) {
        alert('Game deleted successfully!')
        handleBack()
      } else {
        alert(`Failed to delete game: ${result.error}`)
      }
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
            {game.status === 'draft' && (
              <Button 
                onClick={handleActivateGame}
                disabled={actionLoading}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                <Play className="h-4 w-4" />
                Activate
              </Button>
            )}
            {game.status === 'active' && (
              <>
                <Button 
                  onClick={handlePauseGame}
                  disabled={actionLoading}
                  variant="outline"
                  className="gap-2"
                >
                  <Pause className="h-4 w-4" />
                  Pause
                </Button>
                <Button 
                  onClick={handleCompleteGame}
                  disabled={actionLoading}
                  className="gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Complete
                </Button>
              </>
            )}
            {game.status === 'paused' && (
              <Button 
                onClick={handleActivateGame}
                disabled={actionLoading}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                Resume
              </Button>
            )}
            <Button 
              onClick={handleDeleteGame}
              disabled={actionLoading}
              variant="destructive"
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 mt-6" />
      </div>

      <div className='max-w-7xl mx-auto'>
        {/* Action Error Alert */}
        {actionError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{actionError}</AlertDescription>
          </Alert>
        )}

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
                  <Gamepad2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Runs</p>
                  <p className="text-2xl font-bold text-slate-900">{game.numRuns || 0}</p>
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
                  Game Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Group</p>
                    <p className="text-base font-medium text-slate-900">{game.groupName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Class</p>
                    <p className="text-base font-medium text-slate-900">{game.className || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Institution</p>
                    <p className="text-base font-medium text-slate-900">{game.institutionName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Professor</p>
                    <p className="text-base font-medium text-slate-900">{game.professorName || 'N/A'}</p>
                  </div>
                  {game.startDate && (
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Start Date</p>
                      <p className="text-base font-medium text-slate-900">{formatDate(game.startDate)}</p>
                    </div>
                  )}
                  {game.endDate && (
                    <div>
                      <p className="text-sm text-slate-500 mb-1">End Date</p>
                      <p className="text-base font-medium text-slate-900">{formatDate(game.endDate)}</p>
                    </div>
                  )}
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
                              <span className="text-slate-500">Initial Capital: </span>
                              <span className="text-slate-900 font-medium">${game.configuration.initialCapital?.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Duration: </span>
                              <span className="text-slate-900 font-medium">{game.configuration.gameDurationMonths} months</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Configuration Name: </span>
                              <span className="text-slate-900 font-medium">{game.configuration.name || 'N/A'}</span>
                            </div>
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
                          <div className="pb-3 px-2">
                            <p className="text-sm text-slate-600 mb-2">{game.configuration.availableBOMIds.length} Bill of Materials available for this game</p>
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
                          <div className="pb-3 px-2">
                            <p className="text-sm text-slate-600 mb-2">{game.configuration.availableExpenseIds.length} expenses available for this game</p>
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
                          <div className="pb-3 px-2">
                            <p className="text-sm text-slate-600 mb-2">{game.configuration.availableAssetIds.length} assets available for this game</p>
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
                          <div className="pb-3 px-2">
                            <p className="text-sm text-slate-600 mb-2">{game.configuration.availableEmployeeIds.length} employees available for this game</p>
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
                          <div className="pb-3 px-2">
                            <p className="text-sm text-slate-600 mb-2">{game.configuration.availableMaterialIds.length} materials available for this game</p>
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
                          <div className="pb-3 px-2">
                            <p className="text-sm text-slate-600 mb-2">{game.configuration.availableProcessIds.length} processes available for this game</p>
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

          <TabsContent value="teams">
            <Card className="border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Teams</CardTitle>
                <Button className="gap-2" size="sm">
                  <Users className="h-4 w-4" />
                  Create Team
                </Button>
              </CardHeader>
              <CardContent>
                {teamsIsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader message="Loading teams..." />
                  </div>
                ) : teams && teams.length > 0 ? (
                  <div className="space-y-4">
                    {teams.map((team) => (
                      <Card key={team._id || team.id} className="border-slate-200">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{team.name}</h3>
                              <p className="text-sm text-slate-500">
                                {team.studentIds?.length || team.members?.length || 0} members
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              Manage
                            </Button>
                          </div>
                          {team.members && team.members.length > 0 && (
                            <div className="space-y-1">
                              {team.members.map((member, idx) => (
                                <div key={idx} className="text-sm text-slate-600">
                                  • {member.firstNames} {member.lastNames} ({member.email})
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
                    <Users className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-slate-900 mb-2">No teams yet</h3>
                    <p className="text-slate-600 mb-4">
                      Create teams and assign students from the group
                    </p>
                    <Button className="gap-2">
                      <Users className="h-4 w-4" />
                      Create Your First Team
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Group Students</CardTitle>
              </CardHeader>
              <CardContent>
                {studentsIsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader message="Loading students..." />
                  </div>
                ) : students && students.length > 0 ? (
                  <div className="space-y-2">
                    {students.map((student) => (
                      <div 
                        key={student._id || student.id}
                        className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                            <Users className="h-5 w-5 text-slate-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {student.firstNames} {student.lastNames}
                            </p>
                            <p className="text-sm text-slate-500">{student.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {student.teamName ? (
                            <span className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                              Team: {student.teamName}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-400">Not assigned</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
                    <p className="text-slate-600">
                      No students in this group yet
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Game