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
  const [barHeights, setBarHeights] = useState(Array(12).fill(4))

  const synthRef = useRef(null)
  const playIntervalRef = useRef(null)
  const visualizerIntervalRef = useRef(null)
  const vinylRef = useRef(null)
  const trackRef = useRef(0)

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
        if (next >= PLAYLIST[idx].duration) {
          // 自动切到下一首
          const nextIdx = (idx + 1) % PLAYLIST.length
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
      setBarHeights(Array(12).fill(0).map(() => Math.floor(Math.random() * 32) + 6))
    }, 120)
  }, [])

  const pausePlayback = useCallback(() => {
    synthRef.current?.stop()
    clearInterval(playIntervalRef.current)
    clearInterval(visualizerIntervalRef.current)
    vinylRef.current?.classList.remove('playing')
    setBarHeights(Array(12).fill(4))
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

  const track = PLAYLIST[currentTrack]
  const progressPercent = (currentTime / track.duration) * 100

  return (
    <section id="lab" className="section">
      <div className="section-header reveal">
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
              {barHeights.map((h, i) => (
                <div key={i} className="bar" style={{ height: `${h}px` }}></div>
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
                onChange={(e) => setHue(Number(e.target.value))}
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
                onChange={(e) => setGlow(Number(e.target.value))}
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
