// ProtectedRoute.js
import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from './AuthContext'

const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(AuthContext)
  console.log("from inside protected route, this is the auth: ", auth)

  if (!auth) {
    return <Navigate to="/login" />
  }

  return children;
};

export default ProtectedRoute
