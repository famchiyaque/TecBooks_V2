import React, { useState } from "react";
import formatCurrency from "@/utils/sims/program/formatCurrency.util";
import InfoTooltip from "@/components/global/InfoTooltip";

/**
 * TableContainer
 * ----------------------------------------------------------------------
 * A single, reusable "card + table" shell for financial data, styled
 * with Tailwind. Drop this in and feed it columns + rows — it handles
 * currency formatting, signed-amount coloring, grouped/merged first
 * columns, and total rows, so every table in the app (Gastos
 * Administrative Expenses, Investment, Financial Expenses, Services, …) looks
 * consistent without re-writing table markup each time.
 *
 * ------------------------------- Usage ---------------------------------
 *
 * <TableContainer
 *   title="Gastos Administrativos"
 *   columns={[
 *     { key: "concept", label: "concept" },
 *     { key: "y2025", label: "2025", align: "right", type: "currency" },
 *     { key: "y2026", label: "2026", align: "right", type: "currency" },
 *   ]}
 *   rows={[
 *     { concept: "Gastos Administrativos", y2025: 5316000, y2026: 5496744 },
 *   ]}
 * />
 *
 * Grouped first column (e.g. Services grouped by Category):
 *
 * <TableContainer
 *   title="Services"
 *   columns={[
 *     { key: "category", label: "Expense Category", group: true },
 *     { key: "subcategory", label: "Subcategory" },
 *     { key: "range", label: "Est. Monthly Range", align: "right", type: "currency" },
 *   ]}
 *   rows={services}
 * />
 *
 * Joined sections (one year header, collapsible blocks that share columns):
 *
 * <TableContainer
 *   columns={columns}
 *   layout="fixed"
 *   sections={[
 *     { id: "unit-costs", title: "Unit Costs", titleTooltip: "...", rows: unitCostRows, defaultExpanded: true },
 *     { id: "sales", title: "Sales", rows: salesRows, defaultExpanded: true },
 *   ]}
 * />
 *
 * Total row: pass `rowVariant: "total"` on any row object.
 * Mixed units: pass `valueType: "units" | "currency"` on a row to override the
 * column's `type` for that row only (the label column is never affected).
 * ------------------------------------------------------------------------
 */

function formatUnits(value) {
  if (value === undefined || value === null || value === "") return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return "—";

  return num.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function CellValue({ column, value, valueType }) {
  // Row-level `valueType` wins over the column's `type` so one table can mix
  // units and money across the same year columns (Sales: Customer Orders is a
  // unit count, Unit Price and Total Income are currency).
  const type = valueType ?? column.type;

  if (type === "units") {
    return <span className="tabular-nums text-slate-700">{formatUnits(value)}</span>;
  }

  if (type === "currency") {
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

function SectionChevron({ expanded }) {
  return (
    <svg
      className={
        "h-5 w-5 shrink-0 text-slate-400 transition-transform " +
        (expanded ? "rotate-180" : "")
      }
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DataRows({
  rows,
  columns,
  groupColumn,
  cellPad,
  isFixed,
  labelKey,
  emptyLabel,
  rowKeyPrefix = "",
}) {
  const groupSpans = groupColumn
    ? buildGroupSpans(rows, groupColumn.key)
    : null;

  if (rows.length === 0) {
    return emptyRows(emptyLabel, columns, cellPad);
  }

  return rows.map((row, rowIndex) => {
    const isTotal = row.rowVariant === "total";
    return (
      <tr
        key={rowKeyPrefix + (row.id ?? rowIndex)}
        className={
          isTotal
            ? "bg-slate-50/80 rounded-b-md"
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
                (col.align === "right" ? "text-right" : "text-left") +
                " " +
                (isTotal
                  ? "border-t border-slate-300 font-semibold text-slate-900"
                  : "text-slate-700") +
                (col.wrap && !isFixed ? " min-w-[14rem]" : "") +
                (col.wrap ? " text-slate-500" : "")
              }
              style={col.width ? { width: col.width } : undefined}
            >
              {col.key === labelKey && row.tooltip ? (
                <span className="inline-flex items-center">
                  <CellValue column={col} value={row[col.key]} />
                  <InfoTooltip title={row.tooltip} />
                </span>
              ) : (
                <CellValue
                  column={col}
                  value={row[col.key]}
                  // never on the label column - that cell holds
                  // the concept text, not a number to format
                  valueType={col.key === labelKey ? undefined : row.valueType}
                />
              )}
            </td>
          );
        })}
      </tr>
    );
  });
}

export default function TableContainer({
  title,
  titleTooltip,
  subtitle,
  columns,
  rows = [],
  sections,
  actions,
  dense = false,
  emptyLabel = "No information available.",
  className = "",
  layout = "auto",
  scrollBody = false,
}) {
  const groupColumn = columns.find((c) => c.group);
  const cellPad = dense ? "px-4 py-2" : "px-5 py-3";
  const isFixed = layout === "fixed";
  const labelKey = columns[0]?.key;
  const useSections = Array.isArray(sections);
  const [openSections, setOpenSections] = useState({});

  const isSectionOpen = (section) =>
    openSections[section.id] ?? section.defaultExpanded ?? false;

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section.id]: !(prev[section.id] ?? section.defaultExpanded ?? false),
    }));
  };

  const dataRowProps = {
    columns,
    groupColumn,
    cellPad,
    isFixed,
    labelKey,
    emptyLabel,
  };

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
              <h3 className="inline-flex items-center text-[15px] font-semibold text-slate-900">
                {title}
                <InfoTooltip title={titleTooltip} />
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

          {useSections ? (
            sections.map((section) => {
              const expanded = isSectionOpen(section);
              return (
                <tbody key={section.id}>
                  <tr className="border-b border-slate-200">
                    <td colSpan={columns.length} className="p-0">
                      <button
                        type="button"
                        aria-expanded={expanded}
                        onClick={() => toggleSection(section)}
                        className={
                          cellPad +
                          " flex w-full items-center justify-between gap-4 bg-slate-50/80 text-left hover:bg-slate-50"
                        }
                      >
                        <span className="inline-flex items-center text-[15px] font-semibold text-slate-900">
                          {section.title}
                          <InfoTooltip title={section.titleTooltip} />
                        </span>
                        <SectionChevron expanded={expanded} />
                      </button>
                    </td>
                  </tr>
                  {expanded && (
                    <DataRows
                      {...dataRowProps}
                      rows={section.rows ?? []}
                      rowKeyPrefix={section.id + "-"}
                    />
                  )}
                </tbody>
              );
            })
          ) : (
            <tbody>
              <DataRows {...dataRowProps} rows={rows} />
            </tbody>
          )}
        </table>
      </div>
    </section>
  );
}

function emptyRows(emptyLabel, columns, cellPad) {
  return (
    <tr>
      <td
        colSpan={columns.length}
        className={cellPad + " text-center text-sm text-slate-400"}
      >
        {emptyLabel}
      </td>
    </tr>
  );
}
