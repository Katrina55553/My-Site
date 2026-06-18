import { ArrowRight, Sparkles } from 'lucide-react'

export default function Hero({ hue, children }) {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-content">
        <div className="badge-container">
          <span className="pulse-dot"></span>
          <span className="badge-text">Available for Freelance &amp; Projects</span>
        </div>
        <h1 className="hero-title">
          探索代码与设计<br />
          的<span className="gradient-text">无限可能</span>
        </h1>
        <p className="hero-subtitle">
          欢迎来到我的个人空间。这里是我探索炫酷 UI 动效的实验基地，也是通往我所有博客文章与项目作品的中央枢纽。
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
