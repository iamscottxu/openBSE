"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.last-index-of");

require("core-js/modules/es.array.slice");

require("core-js/modules/es.array.sort");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.parse-float");

require("core-js/modules/es.parse-int");

require("core-js/modules/es.regexp.constructor");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.string.split");

require("core-js/modules/web.dom-collections.iterator");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (root, mod) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object" && (typeof module === "undefined" ? "undefined" : _typeof(module)) == "object") return mod(exports);
  if (typeof define == "function" && define.amd) return define(["exports"], mod);
  mod(root.acorn || (root.acorn = {}));
})(void 0, function (exports) {
  "use strict";

  exports.version = "0.4.1";
  var options, input, inputLen, sourceFile;

  exports.parse = function (inpt, opts) {
    input = String(inpt);
    inputLen = input.length;
    setOptions(opts);
    initTokenState();
    return parseTopLevel(options.program);
  };

  var defaultOptions = exports.defaultOptions = {
    ecmaVersion: 5,
    strictSemicolons: false,
    allowTrailingCommas: true,
    forbidReserved: false,
    locations: false,
    onComment: null,
    ranges: false,
    program: null,
    sourceFile: null,
    directSourceFile: null
  };

  function setOptions(opts) {
    options = opts || {};

    for (var opt in defaultOptions) {
      if (!Object.prototype.hasOwnProperty.call(options, opt)) options[opt] = defaultOptions[opt];
    }

    sourceFile = options.sourceFile || null;
  }

  var getLineInfo = exports.getLineInfo = function (input, offset) {
    for (var line = 1, cur = 0;;) {
      lineBreak.lastIndex = cur;
      var match = lineBreak.exec(input);

      if (match && match.index < offset) {
        ++line;
        cur = match.index + match[0].length;
      } else break;
    }

    return {
      line: line,
      column: offset - cur
    };
  };

  exports.tokenize = function (inpt, opts) {
    input = String(inpt);
    inputLen = input.length;
    setOptions(opts);
    initTokenState();
    var t = {};

    function getToken(forceRegexp) {
      readToken(forceRegexp);
      t.start = tokStart;
      t.end = tokEnd;
      t.startLoc = tokStartLoc;
      t.endLoc = tokEndLoc;
      t.type = tokType;
      t.value = tokVal;
      return t;
    }

    getToken.jumpTo = function (pos, reAllowed) {
      tokPos = pos;

      if (options.locations) {
        tokCurLine = 1;
        tokLineStart = lineBreak.lastIndex = 0;
        var match;

        while ((match = lineBreak.exec(input)) && match.index < pos) {
          ++tokCurLine;
          tokLineStart = match.index + match[0].length;
        }
      }

      tokRegexpAllowed = reAllowed;
      skipSpace();
    };

    return getToken;
  };

  var tokPos;
  var tokStart, tokEnd;
  var tokStartLoc, tokEndLoc;
  var tokType, tokVal;
  var tokRegexpAllowed;
  var tokCurLine, tokLineStart;
  var lastStart, lastEnd, lastEndLoc;
  var inFunction, labels, strict;

  function raise(pos, message) {
    var loc = getLineInfo(input, pos);
    message += " (" + loc.line + ":" + loc.column + ")";
    var err = new SyntaxError(message);
    err.pos = pos;
    err.loc = loc;
    err.raisedAt = tokPos;
    throw err;
  }

  var empty = [];
  var _num = {
    type: "num"
  },
      _regexp = {
    type: "regexp"
  },
      _string = {
    type: "string"
  };
  var _name = {
    type: "name"
  },
      _eof = {
    type: "eof"
  };
  var _break = {
    keyword: "break"
  },
      _case = {
    keyword: "case",
    beforeExpr: true
  },
      _catch = {
    keyword: "catch"
  };
  var _continue = {
    keyword: "continue"
  },
      _debugger = {
    keyword: "debugger"
  },
      _default = {
    keyword: "default"
  };
  var _do = {
    keyword: "do",
    isLoop: true
  },
      _else = {
    keyword: "else",
    beforeExpr: true
  };
  var _finally = {
    keyword: "finally"
  },
      _for = {
    keyword: "for",
    isLoop: true
  },
      _function = {
    keyword: "function"
  };
  var _if = {
    keyword: "if"
  },
      _return = {
    keyword: "return",
    beforeExpr: true
  },
      _switch = {
    keyword: "switch"
  };
  var _throw = {
    keyword: "throw",
    beforeExpr: true
  },
      _try = {
    keyword: "try"
  },
      _var = {
    keyword: "var"
  };
  var _while = {
    keyword: "while",
    isLoop: true
  },
      _with = {
    keyword: "with"
  },
      _new = {
    keyword: "new",
    beforeExpr: true
  };
  var _this = {
    keyword: "this"
  };
  var _null = {
    keyword: "null",
    atomValue: null
  },
      _true = {
    keyword: "true",
    atomValue: true
  };
  var _false = {
    keyword: "false",
    atomValue: false
  };
  var _in = {
    keyword: "in",
    binop: 7,
    beforeExpr: true
  };
  var keywordTypes = {
    "break": _break,
    "case": _case,
    "catch": _catch,
    "continue": _continue,
    "debugger": _debugger,
    "default": _default,
    "do": _do,
    "else": _else,
    "finally": _finally,
    "for": _for,
    "function": _function,
    "if": _if,
    "return": _return,
    "switch": _switch,
    "throw": _throw,
    "try": _try,
    "var": _var,
    "while": _while,
    "with": _with,
    "null": _null,
    "true": _true,
    "false": _false,
    "new": _new,
    "in": _in,
    "instanceof": {
      keyword: "instanceof",
      binop: 7,
      beforeExpr: true
    },
    "this": _this,
    "typeof": {
      keyword: "typeof",
      prefix: true,
      beforeExpr: true
    },
    "void": {
      keyword: "void",
      prefix: true,
      beforeExpr: true
    },
    "delete": {
      keyword: "delete",
      prefix: true,
      beforeExpr: true
    }
  };
  var _bracketL = {
    type: "[",
    beforeExpr: true
  },
      _bracketR = {
    type: "]"
  },
      _braceL = {
    type: "{",
    beforeExpr: true
  };
  var _braceR = {
    type: "}"
  },
      _parenL = {
    type: "(",
    beforeExpr: true
  },
      _parenR = {
    type: ")"
  };
  var _comma = {
    type: ",",
    beforeExpr: true
  },
      _semi = {
    type: ";",
    beforeExpr: true
  };
  var _colon = {
    type: ":",
    beforeExpr: true
  },
      _dot = {
    type: "."
  },
      _question = {
    type: "?",
    beforeExpr: true
  };
  var _slash = {
    binop: 10,
    beforeExpr: true
  },
      _eq = {
    isAssign: true,
    beforeExpr: true
  };
  var _assign = {
    isAssign: true,
    beforeExpr: true
  };
  var _incDec = {
    postfix: true,
    prefix: true,
    isUpdate: true
  },
      _prefix = {
    prefix: true,
    beforeExpr: true
  };
  var _logicalOR = {
    binop: 1,
    beforeExpr: true
  };
  var _logicalAND = {
    binop: 2,
    beforeExpr: true
  };
  var _bitwiseOR = {
    binop: 3,
    beforeExpr: true
  };
  var _bitwiseXOR = {
    binop: 4,
    beforeExpr: true
  };
  var _bitwiseAND = {
    binop: 5,
    beforeExpr: true
  };
  var _equality = {
    binop: 6,
    beforeExpr: true
  };
  var _relational = {
    binop: 7,
    beforeExpr: true
  };
  var _bitShift = {
    binop: 8,
    beforeExpr: true
  };
  var _plusMin = {
    binop: 9,
    prefix: true,
    beforeExpr: true
  };
  var _multiplyModulo = {
    binop: 10,
    beforeExpr: true
  };
  exports.tokTypes = {
    bracketL: _bracketL,
    bracketR: _bracketR,
    braceL: _braceL,
    braceR: _braceR,
    parenL: _parenL,
    parenR: _parenR,
    comma: _comma,
    semi: _semi,
    colon: _colon,
    dot: _dot,
    question: _question,
    slash: _slash,
    eq: _eq,
    name: _name,
    eof: _eof,
    num: _num,
    regexp: _regexp,
    string: _string
  };

  for (var kw in keywordTypes) {
    exports.tokTypes["_" + kw] = keywordTypes[kw];
  }

  function makePredicate(words) {
    words = words.split(" ");
    var f = "",
        cats = [];

    out: for (var i = 0; i < words.length; ++i) {
      for (var j = 0; j < cats.length; ++j) {
        if (cats[j][0].length == words[i].length) {
          cats[j].push(words[i]);
          continue out;
        }
      }

      cats.push([words[i]]);
    }

    function compareTo(arr) {
      if (arr.length == 1) return f += "return str === " + JSON.stringify(arr[0]) + ";";
      f += "switch(str){";

      for (var i = 0; i < arr.length; ++i) {
        f += "case " + JSON.stringify(arr[i]) + ":";
      }

      f += "return true}return false;";
    }

    if (cats.length > 3) {
      cats.sort(function (a, b) {
        return b.length - a.length;
      });
      f += "switch(str.length){";

      for (var i = 0; i < cats.length; ++i) {
        var cat = cats[i];
        f += "case " + cat[0].length + ":";
        compareTo(cat);
      }

      f += "}";
    } else {
      compareTo(words);
    }

    return new Function("str", f);
  }

  var isReservedWord3 = makePredicate("abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile");
  var isReservedWord5 = makePredicate("class enum extends super const export import");
  var isStrictReservedWord = makePredicate("implements interface let package private protected public static yield");
  var isStrictBadIdWord = makePredicate("eval arguments");
  var isKeyword = makePredicate("break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this");
  var nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
  var nonASCIIidentifierStartChars = "\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC";
  var nonASCIIidentifierChars = "\u0300-\u036F\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u0620-\u0649\u0672-\u06D3\u06E7-\u06E8\u06FB-\u06FC\u0730-\u074A\u0800-\u0814\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0840-\u0857\u08E4-\u08FE\u0900-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962-\u0963\u0966-\u096F\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09D7\u09DF-\u09E0\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A66-\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5F-\u0B60\u0B66-\u0B6F\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE6-\u0BEF\u0C01-\u0C03\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62-\u0C63\u0C66-\u0C6F\u0C82\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2-\u0CE3\u0CE6-\u0CEF\u0D02\u0D03\u0D46-\u0D48\u0D57\u0D62-\u0D63\u0D66-\u0D6F\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E34-\u0E3A\u0E40-\u0E45\u0E50-\u0E59\u0EB4-\u0EB9\u0EC8-\u0ECD\u0ED0-\u0ED9\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F41-\u0F47\u0F71-\u0F84\u0F86-\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1029\u1040-\u1049\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109D\u135D-\u135F\u170E-\u1710\u1720-\u1730\u1740-\u1750\u1772\u1773\u1780-\u17B2\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1920-\u192B\u1930-\u193B\u1951-\u196D\u19B0-\u19C0\u19C8-\u19C9\u19D0-\u19D9\u1A00-\u1A15\u1A20-\u1A53\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1B46-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1BB0-\u1BB9\u1BE6-\u1BF3\u1C00-\u1C22\u1C40-\u1C49\u1C5B-\u1C7D\u1CD0-\u1CD2\u1D00-\u1DBE\u1E01-\u1F15\u200C\u200D\u203F\u2040\u2054\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2D81-\u2D96\u2DE0-\u2DFF\u3021-\u3028\u3099\u309A\uA640-\uA66D\uA674-\uA67D\uA69F\uA6F0-\uA6F1\uA7F8-\uA800\uA806\uA80B\uA823-\uA827\uA880-\uA881\uA8B4-\uA8C4\uA8D0-\uA8D9\uA8F3-\uA8F7\uA900-\uA909\uA926-\uA92D\uA930-\uA945\uA980-\uA983\uA9B3-\uA9C0\uAA00-\uAA27\uAA40-\uAA41\uAA4C-\uAA4D\uAA50-\uAA59\uAA7B\uAAE0-\uAAE9\uAAF2-\uAAF3\uABC0-\uABE1\uABEC\uABED\uABF0-\uABF9\uFB20-\uFB28\uFE00-\uFE0F\uFE20-\uFE26\uFE33\uFE34\uFE4D-\uFE4F\uFF10-\uFF19\uFF3F";
  var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
  var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
  var newline = /[\n\r\u2028\u2029]/;
  var lineBreak = /\r\n|[\n\r\u2028\u2029]/g;

  var isIdentifierStart = exports.isIdentifierStart = function (code) {
    if (code < 65) return code === 36;
    if (code < 91) return true;
    if (code < 97) return code === 95;
    if (code < 123) return true;
    return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code));
  };

  var isIdentifierChar = exports.isIdentifierChar = function (code) {
    if (code < 48) return code === 36;
    if (code < 58) return true;
    if (code < 65) return false;
    if (code < 91) return true;
    if (code < 97) return code === 95;
    if (code < 123) return true;
    return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code));
  };

  function line_loc_t() {
    this.line = tokCurLine;
    this.column = tokPos - tokLineStart;
  }

  function initTokenState() {
    tokCurLine = 1;
    tokPos = tokLineStart = 0;
    tokRegexpAllowed = true;
    skipSpace();
  }

  function finishToken(type, val) {
    tokEnd = tokPos;
    if (options.locations) tokEndLoc = new line_loc_t();
    tokType = type;
    skipSpace();
    tokVal = val;
    tokRegexpAllowed = type.beforeExpr;
  }

  function skipBlockComment() {
    var startLoc = options.onComment && options.locations && new line_loc_t();
    var start = tokPos,
        end = input.indexOf("*/", tokPos += 2);
    if (end === -1) raise(tokPos - 2, "Unterminated comment");
    tokPos = end + 2;

    if (options.locations) {
      lineBreak.lastIndex = start;
      var match;

      while ((match = lineBreak.exec(input)) && match.index < tokPos) {
        ++tokCurLine;
        tokLineStart = match.index + match[0].length;
      }
    }

    if (options.onComment) options.onComment(true, input.slice(start + 2, end), start, tokPos, startLoc, options.locations && new line_loc_t());
  }

  function skipLineComment() {
    var start = tokPos;
    var startLoc = options.onComment && options.locations && new line_loc_t();
    var ch = input.charCodeAt(tokPos += 2);

    while (tokPos < inputLen && ch !== 10 && ch !== 13 && ch !== 8232 && ch !== 8233) {
      ++tokPos;
      ch = input.charCodeAt(tokPos);
    }

    if (options.onComment) options.onComment(false, input.slice(start + 2, tokPos), start, tokPos, startLoc, options.locations && new line_loc_t());
  }

  function skipSpace() {
    while (tokPos < inputLen) {
      var ch = input.charCodeAt(tokPos);

      if (ch === 32) {
        ++tokPos;
      } else if (ch === 13) {
        ++tokPos;
        var next = input.charCodeAt(tokPos);

        if (next === 10) {
          ++tokPos;
        }

        if (options.locations) {
          ++tokCurLine;
          tokLineStart = tokPos;
        }
      } else if (ch === 10 || ch === 8232 || ch === 8233) {
        ++tokPos;

        if (options.locations) {
          ++tokCurLine;
          tokLineStart = tokPos;
        }
      } else if (ch > 8 && ch < 14) {
        ++tokPos;
      } else if (ch === 47) {
        var next = input.charCodeAt(tokPos + 1);

        if (next === 42) {
          skipBlockComment();
        } else if (next === 47) {
          skipLineComment();
        } else break;
      } else if (ch === 160) {
        ++tokPos;
      } else if (ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) {
        ++tokPos;
      } else {
        break;
      }
    }
  }

  function readToken_dot() {
    var next = input.charCodeAt(tokPos + 1);
    if (next >= 48 && next <= 57) return readNumber(true);
    ++tokPos;
    return finishToken(_dot);
  }

  function readToken_slash() {
    var next = input.charCodeAt(tokPos + 1);

    if (tokRegexpAllowed) {
      ++tokPos;
      return readRegexp();
    }

    if (next === 61) return finishOp(_assign, 2);
    return finishOp(_slash, 1);
  }

  function readToken_mult_modulo() {
    var next = input.charCodeAt(tokPos + 1);
    if (next === 61) return finishOp(_assign, 2);
    return finishOp(_multiplyModulo, 1);
  }

  function readToken_pipe_amp(code) {
    var next = input.charCodeAt(tokPos + 1);
    if (next === code) return finishOp(code === 124 ? _logicalOR : _logicalAND, 2);
    if (next === 61) return finishOp(_assign, 2);
    return finishOp(code === 124 ? _bitwiseOR : _bitwiseAND, 1);
  }

  function readToken_caret() {
    var next = input.charCodeAt(tokPos + 1);
    if (next === 61) return finishOp(_assign, 2);
    return finishOp(_bitwiseXOR, 1);
  }

  function readToken_plus_min(code) {
    var next = input.charCodeAt(tokPos + 1);

    if (next === code) {
      if (next == 45 && input.charCodeAt(tokPos + 2) == 62 && newline.test(input.slice(lastEnd, tokPos))) {
        tokPos += 3;
        skipLineComment();
        skipSpace();
        return readToken();
      }

      return finishOp(_incDec, 2);
    }

    if (next === 61) return finishOp(_assign, 2);
    return finishOp(_plusMin, 1);
  }

  function readToken_lt_gt(code) {
    var next = input.charCodeAt(tokPos + 1);
    var size = 1;

    if (next === code) {
      size = code === 62 && input.charCodeAt(tokPos + 2) === 62 ? 3 : 2;
      if (input.charCodeAt(tokPos + size) === 61) return finishOp(_assign, size + 1);
      return finishOp(_bitShift, size);
    }

    if (next == 33 && code == 60 && input.charCodeAt(tokPos + 2) == 45 && input.charCodeAt(tokPos + 3) == 45) {
      tokPos += 4;
      skipLineComment();
      skipSpace();
      return readToken();
    }

    if (next === 61) size = input.charCodeAt(tokPos + 2) === 61 ? 3 : 2;
    return finishOp(_relational, size);
  }

  function readToken_eq_excl(code) {
    var next = input.charCodeAt(tokPos + 1);
    if (next === 61) return finishOp(_equality, input.charCodeAt(tokPos + 2) === 61 ? 3 : 2);
    return finishOp(code === 61 ? _eq : _prefix, 1);
  }

  function getTokenFromCode(code) {
    switch (code) {
      case 46:
        return readToken_dot();

      case 40:
        ++tokPos;
        return finishToken(_parenL);

      case 41:
        ++tokPos;
        return finishToken(_parenR);

      case 59:
        ++tokPos;
        return finishToken(_semi);

      case 44:
        ++tokPos;
        return finishToken(_comma);

      case 91:
        ++tokPos;
        return finishToken(_bracketL);

      case 93:
        ++tokPos;
        return finishToken(_bracketR);

      case 123:
        ++tokPos;
        return finishToken(_braceL);

      case 125:
        ++tokPos;
        return finishToken(_braceR);

      case 58:
        ++tokPos;
        return finishToken(_colon);

      case 63:
        ++tokPos;
        return finishToken(_question);

      case 48:
        var next = input.charCodeAt(tokPos + 1);
        if (next === 120 || next === 88) return readHexNumber();

      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        return readNumber(false);

      case 34:
      case 39:
        return readString(code);

      case 47:
        return readToken_slash(code);

      case 37:
      case 42:
        return readToken_mult_modulo();

      case 124:
      case 38:
        return readToken_pipe_amp(code);

      case 94:
        return readToken_caret();

      case 43:
      case 45:
        return readToken_plus_min(code);

      case 60:
      case 62:
        return readToken_lt_gt(code);

      case 61:
      case 33:
        return readToken_eq_excl(code);

      case 126:
        return finishOp(_prefix, 1);
    }

    return false;
  }

  function readToken(forceRegexp) {
    if (!forceRegexp) tokStart = tokPos;else tokPos = tokStart + 1;
    if (options.locations) tokStartLoc = new line_loc_t();
    if (forceRegexp) return readRegexp();
    if (tokPos >= inputLen) return finishToken(_eof);
    var code = input.charCodeAt(tokPos);
    if (isIdentifierStart(code) || code === 92) return readWord();
    var tok = getTokenFromCode(code);

    if (tok === false) {
      var ch = String.fromCharCode(code);
      if (ch === "\\" || nonASCIIidentifierStart.test(ch)) return readWord();
      raise(tokPos, "Unexpected character '" + ch + "'");
    }

    return tok;
  }

  function finishOp(type, size) {
    var str = input.slice(tokPos, tokPos + size);
    tokPos += size;
    finishToken(type, str);
  }

  function readRegexp() {
    var content = "",
        escaped,
        inClass,
        start = tokPos;

    for (;;) {
      if (tokPos >= inputLen) raise(start, "Unterminated regular expression");
      var ch = input.charAt(tokPos);
      if (newline.test(ch)) raise(start, "Unterminated regular expression");

      if (!escaped) {
        if (ch === "[") inClass = true;else if (ch === "]" && inClass) inClass = false;else if (ch === "/" && !inClass) break;
        escaped = ch === "\\";
      } else escaped = false;

      ++tokPos;
    }

    var content = input.slice(start, tokPos);
    ++tokPos;
    var mods = readWord1();
    if (mods && !/^[gmsiy]*$/.test(mods)) raise(start, "Invalid regexp flag");
    return finishToken(_regexp, new RegExp(content, mods));
  }

  function readInt(radix, len) {
    var start = tokPos,
        total = 0;

    for (var i = 0, e = len == null ? Infinity : len; i < e; ++i) {
      var code = input.charCodeAt(tokPos),
          val;
      if (code >= 97) val = code - 97 + 10;else if (code >= 65) val = code - 65 + 10;else if (code >= 48 && code <= 57) val = code - 48;else val = Infinity;
      if (val >= radix) break;
      ++tokPos;
      total = total * radix + val;
    }

    if (tokPos === start || len != null && tokPos - start !== len) return null;
    return total;
  }

  function readHexNumber() {
    tokPos += 2;
    var val = readInt(16);
    if (val == null) raise(tokStart + 2, "Expected hexadecimal number");
    if (isIdentifierStart(input.charCodeAt(tokPos))) raise(tokPos, "Identifier directly after number");
    return finishToken(_num, val);
  }

  function readNumber(startsWithDot) {
    var start = tokPos,
        isFloat = false,
        octal = input.charCodeAt(tokPos) === 48;
    if (!startsWithDot && readInt(10) === null) raise(start, "Invalid number");

    if (input.charCodeAt(tokPos) === 46) {
      ++tokPos;
      readInt(10);
      isFloat = true;
    }

    var next = input.charCodeAt(tokPos);

    if (next === 69 || next === 101) {
      next = input.charCodeAt(++tokPos);
      if (next === 43 || next === 45) ++tokPos;
      if (readInt(10) === null) raise(start, "Invalid number");
      isFloat = true;
    }

    if (isIdentifierStart(input.charCodeAt(tokPos))) raise(tokPos, "Identifier directly after number");
    var str = input.slice(start, tokPos),
        val;
    if (isFloat) val = parseFloat(str);else if (!octal || str.length === 1) val = parseInt(str, 10);else if (/[89]/.test(str) || strict) raise(start, "Invalid number");else val = parseInt(str, 8);
    return finishToken(_num, val);
  }

  function readString(quote) {
    tokPos++;
    var out = "";

    for (;;) {
      if (tokPos >= inputLen) raise(tokStart, "Unterminated string constant");
      var ch = input.charCodeAt(tokPos);

      if (ch === quote) {
        ++tokPos;
        return finishToken(_string, out);
      }

      if (ch === 92) {
        ch = input.charCodeAt(++tokPos);
        var octal = /^[0-7]+/.exec(input.slice(tokPos, tokPos + 3));
        if (octal) octal = octal[0];

        while (octal && parseInt(octal, 8) > 255) {
          octal = octal.slice(0, -1);
        }

        if (octal === "0") octal = null;
        ++tokPos;

        if (octal) {
          if (strict) raise(tokPos - 2, "Octal literal in strict mode");
          out += String.fromCharCode(parseInt(octal, 8));
          tokPos += octal.length - 1;
        } else {
          switch (ch) {
            case 110:
              out += "\n";
              break;

            case 114:
              out += "\r";
              break;

            case 120:
              out += String.fromCharCode(readHexChar(2));
              break;

            case 117:
              out += String.fromCharCode(readHexChar(4));
              break;

            case 85:
              out += String.fromCharCode(readHexChar(8));
              break;

            case 116:
              out += "\t";
              break;

            case 98:
              out += "\b";
              break;

            case 118:
              out += "\x0B";
              break;

            case 102:
              out += "\f";
              break;

            case 48:
              out += "\0";
              break;

            case 13:
              if (input.charCodeAt(tokPos) === 10) ++tokPos;

            case 10:
              if (options.locations) {
                tokLineStart = tokPos;
                ++tokCurLine;
              }

              break;

            default:
              out += String.fromCharCode(ch);
              break;
          }
        }
      } else {
        if (ch === 13 || ch === 10 || ch === 8232 || ch === 8233) raise(tokStart, "Unterminated string constant");
        out += String.fromCharCode(ch);
        ++tokPos;
      }
    }
  }

  function readHexChar(len) {
    var n = readInt(16, len);
    if (n === null) raise(tokStart, "Bad character escape sequence");
    return n;
  }

  var containsEsc;

  function readWord1() {
    containsEsc = false;
    var word,
        first = true,
        start = tokPos;

    for (;;) {
      var ch = input.charCodeAt(tokPos);

      if (isIdentifierChar(ch)) {
        if (containsEsc) word += input.charAt(tokPos);
        ++tokPos;
      } else if (ch === 92) {
        if (!containsEsc) word = input.slice(start, tokPos);
        containsEsc = true;
        if (input.charCodeAt(++tokPos) != 117) raise(tokPos, "Expecting Unicode escape sequence \\uXXXX");
        ++tokPos;
        var esc = readHexChar(4);
        var escStr = String.fromCharCode(esc);
        if (!escStr) raise(tokPos - 1, "Invalid Unicode escape");
        if (!(first ? isIdentifierStart(esc) : isIdentifierChar(esc))) raise(tokPos - 4, "Invalid Unicode escape");
        word += escStr;
      } else {
        break;
      }

      first = false;
    }

    return containsEsc ? word : input.slice(start, tokPos);
  }

  function readWord() {
    var word = readWord1();
    var type = _name;

    if (!containsEsc) {
      if (isKeyword(word)) type = keywordTypes[word];else if (options.forbidReserved && (options.ecmaVersion === 3 ? isReservedWord3 : isReservedWord5)(word) || strict && isStrictReservedWord(word)) raise(tokStart, "The keyword '" + word + "' is reserved");
    }

    return finishToken(type, word);
  }

  function next() {
    lastStart = tokStart;
    lastEnd = tokEnd;
    lastEndLoc = tokEndLoc;
    readToken();
  }

  function setStrict(strct) {
    strict = strct;
    tokPos = lastEnd;

    if (options.locations) {
      while (tokPos < tokLineStart) {
        tokLineStart = input.lastIndexOf("\n", tokLineStart - 2) + 1;
        --tokCurLine;
      }
    }

    skipSpace();
    readToken();
  }

  function node_t() {
    this.type = null;
    this.start = tokStart;
    this.end = null;
  }

  function node_loc_t() {
    this.start = tokStartLoc;
    this.end = null;
    if (sourceFile !== null) this.source = sourceFile;
  }

  function startNode() {
    var node = new node_t();
    if (options.locations) node.loc = new node_loc_t();
    if (options.directSourceFile) node.sourceFile = options.directSourceFile;
    if (options.ranges) node.range = [tokStart, 0];
    return node;
  }

  function startNodeFrom(other) {
    var node = new node_t();
    node.start = other.start;

    if (options.locations) {
      node.loc = new node_loc_t();
      node.loc.start = other.loc.start;
    }

    if (options.ranges) node.range = [other.range[0], 0];
    return node;
  }

  function finishNode(node, type) {
    node.type = type;
    node.end = lastEnd;
    if (options.locations) node.loc.end = lastEndLoc;
    if (options.ranges) node.range[1] = lastEnd;
    return node;
  }

  function isUseStrict(stmt) {
    return options.ecmaVersion >= 5 && stmt.type === "ExpressionStatement" && stmt.expression.type === "Literal" && stmt.expression.value === "use strict";
  }

  function eat(type) {
    if (tokType === type) {
      next();
      return true;
    }
  }

  function canInsertSemicolon() {
    return !options.strictSemicolons && (tokType === _eof || tokType === _braceR || newline.test(input.slice(lastEnd, tokStart)));
  }

  function semicolon() {
    if (!eat(_semi) && !canInsertSemicolon()) unexpected();
  }

  function expect(type) {
    if (tokType === type) next();else unexpected();
  }

  function unexpected() {
    raise(tokStart, "Unexpected token");
  }

  function checkLVal(expr) {
    if (expr.type !== "Identifier" && expr.type !== "MemberExpression") raise(expr.start, "Assigning to rvalue");
    if (strict && expr.type === "Identifier" && isStrictBadIdWord(expr.name)) raise(expr.start, "Assigning to " + expr.name + " in strict mode");
  }

  function parseTopLevel(program) {
    lastStart = lastEnd = tokPos;
    if (options.locations) lastEndLoc = new line_loc_t();
    inFunction = strict = null;
    labels = [];
    readToken();
    var node = program || startNode(),
        first = true;
    if (!program) node.body = [];

    while (tokType !== _eof) {
      var stmt = parseStatement();
      node.body.push(stmt);
      if (first && isUseStrict(stmt)) setStrict(true);
      first = false;
    }

    return finishNode(node, "Program");
  }

  var loopLabel = {
    kind: "loop"
  },
      switchLabel = {
    kind: "switch"
  };

  function parseStatement() {
    if (tokType === _slash || tokType === _assign && tokVal == "/=") readToken(true);
    var starttype = tokType,
        node = startNode();

    switch (starttype) {
      case _break:
      case _continue:
        next();
        var isBreak = starttype === _break;
        if (eat(_semi) || canInsertSemicolon()) node.label = null;else if (tokType !== _name) unexpected();else {
          node.label = parseIdent();
          semicolon();
        }

        for (var i = 0; i < labels.length; ++i) {
          var lab = labels[i];

          if (node.label == null || lab.name === node.label.name) {
            if (lab.kind != null && (isBreak || lab.kind === "loop")) break;
            if (node.label && isBreak) break;
          }
        }

        if (i === labels.length) raise(node.start, "Unsyntactic " + starttype.keyword);
        return finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement");

      case _debugger:
        next();
        semicolon();
        return finishNode(node, "DebuggerStatement");

      case _do:
        next();
        labels.push(loopLabel);
        node.body = parseStatement();
        labels.pop();
        expect(_while);
        node.test = parseParenExpression();
        semicolon();
        return finishNode(node, "DoWhileStatement");

      case _for:
        next();
        labels.push(loopLabel);
        expect(_parenL);
        if (tokType === _semi) return parseFor(node, null);

        if (tokType === _var) {
          var init = startNode();
          next();
          parseVar(init, true);
          finishNode(init, "VariableDeclaration");
          if (init.declarations.length === 1 && eat(_in)) return parseForIn(node, init);
          return parseFor(node, init);
        }

        var init = parseExpression(false, true);

        if (eat(_in)) {
          checkLVal(init);
          return parseForIn(node, init);
        }

        return parseFor(node, init);

      case _function:
        next();
        return parseFunction(node, true);

      case _if:
        next();
        node.test = parseParenExpression();
        node.consequent = parseStatement();
        node.alternate = eat(_else) ? parseStatement() : null;
        return finishNode(node, "IfStatement");

      case _return:
        if (!inFunction) raise(tokStart, "'return' outside of function");
        next();
        if (eat(_semi) || canInsertSemicolon()) node.argument = null;else {
          node.argument = parseExpression();
          semicolon();
        }
        return finishNode(node, "ReturnStatement");

      case _switch:
        next();
        node.discriminant = parseParenExpression();
        node.cases = [];
        expect(_braceL);
        labels.push(switchLabel);

        for (var cur, sawDefault; tokType != _braceR;) {
          if (tokType === _case || tokType === _default) {
            var isCase = tokType === _case;
            if (cur) finishNode(cur, "SwitchCase");
            node.cases.push(cur = startNode());
            cur.consequent = [];
            next();
            if (isCase) cur.test = parseExpression();else {
              if (sawDefault) raise(lastStart, "Multiple default clauses");
              sawDefault = true;
              cur.test = null;
            }
            expect(_colon);
          } else {
            if (!cur) unexpected();
            cur.consequent.push(parseStatement());
          }
        }

        if (cur) finishNode(cur, "SwitchCase");
        next();
        labels.pop();
        return finishNode(node, "SwitchStatement");

      case _throw:
        next();
        if (newline.test(input.slice(lastEnd, tokStart))) raise(lastEnd, "Illegal newline after throw");
        node.argument = parseExpression();
        semicolon();
        return finishNode(node, "ThrowStatement");

      case _try:
        next();
        node.block = parseBlock();
        node.handler = null;

        if (tokType === _catch) {
          var clause = startNode();
          next();
          expect(_parenL);
          clause.param = parseIdent();
          if (strict && isStrictBadIdWord(clause.param.name)) raise(clause.param.start, "Binding " + clause.param.name + " in strict mode");
          expect(_parenR);
          clause.guard = null;
          clause.body = parseBlock();
          node.handler = finishNode(clause, "CatchClause");
        }

        node.guardedHandlers = empty;
        node.finalizer = eat(_finally) ? parseBlock() : null;
        if (!node.handler && !node.finalizer) raise(node.start, "Missing catch or finally clause");
        return finishNode(node, "TryStatement");

      case _var:
        next();
        parseVar(node);
        semicolon();
        return finishNode(node, "VariableDeclaration");

      case _while:
        next();
        node.test = parseParenExpression();
        labels.push(loopLabel);
        node.body = parseStatement();
        labels.pop();
        return finishNode(node, "WhileStatement");

      case _with:
        if (strict) raise(tokStart, "'with' in strict mode");
        next();
        node.object = parseParenExpression();
        node.body = parseStatement();
        return finishNode(node, "WithStatement");

      case _braceL:
        return parseBlock();

      case _semi:
        next();
        return finishNode(node, "EmptyStatement");

      default:
        var maybeName = tokVal,
            expr = parseExpression();

        if (starttype === _name && expr.type === "Identifier" && eat(_colon)) {
          for (var i = 0; i < labels.length; ++i) {
            if (labels[i].name === maybeName) raise(expr.start, "Label '" + maybeName + "' is already declared");
          }

          var kind = tokType.isLoop ? "loop" : tokType === _switch ? "switch" : null;
          labels.push({
            name: maybeName,
            kind: kind
          });
          node.body = parseStatement();
          labels.pop();
          node.label = expr;
          return finishNode(node, "LabeledStatement");
        } else {
          node.expression = expr;
          semicolon();
          return finishNode(node, "ExpressionStatement");
        }

    }
  }

  function parseParenExpression() {
    expect(_parenL);
    var val = parseExpression();
    expect(_parenR);
    return val;
  }

  function parseBlock(allowStrict) {
    var node = startNode(),
        first = true,
        strict = false,
        oldStrict;
    node.body = [];
    expect(_braceL);

    while (!eat(_braceR)) {
      var stmt = parseStatement();
      node.body.push(stmt);

      if (first && allowStrict && isUseStrict(stmt)) {
        oldStrict = strict;
        setStrict(strict = true);
      }

      first = false;
    }

    if (strict && !oldStrict) setStrict(false);
    return finishNode(node, "BlockStatement");
  }

  function parseFor(node, init) {
    node.init = init;
    expect(_semi);
    node.test = tokType === _semi ? null : parseExpression();
    expect(_semi);
    node.update = tokType === _parenR ? null : parseExpression();
    expect(_parenR);
    node.body = parseStatement();
    labels.pop();
    return finishNode(node, "ForStatement");
  }

  function parseForIn(node, init) {
    node.left = init;
    node.right = parseExpression();
    expect(_parenR);
    node.body = parseStatement();
    labels.pop();
    return finishNode(node, "ForInStatement");
  }

  function parseVar(node, noIn) {
    node.declarations = [];
    node.kind = "var";

    for (;;) {
      var decl = startNode();
      decl.id = parseIdent();
      if (strict && isStrictBadIdWord(decl.id.name)) raise(decl.id.start, "Binding " + decl.id.name + " in strict mode");
      decl.init = eat(_eq) ? parseExpression(true, noIn) : null;
      node.declarations.push(finishNode(decl, "VariableDeclarator"));
      if (!eat(_comma)) break;
    }

    return node;
  }

  function parseExpression(noComma, noIn) {
    var expr = parseMaybeAssign(noIn);

    if (!noComma && tokType === _comma) {
      var node = startNodeFrom(expr);
      node.expressions = [expr];

      while (eat(_comma)) {
        node.expressions.push(parseMaybeAssign(noIn));
      }

      return finishNode(node, "SequenceExpression");
    }

    return expr;
  }

  function parseMaybeAssign(noIn) {
    var left = parseMaybeConditional(noIn);

    if (tokType.isAssign) {
      var node = startNodeFrom(left);
      node.operator = tokVal;
      node.left = left;
      next();
      node.right = parseMaybeAssign(noIn);
      checkLVal(left);
      return finishNode(node, "AssignmentExpression");
    }

    return left;
  }

  function parseMaybeConditional(noIn) {
    var expr = parseExprOps(noIn);

    if (eat(_question)) {
      var node = startNodeFrom(expr);
      node.test = expr;
      node.consequent = parseExpression(true);
      expect(_colon);
      node.alternate = parseExpression(true, noIn);
      return finishNode(node, "ConditionalExpression");
    }

    return expr;
  }

  function parseExprOps(noIn) {
    return parseExprOp(parseMaybeUnary(), -1, noIn);
  }

  function parseExprOp(left, minPrec, noIn) {
    var prec = tokType.binop;

    if (prec != null && (!noIn || tokType !== _in)) {
      if (prec > minPrec) {
        var node = startNodeFrom(left);
        node.left = left;
        node.operator = tokVal;
        var op = tokType;
        next();
        node.right = parseExprOp(parseMaybeUnary(), prec, noIn);
        var exprNode = finishNode(node, op === _logicalOR || op === _logicalAND ? "LogicalExpression" : "BinaryExpression");
        return parseExprOp(exprNode, minPrec, noIn);
      }
    }

    return left;
  }

  function parseMaybeUnary() {
    if (tokType.prefix) {
      var node = startNode(),
          update = tokType.isUpdate;
      node.operator = tokVal;
      node.prefix = true;
      tokRegexpAllowed = true;
      next();
      node.argument = parseMaybeUnary();
      if (update) checkLVal(node.argument);else if (strict && node.operator === "delete" && node.argument.type === "Identifier") raise(node.start, "Deleting local variable in strict mode");
      return finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
    }

    var expr = parseExprSubscripts();

    while (tokType.postfix && !canInsertSemicolon()) {
      var node = startNodeFrom(expr);
      node.operator = tokVal;
      node.prefix = false;
      node.argument = expr;
      checkLVal(expr);
      next();
      expr = finishNode(node, "UpdateExpression");
    }

    return expr;
  }

  function parseExprSubscripts() {
    return parseSubscripts(parseExprAtom());
  }

  function parseSubscripts(base, noCalls) {
    if (eat(_dot)) {
      var node = startNodeFrom(base);
      node.object = base;
      node.property = parseIdent(true);
      node.computed = false;
      return parseSubscripts(finishNode(node, "MemberExpression"), noCalls);
    } else if (eat(_bracketL)) {
      var node = startNodeFrom(base);
      node.object = base;
      node.property = parseExpression();
      node.computed = true;
      expect(_bracketR);
      return parseSubscripts(finishNode(node, "MemberExpression"), noCalls);
    } else if (!noCalls && eat(_parenL)) {
      var node = startNodeFrom(base);
      node.callee = base;
      node.arguments = parseExprList(_parenR, false);
      return parseSubscripts(finishNode(node, "CallExpression"), noCalls);
    } else return base;
  }

  function parseExprAtom() {
    switch (tokType) {
      case _this:
        var node = startNode();
        next();
        return finishNode(node, "ThisExpression");

      case _name:
        return parseIdent();

      case _num:
      case _string:
      case _regexp:
        var node = startNode();
        node.value = tokVal;
        node.raw = input.slice(tokStart, tokEnd);
        next();
        return finishNode(node, "Literal");

      case _null:
      case _true:
      case _false:
        var node = startNode();
        node.value = tokType.atomValue;
        node.raw = tokType.keyword;
        next();
        return finishNode(node, "Literal");

      case _parenL:
        var tokStartLoc1 = tokStartLoc,
            tokStart1 = tokStart;
        next();
        var val = parseExpression();
        val.start = tokStart1;
        val.end = tokEnd;

        if (options.locations) {
          val.loc.start = tokStartLoc1;
          val.loc.end = tokEndLoc;
        }

        if (options.ranges) val.range = [tokStart1, tokEnd];
        expect(_parenR);
        return val;

      case _bracketL:
        var node = startNode();
        next();
        node.elements = parseExprList(_bracketR, true, true);
        return finishNode(node, "ArrayExpression");

      case _braceL:
        return parseObj();

      case _function:
        var node = startNode();
        next();
        return parseFunction(node, false);

      case _new:
        return parseNew();

      default:
        unexpected();
    }
  }

  function parseNew() {
    var node = startNode();
    next();
    node.callee = parseSubscripts(parseExprAtom(), true);
    if (eat(_parenL)) node.arguments = parseExprList(_parenR, false);else node.arguments = empty;
    return finishNode(node, "NewExpression");
  }

  function parseObj() {
    var node = startNode(),
        first = true,
        sawGetSet = false;
    node.properties = [];
    next();

    while (!eat(_braceR)) {
      if (!first) {
        expect(_comma);
        if (options.allowTrailingCommas && eat(_braceR)) break;
      } else first = false;

      var prop = {
        key: parsePropertyName()
      },
          isGetSet = false,
          kind;

      if (eat(_colon)) {
        prop.value = parseExpression(true);
        kind = prop.kind = "init";
      } else if (options.ecmaVersion >= 5 && prop.key.type === "Identifier" && (prop.key.name === "get" || prop.key.name === "set")) {
        isGetSet = sawGetSet = true;
        kind = prop.kind = prop.key.name;
        prop.key = parsePropertyName();
        if (tokType !== _parenL) unexpected();
        prop.value = parseFunction(startNode(), false);
      } else unexpected();

      if (prop.key.type === "Identifier" && (strict || sawGetSet)) {
        for (var i = 0; i < node.properties.length; ++i) {
          var other = node.properties[i];

          if (other.key.name === prop.key.name) {
            var conflict = kind == other.kind || isGetSet && other.kind === "init" || kind === "init" && (other.kind === "get" || other.kind === "set");
            if (conflict && !strict && kind === "init" && other.kind === "init") conflict = false;
            if (conflict) raise(prop.key.start, "Redefinition of property");
          }
        }
      }

      node.properties.push(prop);
    }

    return finishNode(node, "ObjectExpression");
  }

  function parsePropertyName() {
    if (tokType === _num || tokType === _string) return parseExprAtom();
    return parseIdent(true);
  }

  function parseFunction(node, isStatement) {
    if (tokType === _name) node.id = parseIdent();else if (isStatement) unexpected();else node.id = null;
    node.params = [];
    var first = true;
    expect(_parenL);

    while (!eat(_parenR)) {
      if (!first) expect(_comma);else first = false;
      node.params.push(parseIdent());
    }

    var oldInFunc = inFunction,
        oldLabels = labels;
    inFunction = true;
    labels = [];
    node.body = parseBlock(true);
    inFunction = oldInFunc;
    labels = oldLabels;

    if (strict || node.body.body.length && isUseStrict(node.body.body[0])) {
      for (var i = node.id ? -1 : 0; i < node.params.length; ++i) {
        var id = i < 0 ? node.id : node.params[i];
        if (isStrictReservedWord(id.name) || isStrictBadIdWord(id.name)) raise(id.start, "Defining '" + id.name + "' in strict mode");
        if (i >= 0) for (var j = 0; j < i; ++j) {
          if (id.name === node.params[j].name) raise(id.start, "Argument name clash in strict mode");
        }
      }
    }

    return finishNode(node, isStatement ? "FunctionDeclaration" : "FunctionExpression");
  }

  function parseExprList(close, allowTrailingComma, allowEmpty) {
    var elts = [],
        first = true;

    while (!eat(close)) {
      if (!first) {
        expect(_comma);
        if (allowTrailingComma && options.allowTrailingCommas && eat(close)) break;
      } else first = false;

      if (allowEmpty && tokType === _comma) elts.push(null);else elts.push(parseExpression(true));
    }

    return elts;
  }

  function parseIdent(liberal) {
    var node = startNode();
    node.name = tokType === _name ? tokVal : liberal && !options.forbidReserved && tokType.keyword || unexpected();
    tokRegexpAllowed = false;
    next();
    return finishNode(node, "Identifier");
  }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9KUy1JbnRlcnByZXRlci9hY29ybi5qcyJdLCJuYW1lcyI6WyJyb290IiwibW9kIiwiZXhwb3J0cyIsIm1vZHVsZSIsImRlZmluZSIsImFtZCIsImFjb3JuIiwidmVyc2lvbiIsIm9wdGlvbnMiLCJpbnB1dCIsImlucHV0TGVuIiwic291cmNlRmlsZSIsInBhcnNlIiwiaW5wdCIsIm9wdHMiLCJTdHJpbmciLCJsZW5ndGgiLCJzZXRPcHRpb25zIiwiaW5pdFRva2VuU3RhdGUiLCJwYXJzZVRvcExldmVsIiwicHJvZ3JhbSIsImRlZmF1bHRPcHRpb25zIiwiZWNtYVZlcnNpb24iLCJzdHJpY3RTZW1pY29sb25zIiwiYWxsb3dUcmFpbGluZ0NvbW1hcyIsImZvcmJpZFJlc2VydmVkIiwibG9jYXRpb25zIiwib25Db21tZW50IiwicmFuZ2VzIiwiZGlyZWN0U291cmNlRmlsZSIsIm9wdCIsIk9iamVjdCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsImdldExpbmVJbmZvIiwib2Zmc2V0IiwibGluZSIsImN1ciIsImxpbmVCcmVhayIsImxhc3RJbmRleCIsIm1hdGNoIiwiZXhlYyIsImluZGV4IiwiY29sdW1uIiwidG9rZW5pemUiLCJ0IiwiZ2V0VG9rZW4iLCJmb3JjZVJlZ2V4cCIsInJlYWRUb2tlbiIsInN0YXJ0IiwidG9rU3RhcnQiLCJlbmQiLCJ0b2tFbmQiLCJzdGFydExvYyIsInRva1N0YXJ0TG9jIiwiZW5kTG9jIiwidG9rRW5kTG9jIiwidHlwZSIsInRva1R5cGUiLCJ2YWx1ZSIsInRva1ZhbCIsImp1bXBUbyIsInBvcyIsInJlQWxsb3dlZCIsInRva1BvcyIsInRva0N1ckxpbmUiLCJ0b2tMaW5lU3RhcnQiLCJ0b2tSZWdleHBBbGxvd2VkIiwic2tpcFNwYWNlIiwibGFzdFN0YXJ0IiwibGFzdEVuZCIsImxhc3RFbmRMb2MiLCJpbkZ1bmN0aW9uIiwibGFiZWxzIiwic3RyaWN0IiwicmFpc2UiLCJtZXNzYWdlIiwibG9jIiwiZXJyIiwiU3ludGF4RXJyb3IiLCJyYWlzZWRBdCIsImVtcHR5IiwiX251bSIsIl9yZWdleHAiLCJfc3RyaW5nIiwiX25hbWUiLCJfZW9mIiwiX2JyZWFrIiwia2V5d29yZCIsIl9jYXNlIiwiYmVmb3JlRXhwciIsIl9jYXRjaCIsIl9jb250aW51ZSIsIl9kZWJ1Z2dlciIsIl9kZWZhdWx0IiwiX2RvIiwiaXNMb29wIiwiX2Vsc2UiLCJfZmluYWxseSIsIl9mb3IiLCJfZnVuY3Rpb24iLCJfaWYiLCJfcmV0dXJuIiwiX3N3aXRjaCIsIl90aHJvdyIsIl90cnkiLCJfdmFyIiwiX3doaWxlIiwiX3dpdGgiLCJfbmV3IiwiX3RoaXMiLCJfbnVsbCIsImF0b21WYWx1ZSIsIl90cnVlIiwiX2ZhbHNlIiwiX2luIiwiYmlub3AiLCJrZXl3b3JkVHlwZXMiLCJwcmVmaXgiLCJfYnJhY2tldEwiLCJfYnJhY2tldFIiLCJfYnJhY2VMIiwiX2JyYWNlUiIsIl9wYXJlbkwiLCJfcGFyZW5SIiwiX2NvbW1hIiwiX3NlbWkiLCJfY29sb24iLCJfZG90IiwiX3F1ZXN0aW9uIiwiX3NsYXNoIiwiX2VxIiwiaXNBc3NpZ24iLCJfYXNzaWduIiwiX2luY0RlYyIsInBvc3RmaXgiLCJpc1VwZGF0ZSIsIl9wcmVmaXgiLCJfbG9naWNhbE9SIiwiX2xvZ2ljYWxBTkQiLCJfYml0d2lzZU9SIiwiX2JpdHdpc2VYT1IiLCJfYml0d2lzZUFORCIsIl9lcXVhbGl0eSIsIl9yZWxhdGlvbmFsIiwiX2JpdFNoaWZ0IiwiX3BsdXNNaW4iLCJfbXVsdGlwbHlNb2R1bG8iLCJ0b2tUeXBlcyIsImJyYWNrZXRMIiwiYnJhY2tldFIiLCJicmFjZUwiLCJicmFjZVIiLCJwYXJlbkwiLCJwYXJlblIiLCJjb21tYSIsInNlbWkiLCJjb2xvbiIsImRvdCIsInF1ZXN0aW9uIiwic2xhc2giLCJlcSIsIm5hbWUiLCJlb2YiLCJudW0iLCJyZWdleHAiLCJzdHJpbmciLCJrdyIsIm1ha2VQcmVkaWNhdGUiLCJ3b3JkcyIsInNwbGl0IiwiZiIsImNhdHMiLCJvdXQiLCJpIiwiaiIsInB1c2giLCJjb21wYXJlVG8iLCJhcnIiLCJKU09OIiwic3RyaW5naWZ5Iiwic29ydCIsImEiLCJiIiwiY2F0IiwiRnVuY3Rpb24iLCJpc1Jlc2VydmVkV29yZDMiLCJpc1Jlc2VydmVkV29yZDUiLCJpc1N0cmljdFJlc2VydmVkV29yZCIsImlzU3RyaWN0QmFkSWRXb3JkIiwiaXNLZXl3b3JkIiwibm9uQVNDSUl3aGl0ZXNwYWNlIiwibm9uQVNDSUlpZGVudGlmaWVyU3RhcnRDaGFycyIsIm5vbkFTQ0lJaWRlbnRpZmllckNoYXJzIiwibm9uQVNDSUlpZGVudGlmaWVyU3RhcnQiLCJSZWdFeHAiLCJub25BU0NJSWlkZW50aWZpZXIiLCJuZXdsaW5lIiwiaXNJZGVudGlmaWVyU3RhcnQiLCJjb2RlIiwidGVzdCIsImZyb21DaGFyQ29kZSIsImlzSWRlbnRpZmllckNoYXIiLCJsaW5lX2xvY190IiwiZmluaXNoVG9rZW4iLCJ2YWwiLCJza2lwQmxvY2tDb21tZW50IiwiaW5kZXhPZiIsInNsaWNlIiwic2tpcExpbmVDb21tZW50IiwiY2giLCJjaGFyQ29kZUF0IiwibmV4dCIsInJlYWRUb2tlbl9kb3QiLCJyZWFkTnVtYmVyIiwicmVhZFRva2VuX3NsYXNoIiwicmVhZFJlZ2V4cCIsImZpbmlzaE9wIiwicmVhZFRva2VuX211bHRfbW9kdWxvIiwicmVhZFRva2VuX3BpcGVfYW1wIiwicmVhZFRva2VuX2NhcmV0IiwicmVhZFRva2VuX3BsdXNfbWluIiwicmVhZFRva2VuX2x0X2d0Iiwic2l6ZSIsInJlYWRUb2tlbl9lcV9leGNsIiwiZ2V0VG9rZW5Gcm9tQ29kZSIsInJlYWRIZXhOdW1iZXIiLCJyZWFkU3RyaW5nIiwicmVhZFdvcmQiLCJ0b2siLCJzdHIiLCJjb250ZW50IiwiZXNjYXBlZCIsImluQ2xhc3MiLCJjaGFyQXQiLCJtb2RzIiwicmVhZFdvcmQxIiwicmVhZEludCIsInJhZGl4IiwibGVuIiwidG90YWwiLCJlIiwiSW5maW5pdHkiLCJzdGFydHNXaXRoRG90IiwiaXNGbG9hdCIsIm9jdGFsIiwicGFyc2VGbG9hdCIsInBhcnNlSW50IiwicXVvdGUiLCJyZWFkSGV4Q2hhciIsIm4iLCJjb250YWluc0VzYyIsIndvcmQiLCJmaXJzdCIsImVzYyIsImVzY1N0ciIsInNldFN0cmljdCIsInN0cmN0IiwibGFzdEluZGV4T2YiLCJub2RlX3QiLCJub2RlX2xvY190Iiwic291cmNlIiwic3RhcnROb2RlIiwibm9kZSIsInJhbmdlIiwic3RhcnROb2RlRnJvbSIsIm90aGVyIiwiZmluaXNoTm9kZSIsImlzVXNlU3RyaWN0Iiwic3RtdCIsImV4cHJlc3Npb24iLCJlYXQiLCJjYW5JbnNlcnRTZW1pY29sb24iLCJzZW1pY29sb24iLCJ1bmV4cGVjdGVkIiwiZXhwZWN0IiwiY2hlY2tMVmFsIiwiZXhwciIsImJvZHkiLCJwYXJzZVN0YXRlbWVudCIsImxvb3BMYWJlbCIsImtpbmQiLCJzd2l0Y2hMYWJlbCIsInN0YXJ0dHlwZSIsImlzQnJlYWsiLCJsYWJlbCIsInBhcnNlSWRlbnQiLCJsYWIiLCJwb3AiLCJwYXJzZVBhcmVuRXhwcmVzc2lvbiIsInBhcnNlRm9yIiwiaW5pdCIsInBhcnNlVmFyIiwiZGVjbGFyYXRpb25zIiwicGFyc2VGb3JJbiIsInBhcnNlRXhwcmVzc2lvbiIsInBhcnNlRnVuY3Rpb24iLCJjb25zZXF1ZW50IiwiYWx0ZXJuYXRlIiwiYXJndW1lbnQiLCJkaXNjcmltaW5hbnQiLCJjYXNlcyIsInNhd0RlZmF1bHQiLCJpc0Nhc2UiLCJibG9jayIsInBhcnNlQmxvY2siLCJoYW5kbGVyIiwiY2xhdXNlIiwicGFyYW0iLCJndWFyZCIsImd1YXJkZWRIYW5kbGVycyIsImZpbmFsaXplciIsIm9iamVjdCIsIm1heWJlTmFtZSIsImFsbG93U3RyaWN0Iiwib2xkU3RyaWN0IiwidXBkYXRlIiwibGVmdCIsInJpZ2h0Iiwibm9JbiIsImRlY2wiLCJpZCIsIm5vQ29tbWEiLCJwYXJzZU1heWJlQXNzaWduIiwiZXhwcmVzc2lvbnMiLCJwYXJzZU1heWJlQ29uZGl0aW9uYWwiLCJvcGVyYXRvciIsInBhcnNlRXhwck9wcyIsInBhcnNlRXhwck9wIiwicGFyc2VNYXliZVVuYXJ5IiwibWluUHJlYyIsInByZWMiLCJvcCIsImV4cHJOb2RlIiwicGFyc2VFeHByU3Vic2NyaXB0cyIsInBhcnNlU3Vic2NyaXB0cyIsInBhcnNlRXhwckF0b20iLCJiYXNlIiwibm9DYWxscyIsInByb3BlcnR5IiwiY29tcHV0ZWQiLCJjYWxsZWUiLCJhcmd1bWVudHMiLCJwYXJzZUV4cHJMaXN0IiwicmF3IiwidG9rU3RhcnRMb2MxIiwidG9rU3RhcnQxIiwiZWxlbWVudHMiLCJwYXJzZU9iaiIsInBhcnNlTmV3Iiwic2F3R2V0U2V0IiwicHJvcGVydGllcyIsInByb3AiLCJrZXkiLCJwYXJzZVByb3BlcnR5TmFtZSIsImlzR2V0U2V0IiwiY29uZmxpY3QiLCJpc1N0YXRlbWVudCIsInBhcmFtcyIsIm9sZEluRnVuYyIsIm9sZExhYmVscyIsImNsb3NlIiwiYWxsb3dUcmFpbGluZ0NvbW1hIiwiYWxsb3dFbXB0eSIsImVsdHMiLCJsaWJlcmFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0JBLENBQUMsVUFBU0EsSUFBVCxFQUFlQyxHQUFmLEVBQW9CO0FBQ25CLE1BQUksUUFBT0MsT0FBUCx5Q0FBT0EsT0FBUCxNQUFrQixRQUFsQixJQUE4QixRQUFPQyxNQUFQLHlDQUFPQSxNQUFQLE1BQWlCLFFBQW5ELEVBQTZELE9BQU9GLEdBQUcsQ0FBQ0MsT0FBRCxDQUFWO0FBQzdELE1BQUksT0FBT0UsTUFBUCxJQUFpQixVQUFqQixJQUErQkEsTUFBTSxDQUFDQyxHQUExQyxFQUErQyxPQUFPRCxNQUFNLENBQUMsQ0FBQyxTQUFELENBQUQsRUFBY0gsR0FBZCxDQUFiO0FBQy9DQSxFQUFBQSxHQUFHLENBQUNELElBQUksQ0FBQ00sS0FBTCxLQUFlTixJQUFJLENBQUNNLEtBQUwsR0FBYSxFQUE1QixDQUFELENBQUg7QUFDRCxDQUpELFVB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Q2lCLGNBQXBCLElBQXNDa0MsT0FBTyxDQUFDOEIsT0FBL0MsSUFBMkQwTCxVQUFVLEVBQTlHO0FBQ0EvTSxJQUFBQSxnQkFBZ0IsR0FBRyxLQUFuQjtBQUNBaUosSUFBQUEsSUFBSTtBQUNKLFdBQU91RCxVQUFVLENBQUNKLElBQUQsRUFBTyxZQUFQLENBQWpCO0FBQ0Q7QUFFRixDQXpzREQiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBBY29ybiBpcyBhIHRpbnksIGZhc3QgSmF2YVNjcmlwdCBwYXJzZXIgd3JpdHRlbiBpbiBKYXZhU2NyaXB0LlxuLy9cbi8vIEFjb3JuIHdhcyB3cml0dGVuIGJ5IE1hcmlqbiBIYXZlcmJla2UgYW5kIHJlbGVhc2VkIHVuZGVyIGFuIE1JVFxuLy8gbGljZW5zZS4gVGhlIFVuaWNvZGUgcmVnZXhwcyAoZm9yIGlkZW50aWZpZXJzIGFuZCB3aGl0ZXNwYWNlKSB3ZXJlXG4vLyB0YWtlbiBmcm9tIFtFc3ByaW1hXShodHRwOi8vZXNwcmltYS5vcmcpIGJ5IEFyaXlhIEhpZGF5YXQuXG4vL1xuLy8gR2l0IHJlcG9zaXRvcmllcyBmb3IgQWNvcm4gYXJlIGF2YWlsYWJsZSBhdFxuLy9cbi8vICAgICBodHRwOi8vbWFyaWpuaGF2ZXJiZWtlLm5sL2dpdC9hY29yblxuLy8gICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJpam5oL2Fjb3JuLmdpdFxuLy9cbi8vIFBsZWFzZSB1c2UgdGhlIFtnaXRodWIgYnVnIHRyYWNrZXJdW2doYnRdIHRvIHJlcG9ydCBpc3N1ZXMuXG4vL1xuLy8gW2doYnRdOiBodHRwczovL2dpdGh1Yi5jb20vbWFyaWpuaC9hY29ybi9pc3N1ZXNcbi8vXG4vLyBUaGlzIGZpbGUgZGVmaW5lcyB0aGUgbWFpbiBwYXJzZXIgaW50ZXJmYWNlLiBUaGUgbGlicmFyeSBhbHNvIGNvbWVzXG4vLyB3aXRoIGEgW2Vycm9yLXRvbGVyYW50IHBhcnNlcl1bZGFtbWl0XSBhbmQgYW5cbi8vIFthYnN0cmFjdCBzeW50YXggdHJlZSB3YWxrZXJdW3dhbGtdLCBkZWZpbmVkIGluIG90aGVyIGZpbGVzLlxuLy9cbi8vIFtkYW1taXRdOiBhY29ybl9sb29zZS5qc1xuLy8gW3dhbGtdOiB1dGlsL3dhbGsuanNcblxuKGZ1bmN0aW9uKHJvb3QsIG1vZCkge1xuICBpZiAodHlwZW9mIGV4cG9ydHMgPT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgbW9kdWxlID09IFwib2JqZWN0XCIpIHJldHVybiBtb2QoZXhwb3J0cyk7IC8vIENvbW1vbkpTXG4gIGlmICh0eXBlb2YgZGVmaW5lID09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSByZXR1cm4gZGVmaW5lKFtcImV4cG9ydHNcIl0sIG1vZCk7IC8vIEFNRFxuICBtb2Qocm9vdC5hY29ybiB8fCAocm9vdC5hY29ybiA9IHt9KSk7IC8vIFBsYWluIGJyb3dzZXIgZW52XG59KSh0aGlzLCBmdW5jdGlvbihleHBvcnRzKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGV4cG9ydHMudmVyc2lvbiA9IFwiMC40LjFcIjtcblxuICAvLyBUaGUgbWFpbiBleHBvcnRlZCBpbnRlcmZhY2UgKHVuZGVyIGBzZWxmLmFjb3JuYCB3aGVuIGluIHRoZVxuICAvLyBicm93c2VyKSBpcyBhIGBwYXJzZWAgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIGNvZGUgc3RyaW5nIGFuZFxuICAvLyByZXR1cm5zIGFuIGFic3RyYWN0IHN5bnRheCB0cmVlIGFzIHNwZWNpZmllZCBieSBbTW96aWxsYSBwYXJzZXJcbiAgLy8gQVBJXVthcGldLCB3aXRoIHRoZSBjYXZlYXQgdGhhdCB0aGUgU3BpZGVyTW9ua2V5LXNwZWNpZmljIHN5bnRheFxuICAvLyAoYGxldGAsIGB5aWVsZGAsIGlubGluZSBYTUwsIGV0YykgaXMgbm90IHJlY29nbml6ZWQuXG4gIC8vXG4gIC8vIFthcGldOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1NwaWRlck1vbmtleS9QYXJzZXJfQVBJXG5cbiAgdmFyIG9wdGlvbnMsIGlucHV0LCBpbnB1dExlbiwgc291cmNlRmlsZTtcblxuICBleHBvcnRzLnBhcnNlID0gZnVuY3Rpb24oaW5wdCwgb3B0cykge1xuICAgIGlucHV0ID0gU3RyaW5nKGlucHQpOyBpbnB1dExlbiA9IGlucHV0Lmxlbmd0aDtcbiAgICBzZXRPcHRpb25zKG9wdHMpO1xuICAgIGluaXRUb2tlblN0YXRlKCk7XG4gICAgcmV0dXJuIHBhcnNlVG9wTGV2ZWwob3B0aW9ucy5wcm9ncmFtKTtcbiAgfTtcblxuICAvLyBBIHNlY29uZCBvcHRpb25hbCBhcmd1bWVudCBjYW4gYmUgZ2l2ZW4gdG8gZnVydGhlciBjb25maWd1cmVcbiAgLy8gdGhlIHBhcnNlciBwcm9jZXNzLiBUaGVzZSBvcHRpb25zIGFyZSByZWNvZ25pemVkOlxuXG4gIHZhciBkZWZhdWx0T3B0aW9ucyA9IGV4cG9ydHMuZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgLy8gYGVjbWFWZXJzaW9uYCBpbmRpY2F0ZXMgdGhlIEVDTUFTY3JpcHQgdmVyc2lvbiB0byBwYXJzZS4gTXVzdFxuICAgIC8vIGJlIGVpdGhlciAzIG9yIDUuIFRoaXNcbiAgICAvLyBpbmZsdWVuY2VzIHN1cHBvcnQgZm9yIHN0cmljdCBtb2RlLCB0aGUgc2V0IG9mIHJlc2VydmVkIHdvcmRzLCBhbmRcbiAgICAvLyBzdXBwb3J0IGZvciBnZXR0ZXJzIGFuZCBzZXR0ZXIuXG4gICAgZWNtYVZlcnNpb246IDUsXG4gICAgLy8gVHVybiBvbiBgc3RyaWN0U2VtaWNvbG9uc2AgdG8gcHJldmVudCB0aGUgcGFyc2VyIGZyb20gZG9pbmdcbiAgICAvLyBhdXRvbWF0aWMgc2VtaWNvbG9uIGluc2VydGlvbi5cbiAgICBzdHJpY3RTZW1pY29sb25zOiBmYWxzZSxcbiAgICAvLyBXaGVuIGBhbGxvd1RyYWlsaW5nQ29tbWFzYCBpcyBmYWxzZSwgdGhlIHBhcnNlciB3aWxsIG5vdCBhbGxvd1xuICAgIC8vIHRyYWlsaW5nIGNvbW1hcyBpbiBhcnJheSBhbmQgb2JqZWN0IGxpdGVyYWxzLlxuICAgIGFsbG93VHJhaWxpbmdDb21tYXM6IHRydWUsXG4gICAgLy8gQnkgZGVmYXVsdCwgcmVzZXJ2ZWQgd29yZHMgYXJlIG5vdCBlbmZvcmNlZC4gRW5hYmxlXG4gICAgLy8gYGZvcmJpZFJlc2VydmVkYCB0byBlbmZvcmNlIHRoZW0uXG4gICAgZm9yYmlkUmVzZXJ2ZWQ6IGZhbHNlLFxuICAgIC8vIFdoZW4gYGxvY2F0aW9uc2AgaXMgb24sIGBsb2NgIHByb3BlcnRpZXMgaG9sZGluZyBvYmplY3RzIHdpdGhcbiAgICAvLyBgc3RhcnRgIGFuZCBgZW5kYCBwcm9wZXJ0aWVzIGluIGB7bGluZSwgY29sdW1ufWAgZm9ybSAod2l0aFxuICAgIC8vIGxpbmUgYmVpbmcgMS1iYXNlZCBhbmQgY29sdW1uIDAtYmFzZWQpIHdpbGwgYmUgYXR0YWNoZWQgdG8gdGhlXG4gICAgLy8gbm9kZXMuXG4gICAgbG9jYXRpb25zOiBmYWxzZSxcbiAgICAvLyBBIGZ1bmN0aW9uIGNhbiBiZSBwYXNzZWQgYXMgYG9uQ29tbWVudGAgb3B0aW9uLCB3aGljaCB3aWxsXG4gICAgLy8gY2F1c2UgQWNvcm4gdG8gY2FsbCB0aGF0IGZ1bmN0aW9uIHdpdGggYChibG9jaywgdGV4dCwgc3RhcnQsXG4gICAgLy8gZW5kKWAgcGFyYW1ldGVycyB3aGVuZXZlciBhIGNvbW1lbnQgaXMgc2tpcHBlZC4gYGJsb2NrYCBpcyBhXG4gICAgLy8gYm9vbGVhbiBpbmRpY2F0aW5nIHdoZXRoZXIgdGhpcyBpcyBhIGJsb2NrIChgLyogKi9gKSBjb21tZW50LFxuICAgIC8vIGB0ZXh0YCBpcyB0aGUgY29udGVudCBvZiB0aGUgY29tbWVudCwgYW5kIGBzdGFydGAgYW5kIGBlbmRgIGFyZVxuICAgIC8vIGNoYXJhY3RlciBvZmZzZXRzIHRoYXQgZGVub3RlIHRoZSBzdGFydCBhbmQgZW5kIG9mIHRoZSBjb21tZW50LlxuICAgIC8vIFdoZW4gdGhlIGBsb2NhdGlvbnNgIG9wdGlvbiBpcyBvbiwgdHdvIG1vcmUgcGFyYW1ldGVycyBhcmVcbiAgICAvLyBwYXNzZWQsIHRoZSBmdWxsIGB7bGluZSwgY29sdW1ufWAgbG9jYXRpb25zIG9mIHRoZSBzdGFydCBhbmRcbiAgICAvLyBlbmQgb2YgdGhlIGNvbW1lbnRzLlxuICAgIG9uQ29tbWVudDogbnVsbCxcbiAgICAvLyBOb2RlcyBoYXZlIHRoZWlyIHN0YXJ0IGFuZCBlbmQgY2hhcmFjdGVycyBvZmZzZXRzIHJlY29yZGVkIGluXG4gICAgLy8gYHN0YXJ0YCBhbmQgYGVuZGAgcHJvcGVydGllcyAoZGlyZWN0bHkgb24gdGhlIG5vZGUsIHJhdGhlciB0aGFuXG4gICAgLy8gdGhlIGBsb2NgIG9iamVjdCwgd2hpY2ggaG9sZHMgbGluZS9jb2x1bW4gZGF0YS4gVG8gYWxzbyBhZGQgYVxuICAgIC8vIFtzZW1pLXN0YW5kYXJkaXplZF1bcmFuZ2VdIGByYW5nZWAgcHJvcGVydHkgaG9sZGluZyBhIGBbc3RhcnQsXG4gICAgLy8gZW5kXWAgYXJyYXkgd2l0aCB0aGUgc2FtZSBudW1iZXJzLCBzZXQgdGhlIGByYW5nZXNgIG9wdGlvbiB0b1xuICAgIC8vIGB0cnVlYC5cbiAgICAvL1xuICAgIC8vIFtyYW5nZV06IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTc0NTY3OFxuICAgIHJhbmdlczogZmFsc2UsXG4gICAgLy8gSXQgaXMgcG9zc2libGUgdG8gcGFyc2UgbXVsdGlwbGUgZmlsZXMgaW50byBhIHNpbmdsZSBBU1QgYnlcbiAgICAvLyBwYXNzaW5nIHRoZSB0cmVlIHByb2R1Y2VkIGJ5IHBhcnNpbmcgdGhlIGZpcnN0IGZpbGUgYXNcbiAgICAvLyBgcHJvZ3JhbWAgb3B0aW9uIGluIHN1YnNlcXVlbnQgcGFyc2VzLiBUaGlzIHdpbGwgYWRkIHRoZVxuICAgIC8vIHRvcGxldmVsIGZvcm1zIG9mIHRoZSBwYXJzZWQgZmlsZSB0byB0aGUgYFByb2dyYW1gICh0b3ApIG5vZGVcbiAgICAvLyBvZiBhbiBleGlzdGluZyBwYXJzZSB0cmVlLlxuICAgIHByb2dyYW06IG51bGwsXG4gICAgLy8gV2hlbiBgbG9jYXRpb25gIGlzIG9uLCB5b3UgY2FuIHBhc3MgdGhpcyB0byByZWNvcmQgdGhlIHNvdXJjZVxuICAgIC8vIGZpbGUgaW4gZXZlcnkgbm9kZSdzIGBsb2NgIG9iamVjdC5cbiAgICBzb3VyY2VGaWxlOiBudWxsLFxuICAgIC8vIFRoaXMgdmFsdWUsIGlmIGdpdmVuLCBpcyBzdG9yZWQgaW4gZXZlcnkgbm9kZSwgd2hldGhlclxuICAgIC8vIGBsb2NhdGlvbmAgaXMgb24gb3Igb2ZmLlxuICAgIGRpcmVjdFNvdXJjZUZpbGU6IG51bGxcbiAgfTtcblxuICBmdW5jdGlvbiBzZXRPcHRpb25zKG9wdHMpIHtcbiAgICBvcHRpb25zID0gb3B0cyB8fCB7fTtcbiAgICBmb3IgKHZhciBvcHQgaW4gZGVmYXVsdE9wdGlvbnMpIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9wdGlvbnMsIG9wdCkpXG4gICAgICBvcHRpb25zW29wdF0gPSBkZWZhdWx0T3B0aW9uc1tvcHRdO1xuICAgIHNvdXJjZUZpbGUgPSBvcHRpb25zLnNvdXJjZUZpbGUgfHwgbnVsbDtcbiAgfVxuXG4gIC8vIFRoZSBgZ2V0TGluZUluZm9gIGZ1bmN0aW9uIGlzIG1vc3RseSB1c2VmdWwgd2hlbiB0aGVcbiAgLy8gYGxvY2F0aW9uc2Agb3B0aW9uIGlzIG9mZiAoZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMpIGFuZCB5b3VcbiAgLy8gd2FudCB0byBmaW5kIHRoZSBsaW5lL2NvbHVtbiBwb3NpdGlvbiBmb3IgYSBnaXZlbiBjaGFyYWN0ZXJcbiAgLy8gb2Zmc2V0LiBgaW5wdXRgIHNob3VsZCBiZSB0aGUgY29kZSBzdHJpbmcgdGhhdCB0aGUgb2Zmc2V0IHJlZmVyc1xuICAvLyBpbnRvLlxuXG4gIHZhciBnZXRMaW5lSW5mbyA9IGV4cG9ydHMuZ2V0TGluZUluZm8gPSBmdW5jdGlvbihpbnB1dCwgb2Zmc2V0KSB7XG4gICAgZm9yICh2YXIgbGluZSA9IDEsIGN1ciA9IDA7Oykge1xuICAgICAgbGluZUJyZWFrLmxhc3RJbmRleCA9IGN1cjtcbiAgICAgIHZhciBtYXRjaCA9IGxpbmVCcmVhay5leGVjKGlucHV0KTtcbiAgICAgIGlmIChtYXRjaCAmJiBtYXRjaC5pbmRleCA8IG9mZnNldCkge1xuICAgICAgICArK2xpbmU7XG4gICAgICAgIGN1ciA9IG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgfSBlbHNlIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4ge2xpbmU6IGxpbmUsIGNvbHVtbjogb2Zmc2V0IC0gY3VyfTtcbiAgfTtcblxuICAvLyBBY29ybiBpcyBvcmdhbml6ZWQgYXMgYSB0b2tlbml6ZXIgYW5kIGEgcmVjdXJzaXZlLWRlc2NlbnQgcGFyc2VyLlxuICAvLyBUaGUgYHRva2VuaXplYCBleHBvcnQgcHJvdmlkZXMgYW4gaW50ZXJmYWNlIHRvIHRoZSB0b2tlbml6ZXIuXG4gIC8vIEJlY2F1c2UgdGhlIHRva2VuaXplciBpcyBvcHRpbWl6ZWQgZm9yIGJlaW5nIGVmZmljaWVudGx5IHVzZWQgYnlcbiAgLy8gdGhlIEFjb3JuIHBhcnNlciBpdHNlbGYsIHRoaXMgaW50ZXJmYWNlIGlzIHNvbWV3aGF0IGNydWRlIGFuZCBub3RcbiAgLy8gdmVyeSBtb2R1bGFyLiBQZXJmb3JtaW5nIGFub3RoZXIgcGFyc2Ugb3IgY2FsbCB0byBgdG9rZW5pemVgIHdpbGxcbiAgLy8gcmVzZXQgdGhlIGludGVybmFsIHN0YXRlLCBhbmQgaW52YWxpZGF0ZSBleGlzdGluZyB0b2tlbml6ZXJzLlxuXG4gIGV4cG9ydHMudG9rZW5pemUgPSBmdW5jdGlvbihpbnB0LCBvcHRzKSB7XG4gICAgaW5wdXQgPSBTdHJpbmcoaW5wdCk7IGlucHV0TGVuID0gaW5wdXQubGVuZ3RoO1xuICAgIHNldE9wdGlvbnMob3B0cyk7XG4gICAgaW5pdFRva2VuU3RhdGUoKTtcblxuICAgIHZhciB0ID0ge307XG4gICAgZnVuY3Rpb24gZ2V0VG9rZW4oZm9yY2VSZWdleHApIHtcbiAgICAgIHJlYWRUb2tlbihmb3JjZVJlZ2V4cCk7XG4gICAgICB0LnN0YXJ0ID0gdG9rU3RhcnQ7IHQuZW5kID0gdG9rRW5kO1xuICAgICAgdC5zdGFydExvYyA9IHRva1N0YXJ0TG9jOyB0LmVuZExvYyA9IHRva0VuZExvYztcbiAgICAgIHQudHlwZSA9IHRva1R5cGU7IHQudmFsdWUgPSB0b2tWYWw7XG4gICAgICByZXR1cm4gdDtcbiAgICB9XG4gICAgZ2V0VG9rZW4uanVtcFRvID0gZnVuY3Rpb24ocG9zLCByZUFsbG93ZWQpIHtcbiAgICAgIHRva1BvcyA9IHBvcztcbiAgICAgIGlmIChvcHRpb25zLmxvY2F0aW9ucykge1xuICAgICAgICB0b2tDdXJMaW5lID0gMTtcbiAgICAgICAgdG9rTGluZVN0YXJ0ID0gbGluZUJyZWFrLmxhc3RJbmRleCA9IDA7XG4gICAgICAgIHZhciBtYXRjaDtcbiAgICAgICAgd2hpbGUgKChtYXRjaCA9IGxpbmVCcmVhay5leGVjKGlucHV0KSkgJiYgbWF0Y2guaW5kZXggPCBwb3MpIHtcbiAgICAgICAgICArK3Rva0N1ckxpbmU7XG4gICAgICAgICAgdG9rTGluZVN0YXJ0ID0gbWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRva1JlZ2V4cEFsbG93ZWQgPSByZUFsbG93ZWQ7XG4gICAgICBza2lwU3BhY2UoKTtcbiAgICB9O1xuICAgIHJldHVybiBnZXRUb2tlbjtcbiAgfTtcblxuICAvLyBTdGF0ZSBpcyBrZXB0IGluIChjbG9zdXJlLSlnbG9iYWwgdmFyaWFibGVzLiBXZSBhbHJlYWR5IHNhdyB0aGVcbiAgLy8gYG9wdGlvbnNgLCBgaW5wdXRgLCBhbmQgYGlucHV0TGVuYCB2YXJpYWJsZXMgYWJvdmUuXG5cbiAgLy8gVGhlIGN1cnJlbnQgcG9zaXRpb24gb2YgdGhlIHRva2VuaXplciBpbiB0aGUgaW5wdXQuXG5cbiAgdmFyIHRva1BvcztcblxuICAvLyBUaGUgc3RhcnQgYW5kIGVuZCBvZmZzZXRzIG9mIHRoZSBjdXJyZW50IHRva2VuLlxuXG4gIHZhciB0b2tTdGFydCwgdG9rRW5kO1xuXG4gIC8vIFdoZW4gYG9wdGlvbnMubG9jYXRpb25zYCBpcyB0cnVlLCB0aGVzZSBob2xkIG9iamVjdHNcbiAgLy8gY29udGFpbmluZyB0aGUgdG9rZW5zIHN0YXJ0IGFuZCBlbmQgbGluZS9jb2x1bW4gcGFpcnMuXG5cbiAgdmFyIHRva1N0YXJ0TG9jLCB0b2tFbmRMb2M7XG5cbiAgLy8gVGhlIHR5cGUgYW5kIHZhbHVlIG9mIHRoZSBjdXJyZW50IHRva2VuLiBUb2tlbiB0eXBlcyBhcmUgb2JqZWN0cyxcbiAgLy8gbmFtZWQgYnkgdmFyaWFibGVzIGFnYWluc3Qgd2hpY2ggdGhleSBjYW4gYmUgY29tcGFyZWQsIGFuZFxuICAvLyBob2xkaW5nIHByb3BlcnRpZXMgdGhhdCBkZXNjcmliZSB0aGVtIChpbmRpY2F0aW5nLCBmb3IgZXhhbXBsZSxcbiAgLy8gdGhlIHByZWNlZGVuY2Ugb2YgYW4gaW5maXggb3BlcmF0b3IsIGFuZCB0aGUgb3JpZ2luYWwgbmFtZSBvZiBhXG4gIC8vIGtleXdvcmQgdG9rZW4pLiBUaGUga2luZCBvZiB2YWx1ZSB0aGF0J3MgaGVsZCBpbiBgdG9rVmFsYCBkZXBlbmRzXG4gIC8vIG9uIHRoZSB0eXBlIG9mIHRoZSB0b2tlbi4gRm9yIGxpdGVyYWxzLCBpdCBpcyB0aGUgbGl0ZXJhbCB2YWx1ZSxcbiAgLy8gZm9yIG9wZXJhdG9ycywgdGhlIG9wZXJhdG9yIG5hbWUsIGFuZCBzbyBvbi5cblxuICB2YXIgdG9rVHlwZSwgdG9rVmFsO1xuXG4gIC8vIEludGVyYWwgc3RhdGUgZm9yIHRoZSB0b2tlbml6ZXIuIFRvIGRpc3Rpbmd1aXNoIGJldHdlZW4gZGl2aXNpb25cbiAgLy8gb3BlcmF0b3JzIGFuZCByZWd1bGFyIGV4cHJlc3Npb25zLCBpdCByZW1lbWJlcnMgd2hldGhlciB0aGUgbGFzdFxuICAvLyB0b2tlbiB3YXMgb25lIHRoYXQgaXMgYWxsb3dlZCB0byBiZSBmb2xsb3dlZCBieSBhbiBleHByZXNzaW9uLlxuICAvLyAoSWYgaXQgaXMsIGEgc2xhc2ggaXMgcHJvYmFibHkgYSByZWdleHAsIGlmIGl0IGlzbid0IGl0J3MgYVxuICAvLyBkaXZpc2lvbiBvcGVyYXRvci4gU2VlIHRoZSBgcGFyc2VTdGF0ZW1lbnRgIGZ1bmN0aW9uIGZvciBhXG4gIC8vIGNhdmVhdC4pXG5cbiAgdmFyIHRva1JlZ2V4cEFsbG93ZWQ7XG5cbiAgLy8gV2hlbiBgb3B0aW9ucy5sb2NhdGlvbnNgIGlzIHRydWUsIHRoZXNlIGFyZSB1c2VkIHRvIGtlZXBcbiAgLy8gdHJhY2sgb2YgdGhlIGN1cnJlbnQgbGluZSwgYW5kIGtub3cgd2hlbiBhIG5ldyBsaW5lIGhhcyBiZWVuXG4gIC8vIGVudGVyZWQuXG5cbiAgdmFyIHRva0N1ckxpbmUsIHRva0xpbmVTdGFydDtcblxuICAvLyBUaGVzZSBzdG9yZSB0aGUgcG9zaXRpb24gb2YgdGhlIHByZXZpb3VzIHRva2VuLCB3aGljaCBpcyB1c2VmdWxcbiAgLy8gd2hlbiBmaW5pc2hpbmcgYSBub2RlIGFuZCBhc3NpZ25pbmcgaXRzIGBlbmRgIHBvc2l0aW9uLlxuXG4gIHZhciBsYXN0U3RhcnQsIGxhc3RFbmQsIGxhc3RFbmRMb2M7XG5cbiAgLy8gVGhpcyBpcyB0aGUgcGFyc2VyJ3Mgc3RhdGUuIGBpbkZ1bmN0aW9uYCBpcyB1c2VkIHRvIHJlamVjdFxuICAvLyBgcmV0dXJuYCBzdGF0ZW1lbnRzIG91dHNpZGUgb2YgZnVuY3Rpb25zLCBgbGFiZWxzYCB0byB2ZXJpZnkgdGhhdFxuICAvLyBgYnJlYWtgIGFuZCBgY29udGludWVgIGhhdmUgc29tZXdoZXJlIHRvIGp1bXAgdG8sIGFuZCBgc3RyaWN0YFxuICAvLyBpbmRpY2F0ZXMgd2hldGhlciBzdHJpY3QgbW9kZSBpcyBvbi5cblxuICB2YXIgaW5GdW5jdGlvbiwgbGFiZWxzLCBzdHJpY3Q7XG5cbiAgLy8gVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIHJhaXNlIGV4Y2VwdGlvbnMgb24gcGFyc2UgZXJyb3JzLiBJdFxuICAvLyB0YWtlcyBhbiBvZmZzZXQgaW50ZWdlciAoaW50byB0aGUgY3VycmVudCBgaW5wdXRgKSB0byBpbmRpY2F0ZVxuICAvLyB0aGUgbG9jYXRpb24gb2YgdGhlIGVycm9yLCBhdHRhY2hlcyB0aGUgcG9zaXRpb24gdG8gdGhlIGVuZFxuICAvLyBvZiB0aGUgZXJyb3IgbWVzc2FnZSwgYW5kIHRoZW4gcmFpc2VzIGEgYFN5bnRheEVycm9yYCB3aXRoIHRoYXRcbiAgLy8gbWVzc2FnZS5cblxuICBmdW5jdGlvbiByYWlzZShwb3MsIG1lc3NhZ2UpIHtcbiAgICB2YXIgbG9jID0gZ2V0TGluZUluZm8oaW5wdXQsIHBvcyk7XG4gICAgbWVzc2FnZSArPSBcIiAoXCIgKyBsb2MubGluZSArIFwiOlwiICsgbG9jLmNvbHVtbiArIFwiKVwiO1xuICAgIHZhciBlcnIgPSBuZXcgU3ludGF4RXJyb3IobWVzc2FnZSk7XG4gICAgZXJyLnBvcyA9IHBvczsgZXJyLmxvYyA9IGxvYzsgZXJyLnJhaXNlZEF0ID0gdG9rUG9zO1xuICAgIHRocm93IGVycjtcbiAgfVxuXG4gIC8vIFJldXNlZCBlbXB0eSBhcnJheSBhZGRlZCBmb3Igbm9kZSBmaWVsZHMgdGhhdCBhcmUgYWx3YXlzIGVtcHR5LlxuXG4gIHZhciBlbXB0eSA9IFtdO1xuXG4gIC8vICMjIFRva2VuIHR5cGVzXG5cbiAgLy8gVGhlIGFzc2lnbm1lbnQgb2YgZmluZS1ncmFpbmVkLCBpbmZvcm1hdGlvbi1jYXJyeWluZyB0eXBlIG9iamVjdHNcbiAgLy8gYWxsb3dzIHRoZSB0b2tlbml6ZXIgdG8gc3RvcmUgdGhlIGluZm9ybWF0aW9uIGl0IGhhcyBhYm91dCBhXG4gIC8vIHRva2VuIGluIGEgd2F5IHRoYXQgaXMgdmVyeSBjaGVhcCBmb3IgdGhlIHBhcnNlciB0byBsb29rIHVwLlxuXG4gIC8vIEFsbCB0b2tlbiB0eXBlIHZhcmlhYmxlcyBzdGFydCB3aXRoIGFuIHVuZGVyc2NvcmUsIHRvIG1ha2UgdGhlbVxuICAvLyBlYXN5IHRvIHJlY29nbml6ZS5cblxuICAvLyBUaGVzZSBhcmUgdGhlIGdlbmVyYWwgdHlwZXMuIFRoZSBgdHlwZWAgcHJvcGVydHkgaXMgb25seSB1c2VkIHRvXG4gIC8vIG1ha2UgdGhlbSByZWNvZ25pemVhYmxlIHdoZW4gZGVidWdnaW5nLlxuXG4gIHZhciBfbnVtID0ge3R5cGU6IFwibnVtXCJ9LCBfcmVnZXhwID0ge3R5cGU6IFwicmVnZXhwXCJ9LCBfc3RyaW5nID0ge3R5cGU6IFwic3RyaW5nXCJ9O1xuICB2YXIgX25hbWUgPSB7dHlwZTogXCJuYW1lXCJ9LCBfZW9mID0ge3R5cGU6IFwiZW9mXCJ9O1xuXG4gIC8vIEtleXdvcmQgdG9rZW5zLiBUaGUgYGtleXdvcmRgIHByb3BlcnR5IChhbHNvIHVzZWQgaW4ga2V5d29yZC1saWtlXG4gIC8vIG9wZXJhdG9ycykgaW5kaWNhdGVzIHRoYXQgdGhlIHRva2VuIG9yaWdpbmF0ZWQgZnJvbSBhblxuICAvLyBpZGVudGlmaWVyLWxpa2Ugd29yZCwgd2hpY2ggaXMgdXNlZCB3aGVuIHBhcnNpbmcgcHJvcGVydHkgbmFtZXMuXG4gIC8vXG4gIC8vIFRoZSBgYmVmb3JlRXhwcmAgcHJvcGVydHkgaXMgdXNlZCB0byBkaXNhbWJpZ3VhdGUgYmV0d2VlbiByZWd1bGFyXG4gIC8vIGV4cHJlc3Npb25zIGFuZCBkaXZpc2lvbnMuIEl0IGlzIHNldCBvbiBhbGwgdG9rZW4gdHlwZXMgdGhhdCBjYW5cbiAgLy8gYmUgZm9sbG93ZWQgYnkgYW4gZXhwcmVzc2lvbiAodGh1cywgYSBzbGFzaCBhZnRlciB0aGVtIHdvdWxkIGJlIGFcbiAgLy8gcmVndWxhciBleHByZXNzaW9uKS5cbiAgLy9cbiAgLy8gYGlzTG9vcGAgbWFya3MgYSBrZXl3b3JkIGFzIHN0YXJ0aW5nIGEgbG9vcCwgd2hpY2ggaXMgaW1wb3J0YW50XG4gIC8vIHRvIGtub3cgd2hlbiBwYXJzaW5nIGEgbGFiZWwsIGluIG9yZGVyIHRvIGFsbG93IG9yIGRpc2FsbG93XG4gIC8vIGNvbnRpbnVlIGp1bXBzIHRvIHRoYXQgbGFiZWwuXG5cbiAgdmFyIF9icmVhayA9IHtrZXl3b3JkOiBcImJyZWFrXCJ9LCBfY2FzZSA9IHtrZXl3b3JkOiBcImNhc2VcIiwgYmVmb3JlRXhwcjogdHJ1ZX0sIF9jYXRjaCA9IHtrZXl3b3JkOiBcImNhdGNoXCJ9O1xuICB2YXIgX2NvbnRpbnVlID0ge2tleXdvcmQ6IFwiY29udGludWVcIn0sIF9kZWJ1Z2dlciA9IHtrZXl3b3JkOiBcImRlYnVnZ2VyXCJ9LCBfZGVmYXVsdCA9IHtrZXl3b3JkOiBcImRlZmF1bHRcIn07XG4gIHZhciBfZG8gPSB7a2V5d29yZDogXCJkb1wiLCBpc0xvb3A6IHRydWV9LCBfZWxzZSA9IHtrZXl3b3JkOiBcImVsc2VcIiwgYmVmb3JlRXhwcjogdHJ1ZX07XG4gIHZhciBfZmluYWxseSA9IHtrZXl3b3JkOiBcImZpbmFsbHlcIn0sIF9mb3IgPSB7a2V5d29yZDogXCJmb3JcIiwgaXNMb29wOiB0cnVlfSwgX2Z1bmN0aW9uID0ge2tleXdvcmQ6IFwiZnVuY3Rpb25cIn07XG4gIHZhciBfaWYgPSB7a2V5d29yZDogXCJpZlwifSwgX3JldHVybiA9IHtrZXl3b3JkOiBcInJldHVyblwiLCBiZWZvcmVFeHByOiB0cnVlfSwgX3N3aXRjaCA9IHtrZXl3b3JkOiBcInN3aXRjaFwifTtcbiAgdmFyIF90aHJvdyA9IHtrZXl3b3JkOiBcInRocm93XCIsIGJlZm9yZUV4cHI6IHRydWV9LCBfdHJ5ID0ge2tleXdvcmQ6IFwidHJ5XCJ9LCBfdmFyID0ge2tleXdvcmQ6IFwidmFyXCJ9O1xuICB2YXIgX3doaWxlID0ge2tleXdvcmQ6IFwid2hpbGVcIiwgaXNMb29wOiB0cnVlfSwgX3dpdGggPSB7a2V5d29yZDogXCJ3aXRoXCJ9LCBfbmV3ID0ge2tleXdvcmQ6IFwibmV3XCIsIGJlZm9yZUV4cHI6IHRydWV9O1xuICB2YXIgX3RoaXMgPSB7a2V5d29yZDogXCJ0aGlzXCJ9O1xuXG4gIC8vIFRoZSBrZXl3b3JkcyB0aGF0IGRlbm90ZSB2YWx1ZXMuXG5cbiAgdmFyIF9udWxsID0ge2tleXdvcmQ6IFwibnVsbFwiLCBhdG9tVmFsdWU6IG51bGx9LCBfdHJ1ZSA9IHtrZXl3b3JkOiBcInRydWVcIiwgYXRvbVZhbHVlOiB0cnVlfTtcbiAgdmFyIF9mYWxzZSA9IHtrZXl3b3JkOiBcImZhbHNlXCIsIGF0b21WYWx1ZTogZmFsc2V9O1xuXG4gIC8vIFNvbWUga2V5d29yZHMgYXJlIHRyZWF0ZWQgYXMgcmVndWxhciBvcGVyYXRvcnMuIGBpbmAgc29tZXRpbWVzXG4gIC8vICh3aGVuIHBhcnNpbmcgYGZvcmApIG5lZWRzIHRvIGJlIHRlc3RlZCBhZ2FpbnN0IHNwZWNpZmljYWxseSwgc29cbiAgLy8gd2UgYXNzaWduIGEgdmFyaWFibGUgbmFtZSB0byBpdCBmb3IgcXVpY2sgY29tcGFyaW5nLlxuXG4gIHZhciBfaW4gPSB7a2V5d29yZDogXCJpblwiLCBiaW5vcDogNywgYmVmb3JlRXhwcjogdHJ1ZX07XG5cbiAgLy8gTWFwIGtleXdvcmQgbmFtZXMgdG8gdG9rZW4gdHlwZXMuXG5cbiAgdmFyIGtleXdvcmRUeXBlcyA9IHtcImJyZWFrXCI6IF9icmVhaywgXCJjYXNlXCI6IF9jYXNlLCBcImNhdGNoXCI6IF9jYXRjaCxcbiAgICAgICAgICAgICAgICAgICAgICBcImNvbnRpbnVlXCI6IF9jb250aW51ZSwgXCJkZWJ1Z2dlclwiOiBfZGVidWdnZXIsIFwiZGVmYXVsdFwiOiBfZGVmYXVsdCxcbiAgICAgICAgICAgICAgICAgICAgICBcImRvXCI6IF9kbywgXCJlbHNlXCI6IF9lbHNlLCBcImZpbmFsbHlcIjogX2ZpbmFsbHksIFwiZm9yXCI6IF9mb3IsXG4gICAgICAgICAgICAgICAgICAgICAgXCJmdW5jdGlvblwiOiBfZnVuY3Rpb24sIFwiaWZcIjogX2lmLCBcInJldHVyblwiOiBfcmV0dXJuLCBcInN3aXRjaFwiOiBfc3dpdGNoLFxuICAgICAgICAgICAgICAgICAgICAgIFwidGhyb3dcIjogX3Rocm93LCBcInRyeVwiOiBfdHJ5LCBcInZhclwiOiBfdmFyLCBcIndoaWxlXCI6IF93aGlsZSwgXCJ3aXRoXCI6IF93aXRoLFxuICAgICAgICAgICAgICAgICAgICAgIFwibnVsbFwiOiBfbnVsbCwgXCJ0cnVlXCI6IF90cnVlLCBcImZhbHNlXCI6IF9mYWxzZSwgXCJuZXdcIjogX25ldywgXCJpblwiOiBfaW4sXG4gICAgICAgICAgICAgICAgICAgICAgXCJpbnN0YW5jZW9mXCI6IHtrZXl3b3JkOiBcImluc3RhbmNlb2ZcIiwgYmlub3A6IDcsIGJlZm9yZUV4cHI6IHRydWV9LCBcInRoaXNcIjogX3RoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlb2ZcIjoge2tleXdvcmQ6IFwidHlwZW9mXCIsIHByZWZpeDogdHJ1ZSwgYmVmb3JlRXhwcjogdHJ1ZX0sXG4gICAgICAgICAgICAgICAgICAgICAgXCJ2b2lkXCI6IHtrZXl3b3JkOiBcInZvaWRcIiwgcHJlZml4OiB0cnVlLCBiZWZvcmVFeHByOiB0cnVlfSxcbiAgICAgICAgICAgICAgICAgICAgICBcImRlbGV0ZVwiOiB7a2V5d29yZDogXCJkZWxldGVcIiwgcHJlZml4OiB0cnVlLCBiZWZvcmVFeHByOiB0cnVlfX07XG5cbiAgLy8gUHVuY3R1YXRpb24gdG9rZW4gdHlwZXMuIEFnYWluLCB0aGUgYHR5cGVgIHByb3BlcnR5IGlzIHB1cmVseSBmb3IgZGVidWdnaW5nLlxuXG4gIHZhciBfYnJhY2tldEwgPSB7dHlwZTogXCJbXCIsIGJlZm9yZUV4cHI6IHRydWV9LCBfYnJhY2tldFIgPSB7dHlwZTogXCJdXCJ9LCBfYnJhY2VMID0ge3R5cGU6IFwie1wiLCBiZWZvcmVFeHByOiB0cnVlfTtcbiAgdmFyIF9icmFjZVIgPSB7dHlwZTogXCJ9XCJ9LCBfcGFyZW5MID0ge3R5cGU6IFwiKFwiLCBiZWZvcmVFeHByOiB0cnVlfSwgX3BhcmVuUiA9IHt0eXBlOiBcIilcIn07XG4gIHZhciBfY29tbWEgPSB7dHlwZTogXCIsXCIsIGJlZm9yZUV4cHI6IHRydWV9LCBfc2VtaSA9IHt0eXBlOiBcIjtcIiwgYmVmb3JlRXhwcjogdHJ1ZX07XG4gIHZhciBfY29sb24gPSB7dHlwZTogXCI6XCIsIGJlZm9yZUV4cHI6IHRydWV9LCBfZG90ID0ge3R5cGU6IFwiLlwifSwgX3F1ZXN0aW9uID0ge3R5cGU6IFwiP1wiLCBiZWZvcmVFeHByOiB0cnVlfTtcblxuICAvLyBPcGVyYXRvcnMuIFRoZXNlIGNhcnJ5IHNldmVyYWwga2luZHMgb2YgcHJvcGVydGllcyB0byBoZWxwIHRoZVxuICAvLyBwYXJzZXIgdXNlIHRoZW0gcHJvcGVybHkgKHRoZSBwcmVzZW5jZSBvZiB0aGVzZSBwcm9wZXJ0aWVzIGlzXG4gIC8vIHdoYXQgY2F0ZWdvcml6ZXMgdGhlbSBhcyBvcGVyYXRvcnMpLlxuICAvL1xuICAvLyBgYmlub3BgLCB3aGVuIHByZXNlbnQsIHNwZWNpZmllcyB0aGF0IHRoaXMgb3BlcmF0b3IgaXMgYSBiaW5hcnlcbiAgLy8gb3BlcmF0b3IsIGFuZCB3aWxsIHJlZmVyIHRvIGl0cyBwcmVjZWRlbmNlLlxuICAvL1xuICAvLyBgcHJlZml4YCBhbmQgYHBvc3RmaXhgIG1hcmsgdGhlIG9wZXJhdG9yIGFzIGEgcHJlZml4IG9yIHBvc3RmaXhcbiAgLy8gdW5hcnkgb3BlcmF0b3IuIGBpc1VwZGF0ZWAgc3BlY2lmaWVzIHRoYXQgdGhlIG5vZGUgcHJvZHVjZWQgYnlcbiAgLy8gdGhlIG9wZXJhdG9yIHNob3VsZCBiZSBvZiB0eXBlIFVwZGF0ZUV4cHJlc3Npb24gcmF0aGVyIHRoYW5cbiAgLy8gc2ltcGx5IFVuYXJ5RXhwcmVzc2lvbiAoYCsrYCBhbmQgYC0tYCkuXG4gIC8vXG4gIC8vIGBpc0Fzc2lnbmAgbWFya3MgYWxsIG9mIGA9YCwgYCs9YCwgYC09YCBldGNldGVyYSwgd2hpY2ggYWN0IGFzXG4gIC8vIGJpbmFyeSBvcGVyYXRvcnMgd2l0aCBhIHZlcnkgbG93IHByZWNlZGVuY2UsIHRoYXQgc2hvdWxkIHJlc3VsdFxuICAvLyBpbiBBc3NpZ25tZW50RXhwcmVzc2lvbiBub2Rlcy5cblxuICB2YXIgX3NsYXNoID0ge2Jpbm9wOiAxMCwgYmVmb3JlRXhwcjogdHJ1ZX0sIF9lcSA9IHtpc0Fzc2lnbjogdHJ1ZSwgYmVmb3JlRXhwcjogdHJ1ZX07XG4gIHZhciBfYXNzaWduID0ge2lzQXNzaWduOiB0cnVlLCBiZWZvcmVFeHByOiB0cnVlfTtcbiAgdmFyIF9pbmNEZWMgPSB7cG9zdGZpeDogdHJ1ZSwgcHJlZml4OiB0cnVlLCBpc1VwZGF0ZTogdHJ1ZX0sIF9wcmVmaXggPSB7cHJlZml4OiB0cnVlLCBiZWZvcmVFeHByOiB0cnVlfTtcbiAgdmFyIF9sb2dpY2FsT1IgPSB7Ymlub3A6IDEsIGJlZm9yZUV4cHI6IHRydWV9O1xuICB2YXIgX2xvZ2ljYWxBTkQgPSB7Ymlub3A6IDIsIGJlZm9yZUV4cHI6IHRydWV9O1xuICB2YXIgX2JpdHdpc2VPUiA9IHtiaW5vcDogMywgYmVmb3JlRXhwcjogdHJ1ZX07XG4gIHZhciBfYml0d2lzZVhPUiA9IHtiaW5vcDogNCwgYmVmb3JlRXhwcjogdHJ1ZX07XG4gIHZhciBfYml0d2lzZUFORCA9IHtiaW5vcDogNSwgYmVmb3JlRXhwcjogdHJ1ZX07XG4gIHZhciBfZXF1YWxpdHkgPSB7Ymlub3A6IDYsIGJlZm9yZUV4cHI6IHRydWV9O1xuICB2YXIgX3JlbGF0aW9uYWwgPSB7Ymlub3A6IDcsIGJlZm9yZUV4cHI6IHRydWV9O1xuICB2YXIgX2JpdFNoaWZ0ID0ge2Jpbm9wOiA4LCBiZWZvcmVFeHByOiB0cnVlfTtcbiAgdmFyIF9wbHVzTWluID0ge2Jpbm9wOiA5LCBwcmVmaXg6IHRydWUsIGJlZm9yZUV4cHI6IHRydWV9O1xuICB2YXIgX211bHRpcGx5TW9kdWxvID0ge2Jpbm9wOiAxMCwgYmVmb3JlRXhwcjogdHJ1ZX07XG5cbiAgLy8gUHJvdmlkZSBhY2Nlc3MgdG8gdGhlIHRva2VuIHR5cGVzIGZvciBleHRlcm5hbCB1c2VycyBvZiB0aGVcbiAgLy8gdG9rZW5pemVyLlxuXG4gIGV4cG9ydHMudG9rVHlwZXMgPSB7YnJhY2tldEw6IF9icmFja2V0TCwgYnJhY2tldFI6IF9icmFja2V0UiwgYnJhY2VMOiBfYnJhY2VMLCBicmFjZVI6IF9icmFjZVIsXG4gICAgICAgICAgICAgICAgICAgICAgcGFyZW5MOiBfcGFyZW5MLCBwYXJlblI6IF9wYXJlblIsIGNvbW1hOiBfY29tbWEsIHNlbWk6IF9zZW1pLCBjb2xvbjogX2NvbG9uLFxuICAgICAgICAgICAgICAgICAgICAgIGRvdDogX2RvdCwgcXVlc3Rpb246IF9xdWVzdGlvbiwgc2xhc2g6IF9zbGFzaCwgZXE6IF9lcSwgbmFtZTogX25hbWUsIGVvZjogX2VvZixcbiAgICAgICAgICAgICAgICAgICAgICBudW06IF9udW0sIHJlZ2V4cDogX3JlZ2V4cCwgc3RyaW5nOiBfc3RyaW5nfTtcbiAgZm9yICh2YXIga3cgaW4ga2V5d29yZFR5cGVzKSBleHBvcnRzLnRva1R5cGVzW1wiX1wiICsga3ddID0ga2V5d29yZFR5cGVzW2t3XTtcblxuICAvLyBUaGlzIGlzIGEgdHJpY2sgdGFrZW4gZnJvbSBFc3ByaW1hLiBJdCB0dXJucyBvdXQgdGhhdCwgb25cbiAgLy8gbm9uLUNocm9tZSBicm93c2VycywgdG8gY2hlY2sgd2hldGhlciBhIHN0cmluZyBpcyBpbiBhIHNldCwgYVxuICAvLyBwcmVkaWNhdGUgY29udGFpbmluZyBhIGJpZyB1Z2x5IGBzd2l0Y2hgIHN0YXRlbWVudCBpcyBmYXN0ZXIgdGhhblxuICAvLyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiwgYW5kIG9uIENocm9tZSB0aGUgdHdvIGFyZSBhYm91dCBvbiBwYXIuXG4gIC8vIFRoaXMgZnVuY3Rpb24gdXNlcyBgZXZhbGAgKG5vbi1sZXhpY2FsKSB0byBwcm9kdWNlIHN1Y2ggYVxuICAvLyBwcmVkaWNhdGUgZnJvbSBhIHNwYWNlLXNlcGFyYXRlZCBzdHJpbmcgb2Ygd29yZHMuXG4gIC8vXG4gIC8vIEl0IHN0YXJ0cyBieSBzb3J0aW5nIHRoZSB3b3JkcyBieSBsZW5ndGguXG5cbiAgZnVuY3Rpb24gbWFrZVByZWRpY2F0ZSh3b3Jkcykge1xuICAgIHdvcmRzID0gd29yZHMuc3BsaXQoXCIgXCIpO1xuICAgIHZhciBmID0gXCJcIiwgY2F0cyA9IFtdO1xuICAgIG91dDogZm9yICh2YXIgaSA9IDA7IGkgPCB3b3Jkcy5sZW5ndGg7ICsraSkge1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjYXRzLmxlbmd0aDsgKytqKVxuICAgICAgICBpZiAoY2F0c1tqXVswXS5sZW5ndGggPT0gd29yZHNbaV0ubGVuZ3RoKSB7XG4gICAgICAgICAgY2F0c1tqXS5wdXNoKHdvcmRzW2ldKTtcbiAgICAgICAgICBjb250aW51ZSBvdXQ7XG4gICAgICAgIH1cbiAgICAgIGNhdHMucHVzaChbd29yZHNbaV1dKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY29tcGFyZVRvKGFycikge1xuICAgICAgaWYgKGFyci5sZW5ndGggPT0gMSkgcmV0dXJuIGYgKz0gXCJyZXR1cm4gc3RyID09PSBcIiArIEpTT04uc3RyaW5naWZ5KGFyclswXSkgKyBcIjtcIjtcbiAgICAgIGYgKz0gXCJzd2l0Y2goc3RyKXtcIjtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgKytpKSBmICs9IFwiY2FzZSBcIiArIEpTT04uc3RyaW5naWZ5KGFycltpXSkgKyBcIjpcIjtcbiAgICAgIGYgKz0gXCJyZXR1cm4gdHJ1ZX1yZXR1cm4gZmFsc2U7XCI7XG4gICAgfVxuXG4gICAgLy8gV2hlbiB0aGVyZSBhcmUgbW9yZSB0aGFuIHRocmVlIGxlbmd0aCBjYXRlZ29yaWVzLCBhbiBvdXRlclxuICAgIC8vIHN3aXRjaCBmaXJzdCBkaXNwYXRjaGVzIG9uIHRoZSBsZW5ndGhzLCB0byBzYXZlIG9uIGNvbXBhcmlzb25zLlxuXG4gICAgaWYgKGNhdHMubGVuZ3RoID4gMykge1xuICAgICAgY2F0cy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtyZXR1cm4gYi5sZW5ndGggLSBhLmxlbmd0aDt9KTtcbiAgICAgIGYgKz0gXCJzd2l0Y2goc3RyLmxlbmd0aCl7XCI7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhdHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIGNhdCA9IGNhdHNbaV07XG4gICAgICAgIGYgKz0gXCJjYXNlIFwiICsgY2F0WzBdLmxlbmd0aCArIFwiOlwiO1xuICAgICAgICBjb21wYXJlVG8oY2F0KTtcbiAgICAgIH1cbiAgICAgIGYgKz0gXCJ9XCI7XG5cbiAgICAvLyBPdGhlcndpc2UsIHNpbXBseSBnZW5lcmF0ZSBhIGZsYXQgYHN3aXRjaGAgc3RhdGVtZW50LlxuXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbXBhcmVUbyh3b3Jkcyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgRnVuY3Rpb24oXCJzdHJcIiwgZik7XG4gIH1cblxuICAvLyBUaGUgRUNNQVNjcmlwdCAzIHJlc2VydmVkIHdvcmQgbGlzdC5cblxuICB2YXIgaXNSZXNlcnZlZFdvcmQzID0gbWFrZVByZWRpY2F0ZShcImFic3RyYWN0IGJvb2xlYW4gYnl0ZSBjaGFyIGNsYXNzIGRvdWJsZSBlbnVtIGV4cG9ydCBleHRlbmRzIGZpbmFsIGZsb2F0IGdvdG8gaW1wbGVtZW50cyBpbXBvcnQgaW50IGludGVyZmFjZSBsb25nIG5hdGl2ZSBwYWNrYWdlIHByaXZhdGUgcHJvdGVjdGVkIHB1YmxpYyBzaG9ydCBzdGF0aWMgc3VwZXIgc3luY2hyb25pemVkIHRocm93cyB0cmFuc2llbnQgdm9sYXRpbGVcIik7XG5cbiAgLy8gRUNNQVNjcmlwdCA1IHJlc2VydmVkIHdvcmRzLlxuXG4gIHZhciBpc1Jlc2VydmVkV29yZDUgPSBtYWtlUHJlZGljYXRlKFwiY2xhc3MgZW51bSBleHRlbmRzIHN1cGVyIGNvbnN0IGV4cG9ydCBpbXBvcnRcIik7XG5cbiAgLy8gVGhlIGFkZGl0aW9uYWwgcmVzZXJ2ZWQgd29yZHMgaW4gc3RyaWN0IG1vZGUuXG5cbiAgdmFyIGlzU3RyaWN0UmVzZXJ2ZWRXb3JkID0gbWFrZVByZWRpY2F0ZShcImltcGxlbWVudHMgaW50ZXJmYWNlIGxldCBwYWNrYWdlIHByaXZhdGUgcHJvdGVjdGVkIHB1YmxpYyBzdGF0aWMgeWllbGRcIik7XG5cbiAgLy8gVGhlIGZvcmJpZGRlbiB2YXJpYWJsZSBuYW1lcyBpbiBzdHJpY3QgbW9kZS5cblxuICB2YXIgaXNTdHJpY3RCYWRJZFdvcmQgPSBtYWtlUHJlZGljYXRlKFwiZXZhbCBhcmd1bWVudHNcIik7XG5cbiAgLy8gQW5kIHRoZSBrZXl3b3Jkcy5cblxuICB2YXIgaXNLZXl3b3JkID0gbWFrZVByZWRpY2F0ZShcImJyZWFrIGNhc2UgY2F0Y2ggY29udGludWUgZGVidWdnZXIgZGVmYXVsdCBkbyBlbHNlIGZpbmFsbHkgZm9yIGZ1bmN0aW9uIGlmIHJldHVybiBzd2l0Y2ggdGhyb3cgdHJ5IHZhciB3aGlsZSB3aXRoIG51bGwgdHJ1ZSBmYWxzZSBpbnN0YW5jZW9mIHR5cGVvZiB2b2lkIGRlbGV0ZSBuZXcgaW4gdGhpc1wiKTtcblxuICAvLyAjIyBDaGFyYWN0ZXIgY2F0ZWdvcmllc1xuXG4gIC8vIEJpZyB1Z2x5IHJlZ3VsYXIgZXhwcmVzc2lvbnMgdGhhdCBtYXRjaCBjaGFyYWN0ZXJzIGluIHRoZVxuICAvLyB3aGl0ZXNwYWNlLCBpZGVudGlmaWVyLCBhbmQgaWRlbnRpZmllci1zdGFydCBjYXRlZ29yaWVzLiBUaGVzZVxuICAvLyBhcmUgb25seSBhcHBsaWVkIHdoZW4gYSBjaGFyYWN0ZXIgaXMgZm91bmQgdG8gYWN0dWFsbHkgaGF2ZSBhXG4gIC8vIGNvZGUgcG9pbnQgYWJvdmUgMTI4LlxuXG4gIHZhciBub25BU0NJSXdoaXRlc3BhY2UgPSAvW1xcdTE2ODBcXHUxODBlXFx1MjAwMC1cXHUyMDBhXFx1MjAyZlxcdTIwNWZcXHUzMDAwXFx1ZmVmZl0vO1xuICB2YXIgbm9uQVNDSUlpZGVudGlmaWVyU3RhcnRDaGFycyA9IFwiXFx4YWFcXHhiNVxceGJhXFx4YzAtXFx4ZDZcXHhkOC1cXHhmNlxceGY4LVxcdTAyYzFcXHUwMmM2LVxcdTAyZDFcXHUwMmUwLVxcdTAyZTRcXHUwMmVjXFx1MDJlZVxcdTAzNzAtXFx1MDM3NFxcdTAzNzZcXHUwMzc3XFx1MDM3YS1cXHUwMzdkXFx1MDM4NlxcdTAzODgtXFx1MDM4YVxcdTAzOGNcXHUwMzhlLVxcdTAzYTFcXHUwM2EzLVxcdTAzZjVcXHUwM2Y3LVxcdTA0ODFcXHUwNDhhLVxcdTA1MjdcXHUwNTMxLVxcdTA1NTZcXHUwNTU5XFx1MDU2MS1cXHUwNTg3XFx1MDVkMC1cXHUwNWVhXFx1MDVmMC1cXHUwNWYyXFx1MDYyMC1cXHUwNjRhXFx1MDY2ZVxcdTA2NmZcXHUwNjcxLVxcdTA2ZDNcXHUwNmQ1XFx1MDZlNVxcdTA2ZTZcXHUwNmVlXFx1MDZlZlxcdTA2ZmEtXFx1MDZmY1xcdTA2ZmZcXHUwNzEwXFx1MDcxMi1cXHUwNzJmXFx1MDc0ZC1cXHUwN2E1XFx1MDdiMVxcdTA3Y2EtXFx1MDdlYVxcdTA3ZjRcXHUwN2Y1XFx1MDdmYVxcdTA4MDAtXFx1MDgxNVxcdTA4MWFcXHUwODI0XFx1MDgyOFxcdTA4NDAtXFx1MDg1OFxcdTA4YTBcXHUwOGEyLVxcdTA4YWNcXHUwOTA0LVxcdTA5MzlcXHUwOTNkXFx1MDk1MFxcdTA5NTgtXFx1MDk2MVxcdTA5NzEtXFx1MDk3N1xcdTA5NzktXFx1MDk3ZlxcdTA5ODUtXFx1MDk4Y1xcdTA5OGZcXHUwOTkwXFx1MDk5My1cXHUwOWE4XFx1MDlhYS1cXHUwOWIwXFx1MDliMlxcdTA5YjYtXFx1MDliOVxcdTA5YmRcXHUwOWNlXFx1MDlkY1xcdTA5ZGRcXHUwOWRmLVxcdTA5ZTFcXHUwOWYwXFx1MDlmMVxcdTBhMDUtXFx1MGEwYVxcdTBhMGZcXHUwYTEwXFx1MGExMy1cXHUwYTI4XFx1MGEyYS1cXHUwYTMwXFx1MGEzMlxcdTBhMzNcXHUwYTM1XFx1MGEzNlxcdTBhMzhcXHUwYTM5XFx1MGE1OS1cXHUwYTVjXFx1MGE1ZVxcdTBhNzItXFx1MGE3NFxcdTBhODUtXFx1MGE4ZFxcdTBhOGYtXFx1MGE5MVxcdTBhOTMtXFx1MGFhOFxcdTBhYWEtXFx1MGFiMFxcdTBhYjJcXHUwYWIzXFx1MGFiNS1cXHUwYWI5XFx1MGFiZFxcdTBhZDBcXHUwYWUwXFx1MGFlMVxcdTBiMDUtXFx1MGIwY1xcdTBiMGZcXHUwYjEwXFx1MGIxMy1cXHUwYjI4XFx1MGIyYS1cXHUwYjMwXFx1MGIzMlxcdTBiMzNcXHUwYjM1LVxcdTBiMzlcXHUwYjNkXFx1MGI1Y1xcdTBiNWRcXHUwYjVmLVxcdTBiNjFcXHUwYjcxXFx1MGI4M1xcdTBiODUtXFx1MGI4YVxcdTBiOGUtXFx1MGI5MFxcdTBiOTItXFx1MGI5NVxcdTBiOTlcXHUwYjlhXFx1MGI5Y1xcdTBiOWVcXHUwYjlmXFx1MGJhM1xcdTBiYTRcXHUwYmE4LVxcdTBiYWFcXHUwYmFlLVxcdTBiYjlcXHUwYmQwXFx1MGMwNS1cXHUwYzBjXFx1MGMwZS1cXHUwYzEwXFx1MGMxMi1cXHUwYzI4XFx1MGMyYS1cXHUwYzMzXFx1MGMzNS1cXHUwYzM5XFx1MGMzZFxcdTBjNThcXHUwYzU5XFx1MGM2MFxcdTBjNjFcXHUwYzg1LVxcdTBjOGNcXHUwYzhlLVxcdTBjOTBcXHUwYzkyLVxcdTBjYThcXHUwY2FhLVxcdTBjYjNcXHUwY2I1LVxcdTBjYjlcXHUwY2JkXFx1MGNkZVxcdTBjZTBcXHUwY2UxXFx1MGNmMVxcdTBjZjJcXHUwZDA1LVxcdTBkMGNcXHUwZDBlLVxcdTBkMTBcXHUwZDEyLVxcdTBkM2FcXHUwZDNkXFx1MGQ0ZVxcdTBkNjBcXHUwZDYxXFx1MGQ3YS1cXHUwZDdmXFx1MGQ4NS1cXHUwZDk2XFx1MGQ5YS1cXHUwZGIxXFx1MGRiMy1cXHUwZGJiXFx1MGRiZFxcdTBkYzAtXFx1MGRjNlxcdTBlMDEtXFx1MGUzMFxcdTBlMzJcXHUwZTMzXFx1MGU0MC1cXHUwZTQ2XFx1MGU4MVxcdTBlODJcXHUwZTg0XFx1MGU4N1xcdTBlODhcXHUwZThhXFx1MGU4ZFxcdTBlOTQtXFx1MGU5N1xcdTBlOTktXFx1MGU5ZlxcdTBlYTEtXFx1MGVhM1xcdTBlYTVcXHUwZWE3XFx1MGVhYVxcdTBlYWJcXHUwZWFkLVxcdTBlYjBcXHUwZWIyXFx1MGViM1xcdTBlYmRcXHUwZWMwLVxcdTBlYzRcXHUwZWM2XFx1MGVkYy1cXHUwZWRmXFx1MGYwMFxcdTBmNDAtXFx1MGY0N1xcdTBmNDktXFx1MGY2Y1xcdTBmODgtXFx1MGY4Y1xcdTEwMDAtXFx1MTAyYVxcdTEwM2ZcXHUxMDUwLVxcdTEwNTVcXHUxMDVhLVxcdTEwNWRcXHUxMDYxXFx1MTA2NVxcdTEwNjZcXHUxMDZlLVxcdTEwNzBcXHUxMDc1LVxcdTEwODFcXHUxMDhlXFx1MTBhMC1cXHUxMGM1XFx1MTBjN1xcdTEwY2RcXHUxMGQwLVxcdTEwZmFcXHUxMGZjLVxcdTEyNDhcXHUxMjRhLVxcdTEyNGRcXHUxMjUwLVxcdTEyNTZcXHUxMjU4XFx1MTI1YS1cXHUxMjVkXFx1MTI2MC1cXHUxMjg4XFx1MTI4YS1cXHUxMjhkXFx1MTI5MC1cXHUxMmIwXFx1MTJiMi1cXHUxMmI1XFx1MTJiOC1cXHUxMmJlXFx1MTJjMFxcdTEyYzItXFx1MTJjNVxcdTEyYzgtXFx1MTJkNlxcdTEyZDgtXFx1MTMxMFxcdTEzMTItXFx1MTMxNVxcdTEzMTgtXFx1MTM1YVxcdTEzODAtXFx1MTM4ZlxcdTEzYTAtXFx1MTNmNFxcdTE0MDEtXFx1MTY2Y1xcdTE2NmYtXFx1MTY3ZlxcdTE2ODEtXFx1MTY5YVxcdTE2YTAtXFx1MTZlYVxcdTE2ZWUtXFx1MTZmMFxcdTE3MDAtXFx1MTcwY1xcdTE3MGUtXFx1MTcxMVxcdTE3MjAtXFx1MTczMVxcdTE3NDAtXFx1MTc1MVxcdTE3NjAtXFx1MTc2Y1xcdTE3NmUtXFx1MTc3MFxcdTE3ODAtXFx1MTdiM1xcdTE3ZDdcXHUxN2RjXFx1MTgyMC1cXHUxODc3XFx1MTg4MC1cXHUxOGE4XFx1MThhYVxcdTE4YjAtXFx1MThmNVxcdTE5MDAtXFx1MTkxY1xcdTE5NTAtXFx1MTk2ZFxcdTE5NzAtXFx1MTk3NFxcdTE5ODAtXFx1MTlhYlxcdTE5YzEtXFx1MTljN1xcdTFhMDAtXFx1MWExNlxcdTFhMjAtXFx1MWE1NFxcdTFhYTdcXHUxYjA1LVxcdTFiMzNcXHUxYjQ1LVxcdTFiNGJcXHUxYjgzLVxcdTFiYTBcXHUxYmFlXFx1MWJhZlxcdTFiYmEtXFx1MWJlNVxcdTFjMDAtXFx1MWMyM1xcdTFjNGQtXFx1MWM0ZlxcdTFjNWEtXFx1MWM3ZFxcdTFjZTktXFx1MWNlY1xcdTFjZWUtXFx1MWNmMVxcdTFjZjVcXHUxY2Y2XFx1MWQwMC1cXHUxZGJmXFx1MWUwMC1cXHUxZjE1XFx1MWYxOC1cXHUxZjFkXFx1MWYyMC1cXHUxZjQ1XFx1MWY0OC1cXHUxZjRkXFx1MWY1MC1cXHUxZjU3XFx1MWY1OVxcdTFmNWJcXHUxZjVkXFx1MWY1Zi1cXHUxZjdkXFx1MWY4MC1cXHUxZmI0XFx1MWZiNi1cXHUxZmJjXFx1MWZiZVxcdTFmYzItXFx1MWZjNFxcdTFmYzYtXFx1MWZjY1xcdTFmZDAtXFx1MWZkM1xcdTFmZDYtXFx1MWZkYlxcdTFmZTAtXFx1MWZlY1xcdTFmZjItXFx1MWZmNFxcdTFmZjYtXFx1MWZmY1xcdTIwNzFcXHUyMDdmXFx1MjA5MC1cXHUyMDljXFx1MjEwMlxcdTIxMDdcXHUyMTBhLVxcdTIxMTNcXHUyMTE1XFx1MjExOS1cXHUyMTFkXFx1MjEyNFxcdTIxMjZcXHUyMTI4XFx1MjEyYS1cXHUyMTJkXFx1MjEyZi1cXHUyMTM5XFx1MjEzYy1cXHUyMTNmXFx1MjE0NS1cXHUyMTQ5XFx1MjE0ZVxcdTIxNjAtXFx1MjE4OFxcdTJjMDAtXFx1MmMyZVxcdTJjMzAtXFx1MmM1ZVxcdTJjNjAtXFx1MmNlNFxcdTJjZWItXFx1MmNlZVxcdTJjZjJcXHUyY2YzXFx1MmQwMC1cXHUyZDI1XFx1MmQyN1xcdTJkMmRcXHUyZDMwLVxcdTJkNjdcXHUyZDZmXFx1MmQ4MC1cXHUyZDk2XFx1MmRhMC1cXHUyZGE2XFx1MmRhOC1cXHUyZGFlXFx1MmRiMC1cXHUyZGI2XFx1MmRiOC1cXHUyZGJlXFx1MmRjMC1cXHUyZGM2XFx1MmRjOC1cXHUyZGNlXFx1MmRkMC1cXHUyZGQ2XFx1MmRkOC1cXHUyZGRlXFx1MmUyZlxcdTMwMDUtXFx1MzAwN1xcdTMwMjEtXFx1MzAyOVxcdTMwMzEtXFx1MzAzNVxcdTMwMzgtXFx1MzAzY1xcdTMwNDEtXFx1MzA5NlxcdTMwOWQtXFx1MzA5ZlxcdTMwYTEtXFx1MzBmYVxcdTMwZmMtXFx1MzBmZlxcdTMxMDUtXFx1MzEyZFxcdTMxMzEtXFx1MzE4ZVxcdTMxYTAtXFx1MzFiYVxcdTMxZjAtXFx1MzFmZlxcdTM0MDAtXFx1NGRiNVxcdTRlMDAtXFx1OWZjY1xcdWEwMDAtXFx1YTQ4Y1xcdWE0ZDAtXFx1YTRmZFxcdWE1MDAtXFx1YTYwY1xcdWE2MTAtXFx1YTYxZlxcdWE2MmFcXHVhNjJiXFx1YTY0MC1cXHVhNjZlXFx1YTY3Zi1cXHVhNjk3XFx1YTZhMC1cXHVhNmVmXFx1YTcxNy1cXHVhNzFmXFx1YTcyMi1cXHVhNzg4XFx1YTc4Yi1cXHVhNzhlXFx1YTc5MC1cXHVhNzkzXFx1YTdhMC1cXHVhN2FhXFx1YTdmOC1cXHVhODAxXFx1YTgwMy1cXHVhODA1XFx1YTgwNy1cXHVhODBhXFx1YTgwYy1cXHVhODIyXFx1YTg0MC1cXHVhODczXFx1YTg4Mi1cXHVhOGIzXFx1YThmMi1cXHVhOGY3XFx1YThmYlxcdWE5MGEtXFx1YTkyNVxcdWE5MzAtXFx1YTk0NlxcdWE5NjAtXFx1YTk3Y1xcdWE5ODQtXFx1YTliMlxcdWE5Y2ZcXHVhYTAwLVxcdWFhMjhcXHVhYTQwLVxcdWFhNDJcXHVhYTQ0LVxcdWFhNGJcXHVhYTYwLVxcdWFhNzZcXHVhYTdhXFx1YWE4MC1cXHVhYWFmXFx1YWFiMVxcdWFhYjVcXHVhYWI2XFx1YWFiOS1cXHVhYWJkXFx1YWFjMFxcdWFhYzJcXHVhYWRiLVxcdWFhZGRcXHVhYWUwLVxcdWFhZWFcXHVhYWYyLVxcdWFhZjRcXHVhYjAxLVxcdWFiMDZcXHVhYjA5LVxcdWFiMGVcXHVhYjExLVxcdWFiMTZcXHVhYjIwLVxcdWFiMjZcXHVhYjI4LVxcdWFiMmVcXHVhYmMwLVxcdWFiZTJcXHVhYzAwLVxcdWQ3YTNcXHVkN2IwLVxcdWQ3YzZcXHVkN2NiLVxcdWQ3ZmJcXHVmOTAwLVxcdWZhNmRcXHVmYTcwLVxcdWZhZDlcXHVmYjAwLVxcdWZiMDZcXHVmYjEzLVxcdWZiMTdcXHVmYjFkXFx1ZmIxZi1cXHVmYjI4XFx1ZmIyYS1cXHVmYjM2XFx1ZmIzOC1cXHVmYjNjXFx1ZmIzZVxcdWZiNDBcXHVmYjQxXFx1ZmI0M1xcdWZiNDRcXHVmYjQ2LVxcdWZiYjFcXHVmYmQzLVxcdWZkM2RcXHVmZDUwLVxcdWZkOGZcXHVmZDkyLVxcdWZkYzdcXHVmZGYwLVxcdWZkZmJcXHVmZTcwLVxcdWZlNzRcXHVmZTc2LVxcdWZlZmNcXHVmZjIxLVxcdWZmM2FcXHVmZjQxLVxcdWZmNWFcXHVmZjY2LVxcdWZmYmVcXHVmZmMyLVxcdWZmYzdcXHVmZmNhLVxcdWZmY2ZcXHVmZmQyLVxcdWZmZDdcXHVmZmRhLVxcdWZmZGNcIjtcbiAgdmFyIG5vbkFTQ0lJaWRlbnRpZmllckNoYXJzID0gXCJcXHUwMzAwLVxcdTAzNmZcXHUwNDgzLVxcdTA0ODdcXHUwNTkxLVxcdTA1YmRcXHUwNWJmXFx1MDVjMVxcdTA1YzJcXHUwNWM0XFx1MDVjNVxcdTA1YzdcXHUwNjEwLVxcdTA2MWFcXHUwNjIwLVxcdTA2NDlcXHUwNjcyLVxcdTA2ZDNcXHUwNmU3LVxcdTA2ZThcXHUwNmZiLVxcdTA2ZmNcXHUwNzMwLVxcdTA3NGFcXHUwODAwLVxcdTA4MTRcXHUwODFiLVxcdTA4MjNcXHUwODI1LVxcdTA4MjdcXHUwODI5LVxcdTA4MmRcXHUwODQwLVxcdTA4NTdcXHUwOGU0LVxcdTA4ZmVcXHUwOTAwLVxcdTA5MDNcXHUwOTNhLVxcdTA5M2NcXHUwOTNlLVxcdTA5NGZcXHUwOTUxLVxcdTA5NTdcXHUwOTYyLVxcdTA5NjNcXHUwOTY2LVxcdTA5NmZcXHUwOTgxLVxcdTA5ODNcXHUwOWJjXFx1MDliZS1cXHUwOWM0XFx1MDljN1xcdTA5YzhcXHUwOWQ3XFx1MDlkZi1cXHUwOWUwXFx1MGEwMS1cXHUwYTAzXFx1MGEzY1xcdTBhM2UtXFx1MGE0MlxcdTBhNDdcXHUwYTQ4XFx1MGE0Yi1cXHUwYTRkXFx1MGE1MVxcdTBhNjYtXFx1MGE3MVxcdTBhNzVcXHUwYTgxLVxcdTBhODNcXHUwYWJjXFx1MGFiZS1cXHUwYWM1XFx1MGFjNy1cXHUwYWM5XFx1MGFjYi1cXHUwYWNkXFx1MGFlMi1cXHUwYWUzXFx1MGFlNi1cXHUwYWVmXFx1MGIwMS1cXHUwYjAzXFx1MGIzY1xcdTBiM2UtXFx1MGI0NFxcdTBiNDdcXHUwYjQ4XFx1MGI0Yi1cXHUwYjRkXFx1MGI1NlxcdTBiNTdcXHUwYjVmLVxcdTBiNjBcXHUwYjY2LVxcdTBiNmZcXHUwYjgyXFx1MGJiZS1cXHUwYmMyXFx1MGJjNi1cXHUwYmM4XFx1MGJjYS1cXHUwYmNkXFx1MGJkN1xcdTBiZTYtXFx1MGJlZlxcdTBjMDEtXFx1MGMwM1xcdTBjNDYtXFx1MGM0OFxcdTBjNGEtXFx1MGM0ZFxcdTBjNTVcXHUwYzU2XFx1MGM2Mi1cXHUwYzYzXFx1MGM2Ni1cXHUwYzZmXFx1MGM4MlxcdTBjODNcXHUwY2JjXFx1MGNiZS1cXHUwY2M0XFx1MGNjNi1cXHUwY2M4XFx1MGNjYS1cXHUwY2NkXFx1MGNkNVxcdTBjZDZcXHUwY2UyLVxcdTBjZTNcXHUwY2U2LVxcdTBjZWZcXHUwZDAyXFx1MGQwM1xcdTBkNDYtXFx1MGQ0OFxcdTBkNTdcXHUwZDYyLVxcdTBkNjNcXHUwZDY2LVxcdTBkNmZcXHUwZDgyXFx1MGQ4M1xcdTBkY2FcXHUwZGNmLVxcdTBkZDRcXHUwZGQ2XFx1MGRkOC1cXHUwZGRmXFx1MGRmMlxcdTBkZjNcXHUwZTM0LVxcdTBlM2FcXHUwZTQwLVxcdTBlNDVcXHUwZTUwLVxcdTBlNTlcXHUwZWI0LVxcdTBlYjlcXHUwZWM4LVxcdTBlY2RcXHUwZWQwLVxcdTBlZDlcXHUwZjE4XFx1MGYxOVxcdTBmMjAtXFx1MGYyOVxcdTBmMzVcXHUwZjM3XFx1MGYzOVxcdTBmNDEtXFx1MGY0N1xcdTBmNzEtXFx1MGY4NFxcdTBmODYtXFx1MGY4N1xcdTBmOGQtXFx1MGY5N1xcdTBmOTktXFx1MGZiY1xcdTBmYzZcXHUxMDAwLVxcdTEwMjlcXHUxMDQwLVxcdTEwNDlcXHUxMDY3LVxcdTEwNmRcXHUxMDcxLVxcdTEwNzRcXHUxMDgyLVxcdTEwOGRcXHUxMDhmLVxcdTEwOWRcXHUxMzVkLVxcdTEzNWZcXHUxNzBlLVxcdTE3MTBcXHUxNzIwLVxcdTE3MzBcXHUxNzQwLVxcdTE3NTBcXHUxNzcyXFx1MTc3M1xcdTE3ODAtXFx1MTdiMlxcdTE3ZGRcXHUxN2UwLVxcdTE3ZTlcXHUxODBiLVxcdTE4MGRcXHUxODEwLVxcdTE4MTlcXHUxOTIwLVxcdTE5MmJcXHUxOTMwLVxcdTE5M2JcXHUxOTUxLVxcdTE5NmRcXHUxOWIwLVxcdTE5YzBcXHUxOWM4LVxcdTE5YzlcXHUxOWQwLVxcdTE5ZDlcXHUxYTAwLVxcdTFhMTVcXHUxYTIwLVxcdTFhNTNcXHUxYTYwLVxcdTFhN2NcXHUxYTdmLVxcdTFhODlcXHUxYTkwLVxcdTFhOTlcXHUxYjQ2LVxcdTFiNGJcXHUxYjUwLVxcdTFiNTlcXHUxYjZiLVxcdTFiNzNcXHUxYmIwLVxcdTFiYjlcXHUxYmU2LVxcdTFiZjNcXHUxYzAwLVxcdTFjMjJcXHUxYzQwLVxcdTFjNDlcXHUxYzViLVxcdTFjN2RcXHUxY2QwLVxcdTFjZDJcXHUxZDAwLVxcdTFkYmVcXHUxZTAxLVxcdTFmMTVcXHUyMDBjXFx1MjAwZFxcdTIwM2ZcXHUyMDQwXFx1MjA1NFxcdTIwZDAtXFx1MjBkY1xcdTIwZTFcXHUyMGU1LVxcdTIwZjBcXHUyZDgxLVxcdTJkOTZcXHUyZGUwLVxcdTJkZmZcXHUzMDIxLVxcdTMwMjhcXHUzMDk5XFx1MzA5YVxcdWE2NDAtXFx1YTY2ZFxcdWE2NzQtXFx1YTY3ZFxcdWE2OWZcXHVhNmYwLVxcdWE2ZjFcXHVhN2Y4LVxcdWE4MDBcXHVhODA2XFx1YTgwYlxcdWE4MjMtXFx1YTgyN1xcdWE4ODAtXFx1YTg4MVxcdWE4YjQtXFx1YThjNFxcdWE4ZDAtXFx1YThkOVxcdWE4ZjMtXFx1YThmN1xcdWE5MDAtXFx1YTkwOVxcdWE5MjYtXFx1YTkyZFxcdWE5MzAtXFx1YTk0NVxcdWE5ODAtXFx1YTk4M1xcdWE5YjMtXFx1YTljMFxcdWFhMDAtXFx1YWEyN1xcdWFhNDAtXFx1YWE0MVxcdWFhNGMtXFx1YWE0ZFxcdWFhNTAtXFx1YWE1OVxcdWFhN2JcXHVhYWUwLVxcdWFhZTlcXHVhYWYyLVxcdWFhZjNcXHVhYmMwLVxcdWFiZTFcXHVhYmVjXFx1YWJlZFxcdWFiZjAtXFx1YWJmOVxcdWZiMjAtXFx1ZmIyOFxcdWZlMDAtXFx1ZmUwZlxcdWZlMjAtXFx1ZmUyNlxcdWZlMzNcXHVmZTM0XFx1ZmU0ZC1cXHVmZTRmXFx1ZmYxMC1cXHVmZjE5XFx1ZmYzZlwiO1xuICB2YXIgbm9uQVNDSUlpZGVudGlmaWVyU3RhcnQgPSBuZXcgUmVnRXhwKFwiW1wiICsgbm9uQVNDSUlpZGVudGlmaWVyU3RhcnRDaGFycyArIFwiXVwiKTtcbiAgdmFyIG5vbkFTQ0lJaWRlbnRpZmllciA9IG5ldyBSZWdFeHAoXCJbXCIgKyBub25BU0NJSWlkZW50aWZpZXJTdGFydENoYXJzICsgbm9uQVNDSUlpZGVudGlmaWVyQ2hhcnMgKyBcIl1cIik7XG5cbiAgLy8gV2hldGhlciBhIHNpbmdsZSBjaGFyYWN0ZXIgZGVub3RlcyBhIG5ld2xpbmUuXG5cbiAgdmFyIG5ld2xpbmUgPSAvW1xcblxcclxcdTIwMjhcXHUyMDI5XS87XG5cbiAgLy8gTWF0Y2hlcyBhIHdob2xlIGxpbmUgYnJlYWsgKHdoZXJlIENSTEYgaXMgY29uc2lkZXJlZCBhIHNpbmdsZVxuICAvLyBsaW5lIGJyZWFrKS4gVXNlZCB0byBjb3VudCBsaW5lcy5cblxuICB2YXIgbGluZUJyZWFrID0gL1xcclxcbnxbXFxuXFxyXFx1MjAyOFxcdTIwMjldL2c7XG5cbiAgLy8gVGVzdCB3aGV0aGVyIGEgZ2l2ZW4gY2hhcmFjdGVyIGNvZGUgc3RhcnRzIGFuIGlkZW50aWZpZXIuXG5cbiAgdmFyIGlzSWRlbnRpZmllclN0YXJ0ID0gZXhwb3J0cy5pc0lkZW50aWZpZXJTdGFydCA9IGZ1bmN0aW9uKGNvZGUpIHtcbiAgICBpZiAoY29kZSA8IDY1KSByZXR1cm4gY29kZSA9PT0gMzY7XG4gICAgaWYgKGNvZGUgPCA5MSkgcmV0dXJuIHRydWU7XG4gICAgaWYgKGNvZGUgPCA5NykgcmV0dXJuIGNvZGUgPT09IDk1O1xuICAgIGlmIChjb2RlIDwgMTIzKXJldHVybiB0cnVlO1xuICAgIHJldHVybiBjb2RlID49IDB4YWEgJiYgbm9uQVNDSUlpZGVudGlmaWVyU3RhcnQudGVzdChTdHJpbmcuZnJvbUNoYXJDb2RlKGNvZGUpKTtcbiAgfTtcblxuICAvLyBUZXN0IHdoZXRoZXIgYSBnaXZlbiBjaGFyYWN0ZXIgaXMgcGFydCBvZiBhbiBpZGVudGlmaWVyLlxuXG4gIHZhciBpc0lkZW50aWZpZXJDaGFyID0gZXhwb3J0cy5pc0lkZW50aWZpZXJDaGFyID0gZnVuY3Rpb24oY29kZSkge1xuICAgIGlmIChjb2RlIDwgNDgpIHJldHVybiBjb2RlID09PSAzNjtcbiAgICBpZiAoY29kZSA8IDU4KSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoY29kZSA8IDY1KSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGNvZGUgPCA5MSkgcmV0dXJuIHRydWU7XG4gICAgaWYgKGNvZGUgPCA5NykgcmV0dXJuIGNvZGUgPT09IDk1O1xuICAgIGlmIChjb2RlIDwgMTIzKXJldHVybiB0cnVlO1xuICAgIHJldHVybiBjb2RlID49IDB4YWEgJiYgbm9uQVNDSUlpZGVudGlmaWVyLnRlc3QoU3RyaW5nLmZyb21DaGFyQ29kZShjb2RlKSk7XG4gIH07XG5cbiAgLy8gIyMgVG9rZW5pemVyXG5cbiAgLy8gVGhlc2UgYXJlIHVzZWQgd2hlbiBgb3B0aW9ucy5sb2NhdGlvbnNgIGlzIG9uLCBmb3IgdGhlXG4gIC8vIGB0b2tTdGFydExvY2AgYW5kIGB0b2tFbmRMb2NgIHByb3BlcnRpZXMuXG5cbiAgZnVuY3Rpb24gbGluZV9sb2NfdCgpIHtcbiAgICB0aGlzLmxpbmUgPSB0b2tDdXJMaW5lO1xuICAgIHRoaXMuY29sdW1uID0gdG9rUG9zIC0gdG9rTGluZVN0YXJ0O1xuICB9XG5cbiAgLy8gUmVzZXQgdGhlIHRva2VuIHN0YXRlLiBVc2VkIGF0IHRoZSBzdGFydCBvZiBhIHBhcnNlLlxuXG4gIGZ1bmN0aW9uIGluaXRUb2tlblN0YXRlKCkge1xuICAgIHRva0N1ckxpbmUgPSAxO1xuICAgIHRva1BvcyA9IHRva0xpbmVTdGFydCA9IDA7XG4gICAgdG9rUmVnZXhwQWxsb3dlZCA9IHRydWU7XG4gICAgc2tpcFNwYWNlKCk7XG4gIH1cblxuICAvLyBDYWxsZWQgYXQgdGhlIGVuZCBvZiBldmVyeSB0b2tlbi4gU2V0cyBgdG9rRW5kYCwgYHRva1ZhbGAsIGFuZFxuICAvLyBgdG9rUmVnZXhwQWxsb3dlZGAsIGFuZCBza2lwcyB0aGUgc3BhY2UgYWZ0ZXIgdGhlIHRva2VuLCBzbyB0aGF0XG4gIC8vIHRoZSBuZXh0IG9uZSdzIGB0b2tTdGFydGAgd2lsbCBwb2ludCBhdCB0aGUgcmlnaHQgcG9zaXRpb24uXG5cbiAgZnVuY3Rpb24gZmluaXNoVG9rZW4odHlwZSwgdmFsKSB7XG4gICAgdG9rRW5kID0gdG9rUG9zO1xuICAgIGlmIChvcHRpb25zLmxvY2F0aW9ucykgdG9rRW5kTG9jID0gbmV3IGxpbmVfbG9jX3Q7XG4gICAgdG9rVHlwZSA9IHR5cGU7XG4gICAgc2tpcFNwYWNlKCk7XG4gICAgdG9rVmFsID0gdmFsO1xuICAgIHRva1JlZ2V4cEFsbG93ZWQgPSB0eXBlLmJlZm9yZUV4cHI7XG4gIH1cblxuICBmdW5jdGlvbiBza2lwQmxvY2tDb21tZW50KCkge1xuICAgIHZhciBzdGFydExvYyA9IG9wdGlvbnMub25Db21tZW50ICYmIG9wdGlvbnMubG9jYXRpb25zICYmIG5ldyBsaW5lX2xvY190O1xuICAgIHZhciBzdGFydCA9IHRva1BvcywgZW5kID0gaW5wdXQuaW5kZXhPZihcIiovXCIsIHRva1BvcyArPSAyKTtcbiAgICBpZiAoZW5kID09PSAtMSkgcmFpc2UodG9rUG9zIC0gMiwgXCJVbnRlcm1pbmF0ZWQgY29tbWVudFwiKTtcbiAgICB0b2tQb3MgPSBlbmQgKyAyO1xuICAgIGlmIChvcHRpb25zLmxvY2F0aW9ucykge1xuICAgICAgbGluZUJyZWFrLmxhc3RJbmRleCA9IHN0YXJ0O1xuICAgICAgdmFyIG1hdGNoO1xuICAgICAgd2hpbGUgKChtYXRjaCA9IGxpbmVCcmVhay5leGVjKGlucHV0KSkgJiYgbWF0Y2guaW5kZXggPCB0b2tQb3MpIHtcbiAgICAgICAgKyt0b2tDdXJMaW5lO1xuICAgICAgICB0b2tMaW5lU3RhcnQgPSBtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9wdGlvbnMub25Db21tZW50KVxuICAgICAgb3B0aW9ucy5vbkNvbW1lbnQodHJ1ZSwgaW5wdXQuc2xpY2Uoc3RhcnQgKyAyLCBlbmQpLCBzdGFydCwgdG9rUG9zLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRMb2MsIG9wdGlvbnMubG9jYXRpb25zICYmIG5ldyBsaW5lX2xvY190KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNraXBMaW5lQ29tbWVudCgpIHtcbiAgICB2YXIgc3RhcnQgPSB0b2tQb3M7XG4gICAgdmFyIHN0YXJ0TG9jID0gb3B0aW9ucy5vbkNvbW1lbnQgJiYgb3B0aW9ucy5sb2NhdGlvbnMgJiYgbmV3IGxpbmVfbG9jX3Q7XG4gICAgdmFyIGNoID0gaW5wdXQuY2hhckNvZGVBdCh0b2tQb3MrPTIpO1xuICAgIHdoaWxlICh0b2tQb3MgPCBpbnB1dExlbiAmJiBjaCAhPT0gMTAgJiYgY2ggIT09IDEzICYmIGNoICE9PSA4MjMyICYmIGNoICE9PSA4MjMzKSB7XG4gICAgICArK3Rva1BvcztcbiAgICAgIGNoID0gaW5wdXQuY2hhckNvZGVBdCh0b2tQb3MpO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5vbkNvbW1lbnQpXG4gICAgICBvcHRpb25zLm9uQ29tbWVudChmYWxzZSwgaW5wdXQuc2xpY2Uoc3RhcnQgKyAyLCB0b2tQb3MpLCBzdGFydCwgdG9rUG9zLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRMb2MsIG9wdGlvbnMubG9jYXRpb25zICYmIG5ldyBsaW5lX2xvY190KTtcbiAgfVxuXG4gIC8vIENhbGxlZCBhdCB0aGUgc3RhcnQgb2YgdGhlIHBhcnNlIGFuZCBhZnRlciBldmVyeSB0b2tlbi4gU2tpcHNcbiAgLy8gd2hpdGVzcGFjZSBhbmQgY29tbWVudHMsIGFuZC5cblxuICBmdW5jdGlvbiBza2lwU3BhY2UoKSB7XG4gICAgd2hpbGUgKHRva1BvcyA8IGlucHV0TGVuKSB7XG4gICAgICB2YXIgY2ggPSBpbnB1dC5jaGFyQ29kZUF0KHRva1Bvcyk7XG4gICAgICBpZiAoY2ggPT09IDMyKSB7IC8vICcgJ1xuICAgICAgICArK3Rva1BvcztcbiAgICAgIH0gZWxzZSBpZiAoY2ggPT09IDEzKSB7XG4gICAgICAgICsrdG9rUG9zO1xuICAgICAgICB2YXIgbmV4dCA9IGlucHV0LmNoYXJDb2RlQXQodG9rUG9zKTtcbiAgICAgICAgaWYgKG5leHQgPT09IDEwKSB7XG4gICAgICAgICAgKyt0b2tQb3M7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMubG9jYXRpb25zKSB7XG4gICAgICAgICAgKyt0b2tDdXJMaW5lO1xuICAgICAgICAgIHRva0xpbmVTdGFydCA9IHRva1BvcztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChjaCA9PT0gMTAgfHwgY2ggPT09IDgyMzIgfHwgY2ggPT09IDgyMzMpIHtcbiAgICAgICAgKyt0b2tQb3M7XG4gICAgICAgIGlmIChvcHRpb25zLmxvY2F0aW9ucykge1xuICAgICAgICAgICsrdG9rQ3VyTGluZTtcbiAgICAgICAgICB0b2tMaW5lU3RhcnQgPSB0b2tQb3M7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoY2ggPiA4ICYmIGNoIDwgMTQpIHtcbiAgICAgICAgKyt0b2tQb3M7XG4gICAgICB9IGVsc2UgaWYgKGNoID09PSA0NykgeyAvLyAnLydcbiAgICAgICAgdmFyIG5leHQgPSBpbnB1dC5jaGFyQ29kZUF0KHRva1BvcyArIDEpO1xuICAgICAgICBpZiAobmV4dCA9PT0gNDIpIHsgLy8gJyonXG4gICAgICAgICAgc2tpcEJsb2NrQ29tbWVudCgpO1xuICAgICAgICB9IGVsc2UgaWYgKG5leHQgPT09IDQ3KSB7IC8vICcvJ1xuICAgICAgICAgIHNraXBMaW5lQ29tbWVudCgpO1xuICAgICAgICB9IGVsc2UgYnJlYWs7XG4gICAgICB9IGVsc2UgaWYgKGNoID09PSAxNjApIHsgLy8gJ1xceGEwJ1xuICAgICAgICArK3Rva1BvcztcbiAgICAgIH0gZWxzZSBpZiAoY2ggPj0gNTc2MCAmJiBub25BU0NJSXdoaXRlc3BhY2UudGVzdChTdHJpbmcuZnJvbUNoYXJDb2RlKGNoKSkpIHtcbiAgICAgICAgKyt0b2tQb3M7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyAjIyMgVG9rZW4gcmVhZGluZ1xuXG4gIC8vIFRoaXMgaXMgdGhlIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIHRvIGZldGNoIHRoZSBuZXh0IHRva2VuLiBJdFxuICAvLyBpcyBzb21ld2hhdCBvYnNjdXJlLCBiZWNhdXNlIGl0IHdvcmtzIGluIGNoYXJhY3RlciBjb2RlcyByYXRoZXJcbiAgLy8gdGhhbiBjaGFyYWN0ZXJzLCBhbmQgYmVjYXVzZSBvcGVyYXRvciBwYXJzaW5nIGhhcyBiZWVuIGlubGluZWRcbiAgLy8gaW50byBpdC5cbiAgLy9cbiAgLy8gQWxsIGluIHRoZSBuYW1lIG9mIHNwZWVkLlxuICAvL1xuICAvLyBUaGUgYGZvcmNlUmVnZXhwYCBwYXJhbWV0ZXIgaXMgdXNlZCBpbiB0aGUgb25lIGNhc2Ugd2hlcmUgdGhlXG4gIC8vIGB0b2tSZWdleHBBbGxvd2VkYCB0cmljayBkb2VzIG5vdCB3b3JrLiBTZWUgYHBhcnNlU3RhdGVtZW50YC5cblxuICBmdW5jdGlvbiByZWFkVG9rZW5fZG90KCkge1xuICAgIHZhciBuZXh0ID0gaW5wdXQuY2hhckNvZGVBdCh0b2tQb3MgKyAxKTtcbiAgICBpZiAobmV4dCA+PSA0OCAmJiBuZXh0IDw9IDU3KSByZXR1cm4gcmVhZE51bWJlcih0cnVlKTtcbiAgICArK3Rva1BvcztcbiAgICByZXR1cm4gZmluaXNoVG9rZW4oX2RvdCk7XG4gIH1cblxuICBmdW5jdGlvbiByZWFkVG9rZW5fc2xhc2goKSB7IC8vICcvJ1xuICAgIHZhciBuZXh0ID0gaW5wdXQuY2hhckNvZGVBdCh0b2tQb3MgKyAxKTtcbiAgICBpZiAodG9rUmVnZXhwQWxsb3dlZCkgeysrdG9rUG9zOyByZXR1cm4gcmVhZFJlZ2V4cCgpO31cbiAgICBpZiAobmV4dCA9PT0gNjEpIHJldHVybiBmaW5pc2hPcChfYXNzaWduLCAyKTtcbiAgICByZXR1cm4gZmluaXNoT3AoX3NsYXNoLCAxKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRUb2tlbl9tdWx0X21vZHVsbygpIHsgLy8gJyUqJ1xuICAgIHZhciBuZXh0ID0gaW5wdXQuY2hhckNvZGVBdCh0b2tQb3MgKyAxKTtcbiAgICBpZiAobmV4dCA9PT0gNjEpIHJldHVybiBmaW5pc2hPcChfYXNzaWduLCAyKTtcbiAgICByZXR1cm4gZmluaXNoT3AoX211bHRpcGx5TW9kdWxvLCAxKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRUb2tlbl9waXBlX2FtcChjb2RlKSB7IC8vICd8JidcbiAgICB2YXIgbmV4dCA9IGlucHV0LmNoYXJDb2RlQXQodG9rUG9zICsgMSk7XG4gICAgaWYgKG5leHQgPT09IGNvZGUpIHJldHVybiBmaW5pc2hPcChjb2RlID09PSAxMjQgPyBfbG9naWNhbE9SIDogX2xvZ2ljYWxBTkQsIDIpO1xuICAgIGlmIChuZXh0ID09PSA2MSkgcmV0dXJuIGZpbmlzaE9wKF9hc3NpZ24sIDIpO1xuICAgIHJldHVybiBmaW5pc2hPcChjb2RlID09PSAxMjQgPyBfYml0d2lzZU9SIDogX2JpdHdpc2VBTkQsIDEpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVhZFRva2VuX2NhcmV0KCkgeyAvLyAnXidcbiAgICB2YXIgbmV4dCA9IGlucHV0LmNoYXJDb2RlQXQodG9rUG9zICsgMSk7XG4gICAgaWYgKG5leHQgPT09IDYxKSByZXR1cm4gZmluaXNoT3AoX2Fzc2lnbiwgMik7XG4gICAgcmV0dXJuIGZpbmlzaE9wKF9iaXR3aXNlWE9SLCAxKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRUb2tlbl9wbHVzX21pbihjb2RlKSB7IC8vICcrLSdcbiAgICB2YXIgbmV4dCA9IGlucHV0LmNoYXJDb2RlQXQodG9rUG9zICsgMSk7XG4gICAgaWYgKG5leHQgPT09IGNvZGUpIHtcbiAgICAgIGlmIChuZXh0ID09IDQ1ICYmIGlucHV0LmNoYXJDb2RlQXQodG9rUG9zICsgMikgPT0gNjIgJiZcbiAgICAgICAgICBuZXdsaW5lLnRlc3QoaW5wdXQuc2xpY2UobGFzdEVuZCwgdG9rUG9zKSkpIHtcbiAgICAgICAgLy8gQSBgLS0+YCBsaW5lIGNvbW1lbnRcbiAgICAgICAgdG9rUG9zICs9IDM7XG4gICAgICAgIHNraXBMaW5lQ29tbWVudCgpO1xuICAgICAgICBza2lwU3BhY2UoKTtcbiAgICAgICAgcmV0dXJuIHJlYWRUb2tlbigpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZpbmlzaE9wKF9pbmNEZWMsIDIpO1xuICAgIH1cbiAgICBpZiAobmV4dCA9PT0gNjEpIHJldHVybiBmaW5pc2hPcChfYXNzaWduLCAyKTtcbiAgICByZXR1cm4gZmluaXNoT3AoX3BsdXNNaW4sIDEpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVhZFRva2VuX2x0X2d0KGNvZGUpIHsgLy8gJzw+J1xuICAgIHZhciBuZXh0ID0gaW5wdXQuY2hhckNvZGVBdCh0b2tQb3MgKyAxKTtcbiAgICB2YXIgc2l6ZSA9IDE7XG4gICAgaWYgKG5leHQgPT09IGNvZGUpIHtcbiAgICAgIHNpemUgPSBjb2RlID09PSA2MiAmJiBpbnB1dC5jaGFyQ29kZUF0KHRva1BvcyArIDIpID09PSA2MiA/IDMgOiAyO1xuICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQodG9rUG9zICsgc2l6ZSkgPT09IDYxKSByZXR1cm4gZmluaXNoT3AoX2Fzc2lnbiwgc2l6ZSArIDEpO1xuICAgICAgcmV0dXJuIGZpbmlzaE9wKF9iaXRTaGlmdCwgc2l6ZSk7XG4gICAgfVxuICAgIGlmIChuZXh0ID09IDMzICYmIGNvZGUgPT0gNjAgJiYgaW5wdXQuY2hhckNvZGVBdCh0b2tQb3MgKyAyKSA9PSA0NSAmJlxuICAgICAgICBpbnB1dC5jaGFyQ29kZUF0KHRva1BvcyArIDMpID09IDQ1KSB7XG4gICAgICAvLyBgPCEtLWAsIGFuIFhNTC1zdHlsZSBjb21tZW50IHRoYXQgc2hvdWxkIGJlIGludGVycHJldGVkIGFzIGEgbGluZSBjb21tZW50XG4gICAgICB0b2tQb3MgKz0gNDtcbiAgICAgIHNraXBMaW5lQ29tbWVudCgpO1xuICAgICAgc2tpcFNwYWNlKCk7XG4gICAgICByZXR1cm4gcmVhZFRva2VuKCk7XG4gICAgfVxuICAgIGlmIChuZXh0ID09PSA2MSlcbiAgICAgIHNpemUgPSBpbnB1dC5jaGFyQ29kZUF0KHRva1BvcyArIDIpID09PSA2MSA/IDMgOiAyO1xuICAgIHJldHVybiBmaW5pc2hPcChfcmVsYXRpb25hbCwgc2l6ZSk7XG4gIH1cblxuICBmdW5jdGlvbiByZWFkVG9rZW5fZXFfZXhjbChjb2RlKSB7IC8vICc9ISdcbiAgICB2YXIgbmV4dCA9IGlucHV0LmNoYXJDb2RlQXQodG9rUG9zICsgMSk7XG4gICAgaWYgKG5leHQgPT09IDYxKSByZXR1cm4gZmluaXNoT3AoX2VxdWFsaXR5LCBpbnB1dC5jaGFyQ29kZUF0KHRva1BvcyArIDIpID09PSA2MSA/IDMgOiAyKTtcbiAgICByZXR1cm4gZmluaXNoT3AoY29kZSA9PT0gNjEgPyBfZXEgOiBfcHJlZml4LCAxKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRva2VuRnJvbUNvZGUoY29kZSkge1xuICAgIHN3aXRjaChjb2RlKSB7XG4gICAgICAvLyBUaGUgaW50ZXJwcmV0YXRpb24gb2YgYSBkb3QgZGVwZW5kcyBvbiB3aGV0aGVyIGl0IGlzIGZvbGxvd2VkXG4gICAgICAvLyBieSBhIGRpZ2l0LlxuICAgIGNhc2UgNDY6IC8vICcuJ1xuICAgICAgcmV0dXJuIHJlYWRUb2tlbl9kb3QoKTtcblxuICAgICAgLy8gUHVuY3R1YXRpb24gdG9rZW5zLlxuICAgIGNhc2UgNDA6ICsrdG9rUG9zOyByZXR1cm4gZmluaXNoVG9rZW4oX3BhcmVuTCk7XG4gICAgY2FzZSA0MTogKyt0b2tQb3M7IHJldHVybiBmaW5pc2hUb2tlbihfcGFyZW5SKTtcbiAgICBjYXNlIDU5OiArK3Rva1BvczsgcmV0dXJuIGZpbmlzaFRva2VuKF9zZW1pKTtcbiAgICBjYXNlIDQ0OiArK3Rva1BvczsgcmV0dXJuIGZpbmlzaFRva2VuKF9jb21tYSk7XG4gICAgY2FzZSA5MTogKyt0b2tQb3M7IHJldHVybiBmaW5pc2hUb2tlbihfYnJhY2tldEwpO1xuICAgIGNhc2UgOTM6ICsrdG9rUG9zOyByZXR1cm4gZmluaXNoVG9rZW4oX2JyYWNrZXRSKTtcbiAgICBjYXNlIDEyMzogKyt0b2tQb3M7IHJldHVybiBmaW5pc2hUb2tlbihfYnJhY2VMKTtcbiAgICBjYXNlIDEyNTogKyt0b2tQb3M7IHJldHVybiBmaW5pc2hUb2tlbihfYnJhY2VSKTtcbiAgICBjYXNlIDU4OiArK3Rva1BvczsgcmV0dXJuIGZpbmlzaFRva2VuKF9jb2xvbik7XG4gICAgY2FzZSA2MzogKyt0b2tQb3M7IHJldHVybiBmaW5pc2hUb2tlbihfcXVlc3Rpb24pO1xuXG4gICAgICAvLyAnMHgnIGlzIGEgaGV4YWRlY2ltYWwgbnVtYmVyLlxuICAgIGNhc2UgNDg6IC8vICcwJ1xuICAgICAgdmFyIG5leHQgPSBpbnB1dC5jaGFyQ29kZUF0KHRva1BvcyArIDEpO1xuICAgICAgaWYgKG5leHQgPT09IDEyMCB8fCBuZXh0ID09PSA4OCkgcmV0dXJuIHJlYWRIZXhOdW1iZXIoKTtcbiAgICAgIC8vIEFueXRoaW5nIGVsc2UgYmVnaW5uaW5nIHdpdGggYSBkaWdpdCBpcyBhbiBpbnRlZ2VyLCBvY3RhbFxuICAgICAgLy8gbnVtYmVyLCBvciBmbG9hdC5cbiAgICBjYXNlIDQ5OiBjYXNlIDUwOiBjYXNlIDUxOiBjYXNlIDUyOiBjYXNlIDUzOiBjYXNlIDU0OiBjYXNlIDU1OiBjYXNlIDU2OiBjYXNlIDU3OiAvLyAxLTlcbiAgICAgIHJldHVybiByZWFkTnVtYmVyKGZhbHNlKTtcblxuICAgICAgLy8gUXVvdGVzIHByb2R1Y2Ugc3RyaW5ncy5cbiAgICBjYXNlIDM0OiBjYXNlIDM5OiAvLyAnXCInLCBcIidcIlxuICAgICAgcmV0dXJuIHJlYWRTdHJpbmcoY29kZSk7XG5cbiAgICAvLyBPcGVyYXRvcnMgYXJlIHBhcnNlZCBpbmxpbmUgaW4gdGlueSBzdGF0ZSBtYWNoaW5lcy4gJz0nICg2MSkgaXNcbiAgICAvLyBvZnRlbiByZWZlcnJlZCB0by4gYGZpbmlzaE9wYCBzaW1wbHkgc2tpcHMgdGhlIGFtb3VudCBvZlxuICAgIC8vIGNoYXJhY3RlcnMgaXQgaXMgZ2l2ZW4gYXMgc2Vjb25kIGFyZ3VtZW50LCBhbmQgcmV0dXJucyBhIHRva2VuXG4gICAgLy8gb2YgdGhlIHR5cGUgZ2l2ZW4gYnkgaXRzIGZpcnN0IGFyZ3VtZW50LlxuXG4gICAgY2FzZSA0NzogLy8gJy8nXG4gICAgICByZXR1cm4gcmVhZFRva2VuX3NsYXNoKGNvZGUpO1xuXG4gICAgY2FzZSAzNzogY2FzZSA0MjogLy8gJyUqJ1xuICAgICAgcmV0dXJuIHJlYWRUb2tlbl9tdWx0X21vZHVsbygpO1xuXG4gICAgY2FzZSAxMjQ6IGNhc2UgMzg6IC8vICd8JidcbiAgICAgIHJldHVybiByZWFkVG9rZW5fcGlwZV9hbXAoY29kZSk7XG5cbiAgICBjYXNlIDk0OiAvLyAnXidcbiAgICAgIHJldHVybiByZWFkVG9rZW5fY2FyZXQoKTtcblxuICAgIGNhc2UgNDM6IGNhc2UgNDU6IC8vICcrLSdcbiAgICAgIHJldHVybiByZWFkVG9rZW5fcGx1c19taW4oY29kZSk7XG5cbiAgICBjYXNlIDYwOiBjYXNlIDYyOiAvLyAnPD4nXG4gICAgICByZXR1cm4gcmVhZFRva2VuX2x0X2d0KGNvZGUpO1xuXG4gICAgY2FzZSA2MTogY2FzZSAzMzogLy8gJz0hJ1xuICAgICAgcmV0dXJuIHJlYWRUb2tlbl9lcV9leGNsKGNvZGUpO1xuXG4gICAgY2FzZSAxMjY6IC8vICd+J1xuICAgICAgcmV0dXJuIGZpbmlzaE9wKF9wcmVmaXgsIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRUb2tlbihmb3JjZVJlZ2V4cCkge1xuICAgIGlmICghZm9yY2VSZWdleHApIHRva1N0YXJ0ID0gdG9rUG9zO1xuICAgIGVsc2UgdG9rUG9zID0gdG9rU3RhcnQgKyAxO1xuICAgIGlmIChvcHRpb25zLmxvY2F0aW9ucykgdG9rU3RhcnRMb2MgPSBuZXcgbGluZV9sb2NfdDtcbiAgICBpZiAoZm9yY2VSZWdleHApIHJldHVybiByZWFkUmVnZXhwKCk7XG4gICAgaWYgKHRva1BvcyA+PSBpbnB1dExlbikgcmV0dXJuIGZpbmlzaFRva2VuKF9lb2YpO1xuXG4gICAgdmFyIGNvZGUgPSBpbnB1dC5jaGFyQ29kZUF0KHRva1Bvcyk7XG4gICAgLy8gSWRlbnRpZmllciBvciBrZXl3b3JkLiAnXFx1WFhYWCcgc2VxdWVuY2VzIGFyZSBhbGxvd2VkIGluXG4gICAgLy8gaWRlbnRpZmllcnMsIHNvICdcXCcgYWxzbyBkaXNwYXRjaGVzIHRvIHRoYXQuXG4gICAgaWYgKGlzSWRlbnRpZmllclN0YXJ0KGNvZGUpIHx8IGNvZGUgPT09IDkyIC8qICdcXCcgKi8pIHJldHVybiByZWFkV29yZCgpO1xuXG4gICAgdmFyIHRvayA9IGdldFRva2VuRnJvbUNvZGUoY29kZSk7XG5cbiAgICBpZiAodG9rID09PSBmYWxzZSkge1xuICAgICAgLy8gSWYgd2UgYXJlIGhlcmUsIHdlIGVpdGhlciBmb3VuZCBhIG5vbi1BU0NJSSBpZGVudGlmaWVyXG4gICAgICAvLyBjaGFyYWN0ZXIsIG9yIHNvbWV0aGluZyB0aGF0J3MgZW50aXJlbHkgZGlzYWxsb3dlZC5cbiAgICAgIHZhciBjaCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoY29kZSk7XG4gICAgICBpZiAoY2ggPT09IFwiXFxcXFwiIHx8IG5vbkFTQ0lJaWRlbnRpZmllclN0YXJ0LnRlc3QoY2gpKSByZXR1cm4gcmVhZFdvcmQoKTtcbiAgICAgIHJhaXNlKHRva1BvcywgXCJVbmV4cGVjdGVkIGNoYXJhY3RlciAnXCIgKyBjaCArIFwiJ1wiKTtcbiAgICB9XG4gICAgcmV0dXJuIHRvaztcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbmlzaE9wKHR5cGUsIHNpemUpIHtcbiAgICB2YXIgc3RyID0gaW5wdXQuc2xpY2UodG9rUG9zLCB0b2tQb3MgKyBzaXplKTtcbiAgICB0b2tQb3MgKz0gc2l6ZTtcbiAgICBmaW5pc2hUb2tlbih0eXBlLCBzdHIpO1xuICB9XG5cbiAgLy8gUGFyc2UgYSByZWd1bGFyIGV4cHJlc3Npb24uIFNvbWUgY29udGV4dC1hd2FyZW5lc3MgaXMgbmVjZXNzYXJ5LFxuICAvLyBzaW5jZSBhICcvJyBpbnNpZGUgYSAnW10nIHNldCBkb2VzIG5vdCBlbmQgdGhlIGV4cHJlc3Npb24uXG5cbiAgZnVuY3Rpb24gcmVhZFJlZ2V4cCgpIHtcbiAgICB2YXIgY29udGVudCA9IFwiXCIsIGVzY2FwZWQsIGluQ2xhc3MsIHN0YXJ0ID0gdG9rUG9zO1xuICAgIGZvciAoOzspIHtcbiAgICAgIGlmICh0b2tQb3MgPj0gaW5wdXRMZW4pIHJhaXNlKHN0YXJ0LCBcIlVudGVybWluYXRlZCByZWd1bGFyIGV4cHJlc3Npb25cIik7XG4gICAgICB2YXIgY2ggPSBpbnB1dC5jaGFyQXQodG9rUG9zKTtcbiAgICAgIGlmIChuZXdsaW5lLnRlc3QoY2gpKSByYWlzZShzdGFydCwgXCJVbnRlcm1pbmF0ZWQgcmVndWxhciBleHByZXNzaW9uXCIpO1xuICAgICAgaWYgKCFlc2NhcGVkKSB7XG4gICAgICAgIGlmIChjaCA9PT0gXCJbXCIpIGluQ2xhc3MgPSB0cnVlO1xuICAgICAgICBlbHNlIGlmIChjaCA9PT0gXCJdXCIgJiYgaW5DbGFzcykgaW5DbGFzcyA9IGZhbHNlO1xuICAgICAgICBlbHNlIGlmIChjaCA9PT0gXCIvXCIgJiYgIWluQ2xhc3MpIGJyZWFrO1xuICAgICAgICBlc2NhcGVkID0gY2ggPT09IFwiXFxcXFwiO1xuICAgICAgfSBlbHNlIGVzY2FwZWQgPSBmYWxzZTtcbiAgICAgICsrdG9rUG9zO1xuICAgIH1cbiAgICB2YXIgY29udGVudCA9IGlucHV0LnNsaWNlKHN0YXJ0LCB0b2tQb3MpO1xuICAgICsrdG9rUG9zO1xuICAgIC8vIE5lZWQgdG8gdXNlIGByZWFkV29yZDFgIGJlY2F1c2UgJ1xcdVhYWFgnIHNlcXVlbmNlcyBhcmUgYWxsb3dlZFxuICAgIC8vIGhlcmUgKGRvbid0IGFzaykuXG4gICAgdmFyIG1vZHMgPSByZWFkV29yZDEoKTtcbiAgICBpZiAobW9kcyAmJiAhL15bZ21zaXldKiQvLnRlc3QobW9kcykpIHJhaXNlKHN0YXJ0LCBcIkludmFsaWQgcmVnZXhwIGZsYWdcIik7XG4gICAgcmV0dXJuIGZpbmlzaFRva2VuKF9yZWdleHAsIG5ldyBSZWdFeHAoY29udGVudCwgbW9kcykpO1xuICB9XG5cbiAgLy8gUmVhZCBhbiBpbnRlZ2VyIGluIHRoZSBnaXZlbiByYWRpeC4gUmV0dXJuIG51bGwgaWYgemVybyBkaWdpdHNcbiAgLy8gd2VyZSByZWFkLCB0aGUgaW50ZWdlciB2YWx1ZSBvdGhlcndpc2UuIFdoZW4gYGxlbmAgaXMgZ2l2ZW4sIHRoaXNcbiAgLy8gd2lsbCByZXR1cm4gYG51bGxgIHVubGVzcyB0aGUgaW50ZWdlciBoYXMgZXhhY3RseSBgbGVuYCBkaWdpdHMuXG5cbiAgZnVuY3Rpb24gcmVhZEludChyYWRpeCwgbGVuKSB7XG4gICAgdmFyIHN0YXJ0ID0gdG9rUG9zLCB0b3RhbCA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDAsIGUgPSBsZW4gPT0gbnVsbCA/IEluZmluaXR5IDogbGVuOyBpIDwgZTsgKytpKSB7XG4gICAgICB2YXIgY29kZSA9IGlucHV0LmNoYXJDb2RlQXQodG9rUG9zKSwgdmFsO1xuICAgICAgaWYgKGNvZGUgPj0gOTcpIHZhbCA9IGNvZGUgLSA5NyArIDEwOyAvLyBhXG4gICAgICBlbHNlIGlmIChjb2RlID49IDY1KSB2YWwgPSBjb2RlIC0gNjUgKyAxMDsgLy8gQVxuICAgICAgZWxzZSBpZiAoY29kZSA+PSA0OCAmJiBjb2RlIDw9IDU3KSB2YWwgPSBjb2RlIC0gNDg7IC8vIDAtOVxuICAgICAgZWxzZSB2YWwgPSBJbmZpbml0eTtcbiAgICAgIGlmICh2YWwgPj0gcmFkaXgpIGJyZWFrO1xuICAgICAgKyt0b2tQb3M7XG4gICAgICB0b3RhbCA9IHRvdGFsICogcmFkaXggKyB2YWw7XG4gICAgfVxuICAgIGlmICh0b2tQb3MgPT09IHN0YXJ0IHx8IGxlbiAhPSBudWxsICYmIHRva1BvcyAtIHN0YXJ0ICE9PSBsZW4pIHJldHVybiBudWxsO1xuXG4gICAgcmV0dXJuIHRvdGFsO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVhZEhleE51bWJlcigpIHtcbiAgICB0b2tQb3MgKz0gMjsgLy8gMHhcbiAgICB2YXIgdmFsID0gcmVhZEludCgxNik7XG4gICAgaWYgKHZhbCA9PSBudWxsKSByYWlzZSh0b2tTdGFydCArIDIsIFwiRXhwZWN0ZWQgaGV4YWRlY2ltYWwgbnVtYmVyXCIpO1xuICAgIGlmIChpc0lkZW50aWZpZXJTdGFydChpbnB1dC5jaGFyQ29kZUF0KHRva1BvcykpKSByYWlzZSh0b2tQb3MsIFwiSWRlbnRpZmllciBkaXJlY3RseSBhZnRlciBudW1iZXJcIik7XG4gICAgcmV0dXJuIGZpbmlzaFRva2VuKF9udW0sIHZhbCk7XG4gIH1cblxuICAvLyBSZWFkIGFuIGludGVnZXIsIG9jdGFsIGludGVnZXIsIG9yIGZsb2F0aW5nLXBvaW50IG51bWJlci5cblxuICBmdW5jdGlvbiByZWFkTnVtYmVyKHN0YXJ0c1dpdGhEb3QpIHtcbiAgICB2YXIgc3RhcnQgPSB0b2tQb3MsIGlzRmxvYXQgPSBmYWxzZSwgb2N0YWwgPSBpbnB1dC5jaGFyQ29kZUF0KHRva1BvcykgPT09IDQ4O1xuICAgIGlmICghc3RhcnRzV2l0aERvdCAmJiByZWFkSW50KDEwKSA9PT0gbnVsbCkgcmFpc2Uoc3RhcnQsIFwiSW52YWxpZCBudW1iZXJcIik7XG4gICAgaWYgKGlucHV0LmNoYXJDb2RlQXQodG9rUG9zKSA9PT0gNDYpIHtcbiAgICAgICsrdG9rUG9zO1xuICAgICAgcmVhZEludCgxMCk7XG4gICAgICBpc0Zsb2F0ID0gdHJ1ZTtcbiAgICB9XG4gICAgdmFyIG5leHQgPSBpbnB1dC5jaGFyQ29kZUF0KHRva1Bvcyk7XG4gICAgaWYgKG5leHQgPT09IDY5IHx8IG5leHQgPT09IDEwMSkgeyAvLyAnZUUnXG4gICAgICBuZXh0ID0gaW5wdXQuY2hhckNvZGVBdCgrK3Rva1Bvcyk7XG4gICAgICBpZiAobmV4dCA9PT0gNDMgfHwgbmV4dCA9PT0gNDUpICsrdG9rUG9zOyAvLyAnKy0nXG4gICAgICBpZiAocmVhZEludCgxMCkgPT09IG51bGwpIHJhaXNlKHN0YXJ0LCBcIkludmFsaWQgbnVtYmVyXCIpO1xuICAgICAgaXNGbG9hdCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChpc0lkZW50aWZpZXJTdGFydChpbnB1dC5jaGFyQ29kZUF0KHRva1BvcykpKSByYWlzZSh0b2tQb3MsIFwiSWRlbnRpZmllciBkaXJlY3RseSBhZnRlciBudW1iZXJcIik7XG5cbiAgICB2YXIgc3RyID0gaW5wdXQuc2xpY2Uoc3RhcnQsIHRva1BvcyksIHZhbDtcbiAgICBpZiAoaXNGbG9hdCkgdmFsID0gcGFyc2VGbG9hdChzdHIpO1xuICAgIGVsc2UgaWYgKCFvY3RhbCB8fCBzdHIubGVuZ3RoID09PSAxKSB2YWwgPSBwYXJzZUludChzdHIsIDEwKTtcbiAgICBlbHNlIGlmICgvWzg5XS8udGVzdChzdHIpIHx8IHN0cmljdCkgcmFpc2Uoc3RhcnQsIFwiSW52YWxpZCBudW1iZXJcIik7XG4gICAgZWxzZSB2YWwgPSBwYXJzZUludChzdHIsIDgpO1xuICAgIHJldHVybiBmaW5pc2hUb2tlbihfbnVtLCB2YWwpO1xuICB9XG5cbiAgLy8gUmVhZCBhIHN0cmluZyB2YWx1ZSwgaW50ZXJwcmV0aW5nIGJhY2tzbGFzaC1lc2NhcGVzLlxuXG4gIGZ1bmN0aW9uIHJlYWRTdHJpbmcocXVvdGUpIHtcbiAgICB0b2tQb3MrKztcbiAgICB2YXIgb3V0ID0gXCJcIjtcbiAgICBmb3IgKDs7KSB7XG4gICAgICBpZiAodG9rUG9zID49IGlucHV0TGVuKSByYWlzZSh0b2tTdGFydCwgXCJVbnRlcm1pbmF0ZWQgc3RyaW5nIGNvbnN0YW50XCIpO1xuICAgICAgdmFyIGNoID0gaW5wdXQuY2hhckNvZGVBdCh0b2tQb3MpO1xuICAgICAgaWYgKGNoID09PSBxdW90ZSkge1xuICAgICAgICArK3Rva1BvcztcbiAgICAgICAgcmV0dXJuIGZpbmlzaFRva2VuKF9zdHJpbmcsIG91dCk7XG4gICAgICB9XG4gICAgICBpZiAoY2ggPT09IDkyKSB7IC8vICdcXCdcbiAgICAgICAgY2ggPSBpbnB1dC5jaGFyQ29kZUF0KCsrdG9rUG9zKTtcbiAgICAgICAgdmFyIG9jdGFsID0gL15bMC03XSsvLmV4ZWMoaW5wdXQuc2xpY2UodG9rUG9zLCB0b2tQb3MgKyAzKSk7XG4gICAgICAgIGlmIChvY3RhbCkgb2N0YWwgPSBvY3RhbFswXTtcbiAgICAgICAgd2hpbGUgKG9jdGFsICYmIHBhcnNlSW50KG9jdGFsLCA4KSA+IDI1NSkgb2N0YWwgPSBvY3RhbC5zbGljZSgwLCAtMSk7XG4gICAgICAgIGlmIChvY3RhbCA9PT0gXCIwXCIpIG9jdGFsID0gbnVsbDtcbiAgICAgICAgKyt0b2tQb3M7XG4gICAgICAgIGlmIChvY3RhbCkge1xuICAgICAgICAgIGlmIChzdHJpY3QpIHJhaXNlKHRva1BvcyAtIDIsIFwiT2N0YWwgbGl0ZXJhbCBpbiBzdHJpY3QgbW9kZVwiKTtcbiAgICAgICAgICBvdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChvY3RhbCwgOCkpO1xuICAgICAgICAgIHRva1BvcyArPSBvY3RhbC5sZW5ndGggLSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN3aXRjaCAoY2gpIHtcbiAgICAgICAgICBjYXNlIDExMDogb3V0ICs9IFwiXFxuXCI7IGJyZWFrOyAvLyAnbicgLT4gJ1xcbidcbiAgICAgICAgICBjYXNlIDExNDogb3V0ICs9IFwiXFxyXCI7IGJyZWFrOyAvLyAncicgLT4gJ1xccidcbiAgICAgICAgICBjYXNlIDEyMDogb3V0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUocmVhZEhleENoYXIoMikpOyBicmVhazsgLy8gJ3gnXG4gICAgICAgICAgY2FzZSAxMTc6IG91dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHJlYWRIZXhDaGFyKDQpKTsgYnJlYWs7IC8vICd1J1xuICAgICAgICAgIGNhc2UgODU6IG91dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHJlYWRIZXhDaGFyKDgpKTsgYnJlYWs7IC8vICdVJ1xuICAgICAgICAgIGNhc2UgMTE2OiBvdXQgKz0gXCJcXHRcIjsgYnJlYWs7IC8vICd0JyAtPiAnXFx0J1xuICAgICAgICAgIGNhc2UgOTg6IG91dCArPSBcIlxcYlwiOyBicmVhazsgLy8gJ2InIC0+ICdcXGInXG4gICAgICAgICAgY2FzZSAxMTg6IG91dCArPSBcIlxcdTAwMGJcIjsgYnJlYWs7IC8vICd2JyAtPiAnXFx1MDAwYidcbiAgICAgICAgICBjYXNlIDEwMjogb3V0ICs9IFwiXFxmXCI7IGJyZWFrOyAvLyAnZicgLT4gJ1xcZidcbiAgICAgICAgICBjYXNlIDQ4OiBvdXQgKz0gXCJcXDBcIjsgYnJlYWs7IC8vIDAgLT4gJ1xcMCdcbiAgICAgICAgICBjYXNlIDEzOiBpZiAoaW5wdXQuY2hhckNvZGVBdCh0b2tQb3MpID09PSAxMCkgKyt0b2tQb3M7IC8vICdcXHJcXG4nXG4gICAgICAgICAgY2FzZSAxMDogLy8gJyBcXG4nXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5sb2NhdGlvbnMpIHsgdG9rTGluZVN0YXJ0ID0gdG9rUG9zOyArK3Rva0N1ckxpbmU7IH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6IG91dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNoKTsgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoY2ggPT09IDEzIHx8IGNoID09PSAxMCB8fCBjaCA9PT0gODIzMiB8fCBjaCA9PT0gODIzMykgcmFpc2UodG9rU3RhcnQsIFwiVW50ZXJtaW5hdGVkIHN0cmluZyBjb25zdGFudFwiKTtcbiAgICAgICAgb3V0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoY2gpOyAvLyAnXFwnXG4gICAgICAgICsrdG9rUG9zO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFVzZWQgdG8gcmVhZCBjaGFyYWN0ZXIgZXNjYXBlIHNlcXVlbmNlcyAoJ1xceCcsICdcXHUnLCAnXFxVJykuXG5cbiAgZnVuY3Rpb24gcmVhZEhleENoYXIobGVuKSB7XG4gICAgdmFyIG4gPSByZWFkSW50KDE2LCBsZW4pO1xuICAgIGlmIChuID09PSBudWxsKSByYWlzZSh0b2tTdGFydCwgXCJCYWQgY2hhcmFjdGVyIGVzY2FwZSBzZXF1ZW5jZVwiKTtcbiAgICByZXR1cm4gbjtcbiAgfVxuXG4gIC8vIFVzZWQgdG8gc2lnbmFsIHRvIGNhbGxlcnMgb2YgYHJlYWRXb3JkMWAgd2hldGhlciB0aGUgd29yZFxuICAvLyBjb250YWluZWQgYW55IGVzY2FwZSBzZXF1ZW5jZXMuIFRoaXMgaXMgbmVlZGVkIGJlY2F1c2Ugd29yZHMgd2l0aFxuICAvLyBlc2NhcGUgc2VxdWVuY2VzIG11c3Qgbm90IGJlIGludGVycHJldGVkIGFzIGtleXdvcmRzLlxuXG4gIHZhciBjb250YWluc0VzYztcblxuICAvLyBSZWFkIGFuIGlkZW50aWZpZXIsIGFuZCByZXR1cm4gaXQgYXMgYSBzdHJpbmcuIFNldHMgYGNvbnRhaW5zRXNjYFxuICAvLyB0byB3aGV0aGVyIHRoZSB3b3JkIGNvbnRhaW5lZCBhICdcXHUnIGVzY2FwZS5cbiAgLy9cbiAgLy8gT25seSBidWlsZHMgdXAgdGhlIHdvcmQgY2hhcmFjdGVyLWJ5LWNoYXJhY3RlciB3aGVuIGl0IGFjdHVhbGx5XG4gIC8vIGNvbnRhaW5lZHMgYW4gZXNjYXBlLCBhcyBhIG1pY3JvLW9wdGltaXphdGlvbi5cblxuICBmdW5jdGlvbiByZWFkV29yZDEoKSB7XG4gICAgY29udGFpbnNFc2MgPSBmYWxzZTtcbiAgICB2YXIgd29yZCwgZmlyc3QgPSB0cnVlLCBzdGFydCA9IHRva1BvcztcbiAgICBmb3IgKDs7KSB7XG4gICAgICB2YXIgY2ggPSBpbnB1dC5jaGFyQ29kZUF0KHRva1Bvcyk7XG4gICAgICBpZiAoaXNJZGVudGlmaWVyQ2hhcihjaCkpIHtcbiAgICAgICAgaWYgKGNvbnRhaW5zRXNjKSB3b3JkICs9IGlucHV0LmNoYXJBdCh0b2tQb3MpO1xuICAgICAgICArK3Rva1BvcztcbiAgICAgIH0gZWxzZSBpZiAoY2ggPT09IDkyKSB7IC8vIFwiXFxcIlxuICAgICAgICBpZiAoIWNvbnRhaW5zRXNjKSB3b3JkID0gaW5wdXQuc2xpY2Uoc3RhcnQsIHRva1Bvcyk7XG4gICAgICAgIGNvbnRhaW5zRXNjID0gdHJ1ZTtcbiAgICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQoKyt0b2tQb3MpICE9IDExNykgLy8gXCJ1XCJcbiAgICAgICAgICByYWlzZSh0b2tQb3MsIFwiRXhwZWN0aW5nIFVuaWNvZGUgZXNjYXBlIHNlcXVlbmNlIFxcXFx1WFhYWFwiKTtcbiAgICAgICAgKyt0b2tQb3M7XG4gICAgICAgIHZhciBlc2MgPSByZWFkSGV4Q2hhcig0KTtcbiAgICAgICAgdmFyIGVzY1N0ciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZXNjKTtcbiAgICAgICAgaWYgKCFlc2NTdHIpIHJhaXNlKHRva1BvcyAtIDEsIFwiSW52YWxpZCBVbmljb2RlIGVzY2FwZVwiKTtcbiAgICAgICAgaWYgKCEoZmlyc3QgPyBpc0lkZW50aWZpZXJTdGFydChlc2MpIDogaXNJZGVudGlmaWVyQ2hhcihlc2MpKSlcbiAgICAgICAgICByYWlzZSh0b2tQb3MgLSA0LCBcIkludmFsaWQgVW5pY29kZSBlc2NhcGVcIik7XG4gICAgICAgIHdvcmQgKz0gZXNjU3RyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBmaXJzdCA9IGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gY29udGFpbnNFc2MgPyB3b3JkIDogaW5wdXQuc2xpY2Uoc3RhcnQsIHRva1Bvcyk7XG4gIH1cblxuICAvLyBSZWFkIGFuIGlkZW50aWZpZXIgb3Iga2V5d29yZCB0b2tlbi4gV2lsbCBjaGVjayBmb3IgcmVzZXJ2ZWRcbiAgLy8gd29yZHMgd2hlbiBuZWNlc3NhcnkuXG5cbiAgZnVuY3Rpb24gcmVhZFdvcmQoKSB7XG4gICAgdmFyIHdvcmQgPSByZWFkV29yZDEoKTtcbiAgICB2YXIgdHlwZSA9IF9uYW1lO1xuICAgIGlmICghY29udGFpbnNFc2MpIHtcbiAgICAgIGlmIChpc0tleXdvcmQod29yZCkpIHR5cGUgPSBrZXl3b3JkVHlwZXNbd29yZF07XG4gICAgICBlbHNlIGlmIChvcHRpb25zLmZvcmJpZFJlc2VydmVkICYmXG4gICAgICAgICAgICAgICAob3B0aW9ucy5lY21hVmVyc2lvbiA9PT0gMyA/IGlzUmVzZXJ2ZWRXb3JkMyA6IGlzUmVzZXJ2ZWRXb3JkNSkod29yZCkgfHxcbiAgICAgICAgICAgICAgIHN0cmljdCAmJiBpc1N0cmljdFJlc2VydmVkV29yZCh3b3JkKSlcbiAgICAgICAgcmFpc2UodG9rU3RhcnQsIFwiVGhlIGtleXdvcmQgJ1wiICsgd29yZCArIFwiJyBpcyByZXNlcnZlZFwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGZpbmlzaFRva2VuKHR5cGUsIHdvcmQpO1xuICB9XG5cbiAgLy8gIyMgUGFyc2VyXG5cbiAgLy8gQSByZWN1cnNpdmUgZGVzY2VudCBwYXJzZXIgb3BlcmF0ZXMgYnkgZGVmaW5pbmcgZnVuY3Rpb25zIGZvciBhbGxcbiAgLy8gc3ludGFjdGljIGVsZW1lbnRzLCBhbmQgcmVjdXJzaXZlbHkgY2FsbGluZyB0aG9zZSwgZWFjaCBmdW5jdGlvblxuICAvLyBhZHZhbmNpbmcgdGhlIGlucHV0IHN0cmVhbSBhbmQgcmV0dXJuaW5nIGFuIEFTVCBub2RlLiBQcmVjZWRlbmNlXG4gIC8vIG9mIGNvbnN0cnVjdHMgKGZvciBleGFtcGxlLCB0aGUgZmFjdCB0aGF0IGAheFsxXWAgbWVhbnMgYCEoeFsxXSlgXG4gIC8vIGluc3RlYWQgb2YgYCgheClbMV1gIGlzIGhhbmRsZWQgYnkgdGhlIGZhY3QgdGhhdCB0aGUgcGFyc2VyXG4gIC8vIGZ1bmN0aW9uIHRoYXQgcGFyc2VzIHVuYXJ5IHByZWZpeCBvcGVyYXRvcnMgaXMgY2FsbGVkIGZpcnN0LCBhbmRcbiAgLy8gaW4gdHVybiBjYWxscyB0aGUgZnVuY3Rpb24gdGhhdCBwYXJzZXMgYFtdYCBzdWJzY3JpcHRzIOKAlCB0aGF0XG4gIC8vIHdheSwgaXQnbGwgcmVjZWl2ZSB0aGUgbm9kZSBmb3IgYHhbMV1gIGFscmVhZHkgcGFyc2VkLCBhbmQgd3JhcHNcbiAgLy8gKnRoYXQqIGluIHRoZSB1bmFyeSBvcGVyYXRvciBub2RlLlxuICAvL1xuICAvLyBBY29ybiB1c2VzIGFuIFtvcGVyYXRvciBwcmVjZWRlbmNlIHBhcnNlcl1bb3BwXSB0byBoYW5kbGUgYmluYXJ5XG4gIC8vIG9wZXJhdG9yIHByZWNlZGVuY2UsIGJlY2F1c2UgaXQgaXMgbXVjaCBtb3JlIGNvbXBhY3QgdGhhbiB1c2luZ1xuICAvLyB0aGUgdGVjaG5pcXVlIG91dGxpbmVkIGFib3ZlLCB3aGljaCB1c2VzIGRpZmZlcmVudCwgbmVzdGluZ1xuICAvLyBmdW5jdGlvbnMgdG8gc3BlY2lmeSBwcmVjZWRlbmNlLCBmb3IgYWxsIG9mIHRoZSB0ZW4gYmluYXJ5XG4gIC8vIHByZWNlZGVuY2UgbGV2ZWxzIHRoYXQgSmF2YVNjcmlwdCBkZWZpbmVzLlxuICAvL1xuICAvLyBbb3BwXTogaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9PcGVyYXRvci1wcmVjZWRlbmNlX3BhcnNlclxuXG4gIC8vICMjIyBQYXJzZXIgdXRpbGl0aWVzXG5cbiAgLy8gQ29udGludWUgdG8gdGhlIG5leHQgdG9rZW4uXG5cbiAgZnVuY3Rpb24gbmV4dCgpIHtcbiAgICBsYXN0U3RhcnQgPSB0b2tTdGFydDtcbiAgICBsYXN0RW5kID0gdG9rRW5kO1xuICAgIGxhc3RFbmRMb2MgPSB0b2tFbmRMb2M7XG4gICAgcmVhZFRva2VuKCk7XG4gIH1cblxuICAvLyBFbnRlciBzdHJpY3QgbW9kZS4gUmUtcmVhZHMgdGhlIG5leHQgdG9rZW4gdG8gcGxlYXNlIHBlZGFudGljXG4gIC8vIHRlc3RzIChcInVzZSBzdHJpY3RcIjsgMDEwOyAtLSBzaG91bGQgZmFpbCkuXG5cbiAgZnVuY3Rpb24gc2V0U3RyaWN0KHN0cmN0KSB7XG4gICAgc3RyaWN0ID0gc3RyY3Q7XG4gICAgdG9rUG9zID0gbGFzdEVuZDtcbiAgICBpZiAob3B0aW9ucy5sb2NhdGlvbnMpIHtcbiAgICAgIHdoaWxlICh0b2tQb3MgPCB0b2tMaW5lU3RhcnQpIHtcbiAgICAgICAgdG9rTGluZVN0YXJ0ID0gaW5wdXQubGFzdEluZGV4T2YoXCJcXG5cIiwgdG9rTGluZVN0YXJ0IC0gMikgKyAxO1xuICAgICAgICAtLXRva0N1ckxpbmU7XG4gICAgICB9XG4gICAgfVxuICAgIHNraXBTcGFjZSgpO1xuICAgIHJlYWRUb2tlbigpO1xuICB9XG5cbiAgLy8gU3RhcnQgYW4gQVNUIG5vZGUsIGF0dGFjaGluZyBhIHN0YXJ0IG9mZnNldC5cblxuICBmdW5jdGlvbiBub2RlX3QoKSB7XG4gICAgdGhpcy50eXBlID0gbnVsbDtcbiAgICB0aGlzLnN0YXJ0ID0gdG9rU3RhcnQ7XG4gICAgdGhpcy5lbmQgPSBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gbm9kZV9sb2NfdCgpIHtcbiAgICB0aGlzLnN0YXJ0ID0gdG9rU3RhcnRMb2M7XG4gICAgdGhpcy5lbmQgPSBudWxsO1xuICAgIGlmIChzb3VyY2VGaWxlICE9PSBudWxsKSB0aGlzLnNvdXJjZSA9IHNvdXJjZUZpbGU7XG4gIH1cblxuICBmdW5jdGlvbiBzdGFydE5vZGUoKSB7XG4gICAgdmFyIG5vZGUgPSBuZXcgbm9kZV90KCk7XG4gICAgaWYgKG9wdGlvbnMubG9jYXRpb25zKVxuICAgICAgbm9kZS5sb2MgPSBuZXcgbm9kZV9sb2NfdCgpO1xuICAgIGlmIChvcHRpb25zLmRpcmVjdFNvdXJjZUZpbGUpXG4gICAgICBub2RlLnNvdXJjZUZpbGUgPSBvcHRpb25zLmRpcmVjdFNvdXJjZUZpbGU7XG4gICAgaWYgKG9wdGlvbnMucmFuZ2VzKVxuICAgICAgbm9kZS5yYW5nZSA9IFt0b2tTdGFydCwgMF07XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICAvLyBTdGFydCBhIG5vZGUgd2hvc2Ugc3RhcnQgb2Zmc2V0IGluZm9ybWF0aW9uIHNob3VsZCBiZSBiYXNlZCBvblxuICAvLyB0aGUgc3RhcnQgb2YgYW5vdGhlciBub2RlLiBGb3IgZXhhbXBsZSwgYSBiaW5hcnkgb3BlcmF0b3Igbm9kZSBpc1xuICAvLyBvbmx5IHN0YXJ0ZWQgYWZ0ZXIgaXRzIGxlZnQtaGFuZCBzaWRlIGhhcyBhbHJlYWR5IGJlZW4gcGFyc2VkLlxuXG4gIGZ1bmN0aW9uIHN0YXJ0Tm9kZUZyb20ob3RoZXIpIHtcbiAgICB2YXIgbm9kZSA9IG5ldyBub2RlX3QoKTtcbiAgICBub2RlLnN0YXJ0ID0gb3RoZXIuc3RhcnQ7XG4gICAgaWYgKG9wdGlvbnMubG9jYXRpb25zKSB7XG4gICAgICBub2RlLmxvYyA9IG5ldyBub2RlX2xvY190KCk7XG4gICAgICBub2RlLmxvYy5zdGFydCA9IG90aGVyLmxvYy5zdGFydDtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMucmFuZ2VzKVxuICAgICAgbm9kZS5yYW5nZSA9IFtvdGhlci5yYW5nZVswXSwgMF07XG5cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIC8vIEZpbmlzaCBhbiBBU1Qgbm9kZSwgYWRkaW5nIGB0eXBlYCBhbmQgYGVuZGAgcHJvcGVydGllcy5cblxuICBmdW5jdGlvbiBmaW5pc2hOb2RlKG5vZGUsIHR5cGUpIHtcbiAgICBub2RlLnR5cGUgPSB0eXBlO1xuICAgIG5vZGUuZW5kID0gbGFzdEVuZDtcbiAgICBpZiAob3B0aW9ucy5sb2NhdGlvbnMpXG4gICAgICBub2RlLmxvYy5lbmQgPSBsYXN0RW5kTG9jO1xuICAgIGlmIChvcHRpb25zLnJhbmdlcylcbiAgICAgIG5vZGUucmFuZ2VbMV0gPSBsYXN0RW5kO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgLy8gVGVzdCB3aGV0aGVyIGEgc3RhdGVtZW50IG5vZGUgaXMgdGhlIHN0cmluZyBsaXRlcmFsIGBcInVzZSBzdHJpY3RcImAuXG5cbiAgZnVuY3Rpb24gaXNVc2VTdHJpY3Qoc3RtdCkge1xuICAgIHJldHVybiBvcHRpb25zLmVjbWFWZXJzaW9uID49IDUgJiYgc3RtdC50eXBlID09PSBcIkV4cHJlc3Npb25TdGF0ZW1lbnRcIiAmJlxuICAgICAgc3RtdC5leHByZXNzaW9uLnR5cGUgPT09IFwiTGl0ZXJhbFwiICYmIHN0bXQuZXhwcmVzc2lvbi52YWx1ZSA9PT0gXCJ1c2Ugc3RyaWN0XCI7XG4gIH1cblxuICAvLyBQcmVkaWNhdGUgdGhhdCB0ZXN0cyB3aGV0aGVyIHRoZSBuZXh0IHRva2VuIGlzIG9mIHRoZSBnaXZlblxuICAvLyB0eXBlLCBhbmQgaWYgeWVzLCBjb25zdW1lcyBpdCBhcyBhIHNpZGUgZWZmZWN0LlxuXG4gIGZ1bmN0aW9uIGVhdCh0eXBlKSB7XG4gICAgaWYgKHRva1R5cGUgPT09IHR5cGUpIHtcbiAgICAgIG5leHQoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8vIFRlc3Qgd2hldGhlciBhIHNlbWljb2xvbiBjYW4gYmUgaW5zZXJ0ZWQgYXQgdGhlIGN1cnJlbnQgcG9zaXRpb24uXG5cbiAgZnVuY3Rpb24gY2FuSW5zZXJ0U2VtaWNvbG9uKCkge1xuICAgIHJldHVybiAhb3B0aW9ucy5zdHJpY3RTZW1pY29sb25zICYmXG4gICAgICAodG9rVHlwZSA9PT0gX2VvZiB8fCB0b2tUeXBlID09PSBfYnJhY2VSIHx8IG5ld2xpbmUudGVzdChpbnB1dC5zbGljZShsYXN0RW5kLCB0b2tTdGFydCkpKTtcbiAgfVxuXG4gIC8vIENvbnN1bWUgYSBzZW1pY29sb24sIG9yLCBmYWlsaW5nIHRoYXQsIHNlZSBpZiB3ZSBhcmUgYWxsb3dlZCB0b1xuICAvLyBwcmV0ZW5kIHRoYXQgdGhlcmUgaXMgYSBzZW1pY29sb24gYXQgdGhpcyBwb3NpdGlvbi5cblxuICBmdW5jdGlvbiBzZW1pY29sb24oKSB7XG4gICAgaWYgKCFlYXQoX3NlbWkpICYmICFjYW5JbnNlcnRTZW1pY29sb24oKSkgdW5leHBlY3RlZCgpO1xuICB9XG5cbiAgLy8gRXhwZWN0IGEgdG9rZW4gb2YgYSBnaXZlbiB0eXBlLiBJZiBmb3VuZCwgY29uc3VtZSBpdCwgb3RoZXJ3aXNlLFxuICAvLyByYWlzZSBhbiB1bmV4cGVjdGVkIHRva2VuIGVycm9yLlxuXG4gIGZ1bmN0aW9uIGV4cGVjdCh0eXBlKSB7XG4gICAgaWYgKHRva1R5cGUgPT09IHR5cGUpIG5leHQoKTtcbiAgICBlbHNlIHVuZXhwZWN0ZWQoKTtcbiAgfVxuXG4gIC8vIFJhaXNlIGFuIHVuZXhwZWN0ZWQgdG9rZW4gZXJyb3IuXG5cbiAgZnVuY3Rpb24gdW5leHBlY3RlZCgpIHtcbiAgICByYWlzZSh0b2tTdGFydCwgXCJVbmV4cGVjdGVkIHRva2VuXCIpO1xuICB9XG5cbiAgLy8gVmVyaWZ5IHRoYXQgYSBub2RlIGlzIGFuIGx2YWwg4oCUIHNvbWV0aGluZyB0aGF0IGNhbiBiZSBhc3NpZ25lZFxuICAvLyB0by5cblxuICBmdW5jdGlvbiBjaGVja0xWYWwoZXhwcikge1xuICAgIGlmIChleHByLnR5cGUgIT09IFwiSWRlbnRpZmllclwiICYmIGV4cHIudHlwZSAhPT0gXCJNZW1iZXJFeHByZXNzaW9uXCIpXG4gICAgICByYWlzZShleHByLnN0YXJ0LCBcIkFzc2lnbmluZyB0byBydmFsdWVcIik7XG4gICAgaWYgKHN0cmljdCAmJiBleHByLnR5cGUgPT09IFwiSWRlbnRpZmllclwiICYmIGlzU3RyaWN0QmFkSWRXb3JkKGV4cHIubmFtZSkpXG4gICAgICByYWlzZShleHByLnN0YXJ0LCBcIkFzc2lnbmluZyB0byBcIiArIGV4cHIubmFtZSArIFwiIGluIHN0cmljdCBtb2RlXCIpO1xuICB9XG5cbiAgLy8gIyMjIFN0YXRlbWVudCBwYXJzaW5nXG5cbiAgLy8gUGFyc2UgYSBwcm9ncmFtLiBJbml0aWFsaXplcyB0aGUgcGFyc2VyLCByZWFkcyBhbnkgbnVtYmVyIG9mXG4gIC8vIHN0YXRlbWVudHMsIGFuZCB3cmFwcyB0aGVtIGluIGEgUHJvZ3JhbSBub2RlLiAgT3B0aW9uYWxseSB0YWtlcyBhXG4gIC8vIGBwcm9ncmFtYCBhcmd1bWVudC4gIElmIHByZXNlbnQsIHRoZSBzdGF0ZW1lbnRzIHdpbGwgYmUgYXBwZW5kZWRcbiAgLy8gdG8gaXRzIGJvZHkgaW5zdGVhZCBvZiBjcmVhdGluZyBhIG5ldyBub2RlLlxuXG4gIGZ1bmN0aW9uIHBhcnNlVG9wTGV2ZWwocHJvZ3JhbSkge1xuICAgIGxhc3RTdGFydCA9IGxhc3RFbmQgPSB0b2tQb3M7XG4gICAgaWYgKG9wdGlvbnMubG9jYXRpb25zKSBsYXN0RW5kTG9jID0gbmV3IGxpbmVfbG9jX3Q7XG4gICAgaW5GdW5jdGlvbiA9IHN0cmljdCA9IG51bGw7XG4gICAgbGFiZWxzID0gW107XG4gICAgcmVhZFRva2VuKCk7XG5cbiAgICB2YXIgbm9kZSA9IHByb2dyYW0gfHwgc3RhcnROb2RlKCksIGZpcnN0ID0gdHJ1ZTtcbiAgICBpZiAoIXByb2dyYW0pIG5vZGUuYm9keSA9IFtdO1xuICAgIHdoaWxlICh0b2tUeXBlICE9PSBfZW9mKSB7XG4gICAgICB2YXIgc3RtdCA9IHBhcnNlU3RhdGVtZW50KCk7XG4gICAgICBub2RlLmJvZHkucHVzaChzdG10KTtcbiAgICAgIGlmIChmaXJzdCAmJiBpc1VzZVN0cmljdChzdG10KSkgc2V0U3RyaWN0KHRydWUpO1xuICAgICAgZmlyc3QgPSBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIGZpbmlzaE5vZGUobm9kZSwgXCJQcm9ncmFtXCIpO1xuICB9XG5cbiAgdmFyIGxvb3BMYWJlbCA9IHtraW5kOiBcImxvb3BcIn0sIHN3aXRjaExhYmVsID0ge2tpbmQ6IFwic3dpdGNoXCJ9O1xuXG4gIC8vIFBhcnNlIGEgc2luZ2xlIHN0YXRlbWVudC5cbiAgLy9cbiAgLy8gSWYgZXhwZWN0aW5nIGEgc3RhdGVtZW50IGFuZCBmaW5kaW5nIGEgc2xhc2ggb3BlcmF0b3IsIHBhcnNlIGFcbiAgLy8gcmVndWxhciBleHByZXNzaW9uIGxpdGVyYWwuIFRoaXMgaXMgdG8gaGFuZGxlIGNhc2VzIGxpa2VcbiAgLy8gYGlmIChmb28pIC9ibGFoLy5leGVjKGZvbyk7YCwgd2hlcmUgbG9va2luZyBhdCB0aGUgcHJldmlvdXMgdG9rZW5cbiAgLy8gZG9lcyBub3QgaGVscC5cblxuICBmdW5jdGlvbiBwYXJzZVN0YXRlbWVudCgpIHtcbiAgICBpZiAodG9rVHlwZSA9PT0gX3NsYXNoIHx8IHRva1R5cGUgPT09IF9hc3NpZ24gJiYgdG9rVmFsID09IFwiLz1cIilcbiAgICAgIHJlYWRUb2tlbih0cnVlKTtcblxuICAgIHZhciBzdGFydHR5cGUgPSB0b2tUeXBlLCBub2RlID0gc3RhcnROb2RlKCk7XG5cbiAgICAvLyBNb3N0IHR5cGVzIG9mIHN0YXRlbWVudHMgYXJlIHJlY29nbml6ZWQgYnkgdGhlIGtleXdvcmQgdGhleVxuICAgIC8vIHN0YXJ0IHdpdGguIE1hbnkgYXJlIHRyaXZpYWwgdG8gcGFyc2UsIHNvbWUgcmVxdWlyZSBhIGJpdCBvZlxuICAgIC8vIGNvbXBsZXhpdHkuXG5cbiAgICBzd2l0Y2ggKHN0YXJ0dHlwZSkge1xuICAgIGNhc2UgX2JyZWFrOiBjYXNlIF9jb250aW51ZTpcbiAgICAgIG5leHQoKTtcbiAgICAgIHZhciBpc0JyZWFrID0gc3RhcnR0eXBlID09PSBfYnJlYWs7XG4gICAgICBpZiAoZWF0KF9zZW1pKSB8fCBjYW5JbnNlcnRTZW1pY29sb24oKSkgbm9kZS5sYWJlbCA9IG51bGw7XG4gICAgICBlbHNlIGlmICh0b2tUeXBlICE9PSBfbmFtZSkgdW5leHBlY3RlZCgpO1xuICAgICAgZWxzZSB7XG4gICAgICAgIG5vZGUubGFiZWwgPSBwYXJzZUlkZW50KCk7XG4gICAgICAgIHNlbWljb2xvbigpO1xuICAgICAgfVxuXG4gICAgICAvLyBWZXJpZnkgdGhhdCB0aGVyZSBpcyBhbiBhY3R1YWwgZGVzdGluYXRpb24gdG8gYnJlYWsgb3JcbiAgICAgIC8vIGNvbnRpbnVlIHRvLlxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYWJlbHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIGxhYiA9IGxhYmVsc1tpXTtcbiAgICAgICAgaWYgKG5vZGUubGFiZWwgPT0gbnVsbCB8fCBsYWIubmFtZSA9PT0gbm9kZS5sYWJlbC5uYW1lKSB7XG4gICAgICAgICAgaWYgKGxhYi5raW5kICE9IG51bGwgJiYgKGlzQnJlYWsgfHwgbGFiLmtpbmQgPT09IFwibG9vcFwiKSkgYnJlYWs7XG4gICAgICAgICAgaWYgKG5vZGUubGFiZWwgJiYgaXNCcmVhaykgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpID09PSBsYWJlbHMubGVuZ3RoKSByYWlzZShub2RlLnN0YXJ0LCBcIlVuc3ludGFjdGljIFwiICsgc3RhcnR0eXBlLmtleXdvcmQpO1xuICAgICAgcmV0dXJuIGZpbmlzaE5vZGUobm9kZSwgaXNCcmVhayA/IFwiQnJlYWtTdGF0ZW1lbnRcIiA6IFwiQ29udGludWVTdGF0ZW1lbnRcIik7XG5cbiAgICBjYXNlIF9kZWJ1Z2dlcjpcbiAgICAgIG5leHQoKTtcbiAgICAgIHNlbWljb2xvbigpO1xuICAgICAgcmV0dXJuIGZpbmlzaE5vZGUobm9kZSwgXCJEZWJ1Z2dlclN0YXRlbWVudFwiKTtcblxuICAgIGNhc2UgX2RvOlxuICAgICAgbmV4dCgpO1xuICAgICAgbGFiZWxzLnB1c2gobG9vcExhYmVsKTtcbiAgICAgIG5vZGUuYm9keSA9IHBhcnNlU3RhdGVtZW50KCk7XG4gICAgICBsYWJlbHMucG9wKCk7XG4gICAgICBleHBlY3QoX3doaWxlKTtcbiAgICAgIG5vZGUudGVzdCA9IHBhcnNlUGFyZW5FeHByZXNzaW9uKCk7XG4gICAgICBzZW1pY29sb24oKTtcbiAgICAgIHJldHVybiBmaW5pc2hOb2RlKG5vZGUsIFwiRG9XaGlsZVN0YXRlbWVudFwiKTtcblxuICAgICAgLy8gRGlzYW1iaWd1YXRpbmcgYmV0d2VlbiBhIGBmb3JgIGFuZCBhIGBmb3JgL2BpbmAgbG9vcCBpc1xuICAgICAgLy8gbm9uLXRyaXZpYWwuIEJhc2ljYWxseSwgd2UgaGF2ZSB0byBwYXJzZSB0aGUgaW5pdCBgdmFyYFxuICAgICAgLy8gc3RhdGVtZW50IG9yIGV4cHJlc3Npb24sIGRpc2FsbG93aW5nIHRoZSBgaW5gIG9wZXJhdG9yIChzZWVcbiAgICAgIC8vIHRoZSBzZWNvbmQgcGFyYW1ldGVyIHRvIGBwYXJzZUV4cHJlc3Npb25gKSwgYW5kIHRoZW4gY2hlY2tcbiAgICAgIC8vIHdoZXRoZXIgdGhlIG5leHQgdG9rZW4gaXMgYGluYC4gV2hlbiB0aGVyZSBpcyBubyBpbml0IHBhcnRcbiAgICAgIC8vIChzZW1pY29sb24gaW1tZWRpYXRlbHkgYWZ0ZXIgdGhlIG9wZW5pbmcgcGFyZW50aGVzaXMpLCBpdCBpc1xuICAgICAgLy8gYSByZWd1bGFyIGBmb3JgIGxvb3AuXG5cbiAgICBjYXNlIF9mb3I6XG4gICAgICBuZXh0KCk7XG4gICAgICBsYWJlbHMucHVzaChsb29wTGFiZWwpO1xuICAgICAgZXhwZWN0KF9wYXJlbkwpO1xuICAgICAgaWYgKHRva1R5cGUgPT09IF9zZW1pKSByZXR1cm4gcGFyc2VGb3Iobm9kZSwgbnVsbCk7XG4gICAgICBpZiAodG9rVHlwZSA9PT0gX3Zhcikge1xuICAgICAgICB2YXIgaW5pdCA9IHN0YXJ0Tm9kZSgpO1xuICAgICAgICBuZXh0KCk7XG4gICAgICAgIHBhcnNlVmFyKGluaXQsIHRydWUpO1xuICAgICAgICBmaW5pc2hOb2RlKGluaXQsIFwiVmFyaWFibGVEZWNsYXJhdGlvblwiKTtcbiAgICAgICAgaWYgKGluaXQuZGVjbGFyYXRpb25zLmxlbmd0aCA9PT0gMSAmJiBlYXQoX2luKSlcbiAgICAgICAgICByZXR1cm4gcGFyc2VGb3JJbihub2RlLCBpbml0KTtcbiAgICAgICAgcmV0dXJuIHBhcnNlRm9yKG5vZGUsIGluaXQpO1xuICAgICAgfVxuICAgICAgdmFyIGluaXQgPSBwYXJzZUV4cHJlc3Npb24oZmFsc2UsIHRydWUpO1xuICAgICAgaWYgKGVhdChfaW4pKSB7Y2hlY2tMVmFsKGluaXQpOyByZXR1cm4gcGFyc2VGb3JJbihub2RlLCBpbml0KTt9XG4gICAgICByZXR1cm4gcGFyc2VGb3Iobm9kZSwgaW5pdCk7XG5cbiAgICBjYXNlIF9mdW5jdGlvbjpcbiAgICAgIG5leHQoKTtcbiAgICAgIHJldHVybiBwYXJzZUZ1bmN0aW9uKG5vZGUsIHRydWUpO1xuXG4gICAgY2FzZSBfaWY6XG4gICAgICBuZXh0KCk7XG4gICAgICBub2RlLnRlc3QgPSBwYXJzZVBhcmVuRXhwcmVzc2lvbigpO1xuICAgICAgbm9kZS5jb25zZXF1ZW50ID0gcGFyc2VTdGF0ZW1lbnQoKTtcbiAgICAgIG5vZGUuYWx0ZXJuYXRlID0gZWF0KF9lbHNlKSA/IHBhcnNlU3RhdGVtZW50KCkgOiBudWxsO1xuICAgICAgcmV0dXJuIGZpbmlzaE5vZGUobm9kZSwgXCJJZlN0YXRlbWVudFwiKTtcblxuICAgIGNhc2UgX3JldHVybjpcbiAgICAgIGlmICghaW5GdW5jdGlvbikgcmFpc2UodG9rU3RhcnQsIFwiJ3JldHVybicgb3V0c2lkZSBvZiBmdW5jdGlvblwiKTtcbiAgICAgIG5leHQoKTtcblxuICAgICAgLy8gSW4gYHJldHVybmAgKGFuZCBgYnJlYWtgL2Bjb250aW51ZWApLCB0aGUga2V5d29yZHMgd2l0aFxuICAgICAgLy8gb3B0aW9uYWwgYXJndW1lbnRzLCB3ZSBlYWdlcmx5IGxvb2sgZm9yIGEgc2VtaWNvbG9uIG9yIHRoZVxuICAgICAgLy8gcG9zc2liaWxpdHkgdG8gaW5zZXJ0IG9uZS5cblxuICAgICAgaWYgKGVhdChfc2VtaSkgfHwgY2FuSW5zZXJ0U2VtaWNvbG9uKCkpIG5vZGUuYXJndW1lbnQgPSBudWxsO1xuICAgICAgZWxzZSB7IG5vZGUuYXJndW1lbnQgPSBwYXJzZUV4cHJlc3Npb24oKTsgc2VtaWNvbG9uKCk7IH1cbiAgICAgIHJldHVybiBmaW5pc2hOb2RlKG5vZGUsIFwiUmV0dXJuU3RhdGVtZW50XCIpO1xuXG4gICAgY2FzZSBfc3dpdGNoOlxuICAgICAgbmV4dCgpO1xuICAgICAgbm9kZS5kaXNjcmltaW5hbnQgPSBwYXJzZVBhcmVuRXhwcmVzc2lvbigpO1xuICAgICAgbm9kZS5jYXNlcyA9IFtdO1xuICAgICAgZXhwZWN0KF9icmFjZUwpO1xuICAgICAgbGFiZWxzLnB1c2goc3dpdGNoTGFiZWwpO1xuXG4gICAgICAvLyBTdGF0ZW1lbnRzIHVuZGVyIG11c3QgYmUgZ3JvdXBlZCAoYnkgbGFiZWwpIGluIFN3aXRjaENhc2VcbiAgICAgIC8vIG5vZGVzLiBgY3VyYCBpcyB1c2VkIHRvIGtlZXAgdGhlIG5vZGUgdGhhdCB3ZSBhcmUgY3VycmVudGx5XG4gICAgICAvLyBhZGRpbmcgc3RhdGVtZW50cyB0by5cblxuICAgICAgZm9yICh2YXIgY3VyLCBzYXdEZWZhdWx0OyB0b2tUeXBlICE9IF9icmFjZVI7KSB7XG4gICAgICAgIGlmICh0b2tUeXBlID09PSBfY2FzZSB8fCB0b2tUeXBlID09PSBfZGVmYXVsdCkge1xuICAgICAgICAgIHZhciBpc0Nhc2UgPSB0b2tUeXBlID09PSBfY2FzZTtcbiAgICAgICAgICBpZiAoY3VyKSBmaW5pc2hOb2RlKGN1ciwgXCJTd2l0Y2hDYXNlXCIpO1xuICAgICAgICAgIG5vZGUuY2FzZXMucHVzaChjdXIgPSBzdGFydE5vZGUoKSk7XG4gICAgICAgICAgY3VyLmNvbnNlcXVlbnQgPSBbXTtcbiAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgaWYgKGlzQ2FzZSkgY3VyLnRlc3QgPSBwYXJzZUV4cHJlc3Npb24oKTtcbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzYXdEZWZhdWx0KSByYWlzZShsYXN0U3RhcnQsIFwiTXVsdGlwbGUgZGVmYXVsdCBjbGF1c2VzXCIpOyBzYXdEZWZhdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGN1ci50ZXN0ID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgZXhwZWN0KF9jb2xvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCFjdXIpIHVuZXhwZWN0ZWQoKTtcbiAgICAgICAgICBjdXIuY29uc2VxdWVudC5wdXNoKHBhcnNlU3RhdGVtZW50KCkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoY3VyKSBmaW5pc2hOb2RlKGN1ciwgXCJTd2l0Y2hDYXNlXCIpO1xuICAgICAgbmV4dCgpOyAvLyBDbG9zaW5nIGJyYWNlXG4gICAgICBsYWJlbHMucG9wKCk7XG4gICAgICByZXR1cm4gZmluaXNoTm9kZShub2RlLCBcIlN3aXRjaFN0YXRlbWVudFwiKTtcblxuICAgIGNhc2UgX3Rocm93OlxuICAgICAgbmV4dCgpO1xuICAgICAgaWYgKG5ld2xpbmUudGVzdChpbnB1dC5zbGljZShsYXN0RW5kLCB0b2tTdGFydCkpKVxuICAgICAgICByYWlzZShsYXN0RW5kLCBcIklsbGVnYWwgbmV3bGluZSBhZnRlciB0aHJvd1wiKTtcbiAgICAgIG5vZGUuYXJndW1lbnQgPSBwYXJzZUV4cHJlc3Npb24oKTtcbiAgICAgIHNlbWljb2xvbigpO1xuICAgICAgcmV0dXJuIGZpbmlzaE5vZGUobm9kZSwgXCJUaHJvd1N0YXRlbWVudFwiKTtcblxuICAgIGNhc2UgX3RyeTpcbiAgICAgIG5leHQoKTtcbiAgICAgIG5vZGUuYmxvY2sgPSBwYXJzZUJsb2NrKCk7XG4gICAgICBub2RlLmhhbmRsZXIgPSBudWxsO1xuICAgICAgaWYgKHRva1R5cGUgPT09IF9jYXRjaCkge1xuICAgICAgICB2YXIgY2xhdXNlID0gc3RhcnROb2RlKCk7XG4gICAgICAgIG5leHQoKTtcbiAgICAgICAgZXhwZWN0KF9wYXJlbkwpO1xuICAgICAgICBjbGF1c2UucGFyYW0gPSBwYXJzZUlkZW50KCk7XG4gICAgICAgIGlmIChzdHJpY3QgJiYgaXNTdHJpY3RCYWRJZFdvcmQoY2xhdXNlLnBhcmFtLm5hbWUpKVxuICAgICAgICAgIHJhaXNlKGNsYXVzZS5wYXJhbS5zdGFydCwgXCJCaW5kaW5nIFwiICsgY2xhdXNlLnBhcmFtLm5hbWUgKyBcIiBpbiBzdHJpY3QgbW9kZVwiKTtcbiAgICAgICAgZXhwZWN0KF9wYXJlblIpO1xuICAgICAgICBjbGF1c2UuZ3VhcmQgPSBudWxsO1xuICAgICAgICBjbGF1c2UuYm9keSA9IHBhcnNlQmxvY2soKTtcbiAgICAgICAgbm9kZS5oYW5kbGVyID0gZmluaXNoTm9kZShjbGF1c2UsIFwiQ2F0Y2hDbGF1c2VcIik7XG4gICAgICB9XG4gICAgICBub2RlLmd1YXJkZWRIYW5kbGVycyA9IGVtcHR5O1xuICAgICAgbm9kZS5maW5hbGl6ZXIgPSBlYXQoX2ZpbmFsbHkpID8gcGFyc2VCbG9jaygpIDogbnVsbDtcbiAgICAgIGlmICghbm9kZS5oYW5kbGVyICYmICFub2RlLmZpbmFsaXplcilcbiAgICAgICAgcmFpc2Uobm9kZS5zdGFydCwgXCJNaXNzaW5nIGNhdGNoIG9yIGZpbmFsbHkgY2xhdXNlXCIpO1xuICAgICAgcmV0dXJuIGZpbmlzaE5vZGUobm9kZSwgXCJUcnlTdGF0ZW1lbnRcIik7XG5cbiAgICBjYXNlIF92YXI6XG4gICAgICBuZXh0KCk7XG4gICAgICBwYXJzZVZhcihub2RlKTtcbiAgICAgIHNlbWljb2xvbigpO1xuICAgICAgcmV0dXJuIGZpbmlzaE5vZGUobm9kZSwgXCJWYXJpYWJsZURlY2xhcmF0aW9uXCIpO1xuXG4gICAgY2FzZSBfd2hpbGU6XG4gICAgICBuZXh0KCk7XG4gICAgICBub2RlLnRlc3QgPSBwYXJzZVBhcmVuRXhwcmVzc2lvbigpO1xuICAgICAgbGFiZWxzLnB1c2gobG9vcExhYmVsKTtcbiAgICAgIG5vZGUuYm9keSA9IHBhcnNlU3RhdGVtZW50KCk7XG4gICAgICBsYWJlbHMucG9wKCk7XG4gICAgICByZXR1cm4gZmluaXNoTm9kZShub2RlLCBcIldoaWxlU3RhdGVtZW50XCIpO1xuXG4gICAgY2FzZSBfd2l0aDpcbiAgICAgIGlmIChzdHJpY3QpIHJhaXNlKHRva1N0YXJ0LCBcIid3aXRoJyBpbiBzdHJpY3QgbW9kZVwiKTtcbiAgICAgIG5leHQoKTtcbiAgICAgIG5vZGUub2JqZWN0ID0gcGFyc2VQYXJlbkV4cHJlc3Npb24oKTtcbiAgICAgIG5vZGUuYm9keSA9IHBhcnNlU3RhdGVtZW50KCk7XG4gICAgICByZXR1cm4gZmluaXNoTm9kZShub2RlLCBcIldpdGhTdGF0ZW1lbnRcIik7XG5cbiAgICBjYXNlIF9icmFjZUw6XG4gICAgICByZXR1cm4gcGFyc2VCbG9jaygpO1xuXG4gICAgY2FzZSBfc2VtaTpcbiAgICAgIG5leHQoKTtcbiAgICAgIHJldHVybiBmaW5pc2hOb2RlKG5vZGUsIFwiRW1wdHlTdGF0ZW1lbnRcIik7XG5cbiAgICAgIC8vIElmIHRoZSBzdGF0ZW1lbnQgZG9lcyBub3Qgc3RhcnQgd2l0aCBhIHN0YXRlbWVudCBrZXl3b3JkIG9yIGFcbiAgICAgIC8vIGJyYWNlLCBpdCdzIGFuIEV4cHJlc3Npb25TdGF0ZW1lbnQgb3IgTGFiZWxlZFN0YXRlbWVudC4gV2VcbiAgICAgIC8vIHNpbXBseSBzdGFydCBwYXJzaW5nIGFuIGV4cHJlc3Npb24sIGFuZCBhZnRlcndhcmRzLCBpZiB0aGVcbiAgICAgIC8vIG5leHQgdG9rZW4gaXMgYSBjb2xvbiBhbmQgdGhlIGV4cHJlc3Npb24gd2FzIGEgc2ltcGxlXG4gICAgICAvLyBJZGVudGlmaWVyIG5vZGUsIHdlIHN3aXRjaCB0byBpbnRlcnByZXRpbmcgaXQgYXMgYSBsYWJlbC5cblxuICAgIGRlZmF1bHQ6XG4gICAgICB2YXIgbWF5YmVOYW1lID0gdG9rVmFsLCBleHByID0gcGFyc2VFeHByZXNzaW9uKCk7XG4gICAgICBpZiAoc3RhcnR0eXBlID09PSBfbmFtZSAmJiBleHByLnR5cGUgPT09IFwiSWRlbnRpZmllclwiICYmIGVhdChfY29sb24pKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFiZWxzLmxlbmd0aDsgKytpKVxuICAgICAgICAgIGlmIChsYWJlbHNbaV0ubmFtZSA9PT0gbWF5YmVOYW1lKSByYWlzZShleHByLnN0YXJ0LCBcIkxhYmVsICdcIiArIG1heWJlTmFtZSArIFwiJyBpcyBhbHJlYWR5IGRlY2xhcmVkXCIpO1xuICAgICAgICB2YXIga2luZCA9IHRva1R5cGUuaXNMb29wID8gXCJsb29wXCIgOiB0b2tUeXBlID09PSBfc3dpdGNoID8gXCJzd2l0Y2hcIiA6IG51bGw7XG4gICAgICAgIGxhYmVscy5wdXNoKHtuYW1lOiBtYXliZU5hbWUsIGtpbmQ6IGtpbmR9KTtcbiAgICAgICAgbm9kZS5ib2R5ID0gcGFyc2VTdGF0ZW1lbnQoKTtcbiAgICAgICAgbGFiZWxzLnBvcCgpO1xuICAgICAgICBub2RlLmxhYmVsID0gZXhwcjtcbiAgICAgICAgcmV0dXJuIGZpbmlzaE5vZGUobm9kZSwgXCJMYWJlbGVkU3RhdGVtZW50XCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm9kZS5leHByZXNzaW9uID0gZXhwcjtcbiAgICAgICAgc2VtaWNvbG9uKCk7XG4gICAgICAgIHJldHVybiBmaW5pc2hOb2RlKG5vZGUsIFwiRXhwcmVzc2lvblN0YXRlbWVudFwiKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBVc2VkIGZvciBjb25zdHJ1Y3RzIGxpa2UgYHN3aXRjaGAgYW5kIGBpZmAgdGhhdCBpbnNpc3Qgb25cbiAgLy8gcGFyZW50aGVzZXMgYXJvdW5kIHRoZWlyIGV4cHJlc3Npb24uXG5cbiAgZnVuY3Rpb24gcGFyc2VQYXJlbkV4cHJlc3Npb24oKSB7XG4gICAgZXhwZWN0KF9wYXJlbkwpO1xuICAgIHZhciB2YWwgPSBwYXJzZUV4cHJlc3Npb24oKTtcbiAgICBleHBlY3QoX3BhcmVuUik7XG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuXG4gIC8vIFBhcnNlIGEgc2VtaWNvbG9uLWVuY2xvc2VkIGJsb2NrIG9mIHN0YXRlbWVudHMsIGhhbmRsaW5nIGBcInVzZVxuICAvLyBzdHJpY3RcImAgZGVjbGFyYXRpb25zIHdoZW4gYGFsbG93U3RyaWN0YCBpcyB0cnVlICh1c2VkIGZvclxuICAvLyBmdW5jdGlvbiBib2RpZXMpLlxuXG4gIGZ1bmN0aW9uIHBhcnNlQmxvY2soYWxsb3dTdHJpY3QpIHtcbiAgICB2YXIgbm9kZSA9IHN0YXJ0Tm9kZSgpLCBmaXJzdCA9IHRydWUsIHN0cmljdCA9IGZhbHNlLCBvbGRTdHJpY3Q7XG4gICAgbm9kZS5ib2R5ID0gW107XG4gICAgZXhwZWN0KF9icmFjZUwpO1xuICAgIHdoaWxlICghZWF0KF9icmFjZVIpKSB7XG4gICAgICB2YXIgc3RtdCA9IHBhcnNlU3RhdGVtZW50KCk7XG4gICAgICBub2RlLmJvZHkucHVzaChzdG10KTtcbiAgICAgIGlmIChmaXJzdCAmJiBhbGxvd1N0cmljdCAmJiBpc1VzZVN0cmljdChzdG10KSkge1xuICAgICAgICBvbGRTdHJpY3QgPSBzdHJpY3Q7XG4gICAgICAgIHNldFN0cmljdChzdHJpY3QgPSB0cnVlKTtcbiAgICAgIH1cbiAgICAgIGZpcnN0ID0gZmFsc2U7XG4gICAgfVxuICAgIGlmIChzdHJpY3QgJiYgIW9sZFN0cmljdCkgc2V0U3RyaWN0KGZhbHNlKTtcbiAgICByZXR1cm4gZmluaXNoTm9kZShub2RlLCBcIkJsb2NrU3RhdGVtZW50XCIpO1xuICB9XG5cbiAgLy8gUGFyc2UgYSByZWd1bGFyIGBmb3JgIGxvb3AuIFRoZSBkaXNhbWJpZ3VhdGlvbiBjb2RlIGluXG4gIC8vIGBwYXJzZVN0YXRlbWVudGAgd2lsbCBhbHJlYWR5IGhhdmUgcGFyc2VkIHRoZSBpbml0IHN0YXRlbWVudCBvclxuICAvLyBleHByZXNzaW9uLlxuXG4gIGZ1bmN0aW9uIHBhcnNlRm9yKG5vZGUsIGluaXQpIHtcbiAgICBub2RlLmluaXQgPSBpbml0O1xuICAgIGV4cGVjdChfc2VtaSk7XG4gICAgbm9kZS50ZXN0ID0gdG9rVHlwZSA9PT0gX3NlbWkgPyBudWxsIDogcGFyc2VFeHByZXNzaW9uKCk7XG4gICAgZXhwZWN0KF9zZW1pKTtcbiAgICBub2RlLnVwZGF0ZSA9IHRva1R5cGUgPT09IF9wYXJlblIgPyBudWxsIDogcGFyc2VFeHByZXNzaW9uKCk7XG4gICAgZXhwZWN0KF9wYXJlblIpO1xuICAgIG5vZGUuYm9keSA9IHBhcnNlU3RhdGVtZW50KCk7XG4gICAgbGFiZWxzLnBvcCgpO1xuICAgIHJldHVybiBmaW5pc2hOb2RlKG5vZGUsIFwiRm9yU3RhdGVtZW50XCIpO1xuICB9XG5cbiAgLy8gUGFyc2UgYSBgZm9yYC9gaW5gIGxvb3AuXG5cbiAgZnVuY3Rpb24gcGFyc2VGb3JJbihub2RlLCBpbml0KSB7XG4gICAgbm9kZS5sZWZ0ID0gaW5pdDtcbiAgICBub2RlLnJpZ2h0ID0gcGFyc2VFeHByZXNzaW9uKCk7XG4gICAgZXhwZWN0KF9wYXJlblIpO1xuICAgIG5vZGUuYm9keSA9IHBhcnNlU3RhdGVtZW50KCk7XG4gICAgbGFiZWxzLnBvcCgpO1xuICAgIHJldHVybiBmaW5pc2hOb2RlKG5vZGUsIFwiRm9ySW5TdGF0ZW1lbnRcIik7XG4gIH1cblxuICAvLyBQYXJzZSBhIGxpc3Qgb2YgdmFyaWFibGUgZGVjbGFyYXRpb25zLlxuXG4gIGZ1bmN0aW9uIHBhcnNlVmFyKG5vZGUsIG5vSW4pIHtcbiAgICBub2RlLmRlY2xhcmF0aW9ucyA9IFtdO1xuICAgIG5vZGUua2luZCA9IFwidmFyXCI7XG4gICAgZm9yICg7Oykge1xuICAgICAgdmFyIGRlY2wgPSBzdGFydE5vZGUoKTtcbiAgICAgIGRlY2wuaWQgPSBwYXJzZUlkZW50KCk7XG4gICAgICBpZiAoc3RyaWN0ICYmIGlzU3RyaWN0QmFkSWRXb3JkKGRlY2wuaWQubmFtZSkpXG4gICAgICAgIHJhaXNlKGRlY2wuaWQuc3RhcnQsIFwiQmluZGluZyBcIiArIGRlY2wuaWQubmFtZSArIFwiIGluIHN0cmljdCBtb2RlXCIpO1xuICAgICAgZGVjbC5pbml0ID0gZWF0KF9lcSkgPyBwYXJzZUV4cHJlc3Npb24odHJ1ZSwgbm9JbikgOiBudWxsO1xuICAgICAgbm9kZS5kZWNsYXJhdGlvbnMucHVzaChmaW5pc2hOb2RlKGRlY2wsIFwiVmFyaWFibGVEZWNsYXJhdG9yXCIpKTtcbiAgICAgIGlmICghZWF0KF9jb21tYSkpIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIC8vICMjIyBFeHByZXNzaW9uIHBhcnNpbmdcblxuICAvLyBUaGVzZSBuZXN0LCBmcm9tIHRoZSBtb3N0IGdlbmVyYWwgZXhwcmVzc2lvbiB0eXBlIGF0IHRoZSB0b3AgdG9cbiAgLy8gJ2F0b21pYycsIG5vbmRpdmlzaWJsZSBleHByZXNzaW9uIHR5cGVzIGF0IHRoZSBib3R0b20uIE1vc3Qgb2ZcbiAgLy8gdGhlIGZ1bmN0aW9ucyB3aWxsIHNpbXBseSBsZXQgdGhlIGZ1bmN0aW9uKHMpIGJlbG93IHRoZW0gcGFyc2UsXG4gIC8vIGFuZCwgKmlmKiB0aGUgc3ludGFjdGljIGNvbnN0cnVjdCB0aGV5IGhhbmRsZSBpcyBwcmVzZW50LCB3cmFwXG4gIC8vIHRoZSBBU1Qgbm9kZSB0aGF0IHRoZSBpbm5lciBwYXJzZXIgZ2F2ZSB0aGVtIGluIGFub3RoZXIgbm9kZS5cblxuICAvLyBQYXJzZSBhIGZ1bGwgZXhwcmVzc2lvbi4gVGhlIGFyZ3VtZW50cyBhcmUgdXNlZCB0byBmb3JiaWQgY29tbWFcbiAgLy8gc2VxdWVuY2VzIChpbiBhcmd1bWVudCBsaXN0cywgYXJyYXkgbGl0ZXJhbHMsIG9yIG9iamVjdCBsaXRlcmFscylcbiAgLy8gb3IgdGhlIGBpbmAgb3BlcmF0b3IgKGluIGZvciBsb29wcyBpbml0YWxpemF0aW9uIGV4cHJlc3Npb25zKS5cblxuICBmdW5jdGlvbiBwYXJzZUV4cHJlc3Npb24obm9Db21tYSwgbm9Jbikge1xuICAgIHZhciBleHByID0gcGFyc2VNYXliZUFzc2lnbihub0luKTtcbiAgICBpZiAoIW5vQ29tbWEgJiYgdG9rVHlwZSA9PT0gX2NvbW1hKSB7XG4gICAgICB2YXIgbm9kZSA9IHN0YXJ0Tm9kZUZyb20oZXhwcik7XG4gICAgICBub2RlLmV4cHJlc3Npb25zID0gW2V4cHJdO1xuICAgICAgd2hpbGUgKGVhdChfY29tbWEpKSBub2RlLmV4cHJlc3Npb25zLnB1c2gocGFyc2VNYXliZUFzc2lnbihub0luKSk7XG4gICAgICByZXR1cm4gZmluaXNoTm9kZShub2RlLCBcIlNlcXVlbmNlRXhwcmVzc2lvblwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICAvLyBQYXJzZSBhbiBhc3NpZ25tZW50IGV4cHJlc3Npb24uIFRoaXMgaW5jbHVkZXMgYXBwbGljYXRpb25zIG9mXG4gIC8vIG9wZXJhdG9ycyBsaWtlIGArPWAuXG5cbiAgZnVuY3Rpb24gcGFyc2VNYXliZUFzc2lnbihub0luKSB7XG4gICAgdmFyIGxlZnQgPSBwYXJzZU1heWJlQ29uZGl0aW9uYWwobm9Jbik7XG4gICAgaWYgKHRva1R5cGUuaXNBc3NpZ24pIHtcbiAgICAgIHZhciBub2RlID0gc3RhcnROb2RlRnJvbShsZWZ0KTtcbiAgICAgIG5vZGUub3BlcmF0b3IgPSB0b2tWYWw7XG4gICAgICBub2RlLmxlZnQgPSBsZWZ0O1xuICAgICAgbmV4dCgpO1xuICAgICAgbm9kZS5yaWdodCA9IHBhcnNlTWF5YmVBc3NpZ24obm9Jbik7XG4gICAgICBjaGVja0xWYWwobGVmdCk7XG4gICAgICByZXR1cm4gZmluaXNoTm9kZShub2RlLCBcIkFzc2lnbm1lbnRFeHByZXNzaW9uXCIpO1xuICAgIH1cbiAgICByZXR1cm4gbGVmdDtcbiAgfVxuXG4gIC8vIFBhcnNlIGEgdGVybmFyeSBjb25kaXRpb25hbCAoYD86YCkgb3BlcmF0b3IuXG5cbiAgZnVuY3Rpb24gcGFyc2VNYXliZUNvbmRpdGlvbmFsKG5vSW4pIHtcbiAgICB2YXIgZXhwciA9IHBhcnNlRXhwck9wcyhub0luKTtcbiAgICBpZiAoZWF0KF9xdWVzdGlvbikpIHtcbiAgICAgIHZhciBub2RlID0gc3RhcnROb2RlRnJvbShleHByKTtcbiAgICAgIG5vZGUudGVzdCA9IGV4cHI7XG4gICAgICBub2RlLmNvbnNlcXVlbnQgPSBwYXJzZUV4cHJlc3Npb24odHJ1ZSk7XG4gICAgICBleHBlY3QoX2NvbG9uKTtcbiAgICAgIG5vZGUuYWx0ZXJuYXRlID0gcGFyc2VFeHByZXNzaW9uKHRydWUsIG5vSW4pO1xuICAgICAgcmV0dXJuIGZpbmlzaE5vZGUobm9kZSwgXCJDb25kaXRpb25hbEV4cHJlc3Npb25cIik7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgLy8gU3RhcnQgdGhlIHByZWNlZGVuY2UgcGFyc2VyLlxuXG4gIGZ1bmN0aW9uIHBhcnNlRXhwck9wcyhub0luKSB7XG4gICAgcmV0dXJuIHBhcnNlRXhwck9wKHBhcnNlTWF5YmVVbmFyeSgpLCAtMSwgbm9Jbik7XG4gIH1cblxuICAvLyBQYXJzZSBiaW5hcnkgb3BlcmF0b3JzIHdpdGggdGhlIG9wZXJhdG9yIHByZWNlZGVuY2UgcGFyc2luZ1xuICAvLyBhbGdvcml0aG0uIGBsZWZ0YCBpcyB0aGUgbGVmdC1oYW5kIHNpZGUgb2YgdGhlIG9wZXJhdG9yLlxuICAvLyBgbWluUHJlY2AgcHJvdmlkZXMgY29udGV4dCB0aGF0IGFsbG93cyB0aGUgZnVuY3Rpb24gdG8gc3RvcCBhbmRcbiAgLy8gZGVmZXIgZnVydGhlciBwYXJzZXIgdG8gb25lIG9mIGl0cyBjYWxsZXJzIHdoZW4gaXQgZW5jb3VudGVycyBhblxuICAvLyBvcGVyYXRvciB0aGF0IGhhcyBhIGxvd2VyIHByZWNlZGVuY2UgdGhhbiB0aGUgc2V0IGl0IGlzIHBhcnNpbmcuXG5cbiAgZnVuY3Rpb24gcGFyc2VFeHByT3AobGVmdCwgbWluUHJlYywgbm9Jbikge1xuICAgIHZhciBwcmVjID0gdG9rVHlwZS5iaW5vcDtcbiAgICBpZiAocHJlYyAhPSBudWxsICYmICghbm9JbiB8fCB0b2tUeXBlICE9PSBfaW4pKSB7XG4gICAgICBpZiAocHJlYyA+IG1pblByZWMpIHtcbiAgICAgICAgdmFyIG5vZGUgPSBzdGFydE5vZGVGcm9tKGxlZnQpO1xuICAgICAgICBub2RlLmxlZnQgPSBsZWZ0O1xuICAgICAgICBub2RlLm9wZXJhdG9yID0gdG9rVmFsO1xuICAgICAgICB2YXIgb3AgPSB0b2tUeXBlO1xuICAgICAgICBuZXh0KCk7XG4gICAgICAgIG5vZGUucmlnaHQgPSBwYXJzZUV4cHJPcChwYXJzZU1heWJlVW5hcnkoKSwgcHJlYywgbm9Jbik7XG4gICAgICAgIHZhciBleHByTm9kZSA9IGZpbmlzaE5vZGUobm9kZSwgKG9wID09PSBfbG9naWNhbE9SIHx8IG9wID09PSBfbG9naWNhbEFORCkgPyBcIkxvZ2ljYWxFeHByZXNzaW9uXCIgOiBcIkJpbmFyeUV4cHJlc3Npb25cIik7XG4gICAgICAgIHJldHVybiBwYXJzZUV4cHJPcChleHByTm9kZSwgbWluUHJlYywgbm9Jbik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBsZWZ0O1xuICB9XG5cbiAgLy8gUGFyc2UgdW5hcnkgb3BlcmF0b3JzLCBib3RoIHByZWZpeCBhbmQgcG9zdGZpeC5cblxuICBmdW5jdGlvbiBwYXJzZU1heWJlVW5hcnkoKSB7XG4gICAgaWYgKHRva1R5cGUucHJlZml4KSB7XG4gICAgICB2YXIgbm9kZSA9IHN0YXJ0Tm9kZSgpLCB1cGRhdGUgPSB0b2tUeXBlLmlzVXBkYXRlO1xuICAgICAgbm9kZS5vcGVyYXRvciA9IHRva1ZhbDtcbiAgICAgIG5vZGUucHJlZml4ID0gdHJ1ZTtcbiAgICAgIHRva1JlZ2V4cEFsbG93ZWQgPSB0cnVlO1xuICAgICAgbmV4dCgpO1xuICAgICAgbm9kZS5hcmd1bWVudCA9IHBhcnNlTWF5YmVVbmFyeSgpO1xuICAgICAgaWYgKHVwZGF0ZSkgY2hlY2tMVmFsKG5vZGUuYXJndW1lbnQpO1xuICAgICAgZWxzZSBpZiAoc3RyaWN0ICYmIG5vZGUub3BlcmF0b3IgPT09IFwiZGVsZXRlXCIgJiZcbiAgICAgICAgICAgICAgIG5vZGUuYXJndW1lbnQudHlwZSA9PT0gXCJJZGVudGlmaWVyXCIpXG4gICAgICAgIHJhaXNlKG5vZGUuc3RhcnQsIFwiRGVsZXRpbmcgbG9jYWwgdmFyaWFibGUgaW4gc3RyaWN0IG1vZGVcIik7XG4gICAgICByZXR1cm4gZmluaXNoTm9kZShub2RlLCB1cGRhdGUgPyBcIlVwZGF0ZUV4cHJlc3Npb25cIiA6IFwiVW5hcnlFeHByZXNzaW9uXCIpO1xuICAgIH1cbiAgICB2YXIgZXhwciA9IHBhcnNlRXhwclN1YnNjcmlwdHMoKTtcbiAgICB3aGlsZSAodG9rVHlwZS5wb3N0Zml4ICYmICFjYW5JbnNlcnRTZW1pY29sb24oKSkge1xuICAgICAgdmFyIG5vZGUgPSBzdGFydE5vZGVGcm9tKGV4cHIpO1xuICAgICAgbm9kZS5vcGVyYXRvciA9IHRva1ZhbDtcbiAgICAgIG5vZGUucHJlZml4ID0gZmFsc2U7XG4gICAgICBub2RlLmFyZ3VtZW50ID0gZXhwcjtcbiAgICAgIGNoZWNrTFZhbChleHByKTtcbiAgICAgIG5leHQoKTtcbiAgICAgIGV4cHIgPSBmaW5pc2hOb2RlKG5vZGUsIFwiVXBkYXRlRXhwcmVzc2lvblwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICAvLyBQYXJzZSBjYWxsLCBkb3QsIGFuZCBgW11gLXN1YnNjcmlwdCBleHByZXNzaW9ucy5cblxuICBmdW5jdGlvbiBwYXJzZUV4cHJTdWJzY3JpcHRzKCkge1xuICAgIHJldHVybiBwYXJzZVN1YnNjcmlwdHMocGFyc2VFeHByQXRvbSgpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlU3Vic2NyaXB0cyhiYXNlLCBub0NhbGxzKSB7XG4gICAgaWYgKGVhdChfZG90KSkge1xuICAgICAgdmFyIG5vZGUgPSBzdGFydE5vZGVGcm9tKGJhc2UpO1xuICAgICAgbm9kZS5vYmplY3QgPSBiYXNlO1xuICAgICAgbm9kZS5wcm9wZXJ0eSA9IHBhcnNlSWRlbnQodHJ1ZSk7XG4gICAgICBub2RlLmNvbXB1dGVkID0gZmFsc2U7XG4gICAgICByZXR1cm4gcGFyc2VTdWJzY3JpcHRzKGZpbmlzaE5vZGUobm9kZSwgXCJNZW1iZXJFeHByZXNzaW9uXCIpLCBub0NhbGxzKTtcbiAgICB9IGVsc2UgaWYgKGVhdChfYnJhY2tldEwpKSB7XG4gICAgICB2YXIgbm9kZSA9IHN0YXJ0Tm9kZUZyb20oYmFzZSk7XG4gICAgICBub2RlLm9iamVjdCA9IGJhc2U7XG4gICAgICBub2RlLnByb3BlcnR5ID0gcGFyc2VFeHByZXNzaW9uKCk7XG4gICAgICBub2RlLmNvbXB1dGVkID0gdHJ1ZTtcbiAgICAgIGV4cGVjdChfYnJhY2tldFIpO1xuICAgICAgcmV0dXJuIHBhcnNlU3Vic2NyaXB0cyhmaW5pc2hOb2RlKG5vZGUsIFwiTWVtYmVyRXhwcmVzc2lvblwiKSwgbm9DYWxscyk7XG4gICAgfSBlbHNlIGlmICghbm9DYWxscyAmJiBlYXQoX3BhcmVuTCkpIHtcbiAgICAgIHZhciBub2RlID0gc3RhcnROb2RlRnJvbShiYXNlKTtcbiAgICAgIG5vZGUuY2FsbGVlID0gYmFzZTtcbiAgICAgIG5vZGUuYXJndW1lbnRzID0gcGFyc2VFeHByTGlzdChfcGFyZW5SLCBmYWxzZSk7XG4gICAgICByZXR1cm4gcGFyc2VTdWJzY3JpcHRzKGZpbmlzaE5vZGUobm9kZSwgXCJDYWxsRXhwcmVzc2lvblwiKSwgbm9DYWxscyk7XG4gICAgfSBlbHNlIHJldHVybiBiYXNlO1xuICB9XG5cbiAgLy8gUGFyc2UgYW4gYXRvbWljIGV4cHJlc3Npb24g4oCUIGVpdGhlciBhIHNpbmdsZSB0b2tlbiB0aGF0IGlzIGFuXG4gIC8vIGV4cHJlc3Npb24sIGFuIGV4cHJlc3Npb24gc3RhcnRlZCBieSBhIGtleXdvcmQgbGlrZSBgZnVuY3Rpb25gIG9yXG4gIC8vIGBuZXdgLCBvciBhbiBleHByZXNzaW9uIHdyYXBwZWQgaW4gcHVuY3R1YXRpb24gbGlrZSBgKClgLCBgW11gLFxuICAvLyBvciBge31gLlxuXG4gIGZ1bmN0aW9uIHBhcnNlRXhwckF0b20oKSB7XG4gICAgc3dpdGNoICh0b2tUeXBlKSB7XG4gICAgY2FzZSBfdGhpczpcbiAgICAgIHZhciBub2RlID0gc3RhcnROb2RlKCk7XG4gICAgICBuZXh0KCk7XG4gICAgICByZXR1cm4gZmluaXNoTm9kZShub2RlLCBcIlRoaXNFeHByZXNzaW9uXCIpO1xuICAgIGNhc2UgX25hbWU6XG4gICAgICByZXR1cm4gcGFyc2VJZGVudCgpO1xuICAgIGNhc2UgX251bTogY2FzZSBfc3RyaW5nOiBjYXNlIF9yZWdleHA6XG4gICAgICB2YXIgbm9kZSA9IHN0YXJ0Tm9kZSgpO1xuICAgICAgbm9kZS52YWx1ZSA9IHRva1ZhbDtcbiAgICAgIG5vZGUucmF3ID0gaW5wdXQuc2xpY2UodG9rU3RhcnQsIHRva0VuZCk7XG4gICAgICBuZXh0KCk7XG4gICAgICByZXR1cm4gZmluaXNoTm9kZShub2RlLCBcIkxpdGVyYWxcIik7XG5cbiAgICBjYXNlIF9udWxsOiBjYXNlIF90cnVlOiBjYXNlIF9mYWxzZTpcbiAgICAgIHZhciBub2RlID0gc3RhcnROb2RlKCk7XG4gICAgICBub2RlLnZhbHVlID0gdG9rVHlwZS5hdG9tVmFsdWU7XG4gICAgICBub2RlLnJhdyA9IHRva1R5cGUua2V5d29yZDtcbiAgICAgIG5leHQoKTtcbiAgICAgIHJldHVybiBmaW5pc2hOb2RlKG5vZGUsIFwiTGl0ZXJhbFwiKTtcblxuICAgIGNhc2UgX3BhcmVuTDpcbiAgICAgIHZhciB0b2tTdGFydExvYzEgPSB0b2tTdGFydExvYywgdG9rU3RhcnQxID0gdG9rU3RhcnQ7XG4gICAgICBuZXh0KCk7XG4gICAgICB2YXIgdmFsID0gcGFyc2VFeHByZXNzaW9uKCk7XG4gICAgICB2YWwuc3RhcnQgPSB0b2tTdGFydDE7XG4gICAgICB2YWwuZW5kID0gdG9rRW5kO1xuICAgICAgaWYgKG9wdGlvbnMubG9jYXRpb25zKSB7XG4gICAgICAgIHZhbC5sb2Muc3RhcnQgPSB0b2tTdGFydExvYzE7XG4gICAgICAgIHZhbC5sb2MuZW5kID0gdG9rRW5kTG9jO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMucmFuZ2VzKVxuICAgICAgICB2YWwucmFuZ2UgPSBbdG9rU3RhcnQxLCB0b2tFbmRdO1xuICAgICAgZXhwZWN0KF9wYXJlblIpO1xuICAgICAgcmV0dXJuIHZhbDtcblxuICAgIGNhc2UgX2JyYWNrZXRMOlxuICAgICAgdmFyIG5vZGUgPSBzdGFydE5vZGUoKTtcbiAgICAgIG5leHQoKTtcbiAgICAgIG5vZGUuZWxlbWVudHMgPSBwYXJzZUV4cHJMaXN0KF9icmFja2V0UiwgdHJ1ZSwgdHJ1ZSk7XG4gICAgICByZXR1cm4gZmluaXNoTm9kZShub2RlLCBcIkFycmF5RXhwcmVzc2lvblwiKTtcblxuICAgIGNhc2UgX2JyYWNlTDpcbiAgICAgIHJldHVybiBwYXJzZU9iaigpO1xuXG4gICAgY2FzZSBfZnVuY3Rpb246XG4gICAgICB2YXIgbm9kZSA9IHN0YXJ0Tm9kZSgpO1xuICAgICAgbmV4dCgpO1xuICAgICAgcmV0dXJuIHBhcnNlRnVuY3Rpb24obm9kZSwgZmFsc2UpO1xuXG4gICAgY2FzZSBfbmV3OlxuICAgICAgcmV0dXJuIHBhcnNlTmV3KCk7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdW5leHBlY3RlZCgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIE5ldydzIHByZWNlZGVuY2UgaXMgc2xpZ2h0bHkgdHJpY2t5LiBJdCBtdXN0IGFsbG93IGl0cyBhcmd1bWVudFxuICAvLyB0byBiZSBhIGBbXWAgb3IgZG90IHN1YnNjcmlwdCBleHByZXNzaW9uLCBidXQgbm90IGEgY2FsbCDigJQgYXRcbiAgLy8gbGVhc3QsIG5vdCB3aXRob3V0IHdyYXBwaW5nIGl0IGluIHBhcmVudGhlc2VzLiBUaHVzLCBpdCB1c2VzIHRoZVxuXG4gIGZ1bmN0aW9uIHBhcnNlTmV3KCkge1xuICAgIHZhciBub2RlID0gc3RhcnROb2RlKCk7XG4gICAgbmV4dCgpO1xuICAgIG5vZGUuY2FsbGVlID0gcGFyc2VTdWJzY3JpcHRzKHBhcnNlRXhwckF0b20oKSwgdHJ1ZSk7XG4gICAgaWYgKGVhdChfcGFyZW5MKSkgbm9kZS5hcmd1bWVudHMgPSBwYXJzZUV4cHJMaXN0KF9wYXJlblIsIGZhbHNlKTtcbiAgICBlbHNlIG5vZGUuYXJndW1lbnRzID0gZW1wdHk7XG4gICAgcmV0dXJuIGZpbmlzaE5vZGUobm9kZSwgXCJOZXdFeHByZXNzaW9uXCIpO1xuICB9XG5cbiAgLy8gUGFyc2UgYW4gb2JqZWN0IGxpdGVyYWwuXG5cbiAgZnVuY3Rpb24gcGFyc2VPYmooKSB7XG4gICAgdmFyIG5vZGUgPSBzdGFydE5vZGUoKSwgZmlyc3QgPSB0cnVlLCBzYXdHZXRTZXQgPSBmYWxzZTtcbiAgICBub2RlLnByb3BlcnRpZXMgPSBbXTtcbiAgICBuZXh0KCk7XG4gICAgd2hpbGUgKCFlYXQoX2JyYWNlUikpIHtcbiAgICAgIGlmICghZmlyc3QpIHtcbiAgICAgICAgZXhwZWN0KF9jb21tYSk7XG4gICAgICAgIGlmIChvcHRpb25zLmFsbG93VHJhaWxpbmdDb21tYXMgJiYgZWF0KF9icmFjZVIpKSBicmVhaztcbiAgICAgIH0gZWxzZSBmaXJzdCA9IGZhbHNlO1xuXG4gICAgICB2YXIgcHJvcCA9IHtrZXk6IHBhcnNlUHJvcGVydHlOYW1lKCl9LCBpc0dldFNldCA9IGZhbHNlLCBraW5kO1xuICAgICAgaWYgKGVhdChfY29sb24pKSB7XG4gICAgICAgIHByb3AudmFsdWUgPSBwYXJzZUV4cHJlc3Npb24odHJ1ZSk7XG4gICAgICAgIGtpbmQgPSBwcm9wLmtpbmQgPSBcImluaXRcIjtcbiAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5lY21hVmVyc2lvbiA+PSA1ICYmIHByb3Aua2V5LnR5cGUgPT09IFwiSWRlbnRpZmllclwiICYmXG4gICAgICAgICAgICAgICAgIChwcm9wLmtleS5uYW1lID09PSBcImdldFwiIHx8IHByb3Aua2V5Lm5hbWUgPT09IFwic2V0XCIpKSB7XG4gICAgICAgIGlzR2V0U2V0ID0gc2F3R2V0U2V0ID0gdHJ1ZTtcbiAgICAgICAga2luZCA9IHByb3Aua2luZCA9IHByb3Aua2V5Lm5hbWU7XG4gICAgICAgIHByb3Aua2V5ID0gcGFyc2VQcm9wZXJ0eU5hbWUoKTtcbiAgICAgICAgaWYgKHRva1R5cGUgIT09IF9wYXJlbkwpIHVuZXhwZWN0ZWQoKTtcbiAgICAgICAgcHJvcC52YWx1ZSA9IHBhcnNlRnVuY3Rpb24oc3RhcnROb2RlKCksIGZhbHNlKTtcbiAgICAgIH0gZWxzZSB1bmV4cGVjdGVkKCk7XG5cbiAgICAgIC8vIGdldHRlcnMgYW5kIHNldHRlcnMgYXJlIG5vdCBhbGxvd2VkIHRvIGNsYXNoIOKAlCBlaXRoZXIgd2l0aFxuICAgICAgLy8gZWFjaCBvdGhlciBvciB3aXRoIGFuIGluaXQgcHJvcGVydHkg4oCUIGFuZCBpbiBzdHJpY3QgbW9kZSxcbiAgICAgIC8vIGluaXQgcHJvcGVydGllcyBhcmUgYWxzbyBub3QgYWxsb3dlZCB0byBiZSByZXBlYXRlZC5cblxuICAgICAgaWYgKHByb3Aua2V5LnR5cGUgPT09IFwiSWRlbnRpZmllclwiICYmIChzdHJpY3QgfHwgc2F3R2V0U2V0KSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUucHJvcGVydGllcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgIHZhciBvdGhlciA9IG5vZGUucHJvcGVydGllc1tpXTtcbiAgICAgICAgICBpZiAob3RoZXIua2V5Lm5hbWUgPT09IHByb3Aua2V5Lm5hbWUpIHtcbiAgICAgICAgICAgIHZhciBjb25mbGljdCA9IGtpbmQgPT0gb3RoZXIua2luZCB8fCBpc0dldFNldCAmJiBvdGhlci5raW5kID09PSBcImluaXRcIiB8fFxuICAgICAgICAgICAgICBraW5kID09PSBcImluaXRcIiAmJiAob3RoZXIua2luZCA9PT0gXCJnZXRcIiB8fCBvdGhlci5raW5kID09PSBcInNldFwiKTtcbiAgICAgICAgICAgIGlmIChjb25mbGljdCAmJiAhc3RyaWN0ICYmIGtpbmQgPT09IFwiaW5pdFwiICYmIG90aGVyLmtpbmQgPT09IFwiaW5pdFwiKSBjb25mbGljdCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKGNvbmZsaWN0KSByYWlzZShwcm9wLmtleS5zdGFydCwgXCJSZWRlZmluaXRpb24gb2YgcHJvcGVydHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBub2RlLnByb3BlcnRpZXMucHVzaChwcm9wKTtcbiAgICB9XG4gICAgcmV0dXJuIGZpbmlzaE5vZGUobm9kZSwgXCJPYmplY3RFeHByZXNzaW9uXCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VQcm9wZXJ0eU5hbWUoKSB7XG4gICAgaWYgKHRva1R5cGUgPT09IF9udW0gfHwgdG9rVHlwZSA9PT0gX3N0cmluZykgcmV0dXJuIHBhcnNlRXhwckF0b20oKTtcbiAgICByZXR1cm4gcGFyc2VJZGVudCh0cnVlKTtcbiAgfVxuXG4gIC8vIFBhcnNlIGEgZnVuY3Rpb24gZGVjbGFyYXRpb24gb3IgbGl0ZXJhbCAoZGVwZW5kaW5nIG9uIHRoZVxuICAvLyBgaXNTdGF0ZW1lbnRgIHBhcmFtZXRlcikuXG5cbiAgZnVuY3Rpb24gcGFyc2VGdW5jdGlvbihub2RlLCBpc1N0YXRlbWVudCkge1xuICAgIGlmICh0b2tUeXBlID09PSBfbmFtZSkgbm9kZS5pZCA9IHBhcnNlSWRlbnQoKTtcbiAgICBlbHNlIGlmIChpc1N0YXRlbWVudCkgdW5leHBlY3RlZCgpO1xuICAgIGVsc2Ugbm9kZS5pZCA9IG51bGw7XG4gICAgbm9kZS5wYXJhbXMgPSBbXTtcbiAgICB2YXIgZmlyc3QgPSB0cnVlO1xuICAgIGV4cGVjdChfcGFyZW5MKTtcbiAgICB3aGlsZSAoIWVhdChfcGFyZW5SKSkge1xuICAgICAgaWYgKCFmaXJzdCkgZXhwZWN0KF9jb21tYSk7IGVsc2UgZmlyc3QgPSBmYWxzZTtcbiAgICAgIG5vZGUucGFyYW1zLnB1c2gocGFyc2VJZGVudCgpKTtcbiAgICB9XG5cbiAgICAvLyBTdGFydCBhIG5ldyBzY29wZSB3aXRoIHJlZ2FyZCB0byBsYWJlbHMgYW5kIHRoZSBgaW5GdW5jdGlvbmBcbiAgICAvLyBmbGFnIChyZXN0b3JlIHRoZW0gdG8gdGhlaXIgb2xkIHZhbHVlIGFmdGVyd2FyZHMpLlxuICAgIHZhciBvbGRJbkZ1bmMgPSBpbkZ1bmN0aW9uLCBvbGRMYWJlbHMgPSBsYWJlbHM7XG4gICAgaW5GdW5jdGlvbiA9IHRydWU7IGxhYmVscyA9IFtdO1xuICAgIG5vZGUuYm9keSA9IHBhcnNlQmxvY2sodHJ1ZSk7XG4gICAgaW5GdW5jdGlvbiA9IG9sZEluRnVuYzsgbGFiZWxzID0gb2xkTGFiZWxzO1xuXG4gICAgLy8gSWYgdGhpcyBpcyBhIHN0cmljdCBtb2RlIGZ1bmN0aW9uLCB2ZXJpZnkgdGhhdCBhcmd1bWVudCBuYW1lc1xuICAgIC8vIGFyZSBub3QgcmVwZWF0ZWQsIGFuZCBpdCBkb2VzIG5vdCB0cnkgdG8gYmluZCB0aGUgd29yZHMgYGV2YWxgXG4gICAgLy8gb3IgYGFyZ3VtZW50c2AuXG4gICAgaWYgKHN0cmljdCB8fCBub2RlLmJvZHkuYm9keS5sZW5ndGggJiYgaXNVc2VTdHJpY3Qobm9kZS5ib2R5LmJvZHlbMF0pKSB7XG4gICAgICBmb3IgKHZhciBpID0gbm9kZS5pZCA/IC0xIDogMDsgaSA8IG5vZGUucGFyYW1zLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciBpZCA9IGkgPCAwID8gbm9kZS5pZCA6IG5vZGUucGFyYW1zW2ldO1xuICAgICAgICBpZiAoaXNTdHJpY3RSZXNlcnZlZFdvcmQoaWQubmFtZSkgfHwgaXNTdHJpY3RCYWRJZFdvcmQoaWQubmFtZSkpXG4gICAgICAgICAgcmFpc2UoaWQuc3RhcnQsIFwiRGVmaW5pbmcgJ1wiICsgaWQubmFtZSArIFwiJyBpbiBzdHJpY3QgbW9kZVwiKTtcbiAgICAgICAgaWYgKGkgPj0gMCkgZm9yICh2YXIgaiA9IDA7IGogPCBpOyArK2opIGlmIChpZC5uYW1lID09PSBub2RlLnBhcmFtc1tqXS5uYW1lKVxuICAgICAgICAgIHJhaXNlKGlkLnN0YXJ0LCBcIkFyZ3VtZW50IG5hbWUgY2xhc2ggaW4gc3RyaWN0IG1vZGVcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbmlzaE5vZGUobm9kZSwgaXNTdGF0ZW1lbnQgPyBcIkZ1bmN0aW9uRGVjbGFyYXRpb25cIiA6IFwiRnVuY3Rpb25FeHByZXNzaW9uXCIpO1xuICB9XG5cbiAgLy8gUGFyc2VzIGEgY29tbWEtc2VwYXJhdGVkIGxpc3Qgb2YgZXhwcmVzc2lvbnMsIGFuZCByZXR1cm5zIHRoZW0gYXNcbiAgLy8gYW4gYXJyYXkuIGBjbG9zZWAgaXMgdGhlIHRva2VuIHR5cGUgdGhhdCBlbmRzIHRoZSBsaXN0LCBhbmRcbiAgLy8gYGFsbG93RW1wdHlgIGNhbiBiZSB0dXJuZWQgb24gdG8gYWxsb3cgc3Vic2VxdWVudCBjb21tYXMgd2l0aFxuICAvLyBub3RoaW5nIGluIGJldHdlZW4gdGhlbSB0byBiZSBwYXJzZWQgYXMgYG51bGxgICh3aGljaCBpcyBuZWVkZWRcbiAgLy8gZm9yIGFycmF5IGxpdGVyYWxzKS5cblxuICBmdW5jdGlvbiBwYXJzZUV4cHJMaXN0KGNsb3NlLCBhbGxvd1RyYWlsaW5nQ29tbWEsIGFsbG93RW1wdHkpIHtcbiAgICB2YXIgZWx0cyA9IFtdLCBmaXJzdCA9IHRydWU7XG4gICAgd2hpbGUgKCFlYXQoY2xvc2UpKSB7XG4gICAgICBpZiAoIWZpcnN0KSB7XG4gICAgICAgIGV4cGVjdChfY29tbWEpO1xuICAgICAgICBpZiAoYWxsb3dUcmFpbGluZ0NvbW1hICYmIG9wdGlvbnMuYWxsb3dUcmFpbGluZ0NvbW1hcyAmJiBlYXQoY2xvc2UpKSBicmVhaztcbiAgICAgIH0gZWxzZSBmaXJzdCA9IGZhbHNlO1xuXG4gICAgICBpZiAoYWxsb3dFbXB0eSAmJiB0b2tUeXBlID09PSBfY29tbWEpIGVsdHMucHVzaChudWxsKTtcbiAgICAgIGVsc2UgZWx0cy5wdXNoKHBhcnNlRXhwcmVzc2lvbih0cnVlKSk7XG4gICAgfVxuICAgIHJldHVybiBlbHRzO1xuICB9XG5cbiAgLy8gUGFyc2UgdGhlIG5leHQgdG9rZW4gYXMgYW4gaWRlbnRpZmllci4gSWYgYGxpYmVyYWxgIGlzIHRydWUgKHVzZWRcbiAgLy8gd2hlbiBwYXJzaW5nIHByb3BlcnRpZXMpLCBpdCB3aWxsIGFsc28gY29udmVydCBrZXl3b3JkcyBpbnRvXG4gIC8vIGlkZW50aWZpZXJzLlxuXG4gIGZ1bmN0aW9uIHBhcnNlSWRlbnQobGliZXJhbCkge1xuICAgIHZhciBub2RlID0gc3RhcnROb2RlKCk7XG4gICAgbm9kZS5uYW1lID0gdG9rVHlwZSA9PT0gX25hbWUgPyB0b2tWYWwgOiAobGliZXJhbCAmJiAhb3B0aW9ucy5mb3JiaWRSZXNlcnZlZCAmJiB0b2tUeXBlLmtleXdvcmQpIHx8IHVuZXhwZWN0ZWQoKTtcbiAgICB0b2tSZWdleHBBbGxvd2VkID0gZmFsc2U7XG4gICAgbmV4dCgpO1xuICAgIHJldHVybiBmaW5pc2hOb2RlKG5vZGUsIFwiSWRlbnRpZmllclwiKTtcbiAgfVxuXG59KTtcbiJdLCJmaWxlIjoibGliL0pTLUludGVycHJldGVyL2Fjb3JuLmpzIn0=
