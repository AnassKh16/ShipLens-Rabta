# ADR 0005: Same-origin frontend and CSP

Status: accepted.

Express serves FRONTEND_DIST; the default is repository frontend/dist.
Docker supplies the absolute path /app/frontend/dist.
Health and API namespaces take precedence over static files and SPA routes.
Unknown API routes keep the shared JSON 404 shape, never index.html.
GET navigation falls back to index.html; missing assets return JSON 404.
Fingerprint-named files under assets/ cache immutably for one year.
HTML and unversioned files use no-cache so clients revalidate deployments.
Helmet CSP defaults to self; scripts, stylesheets, fonts and connections are self-only.
Images additionally allow data:; framing and objects are forbidden.
style-src-attr is none: the production build removes TokenPage, the only source
using inline style props for swatches and type samples. No inline exception is needed.
Inline scripts, style elements and style attributes are not permitted.
HSTS is emitted only in production; local HTTP development does not set it.
Production uses compiled JavaScript to migrate before starting the listener.
Migration failure prevents startup; the existing advisory lock serializes migrations.
Container and Render deployment verification must be reported separately from unit tests.
