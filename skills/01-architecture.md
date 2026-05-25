# Skill: Architecture & Shared Types

## Constraint Context
This project is an npm workspace monorepo. It tightly couples an Angular frontend, an Express Node.js backend, and a Shared Types package. 

## Instructions for AI Agents
When a user asks you to build a feature that requires data exchange between the client and server:
1. **Always define the data model first** in `shared/src/index.ts`.
2. Do not define duplicate interfaces in the frontend or backend.
3. Once modified, you must compile the shared package by running: `npm run build -w shared`.
4. Import these types directly via `import { YourType } from 'shared';` in both the Angular components and the Express server.
5. If the user asks for a new Angular component, always generate it as a `standalone` component and register it in `frontend/src/app/app.routes.ts`.
