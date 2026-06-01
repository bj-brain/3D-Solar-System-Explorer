# 3D Solar System Explorer

An interactive WebGL model of our solar system built with Three.js and Vite.

## Features

- 8 planets, dwarf planets, 50+ moons, comets, and four asteroid belts
- Glass morphism UI with real-time panel controls
- Eclipse tours (solar and lunar) with cinematic camera paths
- Atmospheric music playback
- Space AI chat powered by the Gemini API

## Stack

- Three.js for 3D rendering
- Vite for dev server and bundling
- Inline SVG icon system, no external icon dependency

## Run

```bash
npm install
npm run dev
```

Set `VITE_GEMINI_API_KEY` in a `.env` file to enable the chatbot.

## Build

```bash
npm run build
```

Output is written to `dist/`.
