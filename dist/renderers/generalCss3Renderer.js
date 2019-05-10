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
        if (e.target != this) eventTrigger('contextmenu', e.target.realTimeBulletScreen, e);
        return false;
      };

      element.onclick = function (e) {
        if (e.target != this) eventTrigger('click', e.target.realTimeBulletScreen, e);
        return false;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbmRlcmVycy9nZW5lcmFsQ3NzM1JlbmRlcmVyLmpzIl0sIm5hbWVzIjpbIkdlbmVyYWxDc3MzUmVuZGVyZXIiLCJlbGVtZW50Iiwib3B0aW9ucyIsImVsZW1lbnRTaXplIiwiZXZlbnRUcmlnZ2VyIiwic3VwcG9ydENoZWNrIiwiX2RpdiIsImluaXQiLCJjbGVhblNjcmVlbiIsIkhlbHBlciIsImNsZWFuRWxlbWVudCIsImRyYXciLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImJ1bGxldFNjcmVlbkRpdiIsInJlYWxUaW1lQnVsbGV0U2NyZWVuIiwiY2hlY2tXaGV0aGVySGlkZSIsInN0eWxlIiwidmlzaWJpbGl0eSIsInRyYW5zZm9ybSIsIndlYmtpdFRyYW5zZm9ybSIsIm1zVHJhbnNmb3JtIiwieCIsInRvRml4ZWQiLCJhY3R1YWxZIiwiY3JlYXRBbmRnZXRXaWR0aCIsImJ1bGxldFNjcmVlbiIsImRpdiIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInBvc2l0aW9uIiwid2hpdGVTcGFjZSIsImZvbnRXZWlnaHQiLCJmb250U2l6ZSIsInNpemUiLCJmb250RmFtaWx5IiwibGluZUhlaWdodCIsImNvbG9yIiwic2hhZG93Qmx1ciIsInRleHRTaGFkb3ciLCJib3JkZXJDb2xvciIsInRleHRTdHJva2UiLCJ3ZWJraXRUZXh0U3Ryb2tlIiwidGV4dFN0cm9rZUNvbG9yIiwid2Via2l0VGV4dFN0cm9rZUNvbG9yIiwiYm94Q29sb3IiLCJwYWRkaW5nIiwiYm9yZGVyIiwiYXBwZW5kQ2hpbGQiLCJjcmVhdGVUZXh0Tm9kZSIsInRleHQiLCJpbnNlcnRFbGVtZW50Iiwid2lkdGgiLCJjbGllbnRXaWR0aCIsInJlbW92ZUNoaWxkIiwicmVDcmVhdEFuZGdldFdpZHRoIiwib3ZlcmZsb3ciLCJtYXJnaW4iLCJ1c2VyU2VsZWN0Iiwid2Via2l0VXNlclNlbGVjdCIsIm1zVXNlclNlbGVjdCIsImN1cnNvciIsInJlZ2lzdGVyRXZlbnQiLCJCcm93c2VyTm90U3VwcG9ydEVycm9yIiwib25jb250ZXh0bWVudSIsImUiLCJ0YXJnZXQiLCJvbmNsaWNrIiwib25tb3VzZW1vdmUiLCJtb3VzZWluIiwiY3Vyc29yT25Nb3VzZU92ZXIiLCJvbm1vdXNlb3V0IiwiZWxlbWVudHMiLCJ0YWdOYW1lIiwibGVuZ3RoIiwiaW5kZXgiLCJfbGF5ZXIiLCJsYXllciIsImluc2VydEJlZm9yZSIsIkdlbmVyYWxCYXNlUmVuZGVyZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7O0lBR3FCQSxtQjs7O0FBQ2pCOzs7Ozs7OztBQVFBLCtCQUFZQyxPQUFaLEVBQXFCQyxPQUFyQixFQUE4QkMsV0FBOUIsRUFBMkNDLFlBQTNDLEVBQXlEO0FBQUE7O0FBQUE7O0FBQ3JEQyxJQUFBQSxZQUFZOztBQUNaLFFBQUlDLElBQUksR0FBR0MsSUFBSSxFQUFmOztBQUNBLDZGQUFNRCxJQUFOLEVBQVlKLE9BQVosRUFBcUJDLFdBQXJCO0FBRUE7Ozs7O0FBSUEsVUFBS0ssV0FBTCxHQUFtQixZQUFZO0FBQzNCQyx5QkFBT0MsWUFBUCxDQUFvQkosSUFBcEI7QUFDSCxLQUZEO0FBSUE7Ozs7OztBQUlBLFVBQUtLLElBQUwsR0FBWSxZQUFZO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ3BCLDZCQUE0QkwsSUFBSSxDQUFDTSxvQkFBTCxDQUEwQixLQUExQixDQUE1Qiw4SEFBOEQ7QUFBQSxjQUFyREMsZUFBcUQ7QUFDMUQsY0FBSSxRQUFPQSxlQUFlLENBQUNDLG9CQUF2QixLQUErQyxRQUFuRCxFQUE2RDs7QUFDN0QsY0FBSSxLQUFLQyxnQkFBTCxDQUFzQkYsZUFBZSxDQUFDQyxvQkFBdEMsQ0FBSixFQUFpRTtBQUM3REQsWUFBQUEsZUFBZSxDQUFDRyxLQUFoQixDQUFzQkMsVUFBdEIsR0FBbUMsUUFBbkM7QUFDQTtBQUNIOztBQUNESixVQUFBQSxlQUFlLENBQUNHLEtBQWhCLENBQXNCQyxVQUF0QixHQUFtQyxTQUFuQztBQUNBSixVQUFBQSxlQUFlLENBQUNHLEtBQWhCLENBQXNCRSxTQUF0QixHQUNJTCxlQUFlLENBQUNHLEtBQWhCLENBQXNCRyxlQUF0QixHQUNBTixlQUFlLENBQUNHLEtBQWhCLENBQXNCSSxXQUF0Qix1QkFDYSxDQUFDUCxlQUFlLENBQUNDLG9CQUFoQixDQUFxQ08sQ0FBckMsR0FBeUMsQ0FBMUMsRUFBNkNDLE9BQTdDLENBQXFELENBQXJELENBRGIsZ0JBQzBFLENBQUNULGVBQWUsQ0FBQ0Msb0JBQWhCLENBQXFDUyxPQUFyQyxHQUErQyxDQUFoRCxFQUFtREQsT0FBbkQsQ0FBMkQsQ0FBM0QsQ0FEMUUsUUFGSjtBQUlIO0FBWm1CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFhdkIsS0FiRDtBQWVBOzs7Ozs7O0FBS0EsVUFBS0UsZ0JBQUwsR0FBd0IsVUFBVVYsb0JBQVYsRUFBZ0M7QUFDcEQsVUFBSVcsWUFBWSxHQUFHWCxvQkFBb0IsQ0FBQ1csWUFBeEM7QUFDQSxVQUFJWixlQUFlLEdBQUdDLG9CQUFvQixDQUFDWSxHQUFyQixHQUEyQlosb0JBQW9CLENBQUNZLEdBQWhELEdBQXNEQyxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBNUU7QUFDQWYsTUFBQUEsZUFBZSxDQUFDRyxLQUFoQixDQUFzQmEsUUFBdEIsR0FBaUMsVUFBakM7QUFDQWhCLE1BQUFBLGVBQWUsQ0FBQ0csS0FBaEIsQ0FBc0JjLFVBQXRCLEdBQW1DLFFBQW5DO0FBQ0FqQixNQUFBQSxlQUFlLENBQUNHLEtBQWhCLENBQXNCZSxVQUF0QixHQUFtQ04sWUFBWSxDQUFDVCxLQUFiLENBQW1CZSxVQUF0RDtBQUNBbEIsTUFBQUEsZUFBZSxDQUFDRyxLQUFoQixDQUFzQmdCLFFBQXRCLGFBQW9DbEIsb0JBQW9CLENBQUNtQixJQUF6RDtBQUNBcEIsTUFBQUEsZUFBZSxDQUFDRyxLQUFoQixDQUFzQmtCLFVBQXRCLEdBQW1DVCxZQUFZLENBQUNULEtBQWIsQ0FBbUJrQixVQUF0RDtBQUNBckIsTUFBQUEsZUFBZSxDQUFDRyxLQUFoQixDQUFzQm1CLFVBQXRCLGFBQXNDckIsb0JBQW9CLENBQUNtQixJQUEzRDtBQUNBcEIsTUFBQUEsZUFBZSxDQUFDRyxLQUFoQixDQUFzQm9CLEtBQXRCLEdBQThCWCxZQUFZLENBQUNULEtBQWIsQ0FBbUJvQixLQUFqRDtBQUNBLFVBQUlYLFlBQVksQ0FBQ1QsS0FBYixDQUFtQnFCLFVBQW5CLElBQWlDLElBQXJDLEVBQ0l4QixlQUFlLENBQUNHLEtBQWhCLENBQXNCc0IsVUFBdEIsaUJBQTBDYixZQUFZLENBQUNULEtBQWIsQ0FBbUJxQixVQUE3RDs7QUFDSixVQUFJWixZQUFZLENBQUNULEtBQWIsQ0FBbUJ1QixXQUFuQixJQUFrQyxJQUF0QyxFQUE0QztBQUN4QzFCLFFBQUFBLGVBQWUsQ0FBQ0csS0FBaEIsQ0FBc0J3QixVQUF0QixHQUFtQzNCLGVBQWUsQ0FBQ0csS0FBaEIsQ0FBc0J5QixnQkFBdEIsVUFBbkM7QUFDQTVCLFFBQUFBLGVBQWUsQ0FBQ0csS0FBaEIsQ0FBc0IwQixlQUF0QixHQUF3QzdCLGVBQWUsQ0FBQ0csS0FBaEIsQ0FBc0IyQixxQkFBdEIsR0FBOENsQixZQUFZLENBQUNULEtBQWIsQ0FBbUJ1QixXQUF6RztBQUNIOztBQUNELFVBQUlkLFlBQVksQ0FBQ1QsS0FBYixDQUFtQjRCLFFBQW5CLElBQStCLElBQW5DLEVBQXlDO0FBQ3JDL0IsUUFBQUEsZUFBZSxDQUFDRyxLQUFoQixDQUFzQjZCLE9BQXRCLEdBQWdDLEtBQWhDO0FBQ0FoQyxRQUFBQSxlQUFlLENBQUNHLEtBQWhCLENBQXNCOEIsTUFBdEIsR0FBK0IsV0FBL0I7QUFDQWpDLFFBQUFBLGVBQWUsQ0FBQ0csS0FBaEIsQ0FBc0J1QixXQUF0QixHQUFvQ2QsWUFBWSxDQUFDVCxLQUFiLENBQW1CNEIsUUFBdkQ7QUFDSCxPQUpELE1BS0s7QUFDRC9CLFFBQUFBLGVBQWUsQ0FBQ0csS0FBaEIsQ0FBc0I2QixPQUF0QixHQUFnQyxLQUFoQztBQUNIOztBQUNEcEMseUJBQU9DLFlBQVAsQ0FBb0JHLGVBQXBCOztBQUNBQSxNQUFBQSxlQUFlLENBQUNrQyxXQUFoQixDQUE0QnBCLFFBQVEsQ0FBQ3FCLGNBQVQsQ0FBd0J2QixZQUFZLENBQUN3QixJQUFyQyxDQUE1QjtBQUNBcEMsTUFBQUEsZUFBZSxDQUFDQyxvQkFBaEIsR0FBdUNBLG9CQUF2QztBQUNBb0MsTUFBQUEsYUFBYSxDQUFDckMsZUFBRCxDQUFiO0FBQ0FDLE1BQUFBLG9CQUFvQixDQUFDcUMsS0FBckIsR0FBNkJ0QyxlQUFlLENBQUN1QyxXQUFoQixHQUE4QixDQUEzRDtBQUNBdEMsTUFBQUEsb0JBQW9CLENBQUNZLEdBQXJCLEdBQTJCYixlQUEzQjtBQUNILEtBOUJEO0FBZ0NBOzs7Ozs7O0FBS0Esc0JBQWMsVUFBVUMsb0JBQVYsRUFBZ0M7QUFDMUNSLE1BQUFBLElBQUksQ0FBQytDLFdBQUwsQ0FBaUJ2QyxvQkFBb0IsQ0FBQ1ksR0FBdEM7QUFDSCxLQUZEO0FBSUE7Ozs7Ozs7QUFLQSxVQUFLNEIsa0JBQUwsR0FBMEIsVUFBVXhDLG9CQUFWLEVBQWdDO0FBQ3RELHFCQUFZQSxvQkFBWjtBQUNBLFdBQUtVLGdCQUFMLENBQXNCVixvQkFBdEI7QUFDSCxLQUhEO0FBS0E7Ozs7Ozs7QUFLQSxhQUFTUCxJQUFULEdBQWdCO0FBQ1osVUFBSW1CLEdBQUcsR0FBR0MsUUFBUSxDQUFDQyxhQUFULENBQXVCLEtBQXZCLENBQVY7O0FBQ0FuQix5QkFBT0MsWUFBUCxDQUFvQlQsT0FBcEI7O0FBQ0FBLE1BQUFBLE9BQU8sQ0FBQzhDLFdBQVIsQ0FBb0JyQixHQUFwQjtBQUNBQSxNQUFBQSxHQUFHLENBQUNWLEtBQUosQ0FBVXVDLFFBQVYsR0FBcUIsUUFBckI7QUFDQTdCLE1BQUFBLEdBQUcsQ0FBQ1YsS0FBSixDQUFVNkIsT0FBVixHQUFvQixHQUFwQjtBQUNBbkIsTUFBQUEsR0FBRyxDQUFDVixLQUFKLENBQVV3QyxNQUFWLEdBQW1CLEdBQW5CO0FBQ0E5QixNQUFBQSxHQUFHLENBQUNWLEtBQUosQ0FBVXlDLFVBQVYsR0FDSS9CLEdBQUcsQ0FBQ1YsS0FBSixDQUFVMEMsZ0JBQVYsR0FDQWhDLEdBQUcsQ0FBQ1YsS0FBSixDQUFVMkMsWUFBVixHQUF5QixNQUY3QjtBQUdBakMsTUFBQUEsR0FBRyxDQUFDVixLQUFKLENBQVU0QyxNQUFWLEdBQW1CLFNBQW5CO0FBQ0FDLE1BQUFBLGFBQWEsQ0FBQ25DLEdBQUQsQ0FBYjtBQUNBLGFBQU9BLEdBQVA7QUFDSDtBQUVEOzs7Ozs7O0FBS0EsYUFBU3JCLFlBQVQsR0FBd0I7QUFDcEIsVUFBSVcsS0FBSyxHQUFHVyxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsS0FBdkIsRUFBOEJaLEtBQTFDO0FBQ0EsVUFDSSxPQUFPQSxLQUFLLENBQUNFLFNBQWIsS0FBMkIsV0FBM0IsSUFDQSxPQUFPRixLQUFLLENBQUNJLFdBQWIsS0FBNkIsV0FEN0IsSUFFQSxPQUFPSixLQUFLLENBQUNHLGVBQWIsS0FBaUMsV0FIckMsRUFJRSxNQUFNLElBQUkyQyxrQ0FBSixDQUEyQixnQkFBM0IsQ0FBTjtBQUNMO0FBRUQ7Ozs7Ozs7QUFLQSxhQUFTRCxhQUFULENBQXVCNUQsT0FBdkIsRUFBZ0M7QUFFNUJBLE1BQUFBLE9BQU8sQ0FBQzhELGFBQVIsR0FBd0IsVUFBVUMsQ0FBVixFQUFhO0FBQ2pDLFlBQUlBLENBQUMsQ0FBQ0MsTUFBRixJQUFZLElBQWhCLEVBQ0k3RCxZQUFZLENBQUMsYUFBRCxFQUFnQjRELENBQUMsQ0FBQ0MsTUFBRixDQUFTbkQsb0JBQXpCLEVBQStDa0QsQ0FBL0MsQ0FBWjtBQUNKLGVBQU8sS0FBUDtBQUNILE9BSkQ7O0FBTUEvRCxNQUFBQSxPQUFPLENBQUNpRSxPQUFSLEdBQWtCLFVBQVVGLENBQVYsRUFBYTtBQUMzQixZQUFJQSxDQUFDLENBQUNDLE1BQUYsSUFBWSxJQUFoQixFQUNJN0QsWUFBWSxDQUFDLE9BQUQsRUFBVTRELENBQUMsQ0FBQ0MsTUFBRixDQUFTbkQsb0JBQW5CLEVBQXlDa0QsQ0FBekMsQ0FBWjtBQUNKLGVBQU8sS0FBUDtBQUNILE9BSkQ7O0FBTUEvRCxNQUFBQSxPQUFPLENBQUNrRSxXQUFSLEdBQXNCLFVBQVVILENBQVYsRUFBYTtBQUMvQixZQUFJbEQsb0JBQW9CLEdBQUdrRCxDQUFDLENBQUNDLE1BQUYsQ0FBU25ELG9CQUFwQztBQUNBLFlBQUlrRCxDQUFDLENBQUNDLE1BQUYsS0FBYSxJQUFiLElBQXFCbkQsb0JBQW9CLENBQUNzRCxPQUE5QyxFQUF1RDtBQUN2RHRELFFBQUFBLG9CQUFvQixDQUFDc0QsT0FBckIsR0FBK0IsSUFBL0I7QUFDQUosUUFBQUEsQ0FBQyxDQUFDQyxNQUFGLENBQVNqRCxLQUFULENBQWU0QyxNQUFmLEdBQXdCMUQsT0FBTyxDQUFDbUUsaUJBQWhDO0FBQ0FqRSxRQUFBQSxZQUFZLENBQUMsWUFBRCxFQUFlVSxvQkFBZixFQUFxQ2tELENBQXJDLENBQVo7QUFDSCxPQU5EOztBQVFBL0QsTUFBQUEsT0FBTyxDQUFDcUUsVUFBUixHQUFxQixVQUFVTixDQUFWLEVBQWE7QUFDOUIsWUFBSWxELG9CQUFvQixHQUFHa0QsQ0FBQyxDQUFDQyxNQUFGLENBQVNuRCxvQkFBcEM7QUFDQSxZQUFJa0QsQ0FBQyxDQUFDQyxNQUFGLEtBQWEsSUFBYixJQUFxQixDQUFDbkQsb0JBQW9CLENBQUNzRCxPQUEvQyxFQUF3RDtBQUN4RHRELFFBQUFBLG9CQUFvQixDQUFDc0QsT0FBckIsR0FBK0IsS0FBL0I7QUFDQUosUUFBQUEsQ0FBQyxDQUFDQyxNQUFGLENBQVNqRCxLQUFULENBQWU0QyxNQUFmLEdBQXdCLEVBQXhCO0FBQ0F4RCxRQUFBQSxZQUFZLENBQUMsWUFBRCxFQUFlVSxvQkFBZixFQUFxQ2tELENBQXJDLENBQVo7QUFDSCxPQU5EO0FBT0g7QUFFRDs7Ozs7O0FBSUEsYUFBU2QsYUFBVCxDQUF1QmpELE9BQXZCLEVBQWdDO0FBQzVCLFVBQUlzRSxRQUFRLEdBQUdqRSxJQUFJLENBQUNNLG9CQUFMLENBQTBCWCxPQUFPLENBQUN1RSxPQUFsQyxDQUFmOztBQUNBLFVBQUlELFFBQVEsQ0FBQ0UsTUFBVCxLQUFvQixDQUF4QixFQUEyQm5FLElBQUksQ0FBQ3lDLFdBQUwsQ0FBaUI5QyxPQUFqQjtBQUMzQixVQUFJeUUsS0FBSjs7QUFDQSxXQUFLQSxLQUFLLEdBQUdILFFBQVEsQ0FBQ0UsTUFBVCxHQUFrQixDQUEvQixFQUFrQ0MsS0FBSyxHQUFHLENBQTFDLEVBQTZDQSxLQUFLLEVBQWxELEVBQXNEO0FBQ2xELFlBQUlDLE1BQU0sR0FBR0osUUFBUSxDQUFDRyxLQUFELENBQVIsQ0FBZ0I1RCxvQkFBaEIsQ0FBcUNXLFlBQXJDLENBQWtEbUQsS0FBL0Q7QUFDQSxZQUFJRCxNQUFNLElBQUkxRSxPQUFPLENBQUNhLG9CQUFSLENBQTZCVyxZQUE3QixDQUEwQ21ELEtBQXhELEVBQStEO0FBQ2xFOztBQUNELFVBQUksRUFBRUYsS0FBRixLQUFZSCxRQUFRLENBQUNFLE1BQXpCLEVBQWlDbkUsSUFBSSxDQUFDeUMsV0FBTCxDQUFpQjlDLE9BQWpCLEVBQWpDLEtBQ0tLLElBQUksQ0FBQ3VFLFlBQUwsQ0FBa0I1RSxPQUFsQixFQUEyQnNFLFFBQVEsQ0FBQ0csS0FBRCxDQUFuQztBQUNSOztBQTVLb0Q7QUE2S3hEOzs7RUF0TDRDSSwrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBHZW5lcmFsQmFzZVJlbmRlcmVyIGZyb20gJy4vZ2VuZXJhbEJhc2VSZW5kZXJlcidcbmltcG9ydCBCcm93c2VyTm90U3VwcG9ydEVycm9yIGZyb20gJy4uL2Vycm9ycy9icm93c2VyTm90U3VwcG9ydEVycm9yJ1xuaW1wb3J0IEhlbHBlciBmcm9tICcuLi9saWIvaGVscGVyJztcblxuLyoqXG4gKiBDU1MzIOa4suafk+WZqOexu1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHZW5lcmFsQ3NzM1JlbmRlcmVyIGV4dGVuZHMgR2VuZXJhbEJhc2VSZW5kZXJlciB7XG4gICAgLyoqXG4gICAgICog5a6e5L6L5YyW5LiA5LiqIENTUzMg5riy5p+T5Zmo57G7XG4gICAgICogQHBhcmFtIHtvYmplY3R9IGVsZW1lbnQgLSBFbGVtZW50IOWFg+e0oFxuICAgICAqIEBwYXJhbSB7b3BlbkJTRX5PcHRpb25zfSBvcHRpb25zIC0g5YWo5bGA6YCJ6aG5XG4gICAgICogQHBhcmFtIHtvYmplY3R9IGVsZW1lbnRTaXplIC0g5YWD57Sg5aSn5bCPXG4gICAgICogQHBhcmFtIHtFdmVudH0gZXZlbnRUcmlnZ2VyIC0g5LqL5Lu25byV5Y+R5pa55rOVXG4gICAgICogQHRocm93cyB7b3BlbkJTRS5Ccm93c2VyTm90U3VwcG9ydEVycm9yfSDmtY/op4jlmajkuI3mlK/mjIHnibnlrprmuLLmn5PmqKHlvI/ml7blvJXlj5HplJnor69cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBvcHRpb25zLCBlbGVtZW50U2l6ZSwgZXZlbnRUcmlnZ2VyKSB7XG4gICAgICAgIHN1cHBvcnRDaGVjaygpOyAvL+a1j+iniOWZqOaUr+aMgeajgOa1i1xuICAgICAgICBsZXQgX2RpdiA9IGluaXQoKTtcbiAgICAgICAgc3VwZXIoX2Rpdiwgb3B0aW9ucywgZWxlbWVudFNpemUpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmuIXpmaTlsY/luZXlhoXlrrlcbiAgICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmNsZWFuU2NyZWVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgSGVscGVyLmNsZWFuRWxlbWVudChfZGl2KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDnu5jliLblh73mlbBcbiAgICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmRyYXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBidWxsZXRTY3JlZW5EaXYgb2YgX2Rpdi5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGl2JykpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGJ1bGxldFNjcmVlbkRpdi5yZWFsVGltZUJ1bGxldFNjcmVlbiAhPSAnb2JqZWN0JykgY29udGludWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tXaGV0aGVySGlkZShidWxsZXRTY3JlZW5EaXYucmVhbFRpbWVCdWxsZXRTY3JlZW4pKSB7XG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUudHJhbnNmb3JtID1cbiAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9XG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS5tc1RyYW5zZm9ybSA9XG4gICAgICAgICAgICAgICAgICAgIGB0cmFuc2xhdGUoJHsoYnVsbGV0U2NyZWVuRGl2LnJlYWxUaW1lQnVsbGV0U2NyZWVuLnggLSA0KS50b0ZpeGVkKDEpfXB4LCR7KGJ1bGxldFNjcmVlbkRpdi5yZWFsVGltZUJ1bGxldFNjcmVlbi5hY3R1YWxZIC0gNCkudG9GaXhlZCgxKX1weClgO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWIm+W7uuW8ueW5leWFg+e0oFxuICAgICAgICAgKiBAb3ZlcnJpZGVcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IHJlYWxUaW1lQnVsbGV0U2NyZWVuIC0g5a6e5pe25by55bmV5a+56LGhXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmNyZWF0QW5kZ2V0V2lkdGggPSBmdW5jdGlvbiAocmVhbFRpbWVCdWxsZXRTY3JlZW4pIHtcbiAgICAgICAgICAgIGxldCBidWxsZXRTY3JlZW4gPSByZWFsVGltZUJ1bGxldFNjcmVlbi5idWxsZXRTY3JlZW47XG4gICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuRGl2ID0gcmVhbFRpbWVCdWxsZXRTY3JlZW4uZGl2ID8gcmVhbFRpbWVCdWxsZXRTY3JlZW4uZGl2IDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLndoaXRlU3BhY2UgPSAnbm93cmFwJztcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS5mb250V2VpZ2h0ID0gYnVsbGV0U2NyZWVuLnN0eWxlLmZvbnRXZWlnaHQ7XG4gICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUuZm9udFNpemUgPSBgJHtyZWFsVGltZUJ1bGxldFNjcmVlbi5zaXplfXB4YDtcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS5mb250RmFtaWx5ID0gYnVsbGV0U2NyZWVuLnN0eWxlLmZvbnRGYW1pbHk7XG4gICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUubGluZUhlaWdodCA9IGAke3JlYWxUaW1lQnVsbGV0U2NyZWVuLnNpemV9cHhgO1xuICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLmNvbG9yID0gYnVsbGV0U2NyZWVuLnN0eWxlLmNvbG9yO1xuICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbi5zdHlsZS5zaGFkb3dCbHVyICE9IG51bGwpXG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLnRleHRTaGFkb3cgPSBgMCAwICR7YnVsbGV0U2NyZWVuLnN0eWxlLnNoYWRvd0JsdXJ9cHggYmxhY2tgO1xuICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbi5zdHlsZS5ib3JkZXJDb2xvciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLnRleHRTdHJva2UgPSBidWxsZXRTY3JlZW5EaXYuc3R5bGUud2Via2l0VGV4dFN0cm9rZSA9IGAwLjVweGA7XG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LnN0eWxlLnRleHRTdHJva2VDb2xvciA9IGJ1bGxldFNjcmVlbkRpdi5zdHlsZS53ZWJraXRUZXh0U3Ryb2tlQ29sb3IgPSBidWxsZXRTY3JlZW4uc3R5bGUuYm9yZGVyQ29sb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuLnN0eWxlLmJveENvbG9yICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUucGFkZGluZyA9ICczcHgnO1xuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbkRpdi5zdHlsZS5ib3JkZXIgPSAnMXB4IHNvbGlkJztcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUuYm9yZGVyQ29sb3IgPSBidWxsZXRTY3JlZW4uc3R5bGUuYm94Q29sb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYuc3R5bGUucGFkZGluZyA9ICc0cHgnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgSGVscGVyLmNsZWFuRWxlbWVudChidWxsZXRTY3JlZW5EaXYpO1xuICAgICAgICAgICAgYnVsbGV0U2NyZWVuRGl2LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGJ1bGxldFNjcmVlbi50ZXh0KSk7XG4gICAgICAgICAgICBidWxsZXRTY3JlZW5EaXYucmVhbFRpbWVCdWxsZXRTY3JlZW4gPSByZWFsVGltZUJ1bGxldFNjcmVlbjtcbiAgICAgICAgICAgIGluc2VydEVsZW1lbnQoYnVsbGV0U2NyZWVuRGl2KTsgLy9pbnNlcnRcbiAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLndpZHRoID0gYnVsbGV0U2NyZWVuRGl2LmNsaWVudFdpZHRoIC0gODsgLy/lvLnluZXnmoTlrr3luqbvvJrlg4/ntKBcbiAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLmRpdiA9IGJ1bGxldFNjcmVlbkRpdjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAqIOWIoOmZpOW8ueW5leWFg+e0oFxuICAgICAgICAqIEBvdmVycmlkZVxuICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZWFsVGltZUJ1bGxldFNjcmVlbiAtIOWunuaXtuW8ueW5leWvueixoVxuICAgICAgICAqL1xuICAgICAgICB0aGlzLmRlbGV0ZSA9IGZ1bmN0aW9uIChyZWFsVGltZUJ1bGxldFNjcmVlbikge1xuICAgICAgICAgICAgX2Rpdi5yZW1vdmVDaGlsZChyZWFsVGltZUJ1bGxldFNjcmVlbi5kaXYpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOmHjeaWsOa3u+WKoOW8ueW5lVxuICAgICAgICAgKiBAb3ZlcnJpZGVcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IHJlYWxUaW1lQnVsbGV0U2NyZWVuIC0g5a6e5pe25by55bmV5a+56LGhXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnJlQ3JlYXRBbmRnZXRXaWR0aCA9IGZ1bmN0aW9uIChyZWFsVGltZUJ1bGxldFNjcmVlbikge1xuICAgICAgICAgICAgdGhpcy5kZWxldGUocmVhbFRpbWVCdWxsZXRTY3JlZW4pO1xuICAgICAgICAgICAgdGhpcy5jcmVhdEFuZGdldFdpZHRoKHJlYWxUaW1lQnVsbGV0U2NyZWVuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmt7vliqBEaXZcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQHJldHVybnMge0VsZW1lbnR9IERpdlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTsgLy9ESVZcbiAgICAgICAgICAgIEhlbHBlci5jbGVhbkVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGRpdik7XG4gICAgICAgICAgICBkaXYuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAgICAgICAgIGRpdi5zdHlsZS5wYWRkaW5nID0gJzAnO1xuICAgICAgICAgICAgZGl2LnN0eWxlLm1hcmdpbiA9ICcwJztcbiAgICAgICAgICAgIGRpdi5zdHlsZS51c2VyU2VsZWN0ID1cbiAgICAgICAgICAgICAgICBkaXYuc3R5bGUud2Via2l0VXNlclNlbGVjdCA9XG4gICAgICAgICAgICAgICAgZGl2LnN0eWxlLm1zVXNlclNlbGVjdCA9ICdub25lJztcbiAgICAgICAgICAgIGRpdi5zdHlsZS5jdXJzb3IgPSAnZGVmYXVsdCc7XG4gICAgICAgICAgICByZWdpc3RlckV2ZW50KGRpdik7IC8v5rOo5YaM5LqL5Lu25ZON5bqU56iL5bqPXG4gICAgICAgICAgICByZXR1cm4gZGl2O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa1j+iniOWZqOaUr+aMgeajgOa1i1xuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAdGhyb3dzIHtvcGVuQlNFLkJyb3dzZXJOb3RTdXBwb3J0RXJyb3J9IOa1j+iniOWZqOS4jeaUr+aMgeeJueWumua4suafk+aooeW8j+aXtuW8leWPkemUmeivr1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc3VwcG9ydENoZWNrKCkge1xuICAgICAgICAgICAgbGV0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jykuc3R5bGU7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdHlwZW9mIHN0eWxlLnRyYW5zZm9ybSA9PT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2Ygc3R5bGUubXNUcmFuc2Zvcm0gPT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIHN0eWxlLndlYmtpdFRyYW5zZm9ybSA9PT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICkgdGhyb3cgbmV3IEJyb3dzZXJOb3RTdXBwb3J0RXJyb3IoJ0NTUzMgdHJhbnNmb3JtJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5rOo5YaM5LqL5Lu25ZON5bqU56iL5bqPXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCAtIOWFg+e0oFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcmVnaXN0ZXJFdmVudChlbGVtZW50KSB7XG4gICAgICAgICAgICAvL+S4iuS4i+aWh+iPnOWNlVxuICAgICAgICAgICAgZWxlbWVudC5vbmNvbnRleHRtZW51ID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQgIT0gdGhpcylcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRUcmlnZ2VyKCdjb250ZXh0bWVudScsIGUudGFyZ2V0LnJlYWxUaW1lQnVsbGV0U2NyZWVuLCBlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy/ljZXlh7tcbiAgICAgICAgICAgIGVsZW1lbnQub25jbGljayA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0ICE9IHRoaXMpXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50VHJpZ2dlcignY2xpY2snLCBlLnRhcmdldC5yZWFsVGltZUJ1bGxldFNjcmVlbiwgZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8v6byg5qCH56e75YqoXG4gICAgICAgICAgICBlbGVtZW50Lm9ubW91c2Vtb3ZlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVhbFRpbWVCdWxsZXRTY3JlZW4gPSBlLnRhcmdldC5yZWFsVGltZUJ1bGxldFNjcmVlbjtcbiAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQgPT09IHRoaXMgfHwgcmVhbFRpbWVCdWxsZXRTY3JlZW4ubW91c2VpbikgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLm1vdXNlaW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGUudGFyZ2V0LnN0eWxlLmN1cnNvciA9IG9wdGlvbnMuY3Vyc29yT25Nb3VzZU92ZXI7XG4gICAgICAgICAgICAgICAgZXZlbnRUcmlnZ2VyKCdtb3VzZWVudGVyJywgcmVhbFRpbWVCdWxsZXRTY3JlZW4sIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy/pvKDmoIfnprvlvIBcbiAgICAgICAgICAgIGVsZW1lbnQub25tb3VzZW91dCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlYWxUaW1lQnVsbGV0U2NyZWVuID0gZS50YXJnZXQucmVhbFRpbWVCdWxsZXRTY3JlZW47XG4gICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0ID09PSB0aGlzIHx8ICFyZWFsVGltZUJ1bGxldFNjcmVlbi5tb3VzZWluKSByZXR1cm47XG4gICAgICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4ubW91c2VpbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGUudGFyZ2V0LnN0eWxlLmN1cnNvciA9ICcnO1xuICAgICAgICAgICAgICAgIGV2ZW50VHJpZ2dlcignbW91c2VsZWF2ZScsIHJlYWxUaW1lQnVsbGV0U2NyZWVuLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmjIkgbGF5ZXIg5o+S5YWl5YWD57SgXG4gICAgICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCAtIOWFg+e0oFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gaW5zZXJ0RWxlbWVudChlbGVtZW50KSB7XG4gICAgICAgICAgICBsZXQgZWxlbWVudHMgPSBfZGl2LmdldEVsZW1lbnRzQnlUYWdOYW1lKGVsZW1lbnQudGFnTmFtZSk7XG4gICAgICAgICAgICBpZiAoZWxlbWVudHMubGVuZ3RoID09PSAwKSBfZGl2LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgbGV0IGluZGV4O1xuICAgICAgICAgICAgZm9yIChpbmRleCA9IGVsZW1lbnRzLmxlbmd0aCAtIDE7IGluZGV4ID4gMDsgaW5kZXgtLSkge1xuICAgICAgICAgICAgICAgIGxldCBfbGF5ZXIgPSBlbGVtZW50c1tpbmRleF0ucmVhbFRpbWVCdWxsZXRTY3JlZW4uYnVsbGV0U2NyZWVuLmxheWVyO1xuICAgICAgICAgICAgICAgIGlmIChfbGF5ZXIgPD0gZWxlbWVudC5yZWFsVGltZUJ1bGxldFNjcmVlbi5idWxsZXRTY3JlZW4ubGF5ZXIpIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCsraW5kZXggPT09IGVsZW1lbnRzLmxlbmd0aCkgX2Rpdi5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgICAgICAgIGVsc2UgX2Rpdi5pbnNlcnRCZWZvcmUoZWxlbWVudCwgZWxlbWVudHNbaW5kZXhdKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuIl0sImZpbGUiOiJyZW5kZXJlcnMvZ2VuZXJhbENzczNSZW5kZXJlci5qcyJ9
