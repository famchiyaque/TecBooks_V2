import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import React from 'react'
import RotateMessage from './Global Components/RotateMessage';
import HomePage from './HomePage/HomePage'
import MxRep from './MxRep/Main'
import TECBooks from './TECBooks/Index'
import Simulators from './Sims/Index'
import { Navigate } from 'react-router-dom'
import { OrientationProvider } from './Global Components/PortraitContext';

function App() {
  console.log("app loaded")

  return (
    <OrientationProvider>
      <Router>
        <div className="App blue-to-white"> 
          <RotateMessage />
          <Routes>
            <Route path="/" element={ <Navigate to="/home" /> } />
            <Route path="/home" element={ <HomePage /> } />

            <Route path="/mxrep/*" element={ <MxRep /> } />

            <Route path="/tecbooks/*" element={ <TECBooks /> } />

            <Route path ="/sims/*" element={ <Simulators /> } />

            {/* <Route path="/error" element={ <ErrorPage /> } /> */}

          </Routes>
        </div>
      </Router>
    </OrientationProvider>
  )
}

export default App