// ============================================
// 第二章：接近篇
// ============================================

const CHAPTER_2_SCENES = {};

// 2-1 晨跑相遇
CHAPTER_2_SCENES.ch2_morning_run = {
    location: "特雷森學園 - 操場",
    dialogues: [
        { speaker: "narrator", text: "【第二章：接近】" },
        { speaker: "narrator", text: "清晨六點，你來到學園準備工作。" },
        { speaker: "narrator", text: "操場上已經有一個熟悉的紅色身影在奔跑。" },
        { speaker: "daiwa_scarlet", text: "呼...呼..." },
        { speaker: "daiwa_scarlet", text: "啊，訓練員？這麼早就來了？" },
        { speaker: "narrator", text: "赤驥的態度比第一天見面時柔和了一些。" },
        { speaker: "daiwa_scarlet", expression: "joy", text: "我每天都這個時間練習的。想成為第一，就不能懈怠！" }
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
            hint: "+1 好感度",
            affectionChange: { daiwa_scarlet: 1 },
            nextScene: "ch2_run_response3"
        }
    ]
};

CHAPTER_2_SCENES.ch2_run_response1 = {
    location: "特雷森學園 - 操場",
    dialogues: [
        { speaker: "daiwa_scarlet", expression: "blush", text: "早、早安..." },
        { speaker: "daiwa_scarlet", expression: "blush", text: "（小聲）這樣打招呼感覺好奇怪..." },
        { speaker: "daiwa_scarlet", expression: "joy", text: "不過...謝謝你來陪我。" }
    ],
    nextScene: "ch2_training"
};

CHAPTER_2_SCENES.ch2_run_response2 = {
    location: "特雷森學園 - 操場",
    dialogues: [
        { speaker: "daiwa_scarlet", expression: "blush", text: "欸？陪我一起？" },
        { speaker: "daiwa_scarlet", expression: "blush", text: "但、但你是訓練員，跟著我跑會很累的..." },
        { speaker: "trainer", text: "沒關係，我想了解妳的練習方式。" },
        { speaker: "daiwa_scarlet", expression: "blush", text: "...笨蛋。" },
        { speaker: "daiwa_scarlet", expression: "joy", text: "那就別跟丟了！" }
    ],
    nextScene: "ch2_training"
};

CHAPTER_2_SCENES.ch2_run_response3 = {
    location: "特雷森學園 - 操場",
    dialogues: [
        { speaker: "daiwa_scarlet", expression: "joy", text: "那是當然的！" },
        { speaker: "daiwa_scarlet", expression: "pout", text: "不像某人，肯定還在睡懶覺吧？" },
        { speaker: "narrator", text: "她說的某人應該是指伏特加。" }
    ],
    nextScene: "ch2_training"
};

// 2-2 訓練指導
CHAPTER_2_SCENES.ch2_training = {
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
            hint: "+6 好感度",
            affectionChange: { daiwa_scarlet: 6 },
            nextScene: "ch2_plan_good"
        },
        {
            text: "先問問妳本人的意見",
            hint: "+4 好感度",
            affectionChange: { daiwa_scarlet: 4 },
            nextScene: "ch2_plan_normal"
        },
        {
            text: "這是標準課表，請照著做",
            hint: "-2 好感度",
            affectionChange: { daiwa_scarlet: -2 },
            nextScene: "ch2_plan_bad"
        }
    ]
};

CHAPTER_2_SCENES.ch2_plan_good = {
    location: "特雷森學園 - 訓練室",
    dialogues: [
        { speaker: "narrator", text: "你觀察了赤驥的跑法，發現她是爆發力型選手。" },
        { speaker: "trainer", text: "赤驥，妳的爆發力很強，但持久力可以再加強。" },
        { speaker: "trainer", text: "我建議加強耐力訓練，讓妳能在最後衝刺時保留體力。" },
        { speaker: "daiwa_scarlet", text: "...！" },
        { speaker: "daiwa_scarlet", text: "你看出來了？我自己也知道這個弱點..." },
        { speaker: "daiwa_scarlet", expression: "joy", text: "訓練員...你還挺有一套的嘛。" }
    ],
    nextScene: "ch2_vodka_talk"
};

CHAPTER_2_SCENES.ch2_plan_normal = {
    location: "特雷森學園 - 訓練室",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "問我的意見？" },
        { speaker: "daiwa_scarlet", text: "以前都是教練直接給我課表..." },
        { speaker: "daiwa_scarlet", expression: "blush", text: "那、那個...我想加強耐力！還有起步的速度！" },
        { speaker: "trainer", text: "好，那麼我們就針對這兩點來訓練。" },
        { speaker: "daiwa_scarlet", expression: "joy", text: "...謝謝你問我。" }
    ],
    nextScene: "ch2_vodka_talk"
};

CHAPTER_2_SCENES.ch2_plan_bad = {
    location: "特雷森學園 - 訓練室",
    dialogues: [
        { speaker: "daiwa_scarlet", expression: "sad", text: "標準課表..." },
        { speaker: "daiwa_scarlet", expression: "sad", text: "（小聲）我還以為你會更用心..." },
        { speaker: "daiwa_scarlet", expression: "pout", text: "算了，反正我會自己加練的。" }
    ],
    nextScene: "ch2_vodka_talk"
};

// 2-3 伏特加的提醒
CHAPTER_2_SCENES.ch2_vodka_talk = {
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
            hint: "+4 好感度",
            affectionChange: { daiwa_scarlet: 4 },
            nextScene: "ch2_vodka_response1"
        },
        {
            text: "妳很關心她呢",
            hint: "赤驥+2 伏特加+3",
            affectionChange: { daiwa_scarlet: 2, vodka: 3 },
            nextScene: "ch2_vodka_response2"
        },
        {
            text: "這是我們兩個的事",
            hint: "-1 好感度",
            affectionChange: { daiwa_scarlet: -1 },
            nextScene: "ch2_vodka_response3"
        }
    ]
};

CHAPTER_2_SCENES.ch2_vodka_response1 = {
    location: "特雷森學園 - 走廊",
    dialogues: [
        { speaker: "vodka", text: "...哼。" },
        { speaker: "vodka", text: "話說得挺好聽的，讓我看看你的實際行動吧。" },
        { speaker: "narrator", text: "伏特加說完就離開了。" },
        { speaker: "narrator", text: "但她的眼神似乎柔和了一些。" }
    ],
    nextScene: "ch2_worry_check"
};

CHAPTER_2_SCENES.ch2_vodka_response2 = {
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

CHAPTER_2_SCENES.ch2_vodka_response3 = {
    location: "特雷森學園 - 走廊",
    dialogues: [
        { speaker: "vodka", text: "...是嗎。" },
        { speaker: "vodka", text: "算了，隨便你吧。" },
        { speaker: "narrator", text: "伏特加轉身離開了。" },
        { speaker: "narrator", text: "或許該對她更友善一點..." }
    ],
    nextScene: "ch2_worry_check"
};

// 2-4 特別週的委託
CHAPTER_2_SCENES.ch2_worry_check = {
    location: "特雷森學園 - 教室",
    dialogues: [
        { speaker: "narrator", text: "放學後，特別週神秘兮兮地拉住了你。" },
        { speaker: "special_week", text: "訓練員！那個...我有事想拜託你！" },
        { speaker: "special_week", text: "下個月是赤驥前輩的生日..." },
        { speaker: "special_week", text: "她總是為大家努力，這次想給她一個驚喜！" },
        { speaker: "special_week", text: "訓練員也會幫忙的吧？" }
    ],
    choices: [
        {
            text: "當然，一定會讓她開心的",
            hint: "赤驥+3 特別週+5 (開啟生日支線)",
            affectionChange: { daiwa_scarlet: 3, special_week: 5 },
            setFlags: { birthday_quest: true },
            nextScene: "ch2_birthday_accept"
        },
        {
            text: "我可能沒時間...",
            hint: "跳過生日支線",
            affectionChange: { special_week: -2 },
            setFlags: { birthday_quest: false },
            nextScene: "ch2_birthday_skip"
        }
    ]
};

CHAPTER_2_SCENES.ch2_birthday_accept = {
    location: "特雷森學園 - 教室",
    dialogues: [
        { speaker: "special_week", text: "太好了！我就知道訓練員一定會答應！" },
        { speaker: "special_week", text: "那我們之後再找時間一起討論驚喜的細節吧！" },
        { speaker: "narrator", text: "【已開啟生日驚喜支線】" }
    ],
    nextScene: "ch2_rooftop"
};

CHAPTER_2_SCENES.ch2_birthday_skip = {
    location: "特雷森學園 - 教室",
    dialogues: [
        { speaker: "special_week", text: "欸...這樣啊...訓練員果然很忙呢。" },
        { speaker: "special_week", text: "沒關係！那我和伏特加前輩自己想辦法就好！" },
        { speaker: "narrator", text: "特別週雖然有點遺憾，還是笑著向你揮手道別。" }
    ],
    nextScene: "ch2_rooftop"
};

// 2-5 赤驥的煩惱
CHAPTER_2_SCENES.ch2_rooftop = {
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
            hint: "+4 好感度 (進入煩惱劇情)",
            affectionChange: { daiwa_scarlet: 4 },
            nextScenes: [
                { condition: { minAffection: { daiwa_scarlet: 15 } }, scene: "ch2_worry_talk" },
                { scene: "ch2_worry_closed" }
            ]
        },
        {
            text: "是關於伏特加的事嗎？",
            hint: "+2 好感度",
            affectionChange: { daiwa_scarlet: 2 },
            nextScenes: [
                { condition: { minAffection: { daiwa_scarlet: 15 } }, scene: "ch2_worry_talk" },
                { scene: "ch2_worry_closed" }
            ]
        },
        {
            text: "那我就不打擾了",
            hint: "+0 好感度",
            affectionChange: { daiwa_scarlet: 0 },
            nextScene: "ch2_skip_worry"
        }
    ]
};

CHAPTER_2_SCENES.ch2_worry_closed = {
    location: "特雷森學園 - 屋頂",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "......真的沒什麼事。" },
        { speaker: "daiwa_scarlet", text: "只是稍微在想接下來訓練的事而已，不需要擔心我。" },
        { speaker: "narrator", text: "赤驥禮貌地搖了搖頭，隨即站起身拍拍裙擺。" },
        { speaker: "daiwa_scarlet", text: "抱歉，我先回宿舍整理東西了。明天見，訓練員。" },
        { speaker: "narrator", text: "看來現在的她，還沒有準備好向你傾訴真正的心事。" }
    ],
    nextScene: "ch2_race"
};

CHAPTER_2_SCENES.ch2_worry_talk = {
    location: "特雷森學園 - 屋頂",
    dialogues: [
        { speaker: "daiwa_scarlet", expression: "sad", text: "...果然瞞不過你呢。" },
        { speaker: "daiwa_scarlet", expression: "sad", text: "我...不知道該怎麼辦。" },
        { speaker: "daiwa_scarlet", expression: "sad", text: "明明想要贏過伏特加..." },
        { speaker: "daiwa_scarlet", expression: "sad", text: "但想到如果真的贏了，她會不會難過..." },
        { speaker: "daiwa_scarlet", expression: "sad", text: "這種心情，很奇怪吧？" },
        { speaker: "trainer", text: "（選擇回答...）" }
    ],
    choices: [
        {
            text: "正是因為重要，才會矛盾",
            hint: "+4 好感度",
            affectionChange: { daiwa_scarlet: 4 },
            nextScene: "ch2_worry_good"
        },
        {
            text: "妳們的羈絆比勝負更重要",
            hint: "+3 好感度",
            affectionChange: { daiwa_scarlet: 3 },
            nextScene: "ch2_worry_normal"
        },
        {
            text: "比賽時就專心贏吧",
            hint: "+1 好感度",
            affectionChange: { daiwa_scarlet: 1 },
            nextScene: "ch2_worry_bad"
        }
    ]
};

CHAPTER_2_SCENES.ch2_worry_good = {
    location: "特雷森學園 - 屋頂",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "...！" },
        { speaker: "daiwa_scarlet", expression: "joy", text: "謝謝你...訓練員。" },
        { speaker: "daiwa_scarlet", expression: "joy", text: "能說出來...感覺好多了。" },
        { speaker: "narrator", text: "赤驥露出了一絲微笑。" },
        { speaker: "daiwa_scarlet", expression: "blush", text: "這件事...請不要告訴伏特加。" },
        { speaker: "daiwa_scarlet", expression: "joy", text: "還有...謝謝你聽我說。" }
    ],
    nextScene: "ch2_race"
};

CHAPTER_2_SCENES.ch2_worry_normal = {
    location: "特雷森學園 - 屋頂",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "...羈絆嗎。" },
        { speaker: "daiwa_scarlet", text: "也對...我和伏特加不只是競爭對手。" },
        { speaker: "daiwa_scarlet", expression: "joy", text: "謝謝你，訓練員。" }
    ],
    nextScene: "ch2_race"
};

CHAPTER_2_SCENES.ch2_worry_bad = {
    location: "特雷森學園 - 屋頂",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "...說的也是。" },
        { speaker: "daiwa_scarlet", text: "比賽時想太多也沒用。" },
        { speaker: "narrator", text: "她似乎還有些話想說，但沒有再開口。" }
    ],
    nextScene: "ch2_race"
};

CHAPTER_2_SCENES.ch2_skip_worry = {
    location: "特雷森學園 - 走廊",
    dialogues: [
        { speaker: "narrator", text: "你選擇離開，讓赤驥一個人靜一靜。" },
        { speaker: "narrator", text: "或許...她還沒準備好敞開心扉。" }
    ],
    nextScene: "ch2_race"
};

// 2-6 第一次模擬賽
CHAPTER_2_SCENES.ch2_race = {
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
            hint: "+4 好感度",
            affectionChange: { daiwa_scarlet: 4 },
            nextScene: "ch2_race_result"
        },
        {
            text: "我會全力幫妳加油的！",
            hint: "+2 好感度",
            affectionChange: { daiwa_scarlet: 2 },
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

CHAPTER_2_SCENES.ch2_race_result = {
    location: "特雷森學園 - 賽場",
    dialogues: [
        { speaker: "narrator", text: "比賽開始了！" },
        { speaker: "narrator", text: "兩人幾乎並駕齊驅..." },
        { speaker: "narrator", text: "最後，赤驥以些微差距贏了！" },
        { speaker: "daiwa_scarlet", text: "哈...哈..." },
        { speaker: "daiwa_scarlet", expression: "joy", text: "訓練員！我贏了！" },
        { speaker: "vodka", text: "可惡...下次我不會輸的！" },
        { speaker: "narrator", text: "【第二章 - 完】" },
        { speaker: "narrator", text: "你與赤驥的關係更進了一步。" }
    ],
    nextScenes: [
        { condition: { minAffection: { special_week: 5 } }, scene: "ch2_side_dorm_life" },
        { scene: "chapter3_start" }
    ]
};

// 支線事件：宿舍的日常生活 (特別週好感 >= 5 觸發)
CHAPTER_2_SCENES.ch2_side_dorm_life = {
    location: "特雷森學園 - 宿舍交誼廳",
    setFlags: { dorm_visited: true },
    dialogues: [
        { speaker: "narrator", text: "【支線事件：宿舍日常】" },
        { speaker: "narrator", text: "週末午後，特別週興沖沖地邀請你到栗東寮交誼廳討論派對細節。" },
        { speaker: "special_week", text: "訓練員請坐！我泡了熱紅茶和大家一起準備的點心——" },
        { speaker: "gold_ship", text: "唷齁！發現野生訓練員一名！讓阿船來教你什麼叫宿舍的生存法則吧！" },
        { speaker: "narrator", text: "黃金船突然從沙發後方冒出來，手舞足蹈時不小心撞翻了桌邊的一疊訓練筆記！" },
        { speaker: "narrator", text: "筆記本散落一地——恰巧全是赤驥平時記錄的訓練心得與體重管理表。" },
        { speaker: "daiwa_scarlet", expression: "blush", text: "黃、黃金船前輩！！妳在做什麼啦！？" },
        { speaker: "daiwa_scarlet", expression: "blush", text: "訓練員不準看！！那是我的私人筆記本！！" },
        { speaker: "narrator", text: "赤驥滿臉通紅地衝過來，急忙想把地上的筆記通通搶回來。" }
    ],
    choices: [
        {
            text: "幫赤驥一起整理被黃金船弄亂的筆記",
            hint: "赤驥+4 特別週+3",
            affectionChange: { daiwa_scarlet: 4, special_week: 3 },
            nextScene: "ch2_side_dorm_notes"
        },
        {
            text: "陪特別週和黃金船一起分享點心",
            hint: "赤驥+2 特別週+5",
            affectionChange: { daiwa_scarlet: 2, special_week: 5 },
            nextScene: "ch2_side_dorm_snacks"
        },
        {
            text: "笑著看大家熱鬧打鬧的樣子",
            hint: "赤驥+1 特別週+2",
            affectionChange: { daiwa_scarlet: 1, special_week: 2 },
            nextScene: "ch2_side_dorm_watch"
        }
    ]
};

CHAPTER_2_SCENES.ch2_side_dorm_notes = {
    location: "特雷森學園 - 宿舍交誼廳",
    dialogues: [
        { speaker: "trainer", text: "放心，我沒看內容，先幫妳按日期排整齊吧。" },
        { speaker: "narrator", text: "你把散落的紙張疊整齊，小心翼翼地遞還給赤驥。" },
        { speaker: "daiwa_scarlet", expression: "blush", text: "...真的沒偷看嗎？" },
        { speaker: "trainer", text: "真的沒有。不過我看到封面上寫著滿滿的努力。" },
        { speaker: "daiwa_scarlet", expression: "blush", text: "唔......謝、謝謝。" },
        { speaker: "special_week", text: "太好了！那接下來我們也順便一起吃點心吧！" }
    ],
    nextScene: "chapter3_start"
};

CHAPTER_2_SCENES.ch2_side_dorm_snacks = {
    location: "特雷森學園 - 宿舍交誼廳",
    dialogues: [
        { speaker: "trainer", text: "先別急，特別週特地準備了這麼多點心，大家一起休息一下吧。" },
        { speaker: "special_week", text: "對呀對呀！這個胡蘿蔔蛋糕超好吃的喔！" },
        { speaker: "gold_ship", text: "哈哈！就是要有這種氣勢才行嘛！赤驥也別發呆了快坐下！" },
        { speaker: "daiwa_scarlet", expression: "pout", text: "真是的...才剛提醒自己要飲食管理，就拿你們沒辦法......" },
        { speaker: "narrator", text: "赤驥雖然嘴上念著，卻還是露出笑意接過了你遞過去的紅茶。" }
    ],
    nextScene: "chapter3_start"
};

CHAPTER_2_SCENES.ch2_side_dorm_watch = {
    location: "特雷森學園 - 宿舍交誼廳",
    dialogues: [
        { speaker: "narrator", text: "看著特別週忙著收拾、黃金船胡鬧、赤驥又氣又好笑地追著她跑，交誼廳充滿了歡笑聲。" },
        { speaker: "special_week", text: "啊哈哈，每次只要黃金船前輩在就一定會變這樣呢。" },
        { speaker: "daiwa_scarlet", expression: "pout", text: "訓練員別只是在旁邊笑啦，快幫我拉住她！" },
        { speaker: "narrator", text: "你在熱鬧溫馨的日常中，看見了赤驥不同於賽場上的一面。" }
    ],
    nextScene: "chapter3_start"
};

// 匯出場景
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CHAPTER_2_SCENES };
}
