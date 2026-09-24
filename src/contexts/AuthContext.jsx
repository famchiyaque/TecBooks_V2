import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useClerk } from '@clerk/react'
import { logoutRequest } from '@/sims/project-feasibility/api/auth.api'
import { resetSessionInvalidGuard, setSessionInvalidHandler } from '@/utils/worker.util'

const AuthContext = createContext()

const STORAGE_KEY = 'tecbooks_user'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const { signOut } = useClerk()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  })

  const login = useCallback((safeUser) => {
    resetSessionInvalidGuard()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser))
    setUser(safeUser)
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutRequest()
    } catch (err) {
      console.error('logout request failed', err)
    }
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
    queryClient.clear()
    await signOut()
  }, [queryClient, signOut])

  useEffect(() => {
    setSessionInvalidHandler(async () => {
      await logout()
      navigate('/login', { replace: true })
    })
    return () => setSessionInvalidHandler(null)
  }, [logout, navigate])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
