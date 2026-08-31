import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AmountCell from "./AmountCell";
import { SectionTitle, Card } from "./General";
import { COLORS, cellSx } from "@/utils/sims/program/colors";

function FinancialExpensesTable({ years, items }) {
  return (
    <Card>
      <SectionTitle>Gastos Financieros</SectionTitle>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: COLORS.headerBg }}>
              <TableCell
                sx={{ ...cellSx, fontWeight: 700, color: COLORS.navy }}
              >
                Concepto
              </TableCell>
              {years.map((year) => (
                <TableCell
                  key={year}
                  align="right"
                  sx={{ ...cellSx, fontWeight: 700, color: COLORS.navy }}
                >
                  {year}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.concepto}>
                <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                  {item.concepto}
                </TableCell>
                {years.map((year) => (
                  <AmountCell key={year} value={item.values?.[year]} />
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

export default FinancialExpensesTable;
