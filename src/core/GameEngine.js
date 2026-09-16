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

        // 初始化管理器
        this.saveManager = new SaveManager();
        this.historyManager = new HistoryManager();
        this.galleryManager = new GalleryManager();
        this.audioManager = new AudioManager();
        this.effectsManager = new EffectsManager();
        this.blinkManager = new BlinkManager();

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

    // 綁定鍵盤事件
    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            // 解鎖 Web Audio Context
            this.audioManager.initContext();

            if (e.key === 'Control' || e.key === 'Ctrl') {
                this.isCtrlPressed = true;
                this.handleCtrlPress();
            }

            if (e.key === 'h' || e.key === 'H') {
                this.toggleHistory();
            }

            if (e.key === 'a' || e.key === 'A') {
                this.toggleAutoMode();
            }

            if (e.key === 'v' || e.key === 'V') {
                this.toggleHideUI();
            }

            if (e.key === 'Escape') {
                if (this.isUIHidden) {
                    this.toggleHideUI(false);
                } else {
                    this.closeAllOverlays();
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
        const scene = GAME_DATA.scenes[this.currentScene];
        if (!scene || !scene.dialogues) return;
        const dialogue = scene.dialogues[this.currentDialogueIndex];
        const dialogueEl = document.getElementById('dialogue-text');
        const currentText = dialogueEl.textContent;
        const fullText = dialogue.text;

        let index = currentText.length;

        this.typingInterval = setInterval(() => {
            if (index < fullText.length) {
                dialogueEl.textContent += fullText[index];
                index++;
            } else {
                clearInterval(this.typingInterval);
                dialogueEl.classList.remove('typing');
                this.isTyping = false;
            }
        }, this.fastTypingSpeed);
    }

    // 快速跳過
    fastForward() {
        const scene = GAME_DATA.scenes[this.currentScene];
        if (!scene) return;

        this.clearAutoPlayTimer();

        if (scene.dialogues && this.currentDialogueIndex < scene.dialogues.length - 1) {
            if (this.isTyping) {
                this.skipCurrentTyping();
            }

            this.currentDialogueIndex++;
            this.showDialogue();
        } else if (scene.dialogues && this.currentDialogueIndex >= scene.dialogues.length - 1) {
            if (this.isTyping) {
                this.skipCurrentTyping();
            }

            if (scene.choices) {
                this.currentDialogueIndex++;
                this.showDialogue();
            } else if (scene.nextScene) {
                this.loadScene(scene.nextScene);
            }
        }
    }

    // 跳過當前打字
    skipCurrentTyping() {
        const scene = GAME_DATA.scenes[this.currentScene];
        if (!scene || !scene.dialogues) return;
        const dialogue = scene.dialogues[this.currentDialogueIndex];

        clearInterval(this.typingInterval);
        document.getElementById('dialogue-text').textContent = dialogue.text;
        document.getElementById('dialogue-text').classList.remove('typing');
        const avatarWrapper = document.getElementById('dialogue-avatar-wrapper');
        if (avatarWrapper) avatarWrapper.classList.remove('talking');
        this.isTyping = false;
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
        this.autoPlayTimer = setTimeout(() => {
            this.handleDialogueClick();
        }, this.autoPlayDelay);
    }

    clearAutoPlayTimer() {
        if (this.autoPlayTimer) {
            clearTimeout(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }

    // 隱藏/顯示 UI
    toggleHideUI(forceState = null) {
        this.isUIHidden = forceState !== null ? forceState : !this.isUIHidden;
        const app = document.getElementById('app');
        if (app) {
            app.classList.toggle('ui-hidden', this.isUIHidden);
        }
        if (this.isUIHidden) {
            this.showToast('UI 已隱藏，點擊畫面或按 ESC / V 鍵恢復');
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
        const historyScreen = document.getElementById('history-screen');
        const historyContent = document.getElementById('history-content');

        historyContent.innerHTML = this.historyManager.generateHTML();
        historyScreen.classList.add('active');
        historyContent.scrollTop = historyContent.scrollHeight;
    }

    closeHistory() {
        document.getElementById('history-screen').classList.remove('active');
    }

    // 關閉所有覆蓋層
    closeAllOverlays() {
        this.closeHistory();
        this.closeMenu();
        this.closeCharacters();
        this.closeSaveModal();
        this.closeGalleryModal();
        this.closeSettingsModal();
        this.closeRelationsModal();
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

        // 隱藏 UI 按鈕
        document.getElementById('hide-ui-btn')?.addEventListener('click', () => {
            this.toggleHideUI();
        });

        // 點擊背景恢復 UI (當 UI 隱藏時)
        document.getElementById('game-screen')?.addEventListener('click', (e) => {
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
        document.getElementById('close-history-btn')?.addEventListener('click', () => this.closeHistory());
        document.getElementById('auto-btn')?.addEventListener('click', () => this.toggleAutoMode());
        document.getElementById('close-chars-btn')?.addEventListener('click', () => this.closeCharacters());

        // 彈窗通用關閉按鈕
        document.getElementById('close-save-modal-btn')?.addEventListener('click', () => this.closeSaveModal());
        document.getElementById('close-gallery-btn')?.addEventListener('click', () => this.closeGalleryModal());
        document.getElementById('close-settings-btn')?.addEventListener('click', () => this.closeSettingsModal());
        document.getElementById('close-relations-btn')?.addEventListener('click', () => this.closeRelationsModal());

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

        if (bgmVolumeSlider) {
            bgmVolumeSlider.value = this.audioManager.bgmVolume;
            bgmVolumeSlider.addEventListener('input', (e) => {
                this.audioManager.setBgmVolume(parseFloat(e.target.value));
            });
        }

        if (sfxVolumeSlider) {
            sfxVolumeSlider.value = this.audioManager.sfxVolume;
            sfxVolumeSlider.addEventListener('input', (e) => {
                this.audioManager.setSfxVolume(parseFloat(e.target.value));
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
            });
        }
    }

    // 開始新遊戲
    startGame() {
        this.currentScene = 'prologue_start';
        this.currentDialogueIndex = 0;
        this.affection = {
            daiwa_scarlet: 0,
            vodka: 0,
            special_week: 0
        };
        this.historyManager.clear();
        this.isAutoMode = false;
        this.isUIHidden = false;

        const autoBtn = document.getElementById('auto-btn');
        if (autoBtn) autoBtn.classList.remove('active');

        this.showScreen('game-screen');
        this.loadScene(this.currentScene);
        
        // 初始自動存檔
        this.saveManager.autoSave({
            currentScene: this.currentScene,
            currentDialogueIndex: this.currentDialogueIndex,
            affection: this.affection,
            dialogueHistory: this.historyManager.getAll()
        });
    }

    // 顯示主要畫面
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId)?.classList.add('active');
    }

    // 載入場景
    loadScene(sceneId) {
        this.clearAutoPlayTimer();

        if (sceneId === 'title') {
            this.showScreen('title-screen');
            this.effectsManager.setEffect('sakura');
            this.audioManager.playBGM('daily');
            return;
        }

        if (sceneId === 'end') {
            this.showEnding();
            return;
        }

        const scene = GAME_DATA.scenes[sceneId];
        if (!scene) {
            console.error('Scene not found:', sceneId);
            return;
        }

        this.currentScene = sceneId;
        this.currentDialogueIndex = 0;

        // 更新場景名稱與動態氛圍特效
        if (scene.location) {
            document.getElementById('location-text').textContent = scene.location;
        }
        this.effectsManager.updateSceneEffect(scene);

        // 依據場景類型切換 BGM
        this.updateSceneBGM(sceneId, scene);

        // 章節轉換時自動存檔
        if (sceneId.includes('_start') || sceneId === 'ch5_the_race') {
            this.saveManager.autoSave({
                currentScene: this.currentScene,
                currentDialogueIndex: this.currentDialogueIndex,
                affection: this.affection,
                dialogueHistory: this.historyManager.getAll()
            });
        }

        if (scene.dialogues && scene.dialogues.length > 0) {
            this.showDialogue();
        } else if (scene.choices) {
            this.showChoices(scene.choices);
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
    showDialogue() {
        const scene = GAME_DATA.scenes[this.currentScene];
        const dialogue = scene.dialogues[this.currentDialogueIndex];

        if (!dialogue) {
            if (scene.choices) {
                this.showChoices(scene.choices);
            } else if (scene.nextScene) {
                this.loadScene(scene.nextScene);
            }
            return;
        }

        document.getElementById('choices-container').innerHTML = '';
        document.getElementById('next-hint').style.display = 'block';

        // 顯示說話者與更新角色頭像/立繪
        const speakerEl = document.getElementById('speaker-name');
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
        } else if (dialogue.speaker === 'trainer') {
            character = GAME_DATA.characters.trainer;
            speakerName = '訓練員（你）';
            speakerEl.textContent = speakerName;
            speakerEl.style.color = character.color;
        } else {
            speakerEl.textContent = '';
        }

        // 頭像顯示邏輯 (支援表情差分)
        if (character && dialogue.speaker !== 'narrator') {
            avatarWrapper.style.display = 'flex';
            avatarWrapper.style.borderColor = character.color;

            // 判斷是否有指定的表情差分
            let avatarSrc = character.avatar;
            const expression = dialogue.expression || 'normal';
            if (character.expressions && character.expressions[expression]) {
                avatarSrc = character.expressions[expression];
            }

            if (avatarSrc) {
                avatarImg.src = avatarSrc;
                avatarImg.style.display = 'block';
                avatarEmoji.style.display = 'none';
            } else {
                avatarImg.style.display = 'none';
                avatarEmoji.textContent = character.emoji || '👤';
                avatarEmoji.style.display = 'block';
                avatarEmoji.style.backgroundColor = character.color;
            }

            // 啟動眨眼動畫
            this.blinkManager.onCharacterChange(dialogue.speaker, expression);
        } else {
            avatarWrapper.style.display = 'none';
            this.blinkManager.stopBlink();
        }

        // 添加到歷史記錄
        this.historyManager.add(speakerName, dialogue.text, scene.location);

        // 打字機逐字輸出
        this.typeText(dialogue.text);
    }

    // 打字效果
    typeText(text) {
        const dialogueEl = document.getElementById('dialogue-text');
        const avatarWrapper = document.getElementById('dialogue-avatar-wrapper');
        dialogueEl.textContent = '';
        dialogueEl.classList.add('typing');
        if (avatarWrapper) avatarWrapper.classList.add('talking');
        this.isTyping = true;

        let index = 0;
        const speed = this.isCtrlPressed ? this.fastTypingSpeed : this.typingSpeed;

        if (this.typingInterval) {
            clearInterval(this.typingInterval);
        }

        // 即時顯示（速度為0時）
        if (speed === 0) {
            dialogueEl.textContent = text;
            dialogueEl.classList.remove('typing');
            if (avatarWrapper) avatarWrapper.classList.remove('talking');
            this.isTyping = false;
            if (this.isAutoMode) this.startAutoPlay();
            return;
        }

        this.typingInterval = setInterval(() => {
            if (index < text.length) {
                dialogueEl.textContent += text[index];
                // 每隔幾字發出打字音效
                if (index % 2 === 0) {
                    this.audioManager.playBlip();
                }
                index++;
            } else {
                clearInterval(this.typingInterval);
                dialogueEl.classList.remove('typing');
                if (avatarWrapper) avatarWrapper.classList.remove('talking');
                this.isTyping = false;

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
        document.getElementById('next-hint').style.display = 'none';

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
        if (choice.affectionChange) {
            for (let char in choice.affectionChange) {
                if (this.affection.hasOwnProperty(char)) {
                    const delta = choice.affectionChange[char];
                    this.affection[char] += delta;
                    if (this.affection[char] < 0) this.affection[char] = 0;
                    if (delta > 0) hadPositiveAffection = true;
                }
            }
            this.updateAffectionUI();

            // 好感度上升鈴聲
            if (hadPositiveAffection) {
                this.audioManager.playAffectionUp();
            }
        }

        if (choice.nextScene) {
            this.loadScene(choice.nextScene);
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
        document.getElementById('menu-screen')?.classList.add('active');
    }

    closeMenu() {
        document.getElementById('menu-screen')?.classList.remove('active');
    }

    backToTitle() {
        this.closeAllOverlays();
        this.loadScene('title');
    }

    // ============================================
    // 存檔 / 讀檔彈窗管理 (多欄位)
    // ============================================
    openSaveModal(mode = 'save') {
        this.saveModalMode = mode;
        const modal = document.getElementById('save-modal-screen');
        const titleEl = document.getElementById('save-modal-title');
        titleEl.textContent = mode === 'save' ? '💾 儲存進度 (選擇欄位)' : '📂 讀取進度 (選擇欄位)';

        this.renderSaveSlots();
        modal.classList.add('active');
    }

    closeSaveModal() {
        document.getElementById('save-modal-screen')?.classList.remove('active');
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
                        <div class="save-slot-stats">💖 赤驥: ${slot.data.affection.daiwa_scarlet} | 🍸 伏特加: ${slot.data.affection.vodka} | ⭐ 特別週: ${slot.data.affection.special_week}</div>
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
            const result = this.saveManager.save(slotId, {
                currentScene: this.currentScene,
                currentDialogueIndex: this.currentDialogueIndex,
                affection: this.affection,
                dialogueHistory: this.historyManager.getAll()
            });
            this.showToast(result.message);
            this.renderSaveSlots();
        } else if (action === 'load') {
            const result = this.saveManager.load(slotId);
            if (result.success) {
                this.currentScene = result.data.currentScene;
                this.currentDialogueIndex = result.data.currentDialogueIndex;
                this.affection = result.data.affection;
                this.historyManager.restore(result.data.dialogueHistory);

                this.updateAffectionUI();
                this.closeSaveModal();
                this.closeMenu();
                this.showScreen('game-screen');
                this.loadScene(this.currentScene);
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
    }

    replayEnding(endingId) {
        this.audioManager.playClick();
        this.closeAllOverlays();
        this.showScreen('game-screen');
        this.loadScene(endingId);
    }

    // ============================================
    // 設定彈窗 (Settings)
    // ============================================
    openSettingsModal() {
        document.getElementById('settings-screen')?.classList.add('active');
    }

    closeSettingsModal() {
        document.getElementById('settings-screen')?.classList.remove('active');
    }

    // ============================================
    // 角色關係面板 (Relations)
    // ============================================
    openRelationsModal() {
        const modal = document.getElementById('relations-screen');
        const content = document.getElementById('relations-content');

        content.innerHTML = `
            <div class="relation-card">
                <div class="relation-avatar" style="border-color: #e74c3c;">
                    <img src="img/daiwa_scarlet.png" alt="大和赤驥">
                </div>
                <div class="relation-info">
                    <div class="relation-name">大和赤驥 (主線攻略角色)</div>
                    <div class="relation-meter">
                        <div class="relation-meter-fill" style="width: ${Math.min((this.affection.daiwa_scarlet / 150) * 100, 100)}%; background-color: #e74c3c;"></div>
                    </div>
                    <div class="relation-detail">當前好感度：<strong>${this.affection.daiwa_scarlet}</strong> / 150 (解鎖結局關鍵)</div>
                </div>
            </div>
            <div class="relation-card">
                <div class="relation-avatar" style="border-color: #9b59b6;">
                    <img src="img/vodka.jpg" alt="伏特加">
                </div>
                <div class="relation-info">
                    <div class="relation-name">伏特加 (競爭對手/助攻)</div>
                    <div class="relation-meter">
                        <div class="relation-meter-fill" style="width: ${Math.min((this.affection.vodka / 50) * 100, 100)}%; background-color: #9b59b6;"></div>
                    </div>
                    <div class="relation-detail">當前好感度：<strong>${this.affection.vodka}</strong> (提升赤驥互動深度)</div>
                </div>
            </div>
            <div class="relation-card">
                <div class="relation-avatar" style="border-color: #f39c12;">
                    <img src="img/special_week.jpg" alt="特別週">
                </div>
                <div class="relation-info">
                    <div class="relation-name">特別週 (情報提供/室友)</div>
                    <div class="relation-meter">
                        <div class="relation-meter-fill" style="width: ${Math.min((this.affection.special_week / 50) * 100, 100)}%; background-color: #f39c12;"></div>
                    </div>
                    <div class="relation-detail">當前好感度：<strong>${this.affection.special_week}</strong> (開啟支線驚喜)</div>
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    closeRelationsModal() {
        document.getElementById('relations-screen')?.classList.remove('active');
    }

    // ============================================
    // 人物介紹彈窗 (Characters)
    // ============================================
    showCharacters() {
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
                avatarHtml = `<div class="char-avatar" style="background-color: ${char.color}">${char.emoji || '👤'}</div>`;
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
        if (unlockResult.isNew) {
            this.showToast(`🎉 達成新結局：【${unlockResult.endingInfo.title}】！已加入圖鑑！`);
        }

        // 播放結局勝利音效與浪漫音樂
        this.audioManager.playFanfare();
        this.audioManager.playBGM('romance');

        // 載入結局場景
        const scene = GAME_DATA.scenes[endingScene];
        if (scene) {
            this.currentScene = endingScene;
            this.currentDialogueIndex = 0;

            if (scene.location) {
                document.getElementById('location-text').textContent = scene.location;
            }
            this.effectsManager.updateSceneEffect(scene);

            if (scene.dialogues && scene.dialogues.length > 0) {
                this.showDialogue();
            }
        }
    }
}

// 匯出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameEngine };
}
