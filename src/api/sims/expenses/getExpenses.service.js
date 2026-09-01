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
    concept: "Amortización Crédito",
    values: {
      2025: 8203976.11,
      2026: 8203976.11,
      2027: 8203976.11,
      2028: 8203976.11,
      2029: 8203976.11,
    },
  },
  {
    concept: "Interés Devengado",
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
  {
    categoria: "Servicios Complejos",
    subcategoria: "Internet",
    descripcion:
      "Conexión de banda ancha para toda la empresa (fibra óptica recomendada).",
    rangoMensual: 8000,
    notas:
      "Varía según la velocidad (MBs), el proveedor y si incluye servicios adicionales (VPN, IP fija).",
  },
  {
    categoria: "Servicios Complejos",
    subcategoria: "Internet",
    descripcion:
      "Conexión de banda ancha para toda la empresa (fibra óptica recomendada).",
    rangoMensual: 8000,
    notas:
      "Varía según la velocidad (MBs), el proveedor y si incluye servicios adicionales (VPN, IP fija).",
  },
  {
    categoria: "Servicios Complejos",
    subcategoria: "Internet",
    descripcion:
      "Conexión de banda ancha para toda la empresa (fibra óptica recomendada).",
    rangoMensual: 8000,
    notas:
      "Varía según la velocidad (MBs), el proveedor y si incluye servicios adicionales (VPN, IP fija).",
  },
  {
    categoria: "Servicios Complejos",
    subcategoria: "Internet",
    descripcion:
      "Conexión de banda ancha para toda la empresa (fibra óptica recomendada).",
    rangoMensual: 8000,
    notas:
      "Varía según la velocidad (MBs), el proveedor y si incluye servicios adicionales (VPN, IP fija).",
  },
  {
    categoria: "Servicios Complejos",
    subcategoria: "Internet",
    descripcion:
      "Conexión de banda ancha para toda la empresa (fibra óptica recomendada).",
    rangoMensual: 8000,
    notas:
      "Varía según la velocidad (MBs), el proveedor y si incluye servicios adicionales (VPN, IP fija).",
  },
  {
    categoria: "Servicios Complejos",
    subcategoria: "Internet",
    descripcion:
      "Conexión de banda ancha para toda la empresa (fibra óptica recomendada).",
    rangoMensual: 8000,
    notas:
      "Varía según la velocidad (MBs), el proveedor y si incluye servicios adicionales (VPN, IP fija).",
  },
  {
    categoria: "Servicios Complejos",
    subcategoria: "Internet",
    descripcion:
      "Conexión de banda ancha para toda la empresa (fibra óptica recomendada).",
    rangoMensual: 8000,
    notas:
      "Varía según la velocidad (MBs), el proveedor y si incluye servicios adicionales (VPN, IP fija).",
  },
];
