import React from "react";
import "@/styles/production.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Period from "../Dashboard/Period";
import Year from "../Dashboard/Year";
import { iconMap } from "./IconsMap";
import FAQHelpButton from "@/faq/components/FAQHelpButton";
import { useLocation } from "react-router-dom";
import { getFAQForPathname } from "@/faq/utils/routeToFAQ";

function SubHeader({
  sidebarVisible,
  setSidebarVisible,
  activeSidebar,
  period,
  year,
  setPeriod,
  setYear,
}) {
  const location = useLocation();
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Get FAQ info for current route
  const faqInfo = getFAQForPathname(location.pathname);

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

            <div>{iconMap[activeSidebar]}</div>
          </div>

          <div className="header-icon-flex" style={{ alignItems: "center" }}>
            {period &&
            year &&
            (activeSidebar == 1 ||
              activeSidebar == 2 ||
              activeSidebar == 3 ||
              activeSidebar == 5) ? (
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
