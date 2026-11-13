// Formats a number safely: null/NaN -> "X", Infinity -> "∞"
export const fmt = (value, digits = 2) => {
  if (value == null || Number.isNaN(value)) return "X";
  if (!Number.isFinite(value)) return value > 0 ? "∞" : "-∞";
  return Number(value).toFixed(digits);
};

export function StatItem({ label, value, unit }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-md border border-gray-200 px-2 py-2">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="flex items-baseline gap-1">
        <span className="text-lg">{value}</span>
        {unit && <span className="text-xs text-gray-500">{unit}</span>}
      </p>
    </div>
  );
}
