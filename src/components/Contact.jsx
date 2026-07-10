import { Mail, Github, ArrowUp, MapPin, MessageCircle, Send, Globe, Phone, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const CONTACTS = [
  { icon: Mail, label: '邮箱', value: 'ambition55553@gmail.com', href: 'mailto:ambition55553@gmail.com', color: '#ef4444', span: true },
  { icon: Github, label: 'GitHub', value: '@Katrina55553', href: 'https://github.com/Katrina55553', color: '#a855f7' },
  { icon: Phone, label: '电话', value: '13817153416', href: 'tel:13817153416', color: '#10b981' },
]

const QUICK_INFO = [
  { icon: MapPin, label: '所在地', value: '中国 · 上海' },
  { icon: MessageCircle, label: '响应时间', value: '12 小时内' },
  { icon: Send, label: '合作状态', value: '接受实习 & 项目合作' },
]

export default function Contact() {
  return (
    <section className="section" style={{ paddingTop: '8rem' }}>
      <Link to="/" className="back-link">
        <ArrowLeft size={18} />
        <span>返回主页</span>
      </Link>
      <div className="contact-inner">
        <div className="contact-header reveal">
          <span className="contact-badge">
            <span className="pulse-dot"></span>
            <span>LET'S CONNECT</span>
          </span>
          <h2 className="contact-title">
            让我们<span className="gradient-text">一起创造</span>
            <br />
            非凡的数字体验
          </h2>
          <p className="contact-subtitle">
            无论是项目合作、技术交流，还是单纯打个招呼，我都很乐意收到你的消息。
          </p>
        </div>

        {/* 快速信息条 */}
        <div className="contact-quick-info reveal-stagger">
          {QUICK_INFO.map((info, i) => {
            const Icon = info.icon
            return (
              <div key={i} className="quick-info-item">
                <div className="quick-info-icon">
                  <Icon size={18} />
                </div>
                <div className="quick-info-text">
                  <span className="quick-info-label">{info.label}</span>
                  <span className="quick-info-value">{info.value}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* 联系方式卡片网格 */}
        <div className="contact-cards contact-cards--compact reveal-stagger">
          {CONTACTS.map((contact, i) => {
            const Icon = contact.icon
            return (
              <a
                key={i}
                href={contact.href}
                target={contact.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className={contact.span ? 'contact-card contact-card--span' : 'contact-card'}
              >
                <div className="contact-card__icon" style={{ '--card-color': contact.color }}>
                  <Icon size={24} />
                </div>
                <div className="contact-card__body">
                  <span className="contact-card__label">{contact.label}</span>
                  <span className="contact-card__value">{contact.value}</span>
                </div>
                <div className="contact-card__arrow">
                  <ArrowUp size={16} />
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
