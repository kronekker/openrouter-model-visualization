# Skill: Data Grids & Charts

## Constraint Context
This boilerplate pre-installs specific industry-standard libraries for complex data visualization to maintain a unified look and feel without ballooning dependencies.

## Instructions for AI Agents
When a user asks for a complex data table, a list of structured data, or an interactive chart:
1. **Data Tables**: You MUST use `ag-grid-angular`. Do not build native HTML tables or install other table libraries (like material or ngx-datatable). Use the `[class]="'ag-theme-quartz-dark'"` theme property. Refer to `frontend/src/app/features/features.ts` for implementation patterns including custom cell renderers.
2. **Charts & Graphs**: You MUST use `ngx-echarts` (Apache ECharts). Do not install Chart.js or D3. Refer to `frontend/src/app/features/features.ts` for styling options that match the dark glassmorphic theme (e.g., transparent backgrounds, custom `#6366f1` gradient fills).
3. Do not forget to import `ModuleRegistry` and `AllCommunityModule` and call `ModuleRegistry.registerModules([AllCommunityModule]);` when setting up a new AG Grid instance.
