import React, { useLayoutEffect, useRef, useState } from "react";
import AdminExpensesTable from "./expenses/AdminExpensesTable";
import InvestmentTable from "./expenses/InvestmentTable";
import ServicesTable from "./expenses/ServicesTable";
import useOutflows from "@/hooks/sims/project/useOutflows";
import AmortizationInterestTable from "./income/AmortizationInterestTable";
import FinancialExpensesTable from "./income/FinancialExpensesTable";
import CollapsibleSection from "@/components/global/CollapsibleSection";

function Outflows({ project }) {
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
  }, [project]);

  const cbm = project?.cbm;
  const years = cbm?.timeline?.years ?? [];

  const {
    adminExpenses,
    investment,
    services,
    amortizationInterests,
    totalFinancialExpenses,
  } = useOutflows(cbm ?? {});

  return (
    <div className="flex flex-col mt-3 p-3">
      <CollapsibleSection title="Administrative Expenses" defaultExpanded>
        <AdminExpensesTable years={years} expenses={adminExpenses} />
      </CollapsibleSection>

      <CollapsibleSection title="Investment & Services">
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
      </CollapsibleSection>

      <CollapsibleSection title="Amortization & Interest">
        <AmortizationInterestTable
          amortizationInterests={amortizationInterests}
          baseYear={years[0]}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Financial Expenses">
        <FinancialExpensesTable
          totalFinancialExpenses={totalFinancialExpenses}
          baseYear={years[0]}
        />
      </CollapsibleSection>
    </div>
  );
}

export default Outflows;
