import { useEffect } from 'react'

// 滚动渐入：监听所有 .reveal / .reveal-stagger 元素，进入视口时加 .is-visible
// 接受依赖数组（如 [location.pathname]），路由切换后延迟一帧重新绑定，确保懒加载组件已挂载
export default function useScrollReveal(deps = []) {
  useEffect(() => {
    const bind = () => {
      const els = document.querySelectorAll('.reveal, .reveal-stagger')
      if (!els.length) return

      // 不支持 IntersectionObserver 时直接显示
      if (!('IntersectionObserver' in window)) {
        els.forEach((el) => el.classList.add('is-visible'))
        return
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
      )

      els.forEach((el) => observer.observe(el))
      return observer
    }

    // 延迟一帧，等待 Suspense 懒加载组件挂载完成
    let observer
    const raf = requestAnimationFrame(() => {
      observer = bind()
    })

    return () => {
      cancelAnimationFrame(raf)
      observer?.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
