var STATCOMP_QUIZ = {

  's4-dist': [
    {
      id: 's4-q1', type: 'single', chapter: 's4-dist', difficulty: 1,
      question: '下列哪个函数用于描述连续型随机变量在某一点取值的"相对可能性"？',
      options: ['累积分布函数(CDF)', '概率密度函数(PDF)', '概率质量函数(PMF)', '特征函数(CF)'],
      answer: 1,
      explanation: '概率密度函数(PDF) $f(x)$描述连续型随机变量在各点的相对可能性。PMF用于离散型变量。CDF $F(x)=P(X\leq x)$是累积概率。',
      knowledgePoint: '概率分布基础'
    },
    {
      id: 's4-q2', type: 'single', chapter: 's4-dist', difficulty: 1,
      question: '标准正态分布$N(0,1)$的CDF在$x=0$处的值为：',
      options: ['0', '0.5', '1', '取决于标准差'],
      answer: 1,
      explanation: '标准正态分布关于0对称，因此$P(X\leq 0)=0.5$，即$CDF(0)=0.5$。',
      knowledgePoint: '概率分布基础'
    },
    {
      id: 's4-q3', type: 'single', chapter: 's4-dist', difficulty: 2,
      question: '关于累积分布函数(CDF)F(x)，以下哪项描述是错误的？',
      options: [
        '$F(x)$是单调非递减函数',
        '$\\lim_{x\\to -\\infty} F(x) = 0$',
        '$F(x)$的导数始终等于概率密度函数$f(x)$',
        '$\\lim_{x\\to +\\infty} F(x) = 1$'
      ],
      answer: 2,
      explanation: '$F(x)$的导数等于$f(x)$仅当$F(x)$在$x$处可导时成立。对于混合分布或离散分布，$F(x)$可能有跳跃不连续点，导数为0或无穷。',
      knowledgePoint: '概率分布基础'
    },
    {
      id: 's4-q4', type: 'single', chapter: 's4-dist', difficulty: 2,
      question: '泊松分布的期望和方差之间的关系是：',
      options: ['期望 > 方差', '期望 < 方差', '期望 = 方差 = $\\lambda$', '两者无关'],
      answer: 2,
      explanation: '泊松分布$Poi(\\lambda)$的期望和方差都等于参数$\\lambda$，这是泊松分布的一个重要特征。',
      knowledgePoint: '概率分布基础'
    },
    {
      id: 's4-q5', type: 'single', chapter: 's4-dist', difficulty: 2,
      question: '线性同余生成器(LCG)的递推公式为 $X_{n+1} = (aX_n + c) \\bmod m$。以下哪个参数选择会得到最大的周期？',
      options: ['a=1, c=0, m=10', 'a=1, c=1, m=10', 'a=2, c=0, m=8', 'a=5, c=0, m=8'],
      answer: 1,
      explanation: '当$c\\neq 0$时LCG为混合同余生成器，周期最大可达$m$（当参数满足Hull-Dobell定理时）。$c=0$时为乘同余生成器，周期$\\leq m-1$。',
      knowledgePoint: '随机数生成原理'
    },
    {
      id: 's4-q6', type: 'multi', chapter: 's4-dist', difficulty: 2,
      question: '以下哪些是伪随机数生成器(PRNG)应满足的优良性质？（多选）',
      options: [
        '长周期',
        '统计均匀性（通过各种统计检验）',
        '完全不可预测（即使知道算法和状态）',
        '高效的计算速度',
        '高维均匀分布性'
      ],
      answer: [0, 1, 3, 4],
      explanation: 'PRNG是确定性的——知道算法和当前状态即可预测后续序列。因此"完全不可预测"不是PRNG的性质，而是密码学安全PRNG(CSPRNG)的目标。其余四项均为优良PRNG的标准性质。',
      knowledgePoint: '随机数生成原理'
    },
    {
      id: 's4-q7', type: 'multi', chapter: 's4-dist', difficulty: 2,
      question: '关于逆变换采样(Inverse Transform Sampling)，以下哪些说法是正确的？（多选）',
      options: [
        '它基于定理：若U~U(0,1)，则X=F^{-1}(U)~F',
        '它要求目标分布的CDF有解析形式的逆函数',
        '它只能用于连续型分布',
        '它利用了CDF的值域恰好是[0,1]这一性质',
        '当CDF无闭式逆时，可以用数值方法近似F^{-1}'
      ],
      answer: [0, 1, 3, 4],
      explanation: '逆变换法对离散型分布同样适用，只需定义广义逆F^{-1}(u)=inf{x: F(x)≥u}。当CDF无解析逆时可用数值求逆（如二分查找）。',
      knowledgePoint: '逆变换法与直接采样'
    },
    {
      id: 's4-q8', type: 'multi', chapter: 's4-dist', difficulty: 3,
      question: '在Metropolis-Hastings算法中，以下哪些因素影响采样效率？（多选）',
      options: [
        '建议分布q的选择',
        '建议分布的宽度（如高斯建议的标准差）',
        '初始值的选择',
        '目标分布的归一化常数',
        'Burn-in的长度'
      ],
      answer: [0, 1, 2],
      explanation: '建议分布的选择和宽度直接影响接受率和混合速度（太窄→高接受但慢混合；太宽→低接受）。初始值影响burn-in长度。注意MH只需要目标分布的比例形式，不需要归一化常数。',
      knowledgePoint: 'MCMC方法基础'
    },
    {
      id: 's4-q9', type: 'truefalse', chapter: 's4-dist', difficulty: 1,
      question: '接受-拒绝采样中，常数M越大，采样效率越高。',
      options: ['正确', '错误'],
      answer: 1,
      explanation: '错误。接受率=1/M，M越大接受率越低，效率越差。应在满足$f(x)\\leq M g(x)$的前提下取最小的$M$。',
      knowledgePoint: '接受-拒绝采样'
    },
    {
      id: 's4-q10', type: 'truefalse', chapter: 's4-dist', difficulty: 1,
      question: 'Mersenne Twister(MT19937)的周期是$2^{19937}-1$个随机数。',
      options: ['正确', '错误'],
      answer: 0,
      explanation: '正确。MT19937的周期等于梅森素数$2^{19937}-1$，远超可观测宇宙中的原子总数。',
      knowledgePoint: '随机数生成原理'
    },
    {
      id: 's4-q11', type: 'truefalse', chapter: 's4-dist', difficulty: 2,
      question: 'Gibbs采样是Metropolis-Hastings算法的一个特例，其接受概率恒为1。',
      options: ['正确', '错误'],
      answer: 0,
      explanation: '正确。Gibbs采样每次从完全条件分布中采样，对应的MH接受概率恰好为1，因此每次提议都被接受。',
      knowledgePoint: 'MCMC方法基础'
    },
    {
      id: 's4-q12', type: 'fill', chapter: 's4-dist', difficulty: 2,
      question: '接受-拒绝采样中，若目标分布$f(x)$和建议分布$g(x)$满足$f(x)\\leq M\\cdot g(x)$，则期望接受率为____。',
      answer: '1/M',
      explanation: '对每个候选样本$X\\sim g$，接受概率为$f(X)/(M\\cdot g(X))$，总体期望接受率为$1/M$。$M$越接近1效率越高。',
      knowledgePoint: '接受-拒绝采样'
    },
    {
      id: 's4-q13', type: 'fill', chapter: 's4-dist', difficulty: 2,
      question: 'MCMC算法的平稳分布是指：若$X_t$服从该分布，则经过一次马尔可夫转移后，$X_{t+1}$也服从____分布。',
      answer: '同一',
      explanation: '平稳分布(Stationary Distribution)是马尔可夫链的不变分布。当链收敛后，所有后续样本都来自目标分布，尽管相邻样本之间存在相关性。',
      knowledgePoint: 'MCMC方法基础'
    },
    {
      id: 's4-q14', type: 'code-analysis', chapter: 's4-dist', difficulty: 3,
      question: '分析以下代码，解释为什么使用 -log(1-U) 而非 -log(U) 来生成指数分布随机数？两者有实质区别吗？',
      code: 'U = np.random.uniform(0, 1, 10000)\nX1 = -np.log(1 - U) / lam  # 方法1\nX2 = -np.log(U) / lam      # 方法2',
      output: '两种方法的样本均值和直方图在统计意义上完全相同。',
      analysisPoints: [
        '若U~U(0,1)，则1-U也~U(0,1)（对称性），因此-log(U)和-log(1-U)服从同一分布',
        '数值上唯一的细微区别：当U=0时log(U)为-inf，但在浮点运算中U几乎不可能精确为0',
        '两种写法在数学上等价，选择哪一种不影响采样结果的统计性质'
      ]
    },
    {
      id: 's4-q15', type: 'flowchart', chapter: 's4-dist', difficulty: 2,
      question: '以下是Metropolis-Hastings算法的简化流程图。请填写空白步骤：',
      flowchart: {
        steps: [
          '初始化: 设置初始状态 x_0, 迭代次数 N',
          'For t = 1, 2, ..., N:',
          '  步骤1: 从建议分布 $q(\\cdot|x_{t-1})$ 生成候选样本 ____',
          '  步骤2: 计算接受概率 $\\alpha = \\min(1, [\\pi(x^*)q(x_{t-1}|x^*)] / [\\_\\_\\_\\_])$',
          '  步骤3: 以概率$\\alpha$接受$x^*$, 否则____(保持原状态)',
          '输出: 样本序列 {x_0, x_1, ..., x_N}'
        ]
      },
      blanks: ['x*', 'π(x_{t-1})q(x*|x_{t-1})', '拒绝并保持x_{t-1}'],
      explanation: 'MH算法的核心三步：1)从建议分布提议新状态$x^*$；2)计算MH接受比率（包含建议分布的非对称修正）；3)以概率$\\alpha$接受，否则停留。当建议分布对称时，MH比简化为$\\pi(x^*)/\\pi(x_{t-1})$。',
      knowledgePoint: 'MCMC方法基础'
    },
    {
      id: 's4-q16', type: 'single', chapter: 's4-dist', difficulty: 2,
      question: '指数分布Exp(λ)具有"无记忆性"。若某电子元件寿命X~Exp(0.01)，已正常工作100小时，则它还能再工作至少100小时的概率为：',
      options: [
        'e⁻¹ ≈ 0.368',
        '1 - e⁻¹ ≈ 0.632',
        '0.5',
        '取决于已工作时间'
      ],
      answer: 0,
      explanation: 'P(X>200|X>100)=P(X>100)=e^{-0.01×100}=e^{-1}≈0.368。无记忆性意味着未来寿命分布不依赖于已存活时间——这是指数分布独有的性质（离散情形对应几何分布）。',
      knowledgePoint: '概率分布基础'
    },
    {
      id: 's4-q17', type: 'single', chapter: 's4-dist', difficulty: 2,
      question: 'Box-Muller变换用于生成哪种分布的随机数？',
      options: [
        '指数分布',
        '泊松分布',
        '标准正态分布',
        '均匀分布'
      ],
      answer: 2,
      explanation: 'Box-Muller变换将两个独立U(0,1)随机数U₁,U₂转换为两个独立N(0,1)随机数：Z₁=√(-2lnU₁)cos(2πU₂), Z₂=√(-2lnU₁)sin(2πU₂)。这是生成正态随机数的经典方法。',
      knowledgePoint: '逆变换法与直接采样'
    },
    {
      id: 's4-q18', type: 'multi', chapter: 's4-dist', difficulty: 3,
      question: 'MCMC收敛诊断的常用方法包括哪些？（多选）',
      options: [
        'Gelman-Rubin诊断（比较多条链的链间/链内方差）',
        '有效样本量(ESS)估计',
        '迹图(Trace Plot)目视检查',
        '计算接受率(Acceptance Rate)',
        't检验判断均值是否为零'
      ],
      answer: [0,1,2,3],
      explanation: '前四种均为标准MCMC诊断方法。Gelman-Rubin的R-hat统计量接近1表明链已混合。ESS反映考虑自相关后的"等效独立样本数"。迹图应呈现"毛虫状"随机波动。接受率过高或过低都需调整建议分布。',
      knowledgePoint: 'MCMC方法基础'
    },
    {
      id: 's4-q19', type: 'multi', chapter: 's4-dist', difficulty: 3,
      question: '关于重要性采样(Importance Sampling)，以下哪些说法正确？（多选）',
      options: [
        '通过从提议分布采样并加权来估计期望',
        '重要性权重w(x)=f(x)/g(x)，其中f是目标分布，g是提议分布',
        '提议分布的尾部应比目标分布更厚（即g(x)在f(x)非零处都非零）',
        '重要性采样的方差不依赖于提议分布的选择',
        '有效样本量ESS≈(Σwᵢ)²/Σwᵢ²可以用来评估重要性采样的效率'
      ],
      answer: [0,1,2,4],
      explanation: '重要性采样的方差高度依赖于提议分布g的选择。若g的尾部比f薄，则权重可能极端不平衡（少数样本权重极大），导致估计不稳定。ESS公式衡量权重的均匀程度。',
      knowledgePoint: '逆变换法与直接采样'
    },
    {
      id: 's4-q20', type: 'truefalse', chapter: 's4-dist', difficulty: 1,
      question: '接受-拒绝采样中，若目标分布f(x)=Beta(2,5)和建议分布g(x)=U(0,1)，则最优M值（使接受率最高）约为Beta(2,5)密度函数的最大值。',
      options: [
        '正确',
        '错误'
      ],
      answer: 0,
      explanation: '正确。最优M=sup f(x)/g(x)，对U(0,1)即sup f(x)。Beta(2,5)在x=0.2处取得最大值，M即为该点密度值，此时接受率1/M最高。',
      knowledgePoint: '接受-拒绝采样'
    },
    {
      id: 's4-q21', type: 'truefalse', chapter: 's4-dist', difficulty: 2,
      question: '大数定律保证了蒙特卡洛积分的收敛性：样本均值几乎必然收敛到真实期望，且收敛速率为O(1/n)。',
      options: [
        '正确',
        '错误'
      ],
      answer: 1,
      explanation: '前半句正确（大数定律保证收敛），但收敛速率为O(1/√n)而非O(1/n)——这是中心极限定理的结论。这也是MC方法的主要局限：精度每提高一位需要100倍样本。',
      knowledgePoint: '概率分布基础'
    },
    {
      id: 's4-q22', type: 'fill', chapter: 's4-dist', difficulty: 2,
      question: '对于独立同分布样本X₁,...,Xₙ~f(x;θ)，对数似然函数定义为ℓ(θ)=____。最大似然估计(MLE)是通过最大化ℓ(θ)来估计参数θ的方法。',
      answer: "∑ᵢ₌₁ⁿ log f(Xᵢ; θ)",
      explanation: '似然函数L(θ)=∏ᵢ f(Xᵢ;θ)，取对数得ℓ(θ)=∑ᵢ log f(Xᵢ;θ)。对数变换将乘积转为求和，简化计算且避免数值下溢。',
      knowledgePoint: 'MCMC方法基础'
    },
    {
      id: 's4-q23', type: 'fill', chapter: 's4-dist', difficulty: 2,
      question: '若X₁,...,Xₙ~N(μ,σ²)且σ已知，则μ的95%置信区间为____。这个区间有95%的概率覆盖真实的μ。',
      answer: "X̄ ± 1.96·σ/√n",
      explanation: '样本均值X̄~N(μ, σ²/n)，标准化后(X̄-μ)/(σ/√n)~N(0,1)。P(|Z|<1.96)=0.95，反解不等式即得置信区间。1.96是标准正态的97.5%分位数。',
      knowledgePoint: '概率分布基础'
    },
    {
      id: 's4-q24', type: 'code-analysis', chapter: 's4-dist', difficulty: 3,
      question: '以下代码用逆变换法从指数分布采样。解释：(1)为什么U~U(0,1)经过F⁻¹(U)变换后服从Exp(λ)？(2)直方图与理论密度曲线为什么吻合？',
      code: 'def inv_exp(n, lam=1.0):\n    U = np.random.uniform(0, 1, n)\n    X = -np.log(1 - U) / lam  # 逆变换\n    return X\n\nX = inv_exp(10000, lam=2.0)\n# 样本均值=0.4998 ≈ 1/λ=0.5\n# 直方图与理论密度f(x)=2e^{-2x}完全吻合',
      output: '样本均值0.4998 ≈ 1/λ=0.5，直方图与理论密度λe^{-λx}高度吻合',
      analysisPoints: [
        '逆变换原理：若U~U(0,1)，则对任意连续CDF F，有F⁻¹(U)~F。因为P(F⁻¹(U)≤x)=P(U≤F(x))=F(x)',
        '指数分布CDF为F(x)=1-e^{-λx}，其逆为F⁻¹(u)=-log(1-u)/λ。由于1-U与U同分布，等价于-log(U)/λ',
        '样本均值0.4998≈0.5=1/λ验证了指数分布的期望公式E[X]=1/λ',
        '直方图与理论密度的吻合是逆变换正确性的视觉证明：10000个采样点足以让经验分布逼近真实分布'
      ],
      answer: undefined,
      explanation: '',
      knowledgePoint: 'undefined'
    },
    {
      id: 's4-q25', type: 'algo-judge', chapter: 's4-dist', difficulty: 3,
      question: '比较以下随机数生成和采样方法，选出所有正确的陈述：',
      options: [
        '逆变换法要求目标分布的CDF有解析形式的逆函数（或可数值求解），但采样效率高（每个U(0,1)产生一个样本）',
        '接受-拒绝采样不需要CDF的逆，但需要找到合适的建议分布和上界M',
        'MCMC方法产生的样本是独立的（i.i.d.）',
        'Gibbs采样在高维问题中特别有用，因为它将多维采样分解为一系列一维条件采样',
        '重要性采样产生的加权样本可以用于估计期望，但不能直接当作目标分布的独立样本使用'
      ],
      answer: [0,1,3,4],
      explanation: 'MCMC产生的样本序列存在自相关——相邻样本高度依赖，不是独立同分布的。这正是需要burn-in和thinning的原因。其余陈述均正确。',
      knowledgePoint: '采样方法综合'
    }

  ],

  's5-optimize': [
    {
      id: 's5-q1', type: 'single', chapter: 's5-optimize', difficulty: 1,
      question: '梯度下降法的参数更新方向是：',
      options: ['沿梯度方向', '沿负梯度方向', '垂直于梯度方向', '沿Hessian矩阵方向'],
      answer: 1,
      explanation: '梯度指向函数值上升最快的方向，因此梯度下降沿负梯度方向（下降最快方向）更新参数。',
      knowledgePoint: '梯度下降法'
    },
    {
      id: 's5-q2', type: 'single', chapter: 's5-optimize', difficulty: 1,
      question: '学习率η设置过大可能导致什么后果？',
      options: ['收敛速度变慢', '梯度消失', '损失函数值振荡甚至发散', 'Hessian矩阵不可逆'],
      answer: 2,
      explanation: '学习率过大时，参数更新步长过大，可能跳过最优解，导致损失函数在最小值附近来回振荡甚至越来越大（发散）。',
      knowledgePoint: '梯度下降法'
    },
    {
      id: 's5-q3', type: 'single', chapter: 's5-optimize', difficulty: 2,
      question: '随机梯度下降(SGD)相较于批梯度下降(Batch GD)的主要优势是：',
      options: [
        '每次更新的梯度更准确',
        '收敛曲线更平滑',
        '每次迭代计算量更小，适合大规模数据',
        '不需要设置学习率'
      ],
      answer: 2,
      explanation: 'SGD每次仅用少量样本计算梯度，计算量$O(d)$远小于批GD的$O(nd)$。代价是梯度估计有噪声（方差），但噪声也有助于逃离局部最优。',
      knowledgePoint: '随机梯度下降与动量法'
    },
    {
      id: 's5-q4', type: 'single', chapter: 's5-optimize', difficulty: 2,
      question: '动量法(Momentum)中，动量系数β通常设为：',
      options: ['0.1', '0.5', '0.9', '1.5'],
      answer: 2,
      explanation: 'β=0.9是动量法最常用的默认值。β控制历史梯度在速度中的衰减速度，β越接近1，速度"惯性"越大。',
      knowledgePoint: '随机梯度下降与动量法'
    },
    {
      id: 's5-q5', type: 'single', chapter: 's5-optimize', difficulty: 2,
      question: '牛顿法的收敛阶数是：',
      options: ['线性的 (Linear)', '超线性的 (Superlinear)', '二次的 (Quadratic)', '三次的 (Cubic)'],
      answer: 2,
      explanation: '在适当的正则条件下（初始点充分接近最优解，Hessian正定且Lipschitz连续），牛顿法具有二次收敛速度——误差的平方级别减小，是收敛最快的优化方法之一。',
      knowledgePoint: '牛顿法与拟牛顿法'
    },
    {
      id: 's5-q6', type: 'multi', chapter: 's5-optimize', difficulty: 3,
      question: '关于L-BFGS算法，以下哪些说法是正确的？（多选）',
      options: [
        'L-BFGS不需要显式计算和存储完整的Hessian矩阵',
        'L-BFGS通过存储最近的m对(s,y)向量来近似Hessian的逆',
        'L-BFGS的内存复杂度为$O(md)$，其中$m$通常取3-20',
        'L-BFGS具有二次收敛速度（与牛顿法相同）',
        'L-BFGS适用于大规模优化问题（参数维度d很大时）'
      ],
      answer: [0, 1, 2, 4],
      explanation: 'L-BFGS仅具有超线性收敛，而非二次收敛（牛顿法的完全Hessian信息才能保证二次收敛）。但L-BFGS的内存和计算开销远小于牛顿法，适合大规模问题。',
      knowledgePoint: '牛顿法与拟牛顿法'
    },
    {
      id: 's5-q7', type: 'multi', chapter: 's5-optimize', difficulty: 2,
      question: '以下哪些是学习率衰减的常用策略？（多选）',
      options: [
        '逆时衰减：$\\eta_t = \\eta_0/(1+\\alpha t)$',
        '阶梯衰减：每k轮将学习率乘以γ(<1)',
        '指数衰减：使用常数学习率',
        '余弦退火：η_t按余弦函数从大到小变化',
        '循环学习率：在最大值和最小值之间循环变化'
      ],
      answer: [0, 1, 3, 4],
      explanation: '常数学习率不是衰减策略。其余四种均为常用策略：逆时衰减平滑、阶梯衰减简单、余弦退火适合fine-tuning、循环学习率在训练过程中反复升降以探索不同区域。',
      knowledgePoint: '梯度下降法'
    },
    {
      id: 's5-q8', type: 'multi', chapter: 's5-optimize', difficulty: 3,
      question: '关于坐标下降法(Coordinate Descent)，以下哪些是正确的？（多选）',
      options: [
        '每次只优化一个坐标方向',
        '对Lasso问题的每个坐标子问题有闭式解（软阈值算子）',
        '收敛速度与牛顿法相同',
        '不需要计算整个梯度或Hessian矩阵',
        'GLMNET等高效Lasso求解器采用坐标下降作为核心算法'
      ],
      answer: [0, 1, 3, 4],
      explanation: '坐标下降法收敛速度通常为线性的，远低于牛顿法的二次收敛。但其每次迭代开销极小（单变量子问题），且内存需求低，在大规模稀疏问题上非常高效。',
      knowledgePoint: '坐标下降法'
    },
    {
      id: 's5-q9', type: 'truefalse', chapter: 's5-optimize', difficulty: 1,
      question: '凸函数上的梯度下降法一定收敛到全局最优解。',
      options: ['正确', '错误'],
      answer: 0,
      explanation: '正确。对于凸函数，任何局部最优即是全局最优。梯度下降（配合适当的学习率）保证收敛到全局最优。',
      knowledgePoint: '优化问题基础'
    },
    {
      id: 's5-q10', type: 'truefalse', chapter: 's5-optimize', difficulty: 1,
      question: '牛顿法每次迭代的计算复杂度与梯度下降法相同。',
      options: ['正确', '错误'],
      answer: 1,
      explanation: '错误。牛顿法每次需要计算和求逆d×d的Hessian矩阵，复杂度$O(d^3)$，而梯度下降仅需$O(d)$。这就是为什么深度学习很少使用原始牛顿法。',
      knowledgePoint: '牛顿法与拟牛顿法'
    },
    {
      id: 's5-q11', type: 'truefalse', chapter: 's5-optimize', difficulty: 2,
      question: '软阈值算子$S_\\lambda(z)=\\operatorname{sign}(z)\\cdot\\max(|z|-\\lambda,0)$是Lasso坐标下降的核心：当$|z|\\leq\\lambda$时系数精确归零。',
      options: ['正确', '错误'],
      answer: 0,
      explanation: '正确。软阈值算子将$[-\\lambda,\\lambda]$内的$z$直接映射为0，这是L1正则化产生稀疏解的根本原因——只有足够强的信号($|z|>\\lambda$)才能获得非零系数。',
      knowledgePoint: '坐标下降法'
    },
    {
      id: 's5-q12', type: 'fill', chapter: 's5-optimize', difficulty: 2,
      question: '在凸优化中，若函数在$\\theta^*$处的梯度为零，即 $\\nabla J(\\theta^*)=0$，则$\\theta^*$是____最优解。',
      answer: '全局',
      explanation: '对于凸函数，梯度为零是一阶最优性条件，且由于凸函数的局部最优即全局最优，$\\nabla J(\\theta^*)=0$意味着$\\theta^*$是全局最优解。',
      knowledgePoint: '优化问题基础'
    },
    {
      id: 's5-q13', type: 'fill', chapter: 's5-optimize', difficulty: 2,
      question: 'SGD的梯度估计包含噪声，但噪声的____为零，即$\\mathbb{E}[\\nabla J_i(\\theta)] = \\nabla J(\\theta)$，因此SGD在期望意义上是正确的。',
      answer: '期望',
      explanation: 'SGD使用随机样本的梯度作为全量梯度的无偏估计。虽然每个mini-batch的梯度有噪声，但噪声的期望为零，保证SGD在期望方向上正确下降。',
      knowledgePoint: '随机梯度下降与动量法'
    },
    {
      id: 's5-q14', type: 'code-analysis', chapter: 's5-optimize', difficulty: 3,
      question: '分析以下Rosenbrock函数优化代码，为什么SGD+Momentum比纯SGD收敛快得多？',
      code: 'def rosenbrock(x): return (1-x[0])**2 + 100*(x[1]-x[0]**2)**2\n# SGD (β=0): 3000步到达 (0.876, 0.767), f=1.53e-2\n# Momentum (β=0.9): 3000步到达 (0.999, 0.997), f=1.69e-6',
      output: 'Momentum的f值比SGD小约4个数量级',
      analysisPoints: [
        'Rosenbrock函数具有狭长的弯曲山谷形状(banana function)',
        '纯SGD沿陡峭方向来回振荡(zigzag)，沿谷底方向推进缓慢',
        '动量法累积了沿谷底方向的历史梯度（持续同号→加速），抑制了垂直方向的振荡（符号交替→抵消）',
        '物理类比：动量像小球滚下山谷，在平坦方向持续加速，在陡峭方向因来回振荡而净位移小'
      ]
    },
    {
      id: 's5-q15', type: 'algo-judge', chapter: 's5-optimize', difficulty: 3,
      question: '关于以下优化算法的比较，选出所有正确的陈述：',
      options: [
        '梯度下降每次迭代计算全量梯度，收敛曲线光滑但计算量大',
        '牛顿法使用Hessian矩阵的逆，收敛快但不能用于非凸函数',
        'L-BFGS在内存和收敛速度之间取得较好的平衡，适合中等规模问题',
        '坐标下降法对所有类型的损失函数都有效',
        'Adam优化器综合了动量和自适应学习率的优点，是目前深度学习中最主流的优化器之一'
      ],
      answer: [0, 2, 4],
      explanation: '牛顿法可用于非凸函数但可能收敛到局部最优(或鞍点)。坐标下降法对非光滑可分函数(如Lasso)特别有效，但并非适用于所有损失函数。',
      knowledgePoint: '优化方法综述'
    },
    {
      id: 's5-q16', type: 'single', chapter: 's5-optimize', difficulty: 2,
      question: 'Adam优化器结合了哪两种方法的优点？',
      options: [
        '牛顿法 + 坐标下降法',
        '动量法(Momentum) + 自适应学习率(RMSprop)',
        'BFGS + 共轭梯度法',
        '模拟退火 + 遗传算法'
      ],
      answer: 1,
      explanation: 'Adam(Adaptive Moment Estimation)维护一阶动量mₜ(指数移动平均的梯度)和二阶动量vₜ(指数移动平均的梯度平方)。mₜ提供动量加速，vₜ实现逐参数自适应学习率。',
      knowledgePoint: '随机梯度下降与动量法'
    },
    {
      id: 's5-q17', type: 'single', chapter: 's5-optimize', difficulty: 2,
      question: '若函数f(x)的Hessian矩阵在所有点都是半正定的，则f(x)是：',
      options: [
        '严格凸函数',
        '凸函数',
        '凹函数',
        '非凸函数'
      ],
      answer: 1,
      explanation: 'Hessian半正定(∇²f⪰0)是凸函数的二阶条件。若Hessian严格正定(∇²f≻0)，则是严格凸函数（如f(x)=x²）。凹函数的Hessian半负定。',
      knowledgePoint: '优化问题基础'
    },
    {
      id: 's5-q18', type: 'multi', chapter: 's5-optimize', difficulty: 3,
      question: '比较DFP和BFGS两种拟牛顿法，以下哪些是正确的？（多选）',
      options: [
        '两者都通过迭代更新Hessian逆的近似矩阵，避免直接计算Hessian',
        'BFGS使用rank-2更新公式，数值稳定性优于DFP的rank-2更新',
        'L-BFGS是BFGS的有限内存版本，只存储最近的m对向量',
        '拟牛顿法保持了牛顿法的二次收敛速度',
        'BFGS是目前公认最有效的拟牛顿法之一，在scipy.optimize.minimize中为默认方法'
      ],
      answer: [0,1,2,4],
      explanation: '拟牛顿法具有超线性收敛而非二次收敛。BFGS在实践中几乎总是优于DFP（更好的自校正性质和舍入误差容忍度），因此成为标准选择。',
      knowledgePoint: '牛顿法与拟牛顿法'
    },
    {
      id: 's5-q19', type: 'multi', chapter: 's5-optimize', difficulty: 2,
      question: '以下哪些因素会影响SGD的收敛速度和最终精度？（多选）',
      options: [
        'Batch Size（批次大小）',
        '学习率及其衰减策略',
        '参数初始化的方式',
        '损失函数的Lipschitz常数',
        '训练数据的排列顺序（Shuffle）'
      ],
      answer: [0,1,2,3,4],
      explanation: '以上全部影响SGD。小batch引入更多噪声但可能帮助逃离鞍点；合适的学习率衰减可平衡收敛速度和精度；好的初始化（如Xavier/He）减轻梯度消失/爆炸；Lipschitz常数影响梯度有界性；Shuffle确保每epoch的梯度无偏。',
      knowledgePoint: '随机梯度下降与动量法'
    },
    {
      id: 's5-q20', type: 'truefalse', chapter: 's5-optimize', difficulty: 1,
      question: '梯度检验(Gradient Checking)通过数值微分 ∂J/∂θᵢ≈[J(θ+εeᵢ)-J(θ-εeᵢ)]/(2ε) 来验证解析梯度的正确性，是调试优化算法的常用手段。',
      options: [
        '正确',
        '错误'
      ],
      answer: 0,
      explanation: '正确。中心差分公式的误差为O(ε²)，优于前向差分的O(ε)。典型ε=10⁻⁴~10⁻⁶。若解析梯度与数值梯度的相对误差>10⁻³，说明实现可能有bug。',
      knowledgePoint: '梯度下降法'
    },
    {
      id: 's5-q21', type: 'truefalse', chapter: 's5-optimize', difficulty: 2,
      question: '增加batch size总是能提高SGD的收敛速度，因为梯度估计更准确。',
      options: [
        '正确',
        '错误'
      ],
      answer: 1,
      explanation: '不完全正确。大batch梯度确实更准确（方差更小），但每次更新计算量大增。更重要的是，小batch的梯度噪声实际上有助于逃离鞍点和局部最优。实践中中等batch(32-256)通常在速度和泛化性能之间取得最佳平衡。',
      knowledgePoint: '随机梯度下降与动量法'
    },
    {
      id: 's5-q22', type: 'fill', chapter: 's5-optimize', difficulty: 2,
      question: '在深度学习训练中，常用的学习率衰减策略之一是：每经过k个epoch，将学习率乘以一个小于1的因子γ。这种策略称为____衰减。',
      answer: "阶梯 (Step)",
      explanation: '阶梯衰减(Step Decay)简单直接：η←γ·η每k步。典型的γ=0.1，k=30epoch。优点是易于调试理解，缺点是衰减时机需要人工设定。',
      knowledgePoint: '梯度下降法'
    },
    {
      id: 's5-q23', type: 'fill', chapter: 's5-optimize', difficulty: 3,
      question: '对于强凸函数，梯度下降以____收敛速度收敛（线性收敛），其中收敛因子取决于函数的条件数κ=λmax/λmin。条件数越大，收敛越慢。',
      answer: "线性 (Linear)",
      explanation: '强凸函数的梯度下降误差满足∥θₖ-θ*∥≤(1-1/κ)ᵏ∥θ₀-θ*∥，收敛速度为线性的。条件数κ大→Hessian特征值分布广→损失函数曲面呈狭长山谷→梯度下降走Z字形缓慢前进。',
      knowledgePoint: '优化问题基础'
    },
    {
      id: 's5-q24', type: 'code-analysis', chapter: 's5-optimize', difficulty: 3,
      question: '以下代码对比了SGD的不同batch size对训练loss下降曲线的影响。为什么batch=1时loss震荡剧烈但下降快，batch=1000时loss平滑但最终精度低？',
      code: 'for batch_size in [1, 32, 1000]:\n    losses = []\n    for epoch in range(100):\n        for batch in data_loader(batch_size):\n            loss = compute_loss(batch); loss.backward()\n            optimizer.step()\n        losses.append(loss.item())\n# batch=1:  震荡剧烈, 最终loss=0.032\n# batch=32: 适度震荡, 最终loss=0.012\n# batch=1000:非常平滑, 最终loss=0.028',
      output: '中等batch(32)在训练速度和最终精度间取得最佳平衡',
      analysisPoints: [
        'batch=1时每个样本更新一次，梯度噪声极大→loss曲线剧烈震荡，但噪声帮助逃离局部最优',
        'batch=1000时梯度估计很准但更新频率低（100 epoch仅更新少量次），且缺乏噪声导致收敛到较差的次优解',
        'batch=32在两者间平衡：足够的更新频率+适中的梯度噪声→兼有快速收敛和良好泛化',
        '这体现了"随机梯度下降"中"随机"的价值——适量噪声是优化过程中的一种隐式正则化'
      ],
      answer: undefined,
      explanation: '',
      knowledgePoint: 'undefined'
    },
    {
      id: 's5-q25', type: 'algo-judge', chapter: 's5-optimize', difficulty: 3,
      question: '关于以下优化算法的适用场景，选出所有正确的陈述：',
      options: [
        '当参数维度d极大（如深度学习，d>10⁶）时，牛顿法和BFGS因O(d²)内存需求而不适用，应使用SGD/Adam',
        '当目标函数计算代价极高（如超参数调优）时，贝叶斯优化比梯度下降更合适',
        'L-BFGS-B是处理大规模有界约束优化问题的有效方法（scipy中method="L-BFGS-B"）',
        '共轭梯度法在二次函数上最多d步精确收敛，内存需求与SGD相同为O(d)',
        'Nelder-Mead单纯形法不需要梯度信息，适合导数难以计算或不可导的函数'
      ],
      answer: [0,1,2,3,4],
      explanation: '所有选项均正确。实际问题中根据维度、可导性、约束条件、计算代价选择合适的优化方法。没有一种方法在所有场景下都是最优的。',
      knowledgePoint: '优化方法综述'
    }

  ],

  's6-supervised': [
    {
      id: 's6-q1', type: 'single', chapter: 's6-supervised', difficulty: 1,
      question: '监督学习的核心目标是什么？',
      options: [
        '发现数据中的隐藏模式',
        '从带标签数据中学习从输入到输出的映射',
        '降低数据的维度',
        '生成新的样本数据'
      ],
      answer: 1,
      explanation: '监督学习从(X,y)训练数据中学习映射f: X→y，目标是使f在未见数据上也有良好的预测表现（泛化）。',
      knowledgePoint: '监督学习概述'
    },
    {
      id: 's6-q2', type: 'single', chapter: 's6-supervised', difficulty: 1,
      question: '线性回归的普通最小二乘(OLS)估计的闭式解是什么？',
      options: [
        '$\\hat{\\beta} = (X^\\top X) X^\\top y$',
        '$\\hat{\\beta} = (X^\\top X)^{-1} X^\\top y$',
        '$\\hat{\\beta} = X (X^\\top X)^{-1} y$',
        '$\\hat{\\beta} = (X^\\top X)^{-1} y$'
      ],
      answer: 1,
      explanation: 'OLS最小化$\\|\\mathbf{y}-\\mathbf{X}\\beta\\|^2$，对$\\beta$求导并设为零得到正规方程$\\mathbf{X}^\\top\\mathbf{X}\\hat{\\beta}=\\mathbf{X}^\\top\\mathbf{y}$，解得$\\hat{\\beta}=(\\mathbf{X}^\\top\\mathbf{X})^{-1}\\mathbf{X}^\\top\\mathbf{y}$（当$\\mathbf{X}^\\top\\mathbf{X}$可逆时）。',
      knowledgePoint: '线性回归'
    },
    {
      id: 's6-q3', type: 'single', chapter: 's6-supervised', difficulty: 2,
      question: 'R²（决定系数）为0.85意味着：',
      options: [
        '模型准确率为85%',
        '模型解释了85%的响应变量方差',
        '85%的系数是显著的',
        '模型残差的标准差为0.15'
      ],
      answer: 1,
      explanation: 'R²=1−RSS/TSS，衡量模型解释的因变量方差比例。R²=0.85表示模型特征解释了85%的y的方差，剩余15%是残差方差。',
      knowledgePoint: '线性回归'
    },
    {
      id: 's6-q4', type: 'single', chapter: 's6-supervised', difficulty: 2,
      question: 'Lasso回归（L1正则化）相较于Ridge回归（L2正则化）最重要的优势是：',
      options: ['计算速度更快', '可以产生稀疏解（特征选择）', '总是有更低的预测误差', '不需要选择正则化参数λ'],
      answer: 1,
      explanation: 'L1正则化的几何性质（菱形约束区域）使最优解容易落在坐标轴上，即将某些系数精确压缩为0。这是Lasso实现自动特征选择的核心机制。',
      knowledgePoint: '正则化：Ridge、Lasso与Elastic Net'
    },
    {
      id: 's6-q5', type: 'single', chapter: 's6-supervised', difficulty: 2,
      question: 'SVM中的"支持向量"是指：',
      options: [
        '所有训练样本',
        '被正确分类的样本',
        '离决策边界最近的训练样本',
        '被误分类的训练样本'
      ],
      answer: 2,
      explanation: '支持向量是距离分类超平面最近的那些样本点。只有支持向量决定了最终的超平面位置和方向——删除其他样本不会改变分类器。',
      knowledgePoint: '支持向量机 (SVM)'
    },
    {
      id: 's6-q6', type: 'multi', chapter: 's6-supervised', difficulty: 2,
      question: '偏差-方差分解中，预测误差由哪些部分构成？（多选）',
      options: [
        '偏差平方 (Bias²)',
        '方差 (Variance)',
        '不可约误差 (Irreducible Error)',
        '学习率',
        '样本量n'
      ],
      answer: [0, 1, 2],
      explanation: '$\\mathbb{E}[(y-\\hat{f})^2] = \\text{Bias}^2 + \\text{Variance} + \\sigma^2_\\varepsilon$。偏差度量模型平均预测与真相的差距，方差度量模型对训练数据的敏感性，$\\sigma^2_\\varepsilon$是数据固有的噪声方差。',
      knowledgePoint: '监督学习概述'
    },
    {
      id: 's6-q7', type: 'multi', chapter: 's6-supervised', difficulty: 3,
      question: '关于Elastic Net正则化，以下哪些说法是正确的？（多选）',
      options: [
        'Elastic Net是L1和L2正则化的凸组合',
        '当特征高度相关时，Elastic Net倾向于选择整组相关特征，而Lasso可能只随机选一个',
        'Elastic Net不能产生稀疏解',
        '参数α控制L1和L2的混合比例',
        '当α=1时Elastic Net退化为Lasso'
      ],
      answer: [0, 1, 3, 4],
      explanation: 'Elastic Net也能产生稀疏解（因为包含L1项）。其关键优势在于：对高度相关特征组，Lasso随机选择其一，而Elastic Net倾向于一起选入或剔除，这在基因表达等应用中非常重要。',
      knowledgePoint: '正则化：Ridge、Lasso与Elastic Net'
    },
    {
      id: 's6-q8', type: 'multi', chapter: 's6-supervised', difficulty: 2,
      question: '关于SVM中的核函数(Kernel Function)，以下哪些说法正确？（多选）',
      options: [
        '核函数计算的是高维特征空间中样本的内积',
        '使用核函数需要显式计算高维特征映射',
        'RBF核$K(x_i,x_j)=\\exp(-\\gamma\\|x_i-x_j\\|^2)$可以处理非线性可分数据',
        '选择合适的核函数和参数对SVM性能至关重要',
        '线性核是RBF核的特例'
      ],
      answer: [0, 2, 3],
      explanation: '核技巧的核心优势在于不需要显式计算高维映射——所有计算通过核函数在原始空间完成。线性核不是RBF核的特殊情况（但当$\\gamma\\to 0$时RBF核的泰勒展开的一阶项是线性的）。',
      knowledgePoint: '支持向量机 (SVM)'
    },
    {
      id: 's6-q9', type: 'truefalse', chapter: 's6-supervised', difficulty: 1,
      question: '5折交叉验证将数据随机分为5份，每次用4份训练、1份验证，最终取5次验证结果的平均值作为性能估计。',
      options: ['正确', '错误'],
      answer: 0,
      explanation: '正确。这是K折交叉验证的标准做法（K=5）。每份数据恰好被用作验证集一次，最终性能为5次验证的平均。',
      knowledgePoint: '模型评估与验证'
    },
    {
      id: 's6-q10', type: 'truefalse', chapter: 's6-supervised', difficulty: 1,
      question: 'F1分数是精确率(Precision)和召回率(Recall)的算术平均值。',
      options: ['正确', '错误'],
      answer: 1,
      explanation: '错误。F1是精确率和召回率的调和平均值：F1=2PR/(P+R)。调和平均比算术平均更接近较小值，因此F1对两个指标同时要求较高（惩罚极端不平衡）。',
      knowledgePoint: '模型评估与验证'
    },
    {
      id: 's6-q11', type: 'truefalse', chapter: 's6-supervised', difficulty: 2,
      question: '当特征数p大于样本数n时，普通最小二乘(OLS)的$\\hat{\\beta}=(X^\\top X)^{-1}X^\\top y$仍有唯一解。',
      options: ['正确', '错误'],
      answer: 1,
      explanation: '错误。当$p>n$时$\\mathbf{X}^\\top\\mathbf{X}$是$p\\times p$矩阵但秩最多为$n$（$<p$），因此不可逆。OLS无唯一解（有无穷多组$\\beta$使训练误差为0）。此时必须使用正则化方法（Ridge/Lasso等）。',
      knowledgePoint: '线性回归'
    },
    {
      id: 's6-q12', type: 'fill', chapter: 's6-supervised', difficulty: 2,
      question: 'AUC的全称是____，其取值为0.5时表示分类器性能等同于随机猜测。',
      answer: 'Area Under the ROC Curve (ROC曲线下面积)',
      explanation: 'AUC衡量的是：随机选取一个正样本和一个负样本，分类器给正样本更高分数的概率。AUC=1为完美分类，AUC=0.5为随机猜测。',
      knowledgePoint: '模型评估与验证'
    },
    {
      id: 's6-q13', type: 'fill', chapter: 's6-supervised', difficulty: 3,
      question: '当模型在训练集上误差很小但测试集上误差很大时，称为____；当模型在训练集和测试集上的误差都很大时，称为____。',
      answer: '过拟合(Overfitting)；欠拟合(Underfitting)',
      explanation: '过拟合：模型过度记忆训练数据的噪声和细节，泛化能力差。欠拟合：模型过于简单，无法捕获数据中的真实模式。最佳模型在两者之间取得平衡。',
      knowledgePoint: '监督学习概述'
    },
    {
      id: 's6-q14', type: 'code-analysis', chapter: 's6-supervised', difficulty: 3,
      question: '分析以下代码：为什么Lasso在p=100, n=50的情况下能正确识别出只有5个真实非零特征？',
      code: 'n, p = 50, 100  # 样本远少于特征\nX = np.random.randn(n, p)\ntrue_beta = np.zeros(p); true_beta[:5] = [3, -2, 1.5, 2.5, -1]\ny = X @ true_beta + noise\n\nlasso = Lasso(alpha=0.1).fit(X, y)\nnon_zero = np.sum(np.abs(lasso.coef_) > 1e-4)  # 结果: 8个非零（5个真+3个假）',
      output: 'Lasso找到了所有5个真实信号特征，并额外选了3个噪声特征',
      analysisPoints: [
        'L1正则化将大量弱信号（噪声特征）的系数压缩为0',
        '软阈值算子$S_\\lambda$使$|z|\\leq\\lambda$的系数精确归零',
        '$p\\gg n$场景下OLS完全不可行（$X^\\top X$不可逆），而Lasso通过正则化有效解决',
        '3个额外选入的噪声特征是因为有限样本下噪声可能与$y$有伪相关——随着$\\lambda$增大可进一步剔除'
      ]
    },
    {
      id: 's6-q15', type: 'flowchart', chapter: 's6-supervised', difficulty: 2,
      question: '以下是K折交叉验证的流程图。请填写空白步骤：',
      flowchart: {
        steps: [
          '输入: 数据集D, 折数K',
          '将D随机划分为K个大小相近的子集D_1, D_2, ..., D_K',
          'For i = 1, 2, ..., K:',
          '  训练: 使用除了____之外的所有数据训练模型',
          '  验证: 在____上计算性能指标 score_i',
          '最终性能 = ____ (汇总K次验证结果)',
          '输出: 平均性能估计及标准差'
        ]
      },
      blanks: ['D_i', 'D_i', 'mean(scores) 并可选报告 std(scores)'],
      explanation: '每折轮流作为验证集，其余作为训练集。最终报告K个score的均值和标准差——均值是泛化性能的估计，标准差反映模型的稳定性。',
      knowledgePoint: '模型评估与验证'
    },
    {
      id: 's6-q16', type: 'single', chapter: 's6-supervised', difficulty: 2,
      question: '在多元线性回归中，若两个预测变量高度相关（相关系数>0.9），最可能出现什么问题？',
      options: [
        '异方差性',
        '多重共线性（系数估计不稳定）',
        '自相关',
        '非线性关系'
      ],
      answer: 1,
      explanation: '多重共线性使XᵀX接近奇异，导致回归系数的方差膨胀（VIF>>1）。系数估计对数据微小变动极其敏感，可能出现符号反转或数量级异常。Ridge回归通过添加λI改善XᵀX的条件数是标准解决方案。',
      knowledgePoint: '线性回归'
    },
    {
      id: 's6-q17', type: 'single', chapter: 's6-supervised', difficulty: 2,
      question: '在SVM的软间隔(Soft Margin)分类中，参数C的作用是：',
      options: [
        '控制核函数的带宽',
        '平衡间隔宽度与训练误差（C越大，对误分类的惩罚越重）',
        '设置支持向量的最大数量',
        '指定特征空间的维数'
      ],
      answer: 1,
      explanation: 'C→∞时趋向硬间隔（不允许任何训练误差，可能过拟合）；C→0时允许大量误分类（间隔最宽，可能欠拟合）。C通过交叉验证选择。',
      knowledgePoint: '支持向量机 (SVM)'
    },
    {
      id: 's6-q18', type: 'multi', chapter: 's6-supervised', difficulty: 2,
      question: '关于ROC曲线和AUC，以下哪些说法是正确的？（多选）',
      options: [
        'ROC曲线以假阳性率(FPR)为横轴，真阳性率(TPR)为纵轴',
        'AUC=1表示完美分类，AUC=0表示完全颠倒的分类',
        'AUC对类别不平衡不敏感，因此在极端不平衡场景下应同时参考PR曲线',
        '随机猜测分类器的AUC=0.5',
        'AUC等于随机正样本得分高于随机负样本得分的概率'
      ],
      answer: [0,1,2,3,4],
      explanation: '所有选项均正确。AUC的统计解释：从正类随机抽一个样本、从负类随机抽一个样本，正样本的预测分数高于负样本的概率=ROC的AUC。这一解释使AUC具有直观的概率含义。',
      knowledgePoint: '模型评估与验证'
    },
    {
      id: 's6-q19', type: 'multi', chapter: 's6-supervised', difficulty: 3,
      question: '关于线性回归模型的假设检验，以下哪些是正确的？（多选）',
      options: [
        '残差的QQ图偏离对角线表明残差可能不服从正态分布',
        'Durbin-Watson统计量用于检测残差的自相关性',
        'Breusch-Pagan检验用于检测异方差性（残差方差不恒定）',
        '调整R²(Adjusted R²)对增加不显著的自变量有惩罚，因此比普通R²更适合模型比较',
        'VIF>10通常被认为是存在严重多重共线性的标志'
      ],
      answer: [0,1,2,3,4],
      explanation: '这五个诊断工具覆盖了线性回归的四大核心假设检验。残差诊断是建模后验证的重要步骤——仅看R²是不够的，违反假设可能导致标准误差和p值不可靠。',
      knowledgePoint: '线性回归'
    },
    {
      id: 's6-q20', type: 'truefalse', chapter: 's6-supervised', difficulty: 1,
      question: '在训练集上R²=0.99而在测试集上R²=0.55，这表明模型存在严重的过拟合。',
      options: [
        '正确',
        '错误'
      ],
      answer: 0,
      explanation: '正确。训练集与测试集性能的巨大差距是过拟合的典型标志。模型在训练时"记住了"训练数据的噪声而非学习真正的模式，导致泛化能力差。',
      knowledgePoint: '模型评估与验证'
    },
    {
      id: 's6-q21', type: 'truefalse', chapter: 's6-supervised', difficulty: 2,
      question: '标准化(Standardization)和归一化(Normalization)对基于距离度量的模型（如SVM、KNN）至关重要，但对树模型（如决策树、随机森林）几乎没有影响。',
      options: [
        '正确',
        '错误'
      ],
      answer: 0,
      explanation: '正确。树模型基于特征值的排序进行分裂，对单调变换（包括标准化/归一化）完全不变。而SVM的RBF核和KNN依赖欧氏距离，特征量纲差异会严重影响结果。',
      knowledgePoint: '监督学习概述'
    },
    {
      id: 's6-q22', type: 'fill', chapter: 's6-supervised', difficulty: 2,
      question: 'Ridge回归的损失函数为 $J(\beta) = \|y-X\beta\|^2 + \lambda\|\beta\|^2_2$，其闭式解为$\hat{\beta}_{ridge} = (X^\top X + \_\_\_)^{-1}X^\top y$。',
      answer: "λI",
      explanation: '$hat{eta}_{ridge}=(X^TX+lambda I)^{-1}X^Ty$。通过在主对角线上加λ，即使X^TX奇异或接近奇异，求逆也变得数值稳定。这就是Ridge解决多重共线性的核心机制。',
      knowledgePoint: '正则化：Ridge、Lasso与Elastic Net'
    },
    {
      id: 's6-q23', type: 'fill', chapter: 's6-supervised', difficulty: 2,
      question: '对于二分类问题，若TP=80, FP=20, FN=10, TN=90，则精确率Precision=____，召回率Recall=____。',
      answer: "80% (80/100)；88.9% (80/90)",
      explanation: 'Precision=TP/(TP+FP)=80/100=80%（预测为正的样本中有多少是正确的）。Recall=TP/(TP+FN)=80/90≈88.9%（真实正样本中被找出了多少）。',
      knowledgePoint: '模型评估与验证'
    },
    {
      id: 's6-q24', type: 'code-analysis', chapter: 's6-supervised', difficulty: 3,
      question: '以下代码绘制了Ridge和Lasso的系数路径图。为什么随着λ增大，Lasso的系数逐个归零，而Ridge的系数只是逐渐缩小？',
      code: 'alphas = np.logspace(-3, 3, 100)\nfor alpha in alphas:\n    ridge = Ridge(alpha=alpha).fit(X, y)\n    lasso = Lasso(alpha=alpha).fit(X, y)\n# Ridge: 所有系数平滑衰减，在λ很大时趋于0但不归零\n# Lasso: 系数逐个精确归零，λ越大非零系数越少',
      output: 'Lasso路径显示特征以不同λ阈值依次归零，Ridge路径所有系数同时衰减',
      analysisPoints: [
        '关键差异源于约束区域的几何形状：L1约束是菱形（轴对齐），L2约束是球形',
        '菱形顶点在坐标轴上——目标函数等高线容易先触及顶点，使某些系数精确归零',
        '球形表面处处光滑——等高线通常在非轴位置与球相切，系数非零但被均匀压缩',
        '这种L1产生稀疏解的性质使Lasso自动执行特征选择——λ越大选入的特征越少'
      ],
      answer: undefined,
      explanation: '',
      knowledgePoint: 'undefined'
    },
    {
      id: 's6-q25', type: 'algo-judge', chapter: 's6-supervised', difficulty: 3,
      question: '比较Ridge、Lasso和Elastic Net，选出所有正确的陈述：',
      options: [
        'Ridge(L2)在多重共线性下表现更好，但不能做特征选择',
        'Lasso(L1)可以产生稀疏解，但在p>n时最多只能选n个特征',
        'Elastic Net融合了L1和L2，倾向于选择整组相关特征而非随机选一个',
        'Ridge总是比Lasso的预测误差更小',
        '这三种方法都需要对特征进行标准化（否则正则化惩罚不公平）'
      ],
      answer: [0,1,2,4],
      explanation: 'Ridge不一定比Lasso预测更准——取决于真实模型是否稀疏。若真实只有少量特征有效，Lasso更优；若所有特征都有微弱贡献，Ridge可能更好。交叉验证选择。',
      knowledgePoint: '正则化：Ridge、Lasso与Elastic Net'
    }

  ],

  's7-tree': [
    {
      id: 's7-q1', type: 'single', chapter: 's7-tree', difficulty: 1,
      question: '决策树在以下哪个方面相较于神经网络具有显著优势？',
      options: ['预测准确率', '模型可解释性', '训练速度', '处理非线性关系的能力'],
      answer: 1,
      explanation: '决策树的最大优势是可解释性——预测逻辑可以直接转化为if-then规则，每个分裂节点对应一个可读的条件判断。这在需要模型可审计的领域（医疗、金融）尤为重要。',
      knowledgePoint: '决策树基础'
    },
    {
      id: 's7-q2', type: 'single', chapter: 's7-tree', difficulty: 1,
      question: '在二分类问题中，当节点中正负类样本各占一半时，基尼不纯度和信息熵分别取什么值？',
      options: [
        'Gini=0, Entropy=0',
        'Gini=0.5, Entropy=1.0',
        'Gini=1.0, Entropy=0.5',
        '两者都等于1'
      ],
      answer: 1,
      explanation: '$p=0.5$时：Gini$=1-0.5^2-0.5^2=0.5$，Entropy$=-0.5\\log_2(0.5)-0.5\\log_2(0.5)=1.0$。这是两者在均匀分布时的最大值——节点最不纯。',
      knowledgePoint: '分裂准则：基尼指数与信息熵'
    },
    {
      id: 's7-q3', type: 'single', chapter: 's7-tree', difficulty: 2,
      question: '在CART分类树中，默认使用的分裂准则是什么？',
      options: ['信息增益', '信息增益比', '基尼不纯度', '均方误差'],
      answer: 2,
      explanation: 'CART(Classification and Regression Tree)分类树默认使用基尼不纯度(Gini Impurity)作为分裂准则，因为Gini计算更简单（无对数运算），且在实际应用中的效果与熵几乎相同。',
      knowledgePoint: '分裂准则：基尼指数与信息熵'
    },
    {
      id: 's7-q4', type: 'single', chapter: 's7-tree', difficulty: 2,
      question: '成本复杂度剪枝(Cost Complexity Pruning)中，参数α控制什么？',
      options: [
        '树的最大深度',
        '每个内部节点所需的最小样本数',
        '模型复杂度与训练误差之间的权衡',
        '特征采样的比例'
      ],
      answer: 2,
      explanation: '$\\alpha$平衡$R_\\alpha(T)=R(T)+\\alpha|T|$中的两项。$\\alpha=0$不剪枝（全树），$\\alpha$增大则剪除更多分支。通常通过交叉验证选择最优$\\alpha$。',
      knowledgePoint: '剪枝与过拟合控制'
    },
    {
      id: 's7-q5', type: 'single', chapter: 's7-tree', difficulty: 2,
      question: '随机森林中"特征随机采样"通常每次分裂考虑多少个特征？（p为总特征数）',
      options: ['p (所有特征)', 'p/2', '√p (分类) 或 p/3 (回归)', '1个'],
      answer: 2,
      explanation: '随机森林对分类问题推荐√p个特征，对回归推荐p/3个。考虑的太少则每棵树太弱，太多则树之间相关性过高——在两者间取得平衡。',
      knowledgePoint: '随机森林'
    },
    {
      id: 's7-q6', type: 'multi', chapter: 's7-tree', difficulty: 2,
      question: '以下哪些是防止决策树过拟合的预剪枝(Pre-pruning)策略？（多选）',
      options: [
        '限制树的max_depth',
        '设置min_samples_split（节点最少样本数才能分裂）',
        '限制min_samples_leaf（叶节点最少样本数）',
        '训练完成后自底向上剪除分支',
        '限制max_leaf_nodes（最大叶节点数）'
      ],
      answer: [0, 1, 2, 4],
      explanation: '预剪枝在树生长过程中就施加限制。选项D描述的是后剪枝（先生成全树再剪）。预剪枝更高效但可能过早停止生长，后剪枝更精确但计算量更大。',
      knowledgePoint: '剪枝与过拟合控制'
    },
    {
      id: 's7-q7', type: 'multi', chapter: 's7-tree', difficulty: 3,
      question: '关于随机森林，以下哪些说法是正确的？（多选）',
      options: [
        '每棵树在Bootstrap样本上独立训练',
        'OOB(Out-of-Bag)估计可以作为无偏的泛化误差估计',
        '随机森林通过平均(Bagging)降低模型的偏差',
        '特征随机选择进一步增加了树之间的多样性',
        '增加树的数量总是能提高测试准确率'
      ],
      answer: [0, 1, 3],
      explanation: 'Bagging主要降低方差而非偏差（偏差由单个基学习器的复杂度决定）。树的数量增加到一定程度后OOB曲线平台（边际收益递减），继续增加不会显著提升性能但增加计算开销。',
      knowledgePoint: '随机森林'
    },
    {
      id: 's7-q8', type: 'truefalse', chapter: 's7-tree', difficulty: 1,
      question: '基尼不纯度(Gini Impurity)和信息熵在p=0.5时同时取最大值。',
      options: ['正确', '错误'],
      answer: 0,
      explanation: '正确。当正负类比例为50:50时节点最不纯，Gini和Entropy都达到最大值（分别为0.5和1.0）。',
      knowledgePoint: '分裂准则：基尼指数与信息熵'
    },
    {
      id: 's7-q9', type: 'truefalse', chapter: 's7-tree', difficulty: 2,
      question: '随机森林中每棵树都在整个数据集上训练，只是在分裂时随机选择特征。',
      options: ['正确', '错误'],
      answer: 1,
      explanation: '错误。随机森林有两层随机：1)每棵树在Bootstrap样本（有放回抽样，约63.2%的原始样本）上训练；2)每次分裂时随机选择特征子集。两者缺一不可。',
      knowledgePoint: '随机森林'
    },
    {
      id: 's7-q10', type: 'fill', chapter: 's7-tree', difficulty: 1,
      question: '决策树的终端节点称为____，它输出最终的预测值（分类为多数类，回归为样本均值）。',
      answer: '叶节点 (Leaf Node)',
      explanation: '叶节点不再分裂，包含一个预测值。从根到叶的路径对应一条完整的决策规则。',
      knowledgePoint: '决策树基础'
    },
    {
      id: 's7-q11', type: 'fill', chapter: 's7-tree', difficulty: 2,
      question: '在Bootstrap采样中，每个样本被选中的概率为$1/n$，$n$次有放回抽取后，一个样本从未被选中的概率约为____（提示：$\\lim_{n\\to\\infty}(1-1/n)^n = 1/e$）。',
      answer: '1/e ≈ 36.8%',
      explanation: '$P(\\text{未被选中}) = (1-1/n)^n \\to 1/e \\approx 0.368$。这意味着约36.8%的样本不在Bootstrap训练集中，这些OOB样本可以用来评估模型性能。',
      knowledgePoint: '随机森林'
    },
    {
      id: 's7-q12', type: 'code-analysis', chapter: 's7-tree', difficulty: 3,
      question: '分析以下代码输出，解释为什么max_depth=5的测试R²(0.7378)高于不限制深度的全树(0.6822)？',
      code: 'for depth in [1, 2, 3, 5, 10, None]:\n    dt = DecisionTreeRegressor(max_depth=depth)\n    dt.fit(X_train, y_train)\n    # depth=5:  train R²=0.9266, test R²=0.7378\n    # depth=None: train R²=0.9999, test R²=0.6822',
      output: '全树的训练R²接近1但测试R²反而更低',
      analysisPoints: [
        '不加限制的决策树完美拟合训练数据中的每一个噪声点（训练R²≈1），但完全丧失了泛化能力',
        '全树将特征空间划分到每个叶节点仅包含极少量样本，测试样本落入的叶节点均值极不稳定',
        '适度剪枝(depth=5)限制了模型复杂度，强制树学习数据的整体趋势而非记忆噪声',
        '训练R²和测试R²的差距随深度增大而拉大，这是过拟合的典型特征'
      ]
    },
    {
      id: 's7-q13', type: 'algo-judge', chapter: 's7-tree', difficulty: 3,
      question: '比较单棵决策树与随机森林，选出所有正确的陈述：',
      options: [
        '单棵决策树容易过拟合，随机森林通过集成大幅降低方差',
        '随机森林的OOB评分可以替代交叉验证进行模型评估',
        '决策树的可解释性优于随机森林（随机森林是黑箱）',
        '随机森林不能输出特征重要性',
        '增加随机森林中树的数量会无限提升性能'
      ],
      answer: [0, 1, 2],
      explanation: '随机森林可以通过特征重要性(feature_importances_)评估各特征的贡献。增加树数量有边际递减效应，超过一定数量后性能基本不变。',
      knowledgePoint: '树模型综合对比'
    },
    {
      id: 's7-q14', type: 'single', chapter: 's7-tree', difficulty: 2,
      question: 'C4.5算法使用信息增益比(Information Gain Ratio)而非信息增益作为分裂准则，主要原因是：',
      options: [
        '计算更快',
        '纠正信息增益对取值多的属性的偏好',
        '能够处理连续特征',
        '更容易剪枝'
      ],
      answer: 1,
      explanation: '信息增益倾向于选择取值数目多的属性（如ID列——每个样本唯一值，信息增益最大但完全无用）。信息增益比=信息增益/属性本身的熵，对多值属性施加惩罚。',
      knowledgePoint: '分裂准则：基尼指数与信息熵'
    },
    {
      id: 's7-q15', type: 'single', chapter: 's7-tree', difficulty: 2,
      question: '随机森林的OOB(Out-of-Bag)误差估计有什么优势？',
      options: [
        '比交叉验证更精确',
        '不需要单独的验证集，可作为无偏的泛化误差估计',
        '总是比测试误差更低',
        '可以替代训练过程'
      ],
      answer: 1,
      explanation: '每个样本约36.8%的概率不在任意单棵树的Bootstrap训练集中。用这些"未见过该样本"的树来预测，得到的OOB误差是真实泛化误差的无偏估计——无需划分验证集。',
      knowledgePoint: '随机森林'
    },
    {
      id: 's7-q16', type: 'multi', chapter: 's7-tree', difficulty: 2,
      question: '比较Bagging和Boosting，以下哪些说法正确？（多选）',
      options: [
        'Bagging的基学习器并行训练，Boosting的基学习器串行训练',
        'Bagging主要降低方差，Boosting主要降低偏差',
        'Bagging对异常值不敏感，Boosting对异常值更敏感',
        '随机森林属于Bagging家族，AdaBoost和GBDT属于Boosting家族',
        'Boosting总是比Bagging的准确率更高'
      ],
      answer: [0,1,2,3],
      explanation: 'Boosting并非总是更优——其在噪声数据上可能过度拟合噪声（AdaBoost对异常值敏感，GBDT通过subsample缓解）。选择取决于数据和问题。',
      knowledgePoint: '树模型综合对比'
    },
    {
      id: 's7-q17', type: 'multi', chapter: 's7-tree', difficulty: 3,
      question: '随机森林的特征重要性(Feature Importance)可以通过哪些方式计算？（多选）',
      options: [
        '基于不纯度减少：统计该特征在所有树的所有分裂中减少的不纯度之和',
        '基于排列重要度：随机打乱某特征的值，观察OOB误差的上升幅度',
        '基于系数的绝对值大小',
        '基于特征在树中出现的深度（越靠近根越重要）',
        'SHAP值：基于Shapley值的特征贡献分解'
      ],
      answer: [0,1,4],
      explanation: '不纯度减少(默认)简单快速但偏向高基数特征。排列重要度更稳健但计算量大。SHAP提供统一的理论框架。系数绝对值是线性模型的方法，不适用于树。深度不完全可靠。',
      knowledgePoint: '随机森林'
    },
    {
      id: 's7-q18', type: 'truefalse', chapter: 's7-tree', difficulty: 1,
      question: 'ID3算法使用信息增益选择分裂属性，且只能处理离散特征。CART使用Gini指数，可处理连续和离散特征。',
      options: [
        '正确',
        '错误'
      ],
      answer: 0,
      explanation: '正确。ID3(1986)是最早的决策树算法之一。CART(1984)使用二叉分裂（连续特征通过找最优切分点实现），更为通用。C4.5(1993)是ID3的改进版。',
      knowledgePoint: '决策树基础'
    },
    {
      id: 's7-q19', type: 'truefalse', chapter: 's7-tree', difficulty: 2,
      question: '决策树对训练数据的微小变化非常敏感——增减少量样本可能导致完全不同的分裂结构。这种不稳定性是集成方法（如随机森林）的动机之一。',
      options: [
        '正确',
        '错误'
      ],
      answer: 0,
      explanation: '正确。树的高方差(不稳定性)是高方差的来源——但这也使Bagging特别有效，因为对高方差、低偏差模型的集成平均能大幅降低方差。',
      knowledgePoint: '决策树基础'
    },
    {
      id: 's7-q20', type: 'fill', chapter: 's7-tree', difficulty: 2,
      question: '在CART回归树中，叶节点的预测值是落在该节点所有训练样本目标变量的____。分裂准则是最小化分裂后的____。',
      answer: "均值 (Mean)；均方误差 (MSE)",
      explanation: '回归树与分类树的核心区别：预测用均值而非多数类，分裂准则用MSE（或MAE）而非Gini/Entropy。其本质是分段常数回归。',
      knowledgePoint: '决策树基础'
    },
    {
      id: 's7-q21', type: 'fill', chapter: 's7-tree', difficulty: 2,
      question: '在sklearn的DecisionTreeClassifier中，参数ccp_alpha（cost complexity pruning alpha）越大，剪枝后的树越____（简单/复杂）。alpha=0时对应全树。',
      answer: "简单",
      explanation: 'ccp_alpha是成本复杂度剪枝的惩罚参数。目标为Rα(T)=R(T)+α·|T|，α增大惩罚复杂树，产生更少节点、更浅的树。通常通过交叉验证选最优α。',
      knowledgePoint: '剪枝与过拟合控制'
    },
    {
      id: 's7-q22', type: 'code-analysis', chapter: 's7-tree', difficulty: 3,
      question: '以下代码对比不同max_depth对决策边界的影响。为什么depth=1产生简单直线分割，depth=10产生极其复杂的锯齿边界？',
      code: 'for depth in [1, 3, 5, 10]:\n    tree = DecisionTreeClassifier(max_depth=depth)\n    tree.fit(X, y)\n    plot_decision_boundary(tree, X, y)\n# depth=1: 单条水平/垂直线\n# depth=5: 较为平滑的分段边界\n# depth=10: 复杂的锯齿状边界，包围了单个噪声点',
      output: '随着max_depth增加，决策边界越来越复杂，depth=10时明显过拟合',
      analysisPoints: [
        'depth=1时树只有一次分裂（根到两个叶），只能产生一条轴平行的分割线',
        '每增加一层深度，树可以将一个区域再分成两半——depth=k最多产生2ᵏ个矩形区域',
        'depth=10时每个叶节点可能只包含1-2个训练样本，决策边界"包裹"了所有噪声点',
        '高深度完美的训练拟合伴随极差的泛化——这是bias-variance tradeoff的经典体现'
      ],
      answer: undefined,
      explanation: '',
      knowledgePoint: 'undefined'
    },
    {
      id: 's7-q23', type: 'flowchart', chapter: 's7-tree', difficulty: 2,
      question: '以下是随机森林的构建流程。请填写空白步骤：',
      flowchart: {
        steps: [
          '输入: 训练数据D, 树的数量B, 每次分裂考虑的特征数m',
          'For b = 1, 2, ..., B:',
          '  步骤1: 从D中____（有放回抽样n次）得到训练集D_b',
          '  步骤2: 在D_b上训练一棵决策树，每次分裂时____随机选择m个特征',
          '  步骤3: 不剪枝，让树____',
          '预测: 分类用____，回归用平均',
          '评估: 使用____样本估计泛化误差'
        ]
      },
      blanks: [
        'Bootstrap采样',
        '从全部p个特征中',
        '完全生长(fully grown)',
        '多数投票',
        'OOB (Out-of-Bag)'
      ],
      answer: undefined,
      explanation: '两层随机化（Bootstrap样本+随机特征子集）是随机森林降低方差的核心。不剪枝的深树偏差低但方差高，集成后方差大幅降低。OOB误差是免费的无偏泛化估计。',
      knowledgePoint: '随机森林'
    },
    {
      id: 's7-q24', type: 'algo-judge', chapter: 's7-tree', difficulty: 3,
      question: '比较梯度提升树(GBDT)与随机森林(RF)，选出所有正确的陈述：',
      options: [
        'RF的树独立并行训练，GBDT的树串行训练（每棵树拟合前一棵的残差）',
        'GBDT使用弱学习器（浅树，如max_depth=3-6），RF通常使用深树甚至全树',
        'GBDT对超参数（学习率、树数量）更敏感，需要更仔细的调参',
        'XGBoost和LightGBM是GBDT的高效实现，增加了正则化和并行化优化',
        'GBDT总是比RF的泛化误差更低'
      ],
      answer: [0,1,2,3],
      explanation: 'GBDT并非总是优于RF。在中小数据集上RF通常更稳健（不易过拟合），在噪声较多的数据上RF往往表现更好。GBDT在有大量干净数据时优势明显。',
      knowledgePoint: '树模型综合对比'
    },
    {
      id: 's7-q25', type: 'single', chapter: 's7-tree', difficulty: 2,
      question: '在梯度提升(Gradient Boosting)中，每棵新树拟合的目标是什么？',
      options: [
        '原始目标变量y',
        '前一轮模型的预测值',
        '前一轮模型损失函数的负梯度（伪残差）',
        '训练数据的权重'
      ],
      answer: 2,
      explanation: 'GBDT的核心思想：每棵新树拟合损失函数关于当前模型预测的负梯度——即"残差"方向。对平方损失，负梯度恰好是y-F(x)；对分类的log损失，则是概率残差。',
      knowledgePoint: '树模型综合对比'
    }

  ],

  's8-unsupervised': [
    {
      id: 's8-q1', type: 'single', chapter: 's8-unsupervised', difficulty: 1,
      question: 'K-means聚类算法的目标是最小化什么？',
      options: [
        '簇间距离之和',
        '簇内平方和(WCSS)',
        '簇中心之间的距离',
        '每个样本到最远簇中心的距离'
      ],
      answer: 1,
      explanation: 'K-means最小化簇内平方和(WCSS)：$\\sum_k \\sum_{i\\in C_k} \\|x_i-\\mu_k\\|^2$，即每个样本到其所在簇中心的欧氏距离平方之和。',
      knowledgePoint: 'K-means聚类'
    },
    {
      id: 's8-q2', type: 'single', chapter: 's8-unsupervised', difficulty: 1,
      question: 'PCA（主成分分析）的第一个主成分(PC1)代表什么？',
      options: [
        '与所有原始特征相关性最大的方向',
        '数据方差最大的方向',
        '使分类准确率最高的方向',
        '与目标变量相关性最大的方向'
      ],
      answer: 1,
      explanation: 'PC1是数据方差最大的方向。PCA不利用标签信息（无监督），仅基于数据分布寻找方差最大化的投影方向。',
      knowledgePoint: '主成分分析 (PCA)'
    },
    {
      id: 's8-q3', type: 'single', chapter: 's8-unsupervised', difficulty: 2,
      question: '在PCA之前对特征进行标准化(Standardization)的主要原因是什么？',
      options: [
        '使计算更快速',
        '避免量纲大的特征主导主成分方向',
        '满足PCA的正态性假设',
        '使数据适合可视化'
      ],
      answer: 1,
      explanation: 'PCA对变量尺度敏感：若某特征方差极大（仅因量纲大），它将主导PC1方向。标准化(均值0方差1)使所有特征在PCA中具有同等的初始权重。',
      knowledgePoint: '主成分分析 (PCA)'
    },
    {
      id: 's8-q4', type: 'single', chapter: 's8-unsupervised', difficulty: 2,
      question: 't-SNE中"困惑度(Perplexity)"参数控制什么？',
      options: [
        '输出维度（2D或3D）',
        '迭代次数',
        '每个点的有效近邻数量（在高斯核的σ_i中体现）',
        '簇的数量'
      ],
      answer: 2,
      explanation: '困惑度大致对应每个点的有效邻居数量，通过调节每个点的高斯核带宽σ_i来实现。典型值5-50。困惑度太小只看到局部，太大则过度平滑。',
      knowledgePoint: 't-SNE可视化'
    },
    {
      id: 's8-q5', type: 'single', chapter: 's8-unsupervised', difficulty: 2,
      question: '肘部法则(Elbow Method)用于确定K-means的什么参数？',
      options: ['初始中心点', '最优K值（簇数）', '最大迭代次数', '距离度量方式'],
      answer: 1,
      explanation: '肘部法则绘制不同K下的WCSS曲线，WCSS随K增加单调递减但下降速率在"正确"的K处显著减缓——形成肘点。选择肘点对应的K作为最优簇数。',
      knowledgePoint: 'K-means聚类'
    },
    {
      id: 's8-q6', type: 'multi', chapter: 's8-unsupervised', difficulty: 2,
      question: '以下哪些是关于PCA的正确描述？（多选）',
      options: [
        'PCA是一种无监督的线性降维方法',
        '主成分之间是两两不相关的（正交的）',
        'PCA可以自动选择最优的主成分数量',
        '第k个主成分的方差等于协方差矩阵的第k大特征值',
        'PCA等同于对数据矩阵进行SVD分解'
      ],
      answer: [0, 1, 3, 4],
      explanation: 'PCA不能自动选择主成分数量——需要通过累积解释方差比例或碎石图的肘点来人工决定。PCA确实等价于数据中心化的SVD：$X=U\\Sigma V^\\top$，$XV=U\\Sigma$即主成分得分。',
      knowledgePoint: '主成分分析 (PCA)'
    },
    {
      id: 's8-q7', type: 'multi', chapter: 's8-unsupervised', difficulty: 3,
      question: '关于t-SNE和PCA的对比，以下哪些是正确的？（多选）',
      options: [
        't-SNE是非线性降维，PCA是线性降维',
        't-SNE适合将数据降到2D/3D进行可视化',
        't-SNE可以像PCA一样用作特征提取的预处理步骤',
        't-SNE结果的簇间距和簇大小有确定的物理含义',
        'PCA的结果是可复现的（确定性），t-SNE的结果依赖于随机初始化'
      ],
      answer: [0, 1, 4],
      explanation: 't-SNE是非参数映射（不能对新点做外推），不适合用于特征预处理。t-SNE图中的簇间距和簇大小没有直接的物理含义——不能仅凭距离判断簇的相似程度。PCA是确定性的（给定数据结果唯一），t-SNE有随机性。',
      knowledgePoint: 't-SNE可视化'
    },
    {
      id: 's8-q8', type: 'truefalse', chapter: 's8-unsupervised', difficulty: 1,
      question: 'K-means算法保证找到全局最优的聚类方案。',
      options: ['正确', '错误'],
      answer: 1,
      explanation: '错误。K-means(K-medians同理)仅保证收敛到局部最优。实际中通常用不同随机初始化运行多次，选择WCSS最小的结果（sklearn中n_init参数默认10）。',
      knowledgePoint: 'K-means聚类'
    },
    {
      id: 's8-q9', type: 'truefalse', chapter: 's8-unsupervised', difficulty: 1,
      question: 'PCA的主成分数量不能超过原始特征数量，也不能超过样本数量。',
      options: ['正确', '错误'],
      answer: 0,
      explanation: '正确。PC数量$\\leq\\min(n-1, p)$。协方差矩阵的秩最多为$\\min(n-1, p)$，因此非零特征值（对应非零方差的主成分）的数量也以此为上限。',
      knowledgePoint: '主成分分析 (PCA)'
    },
    {
      id: 's8-q10', type: 'truefalse', chapter: 's8-unsupervised', difficulty: 2,
      question: 't-SNE的降维结果可以直接用于下游的机器学习分类任务。',
      options: ['正确', '错误'],
      answer: 1,
      explanation: '错误。t-SNE是非参数的（学习的是一个特定的映射而非函数），不能对新数据点做外推预测。t-SNE仅适合探索性可视化，如需降维后训练分类器应使用PCA或自编码器。',
      knowledgePoint: 't-SNE可视化'
    },
    {
      id: 's8-q11', type: 'fill', chapter: 's8-unsupervised', difficulty: 2,
      question: '在PCA中，前k个主成分的累积解释方差比例达到____通常被认为是保留了足够的信息。',
      answer: '85%~95%',
      explanation: '这是一个经验法则。具体比例取决于应用需求：可视化通常只用2-3个PC；作为模型输入可能保留更多PC；信号数据(如EEG)可能需要95%以上。',
      knowledgePoint: '主成分分析 (PCA)'
    },
    {
      id: 's8-q12', type: 'fill', chapter: 's8-unsupervised', difficulty: 2,
      question: 'K-means算法交替执行两个步骤：____步骤（每个点分配给最近的簇中心）和____步骤（重新计算每个簇的中心位置）。',
      answer: '分配(Assignment)；更新(Update)',
      explanation: '两个步骤合称Lloyd算法。每次迭代保证WCSS不增，算法在有限步内收敛。交替优化框架是许多聚类和EM类算法的基础范式。',
      knowledgePoint: 'K-means聚类'
    },
    {
      id: 's8-q13', type: 'code-analysis', chapter: 's8-unsupervised', difficulty: 3,
      question: '分析以下t-SNE代码，为什么perplexity=5时能看到10个小簇但各簇之间关系不明显，而perplexity=100时所有簇混在一起？',
      code: 'for perp in [5, 30, 100]:\n    X_tsne = TSNE(n_components=2, perplexity=perp).fit_transform(X)\n    # perp=5: 紧密小簇，全局结构丢失\n    # perp=30: 均衡，簇清晰且全局关系可见\n    # perp=100: 簇边界模糊，部分类别重叠',
      output: '不同perplexity产生不同粒度的嵌入结果',
      analysisPoints: [
        'perplexity控制每个点的高斯核带宽——低perplexity意味着每个点只关注极少量近邻',
        'perp=5时算法主要保留非常局部的结构（微小邻域），丢失了全局的簇间关系',
        'perp=100时每个点关注大量邻居，算法试图保留更多的全局结构但牺牲了局部细节',
        't-SNE本身在不同perplexity下可能产生非常不同的结果，实践中建议尝试多个值'
      ]
    },
    {
      id: 's8-q14', type: 'flowchart', chapter: 's8-unsupervised', difficulty: 2,
      question: '以下是K-means聚类(Lloyd算法)的流程图。请填写空白步骤：',
      flowchart: {
        steps: [
          '输入: 数据集X, 簇数K, 最大迭代次数T',
          '初始化: 随机选择K个数据点作为____',
          '重复直到收敛或达到T轮:',
          '  分配步骤: 对每个x_i, 将它分配给____的簇中心',
          '  更新步骤: 对每个簇k, ____为簇内所有点的均值',
          '  检查收敛: 若____变化小于阈值则停止',
          '输出: K个簇的划分和簇中心'
        ]
      },
      blanks: ['初始簇中心', '距离最近', '更新簇中心', '簇中心'],
      explanation: 'K-means的Lloyd算法保证每轮WCSS单调递减。收敛判断通常使用簇中心的变化量（所有K个中心移动的距离之和<ε）或达到最大迭代次数。',
      knowledgePoint: 'K-means聚类'
    },
    {
      id: 's8-q15', type: 'single', chapter: 's8-unsupervised', difficulty: 2,
      question: '轮廓系数(Silhouette Score)的取值范围和含义是：',
      options: [
        '[0, 1]，越接近1聚类越好',
        '[-1, 1]，越接近1聚类越好',
        '[0, ∞)，越小越好',
        '[-∞, ∞]，需要结合领域知识判断'
      ],
      answer: 1,
      explanation: '轮廓系数s=(b-a)/max(a,b)，其中a是样本到同簇其他点的平均距离，b是到最近异簇的平均距离。s∈[-1,1]，接近1表示簇内紧致且簇间分离良好，接近-1表示样本可能被错分。',
      knowledgePoint: 'K-means聚类'
    },
    {
      id: 's8-q16', type: 'single', chapter: 's8-unsupervised', difficulty: 2,
      question: 'DBSCAN相较于K-means的主要优势是什么？',
      options: [
        '计算速度更快',
        '不需要预先指定簇的数量，且能发现任意形状的簇',
        '总是产生更准确的聚类结果',
        '对高维数据更有效'
      ],
      answer: 1,
      explanation: 'DBSCAN基于密度连通性，能发现任意形状的簇（K-means假设球形簇），且自动识别噪声点（不属于任何簇）。代价是参数ε和minPts需要调参，且对密度不均的数据效果差。',
      knowledgePoint: 'K-means聚类'
    },
    {
      id: 's8-q17', type: 'multi', chapter: 's8-unsupervised', difficulty: 3,
      question: '关于聚类结果的评估，以下哪些说法是正确的？（多选）',
      options: [
        '轮廓系数(Silhouette)是内部评估指标，不需要真实标签',
        '调整兰德指数(ARI)是外部评估指标，需要真实标签',
        'Davies-Bouldin指数越小表示聚类越好',
        'Calinski-Harabasz指数越大表示聚类越好',
        '聚类评估应该同时使用多个指标，因为不同指标衡量不同方面'
      ],
      answer: [0,1,2,3,4],
      explanation: '所有均正确。内部指标仅基于数据本身评估聚类质量（紧致性+分离性），外部指标与真实标签比较。不同指标偏好不同的簇形状和分布，综合使用可避免单一指标的偏见。',
      knowledgePoint: 'K-means聚类'
    },
    {
      id: 's8-q18', type: 'multi', chapter: 's8-unsupervised', difficulty: 2,
      question: '关于PCA的数学性质，以下哪些是正确的？（多选）',
      options: [
        'PCA等价于对数据中心化矩阵进行SVD分解',
        '主成分是原始特征的线性组合',
        'PCA变换后的特征（主成分得分）之间是线性无关的（协方差=0）',
        'PCA保留了数据的局部邻域结构',
        '可以通过累计解释方差比例来选择保留的主成分数量'
      ],
      answer: [0,1,2,4],
      explanation: 'PCA是全局线性方法，不保证保留局部邻域结构（这是t-SNE和UMAP的目标）。PCA追求全局方差最大化，可能破坏局部邻居关系。',
      knowledgePoint: '主成分分析 (PCA)'
    },
    {
      id: 's8-q19', type: 'truefalse', chapter: 's8-unsupervised', difficulty: 2,
      question: '因子分析(Factor Analysis)和PCA虽然都用于降维，但因子分析假设观测变量由潜在因子和特殊误差共同决定，而PCA仅是数据的线性变换。',
      options: [
        '正确',
        '错误'
      ],
      answer: 0,
      explanation: '正确。因子分析是一个概率生成模型：X=ΛF+ε，包含测量误差项ε。PCA则是确定性的方差最大化变换。因子分析常用于心理学量表构建，PCA常用于数据压缩和可视化。',
      knowledgePoint: '主成分分析 (PCA)'
    },
    {
      id: 's8-q20', type: 'truefalse', chapter: 's8-unsupervised', difficulty: 2,
      question: 'UMAP(Uniform Manifold Approximation and Projection)比t-SNE更好地保留了数据的全局结构，且运行速度更快，因此在单细胞RNA测序等高维数据分析中越来越受欢迎。',
      options: [
        '正确',
        '错误'
      ],
      answer: 0,
      explanation: '正确。UMAP基于黎曼几何和拓扑数据分析理论，在保持全局结构方面优于t-SNE。其运行速度比t-SNE快一个数量级以上（基于近似最近邻），且能外推到新数据点。',
      knowledgePoint: 't-SNE可视化'
    },
    {
      id: 's8-q21', type: 'fill', chapter: 's8-unsupervised', difficulty: 2,
      question: '在PCA中，协方差矩阵的第k大特征值λ_k等于第k个主成分的____。所有特征值之和等于原始数据的总方差。',
      answer: "方差 (Variance)",
      explanation: 'PCA的关键性质：λ_k=Var(PC_k)。因此解释方差比例=λ_k/∑λ_j。碎石图(Scree Plot)将特征值从大到小排列，通常寻找"拐点"确定保留的主成分数量。',
      knowledgePoint: '主成分分析 (PCA)'
    },
    {
      id: 's8-q22', type: 'fill', chapter: 's8-unsupervised', difficulty: 3,
      question: '对数据矩阵X(n×p)进行SVD分解：X=UΣV^T。其中U的列是____，Σ的对角元素是____，V的列是主成分方向（载荷向量）。',
      answer: "左奇异向量（或标准化PC得分）；奇异值（与特征值的关系：λ_k=σ_k²/n）",
      explanation: 'SVD与PCA的等价关系：XV=UΣ（PC得分矩阵），V的列是特征向量（载荷），σ_k²/n=λ_k（特征值）。SVD数值上更稳定，是PCA实现的首选方法。',
      knowledgePoint: '主成分分析 (PCA)'
    },
    {
      id: 's8-q23', type: 'code-analysis', chapter: 's8-unsupervised', difficulty: 3,
      question: '以下代码使用肘部法则确定最优K值。解释：(1)为什么WCSS随K增大单调递减？(2)如何从肘部曲线判断最优K？',
      code: 'K_range = range(1, 11)\nwcss = []\nfor k in K_range:\n    km = KMeans(n_clusters=k, n_init=10)\n    km.fit(X)\n    wcss.append(km.inertia_)\n# K=1: WCSS=8562  K=3: WCSS=2356  K=5: WCSS=1123  K=10: WCSS=234',
      output: '肘部在K≈3处出现——之后增加K带来的WCSS下降显著减缓',
      analysisPoints: [
        'K=1时所有点在一个簇，WCSS最大。随着K增大，簇变小更专业化→每个点到簇中心的距离减小→WCSS单调下降',
        '极限K=n时每个点自成簇→WCSS=0——但这毫无意义（完全过拟合）',
        '肘部(Elbow)是WCSS下降速率明显减弱的点——此后增加K的边际收益很小',
        'K=3的WCSS(2356)比K=2下降了很多，但K=4仅比K=3略微下降→肘点在K≈3'
      ],
      answer: undefined,
      explanation: '',
      knowledgePoint: 'undefined'
    },
    {
      id: 's8-q24', type: 'flowchart', chapter: 's8-unsupervised', difficulty: 2,
      question: '以下是PCA降维的标准流程。请填写空白步骤：',
      flowchart: {
        steps: [
          '输入: 数据矩阵X(n×p), 目标维度k',
          '步骤1: ____（使每列均值为0）',
          '步骤2: 计算____矩阵 Σ = X^T X / (n-1)',
          '步骤3: 对Σ进行特征分解，得到特征值λ₁≥λ₂≥...≥λ_p和对应的特征向量',
          '步骤4: 取前k个特征向量构成投影矩阵____',
          '步骤5: 计算主成分得分 Z = X_centered × ____',
          '输出: 降维后的数据Z (n×k) 及各主成分的解释方差比例'
        ]
      },
      blanks: [
        '数据中心化 (Center)',
        '协方差 (Covariance)',
        'V_k (p×k)',
        'V_k'
      ],
      answer: undefined,
      explanation: '标准化(使方差=1)在特征量纲不同时也至关重要——避免大方差特征主导PC1。实践中通常同时做centering和scaling。',
      knowledgePoint: '主成分分析 (PCA)'
    },
    {
      id: 's8-q25', type: 'algo-judge', chapter: 's8-unsupervised', difficulty: 3,
      question: '比较以下降维方法，选出所有正确的陈述：',
      options: [
        'PCA是线性的、确定性的，适合数据预处理和特征提取',
        't-SNE是非线性的、随机的，适合高维数据的2D/3D可视化但不宜用于特征工程',
        'UMAP兼顾了全局结构和局部结构，运行速度快于t-SNE，且支持新数据的外推',
        '自动编码器(Autoencoder)是神经网络的非线性降维方法，可用于生成式建模',
        '所有降维方法都要求对原始特征进行标准化'
      ],
      answer: [0,1,2,3],
      explanation: '并非所有降维方法都需要标准化——t-SNE和UMAP基于距离度量（受量纲影响需要），但自动编码器可以通过批归一化层自适应调整。PCA对尺度敏感必须标准化。',
      knowledgePoint: '降维方法综合'
    }

  ]
};
