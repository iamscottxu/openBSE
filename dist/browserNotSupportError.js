"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BrowserNotSupportError = void 0;

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.object.create");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.string.iterator");

require("core-js/modules/es6.map");

require("core-js/modules/es6.function.bind");

require("core-js/modules/es6.reflect.construct");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.array.index-of");

require("core-js/modules/es6.object.set-prototype-of");

var _resources = require("./lib/resources");

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

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BrowserNotSupportError).call(this, _resources.Resources.BROWSER_NOT_SUPPORT_ERROR.fillData({
      message: message
    })));
    _this.name = "BrowserNotSupportError";
    return _this;
  }

  return BrowserNotSupportError;
}(_wrapNativeSuper(Error));

exports.BrowserNotSupportError = BrowserNotSupportError;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJyb3dzZXJOb3RTdXBwb3J0RXJyb3IuanMiXSwibmFtZXMiOlsiQnJvd3Nlck5vdFN1cHBvcnRFcnJvciIsIm1lc3NhZ2UiLCJSZXNvdXJjZXMiLCJCUk9XU0VSX05PVF9TVVBQT1JUX0VSUk9SIiwiZmlsbERhdGEiLCJuYW1lIiwiRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBOzs7Ozs7SUFNTUEsc0I7OztBQUNGOzs7O0FBSUEsa0NBQVlDLE9BQVosRUFBcUI7QUFBQTs7QUFBQTs7QUFDakIsZ0dBQU1DLHFCQUFVQyx5QkFBVixDQUFvQ0MsUUFBcEMsQ0FBNkM7QUFBRUgsTUFBQUEsT0FBTyxFQUFFQTtBQUFYLEtBQTdDLENBQU47QUFDQSxVQUFLSSxJQUFMLEdBQVksd0JBQVo7QUFGaUI7QUFHcEI7OzttQkFSZ0NDLEsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXNvdXJjZXMgfSBmcm9tICcuL2xpYi9yZXNvdXJjZXMnXG5cbi8qKiBcbiAqIOa1j+iniOWZqOS4jeaUr+aMgeaJgOW8leWPkeeahOmUmeivr1xuICogQGRlcHJlY2F0ZWQg5rWP6KeI5Zmo5LiN5pSv5oyB5omA5byV5Y+R55qE6ZSZ6K+v44CC5pyJ5YWz5Z+657G755qE6K+m57uG5L+h5oGv77yM6K+35Y+C6ZiFIE1ETiBbRXJyb3Jde0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3poLUNOL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0Vycm9yfSDjgIJcbiAqIEBhbGlhcyBvcGVuQlNFLkJyb3dzZXJOb3RTdXBwb3J0RXJyb3JcbiAqIEBleHRlbmRzIEVycm9yXG4gKi9cbmNsYXNzIEJyb3dzZXJOb3RTdXBwb3J0RXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgLyoqXG4gICAgICog5Yib5bu65LiA5Liq5byC5bi45a+56LGhXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgLSDmtojmga9cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKFJlc291cmNlcy5CUk9XU0VSX05PVF9TVVBQT1JUX0VSUk9SLmZpbGxEYXRhKHsgbWVzc2FnZTogbWVzc2FnZSB9KSk7XG4gICAgICAgIHRoaXMubmFtZSA9IFwiQnJvd3Nlck5vdFN1cHBvcnRFcnJvclwiO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgQnJvd3Nlck5vdFN1cHBvcnRFcnJvciB9Il0sImZpbGUiOiJicm93c2VyTm90U3VwcG9ydEVycm9yLmpzIn0=
