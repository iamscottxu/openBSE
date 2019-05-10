"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.number.to-fixed");

require("core-js/modules/es.object.create");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-prototype-of");

require("core-js/modules/es.object.set-prototype-of");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _generalCanvasBaseRenderer = _interopRequireDefault(require("./generalCanvasBaseRenderer"));

var _browserNotSupportError = _interopRequireDefault(require("../errors/browserNotSupportError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
var GeneralCanvasRenderer = function (_GeneralCanvasBaseRen) {
  _inherits(GeneralCanvasRenderer, _GeneralCanvasBaseRen);

  /**
   * 实例化一个 Canvas 渲染器类
   * @param {object} element - Element 元素
   * @param {openBSE~Options} options - 全局选项
   * @param {object} elementSize - 元素大小
   * @param {Event} eventTrigger - 事件引发方法
   * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
   */
  function GeneralCanvasRenderer(element, options, elementSize, eventTrigger) {
    var _this;

    _classCallCheck(this, GeneralCanvasRenderer);

    supportCheck();
    _this = _possibleConstructorReturn(this, _getPrototypeOf(GeneralCanvasRenderer).call(this, element, options, elementSize, eventTrigger));
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

      _bulletScreensOnScreen.forEach(function (node) {
        var realTimeBulletScreen = node.element;
        if (_this2.checkWhetherHide(realTimeBulletScreen)) return;
        canvasContext.drawImage(realTimeBulletScreen.hideCanvas, ((realTimeBulletScreen.x - 4) * devicePixelRatio).toFixed(1), ((realTimeBulletScreen.actualY - 4) * devicePixelRatio).toFixed(1), ((realTimeBulletScreen.width + 8) * devicePixelRatio).toFixed(1), ((realTimeBulletScreen.height + 8) * devicePixelRatio).toFixed(1));
      }, true);
    };
    /**
     * 浏览器支持检测
     * @private
     * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
     */


    function supportCheck() {
      var canvas = document.createElement('canvas');
      if (typeof canvas.getContext != 'function') throw new _browserNotSupportError["default"]('Canvas');
      var context = canvas.getContext('2d');
      if (context === null) throw new _browserNotSupportError["default"]('Canvas 2D');
      if (typeof context.fillText != 'function') throw new _browserNotSupportError["default"]('Canvas 2D fillText Function');
    }

    return _this;
  }

  return GeneralCanvasRenderer;
}(_generalCanvasBaseRenderer["default"]);

exports["default"] = GeneralCanvasRenderer;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbmRlcmVycy9nZW5lcmFsQ2FudmFzUmVuZGVyZXIuanMiXSwibmFtZXMiOlsiR2VuZXJhbENhbnZhc1JlbmRlcmVyIiwiZWxlbWVudCIsIm9wdGlvbnMiLCJlbGVtZW50U2l6ZSIsImV2ZW50VHJpZ2dlciIsInN1cHBvcnRDaGVjayIsIl9idWxsZXRTY3JlZW5zT25TY3JlZW4iLCJnZXRCdWxsZXRTY3JlZW5zT25TY3JlZW4iLCJfY2xlYW5TY3JlZW4iLCJjbGVhblNjcmVlbiIsImNhbnZhcyIsImdldENhbnZhcyIsImdldENvbnRleHQiLCJjbGVhclJlY3QiLCJ3aWR0aCIsImhlaWdodCIsImRyYXciLCJkZXZpY2VQaXhlbFJhdGlvIiwiZ2V0RGV2aWNlUGl4ZWxSYXRpbyIsImNhbnZhc0NvbnRleHQiLCJmb3JFYWNoIiwibm9kZSIsInJlYWxUaW1lQnVsbGV0U2NyZWVuIiwiY2hlY2tXaGV0aGVySGlkZSIsImRyYXdJbWFnZSIsImhpZGVDYW52YXMiLCJ4IiwidG9GaXhlZCIsImFjdHVhbFkiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJCcm93c2VyTm90U3VwcG9ydEVycm9yIiwiY29udGV4dCIsImZpbGxUZXh0IiwiR2VuZXJhbENhbnZhc0Jhc2VSZW5kZXJlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7OztJQUdxQkEscUI7OztBQUNqQjs7Ozs7Ozs7QUFRQSxpQ0FBWUMsT0FBWixFQUFxQkMsT0FBckIsRUFBOEJDLFdBQTlCLEVBQTJDQyxZQUEzQyxFQUF5RDtBQUFBOztBQUFBOztBQUNyREMsSUFBQUEsWUFBWTtBQUNaLCtGQUFNSixPQUFOLEVBQWVDLE9BQWYsRUFBd0JDLFdBQXhCLEVBQXFDQyxZQUFyQztBQUVBOzs7OztBQUlBLFFBQUlFLHNCQUFzQixHQUFHLE1BQUtDLHdCQUFMLEVBQTdCOztBQUVBLFFBQUlDLFlBQVksR0FBRyxNQUFLQyxXQUF4QjtBQUNBOzs7OztBQUlBLFVBQUtBLFdBQUwsR0FBbUIsWUFBWTtBQUMzQkQsTUFBQUEsWUFBWTs7QUFDWixVQUFJRSxNQUFNLEdBQUcsS0FBS0MsU0FBTCxFQUFiO0FBQ0FELE1BQUFBLE1BQU0sQ0FBQ0UsVUFBUCxDQUFrQixJQUFsQixFQUF3QkMsU0FBeEIsQ0FBa0MsQ0FBbEMsRUFBcUMsQ0FBckMsRUFBd0NILE1BQU0sQ0FBQ0ksS0FBL0MsRUFBc0RKLE1BQU0sQ0FBQ0ssTUFBN0Q7QUFDSCxLQUpEO0FBTUE7Ozs7OztBQUlBLFVBQUtDLElBQUwsR0FBWSxZQUFZO0FBQUE7O0FBQ3BCLFVBQUlOLE1BQU0sR0FBRyxLQUFLQyxTQUFMLEVBQWI7QUFDQSxVQUFJTSxnQkFBZ0IsR0FBRyxLQUFLQyxtQkFBTCxFQUF2QjtBQUNBLFVBQUlDLGFBQWEsR0FBR1QsTUFBTSxDQUFDRSxVQUFQLENBQWtCLElBQWxCLENBQXBCO0FBQ0FPLE1BQUFBLGFBQWEsQ0FBQ04sU0FBZCxDQUF3QixDQUF4QixFQUEyQixDQUEzQixFQUE4QkgsTUFBTSxDQUFDSSxLQUFyQyxFQUE0Q0osTUFBTSxDQUFDSyxNQUFuRDs7QUFDQVQsTUFBQUEsc0JBQXNCLENBQUNjLE9BQXZCLENBQStCLFVBQUNDLElBQUQsRUFBVTtBQUNyQyxZQUFJQyxvQkFBb0IsR0FBR0QsSUFBSSxDQUFDcEIsT0FBaEM7QUFDQSxZQUFJLE1BQUksQ0FBQ3NCLGdCQUFMLENBQXNCRCxvQkFBdEIsQ0FBSixFQUFpRDtBQUNqREgsUUFBQUEsYUFBYSxDQUFDSyxTQUFkLENBQXdCRixvQkFBb0IsQ0FBQ0csVUFBN0MsRUFDSSxDQUFDLENBQUNILG9CQUFvQixDQUFDSSxDQUFyQixHQUF5QixDQUExQixJQUErQlQsZ0JBQWhDLEVBQWtEVSxPQUFsRCxDQUEwRCxDQUExRCxDQURKLEVBRUksQ0FBQyxDQUFDTCxvQkFBb0IsQ0FBQ00sT0FBckIsR0FBK0IsQ0FBaEMsSUFBcUNYLGdCQUF0QyxFQUF3RFUsT0FBeEQsQ0FBZ0UsQ0FBaEUsQ0FGSixFQUdJLENBQUMsQ0FBQ0wsb0JBQW9CLENBQUNSLEtBQXJCLEdBQTZCLENBQTlCLElBQW1DRyxnQkFBcEMsRUFBc0RVLE9BQXRELENBQThELENBQTlELENBSEosRUFJSSxDQUFDLENBQUNMLG9CQUFvQixDQUFDUCxNQUFyQixHQUE4QixDQUEvQixJQUFvQ0UsZ0JBQXJDLEVBQXVEVSxPQUF2RCxDQUErRCxDQUEvRCxDQUpKO0FBTUgsT0FURCxFQVNHLElBVEg7QUFVSCxLQWZEO0FBaUJBOzs7Ozs7O0FBS0EsYUFBU3RCLFlBQVQsR0FBd0I7QUFDcEIsVUFBSUssTUFBTSxHQUFHbUIsUUFBUSxDQUFDQyxhQUFULENBQXVCLFFBQXZCLENBQWI7QUFDQSxVQUFJLE9BQU9wQixNQUFNLENBQUNFLFVBQWQsSUFBNEIsVUFBaEMsRUFBNEMsTUFBTSxJQUFJbUIsa0NBQUosQ0FBMkIsUUFBM0IsQ0FBTjtBQUM1QyxVQUFJQyxPQUFPLEdBQUd0QixNQUFNLENBQUNFLFVBQVAsQ0FBa0IsSUFBbEIsQ0FBZDtBQUNBLFVBQUlvQixPQUFPLEtBQUssSUFBaEIsRUFBc0IsTUFBTSxJQUFJRCxrQ0FBSixDQUEyQixXQUEzQixDQUFOO0FBQ3RCLFVBQUksT0FBT0MsT0FBTyxDQUFDQyxRQUFmLElBQTJCLFVBQS9CLEVBQTJDLE1BQU0sSUFBSUYsa0NBQUosQ0FBMkIsNkJBQTNCLENBQU47QUFDOUM7O0FBckRvRDtBQXNEeEQ7OztFQS9EOENHLHFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEdlbmVyYWxDYW52YXNCYXNlUmVuZGVyZXIgZnJvbSAnLi9nZW5lcmFsQ2FudmFzQmFzZVJlbmRlcmVyJ1xuaW1wb3J0IEJyb3dzZXJOb3RTdXBwb3J0RXJyb3IgZnJvbSAnLi4vZXJyb3JzL2Jyb3dzZXJOb3RTdXBwb3J0RXJyb3InXG5cbi8qKlxuICogQ2FudmFzIOa4suafk+WZqOexu1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHZW5lcmFsQ2FudmFzUmVuZGVyZXIgZXh0ZW5kcyBHZW5lcmFsQ2FudmFzQmFzZVJlbmRlcmVyIHtcbiAgICAvKipcbiAgICAgKiDlrp7kvovljJbkuIDkuKogQ2FudmFzIOa4suafk+WZqOexu1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbGVtZW50IC0gRWxlbWVudCDlhYPntKBcbiAgICAgKiBAcGFyYW0ge29wZW5CU0V+T3B0aW9uc30gb3B0aW9ucyAtIOWFqOWxgOmAiemhuVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbGVtZW50U2l6ZSAtIOWFg+e0oOWkp+Wwj1xuICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50VHJpZ2dlciAtIOS6i+S7tuW8leWPkeaWueazlVxuICAgICAqIEB0aHJvd3Mge29wZW5CU0UuQnJvd3Nlck5vdFN1cHBvcnRFcnJvcn0g5rWP6KeI5Zmo5LiN5pSv5oyB54m55a6a5riy5p+T5qih5byP5pe25byV5Y+R6ZSZ6K+vXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgb3B0aW9ucywgZWxlbWVudFNpemUsIGV2ZW50VHJpZ2dlcikge1xuICAgICAgICBzdXBwb3J0Q2hlY2soKTsgLy/mtY/op4jlmajmlK/mjIHmo4DmtYtcbiAgICAgICAgc3VwZXIoZWxlbWVudCwgb3B0aW9ucywgZWxlbWVudFNpemUsIGV2ZW50VHJpZ2dlcik7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWxj+W5leS4iueahOW8ueW5lVxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7TGlua2VkTGlzdH1cbiAgICAgICAgICovXG4gICAgICAgIGxldCBfYnVsbGV0U2NyZWVuc09uU2NyZWVuID0gdGhpcy5nZXRCdWxsZXRTY3JlZW5zT25TY3JlZW4oKTtcblxuICAgICAgICBsZXQgX2NsZWFuU2NyZWVuID0gdGhpcy5jbGVhblNjcmVlbjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa4hemZpOWxj+W5leWGheWuuVxuICAgICAgICAgKiBAb3ZlcnJpZGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY2xlYW5TY3JlZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfY2xlYW5TY3JlZW4oKTtcbiAgICAgICAgICAgIGxldCBjYW52YXMgPSB0aGlzLmdldENhbnZhcygpO1xuICAgICAgICAgICAgY2FudmFzLmdldENvbnRleHQoJzJkJykuY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog57uY5Yi25Ye95pWwXG4gICAgICAgICAqIEBvdmVycmlkZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5kcmF3ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbGV0IGNhbnZhcyA9IHRoaXMuZ2V0Q2FudmFzKCk7XG4gICAgICAgICAgICBsZXQgZGV2aWNlUGl4ZWxSYXRpbyA9IHRoaXMuZ2V0RGV2aWNlUGl4ZWxSYXRpbygpO1xuICAgICAgICAgICAgbGV0IGNhbnZhc0NvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgICAgIGNhbnZhc0NvbnRleHQuY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgICAgICAgICBfYnVsbGV0U2NyZWVuc09uU2NyZWVuLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcmVhbFRpbWVCdWxsZXRTY3JlZW4gPSBub2RlLmVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tXaGV0aGVySGlkZShyZWFsVGltZUJ1bGxldFNjcmVlbikpIHJldHVybjtcbiAgICAgICAgICAgICAgICBjYW52YXNDb250ZXh0LmRyYXdJbWFnZShyZWFsVGltZUJ1bGxldFNjcmVlbi5oaWRlQ2FudmFzLCBcbiAgICAgICAgICAgICAgICAgICAgKChyZWFsVGltZUJ1bGxldFNjcmVlbi54IC0gNCkgKiBkZXZpY2VQaXhlbFJhdGlvKS50b0ZpeGVkKDEpLCBcbiAgICAgICAgICAgICAgICAgICAgKChyZWFsVGltZUJ1bGxldFNjcmVlbi5hY3R1YWxZIC0gNCkgKiBkZXZpY2VQaXhlbFJhdGlvKS50b0ZpeGVkKDEpLCBcbiAgICAgICAgICAgICAgICAgICAgKChyZWFsVGltZUJ1bGxldFNjcmVlbi53aWR0aCArIDgpICogZGV2aWNlUGl4ZWxSYXRpbykudG9GaXhlZCgxKSwgXG4gICAgICAgICAgICAgICAgICAgICgocmVhbFRpbWVCdWxsZXRTY3JlZW4uaGVpZ2h0ICsgOCkgKiBkZXZpY2VQaXhlbFJhdGlvKS50b0ZpeGVkKDEpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0sIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa1j+iniOWZqOaUr+aMgeajgOa1i1xuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAdGhyb3dzIHtvcGVuQlNFLkJyb3dzZXJOb3RTdXBwb3J0RXJyb3J9IOa1j+iniOWZqOS4jeaUr+aMgeeJueWumua4suafk+aooeW8j+aXtuW8leWPkemUmeivr1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc3VwcG9ydENoZWNrKCkge1xuICAgICAgICAgICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpOyAvL2NhbnZhc+WvueixoVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYW52YXMuZ2V0Q29udGV4dCAhPSAnZnVuY3Rpb24nKSB0aHJvdyBuZXcgQnJvd3Nlck5vdFN1cHBvcnRFcnJvcignQ2FudmFzJyk7XG4gICAgICAgICAgICBsZXQgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICAgICAgaWYgKGNvbnRleHQgPT09IG51bGwpIHRocm93IG5ldyBCcm93c2VyTm90U3VwcG9ydEVycm9yKCdDYW52YXMgMkQnKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29udGV4dC5maWxsVGV4dCAhPSAnZnVuY3Rpb24nKSB0aHJvdyBuZXcgQnJvd3Nlck5vdFN1cHBvcnRFcnJvcignQ2FudmFzIDJEIGZpbGxUZXh0IEZ1bmN0aW9uJyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbiJdLCJmaWxlIjoicmVuZGVyZXJzL2dlbmVyYWxDYW52YXNSZW5kZXJlci5qcyJ9
