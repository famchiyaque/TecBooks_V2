import React from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const CELL_PAD = "px-2 py-2";

function defaultFormat(value) {
  const num = value || 0;
  return `$${num.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function GrandTotalTable({
  title = "Grand Total",
  columns = [],
  sources = [],
  formatValue = defaultFormat,
}) {
  const sourcesData = sources.map((source) => ({
    ...source,
    overrides: useSelector(source.slice.selectOverrides),
    customRows: useSelector(source.slice.selectCustomRows),
  }));

  const totalsByColumn = columns.map(({ key: columnKey }) => {
    return sourcesData.reduce((accumulatedTotal, source) => {
      const { slice, overrides, customRows, rows, getValue } = source;

      const sourceTotal = slice.effectiveTotal(
        { overrides, customRows },
        rows,
        getValue,
        columnKey,
      );

      return accumulatedTotal + sourceTotal;
    }, 0);
  });

  return (
    <section className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.02]">
      <div className="overflow-x-auto">
        <Table size="small" className="w-full border-collapse text-xs">
          <TableHead>
            <TableRow className="border-b border-slate-200 bg-slate-50/60">
              <TableCell
                className={`${CELL_PAD} whitespace-nowrap text-[11px] font-medium text-slate-500`}
              >
                Concept
              </TableCell>
              {columns.map(({ key: columnKey, label }) => (
                <TableCell
                  key={columnKey}
                  align="right"
                  className={`${CELL_PAD} whitespace-nowrap text-[11px] font-medium text-slate-500`}
                >
                  {label || columnKey}
                </TableCell>
              ))}
              <TableCell sx={{ width: 64 }} />
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow className="bg-slate-100/80">
              <TableCell
                className={`${CELL_PAD} whitespace-nowrap font-bold text-slate-900`}
              >
                {title}
              </TableCell>
              {columns.map(({ key: columnKey }, index) => (
                <TableCell
                  key={columnKey}
                  align="right"
                  className={`${CELL_PAD} whitespace-nowrap font-bold text-slate-900`}
                >
                  {formatValue(totalsByColumn[index])}
                </TableCell>
              ))}
              <TableCell sx={{ width: 64 }} />
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
