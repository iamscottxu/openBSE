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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbmRlcmVycy9nZW5lcmFsQ2FudmFzQmFzZVJlbmRlcmVyLmpzIl0sIm5hbWVzIjpbIkdlbmVyYWxDYW52YXNCYXNlUmVuZGVyZXIiLCJlbGVtZW50Iiwib3B0aW9ucyIsImVsZW1lbnRTaXplIiwiZXZlbnRUcmlnZ2VyIiwiU3ludGF4RXJyb3IiLCJfYnVsbGV0U2NyZWVuc09uU2NyZWVuIiwiTGlua2VkTGlzdCIsIl9kZXZpY2VQaXhlbFJhdGlvIiwiSGVscGVyIiwiZ2V0RGV2aWNlUGl4ZWxSYXRpbyIsInNjYWxpbmciLCJfY2FudmFzIiwiaW5pdCIsImNsZWFuU2NyZWVuIiwiY2xlYW4iLCJjcmVhdEFuZGdldFdpZHRoIiwiYnVsbGV0U2NyZWVuT25TY3JlZW4iLCJidWxsZXRTY3JlZW4iLCJoaWRlQ2FudmFzIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaGlkZUNhbnZhc0NvbnRleHQiLCJnZXRDb250ZXh0IiwiZm9udCIsInN0eWxlIiwiZm9udFdlaWdodCIsInNpemUiLCJmb250RmFtaWx5Iiwid2lkdGgiLCJtZWFzdXJlVGV4dCIsInRleHQiLCJoZWlnaHQiLCJzaGFkb3dDb2xvciIsInRleHRYIiwidGV4dFkiLCJjb2xvciIsInNoYWRvd0JsdXIiLCJmaWxsU3R5bGUiLCJmaWxsVGV4dCIsImJvcmRlckNvbG9yIiwibGluZVdpZHRoIiwic3Ryb2tlU3R5bGUiLCJzdHJva2VUZXh0IiwiYm94Q29sb3IiLCJzdHJva2VSZWN0IiwiZ2V0TGVuZ3RoIiwicHVzaCIsImZsYWciLCJmb3JFYWNoIiwiX2J1bGxldFNjcmVlbk9uU2NyZWVuIiwibGF5ZXIiLCJhZGQiLCJhZGRUb1VwIiwic3RvcCIsInJlbW92ZSIsInJlQ3JlYXRBbmRnZXRXaWR0aCIsIl9zZXRTaXplIiwic2V0U2l6ZSIsImdldENhbnZhcyIsImdldEJ1bGxldFNjcmVlbnNPblNjcmVlbiIsImNhbnZhcyIsImNsZWFuRWxlbWVudCIsImFwcGVuZENoaWxkIiwicmVnaXN0ZXJFdmVudCIsIl9jaGVja1doZXRoZXJIaWRlIiwiY2hlY2tXaGV0aGVySGlkZSIsImdldEJ1bGxldFNjcmVlbk9uU2NyZWVuQnlMb2NhdGlvbiIsImxvY2F0aW9uIiwieDEiLCJ4IiwieDIiLCJ5MSIsImFjdHVhbFkiLCJ5MiIsInkiLCJnZXRMb2NhdGlvbiIsImUiLCJnZXRPZmZzZXRUb3AiLCJvZmZzZXRUb3AiLCJvZmZzZXRQYXJlbnQiLCJnZXRPZmZzZXRMZWZ0Iiwib2Zmc2V0TGVmdCIsIm9mZnNldFgiLCJsYXllclgiLCJwYWdlWCIsImRvYyIsImRvY3VtZW50RWxlbWVudCIsImJvZHkiLCJjbGllbnRYIiwic2Nyb2xsTGVmdCIsImNsaWVudExlZnQiLCJwYWdlWSIsImNsaWVudFkiLCJzY3JvbGxUb3AiLCJjbGllbnRUb3AiLCJ0YXJnZXQiLCJsYXllclkiLCJvZmZzZXRZIiwib25jb250ZXh0bWVudSIsIm9uY2xpY2siLCJvbm1vdXNlbW92ZSIsIm1vdXNlaW4iLCJjdXJzb3IiLCJjdXJzb3JPbk1vdXNlT3ZlciIsIm9ubW91c2VvdXQiLCJHZW5lcmFsQmFzZVJlbmRlcmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7O0lBR3FCQSx5Qjs7O0FBQ2pCOzs7Ozs7O0FBT0EscUNBQVlDLE9BQVosRUFBcUJDLE9BQXJCLEVBQThCQyxXQUE5QixFQUEyQ0MsWUFBM0MsRUFBeUQ7QUFBQTs7QUFBQTs7QUFDckQsUUFBSSw0RUFBZUoseUJBQW5CLEVBQThDO0FBQzFDLFlBQU0sSUFBSUssV0FBSixFQUFOO0FBQ0g7QUFDRDs7Ozs7O0FBSUEsUUFBSUMsc0JBQXNCLEdBQUcsSUFBSUMsc0JBQUosRUFBN0I7QUFDQTs7Ozs7O0FBSUEsUUFBSUMsaUJBQWlCLEdBQUdDLG1CQUFPQyxtQkFBUCxDQUEyQixJQUEzQixDQUF4Qjs7QUFDQUYsSUFBQUEsaUJBQWlCLElBQUlOLE9BQU8sQ0FBQ1Ms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QkFBb0IsS0FBSyxJQUF6QixJQUFpQ0Esb0JBQW9CLENBQUNxRixPQUExRCxFQUFtRSxPQUFPLEtBQVA7QUFDbkVyRixRQUFBQSxvQkFBb0IsQ0FBQ3FGLE9BQXJCLEdBQStCLElBQS9CO0FBQ0FyRyxRQUFBQSxPQUFPLENBQUN3QixLQUFSLENBQWM4RSxNQUFkLEdBQXVCckcsT0FBTyxDQUFDc0csaUJBQS9CO0FBQ0FwRyxRQUFBQSxZQUFZLENBQUMsWUFBRCxFQUFlYSxvQkFBZixFQUFxQzRELENBQXJDLENBQVo7QUFDQSxlQUFPLEtBQVA7QUFDSCxPQWREOztBQWdCQTVFLE1BQUFBLE9BQU8sQ0FBQ3dHLFVBQVIsR0FBcUIsVUFBVTVCLENBQVYsRUFBYTtBQUM5QnZFLFFBQUFBLHNCQUFzQixDQUFDMkMsT0FBdkIsQ0FBK0IsVUFBQ0MscUJBQUQsRUFBMkI7QUFDdEQsY0FBSUEscUJBQXFCLENBQUNvRCxPQUExQixFQUFtQztBQUMvQnBELFlBQUFBLHFCQUFxQixDQUFDb0QsT0FBdEIsR0FBZ0MsS0FBaEM7QUFDQXJHLFlBQUFBLE9BQU8sQ0FBQ3dCLEtBQVIsQ0FBYzhFLE1BQWQsR0FBdUIsRUFBdkI7QUFDQW5HLFlBQUFBLFlBQVksQ0FBQyxZQUFELEVBQWU4QyxxQkFBZixFQUFzQzJCLENBQXRDLENBQVo7QUFDSDtBQUNKLFNBTkQsRUFNRyxJQU5IO0FBT0gsT0FSRDtBQVNIOztBQWxQb0Q7QUFtUHhEOzs7RUEzUGtENkIsK0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgR2VuZXJhbEJhc2VSZW5kZXJlciBmcm9tICcuL2dlbmVyYWxCYXNlUmVuZGVyZXInXG5pbXBvcnQgTGlua2VkTGlzdCBmcm9tICcuLi9saWIvbGlua2VkTGlzdCdcbmltcG9ydCBIZWxwZXIgZnJvbSAnLi4vbGliL2hlbHBlcidcblxuLyoqXG4gKiBDYW52YXMg5riy5p+T5Zmo5oq96LGh57G7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdlbmVyYWxDYW52YXNCYXNlUmVuZGVyZXIgZXh0ZW5kcyBHZW5lcmFsQmFzZVJlbmRlcmVyIHtcbiAgICAvKipcbiAgICAgKiDlrp7kvovljJbkuIDkuKogQ2FudmFzIOa4suafk+WZqOaKveixoeexu1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbGVtZW50IC0gRWxlbWVudCDlhYPntKBcbiAgICAgKiBAcGFyYW0ge29wZW5CU0V+T3B0aW9uc30gb3B0aW9ucyAtIOWFqOWxgOmAiemhuVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbGVtZW50U2l6ZSAtIOWFg+e0oOWkp+Wwj1xuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGV2ZW50VHJpZ2dlciAtIOS6i+S7tuW8leWPkeaWueazlVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMsIGVsZW1lbnRTaXplLCBldmVudFRyaWdnZXIpIHtcbiAgICAgICAgaWYgKG5ldy50YXJnZXQgPT09IEdlbmVyYWxDYW52YXNCYXNlUmVuZGVyZXIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcigpO1xuICAgICAgICB9XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlsY/luZXkuIrnmoTlvLnluZVcbiAgICAgICAgICogQHByaXZhdGUgQHR5cGUge0xpbmtlZExpc3R9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgX2J1bGxldFNjcmVlbnNPblNjcmVlbiA9IG5ldyBMaW5rZWRMaXN0KCk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEUEkg57yp5pS+5q+U5L6L77yI5YCN5pWw77yJXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgX2RldmljZVBpeGVsUmF0aW8gPSBIZWxwZXIuZ2V0RGV2aWNlUGl4ZWxSYXRpbyh0cnVlKTtcbiAgICAgICAgX2RldmljZVBpeGVsUmF0aW8gKj0gb3B0aW9ucy5zY2FsaW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICog55S75biD5YWD57SgXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtFbGVtZW50fVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9jYW52YXMgPSBpbml0KCk7XG4gICAgICAgIHN1cGVyKF9jYW52YXMsIG9wdGlvbnMsIGVsZW1lbnRTaXplKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5riF6Zmk5bGP5bmV5YaF5a65XG4gICAgICAgICAqIEBmdW5jdGlvblxuICAgICAgICAgKiBAb3ZlcnJpZGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY2xlYW5TY3JlZW4gPSBfYnVsbGV0U2NyZWVuc09uU2NyZWVuLmNsZWFuO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliJvlu7rlvLnluZXlhYPntKBcbiAgICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBidWxsZXRTY3JlZW5PblNjcmVlbiAtIOWxj+W5leW8ueW5leWvueixoVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jcmVhdEFuZGdldFdpZHRoID0gZnVuY3Rpb24gKGJ1bGxldFNjcmVlbk9uU2NyZWVuKSB7XG4gICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuID0gYnVsbGV0U2NyZWVuT25TY3JlZW4uYnVsbGV0U2NyZWVuO1xuICAgICAgICAgICAgbGV0IGhpZGVDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgICAgIGxldCBoaWRlQ2FudmFzQ29udGV4dCA9IGhpZGVDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgICAgICAgaGlkZUNhbnZhc0NvbnRleHQuZm9udCA9IGAke2J1bGxldFNjcmVlbi5zdHlsZS5mb250V2VpZ2h0fSAke2J1bGxldFNjcmVlbk9uU2NyZWVuLnNpemV9cHggJHtidWxsZXRTY3JlZW4uc3R5bGUuZm9udEZhbWlseX1gO1xuICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4ud2lkdGggPSBoaWRlQ2FudmFzQ29udGV4dC5tZWFzdXJlVGV4dChidWxsZXRTY3JlZW4udGV4dCkud2lkdGg7IC8v5by55bmV55qE5a695bqm77ya5YOP57SgXG5cbiAgICAgICAgICAgIGhpZGVDYW52YXMud2lkdGggPSAoYnVsbGV0U2NyZWVuT25TY3JlZW4ud2lkdGggKyA4KSAqIF9kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgaGlkZUNhbnZhcy5oZWlnaHQgPSAoYnVsbGV0U2NyZWVuT25TY3JlZW4uaGVpZ2h0ICsgOCkgKiBfZGV2aWNlUGl4ZWxSYXRpbztcblxuICAgICAgICAgICAgaGlkZUNhbnZhc0NvbnRleHQuc2hhZG93Q29sb3IgPSAnYmxhY2snO1xuICAgICAgICAgICAgaGlkZUNhbnZhc0NvbnRleHQuZm9udCA9IGAke2J1bGxldFNjcmVlbi5zdHlsZS5mb250V2VpZ2h0fSAke2J1bGxldFNjcmVlbk9uU2NyZWVuLnNpemUgKiBfZGV2aWNlUGl4ZWxSYXRpb31weCAke2J1bGxldFNjcmVlbi5zdHlsZS5mb250RmFtaWx5fWA7XG4gICAgICAgICAgICBsZXQgdGV4dFggPSA0ICogX2RldmljZVBpeGVsUmF0aW87XG4gICAgICAgICAgICBsZXQgdGV4dFkgPSAoNCArIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnNpemUgKiAwLjgpICogX2RldmljZVBpeGVsUmF0aW87XG4gICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuLnN0eWxlLmNvbG9yICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzQ29udGV4dC5zaGFkb3dCbHVyID0gKGJ1bGxldFNjcmVlbi5zdHlsZS5zaGFkb3dCbHVyICsgMC41KSAqIF9kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgICAgIGhpZGVDYW52YXNDb250ZXh0LmZpbGxTdHlsZSA9IGJ1bGxldFNjcmVlbi5zdHlsZS5jb2xvcjtcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzQ29udGV4dC5maWxsVGV4dChidWxsZXRTY3JlZW4udGV4dCwgdGV4dFgsIHRleHRZKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW4uc3R5bGUuYm9yZGVyQ29sb3IgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGhpZGVDYW52YXNDb250ZXh0LnNoYWRvd0JsdXIgPSAwO1xuICAgICAgICAgICAgICAgIGhpZGVDYW52YXNDb250ZXh0LmxpbmVXaWR0aCA9IDAuNSAqIF9kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgICAgIGhpZGVDYW52YXNDb250ZXh0LnN0cm9rZVN0eWxlID0gYnVsbGV0U2NyZWVuLnN0eWxlLmJvcmRlckNvbG9yO1xuICAgICAgICAgICAgICAgIGhpZGVDYW52YXNDb250ZXh0LnN0cm9rZVRleHQoYnVsbGV0U2NyZWVuLnRleHQsIHRleHRYLCB0ZXh0WSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuLnN0eWxlLmJveENvbG9yICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzQ29udGV4dC5zaGFkb3dCbHVyID0gMDtcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzQ29udGV4dC5saW5lV2lkdGggPSBfZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzQ29udGV4dC5zdHJva2VTdHlsZSA9IGJ1bGxldFNjcmVlbi5zdHlsZS5ib3hDb2xvcjtcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzQ29udGV4dC5zdHJva2VSZWN0KF9kZXZpY2VQaXhlbFJhdGlvLCBfZGV2aWNlUGl4ZWxSYXRpbywgaGlkZUNhbnZhcy53aWR0aCAtIF9kZXZpY2VQaXhlbFJhdGlvLCBoaWRlQ2FudmFzLmhlaWdodCAtIF9kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLmhpZGVDYW52YXMgPSBoaWRlQ2FudmFzO1xuXG4gICAgICAgICAgICBpZiAoX2J1bGxldFNjcmVlbnNPblNjcmVlbi5nZXRMZW5ndGgoKSA9PT0gMCkgX2J1bGxldFNjcmVlbnNPblNjcmVlbi5wdXNoKGJ1bGxldFNjcmVlbk9uU2NyZWVuLCB0cnVlKTtcbiAgICAgICAgICAgIGxldCBmbGFnID0gZmFsc2U7XG4gICAgICAgICAgICBfYnVsbGV0U2NyZWVuc09uU2NyZWVuLmZvckVhY2goKF9idWxsZXRTY3JlZW5PblNjcmVlbikgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChfYnVsbGV0U2NyZWVuT25TY3JlZW4uYnVsbGV0U2NyZWVuLmxheWVyIDw9IGJ1bGxldFNjcmVlbi5sYXllcikge1xuICAgICAgICAgICAgICAgICAgICBmbGFnID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZDogeyBlbGVtZW50OiBidWxsZXRTY3JlZW5PblNjcmVlbiwgYWRkVG9VcDogZmFsc2UgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3A6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgICAgIGlmICghZmxhZykgX2J1bGxldFNjcmVlbnNPblNjcmVlbi5wdXNoKGJ1bGxldFNjcmVlbk9uU2NyZWVuLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yig6Zmk5by55bmV5YWD57SgXG4gICAgICAgICAqIEBvdmVycmlkZVxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gYnVsbGV0U2NyZWVuT25TY3JlZW4gLSDlsY/luZXlvLnluZXlr7nosaFcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZGVsZXRlID0gKGJ1bGxldFNjcmVlbk9uU2NyZWVuKSA9PiBfYnVsbGV0U2NyZWVuc09uU2NyZWVuLmZvckVhY2goKF9idWxsZXRTY3JlZW5PblNjcmVlbikgPT5cbiAgICAgICAgICAgIF9idWxsZXRTY3JlZW5PblNjcmVlbiA9PT0gYnVsbGV0U2NyZWVuT25TY3JlZW4gPyB7IHJlbW92ZTogdHJ1ZSwgc3RvcDogdHJ1ZSB9IDogbnVsbCwgdHJ1ZSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOmHjeaWsOa3u+WKoOW8ueW5lVxuICAgICAgICAgKiBAb3ZlcnJpZGVcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGJ1bGxldFNjcmVlbk9uU2NyZWVuIC0g5bGP5bmV5by55bmV5a+56LGhXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnJlQ3JlYXRBbmRnZXRXaWR0aCA9IGZ1bmN0aW9uIChidWxsZXRTY3JlZW5PblNjcmVlbikge1xuICAgICAgICAgICAgdGhpcy5kZWxldGUoYnVsbGV0U2NyZWVuT25TY3JlZW4pO1xuICAgICAgICAgICAgdGhpcy5jcmVhdEFuZGdldFdpZHRoKGJ1bGxldFNjcmVlbk9uU2NyZWVuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBfc2V0U2l6ZSA9IHRoaXMuc2V0U2l6ZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiuvue9ruWwuuWvuFxuICAgICAgICAgKiBAb3ZlcnJpZGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc2V0U2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF9zZXRTaXplKCk7XG4gICAgICAgICAgICBfZGV2aWNlUGl4ZWxSYXRpbyA9IEhlbHBlci5nZXREZXZpY2VQaXhlbFJhdGlvKCk7XG4gICAgICAgICAgICBfZGV2aWNlUGl4ZWxSYXRpbyAqPSBvcHRpb25zLnNjYWxpbmc7XG4gICAgICAgICAgICBfY2FudmFzLndpZHRoID0gZWxlbWVudFNpemUud2lkdGggKiBfZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICAgIF9jYW52YXMuaGVpZ2h0ID0gZWxlbWVudFNpemUuaGVpZ2h0ICogX2RldmljZVBpeGVsUmF0aW87XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W57yp5pS+5q+U5L6LXG4gICAgICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IOe8qeaUvuavlOS+i1xuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5nZXREZXZpY2VQaXhlbFJhdGlvID0gKCkgPT4gX2RldmljZVBpeGVsUmF0aW87XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPlueUu+W4g+WvueixoVxuICAgICAgICAgKiBAcmV0dXJucyB7RWxlbWVudH0g55S75biD5a+56LGhXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmdldENhbnZhcyA9ICgpID0+IF9jYW52YXM7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPluWxj+W5leW8ueW5leWvueixoVxuICAgICAgICAgKiBAcmV0dXJucyB7TGlua2VkTGlzdH0g55S75biD5a+56LGhXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmdldEJ1bGxldFNjcmVlbnNPblNjcmVlbiA9ICgpID0+IF9idWxsZXRTY3JlZW5zT25TY3JlZW47XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa3u+WKoENhbnZhc1xuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAcmV0dXJucyB7RWxlbWVudH0g55S75biD5a+56LGhXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAgICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpOyAvL2NhbnZhc+WvueixoVxuICAgICAgICAgICAgSGVscGVyLmNsZWFuRWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGVsZW1lbnRTaXplLndpZHRoICogX2RldmljZVBpeGVsUmF0aW87XG4gICAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gZWxlbWVudFNpemUuaGVpZ2h0ICogX2RldmljZVBpeGVsUmF0aW87XG4gICAgICAgICAgICByZWdpc3RlckV2ZW50KGNhbnZhcyk7IC8v5rOo5YaM5LqL5Lu25ZON5bqU56iL5bqPXG4gICAgICAgICAgICByZXR1cm4gY2FudmFzO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IF9jaGVja1doZXRoZXJIaWRlID0gdGhpcy5jaGVja1doZXRoZXJIaWRlO1xuICAgICAgICAvKipcbiAgICAgICAgICog5rOo5YaM5LqL5Lu25ZON5bqU56iL5bqPXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCAtIOWFg+e0oFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcmVnaXN0ZXJFdmVudChlbGVtZW50KSB7XG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRCdWxsZXRTY3JlZW5PblNjcmVlbkJ5TG9jYXRpb24obG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgICBsZXQgX2J1bGxldFNjcmVlbk9uU2NyZWVuID0gbnVsbDtcbiAgICAgICAgICAgICAgICBfYnVsbGV0U2NyZWVuc09uU2NyZWVuLmZvckVhY2goZnVuY3Rpb24gKGJ1bGxldFNjcmVlbk9uU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfY2hlY2tXaGV0aGVySGlkZShidWxsZXRTY3JlZW5PblNjcmVlbikpIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHgxID0gYnVsbGV0U2NyZWVuT25TY3JlZW4ueCAtIDQ7XG4gICAgICAgICAgICAgICAgICAgIGxldCB4MiA9IHgxICsgYnVsbGV0U2NyZWVuT25TY3JlZW4ud2lkdGggKyA4O1xuICAgICAgICAgICAgICAgICAgICBsZXQgeTEgPSBidWxsZXRTY3JlZW5PblNjcmVlbi5hY3R1YWxZIC0gNDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHkyID0geTEgKyBidWxsZXRTY3JlZW5PblNjcmVlbi5oZWlnaHQgKyA4O1xuICAgICAgICAgICAgICAgICAgICBpZiAobG9jYXRpb24ueCA+PSB4MSAmJiBsb2NhdGlvbi54IDw9IHgyICYmIGxvY2F0aW9uLnkgPj0geTEgJiYgbG9jYXRpb24ueSA8PSB5Mikge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2J1bGxldFNjcmVlbk9uU2NyZWVuID0gYnVsbGV0U2NyZWVuT25TY3JlZW47XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBzdG9wOiB0cnVlIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9idWxsZXRTY3JlZW5PblNjcmVlbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldExvY2F0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBnZXRPZmZzZXRUb3AoZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0VG9wID0gMDtcbiAgICAgICAgICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0VG9wICs9IGVsZW1lbnQub2Zmc2V0VG9wO1xuICAgICAgICAgICAgICAgICAgICB9IHdoaWxlICgoZWxlbWVudCA9IGVsZW1lbnQub2Zmc2V0UGFyZW50KSAhPSBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9mZnNldFRvcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZ2V0T2Zmc2V0TGVmdChlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvZmZzZXRMZWZ0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0TGVmdCArPSBlbGVtZW50Lm9mZnNldExlZnQ7XG4gICAgICAgICAgICAgICAgICAgIH0gd2hpbGUgKChlbGVtZW50ID0gZWxlbWVudC5vZmZzZXRQYXJlbnQpICE9IG51bGwpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2Zmc2V0TGVmdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlLm9mZnNldFggPT09ICd1bmRlZmluZWQnIHx8IGUub2Zmc2V0WCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGUubGF5ZXJYID09PSAndW5kZWZpbmVkJyB8fCBlLmxheWVyWCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlLnBhZ2VYID09PSAndW5kZWZpbmVkJyB8fCBlLnBhZ2VYID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRvYyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgYm9keSA9IGRvY3VtZW50LmJvZHk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wYWdlWCA9IGUuY2xpZW50WCArIChkb2MgJiYgZG9jLnNjcm9sbExlZnQgfHwgYm9keSAmJiBib2R5LnNjcm9sbExlZnQgfHwgMCkgLSAoZG9jICYmIGRvYy5jbGllbnRMZWZ0IHx8IGJvZHkgJiYgYm9keS5jbGllbnRMZWZ0IHx8IDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucGFnZVkgPSBlLmNsaWVudFkgKyAoZG9jICYmIGRvYy5zY3JvbGxUb3AgfHwgYm9keSAmJiBib2R5LnNjcm9sbFRvcCB8fCAwKSAtIChkb2MgJiYgZG9jLmNsaWVudFRvcCB8fCBib2R5ICYmIGJvZHkuY2xpZW50VG9wIHx8IDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZS5sYXllclggPSBlLnBhZ2VYIC0gZ2V0T2Zmc2V0TGVmdChlLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLmxheWVyWSA9IGUucGFnZVkgLSBnZXRPZmZzZXRUb3AoZS50YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGUub2Zmc2V0WCA9IGUubGF5ZXJYIC0gZS50YXJnZXQuY2xpZW50TGVmdDtcbiAgICAgICAgICAgICAgICAgICAgZS5vZmZzZXRZID0gZS5sYXllclkgLSBlLnRhcmdldC5jbGllbnRUb3A7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHg6IGUub2Zmc2V0WCxcbiAgICAgICAgICAgICAgICAgICAgeTogZS5vZmZzZXRZXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy/kuIrkuIvmlofoj5zljZVcbiAgICAgICAgICAgIGVsZW1lbnQub25jb250ZXh0bWVudSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgbGV0IGJ1bGxldFNjcmVlbk9uU2NyZWVuID0gZ2V0QnVsbGV0U2NyZWVuT25TY3JlZW5CeUxvY2F0aW9uKGdldExvY2F0aW9uKGUpKTtcbiAgICAgICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuT25TY3JlZW4pXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50VHJpZ2dlcignY29udGV4dG1lbnUnLCBidWxsZXRTY3JlZW5PblNjcmVlbiwgZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8v5Y2V5Ye7XG4gICAgICAgICAgICBlbGVtZW50Lm9uY2xpY2sgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGxldCBidWxsZXRTY3JlZW5PblNjcmVlbiA9IGdldEJ1bGxldFNjcmVlbk9uU2NyZWVuQnlMb2NhdGlvbihnZXRMb2NhdGlvbihlKSk7XG4gICAgICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbk9uU2NyZWVuKVxuICAgICAgICAgICAgICAgICAgICBldmVudFRyaWdnZXIoJ2NsaWNrJywgYnVsbGV0U2NyZWVuT25TY3JlZW4sIGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvL+m8oOagh+enu+WKqFxuICAgICAgICAgICAgZWxlbWVudC5vbm1vdXNlbW92ZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgbGV0IGJ1bGxldFNjcmVlbk9uU2NyZWVuID0gZ2V0QnVsbGV0U2NyZWVuT25TY3JlZW5CeUxvY2F0aW9uKGdldExvY2F0aW9uKGUpKTtcbiAgICAgICAgICAgICAgICBfYnVsbGV0U2NyZWVuc09uU2NyZWVuLmZvckVhY2goKF9idWxsZXRTY3JlZW5PblNjcmVlbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuT25TY3JlZW4gIT0gX2J1bGxldFNjcmVlbk9uU2NyZWVuICYmIF9idWxsZXRTY3JlZW5PblNjcmVlbi5tb3VzZWluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfYnVsbGV0U2NyZWVuT25TY3JlZW4ubW91c2VpbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5jdXJzb3IgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50VHJpZ2dlcignbW91c2VsZWF2ZScsIF9idWxsZXRTY3JlZW5PblNjcmVlbiwgZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuT25TY3JlZW4gPT09IG51bGwgfHwgYnVsbGV0U2NyZWVuT25TY3JlZW4ubW91c2VpbikgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLm1vdXNlaW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuY3Vyc29yID0gb3B0aW9ucy5jdXJzb3JPbk1vdXNlT3ZlcjtcbiAgICAgICAgICAgICAgICBldmVudFRyaWdnZXIoJ21vdXNlZW50ZXInLCBidWxsZXRTY3JlZW5PblNjcmVlbiwgZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy/pvKDmoIfnprvlvIBcbiAgICAgICAgICAgIGVsZW1lbnQub25tb3VzZW91dCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgX2J1bGxldFNjcmVlbnNPblNjcmVlbi5mb3JFYWNoKChfYnVsbGV0U2NyZWVuT25TY3JlZW4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9idWxsZXRTY3JlZW5PblNjcmVlbi5tb3VzZWluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfYnVsbGV0U2NyZWVuT25TY3JlZW4ubW91c2VpbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5jdXJzb3IgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50VHJpZ2dlcignbW91c2VsZWF2ZScsIF9idWxsZXRTY3JlZW5PblNjcmVlbiwgZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuIl0sImZpbGUiOiJyZW5kZXJlcnMvZ2VuZXJhbENhbnZhc0Jhc2VSZW5kZXJlci5qcyJ9
