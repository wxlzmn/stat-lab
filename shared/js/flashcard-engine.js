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

    this.cards = this.shuffle(this.cards);
    this.render();
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
              formulaHtml = '<br><br><span style="color:#92400e;display:block;text-align:center;">' +
                katex.renderToString(t.formula, { displayMode: true, throwOnError: false }) +
                '</span>';
            } catch(e) {
              formulaHtml = '<br><br><span style="color:#92400e;">' + t.formula + '</span>';
            }
          } else {
            // Fallback: use $$ delimiters, auto-render will handle later
            formulaHtml = '<br><br><span style="color:#92400e;">$$' + t.formula + '$$</span>';
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
        'style="min-height:200px;background:var(--bg-card);border:2px dashed ' + (card.mastered ? '#22c55e' : 'var(--border-dashed)') + ';border-radius:16px;padding:32px 24px;text-align:center;cursor:pointer;transition:all 0.3s;box-shadow:var(--shadow);user-select:none;' + (this.flipped ? 'background:#fffdf5;' : '') + '">' +
        '<div style="font-size:1.3rem;font-weight:700;color:var(--text-primary);line-height:1.6;">' +
          (this.flipped ? card.back : card.front) + masteredIcon +
        '</div>' +
        '<div style="margin-top:20px;font-size:0.78rem;color:var(--text-secondary);">' +
          (this.flipped ? '👆 点击翻回正面' : '👆 点击查看释义') +
        '</div>' +
      '</div>' +
      '<div style="display:flex;gap:10px;justify-content:center;margin-top:16px;flex-wrap:wrap;">' +
        '<button class="btn" onclick="FlashcardEngine.prev()" ' + (this.currentIndex === 0 ? 'disabled' : '') + '>← 上一张</button>' +
        '<button class="btn" onclick="FlashcardEngine.markMastered()" style="background:' + (card.mastered ? '#fef3c7' : '#f0fdf4') + ';color:' + (card.mastered ? '#92400e' : '#16a34a') + ';">' + (card.mastered ? '🔄 取消标记' : '✅ 已掌握') + '</button>' +
        '<button class="btn" onclick="FlashcardEngine.next()" ' + (this.currentIndex >= this.cards.length - 1 ? 'disabled' : '') + '>下一张 →</button>' +
      '</div>' +
      '<div style="text-align:center;margin-top:8px;">' +
        '<button class="btn" onclick="FlashcardEngine.shuffleDeck()" style="font-size:0.75rem;">🔀 重新洗牌</button>' +
      '</div>';
  }
};
