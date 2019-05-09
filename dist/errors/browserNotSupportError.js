"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.date.to-string");

require("core-js/modules/es.function.bind");

require("core-js/modules/es.function.name");

require("core-js/modules/es.map");

require("core-js/modules/es.object.create");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-prototype-of");

require("core-js/modules/es.object.set-prototype-of");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.reflect.construct");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _resources = _interopRequireDefault(require("../lib/resources"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/** 
 * 浏览器不支持所引发的错误
 * @deprecated 浏览器不支持所引发的错误。有关基类的详细信息，请参阅 MDN [Error]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error} 。
 * @alias openBSE.BrowserNotSupportError
 * @extends Error
 */
var BrowserNotSupportError = function (_Error) {
  _inherits(BrowserNotSupportError, _Error);

  /**
   * 创建一个异常对象
   * @param {string} message - 消息
   */
  function BrowserNotSupportError(message) {
    var _this;

    _classCallCheck(this, BrowserNotSupportError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BrowserNotSupportError).call(this, _resources["default"].BROWSER_NOT_SUPPORT_ERROR.fillData({
      message: message
    })));
    _this.name = "BrowserNotSupportError";
    return _this;
  }

  return BrowserNotSupportError;
}(_wrapNativeSuper(Error));

exports["default"] = BrowserNotSupportError;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVycm9ycy9icm93c2VyTm90U3VwcG9ydEVycm9yLmpzIl0sIm5hbWVzIjpbIkJyb3dzZXJOb3RTdXBwb3J0RXJyb3IiLCJtZXNzYWdlIiwiUmVzb3VyY2VzIiwiQlJPV1NFUl9OT1RfU1VQUE9SVF9FUlJPUiIsImZpbGxEYXRhIiwibmFtZSIsIkVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7OztJQU1xQkEsc0I7OztBQUNqQjs7OztBQUlBLGtDQUFZQyxPQUFaLEVBQXFCO0FBQUE7O0FBQUE7O0FBQ2pCLGdHQUFNQyxzQkFBVUMseUJBQVYsQ0FBb0NDLFFBQXBDLENBQTZDO0FBQUVILE1BQUFBLE9BQU8sRUFBRUE7QUFBWCxLQUE3QyxDQUFOO0FBQ0EsVUFBS0ksSUFBTCxHQUFZLHdCQUFaO0FBRmlCO0FBR3BCOzs7bUJBUitDQyxLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlc291cmNlcyBmcm9tICcuLi9saWIvcmVzb3VyY2VzJ1xuXG4vKiogXG4gKiDmtY/op4jlmajkuI3mlK/mjIHmiYDlvJXlj5HnmoTplJnor69cbiAqIEBkZXByZWNhdGVkIOa1j+iniOWZqOS4jeaUr+aMgeaJgOW8leWPkeeahOmUmeivr+OAguacieWFs+Wfuuexu+eahOivpue7huS/oeaBr++8jOivt+WPgumYhSBNRE4gW0Vycm9yXXtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy96aC1DTi9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9FcnJvcn0g44CCXG4gKiBAYWxpYXMgb3BlbkJTRS5Ccm93c2VyTm90U3VwcG9ydEVycm9yXG4gKiBAZXh0ZW5kcyBFcnJvclxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcm93c2VyTm90U3VwcG9ydEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIC8qKlxuICAgICAqIOWIm+W7uuS4gOS4quW8guW4uOWvueixoVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIC0g5raI5oGvXG4gICAgICovXG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihSZXNvdXJjZXMuQlJPV1NFUl9OT1RfU1VQUE9SVF9FUlJPUi5maWxsRGF0YSh7IG1lc3NhZ2U6IG1lc3NhZ2UgfSkpO1xuICAgICAgICB0aGlzLm5hbWUgPSBcIkJyb3dzZXJOb3RTdXBwb3J0RXJyb3JcIjtcbiAgICB9XG59XG5cbiJdLCJmaWxlIjoiZXJyb3JzL2Jyb3dzZXJOb3RTdXBwb3J0RXJyb3IuanMifQ==
