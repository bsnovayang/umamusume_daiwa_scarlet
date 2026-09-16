// ============================================
// 結局圖鑑與成就管理器
// ============================================

class GalleryManager {
    constructor() {
        this.storageKey = 'umamusume_gallery';
        this.endingsInfo = {
            ending_S: {
                id: 'ending_S',
                rank: 'S',
                title: '永遠的搭檔',
                subtitle: '真愛結局',
                color: '#e74c3c',
                condition: '赤驥好感度 121 分以上',
                desc: '在盛開的櫻花雨中，你們互訴衷腸，約定成為一輩子的靈魂伴侶與搭檔。',
                bgClass: 'ending-card-s'
            },
            ending_A: {
                id: 'ending_A',
                rank: 'A',
                title: '起跑線上的戀人',
                subtitle: '甜蜜戀人',
                color: '#e67e22',
                condition: '赤驥好感度 91 ~ 120 分',
                desc: '月光下傳遞的真心，從訓練員與賽馬娘，跨越成為彼此最重要的戀人。',
                bgClass: 'ending-card-a'
            },
            ending_B: {
                id: 'ending_B',
                rank: 'B',
                title: '未說出口的心意',
                subtitle: '曖昧階段',
                color: '#f39c12',
                condition: '赤驥好感度 61 ~ 90 分',
                desc: '彼此心意相通卻始終帶著一絲羞澀未曾點破，未來的日子裡依然陪伴在側。',
                bgClass: 'ending-card-b'
            },
            ending_C: {
                id: 'ending_C',
                rank: 'C',
                title: '並肩前行的夥伴',
                subtitle: '信賴夥伴',
                color: '#3498db',
                condition: '赤驥好感度 31 ~ 60 分',
                desc: '建立起深厚的信賴，成為賽場上最具默契的搭檔與引路人。',
                bgClass: 'ending-card-c'
            },
            ending_D: {
                id: 'ending_D',
                rank: 'D',
                title: '訓練員與馬娘',
                subtitle: '普通關係',
                color: '#95a5a6',
                condition: '赤驥好感度 0 ~ 30 分',
                desc: '恪守本分的專業關係，雖然彼此尊重，但各自奔向了不同的人生跑道。',
                bgClass: 'ending-card-d'
            }
        };

        this.unlocked = this.load();
    }

    load() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.warn('載入圖鑑資料失敗:', e);
            return {};
        }
    }

    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.unlocked));
        } catch (e) {
            console.warn('儲存圖鑑資料失敗:', e);
        }
    }

    // 解鎖結局
    unlock(endingId, affection = 0) {
        if (!this.endingsInfo[endingId]) return { isNew: false };

        const isNew = !this.unlocked[endingId];
        this.unlocked[endingId] = {
            unlockedAt: this.unlocked[endingId]?.unlockedAt || new Date().toISOString(),
            maxAffection: Math.max(affection, this.unlocked[endingId]?.maxAffection || 0)
        };

        this.save();
        return { isNew, endingInfo: this.endingsInfo[endingId] };
    }

    // 取得解鎖數量與總數
    getProgress() {
        const total = Object.keys(this.endingsInfo).length;
        const count = Object.keys(this.unlocked).length;
        const percentage = Math.round((count / total) * 100);
        return { count, total, percentage };
    }

    // 生成圖鑑 HTML
    generateHTML() {
        const progress = this.getProgress();
        let html = `
            <div class="gallery-progress-bar-container">
                <div class="gallery-progress-header">
                    <span>🏆 結局收集進度</span>
                    <span class="gallery-progress-text">${progress.count} / ${progress.total} (${progress.percentage}%)</span>
                </div>
                <div class="gallery-progress-track">
                    <div class="gallery-progress-fill" style="width: ${progress.percentage}%"></div>
                </div>
            </div>
            <div class="gallery-grid">
        `;

        for (const [id, info] of Object.entries(this.endingsInfo)) {
            const isUnlocked = !!this.unlocked[id];
            const unlockData = this.unlocked[id];
            const dateStr = isUnlocked ? new Date(unlockData.unlockedAt).toLocaleDateString() : '';

            html += `
                <div class="gallery-card ${info.bgClass} ${isUnlocked ? 'unlocked' : 'locked'}">
                    <div class="gallery-card-badge" style="background-color: ${info.color}">
                        ${info.rank} 級
                    </div>
                    <div class="gallery-card-header">
                        <h4>${isUnlocked ? info.title : '？？？？？'}</h4>
                        <span class="gallery-card-sub">${isUnlocked ? info.subtitle : '未解鎖結局'}</span>
                    </div>
                    <div class="gallery-card-body">
                        <p class="gallery-card-desc">
                            ${isUnlocked ? info.desc : '條件：' + info.condition}
                        </p>
                        ${isUnlocked ? `
                            <div class="gallery-card-meta">
                                <span>📅 ${dateStr}</span>
                                <span>💖 好感度 ${unlockData.maxAffection}</span>
                            </div>
                        ` : ''}
                    </div>
                    <div class="gallery-card-actions">
                        ${isUnlocked ? `
                            <button class="gallery-replay-btn" data-ending="${id}">
                                ▶ 重溫結局
                            </button>
                        ` : `
                            <span class="gallery-lock-hint">🔒 尚未達成</span>
                        `}
                    </div>
                </div>
            `;
        }

        html += `</div>`;
        return html;
    }
}

// 匯出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GalleryManager };
}
