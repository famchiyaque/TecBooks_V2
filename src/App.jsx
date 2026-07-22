import "./App.css";
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom";
import React from "react";
import RotateMessage from "./components/global/RotateMessage";
import HomePage from "./pages/HomePage";
import FAQ from "./pages/FAQ";
import MxRepRouter from "./MxRep/Routing/Router";
import Dashboard from "./pages/dashboard/Index";
import TemplateSelector from "./pages/TemplateSelector";
import TemplateUpload from "./pages/TemplateUpload";
import CustomExcelBuilder from "./pages/CustomExcelBuilder";
import Forecasts from "./pages/sims/Forecasts";
import Investments from "./pages/sims/Investments";
import { OrientationProvider } from "./components/global/PortraitContext";
import { NavigationProvider } from "./contexts/NavigationContext";
import GlobalSidebar from "./components/global/GlobalSidebar";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  console.log("app loaded");

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

              <Route path="/dashboard/*" element={<Dashboard />} />

              <Route path="/modules/templates" element={<TemplateSelector />} />
              <Route path="/modules/templates/upload" element={<TemplateUpload />} />
              <Route path="/modules/custom-excel" element={<CustomExcelBuilder />} />

              <Route path="/mxrep/*" element={<MxRepRouter />} />

              <Route path="/sims" element={<Outlet />}>
                <Route path="project-evaluation" element={<Investments />} />
                <Route path="forecasting" element={<Forecasts />} />
              </Route>

              <Route path="/faq" element={<FAQ />} />
            </Routes>
          </div>
        </NavigationProvider>
      </Router>
    </OrientationProvider>
  );
}

export default App;
