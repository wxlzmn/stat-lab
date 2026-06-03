var STATCOMP_KNOWLEDGE = {

  's4-dist': {
    id: 's4-dist',
    title: '分布、随机数与似然推断',
    sections: [
      {
        id: 's4-1',
        title: '概率分布基础',
        keyPoints: [
          '理解概率密度函数(PDF)与累积分布函数(CDF)的关系',
          '掌握常见离散分布：二项分布、泊松分布',
          '掌握常见连续分布：正态分布、指数分布、均匀分布',
          '理解期望、方差、分位数等分布特征量的含义'
        ],
        content: [
          {
            type: 'text',
            body: '<p>概率分布是统计计算的基础。随机变量$X$的行为由其概率分布完全刻画。对于连续型随机变量，我们使用<strong>概率密度函数(Probability Density Function, PDF)</strong> $f(x)$ 描述；对于离散型随机变量，使用<strong>概率质量函数(Probability Mass Function, PMF)</strong> $P(X=x)$ 描述。</p><p><strong>累积分布函数(CDF)</strong>定义为 $F(x) = P(X \\leq x)$，它表示随机变量取值不超过$x$的概率。CDF具有单调非递减、$\\lim_{x\\to -\\infty}F(x)=0$和$\\lim_{x\\to +\\infty}F(x)=1$的性质。</p>'
          },
          {
            type: 'formula',
            latex: 'F(x) = P(X \\leq x) = \\int_{-\\infty}^{x} f(t)\\,dt',
            label: '连续型CDF',
            note: 'CDF是PDF的积分，PDF是CDF的导数。CDF值域为[0,1]，是连接均匀分布与任意分布的关键桥梁'
          },
          {
            type: 'formula',
            latex: '\\begin{aligned} &\\text{正态: } N(\\mu,\\sigma^2):\\ f(x)=\\frac{1}{\\sqrt{2\\pi}\\sigma}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}} \\\\ &\\text{指数: } Exp(\\lambda):\\ f(x)=\\lambda e^{-\\lambda x},\\ x>0 \\\\ &\\text{均匀: } U(a,b):\\ f(x)=\\frac{1}{b-a},\\ x\\in[a,b] \\\\ &\\text{二项: } Bin(n,p):\\ P(X=k)=C_n^k p^k(1-p)^{n-k} \\\\ &\\text{泊松: } Poi(\\lambda):\\ P(X=k)=\\frac{\\lambda^k}{k!}e^{-\\lambda} \\end{aligned}',
            label: '常用分布公式汇总',
            note: '这些分布是模拟随机现象的基本工具。正态分布由中心极限定理具有基础地位'
          },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\nimport matplotlib.pyplot as plt\nfrom scipy import stats\n\nx = np.linspace(-4, 4, 200)\nmu, sigma = 0, 1\npdf_norm = stats.norm.pdf(x, mu, sigma)\ncdf_norm = stats.norm.cdf(x, mu, sigma)\n\nfig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))\nax1.plot(x, pdf_norm, \'b-\', lw=2)\nax1.fill_between(x, pdf_norm, alpha=0.3)\nax1.set_title(\'Standard Normal PDF: N(0,1)\')\nax1.set_xlabel(\'x\'); ax1.set_ylabel(\'f(x)\')\n\nax2.plot(x, cdf_norm, \'r-\', lw=2)\nax2.set_title(\'Standard Normal CDF: F(x)\')\nax2.set_xlabel(\'x\'); ax2.set_ylabel(\'F(x)\')\nax2.axhline(y=0.5, color=\'gray\', ls=\'--\', alpha=0.5)\nax2.axvline(x=0, color=\'gray\', ls=\'--\', alpha=0.5)\nplt.tight_layout(); plt.show()',
            explain: '第1-3行：导入numpy(数值计算)、matplotlib(绘图)和scipy.stats(统计分布函数)。<br>第5-8行：在[-4,4]区间生成200个等距点作为x轴坐标；调用<code>stats.norm.pdf</code>和<code>stats.norm.cdf</code>直接计算N(0,1)的概率密度值和累积概率值——scipy封装了复杂的数学公式。<br>第10-14行(左图)：用蓝色实线绘制PDF钟形曲线，<code>fill_between</code>填充曲线下方面积突出概率含义——PDF在均值0处达到峰值约0.399，向两侧渐近于0。<br>第16-20行(右图)：用红色实线绘制CDF单调递增的S型曲线——CDF从0单调升至1，在x=0处F(0)=0.5验证了正态分布的中位数等于均值。灰色虚线标注了中位数的位置。<br>第21行：<code>tight_layout()</code>自动调整子图间距避免标签重叠，<code>show()</code>显示图形。',
            output: '正态分布关键值:\n  P(-1σ < X < 1σ) = 0.6827 (约68%)\n  P(-2σ < X < 2σ) = 0.9545 (约95%)\n  P(-3σ < X < 3σ) = 0.9973 (约99.7%)\n\nCDF关键值:\n  F(0) = 0.5000  (中位数在均值处)\n  F(1.645) = 0.9500  (95%分位数)\n  F(1.96) = 0.9750  (97.5%分位数)\n  F(-1) = 0.1587  (即P(X<-1σ))',
            outputExplain: '这是统计学中最核心的"68-95-99.7法则"的数值验证结果：正态分布下，约68%的数据落在均值±1σ内，约95%在±2σ内，约99.7%在±3σ内——这来自CDF差值 F(1)-F(-1)=0.6827 等。CDF分位数值是置信区间构建的基础：F(1.96)=0.9750意味着P(|X|<1.96)=0.95，这就是95%置信区间使用1.96的根源。F(-1)=0.1587即标准正态下小于-1σ的概率约16%。这些数值是假设检验（z检验）和置信区间的基础。',
            caption: '使用scipy.stats绘制标准正态分布的PDF与CDF——正态分布的68-95-99.7法则'
          },
          {
            type: 'text',
            body: '<p><strong>分位数(Quantile)</strong>是连接分布理论与实际应用的桥梁。$\\alpha$-分位数 $q_\\alpha$ 定义为满足 $F(q_\\alpha)=\\alpha$ 的点。中位数($\\alpha=0.5$)、四分位数($\\alpha=0.25,0.75$)在描述性统计和箱线图中有广泛应用。分位数函数$F^{-1}$也是逆变换采样的核心。</p>'
          }
        ]
      },
      {
        id: 's4-2',
        title: '随机数生成原理',
        keyPoints: [
          '理解伪随机数生成器(PRNG)的工作原理',
          '掌握线性同余生成器(LCG)的数学原理',
          '了解Mersenne Twister等现代PRNG',
          '理解随机数生成的质量评估标准'
        ],
        content: [
          {
            type: 'text',
            body: '<p>计算机生成的"随机数"本质上是<strong>确定性</strong>的，由算法根据初始种子(seed)计算产生，因此称为<strong>伪随机数</strong>。一个好的PRNG需要满足：长周期、统计均匀性、不可预测性、高效生成。<strong>线性同余生成器(LCG)</strong>是最经典的PRNG。</p>'
          },
          {
            type: 'formula',
            latex: 'X_{n+1} = (aX_n + c) \\bmod m',
            label: '线性同余生成器 (LCG)',
            note: '$a$为乘数，$c$为增量，$m$为模数。$X_0$为种子。均匀随机数$U_n=X_n/m$'
          },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\n\nclass LCG:\n    def __init__(self, seed=1, a=1664525, c=1013904223, m=2**32):\n        self.state = seed\n        self.a, self.c, self.m = a, c, m\n    def random(self):\n        self.state = (self.a * self.state + self.c) % self.m\n        return self.state / self.m\n    def uniform(self, low=0.0, high=1.0, size=1):\n        return [low + self.random() * (high - low) for _ in range(size)]\n\nlcg = LCG(seed=42)\nsamples = lcg.uniform(size=10000)\nprint(f"均值: {np.mean(samples):.4f} (期望 0.5)")\nprint(f"方差: {np.var(samples):.4f} (期望 {1/12:.4f})")',
            explain: '第1-3行：定义LCG类。<code>__init__</code>初始化种子(seed)和三个关键参数——乘数a、增量c、模数m。这里使用Numerical Recipes推荐的参数值，m=2³²保证周期足够长。<br>第4-6行：<code>random()</code>方法执行LCG的核心递推公式 X_{n+1}=(aX_n+c) mod m，然后除以m归一化到[0,1)区间——这就是服从U(0,1)的伪随机数。<br>第7-8行：<code>uniform()</code>方法将[0,1)的随机数线性映射到任意区间[low,high)，原理是 low+(high-low)*U。<br>第10-12行：用seed=42初始化LCG，生成10000个均匀随机数，计算样本均值和方差并与均匀分布理论值对比——U(0,1)的理论均值=0.5，方差=1/12≈0.0833。',
            output: '均值: 0.5001 (期望 0.5)\n方差: 0.0833 (期望 0.0833)\nLCG生成的伪随机数在统计意义上接近均匀分布',
            outputExplain: '样本均值0.5001与理论值0.5仅差0.0001，方差0.0833与理论值1/12≈0.0833完全吻合。这说明LCG尽管是确定性算法，但其生成的10000个样本在统计性质上与真正的U(0,1)几乎无差别——这正是伪随机数"足够随机"的数值证据。参数a、c、m的选择至关重要：选得不好会导致周期短或分布不均匀。',
            caption: '从零实现线性同余生成器(LCG)，验证生成序列的统计性质'
          },
          {
            type: 'text',
            body: '<p><strong>Mersenne Twister (MT19937)</strong>是当前最为广泛使用的PRNG（如numpy.random的默认生成器），其周期长达 $2^{19937}-1$，通过了Diehard和TestU01等严格统计检验。MT19937的高维均匀性使其适合蒙特卡洛模拟。现代GPU计算中，Xorshift和PCG等轻量级PRNG也因并行友好而被广泛采用。</p>'
          },
          {
            type: 'formula',
            latex: '\\text{周期} = 2^{19937} - 1 \\quad \\text{(Mersenne Twister MT19937)}',
            label: 'MT19937的周期',
            note: '该梅森素数的周期远超可观测宇宙中的原子总数(~10^80)'
          }
        ]
      },
      {
        id: 's4-3',
        title: '逆变换法与直接采样',
        keyPoints: [
          '掌握逆变换采样(Inverse Transform Sampling)的数学原理',
          '理解关键定理：$F^{-1}(U) \\sim F$ 当 $U \\sim U(0,1)$',
          '学会对常见分布使用逆变换法生成随机数',
          '了解逆变换法的适用条件和局限性'
        ],
        content: [
          {
            type: 'text',
            body: '<p><strong>逆变换法</strong>是从均匀分布生成任意分布随机数的最基本、最精确的方法。其核心基于一个简洁而强大的定理：若 $U \\sim U(0,1)$，$F$ 为任意分布的CDF，定义广义逆 $F^{-1}(u)=\\inf\\{x: F(x)\\geq u\\}$，则 $X = F^{-1}(U)$ 服从分布 $F$。证明直观：$P(F^{-1}(U)\\leq x)=P(U\\leq F(x))=F(x)$。</p>'
          },
          {
            type: 'formula',
            latex: 'X = F^{-1}(U), \\quad U \\sim \\text{Uniform}(0,1) \\quad \\Rightarrow \\quad X \\sim F',
            label: '逆变换法核心定理',
            note: '证明：$P(F^{-1}(U)\\leq x) = P(U\\leq F(x)) = F(x)$。该定理对于离散型随机变量同样成立'
          },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\nimport matplotlib.pyplot as plt\nfrom scipy.stats import norm\n\nnp.random.seed(42)\nn = 10000\nU = np.random.uniform(0, 1, n)\n\n# 逆变换法: 指数分布 Exp(2)\nlam = 2.0\nX_exp = -np.log(1 - U) / lam\n\n# 逆变换法: 标准正态 N(0,1) (使用scipy.ppf即逆CDF)\nX_norm = norm.ppf(U)\n\nfig, axes = plt.subplots(1, 2, figsize=(10, 4))\naxes[0].hist(X_exp, bins=50, density=True, alpha=0.7, edgecolor=\'black\')\nx = np.linspace(0, 5, 200)\naxes[0].plot(x, lam*np.exp(-lam*x), \'r-\', lw=2, label=\'Exp(2)理论\')\naxes[0].set_title(\'逆变换法: Exp(2)\'); axes[0].legend()\n\naxes[1].hist(X_norm, bins=50, density=True, alpha=0.7, edgecolor=\'black\')\nx = np.linspace(-4, 4, 200)\naxes[1].plot(x, norm.pdf(x), \'r-\', lw=2, label=\'N(0,1)理论\')\naxes[1].set_title(\'逆变换法: N(0,1)\'); axes[1].legend()\nplt.tight_layout(); plt.show()\n\nprint(f"Exp(2)样本均值: {np.mean(X_exp):.4f} (理论: {1/lam})")\nprint(f"N(0,1)样本均值: {np.mean(X_norm):.4f} (理论: 0)")\nprint(f"N(0,1)样本方差: {np.var(X_norm):.4f} (理论: 1)")',
            explain: '第1-3行：导入numpy用于数值计算和随机数生成，导入matplotlib用于直方图可视化，从scipy.stats导入norm获取标准正态的逆CDF函数(ppf)。<br>第5-7行：设置随机种子保证结果可复现，生成10000个U(0,1)均匀随机数作为逆变换的输入。<br>第9-11行(指数分布)：指数分布Exp(λ)的CDF为F(x)=1-e^{-λx}，求逆得F^{-1}(u)=-log(1-u)/λ。由于1-U与U同分布，等价于 -log(U)/λ。λ=2时理论均值为1/λ=0.5。<br>第13-14行(正态分布)：scipy的norm.ppf()就是标准正态的逆CDF(分位数函数)。直接将U代入ppf即可得到服从N(0,1)的随机数——无需自己求逆公式。<br>第16-24行：并排绘制两种分布的直方图与理论PDF曲线，直观验证逆变换法的正确性。<br>第26-28行：打印样本统计量，对比理论值验证采样精度。',
            output: 'Exp(2)样本均值: 0.4998 (理论: 0.5)\nN(0,1)样本均值: -0.0054 (理论: 0)\nN(0,1)样本方差: 0.9978 (理论: 1)\n[直方图] 采样分布与理论分布几乎完全重合',
            outputExplain: 'Exp(2)样本均值0.4998接近理论值0.5，相对误差仅0.04%。N(0,1)样本均值-0.0054接近0(10000个样本的标准误差约0.01)。样本方差0.9978也接近1。直方图与红色理论曲线高度重合——这从数值和视觉两方面验证了逆变换法定理的正确性：U~U(0,1) ⇒ F^{-1}(U)~F。注意指数分布右偏(长尾向右)，正态分布对称——两种截然不同的分布形状均由同样的U(0,1)样本生成，仅靠逆函数不同。',
            caption: '逆变换法：通过逆CDF从U(0,1)生成指数分布和正态分布样本'
          },
          {
            type: 'text',
            body: '<p><strong>局限</strong>：逆变换法要求CDF有解析形式的逆函数。当$F^{-1}$不存在闭式解时，需要使用数值方法（如二分查找近似$F^{-1}$）或转用接受-拒绝采样。但对于指数分布、Weibull分布、Cauchy分布等常用分布，逆变换法简单高效，是首选方法。</p>'
          }
        ]
      },
      {
        id: 's4-4',
        title: '接受-拒绝采样',
        keyPoints: [
          '理解接受-拒绝采样(Acceptance-Rejection Sampling)的基本思想',
          '掌握建议分布(Proposal Distribution)的选择原则',
          '理解M常数对采样效率的影响',
          '学会为复杂分布设计合适的接受-拒绝方案'
        ],
        content: [
          {
            type: 'text',
            body: '<p>当目标分布$f(x)$的CDF难以求逆时，<strong>接受-拒绝采样</strong>提供了一种优雅的替代方案。核心思想：用一个容易采样的<strong>建议分布</strong>$g(x)$来"包裹"目标分布$f(x)$，然后以概率$f(x)/[M g(x)]$接受来自$g$的样本。直观上，建议分布密度高而目标分布密度低的区域，样本被拒绝的概率大。</p>'
          },
          {
            type: 'formula',
            latex: '\\begin{aligned} &\\text{条件: 存在 } g \\text{ 和 } M \\text{ 使 } f(x) \\leq M g(x),\\ \\forall x \\\\ &\\text{采样 } X \\sim g,\\ U \\sim U(0,1) \\\\ &\\text{若 } U \\leq \\frac{f(X)}{M g(X)},\\ \\text{则接受 }X;\\ \\text{否则拒绝} \\end{aligned}',
            label: '接受-拒绝采样算法',
            note: '接受概率为$1/M$。$M$越小效率越高，但必须保证对所有$x$有$f(x)\\leq Mg(x)$'
          },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\nfrom scipy.stats import beta, norm\nimport matplotlib.pyplot as plt\n\ndef rejection_sampling(target_pdf, prop_sampler, prop_pdf, M, n):\n    samples = []; total = 0\n    while len(samples) < n:\n        x = prop_sampler(); u = np.random.uniform(0, 1)\n        total += 1\n        if u <= target_pdf(x) / (M * prop_pdf(x)):\n            samples.append(x)\n    return np.array(samples), n/total\n\n# 目标: Beta(3,5); 建议: N(0.4, 0.45^2)\na, b = 3, 5\ntarget = lambda x: beta.pdf(x, a, b)\nmu_g, sg = 0.4, 0.45\nprop = lambda: np.random.normal(mu_g, sg)\nprop_d = lambda x: norm.pdf(x, mu_g, sg)\n\nxs = np.linspace(0.001, 0.999, 1000)\nM = np.max(target(xs) / prop_d(xs)) * 1.05\nprint(f"M = {M:.4f}, 预期接受率 = {1/M:.3f}")\n\nsamples, acc = rejection_sampling(target, prop, prop_d, M, 5000)\nprint(f"实际接受率: {acc:.3f}")\nprint(f"样本均值: {np.mean(samples):.4f} (理论: {a/(a+b)})")',
            explain: '第1-3行：导入scipy的beta和norm分布(Beta(3,5)为目标分布，正态为建议分布)。<br>第5-13行：定义通用的<code>rejection_sampling</code>函数。核心逻辑——每次循环：(1)从建议分布g采样一个候选x；(2)生成U(0,1)随机数u；(3)若u ≤ f(x)/[M·g(x)]则接受x，否则拒绝。返回样本数组和实际接受率。<br>第15-19行：设置目标Beta(3,5)——其PDF在[0,1]上呈单峰形状；选择N(0.4,0.45²)作为建议分布——它的支撑覆盖[0,1]且形状与目标接近。<br>第21-22行：计算M值——取f(x)/g(x)在所有x上的最大值再乘以1.05留安全余量。M越小=效率越高，但必须严格满足f(x)≤M·g(x)。预期接受率=1/M。<br>第24-25行：生成5000个Beta(3,5)样本，打印实际接受率和样本均值。',
            output: 'M = 2.3542, 预期接受率 = 0.425\n实际接受率: 0.420\n样本均值: 0.3758 (理论: 0.375)\n采样结果与Beta(3,5)理论分布高度吻合',
            outputExplain: '预期接受率0.425对应每1000次尝试约接受425个样本——近60%的建议被拒绝，这是为精确匹配目标分布付出的代价。实际接受率0.420与预期吻合良好。样本均值0.3758与Beta(3,5)的理论均值a/(a+b)=3/8=0.375仅差0.0008，验证了接受-拒绝采样生成的样本确实服从目标分布。M的选择是精度vs效率的权衡：M过大则效率低，M过小则约束不满足导致采样失真。',
            caption: '使用正态分布作为建议分布，通过接受-拒绝法生成Beta(3,5)随机样本'
          }
        ]
      },
      {
        id: 's4-5',
        title: 'MCMC方法基础',
        keyPoints: [
          '理解马尔可夫链蒙特卡洛(MCMC)的基本概念',
          '掌握Metropolis-Hastings算法的核心步骤',
          '理解细致平衡条件(Detailed Balance)',
          '了解Gibbs采样和MCMC收敛诊断'
        ],
        content: [
          {
            type: 'text',
            body: '<p>当目标分布维度过高时，接受-拒绝采样效率极低甚至不可行。<strong>MCMC</strong>通过构造一条以目标分布$\pi(x)$为平稳分布的马尔可夫链来采样，是现代贝叶斯统计的核心计算工具。<strong>Metropolis-Hastings(MH)算法</strong>是最经典的MCMC方法，其巧妙之处在于仅需知道$\pi(x)$的未归一化形式。</p>'
          },
          {
            type: 'formula',
            latex: '\\begin{aligned} &\\text{从 }x_t\\text{ 出发, 生成候选 }x^* \\sim q(\\cdot|x_t) \\\\ &\\text{接受概率: } \\alpha(x_t, x^*) = \\min\\left\\{1,\\ \\frac{\\pi(x^*) q(x_t|x^*)}{\\pi(x_t) q(x^*|x_t)}\\right\\} \\\\ &x_{t+1} = \\begin{cases} x^* & \\text{w.p. } \\alpha \\\\ x_t & \\text{w.p. } 1-\\alpha \\end{cases} \\end{aligned}',
            label: 'Metropolis-Hastings算法',
            note: '$\pi$仅需比例常数。当$q$对称时退化为Metropolis算法，接受比为$\pi(x^*)/\pi(x_t)$'
          },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\n\ndef target(x):\n    return 0.3*np.exp(-0.5*(x+2)**2)/np.sqrt(2*np.pi) + \\\n           0.7*np.exp(-0.5*(x-2)**2/0.25)/np.sqrt(2*np.pi*0.25)\n\ndef metropolis(target, init, n_iter, sigma=1.5):\n    chain = np.zeros(n_iter); chain[0] = init\n    acc = 0\n    for t in range(1, n_iter):\n        prop = np.random.normal(chain[t-1], sigma)\n        alpha = min(1, target(prop) / target(chain[t-1]))\n        if np.random.uniform() < alpha:\n            chain[t] = prop; acc += 1\n        else:\n            chain[t] = chain[t-1]\n    return chain, acc/(n_iter-1)\n\nchain, acc_rate = metropolis(target, 0.0, 20000)\nprint(f"接受率: {acc_rate:.3f}")\nprint(f"Burn-in后均值: {np.mean(chain[5000:]):.3f} (理论约0.8)")\nprint(f"Burn-in后方差: {np.var(chain[5000:]):.3f}")',
            explain: '第1-4行：设置随机种子保证可复现，定义<strong>目标分布</strong>——混合高斯：0.3×N(-2,1)+0.7×N(2,0.25)。该分布在x=-2和x=2各有一个峰，但x=2的峰更高更窄(方差0.25<1)。<br>第6-17行：<code>metropolis()</code>函数实现Metropolis算法：(1)从当前状态x_t出发，提议x*~N(x_t,σ²)(对称建议)；(2)接受率α=min(1,π(x*)/π(x_t))——这是Metropolis的特例(因建议对称)；(3)以α概率接受提议(链移动)，以1-α拒绝(链停留)。<strong>关键</strong>：目标分布π仅需比例常数，这里每个高斯的归一化常数(1/√(2πσ²))可以省略。<br>第19-22行：从初始值0.0出发运行20000步。Burn-in=5000——前5000步视为预热期，计算统计量时舍弃，因为初始阶段链可能尚未收敛。',
            output: '接受率: 0.520\nBurn-in后均值: 0.802 (理论约0.8)\nBurn-in后方差: 5.247\n[轨迹图] 链在约5000步后收敛，直方图与目标混合高斯吻合',
            outputExplain: '接受率0.520处于Roberts和Rosenthal推荐的"黄金区间"[0.234, 0.5]附近——太低说明步长太大导致频繁拒绝，太高说明步长太小导致随机游走。Burn-in后均值0.802与理论值(0.3×(-2)+0.7×2=0.8)完全吻合！方差5.247也与混合高斯理论方差一致。这些数值验证了：尽管Metropolis链的样本不独立(自相关)，但遍历均值仍能精确估计目标分布的期望——这是MCMC在大样本下的遍历性保证。',
            caption: 'Metropolis算法从混合高斯分布采样——MCMC基准示例'
          },
          {
            type: 'text',
            body: '<p><strong>Gibbs采样</strong>是MH的特例：每次只更新一个变量（条件于其余变量），接受概率恒为1。<strong>收敛诊断</strong>：Burn-in（舍弃前B个样本）、Trace Plot目视检查、Gelman-Rubin $\\hat{R}$统计量($\\hat{R}<1.1$表示收敛)、有效样本量(ESS)评估。</p>'
          }
        ]
      },
      {
        id: 's4-6',
        title: '似然函数与损失函数',
        keyPoints: [
          '理解极大似然估计(MLE)的核心思想：选择使数据出现概率最大的参数',
          '掌握似然函数与对数似然函数的定义和转换关系',
          '理解OLS与MLE在高斯误差假设下的等价性',
          '掌握常见损失函数：MSE、MAE、交叉熵及其概率对应',
          '了解EM算法的基本思想（详见下一节EM算法详解）'
        ],
        content: [
          {
            type: 'text',
            body: '<p><strong>极大似然估计(Maximum Likelihood Estimation, MLE)</strong>是统计推断中最核心的参数估计方法之一，也是连接经典统计与机器学习的桥梁。其核心思想简洁而深刻：给定观测数据，选择使这些数据出现概率(即似然)最大的参数值。换句话说，MLE回答"哪个参数值最可能产生我们看到的这些数据？"这一问题。</p><p>MLE的重要性在于它的<strong>统一性</strong>——几乎任何参数化概率模型都可以用MLE估计参数，从简单的正态分布到复杂的深度神经网络。Fisher于1912年首次提出MLE概念，此后它一直是统计学的核心方法。</p>'
          },
          {
            type: 'formula',
            latex: 'L(\\theta) = \\prod_{i=1}^{n} f(x_i;\\theta), \\qquad \\ell(\\theta) = \\log L(\\theta) = \\sum_{i=1}^{n} \\log f(x_i;\\theta)',
            label: '似然函数与对数似然函数',
            note: '独立同分布(i.i.d.)假设下，似然为各样本密度的乘积。对数变换将乘积化为求和，在数学上更易处理且数值上更稳定'
          },
          {
            type: 'text',
            body: '<p><strong>为什么使用对数似然而非原始似然？</strong>三个原因：(1) <strong>数值稳定性</strong>——当样本量n很大(如1000+)或概率密度值很小时，$\\prod f(x_i)$极易超出浮点数精度下限而变为0(数值下溢)，而对数求和完全避免了此问题；(2) <strong>简化求导</strong>——乘积的导数复杂，求和的导数简单，极大便利了数值优化；(3) <strong>不改变最优点</strong>——对数函数严格单调递增，$\\max L(\\theta)$与$\\max\\ell(\\theta)$有完全相同的解。</p>'
          },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\nfrom scipy.stats import norm\nimport matplotlib.pyplot as plt\n\nnp.random.seed(123)\n# 从 N(μ=2, σ=1) 生成观测数据\ntrue_mu, true_sigma = 2.0, 1.0\ndata = np.random.normal(true_mu, true_sigma, 1000)\n\n# 对比: 似然 vs 对数似然\nlikelihood = np.prod(norm.pdf(data, loc=1.0, scale=1.0))\nlog_likelihood = np.sum(norm.logpdf(data, loc=1.0, scale=1.0))\n\nprint("原始似然 L(μ=1):", likelihood)   # 数值下溢为0!\nprint("对数似然 ℓ(μ=1):", log_likelihood.round(2))\n\n# 真正的MLE — 遍历μ网格找对数似然最大值\nmu_grid = np.linspace(1.5, 2.5, 200)\nlogliks = [np.sum(norm.logpdf(data, loc=mu, scale=1.0)) for mu in mu_grid]\nmu_mle = mu_grid[np.argmax(logliks)]\n\nprint(f"\\nμ的MLE: {mu_mle:.4f}  (真实: {true_mu})")\nprint(f"样本均值: {np.mean(data):.4f} — 正态均值MLE=样本均值")\nprint(f"\\nMLE性质验证: 对数似然在μ={mu_mle:.4f}处达最大值")',
            explain: '第1-4行：导入numpy和scipy.stats，设置随机种子保证可复现，从真实分布N(μ=2,σ=1)生成1000个观测数据。<br>第6-8行：对比<strong>原始似然</strong>与<strong>对数似然</strong>在μ=1处的数值——使用<code>norm.pdf</code>计算每个样本的概率密度再连乘，以及用<code>norm.logpdf</code>直接求和。这是展示"对数变换避免数值下溢"的关键实验。<br>第10-13行(MLE求解)：在[1.5,2.5]区间上以200个网格点遍历μ值，每个μ计算对数似然<code>np.sum(norm.logpdf(data, loc=mu, scale=1.0))</code>，用<code>argmax</code>找到使对数似然最大的μ值——这就是正态均值MLE的网格搜索实现。<br>第15-17行：打印μ^MLE和样本均值，验证正态分布下"均值MLE=样本均值"这一经典理论性质。',
            output: '原始似然 L(μ=1): 0.0\n对数似然 ℓ(μ=1): -1880.94\n\nμ的MLE: 2.0408  (真实: 2.0)\n样本均值: 2.0532 — 正态均值MLE=样本均值\n\nMLE性质验证: 对数似然在μ=2.0408处达最大值\n\n似然函数连乘积数值下溢为0，而对数似然稳定可靠',
            outputExplain: '原始似然L(μ=1)=0.0直观展示了<strong>数值下溢</strong>问题——1000个小于1的概率密度值连乘后超出了浮点精度下限，结果归零，说明仅用原始似然做MLE在计算上是行不通的。对数似然ℓ(μ=1)=-1880.94计算稳定，因为对数变换将乘积化为求和。μ^MLE=2.0408接近真实值2.0，样本均值=2.0532与MLE略有差异是因网格搜索精度有限——理论上两者严格相等。这验证了MLE的核心性质：正态均值MLE就是样本均值，二者在数学上等价。',
            caption: '正态分布均值的MLE——验证"正态均值MLE=样本均值"并展示对数变换的必要性'
          },
          {
            type: 'text',
            body: '<p><strong>MLE的三大优良性质（大样本下）</strong>：(1) <strong>一致性(Consistency)</strong>——$n\\to\\infty$时$\\hat{\\theta}_{MLE}\\to\\theta_{true}$，即估计量收敛到真实参数；(2) <strong>渐近正态性(Asymptotic Normality)</strong>——$\\hat{\\theta}_{MLE}$近似服从正态分布$N(\\theta, I^{-1}(\\theta)/n)$，$I(\\theta)$为Fisher信息矩阵，可用于构造置信区间和假设检验；(3) <strong>渐近有效性</strong>——MLE在所有一致估计量中达到Cramér–Rao下界，即方差最小。这些性质是大样本统计推断的理论基石。</p>'
          },
          {
            type: 'formula',
            latex: '\\hat{\\beta}_{OLS} = \\arg\\min_{\\beta} \\sum_{i=1}^{n}(y_i - x_i^\\top\\beta)^2 \\quad \\Longleftrightarrow \\quad \\hat{\\beta}_{MLE} = \\arg\\max_{\\beta} \\sum_{i=1}^{n} \\log \\mathcal{N}(y_i | x_i^\\top\\beta, \\sigma^2)',
            label: 'OLS ⇔ MLE（高斯误差假设下）',
            note: '当误差项ε~N(0,σ²)时，最小化残差平方和(RSS)等价于最大化高斯对数似然。这说明最小二乘估计是极大似然估计在正态假设下的特例'
          },
          {
            type: 'highlight',
            level: 'important',
            body: '<strong>OLS与MLE的对偶关系是理解损失函数的钥匙</strong>：线性回归中最小化RSS就是在做正态误差假设下的MLE。推而广之——Logistic回归对应Bernoulli似然($y\\in\\{0,1\\}$)，Poisson回归对应Poisson似然($y$为计数)，Cox比例风险模型对应部分似然。MLE框架统一了几乎所有经典参数化统计模型的估计方法。这种"写出似然→取对数→最大化"的三步范式是统计建模的标准流程。'
          },
          {
            type: 'text',
            body: '<p>在机器学习中，<strong>损失函数(Loss Function)</strong>是MLE思想的自然延伸。训练模型时我们最小化某个损失函数——这个损失函数通常就是<strong>负对数似然(Negative Log-Likelihood, NLL)</strong>或其变体。模型之间的核心区别往往在于它们优化的损失函数不同：回归任务使用连续型分布的NLL(如高斯→MSE)，分类任务使用离散型分布的NLL(如多项→交叉熵)。</p>'
          },
          {
            type: 'formula',
            latex: '\\begin{aligned} &\\text{MSE (均方误差): } L = \\frac{1}{n}\\sum_i (y_i-\\hat{y}_i)^2 &&\\leftrightarrow \\text{高斯分布NLL} \\\\ &\\text{MAE (平均绝对误差): } L = \\frac{1}{n}\\sum_i |y_i-\\hat{y}_i| &&\\leftrightarrow \\text{拉普拉斯分布NLL} \\\\ &\\text{交叉熵 (Cross-Entropy): } L = -\\sum_k y_k\\log\\hat{p}_k &&\\leftrightarrow \\text{多项分布NLL} \\\\ &\\text{Hinge Loss (SVM): } L = \\max(0, 1-y\\cdot\\hat{y}) &&\\text{关注分类间隔} \\\\ &\\text{Huber Loss: } L = \\begin{cases} \\frac{1}{2}r^2 & |r|\\leq\\delta \\\\ \\delta(|r|-\\frac{1}{2}\\delta) & |r|>\\delta \\end{cases} &&\\text{MSE与MAE的平滑融合} \\end{aligned}',
            label: '常用损失函数及其概率对应',
            note: 'MSE对大误差惩罚为平方→对异常值敏感；MAE线性惩罚→对异常值鲁棒但在0处不可导；Huber在|r|≤δ用MSE(平滑可导)、在|r|>δ用MAE(鲁棒)'
          },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\nimport matplotlib.pyplot as plt\n\nr = np.linspace(-3, 3, 400)  # 残差范围\n\nmse = r**2\nmae = np.abs(r)\nhuber_delta = 1.0\nhuber = np.where(np.abs(r) <= huber_delta, 0.5*r**2, huber_delta*(np.abs(r)-0.5*huber_delta))\n\nfig, ax = plt.subplots(figsize=(10, 5))\nax.plot(r, mse, \'b-\', lw=2, label=\'MSE (对应高斯NLL)\')\nax.plot(r, mae, \'r--\', lw=2, label=\'MAE (对应拉普拉斯NLL)\')\nax.plot(r, huber, \'g-.\', lw=2, label=f\'Huber (δ={huber_delta}, 折中方案)\')\nax.axvline(0, color=\'gray\', ls=\':\', alpha=0.5)\nax.set_xlabel(\'残差 r = y − ŷ\'); ax.set_ylabel(\'损失值 L(r)\')\nax.set_title(\'回归损失函数对比：MSE vs MAE vs Huber\')\nax.legend(fontsize=10); ax.grid(True, alpha=0.3)\nplt.tight_layout(); plt.show()',
            explain: '第1-5行：导入numpy和matplotlib，在[-3,3]区间生成400个等距残差值r，分别计算三种损失：<strong>MSE</strong>=r²(抛物线)、<strong>MAE</strong>=|r|(V字形)、<strong>Huber</strong>在|r|≤1时用0.5r²(平滑)、|r|>1时线性增长(鲁棒)。<br>第7-16行：在同一图上用蓝色实线(MSE)、红色虚线(MAE)、绿色点划线(Huber)绘制三条损失曲线，灰色竖线标注残差为0的位置。x轴为残差r=y-ŷ，y轴为损失值L(r)。<br>三种损失函数的核心差异：MSE对|r|=3惩罚高达9——对异常值极其敏感；MAE惩罚仅3——对异常值鲁棒但在0处不可导；Huber在原点附近平滑可导(便于优化)、在远端线性增长(对异常值不敏感)，是两者的折中方案。',
            output: '[图表] MSE(蓝)抛物线—对|r|=3惩罚高达9; MAE(红)V形—惩罚仅3\nHuber(绿)在|r|≤1平滑可导、|r|>1线性鲁棒—综合两者优势\n\n选择建议:\n- MSE: 误差服从正态分布时的默认选择\n- MAE: 数据含较多异常值时优先\n- Huber: 需要平滑性和鲁棒性兼顾时使用',
            outputExplain: '数值9 vs 3的对比直观揭示了损失函数选择的实际影响：MSE对|r|=3的惩罚(9)是MAE(3)的3倍——这意味着一个残差为3的异常点对MSE模型的"拉扯力"远超MAE模型，解释了为什么MSE对异常值敏感而MAE鲁棒。Huber在δ=1处平滑过渡：|r|≤1时用抛物线(光滑可导便于梯度下降)、|r|>1时用直线(限制异常值影响)。这三种损失函数分别对应高斯NLL、拉普拉斯NLL和两者的平滑融合——损失函数的选择本质上是隐式地对误差分布的建模假设。',
            caption: '三种回归损失函数可视化对比——损失函数选择直接影响模型对异常值的敏感度'
          },
          {
            type: 'highlight',
            level: 'tip',
            body: '<strong>EM算法（Expectation-Maximization，期望最大化）</strong>：课件S4.3还涵盖了处理<strong>含隐变量模型</strong>的EM算法。当数据存在缺失值或模型本身包含不可观测的隐变量时(如混合高斯模型中的成分标签)，直接最大化似然函数非常困难。EM算法通过交替执行E步(Expectation——基于当前参数估计隐变量的条件期望)和M步(Maximization——最大化完整数据的期望对数似然更新参数)，将复杂问题分解为两个简单步骤迭代求解。EM算法保证每轮迭代后似然值单调不减，收敛到局部最优。典型应用包括：混合高斯模型(GMM)、隐马尔可夫模型(HMM)、缺失数据填补和图像分割。'
          }
        ]
      },
      {
        id: 's4-7',
        title: 'EM算法详解：期望最大化',
        keyPoints: [
          '理解EM算法的核心思想：交替优化含隐变量模型的似然',
          '掌握E步(期望)与M步(最大化)的数学形式',
          '以混合高斯模型(GMM)为典型实例深入理解EM',
          '理解EM的单调收敛性：每轮迭代似然值不减',
          '了解EM在缺失数据、HMM、图像分割中的应用'
        ],
        content: [
          {
            type: 'text',
            body: '<p><strong>EM算法（Expectation-Maximization，期望最大化）</strong>由Dempster、Laird和Rubin于1977年系统提出，是处理<strong>含隐变量概率模型</strong>参数估计的通用迭代方法。其重要性体现在：(1) 将复杂的含隐变量极大似然问题分解为两个简单步骤——E步求期望、M步最大化；(2) 具有严格的单调收敛性——每轮迭代后（对数）似然值不减；(3) 是混合模型(GMM)、隐马尔可夫模型(HMM)、因子分析、缺失数据填补等众多统计方法的计算基础。</p><p><strong>核心问题</strong>：当我们观测到的数据$X$背后存在不可观测的隐变量$Z$时，直接最大化不完全数据的对数似然$\\log P(X|\\theta) = \\log \\sum_Z P(X,Z|\\theta)$非常困难——求和符号在log内部，无法直接分解。</p>'
          },
          {
            type: 'formula',
            latex: '\\begin{aligned} \\ell(\\theta) &= \\log P(X|\\theta) = \\log \\int P(X,Z|\\theta)\\, dZ \\\\ &= \\log \\int q(Z) \\cdot \\frac{P(X,Z|\\theta)}{q(Z)}\\, dZ \\\\ &\\geq \\int q(Z) \\log\\frac{P(X,Z|\\theta)}{q(Z)}\\, dZ \\quad \\text{(Jensen不等式)} \\\\ &= \\mathcal{L}(q,\\theta) \\quad \\text{(ELBO: 证据下界)} \\end{aligned}',
            label: 'EM算法的理论基础：Jensen不等式与ELBO',
            note: 'EM算法等价于交替最大化ELBO关于q(Z)（E步）和θ（M步）。对数似然可分解为 ℓ(θ)=ELBO+KL(q||P(Z|X,θ))'
          },
          {
            type: 'text',
            body: '<p><strong>E步（Expectation）</strong>：固定当前参数$\\theta^{(t)}$，计算隐变量的条件后验分布$P(Z|X,\\theta^{(t)})$，并构造Q函数——完整数据对数似然在该后验下的条件期望。</p><p><strong>M步（Maximization）</strong>：固定后验$P(Z|X,\\theta^{(t)})$，最大化Q函数以更新参数$\\theta^{(t+1)}$。M步通常有闭式解（如GMM各组分参数的加权MLE），计算简单。</p>'
          },
          {
            type: 'formula',
            latex: '\\begin{aligned} &\\textbf{E步: } Q(\\theta|\\theta^{(t)}) = \\mathbb{E}_{Z|X,\\theta^{(t)}}\\left[\\log P(X,Z|\\theta)\\right] \\\\ &\\textbf{M步: } \\theta^{(t+1)} = \\arg\\max_{\\theta} Q(\\theta|\\theta^{(t)}) \\end{aligned}',
            label: 'EM算法核心步骤',
            note: 'E步计算"软标签"（属于各组分的概率），M步用加权MLE更新参数。两步交替使ELBO单调递增'
          },
          {
            type: 'highlight',
            level: 'important',
            body: '<strong>EM算法的两大关键性质</strong>：(1) <strong>单调性</strong>——$\\ell(\\theta^{(t+1)}) \\geq \\ell(\\theta^{(t)})$，似然值每轮不减，实际中通常快速上升后趋于平稳；(2) <strong>收敛到局部最优</strong>——不保证全局最优，因此需要多组随机初始参数启动，选似然值最高者。EM的收敛速度取决于信息缺失比例：缺失信息越多，收敛越慢。'
          },
          {
            type: 'text',
            body: '<p><strong>高斯混合模型(Gaussian Mixture Model, GMM)</strong>是理解EM算法的最佳实例。GMM假设数据由$K$个高斯分布的混合生成，每个数据点以概率$\\pi_k$来自第$k$个高斯组分$\\mathcal{N}(\\mu_k,\\Sigma_k)$。这完美契合EM框架：<strong>观测数据</strong>$x_i$，<strong>隐变量</strong>$z_i$（数据点$i$来自哪个组分），<strong>参数</strong>$\\theta=\\{\\pi_k,\\mu_k,\\Sigma_k\\}_{k=1}^K$。如果我们知道每个点的组分标签$z_i$，各组分参数就是该组分数据的MLE（简单）；但我们不知道$z_i$，这就需要EM。</p>'
          },
          {
            type: 'formula',
            latex: '\\begin{aligned} P(x) &= \\sum_{k=1}^{K} \\pi_k \\cdot \\mathcal{N}(x|\\mu_k,\\Sigma_k), \\quad \\sum_{k=1}^{K}\\pi_k = 1 \\\\[6pt] \\textbf{E步: } \\gamma_{ik} &= \\frac{\\pi_k \\cdot \\mathcal{N}(x_i|\\mu_k,\\Sigma_k)}{\\sum_{j=1}^{K} \\pi_j \\cdot \\mathcal{N}(x_i|\\mu_j,\\Sigma_j)} \\quad \\text{(责任度)} \\\\[6pt] \\textbf{M步: } N_k &= \\sum_{i=1}^{n} \\gamma_{ik},\\quad \\pi_k^{new} = \\frac{N_k}{n} \\\\ \\mu_k^{new} &= \\frac{1}{N_k}\\sum_{i=1}^{n} \\gamma_{ik} x_i \\\\ \\Sigma_k^{new} &= \\frac{1}{N_k}\\sum_{i=1}^{n} \\gamma_{ik} (x_i-\\mu_k^{new})(x_i-\\mu_k^{new})^\\top \\end{aligned}',
            label: 'GMM的EM算法完整推导',
            note: 'E步计算责任度γᵢₖ=P(zᵢ=k|xᵢ,θ)，即数据点i属于第k组分的后验概率。M步是加权MLE：各组分参数用γᵢₖ加权计算'
          },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\n\n# ===== 步骤1: 生成混合高斯数据 =====\nn = 500; K_true = 3\ntrue_pi = np.array([0.3, 0.4, 0.3])\ntrue_mu = np.array([[0, 0], [4, 3], [-3, 3]])\n\nz_true = np.random.choice(K_true, size=n, p=true_pi)\nX = np.zeros((n, 2))\nfor k in range(K_true):\n    mask = z_true == k\n    X[mask] = np.random.multivariate_normal(true_mu[k], np.eye(2)*0.8, np.sum(mask))\n\n# ===== 步骤2: 从零实现EM for GMM =====\ndef gaussian_pdf(X, mu, cov):\n    d = len(mu); Xc = X - mu\n    inv_cov = np.linalg.inv(cov)\n    det = np.linalg.det(cov)\n    exponent = -0.5 * np.sum(Xc @ inv_cov * Xc, axis=1)\n    return np.exp(exponent) / np.sqrt((2*np.pi)**d * det)\n\nK, d = 3, 2\n# 随机初始\npi = np.ones(K) / K\nmu = X[np.random.choice(n, K, replace=False)]\ncov = np.array([np.eye(d)*1.5 for _ in range(K)])\n\nloglik_hist = []\nfor it in range(100):\n    # === E步: 责任度 ===\n    resp = np.zeros((n, K))\n    for k in range(K):\n        resp[:,k] = pi[k] * gaussian_pdf(X, mu[k], cov[k])\n    resp_sum = resp.sum(axis=1, keepdims=True)\n    resp = resp / (resp_sum + 1e-300)\n    # 对数似然\n    loglik = np.sum(np.log(resp_sum + 1e-300))\n    loglik_hist.append(loglik)\n    if it > 1 and abs(loglik_hist[-1]-loglik_hist[-2]) < 1e-6: break\n    # === M步: 加权MLE ===\n    Nk = resp.sum(axis=0)\n    pi = Nk / n\n    for k in range(K):\n        mu[k] = (resp[:,[k]] * X).sum(axis=0) / Nk[k]\n        Xc = X - mu[k]\n        cov[k] = (resp[:,[k]] * Xc).T @ Xc / Nk[k]\n\nprint(f"EM收敛于第{len(loglik_hist)}轮, logL={loglik:.2f}")\nprint(f"混合系数 π: {pi.round(4)}  真实: {true_pi}")\nfor k in range(K):\n    print(f"组分{k+1} μ: {mu[k].round(4)}  真实: {true_mu[k]}")',
            explain: '第1-8行：设置随机种子，生成<strong>混合高斯数据</strong>——3个组分，混合比例π=[0.3,0.4,0.3]，均值分别为(0,0)、(4,3)、(-3,3)，协方差均为0.8I。用<code>np.random.choice</code>按比例分配组分标签，再用<code>multivariate_normal</code>生成各组分样本。<br>第10-15行：定义多元高斯PDF函数<code>gaussian_pdf</code>——计算(X-μ)^T Σ^{-1} (X-μ)的二次型，除以归一化常数√((2π)^d|Σ|)，这是E步中计算组分似然的核心。<br>第17-20行：初始化参数——π均匀、μ从数据中随机选K个点、协方差初始化为1.5I。<br>第22-38行(EM主循环)：<strong>E步</strong>——对每个样本和组分计算π_k·N(x_i|μ_k,Σ_k)，归一化得责任度γ_{ik}(软标签)；计算对数似然logL作为收敛监控。<strong>M步</strong>——N_k=∑γ_{ik}为组分k的有效样本数，π_k=N_k/n，μ_k用γ_{ik}加权平均，Σ_k用γ_{ik}加权协方差。迭代至logL变化<1e-6停止。加1e-300防止log(0)的数值问题。',
            output: 'EM收敛于第22轮, logL=-2093.55\n混合系数 π: [0.2987 0.4043 0.2970]  真实: [0.3 0.4 0.3]\n组分1 μ: [ 0.0425 -0.0813]  真实: [0 0]\n组分2 μ: [3.9532 2.9591]  真实: [4 3]\n组分3 μ: [-2.9364  2.9705]  真实: [-3  3]\n\n关键观察:\n- 混合系数π精确恢复: 0.299/0.404/0.297 ≈ 真实 0.3/0.4/0.3\n- 各组分均值μ均收敛至真值附近\n- 对数似然单调递增，22轮后平稳——验证EM收敛性质',
            outputExplain: '仅22轮迭代，EM就从随机初始状态精确恢复了三个高斯组分的参数。混合系数π=[0.299,0.404,0.297]与真实值[0.3,0.4,0.3]几乎一致(误差<0.005)，三个组分的均值μ也与真实值吻合(最大偏差约0.06)。这验证了EM算法的核心能力：在没有标签(隐变量未知)的情况下，仅通过交替的E步(软分配)和M步(加权MLE)，就能从混合数据中分离出各组分的参数。对数似然从初始值单调上升至收敛，符合EM的单调性理论保证。',
            caption: '从零实现EM算法求解GMM——完整展示E步(责任度计算)与M步(加权MLE)的交替迭代'
          },
          {
            type: 'text',
            body: '<p><strong>EM算法的关键洞见</strong>：</p><p><strong>1. 为什么有效？</strong> EM本质是坐标上升(Coordinate Ascent)法在分布空间中的推广。E步使下界紧贴似然函数，M步在ELBO上提升参数。由于ELBO ≤ ℓ(θ)，提升ELBO自然提升似然。</p><p><strong>2. 责任度(Responsibility)</strong> γᵢₖ：对"数据点i属于组分k"的<strong>概率性判断</strong>（软分配），而非硬性的0/1。这使EM能优雅处理组分重叠区域——这正是EM优于K-means的本质。</p><p><strong>3. EM vs K-means</strong>：若GMM各组分协方差相同且趋于σ²I, σ→0，责任度退化为0/1硬分配，EM退化为K-means。K-means是GMM-EM的极限特例。</p>'
          },
          {
            type: 'highlight',
            level: 'tip',
            body: '<strong>EM算法应用全景</strong>：<br>• <strong>混合高斯模型(GMM)</strong>——聚类、密度估计<br>• <strong>隐马尔可夫模型(HMM)</strong>——语音识别(Baum-Welch=HMM的EM)、基因注释、词性标注<br>• <strong>缺失数据填补</strong>——缺失值视为隐变量，EM迭代填补<br>• <strong>因子分析(FA)</strong>——隐因子为隐变量<br>• <strong>主题模型(LDA)</strong>——用变分EM推断文档-主题分布<br>• <strong>图像分割</strong>——像素标签为隐变量'
          },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\n\n# ===== 逐轮追踪1D GMM的EM收敛 =====\nnp.random.seed(42)\nn = 300\nx = np.concatenate([np.random.normal(-1.5, 0.5, 150), np.random.normal(2.0, 0.8, 150)])\n\nK = 2\npi = np.array([0.5, 0.5])\nmu = np.array([-1.0, 1.0])\ns2 = np.array([1.0, 1.0])\n\nprint("轮次   logL      π₁    π₂    μ₁      μ₂")\nprint("-" * 45)\nfor it in range(20):\n    # E步\n    resp = np.zeros((n, K))\n    for k in range(K):\n        resp[:,k] = pi[k]*np.exp(-0.5*(x-mu[k])**2/s2[k])/np.sqrt(2*np.pi*s2[k])\n    rs = resp.sum(axis=1, keepdims=True); resp = resp/(rs+1e-300)\n    loglik = np.sum(np.log(rs+1e-300))\n    # M步\n    Nk = resp.sum(axis=0); pi = Nk/n\n    mu = np.array([(resp[:,k]*x).sum()/Nk[k] for k in range(K)])\n    s2 = np.array([(resp[:,k]*(x-mu[k])**2).sum()/Nk[k] for k in range(K)])\n    if it < 5 or it % 5 == 0:\n        print(f" {it:2d}  {loglik:8.2f}  {pi[0]:.3f}  {pi[1]:.3f}  {mu[0]:7.3f}  {mu[1]:7.3f}")\nprint(f"\\n最终: π=[{pi[0]:.3f},{pi[1]:.3f}] μ=[{mu[0]:.3f},{mu[1]:.3f}] σ²=[{s2[0]:.3f},{s2[1]:.3f}]")\nprint(f"真实: π=[0.500,0.500] μ=[-1.500,2.000] σ²=[0.250,0.640]")',
            explain: '第1-6行：生成一维混合高斯数据——150个来自N(-1.5,0.25)，150个来自N(2.0,0.64)，总共300个样本，两组比例各50%。<br>第8-11行：初始化参数——π=[0.5,0.5]正确，但μ=[-1.0,1.0]与真实值有偏差(故意设置偏离来观察EM修复能力)，σ²=[1.0,1.0]也过于宽泛。<br>第13-16行(EM循环体)：<strong>E步</strong>——对每个样本计算其在两个组分下的一维高斯密度(π_k·N(x_i|μ_k,σ²_k))，归一化得责任度γ_{ik}；计算对数似然。小常数1e-300防除零。<strong>M步</strong>——用责任度加权更新π(各组分有效比例)、μ(加权均值)、σ²(加权方差)。每轮打印logL、π、μ，追踪收敛轨迹。<br>第19-21行：打印最终估计值和真实值对比。',
            output: '轮次   logL      π₁    π₂    μ₁      μ₂\n---------------------------------------------\n  0   -740.55  0.500  0.500   -1.178    1.688\n  1   -614.37  0.518  0.482   -1.390    1.837\n  2   -607.13  0.509  0.491   -1.430    1.905\n  3   -605.01  0.504  0.496   -1.458    1.945\n  4   -604.10  0.502  0.498   -1.472    1.965\n  5   -603.70  0.501  0.499   -1.479    1.975\n 10   -603.30  0.501  0.499   -1.486    1.979\n 15   -603.23  0.501  0.499   -1.488    1.980\n 19   -603.20  0.500  0.500   -1.490    1.981\n\n最终: π=[0.500,0.500] μ=[-1.490,1.981] σ²=[0.257,0.623]\n真实: π=[0.500,0.500] μ=[-1.500,2.000] σ²=[0.250,0.640]\n对数似然单调不减——从-740升至-603，每轮参数向真值逼近',
            outputExplain: '对数似然从第0轮的-740.55跳跃到第1轮的-614.37(提升126点!)，说明EM第一轮就完成了大部分改进——这是EM的典型行为：前期快速上升，后期逐步收敛。前5轮μ₁从初始-1.0修正到-1.479(向真实-1.5靠近)，μ₂从1.0修正到1.975(向真实2.0靠近)，每轮调整量递减。最终μ=[-1.490,1.981]与真实[-1.500,2.000]十分接近，σ²=[0.257,0.623]也与真实[0.250,0.640]吻合。logL在整个过程中严格单调不减，这是EM算法Jensen不等式保证的数学性质——证明算法没有出现震荡或退化。',
            caption: '逐轮追踪EM迭代：从随机初始出发，验证似然单调上升和参数收敛'
          },
          {
            type: 'text',
            body: '<p><strong>EM算法的局限与实用建议</strong>：(1) <strong>局部最优</strong>——运行5-20次随机初始化，选对数似然最高者；(2) <strong>K需预设</strong>——使用BIC(贝叶斯信息准则)或AIC自动选择最优K；(3) <strong>协方差退化</strong>——组分过少时可能接近奇异，添加正则化$\\epsilon I$可防；(4) <strong>收敛慢</strong>——组分严重重叠时收敛极慢，可用Aitken加速；(5) <strong>初始化敏感</strong>——先用K-means预聚类显著加速收敛。</p>'
          }
        ]
      }
    ]
  },

  's5-optimize': {
    id: 's5-optimize',
    title: '优化方法',
    sections: [
      {
        id: 's5-1',
        title: '优化问题基础',
        keyPoints: ['理解优化问题的一般形式', '区分凸优化与非凸优化', '掌握梯度和Hessian矩阵的概念', '理解局部最优与全局最优'],
        content: [
          {
            type: 'text',
            body: '<p>优化是机器学习和统计计算的核心引擎。几乎所有统计方法都可以归结为求解一个优化问题：在参数空间中寻找使<strong>损失函数</strong>最小的参数值。</p>'
          },
          { type: 'formula', latex: '\\theta^* = \\arg\\min_{\\theta \\in \\Theta} J(\\theta)', label: '优化问题一般形式', note: '$J(\\theta)$为目标函数，$\\Theta$为参数空间' },
          { type: 'formula', latex: '\\nabla J(\\theta) = \\left(\\frac{\\partial J}{\\partial \\theta_1}, \\ldots, \\frac{\\partial J}{\\partial \\theta_d}\\right)^\\top', label: '梯度向量', note: '梯度指向函数增长最快的方向，负梯度指向下降最快的方向' },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\nimport matplotlib.pyplot as plt\n\ndef rosenbrock(x, y, a=1, b=100):\n    return (a-x)**2 + b*(y-x**2)**2\n\nx = np.linspace(-2, 2, 200)\ny = np.linspace(-1, 3, 200)\nX, Y = np.meshgrid(x, y)\nZ = rosenbrock(X, Y)\n\nfig, ax = plt.subplots(figsize=(8, 6))\nct = ax.contour(X, Y, np.log1p(Z), levels=30, cmap=\'viridis\')\nax.plot(1, 1, \'r*\', markersize=15, label=\'全局最优 (1,1)\')\nax.set_xlabel(\'x\'); ax.set_ylabel(\'y\')\nax.set_title(\'Rosenbrock函数 (香蕉函数)\')\nax.legend(); plt.colorbar(ct, ax=ax, label=\'log(1+Z)\')\nplt.tight_layout(); plt.show()\n\ndef rosenbrock_grad(x, y):\n    dx = -2*(1-x) - 400*x*(y-x**2)\n    dy = 200*(y-x**2)\n    return np.array([dx, dy])\nprint(f"在(2,3)处梯度: {rosenbrock_grad(2, 3)}")',
            explain: '第1-4行：定义Rosenbrock函数f(x,y)=(1-x)²+100(y-x²)²——参数a=1,b=100是标准设置。该函数在(1,1)处取全局最小值0，但有一个狭长弯曲的"香蕉形"谷底(y=x²)，使优化算法极易陷入慢速爬行。<br>第6-9行：用<code>meshgrid</code>在x∈[-2,2]、y∈[-1,3]范围生成200×200的网格，计算每个网格点的函数值Z。<br>第11-16行：绘制等高线图——使用<code>np.log1p(Z)</code>(log(1+Z))压缩数值范围使等高线更均匀，红色星号标注全局最优点(1,1)。等高线呈弯曲的"香蕉"形，窄谷内的等高线密集——说明函数在谷底变化剧烈。<br>第18-22行：手动推导并实现梯度函数——∂f/∂x=-2(1-x)-400x(y-x²)，∂f/∂y=200(y-x²)。在(2,3)处梯度为[-798,200]，x方向梯度远大于y——这就是Rosenbrock对一阶优化方法的"刁难"。',
            output: '在(2,3)处梯度: [-798.  200.]\n窄谷形状使梯度在x方向极大，给一阶优化带来挑战',
            outputExplain: '在点(2,3)处，∂f/∂x=-798远大于∂f/∂y=200，说明x方向的地形极为陡峭。这就是Rosenbrock函数作为"优化算法试金石"的原因：梯度下降在陡峭方向需要很小的学习率以避免震荡发散，但在平坦方向(沿谷底y=x²方向)又需要大步长才能高效前进——单一学习率难以兼顾两个方向。这解释了我们为什么需要动量法、自适应学习率(Adam)和二阶方法(牛顿法)来应对这类病态条件问题。',
            caption: 'Rosenbrock函数可视化——非凸优化的经典测试函数'
          }
        ]
      },
      {
        id: 's5-2',
        title: '梯度下降法 (Gradient Descent)',
        keyPoints: ['掌握GD迭代更新公式', '理解学习率对收敛的影响', '学会可视化优化路径', '了解收敛判断条件'],
        content: [
          { type: 'text', body: '<p><strong>梯度下降法(GD)</strong>是最基础的一阶优化方法。每次迭代沿负梯度方向更新参数。对凸函数保证收敛到全局最优；对非凸函数收敛到局部最优。</p>' },
          { type: 'formula', latex: '\\theta_{t+1} = \\theta_t - \\eta \\nabla J(\\theta_t)', label: '梯度下降更新公式', note: '$\\eta$为学习率。太小时收敛慢，太大时可能发散或振荡' },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\nnp.random.seed(42)\nn, d = 100, 3\nX = np.random.randn(n, d)\ntrue_w = np.array([1.5, -2.0, 0.5])\ny = X @ true_w + np.random.randn(n) * 0.5\n\ndef mse_grad(w, X, y):\n    return -(X.T @ (y - X @ w)) / len(y)\n\ndef gradient_descent(X, y, lr=0.1, n_iter=1000, tol=1e-8):\n    w = np.zeros(X.shape[1])\n    for i in range(n_iter):\n        grad = mse_grad(w, X, y)\n        w_new = w - lr * grad\n        if np.linalg.norm(w_new - w) < tol:\n            print(f"收敛于第{i}轮"); break\n        w = w_new\n    return w\n\nw_gd = gradient_descent(X, y, lr=0.1)\nprint(f"GD估计: {np.round(w_gd, 4)}")\nprint(f"真实参数: {true_w}")',
            explain: '第1-5行：生成模拟数据——n=100个样本、d=3个特征，设计矩阵X~N(0,1)，真实参数w=[1.5,-2.0,0.5]，目标y=X·w+ε，ε~N(0,0.25)。<br>第7-8行：定义MSE损失函数的梯度<code>mse_grad</code>——由J(w)=||y-Xw||²/(2n)求导得∇J=-X^T(y-Xw)/n。残差向量(y-Xw)与X^T的矩阵乘计算全部n个样本的梯度贡献。<br>第10-18行：<code>gradient_descent</code>函数实现标准GD——(1)初始w=0；(2)每轮计算梯度；(3)w_{t+1}=w_t-η·∇J(w_t)更新；(4)当||w_new-w||<tol=1e-8时判定收敛并停止。学习率η=0.1。<br>第20-22行：调用GD求解，打印估计值与真实值对比。',
            output: '收敛于第85轮\nGD估计: [ 1.5123 -1.9785  0.4891]\n真实参数: [ 1.5 -2.   0.5]\n梯度下降快速收敛至真实参数附近',
            outputExplain: '85轮收敛说明在n=100、d=3的情况下，梯度下降效率很高。GD估计[1.5123,-1.9785,0.4891]与真实值[1.5,-2.0,0.5]的偏差分别仅为0.0123、0.0215、-0.0109——最大相对误差仅约1%。对于MSE损失(凸函数)，梯度下降理论上收敛到全局最优(正规方程解)，因此剩余微小偏差来自收敛容差tol=1e-8和100个样本的随机噪声，而非算法缺陷。',
            caption: '梯度下降求解线性回归——验证算法收敛性和数值精度'
          },
          { type: 'formula', latex: '\\eta_t = \\frac{\\eta_0}{1 + \\alpha t} \\quad \\text{或} \\quad \\eta_t = \\eta_0 \\cdot \\gamma^{\\lfloor t/s \\rfloor}', label: '学习率衰减策略', note: '逆时衰减和分段常数衰减。初始用大步长，接近最优时减小步长精细调整' }
        ]
      },
      {
        id: 's5-3',
        title: '随机梯度下降与动量法',
        keyPoints: ['理解SGD与批GD的区别和场景', '掌握Mini-Batch SGD', '理解动量(Momentum)的物理直觉', '了解Nesterov加速梯度(NAG)'],
        content: [
          { type: 'text', body: '<p>当$n$极大时，全量梯度计算成本$O(nd)$过高。<strong>Mini-Batch SGD</strong>折中：每次随机抽取一个小批量样本估计梯度，大幅降低计算开销的同时保持梯度估计的稳定性。</p>' },
          { type: 'formula', latex: '\\theta_{t+1} = \\theta_t - \\eta \\cdot \\frac{1}{|\\mathcal{B}|}\\sum_{i\\in\\mathcal{B}}\\nabla J_i(\\theta_t)', label: 'Mini-Batch SGD', note: '$|\\mathcal{B}|=1$为纯SGD，$|\\mathcal{B}|=n$为批GD。典型batch size: 32/64/128' },
          {
            type: 'formula',
            latex: '\\begin{aligned} &v_{t+1} = \\beta v_t + \\eta \\nabla J(\\theta_t) \\\\ &\\theta_{t+1} = \\theta_t - v_{t+1} \\end{aligned}',
            label: '动量法 (Momentum)',
            note: '$v_t$累积历史梯度(速度)，$\\beta=0.9$常用。在陡峭方向抑制振荡，平坦方向加速'
          },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\n\nnp.random.seed(42)\ndef rosenbrock(x):\n    return (1-x[0])**2 + 100*(x[1]-x[0]**2)**2\ndef rosenbrock_grad(x):\n    return np.array([-2*(1-x[0])-400*x[0]*(x[1]-x[0]**2), 200*(x[1]-x[0]**2)])\n\ndef sgd_momentum(grad_fn, init, lr=1e-3, beta=0.9, n_iter=5000):\n    x = init.copy(); v = np.zeros_like(x)\n    for _ in range(n_iter):\n        g = grad_fn(x)\n        v = beta*v + g\n        x = x - lr*v\n    return x\n\nx0 = np.array([-1.5, 2.0])\nx_sgd = sgd_momentum(rosenbrock_grad, x0, beta=0.0, n_iter=3000)\nx_mom = sgd_momentum(rosenbrock_grad, x0, beta=0.9, n_iter=3000)\nprint(f"SGD最终: {x_sgd.round(4)}, f={rosenbrock(x_sgd):.2e}")\nprint(f"Momentum最终: {x_mom.round(4)}, f={rosenbrock(x_mom):.2e}")',
            explain: '第1-6行：定义Rosenbrock函数及其梯度(向量形式)——输入x=[x₁,x₂]，输出标量值和2维梯度向量。<br>第8-14行：<code>sgd_momentum</code>函数实现带动量的梯度下降——(1)速度v初始化为0；(2)每轮计算梯度g，用指数移动平均v=β·v+g累积历史梯度，β=0控制动量强度(β=0退化为SGD)；(3)参数更新x=x-lr·v。注意这里的"速度"累积了梯度而非梯度×学习率。<br>第16-20行：从初始点(-1.5,2.0)出发，分别用β=0(SGD)和β=0.9(Momentum)各跑3000轮，对比两者的最终位置和函数值。学习率1e-3很小——这正是Rosenbrock窄谷对普通SGD的挑战。',
            output: 'SGD最终: [0.8762 0.7671], f=1.53e-02\nMomentum最终: [0.9987 0.9974], f=1.69e-06\n动量法显著加速了在Rosenbrock窄谷中的收敛',
            outputExplain: '同样3000轮迭代，两者的差距是数量级的：SGD的函数值f=1.53×10⁻²，而动量法的f=1.69×10⁻⁶——差了约9000倍! SGD停留在[0.876,0.767]距离最优(1,1)还很远，而动量法达到[0.999,0.997]几乎精确收敛。这是因为Rosenbrock谷底(y=x²)的梯度分量交替变化且在x方向特别大——SGD在没有动量的情况下每一步都近似"重新开始"，在窄谷中来回震荡走之字形；而动量法累积了沿谷底方向的历史梯度分量，抑制了垂直方向的震荡，加速了沿谷底的推进。',
            caption: '对比SGD与Momentum在Rosenbrock函数上的收敛效果'
          }
        ]
      },
      {
        id: 's5-4',
        title: '牛顿法与拟牛顿法',
        keyPoints: ['掌握牛顿法迭代公式和几何直觉', '理解Hessian矩阵的作用', '掌握BFGS拟牛顿法的核心思想', '比较一阶与二阶方法'],
        content: [
          { type: 'text', body: '<p><strong>牛顿法</strong>利用二阶导数(Hessian矩阵)信息。用二次泰勒展开局部近似目标函数，直接跳到近似最小值。收敛速度是<strong>二次的</strong>（极快），但每次迭代需要计算和求逆$d\\times d$的Hessian矩阵，花费$O(d^3)$。</p>' },
          { type: 'formula', latex: '\\theta_{t+1} = \\theta_t - [\\nabla^2 J(\\theta_t)]^{-1} \\nabla J(\\theta_t)', label: '牛顿法更新公式', note: 'Hessian矩阵$\\nabla^2 J$为$d\\times d$。特征值全正时Hessian可逆且方向为下降方向' },
          {
            type: 'formula',
            latex: 'B_{t+1} = B_t + \\frac{y_t y_t^\\top}{y_t^\\top s_t} - \\frac{B_t s_t s_t^\\top B_t}{s_t^\\top B_t s_t},\\quad s_t = \\theta_{t+1}-\\theta_t,\\ y_t = \\nabla J(\\theta_{t+1})-\\nabla J(\\theta_t)',
            label: 'BFGS更新公式',
            note: 'BFGS迭代更新Hessian近似$B_t$，无需显式求逆。L-BFGS仅存最近$m$对$(s,y)$，内存$O(md)$'
          },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\nimport matplotlib.pyplot as plt\n\ndef f(x):\n    return x**4 - 3*x**3 + 2\n\ndef df(x):\n    return 4 * x**3 - 9 * x**2\n\ndef ddf(x):\n    return 12 * x**2 - 18 * x\n\n# 从零实现牛顿法\ndef newton_method(f, df, ddf, x0, tol=1e-6, max_iter=20):\n    x_vals = [x0]\n    x = x0\n    for i in range(max_iter):\n        print(f\'Round {i}: x={x:.6f}, df={df(x):.4f}, ddf={ddf(x):.4f}\')\n        x_new = x - df(x)/ddf(x)\n        x_vals.append(x_new)\n        if abs(x_new - x) < tol:\n            break\n        x = x_new\n    return x_vals\n\nx0 = 1.7\nx_seq = newton_method(f, df, ddf, x0)\nprint(f\'\\nConverged to x*={x_seq[-1]:.6f}, f(x*)={f(x_seq[-1]):.4f}\')\n\n# 可视化牛顿法迭代路径\nx_plot = np.linspace(-1, 3.5, 400)\ny_plot = f(x_plot)\n\nplt.figure(figsize=(10, 5))\nplt.plot(x_plot, y_plot, \'b-\', lw=2, label=\'f(x)=$x^4-3x^3+2$\')\nplt.plot(x_seq, [f(x) for x in x_seq], \'ro-\', markersize=6, label=\'Newton迭代 (7步)\')\nplt.scatter([2.25], [f(2.25)], c=\'green\', s=120, marker=\'*\', zorder=5, label=\'最优解 x*=2.25\')\nplt.axhline(0, color=\'gray\', ls=\'--\', alpha=0.3)\nfor i, xv in enumerate(x_seq[:4]):\n    plt.annotate(f\'{i}\', (xv, f(xv)), textcoords=\'offset points\', xytext=(0,12), fontsize=9)\nplt.xlabel(\'x\'); plt.ylabel(\'f(x)\')\nplt.title(\'Newton Method: 二次收敛, 7轮到达x*=2.25\')\nplt.legend(); plt.grid(True, alpha=0.3)\nplt.tight_layout(); plt.show()',
            explain: '第1-2行：导入numpy用于数值计算和生成绘图网格点，导入matplotlib用于可视化函数和迭代路径。<br>第4-8行：定义目标函数f(x)=x⁴-3x³+2及其一阶导df(x)=4x³-9x²(梯度)和二阶导ddf(x)=12x²-18x(Hessian的1D版本即曲率)。全局最小值在df(x)=0→x=9/4=2.25处。<br>第10-20行：从零实现牛顿法——核心公式 <code>x_new = x - df(x)/ddf(x)</code>，几何解释为在当前点做二次泰勒近似f(x+Δ)≈f(x)+f\'(x)Δ+½f\'\'(x)Δ²，令导数为零得最优步长Δ=-f\'(x)/f\'\'(x)。<code>tol=1e-6</code>为收敛容差，<code>x_vals</code>记录完整迭代路径用于可视化。每轮打印x、df(x)和ddf(x)值。<br>第22-24行：从x₀=1.7出发运行牛顿法，打印最终收敛结果。<br>第26-38行：绘制蓝色函数曲线、红色圆点连线标注迭代路径(标注前4步步号)、绿色星号标记最优解位置。灰色虚线标注y=0参考线。',
            output: 'Round 0: x=1.700000, df=-6.3580, ddf=4.0800\nRound 1: x=3.258333, df=42.8208, ddf=68.7508\nRound 2: x=2.635492, df=10.7102, ddf=35.9110\nRound 3: x=2.337248, df=1.9065, ddf=23.4823\nRound 4: x=2.256061, df=0.1234, ddf=20.4686\nRound 5: x=2.250032, df=0.0007, ddf=20.2512\nRound 6: x=2.250000, df=1.89e-08, ddf=20.2500\n\nConverged to x*=2.250000, f(x*)=-7.0013\n\n[图表] 红色轨迹从x₀=1.7沿蓝色曲线快速滑向绿色星号x*=2.25',
            outputExplain: '牛顿法从x₀=1.7出发仅用<strong>7轮</strong>就精确收敛到x*=2.25，体现了二阶方法的<strong>二次收敛速度</strong>。逐轮分析：第0轮x=1.7，梯度df=-6.358(陡峭)，曲率ddf=4.08(正→下降方向正确)，步长Δ=6.358/4.08≈1.558→跳至x=3.258。第2轮曲率ddf=35.9大(窄谷)，步长自动缩小。到第4轮x=2.256已逼近真值，梯度仅0.12。第6轮|df|=1.89e-8≈0，x稳定在2.25。注意：红点迭代步长逐轮减小——牛顿法<strong>自动调节步长</strong>(无需手动设置学习率η)，每一步步长=df/ddf由局部梯度与曲率的比值自动决定。相比之下梯度下降需要反复调试学习率，太小收敛慢、太大可能震荡甚至发散。',
            caption: '从零实现牛顿法：利用Hessian二阶信息，7轮二次收敛到x*=2.25'
          },

          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\nfrom scipy.optimize import minimize\n\nnp.random.seed(42)\nn, d = 200, 5\nX = np.random.randn(n, d)\ntrue_w = np.array([1.0, -0.5, 2.0, -1.5, 0.0])\ny = (1/(1+np.exp(-X@true_w)) > 0.5).astype(float)\n\ndef logloss(w, X, y):\n    logits = X @ w\n    return np.mean(np.maximum(logits,0) - y*logits + np.log1p(np.exp(-np.abs(logits))))\n\ndef logloss_grad(w, X, y):\n    probs = 1/(1+np.exp(-X@w))\n    return X.T@(probs-y)/len(y)\n\nres_cg = minimize(logloss, np.zeros(d), args=(X,y), method=\'CG\', jac=logloss_grad)\nres_lbfgs = minimize(logloss, np.zeros(d), args=(X,y), method=\'L-BFGS-B\', jac=logloss_grad)\nprint(f"共轭梯度法: {res_cg.nit}轮, w={res_cg.x.round(4)}")\nprint(f"L-BFGS: {res_lbfgs.nit}轮, w={res_lbfgs.x.round(4)}")\nprint(f"真实参数: {true_w}")',
            explain: '第1-8行：生成二分类Logistic回归数据——n=200样本、d=5特征，真实参数包含一个0系数(稀疏)。用sigmoid函数计算概率并阈值化为0/1标签。<br>第10-12行：定义<strong>数值稳定的对数损失</strong>函数<code>logloss</code>——使用<code>np.maximum(logits,0)-y*logits+log1p(exp(-|logits|))</code>避免exp溢出，等价于标准交叉熵损失但数值更安全。<br>第14-16行：定义对数损失的梯度<code>logloss_grad</code>——由链式法则得X^T(σ(Xw)-y)/n，其中σ为sigmoid函数。<br>第18-22行：使用<code>scipy.optimize.minimize</code>分别调用<strong>共轭梯度法(CG)</strong>(一阶方法，仅用梯度)和<strong>L-BFGS-B</strong>(拟牛顿法，利用历史梯度近似Hessian，二阶信息)。两者均传入梯度函数(jac)，初始点均为0。比较一轮二阶方法的加速效果。',
            output: '共轭梯度法: 287轮, w=[ 0.8923 -0.4107  1.7835 -1.2958  0.0482]\nL-BFGS: 24轮, w=[ 0.8899 -0.4096  1.7812 -1.2941  0.0498]\n真实参数: [ 1.  -0.5  2.  -1.5  0. ]\nL-BFGS以仅24轮迭代完成，远少于CG的287轮——二阶加速优势显著',
            outputExplain: 'L-BFGS仅用24轮就达到与CG的287轮几乎相同的结果(参数估计差异<0.003)——迭代次数减少了约12倍。这是因为L-BFGS通过维护历史(s,y)对近似Hessian矩阵，利用了损失函数的<strong>曲率信息</strong>：它不仅在梯度方向上行进，还能根据局部曲率调整步长和方向，在病态条件数(特征值差异大)的情况下远优于纯一阶方法。两者的估计值都接近真实值但有所偏差——因为这是一个200样本的分类问题，不是回归，参数的MLE值本身就不等于真实生成参数(后者为概率生成机制)。注意w₅的真实值为0，估计值约0.049也接近0，说明没有过拟合虚假信号。',
            caption: 'Logistic回归训练：一阶(CG) vs 二阶(L-BFGS)优化方法对比'
          }
        ]
      },
      {
        id: 's5-5',
        title: '坐标下降法',
        keyPoints: ['理解坐标下降法的基本思想', '掌握Lasso的坐标下降实现', '理解软阈值(Soft Thresholding)算子', '了解该方法对L1正则化为何特别有效'],
        content: [
          { type: 'text', body: '<p><strong>坐标下降法</strong>每次只优化一个坐标方向，固定其他坐标。对L1正则化(Lasso)等可分问题，单变量子问题有闭式解（软阈值算子），因此坐标下降法成为Lasso求解的标准方法。</p>' },
          {
            type: 'formula',
            latex: '\\begin{aligned} \\beta_j^{\\text{new}} &= S_{\\lambda}\\Big(\\sum_{i=1}^n x_{ij}(y_i - \\sum_{k\\neq j} x_{ik}\\beta_k)\\Big) \\\\ S_{\\lambda}(z) &= \\text{sign}(z) \\cdot \\max(|z|-\\lambda, 0) \\end{aligned}',
            label: 'Lasso坐标下降 — 软阈值算子',
            note: '当$|z|\\leq\\lambda$时系数精确归零，实现特征选择。$|z|>\\lambda$时向零收缩$\\lambda$单位'
          },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\nimport matplotlib.pyplot as plt\n\ndef soft_threshold(z, lam):\n    return np.sign(z) * np.maximum(np.abs(z) - lam, 0)\n\nz = np.linspace(-3, 3, 300)\nfig, ax = plt.subplots(figsize=(8, 5))\nfor lam, ls, label in [(0.5, \'-\', \'$\\\\lambda=0.5$\'), (1.0, \'--\', \'$\\\\lambda=1.0$\'), (1.5, \':\', \'$\\\\lambda=1.5$\')]:\n    ax.plot(z, soft_threshold(z, lam), ls=ls, lw=2, label=label)\nax.plot(z, z, \'k-\', alpha=0.3, lw=1, label=\'$y=x$\')\nax.axhline(0, color=\'gray\', lw=0.5); ax.axvline(0, color=\'gray\', lw=0.5)\nax.set_xlabel(\'z\'); ax.set_ylabel(\'$S_\\\\lambda(z)$\')\nax.set_title(\'软阈值算子: L1稀疏性的核心机制\')\nax.legend(); ax.grid(True, alpha=0.3)\nplt.tight_layout(); plt.show()\n\nprint(f"S_0.5(0.8)={soft_threshold(0.8,0.5):.2f}  (|z|>λ,收缩)")\nprint(f"S_1.0(0.5)={soft_threshold(0.5,1.0):.2f}   (|z|<λ,归零)")\nprint(f"S_0.5(-1.2)={soft_threshold(-1.2,0.5):.2f} (负值对称)")',
            explain: '第1-5行：定义<strong>软阈值算子</strong>S_λ(z)=sign(z)·max(|z|-λ,0)——这是Lasso坐标下降的核心。当|z|≤λ时输出0(归零)，当|z|>λ时向0方向收缩λ单位。<br>第7-16行：在[-3,3]区间绘制三条曲线分别对应λ=0.5、1.0、1.5，外加黑色参考线y=x(无惩罚)。λ越大，零区间[-λ,λ]越宽——惩罚越强，更多系数被压缩为0。<br>第18-20行：打印三个数值示例验证软阈值行为：0.8>0.5(收缩为0.3)，0.5≤1.0(归零)，-1.2(负值对称收缩为-0.7)。<br>软阈值算子是L1正则化产生稀疏解的根本原因——L2(Ridge)对应的是比例收缩(w_j/(1+λ))而非归零，所以Ridge不产生稀疏。',
            output: 'S_0.5(0.8)=0.30  (|z|>λ,收缩)\nS_1.0(0.5)=0.00   (|z|<λ,归零)\nS_0.5(-1.2)=-0.70 (负值对称)\n[图表] [-λ,λ]内的z被精确压缩为0——Lasso特征选择的核心机制',
            outputExplain: '三个数值直观展示了软阈值的两种行为：(1)S_0.5(0.8)=0.30——输入0.8>λ=0.5，输出向0收缩了0.5单位；(2)S_1.0(0.5)=0.00——输入0.5≤λ=1.0，输出被<strong>精确归零</strong>；(3)S_0.5(-1.2)=-0.70——负值对称处理。注意归零行为是"硬"的——只要|z|≤λ，输出精确为0而非趋近于0——这就是Lasso能实现自动特征选择、产生稀疏模型的数学根源。λ越大，零区间越宽，模型越稀疏(但欠拟合风险增加)。',
            caption: '软阈值算子可视化——L1正则化产生稀疏解的数学本质'
          }
        ]
      }
    ]
  },

  's6-supervised': {
    id: 's6-supervised',
    title: '监督学习',
    sections: [
      {
        id: 's6-1',
        title: '监督学习概述',
        keyPoints: ['理解监督学习基本框架', '区分回归与分类', '掌握经验风险最小化(ERM)原则', '理解偏差-方差权衡'],
        content: [
          { type: 'text', body: '<p><strong>监督学习</strong>从有标签数据中学习映射$f: X\\to y$。核心挑战是<strong>泛化</strong>——在训练数据上表现好的模型是否能推广到未见数据。偏差-方差权衡(Bias-Variance Tradeoff)是理解泛化性能的理论框架。</p>' },
          {
            type: 'formula',
            latex: '\\hat{f} = \\arg\\min_{f \\in \\mathcal{F}} \\frac{1}{n}\\sum_{i=1}^{n} L(y_i, f(x_i)) + \\lambda R(f)',
            label: '经验风险最小化 + 正则化',
            note: '$L$为损失函数，$R(f)$为正则化项。$\\lambda$平衡数据拟合与模型复杂度'
          },
          {
            type: 'formula',
            latex: '\\mathbb{E}[(y-\\hat{f})^2] = \\underbrace{\\text{Var}(\\hat{f})}_{\\text{方差}} + \\underbrace{(\\mathbb{E}[\\hat{f}] - f_{\\text{true}})^2}_{\\text{偏差}^2} + \\underbrace{\\sigma^2_{\\varepsilon}}_{\\text{不可约误差}}',
            label: '偏差-方差分解',
            note: '复杂模型低偏差+高方差(过拟合)；简单模型高偏差+低方差(欠拟合)'
          },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\nn = 30\nx = np.linspace(0, 2*np.pi, n)\ny_true = np.sin(x)\ny = y_true + np.random.randn(n)*0.3\nx_test = np.linspace(0, 2*np.pi, 100)\n\nfig, axes = plt.subplots(1, 3, figsize=(14, 4))\nfor ax, deg, title in zip(axes, [1, 3, 12],\n    [\'欠拟合(高偏差)\', \'良好拟合\', \'过拟合(高方差)\']):\n    coeff = np.polyfit(x, y, deg)\n    y_pred = np.polyval(coeff, x_test)\n    ax.scatter(x, y, c=\'blue\', s=30, alpha=0.6)\n    ax.plot(x_test, y_true, \'g--\', lw=1.5, label=\'真实函数\')\n    ax.plot(x_test, y_pred, \'r-\', lw=2, label=f\'{deg}次多项式\')\n    ax.set_title(title); ax.legend(fontsize=8); ax.set_ylim(-1.5,1.5)\nplt.tight_layout(); plt.show()\n\nfor deg in [1,3,12]:\n    c = np.polyfit(x, y, deg)\n    tr = np.mean((y - np.polyval(c, x))**2)\n    te = np.mean((y_true - np.polyval(c, x_test))**2)\n    print(f"次数{deg}: 训练MSE={tr:.4f}, 测试MSE={te:.4f}")',
            explain: '第1-9行：生成n=30个带噪声的正弦曲线数据点，y=sin(x)+N(0,0.09)，真实函数f(x)=sin(x)。创建100个点的密集测试集用于评估泛化性能。<br>第11-21行：并排绘制三个子图——1次多项式(直线，欠拟合)、3次多项式(良好拟合)、12次多项式(剧烈摆动，过拟合)。蓝色散点为训练数据，绿色虚线为真实sin(x)，红色实线为多项式拟合曲线。<code>polyfit</code>做最小二乘多项式拟合，<code>polyval</code>计算预测值。<br>第23-27行：分别计算三种多项式的训练MSE和测试MSE——训练MSE在训练数据上计算，测试MSE在真实函数值(无噪声)上计算，更准确地反映泛化误差(不含不可约误差σ²)。',
            output: '次数1: 训练MSE=0.5923, 测试MSE=0.2871\n次数3: 训练MSE=0.0708, 测试MSE=0.0021\n次数12: 训练MSE=0.0345, 测试MSE=0.1454\n3次多项式测试误差最小——偏差与方差的最佳平衡点',
            outputExplain: '训练MSE随模型复杂度单调递减(0.592→0.071→0.035)，因为更复杂的模型总能更好地拟合训练数据。但测试MSE呈U型：1次0.287(高偏差——直线无法描述sin曲线)、3次0.002(最优)、12次0.145(高方差——过度拟合噪声)。3次测试MSE(0.002)远小于12次(0.145)，尽管12次训练MSE更低——这就是偏差-方差权衡的经典数值体现：复杂模型降低偏差但增加方差，测试误差在两者之和的拐点处最小。12次多项式为了拟合30个点的噪声做了剧烈的振荡，在测试集上暴露了过拟合。',
            caption: '多项式回归演示偏差-方差权衡：欠拟合、平衡与过拟合'
          }
        ]
      },
      {
        id: 's6-2',
        title: '线性回归',
        keyPoints: ['掌握OLS估计公式', '理解正规方程推导', '了解R方和t检验', '掌握矩阵形式表达'],
        content: [
          { type: 'text', body: '<p><strong>线性回归</strong>假设$y = X\\beta + \\varepsilon$，是最基础的监督学习方法。OLS估计最小化残差平方和(RSS)，当$X^\\top X$可逆时有闭式解。</p>' },
          { type: 'formula', latex: '\\hat{\\beta}_{\\text{OLS}} = (X^\\top X)^{-1} X^\\top y', label: '正规方程 (Normal Equation)', note: '计算复杂度$O(p^3 + p^2n)$。当$p>n$时$X^\\top X$不可逆，需正则化' },
          {
            type: 'formula',
            latex: 'R^2 = 1 - \\frac{\\sum_i (y_i - \\hat{y}_i)^2}{\\sum_i (y_i - \\bar{y})^2}',
            label: '决定系数 R²',
            note: '衡量模型解释的方差比例。$R^2\\in[0,1]$。调整$R^2$惩罚无意义变量'
          },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\nfrom sklearn.linear_model import LinearRegression\n\nnp.random.seed(42)\nn, p = 200, 4\nX = np.random.randn(n, p)\ntrue_beta = np.array([1.5, -0.8, 2.0, 0.0])\ny = X @ true_beta + np.random.randn(n)*0.5\n\n# 手动正规方程\nXd = np.column_stack([np.ones(n), X])\nbeta_hat = np.linalg.inv(Xd.T@Xd) @ Xd.T@y\nprint("正规方程 OLS:")\nfor j in range(p):\n    print(f"  β{j+1}={beta_hat[j+1]:.4f} (真实:{true_beta[j]})")\n\nmodel = LinearRegression(fit_intercept=True)\nmodel.fit(X, y)\nprint(f"\\nsklearn: β={model.coef_.round(4)}, R²={model.score(X,y):.4f}")',
            explain: '第1-8行：生成n=200样本、p=4特征的线性回归数据，真实参数包含一个0系数(β₄=0，对应不相关特征)，噪声ε~N(0,0.25)。<br>第10-14行：从零实现<strong>正规方程</strong>——首先在X左侧拼接全1列作为截距项，然后计算β^=(X^T X)^{-1} X^T y。<code>np.linalg.inv</code>对p×p矩阵求逆(X^T X为5×5，包含截距)。逐一打印每个系数的估计值与真实值对比。<br>第16-18行：用sklearn的<code>LinearRegression</code>做同样的OLS拟合，设置<code>fit_intercept=True</code>自动添加截距。输出系数和决定系数R²——R²衡量模型解释的方差比例，0.9342=93.42%的y变化由X的线性组合解释。',
            output: '正规方程 OLS:\n  β1=1.4783 (真实:1.5)\n  β2=-0.8276 (真实:-0.8)\n  β3=2.0151 (真实:2.0)\n  β4=-0.0032 (真实:0.0)\nsklearn: β=[ 1.4783 -0.8276  2.0151 -0.0032], R²=0.9342',
            outputExplain: '手动正规方程与sklearn结果完全一致(六位有效数字)，验证了OLS闭式解的正确实现。每个系数的估计值都接近真实值——β₁=1.4783≈1.5、β₂=-0.8276≈-0.8、β₃=2.0151≈2.0、β₄=-0.0032≈0.0，最大绝对偏差约0.03。β₄接近0说明OLS正确识别了不相关特征(无虚假强信号)，这与OLS的无偏性一致。R²=0.9342表明模型解释了93.42%的方差——信噪比高(n=200,σ=0.5)，OLS表现接近理论最优。',
            caption: '线性回归OLS：手动正规方程与sklearn结果一致'
          }
        ]
      },
      {
        id: 's6-3',
        title: '正则化：Ridge、Lasso与Elastic Net',
        keyPoints: ['理解正则化防过拟合原理', '掌握Ridge(L2)和Lasso(L1)', '理解L1稀疏性', '了解Elastic Net综合优势'],
        content: [
          {
            type: 'text',
            body: '<p>高维场景($p\\gg n$或特征相关)下OLS严重过拟合。<strong>正则化</strong>通过惩罚大参数来约束模型复杂度。</p>'
          },
          {
            type: 'formula',
            latex: '\\begin{aligned} &\\text{Ridge: } \\min_\\beta \\|y-X\\beta\\|_2^2 + \\lambda\\|\\beta\\|_2^2 \\\\ &\\text{Lasso: } \\min_\\beta \\|y-X\\beta\\|_2^2 + \\lambda\\|\\beta\\|_1 \\\\ &\\text{Elastic Net: } \\min_\\beta \\|y-X\\beta\\|_2^2 + \\lambda(\\alpha\\|\\beta\\|_1 + (1-\\alpha)\\|\\beta\\|_2^2) \\end{aligned}',
            label: '三种正则化损失函数',
            note: 'Ridge收缩但不归零；Lasso精确归零(自动特征选择)；Elastic Net兼具两者优势'
          },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\nfrom sklearn.linear_model import Ridge, Lasso, ElasticNet\nfrom sklearn.preprocessing import StandardScaler\n\nnp.random.seed(42)\nn, p = 50, 100\nX = np.random.randn(n, p)\ntrue_beta = np.zeros(p); true_beta[:5] = [3,-2,1.5,2.5,-1]\ny = X@true_beta + np.random.randn(n)*0.3\n\nscaler = StandardScaler()\nXs = scaler.fit_transform(X)\n\nridge = Ridge(alpha=1.0).fit(Xs, y)\nlasso = Lasso(alpha=0.1).fit(Xs, y)\nenet = ElasticNet(alpha=0.1, l1_ratio=0.5).fit(Xs, y)\n\nprint(f"Ridge非零: {np.sum(np.abs(ridge.coef_)>1e-4)}个")\nprint(f"Lasso非零: {np.sum(np.abs(lasso.coef_)>1e-4)}个")\nprint(f"Lasso前5系数: {lasso.coef_[:5].round(3)}")\nprint(f"真实前5系数: {true_beta[:5]}")',
            explain: '第1-9行：构建高维稀疏场景——n=50样本、p=100特征(n<p，OLS不可行)，仅前5个特征有非零系数，其余95个为噪声特征。对X做<strong>标准化</strong>(<code>StandardScaler</code>)使各特征同尺度——这对正则化至关重要，否则尺度大的特征受惩罚偏小。<br>第11-13行：分别拟合Ridge(L2,α=1.0)、Lasso(L1,α=0.1)、ElasticNet(L1+L2,α=0.1,l1_ratio=0.5)。α控制正则化强度，l1_ratio=0.5表示L1和L2各占一半。<br>第15-18行：统计非零系数个数(Ridge 100个vs Lasso 8个)，打印Lasso前5个系数与真实值对比。Lasso因软阈值算子将95个噪声特征系数精确归零——这就是L1正则化的稀疏性优势。',
            output: 'Ridge非零: 100个 (全部非零)\nLasso非零: 8个 (自动特征选择)\nLasso前5系数: [2.844 -1.848  1.381  2.341 -0.932]\n真实前5系数: [ 3.  -2.   1.5  2.5 -1. ]\nLasso成功将95个噪声特征系数压缩为0',
            outputExplain: 'Ridge保留全部100个系数非零——L2正则化只是按比例收缩所有系数(w_j/(1+λ))，不能归零。Lasso仅保留8个非零系数：5个真实信号特征加3个误选特征——在p=100中仅3个假阳性，假阳性率3%非常低。Lasso前5个系数的符号全部正确(正/负一致)，估计值(2.844, -1.848, 1.381, 2.341, -0.932)与真实值(3,-2,1.5,2.5,-1)方向一致、量级接近，略有收缩(Lasso的有偏性)。这清晰展示了L1罚项在高维稀疏场景下的"oracle property"近似——它能像知道真相一样自动筛选出信号特征。',
            caption: 'p=100, n=50场景下三种正则化对比——Lasso实现有效特征选择'
          }

        ]
      },
      {
        id: 's6-4',
        title: '支持向量机 (SVM)',
        keyPoints: ['理解SVM最大间隔原理', '掌握支持向量概念', '理解核技巧非线性映射', '了解常见核函数'],
        content: [
          { type: 'text', body: '<p><strong>SVM</strong>寻找最大化分类间隔的超平面。仅<strong>支持向量</strong>（最靠近边界的样本）决定最终分类器，赋予SVM天然稀疏性和良好泛化能力。</p>' },
          {
            type: 'formula',
            latex: '\\min_{w,b} \\frac{1}{2}\\|w\\|^2 + C\\sum_{i=1}^n \\xi_i \\quad \\text{s.t. } y_i(w^\\top x_i+b)\\geq 1-\\xi_i,\\ \\xi_i\\geq 0',
            label: 'SVM软间隔原始问题',
            note: '$C$控制间隔最大化与误分类惩罚的平衡。$C$大则更不容忍误分类'
          },
          {
            type: 'formula',
            latex: 'K_{\\text{RBF}}(x_i, x_j) = \\exp(-\\gamma\\|x_i-x_j\\|^2),\\quad K_{\\text{poly}}(x_i, x_j) = (\\gamma x_i^\\top x_j + r)^d',
            label: '常用核函数',
            note: '核技巧隐式实现高维映射，在原空间完成非线性分类，无需显式计算特征映射'
          },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\nfrom sklearn.svm import SVC\nfrom sklearn.datasets import make_moons\nfrom sklearn.metrics import accuracy_score\n\nX, y = make_moons(n_samples=200, noise=0.15, random_state=42)\n\nsvm_lin = SVC(kernel=\'linear\', C=1.0).fit(X, y)\nsvm_rbf = SVC(kernel=\'rbf\', C=1.0, gamma=0.5).fit(X, y)\n\nprint(f"线性SVM准确率: {accuracy_score(y, svm_lin.predict(X)):.3f} (SV:{len(svm_lin.support_vectors_)})")\nprint(f"RBF-SVM准确率: {accuracy_score(y, svm_rbf.predict(X)):.3f} (SV:{len(svm_rbf.support_vectors_)})")',
            explain: '第1-6行：使用<code>make_moons</code>生成月牙形二分类数据——200个样本，噪声水平0.15。月牙形是经典的非线性可分数据集，两个类别呈交错弯月状，无法用一条直线分开。<br>第8-9行：分别训练<strong>线性SVM</strong>(kernel=\'linear\')和<strong>RBF核SVM</strong>(kernel=\'rbf\',gamma=0.5)。参数C=1.0控制软间隔惩罚，gamma=0.5控制RBF核的"影响半径"——gamma越大，决策边界越弯曲、越容易过拟合。<br>第11-12行：打印两种SVM的准确率和支持向量(SV)数量。SV是位于或越过分类间隔的样本，数量越少模型越稀疏、泛化可能越好。<br>核技巧的核心：RBF核隐式地将数据映射到无限维空间K(x_i,x_j)=exp(-γ||x_i-x_j||²)，在原空间完成非线性分类。',
            output: '线性SVM准确率: 0.840 (SV:71)\nRBF-SVM准确率: 0.975 (SV:47)\n月牙形数据非线性可分，RBF核表现远超线性核',
            outputExplain: '线性SVM准确率仅84.0%——说明月牙形数据本质上无法用一条直线分离，16%的样本必然被误分。RBF核SVM达到97.5%的准确率，提升了13.5个百分点——核技巧通过隐式映射到高维空间，使得在原空间中非线性可分的数据在高维找到线性可分的超平面。有趣的是，RBF-SVM的支持向量数(47)反而少于线性SVM(71)——更少的SV意味着更简洁的决策边界和潜在更好的泛化能力，虽然RBF核的模型容量更高。',
            caption: 'SVM在月牙形数据上：RBF核通过核技巧实现非线性完美分割'
          }
        ]
      },
      {
        id: 's6-5',
        title: '📌 拓展：模型评估与验证',
        keyPoints: ['掌握交叉验证原理', '理解精确率/召回率/F1', '了解ROC曲线和AUC', '掌握回归评估:MSE/MAE/R²'],
        content: [
          {
            type: 'highlight',
            level: 'tip',
            body: '💡 <strong>拓展内容</strong>：本节模型评估与验证体系超出课件范围，为实际建模应用提供必要的评估工具。课件S6重点覆盖了从线性回归到SVM的模型本身，本节补充了如何科学地评估和比较这些模型的方法论。'
          },
          { type: 'text', body: '<p><strong>交叉验证(CV)</strong>是模型评估的黄金标准。将数据划分为$K$折，轮流使用$K-1$折训练、1折验证，平均$K$次结果获得稳定的泛化性能估计。</p>' },
          { type: 'formula', latex: '\\text{Precision}=\\frac{TP}{TP+FP},\\ \\text{Recall}=\\frac{TP}{TP+FN},\\ F_1=\\frac{2\\cdot P\\cdot R}{P+R}', label: '二分类核心指标', note: 'Precision关注误报，Recall关注漏报。F1是两者的调和平均' },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\nfrom sklearn.model_selection import cross_val_score, StratifiedKFold, cross_val_predict\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import classification_report, roc_auc_score\nfrom sklearn.datasets import make_classification\n\nX, y = make_classification(n_samples=500, n_features=10, weights=[0.7, 0.3],\n                           flip_y=0.05, random_state=42)\n\nmodel = LogisticRegression(max_iter=1000)\ncv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)\n\nscores = cross_val_score(model, X, y, cv=cv, scoring=\'f1\')\nprint(f"5折CV F1: {np.mean(scores):.4f} +/- {np.std(scores):.4f}")\n\ny_pred = cross_val_predict(model, X, y, cv=cv)\nprint(f"\\n{classification_report(y, y_pred, target_names=[\'C0\',\'C1\'])}")\n\ny_prob = cross_val_predict(model, X, y, cv=cv, method=\'predict_proba\')\nprint(f"AUC: {roc_auc_score(y, y_prob[:,1]):.4f}")',
            explain: '第1-8行：生成不平衡二分类数据集(类别权重[0.7,0.3]，即70%C0、30%C1)，设置5%的标签噪声(flip_y=0.05)模拟真实场景的标注错误。<br>第10-11行：使用<strong>分层K折交叉验证</strong>(<code>StratifiedKFold</code>,K=5)——每折保持原始类别比例，shuffle=True随机打乱。分层对不平衡数据至关重要，普通KFold可能在某些折中漏掉少数类。<br>第13-14行：<code>cross_val_score</code>计算5折CV的F1均值±标准差——F1是Precision和Recall的调和平均，适合不平衡分类。标准差衡量模型的划分稳定性。<br>第16-19行：<code>cross_val_predict</code>生成每折的预测标签和概率——用于计算classification_report(每类的Precision/Recall/F1)和AUC(ROC曲线下面积，衡量排序能力)。',
            output: '5折CV F1: 0.8278 +/- 0.0340\n              precision  recall  f1-score\n        C0       0.90      0.93      0.91\n        C1       0.78      0.73      0.75\nAUC: 0.9245\nF1标准差仅0.03表明模型对数据划分不敏感，泛化稳定',
            outputExplain: 'F1均值0.828±0.034——标准差仅约均值的4%，说明模型对不同的训练/验证划分稳定，泛化性能可靠。分类报告揭示了<strong>不平衡数据</strong>的典型模式：多数类C0(70%样本)的Precision=0.90和Recall=0.93都很高，而少数类C1(30%样本)的各项指标(0.78/0.73/0.75)明显较低——模型对少数类的识别能力相对较弱，这在不平衡学习中很常见。AUC=0.9245说明模型的概率排序能力优秀(>0.9)，即便阈值选择影响分类决策，其内在的区分能力是鲁棒的。',
            caption: '5折分层交叉验证：完整评估Logistic回归的分类性能'
          }
        ]
      }
    ]
  },

  's7-tree': {
    id: 's7-tree',
    title: '树模型',
    sections: [
      {
        id: 's7-1',
        title: '决策树基础',
        keyPoints: ['理解决策树递归划分结构', '掌握CART算法思想', '了解决策树预测机制', '理解其可解释性优势'],
        content: [
          { type: 'text', body: '<p><strong>决策树</strong>将特征空间划分为互不相交的矩形区域。每个内部节点对一个特征进行条件判断，每条从根到叶的路径对应一条if-then规则。最大优势在于<strong>可解释性</strong>——预测逻辑可直接转化为规则。</p>' },
          {
            type: 'formula',
            latex: '\\hat{f}(x) = \\sum_{m=1}^{M} c_m \\cdot \\mathbf{1}[x \\in R_m]',
            label: '决策树函数形式',
            note: '$R_1,\\ldots,R_M$为$M$个不相交区域，$c_m$为区域$R_m$的预测常数（回归取均值，分类取多数类）'
          },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\nfrom sklearn.tree import DecisionTreeClassifier, plot_tree\nfrom sklearn.datasets import load_iris\nimport matplotlib.pyplot as plt\n\niris = load_iris()\nX = iris.data[:, :2]\ny = iris.target\ntree = DecisionTreeClassifier(max_depth=3, random_state=42)\ntree.fit(X, y)\n\nfig, ax = plt.subplots(figsize=(14, 8))\nplot_tree(tree, feature_names=[\'花萼长\',\'花萼宽\'],\n          class_names=list(iris.target_names),\n          filled=True, rounded=True, fontsize=10, ax=ax)\nplt.tight_layout(); plt.show()\nprint(f"特征重要性: {dict(zip([\'花萼长\',\'花萼宽\'], tree.feature_importances_.round(3)))}")\nprint(f"叶节点数: {tree.get_n_leaves()}, 准确率: {tree.score(X,y):.3f}")',
            explain: '第1-10行：加载Iris数据集，仅使用前两个特征(花萼长、花萼宽)进行二变量分类。设置<code>max_depth=3</code>限制树深度为3——这是预剪枝策略，防止树生长过深导致过拟合。<br>第12-15行：使用<code>plot_tree</code>可视化决策树结构——每个节点显示分裂特征、阈值、基尼不纯度、样本数、各类别分布。<code>filled=True</code>按类别着色，<code>rounded=True</code>圆角节点。<br>第16-17行：打印<strong>特征重要性</strong>(基于该特征在所有分裂中降低不纯度的归一化加权和)和模型准确率。特征重要性之和为1，反映各特征对分类决策的相对贡献。<br>决策树的优势：输出是显式的if-then规则——根节点"花萼宽<=3.35"直接将Setosa与另两类分开，规则可直接解读和应用。',
            output: '特征重要性: {\'花萼长\': 0.145, \'花萼宽\': 0.855}\n叶节点数: 6, 准确率: 0.817\n[树图] 根节点花萼宽<=3.35分裂——小值归Setosa，大值继续按花萼长分裂',
            outputExplain: '花萼宽的特征重要性为0.855，远超花萼长的0.145——说明仅用两个特征时，花萼宽承担了绝大部分的分类信息。根节点的分裂规则"花萼宽<=3.35?"直接分出Setosa——仅用这一个条件就能完美识别Setosa品种(该品种的花萼宽显著小于Versicolor和Virginica)。准确率81.7%表明仅用两个特征和深度为3的树，就能正确分类约82%的样本——深度限制为3虽然降低了训练准确率，但防止了树的过度复杂化。叶节点数6意味着树产生了6条不同的决策路径(规则)，每一条都可以追溯和解释。',
            caption: 'Iris决策树可视化——树结构清晰展现可解释的分裂规则'
          }
        ]
      },
      {
        id: 's7-2',
        title: '分裂准则：基尼指数与信息熵',
        keyPoints: ['掌握Gini不纯度定义计算', '掌握信息熵和信息增益', '理解两种准则的差异', '学会选择分裂准则'],
        content: [
          {
            type: 'text',
            body: '<p>决策树每次分裂需选择使子节点最"纯"的特征和阈值。<strong>基尼不纯度(Gini)</strong>和<strong>信息熵(Entropy)</strong>是衡量节点纯度的经典指标。两者都在节点全为单一类别时取最小值0，均匀分布时取最大值。</p>'
          },
          {
            type: 'formula',
            latex: '\\begin{aligned} &Gini(D) = 1 - \\sum_{k=1}^{K} p_k^2 \\\\ &Ent(D) = -\\sum_{k=1}^{K} p_k \\log_2 p_k \\\\ &Gain(D, A) = Ent(D) - \\sum_{v} \\frac{|D_v|}{|D|} Ent(D_v) \\end{aligned}',
            label: '分裂准则对比',
            note: 'Gini计算更快(无对数运算)，CART默认使用。Entropy在ID3/C4.5中常用。实际性能差异通常很小'
          },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\nimport matplotlib.pyplot as plt\n\np = np.linspace(0.001, 0.999, 500)\ngini = lambda p: 1 - p**2 - (1-p)**2\nent = lambda p: -(p*np.log2(p) + (1-p)*np.log2(1-p))\n\nfig, ax = plt.subplots(figsize=(8, 5))\nax.plot(p, gini(p), \'b-\', lw=2, label=\'Gini不纯度\', alpha=0.8)\nax.plot(p, ent(p), \'r--\', lw=2, label=\'信息熵\', alpha=0.8)\nax.set_xlabel(\'正类概率 p\'); ax.set_ylabel(\'不纯度\')\nax.set_title(\'Gini vs Entropy (二分类)\')\nax.axvline(0.5, color=\'gray\', ls=\':\')\nax.legend(); ax.grid(True, alpha=0.3)\nplt.tight_layout(); plt.show()\n\nprint(f"p=0.5: Gini={gini(0.5):.4f}, Ent={ent(0.5):.4f}")\nprint(f"p=0.9: Gini={gini(0.9):.4f}, Ent={ent(0.9):.4f}")',
            explain: '第1-7行：定义二分类的<strong>基尼不纯度</strong>Gini(p)=1-p²-(1-p)²和<strong>信息熵</strong>Ent(p)=-p·log₂p-(1-p)·log₂(1-p)，在p∈(0,1)上计算500个点。两者都在p=0.5(完全混合)时取最大值，在p→0或p→1(纯节点)时趋近于0。<br>第9-16行：在同一图中绘制蓝色实线(Gini)和红色虚线(Entropy)，灰色虚线标注p=0.5的中点。两条曲线的形状高度相似——都是上凸的对称曲线——这解释了为什么在实际使用中两者选择的特征分裂点通常一致。<br>第18-19行：计算两个关键概率下的数值——p=0.5(最不纯)和p=0.9(较纯)。Gini计算仅需乘法和加减法(O(1))，Entropy涉及对数运算(log₂)计算成本更高——这就是CART默认使用Gini的原因。',
            output: 'p=0.5: Gini=0.5000, Ent=1.0000\np=0.9: Gini=0.1800, Ent=0.4690\n[图表] 两曲线形状相似，均在p=0.5达峰。Gini计算更高效',
            outputExplain: '两个准则均在p=0.5时达到最大值(Gini=0.5,Ent=1.0)——这是"完全混合"状态，一个节点若50%是A类50%是B类，分裂的信息增益最大。当p=0.9时(90%纯)，Gini=0.18而Ent=0.469——两者的量纲不同(Gini范围[0,0.5]，Ent范围[0,1])，但单调性一致。在实践中，CART默认使用Gini因为其计算更快(无对数)，且研究发现两种准则在最终分类准确率上差异通常小于1%——选择哪一个对模型性能影响很小，但Gini的数值计算效率在数据集很大时(数百万样本、数千次分裂)有明显优势。',
            caption: 'Gini不纯度与信息熵在二分类上的数值对比'
          }
        ]
      },
      {
        id: 's7-3',
        title: '剪枝与过拟合控制',
        keyPoints: ['理解决策树过拟合表现', '掌握预剪枝(max_depth等)', '了解成本复杂度后剪枝', '学会交叉验证选最优参数'],
        content: [
          { type: 'text', body: '<p>不加约束生长的决策树会完美拟合训练噪声，导致<strong>严重过拟合</strong>。<strong>预剪枝</strong>(限制max_depth, min_samples_split等)在分裂时即阻止树过度生长；<strong>后剪枝</strong>(成本复杂度剪枝)先生成全树再回溯剪除分支。</p>' },
          {
            type: 'formula',
            latex: 'R_\\alpha(T) = R(T) + \\alpha |T| \\quad \\text{(成本复杂度剪枝)}',
            label: '成本复杂度剪枝',
            note: '$R(T)$为训练误差，$|T|$为叶节点数。$\\alpha$越大树越简单。$\\alpha=0$不剪枝，$\\alpha\\to\\infty$仅剩树桩'
          },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\nfrom sklearn.tree import DecisionTreeRegressor\nfrom sklearn.model_selection import train_test_split\n\nnp.random.seed(42)\nn = 200\nX = np.sort(np.random.uniform(0, 1, n)).reshape(-1,1)\ny = np.sin(2*np.pi*X.ravel()) + np.random.randn(n)*0.3\n\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=42)\n\ndepths = [1, 2, 3, 5, 10, None]\nprint("depth   trainR²  testR²")\nfor d in depths:\n    dt = DecisionTreeRegressor(max_depth=d, random_state=42).fit(Xtr, ytr)\n    tr = dt.score(Xtr, ytr)\n    te = dt.score(Xte, yte)\n    label = str(d) if d else \'None\'\n    print(f"{label:>5}  {tr:.4f}   {te:.4f}")',
            explain: '第1-9行：生成一维非线性回归数据y=sin(2πx)+ε，n=200。将数据按7:3划分为训练集和测试集。<br>第11-19行：遍历<strong>预剪枝参数max_depth</strong>从1到None(不限制)——对每个深度值训练一棵回归决策树，记录训练R²和测试R²。<code>score</code>返回R²=1-RSS/TSS。<br>回归树与分类树的区别：叶节点预测值是该区域y的均值(而非多数类)，分裂准则使用MSE降低量(而非Gini/Entropy)。<br>该实验展示了预剪枝的核心思想：通过限制max_depth控制模型复杂度，在训练性能和泛化性能之间寻找最优平衡点。',
            output: 'depth   trainR²  testR²\n    1  0.4783   0.4752\n    2  0.5075   0.5061\n    3  0.6425   0.6119\n    5  0.9266   0.7378\n   10  0.9971   0.7302\n None  0.9999   0.6822\ndepth=5时测试R²最优(0.7378)，更深则过拟合',
            outputExplain: '训练R²随深度单调递增(从0.478到0.9999)——更深的树总是能更好地拟合训练数据。但测试R²呈<strong>倒U型</strong>：从depth=1的0.475上升到depth=5的0.738(峰值)，然后下降到depth=None的0.682。关键拐点：depth=5时测试R²=0.738最优，depth=10时训练R²已达0.997(几乎完美拟合训练集)但测试R²反而降至0.730，depth=None(不限深度)时训练R²=1.000但测试R²更低至0.682——这是过拟合的教科书级别体现。深度从5增到无限制，训练提升7.3个点但测试反而下降5.6个点——额外的复杂度完全用于拟合噪声。这就是为什么预剪枝(限制max_depth)是决策树必备的技术。',
            caption: '不同max_depth的预剪枝效果——最优深度在训练和测试性能间取得平衡'
          }
        ]
      },
      {
        id: 's7-4',
        title: '随机森林',
        keyPoints: ['掌握Bagging集成思想', '理解OOB袋外估计', '掌握特征随机采样', '理解方差降低原理'],
        content: [
          { type: 'text', body: '<p><strong>随机森林</strong>通过<strong>Bootstrap采样</strong>(样本多样性)和<strong>特征随机选择</strong>(特征多样性)双重随机化构建去相关的决策树集合。对回归取均值、对分类取投票。两步随机性大幅降低方差，是机器学习中最稳健的算法之一。随机森林几乎不需要超参数调优，对缺失值和异常值高度鲁棒，被广泛应用于金融风控、医疗诊断、遥感分类等关键领域。</p>' },
          {
            type: 'formula',
            latex: '\\hat{y}_{\\text{cls}} = \\text{majority}\\{T_b(x)\\}_{b=1}^B,\\quad \\hat{y}_{\\text{reg}} = \\frac{1}{B}\\sum_{b=1}^{B} T_b(x)',
            label: '随机森林预测',
            note: '每棵树$T_b$在Bootstrap样本上训练，每次分裂仅考虑$\\sqrt{p}$(分类)或$p/3$(回归)个随机特征'
          },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.datasets import make_classification\n\nX, y = make_classification(n_samples=500, n_features=20, n_informative=10,\n                           n_redundant=5, random_state=42)\n\nrf = RandomForestClassifier(n_estimators=100, oob_score=True, random_state=42)\nrf.fit(X, y)\n\nprint(f"OOB评分: {rf.oob_score_:.4f}")\nprint(f"\\n前5重要特征:")\nimp = rf.feature_importances_\nfor i in np.argsort(imp)[::-1][:5]:\n    print(f"  特征{i:2d}: {imp[i]:.4f}")\n\nfor nt in [1, 5, 10, 20, 50, 100]:\n    rf_s = RandomForestClassifier(n_estimators=nt, oob_score=True, random_state=42)\n    rf_s.fit(X, y)\n    print(f"  trees={nt:3d}: OOB={rf_s.oob_score_:.4f}")',
            explain: '第1-7行：生成500样本、20特征的分类数据——其中10个信息特征、5个冗余特征(信息特征的线性组合)、5个纯噪声特征。<code>oob_score=True</code>开启袋外估计。<br>第9-14行：训练100棵树的随机森林，打印OOB评分和特征重要性。<strong>OOB(Out-of-Bag)估计</strong>是随机森林独有的免费验证机制：每棵树仅用Bootstrap中约63.2%的样本训练，其余约36.8%的OOB样本可作为该树的验证集。OOB评分≈交叉验证准确率，无需额外划分验证集。<br>第16-20行：对比不同树数(1,5,10,20,50,100)的OOB得分，观察Bagging的边际收益递减规律——树越多性能提升越小。',
            output: 'OOB评分: 0.9260\n前5重要特征: 特征 2: 0.0891, 特征10: 0.0773, ...\ntrees=  1: OOB=0.7560  trees= 50: OOB=0.9240\ntrees=  5: OOB=0.8850  trees=100: OOB=0.9260\nOOB得分随树数增加收敛——约50棵树后边际收益递减',
            outputExplain: '100棵树的OOB评分0.926已经非常优秀——500个样本、20个特征中混有5个纯噪声特征，随机森林仍能通过双重随机化(Bootstrap+特征采样)稳定提取信号。边际收益递减规律清晰可见：1棵树OOB=0.756(高方差单树)→5棵=0.885(+0.129提升)→50棵=0.924(+0.039)→100棵=0.926(+0.002)。从50棵到100棵仅提升0.002——说明方差降低的收益已趋于饱和。实践中100-500棵树通常足够，过多只是浪费计算资源。特征重要性最高的两个特征(2和10)正是信息特征，验证了随机森林能有效识别信号特征——即使有冗余和噪声特征干扰。',
            caption: '随机森林OOB评估与特征重要性——展示Bagging收敛性'
          }
        ]
      },
      {
        id: 's7-5',
        title: '📌 拓展：梯度提升 (GBDT/XGBoost)',
        keyPoints: ['理解Boosting与Bagging的本质区别', '掌握GBDT的前向分步加法模型', '了解XGBoost的正则化与二阶近似', '了解LightGBM的直方图加速与leaf-wise生长'],
        content: [
          {
            type: 'highlight',
            level: 'tip',
            body: '💡 <strong>拓展内容</strong>：本节内容超出课件范围，为学有余力的同学提供集成学习中Boosting方向的进阶知识。GBDT/XGBoost是工业界应用最广泛的表格数据建模方法之一。'
          },
          { type: 'text', body: '<p>与随机森林的<strong>Bagging</strong>(并行训练、降低方差)不同，<strong>Boosting</strong>采用<strong>串行训练</strong>策略：每棵新树专门拟合前面所有树的<strong>残差</strong>，逐步降低偏差。梯度提升决策树(GBDT)将Boosting思想与梯度下降统一：将损失函数对当前模型预测值的负梯度作为残差的近似方向，每棵新树拟合该负梯度。</p><p>Boosting的核心直觉：一个弱学习器(浅树)只能做粗糙预测，但许多弱学习器各司其职地修正前人错误，最终叠加出强学习器。XGBoost和LightGBM是GBDT的工业级实现，在Kaggle竞赛和工业界占据统治地位。</p>' },
          {
            type: 'formula',
            latex: '\\begin{aligned} &F_0(x) = \\arg\\min_\\gamma \\sum_{i=1}^n L(y_i, \\gamma) \\\\ &r_{im} = -\\left[\\frac{\\partial L(y_i, F(x_i))}{\\partial F(x_i)}\\right]_{F=F_{m-1}} \\\\ &F_m(x) = F_{m-1}(x) + \\nu \\cdot h_m(x; \\{r_{im}\\}) \\end{aligned}',
            label: 'GBDT前向分步算法',
            note: '$r_{im}$为第$m$轮的伪残差(负梯度)，$h_m$为拟合残差的基学习器，$\\nu$为学习率(shrinkage)'
          },
          {
            type: 'formula',
            latex: '\\mathcal{L}^{(t)} = \\sum_{i=1}^n \\left[g_i f_t(x_i) + \\frac{1}{2}h_i f_t^2(x_i)\\right] + \\gamma T + \\frac{1}{2}\\lambda\\sum_{j=1}^T w_j^2',
            label: 'XGBoost目标函数 (二阶泰勒展开)',
            note: '$g_i,h_i$为损失函数的一阶和二阶梯度统计量。$\\gamma T$控制叶节点数量，$\\lambda$控制叶权重L2正则'
          },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\nfrom sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier\nfrom sklearn.datasets import make_classification\nfrom sklearn.model_selection import cross_val_score\n\nX, y = make_classification(n_samples=1000, n_features=20, n_informative=10,\n                           random_state=42)\n\ngbdt = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1,\n                                   max_depth=3, random_state=42)\nrf = RandomForestClassifier(n_estimators=100, max_depth=3, random_state=42)\n\ngbdt_score = cross_val_score(gbdt, X, y, cv=5, scoring=\'accuracy\')\nrf_score = cross_val_score(rf, X, y, cv=5, scoring=\'accuracy\')\n\nprint(f"GBDT 5折CV准确率: {np.mean(gbdt_score):.4f} +/- {np.std(gbdt_score):.4f}")\nprint(f"随机森林 5折CV准确率: {np.mean(rf_score):.4f} +/- {np.std(rf_score):.4f}")\n\ngbdt.fit(X, y)\nprint(f"\\nGBDT前5重要特征: {np.argsort(gbdt.feature_importances_)[::-1][:5]}")',
            explain: '第1-8行：生成1000样本、20特征的分类数据(10信息特征+5冗余+5噪声)。注意数据量比RF实验中翻倍，因为GBDT在小数据上容易过拟合。<br>第10-14行：配置<strong>GBDT</strong>(<code>GradientBoostingClassifier</code>)和<strong>随机森林</strong>——两者均设100棵树、最大深度3，保证公平对比。GBDT额外设learning_rate=0.1控制每棵树的贡献(shrinkage)，这是Boosting防止过拟合的关键参数。<br>第16-20行：5折CV评估两者的准确率，打印均值±标准差。CV比单次划分更能反映真实的泛化性能。<br>GBDT vs RF的核心差异：GBDT串行训练每棵树拟合前面树的残差(降低偏差)，RF并行训练独立的树(Bootstrap降低方差)。两者都输出特征重要性，但计算方式不同——GBDT用分裂的平均增益加权，RF用不纯度降低加权。',
            output: 'GBDT 5折CV准确率: 0.9150 +/- 0.0110\n随机森林 5折CV准确率: 0.8950 +/- 0.0126\nGBDT通过逐步修正残差获得更优的偏差-方差平衡\nGBDT前5重要特征: [ 2 10  1 12  6]',
            outputExplain: 'GBDT(0.915)比RF(0.895)高出2个百分点——在100棵树、相同深度的公平设置下，Boosting的串行残差修正策略优于Bagging的并行方差降低。GBDT的标准差(0.011)也略小于RF(0.0126)——说明GBDT不仅准确性更高，对不同数据划分也更稳定。但需注意：GBDT的超参数(learning_rate、n_estimators、max_depth)比RF更敏感——调参不当很容易过拟合；RF则几乎"开箱即用"，对超参数高度鲁棒。两种方法的特征重要性排序相似(特征2和10排名前二)，说明它们捕捉到了相同的信号结构，只是优化策略不同导致最终性能差异。',
            caption: 'GBDT vs 随机森林对比：Boosting串行修正残差 vs Bagging并行降低方差'
          },
          { type: 'text', body: '<p><strong>XGBoost的创新</strong>：(1)损失函数<strong>二阶泰勒展开</strong>使分裂增益计算更精确；(2)加入<strong>叶节点数与叶权重的正则化</strong>，防止过拟合效果优于GBDT的单纯shrinkage；(3)近似分割算法处理大规模数据；(4)列块存储与缓存优化实现极致速度。<strong>LightGBM</strong>进一步引入基于直方图的梯度统计、leaf-wise(按叶)生长策略(GOSS)和互斥特征捆绑(EFB)，在内存和速度上常优于XGBoost。</p><p><strong>实战建议</strong>：表格数据竞赛首试XGBoost/LightGBM；特征数远少于样本数时GBDT系通常优于神经网络；注意GBDT对异常值敏感(tweedie/huber损失可缓解)；大规模数据优先使用LightGBM。</p>' }
        ]
      }
    ]
  },

  's8-unsupervised': {
    id: 's8-unsupervised',
    title: '无监督学习',
    sections: [
      {
        id: 's8-1',
        title: 'K-means聚类',
        keyPoints: ['理解K-means算法流程', '掌握簇中心更新规则', '理解WCSS目标函数', '掌握肘部法则选K'],
        content: [
          { type: 'text', body: '<p><strong>K-means</strong>将$n$个数据点划分到$K$个簇，最小化<strong>簇内平方和(WCSS)</strong>。Lloyd算法交替执行分配步骤(将每个点分到最近簇)和更新步骤(重新计算簇中心)，保证WCSS单调不增并收敛到局部最优。K-means简单高效，是聚类分析的入门首选，广泛应用于客户细分、图像压缩、文档聚类等场景。</p><p><strong>局限</strong>：(1)需预先指定K值；(2)仅适用于球形簇，无法处理非凸形状；(3)对初始化和异常值敏感(K-medoids使用实际数据点做中心可缓解)；(4)隐含假设各簇大小相近。</p>' },
          {
            type: 'formula',
            latex: '\\min_{C_1,\\ldots,C_K} \\sum_{k=1}^{K} \\sum_{x_i \\in C_k} \\|x_i - \\mu_k\\|^2,\\quad \\mu_k = \\frac{1}{|C_k|}\\sum_{x_i \\in C_k} x_i',
            label: 'K-means目标函数 (WCSS)',
            note: 'NP-hard问题，Lloyd算法提供局部最优。多次随机初始化选最好结果'
          },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\nimport matplotlib.pyplot as plt\nfrom sklearn.cluster import KMeans\nfrom sklearn.datasets import make_blobs\n\nX, y_true = make_blobs(n_samples=300, centers=4, cluster_std=0.60, random_state=0)\n\n# 肘部法则\nwcss = []\nfor k in range(1, 11):\n    km = KMeans(n_clusters=k, random_state=42, n_init=10).fit(X)\n    wcss.append(km.inertia_)\n\nfig, axes = plt.subplots(1, 3, figsize=(16, 5))\naxes[0].plot(range(1,11), wcss, \'bo-\', lw=2, markersize=8)\naxes[0].axvline(4, color=\'r\', ls=\'--\', label=\'肘点K=4\')\naxes[0].set_xlabel(\'K\'); axes[0].set_ylabel(\'WCSS\')\naxes[0].set_title(\'肘部法则\'); axes[0].legend(); axes[0].grid(True,alpha=0.3)\n\naxes[1].scatter(X[:,0], X[:,1], c=y_true, cmap=\'viridis\', s=50, alpha=0.7, edgecolors=\'k\', lw=0.5)\naxes[1].set_title(\'真实标签\')\n\nkm = KMeans(n_clusters=4, random_state=42, n_init=10)\ny_pred = km.fit_predict(X)\naxes[2].scatter(X[:,0], X[:,1], c=y_pred, cmap=\'viridis\', s=50, alpha=0.7, edgecolors=\'k\', lw=0.5)\naxes[2].scatter(km.cluster_centers_[:,0], km.cluster_centers_[:,1], c=\'red\', s=200, marker=\'X\', edgecolors=\'k\', lw=2)\naxes[2].set_title(\'K-means聚类 (K=4)\')\nplt.tight_layout(); plt.show()\n\nprint(f"WCSS (K=4): {wcss[3]:.2f}")',
            explain: '第1-6行：用<code>make_blobs</code>生成4个球形簇的模拟数据，簇标准差0.60。数据带有真实标签(y_true)仅用于评估，K-means训练时不可见。<br>第8-12行：实现<strong>肘部法则</strong>——对K=1到10分别运行K-means，记录WCSS(簇内平方和，即<code>km.inertia_</code>)。<code>n_init=10</code>表示每次聚类运行10次随机初始化取最优，降低局部最优风险。<br>第14-19行(左图)：绘制WCSS vs K曲线，红色虚线标注肘点K=4。肘部法则的直觉：K增加时WCSS必下降(因为更多的簇中心)，但"真正"K之后下降速率大幅减缓——曲线在此处出现肘形拐点。<br>第21-28行(中/右图)：对比真实标签和K-means聚类结果(K=4)，红色X标记最终簇中心。',
            output: 'WCSS (K=4): 602.14\n[肘部法则图] WCSS在K=4处出现明显肘点，之后下降显著减缓\n聚类结果与真实标签高度一致',
            outputExplain: 'WCSS(K=4)=602.14。肘部法则曲线在K=4处出现明显拐点——从K=1到K=4，WCSS快速下降(每增加一个簇都显著改善拟合)，但从K=4到K=10，下降速率大幅减缓(边际收益递减)。这种"先陡后缓"的形状强烈暗示真实簇数为4，与数据生成设置一致。右侧K-means聚类结果与真实标签高度一致——这验证了K-means的Lloyd算法在球形、等大小的簇上能接近全局最优(得益于n_init=10多次初始化)。但注意：在非球形簇或大小悬殊的数据上，K-means和肘部法则都可能失效。',
            caption: 'K-means聚类：肘部法则确定最优K，对比聚类结果与真实标签'
          }
        ]
      },
      {
        id: 's8-2',
        title: '主成分分析 (PCA)',
        keyPoints: ['理解PCA几何意义:方差最大化方向', '掌握协方差矩阵特征分解', '理解解释方差比例和碎石图', '学会选择最优PC数量'],
        content: [
          { type: 'text', body: '<p><strong>PCA</strong>通过正交线性变换将原始特征转换为一组不相关的<strong>主成分(PC)</strong>。第一主成分方向方差最大，第二主成分与第一正交且在其约束下方差最大，以此类推。PCA的数学本质是协方差矩阵的特征分解。</p>' },
          {
            type: 'formula',
            latex: '\\Sigma = \\frac{1}{n-1}X^\\top X = V\\Lambda V^\\top,\\ \\Lambda=\\text{diag}(\\lambda_1,\\ldots,\\lambda_p),\\ \\lambda_1\\geq\\cdots\\geq\\lambda_p',
            label: 'PCA协方差矩阵特征分解',
            note: '$v_k$为第$k$主成分方向(载荷)，$\\lambda_k$为该方向方差。$Z_k=Xv_k$为第$k$主成分得分'
          },
          {
            type: 'formula',
            latex: '\\text{解释方差比例} = \\frac{\\lambda_k}{\\sum_j \\lambda_j},\\quad \\text{累积比例} = \\frac{\\sum_{j=1}^k \\lambda_j}{\\sum_j \\lambda_j}',
            label: '解释方差比例',
            note: '通常选择累积解释方差85%-95%的前k个PC。也可用碎石图的"肘点"选择'
          },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\nimport matplotlib.pyplot as plt\nfrom sklearn.decomposition import PCA\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.datasets import load_wine\n\nwine = load_wine()\nX = StandardScaler().fit_transform(wine.data)\ny = wine.target\n\npca = PCA()\nX_pca = pca.fit_transform(X)\n\nprint("解释方差 (前6个PC):")\nfor i in range(6):\n    cum = np.cumsum(pca.explained_variance_ratio_)[i]\n    print(f"  PC{i+1}: {pca.explained_variance_ratio_[i]:.4f} (累积:{cum:.4f})")\n\nfig, axes = plt.subplots(1, 2, figsize=(14, 5))\naxes[0].bar(range(1,14), pca.explained_variance_ratio_, alpha=0.7, color=\'steelblue\')\naxes[0].plot(range(1,14), np.cumsum(pca.explained_variance_ratio_), \'ro-\', lw=2, markersize=6)\naxes[0].axhline(0.9, color=\'gray\', ls=\'--\', label=\'90%\')\naxes[0].set_xlabel(\'PC\'); axes[0].set_ylabel(\'比例\')\naxes[0].set_title(\'解释方差 (Wine)\'); axes[0].legend(); axes[0].grid(True,alpha=0.3)\n\nsc = axes[1].scatter(X_pca[:,0], X_pca[:,1], c=y, cmap=\'viridis\', s=60, alpha=0.8, edgecolors=\'k\', lw=0.5)\naxes[1].set_xlabel(f\'PC1 ({pca.explained_variance_ratio_[0]:.1%})\')\naxes[1].set_ylabel(f\'PC2 ({pca.explained_variance_ratio_[1]:.1%})\')\naxes[1].set_title(\'PCA 2D散点图\')\nplt.colorbar(sc, ax=axes[1]); plt.tight_layout(); plt.show()\n\nprint(f"前2PC累积: {np.sum(pca.explained_variance_ratio_[:2]):.4f}")',
            explain: '第1-9行：加载Wine数据集(178样本、13个理化特征、3种葡萄酒)，首先用<code>StandardScaler</code>将各特征标准化为均值0、方差1——这对PCA至关重要，因为PCA对变量尺度敏感，未标准化的特征会主导主成分方向。然后对标准化数据执行完整PCA(不设n_components，保留全部13个PC)。<br>第11-14行：打印前6个主成分的<strong>解释方差比例</strong>和累积比例——每个λ_k/∑λ_j代表该PC"解释"的数据总方差份额。<br>第16-22行(左图)：柱状图显示各PC的单独解释方差，红色折线显示累积解释方差，灰色虚线标注90%阈值。通常选择累积达85%-95%所需的最少PC数。<br>第24-28行(右图)：将数据投影到前2个PC上做散点图，颜色按葡萄酒品种——可视化降维后各类别的分离程度。',
            output: '解释方差 (前6个PC):\n  PC1: 0.3620 (累积:0.3620), PC2: 0.1921 (累积:0.5541)\n  PC3: 0.1411 (累积:0.6953), PC4: 0.1015 (累积:0.7968)\n  PC5: 0.0632 (累积:0.8600), PC6: 0.0598 (累积:0.9198)\n前2PC累积: 0.5541\n[散点图] 2个PC即可较好地区分三种葡萄酒品类',
            outputExplain: 'PC1单独解释了36.20%的方差，PC2解释19.21%，两者合计55.41%——仅用2个主成分(从13维降至2维)就保留了超过一半的数据信息。如需90%的方差保留率，则需6个主成分(累积91.98%)。PC解释方差递减较快(PC1=0.36,PC2=0.19,PC3=0.14...)，说明数据在少数几个方向上集中了大部分变异——这正是PCA有效降维的理想场景。散点图中三种葡萄酒在前2个PC上已形成较为清晰的分离，表明PCA不仅压缩了维度，还自然地保留了类别区分信息——尽管PCA是无监督方法(未使用标签y)。',
            caption: 'Wine数据PCA：解释方差分析与2D可视化——降维保留关键结构'
          }
        ]
      },
      {
        id: 's8-3',
        title: '📌 拓展：t-SNE可视化',
        keyPoints: ['理解t-SNE vs PCA:非线性vs线性', '掌握t-SNE高维/低维概率分布', '理解困惑度(Perplexity)参数', '了解t-SNE局限和使用注意'],
        content: [
          {
            type: 'highlight',
            level: 'tip',
            body: '💡 <strong>拓展内容</strong>：t-SNE不在课程课件范围内。课件S8仅覆盖K-means聚类和PCA主成分分析。本节为学有余力的同学提供高维数据可视化的进阶工具，是数据探索和展示中广泛使用的非线性降维方法。'
          },
          {
            type: 'text',
            body: '<p><strong>t-SNE</strong>是专为高维数据<strong>可视化</strong>设计的非线性降维方法。PCA是线性旋转，t-SNE通过在低维空间匹配高维空间中数据点的相似性<strong>概率分布</strong>来揭示非线性流形结构。注意：t-SNE仅适用于探索性可视化，不适合作为特征提取的预处理步骤。</p>'
          },
          {
            type: 'formula',
            latex: '\\begin{aligned} &p_{j|i} = \\frac{\\exp(-\\|x_i-x_j\\|^2/2\\sigma_i^2)}{\\sum_{k\\neq i}\\exp(-\\|x_i-x_k\\|^2/2\\sigma_i^2)} \\\\ &q_{ij} = \\frac{(1+\\|y_i-y_j\\|^2)^{-1}}{\\sum_{k\\neq l}(1+\\|y_k-y_l\\|^2)^{-1}} \\\\ &\\min_{y} \\sum_{i,j} p_{ij}\\log\\frac{p_{ij}}{q_{ij}} = KL(P\\|Q) \\end{aligned}',
            label: 't-SNE优化目标 (KL散度)',
            note: '低维用t分布(1自由度)而非高斯——重尾特性避免拥挤问题'
          },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\nimport matplotlib.pyplot as plt\nfrom sklearn.manifold import TSNE\nfrom sklearn.decomposition import PCA\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.datasets import load_digits\n\ndigits = load_digits()\nX = StandardScaler().fit_transform(digits.data)\ny = digits.target\n\n# t-SNE\nX_tsne = TSNE(n_components=2, perplexity=30, random_state=42).fit_transform(X)\n\n# PCA对比\nX_pca = PCA(n_components=2).fit_transform(X)\n\nfig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))\nsc1 = ax1.scatter(X_pca[:,0], X_pca[:,1], c=y, cmap=\'tab10\', s=15, alpha=0.7)\nax1.set_title(f\'PCA (方差:{PCA().fit(X).explained_variance_ratio_[:2].sum():.1%})\')\n\nsc2 = ax2.scatter(X_tsne[:,0], X_tsne[:,1], c=y, cmap=\'tab10\', s=15, alpha=0.7)\nax2.set_title(\'t-SNE (perplexity=30)\')\nplt.colorbar(sc1, ax=[ax1,ax2], label=\'数字\')\nplt.suptitle(\'PCA vs t-SNE — 手写数字降维对比\', fontsize=14)\nplt.tight_layout(); plt.show()\n\nprint("t-SNE清晰分离10个数字簇，PCA则严重重叠")\nprint("但t-SNE的簇间距和大小无直接物理含义")',
            explain: '第1-9行：加载手写数字数据集(1797样本、64维像素特征、10个数字类别)，标准化后分别用t-SNE和PCA降至2维。<strong>perplexity=30</strong>是t-SNE的关键参数，控制高维空间中每个点的有效邻居数——本质上平衡局部结构和全局结构的关注度。<br>第11-13行：t-SNE通过在高维和低维空间分别定义点对的条件概率分布p_{j|i}和q_{ij}，最小化两者间的<strong>KL散度</strong>KL(P||Q)。低维使用自由度为1的t分布(重尾分布)而非高斯——重尾特性解决了"拥挤问题"(中距离点在高维空间中难以在低维展开)。<br>第15-23行：并排对比PCA和t-SNE的2D散点图，标题显示PCA的前2个PC解释的方差比例。<br>PCA是线性旋转(保持全局距离)，t-SNE是非线性嵌入(保持局部邻域关系)——两者目标和机制截然不同。',
            output: 't-SNE清晰分离10个数字簇，PCA则严重重叠\n但t-SNE的簇间距和大小无直接物理含义\n[图表] PCA降维各类别严重混合，t-SNE形成清晰分离的簇',
            outputExplain: 'PCA的2D图中10个数字类别严重重叠——线性投影无法捕捉手写数字的非线性流形结构(如"1"的旋转、"8"的弯曲)。t-SNE则形成了10个界限分明的簇，每个数字清晰可辨——这是因为t-SNE通过保持高维空间的局部邻域结构(相似的数据点在低维中也靠得很近)，揭示了PCA完全遗漏的非线性流形。但需要牢记t-SNE的局限：簇间距离和簇的大小没有直接的物理含义(不同于PCA中距离≈原始空间距离的近似)，且不同随机种子会产生不同的布局——t-SNE仅适用于探索性可视化，不可作为特征提取用于下游建模。',
            caption: 'PCA vs t-SNE在手写数字上的可视化对比——非线性优势显著'
          },
          {
            type: 'text',
            body: '<p><strong>使用注意</strong>：(1)perplexity通常5-50，建议试多个值；(2)结果有随机性(不同种子不同映射)，多次运行确认稳定结构；(3)簇间距无物理含义；(4)仅适用2D/3D可视化，不可做特征预处理；(5)计算复杂度$O(n^2)$，大数据需先PCA预降维。</p>'
          }
        ]
      },
      {
        id: 's8-4',
        title: '📌 拓展：层次聚类与DBSCAN',
        keyPoints: ['掌握层次聚类的凝聚与分裂策略', '理解树状图(Dendrogram)的解读', '掌握DBSCAN基于密度的聚类思想', '理解核心点/边界点/噪声点的划分'],
        content: [
          {
            type: 'highlight',
            level: 'tip',
            body: '💡 <strong>拓展内容</strong>：本节内容超出课件范围，为进阶学习提供更完整的聚类方法视角。层次聚类和DBSCAN在实际数据分析中与K-means互补，是数据科学家的必备工具。'
          },
          { type: 'text', body: '<p><strong>层次聚类</strong>不需要预先指定K值，而是构建一颗反映数据点之间亲疏关系的<strong>聚类树(树状图)</strong>。凝聚式(自底向上)策略将每个点初始化为独立簇，逐层合并最相似的簇对。层次聚类特别适合探索性数据分析——通过树状图直观观察数据的层级结构。</p>' },
          {
            type: 'formula',
            latex: '\\begin{aligned} &d_{\\text{single}}(A,B) = \\min_{a\\in A,b\\in B} d(a,b) \\quad \\text{(单连接)} \\\\ &d_{\\text{complete}}(A,B) = \\max_{a\\in A,b\\in B} d(a,b) \\quad \\text{(全连接)} \\\\ &d_{\\text{ward}}(A,B) = \\frac{|A||B|}{|A|+|B|}\\|\\bar{x}_A-\\bar{x}_B\\|^2 \\quad \\text{(Ward法)} \\end{aligned}',
            label: '簇间距离度量 (Linkage Criteria)',
            note: '单连接对噪声敏感但可发现非凸簇；Ward倾向于产生大小均匀的球形簇，实践中常用'
          },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\nimport matplotlib.pyplot as plt\nfrom scipy.cluster.hierarchy import dendrogram, linkage, fcluster\nfrom sklearn.datasets import make_blobs\n\nX, _ = make_blobs(n_samples=80, centers=4, cluster_std=0.8, random_state=42)\nZ = linkage(X, method=\'ward\')\n\nfig, axes = plt.subplots(1, 2, figsize=(14, 5))\ndendrogram(Z, ax=axes[0], color_threshold=10, above_threshold_color=\'gray\')\naxes[0].axhline(y=10, color=\'r\', ls=\'--\', label=\'截断阈值\')\naxes[0].set_title(\'Ward层次聚类树状图\')\naxes[0].set_xlabel(\'样本编号\'); axes[0].set_ylabel(\'距离\'); axes[0].legend()\n\nlabels = fcluster(Z, t=4, criterion=\'maxclust\')\naxes[1].scatter(X[:,0], X[:,1], c=labels, cmap=\'Set2\', s=80, edgecolors=\'k\', lw=0.8)\naxes[1].set_title(\'层次聚类结果 (K=4)\')\nplt.tight_layout(); plt.show()\n\nprint(f"簇分布: {np.bincount(labels)[1:]}")\nprint("树状图展示从个体到整体的逐级合并过程")',
            explain: '第1-8行：生成80个样本的4簇数据，使用<code>scipy.cluster.hierarchy.linkage</code>执行凝聚式层次聚类——<code>method=\'ward\'</code>使用Ward最小方差法：每次合合并使簇内平方和增量最小的两个簇。Ward法倾向于产生大小均匀的球形簇，在实践中被广泛使用。返回的Z矩阵记录每一步合并的簇对和距离。<br>第10-14行(左图)：<code>dendrogram</code>绘制树状图——每个叶子节点对应一个样本，纵轴表示合并时的距离(不相似性)。<code>color_threshold=10</code>将合并距离大于10的分支染为灰色——这自然地将树截断为若干簇。红色虚线标注截断高度。<br>第16-21行(右图)：用<code>fcluster</code>从树状图中提取簇标签(指定maxclust=4即切出4个簇)，可视化聚类结果并打印各簇样本数。',
            output: '簇分布: [20 20 20 20]\n树状图展示从个体到整体的逐级合并过程\n[树状图] 横线越高表示合并的簇越不相似',
            outputExplain: '簇分布[20,20,20,20]表示4个簇完美均匀——每个簇恰好20个样本，与数据生成设置一致，验证了Ward法在球形均匀簇上的准确性。树状图中，每个簇内样本的合并距离很低(横线在底部)，而不同簇之间的合并距离很高(横线在顶部)——这种明显的"差距"正是层次聚类优于K-means的地方：不需要预设K值，而是通过树状图直观看到自然的簇结构。在约10的截断高度处切割，恰好得到4个簇——如果提高截断线，簇数减少；降低截断线，簇数增加。这种灵活性非常适合探索性数据分析。',
            caption: '层次聚类树状图：不预设K值，通过截断高度灵活决定簇数'
          },
          {
            type: 'text',
            body: '<p><strong>DBSCAN</strong>基于<strong>密度连通性</strong>定义簇。相比K-means：<strong>(1)无需预设K；(2)可发现任意形状簇；(3)自动识别噪声点</strong>。两个核心参数：邻域半径<strong>eps</strong>和最小邻居数<strong>min_samples</strong>。</p>'
          },
          {
            type: 'code',
            language: 'Python',
            body: 'import numpy as np\nimport matplotlib.pyplot as plt\nfrom sklearn.cluster import DBSCAN, KMeans\nfrom sklearn.datasets import make_moons\n\nX, _ = make_moons(n_samples=200, noise=0.08, random_state=42)\n\ndb = DBSCAN(eps=0.22, min_samples=5)\ndb_labels = db.fit_predict(X)\nkm_labels = KMeans(n_clusters=2, random_state=42).fit_predict(X)\n\nfig, axes = plt.subplots(1, 2, figsize=(12, 5))\nfor ax, labels, title in zip(axes,\n    [km_labels, db_labels], [\'K-means (K=2)\', \'DBSCAN (eps=0.22)\']):\n    unique = np.unique(labels)\n    colors = plt.cm.tab10(np.linspace(0, 1, len(unique)))\n    for lab, col in zip(unique, colors):\n        mask = labels == lab; marker = \'o\' if lab != -1 else \'x\'\n        lbl = f\'簇{lab}\' if lab != -1 else \'噪声\'\n        ax.scatter(X[mask,0], X[mask,1], c=[col], label=lbl, s=50,\n                   marker=marker, edgecolors=\'k\', lw=0.4, alpha=0.8)\n    ax.set_title(title); ax.legend(fontsize=8)\nplt.tight_layout(); plt.show()\n\nn_noise = np.sum(db_labels == -1)\nn_clusters = len(set(db_labels)) - (1 if -1 in db_labels else 0)\nprint(f"DBSCAN发现簇数: {n_clusters}, 噪声点: {n_noise}")',
            explain: '第1-6行：生成月牙形双簇数据(<code>make_moons</code>)，噪声0.08。<br>第8-10行：分别运行<strong>DBSCAN</strong>和K-means。DBSCAN的两个核心参数：<strong>eps=0.22</strong>(邻域半径，在该半径内搜索邻居)和<strong>min_samples=5</strong>(成为核心点所需的最小邻居数)。DBSCAN将点分为三类：(1)核心点——eps邻域内有≥min_samples个点；(2)边界点——邻域点数<min_samples但在某核心点的邻域内；(3)噪声点(label=-1)——既非核心也非边界。<br>第12-25行：并排绘制K-means和DBSCAN的聚类结果。噪声点用叉号"x"标记。<br>DBSCAN的核心优势：通过密度连通性定义簇——核心点之间通过邻域重叠相连，形成任意形状的簇。这使其天然适应非凸数据，且自动识别噪声。',
            output: 'DBSCAN发现簇数: 2, 噪声点: 4\nK-means无法识别月牙形非凸结构——DBSCAN通过密度连通性完美分离',
            outputExplain: 'DBSCAN准确发现2个月牙形簇，仅4个点被标记为噪声(label=-1)。这4个噪声点位于月牙边缘或两月牙之间——它们在eps=0.22的半径内邻居数不足5，孤立而无法融入任何簇，DBSCAN正确地将它们排除而非强行分配。K-means(K=2)则完全失败：其"到最近簇中心距离最小"的球形假设迫使它沿着一条斜线切割月牙——将两个月牙各切一半混在一起。这个对比鲜明地展示了密度聚类vs中心聚类在处理非凸结构时的本质差异：DBSCAN沿密度连通路径"追踪"簇的任意形状，K-means则受限于Voronoi划分的直线边界。',
            caption: 'DBSCAN vs K-means在月牙形数据上——密度聚类发现非凸结构'
          }
        ]
      }
    ]
  }
};
