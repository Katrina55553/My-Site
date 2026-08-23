<div align="center">

# Katrina · 个人作品集

**基于 React + Vite 构建的互动作品集网站 —— 项目展示、简历、UI 实验室、科幻终端，一站集成。**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Three.js](https://img.shields.io/badge/Three.js-r166-000000?logo=threedotjs&logoColor=white)](https://threejs.org)
[![Web Audio API](https://img.shields.io/badge/Web_Audio-API-FF6B35)](https://developer.mozilla.org/docs/Web/API/Web_Audio_API)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fcogod.cn&label=cogod.cn)](https://cogod.cn)

[在线预览](https://cogod.cn) · [GitHub 仓库](https://github.com/Katrina55553/My-Site)

</div>

---

## 功能亮点

| 模块 | 说明 |
|------|------|
| **Hero 首屏** | WebGL 粒子星系（Three.js），支持拖拽旋转，视口外自动暂停渲染 |
| **项目展示** | 3D 倾斜卡片 + 项目详情网格，炫酷悬停动效 |
| **简历模块** | 个人信息 / 技能栈 / 工作时间线 / 教育背景 |
| **UI 实验室** | Web Audio 合成播放器（3 首纯代码生成乐曲）+ 实时主题调色器 |
| **科幻终端** | 交互式命令行，支持 `help` / `neofetch` / `hack` 等彩蛋命令 |
| **联系方式** | 整屏收尾页，4 通道联系卡片 + 留言表单 |

## 技术栈

![React 18](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?logo=reactrouter&logoColor=white)
![Vite 5](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-r166-000000?logo=threedotjs&logoColor=white)
![Lucide Icons](https://img.shields.io/badge/Lucide-Icons-F56565?logo=lucide&logoColor=white)
![CSS Variables](https://img.shields.io/badge/CSS-Variables_主题系统-1572B6?logo=css3&logoColor=white)
![Google Fonts](https://img.shields.io/badge/Google_Fonts-Inter_·_Space_Grotesk-4285F4?logo=googlefonts&logoColor=white)

- **样式**：纯 CSS，CSS Variables 驱动主题系统、BEM 命名规范
- **音频**：Web Audio API 程序化合成器，无需任何音频文件

## 性能优化

Three.js (~460KB) 通过 `React.lazy` 懒加载，首屏体积大幅下降：

| 首屏 JS 体积 | 优化前 | 优化后 |
|--------------|:------:|:------:|
| gzip 后 | 175 KB | **50 KB** |
| 原始体积 | 641 KB | **152 KB** |

其他优化手段：

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

> 无需环境变量与额外配置，克隆即可运行。

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
│       ├── ParticleScene.jsx  # Three.js 粒子场景
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

> 所有展示内容（项目、简历、博客、联系方式）集中在 [src/data/content.js](src/data/content.js) 中，
> 直接修改对应数据即可定制站点，无需深入组件代码。

## 部署

### 云服务器

项目已部署至独立域名：**[https://cogod.cn](https://cogod.cn)**

| 项目 | 说明 |
|------|------|
| 技术方案 | Nginx + Let's Encrypt SSL |
| 自动化 | GitHub Actions 推送即自动部署 |
| 备案信息 | 浙ICP备2026045444号 |

### 本地构建

```bash
npm run build
```

构建产物在 `dist/` 目录，可直接部署到 GitHub Pages、Netlify、Vercel 等静态托管服务。

---

<div align="center">

Built with **React · Vite · Three.js · Web Audio API**

© 2026 Katrina · [cogod.cn](https://cogod.cn)

</div>
