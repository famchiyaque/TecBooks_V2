function formatCurrency(value, currency="USD", decimalDigits=2) {
  const validCurrency=["MXN","USD","EUR"];
  if (value === undefined || value === null || value === "" || !validCurrency.includes(currency)) return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return "—";

  return num.toLocaleString("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: decimalDigits,
  });
}

export default formatCurrency;
