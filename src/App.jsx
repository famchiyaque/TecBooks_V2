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
import CostTable from "./pages/dashboard/CostTable";
import CustomExcelBuilder from "./pages/CustomExcelBuilder";
import Forecasts from "./pages/sims/Forecasts";
import Investments from "./pages/sims/Investments";
import ProjectFeasibility from "./pages/sims/ProjectFeasibility";
import RequireAuth from "./sims/project-feasibility/pages/RequireAuth.jsx";
import ProgramsPortal from "./sims/project-feasibility/pages/ProgramsPortal.jsx";
import ProgramProjects from "./sims/project-feasibility/pages/ProgramProjects.jsx";
import ProjectCostTable from "./sims/project-feasibility/pages/ProjectCostTable.jsx";
import NewProgram from "./sims/project-feasibility/pages/NewProgram.jsx";
import { StagingProvider } from "./sims/project-feasibility/staging/StagingContext.jsx";
import Login from "./pages/Login";
import { OrientationProvider } from "./contexts/PortraitContext";
import { NavigationProvider } from "./contexts/NavigationContext";
import { AuthProvider } from "./contexts/AuthContext";
import GlobalSidebar from "./components/global/GlobalSidebar";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  console.log("app loaded");

  return (
    <OrientationProvider>
      <Router>
        <ScrollToTop />
        <AuthProvider>
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
              <Route path="/modules/cost-table" element={<CostTable />} />
              <Route path="/modules/custom-excel" element={<CustomExcelBuilder />} />

              <Route path="/mxrep/*" element={<MxRepRouter />} />

              <Route path="/sims" element={<Outlet />}>
                <Route path="project-evaluation" element={<Investments />} />
                <Route path="forecasting" element={<Forecasts />} />
                <Route path="project-feasibility" element={<ProjectFeasibility />}>
                  <Route index element={<Navigate to="programs" replace />} />
                  <Route element={<RequireAuth />}>
                    <Route path="programs" element={<ProgramsPortal />} />
                    <Route
                      path="programs/new"
                      element={
                        <StagingProvider>
                          <NewProgram />
                        </StagingProvider>
                      }
                    />
                    <Route path="programs/:programId" element={<ProgramProjects />} />
                    <Route path="programs/:programId/projects/:projectId" element={<ProjectCostTable />} />
                  </Route>
                </Route>
              </Route>

              <Route path="/login" element={<Login />} />

              <Route path="/faq" element={<FAQ />} />
            </Routes>
          </div>
        </NavigationProvider>
        </AuthProvider>
      </Router>
    </OrientationProvider>
  );
}

export default App;
