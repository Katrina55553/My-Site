import { useRef, useEffect } from 'react'

// 全局鼠标光晕：大面积柔光跟随鼠标，与主题色联动
// 区别于 CustomCursor（小光标点）：这个是"环境光"，营造整页氛围感
export default function MouseGlow() {
  const glowRef = useRef(null)
  const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const glowPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })

  useEffect(() => {
    const glow = glowRef.current
    let raf = null

    const handleMouseMove = (e) => {
      mousePos.current.x = e.clientX
      mousePos.current.y = e.clientY
    }

    // Lerp 平滑跟随，比光标用更大的惯性，光晕"飘"得更柔和
    const animate = () => {
      glowPos.current.x += (mousePos.current.x - glowPos.current.x) * 0.08
      glowPos.current.y += (mousePos.current.y - glowPos.current.y) * 0.08
      glow.style.transform = `translate3d(${glowPos.current.x}px, ${glowPos.current.y}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="mouse-glow-container" aria-hidden="true">
      <div ref={glowRef} className="mouse-glow"></div>
    </div>
  )
}
