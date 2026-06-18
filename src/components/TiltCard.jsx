import { useRef, useEffect } from 'react'

// 3D 倾斜卡片效果包装器
export default function TiltCard({ children, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const card = ref.current
    if (!card) return

    const glow = card.querySelector('.card-glow')

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const xPercent = x / rect.width - 0.5
      const yPercent = y / rect.height - 0.5

      card.style.transform = `perspective(1000px) rotateX(${yPercent * -12}deg) rotateY(${xPercent * 12}deg) scale3d(1.02, 1.02, 1.02)`

      if (glow) {
        glow.style.opacity = '1'
        glow.style.left = `${x - 150}px`
        glow.style.top = `${y - 150}px`
      }
    }

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
      if (glow) glow.style.opacity = '0'
    }

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div ref={ref} className={`hub-card tilt-card ${className}`}>
      {children}
    </div>
  )
}
