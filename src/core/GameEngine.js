// ============================================
// 遊戲引擎 - 核心邏輯
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
        this.typingSpeed = 50;
        this.fastTypingSpeed = 5;
        this.typingInterval = null;

        // 快捷鍵狀態
        this.isCtrlPressed = false;

        // 自動播放
        this.isAutoMode = false;
        this.autoPlayDelay = 2000;
        this.autoPlayTimer = null;

        // 初始化管理器
        this.saveManager = new SaveManager();
        this.historyManager = new HistoryManager();

        this.init();
    }

    init() {
        this.bindEvents();
        this.bindKeyboardEvents();
        this.updateAffectionUI();
    }

    // 綁定鍵盤事件
    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
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

            if (e.key === 'Escape') {
                this.closeAllOverlays();
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
        const dialogue = scene.dialogues[this.currentDialogueIndex];

        clearInterval(this.typingInterval);
        document.getElementById('dialogue-text').textContent = dialogue.text;
        document.getElementById('dialogue-text').classList.remove('typing');
        this.isTyping = false;
    }

    // 切換自動播放
    toggleAutoMode() {
        this.isAutoMode = !this.isAutoMode;
        this.showToast(this.isAutoMode ? '自動播放：開啟' : '自動播放：關閉');

        // 更新按鈕狀態
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
        this.autoPlayTimer = setTimeout(() => {
            this.handleDialogueClick();
        }, this.autoPlayDelay);
    }

    // 清除自動播放計時器
    clearAutoPlayTimer() {
        if (this.autoPlayTimer) {
            clearTimeout(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }

    // 切換歷史記錄
    toggleHistory() {
        const historyScreen = document.getElementById('history-screen');
        if (historyScreen.classList.contains('active')) {
            this.closeHistory();
        } else {
            this.showHistory();
        }
    }

    // 顯示歷史
    showHistory() {
        const historyScreen = document.getElementById('history-screen');
        const historyContent = document.getElementById('history-content');

        historyContent.innerHTML = this.historyManager.generateHTML();
        historyScreen.classList.add('active');
        historyContent.scrollTop = historyContent.scrollHeight;
    }

    // 關閉歷史
    closeHistory() {
        document.getElementById('history-screen').classList.remove('active');
    }

    // 關閉所有覆蓋層
    closeAllOverlays() {
        this.closeHistory();
        this.closeMenu();
        this.closeCharacters();
    }

    // 顯示提示
    showToast(message) {
        const oldToast = document.querySelector('.toast-message');
        if (oldToast) oldToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.remove(), 2000);
    }

    // 綁定事件
    bindEvents() {
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('dialogue-box').addEventListener('click', () => {
            this.handleDialogueClick();
        });

        document.getElementById('menu-btn').addEventListener('click', () => {
            this.openMenu();
        });

        document.getElementById('close-menu-btn').addEventListener('click', () => {
            this.closeMenu();
        });

        document.getElementById('back-to-title-btn').addEventListener('click', () => {
            this.backToTitle();
        });

        document.getElementById('save-btn').addEventListener('click', () => {
            this.saveGame();
        });

        document.getElementById('load-btn').addEventListener('click', () => {
            this.loadGame();
        });

        document.getElementById('history-btn').addEventListener('click', () => {
            this.toggleHistory();
        });

        document.getElementById('close-history-btn').addEventListener('click', () => {
            this.closeHistory();
        });

        document.getElementById('auto-btn').addEventListener('click', () => {
            this.toggleAutoMode();
        });

        document.getElementById('chars-btn').addEventListener('click', () => {
            this.showCharacters();
        });

        document.getElementById('close-chars-btn').addEventListener('click', () => {
            this.closeCharacters();
        });
    }

    // 開始遊戲
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

        const autoBtn = document.getElementById('auto-btn');
        if (autoBtn) autoBtn.classList.remove('active');

        this.showScreen('game-screen');
        this.loadScene(this.currentScene);
    }

    // 顯示畫面
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    // 載入場景
    loadScene(sceneId) {
        this.clearAutoPlayTimer();

        if (sceneId === 'title') {
            this.showScreen('title-screen');
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

        if (scene.location) {
            document.getElementById('location-text').textContent = scene.location;
        }

        if (scene.dialogues && scene.dialogues.length > 0) {
            this.showDialogue();
        } else if (scene.choices) {
            this.showChoices(scene.choices);
        }
    }

    // 顯示對話
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

        // 顯示說話者
        const speakerEl = document.getElementById('speaker-name');
        let speakerName = '';

        if (dialogue.speaker && dialogue.speaker !== 'narrator' && dialogue.speaker !== 'trainer') {
            const character = GAME_DATA.characters[dialogue.speaker];
            speakerName = character ? character.name : dialogue.speaker;
            speakerEl.textContent = speakerName;
            speakerEl.style.color = character ? character.color : '#ecf0f1';
        } else if (dialogue.speaker === 'trainer') {
            speakerName = '訓練員（你）';
            speakerEl.textContent = speakerName;
            speakerEl.style.color = GAME_DATA.characters.trainer.color;
        } else {
            speakerEl.textContent = '';
        }

        // 添加到歷史
        this.historyManager.add(speakerName, dialogue.text, scene.location);

        // 打字機效果
        this.typeText(dialogue.text);
    }

    // 打字效果
    typeText(text) {
        const dialogueEl = document.getElementById('dialogue-text');
        dialogueEl.textContent = '';
        dialogueEl.classList.add('typing');
        this.isTyping = true;

        let index = 0;
        const speed = this.isCtrlPressed ? this.fastTypingSpeed : this.typingSpeed;

        if (this.typingInterval) {
            clearInterval(this.typingInterval);
        }

        this.typingInterval = setInterval(() => {
            if (index < text.length) {
                dialogueEl.textContent += text[index];
                index++;
            } else {
                clearInterval(this.typingInterval);
                dialogueEl.classList.remove('typing');
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

            let html = choice.text;
            if (choice.hint) {
                html += `<span class="hint">${choice.hint}</span>`;
            }
            btn.innerHTML = html;

            btn.addEventListener('click', () => {
                this.makeChoice(choice);
            });

            container.appendChild(btn);
        });
    }

    // 做出選擇
    makeChoice(choice) {
        this.clearAutoPlayTimer();

        if (choice.affectionChange) {
            for (let char in choice.affectionChange) {
                if (this.affection.hasOwnProperty(char)) {
                    this.affection[char] += choice.affectionChange[char];
                    if (this.affection[char] < 0) {
                        this.affection[char] = 0;
                    }
                }
            }
            this.updateAffectionUI();
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

        document.getElementById('affection-fill').style.width = percentage + '%';
        document.getElementById('affection-value').textContent = value;
    }

    // 選單操作
    openMenu() {
        document.getElementById('menu-screen').classList.add('active');
    }

    closeMenu() {
        document.getElementById('menu-screen').classList.remove('active');
    }

    backToTitle() {
        this.closeMenu();
        this.showScreen('title-screen');
    }

    // 人物介紹
    showCharacters() {
        const container = document.getElementById('chars-content');
        container.innerHTML = '';

        const charEmojis = {
            daiwa_scarlet: '🏇',
            vodka: '🍸',
            special_week: '⭐',
            gold_ship: '🚢',
            mejiro_mcqueen: '🌺',
            trainer: '👤'
        };

        for (const id in CHARACTERS) {
            if (id === 'narrator') continue;
            const char = CHARACTERS[id];

            const card = document.createElement('div');
            card.className = 'char-card';
            card.style.borderLeftColor = char.color;

            const emoji = charEmojis[id] || '❓';

            card.innerHTML = `
                <div class="char-avatar" style="background-color: ${char.color}">${emoji}</div>
                <div class="char-info">
                    <div class="char-name" style="color: ${char.color}">${char.name}</div>
                    <div class="char-desc">${char.description}</div>
                </div>
            `;

            container.appendChild(card);
        }

        document.getElementById('chars-screen').classList.add('active');
    }

    closeCharacters() {
        document.getElementById('chars-screen').classList.remove('active');
    }

    // 存檔
    saveGame() {
        const result = this.saveManager.save({
            currentScene: this.currentScene,
            currentDialogueIndex: this.currentDialogueIndex,
            affection: this.affection,
            dialogueHistory: this.historyManager.getAll()
        });

        this.showToast(result.message);
        this.closeMenu();
    }

    // 讀檔
    loadGame() {
        const result = this.saveManager.load();

        if (result.success) {
            this.currentScene = result.data.currentScene;
            this.currentDialogueIndex = result.data.currentDialogueIndex;
            this.affection = result.data.affection;
            this.historyManager.restore(result.data.dialogueHistory);

            this.updateAffectionUI();
            this.showScreen('game-screen');
            this.loadScene(this.currentScene);
        }

        this.showToast(result.message);
        this.closeMenu();
    }

    // 顯示結局 - 根據好感度載入對應的結局場景
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

        // 載入結局場景（使用正常的對話系統）
        const scene = GAME_DATA.scenes[endingScene];
        if (scene) {
            this.currentScene = endingScene;
            this.currentDialogueIndex = 0;

            if (scene.location) {
                document.getElementById('location-text').textContent = scene.location;
            }

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
