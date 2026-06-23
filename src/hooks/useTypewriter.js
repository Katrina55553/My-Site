import { useState, useEffect } from 'react'

// 打字机 hook：逐字显示文本
// text: 要显示的完整文本
// speed: 每个字符的间隔（ms）
// startDelay: 开始前的延迟（ms）
// onDone: 完成时的回调
export default function useTypewriter(text, { speed = 80, startDelay = 300, onDone } = {}) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    let timer = null

    const startTimer = setTimeout(() => {
      timer = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(timer)
          setDone(true)
          onDone?.()
        }
      }, speed)
    }, startDelay)

    return () => {
      clearTimeout(startTimer)
      if (timer) clearInterval(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed, startDelay])

  return { displayed, done }
}
