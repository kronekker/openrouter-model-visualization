# Skill: UI Styling & Standard Components

## Constraint Context
This project enforces a premium dark glassmorphism design aesthetic. All core UI elements (cards, buttons, inputs, banners, badges) use standardized classes prefixed with `kbp-` (Kronekker Boilerplate Prefix) defined globally in `frontend/src/styles.css`.

## Instructions for AI Agents
When a user asks you to create a new Angular component, page, or UI feature:
1. **Never generate custom CSS** for basic UI elements (like borders, padding for buttons, or card backgrounds).
2. **Always use the pre-defined `kbp-` classes**:
   - Containers/Cards: `.kbp-glass-panel`
   - Buttons: `.kbp-btn` alongside `.kbp-btn-primary`, `.kbp-btn-secondary`, or `.kbp-btn-danger`
   - Inputs/Selects: `.kbp-input`, `.kbp-select`, `.kbp-textarea`
   - Badges: `.kbp-badge` alongside `.kbp-badge-done`, `.kbp-badge-inprogress`, or `.kbp-badge-todo`
   - Banners/Alerts: `.kbp-banner`
3. Before writing any HTML, review the exact markup patterns found in `frontend/src/app/style/style.html`. 
4. The global background is animated and handles its own layout. Rely on `kbp-glass-panel` to provide the required semi-transparent background to ensure readability.
