import React from "react";
import formatCurrency from "@/utils/sims/program/formatCurrency.util";

/**
 * TableContainer
 * ----------------------------------------------------------------------
 * A single, reusable "card + table" shell for financial data, styled
 * with Tailwind. Drop this in and feed it columns + rows — it handles
 * currency formatting, signed-amount coloring, grouped/merged first
 * columns, and total rows, so every table in the app (Gastos
 * Administrativos, Inversión, Gastos Financieros, Servicios, …) looks
 * consistent without re-writing table markup each time.
 *
 * ------------------------------- Usage ---------------------------------
 *
 * <TableContainer
 *   title="Gastos Administrativos"
 *   columns={[
 *     { key: "concepto", label: "Concepto" },
 *     { key: "y2025", label: "2025", align: "right", type: "currency" },
 *     { key: "y2026", label: "2026", align: "right", type: "currency" },
 *   ]}
 *   rows={[
 *     { concepto: "Gastos Administrativos", y2025: 5316000, y2026: 5496744 },
 *   ]}
 * />
 *
 * Grouped first column (e.g. Servicios grouped by Categoría):
 *
 * <TableContainer
 *   title="Servicios"
 *   columns={[
 *     { key: "categoria", label: "Categoría de Gasto", group: true },
 *     { key: "subcategoria", label: "Subcategoría" },
 *     { key: "rango", label: "Rango Mensual Est.", align: "right", type: "currency" },
 *   ]}
 *   rows={services}
 * />
 *
 * Total row: pass `rowVariant: "total"` on any row object.
 * ------------------------------------------------------------------------
 */

function CellValue({ column, value }) {
  if (column.type === "currency") {
    const num = Number(value);
    const isEmpty = value === undefined || value === null || value === "";
    const isNegative = !Number.isNaN(num) && num < 0;
    return (
      <span
        className={
          "tabular-nums " +
          (isEmpty
            ? "text-slate-300"
            : isNegative
              ? "text-rose-600"
              : "text-emerald-700")
        }
      >
        {formatCurrency(value)}
      </span>
    );
  }
  return <>{value ?? "—"}</>;
}

function buildGroupSpans(rows, groupKey) {
  // Returns, per row index, how many rows the group cell should span
  // (0 means "skip, part of a previous span").
  const spans = new Array(rows.length).fill(0);
  let i = 0;
  while (i < rows.length) {
    const value = rows[i][groupKey];
    let span = 1;
    while (i + span < rows.length && rows[i + span][groupKey] === value) {
      span += 1;
    }
    spans[i] = span;
    for (let j = 1; j < span; j += 1) spans[i + j] = 0;
    i += span;
  }
  return spans;
}

export default function TableContainer({
  title,
  subtitle,
  columns,
  rows,
  actions,
  dense = false,
  emptyLabel = "No hay información disponible.",
  className = "",
  layout = "auto",
  // Cuando es true: la tarjeta ocupa el alto del contenedor (h-full),
  // el título queda fijo, y solo el cuerpo de la tabla hace scroll
  // vertical con el header pegado arriba. Úsalo para tablas que deben
  // "caber" en una altura definida por un hermano (ver Expenses.jsx).
  scrollBody = false,
}) {
  const groupColumn = columns.find((c) => c.group);
  const groupSpans = groupColumn
    ? buildGroupSpans(rows, groupColumn.key)
    : null;
  const cellPad = dense ? "px-4 py-2" : "px-5 py-3";
  const isFixed = layout === "fixed";

  return (
    <section
      className={
        "rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.02] " +
        (scrollBody ? "flex h-full flex-col overflow-hidden " : "") +
        className
      }
    >
      {(title || actions) && (
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <div>
            {title && (
              <h3 className="text-[15px] font-semibold text-slate-900">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          )}
        </div>
      )}

      <div
        className={
          (scrollBody ? "flex-1 min-h-0 overflow-y-auto " : "") +
          (isFixed ? "" : "overflow-x-auto")
        }
      >
        <table
          className={
            "w-full border-collapse text-sm " +
            (isFixed ? "table-fixed" : "min-w-max")
          }
        >
          <thead>
            <tr
              className={
                "border-b border-slate-200 " +
                (scrollBody
                  ? "sticky top-0 z-10 bg-slate-50"
                  : "bg-slate-50/60")
              }
            >
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={
                    cellPad +
                    " whitespace-nowrap text-[13px] font-medium text-slate-500 " +
                    (col.align === "right" ? "text-right" : "text-left")
                  }
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className={cellPad + " text-center text-sm text-slate-400"}
                >
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => {
                const isTotal = row.rowVariant === "total";
                return (
                  <tr
                    key={row.id ?? rowIndex}
                    className={
                      isTotal
                        ? "bg-slate-50/80"
                        : "transition-colors hover:bg-slate-50/60 " +
                          (rowIndex % 2 === 1 ? "bg-slate-50/30" : "")
                    }
                  >
                    {columns.map((col) => {
                      if (groupColumn && col.key === groupColumn.key) {
                        const span = groupSpans[rowIndex];
                        if (span === 0) return null;
                        return (
                          <td
                            key={col.key}
                            rowSpan={span}
                            className={
                              cellPad +
                              " align-top border-r border-slate-100 bg-slate-50/50 font-medium text-slate-700 " +
                              (isFixed ? "break-words" : "whitespace-nowrap")
                            }
                            style={col.width ? { width: col.width } : undefined}
                          >
                            {row[col.key]}
                          </td>
                        );
                      }
                      return (
                        <td
                          key={col.key}
                          className={
                            cellPad +
                            " " +
                            (col.wrap
                              ? "whitespace-normal break-words"
                              : "whitespace-nowrap") +
                            " " +
                            (col.align === "right"
                              ? "text-right"
                              : "text-left") +
                            " " +
                            (isTotal
                              ? "border-t border-slate-300 font-semibold text-slate-900"
                              : "text-slate-700") +
                            (col.wrap && !isFixed ? " min-w-[14rem]" : "") +
                            (col.wrap ? " text-slate-500" : "")
                          }
                          style={col.width ? { width: col.width } : undefined}
                        >
                          <CellValue column={col} value={row[col.key]} />
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
