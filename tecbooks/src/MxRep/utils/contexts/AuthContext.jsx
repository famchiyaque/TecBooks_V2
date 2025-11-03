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

    // Role checking utilities
    const hasRole = useCallback((requiredRole) => {
      if (!user) return false
      return user.role === requiredRole
    }, [user])

    const isAdmin = useCallback(() => {
      if (!user) return false
      return user.role === 'admin' || (user.role === 'professor' && user.aStatus === true)
    }, [user])

    const isProfessor = useCallback(() => {
      if (!user) return false
      return user.role === 'professor'
    }, [user])

    const isStudent = useCallback(() => {
      if (!user) return false
      return user.role === 'student'
    }, [user])

    const isSuperAdmin = useCallback(() => {
      if (!user) return false
      return user.role === 'super-admin'
    }, [user])

    const checkRoleBasedAccess = useCallback(() => {
      // Only check role-based access for authenticated routes
      if (!user || isPublicRoute()) {
        return true
      }

      const pathname = location.pathname
      
      // Check if accessing a panel route (handle both with and without trailing slash)
      if (pathname.includes('/student-panel')) {
        if (!isStudent()) {
          console.log('[ROLE CHECK FAILED] Student panel access denied for role:', user.role)
          return false
        }
      } else if (pathname.includes('/professor-panel')) {
        if (!isProfessor()) {
          console.log('[ROLE CHECK FAILED] Professor panel access denied for role:', user.role)
          return false
        }
      } else if (pathname.includes('/admin-panel')) {
        if (!isAdmin()) {
          console.log('[ROLE CHECK FAILED] Admin panel access denied for role:', user.role)
          return false
        }
      } else if (pathname.includes('/super-admin-panel')) {
        if (!isSuperAdmin()) {
          console.log('[ROLE CHECK FAILED] Super-admin panel access denied for role:', user.role)
          return false
        }
      }

      return true
    }, [user, location.pathname, isPublicRoute, isStudent, isProfessor, isAdmin, isSuperAdmin])

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

    // const refreshSession = useCallback(async () => {
    //   console.log('[REFRESHING SESSION]')
    //   try {
    //     const data = await authService.refreshToken(token, user)
    //     console.log('[SESSION REFRESHED]')
    //     setUserData(data.user)
    //     setToken(data.token)
    //     const decoded = decodeToken(data.token)
    //     setDecodedToken(decoded)
        
    //     // Update localStorage
    //     localStorage.setItem('tecbooks-user', JSON.stringify(data.user))
    //     localStorage.setItem('tecbooks-token', data.token)
        
    //     return { success: true }
    //   } catch (e) {
    //     console.error('[REFRESH FAILED]', e.message)
    //     return { success: false, message: e.message }
    //   }
    // }, [token, user])

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
        console.log('[TOKEN EXPIRED] logging out')
        logout("Session expired")
        // const result = await refreshSession()
        // if (!result.success) {
        //   logout(result.message)
        //   return false
        // }
      }
      
      console.log('[SESSION VERIFIED]')
      return true
    }, [user, token, decodedToken, logout])

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
          
          if (!isValid) {
            console.log('[AUTH FAILED] Session validation failed')
            // Verification failed but didn't logout (edge case)
            // This shouldn't normally happen, but handle it gracefully
            logout("Session validation failed")
            return
          }
          
          // Check role-based access after session is verified
          console.log('[CHECKING ROLE ACCESS]')
          const hasAccess = checkRoleBasedAccess()
          
          if (!hasAccess) {
            console.log('[ACCESS DENIED] Redirecting to appropriate panel')
            // Redirect to user's appropriate panel based on their role
            let redirectPath = null
            
            if (user.role === 'super-admin') {
              redirectPath = '/mxrep/super-admin-panel'
            } else if (user.institution?.slug) {
              const userPanelRoute = user.role === 'student' ? 'student-panel' 
                                   : user.role === 'professor' ? 'professor-panel'
                                   : user.role === 'admin' ? 'admin-panel'
                                   : null
              if (userPanelRoute) {
                redirectPath = `/mxrep/${user.institution.slug}/${userPanelRoute}`
              }
            }
            
            if (redirectPath) {
              navigate(redirectPath)
            } else {
              logout("Invalid role or missing institution data")
              return
            }
            setIsLoading(false)
            setIsInitialized(true)
            return
          }
          
          console.log('[AUTH COMPLETE] Session is valid and access granted')
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
    }, [location.pathname, user, token, isPublicRoute, initiateSession, verifyCurrentSession, checkRoleBasedAccess, navigate])
    
    return (
      <AuthContext.Provider value={{ 
        user, 
        token, 
        isLoading, 
        isInitialized, 
        logout,
        hasRole,
        isAdmin,
        isProfessor,
        isStudent,
        isSuperAdmin
      }}>
        {children}
      </AuthContext.Provider>
    );
  };
  