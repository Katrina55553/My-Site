import { BookOpen, LayoutGrid, ExternalLink, ArrowUpRight, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import TiltCard from './TiltCard'
import { blogPosts } from '../data/content'

export default function Hub() {
  return (
    <section id="hub" className="section">
      <div className="section-header">
        <h2 className="section-title">项目展示</h2>
        <p className="section-desc">快速前往我的核心项目、个人简历与技术博客，了解我的工程能力与创造力。</p>
      </div>

      {/* 中转卡片 */}
      <div className="hub-grid">
        {/* 精选项目 */}
        <TiltCard>
          <div className="card-glow"></div>
          <div className="card-content">
            <div className="card-header-icon">
              <LayoutGrid size={28} />
            </div>
            <h3 className="card-title">精选项目</h3>
            <p className="card-desc">AI 全栈与后端工程项目展示，涵盖 Agent 编排、RAG 检索、异步判题与代码沙箱等核心实践。</p>
            <div className="project-tags">
              <span className="tag">LangGraph</span>
              <span className="tag">Spring Boot</span>
              <span className="tag">Docker</span>
              <span className="tag">RabbitMQ</span>
              <span className="tag">MCP</span>
            </div>
            <Link to="/projects" className="card-action-btn">
              <span>项目大厅</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </TiltCard>

        {/* 个人简历 */}
        <TiltCard>
          <div className="card-glow"></div>
          <div className="card-content">
            <div className="card-header-icon">
              <FileText size={28} />
            </div>
            <h3 className="card-title">个人简历</h3>
            <p className="card-desc">我的技术背景、项目经历、技能栈、教育信息与荣誉奖项。了解我的工程成长轨迹。</p>
            <div className="project-tags">
              <span className="tag">AI 全栈</span>
              <span className="tag">数据科学</span>
              <span className="tag">算法竞赛</span>
            </div>
            <Link to="/resume" className="card-action-btn">
              <span>查看简历</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </TiltCard>

        {/* 个人博客 */}
        <TiltCard>
          <div className="card-glow"></div>
          <div className="card-content">
            <div className="card-header-icon">
              <BookOpen size={28} />
            </div>
            <h3 className="card-title">个人博客</h3>
            <p className="card-desc">记录 AI 工程、后端架构、算法竞赛与技术探索。分享在构建产品过程中的工程思考。</p>
            <div className="blog-preview-list">
              {blogPosts.map((post, i) => (
                <div key={i} className="preview-item">
                  <span className="preview-tag">{post.tag}</span>
                  <span className="preview-title">{post.title}</span>
                </div>
              ))}
            </div>
            <a href="https://cogod.cn" target="_blank" rel="noopener noreferrer" className="card-action-btn">
              <span>阅读博客</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </TiltCard>
      </div>
    </section>
  )
}
