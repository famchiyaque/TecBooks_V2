import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { useGetStudentGame, useGetGroupStudents, useInviteStudent } from '@/MxRep/utils/hooks/student.hooks'
import Loader from '@/Global Components/Loader'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import InviteStudent from '@/MxRep/Forms/Panels/Student/InviteStudent'
import { ArrowLeft, AlertCircle, UserPlus, Users, Calendar, DollarSign, PlayCircle, Hash, Building2, ChevronDown, ChevronUp, Factory, Package, Briefcase, Receipt, Settings } from 'lucide-react'

function Game() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const { user, isLoading, isInitialized } = useAuth()
  const { getStudentGame, gameIsLoading, error, game } = useGetStudentGame()
  const { getGroupStudents, studentsIsLoading, students } = useGetGroupStudents()
  const { inviteStudent, isInviting, error: inviteError } = useInviteStudent()
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    premises: false,
    orderConfig: false,
    machinery: false,
    bom: false,
    employees: false,
    expenses: false
  })

  useEffect(() => {
    if (!isInitialized || isLoading || !user) {
      return
    }
    console.log("[GAME VIEW] getting student game data for gameId: ", gameId)
    getStudentGame(gameId, user.userId)
  }, [isInitialized, isLoading, user, gameId, getStudentGame])

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

  const handleDashboardClick = () => {
    const slug = user?.institution?.slug
    if (game?.run && game.run.id) {
      navigate(`/mxrep/${slug}/dashboard/${gameId}/${game.run.id}`)
    }
  }

  const handleInviteStudent = () => {
    setShowInviteModal(true)
  }

  const handleInviteSubmit = async (studentId) => {
    if (!game?.team?.id) {
      return
    }
    
    const result = await inviteStudent(game.team.id, studentId)
    if (result.success) {
      setShowInviteModal(false)
      // Refresh game data to get updated team
      getStudentGame(gameId, user.userId)
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
            {game.run && game.run.status === 'in-progress' && (
              <Button 
                onClick={handleDashboardClick}
                className="gap-2"
              >
                <PlayCircle className="h-4 w-4" />
                Go to Dashboard
              </Button>
            )}
            {game.team && (
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

      <div className='max-w-7xl mx-auto space-y-4'>
        {/* Team Section - Compact */}
        {game.team && (
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4" />
                Your Team
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <div className="text-sm text-slate-500 mb-2">Team Name: <span className="text-slate-900 font-medium">{game.team.name}</span></div>
              <div className="space-y-1">
                {game.team.members && game.team.members.map((member) => (
                  <div key={member.id} className="text-sm text-left">
                    <span className="text-slate-900">{member.firstNames} {member.lastNames}</span>
                    <span className="text-slate-500 ml-2">({member.email})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Run Section - Minimal */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <PlayCircle className="h-4 w-4" />
              Your Team's Run
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {game.run ? (
              <div className="text-sm">
                <span className="text-slate-600">Status: </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(game.run.status)}`}>
                  {game.run.status}
                </span>
              </div>
            ) : (
              <div className="text-sm text-slate-500">No run started yet</div>
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
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
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
            </div>

            {/* Premises Section */}
            {game.configuration?.premises && (
              <div className="border-b border-slate-100 last:border-0">
                <button
                  onClick={() => toggleSection('premises')}
                  className="w-full flex items-center justify-between py-3 text-left hover:bg-slate-50 rounded-lg px-2 -mx-2"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-slate-600" />
                    <span className="font-medium text-slate-900">Premises</span>
                  </div>
                  {expandedSections.premises ? (
                    <ChevronUp className="h-4 w-4 text-slate-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-600" />
                  )}
                </button>
                {expandedSections.premises && (
                  <div className="pb-3 px-2 space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Area: </span>
                        <span className="text-slate-900">{game.configuration.premises.area} sq ft</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Rent Cost: </span>
                        <span className="text-slate-900">${game.configuration.premises.rentCost?.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Power Capacity: </span>
                        <span className="text-slate-900">{game.configuration.premises.powerCapacity} kW</span>
                      </div>
                      {game.configuration.premises.inflationRate !== undefined && (
                        <div>
                          <span className="text-slate-500">Inflation Rate: </span>
                          <span className="text-slate-900">{(game.configuration.premises.inflationRate * 100).toFixed(2)}%</span>
                        </div>
                      )}
                      {game.configuration.premises.lendingRate !== undefined && (
                        <div>
                          <span className="text-slate-500">Lending Rate: </span>
                          <span className="text-slate-900">{(game.configuration.premises.lendingRate * 100).toFixed(2)}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Order Config Section */}
            {game.configuration?.orderConfig && (
              <div className="border-b border-slate-100 last:border-0">
                <button
                  onClick={() => toggleSection('orderConfig')}
                  className="w-full flex items-center justify-between py-3 text-left hover:bg-slate-50 rounded-lg px-2 -mx-2"
                >
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-slate-600" />
                    <span className="font-medium text-slate-900">Order Configuration</span>
                  </div>
                  {expandedSections.orderConfig ? (
                    <ChevronUp className="h-4 w-4 text-slate-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-600" />
                  )}
                </button>
                {expandedSections.orderConfig && (
                  <div className="pb-3 px-2 space-y-2">
                    <div className="text-sm text-slate-500 mb-2">
                      Product Type: <span className="text-slate-900 font-medium">{game.configuration.orderConfig.productType}</span>
                    </div>
                    <div className="text-sm text-slate-500 mb-2">
                      Initial Orders: <span className="text-slate-900 font-medium">{game.configuration.orderConfig.initialOrders}</span>
                    </div>
                    {game.configuration.orderConfig.demandRate && (
                      <div>
                        <p className="text-sm text-slate-500 mb-2">Monthly Demand Rate:</p>
                        <div className="space-y-1">
                          {Object.entries(game.configuration.orderConfig.demandRate).map(([month, rate]) => (
                            <div key={month} className="flex justify-between text-sm">
                              <span className="text-slate-700">{month}:</span>
                              <span className="text-slate-900 font-medium">{(rate * 100).toFixed(1)}%</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                          Total: {Object.values(game.configuration.orderConfig.demandRate).reduce((sum, rate) => sum + (rate * 100), 0).toFixed(1)}%
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Machinery Section */}
            {game.configuration?.machinery && game.configuration.machinery.length > 0 && (
              <div className="border-b border-slate-100 last:border-0">
                <button
                  onClick={() => toggleSection('machinery')}
                  className="w-full flex items-center justify-between py-3 text-left hover:bg-slate-50 rounded-lg px-2 -mx-2"
                >
                  <div className="flex items-center gap-2">
                    <Factory className="h-4 w-4 text-slate-600" />
                    <span className="font-medium text-slate-900">Machinery ({game.configuration.machinery.length})</span>
                  </div>
                  {expandedSections.machinery ? (
                    <ChevronUp className="h-4 w-4 text-slate-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-600" />
                  )}
                </button>
                {expandedSections.machinery && (
                  <div className="pb-3 px-2 space-y-2">
                    <div className="space-y-1">
                      {game.configuration.machinery.map((item, index) => (
                        <div key={index} className="text-sm text-slate-900">
                          • {item.name || item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* BOM Section */}
            {game.configuration?.boms && game.configuration.boms.length > 0 && (
              <div className="border-b border-slate-100 last:border-0">
                <button
                  onClick={() => toggleSection('bom')}
                  className="w-full flex items-center justify-between py-3 text-left hover:bg-slate-50 rounded-lg px-2 -mx-2"
                >
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-slate-600" />
                    <span className="font-medium text-slate-900">BOMs ({game.configuration.boms.length})</span>
                  </div>
                  {expandedSections.bom ? (
                    <ChevronUp className="h-4 w-4 text-slate-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-600" />
                  )}
                </button>
                {expandedSections.bom && (
                  <div className="pb-3 px-2 space-y-2">
                    <div className="space-y-1">
                      {game.configuration.boms.map((item, index) => (
                        <div key={index} className="text-sm text-slate-900">
                          • {item.productName || item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Employees Section */}
            {game.configuration?.employees && game.configuration.employees.length > 0 && (
              <div className="border-b border-slate-100 last:border-0">
                <button
                  onClick={() => toggleSection('employees')}
                  className="w-full flex items-center justify-between py-3 text-left hover:bg-slate-50 rounded-lg px-2 -mx-2"
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-slate-600" />
                    <span className="font-medium text-slate-900">Employees ({game.configuration.employees.length})</span>
                  </div>
                  {expandedSections.employees ? (
                    <ChevronUp className="h-4 w-4 text-slate-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-600" />
                  )}
                </button>
                {expandedSections.employees && (
                  <div className="pb-3 px-2 space-y-2">
                    <div className="space-y-1">
                      {game.configuration.employees.map((item, index) => (
                        <div key={index} className="text-sm text-slate-900">
                          • {item.name || item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Expenses Section */}
            {game.configuration?.expenses && game.configuration.expenses.length > 0 && (
              <div>
                <button
                  onClick={() => toggleSection('expenses')}
                  className="w-full flex items-center justify-between py-3 text-left hover:bg-slate-50 rounded-lg px-2 -mx-2"
                >
                  <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-slate-600" />
                    <span className="font-medium text-slate-900">Expenses ({game.configuration.expenses.length})</span>
                  </div>
                  {expandedSections.expenses ? (
                    <ChevronUp className="h-4 w-4 text-slate-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-600" />
                  )}
                </button>
                {expandedSections.expenses && (
                  <div className="pb-3 px-2 space-y-2">
                    <div className="space-y-1">
                      {game.configuration.expenses.map((item, index) => (
                        <div key={index} className="text-sm text-slate-900">
                          • {item.name || item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
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
              currentTeamSize={game?.team?.members?.length || 0}
              currentTeamMemberIds={game?.team?.members?.map(m => m.id) || []}
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
