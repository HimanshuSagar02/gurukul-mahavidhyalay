# Gurukul Mahavidyalay Website

Production-ready monorepo for a dynamic college website with:

- React + Vite frontend
- Node.js + Express backend
- MongoDB content storage
- Hidden admin panel with JWT cookie authentication
- Dynamic admissions, notifications, gallery, contact info, and popup advertisement management

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
"# gurukul-mahavidhyalay" 
"# gurukul-mahavidhyalay" 
"# gurukul-mahavidhyalay" 
"# gurukul-mahavidhyalay" 
