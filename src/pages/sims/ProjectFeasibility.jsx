import React from "react";
import GenericHeader from "@/components/global/GenericHeader";
import Expenses from "@/components/sims/program/Expenses";
import RequireAuth from "@/sims/project-feasibility/pages/RequireAuth.jsx";
import ProgramsPortal from "@/sims/project-feasibility/pages/ProgramsPortal.jsx";
import ProgramsWorkspace from "@/sims/project-feasibility/pages/ProgramsWorkspace.jsx";
import ProjectDashboard from "@/sims/project-feasibility/pages/ProjectDashboard.jsx";
import NewProgram from "@/sims/project-feasibility/pages/NewProgram.jsx";
import { StagingProvider } from "@/sims/project-feasibility/staging/StagingContext.jsx";
import { Route, Routes, Navigate } from "react-router-dom";

function ProjectFeasibility() {
  return (
    <>
      <GenericHeader pageName="Project Feasibility Simulation" />
      <Routes>
        <Route index element={<Navigate to="programs" replace />} />

        <Route element={<RequireAuth />}>
          <Route element={<ProgramsWorkspace />}>
            <Route path="programs" element={<ProgramsPortal />} />
            <Route
              path="programs/:programId/:projectId"
              element={<ProjectDashboard />}
            />
          </Route>

          <Route
            path="programs/new"
            element={
              <StagingProvider>
                <NewProgram />
              </StagingProvider>
            }
          />
        </Route>
        <Route path="expenses" element={<Expenses />} />
      </Routes>
    </>
  );
}

export default ProjectFeasibility;
