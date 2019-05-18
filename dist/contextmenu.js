"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.function.bind");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _resources = _interopRequireDefault(require("./lib/resources"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 上下文菜单类
 * @alias openBSE.Contextmenu
 * @description 上下文菜单对象。用于实现一个弹幕上下文菜单。
 */
var Contextmenu =
/**
 * 创建弹幕引擎对象的上下文菜单。
 * @param {openBSE.BulletScreenEngine} generalEngine - 弹幕引擎对象：一个弹幕 {@link openBSE.BulletScreenEngine} 对象。要添加上下文菜单的
 * @param {Element} element - 上下文菜单元素：当显示上下文菜单时要显示的 div 。有关 Element 接口的信息请参阅MDN [Element]{@link https://developer.mozilla.org/zh-CN/docs/Web/API/Element} 。
 * @param {number} [layer=10] - 弹幕层级：当显示上下文菜单或鼠标指向弹幕时弹幕要移动到的层级。有关弹幕层级的详细说明请参阅 {@link openBSE~options} 结构。
 * @param {boolean} [pause=true] - 是否暂停：当鼠标指向弹幕或单开上下文菜单时弹幕是否暂停移动/播放。
 */
function Contextmenu(generalEngine, element) {
  var layer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  var pause = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  _classCallCheck(this, Contextmenu);

  if (_typeof(generalEngine) != 'object' || _typeof(element) != 'object' || typeof pause != 'boolean' || typeof layer != 'number' && layer != null) throw new TypeError(_resources["default"].PARAMETERS_TYPE_ERROR);
  element.bulletScreenEvent = null;

  var _getContextmenuState = function _getContextmenuState() {
    return element.style.display != 'none';
  };
  /**
   * 获取上下文菜单的状态
   * @function
   * @returns {boolean} 指示上下文菜单是否正处于激活/显示状态。
   */


  this.getContextmenuState = _getContextmenuState;
  /**
   * 获取激活上下文菜单的弹幕的弹幕事件结构
   * @returns {openBSE~BulletScreenEvent} 弹幕事件结构：一个 {@link openBSE~BulletScreenEvent} 结构。
   */

  this.getBulletScreenEvent = function () {
    return element.bulletScreenEvent;
  };
  /**
   * 关闭上下文菜单：如果当前上下文菜单正处于激活/显示状态则立即关闭。
   */


  this.closeContextmenu = function () {
    if (_getContextmenuState()) {
      element.style.display = 'none';
      if (pause) element.bulletScreenEvent.setPlayState(true);
      element.bulletScreenEvent.setBulletScreen({
        _contextmenu: false
      }, false);
      element.bulletScreenEvent = null;
    }
  };

  element.style.position = 'fixed';
  element.style.display = 'none';

  element.oncontextmenu = function () {
    return false;
  };

  var isParent = function isParent(element, parentElement) {
    do {
      if (element === parentElement) return true;
    } while (document != (element = element.parentNode));

    return false;
  };

  var _closeContextmenu = function _closeContextmenu(e) {
    if (_getContextmenuState() && !isParent(e.target, element)) {
      element.style.display = 'none';
      if (pause) element.bulletScreenEvent.setPlayState(true);
      element.bulletScreenEvent.setBulletScreen({
        _contextmenu: false
      }, false);
      element.bulletScreenEvent = null;
      if (e.type === 'click') e.stopPropagation();
    }
  };

  window.addEventListener('click', _closeContextmenu, true);
  window.addEventListener('contextmenu', _closeContextmenu, true);
  window.addEventListener('scroll', _closeContextmenu, true);
  generalEngine.bind('contextmenu', function (e) {
    e.setBulletScreen({
      layer: layer,
      _contextmenu: true
    }, layer != null);
    if (pause) e.setPlayState(false);
    element.style.display = '';
    var top = e.clientY,
        left = e.clientX;
    if (top + element.clientHeight > document.documentElement.clientHeight) top -= element.clientHeight;
    if (left + element.clientWidth > document.documentElement.clientWidth) left -= element.clientWidth;
    element.style.top = "".concat(top, "px");
    element.style.left = "".concat(left, "px");
    element.bulletScreenEvent = e;
  });
  generalEngine.bind('mouseenter', function (e) {
    if (layer != null) e.setBulletScreen({
      layer: layer
    }, true);
    if (pause) e.setPlayState(false);
  });
  generalEngine.bind('mouseleave', function (e) {
    if (!e.getBulletScreen()._contextmenu && pause) e.setPlayState(true);
  });
};

exports["default"] = Contextmenu;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRleHRtZW51LmpzIl0sIm5hbWVzIjpbIkNvbnRleHRtZW51IiwiZ2VuZXJhbEVuZ2luZSIsImVsZW1lbnQiLCJsYXllciIsInBhdXNlIiwiVHlwZUVycm9yIiwiUmVzb3VyY2VzIiwiUEFSQU1FVEVSU19UWVBFX0VSUk9SIiwiYnVsbGV0U2NyZWVuRXZlbnQiLCJfZ2V0Q29udGV4dG1lbnVTdGF0ZSIsInN0eWxlIiwiZGlzcGxheSIsImdldENvbnRleHRtZW51U3RhdGUiLCJnZXRCdWxsZXRTY3JlZW5FdmVudCIsImNsb3NlQ29udGV4dG1lbnUiLCJzZXRQbGF5U3RhdGUiLCJzZXRCdWxsZXRTY3JlZW4iLCJfY29udGV4dG1lbnUiLCJwb3NpdGlvbiIsIm9uY29udGV4dG1lbnUiLCJpc1BhcmVudCIsInBhcmVudEVsZW1lbnQiLCJkb2N1bWVudCIsInBhcmVudE5vZGUiLCJfY2xvc2VDb250ZXh0bWVudSIsImUiLCJ0YXJnZXQiLCJ0eXBlIiwic3RvcFByb3BhZ2F0aW9uIiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsImJpbmQiLCJ0b3AiLCJjbGllbnRZIiwibGVmdCIsImNsaWVudFgiLCJjbGllbnRIZWlnaHQiLCJkb2N1bWVudEVsZW1lbnQiLCJjbGllbnRXaWR0aCIsImdldEJ1bGxldFNjcmVlbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7OztBQUNBOzs7OztJQUtxQkEsVztBQUNqQjs7Ozs7OztBQU9BLHFCQUFZQyxhQUFaLEVBQTJCQyxPQUEzQixFQUE4RDtBQUFBLE1BQTFCQyxLQUEwQix1RUFBbEIsRUFBa0I7QUFBQSxNQUFkQyxLQUFjLHVFQUFOLElBQU07O0FBQUE7O0FBQzFELE1BQ0ksUUFBT0gsYUFBUCxLQUF3QixRQUF4QixJQUNBLFFBQU9DLE9BQVAsS0FBa0IsUUFEbEIsSUFFQSxPQUFPRSxLQUFQLElBQWdCLFNBRmhCLElBR0MsT0FBT0QsS0FBUCxJQUFnQixRQUFoQixJQUE0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WUFBbkIsRUFBaUMsVUFBVU4sQ0FBVixFQUFhO0FBQzFDLFFBQUksQ0FBQ0EsQ0FBQyxDQUFDYyxlQUFGLEdBQW9CdEIsWUFBckIsSUFBcUNiLEtBQXpDLEVBQWdEcUIsQ0FBQyxDQUFDVixZQUFGLENBQWUsSUFBZjtBQUNuRCxHQUZEO0FBR0gsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZXNvdXJjZXMgZnJvbSAnLi9saWIvcmVzb3VyY2VzJ1xuLyoqXG4gKiDkuIrkuIvmlofoj5zljZXnsbtcbiAqIEBhbGlhcyBvcGVuQlNFLkNvbnRleHRtZW51XG4gKiBAZGVzY3JpcHRpb24g5LiK5LiL5paH6I+c5Y2V5a+56LGh44CC55So5LqO5a6e546w5LiA5Liq5by55bmV5LiK5LiL5paH6I+c5Y2V44CCXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRleHRtZW51IHtcbiAgICAvKipcbiAgICAgKiDliJvlu7rlvLnluZXlvJXmk47lr7nosaHnmoTkuIrkuIvmlofoj5zljZXjgIJcbiAgICAgKiBAcGFyYW0ge29wZW5CU0UuQnVsbGV0U2NyZWVuRW5naW5lfSBnZW5lcmFsRW5naW5lIC0g5by55bmV5byV5pOO5a+56LGh77ya5LiA5Liq5by55bmVIHtAbGluayBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZX0g5a+56LGh44CC6KaB5re75Yqg5LiK5LiL5paH6I+c5Y2V55qEXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IC0g5LiK5LiL5paH6I+c5Y2V5YWD57Sg77ya5b2T5pi+56S65LiK5LiL5paH6I+c5Y2V5pe26KaB5pi+56S655qEIGRpdiDjgILmnInlhbMgRWxlbWVudCDmjqXlj6PnmoTkv6Hmga/or7flj4LpmIVNRE4gW0VsZW1lbnRde0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3poLUNOL2RvY3MvV2ViL0FQSS9FbGVtZW50fSDjgIJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2xheWVyPTEwXSAtIOW8ueW5leWxgue6p++8muW9k+aYvuekuuS4iuS4i+aWh+iPnOWNleaIlum8oOagh+aMh+WQkeW8ueW5leaXtuW8ueW5leimgeenu+WKqOWIsOeahOWxgue6p+OAguacieWFs+W8ueW5leWxgue6p+eahOivpue7huivtOaYjuivt+WPgumYhSB7QGxpbmsgb3BlbkJTRX5vcHRpb25zfSDnu5PmnoTjgIJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtwYXVzZT10cnVlXSAtIOaYr+WQpuaaguWBnO+8muW9k+m8oOagh+aMh+WQkeW8ueW5leaIluWNleW8gOS4iuS4i+aWh+iPnOWNleaXtuW8ueW5leaYr+WQpuaaguWBnOenu+WKqC/mkq3mlL7jgIJcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihnZW5lcmFsRW5naW5lLCBlbGVtZW50LCBsYXllciA9IDEwLCBwYXVzZSA9IHRydWUpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdHlwZW9mIGdlbmVyYWxFbmdpbmUgIT0gJ29iamVjdCcgfHxcbiAgICAgICAgICAgIHR5cGVvZiBlbGVtZW50ICE9ICdvYmplY3QnIHx8XG4gICAgICAgICAgICB0eXBlb2YgcGF1c2UgIT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICAgICAodHlwZW9mIGxheWVyICE9ICdudW1iZXInICYmIGxheWVyICE9IG51bGwpXG4gICAgICAgICkgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuUEFSQU1FVEVSU19UWVBFX0VSUk9SKTtcblxuICAgICAgICBlbGVtZW50LmJ1bGxldFNjcmVlbkV2ZW50ID0gbnVsbDtcblxuICAgICAgICBsZXQgX2dldENvbnRleHRtZW51U3RhdGUgPSAoKSA9PiBlbGVtZW50LnN0eWxlLmRpc3BsYXkgIT0gJ25vbmUnO1xuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W5LiK5LiL5paH6I+c5Y2V55qE54q25oCBXG4gICAgICAgICAqIEBmdW5jdGlvblxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0g5oyH56S65LiK5LiL5paH6I+c5Y2V5piv5ZCm5q2j5aSE5LqO5r+A5rS7L+aYvuekuueKtuaAgeOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5nZXRDb250ZXh0bWVudVN0YXRlID0gX2dldENvbnRleHRtZW51U3RhdGU7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bmv4DmtLvkuIrkuIvmlofoj5zljZXnmoTlvLnluZXnmoTlvLnluZXkuovku7bnu5PmnoRcbiAgICAgICAgICogQHJldHVybnMge29wZW5CU0V+QnVsbGV0U2NyZWVuRXZlbnR9IOW8ueW5leS6i+S7tue7k+aehO+8muS4gOS4qiB7QGxpbmsgb3BlbkJTRX5CdWxsZXRTY3JlZW5FdmVudH0g57uT5p6E44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmdldEJ1bGxldFNjcmVlbkV2ZW50ID0gKCkgPT4gZWxlbWVudC5idWxsZXRTY3JlZW5FdmVudDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWFs+mXreS4iuS4i+aWh+iPnOWNle+8muWmguaenOW9k+WJjeS4iuS4i+aWh+iPnOWNleato+WkhOS6jua/gOa0uy/mmL7npLrnirbmgIHliJnnq4vljbPlhbPpl63jgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY2xvc2VDb250ZXh0bWVudSA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmIChfZ2V0Q29udGV4dG1lbnVTdGF0ZSgpKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgIGlmIChwYXVzZSkgZWxlbWVudC5idWxsZXRTY3JlZW5FdmVudC5zZXRQbGF5U3RhdGUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5idWxsZXRTY3JlZW5FdmVudC5zZXRCdWxsZXRTY3JlZW4oeyBfY29udGV4dG1lbnU6IGZhbHNlIH0sIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmJ1bGxldFNjcmVlbkV2ZW50ID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnO1xuICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIGVsZW1lbnQub25jb250ZXh0bWVudSA9ICgpID0+IGZhbHNlO1xuXG4gICAgICAgIGxldCBpc1BhcmVudCA9IChlbGVtZW50LCBwYXJlbnRFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICBkbyBpZiAoZWxlbWVudCA9PT0gcGFyZW50RWxlbWVudCkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB3aGlsZShkb2N1bWVudCAhPSAoZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZSkpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgX2Nsb3NlQ29udGV4dG1lbnUgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgaWYgKF9nZXRDb250ZXh0bWVudVN0YXRlKCkgJiYgIWlzUGFyZW50KGUudGFyZ2V0LGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgIGlmIChwYXVzZSkgZWxlbWVudC5idWxsZXRTY3JlZW5FdmVudC5zZXRQbGF5U3RhdGUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5idWxsZXRTY3JlZW5FdmVudC5zZXRCdWxsZXRTY3JlZW4oeyBfY29udGV4dG1lbnU6IGZhbHNlIH0sIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmJ1bGxldFNjcmVlbkV2ZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAoZS50eXBlID09PSAnY2xpY2snKSBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9jbG9zZUNvbnRleHRtZW51LCB0cnVlKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgX2Nsb3NlQ29udGV4dG1lbnUsIHRydWUpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgX2Nsb3NlQ29udGV4dG1lbnUsIHRydWUpO1xuXG4gICAgICAgIGdlbmVyYWxFbmdpbmUuYmluZCgnY29udGV4dG1lbnUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5zZXRCdWxsZXRTY3JlZW4oeyBsYXllcjogbGF5ZXIsIF9jb250ZXh0bWVudTogdHJ1ZSB9LCBsYXllciAhPSBudWxsKTtcbiAgICAgICAgICAgIGlmIChwYXVzZSkgZS5zZXRQbGF5U3RhdGUoZmFsc2UpO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJyc7XG4gICAgICAgICAgICBsZXQgdG9wID0gZS5jbGllbnRZLCBsZWZ0ID0gZS5jbGllbnRYO1xuICAgICAgICAgICAgaWYgKHRvcCArIGVsZW1lbnQuY2xpZW50SGVpZ2h0ID4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCkgdG9wIC09IGVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgaWYgKGxlZnQgKyBlbGVtZW50LmNsaWVudFdpZHRoID4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoKSBsZWZ0IC09IGVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRvcCA9IGAke3RvcH1weGA7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmxlZnQgPSBgJHtsZWZ0fXB4YDtcbiAgICAgICAgICAgIGVsZW1lbnQuYnVsbGV0U2NyZWVuRXZlbnQgPSBlO1xuICAgICAgICB9KTtcblxuICAgICAgICBnZW5lcmFsRW5naW5lLmJpbmQoJ21vdXNlZW50ZXInLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgaWYgKGxheWVyICE9IG51bGwpIGUuc2V0QnVsbGV0U2NyZWVuKHsgbGF5ZXI6IGxheWVyIH0sIHRydWUpO1xuICAgICAgICAgICAgaWYgKHBhdXNlKSBlLnNldFBsYXlTdGF0ZShmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGdlbmVyYWxFbmdpbmUuYmluZCgnbW91c2VsZWF2ZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpZiAoIWUuZ2V0QnVsbGV0U2NyZWVuKCkuX2NvbnRleHRtZW51ICYmIHBhdXNlKSBlLnNldFBsYXlTdGF0ZSh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4iXSwiZmlsZSI6ImNvbnRleHRtZW51LmpzIn0=
