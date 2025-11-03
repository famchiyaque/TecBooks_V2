import React, { useState } from "react";
import FAQSidebar from "./components/FAQSidebar";
import FAQContentView from "./components/FAQContentView";
import { faqData } from "./data/faqData";
import "@/styles/general.css";

function FAQ() {
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [activeSubsectionId, setActiveSubsectionId] = useState(null);
  const [activeItemId, setActiveItemId] = useState(null);
  const [viewType, setViewType] = useState("default"); // 'default', 'section', 'subsection', 'item'

  const handleSectionClick = (sectionId) => {
    setActiveSectionId(sectionId);
    setActiveSubsectionId(null);
    setActiveItemId(null);
    setViewType("section");
  };

  const handleSubsectionClick = (sectionId, subsectionId) => {
    setActiveSectionId(sectionId);
    setActiveSubsectionId(subsectionId);
    setActiveItemId(null);
    setViewType("subsection");
  };

  const handleCardClick = (itemId) => {
    // Check if this is a Financial Dashboard subsection or another section
    const financialDashboard = faqData.find(
      (s) => s.id === "financial-dashboard"
    );

    // Check if it's a Financial Dashboard subsection
    const isFinancialDashboardSubsection = financialDashboard?.subsections.some(
      (ss) => ss.id === itemId
    );

    if (isFinancialDashboardSubsection) {
      // Show items for this subsection
      setActiveSectionId("financial-dashboard");
      setActiveSubsectionId(itemId);
      setActiveItemId(null);
      setViewType("subsection");
    } else {
      // Check if it's a main section (Productivity, Forecasts, Project Evaluation)
      const isMainSection = faqData.some((s) => s.id === itemId);

      if (isMainSection) {
        // Show subsections for this section
        setActiveSectionId(itemId);
        setActiveSubsectionId(null);
        setActiveItemId(null);
        setViewType("section");
      } else {
        // It's a regular item
        setActiveItemId(itemId);
        setViewType("item");
      }
    }
  };

  const handleItemClick = (itemId) => {
    setActiveItemId(itemId);
    setViewType("item");
  };

  return (
    <div
      className="faq-container"
      style={{ display: "flex", minHeight: "100vh", width: "100vw" }}
    >
      {/* Fixed Sidebar */}
      <aside
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "280px",
          height: "100vh",
          overflowY: "auto",
          zIndex: 10,
          backgroundColor: "white",
        }}
      >
        <FAQSidebar
          activeSectionId={activeSectionId}
          activeSubsectionId={activeSubsectionId}
          onSectionClick={handleSectionClick}
          onSubsectionClick={handleSubsectionClick}
          onItemClick={handleItemClick}
        />
      </aside>

      {/* Main Content Area */}
      <main
        className="view"
        style={{
          marginLeft: "280px",
          width: "calc(100vw - 280px)",
          padding: "2rem",
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
        }}
      >
        <div
          className="faq-content-wrapper"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          <FAQContentView
            viewType={viewType}
            sectionId={activeSectionId}
            subsectionId={activeSubsectionId}
            itemId={activeItemId}
            onItemClick={handleItemClick}
            onCardClick={handleCardClick}
          />
        </div>
      </main>
    </div>
  );
}

export default FAQ;
