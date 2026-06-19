import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { resume } from '../data/content'

export default function Resume() {
  return (
    <section className="section" style={{ paddingTop: '8rem' }}>
      <div className="section-header">
        <Link to="/" className="back-link">
          <ArrowLeft size={18} />
          <span>返回主页</span>
        </Link>
        <h2 className="section-title">个人简历</h2>
        <p className="section-desc">我的技术背景、工作经历与教育信息。</p>
      </div>

      <div className="resume-grid">
        {/* 左侧：个人信息 + 技能 + 教育 */}
        <div className="resume-sidebar">
          <div className="resume-card glass-card resume-profile">
            <div className="resume-profile__avatar">刘</div>
            <h3 className="resume-profile__name">{resume.name}</h3>
            <p className="resume-profile__title">{resume.title}</p>
            <p className="resume-profile__summary">{resume.summary}</p>
          </div>

          <div className="resume-card glass-card">
            <h3 className="resume-card__title">技能栈</h3>
            <div className="skills-list">
              {resume.skills.map((skill, i) => (
                <div key={i} className="skill-category">
                  <div className="skill-category__name">{skill.category}</div>
                  <div className="skill-items">
                    {skill.items.map((item, j) => (
                      <span key={j} className="skill-item">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="resume-card glass-card">
            <h3 className="resume-card__title">教育背景</h3>
            {resume.education.map((edu, i) => (
              <div key={i} className="education-item">
                <div className="education-degree">{edu.degree}</div>
                <div className="education-school">{edu.school}</div>
                <div className="education-period">{edu.period}</div>
                <p className="education-desc">{edu.description}</p>
              </div>
            ))}
          </div>

          <div className="resume-card glass-card">
            <h3 className="resume-card__title">荣誉奖项</h3>
            <div className="awards-list">
              {resume.awards.map((award, i) => (
                <div key={i} className="award-item">
                  <span className="award-icon">★</span>
                  <div className="award-content">
                    <div className="award-name">{award.name}</div>
                    {award.period && <div className="award-period">{award.period}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：项目经历时间线 */}
        <div className="resume-card glass-card">
          <h3 className="resume-card__title">项目经历</h3>
          <div className="resume-timeline">
            {resume.experience.map((exp, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-header">
                  <div>
                    <div className="timeline-role">{exp.role}</div>
                    <div className="timeline-company">{exp.company}</div>
                  </div>
                  <div className="timeline-period">{exp.period}</div>
                </div>
                <p className="timeline-desc">{exp.description}</p>
                <ul className="timeline-achievements">
                  {exp.achievements.map((a, j) => (
                    <li key={j}>{a}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
