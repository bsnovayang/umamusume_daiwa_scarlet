// ============================================
// 主入口文件 - 初始化遊戲
// ============================================

// 確保 DOM 載入完成後再初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化遊戲引擎
    window.game = new GameEngine();

    console.log('賽馬娘戀愛模擬器 v1.0 已載入 - 全5章完整版');
    console.log('快捷鍵：Ctrl 加速 | H 歷史記錄 | A 自動播放 | ESC 關閉視窗');
});
