import { LayoutGrid, Globe, Terminal, Sparkles, ArrowUpRight, ArrowLeft } from 'lucide-react'
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
      <div className="section-header">
        <Link to="/" className="back-link">
          <ArrowLeft size={18} />
          <span>返回主页</span>
        </Link>
        <h2 className="section-title">项目展示</h2>
        <p className="section-desc">精选开源项目与 Web 应用，涵盖组件库、3D 交互、终端工具与动效库。</p>
      </div>

      <div className="projects-grid">
        {projects.map((project, i) => {
          const Icon = ICON_MAP[project.icon] || LayoutGrid
          return (
            <div key={i} className="project-card">
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
              <a href={project.link} className="project-card__link">
                查看项目 <ArrowUpRight size={14} />
              </a>
            </div>
          )
        })}
      </div>
    </section>
  )
}
