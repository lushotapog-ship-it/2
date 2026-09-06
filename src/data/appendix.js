// Curated reference content from Appendices A-D of the Master Paragraph Bank v2.
// Hand-structured from the PDF (not auto-parsed) since the source is laid out as
// tables/prose rather than repeating records.

export const appendixA = {
  title: '附錄 A　首句改寫公式（防離題）',
  intro:
    '背熟了 Master 而直接照抄，最常見的死法不是文法錯，而是離題——考官看得出這是一段「通用文字」，Content 分會被壓低。解決方法只有一個動作：每一段的第一句和最後一句，必須出現題目的關鍵詞。',
  steps: [
    { step: '第一步', text: '圈出題目的關鍵名詞（例：exchange programme、fast fashion、AI in education）。' },
    { step: '第二步', text: '把 Master 首句的籠統主語（the experience / new experiences / this service / technology）換成該關鍵名詞。' },
    { step: '第三步', text: '在段末補一句「扣題句」，把段落結論明確拉回題目。' },
  ],
  universalSentences: [
    'This is one of the main reasons why [題目關鍵詞] is worth supporting.',
    'For [題目對象] in particular, this benefit is difficult to gain in any other way.',
    'This concern applies directly to [題目關鍵詞].',
    'Any decision about [題目關鍵詞] should therefore take this into account.',
  ],
  demoTable: [
    { topic: 'Should students join an exchange programme?', rewrite: 'Joining an exchange programme helps young people become more independent and mature.' },
    { topic: 'The benefits of part-time jobs', rewrite: 'Taking a part-time job helps young people become more independent and mature.' },
    { topic: 'Living in a university hostel', rewrite: 'Living away from home for the first time helps young people become more independent and mature.' },
    { topic: 'Should teenagers travel alone?', rewrite: 'Travelling without adults helps young people become more independent and mature.' },
  ],
  fullDemo: {
    topic: 'Should secondary schools organise overseas exchange programmes?',
    text: "Joining an overseas exchange programme helps young people become more independent and mature. When parents or teachers are not always there to make decisions for them, they need to manage their own time, deal with everyday problems and decide what to do when unexpected situations arise. They also begin to understand that their choices have consequences. For secondary students who have never lived away from their families, this kind of growth is difficult to gain inside a classroom.",
    note: '（首句換了主語、末句加了扣題句，其餘一字不改。）',
  },
  warning:
    '如果題目關鍵詞完全塞不進首句而不變得古怪，代表這一段本身不適用——換另一個 Master，不要硬套。每個 Master 的「可搬」欄就是用來做這個判斷的。',
};

export const appendixB = {
  title: '附錄 B　文體範本 ＋ 開頭段/結尾段',
  intro: 'Paper 2 的 Organisation 分很大程度看文體格式對不對，跟內容無關，卻是最容易拿、也最容易白白丟掉的分。',
  openingFormula: {
    title: 'B1 通用開頭段（4 句公式，任何議論文都可用）',
    sentences: [
      { fn: '現象/背景', pattern: 'In recent years, [話題] has become increasingly common in Hong Kong.' },
      { fn: '指出爭議', pattern: 'While some people believe that [正方], others argue that [反方].' },
      { fn: '表明立場', pattern: 'In my view, [你的立場], provided that [條件].' },
      { fn: '預告結構', pattern: 'This [article / letter / report] will explain two main reasons and then consider one common objection.' },
    ],
    example:
      'In recent years, online learning has become increasingly common in Hong Kong schools. While some people believe that it makes education more flexible, others argue that it weakens students\' concentration. In my view, online learning is valuable, provided that it is used together with face-to-face teaching rather than replacing it. This article will explain two main benefits and then consider one common concern.',
  },
  closingFormula: {
    title: 'B2 通用結尾段（3 句公式）',
    sentences: [
      { fn: '重述立場（換字，不要抄回開頭）', pattern: 'To sum up, [立場] for the reasons discussed above.' },
      {
        fn: '放 M31 或 M80 一句（升級句）',
        pattern:
          'M31：Any decision of this kind should be judged not only by what it offers today, but also by its long-term cost.\nM80：A good idea is useful only if the necessary money, time and support are actually available.',
      },
      { fn: '建議/呼籲', pattern: 'Schools and parents should therefore [具體行動] rather than [錯誤做法].' },
    ],
  },
  genres: [
    {
      name: 'Letter to the Editor（投書）',
      note: '不用寫地址。稱呼 → 說明來由 → 正文分段 → 署名。',
      opening: 'Dear Editor,\nI am writing in response to your article "[標題]", published on [日期].',
      closing: 'I hope your readers will consider this point.\nYours faithfully,\nChris Wong',
    },
    {
      name: 'Article（校報/雜誌文章）',
      note: '要有標題，可加 by-line。語氣較活潑，可用問句吸引讀者，可用小標題。',
      opening: 'Is Online Learning Really Better?\nby Chris Wong, 6A\nHave you ever wondered why…?',
      closing: 'The choice, in the end, belongs to us.',
    },
    {
      name: 'Proposal（建議書）',
      note: '最正式。必須有 To / From / Date / Subject 四行，正文用小標題分節：Introduction / Current Situation / Proposed Measures / Expected Benefits / Conclusion。',
      opening: 'To: Mr Chan, Principal\nFrom: Chris Wong, Chairperson, Student Union\nDate: 25 August 2026\n\nIntroduction\nThe purpose of this proposal is to suggest…',
      closing: 'Conclusion\nI hope the school will consider these suggestions favourably.',
    },
    {
      name: 'Report（報告）',
      note: '與 proposal 相似，但重點在已發生的事實。分節：Introduction / Findings / Conclusion / Recommendations。語氣中立，少用 I think。',
      opening: 'To / From / Date / Subject 四行\n\nIntroduction\nThis report presents the findings of a survey conducted in June 2026.',
      closing: 'Recommendations\nIt is recommended that the school should…',
    },
    {
      name: 'Speech（演講辭）',
      note: '必須有稱呼聽眾與致謝結尾。用 we/us/you，可用問句與 short sentence 製造節奏。',
      opening: 'Good morning, Principal, teachers and fellow students.\nMy name is Chris Wong, and today I would like to talk about…',
      closing: 'Let us start with one small step today.\nThank you for listening.',
    },
    {
      name: 'Blog Entry（網誌）',
      note: '最不正式。要有標題與日期，可用第一人稱、短句、個人感受，結尾常留問題邀請回應。',
      opening: 'My First Week as a Volunteer\n25 August 2026\nI never expected that one afternoon could change how I see my own city.',
      closing: 'What do you think? Leave a comment below — I would love to hear your story.',
    },
  ],
  signOffRule:
    '署名規則（每年都有人丟分）：Dear Editor / Dear Sir or Madam → Yours faithfully；Dear Mr Chan / Dear Miss Lee（有名有姓）→ Yours sincerely。Speech、article、blog 不用署 Yours…。',
  assemblyExample: {
    title: 'B4 全文組裝範例（五段式，40 分鐘可完成）',
    paragraphs: [
      'Para 1　開頭段（B1 四句公式）',
      'Para 2　Master ①（正面最強的一個）＋ 首句改寫 ＋ 扣題句',
      'Para 3　Master ②（另一角度的正面）＋ 首句改寫 ＋ 扣題句',
      'Para 4　Master ③（反面/讓步）＋ 用 However / A further concern is that… 開頭，段末拉回自己立場',
      'Para 5　結尾段（B2 三句公式，第 2 句放 M31 或 M80）',
    ],
  },
};

export const appendixC = {
  title: '附錄 C　句式輪換表 ＋ 連接詞庫',
  intro:
    '同一段幾乎全用 can help / may create / can become，文法沒有錯，但句式毫無變化，Language 分很難升上 Level 4。以下八個句型全部只用 Level 3 詞彙，一篇文章用其中三至四個就夠。',
  sentencePatterns: [
    { pattern: 'Once + 主語 + 動詞, …', example: 'Once people understand why a rule exists, they are far more likely to follow it.' },
    { pattern: 'The more …, the harder/more … it becomes', example: 'The more time students spend switching between apps, the harder it becomes to read anything long.' },
    { pattern: 'Rather than V-ing, … should …', example: 'Rather than banning phones completely, schools should teach students when to put them away.' },
    { pattern: 'This is why …', example: 'This is why prevention usually costs less than repair.' },
    { pattern: 'What matters is …（注意這裡的 what）', example: 'What matters is not the number of friends someone has, but whether any of them can be trusted.' },
    { pattern: 'not only … but also …', example: 'Green spaces are not only pleasant but also necessary for health in a crowded city.' },
    { pattern: 'While + 讓步, 主句', example: 'While online lessons save travelling time, they cannot replace face-to-face discussion.' },
    { pattern: 'A, which + 補充', example: 'Visitors bring income to small shops, which rarely benefit from large tourism projects.' },
  ],
  whatGrammarNote: {
    title: '文法重點複習——關係代名詞 what（＝ the thing that /「…的東西/事情」）',
    examples: [
      'people need to apply what they know（他們所知道的東西）',
      "choose careers according to what looks attractive from the outside（表面上吸引的東西）",
      'consider what evidence supports it（有什麼證據支持）',
      'success depends on what a person can afford（一個人負擔得起的東西）',
      'detailed feedback shows what needs to change（需要改變的地方）',
    ],
    commonError: '常犯錯誤：不可寫 the thing what I want；正確是 what I want 或 the thing that I want。what 本身已經包含了「the thing」，不能再加。',
    highScorePatterns: ['What matters is…', 'What people often forget is that…', 'This is exactly what happens when…'],
  },
  connectives: {
    title: '連接詞庫（不要每段都 Firstly / Secondly）',
    groups: [
      { label: '開首替換', items: ['To begin with…', 'One major benefit is that…', 'The first point worth noting is that…', 'Another important aspect is…'] },
      { label: '中段替換', items: ['Another advantage is that…', 'At the same time…', 'More importantly…', 'Equally significant is…'] },
      { label: '轉折替換', items: ['However…', 'On the other hand…', 'A further concern is that…', 'This benefit, however, has limits.'] },
      { label: '舉例', items: ['For example…', 'For instance…', 'Take public transport as an example.'] },
      { label: '結果', items: ['As a result…', 'This means that…', 'Consequently…'] },
      { label: '結尾替換', items: ['Finally…', 'In the long run…', 'Ultimately…', 'To sum up…'] },
    ],
  },
};

export const appendixD = {
  title: '附錄 D　考場拼題法、正反配對、Speaking 壓縮',
  threeLayerMethod: {
    title: 'D1 三層背誦法（避免考場卡住忘詞）',
    text: '背每個 Master 時，按此次序過一遍：① 中文邏輯鏈（幾個編號概括）→ ② 英文 Skeleton（幾個關鍵詞組）→ ③ 完整 Body。考場忘記整句時，回到第②層用關鍵詞即場造句。因為記住的是邏輯而不是死句，所以永遠能重新組出一句合理的英文。',
  },
  matchFormula: {
    title: 'D2 拼題公式：拿到陌生題目怎麼選 Master',
    steps: [
      { step: '第一步', text: '判斷題目問的是「對我（個人）」「對人際」「對社會」還是「對環境/政策」，再查主題總索引的 A-J 速查表。' },
      { step: '第二步', text: '每類挑 2-3 個 Master，想清楚哪個正面、哪個反面（如果題目要 discuss 兩面）。' },
      { step: '第三步', text: '每段用附錄 A 的公式改首句、加扣題句。' },
      { step: '第四步', text: '結論段固定用 M31（短期 vs 長期）或 M80（可行性）收尾，幾乎萬能。' },
    ],
  },
  oppositePairs: {
    title: 'D3 正反配對（discuss 類題目，直接背成一對）',
    pairs: [
      'M12 效率 ↔ M24 分心 / M19 過量',
      'M13 可及性 ↔ M14 成本與數碼鴻溝',
      'M08 友誼 ↔ M64/M65 質素 vs 數量、孤獨',
      'M45/M46 旅遊好處 ↔ M47/M48 過度旅遊、商業化',
      'M55 政府＋個人 ↔ M32 機會成本（有用，但不是萬能藥）',
      'M69 選擇多元 ↔ M70 選擇過多',
      'M26 資訊自由 ↔ M28 錯誤資訊 / M84 演算法窄化',
      'M42 保育傳統 ↔ M48 商業化 / M46 旅遊帶來資源',
      'M67 接觸帶來創意 ↔ M68 怕犯錯扼殺創意',
    ],
  },
  speakingCompression: {
    title: 'D4 Speaking 怎麼壓縮使用',
    text: 'Writing 的完整段落，口語只需保留「主幹三句」：point ＋ why ＋ example。例如 M64 的口語版：',
    example:
      '"I think having many friends doesn\'t necessarily mean strong support. Someone might know a lot of people but still have no one to talk to about real problems. So the quality of friendships matters more than the number."',
    note: '一句起，不必整段搬。Group interaction 時，用 M11（衝突→討論）的邏輯回應別人：先承認對方講法，再補一個新角度。',
  },
};

export const priorityTiers = {
  tier1: { label: '第一批（必背 12 個，覆蓋率最高）', ids: ['M31', 'M80', 'M01', 'M08', 'M12', 'M14', 'M19', 'M27', 'M53', 'M55', 'M42', 'M64'] },
  tier2: { label: '第二批（補足常見題型）', ids: ['M03', 'M04', 'M06', 'M13', 'M16', 'M23', 'M25', 'M28', 'M37', 'M45', 'M47', 'M59', 'M60', 'M85'] },
  tier3: { label: '第三批：其餘各段，按最弱的題型優先。' },
  note: '無論如何——附錄 A 與附錄 B 要在第一批之前先背熟，因為它們影響每一篇文章的分數，而 Master 只影響有用到的那幾段。',
};
