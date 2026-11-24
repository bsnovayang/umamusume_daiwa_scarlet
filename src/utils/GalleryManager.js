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
                    <span class="meta-label"><svg class="meta-svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#d9a036" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>結局收集進度</span>
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
                                <span class="meta-label"><svg class="meta-svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>${dateStr}</span>
                                <span class="meta-label"><svg class="meta-svg" viewBox="0 0 24 24" width="13" height="13" fill="#e64545" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>好感度 ${unlockData.maxAffection}</span>
                            </div>
                        ` : ''}
                    </div>
                    <div class="gallery-card-actions">
                        ${isUnlocked ? `
                            <button class="gallery-replay-btn" data-ending="${id}">
                                <svg class="meta-svg" viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>重溫結局
                            </button>
                        ` : `
                            <span class="gallery-lock-hint"><svg class="meta-svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>尚未達成</span>
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
