import React from "react";
import useBalance from "@/hooks/sims/project/useBalance";

function Balance({ project }) {
  const balance = useBalance(project);

  return <div>Balance</div>;
}

export default Balance;
