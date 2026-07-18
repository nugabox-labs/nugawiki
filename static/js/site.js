(function () {
  "use strict";
  var toggle = document.getElementById("nav-toggle");
  var sidebar = document.getElementById("sidebar");
  var backdrop = document.getElementById("sidebar-backdrop");
  if (!toggle || !sidebar) return;

  function close() {
    sidebar.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    if (backdrop) backdrop.hidden = true;
  }

  toggle.addEventListener("click", function () {
    var open = sidebar.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (backdrop) backdrop.hidden = !open;
  });

  sidebar.addEventListener("click", function (event) {
    if (event.target.tagName === "A") close();
  });

  if (backdrop) backdrop.addEventListener("click", close);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") close();
  });
})();

(function () {
  "use strict";
  var yearEl = document.getElementById("copyright-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

(function () {
  "use strict";
  var bar = document.getElementById("tag-filter-bar");
  var list = document.getElementById("doc-index-list");
  var empty = document.getElementById("doc-index-empty");
  if (!bar || !list) return;

  var items = Array.prototype.slice.call(list.querySelectorAll("li[data-tags]"));
  var tags = [];
  items.forEach(function (li) {
    li.dataset.tags.split(",").forEach(function (t) {
      if (t && tags.indexOf(t) === -1) tags.push(t);
    });
  });
  if (tags.length === 0) return;
  tags.sort(function (a, b) { return a.localeCompare(b); });

  function setActive(button) {
    Array.prototype.forEach.call(bar.querySelectorAll(".tag-filter-chip"), function (b) {
      b.classList.toggle("is-active", b === button);
    });
  }

  function applyFilter(tag) {
    var visible = 0;
    items.forEach(function (li) {
      var match = !tag || li.dataset.tags.split(",").indexOf(tag) !== -1;
      li.hidden = !match;
      if (match) visible++;
    });
    if (empty) empty.hidden = visible !== 0;
  }

  var allBtn = document.createElement("button");
  allBtn.type = "button";
  allBtn.className = "tag-filter-chip is-active";
  allBtn.textContent = "전체";
  allBtn.addEventListener("click", function () {
    setActive(allBtn);
    applyFilter(null);
  });
  bar.appendChild(allBtn);

  tags.forEach(function (tag) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tag-filter-chip";
    btn.textContent = "#" + tag;
    btn.addEventListener("click", function () {
      setActive(btn);
      applyFilter(tag);
    });
    bar.appendChild(btn);
  });

  bar.hidden = false;
})();

var showCopyToast = (function () {
  "use strict";
  var toast = document.createElement("div");
  toast.className = "copy-toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.innerHTML = '<span class="prompt-glyph" aria-hidden="true">$</span> <span class="copy-toast-text"></span>';
  document.body.appendChild(toast);
  var toastText = toast.querySelector(".copy-toast-text");
  var toastTimer;

  return function showCopyToast(message) {
    toastText.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2200);
  };
})();

(function () {
  "use strict";
  var headings = document.querySelectorAll(".prose h2[id], .prose h3[id], .prose h4[id], .prose h5[id], .prose h6[id]");
  if (!headings.length) return;

  Array.prototype.forEach.call(headings, function (h) {
    var a = document.createElement("a");
    a.className = "heading-anchor";
    a.href = "#" + h.id;
    a.textContent = "#";
    a.setAttribute("aria-label", "이 섹션 링크 복사");
    a.addEventListener("click", function () {
      var url = location.origin + location.pathname + "#" + h.id;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).catch(function () {});
      }
      showCopyToast("클립보드에 링크가 복사되었습니다");
    });
    h.appendChild(a);
  });
})();

(function () {
  "use strict";
  var blocks = document.querySelectorAll(".prose pre");
  if (!blocks.length) return;

  var copyIcon = '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M4.5 13V4.5a1 1 0 0 1 1-1H13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';

  // Rebuilds <code>'s content as one <span class="code-line"> per source line,
  // reopening any ancestor tags (e.g. hljs spans) that a line break falls
  // inside of. This keeps highlighting intact while giving each logical line
  // its own box — so a wrapped long line only grows its own row instead of
  // pushing every later line number out of sync.
  function splitIntoLines(code) {
    var lines = [];
    var current = document.createElement("span");
    current.className = "code-line";
    lines.push(current);
    var openAncestors = [];

    function copyAttrs(src, dst) {
      Array.prototype.forEach.call(src.attributes || [], function (attr) {
        dst.setAttribute(attr.name, attr.value);
      });
    }

    function appendTarget() {
      return openAncestors.length ? openAncestors[openAncestors.length - 1].clone : current;
    }

    function startNewLine() {
      current = document.createElement("span");
      current.className = "code-line";
      lines.push(current);
      var target = current;
      openAncestors = openAncestors.map(function (entry) {
        var clone = document.createElement(entry.tag);
        copyAttrs(entry.original, clone);
        target.appendChild(clone);
        target = clone;
        return { original: entry.original, tag: entry.tag, clone: clone };
      });
    }

    function walk(node) {
      if (node.nodeType === 3) {
        var parts = node.textContent.split("\n");
        parts.forEach(function (part, idx) {
          if (idx > 0) startNewLine();
          if (part.length) appendTarget().appendChild(document.createTextNode(part));
        });
      } else if (node.nodeType === 1) {
        var clone = document.createElement(node.tagName);
        copyAttrs(node, clone);
        appendTarget().appendChild(clone);
        openAncestors.push({ original: node, tag: node.tagName, clone: clone });
        Array.prototype.forEach.call(node.childNodes, walk);
        openAncestors.pop();
      }
    }

    Array.prototype.forEach.call(Array.prototype.slice.call(code.childNodes), walk);
    if (lines.length && lines[lines.length - 1].childNodes.length === 0) lines.pop();
    return lines;
  }

  Array.prototype.forEach.call(blocks, function (pre) {
    var code = pre.querySelector("code");

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "code-copy-btn";
    btn.innerHTML = copyIcon;
    btn.setAttribute("aria-label", "코드 복사");
    btn.addEventListener("click", function () {
      var lineEls = pre.querySelectorAll(".code-line");
      var text = lineEls.length
        ? Array.prototype.map.call(lineEls, function (l) { return l.textContent; }).join("\n")
        : (code || pre).textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(function () {});
      }
      showCopyToast("클립보드에 복사되었습니다");
    });
    pre.appendChild(btn);

    if (code) {
      // highlight.js re-highlights on DOMContentLoaded in addition to our own
      // explicit hljs.highlightAll() call, and that second pass wipes any DOM
      // structure we build here (it replaces innerHTML from scratch). Defer
      // our own restructuring to a macrotask so it always runs after that
      // settles, instead of racing it.
      setTimeout(function () {
        var lines = splitIntoLines(code);
        code.innerHTML = "";
        pre.style.setProperty("--code-line-no-width", String(lines.length).length + 1 + "ch");
        lines.forEach(function (lineEl, idx) {
          var row = document.createElement("span");
          row.className = "code-line-row";
          var num = document.createElement("span");
          num.className = "code-line-no";
          num.setAttribute("aria-hidden", "true");
          num.textContent = String(idx + 1);
          row.appendChild(num);
          row.appendChild(lineEl);
          code.appendChild(row);
        });
      }, 0);
    }
  });
})();

(function () {
  "use strict";
  var STORAGE_WRAP = "nugawiki:code-wrap";
  var STORAGE_LN = "nugawiki:code-linenumbers";

  function getSetting(key, defaultValue) {
    var v = localStorage.getItem(key);
    if (v === null) return defaultValue;
    return v === "1";
  }

  function setSetting(key, value) {
    try {
      localStorage.setItem(key, value ? "1" : "0");
    } catch (e) {}
  }

  function applyCodeSettings() {
    var wrap = getSetting(STORAGE_WRAP, true);
    var lineNumbers = getSetting(STORAGE_LN, false);
    document.documentElement.classList.toggle("code-wrap-off", !wrap);
    document.documentElement.classList.toggle("code-linenumbers-on", lineNumbers);
  }

  applyCodeSettings();

  function wireToggle(id, key, defaultValue) {
    var btn = document.getElementById(id);
    if (!btn) return;

    function render() {
      var on = getSetting(key, defaultValue);
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-checked", on ? "true" : "false");
    }
    render();

    btn.addEventListener("click", function () {
      setSetting(key, !getSetting(key, defaultValue));
      render();
      applyCodeSettings();
    });
  }

  wireToggle("env-toggle-wrap", STORAGE_WRAP, true);
  wireToggle("env-toggle-linenumbers", STORAGE_LN, false);
})();
