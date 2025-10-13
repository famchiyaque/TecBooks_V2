import '../styles/general.css'
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ProjectEvaluator from './Investments/Layout'
import { createProjEvalStore } from './Investments/store'
import Forecaster from './Forecasts/Layout'
import { createForecastStore } from './Forecasts/store'
import { Provider } from 'react-redux';

function Index() {
    const projEvalStore = createProjEvalStore()
    const forecasterStore = createForecastStore()

    return (
        <Routes>
            <Route path="project-evaluation" element={
                <Provider store={projEvalStore}>
                    <ProjectEvaluator />
                </Provider>
                }  
            />
            <Route path="forecasting" element={
                <Provider store={forecasterStore}>
                    <Forecaster />
                </Provider>
                }  
            />
        </Routes>
    )
}

export default Index