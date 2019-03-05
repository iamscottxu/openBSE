"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CSS3Renderer = void 0;

require("core-js/modules/es6.object.create");

require("core-js/modules/es6.object.set-prototype-of");

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

var _baseRenderer = require("./baseRenderer");

var _browserNotSupportError = require("../../browserNotSupportError");

var _helper = require("../helper");

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
var CSS3Renderer = function (_BaseRenderer) {
  _inherits(CSS3Renderer, _BaseRenderer);

  /**
   * 实例化一个 CSS3 渲染器类
   * @param {object} element - Element 元素
   * @param {openBSE~Options} options - 全局选项
   * @param {object} elementSize - 元素大小
   * @param {Event} eventTrigger - 事件引发方法
   * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
   */
  function CSS3Renderer(element, options, elementSize, eventTrigger) {
    var _this;

    _classCallCheck(this, CSS3Renderer);

    supportCheck();

    var _div = init();

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CSS3Renderer).call(this, _div, options, elementSize));
    /**
     * 清除屏幕内容
     * @override
     */

    _this.cleanScreen = function () {
      _helper.Helper.cleanElement(_div);
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
          if (_typeof(bulletScreenDiv.bulletScreenOnScreen) != 'object') continue;

          if (this.checkWhetherHide(bulletScreenDiv.bulletScreenOnScreen)) {
            bulletScreenDiv.style.visibility = 'hidden';
            continue;
          }

          bulletScreenDiv.style.visibility = 'visible';
          bulletScreenDiv.style.transform = bulletScreenDiv.style.webkitTransform = bulletScreenDiv.style.msTransform = "translate(".concat(Math.round(bulletScreenDiv.bulletScreenOnScreen.x - 4), "px,").concat(Math.round(bulletScreenDiv.bulletScreenOnScreen.actualY - 4), "px)");
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
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
     * @param {object} bulletScreenOnScreen - 屏幕弹幕对象
     */


    _this.creatAndgetWidth = function (bulletScreenOnScreen) {
      var bulletScreen = bulletScreenOnScreen.bulletScreen;
      var bulletScreenDiv = bulletScreenOnScreen.div ? bulletScreenOnScreen.div : document.createElement('div');
      bulletScreenDiv.style.position = 'absolute';
      bulletScreenDiv.style.whiteSpace = 'nowrap';
      bulletScreenDiv.style.fontWeight = bulletScreen.style.fontWeight;
      bulletScreenDiv.style.fontSize = "".concat(bulletScreenOnScreen.size, "px");
      bulletScreenDiv.style.fontFamily = bulletScreen.style.fontFamily;
      bulletScreenDiv.style.lineHeight = "".concat(bulletScreenOnScreen.size, "px");
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

      _helper.Helper.cleanElement(bulletScreenDiv);

      bulletScreenDiv.appendChild(document.createTextNode(bulletScreen.text));
      bulletScreenDiv.bulletScreenOnScreen = bulletScreenOnScreen;
      insertElement(bulletScreenDiv);
      bulletScreenOnScreen.width = bulletScreenDiv.clientWidth - 8;
      bulletScreenOnScreen.div = bulletScreenDiv;
    };
    /**
    * 删除弹幕元素
    * @override
    * @param {object} bulletScreenOnScreen - 屏幕弹幕对象
    */


    _this.delete = function (bulletScreenOnScreen) {
      _div.removeChild(bulletScreenOnScreen.div);
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
    /**
     * 添加Div
     * @private
     * @returns {Element} Div
     */


    function init() {
      var div = document.createElement('div');

      _helper.Helper.cleanElement(element);

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
      if (typeof style.transform === 'undefined' && typeof style.msTransform === 'undefined' && typeof style.webkitTransform === 'undefined') throw new _browserNotSupportError.BrowserNotSupportError('CSS3 transform');
    }
    /**
     * 注册事件响应程序
     * @private
     * @param {Element} element - 元素
     */


    function registerEvent(element) {
      element.oncontextmenu = function (e) {
        if (e.target != this) eventTrigger('contextmenu', e.target.bulletScreenOnScreen, e);
        return false;
      };

      element.onclick = function (e) {
        if (e.target != this) eventTrigger('click', e.target.bulletScreenOnScreen, e);
        return false;
      };

      element.onmousemove = function (e) {
        var bulletScreenOnScreen = e.target.bulletScreenOnScreen;
        if (e.target === this || bulletScreenOnScreen.mousein) return;
        bulletScreenOnScreen.mousein = true;
        e.target.style.cursor = options.cursorOnMouseOver;
        eventTrigger('mouseenter', bulletScreenOnScreen, e);
      };

      element.onmouseout = function (e) {
        var bulletScreenOnScreen = e.target.bulletScreenOnScreen;
        if (e.target === this || !bulletScreenOnScreen.mousein) return;
        bulletScreenOnScreen.mousein = false;
        e.target.style.cursor = '';
        eventTrigger('mouseleave', bulletScreenOnScreen, e);
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
        var _layer = elements[index].bulletScreenOnScreen.bulletScreen.layer;
        if (_layer <= element.bulletScreenOnScreen.bulletScreen.layer) break;
      }

      if (++index === elements.length) _div.appendChild(element);else _div.insertBefore(element, elements[index]);
    }

    return _this;
  }

  return CSS3Renderer;
}(_baseRenderer.BaseRenderer);

exports.CSS3Renderer = CSS3Renderer;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9yZW5kZXJlcnMvY3NzM1JlbmRlcmVyLmpzIl0sIm5hbWVzIjpbIkNTUzNSZW5kZXJlciIsImVsZW1lbnQiLCJvcHRpb25zIiwiZWxlbWVudFNpemUiLCJldmVudFRyaWdnZXIiLCJzdXBwb3J0Q2hlY2siLCJfZGl2IiwiaW5pdCIsImNsZWFuU2NyZWVuIiwiSGVscGVyIiwiY2xlYW5FbGVtZW50IiwiZHJhdyIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiYnVsbGV0U2NyZWVuRGl2IiwiYnVsbGV0U2NyZWVuT25TY3JlZW4iLCJjaGVja1doZXRoZXJIaWRlIiwic3R5bGUiLCJ2aXNpYmlsaXR5IiwidHJhbnNmb3JtIiwid2Via2l0VHJhbnNmb3JtIiwibXNUcmFuc2Zvcm0iLCJNYXRoIiwicm91bmQiLCJ4IiwiYWN0dWFsWSIsImNyZWF0QW5kZ2V0V2lkdGgiLCJidWxsZXRTY3JlZW4iLCJkaXYiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJwb3NpdGlvbiIsIndoaXRlU3BhY2UiLCJmb250V2VpZ2h0IiwiZm9udFNpemUiLCJzaXplIiwiZm9udEZhbWlseSIsImxpbmVIZWlnaHQiLCJjb2xvciIsInNoYWRvd0JsdXIiLCJ0ZXh0U2hhZG93IiwiYm9yZGVyQ29sb3IiLCJ0ZXh0U3Ryb2tlIiwid2Via2l0VGV4dFN0cm9rZSIsInRleHRTdHJva2VDb2xvciIsIndlYmtpdFRleHRTdHJva2VDb2xvciIsImJveENvbG9yIiwicGFkZGluZyIsImJvcmRlciIsImFwcGVuZENoaWxkIiwiY3JlYXRlVGV4dE5vZGUiLCJ0ZXh0IiwiaW5zZXJ0RWxlbWVudCIsIndpZHRoIiwiY2xpZW50V2lkdGgiLCJkZWxldGUiLCJyZW1vdmVDaGlsZCIsInJlQ3JlYXRBbmRnZXRXaWR0aCIsIm92ZXJmbG93IiwibWFyZ2luIiwidXNlclNlbGVjdCIsIndlYmtpdFVzZXJTZWxlY3QiLCJtc1VzZXJTZWxlY3QiLCJjdXJzb3IiLCJyZWdpc3RlckV2ZW50IiwiQnJvd3Nlck5vdFN1cHBvcnRFcnJvciIsIm9uY29udGV4dG1lbnUiLCJlIiwidGFyZ2V0Iiwib25jbGljayIsIm9ubW91c2Vtb3ZlIiwibW91c2VpbiIsImN1cnNvck9uTW91c2VPdmVyIiwib25tb3VzZW91dCIsImVsZW1lbnRzIiwidGFnTmFtZSIsImxlbmd0aCIsImluZGV4IiwiX2xheWVyIiwibGF5ZXIiLCJpbnNlcnRCZWZvcmUiLCJCYXNlUmVuZGVyZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQUVBOzs7SUFHTUEsWTs7O0FBQ0Y7Ozs7Ozs7O0FBUUEsd0JBQVlDLE9BQVosRUFBcUJDLE9BQXJCLEVBQThCQyxXQUE5QixFQUEyQ0MsWUFBM0MsRUFBeUQ7QUFBQTs7QUFBQTs7QUFDckRDLElBQUFBLFlBQVk7O0FBQ1osUUFBSUMsSUFBSSxHQUFHQyxJQUFJLEVBQWY7O0FBQ0Esc0ZBQU1ELElBQU4sRUFBWUosT0FBWixFQUFxQkMsV0FBckI7QUFFQTs7Ozs7QUFJQSxVQUFLSyxXQUFMLEdBQW1CLFlBQVk7QUFDM0JDLHFCQUFPQyxZQUFQLENBQW9CSixJQUFwQjtBQUNILEtBRkQ7QUFJQTs7Ozs7O0FBSUEsVUFBS0ssSUFBTCxHQUFZLFlBQVk7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDcEIsNkJBQTRCTCxJQUFJLENBQUNNLG9CQUFMLENBQTBCLEtBQTFCLENBQTVCLDhIQUE4RDtBQUFBLGNBQXJEQyxlQUFxRDtBQUMxRCxjQUFJLFFBQU9BLGVBQWUsQ0FBQ0Msb0JBQXZCLEtBQStDLFFBQW5ELEVBQTZEOztBQUM3RCxjQUFJLEtBQUtDLGdCQUFMLENBQXNCRixlQUFlLENBQUNDLG9CQUF0QyxDQUFKLEVBQWlFO0FBQzdERCxZQUFBQSxlQUFlLENBQUNHLEtBQWhCLENBQXNCQyxVQUF0QixHQUFtQyxRQUFuQztBQUNBO0FBQ0g7O0FBQ0RKLFVBQUFBLGVBQWUsQ0FBQ0csS0FBaEIsQ0FBc0JDLFVBQXRCLEdBQW1DLFNBQW5D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QSxVQUFJRCxRQUFRLENBQUNFLE1BQVQsS0FBb0IsQ0FBeEIsRUFBMkJyRSxJQUFJLENBQUMwQyxXQUFMLENBQWlCL0MsT0FBakI7QUFDM0IsVUFBSTJFLEtBQUo7O0FBQ0EsV0FBS0EsS0FBSyxHQUFHSCxRQUFRLENBQUNFLE1BQVQsR0FBa0IsQ0FBL0IsRUFBa0NDLEtBQUssR0FBRyxDQUExQyxFQUE2Q0EsS0FBSyxFQUFsRCxFQUFzRDtBQUNsRCxZQUFJQyxNQUFNLEdBQUdKLFFBQVEsQ0FBQ0csS0FBRCxDQUFSLENBQWdCOUQsb0JBQWhCLENBQXFDWSxZQUFyQyxDQUFrRG9ELEtBQS9EO0FBQ0EsWUFBSUQsTUFBTSxJQUFJNUUsT0FBTyxDQUFDYSxvQkFBUixDQUE2QlksWUFBN0IsQ0FBMENvRCxLQUF4RCxFQUErRDtBQUNsRTs7QUFDRCxVQUFJLEVBQUVGLEtBQUYsS0FBWUgsUUFBUSxDQUFDRSxNQUF6QixFQUFpQ3JFLElBQUksQ0FBQzBDLFdBQUwsQ0FBaUIvQyxPQUFqQixFQUFqQyxLQUNLSyxJQUFJLENBQUN5RSxZQUFMLENBQWtCOUUsT0FBbEIsRUFBMkJ3RSxRQUFRLENBQUNHLEtBQUQsQ0FBbkM7QUFDUjs7QUE1S29EO0FBNkt4RDs7O0VBdExzQkksMEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNlUmVuZGVyZXIgfSBmcm9tICcuL2Jhc2VSZW5kZXJlcidcbmltcG9ydCB7IEJyb3dzZXJOb3RTdXBwb3J0RXJyb3IgfSBmcm9tICcuLi8uLi9icm93c2VyTm90U3VwcG9ydEVycm9yJ1xuaW1wb3J0IHsgSGVscGVyIH0gZnJvbSAnLi4vaGVscGVyJztcblxuLyoqXG4gKiBDU1MzIOa4suafk+WZqOexu1xuICovXG5jbGFzcyBDU1MzUmVuZGVyZXIgZXh0ZW5kcyBCYXNlUmVuZGVyZXIge1xuICAgIC8qKlxuICAgICAqIOWunuS+i+WMluS4gOS4qiBDU1MzIOa4suafk+WZqOexu1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbGVtZW50IC0gRWxlbWVudCDlhYPntKBcbiAgICAgKiBAcGFyYW0ge29wZW5CU0V+T3B0aW9uc30gb3B0aW9ucyAtIOWFqOWxgOmAiemhuVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbGVtZW50U2l6ZSAtIOWFg+e0oOWkp+Wwj1xuICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50VHJpZ2dlciAtIOS6i+S7tuW8leWPkeaWueazlVxuICAgICAqIEB0aHJvd3Mge29wZW5CU0UuQnJvd3Nlck5vdFN1cHBvcnRFcnJvcn0g5rWP6KeI5Zmo5LiN5pSv5oyB54m55a6a5riy5p+T5qih5byP5pe25byV5Y+R6ZSZ6K+vXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgb3B0aW9ucywgZWxlbWVudFNpemUsIGV2ZW50VHJpZ2dlcikge1xuICAgICAgICBzdXBwb3J0Q2hlY2soKTsgLy/mtY/op4jlmajmlK/mjIHmo4DmtYtcbiAgICAgICAgbGV0IF9kaXYgPSBpbml0KCk7XG4gICAgICAgIHN1cGVyKF9kaXYsIG9wdGlvbnMsIGVsZW1lbnRTaXplKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5riF6Zmk5bGP5bmV5YaF5a65XG4gICAgICAgICAqIEBvdmVycmlkZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jbGVhblNjcmVlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIEhlbHBlci5jbGVhbkVsZW1lbnQoX2Rpdik7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog57uY5Yi25Ye95pWwXG4gICAgICAgICAqIEBvdmVycmlkZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5kcmF3ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZm9yIChsZXQgYnVsbGV0U2NyZWVuRGl2IG9mIF9kaXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2RpdicpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBidWxsZXRTY3JlZW5EaXYuYnVsbGV0U2NyZWVuT25TY3JlZW4gIT0gJ29iamVjdCcpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrV2hldGhlckhpZGUoYnVsbGV0U2NyZWVuRGl2LmJ1bGxldFNjcmVlbk9uU2NyZWVuKSkge1xuICAgICAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLnRyYW5zZm9ybSA9XG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPVxuICAgICAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUubXNUcmFuc2Zvcm0gPVxuICAgICAgICAgICAgICAgICAgICBgdHJhbnNsYXRlKCR7TWF0aC5yb3VuZChidWxsZXRTY3JlZW5EaXYuYnVsbGV0U2NyZWVuT25TY3JlZW4ueCAtIDQpfXB4LCR7TWF0aC5yb3VuZChidWxsZXRTY3JlZW5EaXYuYnVsbGV0U2NyZWVuT25TY3JlZW4uYWN0dWFsWSAtIDQpfXB4KWA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yib5bu65by55bmV5YWD57SgXG4gICAgICAgICAqIEBvdmVycmlkZVxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gYnVsbGV0U2NyZWVuT25TY3JlZW4gLSDlsY/luZXlvLnluZXlr7nosaFcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY3JlYXRBbmRnZXRXaWR0aCA9IGZ1bmN0aW9uIChidWxsZXRTY3JlZW5PblNjcmVlbikge1xuICAgICAgICAgICAgbGV0IGJ1bGxldFNjcmVlbiA9IGJ1bGxldFNjcmVlbk9uU2NyZWVuLmJ1bGxldFNjcmVlbjtcbiAgICAgICAgICAgIGxldCBidWxsZXRTY3JlZW5EaXYgPSBidWxsZXRTY3JlZW5PblNjcmVlbi5kaXYgPyBidWxsZXRTY3JlZW5PblNjcmVlbi5kaXYgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUud2hpdGVTcGFjZSA9ICdub3dyYXAnO1xuICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLmZvbnRXZWlnaHQgPSBidWxsZXRTY3JlZW4uc3R5bGUuZm9udFdlaWdodDtcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS5mb250U2l6ZSA9IGAke2J1bGxldFNjcmVlbk9uU2NyZWVuLnNpemV9cHhgO1xuICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLmZvbnRGYW1pbHkgPSBidWxsZXRTY3JlZW4uc3R5bGUuZm9udEZhbWlseTtcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS5saW5lSGVpZ2h0ID0gYCR7YnVsbGV0U2NyZWVuT25TY3JlZW4uc2l6ZX1weGA7XG4gICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUuY29sb3IgPSBidWxsZXRTY3JlZW4uc3R5bGUuY29sb3I7XG4gICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuLnN0eWxlLnNoYWRvd0JsdXIgIT0gbnVsbClcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUudGV4dFNoYWRvdyA9IGAwIDAgJHtidWxsZXRTY3JlZW4uc3R5bGUuc2hhZG93Qmx1cn1weCBibGFja2A7XG4gICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuLnN0eWxlLmJvcmRlckNvbG9yICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUudGV4dFN0cm9rZSA9IGJ1bGxldFNjcmVlbkRpdi5zdHlsZS53ZWJraXRUZXh0U3Ryb2tlID0gYDAuNXB4YDtcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUudGV4dFN0cm9rZUNvbG9yID0gYnVsbGV0U2NyZWVuRGl2LnN0eWxlLndlYmtpdFRleHRTdHJva2VDb2xvciA9IGJ1bGxldFNjcmVlbi5zdHlsZS5ib3JkZXJDb2xvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW4uc3R5bGUuYm94Q29sb3IgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS5wYWRkaW5nID0gJzNweCc7XG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLmJvcmRlciA9ICcxcHggc29saWQnO1xuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS5ib3JkZXJDb2xvciA9IGJ1bGxldFNjcmVlbi5zdHlsZS5ib3hDb2xvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS5wYWRkaW5nID0gJzRweCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBIZWxwZXIuY2xlYW5FbGVtZW50KGJ1bGxldFNjcmVlbkRpdik7XG4gICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYnVsbGV0U2NyZWVuLnRleHQpKTtcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5idWxsZXRTY3JlZW5PblNjcmVlbiA9IGJ1bGxldFNjcmVlbk9uU2NyZWVuO1xuICAgICAgICAgICAgaW5zZXJ0RWxlbWVudChidWxsZXRTY3JlZW5EaXYpOyAvL2luc2VydFxuICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4ud2lkdGggPSBidWxsZXRTY3JlZW5EaXYuY2xpZW50V2lkdGggLSA4OyAvL+W8ueW5leeahOWuveW6pu+8muWDj+e0oFxuICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4uZGl2ID0gYnVsbGV0U2NyZWVuRGl2O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICog5Yig6Zmk5by55bmV5YWD57SgXG4gICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICogQHBhcmFtIHtvYmplY3R9IGJ1bGxldFNjcmVlbk9uU2NyZWVuIC0g5bGP5bmV5by55bmV5a+56LGhXG4gICAgICAgICovXG4gICAgICAgIHRoaXMuZGVsZXRlID0gZnVuY3Rpb24gKGJ1bGxldFNjcmVlbk9uU2NyZWVuKSB7XG4gICAgICAgICAgICBfZGl2LnJlbW92ZUNoaWxkKGJ1bGxldFNjcmVlbk9uU2NyZWVuLmRpdik7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog6YeN5paw5re75Yqg5by55bmVXG4gICAgICAgICAqIEBvdmVycmlkZVxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gYnVsbGV0U2NyZWVuT25TY3JlZW4gLSDlsY/luZXlvLnluZXlr7nosaFcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucmVDcmVhdEFuZGdldFdpZHRoID0gZnVuY3Rpb24gKGJ1bGxldFNjcmVlbk9uU2NyZWVuKSB7XG4gICAgICAgICAgICB0aGlzLmRlbGV0ZShidWxsZXRTY3JlZW5PblNjcmVlbik7XG4gICAgICAgICAgICB0aGlzLmNyZWF0QW5kZ2V0V2lkdGgoYnVsbGV0U2NyZWVuT25TY3JlZW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa3u+WKoERpdlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAcmV0dXJucyB7RWxlbWVudH0gRGl2XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpOyAvL0RJVlxuICAgICAgICAgICAgSGVscGVyLmNsZWFuRWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICAgICAgICAgIGRpdi5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgICAgICAgICAgZGl2LnN0eWxlLnBhZGRpbmcgPSAnMCc7XG4gICAgICAgICAgICBkaXYuc3R5bGUubWFyZ2luID0gJzAnO1xuICAgICAgICAgICAgZGl2LnN0eWxlLnVzZXJTZWxlY3QgPVxuICAgICAgICAgICAgICAgIGRpdi5zdHlsZS53ZWJraXRVc2VyU2VsZWN0ID1cbiAgICAgICAgICAgICAgICBkaXYuc3R5bGUubXNVc2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgICAgICAgICAgZGl2LnN0eWxlLmN1cnNvciA9ICdkZWZhdWx0JztcbiAgICAgICAgICAgIHJlZ2lzdGVyRXZlbnQoZGl2KTsgLy/ms6jlhozkuovku7blk43lupTnqIvluo9cbiAgICAgICAgICAgIHJldHVybiBkaXY7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5rWP6KeI5Zmo5pSv5oyB5qOA5rWLXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEB0aHJvd3Mge29wZW5CU0UuQnJvd3Nlck5vdFN1cHBvcnRFcnJvcn0g5rWP6KeI5Zmo5LiN5pSv5oyB54m55a6a5riy5p+T5qih5byP5pe25byV5Y+R6ZSZ6K+vXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBzdXBwb3J0Q2hlY2soKSB7XG4gICAgICAgICAgICBsZXQgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKS5zdHlsZTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0eXBlb2Ygc3R5bGUudHJhbnNmb3JtID09PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiBzdHlsZS5tc1RyYW5zZm9ybSA9PT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2Ygc3R5bGUud2Via2l0VHJhbnNmb3JtID09PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgKSB0aHJvdyBuZXcgQnJvd3Nlck5vdFN1cHBvcnRFcnJvcignQ1NTMyB0cmFuc2Zvcm0nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDms6jlhozkuovku7blk43lupTnqIvluo9cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IC0g5YWD57SgXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiByZWdpc3RlckV2ZW50KGVsZW1lbnQpIHtcbiAgICAgICAgICAgIC8v5LiK5LiL5paH6I+c5Y2VXG4gICAgICAgICAgICBlbGVtZW50Lm9uY29udGV4dG1lbnUgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGlmIChlLnRhcmdldCAhPSB0aGlzKVxuICAgICAgICAgICAgICAgICAgICBldmVudFRyaWdnZXIoJ2NvbnRleHRtZW51JywgZS50YXJnZXQuYnVsbGV0U2NyZWVuT25TY3JlZW4sIGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvL+WNleWHu1xuICAgICAgICAgICAgZWxlbWVudC5vbmNsaWNrID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQgIT0gdGhpcylcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRUcmlnZ2VyKCdjbGljaycsIGUudGFyZ2V0LmJ1bGxldFNjcmVlbk9uU2NyZWVuLCBlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy/pvKDmoIfnp7vliqhcbiAgICAgICAgICAgIGVsZW1lbnQub25tb3VzZW1vdmUgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGxldCBidWxsZXRTY3JlZW5PblNjcmVlbiA9IGUudGFyZ2V0LmJ1bGxldFNjcmVlbk9uU2NyZWVuO1xuICAgICAgICAgICAgICAgIGlmIChlLnRhcmdldCA9PT0gdGhpcyB8fCBidWxsZXRTY3JlZW5PblNjcmVlbi5tb3VzZWluKSByZXR1cm47XG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4ubW91c2VpbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgZS50YXJnZXQuc3R5bGUuY3Vyc29yID0gb3B0aW9ucy5jdXJzb3JPbk1vdXNlT3ZlcjtcbiAgICAgICAgICAgICAgICBldmVudFRyaWdnZXIoJ21vdXNlZW50ZXInLCBidWxsZXRTY3JlZW5PblNjcmVlbiwgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL+m8oOagh+emu+W8gFxuICAgICAgICAgICAgZWxlbWVudC5vbm1vdXNlb3V0ID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuT25TY3JlZW4gPSBlLnRhcmdldC5idWxsZXRTY3JlZW5PblNjcmVlbjtcbiAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQgPT09IHRoaXMgfHwgIWJ1bGxldFNjcmVlbk9uU2NyZWVuLm1vdXNlaW4pIHJldHVybjtcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi5tb3VzZWluID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZS50YXJnZXQuc3R5bGUuY3Vyc29yID0gJyc7XG4gICAgICAgICAgICAgICAgZXZlbnRUcmlnZ2VyKCdtb3VzZWxlYXZlJywgYnVsbGV0U2NyZWVuT25TY3JlZW4sIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaMiSBsYXllciDmj5LlhaXlhYPntKBcbiAgICAgICAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IC0g5YWD57SgXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBpbnNlcnRFbGVtZW50KGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGxldCBlbGVtZW50cyA9IF9kaXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoZWxlbWVudC50YWdOYW1lKTtcbiAgICAgICAgICAgIGlmIChlbGVtZW50cy5sZW5ndGggPT09IDApIF9kaXYuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgICAgICBsZXQgaW5kZXg7XG4gICAgICAgICAgICBmb3IgKGluZGV4ID0gZWxlbWVudHMubGVuZ3RoIC0gMTsgaW5kZXggPiAwOyBpbmRleC0tKSB7XG4gICAgICAgICAgICAgICAgbGV0IF9sYXllciA9IGVsZW1lbnRzW2luZGV4XS5idWxsZXRTY3JlZW5PblNjcmVlbi5idWxsZXRTY3JlZW4ubGF5ZXI7XG4gICAgICAgICAgICAgICAgaWYgKF9sYXllciA8PSBlbGVtZW50LmJ1bGxldFNjcmVlbk9uU2NyZWVuLmJ1bGxldFNjcmVlbi5sYXllcikgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKytpbmRleCA9PT0gZWxlbWVudHMubGVuZ3RoKSBfZGl2LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgZWxzZSBfZGl2Lmluc2VydEJlZm9yZShlbGVtZW50LCBlbGVtZW50c1tpbmRleF0pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgeyBDU1MzUmVuZGVyZXIgfTsiXSwiZmlsZSI6ImxpYi9yZW5kZXJlcnMvY3NzM1JlbmRlcmVyLmpzIn0=
