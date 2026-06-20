import { } from 'lucide-react'

export default function Hero({ hue, children }) {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-content">
        <div className="badge-container">
          <span className="pulse-dot"></span>
          <span className="badge-text">AI Full-Stack Developer &amp; Open to Internships</span>
        </div>
        <h1 className="hero-title">
          用代码构建<br />
          <span className="gradient-text">AI 全栈未来</span>
        </h1>
        <p className="hero-subtitle">
          AI 全栈开发工程师<br />从需求分析、架构设计、前后端开发到部署运维均能独立完成，已上线 10+ 个可访问产品。
        </p>
      </div>
      <div className="hero-visual">
        <div id="webgl-container">
          {children}
        </div>
      </div>
    </section>
  )
}
