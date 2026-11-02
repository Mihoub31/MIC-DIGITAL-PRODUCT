# MIC Digital Product

This project is a launch-ready Next.js marketing site for CreatorPilot. It is optimized for static hosting and can be deployed with a single production build.

## Stack

- Next.js 14
- React 18
- TypeScript
- CSS modules / global stylesheet

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm install
npm run build
```

This project uses Next.js static export, so the generated site is published from the `out/` directory.

## Deploy on Render

1. Create a new Render Static Site.
2. Connect this GitHub repository.
3. Use the build command:
   ```bash
   npm install && npm run build
   ```
4. Set the publish directory to:
   ```bash
   out
   ```

The repository also includes a `render.yaml` blueprint configuration for the same deployment flow.
project:
  name: "AI Company Operating System"
  repo: "Mihoub31/MIC-DIGITAL-PRODUCT"
  repo_id: 1440138098

  tech_stack:
    frontend:
      - "TypeScript"
      - "CSS"
      - "HTML"
      - "React / Next.js style UI"
    backend:
      - "FastAPI"
      - "PostgreSQL"
      - "Redis"
    deployment:
      - "Render"
      - "GitHub integration"
    i18n:
      supported_languages: ["fr", "ar"]
      default_language: "fr"
      rtl_support: true

  language_breakdown:
    TypeScript: 39.7
    CSS: 33.9
    HTML: 19.6
    JavaScript: 6.8

  product_goals:
    - "Dashboard exécutif"
    - "Gestion des tâches"
    - "Approvals / validation humaine"
    - "Pipeline leads / deals"
    - "Support / finance / reporting"
    - "IA workflows / orchestration"

  architecture:
    frontend: "UI dashboard, components, pages"
    backend: "API, auth, services, workflows"
    database: "PostgreSQL"
    cache: "Redis"
    deployment: "Render Blueprint + render.yaml"

  render_config:
    backend_service: "ai-company-backend"
    frontend_service: "ai-company-frontend"
    health_check: "/health"
    build_backend: "pip install -r requirements.txt"
    start_backend: "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
    build_frontend: "npm install && npm run build"
    start_frontend: "npx next start -p $PORT"

  i18n_rules:
    fr:
      dir: "ltr"
    ar:
      dir: "rtl"
    fallback: "fr"

  current_status:
    repo_pattern: "frontend-heavy"
    core_focus: "interface + product UX + business dashboard"
    next_steps:
      - "configure translations fr/ar"
      - "activate RTL"
      - "deploy backend + frontend on Render"
      - "start sprint tasks and governance"
      
