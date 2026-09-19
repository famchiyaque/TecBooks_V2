-- Manual test-data seed for RF76 login testing. NOT a migration:
-- keep out of migrations/ so it never runs against remote/production DBs.
-- Run with: wrangler d1 execute tecbooks-db --local --file=./seed/test_login_user.sql

INSERT INTO schools (name, slug, active, created_at)
SELECT 'TecBooks Test School', 'tecbooks-test', 1, datetime('now')
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE slug = 'tecbooks-test');

INSERT INTO roles (role)
SELECT 'admin'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE role = 'admin');

-- email: test.login@tecbooks.dev / password: TecBooks!Test2026
INSERT INTO users (school_id, email, first_name, last_name, role_id, hashed_password, status, clerk_user_id, created_at)
SELECT
  (SELECT id FROM schools WHERE slug = 'tecbooks-test'),
  'test.login@tecbooks.dev',
  'Test',
  'User',
  (SELECT id FROM roles WHERE role = 'admin'),
  '$2a$10$RbUBNu5sJ6hn86MZ5ONTseEQ5JE2WwIbtc2rGq0v/56fsYI8Xk0rO',
  'active',
  'user_3IQvSJSMm0vGgQJ3dCmC9yiq0sY',
  datetime('now')
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'test.login@tecbooks.dev');
