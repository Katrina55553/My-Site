import { Github } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  { id: 'hero', label: '主页', path: '/' },
  { id: 'projects', label: '我的项目', path: '/projects' },
  { id: 'resume', label: '个人简历', path: '/resume' },
  { id: 'showcase', label: '3D 展示', path: '/showcase' },
  { id: 'contact', label: '联系我', path: '/contact' },
]

export default function Navbar({ activeSection }) {
  const location = useLocation()
  const navigate = useNavigate()

  // 主页锚点跳转：在子页面时先回主页再滚动到锚点
  const handleHashNav = (e, item) => {
    if (location.pathname !== '/') {
      e.preventDefault()
      navigate('/')
      // 等主页挂载后再滚动
      setTimeout(() => {
        const el = document.getElementById(item.hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        <span className="logo-bracket">&lt;</span>
        <span className="logo-text">KATRINA</span>
        <span className="logo-bracket">/&gt;</span>
      </Link>
      <nav className="nav-links">
        {NAV_ITEMS.map((item) => {
          // 子页面路由项
          if (item.path !== '/') {
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            )
          }
          // 主页锚点项
          const isActive = location.pathname === '/' && activeSection === item.id
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => item.hash && handleHashNav(e, item)}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </a>
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
