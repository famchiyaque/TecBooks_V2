import "@/styles/homepage.css";
import React, { useEffect, useState } from "react";
import "@/styles/investments.css";
import {
  LayoutGrid,
  FileText,
  BarChart3,
  TrendingUp,
  Factory,
  PieChart,
} from "lucide-react";
import ProgramHeader from "@/components/sims/program/ProgramHeader";
import Sidebar from "@/components/sims/program/Sidebar";
import Expenses from "@/components/sims/program/expenses/Expenses";

function ProgramSimContent() {
  const [activeTab, setActiveTab] = useState("Overview");

  const navItems = [
    { name: "Overview", icon: LayoutGrid, content: <div>Overview</div> },
    {
      name: "Financial Statement",
      icon: FileText,
      content: <div>Financial</div>,
    },
    { name: "Gastos", icon: BarChart3, content: <Expenses /> },
    { name: "Forecasts", icon: TrendingUp, content: <div>Forecasts</div> },
    { name: "Production Line", icon: Factory, content: <div>Production</div> },
    { name: "Investments", icon: PieChart, content: <div>Investments</div> },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main>
      <ProgramHeader>
        {(close) => (
          <Sidebar
            close={close}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            navItems={navItems}
          />
        )}
      </ProgramHeader>
      <div className="w-[100%] min-h-[105vh] mx-6 my-3 flex justify-around items-start gap-3">
        {navItems.filter((item) => item.name == activeTab)[0].content}
      </div>
    </main>
  );
}

export default ProgramSimContent;
