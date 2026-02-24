// ============================================
// 第三章：心意篇
// ============================================

const CHAPTER_3_SCENES = {};

CHAPTER_3_SCENES.chapter3_start = {
    location: "特雷森學園 - 教室",
    dialogues: [
        { speaker: "narrator", text: "【第三章：心意】" },
        { speaker: "narrator", text: "距離模擬賽已經過了一週。" },
        { speaker: "narrator", text: "你和赤驥的關係越來越好。" },
        { speaker: "narrator", text: "某天，天空突然下起大雨..." }
    ],
    nextScene: "ch3_rain"
};

// ============================================
// 3-1 雨天共傘 ★特殊事件
// ============================================

CHAPTER_3_SCENES.ch3_rain = {
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

CHAPTER_3_SCENES.ch3_rain_good = {
    location: "特雷森學園 - 雨中",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "欸！？靠、靠近...！？" },
        { speaker: "narrator", text: "你們肩並肩走著，傘下的空間很小。" },
        { speaker: "narrator", text: "赤驥的肩膀不時碰到你。" },
        { speaker: "daiwa_scarlet", text: "（小聲）這種距離...有點不好意思..." },
        { speaker: "narrator", text: "她的耳朵紅通通的。" },
        { speaker: "daiwa_scarlet", text: "...訓練員，你有聞到什麼味道嗎？" },
        { speaker: "trainer", text: "嗯？是淡淡的花香吧...?" },
        { speaker: "daiwa_scarlet", text: "笨、笨蛋！那是我的洗髮精啦！你靠太近了！" },
        { speaker: "narrator", text: "但她並沒有拉開距離。" }
    ],
    nextScene: "ch3_birthday_setup"
};

CHAPTER_3_SCENES.ch3_rain_normal = {
    location: "特雷森學園 - 雨中",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "不行！這樣你會感冒的！" },
        { speaker: "daiwa_scarlet", text: "...一起撐吧。" },
        { speaker: "narrator", text: "最後你們還是共撐一把傘回去了。" },
        { speaker: "narrator", text: "赤驥拉著你的袖子，走得很慢很慢。" },
        { speaker: "daiwa_scarlet", text: "（小聲）...這樣比較近。" }
    ],
    nextScene: "ch3_birthday_setup"
};

CHAPTER_3_SCENES.ch3_rain_bad = {
    location: "特雷森學園 - 校門口",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "啊...好。" },
        { speaker: "narrator", text: "你跑去借傘，但等你回來時，赤驥已經走了。" },
        { speaker: "narrator", text: "第二天，赤驥似乎有些不太對勁。" },
        { speaker: "daiwa_scarlet", text: "...沒什麼。只是覺得你太慢了。" }
    ],
    nextScene: "ch3_birthday_setup"
};

// ============================================
// 3-2 生日驚喜 ★支線事件
// (完整版需完成 2-4 委託才會觸發)
// ============================================

CHAPTER_3_SCENES.ch3_birthday_setup = {
    location: "特雷森學園 - 教室",
    dialogues: [
        { speaker: "narrator", text: "幾天後，特別週匆匆跑來找你。" },
        { speaker: "special_week", text: "訓練員！之前拜託你的事...準備好了嗎？" },
        { speaker: "special_week", text: "赤驥前輩的生日就是明天了！" },
        { speaker: "special_week", text: "伏特加前輩也會幫忙佈置，我們一定要給她一個最棒的驚喜！" },
        { speaker: "vodka", text: "喂，特別週！聲音太大了！赤驥要是聽到就不驚喜了。" },
        { speaker: "special_week", text: "啊！對不起！" },
        { speaker: "narrator", text: "生日當天——" }
    ],
    nextScene: "ch3_birthday"
};

CHAPTER_3_SCENES.ch3_birthday = {
    location: "特雷森學園 - 教室（驚喜佈置）",
    dialogues: [
        { speaker: "narrator", text: "教室裡掛滿了氣球和彩帶，桌上擺著蛋糕。" },
        { speaker: "narrator", text: "大家躲在桌子後面，等待赤驥推門。" },
        { speaker: "narrator", text: "門把轉動了——" },
        { speaker: "daiwa_scarlet", text: "嗯？怎麼這裡黑漆漆的...？" },
        { speaker: "special_week", text: "赤驥前輩！生日快樂！！" },
        { speaker: "vodka", text: "生日快樂，赤驥。" },
        { speaker: "gold_ship", text: "耶嘿！壽星登場啦～！" },
        { speaker: "narrator", text: "燈光亮起的瞬間，赤驥愣住了。" },
        { speaker: "daiwa_scarlet", text: "這、這是...！？" },
        { speaker: "daiwa_scarlet", text: "你...你們...笨蛋...！" },
        { speaker: "narrator", text: "赤驥的眼眶泛紅，但嘴角藏不住笑意。" },
        { speaker: "daiwa_scarlet", text: "我才沒有哭！只是...只是燈光太刺眼了！" }
    ],
    choices: [
        {
            text: "把親手做的蛋糕端到她面前",
            hint: "+15 好感度",
            affectionChange: { daiwa_scarlet: 15 },
            nextScene: "ch3_birthday_best"
        },
        {
            text: "送上精心挑選的紅色髮飾",
            hint: "+10 好感度",
            affectionChange: { daiwa_scarlet: 10 },
            nextScene: "ch3_birthday_good"
        },
        {
            text: "真心地對她說「生日快樂」",
            hint: "+6 好感度",
            affectionChange: { daiwa_scarlet: 6 },
            nextScene: "ch3_birthday_ok"
        }
    ]
};

CHAPTER_3_SCENES.ch3_birthday_best = {
    location: "特雷森學園 - 教室（驚喜佈置）",
    dialogues: [
        { speaker: "trainer", text: "赤驥，這是我特別為妳做的。雖然賣相不太好..." },
        { speaker: "daiwa_scarlet", text: "你...自己做的？" },
        { speaker: "narrator", text: "蛋糕上用巧克力醬歪歪扭扭地寫著「赤驥生日快樂」。" },
        { speaker: "daiwa_scarlet", text: "才、才不是不好看..." },
        { speaker: "daiwa_scarlet", text: "是我收過最好的禮物......謝謝你。" },
        { speaker: "narrator", text: "赤驥小心翼翼地切開蛋糕，露出了格外溫柔的表情。" },
        { speaker: "vodka", text: "（偷偷對你比了一個大拇指）" },
        { speaker: "special_week", text: "好好吃！訓練員好厲害！" },
        { speaker: "gold_ship", text: "我也要！我也要吃！" },
        { speaker: "daiwa_scarlet", text: "不準搶！這是...訓練員給我的。" },
        { speaker: "narrator", text: "赤驥說完，臉紅得像她的名字一樣。" }
    ],
    nextScene: "ch3_rival"
};

CHAPTER_3_SCENES.ch3_birthday_good = {
    location: "特雷森學園 - 教室（驚喜佈置）",
    dialogues: [
        { speaker: "trainer", text: "赤驥，這個給妳。我覺得這顏色很襯妳。" },
        { speaker: "daiwa_scarlet", text: "髮飾...？紅色的...？" },
        { speaker: "narrator", text: "赤驥把髮飾戴上，對著窗戶的倒影左看右看。" },
        { speaker: "vodka", text: "嘿，不錯嘛。很適合妳。" },
        { speaker: "daiwa_scarlet", text: "（小聲）...我會好好珍惜的。" },
        { speaker: "special_week", text: "好漂亮！赤驥前輩更可愛了！" },
        { speaker: "daiwa_scarlet", text: "才、才沒有可愛！" },
        { speaker: "narrator", text: "但她之後每天都戴著那個髮飾。" }
    ],
    nextScene: "ch3_rival"
};

CHAPTER_3_SCENES.ch3_birthday_ok = {
    location: "特雷森學園 - 教室（驚喜佈置）",
    dialogues: [
        { speaker: "trainer", text: "赤驥，生日快樂。希望今年妳的所有願望都能實現。" },
        { speaker: "daiwa_scarlet", text: "嗯...謝謝。" },
        { speaker: "narrator", text: "赤驥雖然嘴上沒說太多，但臉上一直帶著淡淡的笑容。" },
        { speaker: "special_week", text: "赤驥前輩今天心情好好！" },
        { speaker: "daiwa_scarlet", text: "才—才沒有！特別週你少亂說！" },
        { speaker: "vodka", text: "明明就笑得很開心嘛。" },
        { speaker: "daiwa_scarlet", text: "伏特加你也閉嘴！" }
    ],
    nextScene: "ch3_rival"
};

// ============================================
// 3-3 競爭對手的認可
// ============================================

CHAPTER_3_SCENES.ch3_rival = {
    location: "特雷森學園 - 訓練場",
    dialogues: [
        { speaker: "narrator", text: "生日派對過後幾天。" },
        { speaker: "narrator", text: "訓練結束後，伏特加主動找上了你。" },
        { speaker: "vodka", text: "訓練員，有空嗎？想跟你聊兩句。" },
        { speaker: "narrator", text: "她的表情比平時認真許多。" },
        { speaker: "vodka", text: "最近赤驥那傢伙...變了呢。" },
        { speaker: "vodka", text: "以前只會向前衝，不管不顧的。" },
        { speaker: "vodka", text: "現在訓練的時候會考慮節奏，也不像以前那麼拼命。" },
        { speaker: "vodka", text: "不對...應該說她跑得更聰明了。" },
        { speaker: "vodka", text: "是你改變了她吧？" }
    ],
    choices: [
        {
            text: "是她自己努力的結果",
            hint: "赤驥+5, 伏特加+5",
            affectionChange: { daiwa_scarlet: 5, vodka: 5 },
            nextScene: "ch3_rival_humble"
        },
        {
            text: "我想成為她的支柱",
            hint: "+8 好感度",
            affectionChange: { daiwa_scarlet: 8 },
            nextScene: "ch3_rival_serious"
        },
        {
            text: "我什麼都沒做",
            hint: "+2 好感度",
            affectionChange: { daiwa_scarlet: 2 },
            nextScene: "ch3_rival_deny"
        }
    ]
};

CHAPTER_3_SCENES.ch3_rival_humble = {
    location: "特雷森學園 - 訓練場",
    dialogues: [
        { speaker: "vodka", text: "...哼。" },
        { speaker: "vodka", text: "你這種話，赤驥聽到一定會很高興。" },
        { speaker: "vodka", text: "不過我也覺得...她確實靠自己在努力。" },
        { speaker: "vodka", text: "但有你在她身邊，她才能這麼放鬆吧。" },
        { speaker: "vodka", text: "嘛、好好照顧她啊，訓練員。" },
        { speaker: "narrator", text: "伏特加難得地露出了溫柔的笑容。" },
        { speaker: "narrator", text: "兩個愛逞強的傢伙...果然很相似呢。" }
    ],
    nextScene: "ch3_night_field"
};

CHAPTER_3_SCENES.ch3_rival_serious = {
    location: "特雷森學園 - 訓練場",
    dialogues: [
        { speaker: "vodka", text: "...！" },
        { speaker: "vodka", text: "你這傢伙，當著我面說這種話不會不好意思嗎？" },
        { speaker: "narrator", text: "但伏特加的嘴角微微上揚了。" },
        { speaker: "vodka", text: "不過...我認可你了。" },
        { speaker: "vodka", text: "作為赤驥的訓練員——也作為她重要的人。" },
        { speaker: "vodka", text: "如果你敢辜負她，我可不會手下留情。" },
        { speaker: "narrator", text: "伏特加的眼神既認真又溫暖。" },
        { speaker: "narrator", text: "你感覺到一份沉甸甸的信任。" }
    ],
    nextScene: "ch3_night_field"
};

CHAPTER_3_SCENES.ch3_rival_deny = {
    location: "特雷森學園 - 訓練場",
    dialogues: [
        { speaker: "vodka", text: "什麼都沒做？真的嗎？" },
        { speaker: "vodka", text: "算了...你不承認也無所謂。" },
        { speaker: "vodka", text: "反正赤驥的變化，誰都看得出來。" },
        { speaker: "vodka", text: "就這樣吧。" },
        { speaker: "narrator", text: "伏特加聳了聳肩，轉身離開了。" },
        { speaker: "narrator", text: "她似乎有些失望。" }
    ],
    nextScene: "ch3_night_field"
};

// ============================================
// 3-4 深夜的操場 ★特殊事件
// (條件：好感度>40)
// ============================================

CHAPTER_3_SCENES.ch3_night_field = {
    location: "特雷森學園 - 訓練員辦公室",
    dialogues: [
        { speaker: "narrator", text: "某天夜晚，你在辦公室加班整理訓練報告。" },
        { speaker: "narrator", text: "時鐘已經指向深夜十一點。" },
        { speaker: "narrator", text: "辦公室裡只剩你一個人。" },
        { speaker: "narrator", text: "窗外突然傳來熟悉的——規律的跑步聲。" },
        { speaker: "narrator", text: "你走到窗邊望出去。" },
        { speaker: "narrator", text: "月光灑在操場上，一個小小的紅色身影在跑道上奔跑。" },
        { speaker: "narrator", text: "是赤驥。" }
    ],
    nextScene: "ch3_night_encounter"
};

CHAPTER_3_SCENES.ch3_night_encounter = {
    location: "特雷森學園 - 夜間操場",
    dialogues: [
        { speaker: "narrator", text: "你走出辦公室，來到操場。" },
        { speaker: "narrator", text: "月光之下，赤驥的身影在夜色中格外動人。" },
        { speaker: "narrator", text: "汗水順著她的臉頰滑落，卻洋溢著專注的光芒。" },
        { speaker: "daiwa_scarlet", text: "...！訓練員？你怎麼還沒回去？" },
        { speaker: "trainer", text: "我還在整理資料。倒是妳，這麼晚了還在練習？" },
        { speaker: "daiwa_scarlet", text: "我...就是睡不著而已。" },
        { speaker: "daiwa_scarlet", text: "跑步的時候，腦袋就能放空......什麼都不用想。" },
        { speaker: "narrator", text: "夜風吹過，赤驥額頭的汗珠在月光下閃閃發亮。" },
        { speaker: "narrator", text: "你看著她在月色裡微微喘息的樣子，心跳莫名加速。" }
    ],
    choices: [
        {
            text: "「妳認真練習的樣子...很美」",
            hint: "+10 好感度",
            affectionChange: { daiwa_scarlet: 10 },
            nextScene: "ch3_night_best"
        },
        {
            text: "「要注意身體，別太勉強」",
            hint: "+6 好感度",
            affectionChange: { daiwa_scarlet: 6 },
            nextScene: "ch3_night_good"
        },
        {
            text: "「我送妳回宿舍吧」",
            hint: "+5 好感度",
            affectionChange: { daiwa_scarlet: 5 },
            nextScene: "ch3_night_ok"
        }
    ]
};

CHAPTER_3_SCENES.ch3_night_best = {
    location: "特雷森學園 - 夜間操場",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "美...！？" },
        { speaker: "daiwa_scarlet", text: "你、你在說什麼啦！大深夜的...！" },
        { speaker: "narrator", text: "即使在月光下，也能看到赤驥的臉瞬間紅透了。" },
        { speaker: "narrator", text: "但她沒有跑開。" },
        { speaker: "narrator", text: "反而慢慢低下頭，用幾乎聽不見的聲音說——" },
        { speaker: "daiwa_scarlet", text: "......謝謝。" },
        { speaker: "narrator", text: "你們並肩坐在跑道旁的草地上。" },
        { speaker: "narrator", text: "月亮很圓，星星很亮。" },
        { speaker: "narrator", text: "四周安靜得只聽到蟲鳴和彼此的呼吸聲。" },
        { speaker: "daiwa_scarlet", text: "...訓練員。" },
        { speaker: "daiwa_scarlet", text: "你會一直看著我跑嗎？" },
        { speaker: "trainer", text: "當然。不管多久，我都會看著妳。" },
        { speaker: "narrator", text: "赤驥沒有再說話。" },
        { speaker: "narrator", text: "但你感覺到，她悄悄地靠近了一點。" },
        { speaker: "narrator", text: "兩人之間的距離，只剩下指尖的寬度。" }
    ],
    nextScene: "ch3_night_walkback"
};

CHAPTER_3_SCENES.ch3_night_good = {
    location: "特雷森學園 - 夜間操場",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "嗯...我知道了。" },
        { speaker: "daiwa_scarlet", text: "你總是在擔心我呢。" },
        { speaker: "trainer", text: "因為妳是我重要的...搭檔啊。" },
        { speaker: "daiwa_scarlet", text: "搭檔...是嗎。" },
        { speaker: "narrator", text: "赤驥的表情有一瞬間的失落，但很快恢復了笑容。" },
        { speaker: "daiwa_scarlet", text: "謝謝你的關心。" },
        { speaker: "daiwa_scarlet", text: "我再跑最後一圈就回去，你不用等我。" },
        { speaker: "trainer", text: "那我陪妳跑完這最後一圈。" },
        { speaker: "daiwa_scarlet", text: "...真拿你沒辦法。" }
    ],
    nextScene: "ch3_night_walkback"
};

CHAPTER_3_SCENES.ch3_night_ok = {
    location: "特雷森學園 - 夜間操場",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "欸？不用啦，我自己可以回去的。" },
        { speaker: "trainer", text: "這麼晚了，還是一起走比較安全。" },
        { speaker: "daiwa_scarlet", text: "我是馬娘耶！哪需要你保護......" },
        { speaker: "daiwa_scarlet", text: "......好吧。走吧。" },
        { speaker: "narrator", text: "赤驥收拾好毛巾，擦了擦汗。" },
        { speaker: "narrator", text: "你們一起往宿舍的方向走去。" }
    ],
    nextScene: "ch3_night_walkback"
};

CHAPTER_3_SCENES.ch3_night_walkback = {
    location: "特雷森學園 - 夜間小路",
    dialogues: [
        { speaker: "narrator", text: "回宿舍的路上，四周安靜得只聽到蟲鳴聲。" },
        { speaker: "narrator", text: "路燈把兩個人的影子拉得很長。" },
        { speaker: "daiwa_scarlet", text: "...訓練員。" },
        { speaker: "daiwa_scarlet", text: "你說...我能贏嗎？正式的大賽。" },
        { speaker: "trainer", text: "能。我會讓妳站上最高的舞台。" },
        { speaker: "daiwa_scarlet", text: "...嗯。那我更要加倍努力了。" },
        { speaker: "narrator", text: "她的聲音比平時柔軟了許多。" },
        { speaker: "narrator", text: "走到宿舍門口，赤驥停下了腳步。" },
        { speaker: "daiwa_scarlet", text: "到了。那我進去了。" },
        { speaker: "daiwa_scarlet", text: "...今天謝謝你。" },
        { speaker: "daiwa_scarlet", text: "晚安，訓練員。" },
        { speaker: "narrator", text: "宿舍的門關上後——" },
        { speaker: "narrator", text: "你隱約聽到裡面傳來一聲小小的歡呼。" }
    ],
    nextScene: "ch3_mcqueen"
};

// ============================================
// 3-5 麥昆的邀請 ▶ 開啟麥昆支線
// ============================================

CHAPTER_3_SCENES.ch3_mcqueen = {
    location: "特雷森學園 - 食堂",
    dialogues: [
        { speaker: "narrator", text: "隔天中午，食堂裡。" },
        { speaker: "narrator", text: "一位氣質優雅的白髮馬娘走到了你的面前。" },
        { speaker: "narrator", text: "是目白麥昆——學園中有名的大小姐。" },
        { speaker: "mejiro_mcqueen", text: "請問，你就是大和赤驥的訓練員嗎？" },
        { speaker: "trainer", text: "是的，妳是...？" },
        { speaker: "mejiro_mcqueen", text: "目白麥昆。請多指教。" },
        { speaker: "mejiro_mcqueen", text: "久仰大名了呢。" },
        { speaker: "mejiro_mcqueen", text: "能讓那孩子這麼在意的訓練員...有點興趣呢。" },
        { speaker: "mejiro_mcqueen", text: "下次有空一起喝杯茶如何？我知道一家很棒的茶室。" }
    ],
    choices: [
        {
            text: "「榮幸之至，麥昆小姐」",
            hint: "開啟麥昆支線",
            affectionChange: {},
            nextScene: "ch3_mcqueen_accept"
        },
        {
            text: "「謝謝妳的邀請，有機會一定去」",
            hint: "",
            affectionChange: {},
            nextScene: "ch3_mcqueen_polite"
        }
    ]
};

CHAPTER_3_SCENES.ch3_mcqueen_accept = {
    location: "特雷森學園 - 食堂",
    dialogues: [
        { speaker: "mejiro_mcqueen", text: "呵呵，很有禮貌呢。難怪赤驥會喜歡你。" },
        { speaker: "narrator", text: "這時，赤驥剛好端著餐盤路過。" },
        { speaker: "daiwa_scarlet", text: "麥昆前輩！？你怎麼在跟我的訓練員說話！" },
        { speaker: "mejiro_mcqueen", text: "你的訓練員？呵呵，好有佔有慾的說法呢。" },
        { speaker: "daiwa_scarlet", text: "才——才不是那個意思！" },
        { speaker: "mejiro_mcqueen", text: "好了好了，我先走了。下次一起喝茶，別忘了唷。" },
        { speaker: "narrator", text: "麥昆優雅地離開了。" },
        { speaker: "daiwa_scarlet", text: "...訓練員。麥昆前輩跟你說了什麼？" },
        { speaker: "trainer", text: "約喝茶而已。" },
        { speaker: "daiwa_scarlet", text: "......哼！隨便你！" },
        { speaker: "narrator", text: "赤驥頭也不回地走開了，但你注意到她的耳朵紅紅的。" },
        { speaker: "narrator", text: "【已開啟麥昆支線】" }
    ],
    nextScene: "ch3_secret"
};

CHAPTER_3_SCENES.ch3_mcqueen_polite = {
    location: "特雷森學園 - 食堂",
    dialogues: [
        { speaker: "mejiro_mcqueen", text: "嗯，隨時歡迎。" },
        { speaker: "narrator", text: "麥昆微微一笑，正準備離開時——" },
        { speaker: "daiwa_scarlet", text: "麥昆前輩？你在這裡做什麼？" },
        { speaker: "mejiro_mcqueen", text: "跟你的訓練員打個招呼而已。" },
        { speaker: "mejiro_mcqueen", text: "赤驥，你的訓練員人很不錯呢。好好珍惜喔。" },
        { speaker: "daiwa_scarlet", text: "什、什麼意思...？" },
        { speaker: "narrator", text: "麥昆意味深長地笑了笑，轉身離去。" },
        { speaker: "daiwa_scarlet", text: "...訓練員，你沒說什麼奇怪的話吧？" },
        { speaker: "trainer", text: "沒有啊。" },
        { speaker: "daiwa_scarlet", text: "哼...那就好。" }
    ],
    nextScene: "ch3_secret"
};

// ============================================
// 3-6 赤驥的秘密
// (條件：好感度>50)
// ============================================

CHAPTER_3_SCENES.ch3_secret = {
    location: "特雷森學園 - 走廊",
    dialogues: [
        { speaker: "narrator", text: "又過了幾天。放學後，特別週鬼鬼祟祟地跑來找你。" },
        { speaker: "special_week", text: "訓練員！訓練員！大事了！" },
        { speaker: "special_week", text: "那個...我跟你說，你不可以告訴赤驥前輩喔！" },
        { speaker: "special_week", text: "其實...赤驥前輩她......" },
        { speaker: "special_week", text: "晚上會偷偷看你們一起的合照發呆！" },
        { speaker: "special_week", text: "而且、而且！" },
        { speaker: "special_week", text: "她的日記裡寫了好多關於訓練員的事！" },
        { speaker: "special_week", text: "我不小心瞄到的...「訓練員今天又笑著看我練習了，好開心」之類的！" },
        { speaker: "special_week", text: "赤驥前輩絕對喜歡上訓練員了！" },
        { speaker: "narrator", text: "特別週興奮得眼睛都亮了起來。" }
    ],
    choices: [
        {
            text: "「我也...一樣」",
            hint: "+10 好感度",
            affectionChange: { daiwa_scarlet: 10 },
            nextScene: "ch3_secret_mutual"
        },
        {
            text: "「真的嗎？...我該怎麼辦」",
            hint: "+5 好感度",
            affectionChange: { daiwa_scarlet: 5 },
            nextScene: "ch3_secret_shy"
        },
        {
            text: "「別亂說，那是你想多了」",
            hint: "-5 好感度",
            affectionChange: { daiwa_scarlet: -5 },
            nextScene: "ch3_secret_deny"
        }
    ]
};

CHAPTER_3_SCENES.ch3_secret_mutual = {
    location: "特雷森學園 - 走廊",
    dialogues: [
        { speaker: "special_week", text: "欸欸欸！？「一樣」是什麼意思！？" },
        { speaker: "special_week", text: "訓練員也喜歡赤驥前輩嗎！？" },
        { speaker: "trainer", text: "噓！小聲一點...你聲音太大了。" },
        { speaker: "special_week", text: "（壓低聲音）太好了太好了！我要幫你們加油！" },
        { speaker: "narrator", text: "就在這時——走廊的轉角傳來一陣腳步聲。" },
        { speaker: "daiwa_scarlet", text: "特、特別週！你在那裡做什麼！" },
        { speaker: "special_week", text: "赤驥前輩！沒、沒什麼！我們在聊天氣的事！" },
        { speaker: "daiwa_scarlet", text: "聊天氣？為什麼你的表情那麼可疑......" },
        { speaker: "daiwa_scarlet", text: "到底在說什麼！給我從實招來！" },
        { speaker: "special_week", text: "對不起赤驥前輩！我先走了——！" },
        { speaker: "narrator", text: "特別週一溜煙地跑走了。" },
        { speaker: "daiwa_scarlet", text: "...訓練員，你也一臉心虛的樣子。你們剛才在說什麼？" },
        { speaker: "trainer", text: "...秘密。" },
        { speaker: "daiwa_scarlet", text: "什——！" },
        { speaker: "narrator", text: "赤驥氣鼓鼓地跺了跺腳，但眼神裡寫滿了好奇。" }
    ],
    nextScene: "ch3_end"
};

CHAPTER_3_SCENES.ch3_secret_shy = {
    location: "特雷森學園 - 走廊",
    dialogues: [
        { speaker: "special_week", text: "怎麼辦？當然是告白啊！" },
        { speaker: "trainer", text: "沒那麼簡單...我們是訓練員和馬娘的關係。" },
        { speaker: "special_week", text: "但...但是！赤驥前輩明明這麼喜歡你......" },
        { speaker: "narrator", text: "你陷入了沉思。" },
        { speaker: "narrator", text: "就在這時——走廊的另一頭傳來腳步聲。" },
        { speaker: "daiwa_scarlet", text: "特別週！你跟訓練員在偷偷摸摸幹什麼！" },
        { speaker: "special_week", text: "啊！赤驥前輩！沒、沒有什麼偷偷摸摸的！" },
        { speaker: "daiwa_scarlet", text: "那為什麼訓練員的臉那麼紅啊！" },
        { speaker: "trainer", text: "...沒什麼。" },
        { speaker: "daiwa_scarlet", text: "哼！你們兩個一定在說我壞話！不理你們了！" },
        { speaker: "narrator", text: "赤驥怒氣沖沖地轉身離開了。" },
        { speaker: "narrator", text: "但你注意到，她走路的步伐比平時更輕快了些。" }
    ],
    nextScene: "ch3_end"
};

CHAPTER_3_SCENES.ch3_secret_deny = {
    location: "特雷森學園 - 走廊",
    dialogues: [
        { speaker: "special_week", text: "欸...？想多了嗎？" },
        { speaker: "special_week", text: "可是赤驥前輩真的......" },
        { speaker: "trainer", text: "特別週，不要隨便翻別人的日記，知道嗎？" },
        { speaker: "special_week", text: "嗚...對不起......" },
        { speaker: "narrator", text: "特別週耷拉著耳朵走開了。" },
        { speaker: "narrator", text: "你靠在走廊的牆邊。" },
        { speaker: "narrator", text: "嘴上否認了...但心裡不知為什麼有些在意。" },
        { speaker: "narrator", text: "她真的...會寫那些東西嗎？" }
    ],
    nextScene: "ch3_end"
};

// ============================================
// 第三章結尾
// ============================================

CHAPTER_3_SCENES.ch3_end = {
    location: "特雷森學園 - 夕陽下的校園",
    dialogues: [
        { speaker: "narrator", text: "【第三章 - 完】" },
        { speaker: "narrator", text: "雨中的共傘、生日的驚喜、深夜的操場......" },
        { speaker: "narrator", text: "你和赤驥之間的距離，不知不覺地越來越近了。" },
        { speaker: "narrator", text: "伏特加的認可、麥昆的出現、特別週的爆料......" },
        { speaker: "narrator", text: "周圍的人都看出了你們之間微妙的變化。" },
        { speaker: "narrator", text: "而接下來等待著你們的——是更大的考驗。" },
        { speaker: "narrator", text: "——第四章《考驗》，敬請期待——" }
    ],
    nextScene: "chapter4_start"
};

// 匯出場景
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CHAPTER_3_SCENES };
}
