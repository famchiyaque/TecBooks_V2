export const SAMPLE_YEARS = [
  2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035,
];

export const SAMPLE_ADMIN_EXPENSES = {
  2025: 5316000,
  2026: 5496744,
  2027: 5683633.3,
  2028: 5876876.83,
  2029: 6076690.64,
  2030: 6283298.12,
  2031: 6496930.26,
  2032: 6717825.89,
  2033: 6946231.97,
  2034: 7182403.85,
  2035: 7426605.58,
};

export const SAMPLE_INVESTMENT = [
  { concepto: "Edificio", monto: 6053000 },
  { concepto: "Maquinaria y Equipo", monto: 8060000 },
  { concepto: "Equipo de Cómputo", monto: 217350 },
  { concepto: "Transporte", monto: 1440000 },
  { concepto: "Capital de Trabajo", monto: 22428530.56 },
  { concepto: "Obra Civil Maquinaria y Equipo", monto: 2821000 },
];

export const SAMPLE_FINANCIAL_EXPENSES = [
  {
    concepto: "Amortización Crédito",
    values: {
      2025: 8203976.11,
      2026: 8203976.11,
      2027: 8203976.11,
      2028: 8203976.11,
      2029: 8203976.11,
    },
  },
  {
    concepto: "Interés Devengado",
    values: {
      2025: 5961555.97,
      2026: 4648919.8,
      2027: 3336283.62,
      2028: 2023647.44,
      2029: 902437.37,
    },
  },
];

export const SAMPLE_SERVICES = [
  {
    categoria: "Servicios Básicos",
    subcategoria: "Electricidad",
    descripcion:
      "Consumo de energía para oficinas, equipos, aire acondicionado, iluminación.",
    rangoMensual: 60000,
    notas:
      "Depende del tamaño del espacio, el uso de equipo (servidores, maquinaria) y la tarifa CFE.",
  },
  {
    categoria: "Servicios Básicos",
    subcategoria: "Agua",
    descripcion: "Consumo de agua para baños, cocina, limpieza.",
    rangoMensual: 8000,
    notas:
      "Varía por municipio y tipo de uso (comercial/industrial). El volumen de consumo es clave.",
  },
  {
    categoria: "Servicios Básicos",
    subcategoria: "Telefonía Fija",
    descripcion: "Líneas telefónicas para comunicación interna y externa.",
    rangoMensual: 5000,
    notas: "Paquetes con múltiples líneas suelen ser más económicos por línea.",
  },
  {
    categoria: "Servicios Básicos",
    subcategoria: "Internet",
    descripcion:
      "Conexión de banda ancha para toda la empresa (fibra óptica recomendada).",
    rangoMensual: 8000,
    notas:
      "Varía según la velocidad (MBs), el proveedor y si incluye servicios adicionales (VPN, IP fija).",
  },
];
