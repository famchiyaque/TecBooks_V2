import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { useCreateGame } from '@/MxRep/utils/hooks/professor.hooks'
import Loader from '@/components/global/Loader'
import { Button } from '@/components/ui/button'
import CreateGameForm from '@/MxRep/Forms/Panels/Professor/CreateGame'
import { ArrowLeft, X } from 'lucide-react'

function CreateGame() {
  const navigate = useNavigate()
  const { user, isLoading, isInitialized } = useAuth()
  const { createGame, isCreating } = useCreateGame()

  const handleBack = () => {
    const slug = user?.institution?.slug
    navigate(`/mxrep/${slug}/professor-panel/manage-games`)
  }

  const handleSubmit = async (data) => {
    console.log("Creating game with data:", data)
    
    const result = await createGame(data)

    if (result.success) {
      alert('Game created successfully!')
      handleBack()
    } else {
      alert(`Failed to create game: ${result.error}`)
    }
  }

  if (!isInitialized || isLoading) {
    return <Loader message="Loading session..." />
  }

  if (!user) {
    return <div>Not authenticated</div>
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
              <h1 className="text-3xl font-bold text-slate-900">Create New Game</h1>
              <p className="text-slate-600 mt-1">
                Set up a new simulation game for your students
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              onClick={handleBack}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 mt-6" />
      </div>

      <div className='max-w-5xl mx-auto'>
        {/* Form Section */}
        <CreateGameForm 
          onSubmit={handleSubmit}
          isCreating={isCreating}
        />
      </div>
    </div>
  )
}

export default CreateGame