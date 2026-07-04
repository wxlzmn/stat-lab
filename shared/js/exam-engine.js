// exam-engine.js — Mock exam mode with subjectId support
var ExamEngine = {
  config: {},
  questions: [],
  userAnswers: {},
  submitted: false,

  init: function(config) {
    this.config = config;
    this.questions = [];
    this.userAnswers = {};
    this.submitted = false;
    this._startTime = Date.now();
    var chapters = config.chapters || [];
    var subjectId = config.subjectId || 'econstats';
    var pool = [];
    var self = this;

    // Map subjectId to quiz data variable name
    var quizDataVar = null;
    if (subjectId === 'econstats') quizDataVar = 'ECOSTATS_QUIZ';
    else if (subjectId === 'stat-comp') quizDataVar = 'STATCOMP_QUIZ';

    chapters.forEach(function(chId) {
      var dataSource = null;
      if (quizDataVar && typeof window[quizDataVar] !== 'undefined') {
        dataSource = window[quizDataVar];
      }
      // Fallback: try ECOSTATS_QUIZ directly
      if (!dataSource && typeof ECOSTATS_QUIZ !== 'undefined') {
        dataSource = ECOSTATS_QUIZ;
      }
      if (dataSource && dataSource[chId]) {
        var chQs = dataSource[chId].slice();
        if (config.types && config.types.length > 0) {
          chQs = chQs.filter(function(q) { return config.types.indexOf(q.type) !== -1; });
        }
        if (config.difficulty && config.difficulty.length > 0) {
          chQs = chQs.filter(function(q) { return config.difficulty.indexOf(q.difficulty) !== -1; });
        }
        pool = pool.concat(chQs);
      }
    });
    // Deduplicate by question ID
    var seen = {};
    pool = pool.filter(function(q) {
      if (seen[q.id]) return false;
      seen[q.id] = true;
      return true;
    });
    // Shuffle
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
    }
    this.questions = pool.slice(0, Math.min(config.questionCount || 30, pool.length));
    this.render();
  },

  selectAnswer: function(qIdx, answer) {
    if (this.submitted) return;
    this.userAnswers[qIdx] = answer;
    var q = this.questions[qIdx];
    // For fill/short/calc: update input value directly to avoid destroying the element
    if (q && ['fill', 'short', 'calc'].indexOf(q.type) !== -1) {
      var container = document.getElementById('exam-q-' + qIdx);
      if (container) {
        var input = container.querySelector('input[type="text"]');
        if (input && input.value !== answer) {
          input.value = answer;
        }
      }
      return;
    }
    this.render();
  },

  toggleMultiAnswer: function(qIdx, optIdx) {
    if (this.submitted) return;
    var current = this.userAnswers[qIdx] || [];
    if (current.indexOf(optIdx) !== -1) {
      current = current.filter(function(i) { return i !== optIdx; });
    } else {
      current = current.concat([optIdx]);
    }
    this.userAnswers[qIdx] = current;
    this.render();
  },

  submit: function() {
    this.submitted = true;
    this.render();
    // Backend mode: submit score to server
    var self = this;
    if (typeof ApiClient !== 'undefined' && ApiClient.isLoggedIn()) {
      var score = this.getScore();
      var detail = this.questions.map(function(q, i) {
        return {
          id: q.id,
          user_answer: self.userAnswers[i],
          is_correct: QuizEngine.checkAnswer(q, self.userAnswers[i])
        };
      });
      ApiClient.submitExam({
        total_questions: score.total,
        correct_count: score.correct,
        score_pct: score.total > 0 ? Math.round(score.correct / score.total * 100) : 0,
        duration_seconds: Math.round((Date.now() - (self._startTime || Date.now())) / 1000),
        config_json: JSON.stringify(self.config),
        detail_json: JSON.stringify(detail),
        mode: 'mock_exam'
      }).catch(function(e) {
        console.warn('Exam submit to server failed:', e.message);
      });
    }
  },

  getScore: function() {
    var correct = 0;
    var self = this;
    this.questions.forEach(function(q, i) {
      if (QuizEngine.checkAnswer(q, self.userAnswers[i])) correct++;
    });
    return { correct: correct, total: this.questions.length, answered: Object.keys(this.userAnswers).length };
  },

  render: function() {
    var container = document.getElementById('exam-container');
    if (!container) return;
    if (this.submitted) { this.renderResult(container); return; }

    var self = this;
    var html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px;">' +
      '<span style="font-size:0.9rem;color:var(--text-secondary);">共 <strong>' + this.questions.length + '</strong> 题 | 已答: <strong>' + Object.keys(this.userAnswers).length + '</strong></span>' +
      '<button class="btn btn-primary" onclick="ExamEngine.submit()">提交 ✓</button>' +
      '</div>';

    this.questions.forEach(function(q, idx) {
      var selected = self.userAnswers[idx];
      var typeLabel = ({single:'单选题', multi:'多选题', truefalse:'判断题', fill:'填空题', short:'简答题', calc:'计算题'})[q.type] || q.type;
      html += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-bottom:14px;" id="exam-q-' + idx + '">' +
        '<div style="font-weight:600;color:var(--text-primary);margin-bottom:10px;">' + (idx + 1) + '. ' + q.question + ' <span class="tag">' + typeLabel + '</span></div>' +
        renderExamOptions(q, idx, selected, self) +
        '</div>';
    });

    html += '<div style="text-align:center;margin-top:20px;">' +
      '<button class="btn btn-primary" onclick="ExamEngine.submit()" style="font-size:1.1rem;padding:12px 40px;">提交 ✓</button>' +
      '</div>';
    container.innerHTML = html;
  },

  renderResult: function(container) {
    var score = this.getScore();
    var pct = score.total > 0 ? Math.round(score.correct / score.total * 100) : 0;
    var emoji = pct >= 90 ? '🏆' : pct >= 75 ? '🎉' : pct >= 60 ? '👍' : '📚';
    var self = this;
    var html = '<div class="quiz-result">' +
      '<div style="font-size:4rem;margin-bottom:12px;">' + emoji + '</div>' +
      '<div class="score-number">' + score.correct + ' / ' + score.total + '</div>' +
      '<p style="color:var(--text-secondary);margin:8px 0;font-size:1rem;">得分: <strong>' + pct + '%</strong> | 已答: ' + score.answered + '</p>' +
      '</div>';

    this.questions.forEach(function(q, idx) {
      var userAns = self.userAnswers[idx];
      var isCorrect = QuizEngine.checkAnswer(q, userAns);
      html += '<div style="background:var(--bg-card);border:1px solid ' + (isCorrect ? 'var(--success)' : 'var(--danger)') + ';border-radius:var(--radius);padding:14px;margin-bottom:8px;">' +
        '<div style="font-weight:600;color:var(--text-primary);">' + (idx + 1) + '. ' + q.question + ' ' + (isCorrect ? '✅' : '❌') + '</div>' +
        '<div style="font-size:0.82rem;color:var(--text-secondary);margin-top:6px;">你的答案: <strong>' +
          (userAns !== undefined ? formatAnswer(q, userAns) : '未作答') + '</strong></div>' +
        '<div style="font-size:0.82rem;color:var(--text-secondary);">正确答案: <strong>' + formatAnswer(q, q.answer) + '</strong></div>' +
        '<div style="font-size:0.8rem;color:#78716c;margin-top:6px;">💡 ' + q.explanation + '</div>' +
        '</div>';
      if (!isCorrect && userAns !== undefined && typeof EcoStore !== 'undefined') {
        EcoStore.addError(self.config.subjectId || 'econstats', (q.knowledgePoint || '未知'), {
          id: q.id, type: q.type, question: q.question, options: q.options,
          answer: q.answer, explanation: q.explanation, knowledgePoint: q.knowledgePoint, userAnswer: userAns
        });
      }
    });
    html += '<div style="text-align:center;margin-top:20px;display:flex;gap:10px;justify-content:center;">' +
      '<button class="btn" onclick="location.reload()">🔄 重新出卷</button>' +
      '<a href="../index.html" class="btn">🏠 返回首页</a>' +
      '</div>';
    container.innerHTML = html;
  }
};

function renderExamOptions(q, idx, selected, engine) {
  if (q.type === 'fill' || q.type === 'short' || q.type === 'calc') {
    var ph = q.type === 'calc' ? '输入数值...' : q.type === 'short' ? '输入关键词...' : '输入答案...';
    return '<input type="text" placeholder="' + ph + '"' +
      ' style="width:100%;padding:8px 12px;border:1px solid var(--border-solid);border-radius:var(--radius-sm);background:var(--bg-input);font-size:0.9rem;"' +
      ' oninput="ExamEngine.selectAnswer(' + idx + ', this.value)"' +
      ' value="' + (selected || '') + '">';
  }
  if (q.type === 'multi') {
    return (q.options || []).map(function(opt, oi) {
      var isSel = (selected || []).indexOf(oi) !== -1;
      return '<div style="padding:8px 12px;margin:4px 0;border:1px solid ' + (isSel ? 'var(--accent)' : 'var(--border)') + ';border-radius:var(--radius-sm);cursor:pointer;background:' + (isSel ? 'var(--accent-soft)' : 'var(--bg-card)') + ';" onclick="ExamEngine.toggleMultiAnswer(' + idx + ',' + oi + ')">' +
        '<span style="display:inline-block;width:20px;height:20px;border:1px solid ' + (isSel ? 'var(--accent)' : 'var(--border-solid)') + ';border-radius:3px;text-align:center;font-size:11px;margin-right:8px;vertical-align:middle;">' + (isSel ? '✓' : '') + '</span>' + opt +
        '</div>';
    }).join('');
  }
  return (q.options || []).map(function(opt, oi) {
    var isSel = selected === oi;
    return '<div style="padding:8px 12px;margin:4px 0;border:1px solid ' + (isSel ? 'var(--accent)' : 'var(--border)') + ';border-radius:var(--radius-sm);cursor:pointer;background:' + (isSel ? 'var(--accent-soft)' : 'var(--bg-card)') + ';" onclick="ExamEngine.selectAnswer(' + idx + ',' + oi + ')">' +
      '<span style="display:inline-block;width:20px;height:20px;border:1px solid ' + (isSel ? 'var(--accent)' : 'var(--border-solid)') + ';border-radius:50%;text-align:center;font-size:10px;margin-right:8px;vertical-align:middle;">' + (isSel ? '●' : '') + '</span>' + opt +
      '</div>';
  }).join('');
}

function formatAnswer(q, answer) {
  if (q.type === 'multi' && Array.isArray(answer)) {
    return answer.map(function(i) { return q.options ? q.options[i] : i; }).join(', ');
  }
  if ((q.type === 'single' || q.type === 'truefalse') && q.options) {
    return q.options[answer] || String(answer);
  }
  if (Array.isArray(answer)) return answer.join(' / ');
  return String(answer);
}
