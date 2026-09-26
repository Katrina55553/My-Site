import { memo, useEffect, useState } from 'react'
import { Github } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { id: 'hero', label: '主页', path: '/' },
  { id: 'projects', label: '我的项目', path: '/projects' },
  { id: 'blog', label: '我的博客', external: 'https://blog.cogod.cn/' },
  { id: 'resume', label: '个人简历', path: '/resume' },
  { id: 'showcase', label: '3D 展示', path: '/showcase' },
  { id: 'contact', label: '联系我', path: '/contact' },
]

// hover 预取：鼠标悬停时提前加载对应页面 chunk
const PREFETCH_MAP = {
  '/projects': () => import('../pages/Projects'),
  '/resume': () => import('../pages/Resume'),
  '/showcase': () => import('../pages/Showcase3D'),
  '/contact': () => import('./Contact'),
}
const prefetched = new Set()
function prefetchRoute(path) {
  if (PREFETCH_MAP[path] && !prefetched.has(path)) {
    prefetched.add(path)
    PREFETCH_MAP[path]()
  }
}

function Navbar({ activeSection }) {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  // 滚动收缩：下滑超过 30px 时 navbar 收缩 + 背景加深
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 已在主页时点击「主页」：平滑滚回顶部 hero 区（路由未变，App 的滚顶 effect 不会触发）
  const handleHomeClick = () => {
    if (location.pathname === '/') {
      document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="logo">
        <span className="logo-bracket">&lt;</span>
        <span className="logo-text">KATRINA</span>
        <span className="logo-bracket">/&gt;</span>
      </Link>
      <nav className="nav-links">
        {NAV_ITEMS.map((item) => {
          // 外部链接项
          if (item.external) {
            return (
              <a
                key={item.id}
                href={item.external}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link"
              >
                {item.label}
              </a>
            )
          }
          // 子页面路由项
          if (item.path !== '/') {
            return (
              <Link
                key={item.id}
                to={item.path}
                onMouseEnter={() => prefetchRoute(item.path)}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            )
          }
          // 主页项：必须用 Link 而非 <a href="#hero">，
          // 裸锚点会把 URL hash 改成 #hero，破坏 HashRouter 的路由解析
          const isActive = location.pathname === '/' && activeSection === item.id
          return (
            <Link
              key={item.id}
              to="/"
              onClick={handleHomeClick}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="nav-actions">
        <a
          href="https://github.com/Katrina55553/My-Site"
          target="_blank"
          rel="noopener noreferrer"
          className="github-btn"
          aria-label="GitHub Repository"
        >
          <Github size={20} />
        </a>
      </div>
    </header>
  )
}

// memo：Lab 滑块拖动等与导航无关的 state 更新不再触发导航栏重渲染
export default memo(Navbar)
