import { Typography, Paper } from "@mui/material";
import { COLORS } from "@/utils/sims/program/colors";

export function SectionTitle({ children }) {
  return (
    <Typography
      sx={{
        fontSize: 15,
        fontWeight: 700,
        color: COLORS.navy,
        mb: 1.5,
      }}
    >
      {children}
    </Typography>
  );
}

export function Card({ children, sx }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: COLORS.border,
        borderRadius: 1.5,
        p: 3,
        mb: 3,
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
}
