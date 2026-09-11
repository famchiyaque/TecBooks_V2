import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import {
  Alert,
  Box,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import Construction from "@mui/icons-material/Construction";
import Outflows from "@/components/sims/program/Outflows";
import Income from "@/components/sims/program/Income";
import Ratios from "@/components/sims/program/Ratios";
import CashFlow from "@/components/sims/program/CashFlow";
import useFeasibilityModel from "@/hooks/sims/project/useFeasibilityModel";
import { PageTour } from "@/tours/PageTour";
import TourButton from "@/components/global/TourButton";
import { HORIZON_YEARS } from "../constants";
import {
  findProgramProject,
  projectDisplayName,
} from "../model/programExtractors";
import { usePrograms } from "./ProgramsContext.jsx";
import {
  costTableEditsSlice,
  operatingExpenseEditsSlice,
  financialResultEditsSlice,
  taxesEditsSlice,
  cashFlowEditsSlice,
  outflowEditsSlice,
} from "@/store/costTable.store";

const TABS = [
  // { id: "premises", label: "Premises" },
  { id: "inflows", label: "Inflows" },
  { id: "outflows", label: "Outflows" },
  { id: "income-statement", label: "Income Statement" },
  { id: "cash-flows", label: "Cash Flows" },
  { id: "balance", label: "Balance Sheet" },
  { id: "ratios", label: "Ratios" },
];

const LIVE_TAB_IDS = new Set([
  "inflows",
  "outflows",
  "income-statement",
  "cash-flows",
]);

const projectDashboardTour = new PageTour([
  {
    element: "#project-dashboard-tabs",
    popover: {
      title: "Financial statements",
      description:
        "Switch between Inflows, Outflows, Income Statement, Cash Flows, Balance Sheet and Ratios.",
    },
  },
  {
    element: "#project-dashboard-content",
    popover: {
      title: "Tab contents",
      description:
        "Inflows, Outflows, Income Statement and Cash Flows load this project's tables. Balance Sheet and Ratios are placeholders for now.",
    },
  },
]);

// const PREMISE_ROWS = [
//   "Exchange rate at close (USD)",
//   "National leading rate",
//   "National inflation",
//   "ISR rate",
//   "PTU rate",
//   "Direct product cost %",
//   "Indirect product cost %",
//   "Sales expense %",
//   "Administration %",
// ];

const BALANCE_ROWS = ["Activo", "Pasivo", "Capital", "Total"];

const RATIO_ROWS = ["Current ratio", "Quick ratio", "Debt to equity", "ROA"];

const PLACEHOLDER_TABS = {
  // premises: { rows: PREMISE_ROWS, years: HORIZON_YEARS, blank: true },
  balance: { rows: BALANCE_ROWS, years: HORIZON_YEARS.slice(0, 4) },
  ratios: { rows: RATIO_ROWS, years: HORIZON_YEARS.slice(0, 4) },
};

function MockStatement({ title, rows, years, blank = false }) {
  return (
    <Box sx={{ mt: 2 }}>
      {!blank && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Construction sx={{ color: "#c77800" }} />
          <Typography sx={{ color: "#073a5a" }}>
            {title} — under construction
          </Typography>
        </Box>
      )}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Concept</TableCell>
            {years.map((year) => (
              <TableCell key={year} align="right" sx={{ fontWeight: 700 }}>
                {year}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row}>
              <TableCell>{row}</TableCell>
              {years.map((year) => (
                <TableCell key={year} align="right">
                  —
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

function ProjectDashboard() {
  const { programId, projectId } = useParams();
  const { programs, status } = usePrograms();
  const [tab, setTab] = useState(0);
  const { program, project } = findProgramProject(
    programs,
    programId,
    projectId,
  );

  // Shared by Cost Table + Operating Expenses + Financial Result + Taxes +
  // Profit Summary so an edit in one is instantly visible in the others
  // (RF-54-07/RF-55/RF-56/RF-57) - fresh store per project so nothing leaks
  // when navigating the sidebar. Separate slices (not one) so a custom row
  // added to one table isn't also summed into another's total. Hook must
  // run before the early returns below.
  const editsStore = React.useMemo(
    () =>
      configureStore({
        reducer: {
          [costTableEditsSlice.name]: costTableEditsSlice.reducer,
          [operatingExpenseEditsSlice.name]: operatingExpenseEditsSlice.reducer,
          [financialResultEditsSlice.name]: financialResultEditsSlice.reducer,
          [taxesEditsSlice.name]: taxesEditsSlice.reducer,
          [cashFlowEditsSlice.name]: cashFlowEditsSlice.reducer,
          [outflowEditsSlice.name]: outflowEditsSlice.reducer,
        },
      }),
    [project?.id],
  );

  if (status === "loading") return null;

  if (status === "error") {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Couldn't load the programs.</Alert>
      </Box>
    );
  }

  if (!program || !project) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="warning">Project not found.</Alert>
      </Box>
    );
  }

  const activeTab = TABS[tab];

  return (
    <Box sx={{ p: 4, textAlign: "left" }}>
      <Typography variant="overline" sx={{ color: "#073a5a" }}>
        {program.name}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "#073a5a", mb: 0 }}
        >
          {projectDisplayName(project)}
        </Typography>
        <TourButton tour={projectDashboardTour} />
      </Box>

      <Tabs
        id="project-dashboard-tabs"
        value={tab}
        onChange={(_, next) => setTab(next)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        {TABS.map((item) => (
          <Tab key={item.id} label={item.label} />
        ))}
      </Tabs>

      <Box id="project-dashboard-content">
        <Box sx={{ mt: 2 }}>
          <Provider store={editsStore}>
            <TabContent
              activeTab={activeTab}
              programId={programId}
              projectId={projectId}
              project={project}
            />
          </Provider>
        </Box>
      </Box>
    </Box>
  );
}

function TabContent({ activeTab, programId, projectId, project }) {
  const placeholder = PLACEHOLDER_TABS[activeTab.id];
  const { data: cbm, isPending, isError } = useFeasibilityModel(
    LIVE_TAB_IDS.has(activeTab.id) ? project.gameId : undefined,
  );
  const projectWithCbm = { ...project, cbm };

  if (placeholder) {
    return (
      <MockStatement
        key={`${programId}-${projectId}-${activeTab.id}`}
        title={activeTab.label}
        rows={placeholder.rows}
        years={placeholder.years}
        blank={placeholder.blank}
      />
    );
  }

  if (!project.gameId) {
    return (
      <Alert severity="warning">
        This project has no game id, so its tables cannot load from the database.
      </Alert>
    );
  }

  if (isPending) return <Typography sx={{ mt: 2 }}>Loading project data…</Typography>;

  if (isError || !cbm) {
    return (
      <Alert severity="error">Couldn&apos;t load this project&apos;s rows from the server.</Alert>
    );
  }

  if (activeTab.id === "inflows") return <Income project={projectWithCbm} />;
  if (activeTab.id === "outflows") return <Outflows project={projectWithCbm} />;
  if (activeTab.id === "income-statement") return <Ratios project={projectWithCbm} />;
  if (activeTab.id === "cash-flows") return <CashFlow project={projectWithCbm} />;

  return (
    <MockStatement
      key={`${programId}-${projectId}-${activeTab.id}`}
      title={activeTab.label}
      rows={BALANCE_ROWS}
      years={HORIZON_YEARS.slice(0, 4)}
    />
  );
}

export default ProjectDashboard;
