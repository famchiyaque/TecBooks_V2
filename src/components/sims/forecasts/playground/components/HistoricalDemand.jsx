import React, { useEffect, useRef, useState } from "react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Crea un año nuevo con los 12 meses prellenados. */
export const createYear = (fill = 100) => Array(12).fill(fill);

/** Devuelve el número válido o null. Acepta enteros/decimales >= 0. */
const parseDemand = (raw) => {
  const text = raw.trim();
  return /^\d+(\.\d+)?$/.test(text) ? Number(text) : null;
};

/* ---------- Celda ---------- */
const DemandCell = ({
  value,
  isTest,
  invalid,
  disabled,
  onCommit,
  onReject,
  onFocus,
}) => {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => setDraft(String(value)), [value]);

  const commit = () => {
    const parsed = parseDemand(draft);
    if (parsed === null) {
      setDraft(String(value)); // vuelve al valor anterior
      onReject();
    } else if (parsed !== value) {
      onCommit(parsed);
    } else {
      setDraft(String(parsed)); // normaliza, ej. "081" -> "81"
    }
  };

  return (
    <td className="p-1">
      <input
        type="text"
        inputMode="decimal"
        value={draft}
        disabled={disabled}
        aria-invalid={invalid}
        onFocus={(e) => {
          e.target.select();
          onFocus();
        }}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
          if (e.key === "Escape") {
            setDraft(String(value));
            e.currentTarget.blur();
          }
        }}
        className={`w-20 rounded-lg border px-2 py-1.5 text-center text-sm tabular-nums text-slate-800 outline-none transition
          focus:bg-white focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60
          ${
            invalid
              ? "border-red-400 bg-red-50 focus:ring-red-300"
              : isTest
                ? "border-amber-200 bg-amber-50 hover:border-amber-300 focus:border-amber-400 focus:ring-amber-200"
                : "border-emerald-200 bg-emerald-50 hover:border-emerald-300 focus:border-emerald-400 focus:ring-emerald-200"
          }`}
      />
    </td>
  );
};

/* ---------- Componente principal ---------- */
/**
 * Componente controlado: el padre es dueño de los datos.
 * Tiene ancho fijo; si hay más años de los que caben, la tabla
 * se desplaza horizontalmente (la columna de meses queda fija).
 *
 * @param {Record<number, number[]>} value  { [año]: [12 valores] }
 * @param {(next: Record<number, number[]>) => void} onChange
 * @param {number}  [maxYears=5]
 * @param {number}  [minYears=1]
 * @param {number}  [defaultValue=100]  Relleno de los años nuevos.
 * @param {number}  [testMonths=3]      Últimos N meses marcados como prueba (0 = ninguno).
 * @param {boolean} [disabled=false]
 * @param {string}  [title]
 * @param {string}  [width="28rem"]     Ancho fijo del componente (cualquier valor CSS).
 */
const HistoricalDemand = ({
  value,
  onChange,
  setDefault,
  maxYears = 5,
  minYears = 1,
  defaultValue = 100,
  testMonths = 3,
  disabled = false,
  title = "Historical Demand",
  width = "22rem",
}) => {
  const [error, setError] = useState(null); // { key, message }
  const scrollRef = useRef(null);

  const years = Object.keys(value)
    .map(Number)
    .sort((a, b) => a - b);
  const totalMonths = years.length * 12;
  const canAdd = !disabled && years.length < maxYears;
  const canRemove = !disabled && years.length > minYears;

  // Al agregar/quitar un año, vuelve al inicio para ver la columna nueva.
  useEffect(() => {
    scrollRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [years.length]);

  const emit = (next) => {
    setError(null);
    onChange(next);
  };

  const setCell = (year, monthIdx, v) =>
    emit({
      ...value,
      [year]: value[year].map((x, i) => (i === monthIdx ? v : x)),
    });

  // Se agrega/quita por el extremo más antiguo para mantener la serie continua.
  const addYear = () =>
    emit({ ...value, [years[0] - 1]: createYear(defaultValue) });

  const removeYear = () => {
    const { [years[0]]: _removed, ...rest } = value;
    emit(rest);
  };

  const isTestCell = (yearIdx, monthIdx) =>
    yearIdx * 12 + monthIdx >= totalMonths - testMonths;

  const btnBase =
    "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed";

  return (
    <section
      style={{ width, maxWidth: "100%" }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      {/* Encabezado */}
      <header className="mb-4 grid items-start grid-rows-2 gap-4">
        <div className="min-w-0">
          <h2 className="font-semibold text-slate-900">{title}</h2>
          <p className="text-xs text-slate-500">
            {years.length} of {maxYears} years · {totalMonths} months
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 justify-center">
          <button
            type="button"
            onClick={removeYear}
            disabled={!canRemove}
            title={canRemove ? `Remove ${years[0]}` : undefined}
            className={`${btnBase} border border-slate-200 bg-white text-slate-600
              hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:ring-red-200
              disabled:border-slate-100 disabled:bg-slate-50 disabled:text-slate-300 disabled:hover:border-slate-100 disabled:hover:bg-slate-50 disabled:hover:text-slate-300`}
          >
            <span aria-hidden>−</span> Remove year
          </button>
          <button
            type="button"
            onClick={addYear}
            disabled={!canAdd}
            className={`${btnBase} bg-sky-600 text-white shadow-sm
              hover:bg-sky-700 focus:ring-sky-300
              disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none`}
          >
            <span aria-hidden>+</span> Add year
          </button>
        </div>
      </header>

      {/* Tabla con scroll horizontal interno */}
      <div
        ref={scrollRef}
        className="overflow-x-auto rounded-xl border border-slate-100"
      >
        <table className="w-max border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 w-28 border-b border-r border-slate-100 bg-white" />
              {years.map((year, yi) => (
                <th
                  key={year}
                  className="border-b border-slate-100 bg-slate-50/60 px-1 py-2 text-sm font-semibold text-slate-700"
                >
                  {year}
                  {yi === 0 && years.length > 1 && (
                    <span className="ml-1.5 text-[10px] font-normal text-slate-400">
                      oldest
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {MONTHS.map((month, mi) => (
              <tr key={month}>
                <th
                  scope="row"
                  className="sticky left-0 z-10 border-r border-slate-100 bg-white px-3 text-left text-sm font-normal text-slate-600"
                >
                  {month}
                </th>
                {years.map((year, yi) => {
                  const key = `${year}-${mi}`;
                  return (
                    <DemandCell
                      key={key}
                      value={value[year][mi]}
                      isTest={isTestCell(yi, mi)}
                      invalid={error?.key === key}
                      disabled={disabled}
                      onCommit={(v) => setCell(year, mi, v)}
                      onReject={() =>
                        setError({
                          key,
                          message: `Invalid value for ${month} ${year}. Previous value restored.`,
                        })
                      }
                      onFocus={() => setError(null)}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Error */}
      {error && (
        <p
          role="alert"
          className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700"
        >
          {error.message}
        </p>
      )}

      {/* Leyenda */}
      {testMonths > 0 && (
        <footer className="mt-4 flex items-center justify-center gap-6 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-emerald-400" />
            Training data
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-amber-400" />
            Test data
          </span>
        </footer>
      )}
      {/* Ejemplo de cambio desde el padre */}
      <button
        type="button"
        onClick={setDefault}
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 mt-2"
      >
        Set deault values
      </button>
    </section>
  );
};

export default HistoricalDemand;
