"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseRenderer = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 渲染器抽象类
 */
var BaseRenderer =
/**
 * 实例化一个渲染器抽象类
 * @param {object} element - Element 元素
 * @param {openBSE~Options} options - 全局选项
 * @param {object} elementSize - 元素大小
 */
function BaseRenderer(element, options, elementSize) {
  _classCallCheck(this, BaseRenderer);

  if ((this instanceof BaseRenderer ? this.constructor : void 0) === BaseRenderer) {
    throw new SyntaxError();
  }

  init();
  /**
   * 隐藏弹幕
   * @private @type {boolean}
   */

  var _hide = false;
  /**
   * 透明度
   * @private @type {number}
   */

  var _opacity = 0.0;
  /**
   * 清除屏幕内容
   * @abstract
   */

  this.cleanScreen = function () {
    throw new SyntaxError();
  };
  /**
   * 隐藏弹幕。
   */


  this.hide = function () {
    _hide = true;
    element.style.visibility = 'hidden';
  };
  /**
   * 显示弹幕。
   */


  this.show = function () {
    _hide = false;
    element.style.visibility = '';
  };
  /**
   * 设置弹幕不透明度。
   */


  this.setOpacity = _setOpacity;
  /**
   * 设置弹幕不透明度。
   */

  function _setOpacity() {
    if (options.opacity === 1) element.style.opacity = '';else element.style.opacity = options.opacity;
  }
  /**
   * 获取弹幕不透明度。
   * @returns {number} 弹幕不透明度：取值范围 0.0 到 1.0，0.0 全透明；1.0 不透明。
   */


  this.getOpacity = function () {
    return _opacity;
  };
  /**
   * 获取弹幕可见性。
   * @returns {boolean} 指示弹幕是否可见。
   * @description 获取弹幕可见性。
   */


  this.getVisibility = function () {
    return !_hide;
  };
  /**
   * 绘制函数
   * @abstract
   */


  this.draw = function () {
    throw new SyntaxError();
  };
  /**
   * 创建弹幕元素
   * @abstract
   * @param {object} bulletScreenOnScreen - 屏幕弹幕对象
   */


  this.creatAndgetWidth = function (bulletScreenOnScreen) {
    throw new SyntaxError();
  };
  /**
   * 删除弹幕元素
   * @abstract
   * @param {object} bulletScreenOnScreen - 屏幕弹幕对象
   */


  this.delete = function (bulletScreenOnScreen) {
    throw new SyntaxError();
  };
  /**
   * 重新添加弹幕
   * @abstract
   * @param {object} bulletScreenOnScreen - 屏幕弹幕对象
   */


  this.reCreatAndgetWidth = function (bulletScreenOnScreen) {
    throw new SyntaxError();
  };
  /**
   * 检查弹幕是否被隐藏
   * @param {object} bulletScreenOnScreen - 屏幕弹幕对象
   */


  this.checkWhetherHide = function (bulletScreenOnScreen) {
    return (bulletScreenOnScreen.bulletScreen.type & options.hiddenTypes) === bulletScreenOnScreen.bulletScreen.type;
  };
  /**
  * 设置尺寸
  * @function
  */


  this.setSize = setSize;
  /**
   * 设置尺寸
   * @private
   */

  function setSize() {
    element.style.width = "".concat(elementSize.width, "px");
    element.style.height = "".concat(elementSize.height, "px");

    if (options.scaling != 1) {
      element.style.transform = element.style.webkitTransform = element.style.msTransform = "scale(".concat(options.scaling, ",").concat(options.scaling, ")");
      element.style.transformOrigin = element.style.webkitTransformOrigin = element.style.msTransformOrigin = "left top";
    } else {
      element.style.transform = element.style.webkitTransform = element.style.msTransform = element.style.transformOrigin = element.style.webkitTransformOrigin = element.style.msTransformOrigin = '';
    }
  }
  /**
   * 初始化
   * @private
   */


  function init() {
    setSize();

    _setOpacity();

    element.style.position = 'relative';
  }
};

exports.BaseRenderer = BaseRenderer;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9yZW5kZXJlcnMvYmFzZVJlbmRlcmVyLmpzIl0sIm5hbWVzIjpbIkJhc2VSZW5kZXJlciIsImVsZW1lbnQiLCJvcHRpb25zIiwiZWxlbWVudFNpemUiLCJTeW50YXhFcnJvciIsImluaXQiLCJfaGlkZSIsIl9vcGFjaXR5IiwiY2xlYW5TY3JlZW4iLCJoaWRlIiwic3R5bGUiLCJ2aXNpYmlsaXR5Iiwic2hvdyIsInNldE9wYWNpdHkiLCJfc2V0T3BhY2l0eSIsIm9wYWNpdHkiLCJnZXRPcGFjaXR5IiwiZ2V0VmlzaWJpbGl0eSIsImRyYXciLCJjcmVhdEFuZGdldFdpZHRoIiwiYnVsbGV0U2NyZWVuT25TY3JlZW4iLCJkZWxldGUiLCJyZUNyZWF0QW5kZ2V0V2lkdGgiLCJjaGVja1doZXRoZXJIaWRlIiwiYnVsbGV0U2NyZWVuIiwidHlwZSIsImhpZGRlblR5cGVzIiwic2V0U2l6ZSIsIndpZHRoIiwiaGVpZ2h0Iiwic2NhbGluZyIsInRyYW5zZm9ybSIsIndlYmtpdFRyYW5zZm9ybSIsIm1zVHJhbnNmb3JtIiwidHJhbnNmb3JtT3JpZ2luIiwid2Via2l0VHJhbnNmb3JtT3JpZ2luIiwibXNUcmFuc2Zvcm1PcmlnaW4iLCJwb3NpdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7O0lBR01BLFk7QUFDRjs7Ozs7O0FBTUEsc0JBQVlDLE9BQVosRUFBcUJDLE9BQXJCLEVBQThCQyxXQUE5QixFQUEyQztBQUFBOztBQUN2QyxNQUFJLCtEQUFlSCxZQUFuQixFQUFpQztBQUM3QixVQUFNLElBQUlJLFdBQUosRUFBTjtBQUNIOztBQUVEQyxFQUFBQSxJQUFJO0FBRUo7Ozs7O0FBSUEsTUFBSUMsS0FBSyxHQUFHLEtBQVo7QUFFQTs7Ozs7QUFJQSxNQUFJQyxRQUFRLEdBQUcsR0FBZjtBQUVBOzs7OztBQUlBLE9BQUtDLFdBQUwsR0FBbUIsWUFBWTtBQUMzQixVQUFNLElBQUlKLFdBQUosRUFBTjtBQUNILEdBRkQ7QUFJQTs7Ozs7QUFHQSxP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QUFPLENBQUNTLEtBQVIsQ0FBY3lCLHFCQUFkLEdBQ0FsQyxPQUFPLENBQUNTLEtBQVIsQ0FBYzBCLGlCQUFkLEdBQWtDLEVBTHRDO0FBTUg7QUFDSjtBQUVEOzs7Ozs7QUFJQSxXQUFTL0IsSUFBVCxHQUFnQjtBQUNac0IsSUFBQUEsT0FBTzs7QUFDUGIsSUFBQUEsV0FBVzs7QUFDWGIsSUFBQUEsT0FBTyxDQUFDUyxLQUFSLENBQWMyQixRQUFkLEdBQXlCLFVBQXpCO0FBQ0g7QUFDSixDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiDmuLLmn5Plmajmir3osaHnsbtcbiAqL1xuY2xhc3MgQmFzZVJlbmRlcmVyIHtcbiAgICAvKipcbiAgICAgKiDlrp7kvovljJbkuIDkuKrmuLLmn5Plmajmir3osaHnsbtcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZWxlbWVudCAtIEVsZW1lbnQg5YWD57SgXG4gICAgICogQHBhcmFtIHtvcGVuQlNFfk9wdGlvbnN9IG9wdGlvbnMgLSDlhajlsYDpgInpoblcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZWxlbWVudFNpemUgLSDlhYPntKDlpKflsI9cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBvcHRpb25zLCBlbGVtZW50U2l6ZSkge1xuICAgICAgICBpZiAobmV3LnRhcmdldCA9PT0gQmFzZVJlbmRlcmVyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQoKTsgLy/liJ3lp4vljJZcblxuICAgICAgICAvKipcbiAgICAgICAgICog6ZqQ6JeP5by55bmVXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtib29sZWFufVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9oaWRlID0gZmFsc2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOmAj+aYjuW6plxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9vcGFjaXR5ID0gMC4wO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmuIXpmaTlsY/luZXlhoXlrrlcbiAgICAgICAgICogQGFic3RyYWN0XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmNsZWFuU2NyZWVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog6ZqQ6JeP5by55bmV44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfaGlkZSA9IHRydWU7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmmL7npLrlvLnluZXjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF9oaWRlID0gZmFsc2U7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDorr7nva7lvLnluZXkuI3pgI/mmI7luqbjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc2V0T3BhY2l0eSA9IF9zZXRPcGFjaXR5O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDorr7nva7lvLnluZXkuI3pgI/mmI7luqbjgIJcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9zZXRPcGFjaXR5KCkge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMub3BhY2l0eSA9PT0gMSkgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gJyc7XG4gICAgICAgICAgICBlbHNlIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IG9wdGlvbnMub3BhY2l0eTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5blvLnluZXkuI3pgI/mmI7luqbjgIJcbiAgICAgICAgICogQHJldHVybnMge251bWJlcn0g5by55bmV5LiN6YCP5piO5bqm77ya5Y+W5YC86IyD5Zu0IDAuMCDliLAgMS4w77yMMC4wIOWFqOmAj+aYju+8mzEuMCDkuI3pgI/mmI7jgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZ2V0T3BhY2l0eSA9ICgpID0+IF9vcGFjaXR5O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5blvLnluZXlj6/op4HmgKfjgIJcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IOaMh+ekuuW8ueW5leaYr+WQpuWPr+ingeOAglxuICAgICAgICAgKiBAZGVzY3JpcHRpb24g6I635Y+W5by55bmV5Y+v6KeB5oCn44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmdldFZpc2liaWxpdHkgPSAoKSA9PiAhX2hpZGU7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOe7mOWItuWHveaVsFxuICAgICAgICAgKiBAYWJzdHJhY3RcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZHJhdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWIm+W7uuW8ueW5leWFg+e0oFxuICAgICAgICAgKiBAYWJzdHJhY3RcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGJ1bGxldFNjcmVlbk9uU2NyZWVuIC0g5bGP5bmV5by55bmV5a+56LGhXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmNyZWF0QW5kZ2V0V2lkdGggPSBmdW5jdGlvbiAoYnVsbGV0U2NyZWVuT25TY3JlZW4pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWIoOmZpOW8ueW5leWFg+e0oFxuICAgICAgICAgKiBAYWJzdHJhY3RcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGJ1bGxldFNjcmVlbk9uU2NyZWVuIC0g5bGP5bmV5by55bmV5a+56LGhXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmRlbGV0ZSA9IGZ1bmN0aW9uIChidWxsZXRTY3JlZW5PblNjcmVlbikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog6YeN5paw5re75Yqg5by55bmVXG4gICAgICAgICAqIEBhYnN0cmFjdFxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gYnVsbGV0U2NyZWVuT25TY3JlZW4gLSDlsY/luZXlvLnluZXlr7nosaFcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucmVDcmVhdEFuZGdldFdpZHRoID0gZnVuY3Rpb24gKGJ1bGxldFNjcmVlbk9uU2NyZWVuKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmo4Dmn6XlvLnluZXmmK/lkKbooqvpmpDol49cbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGJ1bGxldFNjcmVlbk9uU2NyZWVuIC0g5bGP5bmV5by55bmV5a+56LGhXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmNoZWNrV2hldGhlckhpZGUgPSAoYnVsbGV0U2NyZWVuT25TY3JlZW4pID0+IChidWxsZXRTY3JlZW5PblNjcmVlbi5idWxsZXRTY3JlZW4udHlwZSAmIG9wdGlvbnMuaGlkZGVuVHlwZXMpID09PSBidWxsZXRTY3JlZW5PblNjcmVlbi5idWxsZXRTY3JlZW4udHlwZTtcblxuICAgICAgICAvKipcbiAgICAgICAgKiDorr7nva7lsLrlr7hcbiAgICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAgKi9cbiAgICAgICAgdGhpcy5zZXRTaXplID0gc2V0U2l6ZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog6K6+572u5bC65a+4XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBzZXRTaXplKCkge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS53aWR0aCA9IGAke2VsZW1lbnRTaXplLndpZHRofXB4YDtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7ZWxlbWVudFNpemUuaGVpZ2h0fXB4YDtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNjYWxpbmcgIT0gMSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID1cbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPVxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLm1zVHJhbnNmb3JtID0gYHNjYWxlKCR7b3B0aW9ucy5zY2FsaW5nfSwke29wdGlvbnMuc2NhbGluZ30pYDtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUud2Via2l0VHJhbnNmb3JtT3JpZ2luID1cbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5tc1RyYW5zZm9ybU9yaWdpbiA9IGBsZWZ0IHRvcGA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID1cbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPVxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLm1zVHJhbnNmb3JtID1cbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPVxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLndlYmtpdFRyYW5zZm9ybU9yaWdpbiA9XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUubXNUcmFuc2Zvcm1PcmlnaW4gPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliJ3lp4vljJZcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICAgICBzZXRTaXplKCk7XG4gICAgICAgICAgICBfc2V0T3BhY2l0eSgpO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7IEJhc2VSZW5kZXJlciB9OyJdLCJmaWxlIjoibGliL3JlbmRlcmVycy9iYXNlUmVuZGVyZXIuanMifQ==
