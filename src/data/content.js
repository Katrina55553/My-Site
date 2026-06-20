// 项目展示数据
export const projects = [
  {
    name: '简历智诊 Agent',
    description: 'AI 驱动的简历诊断与模拟面试系统：上传简历 → AI 深度诊断 → 多轮模拟面试 → 量化评估报告，全流程由 LangGraph 状态机编排。',
    tags: ['React', 'FastAPI', 'LangGraph', 'PostgreSQL', 'Redis', 'Docker'],
    link: '#',
    icon: 'sparkles',
    highlights: ['LangGraph 状态机', 'RAG 三级混合检索', 'MCP Agent Skills', 'WebSocket 流式推送'],
  },
  {
    name: 'OJ 在线判题系统',
    description: '前后端分离的在线判题平台，支持多语言代码提交与判题、题库管理、提交记录与讨论区，自研 Docker 代码沙箱与异步判题架构。',
    tags: ['Vue3', 'Spring Boot', 'MySQL', 'Redis', 'RabbitMQ', 'Docker'],
    link: '#',
    icon: 'terminal',
    highlights: ['DooD 6 层沙箱隔离', 'RabbitMQ 异步判题', '策略模式判题', 'Redis+Lua 限流'],
  },
  {
    name: '修仙模拟器',
    description: '基于 React 19 + TypeScript 6 + Vite 8 + Tailwind CSS 4 构建的中文单机文字修仙 RPG。玩家从无名修士起步，通过抉择推进章节、修炼突破、结交道侣或堕入魔道，最终走向不同结局。纯函数式引擎驱动核心逻辑，持久化到 localStorage，支持多周目 Meta 成长。',
    tags: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS'],
    link: 'https://katrina55553.github.io/Cult-Game/',
    repo: 'https://github.com/Katrina55553/Cult-Game',
    icon: 'sparkles',
    highlights: ['章节化多路线叙事', '纯函数游戏引擎', '跨局 Meta 与成就系统', '自动化验证 toolchain'],
  },
  {
    name: 'Todo-App 双端待办',
    description: '一款双端 Todo 待办应用，同时提供 Web 界面（渐变毛玻璃 UI）与终端 TUI（键盘流操作），开发模式下通过本地 JSON 文件实现数据实时同步。',
    tags: ['Vue', 'Vite', 'Ink', 'Node.js'],
    link: 'https://katrina55553.github.io/Todo-App/',
    repo: 'https://github.com/Katrina55553/Todo-App',
    icon: 'layout-grid',
    highlights: ['一套数据双端体验', '可插拔存储层', '拖拽排序智能限制', '零外部 UI 依赖'],
  },
  {
    name: 'Inkwell 中文论坛',
    description: '为深度交流而生的中文论坛社区，采用 Vue 3 + FastAPI 全栈架构。前端以暖纸色与赤陶红为主色调，呈现杂志/编辑风格；后端支持 JWT 认证、嵌套评论、点赞、标签筛选、即时通知与私信。',
    tags: ['Vue 3', 'FastAPI', 'SQLAlchemy', 'JWT'],
    link: '#',
    repo: 'https://github.com/Katrina55553/Forum-project',
    icon: 'globe',
    highlights: ['杂志风 UI 设计系统', '嵌套评论与话题精华', 'JWT 鉴权 + 通知轮询', 'Markdown 富文本编辑预览'],
  },
  {
    name: '今天吃什么',
    description: '一款基于微信小程序的趣味餐饮决策工具。通过转盘随机抽选菜品，支持场景化筛选和个性化偏好设置，让用户告别"今天吃什么"的选择困难症。',
    tags: ['微信小程序', '原生框架', '本地存储', 'Canvas'],
    link: 'https://katrina55553.github.io/what-to-eat-/',
    repo: 'https://github.com/Katrina55553/what-to-eat-',
    icon: 'sparkles',
    highlights: ['原生小程序即开即用', '早晚夜宵多场景筛选', '不吃辣等偏好过滤', '转盘动画与中奖特效'],
  },
]

// 博客预览数据
export const blogPosts = [
  { tag: 'AI 工程', title: 'LangGraph 状态机编排面试流程的工程实践' },
  { tag: '后端架构', title: 'RabbitMQ 死信队列构建异步判题系统的设计' },
  { tag: '算法竞赛', title: 'ACM-ICPC 银奖选手的算法学习路线分享' },
]

// 简历数据
export const resume = {
  name: '刘俊威',
  title: 'AI 全栈开发工程师',
  summary: '具备 AI 全栈开发能力，熟练使用 Claude Code / Cursor 等 AI 编程工具高效交付产品。从需求分析、架构设计、前后端开发到部署运维均能独立完成，已上线 10+ 个可访问产品。持续跟进 AI 大模型与 Agent 生态发展，掌握 MCP Server 与 Agent Skills 开发。',
  skills: [
    { category: 'AI 全栈', items: ['Claude Code', 'Cursor', 'MCP Server', 'Agent Skills', 'LangGraph'] },
    { category: '后端框架', items: ['Spring Boot', 'FastAPI', 'RESTful API'] },
    { category: '前端框架', items: ['React', 'Vue3', 'UI 组件库'] },
    { category: '数据库', items: ['MySQL', 'PostgreSQL', 'Redis', 'MongoDB', '向量数据库'] },
    { category: '中间件', items: ['RabbitMQ', 'Nginx', 'Elasticsearch'] },
    { category: 'DevOps', items: ['Docker', 'GitHub Actions', 'Linux', 'Git'] },
  ],
  experience: [
    {
      role: '简历智诊 Agent',
      company: 'AI 全栈项目 · React + FastAPI + LangGraph',
      period: '个人项目',
      description: 'AI 驱动的简历诊断与模拟面试系统：上传简历 → AI 深度诊断 → 多轮模拟面试 → 量化评估报告。',
      achievements: [
        '使用 LangGraph 状态机编排面试流程，根据回答质量动态决策追问/切换/生成报告，三层防死循环机制',
        'RAG 三级混合检索（Embedding 向量 + Elasticsearch 全文 + 关键词匹配）与 Tool Calling 机制，自主调用知识库检索、简历字段查询、代码片段验证三个工具，根据上下文动态决定而非固定流程预加载',
        '利用 MCP 协议将系统封装为标准化 Agent Skills，定义 7 个工具接口，支持主流 AI 编程工具直接调用',
        '基于 WebSocket 实时面试对话，支持断线自动重连与 Redis 缓存，LLM 响应流式推送，断线期间消息不丢失',
      ],
    },
    {
      role: 'OJ 在线判题系统',
      company: '全栈项目 · Vue3 + Spring Boot + RabbitMQ',
      period: '个人项目',
      description: '前后端分离架构的在线判题平台，支持多语言代码提交与判题、题库管理、提交记录、讨论区等功能。',
      achievements: [
        '自研 Docker 代码沙箱架构（DooD），实现 6 层安全隔离（内存/CPU/网络/PID/文件系统/用户）',
        '利用 RabbitMQ 手动确认 + 死信队列构建异步判题系统，响应时间快 100 倍，吞吐量提升 10 倍',
        '判题模块使用策略模式封装不同语言的判题逻辑，替代 if-else 分支，遵循开闭原则，易于系统扩展和维护',
        '基于 Redis + Lua 脚本实现滑动窗口限流，结合 AOP + 自定义注解无侵入式接入，有效拦截恶意刷接口行为',
        '基于 JWT 实现无状态登录，用 Redis 维护 Token 黑名单，支持 user/admin/ban 三级角色',
      ],
    },
  ],
  education: [
    {
      degree: '本科',
      school: '',
      period: '2024.09 — 2028.07',
      description: '活跃于算法竞赛领域，获 ACM-ICPC 银奖、蓝桥杯全国一等奖等荣誉。',
    },
  ],
  awards: [
    { name: '第 51 届 ACM-ICPC 国际大学生程序设计竞赛银奖', period: '2025' },
    { name: '2026 ACM-CCPC 中国大学生程序设计竞赛银奖', period: '2026' },
    { name: '第十七届蓝桥杯程序设计竞赛全国一等奖', period: '2026' },
    { name: 'CET-6 大学英语六级', period: '' },
  ],
}

// 终端命令数据
export const terminalCommands = {
  about: {
    title: '【刘俊威 // AI 全栈开发工程师】',
    lines: [
      'AI 全栈开发工程师，专注全栈开发与 Agent 生态。',
      '技术栈：Spring Boot / FastAPI / React / Vue3 / LangGraph / Docker / Redis',
      '已上线 10+ 个可访问产品，熟练使用 Claude Code / Cursor 等 AI 编程工具高效交付。',
    ],
  },
  projects: {
    header: '核心项目列表：',
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
