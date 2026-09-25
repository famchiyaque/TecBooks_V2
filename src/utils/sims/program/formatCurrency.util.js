function formatCurrency(value, currency="USD") {
  if (value === undefined || value === null || value === "") return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return "—";

  return num.toLocaleString("en-US", {
    style: "currency",
    currency: currency,
  });
}

export default formatCurrency;
