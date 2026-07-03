var SUBJECT_REGISTRY = [
  {
    id: 'econstats', name: '经济统计学', icon: '📈',
    color: '#f59e0b', colorDeep: '#d97706', colorLight: '#fffbeb', colorText: '#92400e',
    chapters: [
      { id: 'ch1-gdp', title: 'GDP及相关指标', icon: '📈' },
      { id: 'ch2-enterprise', title: '企业统计', icon: '🏭' },
      { id: 'ch3-industry', title: '产业统计', icon: '🏗️' },
      { id: 'ch4-household', title: '住户统计', icon: '🏠' },
      { id: 'ch5-price-index', title: '价格指数', icon: '💰' },
      { id: 'ch6-digital-economy', title: '数字经济', icon: '🌐' },
      { id: 'ch7-data-asset', title: '数据资产统计', icon: '💎' },
      { id: 'ch8-macro-overview', title: '宏观经济概览', icon: '📉' }
    ],
    tools: ['knowledge', 'quiz', 'calculators']
  },
  {
    id: 'stat-comp', name: '统计计算', icon: '💻',
    color: '#3b82f6', colorDeep: '#1d4ed8', colorLight: '#eff6ff', colorText: '#1e3a8a',
    chapters: [
      { id: 's4-dist', title: '分布、随机数与似然推断', icon: '🎲' },
      { id: 's5-optimize', title: '优化方法', icon: '📉' },
      { id: 's6-supervised', title: '监督学习', icon: '🎯' },
      { id: 's7-tree', title: '树模型', icon: '🌳' },
      { id: 's8-unsupervised', title: '无监督学习', icon: '🔮' }
    ],
    tools: ['knowledge', 'quiz', 'lab']
  }
];

function getCurrentSubjectId() {
  var path = window.location.pathname;
  for (var i = 0; i < SUBJECT_REGISTRY.length; i++) {
    if (path.indexOf('/subjects/' + SUBJECT_REGISTRY[i].id + '/') !== -1) return SUBJECT_REGISTRY[i].id;
  }
  return null;
}

function getCurrentSubject() {
  var id = getCurrentSubjectId();
  if (!id) return null;
  for (var i = 0; i < SUBJECT_REGISTRY.length; i++) {
    if (SUBJECT_REGISTRY[i].id === id) return SUBJECT_REGISTRY[i];
  }
  return null;
}

function toggleMobileMenu() {
  var links = document.getElementById('nav-links');
  if (links) links.classList.toggle('open');
}

function injectNavbar(pageType, subjectId, chapterId, chapterTitle) {
  var rootPageTypes = { home: 1, dashboard: 1, exam: 1, errors: 1, search: 1, flashcards: 1, login: 1 };
  var deepPageTypes = { knowledge: 1, quiz: 1, lab: 1 };
  var subjPageTypes = { 'subject-home': 1 };

  var depth;
  if (pageType === 'home') {
    depth = '';
  } else if (rootPageTypes[pageType]) {
    depth = '../';
  } else if (subjPageTypes[pageType]) {
    depth = '../../';
  } else if (deepPageTypes[pageType]) {
    depth = '../../../';
  } else {
    depth = '../../../../';
  }

  var subject = null;
  if (subjectId) {
    for (var i = 0; i < SUBJECT_REGISTRY.length; i++) {
      if (SUBJECT_REGISTRY[i].id === subjectId) { subject = SUBJECT_REGISTRY[i]; break; }
    }
  }

  var nav = document.createElement('nav');
  nav.className = 'navbar';

  var brandHtml = '<a href="' + depth + 'index.html" class="brand">Stat-Lab</a>';

  var selectorHtml = '';
  if (subject && pageType !== 'home') {
    selectorHtml = '<select class="subject-selector" onchange="switchSubject(this.value)" aria-label="切换学科">';
    for (var s = 0; s < SUBJECT_REGISTRY.length; s++) {
      var subj = SUBJECT_REGISTRY[s];
      selectorHtml += '<option value="' + subj.id + '"' + (subj.id === subject.id ? ' selected' : '') + '>' + subj.icon + ' ' + subj.name + '</option>';
    }
    selectorHtml += '</select>';
  }

  var chapterLinksHtml = '';
  if (subject && pageType !== 'home') {
    chapterLinksHtml = '';
    for (var c = 0; c < subject.chapters.length; c++) {
      var ch = subject.chapters[c];
      var chUrl = depth + 'subjects/' + subject.id + '/knowledge/' + ch.id + '.html';
      chapterLinksHtml += '<a href="' + chUrl + '" title="' + ch.title + '">' + ch.icon + '</a>';
    }
  }

  var toolsHtml = '' +
    '<a href="' + depth + 'search/index.html">搜索</a>' +
    '<a href="' + depth + 'dashboard/index.html">仪表盘</a>' +
    '<a href="' + depth + 'exam/index.html">考试</a>' +
    '<a href="' + depth + 'flashcards/index.html">闪卡</a>' +
    '<a href="' + depth + 'errors/index.html" id="error-nav-link">错题</a>';

  nav.innerHTML = '' +
    '<button class="hamburger-btn" onclick="toggleMobileMenu()" aria-label="Menu">' +
      '<span></span><span></span><span></span>' +
    '</button>' +
    brandHtml +
    '<div id="nav-links" class="nav-links">' +
      selectorHtml + chapterLinksHtml +
      '<span style="flex:1;min-width:8px;"></span>' +
      toolsHtml +
    '</div>';

  document.body.prepend(nav);

  if (pageType === 'knowledge' || pageType === 'quiz' || pageType === 'lab') {
    renderBreadcrumb(subject, chapterId, chapterTitle, pageType);
  }

  updateErrorBadge();

  // Scroll shadow for navbar
  window.addEventListener('scroll', function() {
    if (nav) {
      if (window.scrollY > 4) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  }, { passive: true });
}

function switchSubject(subjectId) {
  var path = window.location.pathname;
  var depth;
  if (path.indexOf('/knowledge/') !== -1 || path.indexOf('/quiz/') !== -1 || path.indexOf('/lab/') !== -1) {
    depth = '../../../';
  } else if (path.indexOf('/subjects/') !== -1) {
    depth = '../../';
  } else if (path.indexOf('/dashboard/') !== -1 || path.indexOf('/exam/') !== -1 ||
             path.indexOf('/search/') !== -1 || path.indexOf('/flashcards/') !== -1 ||
             path.indexOf('/errors/') !== -1 || path.indexOf('/login/') !== -1) {
    depth = '../';
  } else {
    depth = '';
  }
  window.location.href = depth + 'subjects/' + subjectId + '/index.html';
}

function renderBreadcrumb(subject, chapterId, chapterTitle, pageType) {
  if (!subject || !chapterId) return;
  var chapterName = chapterTitle || chapterId;
  for (var c = 0; c < subject.chapters.length; c++) {
    if (subject.chapters[c].id === chapterId) { chapterName = subject.chapters[c].title; break; }
  }
  var pageLabel = pageType === 'knowledge' ? '知识点' : pageType === 'quiz' ? '测验' : '实验';
  var depth = '../../../';
  var bc = document.createElement('div');
  bc.className = 'breadcrumb';
  bc.innerHTML = '' +
    '<a href="' + depth + 'index.html">首页</a>' +
    '<span class="sep">/</span>' +
    '<a href="' + depth + 'subjects/' + subject.id + '/index.html">' + subject.icon + ' ' + subject.name + '</a>' +
    '<span class="sep">/</span>' +
    '<a href="' + depth + 'subjects/' + subject.id + '/knowledge/' + chapterId + '.html">' + chapterName + '</a>' +
    '<span class="sep">/</span>' +
    '<span class="current">' + pageLabel + '</span>';
  var main = document.querySelector('main');
  if (main) { main.prepend(bc); }
  else { document.body.insertBefore(bc, document.body.firstChild); }
}

function updateErrorBadge() {
  var link = document.getElementById('error-nav-link');
  if (link && typeof EcoStore !== 'undefined') {
    var count = EcoStore.getAllErrorCount();
    if (count > 0) link.innerHTML = '错题 <span style="background:var(--danger);color:#fff;border-radius:4px;padding:1px 6px;font-size:0.7rem;margin-left:4px;min-width:18px;display:inline-block;text-align:center;">' + count + '</span>';
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('statlab_theme', theme);
}

function toggleTheme() {
  var current = document.documentElement.getAttribute('data-theme') || 'linear';
  var next = current === 'warm' ? 'academic' : 'warm';
  applyTheme(next);
}

(function() {
  try {
    // Single theme — no toggle needed
    // Just ensure no stale theme attribute exists
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem('statlab_theme');
  } catch(e) { console.warn('Theme init failed:', e); }
})();

function renderKnowledgePage(subjectId, chapterId) {
  try {
    var dataVar = subjectId === 'econstats' ? 'ECOSTATS_KNOWLEDGE' : 'STATCOMP_KNOWLEDGE';
    if (typeof window[dataVar] === 'undefined') throw new Error('数据未加载：' + dataVar);
    var chapter = window[dataVar][chapterId];
    if (!chapter) { showError('未找到章节：' + chapterId); return; }
    document.title = chapter.title + ' - Stat-Lab';

    var sidebar = document.getElementById('toc-sidebar');
    if (sidebar) {
      sidebar.innerHTML = '' +
        '<div class="toc-title">' + chapter.title + '</div>' +
        chapter.sections.map(function(s, i) { return '<a href="#section-' + i + '" class="toc-item" data-index="' + i + '">' + s.title + '</a>'; }).join('');
    }

    var content = document.getElementById('content-area');
    if (content) {
      content.innerHTML = chapter.sections.map(function(section, i) {
        return '' +
          '<div class="content-block" id="section-' + i + '">' +
            '<h2>' + section.title + '</h2>' +
            '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px;">' + (section.keyPoints || []).map(function(kp) { return '<span class="tag" style="font-size:0.85rem;padding:5px 14px;">' + kp + '</span>'; }).join('') + '</div>' +
            (section.content || []).map(function(block) { return renderContentBlock(block, subjectId); }).join('') +
          '</div>';
      }).join('');

      // Staggered animation for content blocks
      var blocks = content.querySelectorAll('.content-block');
      blocks.forEach(function(block, i) {
        block.style.animationDelay = (i * 60) + 'ms';
      });

      var nav = document.createElement('div');
      nav.style.cssText = 'display:flex;gap:8px;margin-top:24px;justify-content:space-between;';
      nav.innerHTML = '' +
        '<a href="../index.html" class="btn">← 学科首页</a>' +
        '<a href="../quiz/' + chapterId + '.html" class="btn btn-primary">去答题 →</a>';
      content.appendChild(nav);
    }

    initTocHighlight();
    if (typeof renderMathInElement !== 'undefined') {
      renderMathInElement(document.body, { delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}], ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'] });
    }
  } catch (e) { showError('加载失败：' + e.message); }
}

function renderContentBlock(block, subjectId) {
  switch (block.type) {
    case 'text': return '<div style="font-size:1rem;line-height:1.9;color:var(--text-body);margin:12px 0;">' + block.body + '</div>';
    case 'formula': return '<div class="formula-block">' + (block.label ? '<div class="formula-label">' + block.label + '</div>' : '') + '<div>$$' + block.latex + '$$</div>' + (block.note ? '<div style="font-size:0.9rem;color:var(--text-muted);margin-top:10px;">' + block.note + '</div>' : '') + '</div>';
    case 'highlight': return '<div class="highlight-box ' + (block.level || 'important') + '">' + block.body + '</div>';
    case 'comparison': return '<div style="margin:12px 0;">' + (block.title ? '<div style="font-weight:700;margin-bottom:6px;color:var(--text-primary);">' + block.title + '</div>' : '') + '<table class="comparison-table"><tbody>' + (block.rows || []).map(function(row, ri) { return '<tr>' + row.map(function(cell, ci) { return ri === 0 ? '<th>' + cell + '</th>' : '<td>' + cell + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
    case 'code': return '<div class="code-block">' + (block.language ? '<span class="code-lang">' + block.language + '</span>' : '') + (block.explain ? '<div class="code-explain">' + block.explain + '</div>' : '') + '<pre class="code-editor" contenteditable="true" spellcheck="false">' + (block.body || '') + '</pre>' + '<button class="code-run-btn" onclick="runCodeBlock(this)">&#9654; 运行</button>' + '<div class="code-live-output"></div>' + (block.caption ? '<div style="font-size:0.85rem;color:#64748b;margin-top:6px;padding:0 16px 12px;">' + block.caption + '</div>' : '') + '</div>';
    case 'case': {
      var caseData = null;
      var casesVar = subjectId === 'econstats' ? 'ECOSTATS_CASES' : null;
      if (casesVar && typeof window[casesVar] !== 'undefined' && block.caseId) {
        for (var chKey in window[casesVar]) {
          if (!window[casesVar].hasOwnProperty(chKey)) continue;
          var found = window[casesVar][chKey].filter(function(c) { return c.id === block.caseId; });
          if (found.length > 0) { caseData = found[0]; break; }
        }
      }
      if (!caseData) return '<div style="color:var(--warning);padding:16px;">未找到案例：' + (block.caseId || '未指定') + '</div>';
      return '<div style="border:1px solid var(--warning-border);border-radius:var(--radius);padding:18px;margin:16px 0;background:var(--warning-soft);">' +
        '<div style="font-weight:700;color:var(--text-primary);margin-bottom:8px;font-size:0.95rem;">' + caseData.title + '</div>' +
        '<div style="font-size:0.92rem;color:var(--text-secondary);margin-bottom:8px;"><strong>背景：</strong> ' + caseData.background + '</div>' +
        '<div style="margin:10px 0;"><strong>问题：</strong><ol>' + (caseData.questions || []).map(function(q) { return '<li style="font-size:0.95rem;margin:3px 0;">' + q + '</li>'; }).join('') + '</ol></div>' +
        '<details style="margin-top:10px;"><summary style="cursor:pointer;color:var(--accent);font-weight:600;font-size:0.95rem;">分析与结论</summary>' +
        '<div style="margin-top:8px;font-size:0.95rem;line-height:1.65;color:var(--text-body);"><strong>分析：</strong> ' + caseData.analysis + '</div>' +
        '<div style="margin-top:6px;font-size:0.95rem;line-height:1.65;color:var(--text-body);"><strong>结论：</strong> ' + caseData.conclusion + '</div>' +
        '</details></div>';
    }
    case 'timeline': return '<div style="position:relative;padding:10px 0 10px 28px;border-left:2px solid var(--accent);margin:16px 0;">' + (block.events || []).map(function(ev) {
      return '<div style="position:relative;margin-bottom:14px;">' +
        '<div style="position:absolute;left:-33px;top:4px;width:10px;height:10px;background:var(--accent);border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 2px var(--accent);"></div>' +
        '<div style="font-weight:700;color:var(--text-primary);font-size:0.9rem;">' + (ev.year || '') + '</div>' +
        '<div style="font-size:0.95rem;color:var(--text-body);">' + (ev.text || '') + '</div>' +
        '</div>';
    }).join('') + '</div>';
    case 'glossary': {
      var glosVar = subjectId === 'econstats' ? 'ECOSTATS_GLOSSARY' : null;
      if (!glosVar || typeof window[glosVar] === 'undefined' || !block.chapter || !block.terms) return '';
      var terms = block.terms.map(function(tid) { var chapTerms = window[glosVar][block.chapter] || []; var found = chapTerms.filter(function(t) { return t.id === tid; }); return found.length > 0 ? found[0] : null; }).filter(function(t) { return t !== null; });
      return '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;margin:12px 0;">' + terms.map(function(t) {
        return '<div style="border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;background:var(--bg-card);">';
      }).join('') + terms.map(function(t) {
        return '<div style="font-weight:600;color:var(--text-primary);">' + t.term + (t.english ? ' <span style="font-size:0.82rem;color:var(--text-muted);font-weight:400;">' + t.english + '</span>' : '') + '</div>' +
          '<div style="font-size:0.95rem;color:var(--text-body);line-height:1.55;margin-top:3px;">' + t.definition + '</div>' +
          (t.formula ? '<div style="margin-top:5px;font-size:0.88rem;color:var(--accent);">$$' + t.formula + '$$</div>' : '');
      }).join('') + '</div>';
    }
    case 'visualization': return '<div class="viz-container" id="viz-' + (block.algo || 'default') + '" data-algo="' + (block.algo || '') + '"><canvas id="viz-canvas-' + (block.algo || 'default') + '" width="600" height="400"></canvas>' + (block.caption ? '<div style="font-size:0.85rem;color:var(--text-muted);margin-top:6px;">' + block.caption + '</div>' : '') + '</div>';
    default: return '';
  }
}

function initTocHighlight() {
  var items = document.querySelectorAll('.toc-item');
  if (items.length === 0) return;
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        items.forEach(function(item) { item.classList.remove('active'); });
        var idx = entry.target.id.replace('section-', '');
        var active = document.querySelector('.toc-item[data-index="' + idx + '"]');
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-15% 0px -65% 0px' });
  document.querySelectorAll('.content-block').forEach(function(b) { observer.observe(b); });
}

function showError(msg) {
  var el = document.getElementById('content-area');
  if (el) el.innerHTML = '<div style="text-align:center;padding:64px;color:var(--danger);">' + msg + '</div>';
}

/** HTML 转义——防止 XSS */
function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** 执行代码块中的 Python 代码 */
function runCodeBlock(btn) {
  var block = btn.closest('.code-block');
  if (!block) return;
  var editor = block.querySelector('.code-editor');
  var output = block.querySelector('.code-live-output');
  if (!editor || !output) return;
  var code = editor.textContent || '';

  if (typeof PyodideRuntime === 'undefined') {
    output.style.display = 'block';
    output.innerHTML = '<div class="error">Pyodide 运行时未加载。请刷新页面后重试。</div>';
    return;
  }
  if (!PyodideRuntime.isReady()) {
    if (!PyodideRuntime.isLoading()) {
      var errMsg = PyodideRuntime.getError ? PyodideRuntime.getError() : null;
      output.style.display = 'block';
      output.innerHTML = '<div class="error">' +
        'Pyodide 加载失败' + (errMsg ? '：' + escapeHtml(errMsg) : '') +
        '<br><br><button class="code-run-btn" onclick="var b=this.closest(\'.code-block\').querySelector(\'.code-run-btn\');PyodideRuntime.init();runCodeBlock(b);" style="display:inline-block;width:auto;padding:6px 16px;margin-top:8px;">重试</button>' +
        '</div>';
      return;
    }
    output.style.display = 'block';
    output.innerHTML = '<div class="loading">Pyodide 正在加载中，请稍候...</div>';
    PyodideRuntime.onReady(function() {
      if (!PyodideRuntime.isReady()) return;
      output.innerHTML = '<div class="loading">就绪！正在执行...</div>';
      runCodeBlock(btn);
    });
    var startTime = Date.now();
    var checkInterval = setInterval(function() {
      if (PyodideRuntime.isReady()) { clearInterval(checkInterval); return; }
      if (!PyodideRuntime.isLoading() || Date.now() - startTime > 150000) {
        clearInterval(checkInterval);
        if (!PyodideRuntime.isReady()) {
          var eMsg = PyodideRuntime.getError ? PyodideRuntime.getError() : null;
          output.innerHTML = '<div class="error">' +
            'Pyodide 加载超时' + (eMsg ? '：' + escapeHtml(eMsg) : '') +
            '<br><br><button class="code-run-btn" onclick="var b=this.closest(\'.code-block\').querySelector(\'.code-run-btn\');PyodideRuntime.init();runCodeBlock(b);" style="display:inline-block;width:auto;padding:6px 16px;margin-top:8px;">重试</button>' +
            '</div>';
        }
      }
    }, 1000);
    return;
  }

  btn.disabled = true;
  btn.classList.add('loading');
  btn.innerHTML = '执行中...';
  output.style.display = 'block';
  output.innerHTML = '';

  PyodideRuntime.run(code, {
    onStdout: function(text) {},
    onStderr: function(text) {}
  }).then(function(res) {
    var html = '';
    if (res.stdout) {
      html += '<div class="stdout">' + escapeHtml(res.stdout) + '</div>';
    }
    if (res.stderr) {
      html += '<div class="stderr">' + escapeHtml(res.stderr) + '</div>';
    }
    if (res.images && res.images.length > 0) {
      for (var i = 0; i < res.images.length; i++) {
        html += '<img src="' + res.images[i] + '" class="output-figure" alt="matplotlib figure ' + (i+1) + '">';
      }
    }
    if (res.error) {
      html += '<div class="error">❌ ' + escapeHtml(res.error) + '</div>';
    }
    var hasVisual = res.images && res.images.length > 0;
    var hasOutput = res.stdout || res.stderr;
    if (!html) {
      html = '<span style="color:#64748b;">（代码执行完成——无 print 输出和图形。你可以修改上方代码后再次运行）</span>';
    }
    output.innerHTML = html;
    output.scrollTop = output.scrollHeight;
  }).catch(function(err) {
    output.innerHTML = '<div class="error">❌ 执行异常: ' + escapeHtml(err.message || String(err)) + '</div>';
  }).then(function() {
    btn.disabled = false;
    btn.classList.remove('loading');
    btn.innerHTML = '&#9654; 运行';
  });
}
