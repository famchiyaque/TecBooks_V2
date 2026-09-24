# Design System: TecBooks (extraído del proyecto real)

> Este documento resume el sistema visual **actual** de TecBooks (app de bookkeeping/finanzas: dashboard + landing), extraído directamente del código (`tailwind.config.js`, `src/index.css`, `src/styles/*.css`, `components.json`). Está pensado para pegarse en Google Stitch como contexto de marca/UI existente, no como una propuesta nueva.

## 1. Visual Theme & Atmosphere
Producto financiero/ERP tipo bookkeeping con dos zonas de UI distintas:
- **Marketing/Landing** (`homepage.css`): hero con gradiente azul corporativo, tarjetas con sombra suave, CTA dorado, tono "confiable/banca".
- **Dashboard interno** (`kpi.css`, `forecasts.css`, `investments.css`, `production.css`, `statement.css`): denso, orientado a datos — tablas, gráficos (Highcharts/Recharts/FusionCharts/Chart.js), KPIs tipo gauge, sidebar de navegación fija azul marino.

Densidad: Dashboard 7-8 (Cockpit Dense), Landing 3-4 (Airy). Variance: baja-media (layouts bastante simétricos/predecibles, hero clásico texto-izquierda). Motion: baja-media — transiciones CSS simples, sin motion library (no framer-motion, solo `tailwindcss-animate` + `@keyframes` manuales).

## 2. Color Palette & Roles (valores reales encontrados en el código)

### Marca / Brand
- **Navy Ink** `#073a5a` — Color de marca primario. Sidebar, textos de marca, bordes de botones outline, títulos del landing.
- **Gold Accent** `#eec60a` — Acento único de marca. CTA principal del landing, indicador de item activo en el sidebar, hover de links de nav.
- **Sky Blue Gradient family** `#0a4d68 → #28a1ed → #73c2f3` — Gradiente del hero (`.landing`), usado en 135deg/20deg diagonales.
- **Ice Blue** `#e4f1fe`, `#bee3f9` — Fondos suaves de tarjetas/secciones sobre el gradiente.

### Acentos secundarios de datos (dashboard, no siempre consistentes)
- `#00b4d8` (cyan) — botones/focus ring en `forecasts.css`.
- `#1e90ff` / `#0492c2` / `#0ea5e9` / `#2563eb` — azules usados sueltos en KPI, investments, production, general.css (variantes no unificadas — señal para Stitch: consolidar a un solo azul).
- `#007bff` / `#0056b3` — azul "bootstrap" en `statement.css` (inconsistente con el navy de marca).

### Estados / semántico
- **Success**: `#22c55e`, `#33ff57`
- **Warning**: `#ffa500`, `#ffdd33`, `#eec60a`
- **Danger**: `#ef4444`, `#ff5733`

### Sistema neutro (shadcn/ui, `baseColor: slate`, HSL vars en `index.css`)
- `--background`: `hsl(0 0% 100%)` blanco
- `--foreground`: `hsl(222.2 84% 4.9%)` casi negro azulado
- `--muted-foreground`: `hsl(215.4 16.3% 46.9%)` ≈ `#64748b`
- `--border` / `--input`: `hsl(214.3 31.8% 91.4%)` ≈ `#e2e8f0`
- `--radius`: `0.5rem` (radio base de shadcn)
- Modo oscuro (`.dark`) ya definido con las mismas variables invertidas (fondo `hsl(222.2 84% 4.9%)`).
- **Chart palette** (`--chart-1..5`): `hsl(12 76% 61%)`, `hsl(173 58% 39%)`, `hsl(197 37% 24%)`, `hsl(43 74% 66%)`, `hsl(27 87% 67%)` — paleta categórica para gráficos, actualmente sin relación directa con el navy/gold de marca.

**Nota para Stitch:** hay colores duplicados/redundantes para "azul" (`#073a5a`, `#00b4d8`, `#1e90ff`, `#0492c2`, `#0ea5e9`, `#2563eb`, `#007bff`) que vienen de código escrito en momentos distintos. El único par realmente consistente en toda la app es **Navy `#073a5a` + Gold `#eec60a`**; ese es el par de marca a preservar.

## 3. Typography Rules

**Situación real:** no hay una tipografía de marca deliberada. `index.html` importa 8 Google Fonts a la vez (Roboto, Inter, Open Sans, Lato, Montserrat, Poppins, Nunito, Raleway) pero el CSS casi nunca las referencia — es probablemente residuo de pruebas, no una decisión de diseño.

- **Fuente efectiva en pantalla:** stack de sistema — `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ... sans-serif` (`src/index.css`), y en varias vistas de dashboard directamente `Arial, sans-serif` (`kpi.css`, `production.css`, `statement.css`) o `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif` (landing, investments).
- **Pesos usados:** 400 (texto), 500-600 (labels, brand-name, botones), 700 (títulos KPI/H1).
- **Mono:** ninguna definida explícitamente salvo el fallback `code { font-family: source-code-pro, Menlo, Monaco, Consolas, monospace }` y un uso puntual de `monospace` en la nav.
- **Recomendación para Stitch:** elegir UNA familia sans deliberada para reemplazar el stack de sistema (evitar Inter por genérico dado que el proyecto ya lo tiene importado sin usar). Mantener Arial/system como fallback de compatibilidad en dashboards densos si se requiere rendering rápido en tablas grandes.

## 4. Component Stylings (según CSS actual)

- **Botones:**
  - Primario landing (`.landing-btn`): fondo Gold `#eec60a`, texto blanco, `border-radius: 6px`, `box-shadow: rgba(0,0,0,0.1) 0 2px 4px`.
  - Outline (`.more-a`): borde Navy 2px, texto Navy, `border-radius: 20px` (pill), fondo blanco 90% opacidad, uppercase + letter-spacing 1px.
  - Transición estándar: `transition: all 0.2s-0.3s ease` (o `ease-in-out`); en forecasts, `cubic-bezier(.4,0,.2,1)` a 0.1s.
- **Sidebar de navegación** (`globalNavigation.css`): fijo, fondo Navy `#073a5a`, texto blanco, ancho 280px, `transition: width 0.3s ease, transform 0.3s ease` para colapsar/expandir; ítem activo con `border-left: 3px solid #eec60a` y texto en Gold; overlay backdrop `rgba(0,0,0,0.5)` con `fadeIn 0.3s`.
- **Cards** (`.user-card`, tarjetas de landing): `border-radius: 15px`, sombra doble (`0 10px 15px -3px` + `0 4px 6px -2px`), gradiente sutil blanco→gris muy claro, hover eleva con `translateY(-8px)` + sombra más profunda + borde cambia a Navy.
- **KPI gauges** (`kpi.css`): anillos SVG (`stroke-dashoffset`) con `transition: stroke-dashoffset 0.5s ease`, track gris `#e5e7eb`, progreso naranja `#ffa500`.
- **Tooltips** (`tooltip.css`): fondo `#333`, texto blanco, esquinas redondeadas pequeñas.
- **Loader** (`homepage.css` `l13`): spinner CSS puro vía `conic-gradient` + `mask`, `animation: l13 1s infinite linear` — no es un spinner circular genérico de librería.
- **Radios base:** shadcn `--radius: 0.5rem` para componentes `ui/` (Radix + CVA), pero CSS legacy usa radios ad-hoc (6px, 15px, 20px) — inconsistente entre sistema shadcn y CSS clásico.

## 5. Layout Principles
- Landing: hero clásico texto-izquierda sobre gradiente diagonal, con blobs radiales decorativos (`::before` con `radial-gradient` transparente) — no asimétrico, layout centrado/predecible.
- Dashboard: sidebar fijo + contenido con `margin-left` que se ajusta on collapse (`transition: margin-left 0.3s ease`), grids de tarjetas KPI, tablas para statements/production.
- Carrusel de logos/usuarios: track infinito vía `@keyframes slide` (`translateX(0)` → `translateX(-100%)`), 30s linear infinite — patrón de marquee clásico, no una librería.
- Mezcla de sistemas de layout: Tailwind (dashboard nuevo, `ui/` shadcn) + CSS clásico por vista (`src/styles/*.css`) + `styled-components`/Emotion en algunos gráficos (`StyledWrapper.jsx`). Para Stitch: tratar el dashboard nuevo (Tailwind + shadcn "new-york") como el sistema objetivo a extender, no el CSS legacy.

## 6. Motion & Interaction (inventario real, sin librería de motion)
- No hay Framer Motion ni GSAP — solo CSS `transition`/`@keyframes` y el plugin `tailwindcss-animate`.
- **Duraciones dominantes:** 0.2s–0.3s `ease`/`ease-in-out` para hover (transform, box-shadow, background-color, border).
- **Keyframes existentes:**
  - `fadeIn` 0.3s ease — overlay de sidebar.
  - `slideIn` 0.3s ease (translateX -10px→0 + opacity) — nombre de marca al expandir sidebar.
  - `itemFadeIn` 0.2s ease — ítems de menú.
  - `pulse` 2s infinite — indicadores/badges.
  - `slide` 30s infinite linear — marquee de carrusel.
  - `l13` 1s infinite linear — loader spinner custom.
  - `App-logo-spin` 20s infinite linear (rotate 360°) — solo en boilerplate CRA, probablemente no usado en producción.
- Respeta `prefers-reduced-motion` en al menos un lugar (`App-logo`) y desactiva animación/transition en nav (`@media (prefers-reduced-motion: reduce)` en `globalNavigation.css`).
- Hover states consistentes: `translateY(-8px)` en cards, `scale(1.1)` en imágenes dentro de cards, cambio de `border-color`/`background-color`.

## 7. Anti-Patterns / Inconsistencias detectadas (a resolver, no a copiar)
- 8 Google Fonts importadas sin uso real — limpiar y fijar una sola familia.
- Múltiples azules no unificados (`#00b4d8`, `#1e90ff`, `#0492c2`, `#0ea5e9`, `#2563eb`, `#007bff`) compitiendo con el Navy de marca `#073a5a`.
- Radios de borde inconsistentes entre shadcn (`0.5rem` var) y CSS legacy (6px/15px/20px hardcoded).
- Mezcla de 4 librerías de gráficos (Highcharts, Recharts, FusionCharts, Chart.js) con estilos de tooltip/color propios cada una.
- Mezcla de MUI + Radix/shadcn + styled-components + Emotion + CSS puro conviviendo — para trabajo nuevo, preferir Tailwind + shadcn (`components.json` ya está configurado con `style: new-york`, `baseColor: slate`, `iconLibrary: lucide`).

## 8. Resumen para copiar/pegar en Stitch

```
Brand colors: Primary Navy #073a5a, Accent Gold #eec60a.
Supporting blue gradient: #0a4d68 → #28a1ed → #73c2f3 (landing hero).
Neutrals: shadcn/ui "slate" base — background #ffffff, foreground near-black
(hsl(222.2 84% 4.9%)), muted text #64748b, border #e2e8f0, radius 0.5rem.
Status colors: success #22c55e, warning #eec60a/#ffa500, danger #ef4444.
Typography: system sans-serif stack (Segoe UI / Roboto / Arial fallback),
no distinctive display font currently — open to establishing one.
Component style: shadcn "new-york", Radix primitives, lucide icons,
Tailwind utility classes, CVA variants.
Motion: subtle CSS transitions only, 0.2-0.3s ease, hover lift on cards
(translateY -8px), sidebar slide/fade 0.3s, no motion library — safe to
introduce spring-based motion for new screens.
Product type: bookkeeping/financial ERP dashboard (KPIs, forecasts,
investments, statements, production) + marketing landing page.
```
