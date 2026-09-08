import React from "react";
import { Box } from "@mui/material";
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
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box sx={{ flexShrink: 0 }}>
        <GenericHeader pageName="Project Feasibility Simulation" />
      </Box>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
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
                <Box sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
                  <StagingProvider>
                    <NewProgram />
                  </StagingProvider>
                </Box>
              }
            />
          </Route>
          <Route
            path="expenses"
            element={
              <Box sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
                <Expenses />
              </Box>
            }
          />
        </Routes>
      </Box>
    </Box>
  );
}

export default ProjectFeasibility;
