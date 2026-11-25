# Girma Ashetu — Portfolio

[Live portfolio](https://my-portfolio-ac-0af9.vercel.app) · [GitHub Pages portfolio](https://girma-ashetu.github.io/)

A responsive React/Vite portfolio with a MySQL-backed project catalogue and an authenticated content studio. The main experience includes Home, About, Work, Skills, Contact, and Studio. NestJS, Django, and Angular are listed as frameworks currently being learned.

## Local development

Use Node.js 24 and MySQL. Run npm ci from the repository root. The root postinstall script installs the client dependencies.

Configure the root `.env` with your database connection and administrator credentials. Use `.env.example` as a reference without copying real secrets into source control.

- `npm start` runs the Express API and built frontend on port 5001.
- `npm run dev --prefix client` runs Vite on port 5173 and proxies `/api` to port 5001. Run it alongside the API during development.
- `npm run build --prefix client` creates the production frontend in `dist`.
- `npm test` runs validation, project API, database migration, authentication, contact delivery, and stale-cache regression tests.
- `npm run db:migrate` checks and upgrades the existing project schema without deleting records. It is safe to run again.
- `npm run verify:demos` verifies creating a project and adding, editing, removing, and reading demo URLs using real MySQL inside a transaction. It rolls back the temporary test record.

For local development only, when `ADMIN_PASS` is not configured, the existing `admin` / `admin123` development account is available. Production and Vercel deployments require a configured administrator account and `JWT_SECRET`. Set `ADMIN_USER` and `ADMIN_PASS`, or use a bcrypt-hashed account in the `admins` table. The old dummy-token authentication bypass is removed.

## Add a project or live demo

1. Open `/admin` or select **Studio** in the footer and sign in.
2. Choose **Add project**. Provide a title, short description, and comma-separated technologies. Optionally add a longer project story, source-code URL, demo URL, and screenshot URL or bundled image filename.
3. Choose **Save project**. The API reads the row back before confirming a successful save.
4. For an existing project, choose **Add demo** or **Edit demo**, paste the published application or video walkthrough URL, and select **Save demo**. There is no need to edit the other project fields.
5. Use **Test demo link** to open the entered address before saving. Clear the demo field and save to remove an existing demo.

A missing `https://` prefix is added to ordinary domain names. Invalid URLs and embedded credentials are rejected. The demo and source-code addresses are stored independently. Demo badges and **Try live demo** links appear on project cards and in the project detail dialog. The **Live demos** filter displays only projects with a valid demo address.

Saved changes invalidate the catalogue cache in the current tab and notify other tabs. Refocusing the portfolio also refreshes the catalogue. Older requests cannot overwrite newer saved demo data.

A demo URL opens an application or walkthrough you have already published elsewhere; adding the URL does not host that application inside this portfolio. Screenshots should use a public URL or a file placed in `client/public`. This studio uses URL-based screenshots so it works with both persistent Express hosting and Vercel serverless hosting.

## Database setup

The demo migration has been applied successfully to the configured database in this workspace. The first authenticated project save also checks the schema and adds missing `demo_url` and `long_description` columns, and expands the source URL column when required. Existing project data is preserved. For deployments whose app account cannot alter tables, run `npm run db:migrate` once with a database administrator account.

For a new database, use `schema.sql`. Do not run `initDB.js` as a migration for existing content: that seed script drops the projects table.

Failed queries now reject instead of returning empty successful results. The studio displays database or validation failures and retains the form contents for retrying. A save cannot succeed silently while the database is offline.

## Contact and delivery

The contact form validates its fields and confirms receipt only after the message has been saved in MySQL or email delivery has succeeded. When both delivery paths are unavailable, it displays a direct email alternative. Configure `GMAIL_USER` and `GMAIL_APP_PASSWORD` to enable email notifications. Inquiry messages can be read and replied to from the studio.

## Design and performance

The interface uses a consistent dark/light palette, oversized typography, a framed portrait, a larger featured project, restrained hover effects, responsive layouts, and a dedicated learning section. Native project dialogs support focus containment, Escape dismissal, and focus restoration. Reduced-motion preferences are respected. Legacy AI artwork and missing screenshots receive a project-specific interface concept, clearly labelled as an illustration with sample data. Custom screenshots take priority and retain their full composition.

Current production build measurements:

- Initial application CSS: 49.32 KB before gzip (9.73 KB compressed), compared with 217.87 KB before the original cleanup.
- Initial application JavaScript entry: 42.80 KB before gzip (11.96 KB compressed), with the shared React/router runtime approximately unchanged at 231.05 KB. Secondary routes and legacy translations are loaded separately.
- Optimized portrait: 48,462 bytes, compared with 309,872 bytes originally.
- Six optimized legacy illustrations are retained on disk (677,219 bytes total); the default project gallery no longer loads these AI images.

The main public routes do not load external font, Bootstrap, or icon stylesheets. Images below the fold are lazy loaded and reserve layout space; the hero portrait is prioritized. Hashed build assets have immutable cache headers, while project API responses are not browser-cached.

These figures describe build assets, not a Lighthouse score or real-user Core Web Vitals. Verification included 30 automated checks, a real MySQL demo lifecycle test with rollback, desktop/mobile browser checks, studio validation and save confirmation, project filters, keyboard dismissal/focus restoration, theme switching, and narrow-width overflow checks. Real third-party demo availability depends on the URL you supply.

After replacing the original screenshots or portrait, regenerate the optimized JPEGs with `./scripts/optimize-images.ps1` on Windows. Original images are retained.

## Deployment

Deploy the updated frontend and API together. Vercel serves `dist` and routes `/api/*` through `api/index.js`; the standalone Express entry is `server.js`. Both use the same project handlers and demo PATCH endpoint. Set the production environment variables shown in `.env.example`. Existing legacy certification, experience, and achievement routes remain accessible.

## Project artwork

The gallery uses code-defined interface concepts for security scanning, personal finance, cloud storage, commerce, academic registration, banking, delivery pipelines, and portfolio projects. These previews use normal HTML/CSS rather than fetching AI-rendered stock artwork. They are illustrative concepts with sample data, not claimed screenshots of the deployed applications.

To display an actual screenshot, open Studio, choose Edit project, and enter its public URL or a new file path under client/public. The editor previews the result before saving. Use “Use interface concept instead” to return to the supplied design. Existing legacy illustration filenames are automatically replaced visually; stored project records and original image files are preserved.

Project search works together with the category filters and announces the number of results. An unmatched search offers a reset to the full collection. The final card fills the remaining row on wider screens and stacks on mobile.

## Student showcase and case studies

The SOS Student Record System is prioritized first. Its source was reviewed from the supplied SRS checkout, and its repository remote resolves to https://github.com/Girma-Ashetu/SOS-SRS. The earlier Java/Swing stack was corrected to the verified JavaScript/HTML/CSS/Bootstrap frontend, Node.js/Express backend, MySQL persistence, and Socket.IO notification layer. The project owner confirmed responsibility for the full-stack implementation within an academic team project. No assessment score, deployment success, usage figure, or institutional compliance claim was inferred.

The screenshot at client/public/srs-login.jpg is captured from the actual public login page using a temporary static preview. No real student records were opened or exported. The supplied SRS source was not modified, and its backend was not started for the screenshot. The demo URL remains empty because the application has not been publicly deployed.

Studio now supports optional My contribution, The problem, Technical approach, What was built, and Lessons learned sections, plus a featured-project checkbox. Empty sections stay hidden. The API stores these notes as structured JSON in the case_study text column and returns parsed data. Existing records work without case-study content; the additive migration creates case_study and featured when needed. Demo edits preserve both fields.

The existing Student record was updated with npm run showcase:student; the original is backed up in the ignored .local/student-showcase-before.json file. The command only updates a uniquely matched existing Student record.

For a free-only SRS demo, the researched candidate setup is Render Free for the Express application, TiDB Cloud Starter for MySQL-compatible SQL, and Supabase Free for file storage with a private bucket. These are proposals, not configured services. Render can sleep and its filesystem is ephemeral; Supabase Free can pause after inactivity; TiDB's free quota restricts usage. Check the current official plan details before provisioning: https://render.com/docs/free, https://docs.pingcap.com/tidbcloud/select-cluster-tier/?compatibility=mysql&plan=starter, and https://supabase.com/pricing.

Before a public SRS demo, prepare a fictitious-data database and check its schema against TiDB. Update database port/TLS configuration, correct the upload-path mismatch and protect document downloads, and authenticate Socket.IO connections. These changes belong in the SRS application, not in the portfolio. A public demo and hosted production checks are still pending.

### Recovering the local project catalogue

If the public site shows saved highlights and a **Retry connection** button:

1. Open Windows **Services** as an administrator and start **MySQL80**. The portfolio uses the database configured in `.env`; do not initialize or replace the database.
2. Keep the Express API running with `npm start` (or run both frontend and API using `npm run dev`).
3. Click **Retry connection** on the portfolio. A successful request replaces the highlights with the database catalogue.

A stopped database prevents project/demo edits from being saved. The site reports this failure instead of confirming a write. The bundled Student Record System and Developer Portfolio images are actual locally captured screenshots; other interface concepts remain labelled as sample data.

### Production mobile audit — 23 November 2026

Lighthouse 12.8.2 was run against the Vite production preview with its default simulated mobile configuration. Final scores: performance 98, accessibility 100, best practices 96, SEO 100. Largest Contentful Paint was 2.2 seconds and Cumulative Layout Shift was 0. Local simulated scores vary and do not establish deployed or real-user performance. The project API returned an error because the local backend/database connection was unavailable; this remains a real unresolved issue.

The audit-driven changes add a portrait preload, a valid robots.txt, responsive 480/900-pixel derivatives of the real project screenshots, stronger contrast in the banking concept, and a separately labelled image-opening button so the illustrative UI text does not become the button's visible label. Screenshot originals remain available for large screens and project dialogs. The small derivatives are 8,632 bytes (SRS) and 19,036 bytes (portfolio), compared with originals of 37,248 and 63,844 bytes. Browsers choose the appropriate source based on viewport size and pixel density.

The earlier build sizes in this README describe the initial cleanup baseline, before subsequent homepage and footer additions. Current hashed filenames and compressed sizes are printed by `npm run build --prefix client`. Audit JSON is retained in ignored `.local/lighthouse-mobile-final.json`.

To reproduce: build the client, run `npm run preview --prefix client -- --host localhost --port 4173`, then run `npx --yes lighthouse http://localhost:4173/ --only-categories=performance,accessibility,best-practices,seo`. Set CHROME_PATH to the installed Chrome binary if discovery fails.


## Vercel deployment from GitHub

This configuration is for the portfolio only. No SRS or other project deployment is included.

1. Import the portfolio GitHub repository into Vercel. Keep **Root Directory at the repository root**, not `client`, so the Express function under `api/index.js` is included. `vercel.json` sets install to `npm ci`, build to `npm run build`, and output to `dist`. The package targets Node.js 24.
2. Add production environment variables in Vercel: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `ADMIN_USER`, `ADMIN_PASS`, and `JWT_SECRET`. Use a publicly reachable hosted MySQL-compatible database; the local Windows MySQL service cannot serve Vercel. Apply the portfolio schema/migrations to that database before testing Studio. Do not run the destructive `initDB.js` against existing content.
3. Use a unique administrator password of at least 12 characters and a cryptographically random signing secret of at least 32 characters. `admin` / `admin123` is local-development-only and is rejected in production. Generate secrets locally or in your hosting provider and enter them through its environment settings; do not commit them or put them in VITE-prefixed variables.
4. Set `DB_SSL=true` when the database provider requires TLS. Add its PEM certificate in `DB_SSL_CA` if needed; certificate verification stays enabled. Provider networking/firewall rules must allow connections from the deployed function.
5. Leave `SITE_URL` empty to use Vercel's `VERCEL_PROJECT_PRODUCTION_URL` automatically for canonical and social-preview URLs. Ensure Vercel system environment variables are exposed to the build. Later, set `SITE_URL=https://your-custom-domain` and redeploy to override the generated domain. The old Render URL has been removed.
6. Optional email delivery uses `GMAIL_USER` and `GMAIL_APP_PASSWORD` together. Without email credentials, contact messages can still be saved to the database and read in Studio. Both entry points use the same escaped email templates. Notifications complete before the API response; an acknowledgement failure does not discard confirmed owner delivery.
7. Run `npm run check:deploy` with the intended production variables. It reports missing settings without printing their values. A local development `.env` will intentionally fail this production check. The command checks configuration shape, not remote credentials or deliverability.
8. After Vercel deploys, verify `/api/health` reports a connected database, refresh each public route directly, open `/admin` with the production account, confirm project/demo changes persist, download the résumé, and submit one contact inquiry you can verify in Studio. Do not use real project demo links until they are deployed.

GitHub Actions runs the test suite and build on Node.js 24. No automatic publishing or external account configuration was performed by this preparation work. The final hosted integration check still depends on the Vercel project and hosted database credentials.

Official references: https://vercel.com/docs/environment-variables/system-environment-variables and https://vercel.com/docs/functions/runtimes/node-js/node-js-versions.

Final pre-deployment verification on the latest build: 39 automated tests passed; the Node.js 24 build and Vercel API-entry smoke checks passed; a real MySQL demo create/update/remove transaction passed and was rolled back. The latest simulated mobile Lighthouse run scored 98 performance, 100 accessibility, 100 best practices, and 100 SEO, with LCP 2.3 seconds and CLS 0. The report is ignored at `.local/lighthouse-predeploy.json`. These are local results, not proof of hosted connectivity or email deliverability. No real contact inquiry or test email was sent.

### Recommended free database: TiDB Cloud Starter (MySQL-compatible)

For this portfolio on Vercel, use a **MySQL-compatible TiDB Cloud Starter free instance**. Official quotas checked on 23 November 2026: each eligible free instance includes 5 GiB row storage, 5 GiB column storage, and 50 million request units per month. Keep the instance free; do not add a spending limit or paid upgrade for this free-only setup. Availability can be restricted when the free quota is exhausted. Details: https://docs.pingcap.com/tidbcloud/serverless-limitations/.

1. Create your TiDB Cloud account and select **Starter**, **MySQL-compatible**, and the free instance option. Choose a region near the Vercel function region when possible. Account creation and credentials remain with you.
2. In the SQL editor, create/select a database named `portfolio_ga_v2`. The connection account needs permission to create the portfolio tables and use them.
3. In the instance **Connect** screen, copy the exact host, port, user, and password into Vercel's environment settings as `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`. Set `DB_NAME=portfolio_ga_v2` and **`DB_SSL=true`**. Keep `DB_SSL_CA` empty for Starter unless the provider instructs otherwise; its public endpoint uses a CA trusted by Node.js. Never disable certificate verification. Official driver instructions: https://docs.pingcap.com/tidb/stable/dev-guide-sample-application-nodejs-mysql2/.
4. Initialize the selected cloud database with `schema.sql` in its SQL editor, or run `npm run db:setup` locally with those cloud variables set privately. The setup command only creates missing tables and performs additive project migrations. It does not drop tables, seed credentials, or overwrite your existing projects. Do not use `initDB.js`.
5. A fresh cloud database starts without project rows. Your local MySQL data is not automatically uploaded: transfer the public project records or add them through Studio before switching the public site to it. Do not upload inquiry messages or local administrator records as project content.
6. Set the production Studio account and signing secret in Vercel, deploy from GitHub, and check `/api/health`. Add the Vercel environment variables to each environment you intend to test. A preview deployment can use a separate database to avoid editing production data.

No TiDB account, database, payment method, or paid service was created during this recommendation.

Dependency follow-up: production advisories were resolved with compatible package updates plus a targeted Nodemailer 10.6.1 upgrade. Its templates were compiled using the real library's local JSON transport without sending mail. Nodemon was removed in favor of Node's built-in watch mode. Both package audits reported zero vulnerabilities after these changes; 41 tests passed on Node.js 24. GitHub CI now checks production advisories too. Earlier Lighthouse scores predate this dependency update; the hosted site still needs its final integration and delivery checks after TiDB/Vercel setup.
