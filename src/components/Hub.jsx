import { BookOpen, LayoutGrid, ExternalLink, ArrowUpRight, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import TiltCard from './TiltCard'
import { blogPosts } from '../data/content'

export default function Hub() {
  return (
    <section id="hub" className="section">
      <div className="section-header">
        <h2 className="section-title">项目展示</h2>
        <p className="section-desc">快速前往我的个人博客、精选项目与简历，了解我的技术沉淀与创造力。</p>
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
            <p className="card-desc">开源工具、Web应用以及动效库展示。所有项目均包含完整代码库和在线预览。</p>
            <div className="project-tags">
              <span className="tag">React</span>
              <span className="tag">Three.js</span>
              <span className="tag">Vite</span>
              <span className="tag">CSS variables</span>
              <span className="tag">Animations</span>
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
            <p className="card-desc">我的技术背景、工作经历、技能栈与教育信息。了解我的职业发展轨迹。</p>
            <div className="project-tags">
              <span className="tag">前端开发</span>
              <span className="tag">创意交互</span>
              <span className="tag">3D 可视化</span>
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
      </div>
    </section>
  )
}
