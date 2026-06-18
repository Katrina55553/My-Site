// 网页内置合成器类 (Web Audio API Procedural Synthesizer)
// 100% 离线、免流量，极客范十足的 Web 创意编程。
export class AmbientSynth {
  constructor() {
    this.ctx = null
    this.isPlaying = false
    this.oscillators = []
    this.gainNode = null
    this.currentChord = 0
    this.chordInterval = null

    // 三套不同的和弦进程，对应三首乐曲
    this.trackChords = [
      // Track 1: Cyber Resonance (Am7 - D7 - Gmaj7 - Cmaj7)
      [
        [220.00, 261.63, 329.63, 392.00],
        [146.83, 293.66, 369.99, 440.00],
        [196.00, 246.94, 293.66, 392.00],
        [130.81, 261.63, 329.63, 493.88],
      ],
      // Track 2: Neon Highway (Em - C - D - Bm)
      [
        [164.81, 246.94, 329.63, 392.00],
        [130.81, 261.63, 329.63, 523.25],
        [146.83, 293.66, 369.99, 440.00],
        [123.47, 246.94, 293.66, 440.00],
      ],
      // Track 3: Digital Drift (F#m7 - B7 - G#m7 - C#7)
      [
        [185.00, 220.00, 277.18, 369.99],
        [123.47, 246.94, 311.13, 440.00],
        [207.65, 246.94, 311.13, 415.30],
        [138.59, 277.18, 349.23, 493.88],
      ],
    ]
  }

  start(trackIndex) {
    if (this.isPlaying) this.stop()
    this.isPlaying = true

    // 懒加载 AudioContext，确保在用户手势点击后初始化
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    const chords = this.trackChords[trackIndex] || this.trackChords[0]
    this.currentChord = 0

    this.gainNode = this.ctx.createGain()
    this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime)
    this.gainNode.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 1.0)
    this.gainNode.connect(this.ctx.destination)

    this.playChord(chords[this.currentChord], trackIndex)

    this.chordInterval = setInterval(() => {
      this.currentChord = (this.currentChord + 1) % chords.length
      this.transitionToChord(chords[this.currentChord], trackIndex)
    }, 4500)
  }

  playChord(frequencies, trackIndex) {
    this.stopOscillators()

    const now = this.ctx.currentTime
    const waveTypes = ['sine', 'triangle', 'sine']
    const type = waveTypes[trackIndex] || 'sine'

    frequencies.forEach(freq => {
      const osc = this.ctx.createOscillator()
      osc.type = type
      osc.frequency.setValueAtTime(freq, now)

      // LFO 模拟 Lofi 磁带抖动
      const lfo = this.ctx.createOscillator()
      const lfoGain = this.ctx.createGain()
      lfo.frequency.value = 4 + Math.random() * 2
      lfoGain.gain.value = 1.2
      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)

      const noteGain = this.ctx.createGain()
      noteGain.gain.setValueAtTime(0, now)
      noteGain.gain.linearRampToValueAtTime(0.25, now + 0.8)

      osc.connect(noteGain)
      noteGain.connect(this.gainNode)

      lfo.start(now)
      osc.start(now)

      this.oscillators.push({ osc, lfo, noteGain })
    })
  }

  transitionToChord(newFrequencies, trackIndex) {
    const now = this.ctx.currentTime

    this.oscillators.forEach(item => {
      item.noteGain.gain.cancelScheduledValues(now)
      item.noteGain.gain.setValueAtTime(item.noteGain.gain.value, now)
      item.noteGain.gain.linearRampToValueAtTime(0, now + 0.8)

      const tempOsc = item.osc
      const tempLfo = item.lfo
      setTimeout(() => {
        try { tempOsc.stop(); tempLfo.stop() } catch (e) { }
      }, 850)
    })
    this.oscillators = []

    setTimeout(() => {
      if (this.isPlaying) this.playChord(newFrequencies, trackIndex)
    }, 100)
  }

  stopOscillators() {
    this.oscillators.forEach(item => {
      try { item.osc.stop(); item.lfo.stop() } catch (e) { }
    })
    this.oscillators = []
  }

  stop() {
    if (!this.isPlaying) return
    this.isPlaying = false
    clearInterval(this.chordInterval)

    if (this.gainNode && this.ctx) {
      const now = this.ctx.currentTime
      this.gainNode.gain.cancelScheduledValues(now)
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now)
      this.gainNode.gain.linearRampToValueAtTime(0, now + 0.5)

      setTimeout(() => {
        this.stopOscillators()
        if (this.ctx && this.ctx.state === 'running') this.ctx.suspend()
      }, 600)
    }
  }
}
