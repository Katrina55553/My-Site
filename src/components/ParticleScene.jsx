import { useRef, useEffect } from 'react'
import * as THREE from 'three'

// 根据 hue 值生成霓虹色对
function getNeonColors(hue) {
  const color1 = new THREE.Color(`hsl(${hue}, 85%, 65%)`)
  const color2 = new THREE.Color(`hsl(${(hue + 40) % 360}, 90%, 60%)`)
  return { color1, color2 }
}

export default function ParticleScene({ hue }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const animationFrameRef = useRef(null)

  // 初始化 Three.js 场景（仅运行一次）
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    // 场景与相机
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
    camera.position.z = 5

    // 渲染器：粒子无需抗锯齿，关闭可显著降低 GPU 开销
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const { color1, color2 } = getNeonColors(hue)

    // ---- 粒子球体 (2000 粒子) ----
    const sphereGeometry = new THREE.BufferGeometry()
    const SPHERE_COUNT = 2000
    const spherePositions = new Float32Array(SPHERE_COUNT * 3)
    const sphereColors = new Float32Array(SPHERE_COUNT * 3)

    for (let i = 0; i < SPHERE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 1.5 + (Math.random() - 0.5) * 0.3

      spherePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      spherePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      spherePositions[i * 3 + 2] = radius * Math.cos(phi)

      const mixed = color1.clone().lerp(color2, Math.random())
      sphereColors[i * 3] = mixed.r
      sphereColors[i * 3 + 1] = mixed.g
      sphereColors[i * 3 + 2] = mixed.b
    }

    sphereGeometry.setAttribute('position', new THREE.BufferAttribute(spherePositions, 3))
    sphereGeometry.setAttribute('color', new THREE.BufferAttribute(sphereColors, 3))

    const sphereMaterial = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    })

    const sphere = new THREE.Points(sphereGeometry, sphereMaterial)
    scene.add(sphere)

    // ---- 星环 (500 粒子) ----
    const ringGeometry = new THREE.BufferGeometry()
    const RING_COUNT = 500
    const ringPositions = new Float32Array(RING_COUNT * 3)
    const ringColors = new Float32Array(RING_COUNT * 3)

    for (let i = 0; i < RING_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 2.5 + (Math.random() - 0.5) * 0.8

      ringPositions[i * 3] = Math.cos(angle) * radius
      ringPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.2
      ringPositions[i * 3 + 2] = Math.sin(angle) * radius

      const mixed = color2.clone().lerp(color1, Math.random())
      ringColors[i * 3] = mixed.r
      ringColors[i * 3 + 1] = mixed.g
      ringColors[i * 3 + 2] = mixed.b
    }

    ringGeometry.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3))
    ringGeometry.setAttribute('color', new THREE.BufferAttribute(ringColors, 3))

    const ringMaterial = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    })

    const ring = new THREE.Points(ringGeometry, ringMaterial)
    ring.rotation.x = Math.PI / 3
    scene.add(ring)

    // ---- 鼠标 / 触摸交互 ----
    let isDragging = false
    let prevMouse = { x: 0, y: 0 }
    let rotation = { x: 0, y: 0 }
    let autoRotate = true
    let autoRotateTimer = null

    const onPointerDown = (x, y) => {
      isDragging = true
      autoRotate = false
      clearTimeout(autoRotateTimer)
      prevMouse = { x, y }
    }

    const onPointerMove = (x, y) => {
      if (!isDragging) return
      rotation.y += (x - prevMouse.x) * 0.005
      rotation.x += (y - prevMouse.y) * 0.005
      prevMouse = { x, y }
    }

    const onPointerUp = () => {
      isDragging = false
      autoRotateTimer = setTimeout(() => { autoRotate = true }, 2000)
    }

    const handleMouseDown = (e) => onPointerDown(e.clientX, e.clientY)
    const handleMouseMove = (e) => onPointerMove(e.clientX, e.clientY)
    const handleMouseUp = onPointerUp

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) onPointerDown(e.touches[0].clientX, e.touches[0].clientY)
    }
    const handleTouchMove = (e) => {
      if (e.touches.length === 1) onPointerMove(e.touches[0].clientX, e.touches[0].clientY)
    }
    const handleTouchEnd = onPointerUp

    container.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: true })
    container.addEventListener('touchend', handleTouchEnd)

    // ---- 动画循环 ----
    // 视口外暂停渲染，避免不可见时浪费 GPU/CPU
    let isVisible = true
    const animate = () => {
      if (!isVisible) {
        animationFrameRef.current = null
        return
      }
      if (autoRotate) rotation.y += 0.002

      sphere.rotation.y = rotation.y
      sphere.rotation.x = rotation.x
      ring.rotation.y = rotation.y * 0.5

      renderer.render(scene, camera)
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    animate()

    // 视口可见性监听：滚出视口时停止 rAF，重新进入时恢复
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting
          if (isVisible && !animationFrameRef.current) {
            animationFrameRef.current = requestAnimationFrame(animate)
          }
        })
      },
      { threshold: 0 }
    )
    visibilityObserver.observe(container)

    // ---- 窗口大小变化（rAF 节流，避免拖拽 resize 时频繁重设） ----
    let resizeRaf = null
    const handleResize = () => {
      if (resizeRaf) return
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = null
        const w = container.clientWidth
        const h = container.clientHeight
        if (w === 0 || h === 0) return
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      })
    }
    window.addEventListener('resize', handleResize)

    // ---- 清理 ----
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      if (resizeRaf) cancelAnimationFrame(resizeRaf)
      clearTimeout(autoRotateTimer)
      visibilityObserver.disconnect()
      container.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('resize', handleResize)

      sphereGeometry.dispose()
      sphereMaterial.dispose()
      ringGeometry.dispose()
      ringMaterial.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 主题变化时更新粒子颜色
  // 复用临时 Color 对象，避免在 2500 次循环里反复 clone 产生 GC 压力
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    const { color1, color2 } = getNeonColors(hue)
    const tmpColor = new THREE.Color()

    // 更新球体粒子颜色
    const sphere = scene.children[0]
    if (sphere && sphere.geometry.attributes.color) {
      const colors = sphere.geometry.attributes.color.array
      const count = colors.length / 3
      for (let i = 0; i < count; i++) {
        tmpColor.copy(color1).lerp(color2, Math.random())
        colors[i * 3] = tmpColor.r
        colors[i * 3 + 1] = tmpColor.g
        colors[i * 3 + 2] = tmpColor.b
      }
      sphere.geometry.attributes.color.needsUpdate = true
    }

    // 更新星环粒子颜色
    const ring = scene.children[1]
    if (ring && ring.geometry.attributes.color) {
      const colors = ring.geometry.attributes.color.array
      const count = colors.length / 3
      for (let i = 0; i < count; i++) {
        tmpColor.copy(color2).lerp(color1, Math.random())
        colors[i * 3] = tmpColor.r
        colors[i * 3 + 1] = tmpColor.g
        colors[i * 3 + 2] = tmpColor.b
      }
      ring.geometry.attributes.color.needsUpdate = true
    }
  }, [hue])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
