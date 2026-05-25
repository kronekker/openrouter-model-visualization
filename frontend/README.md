# Kronekker Frontend Boilerplate

This directory contains the Angular Standalone SPA application of the Kronekker monorepo. It is specifically designed to tightly integrate with the local Node.js backend and shared type definitions.

## Architectural Constraints & Flows

When developing within this workspace, please adhere to the following standards established for this boilerplate:

1. **Standalone Components Only**: All new Angular components must be generated as `standalone: true`. We do not use `NgModule`. Register new routes directly in `src/app/app.routes.ts`.
2. **Kronekker Design System (`kbp-`)**: Do not write arbitrary or inline CSS for standard UI elements (like cards, buttons, badges, or inputs). You must use the `kbp-` (Kronekker Boilerplate Prefix) classes globally defined in `src/styles.css`. View the UI Kit (the `/style` route) for examples.
3. **API Proxying**: The Angular dev server uses `proxy.conf.js` to automatically map any requests made to `/api/*` directly to the local backend API. **Never hardcode absolute URLs** (e.g., `http://localhost:3000/api`) into Angular services.
4. **Shared Types**: Always import interfaces directly from the `shared` workspace package (e.g., `import { ServerMetrics } from 'shared';`) rather than defining local typings for backend payloads.

## Development Orchestration

Because this frontend is deeply coupled to the backend, **do not run `ng serve` or `ng build` directly from this directory**. 

All orchestration is handled from the root of the repository.

To run the development server with hot-reloading:
```bash
cd ..
npm run dev
```

To build the frontend application into production-ready static assets:
```bash
cd ..
npm run build
```
