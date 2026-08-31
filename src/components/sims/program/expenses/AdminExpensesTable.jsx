import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AmountCell from "./AmountCell";
import { COLORS, cellSx } from "@/utils/sims/program/colors";
import { SectionTitle, Card } from "./General";

function AdminExpensesTable({ years, expenses }) {
  return (
    <Card>
      <SectionTitle>Gastos Administrativos</SectionTitle>
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
            <TableRow>
              <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                Gastos Administrativos
              </TableCell>
              {years.map((year) => (
                <AmountCell key={year} value={expenses?.[year]} />
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

export default AdminExpensesTable;
