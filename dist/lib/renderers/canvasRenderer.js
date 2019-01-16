"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CanvasRenderer = void 0;

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.object.create");

require("core-js/modules/es6.object.set-prototype-of");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.for-each");

var _canvasBaseRenderer = require("./canvasBaseRenderer");

var _browserNotSupportError = require("../../browserNotSupportError");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * Canvas 渲染器类
 */
var CanvasRenderer = function (_CanvasBaseRenderer) {
  _inherits(CanvasRenderer, _CanvasBaseRenderer);

  /**
   * 实例化一个 Canvas 渲染器类
   * @param {object} element - Element 元素
   * @param {openBSE~Options} options - 全局选项
   * @param {object} elementSize - 元素大小
   * @param {Event} eventTrigger - 事件引发方法
   * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
   */
  function CanvasRenderer(element, options, elementSize, eventTrigger) {
    var _this;

    _classCallCheck(this, CanvasRenderer);

    supportCheck();
    _this = _possibleConstructorReturn(this, _getPrototypeOf(CanvasRenderer).call(this, element, options, elementSize, eventTrigger));
    /**
     * 屏幕上的弹幕
     * @private @type {LinkedList}
     */

    var _bulletScreensOnScreen = _this.getBulletScreensOnScreen();

    var _cleanScreen = _this.cleanScreen;
    /**
     * 清除屏幕内容
     * @override
     */

    _this.cleanScreen = function () {
      _cleanScreen();

      var canvas = this.getCanvas();
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    };
    /**
     * 绘制函数
     * @override
     */


    _this.draw = function () {
      var _this2 = this;

      var canvas = this.getCanvas();
      var devicePixelRatio = this.getDevicePixelRatio();
      var hideCanvas = document.createElement('canvas');
      hideCanvas.width = canvas.width;
      hideCanvas.height = canvas.height;
      var hideCanvasContext = hideCanvas.getContext('2d');

      _bulletScreensOnScreen.forEach(function (bulletScreenOnScreen) {
        if (_this2.checkWhetherHide(bulletScreenOnScreen)) return;
        hideCanvasContext.drawImage(bulletScreenOnScreen.hideCanvas, (bulletScreenOnScreen.x - 4) * devicePixelRatio, (bulletScreenOnScreen.actualY - 4) * devicePixelRatio, (bulletScreenOnScreen.width + 8) * devicePixelRatio, (bulletScreenOnScreen.height + 8) * devicePixelRatio);
      }, true);

      var canvasContext = canvas.getContext('2d');
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      canvasContext.drawImage(hideCanvas, 0, 0);
    };
    /**
     * 浏览器支持检测
     * @private
     * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
     */


    function supportCheck() {
      var canvas = document.createElement('canvas');
      if (typeof canvas.getContext != 'function') throw new _browserNotSupportError.BrowserNotSupportError('Canvas');
      var context = canvas.getContext('2d');
      if (context === null) throw new _browserNotSupportError.BrowserNotSupportError('Canvas 2D');
      if (typeof context.fillText != 'function') throw new _browserNotSupportError.BrowserNotSupportError('Canvas 2D fillText Function');
    }

    return _this;
  }

  return CanvasRenderer;
}(_canvasBaseRenderer.CanvasBaseRenderer);

exports.CanvasRenderer = CanvasRenderer;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9yZW5kZXJlcnMvY2FudmFzUmVuZGVyZXIuanMiXSwibmFtZXMiOlsiQ2FudmFzUmVuZGVyZXIiLCJlbGVtZW50Iiwib3B0aW9ucyIsImVsZW1lbnRTaXplIiwiZXZlbnRUcmlnZ2VyIiwic3VwcG9ydENoZWNrIiwiX2J1bGxldFNjcmVlbnNPblNjcmVlbiIsImdldEJ1bGxldFNjcmVlbnNPblNjcmVlbiIsIl9jbGVhblNjcmVlbiIsImNsZWFuU2NyZWVuIiwiY2FudmFzIiwiZ2V0Q2FudmFzIiwiZ2V0Q29udGV4dCIsImNsZWFyUmVjdCIsIndpZHRoIiwiaGVpZ2h0IiwiZHJhdyIsImRldmljZVBpeGVsUmF0aW8iLCJnZXREZXZpY2VQaXhlbFJhdGlvIiwiaGlkZUNhbnZhcyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImhpZGVDYW52YXNDb250ZXh0IiwiZm9yRWFjaCIsImJ1bGxldFNjcmVlbk9uU2NyZWVuIiwiY2hlY2tXaGV0aGVySGlkZSIsImRyYXdJbWFnZSIsIngiLCJhY3R1YWxZIiwiY2FudmFzQ29udGV4dCIsIkJyb3dzZXJOb3RTdXBwb3J0RXJyb3IiLCJjb250ZXh0IiwiZmlsbFRleHQiLCJDYW52YXNCYXNlUmVuZGVyZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7OztJQUdNQSxjOzs7QUFDRjs7Ozs7Ozs7QUFRQSwwQkFBWUMsT0FBWixFQUFxQkMsT0FBckIsRUFBOEJDLFdBQTlCLEVBQTJDQyxZQUEzQyxFQUF5RDtBQUFBOztBQUFBOztBQUNyREMsSUFBQUEsWUFBWTtBQUNaLHdGQUFNSixPQUFOLEVBQWVDLE9BQWYsRUFBd0JDLFdBQXhCLEVBQXFDQyxZQUFyQztBQUVBOzs7OztBQUlBLFFBQUlFLHNCQUFzQixHQUFHLE1BQUtDLHdCQUFMLEVBQTdCOztBQUVBLFFBQUlDLFlBQVksR0FBRyxNQUFLQyxXQUF4QjtBQUNBOzs7OztBQUlBLFVBQUtBLFdBQUwsR0FBbUIsWUFBWTtBQUMzQkQsTUFBQUEsWUFBWTs7QUFDWixVQUFJRSxNQUFNLEdBQUcsS0FBS0MsU0FBTCxFQUFiO0FBQ0FELE1BQUFBLE1BQU0sQ0FBQ0UsVUFBUCxDQUFrQixJQUFsQixFQUF3QkMsU0FBeEIsQ0FBa0MsQ0FBbEMsRUFBcUMsQ0FBckMsRUFBd0NILE1BQU0sQ0FBQ0ksS0FBL0MsRUFBc0RKLE1BQU0sQ0FBQ0ssTUFBN0Q7QUFDSCxLQUpEO0FBTUE7Ozs7OztBQUlBLFVBQUtDLElBQUwsR0FBWSxZQUFZO0FBQUE7O0FBQ3BCLFVBQUlOLE1BQU0sR0FBRyxLQUFLQyxTQUFMLEVBQWI7QUFDQSxVQUFJTSxnQkFBZ0IsR0FBRyxLQUFLQyxtQkFBTCxFQUF2QjtBQUVBLFVBQUlDLFVBQVUsR0FBR0MsUUFBUSxDQUFDQyxhQUFULENBQXVCLFFBQXZCLENBQWpCO0FBQ0FGLE1BQUFBLFVBQVUsQ0FBQ0wsS0FBWCxHQUFtQkosTUFBTSxDQUFDSSxLQUExQjtBQUNBSyxNQUFBQSxVQUFVLENBQUNKLE1BQVgsR0FBb0JMLE1BQU0sQ0FBQ0ssTUFBM0I7QUFDQSxVQUFJTyxpQkFBaUIsR0FBR0gsVUFBVSxDQUFDUCxVQUFYLENBQXNCLElBQXRCLENBQXhCOztBQUNBTixNQUFBQSxzQkFBc0IsQ0FBQ2lCLE9BQXZCLENBQStCLFVBQUNDLG9CQUFELEVBQTBCO0FBQ3JELFlBQUksTUFBSSxDQUFDQyxnQkFBTCxDQUFzQkQsb0JBQXRCLENBQUosRUFBaUQ7QUFDakRGLFFBQUFBLGlCQUFpQixDQUFDSSxTQUFsQixDQUE0QkYsb0JBQW9CLENBQUNMLFVBQWpELEVBQTZELENBQUNLLG9CQUFvQixDQUFDRyxDQUFyQixHQUF5QixDQUExQixJQUErQlYsZ0JBQTVGLEVBQThHLENBQUNPLG9CQUFvQixDQUFDSSxPQUFyQixHQUErQixDQUFoQyxJQUFxQ1gsZ0JBQW5KLEVBQXFLLENBQUNPLG9CQUFvQixDQUFDVixLQUFyQixHQUE2QixDQUE5QixJQUFtQ0csZ0JBQXhNLEVBQTBOLENBQUNPLG9CQUFvQixDQUFDVCxNQUFyQixHQUE4QixDQUEvQixJQUFvQ0UsZ0JBQTlQO0FBQ0gsT0FIRCxFQUdHLElBSEg7O0FBSUEsVUFBSVksYUFBYSxHQUFHbkIsTUFBTSxDQUFDRSxVQUFQLENBQWtCLElBQWxCLENBQXBCO0FBQ0FpQixNQUFBQSxhQUFhLENBQUNoQixTQUFkLENBQXdCLENBQXhCLEVBQTJCLENBQTNCLEVBQThCSCxNQUFNLENBQUNJLEtBQXJDLEVBQTRDSixNQUFNLENBQUNLLE1BQW5EO0FBQ0FjLE1BQUFBLGFBQWEsQ0FBQ0gsU0FBZCxDQUF3QlAsVUFBeEIsRUFBb0MsQ0FBcEMsRUFBdUMsQ0FBdkM7QUFDSCxLQWZEO0FBaUJBOzs7Ozs7O0FBS0EsYUFBU2QsWUFBVCxHQUF3QjtBQUNwQixVQUFJSyxNQUFNLEdBQUdVLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixRQUF2QixDQUFiO0FBQ0EsVUFBSSxPQUFPWCxNQUFNLENBQUNFLFVBQWQsSUFBNEIsVUFBaEMsRUFBNEMsTUFBTSxJQUFJa0IsOENBQUosQ0FBMkIsUUFBM0IsQ0FBTjtBQUM1QyxVQUFJQyxPQUFPLEdBQUdyQixNQUFNLENBQUNFLFVBQVAsQ0FBa0IsSUFBbEIsQ0FBZDtBQUNBLFVBQUltQixPQUFPLEtBQUssSUFBaEIsRUFBc0IsTUFBTSxJQUFJRCw4Q0FBSixDQUEyQixXQUEzQixDQUFOO0FBQ3RCLFVBQUksT0FBT0MsT0FBTyxDQUFDQyxRQUFmLElBQTJCLFVBQS9CLEVBQTJDLE1BQU0sSUFBSUYsOENBQUosQ0FBMkIsNkJBQTNCLENBQU47QUFDOUM7O0FBckRvRDtBQXNEeEQ7OztFQS9Ed0JHLHNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2FudmFzQmFzZVJlbmRlcmVyIH0gZnJvbSAnLi9jYW52YXNCYXNlUmVuZGVyZXInXHJcbmltcG9ydCB7IEJyb3dzZXJOb3RTdXBwb3J0RXJyb3IgfSBmcm9tICcuLi8uLi9icm93c2VyTm90U3VwcG9ydEVycm9yJ1xyXG5cclxuLyoqXHJcbiAqIENhbnZhcyDmuLLmn5PlmajnsbtcclxuICovXHJcbmNsYXNzIENhbnZhc1JlbmRlcmVyIGV4dGVuZHMgQ2FudmFzQmFzZVJlbmRlcmVyIHtcclxuICAgIC8qKlxyXG4gICAgICog5a6e5L6L5YyW5LiA5LiqIENhbnZhcyDmuLLmn5PlmajnsbtcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbGVtZW50IC0gRWxlbWVudCDlhYPntKBcclxuICAgICAqIEBwYXJhbSB7b3BlbkJTRX5PcHRpb25zfSBvcHRpb25zIC0g5YWo5bGA6YCJ6aG5XHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZWxlbWVudFNpemUgLSDlhYPntKDlpKflsI9cclxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50VHJpZ2dlciAtIOS6i+S7tuW8leWPkeaWueazlVxyXG4gICAgICogQHRocm93cyB7b3BlbkJTRS5Ccm93c2VyTm90U3VwcG9ydEVycm9yfSDmtY/op4jlmajkuI3mlK/mjIHnibnlrprmuLLmn5PmqKHlvI/ml7blvJXlj5HplJnor69cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgb3B0aW9ucywgZWxlbWVudFNpemUsIGV2ZW50VHJpZ2dlcikge1xyXG4gICAgICAgIHN1cHBvcnRDaGVjaygpOyAvL+a1j+iniOWZqOaUr+aMgeajgOa1i1xyXG4gICAgICAgIHN1cGVyKGVsZW1lbnQsIG9wdGlvbnMsIGVsZW1lbnRTaXplLCBldmVudFRyaWdnZXIpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDlsY/luZXkuIrnmoTlvLnluZVcclxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7TGlua2VkTGlzdH1cclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgX2J1bGxldFNjcmVlbnNPblNjcmVlbiA9IHRoaXMuZ2V0QnVsbGV0U2NyZWVuc09uU2NyZWVuKCk7XHJcblxyXG4gICAgICAgIGxldCBfY2xlYW5TY3JlZW4gPSB0aGlzLmNsZWFuU2NyZWVuO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOa4hemZpOWxj+W5leWGheWuuVxyXG4gICAgICAgICAqIEBvdmVycmlkZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY2xlYW5TY3JlZW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIF9jbGVhblNjcmVlbigpO1xyXG4gICAgICAgICAgICBsZXQgY2FudmFzID0gdGhpcy5nZXRDYW52YXMoKTtcclxuICAgICAgICAgICAgY2FudmFzLmdldENvbnRleHQoJzJkJykuY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnu5jliLblh73mlbBcclxuICAgICAgICAgKiBAb3ZlcnJpZGVcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmRyYXcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxldCBjYW52YXMgPSB0aGlzLmdldENhbnZhcygpO1xyXG4gICAgICAgICAgICBsZXQgZGV2aWNlUGl4ZWxSYXRpbyA9IHRoaXMuZ2V0RGV2aWNlUGl4ZWxSYXRpbygpO1xyXG4gICAgICAgICAgICAvL+emu+Wxj+a4suafk1xyXG4gICAgICAgICAgICBsZXQgaGlkZUNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgICAgICAgICBoaWRlQ2FudmFzLndpZHRoID0gY2FudmFzLndpZHRoO1xyXG4gICAgICAgICAgICBoaWRlQ2FudmFzLmhlaWdodCA9IGNhbnZhcy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIGxldCBoaWRlQ2FudmFzQ29udGV4dCA9IGhpZGVDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICAgICAgX2J1bGxldFNjcmVlbnNPblNjcmVlbi5mb3JFYWNoKChidWxsZXRTY3JlZW5PblNjcmVlbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tXaGV0aGVySGlkZShidWxsZXRTY3JlZW5PblNjcmVlbikpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIGhpZGVDYW52YXNDb250ZXh0LmRyYXdJbWFnZShidWxsZXRTY3JlZW5PblNjcmVlbi5oaWRlQ2FudmFzLCAoYnVsbGV0U2NyZWVuT25TY3JlZW4ueCAtIDQpICogZGV2aWNlUGl4ZWxSYXRpbywgKGJ1bGxldFNjcmVlbk9uU2NyZWVuLmFjdHVhbFkgLSA0KSAqIGRldmljZVBpeGVsUmF0aW8sIChidWxsZXRTY3JlZW5PblNjcmVlbi53aWR0aCArIDgpICogZGV2aWNlUGl4ZWxSYXRpbywgKGJ1bGxldFNjcmVlbk9uU2NyZWVuLmhlaWdodCArIDgpICogZGV2aWNlUGl4ZWxSYXRpbyk7XHJcbiAgICAgICAgICAgIH0sIHRydWUpO1xyXG4gICAgICAgICAgICBsZXQgY2FudmFzQ29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgICAgICBjYW52YXNDb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgICAgICBjYW52YXNDb250ZXh0LmRyYXdJbWFnZShoaWRlQ2FudmFzLCAwLCAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOa1j+iniOWZqOaUr+aMgeajgOa1i1xyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICogQHRocm93cyB7b3BlbkJTRS5Ccm93c2VyTm90U3VwcG9ydEVycm9yfSDmtY/op4jlmajkuI3mlK/mjIHnibnlrprmuLLmn5PmqKHlvI/ml7blvJXlj5HplJnor69cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBzdXBwb3J0Q2hlY2soKSB7XHJcbiAgICAgICAgICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTsgLy9jYW52YXPlr7nosaFcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYW52YXMuZ2V0Q29udGV4dCAhPSAnZnVuY3Rpb24nKSB0aHJvdyBuZXcgQnJvd3Nlck5vdFN1cHBvcnRFcnJvcignQ2FudmFzJyk7XHJcbiAgICAgICAgICAgIGxldCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgICAgIGlmIChjb250ZXh0ID09PSBudWxsKSB0aHJvdyBuZXcgQnJvd3Nlck5vdFN1cHBvcnRFcnJvcignQ2FudmFzIDJEJyk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29udGV4dC5maWxsVGV4dCAhPSAnZnVuY3Rpb24nKSB0aHJvdyBuZXcgQnJvd3Nlck5vdFN1cHBvcnRFcnJvcignQ2FudmFzIDJEIGZpbGxUZXh0IEZ1bmN0aW9uJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgeyBDYW52YXNSZW5kZXJlciB9OyJdLCJmaWxlIjoibGliL3JlbmRlcmVycy9jYW52YXNSZW5kZXJlci5qcyJ9
