# Getting Started

Welcome to your new starting point! This guide will take you from a fresh clone to running the full-stack boilerplate, and specifically show you how to effortlessly extend it using AI coding agents.

## 1. Local Setup & Smoke Testing

### Clone & Install
Clone your forked repository and install the workspace dependencies:
```bash
git clone https://github.com/kronekker/template-project.git
cd template-project
npm install
```

### Smoke Test (Development Mode)
Launch the development environment to verify everything is working. This runs both the Express backend and the Angular frontend in hot-reload mode concurrently.
```bash
npm run dev
```
Navigate to `http://localhost:4200`. You should see the Home page. Click "View Server Telemetry" to verify the backend API is connected and streaming data to the frontend.

### Smoke Test (Production Build)
To ensure there are no TypeScript interface mismatches or Angular budget errors, compile the entire project and run the unified server:
```bash
npm run build
npm run start
```
Navigate to `http://localhost:3000`. The Express server is now serving both your static Angular assets and the API endpoints out of a single process on the same port!

---

## 2. Directing Your AI Coding Agent

This boilerplate is uniquely designed to be easily extensible by AI coding assistants (like Gemini, GitHub Copilot, or Cursor). 

Instead of fighting the AI over styling choices or architecture decisions, we've provided explicit instruction files located in the `skills/` directory.

### The Skills Library
Take a quick look at these files; they serve as a manual for human developers and as explicit system prompts for AI agents:
- **`skills/01-architecture.md`**: Enforces the use of the shared monorepo types and standalone components.
- **`skills/02-ui-styling.md`**: Dictates the use of the global `kbp-` glassmorphic CSS classes (so the AI doesn't generate inline styles or rogue CSS).
- **`skills/03-complex-components.md`**: Mandates the use of AG Grid and Apache ECharts for data presentation, complete with theming requirements.

### How to use them
When prompting your AI agent to build a new feature, explicitly point it to the relevant skill files. 

**Example AI Prompt:**
> *"I need a new page for managing User Accounts. Before you begin, please read `skills/01-architecture.md` and `skills/02-ui-styling.md`. Define a `User` interface in the shared workspace, create a backend endpoint to return mock users, and then build the Angular standalone component using the `kbp-` classes mandated in the skills file."*

By providing these simple file constraints within your prompt, the AI will perfectly match the boilerplate's premium aesthetic and strict type-safe architecture on its very first try!
