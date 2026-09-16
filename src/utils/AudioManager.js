// ============================================
// 音效與音樂管理器 - Web Audio API 實現
// ============================================

class AudioManager {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.sfxVolume = 0.85;
        this.bgmVolume = 0.15;
        this.currentBgmType = null;
        this.bgmLoopTimer = null;
        this.bgmGainNode = null;
        this.sfxGainNode = null;
        this.bgmAudio = null;
        this.bgmSrc = 'audio/bgm/Winning_the_Final_Route.mp3';

        // 從 localStorage 讀取設定
        this.loadSettings();
    }

    // 初始化 AudioContext（瀏覽器需使用者點擊後解鎖）
    initContext() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
                this.bgmGainNode = this.ctx.createGain();
                this.sfxGainNode = this.ctx.createGain();
                
                this.bgmGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.bgmVolume, this.ctx.currentTime);
                this.sfxGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.sfxVolume, this.ctx.currentTime);
                
                this.bgmGainNode.connect(this.ctx.destination);
                this.sfxGainNode.connect(this.ctx.destination);
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        // 如果已有背景音樂且處於暫停中，藉由使用者互動恢復播放
        if (this.bgmAudio && this.currentBgmType && this.bgmAudio.paused && !this.isMuted) {
            this.bgmAudio.play().catch(() => {});
        }
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('umamusume_audio_settings');
            if (saved) {
                const data = JSON.parse(saved);
                this.isMuted = data.isMuted ?? false;
                // 若為前一版本之舊預設值 (0.4 / 0.6)，自動切換至新預設值 (0.15 / 0.85)
                if (data.bgmVolume === 0.4 && data.sfxVolume === 0.6) {
                    this.bgmVolume = 0.15;
                    this.sfxVolume = 0.85;
                    this.saveSettings();
                } else {
                    this.sfxVolume = data.sfxVolume ?? 0.85;
                    this.bgmVolume = data.bgmVolume ?? 0.15;
                }
            }
        } catch (e) {
            console.warn('載入音訊設定失敗:', e);
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('umamusume_audio_settings', JSON.stringify({
                isMuted: this.isMuted,
                sfxVolume: this.sfxVolume,
                bgmVolume: this.bgmVolume
            }));
        } catch (e) {
            console.warn('儲存音訊設定失敗:', e);
        }
    }

    setMuted(muted) {
        this.isMuted = muted;
        if (this.bgmAudio) {
            this.bgmAudio.volume = muted ? 0 : this.bgmVolume;
        }
        if (this.bgmGainNode && this.ctx) {
            this.bgmGainNode.gain.setValueAtTime(muted ? 0 : this.bgmVolume, this.ctx.currentTime);
            this.sfxGainNode.gain.setValueAtTime(muted ? 0 : this.sfxVolume, this.ctx.currentTime);
        }
        this.saveSettings();
    }

    setBgmVolume(val) {
        this.bgmVolume = Math.max(0, Math.min(1, val));
        if (this.bgmAudio && !this.isMuted) {
            this.bgmAudio.volume = this.bgmVolume;
        }
        if (this.bgmGainNode && this.ctx && !this.isMuted) {
            this.bgmGainNode.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
        }
        this.saveSettings();
    }

    setSfxVolume(val) {
        this.sfxVolume = Math.max(0, Math.min(1, val));
        if (this.sfxGainNode && this.ctx && !this.isMuted) {
            this.sfxGainNode.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
        }
        this.saveSettings();
    }

    // 播放打字機輕音 (Blip)
    playBlip() {
        if (this.isMuted || this.sfxVolume === 0) return;
        this.initContext();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;

            osc.type = 'triangle';
            // 隨機微調音高，讓打字聽起來更生動
            const freq = 480 + Math.random() * 40;
            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.8, now + 0.04);

            gain.gain.setValueAtTime(this.sfxVolume * 0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.04);
        } catch (e) {}
    }

    // 點擊按鈕音效
    playClick() {
        if (this.isMuted || this.sfxVolume === 0) return;
        this.initContext();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

            gain.gain.setValueAtTime(this.sfxVolume * 0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.08);
        } catch (e) {}
    }

    // 好感度上升風鈴音 (Chime)
    playAffectionUp() {
        if (this.isMuted || this.sfxVolume === 0) return;
        this.initContext();
        if (!this.ctx) return;

        try {
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, idx) => {
                const now = this.ctx.currentTime + idx * 0.08;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);

                gain.gain.setValueAtTime(this.sfxVolume * 0.25, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);
                osc.stop(now + 0.35);
            });
        } catch (e) {}
    }

    // 結局或重要達成音效
    playFanfare() {
        if (this.isMuted || this.sfxVolume === 0) return;
        this.initContext();
        if (!this.ctx) return;

        try {
            const melody = [
                { f: 523.25, d: 0.12 }, // C5
                { f: 659.25, d: 0.12 }, // E5
                { f: 783.99, d: 0.12 }, // G5
                { f: 1046.50, d: 0.35 } // C6
            ];
            let time = this.ctx.currentTime;
            melody.forEach(item => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(item.f, time);

                gain.gain.setValueAtTime(this.sfxVolume * 0.4, time);
                gain.gain.exponentialRampToValueAtTime(0.001, time + item.d);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(time);
                osc.stop(time + item.d);
                time += item.d + 0.04;
            });
        } catch (e) {}
    }

    initBgmAudio() {
        if (!this.bgmAudio) {
            this.bgmAudio = new Audio(this.bgmSrc);
            this.bgmAudio.loop = true;
            this.bgmAudio.volume = this.isMuted ? 0 : this.bgmVolume;
        }
    }

    // 播放背景音樂 (使用 Winning_the_Final_Route.mp3)
    playBGM(type = 'default') {
        if (!type || type === 'none') {
            this.stopBGM();
            return;
        }

        this.initContext();
        this.initBgmAudio();

        if (this.bgmAudio) {
            this.bgmAudio.volume = this.isMuted ? 0 : this.bgmVolume;
            if (this.bgmAudio.paused) {
                const playPromise = this.bgmAudio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        console.log('BGM waiting for user interaction to autoplay:', e);
                    });
                }
            }
        }
        this.currentBgmType = type;
    }

    stopBGM() {
        if (this.bgmAudio) {
            this.bgmAudio.pause();
        }
        if (this.bgmLoopTimer) {
            clearInterval(this.bgmLoopTimer);
            this.bgmLoopTimer = null;
        }
        this.currentBgmType = null;
    }

    // 合成音樂旋律循環
    startBgmLoop(type) {
        const melodies = {
            // 日常學園風
            daily: [
                { f: 261.63, d: 0.3 }, { f: 329.63, d: 0.3 }, { f: 392.00, d: 0.3 }, { f: 523.25, d: 0.5 },
                { f: 440.00, d: 0.3 }, { f: 392.00, d: 0.3 }, { f: 329.63, d: 0.6 },
                { f: 293.66, d: 0.3 }, { f: 349.23, d: 0.3 }, { f: 440.00, d: 0.3 }, { f: 493.88, d: 0.5 },
                { f: 392.00, d: 0.3 }, { f: 329.63, d: 0.3 }, { f: 261.63, d: 0.8 }
            ],
            // 浪漫感性風 (櫻花樹下、告白、結局)
            romance: [
                { f: 329.63, d: 0.6 }, { f: 392.00, d: 0.6 }, { f: 440.00, d: 0.8 }, { f: 493.88, d: 0.6 },
                { f: 523.25, d: 0.8 }, { f: 440.00, d: 0.6 }, { f: 392.00, d: 1.0 },
                { f: 349.23, d: 0.6 }, { f: 329.63, d: 0.6 }, { f: 293.66, d: 0.8 }, { f: 261.63, d: 1.2 }
            ],
            // 比賽與緊張氣氛
            race: [
                { f: 220.00, d: 0.15 }, { f: 220.00, d: 0.15 }, { f: 261.63, d: 0.15 }, { f: 293.66, d: 0.2 },
                { f: 329.63, d: 0.15 }, { f: 329.63, d: 0.15 }, { f: 392.00, d: 0.15 }, { f: 440.00, d: 0.3 },
                { f: 392.00, d: 0.15 }, { f: 329.63, d: 0.15 }, { f: 293.66, d: 0.15 }, { f: 261.63, d: 0.3 }
            ]
        };

        const currentMelody = melodies[type] || melodies.daily;
        const totalDuration = currentMelody.reduce((acc, n) => acc + n.d + 0.1, 0) * 1000;

        const playSequence = () => {
            if (this.isMuted || this.bgmVolume === 0 || !this.ctx) return;
            let time = this.ctx.currentTime + 0.05;

            currentMelody.forEach(note => {
                try {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();

                    osc.type = type === 'romance' ? 'sine' : 'triangle';
                    osc.frequency.setValueAtTime(note.f, time);

                    gain.gain.setValueAtTime(0.001, time);
                    gain.gain.linearRampToValueAtTime(this.bgmVolume * 0.15, time + 0.05);
                    gain.gain.exponentialRampToValueAtTime(0.001, time + note.d);

                    osc.connect(gain);
                    gain.connect(this.bgmGainNode);

                    osc.start(time);
                    osc.stop(time + note.d);
                    time += note.d + 0.08;
                } catch (e) {}
            });
        };

        playSequence();
        this.bgmLoopTimer = setInterval(playSequence, totalDuration);
    }
}

// 匯出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AudioManager };
}
