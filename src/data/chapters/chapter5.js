// ============================================
// 第五章：終章
// ============================================

const CHAPTER_5_SCENES = {};

CHAPTER_5_SCENES.chapter5_start = {
    location: "特雷森學園 - 訓練場",
    dialogues: [
        { speaker: "narrator", text: "【第五章：終章】" },
        { speaker: "narrator", text: "冬去春來。" },
        { speaker: "narrator", text: "經過了數個月的刻苦訓練，最終決戰的日子終於到來了。" },
        { speaker: "narrator", text: "這是赤驥最重要的一場比賽——也是你們這段旅程的終點。" },
        { speaker: "narrator", text: "校園裡的櫻花已經開始綻放了。" }
    ],
    nextScene: "ch5_eve"
};

// ============================================
// 5-1 決戰前夜
// ============================================

CHAPTER_5_SCENES.ch5_eve = {
    location: "特雷森學園 - 訓練場 (黃昏)",
    dialogues: [
        { speaker: "narrator", text: "決戰前夜。" },
        { speaker: "narrator", text: "最後一次訓練結束了。赤驥擦著汗，走到你面前。" },
        { speaker: "daiwa_scarlet", text: "訓練員。" },
        { speaker: "daiwa_scarlet", text: "明天...就是最後的決戰了。" },
        { speaker: "trainer", text: "嗯。妳準備好了嗎？" },
        { speaker: "daiwa_scarlet", text: "說實話...有點緊張。" },
        { speaker: "daiwa_scarlet", text: "上次輸給伏特加以後...一直在想，如果這次又輸了怎麼辦。" },
        { speaker: "narrator", text: "赤驥低下頭，手指不安地絞在一起。" },
        { speaker: "daiwa_scarlet", text: "但是......" },
        { speaker: "daiwa_scarlet", text: "有你在的話，我覺得...我可以做到。" },
        { speaker: "narrator", text: "她抬起頭看著你，眼睛裡映著夕陽的光。" }
    ],
    choices: [
        {
            text: "遞給她一個手工護身符",
            hint: "+10 好感度",
            affectionChange: { daiwa_scarlet: 10 },
            nextScene: "ch5_eve_charm"
        },
        {
            text: "「明天之後...我有話想對妳說」",
            hint: "+8 好感度",
            affectionChange: { daiwa_scarlet: 8 },
            nextScene: "ch5_eve_promise"
        },
        {
            text: "「盡全力跑吧，其他什麼都別想」",
            hint: "+5 好感度",
            affectionChange: { daiwa_scarlet: 5 },
            nextScene: "ch5_eve_focus"
        }
    ]
};

CHAPTER_5_SCENES.ch5_eve_charm = {
    location: "特雷森學園 - 訓練場 (黃昏)",
    dialogues: [
        { speaker: "narrator", text: "你從口袋裡拿出一個小小的護身符。" },
        { speaker: "narrator", text: "是你前幾天偷偷去神社求的，上面繡著「必勝」二字。" },
        { speaker: "trainer", text: "這個給妳。明天帶著它上場。" },
        { speaker: "daiwa_scarlet", text: "護身符...？" },
        { speaker: "narrator", text: "赤驥接過護身符，仔細端詳著。" },
        { speaker: "daiwa_scarlet", text: "你特地去求的？......為了我？" },
        { speaker: "trainer", text: "嗯。我在裡面放了一張小紙條。比賽前再看。" },
        { speaker: "daiwa_scarlet", text: "......笨蛋。" },
        { speaker: "narrator", text: "她把護身符緊緊握在胸口，像是在抱著什麼珍寶。" },
        { speaker: "daiwa_scarlet", text: "我會帶著它贏的。一定。" },
        { speaker: "narrator", text: "紙條上寫著：「不管結果如何，妳永遠是我的第一名。」" },
        { speaker: "narrator", text: "——但這個秘密，要等比賽前她才會知道。" }
    ],
    nextScene: "ch5_race_morning"
};

CHAPTER_5_SCENES.ch5_eve_promise = {
    location: "特雷森學園 - 訓練場 (黃昏)",
    dialogues: [
        { speaker: "daiwa_scarlet", text: "有話...？什麼話？" },
        { speaker: "trainer", text: "現在還不能說。但...比賽結束後，不管結果如何——" },
        { speaker: "trainer", text: "我有很重要的事要告訴妳。" },
        { speaker: "daiwa_scarlet", text: "......" },
        { speaker: "narrator", text: "赤驥的臉慢慢紅了起來。" },
        { speaker: "daiwa_scarlet", text: "你、你是故意的吧！" },
        { speaker: "daiwa_scarlet", text: "在比賽前說這種話...我怎麼能專心啦！" },
        { speaker: "trainer", text: "所以更要贏了，對吧？" },
        { speaker: "daiwa_scarlet", text: "......哼！你等著！我一定讓你親眼看到我衝過終點！" },
        { speaker: "narrator", text: "赤驥轉身跑開了，但腳步比任何時候都輕快。" }
    ],
    nextScene: "ch5_race_morning"
};

CHAPTER_5_SCENES.ch5_eve_focus = {
    location: "特雷森學園 - 訓練場 (黃昏)",
    dialogues: [
        { speaker: "trainer", text: "赤驥，明天什麼都別想。只管盡全力跑就好。" },
        { speaker: "daiwa_scarlet", text: "只管跑...嗎。" },
        { speaker: "trainer", text: "妳是最努力的。這幾個月的訓練不會騙人的。" },
        { speaker: "daiwa_scarlet", text: "...嗯。你說得對。" },
        { speaker: "daiwa_scarlet", text: "不去想那些有的沒的了！" },
        { speaker: "daiwa_scarlet", text: "只管跑！跑到最前面！" },
        { speaker: "narrator", text: "赤驥握緊拳頭，自言自語般地給自己打氣。" },
        { speaker: "narrator", text: "你看著她的側臉，心裡默默許下了願望。" }
    ],
    nextScene: "ch5_race_morning"
};

// ============================================
// 5-2 比賽當天
// ============================================

CHAPTER_5_SCENES.ch5_race_morning = {
    location: "東京賽馬場 - 選手通道",
    dialogues: [
        { speaker: "narrator", text: "比賽當天——東京賽馬場。" },
        { speaker: "narrator", text: "天氣晴朗，春風帶著櫻花的香氣。" },
        { speaker: "narrator", text: "這是最好的比賽日。" },
        { speaker: "narrator", text: "在選手通道裡，赤驥正在做最後的準備。" },
        { speaker: "narrator", text: "她看到你走來，深吸了一口氣。" },
        { speaker: "daiwa_scarlet", text: "訓練員...我來了。" },
        { speaker: "narrator", text: "她的表情前所未有的認真——卻也前所未有的堅定。" },
        { speaker: "daiwa_scarlet", text: "看著我。" },
        { speaker: "daiwa_scarlet", text: "我會贏的。" }
    ],
    choices: [
        {
            text: "「我愛妳，赤驥。去贏吧。」",
            hint: "+15 好感度",
            affectionChange: { daiwa_scarlet: 15 },
            nextScene: "ch5_race_confession"
        },
        {
            text: "「去吧！我相信妳！」",
            hint: "+8 好感度",
            affectionChange: { daiwa_scarlet: 8 },
            nextScene: "ch5_race_believe"
        },
        {
            text: "「加油！」",
            hint: "+3 好感度",
            affectionChange: { daiwa_scarlet: 3 },
            nextScene: "ch5_race_cheer"
        }
    ]
};

CHAPTER_5_SCENES.ch5_race_confession = {
    location: "東京賽馬場 - 選手通道",
    dialogues: [
        { speaker: "narrator", text: "那句話，在你心裡藏了好久好久。" },
        { speaker: "narrator", text: "而此刻——它終於說出口了。" },
        { speaker: "daiwa_scarlet", text: "......" },
        { speaker: "daiwa_scarlet", text: "............" },
        { speaker: "daiwa_scarlet", text: "你......" },
        { speaker: "narrator", text: "赤驥的腦袋宕機了整整三秒鐘。" },
        { speaker: "narrator", text: "然後，她的臉從脖子紅到了耳尖。" },
        { speaker: "daiwa_scarlet", text: "你、你你你——在這種時候說這種話！！" },
        { speaker: "daiwa_scarlet", text: "我的心臟要炸了啦笨蛋！！" },
        { speaker: "narrator", text: "她猛地轉過身，但你看到她的肩膀在微微發抖。" },
        { speaker: "daiwa_scarlet", text: "......看好了。" },
        { speaker: "daiwa_scarlet", text: "我會用勝利來回答你的！！" },
        { speaker: "narrator", text: "赤驥頭也不回地衝向了賽場。" },
        { speaker: "narrator", text: "但她握著護身符的手——比任何時候都要用力。" }
    ],
    nextScene: "ch5_the_race"
};

CHAPTER_5_SCENES.ch5_race_believe = {
    location: "東京賽馬場 - 選手通道",
    dialogues: [
        { speaker: "trainer", text: "去吧，赤驥！我相信妳！" },
        { speaker: "daiwa_scarlet", text: "...！" },
        { speaker: "narrator", text: "你向她伸出了拳頭。" },
        { speaker: "narrator", text: "赤驥看著你的拳頭，然後——露出了燦爛的笑容。" },
        { speaker: "daiwa_scarlet", text: "嗯！" },
        { speaker: "narrator", text: "她用力地和你碰了碰拳。" },
        { speaker: "daiwa_scarlet", text: "等我贏了回來！" },
        { speaker: "narrator", text: "赤驥帶著滿滿的自信，走向了起跑線。" }
    ],
    nextScene: "ch5_the_race"
};

CHAPTER_5_SCENES.ch5_race_cheer = {
    location: "東京賽馬場 - 選手通道",
    dialogues: [
        { speaker: "trainer", text: "加油！" },
        { speaker: "daiwa_scarlet", text: "...就只有「加油」嗎？" },
        { speaker: "narrator", text: "赤驥有些失望地看了你一眼。" },
        { speaker: "daiwa_scarlet", text: "......算了！" },
        { speaker: "daiwa_scarlet", text: "不管怎樣，我會贏的！" },
        { speaker: "narrator", text: "赤驥轉身走向賽場。" },
        { speaker: "narrator", text: "在轉角處，她停下腳步回頭看了你一眼。" },
        { speaker: "daiwa_scarlet", text: "比賽結束後...你要在終點等我。" },
        { speaker: "narrator", text: "她的語氣不像是請求。而是——命令。" }
    ],
    nextScene: "ch5_the_race"
};

// ============================================
// 5-3 比賽與結局
// ============================================

CHAPTER_5_SCENES.ch5_the_race = {
    location: "東京賽馬場 - 賽場",
    dialogues: [
        { speaker: "narrator", text: "起跑閘門前。" },
        { speaker: "narrator", text: "赤驥、伏特加，還有其他頂尖的馬娘們，全部就位了。" },
        { speaker: "narrator", text: "看台上的歡呼聲震耳欲聾。" },
        { speaker: "narrator", text: "你站在看台的最前方，緊握著雙手。" },
        { speaker: "narrator", text: "——槍聲響起！" },
        { speaker: "narrator", text: "比賽開始了！" },
        { speaker: "narrator", text: "赤驥從第六道出發，起步穩定。" },
        { speaker: "narrator", text: "第一個彎道——她位居第四。" },
        { speaker: "narrator", text: "後半段——她開始發力，超越了前方的對手！" },
        { speaker: "narrator", text: "最後三百米！赤驥和伏特加並駕齊驅！" },
        { speaker: "narrator", text: "觀眾席爆發出瘋狂的吶喊——" },
        { speaker: "narrator", text: "最後一百米——赤驥的步伐沒有停下！" },
        { speaker: "narrator", text: "五十米——她用盡了全部的力氣！" },
        { speaker: "narrator", text: "衝線——！！" }
    ],
    nextScene: "ch5_result"
};

CHAPTER_5_SCENES.ch5_result = {
    location: "東京賽馬場 - 賽場",
    dialogues: [
        { speaker: "narrator", text: "全場安靜了一秒。" },
        { speaker: "narrator", text: "然後——" },
        { speaker: "narrator", text: "大螢幕上亮出了成績。" },
        { speaker: "narrator", text: "第一名——大和赤驥。" },
        { speaker: "narrator", text: "觀眾席瞬間爆發出雷鳴般的歡呼。" },
        { speaker: "vodka", text: "可惡...！又是差一點...！" },
        { speaker: "vodka", text: "...但這次，我心服口服了。赤驥。" },
        { speaker: "narrator", text: "赤驥站在賽場中央，大口喘著氣。" },
        { speaker: "narrator", text: "她環顧四周，在看台上尋找著什麼——" },
        { speaker: "narrator", text: "然後，她找到了你。" },
        { speaker: "narrator", text: "你們的視線在人海中交會。" }
    ],
    nextScene: "ch5_victory_interview"
};

CHAPTER_5_SCENES.ch5_victory_interview = {
    location: "東京賽馬場 - 賽場",
    dialogues: [
        { speaker: "narrator", text: "記者湧了上來。" },
        { speaker: "narrator", text: "「大和赤驥選手！恭喜妳奪冠！請問現在的心情如何？」" },
        { speaker: "daiwa_scarlet", text: "嗯...我很開心。" },
        { speaker: "daiwa_scarlet", text: "但這不是我一個人的力量。" },
        { speaker: "daiwa_scarlet", text: "是我的訓練員...是他一直相信我、支持我。" },
        { speaker: "daiwa_scarlet", text: "沒有他的話，我不可能站在這裡。" },
        { speaker: "narrator", text: "赤驥對著鏡頭，但她的眼睛只看著一個方向——你所在的方向。" },
        { speaker: "daiwa_scarlet", text: "我要感謝我的訓練員...他給了我勇氣。" },
        { speaker: "daiwa_scarlet", text: "他曾經說過——不管結果如何，他都會在我身邊。" },
        { speaker: "daiwa_scarlet", text: "...我想用這場勝利告訴他——" },
        { speaker: "daiwa_scarlet", text: "我也想一直在你身邊。" },
        { speaker: "narrator", text: "全場再次沸騰了。" },
        { speaker: "narrator", text: "記者們興奮地追問，但赤驥已經不管了。" },
        { speaker: "narrator", text: "她跑下了採訪台——" },
        { speaker: "narrator", text: "朝著你的方向——" },
        { speaker: "narrator", text: "全力奔跑。" }
    ],
    nextScene: "ch5_cherry_blossom"
};

CHAPTER_5_SCENES.ch5_cherry_blossom = {
    location: "特雷森學園 - 櫻花樹下",
    dialogues: [
        { speaker: "narrator", text: "——那天晚上。" },
        { speaker: "narrator", text: "你來到了學園裡那棵最大的櫻花樹下。" },
        { speaker: "narrator", text: "赤驥已經在那裡等著了。" },
        { speaker: "narrator", text: "春風吹過，花瓣紛紛揚揚地飄落。" },
        { speaker: "narrator", text: "月光透過花枝，灑在她的臉上。" },
        { speaker: "narrator", text: "她穿著便服，手裡緊緊握著那枚護身符。" },
        { speaker: "daiwa_scarlet", text: "...你來了。" },
        { speaker: "trainer", text: "嗯。恭喜妳，赤驥。妳做到了。" },
        { speaker: "daiwa_scarlet", text: "嗯......" },
        { speaker: "narrator", text: "她低著頭，聲音很小。" },
        { speaker: "daiwa_scarlet", text: "訓練員...那個......" },
        { speaker: "daiwa_scarlet", text: "你之前說的...比賽後有話要說......" },
        { speaker: "daiwa_scarlet", text: "是...是什麼？" },
        { speaker: "narrator", text: "她的聲音在顫抖。" },
        { speaker: "narrator", text: "即使是在萬名觀眾面前衝過終點線的馬娘——" },
        { speaker: "narrator", text: "此刻也像是一個等待答案的普通女孩。" }
    ],
    nextScene: "end"
};

// 匯出場景
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CHAPTER_5_SCENES };
}
