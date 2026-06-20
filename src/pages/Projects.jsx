import { LayoutGrid, Globe, Terminal, Sparkles, ArrowUpRight, ArrowLeft, Github, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { projects } from '../data/content'

const ICON_MAP = {
  'layout-grid': LayoutGrid,
  globe: Globe,
  terminal: Terminal,
  sparkles: Sparkles,
}

export default function Projects() {
  return (
    <section className="section" style={{ paddingTop: '8rem' }}>
      <Link to="/" className="back-link">
        <ArrowLeft size={18} />
        <span>返回主页</span>
      </Link>
      <div className="section-header">
        <h2 className="section-title">项目展示</h2>
        <p className="section-desc">AI 全栈与后端工程项目展示，涵盖 Agent 编排、RAG 检索、异步架构与代码沙箱等核心实践。</p>
      </div>

      <div className="projects-grid">
        {projects.map((project, i) => {
          const Icon = ICON_MAP[project.icon] || LayoutGrid
          const hasLiveLink = project.link && project.link !== '#'
          const hasRepo = project.repo && project.repo !== '#'
          // 整卡点击主链接：优先在线访问，其次 GitHub
          const cardHref = hasLiveLink ? project.link : hasRepo ? project.repo : null
          const stop = (e) => e.stopPropagation()
          const CardWrapper = cardHref ? 'a' : 'div'
          const wrapperProps = cardHref
            ? { href: cardHref, target: '_blank', rel: 'noopener noreferrer' }
            : {}
          return (
            <CardWrapper key={i} className="project-card project-card--link" {...wrapperProps}>
              <div className="project-card__icon">
                <Icon size={24} />
              </div>
              <h3 className="project-card__name">{project.name}</h3>
              <p className="project-card__desc">{project.description}</p>
              <div className="project-card__highlights">
                {project.highlights.map((h, j) => (
                  <span key={j} className="project-card__highlight">{h}</span>
                ))}
              </div>
              <div className="project-card__tags">
                {project.tags.map((t, j) => (
                  <span key={j} className="project-card__tag">{t}</span>
                ))}
              </div>
              <div className="project-card__links" onClick={stop}>
                {hasLiveLink ? (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-card__link">
                    <ExternalLink size={14} /> 在线访问
                  </a>
                ) : null}
                {hasRepo ? (
                  <a href={project.repo} target="_blank" rel="noopener noreferrer" className="project-card__link project-card__link--repo">
                    <Github size={14} /> GitHub
                  </a>
                ) : null}
              </div>
            </CardWrapper>
          )
        })}
      </div>
    </section>
  )
}
