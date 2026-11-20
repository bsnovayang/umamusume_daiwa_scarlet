// ============================================
// 環境特效與粒子管理器 - Canvas Particle Effects
// ============================================

class EffectsManager {
    constructor(canvasId = 'effects-canvas') {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.particles = [];
        this.currentEffect = 'none';
        this.animFrameId = null;
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.init();
    }

    init() {
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'effects-canvas';
            this.canvas.className = 'effects-canvas';
            document.body.prepend(this.canvas);
            this.ctx = this.canvas.getContext('2d');
        }

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    setEffect(effectType) {
        if (this.currentEffect === effectType) return;
        this.currentEffect = effectType;
        this.particles = [];

        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }

        if (effectType === 'none' || !this.ctx) {
            if (this.ctx) this.ctx.clearRect(0, 0, this.width, this.height);
            return;
        }

        this.initParticles(effectType);
        this.loop();
    }

    initParticles(type) {
        const count = type === 'sakura' ? 40 : (type === 'rain' ? 80 : 30);

        for (let i = 0; i < count; i++) {
            if (type === 'sakura') {
                this.particles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height - this.height,
                    size: Math.random() * 8 + 7,
                    speedY: Math.random() * 1.5 + 1.2,
                    speedX: Math.random() * 1.5 - 0.5,
                    rotation: Math.random() * Math.PI * 2,
                    rotSpeed: (Math.random() - 0.5) * 0.04,
                    opacity: Math.random() * 0.35 + 0.6,
                    color: Math.random() > 0.35 ? '#ff9ebb' : '#ffc2d4'
                });
            } else if (type === 'rain') {
                this.particles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    length: Math.random() * 18 + 12,
                    speedY: Math.random() * 8 + 14,
                    speedX: -1.5,
                    opacity: Math.random() * 0.3 + 0.2
                });
            } else if (type === 'sparkle') {
                this.particles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    radius: Math.random() * 3 + 1,
                    alpha: Math.random(),
                    speedAlpha: (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1)
                });
            }
        }
    }

    loop() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.width, this.height);

        if (this.currentEffect === 'sakura') {
            this.drawSakura();
        } else if (this.currentEffect === 'rain') {
            this.drawRain();
        } else if (this.currentEffect === 'sparkle') {
            this.drawSparkle();
        }

        this.animFrameId = requestAnimationFrame(() => this.loop());
    }

    drawSakura() {
        for (const p of this.particles) {
            p.y += p.speedY;
            p.x += Math.sin(p.rotation) * 0.8 + p.speedX;
            p.rotation += p.rotSpeed;

            if (p.y > this.height) {
                p.y = -20;
                p.x = Math.random() * this.width;
            }
            if (p.x > this.width) p.x = 0;
            if (p.x < 0) p.x = this.width;

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fillStyle = p.color;

            // 繪製櫻花花瓣形狀
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.bezierCurveTo(-p.size / 2, -p.size / 2, -p.size, p.size / 3, 0, p.size);
            this.ctx.bezierCurveTo(p.size, p.size / 3, p.size / 2, -p.size / 2, 0, 0);
            this.ctx.fill();

            this.ctx.restore();
        }
    }

    drawRain() {
        this.ctx.strokeStyle = '#a4b0be';
        this.ctx.lineWidth = 1.2;

        for (const p of this.particles) {
            p.y += p.speedY;
            p.x += p.speedX;

            if (p.y > this.height) {
                p.y = -20;
                p.x = Math.random() * this.width;
            }
            if (p.x < 0) p.x = this.width;

            this.ctx.globalAlpha = p.opacity;
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p.x + p.speedX * 2, p.y + p.length);
            this.ctx.stroke();
        }
    }

    drawSparkle() {
        this.ctx.fillStyle = '#ffe57f';
        this.ctx.shadowColor = 'rgba(255, 229, 127, 0.75)';
        this.ctx.shadowBlur = 8;

        for (const p of this.particles) {
            p.alpha += p.speedAlpha;
            if (p.alpha > 1 || p.alpha < 0.15) {
                p.speedAlpha = -p.speedAlpha;
            }

            this.ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.shadowBlur = 0;
    }

    // 解析地點與場景 ID 對應的背景視覺類別
    resolveBackdropClass(location = '', sceneId = '') {
        const id = (sceneId || '').toLowerCase();
        if (id === 'title') {
            return 'bg-title';
        }

        const loc = location || '';
        if (/櫻花|校門|夜間小路|夕陽下的校園|雨中/.test(loc) || id.includes('cherry') || id.includes('ending_s') || id.includes('ending_a')) {
            return 'bg-sakura';
        }
        if (/教室|走廊|圖書館|食堂|宿舍|辦公室|訓練室|更衣室|通道|茶室/.test(loc)) {
            return 'bg-classroom';
        }
        return 'bg-track';
    }

    // 同步切換背景景觀與氛圍濾鏡
    setBackdrop(bgClass, atmosphereClass = '') {
        const backdrop = document.getElementById('scene-backdrop');
        if (!backdrop || !backdrop.classList) return;

        backdrop.classList.remove(
            'bg-title', 'bg-track', 'bg-classroom', 'bg-sakura',
            'atmosphere-sunset', 'atmosphere-night', 'atmosphere-rain', 'atmosphere-sakura'
        );

        if (bgClass) {
            backdrop.classList.add(bgClass);
        }
        if (atmosphereClass) {
            backdrop.classList.add(atmosphereClass);
        }
    }

    // 根據場景自動判斷與套用特效和光影
    updateSceneEffect(scene, sceneId = '') {
        const app = document.getElementById('app');
        if (!app) return;

        // 移除舊的氛圍濾鏡
        app.classList.remove('atmosphere-sunset', 'atmosphere-night', 'atmosphere-rain', 'atmosphere-sakura');

        if (!scene) {
            this.setEffect('none');
            this.setBackdrop('bg-track', '');
            return;
        }

        const loc = (scene.location || '').toLowerCase();
        const id = (sceneId || scene.id || '').toLowerCase();
        let detectedAtmosphere = '';

        // 判斷櫻花特效
        if (loc.includes('櫻花') || id.includes('cherry') || id.includes('ending_s') || id.includes('ending_a')) {
            this.setEffect('sakura');
            detectedAtmosphere = 'atmosphere-sakura';
            app.classList.add(detectedAtmosphere);
        }
        // 判斷雨天特效
        else if (loc.includes('雨') || id.includes('rain')) {
            this.setEffect('rain');
            detectedAtmosphere = 'atmosphere-rain';
            app.classList.add(detectedAtmosphere);
        }
        // 判斷黃昏
        else if (loc.includes('黃昏') || loc.includes('夕陽')) {
            this.setEffect('none');
            detectedAtmosphere = 'atmosphere-sunset';
            app.classList.add(detectedAtmosphere);
        }
        // 判斷夜晚 / 深夜
        else if (loc.includes('夜') || loc.includes('深夜') || loc.includes('月光') || id.includes('night')) {
            this.setEffect('sparkle');
            detectedAtmosphere = 'atmosphere-night';
            app.classList.add(detectedAtmosphere);
        }
        else {
            this.setEffect('none');
        }

        this.setBackdrop(this.resolveBackdropClass(scene.location, sceneId), detectedAtmosphere);
    }
}

// 匯出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EffectsManager };
}
