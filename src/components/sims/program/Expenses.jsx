import React, { useLayoutEffect, useRef, useState } from "react";
import AdminExpensesTable from "./expenses/AdminExpensesTable";
import InvestmentTable from "./expenses/InvestmentTable";
import FinancialExpensesTable from "./expenses/FinancialExpensesTable";
import ServicesTable from "./expenses/ServicesTable";

import {
  SAMPLE_YEARS,
  SAMPLE_ADMIN_EXPENSES,
  SAMPLE_INVESTMENT,
  SAMPLE_FINANCIAL_EXPENSES,
  SAMPLE_SERVICES,
} from "@/api/sims/expenses/getExpenses.service";

function Expenses({
  years = SAMPLE_YEARS,
  adminExpenses = SAMPLE_ADMIN_EXPENSES,
  investment = SAMPLE_INVESTMENT,
  financialExpenses = SAMPLE_FINANCIAL_EXPENSES,
  services = SAMPLE_SERVICES,
}) {
  const investmentRef = useRef(null);
  const [investmentHeight, setInvestmentHeight] = useState(null);

  useLayoutEffect(() => {
    const el = investmentRef.current;
    if (!el) return;

    const update = () => setInvestmentHeight(el.offsetHeight);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="flex flex-col gap-3 mt-3">
      <AdminExpensesTable years={years} expenses={adminExpenses} />

      <div className="flex items-start gap-3">
        <div ref={investmentRef}>
          <InvestmentTable items={investment} />
        </div>

        <div
          className="min-w-0 flex-1"
          style={investmentHeight ? { height: investmentHeight } : undefined}
        >
          <ServicesTable services={services} />
        </div>
      </div>

      <FinancialExpensesTable years={years} items={financialExpenses} />
    </div>
  );
}

export default Expenses;
