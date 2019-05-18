"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.create");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-prototype-of");

require("core-js/modules/es.object.set-prototype-of");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _specialBaseRenderer = _interopRequireDefault(require("./specialBaseRenderer"));

var _browserNotSupportError = _interopRequireDefault(require("../errors/browserNotSupportError"));

var _helper = _interopRequireDefault(require("../lib/helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * CSS3 渲染器类
 */
var SpecialCss3Renderer = function (_SpecialBaseRenderer) {
  _inherits(SpecialCss3Renderer, _SpecialBaseRenderer);

  /**
   * 实例化一个 CSS3 渲染器类
   * @param {object} element - Element 元素
   * @param {openBSE~Options} options - 全局选项
   * @param {object} elementSize - 元素大小
   * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
   */
  function SpecialCss3Renderer(element, options, elementSize) {
    var _this;

    _classCallCheck(this, SpecialCss3Renderer);

    supportCheck();

    var _div = init();

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SpecialCss3Renderer).call(this, _div, options, elementSize));
    /**
     * 清除屏幕内容
     * @override
     */

    _this.cleanScreen = function () {
      _helper["default"].cleanElement(_div);
    };
    /**
     * 绘制函数
     * @override
     */


    _this.draw = function () {};
    /**
     * 刷新弹幕样式 
     * @override
     * @param {object} realTimeBulletScreen - 实时弹幕对象
    */


    _this.refresh = function (oldStyle, realTimeBulletScreen) {
      var bulletScreenDiv = realTimeBulletScreen.div;
      bulletScreenDiv.style.position = 'absolute';
      bulletScreenDiv.style.whiteSpace = 'nowrap';
      bulletScreenDiv.style.fontWeight = realTimeBulletScreen.style.fontWeight;
      bulletScreenDiv.style.fontSize = "".concat(realTimeBulletScreen.style.size, "px");
      bulletScreenDiv.style.fontFamily = realTimeBulletScreen.style.fontFamily;
      bulletScreenDiv.style.lineHeight = "".concat(realTimeBulletScreen.style.size, "px");
      bulletScreenDiv.style.color = realTimeBulletScreen.style.color;
      if (realTimeBulletScreen.style.shadowBlur != null) bulletScreenDiv.style.textShadow = "0 0 ".concat(realTimeBulletScreen.style.shadowBlur, "px black");

      if (realTimeBulletScreen.style.borderColor != null) {
        bulletScreenDiv.style.textStroke = bulletScreenDiv.style.webkitTextStroke = "0.5px";
        bulletScreenDiv.style.textStrokeColor = bulletScreenDiv.style.webkitTextStrokeColor = realTimeBulletScreen.style.borderColor;
      }

      if (realTimeBulletScreen.style.boxColor != null) {
        bulletScreenDiv.style.padding = '3px';
        bulletScreenDiv.style.border = '1px solid';
        bulletScreenDiv.style.borderColor = realTimeBulletScreen.style.boxColor;
      } else {
        bulletScreenDiv.style.padding = '4px';
      }

      bulletScreenDiv.style.transform = realTimeBulletScreen.style.transform;

      _helper["default"].cleanElement(bulletScreenDiv);

      bulletScreenDiv.appendChild(document.createTextNode(realTimeBulletScreen.style.text));
    };
    /**
     * 创建弹幕元素
     * @override
     * @param {object} realTimeBulletScreen - 实时弹幕对象
     */


    _this.creat = function (realTimeBulletScreen) {
      var bulletScreenDiv = document.createElement('div');
      realTimeBulletScreen.div = bulletScreenDiv;
      this.refresh(null, realTimeBulletScreen);

      _div.appendChild(bulletScreenDiv);
    };
    /**
    * 删除弹幕元素
    * @override
    * @param {object} realTimeBulletScreen - 实时弹幕对象
    */


    _this["delete"] = function (realTimeBulletScreen) {
      _div.removeChild(realTimeBulletScreen.div);
    };
    /**
     * 添加Div
     * @private
     * @returns {Element} Div
     */


    function init() {
      var div = document.createElement('div');

      _helper["default"].cleanElement(element);

      element.appendChild(div);
      div.style.overflow = 'hidden';
      div.style.padding = '0';
      div.style.margin = '0';
      div.style.userSelect = div.style.webkitUserSelect = div.style.msUserSelect = 'none';
      div.style.cursor = 'default';
      return div;
    }
    /**
     * 浏览器支持检测
     * @private
     * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
     */


    function supportCheck() {
      var style = document.createElement('div').style;
      if (typeof style.transform === 'undefined' && typeof style.msTransform === 'undefined' && typeof style.webkitTransform === 'undefined') throw new _browserNotSupportError["default"]('CSS3 transform');
    }

    return _this;
  }

  return SpecialCss3Renderer;
}(_specialBaseRenderer["default"]);

exports["default"] = SpecialCss3Renderer;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbmRlcmVycy9zcGVjaWFsQ3NzM1JlbmRlcmVyLmpzIl0sIm5hbWVzIjpbIlNwZWNpYWxDc3MzUmVuZGVyZXIiLCJlbGVtZW50Iiwib3B0aW9ucyIsImVsZW1lbnRTaXplIiwic3VwcG9ydENoZWNrIiwiX2RpdiIsImluaXQiLCJjbGVhblNjcmVlbiIsIkhlbHBlciIsImNsZWFuRWxlbWVudCIsImRyYXciLCJyZWZyZXNoIiwib2xkU3R5bGUiLCJyZWFsVGltZUJ1bGxldFNjcmVlbiIsImJ1bGxldFNjcmVlbkRpdiIsImRpdiIsInN0eWxlIiwicG9zaXRpb24iLCJ3aGl0ZVNwYWNlIiwiZm9udFdlaWdodCIsImZvbnRTaXplIiwic2l6ZSIsImZvbnRGYW1pbHkiLCJsaW5lSGVpZ2h0IiwiY29sb3IiLCJzaGFkb3dCbHVyIiwidGV4dFNoYWRvdyIsImJvcmRlckNvbG9yIiwidGV4dFN0cm9rZSIsIndlYmtpdFRleHRTdHJva2UiLCJ0ZXh0U3Ryb2tlQ29sb3IiLCJ3ZWJraXRUZXh0U3Ryb2tlQ29sb3IiLCJib3hDb2xvciIsInBhZGRpbmciLCJib3JkZXIiLCJ0cmFuc2Zvcm0iLCJhcHBlbmRDaGlsZCIsImRvY3VtZW50IiwiY3JlYXRlVGV4dE5vZGUiLCJ0ZXh0IiwiY3JlYXQiLCJjcmVhdGVFbGVtZW50IiwicmVtb3ZlQ2hpbGQiLCJvdmVyZmxvdyIsIm1hcmdpbiIsInVzZXJTZWxlY3QiLCJ3ZWJraXRVc2VyU2VsZWN0IiwibXNVc2VyU2VsZWN0IiwiY3Vyc29yIiwibXNUcmFuc2Zvcm0iLCJ3ZWJraXRUcmFuc2Zvcm0iLCJCcm93c2VyTm90U3VwcG9ydEVycm9yIiwiU3BlY2lhbEJhc2VSZW5kZXJlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7OztJQUdxQkEsbUI7OztBQUNqQjs7Ozs7OztBQU9BLCtCQUFZQyxPQUFaLEVBQXFCQyxPQUFyQixF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YUFBT2pDLEdBQVA7QUFDSDtBQUVEOzs7Ozs7O0FBS0EsYUFBU1gsWUFBVCxHQUF3QjtBQUNwQixVQUFJWSxLQUFLLEdBQUdxQixRQUFRLENBQUNJLGFBQVQsQ0FBdUIsS0FBdkIsRUFBOEJ6QixLQUExQztBQUNBLFVBQ0ksT0FBT0EsS0FBSyxDQUFDbUIsU0FBYixLQUEyQixXQUEzQixJQUNBLE9BQU9uQixLQUFLLENBQUNpQyxXQUFiLEtBQTZCLFdBRDdCLElBRUEsT0FBT2pDLEtBQUssQ0FBQ2tDLGVBQWIsS0FBaUMsV0FIckMsRUFJRSxNQUFNLElBQUlDLGtDQUFKLENBQTJCLGdCQUEzQixDQUFOO0FBQ0w7O0FBMUdzQztBQTJHMUM7OztFQW5INENDLCtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNwZWNpYWxCYXNlUmVuZGVyZXIgZnJvbSAnLi9zcGVjaWFsQmFzZVJlbmRlcmVyJ1xuaW1wb3J0IEJyb3dzZXJOb3RTdXBwb3J0RXJyb3IgZnJvbSAnLi4vZXJyb3JzL2Jyb3dzZXJOb3RTdXBwb3J0RXJyb3InXG5pbXBvcnQgSGVscGVyIGZyb20gJy4uL2xpYi9oZWxwZXInO1xuXG4vKipcbiAqIENTUzMg5riy5p+T5Zmo57G7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNwZWNpYWxDc3MzUmVuZGVyZXIgZXh0ZW5kcyBTcGVjaWFsQmFzZVJlbmRlcmVyIHtcbiAgICAvKipcbiAgICAgKiDlrp7kvovljJbkuIDkuKogQ1NTMyDmuLLmn5PlmajnsbtcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZWxlbWVudCAtIEVsZW1lbnQg5YWD57SgXG4gICAgICogQHBhcmFtIHtvcGVuQlNFfk9wdGlvbnN9IG9wdGlvbnMgLSDlhajlsYDpgInpoblcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZWxlbWVudFNpemUgLSDlhYPntKDlpKflsI9cbiAgICAgKiBAdGhyb3dzIHtvcGVuQlNFLkJyb3dzZXJOb3RTdXBwb3J0RXJyb3J9IOa1j+iniOWZqOS4jeaUr+aMgeeJueWumua4suafk+aooeW8j+aXtuW8leWPkemUmeivr1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMsIGVsZW1lbnRTaXplKSB7XG4gICAgICAgIHN1cHBvcnRDaGVjaygpOyAvL+a1j+iniOWZqOaUr+aMgeajgOa1i1xuICAgICAgICBsZXQgX2RpdiA9IGluaXQoKTtcbiAgICAgICAgc3VwZXIoX2Rpdiwgb3B0aW9ucywgZWxlbWVudFNpemUpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmuIXpmaTlsY/luZXlhoXlrrlcbiAgICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmNsZWFuU2NyZWVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgSGVscGVyLmNsZWFuRWxlbWVudChfZGl2KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDnu5jliLblh73mlbBcbiAgICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmRyYXcgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliLfmlrDlvLnluZXmoLflvI8gXG4gICAgICAgICAqIEBvdmVycmlkZVxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVhbFRpbWVCdWxsZXRTY3JlZW4gLSDlrp7ml7blvLnluZXlr7nosaFcbiAgICAgICAgKi9cbiAgICAgICAgdGhpcy5yZWZyZXNoID0gZnVuY3Rpb24gKG9sZFN0eWxlLCByZWFsVGltZUJ1bGxldFNjcmVlbikge1xuICAgICAgICAgICAgbGV0IGJ1bGxldFNjcmVlbkRpdiA9IHJlYWxUaW1lQnVsbGV0U2NyZWVuLmRpdjtcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUud2hpdGVTcGFjZSA9ICdub3dyYXAnO1xuICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLmZvbnRXZWlnaHQgPSByZWFsVGltZUJ1bGxldFNjcmVlbi5zdHlsZS5mb250V2VpZ2h0O1xuICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLmZvbnRTaXplID0gYCR7cmVhbFRpbWVCdWxsZXRTY3JlZW4uc3R5bGUuc2l6ZX1weGA7XG4gICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUuZm9udEZhbWlseSA9IHJlYWxUaW1lQnVsbGV0U2NyZWVuLnN0eWxlLmZvbnRGYW1pbHk7XG4gICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUubGluZUhlaWdodCA9IGAke3JlYWxUaW1lQnVsbGV0U2NyZWVuLnN0eWxlLnNpemV9cHhgO1xuICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLmNvbG9yID0gcmVhbFRpbWVCdWxsZXRTY3JlZW4uc3R5bGUuY29sb3I7XG4gICAgICAgICAgICBpZiAocmVhbFRpbWVCdWxsZXRTY3JlZW4uc3R5bGUuc2hhZG93Qmx1ciAhPSBudWxsKVxuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS50ZXh0U2hhZG93ID0gYDAgMCAke3JlYWxUaW1lQnVsbGV0U2NyZWVuLnN0eWxlLnNoYWRvd0JsdXJ9cHggYmxhY2tgO1xuICAgICAgICAgICAgaWYgKHJlYWxUaW1lQnVsbGV0U2NyZWVuLnN0eWxlLmJvcmRlckNvbG9yICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUudGV4dFN0cm9rZSA9IGJ1bGxldFNjcmVlbkRpdi5zdHlsZS53ZWJraXRUZXh0U3Ryb2tlID0gYDAuNXB4YDtcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUudGV4dFN0cm9rZUNvbG9yID0gYnVsbGV0U2NyZWVuRGl2LnN0eWxlLndlYmtpdFRleHRTdHJva2VDb2xvciA9IHJlYWxUaW1lQnVsbGV0U2NyZWVuLnN0eWxlLmJvcmRlckNvbG9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlYWxUaW1lQnVsbGV0U2NyZWVuLnN0eWxlLmJveENvbG9yICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUucGFkZGluZyA9ICczcHgnO1xuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS5ib3JkZXIgPSAnMXB4IHNvbGlkJztcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUuYm9yZGVyQ29sb3IgPSByZWFsVGltZUJ1bGxldFNjcmVlbi5zdHlsZS5ib3hDb2xvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS5wYWRkaW5nID0gJzRweCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUudHJhbnNmb3JtID0gcmVhbFRpbWVCdWxsZXRTY3JlZW4uc3R5bGUudHJhbnNmb3JtO1xuICAgICAgICAgICAgSGVscGVyLmNsZWFuRWxlbWVudChidWxsZXRTY3JlZW5EaXYpO1xuICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHJlYWxUaW1lQnVsbGV0U2NyZWVuLnN0eWxlLnRleHQpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliJvlu7rlvLnluZXlhYPntKBcbiAgICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZWFsVGltZUJ1bGxldFNjcmVlbiAtIOWunuaXtuW8ueW5leWvueixoVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jcmVhdCA9IGZ1bmN0aW9uIChyZWFsVGltZUJ1bGxldFNjcmVlbikge1xuICAgICAgICAgICAgbGV0IGJ1bGxldFNjcmVlbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4uZGl2ID0gYnVsbGV0U2NyZWVuRGl2O1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoKG51bGwsIHJlYWxUaW1lQnVsbGV0U2NyZWVuKTtcbiAgICAgICAgICAgIF9kaXYuYXBwZW5kQ2hpbGQoYnVsbGV0U2NyZWVuRGl2KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAqIOWIoOmZpOW8ueW5leWFg+e0oFxuICAgICAgICAqIEBvdmVycmlkZVxuICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZWFsVGltZUJ1bGxldFNjcmVlbiAtIOWunuaXtuW8ueW5leWvueixoVxuICAgICAgICAqL1xuICAgICAgICB0aGlzLmRlbGV0ZSA9IGZ1bmN0aW9uIChyZWFsVGltZUJ1bGxldFNjcmVlbikge1xuICAgICAgICAgICAgX2Rpdi5yZW1vdmVDaGlsZChyZWFsVGltZUJ1bGxldFNjcmVlbi5kaXYpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa3u+WKoERpdlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAcmV0dXJucyB7RWxlbWVudH0gRGl2XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpOyAvL0RJVlxuICAgICAgICAgICAgSGVscGVyLmNsZWFuRWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICAgICAgICAgIGRpdi5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgICAgICAgICAgZGl2LnN0eWxlLnBhZGRpbmcgPSAnMCc7XG4gICAgICAgICAgICBkaXYuc3R5bGUubWFyZ2luID0gJzAnO1xuICAgICAgICAgICAgZGl2LnN0eWxlLnVzZXJTZWxlY3QgPVxuICAgICAgICAgICAgICAgIGRpdi5zdHlsZS53ZWJraXRVc2VyU2VsZWN0ID1cbiAgICAgICAgICAgICAgICBkaXYuc3R5bGUubXNVc2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgICAgICAgICAgZGl2LnN0eWxlLmN1cnNvciA9ICdkZWZhdWx0JztcbiAgICAgICAgICAgIHJldHVybiBkaXY7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5rWP6KeI5Zmo5pSv5oyB5qOA5rWLXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEB0aHJvd3Mge29wZW5CU0UuQnJvd3Nlck5vdFN1cHBvcnRFcnJvcn0g5rWP6KeI5Zmo5LiN5pSv5oyB54m55a6a5riy5p+T5qih5byP5pe25byV5Y+R6ZSZ6K+vXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBzdXBwb3J0Q2hlY2soKSB7XG4gICAgICAgICAgICBsZXQgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKS5zdHlsZTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0eXBlb2Ygc3R5bGUudHJhbnNmb3JtID09PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiBzdHlsZS5tc1RyYW5zZm9ybSA9PT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2Ygc3R5bGUud2Via2l0VHJhbnNmb3JtID09PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgKSB0aHJvdyBuZXcgQnJvd3Nlck5vdFN1cHBvcnRFcnJvcignQ1NTMyB0cmFuc2Zvcm0nKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuIl0sImZpbGUiOiJyZW5kZXJlcnMvc3BlY2lhbENzczNSZW5kZXJlci5qcyJ9
