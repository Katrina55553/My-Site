import { useRef, useEffect } from 'react'

// 拖尾粒子池大小：复用固定数量的 DOM 节点，避免 mousemove 时频繁创建/销毁
const POOL_SIZE = 12

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const cursorPos = useRef({ x: 0, y: 0 })
  const trailCounter = useRef(0)
  const particlePoolRef = useRef([])
  const poolIndexRef = useRef(0)

  useEffect(() => {
    document.body.classList.add('custom-cursor-enabled')

    const cursor = cursorRef.current
    let animationFrame = null

    // 预创建固定数量的拖尾粒子节点，循环复用
    const pool = []
    for (let i = 0; i < POOL_SIZE; i++) {
      const particle = document.createElement('div')
      particle.className = 'cursor-trail-particle'
      particle.style.opacity = '0'
      document.body.appendChild(particle)
      pool.push({ el: particle, life: 0 })
    }
    particlePoolRef.current = pool

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY }

      // 每隔几次移动才激活一个粒子，从池中取下一个复用
      trailCounter.current++
      if (trailCounter.current % 3 === 0) {
        const item = pool[poolIndexRef.current]
        poolIndexRef.current = (poolIndexRef.current + 1) % POOL_SIZE
        item.el.style.left = `${e.clientX}px`
        item.el.style.top = `${e.clientY}px`
        // 重新触发动画：先重置再启用
        item.el.style.animation = 'none'
        // 强制回流以重启动画
        void item.el.offsetWidth
        item.el.style.animation = 'fade-particle 0.5s cubic-bezier(0.16,1,0.3,1) forwards'
      }
    }

    const INTERACTIVE_SELECTOR =
      'a, button, input, .tilt-card, .preview-item, .preset-btn, .progress-bar-wrap, .contact-card, .quick-info-item, .back-to-top, #webgl-container, #webgl-container canvas'

    const handleMouseOver = (e) => {
      if (e.target.closest(INTERACTIVE_SELECTOR)) {
        cursor.classList.add('hovering')
      }
    }

    const handleMouseOut = (e) => {
      if (e.target.closest(INTERACTIVE_SELECTOR)) {
        cursor.classList.remove('hovering')
      }
    }

    const handleMouseDown = () => cursor.classList.add('grabbing')
    const handleMouseUp = () => cursor.classList.remove('grabbing')

    // Lerp 缓动动画
    const animate = () => {
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15
      cursor.style.left = `${cursorPos.current.x}px`
      cursor.style.top = `${cursorPos.current.y}px`
      animationFrame = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    animationFrame = requestAnimationFrame(animate)

    return () => {
      document.body.classList.remove('custom-cursor-enabled')
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      cancelAnimationFrame(animationFrame)
      // 清理池中所有粒子节点
      pool.forEach((item) => item.el.remove())
    }
  }, [])

  return (
    <div ref={cursorRef} className="custom-cursor">
      <div className="cursor-dot"></div>
      <div className="cursor-crosshair">
        <div className="ch-line ch-h"></div>
        <div className="ch-line ch-v"></div>
      </div>
    </div>
  )
}
