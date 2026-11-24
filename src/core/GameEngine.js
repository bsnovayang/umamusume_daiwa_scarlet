// ============================================
// 遊戲引擎 v2.0 - 核心邏輯整合
// ============================================

class GameEngine {
    constructor() {
        this.currentScene = null;
        this.currentDialogueIndex = 0;
        this.affection = {
            daiwa_scarlet: 0,
            vodka: 0,
            special_week: 0
        };
        this.flags = {};

        // 打字機效果
        this.isTyping = false;
        this.typingSpeed = 40; // 預設毫秒/字
        this.fastTypingSpeed = 5;
        this.typingInterval = null;

        // 快捷鍵狀態
        this.isCtrlPressed = false;

        // 自動播放
        this.isAutoMode = false;
        this.autoPlayDelay = 2000;
        this.autoPlayTimer = null;

        // UI 隱藏狀態
        this.isUIHidden = false;

        // 儲存/讀取模式狀態 ('save' 或 'load')
        this.saveModalMode = 'save';

        // 過場與結算 UI 狀態
        this.eyecatchTimer = null;
        this.eyecatchHideTimer = null;
        this.isEyecatchActive = false;
        this.affectionPulseTimer = null;
        this.lastEndingMeta = null;
        this.chapterIntros = {
            prologue_start: { code: 'CHAPTER 01', title: '第一章：邂逅', subtitle: '初次踏入特雷森學園的那一天' },
            ch2_morning_run: { code: 'CHAPTER 02', title: '第二章：接近', subtitle: '晨光下的並肩奔跑' },
            chapter3_start: { code: 'CHAPTER 03', title: '第三章：心意', subtitle: '悄然萌芽的悸動與信賴' },
            chapter4_start: { code: 'CHAPTER 04', title: '第四章：考驗', subtitle: '迎向重大賽事的試煉' },
            chapter5_start: { code: 'CHAPTER 05', title: '第五章：終章', subtitle: '櫻花綻放時的最終決戰' }
        };

        // 初始化管理器
        this.saveManager = new SaveManager();
        this.historyManager = new HistoryManager();
        this.galleryManager = new GalleryManager();
        this.audioManager = new AudioManager();
        this.effectsManager = new EffectsManager();
        this.blinkManager = new BlinkManager();
        this.mouthManager = new MouthManager();
        this.livePortraitManager = new LivePortraitManager();
        this.livePortraitManager.setBlinkEnabled(this.blinkManager.isEnabled);
        this.livePortraitManager.setMouthEnabled(this.mouthManager.isEnabled);

        if (typeof CHARACTERS !== 'undefined') {
            const standUrls = [];
            Object.values(CHARACTERS).forEach(char => {
                if (char.stand) standUrls.push(char.stand);
                if (char.standExpressions) standUrls.push(...Object.values(char.standExpressions));
            });
            this.livePortraitManager.preloadImages(standUrls);
        }

        if (typeof Image !== 'undefined') {
            [
                'img/bg/track_day.jpg',
                'img/bg/classroom_day.jpg',
                'img/bg/sakura_day.jpg',
                'img/bg/rooftop_day.jpg',
                'img/bg/lounge_day.jpg'
            ].forEach((url) => {
                const img = new Image();
                img.src = url;
            });
        }

        this.loadUserSettings();
        this.init();
    }

    // 載入使用者文字速度與自訂設定
    loadUserSettings() {
        try {
            const saved = localStorage.getItem('umamusume_user_settings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.typingSpeed = settings.typingSpeed ?? 40;
                this.autoPlayDelay = settings.autoPlayDelay ?? 2000;
            }
        } catch (e) {
            console.warn('載入設定失敗:', e);
        }
    }

    saveUserSettings() {
        try {
            localStorage.setItem('umamusume_user_settings', JSON.stringify({
                typingSpeed: this.typingSpeed,
                autoPlayDelay: this.autoPlayDelay
            }));
        } catch (e) {
            console.warn('儲存設定失敗:', e);
        }
    }

    init() {
        this.bindEvents();
        this.bindKeyboardEvents();
        this.updateAffectionUI();
        
        // 標題畫面啟動櫻花特效與日常音樂
        this.effectsManager.setEffect('sakura');
    }

    // 條件評估、分支路由與存檔狀態輔助函式
    evaluateCondition(condition) {
        if (!condition) return true;

        if (condition.flags) {
            for (const [key, expected] of Object.entries(condition.flags)) {
                if (Boolean(this.flags[key]) !== Boolean(expected)) {
                    return false;
                }
            }
        }

        if (condition.minAffection) {
            for (const [char, minVal] of Object.entries(condition.minAffection)) {
                if ((this.affection[char] ?? 0) < minVal) {
                    return false;
                }
            }
        }

        if (condition.maxAffection) {
            for (const [char, maxVal] of Object.entries(condition.maxAffection)) {
                if ((this.affection[char] ?? 0) > maxVal) {
                    return false;
                }
            }
        }

        return true;
    }

    resolveNextScene(target) {
        if (Array.isArray(target?.nextScenes)) {
            const matched = target.nextScenes.find(branch => this.evaluateCondition(branch.condition));
            if (matched?.scene) {
                return matched.scene;
            }
        }
        return target?.nextScene || null;
    }

    getActiveDialogues(scene) {
        return (scene?.dialogues || []).filter(d => this.evaluateCondition(d.condition));
    }

    getSaveState() {
        const scene = GAME_DATA.scenes[this.currentScene];
        const dialogues = this.getActiveDialogues(scene);
        const previewIndex = Math.min(this.currentDialogueIndex ?? 0, Math.max(0, dialogues.length - 1));
        const previewText = dialogues[previewIndex]?.text?.substring(0, 30) || '';

        return {
            currentScene: this.currentScene,
            currentDialogueIndex: this.currentDialogueIndex,
            affection: { ...this.affection },
            flags: { ...this.flags },
            dialogueHistory: this.historyManager.getAll(),
            previewText
        };
    }

    // 畫面與UI狀態檢查輔助函式
    isGameScreenActive() {
        return Boolean(document.getElementById('game-screen')?.classList.contains('active'));
    }

    hasActiveOverlay() {
        return document.querySelector('.screen.overlay.active') !== null;
    }

    isChoicesVisible() {
        const container = document.getElementById('choices-container');
        return (container?.children.length || 0) > 0;
    }

    stopTyping() {
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
            this.typingInterval = null;
        }
        document.getElementById('dialogue-text')?.classList.remove('typing');
        document.getElementById('dialogue-avatar-wrapper')?.classList.remove('talking');
        this.mouthManager.stopTalking();
        this.livePortraitManager?.setTalking(false);
        this.isTyping = false;
    }

    resumeAutoPlayIfNeeded() {
        if (
            this.isAutoMode &&
            this.isGameScreenActive() &&
            !this.isTyping &&
            !this.isChoicesVisible() &&
            !this.hasActiveOverlay() &&
            !this.isEyecatchActive &&
            !this.isUIHidden
        ) {
            this.startAutoPlay();
        }
    }

    // 綁定鍵盤事件
    bindKeyboardEvents() {
        window.addEventListener('blur', () => {
            this.isCtrlPressed = false;
        });

        document.addEventListener('keydown', (e) => {
            // 解鎖 Web Audio Context
            this.audioManager.initContext();

            if (e.key === 'Escape') {
                if (this.isUIHidden) {
                    this.toggleHideUI(false);
                } else if (this.hasActiveOverlay()) {
                    this.closeAllOverlays();
                } else if (this.isEyecatchActive) {
                    this.hideChapterEyecatch();
                }
                return;
            }

            if (this.isEyecatchActive && (e.key === ' ' || e.key === 'Enter')) {
                e.preventDefault?.();
                this.hideChapterEyecatch();
                return;
            }

            const tagName = e.target?.tagName;
            if (tagName === 'INPUT' || tagName === 'SELECT' || tagName === 'TEXTAREA') {
                return;
            }

            if (e.key === 'Control' || e.key === 'Ctrl') {
                if (this.isGameScreenActive() && !this.hasActiveOverlay() && !this.isUIHidden) {
                    this.isCtrlPressed = true;
                    this.handleCtrlPress();
                }
                return;
            }

            if (e.key === 'h' || e.key === 'H') {
                const isHistoryActive = document.getElementById('history-screen')?.classList.contains('active');
                if (this.isGameScreenActive() && !this.isUIHidden && (!this.hasActiveOverlay() || isHistoryActive)) {
                    this.toggleHistory();
                }
                return;
            }

            if (e.key === 'a' || e.key === 'A') {
                if (this.isGameScreenActive() && !this.hasActiveOverlay() && !this.isUIHidden) {
                    this.toggleAutoMode();
                }
                return;
            }

            if (e.key === 'v' || e.key === 'V') {
                if (this.isGameScreenActive() && !this.hasActiveOverlay()) {
                    this.toggleHideUI();
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'Control' || e.key === 'Ctrl') {
                this.isCtrlPressed = false;
            }
        });
    }

    // Ctrl 按下處理
    handleCtrlPress() {
        if (this.isTyping) {
            this.speedUpTyping();
        } else {
            this.fastForward();
        }
    }

    // 加速打字
    speedUpTyping() {
        if (!this.typingInterval) return;

        clearInterval(this.typingInterval);
        this.typingInterval = null;
        const scene = GAME_DATA.scenes[this.currentScene];
        const dialogues = this.getActiveDialogues(scene);
        const dialogue = dialogues[this.currentDialogueIndex];
        if (!dialogue) {
            this.stopTyping();
            return;
        }
        const dialogueEl = document.getElementById('dialogue-text');
        const currentText = dialogueEl.textContent;
        const fullText = dialogue.text;

        let index = currentText.length;

        this.typingInterval = setInterval(() => {
            if (index < fullText.length) {
                dialogueEl.textContent += fullText[index];
                index++;
            } else {
                this.stopTyping();
            }
        }, this.fastTypingSpeed);
    }

    // 快速跳過
    fastForward() {
        if (this.isChoicesVisible()) return;

        const scene = GAME_DATA.scenes[this.currentScene];
        if (!scene) return;

        this.clearAutoPlayTimer();
        const dialogues = this.getActiveDialogues(scene);

        if (dialogues.length > 0 && this.currentDialogueIndex < dialogues.length - 1) {
            if (this.isTyping) {
                this.skipCurrentTyping();
            }

            this.currentDialogueIndex++;
            this.showDialogue();
        } else if (dialogues.length > 0 && this.currentDialogueIndex >= dialogues.length - 1) {
            if (this.isTyping) {
                this.skipCurrentTyping();
            }

            if (scene.choices) {
                this.currentDialogueIndex = dialogues.length;
                this.showDialogue();
            } else {
                const next = this.resolveNextScene(scene);
                if (next) this.loadScene(next);
            }
        } else if (!scene.choices) {
            const next = this.resolveNextScene(scene);
            if (next) this.loadScene(next);
        }
    }

    // 跳過當前打字
    skipCurrentTyping() {
        const scene = GAME_DATA.scenes[this.currentScene];
        const dialogues = this.getActiveDialogues(scene);
        const dialogue = dialogues[this.currentDialogueIndex];
        if (!dialogue) return;

        document.getElementById('dialogue-text').textContent = dialogue.text;
        this.stopTyping();
    }

    // 切換自動播放
    toggleAutoMode() {
        this.audioManager.playClick();
        this.isAutoMode = !this.isAutoMode;
        this.showToast(this.isAutoMode ? '自動播放：開啟' : '自動播放：關閉');

        const autoBtn = document.getElementById('auto-btn');
        if (autoBtn) {
            autoBtn.classList.toggle('active', this.isAutoMode);
        }

        if (this.isAutoMode && !this.isTyping) {
            this.startAutoPlay();
        }
    }

    // 開始自動播放
    startAutoPlay() {
        this.clearAutoPlayTimer();
        if (this.hasActiveOverlay() || this.isUIHidden || this.isEyecatchActive) {
            return;
        }
        this.autoPlayTimer = setTimeout(() => {
            this.handleDialogueClick();
        }, this.autoPlayDelay);
        this.autoPlayTimer?.unref?.();
    }

    clearAutoPlayTimer() {
        if (this.autoPlayTimer) {
            clearTimeout(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }

    // 隱藏/顯示 UI
    toggleHideUI(forceState = null) {
        const nextState = forceState !== null ? forceState : !this.isUIHidden;
        if (nextState && (!this.isGameScreenActive() || this.hasActiveOverlay())) {
            return;
        }
        this.isUIHidden = nextState;
        const app = document.getElementById('app');
        if (app) {
            app.classList.toggle('ui-hidden', this.isUIHidden);
        }
        if (this.isUIHidden) {
            this.clearAutoPlayTimer();
            this.showToast('UI 已隱藏，點擊畫面或按 ESC / V 鍵恢復');
        } else {
            this.resumeAutoPlayIfNeeded();
        }
    }

    // 切換歷史記錄
    toggleHistory() {
        this.audioManager.playClick();
        const historyScreen = document.getElementById('history-screen');
        if (historyScreen.classList.contains('active')) {
            this.closeHistory();
        } else {
            this.showHistory();
        }
    }

    showHistory() {
        this.clearAutoPlayTimer();
        const historyScreen = document.getElementById('history-screen');
        const historyContent = document.getElementById('history-content');

        historyContent.innerHTML = this.historyManager.generateHTML();
        historyScreen.classList.add('active');
        historyContent.scrollTop = historyContent.scrollHeight;
    }

    closeHistory() {
        document.getElementById('history-screen')?.classList.remove('active');
        this.resumeAutoPlayIfNeeded();
    }

    // 關閉所有覆蓋層
    closeAllOverlays() {
        this.hideChapterEyecatch();
        this.closeHistory();
        this.closeMenu();
        this.closeCharacters();
        this.closeSaveModal();
        this.closeGalleryModal();
        this.closeSettingsModal();
        this.closeRelationsModal();
        this.closeEndingResultModal();
    }

    showToast(message) {
        const oldToast = document.querySelector('.toast-message');
        if (oldToast) oldToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.remove(), 2200);
    }

    // 綁定 DOM 事件
    bindEvents() {
        // 標題畫面按鈕
        document.getElementById('start-btn')?.addEventListener('click', () => {
            this.audioManager.playClick();
            this.startGame();
        });

        document.getElementById('title-load-btn')?.addEventListener('click', () => {
            this.audioManager.playClick();
            this.openSaveModal('load');
        });

        document.getElementById('title-gallery-btn')?.addEventListener('click', () => {
            this.audioManager.playClick();
            this.openGalleryModal();
        });

        document.getElementById('chars-btn')?.addEventListener('click', () => {
            this.audioManager.playClick();
            this.showCharacters();
        });

        // 遊戲中對話區點擊
        document.getElementById('dialogue-box')?.addEventListener('click', () => {
            if (this.isUIHidden) {
                this.toggleHideUI(false);
                return;
            }
            this.handleDialogueClick();
        });

        // 點擊半身立繪互動 (摸頭/切換反應)
        document.getElementById('live-portrait-wrapper')?.addEventListener('click', (e) => {
            if (this.isUIHidden) {
                return;
            }
            e.stopPropagation();
            this.audioManager.playClick();
            this.livePortraitManager.triggerPetReaction();
        });

        // 隱藏 UI 按鈕
        document.getElementById('hide-ui-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.audioManager.playClick();
            this.toggleHideUI();
        });

        // 點擊畫面任一處恢復 UI (當 UI 隱藏時)
        document.getElementById('app')?.addEventListener('click', (e) => {
            if (this.isUIHidden) {
                this.toggleHideUI(false);
                e.stopPropagation();
            }
        });

        // 頂部工具列按鈕
        document.getElementById('menu-btn')?.addEventListener('click', () => {
            this.audioManager.playClick();
            this.openMenu();
        });

        document.getElementById('close-menu-btn')?.addEventListener('click', () => {
            this.audioManager.playClick();
            this.closeMenu();
        });

        document.getElementById('back-to-title-btn')?.addEventListener('click', () => {
            this.audioManager.playClick();
            this.backToTitle();
        });

        // 選單功能按鈕
        document.getElementById('menu-save-btn')?.addEventListener('click', () => {
            this.audioManager.playClick();
            this.openSaveModal('save');
        });

        document.getElementById('menu-load-btn')?.addEventListener('click', () => {
            this.audioManager.playClick();
            this.openSaveModal('load');
        });

        document.getElementById('menu-gallery-btn')?.addEventListener('click', () => {
            this.audioManager.playClick();
            this.openGalleryModal();
        });

        document.getElementById('menu-settings-btn')?.addEventListener('click', () => {
            this.audioManager.playClick();
            this.openSettingsModal();
        });

        document.getElementById('menu-relations-btn')?.addEventListener('click', () => {
            this.audioManager.playClick();
            this.openRelationsModal();
        });

        // 歷史與人物關閉按鈕
        document.getElementById('history-btn')?.addEventListener('click', () => this.toggleHistory());
        document.getElementById('close-history-btn')?.addEventListener('click', () => {
            this.audioManager.playClick();
            this.closeHistory();
        });
        document.getElementById('auto-btn')?.addEventListener('click', () => this.toggleAutoMode());
        document.getElementById('close-chars-btn')?.addEventListener('click', () => {
            this.audioManager.playClick();
            this.closeCharacters();
        });

        // 彈窗通用關閉按鈕
        document.getElementById('close-save-modal-btn')?.addEventListener('click', () => {
            this.audioManager.playClick();
            this.closeSaveModal();
        });
        document.getElementById('close-gallery-btn')?.addEventListener('click', () => {
            this.audioManager.playClick();
            this.closeGalleryModal();
        });
        document.getElementById('close-settings-btn')?.addEventListener('click', () => {
            this.audioManager.playClick();
            this.closeSettingsModal();
        });
        document.getElementById('close-relations-btn')?.addEventListener('click', () => {
            this.audioManager.playClick();
            this.closeRelationsModal();
        });

        // 點擊遮罩空白處關閉對應彈窗
        const overlayCloseMap = [
            ['menu-screen', () => this.closeMenu()],
            ['save-modal-screen', () => this.closeSaveModal()],
            ['gallery-screen', () => this.closeGalleryModal()],
            ['relations-screen', () => this.closeRelationsModal()],
            ['settings-screen', () => this.closeSettingsModal()],
            ['history-screen', () => this.closeHistory()],
            ['chars-screen', () => this.closeCharacters()],
            ['ending-result-screen', () => this.closeEndingResultModal()]
        ];
        overlayCloseMap.forEach(([id, closeFn]) => {
            const el = document.getElementById(id);
            el?.addEventListener('click', (e) => {
                if (e.target === el) {
                    this.audioManager.playClick();
                    closeFn();
                }
            });
        });

        // 章節過場點擊略過
        document.getElementById('chapter-eyecatch')?.addEventListener('click', () => {
            this.audioManager.playClick();
            this.hideChapterEyecatch();
        });

        // 結局結算畫面按鈕
        document.getElementById('close-ending-result-btn')?.addEventListener('click', () => {
            this.audioManager.playClick();
            this.closeEndingResultModal();
        });
        document.getElementById('ending-open-gallery-btn')?.addEventListener('click', () => {
            this.audioManager.playClick();
            this.closeEndingResultModal();
            this.openGalleryModal();
        });
        document.getElementById('ending-restart-btn')?.addEventListener('click', () => {
            this.audioManager.playClick();
            this.closeEndingResultModal();
            this.startGame();
        });
        document.getElementById('ending-title-btn')?.addEventListener('click', () => {
            this.audioManager.playClick();
            this.closeEndingResultModal();
            this.loadScene('title');
        });

        // 設定控制項綁定
        this.bindSettingsControls();
    }

    // 綁定設定控制項
    bindSettingsControls() {
        const textSpeedSelect = document.getElementById('setting-text-speed');
        const autoDelaySelect = document.getElementById('setting-auto-delay');
        const bgmVolumeSlider = document.getElementById('setting-bgm-volume');
        const sfxVolumeSlider = document.getElementById('setting-sfx-volume');
        const muteCheckbox = document.getElementById('setting-mute');

        if (textSpeedSelect) {
            textSpeedSelect.value = this.typingSpeed;
            textSpeedSelect.addEventListener('change', (e) => {
                this.typingSpeed = parseInt(e.target.value, 10);
                this.saveUserSettings();
            });
        }

        if (autoDelaySelect) {
            autoDelaySelect.value = this.autoPlayDelay;
            autoDelaySelect.addEventListener('change', (e) => {
                this.autoPlayDelay = parseInt(e.target.value, 10);
                this.saveUserSettings();
            });
        }

        const bgmValEl = document.getElementById('bgm-volume-val');
        const sfxValEl = document.getElementById('sfx-volume-val');

        if (bgmVolumeSlider) {
            bgmVolumeSlider.value = this.audioManager.bgmVolume;
            if (bgmValEl) bgmValEl.textContent = `${Math.round(this.audioManager.bgmVolume * 100)}%`;
            bgmVolumeSlider.addEventListener('input', (e) => {
                const v = parseFloat(e.target.value);
                this.audioManager.setBgmVolume(v);
                if (bgmValEl) bgmValEl.textContent = `${Math.round(v * 100)}%`;
            });
        }

        if (sfxVolumeSlider) {
            sfxVolumeSlider.value = this.audioManager.sfxVolume;
            if (sfxValEl) sfxValEl.textContent = `${Math.round(this.audioManager.sfxVolume * 100)}%`;
            sfxVolumeSlider.addEventListener('input', (e) => {
                const v = parseFloat(e.target.value);
                this.audioManager.setSfxVolume(v);
                if (sfxValEl) sfxValEl.textContent = `${Math.round(v * 100)}%`;
                this.audioManager.playClick();
            });
        }

        if (muteCheckbox) {
            muteCheckbox.checked = this.audioManager.isMuted;
            muteCheckbox.addEventListener('change', (e) => {
                this.audioManager.setMuted(e.target.checked);
            });
        }

        const blinkCheckbox = document.getElementById('setting-blink');
        if (blinkCheckbox) {
            blinkCheckbox.checked = this.blinkManager.isEnabled;
            blinkCheckbox.addEventListener('change', (e) => {
                this.blinkManager.setEnabled(e.target.checked);
                this.livePortraitManager.setBlinkEnabled(e.target.checked);
            });
        }

        const mouthCheckbox = document.getElementById('setting-mouth');
        if (mouthCheckbox) {
            mouthCheckbox.checked = this.mouthManager.isEnabled;
            mouthCheckbox.addEventListener('change', (e) => {
                this.mouthManager.setEnabled(e.target.checked);
                this.livePortraitManager.setMouthEnabled(e.target.checked);
            });
        }

        const live2dCheckbox = document.getElementById('setting-live2d');
        if (live2dCheckbox) {
            live2dCheckbox.checked = this.livePortraitManager.isEnabled;
            live2dCheckbox.addEventListener('change', (e) => {
                this.livePortraitManager.setEnabled(e.target.checked);
            });
        }
    }

    // 開始新遊戲
    startGame() {
        this.hideChapterEyecatch();
        this.closeEndingResultModal();
        this.lastEndingMeta = null;
        this.currentScene = 'prologue_start';
        this.currentDialogueIndex = 0;
        this.affection = {
            daiwa_scarlet: 0,
            vodka: 0,
            special_week: 0
        };
        this.flags = {};
        this.historyManager.clear();
        this.isAutoMode = false;
        this.isUIHidden = false;
        document.getElementById('app')?.classList.remove('ui-hidden');
        const floatLayer = document.getElementById('affection-float-layer');
        if (floatLayer) floatLayer.innerHTML = '';
        this.updateAffectionUI();

        const autoBtn = document.getElementById('auto-btn');
        if (autoBtn) autoBtn.classList.remove('active');

        this.showScreen('game-screen');
        this.loadScene(this.currentScene);
        
        // 初始自動存檔
        this.saveManager.autoSave(this.getSaveState());
    }

    // 顯示主要畫面
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId)?.classList.add('active');
    }

    // 載入場景
    loadScene(sceneId, options = {}) {
        const { startDialogueIndex = 0, isLoad = false } = options;
        this.clearAutoPlayTimer();
        this.stopTyping();
        this.hideChapterEyecatch();

        if (sceneId === 'title') {
            this.isUIHidden = false;
            this.closeEndingResultModal();
            this.lastEndingMeta = null;
            const floatLayer = document.getElementById('affection-float-layer');
            if (floatLayer) floatLayer.innerHTML = '';
            const app = document.getElementById('app');
            if (app) {
                app.classList.remove('ui-hidden', 'atmosphere-sunset', 'atmosphere-night', 'atmosphere-rain', 'atmosphere-sakura');
            }
            this.isAutoMode = false;
            document.getElementById('auto-btn')?.classList.remove('active');
            document.getElementById('character-stage')?.classList.remove('stand-mode');
            document.querySelector('.game-bottom-area')?.classList?.remove('has-choices');
            this.blinkManager.stopBlink();
            this.mouthManager.stopTalking();
            this.livePortraitManager.hide();
            this.showScreen('title-screen');
            this.effectsManager.setEffect('sakura');
            this.effectsManager.setBackdrop('bg-title', 'atmosphere-sakura');
            this.audioManager.playBGM('daily');
            return;
        }

        if (sceneId === 'end') {
            this.showEnding();
            return;
        }

        if (sceneId === 'ending_result') {
            this.openEndingResultModal(this.currentScene);
            return;
        }

        const scene = GAME_DATA.scenes[sceneId];
        if (!scene) {
            console.error('Scene not found:', sceneId);
            return;
        }

        this.currentScene = sceneId;
        this.currentDialogueIndex = 0;

        if (!isLoad && scene.setFlags) {
            Object.assign(this.flags, scene.setFlags);
        }

        // 更新場景名稱與動態氛圍特效
        if (scene.location) {
            document.getElementById('location-text').textContent = scene.location;
        }
        this.effectsManager.updateSceneEffect(scene, sceneId);

        // 依據場景類型切換 BGM
        this.updateSceneBGM(sceneId, scene);

        // 章節轉換時自動存檔與章節過場標題卡（讀檔時不覆蓋）
        if (!isLoad && (sceneId.includes('_start') || sceneId === 'ch2_morning_run' || sceneId === 'ch5_the_race')) {
            this.saveManager.autoSave(this.getSaveState());
        }
        if (!isLoad && this.chapterIntros[sceneId]) {
            this.showChapterEyecatch(sceneId);
        }

        const dialogues = this.getActiveDialogues(scene);

        if (dialogues.length > 0) {
            if (isLoad && startDialogueIndex >= dialogues.length && scene.choices) {
                this.currentDialogueIndex = dialogues.length - 1;
                this.showDialogue({ recordHistory: false, instant: true });
                this.currentDialogueIndex = dialogues.length;
                this.showChoices(scene.choices);
            } else {
                this.currentDialogueIndex = Math.max(0, Math.min(startDialogueIndex, dialogues.length - 1));
                this.showDialogue({ recordHistory: !isLoad });
            }
        } else if (scene.choices) {
            this.showChoices(scene.choices);
        } else {
            const next = this.resolveNextScene(scene);
            if (next) this.loadScene(next);
        }
    }

    // 自動依場景類型選擇適當的 BGM
    updateSceneBGM(sceneId, scene) {
        if (sceneId.startsWith('ending_') || sceneId.includes('cherry') || sceneId.includes('confess')) {
            this.audioManager.playBGM('romance');
        } else if (sceneId.includes('race') || sceneId.includes('rival')) {
            this.audioManager.playBGM('race');
        } else {
            this.audioManager.playBGM('daily');
        }
    }

    // 顯示對話與角色頭像
    showDialogue(options = {}) {
        const { recordHistory = true, instant = false } = options;
        const scene = GAME_DATA.scenes[this.currentScene];
        const dialogues = this.getActiveDialogues(scene);
        const dialogue = dialogues[this.currentDialogueIndex];

        if (!dialogue) {
            if (scene.choices) {
                this.showChoices(scene.choices);
                if (this.currentScene && this.currentScene.startsWith('ending_')) {
                    this.openEndingResultModal(this.currentScene);
                }
            } else {
                const next = this.resolveNextScene(scene);
                if (next) this.loadScene(next);
            }
            return;
        }

        document.getElementById('choices-container').innerHTML = '';
        document.querySelector('.game-bottom-area')?.classList?.remove('has-choices');
        document.getElementById('next-hint').style.display = 'block';

        // 顯示說話者與更新角色頭像/立繪
        const speakerEl = document.getElementById('speaker-name');
        const characterStage = document.getElementById('character-stage');
        const avatarWrapper = document.getElementById('dialogue-avatar-wrapper');
        const avatarImg = document.getElementById('dialogue-avatar-img');
        const avatarEmoji = document.getElementById('dialogue-avatar-emoji');

        let speakerName = '';
        let character = null;

        if (dialogue.speaker && dialogue.speaker !== 'narrator' && dialogue.speaker !== 'trainer') {
            character = GAME_DATA.characters[dialogue.speaker];
            speakerName = character ? character.name : dialogue.speaker;
            speakerEl.textContent = speakerName;
            speakerEl.style.color = character ? character.color : '#ecf0f1';
            speakerEl.style.borderLeftColor = character ? character.color : 'var(--primary-color)';
            speakerEl.style.setProperty?.('--speaker-color', character ? character.color : '#2eb85c');
        } else if (dialogue.speaker === 'trainer') {
            character = GAME_DATA.characters.trainer;
            speakerName = '訓練員（你）';
            speakerEl.textContent = speakerName;
            speakerEl.style.color = character.color;
            speakerEl.style.borderLeftColor = character.color;
            speakerEl.style.setProperty?.('--speaker-color', character.color || '#2980b9');
        } else {
            speakerEl.textContent = '';
            speakerEl.style.removeProperty?.('--speaker-color');
        }

        // 頭像/半身立繪顯示邏輯 (支援半身類 Live2D 立繪與圓形頭像自動切換)
        if (character && dialogue.speaker !== 'narrator') {
            if (characterStage) {
                characterStage.style.visibility = 'visible';
                characterStage.style.opacity = '1';
            }

            const expression = dialogue.expression || 'normal';

            if (character.stand) {
                if (characterStage) characterStage.classList.add('stand-mode');
                if (avatarWrapper) avatarWrapper.style.display = 'none';
                this.blinkManager.stopBlink();
                this.mouthManager.stopTalking();

                const standSrc = (character.standExpressions && character.standExpressions[expression]) || character.stand;
                this.livePortraitManager.showCharacter(dialogue.speaker, expression, standSrc, character.liveRig, character.stand);
            } else {
                if (characterStage) characterStage.classList.remove('stand-mode');
                this.livePortraitManager.hide();

                avatarWrapper.style.display = 'flex';
                avatarWrapper.style.borderColor = character.color;
                avatarWrapper.style.boxShadow = `0 10px 30px rgba(0, 0, 0, 0.6), 0 0 24px ${character.color ? character.color + '66' : 'var(--primary-glow)'}`;

                // 判斷是否有指定的表情差分
                let avatarSrc = character.avatar;
                if (character.expressions && character.expressions[expression]) {
                    avatarSrc = character.expressions[expression];
                }

                if (avatarSrc) {
                    avatarImg.src = avatarSrc;
                    avatarImg.style.display = 'block';
                    avatarEmoji.style.display = 'none';
                } else {
                    avatarImg.style.display = 'none';
                    avatarEmoji.innerHTML = `<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M5 20a7 7 0 0 1 14 0"/></svg>`;
                    avatarEmoji.style.display = 'flex';
                    avatarEmoji.style.backgroundColor = character.color;
                }

                // 啟動眨眼動畫與嘴部設定
                this.blinkManager.onCharacterChange(dialogue.speaker, expression);
                this.mouthManager.onCharacterChange(dialogue.speaker, expression);
            }
        } else {
            if (characterStage) {
                characterStage.classList.remove('stand-mode');
                characterStage.style.visibility = 'hidden';
                characterStage.style.opacity = '0';
            }
            avatarWrapper.style.display = 'none';
            this.blinkManager.stopBlink();
            this.mouthManager.stopTalking();
            this.livePortraitManager.hide();
        }

        // 添加到歷史記錄
        if (recordHistory) {
            this.historyManager.add(speakerName, dialogue.text, scene.location);
        }

        if (instant) {
            const dialogueEl = document.getElementById('dialogue-text');
            if (dialogueEl) dialogueEl.textContent = dialogue.text;
            this.stopTyping();
        } else {
            // 打字機逐字輸出
            this.typeText(dialogue.text);
        }
    }

    // 打字效果
    typeText(text) {
        this.stopTyping();
        const dialogueEl = document.getElementById('dialogue-text');
        const avatarWrapper = document.getElementById('dialogue-avatar-wrapper');
        dialogueEl.textContent = '';
        dialogueEl.classList.add('typing');
        if (avatarWrapper) avatarWrapper.classList.add('talking');
        if (this.livePortraitManager.isVisible) {
            this.livePortraitManager.setTalking(true);
        } else {
            this.mouthManager.startTalking();
        }
        this.isTyping = true;

        let index = 0;
        const speed = this.isCtrlPressed ? this.fastTypingSpeed : this.typingSpeed;

        // 即時顯示（速度為0時）
        if (speed === 0) {
            dialogueEl.textContent = text;
            this.stopTyping();
            if (this.isAutoMode) this.startAutoPlay();
            return;
        }

        this.typingInterval = setInterval(() => {
            if (index < text.length) {
                dialogueEl.textContent += text[index];
                if (this.livePortraitManager && this.livePortraitManager.isVisible && typeof this.livePortraitManager.onTypeChar === 'function') {
                    this.livePortraitManager.onTypeChar(text[index]);
                }
                // 每隔幾字發出打字音效
                if (index % 2 === 0) {
                    this.audioManager.playBlip();
                }
                index++;
            } else {
                this.stopTyping();

                if (this.isAutoMode) {
                    this.startAutoPlay();
                }
            }
        }, speed);
    }

    // 處理對話點擊
    handleDialogueClick() {
        this.clearAutoPlayTimer();

        if (this.isTyping) {
            this.skipCurrentTyping();
            if (this.isAutoMode) {
                this.startAutoPlay();
            }
        } else {
            this.currentDialogueIndex++;
            this.showDialogue();
        }
    }

    // 顯示選項
    showChoices(choices) {
        this.clearAutoPlayTimer();
        this.stopTyping();
        document.getElementById('next-hint').style.display = 'none';
        document.querySelector('.game-bottom-area')?.classList?.add('has-choices');

        const container = document.getElementById('choices-container');
        container.innerHTML = '';

        choices.forEach((choice) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';

            let html = `<span class="choice-text">${choice.text}</span>`;
            if (choice.hint) {
                html += `<span class="hint">${choice.hint}</span>`;
            }
            btn.innerHTML = html;

            btn.addEventListener('click', () => {
                this.audioManager.playClick();
                this.makeChoice(choice);
            });

            container.appendChild(btn);
        });
    }

    // 做出選擇
    makeChoice(choice) {
        this.clearAutoPlayTimer();

        let hadPositiveAffection = false;
        const deltas = [];
        if (choice.affectionChange) {
            for (let char in choice.affectionChange) {
                if (this.affection.hasOwnProperty(char)) {
                    const delta = choice.affectionChange[char];
                    this.affection[char] += delta;
                    if (this.affection[char] < 0) this.affection[char] = 0;
                    if (delta > 0) hadPositiveAffection = true;
                    if (delta !== 0) deltas.push({ charId: char, delta });
                }
            }
            this.updateAffectionUI();
            if (deltas.length > 0) {
                this.showAffectionDeltas(deltas);
            }

            // 好感度上升鈴聲
            if (hadPositiveAffection) {
                this.audioManager.playAffectionUp();
            }
        }

        if (choice.setFlags) {
            Object.assign(this.flags, choice.setFlags);
        }

        const next = this.resolveNextScene(choice);
        if (next) {
            this.loadScene(next);
        }
    }

    // 顯示好感度變動浮動提示氣泡 (Phase 1A)
    showAffectionDeltas(deltas = []) {
        const layer = document.getElementById('affection-float-layer');
        if (!layer || !Array.isArray(deltas) || deltas.length === 0) return;

        const shortLabels = {
            daiwa_scarlet: '赤驥',
            vodka: '伏特加',
            special_week: '特別週'
        };

        let scarletDelta = 0;
        let visibleIdx = 0;

        deltas.forEach(({ charId, delta }) => {
            if (!delta) return;
            if (charId === 'daiwa_scarlet') scarletDelta = delta;

            const isUp = delta > 0;
            const charData = (typeof CHARACTERS !== 'undefined' && CHARACTERS[charId]) || null;
            const label = shortLabels[charId] || charData?.name || charId;
            const signText = `${isUp ? '+' : ''}${delta}`;

            const iconSvg = charId === 'daiwa_scarlet'
                ? '<svg class="affection-float-icon" viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>'
                : '<svg class="affection-float-icon" viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><polygon points="12,2 15,9 22,9.5 16.5,14 18.2,21 12,17.2 5.8,21 7.5,14 2,9.5 9,9"/></svg>';

            const bubble = document.createElement('div');
            bubble.className = `affection-float-bubble ${isUp ? 'is-up' : 'is-down'} char-${charId}`;
            bubble.innerHTML = `${iconSvg}<span>${label} ${signText}</span>`;
            if (bubble.style) {
                bubble.style.animationDelay = `${visibleIdx * 110}ms`;
            }
            layer.appendChild(bubble);

            const removeTimer = setTimeout(() => {
                bubble.remove();
            }, 1550 + visibleIdx * 110);
            removeTimer?.unref?.();
            visibleIdx++;
        });

        if (scarletDelta !== 0) {
            const valEl = document.getElementById('affection-value');
            const barEl = document.querySelector('.affection-bar');
            const pulseClass = scarletDelta > 0 ? 'pulse-up' : 'pulse-down';
            [valEl, barEl].forEach((el) => {
                if (!el?.classList) return;
                el.classList.remove('pulse-up', 'pulse-down');
                el.classList.add(pulseClass);
            });
            if (this.affectionPulseTimer) clearTimeout(this.affectionPulseTimer);
            this.affectionPulseTimer = setTimeout(() => {
                [valEl, barEl].forEach((el) => el?.classList?.remove('pulse-up', 'pulse-down'));
                this.affectionPulseTimer = null;
            }, 650);
            this.affectionPulseTimer?.unref?.();
        }
    }

    // 章節過場標題卡 (Phase 1B)
    showChapterEyecatch(sceneId) {
        const intro = this.chapterIntros?.[sceneId];
        const overlay = document.getElementById('chapter-eyecatch');
        if (!intro || !overlay) return;

        if (this.eyecatchTimer) clearTimeout(this.eyecatchTimer);
        if (this.eyecatchHideTimer) clearTimeout(this.eyecatchHideTimer);
        this.eyecatchTimer = null;
        this.eyecatchHideTimer = null;

        const labelEl = document.getElementById('eyecatch-label');
        const titleEl = document.getElementById('eyecatch-title');
        const subtitleEl = document.getElementById('eyecatch-subtitle');
        if (labelEl) labelEl.textContent = intro.code;
        if (titleEl) titleEl.textContent = intro.title;
        if (subtitleEl) subtitleEl.textContent = intro.subtitle;

        this.clearAutoPlayTimer();
        this.isEyecatchActive = true;
        overlay.classList.remove('fade-out');
        overlay.classList.add('active');

        this.eyecatchTimer = setTimeout(() => {
            overlay.classList.add('fade-out');
            this.eyecatchHideTimer = setTimeout(() => {
                this.hideChapterEyecatch();
            }, 360);
            this.eyecatchHideTimer?.unref?.();
        }, 1950);
        this.eyecatchTimer?.unref?.();
    }

    hideChapterEyecatch() {
        if (this.eyecatchTimer) {
            clearTimeout(this.eyecatchTimer);
            this.eyecatchTimer = null;
        }
        if (this.eyecatchHideTimer) {
            clearTimeout(this.eyecatchHideTimer);
            this.eyecatchHideTimer = null;
        }
        const wasActive = this.isEyecatchActive;
        this.isEyecatchActive = false;
        const overlay = document.getElementById('chapter-eyecatch');
        overlay?.classList.remove('active', 'fade-out');
        if (wasActive) {
            this.resumeAutoPlayIfNeeded();
        }
    }

    // 更新好感度 UI
    updateAffectionUI() {
        const value = this.affection.daiwa_scarlet;
        const maxValue = 150;
        const percentage = Math.min((value / maxValue) * 100, 100);

        const fillEl = document.getElementById('affection-fill');
        const valEl = document.getElementById('affection-value');

        if (fillEl) fillEl.style.width = percentage + '%';
        if (valEl) valEl.textContent = value;
    }

    // 選單操作
    openMenu() {
        this.clearAutoPlayTimer();
        document.getElementById('menu-screen')?.classList.add('active');
    }

    closeMenu() {
        document.getElementById('menu-screen')?.classList.remove('active');
        this.resumeAutoPlayIfNeeded();
    }

    backToTitle() {
        this.closeAllOverlays();
        this.loadScene('title');
    }

    // ============================================
    // 存檔 / 讀檔彈窗管理 (多欄位)
    // ============================================
    openSaveModal(mode = 'save') {
        this.clearAutoPlayTimer();
        this.saveModalMode = mode;
        const modal = document.getElementById('save-modal-screen');
        const titleEl = document.getElementById('save-modal-title');
        if (titleEl) {
            const iconSvg = mode === 'save'
                ? `<svg class="modal-hdr-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`
                : `<svg class="modal-hdr-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`;
            const label = mode === 'save' ? '儲存進度 (選擇欄位)' : '讀取進度 (選擇欄位)';
            titleEl.innerHTML = `${iconSvg}<span>${label}</span>`;
        }

        this.renderSaveSlots();
        modal.classList.add('active');
    }

    closeSaveModal() {
        document.getElementById('save-modal-screen')?.classList.remove('active');
        this.resumeAutoPlayIfNeeded();
    }

    renderSaveSlots() {
        const container = document.getElementById('save-slots-container');
        container.innerHTML = '';

        const slots = this.saveManager.getAllSlots();
        slots.forEach(slot => {
            const card = document.createElement('div');
            card.className = `save-slot-card ${slot.data ? 'occupied' : 'empty'} ${slot.isAuto ? 'auto-slot' : ''}`;

            if (slot.data) {
                const dateStr = new Date(slot.data.timestamp).toLocaleString();
                card.innerHTML = `
                    <div class="save-slot-header">
                        <span class="save-slot-name">${slot.name}</span>
                        <span class="save-slot-date">${dateStr}</span>
                    </div>
                    <div class="save-slot-body">
                        <div class="save-slot-chapter">${slot.data.chapterName} - ${slot.data.location}</div>
                        <div class="save-slot-preview">「${slot.data.previewText}」</div>
                        <div class="save-slot-stats">
                            <span class="stat-chip"><svg class="meta-svg" viewBox="0 0 24 24" width="13" height="13" fill="#e64545" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>赤驥: ${slot.data.affection.daiwa_scarlet}</span>
                            <span class="stat-chip"><svg class="meta-svg" viewBox="0 0 24 24" width="13" height="13" fill="#9b59b6" aria-hidden="true"><polygon points="12,2 15,9 22,9.5 16.5,14 18.2,21 12,17.2 5.8,21 7.5,14 2,9.5 9,9"/></svg>伏特加: ${slot.data.affection.vodka}</span>
                            <span class="stat-chip"><svg class="meta-svg" viewBox="0 0 24 24" width="13" height="13" fill="#d9a036" aria-hidden="true"><polygon points="12,2 15,9 22,9.5 16.5,14 18.2,21 12,17.2 5.8,21 7.5,14 2,9.5 9,9"/></svg>特別週: ${slot.data.affection.special_week}</span>
                        </div>
                    </div>
                    <div class="save-slot-actions">
                        ${this.saveModalMode === 'save' && !slot.isAuto ? `
                            <button class="slot-action-btn primary" data-action="save" data-slot="${slot.id}">覆蓋儲存</button>
                        ` : ''}
                        ${this.saveModalMode === 'load' ? `
                            <button class="slot-action-btn primary" data-action="load" data-slot="${slot.id}">載入進度</button>
                        ` : ''}
                        ${!slot.isAuto ? `
                            <button class="slot-action-btn delete" data-action="delete" data-slot="${slot.id}">刪除</button>
                        ` : ''}
                    </div>
                `;
            } else {
                card.innerHTML = `
                    <div class="save-slot-header">
                        <span class="save-slot-name">${slot.name}</span>
                        <span class="save-slot-date">空白欄位</span>
                    </div>
                    <div class="save-slot-body">
                        <p class="empty-hint">尚未儲存任何進度</p>
                    </div>
                    <div class="save-slot-actions">
                        ${this.saveModalMode === 'save' && !slot.isAuto ? `
                            <button class="slot-action-btn primary" data-action="save" data-slot="${slot.id}">儲存至此</button>
                        ` : ''}
                    </div>
                `;
            }

            container.appendChild(card);
        });

        // 綁定欄位點擊事件
        container.querySelectorAll('.slot-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                const slotId = btn.dataset.slot;
                this.handleSlotAction(action, slotId);
            });
        });
    }

    handleSlotAction(action, slotId) {
        this.audioManager.playClick();

        if (action === 'save') {
            const result = this.saveManager.save(slotId, this.getSaveState());
            this.showToast(result.message);
            this.renderSaveSlots();
        } else if (action === 'load') {
            const result = this.saveManager.load(slotId);
            if (result.success) {
                this.currentScene = result.data.currentScene;
                this.currentDialogueIndex = result.data.currentDialogueIndex ?? 0;
                this.affection = {
                    daiwa_scarlet: 0,
                    vodka: 0,
                    special_week: 0,
                    ...(result.data.affection || {})
                };
                this.flags = { ...(result.data.flags || {}) };
                this.historyManager.restore(result.data.dialogueHistory);
                this.isUIHidden = false;
                document.getElementById('app')?.classList.remove('ui-hidden');

                this.updateAffectionUI();
                this.closeSaveModal();
                this.closeMenu();
                this.showScreen('game-screen');
                this.loadScene(this.currentScene, {
                    startDialogueIndex: this.currentDialogueIndex,
                    isLoad: true
                });
                this.showToast(result.message);
            } else {
                this.showToast(result.message);
            }
        } else if (action === 'delete') {
            if (confirm('確定要刪除這個存檔嗎？')) {
                this.saveManager.delete(slotId);
                this.renderSaveSlots();
                this.showToast('存檔已刪除');
            }
        }
    }

    // ============================================
    // 結局圖鑑彈窗 (Ending Gallery)
    // ============================================
    openGalleryModal() {
        this.clearAutoPlayTimer();
        const modal = document.getElementById('gallery-screen');
        const content = document.getElementById('gallery-content');

        content.innerHTML = this.galleryManager.generateHTML();
        modal.classList.add('active');

        // 綁定結局重溫按鈕
        content.querySelectorAll('.gallery-replay-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const endingId = btn.dataset.ending;
                this.replayEnding(endingId);
            });
        });
    }

    closeGalleryModal() {
        document.getElementById('gallery-screen')?.classList.remove('active');
        this.resumeAutoPlayIfNeeded();
    }

    replayEnding(endingId) {
        this.audioManager.playClick();
        const savedRecord = this.galleryManager?.unlocked?.[endingId];
        this.lastEndingMeta = {
            endingId,
            isNew: false,
            finalAffection: savedRecord?.maxAffection ?? this.affection.daiwa_scarlet
        };
        this.closeAllOverlays();
        this.showScreen('game-screen');
        this.loadScene(endingId);
    }

    // ============================================
    // 設定彈窗 (Settings)
    // ============================================
    openSettingsModal() {
        this.clearAutoPlayTimer();
        document.getElementById('settings-screen')?.classList.add('active');
    }

    closeSettingsModal() {
        document.getElementById('settings-screen')?.classList.remove('active');
        this.resumeAutoPlayIfNeeded();
    }

    // ============================================
    // 角色關係面板 (Relations)
    // ============================================
    openRelationsModal() {
        this.clearAutoPlayTimer();
        const modal = document.getElementById('relations-screen');
        const content = document.getElementById('relations-content');

        const relationConfigs = [
            {
                id: 'daiwa_scarlet',
                roleLabel: '主線攻略角色',
                max: 150,
                note: '解鎖結局關鍵'
            },
            {
                id: 'vodka',
                roleLabel: '競爭對手/助攻',
                max: 20,
                note: '達 8 分以上可觸發專屬助攻支線'
            },
            {
                id: 'special_week',
                roleLabel: '情報提供/室友',
                max: 10,
                note: '達 5 分以上可觸發宿舍日常支線'
            }
        ];

        content.innerHTML = relationConfigs.map(({ id, roleLabel, max, note }) => {
            const char = (typeof CHARACTERS !== 'undefined' && CHARACTERS[id]) || GAME_DATA.characters[id] || {};
            const val = this.affection[id] ?? 0;
            const pct = Math.max(0, Math.min((val / max) * 100, 100));
            const color = char.color || '#e74c3c';
            const avatar = char.avatar || '';
            const name = char.name || id;

            return `
                <div class="relation-card">
                    <div class="relation-avatar" style="border-color: ${color};">
                        <img src="${avatar}" alt="${name}">
                    </div>
                    <div class="relation-info">
                        <div class="relation-name">${name} (${roleLabel})</div>
                        <div class="relation-meter">
                            <div class="relation-meter-fill" style="width: ${pct}%; background-color: ${color};"></div>
                        </div>
                        <div class="relation-detail">當前好感度：<strong>${val}</strong> / ${max} (${note})</div>
                    </div>
                </div>
            `;
        }).join('');

        modal.classList.add('active');
    }

    closeRelationsModal() {
        document.getElementById('relations-screen')?.classList.remove('active');
        this.resumeAutoPlayIfNeeded();
    }

    // ============================================
    // 人物介紹彈窗 (Characters)
    // ============================================
    showCharacters() {
        this.clearAutoPlayTimer();
        const container = document.getElementById('chars-content');
        container.innerHTML = '';

        for (const id in CHARACTERS) {
            if (id === 'narrator') continue;
            const char = CHARACTERS[id];

            const card = document.createElement('div');
            card.className = 'char-card';
            card.style.borderLeftColor = char.color;

            let avatarHtml = '';
            if (char.avatar) {
                avatarHtml = `<img src="${char.avatar}" class="char-avatar-img" alt="${char.name}">`;
            } else {
                avatarHtml = `<div class="char-avatar" style="background-color: ${char.color}"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M5 20a7 7 0 0 1 14 0"/></svg></div>`;
            }

            card.innerHTML = `
                <div class="char-avatar-wrapper">
                    ${avatarHtml}
                </div>
                <div class="char-info">
                    <div class="char-name-row">
                        <span class="char-name" style="color: ${char.color}">${char.name}</span>
                        ${char.title ? `<span class="char-title">${char.title}</span>` : ''}
                    </div>
                    <div class="char-desc">${char.description}</div>
                </div>
            `;

            container.appendChild(card);
        }

        document.getElementById('chars-screen')?.classList.add('active');
    }

    closeCharacters() {
        document.getElementById('chars-screen')?.classList.remove('active');
        this.resumeAutoPlayIfNeeded();
    }

    // 顯示結局 - 根據好感度載入對應的結局場景並記錄至圖鑑
    showEnding() {
        const finalAffection = this.affection.daiwa_scarlet;
        let endingScene = '';

        if (finalAffection >= 121) {
            endingScene = 'ending_S';
        } else if (finalAffection >= 91) {
            endingScene = 'ending_A';
        } else if (finalAffection >= 61) {
            endingScene = 'ending_B';
        } else if (finalAffection >= 31) {
            endingScene = 'ending_C';
        } else {
            endingScene = 'ending_D';
        }

        // 解鎖圖鑑結局
        const unlockResult = this.galleryManager.unlock(endingScene, finalAffection);
        this.lastEndingMeta = {
            endingId: endingScene,
            isNew: !!unlockResult.isNew,
            finalAffection
        };
        if (unlockResult.isNew) {
            this.showToast(`達成新結局：【${unlockResult.endingInfo.title}】！已加入圖鑑！`);
        }

        // 播放結局勝利音效並統一載入結局場景
        this.audioManager.playFanfare();
        this.loadScene(endingScene);
    }

    // ============================================
    // 結局專屬結算勳章畫面 (Phase 1C)
    // ============================================
    openEndingResultModal(endingId = this.currentScene) {
        this.clearAutoPlayTimer();
        const modal = document.getElementById('ending-result-screen');
        if (!modal || !this.galleryManager?.endingsInfo) return;

        const info = this.galleryManager.endingsInfo[endingId] || this.galleryManager.endingsInfo.ending_D;
        const panel = document.getElementById('ending-result-panel');
        if (panel?.classList) {
            panel.classList.remove('rank-s', 'rank-a', 'rank-b', 'rank-c', 'rank-d');
            panel.classList.add(`rank-${info.rank.toLowerCase()}`);
        }

        const rankEl = document.getElementById('ending-medal-rank');
        const pillEl = document.getElementById('ending-badge-pill');
        const titleEl = document.getElementById('ending-result-title');
        const descEl = document.getElementById('ending-result-desc');
        const newBadgeEl = document.getElementById('ending-new-badge');

        if (rankEl) rankEl.textContent = info.rank;
        if (pillEl) pillEl.textContent = `RANK ${info.rank} · ${info.subtitle}`;
        if (titleEl) titleEl.textContent = info.title;
        if (descEl) descEl.textContent = info.desc;

        const isNewUnlock = !!(this.lastEndingMeta && this.lastEndingMeta.endingId === info.id && this.lastEndingMeta.isNew);
        newBadgeEl?.classList?.toggle('visible', isNewUnlock);

        const statsGrid = document.getElementById('ending-stats-grid');
        if (statsGrid) {
            const scarletScore = (this.affection.daiwa_scarlet > 0 || !this.lastEndingMeta || this.lastEndingMeta.endingId !== info.id)
                ? (this.affection.daiwa_scarlet ?? 0)
                : (this.lastEndingMeta.finalAffection ?? 0);

            const charItems = [
                { id: 'daiwa_scarlet', score: scarletScore, max: 150, isHeart: true },
                { id: 'vodka', score: this.affection.vodka ?? 0, max: 20, isHeart: false },
                { id: 'special_week', score: this.affection.special_week ?? 0, max: 10, isHeart: false }
            ];

            const charCardsHtml = charItems.map(({ id, score, max, isHeart }) => {
                const char = (typeof CHARACTERS !== 'undefined' && CHARACTERS[id]) || GAME_DATA?.characters?.[id] || {};
                const color = char.color || '#e64545';
                const name = char.name || id;
                const avatar = char.avatar || '';
                const iconSvg = isHeart
                    ? `<svg viewBox="0 0 24 24" width="13" height="13" fill="${color}" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`
                    : `<svg viewBox="0 0 24 24" width="13" height="13" fill="${color}" aria-hidden="true"><polygon points="12,2 15,9 22,9.5 16.5,14 18.2,21 12,17.2 5.8,21 7.5,14 2,9.5 9,9"/></svg>`;

                return `
                    <div class="ending-stat-card">
                        <div class="ending-stat-avatar" style="border-color: ${color};">
                            ${avatar ? `<img src="${avatar}" alt="${name}">` : iconSvg}
                        </div>
                        <div class="ending-stat-meta">
                            <div class="ending-stat-name">${name}</div>
                            <div class="ending-stat-score">${iconSvg}<span>${score} / ${max}</span></div>
                        </div>
                    </div>
                `;
            }).join('');

            const progress = this.galleryManager.getProgress();
            const trophySvg = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>';
            const galleryCardHtml = `
                <div class="ending-stat-card">
                    <div class="ending-stat-avatar ending-stat-gallery-icon">${trophySvg}</div>
                    <div class="ending-stat-meta">
                        <div class="ending-stat-name">圖鑑收集進度</div>
                        <div class="ending-stat-score"><span>${progress.count} / ${progress.total} (${progress.percentage}%)</span></div>
                    </div>
                </div>
            `;

            statsGrid.innerHTML = charCardsHtml + galleryCardHtml;
        }

        modal.classList.add('active');
    }

    closeEndingResultModal() {
        document.getElementById('ending-result-screen')?.classList.remove('active');
        this.resumeAutoPlayIfNeeded();
    }
}

// 匯出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameEngine };
}
