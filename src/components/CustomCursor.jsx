import { useRef, useEffect } from 'react'

// 拖尾粒子池大小：复用固定数量的 DOM 节点，避免 mousemove 时频繁创建/销毁
const POOL_SIZE = 12

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const cursorPos = useRef({ x: 0, y: 0 })
  const trailCounter = useRef(0)
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
      pool.push(particle)
    }

    const handleMouseMove = (e) => {
      // 复用对象，避免高频 mousemove 产生 GC 压力
      mousePos.current.x = e.clientX
      mousePos.current.y = e.clientY

      // 每隔几次移动才激活一个粒子，从池中取下一个复用
      trailCounter.current++
      if (trailCounter.current % 3 === 0) {
        const el = pool[poolIndexRef.current]
        poolIndexRef.current = (poolIndexRef.current + 1) % POOL_SIZE
        // 用 Web Animations API 替代 CSS animation + 强制回流
        // 完全避免 void offsetWidth 的同步布局开销
        el.animate(
          [
            { opacity: 0.8, transform: `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(1)` },
            { opacity: 0, transform: `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(0.1)` },
          ],
          { duration: 500, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'forwards' }
        )
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

    // Lerp 缓动动画：系数越高越跟手（0.15 在高 DPI 下显得拖沓滞后）
    const animate = () => {
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.35
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.35
      // 用 translate3d 走 GPU 合成层，避免触发 layout
      cursor.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0) translate(-50%, -50%)`
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
      pool.forEach((el) => el.remove())
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
