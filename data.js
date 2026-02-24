// ============================================
// 大和赤驥篇 - 劇本資料
// 架構說明：
// 1. 每個場景(scene)獨立為一個物件
// 2. 對話(dialogues)使用統一格式
// 3. 選項(choices)統一包含 text/hint/affectionChange/nextScene
// ============================================

const GAME_DATA = {
    // 角色定義
    characters: {
        daiwa_scarlet: {
            name: "大和赤驥",
            color: "#e74c3c"
        },
        vodka: {
            name: "伏特加", 
            color: "#9b59b6"
        },
        special_week: {
            name: "特別週",
            color: "#f39c12"
        },
        trainer: {
            name: "訓練員",
            color: "#3498db"
        },
        narrator: {
            name: "",
            color: "#ecf0f1"
        }
    },
    
    // 場景資料
    scenes: {}
};

// ============================================
// 第一章：邂逅篇
// ============================================
GAME_DATA.scenes.prologue_start = {
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

GAME_DATA.scenes.first_choice = {
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

GAME_DATA.scenes.choice_praise = {
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

GAME_DATA.scenes.choice_neutral = {
    location: "特雷森學園 - 訓練場",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "嗯...這種敷衍的回答..." },
        { speaker: "vodka", text: "哈哈，訓練員還挺會說話的嘛！" },
        { speaker: "daiwa_scarlet", text: "算了...既然是第一天，我就先不計較了。" },
        { speaker: "daiwa_scarlet", text: "不過，以後可要好好地看我們的表現喔！" }
    ],
    nextScene: "scene_cafeteria"
};

GAME_DATA.scenes.choice_vodka = {
    location: "特雷森學園 - 訓練場",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "什...什麼！？" },
        { speaker: "daiwa_scarlet", text: "哼！你就後悔去吧！我一定會讓你刮目相看的！" },
        { speaker: "vodka", text: "嘿嘿，訓練員有眼光！不過赤驥也很厲害啦。" },
        { speaker: "daiwa_scarlet", text: "不用妳多嘴！" }
    ],
    nextScene: "scene_cafeteria"
};

GAME_DATA.scenes.scene_cafeteria = {
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

GAME_DATA.scenes.cafeteria_join = {
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

GAME_DATA.scenes.cafeteria_leave = {
    location: "特雷森學園 - 走廊",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "啊...嗯，再見。" },
        { speaker: "special_week", text: "赤驥前輩看起來有點失落呢..." },
        { speaker: "daiwa_scarlet", text: "才、才沒有！我只是專心在吃飯而已！" },
        { speaker: "narrator", text: "雖然錯過了機會，但或許之後還有機會拉近距離。" }
    ],
    nextScene: "scene_library"
};

GAME_DATA.scenes.dream_response = {
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

GAME_DATA.scenes.watch_response = {
    location: "特雷森學園 - 食堂",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "只是...看看而已嗎。" },
        { speaker: "daiwa_scarlet", text: "不過...被看著奔跑，確實會讓人更有動力。" },
        { speaker: "daiwa_scarlet", text: "訓練員，明天的訓練，你要好好看著我喔！" }
    ],
    nextScene: "scene_library"
};

GAME_DATA.scenes.scene_library = {
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

GAME_DATA.scenes.library_gentle = {
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

GAME_DATA.scenes.library_wake = {
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

GAME_DATA.scenes.library_leave = {
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

GAME_DATA.scenes.scene_after_school = {
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

GAME_DATA.scenes.chapter1_end = {
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

// ============================================
// 第二章：接近篇
// ============================================
GAME_DATA.scenes.ch2_morning_run = {
    location: "特雷森學園 - 操場",
    dialogues: [
        { speaker: "narrator", text: "【第二章：接近】" },
        { speaker: "narrator", text: "清晨六點，你來到學園準備工作。" },
        { speaker: "narrator", text: "操場上已經有一個熟悉的紅色身影在奔跑。" },
        { speaker: "daiwa_scarlet", text: "呼...呼..." },
        { speaker: "daiwa_scarlet", text: "啊，訓練員？這麼早就來了？" },
        { speaker: "narrator", text: "赤驥的態度比第一天見面時柔和了一些。" },
        { speaker: "daiwa_scarlet", text: "我每天都這個時間練習的。想成為第一，就不能懈怠！" }
    ],
    choices: [
        {
            text: "早安，今天也來很早呢",
            hint: "+3 好感度",
            affectionChange: { daiwa_scarlet: 3 },
            nextScene: "ch2_run_response1"
        },
        {
            text: "我來陪妳練習吧",
            hint: "+5 好感度",
            affectionChange: { daiwa_scarlet: 5 },
            nextScene: "ch2_run_response2"
        },
        {
            text: "這麼早起真是努力",
            hint: "+2 好感度",
            affectionChange: { daiwa_scarlet: 2 },
            nextScene: "ch2_run_response3"
        }
    ]
};

GAME_DATA.scenes.ch2_run_response1 = {
    location: "特雷森學園 - 操場",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "早、早安..." },
        { speaker: "daiwa_scarlet", text: "（小聲）這樣打招呼感覺好奇怪..." },
        { speaker: "daiwa_scarlet", text: "不過...謝謝你來陪我。" }
    ],
    nextScene: "ch2_training"
};

GAME_DATA.scenes.ch2_run_response2 = {
    location: "特雷森學園 - 操場",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "欸？陪我一起？" },
        { speaker: "daiwa_scarlet", text: "但、但你是訓練員，跟著我跑會很累的..." },
        { speaker: "trainer", text: "沒關係，我想了解妳的練習方式。" },
        { speaker: "daiwa_scarlet", text: "...笨蛋。" },
        { speaker: "daiwa_scarlet", text: "那就別跟丟了！" }
    ],
    nextScene: "ch2_training"
};

GAME_DATA.scenes.ch2_run_response3 = {
    location: "特雷森學園 - 操場",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "那是當然的！" },
        { speaker: "daiwa_scarlet", text: "不像某人，肯定還在睡懶覺吧？" },
        { speaker: "narrator", text: "她說的某人應該是指伏特加。" }
    ],
    nextScene: "ch2_training"
};

GAME_DATA.scenes.ch2_training = {
    location: "特雷森學園 - 訓練室",
    dialogues: [
        { speaker: "narrator", text: "幾天後，你正式成為赤驥的專屬訓練員。" },
        { speaker: "daiwa_scarlet", text: "那麼訓練員，你打算怎麼訓練我？" },
        { speaker: "daiwa_scarlet", text: "我對現在的實力還不滿意，想要變得更強！" },
        { speaker: "narrator", text: "赤驥認真地看著你，等待你的回答。" }
    ],
    choices: [
        {
            text: "根據妳的特點制定計畫 (觀察到她是爆發型選手)",
            hint: "+8 好感度",
            affectionChange: { daiwa_scarlet: 8 },
            nextScene: "ch2_plan_good"
        },
        {
            text: "先問問妳本人的意見",
            hint: "+5 好感度",
            affectionChange: { daiwa_scarlet: 5 },
            nextScene: "ch2_plan_normal"
        },
        {
            text: "這是標準課表，請照著做",
            hint: "+2 好感度",
            affectionChange: { daiwa_scarlet: 2 },
            nextScene: "ch2_plan_bad"
        }
    ]
};

GAME_DATA.scenes.ch2_plan_good = {
    location: "特雷森學園 - 訓練室",
    dialogues: [
        { speaker: "narrator", text: "你觀察了赤驥的跑法，發現她是爆發力型選手。" },
        { speaker: "trainer", text: "赤驥，妳的爆發力很強，但持久力可以再加強。" },
        { speaker: "trainer", text: "我建議加強耐力訓練，讓妳能在最後衝刺時保留體力。" },
        { speaker: "daiwa_scarlet", text: "...！" },
        { speaker: "daiwa_scarlet", text: "你看出來了？我自己也知道這個弱點..." },
        { speaker: "daiwa_scarlet", text: "訓練員...你還挺有一套的嘛。" }
    ],
    nextScene: "ch2_vodka_talk"
};

GAME_DATA.scenes.ch2_plan_normal = {
    location: "特雷森學園 - 訓練室",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "問我的意見？" },
        { speaker: "daiwa_scarlet", text: "以前都是教練直接給我課表..." },
        { speaker: "daiwa_scarlet", text: "那、那個...我想加強耐力！還有起步的速度！" },
        { speaker: "trainer", text: "好，那麼我們就針對這兩點來訓練。" },
        { speaker: "daiwa_scarlet", text: "...謝謝你問我。" }
    ],
    nextScene: "ch2_vodka_talk"
};

GAME_DATA.scenes.ch2_plan_bad = {
    location: "特雷森學園 - 訓練室",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "標準課表..." },
        { speaker: "daiwa_scarlet", text: "（小聲）我還以為你會更用心..." },
        { speaker: "daiwa_scarlet", text: "算了，反正我會自己加練的。" }
    ],
    nextScene: "ch2_vodka_talk"
};

GAME_DATA.scenes.ch2_vodka_talk = {
    location: "特雷森學園 - 走廊",
    dialogues: [
        { speaker: "narrator", text: "午休時，你被一個人攔住了。" },
        { speaker: "vodka", text: "喲，訓練員。有時間嗎？" },
        { speaker: "vodka", text: "我有些事想跟你說。是關於赤驥的。" },
        { speaker: "narrator", text: "你們來到安靜的樓梯間。" },
        { speaker: "vodka", text: "赤驥那傢伙...雖然總是對我凶巴巴的。" },
        { speaker: "vodka", text: "但其實很在意你這個訓練員。" },
        { speaker: "vodka", text: "別辜負她啊。那傢伙...比誰都努力。" }
    ],
    choices: [
        {
            text: "我會好好支持她的",
            hint: "+5 好感度",
            affectionChange: { daiwa_scarlet: 5 },
            nextScene: "ch2_vodka_response1"
        },
        {
            text: "妳很關心她呢",
            hint: "赤驥+3 伏特加+3",
            affectionChange: { daiwa_scarlet: 3, vodka: 3 },
            nextScene: "ch2_vodka_response2"
        },
        {
            text: "這是我們兩個的事",
            hint: "+0 好感度",
            affectionChange: {},
            nextScene: "ch2_vodka_response3"
        }
    ]
};

GAME_DATA.scenes.ch2_vodka_response1 = {
    location: "特雷森學園 - 走廊",
    dialogues: [
        { speaker: "vodka", text: "...哼。" },
        { speaker: "vodka", text: "話說得挺好聽的，讓我看看你的實際行動吧。" },
        { speaker: "narrator", text: "伏特加說完就離開了。" },
        { speaker: "narrator", text: "但她的眼神似乎柔和了一些。" }
    ],
    nextScene: "ch2_worry_check"
};

GAME_DATA.scenes.ch2_vodka_response2 = {
    location: "特雷森學園 - 走廊",
    dialogues: [
        { speaker: "vodka", text: "那、那當然！" },
        { speaker: "vodka", text: "我們是競爭對手，關注她是應該的！" },
        { speaker: "vodka", text: "別誤會了！" },
        { speaker: "narrator", text: "伏特加紅著臉跑走了。" },
        { speaker: "narrator", text: "她們的關係真好呢。" }
    ],
    nextScene: "ch2_worry_check"
};

GAME_DATA.scenes.ch2_vodka_response3 = {
    location: "特雷森學園 - 走廊",
    dialogues: [
        { speaker: "vodka", text: "...是嗎。" },
        { speaker: "vodka", text: "算了，隨便你吧。" },
        { speaker: "narrator", text: "伏特加轉身離開了。" },
        { speaker: "narrator", text: "或許該對她更友善一點..." }
    ],
    nextScene: "ch2_worry_check"
};

GAME_DATA.scenes.ch2_worry_check = {
    location: "特雷森學園 - 教室",
    dialogues: [
        { speaker: "narrator", text: "放學後，特別週神秘兮兮地拉住了你。" },
        { speaker: "special_week", text: "訓練員！那個...我有事想拜託你！" },
        { speaker: "special_week", text: "下個月是赤驥前輩的生日..." },
        { speaker: "special_week", text: "她總是為大家努力，這次想給她一個驚喜！" },
        { speaker: "special_week", text: "訓練員也會幫忙的吧？" },
        { speaker: "narrator", text: "【開啟生日支線事件】" }
    ],
    choices: [
        {
            text: "當然，一定會讓她開心的",
            hint: "開啟生日支線",
            affectionChange: { daiwa_scarlet: 3, special_week: 5 },
            nextScene: "ch2_rooftop"
        },
        {
            text: "我可能沒時間...",
            hint: "跳過支線",
            affectionChange: { special_week: -2 },
            nextScene: "ch2_rooftop"
        }
    ]
};

GAME_DATA.scenes.ch2_rooftop = {
    location: "特雷森學園 - 屋頂",
    dialogues: [
        { speaker: "narrator", text: "某天傍晚，你經過屋頂時，發現赤驥一個人坐在那裡。" },
        { speaker: "narrator", text: "夕陽照在她的側臉上，看起來有些落寞。" },
        { speaker: "trainer", text: "赤驥？妳在這做什麼？" },
        { speaker: "daiwa_scarlet", text: "...訓練員。" },
        { speaker: "daiwa_scarlet", text: "沒什麼，只是...想一個人靜靜。" },
        { speaker: "narrator", text: "她的聲音聽起來不太對勁。" }
    ],
    choices: [
        {
            text: "坐在她旁邊，等她願意說",
            hint: "+8 好感度 (進入煩惱劇情)",
            affectionChange: { daiwa_scarlet: 8 },
            nextScene: "ch2_worry_talk"
        },
        {
            text: "是關於伏特加的事嗎？",
            hint: "+5 好感度",
            affectionChange: { daiwa_scarlet: 5 },
            nextScene: "ch2_worry_talk"
        },
        {
            text: "那我就不打擾了",
            hint: "+1 好感度",
            affectionChange: { daiwa_scarlet: 1 },
            nextScene: "ch2_skip_worry"
        }
    ]
};

GAME_DATA.scenes.ch2_worry_talk = {
    location: "特雷森學園 - 屋頂",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "...果然瞞不過你呢。" },
        { speaker: "daiwa_scarlet", text: "我...不知道該怎麼辦。" },
        { speaker: "daiwa_scarlet", text: "明明想要贏過伏特加..." },
        { speaker: "daiwa_scarlet", text: "但想到如果真的贏了，她會不會難過..." },
        { speaker: "daiwa_scarlet", text: "這種心情，很奇怪吧？" },
        { speaker: "trainer", text: "（選擇回答...）" }
    ],
    choices: [
        {
            text: "正是因為重要，才會矛盾",
            hint: "+8 好感度",
            affectionChange: { daiwa_scarlet: 8 },
            nextScene: "ch2_worry_good"
        },
        {
            text: "妳們的羈絆比勝負更重要",
            hint: "+6 好感度",
            affectionChange: { daiwa_scarlet: 6 },
            nextScene: "ch2_worry_normal"
        },
        {
            text: "比賽時就專心贏吧",
            hint: "+3 好感度",
            affectionChange: { daiwa_scarlet: 3 },
            nextScene: "ch2_worry_bad"
        }
    ]
};

GAME_DATA.scenes.ch2_worry_good = {
    location: "特雷森學園 - 屋頂",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "...！" },
        { speaker: "daiwa_scarlet", text: "謝謝你...訓練員。" },
        { speaker: "daiwa_scarlet", text: "能說出來...感覺好多了。" },
        { speaker: "narrator", text: "赤驥露出了一絲微笑。" },
        { speaker: "daiwa_scarlet", text: "這件事...請不要告訴伏特加。" },
        { speaker: "daiwa_scarlet", text: "還有...謝謝你聽我說。" }
    ],
    nextScene: "ch2_race"
};

GAME_DATA.scenes.ch2_worry_normal = {
    location: "特雷森學園 - 屋頂",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "...羈絆嗎。" },
        { speaker: "daiwa_scarlet", text: "也對...我和伏特加不只是競爭對手。" },
        { speaker: "daiwa_scarlet", text: "謝謝你，訓練員。" }
    ],
    nextScene: "ch2_race"
};

GAME_DATA.scenes.ch2_worry_bad = {
    location: "特雷森學園 - 屋頂",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "...說的也是。" },
        { speaker: "daiwa_scarlet", text: "比賽時想太多也沒用。" },
        { speaker: "narrator", text: "她似乎還有些話想說，但沒有再開口。" }
    ],
    nextScene: "ch2_race"
};

GAME_DATA.scenes.ch2_skip_worry = {
    location: "特雷森學園 - 走廊",
    dialogues: [
        { speaker: "narrator", text: "你選擇離開，讓赤驥一個人靜一靜。" },
        { speaker: "narrator", text: "或許...她還沒準備好敞開心扉。" }
    ],
    nextScene: "ch2_race"
};

GAME_DATA.scenes.ch2_race = {
    location: "特雷森學園 - 賽場",
    dialogues: [
        { speaker: "narrator", text: "幾天後，學園舉辦模擬賽。" },
        { speaker: "narrator", text: "赤驥的對手是...伏特加。" },
        { speaker: "daiwa_scarlet", text: "訓練員！" },
        { speaker: "daiwa_scarlet", text: "我會贏的！請你看著我！" },
        { speaker: "vodka", text: "才不會讓妳贏呢！" }
    ],
    choices: [
        {
            text: "記得注意最後彎道的節奏",
            hint: "+5 好感度",
            affectionChange: { daiwa_scarlet: 5 },
            nextScene: "ch2_race_result"
        },
        {
            text: "我會全力幫妳加油的！",
            hint: "+3 好感度",
            affectionChange: { daiwa_scarlet: 3 },
            nextScene: "ch2_race_result"
        },
        {
            text: "加油！兩位都是！",
            hint: "+1 好感度",
            affectionChange: { daiwa_scarlet: 1, vodka: 2 },
            nextScene: "ch2_race_result"
        }
    ]
};

GAME_DATA.scenes.ch2_race_result = {
    location: "特雷森學園 - 賽場",
    dialogues: [
        { speaker: "narrator", text: "比賽開始了！" },
        { speaker: "narrator", text: "兩人幾乎並駕齊驅..." },
        { speaker: "narrator", text: "最後，赤驥以些微差距贏了！" },
        { speaker: "daiwa_scarlet", text: "哈...哈..." },
        { speaker: "daiwa_scarlet", text: "訓練員！我贏了！" },
        { speaker: "vodka", text: "可惡...下次我不會輸的！" },
        { speaker: "narrator", text: "【第二章 - 完】" },
        { speaker: "narrator", text: "你與赤驥的關係更進了一步。" }
    ],
    nextScene: "chapter3_start"
};

// ============================================
// 第三章：心意篇
// ============================================
GAME_DATA.scenes.chapter3_start = {
    location: "特雷森學園 - 教室",
    dialogues: [
        { speaker: "narrator", text: "【第三章：心意】" },
        { speaker: "narrator", text: "距離模擬賽已經過了一週。" },
        { speaker: "narrator", text: "你和赤驥的關係越來越好。" },
        { speaker: "narrator", text: "某天，天空突然下起大雨..." }
    ],
    nextScene: "ch3_rain"
};

GAME_DATA.scenes.ch3_rain = {
    location: "特雷森學園 - 校門口",
    dialogues: [
        { speaker: "narrator", text: "放學時突然下起大雨。" },
        { speaker: "narrator", text: "你站在校門口，發現赤驥也沒帶傘。" },
        { speaker: "daiwa_scarlet", text: "這雨...下得好大。" },
        { speaker: "daiwa_scarlet", text: "訓、訓練員！你只有一把傘嗎？" }
    ],
    choices: [
        {
            text: "一起撐吧，靠近一點就不會淋濕了",
            hint: "+10 好感度",
            affectionChange: { daiwa_scarlet: 10 },
            nextScene: "ch3_rain_good"
        },
        {
            text: "我的傘給妳，我淋雨沒關係",
            hint: "+6 好感度",
            affectionChange: { daiwa_scarlet: 6 },
            nextScene: "ch3_rain_normal"
        },
        {
            text: "等等，我去借傘",
            hint: "+2 好感度",
            affectionChange: { daiwa_scarlet: 2 },
            nextScene: "ch3_rain_bad"
        }
    ]
};

GAME_DATA.scenes.ch3_rain_good = {
    location: "特雷森學園 - 雨中",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "欸！？靠、靠近...！？" },
        { speaker: "narrator", text: "你們肩並肩走著，傘下的空間很小。" },
        { speaker: "narrator", text: "赤驥的肩膀不時碰到你。" },
        { speaker: "daiwa_scarlet", text: "（小聲）這種距離...有點不好意思..." },
        { speaker: "narrator", text: "她的耳朵紅通通的。" }
    ],
    nextScene: "ch3_end"
};

GAME_DATA.scenes.ch3_rain_normal = {
    location: "特雷森學園 - 雨中",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "不行！這樣你會感冒的！" },
        { speaker: "daiwa_scarlet", text: "...一起撐吧。" },
        { speaker: "narrator", text: "最後你們還是共撐一把傘回去了。" }
    ],
    nextScene: "ch3_end"
};

GAME_DATA.scenes.ch3_rain_bad = {
    location: "特雷森學園 - 校門口",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "啊...好。" },
        { speaker: "narrator", text: "你借來傘時，赤驥已經走了。" }
    ],
    nextScene: "ch3_end"
};

GAME_DATA.scenes.ch3_end = {
    location: "特雷森學園 - 宿舍",
    dialogues: [
        { speaker: "narrator", text: "【第三章 - 完】" },
        { speaker: "narrator", text: "你和赤驥之間的距離，似乎縮短了一些。" },
        { speaker: "narrator", text: "【MVP擴充版 - 暫時完結】" },
        { speaker: "narrator", text: "未來將更新第四章、第五章及更多支線！" }
    ],
    nextScene: "end"
};

// ============================================
// 結局
// ============================================
GAME_DATA.scenes.end = {
    location: "",
    dialogues: [
        { speaker: "narrator", text: "感謝遊玩！" },
        { speaker: "narrator", text: "這是純文字MVP版本，未來將繼續更新更多劇情！" },
        { speaker: "narrator", text: "最終好感度：" }
    ],
    choices: [
        {
            text: "回到標題",
            hint: "",
            affectionChange: {},
            nextScene: "title"
        }
    ]
};
