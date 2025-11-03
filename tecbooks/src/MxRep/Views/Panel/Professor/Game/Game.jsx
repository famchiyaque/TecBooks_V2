import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { useGetGame } from '@/MxRep/utils/hooks/professor.hooks'
import Loader from '@/Global Components/Loader'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, AlertCircle, Settings, Users, Trophy, Calendar, Gamepad2, Building2, Package, Factory, Briefcase, Receipt, ChevronDown, ChevronUp, Hash } from 'lucide-react'

function Game() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const { user, isLoading, isInitialized } = useAuth()
  const { getGame, gameIsLoading, error, game } = useGetGame()
  const [activeTab, setActiveTab] = useState('overview')
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

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
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
                    <p className="text-base font-medium text-slate-900">{game.groupName || game.groupId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Class</p>
                    <p className="text-base font-medium text-slate-900">{game.className || game.classId || 'N/A'}</p>
                  </div>
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
                      <p className="text-sm font-mono font-medium text-slate-900">{game.code || 'N/A'}</p>
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