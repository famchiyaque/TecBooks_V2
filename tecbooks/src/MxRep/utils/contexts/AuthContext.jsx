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
          //const payload = verifiedToken.payload
    //     setAuthData(payload)
    //   } catch (e) {
    //     console.error("Error validating auth token: ", e)
    //     navigate('/mxrep/sign-in?error=expired-token')
    //   } finally {
    //     setIsLoading(false)
    //   }
    // }, [])

    useEffect(() => {
      setIsLoading(false)
      console.log("INSIDE AUTH CONTEXT")
    }, [])

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
    
    return (
      <AuthContext.Provider value={{ authData, exampleAuthContext, isLoading }}>
        {children}
      </AuthContext.Provider>
    );
  };
  