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


  this.refresh = function (oldStyle, realTimeBulletScreen) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbmRlcmVycy9zcGVjaWFsQmFzZVJlbmRlcmVyLmpzIl0sIm5hbWVzIjpbIlNwZWNpYWxCYXNlUmVuZGVyZXIiLCJlbGVtZW50Iiwib3B0aW9ucyIsImVsZW1lbnRTaXplIiwiU3ludGF4RXJyb3IiLCJpbml0IiwiX2hpZGUiLCJfb3BhY2l0eSIsImNsZWFuU2NyZWVuIiwiaGlkZSIsInN0eWxlIiwidmlzaWJpbGl0eSIsInNob3ciLCJzZXRPcGFjaXR5IiwiX3NldE9wYWNpdHkiLCJvcGFjaXR5IiwiZ2V0T3BhY2l0eSIsImdldFZpc2liaWxpdHkiLCJkcmF3IiwicmVmcmVzaCIsIm9sZFN0eWxlIiwicmVhbFRpbWVCdWxsZXRTY3JlZW4iLCJjcmVhdCIsInNldFNpemUiLCJ3aWR0aCIsImhlaWdodCIsInNjYWxpbmciLCJ0cmFuc2Zvcm0iLCJ3ZWJraXRUcmFuc2Zvcm0iLCJtc1RyYW5zZm9ybSIsInRyYW5zZm9ybU9yaWdpbiIsIndlYmtpdFRyYW5zZm9ybU9yaWdpbiIsIm1zVHJhbnNmb3JtT3JpZ2luIiwicG9zaXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7O0lBR3FCQSxtQjtBQUNuQjs7Ozs7O0FBTUEsNkJBQVlDLE9BQVosRUFBcUJDLE9BQXJCLEVBQThCQyxXQUE5QixFQUEyQztBQUFBOztBQUN2QyxNQUFJLHNFQUFlSCxtQkFBbkIsRUFBd0M7QUFDcEMsVUFBTSxJQUFJSSxXQUFKLEVBQU47QUFDSDs7QUFFREMsRUFBQUEsSUFBSTtBQUVKOzs7OztBQUlBLE1BQUlDLEtBQUssR0FBRyxLQUFaO0FBRUE7Ozs7O0FBSUEsTUFBSUMsUUFBUSxHQUFHLEdBQWY7QUFFQTs7Ozs7QUFJQSxPQUFLQyxXQUFMLEdBQW1CLFlBQVk7QUFDM0IsVUFBTSxJQUFJSixXQUFKLEVBQU47QUFDSCxHQUZEO0FBSUE7Ozs7O0FBR0EsT0FBS0ssSUFBTCxHQUFZLFlBQVk7QUFDcEJILElBQUFBLEtBQUssR0FBRyxJQUFSO0FBQ0FMLElBQUFB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dGVudCI6WyIvKipcbiAqIOa4suafk+WZqOaKveixoeexu1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcGVjaWFsQmFzZVJlbmRlcmVyIHtcbiAgLyoqXG4gICAqIOWunuS+i+WMluS4gOS4qua4suafk+WZqOaKveixoeexu1xuICAgKiBAcGFyYW0ge29iamVjdH0gZWxlbWVudCAtIEVsZW1lbnQg5YWD57SgXG4gICAqIEBwYXJhbSB7b3BlbkJTRX5PcHRpb25zfSBvcHRpb25zIC0g5YWo5bGA6YCJ6aG5XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBlbGVtZW50U2l6ZSAtIOWFg+e0oOWkp+Wwj1xuICAgKi9cbiAgY29uc3RydWN0b3IoZWxlbWVudCwgb3B0aW9ucywgZWxlbWVudFNpemUpIHtcbiAgICAgIGlmIChuZXcudGFyZ2V0ID09PSBTcGVjaWFsQmFzZVJlbmRlcmVyKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCk7XG4gICAgICB9XG5cbiAgICAgIGluaXQoKTsgLy/liJ3lp4vljJZcblxuICAgICAgLyoqXG4gICAgICAgKiDpmpDol4/lvLnluZVcbiAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtib29sZWFufVxuICAgICAgICovXG4gICAgICBsZXQgX2hpZGUgPSBmYWxzZTtcblxuICAgICAgLyoqXG4gICAgICAgKiDpgI/mmI7luqZcbiAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgKi9cbiAgICAgIGxldCBfb3BhY2l0eSA9IDAuMDtcblxuICAgICAgLyoqXG4gICAgICAgKiDmuIXpmaTlsY/luZXlhoXlrrlcbiAgICAgICAqIEBhYnN0cmFjdFxuICAgICAgICovXG4gICAgICB0aGlzLmNsZWFuU2NyZWVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcigpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIOmakOiXj+W8ueW5leOAglxuICAgICAgICovXG4gICAgICB0aGlzLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgX2hpZGUgPSB0cnVlO1xuICAgICAgICAgIGVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIOaYvuekuuW8ueW5leOAglxuICAgICAgICovXG4gICAgICB0aGlzLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgX2hpZGUgPSBmYWxzZTtcbiAgICAgICAgICBlbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnJztcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiDorr7nva7lvLnluZXkuI3pgI/mmI7luqbjgIJcbiAgICAgICAqL1xuICAgICAgdGhpcy5zZXRPcGFjaXR5ID0gX3NldE9wYWNpdHk7XG5cbiAgICAgIC8qKlxuICAgICAgICog6K6+572u5by55bmV5LiN6YCP5piO5bqm44CCXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIF9zZXRPcGFjaXR5KCkge1xuICAgICAgICAgIGlmIChvcHRpb25zLm9wYWNpdHkgPT09IDEpIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9ICcnO1xuICAgICAgICAgIGVsc2UgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gb3B0aW9ucy5vcGFjaXR5O1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIOiOt+WPluW8ueW5leS4jemAj+aYjuW6puOAglxuICAgICAgICogQHJldHVybnMge251bWJlcn0g5by55bmV5LiN6YCP5piO5bqm77ya5Y+W5YC86IyD5Zu0IDAuMCDliLAgMS4w77yMMC4wIOWFqOmAj+aYju+8mzEuMCDkuI3pgI/mmI7jgIJcbiAgICAgICAqL1xuICAgICAgdGhpcy5nZXRPcGFjaXR5ID0gKCkgPT4gX29wYWNpdHk7XG5cbiAgICAgIC8qKlxuICAgICAgICog6I635Y+W5by55bmV5Y+v6KeB5oCn44CCXG4gICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0g5oyH56S65by55bmV5piv5ZCm5Y+v6KeB44CCXG4gICAgICAgKiBAZGVzY3JpcHRpb24g6I635Y+W5by55bmV5Y+v6KeB5oCn44CCXG4gICAgICAgKi9cbiAgICAgIHRoaXMuZ2V0VmlzaWJpbGl0eSA9ICgpID0+ICFfaGlkZTtcblxuICAgICAgLyoqXG4gICAgICAgKiDnu5jliLblh73mlbBcbiAgICAgICAqIEBhYnN0cmFjdFxuICAgICAgICovXG4gICAgICB0aGlzLmRyYXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICog5Yi35paw5by55bmV5qC35byPIFxuICAgICAgICogQGFic3RyYWN0XG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVhbFRpbWVCdWxsZXRTY3JlZW4gLSDlrp7ml7blvLnluZXlr7nosaFcbiAgICAgICAqL1xuICAgICAgdGhpcy5yZWZyZXNoID0gZnVuY3Rpb24gKG9sZFN0eWxlLCByZWFsVGltZUJ1bGxldFNjcmVlbikge1xuICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiDliJvlu7rlvLnluZXlhYPntKBcbiAgICAgICAqIEBhYnN0cmFjdFxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IHJlYWxUaW1lQnVsbGV0U2NyZWVuIC0g5a6e5pe25by55bmV5a+56LGhXG4gICAgICAgKi9cbiAgICAgIHRoaXMuY3JlYXQgPSBmdW5jdGlvbiAocmVhbFRpbWVCdWxsZXRTY3JlZW4pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiDliKDpmaTlvLnluZXlhYPntKBcbiAgICAgICAqIEBhYnN0cmFjdFxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IHJlYWxUaW1lQnVsbGV0U2NyZWVuIC0g5a6e5pe25by55bmV5a+56LGhXG4gICAgICAgKi9cbiAgICAgIHRoaXMuZGVsZXRlID0gZnVuY3Rpb24gKHJlYWxUaW1lQnVsbGV0U2NyZWVuKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgKiDorr7nva7lsLrlr7hcbiAgICAgICogQGZ1bmN0aW9uXG4gICAgICAqL1xuICAgICAgdGhpcy5zZXRTaXplID0gc2V0U2l6ZTtcblxuICAgICAgLyoqXG4gICAgICAgKiDorr7nva7lsLrlr7hcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIHNldFNpemUoKSB7XG4gICAgICAgICAgZWxlbWVudC5zdHlsZS53aWR0aCA9IGAke2VsZW1lbnRTaXplLndpZHRofXB4YDtcbiAgICAgICAgICBlbGVtZW50LnN0eWxlLmhlaWdodCA9IGAke2VsZW1lbnRTaXplLmhlaWdodH1weGA7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuc2NhbGluZyAhPSAxKSB7XG4gICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID1cbiAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUud2Via2l0VHJhbnNmb3JtID1cbiAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUubXNUcmFuc2Zvcm0gPSBgc2NhbGUoJHtvcHRpb25zLnNjYWxpbmd9LCR7b3B0aW9ucy5zY2FsaW5nfSlgO1xuICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9XG4gICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLndlYmtpdFRyYW5zZm9ybU9yaWdpbiA9XG4gICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLm1zVHJhbnNmb3JtT3JpZ2luID0gYGxlZnQgdG9wYDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9XG4gICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9XG4gICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLm1zVHJhbnNmb3JtID1cbiAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNmb3JtT3JpZ2luID1cbiAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUud2Via2l0VHJhbnNmb3JtT3JpZ2luID1cbiAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUubXNUcmFuc2Zvcm1PcmlnaW4gPSAnJztcbiAgICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICog5Yid5aeL5YyWXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAgIHNldFNpemUoKTtcbiAgICAgICAgICBfc2V0T3BhY2l0eSgpO1xuICAgICAgICAgIGVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgICAgfVxuICB9XG59XG5cbiJdLCJmaWxlIjoicmVuZGVyZXJzL3NwZWNpYWxCYXNlUmVuZGVyZXIuanMifQ==
