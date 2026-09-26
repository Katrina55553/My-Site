# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website ("Katrina" 的个人作品集). Vite + React 18 SPA with HashRouter, react-router-dom v6, Three.js, lucide-react. Deployed as a static build (`dist/`).

## Development

- **Dev:** `npm run dev` (Vite dev server)
- **Build:** `npm run build` → `dist/`
- **No tests, no linting config.**

## Architecture

`index.html` is the Vite entry and only loads `/src/main.jsx`. All application code lives in `src/`:

| Path | Role |
|------|------|
| `src/main.jsx` | React root, HashRouter, ErrorBoundary, scroll-restoration handling |
| `src/App.jsx` | Routes (`/` `/projects` `/resume` `/contact` `/showcase`), theme state (hue/glow), scroll-spy, `lazyWithRetry` code-splitting |
| `src/components/` | Navbar, Hero, ParticleScene (Three.js 粒子球), Hub, Lab (音乐播放器 + 主题控制器), Terminal, Contact, Footer, CustomCursor, MouseGlow, TiltCard, ErrorBoundary |
| `src/pages/` | Projects, Resume, Showcase3D (可漫游 3D 场景) |
| `src/hooks/` | useTypewriter, useScrollReveal |
| `src/utils/AmbientSynth.js` | Web Audio API procedural synthesizer (3 套和弦进程) |
| `src/data/content.js` | 所有文案/项目/简历数据 |
| `src/style.css` | 全部样式，分区注释（`/* ---- A1. xxx ---- */`） |

### Routing: HashRouter（重要约束）

- 路由状态在 URL hash 里（`#/projects`），**裸锚点 `<a href="#xxx">` 会破坏路由**——主页内滚动用 `scrollIntoView`，页面跳转用 `<Link>`。
- `location.search` 永远为空；需要 URL 标记时用 sessionStorage 而非 query 参数。

### Code-splitting

- Three.js 与 below-the-fold 组件均 `lazyWithRetry(() => import(...))`：chunk 加载失败自动刷新一次（sessionStorage 记标记防循环）。
- 懒加载组件挂载晚于 effect 首跑，观察 DOM 的 effect（scroll-spy、reveal）必须用 MutationObserver 兜底等新节点出现。

### CSS Theme System

单一 `--primary-hue` (0–360) + `--primary-glow` 驱动全站霓虹色（`calc()` + HSL）。Lab 的滑块实时写 `:root` 变量，Three.js 场景读取同一变量着色。

## Key Technical Details

- `AmbientSynth` 懒创建 AudioContext（浏览器自动播放策略要求用户手势）；`stop()` 的延迟清理用 `stopGeneration` 代数防止快速恢复播放时被误杀
- Lab 播放进度 interval 内必须读 `trackRef.current`，不能闭包捕获曲目索引
- Terminal 输出走 `dangerouslySetInnerHTML`，用户输入必须经 `escapeHtml` 转义；历史记录上限 200 行
- WebGL `devicePixelRatio` capped at 2；粒子/3D 场景用 IntersectionObserver 在视口外暂停 rAF
- React.StrictMode 下 effect 会双跑，所有 effect 清理必须幂等
