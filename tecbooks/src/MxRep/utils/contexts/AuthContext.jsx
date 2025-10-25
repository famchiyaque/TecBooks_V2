import React, { createContext, useContext, useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { authService } from '@/MxRep/utils/services/auth.service'
import { decodeToken } from "./utils"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const location = useLocation()
    const navigate = useNavigate()

    const [user, setUserData] = useState(null)
    const [token, setToken] = useState(null)
    const [decodedToken, setDecodedToken] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const publicRoutes = ['/mxrep/auth', '/mxrep/registry', '/mxrep/logout']

    const isPublicRoute = () => {
      return publicRoutes.some(route => location.pathname.startsWith(route))
    }

    const initiateSession = () => {
      console.log('[INITIATING SESSION]')
      const storedUser = localStorage.getItem('tecbooks-user')
      const storedToken = localStorage.getItem('tecbooks-token')

      if (!storedUser || !storedToken) {
        console.log("logging out from initiate session")
        logout("No session detected")
        return
      }

      const decoded = decodeToken(storedToken)
      if (!decoded) {
        logout("Invalid token")
        return
      }

      setUserData(JSON.parse(storedUser))
      setToken(storedToken)
      setDecodedToken(decoded)
    }

    const refreshSession = async () => {
      console.log('[REFRESHING SESSION]')
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
      console.log('[VERIFYING SESSION]')
      if (!user || !token) {
        console.log("logging out from verify session")
        logout("No session detected")
        return
      }

      if (!decodedToken) {
        logout("Invalid token")
        return
      }

      const now = Date.now() / 1000
      if (decodedToken.exp && decodedToken.exp < now) {
        const result = await refreshSession()
        if (!result.success) logout(result.message)
      }
    }

    const logout = (reason) => {
      console.log("[LOGOUT FUNC]")
      setUserData(null)
      setToken(null)
      setDecodedToken(null)
      setStatus(false)
      localStorage.removeItem('tecbooks-user')
      localStorage.removeItem('tecbooks-token')
      navigate('/mxrep/auth/login')
      // window.location.href = `/mxrep/auth/login${reason ? `?error=${reason}` : ""}`
    }

    useEffect(() => {
      if (isPublicRoute()) {
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      if (!user || !token) {
        initiateSession()
      } else {
        setIsLoading(false)
      }
    }, [location.pathname])

    useEffect(() => {
      if (isPublicRoute()) return
      if (!user || !token) {
        logout("No session detected")
        return
      }
      (async () => {
        await verifyCurrentSession();
      })();
    }, [user, token, location.pathname]) 
    
    return (
      <AuthContext.Provider value={{ user, token, isLoading, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  