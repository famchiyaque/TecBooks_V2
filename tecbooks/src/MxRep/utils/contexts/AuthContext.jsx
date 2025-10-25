import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react"
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
    const [isInitialized, setIsInitialized] = useState(false)
    
    // Ref to prevent multiple simultaneous initializations
    const isInitializing = useRef(false)

    const publicRoutes = ['/mxrep/auth', '/mxrep/registry', '/mxrep/logout']

    const isPublicRoute = useCallback(() => {
      return publicRoutes.some(route => location.pathname.startsWith(route))
    }, [location.pathname])

    const logout = useCallback((reason) => {
      console.log("[LOGOUT]", reason || "User logged out")
      setUserData(null)
      setToken(null)
      setDecodedToken(null)
      setIsInitialized(false)
      localStorage.removeItem('tecbooks-user')
      localStorage.removeItem('tecbooks-token')
      navigate(`/mxrep/auth/login${reason ? `?error=${encodeURIComponent(reason)}` : ""}`)
    }, [navigate])

    const initiateSession = useCallback(() => {
      console.log('[INITIATING SESSION]')
      const storedUser = localStorage.getItem('tecbooks-user')
      const storedToken = localStorage.getItem('tecbooks-token')

      if (!storedUser || !storedToken) {
        console.log("No stored session - logging out")
        logout("No session detected")
        return false
      }

      const decoded = decodeToken(storedToken)
      if (!decoded) {
        console.log("Invalid token - logging out")
        logout("Invalid token")
        return false
      }

      console.log('[SESSION INITIATED] Setting user and token')
      setUserData(JSON.parse(storedUser))
      setToken(storedToken)
      setDecodedToken(decoded)
      return true
    }, [logout])

    const refreshSession = useCallback(async () => {
      console.log('[REFRESHING SESSION]')
      try {
        const data = await authService.refreshToken(token, user)
        console.log('[SESSION REFRESHED]')
        setUserData(data.user)
        setToken(data.token)
        const decoded = decodeToken(data.token)
        setDecodedToken(decoded)
        
        // Update localStorage
        localStorage.setItem('tecbooks-user', JSON.stringify(data.user))
        localStorage.setItem('tecbooks-token', data.token)
        
        return { success: true }
      } catch (e) {
        console.error('[REFRESH FAILED]', e.message)
        return { success: false, message: e.message }
      }
    }, [token, user])

    const verifyCurrentSession = useCallback(async () => {
      console.log('[VERIFYING SESSION]')
      
      if (!user || !token) {
        console.log("No user/token during verification")
        return false
      }

      if (!decodedToken) {
        console.log("No decoded token during verification")
        return false
      }

      const now = Date.now() / 1000
      if (decodedToken.exp && decodedToken.exp < now) {
        console.log('[TOKEN EXPIRED] Attempting refresh')
        const result = await refreshSession()
        if (!result.success) {
          logout(result.message)
          return false
        }
      }
      
      console.log('[SESSION VERIFIED]')
      return true
    }, [user, token, decodedToken, refreshSession, logout])

    // Main effect: handles initialization and verification
    useEffect(() => {
      // Prevent concurrent initializations
      if (isInitializing.current) {
        console.log('[SKIPPING] Already initializing')
        return
      }

      const initializeAuth = async () => {
        console.log('[AUTH INIT] Starting for route:', location.pathname)
        setIsLoading(true)
        isInitializing.current = true

        try {
          // Public routes don't need authentication
          if (isPublicRoute()) {
            console.log('[PUBLIC ROUTE] No auth needed')
            setIsLoading(false)
            setIsInitialized(true)
            return
          }

          // If we don't have user/token yet, try to load from localStorage
          if (!user || !token) {
            console.log('[NO SESSION] Attempting to initiate from localStorage')
            const sessionLoaded = initiateSession()
            
            if (!sessionLoaded) {
              // initiateSession handles logout, just mark as done
              setIsLoading(false)
              setIsInitialized(true)
              return
            }
            
            // Session initiated successfully, but state hasn't updated yet
            // The next effect run will verify it
            setIsLoading(false)
            setIsInitialized(true)
            return
          }

          // We have user and token, verify the session
          console.log('[SESSION EXISTS] Verifying...')
          const isValid = await verifyCurrentSession()
          
          if (isValid) {
            console.log('[AUTH COMPLETE] Session is valid')
          } else {
            console.log('[AUTH FAILED] Session validation failed')
            // Verification failed but didn't logout (edge case)
            // This shouldn't normally happen, but handle it gracefully
            logout("Session validation failed")
            return
          }
          
          setIsLoading(false)
          setIsInitialized(true)
        } catch (error) {
          console.error('[AUTH ERROR]', error)
          setIsLoading(false)
          setIsInitialized(true)
        } finally {
          isInitializing.current = false
        }
      }

      initializeAuth()
    }, [location.pathname, user, token, isPublicRoute, initiateSession, verifyCurrentSession])
    
    return (
      <AuthContext.Provider value={{ user, token, status, isLoading, isInitialized, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  