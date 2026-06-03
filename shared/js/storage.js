var EcoStore = {
  _keys: { errors: 'statlab_errors', progress: 'statlab_progress', studyLog: 'statlab_studylog' },

  _getJSON: function(key) { try { var r = localStorage.getItem(key); return r ? JSON.parse(r) : null; } catch(e) { return null; } },
  _setJSON: function(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {} },

  addError: function(subjectId, chapterId, question) {
    var all = this._getJSON(this._keys.errors) || {};
    var key = subjectId + ':' + chapterId;
    if (!all[key]) all[key] = [];
    if (all[key].filter(function(e) { return e.id === question.id; }).length === 0) all[key].push(question);
    this._setJSON(this._keys.errors, all);
  },

  getErrors: function(subjectId, chapterId) {
    var all = this._getJSON(this._keys.errors) || {};
    if (chapterId) return all[subjectId + ':' + chapterId] || [];
    var result = [];
    for (var k in all) { if (all.hasOwnProperty(k) && k.indexOf(subjectId + ':') === 0) result = result.concat(all[k]); }
    return result;
  },

  removeError: function(subjectId, chapterId, questionId) {
    var all = this._getJSON(this._keys.errors) || {};
    var key = subjectId + ':' + chapterId;
    if (all[key]) { all[key] = all[key].filter(function(e) { return e.id !== questionId; }); if (all[key].length === 0) delete all[key]; }
    this._setJSON(this._keys.errors, all);
  },

  clearErrors: function(subjectId, chapterId) {
    var all = this._getJSON(this._keys.errors) || {};
    if (chapterId) { delete all[subjectId + ':' + chapterId]; }
    else { for (var k in all) { if (all.hasOwnProperty(k) && k.indexOf(subjectId + ':') === 0) delete all[k]; } }
    this._setJSON(this._keys.errors, all);
  },

  getAllErrorCount: function() {
    var all = this._getJSON(this._keys.errors) || {};
    var count = 0;
    for (var k in all) { if (all.hasOwnProperty(k)) count += all[k].length; }
    return count;
  },

  getProgress: function(subjectId, chapterId) {
    var all = this._getJSON(this._keys.progress) || {};
    return all[subjectId + ':' + chapterId] || { completed: 0, correct: 0, total: 0 };
  },

  setProgress: function(subjectId, chapterId, data) {
    var all = this._getJSON(this._keys.progress) || {};
    all[subjectId + ':' + chapterId] = data;
    this._setJSON(this._keys.progress, all);
  },

  getAllProgress: function() { return this._getJSON(this._keys.progress) || {}; },

  getStats: function() {
    var progress = this.getAllProgress();
    var tc = 0, tco = 0, tq = 0, ss = {};
    for (var k in progress) {
      if (!progress.hasOwnProperty(k)) continue;
      var parts = k.split(':'), sid = parts[0];
      if (!ss[sid]) ss[sid] = { completed: 0, correct: 0, total: 0 };
      var p = progress[k];
      tc += p.completed || 0; tco += p.correct || 0; tq += p.total || 0;
      ss[sid].completed += p.completed || 0; ss[sid].correct += p.correct || 0; ss[sid].total += p.total || 0;
    }
    return { totalCompleted: tc, totalCorrect: tco, totalQuestions: tq, overallRate: tc > 0 ? Math.round(tco / tc * 100) : 0, subjectStats: ss };
  },

  getStudyLog: function() { return this._getJSON(this._keys.studyLog) || {}; },

  addStudyLog: function(subjectId, chapterId, count) {
    var log = this._getJSON(this._keys.studyLog) || {};
    var today = new Date().toISOString().split('T')[0];
    if (!log[today]) log[today] = {};
    log[today][subjectId + ':' + chapterId] = (log[today][subjectId + ':' + chapterId] || 0) + count;
    this._setJSON(this._keys.studyLog, log);
  },

  getHeatmap: function(days) {
    days = days || 90;
    var log = this._getJSON(this._keys.studyLog) || {};
    var result = {}, now = new Date();
    for (var i = 0; i < days; i++) {
      var d = new Date(now); d.setDate(d.getDate() - i);
      var ds = d.toISOString().split('T')[0];
      if (log[ds]) { var c = 0; for (var k in log[ds]) { if (log[ds].hasOwnProperty(k)) c += log[ds][k]; } result[ds] = c; }
      else result[ds] = 0;
    }
    return result;
  }
};
