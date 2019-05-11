"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 渲染器抽象类
 */
var SpecialBaseRenderer =
/**
 * 实例化一个渲染器抽象类
 * @param {object} element - Element 元素
 * @param {openBSE~Options} options - 全局选项
 * @param {object} elementSize - 元素大小
 */
function SpecialBaseRenderer(element, options, elementSize) {
  _classCallCheck(this, SpecialBaseRenderer);

  if ((this instanceof SpecialBaseRenderer ? this.constructor : void 0) === SpecialBaseRenderer) {
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
   * 刷新弹幕样式 
   * @abstract
   * @param {object} realTimeBulletScreen - 实时弹幕对象
   */


  this.refresh = function (realTimeBulletScreen) {
    throw new SyntaxError();
  };
  /**
   * 创建弹幕元素
   * @abstract
   * @param {object} realTimeBulletScreen - 实时弹幕对象
   */


  this.creat = function (realTimeBulletScreen) {
    throw new SyntaxError();
  };
  /**
   * 删除弹幕元素
   * @abstract
   * @param {object} realTimeBulletScreen - 实时弹幕对象
   */


  this["delete"] = function (realTimeBulletScreen) {
    throw new SyntaxError();
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

exports["default"] = SpecialBaseRenderer;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbmRlcmVycy9zcGVjaWFsQmFzZVJlbmRlcmVyLmpzIl0sIm5hbWVzIjpbIlNwZWNpYWxCYXNlUmVuZGVyZXIiLCJlbGVtZW50Iiwib3B0aW9ucyIsImVsZW1lbnRTaXplIiwiU3ludGF4RXJyb3IiLCJpbml0IiwiX2hpZGUiLCJfb3BhY2l0eSIsImNsZWFuU2NyZWVuIiwiaGlkZSIsInN0eWxlIiwidmlzaWJpbGl0eSIsInNob3ciLCJzZXRPcGFjaXR5IiwiX3NldE9wYWNpdHkiLCJvcGFjaXR5IiwiZ2V0T3BhY2l0eSIsImdldFZpc2liaWxpdHkiLCJkcmF3IiwicmVmcmVzaCIsInJlYWxUaW1lQnVsbGV0U2NyZWVuIiwiY3JlYXQiLCJzZXRTaXplIiwid2lkdGgiLCJoZWlnaHQiLCJzY2FsaW5nIiwidHJhbnNmb3JtIiwid2Via2l0VHJhbnNmb3JtIiwibXNUcmFuc2Zvcm0iLCJ0cmFuc2Zvcm1PcmlnaW4iLCJ3ZWJraXRUcmFuc2Zvcm1PcmlnaW4iLCJtc1RyYW5zZm9ybU9yaWdpbiIsInBvc2l0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7OztJQUdxQkEsbUI7QUFDbkI7Ozs7OztBQU1BLDZCQUFZQyxPQUFaLEVBQXFCQyxPQUFyQixFQUE4QkMsV0FBOUIsRUFBMkM7QUFBQTs7QUFDdkMsTUFBSSxzRUFBZUgsbUJBQW5CLEVBQXdDO0FBQ3BDLFVBQU0sSUFBSUksV0FBSixFQUFOO0FBQ0g7O0FBRURDLEVBQUFBLElBQUk7QUFFSjs7Ozs7QUFJQSxNQUFJQyxLQUFLLEdBQUcsS0FBWjtBQUVBOzs7OztBQUlBLE1BQUlDLFFBQVEsR0FBRyxHQUFmO0FBRUE7Ozs7O0FBSUEsT0FBS0MsV0FBTCxHQUFtQixZQUFZO0FBQzNCLFVBQU0sSUFBSUosV0FBSixFQUFOO0FBQ0gsR0FGRDtBQUlBOzs7OztBQUdBLE9BQUtLLElBQUwsR0FBWSxZQUFZO0FBQ3BCSCxJQUFBQSxLQUFLLEdBQUcsSUFBUjtBQUNBTCxJQUFBQSxPQUFPLENBQUNT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qOaKveixoeexu1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcGVjaWFsQmFzZVJlbmRlcmVyIHtcbiAgLyoqXG4gICAqIOWunuS+i+WMluS4gOS4qua4suafk+WZqOaKveixoeexu1xuICAgKiBAcGFyYW0ge29iamVjdH0gZWxlbWVudCAtIEVsZW1lbnQg5YWD57SgXG4gICAqIEBwYXJhbSB7b3BlbkJTRX5PcHRpb25zfSBvcHRpb25zIC0g5YWo5bGA6YCJ6aG5XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBlbGVtZW50U2l6ZSAtIOWFg+e0oOWkp+Wwj1xuICAgKi9cbiAgY29uc3RydWN0b3IoZWxlbWVudCwgb3B0aW9ucywgZWxlbWVudFNpemUpIHtcbiAgICAgIGlmIChuZXcudGFyZ2V0ID09PSBTcGVjaWFsQmFzZVJlbmRlcmVyKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCk7XG4gICAgICB9XG5cbiAgICAgIGluaXQoKTsgLy/liJ3lp4vljJZcblxuICAgICAgLyoqXG4gICAgICAgKiDpmpDol4/lvLnluZVcbiAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtib29sZWFufVxuICAgICAgICovXG4gICAgICBsZXQgX2hpZGUgPSBmYWxzZTtcblxuICAgICAgLyoqXG4gICAgICAgKiDpgI/mmI7luqZcbiAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgKi9cbiAgICAgIGxldCBfb3BhY2l0eSA9IDAuMDtcblxuICAgICAgLyoqXG4gICAgICAgKiDmuIXpmaTlsY/luZXlhoXlrrlcbiAgICAgICAqIEBhYnN0cmFjdFxuICAgICAgICovXG4gICAgICB0aGlzLmNsZWFuU2NyZWVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcigpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIOmakOiXj+W8ueW5leOAglxuICAgICAgICovXG4gICAgICB0aGlzLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgX2hpZGUgPSB0cnVlO1xuICAgICAgICAgIGVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIOaYvuekuuW8ueW5leOAglxuICAgICAgICovXG4gICAgICB0aGlzLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgX2hpZGUgPSBmYWxzZTtcbiAgICAgICAgICBlbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnJztcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiDorr7nva7lvLnluZXkuI3pgI/mmI7luqbjgIJcbiAgICAgICAqL1xuICAgICAgdGhpcy5zZXRPcGFjaXR5ID0gX3NldE9wYWNpdHk7XG5cbiAgICAgIC8qKlxuICAgICAgICog6K6+572u5by55bmV5LiN6YCP5piO5bqm44CCXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIF9zZXRPcGFjaXR5KCkge1xuICAgICAgICAgIGlmIChvcHRpb25zLm9wYWNpdHkgPT09IDEpIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9ICcnO1xuICAgICAgICAgIGVsc2UgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gb3B0aW9ucy5vcGFjaXR5O1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIOiOt+WPluW8ueW5leS4jemAj+aYjuW6puOAglxuICAgICAgICogQHJldHVybnMge251bWJlcn0g5by55bmV5LiN6YCP5piO5bqm77ya5Y+W5YC86IyD5Zu0IDAuMCDliLAgMS4w77yMMC4wIOWFqOmAj+aYju+8mzEuMCDkuI3pgI/mmI7jgIJcbiAgICAgICAqL1xuICAgICAgdGhpcy5nZXRPcGFjaXR5ID0gKCkgPT4gX29wYWNpdHk7XG5cbiAgICAgIC8qKlxuICAgICAgICog6I635Y+W5by55bmV5Y+v6KeB5oCn44CCXG4gICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0g5oyH56S65by55bmV5piv5ZCm5Y+v6KeB44CCXG4gICAgICAgKiBAZGVzY3JpcHRpb24g6I635Y+W5by55bmV5Y+v6KeB5oCn44CCXG4gICAgICAgKi9cbiAgICAgIHRoaXMuZ2V0VmlzaWJpbGl0eSA9ICgpID0+ICFfaGlkZTtcblxuICAgICAgLyoqXG4gICAgICAgKiDnu5jliLblh73mlbBcbiAgICAgICAqIEBhYnN0cmFjdFxuICAgICAgICovXG4gICAgICB0aGlzLmRyYXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICog5Yi35paw5by55bmV5qC35byPIFxuICAgICAgICogQGFic3RyYWN0XG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVhbFRpbWVCdWxsZXRTY3JlZW4gLSDlrp7ml7blvLnluZXlr7nosaFcbiAgICAgICAqL1xuICAgICAgdGhpcy5yZWZyZXNoID0gZnVuY3Rpb24gKHJlYWxUaW1lQnVsbGV0U2NyZWVuKSB7XG4gICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcigpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIOWIm+W7uuW8ueW5leWFg+e0oFxuICAgICAgICogQGFic3RyYWN0XG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVhbFRpbWVCdWxsZXRTY3JlZW4gLSDlrp7ml7blvLnluZXlr7nosaFcbiAgICAgICAqL1xuICAgICAgdGhpcy5jcmVhdCA9IGZ1bmN0aW9uIChyZWFsVGltZUJ1bGxldFNjcmVlbikge1xuICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcigpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIOWIoOmZpOW8ueW5leWFg+e0oFxuICAgICAgICogQGFic3RyYWN0XG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVhbFRpbWVCdWxsZXRTY3JlZW4gLSDlrp7ml7blvLnluZXlr7nosaFcbiAgICAgICAqL1xuICAgICAgdGhpcy5kZWxldGUgPSBmdW5jdGlvbiAocmVhbFRpbWVCdWxsZXRTY3JlZW4pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAqIOiuvue9ruWwuuWvuFxuICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICovXG4gICAgICB0aGlzLnNldFNpemUgPSBzZXRTaXplO1xuXG4gICAgICAvKipcbiAgICAgICAqIOiuvue9ruWwuuWvuFxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gc2V0U2l6ZSgpIHtcbiAgICAgICAgICBlbGVtZW50LnN0eWxlLndpZHRoID0gYCR7ZWxlbWVudFNpemUud2lkdGh9cHhgO1xuICAgICAgICAgIGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7ZWxlbWVudFNpemUuaGVpZ2h0fXB4YDtcbiAgICAgICAgICBpZiAob3B0aW9ucy5zY2FsaW5nICE9IDEpIHtcbiAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPVxuICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPVxuICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5tc1RyYW5zZm9ybSA9IGBzY2FsZSgke29wdGlvbnMuc2NhbGluZ30sJHtvcHRpb25zLnNjYWxpbmd9KWA7XG4gICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNmb3JtT3JpZ2luID1cbiAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUud2Via2l0VHJhbnNmb3JtT3JpZ2luID1cbiAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUubXNUcmFuc2Zvcm1PcmlnaW4gPSBgbGVmdCB0b3BgO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID1cbiAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUud2Via2l0VHJhbnNmb3JtID1cbiAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUubXNUcmFuc2Zvcm0gPVxuICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPVxuICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS53ZWJraXRUcmFuc2Zvcm1PcmlnaW4gPVxuICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5tc1RyYW5zZm9ybU9yaWdpbiA9ICcnO1xuICAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiDliJ3lp4vljJZcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICAgc2V0U2l6ZSgpO1xuICAgICAgICAgIF9zZXRPcGFjaXR5KCk7XG4gICAgICAgICAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgICB9XG4gIH1cbn1cblxuIl0sImZpbGUiOiJyZW5kZXJlcnMvc3BlY2lhbEJhc2VSZW5kZXJlci5qcyJ9
