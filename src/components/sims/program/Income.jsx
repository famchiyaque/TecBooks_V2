import React from "react";
import useIncome from "@/hooks/sims/project/useIncome";

function Income({ project }) {
  const income = useIncome(project);

  return <div>Income</div>;
}

export default Income;
