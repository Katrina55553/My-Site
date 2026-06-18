import { BookOpen, LayoutGrid, ExternalLink, ArrowUpRight, Globe, Terminal, Sparkles } from 'lucide-react'
import TiltCard from './TiltCard'
import { projects, blogPosts } from '../data/content'

const ICON_MAP = {
  'layout-grid': LayoutGrid,
  globe: Globe,
  terminal: Terminal,
  sparkles: Sparkles,
}

export default function Hub() {
  return (
    <section id="hub" className="section">
      <div className="section-header">
        <h2 className="section-title">项目展示</h2>
        <p className="section-desc">快速前往我的个人博客与精选开源项目，了解我的技术沉淀与创造力。</p>
      </div>

      {/* 中转卡片 */}
      <div className="hub-grid">
        <TiltCard>
          <div className="card-glow"></div>
          <div className="card-content">
            <div className="card-header-icon">
              <BookOpen size={28} />
            </div>
            <h3 className="card-title">个人博客</h3>
            <p className="card-desc">记录前端技术、设计探索、算法以及生活随笔。分享在构建Web过程中的点滴思考。</p>
            <div className="blog-preview-list">
              {blogPosts.map((post, i) => (
                <div key={i} className="preview-item">
                  <span className="preview-tag">{post.tag}</span>
                  <span className="preview-title">{post.title}</span>
                </div>
              ))}
            </div>
            <a href="#" className="card-action-btn">
              <span>阅读博客</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </TiltCard>

        <TiltCard>
          <div className="card-glow"></div>
          <div className="card-content">
            <div className="card-header-icon">
              <LayoutGrid size={28} />
            </div>
            <h3 className="card-title">精选项目</h3>
            <p className="card-desc">开源工具、Web应用以及动效库展示。所有项目均包含完整代码库和在线预览。</p>
            <div className="project-tags">
              <span className="tag">React</span>
              <span className="tag">Three.js</span>
              <span className="tag">Vite</span>
              <span className="tag">CSS variables</span>
              <span className="tag">Animations</span>
            </div>
            <a href="#" className="card-action-btn">
              <span>项目大厅</span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        </TiltCard>
      </div>

      {/* 详细项目展示 */}
      <div style={{ marginTop: '3rem' }}>
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
      </div>
    </section>
  )
}
