import useTypewriter from '../hooks/useTypewriter'

export default function Hero({ hue, children }) {
  // 第一行打字机效果：始终保留完整文本占位，避免布局塌陷导致 scroll-spy 误判
  const { displayed, done } = useTypewriter('用代码构建', { speed: 120, startDelay: 400 })

  return (
    <section id="hero" className="hero-section">
      <div className="hero-content">
        <div className="badge-container">
          <span className="pulse-dot"></span>
          <span className="badge-text">AI Full-Stack Developer &amp; Open to Internships</span>
        </div>
        <h1 className="hero-title">
          <span className="typewriter">{displayed}</span>
          <span className={`typewriter-cursor ${done ? 'is-hidden' : ''}`} aria-hidden="true"></span>
          <br />
          <span className={`gradient-text glitch-reveal ${done ? 'is-visible' : ''}`} data-text="AI 全栈未来">AI 全栈未来</span>
        </h1>
        <p className={`hero-subtitle ${done ? 'is-visible' : ''}`}>
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
