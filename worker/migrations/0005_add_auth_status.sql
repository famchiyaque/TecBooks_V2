-- Cierra el gap documentado en RF76 (login.plantuml): la tabla "users" no
-- tenia columnas para status de cuenta ni vinculo con Clerk.

ALTER TABLE "users" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'active';
ALTER TABLE "users" ADD COLUMN "clerk_user_id" TEXT;
