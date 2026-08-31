import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import GenericHeader from "@/components/global/GenericHeader";
import GenericSubheader from "@/components/global/GenericSubheader";
import { useAuth } from "@/contexts/AuthContext";
import Expenses from "@/components/sims/program/Expenses";
import Button from "@mui/material/Button";

function ProjectFeasibility() {
  const { user } = useAuth();
  const [showNavside, setShowNavside] = useState(false);
  const [activePage, setActivePage] = useState("home");

  const pages = [
    { content: <div>Home</div>, title: "home" },
    { content: <Expenses />, title: "expenses" },
  ];

  return (
    <>
      <GenericHeader pageName="Project Feasibility Simulation" />
      <GenericSubheader
        subheader={"Define Your Business Structure"}
        onOpenSidebar={() => setShowNavside((prev) => !prev)}
      />
      {showNavside && (
        <ul>
          {pages.map((p, idx) => (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setActivePage(p.title);
              }}
              key={idx}
            >
              {p.title}
            </Button>
          ))}
        </ul>
      )}
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#073a5a" }}>
          Project Feasibility Simulation
        </Typography>
        <Typography sx={{ mt: 1, opacity: 0.8 }}>
          Bienvenido{user?.first_name ? `, ${user.first_name}` : ""}. Simulador
          en construcción.
        </Typography>
        {pages.filter((c) => c.title == activePage)[0].content}
      </Box>
    </>
  );
}

export default ProjectFeasibility;
