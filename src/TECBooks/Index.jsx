import '../styles/general.css'
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Survey from './Survey/Survey'
import { createSurveyStore } from './Survey/store'
import TempUpload from './TempUpload/TempUpload'
import Dashboard from './Dashboard/TECBooks'
import { Provider } from 'react-redux';

function Index() {
    const surveyStore = createSurveyStore()

    return (
        <Routes>
            <Route path="survey" element={
                <Provider store={surveyStore}>
                    <Survey />
                </Provider>
                }  
            />
            <Route path="/template-upload" element={ <TempUpload />} />
            <Route path="/dashboard" element={ <Dashboard /> } />
        </Routes>
    )
}

export default Index