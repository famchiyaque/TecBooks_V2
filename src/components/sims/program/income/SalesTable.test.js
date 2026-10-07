import { describe, it, expect } from "vitest";
import { buildSalesRows } from "./SalesTable.jsx";
import { computeNetSales } from "@/utils/dashboard/costCalculations";

// RF44 - Crear tabla estimación de ventas. Real pipeline (useIncome.js):
//   production = { purchaseOrders: {year: units}, salesPricePerUnit: {year: price} }
//   netSalesByYear = computeNetSales(production)         <- the actual CO x Price math
//   customerOrders/unitPrice/sales = years.map(year => ...)   <- year-keyed -> index-aligned array
//   buildSalesRows({customerOrders, unitPrice, sales, years}) <- arranges the 3 rows

const years = [2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035];

// "Customer Orders (COs)" and "Precio Dron Unitario" rows, taken from the
// live app screenshot for this project.
const purchaseOrders = {
  2025: 16000, 2026: 84881, 2027: 90823, 2028: 97180, 2029: 103981,
  2030: 111262, 2031: 119050, 2032: 127384, 2033: 136824, 2034: 141223, 2035: 149634,
};
const salesPricePerUnit = {
  2025: 8211.37, 2026: 8490.56, 2027: 8779.24, 2028: 9077.73, 2029: 9386.37,
  2030: 9705.51, 2031: 10035.50, 2032: 10376.71, 2033: 10729.51, 2034: 11094.32, 2035: 11471.52,
};

describe("RF44 - Crear tabla estimación de ventas", () => {
  describe("computeNetSales (CO x Precio Unitario)", () => {
    it("multiplica ordenes de cliente por precio unitario, año por año", () => {
      const netSalesByYear = computeNetSales({ purchaseOrders, salesPricePerUnit });
      years.forEach((year) => {
        expect(netSalesByYear[year]).toBeCloseTo(
          purchaseOrders[year] * salesPricePerUnit[year],
          2,
        );
      });
    });

    it("coincide (dentro del redondeo a centavos del precio mostrado) con el Total ingreso real de la app", () => {
      // El precio unitario que se ve en pantalla está redondeado a 2
      // decimales para mostrarse - el valor real que usa la multiplicación
      // internamente puede tener más precisión, así que el total exacto de
      // la screenshot puede diferir unos centavos/pesos del recalculo con el
      // precio redondeado. Por eso la tolerancia, no es un bug.
      const netSalesByYear = computeNetSales({ purchaseOrders, salesPricePerUnit });
      const totalIngresoReal = {
        2025: 131381952.0, 2026: 720687108.6, 2027: 797356700.36, 2028: 882173968.73,
        2029: 976004617.32, 2030: 1079854602.36, 2031: 1194726122.89, 2032: 1321826276.19,
        2033: 1468054978.65, 2034: 1566772749.0, 2035: 1716530010.16,
      };
      years.forEach((year) => {
        const relativeDiff = Math.abs(netSalesByYear[year] - totalIngresoReal[year]) / totalIngresoReal[year];
        expect(relativeDiff).toBeLessThan(0.0001); // < 0.01%
      });
    });

    it("acepta salesPricePerUnit como escalar plano (shape de la pagina standalone de Cost Table) y lo repite cada año", () => {
      const netSalesByYear = computeNetSales({ purchaseOrders, salesPricePerUnit: 100 });
      years.forEach((year) => {
        expect(netSalesByYear[year]).toBe(purchaseOrders[year] * 100);
      });
    });

    it("regresa 0 para un año sin precio definido", () => {
      const netSalesByYear = computeNetSales({
        purchaseOrders: { 2025: 16000 },
        salesPricePerUnit: {},
      });
      expect(netSalesByYear[2025]).toBe(0);
    });
  });

  describe("buildSalesRows (arma las 3 filas: Customer Orders, Unit Price, Total Income)", () => {
    const customerOrders = years.map((year) => purchaseOrders[year]);
    const unitPrice = years.map((year) => salesPricePerUnit[year]);
    const netSalesByYear = computeNetSales({ purchaseOrders, salesPricePerUnit });
    const sales = years.map((year) => netSalesByYear[year]);
    const rows = buildSalesRows({ customerOrders, unitPrice, sales, years });

    it("regresa exactamente 3 filas en el orden Customer Orders / Unit Price / Total Income", () => {
      expect(rows.map((row) => row.concept)).toEqual([
        "Customer Orders",
        "Unit Price",
        "Total Income",
      ]);
    });

    it('marca "Customer Orders" como unidades, no como moneda', () => {
      expect(rows[0].valueType).toBe("units");
    });

    it('marca "Total Income" como fila total (rowVariant)', () => {
      expect(rows[2].rowVariant).toBe("total");
    });

    it("alinea cada celda al año correcto por posicion (no por valor)", () => {
      years.forEach((year, i) => {
        expect(rows[0][String(year)]).toBe(customerOrders[i]);
        expect(rows[1][String(year)]).toBe(unitPrice[i]);
        expect(rows[2][String(year)]).toBeCloseTo(sales[i], 2);
      });
    });

    it("no rompe si years esta vacio (proyecto sin cbm todavia)", () => {
      const emptyRows = buildSalesRows({ customerOrders: [], unitPrice: [], sales: [], years: [] });
      expect(emptyRows).toHaveLength(3);
      expect(Object.keys(emptyRows[0])).toEqual(["concept", "valueType", "tooltip"]);
    });
  });
});
