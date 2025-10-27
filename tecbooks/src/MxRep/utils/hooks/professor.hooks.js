import { useState, useCallback } from 'react'
import { professorService } from '@/MxRep/utils/services/professor.service'

export const useGetProfessorGames = () => {
    const [gamesIsLoading, setGamesIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [games, setGames] = useState([])

    const getProfessorGames = useCallback(async (professorId) => {
        setGamesIsLoading(true)
        setError(null)

        try {
            const response = await professorService.getProfessorGames(professorId)
            console.log("Response from getProfessorGames: ", response)
            setGames(response.data)
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setGamesIsLoading(false)
        }
    }, [])

    return {
        getProfessorGames,
        gamesIsLoading,
        error,
        games,
        setError
    }
}

export const useGetGame = () => {
    const [gameIsLoading, setGameIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [game, setGame] = useState(null)

    const getGame = useCallback(async (gameId) => {
        setGameIsLoading(true)
        setError(null)

        try {
            const response = await professorService.getGame(gameId)
            console.log("Response from getGame: ", response)
            setGame(response.data)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setGameIsLoading(false)
        }
    }, [])

    return {
        getGame,
        gameIsLoading,
        error,
        game,
        setGame,
        setError
    }
}

export const useCreateGame = () => {
    const [isCreating, setIsCreating] = useState(false)
    const [error, setError] = useState(null)

    const createGame = useCallback(async (gameData) => {
        setIsCreating(true)
        setError(null)

        try {
            const response = await professorService.createGame(gameData)
            console.log("Response from createGame: ", response)
            return { success: true, data: response.data }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setIsCreating(false)
        }
    }, [])

    return {
        createGame,
        isCreating,
        error,
        setError
    }
}

