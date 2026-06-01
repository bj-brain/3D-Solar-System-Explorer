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
