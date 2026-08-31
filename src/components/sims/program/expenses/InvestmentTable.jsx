import React, { useMemo } from "react";
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

function InvestmentTable({ items }) {
  const total = useMemo(
    () => items.reduce((sum, item) => sum + (Number(item.monto) || 0), 0),
    [items],
  );

  return (
    <Card>
      <SectionTitle>Inversión</SectionTitle>
      <TableContainer>
        <Table size="small" sx={{ maxWidth: 480 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: COLORS.headerBg }}>
              <TableCell
                sx={{ ...cellSx, fontWeight: 700, color: COLORS.navy }}
              >
                Concepto
              </TableCell>
              <TableCell
                align="right"
                sx={{ ...cellSx, fontWeight: 700, color: COLORS.navy }}
              >
                Monto
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.concepto}>
                <TableCell sx={cellSx}>{item.concepto}</TableCell>
                <AmountCell value={item.monto} />
              </TableRow>
            ))}
            <TableRow sx={{ bgcolor: COLORS.sectionBg }}>
              <TableCell
                sx={{
                  ...cellSx,
                  fontWeight: 700,
                  borderTop: `1px solid ${COLORS.navy}`,
                }}
              >
                Total
              </TableCell>
              <AmountCell value={total} bold />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

export default InvestmentTable;
