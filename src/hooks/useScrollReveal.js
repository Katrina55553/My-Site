import { useEffect } from 'react'

// 滚动渐入：监听所有 .reveal / .reveal-stagger 元素，进入视口时加 .is-visible
// 用 MutationObserver 兜底：懒加载组件延迟挂载时，新出现的 .reveal 元素也会被绑定
export default function useScrollReveal(deps = []) {
  useEffect(() => {
    const SELECTOR = '.reveal, .reveal-stagger'
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

    // 立即视口检查：元素若已可见则直接显示，否则交给 observer
    const scan = (el) => {
      const rect = el.getBoundingClientRect()
      const inViewport =
        rect.top < window.innerHeight * 0.9 && rect.bottom > window.innerHeight * 0.1
      if (inViewport) {
        el.classList.add('is-visible')
      } else if ('IntersectionObserver' in window) {
        observer.observe(el)
      } else {
        el.classList.add('is-visible')
      }
    }

    const rescanAll = () => {
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (!el.classList.contains('is-visible')) scan(el)
      })
    }

    // 初次扫描
    rescanAll()

    // 监听懒加载组件后续挂载产生的新 .reveal 元素
    const mo = new MutationObserver((mutations) => {
      let hasNew = false
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            if (node.matches?.(SELECTOR)) hasNew = true
            if (node.querySelector?.(SELECTOR)) hasNew = true
          }
        })
      })
      if (hasNew) rescanAll()
    })
    mo.observe(document.body, { childList: true, subtree: true })

    // 兜底：1.5s 后再扫一次，防止任何遗漏
    const fallback = setTimeout(rescanAll, 1500)

    return () => {
      observer.disconnect()
      mo.disconnect()
      clearTimeout(fallback)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
