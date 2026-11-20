// ============================================
// 角色動態眨眼與微動管理器 (Blink & Live Motion Manager)
// ============================================

class BlinkManager {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.avatarImg = null;
        this.wrapper = null;
        this.currentCharacter = null;
        this.currentExpression = 'normal';
        this.isEnabled = true;
        this.blinkTimer = null;
        this.doubleBlinkTimer = null;
        this.isBlinking = false;
        this.animFrameId = null;

        // 角色眼睛座標設定 (百分比 relative to avatar image)
        this.characterEyeCoords = {
            daiwa_scarlet: {
                left: { x: 0.409, y: 0.500, rx: 0.046, ry: 0.038 },
                right: { x: 0.615, y: 0.500, rx: 0.046, ry: 0.038 },
                skinColor: '#feece9',
                lidShadow: '#f0cdc7',
                lashColor: '#3a1f1b',
                lashThickness: 3.2
            },
            vodka: {
                left: { x: 0.435, y: 0.365, rx: 0.042, ry: 0.035 },
                right: { x: 0.565, y: 0.365, rx: 0.042, ry: 0.035 },
                skinColor: '#fae5d3',
                lidShadow: '#ebcfb8',
                lashColor: '#2c1e1a',
                lashThickness: 3.0
            },
            special_week: {
                left: { x: 0.420, y: 0.370, rx: 0.048, ry: 0.042 },
                right: { x: 0.605, y: 0.370, rx: 0.048, ry: 0.042 },
                skinColor: '#fff0ee',
                lidShadow: '#f5d5d0',
                lashColor: '#35201d',
                lashThickness: 3.2
            },
            gold_ship: {
                // 黃金船右眼已經是Wink閉眼，只需左眼眨動
                left: { x: 0.470, y: 0.465, rx: 0.048, ry: 0.038 },
                right: null,
                skinColor: '#fdf2e9',
                lidShadow: '#f0d9c8',
                lashColor: '#2b2123',
                lashThickness: 3.2
            }
        };

        this.loadSettings();
        this.init();
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('umamusume_blink_enabled');
            if (saved !== null) {
                this.isEnabled = saved === 'true';
            }
        } catch (e) {
            console.warn('載入眨眼動態設定失敗:', e);
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('umamusume_blink_enabled', this.isEnabled ? 'true' : 'false');
        } catch (e) {
            console.warn('儲存眨眼動態設定失敗:', e);
        }
    }

    init() {
        this.wrapper = document.getElementById('dialogue-avatar-wrapper');
        this.avatarImg = document.getElementById('dialogue-avatar-img');

        if (this.wrapper) {
            // 建立或取得眨眼 Canvas
            this.canvas = document.getElementById('avatar-blink-canvas');
            if (!this.canvas) {
                this.canvas = document.createElement('canvas');
                this.canvas.id = 'avatar-blink-canvas';
                this.canvas.className = 'avatar-blink-canvas';
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

    // 當切換說話角色或表情時呼叫
    onCharacterChange(characterId, expression = 'normal') {
        this.currentCharacter = characterId;
        this.currentExpression = expression;
        this.stopBlink();
        this.syncCanvasSize();

        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        if (this.isEnabled && this.characterEyeCoords[characterId]) {
            this.scheduleNextBlink(1500); // 1.5 秒後首次眨眼
        }
    }

    // 排程下一次眨眼
    scheduleNextBlink(delay = null) {
        if (!this.isEnabled) return;
        this.clearTimer();

        const waitTime = delay !== null ? delay : (2600 + Math.random() * 2600);
        this.blinkTimer = setTimeout(() => {
            this.triggerBlink(() => {
                // 25% 機率觸發連續雙眨眼 (Double Blink)
                if (Math.random() < 0.25) {
                    this.doubleBlinkTimer = setTimeout(() => {
                        this.doubleBlinkTimer = null;
                        if (!this.isEnabled) return;
                        this.triggerBlink(() => this.scheduleNextBlink());
                    }, 140);
                } else {
                    this.scheduleNextBlink();
                }
            });
        }, waitTime);
    }

    // 觸發單次平滑眨眼動畫
    triggerBlink(onComplete) {
        if (this.isBlinking || !this.ctx || !this.canvas || !this.currentCharacter) {
            if (onComplete) onComplete();
            return;
        }

        const eyeConfig = this.characterEyeCoords[this.currentCharacter];
        if (!eyeConfig) {
            if (onComplete) onComplete();
            return;
        }

        this.isBlinking = true;
        const startTime = performance.now();
        const duration = 140; // 眨眼總歷時 140ms

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(1, elapsed / duration);

            // 計算眼瞼閉合程度 t (0: 全開, 1: 全閉)
            let t = 0;
            if (progress <= 0.45) {
                // 迅速閉眼 (0 -> 1)
                t = progress / 0.45;
            } else if (progress <= 0.55) {
                // 瞬閉微停
                t = 1;
            } else {
                // 張開回彈 (1 -> 0)
                t = 1 - (progress - 0.55) / 0.45;
            }

            this.drawEyelids(t, eyeConfig);

            if (progress < 1) {
                this.animFrameId = requestAnimationFrame(animate);
            } else {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.isBlinking = false;
                if (onComplete) onComplete();
            }
        };

        this.animFrameId = requestAnimationFrame(animate);
    }

    // 繪製動態眼瞼與睫毛弧線
    drawEyelids(t, config) {
        const w = this.canvas.width;
        const h = this.canvas.height;
        this.ctx.clearRect(0, 0, w, h);

        if (t <= 0.05) return;

        const eyes = [];
        if (config.left) eyes.push(config.left);
        if (config.right) eyes.push(config.right);

        eyes.forEach(eye => {
            const cx = eye.x * w;
            const cy = eye.y * h;
            const rx = eye.rx * w;
            const ry = eye.ry * h;

            // 眼瞼遮罩高度隨 t 下降
            const currentDrop = ry * 2 * t;
            const topY = cy - ry;

            this.ctx.save();

            // 1. 繪製眼窩覆蓋色塊 (柔和膚色漸變)
            this.ctx.beginPath();
            // 上半橢圓起點
            this.ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
            this.ctx.clip();

            // 填充膚色 (從眼角上方往下滑)
            const grad = this.ctx.createLinearGradient(cx, topY, cx, topY + currentDrop);
            grad.addColorStop(0, config.lidShadow);
            grad.addColorStop(0.3, config.skinColor);
            grad.addColorStop(1, config.skinColor);

            this.ctx.fillStyle = grad;
            this.ctx.fillRect(cx - rx - 2, topY - 2, rx * 2 + 4, currentDrop + 2);

            // 2. 繪製精緻的日系動漫睫毛外弧線 (Eyelash Arc)
            const lashY = topY + currentDrop;
            this.ctx.beginPath();
            this.ctx.moveTo(cx - rx * 1.05, lashY - 1);
            // 微微向下彎曲的弧線
            const curveDrop = (1 - t) * 3;
            this.ctx.quadraticCurveTo(cx, lashY + curveDrop, cx + rx * 1.05, lashY - 1);

            this.ctx.strokeStyle = config.lashColor;
            this.ctx.lineWidth = config.lashThickness * (w / 80);
            this.ctx.lineCap = 'round';
            this.ctx.stroke();

            // 3. 眼尾微翹小睫毛 (Anime Eyelash Flick)
            if (t > 0.6) {
                this.ctx.beginPath();
                this.ctx.moveTo(cx + rx * 0.95, lashY);
                this.ctx.lineTo(cx + rx * 1.15, lashY - 2.5);
                this.ctx.strokeStyle = config.lashColor;
                this.ctx.lineWidth = 1.8 * (w / 80);
                this.ctx.stroke();
            }

            this.ctx.restore();
        });
    }

    clearTimer() {
        if (this.blinkTimer) {
            clearTimeout(this.blinkTimer);
            this.blinkTimer = null;
        }
        if (this.doubleBlinkTimer) {
            clearTimeout(this.doubleBlinkTimer);
            this.doubleBlinkTimer = null;
        }
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
        this.isBlinking = false;
    }

    stopBlink() {
        this.clearTimer();
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    setEnabled(enabled) {
        this.isEnabled = enabled;
        this.saveSettings();
        if (!enabled) {
            this.stopBlink();
        } else if (this.currentCharacter) {
            this.scheduleNextBlink(1000);
        }
    }
}

// 匯出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BlinkManager };
}
