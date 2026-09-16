// ============================================
// 多欄位存檔與讀檔管理器 v2.0
// ============================================

class SaveManager {
    constructor() {
        this.storageKey = 'umamusume_saves_v2';
        this.maxManualSlots = 4;
        this.slots = this.loadAllFromStorage();
    }

    loadAllFromStorage() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (raw) {
                return JSON.parse(raw);
            }
            
            // 相容舊版存檔
            const oldSave = localStorage.getItem('umamusume_save');
            if (oldSave) {
                const oldData = JSON.parse(oldSave);
                const converted = {
                    slot_1: {
                        currentScene: oldData.currentScene,
                        currentDialogueIndex: oldData.currentDialogueIndex,
                        affection: oldData.affection,
                        dialogueHistory: oldData.dialogueHistory || [],
                        timestamp: oldData.timestamp || new Date().toISOString(),
                        chapterName: '歷史舊存檔',
                        location: '特雷森學園',
                        previewText: '從舊版存檔遷移',
                        version: '2.0'
                    }
                };
                localStorage.setItem(this.storageKey, JSON.stringify(converted));
                return converted;
            }
            return {};
        } catch (e) {
            console.warn('載入存檔列表失敗:', e);
            return {};
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.slots));
        } catch (e) {
            console.error('寫入存檔至 localStorage 失敗:', e);
        }
    }

    // 取得章節名稱輔助函式
    getChapterName(sceneId = '') {
        if (sceneId.startsWith('prologue') || sceneId.startsWith('ch1_')) return '第一章：邂逅';
        if (sceneId.startsWith('ch2_') || sceneId.startsWith('chapter2_')) return '第二章：接近';
        if (sceneId.startsWith('ch3_') || sceneId.startsWith('chapter3_')) return '第三章：心意';
        if (sceneId.startsWith('ch4_') || sceneId.startsWith('chapter4_')) return '第四章：考驗';
        if (sceneId.startsWith('ch5_') || sceneId.startsWith('chapter5_')) return '第五章：終章';
        if (sceneId.startsWith('ending_')) return '★ 結局 ★';
        return '進行中進度';
    }

    // 儲存至特定欄位 (slot_1, slot_2, slot_3, slot_4, slot_auto)
    save(slotId, gameState) {
        try {
            const scene = (typeof GAME_DATA !== 'undefined' && GAME_DATA.scenes) ? GAME_DATA.scenes[gameState.currentScene] : null;
            const currentDialogue = scene?.dialogues?.[gameState.currentDialogueIndex];

            const saveData = {
                currentScene: gameState.currentScene,
                currentDialogueIndex: gameState.currentDialogueIndex,
                affection: { ...gameState.affection },
                dialogueHistory: gameState.dialogueHistory || [],
                chapterName: this.getChapterName(gameState.currentScene),
                location: scene?.location || '特雷森學園',
                previewText: currentDialogue?.text?.substring(0, 30) || '無預覽文字',
                timestamp: new Date().toISOString(),
                version: '2.0'
            };

            this.slots[slotId] = saveData;
            this.saveToStorage();

            const slotName = slotId === 'slot_auto' ? '自動存檔' : `進度欄位 ${slotId.replace('slot_', '')}`;
            return { success: true, message: `已成功儲存至【${slotName}】！` };
        } catch (error) {
            console.error('存檔失敗:', error);
            return { success: false, message: '存檔失敗：' + error.message };
        }
    }

    // 自動存檔
    autoSave(gameState) {
        return this.save('slot_auto', gameState);
    }

    // 讀取特定欄位
    load(slotId) {
        try {
            const data = this.slots[slotId];
            if (!data) {
                return { success: false, message: '此欄位尚無儲存進度！' };
            }

            return {
                success: true,
                data: {
                    currentScene: data.currentScene,
                    currentDialogueIndex: data.currentDialogueIndex,
                    affection: data.affection,
                    dialogueHistory: data.dialogueHistory || []
                },
                message: '進度讀取成功！'
            };
        } catch (error) {
            console.error('讀檔失敗:', error);
            return { success: false, message: '讀檔失敗：' + error.message };
        }
    }

    // 刪除特定欄位
    delete(slotId) {
        try {
            if (this.slots[slotId]) {
                delete this.slots[slotId];
                this.saveToStorage();
                return { success: true, message: '存檔已刪除！' };
            }
            return { success: false, message: '存檔不存在！' };
        } catch (error) {
            return { success: false, message: '刪除失敗：' + error.message };
        }
    }

    // 取得所有欄位列表
    getAllSlots() {
        const list = [];
        
        // 自動存檔
        list.push({
            id: 'slot_auto',
            name: '自動存檔 (Auto)',
            isAuto: true,
            data: this.slots['slot_auto'] || null
        });

        // 手動存檔欄位 1~4
        for (let i = 1; i <= this.maxManualSlots; i++) {
            const id = `slot_${i}`;
            list.push({
                id,
                name: `存檔欄位 ${i}`,
                isAuto: false,
                data: this.slots[id] || null
            });
        }

        return list;
    }

    hasAnySave() {
        return Object.keys(this.slots).length > 0;
    }
}

// 匯出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SaveManager };
}
