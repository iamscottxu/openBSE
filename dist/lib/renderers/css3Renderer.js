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
          bulletScreenDiv.style.transform = bulletScreenDiv.style.webkitTransform = bulletScreenDiv.style.msTransform = "translate(".concat(bulletScreenDiv.bulletScreenOnScreen.x - 4, "px,").concat(bulletScreenDiv.bulletScreenOnScreen.actualY - 4, "px)");
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9yZW5kZXJlcnMvY3NzM1JlbmRlcmVyLmpzIl0sIm5hbWVzIjpbIkNTUzNSZW5kZXJlciIsImVsZW1lbnQiLCJvcHRpb25zIiwiZWxlbWVudFNpemUiLCJldmVudFRyaWdnZXIiLCJzdXBwb3J0Q2hlY2siLCJfZGl2IiwiaW5pdCIsImNsZWFuU2NyZWVuIiwiSGVscGVyIiwiY2xlYW5FbGVtZW50IiwiZHJhdyIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiYnVsbGV0U2NyZWVuRGl2IiwiYnVsbGV0U2NyZWVuT25TY3JlZW4iLCJjaGVja1doZXRoZXJIaWRlIiwic3R5bGUiLCJ2aXNpYmlsaXR5IiwidHJhbnNmb3JtIiwid2Via2l0VHJhbnNmb3JtIiwibXNUcmFuc2Zvcm0iLCJ4IiwiYWN0dWFsWSIsImNyZWF0QW5kZ2V0V2lkdGgiLCJidWxsZXRTY3JlZW4iLCJkaXYiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJwb3NpdGlvbiIsIndoaXRlU3BhY2UiLCJmb250V2VpZ2h0IiwiZm9udFNpemUiLCJzaXplIiwiZm9udEZhbWlseSIsImxpbmVIZWlnaHQiLCJjb2xvciIsInNoYWRvd0JsdXIiLCJ0ZXh0U2hhZG93IiwiYm9yZGVyQ29sb3IiLCJ0ZXh0U3Ryb2tlIiwid2Via2l0VGV4dFN0cm9rZSIsInRleHRTdHJva2VDb2xvciIsIndlYmtpdFRleHRTdHJva2VDb2xvciIsImJveENvbG9yIiwicGFkZGluZyIsImJvcmRlciIsImFwcGVuZENoaWxkIiwiY3JlYXRlVGV4dE5vZGUiLCJ0ZXh0IiwiaW5zZXJ0RWxlbWVudCIsIndpZHRoIiwiY2xpZW50V2lkdGgiLCJkZWxldGUiLCJyZW1vdmVDaGlsZCIsInJlQ3JlYXRBbmRnZXRXaWR0aCIsIm92ZXJmbG93IiwibWFyZ2luIiwidXNlclNlbGVjdCIsIndlYmtpdFVzZXJTZWxlY3QiLCJtc1VzZXJTZWxlY3QiLCJjdXJzb3IiLCJyZWdpc3RlckV2ZW50IiwiQnJvd3Nlck5vdFN1cHBvcnRFcnJvciIsIm9uY29udGV4dG1lbnUiLCJlIiwidGFyZ2V0Iiwib25jbGljayIsIm9ubW91c2Vtb3ZlIiwibW91c2VpbiIsImN1cnNvck9uTW91c2VPdmVyIiwib25tb3VzZW91dCIsImVsZW1lbnRzIiwidGFnTmFtZSIsImxlbmd0aCIsImluZGV4IiwiX2xheWVyIiwibGF5ZXIiLCJpbnNlcnRCZWZvcmUiLCJCYXNlUmVuZGVyZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQUVBOzs7SUFHTUEsWTs7O0FBQ0Y7Ozs7Ozs7O0FBUUEsd0JBQVlDLE9BQVosRUFBcUJDLE9BQXJCLEVBQThCQyxXQUE5QixFQUEyQ0MsWUFBM0MsRUFBeUQ7QUFBQTs7QUFBQTs7QUFDckRDLElBQUFBLFlBQVk7O0FBQ1osUUFBSUMsSUFBSSxHQUFHQyxJQUFJLEVBQWY7O0FBQ0Esc0ZBQU1ELElBQU4sRUFBWUosT0FBWixFQUFxQkMsV0FBckI7QUFFQTs7Ozs7QUFJQSxVQUFLSyxXQUFMLEdBQW1CLFlBQVk7QUFDM0JDLHFCQUFPQyxZQUFQLENBQW9CSixJQUFwQjtBQUNILEtBRkQ7QUFJQTs7Ozs7O0FBSUEsVUFBS0ssSUFBTCxHQUFZLFlBQVk7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDcEIsNkJBQTRCTCxJQUFJLENBQUNNLG9CQUFMLENBQTBCLEtBQTFCLENBQTVCLDhIQUE4RDtBQUFBLGNBQXJEQyxlQUFxRDtBQUMxRCxjQUFJLFFBQU9BLGVBQWUsQ0FBQ0Msb0JBQXZCLEtBQStDLFFBQW5ELEVBQTZEOztBQUM3RCxjQUFJLEtBQUtDLGdCQUFMLENBQXNCRixlQUFlLENBQUNDLG9CQUF0QyxDQUFKLEVBQWlFO0FBQzdERCxZQUFBQSxlQUFlLENBQUNHLEtBQWhCLENBQXNCQyxVQUF0QixHQUFtQyxRQUFuQztBQUNBO0FBQ0g7O0FBQ0RKLFVBQUFBLGVBQWUsQ0FBQ0csS0FBaEIsQ0FBc0JDLFVBQXRCLEdBQW1DLFNBQW5DO0FBQ0FKLFVBQUFBLGVB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QUFDM0IsVUFBSXlFLEtBQUo7O0FBQ0EsV0FBS0EsS0FBSyxHQUFHSCxRQUFRLENBQUNFLE1BQVQsR0FBa0IsQ0FBL0IsRUFBa0NDLEtBQUssR0FBRyxDQUExQyxFQUE2Q0EsS0FBSyxFQUFsRCxFQUFzRDtBQUNsRCxZQUFJQyxNQUFNLEdBQUdKLFFBQVEsQ0FBQ0csS0FBRCxDQUFSLENBQWdCNUQsb0JBQWhCLENBQXFDVSxZQUFyQyxDQUFrRG9ELEtBQS9EO0FBQ0EsWUFBSUQsTUFBTSxJQUFJMUUsT0FBTyxDQUFDYSxvQkFBUixDQUE2QlUsWUFBN0IsQ0FBMENvRCxLQUF4RCxFQUErRDtBQUNsRTs7QUFDRCxVQUFJLEVBQUVGLEtBQUYsS0FBWUgsUUFBUSxDQUFDRSxNQUF6QixFQUFpQ25FLElBQUksQ0FBQ3dDLFdBQUwsQ0FBaUI3QyxPQUFqQixFQUFqQyxLQUNLSyxJQUFJLENBQUN1RSxZQUFMLENBQWtCNUUsT0FBbEIsRUFBMkJzRSxRQUFRLENBQUNHLEtBQUQsQ0FBbkM7QUFDUjs7QUE1S29EO0FBNkt4RDs7O0VBdExzQkksMEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNlUmVuZGVyZXIgfSBmcm9tICcuL2Jhc2VSZW5kZXJlcidcclxuaW1wb3J0IHsgQnJvd3Nlck5vdFN1cHBvcnRFcnJvciB9IGZyb20gJy4uLy4uL2Jyb3dzZXJOb3RTdXBwb3J0RXJyb3InXHJcbmltcG9ydCB7IEhlbHBlciB9IGZyb20gJy4uL2hlbHBlcic7XHJcblxyXG4vKipcclxuICogQ1NTMyDmuLLmn5PlmajnsbtcclxuICovXHJcbmNsYXNzIENTUzNSZW5kZXJlciBleHRlbmRzIEJhc2VSZW5kZXJlciB7XHJcbiAgICAvKipcclxuICAgICAqIOWunuS+i+WMluS4gOS4qiBDU1MzIOa4suafk+WZqOexu1xyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGVsZW1lbnQgLSBFbGVtZW50IOWFg+e0oFxyXG4gICAgICogQHBhcmFtIHtvcGVuQlNFfk9wdGlvbnN9IG9wdGlvbnMgLSDlhajlsYDpgInpoblcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbGVtZW50U2l6ZSAtIOWFg+e0oOWkp+Wwj1xyXG4gICAgICogQHBhcmFtIHtFdmVudH0gZXZlbnRUcmlnZ2VyIC0g5LqL5Lu25byV5Y+R5pa55rOVXHJcbiAgICAgKiBAdGhyb3dzIHtvcGVuQlNFLkJyb3dzZXJOb3RTdXBwb3J0RXJyb3J9IOa1j+iniOWZqOS4jeaUr+aMgeeJueWumua4suafk+aooeW8j+aXtuW8leWPkemUmeivr1xyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBvcHRpb25zLCBlbGVtZW50U2l6ZSwgZXZlbnRUcmlnZ2VyKSB7XHJcbiAgICAgICAgc3VwcG9ydENoZWNrKCk7IC8v5rWP6KeI5Zmo5pSv5oyB5qOA5rWLXHJcbiAgICAgICAgbGV0IF9kaXYgPSBpbml0KCk7XHJcbiAgICAgICAgc3VwZXIoX2Rpdiwgb3B0aW9ucywgZWxlbWVudFNpemUpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmuIXpmaTlsY/luZXlhoXlrrlcclxuICAgICAgICAgKiBAb3ZlcnJpZGVcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNsZWFuU2NyZWVuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBIZWxwZXIuY2xlYW5FbGVtZW50KF9kaXYpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog57uY5Yi25Ye95pWwXHJcbiAgICAgICAgICogQG92ZXJyaWRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5kcmF3ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBidWxsZXRTY3JlZW5EaXYgb2YgX2Rpdi5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGl2JykpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYnVsbGV0U2NyZWVuRGl2LmJ1bGxldFNjcmVlbk9uU2NyZWVuICE9ICdvYmplY3QnKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrV2hldGhlckhpZGUoYnVsbGV0U2NyZWVuRGl2LmJ1bGxldFNjcmVlbk9uU2NyZWVuKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcclxuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS50cmFuc2Zvcm0gPVxyXG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPVxyXG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS5tc1RyYW5zZm9ybSA9XHJcbiAgICAgICAgICAgICAgICAgICAgYHRyYW5zbGF0ZSgkeyhidWxsZXRTY3JlZW5EaXYuYnVsbGV0U2NyZWVuT25TY3JlZW4ueCAtIDQpfXB4LCR7KGJ1bGxldFNjcmVlbkRpdi5idWxsZXRTY3JlZW5PblNjcmVlbi5hY3R1YWxZIC0gNCl9cHgpYDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5Yib5bu65by55bmV5YWD57SgXHJcbiAgICAgICAgICogQG92ZXJyaWRlXHJcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGJ1bGxldFNjcmVlbk9uU2NyZWVuIC0g5bGP5bmV5by55bmV5a+56LGhXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jcmVhdEFuZGdldFdpZHRoID0gZnVuY3Rpb24gKGJ1bGxldFNjcmVlbk9uU2NyZWVuKSB7XHJcbiAgICAgICAgICAgIGxldCBidWxsZXRTY3JlZW4gPSBidWxsZXRTY3JlZW5PblNjcmVlbi5idWxsZXRTY3JlZW47XHJcbiAgICAgICAgICAgIGxldCBidWxsZXRTY3JlZW5EaXYgPSBidWxsZXRTY3JlZW5PblNjcmVlbi5kaXYgPyBidWxsZXRTY3JlZW5PblNjcmVlbi5kaXYgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLndoaXRlU3BhY2UgPSAnbm93cmFwJztcclxuICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLmZvbnRXZWlnaHQgPSBidWxsZXRTY3JlZW4uc3R5bGUuZm9udFdlaWdodDtcclxuICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLmZvbnRTaXplID0gYCR7YnVsbGV0U2NyZWVuT25TY3JlZW4uc2l6ZX1weGA7XHJcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS5mb250RmFtaWx5ID0gYnVsbGV0U2NyZWVuLnN0eWxlLmZvbnRGYW1pbHk7XHJcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS5saW5lSGVpZ2h0ID0gYCR7YnVsbGV0U2NyZWVuT25TY3JlZW4uc2l6ZX1weGA7XHJcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS5jb2xvciA9IGJ1bGxldFNjcmVlbi5zdHlsZS5jb2xvcjtcclxuICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbi5zdHlsZS5zaGFkb3dCbHVyICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUudGV4dFNoYWRvdyA9IGAwIDAgJHtidWxsZXRTY3JlZW4uc3R5bGUuc2hhZG93Qmx1cn1weCBibGFja2A7XHJcbiAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW4uc3R5bGUuYm9yZGVyQ29sb3IgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLnRleHRTdHJva2UgPSBidWxsZXRTY3JlZW5EaXYuc3R5bGUud2Via2l0VGV4dFN0cm9rZSA9IGAwLjVweGA7XHJcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUudGV4dFN0cm9rZUNvbG9yID0gYnVsbGV0U2NyZWVuRGl2LnN0eWxlLndlYmtpdFRleHRTdHJva2VDb2xvciA9IGJ1bGxldFNjcmVlbi5zdHlsZS5ib3JkZXJDb2xvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuLnN0eWxlLmJveENvbG9yICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS5wYWRkaW5nID0gJzNweCc7XHJcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUuYm9yZGVyID0gJzFweCBzb2xpZCc7XHJcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUuYm9yZGVyQ29sb3IgPSBidWxsZXRTY3JlZW4uc3R5bGUuYm94Q29sb3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUucGFkZGluZyA9ICc0cHgnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIEhlbHBlci5jbGVhbkVsZW1lbnQoYnVsbGV0U2NyZWVuRGl2KTtcclxuICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGJ1bGxldFNjcmVlbi50ZXh0KSk7XHJcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5idWxsZXRTY3JlZW5PblNjcmVlbiA9IGJ1bGxldFNjcmVlbk9uU2NyZWVuO1xyXG4gICAgICAgICAgICBpbnNlcnRFbGVtZW50KGJ1bGxldFNjcmVlbkRpdik7IC8vaW5zZXJ0XHJcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLndpZHRoID0gYnVsbGV0U2NyZWVuRGl2LmNsaWVudFdpZHRoIC0gODsgLy/lvLnluZXnmoTlrr3luqbvvJrlg4/ntKBcclxuICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4uZGl2ID0gYnVsbGV0U2NyZWVuRGl2O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiDliKDpmaTlvLnluZXlhYPntKBcclxuICAgICAgICAqIEBvdmVycmlkZVxyXG4gICAgICAgICogQHBhcmFtIHtvYmplY3R9IGJ1bGxldFNjcmVlbk9uU2NyZWVuIC0g5bGP5bmV5by55bmV5a+56LGhXHJcbiAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmRlbGV0ZSA9IGZ1bmN0aW9uIChidWxsZXRTY3JlZW5PblNjcmVlbikge1xyXG4gICAgICAgICAgICBfZGl2LnJlbW92ZUNoaWxkKGJ1bGxldFNjcmVlbk9uU2NyZWVuLmRpdik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDph43mlrDmt7vliqDlvLnluZVcclxuICAgICAgICAgKiBAb3ZlcnJpZGVcclxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gYnVsbGV0U2NyZWVuT25TY3JlZW4gLSDlsY/luZXlvLnluZXlr7nosaFcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnJlQ3JlYXRBbmRnZXRXaWR0aCA9IGZ1bmN0aW9uIChidWxsZXRTY3JlZW5PblNjcmVlbikge1xyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZShidWxsZXRTY3JlZW5PblNjcmVlbik7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRBbmRnZXRXaWR0aChidWxsZXRTY3JlZW5PblNjcmVlbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmt7vliqBEaXZcclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqIEByZXR1cm5zIHtFbGVtZW50fSBEaXZcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7IC8vRElWXHJcbiAgICAgICAgICAgIEhlbHBlci5jbGVhbkVsZW1lbnQoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoZGl2KTtcclxuICAgICAgICAgICAgZGl2LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcbiAgICAgICAgICAgIGRpdi5zdHlsZS5wYWRkaW5nID0gJzAnO1xyXG4gICAgICAgICAgICBkaXYuc3R5bGUubWFyZ2luID0gJzAnO1xyXG4gICAgICAgICAgICBkaXYuc3R5bGUudXNlclNlbGVjdCA9XHJcbiAgICAgICAgICAgICAgICBkaXYuc3R5bGUud2Via2l0VXNlclNlbGVjdCA9XHJcbiAgICAgICAgICAgICAgICBkaXYuc3R5bGUubXNVc2VyU2VsZWN0ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICBkaXYuc3R5bGUuY3Vyc29yID0gJ2RlZmF1bHQnO1xyXG4gICAgICAgICAgICByZWdpc3RlckV2ZW50KGRpdik7IC8v5rOo5YaM5LqL5Lu25ZON5bqU56iL5bqPXHJcbiAgICAgICAgICAgIHJldHVybiBkaXY7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmtY/op4jlmajmlK/mjIHmo4DmtYtcclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqIEB0aHJvd3Mge29wZW5CU0UuQnJvd3Nlck5vdFN1cHBvcnRFcnJvcn0g5rWP6KeI5Zmo5LiN5pSv5oyB54m55a6a5riy5p+T5qih5byP5pe25byV5Y+R6ZSZ6K+vXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gc3VwcG9ydENoZWNrKCkge1xyXG4gICAgICAgICAgICBsZXQgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKS5zdHlsZTtcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgdHlwZW9mIHN0eWxlLnRyYW5zZm9ybSA9PT0gJ3VuZGVmaW5lZCcgJiZcclxuICAgICAgICAgICAgICAgIHR5cGVvZiBzdHlsZS5tc1RyYW5zZm9ybSA9PT0gJ3VuZGVmaW5lZCcgJiZcclxuICAgICAgICAgICAgICAgIHR5cGVvZiBzdHlsZS53ZWJraXRUcmFuc2Zvcm0gPT09ICd1bmRlZmluZWQnXHJcbiAgICAgICAgICAgICkgdGhyb3cgbmV3IEJyb3dzZXJOb3RTdXBwb3J0RXJyb3IoJ0NTUzMgdHJhbnNmb3JtJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDms6jlhozkuovku7blk43lupTnqIvluo9cclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCAtIOWFg+e0oFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHJlZ2lzdGVyRXZlbnQoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAvL+S4iuS4i+aWh+iPnOWNlVxyXG4gICAgICAgICAgICBlbGVtZW50Lm9uY29udGV4dG1lbnUgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0ICE9IHRoaXMpXHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRUcmlnZ2VyKCdjb250ZXh0bWVudScsIGUudGFyZ2V0LmJ1bGxldFNjcmVlbk9uU2NyZWVuLCBlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgLy/ljZXlh7tcclxuICAgICAgICAgICAgZWxlbWVudC5vbmNsaWNrID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlLnRhcmdldCAhPSB0aGlzKVxyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50VHJpZ2dlcignY2xpY2snLCBlLnRhcmdldC5idWxsZXRTY3JlZW5PblNjcmVlbiwgZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIC8v6byg5qCH56e75YqoXHJcbiAgICAgICAgICAgIGVsZW1lbnQub25tb3VzZW1vdmUgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJ1bGxldFNjcmVlbk9uU2NyZWVuID0gZS50YXJnZXQuYnVsbGV0U2NyZWVuT25TY3JlZW47XHJcbiAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQgPT09IHRoaXMgfHwgYnVsbGV0U2NyZWVuT25TY3JlZW4ubW91c2VpbikgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4ubW91c2VpbiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBlLnRhcmdldC5zdHlsZS5jdXJzb3IgPSBvcHRpb25zLmN1cnNvck9uTW91c2VPdmVyO1xyXG4gICAgICAgICAgICAgICAgZXZlbnRUcmlnZ2VyKCdtb3VzZWVudGVyJywgYnVsbGV0U2NyZWVuT25TY3JlZW4sIGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8v6byg5qCH56a75byAXHJcbiAgICAgICAgICAgIGVsZW1lbnQub25tb3VzZW91dCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuT25TY3JlZW4gPSBlLnRhcmdldC5idWxsZXRTY3JlZW5PblNjcmVlbjtcclxuICAgICAgICAgICAgICAgIGlmIChlLnRhcmdldCA9PT0gdGhpcyB8fCAhYnVsbGV0U2NyZWVuT25TY3JlZW4ubW91c2VpbikgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4ubW91c2VpbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgZS50YXJnZXQuc3R5bGUuY3Vyc29yID0gJyc7XHJcbiAgICAgICAgICAgICAgICBldmVudFRyaWdnZXIoJ21vdXNlbGVhdmUnLCBidWxsZXRTY3JlZW5PblNjcmVlbiwgZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOaMiSBsYXllciDmj5LlhaXlhYPntKBcclxuICAgICAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgLSDlhYPntKBcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBpbnNlcnRFbGVtZW50KGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnRzID0gX2Rpdi5nZXRFbGVtZW50c0J5VGFnTmFtZShlbGVtZW50LnRhZ05hbWUpO1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudHMubGVuZ3RoID09PSAwKSBfZGl2LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICBsZXQgaW5kZXg7XHJcbiAgICAgICAgICAgIGZvciAoaW5kZXggPSBlbGVtZW50cy5sZW5ndGggLSAxOyBpbmRleCA+IDA7IGluZGV4LS0pIHtcclxuICAgICAgICAgICAgICAgIGxldCBfbGF5ZXIgPSBlbGVtZW50c1tpbmRleF0uYnVsbGV0U2NyZWVuT25TY3JlZW4uYnVsbGV0U2NyZWVuLmxheWVyO1xyXG4gICAgICAgICAgICAgICAgaWYgKF9sYXllciA8PSBlbGVtZW50LmJ1bGxldFNjcmVlbk9uU2NyZWVuLmJ1bGxldFNjcmVlbi5sYXllcikgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCsraW5kZXggPT09IGVsZW1lbnRzLmxlbmd0aCkgX2Rpdi5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxuICAgICAgICAgICAgZWxzZSBfZGl2Lmluc2VydEJlZm9yZShlbGVtZW50LCBlbGVtZW50c1tpbmRleF0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHsgQ1NTM1JlbmRlcmVyIH07Il0sImZpbGUiOiJsaWIvcmVuZGVyZXJzL2NzczNSZW5kZXJlci5qcyJ9
