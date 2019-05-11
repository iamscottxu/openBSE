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


    _this.refresh = function (realTimeBulletScreen) {
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
      this.refresh(realTimeBulletScreen);

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbmRlcmVycy9zcGVjaWFsQ3NzM1JlbmRlcmVyLmpzIl0sIm5hbWVzIjpbIlNwZWNpYWxDc3MzUmVuZGVyZXIiLCJlbGVtZW50Iiwib3B0aW9ucyIsImVsZW1lbnRTaXplIiwic3VwcG9ydENoZWNrIiwiX2RpdiIsImluaXQiLCJjbGVhblNjcmVlbiIsIkhlbHBlciIsImNsZWFuRWxlbWVudCIsImRyYXciLCJyZWZyZXNoIiwicmVhbFRpbWVCdWxsZXRTY3JlZW4iLCJidWxsZXRTY3JlZW5EaXYiLCJkaXYiLCJzdHlsZSIsInBvc2l0aW9uIiwid2hpdGVTcGFjZSIsImZvbnRXZWlnaHQiLCJmb250U2l6ZSIsInNpemUiLCJmb250RmFtaWx5IiwibGluZUhlaWdodCIsImNvbG9yIiwic2hhZG93Qmx1ciIsInRleHRTaGFkb3ciLCJib3JkZXJDb2xvciIsInRleHRTdHJva2UiLCJ3ZWJraXRUZXh0U3Ryb2tlIiwidGV4dFN0cm9rZUNvbG9yIiwid2Via2l0VGV4dFN0cm9rZUNvbG9yIiwiYm94Q29sb3IiLCJwYWRkaW5nIiwiYm9yZGVyIiwidHJhbnNmb3JtIiwiYXBwZW5kQ2hpbGQiLCJkb2N1bWVudCIsImNyZWF0ZVRleHROb2RlIiwidGV4dCIsImNyZWF0IiwiY3JlYXRlRWxlbWVudCIsInJlbW92ZUNoaWxkIiwib3ZlcmZsb3ciLCJtYXJnaW4iLCJ1c2VyU2VsZWN0Iiwid2Via2l0VXNlclNlbGVjdCIsIm1zVXNlclNlbGVjdCIsImN1cnNvciIsIm1zVHJhbnNmb3JtIiwid2Via2l0VHJhbnNmb3JtIiwiQnJvd3Nlck5vdFN1cHBvcnRFcnJvciIsIlNwZWNpYWxCYXNlUmVuZGVyZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBOzs7SUFHcUJBLG1COzs7QUFDakI7Ozs7Ozs7QUFPQSwrQkFBWUMsT0FBWixFQUFxQkMsT0FBckIsRUFBOEJDLFdBQTlC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U1YsWUFBVCxHQUF3QjtBQUNwQixVQUFJVyxLQUFLLEdBQUdxQixRQUFRLENBQUNJLGFBQVQsQ0FBdUIsS0FBdkIsRUFBOEJ6QixLQUExQztBQUNBLFVBQ0ksT0FBT0EsS0FBSyxDQUFDbUIsU0FBYixLQUEyQixXQUEzQixJQUNBLE9BQU9uQixLQUFLLENBQUNpQyxXQUFiLEtBQTZCLFdBRDdCLElBRUEsT0FBT2pDLEtBQUssQ0FBQ2tDLGVBQWIsS0FBaUMsV0FIckMsRUFJRSxNQUFNLElBQUlDLGtDQUFKLENBQTJCLGdCQUEzQixDQUFOO0FBQ0w7O0FBMUdzQztBQTJHMUM7OztFQW5INENDLCtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNwZWNpYWxCYXNlUmVuZGVyZXIgZnJvbSAnLi9zcGVjaWFsQmFzZVJlbmRlcmVyJ1xuaW1wb3J0IEJyb3dzZXJOb3RTdXBwb3J0RXJyb3IgZnJvbSAnLi4vZXJyb3JzL2Jyb3dzZXJOb3RTdXBwb3J0RXJyb3InXG5pbXBvcnQgSGVscGVyIGZyb20gJy4uL2xpYi9oZWxwZXInO1xuXG4vKipcbiAqIENTUzMg5riy5p+T5Zmo57G7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNwZWNpYWxDc3MzUmVuZGVyZXIgZXh0ZW5kcyBTcGVjaWFsQmFzZVJlbmRlcmVyIHtcbiAgICAvKipcbiAgICAgKiDlrp7kvovljJbkuIDkuKogQ1NTMyDmuLLmn5PlmajnsbtcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZWxlbWVudCAtIEVsZW1lbnQg5YWD57SgXG4gICAgICogQHBhcmFtIHtvcGVuQlNFfk9wdGlvbnN9IG9wdGlvbnMgLSDlhajlsYDpgInpoblcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZWxlbWVudFNpemUgLSDlhYPntKDlpKflsI9cbiAgICAgKiBAdGhyb3dzIHtvcGVuQlNFLkJyb3dzZXJOb3RTdXBwb3J0RXJyb3J9IOa1j+iniOWZqOS4jeaUr+aMgeeJueWumua4suafk+aooeW8j+aXtuW8leWPkemUmeivr1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMsIGVsZW1lbnRTaXplKSB7XG4gICAgICAgIHN1cHBvcnRDaGVjaygpOyAvL+a1j+iniOWZqOaUr+aMgeajgOa1i1xuICAgICAgICBsZXQgX2RpdiA9IGluaXQoKTtcbiAgICAgICAgc3VwZXIoX2Rpdiwgb3B0aW9ucywgZWxlbWVudFNpemUpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmuIXpmaTlsY/luZXlhoXlrrlcbiAgICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmNsZWFuU2NyZWVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgSGVscGVyLmNsZWFuRWxlbWVudChfZGl2KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDnu5jliLblh73mlbBcbiAgICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmRyYXcgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliLfmlrDlvLnluZXmoLflvI8gXG4gICAgICAgICAqIEBvdmVycmlkZVxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVhbFRpbWVCdWxsZXRTY3JlZW4gLSDlrp7ml7blvLnluZXlr7nosaFcbiAgICAgICAgKi9cbiAgICAgICAgdGhpcy5yZWZyZXNoID0gZnVuY3Rpb24gKHJlYWxUaW1lQnVsbGV0U2NyZWVuKSB7XG4gICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuRGl2ID0gcmVhbFRpbWVCdWxsZXRTY3JlZW4uZGl2O1xuICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS53aGl0ZVNwYWNlID0gJ25vd3JhcCc7XG4gICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUuZm9udFdlaWdodCA9IHJlYWxUaW1lQnVsbGV0U2NyZWVuLnN0eWxlLmZvbnRXZWlnaHQ7XG4gICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUuZm9udFNpemUgPSBgJHtyZWFsVGltZUJ1bGxldFNjcmVlbi5zdHlsZS5zaXplfXB4YDtcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS5mb250RmFtaWx5ID0gcmVhbFRpbWVCdWxsZXRTY3JlZW4uc3R5bGUuZm9udEZhbWlseTtcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS5saW5lSGVpZ2h0ID0gYCR7cmVhbFRpbWVCdWxsZXRTY3JlZW4uc3R5bGUuc2l6ZX1weGA7XG4gICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUuY29sb3IgPSByZWFsVGltZUJ1bGxldFNjcmVlbi5zdHlsZS5jb2xvcjtcbiAgICAgICAgICAgIGlmIChyZWFsVGltZUJ1bGxldFNjcmVlbi5zdHlsZS5zaGFkb3dCbHVyICE9IG51bGwpXG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLnRleHRTaGFkb3cgPSBgMCAwICR7cmVhbFRpbWVCdWxsZXRTY3JlZW4uc3R5bGUuc2hhZG93Qmx1cn1weCBibGFja2A7XG4gICAgICAgICAgICBpZiAocmVhbFRpbWVCdWxsZXRTY3JlZW4uc3R5bGUuYm9yZGVyQ29sb3IgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS50ZXh0U3Ryb2tlID0gYnVsbGV0U2NyZWVuRGl2LnN0eWxlLndlYmtpdFRleHRTdHJva2UgPSBgMC41cHhgO1xuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS50ZXh0U3Ryb2tlQ29sb3IgPSBidWxsZXRTY3JlZW5EaXYuc3R5bGUud2Via2l0VGV4dFN0cm9rZUNvbG9yID0gcmVhbFRpbWVCdWxsZXRTY3JlZW4uc3R5bGUuYm9yZGVyQ29sb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVhbFRpbWVCdWxsZXRTY3JlZW4uc3R5bGUuYm94Q29sb3IgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS5wYWRkaW5nID0gJzNweCc7XG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLmJvcmRlciA9ICcxcHggc29saWQnO1xuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS5ib3JkZXJDb2xvciA9IHJlYWxUaW1lQnVsbGV0U2NyZWVuLnN0eWxlLmJveENvbG9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLnBhZGRpbmcgPSAnNHB4JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS50cmFuc2Zvcm0gPSByZWFsVGltZUJ1bGxldFNjcmVlbi5zdHlsZS50cmFuc2Zvcm07XG4gICAgICAgICAgICBIZWxwZXIuY2xlYW5FbGVtZW50KGJ1bGxldFNjcmVlbkRpdik7XG4gICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocmVhbFRpbWVCdWxsZXRTY3JlZW4uc3R5bGUudGV4dCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWIm+W7uuW8ueW5leWFg+e0oFxuICAgICAgICAgKiBAb3ZlcnJpZGVcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IHJlYWxUaW1lQnVsbGV0U2NyZWVuIC0g5a6e5pe25by55bmV5a+56LGhXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmNyZWF0ID0gZnVuY3Rpb24gKHJlYWxUaW1lQnVsbGV0U2NyZWVuKSB7XG4gICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi5kaXYgPSBidWxsZXRTY3JlZW5EaXY7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2gocmVhbFRpbWVCdWxsZXRTY3JlZW4pO1xuICAgICAgICAgICAgX2Rpdi5hcHBlbmRDaGlsZChidWxsZXRTY3JlZW5EaXYpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICog5Yig6Zmk5by55bmV5YWD57SgXG4gICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICogQHBhcmFtIHtvYmplY3R9IHJlYWxUaW1lQnVsbGV0U2NyZWVuIC0g5a6e5pe25by55bmV5a+56LGhXG4gICAgICAgICovXG4gICAgICAgIHRoaXMuZGVsZXRlID0gZnVuY3Rpb24gKHJlYWxUaW1lQnVsbGV0U2NyZWVuKSB7XG4gICAgICAgICAgICBfZGl2LnJlbW92ZUNoaWxkKHJlYWxUaW1lQnVsbGV0U2NyZWVuLmRpdik7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5re75YqgRGl2XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEByZXR1cm5zIHtFbGVtZW50fSBEaXZcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7IC8vRElWXG4gICAgICAgICAgICBIZWxwZXIuY2xlYW5FbGVtZW50KGVsZW1lbnQpO1xuICAgICAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgICAgICAgZGl2LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgICAgICAgICBkaXYuc3R5bGUucGFkZGluZyA9ICcwJztcbiAgICAgICAgICAgIGRpdi5zdHlsZS5tYXJnaW4gPSAnMCc7XG4gICAgICAgICAgICBkaXYuc3R5bGUudXNlclNlbGVjdCA9XG4gICAgICAgICAgICAgICAgZGl2LnN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPVxuICAgICAgICAgICAgICAgIGRpdi5zdHlsZS5tc1VzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgICAgICAgICBkaXYuc3R5bGUuY3Vyc29yID0gJ2RlZmF1bHQnO1xuICAgICAgICAgICAgcmV0dXJuIGRpdjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmtY/op4jlmajmlK/mjIHmo4DmtYtcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQHRocm93cyB7b3BlbkJTRS5Ccm93c2VyTm90U3VwcG9ydEVycm9yfSDmtY/op4jlmajkuI3mlK/mjIHnibnlrprmuLLmn5PmqKHlvI/ml7blvJXlj5HplJnor69cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHN1cHBvcnRDaGVjaygpIHtcbiAgICAgICAgICAgIGxldCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLnN0eWxlO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHR5cGVvZiBzdHlsZS50cmFuc2Zvcm0gPT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIHN0eWxlLm1zVHJhbnNmb3JtID09PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiBzdHlsZS53ZWJraXRUcmFuc2Zvcm0gPT09ICd1bmRlZmluZWQnXG4gICAgICAgICAgICApIHRocm93IG5ldyBCcm93c2VyTm90U3VwcG9ydEVycm9yKCdDU1MzIHRyYW5zZm9ybScpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4iXSwiZmlsZSI6InJlbmRlcmVycy9zcGVjaWFsQ3NzM1JlbmRlcmVyLmpzIn0=
