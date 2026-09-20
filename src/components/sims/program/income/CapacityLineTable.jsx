import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import { capacityLineEditsSlice } from "@/store/costTable.store";
import { capacityForIndex } from "@/sims/project-feasibility/model/applyDerivedBase";

const CELL_PAD = "px-2 py-2";

// Same fields/order as sheets.js' LINE_LABELS (Capacidad sheet) - keep both
// in sync if a new line parameter is ever added there.
const LINE_ROWS = [
  { key: "qualityYield", label: "Quality Yield" },
  { key: "secondsPerUnit", label: "Seconds x Unit" },
  { key: "hoursShift", label: "Hours Shift" },
  { key: "shifts", label: "Shifts" },
  { key: "productionLines", label: "Production Lines" },
  { key: "weekWorkingDays", label: "Week Working Days" },
  { key: "monthsWorkingWeeks", label: "Months Working Weeks" },
  { key: "yearWorkingMonths", label: "Year Working Months" },
];

function formatLineValue(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return value.toLocaleString("es-MX", { maximumFractionDigits: 4 });
}

function parseLineInput(raw) {
  const cleaned = String(raw).trim().replace(/,/g, "");
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : 0;
}

// Excel copies a cell range as tab-separated columns, newline-separated rows.
function parseClipboardGrid(text) {
  return text
    .replace(/\r/g, "")
    .split("\n")
    .filter((line) => line.length > 0)
    .map((line) => line.split("\t").map(parseLineInput));
}

/**
 * Double-click to type a single value; paste (Ctrl+V, whether editing or
 * just focused) fills a whole Excel-copied block starting at this cell -
 * see CapacityLineTable's handlePasteBlock.
 */
function LineValueCell({ value, onCommit, onPasteBlock }) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState("");

  const startEditing = () => {
    setDraft(String(value ?? ""));
    setEditing(true);
  };

  const commit = () => {
    onCommit(parseLineInput(draft));
    setEditing(false);
  };

  const handlePaste = (event) => {
    const text = event.clipboardData.getData("text");
    if (!text) return;
    event.preventDefault();
    onPasteBlock(text);
    setEditing(false);
  };

  if (editing) {
    return (
      <TableCell align="right" className={CELL_PAD}>
        <TextField
          autoFocus
          size="small"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onPaste={handlePaste}
          onKeyDown={(event) => {
            if (event.key === "Enter") commit();
            if (event.key === "Escape") setEditing(false);
          }}
          inputProps={{ style: { textAlign: "right" } }}
          sx={{ width: 100 }}
        />
      </TableCell>
    );
  }

  return (
    <TableCell
      align="right"
      tabIndex={0}
      onDoubleClick={startEditing}
      onPaste={handlePaste}
      className={`${CELL_PAD} whitespace-nowrap cursor-text outline-none focus:ring-2 focus:ring-sky-300 focus:ring-inset`}
    >
      <span className="tabular-nums text-slate-700">{formatLineValue(value)}</span>
    </TableCell>
  );
}

/**
 * Editable per-year Capacity Line parameters (Capacidad sheet: Quality
 * Yield, Shifts, Production Lines, etc.). These drive
 * derivedBase.annualCapacityByYear, which is what post-year-zero Customer
 * Orders are projected from (see cbmToCostTableInputs.js'
 * projectPurchaseOrdersFromCapacity) - editing a cell here is how a user
 * models a planned shift/line change (e.g. adding a second shift in 2028)
 * without needing to re-upload the Excel.
 *
 * Overrides live in Redux (capacityLineEditsSlice, the same per-cell-override
 * pattern EditableTable uses elsewhere) instead of this component's own
 * state, so useIncome can pick them up and recompute live.
 *
 * Click a cell then paste (Ctrl+V) a range copied from Excel to fill many
 * cells at once - it spills right/down from that cell, same as pasting a
 * block into a spreadsheet. Double-click still edits a single cell by hand.
 *
 * @param {object} capacityLine - cbm.capacity.line, HORIZON_YEARS-indexed arrays.
 * @param {number[]} years - HORIZON_YEARS.
 */
function CapacityLineTable({ capacityLine, years }) {
  const dispatch = useDispatch();
  const overrides = useSelector(capacityLineEditsSlice.selectOverrides);

  const effectiveValue = (field, year, index) => {
    const key = `${field}:${year}`;
    if (key in overrides) return overrides[key];
    return capacityLine?.[field]?.[index];
  };

  const effectiveLine = LINE_ROWS.reduce((acc, row) => {
    acc[row.key] = years.map((year, index) => effectiveValue(row.key, year, index));
    return acc;
  }, {});

  const handlePasteBlock = (startRowIndex, startColIndex, text) => {
    const grid = parseClipboardGrid(text);
    grid.forEach((rowValues, rOffset) => {
      const row = LINE_ROWS[startRowIndex + rOffset];
      if (!row) return;
      rowValues.forEach((value, cOffset) => {
        const year = years[startColIndex + cOffset];
        if (year === undefined) return;
        dispatch(capacityLineEditsSlice.actions.setOverride({ rowKey: row.key, columnKey: year, value }));
      });
    });
  };

  return (
    <section className="mt-3 rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.02]">
      <div className="border-b border-slate-100 px-6 py-4">
        <h3 className="text-[15px] font-semibold text-slate-900">Capacity Line</h3>
        <p className="mt-1 text-xs text-slate-500">
          Click a cell then paste a range copied from Excel to fill several years at once, or double-click to type one value.
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table size="small" className="w-full border-collapse text-xs">
          <TableHead>
            <TableRow className="border-b border-slate-200 bg-slate-50/60">
              <TableCell className={`${CELL_PAD} whitespace-nowrap text-[11px] font-medium text-slate-500`}>
                Concept
              </TableCell>
              {years.map((year) => (
                <TableCell
                  key={year}
                  align="right"
                  className={`${CELL_PAD} whitespace-nowrap text-[11px] font-medium text-slate-500`}
                >
                  {year}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {LINE_ROWS.map((row, rowIndex) => (
              <TableRow
                key={row.key}
                className={`transition-colors hover:bg-slate-50/60 ${rowIndex % 2 === 1 ? "bg-slate-50/30" : ""}`}
              >
                <TableCell className={`${CELL_PAD} whitespace-nowrap text-slate-700`}>{row.label}</TableCell>
                {years.map((year, colIndex) => (
                  <LineValueCell
                    key={year}
                    value={effectiveValue(row.key, year, colIndex)}
                    onCommit={(value) =>
                      dispatch(capacityLineEditsSlice.actions.setOverride({ rowKey: row.key, columnKey: year, value }))
                    }
                    onPasteBlock={(text) => handlePasteBlock(rowIndex, colIndex, text)}
                  />
                ))}
              </TableRow>
            ))}

            <TableRow className="bg-slate-50/80">
              <TableCell className={`${CELL_PAD} whitespace-nowrap border-t border-slate-300 font-semibold text-slate-900`}>
                Annual Capacity
              </TableCell>
              {years.map((year, index) => {
                const capacity = capacityForIndex(effectiveLine, index).capacity;
                return (
                  <TableCell
                    key={year}
                    align="right"
                    className={`${CELL_PAD} whitespace-nowrap border-t border-slate-300 font-semibold text-slate-900`}
                  >
                    {formatLineValue(capacity)}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

export default CapacityLineTable;
