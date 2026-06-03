var ECOSTATS_GLOSSARY = {
  "ch1-gdp": [
    {
      id: "gdp",
      term: "GDP(国内生产总值)",
      english: "Gross Domestic Product",
      definition: "一个国家（或地区）所有常住单位在一定时期内生产活动的最终成果。",
      related: ["nominal-gdp", "real-gdp", "gdp-growth"]
    },
    {
      id: "nominal-gdp",
      term: "名义GDP",
      english: "Nominal GDP",
      definition: "以当年市场价格计算的GDP。",
      formula: "名义GDP = \\Sigma(P_t \\times Q_t)",
      related: ["real-gdp", "gdp-deflator"]
    },
    {
      id: "real-gdp",
      term: "实际GDP",
      english: "Real GDP",
      definition: "以基年价格计算的GDP，剔除了价格变动的影响。",
      formula: "实际GDP = \\Sigma(P_0 \\times Q_t)",
      related: ["nominal-gdp", "gdp-deflator", "base-period"]
    },
    {
      id: "gdp-growth",
      term: "GDP增长率",
      english: "GDP Growth Rate",
      definition: "反映经济总量增长速度快慢的指标，通常指实际GDP的年度变化率。",
      formula: "增长率 = \\frac{GDP_t - GDP_{t-1}}{GDP_{t-1}} \\times 100\\%",
      related: ["real-gdp", "cagr"]
    },
    {
      id: "gdp-deflator",
      term: "GDP平减指数",
      english: "GDP Deflator",
      definition: "反映GDP中所有货物和服务价格总水平变动的综合价格指数。",
      formula: "平减指数 = \\frac{名义GDP}{实际GDP} \\times 100",
      related: ["nominal-gdp", "real-gdp", "cpi"]
    },
    {
      id: "gnp",
      term: "GNP(国民生产总值)",
      english: "Gross National Product",
      definition: "一国常住单位在境内外从事生产活动所创造的最终成果。",
      formula: "GNP = GDP + 来自国外的要素收入 - 支付给国外的要素收入",
      related: ["gdp", "ndp"]
    },
    {
      id: "ndp",
      term: "NDP(国内生产净值)",
      english: "Net Domestic Product",
      definition: "从GDP中扣除固定资产折旧后的价值。",
      formula: "NDP = GDP - 折旧",
      related: ["gdp", "gnp"]
    },
    {
      id: "three-gorges",
      term: "GDP三种核算方法",
      english: "Three Approaches to GDP",
      definition: "生产法、收入法、支出法。三种方法从不同角度核算GDP，理论上结果应一致。",
      related: ["expenditure-approach", "income-approach", "production-approach"]
    },
    {
      id: "expenditure-approach",
      term: "支出法GDP",
      english: "Expenditure Approach",
      definition: "从最终使用角度核算GDP。",
      formula: "GDP = C + I + G + (X - M)",
      related: ["income-approach", "production-approach", "three-gorges"]
    },
    {
      id: "income-approach",
      term: "收入法GDP",
      english: "Income Approach",
      definition: "从生产过程形成收入的角度核算。",
      formula: "GDP = 劳动者报酬 + 生产税净额 + 固定资产折旧 + 营业盈余",
      related: ["expenditure-approach", "production-approach", "three-gorges"]
    },
    {
      id: "production-approach",
      term: "生产法GDP",
      english: "Production Approach",
      definition: "从生产过程中创造的货物和服务价值入手，得到增加值的核算方法。",
      formula: "GDP = \\Sigma(总产出 - 中间投入)",
      related: ["expenditure-approach", "income-approach", "value-added", "three-gorges"]
    },
    {
      id: "green-gdp",
      term: "绿色GDP",
      english: "Green GDP",
      definition: "从传统GDP中扣除自然资源消耗成本和环境退化成本后的核算指标。",
      formula: "绿色GDP = GDP - 自然资源损耗 - 环境退化成本",
      related: ["gdp", "gep"]
    },
    {
      id: "gep",
      term: "生态系统生产总值(GEP)",
      english: "Gross Ecosystem Product",
      definition: "生态系统为人类福祉提供的最终产品与服务价值的总和。",
      related: ["green-gdp", "gdp"]
    },
    {
      id: "base-period",
      term: "基期",
      english: "Base Period",
      definition: "统计指数编制中用作比较基准的时期。基期的指数值通常设定为100。",
      related: ["real-gdp", "laspeyres", "paasche"]
    },
    {
      id: "value-added",
      term: "增加值",
      english: "Value Added",
      definition: "生产过程中创造的新价值，等于总产出减去中间投入。",
      formula: "增加值 = 总产出 - 中间投入",
      related: ["production-approach", "intermediate-input", "total-output"]
    },
    {
      id: "cagr",
      term: "复合年均增长率(CAGR)",
      english: "Compound Annual Growth Rate",
      definition: "描述某个指标在特定时期内年均增长速度的指标。",
      formula: "CAGR = [(期末值/期初值)^{1/n} - 1] \\times 100\\%",
      related: ["gdp-growth"]
    }
  ],
  "ch2-enterprise": [
    {
      id: "legal-entity",
      term: "法人单位",
      english: "Legal Entity",
      definition: "依法成立能够独立承担民事责任的社会经济组织。须具备：依法成立、有名称和场所、有必要的财产和经费。",
      related: ["total-output"]
    },
    {
      id: "total-output",
      term: "企业总产出",
      english: "Total Output",
      definition: "企业在一定时期内生产的所有货物和服务的总价值。",
      related: ["intermediate-input", "value-added", "legal-entity"]
    },
    {
      id: "intermediate-input",
      term: "中间投入",
      english: "Intermediate Input",
      definition: "企业在生产过程中消耗和使用的非固定资产货物和服务的价值。",
      related: ["total-output", "value-added", "direct-consumption-coefficient"]
    },
    {
      id: "roa",
      term: "总资产收益率(ROA)",
      english: "Return on Assets",
      definition: "衡量企业全部资产运用效率的财务指标。",
      formula: "ROA = \\frac{净利润}{平均总资产} \\times 100\\%",
      related: ["roe", "asset-liability-ratio"]
    },
    {
      id: "roe",
      term: "净资产收益率(ROE)",
      english: "Return on Equity",
      definition: "衡量企业股东权益收益水平的指标。",
      formula: "ROE = \\frac{净利润}{平均股东权益} \\times 100\\%",
      related: ["roa", "asset-liability-ratio"]
    },
    {
      id: "labor-productivity",
      term: "劳动生产率",
      english: "Labor Productivity",
      definition: "反映劳动者在单位时间内创造价值的能力。",
      formula: "劳动生产率 = \\frac{增加值}{平均从业人数}",
      related: ["value-added", "total-output"]
    },
    {
      id: "rd-intensity",
      term: "研发投入强度",
      english: "R&D Intensity",
      definition: "反映企业创新投入力度的指标。",
      formula: "研发投入强度 = \\frac{研发支出}{营业收入} \\times 100\\%",
      related: ["high-tech-industry", "sales-growth"]
    },
    {
      id: "asset-liability-ratio",
      term: "资产负债率",
      english: "Asset-Liability Ratio",
      definition: "反映企业负债水平和财务风险的指标。",
      formula: "资产负债率 = \\frac{负债总额}{资产总额} \\times 100\\%",
      related: ["roa", "roe"]
    },
    {
      id: "inventory-turnover",
      term: "存货周转率",
      english: "Inventory Turnover Ratio",
      definition: "衡量企业存货管理效率的指标。",
      formula: "存货周转次数 = \\frac{营业成本}{平均存货}",
      related: ["sales-growth"]
    },
    {
      id: "sales-growth",
      term: "营业收入增长率",
      english: "Revenue Growth Rate",
      definition: "反映企业主营业务收入增长情况的指标。",
      formula: "营收增长率 = \\frac{本期营收 - 上期营收}{上期营收} \\times 100\\%",
      related: ["inventory-turnover", "rd-intensity"]
    }
  ],
  "ch3-industry": [
    {
      id: "industrial-structure",
      term: "产业结构",
      english: "Industrial Structure",
      definition: "国民经济中各产业的构成及其相互联系和比例关系。通常以各产业增加值占GDP比重来衡量。",
      related: ["three-industries", "io-table"]
    },
    {
      id: "three-industries",
      term: "三次产业分类",
      english: "Three-Sector Classification",
      definition: "第一产业（农林牧渔业）、第二产业（工业和建筑业）、第三产业（服务业）。由Clark和Kuznets建立。",
      related: ["industrial-structure", "high-tech-industry"]
    },
    {
      id: "io-table",
      term: "投入产出表",
      english: "Input-Output Table",
      definition: "由Leontief提出的矩阵形式经济统计表，反映国民经济各部门之间的投入来源与产出去向关系。",
      related: ["direct-consumption-coefficient", "complete-consumption-coefficient", "influence-coefficient"]
    },
    {
      id: "direct-consumption-coefficient",
      term: "直接消耗系数",
      english: "Direct Consumption Coefficient",
      definition: "某部门生产一单位产出需要直接消耗的另一部门产品的数量。",
      formula: "a_{ij} = \\frac{x_{ij}}{X_j}",
      related: ["complete-consumption-coefficient", "io-table"]
    },
    {
      id: "complete-consumption-coefficient",
      term: "完全消耗系数",
      english: "Total Consumption Coefficient",
      definition: "某部门生产一单位产出需要直接和间接消耗的另一部门产品的总量。",
      formula: "B = (I - A)^{-1} - I",
      related: ["direct-consumption-coefficient", "io-table"]
    },
    {
      id: "influence-coefficient",
      term: "影响力系数",
      english: "Influence Coefficient",
      definition: "衡量某一部门增加一单位最终使用时对各部门的生产需求波及程度。影响力系数>1表明拉动作用高于平均水平。",
      related: ["sensitivity-coefficient", "io-table"]
    },
    {
      id: "sensitivity-coefficient",
      term: "感应度系数",
      english: "Sensitivity Coefficient",
      definition: "衡量各部门增加一单位最终使用时某部门受到的需求感应程度。>1表明制约作用高于平均水平。",
      related: ["influence-coefficient", "io-table"]
    },
    {
      id: "industrial-concentration",
      term: "产业集中度",
      english: "Industrial Concentration",
      definition: "衡量市场中少数大型企业控制程度的指标。",
      formula: "CR_n = \\Sigma前n家企业市场份额; \\quad HHI = \\Sigma(各企业市场份额^2)",
      related: ["three-industries", "high-tech-industry"]
    },
    {
      id: "location-quotient",
      term: "区位商",
      english: "Location Quotient",
      definition: "衡量某区域某产业专业化程度的指标。LQ>1表明该产业在该区域具有专业化优势。",
      formula: "LQ = \\frac{区域产业占比}{全国该产业占比}",
      related: ["industrial-structure", "three-industries"]
    },
    {
      id: "high-tech-industry",
      term: "高技术产业",
      english: "High-Tech Industry",
      definition: "R&D投入强度较高的制造业行业，包括医药、航空航天、电子通信、计算机、医疗仪器、信息化学品六大类。",
      related: ["rd-intensity", "industrial-structure", "digital-industrialization"]
    }
  ],
  "ch4-household": [
    {
      id: "engel-coefficient",
      term: "恩格尔系数",
      english: "Engel's Coefficient",
      definition: "食品支出占家庭消费总支出的比例。由德国统计学家恩格尔在1857年提出。",
      formula: "恩格尔系数 = \\frac{食品支出}{消费总支出} \\times 100\\%",
      related: ["consumption-structure", "disposable-income", "poverty-line"]
    },
    {
      id: "gini-coefficient",
      term: "基尼系数",
      english: "Gini Coefficient",
      definition: "衡量居民收入分配不平等程度的指标。数值在0-1之间，0.4为国际警戒线。",
      related: ["lorenz-curve", "urban-rural-gap", "middle-income-group"]
    },
    {
      id: "lorenz-curve",
      term: "洛伦兹曲线",
      english: "Lorenz Curve",
      definition: "描绘收入或财富分配不均等程度的图形。横轴为人口累计%，纵轴为收入累计%。",
      related: ["gini-coefficient", "urban-rural-gap"]
    },
    {
      id: "disposable-income",
      term: "可支配收入",
      english: "Disposable Income",
      definition: "居民家庭在支付个人所得税和社保费用后可用于最终消费和储蓄的收入。",
      formula: "可支配收入 = 总收入 - 个人所得税 - 社保缴费",
      related: ["mpc", "consumption-structure", "household-survey"]
    },
    {
      id: "consumption-structure",
      term: "消费结构",
      english: "Consumption Structure",
      definition: "居民消费支出中各类商品和服务支出的比例关系。八大类：食品烟酒、衣着、居住、生活用品、交通通信、教育文化娱乐、医疗保健、其他。",
      related: ["engel-coefficient", "disposable-income", "cpi"]
    },
    {
      id: "household-survey",
      term: "住户收支调查",
      english: "Household Income and Expenditure Survey",
      definition: "通过抽样调查方法收集居民家庭收入和支出数据。中国样本约16万户。",
      related: ["disposable-income", "consumption-structure"]
    },
    {
      id: "urban-rural-gap",
      term: "城乡收入比",
      english: "Urban-Rural Income Ratio",
      definition: "城镇居民人均可支配收入与农村居民人均可支配收入的比值。",
      related: ["gini-coefficient", "lorenz-curve", "disposable-income"]
    },
    {
      id: "middle-income-group",
      term: "中等收入群体",
      english: "Middle-Income Group",
      definition: "收入水平处于社会中间区间的群体。中国标准为年收入10-50万元的3口之家。",
      related: ["urban-rural-gap", "gini-coefficient", "disposable-income"]
    },
    {
      id: "poverty-line",
      term: "贫困线",
      english: "Poverty Line",
      definition: "用于界定贫困人口的最低生活标准。2020年中国现行标准下农村贫困人口全部脱贫。",
      related: ["engel-coefficient", "gini-coefficient", "disposable-income"]
    },
    {
      id: "mpc",
      term: "边际消费倾向(MPC)",
      english: "Marginal Propensity to Consume",
      definition: "居民新增一单位可支配收入中用于消费的比例。",
      formula: "MPC = \\frac{\\Delta 消费支出}{\\Delta 可支配收入}",
      related: ["disposable-income", "consumption-structure", "engel-coefficient"]
    }
  ],
  "ch5-price-index": [
    {
      id: "laspeyres",
      term: "拉氏价格指数",
      english: "Laspeyres Price Index",
      definition: "以基期数量为权数编制的价格指数。由Etienne Laspeyres在1871年提出。",
      formula: "L_p = \\frac{\\Sigma(p_1 q_0)}{\\Sigma(p_0 q_0)} \\times 100",
      related: ["paasche", "fisher", "substitution-bias"]
    },
    {
      id: "paasche",
      term: "帕氏价格指数",
      english: "Paasche Price Index",
      definition: "以报告期数量为权数编制的价格指数。由Hermann Paasche在1874年提出。",
      formula: "P_p = \\frac{\\Sigma(p_1 q_1)}{\\Sigma(p_0 q_1)} \\times 100",
      related: ["laspeyres", "fisher"]
    },
    {
      id: "fisher",
      term: "费雪理想指数",
      english: "Fisher Ideal Index",
      definition: "拉氏和帕氏指数的几何平均数。满足时间可逆性和因子可逆性。",
      formula: "F = \\sqrt{L_p \\times P_p}",
      related: ["laspeyres", "paasche"]
    },
    {
      id: "cpi",
      term: "CPI(居民消费价格指数)",
      english: "Consumer Price Index",
      definition: "反映居民家庭购买的消费品和服务项目价格水平变动情况的相对数。是衡量通货膨胀的核心指标。",
      related: ["ppi", "inflation", "core-inflation"]
    },
    {
      id: "ppi",
      term: "PPI(生产者价格指数)",
      english: "Producer Price Index",
      definition: "反映工业生产者出厂价格变动趋势和幅度的相对数。",
      related: ["cpi", "inflation"]
    },
    {
      id: "core-inflation",
      term: "核心通胀率",
      english: "Core Inflation",
      definition: "剔除食品和能源价格后的CPI变化率。更能反映长期通胀趋势。",
      related: ["cpi", "inflation"]
    },
    {
      id: "inflation",
      term: "通货膨胀",
      english: "Inflation",
      definition: "一般价格水平的持续上升。通常用CPI变动率来衡量。",
      formula: "通胀率 = \\frac{CPI_t - CPI_{t-1}}{CPI_{t-1}} \\times 100\\%",
      related: ["cpi", "core-inflation"]
    },
    {
      id: "ppp",
      term: "购买力平价(PPP)",
      english: "Purchasing Power Parity",
      definition: "根据各国价格水平计算货币之间等值系数的经济学方法。用于国际GDP比较。",
      related: ["big-mac-index", "gdp", "cpi"]
    },
    {
      id: "big-mac-index",
      term: "巨无霸指数",
      english: "Big Mac Index",
      definition: "《经济学人》提出的非正式PPP指标，以各国巨无霸汉堡价格为比较基准。",
      related: ["ppp"]
    },
    {
      id: "chain-index",
      term: "链式指数",
      english: "Chain Index",
      definition: "每年更新权数编制指数然后连乘得到的价格指数序列。克服了固定权数的替代偏差。",
      related: ["laspeyres", "paasche", "substitution-bias"]
    },
    {
      id: "substitution-bias",
      term: "替代偏差",
      english: "Substitution Bias",
      definition: "拉氏指数因使用固定基期权数而产生的向上偏差——当价格上涨时消费者会购买替代品，但指数权数不变。",
      related: ["laspeyres", "chain-index", "paasche"]
    },
    {
      id: "hedonic",
      term: "特征价格法",
      english: "Hedonic Pricing",
      definition: "通过回归分析将商品价格分解为其特征的贡献，用于编制质量调整价格指数。",
      related: ["cpi", "ppi", "chain-index"]
    }
  ],
  "ch6-digital-economy": [
    {
      id: "digital-economy",
      term: "数字经济",
      english: "Digital Economy",
      definition: "以数据作为关键生产要素、数字技术为核心驱动力、现代信息网络为载体的新型经济形态。",
      related: ["digital-industrialization", "industrial-digitalization", "digitization-rate", "data-factor"]
    },
    {
      id: "digital-industrialization",
      term: "数字产业化",
      english: "Digital Industrialization",
      definition: "数字技术自身的产业化，包括电子信息制造业、软件和信息技术服务业等。是数字经济的核心产业部分。",
      related: ["digital-economy", "industrial-digitalization", "high-tech-industry"]
    },
    {
      id: "industrial-digitalization",
      term: "产业数字化",
      english: "Industrial Digitalization",
      definition: "传统产业应用数字技术所带来的产出增加和效率提升。",
      related: ["digital-economy", "digital-industrialization", "digitization-rate"]
    },
    {
      id: "digitization-rate",
      term: "数字化率",
      english: "Digitization Rate",
      definition: "数字经济增加值占GDP的比重。",
      formula: "数字化率 = \\frac{数字经济增加值}{GDP} \\times 100\\%",
      related: ["digital-economy", "satellite-account"]
    },
    {
      id: "data-asset",
      term: "数据资产",
      english: "Data Asset",
      definition: "由企业拥有或控制的、经过加工处理的、能够带来经济效益的数据资源。2024年中国将数据列为第五大生产要素。",
      related: ["data-factor", "digital-economy"]
    },
    {
      id: "data-factor",
      term: "数据要素",
      english: "Data as a Factor of Production",
      definition: "数据作为新的生产要素参与价值创造和收入分配。可无限复制、非排他性使用。",
      related: ["data-asset", "digital-economy"]
    },
    {
      id: "platform-economy",
      term: "平台经济",
      english: "Platform Economy",
      definition: "基于数字平台的经济活动组织形式。通过撮合供需双方获得收入，形成双边或多边市场。",
      related: ["network-effect", "consumer-surplus", "digital-economy"]
    },
    {
      id: "network-effect",
      term: "网络效应",
      english: "Network Effect",
      definition: "平台用户越多，对每个用户价值越大的现象。是平台经济的核心经济学特性。",
      related: ["platform-economy", "digital-economy"]
    },
    {
      id: "digital-divide",
      term: "数字鸿沟",
      english: "Digital Divide",
      definition: "不同群体在数字技术获取和使用方面的差距。包括接入鸿沟、技能鸿沟和效益鸿沟。",
      related: ["digital-economy", "digitization-rate"]
    },
    {
      id: "consumer-surplus",
      term: "消费者剩余",
      english: "Consumer Surplus",
      definition: "消费者愿意支付的最高价格与实际支付价格之间的差额。免费数字服务创造了大量未被GDP计量的消费者剩余。",
      related: ["platform-economy", "digital-economy", "gdp"]
    },
    {
      id: "digital-trade",
      term: "数字贸易",
      english: "Digital Trade",
      definition: "以数字方式订购和/或交付的国际贸易。包括数字服务贸易和数字化商品贸易。",
      related: ["digital-economy", "platform-economy"]
    },
    {
      id: "satellite-account",
      term: "卫星账户",
      english: "Satellite Account",
      definition: "在国民经济核算中心框架之外对特定领域进行详细核算的补充性账户。",
      related: ["digital-economy", "digitization-rate", "green-gdp"]
    }
  ],
  "ch7-data-asset": [
    {
      id: "data-definition",
      term: "数据（ISWGNA定义）",
      english: "Data (ISWGNA Definition)",
      definition: "通过获取和观察现象而产生的信息内容，并以数字格式记录、组织和存储，从而在生产活动中使用时提供经济效益。",
      related: ["data-asset", "data-factor"]
    },
    {
      id: "data-non-rivalry",
      term: "数据非竞争性",
      english: "Non-Rivalry of Data",
      definition: "数据的核心特征之一。数据被一个人获得后其他人还可以继续获得，无论有多少人获得都拥有数据的全部，共享使用次数越多价值越大。",
      related: ["data-definition"]
    },
    {
      id: "data-value-chain",
      term: "数据价值链",
      english: "Data Value Chain",
      definition: "描述数据从原始观察到创造经济价值的完整增值过程，由数据收集、数据存储、数据分析和数据应用四个阶段构成。",
      related: ["data-definition", "data-asset"]
    },
    {
      id: "data-asset",
      term: "数据资产",
      english: "Data Asset",
      definition: "满足经济所有权明确和能在未来带来经济收益两个条件的数据。满足资本化条件（使用一年以上）的数据资产应视为固定资本形成。",
      formula: "K_t^{\\text{data}} = K_{t-1}^{\\text{data}} - D_t^{\\text{data}} + I_t^{\\text{data}}",
      related: ["data-definition", "data-capital-stock"]
    },
    {
      id: "data-factor",
      term: "数据要素",
      english: "Data as a Factor of Production",
      definition: "等同数据资产。作为生产要素用作特定货物和服务的生产活动，能为经济所有者带来经济收益的数据，与劳动、资本、土地并列的新型生产要素。",
      related: ["data-asset", "data-definition"]
    },
    {
      id: "data-capital-stock",
      term: "数据资本存量",
      english: "Data Capital Stock",
      definition: "剔除数据固定资本消耗后的数据资本存量净值。通常采用永续盘存法（PIM）进行测算。",
      formula: "K_t = I_t + (1 - \\delta_t) K_{t-1}",
      related: ["data-asset", "data-factor"]
    },
    {
      id: "data-valuation-cost",
      term: "成本法（数据估值）",
      english: "Cost Approach (Data Valuation)",
      definition: "通过加总数据生产过程中各项成本（计划开发、获取记录、处理组织等）来测度数据价值的方法，2025年SNA推荐用于自用型数据。",
      related: ["data-asset"]
    },
    {
      id: "enterprise-data",
      term: "企业数据",
      english: "Enterprise Data",
      definition: "企业拥有经济所有权、以数字化形式获取并存储的信息内容。满足资本化条件的企业数据应视为数据资本形成。",
      related: ["data-asset", "data-definition"]
    },
    {
      id: "government-data",
      term: "政府数据",
      english: "Government Data",
      definition: "政府部门在履职过程中获取、创建、传播和积累的相关数据，包含政务数据和公共数据，覆盖面广、价值密度高、可靠性强。",
      related: ["data-asset", "enterprise-data"]
    },
    {
      id: "personal-data",
      term: "个人数据",
      english: "Personal Data",
      definition: "与已识别或可识别个人（数据主体）有关的任何信息。产生者和使用者往往并非同一主体，权属界定较为困难。",
      related: ["data-asset", "enterprise-data", "government-data"]
    },
    {
      id: "data-classification",
      term: "数据多维分类",
      english: "Multi-dimensional Data Classification",
      definition: "从数据格式（结构化/半结构化/非结构化）、获取方式（自给型/交易型）、来源主体（企业/政府/个人）和所属行业（按GB/T 4754-2017）等多维度对数据进行系统分类的体系。",
      related: ["data-definition", "enterprise-data", "government-data", "personal-data"]
    },
    {
      id: "data-non-depletion",
      term: "数据非消耗性",
      english: "Non-Depletion of Data",
      definition: "数据在使用过程中不会被消耗或耗尽，反而会产生新数据使体量增大。这一特征使传统物理折旧概念不再适用于数据资产，需要转向基于经济价值衰减（时效性）的折旧概念。",
      related: ["data-non-rivalry", "data-asset"]
    },
    {
      id: "data-fusion-value",
      term: "数据融合增值",
      english: "Data Fusion Value Enhancement",
      definition: "将不同来源的数据进行整合和分析，从而获得更高价值信息和知识的属性。孤立数据的价值远低于互联互通的数据集群，融合增值是数据区别于传统资产的独特价值特征。",
      related: ["data-non-rivalry", "data-value-chain"]
    },
    {
      id: "data-scenario-dependence",
      term: "数据场景依赖性",
      english: "Scenario Dependence of Data Value",
      definition: "相同数据在不同应用场景中具有截然不同价值的数据特征。如销售数据对销售分析极具价值，但对生产管理几乎无价值。这导致市场法评估数据时可比交易难以匹配。",
      related: ["data-definition", "data-valuation-cost"]
    },
    {
      id: "data-non-monetary",
      term: "数据非货币交易",
      english: "Non-Monetary Data Transaction",
      definition: "数据不通过货币交易而通过共享、合作或'免费'服务换取的模式。如网络平台通过提供免费数字服务交换消费者个人数据，使GDP中数据产出被低估。",
      related: ["personal-data", "data-value-chain"]
    },
    {
      id: "data-capital-formation",
      term: "数据资本形成总额",
      english: "Data Gross Fixed Capital Formation",
      definition: "常住单位在一定时期内获得减去处置的数据资产价值的差额。满足资本化条件（使用寿命超过一年）的数据支出计入固定资本形成总额而非中间消耗。",
      formula: "I_t^{\text{data}} = K_t^{\text{data}} - K_{t-1}^{\text{data}} + D_t^{\text{data}}",
      related: ["data-asset", "data-capital-stock"]
    },
    {
      id: "data-pim",
      term: "永续盘存法（数据资产）",
      english: "Perpetual Inventory Method for Data",
      definition: "测算数据资本存量的主流间接方法。核心公式K_t = I_t + (1-δ_t)K_{t-1}，关键难题是数据折旧率δ_t的确定——需基于时效性的经济折旧而非物理折旧。",
      formula: "K_t = I_t + (1 - \delta_t) K_{t-1}",
      related: ["data-capital-stock", "data-capital-formation"]
    },
    {
      id: "data-income-approach",
      term: "收益法（数据估值）",
      english: "Income Approach for Data Valuation",
      definition: "基于数据未来预期应用场景，将数据预期产生的经济收益按适宜折现率折算成现值来确定数据价值的评估方法。理论最优但实践中面临未来收益不确定性挑战。",
      formula: "V_{\text{data}} = \sum_{t=1}^{T} \frac{E_t}{(1 + r)^t}",
      related: ["data-valuation-cost", "data-asset"]
    },

  ]
,
  "ch8-macro-overview": [
    {
      id: "macro-analysis",
      term: "宏观经济四维分析",
      english: "Four-Dimensional Macroeconomic Analysis",
      definition: "从生产、需求、收入和价格四个角度系统观察和分析宏观经济运行的基本框架，对应GDP的三种核算方法和价格平减体系。",
      related: ["gdp", "cpi", "three-gorges"]
    },
    {
      id: "production-perspective",
      term: "生产法GDP",
      english: "GDP by Production Approach",
      definition: "从生产角度计算GDP的方法，等于各产业部门增加值之和，反映国民经济各产业部门的生产成果。",
      formula: "GDP = \\Sigma (\\text{总产出} - \\text{中间投入})",
      related: ["gdp", "real-gdp"]
    },
    {
      id: "income-distribution",
      term: "收入分配格局",
      english: "Income Distribution Structure",
      definition: "GDP创造的价值在居民（劳动者报酬）、企业（营业盈余）和政府（生产税净额）之间的分配结构，影响消费能力和经济增长质量。",
      related: ["gdp"]
    },
    {
      id: "ppi-cpi-scissors",
      term: "PPI-CPI剪刀差",
      english: "PPI-CPI Scissors Gap",
      definition: "PPI与CPI之间的差值。PPI持续高于CPI意味着上游成本上涨无法完全传导至下游，中下游企业利润空间被压缩。",
      related: ["cpi", "gdp-deflator"]
    },
    {
      id: "industrial-structure-upgrade",
      term: "产业结构高度化",
      english: "Industrial Structure Upgrading",
      definition: "产业结构从低水平向高水平演进的过程，包括产业间结构升级（农业→工业→服务业）、要素密集度升级和产品附加值升级三个维度。",
      related: ["gdp", "real-gdp"]
    },
    {
      id: "business-cycle",
      term: "经济周期",
      english: "Business Cycle",
      definition: "市场经济运行中总产出、就业和价格水平的周期性波动，分为扩张、顶峰、收缩和谷底四个阶段。按波动长度可分为基钦周期（3-5年库存周期）、朱格拉周期（7-11年投资周期）等。",
      related: ["macro-analysis", "production-perspective"]
    },
    {
      id: "growth-accounting",
      term: "增长核算",
      english: "Growth Accounting",
      definition: "将GDP增长率分解为要素投入（劳动和资本）增长的贡献和全要素生产率（TFP）增长的贡献的分析框架。索洛余值法是其经典方法。",
      formula: "g_Y = g_A + \alpha g_L + (1-\alpha) g_K",
      related: ["production-perspective", "macro-analysis"]
    },
    {
      id: "tfp",
      term: "全要素生产率",
      english: "Total Factor Productivity (TFP)",
      definition: "产出增长中不能被要素投入（劳动和资本）增长所解释的'余值'部分，反映技术进步、效率改善和制度创新对经济增长的综合贡献。是衡量经济增长质量和可持续性的核心指标。",
      related: ["growth-accounting", "production-perspective"]
    },
    {
      id: "potential-output",
      term: "潜在产出",
      english: "Potential Output",
      definition: "经济体在充分利用所有资源（劳动力和资本）且价格水平稳定的情况下可持续实现的最大产出水平。产出缺口 = (实际GDP - 潜在GDP)/潜在GDP × 100%。",
      related: ["business-cycle", "growth-accounting"]
    },
    {
      id: "fiscal-policy",
      term: "财政政策",
      english: "Fiscal Policy",
      definition: "政府通过调整政府支出、税收和转移支付来调节总需求和宏观经济运行的政策工具。主要工具包括政府购买、个人所得税、企业所得税和社会保障支出。",
      related: ["macro-analysis", "income-distribution"]
    },
    {
      id: "monetary-policy",
      term: "货币政策",
      english: "Monetary Policy",
      definition: "中央银行通过调节利率、信贷和货币供给来影响投资和消费，进而调节宏观经济运行的政策工具。中国的主要工具包括LPR利率、存款准备金率和公开市场操作。",
      related: ["fiscal-policy", "macro-analysis"]
    },
    {
      id: "pmi",
      term: "采购经理指数",
      english: "Purchasing Managers' Index (PMI)",
      definition: "通过对采购经理月度问卷调查编制的景气先行指标，涵盖新订单（30%）、生产（25%）、从业人员（20%）、供应商配送时间（15%）和原材料库存（10%）。PMI>50%表示经济扩张，<50%表示收缩。",
      related: ["business-cycle", "macro-analysis"]
    },
    {
      id: "ppp",
      term: "购买力平价",
      english: "Purchasing Power Parity (PPP)",
      definition: "以各国购买相同一篮子货物和服务所需的本币数量之比作为GDP国际比较的换算因子，替代市场汇率以消除各国价格水平差异对GDP比较的系统性偏差。",
      related: ["production-perspective", "macro-analysis"]
    },
    {
      id: "middle-income-trap",
      term: "中等收入陷阱",
      english: "Middle Income Trap",
      definition: "一国达到中等收入水平后，因劳动力成本上升失去劳动密集型比较优势，但技术创新能力不足以支持产业升级到高附加值环节，导致经济增长长期停滞的现象。",
      related: ["industrial-structure-upgrade", "macro-analysis"]
    },
    {
      id: "output-gap",
      term: "产出缺口",
      english: "Output Gap",
      definition: "实际GDP与潜在GDP之间的差异占潜在GDP的百分比。正缺口（实际>潜在）意味经济过热和通胀压力；负缺口（实际<潜在）意味资源闲置和通缩压力。是货币政策制定的核心参考指标。",
      related: ["potential-output", "business-cycle"]
    },

  ],
  };
