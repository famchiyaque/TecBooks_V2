import React, { useLayoutEffect, useRef, useState } from "react";
import AdminExpensesTable from "./expenses/AdminExpensesTable";
import InvestmentTable from "./expenses/InvestmentTable";
import FinancialExpensesTable from "./expenses/FinancialExpensesTable";
import ServicesTable from "./expenses/ServicesTable";
import getExpenses from "@/api/sims/expenses/getExpenses.service";
import { useQuery } from "@tanstack/react-query";
import useExpenses from "@/hooks/sims/project/useExpenses";
import CollapsibleSection from "@/components/global/CollapsibleSection";

function Expenses() {
  const investmentRef = useRef(null);
  const [investmentHeight, setInvestmentHeight] = useState(null);

  const { isLoading, error, data } = useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses,
  });

  useLayoutEffect(() => {
    const el = investmentRef.current;
    if (!el) return;

    const update = () => setInvestmentHeight(el.offsetHeight);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [data]);

  const { adminExpenses, investment, services, finances } = useExpenses(data);

  return (
    <div className="flex flex-col mt-3 p-3">
      {isLoading && <p>Loading...</p>}
      {error && <p>Error</p>}
      {!isLoading && !error && data && (
        <>
          <CollapsibleSection title="Administrative Expenses" defaultExpanded>
            <AdminExpensesTable years={data.years} expenses={adminExpenses} />
          </CollapsibleSection>

          <CollapsibleSection title="Investment & Services">
            <div className="flex items-start gap-3">
              <div ref={investmentRef}>
                <InvestmentTable items={investment} />
              </div>

              <div
                className="min-w-0 flex-1"
                style={
                  investmentHeight ? { height: investmentHeight } : undefined
                }
              >
                <ServicesTable services={services} />
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Financial Expenses">
            <FinancialExpensesTable years={data.years} items={finances} />
          </CollapsibleSection>
        </>
      )}
    </div>
  );
}

export default Expenses;
