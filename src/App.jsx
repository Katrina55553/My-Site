import { useState, useEffect, lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CustomCursor from './components/CustomCursor'
import Footer from './components/Footer'

// 懒加载：Three.js 体积巨大（~600KB），分离到独立 chunk，首屏绘制后再加载
const ParticleScene = lazy(() => import('./components/ParticleScene'))
// below-the-fold 组件懒加载，进一步减小首屏 JS 体积
const Hub = lazy(() => import('./components/Hub'))
const Resume = lazy(() => import('./components/Resume'))
const Lab = lazy(() => import('./components/Lab'))
const Terminal = lazy(() => import('./components/Terminal'))
const Contact = lazy(() => import('./components/Contact'))

// 简易加载占位：保持布局高度，避免 CLS
function SectionFallback({ minHeight = '60vh' }) {
  return (
    <div
      style={{
        minHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-heading)',
      }}
    >
      <span style={{ opacity: 0.4 }}>Loading…</span>
    </div>
  )
}

export default function App() {
  const [hue, setHue] = useState(280)
  const [glow, setGlow] = useState(100)
  const [activeSection, setActiveSection] = useState('hero')

  // 主题变化时更新 CSS 变量
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-hue', hue)
    document.documentElement.style.setProperty('--primary-glow', `${glow}%`)
  }, [hue, glow])

  // 滚动监听 (Scroll Spy)
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* 动态背景流光 */}
      <div className="bg-glow-container">
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
        <div className="glow-orb orb-3"></div>
      </div>

      <CustomCursor />
      <Navbar activeSection={activeSection} />

      <main className="container">
        <Hero hue={hue}>
          <Suspense fallback={<SectionFallback minHeight="450px" />}>
            <ParticleScene hue={hue} />
          </Suspense>
        </Hero>

        <Suspense fallback={<SectionFallback />}>
          <Hub />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Resume />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Lab hue={hue} setHue={setHue} glow={glow} setGlow={setGlow} />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Terminal />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Contact />
        </Suspense>
      </main>

      <Footer />
    </>
  )
}
