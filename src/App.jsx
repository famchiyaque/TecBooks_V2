import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import RotateMessage from "./Global Components/RotateMessage";
import HomePage from "./HomePage/HomePage";
import MxRepRouter from "./MxRep/Routing/Router";
import TECBooks from "./TECBooks/Index";
import Simulators from "./Sims/Index";
import FAQ from "./faq/index";
import { Navigate } from "react-router-dom";
import { OrientationProvider } from "./Global Components/PortraitContext";

// New unified architecture imports
import Dashboard from "./dashboard/index";
import ExcelTemplates from "./modules/excel-templates/index";

function App() {
  console.log("app loaded");

  return (
    <OrientationProvider>
      <Router>
        <div className="App blue-to-white">
          <RotateMessage />
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} />

            {/* MxRep Module - Educational production simulator */}
            <Route path="/mxrep/*" element={<MxRepRouter />} />

            {/* New Unified Dashboard - Main product */}
            <Route path="/dashboard/*" element={<Dashboard />} />

            {/* Excel Templates Module - Template selection and upload */}
            <Route path="/templates/*" element={<ExcelTemplates />} />

            {/* Legacy TECBooks routes - kept for reference */}
            <Route path="/tecbooks/*" element={<TECBooks />} />

            {/* Independent Simulators */}
            <Route path="/sims/*" element={<Simulators />} />

            {/* FAQ */}
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </div>
      </Router>
    </OrientationProvider>
  );
}

export default App;
