import { ArrowRight, Sparkles } from 'lucide-react'

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
          刘俊威 · AI 全栈开发工程师。熟练使用 Claude Code / Cursor 高效交付产品，已上线 10+ 个可访问项目，专注 Agent 生态与工程化落地。
        </p>
        <div className="hero-buttons">
          <a href="#hub" className="btn btn-primary">
            <span>访问中转站</span>
            <ArrowRight size={18} />
          </a>
          <a href="#lab" className="btn btn-secondary">
            <span>探索实验室</span>
            <Sparkles size={18} />
          </a>
        </div>
      </div>
      <div className="hero-visual">
        <div id="webgl-container">
          {children}
        </div>
      </div>
    </section>
  )
}
