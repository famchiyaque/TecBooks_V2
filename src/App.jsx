import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import RotateMessage from "./components/global/RotateMessage";
import HomePage from "./HomePage/HomePage";
import MxRepRouter from "./MxRep/Routing/Router";
import Simulators from "./Sims/Index";
import FAQ from "./faq/index";
import { Navigate } from "react-router-dom";
import { OrientationProvider } from "./components/global/PortraitContext";

// New unified architecture imports
import Dashboard from "./dashboard/index";
import ExcelTemplates from "./modules/excel-templates/index";
import CustomExcelBuilder from "./modules/survey/Survey";
import { createSurveyStore } from "./modules/survey/store";
import { Provider } from "react-redux";

// Global Navigation
import { NavigationProvider } from "./components/GlobalNavigation/NavigationContext";
import GlobalSidebar from "./components/GlobalNavigation/GlobalSidebar";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  console.log("app loaded");
  const customExcelStore = createSurveyStore();

  return (
    <OrientationProvider>
      <Router>
        <ScrollToTop />
        <NavigationProvider>
          <GlobalSidebar />
          <div className="App blue-to-white">
            <RotateMessage />
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<HomePage />} />

              {/* New Unified Dashboard - Main product */}
              <Route path="/dashboard/*" element={<Dashboard />} />

              <Route path="/modules/templates/*" element={<ExcelTemplates />} />
              <Route path="/modules/custom-excel/*" element={
                <Provider store={customExcelStore}>
                  <CustomExcelBuilder />
                </Provider>
              } />

              {/* Excel Templates Module - Template selection and upload */}
              {/* <Route path="/templates/*" element={<ExcelTemplates />} /> */}

              {/* Survey Module - In-app questionnaire */}
              {/* <Route path="/survey" element={
                <Provider store={surveyStore}>
                  <Survey />
                </Provider>
              } /> */}

              {/* MxRep Module - Educational production simulator */}
              <Route path="/mxrep/*" element={<MxRepRouter />} />

              {/* Legacy Routes - Old implementations accessible at /legacy/ */}
              {/* <Route path="/legacy/tecbooks/*" element={<TECBooks />} /> */}
              {/* <Route path="/legacy/mxrep/*" element={<MxRepRouter />} /> */}

              {/* Backward compatibility - redirect old paths to legacy */}
              {/* <Route path="/tecbooks/*" element={<Navigate to="/legacy/tecbooks" replace />} /> */}

              {/* Independent Simulators */}
              <Route path="/sims/*" element={<Simulators />} />

              {/* FAQ */}
              <Route path="/faq" element={<FAQ />} />
            </Routes>
          </div>
        </NavigationProvider>
      </Router>
    </OrientationProvider>
  );
}

export default App;
