"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.number.to-fixed");

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

var _generalBaseRenderer = _interopRequireDefault(require("./generalBaseRenderer"));

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
var GeneralCss3Renderer = function (_GeneralBaseRenderer) {
  _inherits(GeneralCss3Renderer, _GeneralBaseRenderer);

  /**
   * 实例化一个 CSS3 渲染器类
   * @param {object} element - Element 元素
   * @param {openBSE~Options} options - 全局选项
   * @param {object} elementSize - 元素大小
   * @param {Event} eventTrigger - 事件引发方法
   * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
   */
  function GeneralCss3Renderer(element, options, elementSize, eventTrigger) {
    var _this;

    _classCallCheck(this, GeneralCss3Renderer);

    supportCheck();

    var _div = init();

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GeneralCss3Renderer).call(this, _div, options, elementSize));
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


    _this.draw = function () {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _div.getElementsByTagName('div')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var bulletScreenDiv = _step.value;
          if (_typeof(bulletScreenDiv.realTimeBulletScreen) != 'object') continue;

          if (this.checkWhetherHide(bulletScreenDiv.realTimeBulletScreen)) {
            bulletScreenDiv.style.visibility = 'hidden';
            continue;
          }

          bulletScreenDiv.style.visibility = 'visible';
          bulletScreenDiv.style.transform = bulletScreenDiv.style.webkitTransform = bulletScreenDiv.style.msTransform = "translate(".concat((bulletScreenDiv.realTimeBulletScreen.x - 4).toFixed(1), "px,").concat((bulletScreenDiv.realTimeBulletScreen.actualY - 4).toFixed(1), "px)");
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    };
    /**
     * 创建弹幕元素
     * @override
     * @param {object} realTimeBulletScreen - 实时弹幕对象
     */


    _this.creatAndgetWidth = function (realTimeBulletScreen) {
      var bulletScreen = realTimeBulletScreen.bulletScreen;
      var bulletScreenDiv = realTimeBulletScreen.div ? realTimeBulletScreen.div : document.createElement('div');
      bulletScreenDiv.style.position = 'absolute';
      bulletScreenDiv.style.whiteSpace = 'nowrap';
      bulletScreenDiv.style.fontWeight = bulletScreen.style.fontWeight;
      bulletScreenDiv.style.fontSize = "".concat(realTimeBulletScreen.size, "px");
      bulletScreenDiv.style.fontFamily = bulletScreen.style.fontFamily;
      bulletScreenDiv.style.lineHeight = "".concat(realTimeBulletScreen.size, "px");
      bulletScreenDiv.style.color = bulletScreen.style.color;
      if (bulletScreen.style.shadowBlur != null) bulletScreenDiv.style.textShadow = "0 0 ".concat(bulletScreen.style.shadowBlur, "px black");

      if (bulletScreen.style.borderColor != null) {
        bulletScreenDiv.style.textStroke = bulletScreenDiv.style.webkitTextStroke = "0.5px";
        bulletScreenDiv.style.textStrokeColor = bulletScreenDiv.style.webkitTextStrokeColor = bulletScreen.style.borderColor;
      }

      if (bulletScreen.style.boxColor != null) {
        bulletScreenDiv.style.padding = '3px';
        bulletScreenDiv.style.border = '1px solid';
        bulletScreenDiv.style.borderColor = bulletScreen.style.boxColor;
      } else {
        bulletScreenDiv.style.padding = '4px';
      }

      _helper["default"].cleanElement(bulletScreenDiv);

      bulletScreenDiv.appendChild(document.createTextNode(bulletScreen.text));
      bulletScreenDiv.realTimeBulletScreen = realTimeBulletScreen;
      insertElement(bulletScreenDiv);
      realTimeBulletScreen.width = bulletScreenDiv.clientWidth - 8;
      realTimeBulletScreen.div = bulletScreenDiv;
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
     * 重新添加弹幕
     * @override
     * @param {object} realTimeBulletScreen - 实时弹幕对象
     */


    _this.reCreatAndgetWidth = function (realTimeBulletScreen) {
      this["delete"](realTimeBulletScreen);
      this.creatAndgetWidth(realTimeBulletScreen);
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
      registerEvent(div);
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
    /**
     * 注册事件响应程序
     * @private
     * @param {Element} element - 元素
     */


    function registerEvent(element) {
      element.oncontextmenu = function (e) {
        if (e.target != this) {
          e.stopPropagation();
          eventTrigger('contextmenu', e.target.realTimeBulletScreen, e);
          return false;
        }
      };

      element.onclick = function (e) {
        if (e.target != this) {
          e.stopPropagation();
          eventTrigger('click', e.target.realTimeBulletScreen, e);
          return false;
        }
      };

      element.onmousemove = function (e) {
        var realTimeBulletScreen = e.target.realTimeBulletScreen;
        if (e.target === this || realTimeBulletScreen.mousein) return;
        realTimeBulletScreen.mousein = true;
        e.target.style.cursor = options.cursorOnMouseOver;
        eventTrigger('mouseenter', realTimeBulletScreen, e);
      };

      element.onmouseout = function (e) {
        var realTimeBulletScreen = e.target.realTimeBulletScreen;
        if (e.target === this || !realTimeBulletScreen.mousein) return;
        realTimeBulletScreen.mousein = false;
        e.target.style.cursor = '';
        eventTrigger('mouseleave', realTimeBulletScreen, e);
      };
    }
    /**
     * 按 layer 插入元素
     * @param {Element} element - 元素
     */


    function insertElement(element) {
      var elements = _div.getElementsByTagName(element.tagName);

      if (elements.length === 0) _div.appendChild(element);
      var index;

      for (index = elements.length - 1; index > 0; index--) {
        var _layer = elements[index].realTimeBulletScreen.bulletScreen.layer;
        if (_layer <= element.realTimeBulletScreen.bulletScreen.layer) break;
      }

      if (++index === elements.length) _div.appendChild(element);else _div.insertBefore(element, elements[index]);
    }

    return _this;
  }

  return GeneralCss3Renderer;
}(_generalBaseRenderer["default"]);

exports["default"] = GeneralCss3Renderer;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbmRlcmVycy9nZW5lcmFsQ3NzM1JlbmRlcmVyLmpzIl0sIm5hbWVzIjpbIkdlbmVyYWxDc3MzUmVuZGVyZXIiLCJlbGVtZW50Iiwib3B0aW9ucyIsImVsZW1lbnRTaXplIiwiZXZlbnRUcmlnZ2VyIiwic3VwcG9ydENoZWNrIiwiX2RpdiIsImluaXQiLCJjbGVhblNjcmVlbiIsIkhlbHBlciIsImNsZWFuRWxlbWVudCIsImRyYXciLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImJ1bGxldFNjcmVlbkRpdiIsInJlYWxUaW1lQnVsbGV0U2NyZWVuIiwiY2hlY2tXaGV0aGVySGlkZSIsInN0eWxlIiwidmlzaWJpbGl0eSIsInRyYW5zZm9ybSIsIndlYmtpdFRyYW5zZm9ybSIsIm1zVHJhbnNmb3JtIiwieCIsInRvRml4ZWQiLCJhY3R1YWxZIiwiY3JlYXRBbmRnZXRXaWR0aCIsImJ1bGxldFNjcmVlbiIsImRpdiIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInBvc2l0aW9uIiwid2hpdGVTcGFjZSIsImZvbnRXZWlnaHQiLCJmb250U2l6ZSIsInNpemUiLCJmb250RmFtaWx5IiwibGluZUhlaWdodCIsImNvbG9yIiwic2hhZG93Qmx1ciIsInRleHRTaGFkb3ciLCJib3JkZXJDb2xvciIsInRleHRTdHJva2UiLCJ3ZWJraXRUZXh0U3Ryb2tlIiwidGV4dFN0cm9rZUNvbG9yIiwid2Via2l0VGV4dFN0cm9rZUNvbG9yIiwiYm94Q29sb3IiLCJwYWRkaW5nIiwiYm9yZGVyIiwiYXBwZW5kQ2hpbGQiLCJjcmVhdGVUZXh0Tm9kZSIsInRleHQiLCJpbnNlcnRFbGVtZW50Iiwid2lkdGgiLCJjbGllbnRXaWR0aCIsInJlbW92ZUNoaWxkIiwicmVDcmVhdEFuZGdldFdpZHRoIiwib3ZlcmZsb3ciLCJtYXJnaW4iLCJ1c2VyU2VsZWN0Iiwid2Via2l0VXNlclNlbGVjdCIsIm1zVXNlclNlbGVjdCIsImN1cnNvciIsInJlZ2lzdGVyRXZlbnQiLCJCcm93c2VyTm90U3VwcG9ydEVycm9yIiwib25jb250ZXh0bWVudSIsImUiLCJ0YXJnZXQiLCJzdG9wUHJvcGFnYXRpb24iLCJvbmNsaWNrIiwib25tb3VzZW1vdmUiLCJtb3VzZWluIiwiY3Vyc29yT25Nb3VzZU92ZXIiLCJvbm1vdXNlb3V0IiwiZWxlbWVudHMiLCJ0YWdOYW1lIiwibGVuZ3RoIiwiaW5kZXgiLCJfbGF5ZXIiLCJsYXllciIsImluc2VydEJlZm9yZSIsIkdlbmVyYWxCYXNlUmVuZGVyZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7O0lBR3FCQSxtQjs7O0FBQ2pCOzs7Ozs7OztBQVFBLCtCQUFZQyxPQUFaLEVBQXFCQyxPQUFyQixFQUE4QkMsV0FBOUIsRUFBMkNDLFlBQTNDLEVBQXlEO0FBQUE7O0FBQUE7O0FBQ3JEQyxJQUFBQSxZQUFZOztBQUNaLFFBQUlDLElBQUksR0FBR0MsSUFBSSxFQUFmOztBQUNBLDZGQUFNRCxJQUFOLEVBQVlKLE9BQVosRUFBcUJDLFdBQXJCO0FBRUE7Ozs7O0FBSUEsVUFBS0ssV0FBTCxHQUFtQixZQUFZO0FBQzNCQyx5QkFBT0MsWUFBUCxDQUFvQkosSUFBcEI7QUFDSCxLQUZEO0FBSUE7Ozs7OztBQUlBLFVBQUtLLElBQUwsR0FBWSxZQUFZO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ3BCLDZCQUE0QkwsSUFBSSxDQUFDTSxvQkFBTCxDQUEwQixLQUExQixDQUE1Qiw4SEFBOEQ7QUFBQSxjQUFyREMsZUFBcUQ7QUFDMUQsY0FBSSxRQUFPQSxlQUFlLENBQUNDLG9CQUF2QixLQUErQyxRQUFuRCxFQUE2RDs7QUFDN0QsY0FBSSxLQUFLQyxnQkFBTCxDQUFzQkYsZUFBZSxDQUFDQyxvQkFBdEMsQ0FBSixFQUFpRTtBQUM3REQsWUFBQUEsZUFBZSxDQUFDRyxLQUFoQixDQUFzQkMsVUFBdEIsR0FBbUMsUUFBbkM7QUFDQTtBQUNIOztBQUNESixVQUFBQSxl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O0FBRUQ7Ozs7OztBQUlBLGFBQVNkLGFBQVQsQ0FBdUJqRCxPQUF2QixFQUFnQztBQUM1QixVQUFJdUUsUUFBUSxHQUFHbEUsSUFBSSxDQUFDTSxvQkFBTCxDQUEwQlgsT0FBTyxDQUFDd0UsT0FBbEMsQ0FBZjs7QUFDQSxVQUFJRCxRQUFRLENBQUNFLE1BQVQsS0FBb0IsQ0FBeEIsRUFBMkJwRSxJQUFJLENBQUN5QyxXQUFMLENBQWlCOUMsT0FBakI7QUFDM0IsVUFBSTBFLEtBQUo7O0FBQ0EsV0FBS0EsS0FBSyxHQUFHSCxRQUFRLENBQUNFLE1BQVQsR0FBa0IsQ0FBL0IsRUFBa0NDLEtBQUssR0FBRyxDQUExQyxFQUE2Q0EsS0FBSyxFQUFsRCxFQUFzRDtBQUNsRCxZQUFJQyxNQUFNLEdBQUdKLFFBQVEsQ0FBQ0csS0FBRCxDQUFSLENBQWdCN0Qsb0JBQWhCLENBQXFDVyxZQUFyQyxDQUFrRG9ELEtBQS9EO0FBQ0EsWUFBSUQsTUFBTSxJQUFJM0UsT0FBTyxDQUFDYSxvQkFBUixDQUE2QlcsWUFBN0IsQ0FBMENvRCxLQUF4RCxFQUErRDtBQUNsRTs7QUFDRCxVQUFJLEVBQUVGLEtBQUYsS0FBWUgsUUFBUSxDQUFDRSxNQUF6QixFQUFpQ3BFLElBQUksQ0FBQ3lDLFdBQUwsQ0FBaUI5QyxPQUFqQixFQUFqQyxLQUNLSyxJQUFJLENBQUN3RSxZQUFMLENBQWtCN0UsT0FBbEIsRUFBMkJ1RSxRQUFRLENBQUNHLEtBQUQsQ0FBbkM7QUFDUjs7QUFoTG9EO0FBaUx4RDs7O0VBMUw0Q0ksK0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgR2VuZXJhbEJhc2VSZW5kZXJlciBmcm9tICcuL2dlbmVyYWxCYXNlUmVuZGVyZXInXG5pbXBvcnQgQnJvd3Nlck5vdFN1cHBvcnRFcnJvciBmcm9tICcuLi9lcnJvcnMvYnJvd3Nlck5vdFN1cHBvcnRFcnJvcidcbmltcG9ydCBIZWxwZXIgZnJvbSAnLi4vbGliL2hlbHBlcic7XG5cbi8qKlxuICogQ1NTMyDmuLLmn5PlmajnsbtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2VuZXJhbENzczNSZW5kZXJlciBleHRlbmRzIEdlbmVyYWxCYXNlUmVuZGVyZXIge1xuICAgIC8qKlxuICAgICAqIOWunuS+i+WMluS4gOS4qiBDU1MzIOa4suafk+WZqOexu1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbGVtZW50IC0gRWxlbWVudCDlhYPntKBcbiAgICAgKiBAcGFyYW0ge29wZW5CU0V+T3B0aW9uc30gb3B0aW9ucyAtIOWFqOWxgOmAiemhuVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbGVtZW50U2l6ZSAtIOWFg+e0oOWkp+Wwj1xuICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50VHJpZ2dlciAtIOS6i+S7tuW8leWPkeaWueazlVxuICAgICAqIEB0aHJvd3Mge29wZW5CU0UuQnJvd3Nlck5vdFN1cHBvcnRFcnJvcn0g5rWP6KeI5Zmo5LiN5pSv5oyB54m55a6a5riy5p+T5qih5byP5pe25byV5Y+R6ZSZ6K+vXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgb3B0aW9ucywgZWxlbWVudFNpemUsIGV2ZW50VHJpZ2dlcikge1xuICAgICAgICBzdXBwb3J0Q2hlY2soKTsgLy/mtY/op4jlmajmlK/mjIHmo4DmtYtcbiAgICAgICAgbGV0IF9kaXYgPSBpbml0KCk7XG4gICAgICAgIHN1cGVyKF9kaXYsIG9wdGlvbnMsIGVsZW1lbnRTaXplKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5riF6Zmk5bGP5bmV5YaF5a65XG4gICAgICAgICAqIEBvdmVycmlkZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jbGVhblNjcmVlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIEhlbHBlci5jbGVhbkVsZW1lbnQoX2Rpdik7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog57uY5Yi25Ye95pWwXG4gICAgICAgICAqIEBvdmVycmlkZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5kcmF3ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZm9yIChsZXQgYnVsbGV0U2NyZWVuRGl2IG9mIF9kaXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2RpdicpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBidWxsZXRTY3JlZW5EaXYucmVhbFRpbWVCdWxsZXRTY3JlZW4gIT0gJ29iamVjdCcpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrV2hldGhlckhpZGUoYnVsbGV0U2NyZWVuRGl2LnJlYWxUaW1lQnVsbGV0U2NyZWVuKSkge1xuICAgICAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLnRyYW5zZm9ybSA9XG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPVxuICAgICAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUubXNUcmFuc2Zvcm0gPVxuICAgICAgICAgICAgICAgICAgICBgdHJhbnNsYXRlKCR7KGJ1bGxldFNjcmVlbkRpdi5yZWFsVGltZUJ1bGxldFNjcmVlbi54IC0gNCkudG9GaXhlZCgxKX1weCwkeyhidWxsZXRTY3JlZW5EaXYucmVhbFRpbWVCdWxsZXRTY3JlZW4uYWN0dWFsWSAtIDQpLnRvRml4ZWQoMSl9cHgpYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliJvlu7rlvLnluZXlhYPntKBcbiAgICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZWFsVGltZUJ1bGxldFNjcmVlbiAtIOWunuaXtuW8ueW5leWvueixoVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jcmVhdEFuZGdldFdpZHRoID0gZnVuY3Rpb24gKHJlYWxUaW1lQnVsbGV0U2NyZWVuKSB7XG4gICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuID0gcmVhbFRpbWVCdWxsZXRTY3JlZW4uYnVsbGV0U2NyZWVuO1xuICAgICAgICAgICAgbGV0IGJ1bGxldFNjcmVlbkRpdiA9IHJlYWxUaW1lQnVsbGV0U2NyZWVuLmRpdiA/IHJlYWxUaW1lQnVsbGV0U2NyZWVuLmRpdiA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS53aGl0ZVNwYWNlID0gJ25vd3JhcCc7XG4gICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUuZm9udFdlaWdodCA9IGJ1bGxldFNjcmVlbi5zdHlsZS5mb250V2VpZ2h0O1xuICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLmZvbnRTaXplID0gYCR7cmVhbFRpbWVCdWxsZXRTY3JlZW4uc2l6ZX1weGA7XG4gICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUuZm9udEZhbWlseSA9IGJ1bGxldFNjcmVlbi5zdHlsZS5mb250RmFtaWx5O1xuICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLmxpbmVIZWlnaHQgPSBgJHtyZWFsVGltZUJ1bGxldFNjcmVlbi5zaXplfXB4YDtcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS5jb2xvciA9IGJ1bGxldFNjcmVlbi5zdHlsZS5jb2xvcjtcbiAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW4uc3R5bGUuc2hhZG93Qmx1ciAhPSBudWxsKVxuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS50ZXh0U2hhZG93ID0gYDAgMCAke2J1bGxldFNjcmVlbi5zdHlsZS5zaGFkb3dCbHVyfXB4IGJsYWNrYDtcbiAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW4uc3R5bGUuYm9yZGVyQ29sb3IgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS50ZXh0U3Ryb2tlID0gYnVsbGV0U2NyZWVuRGl2LnN0eWxlLndlYmtpdFRleHRTdHJva2UgPSBgMC41cHhgO1xuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS50ZXh0U3Ryb2tlQ29sb3IgPSBidWxsZXRTY3JlZW5EaXYuc3R5bGUud2Via2l0VGV4dFN0cm9rZUNvbG9yID0gYnVsbGV0U2NyZWVuLnN0eWxlLmJvcmRlckNvbG9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbi5zdHlsZS5ib3hDb2xvciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLnBhZGRpbmcgPSAnM3B4JztcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUuYm9yZGVyID0gJzFweCBzb2xpZCc7XG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLmJvcmRlckNvbG9yID0gYnVsbGV0U2NyZWVuLnN0eWxlLmJveENvbG9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLnBhZGRpbmcgPSAnNHB4JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIEhlbHBlci5jbGVhbkVsZW1lbnQoYnVsbGV0U2NyZWVuRGl2KTtcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShidWxsZXRTY3JlZW4udGV4dCkpO1xuICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnJlYWxUaW1lQnVsbGV0U2NyZWVuID0gcmVhbFRpbWVCdWxsZXRTY3JlZW47XG4gICAgICAgICAgICBpbnNlcnRFbGVtZW50KGJ1bGxldFNjcmVlbkRpdik7IC8vaW5zZXJ0XG4gICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi53aWR0aCA9IGJ1bGxldFNjcmVlbkRpdi5jbGllbnRXaWR0aCAtIDg7IC8v5by55bmV55qE5a695bqm77ya5YOP57SgXG4gICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi5kaXYgPSBidWxsZXRTY3JlZW5EaXY7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgKiDliKDpmaTlvLnluZXlhYPntKBcbiAgICAgICAgKiBAb3ZlcnJpZGVcbiAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVhbFRpbWVCdWxsZXRTY3JlZW4gLSDlrp7ml7blvLnluZXlr7nosaFcbiAgICAgICAgKi9cbiAgICAgICAgdGhpcy5kZWxldGUgPSBmdW5jdGlvbiAocmVhbFRpbWVCdWxsZXRTY3JlZW4pIHtcbiAgICAgICAgICAgIF9kaXYucmVtb3ZlQ2hpbGQocmVhbFRpbWVCdWxsZXRTY3JlZW4uZGl2KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDph43mlrDmt7vliqDlvLnluZVcbiAgICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZWFsVGltZUJ1bGxldFNjcmVlbiAtIOWunuaXtuW8ueW5leWvueixoVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5yZUNyZWF0QW5kZ2V0V2lkdGggPSBmdW5jdGlvbiAocmVhbFRpbWVCdWxsZXRTY3JlZW4pIHtcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlKHJlYWxUaW1lQnVsbGV0U2NyZWVuKTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRBbmRnZXRXaWR0aChyZWFsVGltZUJ1bGxldFNjcmVlbik7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5re75YqgRGl2XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEByZXR1cm5zIHtFbGVtZW50fSBEaXZcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7IC8vRElWXG4gICAgICAgICAgICBIZWxwZXIuY2xlYW5FbGVtZW50KGVsZW1lbnQpO1xuICAgICAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgICAgICAgZGl2LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgICAgICAgICBkaXYuc3R5bGUucGFkZGluZyA9ICcwJztcbiAgICAgICAgICAgIGRpdi5zdHlsZS5tYXJnaW4gPSAnMCc7XG4gICAgICAgICAgICBkaXYuc3R5bGUudXNlclNlbGVjdCA9XG4gICAgICAgICAgICAgICAgZGl2LnN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPVxuICAgICAgICAgICAgICAgIGRpdi5zdHlsZS5tc1VzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgICAgICAgICBkaXYuc3R5bGUuY3Vyc29yID0gJ2RlZmF1bHQnO1xuICAgICAgICAgICAgcmVnaXN0ZXJFdmVudChkaXYpOyAvL+azqOWGjOS6i+S7tuWTjeW6lOeoi+W6j1xuICAgICAgICAgICAgcmV0dXJuIGRpdjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmtY/op4jlmajmlK/mjIHmo4DmtYtcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQHRocm93cyB7b3BlbkJTRS5Ccm93c2VyTm90U3VwcG9ydEVycm9yfSDmtY/op4jlmajkuI3mlK/mjIHnibnlrprmuLLmn5PmqKHlvI/ml7blvJXlj5HplJnor69cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHN1cHBvcnRDaGVjaygpIHtcbiAgICAgICAgICAgIGxldCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLnN0eWxlO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHR5cGVvZiBzdHlsZS50cmFuc2Zvcm0gPT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIHN0eWxlLm1zVHJhbnNmb3JtID09PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiBzdHlsZS53ZWJraXRUcmFuc2Zvcm0gPT09ICd1bmRlZmluZWQnXG4gICAgICAgICAgICApIHRocm93IG5ldyBCcm93c2VyTm90U3VwcG9ydEVycm9yKCdDU1MzIHRyYW5zZm9ybScpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOazqOWGjOS6i+S7tuWTjeW6lOeoi+W6j1xuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgLSDlhYPntKBcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHJlZ2lzdGVyRXZlbnQoZWxlbWVudCkge1xuICAgICAgICAgICAgLy/kuIrkuIvmlofoj5zljZVcbiAgICAgICAgICAgIGVsZW1lbnQub25jb250ZXh0bWVudSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0ICE9IHRoaXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRUcmlnZ2VyKCdjb250ZXh0bWVudScsIGUudGFyZ2V0LnJlYWxUaW1lQnVsbGV0U2NyZWVuLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvL+WNleWHu1xuICAgICAgICAgICAgZWxlbWVudC5vbmNsaWNrID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQgIT0gdGhpcykge1xuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICBldmVudFRyaWdnZXIoJ2NsaWNrJywgZS50YXJnZXQucmVhbFRpbWVCdWxsZXRTY3JlZW4sIGUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8v6byg5qCH56e75YqoXG4gICAgICAgICAgICBlbGVtZW50Lm9ubW91c2Vtb3ZlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVhbFRpbWVCdWxsZXRTY3JlZW4gPSBlLnRhcmdldC5yZWFsVGltZUJ1bGxldFNjcmVlbjtcbiAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQgPT09IHRoaXMgfHwgcmVhbFRpbWVCdWxsZXRTY3JlZW4ubW91c2VpbikgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLm1vdXNlaW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGUudGFyZ2V0LnN0eWxlLmN1cnNvciA9IG9wdGlvbnMuY3Vyc29yT25Nb3VzZU92ZXI7XG4gICAgICAgICAgICAgICAgZXZlbnRUcmlnZ2VyKCdtb3VzZWVudGVyJywgcmVhbFRpbWVCdWxsZXRTY3JlZW4sIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy/pvKDmoIfnprvlvIBcbiAgICAgICAgICAgIGVsZW1lbnQub25tb3VzZW91dCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlYWxUaW1lQnVsbGV0U2NyZWVuID0gZS50YXJnZXQucmVhbFRpbWVCdWxsZXRTY3JlZW47XG4gICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0ID09PSB0aGlzIHx8ICFyZWFsVGltZUJ1bGxldFNjcmVlbi5tb3VzZWluKSByZXR1cm47XG4gICAgICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4ubW91c2VpbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGUudGFyZ2V0LnN0eWxlLmN1cnNvciA9ICcnO1xuICAgICAgICAgICAgICAgIGV2ZW50VHJpZ2dlcignbW91c2VsZWF2ZScsIHJlYWxUaW1lQnVsbGV0U2NyZWVuLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmjIkgbGF5ZXIg5o+S5YWl5YWD57SgXG4gICAgICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCAtIOWFg+e0oFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gaW5zZXJ0RWxlbWVudChlbGVtZW50KSB7XG4gICAgICAgICAgICBsZXQgZWxlbWVudHMgPSBfZGl2LmdldEVsZW1lbnRzQnlUYWdOYW1lKGVsZW1lbnQudGFnTmFtZSk7XG4gICAgICAgICAgICBpZiAoZWxlbWVudHMubGVuZ3RoID09PSAwKSBfZGl2LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgbGV0IGluZGV4O1xuICAgICAgICAgICAgZm9yIChpbmRleCA9IGVsZW1lbnRzLmxlbmd0aCAtIDE7IGluZGV4ID4gMDsgaW5kZXgtLSkge1xuICAgICAgICAgICAgICAgIGxldCBfbGF5ZXIgPSBlbGVtZW50c1tpbmRleF0ucmVhbFRpbWVCdWxsZXRTY3JlZW4uYnVsbGV0U2NyZWVuLmxheWVyO1xuICAgICAgICAgICAgICAgIGlmIChfbGF5ZXIgPD0gZWxlbWVudC5yZWFsVGltZUJ1bGxldFNjcmVlbi5idWxsZXRTY3JlZW4ubGF5ZXIpIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCsraW5kZXggPT09IGVsZW1lbnRzLmxlbmd0aCkgX2Rpdi5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgICAgICAgIGVsc2UgX2Rpdi5pbnNlcnRCZWZvcmUoZWxlbWVudCwgZWxlbWVudHNbaW5kZXhdKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuIl0sImZpbGUiOiJyZW5kZXJlcnMvZ2VuZXJhbENzczNSZW5kZXJlci5qcyJ9
