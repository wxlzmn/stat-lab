/**
 * Pyodide Runtime — 浏览器内 Python 执行引擎
 *
 * 使用 Pyodide (CPython → WebAssembly) 在浏览器中运行 Python 代码，
 * 支持 numpy、scipy、matplotlib（含中文字体）。
 *
 * ★ 多 CDN 镜像自动切换——当某 CDN 任何步骤（核心/包/matplotlib）失败时，
 *    自动换下一个 CDN 从头重试。顺序：
 *    1. fastly.jsdelivr.net   (Fastly CDN, 国内通常可访问)
 *    2. cdn.jsdmirror.com     (腾讯云 EdgeOne, 国内高速镜像)
 *    3. cdn.jsdelivr.net      (原始 jsDelivr)
 *    4. unpkg.com             (UNPKG CDN)
 *    5. gcore.jsdelivr.net    (Gcore CDN)
 *
 * 用法:
 *   PyodideRuntime.init();                          // 后台预加载
 *   PyodideRuntime.run(code, callbacks);             // 执行代码
 *   PyodideRuntime.isReady();                        // 检查是否就绪
 *   PyodideRuntime.onReady(function() { ... });      // 就绪回调
 *   PyodideRuntime.getError();                       // 获取初始化错误信息
 *   PyodideRuntime.getActiveCdn();                   // 获取当前使用的 CDN
 */

var PyodideRuntime = (function() {
  'use strict';

  var pyodide = null;
  var loadPromise = null;
  var initCallbacks = [];
  var isLoading = false;
  var initError = null;
  var activeCdn = null;

  /** 每个 CDN 的超时时间（毫秒） */
  var CDN_TIMEOUT = 25000;

  /** CDN 镜像列表（按优先级排序——国内优先） */
  var CDN_MIRRORS = [
    { name: 'Fastly',    url: 'https://fastly.jsdelivr.net/pyodide/v0.26.1/full/' },
    { name: 'JSDMirror', url: 'https://cdn.jsdmirror.com/pyodide/v0.26.1/full/' },
    { name: 'jsDelivr',  url: 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/' },
    { name: 'UNPKG',     url: 'https://unpkg.com/pyodide@0.26.1/full/' },
    { name: 'Gcore',     url: 'https://gcore.jsdelivr.net/pyodide/v0.26.1/full/' }
  ];

  /**
   * 给 Promise 加超时——超时后自动 reject
   */
  function withTimeout(promise, ms, label) {
    return new Promise(function(resolve, reject) {
      var timer = setTimeout(function() {
        reject(new Error((label || '操作') + ' 超时（' + (ms/1000) + 's）'));
      }, ms);
      promise.then(function(result) {
        clearTimeout(timer);
        resolve(result);
      }).catch(function(err) {
        clearTimeout(timer);
        reject(err);
      });
    });
  }

  /**
   * 动态加载 pyodide.js 脚本（从多个 CDN 依次尝试）
   * @returns {Promise<string>} 成功加载的 CDN base URL
   */
  function loadScriptFromCdn() {
    return new Promise(function(resolve, reject) {
      var tried = [];
      function tryNext(index) {
        if (index >= CDN_MIRRORS.length) {
          reject(new Error('所有 CDN 均无法加载 pyodide.js。已尝试: ' + tried.join(', ')));
          return;
        }
        var cdn = CDN_MIRRORS[index];
        var scriptUrl = cdn.url + 'pyodide.js';
        console.log('[Pyodide] 尝试加载脚本 (' + (index+1) + '/' + CDN_MIRRORS.length + '): ' + cdn.name);
        var script = document.createElement('script');
        script.src = scriptUrl;
        var timeoutId = setTimeout(function() {
          script.remove();
          tried.push(cdn.name + '(超时)');
          tryNext(index + 1);
        }, CDN_TIMEOUT);
        script.onload = function() {
          clearTimeout(timeoutId);
          console.log('[Pyodide] 脚本加载成功: ' + cdn.name);
          resolve(cdn.url);
        };
        script.onerror = function() {
          clearTimeout(timeoutId);
          tried.push(cdn.name);
          script.remove();
          tryNext(index + 1);
        };
        document.head.appendChild(script);
      }
      tryNext(0);
    });
  }

  /**
   * 确保 loadPyodide 函数可用（如果 HTML 中的 <script> 加载失败，动态重试）
   * @returns {Promise<string|null>} CDN base URL，或 null（HTML 中已加载成功）
   */
  function ensureLoadPyodide() {
    if (typeof loadPyodide !== 'undefined') {
      return Promise.resolve(null);
    }
    console.warn('[Pyodide] loadPyodide 未定义，动态加载脚本...');
    return loadScriptFromCdn();
  }

  /**
   * 构建 CDN 列表（优先 CDN 排第一）
   */
  function buildMirrorList(preferredCdn) {
    if (!preferredCdn) return CDN_MIRRORS.slice();
    var mirrors = CDN_MIRRORS.slice();
    var preferred = mirrors.filter(function(m) { return m.url === preferredCdn; })[0];
    if (preferred) {
      mirrors = mirrors.filter(function(m) { return m.url !== preferredCdn; });
      mirrors.unshift(preferred);
    }
    return mirrors;
  }

  /**
   * Python 代码：matplotlib Agg 配置 + 图形捕获函数
   */
  var MATPLOTLIB_SETUP_CODE = [
    'import matplotlib',
    "matplotlib.use('Agg')",
    'import matplotlib.pyplot',
    'import numpy as np',
    'from scipy import stats',
    '',
    'def _capture_figures():',
    '    """将当前所有 matplotlib 图形转为 JSON 字符串（base64 PNG 列表）"""',
    '    import matplotlib.pyplot as _p',
    '    import io, base64, sys, json',
    '    figs = []',
    '    fns = _p.get_fignums()',
    '    for fn in fns:',
    '        fig = _p.figure(fn)',
    '        buf = io.BytesIO()',
    '        fig.savefig(buf, format="png", dpi=100, bbox_inches="tight")',
    '        buf.seek(0)',
    '        data = base64.b64encode(buf.read()).decode("utf-8")',
    '        figs.append("data:image/png;base64," + data)',
    '        _p.close(fn)',
    '    return json.dumps(figs)',
  ].join('\n');

  /**
   * 下载并配置 CJK 字体（非关键——失败不影响 Pyodide 就绪）
   */
  async function setupCjkFont(p) {
    var cjkFontLoaded = false;

    // 先尝试从 Google Fonts CSS API 获取字体 URL
    try {
      var cssResp = await fetch('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400');
      if (cssResp.ok) {
        var css = await cssResp.text();
        var match = css.match(/url\(([^)]+\.ttf)\)/i);
        if (match && match[1]) {
          var fontResp = await fetch(match[1]);
          if (fontResp.ok) {
            var fontData = await fontResp.arrayBuffer();
            p.FS.writeFile('/tmp/NotoSansSC.ttf', new Uint8Array(fontData));
            await p.runPythonAsync([
              'import matplotlib.font_manager as fm',
              'fm.fontManager.addfont("/tmp/NotoSansSC.ttf")',
              'import matplotlib.pyplot as _plt',
              '_plt.rcParams["font.sans-serif"] = ["Noto Sans SC"] + _plt.rcParams.get("font.sans-serif", [])',
              '_plt.rcParams["axes.unicode_minus"] = False',
            ].join('\n'));
            cjkFontLoaded = true;
          }
        }
      }
    } catch(e) { /* 静默回退 */ }

    // 备用：硬编码已知版本 URL
    if (!cjkFontLoaded) {
      var fallbackUrls = [
        'https://fonts.gstatic.com/s/notosanssc/v40/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaG9_FnYw.ttf',
      ];
      for (var fi = 0; fi < fallbackUrls.length; fi++) {
        try {
          var fResp = await fetch(fallbackUrls[fi]);
          if (fResp.ok) {
            var fData = await fResp.arrayBuffer();
            p.FS.writeFile('/tmp/NotoSansSC.ttf', new Uint8Array(fData));
            await p.runPythonAsync([
              'import matplotlib.font_manager as fm',
              'fm.fontManager.addfont("/tmp/NotoSansSC.ttf")',
              'import matplotlib.pyplot as _plt',
              '_plt.rcParams["font.sans-serif"] = ["Noto Sans SC"] + _plt.rcParams.get("font.sans-serif", [])',
              '_plt.rcParams["axes.unicode_minus"] = False',
            ].join('\n'));
            cjkFontLoaded = true;
            break;
          }
        } catch(e) {}
      }
    }

    if (!cjkFontLoaded) {
      await p.runPythonAsync([
        'import warnings',
        "warnings.filterwarnings('ignore', message='.*Glyph.*missing.*')",
      ].join('\n'));
      console.warn('[Pyodide] CJK 字体未加载，图表中文可能显示为方框');
    }
  }

  /**
   * 初始化 Pyodide（幂等——多次调用只加载一次）
   * 返回 Promise<pyodide>
   *
   * ★ 核心设计：每个 CDN 依次尝试【核心 + 包 + matplotlib 配置】全流程。
   *    任何一步失败，立即换下一个 CDN 从头重试。
   * ★ CJK 字体是非关键步骤，单独 try，失败不影响就绪状态。
   */
  function init() {
    if (pyodide) return Promise.resolve(pyodide);
    if (loadPromise) return loadPromise;
    if (initError) { initError = null; }

    isLoading = true;
    loadPromise = (async function() {
      // 0. 确保 loadPyodide 可用
      var scriptCdn = await ensureLoadPyodide();

      // 1. 逐 CDN 尝试完整初始化流程
      var mirrors = buildMirrorList(scriptCdn);
      var errors = [];

      for (var i = 0; i < mirrors.length; i++) {
        var cdn = mirrors[i];
        var p = null;
        try {
          console.log('[Pyodide] 尝试 CDN ' + (i+1) + '/' + mirrors.length + ': ' + cdn.name + ' (' + cdn.url + ')');

          // A. 加载 Pyodide 核心 WASM
          p = await withTimeout(
            loadPyodide({ indexURL: cdn.url }),
            CDN_TIMEOUT,
            '核心加载 (' + cdn.name + ')'
          );
          console.log('[Pyodide]   ✓ 核心就绪: ' + cdn.name);

          // B. 加载科学计算包
          await withTimeout(
            p.loadPackage(['numpy', 'scipy', 'matplotlib']),
            CDN_TIMEOUT,
            '包加载 (' + cdn.name + ')'
          );
          console.log('[Pyodide]   ✓ 包就绪: numpy, scipy, matplotlib');

          // C. 配置 matplotlib + 定义 _capture_figures
          await p.runPythonAsync(MATPLOTLIB_SETUP_CODE);
          console.log('[Pyodide]   ✓ matplotlib Agg 配置完成');

          // ★★★ 所有关键步骤成功 ★★★

          // D. CJK 字体（非关键——独立 try，失败不影响就绪）
          try { await setupCjkFont(p); } catch(fe) {
            console.warn('[Pyodide] CJK 字体: ' + (fe.message || String(fe)));
          }

          // 全部就绪
          activeCdn = cdn.url;
          pyodide = p;
          isLoading = false;
          initError = null;
          initCallbacks.forEach(function(cb) { try { cb(); } catch(e) {} });
          initCallbacks = [];
          console.log('[Pyodide] ✅ 全部就绪 (CDN: ' + cdn.name + ')');
          return pyodide;

        } catch(e) {
          var msg = e.message || String(e);
          errors.push(cdn.name + ': ' + msg);
          console.warn('[Pyodide]   ✗ ' + cdn.name + ' 失败: ' + msg);
          // 继续下一个 CDN
        }
      }

      // 所有 CDN 全部失败
      throw new Error('所有 CDN 均无法完成初始化（已尝试 ' + mirrors.length + ' 个）。\n' + errors.join('\n'));
    })();

    // ★ 错误恢复：init 失败时重置状态，允许重试
    loadPromise.catch(function(err) {
      console.error('[Pyodide] 初始化失败:', err);
      initError = err.message || String(err);
      isLoading = false;
      loadPromise = null;
      activeCdn = null;
      initCallbacks.forEach(function(cb) { try { cb(); } catch(e) {} });
      initCallbacks = [];
    });

    return loadPromise;
  }

  function onReady(cb) {
    if (pyodide) { cb(); return; }
    initCallbacks.push(cb);
    if (!loadPromise) init().catch(function(){});
  }

  function isReady() { return pyodide !== null; }
  function isLoading_() { return isLoading; }
  function getError() { return initError; }
  function getActiveCdn() { return activeCdn; }

  /**
   * 执行 Python 代码
   */
  function run(code, callbacks) {
    callbacks = callbacks || {};
    return init().then(function(p) {
      var stdout = '';
      var stderr = '';

      p.setStdout({ batched: function(text) {
        stdout += text + '\n';
        if (callbacks.onStdout) callbacks.onStdout(text);
      }});
      p.setStderr({ batched: function(text) {
        stderr += text + '\n';
        if (callbacks.onStderr) callbacks.onStderr(text);
      }});

      // 清空上一轮图形 + 时间种子（WASM 缺少 /dev/urandom）
      return p.runPythonAsync(
        'import matplotlib.pyplot; matplotlib.pyplot.close("all")'
      ).then(function() {
        var seed = Date.now() % 4294967296;
        return p.runPythonAsync(
          'import numpy as np; np.random.seed(' + seed + ')'
        );
      }).then(function() {
        return p.runPythonAsync(code);
      }).then(function(result) {
        return p.runPythonAsync('_capture_figures()').then(function(images) {
          var imgList = [];
          try {
            imgList = JSON.parse(images);
            if (!Array.isArray(imgList)) imgList = [];
          } catch(e) { imgList = []; }
          var filteredStderr = stderr.trim()
            .split('\n')
            .filter(function(line) {
              return line.indexOf('Glyph') === -1 &&
                     line.indexOf('missing from current font') === -1 &&
                     line.indexOf('UserWarning') === -1;
            })
            .join('\n')
            .trim();
          return {
            result: result, stdout: stdout.trim(), stderr: filteredStderr,
            images: imgList, error: null
          };
        });
      }).catch(function(e) {
        var filteredStderr = stderr.trim()
          .split('\n')
          .filter(function(line) {
            return line.indexOf('Glyph') === -1 &&
                   line.indexOf('missing from current font') === -1 &&
                   line.indexOf('UserWarning') === -1;
          })
          .join('\n')
          .trim();
        return {
          result: null, stdout: stdout.trim(), stderr: filteredStderr,
          images: [], error: e.message || String(e)
        };
      });
    }).catch(function(err) {
      return {
        result: null, stdout: '', stderr: '', images: [],
        error: 'Pyodide 加载失败: ' + (err.message || String(err))
      };
    });
  }

  return {
    init: init, run: run, onReady: onReady,
    isReady: isReady, isLoading: isLoading_,
    getError: getError, getActiveCdn: getActiveCdn
  };
})();
