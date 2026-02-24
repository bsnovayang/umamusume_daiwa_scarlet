// ============================================
// 第一章：邂逅篇
// ============================================

const CHAPTER_1_SCENES = {};

// 1-1 初遇
CHAPTER_1_SCENES.prologue_start = {
    location: "特雷森學園 - 訓練場",
    dialogues: [
        { speaker: "narrator", text: "今天是成為特雷森學園訓練員的第一天。" },
        { speaker: "narrator", text: "你站在訓練場邊，看著學園的馬娘們正在練習。" },
        { speaker: "narrator", text: "突然，一個紅色身影從你面前飛奔而過。" },
        { speaker: "daiwa_scarlet", text: "呼...呼...還不夠！再快一點！" },
        { speaker: "narrator", text: "那個馬娘正在獨自加練，即使已經氣喘吁吁也不停下來。" },
        { speaker: "vodka", text: "喂！赤驥！妳又在做多餘的練習了啦！" },
        { speaker: "daiwa_scarlet", text: "伏特加...！妳才是，總是偷懶的話可是會被我甩在後面的！" },
        { speaker: "vodka", text: "哈哈哈！誰甩誰還不知道呢！" },
        { speaker: "narrator", text: "兩人的視線交錯，充滿了競爭的火花。" },
        { speaker: "daiwa_scarlet", text: "咦？你是...新來的訓練員？" },
        { speaker: "daiwa_scarlet", text: "哼...看起來不怎麼可靠的樣子。" },
        { speaker: "daiwa_scarlet", text: "我是大和赤驥。既然被你看到了，就讓你見識一下我的實力吧！" }
    ],
    nextScene: "first_choice"
};

CHAPTER_1_SCENES.first_choice = {
    location: "特雷森學園 - 訓練場",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "那個...你覺得我和伏特加，誰比較有冠軍相？" }
    ],
    choices: [
        { 
            text: "當然是赤驥妳了！", 
            hint: "+5 好感度",
            affectionChange: { daiwa_scarlet: 5 },
            nextScene: "choice_praise"
        },
        { 
            text: "兩位都很努力呢", 
            hint: "+2 好感度",
            affectionChange: { daiwa_scarlet: 2, vodka: 2 },
            nextScene: "choice_neutral"
        },
        { 
            text: "伏特加看起來很強啊", 
            hint: "-3 好感度",
            affectionChange: { daiwa_scarlet: -3, vodka: 3 },
            nextScene: "choice_vodka"
        }
    ]
};

CHAPTER_1_SCENES.choice_praise = {
    location: "特雷森學園 - 訓練場",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "哼...算你有眼光！" },
        { speaker: "daiwa_scarlet", text: "（小聲）不過...被稱讚還是會有點不好意思啦..." },
        { speaker: "vodka", text: "哈哈！赤驥臉紅了！" },
        { speaker: "daiwa_scarlet", text: "才、才沒有！伏特加妳閉嘴啦！" },
        { speaker: "daiwa_scarlet", text: "訓練員！我以後會讓你看到更多精彩的表現的！" },
        { speaker: "narrator", text: "大和赤驥鬥志滿滿地繼續練習去了。" }
    ],
    nextScene: "scene_cafeteria"
};

CHAPTER_1_SCENES.choice_neutral = {
    location: "特雷森學園 - 訓練場",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "嗯...這種敷衍的回答..." },
        { speaker: "vodka", text: "哈哈，訓練員還挺會說話的嘛！" },
        { speaker: "daiwa_scarlet", text: "算了...既然是第一天，我就先不計較了。" },
        { speaker: "daiwa_scarlet", text: "不過，以後可要好好地看我們的表現喔！" }
    ],
    nextScene: "scene_cafeteria"
};

CHAPTER_1_SCENES.choice_vodka = {
    location: "特雷森學園 - 訓練場",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "什...什麼！？" },
        { speaker: "daiwa_scarlet", text: "哼！你就後悔去吧！我一定會讓你刮目相看的！" },
        { speaker: "vodka", text: "嘿嘿，訓練員有眼光！不過赤驥也很厲害啦。" },
        { speaker: "daiwa_scarlet", text: "不用妳多嘴！" }
    ],
    nextScene: "scene_cafeteria"
};

// 1-2 食堂
CHAPTER_1_SCENES.scene_cafeteria = {
    location: "特雷森學園 - 食堂",
    dialogues: [
        { speaker: "narrator", text: "午休時間，你來到食堂用餐。" },
        { speaker: "narrator", text: "看到赤驥獨自坐在角落的桌子，面前放著滿滿的餐盤。" },
        { speaker: "special_week", text: "赤驥前輩吃得好認真呢！" },
        { speaker: "daiwa_scarlet", text: "當然了！飲食管理也是訓練的一部分！" },
        { speaker: "daiwa_scarlet", text: "特別週，妳也應該好好注意自己的飲食...咦？" },
        { speaker: "daiwa_scarlet", text: "啊，是訓練員。你該不會還沒吃飯吧？" }
    ],
    choices: [
        {
            text: "是啊，要一起吃嗎？",
            hint: "+5 好感度",
            affectionChange: { daiwa_scarlet: 5 },
            nextScene: "cafeteria_join"
        },
        {
            text: "打擾了，我去別的地方吃",
            hint: "+0 好感度",
            affectionChange: { daiwa_scarlet: 0 },
            nextScene: "cafeteria_leave"
        }
    ]
};

CHAPTER_1_SCENES.cafeteria_join = {
    location: "特雷森學園 - 食堂",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "欸！？一、一起吃飯...！？" },
        { speaker: "special_week", text: "好耶！人多比較熱鬧！" },
        { speaker: "daiwa_scarlet", text: "（小聲）既然特別週這麼說..." },
        { speaker: "daiwa_scarlet", text: "坐吧，訓練員。不過不要打擾我進食！" },
        { speaker: "narrator", text: "你坐在赤驥對面，開始用餐。" },
        { speaker: "special_week", text: "訓練員，你為什麼會選擇當訓練員呢？" },
        { speaker: "daiwa_scarlet", text: "...我也想知道。" },
        { speaker: "daiwa_scarlet", text: "（一邊吃飯一邊偷偷看著你）" }
    ],
    choices: [
        {
            text: "因為想幫助馬娘們實現夢想",
            hint: "+5 好感度",
            affectionChange: { daiwa_scarlet: 5 },
            nextScene: "dream_response"
        },
        {
            text: "因為喜歡看馬娘們奔跑的樣子",
            hint: "+3 好感度",
            affectionChange: { daiwa_scarlet: 3 },
            nextScene: "watch_response"
        }
    ]
};

CHAPTER_1_SCENES.cafeteria_leave = {
    location: "特雷森學園 - 走廊",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "啊...嗯，再見。" },
        { speaker: "special_week", text: "赤驥前輩看起來有點失落呢..." },
        { speaker: "daiwa_scarlet", text: "才、才沒有！我只是專心在吃飯而已！" },
        { speaker: "narrator", text: "雖然錯過了機會，但或許之後還有機會拉近距離。" }
    ],
    nextScene: "scene_library"
};

CHAPTER_1_SCENES.dream_response = {
    location: "特雷森學園 - 食堂",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "...幫助馬娘實現夢想嗎。" },
        { speaker: "daiwa_scarlet", text: "我的夢想是成為第一的馬娘。" },
        { speaker: "daiwa_scarlet", text: "不只是擊敗伏特加，還要成為讓大家認可的、真正的第一名。" },
        { speaker: "daiwa_scarlet", text: "訓練員...你願意幫我實現這個夢想嗎？" },
        { speaker: "special_week", text: "哇...這氣氛...我是不是該迴避一下？" },
        { speaker: "daiwa_scarlet", text: "特別週！妳在亂說什麼啦！" }
    ],
    nextScene: "scene_library"
};

CHAPTER_1_SCENES.watch_response = {
    location: "特雷森學園 - 食堂",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "只是...看看而已嗎。" },
        { speaker: "daiwa_scarlet", text: "不過...被看著奔跑，確實會讓人更有動力。" },
        { speaker: "daiwa_scarlet", text: "訓練員，明天的訓練，你要好好看著我喔！" }
    ],
    nextScene: "scene_library"
};

// 1-3 圖書館
CHAPTER_1_SCENES.scene_library = {
    location: "特雷森學園 - 圖書館",
    dialogues: [
        { speaker: "narrator", text: "午後，你在圖書館查閱訓練資料。" },
        { speaker: "narrator", text: "突然聽到輕輕的鼾聲。" },
        { speaker: "narrator", text: "轉頭一看，赤驥趴在桌上睡著了，旁邊堆滿了書籍。" },
        { speaker: "narrator", text: "看來是因為太努力學習而累壞了。" }
    ],
    choices: [
        {
            text: "悄悄幫她蓋上外套",
            hint: "+8 好感度",
            affectionChange: { daiwa_scarlet: 8 },
            nextScene: "library_gentle"
        },
        {
            text: "叫醒她提醒該休息了",
            hint: "+3 好感度",
            affectionChange: { daiwa_scarlet: 3 },
            nextScene: "library_wake"
        },
        {
            text: "不打擾她，安靜離開",
            hint: "+1 好感度",
            affectionChange: { daiwa_scarlet: 1 },
            nextScene: "library_leave"
        }
    ]
};

CHAPTER_1_SCENES.library_gentle = {
    location: "特雷森學園 - 圖書館",
    dialogues: [
        { speaker: "narrator", text: "你輕輕將外套蓋在赤驥身上。" },
        { speaker: "daiwa_scarlet", text: "嗯...唔..." },
        { speaker: "daiwa_scarlet", text: "...訓練員？" },
        { speaker: "narrator", text: "赤驥緩緩睜開眼睛，看到身上的外套，臉微微紅了。" },
        { speaker: "daiwa_scarlet", text: "這、這是你的外套...？" },
        { speaker: "daiwa_scarlet", text: "謝、謝謝...真是的，讓你看到這麼丟臉的樣子。" },
        { speaker: "daiwa_scarlet", text: "...不過，謝謝你。" },
        { speaker: "narrator", text: "赤驥緊緊抓著外套，聲音變得很小。" }
    ],
    nextScene: "scene_after_school"
};

CHAPTER_1_SCENES.library_wake = {
    location: "特雷森學園 - 圖書館",
    dialogues: [
        { speaker: "trainer", text: "赤驥，這裡睡會感冒的，回宿舍休息吧。" },
        { speaker: "daiwa_scarlet", text: "嗚...訓練員？我睡著了嗎..." },
        { speaker: "daiwa_scarlet", text: "糟了！書還沒看完！" },
        { speaker: "trainer", text: "健康也是訓練的一部分，今天就到此為止吧。" },
        { speaker: "daiwa_scarlet", text: "...說的也是。謝謝你叫我起來。" },
        { speaker: "daiwa_scarlet", text: "訓練員意外地很溫柔呢。" }
    ],
    nextScene: "scene_after_school"
};

CHAPTER_1_SCENES.library_leave = {
    location: "特雷森學園 - 圖書館",
    dialogues: [
        { speaker: "narrator", text: "你輕手輕腳地收拾資料準備離開。" },
        { speaker: "narrator", text: "但在門口時，聽到赤驥的呢喃。" },
        { speaker: "daiwa_scarlet", text: "...訓練員...不要走..." },
        { speaker: "narrator", text: "你停下腳步，回頭看著她。" },
        { speaker: "narrator", text: "或許...她也在尋找著什麼。" }
    ],
    nextScene: "scene_after_school"
};

// 1-4 放學後
CHAPTER_1_SCENES.scene_after_school = {
    location: "特雷森學園 - 校門口",
    dialogues: [
        { speaker: "narrator", text: "放學後，你準備離開學園。" },
        { speaker: "narrator", text: "看到赤驥站在校門口，似乎在等人。" },
        { speaker: "daiwa_scarlet", text: "啊！訓練員！" },
        { speaker: "daiwa_scarlet", text: "那個...今天謝謝你。" },
        { speaker: "daiwa_scarlet", text: "我、我只是想說這個而已！別誤會了！" },
        { speaker: "vodka", text: "喂~赤驥！妳在等誰啊？" },
        { speaker: "daiwa_scarlet", text: "伏、伏特加！？妳怎麼在這！？" },
        { speaker: "vodka", text: "嘿嘿，被我抓到了吧~赤驥在等訓練員呢！" },
        { speaker: "vodka", text: "訓練員，赤驥這傢伙很彆扭，但其實很努力的，請多關照她囉！" },
        { speaker: "daiwa_scarlet", text: "伏特加妳夠了！訓練員，明天見！" }
    ],
    nextScene: "chapter1_end"
};

CHAPTER_1_SCENES.chapter1_end = {
    location: "特雷森學園 - 訓練場",
    dialogues: [
        { speaker: "narrator", text: "就這樣，你與大和赤驥的關係開始了。" },
        { speaker: "narrator", text: "她驕傲、努力、有些彆扭。" },
        { speaker: "narrator", text: "但在那驕傲的外表下，你感覺到了一絲柔軟。" },
        { speaker: "narrator", text: "明天，又會有什麼樣的故事呢？" },
        { speaker: "narrator", text: "【第一章：邂逅 - 完】" }
    ],
    nextScene: "ch2_morning_run"
};

// 匯出場景
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CHAPTER_1_SCENES };
}
