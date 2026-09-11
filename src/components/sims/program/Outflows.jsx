import React, { useLayoutEffect, useRef, useState, useMemo } from "react";
import AdminExpensesTable from "./expenses/AdminExpensesTable";
import InvestmentTable from "./expenses/InvestmentTable";
import ServicesTable from "./expenses/ServicesTable";
import useOutflows from "@/hooks/sims/project/useOutflows";
import ProductionCostTable from "./income/ProductionCostTable";
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
    productionCosts,
    totalFinancialExpenses,
  } = useOutflows(cbm ?? {});

  const baseYear = useMemo(() => {
    const productionYears = Object.keys(productionCosts?.total ?? {})
      .map(Number)
      .sort((a, b) => a - b);
    return productionYears[0] ?? years[0];
  }, [productionCosts, years]);

  return (
    <div className="flex flex-col mt-3 p-3">
      <CollapsibleSection title="ProductionCost" defaultExpanded>
        <ProductionCostTable productionCosts={productionCosts} />
      </CollapsibleSection>

      <CollapsibleSection title="Administrative Expenses">
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
          baseYear={baseYear}
        />
      </CollapsibleSection>
    </div>
  );
}

export default Outflows;
