// ============================================
// 第四章：考驗篇
// ============================================

const CHAPTER_4_SCENES = {};

CHAPTER_4_SCENES.chapter4_start = {
    location: "特雷森學園 - 訓練場",
    dialogues: [
        { speaker: "narrator", text: "【第四章：考驗】" },
        { speaker: "narrator", text: "進入秋季，學園裡的氣氛變得緊張了起來。" },
        { speaker: "narrator", text: "因為——一年一度的重大比賽即將來臨。" },
        { speaker: "narrator", text: "這場比賽不只是榮譽之戰，更關係到每個馬娘的未來。" },
        { speaker: "narrator", text: "赤驥卯足了勁，比平時更認真地投入訓練。" }
    ],
    nextScene: "ch4_before_race"
};

// ============================================
// 4-1 重大比賽前
// ============================================

CHAPTER_4_SCENES.ch4_before_race = {
    location: "特雷森學園 - 訓練場",
    dialogues: [
        { speaker: "narrator", text: "比賽前一週，訓練進入最後衝刺階段。" },
        { speaker: "daiwa_scarlet", text: "訓練員！再加一組衝刺！" },
        { speaker: "trainer", text: "赤驥，今天的量已經夠了。再練下去身體會撐不住的。" },
        { speaker: "daiwa_scarlet", text: "可是...我還不夠！這場比賽我一定要贏！" },
        { speaker: "narrator", text: "赤驥的眼神比以往任何時候都要認真。" },
        { speaker: "narrator", text: "你看得出來，她承受著巨大的壓力。" }
    ],
    choices: [
        {
            text: "「盡全力就好，我在這裡」",
            hint: "+8 好感度",
            affectionChange: { daiwa_scarlet: 8 },
            nextScene: "ch4_before_best"
        },
        {
            text: "「我相信妳一定辦得到」",
            hint: "+5 好感度",
            affectionChange: { daiwa_scarlet: 5 },
            nextScene: "ch4_before_good"
        },
        {
            text: "「輸了也沒關係」",
            hint: "+2 好感度",
            affectionChange: { daiwa_scarlet: 2 },
            nextScene: "ch4_before_ok"
        }
    ]
};

CHAPTER_4_SCENES.ch4_before_best = {
    location: "特雷森學園 - 訓練場",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "你在這裡......" },
        { speaker: "narrator", text: "赤驥的表情柔和了下來。" },
        { speaker: "daiwa_scarlet", text: "...嗯。有你在的話...我好像沒那麼害怕了。" },
        { speaker: "trainer", text: "不管結果如何，我都會站在妳身邊。" },
        { speaker: "daiwa_scarlet", text: "訓練員......" },
        { speaker: "daiwa_scarlet", text: "......謝謝你。那，我就信你一次！今天就到這裡吧。" },
        { speaker: "narrator", text: "赤驥第一次乖乖地聽了你的話，停下了訓練。" },
        { speaker: "narrator", text: "離開時，她回頭看了你一眼，臉上帶著安心的笑容。" }
    ],
    nextScene: "ch4_race_day"
};

CHAPTER_4_SCENES.ch4_before_good = {
    location: "特雷森學園 - 訓練場",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "你相信我...嗎？" },
        { speaker: "trainer", text: "當然。從我當上妳的訓練員那天起，就一直相信。" },
        { speaker: "daiwa_scarlet", text: "哼...那我可不能讓你失望了！" },
        { speaker: "narrator", text: "赤驥握緊了拳頭，眼神恢復了自信。" },
        { speaker: "daiwa_scarlet", text: "好！那就照你說的，今天先到這裡！" }
    ],
    nextScene: "ch4_race_day"
};

CHAPTER_4_SCENES.ch4_before_ok = {
    location: "特雷森學園 - 訓練場",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "輸了也沒關係？" },
        { speaker: "daiwa_scarlet", text: "...你是我的訓練員吧？怎麼能說出這種話？" },
        { speaker: "trainer", text: "我的意思是，不要給自己太大壓力——" },
        { speaker: "daiwa_scarlet", text: "我不需要安慰！我需要的是勝利！！" },
        { speaker: "narrator", text: "赤驥甩頭跑走了。" },
        { speaker: "narrator", text: "你說錯話了......該怎麼挽回呢。" }
    ],
    nextScene: "ch4_race_day"
};

// ============================================
// 4-2 比賽失利 ★重要事件
// ============================================

CHAPTER_4_SCENES.ch4_race_day = {
    location: "東京賽馬場",
    dialogues: [
        { speaker: "narrator", text: "比賽當天——東京賽馬場。" },
        { speaker: "narrator", text: "看台上擠滿了觀眾，空氣中充滿了緊張與期待。" },
        { speaker: "narrator", text: "赤驥站在起跑閘門前，與伏特加對視。" },
        { speaker: "vodka", text: "赤驥，這次我不會讓妳了。" },
        { speaker: "daiwa_scarlet", text: "正合我意。我也不會手下留情！" },
        { speaker: "narrator", text: "槍聲響起——比賽開始了！" },
        { speaker: "narrator", text: "開局赤驥位居中段，節奏穩定。" },
        { speaker: "narrator", text: "最後直線——赤驥發動衝刺！" },
        { speaker: "narrator", text: "但伏特加的速度更快！" },
        { speaker: "narrator", text: "衝過終點線的那一刻——" },
        { speaker: "narrator", text: "伏特加，第一名。" },
        { speaker: "narrator", text: "赤驥......第三名。" }
    ],
    nextScene: "ch4_after_loss"
};

CHAPTER_4_SCENES.ch4_after_loss = {
    location: "東京賽馬場 - 更衣室",
    dialogues: [
        { speaker: "narrator", text: "比賽結束後——" },
        { speaker: "narrator", text: "你在更衣室外面等了很久。" },
        { speaker: "narrator", text: "終於，你聽到了裡面傳來的聲音。" },
        { speaker: "narrator", text: "很小、很壓抑的哭泣聲。" },
        { speaker: "narrator", text: "你推開門。" },
        { speaker: "narrator", text: "赤驥蜷縮在角落，雙手緊緊抱著膝蓋。" },
        { speaker: "daiwa_scarlet", text: "為什麼......" },
        { speaker: "daiwa_scarlet", text: "我已經這麼努力了......" },
        { speaker: "daiwa_scarlet", text: "為什麼還是贏不了......！" },
        { speaker: "narrator", text: "她的肩膀在不停顫抖。" },
        { speaker: "narrator", text: "賽場上那個意氣風發的馬娘，此刻脆弱得像個孩子。" }
    ],
    choices: [
        {
            text: "走上前去，緊緊抱住她",
            hint: "+15 好感度",
            affectionChange: { daiwa_scarlet: 15 },
            nextScene: "ch4_loss_hug"
        },
        {
            text: "「妳的努力，我全都看在眼裡」",
            hint: "+10 好感度",
            affectionChange: { daiwa_scarlet: 10 },
            nextScene: "ch4_loss_words"
        },
        {
            text: "「下次一定會贏的」",
            hint: "+5 好感度",
            affectionChange: { daiwa_scarlet: 5 },
            nextScene: "ch4_loss_future"
        },
        {
            text: "什麼都不說，默默陪在她身邊",
            hint: "+8 好感度",
            affectionChange: { daiwa_scarlet: 8 },
            nextScene: "ch4_loss_silent"
        }
    ]
};

CHAPTER_4_SCENES.ch4_loss_hug = {
    location: "東京賽馬場 - 更衣室",
    dialogues: [
        { speaker: "narrator", text: "你什麼都沒說，走上前去。" },
        { speaker: "narrator", text: "然後——緊緊地抱住了她。" },
        { speaker: "daiwa_scarlet", text: "...！" },
        { speaker: "daiwa_scarlet", text: "訓、訓練員...？" },
        { speaker: "trainer", text: "......妳已經很棒了。" },
        { speaker: "narrator", text: "赤驥的身體先是僵硬了一瞬。" },
        { speaker: "narrator", text: "然後——她的手緩緩地抓住了你的衣角。" },
        { speaker: "daiwa_scarlet", text: "......笨蛋。" },
        { speaker: "daiwa_scarlet", text: "我...我輸了耶...？你不生氣嗎......？" },
        { speaker: "trainer", text: "怎麼會。我驕傲都來不及了。" },
        { speaker: "narrator", text: "赤驥埋在你胸口，哭得更厲害了。" },
        { speaker: "narrator", text: "但這一次，不是因為悲傷。" },
        { speaker: "narrator", text: "你感覺到，她的手從衣角移到了你的背後——" },
        { speaker: "narrator", text: "輕輕地、卻用力地回抱了你。" }
    ],
    nextScene: "ch4_vodka_talk"
};

CHAPTER_4_SCENES.ch4_loss_words = {
    location: "東京賽馬場 - 更衣室",
    dialogues: [
        { speaker: "trainer", text: "赤驥。" },
        { speaker: "trainer", text: "每一天的晨跑、每一次的衝刺、每一個深夜的加練——" },
        { speaker: "trainer", text: "妳的努力，我全部都看在眼裡。" },
        { speaker: "daiwa_scarlet", text: "......可是我還是輸了。" },
        { speaker: "trainer", text: "一場比賽的勝負，否定不了妳這些日子的付出。" },
        { speaker: "narrator", text: "赤驥抬起頭，淚眼朦朧地看著你。" },
        { speaker: "daiwa_scarlet", text: "...你真的這麼覺得嗎？" },
        { speaker: "trainer", text: "嗯。百分之百。" },
        { speaker: "daiwa_scarlet", text: "......嗚...謝謝你...訓練員......" },
        { speaker: "narrator", text: "赤驥用袖子擦了擦眼淚，露出了一個很勉強但很真實的微笑。" }
    ],
    nextScene: "ch4_vodka_talk"
};

CHAPTER_4_SCENES.ch4_loss_future = {
    location: "東京賽馬場 - 更衣室",
    dialogues: [
        { speaker: "trainer", text: "赤驥，下次一定會贏的。" },
        { speaker: "daiwa_scarlet", text: "下次......" },
        { speaker: "daiwa_scarlet", text: "嗯......你說得對。" },
        { speaker: "daiwa_scarlet", text: "哭也不會改變什麼......" },
        { speaker: "narrator", text: "赤驥站了起來，擦乾了眼淚。" },
        { speaker: "daiwa_scarlet", text: "我不會再輸第二次了！" },
        { speaker: "narrator", text: "她的眼神重新燃起了鬥志。" },
        { speaker: "narrator", text: "但你看得出來——她其實還沒有完全釋懷。" }
    ],
    nextScene: "ch4_vodka_talk"
};

CHAPTER_4_SCENES.ch4_loss_silent = {
    location: "東京賽馬場 - 更衣室",
    dialogues: [
        { speaker: "narrator", text: "你走到赤驥身邊，安靜地坐了下來。" },
        { speaker: "narrator", text: "什麼都沒說，只是默默地陪著她。" },
        { speaker: "narrator", text: "一分鐘、兩分鐘...五分鐘過去了。" },
        { speaker: "narrator", text: "赤驥的哭聲漸漸停了下來。" },
        { speaker: "daiwa_scarlet", text: "...你怎麼不說話？" },
        { speaker: "trainer", text: "想哭的時候，就盡情哭吧。我在這裡。" },
        { speaker: "daiwa_scarlet", text: "......笨蛋。" },
        { speaker: "narrator", text: "她把頭靠在了你的肩膀上。" },
        { speaker: "narrator", text: "你們就這樣安靜地坐著，直到夕陽染紅了窗邊。" }
    ],
    nextScene: "ch4_vodka_talk"
};

// ============================================
// 4-3 伏特加的告白
// ============================================

CHAPTER_4_SCENES.ch4_vodka_talk = {
    location: "東京賽馬場 - 屋頂休息區",
    dialogues: [
        { speaker: "narrator", text: "比賽結束的第二天。" },
        { speaker: "narrator", text: "你收到了伏特加的訊息，約你在學園屋頂見面。" },
        { speaker: "narrator", text: "你來到屋頂，伏特加已經等在那裡了。" },
        { speaker: "vodka", text: "...來了啊。" },
        { speaker: "narrator", text: "她今天的表情格外認真。" },
        { speaker: "vodka", text: "訓練員，我有些話...想跟你說清楚。" },
        { speaker: "vodka", text: "昨天的比賽，我贏了赤驥。" },
        { speaker: "vodka", text: "但我一點都不開心。" },
        { speaker: "vodka", text: "因為...她哭了。" },
        { speaker: "vodka", text: "那個死不服輸的傢伙，居然在更衣室裡哭了。" },
        { speaker: "narrator", text: "伏特加的聲音顫抖了一下。" },
        { speaker: "vodka", text: "赤驥那傢伙...就交給你了。" },
        { speaker: "vodka", text: "她嘴硬、愛逞強，但比誰都需要有人在身邊。" },
        { speaker: "vodka", text: "如果你讓她再哭一次——" },
        { speaker: "vodka", text: "我不會放過你。" }
    ],
    choices: [
        {
            text: "「我會讓她幸福的」",
            hint: "+10 好感度（赤驥）",
            affectionChange: { daiwa_scarlet: 10 },
            nextScene: "ch4_vodka_best"
        },
        {
            text: "「妳也喜歡她呢」",
            hint: "赤驥+5, 伏特加+5",
            affectionChange: { daiwa_scarlet: 5, vodka: 5 },
            nextScene: "ch4_vodka_bond"
        },
        {
            text: "「我們還只是訓練員和馬娘...」",
            hint: "+3 好感度",
            affectionChange: { daiwa_scarlet: 3 },
            nextScene: "ch4_vodka_deny"
        }
    ]
};

CHAPTER_4_SCENES.ch4_vodka_best = {
    location: "特雷森學園 - 屋頂",
    dialogues: [
        { speaker: "vodka", text: "...！" },
        { speaker: "narrator", text: "伏特加愣了一下，然後嘴角微微上揚。" },
        { speaker: "vodka", text: "哼...話說得挺大的。" },
        { speaker: "vodka", text: "不過...我相信你。" },
        { speaker: "vodka", text: "能說出這種話的傢伙，應該不會辜負她吧。" },
        { speaker: "narrator", text: "伏特加伸出了拳頭。" },
        { speaker: "vodka", text: "拜託你了...訓練員。" },
        { speaker: "narrator", text: "你和伏特加碰了碰拳。" },
        { speaker: "narrator", text: "這一刻，你從競爭對手的摯友那裡，得到了最重要的認可。" }
    ],
    nextScene: "ch4_promise"
};

CHAPTER_4_SCENES.ch4_vodka_bond = {
    location: "特雷森學園 - 屋頂",
    dialogues: [
        { speaker: "vodka", text: "我...喜歡？" },
        { speaker: "vodka", text: "你在說什麼鬼話！那是不一樣的！" },
        { speaker: "vodka", text: "我跟赤驥是競爭對手！是...是同伴！" },
        { speaker: "narrator", text: "伏特加的臉微微發紅。" },
        { speaker: "vodka", text: "...總之。" },
        { speaker: "vodka", text: "赤驥對我來說是很重要的人。" },
        { speaker: "vodka", text: "所以她重要的人，我也不想看到他搞砸。" },
        { speaker: "vodka", text: "懂了嗎？" },
        { speaker: "narrator", text: "伏特加說完就頭也不回地下了樓梯。" },
        { speaker: "narrator", text: "你看著她的背影，不禁微笑。" },
        { speaker: "narrator", text: "她們的友情...真的很好呢。" }
    ],
    nextScene: "ch4_promise"
};

CHAPTER_4_SCENES.ch4_vodka_deny = {
    location: "特雷森學園 - 屋頂",
    dialogues: [
        { speaker: "vodka", text: "...還只是？" },
        { speaker: "vodka", text: "你這傢伙，是認真的嗎？" },
        { speaker: "vodka", text: "赤驥都已經......" },
        { speaker: "narrator", text: "伏特加欲言又止，嘆了一口氣。" },
        { speaker: "vodka", text: "算了。隨便你吧。" },
        { speaker: "vodka", text: "但是...至少不要讓她受傷。" },
        { speaker: "narrator", text: "伏特加甩頭離開了。" },
        { speaker: "narrator", text: "你站在屋頂上，望著天空。" },
        { speaker: "narrator", text: "...自己到底在想什麼呢。" }
    ],
    nextScene: "ch4_promise"
};

// ============================================
// 4-4 兩人的約定 ★重要事件
// ============================================

CHAPTER_4_SCENES.ch4_promise = {
    location: "特雷森學園 - 夜間操場",
    dialogues: [
        { speaker: "narrator", text: "比賽過後一週。" },
        { speaker: "narrator", text: "傍晚，你收到赤驥的訊息：「有空嗎？到操場來。」" },
        { speaker: "narrator", text: "你來到操場時，赤驥已經在等你了。" },
        { speaker: "narrator", text: "和之前不同——她沒有在跑步。" },
        { speaker: "narrator", text: "她只是靜靜地站在跑道中央，仰望著星空。" },
        { speaker: "daiwa_scarlet", text: "...你來了。" },
        { speaker: "trainer", text: "嗯。怎麼了？" },
        { speaker: "narrator", text: "赤驥沉默了一會兒，然後深呼吸了一次。" },
        { speaker: "daiwa_scarlet", text: "訓練員...那個時候，謝謝你。" },
        { speaker: "daiwa_scarlet", text: "比賽輸了以後，我以為...我以為你會對我失望。" },
        { speaker: "daiwa_scarlet", text: "但你沒有。" },
        { speaker: "daiwa_scarlet", text: "你只是...一直在我身邊。" },
        { speaker: "narrator", text: "夜風吹動了她的長髮。星光映在她的眼睛裡。" },
        { speaker: "daiwa_scarlet", text: "我想變得更強。" },
        { speaker: "daiwa_scarlet", text: "不只是為了贏比賽。" },
        { speaker: "daiwa_scarlet", text: "而是為了...能繼續和你在一起。" }
    ],
    choices: [
        {
            text: "「我永遠會在妳身邊」",
            hint: "+12 好感度",
            affectionChange: { daiwa_scarlet: 12 },
            nextScene: "ch4_promise_best"
        },
        {
            text: "「一起走向頂點吧」",
            hint: "+10 好感度",
            affectionChange: { daiwa_scarlet: 10 },
            nextScene: "ch4_promise_good"
        },
        {
            text: "「我也是這麼想的」",
            hint: "+8 好感度",
            affectionChange: { daiwa_scarlet: 8 },
            nextScene: "ch4_promise_ok"
        }
    ]
};

CHAPTER_4_SCENES.ch4_promise_best = {
    location: "特雷森學園 - 夜間操場",
    dialogues: [
        { speaker: "trainer", text: "赤驥。" },
        { speaker: "trainer", text: "不管贏還是輸、不管前方有什麼困難——" },
        { speaker: "trainer", text: "我永遠會在妳身邊。這是我的約定。" },
        { speaker: "daiwa_scarlet", text: "......！" },
        { speaker: "narrator", text: "赤驥的眼眶又紅了。" },
        { speaker: "narrator", text: "但這一次，她沒有別過頭。" },
        { speaker: "daiwa_scarlet", text: "...笨蛋。" },
        { speaker: "daiwa_scarlet", text: "說出口了就不能反悔喔？" },
        { speaker: "trainer", text: "不會反悔。" },
        { speaker: "daiwa_scarlet", text: "......約定好了。" },
        { speaker: "narrator", text: "赤驥伸出了小指。" },
        { speaker: "narrator", text: "你們在星空下打了勾勾。" },
        { speaker: "narrator", text: "誰也不知道未來會怎樣——" },
        { speaker: "narrator", text: "但此刻，這個約定比任何獎盃都珍貴。" }
    ],
    nextScene: "ch4_mcqueen_tea"
};

CHAPTER_4_SCENES.ch4_promise_good = {
    location: "特雷森學園 - 夜間操場",
    dialogues: [
        { speaker: "trainer", text: "走向頂點的路，我們一起走。" },
        { speaker: "trainer", text: "下次的比賽，一定會贏的。我向妳保證。" },
        { speaker: "daiwa_scarlet", text: "...不是你保證的問題啦。" },
        { speaker: "daiwa_scarlet", text: "但...有你這句話，我就放心了！" },
        { speaker: "narrator", text: "赤驥握緊了拳頭，眼神裡重新燃起了火焰。" },
        { speaker: "daiwa_scarlet", text: "訓練員！明天開始加練！我要贏過伏特加！" },
        { speaker: "trainer", text: "好。我陪妳。" },
        { speaker: "daiwa_scarlet", text: "...嗯！" },
        { speaker: "narrator", text: "她笑了。是你見過最燦爛的笑容。" }
    ],
    nextScene: "ch4_mcqueen_tea"
};

CHAPTER_4_SCENES.ch4_promise_ok = {
    location: "特雷森學園 - 夜間操場",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "你也是...？" },
        { speaker: "trainer", text: "嗯。和妳一起跑的這段日子，是我最珍貴的時光。" },
        { speaker: "daiwa_scarlet", text: "訓練員......" },
        { speaker: "narrator", text: "赤驥低下頭，不讓你看到她的表情。" },
        { speaker: "daiwa_scarlet", text: "...你太狡猾了。" },
        { speaker: "daiwa_scarlet", text: "說這種話，我還怎麼生你的氣啊......" },
        { speaker: "narrator", text: "她的聲音很小，但你聽得一清二楚。" },
        { speaker: "narrator", text: "你們並肩站在星空下，手指幾乎碰在一起。" }
    ],
    nextScene: "ch4_mcqueen_tea"
};

// ============================================
// 4-5 麥昆的茶會 ★支線
// (條件：完成 3-5)
// ============================================

CHAPTER_4_SCENES.ch4_mcqueen_tea = {
    location: "目白家 - 茶室",
    dialogues: [
        { speaker: "narrator", text: "週末，你赴了麥昆的約，來到了目白家的茶室。" },
        { speaker: "narrator", text: "精美的茶具、芬芳的紅茶——一切都充滿了大小姐的品味。" },
        { speaker: "mejiro_mcqueen", text: "歡迎，訓練員先生。請坐。" },
        { speaker: "mejiro_mcqueen", text: "今天請你來，是想跟你聊聊赤驥的事。" },
        { speaker: "trainer", text: "赤驥的事？" },
        { speaker: "mejiro_mcqueen", text: "那孩子雖然驕傲，但對感情很純真。" },
        { speaker: "mejiro_mcqueen", text: "最近的她...怎麼說呢，眼裡有光了。" },
        { speaker: "mejiro_mcqueen", text: "以前她的眼裡只有「贏」這一個字。" },
        { speaker: "mejiro_mcqueen", text: "但現在...她的世界裡多了一個人。" },
        { speaker: "mejiro_mcqueen", text: "你知道那個人是誰嗎？" },
        { speaker: "narrator", text: "麥昆端起茶杯，優雅地笑了。" },
        { speaker: "mejiro_mcqueen", text: "請不要傷害她。" }
    ],
    choices: [
        {
            text: "「我發誓會珍惜她」",
            hint: "+8 好感度",
            affectionChange: { daiwa_scarlet: 8 },
            nextScene: "ch4_tea_best"
        },
        {
            text: "尷尬地轉移話題",
            hint: "+2 好感度",
            affectionChange: { daiwa_scarlet: 2 },
            nextScene: "ch4_tea_dodge"
        },
        {
            text: "「我們不是那種關係...」",
            hint: "-3 好感度",
            affectionChange: { daiwa_scarlet: -3 },
            nextScene: "ch4_tea_deny"
        }
    ]
};

CHAPTER_4_SCENES.ch4_tea_best = {
    location: "目白家 - 茶室",
    dialogues: [
        { speaker: "mejiro_mcqueen", text: "呵呵...很好的回答。" },
        { speaker: "mejiro_mcqueen", text: "看來赤驥選對人了呢。" },
        { speaker: "narrator", text: "就在這時——茶室的門被粗暴地推開了。" },
        { speaker: "daiwa_scarlet", text: "麥昆前輩！你跟我的訓練員在做什麼！" },
        { speaker: "mejiro_mcqueen", text: "「你的」訓練員？呵呵，你什麼時候開始這麼叫了？" },
        { speaker: "daiwa_scarlet", text: "才、才不是...！我是說...我們隊上的訓練員！" },
        { speaker: "mejiro_mcqueen", text: "我只是在跟他喝茶聊天而已。對吧？" },
        { speaker: "trainer", text: "嗯...是的。" },
        { speaker: "daiwa_scarlet", text: "......哼！" },
        { speaker: "narrator", text: "赤驥跺著腳離開了，但她回頭偷看了你好幾次。" },
        { speaker: "mejiro_mcqueen", text: "追上去吧，訓練員先生。她在等你。" },
        { speaker: "narrator", text: "麥昆優雅地揮了揮手，臉上帶著意味深長的微笑。" }
    ],
    nextScene: "ch4_end"
};

CHAPTER_4_SCENES.ch4_tea_dodge = {
    location: "目白家 - 茶室",
    dialogues: [
        { speaker: "trainer", text: "啊...這個茶真好喝呢！是什麼品種？" },
        { speaker: "mejiro_mcqueen", text: "...大吉嶺。" },
        { speaker: "mejiro_mcqueen", text: "轉移話題了呢。不過...算了。" },
        { speaker: "narrator", text: "麥昆沒有追問，但你感覺到她有些失望。" },
        { speaker: "narrator", text: "就在尷尬的沉默中——門外傳來了腳步聲。" },
        { speaker: "daiwa_scarlet", text: "麥昆前輩！你在裡面嗎？聽說你約了我的——...！" },
        { speaker: "daiwa_scarlet", text: "訓練員！？你真的來了！？" },
        { speaker: "mejiro_mcqueen", text: "來得正好。我們剛好聊完，你帶他回去吧。" },
        { speaker: "daiwa_scarlet", text: "我、我才不是來接他的！我只是路過！" },
        { speaker: "narrator", text: "赤驥拉著你的袖子，逃也似地離開了茶室。" }
    ],
    nextScene: "ch4_end"
};

CHAPTER_4_SCENES.ch4_tea_deny = {
    location: "目白家 - 茶室",
    dialogues: [
        { speaker: "mejiro_mcqueen", text: "...不是嗎？" },
        { speaker: "mejiro_mcqueen", text: "那真是遺憾呢。" },
        { speaker: "narrator", text: "麥昆輕輕放下茶杯，表情變得嚴肅。" },
        { speaker: "mejiro_mcqueen", text: "訓練員先生，我只說一次。" },
        { speaker: "mejiro_mcqueen", text: "如果你沒有覺悟，就不要給她希望。" },
        { speaker: "mejiro_mcqueen", text: "半吊子的溫柔，是最殘忍的。" },
        { speaker: "narrator", text: "茶室的門打開了——赤驥站在門口。" },
        { speaker: "daiwa_scarlet", text: "麥昆前...輩...？" },
        { speaker: "narrator", text: "赤驥看到了你們之間凝重的氣氛，臉色微微一沉。" },
        { speaker: "daiwa_scarlet", text: "...你們在聊什麼？" },
        { speaker: "mejiro_mcqueen", text: "沒什麼。只是大人之間的對話。" },
        { speaker: "narrator", text: "你從茶室離開時，感覺到赤驥的目光一直追隨著你。" }
    ],
    nextScene: "ch4_end"
};

// ============================================
// 第四章結尾
// ============================================

CHAPTER_4_SCENES.ch4_end = {
    location: "特雷森學園 - 黃昏的走廊",
    dialogues: [
        { speaker: "narrator", text: "【第四章 - 完】" },
        { speaker: "narrator", text: "比賽的挫敗、伏特加的託付、星空下的約定......" },
        { speaker: "narrator", text: "這些考驗讓你和赤驥的心靠得更近了。" },
        { speaker: "narrator", text: "而最後的決戰，即將到來。" },
        { speaker: "narrator", text: "——第五章《終章》——" }
    ],
    nextScene: "chapter5_start"
};

// 匯出場景
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CHAPTER_4_SCENES };
}
