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
            item.setAttribute('transform', "translate(".concat(bulletScreenOnScreen.x - 4, ",").concat(bulletScreenOnScreen.actualY - 4, ")"));
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9yZW5kZXJlcnMvc3ZnUmVuZGVyZXIuanMiXSwibmFtZXMiOlsiU1ZHUmVuZGVyZXIiLCJlbGVtZW50Iiwib3B0aW9ucyIsImVsZW1lbnRTaXplIiwiZXZlbnRUcmlnZ2VyIiwic3VwcG9ydENoZWNrIiwiX3N2ZyIsIl9kZWZzU3ZnIiwiaW5pdCIsImNsZWFuU2NyZWVuIiwiSGVscGVyIiwiY2xlYW5FbGVtZW50IiwiY3JlYXRlRWxlbWVudFNWRyIsImFwcGVuZENoaWxkIiwiZHJhdyIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwidGV4dFN2ZyIsImJ1bGxldFNjcmVlbk9uU2NyZWVuIiwia2V5Iiwic3ZnIiwiaXRlbSIsImNoZWNrV2hldGhlckhpZGUiLCJzZXRBdHRyaWJ1dGUiLCJ4IiwiYWN0dWFsWSIsImNyZWF0QW5kZ2V0V2lkdGgiLCJidWxsZXRTY3JlZW4iLCJ0ZXh0Iiwic2l6ZSIsInN0eWxlIiwiZm9udEZhbWlseSIsImZvbnRXZWlnaHQiLCJjb2xvciIsImRvY3VtZW50IiwiY3JlYXRlVGV4dE5vZGUiLCJib3JkZXJDb2xvciIsInNoYWRvd0JsdXIiLCJmaWx0ZXJJZCIsImZpbHRlclN2ZyIsImdldEVsZW1lbnRCeUlkIiwiaWQiLCJmZU9mZnNldFN2ZyIsImZlR2F1c3NpYW5CbHVyU3ZnIiwiZmVCbGVuZFN2ZyIsImJ1bGxldFNjcmVlbkNvdW50IiwiaW5zZXJ0RWxlbWVudCIsIndpZHRoIiwiZ2V0Q29tcHV0ZWRUZXh0TGVuZ3RoIiwiYm94Q29sb3IiLCJyZWN0U3ZnIiwicmVjdCIsImhlaWdodCIsImluc2VydEJlZm9yZSIsImRlbGV0ZSIsInJlbW92ZUNoaWxkIiwiaW5kZXgiLCJyZUNyZWF0QW5kZ2V0V2lkdGgiLCJfc2V0U2l6ZSIsInNldFNpemUiLCJkaXYiLCJjcmVhdGVFbGVtZW50IiwicGFkZGluZyIsIm1hcmdpbiIsImV2ZW50RGl2IiwicG9zaXRpb24iLCJ0b3AiLCJyaWdodCIsImJvdHRvbSIsImxlZnQiLCJyZWdpc3RlckV2ZW50IiwiY3JlYXRlRWxlbWVudE5TIiwiQnJvd3Nlck5vdFN1cHBvcnRFcnJvciIsImNyZWF0ZVNWR1JlY3QiLCJfY2hlY2tXaGV0aGVySGlkZSIsImdldEJ1bGxldFNjcmVlbk9uU2NyZWVuQnlMb2NhdGlvbiIsImxvY2F0aW9uIiwidGV4dFN2Z3MiLCJsZW5ndGgiLCJ4MSIsIngyIiwieTEiLCJ5MiIsInkiLCJnZXRMb2NhdGlvbiIsImUiLCJnZXRPZmZzZXRUb3AiLCJvZmZzZXRUb3AiLCJvZmZzZXRQYXJlbnQiLCJnZXRPZmZzZXRMZWZ0Iiwib2Zmc2V0TGVmdCIsIm9mZnNldFgiLCJsYXllclgiLCJwYWdlWCIsImRvYyIsImRvY3VtZW50RWxlbWVudCIsImJvZHkiLCJjbGllbnRYIiwic2Nyb2xsTGVmdCIsImNsaWVudExlZnQiLCJwYWdlWSIsImNsaWVudFkiLCJzY3JvbGxUb3AiLCJjbGllbnRUb3AiLCJ0YXJnZXQiLCJsYXllclkiLCJvZmZzZXRZIiwib25jb250ZXh0bWVudSIsIm9uY2xpY2siLCJvbm1vdXNlbW92ZSIsIl9idWxsZXRTY3JlZW5PblNjcmVlbiIsIm1vdXNlaW4iLCJjdXJzb3IiLCJjdXJzb3JPbk1vdXNlT3ZlciIsIm9ubW91c2VvdXQiLCJxdWFsaWZpZWROYW1lIiwiZWxlbWVudHMiLCJ0YWdOYW1lIiwiX2xheWVyIiwibGF5ZXIiLCJCYXNlUmVuZGVyZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQUVBOzs7SUFHTUEsVzs7O0FBQ0Y7Ozs7Ozs7O0FBUUEsdUJBQVlDLE9BQVosRUFBcUJDLE9BQXJCLEVBQThCQyxXQUE5QixFQUEyQ0MsWUFBM0MsRUFBeUQ7QUFBQTs7QUFBQTs7QUFDckRDLElBQUFBLFlBQVk7O0FBQ1osUUFBSUMsSUFBSjs7QUFDQSxRQUFJQyxRQUFKOztBQUNBLHFGQUFNQyxJQUFJLEVBQVYsRUFBY04sT0FBZCxFQUF1QkMsV0FBdkI7QUFFQTs7Ozs7QUFJQSxVQUFL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QUFzRWhILE9BQXRFLENBQVA7QUFDSDtBQUVEOzs7Ozs7QUFJQSxhQUFTMkMsYUFBVCxDQUF1QjVDLE9BQXZCLEVBQWdDO0FBQzVCLFVBQUlrSCxRQUFRLEdBQUc3RyxJQUFJLENBQUNTLG9CQUFMLENBQTBCZCxPQUFPLENBQUNtSCxPQUFsQyxDQUFmOztBQUNBLFVBQUlELFFBQVEsQ0FBQ3RDLE1BQVQsS0FBb0IsQ0FBeEIsRUFBMkJ2RSxJQUFJLENBQUNPLFdBQUwsQ0FBaUJaLE9BQWpCO0FBQzNCLFVBQUlzRCxLQUFKOztBQUNBLFdBQUtBLEtBQUssR0FBRzRELFFBQVEsQ0FBQ3RDLE1BQVQsR0FBa0IsQ0FBL0IsRUFBa0N0QixLQUFLLEdBQUcsQ0FBMUMsRUFBNkNBLEtBQUssRUFBbEQsRUFBc0Q7QUFDbEQsWUFBSThELE1BQU0sR0FBR0YsUUFBUSxDQUFDNUQsS0FBRCxDQUFSLENBQWdCdEMsb0JBQWhCLENBQXFDUyxZQUFyQyxDQUFrRDRGLEtBQS9EO0FBQ0EsWUFBSUQsTUFBTSxJQUFJcEgsT0FBTyxDQUFDZ0Isb0JBQVIsQ0FBNkJTLFlBQTdCLENBQTBDNEYsS0FBeEQsRUFBK0Q7QUFDbEU7O0FBQ0QsVUFBSSxFQUFFL0QsS0FBRixLQUFZNEQsUUFBUSxDQUFDdEMsTUFBekIsRUFBaUN2RSxJQUFJLENBQUNPLFdBQUwsQ0FBaUJaLE9BQWpCLEVBQWpDLEtBQ0tLLElBQUksQ0FBQzhDLFlBQUwsQ0FBa0JuRCxPQUFsQixFQUEyQmtILFFBQVEsQ0FBQzVELEtBQUQsQ0FBbkM7QUFDUjs7QUFqVG9EO0FBa1R4RDs7O0VBM1RxQmdFLDBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZVJlbmRlcmVyIH0gZnJvbSAnLi9iYXNlUmVuZGVyZXInXHJcbmltcG9ydCB7IEJyb3dzZXJOb3RTdXBwb3J0RXJyb3IgfSBmcm9tICcuLi8uLi9icm93c2VyTm90U3VwcG9ydEVycm9yJ1xyXG5pbXBvcnQgeyBIZWxwZXIgfSBmcm9tICcuLi9oZWxwZXInXHJcblxyXG4vKipcclxuICogU1ZHIOa4suafk+WZqOexu1xyXG4gKi9cclxuY2xhc3MgU1ZHUmVuZGVyZXIgZXh0ZW5kcyBCYXNlUmVuZGVyZXIge1xyXG4gICAgLyoqXHJcbiAgICAgKiDlrp7kvovljJbkuIDkuKogU1ZHIOa4suafk+WZqOexu1xyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGVsZW1lbnQgLSBFbGVtZW50IOWFg+e0oFxyXG4gICAgICogQHBhcmFtIHtvcGVuQlNFfk9wdGlvbnN9IG9wdGlvbnMgLSDlhajlsYDpgInpoblcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbGVtZW50U2l6ZSAtIOWFg+e0oOWkp+Wwj1xyXG4gICAgICogQHBhcmFtIHtFdmVudH0gZXZlbnRUcmlnZ2VyIC0g5LqL5Lu25byV5Y+R5pa55rOVXHJcbiAgICAgKiBAdGhyb3dzIHtvcGVuQlNFLkJyb3dzZXJOb3RTdXBwb3J0RXJyb3J9IOa1j+iniOWZqOS4jeaUr+aMgeeJueWumua4suafk+aooeW8j+aXtuW8leWPkemUmeivr1xyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBvcHRpb25zLCBlbGVtZW50U2l6ZSwgZXZlbnRUcmlnZ2VyKSB7XHJcbiAgICAgICAgc3VwcG9ydENoZWNrKCk7IC8v5rWP6KeI5Zmo5pSv5oyB5qOA5rWLXHJcbiAgICAgICAgbGV0IF9zdmc7XHJcbiAgICAgICAgbGV0IF9kZWZzU3ZnO1xyXG4gICAgICAgIHN1cGVyKGluaXQoKSwgb3B0aW9ucywgZWxlbWVudFNpemUpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmuIXpmaTlsY/luZXlhoXlrrlcclxuICAgICAgICAgKiBAb3ZlcnJpZGVcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNsZWFuU2NyZWVuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBIZWxwZXIuY2xlYW5FbGVtZW50KF9zdmcpO1xyXG4gICAgICAgICAgICBfZGVmc1N2ZyA9IGNyZWF0ZUVsZW1lbnRTVkcoJ2RlZnMnKTsgLy9kZWZzXHJcbiAgICAgICAgICAgIF9zdmcuYXBwZW5kQ2hpbGQoX2RlZnNTdmcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog57uY5Yi25Ye95pWwXHJcbiAgICAgICAgICogQG92ZXJyaWRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5kcmF3ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCB0ZXh0U3ZnIG9mIF9zdmcuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RleHQnKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJ1bGxldFNjcmVlbk9uU2NyZWVuID0gdGV4dFN2Zy5idWxsZXRTY3JlZW5PblNjcmVlbjtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBidWxsZXRTY3JlZW5PblNjcmVlbi5zdmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IGJ1bGxldFNjcmVlbk9uU2NyZWVuLnN2Z1trZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrV2hldGhlckhpZGUoYnVsbGV0U2NyZWVuT25TY3JlZW4pKSBpdGVtLnNldEF0dHJpYnV0ZSgnb3BhY2l0eScsICcwJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpdGVtLnNldEF0dHJpYnV0ZSgnb3BhY2l0eScsICcxJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHsoYnVsbGV0U2NyZWVuT25TY3JlZW4ueCAtIDQpfSwkeyhidWxsZXRTY3JlZW5PblNjcmVlbi5hY3R1YWxZIC0gNCl9KWApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDliJvlu7rlvLnluZXlhYPntKBcclxuICAgICAgICAgKiBAb3ZlcnJpZGVcclxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gYnVsbGV0U2NyZWVuT25TY3JlZW4gLSDlsY/luZXlvLnluZXlr7nosaFcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNyZWF0QW5kZ2V0V2lkdGggPSBmdW5jdGlvbiAoYnVsbGV0U2NyZWVuT25TY3JlZW4pIHtcclxuICAgICAgICAgICAgbGV0IGJ1bGxldFNjcmVlbiA9IGJ1bGxldFNjcmVlbk9uU2NyZWVuLmJ1bGxldFNjcmVlbjtcclxuICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4uc3ZnID0gdHlwZW9mIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnN2ZyA9PT0gJ29iamVjdCcgPyBidWxsZXRTY3JlZW5PblNjcmVlbi5zdmcgOiB7fTtcclxuXHJcbiAgICAgICAgICAgIGxldCB0ZXh0U3ZnID0gdHlwZW9mIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnN2Zy50ZXh0ID09PSAnb2JqZWN0JyA/IGJ1bGxldFNjcmVlbk9uU2NyZWVuLnN2Zy50ZXh0IDogY3JlYXRlRWxlbWVudFNWRygndGV4dCcpO1xyXG4gICAgICAgICAgICB0ZXh0U3ZnLnNldEF0dHJpYnV0ZSgneCcsIDApO1xyXG4gICAgICAgICAgICB0ZXh0U3ZnLnNldEF0dHJpYnV0ZSgneScsIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnNpemUgKiAwLjgpO1xyXG4gICAgICAgICAgICB0ZXh0U3ZnLnNldEF0dHJpYnV0ZSgnZm9udC1mYW1pbHknLCBidWxsZXRTY3JlZW4uc3R5bGUuZm9udEZhbWlseSk7XHJcbiAgICAgICAgICAgIHRleHRTdmcuc2V0QXR0cmlidXRlKCdmb250LXNpemUnLCBidWxsZXRTY3JlZW5PblNjcmVlbi5zaXplKTtcclxuICAgICAgICAgICAgdGV4dFN2Zy5zZXRBdHRyaWJ1dGUoJ2ZvbnQtd2VpZ2h0JywgYnVsbGV0U2NyZWVuLnN0eWxlLmZvbnRXZWlnaHQpO1xyXG4gICAgICAgICAgICB0ZXh0U3ZnLnNldEF0dHJpYnV0ZSgnZmlsbCcsIGJ1bGxldFNjcmVlbi5zdHlsZS5jb2xvcik7XHJcbiAgICAgICAgICAgIEhlbHBlci5jbGVhbkVsZW1lbnQodGV4dFN2Zyk7XHJcbiAgICAgICAgICAgIHRleHRTdmcuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYnVsbGV0U2NyZWVuLnRleHQpKTtcclxuICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbi5zdHlsZS5ib3JkZXJDb2xvciAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0U3ZnLnNldEF0dHJpYnV0ZSgnc3Ryb2tlJywgYnVsbGV0U2NyZWVuLmJvcmRlckNvbG9yKTtcclxuICAgICAgICAgICAgICAgIHRleHRTdmcuc2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnLCAwLjUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuLnN0eWxlLnNoYWRvd0JsdXIgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGZpbHRlcklkID0gYGJ1bGxldFNjcmVlbkVuZ2luZV9zdmdGaWx0ZXJfc2hhZG93XyR7YnVsbGV0U2NyZWVuLnN0eWxlLnNoYWRvd0JsdXJ9YDtcclxuICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJTdmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChmaWx0ZXJJZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZmlsdGVyU3ZnID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyU3ZnID0gY3JlYXRlRWxlbWVudFNWRygnZmlsdGVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyU3ZnLmlkID0gZmlsdGVySWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyU3ZnLnNldEF0dHJpYnV0ZSgneCcsICctMTAwJScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlclN2Zy5zZXRBdHRyaWJ1dGUoJ3knLCAnLTEwMCUnKTtcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJTdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsICczMDAlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyU3ZnLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgJzMwMCUnKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZmVPZmZzZXRTdmcgPSBjcmVhdGVFbGVtZW50U1ZHKCdmZU9mZnNldCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZlT2Zmc2V0U3ZnLnNldEF0dHJpYnV0ZSgncmVzdWx0JywgJ29mZk91dCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZlT2Zmc2V0U3ZnLnNldEF0dHJpYnV0ZSgnaW4nLCAnU291cmNlQWxwaGEnKTtcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJTdmcuYXBwZW5kQ2hpbGQoZmVPZmZzZXRTdmcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmZUdhdXNzaWFuQmx1clN2ZyA9IGNyZWF0ZUVsZW1lbnRTVkcoJ2ZlR2F1c3NpYW5CbHVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZmVHYXVzc2lhbkJsdXJTdmcuc2V0QXR0cmlidXRlKCdyZXN1bHQnLCAnYmx1ck91dCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZlR2F1c3NpYW5CbHVyU3ZnLnNldEF0dHJpYnV0ZSgnaW4nLCAnb2ZmT3V0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZmVHYXVzc2lhbkJsdXJTdmcuc2V0QXR0cmlidXRlKCdzdGREZXZpYXRpb24nLCBidWxsZXRTY3JlZW4uc3R5bGUuc2hhZG93Qmx1cik7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyU3ZnLmFwcGVuZENoaWxkKGZlR2F1c3NpYW5CbHVyU3ZnKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZmVCbGVuZFN2ZyA9IGNyZWF0ZUVsZW1lbnRTVkcoJ2ZlQmxlbmQnKTtcclxuICAgICAgICAgICAgICAgICAgICBmZUJsZW5kU3ZnLnNldEF0dHJpYnV0ZSgnaW4nLCAnU291cmNlR3JhcGhpYycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZlQmxlbmRTdmcuc2V0QXR0cmlidXRlKCdpbjInLCAnYmx1ck91dCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZlQmxlbmRTdmcuc2V0QXR0cmlidXRlKCdtb2RlJywgJ25vcm1hbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlclN2Zy5hcHBlbmRDaGlsZChmZUJsZW5kU3ZnKTtcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJTdmcuYnVsbGV0U2NyZWVuQ291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIF9kZWZzU3ZnLmFwcGVuZENoaWxkKGZpbHRlclN2Zyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmaWx0ZXJTdmcuYnVsbGV0U2NyZWVuQ291bnQrKztcclxuICAgICAgICAgICAgICAgIHRleHRTdmcuc2V0QXR0cmlidXRlKCdmaWx0ZXInLCBgdXJsKCMke2ZpbHRlcklkfSlgKTtcclxuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLmZpbHRlcklkID0gZmlsdGVySWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnN2Zy50ZXh0ID0gdGV4dFN2ZztcclxuICAgICAgICAgICAgdGV4dFN2Zy5idWxsZXRTY3JlZW5PblNjcmVlbiA9IGJ1bGxldFNjcmVlbk9uU2NyZWVuO1xyXG4gICAgICAgICAgICBpbnNlcnRFbGVtZW50KHRleHRTdmcpO1xyXG4gICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi53aWR0aCA9IHRleHRTdmcuZ2V0Q29tcHV0ZWRUZXh0TGVuZ3RoKCk7IC8v5by55bmV55qE5a695bqm77ya5YOP57SgXHJcblxyXG4gICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuLnN0eWxlLmJveENvbG9yICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGxldCByZWN0U3ZnID0gdHlwZW9mIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnN2Zy5yZWN0ID09PSAnb2JqZWN0JyA/IGJ1bGxldFNjcmVlbk9uU2NyZWVuLnN2Zy5yZWN0IDogY3JlYXRlRWxlbWVudFNWRygncmVjdCcpO1xyXG4gICAgICAgICAgICAgICAgcmVjdFN2Zy5zZXRBdHRyaWJ1dGUoJ3gnLCAtMyk7XHJcbiAgICAgICAgICAgICAgICByZWN0U3ZnLnNldEF0dHJpYnV0ZSgneScsIC0zKTtcclxuICAgICAgICAgICAgICAgIHJlY3RTdmcuc2V0QXR0cmlidXRlKCdmaWxsJywgJ25vbmUnKTtcclxuICAgICAgICAgICAgICAgIHJlY3RTdmcuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBidWxsZXRTY3JlZW5PblNjcmVlbi5oZWlnaHQgKyA3KTtcclxuICAgICAgICAgICAgICAgIHJlY3RTdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsIGJ1bGxldFNjcmVlbk9uU2NyZWVuLndpZHRoICsgNyk7XHJcbiAgICAgICAgICAgICAgICByZWN0U3ZnLnNldEF0dHJpYnV0ZSgnc3Ryb2tlJywgYnVsbGV0U2NyZWVuLnN0eWxlLmJveENvbG9yKTtcclxuICAgICAgICAgICAgICAgIHJlY3RTdmcuc2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnLCAxKTtcclxuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnN2Zy5yZWN0ID0gcmVjdFN2ZztcclxuICAgICAgICAgICAgICAgIHJlY3RTdmcuYnVsbGV0U2NyZWVuT25TY3JlZW4gPSBidWxsZXRTY3JlZW5PblNjcmVlbjtcclxuICAgICAgICAgICAgICAgIF9zdmcuaW5zZXJ0QmVmb3JlKHJlY3RTdmcsIHRleHRTdmcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIOWIoOmZpOW8ueW5leWFg+e0oFxyXG4gICAgICAgICogQG92ZXJyaWRlXHJcbiAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gYnVsbGV0U2NyZWVuT25TY3JlZW4gLSDlsY/luZXlvLnluZXlr7nosaFcclxuICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuZGVsZXRlID0gZnVuY3Rpb24gKGJ1bGxldFNjcmVlbk9uU2NyZWVuKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYnVsbGV0U2NyZWVuT25TY3JlZW4uZmlsdGVySWQgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJTdmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChidWxsZXRTY3JlZW5PblNjcmVlbi5maWx0ZXJJZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZmlsdGVyU3ZnICE9IG51bGwgJiYgLS1maWx0ZXJTdmcuYnVsbGV0U2NyZWVuQ291bnQgPT09IDApXHJcbiAgICAgICAgICAgICAgICAgICAgX2RlZnNTdmcucmVtb3ZlQ2hpbGQoZmlsdGVyU3ZnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGxldCBpbmRleCBpbiBidWxsZXRTY3JlZW5PblNjcmVlbi5zdmcpIHtcclxuICAgICAgICAgICAgICAgIF9zdmcucmVtb3ZlQ2hpbGQoYnVsbGV0U2NyZWVuT25TY3JlZW4uc3ZnW2luZGV4XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOmHjeaWsOa3u+WKoOW8ueW5lVxyXG4gICAgICAgICAqIEBvdmVycmlkZVxyXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBidWxsZXRTY3JlZW5PblNjcmVlbiAtIOWxj+W5leW8ueW5leWvueixoVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMucmVDcmVhdEFuZGdldFdpZHRoID0gZnVuY3Rpb24gKGJ1bGxldFNjcmVlbk9uU2NyZWVuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlKGJ1bGxldFNjcmVlbk9uU2NyZWVuKTtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdEFuZGdldFdpZHRoKGJ1bGxldFNjcmVlbk9uU2NyZWVuKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBfc2V0U2l6ZSA9IHRoaXMuc2V0U2l6ZTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDorr7nva7lsLrlr7hcclxuICAgICAgICAgKiBAb3ZlcnJpZGVcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnNldFNpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIF9zZXRTaXplKCk7XHJcbiAgICAgICAgICAgIF9zdmcuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBlbGVtZW50U2l6ZS5oZWlnaHQpO1xyXG4gICAgICAgICAgICBfc3ZnLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBlbGVtZW50U2l6ZS53aWR0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmt7vliqBEaXZcclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqIEByZXR1cm5zIHtFbGVtZW50fSBEaXZcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7IC8vRElWXHJcbiAgICAgICAgICAgIEhlbHBlci5jbGVhbkVsZW1lbnQoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoZGl2KTtcclxuICAgICAgICAgICAgZGl2LnN0eWxlLnBhZGRpbmcgPSAnMCc7XHJcbiAgICAgICAgICAgIGRpdi5zdHlsZS5tYXJnaW4gPSAnMCc7XHJcbiAgICAgICAgICAgIF9zdmcgPSBjcmVhdGVFbGVtZW50U1ZHKCdzdmcnKTsgLy9TVkdcclxuICAgICAgICAgICAgX2RlZnNTdmcgPSBjcmVhdGVFbGVtZW50U1ZHKCdkZWZzJyk7IC8vZGVmc1xyXG4gICAgICAgICAgICBfc3ZnLmFwcGVuZENoaWxkKF9kZWZzU3ZnKTtcclxuICAgICAgICAgICAgX3N2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIGVsZW1lbnRTaXplLmhlaWdodCk7XHJcbiAgICAgICAgICAgIF9zdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsIGVsZW1lbnRTaXplLndpZHRoKTtcclxuICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKF9zdmcpO1xyXG4gICAgICAgICAgICBsZXQgZXZlbnREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTsgLy9ESVZcclxuICAgICAgICAgICAgZXZlbnREaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG4gICAgICAgICAgICBldmVudERpdi5zdHlsZS50b3AgPVxyXG4gICAgICAgICAgICAgICAgZXZlbnREaXYuc3R5bGUucmlnaHQgPVxyXG4gICAgICAgICAgICAgICAgZXZlbnREaXYuc3R5bGUuYm90dG9tID1cclxuICAgICAgICAgICAgICAgIGV2ZW50RGl2LnN0eWxlLmxlZnQgPSAnMCc7XHJcbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChldmVudERpdik7XHJcbiAgICAgICAgICAgIHJlZ2lzdGVyRXZlbnQoZXZlbnREaXYpOyAvL+azqOWGjOS6i+S7tuWTjeW6lOeoi+W6j1xyXG4gICAgICAgICAgICByZXR1cm4gZGl2O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5rWP6KeI5Zmo5pSv5oyB5qOA5rWLXHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKiBAdGhyb3dzIHtvcGVuQlNFLkJyb3dzZXJOb3RTdXBwb3J0RXJyb3J9IOa1j+iniOWZqOS4jeaUr+aMgeeJueWumua4suafk+aooeW8j+aXtuW8leWPkemUmeivr1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHN1cHBvcnRDaGVjaygpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMgIT0gJ2Z1bmN0aW9uJykgdGhyb3cgbmV3IEJyb3dzZXJOb3RTdXBwb3J0RXJyb3IoJ2NyZWF0ZUVsZW1lbnROUyBGdW5jdGlvbicpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNyZWF0ZUVsZW1lbnRTVkcoJ3N2ZycpLmNyZWF0ZVNWR1JlY3QgIT0gJ2Z1bmN0aW9uJykgdGhyb3cgbmV3IEJyb3dzZXJOb3RTdXBwb3J0RXJyb3IoJ1NWRycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IF9jaGVja1doZXRoZXJIaWRlID0gdGhpcy5jaGVja1doZXRoZXJIaWRlO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOazqOWGjOS6i+S7tuWTjeW6lOeoi+W6j1xyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IC0g5YWD57SgXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gcmVnaXN0ZXJFdmVudChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldEJ1bGxldFNjcmVlbk9uU2NyZWVuQnlMb2NhdGlvbihsb2NhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRleHRTdmdzID0gX3N2Zy5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGV4dCcpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSB0ZXh0U3Zncy5sZW5ndGggLSAxOyBpbmRleCA+IDA7IGluZGV4LS0pIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuT25TY3JlZW4gPSB0ZXh0U3Znc1tpbmRleF0uYnVsbGV0U2NyZWVuT25TY3JlZW47XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9jaGVja1doZXRoZXJIaWRlKGJ1bGxldFNjcmVlbk9uU2NyZWVuKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB4MSA9IGJ1bGxldFNjcmVlbk9uU2NyZWVuLnggLSA0O1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB4MiA9IHgxICsgYnVsbGV0U2NyZWVuT25TY3JlZW4ud2lkdGggKyA4O1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB5MSA9IGJ1bGxldFNjcmVlbk9uU2NyZWVuLmFjdHVhbFkgLSA0O1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB5MiA9IHkxICsgYnVsbGV0U2NyZWVuT25TY3JlZW4uaGVpZ2h0ICsgODtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobG9jYXRpb24ueCA+PSB4MSAmJiBsb2NhdGlvbi54IDw9IHgyICYmIGxvY2F0aW9uLnkgPj0geTEgJiYgbG9jYXRpb24ueSA8PSB5MilcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJ1bGxldFNjcmVlbk9uU2NyZWVuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0TG9jYXRpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZ2V0T2Zmc2V0VG9wKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0VG9wID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldFRvcCArPSBlbGVtZW50Lm9mZnNldFRvcDtcclxuICAgICAgICAgICAgICAgICAgICB9IHdoaWxlICgoZWxlbWVudCA9IGVsZW1lbnQub2Zmc2V0UGFyZW50KSAhPSBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2Zmc2V0VG9wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZ2V0T2Zmc2V0TGVmdChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9mZnNldExlZnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0TGVmdCArPSBlbGVtZW50Lm9mZnNldExlZnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSB3aGlsZSAoKGVsZW1lbnQgPSBlbGVtZW50Lm9mZnNldFBhcmVudCkgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9mZnNldExlZnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGUub2Zmc2V0WCA9PT0gJ3VuZGVmaW5lZCcgfHwgZS5vZmZzZXRYID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlLmxheWVyWCA9PT0gJ3VuZGVmaW5lZCcgfHwgZS5sYXllclggPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlLnBhZ2VYID09PSAndW5kZWZpbmVkJyB8fCBlLnBhZ2VYID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZG9jID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBib2R5ID0gZG9jdW1lbnQuYm9keTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucGFnZVggPSBlLmNsaWVudFggKyAoZG9jICYmIGRvYy5zY3JvbGxMZWZ0IHx8IGJvZHkgJiYgYm9keS5zY3JvbGxMZWZ0IHx8IDApIC0gKGRvYyAmJiBkb2MuY2xpZW50TGVmdCB8fCBib2R5ICYmIGJvZHkuY2xpZW50TGVmdCB8fCAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucGFnZVkgPSBlLmNsaWVudFkgKyAoZG9jICYmIGRvYy5zY3JvbGxUb3AgfHwgYm9keSAmJiBib2R5LnNjcm9sbFRvcCB8fCAwKSAtIChkb2MgJiYgZG9jLmNsaWVudFRvcCB8fCBib2R5ICYmIGJvZHkuY2xpZW50VG9wIHx8IDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUubGF5ZXJYID0gZS5wYWdlWCAtIGdldE9mZnNldExlZnQoZS50YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLmxheWVyWSA9IGUucGFnZVkgLSBnZXRPZmZzZXRUb3AoZS50YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlLm9mZnNldFggPSBlLmxheWVyWCAtIGUudGFyZ2V0LmNsaWVudExlZnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5vZmZzZXRZID0gZS5sYXllclkgLSBlLnRhcmdldC5jbGllbnRUb3A7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHg6IGUub2Zmc2V0WCxcclxuICAgICAgICAgICAgICAgICAgICB5OiBlLm9mZnNldFlcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8v5LiK5LiL5paH6I+c5Y2VXHJcbiAgICAgICAgICAgIGVsZW1lbnQub25jb250ZXh0bWVudSA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuT25TY3JlZW4gPSBnZXRCdWxsZXRTY3JlZW5PblNjcmVlbkJ5TG9jYXRpb24oZ2V0TG9jYXRpb24oZSkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbk9uU2NyZWVuKVxyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50VHJpZ2dlcignY29udGV4dG1lbnUnLCBidWxsZXRTY3JlZW5PblNjcmVlbiwgZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIC8v5Y2V5Ye7XHJcbiAgICAgICAgICAgIGVsZW1lbnQub25jbGljayA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuT25TY3JlZW4gPSBnZXRCdWxsZXRTY3JlZW5PblNjcmVlbkJ5TG9jYXRpb24oZ2V0TG9jYXRpb24oZSkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbk9uU2NyZWVuKVxyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50VHJpZ2dlcignY2xpY2snLCBidWxsZXRTY3JlZW5PblNjcmVlbiwgZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIC8v6byg5qCH56e75YqoXHJcbiAgICAgICAgICAgIGVsZW1lbnQub25tb3VzZW1vdmUgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJ1bGxldFNjcmVlbk9uU2NyZWVuID0gZ2V0QnVsbGV0U2NyZWVuT25TY3JlZW5CeUxvY2F0aW9uKGdldExvY2F0aW9uKGUpKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHRleHRTdmcgb2YgX3N2Zy5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGV4dCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IF9idWxsZXRTY3JlZW5PblNjcmVlbiA9IHRleHRTdmcuYnVsbGV0U2NyZWVuT25TY3JlZW47XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9idWxsZXRTY3JlZW5PblNjcmVlbiAhPSBidWxsZXRTY3JlZW5PblNjcmVlbiAmJiBfYnVsbGV0U2NyZWVuT25TY3JlZW4ubW91c2Vpbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfYnVsbGV0U2NyZWVuT25TY3JlZW4ubW91c2VpbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLmN1cnNvciA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudFRyaWdnZXIoJ21vdXNlbGVhdmUnLCBfYnVsbGV0U2NyZWVuT25TY3JlZW4sIGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW5PblNjcmVlbiA9PT0gbnVsbCB8fCBidWxsZXRTY3JlZW5PblNjcmVlbi5tb3VzZWluKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi5tb3VzZWluID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuY3Vyc29yID0gb3B0aW9ucy5jdXJzb3JPbk1vdXNlT3ZlcjtcclxuICAgICAgICAgICAgICAgIGV2ZW50VHJpZ2dlcignbW91c2VlbnRlcicsIGJ1bGxldFNjcmVlbk9uU2NyZWVuLCBlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL+m8oOagh+emu+W8gFxyXG4gICAgICAgICAgICBlbGVtZW50Lm9ubW91c2VvdXQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgdGV4dFN2ZyBvZiBfc3ZnLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0ZXh0JykpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgX2J1bGxldFNjcmVlbk9uU2NyZWVuID0gdGV4dFN2Zy5idWxsZXRTY3JlZW5PblNjcmVlbjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoX2J1bGxldFNjcmVlbk9uU2NyZWVuLm1vdXNlaW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2J1bGxldFNjcmVlbk9uU2NyZWVuLm1vdXNlaW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5jdXJzb3IgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRUcmlnZ2VyKCdtb3VzZWxlYXZlJywgX2J1bGxldFNjcmVlbk9uU2NyZWVuLCBlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWIm+W7uiBTVkcg5YWD57SgXHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gcXVhbGlmaWVkTmFtZSAtIEVsZW1lbnQg5ZCN56ewXHJcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgLSDpgInpoblcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50U1ZHKHF1YWxpZmllZE5hbWUsIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCBxdWFsaWZpZWROYW1lLCBvcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOaMiSBsYXllciDmj5LlhaXlhYPntKBcclxuICAgICAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgLSDlhYPntKBcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBpbnNlcnRFbGVtZW50KGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnRzID0gX3N2Zy5nZXRFbGVtZW50c0J5VGFnTmFtZShlbGVtZW50LnRhZ05hbWUpO1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudHMubGVuZ3RoID09PSAwKSBfc3ZnLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICBsZXQgaW5kZXg7XHJcbiAgICAgICAgICAgIGZvciAoaW5kZXggPSBlbGVtZW50cy5sZW5ndGggLSAxOyBpbmRleCA+IDA7IGluZGV4LS0pIHtcclxuICAgICAgICAgICAgICAgIGxldCBfbGF5ZXIgPSBlbGVtZW50c1tpbmRleF0uYnVsbGV0U2NyZWVuT25TY3JlZW4uYnVsbGV0U2NyZWVuLmxheWVyO1xyXG4gICAgICAgICAgICAgICAgaWYgKF9sYXllciA8PSBlbGVtZW50LmJ1bGxldFNjcmVlbk9uU2NyZWVuLmJ1bGxldFNjcmVlbi5sYXllcikgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCsraW5kZXggPT09IGVsZW1lbnRzLmxlbmd0aCkgX3N2Zy5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxuICAgICAgICAgICAgZWxzZSBfc3ZnLmluc2VydEJlZm9yZShlbGVtZW50LCBlbGVtZW50c1tpbmRleF0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHsgU1ZHUmVuZGVyZXIgfTsiXSwiZmlsZSI6ImxpYi9yZW5kZXJlcnMvc3ZnUmVuZGVyZXIuanMifQ==
