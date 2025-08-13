import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import React, { useContext } from 'react'
import { Provider } from 'react-redux';
import RotateMessage from './Global Components/RotateMessage';
import HomePage from './HomePage/HomePage'
import MxRep from './MxRep/Main'
import TECBooks from './TECBooks/TECBooks'
import Survey from './Survey/Survey'
import { createSurveyStore } from './Survey/store';
import { createForecastStore } from './Sims/Forecasts/store';
import TempUpload from './HomePage/TempUpload'
import ProjEval from './Sims/Investments/Simulator';
import ForecastSim from '@/Sims/Forecasts/Layout';
// import ErrorPage from './Global Components/ErrorPage'
import { Navigate } from 'react-router-dom'
import { OrientationProvider } from './Global Components/PortraitContext';
// import { AuthContext } from './Components/AuthContext'
// import ProtectedRoute from './Components/ProtectedRoute'
// import simData from './Global Components/example_sim_data'
// import { SimDataProvider } from './MxRep/SimDataContext'

function App() {
  console.log("app loaded")
  // const { auth } = useContext(AuthContext)
  const surveyStore = createSurveyStore()
  const forecasterStore = createForecastStore()

  return (
    <OrientationProvider>
      <Router>
        <div className="App blue-to-white"> 
          <RotateMessage />
          <Routes>
            <Route path="/" element={ <Navigate to="/home" /> } />
            <Route path="/home" element={ <HomePage /> } />

            <Route path="/survey" element={
              <Provider store={surveyStore}>
                <Survey />
              </Provider>
              } 
            />
            <Route path="/template-upload" element={ <TempUpload />} />

            <Route path="/mxrep-dashboard/*" element={ 
                // <SimDataProvider>
                  <MxRep />
                // </SimDataProvider>
              } 
            />

              <Route path="/tecbooks/*" element={ <TECBooks /> } />

            <Route path="/project-evaluation-simulator" element={<ProjEval />} />

            <Route path="/sales-forecaster" element={
              <Provider store={forecasterStore}>
                <ForecastSim />
              </Provider>
              }
            />

            {/* <Route path="/error" element={ <ErrorPage /> } /> */}

          </Routes>
        </div>
      </Router>
    </OrientationProvider>
  )
}

export default App