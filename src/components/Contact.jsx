import { useState } from 'react'
import { Mail, Github, ArrowUp, MapPin, MessageCircle, Send, Phone, ArrowLeft, CheckCircle2 } from 'lucide-react'
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
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // 前端演示：组装 mailto 链接打开邮件客户端
    const subject = encodeURIComponent(`[个人网站留言] 来自 ${form.name || '访客'}`)
    const body = encodeURIComponent(`${form.message}\n\n—— ${form.name} (${form.email})`)
    window.location.href = `mailto:ambition55553@gmail.com?subject=${subject}&body=${body}`
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setForm({ name: '', email: '', message: '' })
    }, 3000)
  }

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

        {/* 留言表单 */}
        <form className="contact-form glass-card reveal" onSubmit={handleSubmit}>
          <div className="contact-form__header">
            <h3>发送一条消息</h3>
            <p>填写下方表单，将打开你的邮件客户端并预填内容，期待你的来信。</p>
          </div>
          <div className="contact-form__grid">
            <div className="form-group">
              <label htmlFor="contact-name">姓名</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                placeholder="你的称呼"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact-email">邮箱</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="contact-message">留言内容</label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              placeholder="想说的话..."
              value={form.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit" className={`contact-form__submit ${sent ? 'sent' : ''}`}>
            {sent ? (
              <>
                <CheckCircle2 size={18} /> 已打开邮件客户端
              </>
            ) : (
              <>
                <Send size={18} /> 发送消息
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  )
}
