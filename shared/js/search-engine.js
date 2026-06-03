// search-engine.js — Full-text search engine with cross-subject support
var SearchEngine = {
  index: [],

  buildIndex: function() {
    this.index = [];

    // Helper: index from a knowledge source
    var indexKnowledge = function(dataObj, subjectId) {
      if (typeof dataObj === 'undefined') return;
      var chIds = Object.keys(dataObj);
      for (var ci = 0; ci < chIds.length; ci++) {
        var chId = chIds[ci];
        var ch = dataObj[chId];
        for (var si = 0; si < (ch.sections || []).length; si++) {
          var sec = ch.sections[si];
          var text = sec.title + ' ' + (sec.keyPoints || []).join(' ') + ' ' +
            (sec.content || []).map(function(b) {
              return b.body || b.label || b.latex || (b.rows ? b.rows.flat().join(' ') : '');
            }).join(' ');
          SearchEngine.index.push({
            type: 'knowledge',
            subjectId: subjectId,
            chapter: chId,
            section: si,
            title: sec.title,
            text: text.substring(0, 500),
            url: '../subjects/' + subjectId + '/knowledge/' + chId + '.html#section-' + si
          });
        }
      }
    };

    // Helper: index from a quiz source
    var indexQuiz = function(dataObj, subjectId) {
      if (typeof dataObj === 'undefined') return;
      var qIds = Object.keys(dataObj);
      for (var qi = 0; qi < qIds.length; qi++) {
        var qChId = qIds[qi];
        var questions = dataObj[qChId];
        for (var qii = 0; qii < questions.length; qii++) {
          var q = questions[qii];
          SearchEngine.index.push({
            type: 'question',
            subjectId: subjectId,
            chapter: qChId,
            title: q.question,
            text: q.question + ' ' + (q.explanation || '') + ' ' + (q.knowledgePoint || ''),
            url: '../subjects/' + subjectId + '/quiz/' + qChId + '.html'
          });
        }
      }
    };

    // Helper: index from a glossary source
    var indexGlossary = function(dataObj, subjectId) {
      if (typeof dataObj === 'undefined') return;
      var gIds = Object.keys(dataObj);
      for (var gi = 0; gi < gIds.length; gi++) {
        var gChId = gIds[gi];
        var terms = dataObj[gChId];
        for (var ti = 0; ti < terms.length; ti++) {
          var t = terms[ti];
          SearchEngine.index.push({
            type: 'glossary',
            subjectId: subjectId,
            chapter: gChId,
            title: t.term + ' (' + (t.english || '') + ')',
            text: t.term + ' ' + (t.english || '') + ' ' + t.definition,
            url: '../subjects/' + subjectId + '/knowledge/' + gChId + '.html'
          });
        }
      }
    };

    // Helper: index from a cases source
    var indexCases = function(dataObj, subjectId) {
      if (typeof dataObj === 'undefined') return;
      var cIds = Object.keys(dataObj);
      for (var ci2 = 0; ci2 < cIds.length; ci2++) {
        var cChId = cIds[ci2];
        var cases = dataObj[cChId];
        for (var cai = 0; cai < cases.length; cai++) {
          var ca = cases[cai];
          SearchEngine.index.push({
            type: 'case',
            subjectId: subjectId,
            chapter: cChId,
            title: ca.title,
            text: ca.title + ' ' + ca.background + ' ' + ca.conclusion,
            url: '../subjects/' + subjectId + '/knowledge/' + cChId + '.html'
          });
        }
      }
    };

    // Index from both subjects
    indexKnowledge(window.ECOSTATS_KNOWLEDGE, 'econstats');
    indexQuiz(window.ECOSTATS_QUIZ, 'econstats');
    indexGlossary(window.ECOSTATS_GLOSSARY, 'econstats');
    indexCases(window.ECOSTATS_CASES, 'econstats');

    indexKnowledge(window.STATCOMP_KNOWLEDGE, 'stat-comp');
    indexQuiz(window.STATCOMP_QUIZ, 'stat-comp');
    indexGlossary(window.STATCOMP_GLOSSARY, 'stat-comp');
    indexCases(window.STATCOMP_CASES, 'stat-comp');
  },

  search: function(query) {
    if (!query || query.trim().length < 1) return [];
    var q = query.trim().toLowerCase();
    var keywords = q.split(/\s+/);
    var results = [];
    for (var i = 0; i < this.index.length; i++) {
      var item = this.index[i];
      var score = 0;
      var searchText = (item.title + ' ' + item.text).toLowerCase();
      for (var k = 0; k < keywords.length; k++) {
        var kw = keywords[k];
        if (searchText.indexOf(kw) !== -1) score += 1;
        if (item.title.toLowerCase().indexOf(kw) !== -1) score += 2;
      }
      if (score > 0) {
        results.push({
          type: item.type,
          subjectId: item.subjectId,
          chapter: item.chapter,
          title: item.title,
          snippet: item.text.substring(0, 200),
          url: item.url,
          score: score
        });
      }
    }
    results.sort(function(a, b) { return b.score - a.score; });
    return results.slice(0, 50);
  },

  getChapterTitle: function(chId) {
    // Look up chapter title from SUBJECT_REGISTRY
    if (typeof SUBJECT_REGISTRY !== 'undefined') {
      for (var s = 0; s < SUBJECT_REGISTRY.length; s++) {
        var subj = SUBJECT_REGISTRY[s];
        for (var c = 0; c < subj.chapters.length; c++) {
          if (subj.chapters[c].id === chId) {
            return subj.icon + ' ' + subj.chapters[c].title;
          }
        }
      }
    }
    // Fallback map
    var fallback = {
      'ch1-gdp': 'GDP及相关指标',
      'ch2-enterprise': '企业统计',
      'ch3-industry': '产业统计',
      'ch4-household': '住户统计',
      'ch5-price-index': '价格指数',
      'ch6-digital-economy': '数字经济',
      'ch7-data-asset': '数据资产统计',
      'ch8-macro-overview': '宏观经济概览',
      's4-dist': '分布与随机数',
      's5-optimize': '优化方法',
      's6-supervised': '监督学习',
      's7-tree': '树模型',
      's8-unsupervised': '无监督学习'
    };
    return fallback[chId] || chId;
  },

  getTypeLabel: function(type) {
    var labels = {
      'knowledge': '📖 知识点',
      'question': '✏️ 题目',
      'glossary': '📘 术语',
      'case': '📋 案例'
    };
    return labels[type] || type;
  }
};
