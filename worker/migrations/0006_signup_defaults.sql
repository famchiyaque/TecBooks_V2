-- Default role/school for self-service sign up (RF76 companion flow).
-- New users register without admin approval and land here until real
-- school onboarding / role assignment exists.

INSERT INTO "roles" ("role") VALUES ('student');

INSERT INTO "schools" ("name", "slug", "active", "created_at")
VALUES ('General', 'general', 1, datetime('now'));
