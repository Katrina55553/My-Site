import { useRef, useEffect, useState, Suspense } from 'react'
import * as THREE from 'three'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { projects, resume } from '../data/content'

function neonColor(hue, offset = 0, lightness = 65) {
  return new THREE.Color(`hsl(${(hue + offset) % 360}, 85%, ${lightness}%)`)
}

function makeTextTexture(text, options = {}) {
  const { fontSize = 64, color = '#ffffff', fontWeight = 'bold', maxWidth = 512 } = options
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = maxWidth
  canvas.height = fontSize * 2
  ctx.font = `${fontWeight} ${fontSize}px 'Space Grotesk', 'Inter', sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = color
  ctx.shadowBlur = 20
  ctx.fillStyle = color
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)
  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  return texture
}

function makeCardTexture(project, hue) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const W = 512, H = 320
  canvas.width = W
  canvas.height = H
  const grad = ctx.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0, 'rgba(15, 20, 35, 0.95)')
  grad.addColorStop(1, 'rgba(10, 15, 25, 0.95)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = `hsl(${hue}, 85%, 65%)`
  ctx.lineWidth = 4
  ctx.shadowColor = `hsl(${hue}, 85%, 65%)`
  ctx.shadowBlur = 25
  ctx.strokeRect(6, 6, W - 12, H - 12)
  ctx.shadowBlur = 12
  ctx.fillStyle = '#f8fafc'
  ctx.font = `bold 28px 'Space Grotesk', sans-serif`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText(project.name, 24, 24)
  ctx.shadowBlur = 4
  ctx.font = `15px 'Inter', sans-serif`
  ctx.fillStyle = `hsl(${(hue + 40) % 360}, 90%, 70%)`
  ctx.fillText(project.tags.slice(0, 3).join(' · '), 24, 64)
  ctx.shadowBlur = 0
  ctx.fillStyle = '#94a3b8'
  ctx.font = `14px 'Inter', sans-serif`
  const desc = project.description.length > 100 ? project.description.slice(0, 100) + '...' : project.description
  const lines = []
  let cur = ''
  for (const ch of desc) {
    if (ctx.measureText(cur + ch).width > W - 48 && cur) { lines.push(cur); cur = ch }
    else cur += ch
  }
  if (cur) lines.push(cur)
  lines.slice(0, 6).forEach((line, i) => ctx.fillText(line, 24, 96 + i * 20))
  ctx.fillStyle = `hsla(${hue}, 85%, 65%, 0.6)`
  ctx.font = `13px 'Inter', sans-serif`
  ctx.fillText('点击访问 →', 24, H - 30)
  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  return texture
}

const ZONES = {
  center:   { x: 0,   z: 0,   label: 'KATRINA', subtitle: resume.title },
  projects: { x: 0,   z: -28, label: '项目展示', subtitle: `${projects.length} 个项目` },
  contact:  { x: 28,  z: 0,   label: '联系方式', subtitle: 'GitHub · Email · Phone' },
  awards:   { x: 0,   z: 28,  label: '荣誉奖项', subtitle: `${resume.awards.length} 项荣誉` },
  skills:   { x: -28, z: 0,   label: '技能栈', subtitle: `${resume.skills.length} 类技能` },
}

function Showcase3DScene({ hue }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const animationRef = useRef(null)
  const ballRef = useRef(null)
  const keysRef = useRef({})
  const velocityRef = useRef({ x: 0, z: 0 })
  const currentZoneRef = useRef('center')
  const [currentZone, setCurrentZone] = useState('center')
  const [hoveredItem, setHoveredItem] = useState(null)
  const [activeKeys, setActiveKeys] = useState({})

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x070913, 20, 60)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 200)
    camera.position.set(0, 8, 12)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0x404060, 1.2))
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6)
    dirLight.position.set(10, 20, 10)
    scene.add(dirLight)
    const ballLight = new THREE.PointLight(neonColor(hue), 3, 15)
    scene.add(ballLight)

    // ---- 地面网格 ----
    const gridSize = 80
    const grid = new THREE.GridHelper(gridSize, 40, neonColor(hue), 0x1a1a2e)
    grid.position.y = -0.5
    grid.material.transparent = true
    grid.material.opacity = 0.15
    scene.add(grid)

    // 地面平面
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(gridSize, gridSize),
      new THREE.MeshBasicMaterial({ color: 0x0a0d18, transparent: true, opacity: 0.6 })
    )
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -0.51
    scene.add(floor)

    // 中心地面光晕 — 多层脉冲环
    const pulseRings = []
    for (let i = 0; i < 3; i++) {
      const ringMesh = new THREE.Mesh(
        new THREE.RingGeometry(3 + i * 4, 3.2 + i * 4, 64),
        new THREE.MeshBasicMaterial({
          color: neonColor(hue, i * 20), transparent: true, opacity: 0.3,
          side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
        })
      )
      ringMesh.rotation.x = -Math.PI / 2
      ringMesh.position.y = -0.48
      ringMesh.userData = { phase: i * 1.2 }
      scene.add(ringMesh)
      pulseRings.push(ringMesh)
    }

    // 各板块地面标记圈
    Object.entries(ZONES).forEach(([key, zone]) => {
      if (key === 'center') return
      const marker = new THREE.Mesh(
        new THREE.RingGeometry(4, 4.3, 64),
        new THREE.MeshBasicMaterial({
          color: neonColor(hue, 40), transparent: true, opacity: 0.2,
          side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
        })
      )
      marker.rotation.x = -Math.PI / 2
      marker.position.set(zone.x, -0.48, zone.z)
      scene.add(marker)
    })

    const wallMat = new THREE.MeshBasicMaterial({ color: neonColor(hue), transparent: true, opacity: 0.08, side: THREE.DoubleSide })
    const wallH = 3, wallD = 35
    ;[
      { x: 0, z: -wallD, w: wallD * 2, d: 0.2 },
      { x: 0, z: wallD, w: wallD * 2, d: 0.2 },
      { x: -wallD, z: 0, w: 0.2, d: wallD * 2 },
      { x: wallD, z: 0, w: 0.2, d: wallD * 2 },
    ].forEach(w => {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(w.w, wallH, w.d), wallMat)
      wall.position.set(w.x, wallH / 2 - 0.5, w.z)
      scene.add(wall)
    })

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2, 1),
      new THREE.MeshBasicMaterial({ color: neonColor(hue), wireframe: true, transparent: true, opacity: 0.4 })
    )
    core.position.set(ZONES.center.x, 2, ZONES.center.z)
    scene.add(core)

    const nameSprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeTextTexture('KATRINA', { fontSize: 80, color: `hsl(${hue}, 85%, 70%)` }),
      transparent: true, opacity: 0.9,
    }))
    nameSprite.scale.set(8, 3, 1)
    nameSprite.position.set(ZONES.center.x, 5.5, ZONES.center.z)
    scene.add(nameSprite)

    const titleSprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeTextTexture(resume.title, { fontSize: 32, color: `hsl(${(hue + 40) % 360}, 90%, 70%)` }),
      transparent: true, opacity: 0.7,
    }))
    titleSprite.scale.set(6, 1.2, 1)
    titleSprite.position.set(ZONES.center.x, 3.8, ZONES.center.z)
    scene.add(titleSprite)

    Object.entries(ZONES).forEach(([key, zone]) => {
      if (key === 'center') return
      const titleSp = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeTextTexture(zone.label, { fontSize: 56, color: `hsl(${hue}, 85%, 65%)` }),
        transparent: true, opacity: 0.8,
      }))
      titleSp.scale.set(7, 2, 1)
      titleSp.position.set(zone.x, 6, zone.z)
      scene.add(titleSp)

      const subSp = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeTextTexture(zone.subtitle, { fontSize: 24, color: '#94a3b8' }),
        transparent: true, opacity: 0.5,
      }))
      subSp.scale.set(5, 0.8, 1)
      subSp.position.set(zone.x, 4.5, zone.z)
      scene.add(subSp)
    })

    const cardMeshes = []
    const projCount = Math.min(projects.length, 7)
    for (let i = 0; i < projCount; i++) {
      const project = projects[i]
      const offsetX = (i - (projCount - 1) / 2) * 5
      const tex = makeCardTexture(project, hue)
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(3.2, 2),
        new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide })
      )
      mesh.position.set(ZONES.projects.x + offsetX, 2, ZONES.projects.z + 3)
      mesh.lookAt(ZONES.projects.x, 2, ZONES.projects.z - 5)
      mesh.userData = {
        project, baseY: 2, floatOffset: i * 0.7,
        link: project.link !== '#' ? project.link : (project.repo || '#'),
      }
      scene.add(mesh)
      cardMeshes.push(mesh)
    }

    const linkMeshes = []
    const socials = [
      { label: 'GitHub', url: 'https://github.com/Katrina55553', color: '#ffffff' },
      { label: 'Email', url: 'mailto:ambition55553@gmail.com', color: '#ff6600' },
      { label: 'Phone', url: 'tel:13817153416', color: '#00ff88' },
    ]
    socials.forEach((social, i) => {
      const offsetX = (i - 1) * 5
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(social.color), transparent: true, opacity: 0.3 })
      )
      box.position.set(ZONES.contact.x + offsetX, 1.5, ZONES.contact.z)
      scene.add(box)

      const wire = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(social.color), wireframe: true })
      )
      wire.position.copy(box.position)
      scene.add(wire)

      const sp = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeTextTexture(social.label, { fontSize: 40, color: social.color, maxWidth: 256 }),
        transparent: true,
      }))
      sp.scale.set(3, 1, 1)
      sp.position.set(ZONES.contact.x + offsetX, 3.5, ZONES.contact.z)
      sp.userData = { social, baseY: 3.5, floatOffset: i * 0.5 }
      scene.add(sp)
      linkMeshes.push(sp)
    })

    resume.awards.forEach((award, i) => {
      const offsetX = (i - (resume.awards.length - 1) / 2) * 6
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeTextTexture(award.name, { fontSize: 22, color: `hsl(${(hue + 60) % 360}, 80%, 60%)`, maxWidth: 400 }),
        transparent: true, opacity: 0.7,
      }))
      sp.scale.set(4, 0.8, 1)
      sp.position.set(ZONES.awards.x + offsetX, 2.5, ZONES.awards.z)
      scene.add(sp)

      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 2.5),
        new THREE.MeshBasicMaterial({ color: neonColor(hue, 60, 40), transparent: true, opacity: 0.3 })
      )
      pole.position.set(ZONES.awards.x + offsetX, 1, ZONES.awards.z)
      scene.add(pole)
    })

    resume.skills.forEach((skillGroup, gi) => {
      const offsetX = (gi - (resume.skills.length - 1) / 2) * 4
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeTextTexture(skillGroup.category, { fontSize: 28, color: `hsl(${(hue + 20) % 360}, 85%, 60%)`, maxWidth: 256 }),
        transparent: true, opacity: 0.7,
      }))
      sp.scale.set(3, 0.8, 1)
      sp.position.set(ZONES.skills.x + offsetX, 3.5 - gi * 0.3, ZONES.skills.z)
      scene.add(sp)

      skillGroup.items.slice(0, 4).forEach((item, ii) => {
        const itemSp = new THREE.Sprite(new THREE.SpriteMaterial({
          map: makeTextTexture(item, { fontSize: 18, color: '#94a3b8', maxWidth: 200 }),
          transparent: true, opacity: 0.5,
        }))
        itemSp.scale.set(2, 0.5, 1)
        itemSp.position.set(ZONES.skills.x + offsetX, 2.5 - ii * 0.6 - gi * 0.3, ZONES.skills.z)
        scene.add(itemSp)
      })
    })

    const ballRadius = 0.8
    // 主体球组
    const ball = new THREE.Group()
    ball.position.set(0, ballRadius, 8)
    scene.add(ball)
    ballRef.current = ball

    // 1. 内核 — 实心发光球
    const coreBall = new THREE.Mesh(
      new THREE.SphereGeometry(ballRadius * 0.55, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    )
    ball.add(coreBall)

    // 2. 主体 — 半透明能量层
    const mainBall = new THREE.Mesh(
      new THREE.SphereGeometry(ballRadius, 48, 48),
      new THREE.MeshBasicMaterial({
        color: neonColor(hue), transparent: true, opacity: 0.35,
        blending: THREE.AdditiveBlending,
      })
    )
    ball.add(mainBall)

    // 3. 旋转线框层 — 二十面体
    const wireLayer = new THREE.Mesh(
      new THREE.IcosahedronGeometry(ballRadius * 1.05, 1),
      new THREE.MeshBasicMaterial({ color: neonColor(hue, 30, 70), wireframe: true, transparent: true, opacity: 0.5 })
    )
    ball.add(wireLayer)

    // 4. 外层光晕
    const glowBall = new THREE.Mesh(
      new THREE.SphereGeometry(ballRadius * 1.5, 32, 32),
      new THREE.MeshBasicMaterial({
        color: neonColor(hue), transparent: true, opacity: 0.08,
        blending: THREE.AdditiveBlending, side: THREE.BackSide,
      })
    )
    ball.add(glowBall)

    // 5. 赤道光环
    const ringGeo = new THREE.TorusGeometry(ballRadius * 1.3, 0.04, 8, 64)
    const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: neonColor(hue, 20, 75), transparent: true, opacity: 0.6 }))
    ring.rotation.x = Math.PI / 2
    ball.add(ring)

    // 第二条倾斜光环
    const ring2 = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: neonColor(hue, 60, 70), transparent: true, opacity: 0.4 }))
    ring2.rotation.x = Math.PI / 3
    ring2.rotation.z = Math.PI / 4
    ball.add(ring2)

    const TRAIL_COUNT = 50
    const trailPositions = new Float32Array(TRAIL_COUNT * 3)
    const trailColors = new Float32Array(TRAIL_COUNT * 3)
    for (let i = 0; i < TRAIL_COUNT; i++) {
      trailPositions[i * 3] = ball.position.x
      trailPositions[i * 3 + 1] = ball.position.y
      trailPositions[i * 3 + 2] = ball.position.z
      const c = neonColor(hue).lerp(neonColor(hue, 40), Math.random())
      trailColors[i * 3] = c.r
      trailColors[i * 3 + 1] = c.g
      trailColors[i * 3 + 2] = c.b
    }
    const trailGeo = new THREE.BufferGeometry()
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3))
    trailGeo.setAttribute('color', new THREE.BufferAttribute(trailColors, 3))
    const trailMat = new THREE.PointsMaterial({ size: 0.2, vertexColors: true, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending })
    const trail = new THREE.Points(trailGeo, trailMat)
    scene.add(trail)
    let trailIndex = 0

    // ---- 背景粒子（闪烁星尘） ----
    const bgCount = 1200
    const bgPos = new Float32Array(bgCount * 3)
    const bgCol = new Float32Array(bgCount * 3)
    const bgPhase = new Float32Array(bgCount)
    const c1 = neonColor(hue)
    const c2 = neonColor(hue, 60, 60)
    const c3 = new THREE.Color(0xffffff)
    for (let i = 0; i < bgCount; i++) {
      const r = 20 + Math.random() * 35
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      bgPos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      bgPos[i * 3 + 1] = r * Math.abs(Math.sin(phi) * Math.sin(theta))
      bgPos[i * 3 + 2] = r * Math.cos(phi)
      // 30% 白色亮星 + 70% 霓虹色
      const mixed = Math.random() < 0.3 ? c3.clone() : c1.clone().lerp(c2, Math.random())
      bgCol[i * 3] = mixed.r
      bgCol[i * 3 + 1] = mixed.g
      bgCol[i * 3 + 2] = mixed.b
      bgPhase[i] = Math.random() * Math.PI * 2
    }
    const bgGeo = new THREE.BufferGeometry()
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3))
    bgGeo.setAttribute('color', new THREE.BufferAttribute(bgCol, 3))
    const bgMat = new THREE.PointsMaterial({ size: 0.1, vertexColors: true, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending })
    const bgParticles = new THREE.Points(bgGeo, bgMat)
    scene.add(bgParticles)

    // ---- 星穹顶（高处密集星点） ----
    const starCount = 600
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      const r = 30 + Math.random() * 20
      const theta = Math.random() * Math.PI * 2
      starPos[i * 3] = r * Math.cos(theta)
      starPos[i * 3 + 1] = 15 + Math.random() * 25
      starPos[i * 3 + 2] = r * Math.sin(theta)
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.12, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending })
    const starDome = new THREE.Points(starGeo, starMat)
    scene.add(starDome)

    // ---- 星云雾团（大型半透明球） ----
    const nebulae = []
    for (let i = 0; i < 5; i++) {
      const nebMat = new THREE.MeshBasicMaterial({
        color: neonColor(hue, i * 50, 50), transparent: true, opacity: 0.03,
        blending: THREE.AdditiveBlending, side: THREE.BackSide,
      })
      const neb = new THREE.Mesh(new THREE.SphereGeometry(8 + Math.random() * 6, 16, 16), nebMat)
      const angle = (i / 5) * Math.PI * 2
      neb.position.set(Math.cos(angle) * 25, 8 + Math.random() * 8, Math.sin(angle) * 25)
      neb.userData = { floatOffset: i * 1.5, baseY: neb.position.y }
      scene.add(neb)
      nebulae.push(neb)
    }

    const keys = keysRef.current
    const onKeyDown = (e) => {
      const key = e.key.toLowerCase()
      keys[key] = true
      if (key === 'arrowup') keys['w'] = true
      if (key === 'arrowdown') keys['s'] = true
      if (key === 'arrowleft') keys['a'] = true
      if (key === 'arrowright') keys['d'] = true
      setActiveKeys({ ...keys })
    }
    const onKeyUp = (e) => {
      const key = e.key.toLowerCase()
      keys[key] = false
      if (key === 'arrowup') keys['w'] = false
      if (key === 'arrowdown') keys['s'] = false
      if (key === 'arrowleft') keys['a'] = false
      if (key === 'arrowright') keys['d'] = false
      setActiveKeys({ ...keys })
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    const raycaster = new THREE.Raycaster()
    const mouseVec = new THREE.Vector2()
    const onClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouseVec, camera)
      const intersects = raycaster.intersectObjects([...cardMeshes, ...linkMeshes])
      if (intersects.length > 0) {
        const data = intersects[0].object.userData
        if (data.link) window.open(data.link, '_blank', 'noopener,noreferrer')
        else if (data.social) window.open(data.social.url, '_blank', 'noopener,noreferrer')
      }
    }
    const onMouseMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouseVec, camera)
      const intersects = raycaster.intersectObjects([...cardMeshes, ...linkMeshes])
      if (intersects.length > 0) {
        setHoveredItem(intersects[0].object.userData)
        renderer.domElement.style.cursor = 'pointer'
      } else {
        setHoveredItem(null)
        renderer.domElement.style.cursor = 'default'
      }
    }
    container.addEventListener('click', onClick)
    container.addEventListener('mousemove', onMouseMove)

    const clock = new THREE.Clock()
    let isVisible = true
    const velocity = velocityRef.current
    const MAX_SPEED = 0.25, ACCEL = 0.015, FRICTION = 0.88, BOUND = 33

    function detectZone(x, z) {
      let nearest = 'center', minDist = Infinity
      for (const [key, zone] of Object.entries(ZONES)) {
        const dx = x - zone.x, dz = z - zone.z
        const dist = Math.sqrt(dx * dx + dz * dz)
        if (dist < minDist) { minDist = dist; nearest = key }
      }
      return { zone: nearest, distance: minDist }
    }

    const animate = () => {
      if (!isVisible) { animationRef.current = null; return }
      const t = clock.getElapsedTime()

      let moveX = 0, moveZ = 0
      if (keys['w']) moveZ -= 1
      if (keys['s']) moveZ += 1
      if (keys['a']) moveX -= 1
      if (keys['d']) moveX += 1
      if (moveX !== 0 && moveZ !== 0) { moveX *= 0.707; moveZ *= 0.707 }

      velocity.x += moveX * ACCEL
      velocity.z += moveZ * ACCEL
      const speed = Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z)
      if (speed > MAX_SPEED) {
        velocity.x = (velocity.x / speed) * MAX_SPEED
        velocity.z = (velocity.z / speed) * MAX_SPEED
      }
      if (moveX === 0) velocity.x *= FRICTION
      if (moveZ === 0) velocity.z *= FRICTION

      ball.position.x += velocity.x
      ball.position.z += velocity.z
      ball.position.x = Math.max(-BOUND, Math.min(BOUND, ball.position.x))
      ball.position.z = Math.max(-BOUND, Math.min(BOUND, ball.position.z))
      ball.rotation.z -= velocity.x * 0.5
      ball.rotation.x += velocity.z * 0.5
      ball.position.y = ballRadius + Math.abs(Math.sin(t * 3)) * 0.1

      // 球体内部动画
      const speed2 = Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z)
      coreBall.scale.setScalar(1 + Math.sin(t * 4) * 0.08 + speed2 * 0.5)
      wireLayer.rotation.y = t * 0.8
      wireLayer.rotation.x = t * 0.5
      ring.rotation.z = t * 0.6
      ring2.rotation.y = t * 0.9
      glowBall.scale.setScalar(1 + Math.sin(t * 2) * 0.05)

      ballLight.position.copy(ball.position)
      ballLight.position.y += 2

      trailPositions[trailIndex * 3] = ball.position.x
      trailPositions[trailIndex * 3 + 1] = ball.position.y
      trailPositions[trailIndex * 3 + 2] = ball.position.z
      trailIndex = (trailIndex + 1) % TRAIL_COUNT
      trailGeo.attributes.position.needsUpdate = true

      const { zone: detectedZone } = detectZone(ball.position.x, ball.position.z)
      if (detectedZone !== currentZoneRef.current) {
        currentZoneRef.current = detectedZone
        setCurrentZone(detectedZone)
      }

      const camTargetX = ball.position.x
      const camTargetZ = ball.position.z + 10
      const camTargetY = 7
      camera.position.x += (camTargetX - camera.position.x) * 0.08
      camera.position.y += (camTargetY - camera.position.y) * 0.08
      camera.position.z += (camTargetZ - camera.position.z) * 0.08
      camera.lookAt(ball.position.x, 1, ball.position.z)

      core.rotation.y = t * 0.2
      core.rotation.x = t * 0.1
      core.scale.setScalar(1 + Math.sin(t * 1.5) * 0.05)

      cardMeshes.forEach(mesh => {
        mesh.position.y = mesh.userData.baseY + Math.sin(t + mesh.userData.floatOffset) * 0.2
      })
      linkMeshes.forEach(sp => {
        sp.position.y = sp.userData.baseY + Math.sin(t + sp.userData.floatOffset) * 0.15
      })
      bgParticles.rotation.y = t * 0.01

      // 脉冲环
      pulseRings.forEach(r => {
        const p = (t + r.userData.phase) * 0.5
        r.material.opacity = 0.15 + Math.abs(Math.sin(p)) * 0.25
        r.scale.setScalar(1 + Math.sin(p) * 0.05)
      })

      // 星云浮动
      nebulae.forEach(neb => {
        neb.position.y = neb.userData.baseY + Math.sin(t * 0.3 + neb.userData.floatOffset) * 2
        neb.rotation.y = t * 0.02
      })

      // 星穹缓慢旋转
      starDome.rotation.y = t * 0.005

      // 背景粒子闪烁
      bgMat.opacity = 0.4 + Math.sin(t * 1.5) * 0.2

      renderer.render(scene, camera)
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()

    const visObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting
          if (isVisible && !animationRef.current) animationRef.current = requestAnimationFrame(animate)
        })
      },
      { threshold: 0 }
    )
    visObserver.observe(container)

    let resizeRaf = null
    const handleResize = () => {
      if (resizeRaf) return
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = null
        const w = container.clientWidth, h = container.clientHeight
        if (w === 0 || h === 0) return
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      })
    }
    window.addEventListener('resize', handleResize)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (resizeRaf) cancelAnimationFrame(resizeRaf)
      visObserver.disconnect()
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      container.removeEventListener('click', onClick)
      container.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', handleResize)
      scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (obj.material.map) obj.material.map.dispose()
          obj.material.dispose()
        }
      })
      renderer.dispose()
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const zoneInfo = {
    center:   { label: '中心 · KATRINA', desc: resume.summary.slice(0, 80) + '...' },
    projects: { label: '项目展示区', desc: `共 ${projects.length} 个项目，点击卡片访问链接` },
    contact:  { label: '联系方式', desc: 'GitHub · Email · Phone' },
    awards:   { label: '荣誉奖项', desc: `${resume.awards.length} 项竞赛荣誉` },
    skills:   { label: '技能栈', desc: `${resume.skills.length} 大类技术栈` },
  }

  return (
    <div className="showcase-3d-wrapper">
      <div ref={containerRef} className="showcase-3d-canvas" />

      <div className="showcase-overlay-top">
        <Link to="/" className="showcase-back-btn">
          <ArrowLeft size={18} />
          <span>返回主页</span>
        </Link>
      </div>

      <div className="showcase-zone-info">
        <div className="zone-badge">{zoneInfo[currentZone].label}</div>
        <p className="zone-desc">{zoneInfo[currentZone].desc}</p>
      </div>

      <div className="showcase-keyboard-hint">
        <div className="key-row">
          <kbd className={activeKeys['w'] ? 'active' : ''}>W</kbd>
        </div>
        <div className="key-row">
          <kbd className={activeKeys['a'] ? 'active' : ''}>A</kbd>
          <kbd className={activeKeys['s'] ? 'active' : ''}>S</kbd>
          <kbd className={activeKeys['d'] ? 'active' : ''}>D</kbd>
        </div>
        <span className="key-label">移动球体探索各板块</span>
      </div>

      <div className="showcase-overlay-bottom">
        <span className="showcase-hint">WASD / 方向键移动 · 点击卡片或图标访问链接</span>
      </div>

      {hoveredItem && (
        <div className="showcase-tooltip">
          {hoveredItem.project?.name || hoveredItem.social?.label || ''}
        </div>
      )}
    </div>
  )
}

export default function Showcase3D() {
  return (
    <div className="showcase-page">
      <Suspense
        fallback={
          <div className="showcase-loading">
            <span>Loading 3D Experience…</span>
          </div>
        }
      >
        <Showcase3DScene hue={70} />
      </Suspense>
    </div>
  )
}
