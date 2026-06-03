var QuizEngine = {
  state: {
    subjectId: '',
    chapterId: '',
    questions: [],
    currentIndex: 0,
    answers: {},
    submitted: {}
  },

  init: function(subjectId, chapterId, questions) {
    try {
      this.state.subjectId = subjectId;
      this.state.chapterId = chapterId;
      this.state.questions = this.shuffleArray(questions.slice());
      this.state.currentIndex = 0;
      this.state.answers = {};
      this.state.submitted = {};
      this.render();
      console.log('QuizEngine: initialized ' + subjectId + ':' + chapterId + ' with ' + questions.length + ' questions');
    } catch(e) {
      console.error('QuizEngine.init failed:', e.message);
      var c = document.getElementById('quiz-container');
      if (c) c.innerHTML = '<div style="text-align:center;padding:64px;color:#dc2626;">测验加载失败：' + e.message + '</div>';
    }
  },

  shuffleArray: function(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  },

  getCurrentQuestion: function() {
    return this.state.questions[this.state.currentIndex];
  },

  selectAnswer: function(questionId, answer) {
    if (this.state.submitted[questionId]) return;
    this.state.answers[questionId] = answer;
    this.render();
  },

  toggleMulti: function(questionId, index) {
    if (this.state.submitted[questionId]) return;
    var current = this.state.answers[questionId] || [];
    if (current.indexOf(index) !== -1) {
      current = current.filter(function(i) { return i !== index; });
    } else {
      current = current.concat([index]);
    }
    this.state.answers[questionId] = current;
    this.render();
  },

  selectFlowBlank: function(questionId, blankId, value) {
    if (this.state.submitted[questionId]) return;
    var current = this.state.answers[questionId] || {};
    current[blankId] = value;
    this.state.answers[questionId] = current;
  },

  submitAnswer: function() {
    var q = this.getCurrentQuestion();
    if (!q || this.state.answers[q.id] === undefined) return;
    this.state.submitted[q.id] = true;

    var isCorrect = this.checkAnswer(q, this.state.answers[q.id]);
    if (!isCorrect) {
      EcoStore.addError(this.state.subjectId, this.state.chapterId, {
        id: q.id,
        type: q.type,
        question: q.question,
        options: q.options,
        answer: q.answer,
        explanation: q.explanation,
        knowledgePoint: q.knowledgePoint,
        userAnswer: this.state.answers[q.id]
      });
    }
    this.render();
  },

  checkAnswer: function(question, userAnswer) {
    switch (question.type) {
      case 'single':
      case 'truefalse':
        return userAnswer === question.answer;
      case 'multi':
        if (!Array.isArray(userAnswer)) return false;
        if (userAnswer.length !== question.answer.length) return false;
        var sorted = userAnswer.slice().sort();
        var sortedAns = question.answer.slice().sort();
        return sorted.every(function(a, i) { return a === sortedAns[i]; });
      case 'fill':
        return String(userAnswer).trim().toLowerCase() === String(question.answer).trim().toLowerCase();
      case 'short':
        var userStr = String(userAnswer).trim().toLowerCase();
        if (Array.isArray(question.answer)) {
          return question.answer.some(function(kw) {
            return userStr.indexOf(kw.toLowerCase()) !== -1;
          });
        }
        return userStr === String(question.answer).trim().toLowerCase();
      case 'calc':
        var userNum = parseFloat(userAnswer);
        if (isNaN(userNum)) return false;
        var tol = question.tolerance || 0.01;
        return Math.abs(userNum - question.answer) <= tol;
      case 'flowchart':
        if (!question.blanks) return false;
        var fBlanks = question.blanks;
        var userBlanks = userAnswer || {};
        // Handle string-based blanks (array of strings, indexed by position)
        if (typeof fBlanks[0] === 'string') {
          return fBlanks.every(function(b, i) {
            var userVal = String(userBlanks[i] || '').trim().toLowerCase();
            var expected = String(b).trim().toLowerCase();
            if (!userVal) return false;
            return userVal.indexOf(expected) !== -1 || expected.indexOf(userVal) !== -1;
          });
        }
        // Handle object-based blanks (array of {id, answer})
        return fBlanks.every(function(b) {
          var userVal = String(userBlanks[b.id] || '').trim().toLowerCase();
          return b.answer.some(function(a) { return userVal.indexOf(a.toLowerCase()) !== -1; });
        });
      case 'code-analysis':
        var analysis = String(userAnswer).toLowerCase();
        var points = question.analysisPoints || [];
        var matched = points.filter(function(p) { return analysis.indexOf(p.toLowerCase()) !== -1; });
        return matched.length >= Math.ceil(points.length / 2);
      case 'algo-judge':
        if (!Array.isArray(userAnswer)) return false;
        if (userAnswer.length !== question.answer.length) return false;
        var sorted2 = userAnswer.slice().sort();
        var sortedAns2 = question.answer.slice().sort();
        return sorted2.every(function(a, i) { return a === sortedAns2[i]; });
      default:
        return false;
    }
  },

  nextQuestion: function() {
    if (this.state.currentIndex < this.state.questions.length - 1) {
      this.state.currentIndex++;
      this.render();
      window.scrollTo(0, 0);
    }
  },

  prevQuestion: function() {
    if (this.state.currentIndex > 0) {
      this.state.currentIndex--;
      this.render();
      window.scrollTo(0, 0);
    }
  },

  getScore: function() {
    var correct = 0;
    var total = this.state.questions.length;
    var self = this;
    var submittedCount = 0;
    for (var qid in this.state.submitted) {
      if (this.state.submitted.hasOwnProperty(qid) && this.state.submitted[qid]) {
        submittedCount++;
        var q = null;
        for (var i = 0; i < this.state.questions.length; i++) {
          if (this.state.questions[i].id === qid) { q = this.state.questions[i]; break; }
        }
        if (q && this.checkAnswer(q, this.state.answers[qid])) correct++;
      }
    }
    EcoStore.setProgress(this.state.subjectId, this.state.chapterId, { completed: submittedCount, correct: correct, total: total });
    return { correct: correct, total: total, submitted: submittedCount };
  },

  jumpToQuestion: function(index) {
    this.state.currentIndex = index;
    this.render();
    window.scrollTo(0, 0);
  },

  render: function() {
    try {
      var container = document.getElementById('quiz-container');
      if (!container) return;

      var q = this.getCurrentQuestion();
      if (!q) { this.renderResult(container); return; }

      var submitted = this.state.submitted[q.id];
      var selected = this.state.answers[q.id];
      var isCorrect = submitted ? this.checkAnswer(q, selected) : null;
      var total = this.state.questions.length;
      var idx = this.state.currentIndex;

      var typeLabels = { single: '单选题', multi: '多选题', truefalse: '判断题', fill: '填空题', short: '简答题', calc: '计算题', flowchart: '流程图', 'code-analysis': '代码分析', 'algo-judge': '算法判断' };
      var typeLabel = typeLabels[q.type] || q.type;
      var diffStars = '';
      for (var s = 0; s < (q.difficulty || 1); s++) diffStars += '⭐';
      var diffBg = q.difficulty === 1 ? '#f0fdf4' : q.difficulty === 2 ? '#fef3c7' : '#fef2f2';

      var self = this;
      container.innerHTML = '' +
        '<div class="quiz-progress">' +
          '<span style="font-size:0.85rem;color:var(--text-secondary);">Q ' + (idx + 1) + '/' + total + '</span>' +
          '<div class="progress-bar"><div class="fill" style="width:' + ((idx + 1) / total * 100) + '%"></div></div>' +
          '<span class="tag">' + typeLabel + '</span>' +
          '<span class="tag" style="background:' + diffBg + '">' + diffStars + '</span>' +
        '</div>' +
        '<div class="question-card">' +
          '<div style="font-size:1.05rem;font-weight:600;color:var(--text-primary);margin-bottom:20px;line-height:1.7;">' + q.question + '</div>' +
          '<div style="margin-bottom:16px;">' + this.renderOptions(q, submitted, selected, isCorrect) + '</div>' +
          this.renderActions(q, submitted, selected, isCorrect) +
        '</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:16px;justify-content:center;">' +
          this.state.questions.map(function(_, i) {
            var isCurrent2 = i === idx;
            var isSubmitted2 = self.state.submitted[self.state.questions[i].id];
            var isQCorrect2 = isSubmitted2 ? self.checkAnswer(self.state.questions[i], self.state.answers[self.state.questions[i].id]) : null;
            var dotStyle = 'width:28px;height:28px;border-radius:50%;border:2px solid #fde68a;display:flex;align-items:center;justify-content:center;font-size:0.7rem;cursor:pointer;background:#fff;';
            if (isCurrent2) dotStyle += 'border-color:var(--accent);background:var(--accent-soft);font-weight:700;';
            if (isSubmitted2 && isQCorrect2) dotStyle += 'border-color:#22c55e;background:#f0fdf4;';
            if (isSubmitted2 && isQCorrect2 === false) dotStyle += 'border-color:#dc2626;background:#fef2f2;';
            return '<div style="' + dotStyle + '" onclick="QuizEngine.jumpToQuestion(' + i + ')" title="Q' + (i+1) + '">' + (i + 1) + '</div>';
          }).join('') +
        '</div>';
      // Render KaTeX formulas in quiz content
      if (typeof renderMathInElement !== 'undefined') {
        try {
          renderMathInElement(container, {
            delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}],
            ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'input']
          });
        } catch(e3) {}
      }
    } catch(e2) {
      console.error('QuizEngine.render failed:', e2.message);
      var c2 = document.getElementById('quiz-container');
      if (c2) c2.innerHTML = '<div style="text-align:center;padding:64px;color:#dc2626;">渲染失败：' + e2.message + '</div>';
    }
  },

  renderOptions: function(q, submitted, selected, isCorrect) {
    if (q.type === 'flowchart') {
      return renderFlowchartQuestion(q, submitted);
    }
    if (q.type === 'code-analysis') {
      return renderCodeAnalysisQuestion(q, submitted, selected, isCorrect);
    }
    if (q.type === 'algo-judge') {
      return renderAlgoJudgeQuestion(q, submitted, selected, isCorrect);
    }

    if (q.type === 'fill' || q.type === 'short' || q.type === 'calc') {
      var placeholder = '输入答案...';
      if (q.type === 'short') placeholder = '输入关键词或简答...';
      if (q.type === 'calc') placeholder = '输入数值结果...';

      return '' +
        '<input type="text" id="fill-answer" placeholder="' + placeholder + '"' +
        '  style="width:100%;padding:10px 14px;border:2px solid #fde68a;border-radius:8px;font-size:0.95rem;background:#fffbeb;"' +
        '  ' + (submitted ? 'disabled' : '') + '' +
        '  oninput="QuizEngine.selectAnswer(\'' + q.id + '\', this.value)"' +
        '  value="' + (selected || '') + '">' +
        (submitted ? '<div style="margin-top:10px;padding:10px;background:#fef3c7;border-radius:6px;font-size:0.9rem;">' +
          '答案：<strong>' + (q.type === 'calc' ? q.answer + '（容差：±' + (q.tolerance || 0.01) + '）' : (Array.isArray(q.answer) ? q.answer.join(' / ') : q.answer)) + '</strong>' +
          (isCorrect ? ' ✅' : ' ❌') +
        '</div>' : '');
    }

    if (q.type === 'multi') {
      return (q.options || []).map(function(opt, i) {
        var cls = 'option-item';
        var isSelected = (selected || []).indexOf(i) !== -1;
        if (submitted) {
          if (q.answer.indexOf(i) !== -1 && isSelected) cls += ' correct';
          else if (isSelected && q.answer.indexOf(i) === -1) cls += ' wrong';
          else if (q.answer.indexOf(i) !== -1) cls += ' correct';
        } else if (isSelected) {
          cls += ' selected';
        }
        return '<div class="' + cls + '" onclick="QuizEngine.toggleMulti(\'' + q.id + '\', ' + i + ')" style="display:flex;align-items:center;gap:8px;">' +
          '<span style="width:18px;height:18px;border:2px solid ' + (isSelected ? 'var(--accent)' : '#d4c8a0') + ';border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;">' + (isSelected ? '✓' : '') + '</span>' +
          opt +
        '</div>';
      }).join('');
    }

    // single / truefalse
    return (q.options || []).map(function(opt, i) {
      var cls = 'option-item';
      if (submitted) {
        if (i === q.answer) cls += ' correct';
        else if (i === selected) cls += ' wrong';
      } else if (i === selected) {
        cls += ' selected';
      }
      return '<div class="' + cls + '" onclick="QuizEngine.selectAnswer(\'' + q.id + '\', ' + i + ')" style="display:flex;align-items:center;gap:8px;">' +
        '<span style="width:18px;height:18px;border:2px solid ' + (i === selected && !submitted ? 'var(--accent)' : '#d4c8a0') + ';border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;">' + (i === selected && !submitted ? '●' : '') + '</span>' +
        opt +
      '</div>';
    }).join('');
  },

  renderActions: function(q, submitted, selected, isCorrect) {
    if (submitted) {
      var isLast = this.state.currentIndex >= this.state.questions.length - 1;
      return '' +
        '<div style="margin-top:16px;padding:14px;background:' + (isCorrect ? '#f0fdf4' : '#fef2f2') + ';border-radius:8px;font-size:0.88rem;line-height:1.6;">' +
          '<div style="font-weight:700;color:' + (isCorrect ? '#16a34a' : '#dc2626') + ';margin-bottom:4px;">' +
            (isCorrect ? '✅ 正确！' : '❌ 错误') +
          '</div>' +
          '<div style="color:var(--text-body);">' + q.explanation + '</div>' +
        '</div>' +
        '<div style="display:flex;gap:8px;margin-top:14px;">' +
          '<button class="btn" onclick="QuizEngine.prevQuestion()" ' + (this.state.currentIndex === 0 ? 'disabled style="opacity:0.4;cursor:default;"' : '') + '>← 上一题</button>' +
          (isLast
            ? '<button class="btn btn-primary" onclick="QuizEngine.renderResult()">查看得分 📊</button>'
            : '<button class="btn btn-primary" onclick="QuizEngine.nextQuestion()">下一题 →</button>') +
        '</div>';
    }

    return '' +
      '<div style="margin-top:16px;">' +
        '<button class="btn btn-primary" onclick="QuizEngine.submitAnswer()"' +
          ' ' + (selected === undefined || (Array.isArray(selected) && selected.length === 0) ? 'disabled style="opacity:0.4;cursor:default;"' : '') +
          ' style="width:100%;padding:12px;font-size:1rem;">' +
          '提交 ✓' +
        '</button>' +
      '</div>';
  },

  renderResult: function(container) {
    if (!container) container = document.getElementById('quiz-container');
    var score = this.getScore();
    var pct = score.submitted > 0 ? Math.round(score.correct / score.submitted * 100) : 0;
    var emoji = pct >= 90 ? '🏆' : pct >= 75 ? '🎉' : pct >= 60 ? '👍' : '📚';

    container.innerHTML = '' +
      '<div class="quiz-result">' +
        '<div style="font-size:4rem;margin-bottom:12px;">' + emoji + '</div>' +
        '<div class="score-number">' + score.correct + ' / ' + score.submitted + '</div>' +
        '<p style="color:var(--text-secondary);margin:8px 0;font-size:1rem;">' +
          '共 ' + score.total + ' 题 · 已提交 ' + score.submitted + ' · 正确率 <strong>' + pct + '%</strong>' +
        '</p>' +
        (pct >= 90 ? '<p style="color:#16a34a;">🏆 太棒了！你已经掌握了本章内容！</p>' :
          pct >= 75 ? '<p style="color:#f59e0b;">🎉 不错！回顾错题可以进一步提升。</p>' :
          pct >= 60 ? '<p style="color:#f97316;">👍 还行，复习一下知识点再试试。</p>' :
          '<p style="color:#dc2626;">📚 别灰心！回顾知识点后重新挑战！</p>') +
        '<div style="margin-top:24px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">' +
          '<button class="btn" onclick="location.reload()">🔄 重做</button>' +
          '<a href="../../errors/index.html" class="btn btn-primary">📝 错题本</a>' +
          '<a href="../index.html" class="btn">← 学科首页</a>' +
        '</div>' +
      '</div>';
  }
};

// === Special question type renderers ===

function renderFlowchartQuestion(q, submitted) {
  var steps = (q.flowchart && q.flowchart.steps) ? q.flowchart.steps : [];
  var blanks = q.blanks || [];
  var blankIdx = 0;

  return '<div class="flowchart-box">' +
    steps.map(function(step, stepIdx) {
      var isLast = stepIdx === steps.length - 1;

      // ---- Handle string-based steps (data uses ____ for blanks) ----
      if (typeof step === 'string') {
        var parts = step.split('____');
        if (parts.length === 1) {
          // Plain label — no blank in this step
          return '<div class="flow-step"><div class="flow-label">' + step + '</div></div>' +
            (isLast ? '' : '<div class="flow-arrow">↓</div>');
        }
        // Step contains blanks — render text + input fields
        var html = '<div class="flow-step"><div class="flow-label" style="line-height:2.6;">';
        for (var i = 0; i < parts.length; i++) {
          html += parts[i];
          if (i < parts.length - 1) {
            var bi = blankIdx++;
            var answerText = (blanks[bi] !== undefined) ? blanks[bi] : '';
            html += ' ';
            if (submitted) {
              html += '<span class="flow-blank" style="display:inline-block;min-width:100px;padding:4px 12px;border:2px solid #22c55e;border-radius:6px;background:#f0fdf4;color:#166534;font-weight:600;">' + answerText + '</span>';
            } else {
              html += '<input type="text" class="flow-blank-input" data-qid="' + q.id + '" data-bidx="' + bi +
                '" placeholder="?" oninput="QuizEngine.selectFlowBlank(\'' + q.id + '\',' + bi + ',this.value)"' +
                ' style="display:inline-block;min-width:100px;padding:4px 12px;border:2px dashed var(--subject-color);border-radius:6px;background:var(--subject-color-light);text-align:center;font-size:0.9rem;color:var(--subject-color-text);outline:none;">';
            }
            html += ' ';
          }
        }
        html += '</div></div>';
        return html + (isLast ? '' : '<div class="flow-arrow">↓</div>');
      }

      // ---- Handle object-based steps (original format: {type, id, text/label}) ----
      var blankData = submitted ? blanks.filter(function(b) { return b.id === step.id; })[0] : null;
      if (step.type === 'blank') {
        return '<div class="flow-step">' +
          '<div class="flow-blank">' +
            (submitted
              ? '<span style="color:' + (blankData ? 'var(--color-success)' : 'var(--warning)') + ';">' + (blankData ? (Array.isArray(blankData.answer) ? blankData.answer.join(' / ') : blankData.answer) : '?') + '</span>'
              : '<input type="text" id="flow-blank-' + step.id + '" placeholder="' + (step.label || '答案...') + '" oninput="QuizEngine.selectFlowBlank(\'' + q.id + '\',' + step.id + ', this.value)">') +
          '</div>' +
        '</div>' +
        (isLast ? '' : '<div class="flow-arrow">↓</div>');
      } else {
        return '<div class="flow-step"><div class="flow-label">' + (step.text || '') + '</div></div>' +
          (isLast ? '' : '<div class="flow-arrow">↓</div>');
      }
    }).join('') +
    (submitted ? '<div style="margin-top:12px;padding:10px;background:#fef3c7;border-radius:6px;font-size:0.9rem;">答案：' + blanks.map(function(b, i) {
      return '[' + (i+1) + '] ' + (typeof b === 'string' ? b : (Array.isArray(b.answer) ? b.answer.join(' / ') : b.answer));
    }).join('; ') + '</div>' : '') +
    '</div>';
}

function renderCodeAnalysisQuestion(q, submitted, selected, isCorrect) {
  var html = '';
  if (q.code) {
    html += '<div class="code-block"><span class="code-lang">Python</span><pre style="margin:0;background:transparent;border:none;padding:0;color:#e2e8f0;">' + q.code + '</pre></div>';
  }
  if (q.output) {
    html += '<div style="padding:10px 14px;background:#0f172a;border-radius:6px;color:#a5f3fc;font-size:0.82rem;margin-bottom:12px;font-family:var(--font-mono);">输出：' + q.output + '</div>';
  }
  html += '<textarea id="code-analysis-answer" placeholder="解释代码为何产生该输出..." ' +
    'style="width:100%;min-height:100px;padding:10px 14px;border:2px solid #fde68a;border-radius:8px;font-size:0.95rem;background:#fffbeb;resize:vertical;"' +
    (submitted ? ' disabled' : '') +
    ' oninput="QuizEngine.selectAnswer(\'' + q.id + '\', this.value)">' + (selected || '') + '</textarea>';

  if (submitted) {
    html += '<div style="margin-top:10px;padding:10px;background:#fef3c7;border-radius:6px;font-size:0.9rem;">' +
      '<strong>关键点：</strong> ' + (q.analysisPoints || []).join('; ') + '</div>' +
      '<div style="margin-top:6px;padding:10px;background:' + (isCorrect ? '#f0fdf4' : '#fef2f2') + ';border-radius:6px;font-size:0.88rem;">' +
      (isCorrect ? '✅ 分析正确！' : '❌ 分析有待改进，请回顾上方关键点。') + '</div>';
  }
  return html;
}

function renderAlgoJudgeQuestion(q, submitted, selected, isCorrect) {
  return (q.options || []).map(function(opt, i) {
    var cls = 'option-item';
    var isSelected = (selected || []).indexOf(i) !== -1;
    if (submitted) {
      if (q.answer.indexOf(i) !== -1 && isSelected) cls += ' correct';
      else if (isSelected && q.answer.indexOf(i) === -1) cls += ' wrong';
      else if (q.answer.indexOf(i) !== -1) cls += ' correct';
    } else if (isSelected) {
      cls += ' selected';
    }
    return '<div class="' + cls + '" onclick="QuizEngine.toggleMulti(\'' + q.id + '\', ' + i + ')" style="display:flex;align-items:center;gap:8px;">' +
      '<span style="width:18px;height:18px;border:2px solid ' + (isSelected ? 'var(--accent)' : '#d4c8a0') + ';border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;">' + (isSelected ? '✓' : '') + '</span>' +
      opt +
    '</div>';
  }).join('');
}
