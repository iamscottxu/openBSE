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
 * SVG 渲染器类
 */
var GeneralSvgRenderer = function (_GeneralBaseRenderer) {
  _inherits(GeneralSvgRenderer, _GeneralBaseRenderer);

  /**
   * 实例化一个 SVG 渲染器类
   * @param {object} element - Element 元素
   * @param {openBSE~Options} options - 全局选项
   * @param {object} elementSize - 元素大小
   * @param {Event} eventTrigger - 事件引发方法
   * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
   */
  function GeneralSvgRenderer(element, options, elementSize, eventTrigger) {
    var _this;

    _classCallCheck(this, GeneralSvgRenderer);

    supportCheck();

    var _svg;

    var _defsSvg;

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GeneralSvgRenderer).call(this, init(), options, elementSize));
    /**
     * 清除屏幕内容
     * @override
     */

    _this.cleanScreen = function () {
      _helper["default"].cleanElement(_svg);

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
            item.setAttribute('transform', "translate(".concat((bulletScreenOnScreen.x - 4).toFixed(1), ",").concat((bulletScreenOnScreen.actualY - 4).toFixed(1), ")"));
          }
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

      _helper["default"].cleanElement(textSvg);

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


    _this["delete"] = function (bulletScreenOnScreen) {
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

      _helper["default"].cleanElement(element);

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
      if (typeof document.createElementNS != 'function') throw new _browserNotSupportError["default"]('createElementNS Function');
      if (typeof createElementSVG('svg').createSVGRect != 'function') throw new _browserNotSupportError["default"]('SVG');
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
            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
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
            if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
              _iterator3["return"]();
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

  return GeneralSvgRenderer;
}(_generalBaseRenderer["default"]);

exports["default"] = GeneralSvgRenderer;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbmRlcmVycy9nZW5lcmFsU3ZnUmVuZGVyZXIuanMiXSwibmFtZXMiOlsiR2VuZXJhbFN2Z1JlbmRlcmVyIiwiZWxlbWVudCIsIm9wdGlvbnMiLCJlbGVtZW50U2l6ZSIsImV2ZW50VHJpZ2dlciIsInN1cHBvcnRDaGVjayIsIl9zdmciLCJfZGVmc1N2ZyIsImluaXQiLCJjbGVhblNjcmVlbiIsIkhlbHBlciIsImNsZWFuRWxlbWVudCIsImNyZWF0ZUVsZW1lbnRTVkciLCJhcHBlbmRDaGlsZCIsImRyYXciLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsInRleHRTdmciLCJidWxsZXRTY3JlZW5PblNjcmVlbiIsImtleSIsInN2ZyIsIml0ZW0iLCJjaGVja1doZXRoZXJIaWRlIiwic2V0QXR0cmlidXRlIiwieCIsInRvRml4ZWQiLCJhY3R1YWxZIiwiY3JlYXRBbmRnZXRXaWR0aCIsImJ1bGxldFNjcmVlbiIsInRleHQiLCJzaXplIiwic3R5bGUiLCJmb250RmFtaWx5IiwiZm9udFdlaWdodCIsImNvbG9yIiwiZG9jdW1lbnQiLCJjcmVhdGVUZXh0Tm9kZSIsImJvcmRlckNvbG9yIiwic2hhZG93Qmx1ciIsImZpbHRlcklkIiwiZmlsdGVyU3ZnIiwiZ2V0RWxlbWVudEJ5SWQiLCJpZCIsImZlT2Zmc2V0U3ZnIiwiZmVHYXVzc2lhbkJsdXJTdmciLCJmZUJsZW5kU3ZnIiwiYnVsbGV0U2NyZWVuQ291bnQiLCJpbnNlcnRFbGVtZW50Iiwid2lkdGgiLCJnZXRDb21wdXRlZFRleHRMZW5ndGgiLCJib3hDb2xvciIsInJlY3RTdmciLCJyZWN0IiwiaGVpZ2h0IiwiaW5zZXJ0QmVmb3JlIiwicmVtb3ZlQ2hpbGQiLCJpbmRleCIsInJlQ3JlYXRBbmRnZXRXaWR0aCIsIl9zZXRTaXplIiwic2V0U2l6ZSIsImRpdiIsImNyZWF0ZUVsZW1lbnQiLCJwYWRkaW5nIiwibWFyZ2luIiwiZXZlbnREaXYiLCJwb3NpdGlvbiIsInRvcCIsInJpZ2h0IiwiYm90dG9tIiwibGVmdCIsInJlZ2lzdGVyRXZlbnQiLCJjcmVhdGVFbGVtZW50TlMiLCJCcm93c2VyTm90U3VwcG9ydEVycm9yIiwiY3JlYXRlU1ZHUmVjdCIsIl9jaGVja1doZXRoZXJIaWRlIiwiZ2V0QnVsbGV0U2NyZWVuT25TY3JlZW5CeUxvY2F0aW9uIiwibG9jYXRpb24iLCJ0ZXh0U3ZncyIsImxlbmd0aCIsIngxIiwieDIiLCJ5MSIsInkyIiwieSIsImdldExvY2F0aW9uIiwiZSIsImdldE9mZnNldFRvcCIsIm9mZnNldFRvcCIsIm9mZnNldFBhcmVudCIsImdldE9mZnNldExlZnQiLCJvZmZzZXRMZWZ0Iiwib2Zmc2V0WCIsImxheWVyWCIsInBhZ2VYIiwiZG9jIiwiZG9jdW1lbnRFbGVtZW50IiwiYm9keSIsImNsaWVudFgiLCJzY3JvbGxMZWZ0IiwiY2xpZW50TGVmdCIsInBhZ2VZIiwiY2xpZW50WSIsInNjcm9sbFRvcCIsImNsaWVudFRvcCIsInRhcmdldCIsImxheWVyWSIsIm9mZnNldFkiLCJvbmNvbnRleHRtZW51Iiwib25jbGljayIsIm9ubW91c2Vtb3ZlIiwiX2J1bGxldFNjcmVlbk9uU2NyZWVuIiwibW91c2VpbiIsImN1cnNvciIsImN1cnNvck9uTW91c2VPdmVyIiwib25tb3VzZW91dCIsInF1YWxpZmllZE5hbWUiLCJlbGVtZW50cyIsInRhZ05hbWUiLCJfbGF5ZXIiLCJsYXllciIsIkdlbmVyYWxCYXNlUmVuZGVyZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7O0lBR3FCQSxrQjs7O0FBQ2pCOzs7Ozs7OztBQVFBLDhCQUFZQyxPQUFaLEVBQXFCQyxPQUFyQixFQUE4QkMsV0FBOUIsRUFBMkNDLFlBQTNDLEVBQXlEO0FBQUE7O0FBQUE7O0FBQ3JEQyxJQUFBQSxZQUFZOztBQUNaLFFBQUlDLElBQUo7O0FBQ0EsUUFBSUMsUUFBSjs7QUFDQSw0RkFBTUMsSUFBSSxFQUFWLEVBQWNO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c0csYUFBMUIsRUFBeUNoSCxPQUF6QyxFQUFrRDtBQUM5QyxhQUFPZ0MsUUFBUSxDQUFDb0MsZUFBVCxDQUF5Qiw0QkFBekIsRUFBdUQ0QyxhQUF2RCxFQUFzRWhILE9BQXRFLENBQVA7QUFDSDtBQUVEOzs7Ozs7QUFJQSxhQUFTNEMsYUFBVCxDQUF1QjdDLE9BQXZCLEVBQWdDO0FBQzVCLFVBQUlrSCxRQUFRLEdBQUc3RyxJQUFJLENBQUNTLG9CQUFMLENBQTBCZCxPQUFPLENBQUNtSCxPQUFsQyxDQUFmOztBQUNBLFVBQUlELFFBQVEsQ0FBQ3RDLE1BQVQsS0FBb0IsQ0FBeEIsRUFBMkJ2RSxJQUFJLENBQUNPLFdBQUwsQ0FBaUJaLE9BQWpCO0FBQzNCLFVBQUlzRCxLQUFKOztBQUNBLFdBQUtBLEtBQUssR0FBRzRELFFBQVEsQ0FBQ3RDLE1BQVQsR0FBa0IsQ0FBL0IsRUFBa0N0QixLQUFLLEdBQUcsQ0FBMUMsRUFBNkNBLEtBQUssRUFBbEQsRUFBc0Q7QUFDbEQsWUFBSThELE1BQU0sR0FBR0YsUUFBUSxDQUFDNUQsS0FBRCxDQUFSLENBQWdCdEMsb0JBQWhCLENBQXFDVSxZQUFyQyxDQUFrRDJGLEtBQS9EO0FBQ0EsWUFBSUQsTUFBTSxJQUFJcEgsT0FBTyxDQUFDZ0Isb0JBQVIsQ0FBNkJVLFlBQTdCLENBQTBDMkYsS0FBeEQsRUFBK0Q7QUFDbEU7O0FBQ0QsVUFBSSxFQUFFL0QsS0FBRixLQUFZNEQsUUFBUSxDQUFDdEMsTUFBekIsRUFBaUN2RSxJQUFJLENBQUNPLFdBQUwsQ0FBaUJaLE9BQWpCLEVBQWpDLEtBQ0tLLElBQUksQ0FBQytDLFlBQUwsQ0FBa0JwRCxPQUFsQixFQUEyQmtILFFBQVEsQ0FBQzVELEtBQUQsQ0FBbkM7QUFDUjs7QUFqVG9EO0FBa1R4RDs7O0VBM1QyQ2dFLCtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEdlbmVyYWxCYXNlUmVuZGVyZXIgZnJvbSAnLi9nZW5lcmFsQmFzZVJlbmRlcmVyJ1xuaW1wb3J0IEJyb3dzZXJOb3RTdXBwb3J0RXJyb3IgZnJvbSAnLi4vZXJyb3JzL2Jyb3dzZXJOb3RTdXBwb3J0RXJyb3InXG5pbXBvcnQgSGVscGVyIGZyb20gJy4uL2xpYi9oZWxwZXInXG5cbi8qKlxuICogU1ZHIOa4suafk+WZqOexu1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHZW5lcmFsU3ZnUmVuZGVyZXIgZXh0ZW5kcyBHZW5lcmFsQmFzZVJlbmRlcmVyIHtcbiAgICAvKipcbiAgICAgKiDlrp7kvovljJbkuIDkuKogU1ZHIOa4suafk+WZqOexu1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbGVtZW50IC0gRWxlbWVudCDlhYPntKBcbiAgICAgKiBAcGFyYW0ge29wZW5CU0V+T3B0aW9uc30gb3B0aW9ucyAtIOWFqOWxgOmAiemhuVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbGVtZW50U2l6ZSAtIOWFg+e0oOWkp+Wwj1xuICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50VHJpZ2dlciAtIOS6i+S7tuW8leWPkeaWueazlVxuICAgICAqIEB0aHJvd3Mge29wZW5CU0UuQnJvd3Nlck5vdFN1cHBvcnRFcnJvcn0g5rWP6KeI5Zmo5LiN5pSv5oyB54m55a6a5riy5p+T5qih5byP5pe25byV5Y+R6ZSZ6K+vXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgb3B0aW9ucywgZWxlbWVudFNpemUsIGV2ZW50VHJpZ2dlcikge1xuICAgICAgICBzdXBwb3J0Q2hlY2soKTsgLy/mtY/op4jlmajmlK/mjIHmo4DmtYtcbiAgICAgICAgbGV0IF9zdmc7XG4gICAgICAgIGxldCBfZGVmc1N2ZztcbiAgICAgICAgc3VwZXIoaW5pdCgpLCBvcHRpb25zLCBlbGVtZW50U2l6ZSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa4hemZpOWxj+W5leWGheWuuVxuICAgICAgICAgKiBAb3ZlcnJpZGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY2xlYW5TY3JlZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBIZWxwZXIuY2xlYW5FbGVtZW50KF9zdmcpO1xuICAgICAgICAgICAgX2RlZnNTdmcgPSBjcmVhdGVFbGVtZW50U1ZHKCdkZWZzJyk7IC8vZGVmc1xuICAgICAgICAgICAgX3N2Zy5hcHBlbmRDaGlsZChfZGVmc1N2Zyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog57uY5Yi25Ye95pWwXG4gICAgICAgICAqIEBvdmVycmlkZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5kcmF3ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZm9yIChsZXQgdGV4dFN2ZyBvZiBfc3ZnLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0ZXh0JykpIHtcbiAgICAgICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuT25TY3JlZW4gPSB0ZXh0U3ZnLmJ1bGxldFNjcmVlbk9uU2NyZWVuO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBidWxsZXRTY3JlZW5PblNjcmVlbi5zdmcpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSBidWxsZXRTY3JlZW5PblNjcmVlbi5zdmdba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tXaGV0aGVySGlkZShidWxsZXRTY3JlZW5PblNjcmVlbikpIGl0ZW0uc2V0QXR0cmlidXRlKCdvcGFjaXR5JywgJzAnKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpdGVtLnNldEF0dHJpYnV0ZSgnb3BhY2l0eScsICcxJyk7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7KGJ1bGxldFNjcmVlbk9uU2NyZWVuLnggLSA0KS50b0ZpeGVkKDEpfSwkeyhidWxsZXRTY3JlZW5PblNjcmVlbi5hY3R1YWxZIC0gNCkudG9GaXhlZCgxKX0pYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWIm+W7uuW8ueW5leWFg+e0oFxuICAgICAgICAgKiBAb3ZlcnJpZGVcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGJ1bGxldFNjcmVlbk9uU2NyZWVuIC0g5bGP5bmV5by55bmV5a+56LGhXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmNyZWF0QW5kZ2V0V2lkdGggPSBmdW5jdGlvbiAoYnVsbGV0U2NyZWVuT25TY3JlZW4pIHtcbiAgICAgICAgICAgIGxldCBidWxsZXRTY3JlZW4gPSBidWxsZXRTY3JlZW5PblNjcmVlbi5idWxsZXRTY3JlZW47XG4gICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi5zdmcgPSB0eXBlb2YgYnVsbGV0U2NyZWVuT25TY3JlZW4uc3ZnID09PSAnb2JqZWN0JyA/IGJ1bGxldFNjcmVlbk9uU2NyZWVuLnN2ZyA6IHt9O1xuXG4gICAgICAgICAgICBsZXQgdGV4dFN2ZyA9IHR5cGVvZiBidWxsZXRTY3JlZW5PblNjcmVlbi5zdmcudGV4dCA9PT0gJ29iamVjdCcgPyBidWxsZXRTY3JlZW5PblNjcmVlbi5zdmcudGV4dCA6IGNyZWF0ZUVsZW1lbnRTVkcoJ3RleHQnKTtcbiAgICAgICAgICAgIHRleHRTdmcuc2V0QXR0cmlidXRlKCd4JywgMCk7XG4gICAgICAgICAgICB0ZXh0U3ZnLnNldEF0dHJpYnV0ZSgneScsIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnNpemUgKiAwLjgpO1xuICAgICAgICAgICAgdGV4dFN2Zy5zZXRBdHRyaWJ1dGUoJ2ZvbnQtZmFtaWx5JywgYnVsbGV0U2NyZWVuLnN0eWxlLmZvbnRGYW1pbHkpO1xuICAgICAgICAgICAgdGV4dFN2Zy5zZXRBdHRyaWJ1dGUoJ2ZvbnQtc2l6ZScsIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnNpemUpO1xuICAgICAgICAgICAgdGV4dFN2Zy5zZXRBdHRyaWJ1dGUoJ2ZvbnQtd2VpZ2h0JywgYnVsbGV0U2NyZWVuLnN0eWxlLmZvbnRXZWlnaHQpO1xuICAgICAgICAgICAgdGV4dFN2Zy5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCBidWxsZXRTY3JlZW4uc3R5bGUuY29sb3IpO1xuICAgICAgICAgICAgSGVscGVyLmNsZWFuRWxlbWVudCh0ZXh0U3ZnKTtcbiAgICAgICAgICAgIHRleHRTdmcuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYnVsbGV0U2NyZWVuLnRleHQpKTtcbiAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW4uc3R5bGUuYm9yZGVyQ29sb3IgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRleHRTdmcuc2V0QXR0cmlidXRlKCdzdHJva2UnLCBidWxsZXRTY3JlZW4uYm9yZGVyQ29sb3IpO1xuICAgICAgICAgICAgICAgIHRleHRTdmcuc2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnLCAwLjUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuLnN0eWxlLnNoYWRvd0JsdXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJJZCA9IGBidWxsZXRTY3JlZW5FbmdpbmVfc3ZnRmlsdGVyX3NoYWRvd18ke2J1bGxldFNjcmVlbi5zdHlsZS5zaGFkb3dCbHVyfWA7XG4gICAgICAgICAgICAgICAgbGV0IGZpbHRlclN2ZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGZpbHRlcklkKTtcbiAgICAgICAgICAgICAgICBpZiAoZmlsdGVyU3ZnID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlclN2ZyA9IGNyZWF0ZUVsZW1lbnRTVkcoJ2ZpbHRlcicpO1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJTdmcuaWQgPSBmaWx0ZXJJZDtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyU3ZnLnNldEF0dHJpYnV0ZSgneCcsICctMTAwJScpO1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJTdmcuc2V0QXR0cmlidXRlKCd5JywgJy0xMDAlJyk7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlclN2Zy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzMwMCUnKTtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyU3ZnLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgJzMwMCUnKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZlT2Zmc2V0U3ZnID0gY3JlYXRlRWxlbWVudFNWRygnZmVPZmZzZXQnKTtcbiAgICAgICAgICAgICAgICAgICAgZmVPZmZzZXRTdmcuc2V0QXR0cmlidXRlKCdyZXN1bHQnLCAnb2ZmT3V0Jyk7XG4gICAgICAgICAgICAgICAgICAgIGZlT2Zmc2V0U3ZnLnNldEF0dHJpYnV0ZSgnaW4nLCAnU291cmNlQWxwaGEnKTtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyU3ZnLmFwcGVuZENoaWxkKGZlT2Zmc2V0U3ZnKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZlR2F1c3NpYW5CbHVyU3ZnID0gY3JlYXRlRWxlbWVudFNWRygnZmVHYXVzc2lhbkJsdXInKTtcbiAgICAgICAgICAgICAgICAgICAgZmVHYXVzc2lhbkJsdXJTdmcuc2V0QXR0cmlidXRlKCdyZXN1bHQnLCAnYmx1ck91dCcpO1xuICAgICAgICAgICAgICAgICAgICBmZUdhdXNzaWFuQmx1clN2Zy5zZXRBdHRyaWJ1dGUoJ2luJywgJ29mZk91dCcpO1xuICAgICAgICAgICAgICAgICAgICBmZUdhdXNzaWFuQmx1clN2Zy5zZXRBdHRyaWJ1dGUoJ3N0ZERldmlhdGlvbicsIGJ1bGxldFNjcmVlbi5zdHlsZS5zaGFkb3dCbHVyKTtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyU3ZnLmFwcGVuZENoaWxkKGZlR2F1c3NpYW5CbHVyU3ZnKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZlQmxlbmRTdmcgPSBjcmVhdGVFbGVtZW50U1ZHKCdmZUJsZW5kJyk7XG4gICAgICAgICAgICAgICAgICAgIGZlQmxlbmRTdmcuc2V0QXR0cmlidXRlKCdpbicsICdTb3VyY2VHcmFwaGljJyk7XG4gICAgICAgICAgICAgICAgICAgIGZlQmxlbmRTdmcuc2V0QXR0cmlidXRlKCdpbjInLCAnYmx1ck91dCcpO1xuICAgICAgICAgICAgICAgICAgICBmZUJsZW5kU3ZnLnNldEF0dHJpYnV0ZSgnbW9kZScsICdub3JtYWwnKTtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyU3ZnLmFwcGVuZENoaWxkKGZlQmxlbmRTdmcpO1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJTdmcuYnVsbGV0U2NyZWVuQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBfZGVmc1N2Zy5hcHBlbmRDaGlsZChmaWx0ZXJTdmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmaWx0ZXJTdmcuYnVsbGV0U2NyZWVuQ291bnQrKztcbiAgICAgICAgICAgICAgICB0ZXh0U3ZnLnNldEF0dHJpYnV0ZSgnZmlsdGVyJywgYHVybCgjJHtmaWx0ZXJJZH0pYCk7XG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4uZmlsdGVySWQgPSBmaWx0ZXJJZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4uc3ZnLnRleHQgPSB0ZXh0U3ZnO1xuICAgICAgICAgICAgdGV4dFN2Zy5idWxsZXRTY3JlZW5PblNjcmVlbiA9IGJ1bGxldFNjcmVlbk9uU2NyZWVuO1xuICAgICAgICAgICAgaW5zZXJ0RWxlbWVudCh0ZXh0U3ZnKTtcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLndpZHRoID0gdGV4dFN2Zy5nZXRDb21wdXRlZFRleHRMZW5ndGgoKTsgLy/lvLnluZXnmoTlrr3luqbvvJrlg4/ntKBcblxuICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbi5zdHlsZS5ib3hDb2xvciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlY3RTdmcgPSB0eXBlb2YgYnVsbGV0U2NyZWVuT25TY3JlZW4uc3ZnLnJlY3QgPT09ICdvYmplY3QnID8gYnVsbGV0U2NyZWVuT25TY3JlZW4uc3ZnLnJlY3QgOiBjcmVhdGVFbGVtZW50U1ZHKCdyZWN0Jyk7XG4gICAgICAgICAgICAgICAgcmVjdFN2Zy5zZXRBdHRyaWJ1dGUoJ3gnLCAtMyk7XG4gICAgICAgICAgICAgICAgcmVjdFN2Zy5zZXRBdHRyaWJ1dGUoJ3knLCAtMyk7XG4gICAgICAgICAgICAgICAgcmVjdFN2Zy5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCAnbm9uZScpO1xuICAgICAgICAgICAgICAgIHJlY3RTdmcuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBidWxsZXRTY3JlZW5PblNjcmVlbi5oZWlnaHQgKyA3KTtcbiAgICAgICAgICAgICAgICByZWN0U3ZnLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBidWxsZXRTY3JlZW5PblNjcmVlbi53aWR0aCArIDcpO1xuICAgICAgICAgICAgICAgIHJlY3RTdmcuc2V0QXR0cmlidXRlKCdzdHJva2UnLCBidWxsZXRTY3JlZW4uc3R5bGUuYm94Q29sb3IpO1xuICAgICAgICAgICAgICAgIHJlY3RTdmcuc2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnLCAxKTtcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi5zdmcucmVjdCA9IHJlY3RTdmc7XG4gICAgICAgICAgICAgICAgcmVjdFN2Zy5idWxsZXRTY3JlZW5PblNjcmVlbiA9IGJ1bGxldFNjcmVlbk9uU2NyZWVuO1xuICAgICAgICAgICAgICAgIF9zdmcuaW5zZXJ0QmVmb3JlKHJlY3RTdmcsIHRleHRTdmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICog5Yig6Zmk5by55bmV5YWD57SgXG4gICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICogQHBhcmFtIHtvYmplY3R9IGJ1bGxldFNjcmVlbk9uU2NyZWVuIC0g5bGP5bmV5by55bmV5a+56LGhXG4gICAgICAgICovXG4gICAgICAgIHRoaXMuZGVsZXRlID0gZnVuY3Rpb24gKGJ1bGxldFNjcmVlbk9uU2NyZWVuKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGJ1bGxldFNjcmVlbk9uU2NyZWVuLmZpbHRlcklkICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZpbHRlclN2ZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGJ1bGxldFNjcmVlbk9uU2NyZWVuLmZpbHRlcklkKTtcbiAgICAgICAgICAgICAgICBpZiAoZmlsdGVyU3ZnICE9IG51bGwgJiYgLS1maWx0ZXJTdmcuYnVsbGV0U2NyZWVuQ291bnQgPT09IDApXG4gICAgICAgICAgICAgICAgICAgIF9kZWZzU3ZnLnJlbW92ZUNoaWxkKGZpbHRlclN2Zyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBpbmRleCBpbiBidWxsZXRTY3JlZW5PblNjcmVlbi5zdmcpIHtcbiAgICAgICAgICAgICAgICBfc3ZnLnJlbW92ZUNoaWxkKGJ1bGxldFNjcmVlbk9uU2NyZWVuLnN2Z1tpbmRleF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOmHjeaWsOa3u+WKoOW8ueW5lVxuICAgICAgICAgKiBAb3ZlcnJpZGVcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGJ1bGxldFNjcmVlbk9uU2NyZWVuIC0g5bGP5bmV5by55bmV5a+56LGhXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnJlQ3JlYXRBbmRnZXRXaWR0aCA9IGZ1bmN0aW9uIChidWxsZXRTY3JlZW5PblNjcmVlbikge1xuICAgICAgICAgICAgdGhpcy5kZWxldGUoYnVsbGV0U2NyZWVuT25TY3JlZW4pO1xuICAgICAgICAgICAgdGhpcy5jcmVhdEFuZGdldFdpZHRoKGJ1bGxldFNjcmVlbk9uU2NyZWVuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBfc2V0U2l6ZSA9IHRoaXMuc2V0U2l6ZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiuvue9ruWwuuWvuFxuICAgICAgICAgKiBAb3ZlcnJpZGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc2V0U2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF9zZXRTaXplKCk7XG4gICAgICAgICAgICBfc3ZnLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgZWxlbWVudFNpemUuaGVpZ2h0KTtcbiAgICAgICAgICAgIF9zdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsIGVsZW1lbnRTaXplLndpZHRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmt7vliqBEaXZcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQHJldHVybnMge0VsZW1lbnR9IERpdlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTsgLy9ESVZcbiAgICAgICAgICAgIEhlbHBlci5jbGVhbkVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGRpdik7XG4gICAgICAgICAgICBkaXYuc3R5bGUucGFkZGluZyA9ICcwJztcbiAgICAgICAgICAgIGRpdi5zdHlsZS5tYXJnaW4gPSAnMCc7XG4gICAgICAgICAgICBfc3ZnID0gY3JlYXRlRWxlbWVudFNWRygnc3ZnJyk7IC8vU1ZHXG4gICAgICAgICAgICBfZGVmc1N2ZyA9IGNyZWF0ZUVsZW1lbnRTVkcoJ2RlZnMnKTsgLy9kZWZzXG4gICAgICAgICAgICBfc3ZnLmFwcGVuZENoaWxkKF9kZWZzU3ZnKTtcbiAgICAgICAgICAgIF9zdmcuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBlbGVtZW50U2l6ZS5oZWlnaHQpO1xuICAgICAgICAgICAgX3N2Zy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgZWxlbWVudFNpemUud2lkdGgpO1xuICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKF9zdmcpO1xuICAgICAgICAgICAgbGV0IGV2ZW50RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7IC8vRElWXG4gICAgICAgICAgICBldmVudERpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICBldmVudERpdi5zdHlsZS50b3AgPVxuICAgICAgICAgICAgICAgIGV2ZW50RGl2LnN0eWxlLnJpZ2h0ID1cbiAgICAgICAgICAgICAgICBldmVudERpdi5zdHlsZS5ib3R0b20gPVxuICAgICAgICAgICAgICAgIGV2ZW50RGl2LnN0eWxlLmxlZnQgPSAnMCc7XG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZXZlbnREaXYpO1xuICAgICAgICAgICAgcmVnaXN0ZXJFdmVudChldmVudERpdik7IC8v5rOo5YaM5LqL5Lu25ZON5bqU56iL5bqPXG4gICAgICAgICAgICByZXR1cm4gZGl2O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa1j+iniOWZqOaUr+aMgeajgOa1i1xuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAdGhyb3dzIHtvcGVuQlNFLkJyb3dzZXJOb3RTdXBwb3J0RXJyb3J9IOa1j+iniOWZqOS4jeaUr+aMgeeJueWumua4suafk+aooeW8j+aXtuW8leWPkemUmeivr1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc3VwcG9ydENoZWNrKCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMgIT0gJ2Z1bmN0aW9uJykgdGhyb3cgbmV3IEJyb3dzZXJOb3RTdXBwb3J0RXJyb3IoJ2NyZWF0ZUVsZW1lbnROUyBGdW5jdGlvbicpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjcmVhdGVFbGVtZW50U1ZHKCdzdmcnKS5jcmVhdGVTVkdSZWN0ICE9ICdmdW5jdGlvbicpIHRocm93IG5ldyBCcm93c2VyTm90U3VwcG9ydEVycm9yKCdTVkcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBfY2hlY2tXaGV0aGVySGlkZSA9IHRoaXMuY2hlY2tXaGV0aGVySGlkZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOazqOWGjOS6i+S7tuWTjeW6lOeoi+W6j1xuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgLSDlhYPntKBcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHJlZ2lzdGVyRXZlbnQoZWxlbWVudCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0QnVsbGV0U2NyZWVuT25TY3JlZW5CeUxvY2F0aW9uKGxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgbGV0IHRleHRTdmdzID0gX3N2Zy5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGV4dCcpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gdGV4dFN2Z3MubGVuZ3RoIC0gMTsgaW5kZXggPiAwOyBpbmRleC0tKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBidWxsZXRTY3JlZW5PblNjcmVlbiA9IHRleHRTdmdzW2luZGV4XS5idWxsZXRTY3JlZW5PblNjcmVlbjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9jaGVja1doZXRoZXJIaWRlKGJ1bGxldFNjcmVlbk9uU2NyZWVuKSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICBsZXQgeDEgPSBidWxsZXRTY3JlZW5PblNjcmVlbi54IC0gNDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHgyID0geDEgKyBidWxsZXRTY3JlZW5PblNjcmVlbi53aWR0aCArIDg7XG4gICAgICAgICAgICAgICAgICAgIGxldCB5MSA9IGJ1bGxldFNjcmVlbk9uU2NyZWVuLmFjdHVhbFkgLSA0O1xuICAgICAgICAgICAgICAgICAgICBsZXQgeTIgPSB5MSArIGJ1bGxldFNjcmVlbk9uU2NyZWVuLmhlaWdodCArIDg7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2NhdGlvbi54ID49IHgxICYmIGxvY2F0aW9uLnggPD0geDIgJiYgbG9jYXRpb24ueSA+PSB5MSAmJiBsb2NhdGlvbi55IDw9IHkyKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJ1bGxldFNjcmVlbk9uU2NyZWVuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldExvY2F0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBnZXRPZmZzZXRUb3AoZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0VG9wID0gMDtcbiAgICAgICAgICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0VG9wICs9IGVsZW1lbnQub2Zmc2V0VG9wO1xuICAgICAgICAgICAgICAgICAgICB9IHdoaWxlICgoZWxlbWVudCA9IGVsZW1lbnQub2Zmc2V0UGFyZW50KSAhPSBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9mZnNldFRvcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZ2V0T2Zmc2V0TGVmdChlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvZmZzZXRMZWZ0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0TGVmdCArPSBlbGVtZW50Lm9mZnNldExlZnQ7XG4gICAgICAgICAgICAgICAgICAgIH0gd2hpbGUgKChlbGVtZW50ID0gZWxlbWVudC5vZmZzZXRQYXJlbnQpICE9IG51bGwpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2Zmc2V0TGVmdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlLm9mZnNldFggPT09ICd1bmRlZmluZWQnIHx8IGUub2Zmc2V0WCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGUubGF5ZXJYID09PSAndW5kZWZpbmVkJyB8fCBlLmxheWVyWCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlLnBhZ2VYID09PSAndW5kZWZpbmVkJyB8fCBlLnBhZ2VYID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRvYyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgYm9keSA9IGRvY3VtZW50LmJvZHk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wYWdlWCA9IGUuY2xpZW50WCArIChkb2MgJiYgZG9jLnNjcm9sbExlZnQgfHwgYm9keSAmJiBib2R5LnNjcm9sbExlZnQgfHwgMCkgLSAoZG9jICYmIGRvYy5jbGllbnRMZWZ0IHx8IGJvZHkgJiYgYm9keS5jbGllbnRMZWZ0IHx8IDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucGFnZVkgPSBlLmNsaWVudFkgKyAoZG9jICYmIGRvYy5zY3JvbGxUb3AgfHwgYm9keSAmJiBib2R5LnNjcm9sbFRvcCB8fCAwKSAtIChkb2MgJiYgZG9jLmNsaWVudFRvcCB8fCBib2R5ICYmIGJvZHkuY2xpZW50VG9wIHx8IDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZS5sYXllclggPSBlLnBhZ2VYIC0gZ2V0T2Zmc2V0TGVmdChlLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLmxheWVyWSA9IGUucGFnZVkgLSBnZXRPZmZzZXRUb3AoZS50YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGUub2Zmc2V0WCA9IGUubGF5ZXJYIC0gZS50YXJnZXQuY2xpZW50TGVmdDtcbiAgICAgICAgICAgICAgICAgICAgZS5vZmZzZXRZID0gZS5sYXllclkgLSBlLnRhcmdldC5jbGllbnRUb3A7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHg6IGUub2Zmc2V0WCxcbiAgICAgICAgICAgICAgICAgICAgeTogZS5vZmZzZXRZXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy/kuIrkuIvmlofoj5zljZVcbiAgICAgICAgICAgIGVsZW1lbnQub25jb250ZXh0bWVudSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgbGV0IGJ1bGxldFNjcmVlbk9uU2NyZWVuID0gZ2V0QnVsbGV0U2NyZWVuT25TY3JlZW5CeUxvY2F0aW9uKGdldExvY2F0aW9uKGUpKTtcbiAgICAgICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuT25TY3JlZW4pXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50VHJpZ2dlcignY29udGV4dG1lbnUnLCBidWxsZXRTY3JlZW5PblNjcmVlbiwgZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8v5Y2V5Ye7XG4gICAgICAgICAgICBlbGVtZW50Lm9uY2xpY2sgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGxldCBidWxsZXRTY3JlZW5PblNjcmVlbiA9IGdldEJ1bGxldFNjcmVlbk9uU2NyZWVuQnlMb2NhdGlvbihnZXRMb2NhdGlvbihlKSk7XG4gICAgICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbk9uU2NyZWVuKVxuICAgICAgICAgICAgICAgICAgICBldmVudFRyaWdnZXIoJ2NsaWNrJywgYnVsbGV0U2NyZWVuT25TY3JlZW4sIGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvL+m8oOagh+enu+WKqFxuICAgICAgICAgICAgZWxlbWVudC5vbm1vdXNlbW92ZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgbGV0IGJ1bGxldFNjcmVlbk9uU2NyZWVuID0gZ2V0QnVsbGV0U2NyZWVuT25TY3JlZW5CeUxvY2F0aW9uKGdldExvY2F0aW9uKGUpKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB0ZXh0U3ZnIG9mIF9zdmcuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RleHQnKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgX2J1bGxldFNjcmVlbk9uU2NyZWVuID0gdGV4dFN2Zy5idWxsZXRTY3JlZW5PblNjcmVlbjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9idWxsZXRTY3JlZW5PblNjcmVlbiAhPSBidWxsZXRTY3JlZW5PblNjcmVlbiAmJiBfYnVsbGV0U2NyZWVuT25TY3JlZW4ubW91c2Vpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2J1bGxldFNjcmVlbk9uU2NyZWVuLm1vdXNlaW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuY3Vyc29yID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudFRyaWdnZXIoJ21vdXNlbGVhdmUnLCBfYnVsbGV0U2NyZWVuT25TY3JlZW4sIGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW5PblNjcmVlbiA9PT0gbnVsbCB8fCBidWxsZXRTY3JlZW5PblNjcmVlbi5tb3VzZWluKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4ubW91c2VpbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5jdXJzb3IgPSBvcHRpb25zLmN1cnNvck9uTW91c2VPdmVyO1xuICAgICAgICAgICAgICAgIGV2ZW50VHJpZ2dlcignbW91c2VlbnRlcicsIGJ1bGxldFNjcmVlbk9uU2NyZWVuLCBlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL+m8oOagh+emu+W8gFxuICAgICAgICAgICAgZWxlbWVudC5vbm1vdXNlb3V0ID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB0ZXh0U3ZnIG9mIF9zdmcuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RleHQnKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgX2J1bGxldFNjcmVlbk9uU2NyZWVuID0gdGV4dFN2Zy5idWxsZXRTY3JlZW5PblNjcmVlbjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9idWxsZXRTY3JlZW5PblNjcmVlbi5tb3VzZWluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfYnVsbGV0U2NyZWVuT25TY3JlZW4ubW91c2VpbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5jdXJzb3IgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50VHJpZ2dlcignbW91c2VsZWF2ZScsIF9idWxsZXRTY3JlZW5PblNjcmVlbiwgZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yib5bu6IFNWRyDlhYPntKBcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHF1YWxpZmllZE5hbWUgLSBFbGVtZW50IOWQjeensFxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyAtIOmAiemhuVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudFNWRyhxdWFsaWZpZWROYW1lLCBvcHRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsIHF1YWxpZmllZE5hbWUsIG9wdGlvbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaMiSBsYXllciDmj5LlhaXlhYPntKBcbiAgICAgICAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IC0g5YWD57SgXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBpbnNlcnRFbGVtZW50KGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGxldCBlbGVtZW50cyA9IF9zdmcuZ2V0RWxlbWVudHNCeVRhZ05hbWUoZWxlbWVudC50YWdOYW1lKTtcbiAgICAgICAgICAgIGlmIChlbGVtZW50cy5sZW5ndGggPT09IDApIF9zdmcuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgICAgICBsZXQgaW5kZXg7XG4gICAgICAgICAgICBmb3IgKGluZGV4ID0gZWxlbWVudHMubGVuZ3RoIC0gMTsgaW5kZXggPiAwOyBpbmRleC0tKSB7XG4gICAgICAgICAgICAgICAgbGV0IF9sYXllciA9IGVsZW1lbnRzW2luZGV4XS5idWxsZXRTY3JlZW5PblNjcmVlbi5idWxsZXRTY3JlZW4ubGF5ZXI7XG4gICAgICAgICAgICAgICAgaWYgKF9sYXllciA8PSBlbGVtZW50LmJ1bGxldFNjcmVlbk9uU2NyZWVuLmJ1bGxldFNjcmVlbi5sYXllcikgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKytpbmRleCA9PT0gZWxlbWVudHMubGVuZ3RoKSBfc3ZnLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgZWxzZSBfc3ZnLmluc2VydEJlZm9yZShlbGVtZW50LCBlbGVtZW50c1tpbmRleF0pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4iXSwiZmlsZSI6InJlbmRlcmVycy9nZW5lcmFsU3ZnUmVuZGVyZXIuanMifQ==
