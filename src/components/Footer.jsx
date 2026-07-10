import { Github, Mail, ArrowUpRight, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

const FOOTER_NAV = [
  { label: '主页', path: '/' },
  { label: '我的项目', path: '/projects' },
  { label: '个人简历', path: '/resume' },
  { label: '联系我', path: '/contact' },
  { label: '3D 展示', path: '/showcase' },
]

const FOOTER_SOCIAL = [
  { label: 'GitHub', value: '@Katrina55553', href: 'https://github.com/Katrina55553', icon: Github },
  { label: 'Blog', value: 'blog.cogod.cn', href: 'https://blog.cogod.cn/', icon: BookOpen },
  { label: 'Email', value: 'ambition55553@gmail.com', href: 'mailto:ambition55553@gmail.com', icon: Mail },
]

export default function Footer() {
  return (
    <footer className="footer">
      {/* 顶部渐变发光分隔线 */}
      <div className="footer-divider" aria-hidden="true"></div>

      <div className="footer-inner">
        {/* 左侧：品牌区 */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="logo-bracket">&lt;</span>
            <span className="logo-text">KATRINA</span>
            <span className="logo-bracket">/&gt;</span>
          </Link>
          <p className="footer-tagline">
            AI 全栈开发工程师，用代码构建未来。<br />
            从架构设计到部署运维，独立交付完整产品。
          </p>
          <div className="footer-status">
            <span className="footer-status-dot"></span>
            <span className="footer-status-text">接受实习 &amp; 项目合作</span>
          </div>
        </div>

        {/* 中间：快速导航 */}
        <nav className="footer-nav" aria-label="页脚导航">
          <h4 className="footer-heading">导航</h4>
          <ul className="footer-nav-list">
            {FOOTER_NAV.map((item) => (
              <li key={item.path}>
                <Link to={item.path} className="footer-nav-link">
                  <span>{item.label}</span>
                  <ArrowUpRight size={14} className="footer-nav-arrow" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 右侧：社交与联系 */}
        <div className="footer-social">
          <h4 className="footer-heading">连接</h4>
          <ul className="footer-social-list">
            {FOOTER_SOCIAL.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="footer-social-link"
                  >
                    <span className="footer-social-icon"><Icon size={16} /></span>
                    <span className="footer-social-text">
                      <span className="footer-social-label">{item.label}</span>
                      <span className="footer-social-value">{item.value}</span>
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* 底部版权条 */}
      <div className="footer-bottom">
        <p className="footer-copy">© 2026 刘俊威 · Built with React, Vite &amp; pure Passion</p>
        <p className="footer-icp">
          <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer">
            浙ICP备2026045444号
          </a>
        </p>
      </div>
    </footer>
  )
}
