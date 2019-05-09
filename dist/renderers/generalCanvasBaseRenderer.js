"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.iterator");

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

var _generalBaseRenderer = _interopRequireDefault(require("./generalBaseRenderer"));

var _linkedList = _interopRequireDefault(require("../lib/linkedList"));

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
 * Canvas 渲染器抽象类
 */
var GeneralCanvasBaseRenderer = function (_GeneralBaseRenderer) {
  _inherits(GeneralCanvasBaseRenderer, _GeneralBaseRenderer);

  /**
   * 实例化一个 Canvas 渲染器抽象类
   * @param {object} element - Element 元素
   * @param {openBSE~Options} options - 全局选项
   * @param {object} elementSize - 元素大小
   * @param {function} eventTrigger - 事件引发方法
   */
  function GeneralCanvasBaseRenderer(element, options, elementSize, eventTrigger) {
    var _this;

    _classCallCheck(this, GeneralCanvasBaseRenderer);

    if ((this instanceof GeneralCanvasBaseRenderer ? this.constructor : void 0) === GeneralCanvasBaseRenderer) {
      throw new SyntaxError();
    }
    /**
     * 屏幕上的弹幕
     * @private @type {LinkedList}
     */


    var _bulletScreensOnScreen = new _linkedList["default"]();
    /**
     * DPI 缩放比例（倍数）
     * @private @type {number}
     */


    var _devicePixelRatio = _helper["default"].getDevicePixelRatio(true);

    _devicePixelRatio *= options.scaling;
    /**
     * 画布元素
     * @private @type {Element}
     */

    var _canvas = init();

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GeneralCanvasBaseRenderer).call(this, _canvas, options, elementSize));
    /**
     * 清除屏幕内容
     * @function
     * @override
     */

    _this.cleanScreen = _bulletScreensOnScreen.clean;
    /**
     * 创建弹幕元素
     * @override
     * @param {object} bulletScreenOnScreen - 屏幕弹幕对象
     */

    _this.creatAndgetWidth = function (bulletScreenOnScreen) {
      var bulletScreen = bulletScreenOnScreen.bulletScreen;
      var hideCanvas = document.createElement('canvas');
      var hideCanvasContext = hideCanvas.getContext('2d');
      hideCanvasContext.font = "".concat(bulletScreen.style.fontWeight, " ").concat(bulletScreenOnScreen.size, "px ").concat(bulletScreen.style.fontFamily);
      bulletScreenOnScreen.width = hideCanvasContext.measureText(bulletScreen.text).width;
      hideCanvas.width = (bulletScreenOnScreen.width + 8) * _devicePixelRatio;
      hideCanvas.height = (bulletScreenOnScreen.height + 8) * _devicePixelRatio;
      hideCanvasContext.shadowColor = 'black';
      hideCanvasContext.font = "".concat(bulletScreen.style.fontWeight, " ").concat(bulletScreenOnScreen.size * _devicePixelRatio, "px ").concat(bulletScreen.style.fontFamily);
      var textX = 4 * _devicePixelRatio;
      var textY = (4 + bulletScreenOnScreen.size * 0.8) * _devicePixelRatio;

      if (bulletScreen.style.color != null) {
        hideCanvasContext.shadowBlur = (bulletScreen.style.shadowBlur + 0.5) * _devicePixelRatio;
        hideCanvasContext.fillStyle = bulletScreen.style.color;
        hideCanvasContext.fillText(bulletScreen.text, textX, textY);
      }

      if (bulletScreen.style.borderColor != null) {
        hideCanvasContext.shadowBlur = 0;
        hideCanvasContext.lineWidth = 0.5 * _devicePixelRatio;
        hideCanvasContext.strokeStyle = bulletScreen.style.borderColor;
        hideCanvasContext.strokeText(bulletScreen.text, textX, textY);
      }

      if (bulletScreen.style.boxColor != null) {
        hideCanvasContext.shadowBlur = 0;
        hideCanvasContext.lineWidth = _devicePixelRatio;
        hideCanvasContext.strokeStyle = bulletScreen.style.boxColor;
        hideCanvasContext.strokeRect(_devicePixelRatio, _devicePixelRatio, hideCanvas.width - _devicePixelRatio, hideCanvas.height - _devicePixelRatio);
      }

      bulletScreenOnScreen.hideCanvas = hideCanvas;
      var flag = false;

      _bulletScreensOnScreen.forEach(function (_bulletScreenOnScreen) {
        if (_bulletScreenOnScreen.bulletScreen.layer <= bulletScreen.layer) {
          flag = true;
          return {
            add: {
              element: bulletScreenOnScreen,
              addToUp: false
            },
            stop: true
          };
        }
      }, false);

      if (!flag) _bulletScreensOnScreen.push(bulletScreenOnScreen, false);
    };
    /**
     * 删除弹幕元素
     * @override
     * @param {object} bulletScreenOnScreen - 屏幕弹幕对象
     */


    _this["delete"] = function (bulletScreenOnScreen) {
      return _bulletScreensOnScreen.forEach(function (_bulletScreenOnScreen) {
        return _bulletScreenOnScreen === bulletScreenOnScreen ? {
          remove: true,
          stop: true
        } : null;
      }, true);
    };
    /**
     * 重新添加弹幕
     * @override
     * @param {object} bulletScreenOnScreen - 屏幕弹幕对象
     */


    _this.reCreatAndgetWidth = function (bulletScreenOnScreen) {
      this["delete"](bulletScreenOnScreen);
      this.creatAndgetWidth(bulletScreenOnScreen);
    };

    var _setSize = _this.setSize;
    /**
     * 设置尺寸
     * @override
     */

    _this.setSize = function () {
      _setSize();

      _devicePixelRatio = _helper["default"].getDevicePixelRatio();
      _devicePixelRatio *= options.scaling;
      _canvas.width = elementSize.width * _devicePixelRatio;
      _canvas.height = elementSize.height * _devicePixelRatio;
    };
    /**
     * 获取缩放比例
     * @returns {number} 缩放比例
     */


    _this.getDevicePixelRatio = function () {
      return _devicePixelRatio;
    };
    /**
     * 获取画布对象
     * @returns {Element} 画布对象
     */


    _this.getCanvas = function () {
      return _canvas;
    };
    /**
     * 获取屏幕弹幕对象
     * @returns {LinkedList} 画布对象
     */


    _this.getBulletScreensOnScreen = function () {
      return _bulletScreensOnScreen;
    };
    /**
     * 添加Canvas
     * @private
     * @returns {Element} 画布对象
     */


    function init() {
      var canvas = document.createElement('canvas');

      _helper["default"].cleanElement(element);

      element.appendChild(canvas);
      canvas.width = elementSize.width * _devicePixelRatio;
      canvas.height = elementSize.height * _devicePixelRatio;
      registerEvent(canvas);
      return canvas;
    }

    var _checkWhetherHide = _this.checkWhetherHide;
    /**
     * 注册事件响应程序
     * @private
     * @param {Element} element - 元素
     */

    function registerEvent(element) {
      function getBulletScreenOnScreenByLocation(location) {
        var _bulletScreenOnScreen = null;

        _bulletScreensOnScreen.forEach(function (bulletScreenOnScreen) {
          if (_checkWhetherHide(bulletScreenOnScreen)) return;
          var x1 = bulletScreenOnScreen.x - 4;
          var x2 = x1 + bulletScreenOnScreen.width + 8;
          var y1 = bulletScreenOnScreen.actualY - 4;
          var y2 = y1 + bulletScreenOnScreen.height + 8;

          if (location.x >= x1 && location.x <= x2 && location.y >= y1 && location.y <= y2) {
            _bulletScreenOnScreen = bulletScreenOnScreen;
            return {
              stop: true
            };
          }
        }, false);

        return _bulletScreenOnScreen;
      }

      function getLocation(e) {
        function getOffsetTop(element) {
          var offsetTop = 0;

          do {
            offsetTop += element.offsetTop;
          } while ((element = element.offsetParent) != null);

          return offsetTop;
        }

        function getOffsetLeft(element) {
          var offsetLeft = 0;

          do {
            offsetLeft += element.offsetLeft;
          } while ((element = element.offsetParent) != null);

          return offsetLeft;
        }

        if (typeof e.offsetX === 'undefined' || e.offsetX === null) {
          if (typeof e.layerX === 'undefined' || e.layerX === null) {
            if (typeof e.pageX === 'undefined' || e.pageX === null) {
              var doc = document.documentElement,
                  body = document.body;
              e.pageX = e.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
              e.pageY = e.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
            }

            e.layerX = e.pageX - getOffsetLeft(e.target);
            e.layerY = e.pageY - getOffsetTop(e.target);
          }

          e.offsetX = e.layerX - e.target.clientLeft;
          e.offsetY = e.layerY - e.target.clientTop;
        }

        return {
          x: e.offsetX,
          y: e.offsetY
        };
      }

      element.oncontextmenu = function (e) {
        var bulletScreenOnScreen = getBulletScreenOnScreenByLocation(getLocation(e));
        if (bulletScreenOnScreen) eventTrigger('contextmenu', bulletScreenOnScreen, e);
        return false;
      };

      element.onclick = function (e) {
        var bulletScreenOnScreen = getBulletScreenOnScreenByLocation(getLocation(e));
        if (bulletScreenOnScreen) eventTrigger('click', bulletScreenOnScreen, e);
        return false;
      };

      element.onmousemove = function (e) {
        var bulletScreenOnScreen = getBulletScreenOnScreenByLocation(getLocation(e));

        _bulletScreensOnScreen.forEach(function (_bulletScreenOnScreen) {
          if (bulletScreenOnScreen != _bulletScreenOnScreen && _bulletScreenOnScreen.mousein) {
            _bulletScreenOnScreen.mousein = false;
            element.style.cursor = '';
            eventTrigger('mouseleave', _bulletScreenOnScreen, e);
          }
        }, true);

        if (bulletScreenOnScreen === null || bulletScreenOnScreen.mousein) return false;
        bulletScreenOnScreen.mousein = true;
        element.style.cursor = options.cursorOnMouseOver;
        eventTrigger('mouseenter', bulletScreenOnScreen, e);
        return false;
      };

      element.onmouseout = function (e) {
        _bulletScreensOnScreen.forEach(function (_bulletScreenOnScreen) {
          if (_bulletScreenOnScreen.mousein) {
            _bulletScreenOnScreen.mousein = false;
            element.style.cursor = '';
            eventTrigger('mouseleave', _bulletScreenOnScreen, e);
          }
        }, true);
      };
    }

    return _this;
  }

  return GeneralCanvasBaseRenderer;
}(_generalBaseRenderer["default"]);

exports["default"] = GeneralCanvasBaseRenderer;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbmRlcmVycy9nZW5lcmFsQ2FudmFzQmFzZVJlbmRlcmVyLmpzIl0sIm5hbWVzIjpbIkdlbmVyYWxDYW52YXNCYXNlUmVuZGVyZXIiLCJlbGVtZW50Iiwib3B0aW9ucyIsImVsZW1lbnRTaXplIiwiZXZlbnRUcmlnZ2VyIiwiU3ludGF4RXJyb3IiLCJfYnVsbGV0U2NyZWVuc09uU2NyZWVuIiwiTGlua2VkTGlzdCIsIl9kZXZpY2VQaXhlbFJhdGlvIiwiSGVscGVyIiwiZ2V0RGV2aWNlUGl4ZWxSYXRpbyIsInNjYWxpbmciLCJfY2FudmFzIiwiaW5pdCIsImNsZWFuU2NyZWVuIiwiY2xlYW4iLCJjcmVhdEFuZGdldFdpZHRoIiwiYnVsbGV0U2NyZWVuT25TY3JlZW4iLCJidWxsZXRTY3JlZW4iLCJoaWRlQ2FudmFzIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaGlkZUNhbnZhc0NvbnRleHQiLCJnZXRDb250ZXh0IiwiZm9udCIsInN0eWxlIiwiZm9udFdlaWdodCIsInNpemUiLCJmb250RmFtaWx5Iiwid2lkdGgiLCJtZWFzdXJlVGV4dCIsInRleHQiLCJoZWlnaHQiLCJzaGFkb3dDb2xvciIsInRleHRYIiwidGV4dFkiLCJjb2xvciIsInNoYWRvd0JsdXIiLCJmaWxsU3R5bGUiLCJmaWxsVGV4dCIsImJvcmRlckNvbG9yIiwibGluZVdpZHRoIiwic3Ryb2tlU3R5bGUiLCJzdHJva2VUZXh0IiwiYm94Q29sb3IiLCJzdHJva2VSZWN0IiwiZmxhZyIsImZvckVhY2giLCJfYnVsbGV0U2NyZWVuT25TY3JlZW4iLCJsYXllciIsImFkZCIsImFkZFRvVXAiLCJzdG9wIiwicHVzaCIsInJlbW92ZSIsInJlQ3JlYXRBbmRnZXRXaWR0aCIsIl9zZXRTaXplIiwic2V0U2l6ZSIsImdldENhbnZhcyIsImdldEJ1bGxldFNjcmVlbnNPblNjcmVlbiIsImNhbnZhcyIsImNsZWFuRWxlbWVudCIsImFwcGVuZENoaWxkIiwicmVnaXN0ZXJFdmVudCIsIl9jaGVja1doZXRoZXJIaWRlIiwiY2hlY2tXaGV0aGVySGlkZSIsImdldEJ1bGxldFNjcmVlbk9uU2NyZWVuQnlMb2NhdGlvbiIsImxvY2F0aW9uIiwieDEiLCJ4IiwieDIiLCJ5MSIsImFjdHVhbFkiLCJ5MiIsInkiLCJnZXRMb2NhdGlvbiIsImUiLCJnZXRPZmZzZXRUb3AiLCJvZmZzZXRUb3AiLCJvZmZzZXRQYXJlbnQiLCJnZXRPZmZzZXRMZWZ0Iiwib2Zmc2V0TGVmdCIsIm9mZnNldFgiLCJsYXllclgiLCJwYWdlWCIsImRvYyIsImRvY3VtZW50RWxlbWVudCIsImJvZHkiLCJjbGllbnRYIiwic2Nyb2xsTGVmdCIsImNsaWVudExlZnQiLCJwYWdlWSIsImNsaWVudFkiLCJzY3JvbGxUb3AiLCJjbGllbnRUb3AiLCJ0YXJnZXQiLCJsYXllclkiLCJvZmZzZXRZIiwib25jb250ZXh0bWVudSIsIm9uY2xpY2siLCJvbm1vdXNlbW92ZSIsIm1vdXNlaW4iLCJjdXJzb3IiLCJjdXJzb3JPbk1vdXNlT3ZlciIsIm9ubW91c2VvdXQiLCJHZW5lcmFsQmFzZVJlbmRlcmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7O0lBR3FCQSx5Qjs7O0FBQ2pCOzs7Ozs7O0FBT0EscUNBQVlDLE9BQVosRUFBcUJDLE9BQXJCLEVBQThCQyxXQUE5QixFQUEyQ0MsWUFBM0MsRUFBeUQ7QUFBQTs7QUFBQTs7QUFDckQsUUFBSSw0RUFBZUoseUJBQW5CLEVBQThDO0FBQzFDLFlBQU0sSUFBSUssV0FBSixFQUFOO0FBQ0g7QUFDRDs7Ozs7O0FBSUEsUUFBSUMsc0JBQXNCLEdBQUcsSUFBSUMsc0JBQUosRUFBN0I7QUFDQTs7Ozs7O0FBSUEsUUFBSUMsaUJBQWlCLEdBQUdDLG1CQUFPQyxtQkFBUCxDQUEyQixJQUEzQixDQUF4Qjs7QUFDQUYsSUFBQUEsaUJBQWlCLElBQUlOLE9BQU8sQ0FBQ1MsT0FBN0I7QUFDQTs7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RyxRQUFBQSxPQUFPLENBQUN3QixLQUFSLENBQWM2RSxNQUFkLEdBQXVCcEcsT0FBTyxDQUFDcUcsaUJBQS9CO0FBQ0FuRyxRQUFBQSxZQUFZLENBQUMsWUFBRCxFQUFlYSxvQkFBZixFQUFxQzJELENBQXJDLENBQVo7QUFDQSxlQUFPLEtBQVA7QUFDSCxPQWREOztBQWdCQTNFLE1BQUFBLE9BQU8sQ0FBQ3VHLFVBQVIsR0FBcUIsVUFBVTVCLENBQVYsRUFBYTtBQUM5QnRFLFFBQUFBLHNCQUFzQixDQUFDeUMsT0FBdkIsQ0FBK0IsVUFBQ0MscUJBQUQsRUFBMkI7QUFDdEQsY0FBSUEscUJBQXFCLENBQUNxRCxPQUExQixFQUFtQztBQUMvQnJELFlBQUFBLHFCQUFxQixDQUFDcUQsT0FBdEIsR0FBZ0MsS0FBaEM7QUFDQXBHLFlBQUFBLE9BQU8sQ0FBQ3dCLEtBQVIsQ0FBYzZFLE1BQWQsR0FBdUIsRUFBdkI7QUFDQWxHLFlBQUFBLFlBQVksQ0FBQyxZQUFELEVBQWU0QyxxQkFBZixFQUFzQzRCLENBQXRDLENBQVo7QUFDSDtBQUNKLFNBTkQsRUFNRyxJQU5IO0FBT0gsT0FSRDtBQVNIOztBQWpQb0Q7QUFrUHhEOzs7RUExUGtENkIsK0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgR2VuZXJhbEJhc2VSZW5kZXJlciBmcm9tICcuL2dlbmVyYWxCYXNlUmVuZGVyZXInXG5pbXBvcnQgTGlua2VkTGlzdCBmcm9tICcuLi9saWIvbGlua2VkTGlzdCdcbmltcG9ydCBIZWxwZXIgZnJvbSAnLi4vbGliL2hlbHBlcidcblxuLyoqXG4gKiBDYW52YXMg5riy5p+T5Zmo5oq96LGh57G7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdlbmVyYWxDYW52YXNCYXNlUmVuZGVyZXIgZXh0ZW5kcyBHZW5lcmFsQmFzZVJlbmRlcmVyIHtcbiAgICAvKipcbiAgICAgKiDlrp7kvovljJbkuIDkuKogQ2FudmFzIOa4suafk+WZqOaKveixoeexu1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbGVtZW50IC0gRWxlbWVudCDlhYPntKBcbiAgICAgKiBAcGFyYW0ge29wZW5CU0V+T3B0aW9uc30gb3B0aW9ucyAtIOWFqOWxgOmAiemhuVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbGVtZW50U2l6ZSAtIOWFg+e0oOWkp+Wwj1xuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50VHJpZ2dlciAtIOS6i+S7tuW8leWPkeaWueazlVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMsIGVsZW1lbnRTaXplLCBldmVudFRyaWdnZXIpIHtcbiAgICAgICAgaWYgKG5ldy50YXJnZXQgPT09IEdlbmVyYWxDYW52YXNCYXNlUmVuZGVyZXIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcigpO1xuICAgICAgICB9XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlsY/luZXkuIrnmoTlvLnluZVcbiAgICAgICAgICogQHByaXZhdGUgQHR5cGUge0xpbmtlZExpc3R9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgX2J1bGxldFNjcmVlbnNPblNjcmVlbiA9IG5ldyBMaW5rZWRMaXN0KCk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEUEkg57yp5pS+5q+U5L6L77yI5YCN5pWw77yJXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgX2RldmljZVBpeGVsUmF0aW8gPSBIZWxwZXIuZ2V0RGV2aWNlUGl4ZWxSYXRpbyh0cnVlKTtcbiAgICAgICAgX2RldmljZVBpeGVsUmF0aW8gKj0gb3B0aW9ucy5zY2FsaW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICog55S75biD5YWD57SgXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtFbGVtZW50fVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9jYW52YXMgPSBpbml0KCk7XG4gICAgICAgIHN1cGVyKF9jYW52YXMsIG9wdGlvbnMsIGVsZW1lbnRTaXplKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5riF6Zmk5bGP5bmV5YaF5a65XG4gICAgICAgICAqIEBmdW5jdGlvblxuICAgICAgICAgKiBAb3ZlcnJpZGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY2xlYW5TY3JlZW4gPSBfYnVsbGV0U2NyZWVuc09uU2NyZWVuLmNsZWFuO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliJvlu7rlvLnluZXlhYPntKBcbiAgICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBidWxsZXRTY3JlZW5PblNjcmVlbiAtIOWxj+W5leW8ueW5leWvueixoVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jcmVhdEFuZGdldFdpZHRoID0gZnVuY3Rpb24gKGJ1bGxldFNjcmVlbk9uU2NyZWVuKSB7XG4gICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuID0gYnVsbGV0U2NyZWVuT25TY3JlZW4uYnVsbGV0U2NyZWVuO1xuICAgICAgICAgICAgbGV0IGhpZGVDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgICAgIGxldCBoaWRlQ2FudmFzQ29udGV4dCA9IGhpZGVDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgICAgICAgaGlkZUNhbnZhc0NvbnRleHQuZm9udCA9IGAke2J1bGxldFNjcmVlbi5zdHlsZS5mb250V2VpZ2h0fSAke2J1bGxldFNjcmVlbk9uU2NyZWVuLnNpemV9cHggJHtidWxsZXRTY3JlZW4uc3R5bGUuZm9udEZhbWlseX1gO1xuICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4ud2lkdGggPSBoaWRlQ2FudmFzQ29udGV4dC5tZWFzdXJlVGV4dChidWxsZXRTY3JlZW4udGV4dCkud2lkdGg7IC8v5by55bmV55qE5a695bqm77ya5YOP57SgXG5cbiAgICAgICAgICAgIGhpZGVDYW52YXMud2lkdGggPSAoYnVsbGV0U2NyZWVuT25TY3JlZW4ud2lkdGggKyA4KSAqIF9kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgaGlkZUNhbnZhcy5oZWlnaHQgPSAoYnVsbGV0U2NyZWVuT25TY3JlZW4uaGVpZ2h0ICsgOCkgKiBfZGV2aWNlUGl4ZWxSYXRpbztcblxuICAgICAgICAgICAgaGlkZUNhbnZhc0NvbnRleHQuc2hhZG93Q29sb3IgPSAnYmxhY2snO1xuICAgICAgICAgICAgaGlkZUNhbnZhc0NvbnRleHQuZm9udCA9IGAke2J1bGxldFNjcmVlbi5zdHlsZS5mb250V2VpZ2h0fSAke2J1bGxldFNjcmVlbk9uU2NyZWVuLnNpemUgKiBfZGV2aWNlUGl4ZWxSYXRpb31weCAke2J1bGxldFNjcmVlbi5zdHlsZS5mb250RmFtaWx5fWA7XG4gICAgICAgICAgICBsZXQgdGV4dFggPSA0ICogX2RldmljZVBpeGVsUmF0aW87XG4gICAgICAgICAgICBsZXQgdGV4dFkgPSAoNCArIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnNpemUgKiAwLjgpICogX2RldmljZVBpeGVsUmF0aW87XG4gICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuLnN0eWxlLmNvbG9yICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzQ29udGV4dC5zaGFkb3dCbHVyID0gKGJ1bGxldFNjcmVlbi5zdHlsZS5zaGFkb3dCbHVyICsgMC41KSAqIF9kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgICAgIGhpZGVDYW52YXNDb250ZXh0LmZpbGxTdHlsZSA9IGJ1bGxldFNjcmVlbi5zdHlsZS5jb2xvcjtcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzQ29udGV4dC5maWxsVGV4dChidWxsZXRTY3JlZW4udGV4dCwgdGV4dFgsIHRleHRZKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW4uc3R5bGUuYm9yZGVyQ29sb3IgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGhpZGVDYW52YXNDb250ZXh0LnNoYWRvd0JsdXIgPSAwO1xuICAgICAgICAgICAgICAgIGhpZGVDYW52YXNDb250ZXh0LmxpbmVXaWR0aCA9IDAuNSAqIF9kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgICAgIGhpZGVDYW52YXNDb250ZXh0LnN0cm9rZVN0eWxlID0gYnVsbGV0U2NyZWVuLnN0eWxlLmJvcmRlckNvbG9yO1xuICAgICAgICAgICAgICAgIGhpZGVDYW52YXNDb250ZXh0LnN0cm9rZVRleHQoYnVsbGV0U2NyZWVuLnRleHQsIHRleHRYLCB0ZXh0WSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuLnN0eWxlLmJveENvbG9yICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzQ29udGV4dC5zaGFkb3dCbHVyID0gMDtcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzQ29udGV4dC5saW5lV2lkdGggPSBfZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzQ29udGV4dC5zdHJva2VTdHlsZSA9IGJ1bGxldFNjcmVlbi5zdHlsZS5ib3hDb2xvcjtcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzQ29udGV4dC5zdHJva2VSZWN0KF9kZXZpY2VQaXhlbFJhdGlvLCBfZGV2aWNlUGl4ZWxSYXRpbywgaGlkZUNhbnZhcy53aWR0aCAtIF9kZXZpY2VQaXhlbFJhdGlvLCBoaWRlQ2FudmFzLmhlaWdodCAtIF9kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLmhpZGVDYW52YXMgPSBoaWRlQ2FudmFzO1xuXG4gICAgICAgICAgICBsZXQgZmxhZyA9IGZhbHNlO1xuICAgICAgICAgICAgX2J1bGxldFNjcmVlbnNPblNjcmVlbi5mb3JFYWNoKChfYnVsbGV0U2NyZWVuT25TY3JlZW4pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoX2J1bGxldFNjcmVlbk9uU2NyZWVuLmJ1bGxldFNjcmVlbi5sYXllciA8PSBidWxsZXRTY3JlZW4ubGF5ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZmxhZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGQ6IHsgZWxlbWVudDogYnVsbGV0U2NyZWVuT25TY3JlZW4sIGFkZFRvVXA6IGZhbHNlIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9wOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgICAgICBpZiAoIWZsYWcpIF9idWxsZXRTY3JlZW5zT25TY3JlZW4ucHVzaChidWxsZXRTY3JlZW5PblNjcmVlbiwgZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWIoOmZpOW8ueW5leWFg+e0oFxuICAgICAgICAgKiBAb3ZlcnJpZGVcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGJ1bGxldFNjcmVlbk9uU2NyZWVuIC0g5bGP5bmV5by55bmV5a+56LGhXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmRlbGV0ZSA9IChidWxsZXRTY3JlZW5PblNjcmVlbikgPT4gX2J1bGxldFNjcmVlbnNPblNjcmVlbi5mb3JFYWNoKChfYnVsbGV0U2NyZWVuT25TY3JlZW4pID0+XG4gICAgICAgICAgICBfYnVsbGV0U2NyZWVuT25TY3JlZW4gPT09IGJ1bGxldFNjcmVlbk9uU2NyZWVuID8geyByZW1vdmU6IHRydWUsIHN0b3A6IHRydWUgfSA6IG51bGwsIHRydWUpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDph43mlrDmt7vliqDlvLnluZVcbiAgICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBidWxsZXRTY3JlZW5PblNjcmVlbiAtIOWxj+W5leW8ueW5leWvueixoVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5yZUNyZWF0QW5kZ2V0V2lkdGggPSBmdW5jdGlvbiAoYnVsbGV0U2NyZWVuT25TY3JlZW4pIHtcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlKGJ1bGxldFNjcmVlbk9uU2NyZWVuKTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRBbmRnZXRXaWR0aChidWxsZXRTY3JlZW5PblNjcmVlbik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgX3NldFNpemUgPSB0aGlzLnNldFNpemU7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDorr7nva7lsLrlr7hcbiAgICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnNldFNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfc2V0U2l6ZSgpO1xuICAgICAgICAgICAgX2RldmljZVBpeGVsUmF0aW8gPSBIZWxwZXIuZ2V0RGV2aWNlUGl4ZWxSYXRpbygpO1xuICAgICAgICAgICAgX2RldmljZVBpeGVsUmF0aW8gKj0gb3B0aW9ucy5zY2FsaW5nO1xuICAgICAgICAgICAgX2NhbnZhcy53aWR0aCA9IGVsZW1lbnRTaXplLndpZHRoICogX2RldmljZVBpeGVsUmF0aW87XG4gICAgICAgICAgICBfY2FudmFzLmhlaWdodCA9IGVsZW1lbnRTaXplLmhlaWdodCAqIF9kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPlue8qeaUvuavlOS+i1xuICAgICAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSDnvKnmlL7mr5TkvotcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZ2V0RGV2aWNlUGl4ZWxSYXRpbyA9ICgpID0+IF9kZXZpY2VQaXhlbFJhdGlvO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bnlLvluIPlr7nosaFcbiAgICAgICAgICogQHJldHVybnMge0VsZW1lbnR9IOeUu+W4g+WvueixoVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5nZXRDYW52YXMgPSAoKSA9PiBfY2FudmFzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5blsY/luZXlvLnluZXlr7nosaFcbiAgICAgICAgICogQHJldHVybnMge0xpbmtlZExpc3R9IOeUu+W4g+WvueixoVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5nZXRCdWxsZXRTY3JlZW5zT25TY3JlZW4gPSAoKSA9PiBfYnVsbGV0U2NyZWVuc09uU2NyZWVuO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmt7vliqBDYW52YXNcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQHJldHVybnMge0VsZW1lbnR9IOeUu+W4g+WvueixoVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTsgLy9jYW52YXPlr7nosaFcbiAgICAgICAgICAgIEhlbHBlci5jbGVhbkVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gICAgICAgICAgICBjYW52YXMud2lkdGggPSBlbGVtZW50U2l6ZS53aWR0aCAqIF9kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IGVsZW1lbnRTaXplLmhlaWdodCAqIF9kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgcmVnaXN0ZXJFdmVudChjYW52YXMpOyAvL+azqOWGjOS6i+S7tuWTjeW6lOeoi+W6j1xuICAgICAgICAgICAgcmV0dXJuIGNhbnZhcztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBfY2hlY2tXaGV0aGVySGlkZSA9IHRoaXMuY2hlY2tXaGV0aGVySGlkZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOazqOWGjOS6i+S7tuWTjeW6lOeoi+W6j1xuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgLSDlhYPntKBcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHJlZ2lzdGVyRXZlbnQoZWxlbWVudCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0QnVsbGV0U2NyZWVuT25TY3JlZW5CeUxvY2F0aW9uKGxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgbGV0IF9idWxsZXRTY3JlZW5PblNjcmVlbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgX2J1bGxldFNjcmVlbnNPblNjcmVlbi5mb3JFYWNoKGZ1bmN0aW9uIChidWxsZXRTY3JlZW5PblNjcmVlbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoX2NoZWNrV2hldGhlckhpZGUoYnVsbGV0U2NyZWVuT25TY3JlZW4pKSByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIGxldCB4MSA9IGJ1bGxldFNjcmVlbk9uU2NyZWVuLnggLSA0O1xuICAgICAgICAgICAgICAgICAgICBsZXQgeDIgPSB4MSArIGJ1bGxldFNjcmVlbk9uU2NyZWVuLndpZHRoICsgODtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHkxID0gYnVsbGV0U2NyZWVuT25TY3JlZW4uYWN0dWFsWSAtIDQ7XG4gICAgICAgICAgICAgICAgICAgIGxldCB5MiA9IHkxICsgYnVsbGV0U2NyZWVuT25TY3JlZW4uaGVpZ2h0ICsgODtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2F0aW9uLnggPj0geDEgJiYgbG9jYXRpb24ueCA8PSB4MiAmJiBsb2NhdGlvbi55ID49IHkxICYmIGxvY2F0aW9uLnkgPD0geTIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9idWxsZXRTY3JlZW5PblNjcmVlbiA9IGJ1bGxldFNjcmVlbk9uU2NyZWVuO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgc3RvcDogdHJ1ZSB9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiBfYnVsbGV0U2NyZWVuT25TY3JlZW47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRMb2NhdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZ2V0T2Zmc2V0VG9wKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9mZnNldFRvcCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldFRvcCArPSBlbGVtZW50Lm9mZnNldFRvcDtcbiAgICAgICAgICAgICAgICAgICAgfSB3aGlsZSAoKGVsZW1lbnQgPSBlbGVtZW50Lm9mZnNldFBhcmVudCkgIT0gbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvZmZzZXRUb3A7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGdldE9mZnNldExlZnQoZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0TGVmdCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldExlZnQgKz0gZWxlbWVudC5vZmZzZXRMZWZ0O1xuICAgICAgICAgICAgICAgICAgICB9IHdoaWxlICgoZWxlbWVudCA9IGVsZW1lbnQub2Zmc2V0UGFyZW50KSAhPSBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9mZnNldExlZnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZS5vZmZzZXRYID09PSAndW5kZWZpbmVkJyB8fCBlLm9mZnNldFggPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlLmxheWVyWCA9PT0gJ3VuZGVmaW5lZCcgfHwgZS5sYXllclggPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZS5wYWdlWCA9PT0gJ3VuZGVmaW5lZCcgfHwgZS5wYWdlWCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkb2MgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucGFnZVggPSBlLmNsaWVudFggKyAoZG9jICYmIGRvYy5zY3JvbGxMZWZ0IHx8IGJvZHkgJiYgYm9keS5zY3JvbGxMZWZ0IHx8IDApIC0gKGRvYyAmJiBkb2MuY2xpZW50TGVmdCB8fCBib2R5ICYmIGJvZHkuY2xpZW50TGVmdCB8fCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnBhZ2VZID0gZS5jbGllbnRZICsgKGRvYyAmJiBkb2Muc2Nyb2xsVG9wIHx8IGJvZHkgJiYgYm9keS5zY3JvbGxUb3AgfHwgMCkgLSAoZG9jICYmIGRvYy5jbGllbnRUb3AgfHwgYm9keSAmJiBib2R5LmNsaWVudFRvcCB8fCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGUubGF5ZXJYID0gZS5wYWdlWCAtIGdldE9mZnNldExlZnQoZS50YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5sYXllclkgPSBlLnBhZ2VZIC0gZ2V0T2Zmc2V0VG9wKGUudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlLm9mZnNldFggPSBlLmxheWVyWCAtIGUudGFyZ2V0LmNsaWVudExlZnQ7XG4gICAgICAgICAgICAgICAgICAgIGUub2Zmc2V0WSA9IGUubGF5ZXJZIC0gZS50YXJnZXQuY2xpZW50VG9wO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB4OiBlLm9mZnNldFgsXG4gICAgICAgICAgICAgICAgICAgIHk6IGUub2Zmc2V0WVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8v5LiK5LiL5paH6I+c5Y2VXG4gICAgICAgICAgICBlbGVtZW50Lm9uY29udGV4dG1lbnUgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGxldCBidWxsZXRTY3JlZW5PblNjcmVlbiA9IGdldEJ1bGxldFNjcmVlbk9uU2NyZWVuQnlMb2NhdGlvbihnZXRMb2NhdGlvbihlKSk7XG4gICAgICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbk9uU2NyZWVuKVxuICAgICAgICAgICAgICAgICAgICBldmVudFRyaWdnZXIoJ2NvbnRleHRtZW51JywgYnVsbGV0U2NyZWVuT25TY3JlZW4sIGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvL+WNleWHu1xuICAgICAgICAgICAgZWxlbWVudC5vbmNsaWNrID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuT25TY3JlZW4gPSBnZXRCdWxsZXRTY3JlZW5PblNjcmVlbkJ5TG9jYXRpb24oZ2V0TG9jYXRpb24oZSkpO1xuICAgICAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW5PblNjcmVlbilcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRUcmlnZ2VyKCdjbGljaycsIGJ1bGxldFNjcmVlbk9uU2NyZWVuLCBlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy/pvKDmoIfnp7vliqhcbiAgICAgICAgICAgIGVsZW1lbnQub25tb3VzZW1vdmUgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGxldCBidWxsZXRTY3JlZW5PblNjcmVlbiA9IGdldEJ1bGxldFNjcmVlbk9uU2NyZWVuQnlMb2NhdGlvbihnZXRMb2NhdGlvbihlKSk7XG4gICAgICAgICAgICAgICAgX2J1bGxldFNjcmVlbnNPblNjcmVlbi5mb3JFYWNoKChfYnVsbGV0U2NyZWVuT25TY3JlZW4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbk9uU2NyZWVuICE9IF9idWxsZXRTY3JlZW5PblNjcmVlbiAmJiBfYnVsbGV0U2NyZWVuT25TY3JlZW4ubW91c2Vpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2J1bGxldFNjcmVlbk9uU2NyZWVuLm1vdXNlaW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuY3Vyc29yID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudFRyaWdnZXIoJ21vdXNlbGVhdmUnLCBfYnVsbGV0U2NyZWVuT25TY3JlZW4sIGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbk9uU2NyZWVuID09PSBudWxsIHx8IGJ1bGxldFNjcmVlbk9uU2NyZWVuLm1vdXNlaW4pIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi5tb3VzZWluID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLmN1cnNvciA9IG9wdGlvbnMuY3Vyc29yT25Nb3VzZU92ZXI7XG4gICAgICAgICAgICAgICAgZXZlbnRUcmlnZ2VyKCdtb3VzZWVudGVyJywgYnVsbGV0U2NyZWVuT25TY3JlZW4sIGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8v6byg5qCH56a75byAXG4gICAgICAgICAgICBlbGVtZW50Lm9ubW91c2VvdXQgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIF9idWxsZXRTY3JlZW5zT25TY3JlZW4uZm9yRWFjaCgoX2J1bGxldFNjcmVlbk9uU2NyZWVuKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfYnVsbGV0U2NyZWVuT25TY3JlZW4ubW91c2Vpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2J1bGxldFNjcmVlbk9uU2NyZWVuLm1vdXNlaW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuY3Vyc29yID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudFRyaWdnZXIoJ21vdXNlbGVhdmUnLCBfYnVsbGV0U2NyZWVuT25TY3JlZW4sIGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbiJdLCJmaWxlIjoicmVuZGVyZXJzL2dlbmVyYWxDYW52YXNCYXNlUmVuZGVyZXIuanMifQ==
