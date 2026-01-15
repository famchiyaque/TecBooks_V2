import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null)

  useEffect(() => {
    // Check if auth data is in local storage when the component mounts
    const storedAuth = localStorage.getItem('auth')
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth))
    }
  }, [])

  const login = async (username) => {
    try {
      const loginData = {
        user: username,
      }

      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      })

      const result = await response.json()

      if (result && result.Username && result.Pass) {
        setAuth({ username: result.Keyword })
        localStorage.setItem('auth', JSON.stringify({ username: result.Keyword }))
        return true
      } else {
        return false
      }
    } catch (e) {
      console.error('Login failed', e)
      return false
    }
  }

  const logout = () => {
    setAuth(null)
    localStorage.removeItem('auth')
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
