// 项目展示数据
export const projects = [
  {
    name: 'Gravity-UI-Lab',
    description: '炫酷的拟物与毛玻璃组件样式库，包含 30+ 可复用的 CSS 组件，支持主题定制与暗色模式。',
    tags: ['CSS', 'JavaScript', '组件库'],
    link: '#',
    icon: 'layout-grid',
    highlights: ['30+ 组件', '主题定制', '暗色模式'],
  },
  {
    name: 'React-Three-Universe',
    description: '基于 Three.js 的 3D 银河系交互模型，支持鼠标拖拽旋转、缩放探索，包含 5000+ 粒子星系。',
    tags: ['React', 'Three.js', 'WebGL'],
    link: '#',
    icon: 'globe',
    highlights: ['5000+ 粒子', '拖拽交互', '视差效果'],
  },
  {
    name: 'CyberShell-Terminal',
    description: '轻量级网页仿真终端组件，支持自定义命令注册、命令历史、自动补全，TypeScript 编写。',
    tags: ['TypeScript', '终端', '组件'],
    link: '#',
    icon: 'terminal',
    highlights: ['命令注册', '历史记录', 'TS 支持'],
  },
  {
    name: 'Neon-Canvas-Fireworks',
    description: '基于 Canvas 的烟花动效库，支持物理引擎模拟、粒子拖尾、多色混合，性能优化至 60fps。',
    tags: ['Canvas', '动画', '性能优化'],
    link: '#',
    icon: 'sparkles',
    highlights: ['60fps', '物理引擎', '粒子系统'],
  },
]

// 博客预览数据
export const blogPosts = [
  { tag: '前端技术', title: '深入理解 CSS Backdrop-filter 毛玻璃特效' },
  { tag: '动效设计', title: 'Web 3D 卡片悬停倾斜（Tilt）的交互实现' },
  { tag: '创意编程', title: '基于 Canvas 粒子系统的烟花网页动效' },
]

// 简历数据
export const resume = {
  name: 'Katrina',
  title: '前端开发工程师 / 创意交互设计师',
  summary: '深耕前端开发与创意交互的工程师，坚信卓越的 UI/UX 是代码的灵魂。在零与一的虚拟星空，构建具备引力效应的设计。',
  skills: [
    { category: '前端框架', items: ['React', 'Vue3', 'Next.js'] },
    { category: '样式与动效', items: ['CSS3', 'Sass', 'Tailwind', 'Framer Motion'] },
    { category: '3D 与可视化', items: ['Three.js', 'WebGL', 'Canvas', 'D3.js'] },
    { category: '工程化', items: ['Vite', 'Webpack', 'TypeScript', 'Git'] },
    { category: '后端', items: ['Node.js', 'Express', 'MongoDB'] },
  ],
  experience: [
    {
      role: '高级前端工程师',
      company: 'Tech Creative Studio',
      period: '2024 — 至今',
      description: '负责创意网页开发与 3D 交互体验设计，主导多个品牌官网与互动营销项目。',
      achievements: ['搭建团队前端组件库，提升开发效率 40%', '主导 3D 产品展示页开发，转化率提升 25%'],
    },
    {
      role: '前端开发工程师',
      company: 'Digital Innovation Lab',
      period: '2022 — 2024',
      description: '专注于 WebGL 可视化与数据交互大屏开发，交付 10+ 企业级数据看板。',
      achievements: ['优化大屏渲染性能，帧率提升至 60fps', '封装可复用图表组件库，覆盖 20+ 场景'],
    },
    {
      role: '前端实习生',
      company: 'StartUp Hub',
      period: '2021 — 2022',
      description: '参与 SaaS 产品前端开发，负责表单引擎与权限模块。',
      achievements: ['实现动态表单渲染引擎', '完成权限系统前端架构'],
    },
  ],
  education: [
    {
      degree: '计算机科学与技术 · 学士',
      school: '某科技大学',
      period: '2018 — 2022',
      description: '主修 Web 开发、计算机图形学、人机交互。GPA 3.8/4.0，获校级奖学金。',
    },
  ],
}

// 终端命令数据
export const terminalCommands = {
  about: {
    title: '【Katrina // 跨界数字创作者】',
    lines: [
      '我是一名深耕前端开发与创意交互的工程师。我坚信卓越的 UI/UX 是代码的灵魂。',
      '技术栈：HTML5 / CSS3 / ES6+ / React / Vue3 / WebGL / Node.js',
      '格言：在零与一的虚拟星空，构建具备引力效应的设计。',
    ],
  },
  projects: {
    header: '开源精选项目列表：',
    items: projects.map(p => ({
      name: p.name,
      desc: p.description,
      tags: p.tags.join(' / '),
    })),
  },
  blog: {
    header: '最新文章推荐：',
    items: blogPosts.map(b => ({ tag: b.tag, title: b.title })),
  },
}
