import { Github } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { id: 'hero', label: '主页', path: '/' },
  { id: 'hub', label: '项目展示', path: '/', hash: '#hub' },
  { id: 'projects', label: '精选项目', path: '/projects' },
  { id: 'resume', label: '简历', path: '/resume' },
  { id: 'lab', label: 'UI实验室', path: '/', hash: '#lab' },
  { id: 'terminal-section', label: '命令终端', path: '/', hash: '#terminal-section' },
  { id: 'contact', label: '联系我', path: '/', hash: '#contact' },
]

export default function Navbar({ activeSection }) {
  const location = useLocation()

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
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </a>
          )
        })}
      </nav>
      <div className="nav-actions">
        <a
          href="https://github.com/ambition55553"
          target="_blank"
          rel="noopener noreferrer"
          className="github-btn"
          aria-label="GitHub Profile"
        >
          <Github size={20} />
        </a>
      </div>
    </header>
  )
}
