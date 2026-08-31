import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import React from "react";
import RotateMessage from "./components/global/RotateMessage";
import HomePage from "./pages/HomePage";
import FAQ from "./pages/FAQ";
import MxRepRouter from "./MxRep/Routing/Router";
import Dashboard from "./pages/dashboard/Index";
import TemplateSelector from "./pages/TemplateSelector";
import TemplateUpload from "./pages/TemplateUpload";
import CustomExcelBuilder from "./pages/CustomExcelBuilder";
import Investments from "./pages/sims/Investments";
import ProjectFeasibility from "./pages/sims/ProjectFeasibility";
import Login from "./pages/Login";
import Forecasts from "./pages/sims/Forecasts";
import { OrientationProvider } from "./contexts/PortraitContext";
import { NavigationProvider } from "./contexts/NavigationContext";
import { AuthProvider } from "./contexts/AuthContext";
import GlobalSidebar from "./components/global/GlobalSidebar";
import ScrollToTop from "./components/ScrollToTop";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

function App() {
  console.log("app loaded");

  return (
    <OrientationProvider>
      <Router>
        <ScrollToTop />
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <NavigationProvider>
              <GlobalSidebar />
              <div className="App blue-to-white">
                <RotateMessage />
                <Routes>
                  <Route path="/" element={<Navigate to="/home" />} />
                  <Route path="/home" element={<HomePage />} />

                  <Route path="/dashboard/*" element={<Dashboard />} />

                  <Route
                    path="/modules/templates"
                    element={<TemplateSelector />}
                  />
                  <Route
                    path="/modules/templates/upload"
                    element={<TemplateUpload />}
                  />
                  <Route
                    path="/modules/custom-excel"
                    element={<CustomExcelBuilder />}
                  />

                  <Route path="/mxrep/*" element={<MxRepRouter />} />

                  <Route path="/sims" element={<Outlet />}>
                    <Route
                      path="project-evaluation"
                      element={<Investments />}
                    />
                    <Route path="forecasting" element={<Forecasts />} />
                    <Route
                      path="project-feasibility"
                      element={<ProjectFeasibility />}
                    />
                  </Route>

                  <Route path="/login" element={<Login />} />

                  <Route path="/faq" element={<FAQ />} />
                </Routes>
              </div>
            </NavigationProvider>
          </AuthProvider>
        </QueryClientProvider>
      </Router>
    </OrientationProvider>
  );
}

export default App;
