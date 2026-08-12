import { useEffect, useRef, useState } from 'react'

// 数字递增动画：元素进入视口时从 0 递增到 target
// 支持 prefers-reduced-motion：用户设置减少动画时直接显示终值
export default function useCountUp(target, { duration = 1400, startDelay = 0 } = {}) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const startedRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // 尊重无障碍：减少动画时直接跳到终值
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }

    const run = () => {
      if (startedRef.current) return
      startedRef.current = true
      const start = performance.now()
      const tick = (now) => {
        const elapsed = Math.min((now - start) / duration, 1)
        // easeOutCubic：前快后慢，符合自然观感
        const eased = 1 - Math.pow(1 - elapsed, 3)
        setValue(Math.round(target * eased))
        if (elapsed < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    const timer = startDelay > 0 ? setTimeout(run, startDelay) : null
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (startDelay > 0) {
            if (!timer) run()
          } else {
            run()
          }
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      if (timer) clearTimeout(timer)
    }
  }, [target, duration, startDelay])

  return { value, ref }
}
