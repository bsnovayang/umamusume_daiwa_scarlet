// ============================================
// 對話歷史管理器
// ============================================

class HistoryManager {
    constructor(maxHistory = 100) {
        this.history = [];
        this.maxHistory = maxHistory;
    }
    
    // 添加對話到歷史
    add(speaker, text, location) {
        const entry = {
            speaker: speaker,
            text: text,
            location: location,
            timestamp: new Date().toLocaleTimeString()
        };
        
        this.history.push(entry);
        
        // 限制歷史記錄數量
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
    }
    
    // 取得所有歷史
    getAll() {
        return [...this.history];
    }
    
    // 清空歷史
    clear() {
        this.history = [];
    }
    
    // 從保存的資料恢復
    restore(savedHistory) {
        if (Array.isArray(savedHistory)) {
            this.history = savedHistory;
        }
    }
    
    // 生成 HTML
    generateHTML() {
        if (this.history.length === 0) {
            return '<div class="history-empty">尚無對話記錄</div>';
        }
        
        let html = '';
        this.history.forEach((item) => {
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
        
        return html;
    }
    
    // 取得最後一條記錄
    getLast() {
        return this.history.length > 0 ? this.history[this.history.length - 1] : null;
    }
    
    // 取得記錄數量
    getCount() {
        return this.history.length;
    }
}

// 匯出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HistoryManager };
}
