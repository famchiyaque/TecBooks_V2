import React, { createContext, useContext, useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { authService } from '@/MxRep/utils/services/auth.service'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

const exampleAuthContext = {
  userId: "use123",
  email: "jimmy@john.com",
  firstNames: "Jimothan the",
  lastNames: "Second John",
  role: "student",
  aStatus: false,
  institution: "Hogwarts",
  slug: "hogwarts",
  expiry: 100000000000
}

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate()
    const location = useLocation()

    const [user, setUserData] = useState(null)
    const [token, setToken] = useState(null)
    const [status, setStatus] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const initiateSession = () => {
      const storedUser = localStorage.getItem('tecbooks-user')
      const storedToken = localStorage.getItem('tecbooks-token')

      if (!storedUser || !storedToken) {
        logout("No session detected")
        return
      }

      setUserData(JSON.parse(storedUser))
      setToken(storedToken)
    }

    const refreshSession = async () => {
      try {
        const data = await authService.refreshToken(user, token)
        setUserData(data.user)
        setToken(data.token)
        return { success: true }
      } catch (e) {
        return { success: false, message: e.message }
      }
    }

    const verifyCurrentSession = async () => {
      if (!storedUser || !storedToken) {
        logout("No session detected")
        return
      }

      // check that session hasn't expired
      const now = Date.now() / 1000
      if (user.expiration && user.expiration < now) {
        const result = await refreshSession()
        if (!result.success) logout(result.message)
      }
    }

    const logout = (reason) => {
      setUserData(null)
      setToken(null)
      setStatus(false)
      localStorage.removeItem('tecbooks-user')
      localStorage.removeItem('tecbooks-token')
      navigate(`/mxrep/auth/login${reason ? `?error=${reason}` : ""}`);
    }

    useEffect(() => {
      let isMounted = true
      ;(async () => {
        setIsLoading(true)
        setStatus(false)
    
        if (!user || !token) initiateSession()
        await verifyCurrentSession()
    
        if (isMounted) {
          setStatus(true)
          setIsLoading(false)
        }
      })()
      return () => { isMounted = false }
    }, [location.pathname])    
    
    return (
      <AuthContext.Provider value={{ user, exampleAuthContext, token, status, isLoading, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  