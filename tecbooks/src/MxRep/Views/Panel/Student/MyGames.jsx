import React, { useEffect, useState, useMemo } from 'react'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { useGetStudentGames } from '@/MxRep/utils/hooks/student.hooks'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import CardGame from '@/MxRep/Components/Panels/Professor/CardGame'
import JoinGameForm from '@/MxRep/Forms/Panels/Student/JoinGame'
import Loader from '@/Global Components/Loader'
import { useNavigate } from 'react-router-dom'
import { Filter, Settings, AlertCircle, Gamepad2, Plus } from 'lucide-react'

function MyGames() {
  const navigate = useNavigate()
  const { user, isLoading, isInitialized } = useAuth()
  const { games, gamesIsLoading, error, getStudentGames } = useGetStudentGames()
  const [showJoinForm, setShowJoinForm] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [showActiveOnly, setShowActiveOnly] = useState(true)

  useEffect(() => {
    if (!isInitialized || isLoading || !user) {
      return
    }

    console.log("[MY GAMES] getting student games, user: ", user)
    getStudentGames(user.userId)
  }, [isInitialized, isLoading, user, getStudentGames])

  // Filter games based on active status
  const filteredGames = useMemo(() => {
    if (!games) return []
    if (!showActiveOnly) return games
    return games.filter(game => game.status === 'active')
  }, [games, showActiveOnly])

  const handleGameClick = (game) => {
    const slug = user.institution?.slug
    navigate(`/mxrep/${slug}/student-panel/my-games/${game.id}`)
  }

  const handleJoinGame = async (code) => {
    setIsJoining(true)
    console.log("Joining game with code:", code)
    
    // TODO: Call API to join game
    // const result = await joinGame(code)
    
    // Simulate API call
    setTimeout(() => {
      setIsJoining(false)
      setShowJoinForm(false)
      alert(`Successfully joined game with code: ${code}`)
      // Refresh games list
      getStudentGames(user.userId)
    }, 1000)
  }

  if (!isInitialized || isLoading) {
    return <Loader message="Loading session..." />
  }

  if (!user) {
    return <div>Not authenticated</div>
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className='text-left'>
            <h1 className="text-3xl font-bold text-slate-900">My Games</h1>
            <p className="text-slate-600 mt-1">
              View and participate in your simulation games
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setShowJoinForm(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Join Game
            </Button>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 mt-6" />
      </div>

      {/* Content Section */}
      <div className="space-y-6">
        {/* Loading State */}
        {gamesIsLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader message="Loading games..." />
          </div>
        )}

        {/* Error State */}
        {error && !gamesIsLoading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading games: {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Filter Toggle and Games Count */}
        {!gamesIsLoading && !error && games && games.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-600">
              Showing {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''}
              {showActiveOnly && games.length > filteredGames.length && (
                <span className="text-slate-400 ml-1">
                  ({games.length - filteredGames.length} inactive hidden)
                </span>
              )}
            </p>
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setShowActiveOnly(true)}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  showActiveOnly
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setShowActiveOnly(false)}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  !showActiveOnly
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!gamesIsLoading && !error && filteredGames.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Gamepad2 className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {showActiveOnly ? 'No active games' : 'No games yet'}
            </h3>
            <p className="text-slate-600 text-center mb-6 max-w-sm">
              {showActiveOnly 
                ? 'You have no active games at the moment. Switch to "All" to see inactive games.'
                : 'You haven\'t joined any games yet. Use the join code from your professor to get started.'
              }
            </p>
          </div>
        )}

        {/* Games Grid */}
        {!gamesIsLoading && filteredGames.length > 0 && (
          <div className="flex flex-wrap gap-6">
            {filteredGames.map((game) => (
              <div key={game.id} className="w-[calc(33.333%-16px)] min-w-[300px]">
                <CardGame 
                  game={game}
                  onClick={() => handleGameClick(game)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Join Game Modal */}
      {showJoinForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <JoinGameForm 
              onSubmit={handleJoinGame}
              onCancel={() => setShowJoinForm(false)}
              isJoining={isJoining}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default MyGames
