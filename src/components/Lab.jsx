import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { AmbientSynth } from '../utils/AmbientSynth'

const PLAYLIST = [
  { title: 'Cyber Resonance', artist: 'Procedural Synth', duration: 165 },
  { title: 'Neon Highway', artist: 'Procedural Synth', duration: 192 },
  { title: 'Digital Drift', artist: 'Procedural Synth', duration: 140 },
]

const PRESETS = [
  { hue: 280, gradient: 'linear-gradient(135deg, #a855f7, #6366f1)' },
  { hue: 180, gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
  { hue: 130, gradient: 'linear-gradient(135deg, #10b981, #059669)' },
  { hue: 15, gradient: 'linear-gradient(135deg, #f97316, #ef4444)' },
]

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

export default function Lab({ hue, setHue, glow, setGlow }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  const synthRef = useRef(null)
  const playIntervalRef = useRef(null)
  const visualizerIntervalRef = useRef(null)
  const vinylRef = useRef(null)
  const trackRef = useRef(0)
  // 频谱条 DOM 引用池：直改样式，避免 120ms 一次 setState 引发整个 Lab reconcile
  const barsRef = useRef([])
  // 滑块 rAF 节流状态（见 handleHueChange / handleGlowChange）
  const hueRafRef = useRef(null)
  const glowRafRef = useRef(null)
  const pendingHueRef = useRef(0)
  const pendingGlowRef = useRef(0)

  // 初始化合成器
  if (!synthRef.current) {
    synthRef.current = new AmbientSynth()
  }

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      synthRef.current?.stop()
      clearInterval(playIntervalRef.current)
      clearInterval(visualizerIntervalRef.current)
      if (hueRafRef.current !== null) cancelAnimationFrame(hueRafRef.current)
      if (glowRafRef.current !== null) cancelAnimationFrame(glowRafRef.current)
    }
  }, [])

  const startPlayback = useCallback((trackIndex) => {
    const idx = trackIndex ?? trackRef.current
    synthRef.current?.start(idx)
    vinylRef.current?.classList.add('playing')

    clearInterval(playIntervalRef.current)
    clearInterval(visualizerIntervalRef.current)

    playIntervalRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 1
        // 必须用 trackRef 取当前曲目：闭包里的 idx 是启动时的快照，
        // 自动切歌后会一直用第一首的时长/索引，导致第 2 首被反复重启、第 3 首永远播不到
        const curIdx = trackRef.current
        if (next >= PLAYLIST[curIdx].duration) {
          // 自动切到下一首
          const nextIdx = (curIdx + 1) % PLAYLIST.length
          trackRef.current = nextIdx
          setCurrentTrack(nextIdx)
          synthRef.current?.stop()
          synthRef.current?.start(nextIdx)
          return 0
        }
        return next
      })
    }, 1000)

    visualizerIntervalRef.current = setInterval(() => {
      barsRef.current.forEach((bar) => {
        if (bar) bar.style.height = `${Math.floor(Math.random() * 32) + 6}px`
      })
    }, 120)
  }, [])

  const pausePlayback = useCallback(() => {
    synthRef.current?.stop()
    clearInterval(playIntervalRef.current)
    clearInterval(visualizerIntervalRef.current)
    vinylRef.current?.classList.remove('playing')
    // 清除内联高度，回落到 CSS 默认的 4px
    barsRef.current.forEach((bar) => {
      if (bar) bar.style.height = ''
    })
  }, [])

  const handlePlayClick = () => {
    const newPlaying = !isPlaying
    setIsPlaying(newPlaying)
    if (newPlaying) startPlayback()
    else pausePlayback()
  }

  const handleNext = () => {
    const next = (trackRef.current + 1) % PLAYLIST.length
    trackRef.current = next
    setCurrentTrack(next)
    setCurrentTime(0)
    if (isPlaying) {
      pausePlayback()
      setTimeout(() => startPlayback(next), 100)
    }
  }

  const handlePrev = () => {
    const prev = (trackRef.current - 1 + PLAYLIST.length) % PLAYLIST.length
    trackRef.current = prev
    setCurrentTrack(prev)
    setCurrentTime(0)
    if (isPlaying) {
      pausePlayback()
      setTimeout(() => startPlayback(prev), 100)
    }
  }

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickRatio = (e.clientX - rect.left) / rect.width
    setCurrentTime(Math.floor(clickRatio * PLAYLIST[trackRef.current].duration))
  }

  // 滑块 rAF 节流：拖动时 input 事件可能一帧内触发多次，
  // 合并为每帧一次 setState（setHue/setGlow 会引发 App 整树 reconcile + 3D 粒子顶点色重写）。
  // pending ref 保证应用的是该帧内最后一次值，滑块不会回跳
  const handleHueChange = (e) => {
    pendingHueRef.current = Number(e.target.value)
    if (hueRafRef.current !== null) return
    hueRafRef.current = requestAnimationFrame(() => {
      hueRafRef.current = null
      setHue(pendingHueRef.current)
    })
  }
  const handleGlowChange = (e) => {
    pendingGlowRef.current = Number(e.target.value)
    if (glowRafRef.current !== null) return
    glowRafRef.current = requestAnimationFrame(() => {
      glowRafRef.current = null
      setGlow(pendingGlowRef.current)
    })
  }

  const track = PLAYLIST[currentTrack]
  const progressPercent = (currentTime / track.duration) * 100

  return (
    <section id="lab" className="section">
      <div className="section-header reveal">
        <span className="section-eyebrow">// 03 — Lab</span>
        <h2 className="section-title">UI 实验室</h2>
        <p className="section-desc">这里是我设计和交互的试验场。你可以亲自操作这些极具视觉表现力的小组件。</p>
      </div>

      <div className="lab-grid reveal-stagger">
        {/* 音乐播放器 */}
        <div className="lab-widget glass-card">
          <div className="widget-header">
            <span className="widget-tag">UI Component</span>
            <div className="widget-status">
              <span className="status-dot green"></span>Simulated
            </div>
          </div>
          <div className="music-player-body">
            <div className="vinyl-container">
              <div ref={vinylRef} className="vinyl-disc">
                <div className="vinyl-center"></div>
              </div>
            </div>
            <div className="track-info">
              <h4 className="track-title">{track.title}</h4>
              <p className="track-artist">{track.artist}</p>
            </div>
            <div className="audio-visualizer">
              {Array.from({ length: 12 }, (_, i) => (
                // React 19 安全写法：ref 回调用语句体，避免隐式返回 DOM 节点被当作 cleanup
                <div key={i} className="bar" ref={(el) => { barsRef.current[i] = el }}></div>
              ))}
            </div>
            <div className="progress-container">
              <span className="time-elapsed">{formatTime(currentTime)}</span>
              <div className="progress-bar-wrap" onClick={handleProgressClick}>
                <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <span className="time-total">{formatTime(track.duration)}</span>
            </div>
            <div className="player-controls">
              <button className="ctrl-btn" onClick={handlePrev}><SkipBack size={20} /></button>
              <button className="ctrl-btn play-btn" onClick={handlePlayClick}>
                {isPlaying ? <Pause size={22} /> : <Play size={22} />}
              </button>
              <button className="ctrl-btn" onClick={handleNext}><SkipForward size={20} /></button>
            </div>
          </div>
        </div>

        {/* 主题控制器 */}
        <div className="lab-widget glass-card">
          <div className="widget-header">
            <span className="widget-tag">Control Center</span>
            <div className="widget-status">
              <span className="status-dot purple"></span>Realtime
            </div>
          </div>
          <div className="controller-body">
            <h4 className="ctrl-title">个性化主题霓虹色</h4>
            <p className="ctrl-desc">调节下方滑块，实时修改全站的色彩氛围（更新全局 CSS 变量）。</p>

            <div className="control-group">
              <label>色相 (Hue): <span>{hue}</span>°</label>
              <input
                type="range"
                min="0"
                max="360"
                value={hue}
                className="neon-slider"
                onChange={handleHueChange}
              />
            </div>

            <div className="control-group">
              <label>霓虹亮度 (Glow): <span>{glow}</span>%</label>
              <input
                type="range"
                min="50"
                max="150"
                value={glow}
                className="neon-slider"
                onChange={handleGlowChange}
              />
            </div>

            <div className="theme-presets">
              {PRESETS.map((preset) => (
                <button
                  key={preset.hue}
                  className={`preset-btn ${Math.abs(hue - preset.hue) < 10 ? 'active' : ''}`}
                  style={{ background: preset.gradient }}
                  onClick={() => setHue(preset.hue)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
