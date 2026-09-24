import workerApi from "@/utils/worker.util";

export default async function getExpenses() {
  const response = await workerApi.get("/api/expenses");

  if (response.status !== 200) {
    console.error(response.error);
    const error = new Error("Error fetching data");
    error.status = response.status;
    throw error;
  }
  console.log(response.data);

  return response.data;
}

export const SAMPLE_FINANCIAL_EXPENSES = [
  {
    concept: "Loan Amortization",
    values: {
      2025: 8203976.11,
      2026: 8203976.11,
      2027: 8203976.11,
      2028: 8203976.11,
      2029: 8203976.11,
    },
  },
  {
    concept: "Accrued Interest",
    values: {
      2025: 5961555.97,
      2026: 4648919.8,
      2027: 3336283.62,
      2028: 2023647.44,
      2029: 902437.37,
    },
  },
];
