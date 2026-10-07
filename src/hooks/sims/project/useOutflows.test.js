import { describe, it, expect } from "vitest";
import { formatServices } from "./useOutflows.js";

// Shape as parsed by sheets.js:readServices (category already resolved per
// row - the forward-fill from a blank category cell happens in the parser,
// before this ever reaches formatServices).

const restaurantServices = [
  {
    category: "Costo de Ventas (COGS)",
    subcategory: "Insumos / Materia Prima",
    description: "Compra de alimentos frescos, abarrotes, bebidas y condimentos.",
    monthlyAmount: 120000,
    notes: "Representa usualmente del 28% al 35% de los ingresos totales.",
  },
  {
    category: "Servicios Operativos",
    subcategory: "Gas LP / Natural",
    description: "Combustible para estufas, freidoras, hornos y calentadores de agua.",
    monthlyAmount: 18000,
    notes: "Uso continuo durante turnos de preparación y servicio.",
  },
  {
    category: "Operación y Salubridad",
    subcategory: "Trampas de grasa y Fumigación",
    description: "Mantenimiento de trampas de grasa, control de plagas y sanidad reglamentaria.",
    monthlyAmount: 6500,
    notes: "Obligatorio por normativas de salud pública (COFEPRIS/Protección Civil).",
  },
  {
    category: "Equipamiento y Reposición",
    subcategory: "Merma y Rotura de Loza",
    description: "Reposición de platos, vasos, copas y cubiertos rotos o extraviados.",
    monthlyAmount: 5000,
    notes: "Costo variable recurrente inherente al alto tráfico en sala y cocina.",
  },
  {
    category: "Tecnología Comercial",
    subcategory: "Sistema Punto de Venta (POS)",
    description: "Licencia de comandas, software de inventarios y terminales de cobro.",
    monthlyAmount: 4500,
    notes: "Incluye renta de terminales bancarias y software tipo Soft Restaurant / Toast.",
  },
];

const smbAdminServices = [
  { category: "Servicios Básicos", subcategory: "Electricidad", description: "Consumo de energía para oficinas, equipos, aire acondicionado, iluminación.", monthlyAmount: 60000, notes: "Depende mucho del tamaño del espacio, el uso de equipo (servidores, maquinaria), y la tarifa CFE (p.ej., PDBT, GDMTO)." },
  { category: "Servicios Básicos", subcategory: "Agua", description: "Consumo de agua para baños, cocina, limpieza.", monthlyAmount: 8000, notes: "Las tarifas varían por municipio y tipo de uso (comercial/industrial)." },
  { category: "Servicios Básicos", subcategory: "Telefonía Fija", description: "Líneas telefónicas para comunicación interna y externa.", monthlyAmount: 5000, notes: "Paquetes con múltiples líneas y llamadas ilimitadas suelen ser más económicos por línea." },
  { category: "Servicios Básicos", subcategory: "Internet", description: "Conexión de banda ancha para toda la empresa (fibra óptica es recomendable).", monthlyAmount: 8000, notes: "Variará según la velocidad (MBs), el proveedor y si se incluye servicios adicionales." },
  { category: "Otros Servicios", subcategory: "Limpieza", description: "Servicio de personal de limpieza o empresa de outsourcing.", monthlyAmount: 30000, notes: "Puede ser personal interno o un servicio externo por horas/días." },
  { category: "Otros Servicios", subcategory: "Seguridad", description: "Sistemas de alarma, cámaras, y/o personal de seguridad.", monthlyAmount: 25000, notes: "Varía según el nivel de seguridad deseado." },
  { category: "Otros Servicios", subcategory: "Mantenimiento", description: "Mantenimiento de instalaciones (aire acondicionado, plomería, electricidad, etc.).", monthlyAmount: 15000, notes: "Puede ser preventivo o correctivo." },
  { category: "Gastos Administrativos", subcategory: "Sueldos y Salarios Administrativos", description: "Personal de contabilidad, recursos humanos, recepcionistas, asistentes, gerentes administrativos, etc.", monthlyAmount: 0, notes: "Este es el gasto más significativo. Incluye salarios brutos, prestaciones e IMSS/Infonavit." },
  { category: "Gastos Administrativos", subcategory: "Renta de Oficina/Establecimiento", description: "Alquiler del inmueble donde opera la PyME.", monthlyAmount: 200000, notes: "Altamente dependiente de la ubicación, el tamaño del espacio y las amenidades." },
  { category: "Gastos Administrativos", subcategory: "Materiales de Oficina", description: "Papelería, tóner, plumas, artículos de escritorio, etc.", monthlyAmount: 8000, notes: "Varía con el volumen de uso y si hay digitalización de procesos." },
  { category: "Gastos Administrativos", subcategory: "Software y Licencias", description: "Software contable, CRM, ERP, paquetería de oficina, software especializado.", monthlyAmount: 15000, notes: "Muchos softwares se pagan por licencia o por usuario." },
  { category: "Gastos Administrativos", subcategory: "Servicios de Contabilidad", description: "Despacho contable externo para gestión fiscal y contable.", monthlyAmount: 20000, notes: "Depende de la complejidad de la operación y el volumen de transacciones." },
  { category: "Gastos Administrativos", subcategory: "Asesoría Legal", description: "Servicios de consultoría legal para contratos, temas laborales, compliance.", monthlyAmount: 15000, notes: "Puede ser un pago recurrente por iguala o por proyecto." },
  { category: "Gastos Administrativos", subcategory: "Seguros", description: "Seguro de responsabilidad civil, seguro de oficina, seguro de equipo.", monthlyAmount: 5000, notes: "Pagos anuales que se prorratean mensualmente." },
  { category: "Gastos Administrativos", subcategory: "Capacitación y Desarrollo", description: "Cursos, talleres, seminarios para el personal administrativo.", monthlyAmount: 10000, notes: "Inversión en el crecimiento y habilidades del equipo." },
  { category: "Gastos Administrativos", subcategory: "Gastos de Viaje y Representación", description: "Viáticos, comidas de negocios, transporte para reuniones.", monthlyAmount: 10000, notes: "Depende de la naturaleza del negocio y la frecuencia de viajes." },
  { category: "Gastos Administrativos", subcategory: "Publicidad y Marketing (interno)", description: "Materiales de comunicación interna, eventos para empleados.", monthlyAmount: 5000, notes: "Si hay un departamento de marketing interno, sus gastos se imputarían aquí." },
  { category: "Gastos Administrativos", subcategory: "Otros (Insumos de Oficina)", description: "Café, agua embotellada, snacks para empleados y visitas.", monthlyAmount: 4000, notes: "Detalles que contribuyen al ambiente laboral." },
];

const ecommerceServices = [
  {
    category: "Logística y Cadena de Suministro",
    subcategory: "Empaque y Embalaje",
    description: "Cajas corrugadas, cinta adhesiva, relleno biodegradable y etiquetas térmicas.",
    monthlyAmount: 22000,
    notes: "Escala directamente con el número de pedidos despachados.",
  },
  {
    category: "Logística y Fletes",
    subcategory: "Envíos / Guías Prepagadas",
    description: "Costo contratado con paqueterías (DHL, FedEx, Estafeta) o fulfillment 3PL.",
    monthlyAmount: 85000,
    notes: "Puede ser absorbido en el precio o cobrado parcialmente al cliente final.",
  },
  {
    category: "Adquisición de Clientes (CAC)",
    subcategory: "Pauta Publicitaria Digital",
    description: "Publicidad paga en Meta Ads, Google Ads, TikTok Ads.",
    monthlyAmount: 60000,
    notes: "Es el principal motor de venta; indispensable para generar tráfico recurrente.",
  },
  {
    category: "Pasarelas de Pago",
    subcategory: "Comisiones por Transacción",
    description: "Cuotas porcentuales por procesamiento de cobro (Stripe, Mercado Pago, PayPal).",
    monthlyAmount: 25000,
    notes: "Suele rondar entre 2.5% y 3.5% + comisión fija por cada transacción exitosa.",
  },
  {
    category: "Infraestructura Web",
    subcategory: "Hosting y Plataforma eCommerce",
    description: "Suscripción a plataforma (Shopify Plus, WooCommerce, AWS) y apps/plugins.",
    monthlyAmount: 12000,
    notes: "Incluye servidores, CDN, certificado SSL y herramientas de optimización.",
  },
];

// RF42 - Crear tabla de gastos (unión de gastos administrativos + financieros
// + operación -> tabla consolidada). formatServices (src/hooks/sims/project/useOutflows.js)
// is what actually builds that consolidated table today: it maps cbm.services
// (whatever categories the project's Excel "Servicios" sheet has - restaurant,
// PyME administrativa, e-commerce, da igual) 1:1 into the row shape
// ServicesTable.jsx renders.
describe("RF42 - Crear tabla de gastos (formatServices)", () => {
  it.each([
    ["restaurante", restaurantServices],
    ["PyME administrativa", smbAdminServices],
    ["e-commerce", ecommerceServices],
  ])("consolida los servicios de %s sin perder ni inventar renglones", (_label, services) => {
    const rows = formatServices({ services });
    expect(rows).toHaveLength(services.length);
  });

  it("mapea cada renglón al shape que espera ServicesTable (category, subcategory, description, monthlyRange, notes)", () => {
    const [row] = formatServices({ services: restaurantServices });
    expect(row).toEqual({
      category: "Costo de Ventas (COGS)",
      subcategory: "Insumos / Materia Prima",
      description: "Compra de alimentos frescos, abarrotes, bebidas y condimentos.",
      monthlyRange: 120000,
      notes: "Representa usualmente del 28% al 35% de los ingresos totales.",
    });
  });

  it("usa monthlyAmount (el campo real del parser) como el monto que se muestra, no otro nombre", () => {
    const rows = formatServices({ services: ecommerceServices });
    const fletes = rows.find((row) => row.subcategory === "Envíos / Guías Prepagadas");
    expect(fletes.monthlyRange).toBe(85000);
  });

  it("conserva categorías repetidas entre renglones consecutivos (varias subcategorías bajo una sola categoría)", () => {
    const rows = formatServices({ services: smbAdminServices });
    const administrativos = rows.filter((row) => row.category === "Gastos Administrativos");
    expect(administrativos).toHaveLength(11);
  });

  it('cae a null cuando el servicio no trae "notes"', () => {
    const [row] = formatServices({
      services: [{ category: "X", subcategory: "Y", description: "Z", monthlyAmount: 100 }],
    });
    expect(row.notes).toBeNull();
  });

  it("regresa [] si el proyecto no trae services (cbm sin hoja de Servicios)", () => {
    expect(formatServices({})).toEqual([]);
    expect(formatServices(undefined)).toEqual([]);
  });

  it("no muta el arreglo original de servicios", () => {
    const original = JSON.parse(JSON.stringify(restaurantServices));
    formatServices({ services: restaurantServices });
    expect(restaurantServices).toEqual(original);
  });
});
