-- Crear usuario
BEGIN TRANSACTION;

INSERT OR IGNORE INTO "roles" ("role")
VALUES ('teacher');

INSERT OR IGNORE INTO "schools" (
	"name",
	"slug",
	"domain",
	"country",
	"city",
	"contact_email",
	"created_at"
)
VALUES (
	'TecBooks Demo School',
	'tecbooks-demo-school',
	'tecbooks.local',
	'Mexico',
	'Mexico City',
	'admin@tecbooks.local',
	datetime('now')
);

INSERT OR IGNORE INTO "users" (
	"school_id",
	"email",
	"first_name",
	"last_name",
	"role_id",
	"hashed_password",
	"created_at"
)
VALUES (
	(SELECT "id" FROM "schools" WHERE "slug" = 'tecbooks-demo-school'),
	'teacher@tecbooks.local',
	'Demo',
	'Teacher',
	(SELECT "id" FROM "roles" WHERE "role" = 'teacher'),
	NULL,
	datetime('now')
);

COMMIT;

-- Insertar información de la sesión
BEGIN TRANSACTION;

INSERT OR IGNORE INTO "classes" (
	"school_id",
	"teacher_id",
	"name",
	"created_at"
)
VALUES (
	(SELECT "id" FROM "schools" WHERE "slug" = 'tecbooks-demo-school'),
	(SELECT "id" FROM "users" WHERE "email" = 'teacher@tecbooks.local'),
	'Business Finance Simulation',
	datetime('now')
);

INSERT OR IGNORE INTO "games" (
	"class_id",
	"created_by",
	"name",
	"status",
	"created_at",
	"updated_at"
)
VALUES (
	(
		SELECT "id"
		FROM "classes"
		WHERE "school_id" = (SELECT "id" FROM "schools" WHERE "slug" = 'tecbooks-demo-school')
			AND "teacher_id" = (SELECT "id" FROM "users" WHERE "email" = 'teacher@tecbooks.local')
			AND "name" = 'Business Finance Simulation'
	),
	(SELECT "id" FROM "users" WHERE "email" = 'teacher@tecbooks.local'),
	'Business Finance Simulation',
	'draft',
	datetime('now'),
	datetime('now')
);

INSERT OR IGNORE INTO "premises" (
	"game_id",
	"starting_money",
	"exchange_rate",
	"national_leading_rate",
	"cpp",
	"cetes",
	"libor",
	"national_inflation",
	"foreign_inflation",
	"isr",
	"impac",
	"ptu",
	"periods"
)
VALUES (
	(
		SELECT "id"
		FROM "games"
		WHERE "class_id" = (
			SELECT "id"
			FROM "classes"
			WHERE "school_id" = (SELECT "id" FROM "schools" WHERE "slug" = 'tecbooks-demo-school')
				AND "teacher_id" = (SELECT "id" FROM "users" WHERE "email" = 'teacher@tecbooks.local')
				AND "name" = 'Business Finance Simulation'
		)
			AND "created_by" = (SELECT "id" FROM "users" WHERE "email" = 'teacher@tecbooks.local')
			AND "name" = 'Business Finance Simulation'
	),
	10000,
	16.66,
	0.16,
	0.28,
	0.332,
	0.077,
	0.043,
	0.1,
	0.34,
	1.8,
	0.1,
	60
);

-- Insertar máquinas y asignarlas al equipo

SELECT * FROM "assets";

INSERT INTO "assets" (
	"name",
	"category",
	"maintenance_cost",
	"production_rate"
)
VALUES
('Elaboración placa base', 'machine', 2800000, 60),
('Ensamble base', 'machine', 2400000, 12),
('Ensamble 14', 'machine', 2000000, 12),
('Ensamble 15', 'machine', 112000, 120);

INSERT INTO "game_teams" (
	"game_id",
	"name",
	"capital",
	"status",
	"created_at"
)
SELECT
	"id",
	'Equipo Demo',
	0,
	'ready',
	datetime('now')
FROM "games"
WHERE "name" = 'Business Finance Simulation'
	AND NOT EXISTS (
		SELECT 1
		FROM "game_teams"
		WHERE "game_id" = "games"."id"
			AND "name" = 'Equipo Demo'
	);

INSERT INTO "game_team_assets" (
	"game_team_id",
	"asset_id",
	"quantity",
	"unit_price",
	"acquired_at",
	"status"
)
SELECT
	(
		SELECT "id"
		FROM "game_teams"
		WHERE "game_id" = (
			SELECT "id" FROM "games"
			WHERE "name" = 'Business Finance Simulation'
		)
			AND "name" = 'Equipo Demo'
	),
	"id",
	1,
	"maintenance_cost",
	'2025',
	'active'
FROM "assets"
WHERE "name" IN (
	'Elaboración placa base',
	'Ensamble base',
	'Ensamble 14',
	'Ensamble 15'
)
	AND NOT EXISTS (
		SELECT 1
		FROM "game_team_assets" AS "existing"
		WHERE "existing"."game_team_id" = (
			SELECT "id"
			FROM "game_teams"
			WHERE "game_id" = (
				SELECT "id" FROM "games"
				WHERE "name" = 'Business Finance Simulation'
			)
				AND "name" = 'Equipo Demo'
		)
			AND "existing"."asset_id" = "assets"."id"
	);

COMMIT;


-- Insert expenses

INSERT INTO "expenses" (
    "game_id",
    "category",
    "subcategory",
    "name",
    "description",
    "default_cost",
    "expense_type",
    "notes"
)
VALUES
(
    1,
    'Servicios Básicos',
    'Electricidad',
    'Electricidad',
    'Consumo de energía para oficinas, equipos, aire acondicionado, iluminación.',
    60000,
    'fixed',
    'Depende mucho del tamaño del espacio, el uso de equipo (servidores, maquinaria), y la tarifa CFE (p.ej., PDBT, GDMTO). Empresas con subestación propia pueden tener tarifas diferentes.'
),
(
    1,
    'Servicios Básicos',
    'Agua',
    'Agua',
    'Consumo de agua para baños, cocina, limpieza.',
    8000,
    'fixed',
    'Las tarifas varían por municipio y tipo de uso (comercial/industrial). El volumen de consumo es clave.'
),
(
    1,
    'Servicios Básicos',
    'Telefonía Fija',
    'Telefonía Fija',
    'Líneas telefónicas para comunicación interna y externa.',
    5000,
    'fixed',
    'Paquetes con múltiples líneas y llamadas ilimitadas suelen ser más económicos por línea.'
),
(
    1,
    'Servicios Básicos',
    'Internet',
    'Internet',
    'Conexión de banda ancha para toda la empresa (fibra óptica es recomendable).',
    8000,
    'fixed',
    'Variará según la velocidad (MBs), el proveedor y si incluye servicios adicionales (ej. VPN, IP fija). Para 50-100 empleados se requiere un servicio de alta velocidad y estabilidad.'
),
(
    1,
    'Otros Servicios',
    'Limpieza',
    'Limpieza',
    'Servicio de personal de limpieza o empresa de outsourcing.',
    30000,
    'fixed',
    'Puede ser personal interno o un servicio externo por horas/días. Depende del tamaño de las instalaciones y la frecuencia.'
),
(
    1,
    'Otros Servicios',
    'Seguridad',
    'Seguridad',
    'Sistemas de alarma, cámaras, y/o personal de seguridad.',
    25000,
    'fixed',
    'Varía según el nivel de seguridad deseado y si es un servicio de monitoreo o personal en sitio.'
),
(
    1,
    'Otros Servicios',
    'Mantenimiento',
    'Mantenimiento',
    'Mantenimiento de instalaciones (aire acondicionado, plomería, electricidad, etc.).',
    15000,
    'fixed',
    'Puede ser preventivo o correctivo. Algunos meses serán más altos que otros.'
),
(
    1,
    'Gastos Administrativos',
    'Sueldos y Salarios',
    'Personal Administrativo',
    'Personal de contabilidad, recursos humanos, recepcionistas, asistentes, gerentes administrativos, etc.',
    NULL,
    'fixed',
    'Este es el gasto más significativo. Incluye salarios brutos, prestaciones (IMSS, Infonavit, etc.) y beneficios. Muy variable según la estructura de la empresa y los salarios de mercado.'
),
(
    1,
    'Gastos Administrativos',
    'Renta de Oficina/Espacio',
    'Renta de Oficina/Espacio',
    'Alquiler del inmueble donde opera la PyME.',
    200000,
    'fixed',
    'Altamente dependiente de la ubicación (zona, ciudad), el tamaño del espacio y las amenidades.'
),
(
    1,
    'Gastos Administrativos',
    'Materiales de Oficina',
    'Materiales de Oficina',
    'Papelería, tóner, plumas, artículos de escritorio, etc.',
    8000,
    'fixed',
    'Varía con el volumen de uso y si hay digitalización de procesos.'
),
(
    1,
    'Gastos Administrativos',
    'Software y Licencias',
    'Software y Licencias',
    'Software contable, CRM, ERP, paquetería de oficina, software especializado.',
    15000,
    'fixed',
    'Muchos softwares se pagan por licencia o por usuario. Un ERP para 50-100 empleados puede ser una inversión significativa.'
),
(
    1,
    'Gastos Administrativos',
    'Servicios de Contabilidad/Fiscales',
    'Servicios de Contabilidad/Fiscales',
    'Despacho contable externo para gestión fiscal y contable.',
    20000,
    'fixed',
    'Depende de la complejidad de la operación y el volumen de transacciones.'
),
(
    1,
    'Gastos Administrativos',
    'Asesoría Legal',
    'Asesoría Legal',
    'Servicios de consultoría legal para contratos, temas laborales, compliance.',
    15000,
    'fixed',
    'Puede ser un pago recurrente por iguala o por proyecto. Varía según la necesidad.'
),
(
    1,
    'Gastos Administrativos',
    'Seguros',
    'Seguros',
    'Seguro de responsabilidad civil, seguro de oficina, seguro de equipo.',
    5000,
    'fixed',
    'Pagos anuales que se prorratean mensualmente.'
),
(
    1,
    'Gastos Administrativos',
    'Capacitación y Desarrollo',
    'Capacitación y Desarrollo',
    'Cursos, talleres, seminarios para el personal administrativo.',
    10000,
    'fixed',
    'Inversión en el crecimiento y habilidades del equipo. Puede ser variable.'
),
(
    1,
    'Gastos Administrativos',
    'Gastos de Viaje y Representación',
    'Gastos de Viaje y Representación',
    'Viáticos, comidas de negocios, transporte para reuniones.',
    10000,
    'fixed',
    'Depende de la naturaleza del negocio y la frecuencia de viajes.'
),
(
    1,
    'Gastos Administrativos',
    'Publicidad y Marketing',
    'Publicidad y Marketing (Interno)',
    'Materiales de comunicación interna, eventos para empleados.',
    5000,
    'fixed',
    'Si hay un departamento de marketing interno, sus gastos se imputarían aquí.'
),
(
    1,
    'Gastos Administrativos',
    'Otros',
    'Insumos de Cocina y Cafetería',
    'Café, agua embotellada, snacks para empleados y visitas.',
    4000,
    'fixed',
    'Detalles que contribuyen al ambiente laboral.'
);

-- ============================================================
-- CREAR EMPLEADOS
-- ============================================================

INSERT INTO employees (
    name,
    job_title,
    base_salary,
    efficiency,
    schedule,
    integrated_salary
)
VALUES
(
    'Operador',
    'MOD Operador',
    12000.00,
    1.0,
    'full-time',
    17515.38
),
(
    'Materiales',
    'MOID Materiales',
    10000.00,
    1.0,
    'full-time',
    14596.15
),
(
    'Técnico Pruebas',
    'MOID Técnico Pruebas',
    15000.00,
    1.0,
    'full-time',
    21894.23
),
(
    'Supervisor',
    'MOD Supervisor',
    15000.00,
    1.0,
    'full-time',
    21894.23
),
(
    'Técnico Calidad',
    'MOID Técnico Calidad',
    16500.00,
    1.0,
    'full-time',
    24083.65
),
(
    'Técnico Producto',
    'MOID Técnico Producto',
    16500.00,
    1.0,
    'full-time',
    24083.65
),
(
    'Ingeniero Procesos',
    'IM Ingeniero Procesos',
    21000.00,
    1.0,
    'full-time',
    30651.92
),
(
    'Ingeniero de Calidad',
    'IM Ingeniero de Calidad',
    21000.00,
    1.0,
    'full-time',
    30651.92
),
(
    'Ingeniero de Producto',
    'Ingeniero de Producto',
    16500.00,
    1.0,
    'full-time',
    24083.65
),
(
    'Gerente de Operaciones',
    'Gerente de Operaciones',
    35000.00,
    1.0,
    'full-time',
    51086.54
),
(
    'Recursos Humanos',
    'Recursos Humanos',
    21000.00,
    1.0,
    'full-time',
    30651.92
),
(
    'Finanzas y Contabilidad',
    'Finanzas y Contabilidad',
    25000.00,
    1.0,
    'full-time',
    36490.38
),
(
    'Compras',
    'Compras',
    21000.00,
    1.0,
    'full-time',
    30651.92
),
(
    'Mercadotecnia',
    'Mercadotecnia',
    18000.00,
    1.0,
    'full-time',
    26273.08
),
(
    'Logística',
    'Logística',
    25000.00,
    1.0,
    'full-time',
    36490.38
),
(
    'Secretaria Ejecutiva',
    'Secretaria Ejecutiva',
    25000.00,
    1.0,
    'full-time',
    36490.38
),
(
    'Gerente General',
    'Gerente General',
    50000.00,
    1.0,
    'full-time',
    72980.77
),
(
    'Limpieza y Mantenimiento',
    'Limpieza y Mtto',
    10000.00,
    1.0,
    'full-time',
    14596.15
),
(
    'Seguridad',
    'Seguridad',
    10000.00,
    1.0,
    'full-time',
    14596.15
),
(
    'Secretaria',
    'Secretaria',
    15000.00,
    1.0,
    'full-time',
    21894.23
);

-- ============================================================
-- ASIGNAR EMPLEADOS AL EQUIPO
-- game_team_id = 1
-- ============================================================

INSERT INTO game_team_employees (
    game_team_id,
    employee_id,
    employee_name,
    salary,
    hired_at
)
SELECT
    1,
    id,
    name,
    integrated_salary,
    datetime('now')
FROM employees
WHERE name IN (
    'Operador',
    'Materiales',
    'Técnico Pruebas',
    'Supervisor',
    'Técnico Calidad',
    'Técnico Producto',
    'Ingeniero Procesos',
    'Ingeniero de Calidad',
    'Ingeniero de Producto',
    'Gerente de Operaciones',
    'Recursos Humanos',
    'Finanzas y Contabilidad',
    'Compras',
    'Mercadotecnia',
    'Logística',
    'Secretaria Ejecutiva',
    'Gerente General',
    'Limpieza y Mantenimiento',
    'Seguridad',
    'Secretaria'
);