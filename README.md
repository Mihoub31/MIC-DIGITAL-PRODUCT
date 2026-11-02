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
