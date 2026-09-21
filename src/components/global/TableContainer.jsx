import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
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
 *     { id: "sales", title: "Sales", rows: salesRows, defaultExpanded: true, preamble: <Catalog /> },
 *   ]}
 *   footerRows={totalOutflowRows}
 * />
 *
 * Sectioned tables measure a hidden auto-layout copy of every row (including
 * collapsed sections) and lock those pixel widths on the visible table, so
 * year columns stay aligned when a section closes and cells grow to fit
 * their longest value instead of clipping.
 *
 * Total row: pass `rowVariant: "total"` on any row object.
 * Mixed units: pass `valueType: "units" | "currency"` on a row to override the
 * column's `type` for that row only (the label column is never affected).
 * Currency tone: pass `tone: "outflow" | "neutral"` on a row to override the
 * default signed coloring (negative rose / positive emerald). Outflow is rose;
 * neutral is slate. Leave `tone` off for Inflows-style signed colors.
 * ------------------------------------------------------------------------
 */

function formatUnits(value) {
  if (value === undefined || value === null || value === "") return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return "—";

  return num.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function currencyToneClass(tone, value) {
  const isEmpty = value === undefined || value === null || value === "";
  if (isEmpty) return "text-slate-300";
  const num = Number(value);
  if (tone === "outflow") {
    return !Number.isNaN(num) && num === 0 ? "text-slate-900" : "text-rose-600";
  }
  if (tone === "neutral") return "text-slate-900";
  return !Number.isNaN(num) && num < 0 ? "text-rose-600" : "text-emerald-700";
}

function CellValue({ column, value, valueType, tone }) {
  // Row-level `valueType` wins over the column's `type` so one table can mix
  // units and money across the same year columns (Sales: Customer Orders is a
  // unit count, Unit Price and Total Income are currency).
  const type = valueType ?? column.type;

  if (type === "units") {
    return <span className="tabular-nums text-slate-700">{formatUnits(value)}</span>;
  }

  if (type === "currency") {
    return (
      <span className={"tabular-nums " + currencyToneClass(tone, value)}>
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

function widthsEqual(a, b) {
  if (a === b) return true;
  if (!a || !b || a.length !== b.length) return false;
  return a.every((width, i) => width === b[i]);
}

function displayColumnWidths(contentWidths, availableWidth) {
  if (!contentWidths?.length) return null;

  const [conceptWidth, ...yearContent] = contentWidths;
  if (yearContent.length === 0) {
    return [Math.max(conceptWidth, availableWidth || 0)];
  }

  // Size every year column to the widest year cell so the numeric grid is even
  // and no year clips, then give leftover card width to the year columns.
  const yearWidth = Math.max(...yearContent);
  const next = [conceptWidth, ...yearContent.map(() => yearWidth)];
  const total = next.reduce((sum, width) => sum + width, 0);
  if (availableWidth > total) {
    const extra = availableWidth - total;
    const share = Math.floor(extra / yearContent.length);
    const remainder = extra - share * yearContent.length;
    return next.map((width, i) =>
      i === 0 ? width : width + share + (i === next.length - 1 ? remainder : 0),
    );
  }
  return next;
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

function stickyLeft(stickyOffsets, colIndex) {
  if (!stickyOffsets || colIndex >= stickyOffsets.length) return undefined;
  return stickyOffsets[colIndex];
}

function stickyClassName(stickyOffsets, colIndex, zClass) {
  if (stickyLeft(stickyOffsets, colIndex) == null) return "";
  return " sticky " + zClass;
}

function cellStyle(col, applyColWidth, stickyOffsets, colIndex) {
  const left = stickyLeft(stickyOffsets, colIndex);
  const width = applyColWidth && col.width ? col.width : undefined;
  if (left == null && !width) return undefined;
  return {
    ...(width ? { width } : {}),
    ...(left != null ? { left } : {}),
  };
}

function TableHeader({
  columns,
  cellPad,
  scrollBody,
  applyColWidth,
  stickyOffsets,
}) {
  return (
    <thead>
      <tr
        className={
          "border-b border-slate-200 " +
          (scrollBody ? "sticky top-0 z-10 bg-slate-50" : "bg-slate-50")
        }
      >
        {columns.map((col, colIndex) => (
          <th
            key={col.key}
            scope="col"
            className={
              cellPad +
              " whitespace-nowrap text-[13px] font-medium text-slate-500 " +
              (col.align === "right" ? "text-right" : "text-left") +
              stickyClassName(stickyOffsets, colIndex, "z-20 bg-slate-50")
            }
            style={cellStyle(col, applyColWidth, stickyOffsets, colIndex)}
          >
            {col.label}
          </th>
        ))}
      </tr>
    </thead>
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
  applyColWidth = true,
  endBorder = false,
  stickyOffsets,
}) {
  const groupSpans = groupColumn
    ? buildGroupSpans(rows, groupColumn.key)
    : null;

  if (rows.length === 0) {
    return emptyRows(emptyLabel, columns, cellPad, endBorder);
  }

  return rows.map((row, rowIndex) => {
    const isTotal = row.rowVariant === "total";
    const isLast = rowIndex === rows.length - 1;
    return (
      <tr
        key={rowKeyPrefix + (row.id ?? rowIndex)}
        className={
          "group " +
          (isTotal
            ? "bg-slate-50"
            : "transition-colors hover:bg-slate-50 " +
              (rowIndex % 2 === 1 ? "bg-slate-50" : "bg-white")) +
          (isLast && endBorder ? " border-b-[3px] border-slate-400" : "")
        }
      >
        {columns.map((col, colIndex) => {
          const stickyBg =
            stickyLeft(stickyOffsets, colIndex) == null
              ? ""
              : isTotal || rowIndex % 2 === 1
                ? " bg-slate-50 group-hover:bg-slate-50"
                : " bg-white group-hover:bg-slate-50";
          if (groupColumn && col.key === groupColumn.key) {
            const span = groupSpans[rowIndex];
            if (span === 0) return null;
            return (
              <td
                key={col.key}
                rowSpan={span}
                className={
                  cellPad +
                  " align-top border-r border-slate-100 bg-slate-50 font-medium text-slate-700 " +
                  (isFixed ? "break-words" : "whitespace-nowrap") +
                  stickyClassName(stickyOffsets, colIndex, "z-10")
                }
                style={cellStyle(col, applyColWidth, stickyOffsets, colIndex)}
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
                  ? "border-t border-slate-300 text-slate-900 " +
                    (col.key === labelKey ? "font-semibold" : "font-normal")
                  : "text-slate-700") +
                (col.wrap && !isFixed ? " min-w-[14rem]" : "") +
                (col.wrap ? " text-slate-500" : "") +
                stickyClassName(stickyOffsets, colIndex, "z-10") +
                stickyBg
              }
              style={cellStyle(col, applyColWidth, stickyOffsets, colIndex)}
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
                  tone={col.key === labelKey ? undefined : row.tone}
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
  footerRows,
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
  const measureRef = useRef(null);
  const containerRef = useRef(null);
  const [contentWidths, setContentWidths] = useState(null);
  const [availableWidth, setAvailableWidth] = useState(0);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  useLayoutEffect(() => {
    if (!useSections) return undefined;

    const table = measureRef.current;
    if (!table) return undefined;

    let cancelled = false;
    const read = () => {
      if (cancelled) return;
      const next = Array.from(table.querySelectorAll("thead th")).map((th) =>
        Math.ceil(th.getBoundingClientRect().width),
      );
      setContentWidths((prev) => (widthsEqual(prev, next) ? prev : next));
    };

    read();
    const observer = new ResizeObserver(read);
    observer.observe(table);
    document.fonts?.ready?.then(read);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [useSections, columns, sections, footerRows, cellPad]);

  useLayoutEffect(() => {
    if (!useSections) return undefined;

    const container = containerRef.current;
    if (!container) return undefined;

    const read = () => {
      const next = container.clientWidth;
      setAvailableWidth((prev) => (prev === next ? prev : next));
    };

    read();
    const observer = new ResizeObserver(read);
    observer.observe(container);
    return () => observer.disconnect();
  }, [useSections]);

  const colWidths = useMemo(
    () =>
      useSections ? displayColumnWidths(contentWidths, availableWidth) : null,
    [useSections, contentWidths, availableWidth],
  );

  const tableWidth = colWidths?.reduce((sum, width) => sum + width, 0);
  const stickyOffsets =
    useSections && colWidths?.length > 1 ? [0, colWidths[0]] : undefined;

  useLayoutEffect(() => {
    if (!useSections) return undefined;

    const container = containerRef.current;
    if (!container) return undefined;

    const read = () => {
      const nextRight =
        container.scrollWidth - container.clientWidth - container.scrollLeft >
        2;
      const nextScrolled = container.scrollLeft > 2;
      setCanScrollRight((prev) => (prev === nextRight ? prev : nextRight));
      setIsScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled));
    };

    read();
    container.addEventListener("scroll", read, { passive: true });
    const observer = new ResizeObserver(read);
    observer.observe(container);
    return () => {
      container.removeEventListener("scroll", read);
      observer.disconnect();
    };
  }, [useSections, tableWidth, availableWidth, openSections]);

  return (
    <section
      className={
        "relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.02] " +
        (scrollBody ? "flex h-full flex-col " : "") +
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

      {useSections && (
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 -z-10"
          style={{ left: -99999, visibility: "hidden" }}
        >
          <table
            ref={measureRef}
            className="min-w-max border-collapse text-sm"
          >
            <TableHeader
              columns={columns}
              cellPad={cellPad}
              scrollBody={false}
              applyColWidth={false}
            />
            <tbody>
              {sections.map((section) => (
                <DataRows
                  key={section.id}
                  {...dataRowProps}
                  isFixed={false}
                  applyColWidth={false}
                  rows={section.rows ?? []}
                  rowKeyPrefix={"measure-" + section.id + "-"}
                />
              ))}
              {footerRows?.length > 0 && (
                <DataRows
                  {...dataRowProps}
                  isFixed={false}
                  applyColWidth={false}
                  rows={footerRows}
                  rowKeyPrefix="measure-footer-"
                />
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="relative min-w-0">
      <div
        ref={containerRef}
        className={
          (scrollBody ? "flex-1 min-h-0 overflow-y-auto " : "") +
          (isFixed && !useSections ? "" : "overflow-x-auto ") +
          (useSections
            ? "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            : "")
        }
      >
        <table
          className={
            "text-sm " +
            (useSections ? "border-separate " : "border-collapse ") +
            (isFixed || colWidths ? "table-fixed " : "min-w-max ") +
            (tableWidth ? "" : "w-full")
          }
          style={{
            ...(tableWidth ? { width: tableWidth } : {}),
            ...(useSections ? { borderSpacing: 0 } : {}),
          }}
        >
          {colWidths && (
            <colgroup>
              {columns.map((col, i) => (
                <col key={col.key} style={{ width: colWidths[i] }} />
              ))}
            </colgroup>
          )}
          <TableHeader
            columns={columns}
            cellPad={cellPad}
            scrollBody={scrollBody}
            applyColWidth={!colWidths}
            stickyOffsets={stickyOffsets}
          />

          {useSections ? (
            sections.map((section) => {
              const expanded = isSectionOpen(section);
              return (
                <tbody key={section.id}>
                  <tr
                    className={
                      expanded
                        ? "border-b border-slate-200"
                        : "border-b-[3px] border-slate-400"
                    }
                  >
                    <td colSpan={columns.length} className="p-0">
                      <button
                        type="button"
                        aria-expanded={expanded}
                        onClick={() => toggleSection(section)}
                        className={
                          cellPad +
                          " sticky left-0 flex items-center justify-between gap-4 bg-slate-50 text-left hover:bg-slate-100"
                        }
                        style={{
                          width: availableWidth ? availableWidth : "100%",
                        }}
                      >
                        <span className="inline-flex items-center text-[15px] font-semibold text-slate-900">
                          {section.title}
                          <InfoTooltip title={section.titleTooltip} />
                        </span>
                        <SectionChevron expanded={expanded} />
                      </button>
                    </td>
                  </tr>
                  {expanded && section.preamble && (
                    <tr>
                      <td colSpan={columns.length} className="p-4">
                        {section.preamble}
                      </td>
                    </tr>
                  )}
                  {expanded && (
                    <DataRows
                      {...dataRowProps}
                      applyColWidth={!colWidths}
                      stickyOffsets={stickyOffsets}
                      endBorder
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
          {useSections && footerRows?.length > 0 && (
            <tbody>
              <DataRows
                {...dataRowProps}
                applyColWidth={!colWidths}
                stickyOffsets={stickyOffsets}
                rows={footerRows}
                rowKeyPrefix="footer-"
              />
            </tbody>
          )}
        </table>
      </div>
      {useSections && isScrolled && colWidths?.length > 1 && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 z-20 w-px bg-slate-400"
          style={{ left: colWidths[0] + colWidths[1] }}
        />
      )}
      {useSections && canScrollRight && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-30 w-[50px] bg-gradient-to-r from-transparent via-white/55 to-white"
        />
      )}
      </div>
    </section>
  );
}

function emptyRows(emptyLabel, columns, cellPad, endBorder = false) {
  return (
    <tr className={endBorder ? "border-b-[3px] border-slate-400" : ""}>
      <td
        colSpan={columns.length}
        className={cellPad + " text-center text-sm text-slate-400"}
      >
        {emptyLabel}
      </td>
    </tr>
  );
}
