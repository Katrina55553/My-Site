# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

A static, zero-tooling single-page portfolio website ("Katrina" 的个人作品集) built with vanilla HTML5, CSS3, and ES6+ JavaScript. No frameworks, no bundler, no package manager — open `index.html` directly in a browser to run.

## Development

- **Run:** Open `index.html` in a browser. For Web Audio API features, use a local HTTP server (e.g. `npx serve .` or `python -m http.server`) due to CORS restrictions.
- **No build step, no tests, no linting config.**

## Architecture

Three monolithic files, no module system:

| File | Role |
|------|------|
| `index.html` | All markup — navbar, hero, hub cards, UI lab, terminal, footer |
| `main.js` | All JS — 7 init functions, each self-contained |
| `style.css` | All styles — organized into numbered sections with CSS custom properties |

### `main.js` Modules

Each function is independent and initializes one feature section:

- `initNavigation()` — scroll-spy via IntersectionObserver
- `init3DTilt()` — mouse-following 3D perspective tilt on hub cards
- `initThemeController()` — live CSS custom property manipulation via hue/glow sliders
- `initMusicPlayer()` — procedural Web Audio API synthesizer (`AmbientSynth` class, ~160 lines), visualizer bars, 3-track playlist
- `initTerminal()` — interactive terminal emulator with commands (`help`, `about`, `neofetch`, `hack`, `clear`, etc.)
- `initCustomCursor()` — lerp-based neon cursor with trail particles
- `init3DScene()` — Three.js r128 WebGL scene (2000-particle sphere + ring)

### CSS Theme System

The entire color scheme is driven by a single `--primary-hue` CSS variable (0–360). All neon/glow colors derive from it via `calc()` and HSL. JavaScript updates this variable in real-time through the theme controller, which cascades to all elements including the Three.js scene.

## External Dependencies (CDN only, no local installs)

- **Three.js** r128 — WebGL 3D rendering
- **Lucide Icons** — icon set (SVG-based)
- **Google Fonts** — Inter + Space Grotesk

## Key Technical Details

- `AmbientSynth` uses lazy `AudioContext` creation (browser autoplay policy requires user gesture first)
- WebGL `devicePixelRatio` capped at 2 for performance
- Responsive breakpoints: 1024px and 768px (no hamburger menu — nav links just hide on mobile)
- CSS sections are numbered in comments (e.g. `/* 1. DESIGN SYSTEM */`) for quick navigation
- JS modules are delimited by `// ==================== MODULE N: NAME ====================` comments
