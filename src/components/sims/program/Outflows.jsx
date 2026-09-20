import React, { useMemo } from "react";
import useOutflows from "@/hooks/sims/project/useOutflows";
import TableContainer from "@/components/global/TableContainer";
import ServicesTable from "./expenses/ServicesTable";

function Outflows({ project }) {
  const {
    years,
    servicesCatalog,
    rawMaterialRows,
    salaryRows,
    servicesYearRow,
    fixedAssetRows,
    financingRows,
    totalOutflowRows,
  } = useOutflows(project?.cbm ?? {});

  const columns = useMemo(
    () => [
      { key: "concept", label: "" },
      ...years.map((year) => ({
        key: String(year),
        label: String(year),
        align: "right",
        type: "currency",
      })),
    ],
    [years],
  );

  const sections = useMemo(
    () => [
      {
        id: "raw-materials",
        title: "Raw Materials",
        defaultExpanded: true,
        rows: rawMaterialRows,
      },
      {
        id: "salaries",
        title: "Salaries",
        defaultExpanded: true,
        rows: salaryRows,
      },
      {
        id: "services",
        title: "Services",
        titleTooltip:
          "The catalog is the monthly breakdown. Total Services below is the annual cash outflow (monthly × 12, inflated after year 0).",
        defaultExpanded: true,
        preamble: <ServicesTable services={servicesCatalog} embedded />,
        rows: servicesYearRow,
      },
      {
        id: "fixed-assets",
        title: "Fixed Assets",
        defaultExpanded: true,
        rows: fixedAssetRows,
      },
      {
        id: "financing",
        title: "Financing",
        titleTooltip:
          "Working capital sizes the loan at year 0. Amortization and interest are cash leaving. Loan Balance is the year-end remaining principal.",
        defaultExpanded: true,
        rows: financingRows,
      },
    ],
    [
      rawMaterialRows,
      salaryRows,
      servicesCatalog,
      servicesYearRow,
      fixedAssetRows,
      financingRows,
    ],
  );

  return (
    <div className="flex flex-col mt-3 p-3">
      <p className="mb-3 text-sm text-slate-500">
        Where money leaves this project: operating purchases and payroll,
        services, asset purchases, and loan payments. Black rows are totals
        or financing identities; they are not added again in Total Outflows.
      </p>

      <TableContainer
        columns={columns}
        sections={sections}
        footerRows={totalOutflowRows}
        layout="fixed"
      />
    </div>
  );
}

export default Outflows;
