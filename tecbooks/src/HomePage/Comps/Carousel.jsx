import React from "react"
import MoreCard from "./MoreCard"
import { MdDashboard } from "react-icons/md"
import { BiTrendingUp } from "react-icons/bi"
import { FaFileInvoiceDollar, FaRegChartBar } from "react-icons/fa"
import AddBusinessIcon from "@mui/icons-material/AddBusiness"

const icons = [
  <MdDashboard />,
  <BiTrendingUp />,
  <FaFileInvoiceDollar />,
  <FaRegChartBar />,
  <AddBusinessIcon />,
];

const titles = [
  "All-Encompassing Dashboard",
  "Productivity KPIs",
  "Organized Finances",
  "Personalized Forecasts",
  "Project Evaluation Sandbox",
];

const subtitles = [
  "Neat and general overview of your business's health, production, and more",
  "Basic metric charts and advanced KPIs",
  "Financial statement, balance sheet, and cashflows with print to PDF",
  "Forecast your sales and compare different statistical methods as well as various other customizations",
  "Generate, record, and compare the value of your potential projects",
];

function Carousel() {

  return (
    <div className="carousel-container">
      <div className="carousel">
        {icons.map((icon, index) => (
          <MoreCard
            key={index}
            icon={icon}
            title={titles[index]}
            subtitle={subtitles[index]}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel