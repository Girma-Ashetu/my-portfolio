-- Apply once to the existing portfolio database. Does not remove any project data.
ALTER TABLE projects ADD COLUMN demo_url VARCHAR(2048) NULL AFTER link;
ALTER TABLE projects MODIFY COLUMN link VARCHAR(2048);
