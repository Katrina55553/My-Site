# Creative Space - 个人作品集 & UI 实验室

> 基于 React + Vite 构建的互动个人作品集网站，集项目展示、简历、UI 实验室、科幻终端于一身。

[在线预览](https://katrina55553.github.io/My-Site) · [GitHub 仓库](https://github.com/Katrina55553/My-Site)

---

## 功能亮点

| 模块 | 说明 |
|------|------|
| **Hero 首屏** | WebGL 粒子星系（Three.js），支持拖拽旋转，视口外自动暂停渲染 |
| **项目展示** | 3D 倾斜卡片 + 项目详情网格，炫酷悬停动效 |
| **简历模块** | 个人信息 / 技能栈 / 工作时间线 / 教育背景 |
| **UI 实验室** | Web Audio 合成播放器（3 首纯代码生成乐曲）+ 实时主题调色器 |
| **科幻终端** | 交互式命令行，支持 `help`/`neofetch`/`hack` 等彩蛋命令 |
| **联系方式** | 整屏收尾页，4 通道联系卡片 + 留言表单 |

## 技术栈

- **框架**：React 18 + Vite 5
- **样式**：纯 CSS（CSS Variables 主题系统、BEM 命名）
- **3D**：Three.js（粒子系统 + WebGL）
- **音频**：Web Audio API（程序化合成器，无需音频文件）
- **图标**：Lucide React
- **字体**：Google Fonts（Inter + Space Grotesk）

## 性能优化

- Three.js (~460KB) 通过 `React.lazy` 懒加载，首屏 JS 从 641KB 降至 152KB（gzip: 175KB → 50KB）
- WebGL 粒子场景滚出视口自动暂停 `requestAnimationFrame`
- 自定义光标使用固定 12 节点对象池，避免 DOM 创建/销毁开销
- `IntersectionObserver` 替代 scroll 事件做导航高亮
- 窗口 resize 使用 `requestAnimationFrame` 节流

## 快速开始

```bash
# 安装依赖
npm install

# 开发服务器（http://localhost:5173）
npm run dev

# 生产构建
npm run build

# 预览构建产物
npm run preview
```

## 项目结构

```
my-site/
├── index.html          # Vite 入口 HTML
├── vite.config.js      # Vite 配置
├── package.json
├── src/
│   ├── main.jsx        # React 入口
│   ├── App.jsx         # 根组件 + 主题状态 + Scroll Spy
│   ├── style.css       # 全局样式（含赛博朋克主题变量）
│   ├── data/
│   │   └── content.js  # 项目、简历、博客数据（修改这里定制内容）
│   ├── utils/
│   │   └── AmbientSynth.js  # Web Audio 合成器
│   └── components/
│       ├── Navbar.jsx         # 导航栏（滚动高亮）
│       ├── Hero.jsx           # 首屏
│       ├── ParticleScene.jsx   # Three.js 粒子场景
│       ├── Hub.jsx            # 项目展示
│       ├── TiltCard.jsx       # 3D 倾斜卡片包装器
│       ├── Resume.jsx         # 简历模块
│       ├── Lab.jsx            # UI 实验室（播放器 + 调色器）
│       ├── Terminal.jsx       # 科幻终端
│       ├── Contact.jsx        # 联系方式整屏页
│       ├── CustomCursor.jsx   # 霓虹光标
│       └── Footer.jsx         # 页脚
└── AGENTS.md           # AI 代理开发指南
```

## 定制内容

所有展示内容（项目、简历、博客、联系方式）集中在 [src/data/content.js](src/data/content.js) 中，直接修改对应数据即可，无需深入组件代码。

## 部署

```bash
npm run build
```

构建产物在 `dist/` 目录，可直接部署到 GitHub Pages、Netlify、Vercel 等静态托管服务。

---

Built with React, Vite, Three.js & Web Audio API · 2026
