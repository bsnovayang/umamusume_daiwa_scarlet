// ============================================
// 存檔管理器
// ============================================

class SaveManager {
    constructor() {
        this.storageKey = 'umamusume_save';
    }
    
    // 儲存遊戲進度
    save(gameState) {
        try {
            const saveData = {
                currentScene: gameState.currentScene,
                currentDialogueIndex: gameState.currentDialogueIndex,
                affection: gameState.affection,
                dialogueHistory: gameState.dialogueHistory,
                timestamp: new Date().toISOString(),
                version: '0.3'
            };
            
            localStorage.setItem(this.storageKey, JSON.stringify(saveData));
            return { success: true, message: '進度已儲存！' };
        } catch (error) {
            console.error('存檔失敗:', error);
            return { success: false, message: '存檔失敗：' + error.message };
        }
    }
    
    // 讀取遊戲進度
    load() {
        try {
            const saveData = localStorage.getItem(this.storageKey);
            if (!saveData) {
                return { success: false, message: '沒有儲存的進度！' };
            }
            
            const data = JSON.parse(saveData);
            
            // 版本檢查
            if (data.version !== '0.3') {
                console.warn('存檔版本不匹配，嘗試相容處理');
            }
            
            return {
                success: true,
                data: {
                    currentScene: data.currentScene,
                    currentDialogueIndex: data.currentDialogueIndex,
                    affection: data.affection,
                    dialogueHistory: data.dialogueHistory || []
                },
                message: '進度已讀取！'
            };
        } catch (error) {
            console.error('讀檔失敗:', error);
            return { success: false, message: '讀檔失敗：' + error.message };
        }
    }
    
    // 檢查是否有存檔
    hasSave() {
        return localStorage.getItem(this.storageKey) !== null;
    }
    
    // 刪除存檔
    delete() {
        try {
            localStorage.removeItem(this.storageKey);
            return { success: true, message: '存檔已刪除！' };
        } catch (error) {
            return { success: false, message: '刪除失敗：' + error.message };
        }
    }
    
    // 取得存檔資訊
    getSaveInfo() {
        try {
            const saveData = localStorage.getItem(this.storageKey);
            if (!saveData) return null;
            
            const data = JSON.parse(saveData);
            return {
                timestamp: data.timestamp,
                scene: data.currentScene,
                version: data.version
            };
        } catch (error) {
            return null;
        }
    }
}

// 匯出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SaveManager };
}
