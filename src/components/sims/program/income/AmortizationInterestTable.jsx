import React, { useMemo } from "react";
import TableContainer from "@/components/global/TableContainer";

/**
 * AmortizationInterestTable component
 *
 * Renders the yearly amortization/interest schedule for the project's financing.
 *
 * @param {Object} amortizationInterests - Object containing amortization/interest data.
 * @returns {JSX.Element} The rendered table.
 */
function AmortizationInterestTable({ amortizationInterests, baseYear }) {
  const yearCount = amortizationInterests?.yearAmortization?.length ?? 0;

  const columns = useMemo(
    () => [
      { key: "concept", label: "" },
      ...Array.from({ length: yearCount }, (_, i) => ({
        key: String(i),
        label: `${i + baseYear}`,
        align: "right",
        type: "currency",
      })),
    ],
    [yearCount],
  );

  const rows = useMemo(() => {
    const amortization = { concept: "Amortization" };
    const interest = { concept: "Interest" };
    const total = { concept: "Total Payment", rowVariant: "total" };

    for (let i = 0; i < yearCount; i += 1) {
      const yearAmortization =
        amortizationInterests?.yearAmortization?.[i] ?? 0;
      const yearInterest = amortizationInterests?.yearInterest?.[i] ?? 0;

      amortization[String(i)] = yearAmortization;
      interest[String(i)] = yearInterest;
      total[String(i)] = yearAmortization + yearInterest;
    }

    return [amortization, interest, total];
  }, [yearCount, amortizationInterests]);

  return (
    <TableContainer
      title="Amortization & Interest"
      columns={columns}
      rows={rows}
    />
  );
}

export default AmortizationInterestTable;
