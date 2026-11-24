// ============================================
// 類 Live2D 2.5D 立繪動態與表情引擎 (WebGL + Canvas 2D 降級)
// ============================================

class LivePortraitManager {
    constructor() {
        this.wrapper = null;
        this.canvas = null;
        this.overlayCanvas = null;
        this.overlayCtx = null;
        this.fxLayer = null;

        this.gl = null;
        this.glProgram = null;
        this.glBuffers = null;
        this.glTextures = new Map();
        this.useWebGL = false;
        this.ctx2d = null;

        this.nativeWidth = 720;
        this.nativeHeight = 960;
        this.glCols = 20;
        this.glRows = 26;
        this.c2dCols = 10;
        this.c2dRows = 12;

        this.isEnabled = true;
        this.blinkEnabled = true;
        this.mouthEnabled = true;
        this.isVisible = false;
        this.isTalking = false;

        this.currentCharId = null;
        this.currentExpression = 'normal';
        this.activeSrc = null;
        this.prevSrc = null;
        this.baseSrc = null;
        this.rig = null;

        this.imageCache = new Map();
        this.crossfadeProgress = 1;
        this.crossfadeDuration = 180;
        this.crossfadeStart = 0;

        // 平滑表情權重
        this.exprKeys = ['normal', 'blush', 'joy', 'sad', 'pout'];
        this.exprWeights = { normal: 1, blush: 0, joy: 0, sad: 0, pout: 0 };

        // 物理與視線追蹤狀態
        this.targetLookX = 0;
        this.targetLookY = 0;
        this.lookX = 0;
        this.lookY = 0;
        this.lastPointerMoveTime = 0;

        this.earAngleL = 0;
        this.earVelL = 0;
        this.earAngleR = 0;
        this.earVelR = 0;

        this.hairSway = 0;
        this.hairVel = 0;

        this.bounceY = 0;
        this.bounceVel = 0;
        this.headTiltExtra = 0;
        this.headTiltVel = 0;

        // 眨眼與說話狀態
        this.blinkTimer = null;
        this.doubleBlinkTimer = null;
        this.earTwitchTimer = null;
        this.isBlinking = false;
        this.blinkAmount = 0;
        this.blinkStart = 0;
        this.blinkDuration = 145;

        this.talkStart = 0;
        this.mouthOpen = 0;
        this.talkPauseUntil = 0;
        this.inWhisperAside = false;
        this.talkVowelPhase = 0;

        this.animFrameId = null;
        this.lastFrameTime = 0;

        this.loadSettings();
        this.init();
    }

    loadSettings() {
        try {
            if (typeof localStorage !== 'undefined') {
                const saved = localStorage.getItem('umamusume_live2d_enabled');
                if (saved !== null) {
                    this.isEnabled = saved === 'true';
                }
            }
        } catch (e) {
            console.warn('載入類 Live2D 設定失敗:', e);
        }
    }

    saveSettings() {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('umamusume_live2d_enabled', this.isEnabled ? 'true' : 'false');
            }
        } catch (e) {
            console.warn('儲存類 Live2D 設定失敗:', e);
        }
    }

    init() {
        if (typeof document === 'undefined') return;

        this.wrapper = document.getElementById('live-portrait-wrapper');
        this.canvas = document.getElementById('live-portrait-canvas');
        this.overlayCanvas = document.getElementById('live-portrait-overlay');
        this.fxLayer = document.getElementById('live-portrait-fx');

        if (this.canvas) {
            this.canvas.width = this.nativeWidth;
            this.canvas.height = this.nativeHeight;
            this.initRenderer();
        }

        if (this.overlayCanvas) {
            this.overlayCanvas.width = this.nativeWidth;
            this.overlayCanvas.height = this.nativeHeight;
            this.overlayCtx = this.overlayCanvas.getContext('2d');
        }

        this.bindPointerTracking();
    }

    bindPointerTracking() {
        if (typeof window === 'undefined') return;

        window.addEventListener('mousemove', (e) => {
            if (!this.isVisible || !this.isEnabled) return;
            const vw = window.innerWidth || 1024;
            const vh = window.innerHeight || 768;
            const nx = ((e.clientX / vw) - 0.5) * 2;
            const ny = ((e.clientY / vh) - 0.5) * 2;
            this.targetLookX = Math.max(-1, Math.min(1, nx));
            this.targetLookY = Math.max(-1, Math.min(1, ny));
            this.lastPointerMoveTime = performance.now();
        });
    }

    initRenderer() {
        if (!this.canvas) return;
        try {
            const gl = this.canvas.getContext('webgl', {
                alpha: true,
                premultipliedAlpha: true,
                antialias: true
            }) || this.canvas.getContext('experimental-webgl', {
                alpha: true,
                premultipliedAlpha: true,
                antialias: true
            });

            if (gl && typeof gl.createShader === 'function' && this.setupWebGL(gl)) {
                this.gl = gl;
                this.useWebGL = true;
                return;
            }
        } catch (e) {
            console.warn('WebGL 初始化失敗，降級使用 Canvas 2D:', e);
        }

        this.fallbackToCanvas2D();
    }

    fallbackToCanvas2D() {
        this.useWebGL = false;
        this.gl = null;
        if (!this.canvas) return;

        let ctx = this.canvas.getContext('2d');
        if (!ctx && typeof document !== 'undefined' && this.canvas.parentNode) {
            const freshCanvas = document.createElement('canvas');
            freshCanvas.id = this.canvas.id;
            freshCanvas.className = this.canvas.className;
            freshCanvas.width = this.nativeWidth;
            freshCanvas.height = this.nativeHeight;
            this.canvas.parentNode.replaceChild(freshCanvas, this.canvas);
            this.canvas = freshCanvas;
            ctx = this.canvas.getContext('2d');
        }
        this.ctx2d = ctx;
    }

    setupWebGL(gl) {
        const vsSource = `
            attribute vec2 a_pos;
            attribute vec2 a_uv;
            varying vec2 v_uv;
            void main() {
                gl_Position = vec4(a_pos, 0.0, 1.0);
                v_uv = a_uv;
            }
        `;
        const fsSource = `
            precision mediump float;
            uniform sampler2D u_texA;
            uniform sampler2D u_texB;
            uniform float u_mix;
            varying vec2 v_uv;
            void main() {
                vec4 cA = texture2D(u_texA, v_uv);
                vec4 cB = texture2D(u_texB, v_uv);
                gl_FragColor = mix(cA, cB, u_mix);
            }
        `;

        const vs = this.compileShader(gl, gl.VERTEX_SHADER, vsSource);
        const fs = this.compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
        if (!vs || !fs) return false;

        const prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            return false;
        }

        this.glProgram = prog;
        gl.useProgram(prog);

        const cols = this.glCols;
        const rows = this.glRows;
        const vertCount = (cols + 1) * (rows + 1);
        const posArray = new Float32Array(vertCount * 2);
        const uvArray = new Float32Array(vertCount * 2);
        const indices = [];

        let ptr = 0;
        for (let r = 0; r <= rows; r++) {
            const v = r / rows;
            for (let c = 0; c <= cols; c++) {
                const u = c / cols;
                uvArray[ptr] = u;
                uvArray[ptr + 1] = v;
                posArray[ptr] = u * 2 - 1;
                posArray[ptr + 1] = 1 - v * 2;
                ptr += 2;
            }
        }

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const i0 = r * (cols + 1) + c;
                const i1 = i0 + 1;
                const i2 = i0 + (cols + 1);
                const i3 = i2 + 1;
                indices.push(i0, i2, i1, i1, i2, i3);
            }
        }

        const posBuf = gl.createBuffer();
        const uvBuf = gl.createBuffer();
        const idxBuf = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
        gl.bufferData(gl.ARRAY_BUFFER, uvArray, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
        gl.bufferData(gl.ARRAY_BUFFER, posArray, gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        this.glBuffers = {
            posBuf,
            uvBuf,
            idxBuf,
            posArray,
            indexCount: indices.length,
            aPos: gl.getAttribLocation(prog, 'a_pos'),
            aUv: gl.getAttribLocation(prog, 'a_uv'),
            uTexA: gl.getUniformLocation(prog, 'u_texA'),
            uTexB: gl.getUniformLocation(prog, 'u_texB'),
            uMix: gl.getUniformLocation(prog, 'u_mix')
        };

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.viewport(0, 0, this.nativeWidth, this.nativeHeight);
        return true;
    }

    compileShader(gl, type, src) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            return null;
        }
        return shader;
    }

    getOrCreateTexture(src, img) {
        if (!this.useWebGL || !this.gl || !img) return null;
        if (this.glTextures.has(src)) {
            return this.glTextures.get(src);
        }

        const gl = this.gl;
        try {
            const tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            this.glTextures.set(src, tex);
            return tex;
        } catch (err) {
            console.warn('WebGL 載入紋理受限（如 file://），自動切換至 Canvas 2D 網格渲染:', err);
            this.fallbackToCanvas2D();
            return null;
        }
    }

    preloadImages(urls = []) {
        if (typeof Image === 'undefined') return;
        const unique = [...new Set(urls.filter(Boolean))];
        unique.forEach(src => this.loadImage(src));
    }

    loadImage(src, onReady) {
        if (!src) return null;
        const cached = this.imageCache.get(src);
        if (cached) {
            if (cached.complete && cached.naturalWidth > 0 && onReady) {
                onReady(cached);
            }
            return cached;
        }

        if (typeof Image === 'undefined') return null;
        const img = new Image();
        img.onload = () => {
            if (this.useWebGL) {
                this.getOrCreateTexture(src, img);
            }
            if (onReady) onReady(img);
        };
        img.src = src;
        this.imageCache.set(src, img);
        return img;
    }

    showCharacter(charId, expression = 'normal', imgSrc, rig, baseSrc = null) {
        this.currentCharId = charId;
        this.rig = rig || null;
        this.baseSrc = baseSrc || rig?.baseSrc || imgSrc;

        const exprChanged = this.currentExpression !== expression;
        const charChanged = !this.isVisible;
        this.currentExpression = this.exprKeys.includes(expression) ? expression : 'normal';

        if (imgSrc && imgSrc !== this.activeSrc) {
            this.prevSrc = this.activeSrc || imgSrc;
            this.activeSrc = imgSrc;
            this.crossfadeProgress = this.prevSrc === this.activeSrc ? 1 : 0;
            this.crossfadeStart = typeof performance !== 'undefined' ? performance.now() : Date.now();
            this.loadImage(imgSrc);
        }

        this.isVisible = true;
        if (this.wrapper) {
            this.wrapper.style.display = 'flex';
        }

        if (charChanged) {
            this.scheduleNextBlink(1200);
            this.scheduleEarTwitch(1800);
            this.startLoop();
        }

        if (exprChanged || charChanged) {
            this.triggerReaction(this.currentExpression);
        }
    }

    hide() {
        this.isVisible = false;
        this.isTalking = false;
        this.stopTimers();
        this.stopLoop();
        if (this.wrapper) {
            this.wrapper.style.display = 'none';
        }
        if (this.fxLayer) {
            this.fxLayer.innerHTML = '';
        }
    }

    setEnabled(enabled) {
        this.isEnabled = Boolean(enabled);
        this.saveSettings();
        if (!this.isEnabled) {
            this.bounceY = 0;
            this.bounceVel = 0;
            this.headTiltExtra = 0;
            this.headTiltVel = 0;
            this.earAngleL = 0;
            this.earAngleR = 0;
            this.hairSway = 0;
            this.lookX = 0;
            this.lookY = 0;
        }
        if (this.isVisible) {
            this.renderFrame(typeof performance !== 'undefined' ? performance.now() : Date.now());
        }
    }

    setBlinkEnabled(enabled) {
        this.blinkEnabled = Boolean(enabled);
        if (!this.blinkEnabled) {
            this.isBlinking = false;
            this.blinkAmount = 0;
            if (this.blinkTimer) {
                clearTimeout(this.blinkTimer);
                this.blinkTimer = null;
            }
            if (this.doubleBlinkTimer) {
                clearTimeout(this.doubleBlinkTimer);
                this.doubleBlinkTimer = null;
            }
        } else if (this.isVisible) {
            this.scheduleNextBlink(900);
        }
    }

    setMouthEnabled(enabled) {
        this.mouthEnabled = Boolean(enabled);
        if (!this.mouthEnabled) {
            this.mouthOpen = 0;
        }
    }

    setTalking(talking) {
        const next = Boolean(talking);
        if (next && !this.isTalking) {
            this.talkStart = typeof performance !== 'undefined' ? performance.now() : Date.now();
        }
        this.talkPauseUntil = 0;
        this.inWhisperAside = false;
        this.isTalking = next;
    }

    onTypeChar(ch) {
        if (!ch || !this.isTalking || !this.mouthEnabled) return;
        if (ch === '（' || ch === '(') {
            this.inWhisperAside = true;
            return;
        }
        if (ch === '）' || ch === ')') {
            this.inWhisperAside = false;
            return;
        }
        if (/[…\.、，。！？!?,—~\s]/.test(ch)) {
            const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
            this.talkPauseUntil = now + 115;
        }
    }

    stopTimers() {
        if (this.blinkTimer) {
            clearTimeout(this.blinkTimer);
            this.blinkTimer = null;
        }
        if (this.doubleBlinkTimer) {
            clearTimeout(this.doubleBlinkTimer);
            this.doubleBlinkTimer = null;
        }
        if (this.earTwitchTimer) {
            clearTimeout(this.earTwitchTimer);
            this.earTwitchTimer = null;
        }
        this.isBlinking = false;
        this.blinkAmount = 0;
    }

    scheduleNextBlink(delay = null) {
        if (!this.blinkEnabled || !this.isVisible) return;
        if (this.blinkTimer) clearTimeout(this.blinkTimer);

        const wait = delay !== null ? delay : (2500 + Math.random() * 2800);
        this.blinkTimer = setTimeout(() => {
            if (!this.blinkEnabled || !this.isVisible) return;
            this.triggerBlink(() => {
                if (Math.random() < 0.25 && this.blinkEnabled && this.isVisible) {
                    this.doubleBlinkTimer = setTimeout(() => {
                        this.doubleBlinkTimer = null;
                        if (!this.blinkEnabled || !this.isVisible) return;
                        this.triggerBlink(() => this.scheduleNextBlink());
                    }, 130);
                } else {
                    this.scheduleNextBlink();
                }
            });
        }, wait);
    }

    triggerBlink(onComplete) {
        this.isBlinking = true;
        this.blinkStart = typeof performance !== 'undefined' ? performance.now() : Date.now();
        this.onBlinkDone = onComplete || null;
    }

    scheduleEarTwitch(delay = null) {
        if (!this.isVisible) return;
        if (this.earTwitchTimer) clearTimeout(this.earTwitchTimer);

        const wait = delay !== null ? delay : (3000 + Math.random() * 4000);
        this.earTwitchTimer = setTimeout(() => {
            if (!this.isVisible) return;
            if (this.isEnabled) {
                const side = Math.random();
                if (side < 0.45) {
                    this.earVelL += (Math.random() > 0.5 ? 1 : -1) * 0.24;
                } else if (side < 0.9) {
                    this.earVelR += (Math.random() > 0.5 ? 1 : -1) * 0.24;
                } else {
                    this.earVelL += 0.22;
                    this.earVelR -= 0.22;
                }
            }
            this.scheduleEarTwitch();
        }, wait);
    }

    triggerReaction(type) {
        if (!this.isEnabled && type !== 'pet') return;

        if (type === 'joy') {
            this.bounceVel -= 0.045;
            this.earVelL += 0.28;
            this.earVelR -= 0.28;
            this.headTiltVel += 0.06;
            this.spawnFxParticles(['sparkle', 'star'], 2);
        } else if (type === 'blush') {
            this.bounceVel += 0.02;
            this.headTiltVel -= 0.08;
            this.earVelL -= 0.22;
            this.earVelR += 0.22;
            this.spawnFxParticles(['heart'], 1);
        } else if (type === 'pout') {
            this.bounceVel -= 0.03;
            this.earVelL += 0.32;
            this.earVelR += 0.22;
            this.headTiltVel += 0.09;
            this.spawnFxParticles(['anger'], 1);
        } else if (type === 'sad') {
            this.bounceVel += 0.025;
            this.earVelL -= 0.2;
            this.earVelR += 0.2;
            this.headTiltVel -= 0.05;
        } else if (type === 'pet') {
            this.bounceVel -= 0.065;
            this.earVelL += 0.42;
            this.earVelR -= 0.42;
            this.headTiltVel += (Math.random() > 0.5 ? 1 : -1) * 0.12;
            this.spawnFxParticles(['heart', 'sparkle', 'star'], 3);
        }
    }

    triggerPetReaction() {
        this.triggerReaction('pet');
    }

    getFxSvg(kind) {
        if (kind === 'heart') {
            return `<svg class="live-fx-svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#ff5e7e" stroke="#ffffff" stroke-width="1.5"/></svg>`;
        }
        if (kind === 'anger') {
            return `<svg class="live-fx-svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#e63946" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M4 9c3 0 5-2 5-5"/><path d="M20 9c-3 0-5-2-5-5"/><path d="M4 15c3 0 5 2 5 5"/><path d="M20 15c-3 0-5 2-5 5"/></svg>`;
        }
        if (kind === 'star') {
            return `<svg class="live-fx-svg" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><polygon points="12,2 14.9,8.6 22,9.3 16.6,14 18.2,21 12,17.3 5.8,21 7.4,14 2,9.3 9.1,8.6" fill="#ffd452" stroke="#b57d19" stroke-width="1.3"/></svg>`;
        }
        return `<svg class="live-fx-svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2z" fill="#ffe787" stroke="#d9941e" stroke-width="1.2"/></svg>`;
    }

    spawnFxParticles(symbols, count = 2) {
        if (!this.fxLayer || typeof document === 'undefined' || !this.isVisible) return;

        for (let i = 0; i < count; i++) {
            const node = document.createElement('span');
            node.className = 'live-fx-particle';
            node.innerHTML = this.getFxSvg(symbols[i % symbols.length]);
            const leftPct = 34 + Math.random() * 32;
            const topPct = 14 + Math.random() * 20;
            node.style.left = `${leftPct}%`;
            node.style.top = `${topPct}%`;
            node.style.animationDelay = `${i * 90}ms`;
            this.fxLayer.appendChild(node);
            setTimeout(() => {
                if (node.remove) node.remove();
            }, 1100);
        }
    }

    startLoop() {
        if (this.animFrameId || typeof requestAnimationFrame === 'undefined') return;
        this.lastFrameTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

        const tick = (now) => {
            if (!this.isVisible) {
                this.animFrameId = null;
                return;
            }
            this.updatePhysics(now);
            this.renderFrame(now);
            this.animFrameId = requestAnimationFrame(tick);
        };

        this.animFrameId = requestAnimationFrame(tick);
    }

    stopLoop() {
        if (this.animFrameId && typeof cancelAnimationFrame !== 'undefined') {
            cancelAnimationFrame(this.animFrameId);
        }
        this.animFrameId = null;
    }

    updatePhysics(now) {
        const dt = Math.min(0.05, Math.max(0.004, (now - this.lastFrameTime) / 1000));
        this.lastFrameTime = now;

        // 表情權重平滑插值 (~220ms)
        const exprStep = Math.min(1, dt / 0.22);
        for (const key of this.exprKeys) {
            const target = key === this.currentExpression ? 1 : 0;
            this.exprWeights[key] += (target - this.exprWeights[key]) * exprStep;
        }

        // Crossfade 更新
        if (this.crossfadeProgress < 1) {
            this.crossfadeProgress = Math.min(1, (now - this.crossfadeStart) / this.crossfadeDuration);
        }

        // 眨眼更新
        if (this.isBlinking) {
            const elapsed = now - this.blinkStart;
            const p = Math.min(1, elapsed / this.blinkDuration);
            if (p <= 0.42) {
                this.blinkAmount = p / 0.42;
            } else if (p <= 0.56) {
                this.blinkAmount = 1;
            } else {
                this.blinkAmount = 1 - (p - 0.56) / 0.44;
            }
            if (p >= 1) {
                this.isBlinking = false;
                this.blinkAmount = 0;
                if (this.onBlinkDone) {
                    const cb = this.onBlinkDone;
                    this.onBlinkDone = null;
                    cb();
                }
            }
        } else {
            this.blinkAmount = 0;
        }

        // 說話嘴型開合更新 (自然三音節節奏＋標點停頓＋括號氣音縮幅)
        let targetMouth = 0;
        if (this.isTalking && this.mouthEnabled) {
            if (now < this.talkPauseUntil) {
                targetMouth = 0.05;
            } else {
                const tTalk = (now - this.talkStart) % 680;
                const cycle = tTalk / 680;
                if (cycle < 0.28) {
                    targetMouth = Math.sin((cycle / 0.28) * Math.PI);
                } else if (cycle < 0.36) {
                    targetMouth = 0.14;
                } else if (cycle < 0.68) {
                    targetMouth = Math.sin(((cycle - 0.36) / 0.32) * Math.PI) * 0.94;
                } else if (cycle < 0.76) {
                    targetMouth = 0.1;
                } else {
                    targetMouth = Math.sin(((cycle - 0.76) / 0.24) * Math.PI) * 0.78;
                }
                if (this.inWhisperAside) {
                    targetMouth *= 0.55;
                }
                this.talkVowelPhase = Math.sin((now - this.talkStart) * 0.013);
            }
        }
        this.mouthOpen += (targetMouth - this.mouthOpen) * Math.min(1, dt * 18);

        if (!this.isEnabled) return;

        // 無滑鼠操作時給予柔和自動微動
        let goalX = this.targetLookX;
        let goalY = this.targetLookY;
        if (now - this.lastPointerMoveTime > 2600) {
            const idleT = now * 0.001;
            goalX = Math.sin(idleT * 0.65) * 0.28;
            goalY = Math.cos(idleT * 0.48) * 0.18;
        }

        const lookLerp = Math.min(1, dt * 4.5);
        this.lookX += (goalX - this.lookX) * lookLerp;
        this.lookY += (goalY - this.lookY) * lookLerp;

        // 表情對應目標耳姿
        const targetEarL =
            this.exprWeights.joy * 0.055 -
            this.exprWeights.blush * 0.045 -
            this.exprWeights.sad * 0.075 +
            this.exprWeights.pout * 0.025;
        const targetEarR = -targetEarL;

        // 彈簧積分輔助
        const stepSpring = (pos, vel, target, stiffness, damping) => {
            const force = (target - pos) * stiffness;
            const nextVel = (vel + force * dt) * Math.exp(-damping * dt);
            const nextPos = pos + nextVel * dt;
            return [nextPos, nextVel];
        };

        [this.earAngleL, this.earVelL] = stepSpring(this.earAngleL, this.earVelL, targetEarL, 140, 11);
        [this.earAngleR, this.earVelR] = stepSpring(this.earAngleR, this.earVelR, targetEarR, 140, 11);
        [this.bounceY, this.bounceVel] = stepSpring(this.bounceY, this.bounceVel, 0, 160, 12);
        [this.headTiltExtra, this.headTiltVel] = stepSpring(this.headTiltExtra, this.headTiltVel, 0, 120, 10);

        const hairTarget = this.lookX * 0.012 + Math.sin(now * 0.0018) * 0.004;
        [this.hairSway, this.hairVel] = stepSpring(this.hairSway, this.hairVel, hairTarget, 55, 6);
    }

    // 計算標準化網格點 (u, v) 的 2.5D 變形位移 (dx, dy)
    deformPoint(u, v, now = null) {
        if (!this.isEnabled) {
            return { dx: 0, dy: 0, u, v, headAngle: 0 };
        }

        const timeSec = (now !== null ? now : (typeof performance !== 'undefined' ? performance.now() : Date.now())) * 0.001;
        const rig = this.rig || {};
        const headCenter = rig.headCenter || { u: 0.5, v: 0.32 };
        const neckPivot = rig.neckPivot || { u: 0.5, v: 0.45 };
        const chestCenter = rig.chestCenter || { u: 0.5, v: 0.58 };

        // 底部鎖定 (v >= 0.95 平滑收斂到 0，v = 1 時嚴格為 0)
        let bottomLock = 1;
        if (v >= 0.95) {
            const t = Math.max(0, Math.min(1, (1 - v) / 0.05));
            bottomLock = t * t * (3 - 2 * t);
        }
        if (bottomLock === 0) {
            return { dx: 0, dy: 0, u, v, headAngle: 0 };
        }

        // 1. 分區呼吸 (依情緒微調呼吸速度與幅度)
        const breathSpeed = 1.75 - this.exprWeights.sad * 0.35 + this.exprWeights.joy * 0.18;
        const breathAmp = 1.0 - this.exprWeights.sad * 0.22 + this.exprWeights.joy * 0.12;
        const chestWave = Math.pow(0.5 + 0.5 * Math.sin(timeSec * breathSpeed), 1.4) - 0.5;
        const headWave = Math.pow(0.5 + 0.5 * Math.sin(timeSec * breathSpeed - 0.38), 1.4) - 0.5;

        const chestMask = Math.exp(-Math.pow((v - chestCenter.v) / 0.22, 2)) * Math.exp(-Math.pow((u - chestCenter.u) / 0.30, 2));
        const headMask = v <= 0.48 ? Math.max(0, Math.min(1, (0.48 - v) / 0.12)) : 0;
        const torsoMask = v < 0.95 ? Math.max(0, Math.min(1, (0.95 - v) / 0.45)) : 0;

        let dx = 0;
        let dy = 0;

        // 胸口起伏與橫向擴張
        dy += -chestWave * 0.0055 * breathAmp * chestMask;
        dx += (u - chestCenter.u) * chestWave * 0.012 * breathAmp * chestMask;

        // 頭部次級呼吸浮動 + 情緒彈跳/微低頭
        const exprPostureY =
            this.exprWeights.blush * 0.0035 +
            this.exprWeights.sad * 0.0065 -
            this.exprWeights.joy * 0.0025;
        dy += (-headWave * 0.0045 * breathAmp + this.bounceY + exprPostureY) * headMask;
        dy += this.bounceY * 0.35 * torsoMask * (1 - headMask);

        // 2. 2.5D 轉頭與視線跟隨
        const headAngle =
            this.lookX * 0.026 +
            this.headTiltExtra +
            Math.sin(timeSec * 0.8) * 0.005 +
            this.exprWeights.blush * -0.022 +
            this.exprWeights.sad * -0.018;

        // 上半身輕度跟隨
        dx += this.lookX * 0.005 * torsoMask * (1 - headMask);

        if (headMask > 0) {
            // 臉部中心球面視差 (模擬 2.5D 轉頭立體感)
            const distFace = Math.hypot((u - headCenter.u) * 1.15, v - headCenter.v);
            const faceSphere = Math.exp(-Math.pow(distFace / 0.16, 2));
            dx += this.lookX * 0.011 * faceSphere;
            dy += this.lookY * 0.008 * faceSphere;

            // 頭部繞頸部支點旋轉
            const relX = u - neckPivot.u;
            const relY = (v - neckPivot.v) * (this.nativeHeight / this.nativeWidth);
            const cosA = Math.cos(headAngle * headMask);
            const sinA = Math.sin(headAngle * headMask);
            const rotX = relX * cosA - relY * sinA;
            const rotY = relX * sinA + relY * cosA;
            dx += (rotX - relX);
            dy += (rotY - relY) * (this.nativeWidth / this.nativeHeight);
        }

        // 3. 雙馬耳獨立物理擺動
        const applyEarDeform = (earCfg, angle) => {
            if (!earCfg || Math.abs(angle) < 1e-5) return;
            const dist = Math.hypot((u - earCfg.u) * 1.2, v - earCfg.v);
            const w = Math.exp(-Math.pow(dist / (earCfg.radius || 0.08), 2));
            if (w < 0.01) return;
            const rx = u - earCfg.pivotU;
            const ry = (v - earCfg.pivotV) * (this.nativeHeight / this.nativeWidth);
            const c = Math.cos(angle * w);
            const s = Math.sin(angle * w);
            dx += (rx * c - ry * s - rx);
            dy += ((rx * s + ry * c - ry) * (this.nativeWidth / this.nativeHeight));
        };
        applyEarDeform(rig.leftEar, this.earAngleL);
        applyEarDeform(rig.rightEar, this.earAngleR);

        // 4. 雙馬尾阻尼擺動 (僅作用於外側雙馬尾，避開中間身軀)
        const applyHairDeform = (hairCfg, phaseOffset) => {
            if (!hairCfg) return;
            const inTailX = hairCfg.side === 'left'
                ? u < (hairCfg.innerEdgeU ?? 0.34)
                : u > (hairCfg.innerEdgeU ?? 0.66);
            if (!inTailX || v < (hairCfg.pivotV - 0.04)) return;

            const span = Math.max(0.001, (hairCfg.tipV ?? 0.88) - hairCfg.pivotV);
            const progress = Math.max(0, Math.min(1.2, (v - hairCfg.pivotV) / span));
            const edgeFade = hairCfg.side === 'left'
                ? Math.min(1, ((hairCfg.innerEdgeU ?? 0.34) - u) / 0.07)
                : Math.min(1, (u - (hairCfg.innerEdgeU ?? 0.66)) / 0.07);
            const breeze = Math.sin(timeSec * 2.1 + progress * 2.4 + phaseOffset) * 0.0045;
            const sway = (this.hairSway + breeze) * Math.pow(progress, 1.35) * edgeFade;
            dx += sway;
            dy += Math.abs(sway) * 0.15;
        };
        applyHairDeform(rig.leftHair, 0);
        applyHairDeform(rig.rightHair, 0.9);

        // 5. 氣鼓鼓 (pout) 臉頰微膨脹網格變形
        if (this.exprWeights.pout > 0.02 && rig.cheeks) {
            const pW = this.exprWeights.pout;
            [rig.cheeks.left, rig.cheeks.right].forEach((ck, idx) => {
                if (!ck) return;
                const d = Math.hypot((u - ck.u) * 1.1, v - ck.v);
                const puff = Math.exp(-Math.pow(d / 0.05, 2));
                const dir = idx === 0 ? -1 : 1;
                dx += dir * 0.0045 * pW * puff;
                dy += 0.0015 * pW * puff;
            });
        }

        dx *= bottomLock;
        dy *= bottomLock;

        return {
            dx,
            dy,
            u: u + dx,
            v: v + dy,
            headAngle: headAngle * headMask
        };
    }

    renderFrame(now) {
        const curImg = this.loadImage(this.activeSrc);
        const prevImg = this.loadImage(this.prevSrc || this.activeSrc);
        if (!curImg || !curImg.complete || curImg.naturalWidth === 0) return;

        if (this.useWebGL && this.gl) {
            this.renderWebGL(curImg, prevImg, now);
        } else if (this.ctx2d) {
            this.renderCanvas2D(curImg, prevImg, now);
        }

        this.renderOverlay(now);
    }

    renderWebGL(curImg, prevImg, now) {
        const gl = this.gl;
        const buf = this.glBuffers;
        if (!gl || !buf) return;

        const texB = this.getOrCreateTexture(this.activeSrc, curImg);
        if (!texB) {
            // 已自動降級到 Canvas 2D
            if (this.ctx2d) this.renderCanvas2D(curImg, prevImg, now);
            return;
        }
        const texA = (prevImg && prevImg.complete && prevImg.naturalWidth > 0)
            ? (this.getOrCreateTexture(this.prevSrc || this.activeSrc, prevImg) || texB)
            : texB;

        const cols = this.glCols;
        const rows = this.glRows;
        let ptr = 0;
        for (let r = 0; r <= rows; r++) {
            const v = r / rows;
            for (let c = 0; c <= cols; c++) {
                const u = c / cols;
                const def = this.deformPoint(u, v, now);
                buf.posArray[ptr] = def.u * 2 - 1;
                buf.posArray[ptr + 1] = 1 - def.v * 2;
                ptr += 2;
            }
        }

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(this.glProgram);

        gl.bindBuffer(gl.ARRAY_BUFFER, buf.posBuf);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, buf.posArray);
        gl.enableVertexAttribArray(buf.aPos);
        gl.vertexAttribPointer(buf.aPos, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, buf.uvBuf);
        gl.enableVertexAttribArray(buf.aUv);
        gl.vertexAttribPointer(buf.aUv, 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texA);
        gl.uniform1i(buf.uTexA, 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texB);
        gl.uniform1i(buf.uTexB, 1);

        gl.uniform1f(buf.uMix, this.crossfadeProgress);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf.idxBuf);
        gl.drawElements(gl.TRIANGLES, buf.indexCount, gl.UNSIGNED_SHORT, 0);
    }

    renderCanvas2D(curImg, prevImg, now) {
        const ctx = this.ctx2d;
        if (!ctx) return;

        const w = this.nativeWidth;
        const h = this.nativeHeight;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, w, h);

        if (!this.isEnabled) {
            ctx.drawImage(curImg, 0, 0, w, h);
            return;
        }

        const cols = this.c2dCols;
        const rows = this.c2dRows;
        const grid = new Array((rows + 1) * (cols + 1));
        for (let r = 0; r <= rows; r++) {
            const v = r / rows;
            for (let c = 0; c <= cols; c++) {
                const u = c / cols;
                const def = this.deformPoint(u, v, now);
                grid[r * (cols + 1) + c] = {
                    sx: u * curImg.naturalWidth,
                    sy: v * curImg.naturalHeight,
                    dx: def.u * w,
                    dy: def.v * h
                };
            }
        }

        const drawMeshForImg = (img, alpha) => {
            if (!img || alpha <= 0.01) return;
            const scaleX = img.naturalWidth / w;
            const scaleY = img.naturalHeight / h;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const p0 = grid[r * (cols + 1) + c];
                    const p1 = grid[r * (cols + 1) + c + 1];
                    const p2 = grid[(r + 1) * (cols + 1) + c];
                    const p3 = grid[(r + 1) * (cols + 1) + c + 1];

                    this.drawTexturedTriangle(ctx, img, p0, p2, p1, scaleX, scaleY, alpha);
                    this.drawTexturedTriangle(ctx, img, p1, p2, p3, scaleX, scaleY, alpha);
                }
            }
        };

        if (this.crossfadeProgress < 1 && prevImg && prevImg !== curImg && prevImg.complete && prevImg.naturalWidth > 0) {
            drawMeshForImg(prevImg, 1 - this.crossfadeProgress);
            drawMeshForImg(curImg, this.crossfadeProgress);
        } else {
            drawMeshForImg(curImg, 1);
        }

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = 1;
    }

    drawTexturedTriangle(ctx, img, p0, p1, p2, scaleX, scaleY, alpha) {
        const sx0 = p0.sx * (img.naturalWidth ? 1 : scaleX);
        const sy0 = p0.sy * (img.naturalHeight ? 1 : scaleY);
        const sx1 = p1.sx;
        const sy1 = p1.sy;
        const sx2 = p2.sx;
        const sy2 = p2.sy;

        const cx = (p0.dx + p1.dx + p2.dx) / 3;
        const cy = (p0.dy + p1.dy + p2.dy) / 3;
        const expand = (p) => {
            const vx = p.dx - cx;
            const vy = p.dy - cy;
            const len = Math.hypot(vx, vy) || 1;
            return { x: p.dx + (vx / len) * 0.65, y: p.dy + (vy / len) * 0.65 };
        };

        const e0 = expand(p0);
        const e1 = expand(p1);
        const e2 = expand(p2);

        const u1 = sx1 - sx0;
        const v1 = sy1 - sy0;
        const u2 = sx2 - sx0;
        const v2 = sy2 - sy0;
        const det = u1 * v2 - u2 * v1;
        if (Math.abs(det) < 1e-5) return;

        const x0 = p0.dx, y0 = p0.dy;
        const x1 = p1.dx, y1 = p1.dy;
        const x2 = p2.dx, y2 = p2.dy;

        const a = ((x1 - x0) * v2 - (x2 - x0) * v1) / det;
        const b = ((y1 - y0) * v2 - (y2 - y0) * v1) / det;
        const c = ((x2 - x0) * u1 - (x1 - x0) * u2) / det;
        const d = ((y2 - y0) * u1 - (y1 - y0) * u2) / det;
        const e = x0 - a * sx0 - c * sy0;
        const f = y0 - b * sx0 - d * sy0;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(e0.x, e0.y);
        ctx.lineTo(e1.x, e1.y);
        ctx.lineTo(e2.x, e2.y);
        ctx.closePath();
        ctx.clip();
        ctx.setTransform(a, b, c, d, e, f);
        ctx.drawImage(img, 0, 0);
        ctx.restore();
    }

    // 繪製同步對位臉部圖層：程式化 5 表情、眨眼、說話對嘴
    renderOverlay(now) {
        const ctx = this.overlayCtx;
        const rig = this.rig;
        if (!ctx || !rig) return;

        const w = this.nativeWidth;
        const h = this.nativeHeight;
        ctx.clearRect(0, 0, w, h);

        // 若未來替換為獨立表情 PNG（圖片不同於 baseSrc），減低重複靜態臉部蓋繪
        const hasDedicatedExprSprite = Boolean(this.activeSrc && this.baseSrc && this.activeSrc !== this.baseSrc);
        const procExprScale = hasDedicatedExprSprite ? 0 : 1;

        const wBlush = this.exprWeights.blush * procExprScale;
        const wJoy = this.exprWeights.joy * procExprScale;
        const wSad = this.exprWeights.sad * procExprScale;
        const wPout = this.exprWeights.pout * procExprScale;

        const pt = (u, v) => {
            const def = this.deformPoint(u, v, now);
            return { x: def.u * w, y: def.v * h, angle: def.headAngle };
        };

        // 1. 憂鬱額頭輕陰影 (sad)
        if (wSad > 0.03 && rig.headCenter) {
            const hc = pt(rig.headCenter.u, rig.headCenter.v - 0.02);
            ctx.save();
            ctx.translate(hc.x, hc.y);
            ctx.rotate(hc.angle);
            const rForehead = w * 0.13;
            const grad = ctx.createLinearGradient(0, -rForehead, 0, rForehead * 0.45);
            grad.addColorStop(0, `rgba(42, 56, 94, ${0.14 * wSad})`);
            grad.addColorStop(1, 'rgba(42, 56, 94, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.ellipse(0, -rForehead * 0.25, rForehead * 0.9, rForehead * 0.75, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // 2. 臉頰情緒處理 (blush 紅暈斜線 / joy 暖紅暈 / pout 微紅鼓頰)
        if (rig.cheeks) {
            const leftCk = pt(rig.cheeks.left.u, rig.cheeks.left.v);
            const rightCk = pt(rig.cheeks.right.u, rig.cheeks.right.v);
            const blushAlpha = Math.min(1, wBlush * 0.85 + wJoy * 0.35 + wPout * 0.45);

            if (blushAlpha > 0.03) {
                [leftCk, rightCk].forEach((ck) => {
                    ctx.save();
                    ctx.translate(ck.x, ck.y);
                    ctx.rotate(ck.angle);
                    const rx = w * 0.044;
                    const ry = h * 0.022;
                    const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, rx);
                    grad.addColorStop(0, `rgba(255, 105, 130, ${0.46 * blushAlpha})`);
                    grad.addColorStop(0.6, `rgba(255, 125, 145, ${0.24 * blushAlpha})`);
                    grad.addColorStop(1, 'rgba(255, 125, 145, 0)');
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
                    ctx.fill();

                    // blush 細緻斜線 (////)
                    if (wBlush > 0.08) {
                        ctx.strokeStyle = `rgba(232, 74, 105, ${0.55 * wBlush})`;
                        ctx.lineWidth = 2.0;
                        ctx.lineCap = 'round';
                        for (let s = -2; s <= 2; s++) {
                            const sx = s * 7.5;
                            ctx.beginPath();
                            ctx.moveTo(sx - 3, 5);
                            ctx.lineTo(sx + 4, -6);
                            ctx.stroke();
                        }
                    }

                    // pout 腮幫子柔和高光
                    if (wPout > 0.08) {
                        ctx.fillStyle = `rgba(255, 224, 218, ${0.32 * wPout})`;
                        ctx.beginPath();
                        ctx.ellipse(0, 2, rx * 0.48, ry * 0.45, 0, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    ctx.restore();
                });
            }

            // 鼻樑微紅暈 (blush)：寬扁柔和橫向暈染，避免鼻尖一點紅斑
            if (wBlush > 0.1) {
                const nose = pt(0.5, 0.358);
                const noseRx = w * 0.042;
                const noseRy = h * 0.011;
                ctx.save();
                ctx.translate(nose.x, nose.y);
                ctx.rotate(nose.angle);
                ctx.scale(noseRx, noseRy);
                const gNose = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
                gNose.addColorStop(0, `rgba(255, 118, 140, ${0.16 * wBlush})`);
                gNose.addColorStop(0.65, `rgba(255, 125, 145, ${0.07 * wBlush})`);
                gNose.addColorStop(1, 'rgba(255, 125, 145, 0)');
                ctx.fillStyle = gNose;
                ctx.beginPath();
                ctx.arc(0, 0, 1, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        // 3. 眼部情緒高光、哭泣淚光、眉線微調與自動眨眼
        if (rig.eyes) {
            [rig.eyes.left, rig.eyes.right].forEach((eye, idx) => {
                if (!eye) return;
                const ep = pt(eye.u, eye.v);
                const rx = eye.rx * w;
                const ry = eye.ry * h;
                const isLeft = idx === 0;

                ctx.save();
                ctx.translate(ep.x, ep.y);
                ctx.rotate(ep.angle);

                // joy：眼中閃亮星星高光（未閉眼時顯示）
                if (wJoy > 0.06 && this.blinkAmount < 0.65) {
                    const starAlpha = wJoy * (1 - this.blinkAmount * 1.4);
                    if (starAlpha > 0.02) {
                        this.drawSparkleStar(ctx, -rx * 0.28, -ry * 0.25, rx * 0.2, `rgba(255, 255, 255, ${0.88 * starAlpha})`);
                        this.drawSparkleStar(ctx, rx * 0.26, ry * 0.28, rx * 0.13, `rgba(255, 240, 248, ${0.78 * starAlpha})`);
                    }
                }

                // sad：下眼瞼濕潤淚光
                if (wSad > 0.06 && this.blinkAmount < 0.75) {
                    const shimmer = 0.8 + 0.2 * Math.sin(now * 0.006 + idx);
                    const tearGrad = ctx.createLinearGradient(0, ry * 0.35, 0, ry * 1.05);
                    tearGrad.addColorStop(0, `rgba(220, 242, 255, 0)`);
                    tearGrad.addColorStop(0.55, `rgba(235, 248, 255, ${0.65 * wSad * shimmer})`);
                    tearGrad.addColorStop(1, `rgba(255, 255, 255, ${0.85 * wSad * shimmer})`);
                    ctx.fillStyle = tearGrad;
                    ctx.beginPath();
                    ctx.ellipse(0, ry * 0.72, rx * 0.65, ry * 0.34, 0, 0, Math.PI * 2);
                    ctx.fill();

                    // 小顆晶亮水珠高光
                    ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * wSad * shimmer})`;
                    ctx.beginPath();
                    ctx.arc((isLeft ? -1 : 1) * rx * 0.32, ry * 0.78, 2.3, 0, Math.PI * 2);
                    ctx.fill();
                }

                // 細緻內側眉線情緒提示（避開劉海主體，只強化眉頭局部表達）
                if (wSad > 0.12) {
                    ctx.strokeStyle = `rgba(92, 34, 24, ${0.68 * wSad})`;
                    ctx.lineWidth = 2.6;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    if (isLeft) {
                        ctx.moveTo(rx * 0.25, -ry * 1.38);
                        ctx.quadraticCurveTo(rx * 0.55, -ry * 1.5, rx * 0.82, -ry * 1.72);
                    } else {
                        ctx.moveTo(-rx * 0.25, -ry * 1.38);
                        ctx.quadraticCurveTo(-rx * 0.55, -ry * 1.5, -rx * 0.82, -ry * 1.72);
                    }
                    ctx.stroke();
                } else if (wPout > 0.12) {
                    ctx.strokeStyle = `rgba(80, 26, 18, ${0.78 * wPout})`;
                    ctx.lineWidth = 3.0;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    if (isLeft) {
                        ctx.moveTo(rx * 0.15, -ry * 1.6);
                        ctx.lineTo(rx * 0.78, -ry * 1.28);
                    } else {
                        ctx.moveTo(-rx * 0.15, -ry * 1.6);
                        ctx.lineTo(-rx * 0.78, -ry * 1.28);
                    }
                    ctx.stroke();
                }

                // 動態眨眼眼瞼
                if (this.blinkEnabled && this.blinkAmount > 0.04) {
                    this.drawEyelid(ctx, rx, ry, this.blinkAmount, rig.eyes);
                }

                ctx.restore();
            });
        }

        // 4. 嘴部處理：統一遮罩、平滑淡入淡出、開懷笑無縫銜接說話嘴型
        if (rig.mouth) {
            const mp = pt(rig.mouth.u, rig.mouth.v);
            const mCfg = rig.mouth;
            const rx = mCfg.rx * w;
            const ry = mCfg.ry * h;

            ctx.save();
            ctx.translate(mp.x, mp.y);
            ctx.rotate(mp.angle);

            const talkBlend = this.mouthEnabled ? Math.max(0, Math.min(1, (this.mouthOpen - 0.015) / 0.11)) : 0;
            const joyFloor = procExprScale * wJoy * 0.52;
            const openAmount = this.mouthEnabled ? Math.max(this.mouthOpen, joyFloor) : joyFloor;
            const openBlend = Math.max(talkBlend, procExprScale * wJoy);

            const staticPout = procExprScale * wPout * (1 - talkBlend);
            const staticSad = procExprScale * wSad * (1 - talkBlend);
            const staticBlush = procExprScale * wBlush * (1 - talkBlend);

            const coverAlpha = Math.min(1, Math.max(openBlend, staticPout, staticSad, staticBlush));
            if (coverAlpha > 0.01) {
                this.coverBaseMouth(ctx, rx, ry, mCfg.skinColor || '#fee2ca', coverAlpha, mCfg, w, h);
            }

            if (openBlend > 0.01 && openAmount > 0.015) {
                this.drawTalkingMouth(ctx, rx, ry, openAmount, mCfg, { wBlush, wJoy, wSad, wPout }, openBlend, true);
            }

            if (staticPout > 0.04) {
                this.drawPoutMouth(ctx, rx, ry, staticPout, mCfg, true);
            } else if (staticSad > 0.04) {
                this.drawSadMouth(ctx, rx, ry, staticSad, mCfg, true);
            } else if (staticBlush > 0.04) {
                this.drawBlushMouth(ctx, rx, ry, staticBlush, mCfg, true);
            }

            ctx.restore();
        }
    }

    drawSparkleStar(ctx, x, y, r, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.quadraticCurveTo(0, 0, 0, r);
        ctx.quadraticCurveTo(0, 0, -r, 0);
        ctx.quadraticCurveTo(0, 0, 0, -r);
        ctx.fill();
        ctx.restore();
    }

    drawEyelid(ctx, rx, ry, t, eyesCfg) {
        const skinColor = eyesCfg.skinColor || '#fee3cb';
        const lidShadow = eyesCfg.lidShadow || '#efc3b7';
        const lashColor = eyesCfg.lashColor || '#1f0e0d';
        const topY = -ry;
        const drop = ry * 2 * t;

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.clip();

        const grad = ctx.createLinearGradient(0, topY, 0, topY + drop);
        grad.addColorStop(0, lidShadow);
        grad.addColorStop(0.35, skinColor);
        grad.addColorStop(1, skinColor);
        ctx.fillStyle = grad;
        ctx.fillRect(-rx - 2, topY - 2, rx * 2 + 4, drop + 2);

        const lashY = topY + drop;
        ctx.beginPath();
        ctx.moveTo(-rx * 1.05, lashY - 1);
        const curveDrop = (1 - t) * 3.5;
        ctx.quadraticCurveTo(0, lashY + curveDrop, rx * 1.05, lashY - 1);
        ctx.strokeStyle = lashColor;
        ctx.lineWidth = eyesCfg.lashThickness || 5.2;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
    }

    coverBaseMouth(ctx, rx, ry, skinColor, alpha = 1, cfg = {}, w = this.nativeWidth, h = this.nativeHeight) {
        if (alpha <= 0.01) return;
        const coverRx = cfg.coverRx ? cfg.coverRx * w : Math.max(rx * 1.95, 24.5);
        const coverRy = cfg.coverRy ? cfg.coverRy * h : Math.max(ry * 0.98, 10.5);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(0, 1.0);
        ctx.scale(coverRx, coverRy);
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
        grad.addColorStop(0, skinColor);
        grad.addColorStop(0.78, skinColor);
        grad.addColorStop(1, 'rgba(254, 226, 202, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawTalkingMouth(ctx, baseRx, baseRy, openRatio, cfg, weights, alpha = 1, skipCover = false) {
        const skinColor = cfg.skinColor || '#fee2ca';
        const lipColor = cfg.lipColor || '#5e2b24';
        const lowerLipColor = cfg.lowerLipColor || 'rgba(155, 76, 74, 0.42)';
        const cavityDark = cfg.cavityDark || '#7a2633';
        const cavityMid = cfg.cavityMid || '#c75264';
        const cavityLight = cfg.cavityLight || '#ea808e';
        const tongueColor = cfg.tongueColor || '#ef8896';

        if (!skipCover) {
            this.coverBaseMouth(ctx, baseRx, baseRy, skinColor, alpha, cfg);
        }

        const normalW = Math.max(0, 1 - weights.wJoy - weights.wPout - weights.wSad - weights.wBlush);
        const smileFactor = weights.wJoy * 1.0 + normalW * 0.35 - weights.wBlush * 0.05 - weights.wPout * 0.45 - weights.wSad * 0.65;
        const vowelMod = this.isTalking ? this.talkVowelPhase * 0.08 : 0;
        const widthScale = Math.max(0.62, (1.02 - openRatio * 0.14 + vowelMod) + weights.wJoy * 0.18 - weights.wPout * 0.22 - weights.wBlush * 0.16 - weights.wSad * 0.14);
        const heightScale = Math.max(0.55, 0.94 + weights.wJoy * 0.22 - weights.wPout * 0.28 - weights.wSad * 0.22 - weights.wBlush * 0.16);

        const rx = baseRx * widthScale;
        const openH = baseRy * openRatio * heightScale;
        const cornerY = 0.6 - smileFactor * 1.6;
        const upperCtrlY = cornerY + (smileFactor >= 0 ? 1.0 + smileFactor * 1.5 : -0.8 + smileFactor * 1.2);

        const traceCavity = () => {
            ctx.beginPath();
            ctx.moveTo(-rx, cornerY);
            ctx.quadraticCurveTo(0, upperCtrlY, rx, cornerY);
            ctx.bezierCurveTo(
                rx * 0.82, cornerY + openH * 1.28,
                -rx * 0.82, cornerY + openH * 1.28,
                -rx, cornerY
            );
            ctx.closePath();
        };

        // 1. 口腔填充與裁切內部的牙齒與舌頭
        ctx.save();
        ctx.globalAlpha = alpha;
        traceCavity();

        ctx.save();
        ctx.clip();
        const cavityGrad = ctx.createLinearGradient(0, cornerY - 2, 0, cornerY + openH * 1.1);
        cavityGrad.addColorStop(0, cavityDark);
        cavityGrad.addColorStop(0.5, cavityMid);
        cavityGrad.addColorStop(1, cavityLight);
        ctx.fillStyle = cavityGrad;
        ctx.fill();

        const teethAlpha = Math.max(0, Math.min(1, (openRatio - 0.18) / 0.28));
        if (teethAlpha > 0.02) {
            ctx.save();
            ctx.globalAlpha = alpha * 0.92 * teethAlpha;
            ctx.beginPath();
            ctx.moveTo(-rx * 0.85, cornerY - 2);
            ctx.lineTo(rx * 0.85, cornerY - 2);
            ctx.lineTo(rx * 0.72, cornerY + openH * 0.18);
            ctx.quadraticCurveTo(0, upperCtrlY + openH * 0.24, -rx * 0.72, cornerY + openH * 0.18);
            ctx.closePath();
            ctx.fillStyle = '#fffaf8';
            ctx.fill();
            ctx.restore();
        }

        const tongueAlpha = Math.max(0, Math.min(1, (openRatio - 0.28) / 0.32));
        if (tongueAlpha > 0.02) {
            ctx.save();
            ctx.globalAlpha = alpha * 0.9 * tongueAlpha;
            ctx.beginPath();
            ctx.ellipse(0, cornerY + openH * 0.82, rx * 0.62, openH * 0.42, 0, 0, Math.PI * 2);
            ctx.fillStyle = tongueColor;
            ctx.fill();
            ctx.restore();
        }
        ctx.restore();

        // 2. 精緻動漫唇線（下唇柔淡輪廓 + 上唇細膩實線 + 唇下淡陰影，各自重設 beginPath）
        ctx.beginPath();
        ctx.moveTo(rx * 0.9, cornerY + openH * 0.15);
        ctx.bezierCurveTo(
            rx * 0.72, cornerY + openH * 1.24,
            -rx * 0.72, cornerY + openH * 1.24,
            -rx * 0.9, cornerY + openH * 0.15
        );
        ctx.strokeStyle = lowerLipColor;
        ctx.lineWidth = 1.1;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-rx, cornerY);
        ctx.quadraticCurveTo(0, upperCtrlY, rx, cornerY);
        ctx.strokeStyle = lipColor;
        ctx.lineWidth = 1.65;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-rx * 0.28, cornerY + openH * 1.06 + 2.2);
        ctx.quadraticCurveTo(0, cornerY + openH * 1.06 + 3.2, rx * 0.28, cornerY + openH * 1.06 + 2.2);
        ctx.strokeStyle = 'rgba(214, 146, 134, 0.36)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.restore();
    }

    drawJoyMouth(ctx, rx, ry, weight, cfg, skipCover = false) {
        this.drawTalkingMouth(
            ctx,
            rx,
            ry,
            0.54,
            cfg,
            { wBlush: 0, wJoy: 1, wSad: 0, wPout: 0 },
            weight,
            skipCover
        );
    }

    drawPoutMouth(ctx, rx, ry, weight, cfg, skipCover = false) {
        const skinColor = cfg.skinColor || '#fee2ca';
        const lipColor = cfg.lipColor || '#5e2b24';
        if (!skipCover) {
            this.coverBaseMouth(ctx, rx, ry, skinColor, weight, cfg);
        }

        ctx.save();
        ctx.globalAlpha = weight;
        ctx.strokeStyle = lipColor;
        ctx.lineWidth = 1.9;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-rx * 0.78, 1.8);
        ctx.quadraticCurveTo(-rx * 0.12, -2.6, rx * 0.78, 1.2);
        ctx.stroke();

        // 唇下微弱陰影點
        ctx.strokeStyle = 'rgba(204, 123, 130, 0.45)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-rx * 0.25, 5.2);
        ctx.quadraticCurveTo(0, 6.2, rx * 0.25, 5.2);
        ctx.stroke();
        ctx.restore();
    }

    drawSadMouth(ctx, rx, ry, weight, cfg, skipCover = false) {
        const skinColor = cfg.skinColor || '#fee2ca';
        const lipColor = cfg.lipColor || '#5e2b24';
        if (!skipCover) {
            this.coverBaseMouth(ctx, rx, ry, skinColor, weight, cfg);
        }

        ctx.save();
        ctx.globalAlpha = weight;
        ctx.strokeStyle = lipColor;
        ctx.lineWidth = 1.75;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-rx * 0.82, 2.0);
        ctx.quadraticCurveTo(0, -1.8, rx * 0.82, 2.0);
        ctx.stroke();
        ctx.restore();
    }

    drawBlushMouth(ctx, rx, ry, weight, cfg, skipCover = false) {
        const skinColor = cfg.skinColor || '#fee2ca';
        const lipColor = cfg.lipColor || '#5e2b24';
        if (!skipCover) {
            this.coverBaseMouth(ctx, rx, ry, skinColor, weight, cfg);
        }

        ctx.save();
        ctx.globalAlpha = weight;
        // 害羞微抿猶豫波浪線 + 極淡櫻色唇隙
        const mw = rx * 0.72;
        ctx.beginPath();
        ctx.ellipse(0, 1.2, mw * 0.48, ry * 0.16, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(218, 92, 108, 0.35)';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-mw, 1.2);
        ctx.quadraticCurveTo(-mw * 0.38, -0.4, 0, 1.2);
        ctx.quadraticCurveTo(mw * 0.38, 2.5, mw, 0.8);
        ctx.strokeStyle = lipColor;
        ctx.lineWidth = 1.65;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
    }
}

// 匯出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LivePortraitManager };
}
