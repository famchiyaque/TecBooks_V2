import React, { useMemo } from "react";
import TableContainer from "@/components/global/TableContainer";

export default function ServicesTable({ services }) {
  const columns = useMemo(
    () => [
      {
        key: "categoria",
        label: "Categoría de Gasto",
        group: true,
        width: "9rem",
      },
      { key: "subcategoria", label: "Subcategoría", width: "8rem" },
      { key: "descripcion", label: "Descripción", wrap: true },
      {
        key: "rangoMensual",
        label: "Rango Mensual Est.",
        align: "right",
        type: "currency",
        width: "8rem",
      },
      { key: "notas", label: "Notas y Consideraciones", wrap: true },
    ],
    [],
  );

  return (
    <TableContainer
      title="Servicios"
      columns={columns}
      rows={services}
      emptyLabel="No hay servicios registrados."
      layout="fixed"
      scrollBody
      className="h-full flex-1 min-w-0"
    />
  );
}
