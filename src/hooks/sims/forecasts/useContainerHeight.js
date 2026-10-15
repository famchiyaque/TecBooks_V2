import { useEffect, useRef, useState } from "react";

/**
 * Mide el alto real (px) de un contenedor via ResizeObserver - para darle a
 * Highcharts un numero exacto (chart.height) en vez de depender de que un
 * porcentaje CSS se resuelva correctamente dentro de un layout flex.
 * Devuelve [ref, height] - height es 0 hasta el primer resize observado.
 */
export default function useContainerHeight() {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setHeight(entry.contentRect.height);
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return [ref, height];
}
