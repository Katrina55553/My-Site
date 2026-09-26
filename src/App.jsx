import { useState, useEffect, useRef, lazy, Suspense, Component } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CustomCursor from './components/CustomCursor'
import MouseGlow from './components/MouseGlow'
import Footer from './components/Footer'
import useScrollReveal from './hooks/useScrollReveal'

// chunk 加载失败时自动刷新（部署后旧 chunk 文件名失效）
// 用 sessionStorage 记重试标记：HashRouter 下重试参数只能写在 hash 里，
// 之前用 location.search 检测永远为 false，会造成无限刷新循环
const CHUNK_RETRY_KEY = 'chunk-retry'
function lazyWithRetry(fn) {
  return lazy(() =>
    fn()
      .then((mod) => {
        sessionStorage.removeItem(CHUNK_RETRY_KEY)
        return mod
      })
      .catch((err) => {
        if (err.message.includes('Failed to fetch dynamically imported module') && !sessionStorage.getItem(CHUNK_RETRY_KEY)) {
          sessionStorage.setItem(CHUNK_RETRY_KEY, '1')
          location.reload()
        }
        throw err
      })
  )
}

// 懒加载：Three.js 体积巨大（~600KB），分离到独立 chunk，首屏绘制后再加载
const ParticleScene = lazyWithRetry(() => import('./components/ParticleScene'))
// below-the-fold 组件懒加载，进一步减小首屏 JS 体积
const Hub = lazyWithRetry(() => import('./components/Hub'))
const Lab = lazyWithRetry(() => import('./components/Lab'))
const Terminal = lazyWithRetry(() => import('./components/Terminal'))
const Contact = lazyWithRetry(() => import('./components/Contact'))
// 独立页面
const Projects = lazyWithRetry(() => import('./pages/Projects'))
const ResumePage = lazyWithRetry(() => import('./pages/Resume'))
const Showcase3D = lazyWithRetry(() => import('./pages/Showcase3D'))

// 空闲预取：主页加载后浏览器空闲时提前下载子页面 chunk
function usePrefetchRoutes() {
  useEffect(() => {
    const prefetch = () => {
      import('./pages/Projects')
      import('./pages/Resume')
      import('./pages/Showcase3D')
      import('./components/Contact')
    }
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(prefetch, { timeout: 3000 })
      return () => window.cancelIdleCallback(id)
    } else {
      const timer = setTimeout(prefetch, 1500)
      return () => clearTimeout(timer)
    }
  }, [])
}

// A1. 顶部滚动进度条：监听滚动，计算文档滚动百分比并填充霓虹进度条
// scaleX 走合成器（不触发 layout）；支持滚动驱动动画的浏览器交给 CSS，零 JS 监听
function ScrollProgress() {
  const barRef = useRef(null)
  useEffect(() => {
    const el = barRef.current
    if (!el) return
    if (CSS.supports('animation-timeline: scroll()')) return
    const update = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = docHeight > 0 ? window.scrollY / docHeight : 0
      el.style.transform = `scaleX(${scrolled})`
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])
  return (
    <div className="scroll-progress" aria-hidden="true">
      <div ref={barRef} className="scroll-progress__bar"></div>
    </div>
  )
}

// D2. 骨架屏占位：保持布局高度，避免 CLS，同时用 shimmer 动画呼应整体风格
function SectionFallback({ minHeight = '60vh' }) {
  return (
    <div style={{ minHeight, display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem 0' }}>
      <div className="skeleton-box" style={{ marginBottom: '1rem' }}></div>
      <div className="skeleton-line skeleton-line--title"></div>
      <div className="skeleton-line skeleton-line--full"></div>
      <div className="skeleton-line skeleton-line--full"></div>
      <div className="skeleton-line skeleton-line--short"></div>
    </div>
  )
}

// 主页内容
function HomePage({ hue, setHue, glow, setGlow, activeSection, setActiveSection }) {
  return (
    <main className="container">
      <Hero hue={hue}>
        <Suspense fallback={<SectionFallback minHeight="450px" />}>
          <ParticleScene hue={hue} />
        </Suspense>
      </Hero>

      <Suspense fallback={<SectionFallback />}>
        <Terminal />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Hub />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Lab hue={hue} setHue={setHue} glow={glow} setGlow={setGlow} />
      </Suspense>
    </main>
  )
}

// 子页面容器（带版心）
function SubPage({ children }) {
  return <main className="container">{children}</main>
}

export default function App() {
  const [hue, setHue] = useState(70)
  const [glow, setGlow] = useState(100)
  const [activeSection, setActiveSection] = useState('hero')
  const location = useLocation()
  usePrefetchRoutes()
  // 滚动渐入：监听所有 .reveal / .reveal-stagger 元素，进入视口时触发动画
  useScrollReveal([location.pathname])

  // 主题变化时更新 CSS 变量
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-hue', hue)
    document.documentElement.style.setProperty('--primary-glow', glow)
  }, [hue, glow])

  // 滚动监听 (Scroll Spy) — 仅主页生效
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('')
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    )
    // Hub/Lab/Terminal 是懒加载组件，effect 首次运行时 section 还没挂载，
    // 必须用 MutationObserver 等它们出现后再 observe，否则 scroll-spy 对懒加载区块失效
    const observed = new WeakSet()
    const observeAll = () => {
      document.querySelectorAll('section[id]').forEach((section) => {
        if (!observed.has(section)) {
          observed.add(section)
          observer.observe(section)
        }
      })
    }
    observeAll()
    const mo = new MutationObserver(observeAll)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
      mo.disconnect()
    }
  }, [location.pathname])

  // 路由切换时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <>
      {/* A1. 顶部滚动进度条 */}
      <ScrollProgress />

      {/* 动态背景流光 */}
      <div className="bg-glow-container">
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
        <div className="glow-orb orb-3"></div>
      </div>

      {/* 电影颗粒质感叠加层 */}
      <div className="grain-overlay" aria-hidden="true"></div>

      <CustomCursor />
      <MouseGlow />
      <Navbar activeSection={activeSection} />

      {/* D1. 路由切换淡入：key 随 pathname 变化触发动画 */}
      <div key={location.pathname} className="route-fade">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                hue={hue}
                setHue={setHue}
                glow={glow}
                setGlow={setGlow}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
              />
            }
          />
          <Route
            path="/projects"
            element={
              <SubPage>
                <Suspense fallback={<SectionFallback />}>
                  <Projects />
                </Suspense>
              </SubPage>
            }
          />
          <Route
            path="/resume"
            element={
              <SubPage>
                <Suspense fallback={<SectionFallback />}>
                  <ResumePage />
                </Suspense>
              </SubPage>
            }
          />
          <Route
            path="/contact"
            element={
              <SubPage>
                <Suspense fallback={<SectionFallback />}>
                  <Contact />
                </Suspense>
              </SubPage>
            }
          />
          <Route
            path="/showcase"
            element={
              <Suspense fallback={<SectionFallback minHeight="100vh" />}>
                <Showcase3D />
              </Suspense>
            }
          />
          {/* 兜底：未匹配路由重定向到首页 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Footer />
    </>
  )
}
