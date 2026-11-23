-- Apply once if using a database account that cannot run the automatic migration.
-- Existing project records and demo URLs are preserved.
ALTER TABLE projects ADD COLUMN case_study TEXT NULL;
ALTER TABLE projects ADD COLUMN featured TINYINT(1) NOT NULL DEFAULT 0;
