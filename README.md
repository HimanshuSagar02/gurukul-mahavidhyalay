# Gurukul Mahavidyalay Website

Monorepo for the Gurukul Mahavidyalay website.

## Structure

- `frontend` - public website and hidden admin interface
- `backend` - API, authentication, uploads, MongoDB models, seed tooling

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Configure environment files:

- Copy `backend/.env.example` to `backend/.env`
- Copy `frontend/.env.example` to `frontend/.env`

Frontend router mode:

- `VITE_ROUTER_MODE=hash` keeps routes reload-safe without server rewrites.
- `VITE_ROUTER_MODE=browser` can be used only when deployment rewrites every non-file route to `index.html`.

3. Start development:

```bash
npm run dev
```

4. Create the first admin user:

```bash
npm run seed:admin
```

## Hidden Admin Access

- Public website does not expose admin entry links.
- Access the admin login directly at `/login` or `/admin/login`.

## Notes

- Site-level defaults are inserted into MongoDB on first run.
- Gallery and popup uploads are stored in `backend/uploads`.
- Placeholder visual assets are bundled only to support the first render before real media is uploaded.
- In environments without SPA rewrite support, keep the frontend router in `hash` mode so page reloads do not break nested routes.

## Render

For a single Render web service:

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Frontend API URL: keep `VITE_API_URL=/api`
- Frontend router mode: keep `VITE_ROUTER_MODE=hash`
- Backend client URL: set `CLIENT_URL` to your Render site URL
"# gurukul-mahavidhyalay" 
"# gurukul-mahavidhyalay" 
"# gurukul-mahavidhyalay" 
"# gurukul-mahavidhyalay" 
