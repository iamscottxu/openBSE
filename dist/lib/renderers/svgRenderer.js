"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SVGRenderer = void 0;

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
 * SVG 渲染器类
 */
var SVGRenderer = function (_BaseRenderer) {
  _inherits(SVGRenderer, _BaseRenderer);

  /**
   * 实例化一个 SVG 渲染器类
   * @param {object} element - Element 元素
   * @param {openBSE~Options} options - 全局选项
   * @param {object} elementSize - 元素大小
   * @param {Event} eventTrigger - 事件引发方法
   * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
   */
  function SVGRenderer(element, options, elementSize, eventTrigger) {
    var _this;

    _classCallCheck(this, SVGRenderer);

    supportCheck();

    var _svg;

    var _defsSvg;

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SVGRenderer).call(this, init(), options, elementSize));
    /**
     * 清除屏幕内容
     * @override
     */

    _this.cleanScreen = function () {
      _helper.Helper.cleanElement(_svg);

      _defsSvg = createElementSVG('defs');

      _svg.appendChild(_defsSvg);
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
        for (var _iterator = _svg.getElementsByTagName('text')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var textSvg = _step.value;
          var bulletScreenOnScreen = textSvg.bulletScreenOnScreen;

          for (var key in bulletScreenOnScreen.svg) {
            var item = bulletScreenOnScreen.svg[key];
            if (this.checkWhetherHide(bulletScreenOnScreen)) item.setAttribute('opacity', '0');else item.setAttribute('opacity', '1');
            item.setAttribute('transform', "translate(".concat(Math.round(bulletScreenOnScreen.x - 4), ",").concat(Math.round(bulletScreenOnScreen.actualY - 4), ")"));
          }
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
      bulletScreenOnScreen.svg = _typeof(bulletScreenOnScreen.svg) === 'object' ? bulletScreenOnScreen.svg : {};
      var textSvg = _typeof(bulletScreenOnScreen.svg.text) === 'object' ? bulletScreenOnScreen.svg.text : createElementSVG('text');
      textSvg.setAttribute('x', 0);
      textSvg.setAttribute('y', bulletScreenOnScreen.size * 0.8);
      textSvg.setAttribute('font-family', bulletScreen.style.fontFamily);
      textSvg.setAttribute('font-size', bulletScreenOnScreen.size);
      textSvg.setAttribute('font-weight', bulletScreen.style.fontWeight);
      textSvg.setAttribute('fill', bulletScreen.style.color);

      _helper.Helper.cleanElement(textSvg);

      textSvg.appendChild(document.createTextNode(bulletScreen.text));

      if (bulletScreen.style.borderColor != null) {
        textSvg.setAttribute('stroke', bulletScreen.borderColor);
        textSvg.setAttribute('stroke-width', 0.5);
      }

      if (bulletScreen.style.shadowBlur != null) {
        var filterId = "bulletScreenEngine_svgFilter_shadow_".concat(bulletScreen.style.shadowBlur);
        var filterSvg = document.getElementById(filterId);

        if (filterSvg === null) {
          filterSvg = createElementSVG('filter');
          filterSvg.id = filterId;
          filterSvg.setAttribute('x', '-100%');
          filterSvg.setAttribute('y', '-100%');
          filterSvg.setAttribute('width', '300%');
          filterSvg.setAttribute('height', '300%');
          var feOffsetSvg = createElementSVG('feOffset');
          feOffsetSvg.setAttribute('result', 'offOut');
          feOffsetSvg.setAttribute('in', 'SourceAlpha');
          filterSvg.appendChild(feOffsetSvg);
          var feGaussianBlurSvg = createElementSVG('feGaussianBlur');
          feGaussianBlurSvg.setAttribute('result', 'blurOut');
          feGaussianBlurSvg.setAttribute('in', 'offOut');
          feGaussianBlurSvg.setAttribute('stdDeviation', bulletScreen.style.shadowBlur);
          filterSvg.appendChild(feGaussianBlurSvg);
          var feBlendSvg = createElementSVG('feBlend');
          feBlendSvg.setAttribute('in', 'SourceGraphic');
          feBlendSvg.setAttribute('in2', 'blurOut');
          feBlendSvg.setAttribute('mode', 'normal');
          filterSvg.appendChild(feBlendSvg);
          filterSvg.bulletScreenCount = 0;

          _defsSvg.appendChild(filterSvg);
        }

        filterSvg.bulletScreenCount++;
        textSvg.setAttribute('filter', "url(#".concat(filterId, ")"));
        bulletScreenOnScreen.filterId = filterId;
      }

      bulletScreenOnScreen.svg.text = textSvg;
      textSvg.bulletScreenOnScreen = bulletScreenOnScreen;
      insertElement(textSvg);
      bulletScreenOnScreen.width = textSvg.getComputedTextLength();

      if (bulletScreen.style.boxColor != null) {
        var rectSvg = _typeof(bulletScreenOnScreen.svg.rect) === 'object' ? bulletScreenOnScreen.svg.rect : createElementSVG('rect');
        rectSvg.setAttribute('x', -3);
        rectSvg.setAttribute('y', -3);
        rectSvg.setAttribute('fill', 'none');
        rectSvg.setAttribute('height', bulletScreenOnScreen.height + 7);
        rectSvg.setAttribute('width', bulletScreenOnScreen.width + 7);
        rectSvg.setAttribute('stroke', bulletScreen.style.boxColor);
        rectSvg.setAttribute('stroke-width', 1);
        bulletScreenOnScreen.svg.rect = rectSvg;
        rectSvg.bulletScreenOnScreen = bulletScreenOnScreen;

        _svg.insertBefore(rectSvg, textSvg);
      }
    };
    /**
    * 删除弹幕元素
    * @override
    * @param {object} bulletScreenOnScreen - 屏幕弹幕对象
    */


    _this.delete = function (bulletScreenOnScreen) {
      if (typeof bulletScreenOnScreen.filterId != 'undefined') {
        var filterSvg = document.getElementById(bulletScreenOnScreen.filterId);
        if (filterSvg != null && --filterSvg.bulletScreenCount === 0) _defsSvg.removeChild(filterSvg);
      }

      for (var index in bulletScreenOnScreen.svg) {
        _svg.removeChild(bulletScreenOnScreen.svg[index]);
      }
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

      _svg.setAttribute('height', elementSize.height);

      _svg.setAttribute('width', elementSize.width);
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
      div.style.padding = '0';
      div.style.margin = '0';
      _svg = createElementSVG('svg');
      _defsSvg = createElementSVG('defs');

      _svg.appendChild(_defsSvg);

      _svg.setAttribute('height', elementSize.height);

      _svg.setAttribute('width', elementSize.width);

      div.appendChild(_svg);
      var eventDiv = document.createElement('div');
      eventDiv.style.position = 'absolute';
      eventDiv.style.top = eventDiv.style.right = eventDiv.style.bottom = eventDiv.style.left = '0';
      div.appendChild(eventDiv);
      registerEvent(eventDiv);
      return div;
    }
    /**
     * 浏览器支持检测
     * @private
     * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
     */


    function supportCheck() {
      if (typeof document.createElementNS != 'function') throw new _browserNotSupportError.BrowserNotSupportError('createElementNS Function');
      if (typeof createElementSVG('svg').createSVGRect != 'function') throw new _browserNotSupportError.BrowserNotSupportError('SVG');
    }

    var _checkWhetherHide = _this.checkWhetherHide;
    /**
     * 注册事件响应程序
     * @private
     * @param {Element} element - 元素
     */

    function registerEvent(element) {
      function getBulletScreenOnScreenByLocation(location) {
        var textSvgs = _svg.getElementsByTagName('text');

        for (var index = textSvgs.length - 1; index > 0; index--) {
          var bulletScreenOnScreen = textSvgs[index].bulletScreenOnScreen;
          if (_checkWhetherHide(bulletScreenOnScreen)) return;
          var x1 = bulletScreenOnScreen.x - 4;
          var x2 = x1 + bulletScreenOnScreen.width + 8;
          var y1 = bulletScreenOnScreen.actualY - 4;
          var y2 = y1 + bulletScreenOnScreen.height + 8;
          if (location.x >= x1 && location.x <= x2 && location.y >= y1 && location.y <= y2) return bulletScreenOnScreen;
        }

        return null;
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
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = _svg.getElementsByTagName('text')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var textSvg = _step2.value;
            var _bulletScreenOnScreen = textSvg.bulletScreenOnScreen;

            if (_bulletScreenOnScreen != bulletScreenOnScreen && _bulletScreenOnScreen.mousein) {
              _bulletScreenOnScreen.mousein = false;
              element.style.cursor = '';
              eventTrigger('mouseleave', _bulletScreenOnScreen, e);
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        if (bulletScreenOnScreen === null || bulletScreenOnScreen.mousein) return false;
        bulletScreenOnScreen.mousein = true;
        element.style.cursor = options.cursorOnMouseOver;
        eventTrigger('mouseenter', bulletScreenOnScreen, e);
        return false;
      };

      element.onmouseout = function (e) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = _svg.getElementsByTagName('text')[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var textSvg = _step3.value;
            var _bulletScreenOnScreen = textSvg.bulletScreenOnScreen;

            if (_bulletScreenOnScreen.mousein) {
              _bulletScreenOnScreen.mousein = false;
              element.style.cursor = '';
              eventTrigger('mouseleave', _bulletScreenOnScreen, e);
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      };
    }
    /**
     * 创建 SVG 元素
     * @private
     * @param {string} qualifiedName - Element 名称
     * @param {object} options - 选项
     */


    function createElementSVG(qualifiedName, options) {
      return document.createElementNS('http://www.w3.org/2000/svg', qualifiedName, options);
    }
    /**
     * 按 layer 插入元素
     * @param {Element} element - 元素
     */


    function insertElement(element) {
      var elements = _svg.getElementsByTagName(element.tagName);

      if (elements.length === 0) _svg.appendChild(element);
      var index;

      for (index = elements.length - 1; index > 0; index--) {
        var _layer = elements[index].bulletScreenOnScreen.bulletScreen.layer;
        if (_layer <= element.bulletScreenOnScreen.bulletScreen.layer) break;
      }

      if (++index === elements.length) _svg.appendChild(element);else _svg.insertBefore(element, elements[index]);
    }

    return _this;
  }

  return SVGRenderer;
}(_baseRenderer.BaseRenderer);

exports.SVGRenderer = SVGRenderer;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9yZW5kZXJlcnMvc3ZnUmVuZGVyZXIuanMiXSwibmFtZXMiOlsiU1ZHUmVuZGVyZXIiLCJlbGVtZW50Iiwib3B0aW9ucyIsImVsZW1lbnRTaXplIiwiZXZlbnRUcmlnZ2VyIiwic3VwcG9ydENoZWNrIiwiX3N2ZyIsIl9kZWZzU3ZnIiwiaW5pdCIsImNsZWFuU2NyZWVuIiwiSGVscGVyIiwiY2xlYW5FbGVtZW50IiwiY3JlYXRlRWxlbWVudFNWRyIsImFwcGVuZENoaWxkIiwiZHJhdyIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwidGV4dFN2ZyIsImJ1bGxldFNjcmVlbk9uU2NyZWVuIiwia2V5Iiwic3ZnIiwiaXRlbSIsImNoZWNrV2hldGhlckhpZGUiLCJzZXRBdHRyaWJ1dGUiLCJNYXRoIiwicm91bmQiLCJ4IiwiYWN0dWFsWSIsImNyZWF0QW5kZ2V0V2lkdGgiLCJidWxsZXRTY3JlZW4iLCJ0ZXh0Iiwic2l6ZSIsInN0eWxlIiwiZm9udEZhbWlseSIsImZvbnRXZWlnaHQiLCJjb2xvciIsImRvY3VtZW50IiwiY3JlYXRlVGV4dE5vZGUiLCJib3JkZXJDb2xvciIsInNoYWRvd0JsdXIiLCJmaWx0ZXJJZCIsImZpbHRlclN2ZyIsImdldEVsZW1lbnRCeUlkIiwiaWQiLCJmZU9mZnNldFN2ZyIsImZlR2F1c3NpYW5CbHVyU3ZnIiwiZmVCbGVuZFN2ZyIsImJ1bGxldFNjcmVlbkNvdW50IiwiaW5zZXJ0RWxlbWVudCIsIndpZHRoIiwiZ2V0Q29tcHV0ZWRUZXh0TGVuZ3RoIiwiYm94Q29sb3IiLCJyZWN0U3ZnIiwicmVjdCIsImhlaWdodCIsImluc2VydEJlZm9yZSIsImRlbGV0ZSIsInJlbW92ZUNoaWxkIiwiaW5kZXgiLCJyZUNyZWF0QW5kZ2V0V2lkdGgiLCJfc2V0U2l6ZSIsInNldFNpemUiLCJkaXYiLCJjcmVhdGVFbGVtZW50IiwicGFkZGluZyIsIm1hcmdpbiIsImV2ZW50RGl2IiwicG9zaXRpb24iLCJ0b3AiLCJyaWdodCIsImJvdHRvbSIsImxlZnQiLCJyZWdpc3RlckV2ZW50IiwiY3JlYXRlRWxlbWVudE5TIiwiQnJvd3Nlck5vdFN1cHBvcnRFcnJvciIsImNyZWF0ZVNWR1JlY3QiLCJfY2hlY2tXaGV0aGVySGlkZSIsImdldEJ1bGxldFNjcmVlbk9uU2NyZWVuQnlMb2NhdGlvbiIsImxvY2F0aW9uIiwidGV4dFN2Z3MiLCJsZW5ndGgiLCJ4MSIsIngyIiwieTEiLCJ5MiIsInkiLCJnZXRMb2NhdGlvbiIsImUiLCJnZXRPZmZzZXRUb3AiLCJvZmZzZXRUb3AiLCJvZmZzZXRQYXJlbnQiLCJnZXRPZmZzZXRMZWZ0Iiwib2Zmc2V0TGVmdCIsIm9mZnNldFgiLCJsYXllclgiLCJwYWdlWCIsImRvYyIsImRvY3VtZW50RWxlbWVudCIsImJvZHkiLCJjbGllbnRYIiwic2Nyb2xsTGVmdCIsImNsaWVudExlZnQiLCJwYWdlWSIsImNsaWVudFkiLCJzY3JvbGxUb3AiLCJjbGllbnRUb3AiLCJ0YXJnZXQiLCJsYXllclkiLCJvZmZzZXRZIiwib25jb250ZXh0bWVudSIsIm9uY2xpY2siLCJvbm1vdXNlbW92ZSIsIl9idWxsZXRTY3JlZW5PblNjcmVlbiIsIm1vdXNlaW4iLCJjdXJzb3IiLCJjdXJzb3JPbk1vdXNlT3ZlciIsIm9ubW91c2VvdXQiLCJxdWFsaWZpZWROYW1lIiwiZWxlbWVudHMiLCJ0YWdOYW1lIiwiX2xheWVyIiwibGF5ZXIiLCJCYXNlUmVuZGVyZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQUVBOzs7SUFHTUEsVzs7O0FBQ0Y7Ozs7Ozs7O0FBUUEsdUJBQVlDLE9BQVosRUFBcUJDLE9BQXJCLEVBQThCQyxXQUE5QixFQUEyQ0MsWUFBM0MsRUFBeUQ7QUFBQTs7QUFBQTs7QUFDckRDLElBQUFBLFlBQVk7O0FBQ1osUUFBSUMsSUFBSjs7QUFDQSxRQUFJQyxRQUFKOztBQUNBLHFGQUFNQyxJQUFJLEVBQVYsRUFBY04sT0FBZCxFQUF1QkMsV0FBdkI7QUFF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eUNsSCxPQUF6QyxFQUFrRDtBQUM5QyxhQUFPaUMsUUFBUSxDQUFDcUMsZUFBVCxDQUF5Qiw0QkFBekIsRUFBdUQ0QyxhQUF2RCxFQUFzRWxILE9BQXRFLENBQVA7QUFDSDtBQUVEOzs7Ozs7QUFJQSxhQUFTNkMsYUFBVCxDQUF1QjlDLE9BQXZCLEVBQWdDO0FBQzVCLFVBQUlvSCxRQUFRLEdBQUcvRyxJQUFJLENBQUNTLG9CQUFMLENBQTBCZCxPQUFPLENBQUNxSCxPQUFsQyxDQUFmOztBQUNBLFVBQUlELFFBQVEsQ0FBQ3RDLE1BQVQsS0FBb0IsQ0FBeEIsRUFBMkJ6RSxJQUFJLENBQUNPLFdBQUwsQ0FBaUJaLE9BQWpCO0FBQzNCLFVBQUl3RCxLQUFKOztBQUNBLFdBQUtBLEtBQUssR0FBRzRELFFBQVEsQ0FBQ3RDLE1BQVQsR0FBa0IsQ0FBL0IsRUFBa0N0QixLQUFLLEdBQUcsQ0FBMUMsRUFBNkNBLEtBQUssRUFBbEQsRUFBc0Q7QUFDbEQsWUFBSThELE1BQU0sR0FBR0YsUUFBUSxDQUFDNUQsS0FBRCxDQUFSLENBQWdCeEMsb0JBQWhCLENBQXFDVyxZQUFyQyxDQUFrRDRGLEtBQS9EO0FBQ0EsWUFBSUQsTUFBTSxJQUFJdEgsT0FBTyxDQUFDZ0Isb0JBQVIsQ0FBNkJXLFlBQTdCLENBQTBDNEYsS0FBeEQsRUFBK0Q7QUFDbEU7O0FBQ0QsVUFBSSxFQUFFL0QsS0FBRixLQUFZNEQsUUFBUSxDQUFDdEMsTUFBekIsRUFBaUN6RSxJQUFJLENBQUNPLFdBQUwsQ0FBaUJaLE9BQWpCLEVBQWpDLEtBQ0tLLElBQUksQ0FBQ2dELFlBQUwsQ0FBa0JyRCxPQUFsQixFQUEyQm9ILFFBQVEsQ0FBQzVELEtBQUQsQ0FBbkM7QUFDUjs7QUFqVG9EO0FBa1R4RDs7O0VBM1RxQmdFLDBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZVJlbmRlcmVyIH0gZnJvbSAnLi9iYXNlUmVuZGVyZXInXG5pbXBvcnQgeyBCcm93c2VyTm90U3VwcG9ydEVycm9yIH0gZnJvbSAnLi4vLi4vYnJvd3Nlck5vdFN1cHBvcnRFcnJvcidcbmltcG9ydCB7IEhlbHBlciB9IGZyb20gJy4uL2hlbHBlcidcblxuLyoqXG4gKiBTVkcg5riy5p+T5Zmo57G7XG4gKi9cbmNsYXNzIFNWR1JlbmRlcmVyIGV4dGVuZHMgQmFzZVJlbmRlcmVyIHtcbiAgICAvKipcbiAgICAgKiDlrp7kvovljJbkuIDkuKogU1ZHIOa4suafk+WZqOexu1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbGVtZW50IC0gRWxlbWVudCDlhYPntKBcbiAgICAgKiBAcGFyYW0ge29wZW5CU0V+T3B0aW9uc30gb3B0aW9ucyAtIOWFqOWxgOmAiemhuVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbGVtZW50U2l6ZSAtIOWFg+e0oOWkp+Wwj1xuICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50VHJpZ2dlciAtIOS6i+S7tuW8leWPkeaWueazlVxuICAgICAqIEB0aHJvd3Mge29wZW5CU0UuQnJvd3Nlck5vdFN1cHBvcnRFcnJvcn0g5rWP6KeI5Zmo5LiN5pSv5oyB54m55a6a5riy5p+T5qih5byP5pe25byV5Y+R6ZSZ6K+vXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgb3B0aW9ucywgZWxlbWVudFNpemUsIGV2ZW50VHJpZ2dlcikge1xuICAgICAgICBzdXBwb3J0Q2hlY2soKTsgLy/mtY/op4jlmajmlK/mjIHmo4DmtYtcbiAgICAgICAgbGV0IF9zdmc7XG4gICAgICAgIGxldCBfZGVmc1N2ZztcbiAgICAgICAgc3VwZXIoaW5pdCgpLCBvcHRpb25zLCBlbGVtZW50U2l6ZSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa4hemZpOWxj+W5leWGheWuuVxuICAgICAgICAgKiBAb3ZlcnJpZGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY2xlYW5TY3JlZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBIZWxwZXIuY2xlYW5FbGVtZW50KF9zdmcpO1xuICAgICAgICAgICAgX2RlZnNTdmcgPSBjcmVhdGVFbGVtZW50U1ZHKCdkZWZzJyk7IC8vZGVmc1xuICAgICAgICAgICAgX3N2Zy5hcHBlbmRDaGlsZChfZGVmc1N2Zyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog57uY5Yi25Ye95pWwXG4gICAgICAgICAqIEBvdmVycmlkZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5kcmF3ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZm9yIChsZXQgdGV4dFN2ZyBvZiBfc3ZnLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0ZXh0JykpIHtcbiAgICAgICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuT25TY3JlZW4gPSB0ZXh0U3ZnLmJ1bGxldFNjcmVlbk9uU2NyZWVuO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBidWxsZXRTY3JlZW5PblNjcmVlbi5zdmcpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSBidWxsZXRTY3JlZW5PblNjcmVlbi5zdmdba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tXaGV0aGVySGlkZShidWxsZXRTY3JlZW5PblNjcmVlbikpIGl0ZW0uc2V0QXR0cmlidXRlKCdvcGFjaXR5JywgJzAnKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpdGVtLnNldEF0dHJpYnV0ZSgnb3BhY2l0eScsICcxJyk7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7TWF0aC5yb3VuZChidWxsZXRTY3JlZW5PblNjcmVlbi54IC0gNCl9LCR7TWF0aC5yb3VuZChidWxsZXRTY3JlZW5PblNjcmVlbi5hY3R1YWxZIC0gNCl9KWApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliJvlu7rlvLnluZXlhYPntKBcbiAgICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBidWxsZXRTY3JlZW5PblNjcmVlbiAtIOWxj+W5leW8ueW5leWvueixoVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jcmVhdEFuZGdldFdpZHRoID0gZnVuY3Rpb24gKGJ1bGxldFNjcmVlbk9uU2NyZWVuKSB7XG4gICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuID0gYnVsbGV0U2NyZWVuT25TY3JlZW4uYnVsbGV0U2NyZWVuO1xuICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4uc3ZnID0gdHlwZW9mIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnN2ZyA9PT0gJ29iamVjdCcgPyBidWxsZXRTY3JlZW5PblNjcmVlbi5zdmcgOiB7fTtcblxuICAgICAgICAgICAgbGV0IHRleHRTdmcgPSB0eXBlb2YgYnVsbGV0U2NyZWVuT25TY3JlZW4uc3ZnLnRleHQgPT09ICdvYmplY3QnID8gYnVsbGV0U2NyZWVuT25TY3JlZW4uc3ZnLnRleHQgOiBjcmVhdGVFbGVtZW50U1ZHKCd0ZXh0Jyk7XG4gICAgICAgICAgICB0ZXh0U3ZnLnNldEF0dHJpYnV0ZSgneCcsIDApO1xuICAgICAgICAgICAgdGV4dFN2Zy5zZXRBdHRyaWJ1dGUoJ3knLCBidWxsZXRTY3JlZW5PblNjcmVlbi5zaXplICogMC44KTtcbiAgICAgICAgICAgIHRleHRTdmcuc2V0QXR0cmlidXRlKCdmb250LWZhbWlseScsIGJ1bGxldFNjcmVlbi5zdHlsZS5mb250RmFtaWx5KTtcbiAgICAgICAgICAgIHRleHRTdmcuc2V0QXR0cmlidXRlKCdmb250LXNpemUnLCBidWxsZXRTY3JlZW5PblNjcmVlbi5zaXplKTtcbiAgICAgICAgICAgIHRleHRTdmcuc2V0QXR0cmlidXRlKCdmb250LXdlaWdodCcsIGJ1bGxldFNjcmVlbi5zdHlsZS5mb250V2VpZ2h0KTtcbiAgICAgICAgICAgIHRleHRTdmcuc2V0QXR0cmlidXRlKCdmaWxsJywgYnVsbGV0U2NyZWVuLnN0eWxlLmNvbG9yKTtcbiAgICAgICAgICAgIEhlbHBlci5jbGVhbkVsZW1lbnQodGV4dFN2Zyk7XG4gICAgICAgICAgICB0ZXh0U3ZnLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGJ1bGxldFNjcmVlbi50ZXh0KSk7XG4gICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuLnN0eWxlLmJvcmRlckNvbG9yICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0ZXh0U3ZnLnNldEF0dHJpYnV0ZSgnc3Ryb2tlJywgYnVsbGV0U2NyZWVuLmJvcmRlckNvbG9yKTtcbiAgICAgICAgICAgICAgICB0ZXh0U3ZnLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJywgMC41KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbi5zdHlsZS5zaGFkb3dCbHVyICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsZXQgZmlsdGVySWQgPSBgYnVsbGV0U2NyZWVuRW5naW5lX3N2Z0ZpbHRlcl9zaGFkb3dfJHtidWxsZXRTY3JlZW4uc3R5bGUuc2hhZG93Qmx1cn1gO1xuICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJTdmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChmaWx0ZXJJZCk7XG4gICAgICAgICAgICAgICAgaWYgKGZpbHRlclN2ZyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJTdmcgPSBjcmVhdGVFbGVtZW50U1ZHKCdmaWx0ZXInKTtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyU3ZnLmlkID0gZmlsdGVySWQ7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlclN2Zy5zZXRBdHRyaWJ1dGUoJ3gnLCAnLTEwMCUnKTtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyU3ZnLnNldEF0dHJpYnV0ZSgneScsICctMTAwJScpO1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJTdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsICczMDAlJyk7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlclN2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsICczMDAlJyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmZU9mZnNldFN2ZyA9IGNyZWF0ZUVsZW1lbnRTVkcoJ2ZlT2Zmc2V0Jyk7XG4gICAgICAgICAgICAgICAgICAgIGZlT2Zmc2V0U3ZnLnNldEF0dHJpYnV0ZSgncmVzdWx0JywgJ29mZk91dCcpO1xuICAgICAgICAgICAgICAgICAgICBmZU9mZnNldFN2Zy5zZXRBdHRyaWJ1dGUoJ2luJywgJ1NvdXJjZUFscGhhJyk7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlclN2Zy5hcHBlbmRDaGlsZChmZU9mZnNldFN2Zyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmZUdhdXNzaWFuQmx1clN2ZyA9IGNyZWF0ZUVsZW1lbnRTVkcoJ2ZlR2F1c3NpYW5CbHVyJyk7XG4gICAgICAgICAgICAgICAgICAgIGZlR2F1c3NpYW5CbHVyU3ZnLnNldEF0dHJpYnV0ZSgncmVzdWx0JywgJ2JsdXJPdXQnKTtcbiAgICAgICAgICAgICAgICAgICAgZmVHYXVzc2lhbkJsdXJTdmcuc2V0QXR0cmlidXRlKCdpbicsICdvZmZPdXQnKTtcbiAgICAgICAgICAgICAgICAgICAgZmVHYXVzc2lhbkJsdXJTdmcuc2V0QXR0cmlidXRlKCdzdGREZXZpYXRpb24nLCBidWxsZXRTY3JlZW4uc3R5bGUuc2hhZG93Qmx1cik7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlclN2Zy5hcHBlbmRDaGlsZChmZUdhdXNzaWFuQmx1clN2Zyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmZUJsZW5kU3ZnID0gY3JlYXRlRWxlbWVudFNWRygnZmVCbGVuZCcpO1xuICAgICAgICAgICAgICAgICAgICBmZUJsZW5kU3ZnLnNldEF0dHJpYnV0ZSgnaW4nLCAnU291cmNlR3JhcGhpYycpO1xuICAgICAgICAgICAgICAgICAgICBmZUJsZW5kU3ZnLnNldEF0dHJpYnV0ZSgnaW4yJywgJ2JsdXJPdXQnKTtcbiAgICAgICAgICAgICAgICAgICAgZmVCbGVuZFN2Zy5zZXRBdHRyaWJ1dGUoJ21vZGUnLCAnbm9ybWFsJyk7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlclN2Zy5hcHBlbmRDaGlsZChmZUJsZW5kU3ZnKTtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyU3ZnLmJ1bGxldFNjcmVlbkNvdW50ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgX2RlZnNTdmcuYXBwZW5kQ2hpbGQoZmlsdGVyU3ZnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZmlsdGVyU3ZnLmJ1bGxldFNjcmVlbkNvdW50Kys7XG4gICAgICAgICAgICAgICAgdGV4dFN2Zy5zZXRBdHRyaWJ1dGUoJ2ZpbHRlcicsIGB1cmwoIyR7ZmlsdGVySWR9KWApO1xuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLmZpbHRlcklkID0gZmlsdGVySWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnN2Zy50ZXh0ID0gdGV4dFN2ZztcbiAgICAgICAgICAgIHRleHRTdmcuYnVsbGV0U2NyZWVuT25TY3JlZW4gPSBidWxsZXRTY3JlZW5PblNjcmVlbjtcbiAgICAgICAgICAgIGluc2VydEVsZW1lbnQodGV4dFN2Zyk7XG4gICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi53aWR0aCA9IHRleHRTdmcuZ2V0Q29tcHV0ZWRUZXh0TGVuZ3RoKCk7IC8v5by55bmV55qE5a695bqm77ya5YOP57SgXG5cbiAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW4uc3R5bGUuYm94Q29sb3IgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGxldCByZWN0U3ZnID0gdHlwZW9mIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnN2Zy5yZWN0ID09PSAnb2JqZWN0JyA/IGJ1bGxldFNjcmVlbk9uU2NyZWVuLnN2Zy5yZWN0IDogY3JlYXRlRWxlbWVudFNWRygncmVjdCcpO1xuICAgICAgICAgICAgICAgIHJlY3RTdmcuc2V0QXR0cmlidXRlKCd4JywgLTMpO1xuICAgICAgICAgICAgICAgIHJlY3RTdmcuc2V0QXR0cmlidXRlKCd5JywgLTMpO1xuICAgICAgICAgICAgICAgIHJlY3RTdmcuc2V0QXR0cmlidXRlKCdmaWxsJywgJ25vbmUnKTtcbiAgICAgICAgICAgICAgICByZWN0U3ZnLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgYnVsbGV0U2NyZWVuT25TY3JlZW4uaGVpZ2h0ICsgNyk7XG4gICAgICAgICAgICAgICAgcmVjdFN2Zy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgYnVsbGV0U2NyZWVuT25TY3JlZW4ud2lkdGggKyA3KTtcbiAgICAgICAgICAgICAgICByZWN0U3ZnLnNldEF0dHJpYnV0ZSgnc3Ryb2tlJywgYnVsbGV0U2NyZWVuLnN0eWxlLmJveENvbG9yKTtcbiAgICAgICAgICAgICAgICByZWN0U3ZnLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJywgMSk7XG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4uc3ZnLnJlY3QgPSByZWN0U3ZnO1xuICAgICAgICAgICAgICAgIHJlY3RTdmcuYnVsbGV0U2NyZWVuT25TY3JlZW4gPSBidWxsZXRTY3JlZW5PblNjcmVlbjtcbiAgICAgICAgICAgICAgICBfc3ZnLmluc2VydEJlZm9yZShyZWN0U3ZnLCB0ZXh0U3ZnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAqIOWIoOmZpOW8ueW5leWFg+e0oFxuICAgICAgICAqIEBvdmVycmlkZVxuICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBidWxsZXRTY3JlZW5PblNjcmVlbiAtIOWxj+W5leW8ueW5leWvueixoVxuICAgICAgICAqL1xuICAgICAgICB0aGlzLmRlbGV0ZSA9IGZ1bmN0aW9uIChidWxsZXRTY3JlZW5PblNjcmVlbikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBidWxsZXRTY3JlZW5PblNjcmVlbi5maWx0ZXJJZCAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJTdmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChidWxsZXRTY3JlZW5PblNjcmVlbi5maWx0ZXJJZCk7XG4gICAgICAgICAgICAgICAgaWYgKGZpbHRlclN2ZyAhPSBudWxsICYmIC0tZmlsdGVyU3ZnLmJ1bGxldFNjcmVlbkNvdW50ID09PSAwKVxuICAgICAgICAgICAgICAgICAgICBfZGVmc1N2Zy5yZW1vdmVDaGlsZChmaWx0ZXJTdmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggaW4gYnVsbGV0U2NyZWVuT25TY3JlZW4uc3ZnKSB7XG4gICAgICAgICAgICAgICAgX3N2Zy5yZW1vdmVDaGlsZChidWxsZXRTY3JlZW5PblNjcmVlbi5zdmdbaW5kZXhdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDph43mlrDmt7vliqDlvLnluZVcbiAgICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBidWxsZXRTY3JlZW5PblNjcmVlbiAtIOWxj+W5leW8ueW5leWvueixoVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5yZUNyZWF0QW5kZ2V0V2lkdGggPSBmdW5jdGlvbiAoYnVsbGV0U2NyZWVuT25TY3JlZW4pIHtcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlKGJ1bGxldFNjcmVlbk9uU2NyZWVuKTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRBbmRnZXRXaWR0aChidWxsZXRTY3JlZW5PblNjcmVlbik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgX3NldFNpemUgPSB0aGlzLnNldFNpemU7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDorr7nva7lsLrlr7hcbiAgICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnNldFNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfc2V0U2l6ZSgpO1xuICAgICAgICAgICAgX3N2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIGVsZW1lbnRTaXplLmhlaWdodCk7XG4gICAgICAgICAgICBfc3ZnLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBlbGVtZW50U2l6ZS53aWR0aCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5re75YqgRGl2XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEByZXR1cm5zIHtFbGVtZW50fSBEaXZcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7IC8vRElWXG4gICAgICAgICAgICBIZWxwZXIuY2xlYW5FbGVtZW50KGVsZW1lbnQpO1xuICAgICAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgICAgICAgZGl2LnN0eWxlLnBhZGRpbmcgPSAnMCc7XG4gICAgICAgICAgICBkaXYuc3R5bGUubWFyZ2luID0gJzAnO1xuICAgICAgICAgICAgX3N2ZyA9IGNyZWF0ZUVsZW1lbnRTVkcoJ3N2ZycpOyAvL1NWR1xuICAgICAgICAgICAgX2RlZnNTdmcgPSBjcmVhdGVFbGVtZW50U1ZHKCdkZWZzJyk7IC8vZGVmc1xuICAgICAgICAgICAgX3N2Zy5hcHBlbmRDaGlsZChfZGVmc1N2Zyk7XG4gICAgICAgICAgICBfc3ZnLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgZWxlbWVudFNpemUuaGVpZ2h0KTtcbiAgICAgICAgICAgIF9zdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsIGVsZW1lbnRTaXplLndpZHRoKTtcbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChfc3ZnKTtcbiAgICAgICAgICAgIGxldCBldmVudERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpOyAvL0RJVlxuICAgICAgICAgICAgZXZlbnREaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgZXZlbnREaXYuc3R5bGUudG9wID1cbiAgICAgICAgICAgICAgICBldmVudERpdi5zdHlsZS5yaWdodCA9XG4gICAgICAgICAgICAgICAgZXZlbnREaXYuc3R5bGUuYm90dG9tID1cbiAgICAgICAgICAgICAgICBldmVudERpdi5zdHlsZS5sZWZ0ID0gJzAnO1xuICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKGV2ZW50RGl2KTtcbiAgICAgICAgICAgIHJlZ2lzdGVyRXZlbnQoZXZlbnREaXYpOyAvL+azqOWGjOS6i+S7tuWTjeW6lOeoi+W6j1xuICAgICAgICAgICAgcmV0dXJuIGRpdjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmtY/op4jlmajmlK/mjIHmo4DmtYtcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQHRocm93cyB7b3BlbkJTRS5Ccm93c2VyTm90U3VwcG9ydEVycm9yfSDmtY/op4jlmajkuI3mlK/mjIHnibnlrprmuLLmn5PmqKHlvI/ml7blvJXlj5HplJnor69cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHN1cHBvcnRDaGVjaygpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TICE9ICdmdW5jdGlvbicpIHRocm93IG5ldyBCcm93c2VyTm90U3VwcG9ydEVycm9yKCdjcmVhdGVFbGVtZW50TlMgRnVuY3Rpb24nKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY3JlYXRlRWxlbWVudFNWRygnc3ZnJykuY3JlYXRlU1ZHUmVjdCAhPSAnZnVuY3Rpb24nKSB0aHJvdyBuZXcgQnJvd3Nlck5vdFN1cHBvcnRFcnJvcignU1ZHJyk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgX2NoZWNrV2hldGhlckhpZGUgPSB0aGlzLmNoZWNrV2hldGhlckhpZGU7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDms6jlhozkuovku7blk43lupTnqIvluo9cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IC0g5YWD57SgXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiByZWdpc3RlckV2ZW50KGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldEJ1bGxldFNjcmVlbk9uU2NyZWVuQnlMb2NhdGlvbihsb2NhdGlvbikge1xuICAgICAgICAgICAgICAgIGxldCB0ZXh0U3ZncyA9IF9zdmcuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RleHQnKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IHRleHRTdmdzLmxlbmd0aCAtIDE7IGluZGV4ID4gMDsgaW5kZXgtLSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuT25TY3JlZW4gPSB0ZXh0U3Znc1tpbmRleF0uYnVsbGV0U2NyZWVuT25TY3JlZW47XG4gICAgICAgICAgICAgICAgICAgIGlmIChfY2hlY2tXaGV0aGVySGlkZShidWxsZXRTY3JlZW5PblNjcmVlbikpIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHgxID0gYnVsbGV0U2NyZWVuT25TY3JlZW4ueCAtIDQ7XG4gICAgICAgICAgICAgICAgICAgIGxldCB4MiA9IHgxICsgYnVsbGV0U2NyZWVuT25TY3JlZW4ud2lkdGggKyA4O1xuICAgICAgICAgICAgICAgICAgICBsZXQgeTEgPSBidWxsZXRTY3JlZW5PblNjcmVlbi5hY3R1YWxZIC0gNDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHkyID0geTEgKyBidWxsZXRTY3JlZW5PblNjcmVlbi5oZWlnaHQgKyA4O1xuICAgICAgICAgICAgICAgICAgICBpZiAobG9jYXRpb24ueCA+PSB4MSAmJiBsb2NhdGlvbi54IDw9IHgyICYmIGxvY2F0aW9uLnkgPj0geTEgJiYgbG9jYXRpb24ueSA8PSB5MilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBidWxsZXRTY3JlZW5PblNjcmVlbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRMb2NhdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZ2V0T2Zmc2V0VG9wKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9mZnNldFRvcCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldFRvcCArPSBlbGVtZW50Lm9mZnNldFRvcDtcbiAgICAgICAgICAgICAgICAgICAgfSB3aGlsZSAoKGVsZW1lbnQgPSBlbGVtZW50Lm9mZnNldFBhcmVudCkgIT0gbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvZmZzZXRUb3A7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGdldE9mZnNldExlZnQoZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0TGVmdCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldExlZnQgKz0gZWxlbWVudC5vZmZzZXRMZWZ0O1xuICAgICAgICAgICAgICAgICAgICB9IHdoaWxlICgoZWxlbWVudCA9IGVsZW1lbnQub2Zmc2V0UGFyZW50KSAhPSBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9mZnNldExlZnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZS5vZmZzZXRYID09PSAndW5kZWZpbmVkJyB8fCBlLm9mZnNldFggPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlLmxheWVyWCA9PT0gJ3VuZGVmaW5lZCcgfHwgZS5sYXllclggPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZS5wYWdlWCA9PT0gJ3VuZGVmaW5lZCcgfHwgZS5wYWdlWCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkb2MgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucGFnZVggPSBlLmNsaWVudFggKyAoZG9jICYmIGRvYy5zY3JvbGxMZWZ0IHx8IGJvZHkgJiYgYm9keS5zY3JvbGxMZWZ0IHx8IDApIC0gKGRvYyAmJiBkb2MuY2xpZW50TGVmdCB8fCBib2R5ICYmIGJvZHkuY2xpZW50TGVmdCB8fCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnBhZ2VZID0gZS5jbGllbnRZICsgKGRvYyAmJiBkb2Muc2Nyb2xsVG9wIHx8IGJvZHkgJiYgYm9keS5zY3JvbGxUb3AgfHwgMCkgLSAoZG9jICYmIGRvYy5jbGllbnRUb3AgfHwgYm9keSAmJiBib2R5LmNsaWVudFRvcCB8fCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGUubGF5ZXJYID0gZS5wYWdlWCAtIGdldE9mZnNldExlZnQoZS50YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5sYXllclkgPSBlLnBhZ2VZIC0gZ2V0T2Zmc2V0VG9wKGUudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlLm9mZnNldFggPSBlLmxheWVyWCAtIGUudGFyZ2V0LmNsaWVudExlZnQ7XG4gICAgICAgICAgICAgICAgICAgIGUub2Zmc2V0WSA9IGUubGF5ZXJZIC0gZS50YXJnZXQuY2xpZW50VG9wO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB4OiBlLm9mZnNldFgsXG4gICAgICAgICAgICAgICAgICAgIHk6IGUub2Zmc2V0WVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8v5LiK5LiL5paH6I+c5Y2VXG4gICAgICAgICAgICBlbGVtZW50Lm9uY29udGV4dG1lbnUgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGxldCBidWxsZXRTY3JlZW5PblNjcmVlbiA9IGdldEJ1bGxldFNjcmVlbk9uU2NyZWVuQnlMb2NhdGlvbihnZXRMb2NhdGlvbihlKSk7XG4gICAgICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbk9uU2NyZWVuKVxuICAgICAgICAgICAgICAgICAgICBldmVudFRyaWdnZXIoJ2NvbnRleHRtZW51JywgYnVsbGV0U2NyZWVuT25TY3JlZW4sIGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvL+WNleWHu1xuICAgICAgICAgICAgZWxlbWVudC5vbmNsaWNrID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuT25TY3JlZW4gPSBnZXRCdWxsZXRTY3JlZW5PblNjcmVlbkJ5TG9jYXRpb24oZ2V0TG9jYXRpb24oZSkpO1xuICAgICAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW5PblNjcmVlbilcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRUcmlnZ2VyKCdjbGljaycsIGJ1bGxldFNjcmVlbk9uU2NyZWVuLCBlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy/pvKDmoIfnp7vliqhcbiAgICAgICAgICAgIGVsZW1lbnQub25tb3VzZW1vdmUgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGxldCBidWxsZXRTY3JlZW5PblNjcmVlbiA9IGdldEJ1bGxldFNjcmVlbk9uU2NyZWVuQnlMb2NhdGlvbihnZXRMb2NhdGlvbihlKSk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgdGV4dFN2ZyBvZiBfc3ZnLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0ZXh0JykpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IF9idWxsZXRTY3JlZW5PblNjcmVlbiA9IHRleHRTdmcuYnVsbGV0U2NyZWVuT25TY3JlZW47XG4gICAgICAgICAgICAgICAgICAgIGlmIChfYnVsbGV0U2NyZWVuT25TY3JlZW4gIT0gYnVsbGV0U2NyZWVuT25TY3JlZW4gJiYgX2J1bGxldFNjcmVlbk9uU2NyZWVuLm1vdXNlaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9idWxsZXRTY3JlZW5PblNjcmVlbi5tb3VzZWluID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLmN1cnNvciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRUcmlnZ2VyKCdtb3VzZWxlYXZlJywgX2J1bGxldFNjcmVlbk9uU2NyZWVuLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuT25TY3JlZW4gPT09IG51bGwgfHwgYnVsbGV0U2NyZWVuT25TY3JlZW4ubW91c2VpbikgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLm1vdXNlaW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuY3Vyc29yID0gb3B0aW9ucy5jdXJzb3JPbk1vdXNlT3ZlcjtcbiAgICAgICAgICAgICAgICBldmVudFRyaWdnZXIoJ21vdXNlZW50ZXInLCBidWxsZXRTY3JlZW5PblNjcmVlbiwgZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy/pvKDmoIfnprvlvIBcbiAgICAgICAgICAgIGVsZW1lbnQub25tb3VzZW91dCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgdGV4dFN2ZyBvZiBfc3ZnLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0ZXh0JykpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IF9idWxsZXRTY3JlZW5PblNjcmVlbiA9IHRleHRTdmcuYnVsbGV0U2NyZWVuT25TY3JlZW47XG4gICAgICAgICAgICAgICAgICAgIGlmIChfYnVsbGV0U2NyZWVuT25TY3JlZW4ubW91c2Vpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2J1bGxldFNjcmVlbk9uU2NyZWVuLm1vdXNlaW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuY3Vyc29yID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudFRyaWdnZXIoJ21vdXNlbGVhdmUnLCBfYnVsbGV0U2NyZWVuT25TY3JlZW4sIGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWIm+W7uiBTVkcg5YWD57SgXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBxdWFsaWZpZWROYW1lIC0gRWxlbWVudCDlkI3np7BcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgLSDpgInpoblcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnRTVkcocXVhbGlmaWVkTmFtZSwgb3B0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCBxdWFsaWZpZWROYW1lLCBvcHRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmjIkgbGF5ZXIg5o+S5YWl5YWD57SgXG4gICAgICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCAtIOWFg+e0oFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gaW5zZXJ0RWxlbWVudChlbGVtZW50KSB7XG4gICAgICAgICAgICBsZXQgZWxlbWVudHMgPSBfc3ZnLmdldEVsZW1lbnRzQnlUYWdOYW1lKGVsZW1lbnQudGFnTmFtZSk7XG4gICAgICAgICAgICBpZiAoZWxlbWVudHMubGVuZ3RoID09PSAwKSBfc3ZnLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgbGV0IGluZGV4O1xuICAgICAgICAgICAgZm9yIChpbmRleCA9IGVsZW1lbnRzLmxlbmd0aCAtIDE7IGluZGV4ID4gMDsgaW5kZXgtLSkge1xuICAgICAgICAgICAgICAgIGxldCBfbGF5ZXIgPSBlbGVtZW50c1tpbmRleF0uYnVsbGV0U2NyZWVuT25TY3JlZW4uYnVsbGV0U2NyZWVuLmxheWVyO1xuICAgICAgICAgICAgICAgIGlmIChfbGF5ZXIgPD0gZWxlbWVudC5idWxsZXRTY3JlZW5PblNjcmVlbi5idWxsZXRTY3JlZW4ubGF5ZXIpIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCsraW5kZXggPT09IGVsZW1lbnRzLmxlbmd0aCkgX3N2Zy5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgICAgICAgIGVsc2UgX3N2Zy5pbnNlcnRCZWZvcmUoZWxlbWVudCwgZWxlbWVudHNbaW5kZXhdKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHsgU1ZHUmVuZGVyZXIgfTsiXSwiZmlsZSI6ImxpYi9yZW5kZXJlcnMvc3ZnUmVuZGVyZXIuanMifQ==
