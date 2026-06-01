# 3D Solar System Explorer

An interactive WebGL model of our solar system built with Three.js and Vite.

## Features

- 8 planets, dwarf planets, 50+ moons, comets, and four asteroid belts
- Glass morphism UI with real-time panel controls
- Eclipse tours (solar and lunar) with cinematic camera paths
- Atmospheric music playback
- Cosmo AI chat powered by Groq

## Stack

- Three.js for 3D rendering
- Vite for dev server and bundling
- Vercel serverless function for the chat proxy
- Inline SVG icon system, no external icon dependency

## Run locally

```bash
npm install
cp .env.example .env
# edit .env and set GROQ_API_KEY
npm run dev
```

## Build

```bash
npm run build
```

Output is written to `dist/`.

## Deploy to Vercel

1. Push the repo to GitHub.
2. Import the project at https://vercel.com/new.
3. Vercel auto-detects Vite and uses `vercel.json` to run `npm run build` and serve `dist/`.
4. In **Settings -> Environment Variables**, add `GROQ_API_KEY` with your Groq key.
5. The `/api/chat` serverless function is automatically deployed from the `api/` directory and is reachable at `https://<your-domain>/api/chat`.

The `vercel.json` also adds:
- SPA fallback (`/(.*) -> /index.html`) so deep links work
- Long-lived cache headers on `/textures/*` and `/assets/*`
- No-cache on `*.html` so updates roll out immediately

## File layout

- `index.html` - main UI (inline glass morphism CSS, SVG sprite, chatbot client)
- `main.js` - Three.js scene
- `api/chat.js` - Vercel serverless function (chat proxy to Groq)
- `public/textures/` - planet textures and audio assets (served as `/textures/*`)
- `vite.config.js` - dev server, dev-only `/api/chat` middleware for local testing
- `vercel.json` - deployment configuration
