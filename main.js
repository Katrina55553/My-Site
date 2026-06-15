document.addEventListener('DOMContentLoaded', () => {
    // 初始化 Lucide 图标
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    initNavigation();
    init3DTilt();
    initThemeController();
    initMusicPlayer();
    initTerminal();
    initCustomCursor();
    init3DScene();
});

/* ==========================================================================
   0. 导航状态切换与滚动监听 (Navigation & Scroll Spy)
   ========================================================================== */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // 1. 点击导航平滑切换（双重保障）
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // 2. 使用 IntersectionObserver 实现精准滚动监听 (Scroll Spy)
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // 当区域占屏幕中上方时激活
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   1. 3D 倾斜卡片效果 (3D Tilt Card Effect)
   ========================================================================== */
function init3DTilt() {
    const cards = document.querySelectorAll('.tilt-card');
    
    cards.forEach(card => {
        const glow = card.querySelector('.card-glow');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // 鼠标相对卡片的 X 坐标
            const y = e.clientY - rect.top;  // 鼠标相对卡片的 Y 坐标
            
            // 计算鼠标位置占卡片宽高的百分比 (归一化为 -0.5 到 0.5)
            const xPercent = (x / rect.width) - 0.5;
            const yPercent = (y / rect.height) - 0.5;
            
            // 计算旋转角度 (最大 15 度)
            const rotateX = yPercent * -12; 
            const rotateY = xPercent * 12;
            
            // 3D 旋转与微缩放
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            
            // 流光跟随效果
            if (glow) {
                glow.style.opacity = '1';
                glow.style.left = `${x - 150}px`; // 减去流光圆盘半径 (150px) 居中
                glow.style.top = `${y - 150}px`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            if (glow) {
                glow.style.opacity = '0';
            }
        });
    });
}

/* ==========================================================================
   2. 主题调色板控制 (Theme Controller)
   ========================================================================== */
function initThemeController() {
    const hueSlider = document.getElementById('hue-slider');
    const hueVal = document.getElementById('hue-val');
    const glowSlider = document.getElementById('glow-slider');
    const glowVal = document.getElementById('glow-val');
    const presetBtns = document.querySelectorAll('.preset-btn');

    // 色相调节
    hueSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        hueVal.textContent = val;
        document.documentElement.style.setProperty('--primary-hue', val);
        updatePresetActiveState(val);
        if (typeof updateWebGLColors === 'function') updateWebGLColors();
    });

    // 亮度/发光范围调节
    glowSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        glowVal.textContent = val;
        document.documentElement.style.setProperty('--primary-glow', `${val}%`);
    });

    // 预设主题按钮点击
    presetBtns.forEach(btn => {
        const hue = btn.dataset.hue;
        // 页面初始化时激活对应预设
        if (hue === hueSlider.value) {
            btn.classList.add('active');
        }

        btn.addEventListener('click', () => {
            hueSlider.value = hue;
            hueVal.textContent = hue;
            document.documentElement.style.setProperty('--primary-hue', hue);
            
            updatePresetActiveState(hue);
            if (typeof updateWebGLColors === 'function') updateWebGLColors();
        });
    });

    function updatePresetActiveState(currentHue) {
        presetBtns.forEach(btn => {
            if (Math.abs(parseInt(btn.dataset.hue) - parseInt(currentHue)) < 10) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}

/* ==========================================================================
   3. 模拟音乐播放器 (Music Player)
   ========================================================================== */
// ==========================================================================
// 网页内置合成器类 (Web Audio API Procedural Synthesizer)
// 100% 离线、免流量、防止任何跨域 (CORS) 报错，极客范十足的 Web 创意编程。
// ==========================================================================
class AmbientSynth {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.oscillators = [];
        this.gainNode = null;
        this.currentChord = 0;
        this.chordInterval = null;
        
        // 三套不同的和弦进程，对应三首乐曲
        this.trackChords = [
            // Track 1: Cyber Resonance (Am7 - D7 - Gmaj7 - Cmaj7 经典爵士降半音爵士进程)
            [
                [220.00, 261.63, 329.63, 392.00], // Am7
                [146.83, 293.66, 369.99, 440.00], // D7
                [196.00, 246.94, 293.66, 392.00], // Gmaj7
                [130.81, 261.63, 329.63, 493.88]  // Cmaj7
            ],
            // Track 2: Neon Highway (Em - C - D - Bm 赛博史诗感电子和弦)
            [
                [164.81, 246.94, 329.63, 392.00], // Em
                [130.81, 261.63, 329.63, 523.25], // Cmaj7
                [146.83, 293.66, 369.99, 440.00], // D
                [123.47, 246.94, 293.66, 440.00]  // Bm7
            ],
            // Track 3: Digital Drift (F#m7 - B7 - G#m7 - C#7 未来科幻律动和弦)
            [
                [185.00, 220.00, 277.18, 369.99], // F#m7
                [123.47, 246.94, 311.13, 440.00], // B7
                [207.65, 246.94, 311.13, 415.30], // G#m7
                [138.59, 277.18, 349.23, 493.88]  // C#7
            ]
        ];
    }
    
    start(trackIndex) {
        if (this.isPlaying) this.stop();
        this.isPlaying = true;
        
        // 懒加载 AudioContext，确保在用户手势点击后初始化
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        
        const chords = this.trackChords[trackIndex] || this.trackChords[0];
        this.currentChord = 0;
        
        // 创建主增益节点 (控制音量与渐入渐出)
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 1.0); // 1.0s 内淡入至 12% 音量
        this.gainNode.connect(this.ctx.destination);
        
        // 播放第一个和弦
        this.playChord(chords[this.currentChord], trackIndex);
        
        // 每 4.5 秒自动平滑过渡到下一个和弦
        this.chordInterval = setInterval(() => {
            this.currentChord = (this.currentChord + 1) % chords.length;
            this.transitionToChord(chords[this.currentChord], trackIndex);
        }, 4500);
    }
    
    playChord(frequencies, trackIndex) {
        this.stopOscillators();
        
        const now = this.ctx.currentTime;
        // 针对不同曲目使用不同的基础波形
        const waveTypes = ['sine', 'triangle', 'sine'];
        const type = waveTypes[trackIndex] || 'sine';
        
        frequencies.forEach(freq => {
            const osc = this.ctx.createOscillator();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, now);
            
            // 引入微弱的低频震荡器 (LFO)，模拟 Lofi 的磁带抖动音调不稳效果 (Pitch Wobble)
            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();
            lfo.frequency.value = 4 + Math.random() * 2; // 4-6Hz 的抖动频率
            lfoGain.gain.value = 1.2; // 极其微弱的音高弯曲
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            
            // 每个音符有独立的淡入淡出增益节点
            const noteGain = this.ctx.createGain();
            noteGain.gain.setValueAtTime(0, now);
            noteGain.gain.linearRampToValueAtTime(0.25, now + 0.8); // 音符 0.8s 渐强
            
            osc.connect(noteGain);
            noteGain.connect(this.gainNode);
            
            lfo.start(now);
            osc.start(now);
            
            this.oscillators.push({ osc, lfo, noteGain });
        });
    }
    
    transitionToChord(newFrequencies, trackIndex) {
        const now = this.ctx.currentTime;
        
        // 1. 让当前发声的和弦音符渐暗淡出，并在淡出后彻底释放资源
        this.oscillators.forEach(item => {
            item.noteGain.gain.cancelScheduledValues(now);
            item.noteGain.gain.setValueAtTime(item.noteGain.gain.value, now);
            item.noteGain.gain.linearRampToValueAtTime(0, now + 0.8); // 0.8秒内淡出音符
            
            const tempOsc = item.osc;
            const tempLfo = item.lfo;
            setTimeout(() => {
                try {
                    tempOsc.stop();
                    tempLfo.stop();
                } catch(e) {}
            }, 850);
        });
        this.oscillators = [];
        
        // 2. 略微延时 100ms 播放新和弦，营造平滑交织的垫乐氛围 (Pad Layer)
        setTimeout(() => {
            if (this.isPlaying) {
                this.playChord(newFrequencies, trackIndex);
            }
        }, 100);
    }
    
    stopOscillators() {
        this.oscillators.forEach(item => {
            try {
                item.osc.stop();
                item.lfo.stop();
            } catch(e) {}
        });
        this.oscillators = [];
    }
    
    stop() {
        if (!this.isPlaying) return;
        this.isPlaying = false;
        clearInterval(this.chordInterval);
        
        if (this.gainNode && this.ctx) {
            const now = this.ctx.currentTime;
            this.gainNode.gain.cancelScheduledValues(now);
            this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
            this.gainNode.gain.linearRampToValueAtTime(0, now + 0.5); // 0.5 秒内整站环境乐声渐弱淡出
            
            setTimeout(() => {
                this.stopOscillators();
                if (this.ctx && this.ctx.state === 'running') {
                    this.ctx.suspend();
                }
            }, 600);
        }
    }
}

function initMusicPlayer() {
    const playlist = [
        { title: 'Cyber Resonance', artist: 'Procedural Synth', duration: 165 },
        { title: 'Neon Highway', artist: 'Procedural Synth', duration: 192 },
        { title: 'Digital Drift', artist: 'Procedural Synth', duration: 140 }
    ];

    let currentTrackIndex = 0;
    let isPlaying = false;
    let currentTime = 0;
    let synth = new AmbientSynth();
    
    let playInterval = null;
    let visualizerInterval = null;

    // 获取 DOM 元素
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const vinylDisc = document.querySelector('.vinyl-disc');
    const trackTitle = document.querySelector('.track-title');
    const trackArtist = document.querySelector('.track-artist');
    const timeElapsedEl = document.querySelector('.time-elapsed');
    const timeTotalEl = document.querySelector('.time-total');
    const progressBar = document.querySelector('.progress-bar');
    const progressBarWrap = document.querySelector('.progress-bar-wrap');
    const visualizerBars = document.querySelectorAll('.audio-visualizer .bar');

    // 格式化时间 0:00
    function formatTime(seconds) {
        if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // 载入歌曲
    function loadTrack(index) {
        const track = playlist[index];
        trackTitle.textContent = track.title;
        trackArtist.textContent = track.artist;
        timeElapsedEl.textContent = '0:00';
        timeTotalEl.textContent = formatTime(track.duration);
        progressBar.style.width = '0%';
        currentTime = 0;
        
        if (isPlaying) {
            startPlayback();
        }
    }

    // 开始播放
    function startPlayback() {
        clearInterval(playInterval);
        clearInterval(visualizerInterval);
        
        // 激活网页底层合成器，播放对应曲目的和弦进程
        synth.start(currentTrackIndex);
        
        vinylDisc.classList.add('playing');
        playBtn.innerHTML = '<i data-lucide="pause"></i>';
        if (typeof lucide !== 'undefined') lucide.createIcons();

        // 进度步进
        const track = playlist[currentTrackIndex];
        playInterval = setInterval(() => {
            currentTime++;
            if (currentTime >= track.duration) {
                nextTrack();
            } else {
                timeElapsedEl.textContent = formatTime(currentTime);
                const progressPercent = (currentTime / track.duration) * 100;
                progressBar.style.width = `${progressPercent}%`;
            }
        }, 1000);

        // 模拟频谱动画
        visualizerInterval = setInterval(() => {
            visualizerBars.forEach(bar => {
                const randomHeight = Math.floor(Math.random() * 32) + 6; // 6px - 38px
                bar.style.height = `${randomHeight}px`;
            });
        }, 120);
    }

    // 暂停播放
    function pausePlayback() {
        synth.stop();
        
        clearInterval(playInterval);
        clearInterval(visualizerInterval);
        vinylDisc.classList.remove('playing');
        playBtn.innerHTML = '<i data-lucide="play"></i>';
        if (typeof lucide !== 'undefined') lucide.createIcons();

        // 重置频谱为初始小条
        visualizerBars.forEach(bar => {
            bar.style.height = '4px';
        });
    }

    // 下一首
    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) startPlayback();
    }

    // 上一首
    function prevTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) startPlayback();
    }

    // 播放按钮绑定
    playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
            startPlayback();
        } else {
            pausePlayback();
        }
    });

    nextBtn.addEventListener('click', () => {
        nextTrack();
    });
    
    prevBtn.addEventListener('click', () => {
        prevTrack();
    });

    // 进度条定位
    progressBarWrap.addEventListener('click', (e) => {
        const rect = progressBarWrap.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const clickRatio = clickX / width;
        
        const track = playlist[currentTrackIndex];
        currentTime = Math.floor(clickRatio * track.duration);
        timeElapsedEl.textContent = formatTime(currentTime);
        progressBar.style.width = `${clickRatio * 100}%`;
    });

    // 初始化加载第一首
    loadTrack(currentTrackIndex);
}

/* ==========================================================================
   4. 科幻极客命令行终端 (Sci-Fi Terminal)
   ========================================================================== */
function initTerminal() {
    const input = document.getElementById('terminal-input');
    const history = document.getElementById('terminal-history');
    const cursor = document.querySelector('.terminal-cursor');
    const terminalBody = document.getElementById('terminal-body');

    const visibleText = document.querySelector('.terminal-visible-text');

    // 将输入内容同步到可见的 Span 标签中，利用 Flex 布局让自定义光标在文档流中自适应跟随
    input.addEventListener('input', () => {
        visibleText.textContent = input.value;
    });

    // 按下回车键执行命令
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawCmd = input.value;
            const cmd = rawCmd.trim().toLowerCase();
            input.value = '';
            visibleText.textContent = '';
            
            if (rawCmd.trim() !== '') {
                executeCommand(rawCmd, cmd);
            }
        }
    });

    // 点击终端任意区域，自动聚焦输入框
    terminalBody.addEventListener('click', () => {
        input.focus();
    });

    // 注册的命令函数集
    function executeCommand(rawCmd, cmd) {
        // 1. 将用户的输入打印到终端历史区
        appendLine(`katrina > ${rawCmd}`, 'user-cmd');

        // 2. 命令路由解析
        switch(cmd) {
            case 'help':
                printHelp();
                break;
            case 'about':
                printAbout();
                break;
            case 'blog':
                printBlog();
                break;
            case 'projects':
                printProjects();
                break;
            case 'clear':
                history.innerHTML = '';
                break;
            case 'neofetch':
                printNeofetch();
                break;
            case 'hack':
                startMatrixHack();
                break;
            default:
                appendLine(`Command not found: "${cmd}". Type "help" to see available commands.`, 'system-msg');
        }

        // 3. 滚动到终端底部
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function appendLine(text, className = 'terminal-line') {
        const div = document.createElement('div');
        div.className = className;
        div.innerHTML = text;
        history.appendChild(div);
    }

    // 命令行 - help
    function printHelp() {
        const commands = [
            { name: 'neofetch', desc: '显示系统与开发者信息。' },
            { name: 'about', desc: '关于我的技术背景与定位。' },
            { name: 'blog', desc: '查看最近的博客文章列表。' },
            { name: 'projects', desc: '列出我的核心精选项目。' },
            { name: 'hack', desc: '启动炫酷的赛博朋克数据流。' },
            { name: 'clear', desc: '清空终端屏幕历史。' },
            { name: 'help', desc: '显示此帮助指南。' }
        ];
        
        appendLine('可用命令列表：', 'system-msg');
        commands.forEach(c => {
            appendLine(`  <span class="cmd-highlight">${c.name.padEnd(12)}</span> - ${c.desc}`);
        });
    }

    // 命令行 - about
    function printAbout() {
        appendLine('【Katrina // 跨界数字创作者】', 'success-msg');
        appendLine('我是一名深耕前端开发与创意交互的工程师。我坚信卓越的 UI/UX 是代码的灵魂。');
        appendLine('技术栈：HTML5 / CSS3 / ES6+ / React / Vue3 / WebGL / Node.js');
        appendLine('格言：在零与一的虚拟星空，构建具备引力效应的设计。');
    }

    // 命令行 - blog
    function printBlog() {
        appendLine('正在检索最新的博客文章...', 'system-msg');
        setTimeout(() => {
            appendLine('最新文章推荐：', 'success-msg');
            appendLine('  [1] <a href="#" style="color: var(--neon-primary)">深入理解 CSS Backdrop-filter 毛玻璃特效</a> (前端技术)');
            appendLine('  [2] <a href="#" style="color: var(--neon-primary)">Web 3D 卡片悬停倾斜（Tilt）的交互实现</a> (交互设计)');
            appendLine('  [3] <a href="#" style="color: var(--neon-primary)">基于 Canvas 粒子系统的烟花网页动效</a> (创意编程)');
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }, 600);
    }

    // 命令行 - projects
    function printProjects() {
        appendLine('正在检索核心开源项目...', 'system-msg');
        setTimeout(() => {
            appendLine('开源精选项目列表：', 'success-msg');
            appendLine('  - <span class="cmd-highlight">Gravity-UI-Lab</span>: 炫酷的拟物与毛玻璃组件样式库。 (CSS / JS)');
            appendLine('  - <span class="cmd-highlight">React-Three-Universe</span>: 基于 Three.js 的 3D 银河系交互模型。 (React / WebGL)');
            appendLine('  - <span class="cmd-highlight">CyberShell-Terminal</span>: 轻量级网页仿真终端组件。 (TypeScript)');
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }, 600);
    }

    // 命令行 - neofetch
    function printNeofetch() {
        const logo = `
   /\\_/\\  
  ( o.o ) 
   > ^ <  
  KATRINA
`;
        const info = `
<span class="cmd-highlight">OS</span>: Creative Terminal OS v1.0.0
<span class="cmd-highlight">Host</span>: Web-Environment
<span class="cmd-highlight">Kernel</span>: Gemini-Core-3.5
<span class="cmd-highlight">Uptime</span>: 2026 days
<span class="cmd-highlight">Shell</span>: Katrina-Zsh
<span class="cmd-highlight">Resolution</span>: ${window.innerWidth}x${window.innerHeight}
<span class="cmd-highlight">CPU</span>: Brain M3 Ultra (16 Cores)
<span class="cmd-highlight">Memory</span>: 100% Devoted / 16GB
<span class="cmd-highlight">Theme</span>: Cyberpunk Glassmorphism
`;
        
        const table = `
<div style="display: flex; gap: 2.5rem; align-items: center;">
    <pre class="terminal-line ascii-art" style="margin:0">${logo}</pre>
    <div class="terminal-line" style="line-height: 1.7">${info}</div>
</div>
`;
        const div = document.createElement('div');
        div.innerHTML = table;
        history.appendChild(div);
    }

    // 命令行 - hack (矩阵绿雨效果模拟)
    function startMatrixHack() {
        appendLine('Initializing Cyber intrusion...', 'system-msg');
        
        let count = 0;
        input.disabled = true; // 锁定输入
        
        const hackInterval = setInterval(() => {
            let binaryLine = '';
            for(let i = 0; i < 40; i++) {
                binaryLine += Math.random() > 0.5 ? '1' : '0';
            }
            appendLine(binaryLine, 'success-msg');
            terminalBody.scrollTop = terminalBody.scrollHeight;
            
            count++;
            if (count > 25) {
                clearInterval(hackInterval);
                appendLine('SYSTEM INTRUSION SUCCESSFUL.', 'system-msg');
                appendLine('Access granted. Welcome back, Admin.', 'success-msg');
                input.disabled = false;
                input.focus();
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }
        }, 80);
    }

    // 初始化加载时，默认展示帮助命令的菜单效果
    printHelp();
}

/* ==========================================================================
   5. 自定义科幻霓虹光标 (Custom Neon Cursor)
   ========================================================================== */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const dot = document.querySelector('.cursor-dot');
    
    if (!cursor) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let lastParticleTime = 0;

    // 激活自定义光标样式（隐藏系统鼠标指针）
    document.body.classList.add('custom-cursor-enabled');

    // 追踪鼠标位置
    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        
        // 拖尾粒子生成（节流限制，以防性能损耗）
        const now = Date.now();
        if (now - lastParticleTime > 25) { // 限制至少 25ms 产生一颗粒子
            createTrailParticle(e.clientX, e.clientY);
            lastParticleTime = now;
        }
    });

    // 缓动跟随算法 (Lerp)
    function animateCursor() {
        const ease = 0.16; // 缓动阻尼值，数值越小跟随越有平滑黏滞感
        currentX += (targetX - currentX) * ease;
        currentY += (targetY - currentY) * ease;

        cursor.style.left = `${currentX}px`;
        cursor.style.top = `${currentY}px`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // 拖尾消散粒子生成器
    function createTrailParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'cursor-trail-particle';
        
        // 微小随机偏移
        const offsetX = (Math.random() - 0.5) * 6;
        const offsetY = (Math.random() - 0.5) * 6;
        
        particle.style.left = `${x + offsetX}px`;
        particle.style.top = `${y + offsetY}px`;
        
        // 将粒子添加到 body
        document.body.appendChild(particle);

        // 500ms 后自动销毁释放 DOM 内存
        setTimeout(() => {
            particle.remove();
        }, 500);
    }

    // 悬停检测：选中所有链接、按钮、卡片、预设以及进度条等可点击元素
    const interactiveElements = document.querySelectorAll(
        'a, button, input, select, textarea, .tilt-card, .preview-item, .preset-btn, .progress-bar-wrap, #terminal-body, .progress-bar-wrap'
    );

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering');
        });
    });
}

/* ==========================================================================
   6. 3D WebGL 粒子球体与星系 (Three.js WebGL Particle Scene)
   ========================================================================== */
let globalParticleMaterial = null; // 全局粒子材质引用，便于联动更新颜色

function init3DScene() {
    const container = document.getElementById('webgl-container');
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    
    const width = container.clientWidth;
    const height = container.clientHeight || 450;
    
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 250;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 限制像素比以优化性能
    container.appendChild(renderer.domElement);

    // 2. 粒子几何体生成
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // 动态提取当前 CSS 变量对应颜色作为初始颜色
    const tempColor = getNeonColors();
    const primaryColor = new THREE.Color(tempColor.primary);
    const secondaryColor = new THREE.Color(tempColor.secondary);

    // 将 1200 个粒子散布在球体，800 个粒子散布在倾斜星环带
    const globeCount = 1200;
    for (let i = 0; i < particleCount; i++) {
        let x, y, z;
        
        if (i < globeCount) {
            // 球面排布 (斐波那契螺旋面或随机球面分布)
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            
            const radius = 60 + (Math.random() - 0.5) * 4; // 基础半径 60
            
            x = radius * Math.sin(phi) * Math.cos(theta);
            y = radius * Math.sin(phi) * Math.sin(theta);
            z = radius * Math.cos(phi);
        } else {
            // 环带排布 (土星星环)
            const theta = Math.random() * 2.0 * Math.PI;
            const radius = 80 + Math.random() * 35; // 环半径在 80 到 115 之间
            
            // 星环在 X-Z 平面，并有轻微随机起伏 Y
            const xRaw = radius * Math.cos(theta);
            const zRaw = radius * Math.sin(theta);
            const yRaw = (Math.random() - 0.5) * 5;
            
            // 整体倾斜 30 度 (绕 X 轴旋转)
            const tilt = Math.PI / 6; 
            x = xRaw;
            y = yRaw * Math.cos(tilt) - zRaw * Math.sin(tilt);
            z = yRaw * Math.sin(tilt) + zRaw * Math.cos(tilt);
        }

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // 粒子颜色混合：核心球体偏向主色，星环偏向辅助色
        const mixedColor = primaryColor.clone().lerp(secondaryColor, i < globeCount ? Math.random() * 0.4 : 0.5 + Math.random() * 0.5);
        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // 3. 粒子材质 (材质纹理)
    // 制作一个完美的圆形发光贴图（Canvas 生成发光点）
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    const texture = new THREE.CanvasTexture(canvas);

    globalParticleMaterial = new THREE.PointsMaterial({
        size: 2.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        map: texture
    });

    const particleSystem = new THREE.Points(geometry, globalParticleMaterial);
    scene.add(particleSystem);

    // 4. 鼠标与拖拽交互状态
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    // 旋转物理变量
    let targetRotationX = 0.3; // 初始倾斜
    let targetRotationY = 0.5;
    let currentRotationX = targetRotationX;
    let currentRotationY = targetRotationY;
    let rotationVelocityX = 0;
    let rotationVelocityY = 0;

    // 视差偏置相机位移
    let parallaxX = 0, parallaxY = 0;
    let targetParallaxX = 0, targetParallaxY = 0;

    // 获取自定义光标元素，用于联动抓取状态
    const customCursor = document.querySelector('.custom-cursor');

    // 拖拽控制
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
        if (customCursor) customCursor.classList.add('grabbing');
    });

    window.addEventListener('mousemove', (e) => {
        // 计算鼠标视差目标
        targetParallaxX = (e.clientX - window.innerWidth / 2) * 0.04;
        targetParallaxY = (e.clientY - window.innerHeight / 2) * 0.04;

        if (isDragging) {
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;
            
            // 速度变化
            rotationVelocityY = deltaX * 0.005;
            rotationVelocityX = deltaY * 0.005;

            targetRotationY += rotationVelocityY;
            targetRotationX += rotationVelocityX;

            previousMousePosition = { x: e.clientX, y: e.clientY };
        }
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        if (customCursor) customCursor.classList.remove('grabbing');
    });

    // 移动端 Touch 拖拽支持
    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        if (customCursor) customCursor.classList.add('grabbing');
    });

    window.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches.length > 0) {
            const deltaX = e.touches[0].clientX - previousMousePosition.x;
            const deltaY = e.touches[0].clientY - previousMousePosition.y;
            
            rotationVelocityY = deltaX * 0.005;
            rotationVelocityX = deltaY * 0.005;

            targetRotationY += rotationVelocityY;
            targetRotationX += rotationVelocityX;

            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    });

    window.addEventListener('touchend', () => {
        isDragging = false;
        if (customCursor) customCursor.classList.remove('grabbing');
    });

    // 5. 动画循环
    function animate() {
        requestAnimationFrame(animate);

        // 如果用户不进行拖拽，施加持续低速自转
        if (!isDragging) {
            // 衰减旋转速度 (阻尼惯性效果)
            rotationVelocityX *= 0.95;
            rotationVelocityY *= 0.95;
            
            // 加入基底旋转
            targetRotationY += 0.0015;
            targetRotationX += rotationVelocityX;
            targetRotationY += rotationVelocityY;
        }

        // 平滑旋转变化 (Lerp)
        currentRotationX += (targetRotationX - currentRotationX) * 0.1;
        currentRotationY += (targetRotationY - currentRotationY) * 0.1;

        particleSystem.rotation.x = currentRotationX;
        particleSystem.rotation.y = currentRotationY;

        // 平滑视差相机变化
        parallaxX += (targetParallaxX - parallaxX) * 0.08;
        parallaxY += (targetParallaxY - parallaxY) * 0.08;
        
        camera.position.x = parallaxX;
        camera.position.y = -parallaxY; // 倒置Y实现自然位移
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();

    // 6. 响应窗口大小缩放
    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight || 450;
        
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        
        renderer.setSize(newWidth, newHeight);
    });
}

// 辅助函数：从文档中解析当前 CSS 霓虹变量值
function getNeonColors() {
    const hue = getComputedStyle(document.documentElement).getPropertyValue('--primary-hue').trim() || '280';
    return {
        primary: `hsl(${hue}, 85%, 65%)`,
        secondary: `hsl(${parseInt(hue) + 40}, 90%, 60%)`
    };
}

// 供 Theme Controller 滑块触发的更新颜色逻辑
function updateWebGLColors() {
    if (!globalParticleMaterial) return;
    
    const tempColor = getNeonColors();
    const primaryColor = new THREE.Color(tempColor.primary);
    const secondaryColor = new THREE.Color(tempColor.secondary);
    
    // 更新粒子顶点颜色属性缓存
    const geometry = globalParticleMaterial.parent ? globalParticleMaterial.parent.geometry : null;
    if (geometry) {
        const colors = geometry.attributes.color.array;
        const count = colors.length / 3;
        const globeCount = 1200;
        
        for (let i = 0; i < count; i++) {
            const mixedColor = primaryColor.clone().lerp(secondaryColor, i < globeCount ? Math.random() * 0.4 : 0.5 + Math.random() * 0.5);
            colors[i * 3] = mixedColor.r;
            colors[i * 3 + 1] = mixedColor.g;
            colors[i * 3 + 2] = mixedColor.b;
        }
        geometry.attributes.color.needsUpdate = true;
    }
}
