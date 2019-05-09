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
 * @param {openBSE.BulletScreenEngine} bulletScreenEngine - 弹幕引擎对象：一个弹幕 {@link openBSE.BulletScreenEngine} 对象。要添加上下文菜单的
 * @param {Element} element - 上下文菜单元素：当显示上下文菜单时要显示的 div 。有关 Element 接口的信息请参阅MDN [Element]{@link https://developer.mozilla.org/zh-CN/docs/Web/API/Element} 。
 * @param {number} [layer=10] - 弹幕层级：当显示上下文菜单或鼠标指向弹幕时弹幕要移动到的层级。有关弹幕层级的详细说明请参阅 {@link openBSE~options} 结构。
 * @param {boolean} [pause=true] - 是否暂停：当鼠标指向弹幕或单开上下文菜单时弹幕是否暂停移动/播放。
 */
function Contextmenu(bulletScreenEngine, element) {
  var layer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  var pause = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  _classCallCheck(this, Contextmenu);

  if (_typeof(bulletScreenEngine) != 'object' || _typeof(element) != 'object' || typeof pause != 'boolean' || typeof layer != 'number' && layer != null) throw new TypeError(_resources["default"].PARAMETERS_TYPE_ERROR);
  element.bulletScreenEvent = null;

  var _getContextmenuState = function _getContextmenuState() {
    return contextmenu.style.display != 'none';
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

  var _closeContextmenu = function _closeContextmenu(e) {
    if (_getContextmenuState() && e.target != element) {
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
  bulletScreenEngine.bind('contextmenu', function (e) {
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
  bulletScreenEngine.bind('mouseenter', function (e) {
    if (layer != null) e.setBulletScreen({
      layer: layer
    }, true);
    if (pause) e.setPlayState(false);
  });
  bulletScreenEngine.bind('mouseleave', function (e) {
    if (!e.getBulletScreen()._contextmenu && pause) e.setPlayState(true);
  });
};

exports["default"] = Contextmenu;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRleHRtZW51LmpzIl0sIm5hbWVzIjpbIkNvbnRleHRtZW51IiwiYnVsbGV0U2NyZWVuRW5naW5lIiwiZWxlbWVudCIsImxheWVyIiwicGF1c2UiLCJUeXBlRXJyb3IiLCJSZXNvdXJjZXMiLCJQQVJBTUVURVJTX1RZUEVfRVJST1IiLCJidWxsZXRTY3JlZW5FdmVudCIsIl9nZXRDb250ZXh0bWVudVN0YXRlIiwiY29udGV4dG1lbnUiLCJzdHlsZSIsImRpc3BsYXkiLCJnZXRDb250ZXh0bWVudVN0YXRlIiwiZ2V0QnVsbGV0U2NyZWVuRXZlbnQiLCJjbG9zZUNvbnRleHRtZW51Iiwic2V0UGxheVN0YXRlIiwic2V0QnVsbGV0U2NyZWVuIiwiX2NvbnRleHRtZW51IiwicG9zaXRpb24iLCJvbmNvbnRleHRtZW51IiwiX2Nsb3NlQ29udGV4dG1lbnUiLCJlIiwidGFyZ2V0IiwidHlwZSIsInN0b3BQcm9wYWdhdGlvbiIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJiaW5kIiwidG9wIiwiY2xpZW50WSIsImxlZnQiLCJjbGllbnRYIiwiY2xpZW50SGVpZ2h0IiwiZG9jdW1lbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJjbGllbnRXaWR0aCIsImdldEJ1bGxldFNjcmVlbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7OztBQUNBOzs7OztJQUtxQkEsVztBQUNqQjs7Ozs7OztBQU9BLHFCQUFZQyxrQkFBWixFQUFnQ0MsT0FBaEMsRUFBbUU7QUFBQSxNQUExQkMsS0FBMEIsdUVBQWxCLEVBQWtCO0FBQUEsTUFBZEMsS0FBYyx1RUFBTixJQUFNOztBQUFBOztBQUMvRCxNQUNJLFFBQU9ILGtCQUFQLEtBQTZCLFFBQTdCLElBQ0EsUUFBT0MsT0FBUCxLQUFrQixRQURsQixJQUVBLE9BQU9FLEtBQVAsSUFBZ0IsU0FGaEIsSUFHQyxPQUFPRCxLQUFQLElBQWdCLFFBQWhCLElBQTRCQSxLQUFLLElBQUksSUFKMUMs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LENBQUNVLE9BQTlCO0FBQ0EsUUFBSUgsR0FBRyxHQUFHM0IsT0FBTyxDQUFDK0IsWUFBZCxHQUE2QkMsUUFBUSxDQUFDQyxlQUFULENBQXlCRixZQUExRCxFQUF3RUosR0FBRyxJQUFJM0IsT0FBTyxDQUFDK0IsWUFBZjtBQUN4RSxRQUFJRixJQUFJLEdBQUc3QixPQUFPLENBQUNrQyxXQUFmLEdBQTZCRixRQUFRLENBQUNDLGVBQVQsQ0FBeUJDLFdBQTFELEVBQXVFTCxJQUFJLElBQUk3QixPQUFPLENBQUNrQyxXQUFoQjtBQUN2RWxDLElBQUFBLE9BQU8sQ0FBQ1MsS0FBUixDQUFja0IsR0FBZCxhQUF1QkEsR0FBdkI7QUFDQTNCLElBQUFBLE9BQU8sQ0FBQ1MsS0FBUixDQUFjb0IsSUFBZCxhQUF3QkEsSUFBeEI7QUFDQTdCLElBQUFBLE9BQU8sQ0FBQ00saUJBQVIsR0FBNEJjLENBQTVCO0FBQ0gsR0FWRDtBQVlBckIsRUFBQUEsa0JBQWtCLENBQUMyQixJQUFuQixDQUF3QixZQUF4QixFQUFzQyxVQUFVTixDQUFWLEVBQWE7QUFDL0MsUUFBSW5CLEtBQUssSUFBSSxJQUFiLEVBQW1CbUIsQ0FBQyxDQUFDTCxlQUFGLENBQWtCO0FBQUVkLE1BQUFBLEtBQUssRUFBRUE7QUFBVCxLQUFsQixFQUFvQyxJQUFwQztBQUNuQixRQUFJQyxLQUFKLEVBQVdrQixDQUFDLENBQUNOLFlBQUYsQ0FBZSxLQUFmO0FBQ2QsR0FIRDtBQUtBZixFQUFBQSxrQkFBa0IsQ0FBQzJCLElBQW5CLENBQXdCLFlBQXhCLEVBQXNDLFVBQVVOLENBQVYsRUFBYTtBQUMvQyxRQUFJLENBQUNBLENBQUMsQ0FBQ2UsZUFBRixHQUFvQm5CLFlBQXJCLElBQXFDZCxLQUF6QyxFQUFnRGtCLENBQUMsQ0FBQ04sWUFBRixDQUFlLElBQWY7QUFDbkQsR0FGRDtBQUdILEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVzb3VyY2VzIGZyb20gJy4vbGliL3Jlc291cmNlcydcbi8qKlxuICog5LiK5LiL5paH6I+c5Y2V57G7XG4gKiBAYWxpYXMgb3BlbkJTRS5Db250ZXh0bWVudVxuICogQGRlc2NyaXB0aW9uIOS4iuS4i+aWh+iPnOWNleWvueixoeOAgueUqOS6juWunueOsOS4gOS4quW8ueW5leS4iuS4i+aWh+iPnOWNleOAglxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZXh0bWVudSB7XG4gICAgLyoqXG4gICAgICog5Yib5bu65by55bmV5byV5pOO5a+56LGh55qE5LiK5LiL5paH6I+c5Y2V44CCXG4gICAgICogQHBhcmFtIHtvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZX0gYnVsbGV0U2NyZWVuRW5naW5lIC0g5by55bmV5byV5pOO5a+56LGh77ya5LiA5Liq5by55bmVIHtAbGluayBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZX0g5a+56LGh44CC6KaB5re75Yqg5LiK5LiL5paH6I+c5Y2V55qEXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IC0g5LiK5LiL5paH6I+c5Y2V5YWD57Sg77ya5b2T5pi+56S65LiK5LiL5paH6I+c5Y2V5pe26KaB5pi+56S655qEIGRpdiDjgILmnInlhbMgRWxlbWVudCDmjqXlj6PnmoTkv6Hmga/or7flj4LpmIVNRE4gW0VsZW1lbnRde0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3poLUNOL2RvY3MvV2ViL0FQSS9FbGVtZW50fSDjgIJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2xheWVyPTEwXSAtIOW8ueW5leWxgue6p++8muW9k+aYvuekuuS4iuS4i+aWh+iPnOWNleaIlum8oOagh+aMh+WQkeW8ueW5leaXtuW8ueW5leimgeenu+WKqOWIsOeahOWxgue6p+OAguacieWFs+W8ueW5leWxgue6p+eahOivpue7huivtOaYjuivt+WPgumYhSB7QGxpbmsgb3BlbkJTRX5vcHRpb25zfSDnu5PmnoTjgIJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtwYXVzZT10cnVlXSAtIOaYr+WQpuaaguWBnO+8muW9k+m8oOagh+aMh+WQkeW8ueW5leaIluWNleW8gOS4iuS4i+aWh+iPnOWNleaXtuW8ueW5leaYr+WQpuaaguWBnOenu+WKqC/mkq3mlL7jgIJcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihidWxsZXRTY3JlZW5FbmdpbmUsIGVsZW1lbnQsIGxheWVyID0gMTAsIHBhdXNlID0gdHJ1ZSkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0eXBlb2YgYnVsbGV0U2NyZWVuRW5naW5lICE9ICdvYmplY3QnIHx8XG4gICAgICAgICAgICB0eXBlb2YgZWxlbWVudCAhPSAnb2JqZWN0JyB8fFxuICAgICAgICAgICAgdHlwZW9mIHBhdXNlICE9ICdib29sZWFuJyB8fFxuICAgICAgICAgICAgKHR5cGVvZiBsYXllciAhPSAnbnVtYmVyJyAmJiBsYXllciAhPSBudWxsKVxuICAgICAgICApIHRocm93IG5ldyBUeXBlRXJyb3IoUmVzb3VyY2VzLlBBUkFNRVRFUlNfVFlQRV9FUlJPUik7XG5cbiAgICAgICAgZWxlbWVudC5idWxsZXRTY3JlZW5FdmVudCA9IG51bGw7XG5cbiAgICAgICAgbGV0IF9nZXRDb250ZXh0bWVudVN0YXRlID0gKCkgPT4gY29udGV4dG1lbnUuc3R5bGUuZGlzcGxheSAhPSAnbm9uZSc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bkuIrkuIvmlofoj5zljZXnmoTnirbmgIFcbiAgICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSDmjIfnpLrkuIrkuIvmlofoj5zljZXmmK/lkKbmraPlpITkuo7mv4DmtLsv5pi+56S654q25oCB44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmdldENvbnRleHRtZW51U3RhdGUgPSBfZ2V0Q29udGV4dG1lbnVTdGF0ZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPlua/gOa0u+S4iuS4i+aWh+iPnOWNleeahOW8ueW5leeahOW8ueW5leS6i+S7tue7k+aehFxuICAgICAgICAgKiBAcmV0dXJucyB7b3BlbkJTRX5CdWxsZXRTY3JlZW5FdmVudH0g5by55bmV5LqL5Lu257uT5p6E77ya5LiA5LiqIHtAbGluayBvcGVuQlNFfkJ1bGxldFNjcmVlbkV2ZW50fSDnu5PmnoTjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZ2V0QnVsbGV0U2NyZWVuRXZlbnQgPSAoKSA9PiBlbGVtZW50LmJ1bGxldFNjcmVlbkV2ZW50O1xuICAgICAgICAvKipcbiAgICAgICAgICog5YWz6Zet5LiK5LiL5paH6I+c5Y2V77ya5aaC5p6c5b2T5YmN5LiK5LiL5paH6I+c5Y2V5q2j5aSE5LqO5r+A5rS7L+aYvuekuueKtuaAgeWImeeri+WNs+WFs+mXreOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jbG9zZUNvbnRleHRtZW51ID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKF9nZXRDb250ZXh0bWVudVN0YXRlKCkpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgaWYgKHBhdXNlKSBlbGVtZW50LmJ1bGxldFNjcmVlbkV2ZW50LnNldFBsYXlTdGF0ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmJ1bGxldFNjcmVlbkV2ZW50LnNldEJ1bGxldFNjcmVlbih7IF9jb250ZXh0bWVudTogZmFsc2UgfSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYnVsbGV0U2NyZWVuRXZlbnQgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgZWxlbWVudC5vbmNvbnRleHRtZW51ID0gKCkgPT4gZmFsc2U7XG5cbiAgICAgICAgbGV0IF9jbG9zZUNvbnRleHRtZW51ID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGlmIChfZ2V0Q29udGV4dG1lbnVTdGF0ZSgpICYmIGUudGFyZ2V0ICE9IGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgaWYgKHBhdXNlKSBlbGVtZW50LmJ1bGxldFNjcmVlbkV2ZW50LnNldFBsYXlTdGF0ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmJ1bGxldFNjcmVlbkV2ZW50LnNldEJ1bGxldFNjcmVlbih7IF9jb250ZXh0bWVudTogZmFsc2UgfSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYnVsbGV0U2NyZWVuRXZlbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgIGlmIChlLnR5cGUgPT09ICdjbGljaycpIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX2Nsb3NlQ29udGV4dG1lbnUsIHRydWUpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBfY2xvc2VDb250ZXh0bWVudSwgdHJ1ZSk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBfY2xvc2VDb250ZXh0bWVudSwgdHJ1ZSk7XG5cbiAgICAgICAgYnVsbGV0U2NyZWVuRW5naW5lLmJpbmQoJ2NvbnRleHRtZW51JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUuc2V0QnVsbGV0U2NyZWVuKHsgbGF5ZXI6IGxheWVyLCBfY29udGV4dG1lbnU6IHRydWUgfSwgbGF5ZXIgIT0gbnVsbCk7XG4gICAgICAgICAgICBpZiAocGF1c2UpIGUuc2V0UGxheVN0YXRlKGZhbHNlKTtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgICAgICAgbGV0IHRvcCA9IGUuY2xpZW50WSwgbGVmdCA9IGUuY2xpZW50WDtcbiAgICAgICAgICAgIGlmICh0b3AgKyBlbGVtZW50LmNsaWVudEhlaWdodCA+IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQpIHRvcCAtPSBlbGVtZW50LmNsaWVudEhlaWdodDtcbiAgICAgICAgICAgIGlmIChsZWZ0ICsgZWxlbWVudC5jbGllbnRXaWR0aCA+IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCkgbGVmdCAtPSBlbGVtZW50LmNsaWVudFdpZHRoO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50b3AgPSBgJHt0b3B9cHhgO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7bGVmdH1weGA7XG4gICAgICAgICAgICBlbGVtZW50LmJ1bGxldFNjcmVlbkV2ZW50ID0gZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYnVsbGV0U2NyZWVuRW5naW5lLmJpbmQoJ21vdXNlZW50ZXInLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgaWYgKGxheWVyICE9IG51bGwpIGUuc2V0QnVsbGV0U2NyZWVuKHsgbGF5ZXI6IGxheWVyIH0sIHRydWUpO1xuICAgICAgICAgICAgaWYgKHBhdXNlKSBlLnNldFBsYXlTdGF0ZShmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGJ1bGxldFNjcmVlbkVuZ2luZS5iaW5kKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGlmICghZS5nZXRCdWxsZXRTY3JlZW4oKS5fY29udGV4dG1lbnUgJiYgcGF1c2UpIGUuc2V0UGxheVN0YXRlKHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbiJdLCJmaWxlIjoiY29udGV4dG1lbnUuanMifQ==
