import { useState, useRef, useEffect } from 'react'
import { terminalCommands, projects, blogPosts } from '../data/content'

// 初始历史记录
function getInitialHistory() {
  const lines = [
    { type: 'system', text: 'Welcome to Terminal OS v1.0.0.' },
    { type: 'system', text: 'Type <span class="cmd-highlight">help</span> to view all available commands.' },
    { type: 'system', text: '可用命令列表：' },
  ]
  const commands = [
    { name: 'neofetch', desc: '显示系统与开发者信息。' },
    { name: 'about', desc: '关于我的技术背景与定位。' },
    { name: 'blog', desc: '查看最近的博客文章列表。' },
    { name: 'projects', desc: '列出我的核心精选项目。' },
    { name: 'hack', desc: '启动炫酷的赛博朋克数据流。' },
    { name: 'clear', desc: '清空终端屏幕历史。' },
    { name: 'help', desc: '显示此帮助指南。' },
  ]
  commands.forEach((c) => {
    lines.push({ type: 'default', text: `  <span class="cmd-highlight">${c.name.padEnd(12)}</span> - ${c.desc}` })
  })
  return lines
}

export default function Terminal() {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState(getInitialHistory)

  const inputRef = useRef(null)
  const bodyRef = useRef(null)

  // 自动滚动到底部
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [history])

  const appendLine = (text, type = 'default') => {
    setHistory((prev) => [...prev, { type, text }])
  }

  const executeCommand = (rawCmd) => {
    const cmd = rawCmd.trim().toLowerCase()

    // 打印用户输入
    appendLine(`katrina > ${rawCmd}`, 'user')

    switch (cmd) {
      case 'help': {
        appendLine('可用命令列表：', 'system')
        const commands = [
          { name: 'neofetch', desc: '显示系统与开发者信息。' },
          { name: 'about', desc: '关于我的技术背景与定位。' },
          { name: 'blog', desc: '查看最近的博客文章列表。' },
          { name: 'projects', desc: '列出我的核心精选项目。' },
          { name: 'hack', desc: '启动炫酷的赛博朋克数据流。' },
          { name: 'clear', desc: '清空终端屏幕历史。' },
          { name: 'help', desc: '显示此帮助指南。' },
        ]
        commands.forEach((c) => {
          appendLine(`  <span class="cmd-highlight">${c.name.padEnd(12)}</span> - ${c.desc}`)
        })
        break
      }
      case 'about': {
        appendLine(terminalCommands.about.title, 'success')
        terminalCommands.about.lines.forEach((line) => appendLine(line))
        break
      }
      case 'blog': {
        appendLine('正在跳转到博客站点...', 'system')
        setTimeout(() => {
          window.open('https://blog.cogod.cn/', '_blank', 'noopener,noreferrer')
        }, 500)
        break
      }
      case 'projects': {
        appendLine('正在检索核心开源项目...', 'system')
        setTimeout(() => {
          appendLine('开源精选项目列表：', 'success')
          projects.forEach((p) => {
            appendLine(`  - <span class="cmd-highlight">${p.name}</span>: ${p.description} (${p.tags.join(' / ')})`)
          })
        }, 600)
        break
      }
      case 'clear':
        setHistory([])
        break
      case 'neofetch': {
        const logo = `   /\\_/\\  \n  ( o.o ) \n   > ^ <  \n  KATRINA`
        const info = `<span class="cmd-highlight">OS</span>: Creative Terminal OS v1.0.0
<span class="cmd-highlight">Host</span>: Web-Environment
<span class="cmd-highlight">Uptime</span>: 2026 days
<span class="cmd-highlight">Shell</span>: Katrina-Zsh
<span class="cmd-highlight">Resolution</span>: ${window.innerWidth}x${window.innerHeight}
<span class="cmd-highlight">CPU</span>: Brain M3 Ultra (16 Cores)
<span class="cmd-highlight">Memory</span>: 100% Devoted / 16GB
<span class="cmd-highlight">Theme</span>: Cyberpunk Glassmorphism`
        appendLine(`<div style="display:flex;gap:2.5rem;align-items:center"><pre class="terminal-line ascii-art" style="margin:0">${logo}</pre><div class="terminal-line" style="line-height:1.7">${info}</div></div>`)
        break
      }
      case 'hack': {
        appendLine('Initializing Cyber intrusion...', 'system')
        let count = 0
        const hackInterval = setInterval(() => {
          let binaryLine = ''
          for (let i = 0; i < 40; i++) {
            binaryLine += Math.random() > 0.5 ? '1' : '0'
          }
          appendLine(binaryLine, 'success')
          count++
          if (count > 25) {
            clearInterval(hackInterval)
            appendLine('SYSTEM INTRUSION SUCCESSFUL.', 'system')
            appendLine('Access granted. Welcome back, Admin.', 'success')
          }
        }, 80)
        break
      }
      default:
        appendLine(`Command not found: "${cmd}". Type "help" to see available commands.`, 'system')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const cmd = input
      setInput('')
      if (cmd.trim() !== '') {
        executeCommand(cmd)
      }
    }
  }

  const getLineClass = (type) => {
    switch (type) {
      case 'user': return 'terminal-line user-cmd'
      case 'system': return 'terminal-line system-msg'
      case 'success': return 'terminal-line success-msg'
      default: return 'terminal-line'
    }
  }

  return (
    <section id="terminal-section" className="section">
      <div className="section-header reveal">
        <h2 className="section-title">Sci-Fi 极客终端</h2>
        <p className="section-desc">输入指令与系统进行底层交互，解锁彩蛋并快速查询相关信息。</p>
      </div>

      <div className="terminal-container glass-card reveal">
        <div className="terminal-header">
          <div className="terminal-actions">
            <span className="action-dot red"></span>
            <span className="action-dot yellow"></span>
            <span className="action-dot green"></span>
          </div>
          <span className="terminal-title">katrina@developer-core:~</span>
          <div className="terminal-info-badge">SYS: ONLINE</div>
        </div>
        <div className="terminal-body" ref={bodyRef} onClick={() => inputRef.current?.focus()}>
          {history.map((line, i) => (
            <div
              key={i}
              className={getLineClass(line.type)}
              dangerouslySetInnerHTML={{ __html: line.text }}
            />
          ))}
          <div className="terminal-input-line">
            <span className="terminal-prompt">katrina &gt;</span>
            <div className="terminal-input-wrapper">
              <span className="terminal-visible-text">{input}</span>
              <span className="terminal-cursor"></span>
              <input
                ref={inputRef}
                type="text"
                autoComplete="off"
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  caretColor: 'transparent',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
