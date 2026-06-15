// ========================================
//  levels.js — 关卡数据（ES Module）
//  修改关卡内容只改这个文件
// ========================================

export const LEVELS = [
  {
    id: '1-1',
    name: '关卡 1-1',
    title: '第一个有机分子',
    desc: '用CO₂和H₂合成甲酸——地球上的第一次碳固定',
    unlocked: true,
    stars: 0,
    reagents: [
      { id: 'co2', name: '二氧化碳', formula: 'CO₂', color: '#8d99ae', emoji: '⚫' },
      { id: 'h2', name: '氢气', formula: 'H₂', color: '#48bfe3', emoji: '🔵' },
      { id: 'h2o', name: '水', formula: 'H₂O', color: '#5e60ce', emoji: '💧' },
      { id: 'fes', name: '硫化亚铁', formula: 'FeS', color: '#6c757d', emoji: '🪨' },
    ],
    slots: 2,
    recipes: [
      { inputs: ['co2', 'h2'], product: { id: 'hcooh', name: '甲酸', formula: 'HCOOH', color: '#06d6a0', emoji: '🟢' }, isFinal: true },
    ],
    objectives: [
      '将CO₂拖入合成台',
      '将H₂拖入合成台',
      '点击"合成"完成碳固定反应',
    ],
    knowledge: '碳固定是将无机碳（CO₂）转化为有机碳的过程。在热泉口的高温高压环境下，FeS等矿物表面可以催化这一反应。',
    hintLevels: [
      '想一想：从CO₂到有机物，需要什么条件？',
      'CO₂需要被还原——你需要一个还原剂',
      '试试把CO₂和H₂放在一起',
    ],
    narrative: [
      { speaker: '旁白', text: '38亿年前。深海，热泉口。黑暗中只有矿物闪烁的微光。' },
      { speaker: '旁白', text: '你周围充满了CO₂和H₂——这些是热泉口喷出的丰富原料。' },
      { speaker: '旁白', text: '在这极端环境中，一个奇迹即将发生……' },
    ],
    knowledgeCard: {
      icon: '🟢', iconBg: '#06d6a0',
      title: '甲酸 HCOOH',
      subtitle: 'THE FIRST ORGANIC MOLECULE',
      body: '你刚刚完成了<strong>碳固定</strong>——将无机碳(CO₂)转变为有机碳的关键一步。<br><br>在热泉口的<span class="key">FeS矿物表面</span>，CO₂被H₂还原为甲酸(HCOOH)。这是地球上最古老的有机合成反应之一。<br><br>今天，类似的反应仍存在于<strong>产甲烷菌</strong>和<strong>产乙酸菌</strong>中——它们是活化石，保留着38亿年前的化学记忆。',
      note: '甲酸虽然是最简单的有机酸，但它的出现标志着化学世界向生物世界的跨越——无机物第一次变成了有机物。',
      medLink: { title: '🏥 医学关联', text: '人体内的碳固定由多种酶催化。叶酸(维生素B9)参与的一碳单位代谢，本质上就是碳固定反应的现代版本。理解碳固定的起源，有助于理解叶酸为什么对DNA合成至关重要。' }
    }
  },
  {
    id: '1-2',
    name: '关卡 1-2',
    title: '第一个碳碳键',
    desc: '合成乙酸——Wood-Ljungdahl通路，从两个CO₂构建第一个C-C键',
    unlocked: false,
    stars: 0,
    reagents: [
      { id: 'co2', name: '二氧化碳', formula: 'CO₂', color: '#8d99ae', emoji: '⚫' },
      { id: 'h2', name: '氢气', formula: 'H₂', color: '#48bfe3', emoji: '🔵' },
      { id: 'nifes', name: 'NiFeS簇', formula: 'NiFeS', color: '#6c757d', emoji: '🪨' },
    ],
    slots: 3,
    recipes: [
      // 步骤1: 第一个CO₂还原 → 甲酸（甲酰基中间体）
      { inputs: ['co2', 'h2'], product: { id: 'hcooh', name: '甲酸', formula: 'HCOOH', color: '#06d6a0', emoji: '🟢' }, isFinal: false },
      // 步骤2: 甲酸 + 第二个CO₂ + H₂ → 乙酸（第一个C-C键！）
      { inputs: ['hcooh', 'co2', 'h2'], product: { id: 'acetic', name: '乙酸', formula: 'CH₃COOH', color: '#06d6a0', emoji: '🟢' }, isFinal: true },
    ],
    objectives: [
      '用CO₂ + H₂合成甲酸（一碳中间体）',
      '甲酸 + CO₂ + H₂ → 乙酸（第一个碳碳键！）',
      '理解：2个一碳分子可以结合成二碳分子',
    ],
    knowledge: 'Wood-Ljungdahl通路是最古老的碳固定通路。第一个CO₂先被还原为甲酸（甲酰基中间体），然后在NiFeS簇催化下，甲酰基与第二个CO₂缩合，形成碳碳键——产出乙酸。这是从无机世界到有机世界的第二个关键跨越。',
    hintLevels: [
      '你已经会合成甲酸了（关卡1-1）。试试再合成一次',
      '甲酸只是一个中间体——它还需要和另一个CO₂结合',
      '把甲酸 + CO₂ + H₂放在一起，看看能否形成C-C键',
    ],
    narrative: [
      { speaker: '旁白', text: '你已经能合成一碳有机物了。但生命需要更长的碳链。' },
      { speaker: '旁白', text: '在热泉口的NiFeS矿物微孔中，两个一碳分子有了相遇的机会……' },
      { speaker: '旁白', text: '一个CO₂先变成甲酸——然后甲酸与另一个CO₂结合。' },
      { speaker: '旁白', text: '碳碳键诞生了！这是化学进化中最重要的时刻之一。' },
    ],
    knowledgeCard: {
      icon: '🟢', iconBg: '#06d6a0',
      title: '乙酸 CH₃COOH',
      subtitle: 'THE FIRST C-C BOND',
      body: '你合成了<strong>乙酸</strong>——生命世界的第一个碳碳键！<br><br><span class="key">Wood-Ljungdahl通路</span>：<br>步骤1: CO₂ + H₂ → <span class="key">HCOOH</span>（甲酸，一碳中间体）<br>步骤2: HCOOH + CO₂ + H₂ → <span class="key">CH₃COOH</span>（乙酸，二碳产物）<br><br>1C + 1C = 2C。碳碳键——有机化学的基石——就这样在矿物表面诞生了。<br><br>在现代细胞中，这条通路使用<strong>辅酶A(CoA)</strong>来携带乙酰基团，产物是<span class="key">乙酰辅酶A(Acetyl-CoA)</span>——代谢网络的中央枢纽。CoA是后来进化出的"载具"，但在生命起源时，矿物表面直接催化就够了。',
      note: '乙酰CoA处于代谢的中心，不是偶然的——它的前体（乙酸）是最早被"发明"的二碳分子。CoA只是后来进化出的搬运工，让这个古老的反应更高效。',
      medLink: { title: '🏥 医学关联', text: '乙酰CoA是脂肪酸合成、胆固醇合成、酮体生成的共同前体。理解它为什么处于中心，就理解了为什么糖尿病会影响全身几乎所有代谢通路——因为所有代谢通路都围绕着这个最古老的二碳骨架运转。' }
    }
  },
  {
    id: '1-3',
    name: '关卡 1-3',
    title: '糖的起源',
    desc: '从CO₂出发，先合成甲醛，再逐步聚合成糖——核糖',
    unlocked: false,
    stars: 0,
    reagents: [
      { id: 'co2', name: '二氧化碳', formula: 'CO₂', color: '#8d99ae', emoji: '⚫' },
      { id: 'h2', name: '氢气', formula: 'H₂', color: '#48bfe3', emoji: '🔵' },
      { id: 'h2o', name: '水', formula: 'H₂O', color: '#5e60ce', emoji: '💧' },
      { id: 'fes', name: '硫化亚铁', formula: 'FeS', color: '#6c757d', emoji: '🪨' },
    ],
    slots: 3,
    recipes: [
      { inputs: ['co2', 'h2'], product: { id: 'hcho', name: '甲醛', formula: 'HCHO', color: '#e76f51', emoji: '🔴' }, isFinal: false },
      // Formose反应第一步：3个甲醛 → 甘油醛（C₃糖）
      { inputs: ['hcho', 'hcho', 'hcho'], product: { id: 'glyceraldehyde', name: '甘油醛', formula: 'C₃H₆O₃', color: '#e9c46a', emoji: '🟡' }, isFinal: false },
      // Formose反应第二步：甘油醛 + 2甲醛 → 核糖（C₅糖）
      { inputs: ['glyceraldehyde', 'hcho', 'hcho'], product: { id: 'ribose', name: '核糖', formula: 'C₅H₁₀O₅', color: '#f4a261', emoji: '🟠' }, isFinal: true },
    ],
    objectives: [
      '用CO₂ + H₂合成甲醛（产物进入库存）',
      '收集3个甲醛，聚合为甘油醛（C₃糖）',
      '甘油醛 + 2个甲醛 → 核糖（C₅糖）',
    ],
    knowledge: 'Formose反应（甲醛聚糖反应）是逐步自催化过程：甲醛先聚合成三碳糖（甘油醛），再继续加成甲醛链增长为五碳糖（核糖）。3 HCHO → 甘油醛(C₃)，甘油醛 + 2 HCHO → 核糖(C₅)。这解释了为什么核糖成为RNA的骨架——它是Formose反应最容易产生的戊糖之一。',
    hintLevels: [
      '糖不是直接从CO₂来的——需要先合成一个中间体',
      '试试CO₂ + H₂，看看能得到什么中间产物',
      '先合成3个甲醛聚合为甘油醛，再加2个甲醛增长为核糖',
    ],
    narrative: [
      { speaker: '旁白', text: '你已经有了有机酸。但生命还需要另一种分子——糖。' },
      { speaker: '旁白', text: '糖不是一步合成的——简单的甲醛分子会逐步聚合，碳链越来越长。' },
      { speaker: '旁白', text: '3个甲醛先聚成三碳糖，再接上2个甲醛，就变成了五碳糖——核糖。' },
    ],
    knowledgeCard: {
      icon: '🟠', iconBg: '#f4a261',
      title: '核糖 Ribose',
      subtitle: 'THE BACKBONE OF INFORMATION',
      body: '你通过<strong>三步反应</strong>合成了核糖——每一步都更接近真实的化学进化。<br><br>第一步：CO₂ + H₂ → <span class="key">甲醛(HCHO)</span>——碳还原的最简形式<br>第二步：3 HCHO → <span class="key">甘油醛(C₃H₆O₃)</span>——Formose反应第一产物<br>第三步：甘油醛 + 2 HCHO → <span class="key">核糖(C₅H₁₀O₅)</span>——碳链增长<br><br><strong>3 + 2 = 5个碳</strong>，恰好构成戊糖。这不是巧合——Formose反应的自催化机制让碳链以1碳为单位逐步增长。',
      note: '核糖不是被"设计"成RNA骨架的——它是Formose反应最容易产生的戊糖。而甲醛也不是"给定"的——它必须从更简单的CO₂合成。生命的每一层复杂度，都建立在更简单的基础上。',
      medLink: { title: '🏥 医学关联', text: '核糖是ATP(腺嘌呤核糖三磷酸)的骨架。理解核糖的起源，就理解了为什么ATP的结构是"腺嘌呤+核糖+3个磷酸"——每部分都有38亿年的进化理由。' }
    }
  },

  // ========================================
  //  纪元二：自催化之火 — 糖酵解
  // ========================================

  {
    id: '2-1a',
    name: '关卡 2-1a',
    title: '糖酵解·投入期',
    desc: '组装ATP，合成葡萄糖，投资ATP拆解它——打开能量宝库',
    unlocked: false,
    stars: 0,
    reagents: [
      { id: 'adenine', name: '腺嘌呤', formula: 'C₅H₅N₅', color: '#9b5de5', emoji: '🟣' },
      { id: 'ribose', name: '核糖', formula: 'C₅H₁₀O₅', color: '#f4a261', emoji: '🟠' },
      { id: 'pi', name: '无机磷酸', formula: 'Pi', color: '#8d99ae', emoji: '💎' },
      { id: 'glyceraldehyde', name: '甘油醛', formula: 'C₃H₆O₃', color: '#e9c46a', emoji: '🟡' },
    ],
    slots: 3,
    recipes: [
      // 前置：组装ATP — 腺嘌呤+核糖+磷酸（简化，实际需多步）
      {
        inputs: ['adenine', 'ribose', 'pi'],
        product: { id: 'atp', name: 'ATP', formula: 'ATP', color: '#ff6b35', emoji: '💰' },
        isFinal: false, isRateLimiting: false, enzymeName: '核苷酸激酶',
      },
      // 前置：2个甘油醛醛醇缩合 → 葡萄糖（C₃+C₃=C₆）
      {
        inputs: ['glyceraldehyde', 'glyceraldehyde'],
        product: { id: 'glucose', name: 'D-葡萄糖', formula: 'C₆H₁₂O₆', color: '#f4a261', emoji: '🍬' },
        isFinal: false, isRateLimiting: false, enzymeName: '醛醇缩合',
      },
      // 步骤1: 己糖激酶 — 葡萄糖磷酸化
      {
        inputs: ['atp', 'glucose'],
        product: { id: 'g6p', name: '6-磷酸葡萄糖', formula: 'G6P', color: '#e9c46a', emoji: '🟡' },
        isFinal: false, isRateLimiting: false, enzymeName: '己糖激酶',
      },
      // 步骤2: 磷酸葡萄糖异构酶
      {
        inputs: ['g6p'],
        product: { id: 'f6p', name: '6-磷酸果糖', formula: 'F6P', color: '#e76f51', emoji: '🟠' },
        isFinal: false, isRateLimiting: false, enzymeName: '磷酸葡萄糖异构酶',
      },
      // 步骤3: PFK-1 ★限速
      {
        inputs: ['atp', 'f6p'],
        product: { id: 'f16bp', name: '1,6-二磷酸果糖', formula: 'F1,6BP', color: '#d62828', emoji: '🔴' },
        isFinal: false, isRateLimiting: true, enzymeName: '磷酸果糖激酶-1 ★限速',
      },
      // 步骤4: 醛缩酶 — F1,6BP裂解为DHAP和GAP（投入期终点）
      {
        inputs: ['f16bp'],
        product: { id: 'dhap', name: '磷酸二羟丙酮', formula: 'DHAP', color: '#48bfe3', emoji: '🔵' },
        byproducts: [{ id: 'gap', name: '3-磷酸甘油醛', formula: 'GAP', color: '#06d6a0', emoji: '🟢' }],
        isFinal: true, isRateLimiting: false, enzymeName: '醛缩酶',
      },
    ],
    objectives: [
      '用腺嘌呤+核糖+Pi组装ATP',
      '用2个甘油醛合成葡萄糖（C₃+C₃=C₆）',
      '投资2个ATP拆解葡萄糖至DHAP+GAP',
    ],
    knowledge: 'ATP由三个部分组装而成：腺嘌呤（来自HCN聚合）+ 核糖（来自Formose反应）+ 磷酸（来自矿物）。ATP是细胞的能量货币——它的高能磷酸键储存着可以被释放的化学能。糖酵解的投入期消耗2个ATP来"激活"葡萄糖，为后续产能做准备。',
    hintLevels: [
      'ATP由三个部分组成：一个碱基、一个糖、一个磷酸',
      '腺嘌呤+核糖+磷酸→ATP。同时用2个甘油醛→葡萄糖',
      '完整路径：组装ATP → 合成葡萄糖 → ATP+葡萄糖→G6P→F6P→ATP+F6P→F1,6BP→裂解',
    ],
    narrative: [
      { speaker: '旁白', text: '你已经能合成糖和碱基了。现在，把它们组装成生命最重要的分子。' },
      { speaker: '旁白', text: '腺嘌呤+核糖+磷酸 = ATP——三磷酸腺苷，细胞的能量货币。' },
      { speaker: '旁白', text: 'ATP的高能磷酸键就像上紧的发条。花2个ATP打开葡萄糖，后面会赚回来。' },
    ],
    knowledgeCard: {
      icon: '💰', iconBg: '#ff6b35',
      title: 'ATP — 能量货币',
      subtitle: 'THE UNIVERSAL ENERGY CURRENCY',
      body: '你组装了<strong>ATP</strong>——生命世界的通用能量货币！<br><br>ATP = <span class="key">腺嘌呤</span> + <span class="key">核糖</span> + <span class="key">3×磷酸</span><br><br>腺嘌呤来自<strong>HCN在热泉中的聚合</strong>（嘌呤环的5个原子恰好来自5个HCN分子）<br>核糖来自<strong>Formose反应</strong>（你在关卡1-3中已经合成过）<br>磷酸来自<strong>矿物溶解</strong><br><br>ATP的高能磷酸键储存着化学能。当磷酸键断裂时，释放的能量驱动几乎所有生命反应。理解ATP的结构，就理解了为什么维生素B2（核黄素）和维生素B3（烟酸）对能量代谢至关重要——它们都是ATP相关循环的辅酶。',
      note: 'ATP不是凭空出现的——它的每个原子都有38亿年的来源。腺嘌呤来自最简单的含氮分子HCN，核糖来自甲醛聚合，磷酸来自岩石。生命没有发明新的化学——它只是找到了组合现有化学的最佳方式。',
      medLink: { title: '🏥 医学关联', text: 'ATP耗竭是细胞死亡的最终共同通路。缺血再灌注损伤、氰化物中毒、一氧化碳中毒——它们都通过阻断ATP产生导致细胞死亡。理解ATP的来源和循环，就理解了为什么"能量衰竭"是这么多疾病的终点。' }
    }
  },

  {
    id: '2-1b',
    name: '关卡 2-1b',
    title: '糖酵解·收益期',
    desc: '组装辅因子，从3碳片段中收割ATP——投资2个，收获4个',
    unlocked: false,
    stars: 0,
    reagents: [
      { id: 'adenine', name: '腺嘌呤', formula: 'C₅H₅N₅', color: '#9b5de5', emoji: '🟣' },
      { id: 'ribose', name: '核糖', formula: 'C₅H₁₀O₅', color: '#f4a261', emoji: '🟠' },
      { id: 'nicotinamide', name: '烟酰胺', formula: 'C₆H₆N₂O', color: '#4ecdc4', emoji: '💊' },
      { id: 'pi', name: '无机磷酸', formula: 'Pi', color: '#8d99ae', emoji: '💎' },
      { id: 'glyceraldehyde', name: '甘油醛', formula: 'C₃H₆O₃', color: '#e9c46a', emoji: '🟡' },
    ],
    slots: 3,
    recipes: [
      // ── 辅因子组装 ──
      // ATP = 腺嘌呤 + 核糖 + 磷酸
      { inputs: ['adenine', 'ribose', 'pi'],
        product: { id: 'atp', name: 'ATP', formula: 'ATP', color: '#ff6b35', emoji: '💰' },
        isFinal: false, isRateLimiting: false, enzymeName: '核苷酸激酶' },
      // ATP → ADP + Pi（消耗ATP获得ADP）
      { inputs: ['atp'],
        product: { id: 'adp', name: 'ADP', formula: 'ADP', color: '#e8a838', emoji: '💵' },
        isFinal: false, isRateLimiting: false, enzymeName: 'ATP水解' },
      // NAD⁺ = 烟酰胺 + 核糖 + ADP（简化）
      { inputs: ['nicotinamide', 'ribose', 'adp'],
        product: { id: 'nad', name: 'NAD⁺', formula: 'NAD⁺', color: '#4ecdc4', emoji: '🔋' },
        isFinal: false, isRateLimiting: false, enzymeName: 'NAD⁺合成酶' },

      // ── 葡萄糖合成 + 裂解（从2-1a衔接） ──
      { inputs: ['glyceraldehyde', 'glyceraldehyde'],
        product: { id: 'glucose', name: '葡萄糖', formula: 'C₆H₁₂O₆', color: '#f4a261', emoji: '🍬' },
        isFinal: false, isRateLimiting: false, enzymeName: '醛醇缩合' },
      { inputs: ['atp', 'glucose'],
        product: { id: 'g6p', name: 'G6P', formula: 'G6P', color: '#e9c46a', emoji: '🟡' },
        isFinal: false, isRateLimiting: false, enzymeName: '己糖激酶' },
      { inputs: ['g6p'],
        product: { id: 'f6p', name: 'F6P', formula: 'F6P', color: '#e76f51', emoji: '🟠' },
        isFinal: false, isRateLimiting: false, enzymeName: '磷酸葡萄糖异构酶' },
      { inputs: ['atp', 'f6p'],
        product: { id: 'f16bp', name: 'F1,6BP', formula: 'F1,6BP', color: '#d62828', emoji: '🔴' },
        isFinal: false, isRateLimiting: true, enzymeName: 'PFK-1 ★限速' },
      { inputs: ['f16bp'],
        product: { id: 'dhap', name: 'DHAP', formula: 'DHAP', color: '#48bfe3', emoji: '🔵' },
        byproducts: [{ id: 'gap', name: 'GAP', formula: 'GAP', color: '#06d6a0', emoji: '🟢' }],
        isFinal: false, isRateLimiting: false, enzymeName: '醛缩酶' },
      { inputs: ['dhap'],
        product: { id: 'gap', name: 'GAP', formula: 'GAP', color: '#06d6a0', emoji: '🟢' },
        isFinal: false, isRateLimiting: false, enzymeName: '磷酸丙糖异构酶' },

      // ── 收益期 (步骤6-10) ──
      { inputs: ['gap', 'nad', 'pi'],
        product: { id: 'bpg', name: '1,3BPG', formula: '1,3BPG', color: '#06d6a0', emoji: '💚' },
        byproducts: [{ id: 'nadh', name: 'NADH', formula: 'NADH', color: '#06d6a0', emoji: '⚡' }],
        isFinal: false, isRateLimiting: false, enzymeName: 'GAP脱氢酶' },
      { inputs: ['adp', 'bpg'],
        product: { id: 'pg3', name: '3PG', formula: '3PG', color: '#4ecdc4', emoji: '💎' },
        byproducts: [{ id: 'atp_produced', name: 'ATP(产出)', formula: 'ATP', color: '#ff6b35', emoji: '💰' }],
        isFinal: false, isRateLimiting: false, enzymeName: '磷酸甘油酸激酶' },
      { inputs: ['pg3'],
        product: { id: 'pg2', name: '2PG', formula: '2PG', color: '#5e60ce', emoji: '💜' },
        isFinal: false, isRateLimiting: false, enzymeName: '磷酸甘油酸变位酶' },
      { inputs: ['pg2'],
        product: { id: 'pep', name: 'PEP', formula: 'PEP', color: '#ff6b35', emoji: '🔥' },
        isFinal: false, isRateLimiting: false, enzymeName: '烯醇化酶' },
      { inputs: ['adp', 'pep'],
        product: { id: 'pyruvate', name: '丙酮酸', formula: 'C₃H₄O₃', color: '#e76f51', emoji: '🔥' },
        isFinal: true, isRateLimiting: true, enzymeName: '丙酮酸激酶 ★限速' },
    ],
    objectives: [
      '组装ATP和NAD⁺（辅因子准备）',
      '从甘油醛合成葡萄糖→裂解→收获期',
      '观察ATP产出：步骤7和10各产1个ATP',
    ],
    knowledge: '糖酵解收益期需要两个关键辅因子：ATP（由腺嘌呤+核糖+磷酸组装）和NAD⁺（由烟酰胺+核糖+ADP组装）。步骤6消耗NAD⁺产生NADH；步骤7和10通过底物水平磷酸化各产生1个ATP。每分子GAP产生2个ATP，2个GAP共4个ATP。减去投入期的2个ATP，净产2个ATP。',
    hintLevels: [
      '先组装辅因子：腺嘌呤+核糖+Pi→ATP，烟酰胺+核糖+ADP→NAD⁺',
      'ADP从哪来？ATP水解即可获得',
      '完整路径：组装辅因子→2×甘油醛→葡萄糖→投入期→裂解→TPI→收益期→丙酮酸',
    ],
    narrative: [
      { speaker: '旁白', text: '你已经见过糖酵解的投入期。但收益期需要更多辅因子。' },
      { speaker: '旁白', text: 'ATP你已经会组装了。NAD⁺——另一个关键辅因子——需要烟酰胺。' },
      { speaker: '旁白', text: '烟酰胺来自热泉中的含氮分子聚合。和核糖、ADP组合后，它成为NAD⁺——电子的搬运工。' },
      { speaker: '旁白', text: '注意步骤7和10——它们会产生ATP！这就是底物水平磷酸化。' },
    ],
    knowledgeCard: {
      icon: '🔋', iconBg: '#4ecdc4',
      title: 'NAD⁺ — 电子搬运工',
      subtitle: 'THE ELECTRON CARRIER',
      body: '你组装了<strong>NAD⁺</strong>——细胞内的电子搬运工！<br><br>NAD⁺ = <span class="key">烟酰胺</span> + <span class="key">核糖</span> + <span class="key">ADP</span><br><br>烟酰胺来自<strong>烟酸(维生素B3)</strong>——热泉中含氮分子的聚合产物<br>核糖来自<strong>Formose反应</strong><br>ADP来自<strong>ATP水解</strong><br><br>NAD⁺在步骤6接受电子变成<strong>NADH</strong>，然后在发酵中把电子交给丙酮酸，重新变成NAD⁺。这个循环是糖酵解持续运行的关键。',
      note: 'NAD⁺和ATP一样，不是凭空出现的。烟酰胺是维生素B3的活性形式——这也是为什么缺乏维生素B3会导致糙皮病( pellegra )，症状包括皮炎、腹泻和痴呆。没有NAD⁺，糖酵解、TCA循环和呼吸链全部停摆。',
      medLink: { title: '🏥 医学关联', text: '烟酸(维生素B3)缺乏导致糙皮病——3D症状：皮炎(Dermatitis)、腹泻(Diarrhea)、痴呆(Dementia)。理解NAD⁺的来源，就理解了为什么B3缺乏会导致全身性症状——NAD⁺参与了200多种氧化还原反应。' }
    }
  },

  {
    id: '2-1c',
    name: '关卡 2-1c',
    title: '糖酵解·自催化之火',
    desc: '组装所有辅因子，完整产线运行——NAD⁺会耗尽，你需要发酵再生',
    unlocked: false,
    stars: 0,
    reagents: [
      { id: 'adenine', name: '腺嘌呤', formula: 'C₅H₅N₅', color: '#9b5de5', emoji: '🟣' },
      { id: 'ribose', name: '核糖', formula: 'C₅H₁₀O₅', color: '#f4a261', emoji: '🟠' },
      { id: 'nicotinamide', name: '烟酰胺', formula: 'C₆H₆N₂O', color: '#4ecdc4', emoji: '💊' },
      { id: 'pi', name: '无机磷酸', formula: 'Pi', color: '#8d99ae', emoji: '💎' },
      { id: 'glyceraldehyde', name: '甘油醛', formula: 'C₃H₆O₃', color: '#e9c46a', emoji: '🟡' },
    ],
    slots: 3,
    recipes: [
      // ── 辅因子组装 ──
      { inputs: ['adenine', 'ribose', 'pi'],
        product: { id: 'atp', name: 'ATP', formula: 'ATP', color: '#ff6b35', emoji: '💰' },
        isFinal: false, isRateLimiting: false, enzymeName: '核苷酸激酶' },
      { inputs: ['atp'],
        product: { id: 'adp', name: 'ADP', formula: 'ADP', color: '#e8a838', emoji: '💵' },
        isFinal: false, isRateLimiting: false, enzymeName: 'ATP水解' },
      { inputs: ['nicotinamide', 'ribose', 'adp'],
        product: { id: 'nad', name: 'NAD⁺(有限)', formula: 'NAD⁺', color: '#4ecdc4', emoji: '🔋' },
        isFinal: false, isRateLimiting: false, enzymeName: 'NAD⁺合成酶' },

      // ── 葡萄糖合成 ──
      { inputs: ['glyceraldehyde', 'glyceraldehyde'],
        product: { id: 'glucose', name: '葡萄糖', formula: 'C₆H₁₂O₆', color: '#f4a261', emoji: '🍬' },
        isFinal: false, isRateLimiting: false, enzymeName: '醛醇缩合' },

      // ── 投入期 (步骤1-4) ──
      { inputs: ['atp', 'glucose'], product: { id: 'g6p', name: 'G6P', formula: 'G6P', color: '#e9c46a', emoji: '🟡' }, isFinal: false, isRateLimiting: false, enzymeName: '己糖激酶' },
      { inputs: ['g6p'], product: { id: 'f6p', name: 'F6P', formula: 'F6P', color: '#e76f51', emoji: '🟠' }, isFinal: false, isRateLimiting: false, enzymeName: '磷酸葡萄糖异构酶' },
      { inputs: ['atp', 'f6p'], product: { id: 'f16bp', name: 'F1,6BP', formula: 'F1,6BP', color: '#d62828', emoji: '🔴' }, isFinal: false, isRateLimiting: true, enzymeName: 'PFK-1 ★限速' },
      { inputs: ['f16bp'], product: { id: 'dhap', name: 'DHAP', formula: 'DHAP', color: '#48bfe3', emoji: '🔵' },
        byproducts: [{ id: 'gap', name: 'GAP', formula: 'GAP', color: '#06d6a0', emoji: '🟢' }],
        isFinal: false, isRateLimiting: false, enzymeName: '醛缩酶' },

      // ── C3双通道 ──
      { inputs: ['dhap'], product: { id: 'gap', name: 'GAP', formula: 'GAP', color: '#06d6a0', emoji: '🟢' }, isFinal: false, isRateLimiting: false, enzymeName: '磷酸丙糖异构酶' },

      // ── 收益期 (步骤6-10) ──
      { inputs: ['gap', 'nad', 'pi'], product: { id: 'bpg', name: '1,3BPG', formula: '1,3BPG', color: '#06d6a0', emoji: '💚' },
        byproducts: [{ id: 'nadh', name: 'NADH', formula: 'NADH', color: '#06d6a0', emoji: '⚡' }],
        isFinal: false, isRateLimiting: false, enzymeName: 'GAP脱氢酶' },
      { inputs: ['adp', 'bpg'], product: { id: 'pg3', name: '3PG', formula: '3PG', color: '#4ecdc4', emoji: '💎' },
        byproducts: [{ id: 'atp_produced', name: 'ATP(产出)', formula: 'ATP', color: '#ff6b35', emoji: '💰' }],
        isFinal: false, isRateLimiting: false, enzymeName: '磷酸甘油酸激酶' },
      { inputs: ['pg3'], product: { id: 'pg2', name: '2PG', formula: '2PG', color: '#5e60ce', emoji: '💜' }, isFinal: false, isRateLimiting: false, enzymeName: '磷酸甘油酸变位酶' },
      { inputs: ['pg2'], product: { id: 'pep', name: 'PEP', formula: 'PEP', color: '#ff6b35', emoji: '🔥' }, isFinal: false, isRateLimiting: false, enzymeName: '烯醇化酶' },
      { inputs: ['adp', 'pep'], product: { id: 'pyruvate', name: '丙酮酸', formula: 'C₃H₄O₃', color: '#e76f51', emoji: '🔥' }, isFinal: false, isRateLimiting: true, enzymeName: 'PK ★限速' },

      // ── 发酵：NADH + 丙酮酸 → 乳酸 + NAD⁺再生 ──
      { inputs: ['nadh', 'pyruvate'],
        product: { id: 'lactate', name: '乳酸', formula: 'C₃H₆O₃', color: '#06d6a0', emoji: '🥛' },
        byproducts: [{ id: 'nad_back', name: 'NAD⁺(再生)', formula: 'NAD⁺', color: '#4ecdc4', emoji: '🔋' }],
        isFinal: true, isRateLimiting: false, enzymeName: '乳酸脱氢酶' },
    ],
    objectives: [
      '组装ATP和NAD⁺，合成葡萄糖',
      '完整运行糖酵解：葡萄糖 → 丙酮酸',
      'NAD⁺耗尽时，用发酵再生NAD⁺',
    ],
    knowledge: '糖酵解是自催化的——它产出的ATP可以驱动自身的投入步骤。但NAD⁺是有限的辅因子（由烟酰胺+核糖+ADP组装），步骤6消耗NAD⁺产生NADH。无氧条件下，NADH必须通过发酵再氧化为NAD⁺，否则糖酵解无法继续。这就是为什么剧烈运动时肌肉会产生乳酸。',
    hintLevels: [
      '先组装辅因子：腺嘌呤+核糖+Pi→ATP，ATP水解→ADP，烟酰胺+核糖+ADP→NAD⁺',
      '然后合成葡萄糖，运行完整糖酵解。NAD⁺耗尽时，把NADH和丙酮酸放在一起',
      '完整路径：组装辅因子→葡萄糖→投入期→裂解→TPI→收益期→NADH+丙酮酸→乳酸',
    ],
    narrative: [
      { speaker: '旁白', text: '你已经熟悉糖酵解的每一步了。现在，从辅因子组装开始，让整条产线跑起来。' },
      { speaker: '旁白', text: '但有个问题——你只能组装出有限的NAD⁺。步骤6每运行一次，就少一个NAD⁺。' },
      { speaker: '旁白', text: '当NAD⁺耗尽……产线会停。你需要找到再生的方法。' },
      { speaker: '旁白', text: 'NADH和丙酮酸可以反应——发酵，无氧条件下再生NAD⁺的唯一途径。' },
    ],
    knowledgeCard: {
      icon: '🔥', iconBg: '#ff6b35',
      title: '糖酵解：自催化之火',
      subtitle: 'THE AUTOCATALYTIC FLAME',
      body: '糖酵解是<strong>自催化</strong>的——它产出的ATP恰好可以驱动自身的投入步骤！<br><br><span class="key">投入期</span>：步骤1和3各消耗1 ATP（共2 ATP）<br><span class="key">收益期</span>：步骤7和10各产出1 ATP/每GAP（共4 ATP）<br>→ <strong>净产2 ATP</strong><br><br>但NAD⁺再生是瓶颈：<br>步骤6: GAP + <span class="key">NAD⁺</span> → 1,3BPG + <strong>NADH</strong><br>发酵: <strong>NADH</strong> + 丙酮酸 → <span class="key">NAD⁺</span> + 乳酸<br><br>无氧条件下，<strong>发酵是NAD⁺再生的唯一途径</strong>。没有发酵，糖酵解只能运行一轮就停。',
      note: '糖酵解之所以是"自催化之火"，是因为它产出的ATP可以点燃下一轮反应——就像火焰释放的热量点燃新的燃料。但NAD+/NADH的循环是产线的命脉——断了它，火就灭了。',
      medLink: { title: '🏥 医学关联', text: '剧烈运动时肌肉缺氧，糖酵解产生的NADH只能通过乳酸发酵再生NAD⁺——这就是乳酸堆积和肌肉酸痛的原因。理解这个循环，就理解了为什么Wernicke脑病（维生素B1缺乏）会导致乳酸酸中毒——维生素B1是丙酮酸脱氢酶的辅酶，缺乏时丙酮酸无法进入TCA循环，只能走乳酸发酵。' }
    }
  },
];
