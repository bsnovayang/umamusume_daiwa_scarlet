// ============================================
// 角色定義 (支援資料夾路徑與表情差分)
// ============================================

const CHARACTERS = {
    daiwa_scarlet: {
        id: "daiwa_scarlet",
        name: "大和赤驥",
        title: "永遠的第一名",
        color: "#e74c3c",
        avatar: "img/daiwa_scarlet/normal.png",
        emoji: "🏇",
        expressions: {
            normal: "img/daiwa_scarlet/normal.png",
            blush: "img/daiwa_scarlet/blush.png",
            pout: "img/daiwa_scarlet/blush.png", // 暫時映射
            sad: "img/daiwa_scarlet/normal.png",
            joy: "img/daiwa_scarlet/normal.png"
        },
        description: "自尊心強且非常認真努力的馬娘，視伏特加為最大宿敵兼摯友。"
    },
    vodka: {
        id: "vodka",
        name: "伏特加",
        title: "狂野的追逐者",
        color: "#9b59b6",
        avatar: "img/vodka/normal.jpg",
        emoji: "🍸",
        expressions: {
            normal: "img/vodka/normal.jpg"
        },
        description: "性格豪爽不羈的帥氣馬娘，與赤驥相互競爭與成長。"
    },
    special_week: {
        id: "special_week",
        name: "特別週",
        title: "元氣鄉下少女",
        color: "#f39c12",
        avatar: "img/special_week/normal.jpg",
        emoji: "⭐",
        expressions: {
            normal: "img/special_week/normal.jpg"
        },
        description: "性格天然呆、充滿幹勁的赤驥室友，經常提供熱心助攻與情報。"
    },
    gold_ship: {
        id: "gold_ship",
        name: "黃金船",
        title: "無法預測的怪人",
        color: "#e67e22",
        avatar: "img/gold_ship/normal.jpg",
        emoji: "🚢",
        expressions: {
            normal: "img/gold_ship/normal.jpg"
        },
        description: "隊伍中的行動不可預測者，時不時帶來意想不到的搞笑插曲。"
    },
    mejiro_mcqueen: {
        id: "mejiro_mcqueen",
        name: "目白麥昆",
        title: "目白家的榮耀",
        color: "#7fb3d8",
        avatar: null,
        emoji: "🌺",
        expressions: {},
        description: "名門目白家的大小姐，氣質端莊優雅，對甜點無法抗拒。"
    },
    trainer: {
        id: "trainer",
        name: "訓練員",
        title: "玩家角色",
        color: "#3498db",
        avatar: null,
        emoji: "👤",
        expressions: {},
        description: "特雷森學園新人訓練員（你），全心全力支持馬娘們的夢想。"
    },
    narrator: {
        id: "narrator",
        name: "",
        title: "",
        color: "#ecf0f1",
        avatar: null,
        emoji: "📖",
        expressions: {},
        description: "旁白描述"
    }
};

// 匯出角色資料
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CHARACTERS };
}
