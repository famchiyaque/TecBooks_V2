import React, { useEffect } from 'react'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { useGetProfessorGames } from '@/MxRep/utils/hooks/professor.hooks'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import CardGame from '@/MxRep/Components/Panels/Professor/CardGame'
import Loader from '@/Global Components/Loader'
import { useNavigate } from 'react-router-dom'
import { Plus, Filter, Settings, AlertCircle, Gamepad2 } from 'lucide-react'

function ManageGames() {
  const navigate = useNavigate()
  const { user, isLoading, isInitialized } = useAuth()
  const { games, gamesIsLoading, error, getProfessorGames } = useGetProfessorGames()

  useEffect(() => {
    if (!isInitialized || isLoading || !user) {
      return
    }

    console.log("[MANAGE GAMES] getting professor games, user: ", user)
    getProfessorGames(user.userId)
  }, [isInitialized, isLoading, user, getProfessorGames])

  const handleGameClick = (game) => {
    const slug = user.institution?.slug
    navigate(`/mxrep/${slug}/professor-panel/manage-games/${game.id}`)
  }

  const navigateToCreateGame = () => {
    const slug = user.institution?.slug
    navigate(`/mxrep/${slug}/professor-panel/create-game`)
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
              Manage your simulation games and track student progress
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon"
              className="h-10 w-10"
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button 
              onClick={navigateToCreateGame}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              New Game
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="h-10 w-10"
            >
              <Settings className="h-4 w-4" />
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

        {/* Empty State */}
        {!gamesIsLoading && !error && games?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Gamepad2 className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No games yet</h3>
            <p className="text-slate-600 text-center mb-6 max-w-sm">
              Create your first simulation game to engage students in hands-on learning
            </p>
            <Button onClick={navigateToCreateGame} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Game
            </Button>
          </div>
        )}

        {/* Games Grid */}
        {!gamesIsLoading && games && games.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-600">
                Showing {games.length} game{games.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex flex-wrap gap-6">
              {games.map((game) => (
                <div key={game.id} className="w-[calc(33.333%-16px)] min-w-[300px]">
                  <CardGame 
                    game={game}
                    onClick={() => handleGameClick(game)}
                    isProfessor={true}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ManageGames