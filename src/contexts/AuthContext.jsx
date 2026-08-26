import React, { createContext, useContext, useState } from 'react'
import { useClerk } from '@clerk/react'
import { logoutRequest } from '@/api/auth.api'

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
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  })

  const login = (safeUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser))
    setUser(safeUser)
  }

  const logout = async () => {
    try {
      await logoutRequest()
    } catch (err) {
      console.error('logout request failed', err)
    }
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
    await signOut()
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
