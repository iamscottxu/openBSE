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

    _this.cleanScreen = function () {
      return _bulletScreensOnScreen.clean();
    };
    /**
     * 创建弹幕元素
     * @override
     * @param {object} realTimeBulletScreen - 实时弹幕对象
     */


    _this.creatAndgetWidth = function (realTimeBulletScreen) {
      var bulletScreen = realTimeBulletScreen.bulletScreen;
      var hideCanvas = document.createElement('canvas');
      var hideCanvasContext = hideCanvas.getContext('2d');
      hideCanvasContext.font = "".concat(bulletScreen.style.fontWeight, " ").concat(realTimeBulletScreen.size, "px ").concat(bulletScreen.style.fontFamily);
      realTimeBulletScreen.width = hideCanvasContext.measureText(bulletScreen.text).width;
      hideCanvas.width = (realTimeBulletScreen.width + 8) * _devicePixelRatio;
      hideCanvas.height = (realTimeBulletScreen.height + 8) * _devicePixelRatio;
      hideCanvasContext.shadowColor = 'black';
      hideCanvasContext.font = "".concat(bulletScreen.style.fontWeight, " ").concat(realTimeBulletScreen.size * _devicePixelRatio, "px ").concat(bulletScreen.style.fontFamily);
      var textX = 4 * _devicePixelRatio;
      var textY = (4 + realTimeBulletScreen.size * 0.8) * _devicePixelRatio;

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

      realTimeBulletScreen.hideCanvas = hideCanvas;
      realTimeBulletScreen.linkedListNode = new _linkedList["default"].node(realTimeBulletScreen);

      _bulletScreensOnScreen.forEach(function (node) {
        var _realTimeBulletScreen = node.element;
        if (_realTimeBulletScreen.bulletScreen.layer <= bulletScreen.layer) return {
          add: {
            node: realTimeBulletScreen.linkedListNode,
            addToUp: false
          },
          stop: true
        };
      }, false);

      if (realTimeBulletScreen.linkedListNode.linkedList === null) _bulletScreensOnScreen.push(realTimeBulletScreen.linkedListNode, false);
    };
    /**
     * 删除弹幕元素
     * @override
     * @param {object} realTimeBulletScreen - 实时弹幕对象
     */


    _this["delete"] = function (realTimeBulletScreen) {
      return realTimeBulletScreen.linkedListNode.remove();
    };
    /**
     * 重新添加弹幕
     * @override
     * @param {object} realTimeBulletScreen - 实时弹幕对象
     */


    _this.reCreatAndgetWidth = function (realTimeBulletScreen) {
      this["delete"](realTimeBulletScreen);
      this.creatAndgetWidth(realTimeBulletScreen);
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
     * 获取实时弹幕对象
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
      function getrealTimeBulletScreenByLocation(location) {
        var _realTimeBulletScreen = null;

        _bulletScreensOnScreen.forEach(function (node) {
          var realTimeBulletScreen = node.element;
          if (_checkWhetherHide(realTimeBulletScreen)) return;
          var x1 = realTimeBulletScreen.x - 4;
          var x2 = x1 + realTimeBulletScreen.width + 8;
          var y1 = realTimeBulletScreen.actualY - 4;
          var y2 = y1 + realTimeBulletScreen.height + 8;

          if (location.x >= x1 && location.x <= x2 && location.y >= y1 && location.y <= y2) {
            _realTimeBulletScreen = realTimeBulletScreen;
            return {
              stop: true
            };
          }
        }, false);

        return _realTimeBulletScreen;
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
        var realTimeBulletScreen = getrealTimeBulletScreenByLocation(getLocation(e));
        if (realTimeBulletScreen) eventTrigger('contextmenu', realTimeBulletScreen, e);
        return false;
      };

      element.onclick = function (e) {
        var realTimeBulletScreen = getrealTimeBulletScreenByLocation(getLocation(e));
        if (realTimeBulletScreen) eventTrigger('click', realTimeBulletScreen, e);
        return false;
      };

      element.onmousemove = function (e) {
        var realTimeBulletScreen = getrealTimeBulletScreenByLocation(getLocation(e));

        _bulletScreensOnScreen.forEach(function (node) {
          var _realTimeBulletScreen = node.element;

          if (realTimeBulletScreen != _realTimeBulletScreen && _realTimeBulletScreen.mousein) {
            _realTimeBulletScreen.mousein = false;
            element.style.cursor = '';
            eventTrigger('mouseleave', _realTimeBulletScreen, e);
          }
        }, true);

        if (realTimeBulletScreen === null || realTimeBulletScreen.mousein) return false;
        realTimeBulletScreen.mousein = true;
        element.style.cursor = options.cursorOnMouseOver;
        eventTrigger('mouseenter', realTimeBulletScreen, e);
        return false;
      };

      element.onmouseout = function (e) {
        _bulletScreensOnScreen.forEach(function (node) {
          var _realTimeBulletScreen = node.element;

          if (_realTimeBulletScreen.mousein) {
            _realTimeBulletScreen.mousein = false;
            element.style.cursor = '';
            eventTrigger('mouseleave', _realTimeBulletScreen, e);
          }
        }, true);
      };
    }

    return _this;
  }

  return GeneralCanvasBaseRenderer;
}(_generalBaseRenderer["default"]);

exports["default"] = GeneralCanvasBaseRenderer;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbmRlcmVycy9nZW5lcmFsQ2FudmFzQmFzZVJlbmRlcmVyLmpzIl0sIm5hbWVzIjpbIkdlbmVyYWxDYW52YXNCYXNlUmVuZGVyZXIiLCJlbGVtZW50Iiwib3B0aW9ucyIsImVsZW1lbnRTaXplIiwiZXZlbnRUcmlnZ2VyIiwiU3ludGF4RXJyb3IiLCJfYnVsbGV0U2NyZWVuc09uU2NyZWVuIiwiTGlua2VkTGlzdCIsIl9kZXZpY2VQaXhlbFJhdGlvIiwiSGVscGVyIiwiZ2V0RGV2aWNlUGl4ZWxSYXRpbyIsInNjYWxpbmciLCJfY2FudmFzIiwiaW5pdCIsImNsZWFuU2NyZWVuIiwiY2xlYW4iLCJjcmVhdEFuZGdldFdpZHRoIiwicmVhbFRpbWVCdWxsZXRTY3JlZW4iLCJidWxsZXRTY3JlZW4iLCJoaWRlQ2FudmFzIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaGlkZUNhbnZhc0NvbnRleHQiLCJnZXRDb250ZXh0IiwiZm9udCIsInN0eWxlIiwiZm9udFdlaWdodCIsInNpemUiLCJmb250RmFtaWx5Iiwid2lkdGgiLCJtZWFzdXJlVGV4dCIsInRleHQiLCJoZWlnaHQiLCJzaGFkb3dDb2xvciIsInRleHRYIiwidGV4dFkiLCJjb2xvciIsInNoYWRvd0JsdXIiLCJmaWxsU3R5bGUiLCJmaWxsVGV4dCIsImJvcmRlckNvbG9yIiwibGluZVdpZHRoIiwic3Ryb2tlU3R5bGUiLCJzdHJva2VUZXh0IiwiYm94Q29sb3IiLCJzdHJva2VSZWN0IiwibGlua2VkTGlzdE5vZGUiLCJub2RlIiwiZm9yRWFjaCIsIl9yZWFsVGltZUJ1bGxldFNjcmVlbiIsImxheWVyIiwiYWRkIiwiYWRkVG9VcCIsInN0b3AiLCJsaW5rZWRMaXN0IiwicHVzaCIsInJlbW92ZSIsInJlQ3JlYXRBbmRnZXRXaWR0aCIsIl9zZXRTaXplIiwic2V0U2l6ZSIsImdldENhbnZhcyIsImdldEJ1bGxldFNjcmVlbnNPblNjcmVlbiIsImNhbnZhcyIsImNsZWFuRWxlbWVudCIsImFwcGVuZENoaWxkIiwicmVnaXN0ZXJFdmVudCIsIl9jaGVja1doZXRoZXJIaWRlIiwiY2hlY2tXaGV0aGVySGlkZSIsImdldHJlYWxUaW1lQnVsbGV0U2NyZWVuQnlMb2NhdGlvbiIsImxvY2F0aW9uIiwieDEiLCJ4IiwieDIiLCJ5MSIsImFjdHVhbFkiLCJ5MiIsInkiLCJnZXRMb2NhdGlvbiIsImUiLCJnZXRPZmZzZXRUb3AiLCJvZmZzZXRUb3AiLCJvZmZzZXRQYXJlbnQiLCJnZXRPZmZzZXRMZWZ0Iiwib2Zmc2V0TGVmdCIsIm9mZnNldFgiLCJsYXllclgiLCJwYWdlWCIsImRvYyIsImRvY3VtZW50RWxlbWVudCIsImJvZHkiLCJjbGllbnRYIiwic2Nyb2xsTGVmdCIsImNsaWVudExlZnQiLCJwYWdlWSIsImNsaWVudFkiLCJzY3JvbGxUb3AiLCJjbGllbnRUb3AiLCJ0YXJnZXQiLCJsYXllclkiLCJvZmZzZXRZIiwib25jb250ZXh0bWVudSIsIm9uY2xpY2siLCJvbm1vdXNlbW92ZSIsIm1vdXNlaW4iLCJjdXJzb3IiLCJjdXJzb3JPbk1vdXNlT3ZlciIsIm9ubW91c2VvdXQiLCJHZW5lcmFsQmFzZVJlbmRlcmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7O0lBR3FCQSx5Qjs7O0FBQ2pCOzs7Ozs7O0FBT0EscUNBQVlDLE9BQVosRUFBcUJDLE9BQXJCLEVBQThCQyxXQUE5QixFQUEyQ0MsWUFBM0MsRUFBeUQ7QUFBQTs7QUFBQTs7QUFDckQsUUFBSSw0RUFBZUoseUJBQW5CLEVBQThDO0FBQzFDLFlBQU0sSUFBSUssV0FBSixFQUFOO0FBQ0g7QUFDRDs7Ozs7O0FBSUEsUUFBSUMsc0JBQXNCLEdBQUcsSUFBSUMsc0JBQUosRUFBN0I7QUFDQTs7Ozs7O0FBSUEsUUFBSUMsaUJBQWlCLEdBQUdDLG1CQUFPQyxtQkFBUCxDQUEyQixJQUEzQixDQUF4Qjs7QUFDQUYsSUFBQUEsaUJBQWlC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WUFBSTdELG9CQUFvQixLQUFLLElBQXpCLElBQWlDQSxvQkFBb0IsQ0FBQ3NGLE9BQTFELEVBQW1FLE9BQU8sS0FBUDtBQUNuRXRGLFFBQUFBLG9CQUFvQixDQUFDc0YsT0FBckIsR0FBK0IsSUFBL0I7QUFDQXRHLFFBQUFBLE9BQU8sQ0FBQ3dCLEtBQVIsQ0FBYytFLE1BQWQsR0FBdUJ0RyxPQUFPLENBQUN1RyxpQkFBL0I7QUFDQXJHLFFBQUFBLFlBQVksQ0FBQyxZQUFELEVBQWVhLG9CQUFmLEVBQXFDNkQsQ0FBckMsQ0FBWjtBQUNBLGVBQU8sS0FBUDtBQUNILE9BZkQ7O0FBaUJBN0UsTUFBQUEsT0FBTyxDQUFDeUcsVUFBUixHQUFxQixVQUFVNUIsQ0FBVixFQUFhO0FBQzlCeEUsUUFBQUEsc0JBQXNCLENBQUMwQyxPQUF2QixDQUErQixVQUFDRCxJQUFELEVBQVU7QUFDckMsY0FBSUUscUJBQXFCLEdBQUdGLElBQUksQ0FBQzlDLE9BQWpDOztBQUNBLGNBQUlnRCxxQkFBcUIsQ0FBQ3NELE9BQTFCLEVBQW1DO0FBQy9CdEQsWUFBQUEscUJBQXFCLENBQUNzRCxPQUF0QixHQUFnQyxLQUFoQztBQUNBdEcsWUFBQUEsT0FBTyxDQUFDd0IsS0FBUixDQUFjK0UsTUFBZCxHQUF1QixFQUF2QjtBQUNBcEcsWUFBQUEsWUFBWSxDQUFDLFlBQUQsRUFBZTZDLHFCQUFmLEVBQXNDNkIsQ0FBdEMsQ0FBWjtBQUNIO0FBQ0osU0FQRCxFQU9HLElBUEg7QUFRSCxPQVREO0FBVUg7O0FBbFBvRDtBQW1QeEQ7OztFQTNQa0Q2QiwrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBHZW5lcmFsQmFzZVJlbmRlcmVyIGZyb20gJy4vZ2VuZXJhbEJhc2VSZW5kZXJlcidcbmltcG9ydCBMaW5rZWRMaXN0IGZyb20gJy4uL2xpYi9saW5rZWRMaXN0J1xuaW1wb3J0IEhlbHBlciBmcm9tICcuLi9saWIvaGVscGVyJ1xuXG4vKipcbiAqIENhbnZhcyDmuLLmn5Plmajmir3osaHnsbtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2VuZXJhbENhbnZhc0Jhc2VSZW5kZXJlciBleHRlbmRzIEdlbmVyYWxCYXNlUmVuZGVyZXIge1xuICAgIC8qKlxuICAgICAqIOWunuS+i+WMluS4gOS4qiBDYW52YXMg5riy5p+T5Zmo5oq96LGh57G7XG4gICAgICogQHBhcmFtIHtvYmplY3R9IGVsZW1lbnQgLSBFbGVtZW50IOWFg+e0oFxuICAgICAqIEBwYXJhbSB7b3BlbkJTRX5PcHRpb25zfSBvcHRpb25zIC0g5YWo5bGA6YCJ6aG5XG4gICAgICogQHBhcmFtIHtvYmplY3R9IGVsZW1lbnRTaXplIC0g5YWD57Sg5aSn5bCPXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZXZlbnRUcmlnZ2VyIC0g5LqL5Lu25byV5Y+R5pa55rOVXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgb3B0aW9ucywgZWxlbWVudFNpemUsIGV2ZW50VHJpZ2dlcikge1xuICAgICAgICBpZiAobmV3LnRhcmdldCA9PT0gR2VuZXJhbENhbnZhc0Jhc2VSZW5kZXJlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCk7XG4gICAgICAgIH1cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWxj+W5leS4iueahOW8ueW5lVxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7TGlua2VkTGlzdH1cbiAgICAgICAgICovXG4gICAgICAgIGxldCBfYnVsbGV0U2NyZWVuc09uU2NyZWVuID0gbmV3IExpbmtlZExpc3QoKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIERQSSDnvKnmlL7mr5TkvovvvIjlgI3mlbDvvIlcbiAgICAgICAgICogQHByaXZhdGUgQHR5cGUge251bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIGxldCBfZGV2aWNlUGl4ZWxSYXRpbyA9IEhlbHBlci5nZXREZXZpY2VQaXhlbFJhdGlvKHRydWUpO1xuICAgICAgICBfZGV2aWNlUGl4ZWxSYXRpbyAqPSBvcHRpb25zLnNjYWxpbmc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDnlLvluIPlhYPntKBcbiAgICAgICAgICogQHByaXZhdGUgQHR5cGUge0VsZW1lbnR9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgX2NhbnZhcyA9IGluaXQoKTtcbiAgICAgICAgc3VwZXIoX2NhbnZhcywgb3B0aW9ucywgZWxlbWVudFNpemUpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmuIXpmaTlsY/luZXlhoXlrrlcbiAgICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgICAqIEBvdmVycmlkZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jbGVhblNjcmVlbiA9ICgpID0+IF9idWxsZXRTY3JlZW5zT25TY3JlZW4uY2xlYW4oKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yib5bu65by55bmV5YWD57SgXG4gICAgICAgICAqIEBvdmVycmlkZVxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVhbFRpbWVCdWxsZXRTY3JlZW4gLSDlrp7ml7blvLnluZXlr7nosaFcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY3JlYXRBbmRnZXRXaWR0aCA9IGZ1bmN0aW9uIChyZWFsVGltZUJ1bGxldFNjcmVlbikge1xuICAgICAgICAgICAgbGV0IGJ1bGxldFNjcmVlbiA9IHJlYWxUaW1lQnVsbGV0U2NyZWVuLmJ1bGxldFNjcmVlbjtcbiAgICAgICAgICAgIGxldCBoaWRlQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgICAgICBsZXQgaGlkZUNhbnZhc0NvbnRleHQgPSBoaWRlQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgICAgICAgIGhpZGVDYW52YXNDb250ZXh0LmZvbnQgPSBgJHtidWxsZXRTY3JlZW4uc3R5bGUuZm9udFdlaWdodH0gJHtyZWFsVGltZUJ1bGxldFNjcmVlbi5zaXplfXB4ICR7YnVsbGV0U2NyZWVuLnN0eWxlLmZvbnRGYW1pbHl9YDtcbiAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLndpZHRoID0gaGlkZUNhbnZhc0NvbnRleHQubWVhc3VyZVRleHQoYnVsbGV0U2NyZWVuLnRleHQpLndpZHRoOyAvL+W8ueW5leeahOWuveW6pu+8muWDj+e0oFxuXG4gICAgICAgICAgICBoaWRlQ2FudmFzLndpZHRoID0gKHJlYWxUaW1lQnVsbGV0U2NyZWVuLndpZHRoICsgOCkgKiBfZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICAgIGhpZGVDYW52YXMuaGVpZ2h0ID0gKHJlYWxUaW1lQnVsbGV0U2NyZWVuLmhlaWdodCArIDgpICogX2RldmljZVBpeGVsUmF0aW87XG5cbiAgICAgICAgICAgIGhpZGVDYW52YXNDb250ZXh0LnNoYWRvd0NvbG9yID0gJ2JsYWNrJztcbiAgICAgICAgICAgIGhpZGVDYW52YXNDb250ZXh0LmZvbnQgPSBgJHtidWxsZXRTY3JlZW4uc3R5bGUuZm9udFdlaWdodH0gJHtyZWFsVGltZUJ1bGxldFNjcmVlbi5zaXplICogX2RldmljZVBpeGVsUmF0aW99cHggJHtidWxsZXRTY3JlZW4uc3R5bGUuZm9udEZhbWlseX1gO1xuICAgICAgICAgICAgbGV0IHRleHRYID0gNCAqIF9kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgbGV0IHRleHRZID0gKDQgKyByZWFsVGltZUJ1bGxldFNjcmVlbi5zaXplICogMC44KSAqIF9kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbi5zdHlsZS5jb2xvciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaGlkZUNhbnZhc0NvbnRleHQuc2hhZG93Qmx1ciA9IChidWxsZXRTY3JlZW4uc3R5bGUuc2hhZG93Qmx1ciArIDAuNSkgKiBfZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzQ29udGV4dC5maWxsU3R5bGUgPSBidWxsZXRTY3JlZW4uc3R5bGUuY29sb3I7XG4gICAgICAgICAgICAgICAgaGlkZUNhbnZhc0NvbnRleHQuZmlsbFRleHQoYnVsbGV0U2NyZWVuLnRleHQsIHRleHRYLCB0ZXh0WSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuLnN0eWxlLmJvcmRlckNvbG9yICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzQ29udGV4dC5zaGFkb3dCbHVyID0gMDtcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzQ29udGV4dC5saW5lV2lkdGggPSAwLjUgKiBfZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzQ29udGV4dC5zdHJva2VTdHlsZSA9IGJ1bGxldFNjcmVlbi5zdHlsZS5ib3JkZXJDb2xvcjtcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzQ29udGV4dC5zdHJva2VUZXh0KGJ1bGxldFNjcmVlbi50ZXh0LCB0ZXh0WCwgdGV4dFkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbi5zdHlsZS5ib3hDb2xvciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaGlkZUNhbnZhc0NvbnRleHQuc2hhZG93Qmx1ciA9IDA7XG4gICAgICAgICAgICAgICAgaGlkZUNhbnZhc0NvbnRleHQubGluZVdpZHRoID0gX2RldmljZVBpeGVsUmF0aW87XG4gICAgICAgICAgICAgICAgaGlkZUNhbnZhc0NvbnRleHQuc3Ryb2tlU3R5bGUgPSBidWxsZXRTY3JlZW4uc3R5bGUuYm94Q29sb3I7XG4gICAgICAgICAgICAgICAgaGlkZUNhbnZhc0NvbnRleHQuc3Ryb2tlUmVjdChfZGV2aWNlUGl4ZWxSYXRpbywgX2RldmljZVBpeGVsUmF0aW8sIGhpZGVDYW52YXMud2lkdGggLSBfZGV2aWNlUGl4ZWxSYXRpbywgaGlkZUNhbnZhcy5oZWlnaHQgLSBfZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi5oaWRlQ2FudmFzID0gaGlkZUNhbnZhcztcblxuICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4ubGlua2VkTGlzdE5vZGUgPSBuZXcgTGlua2VkTGlzdC5ub2RlKHJlYWxUaW1lQnVsbGV0U2NyZWVuKTtcbiAgICAgICAgICAgIF9idWxsZXRTY3JlZW5zT25TY3JlZW4uZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBfcmVhbFRpbWVCdWxsZXRTY3JlZW4gPSBub2RlLmVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgaWYgKF9yZWFsVGltZUJ1bGxldFNjcmVlbi5idWxsZXRTY3JlZW4ubGF5ZXIgPD0gYnVsbGV0U2NyZWVuLmxheWVyKSByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBhZGQ6IHsgbm9kZTogcmVhbFRpbWVCdWxsZXRTY3JlZW4ubGlua2VkTGlzdE5vZGUsIGFkZFRvVXA6IGZhbHNlIH0sXG4gICAgICAgICAgICAgICAgICAgIHN0b3A6IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgICAgICBpZiAocmVhbFRpbWVCdWxsZXRTY3JlZW4ubGlua2VkTGlzdE5vZGUubGlua2VkTGlzdCA9PT0gbnVsbClcbiAgICAgICAgICAgICAgICBfYnVsbGV0U2NyZWVuc09uU2NyZWVuLnB1c2gocmVhbFRpbWVCdWxsZXRTY3JlZW4ubGlua2VkTGlzdE5vZGUsIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliKDpmaTlvLnluZXlhYPntKBcbiAgICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZWFsVGltZUJ1bGxldFNjcmVlbiAtIOWunuaXtuW8ueW5leWvueixoVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5kZWxldGUgPSAocmVhbFRpbWVCdWxsZXRTY3JlZW4pID0+IHJlYWxUaW1lQnVsbGV0U2NyZWVuLmxpbmtlZExpc3ROb2RlLnJlbW92ZSgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDph43mlrDmt7vliqDlvLnluZVcbiAgICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZWFsVGltZUJ1bGxldFNjcmVlbiAtIOWunuaXtuW8ueW5leWvueixoVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5yZUNyZWF0QW5kZ2V0V2lkdGggPSBmdW5jdGlvbiAocmVhbFRpbWVCdWxsZXRTY3JlZW4pIHtcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlKHJlYWxUaW1lQnVsbGV0U2NyZWVuKTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRBbmRnZXRXaWR0aChyZWFsVGltZUJ1bGxldFNjcmVlbik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgX3NldFNpemUgPSB0aGlzLnNldFNpemU7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDorr7nva7lsLrlr7hcbiAgICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnNldFNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfc2V0U2l6ZSgpO1xuICAgICAgICAgICAgX2RldmljZVBpeGVsUmF0aW8gPSBIZWxwZXIuZ2V0RGV2aWNlUGl4ZWxSYXRpbygpO1xuICAgICAgICAgICAgX2RldmljZVBpeGVsUmF0aW8gKj0gb3B0aW9ucy5zY2FsaW5nO1xuICAgICAgICAgICAgX2NhbnZhcy53aWR0aCA9IGVsZW1lbnRTaXplLndpZHRoICogX2RldmljZVBpeGVsUmF0aW87XG4gICAgICAgICAgICBfY2FudmFzLmhlaWdodCA9IGVsZW1lbnRTaXplLmhlaWdodCAqIF9kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPlue8qeaUvuavlOS+i1xuICAgICAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSDnvKnmlL7mr5TkvotcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZ2V0RGV2aWNlUGl4ZWxSYXRpbyA9ICgpID0+IF9kZXZpY2VQaXhlbFJhdGlvO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bnlLvluIPlr7nosaFcbiAgICAgICAgICogQHJldHVybnMge0VsZW1lbnR9IOeUu+W4g+WvueixoVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5nZXRDYW52YXMgPSAoKSA9PiBfY2FudmFzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5blrp7ml7blvLnluZXlr7nosaFcbiAgICAgICAgICogQHJldHVybnMge0xpbmtlZExpc3R9IOeUu+W4g+WvueixoVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5nZXRCdWxsZXRTY3JlZW5zT25TY3JlZW4gPSAoKSA9PiBfYnVsbGV0U2NyZWVuc09uU2NyZWVuO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmt7vliqBDYW52YXNcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQHJldHVybnMge0VsZW1lbnR9IOeUu+W4g+WvueixoVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTsgLy9jYW52YXPlr7nosaFcbiAgICAgICAgICAgIEhlbHBlci5jbGVhbkVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gICAgICAgICAgICBjYW52YXMud2lkdGggPSBlbGVtZW50U2l6ZS53aWR0aCAqIF9kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IGVsZW1lbnRTaXplLmhlaWdodCAqIF9kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgcmVnaXN0ZXJFdmVudChjYW52YXMpOyAvL+azqOWGjOS6i+S7tuWTjeW6lOeoi+W6j1xuICAgICAgICAgICAgcmV0dXJuIGNhbnZhcztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBfY2hlY2tXaGV0aGVySGlkZSA9IHRoaXMuY2hlY2tXaGV0aGVySGlkZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOazqOWGjOS6i+S7tuWTjeW6lOeoi+W6j1xuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgLSDlhYPntKBcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHJlZ2lzdGVyRXZlbnQoZWxlbWVudCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0cmVhbFRpbWVCdWxsZXRTY3JlZW5CeUxvY2F0aW9uKGxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgbGV0IF9yZWFsVGltZUJ1bGxldFNjcmVlbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgX2J1bGxldFNjcmVlbnNPblNjcmVlbi5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZWFsVGltZUJ1bGxldFNjcmVlbiA9IG5vZGUuZWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9jaGVja1doZXRoZXJIaWRlKHJlYWxUaW1lQnVsbGV0U2NyZWVuKSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICBsZXQgeDEgPSByZWFsVGltZUJ1bGxldFNjcmVlbi54IC0gNDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHgyID0geDEgKyByZWFsVGltZUJ1bGxldFNjcmVlbi53aWR0aCArIDg7XG4gICAgICAgICAgICAgICAgICAgIGxldCB5MSA9IHJlYWxUaW1lQnVsbGV0U2NyZWVuLmFjdHVhbFkgLSA0O1xuICAgICAgICAgICAgICAgICAgICBsZXQgeTIgPSB5MSArIHJlYWxUaW1lQnVsbGV0U2NyZWVuLmhlaWdodCArIDg7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2NhdGlvbi54ID49IHgxICYmIGxvY2F0aW9uLnggPD0geDIgJiYgbG9jYXRpb24ueSA+PSB5MSAmJiBsb2NhdGlvbi55IDw9IHkyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfcmVhbFRpbWVCdWxsZXRTY3JlZW4gPSByZWFsVGltZUJ1bGxldFNjcmVlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHN0b3A6IHRydWUgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3JlYWxUaW1lQnVsbGV0U2NyZWVuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0TG9jYXRpb24oZSkge1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGdldE9mZnNldFRvcChlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvZmZzZXRUb3AgPSAwO1xuICAgICAgICAgICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXRUb3AgKz0gZWxlbWVudC5vZmZzZXRUb3A7XG4gICAgICAgICAgICAgICAgICAgIH0gd2hpbGUgKChlbGVtZW50ID0gZWxlbWVudC5vZmZzZXRQYXJlbnQpICE9IG51bGwpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2Zmc2V0VG9wO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBnZXRPZmZzZXRMZWZ0KGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9mZnNldExlZnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXRMZWZ0ICs9IGVsZW1lbnQub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgICAgICAgICAgfSB3aGlsZSAoKGVsZW1lbnQgPSBlbGVtZW50Lm9mZnNldFBhcmVudCkgIT0gbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvZmZzZXRMZWZ0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGUub2Zmc2V0WCA9PT0gJ3VuZGVmaW5lZCcgfHwgZS5vZmZzZXRYID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZS5sYXllclggPT09ICd1bmRlZmluZWQnIHx8IGUubGF5ZXJYID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGUucGFnZVggPT09ICd1bmRlZmluZWQnIHx8IGUucGFnZVggPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZG9jID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBib2R5ID0gZG9jdW1lbnQuYm9keTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnBhZ2VYID0gZS5jbGllbnRYICsgKGRvYyAmJiBkb2Muc2Nyb2xsTGVmdCB8fCBib2R5ICYmIGJvZHkuc2Nyb2xsTGVmdCB8fCAwKSAtIChkb2MgJiYgZG9jLmNsaWVudExlZnQgfHwgYm9keSAmJiBib2R5LmNsaWVudExlZnQgfHwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wYWdlWSA9IGUuY2xpZW50WSArIChkb2MgJiYgZG9jLnNjcm9sbFRvcCB8fCBib2R5ICYmIGJvZHkuc2Nyb2xsVG9wIHx8IDApIC0gKGRvYyAmJiBkb2MuY2xpZW50VG9wIHx8IGJvZHkgJiYgYm9keS5jbGllbnRUb3AgfHwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlLmxheWVyWCA9IGUucGFnZVggLSBnZXRPZmZzZXRMZWZ0KGUudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUubGF5ZXJZID0gZS5wYWdlWSAtIGdldE9mZnNldFRvcChlLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZS5vZmZzZXRYID0gZS5sYXllclggLSBlLnRhcmdldC5jbGllbnRMZWZ0O1xuICAgICAgICAgICAgICAgICAgICBlLm9mZnNldFkgPSBlLmxheWVyWSAtIGUudGFyZ2V0LmNsaWVudFRvcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgeDogZS5vZmZzZXRYLFxuICAgICAgICAgICAgICAgICAgICB5OiBlLm9mZnNldFlcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL+S4iuS4i+aWh+iPnOWNlVxuICAgICAgICAgICAgZWxlbWVudC5vbmNvbnRleHRtZW51ID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVhbFRpbWVCdWxsZXRTY3JlZW4gPSBnZXRyZWFsVGltZUJ1bGxldFNjcmVlbkJ5TG9jYXRpb24oZ2V0TG9jYXRpb24oZSkpO1xuICAgICAgICAgICAgICAgIGlmIChyZWFsVGltZUJ1bGxldFNjcmVlbilcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRUcmlnZ2VyKCdjb250ZXh0bWVudScsIHJlYWxUaW1lQnVsbGV0U2NyZWVuLCBlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy/ljZXlh7tcbiAgICAgICAgICAgIGVsZW1lbnQub25jbGljayA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlYWxUaW1lQnVsbGV0U2NyZWVuID0gZ2V0cmVhbFRpbWVCdWxsZXRTY3JlZW5CeUxvY2F0aW9uKGdldExvY2F0aW9uKGUpKTtcbiAgICAgICAgICAgICAgICBpZiAocmVhbFRpbWVCdWxsZXRTY3JlZW4pXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50VHJpZ2dlcignY2xpY2snLCByZWFsVGltZUJ1bGxldFNjcmVlbiwgZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8v6byg5qCH56e75YqoXG4gICAgICAgICAgICBlbGVtZW50Lm9ubW91c2Vtb3ZlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVhbFRpbWVCdWxsZXRTY3JlZW4gPSBnZXRyZWFsVGltZUJ1bGxldFNjcmVlbkJ5TG9jYXRpb24oZ2V0TG9jYXRpb24oZSkpO1xuICAgICAgICAgICAgICAgIF9idWxsZXRTY3JlZW5zT25TY3JlZW4uZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgX3JlYWxUaW1lQnVsbGV0U2NyZWVuID0gbm9kZS5lbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVhbFRpbWVCdWxsZXRTY3JlZW4gIT0gX3JlYWxUaW1lQnVsbGV0U2NyZWVuICYmIF9yZWFsVGltZUJ1bGxldFNjcmVlbi5tb3VzZWluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfcmVhbFRpbWVCdWxsZXRTY3JlZW4ubW91c2VpbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5jdXJzb3IgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50VHJpZ2dlcignbW91c2VsZWF2ZScsIF9yZWFsVGltZUJ1bGxldFNjcmVlbiwgZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgICAgICAgICBpZiAocmVhbFRpbWVCdWxsZXRTY3JlZW4gPT09IG51bGwgfHwgcmVhbFRpbWVCdWxsZXRTY3JlZW4ubW91c2VpbikgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLm1vdXNlaW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuY3Vyc29yID0gb3B0aW9ucy5jdXJzb3JPbk1vdXNlT3ZlcjtcbiAgICAgICAgICAgICAgICBldmVudFRyaWdnZXIoJ21vdXNlZW50ZXInLCByZWFsVGltZUJ1bGxldFNjcmVlbiwgZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy/pvKDmoIfnprvlvIBcbiAgICAgICAgICAgIGVsZW1lbnQub25tb3VzZW91dCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgX2J1bGxldFNjcmVlbnNPblNjcmVlbi5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBfcmVhbFRpbWVCdWxsZXRTY3JlZW4gPSBub2RlLmVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfcmVhbFRpbWVCdWxsZXRTY3JlZW4ubW91c2Vpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3JlYWxUaW1lQnVsbGV0U2NyZWVuLm1vdXNlaW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuY3Vyc29yID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudFRyaWdnZXIoJ21vdXNlbGVhdmUnLCBfcmVhbFRpbWVCdWxsZXRTY3JlZW4sIGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbiJdLCJmaWxlIjoicmVuZGVyZXJzL2dlbmVyYWxDYW52YXNCYXNlUmVuZGVyZXIuanMifQ==
