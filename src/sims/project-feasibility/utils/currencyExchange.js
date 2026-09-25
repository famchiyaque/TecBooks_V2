import workerApi from "@/utils/worker.util";

const getToday = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
  }).format(new Date());
};

const convertCurrency = async (currencyIn, currencyOut) => {
  if (!currencyIn || !currencyOut) {
    throw new Error("Input and output currencies are required");
  }

  if (currencyIn === currencyOut) {
    return 1;
  }

  const today = getToday();

  const response = await fetch(
    `https://api.frankfurter.dev/v2/rate/${currencyIn}/${currencyOut}`
  );

  const data = await response.json();

  if (!response.ok || !data.rate) {
    throw new Error(
      `Currency exchange failed: ${
        data.message || "Unknown error"
      }`
    );
  }

  const rate = data.rate;

  return rate;
};

export default convertCurrency;