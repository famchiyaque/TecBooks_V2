import formatCurrency from "@/utils/sims/program/formatCurrency.util";
import { TableCell } from "@mui/material";
import { COLORS, cellSx } from "@/utils/sims/program/colors";

function AmountCell({ value, bold = false }) {
  const num = Number(value);
  const isNegative = !Number.isNaN(num) && num < 0;
  const isEmpty = value === undefined || value === null;
  return (
    <TableCell
      align="right"
      sx={{
        ...cellSx,
        fontWeight: bold ? 700 : 400,
        color: isEmpty
          ? COLORS.textMuted
          : isNegative
            ? COLORS.red
            : COLORS.green,
      }}
    >
      {isEmpty ? "—" : formatCurrency(value)}
    </TableCell>
  );
}

export default AmountCell;
