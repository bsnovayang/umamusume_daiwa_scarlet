// ============================================
// 角色定義
// ============================================

const CHARACTERS = {
    daiwa_scarlet: {
        id: "daiwa_scarlet",
        name: "大和赤驥",
        color: "#e74c3c",
        description: "認真努力的馬娘，視伏特加為競爭對手"
    },
    vodka: {
        id: "vodka",
        name: "伏特加",
        color: "#9b59b6",
        description: "赤驥的競爭對手兼摯友"
    },
    special_week: {
        id: "special_week",
        name: "特別週",
        color: "#f39c12",
        description: "赤驥的室友，天然呆"
    },
    gold_ship: {
        id: "gold_ship",
        name: "黃金船",
        color: "#e67e22",
        description: "同隊的怪人"
    },
    mejiro_mcqueen: {
        id: "mejiro_mcqueen",
        name: "目白麥昆",
        color: "#7fb3d8",
        description: "學園的大小姐，氣質優雅"
    },
    trainer: {
        id: "trainer",
        name: "訓練員",
        color: "#3498db",
        description: "玩家角色"
    },
    narrator: {
        id: "narrator",
        name: "",
        color: "#ecf0f1",
        description: "旁白"
    }
};

// 匯出角色資料
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CHARACTERS };
}
