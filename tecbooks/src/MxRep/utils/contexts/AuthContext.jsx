import React, { createContext, useContext, useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { authService } from '@/MxRep/utils/services/auth.service'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate()
    const location = useLocation()

    const [user, setUserData] = useState(null)
    const [token, setToken] = useState(null)
    const [status, setStatus] = useState(false)
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

      setUserData(JSON.parse(storedUser))
      setToken(storedToken)
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

      console.log("User object in verify: ", user)

      // check that session hasn't expired
      const now = Date.now() / 1000
      console.log("user expiration: ", user.expiration)
      console.log("now: ", now)
      if (user.expiration && user.expiration < now) {
        const result = await refreshSession()
        if (!result.success) logout(result.message)
      }
    }

    const logout = (reason) => {
      console.log("[LOGOUT FUNC]")
      setUserData(null)
      setToken(null)
      setStatus(false)
      localStorage.removeItem('tecbooks-user')
      localStorage.removeItem('tecbooks-token')
      console.log("navigating to login")
      window.location.href = `/mxrep/auth/login${reason ? `?error=${reason}` : ""}`
      // navigate(`/mxrep/auth/login${reason ? `?error=${reason}` : ""}`);
    }

    useEffect(() => {
      if (isPublicRoute()) return;
      if (!user || !token) initiateSession();
    }, [location.pathname]);

    useEffect(() => {
      if (isPublicRoute()) return;
      if (user && token) verifyCurrentSession();
    }, [user, token, location.pathname]);   
    
    return (
      <AuthContext.Provider value={{ user, token, status, isLoading, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  