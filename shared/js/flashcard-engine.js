// flashcard-engine.js — Flashcard review system with cross-subject support
var FlashcardEngine = {
  cards: [],
  currentIndex: 0,
  flipped: false,
  filter: 'all',
  subjectFilter: 'all',

  init: function(filter, subjectFilter) {
    this.filter = filter || 'all';
    this.subjectFilter = subjectFilter || 'all';
    this.cards = [];
    this.currentIndex = 0;
    this.flipped = false;
    var self = this;

    // Load from ECOSTATS_GLOSSARY
    if (typeof ECOSTATS_GLOSSARY !== 'undefined') {
      this._loadGlossary(ECOSTATS_GLOSSARY, 'econstats');
    }

    // Load from STATCOMP_GLOSSARY (cross-subject)
    if (typeof STATCOMP_GLOSSARY !== 'undefined') {
      this._loadGlossary(STATCOMP_GLOSSARY, 'stat-comp');
    }

    // Load spaced repetition data from localStorage
    var srData = this._loadSpacedRepData();
    this.cards.forEach(function(c) {
      if (srData[c.id]) {
        c.interval = srData[c.id].interval || 0;
        c.repetitions = srData[c.id].repetitions || 0;
        c.easeFactor = srData[c.id].easeFactor || 2.5;
      }
    });

    // Sort: unlearned first, then by next review date
    this.cards.sort(function(a, b) {
      if ((a.mastered && !b.mastered) || (!a.mastered && b.mastered)) return a.mastered ? 1 : -1;
      return (a._nextReview || 0) - (b._nextReview || 0);
    });

    this.render();
    this._setupKeyboard();
  },

  _loadGlossary: function(glossaryData, subjectId) {
    var self = this;
    Object.keys(glossaryData).forEach(function(chId) {
      if (self.filter !== 'all' && chId !== self.filter) return;
      if (self.subjectFilter !== 'all' && subjectId !== self.subjectFilter) return;
      glossaryData[chId].forEach(function(t) {
        // Render formula to HTML immediately using katex.renderToString
        var formulaHtml = '';
        if (t.formula) {
          if (typeof katex !== 'undefined') {
            try {
              formulaHtml = '<br><br><span style="color:var(--text-muted);display:block;text-align:center;">' +
                katex.renderToString(t.formula, { displayMode: true, throwOnError: false }) +
                '</span>';
            } catch(e) {
              formulaHtml = '<br><br><span style="color:var(--text-muted);">' + t.formula + '</span>';
            }
          } else {
            // Fallback: use $$ delimiters, auto-render will handle later
            formulaHtml = '<br><br><span style="color:var(--text-muted);">$$' + t.formula + '$$</span>';
          }
        }
        self.cards.push({
          type: 'glossary',
          subjectId: subjectId,
          front: t.term + (t.english ? ' (' + t.english + ')' : ''),
          back: t.definition + formulaHtml,
          chapter: chId,
          id: t.id,
          mastered: false
        });
      });
    });
  },

  shuffle: function(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  },

  flip: function() { this.flipped = !this.flipped; this.render(); },
  next: function() { this.flipped = false; if (this.currentIndex < this.cards.length - 1) this.currentIndex++; this.render(); },
  prev: function() { this.flipped = false; if (this.currentIndex > 0) this.currentIndex--; this.render(); },

  markMastered: function() {
    if (this.cards.length > 0) {
      this.cards[this.currentIndex].mastered = !this.cards[this.currentIndex].mastered;
    }
    this.render();
  },

  shuffleDeck: function() {
    this.cards = this.shuffle(this.cards);
    this.currentIndex = 0;
    this.flipped = false;
    this.render();
  },

  _setupKeyboard: function() {
    var self = this;
    this._keyHandler = function(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { self.next(); e.preventDefault(); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { self.prev(); e.preventDefault(); }
      else if (e.key === ' ' || e.key === 'Enter') {
        if (e.target.closest('.flashcard') || e.target.tagName === 'BODY') {
          self.flip(); e.preventDefault();
        }
      }
      else if (e.key === 'm' || e.key === 'M') { self.markMastered(); }
    };
    document.addEventListener('keydown', this._keyHandler);
  },

  _teardownKeyboard: function() {
    if (this._keyHandler) {
      document.removeEventListener('keydown', this._keyHandler);
      this._keyHandler = null;
    }
  },

  // Spaced Repetition (SM-2 simplified)
  _loadSpacedRepData: function() {
    try {
      var d = localStorage.getItem('statlab_sr_data');
      return d ? JSON.parse(d) : {};
    } catch(e) { return {}; }
  },

  _saveSpacedRepData: function() {
    var data = {};
    this.cards.forEach(function(c) {
      if (c.interval > 0 || c.repetitions > 0) {
        data[c.id] = { interval: c.interval, repetitions: c.repetitions, easeFactor: c.easeFactor };
      }
    });
    try { localStorage.setItem('statlab_sr_data', JSON.stringify(data)); } catch(e) {}
  },

  rateCard: function(quality) {
    // quality: 0=again, 1=hard, 2=good, 3=easy
    if (this.cards.length === 0) return;
    var card = this.cards[this.currentIndex];
    var ef = card.easeFactor || 2.5;
    var interval = card.interval || 0;
    var reps = card.repetitions || 0;

    // SM-2 algorithm
    if (quality < 2) {
      // Again/Hard: reset repetition count
      reps = 0;
      interval = 1;
    } else {
      // Good/Easy: increase
      reps++;
      if (reps === 1) interval = 1;
      else if (reps === 2) interval = 6;
      else interval = Math.round(interval * ef);
    }

    // Adjust ease factor
    ef = ef + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
    if (ef < 1.3) ef = 1.3;

    card.interval = interval;
    card.repetitions = reps;
    card.easeFactor = ef;
    // Set next review date
    card._nextReview = Date.now() + interval * 86400000;
    card.mastered = interval >= 21; // Mastered after 21 days

    this._saveSpacedRepData();
    this.render();
  },

  getStats: function() {
    var mastered = 0;
    this.cards.forEach(function(c) { if (c.mastered) mastered++; });
    return { total: this.cards.length, mastered: mastered, remaining: this.cards.length - mastered };
  },

  render: function() {
    var container = document.getElementById('flashcard-container');
    if (!container) return;

    if (this.cards.length === 0) {
      container.innerHTML = '<div style="text-align:center;padding:64px;color:var(--text-secondary);">当前筛选条件下没有可用卡片</div>';
      return;
    }

    var card = this.cards[this.currentIndex];
    var stats = this.getStats();
    var masteredIcon = card.mastered ? ' ⭐' : '';

    container.innerHTML = '' +
      '<div style="text-align:center;margin-bottom:12px;color:var(--text-secondary);font-size:0.85rem;">' +
        '第 ' + (this.currentIndex + 1) + ' / ' + this.cards.length +
        ' &nbsp;|&nbsp; 已掌握: ' + stats.mastered + ' / ' + stats.total +
      '</div>' +
      '<div class="flashcard" ' +
        'onclick="FlashcardEngine.flip()" ' +
        'style="min-height:200px;background:var(--bg-card);border:1px solid ' + (card.mastered ? 'var(--success)' : 'var(--border)') + ';border-radius:var(--radius);padding:32px 24px;text-align:center;cursor:pointer;transition:all 0.3s;box-shadow:var(--shadow-sm);user-select:none;' + (this.flipped ? 'background:var(--bg-page);' : '') + '">' +
        '<div style="font-size:1.3rem;font-weight:700;color:var(--text-primary);line-height:1.6;">' +
          (this.flipped ? card.back : card.front) + masteredIcon +
        '</div>' +
        '<div style="margin-top:20px;font-size:0.78rem;color:var(--text-secondary);">' +
          (this.flipped ? '👆 点击翻回正面' : '👆 点击查看释义') +
        '</div>' +
      '</div>' +
      '<div style="display:flex;gap:10px;justify-content:center;margin-top:16px;flex-wrap:wrap;">' +
        '<button class="btn" onclick="FlashcardEngine.prev()" ' + (this.currentIndex === 0 ? 'disabled' : '') + '>← 上一张</button>' +
        '<button class="btn" onclick="FlashcardEngine.next()" ' + (this.currentIndex >= this.cards.length - 1 ? 'disabled' : '') + '>下一张 →</button>' +
      '</div>' +
      '<div style="display:flex;gap:8px;justify-content:center;margin-top:12px;flex-wrap:wrap;">' +
        '<button class="btn" onclick="FlashcardEngine.rateCard(0)" style="border-color:var(--danger);color:var(--danger);">😞 忘记</button>' +
        '<button class="btn" onclick="FlashcardEngine.rateCard(1)" style="border-color:var(--warning);color:var(--warning);">😐 困难</button>' +
        '<button class="btn btn-primary" onclick="FlashcardEngine.rateCard(2)" style="background:var(--success);border-color:var(--success);">😊 记得</button>' +
        '<button class="btn" onclick="FlashcardEngine.rateCard(3)" style="border-color:#22c55e;color:#22c55e;">🤩 简单</button>' +
      '</div>' +
      '<div style="text-align:center;margin-top:8px;">' +
        '<button class="btn" onclick="FlashcardEngine.shuffleDeck()" style="font-size:0.75rem;">🔀 重新洗牌</button>' +
      '</div>';
  }
};
