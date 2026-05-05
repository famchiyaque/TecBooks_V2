import React, { useState } from "react";
import "@/styles/production.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Period from "./Period";
import Year from "./Year";
import { MdDashboard, MdCandlestickChart } from "react-icons/md";
import { FaFileInvoiceDollar, FaChartPie, FaRegChartBar } from "react-icons/fa";
import { BiTrendingUp } from "react-icons/bi";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import FAQHelpButton from "@/faq/components/FAQHelpButton";
import { getFAQForRoute } from "@/faq/utils/routeToFAQ";

function SubHeader({
  sidebarVisible,
  setSidebarVisible,
  activeSidebar,
  period,
  year,
  setPeriod,
  setYear,
}) {
  // console.log("year passed: ", year)

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const icons = {
    1: <MdDashboard className="sidebar-icon" />,
    2: <FaFileInvoiceDollar className="sidebar-icon" />,
    3: <FaRegChartBar className="sidebar-icon" />,
    4: <BiTrendingUp className="sidebar-icon" />,
    5: <PrecisionManufacturingIcon className="sidebar-icon" />,
    6: <FaChartPie className="sidebar-icon" />,
  };

  // Map activeSidebar to route names
  const sidebarToRoute = {
    1: "overview",
    2: "statements",
    3: "financial-health",
    4: "forecasts",
    5: "production-line",
    6: "investments",
  };

  const currentRoute = sidebarToRoute[activeSidebar];
  const faqInfo = getFAQForRoute(currentRoute);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        style={{
          backgroundColor: "#0077b6",
          height: "5vh",
          boxShadow: "none",
          color: "white",
        }}
      >
        <Toolbar style={{ justifyContent: "space-between", minHeight: "5vh" }}>
          <div className="header-icon-flex">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleSidebar}
            >
              <MenuIcon />
            </IconButton>

            <div>{icons[activeSidebar]}</div>
          </div>

          <div className="header-icon-flex" style={{ alignItems: "center" }}>
            {activeSidebar == 1 ||
            activeSidebar == 2 ||
            activeSidebar == 3 ||
            activeSidebar == 5 ? (
              <>
                <Period period={period} setPeriod={setPeriod} />
                <Year year={year} setYear={setYear} />
              </>
            ) : (
              ""
            )}
            {faqInfo && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <FAQHelpButton
                  faqSectionId={faqInfo.sectionId}
                  faqItemId={faqInfo.itemId}
                  variant="ghost"
                  className="text-white hover:text-white hover:bg-white/20"
                />
              </div>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default SubHeader;
