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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9yZW5kZXJlcnMvY2FudmFzQmFzZVJlbmRlcmVyLmpzIl0sIm5hbWVzIjpbIkNhbnZhc0Jhc2VSZW5kZXJlciIsImVsZW1lbnQiLCJvcHRpb25zIiwiZWxlbWVudFNpemUiLCJldmVudFRyaWdnZXIiLCJTeW50YXhFcnJvciIsIl9idWxsZXRTY3JlZW5zT25TY3JlZW4iLCJMaW5rZWRMaXN0IiwiX2RldmljZVBpeGVsUmF0aW8iLCJIZWxwZXIiLCJnZXREZXZpY2VQaXhlbFJhdGlvIiwic2NhbGluZyIsIl9jYW52YXMiLCJpbml0IiwiY2xlYW5TY3JlZW4iLCJjbGVhbiIsImNyZWF0QW5kZ2V0V2lkdGgiLCJidWxsZXRTY3JlZW5PblNjcmVlbiIsImJ1bGxldFNjcmVlbiIsImhpZGVDYW52YXMiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJoaWRlQ2FudmFzQ29udGV4dCIsImdldENvbnRleHQiLCJmb250Iiwic3R5bGUiLCJmb250V2VpZ2h0Iiwic2l6ZSIsImZvbnRGYW1pbHkiLCJ3aWR0aCIsIm1lYXN1cmVUZXh0IiwidGV4dCIsImhlaWdodCIsInNoYWRvd0NvbG9yIiwidGV4dFgiLCJ0ZXh0WSIsImNvbG9yIiwic2hhZG93Qmx1ciIsImZpbGxTdHlsZSIsImZpbGxUZXh0IiwiYm9yZGVyQ29sb3IiLCJsaW5lV2lkdGgiLCJzdHJva2VTdHlsZSIsInN0cm9rZVRleHQiLCJib3hDb2xvciIsInN0cm9rZVJlY3QiLCJnZXRMZW5ndGgiLCJwdXNoIiwiZmxhZyIsImZvckVhY2giLCJfYnVsbGV0U2NyZWVuT25TY3JlZW4iLCJsYXllciIsImFkZCIsImFkZFRvVXAiLCJzdG9wIiwiZGVsZXRlIiwicmVtb3ZlIiwicmVDcmVhdEFuZGdldFdpZHRoIiwiX3NldFNpemUiLCJzZXRTaXplIiwiZ2V0Q2FudmFzIiwiZ2V0QnVsbGV0U2NyZWVuc09uU2NyZWVuIiwiY2FudmFzIiwiY2xlYW5FbGVtZW50IiwiYXBwZW5kQ2hpbGQiLCJyZWdpc3RlckV2ZW50IiwiX2NoZWNrV2hldGhlckhpZGUiLCJjaGVja1doZXRoZXJIaWRlIiwiZ2V0QnVsbGV0U2NyZWVuT25TY3JlZW5CeUxvY2F0aW9uIiwibG9jYXRpb24iLCJ4MSIsIngiLCJ4MiIsInkxIiwiYWN0dWFsWSIsInkyIiwieSIsImdldExvY2F0aW9uIiwiZSIsImdldE9mZnNldFRvcCIsIm9mZnNldFRvcCIsIm9mZnNldFBhcmVudCIsImdldE9mZnNldExlZnQiLCJvZmZzZXRMZWZ0Iiwib2Zmc2V0WCIsImxheWVyWCIsInBhZ2VYIiwiZG9jIiwiZG9jdW1lbnRFbGVtZW50IiwiYm9keSIsImNsaWVudFgiLCJzY3JvbGxMZWZ0IiwiY2xpZW50TGVmdCIsInBhZ2VZIiwiY2xpZW50WSIsInNjcm9sbFRvcCIsImNsaWVudFRvcCIsInRhcmdldCIsImxheWVyWSIsIm9mZnNldFkiLCJvbmNvbnRleHRtZW51Iiwib25jbGljayIsIm9ubW91c2Vtb3ZlIiwibW91c2VpbiIsImN1cnNvciIsImN1cnNvck9uTW91c2VPdmVyIiwib25tb3VzZW91dCIsIkJhc2VSZW5kZXJlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7O0lBR01BLGtCOzs7QUFDRjs7Ozs7OztBQU9BLDhCQUFZQyxPQUFaLEVBQXFCQyxPQUFyQixFQUE4QkMsV0FBOUIsRUFBMkNDLFlBQTNDLEVBQXlEO0FBQUE7O0FBQUE7O0FBQ3JELFFBQUkscUVBQWVKLGtCQUFuQixFQUF1QztBQUNuQyxZQUFNLElBQUlLLFdBQUosRUFBTjtBQUNIO0FBQ0Q7Ozs7OztBQUlBLFFBQUlDLHNCQUFzQixHQUFHLElBQUlDLHNCQUFKLEVBQTdCO0FBQ0E7Ozs7OztBQUlBLFFBQUlDLGlCQUFpQixHQUFHQyxlQUFPQyxtQkFBUCxDQUEyQixJQUEzQixDQUF4Qjs7QUFDQUYsSUFBQUEsaUJBQWlCLElBQUlOLE9BQU8sQ0FBQ1MsT0FBN0I7QUFDQTs7Ozs7QUFJQSxRQUFJQyxP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QixLQUFLLElBQXpCLElBQWlDQSxvQkFBb0IsQ0FBQ3NGLE9BQTFELEVBQW1FLE9BQU8sS0FBUDtBQUNuRXRGLFFBQUFBLG9CQUFvQixDQUFDc0YsT0FBckIsR0FBK0IsSUFBL0I7QUFDQXRHLFFBQUFBLE9BQU8sQ0FBQ3dCLEtBQVIsQ0FBYytFLE1BQWQsR0FBdUJ0RyxPQUFPLENBQUN1RyxpQkFBL0I7QUFDQXJHLFFBQUFBLFlBQVksQ0FBQyxZQUFELEVBQWVhLG9CQUFmLEVBQXFDNkQsQ0FBckMsQ0FBWjtBQUNBLGVBQU8sS0FBUDtBQUNILE9BZEQ7O0FBZ0JBN0UsTUFBQUEsT0FBTyxDQUFDeUcsVUFBUixHQUFxQixVQUFVNUIsQ0FBVixFQUFhO0FBQzlCeEUsUUFBQUEsc0JBQXNCLENBQUMyQyxPQUF2QixDQUErQixVQUFDQyxxQkFBRCxFQUEyQjtBQUN0RCxjQUFJQSxxQkFBcUIsQ0FBQ3FELE9BQTFCLEVBQW1DO0FBQy9CckQsWUFBQUEscUJBQXFCLENBQUNxRCxPQUF0QixHQUFnQyxLQUFoQztBQUNBdEcsWUFBQUEsT0FBTyxDQUFDd0IsS0FBUixDQUFjK0UsTUFBZCxHQUF1QixFQUF2QjtBQUNBcEcsWUFBQUEsWUFBWSxDQUFDLFlBQUQsRUFBZThDLHFCQUFmLEVBQXNDNEIsQ0FBdEMsQ0FBWjtBQUNIO0FBQ0osU0FORCxFQU1HLElBTkg7QUFPSCxPQVJEO0FBU0g7O0FBbFBvRDtBQW1QeEQ7OztFQTNQNEI2QiwwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJhc2VSZW5kZXJlciB9IGZyb20gJy4vYmFzZVJlbmRlcmVyJ1xyXG5pbXBvcnQgeyBMaW5rZWRMaXN0IH0gZnJvbSAnLi4vbGlua2VkTGlzdCdcclxuaW1wb3J0IHsgSGVscGVyIH0gZnJvbSAnLi4vaGVscGVyJ1xyXG5cclxuLyoqXHJcbiAqIENhbnZhcyDmuLLmn5Plmajmir3osaHnsbtcclxuICovXHJcbmNsYXNzIENhbnZhc0Jhc2VSZW5kZXJlciBleHRlbmRzIEJhc2VSZW5kZXJlciB7XHJcbiAgICAvKipcclxuICAgICAqIOWunuS+i+WMluS4gOS4qiBDYW52YXMg5riy5p+T5Zmo5oq96LGh57G7XHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZWxlbWVudCAtIEVsZW1lbnQg5YWD57SgXHJcbiAgICAgKiBAcGFyYW0ge29wZW5CU0V+T3B0aW9uc30gb3B0aW9ucyAtIOWFqOWxgOmAiemhuVxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGVsZW1lbnRTaXplIC0g5YWD57Sg5aSn5bCPXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBldmVudFRyaWdnZXIgLSDkuovku7blvJXlj5Hmlrnms5VcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgb3B0aW9ucywgZWxlbWVudFNpemUsIGV2ZW50VHJpZ2dlcikge1xyXG4gICAgICAgIGlmIChuZXcudGFyZ2V0ID09PSBDYW52YXNCYXNlUmVuZGVyZXIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWxj+W5leS4iueahOW8ueW5lVxyXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtMaW5rZWRMaXN0fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCBfYnVsbGV0U2NyZWVuc09uU2NyZWVuID0gbmV3IExpbmtlZExpc3QoKTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEUEkg57yp5pS+5q+U5L6L77yI5YCN5pWw77yJXHJcbiAgICAgICAgICogQHByaXZhdGUgQHR5cGUge251bWJlcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgX2RldmljZVBpeGVsUmF0aW8gPSBIZWxwZXIuZ2V0RGV2aWNlUGl4ZWxSYXRpbyh0cnVlKTtcclxuICAgICAgICBfZGV2aWNlUGl4ZWxSYXRpbyAqPSBvcHRpb25zLnNjYWxpbmc7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog55S75biD5YWD57SgXHJcbiAgICAgICAgICogQHByaXZhdGUgQHR5cGUge0VsZW1lbnR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IF9jYW52YXMgPSBpbml0KCk7XHJcbiAgICAgICAgc3VwZXIoX2NhbnZhcywgb3B0aW9ucywgZWxlbWVudFNpemUpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmuIXpmaTlsY/luZXlhoXlrrlcclxuICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgKiBAb3ZlcnJpZGVcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNsZWFuU2NyZWVuID0gX2J1bGxldFNjcmVlbnNPblNjcmVlbi5jbGVhbjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5Yib5bu65by55bmV5YWD57SgXHJcbiAgICAgICAgICogQG92ZXJyaWRlXHJcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGJ1bGxldFNjcmVlbk9uU2NyZWVuIC0g5bGP5bmV5by55bmV5a+56LGhXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jcmVhdEFuZGdldFdpZHRoID0gZnVuY3Rpb24gKGJ1bGxldFNjcmVlbk9uU2NyZWVuKSB7XHJcbiAgICAgICAgICAgIGxldCBidWxsZXRTY3JlZW4gPSBidWxsZXRTY3JlZW5PblNjcmVlbi5idWxsZXRTY3JlZW47XHJcbiAgICAgICAgICAgIGxldCBoaWRlQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICAgICAgICAgIGxldCBoaWRlQ2FudmFzQ29udGV4dCA9IGhpZGVDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbiAgICAgICAgICAgIGhpZGVDYW52YXNDb250ZXh0LmZvbnQgPSBgJHtidWxsZXRTY3JlZW4uc3R5bGUuZm9udFdlaWdodH0gJHtidWxsZXRTY3JlZW5PblNjcmVlbi5zaXplfXB4ICR7YnVsbGV0U2NyZWVuLnN0eWxlLmZvbnRGYW1pbHl9YDtcclxuICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4ud2lkdGggPSBoaWRlQ2FudmFzQ29udGV4dC5tZWFzdXJlVGV4dChidWxsZXRTY3JlZW4udGV4dCkud2lkdGg7IC8v5by55bmV55qE5a695bqm77ya5YOP57SgXHJcblxyXG4gICAgICAgICAgICBoaWRlQ2FudmFzLndpZHRoID0gKGJ1bGxldFNjcmVlbk9uU2NyZWVuLndpZHRoICsgOCkgKiBfZGV2aWNlUGl4ZWxSYXRpbztcclxuICAgICAgICAgICAgaGlkZUNhbnZhcy5oZWlnaHQgPSAoYnVsbGV0U2NyZWVuT25TY3JlZW4uaGVpZ2h0ICsgOCkgKiBfZGV2aWNlUGl4ZWxSYXRpbztcclxuXHJcbiAgICAgICAgICAgIGhpZGVDYW52YXNDb250ZXh0LnNoYWRvd0NvbG9yID0gJ2JsYWNrJztcclxuICAgICAgICAgICAgaGlkZUNhbnZhc0NvbnRleHQuZm9udCA9IGAke2J1bGxldFNjcmVlbi5zdHlsZS5mb250V2VpZ2h0fSAke2J1bGxldFNjcmVlbk9uU2NyZWVuLnNpemUgKiBfZGV2aWNlUGl4ZWxSYXRpb31weCAke2J1bGxldFNjcmVlbi5zdHlsZS5mb250RmFtaWx5fWA7XHJcbiAgICAgICAgICAgIGxldCB0ZXh0WCA9IDQgKiBfZGV2aWNlUGl4ZWxSYXRpbztcclxuICAgICAgICAgICAgbGV0IHRleHRZID0gKDQgKyBidWxsZXRTY3JlZW5PblNjcmVlbi5zaXplICogMC44KSAqIF9kZXZpY2VQaXhlbFJhdGlvO1xyXG4gICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuLnN0eWxlLmNvbG9yICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGhpZGVDYW52YXNDb250ZXh0LnNoYWRvd0JsdXIgPSAoYnVsbGV0U2NyZWVuLnN0eWxlLnNoYWRvd0JsdXIgKyAwLjUpICogX2RldmljZVBpeGVsUmF0aW87XHJcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzQ29udGV4dC5maWxsU3R5bGUgPSBidWxsZXRTY3JlZW4uc3R5bGUuY29sb3I7XHJcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzQ29udGV4dC5maWxsVGV4dChidWxsZXRTY3JlZW4udGV4dCwgdGV4dFgsIHRleHRZKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuLnN0eWxlLmJvcmRlckNvbG9yICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGhpZGVDYW52YXNDb250ZXh0LnNoYWRvd0JsdXIgPSAwO1xyXG4gICAgICAgICAgICAgICAgaGlkZUNhbnZhc0NvbnRleHQubGluZVdpZHRoID0gMC41ICogX2RldmljZVBpeGVsUmF0aW87XHJcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzQ29udGV4dC5zdHJva2VTdHlsZSA9IGJ1bGxldFNjcmVlbi5zdHlsZS5ib3JkZXJDb2xvcjtcclxuICAgICAgICAgICAgICAgIGhpZGVDYW52YXNDb250ZXh0LnN0cm9rZVRleHQoYnVsbGV0U2NyZWVuLnRleHQsIHRleHRYLCB0ZXh0WSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbi5zdHlsZS5ib3hDb2xvciAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzQ29udGV4dC5zaGFkb3dCbHVyID0gMDtcclxuICAgICAgICAgICAgICAgIGhpZGVDYW52YXNDb250ZXh0LmxpbmVXaWR0aCA9IF9kZXZpY2VQaXhlbFJhdGlvO1xyXG4gICAgICAgICAgICAgICAgaGlkZUNhbnZhc0NvbnRleHQuc3Ryb2tlU3R5bGUgPSBidWxsZXRTY3JlZW4uc3R5bGUuYm94Q29sb3I7XHJcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzQ29udGV4dC5zdHJva2VSZWN0KF9kZXZpY2VQaXhlbFJhdGlvLCBfZGV2aWNlUGl4ZWxSYXRpbywgaGlkZUNhbnZhcy53aWR0aCAtIF9kZXZpY2VQaXhlbFJhdGlvLCBoaWRlQ2FudmFzLmhlaWdodCAtIF9kZXZpY2VQaXhlbFJhdGlvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi5oaWRlQ2FudmFzID0gaGlkZUNhbnZhcztcclxuXHJcbiAgICAgICAgICAgIGlmIChfYnVsbGV0U2NyZWVuc09uU2NyZWVuLmdldExlbmd0aCgpID09PSAwKSBfYnVsbGV0U2NyZWVuc09uU2NyZWVuLnB1c2goYnVsbGV0U2NyZWVuT25TY3JlZW4sIHRydWUpO1xyXG4gICAgICAgICAgICBsZXQgZmxhZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBfYnVsbGV0U2NyZWVuc09uU2NyZWVuLmZvckVhY2goKF9idWxsZXRTY3JlZW5PblNjcmVlbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9idWxsZXRTY3JlZW5PblNjcmVlbi5idWxsZXRTY3JlZW4ubGF5ZXIgPD0gYnVsbGV0U2NyZWVuLmxheWVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxhZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkOiB7IGVsZW1lbnQ6IGJ1bGxldFNjcmVlbk9uU2NyZWVuLCBhZGRUb1VwOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9wOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGlmICghZmxhZykgX2J1bGxldFNjcmVlbnNPblNjcmVlbi5wdXNoKGJ1bGxldFNjcmVlbk9uU2NyZWVuLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDliKDpmaTlvLnluZXlhYPntKBcclxuICAgICAgICAgKiBAb3ZlcnJpZGVcclxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gYnVsbGV0U2NyZWVuT25TY3JlZW4gLSDlsY/luZXlvLnluZXlr7nosaFcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmRlbGV0ZSA9IChidWxsZXRTY3JlZW5PblNjcmVlbikgPT4gX2J1bGxldFNjcmVlbnNPblNjcmVlbi5mb3JFYWNoKChfYnVsbGV0U2NyZWVuT25TY3JlZW4pID0+XHJcbiAgICAgICAgICAgIF9idWxsZXRTY3JlZW5PblNjcmVlbiA9PT0gYnVsbGV0U2NyZWVuT25TY3JlZW4gPyB7IHJlbW92ZTogdHJ1ZSwgc3RvcDogdHJ1ZSB9IDogbnVsbCwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOmHjeaWsOa3u+WKoOW8ueW5lVxyXG4gICAgICAgICAqIEBvdmVycmlkZVxyXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBidWxsZXRTY3JlZW5PblNjcmVlbiAtIOWxj+W5leW8ueW5leWvueixoVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMucmVDcmVhdEFuZGdldFdpZHRoID0gZnVuY3Rpb24gKGJ1bGxldFNjcmVlbk9uU2NyZWVuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlKGJ1bGxldFNjcmVlbk9uU2NyZWVuKTtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdEFuZGdldFdpZHRoKGJ1bGxldFNjcmVlbk9uU2NyZWVuKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBfc2V0U2l6ZSA9IHRoaXMuc2V0U2l6ZTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDorr7nva7lsLrlr7hcclxuICAgICAgICAgKiBAb3ZlcnJpZGVcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnNldFNpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIF9zZXRTaXplKCk7XHJcbiAgICAgICAgICAgIF9kZXZpY2VQaXhlbFJhdGlvID0gSGVscGVyLmdldERldmljZVBpeGVsUmF0aW8oKTtcclxuICAgICAgICAgICAgX2RldmljZVBpeGVsUmF0aW8gKj0gb3B0aW9ucy5zY2FsaW5nO1xyXG4gICAgICAgICAgICBfY2FudmFzLndpZHRoID0gZWxlbWVudFNpemUud2lkdGggKiBfZGV2aWNlUGl4ZWxSYXRpbztcclxuICAgICAgICAgICAgX2NhbnZhcy5oZWlnaHQgPSBlbGVtZW50U2l6ZS5oZWlnaHQgKiBfZGV2aWNlUGl4ZWxSYXRpbztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOiOt+WPlue8qeaUvuavlOS+i1xyXG4gICAgICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IOe8qeaUvuavlOS+i1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuZ2V0RGV2aWNlUGl4ZWxSYXRpbyA9ICgpID0+IF9kZXZpY2VQaXhlbFJhdGlvO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDojrflj5bnlLvluIPlr7nosaFcclxuICAgICAgICAgKiBAcmV0dXJucyB7RWxlbWVudH0g55S75biD5a+56LGhXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5nZXRDYW52YXMgPSAoKSA9PiBfY2FudmFzO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDojrflj5blsY/luZXlvLnluZXlr7nosaFcclxuICAgICAgICAgKiBAcmV0dXJucyB7TGlua2VkTGlzdH0g55S75biD5a+56LGhXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5nZXRCdWxsZXRTY3JlZW5zT25TY3JlZW4gPSAoKSA9PiBfYnVsbGV0U2NyZWVuc09uU2NyZWVuO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmt7vliqBDYW52YXNcclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqIEByZXR1cm5zIHtFbGVtZW50fSDnlLvluIPlr7nosaFcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgICAgICAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7IC8vY2FudmFz5a+56LGhXHJcbiAgICAgICAgICAgIEhlbHBlci5jbGVhbkVsZW1lbnQoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2FudmFzKTtcclxuICAgICAgICAgICAgY2FudmFzLndpZHRoID0gZWxlbWVudFNpemUud2lkdGggKiBfZGV2aWNlUGl4ZWxSYXRpbztcclxuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IGVsZW1lbnRTaXplLmhlaWdodCAqIF9kZXZpY2VQaXhlbFJhdGlvO1xyXG4gICAgICAgICAgICByZWdpc3RlckV2ZW50KGNhbnZhcyk7IC8v5rOo5YaM5LqL5Lu25ZON5bqU56iL5bqPXHJcbiAgICAgICAgICAgIHJldHVybiBjYW52YXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgX2NoZWNrV2hldGhlckhpZGUgPSB0aGlzLmNoZWNrV2hldGhlckhpZGU7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5rOo5YaM5LqL5Lu25ZON5bqU56iL5bqPXHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgLSDlhYPntKBcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiByZWdpc3RlckV2ZW50KGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0QnVsbGV0U2NyZWVuT25TY3JlZW5CeUxvY2F0aW9uKGxvY2F0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgX2J1bGxldFNjcmVlbk9uU2NyZWVuID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIF9idWxsZXRTY3JlZW5zT25TY3JlZW4uZm9yRWFjaChmdW5jdGlvbiAoYnVsbGV0U2NyZWVuT25TY3JlZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoX2NoZWNrV2hldGhlckhpZGUoYnVsbGV0U2NyZWVuT25TY3JlZW4pKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHgxID0gYnVsbGV0U2NyZWVuT25TY3JlZW4ueCAtIDQ7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHgyID0geDEgKyBidWxsZXRTY3JlZW5PblNjcmVlbi53aWR0aCArIDg7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHkxID0gYnVsbGV0U2NyZWVuT25TY3JlZW4uYWN0dWFsWSAtIDQ7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHkyID0geTEgKyBidWxsZXRTY3JlZW5PblNjcmVlbi5oZWlnaHQgKyA4O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2NhdGlvbi54ID49IHgxICYmIGxvY2F0aW9uLnggPD0geDIgJiYgbG9jYXRpb24ueSA+PSB5MSAmJiBsb2NhdGlvbi55IDw9IHkyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9idWxsZXRTY3JlZW5PblNjcmVlbiA9IGJ1bGxldFNjcmVlbk9uU2NyZWVuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBzdG9wOiB0cnVlIH07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9idWxsZXRTY3JlZW5PblNjcmVlbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRMb2NhdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBnZXRPZmZzZXRUb3AoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBvZmZzZXRUb3AgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0VG9wICs9IGVsZW1lbnQub2Zmc2V0VG9wO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gd2hpbGUgKChlbGVtZW50ID0gZWxlbWVudC5vZmZzZXRQYXJlbnQpICE9IG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvZmZzZXRUb3A7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBnZXRPZmZzZXRMZWZ0KGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0TGVmdCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXRMZWZ0ICs9IGVsZW1lbnQub2Zmc2V0TGVmdDtcclxuICAgICAgICAgICAgICAgICAgICB9IHdoaWxlICgoZWxlbWVudCA9IGVsZW1lbnQub2Zmc2V0UGFyZW50KSAhPSBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2Zmc2V0TGVmdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZS5vZmZzZXRYID09PSAndW5kZWZpbmVkJyB8fCBlLm9mZnNldFggPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGUubGF5ZXJYID09PSAndW5kZWZpbmVkJyB8fCBlLmxheWVyWCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGUucGFnZVggPT09ICd1bmRlZmluZWQnIHx8IGUucGFnZVggPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkb2MgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGJvZHkgPSBkb2N1bWVudC5ib2R5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wYWdlWCA9IGUuY2xpZW50WCArIChkb2MgJiYgZG9jLnNjcm9sbExlZnQgfHwgYm9keSAmJiBib2R5LnNjcm9sbExlZnQgfHwgMCkgLSAoZG9jICYmIGRvYy5jbGllbnRMZWZ0IHx8IGJvZHkgJiYgYm9keS5jbGllbnRMZWZ0IHx8IDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wYWdlWSA9IGUuY2xpZW50WSArIChkb2MgJiYgZG9jLnNjcm9sbFRvcCB8fCBib2R5ICYmIGJvZHkuc2Nyb2xsVG9wIHx8IDApIC0gKGRvYyAmJiBkb2MuY2xpZW50VG9wIHx8IGJvZHkgJiYgYm9keS5jbGllbnRUb3AgfHwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5sYXllclggPSBlLnBhZ2VYIC0gZ2V0T2Zmc2V0TGVmdChlLnRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUubGF5ZXJZID0gZS5wYWdlWSAtIGdldE9mZnNldFRvcChlLnRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGUub2Zmc2V0WCA9IGUubGF5ZXJYIC0gZS50YXJnZXQuY2xpZW50TGVmdDtcclxuICAgICAgICAgICAgICAgICAgICBlLm9mZnNldFkgPSBlLmxheWVyWSAtIGUudGFyZ2V0LmNsaWVudFRvcDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgeDogZS5vZmZzZXRYLFxyXG4gICAgICAgICAgICAgICAgICAgIHk6IGUub2Zmc2V0WVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy/kuIrkuIvmlofoj5zljZVcclxuICAgICAgICAgICAgZWxlbWVudC5vbmNvbnRleHRtZW51ID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIGxldCBidWxsZXRTY3JlZW5PblNjcmVlbiA9IGdldEJ1bGxldFNjcmVlbk9uU2NyZWVuQnlMb2NhdGlvbihnZXRMb2NhdGlvbihlKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuT25TY3JlZW4pXHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRUcmlnZ2VyKCdjb250ZXh0bWVudScsIGJ1bGxldFNjcmVlbk9uU2NyZWVuLCBlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgLy/ljZXlh7tcclxuICAgICAgICAgICAgZWxlbWVudC5vbmNsaWNrID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIGxldCBidWxsZXRTY3JlZW5PblNjcmVlbiA9IGdldEJ1bGxldFNjcmVlbk9uU2NyZWVuQnlMb2NhdGlvbihnZXRMb2NhdGlvbihlKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuT25TY3JlZW4pXHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRUcmlnZ2VyKCdjbGljaycsIGJ1bGxldFNjcmVlbk9uU2NyZWVuLCBlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgLy/pvKDmoIfnp7vliqhcclxuICAgICAgICAgICAgZWxlbWVudC5vbm1vdXNlbW92ZSA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuT25TY3JlZW4gPSBnZXRCdWxsZXRTY3JlZW5PblNjcmVlbkJ5TG9jYXRpb24oZ2V0TG9jYXRpb24oZSkpO1xyXG4gICAgICAgICAgICAgICAgX2J1bGxldFNjcmVlbnNPblNjcmVlbi5mb3JFYWNoKChfYnVsbGV0U2NyZWVuT25TY3JlZW4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuT25TY3JlZW4gIT0gX2J1bGxldFNjcmVlbk9uU2NyZWVuICYmIF9idWxsZXRTY3JlZW5PblNjcmVlbi5tb3VzZWluKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9idWxsZXRTY3JlZW5PblNjcmVlbi5tb3VzZWluID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuY3Vyc29yID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50VHJpZ2dlcignbW91c2VsZWF2ZScsIF9idWxsZXRTY3JlZW5PblNjcmVlbiwgZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuT25TY3JlZW4gPT09IG51bGwgfHwgYnVsbGV0U2NyZWVuT25TY3JlZW4ubW91c2VpbikgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4ubW91c2VpbiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLmN1cnNvciA9IG9wdGlvbnMuY3Vyc29yT25Nb3VzZU92ZXI7XHJcbiAgICAgICAgICAgICAgICBldmVudFRyaWdnZXIoJ21vdXNlZW50ZXInLCBidWxsZXRTY3JlZW5PblNjcmVlbiwgZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy/pvKDmoIfnprvlvIBcclxuICAgICAgICAgICAgZWxlbWVudC5vbm1vdXNlb3V0ID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIF9idWxsZXRTY3JlZW5zT25TY3JlZW4uZm9yRWFjaCgoX2J1bGxldFNjcmVlbk9uU2NyZWVuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9idWxsZXRTY3JlZW5PblNjcmVlbi5tb3VzZWluKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9idWxsZXRTY3JlZW5PblNjcmVlbi5tb3VzZWluID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuY3Vyc29yID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50VHJpZ2dlcignbW91c2VsZWF2ZScsIF9idWxsZXRTY3JlZW5PblNjcmVlbiwgZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7IENhbnZhc0Jhc2VSZW5kZXJlciB9OyJdLCJmaWxlIjoibGliL3JlbmRlcmVycy9jYW52YXNCYXNlUmVuZGVyZXIuanMifQ==
