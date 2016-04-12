(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * IE 5.5+, Firefox, Opera, Chrome, Safari XHR object
 * 
 * @param string url
 * @param object callback
 * @param mixed data
 * @param null x
 */
function ajax(url, callback, data, x) {
  try {
    x = new (window.XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
    x.open(data ? 'POST' : 'GET', url, 1);
    x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    x.onreadystatechange = function () {
      x.readyState > 3 && callback && callback(x.responseText, x);
    };
    x.send(data);
  } catch (e) {
    window.console && console.log(e);
  }
};

exports.default = ajax;

// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
// https://gist.github.com/jed/993585
// https://gist.github.com/Fluidbyte/5082377
// https://github.com/Xeoncross/kb_javascript_framework/blob/master/kB.js#L30
// https://gist.github.com/iwek/5599777
// http://msdn.microsoft.com/en-us/library/ms537505(v=vs.85).aspx#_id

// @todo look into lengthComputable for xhr.upload browsers
// http://stackoverflow.com/questions/11127654/why-is-progressevent-lengthcomputable-false
// http://stackoverflow.com/questions/10956574/why-might-xmlhttprequest-progressevent-lengthcomputable-be-false
// https://github.com/ForbesLindesay/ajax/blob/master/index.js

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("../lib/mousetrap.min.js");

var interaction = {};

interaction.awaitInput = function (element) {
  var promise = new Promise(function (resolve, reject) {
    var resolver = function resolver() {
      resolve(true);
    };
    element.addEventListener("click", resolver);
    "a b c d e f g h i j k l m n o p q r s t u v w x y z space enter return".split(" ").map(function (key) {
      Mousetrap.bind(key, resolver);
    });
  });
  return promise;
};

interaction.awaitChoice = function (element) {
  var promise = new Promise(function (resolve, reject) {
    var choices = element.getElementsByClassName('choice');
    Array.from(choices).forEach(function (choice) {
      choice.addEventListener('click', function () {
        var path = choice.getAttribute("data-path");
        resolve(path);
      });
    });
    // element.addEventListener('click', function(){
    //   resolve("1");
    // })
  });
  return promise;
};

exports.default = interaction;

},{"../lib/mousetrap.min.js":7}],3:[function(require,module,exports){
"use strict";

var _ajax = require("./ajax.js");

var _ajax2 = _interopRequireDefault(_ajax);

var _parser = require("./parser.js");

var _parser2 = _interopRequireDefault(_parser);

var _storyteller = require("./storyteller.js");

var _storyteller2 = _interopRequireDefault(_storyteller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var done = false;
var doneCallback = function doneCallback() {
  console.log("standard done callback");
};
var story;
var el;

var Blank = function Blank(url, element) {
  this.url = url;
  el = element;
  (0, _ajax2.default)(url, function (data) {
    // parse story...
    story = _parser2.default.paths(data);
    doneCallback();
    done = true;
  });
  return this;
};

Blank.prototype.start = function () {
  var start = function start() {
    _storyteller2.default.start(el, story);
  };
  if (done) {
    // start story
    start();
  } else {
    doneCallback = function doneCallback() {
      console.log("new done callback");
      start();
    };
  }
};

window.Blank = Blank;

},{"./ajax.js":1,"./parser.js":5,"./storyteller.js":6}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var content;

function Paper(element) {
  if (element instanceof Element) {
    this.element = element;
  } else if (element instanceof Array && element.length > 0) {
    if (element[0] instanceof Element) {
      this.element = element[0];
    } else {
      throw new Error("Provided an array with no element types.");
    }
  } else if (typeof element === "string") {
    this.element = document.querySelector(element);
    if (!this.element) throw new Error("Provided a string, but no element matches " + element);
  } else {
    throw new Error("Provide an element or id/class string of element to display your story on");
  }

  initDocument(this.element);
}

function initDocument(el) {
  // create top level wrapper
  var outer = document.createElement("div");
  var inner = document.createElement("div");
  outer.appendChild(inner);
  outer.classList.add("gg-blank-page-wrapper");
  inner.classList.add("inner-wrapper");
  el.appendChild(outer);
  content = inner;
}

/**
 * Creates new paragraph on element
 * 
 * @param paragraph string
 */
Paper.prototype.writeParagraph = function (paragraph) {
  var p = document.createElement("p");
  p.innerHTML = paragraph;
  this.currentParagraph = p;
  content.appendChild(p);
};

/**
 * Add text to paragraph after continue
 * 
 * @param more (description)
 */
Paper.prototype.continue = function (more) {
  if (!this.currentParagraph) {
    this.writeParagraph(more);
    return;
  }
  var p = this.currentParagraph;
  p.innerHTML = p.innerHTML + more;
};

exports.default = Paper;

// function add(word){
//   var index = 0;
//   if(index < word.length){
//     var nextChar = function(){
//       var c = word[index];
//       if(/\s/g.test(c)){
//         index++
//         if (index >= word.length) return

//         c=c+word[index];
//       }
//       paper.continue(c)
//       index++;
//       if(index < word.length){
//         setTimeout(nextChar, 100);
//       }
//     }
//     setTimeout(nextChar, 10);
//   }
// }

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function Parser() {}

// § - path delimiter
var pathRegex = /§(\w+)(?=\s)/;
var beginsWithNewline = /^\s*\n/;
var paraRegex = /^\s*\n/;
var whiteSpace = /^\s*$/;
var trailingWhitespace = /\s*$/;
var more = "[...]";

var strong = /(\*\*|__)([^]*?)\1/g;
var strongRepl = "<strong>$2</strong>";
var italics = /(\*|__)([^]*?)\1/g;
var italicsRepl = "<em>$2</em>";

var multipleChoice = /(::)([^]*?)\1/; // ::(Choice one=>1)(Choice two=>2)::
var decisions = /(\()(.*?)=>(\w*)(\))/g;

Parser.prototype.paths = function (text) {
  var splitted = text.split(pathRegex);
  var paths = {};
  for (var i = 1; i < splitted.length; i += 2) {
    if (paths[splitted[i]] === undefined) {
      paths[splitted[i]] = splitted[i + 1];
    } else {
      console.log("Warning - Path " + paths[splitted[i]] + " defined multiple times!");
    }
  }
  console.log(paths);
  return paths;
};

function trimSpace(text) {
  if (text.indexOf(" ") === 0) {
    // remove first space from non newline sections
    text = text.slice(1, text.length - 1);
  }
  return text;
}

function trimNewlineOrSpace(text) {
  var newline = beginsWithNewline.test(text);
  if (newline) text = text.split(beginsWithNewline)[1];else text = trimSpace(text);
  return [newline, text];
}

function splitParagraphs(text) {
  var paragraphs = text.split(/\r?\n\r?\n/g);
  paragraphs = paragraphs.filter(function (p) {
    return !whiteSpace.test(p);
  });
  paragraphs = paragraphs.map(function (p) {
    var ps = p.split(more);
    ps[ps.length - 1] = ps[ps.length - 1].replace(trailingWhitespace, "");
    return ps;
  });
  return paragraphs;
}

Parser.prototype.section = function (text) {
  var section = {};
  var nl = trimNewlineOrSpace(text);

  text = nl[1];
  section.newline = nl[0];
  section.paragraphs = splitParagraphs(text);

  console.log(section);
  return section;
};

function parseFontStyle(text) {
  // *italics*
  // **strong**

  text = text.replace(strong, strongRepl);
  text = text.replace(italics, italicsRepl);
  return text;
}

function parseLineBreaks(text) {
  return text.replace(/\r?\n/g, "<br>");
}

function parseMultipleChoice(part) {
  var match = multipleChoice.exec(part);
  if (!match) return false;
  var mc = match[2];

  var choiceHtml = '<div class="choice" data-path="$3">$2</div>';
  var choices = mc.replace(decisions, choiceHtml);
  if (mc == choices) return false;
  choices = "<div class=\"multiple-choice\">" + choices + "</div>";

  // replace in the input string
  part = part.replace(match[0], choices);
  return part;
}

Parser.prototype.part = function (part) {
  var html = parseFontStyle(part);
  html = parseLineBreaks(html);
  var mc = parseMultipleChoice(html);

  var parsed = {
    text: mc || html,
    multipleChoice: !!mc
  };

  return parsed;
};

var parser = new Parser();
// module.exports = parser;
exports.default = parser;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _parser = require("./parser.js");

var _parser2 = _interopRequireDefault(_parser);

var _paper = require("./paper.js");

var _paper2 = _interopRequireDefault(_paper);

var _interaction = require("./interaction.js");

var _interaction2 = _interopRequireDefault(_interaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Storyteller() {}

var currentPath = "0"; // start 
var currentSection = null;
var paper;
var _story;

Storyteller.prototype.start = function (element, story) {
  // init
  paper = new _paper2.default(element);
  _story = story;

  // parse starting point §0
  tellSection(currentPath);
};

var more;
var multipleChoice;
var pIndex;
var sIndex;

function noNewline(i, j, section) {
  var firstParagraph = j == 0;
  var continuingParagraph = j > 0;
  return !(firstParagraph && section.newline);
  //return !firstParagraph || !continuingParagraph;
}

/**
 * Tells the smallest fraction of the story and delegates interactions
 */
function tellPart(section, i, j) {
  if (more) more.remove();
  // only first line of section first part
  // write new paragraph or continue old one...
  var part = _parser2.default.part(section.paragraphs[i][j]);

  if (noNewline(i, j, section)) {
    paper.continue(part.text);
  } else {
    paper.writeParagraph(part.text);
  }

  if (part.multipleChoice) {
    // create listeners for multiple choice
    var multipleChoice = paper.currentParagraph.getElementsByClassName("multiple-choice")[0];
    _interaction2.default.awaitChoice(multipleChoice).then(function (choice) {
      multipleChoice.remove();
      tellSection(choice);
    });
  } else {
    var end = i >= section.paragraphs.length - 1 && j >= section.paragraphs[i].length - 1;
    if (!end) {
      more = createMoreIndication(paper.currentParagraph);
      _interaction2.default.awaitInput(more).then(forEveryPart);
    }
  }
}

/** 
 * runs for every part (a part is a subsection of a paragraph)
 */
function forEveryPart() {
  sIndex++;
  if (sIndex < currentSection.paragraphs[pIndex].length) {
    tellPart(currentSection, pIndex, sIndex);
  } else {
    pIndex++;
    forEveryParagraph();
  }
}

/**
 *  runs for every paragraph (of a section)
 */
function forEveryParagraph() {
  sIndex = 0;
  if (pIndex >= currentSection.paragraphs.length) return;

  tellPart(currentSection, pIndex, sIndex);
}

/**
 * Tells one complete section/path of a story
 */
function tellSection(id) {
  currentSection = _parser2.default.section(_story[id]);
  if (currentSection.paragraphs.length > 0) {
    pIndex = 0;
    forEveryParagraph();
  } else {
    // end of story... ?
    // section has no paragraphs
    console.log("Section " + currentPath + " has no paragraphs. So this is the end");
  }
}

function createMoreIndication(p) {
  var span = document.createElement("span");
  span.innerText = "››";
  span.classList.add("more");
  p.appendChild(span);
  return span;
}

var storyteller = new Storyteller();
exports.default = storyteller;

},{"./interaction.js":2,"./paper.js":4,"./parser.js":5}],7:[function(require,module,exports){
"use strict";

/* mousetrap v1.5.3 craig.is/killing/mice */
(function (C, r, g) {
  function t(a, b, h) {
    a.addEventListener ? a.addEventListener(b, h, !1) : a.attachEvent("on" + b, h);
  }function x(a) {
    if ("keypress" == a.type) {
      var b = String.fromCharCode(a.which);a.shiftKey || (b = b.toLowerCase());return b;
    }return l[a.which] ? l[a.which] : p[a.which] ? p[a.which] : String.fromCharCode(a.which).toLowerCase();
  }function D(a) {
    var b = [];a.shiftKey && b.push("shift");a.altKey && b.push("alt");a.ctrlKey && b.push("ctrl");a.metaKey && b.push("meta");return b;
  }function u(a) {
    return "shift" == a || "ctrl" == a || "alt" == a || "meta" == a;
  }function y(a, b) {
    var h,
        c,
        e,
        g = [];h = a;"+" === h ? h = ["+"] : (h = h.replace(/\+{2}/g, "+plus"), h = h.split("+"));for (e = 0; e < h.length; ++e) {
      c = h[e], z[c] && (c = z[c]), b && "keypress" != b && A[c] && (c = A[c], g.push("shift")), u(c) && g.push(c);
    }h = c;e = b;if (!e) {
      if (!k) {
        k = {};for (var m in l) {
          95 < m && 112 > m || l.hasOwnProperty(m) && (k[l[m]] = m);
        }
      }e = k[h] ? "keydown" : "keypress";
    }"keypress" == e && g.length && (e = "keydown");return { key: c, modifiers: g, action: e };
  }function B(a, b) {
    return null === a || a === r ? !1 : a === b ? !0 : B(a.parentNode, b);
  }function c(a) {
    function b(a) {
      a = a || {};var b = !1,
          n;for (n in q) {
        a[n] ? b = !0 : q[n] = 0;
      }b || (v = !1);
    }function h(a, b, n, f, c, h) {
      var g,
          e,
          l = [],
          m = n.type;if (!d._callbacks[a]) return [];"keyup" == m && u(a) && (b = [a]);for (g = 0; g < d._callbacks[a].length; ++g) {
        if (e = d._callbacks[a][g], (f || !e.seq || q[e.seq] == e.level) && m == e.action) {
          var k;(k = "keypress" == m && !n.metaKey && !n.ctrlKey) || (k = e.modifiers, k = b.sort().join(",") === k.sort().join(","));k && (k = f && e.seq == f && e.level == h, (!f && e.combo == c || k) && d._callbacks[a].splice(g, 1), l.push(e));
        }
      }return l;
    }function g(a, b, n, f) {
      d.stopCallback(b, b.target || b.srcElement, n, f) || !1 !== a(b, n) || (b.preventDefault ? b.preventDefault() : b.returnValue = !1, b.stopPropagation ? b.stopPropagation() : b.cancelBubble = !0);
    }function e(a) {
      "number" !== typeof a.which && (a.which = a.keyCode);var b = x(a);b && ("keyup" == a.type && w === b ? w = !1 : d.handleKey(b, D(a), a));
    }function l(a, c, n, f) {
      function e(c) {
        return function () {
          v = c;++q[a];clearTimeout(k);k = setTimeout(b, 1E3);
        };
      }function h(c) {
        g(n, c, a);"keyup" !== f && (w = x(c));setTimeout(b, 10);
      }for (var d = q[a] = 0; d < c.length; ++d) {
        var p = d + 1 === c.length ? h : e(f || y(c[d + 1]).action);m(c[d], p, f, a, d);
      }
    }function m(a, b, c, f, e) {
      d._directMap[a + ":" + c] = b;a = a.replace(/\s+/g, " ");var g = a.split(" ");1 < g.length ? l(a, g, b, c) : (c = y(a, c), d._callbacks[c.key] = d._callbacks[c.key] || [], h(c.key, c.modifiers, { type: c.action }, f, a, e), d._callbacks[c.key][f ? "unshift" : "push"]({ callback: b, modifiers: c.modifiers, action: c.action, seq: f, level: e, combo: a }));
    }var d = this;a = a || r;if (!(d instanceof c)) return new c(a);d.target = a;d._callbacks = {};d._directMap = {};var q = {},
        k,
        w = !1,
        p = !1,
        v = !1;d._handleKey = function (a, c, e) {
      var f = h(a, c, e),
          d;c = {};var k = 0,
          l = !1;for (d = 0; d < f.length; ++d) {
        f[d].seq && (k = Math.max(k, f[d].level));
      }for (d = 0; d < f.length; ++d) {
        f[d].seq ? f[d].level == k && (l = !0, c[f[d].seq] = 1, g(f[d].callback, e, f[d].combo, f[d].seq)) : l || g(f[d].callback, e, f[d].combo);
      }f = "keypress" == e.type && p;e.type != v || u(a) || f || b(c);p = l && "keydown" == e.type;
    };d._bindMultiple = function (a, b, c) {
      for (var d = 0; d < a.length; ++d) {
        m(a[d], b, c);
      }
    };t(a, "keypress", e);t(a, "keydown", e);t(a, "keyup", e);
  }var l = { 8: "backspace", 9: "tab", 13: "enter", 16: "shift", 17: "ctrl", 18: "alt",
    20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home", 37: "left", 38: "up", 39: "right", 40: "down", 45: "ins", 46: "del", 91: "meta", 93: "meta", 224: "meta" },
      p = { 106: "*", 107: "+", 109: "-", 110: ".", 111: "/", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\", 221: "]", 222: "'" },
      A = { "~": "`", "!": "1", "@": "2", "#": "3", $: "4", "%": "5", "^": "6", "&": "7", "*": "8", "(": "9", ")": "0", _: "-", "+": "=", ":": ";", '"': "'", "<": ",", ">": ".", "?": "/", "|": "\\" },
      z = { option: "alt", command: "meta", "return": "enter",
    escape: "esc", plus: "+", mod: /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? "meta" : "ctrl" },
      k;for (g = 1; 20 > g; ++g) {
    l[111 + g] = "f" + g;
  }for (g = 0; 9 >= g; ++g) {
    l[g + 96] = g;
  }c.prototype.bind = function (a, b, c) {
    a = a instanceof Array ? a : [a];this._bindMultiple.call(this, a, b, c);return this;
  };c.prototype.unbind = function (a, b) {
    return this.bind.call(this, a, function () {}, b);
  };c.prototype.trigger = function (a, b) {
    if (this._directMap[a + ":" + b]) this._directMap[a + ":" + b]({}, a);return this;
  };c.prototype.reset = function () {
    this._callbacks = {};this._directMap = {};return this;
  };c.prototype.stopCallback = function (a, b) {
    return -1 < (" " + b.className + " ").indexOf(" mousetrap ") || B(b, this.target) ? !1 : "INPUT" == b.tagName || "SELECT" == b.tagName || "TEXTAREA" == b.tagName || b.isContentEditable;
  };c.prototype.handleKey = function () {
    return this._handleKey.apply(this, arguments);
  };c.init = function () {
    var a = c(r),
        b;for (b in a) {
      "_" !== b.charAt(0) && (c[b] = function (b) {
        return function () {
          return a[b].apply(a, arguments);
        };
      }(b));
    }
  };c.init();C.Mousetrap = c;"undefined" !== typeof module && module.exports && (module.exports = c);"function" === typeof define && define.amd && define(function () {
    return c;
  });
})(window, document);

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqc1xcYWpheC5qcyIsImpzXFxpbnRlcmFjdGlvbi5qcyIsImpzXFxtYWluLmpzIiwianNcXHBhcGVyLmpzIiwianNcXHBhcnNlci5qcyIsImpzXFxzdG9yeXRlbGxlci5qcyIsImxpYlxcbW91c2V0cmFwLm1pbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7QUNRQSxTQUFTLElBQVQsQ0FBYyxHQUFkLEVBQW1CLFFBQW5CLEVBQTZCLElBQTdCLEVBQW1DLENBQW5DLEVBQXNDO0FBQ3BDLE1BQUk7QUFDRixRQUFJLEtBQUksT0FBTyxjQUFQLElBQXlCLGFBQXpCLENBQUosQ0FBNEMsb0JBQTVDLENBQUosQ0FERTtBQUVGLE1BQUUsSUFBRixDQUFPLE9BQU8sTUFBUCxHQUFnQixLQUFoQixFQUF1QixHQUE5QixFQUFtQyxDQUFuQyxFQUZFO0FBR0YsTUFBRSxnQkFBRixDQUFtQixrQkFBbkIsRUFBdUMsZ0JBQXZDLEVBSEU7QUFJRixNQUFFLGdCQUFGLENBQW1CLGNBQW5CLEVBQW1DLG1DQUFuQyxFQUpFO0FBS0YsTUFBRSxrQkFBRixHQUF1QixZQUFZO0FBQ2pDLFFBQUUsVUFBRixHQUFlLENBQWYsSUFBb0IsUUFBcEIsSUFBZ0MsU0FBUyxFQUFFLFlBQUYsRUFBZ0IsQ0FBekIsQ0FBaEMsQ0FEaUM7S0FBWixDQUxyQjtBQVFGLE1BQUUsSUFBRixDQUFPLElBQVAsRUFSRTtHQUFKLENBU0UsT0FBTyxDQUFQLEVBQVU7QUFDVixXQUFPLE9BQVAsSUFBa0IsUUFBUSxHQUFSLENBQVksQ0FBWixDQUFsQixDQURVO0dBQVY7Q0FWSjs7a0JBZWU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDckJmLElBQUksY0FBYyxFQUFkOztBQUVKLFlBQVksVUFBWixHQUF5QixVQUFTLE9BQVQsRUFBaUI7QUFDeEMsTUFBSSxVQUFVLElBQUksT0FBSixDQUFZLFVBQVMs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a0IsQ0FBSixJQUFTLENBQVQ7QUFBVyxjQUFNLEVBQUUsTUFBRixDQUFTLENBQVQsQ0FBTixLQUFvQixFQUFFLENBQUYsSUFBSyxVQUFTLENBQVQsRUFBVztBQUFDLGVBQU8sWUFBVTtBQUFDLGlCQUFPLEVBQUUsQ0FBRixFQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWEsU0FBYixDQUFQLENBQUQ7U0FBVixDQUFSO09BQVgsQ0FBK0QsQ0FBL0QsQ0FBTCxDQUFwQjtLQUFYO0dBQXhCLENBUjdSLENBUTZaLENBQUUsSUFBRixHQVI3WixDQVFzYSxDQUFFLFNBQUYsR0FBWSxDQUFaLENBUnRhLFdBUW9iLEtBQWMsT0FBTyxNQUFQLElBQWUsT0FBTyxPQUFQLEtBQWlCLE9BQU8sT0FBUCxHQUNsZixDQURrZixDQUE5QyxDQVJwYixVQVNiLEtBQWEsT0FBTyxNQUFQLElBQWUsT0FBTyxHQUFQLElBQVksT0FBTyxZQUFVO0FBQUMsV0FBTyxDQUFQLENBQUQ7R0FBVixDQUEvQyxDQVRhO0NBQWYsQ0FBRCxDQVMwRSxNQVQxRSxFQVNpRixRQVRqRiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcclxuICogSUUgNS41KywgRmlyZWZveCwgT3BlcmEsIENocm9tZSwgU2FmYXJpIFhIUiBvYmplY3RcclxuICogXHJcbiAqIEBwYXJhbSBzdHJpbmcgdXJsXHJcbiAqIEBwYXJhbSBvYmplY3QgY2FsbGJhY2tcclxuICogQHBhcmFtIG1peGVkIGRhdGFcclxuICogQHBhcmFtIG51bGwgeFxyXG4gKi9cclxuZnVuY3Rpb24gYWpheCh1cmwsIGNhbGxiYWNrLCBkYXRhLCB4KSB7XHJcbiAgdHJ5IHtcclxuICAgIHggPSBuZXcod2luZG93LlhNTEh0dHBSZXF1ZXN0IHx8IEFjdGl2ZVhPYmplY3QpKCdNU1hNTDIuWE1MSFRUUC4zLjAnKTtcclxuICAgIHgub3BlbihkYXRhID8gJ1BPU1QnIDogJ0dFVCcsIHVybCwgMSk7XHJcbiAgICB4LnNldFJlcXVlc3RIZWFkZXIoJ1gtUmVxdWVzdGVkLVdpdGgnLCAnWE1MSHR0cFJlcXVlc3QnKTtcclxuICAgIHguc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xyXG4gICAgeC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHgucmVhZHlTdGF0ZSA+IDMgJiYgY2FsbGJhY2sgJiYgY2FsbGJhY2soeC5yZXNwb25zZVRleHQsIHgpO1xyXG4gICAgfTtcclxuICAgIHguc2VuZChkYXRhKVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIHdpbmRvdy5jb25zb2xlICYmIGNvbnNvbGUubG9nKGUpO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFqYXg7XHJcblxyXG5cclxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1hNTEh0dHBSZXF1ZXN0XHJcbi8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2plZC85OTM1ODVcclxuLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vRmx1aWRieXRlLzUwODIzNzdcclxuLy8gaHR0cHM6Ly9naXRodWIuY29tL1hlb25jcm9zcy9rYl9qYXZhc2NyaXB0X2ZyYW1ld29yay9ibG9iL21hc3Rlci9rQi5qcyNMMzBcclxuLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vaXdlay81NTk5Nzc3XHJcbi8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9tczUzNzUwNSh2PXZzLjg1KS5hc3B4I19pZFxyXG5cclxuLy8gQHRvZG8gbG9vayBpbnRvIGxlbmd0aENvbXB1dGFibGUgZm9yIHhoci51cGxvYWQgYnJvd3NlcnNcclxuLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMTEyNzY1NC93aHktaXMtcHJvZ3Jlc3NldmVudC1sZW5ndGhjb21wdXRhYmxlLWZhbHNlXHJcbi8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTA5NTY1NzQvd2h5LW1pZ2h0LXhtbGh0dHByZXF1ZXN0LXByb2dyZXNzZXZlbnQtbGVuZ3RoY29tcHV0YWJsZS1iZS1mYWxzZVxyXG4vLyBodHRwczovL2dpdGh1Yi5jb20vRm9yYmVzTGluZGVzYXkvYWpheC9ibG9iL21hc3Rlci9pbmRleC5qcyIsImltcG9ydCBcIi4uL2xpYi9tb3VzZXRyYXAubWluLmpzXCJcclxuXHJcbnZhciBpbnRlcmFjdGlvbiA9IHt9O1xyXG5cclxuaW50ZXJhY3Rpb24uYXdhaXRJbnB1dCA9IGZ1bmN0aW9uKGVsZW1lbnQpe1xyXG4gIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSxyZWplY3Qpe1xyXG4gICAgdmFyIHJlc29sdmVyID0gZnVuY3Rpb24oKXtcclxuICAgICAgcmVzb2x2ZSh0cnVlKTtcclxuICAgIH07XHJcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByZXNvbHZlcik7XHJcbiAgICBcImEgYiBjIGQgZSBmIGcgaCBpIGogayBsIG0gbiBvIHAgcSByIHMgdCB1IHYgdyB4IHkgeiBzcGFjZSBlbnRlciByZXR1cm5cIi5zcGxpdChcIiBcIikubWFwKGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIE1vdXNldHJhcC5iaW5kKGtleSwgcmVzb2x2ZXIpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIHByb21pc2U7XHJcbn1cclxuXHJcbmludGVyYWN0aW9uLmF3YWl0Q2hvaWNlID0gZnVuY3Rpb24oZWxlbWVudCl7XHJcbiAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xyXG4gICAgdmFyIGNob2ljZXMgPSBlbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Nob2ljZScpO1xyXG4gICAgQXJyYXkuZnJvbShjaG9pY2VzKS5mb3JFYWNoKGZ1bmN0aW9uKGNob2ljZSl7XHJcbiAgICAgIGNob2ljZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgcGF0aCA9IGNob2ljZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBhdGhcIik7XHJcbiAgICAgICAgcmVzb2x2ZShwYXRoKTtcclxuICAgICAgfSk7XHJcbiAgICB9KVxyXG4gICAgLy8gZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAvLyAgIHJlc29sdmUoXCIxXCIpO1xyXG4gICAgLy8gfSlcclxuICB9KTtcclxuICByZXR1cm4gcHJvbWlzZTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgaW50ZXJhY3Rpb247XHJcbiIsImltcG9ydCBhamF4IGZyb20gXCIuL2FqYXguanNcIjtcclxuaW1wb3J0IHBhcnNlciBmcm9tIFwiLi9wYXJzZXIuanNcIjtcclxuaW1wb3J0IHN0b3J5dGVsbGVyIGZyb20gXCIuL3N0b3J5dGVsbGVyLmpzXCI7XHJcblxyXG52YXIgZG9uZSA9IGZhbHNlO1xyXG52YXIgZG9uZUNhbGxiYWNrID0gZnVuY3Rpb24oKXtcclxuICBjb25zb2xlLmxvZyhcInN0YW5kYXJkIGRvbmUgY2FsbGJhY2tcIik7XHJcbn07XHJcbnZhciBzdG9yeTtcclxudmFyIGVsO1xyXG5cclxudmFyIEJsYW5rID0gZnVuY3Rpb24odXJsLCBlbGVtZW50KXtcclxuICB0aGlzLnVybCA9IHVybDtcclxuICBlbCA9IGVsZW1lbnQ7XHJcbiAgYWpheCh1cmwsKGRhdGEpPT57XHJcbiAgICAvLyBwYXJzZSBzdG9yeS4uLlxyXG4gICAgc3RvcnkgPSBwYXJzZXIucGF0aHMoZGF0YSk7XHJcbiAgICBkb25lQ2FsbGJhY2soKTtcclxuICAgIGRvbmUgPSB0cnVlO1xyXG4gIH0pO1xyXG4gIHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5CbGFuay5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBzdGFydCA9ICgpPT57XHJcbiAgICBzdG9yeXRlbGxlci5zdGFydChlbCwgc3RvcnkpO1xyXG4gIH07XHJcbiAgaWYoZG9uZSl7XHJcbiAgICAvLyBzdGFydCBzdG9yeVxyXG4gICAgc3RhcnQoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgZG9uZUNhbGxiYWNrID0gZnVuY3Rpb24oKXtcclxuICAgICAgY29uc29sZS5sb2coXCJuZXcgZG9uZSBjYWxsYmFja1wiKTtcclxuICAgICAgc3RhcnQoKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbndpbmRvdy5CbGFuayA9IEJsYW5rOyIsInZhciBjb250ZW50O1xyXG5cclxuZnVuY3Rpb24gUGFwZXIoZWxlbWVudCl7XHJcbiAgaWYoZWxlbWVudCBpbnN0YW5jZW9mIEVsZW1lbnQpe1xyXG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuICB9IGVsc2UgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBBcnJheSAmJiBlbGVtZW50Lmxlbmd0aCA+IDApe1xyXG4gICAgaWYoZWxlbWVudFswXSBpbnN0YW5jZW9mIEVsZW1lbnQpe1xyXG4gICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50WzBdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUHJvdmlkZWQgYW4gYXJyYXkgd2l0aCBubyBlbGVtZW50IHR5cGVzLlwiKTtcclxuICAgIH1cclxuICB9IGVsc2UgaWYgKHR5cGVvZiBlbGVtZW50ID09PSBcInN0cmluZ1wiKXtcclxuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudCk7XHJcbiAgICBpZighdGhpcy5lbGVtZW50KSB0aHJvdyBuZXcgRXJyb3IoXCJQcm92aWRlZCBhIHN0cmluZywgYnV0IG5vIGVsZW1lbnQgbWF0Y2hlcyBcIitlbGVtZW50KTtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiUHJvdmlkZSBhbiBlbGVtZW50IG9yIGlkL2NsYXNzIHN0cmluZyBvZiBlbGVtZW50IHRvIGRpc3BsYXkgeW91ciBzdG9yeSBvblwiKTtcclxuICB9IFxyXG5cclxuICBpbml0RG9jdW1lbnQodGhpcy5lbGVtZW50KTtcclxufVxyXG5cclxuZnVuY3Rpb24gaW5pdERvY3VtZW50KGVsKXtcclxuICAvLyBjcmVhdGUgdG9wIGxldmVsIHdyYXBwZXJcclxuICB2YXIgb3V0ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gIHZhciBpbm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgb3V0ZXIuYXBwZW5kQ2hpbGQoaW5uZXIpO1xyXG4gIG91dGVyLmNsYXNzTGlzdC5hZGQoXCJnZy1ibGFuay1wYWdlLXdyYXBwZXJcIik7XHJcbiAgaW5uZXIuY2xhc3NMaXN0LmFkZChcImlubmVyLXdyYXBwZXJcIik7XHJcbiAgZWwuYXBwZW5kQ2hpbGQob3V0ZXIpO1xyXG4gIGNvbnRlbnQgPSBpbm5lcjtcclxufVxyXG5cclxuXHJcblxyXG4vKipcclxuICogQ3JlYXRlcyBuZXcgcGFyYWdyYXBoIG9uIGVsZW1lbnRcclxuICogXHJcbiAqIEBwYXJhbSBwYXJhZ3JhcGggc3RyaW5nXHJcbiAqL1xyXG5QYXBlci5wcm90b3R5cGUud3JpdGVQYXJhZ3JhcGggPSBmdW5jdGlvbihwYXJhZ3JhcGgpe1xyXG4gIHZhciBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XHJcbiAgcC5pbm5lckhUTUwgPSBwYXJhZ3JhcGg7XHJcbiAgdGhpcy5jdXJyZW50UGFyYWdyYXBoID0gcDtcclxuICBjb250ZW50LmFwcGVuZENoaWxkKHApO1xyXG59XHJcblxyXG4vKipcclxuICogQWRkIHRleHQgdG8gcGFyYWdyYXBoIGFmdGVyIGNvbnRpbnVlXHJcbiAqIFxyXG4gKiBAcGFyYW0gbW9yZSAoZGVzY3JpcHRpb24pXHJcbiAqL1xyXG5QYXBlci5wcm90b3R5cGUuY29udGludWUgPSBmdW5jdGlvbihtb3JlKXtcclxuICBpZighdGhpcy5jdXJyZW50UGFyYWdyYXBoKXtcclxuICAgIHRoaXMud3JpdGVQYXJhZ3JhcGgobW9yZSk7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIHZhciBwID0gdGhpcy5jdXJyZW50UGFyYWdyYXBoO1xyXG4gIHAuaW5uZXJIVE1MID0gcC5pbm5lckhUTUwgKyBtb3JlO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQYXBlcjtcclxuXHJcbi8vIGZ1bmN0aW9uIGFkZCh3b3JkKXtcclxuLy8gICB2YXIgaW5kZXggPSAwO1xyXG4vLyAgIGlmKGluZGV4IDwgd29yZC5sZW5ndGgpe1xyXG4vLyAgICAgdmFyIG5leHRDaGFyID0gZnVuY3Rpb24oKXtcclxuLy8gICAgICAgdmFyIGMgPSB3b3JkW2luZGV4XTtcclxuLy8gICAgICAgaWYoL1xccy9nLnRlc3QoYykpe1xyXG4vLyAgICAgICAgIGluZGV4KytcclxuLy8gICAgICAgICBpZiAoaW5kZXggPj0gd29yZC5sZW5ndGgpIHJldHVyblxyXG4gICAgICAgIFxyXG4vLyAgICAgICAgIGM9Yyt3b3JkW2luZGV4XTtcclxuLy8gICAgICAgfVxyXG4vLyAgICAgICBwYXBlci5jb250aW51ZShjKVxyXG4vLyAgICAgICBpbmRleCsrO1xyXG4vLyAgICAgICBpZihpbmRleCA8IHdvcmQubGVuZ3RoKXtcclxuLy8gICAgICAgICBzZXRUaW1lb3V0KG5leHRDaGFyLCAxMDApO1xyXG4vLyAgICAgICB9XHJcbi8vICAgICB9XHJcbi8vICAgICBzZXRUaW1lb3V0KG5leHRDaGFyLCAxMCk7XHJcbi8vICAgfVxyXG4vLyB9IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmZ1bmN0aW9uIFBhcnNlcigpIHt9XHJcblxyXG4vLyDCpyAtIHBhdGggZGVsaW1pdGVyXHJcbnZhciBwYXRoUmVnZXggPSAvwqcoXFx3KykoPz1cXHMpLztcclxudmFyIGJlZ2luc1dpdGhOZXdsaW5lID0gL15cXHMqXFxuLztcclxudmFyIHBhcmFSZWdleCA9IC9eXFxzKlxcbi87XHJcbnZhciB3aGl0ZVNwYWNlID0gL15cXHMqJC87XHJcbnZhciB0cmFpbGluZ1doaXRlc3BhY2UgPSAvXFxzKiQvO1xyXG52YXIgbW9yZSA9IFwiWy4uLl1cIjtcclxuXHJcbnZhciBzdHJvbmcgPSAvKFxcKlxcKnxfXykoW15dKj8pXFwxL2c7XHJcbnZhciBzdHJvbmdSZXBsID0gXCI8c3Ryb25nPiQyPC9zdHJvbmc+XCI7XHJcbnZhciBpdGFsaWNzID0gLyhcXCp8X18pKFteXSo/KVxcMS9nO1xyXG52YXIgaXRhbGljc1JlcGwgPSBcIjxlbT4kMjwvZW0+XCI7XHJcblxyXG52YXIgbXVsdGlwbGVDaG9pY2UgPSAvKDo6KShbXl0qPylcXDEvIC8vIDo6KENob2ljZSBvbmU9PjEpKENob2ljZSB0d289PjIpOjpcclxudmFyIGRlY2lzaW9ucyA9IC8oXFwoKSguKj8pPT4oXFx3KikoXFwpKS9nXHJcblxyXG5cclxuXHJcblBhcnNlci5wcm90b3R5cGUucGF0aHMgPSBmdW5jdGlvbih0ZXh0KSB7XHJcbiAgdmFyIHNwbGl0dGVkID0gdGV4dC5zcGxpdChwYXRoUmVnZXgpO1xyXG4gIHZhciBwYXRocyA9IHt9O1xyXG4gIGZvciAodmFyIGkgPSAxOyBpIDwgc3BsaXR0ZWQubGVuZ3RoOyBpICs9IDIpIHtcclxuICAgIGlmIChwYXRoc1tzcGxpdHRlZFtpXV0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBwYXRoc1tzcGxpdHRlZFtpXV0gPSBzcGxpdHRlZFtpICsgMV07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZyhgV2FybmluZyAtIFBhdGggJHtwYXRoc1tzcGxpdHRlZFtpXV19IGRlZmluZWQgbXVsdGlwbGUgdGltZXMhYCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGNvbnNvbGUubG9nKHBhdGhzKTtcclxuICByZXR1cm4gcGF0aHM7XHJcbn07XHJcblxyXG5mdW5jdGlvbiB0cmltU3BhY2UodGV4dCkge1xyXG4gIGlmICh0ZXh0LmluZGV4T2YoXCIgXCIpID09PSAwKSB7XHJcbiAgICAvLyByZW1vdmUgZmlyc3Qgc3BhY2UgZnJvbSBub24gbmV3bGluZSBzZWN0aW9uc1xyXG4gICAgdGV4dCA9IHRleHQuc2xpY2UoMSwgdGV4dC5sZW5ndGggLSAxKTtcclxuICB9XHJcbiAgcmV0dXJuIHRleHQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRyaW1OZXdsaW5lT3JTcGFjZSh0ZXh0KSB7XHJcbiAgdmFyIG5ld2xpbmUgPSBiZWdpbnNXaXRoTmV3bGluZS50ZXN0KHRleHQpO1xyXG4gIGlmIChuZXdsaW5lKSB0ZXh0ID0gdGV4dC5zcGxpdChiZWdpbnNXaXRoTmV3bGluZSlbMV07XHJcbiAgZWxzZSB0ZXh0ID0gdHJpbVNwYWNlKHRleHQpO1xyXG4gIHJldHVybiBbbmV3bGluZSwgdGV4dF07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNwbGl0UGFyYWdyYXBocyh0ZXh0KSB7XHJcbiAgdmFyIHBhcmFncmFwaHMgPSB0ZXh0LnNwbGl0KC9cXHI/XFxuXFxyP1xcbi9nKTtcclxuICBwYXJhZ3JhcGhzID0gcGFyYWdyYXBocy5maWx0ZXIoZnVuY3Rpb24ocCkge1xyXG4gICAgcmV0dXJuICF3aGl0ZVNwYWNlLnRlc3QocCk7XHJcbiAgfSk7XHJcbiAgcGFyYWdyYXBocyA9IHBhcmFncmFwaHMubWFwKGZ1bmN0aW9uKHApIHtcclxuICAgIHZhciBwcyA9IHAuc3BsaXQobW9yZSk7XHJcbiAgICBwc1twcy5sZW5ndGggLSAxXSA9IHBzW3BzLmxlbmd0aCAtIDFdLnJlcGxhY2UodHJhaWxpbmdXaGl0ZXNwYWNlLCBcIlwiKTtcclxuICAgIHJldHVybiBwcztcclxuICB9KTtcclxuICByZXR1cm4gcGFyYWdyYXBocztcclxufVxyXG5cclxuUGFyc2VyLnByb3RvdHlwZS5zZWN0aW9uID0gZnVuY3Rpb24odGV4dCkge1xyXG4gIHZhciBzZWN0aW9uID0ge307XHJcbiAgdmFyIG5sID0gdHJpbU5ld2xpbmVPclNwYWNlKHRleHQpO1xyXG5cclxuICB0ZXh0ID0gbmxbMV07XHJcbiAgc2VjdGlvbi5uZXdsaW5lID0gbmxbMF07XHJcbiAgc2VjdGlvbi5wYXJhZ3JhcGhzID0gc3BsaXRQYXJhZ3JhcGhzKHRleHQpO1xyXG5cclxuICBjb25zb2xlLmxvZyhzZWN0aW9uKTtcclxuICByZXR1cm4gc2VjdGlvbjtcclxufTtcclxuXHJcbmZ1bmN0aW9uIHBhcnNlRm9udFN0eWxlKHRleHQpe1xyXG4gIC8vICppdGFsaWNzKlxyXG4gIC8vICoqc3Ryb25nKipcclxuXHJcbiAgdGV4dCA9IHRleHQucmVwbGFjZShzdHJvbmcsIHN0cm9uZ1JlcGwpO1xyXG4gIHRleHQgPSB0ZXh0LnJlcGxhY2UoaXRhbGljcywgaXRhbGljc1JlcGwpO1xyXG4gIHJldHVybiB0ZXh0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUxpbmVCcmVha3ModGV4dCl7XHJcbiAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFxyP1xcbi9nLFwiPGJyPlwiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VNdWx0aXBsZUNob2ljZShwYXJ0KXtcclxuICB2YXIgbWF0Y2ggPSBtdWx0aXBsZUNob2ljZS5leGVjKHBhcnQpO1xyXG4gIGlmKCFtYXRjaCkgXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgdmFyIG1jID0gbWF0Y2hbMl07XHJcblxyXG4gIHZhciBjaG9pY2VIdG1sID0gJzxkaXYgY2xhc3M9XCJjaG9pY2VcIiBkYXRhLXBhdGg9XCIkM1wiPiQyPC9kaXY+JztcclxuICB2YXIgY2hvaWNlcyA9IG1jLnJlcGxhY2UoZGVjaXNpb25zLCBjaG9pY2VIdG1sKTtcclxuICBpZihtYyA9PSBjaG9pY2VzKVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIGNob2ljZXMgPSBgPGRpdiBjbGFzcz1cIm11bHRpcGxlLWNob2ljZVwiPiR7Y2hvaWNlc308L2Rpdj5gO1xyXG5cclxuICAvLyByZXBsYWNlIGluIHRoZSBpbnB1dCBzdHJpbmdcclxuICBwYXJ0ID0gcGFydC5yZXBsYWNlKG1hdGNoWzBdLCBjaG9pY2VzKTtcclxuICByZXR1cm4gcGFydDtcclxufVxyXG5cclxuUGFyc2VyLnByb3RvdHlwZS5wYXJ0ID0gZnVuY3Rpb24ocGFydCl7XHJcbiAgdmFyIGh0bWwgPSBwYXJzZUZvbnRTdHlsZShwYXJ0KTtcclxuICBodG1sID0gcGFyc2VMaW5lQnJlYWtzKGh0bWwpO1xyXG4gIHZhciBtYyA9IHBhcnNlTXVsdGlwbGVDaG9pY2UoaHRtbCk7XHJcblxyXG4gIHZhciBwYXJzZWQgPSB7XHJcbiAgICB0ZXh0OiBtYyB8fCBodG1sLFxyXG4gICAgbXVsdGlwbGVDaG9pY2U6ICEhbWNcclxuICB9O1xyXG5cclxuICByZXR1cm4gcGFyc2VkO1xyXG59O1xyXG5cclxuXHJcbnZhciBwYXJzZXIgPSBuZXcgUGFyc2VyKCk7XHJcbi8vIG1vZHVsZS5leHBvcnRzID0gcGFyc2VyO1xyXG5leHBvcnQgZGVmYXVsdCBwYXJzZXI7XHJcbiIsImltcG9ydCBwYXJzZXIgZnJvbSBcIi4vcGFyc2VyLmpzXCI7XHJcbmltcG9ydCBQYXBlciBmcm9tIFwiLi9wYXBlci5qc1wiO1xyXG5pbXBvcnQgaW50ZXJhY3Rpb24gZnJvbSBcIi4vaW50ZXJhY3Rpb24uanNcIjtcclxuXHJcbmZ1bmN0aW9uIFN0b3J5dGVsbGVyKCl7fVxyXG5cclxudmFyIGN1cnJlbnRQYXRoID0gXCIwXCI7IC8vIHN0YXJ0ICBcclxudmFyIGN1cnJlbnRTZWN0aW9uID0gbnVsbDtcclxudmFyIHBhcGVyO1xyXG52YXIgX3N0b3J5O1xyXG5cclxuU3Rvcnl0ZWxsZXIucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24oZWxlbWVudCwgc3Rvcnkpe1xyXG4gIC8vIGluaXRcclxuICBwYXBlciA9IG5ldyBQYXBlcihlbGVtZW50KTtcclxuICBfc3RvcnkgPSBzdG9yeTtcclxuICBcclxuICAvLyBwYXJzZSBzdGFydGluZyBwb2ludCDCpzBcclxuICB0ZWxsU2VjdGlvbihjdXJyZW50UGF0aCk7XHJcbn1cclxuXHJcbnZhciBtb3JlO1xyXG52YXIgbXVsdGlwbGVDaG9pY2U7XHJcbnZhciBwSW5kZXg7XHJcbnZhciBzSW5kZXg7XHJcblxyXG5mdW5jdGlvbiBub05ld2xpbmUoaSxqLHNlY3Rpb24pe1xyXG4gIHZhciBmaXJzdFBhcmFncmFwaCA9IGo9PTA7XHJcbiAgdmFyIGNvbnRpbnVpbmdQYXJhZ3JhcGggPSBqPjA7XHJcbiAgcmV0dXJuICEoZmlyc3RQYXJhZ3JhcGggJiYgc2VjdGlvbi5uZXdsaW5lKTtcclxuICAvL3JldHVybiAhZmlyc3RQYXJhZ3JhcGggfHwgIWNvbnRpbnVpbmdQYXJhZ3JhcGg7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUZWxscyB0aGUgc21hbGxlc3QgZnJhY3Rpb24gb2YgdGhlIHN0b3J5IGFuZCBkZWxlZ2F0ZXMgaW50ZXJhY3Rpb25zXHJcbiAqL1xyXG5mdW5jdGlvbiB0ZWxsUGFydChzZWN0aW9uLCBpLCBqKXtcclxuICBpZihtb3JlKSBtb3JlLnJlbW92ZSgpXHJcbiAgLy8gb25seSBmaXJzdCBsaW5lIG9mIHNlY3Rpb24gZmlyc3QgcGFydFxyXG4gIC8vIHdyaXRlIG5ldyBwYXJhZ3JhcGggb3IgY29udGludWUgb2xkIG9uZS4uLlxyXG4gIHZhciBwYXJ0ID0gcGFyc2VyLnBhcnQoc2VjdGlvbi5wYXJhZ3JhcGhzW2ldW2pdKTtcclxuICBcclxuICBpZihub05ld2xpbmUoaSwgaiwgc2VjdGlvbikpe1xyXG4gICAgcGFwZXIuY29udGludWUocGFydC50ZXh0KTtcclxuICB9IGVsc2Uge1xyXG4gICAgcGFwZXIud3JpdGVQYXJhZ3JhcGgocGFydC50ZXh0KTtcclxuICB9XHJcbiAgXHJcbiAgaWYocGFydC5tdWx0aXBsZUNob2ljZSl7XHJcbiAgICAvLyBjcmVhdGUgbGlzdGVuZXJzIGZvciBtdWx0aXBsZSBjaG9pY2VcclxuICAgIHZhciBtdWx0aXBsZUNob2ljZSA9IHBhcGVyLmN1cnJlbnRQYXJhZ3JhcGguZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIm11bHRpcGxlLWNob2ljZVwiKVswXTtcclxuICAgIGludGVyYWN0aW9uLmF3YWl0Q2hvaWNlKG11bHRpcGxlQ2hvaWNlKS50aGVuKGZ1bmN0aW9uKGNob2ljZSl7XHJcbiAgICAgIG11bHRpcGxlQ2hvaWNlLnJlbW92ZSgpO1xyXG4gICAgICB0ZWxsU2VjdGlvbihjaG9pY2UpO1xyXG4gICAgfSk7XHJcbiAgICBcclxuICB9IGVsc2Uge1xyXG4gICAgdmFyIGVuZCA9IGk+PXNlY3Rpb24ucGFyYWdyYXBocy5sZW5ndGgtMSAmJiBqPj1zZWN0aW9uLnBhcmFncmFwaHNbaV0ubGVuZ3RoLTE7XHJcbiAgICBpZighZW5kKXtcclxuICAgICAgbW9yZSA9IGNyZWF0ZU1vcmVJbmRpY2F0aW9uKHBhcGVyLmN1cnJlbnRQYXJhZ3JhcGgpO1xyXG4gICAgICBpbnRlcmFjdGlvbi5hd2FpdElucHV0KG1vcmUpLnRoZW4oZm9yRXZlcnlQYXJ0KTtcclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcblxyXG4vKiogXHJcbiAqIHJ1bnMgZm9yIGV2ZXJ5IHBhcnQgKGEgcGFydCBpcyBhIHN1YnNlY3Rpb24gb2YgYSBwYXJhZ3JhcGgpXHJcbiAqL1xyXG5mdW5jdGlvbiBmb3JFdmVyeVBhcnQoKXtcclxuICBzSW5kZXgrKztcclxuICBpZihzSW5kZXggPCBjdXJyZW50U2VjdGlvbi5wYXJhZ3JhcGhzW3BJbmRleF0ubGVuZ3RoKXtcclxuICAgIHRlbGxQYXJ0KGN1cnJlbnRTZWN0aW9uLHBJbmRleCxzSW5kZXgpO1xyXG4gICAgXHJcbiAgfSBlbHNlIHtcclxuICAgIHBJbmRleCsrO1xyXG4gICAgZm9yRXZlcnlQYXJhZ3JhcGgoKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiAgcnVucyBmb3IgZXZlcnkgcGFyYWdyYXBoIChvZiBhIHNlY3Rpb24pXHJcbiAqL1xyXG5mdW5jdGlvbiBmb3JFdmVyeVBhcmFncmFwaCgpe1xyXG4gIHNJbmRleCA9IDA7XHJcbiAgaWYocEluZGV4ID49IGN1cnJlbnRTZWN0aW9uLnBhcmFncmFwaHMubGVuZ3RoKSByZXR1cm47XHJcblxyXG4gIHRlbGxQYXJ0KGN1cnJlbnRTZWN0aW9uLHBJbmRleCxzSW5kZXgpO1xyXG59XHJcblxyXG4vKipcclxuICogVGVsbHMgb25lIGNvbXBsZXRlIHNlY3Rpb24vcGF0aCBvZiBhIHN0b3J5XHJcbiAqL1xyXG5mdW5jdGlvbiB0ZWxsU2VjdGlvbihpZCl7XHJcbiAgY3VycmVudFNlY3Rpb24gPSBwYXJzZXIuc2VjdGlvbihfc3RvcnlbaWRdKTtcclxuICBpZiAoY3VycmVudFNlY3Rpb24ucGFyYWdyYXBocy5sZW5ndGg+MCl7XHJcbiAgICBwSW5kZXggPSAwO1xyXG4gICAgZm9yRXZlcnlQYXJhZ3JhcGgoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gZW5kIG9mIHN0b3J5Li4uID9cclxuICAgIC8vIHNlY3Rpb24gaGFzIG5vIHBhcmFncmFwaHNcclxuICAgIGNvbnNvbGUubG9nKGBTZWN0aW9uICR7Y3VycmVudFBhdGh9IGhhcyBubyBwYXJhZ3JhcGhzLiBTbyB0aGlzIGlzIHRoZSBlbmRgKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZU1vcmVJbmRpY2F0aW9uKHApe1xyXG4gIHZhciBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgc3Bhbi5pbm5lclRleHQgPSBcIuKAuuKAulwiO1xyXG4gIHNwYW4uY2xhc3NMaXN0LmFkZChcIm1vcmVcIik7XHJcbiAgcC5hcHBlbmRDaGlsZChzcGFuKTtcclxuICByZXR1cm4gc3BhbjtcclxufVxyXG5cclxudmFyIHN0b3J5dGVsbGVyID0gbmV3IFN0b3J5dGVsbGVyKCk7XHJcbmV4cG9ydCBkZWZhdWx0IHN0b3J5dGVsbGVyOyIsIi8qIG1vdXNldHJhcCB2MS41LjMgY3JhaWcuaXMva2lsbGluZy9taWNlICovXHJcbihmdW5jdGlvbihDLHIsZyl7ZnVuY3Rpb24gdChhLGIsaCl7YS5hZGRFdmVudExpc3RlbmVyP2EuYWRkRXZlbnRMaXN0ZW5lcihiLGgsITEpOmEuYXR0YWNoRXZlbnQoXCJvblwiK2IsaCl9ZnVuY3Rpb24geChhKXtpZihcImtleXByZXNzXCI9PWEudHlwZSl7dmFyIGI9U3RyaW5nLmZyb21DaGFyQ29kZShhLndoaWNoKTthLnNoaWZ0S2V5fHwoYj1iLnRvTG93ZXJDYXNlKCkpO3JldHVybiBifXJldHVybiBsW2Eud2hpY2hdP2xbYS53aGljaF06cFthLndoaWNoXT9wW2Eud2hpY2hdOlN0cmluZy5mcm9tQ2hhckNvZGUoYS53aGljaCkudG9Mb3dlckNhc2UoKX1mdW5jdGlvbiBEKGEpe3ZhciBiPVtdO2Euc2hpZnRLZXkmJmIucHVzaChcInNoaWZ0XCIpO2EuYWx0S2V5JiZiLnB1c2goXCJhbHRcIik7YS5jdHJsS2V5JiZiLnB1c2goXCJjdHJsXCIpO2EubWV0YUtleSYmYi5wdXNoKFwibWV0YVwiKTtyZXR1cm4gYn1mdW5jdGlvbiB1KGEpe3JldHVyblwic2hpZnRcIj09YXx8XCJjdHJsXCI9PWF8fFwiYWx0XCI9PWF8fFxyXG5cIm1ldGFcIj09YX1mdW5jdGlvbiB5KGEsYil7dmFyIGgsYyxlLGc9W107aD1hO1wiK1wiPT09aD9oPVtcIitcIl06KGg9aC5yZXBsYWNlKC9cXCt7Mn0vZyxcIitwbHVzXCIpLGg9aC5zcGxpdChcIitcIikpO2ZvcihlPTA7ZTxoLmxlbmd0aDsrK2UpYz1oW2VdLHpbY10mJihjPXpbY10pLGImJlwia2V5cHJlc3NcIiE9YiYmQVtjXSYmKGM9QVtjXSxnLnB1c2goXCJzaGlmdFwiKSksdShjKSYmZy5wdXNoKGMpO2g9YztlPWI7aWYoIWUpe2lmKCFrKXtrPXt9O2Zvcih2YXIgbSBpbiBsKTk1PG0mJjExMj5tfHxsLmhhc093blByb3BlcnR5KG0pJiYoa1tsW21dXT1tKX1lPWtbaF0/XCJrZXlkb3duXCI6XCJrZXlwcmVzc1wifVwia2V5cHJlc3NcIj09ZSYmZy5sZW5ndGgmJihlPVwia2V5ZG93blwiKTtyZXR1cm57a2V5OmMsbW9kaWZpZXJzOmcsYWN0aW9uOmV9fWZ1bmN0aW9uIEIoYSxiKXtyZXR1cm4gbnVsbD09PWF8fGE9PT1yPyExOmE9PT1iPyEwOkIoYS5wYXJlbnROb2RlLGIpfWZ1bmN0aW9uIGMoYSl7ZnVuY3Rpb24gYihhKXthPVxyXG5hfHx7fTt2YXIgYj0hMSxuO2ZvcihuIGluIHEpYVtuXT9iPSEwOnFbbl09MDtifHwodj0hMSl9ZnVuY3Rpb24gaChhLGIsbixmLGMsaCl7dmFyIGcsZSxsPVtdLG09bi50eXBlO2lmKCFkLl9jYWxsYmFja3NbYV0pcmV0dXJuW107XCJrZXl1cFwiPT1tJiZ1KGEpJiYoYj1bYV0pO2ZvcihnPTA7ZzxkLl9jYWxsYmFja3NbYV0ubGVuZ3RoOysrZylpZihlPWQuX2NhbGxiYWNrc1thXVtnXSwoZnx8IWUuc2VxfHxxW2Uuc2VxXT09ZS5sZXZlbCkmJm09PWUuYWN0aW9uKXt2YXIgazsoaz1cImtleXByZXNzXCI9PW0mJiFuLm1ldGFLZXkmJiFuLmN0cmxLZXkpfHwoaz1lLm1vZGlmaWVycyxrPWIuc29ydCgpLmpvaW4oXCIsXCIpPT09ay5zb3J0KCkuam9pbihcIixcIikpO2smJihrPWYmJmUuc2VxPT1mJiZlLmxldmVsPT1oLCghZiYmZS5jb21ibz09Y3x8aykmJmQuX2NhbGxiYWNrc1thXS5zcGxpY2UoZywxKSxsLnB1c2goZSkpfXJldHVybiBsfWZ1bmN0aW9uIGcoYSxiLG4sZil7ZC5zdG9wQ2FsbGJhY2soYixcclxuYi50YXJnZXR8fGIuc3JjRWxlbWVudCxuLGYpfHwhMSE9PWEoYixuKXx8KGIucHJldmVudERlZmF1bHQ/Yi5wcmV2ZW50RGVmYXVsdCgpOmIucmV0dXJuVmFsdWU9ITEsYi5zdG9wUHJvcGFnYXRpb24/Yi5zdG9wUHJvcGFnYXRpb24oKTpiLmNhbmNlbEJ1YmJsZT0hMCl9ZnVuY3Rpb24gZShhKXtcIm51bWJlclwiIT09dHlwZW9mIGEud2hpY2gmJihhLndoaWNoPWEua2V5Q29kZSk7dmFyIGI9eChhKTtiJiYoXCJrZXl1cFwiPT1hLnR5cGUmJnc9PT1iP3c9ITE6ZC5oYW5kbGVLZXkoYixEKGEpLGEpKX1mdW5jdGlvbiBsKGEsYyxuLGYpe2Z1bmN0aW9uIGUoYyl7cmV0dXJuIGZ1bmN0aW9uKCl7dj1jOysrcVthXTtjbGVhclRpbWVvdXQoayk7az1zZXRUaW1lb3V0KGIsMUUzKX19ZnVuY3Rpb24gaChjKXtnKG4sYyxhKTtcImtleXVwXCIhPT1mJiYodz14KGMpKTtzZXRUaW1lb3V0KGIsMTApfWZvcih2YXIgZD1xW2FdPTA7ZDxjLmxlbmd0aDsrK2Qpe3ZhciBwPWQrMT09PWMubGVuZ3RoP2g6ZShmfHxcclxueShjW2QrMV0pLmFjdGlvbik7bShjW2RdLHAsZixhLGQpfX1mdW5jdGlvbiBtKGEsYixjLGYsZSl7ZC5fZGlyZWN0TWFwW2ErXCI6XCIrY109YjthPWEucmVwbGFjZSgvXFxzKy9nLFwiIFwiKTt2YXIgZz1hLnNwbGl0KFwiIFwiKTsxPGcubGVuZ3RoP2woYSxnLGIsYyk6KGM9eShhLGMpLGQuX2NhbGxiYWNrc1tjLmtleV09ZC5fY2FsbGJhY2tzW2Mua2V5XXx8W10saChjLmtleSxjLm1vZGlmaWVycyx7dHlwZTpjLmFjdGlvbn0sZixhLGUpLGQuX2NhbGxiYWNrc1tjLmtleV1bZj9cInVuc2hpZnRcIjpcInB1c2hcIl0oe2NhbGxiYWNrOmIsbW9kaWZpZXJzOmMubW9kaWZpZXJzLGFjdGlvbjpjLmFjdGlvbixzZXE6ZixsZXZlbDplLGNvbWJvOmF9KSl9dmFyIGQ9dGhpczthPWF8fHI7aWYoIShkIGluc3RhbmNlb2YgYykpcmV0dXJuIG5ldyBjKGEpO2QudGFyZ2V0PWE7ZC5fY2FsbGJhY2tzPXt9O2QuX2RpcmVjdE1hcD17fTt2YXIgcT17fSxrLHc9ITEscD0hMSx2PSExO2QuX2hhbmRsZUtleT1mdW5jdGlvbihhLFxyXG5jLGUpe3ZhciBmPWgoYSxjLGUpLGQ7Yz17fTt2YXIgaz0wLGw9ITE7Zm9yKGQ9MDtkPGYubGVuZ3RoOysrZClmW2RdLnNlcSYmKGs9TWF0aC5tYXgoayxmW2RdLmxldmVsKSk7Zm9yKGQ9MDtkPGYubGVuZ3RoOysrZClmW2RdLnNlcT9mW2RdLmxldmVsPT1rJiYobD0hMCxjW2ZbZF0uc2VxXT0xLGcoZltkXS5jYWxsYmFjayxlLGZbZF0uY29tYm8sZltkXS5zZXEpKTpsfHxnKGZbZF0uY2FsbGJhY2ssZSxmW2RdLmNvbWJvKTtmPVwia2V5cHJlc3NcIj09ZS50eXBlJiZwO2UudHlwZSE9dnx8dShhKXx8Znx8YihjKTtwPWwmJlwia2V5ZG93blwiPT1lLnR5cGV9O2QuX2JpbmRNdWx0aXBsZT1mdW5jdGlvbihhLGIsYyl7Zm9yKHZhciBkPTA7ZDxhLmxlbmd0aDsrK2QpbShhW2RdLGIsYyl9O3QoYSxcImtleXByZXNzXCIsZSk7dChhLFwia2V5ZG93blwiLGUpO3QoYSxcImtleXVwXCIsZSl9dmFyIGw9ezg6XCJiYWNrc3BhY2VcIiw5OlwidGFiXCIsMTM6XCJlbnRlclwiLDE2Olwic2hpZnRcIiwxNzpcImN0cmxcIiwxODpcImFsdFwiLFxyXG4yMDpcImNhcHNsb2NrXCIsMjc6XCJlc2NcIiwzMjpcInNwYWNlXCIsMzM6XCJwYWdldXBcIiwzNDpcInBhZ2Vkb3duXCIsMzU6XCJlbmRcIiwzNjpcImhvbWVcIiwzNzpcImxlZnRcIiwzODpcInVwXCIsMzk6XCJyaWdodFwiLDQwOlwiZG93blwiLDQ1OlwiaW5zXCIsNDY6XCJkZWxcIiw5MTpcIm1ldGFcIiw5MzpcIm1ldGFcIiwyMjQ6XCJtZXRhXCJ9LHA9ezEwNjpcIipcIiwxMDc6XCIrXCIsMTA5OlwiLVwiLDExMDpcIi5cIiwxMTE6XCIvXCIsMTg2OlwiO1wiLDE4NzpcIj1cIiwxODg6XCIsXCIsMTg5OlwiLVwiLDE5MDpcIi5cIiwxOTE6XCIvXCIsMTkyOlwiYFwiLDIxOTpcIltcIiwyMjA6XCJcXFxcXCIsMjIxOlwiXVwiLDIyMjpcIidcIn0sQT17XCJ+XCI6XCJgXCIsXCIhXCI6XCIxXCIsXCJAXCI6XCIyXCIsXCIjXCI6XCIzXCIsJDpcIjRcIixcIiVcIjpcIjVcIixcIl5cIjpcIjZcIixcIiZcIjpcIjdcIixcIipcIjpcIjhcIixcIihcIjpcIjlcIixcIilcIjpcIjBcIixfOlwiLVwiLFwiK1wiOlwiPVwiLFwiOlwiOlwiO1wiLCdcIic6XCInXCIsXCI8XCI6XCIsXCIsXCI+XCI6XCIuXCIsXCI/XCI6XCIvXCIsXCJ8XCI6XCJcXFxcXCJ9LHo9e29wdGlvbjpcImFsdFwiLGNvbW1hbmQ6XCJtZXRhXCIsXCJyZXR1cm5cIjpcImVudGVyXCIsXHJcbmVzY2FwZTpcImVzY1wiLHBsdXM6XCIrXCIsbW9kOi9NYWN8aVBvZHxpUGhvbmV8aVBhZC8udGVzdChuYXZpZ2F0b3IucGxhdGZvcm0pP1wibWV0YVwiOlwiY3RybFwifSxrO2ZvcihnPTE7MjA+ZzsrK2cpbFsxMTErZ109XCJmXCIrZztmb3IoZz0wOzk+PWc7KytnKWxbZys5Nl09ZztjLnByb3RvdHlwZS5iaW5kPWZ1bmN0aW9uKGEsYixjKXthPWEgaW5zdGFuY2VvZiBBcnJheT9hOlthXTt0aGlzLl9iaW5kTXVsdGlwbGUuY2FsbCh0aGlzLGEsYixjKTtyZXR1cm4gdGhpc307Yy5wcm90b3R5cGUudW5iaW5kPWZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMuYmluZC5jYWxsKHRoaXMsYSxmdW5jdGlvbigpe30sYil9O2MucHJvdG90eXBlLnRyaWdnZXI9ZnVuY3Rpb24oYSxiKXtpZih0aGlzLl9kaXJlY3RNYXBbYStcIjpcIitiXSl0aGlzLl9kaXJlY3RNYXBbYStcIjpcIitiXSh7fSxhKTtyZXR1cm4gdGhpc307Yy5wcm90b3R5cGUucmVzZXQ9ZnVuY3Rpb24oKXt0aGlzLl9jYWxsYmFja3M9e307dGhpcy5fZGlyZWN0TWFwPVxyXG57fTtyZXR1cm4gdGhpc307Yy5wcm90b3R5cGUuc3RvcENhbGxiYWNrPWZ1bmN0aW9uKGEsYil7cmV0dXJuLTE8KFwiIFwiK2IuY2xhc3NOYW1lK1wiIFwiKS5pbmRleE9mKFwiIG1vdXNldHJhcCBcIil8fEIoYix0aGlzLnRhcmdldCk/ITE6XCJJTlBVVFwiPT1iLnRhZ05hbWV8fFwiU0VMRUNUXCI9PWIudGFnTmFtZXx8XCJURVhUQVJFQVwiPT1iLnRhZ05hbWV8fGIuaXNDb250ZW50RWRpdGFibGV9O2MucHJvdG90eXBlLmhhbmRsZUtleT1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9oYW5kbGVLZXkuYXBwbHkodGhpcyxhcmd1bWVudHMpfTtjLmluaXQ9ZnVuY3Rpb24oKXt2YXIgYT1jKHIpLGI7Zm9yKGIgaW4gYSlcIl9cIiE9PWIuY2hhckF0KDApJiYoY1tiXT1mdW5jdGlvbihiKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gYVtiXS5hcHBseShhLGFyZ3VtZW50cyl9fShiKSl9O2MuaW5pdCgpO0MuTW91c2V0cmFwPWM7XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzJiYobW9kdWxlLmV4cG9ydHM9XHJcbmMpO1wiZnVuY3Rpb25cIj09PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQmJmRlZmluZShmdW5jdGlvbigpe3JldHVybiBjfSl9KSh3aW5kb3csZG9jdW1lbnQpO1xyXG4iXX0=
