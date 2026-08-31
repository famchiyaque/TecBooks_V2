import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useMemo } from "react";
import AmountCell from "./AmountCell";
import { COLORS, cellSx } from "@/utils/sims/program/colors";
import { SectionTitle, Card } from "./General";

function ServicesTable({ services }) {
  7;
  // Group consecutive rows by category so the category cell can span them,
  // the same way the reference spreadsheet merges "Servicios Básicos".
  const rows = useMemo(() => {
    const result = [];
    services.forEach((service, idx) => {
      const isFirstOfGroup =
        idx === 0 || services[idx - 1].categoria !== service.categoria;
      const groupSize = isFirstOfGroup
        ? services.filter(
            (s, i) => i >= idx && s.categoria === service.categoria,
          ).length
        : 0;
      result.push({ ...service, isFirstOfGroup, groupSize, key: idx });
    });
    return result;
  }, [services]);

  return (
    <Card>
      <SectionTitle>Servicios</SectionTitle>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: COLORS.servicesHeaderBg }}>
              <TableCell
                sx={{ ...cellSx, fontWeight: 700, color: COLORS.navy }}
              >
                Categoría de Gasto
              </TableCell>
              <TableCell
                sx={{ ...cellSx, fontWeight: 700, color: COLORS.navy }}
              >
                Subcategoría
              </TableCell>
              <TableCell
                sx={{
                  ...cellSx,
                  fontWeight: 700,
                  color: COLORS.navy,
                  whiteSpace: "normal",
                }}
              >
                Descripción
              </TableCell>
              <TableCell
                align="right"
                sx={{ ...cellSx, fontWeight: 700, color: COLORS.navy }}
              >
                Rango Mensual Est.
              </TableCell>
              <TableCell
                sx={{
                  ...cellSx,
                  fontWeight: 700,
                  color: COLORS.navy,
                  whiteSpace: "normal",
                }}
              >
                Notas y Consideraciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  sx={{
                    ...cellSx,
                    textAlign: "center",
                    color: COLORS.textMuted,
                  }}
                >
                  No hay servicios registrados.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.key}>
                  {row.isFirstOfGroup && (
                    <TableCell
                      rowSpan={row.groupSize}
                      sx={{
                        ...cellSx,
                        fontWeight: 600,
                        verticalAlign: "top",
                        bgcolor: COLORS.sectionBg,
                      }}
                    >
                      {row.categoria}
                    </TableCell>
                  )}
                  <TableCell sx={cellSx}>{row.subcategoria}</TableCell>
                  <TableCell
                    sx={{ ...cellSx, whiteSpace: "normal", minWidth: 220 }}
                  >
                    {row.descripcion}
                  </TableCell>
                  <AmountCell value={row.rangoMensual} />
                  <TableCell
                    sx={{
                      ...cellSx,
                      whiteSpace: "normal",
                      minWidth: 220,
                      color: COLORS.textMuted,
                    }}
                  >
                    {row.notas}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

export default ServicesTable;
