// ============================================
// 角色動態嘴部說話管理器 (Mouth Flap & Lip Sync Manager)
// ============================================

class MouthManager {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.wrapper = null;
        this.currentCharacter = null;
        this.currentExpression = 'normal';
        this.isEnabled = true;
        this.isTalking = false;
        this.animFrameId = null;
        this.startTime = 0;
        this.currentOpen = 0;

        // 角色嘴部座標設定 (百分比 relative to avatar image)
        this.characterMouthCoords = {
            daiwa_scarlet: {
                normal: {
                    x: 0.510,
                    y: 0.642,
                    rx: 0.026,
                    ry: 0.021,
                    skinColor: '#feece9',
                    lipColor: '#542521',
                    cavityDark: '#5a1920',
                    cavityLight: '#c44b58',
                    teethColor: '#ffffff',
                    tongueColor: '#df6675'
                },
                blush: {
                    x: 0.510,
                    y: 0.644,
                    rx: 0.026,
                    ry: 0.021,
                    skinColor: '#fbe7e3',
                    lipColor: '#542521',
                    cavityDark: '#5a1920',
                    cavityLight: '#c44b58',
                    teethColor: '#ffffff',
                    tongueColor: '#df6675'
                }
            }
        };

        this.loadSettings();
        this.init();
    }

    getConfig() {
        if (!this.currentCharacter) return null;
        const charData = this.characterMouthCoords[this.currentCharacter];
        if (!charData) return null;
        if (charData[this.currentExpression]) return charData[this.currentExpression];
        if (charData.normal) return charData.normal;
        return charData;
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('umamusume_mouth_enabled');
            if (saved !== null) {
                this.isEnabled = saved === 'true';
            }
        } catch (e) {
            console.warn('載入嘴部動態設定失敗:', e);
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('umamusume_mouth_enabled', this.isEnabled ? 'true' : 'false');
        } catch (e) {
            console.warn('儲存嘴部動態設定失敗:', e);
        }
    }

    setEnabled(enabled) {
        this.isEnabled = enabled;
        this.saveSettings();
        if (!this.isEnabled) {
            this.stopTalking();
        }
    }

    init() {
        this.wrapper = document.getElementById('dialogue-avatar-wrapper');
        if (this.wrapper) {
            this.canvas = document.getElementById('avatar-mouth-canvas');
            if (!this.canvas) {
                this.canvas = document.createElement('canvas');
                this.canvas.id = 'avatar-mouth-canvas';
                this.canvas.className = 'avatar-mouth-canvas';
                this.wrapper.appendChild(this.canvas);
            }
            this.ctx = this.canvas.getContext('2d');
            this.syncCanvasSize();
        }

        window.addEventListener('resize', () => this.syncCanvasSize());
    }

    syncCanvasSize() {
        if (!this.canvas || !this.wrapper) return;
        const rect = this.wrapper.getBoundingClientRect();
        const size = Math.round(rect.width || this.wrapper.offsetWidth || 140);
        if (size > 0 && (this.canvas.width !== size || this.canvas.height !== size)) {
            this.canvas.width = size;
            this.canvas.height = size;
        }
    }

    onCharacterChange(characterId, expression = 'normal') {
        this.currentCharacter = characterId;
        this.currentExpression = expression;
        this.stopTalking();
        this.syncCanvasSize();
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    // 開始說話嘴部張合
    startTalking() {
        if (!this.isEnabled || !this.currentCharacter) return;
        const config = this.getConfig();
        if (!config || !this.ctx || !this.canvas) return;

        this.syncCanvasSize();
        if (this.isTalking) return;
        this.isTalking = true;
        this.startTime = performance.now();

        const animate = (currentTime) => {
            if (!this.isTalking) return;

            const elapsed = currentTime - this.startTime;
            
            // 擬真人性化動漫開合節奏波形 (每 680ms 三個音節起伏)
            const cycle = (elapsed % 680) / 680;
            let targetOpen = 0;

            if (cycle < 0.28) {
                targetOpen = Math.sin((cycle / 0.28) * Math.PI); // 第一音節
            } else if (cycle < 0.36) {
                targetOpen = 0.12; // 音節短暫微收
            } else if (cycle < 0.68) {
                targetOpen = Math.sin(((cycle - 0.36) / 0.32) * Math.PI) * 0.95; // 第二音節
            } else if (cycle < 0.76) {
                targetOpen = 0.08; // 微歇
            } else {
                targetOpen = Math.sin(((cycle - 0.76) / 0.24) * Math.PI) * 0.75; // 第三音節
            }

            // 平滑插值
            this.currentOpen += (targetOpen - this.currentOpen) * 0.45;
            this.drawMouth(this.currentOpen, config);

            this.animFrameId = requestAnimationFrame(animate);
        };

        this.animFrameId = requestAnimationFrame(animate);
    }

    // 停止說話，平滑收嘴回自然狀態
    stopTalking() {
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }

        if (!this.isTalking && this.currentOpen <= 0.02) {
            if (this.ctx && this.canvas) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
            return;
        }

        this.isTalking = false;
        const closeStart = performance.now();
        const initialOpen = this.currentOpen;
        const closeDuration = 75; // 75ms 平滑閉嘴

        const animateClose = (now) => {
            const progress = Math.min(1, (now - closeStart) / closeDuration);
            const t = initialOpen * (1 - progress);
            const config = this.getConfig();
            
            if (config && this.ctx && this.canvas) {
                this.drawMouth(t, config);
            }

            if (progress < 1) {
                requestAnimationFrame(animateClose);
            } else {
                this.currentOpen = 0;
                if (this.ctx && this.canvas) {
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                }
            }
        };

        requestAnimationFrame(animateClose);
    }

    // 繪製日系動漫開口內部與唇線
    drawMouth(openRatio, config) {
        if (!this.ctx || !this.canvas) return;
        const w = this.canvas.width;
        const h = this.canvas.height;
        this.ctx.clearRect(0, 0, w, h);

        if (openRatio <= 0.03) return;

        const cx = config.x * w;
        const cy = config.y * h;
        // 嘴部寬度隨張開程度微幅拉展
        const rx = config.rx * w * (0.88 + openRatio * 0.22);
        // 嘴部張開深度
        const ry = config.ry * h * openRatio;

        this.ctx.save();

        // 1. 柔和膚色羽化，覆蓋原圖原生的閉嘴線
        const coverGrad = this.ctx.createRadialGradient(cx, cy, 1, cx, cy, rx * 1.25);
        coverGrad.addColorStop(0, config.skinColor);
        coverGrad.addColorStop(0.75, config.skinColor);
        coverGrad.addColorStop(1, 'rgba(254, 236, 233, 0)');
        this.ctx.fillStyle = coverGrad;
        this.ctx.beginPath();
        this.ctx.ellipse(cx, cy, rx * 1.22, ry * 0.75 + 2 * (w / 80), 0, 0, Math.PI * 2);
        this.ctx.fill();

        // 2. 嘴腔路徑 (日系動漫開口造型：上唇微曲、下唇弧度圓潤)
        this.ctx.beginPath();
        this.ctx.moveTo(cx - rx, cy - ry * 0.25);
        this.ctx.quadraticCurveTo(cx, cy - ry * 0.5, cx + rx, cy - ry * 0.25);
        this.ctx.quadraticCurveTo(cx, cy + ry * 1.8, cx - rx, cy - ry * 0.25);
        this.ctx.closePath();

        // 3. 限制內部繪製 (Clip)
        this.ctx.save();
        this.ctx.clip();

        // 嘴腔深淺漸層底色
        const cavityGrad = this.ctx.createLinearGradient(cx, cy - ry, cx, cy + ry * 1.8);
        cavityGrad.addColorStop(0, config.cavityDark);
        cavityGrad.addColorStop(0.4, config.cavityDark);
        cavityGrad.addColorStop(1, config.cavityLight);
        this.ctx.fillStyle = cavityGrad;
        this.ctx.fill();

        // 上排微露白牙 (精緻白線亮弧)
        if (openRatio > 0.25) {
            this.ctx.beginPath();
            this.ctx.moveTo(cx - rx * 0.7, cy - ry * 0.25);
            this.ctx.quadraticCurveTo(cx, cy - ry * 0.35, cx + rx * 0.7, cy - ry * 0.25);
            this.ctx.quadraticCurveTo(cx, cy + ry * 0.22, cx - rx * 0.7, cy - ry * 0.25);
            this.ctx.fillStyle = config.teethColor;
            this.ctx.fill();
        }

        // 舌頭弧線 (下唇內側粉嫩圓形)
        if (openRatio > 0.4) {
            this.ctx.beginPath();
            this.ctx.ellipse(cx, cy + ry * 1.25, rx * 0.58, ry * 0.55, 0, 0, Math.PI * 2);
            this.ctx.fillStyle = config.tongueColor;
            this.ctx.fill();
        }
        this.ctx.restore();

        // 4. 外唇輪廓線
        this.ctx.beginPath();
        this.ctx.moveTo(cx - rx, cy - ry * 0.25);
        this.ctx.quadraticCurveTo(cx, cy - ry * 0.5, cx + rx, cy - ry * 0.25);
        this.ctx.quadraticCurveTo(cx, cy + ry * 1.8, cx - rx, cy - ry * 0.25);
        this.ctx.strokeStyle = config.lipColor;
        this.ctx.lineWidth = 1.6 * (w / 80);
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.stroke();

        this.ctx.restore();
    }
}

// 匯出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MouthManager };
}
