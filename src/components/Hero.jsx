import useTypewriter from '../hooks/useTypewriter'
import useCountUp from '../hooks/useCountUp'
import { heroStats } from '../data/content'

// 单个统计项：进入视口时数字递增
function StatItem({ stat, delay }) {
  const { value, ref } = useCountUp(stat.value, { duration: 1400, startDelay: delay })
  return (
    <div className="hero-stat" ref={ref}>
      <span className="hero-stat__value">
        {value}
        {stat.suffix && <span className="hero-stat__value__plus">{stat.suffix}</span>}
      </span>
      <span className="hero-stat__label">{stat.label}</span>
    </div>
  )
}

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
        <div className={`hero-stats ${done ? 'is-visible' : ''}`} style={{ opacity: done ? 1 : 0, transition: 'opacity 0.6s ease 0.4s' }}>
          {heroStats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} delay={i * 120} />
          ))}
        </div>
      </div>
      <div className="hero-visual">
        <div id="webgl-container">
          {children}
        </div>
      </div>
      <a
        href="#hub"
        className="scroll-hint"
        aria-label="向下滚动探索更多"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('hub')?.scrollIntoView({ behavior: 'smooth' })
        }}
      >
        <span>SCROLL</span>
        <span className="scroll-hint__mouse" aria-hidden="true">
          <span className="scroll-hint__wheel"></span>
        </span>
      </a>
    </section>
  )
}
