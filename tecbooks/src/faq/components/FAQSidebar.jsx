import React from "react";
import { SiMixpanel } from "react-icons/si";
import { faqData } from "../data/faqData";
import "@/styles/general.css";

function FAQSidebar({
  activeSectionId,
  activeSubsectionId,
  onSectionClick,
  onSubsectionClick,
  onItemClick,
}) {
  return (
    <nav className="sidebar" style={{ height: "100vh", minHeight: "100vh" }}>
      <div className="sidebar-title">
        <div className="title-icon">
          <SiMixpanel className="sidebar-icon" />
        </div>
        <div className="title-content">
          <div className="title-main">FAQ</div>
          <div className="title-sub">Help Center</div>
        </div>
      </div>

      {(() => {
        const filteredSections = faqData.filter(
          (section) =>
            section.id !== "productivity" &&
            section.id !== "forecasts" &&
            section.id !== "project-evaluation"
        );

        return filteredSections.map((section, index) => {
          const SectionIcon = section.icon;
          const isSectionActive = activeSectionId === section.id;

          return (
            <div key={section.id} className="faq-section-container">
              {/* Main Section */}
              <div
                className={`sidebar-entry ${isSectionActive ? "active" : ""}`}
                onClick={() => onSectionClick(section.id)}
              >
                <SectionIcon className="sidebar-icon" />
                <span>{section.title}</span>
              </div>

              {/* Divider between sections */}
              {index !== filteredSections.length - 1 && (
                <div
                  style={{
                    height: "1px",
                    backgroundColor: "#e2e8f0",
                    margin: "0.5rem 1rem",
                  }}
                />
              )}
            </div>
          );
        });
      })()}
    </nav>
  );
}

export default FAQSidebar;
