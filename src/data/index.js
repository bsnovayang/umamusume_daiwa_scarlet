// ============================================
// 資料索引 - 匯總所有劇本資料
// ============================================

// 確保所有章節資料已載入
const GAME_DATA = {
    characters: CHARACTERS,
    scenes: {}
};

// 合併所有章節場景
Object.assign(GAME_DATA.scenes, CHAPTER_1_SCENES);
Object.assign(GAME_DATA.scenes, CHAPTER_2_SCENES);
Object.assign(GAME_DATA.scenes, CHAPTER_3_SCENES);
Object.assign(GAME_DATA.scenes, CHAPTER_4_SCENES);
Object.assign(GAME_DATA.scenes, CHAPTER_5_SCENES);

// ============================================
// 結局場景 (根據好感度分歧)
// ============================================

// S級 真愛結局 (121+)
GAME_DATA.scenes.ending_S = {
    location: "特雷森學園 - 櫻花樹下 ★真愛結局★",
    dialogues: [
        { speaker: "narrator", text: "═══ 結局 S：永遠的搭檔 ═══" },
        { speaker: "narrator", text: "櫻花瓣在月光中飛舞，像是為你們祝福一樣。" },
        { speaker: "daiwa_scarlet", text: "訓練員...我、我有話要對你說......" },
        { speaker: "daiwa_scarlet", text: "不對...不用說了。" },
        { speaker: "narrator", text: "赤驥突然衝了過來——" },
        { speaker: "narrator", text: "撲進了你的懷裡。" },
        { speaker: "daiwa_scarlet", text: "笨蛋......讓我等這麼久......" },
        { speaker: "daiwa_scarlet", text: "我喜歡你。不是作為訓練員...是作為一個人。" },
        { speaker: "daiwa_scarlet", text: "從第一天見面的時候就......！" },
        { speaker: "narrator", text: "你的手輕輕地環上了她的背。" },
        { speaker: "trainer", text: "我也是......一直都是。" },
        { speaker: "narrator", text: "你們在櫻花雨中相擁。" },
        { speaker: "narrator", text: "無論勝負，無論未來——" },
        { speaker: "narrator", text: "你們約定永遠在一起。" },
        { speaker: "narrator", text: "多年後，她退役了。" },
        { speaker: "narrator", text: "但你們的故事，才剛剛開始......" },
        { speaker: "narrator", text: "——THE END——" }
    ],
    choices: [
        { text: "回到標題", hint: "", affectionChange: {}, nextScene: "title" }
    ]
};

// A級 甜蜜戀人 (91-120)
GAME_DATA.scenes.ending_A = {
    location: "特雷森學園 - 櫻花樹下 ★甜蜜戀人★",
    dialogues: [
        { speaker: "narrator", text: "═══ 結局 A：起跑線上的戀人 ═══" },
        { speaker: "narrator", text: "櫻花瓣輕輕飄落在赤驥的髮間。" },
        { speaker: "daiwa_scarlet", text: "訓練員...那個......" },
        { speaker: "daiwa_scarlet", text: "......我喜歡你。" },
        { speaker: "daiwa_scarlet", text: "不只是作為訓練員...是、是那種喜歡......" },
        { speaker: "narrator", text: "赤驥紅著臉，聲音越說越小。" },
        { speaker: "narrator", text: "但她的眼睛直直地看著你，沒有逃避。" },
        { speaker: "narrator", text: "你握住了她的手。" },
        { speaker: "trainer", text: "我也喜歡妳，赤驥。" },
        { speaker: "daiwa_scarlet", text: "......！真的...？" },
        { speaker: "trainer", text: "真的。" },
        { speaker: "narrator", text: "從今天起，你們不只是訓練員和馬娘——" },
        { speaker: "narrator", text: "而是互相扶持的戀人。" },
        { speaker: "narrator", text: "——THE END——" }
    ],
    choices: [
        { text: "回到標題", hint: "", affectionChange: {}, nextScene: "title" }
    ]
};

// B級 曖昧階段 (61-90)
GAME_DATA.scenes.ending_B = {
    location: "特雷森學園 - 櫻花樹下 ★曖昧階段★",
    dialogues: [
        { speaker: "narrator", text: "═══ 結局 B：未說出口的心意 ═══" },
        { speaker: "narrator", text: "櫻花飄落，月光灑在兩人之間。" },
        { speaker: "daiwa_scarlet", text: "訓練員，我......" },
        { speaker: "narrator", text: "赤驥欲言又止。" },
        { speaker: "narrator", text: "她張了張嘴，最終還是沒有說出那句話。" },
        { speaker: "daiwa_scarlet", text: "......謝謝你。一直以來。" },
        { speaker: "narrator", text: "你看著她的背影消失在夜色裡。" },
        { speaker: "narrator", text: "你們都有心意，但誰都沒有說破。" },
        { speaker: "narrator", text: "但你知道......未來還有機會。" },
        { speaker: "narrator", text: "只要她還在跑，你就會一直在這裡。" },
        { speaker: "narrator", text: "——THE END——" }
    ],
    choices: [
        { text: "回到標題", hint: "", affectionChange: {}, nextScene: "title" }
    ]
};

// C級 信賴夥伴 (31-60)
GAME_DATA.scenes.ending_C = {
    location: "特雷森學園 - 櫻花樹下 ★信賴夥伴★",
    dialogues: [
        { speaker: "narrator", text: "═══ 結局 C：並肩前行的夥伴 ═══" },
        { speaker: "narrator", text: "月光下，赤驥站在你面前。" },
        { speaker: "daiwa_scarlet", text: "訓練員，謝謝你一直支持我。" },
        { speaker: "daiwa_scarlet", text: "有你在，我覺得自己可以繼續前進。" },
        { speaker: "narrator", text: "赤驥非常信賴你。" },
        { speaker: "narrator", text: "她會主動找你商量事情，你們一起贏得許多比賽。" },
        { speaker: "narrator", text: "但始終沒有跨越那條線......" },
        { speaker: "narrator", text: "或許......這樣也不錯？" },
        { speaker: "narrator", text: "——THE END——" }
    ],
    choices: [
        { text: "回到標題", hint: "", affectionChange: {}, nextScene: "title" }
    ]
};

// D級 普通關係 (0-30)
GAME_DATA.scenes.ending_D = {
    location: "特雷森學園 - 櫻花樹下 ★普通關係★",
    dialogues: [
        { speaker: "narrator", text: "═══ 結局 D：訓練員與馬娘 ═══" },
        { speaker: "narrator", text: "月光下，赤驥禮貌地點了點頭。" },
        { speaker: "daiwa_scarlet", text: "訓練員，今天辛苦了。" },
        { speaker: "daiwa_scarlet", text: "...那我先回去了。明天見。" },
        { speaker: "narrator", text: "你們保持著專業的關係。" },
        { speaker: "narrator", text: "赤驥尊重你，但始終保持著距離。" },
        { speaker: "narrator", text: "多年後，她成為了頂尖賽馬娘。" },
        { speaker: "narrator", text: "而你也成為了知名訓練員。" },
        { speaker: "narrator", text: "只是......你們的交集，僅止於工作。" },
        { speaker: "narrator", text: "——THE END——" }
    ],
    choices: [
        { text: "回到標題", hint: "", affectionChange: {}, nextScene: "title" }
    ]
};

// 匯出供模組使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GAME_DATA };
}
