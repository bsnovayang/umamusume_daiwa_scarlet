// ============================================
// 遊戲引擎 - AVG 功能強化版
// 新增功能：
// 1. Ctrl 鍵加速/跳過對話
// 2. 對話歷史記錄
// 3. 自動播放模式
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
        this.isTyping = false;
        this.typingSpeed = 50;
        this.fastTypingSpeed = 5; // Ctrl 按下時的速度
        this.typingInterval = null;
        
        // AVG 功能
        this.isCtrlPressed = false;
        this.dialogueHistory = []; // 對話歷史
        this.isAutoMode = false; // 自動播放
        this.autoPlayDelay = 2000; // 自動播放延遲
        this.autoPlayTimer = null;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.bindKeyboardEvents(); // 新增鍵盤事件
        this.updateAffectionUI();
    }
    
    // 綁定鍵盤事件
    bindKeyboardEvents() {
        // Ctrl 鍵檢測
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Control' || e.key === 'Ctrl') {
                this.isCtrlPressed = true;
                this.handleCtrlPress();
            }
            
            // H 鍵開啟歷史記錄
            if (e.key === 'h' || e.key === 'H') {
                this.toggleHistory();
            }
            
            // A 鍵切換自動播放
            if (e.key === 'a' || e.key === 'A') {
                this.toggleAutoMode();
            }
            
            // ESC 鍵關閉視窗
            if (e.key === 'Escape') {
                this.closeAllOverlays();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (e.key === 'Control' || e.key === 'Ctrl') {
                this.isCtrlPressed = false;
                this.handleCtrlRelease();
            }
        });
    }
    
    // Ctrl 按下處理
    handleCtrlPress() {
        if (this.isTyping) {
            // 如果正在打字，加速到最快
            this.speedUpTyping();
        } else {
            // 如果沒在打字，快速跳到下一個選項/對話
            this.fastForward();
        }
    }
    
    // Ctrl 放開處理
    handleCtrlRelease() {
        // 恢復正常打字速度
        if (this.isTyping) {
            this.slowDownTyping();
        }
    }
    
    // 加速打字
    speedUpTyping() {
        if (this.typingInterval) {
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
    }
    
    // 恢復正常打字速度
    slowDownTyping() {
        if (this.isTyping) {
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
                    
                    // 自動模式下，自動繼續
                    if (this.isAutoMode) {
                        this.autoPlayTimer = setTimeout(() => {
                            this.handleDialogueClick();
                        }, this.autoPlayDelay);
                    }
                }
            }, this.typingSpeed);
        }
    }
    
    // 快速跳過（跳到下一個選項）
    fastForward() {
        const scene = GAME_DATA.scenes[this.currentScene];
        if (!scene) return;
        
        // 清除自動播放計時器
        if (this.autoPlayTimer) {
            clearTimeout(this.autoPlayTimer);
        }
        
        if (scene.dialogues && this.currentDialogueIndex < scene.dialogues.length - 1) {
            // 快速顯示當前對話
            if (this.isTyping) {
                clearInterval(this.typingInterval);
                const dialogue = scene.dialogues[this.currentDialogueIndex];
                document.getElementById('dialogue-text').textContent = dialogue.text;
                document.getElementById('dialogue-text').classList.remove('typing');
                this.isTyping = false;
            }
            
            // 繼續到下一句
            this.currentDialogueIndex++;
            this.showDialogue();
        } else if (scene.dialogues && this.currentDialogueIndex >= scene.dialogues.length - 1) {
            // 已經到最後一句，直接顯示選項或下個場景
            if (this.isTyping) {
                clearInterval(this.typingInterval);
                const dialogue = scene.dialogues[this.currentDialogueIndex];
                document.getElementById('dialogue-text').textContent = dialogue.text;
                document.getElementById('dialogue-text').classList.remove('typing');
                this.isTyping = false;
            }
            
            if (scene.choices) {
                this.currentDialogueIndex++;
                this.showDialogue();
            } else if (scene.nextScene) {
                this.loadScene(scene.nextScene);
            }
        }
    }
    
    // 切換自動播放模式
    toggleAutoMode() {
        this.isAutoMode = !this.isAutoMode;
        
        // 顯示提示
        this.showToast(this.isAutoMode ? '自動播放：開啟' : '自動播放：關閉');
        
        // 如果開啟自動播放且目前沒在打字，開始自動播放
        if (this.isAutoMode && !this.isTyping) {
            this.autoPlayTimer = setTimeout(() => {
                this.handleDialogueClick();
            }, this.autoPlayDelay);
        }
    }
    
    // 添加到對話歷史
    addToHistory(speaker, text, location) {
        this.dialogueHistory.push({
            speaker: speaker,
            text: text,
            location: location,
            timestamp: new Date().toLocaleTimeString()
        });
        
        // 限制歷史記錄數量（保留最近100條）
        if (this.dialogueHistory.length > 100) {
            this.dialogueHistory.shift();
        }
    }
    
    // 切換歷史記錄顯示
    toggleHistory() {
        const historyScreen = document.getElementById('history-screen');
        if (historyScreen.classList.contains('active')) {
            this.closeHistory();
        } else {
            this.showHistory();
        }
    }
    
    // 顯示對話歷史
    showHistory() {
        const historyScreen = document.getElementById('history-screen');
        const historyContent = document.getElementById('history-content');
        
        // 生成歷史 HTML
        let html = '';
        if (this.dialogueHistory.length === 0) {
            html = '<div class="history-empty">尚無對話記錄</div>';
        } else {
            this.dialogueHistory.forEach((item, index) => {
                const speakerClass = item.speaker ? 'history-speaker' : 'history-narrator';
                const speakerName = item.speaker || '旁白';
                html += `
                    <div class="history-item">
                        <div class="history-location">${item.location}</div>
                        <div class="history-text">
                            <span class="${speakerClass}">${speakerName}：</span>
                            ${item.text}
                        </div>
                    </div>
                `;
            });
        }
        
        historyContent.innerHTML = html;
        historyScreen.classList.add('active');
        
        // 滾動到最底部
        historyContent.scrollTop = historyContent.scrollHeight;
    }
    
    // 關閉歷史記錄
    closeHistory() {
        document.getElementById('history-screen').classList.remove('active');
    }
    
    // 關閉所有覆蓋層
    closeAllOverlays() {
        this.closeHistory();
        this.closeMenu();
    }
    
    // 顯示提示訊息
    showToast(message) {
        // 移除舊的提示
        const oldToast = document.querySelector('.toast-message');
        if (oldToast) {
            oldToast.remove();
        }
        
        // 創建新提示
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // 2秒後移除
        setTimeout(() => {
            toast.remove();
        }, 2000);
    }
    
    bindEvents() {
        // 開始遊戲
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });
        
        // 對話區點擊
        document.getElementById('dialogue-box').addEventListener('click', () => {
            this.handleDialogueClick();
        });
        
        // 選單按鈕
        document.getElementById('menu-btn').addEventListener('click', () => {
            this.openMenu();
        });
        
        // 關閉選單
        document.getElementById('close-menu-btn').addEventListener('click', () => {
            this.closeMenu();
        });
        
        // 回到標題
        document.getElementById('back-to-title-btn').addEventListener('click', () => {
            this.backToTitle();
        });
        
        // 儲存進度
        document.getElementById('save-btn').addEventListener('click', () => {
            this.saveGame();
        });
        
        // 讀取進度
        document.getElementById('load-btn').addEventListener('click', () => {
            this.loadGame();
        });
        
        // 歷史記錄按鈕
        document.getElementById('history-btn').addEventListener('click', () => {
            this.toggleHistory();
        });
        
        // 關閉歷史
        document.getElementById('close-history-btn').addEventListener('click', () => {
            this.closeHistory();
        });
        
        // 自動播放按鈕
        document.getElementById('auto-btn').addEventListener('click', () => {
            this.toggleAutoMode();
        });
    }
    
    startGame() {
        this.currentScene = 'prologue_start';
        this.currentDialogueIndex = 0;
        this.affection = {
            daiwa_scarlet: 0,
            vodka: 0,
            special_week: 0
        };
        this.dialogueHistory = []; // 重置歷史
        this.isAutoMode = false; // 重置自動播放
        
        this.showScreen('game-screen');
        this.loadScene(this.currentScene);
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
    
    loadScene(sceneId) {
        // 清除自動播放計時器
        if (this.autoPlayTimer) {
            clearTimeout(this.autoPlayTimer);
        }
        
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
        
        // 更新地點
        if (scene.location) {
            document.getElementById('location-text').textContent = scene.location;
        }
        
        // 顯示對話或選項
        if (scene.dialogues && scene.dialogues.length > 0) {
            this.showDialogue();
        } else if (scene.choices) {
            this.showChoices(scene.choices);
        }
    }
    
    showDialogue() {
        const scene = GAME_DATA.scenes[this.currentScene];
        const dialogue = scene.dialogues[this.currentDialogueIndex];
        
        if (!dialogue) {
            // 對話結束，進入下一場景或顯示選項
            if (scene.choices) {
                this.showChoices(scene.choices);
            } else if (scene.nextScene) {
                this.loadScene(scene.nextScene);
            }
            return;
        }
        
        // 隱藏選項和下一頁提示
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
        this.addToHistory(speakerName, dialogue.text, scene.location);
        
        // 打字機效果顯示對話
        this.typeText(dialogue.text);
    }
    
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
                
                // 自動模式下，延遲後繼續
                if (this.isAutoMode) {
                    this.autoPlayTimer = setTimeout(() => {
                        this.handleDialogueClick();
                    }, this.autoPlayDelay);
                }
            }
        }, speed);
    }
    
    handleDialogueClick() {
        // 清除自動播放計時器
        if (this.autoPlayTimer) {
            clearTimeout(this.autoPlayTimer);
        }
        
        if (this.isTyping) {
            // 如果正在打字，直接顯示全部
            const scene = GAME_DATA.scenes[this.currentScene];
            const dialogue = scene.dialogues[this.currentDialogueIndex];
            
            clearInterval(this.typingInterval);
            document.getElementById('dialogue-text').textContent = dialogue.text;
            document.getElementById('dialogue-text').classList.remove('typing');
            this.isTyping = false;
            
            // 自動模式下，延遲後繼續
            if (this.isAutoMode) {
                this.autoPlayTimer = setTimeout(() => {
                    this.currentDialogueIndex++;
                    this.showDialogue();
                }, this.autoPlayDelay);
            }
        } else {
            // 進入下一句對話
            this.currentDialogueIndex++;
            this.showDialogue();
        }
    }
    
    showChoices(choices) {
        // 清除自動播放計時器
        if (this.autoPlayTimer) {
            clearTimeout(this.autoPlayTimer);
        }
        
        // 隱藏對話區的下一頁提示
        document.getElementById('next-hint').style.display = 'none';
        
        const container = document.getElementById('choices-container');
        container.innerHTML = '';
        
        choices.forEach((choice, index) => {
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
    
    makeChoice(choice) {
        // 清除自動播放計時器
        if (this.autoPlayTimer) {
            clearTimeout(this.autoPlayTimer);
        }
        
        // 更新好感度
        if (choice.affectionChange) {
            for (let char in choice.affectionChange) {
                if (this.affection.hasOwnProperty(char)) {
                    this.affection[char] += choice.affectionChange[char];
                    // 確保好感度不低於0
                    if (this.affection[char] < 0) {
                        this.affection[char] = 0;
                    }
                }
            }
            this.updateAffectionUI();
        }
        
        // 進入下一場景
        if (choice.nextScene) {
            this.loadScene(choice.nextScene);
        }
    }
    
    updateAffectionUI() {
        const value = this.affection.daiwa_scarlet;
        const maxValue = 150; // 更新為實際最大值
        const percentage = Math.min((value / maxValue) * 100, 100);
        
        document.getElementById('affection-fill').style.width = percentage + '%';
        document.getElementById('affection-value').textContent = value;
    }
    
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
    
    saveGame() {
        const saveData = {
            currentScene: this.currentScene,
            currentDialogueIndex: this.currentDialogueIndex,
            affection: this.affection,
            dialogueHistory: this.dialogueHistory
        };
        
        localStorage.setItem('umamusume_save', JSON.stringify(saveData));
        this.showToast('進度已儲存！');
        this.closeMenu();
    }
    
    loadGame() {
        const saveData = localStorage.getItem('umamusume_save');
        if (saveData) {
            const data = JSON.parse(saveData);
            this.currentScene = data.currentScene;
            this.currentDialogueIndex = data.currentDialogueIndex;
            this.affection = data.affection;
            this.dialogueHistory = data.dialogueHistory || [];
            
            this.updateAffectionUI();
            this.showScreen('game-screen');
            this.loadScene(this.currentScene);
            
            this.showToast('進度已讀取！');
        } else {
            this.showToast('沒有儲存的進度！');
        }
        this.closeMenu();
    }
    
    showEnding() {
        const finalAffection = this.affection.daiwa_scarlet;
        let endingTitle = '';
        let endingText = '';
        let endingRank = '';
        
        // 根據好感度決定結局
        if (finalAffection >= 121) {
            endingRank = 'S';
            endingTitle = '【真愛結局】永遠的搭檔';
            endingText = '櫻花樹下，赤驥撲進你的懷裡。\n\n「笨蛋...讓我等這麼久...」\n\n你們在櫻花雨中相擁。\n無論勝負，無論未來，你們約定永遠在一起。\n\n多年後，她退役了，但你們的愛情才剛開始...';
        } else if (finalAffection >= 91) {
            endingRank = 'A';
            endingTitle = '【甜蜜戀人】起跑線上的戀人';
            endingText = '櫻花樹下，赤驥紅著臉對你告白。\n\n「我喜歡你...不只是作為訓練員...」\n\n你握住她的手。\n從今天起，你們不只是訓練員和馬娘，而是互相扶持的戀人。';
        } else if (finalAffection >= 61) {
            endingRank = 'B';
            endingTitle = '【曖昧階段】未說出口的心意';
            endingText = '兩人都有心意，但誰都沒說破。\n\n在櫻花樹下，赤驥欲言又止。\n「訓練員，我...」\n\n最後她只說了「謝謝你」。\n但你知道...未來還有機會。';
        } else if (finalAffection >= 31) {
            endingRank = 'C';
            endingTitle = '【信賴夥伴】並肩前行的夥伴';
            endingText = '赤驥非常信賴你。\n\n她會主動找你商量事情，你們一起贏得許多比賽。\n\n但始終沒有跨越那條線...\n或許，這樣也不錯？';
        } else {
            endingRank = 'D';
            endingTitle = '【普通關係】訓練員與馬娘';
            endingText = '你們保持著專業的關係。\n\n赤驥尊重你，但始終保持距離。\n\n多年後，她成為了頂尖賽馬娘，而你也成為了知名訓練員。\n只是...你們的交集僅止於工作。';
        }
        
        const fullText = `${endingTitle}\n\n${endingText}\n\n═══════════════════════\n最終好感度：${finalAffection} 分\n結局評價：${endingRank} 級\n═══════════════════════\n\n感謝遊玩！`;
        
        document.getElementById('speaker-name').textContent = '';
        document.getElementById('dialogue-text').textContent = fullText;
        document.getElementById('choices-container').innerHTML = '';
        document.getElementById('next-hint').style.display = 'none';
        
        // 顯示回到標題的按鈕
        const container = document.getElementById('choices-container');
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = '回到標題';
        btn.addEventListener('click', () => {
            this.backToTitle();
        });
        container.appendChild(btn);
    }
    
    // 取得結局等級（用於統計）
    getEndingRank(affection) {
        if (affection >= 121) return 'S';
        if (affection >= 91) return 'A';
        if (affection >= 61) return 'B';
        if (affection >= 31) return 'C';
        return 'D';
    }
}

// 啟動遊戲
const game = new GameEngine();
