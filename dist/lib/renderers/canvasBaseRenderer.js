"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CanvasBaseRenderer = void 0;

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.object.create");

require("core-js/modules/es6.object.set-prototype-of");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.for-each");

var _baseRenderer = require("./baseRenderer");

var _linkedList = require("../linkedList");

var _helper = require("../helper");

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
var CanvasBaseRenderer = function (_BaseRenderer) {
  _inherits(CanvasBaseRenderer, _BaseRenderer);

  /**
   * 实例化一个 Canvas 渲染器抽象类
   * @param {object} element - Element 元素
   * @param {openBSE~Options} options - 全局选项
   * @param {object} elementSize - 元素大小
   * @param {function} eventTrigger - 事件引发方法
   */
  function CanvasBaseRenderer(element, options, elementSize, eventTrigger) {
    var _this;

    _classCallCheck(this, CanvasBaseRenderer);

    if ((this instanceof CanvasBaseRenderer ? this.constructor : void 0) === CanvasBaseRenderer) {
      throw new SyntaxError();
    }
    /**
     * 屏幕上的弹幕
     * @private @type {LinkedList}
     */


    var _bulletScreensOnScreen = new _linkedList.LinkedList();
    /**
     * DPI 缩放比例（倍数）
     * @private @type {number}
     */


    var _devicePixelRatio = _helper.Helper.getDevicePixelRatio(true);

    _devicePixelRatio *= options.scaling;
    /**
     * 画布元素
     * @private @type {Element}
     */

    var _canvas = init();

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CanvasBaseRenderer).call(this, _canvas, options, elementSize));
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
      if (_bulletScreensOnScreen.getLength() === 0) _bulletScreensOnScreen.push(bulletScreenOnScreen, true);
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


    _this.delete = function (bulletScreenOnScreen) {
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
      this.delete(bulletScreenOnScreen);
      this.creatAndgetWidth(bulletScreenOnScreen);
    };

    var _setSize = _this.setSize;
    /**
     * 设置尺寸
     * @override
     */

    _this.setSize = function () {
      _setSize();

      _devicePixelRatio = _helper.Helper.getDevicePixelRatio();
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

      _helper.Helper.cleanElement(element);

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

  return CanvasBaseRenderer;
}(_baseRenderer.BaseRenderer);

exports.CanvasBaseRenderer = CanvasBaseRenderer;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9yZW5kZXJlcnMvY2FudmFzQmFzZVJlbmRlcmVyLmpzIl0sIm5hbWVzIjpbIkNhbnZhc0Jhc2VSZW5kZXJlciIsImVsZW1lbnQiLCJvcHRpb25zIiwiZWxlbWVudFNpemUiLCJldmVudFRyaWdnZXIiLCJTeW50YXhFcnJvciIsIl9idWxsZXRTY3JlZW5zT25TY3JlZW4iLCJMaW5rZWRMaXN0IiwiX2RldmljZVBpeGVsUmF0aW8iLCJIZWxwZXIiLCJnZXREZXZpY2VQaXhlbFJhdGlvIiwic2NhbGluZyIsIl9jYW52YXMiLCJpbml0IiwiY2xlYW5TY3JlZW4iLCJjbGVhbiIsImNyZWF0QW5kZ2V0V2lkdGgiLCJidWxsZXRTY3JlZW5PblNjcmVlbiIsImJ1bGxldFNjcmVlbiIsImhpZGVDYW52YXMiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJoaWRlQ2FudmFzQ29udGV4dCIsImdldENvbnRleHQiLCJmb250Iiwic3R5bGUiLCJmb250V2VpZ2h0Iiwic2l6ZSIsImZvbnRGYW1pbHkiLCJ3aWR0aCIsIm1lYXN1cmVUZXh0IiwidGV4dCIsImhlaWdodCIsInNoYWRvd0NvbG9yIiwidGV4dFgiLCJ0ZXh0WSIsImNvbG9yIiwic2hhZG93Qmx1ciIsImZpbGxTdHlsZSIsImZpbGxUZXh0IiwiYm9yZGVyQ29sb3IiLCJsaW5lV2lkdGgiLCJzdHJva2VTdHlsZSIsInN0cm9rZVRleHQiLCJib3hDb2xvciIsInN0cm9rZVJlY3QiLCJnZXRMZW5ndGgiLCJwdXNoIiwiZmxhZyIsImZvckVhY2giLCJfYnVsbGV0U2NyZWVuT25TY3JlZW4iLCJsYXllciIsImFkZCIsImFkZFRvVXAiLCJzdG9wIiwiZGVsZXRlIiwicmVtb3ZlIiwicmVDcmVhdEFuZGdldFdpZHRoIiwiX3NldFNpemUiLCJzZXRTaXplIiwiZ2V0Q2FudmFzIiwiZ2V0QnVsbGV0U2NyZWVuc09uU2NyZWVuIiwiY2FudmFzIiwiY2xlYW5FbGVtZW50IiwiYXBwZW5kQ2hpbGQiLCJyZWdpc3RlckV2ZW50IiwiX2NoZWNrV2hldGhlckhpZGUiLCJjaGVja1doZXRoZXJIaWRlIiwiZ2V0QnVsbGV0U2NyZWVuT25TY3JlZW5CeUxvY2F0aW9uIiwibG9jYXRpb24iLCJ4MSIsIngiLCJ4MiIsInkxIiwiYWN0dWFsWSIsInkyIiwieSIsImdldExvY2F0aW9uIiwiZSIsImdldE9mZnNldFRvcCIsIm9mZnNldFRvcCIsIm9mZnNldFBhcmVudCIsImdldE9mZnNldExlZnQiLCJvZmZzZXRMZWZ0Iiwib2Zmc2V0WCIsImxheWVyWCIsInBhZ2VYIiwiZG9jIiwiZG9jdW1lbnRFbGVtZW50IiwiYm9keSIsImNsaWVudFgiLCJzY3JvbGxMZWZ0IiwiY2xpZW50TGVmdCIsInBhZ2VZIiwiY2xpZW50WSIsInNjcm9sbFRvcCIsImNsaWVudFRvcCIsInRhcmdldCIsImxheWVyWSIsIm9mZnNldFkiLCJvbmNvbnRleHRtZW51Iiwib25jbGljayIsIm9ubW91c2Vtb3ZlIiwibW91c2VpbiIsImN1cnNvciIsImN1cnNvck9uTW91c2VPdmVyIiwib25tb3VzZW91dCIsIkJhc2VSZW5kZXJlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7O0lBR01BLGtCOzs7QUFDRjs7Ozs7OztBQU9BLDhCQUFZQyxPQUFaLEVBQXFCQyxPQUFyQixFQUE4QkMsV0FBOUIsRUFBMkNDLFlBQTNDLEVBQXlEO0FBQUE7O0FBQUE7O0FBQ3JELFFBQUkscUVBQWVKLGtCQUFuQixFQUF1QztBQUNuQyxZQUFNLElBQUlLLFdBQUosRUFBTjtBQUNIO0FBQ0Q7Ozs7OztBQUlBLFFBQUlDLHNCQUFzQixHQUFHLElBQUlDLHNCQUFKLEVBQTdCO0FBQ0E7Ozs7OztBQUlBLFFBQUlDLGlCQUFpQixHQUFHQyxlQUFPQyxtQkFBUCxDQUEyQixJQUEzQixDQUF4Qjs7QUFDQUYsSUFBQUEsaUJBQWlCLElBQUlOLE9BQU8sQ0FBQ1MsT0FBN0I7QUFDQTs7Ozs7QUFJQSxRQUFJQyxP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QixLQUFLLElBQXpCLElBQWlDQSxvQkFBb0IsQ0FBQ3NGLE9BQTFELEVBQW1FLE9BQU8sS0FBUDtBQUNuRXRGLFFBQUFBLG9CQUFvQixDQUFDc0YsT0FBckIsR0FBK0IsSUFBL0I7QUFDQXRHLFFBQUFBLE9BQU8sQ0FBQ3dCLEtBQVIsQ0FBYytFLE1BQWQsR0FBdUJ0RyxPQUFPLENBQUN1RyxpQkFBL0I7QUFDQXJHLFFBQUFBLFlBQVksQ0FBQyxZQUFELEVBQWVhLG9CQUFmLEVBQXFDNkQsQ0FBckMsQ0FBWjtBQUNBLGVBQU8sS0FBUDtBQUNILE9BZEQ7O0FBZ0JBN0UsTUFBQUEsT0FBTyxDQUFDeUcsVUFBUixHQUFxQixVQUFVNUIsQ0FBVixFQUFhO0FBQzlCeEUsUUFBQUEsc0JBQXNCLENBQUMyQyxPQUF2QixDQUErQixVQUFDQyxxQkFBRCxFQUEyQjtBQUN0RCxjQUFJQSxxQkFBcUIsQ0FBQ3FELE9BQTFCLEVBQW1DO0FBQy9CckQsWUFBQUEscUJBQXFCLENBQUNxRCxPQUF0QixHQUFnQyxLQUFoQztBQUNBdEcsWUFBQUEsT0FBTyxDQUFDd0IsS0FBUixDQUFjK0UsTUFBZCxHQUF1QixFQUF2QjtBQUNBcEcsWUFBQUEsWUFBWSxDQUFDLFlBQUQsRUFBZThDLHFCQUFmLEVBQXNDNEIsQ0FBdEMsQ0FBWjtBQUNIO0FBQ0osU0FORCxFQU1HLElBTkg7QUFPSCxPQVJEO0FBU0g7O0FBbFBvRDtBQW1QeEQ7OztFQTNQNEI2QiwwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJhc2VSZW5kZXJlciB9IGZyb20gJy4vYmFzZVJlbmRlcmVyJ1xuaW1wb3J0IHsgTGlua2VkTGlzdCB9IGZyb20gJy4uL2xpbmtlZExpc3QnXG5pbXBvcnQgeyBIZWxwZXIgfSBmcm9tICcuLi9oZWxwZXInXG5cbi8qKlxuICogQ2FudmFzIOa4suafk+WZqOaKveixoeexu1xuICovXG5jbGFzcyBDYW52YXNCYXNlUmVuZGVyZXIgZXh0ZW5kcyBCYXNlUmVuZGVyZXIge1xuICAgIC8qKlxuICAgICAqIOWunuS+i+WMluS4gOS4qiBDYW52YXMg5riy5p+T5Zmo5oq96LGh57G7XG4gICAgICogQHBhcmFtIHtvYmplY3R9IGVsZW1lbnQgLSBFbGVtZW50IOWFg+e0oFxuICAgICAqIEBwYXJhbSB7b3BlbkJTRX5PcHRpb25zfSBvcHRpb25zIC0g5YWo5bGA6YCJ6aG5XG4gICAgICogQHBhcmFtIHtvYmplY3R9IGVsZW1lbnRTaXplIC0g5YWD57Sg5aSn5bCPXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRUcmlnZ2VyIC0g5LqL5Lu25byV5Y+R5pa55rOVXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgb3B0aW9ucywgZWxlbWVudFNpemUsIGV2ZW50VHJpZ2dlcikge1xuICAgICAgICBpZiAobmV3LnRhcmdldCA9PT0gQ2FudmFzQmFzZVJlbmRlcmVyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoKTtcbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICog5bGP5bmV5LiK55qE5by55bmVXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtMaW5rZWRMaXN0fVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9idWxsZXRTY3JlZW5zT25TY3JlZW4gPSBuZXcgTGlua2VkTGlzdCgpO1xuICAgICAgICAvKipcbiAgICAgICAgICogRFBJIOe8qeaUvuavlOS+i++8iOWAjeaVsO+8iVxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9kZXZpY2VQaXhlbFJhdGlvID0gSGVscGVyLmdldERldmljZVBpeGVsUmF0aW8odHJ1ZSk7XG4gICAgICAgIF9kZXZpY2VQaXhlbFJhdGlvICo9IG9wdGlvbnMuc2NhbGluZztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOeUu+W4g+WFg+e0oFxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7RWxlbWVudH1cbiAgICAgICAgICovXG4gICAgICAgIGxldCBfY2FudmFzID0gaW5pdCgpO1xuICAgICAgICBzdXBlcihfY2FudmFzLCBvcHRpb25zLCBlbGVtZW50U2l6ZSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa4hemZpOWxj+W5leWGheWuuVxuICAgICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmNsZWFuU2NyZWVuID0gX2J1bGxldFNjcmVlbnNPblNjcmVlbi5jbGVhbjtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yib5bu65by55bmV5YWD57SgXG4gICAgICAgICAqIEBvdmVycmlkZVxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gYnVsbGV0U2NyZWVuT25TY3JlZW4gLSDlsY/luZXlvLnluZXlr7nosaFcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY3JlYXRBbmRnZXRXaWR0aCA9IGZ1bmN0aW9uIChidWxsZXRTY3JlZW5PblNjcmVlbikge1xuICAgICAgICAgICAgbGV0IGJ1bGxldFNjcmVlbiA9IGJ1bGxldFNjcmVlbk9uU2NyZWVuLmJ1bGxldFNjcmVlbjtcbiAgICAgICAgICAgIGxldCBoaWRlQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgICAgICBsZXQgaGlkZUNhbnZhc0NvbnRleHQgPSBoaWRlQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgICAgICAgIGhpZGVDYW52YXNDb250ZXh0LmZvbnQgPSBgJHtidWxsZXRTY3JlZW4uc3R5bGUuZm9udFdlaWdodH0gJHtidWxsZXRTY3JlZW5PblNjcmVlbi5zaXplfXB4ICR7YnVsbGV0U2NyZWVuLnN0eWxlLmZvbnRGYW1pbHl9YDtcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLndpZHRoID0gaGlkZUNhbnZhc0NvbnRleHQubWVhc3VyZVRleHQoYnVsbGV0U2NyZWVuLnRleHQpLndpZHRoOyAvL+W8ueW5leeahOWuveW6pu+8muWDj+e0oFxuXG4gICAgICAgICAgICBoaWRlQ2FudmFzLndpZHRoID0gKGJ1bGxldFNjcmVlbk9uU2NyZWVuLndpZHRoICsgOCkgKiBfZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICAgIGhpZGVDYW52YXMuaGVpZ2h0ID0gKGJ1bGxldFNjcmVlbk9uU2NyZWVuLmhlaWdodCArIDgpICogX2RldmljZVBpeGVsUmF0aW87XG5cbiAgICAgICAgICAgIGhpZGVDYW52YXNDb250ZXh0LnNoYWRvd0NvbG9yID0gJ2JsYWNrJztcbiAgICAgICAgICAgIGhpZGVDYW52YXNDb250ZXh0LmZvbnQgPSBgJHtidWxsZXRTY3JlZW4uc3R5bGUuZm9udFdlaWdodH0gJHtidWxsZXRTY3JlZW5PblNjcmVlbi5zaXplICogX2RldmljZVBpeGVsUmF0aW99cHggJHtidWxsZXRTY3JlZW4uc3R5bGUuZm9udEZhbWlseX1gO1xuICAgICAgICAgICAgbGV0IHRleHRYID0gNCAqIF9kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgbGV0IHRleHRZID0gKDQgKyBidWxsZXRTY3JlZW5PblNjcmVlbi5zaXplICogMC44KSAqIF9kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbi5zdHlsZS5jb2xvciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaGlkZUNhbnZhc0NvbnRleHQuc2hhZG93Qmx1ciA9IChidWxsZXRTY3JlZW4uc3R5bGUuc2hhZG93Qmx1ciArIDAuNSkgKiBfZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzQ29udGV4dC5maWxsU3R5bGUgPSBidWxsZXRTY3JlZW4uc3R5bGUuY29sb3I7XG4gICAgICAgICAgICAgICAgaGlkZUNhbnZhc0NvbnRleHQuZmlsbFRleHQoYnVsbGV0U2NyZWVuLnRleHQsIHRleHRYLCB0ZXh0WSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuLnN0eWxlLmJvcmRlckNvbG9yICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzQ29udGV4dC5zaGFkb3dCbHVyID0gMDtcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzQ29udGV4dC5saW5lV2lkdGggPSAwLjUgKiBfZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzQ29udGV4dC5zdHJva2VTdHlsZSA9IGJ1bGxldFNjcmVlbi5zdHlsZS5ib3JkZXJDb2xvcjtcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzQ29udGV4dC5zdHJva2VUZXh0KGJ1bGxldFNjcmVlbi50ZXh0LCB0ZXh0WCwgdGV4dFkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbi5zdHlsZS5ib3hDb2xvciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaGlkZUNhbnZhc0NvbnRleHQuc2hhZG93Qmx1ciA9IDA7XG4gICAgICAgICAgICAgICAgaGlkZUNhbnZhc0NvbnRleHQubGluZVdpZHRoID0gX2RldmljZVBpeGVsUmF0aW87XG4gICAgICAgICAgICAgICAgaGlkZUNhbnZhc0NvbnRleHQuc3Ryb2tlU3R5bGUgPSBidWxsZXRTY3JlZW4uc3R5bGUuYm94Q29sb3I7XG4gICAgICAgICAgICAgICAgaGlkZUNhbnZhc0NvbnRleHQuc3Ryb2tlUmVjdChfZGV2aWNlUGl4ZWxSYXRpbywgX2RldmljZVBpeGVsUmF0aW8sIGhpZGVDYW52YXMud2lkdGggLSBfZGV2aWNlUGl4ZWxSYXRpbywgaGlkZUNhbnZhcy5oZWlnaHQgLSBfZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi5oaWRlQ2FudmFzID0gaGlkZUNhbnZhcztcblxuICAgICAgICAgICAgaWYgKF9idWxsZXRTY3JlZW5zT25TY3JlZW4uZ2V0TGVuZ3RoKCkgPT09IDApIF9idWxsZXRTY3JlZW5zT25TY3JlZW4ucHVzaChidWxsZXRTY3JlZW5PblNjcmVlbiwgdHJ1ZSk7XG4gICAgICAgICAgICBsZXQgZmxhZyA9IGZhbHNlO1xuICAgICAgICAgICAgX2J1bGxldFNjcmVlbnNPblNjcmVlbi5mb3JFYWNoKChfYnVsbGV0U2NyZWVuT25TY3JlZW4pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoX2J1bGxldFNjcmVlbk9uU2NyZWVuLmJ1bGxldFNjcmVlbi5sYXllciA8PSBidWxsZXRTY3JlZW4ubGF5ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZmxhZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGQ6IHsgZWxlbWVudDogYnVsbGV0U2NyZWVuT25TY3JlZW4sIGFkZFRvVXA6IGZhbHNlIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9wOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgICAgICBpZiAoIWZsYWcpIF9idWxsZXRTY3JlZW5zT25TY3JlZW4ucHVzaChidWxsZXRTY3JlZW5PblNjcmVlbiwgZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWIoOmZpOW8ueW5leWFg+e0oFxuICAgICAgICAgKiBAb3ZlcnJpZGVcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGJ1bGxldFNjcmVlbk9uU2NyZWVuIC0g5bGP5bmV5by55bmV5a+56LGhXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmRlbGV0ZSA9IChidWxsZXRTY3JlZW5PblNjcmVlbikgPT4gX2J1bGxldFNjcmVlbnNPblNjcmVlbi5mb3JFYWNoKChfYnVsbGV0U2NyZWVuT25TY3JlZW4pID0+XG4gICAgICAgICAgICBfYnVsbGV0U2NyZWVuT25TY3JlZW4gPT09IGJ1bGxldFNjcmVlbk9uU2NyZWVuID8geyByZW1vdmU6IHRydWUsIHN0b3A6IHRydWUgfSA6IG51bGwsIHRydWUpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDph43mlrDmt7vliqDlvLnluZVcbiAgICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBidWxsZXRTY3JlZW5PblNjcmVlbiAtIOWxj+W5leW8ueW5leWvueixoVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5yZUNyZWF0QW5kZ2V0V2lkdGggPSBmdW5jdGlvbiAoYnVsbGV0U2NyZWVuT25TY3JlZW4pIHtcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlKGJ1bGxldFNjcmVlbk9uU2NyZWVuKTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRBbmRnZXRXaWR0aChidWxsZXRTY3JlZW5PblNjcmVlbik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgX3NldFNpemUgPSB0aGlzLnNldFNpemU7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDorr7nva7lsLrlr7hcbiAgICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnNldFNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfc2V0U2l6ZSgpO1xuICAgICAgICAgICAgX2RldmljZVBpeGVsUmF0aW8gPSBIZWxwZXIuZ2V0RGV2aWNlUGl4ZWxSYXRpbygpO1xuICAgICAgICAgICAgX2RldmljZVBpeGVsUmF0aW8gKj0gb3B0aW9ucy5zY2FsaW5nO1xuICAgICAgICAgICAgX2NhbnZhcy53aWR0aCA9IGVsZW1lbnRTaXplLndpZHRoICogX2RldmljZVBpeGVsUmF0aW87XG4gICAgICAgICAgICBfY2FudmFzLmhlaWdodCA9IGVsZW1lbnRTaXplLmhlaWdodCAqIF9kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPlue8qeaUvuavlOS+i1xuICAgICAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSDnvKnmlL7mr5TkvotcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZ2V0RGV2aWNlUGl4ZWxSYXRpbyA9ICgpID0+IF9kZXZpY2VQaXhlbFJhdGlvO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bnlLvluIPlr7nosaFcbiAgICAgICAgICogQHJldHVybnMge0VsZW1lbnR9IOeUu+W4g+WvueixoVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5nZXRDYW52YXMgPSAoKSA9PiBfY2FudmFzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5blsY/luZXlvLnluZXlr7nosaFcbiAgICAgICAgICogQHJldHVybnMge0xpbmtlZExpc3R9IOeUu+W4g+WvueixoVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5nZXRCdWxsZXRTY3JlZW5zT25TY3JlZW4gPSAoKSA9PiBfYnVsbGV0U2NyZWVuc09uU2NyZWVuO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmt7vliqBDYW52YXNcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQHJldHVybnMge0VsZW1lbnR9IOeUu+W4g+WvueixoVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTsgLy9jYW52YXPlr7nosaFcbiAgICAgICAgICAgIEhlbHBlci5jbGVhbkVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gICAgICAgICAgICBjYW52YXMud2lkdGggPSBlbGVtZW50U2l6ZS53aWR0aCAqIF9kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IGVsZW1lbnRTaXplLmhlaWdodCAqIF9kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgcmVnaXN0ZXJFdmVudChjYW52YXMpOyAvL+azqOWGjOS6i+S7tuWTjeW6lOeoi+W6j1xuICAgICAgICAgICAgcmV0dXJuIGNhbnZhcztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBfY2hlY2tXaGV0aGVySGlkZSA9IHRoaXMuY2hlY2tXaGV0aGVySGlkZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOazqOWGjOS6i+S7tuWTjeW6lOeoi+W6j1xuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgLSDlhYPntKBcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHJlZ2lzdGVyRXZlbnQoZWxlbWVudCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0QnVsbGV0U2NyZWVuT25TY3JlZW5CeUxvY2F0aW9uKGxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgbGV0IF9idWxsZXRTY3JlZW5PblNjcmVlbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgX2J1bGxldFNjcmVlbnNPblNjcmVlbi5mb3JFYWNoKGZ1bmN0aW9uIChidWxsZXRTY3JlZW5PblNjcmVlbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoX2NoZWNrV2hldGhlckhpZGUoYnVsbGV0U2NyZWVuT25TY3JlZW4pKSByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIGxldCB4MSA9IGJ1bGxldFNjcmVlbk9uU2NyZWVuLnggLSA0O1xuICAgICAgICAgICAgICAgICAgICBsZXQgeDIgPSB4MSArIGJ1bGxldFNjcmVlbk9uU2NyZWVuLndpZHRoICsgODtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHkxID0gYnVsbGV0U2NyZWVuT25TY3JlZW4uYWN0dWFsWSAtIDQ7XG4gICAgICAgICAgICAgICAgICAgIGxldCB5MiA9IHkxICsgYnVsbGV0U2NyZWVuT25TY3JlZW4uaGVpZ2h0ICsgODtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2F0aW9uLnggPj0geDEgJiYgbG9jYXRpb24ueCA8PSB4MiAmJiBsb2NhdGlvbi55ID49IHkxICYmIGxvY2F0aW9uLnkgPD0geTIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9idWxsZXRTY3JlZW5PblNjcmVlbiA9IGJ1bGxldFNjcmVlbk9uU2NyZWVuO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgc3RvcDogdHJ1ZSB9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiBfYnVsbGV0U2NyZWVuT25TY3JlZW47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRMb2NhdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZ2V0T2Zmc2V0VG9wKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9mZnNldFRvcCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldFRvcCArPSBlbGVtZW50Lm9mZnNldFRvcDtcbiAgICAgICAgICAgICAgICAgICAgfSB3aGlsZSAoKGVsZW1lbnQgPSBlbGVtZW50Lm9mZnNldFBhcmVudCkgIT0gbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvZmZzZXRUb3A7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGdldE9mZnNldExlZnQoZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0TGVmdCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldExlZnQgKz0gZWxlbWVudC5vZmZzZXRMZWZ0O1xuICAgICAgICAgICAgICAgICAgICB9IHdoaWxlICgoZWxlbWVudCA9IGVsZW1lbnQub2Zmc2V0UGFyZW50KSAhPSBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9mZnNldExlZnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZS5vZmZzZXRYID09PSAndW5kZWZpbmVkJyB8fCBlLm9mZnNldFggPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlLmxheWVyWCA9PT0gJ3VuZGVmaW5lZCcgfHwgZS5sYXllclggPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZS5wYWdlWCA9PT0gJ3VuZGVmaW5lZCcgfHwgZS5wYWdlWCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkb2MgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucGFnZVggPSBlLmNsaWVudFggKyAoZG9jICYmIGRvYy5zY3JvbGxMZWZ0IHx8IGJvZHkgJiYgYm9keS5zY3JvbGxMZWZ0IHx8IDApIC0gKGRvYyAmJiBkb2MuY2xpZW50TGVmdCB8fCBib2R5ICYmIGJvZHkuY2xpZW50TGVmdCB8fCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnBhZ2VZID0gZS5jbGllbnRZICsgKGRvYyAmJiBkb2Muc2Nyb2xsVG9wIHx8IGJvZHkgJiYgYm9keS5zY3JvbGxUb3AgfHwgMCkgLSAoZG9jICYmIGRvYy5jbGllbnRUb3AgfHwgYm9keSAmJiBib2R5LmNsaWVudFRvcCB8fCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGUubGF5ZXJYID0gZS5wYWdlWCAtIGdldE9mZnNldExlZnQoZS50YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5sYXllclkgPSBlLnBhZ2VZIC0gZ2V0T2Zmc2V0VG9wKGUudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlLm9mZnNldFggPSBlLmxheWVyWCAtIGUudGFyZ2V0LmNsaWVudExlZnQ7XG4gICAgICAgICAgICAgICAgICAgIGUub2Zmc2V0WSA9IGUubGF5ZXJZIC0gZS50YXJnZXQuY2xpZW50VG9wO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB4OiBlLm9mZnNldFgsXG4gICAgICAgICAgICAgICAgICAgIHk6IGUub2Zmc2V0WVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8v5LiK5LiL5paH6I+c5Y2VXG4gICAgICAgICAgICBlbGVtZW50Lm9uY29udGV4dG1lbnUgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGxldCBidWxsZXRTY3JlZW5PblNjcmVlbiA9IGdldEJ1bGxldFNjcmVlbk9uU2NyZWVuQnlMb2NhdGlvbihnZXRMb2NhdGlvbihlKSk7XG4gICAgICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbk9uU2NyZWVuKVxuICAgICAgICAgICAgICAgICAgICBldmVudFRyaWdnZXIoJ2NvbnRleHRtZW51JywgYnVsbGV0U2NyZWVuT25TY3JlZW4sIGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvL+WNleWHu1xuICAgICAgICAgICAgZWxlbWVudC5vbmNsaWNrID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuT25TY3JlZW4gPSBnZXRCdWxsZXRTY3JlZW5PblNjcmVlbkJ5TG9jYXRpb24oZ2V0TG9jYXRpb24oZSkpO1xuICAgICAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW5PblNjcmVlbilcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRUcmlnZ2VyKCdjbGljaycsIGJ1bGxldFNjcmVlbk9uU2NyZWVuLCBlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy/pvKDmoIfnp7vliqhcbiAgICAgICAgICAgIGVsZW1lbnQub25tb3VzZW1vdmUgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGxldCBidWxsZXRTY3JlZW5PblNjcmVlbiA9IGdldEJ1bGxldFNjcmVlbk9uU2NyZWVuQnlMb2NhdGlvbihnZXRMb2NhdGlvbihlKSk7XG4gICAgICAgICAgICAgICAgX2J1bGxldFNjcmVlbnNPblNjcmVlbi5mb3JFYWNoKChfYnVsbGV0U2NyZWVuT25TY3JlZW4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbk9uU2NyZWVuICE9IF9idWxsZXRTY3JlZW5PblNjcmVlbiAmJiBfYnVsbGV0U2NyZWVuT25TY3JlZW4ubW91c2Vpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2J1bGxldFNjcmVlbk9uU2NyZWVuLm1vdXNlaW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuY3Vyc29yID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudFRyaWdnZXIoJ21vdXNlbGVhdmUnLCBfYnVsbGV0U2NyZWVuT25TY3JlZW4sIGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbk9uU2NyZWVuID09PSBudWxsIHx8IGJ1bGxldFNjcmVlbk9uU2NyZWVuLm1vdXNlaW4pIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi5tb3VzZWluID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLmN1cnNvciA9IG9wdGlvbnMuY3Vyc29yT25Nb3VzZU92ZXI7XG4gICAgICAgICAgICAgICAgZXZlbnRUcmlnZ2VyKCdtb3VzZWVudGVyJywgYnVsbGV0U2NyZWVuT25TY3JlZW4sIGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8v6byg5qCH56a75byAXG4gICAgICAgICAgICBlbGVtZW50Lm9ubW91c2VvdXQgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIF9idWxsZXRTY3JlZW5zT25TY3JlZW4uZm9yRWFjaCgoX2J1bGxldFNjcmVlbk9uU2NyZWVuKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfYnVsbGV0U2NyZWVuT25TY3JlZW4ubW91c2Vpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2J1bGxldFNjcmVlbk9uU2NyZWVuLm1vdXNlaW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuY3Vyc29yID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudFRyaWdnZXIoJ21vdXNlbGVhdmUnLCBfYnVsbGV0U2NyZWVuT25TY3JlZW4sIGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7IENhbnZhc0Jhc2VSZW5kZXJlciB9OyJdLCJmaWxlIjoibGliL3JlbmRlcmVycy9jYW52YXNCYXNlUmVuZGVyZXIuanMifQ==
