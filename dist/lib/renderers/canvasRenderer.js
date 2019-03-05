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
      var canvasContext = canvas.getContext('2d');
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);

      _bulletScreensOnScreen.forEach(function (bulletScreenOnScreen) {
        if (_this2.checkWhetherHide(bulletScreenOnScreen)) return;
        canvasContext.drawImage(bulletScreenOnScreen.hideCanvas, Math.round((bulletScreenOnScreen.x - 4) * devicePixelRatio), Math.round((bulletScreenOnScreen.actualY - 4) * devicePixelRatio), Math.round((bulletScreenOnScreen.width + 8) * devicePixelRatio), Math.round((bulletScreenOnScreen.height + 8) * devicePixelRatio));
      }, true);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9yZW5kZXJlcnMvY2FudmFzUmVuZGVyZXIuanMiXSwibmFtZXMiOlsiQ2FudmFzUmVuZGVyZXIiLCJlbGVtZW50Iiwib3B0aW9ucyIsImVsZW1lbnRTaXplIiwiZXZlbnRUcmlnZ2VyIiwic3VwcG9ydENoZWNrIiwiX2J1bGxldFNjcmVlbnNPblNjcmVlbiIsImdldEJ1bGxldFNjcmVlbnNPblNjcmVlbiIsIl9jbGVhblNjcmVlbiIsImNsZWFuU2NyZWVuIiwiY2FudmFzIiwiZ2V0Q2FudmFzIiwiZ2V0Q29udGV4dCIsImNsZWFyUmVjdCIsIndpZHRoIiwiaGVpZ2h0IiwiZHJhdyIsImRldmljZVBpeGVsUmF0aW8iLCJnZXREZXZpY2VQaXhlbFJhdGlvIiwiY2FudmFzQ29udGV4dCIsImZvckVhY2giLCJidWxsZXRTY3JlZW5PblNjcmVlbiIsImNoZWNrV2hldGhlckhpZGUiLCJkcmF3SW1hZ2UiLCJoaWRlQ2FudmFzIiwiTWF0aCIsInJvdW5kIiwieCIsImFjdHVhbFkiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJCcm93c2VyTm90U3VwcG9ydEVycm9yIiwiY29udGV4dCIsImZpbGxUZXh0IiwiQ2FudmFzQmFzZVJlbmRlcmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQUVBOzs7SUFHTUEsYzs7O0FBQ0Y7Ozs7Ozs7O0FBUUEsMEJBQVlDLE9BQVosRUFBcUJDLE9BQXJCLEVBQThCQyxXQUE5QixFQUEyQ0MsWUFBM0MsRUFBeUQ7QUFBQTs7QUFBQTs7QUFDckRDLElBQUFBLFlBQVk7QUFDWix3RkFBTUosT0FBTixFQUFlQyxPQUFmLEVBQXdCQyxXQUF4QixFQUFxQ0MsWUFBckM7QUFFQTs7Ozs7QUFJQSxRQUFJRSxzQkFBc0IsR0FBRyxNQUFLQyx3QkFBTCxFQUE3Qjs7QUFFQSxRQUFJQyxZQUFZLEdBQUcsTUFBS0MsV0FBeEI7QUFDQTs7Ozs7QUFJQSxVQUFLQSxXQUFMLEdBQW1CLFlBQVk7QUFDM0JELE1BQUFBLFlBQVk7O0FBQ1osVUFBSUUsTUFBTSxHQUFHLEtBQUtDLFNBQUwsRUFBYjtBQUNBRCxNQUFBQSxNQUFNLENBQUNFLFVBQVAsQ0FBa0IsSUFBbEIsRUFBd0JDLFNBQXhCLENBQWtDLENBQWxDLEVBQXFDLENBQXJDLEVBQXdDSCxNQUFNLENBQUNJLEtBQS9DLEVBQXNESixNQUFNLENBQUNLLE1BQTdEO0FBQ0gsS0FKRDtBQU1BOzs7Ozs7QUFJQSxVQUFLQyxJQUFMLEdBQVksWUFBWTtBQUFBOztBQUNwQixVQUFJTixNQUFNLEdBQUcsS0FBS0MsU0FBTCxFQUFiO0FBQ0EsVUFBSU0sZ0JBQWdCLEdBQUcsS0FBS0MsbUJBQUwsRUFBdkI7QUFDQSxVQUFJQyxhQUFhLEdBQUdULE1BQU0sQ0FBQ0UsVUFBUCxDQUFrQixJQUFsQixDQUFwQjtBQUNBTyxNQUFBQSxhQUFhLENBQUNOLFNBQWQsQ0FBd0IsQ0FBeEIsRUFBMkIsQ0FBM0IsRUFBOEJILE1BQU0sQ0FBQ0ksS0FBckMsRUFBNENKLE1BQU0sQ0FBQ0ssTUFBbkQ7O0FBQ0FULE1BQUFBLHNCQUFzQixDQUFDYyxPQUF2QixDQUErQixVQUFDQyxvQkFBRCxFQUEwQjtBQUNyRCxZQUFJLE1BQUksQ0FBQ0MsZ0JBQUwsQ0FBc0JELG9CQUF0QixDQUFKLEVBQWlEO0FBQ2pERixRQUFBQSxhQUFhLENBQUNJLFNBQWQsQ0FBd0JGLG9CQUFvQixDQUFDRyxVQUE3QyxFQUNJQyxJQUFJLENBQUNDLEtBQUwsQ0FBVyxDQUFDTCxvQkFBb0IsQ0FBQ00sQ0FBckIsR0FBeUIsQ0FBMUIsSUFBK0JWLGdCQUExQyxDQURKLEVBRUlRLElBQUksQ0FBQ0MsS0FBTCxDQUFXLENBQUNMLG9CQUFvQixDQUFDTyxPQUFyQixHQUErQixDQUFoQyxJQUFxQ1gsZ0JBQWhELENBRkosRUFHSVEsSUFBSSxDQUFDQyxLQUFMLENBQVcsQ0FBQ0wsb0JBQW9CLENBQUNQLEtBQXJCLEdBQTZCLENBQTlCLElBQW1DRyxnQkFBOUMsQ0FISixFQUlJUSxJQUFJLENBQUNDLEtBQUwsQ0FBVyxDQUFDTCxvQkFBb0IsQ0FBQ04sTUFBckIsR0FBOEIsQ0FBL0IsSUFBb0NFLGdCQUEvQyxDQUpKO0FBTUgsT0FSRCxFQVFHLElBUkg7QUFTSCxLQWREO0FBZ0JBOzs7Ozs7O0FBS0EsYUFBU1osWUFBVCxHQUF3QjtBQUNwQixVQUFJSyxNQUFNLEdBQUdtQixRQUFRLENBQUNDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBYjtBQUNBLFVBQUksT0FBT3BCLE1BQU0sQ0FBQ0UsVUFBZCxJQUE0QixVQUFoQyxFQUE0QyxNQUFNLElBQUltQiw4Q0FBSixDQUEyQixRQUEzQixDQUFOO0FBQzVDLFVBQUlDLE9BQU8sR0FBR3RCLE1BQU0sQ0FBQ0UsVUFBUCxDQUFrQixJQUFsQixDQUFkO0FBQ0EsVUFBSW9CLE9BQU8sS0FBSyxJQUFoQixFQUFzQixNQUFNLElBQUlELDhDQUFKLENBQTJCLFdBQTNCLENBQU47QUFDdEIsVUFBSSxPQUFPQyxPQUFPLENBQUNDLFFBQWYsSUFBMkIsVUFBL0IsRUFBMkMsTUFBTSxJQUFJRiw4Q0FBSixDQUEyQiw2QkFBM0IsQ0FBTjtBQUM5Qzs7QUFwRG9EO0FBcUR4RDs7O0VBOUR3Qkcsc0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDYW52YXNCYXNlUmVuZGVyZXIgfSBmcm9tICcuL2NhbnZhc0Jhc2VSZW5kZXJlcidcbmltcG9ydCB7IEJyb3dzZXJOb3RTdXBwb3J0RXJyb3IgfSBmcm9tICcuLi8uLi9icm93c2VyTm90U3VwcG9ydEVycm9yJ1xuXG4vKipcbiAqIENhbnZhcyDmuLLmn5PlmajnsbtcbiAqL1xuY2xhc3MgQ2FudmFzUmVuZGVyZXIgZXh0ZW5kcyBDYW52YXNCYXNlUmVuZGVyZXIge1xuICAgIC8qKlxuICAgICAqIOWunuS+i+WMluS4gOS4qiBDYW52YXMg5riy5p+T5Zmo57G7XG4gICAgICogQHBhcmFtIHtvYmplY3R9IGVsZW1lbnQgLSBFbGVtZW50IOWFg+e0oFxuICAgICAqIEBwYXJhbSB7b3BlbkJTRX5PcHRpb25zfSBvcHRpb25zIC0g5YWo5bGA6YCJ6aG5XG4gICAgICogQHBhcmFtIHtvYmplY3R9IGVsZW1lbnRTaXplIC0g5YWD57Sg5aSn5bCPXG4gICAgICogQHBhcmFtIHtFdmVudH0gZXZlbnRUcmlnZ2VyIC0g5LqL5Lu25byV5Y+R5pa55rOVXG4gICAgICogQHRocm93cyB7b3BlbkJTRS5Ccm93c2VyTm90U3VwcG9ydEVycm9yfSDmtY/op4jlmajkuI3mlK/mjIHnibnlrprmuLLmn5PmqKHlvI/ml7blvJXlj5HplJnor69cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBvcHRpb25zLCBlbGVtZW50U2l6ZSwgZXZlbnRUcmlnZ2VyKSB7XG4gICAgICAgIHN1cHBvcnRDaGVjaygpOyAvL+a1j+iniOWZqOaUr+aMgeajgOa1i1xuICAgICAgICBzdXBlcihlbGVtZW50LCBvcHRpb25zLCBlbGVtZW50U2l6ZSwgZXZlbnRUcmlnZ2VyKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5bGP5bmV5LiK55qE5by55bmVXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtMaW5rZWRMaXN0fVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9idWxsZXRTY3JlZW5zT25TY3JlZW4gPSB0aGlzLmdldEJ1bGxldFNjcmVlbnNPblNjcmVlbigpO1xuXG4gICAgICAgIGxldCBfY2xlYW5TY3JlZW4gPSB0aGlzLmNsZWFuU2NyZWVuO1xuICAgICAgICAvKipcbiAgICAgICAgICog5riF6Zmk5bGP5bmV5YaF5a65XG4gICAgICAgICAqIEBvdmVycmlkZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jbGVhblNjcmVlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF9jbGVhblNjcmVlbigpO1xuICAgICAgICAgICAgbGV0IGNhbnZhcyA9IHRoaXMuZ2V0Q2FudmFzKCk7XG4gICAgICAgICAgICBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKS5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDnu5jliLblh73mlbBcbiAgICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmRyYXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgY2FudmFzID0gdGhpcy5nZXRDYW52YXMoKTtcbiAgICAgICAgICAgIGxldCBkZXZpY2VQaXhlbFJhdGlvID0gdGhpcy5nZXREZXZpY2VQaXhlbFJhdGlvKCk7XG4gICAgICAgICAgICBsZXQgY2FudmFzQ29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICAgICAgY2FudmFzQ29udGV4dC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgICAgIF9idWxsZXRTY3JlZW5zT25TY3JlZW4uZm9yRWFjaCgoYnVsbGV0U2NyZWVuT25TY3JlZW4pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja1doZXRoZXJIaWRlKGJ1bGxldFNjcmVlbk9uU2NyZWVuKSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGNhbnZhc0NvbnRleHQuZHJhd0ltYWdlKGJ1bGxldFNjcmVlbk9uU2NyZWVuLmhpZGVDYW52YXMsIFxuICAgICAgICAgICAgICAgICAgICBNYXRoLnJvdW5kKChidWxsZXRTY3JlZW5PblNjcmVlbi54IC0gNCkgKiBkZXZpY2VQaXhlbFJhdGlvKSwgXG4gICAgICAgICAgICAgICAgICAgIE1hdGgucm91bmQoKGJ1bGxldFNjcmVlbk9uU2NyZWVuLmFjdHVhbFkgLSA0KSAqIGRldmljZVBpeGVsUmF0aW8pLCBcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5yb3VuZCgoYnVsbGV0U2NyZWVuT25TY3JlZW4ud2lkdGggKyA4KSAqIGRldmljZVBpeGVsUmF0aW8pLCBcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5yb3VuZCgoYnVsbGV0U2NyZWVuT25TY3JlZW4uaGVpZ2h0ICsgOCkgKiBkZXZpY2VQaXhlbFJhdGlvKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmtY/op4jlmajmlK/mjIHmo4DmtYtcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQHRocm93cyB7b3BlbkJTRS5Ccm93c2VyTm90U3VwcG9ydEVycm9yfSDmtY/op4jlmajkuI3mlK/mjIHnibnlrprmuLLmn5PmqKHlvI/ml7blvJXlj5HplJnor69cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHN1cHBvcnRDaGVjaygpIHtcbiAgICAgICAgICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTsgLy9jYW52YXPlr7nosaFcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FudmFzLmdldENvbnRleHQgIT0gJ2Z1bmN0aW9uJykgdGhyb3cgbmV3IEJyb3dzZXJOb3RTdXBwb3J0RXJyb3IoJ0NhbnZhcycpO1xuICAgICAgICAgICAgbGV0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgICAgIGlmIChjb250ZXh0ID09PSBudWxsKSB0aHJvdyBuZXcgQnJvd3Nlck5vdFN1cHBvcnRFcnJvcignQ2FudmFzIDJEJyk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbnRleHQuZmlsbFRleHQgIT0gJ2Z1bmN0aW9uJykgdGhyb3cgbmV3IEJyb3dzZXJOb3RTdXBwb3J0RXJyb3IoJ0NhbnZhcyAyRCBmaWxsVGV4dCBGdW5jdGlvbicpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgeyBDYW52YXNSZW5kZXJlciB9OyJdLCJmaWxlIjoibGliL3JlbmRlcmVycy9jYW52YXNSZW5kZXJlci5qcyJ9
