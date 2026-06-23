import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary'
import './style.css'

// 禁用浏览器刷新时的滚动位置自动恢复，避免刷新后停在非首屏位置
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}
// 连续多帧强制置顶，覆盖懒加载/异步渲染引起的滚动
const forceTop = () => {
  window.scrollTo(0, 0)
  requestAnimationFrame(() => {
    window.scrollTo(0, 0)
    requestAnimationFrame(() => window.scrollTo(0, 0))
  })
}
forceTop()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <App />
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>
)
