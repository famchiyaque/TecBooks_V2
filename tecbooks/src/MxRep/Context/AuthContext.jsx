import React, { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

function getAuthToken() {
  try {
    // get token from params
  } catch (e) {
    // no token
  }
}

export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    // const [error, setError] = useState(false)

    const navigate = useNavigate()

    const verifyToken = () => {
      
    }

    const processToken = () => {

    }
  
    // useEffect to call /auth/me from backend
    // receive JWT in parameters
    // convert into context object
    // useEffect(() => {
    //   const authToken = getAuthToken()

    //   try {
    //     const response = fetch("http://localhost:3050/auth/me", {
    //       method: "POST",
          
    //     })
    //     if (!response) navigate('/mxrep/sign-in?error=no-response')

    //     const verifiedToken = JSON.parse(response)
    //     setAuthData(response)
    //   } catch (e) {
    //     console.error("Error validating auth token: ", e)
    //     navigate('/mxrep/sign-in?error=expired-token')
    //   } finally {
    //     setIsLoading(false)
    //   }
    // }, [])

    useEffect(() => {

    }, [])

    const exampleAuthContext = {
        email: "jimmy@john.com",
        name: "Jimothan John",
        type: "student",
        status: false,
        institution: "Hogwarts",
        slug: "hogwarts",
        expiry: null
    }
    
    return (
      <AuthContext.Provider value={{ authData, isLoading }}>
        {children}
      </AuthContext.Provider>
    );
  };
  