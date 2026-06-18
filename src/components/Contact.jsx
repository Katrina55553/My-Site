import { Mail, Github, Twitter, Linkedin, ArrowUp, Send, MapPin, MessageCircle } from 'lucide-react'

const CONTACTS = [
  { icon: Mail, label: '邮箱', value: 'katrina@example.com', href: 'mailto:katrina@example.com', color: '#ef4444' },
  { icon: Github, label: 'GitHub', value: '@katrina-dev', href: 'https://github.com', color: '#a855f7' },
  { icon: Twitter, label: 'Twitter', value: '@katrina_ui', href: 'https://twitter.com', color: '#06b6d4' },
  { icon: Linkedin, label: 'LinkedIn', value: 'Katrina Frontend', href: 'https://linkedin.com', color: '#3b82f6' },
]

const QUICK_INFO = [
  { icon: MapPin, label: '所在地', value: '中国 · 上海' },
  { icon: MessageCircle, label: '响应时间', value: '通常 24 小时内' },
  { icon: Send, label: '合作状态', value: '接受自由职业 & 全职' },
]

export default function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-inner">
        <div className="contact-header">
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
        <div className="contact-quick-info">
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
        <div className="contact-cards">
          {CONTACTS.map((contact, i) => {
            const Icon = contact.icon
            return (
              <a
                key={i}
                href={contact.href}
                target={contact.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="contact-card"
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
        <form
          className="contact-form glass-card"
          onSubmit={(e) => {
            e.preventDefault()
            const form = e.currentTarget
            const btn = form.querySelector('.contact-form__submit')
            const original = btn.innerHTML
            btn.innerHTML = '<span>消息已发送 ✓</span>'
            btn.classList.add('sent')
            setTimeout(() => {
              btn.innerHTML = original
              btn.classList.remove('sent')
              form.reset()
            }, 2200)
          }}
        >
          <div className="contact-form__header">
            <h3>发送一条消息</h3>
            <p>留下你的想法，我会尽快回复你。</p>
          </div>
          <div className="contact-form__grid">
            <div className="form-group">
              <label>姓名</label>
              <input type="text" name="name" placeholder="你的名字" required />
            </div>
            <div className="form-group">
              <label>邮箱</label>
              <input type="email" name="email" placeholder="your@email.com" required />
            </div>
          </div>
          <div className="form-group">
            <label>主题</label>
            <input type="text" name="subject" placeholder="想聊点什么？" required />
          </div>
          <div className="form-group">
            <label>消息内容</label>
            <textarea name="message" rows="4" placeholder="在这里写下你的消息..." required></textarea>
          </div>
          <button type="submit" className="contact-form__submit">
            <Send size={18} />
            <span>发送消息</span>
          </button>
        </form>

        {/* 回到顶部 */}
        <a href="#hero" className="back-to-top">
          <ArrowUp size={20} />
          <span>回到顶部</span>
        </a>
      </div>
    </section>
  )
}
