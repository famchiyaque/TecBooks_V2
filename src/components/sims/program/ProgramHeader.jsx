import React, { useState } from "react";
import GenericHeader from "@/components/global/GenericHeader";
import GenericSubheader from "@/components/global/GenericSubheader";

function ProgramHeader({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header>
      <GenericHeader pageName={"Simulators"} />
      <GenericSubheader
        subheader={"Project Evaluation"}
        onOpenSidebar={() => {
          setIsOpen((prev) => !prev);
        }}
      />
      {/* Overlay Backdrop (Optional: click outside to close) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        />
      )}

      {/* Sliding Sidebar Wrapper */}
      <div
        className={`fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        }`}
      >
        {children(() => setIsOpen(false))}
      </div>
    </header>
  );
}

export default ProgramHeader;
