import { Github } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'hero', label: '主页' },
  { id: 'hub', label: '项目展示' },
  { id: 'resume', label: '简历' },
  { id: 'lab', label: 'UI实验室' },
  { id: 'terminal-section', label: '命令终端' },
  { id: 'contact', label: '联系我' },
]

export default function Navbar({ activeSection }) {
  return (
    <header className="navbar">
      <div className="logo">
        <span className="logo-bracket">&lt;</span>
        <span className="logo-text">KATRINA</span>
        <span className="logo-bracket">/&gt;</span>
      </div>
      <nav className="nav-links">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="nav-actions">
        <a
          href="https://github.com"
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
