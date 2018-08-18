(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

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
    x = new (window.XMLHttpRequest || ActiveXObject)("MSXML2.XMLHTTP.3.0");
    x.open(data ? "POST" : "GET", url, 1);
    x.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    x.onreadystatechange = function () {
      x.readyState > 3 && callback && callback(x.responseText, x);
    };
    x.send(data);
  } catch (e) {
    window.console && console.log(e);
  }
}

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
    var choices = element.getElementsByClassName("choice");
    Array.from(choices).forEach(function (choice) {
      choice.addEventListener("click", function () {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9hamF4LmpzIiwianMvaW50ZXJhY3Rpb24uanMiLCJqcy9tYWluLmpzIiwianMvcGFwZXIuanMiLCJqcy9wYXJzZXIuanMiLCJqcy9zdG9yeXRlbGxlci5qcyIsImxpYi9tb3VzZXRyYXAubWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNBQTs7Ozs7Ozs7QUFRQSxTQUFTLElBQVQsQ0FBYyxHQUFkLEVBQW1CLFFBQW5CLEVBQTZCLElBQTdCLEVBQW1DLENBQW5DLEVBQXNDO0FBQ3BDLE1BQUk7QUFDRixRQUFJLEtBQUssT0FBTyxjQUFQLElBQXlCLGFBQTlCLEVBQTZDLG9CQUE3QyxDQUFKO0FBQ0EsTUFBRSxJQUFGLENBQU8sT0FBTyxNQUFQLEdBQWdCLEtBQXZCLEVBQThCLEdBQTlCLEVBQW1DLENBQW5DO0FBQ0EsTUFBRSxnQkFBRixDQUFtQixrQkFBbkIsRUFBdUMsZ0JBQXZDO0FBQ0EsTUFBRSxnQkFBRixDQUFtQixjQUFuQixFQUFtQyxtQ0FBbkM7QUFDQSxNQUFFLGtCQUFGLEdBQXVCLFlBQVc7QUFDaEMsUUFBRSxVQUFGLEdBQWUsQ0FBZixJQUFvQixRQUFwQixJQUFnQyxTQUFTLEVBQUUsWUFBWCxFQUF5QixDQUF6QixDQUFoQztBQUNELEtBRkQ7QUFHQSxNQUFFLElBQUYsQ0FBTyxJQUFQO0FBQ0QsR0FURCxDQVNFLE9BQU8sQ0FBUCxFQUFVO0FBQ1YsV0FBTyxPQUFQLElBQWtCLFFBQVEsR0FBUixDQUFZLENBQVosQ0FBbEI7QUFDRDtBQUNGOztrQkFFYyxJOztBQUVmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNqQ0EsSUFBSSxjQUFjLEVBQWxCOztBQUVBLFlBQVksVUFBWixHQUF5QixVQUFTLE9BQVQsRUFBa0I7QUFDekMsTUFBSSxVQUFVLElBQUksT0FBSixDQUFZLFVB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QUUsU0FBRixDQUFZLFNBQVosR0FBc0IsWUFBVTtBQUFDLFdBQU8sS0FBSyxVQUFMLENBQWdCLEtBQWhCLENBQXNCLElBQXRCLEVBQTJCLFNBQTNCLENBQVA7QUFBNkMsR0FBOUUsQ0FBK0UsRUFBRSxJQUFGLEdBQU8sWUFBVTtBQUFDLFFBQUksSUFBRSxFQUFFLENBQUYsQ0FBTjtBQUFBLFFBQVcsQ0FBWCxDQUFhLEtBQUksQ0FBSixJQUFTLENBQVQ7QUFBVyxjQUFNLEVBQUUsTUFBRixDQUFTLENBQVQsQ0FBTixLQUFvQixFQUFFLENBQUYsSUFBSyxVQUFTLENBQVQsRUFBVztBQUFDLGVBQU8sWUFBVTtBQUFDLGlCQUFPLEVBQUUsQ0FBRixFQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWEsU0FBYixDQUFQO0FBQStCLFNBQWpEO0FBQWtELE9BQTlELENBQStELENBQS9ELENBQXpCO0FBQVg7QUFBdUcsR0FBdEksQ0FBdUksRUFBRSxJQUFGLEdBQVMsRUFBRSxTQUFGLEdBQVksQ0FBWixDQUFjLGdCQUFjLE9BQU8sTUFBckIsSUFBNkIsT0FBTyxPQUFwQyxLQUE4QyxPQUFPLE9BQVAsR0FDbGYsQ0FEb2MsRUFDamMsZUFBYSxPQUFPLE1BQXBCLElBQTRCLE9BQU8sR0FBbkMsSUFBd0MsT0FBTyxZQUFVO0FBQUMsV0FBTyxDQUFQO0FBQVMsR0FBM0IsQ0FBeEM7QUFBcUUsQ0FUeEUsRUFTMEUsTUFUMUUsRUFTaUYsUUFUakYiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcbiAqIElFIDUuNSssIEZpcmVmb3gsIE9wZXJhLCBDaHJvbWUsIFNhZmFyaSBYSFIgb2JqZWN0XG4gKiBcbiAqIEBwYXJhbSBzdHJpbmcgdXJsXG4gKiBAcGFyYW0gb2JqZWN0IGNhbGxiYWNrXG4gKiBAcGFyYW0gbWl4ZWQgZGF0YVxuICogQHBhcmFtIG51bGwgeFxuICovXG5mdW5jdGlvbiBhamF4KHVybCwgY2FsbGJhY2ssIGRhdGEsIHgpIHtcbiAgdHJ5IHtcbiAgICB4ID0gbmV3ICh3aW5kb3cuWE1MSHR0cFJlcXVlc3QgfHwgQWN0aXZlWE9iamVjdCkoXCJNU1hNTDIuWE1MSFRUUC4zLjBcIik7XG4gICAgeC5vcGVuKGRhdGEgPyBcIlBPU1RcIiA6IFwiR0VUXCIsIHVybCwgMSk7XG4gICAgeC5zZXRSZXF1ZXN0SGVhZGVyKFwiWC1SZXF1ZXN0ZWQtV2l0aFwiLCBcIlhNTEh0dHBSZXF1ZXN0XCIpO1xuICAgIHguc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiKTtcbiAgICB4Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgeC5yZWFkeVN0YXRlID4gMyAmJiBjYWxsYmFjayAmJiBjYWxsYmFjayh4LnJlc3BvbnNlVGV4dCwgeCk7XG4gICAgfTtcbiAgICB4LnNlbmQoZGF0YSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB3aW5kb3cuY29uc29sZSAmJiBjb25zb2xlLmxvZyhlKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBhamF4O1xuXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvWE1MSHR0cFJlcXVlc3Rcbi8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2plZC85OTM1ODVcbi8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL0ZsdWlkYnl0ZS81MDgyMzc3XG4vLyBodHRwczovL2dpdGh1Yi5jb20vWGVvbmNyb3NzL2tiX2phdmFzY3JpcHRfZnJhbWV3b3JrL2Jsb2IvbWFzdGVyL2tCLmpzI0wzMFxuLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vaXdlay81NTk5Nzc3XG4vLyBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvbXM1Mzc1MDUodj12cy44NSkuYXNweCNfaWRcblxuLy8gQHRvZG8gbG9vayBpbnRvIGxlbmd0aENvbXB1dGFibGUgZm9yIHhoci51cGxvYWQgYnJvd3NlcnNcbi8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTExMjc2NTQvd2h5LWlzLXByb2dyZXNzZXZlbnQtbGVuZ3RoY29tcHV0YWJsZS1mYWxzZVxuLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDk1NjU3NC93aHktbWlnaHQteG1saHR0cHJlcXVlc3QtcHJvZ3Jlc3NldmVudC1sZW5ndGhjb21wdXRhYmxlLWJlLWZhbHNlXG4vLyBodHRwczovL2dpdGh1Yi5jb20vRm9yYmVzTGluZGVzYXkvYWpheC9ibG9iL21hc3Rlci9pbmRleC5qc1xuIiwiaW1wb3J0IFwiLi4vbGliL21vdXNldHJhcC5taW4uanNcIjtcblxudmFyIGludGVyYWN0aW9uID0ge307XG5cbmludGVyYWN0aW9uLmF3YWl0SW5wdXQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlc29sdmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXNvbHZlKHRydWUpO1xuICAgIH07XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcmVzb2x2ZXIpO1xuICAgIFwiYSBiIGMgZCBlIGYgZyBoIGkgaiBrIGwgbSBuIG8gcCBxIHIgcyB0IHUgdiB3IHggeSB6IHNwYWNlIGVudGVyIHJldHVyblwiXG4gICAgICAuc3BsaXQoXCIgXCIpXG4gICAgICAubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBNb3VzZXRyYXAuYmluZChrZXksIHJlc29sdmVyKTtcbiAgICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIHByb21pc2U7XG59O1xuXG5pbnRlcmFjdGlvbi5hd2FpdENob2ljZSA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgY2hvaWNlcyA9IGVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImNob2ljZVwiKTtcbiAgICBBcnJheS5mcm9tKGNob2ljZXMpLmZvckVhY2goZnVuY3Rpb24oY2hvaWNlKSB7XG4gICAgICBjaG9pY2UuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcGF0aCA9IGNob2ljZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBhdGhcIik7XG4gICAgICAgIHJlc29sdmUocGF0aCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICAvLyBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAvLyAgIHJlc29sdmUoXCIxXCIpO1xuICAgIC8vIH0pXG4gIH0pO1xuICByZXR1cm4gcHJvbWlzZTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGludGVyYWN0aW9uO1xuIiwiaW1wb3J0IGFqYXggZnJvbSBcIi4vYWpheC5qc1wiO1xuaW1wb3J0IHBhcnNlciBmcm9tIFwiLi9wYXJzZXIuanNcIjtcbmltcG9ydCBzdG9yeXRlbGxlciBmcm9tIFwiLi9zdG9yeXRlbGxlci5qc1wiO1xuXG52YXIgZG9uZSA9IGZhbHNlO1xudmFyIGRvbmVDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZyhcInN0YW5kYXJkIGRvbmUgY2FsbGJhY2tcIik7XG59O1xudmFyIHN0b3J5O1xudmFyIGVsO1xuXG52YXIgQmxhbmsgPSBmdW5jdGlvbih1cmwsIGVsZW1lbnQpIHtcbiAgdGhpcy51cmwgPSB1cmw7XG4gIGVsID0gZWxlbWVudDtcbiAgYWpheCh1cmwsIGRhdGEgPT4ge1xuICAgIC8vIHBhcnNlIHN0b3J5Li4uXG4gICAgc3RvcnkgPSBwYXJzZXIucGF0aHMoZGF0YSk7XG4gICAgZG9uZUNhbGxiYWNrKCk7XG4gICAgZG9uZSA9IHRydWU7XG4gIH0pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkJsYW5rLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc3RhcnQgPSAoKSA9PiB7XG4gICAgc3Rvcnl0ZWxsZXIuc3RhcnQoZWwsIHN0b3J5KTtcbiAgfTtcbiAgaWYgKGRvbmUpIHtcbiAgICAvLyBzdGFydCBzdG9yeVxuICAgIHN0YXJ0KCk7XG4gIH0gZWxzZSB7XG4gICAgZG9uZUNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIm5ldyBkb25lIGNhbGxiYWNrXCIpO1xuICAgICAgc3RhcnQoKTtcbiAgICB9O1xuICB9XG59O1xuXG53aW5kb3cuQmxhbmsgPSBCbGFuaztcbiIsInZhciBjb250ZW50O1xuXG5mdW5jdGlvbiBQYXBlcihlbGVtZW50KSB7XG4gIGlmIChlbGVtZW50IGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gIH0gZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEFycmF5ICYmIGVsZW1lbnQubGVuZ3RoID4gMCkge1xuICAgIGlmIChlbGVtZW50WzBdIGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudFswXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUHJvdmlkZWQgYW4gYXJyYXkgd2l0aCBubyBlbGVtZW50IHR5cGVzLlwiKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIGVsZW1lbnQgPT09IFwic3RyaW5nXCIpIHtcbiAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZW1lbnQpO1xuICAgIGlmICghdGhpcy5lbGVtZW50KVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUHJvdmlkZWQgYSBzdHJpbmcsIGJ1dCBubyBlbGVtZW50IG1hdGNoZXMgXCIgKyBlbGVtZW50KTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBcIlByb3ZpZGUgYW4gZWxlbWVudCBvciBpZC9jbGFzcyBzdHJpbmcgb2YgZWxlbWVudCB0byBkaXNwbGF5IHlvdXIgc3Rvcnkgb25cIlxuICAgICk7XG4gIH1cblxuICBpbml0RG9jdW1lbnQodGhpcy5lbGVtZW50KTtcbn1cblxuZnVuY3Rpb24gaW5pdERvY3VtZW50KGVsKSB7XG4gIC8vIGNyZWF0ZSB0b3AgbGV2ZWwgd3JhcHBlclxuICB2YXIgb3V0ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICB2YXIgaW5uZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBvdXRlci5hcHBlbmRDaGlsZChpbm5lcik7XG4gIG91dGVyLmNsYXNzTGlzdC5hZGQoXCJnZy1ibGFuay1wYWdlLXdyYXBwZXJcIik7XG4gIGlubmVyLmNsYXNzTGlzdC5hZGQoXCJpbm5lci13cmFwcGVyXCIpO1xuICBlbC5hcHBlbmRDaGlsZChvdXRlcik7XG4gIGNvbnRlbnQgPSBpbm5lcjtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIG5ldyBwYXJhZ3JhcGggb24gZWxlbWVudFxuICogXG4gKiBAcGFyYW0gcGFyYWdyYXBoIHN0cmluZ1xuICovXG5QYXBlci5wcm90b3R5cGUud3JpdGVQYXJhZ3JhcGggPSBmdW5jdGlvbihwYXJhZ3JhcGgpIHtcbiAgdmFyIHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgcC5pbm5lckhUTUwgPSBwYXJhZ3JhcGg7XG4gIHRoaXMuY3VycmVudFBhcmFncmFwaCA9IHA7XG4gIGNvbnRlbnQuYXBwZW5kQ2hpbGQocCk7XG59O1xuXG4vKipcbiAqIEFkZCB0ZXh0IHRvIHBhcmFncmFwaCBhZnRlciBjb250aW51ZVxuICogXG4gKiBAcGFyYW0gbW9yZSAoZGVzY3JpcHRpb24pXG4gKi9cblBhcGVyLnByb3RvdHlwZS5jb250aW51ZSA9IGZ1bmN0aW9uKG1vcmUpIHtcbiAgaWYgKCF0aGlzLmN1cnJlbnRQYXJhZ3JhcGgpIHtcbiAgICB0aGlzLndyaXRlUGFyYWdyYXBoKG1vcmUpO1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgcCA9IHRoaXMuY3VycmVudFBhcmFncmFwaDtcbiAgcC5pbm5lckhUTUwgPSBwLmlubmVySFRNTCArIG1vcmU7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBQYXBlcjtcblxuLy8gZnVuY3Rpb24gYWRkKHdvcmQpe1xuLy8gICB2YXIgaW5kZXggPSAwO1xuLy8gICBpZihpbmRleCA8IHdvcmQubGVuZ3RoKXtcbi8vICAgICB2YXIgbmV4dENoYXIgPSBmdW5jdGlvbigpe1xuLy8gICAgICAgdmFyIGMgPSB3b3JkW2luZGV4XTtcbi8vICAgICAgIGlmKC9cXHMvZy50ZXN0KGMpKXtcbi8vICAgICAgICAgaW5kZXgrK1xuLy8gICAgICAgICBpZiAoaW5kZXggPj0gd29yZC5sZW5ndGgpIHJldHVyblxuXG4vLyAgICAgICAgIGM9Yyt3b3JkW2luZGV4XTtcbi8vICAgICAgIH1cbi8vICAgICAgIHBhcGVyLmNvbnRpbnVlKGMpXG4vLyAgICAgICBpbmRleCsrO1xuLy8gICAgICAgaWYoaW5kZXggPCB3b3JkLmxlbmd0aCl7XG4vLyAgICAgICAgIHNldFRpbWVvdXQobmV4dENoYXIsIDEwMCk7XG4vLyAgICAgICB9XG4vLyAgICAgfVxuLy8gICAgIHNldFRpbWVvdXQobmV4dENoYXIsIDEwKTtcbi8vICAgfVxuLy8gfVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5mdW5jdGlvbiBQYXJzZXIoKSB7fVxuXG4vLyDCpyAtIHBhdGggZGVsaW1pdGVyXG52YXIgcGF0aFJlZ2V4ID0gL8KnKFxcdyspKD89XFxzKS87XG52YXIgYmVnaW5zV2l0aE5ld2xpbmUgPSAvXlxccypcXG4vO1xudmFyIHBhcmFSZWdleCA9IC9eXFxzKlxcbi87XG52YXIgd2hpdGVTcGFjZSA9IC9eXFxzKiQvO1xudmFyIHRyYWlsaW5nV2hpdGVzcGFjZSA9IC9cXHMqJC87XG52YXIgbW9yZSA9IFwiWy4uLl1cIjtcblxudmFyIHN0cm9uZyA9IC8oXFwqXFwqfF9fKShbXl0qPylcXDEvZztcbnZhciBzdHJvbmdSZXBsID0gXCI8c3Ryb25nPiQyPC9zdHJvbmc+XCI7XG52YXIgaXRhbGljcyA9IC8oXFwqfF9fKShbXl0qPylcXDEvZztcbnZhciBpdGFsaWNzUmVwbCA9IFwiPGVtPiQyPC9lbT5cIjtcblxudmFyIG11bHRpcGxlQ2hvaWNlID0gLyg6OikoW15dKj8pXFwxLzsgLy8gOjooQ2hvaWNlIG9uZT0+MSkoQ2hvaWNlIHR3bz0+Mik6OlxudmFyIGRlY2lzaW9ucyA9IC8oXFwoKSguKj8pPT4oXFx3KikoXFwpKS9nO1xuXG5QYXJzZXIucHJvdG90eXBlLnBhdGhzID0gZnVuY3Rpb24odGV4dCkge1xuICB2YXIgc3BsaXR0ZWQgPSB0ZXh0LnNwbGl0KHBhdGhSZWdleCk7XG4gIHZhciBwYXRocyA9IHt9O1xuICBmb3IgKHZhciBpID0gMTsgaSA8IHNwbGl0dGVkLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgaWYgKHBhdGhzW3NwbGl0dGVkW2ldXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBwYXRoc1tzcGxpdHRlZFtpXV0gPSBzcGxpdHRlZFtpICsgMV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICBgV2FybmluZyAtIFBhdGggJHtwYXRoc1tzcGxpdHRlZFtpXV19IGRlZmluZWQgbXVsdGlwbGUgdGltZXMhYFxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgY29uc29sZS5sb2cocGF0aHMpO1xuICByZXR1cm4gcGF0aHM7XG59O1xuXG5mdW5jdGlvbiB0cmltU3BhY2UodGV4dCkge1xuICBpZiAodGV4dC5pbmRleE9mKFwiIFwiKSA9PT0gMCkge1xuICAgIC8vIHJlbW92ZSBmaXJzdCBzcGFjZSBmcm9tIG5vbiBuZXdsaW5lIHNlY3Rpb25zXG4gICAgdGV4dCA9IHRleHQuc2xpY2UoMSwgdGV4dC5sZW5ndGggLSAxKTtcbiAgfVxuICByZXR1cm4gdGV4dDtcbn1cblxuZnVuY3Rpb24gdHJpbU5ld2xpbmVPclNwYWNlKHRleHQpIHtcbiAgdmFyIG5ld2xpbmUgPSBiZWdpbnNXaXRoTmV3bGluZS50ZXN0KHRleHQpO1xuICBpZiAobmV3bGluZSkgdGV4dCA9IHRleHQuc3BsaXQoYmVnaW5zV2l0aE5ld2xpbmUpWzFdO1xuICBlbHNlIHRleHQgPSB0cmltU3BhY2UodGV4dCk7XG4gIHJldHVybiBbbmV3bGluZSwgdGV4dF07XG59XG5cbmZ1bmN0aW9uIHNwbGl0UGFyYWdyYXBocyh0ZXh0KSB7XG4gIHZhciBwYXJhZ3JhcGhzID0gdGV4dC5zcGxpdCgvXFxyP1xcblxccj9cXG4vZyk7XG4gIHBhcmFncmFwaHMgPSBwYXJhZ3JhcGhzLmZpbHRlcihmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICF3aGl0ZVNwYWNlLnRlc3QocCk7XG4gIH0pO1xuICBwYXJhZ3JhcGhzID0gcGFyYWdyYXBocy5tYXAoZnVuY3Rpb24ocCkge1xuICAgIHZhciBwcyA9IHAuc3BsaXQobW9yZSk7XG4gICAgcHNbcHMubGVuZ3RoIC0gMV0gPSBwc1twcy5sZW5ndGggLSAxXS5yZXBsYWNlKHRyYWlsaW5nV2hpdGVzcGFjZSwgXCJcIik7XG4gICAgcmV0dXJuIHBzO1xuICB9KTtcbiAgcmV0dXJuIHBhcmFncmFwaHM7XG59XG5cblBhcnNlci5wcm90b3R5cGUuc2VjdGlvbiA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgdmFyIHNlY3Rpb24gPSB7fTtcbiAgdmFyIG5sID0gdHJpbU5ld2xpbmVPclNwYWNlKHRleHQpO1xuXG4gIHRleHQgPSBubFsxXTtcbiAgc2VjdGlvbi5uZXdsaW5lID0gbmxbMF07XG4gIHNlY3Rpb24ucGFyYWdyYXBocyA9IHNwbGl0UGFyYWdyYXBocyh0ZXh0KTtcblxuICBjb25zb2xlLmxvZyhzZWN0aW9uKTtcbiAgcmV0dXJuIHNlY3Rpb247XG59O1xuXG5mdW5jdGlvbiBwYXJzZUZvbnRTdHlsZSh0ZXh0KSB7XG4gIC8vICppdGFsaWNzKlxuICAvLyAqKnN0cm9uZyoqXG5cbiAgdGV4dCA9IHRleHQucmVwbGFjZShzdHJvbmcsIHN0cm9uZ1JlcGwpO1xuICB0ZXh0ID0gdGV4dC5yZXBsYWNlKGl0YWxpY3MsIGl0YWxpY3NSZXBsKTtcbiAgcmV0dXJuIHRleHQ7XG59XG5cbmZ1bmN0aW9uIHBhcnNlTGluZUJyZWFrcyh0ZXh0KSB7XG4gIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xccj9cXG4vZywgXCI8YnI+XCIpO1xufVxuXG5mdW5jdGlvbiBwYXJzZU11bHRpcGxlQ2hvaWNlKHBhcnQpIHtcbiAgdmFyIG1hdGNoID0gbXVsdGlwbGVDaG9pY2UuZXhlYyhwYXJ0KTtcbiAgaWYgKCFtYXRjaCkgcmV0dXJuIGZhbHNlO1xuICB2YXIgbWMgPSBtYXRjaFsyXTtcblxuICB2YXIgY2hvaWNlSHRtbCA9ICc8ZGl2IGNsYXNzPVwiY2hvaWNlXCIgZGF0YS1wYXRoPVwiJDNcIj4kMjwvZGl2Pic7XG4gIHZhciBjaG9pY2VzID0gbWMucmVwbGFjZShkZWNpc2lvbnMsIGNob2ljZUh0bWwpO1xuICBpZiAobWMgPT0gY2hvaWNlcykgcmV0dXJuIGZhbHNlO1xuICBjaG9pY2VzID0gYDxkaXYgY2xhc3M9XCJtdWx0aXBsZS1jaG9pY2VcIj4ke2Nob2ljZXN9PC9kaXY+YDtcblxuICAvLyByZXBsYWNlIGluIHRoZSBpbnB1dCBzdHJpbmdcbiAgcGFydCA9IHBhcnQucmVwbGFjZShtYXRjaFswXSwgY2hvaWNlcyk7XG4gIHJldHVybiBwYXJ0O1xufVxuXG5QYXJzZXIucHJvdG90eXBlLnBhcnQgPSBmdW5jdGlvbihwYXJ0KSB7XG4gIHZhciBodG1sID0gcGFyc2VGb250U3R5bGUocGFydCk7XG4gIGh0bWwgPSBwYXJzZUxpbmVCcmVha3MoaHRtbCk7XG4gIHZhciBtYyA9IHBhcnNlTXVsdGlwbGVDaG9pY2UoaHRtbCk7XG5cbiAgdmFyIHBhcnNlZCA9IHtcbiAgICB0ZXh0OiBtYyB8fCBodG1sLFxuICAgIG11bHRpcGxlQ2hvaWNlOiAhIW1jXG4gIH07XG5cbiAgcmV0dXJuIHBhcnNlZDtcbn07XG5cbnZhciBwYXJzZXIgPSBuZXcgUGFyc2VyKCk7XG4vLyBtb2R1bGUuZXhwb3J0cyA9IHBhcnNlcjtcbmV4cG9ydCBkZWZhdWx0IHBhcnNlcjtcbiIsImltcG9ydCBwYXJzZXIgZnJvbSBcIi4vcGFyc2VyLmpzXCI7XG5pbXBvcnQgUGFwZXIgZnJvbSBcIi4vcGFwZXIuanNcIjtcbmltcG9ydCBpbnRlcmFjdGlvbiBmcm9tIFwiLi9pbnRlcmFjdGlvbi5qc1wiO1xuXG5mdW5jdGlvbiBTdG9yeXRlbGxlcigpIHt9XG5cbnZhciBjdXJyZW50UGF0aCA9IFwiMFwiOyAvLyBzdGFydFxudmFyIGN1cnJlbnRTZWN0aW9uID0gbnVsbDtcbnZhciBwYXBlcjtcbnZhciBfc3Rvcnk7XG5cblN0b3J5dGVsbGVyLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKGVsZW1lbnQsIHN0b3J5KSB7XG4gIC8vIGluaXRcbiAgcGFwZXIgPSBuZXcgUGFwZXIoZWxlbWVudCk7XG4gIF9zdG9yeSA9IHN0b3J5O1xuXG4gIC8vIHBhcnNlIHN0YXJ0aW5nIHBvaW50IMKnMFxuICB0ZWxsU2VjdGlvbihjdXJyZW50UGF0aCk7XG59O1xuXG52YXIgbW9yZTtcbnZhciBtdWx0aXBsZUNob2ljZTtcbnZhciBwSW5kZXg7XG52YXIgc0luZGV4O1xuXG5mdW5jdGlvbiBub05ld2xpbmUoaSwgaiwgc2VjdGlvbikge1xuICB2YXIgZmlyc3RQYXJhZ3JhcGggPSBqID09IDA7XG4gIHZhciBjb250aW51aW5nUGFyYWdyYXBoID0gaiA+IDA7XG4gIHJldHVybiAhKGZpcnN0UGFyYWdyYXBoICYmIHNlY3Rpb24ubmV3bGluZSk7XG4gIC8vcmV0dXJuICFmaXJzdFBhcmFncmFwaCB8fCAhY29udGludWluZ1BhcmFncmFwaDtcbn1cblxuLyoqXG4gKiBUZWxscyB0aGUgc21hbGxlc3QgZnJhY3Rpb24gb2YgdGhlIHN0b3J5IGFuZCBkZWxlZ2F0ZXMgaW50ZXJhY3Rpb25zXG4gKi9cbmZ1bmN0aW9uIHRlbGxQYXJ0KHNlY3Rpb24sIGksIGopIHtcbiAgaWYgKG1vcmUpIG1vcmUucmVtb3ZlKCk7XG4gIC8vIG9ubHkgZmlyc3QgbGluZSBvZiBzZWN0aW9uIGZpcnN0IHBhcnRcbiAgLy8gd3JpdGUgbmV3IHBhcmFncmFwaCBvciBjb250aW51ZSBvbGQgb25lLi4uXG4gIHZhciBwYXJ0ID0gcGFyc2VyLnBhcnQoc2VjdGlvbi5wYXJhZ3JhcGhzW2ldW2pdKTtcblxuICBpZiAobm9OZXdsaW5lKGksIGosIHNlY3Rpb24pKSB7XG4gICAgcGFwZXIuY29udGludWUocGFydC50ZXh0KTtcbiAgfSBlbHNlIHtcbiAgICBwYXBlci53cml0ZVBhcmFncmFwaChwYXJ0LnRleHQpO1xuICB9XG5cbiAgaWYgKHBhcnQubXVsdGlwbGVDaG9pY2UpIHtcbiAgICAvLyBjcmVhdGUgbGlzdGVuZXJzIGZvciBtdWx0aXBsZSBjaG9pY2VcbiAgICB2YXIgbXVsdGlwbGVDaG9pY2UgPSBwYXBlci5jdXJyZW50UGFyYWdyYXBoLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXG4gICAgICBcIm11bHRpcGxlLWNob2ljZVwiXG4gICAgKVswXTtcbiAgICBpbnRlcmFjdGlvbi5hd2FpdENob2ljZShtdWx0aXBsZUNob2ljZSkudGhlbihmdW5jdGlvbihjaG9pY2UpIHtcbiAgICAgIG11bHRpcGxlQ2hvaWNlLnJlbW92ZSgpO1xuICAgICAgdGVsbFNlY3Rpb24oY2hvaWNlKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgZW5kID1cbiAgICAgIGkgPj0gc2VjdGlvbi5wYXJhZ3JhcGhzLmxlbmd0aCAtIDEgJiZcbiAgICAgIGogPj0gc2VjdGlvbi5wYXJhZ3JhcGhzW2ldLmxlbmd0aCAtIDE7XG4gICAgaWYgKCFlbmQpIHtcbiAgICAgIG1vcmUgPSBjcmVhdGVNb3JlSW5kaWNhdGlvbihwYXBlci5jdXJyZW50UGFyYWdyYXBoKTtcbiAgICAgIGludGVyYWN0aW9uLmF3YWl0SW5wdXQobW9yZSkudGhlbihmb3JFdmVyeVBhcnQpO1xuICAgIH1cbiAgfVxufVxuXG4vKiogXG4gKiBydW5zIGZvciBldmVyeSBwYXJ0IChhIHBhcnQgaXMgYSBzdWJzZWN0aW9uIG9mIGEgcGFyYWdyYXBoKVxuICovXG5mdW5jdGlvbiBmb3JFdmVyeVBhcnQoKSB7XG4gIHNJbmRleCsrO1xuICBpZiAoc0luZGV4IDwgY3VycmVudFNlY3Rpb24ucGFyYWdyYXBoc1twSW5kZXhdLmxlbmd0aCkge1xuICAgIHRlbGxQYXJ0KGN1cnJlbnRTZWN0aW9uLCBwSW5kZXgsIHNJbmRleCk7XG4gIH0gZWxzZSB7XG4gICAgcEluZGV4Kys7XG4gICAgZm9yRXZlcnlQYXJhZ3JhcGgoKTtcbiAgfVxufVxuXG4vKipcbiAqICBydW5zIGZvciBldmVyeSBwYXJhZ3JhcGggKG9mIGEgc2VjdGlvbilcbiAqL1xuZnVuY3Rpb24gZm9yRXZlcnlQYXJhZ3JhcGgoKSB7XG4gIHNJbmRleCA9IDA7XG4gIGlmIChwSW5kZXggPj0gY3VycmVudFNlY3Rpb24ucGFyYWdyYXBocy5sZW5ndGgpIHJldHVybjtcblxuICB0ZWxsUGFydChjdXJyZW50U2VjdGlvbiwgcEluZGV4LCBzSW5kZXgpO1xufVxuXG4vKipcbiAqIFRlbGxzIG9uZSBjb21wbGV0ZSBzZWN0aW9uL3BhdGggb2YgYSBzdG9yeVxuICovXG5mdW5jdGlvbiB0ZWxsU2VjdGlvbihpZCkge1xuICBjdXJyZW50U2VjdGlvbiA9IHBhcnNlci5zZWN0aW9uKF9zdG9yeVtpZF0pO1xuICBpZiAoY3VycmVudFNlY3Rpb24ucGFyYWdyYXBocy5sZW5ndGggPiAwKSB7XG4gICAgcEluZGV4ID0gMDtcbiAgICBmb3JFdmVyeVBhcmFncmFwaCgpO1xuICB9IGVsc2Uge1xuICAgIC8vIGVuZCBvZiBzdG9yeS4uLiA/XG4gICAgLy8gc2VjdGlvbiBoYXMgbm8gcGFyYWdyYXBoc1xuICAgIGNvbnNvbGUubG9nKGBTZWN0aW9uICR7Y3VycmVudFBhdGh9IGhhcyBubyBwYXJhZ3JhcGhzLiBTbyB0aGlzIGlzIHRoZSBlbmRgKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVNb3JlSW5kaWNhdGlvbihwKSB7XG4gIHZhciBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gIHNwYW4uaW5uZXJUZXh0ID0gXCLigLrigLpcIjtcbiAgc3Bhbi5jbGFzc0xpc3QuYWRkKFwibW9yZVwiKTtcbiAgcC5hcHBlbmRDaGlsZChzcGFuKTtcbiAgcmV0dXJuIHNwYW47XG59XG5cbnZhciBzdG9yeXRlbGxlciA9IG5ldyBTdG9yeXRlbGxlcigpO1xuZXhwb3J0IGRlZmF1bHQgc3Rvcnl0ZWxsZXI7XG4iLCIvKiBtb3VzZXRyYXAgdjEuNS4zIGNyYWlnLmlzL2tpbGxpbmcvbWljZSAqL1xuKGZ1bmN0aW9uKEMscixnKXtmdW5jdGlvbiB0KGEsYixoKXthLmFkZEV2ZW50TGlzdGVuZXI/YS5hZGRFdmVudExpc3RlbmVyKGIsaCwhMSk6YS5hdHRhY2hFdmVudChcIm9uXCIrYixoKX1mdW5jdGlvbiB4KGEpe2lmKFwia2V5cHJlc3NcIj09YS50eXBlKXt2YXIgYj1TdHJpbmcuZnJvbUNoYXJDb2RlKGEud2hpY2gpO2Euc2hpZnRLZXl8fChiPWIudG9Mb3dlckNhc2UoKSk7cmV0dXJuIGJ9cmV0dXJuIGxbYS53aGljaF0/bFthLndoaWNoXTpwW2Eud2hpY2hdP3BbYS53aGljaF06U3RyaW5nLmZyb21DaGFyQ29kZShhLndoaWNoKS50b0xvd2VyQ2FzZSgpfWZ1bmN0aW9uIEQoYSl7dmFyIGI9W107YS5zaGlmdEtleSYmYi5wdXNoKFwic2hpZnRcIik7YS5hbHRLZXkmJmIucHVzaChcImFsdFwiKTthLmN0cmxLZXkmJmIucHVzaChcImN0cmxcIik7YS5tZXRhS2V5JiZiLnB1c2goXCJtZXRhXCIpO3JldHVybiBifWZ1bmN0aW9uIHUoYSl7cmV0dXJuXCJzaGlmdFwiPT1hfHxcImN0cmxcIj09YXx8XCJhbHRcIj09YXx8XG5cIm1ldGFcIj09YX1mdW5jdGlvbiB5KGEsYil7dmFyIGgsYyxlLGc9W107aD1hO1wiK1wiPT09aD9oPVtcIitcIl06KGg9aC5yZXBsYWNlKC9cXCt7Mn0vZyxcIitwbHVzXCIpLGg9aC5zcGxpdChcIitcIikpO2ZvcihlPTA7ZTxoLmxlbmd0aDsrK2UpYz1oW2VdLHpbY10mJihjPXpbY10pLGImJlwia2V5cHJlc3NcIiE9YiYmQVtjXSYmKGM9QVtjXSxnLnB1c2goXCJzaGlmdFwiKSksdShjKSYmZy5wdXNoKGMpO2g9YztlPWI7aWYoIWUpe2lmKCFrKXtrPXt9O2Zvcih2YXIgbSBpbiBsKTk1PG0mJjExMj5tfHxsLmhhc093blByb3BlcnR5KG0pJiYoa1tsW21dXT1tKX1lPWtbaF0/XCJrZXlkb3duXCI6XCJrZXlwcmVzc1wifVwia2V5cHJlc3NcIj09ZSYmZy5sZW5ndGgmJihlPVwia2V5ZG93blwiKTtyZXR1cm57a2V5OmMsbW9kaWZpZXJzOmcsYWN0aW9uOmV9fWZ1bmN0aW9uIEIoYSxiKXtyZXR1cm4gbnVsbD09PWF8fGE9PT1yPyExOmE9PT1iPyEwOkIoYS5wYXJlbnROb2RlLGIpfWZ1bmN0aW9uIGMoYSl7ZnVuY3Rpb24gYihhKXthPVxuYXx8e307dmFyIGI9ITEsbjtmb3IobiBpbiBxKWFbbl0/Yj0hMDpxW25dPTA7Ynx8KHY9ITEpfWZ1bmN0aW9uIGgoYSxiLG4sZixjLGgpe3ZhciBnLGUsbD1bXSxtPW4udHlwZTtpZighZC5fY2FsbGJhY2tzW2FdKXJldHVybltdO1wia2V5dXBcIj09bSYmdShhKSYmKGI9W2FdKTtmb3IoZz0wO2c8ZC5fY2FsbGJhY2tzW2FdLmxlbmd0aDsrK2cpaWYoZT1kLl9jYWxsYmFja3NbYV1bZ10sKGZ8fCFlLnNlcXx8cVtlLnNlcV09PWUubGV2ZWwpJiZtPT1lLmFjdGlvbil7dmFyIGs7KGs9XCJrZXlwcmVzc1wiPT1tJiYhbi5tZXRhS2V5JiYhbi5jdHJsS2V5KXx8KGs9ZS5tb2RpZmllcnMsaz1iLnNvcnQoKS5qb2luKFwiLFwiKT09PWsuc29ydCgpLmpvaW4oXCIsXCIpKTtrJiYoaz1mJiZlLnNlcT09ZiYmZS5sZXZlbD09aCwoIWYmJmUuY29tYm89PWN8fGspJiZkLl9jYWxsYmFja3NbYV0uc3BsaWNlKGcsMSksbC5wdXNoKGUpKX1yZXR1cm4gbH1mdW5jdGlvbiBnKGEsYixuLGYpe2Quc3RvcENhbGxiYWNrKGIsXG5iLnRhcmdldHx8Yi5zcmNFbGVtZW50LG4sZil8fCExIT09YShiLG4pfHwoYi5wcmV2ZW50RGVmYXVsdD9iLnByZXZlbnREZWZhdWx0KCk6Yi5yZXR1cm5WYWx1ZT0hMSxiLnN0b3BQcm9wYWdhdGlvbj9iLnN0b3BQcm9wYWdhdGlvbigpOmIuY2FuY2VsQnViYmxlPSEwKX1mdW5jdGlvbiBlKGEpe1wibnVtYmVyXCIhPT10eXBlb2YgYS53aGljaCYmKGEud2hpY2g9YS5rZXlDb2RlKTt2YXIgYj14KGEpO2ImJihcImtleXVwXCI9PWEudHlwZSYmdz09PWI/dz0hMTpkLmhhbmRsZUtleShiLEQoYSksYSkpfWZ1bmN0aW9uIGwoYSxjLG4sZil7ZnVuY3Rpb24gZShjKXtyZXR1cm4gZnVuY3Rpb24oKXt2PWM7KytxW2FdO2NsZWFyVGltZW91dChrKTtrPXNldFRpbWVvdXQoYiwxRTMpfX1mdW5jdGlvbiBoKGMpe2cobixjLGEpO1wia2V5dXBcIiE9PWYmJih3PXgoYykpO3NldFRpbWVvdXQoYiwxMCl9Zm9yKHZhciBkPXFbYV09MDtkPGMubGVuZ3RoOysrZCl7dmFyIHA9ZCsxPT09Yy5sZW5ndGg/aDplKGZ8fFxueShjW2QrMV0pLmFjdGlvbik7bShjW2RdLHAsZixhLGQpfX1mdW5jdGlvbiBtKGEsYixjLGYsZSl7ZC5fZGlyZWN0TWFwW2ErXCI6XCIrY109YjthPWEucmVwbGFjZSgvXFxzKy9nLFwiIFwiKTt2YXIgZz1hLnNwbGl0KFwiIFwiKTsxPGcubGVuZ3RoP2woYSxnLGIsYyk6KGM9eShhLGMpLGQuX2NhbGxiYWNrc1tjLmtleV09ZC5fY2FsbGJhY2tzW2Mua2V5XXx8W10saChjLmtleSxjLm1vZGlmaWVycyx7dHlwZTpjLmFjdGlvbn0sZixhLGUpLGQuX2NhbGxiYWNrc1tjLmtleV1bZj9cInVuc2hpZnRcIjpcInB1c2hcIl0oe2NhbGxiYWNrOmIsbW9kaWZpZXJzOmMubW9kaWZpZXJzLGFjdGlvbjpjLmFjdGlvbixzZXE6ZixsZXZlbDplLGNvbWJvOmF9KSl9dmFyIGQ9dGhpczthPWF8fHI7aWYoIShkIGluc3RhbmNlb2YgYykpcmV0dXJuIG5ldyBjKGEpO2QudGFyZ2V0PWE7ZC5fY2FsbGJhY2tzPXt9O2QuX2RpcmVjdE1hcD17fTt2YXIgcT17fSxrLHc9ITEscD0hMSx2PSExO2QuX2hhbmRsZUtleT1mdW5jdGlvbihhLFxuYyxlKXt2YXIgZj1oKGEsYyxlKSxkO2M9e307dmFyIGs9MCxsPSExO2ZvcihkPTA7ZDxmLmxlbmd0aDsrK2QpZltkXS5zZXEmJihrPU1hdGgubWF4KGssZltkXS5sZXZlbCkpO2ZvcihkPTA7ZDxmLmxlbmd0aDsrK2QpZltkXS5zZXE/ZltkXS5sZXZlbD09ayYmKGw9ITAsY1tmW2RdLnNlcV09MSxnKGZbZF0uY2FsbGJhY2ssZSxmW2RdLmNvbWJvLGZbZF0uc2VxKSk6bHx8ZyhmW2RdLmNhbGxiYWNrLGUsZltkXS5jb21ibyk7Zj1cImtleXByZXNzXCI9PWUudHlwZSYmcDtlLnR5cGUhPXZ8fHUoYSl8fGZ8fGIoYyk7cD1sJiZcImtleWRvd25cIj09ZS50eXBlfTtkLl9iaW5kTXVsdGlwbGU9ZnVuY3Rpb24oYSxiLGMpe2Zvcih2YXIgZD0wO2Q8YS5sZW5ndGg7KytkKW0oYVtkXSxiLGMpfTt0KGEsXCJrZXlwcmVzc1wiLGUpO3QoYSxcImtleWRvd25cIixlKTt0KGEsXCJrZXl1cFwiLGUpfXZhciBsPXs4OlwiYmFja3NwYWNlXCIsOTpcInRhYlwiLDEzOlwiZW50ZXJcIiwxNjpcInNoaWZ0XCIsMTc6XCJjdHJsXCIsMTg6XCJhbHRcIixcbjIwOlwiY2Fwc2xvY2tcIiwyNzpcImVzY1wiLDMyOlwic3BhY2VcIiwzMzpcInBhZ2V1cFwiLDM0OlwicGFnZWRvd25cIiwzNTpcImVuZFwiLDM2OlwiaG9tZVwiLDM3OlwibGVmdFwiLDM4OlwidXBcIiwzOTpcInJpZ2h0XCIsNDA6XCJkb3duXCIsNDU6XCJpbnNcIiw0NjpcImRlbFwiLDkxOlwibWV0YVwiLDkzOlwibWV0YVwiLDIyNDpcIm1ldGFcIn0scD17MTA2OlwiKlwiLDEwNzpcIitcIiwxMDk6XCItXCIsMTEwOlwiLlwiLDExMTpcIi9cIiwxODY6XCI7XCIsMTg3OlwiPVwiLDE4ODpcIixcIiwxODk6XCItXCIsMTkwOlwiLlwiLDE5MTpcIi9cIiwxOTI6XCJgXCIsMjE5OlwiW1wiLDIyMDpcIlxcXFxcIiwyMjE6XCJdXCIsMjIyOlwiJ1wifSxBPXtcIn5cIjpcImBcIixcIiFcIjpcIjFcIixcIkBcIjpcIjJcIixcIiNcIjpcIjNcIiwkOlwiNFwiLFwiJVwiOlwiNVwiLFwiXlwiOlwiNlwiLFwiJlwiOlwiN1wiLFwiKlwiOlwiOFwiLFwiKFwiOlwiOVwiLFwiKVwiOlwiMFwiLF86XCItXCIsXCIrXCI6XCI9XCIsXCI6XCI6XCI7XCIsJ1wiJzpcIidcIixcIjxcIjpcIixcIixcIj5cIjpcIi5cIixcIj9cIjpcIi9cIixcInxcIjpcIlxcXFxcIn0sej17b3B0aW9uOlwiYWx0XCIsY29tbWFuZDpcIm1ldGFcIixcInJldHVyblwiOlwiZW50ZXJcIixcbmVzY2FwZTpcImVzY1wiLHBsdXM6XCIrXCIsbW9kOi9NYWN8aVBvZHxpUGhvbmV8aVBhZC8udGVzdChuYXZpZ2F0b3IucGxhdGZvcm0pP1wibWV0YVwiOlwiY3RybFwifSxrO2ZvcihnPTE7MjA+ZzsrK2cpbFsxMTErZ109XCJmXCIrZztmb3IoZz0wOzk+PWc7KytnKWxbZys5Nl09ZztjLnByb3RvdHlwZS5iaW5kPWZ1bmN0aW9uKGEsYixjKXthPWEgaW5zdGFuY2VvZiBBcnJheT9hOlthXTt0aGlzLl9iaW5kTXVsdGlwbGUuY2FsbCh0aGlzLGEsYixjKTtyZXR1cm4gdGhpc307Yy5wcm90b3R5cGUudW5iaW5kPWZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMuYmluZC5jYWxsKHRoaXMsYSxmdW5jdGlvbigpe30sYil9O2MucHJvdG90eXBlLnRyaWdnZXI9ZnVuY3Rpb24oYSxiKXtpZih0aGlzLl9kaXJlY3RNYXBbYStcIjpcIitiXSl0aGlzLl9kaXJlY3RNYXBbYStcIjpcIitiXSh7fSxhKTtyZXR1cm4gdGhpc307Yy5wcm90b3R5cGUucmVzZXQ9ZnVuY3Rpb24oKXt0aGlzLl9jYWxsYmFja3M9e307dGhpcy5fZGlyZWN0TWFwPVxue307cmV0dXJuIHRoaXN9O2MucHJvdG90eXBlLnN0b3BDYWxsYmFjaz1mdW5jdGlvbihhLGIpe3JldHVybi0xPChcIiBcIitiLmNsYXNzTmFtZStcIiBcIikuaW5kZXhPZihcIiBtb3VzZXRyYXAgXCIpfHxCKGIsdGhpcy50YXJnZXQpPyExOlwiSU5QVVRcIj09Yi50YWdOYW1lfHxcIlNFTEVDVFwiPT1iLnRhZ05hbWV8fFwiVEVYVEFSRUFcIj09Yi50YWdOYW1lfHxiLmlzQ29udGVudEVkaXRhYmxlfTtjLnByb3RvdHlwZS5oYW5kbGVLZXk9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5faGFuZGxlS2V5LmFwcGx5KHRoaXMsYXJndW1lbnRzKX07Yy5pbml0PWZ1bmN0aW9uKCl7dmFyIGE9YyhyKSxiO2ZvcihiIGluIGEpXCJfXCIhPT1iLmNoYXJBdCgwKSYmKGNbYl09ZnVuY3Rpb24oYil7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGFbYl0uYXBwbHkoYSxhcmd1bWVudHMpfX0oYikpfTtjLmluaXQoKTtDLk1vdXNldHJhcD1jO1widW5kZWZpbmVkXCIhPT10eXBlb2YgbW9kdWxlJiZtb2R1bGUuZXhwb3J0cyYmKG1vZHVsZS5leHBvcnRzPVxuYyk7XCJmdW5jdGlvblwiPT09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZCYmZGVmaW5lKGZ1bmN0aW9uKCl7cmV0dXJuIGN9KX0pKHdpbmRvdyxkb2N1bWVudCk7XG4iXX0=
