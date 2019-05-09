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
var GeneralBaseRenderer =
/**
 * 实例化一个渲染器抽象类
 * @param {object} element - Element 元素
 * @param {openBSE~Options} options - 全局选项
 * @param {object} elementSize - 元素大小
 */
function GeneralBaseRenderer(element, options, elementSize) {
  _classCallCheck(this, GeneralBaseRenderer);

  if ((this instanceof GeneralBaseRenderer ? this.constructor : void 0) === GeneralBaseRenderer) {
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


  this["delete"] = function (bulletScreenOnScreen) {
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

exports["default"] = GeneralBaseRenderer;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbmRlcmVycy9nZW5lcmFsQmFzZVJlbmRlcmVyLmpzIl0sIm5hbWVzIjpbIkdlbmVyYWxCYXNlUmVuZGVyZXIiLCJlbGVtZW50Iiwib3B0aW9ucyIsImVsZW1lbnRTaXplIiwiU3ludGF4RXJyb3IiLCJpbml0IiwiX2hpZGUiLCJfb3BhY2l0eSIsImNsZWFuU2NyZWVuIiwiaGlkZSIsInN0eWxlIiwidmlzaWJpbGl0eSIsInNob3ciLCJzZXRPcGFjaXR5IiwiX3NldE9wYWNpdHkiLCJvcGFjaXR5IiwiZ2V0T3BhY2l0eSIsImdldFZpc2liaWxpdHkiLCJkcmF3IiwiY3JlYXRBbmRnZXRXaWR0aCIsImJ1bGxldFNjcmVlbk9uU2NyZWVuIiwicmVDcmVhdEFuZGdldFdpZHRoIiwiY2hlY2tXaGV0aGVySGlkZSIsImJ1bGxldFNjcmVlbiIsInR5cGUiLCJoaWRkZW5UeXBlcyIsInNldFNpemUiLCJ3aWR0aCIsImhlaWdodCIsInNjYWxpbmciLCJ0cmFuc2Zvcm0iLCJ3ZWJraXRUcmFuc2Zvcm0iLCJtc1RyYW5zZm9ybSIsInRyYW5zZm9ybU9yaWdpbiIsIndlYmtpdFRyYW5zZm9ybU9yaWdpbiIsIm1zVHJhbnNmb3JtT3JpZ2luIiwicG9zaXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7O0lBR3FCQSxtQjtBQUNqQjs7Ozs7O0FBTUEsNkJBQVlDLE9BQVosRUFBcUJDLE9BQXJCLEVBQThCQyxXQUE5QixFQUEyQztBQUFBOztBQUN2QyxNQUFJLHNFQUFlSCxtQkFBbkIsRUFBd0M7QUFDcEMsVUFBTSxJQUFJSSxXQUFKLEVBQU47QUFDSDs7QUFFREMsRUFBQUEsSUFBSTtBQUVKOzs7OztBQUlBLE1BQUlDLEtBQUssR0FBRyxLQUFaO0FBRUE7Ozs7O0FBSUEsTUFBSUMsUUFBUSxHQUFHLEdBQWY7QUFFQTs7Ozs7QUFJQSxPQUFLQyxXQUFMLEdBQW1CLFlBQVk7QUFDM0IsVUFBTSxJQUFJSixXQUFKLEVBQU47QUFDSCxHQUZEO0FBSUE7Ozs7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LENBQUNTLEtBQVIsQ0FBY3dCLHFCQUFkLEdBQ0FqQyxPQUFPLENBQUNTLEtBQVIsQ0FBY3lCLGlCQUFkLEdBQWtDLEVBTHRDO0FBTUg7QUFDSjtBQUVEOzs7Ozs7QUFJQSxXQUFTOUIsSUFBVCxHQUFnQjtBQUNacUIsSUFBQUEsT0FBTzs7QUFDUFosSUFBQUEsV0FBVzs7QUFDWGIsSUFBQUEsT0FBTyxDQUFDUyxLQUFSLENBQWMwQixRQUFkLEdBQXlCLFVBQXpCO0FBQ0g7QUFDSixDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiDmuLLmn5Plmajmir3osaHnsbtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2VuZXJhbEJhc2VSZW5kZXJlciB7XG4gICAgLyoqXG4gICAgICog5a6e5L6L5YyW5LiA5Liq5riy5p+T5Zmo5oq96LGh57G7XG4gICAgICogQHBhcmFtIHtvYmplY3R9IGVsZW1lbnQgLSBFbGVtZW50IOWFg+e0oFxuICAgICAqIEBwYXJhbSB7b3BlbkJTRX5PcHRpb25zfSBvcHRpb25zIC0g5YWo5bGA6YCJ6aG5XG4gICAgICogQHBhcmFtIHtvYmplY3R9IGVsZW1lbnRTaXplIC0g5YWD57Sg5aSn5bCPXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgb3B0aW9ucywgZWxlbWVudFNpemUpIHtcbiAgICAgICAgaWYgKG5ldy50YXJnZXQgPT09IEdlbmVyYWxCYXNlUmVuZGVyZXIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCgpOyAvL+WIneWni+WMllxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDpmpDol4/lvLnluZVcbiAgICAgICAgICogQHByaXZhdGUgQHR5cGUge2Jvb2xlYW59XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgX2hpZGUgPSBmYWxzZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog6YCP5piO5bqmXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgX29wYWNpdHkgPSAwLjA7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa4hemZpOWxj+W5leWGheWuuVxuICAgICAgICAgKiBAYWJzdHJhY3RcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY2xlYW5TY3JlZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDpmpDol4/lvLnluZXjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuaGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF9oaWRlID0gdHJ1ZTtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaYvuekuuW8ueW5leOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5zaG93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX2hpZGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiuvue9ruW8ueW5leS4jemAj+aYjuW6puOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5zZXRPcGFjaXR5ID0gX3NldE9wYWNpdHk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiuvue9ruW8ueW5leS4jemAj+aYjuW6puOAglxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX3NldE9wYWNpdHkoKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5vcGFjaXR5ID09PSAxKSBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAnJztcbiAgICAgICAgICAgIGVsc2UgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gb3B0aW9ucy5vcGFjaXR5O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPluW8ueW5leS4jemAj+aYjuW6puOAglxuICAgICAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSDlvLnluZXkuI3pgI/mmI7luqbvvJrlj5blgLzojIPlm7QgMC4wIOWIsCAxLjDvvIwwLjAg5YWo6YCP5piO77ybMS4wIOS4jemAj+aYjuOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5nZXRPcGFjaXR5ID0gKCkgPT4gX29wYWNpdHk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPluW8ueW5leWPr+ingeaAp+OAglxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0g5oyH56S65by55bmV5piv5ZCm5Y+v6KeB44CCXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiDojrflj5blvLnluZXlj6/op4HmgKfjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZ2V0VmlzaWJpbGl0eSA9ICgpID0+ICFfaGlkZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog57uY5Yi25Ye95pWwXG4gICAgICAgICAqIEBhYnN0cmFjdFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5kcmF3ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yib5bu65by55bmV5YWD57SgXG4gICAgICAgICAqIEBhYnN0cmFjdFxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gYnVsbGV0U2NyZWVuT25TY3JlZW4gLSDlsY/luZXlvLnluZXlr7nosaFcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY3JlYXRBbmRnZXRXaWR0aCA9IGZ1bmN0aW9uIChidWxsZXRTY3JlZW5PblNjcmVlbikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yig6Zmk5by55bmV5YWD57SgXG4gICAgICAgICAqIEBhYnN0cmFjdFxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gYnVsbGV0U2NyZWVuT25TY3JlZW4gLSDlsY/luZXlvLnluZXlr7nosaFcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZGVsZXRlID0gZnVuY3Rpb24gKGJ1bGxldFNjcmVlbk9uU2NyZWVuKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDph43mlrDmt7vliqDlvLnluZVcbiAgICAgICAgICogQGFic3RyYWN0XG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBidWxsZXRTY3JlZW5PblNjcmVlbiAtIOWxj+W5leW8ueW5leWvueixoVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5yZUNyZWF0QW5kZ2V0V2lkdGggPSBmdW5jdGlvbiAoYnVsbGV0U2NyZWVuT25TY3JlZW4pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOajgOafpeW8ueW5leaYr+WQpuiiq+makOiXj1xuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gYnVsbGV0U2NyZWVuT25TY3JlZW4gLSDlsY/luZXlvLnluZXlr7nosaFcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY2hlY2tXaGV0aGVySGlkZSA9IChidWxsZXRTY3JlZW5PblNjcmVlbikgPT4gKGJ1bGxldFNjcmVlbk9uU2NyZWVuLmJ1bGxldFNjcmVlbi50eXBlICYgb3B0aW9ucy5oaWRkZW5UeXBlcykgPT09IGJ1bGxldFNjcmVlbk9uU2NyZWVuLmJ1bGxldFNjcmVlbi50eXBlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAqIOiuvue9ruWwuuWvuFxuICAgICAgICAqIEBmdW5jdGlvblxuICAgICAgICAqL1xuICAgICAgICB0aGlzLnNldFNpemUgPSBzZXRTaXplO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDorr7nva7lsLrlr7hcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHNldFNpemUoKSB7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLndpZHRoID0gYCR7ZWxlbWVudFNpemUud2lkdGh9cHhgO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBgJHtlbGVtZW50U2l6ZS5oZWlnaHR9cHhgO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2NhbGluZyAhPSAxKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPVxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUubXNUcmFuc2Zvcm0gPSBgc2NhbGUoJHtvcHRpb25zLnNjYWxpbmd9LCR7b3B0aW9ucy5zY2FsaW5nfSlgO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNmb3JtT3JpZ2luID1cbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS53ZWJraXRUcmFuc2Zvcm1PcmlnaW4gPVxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLm1zVHJhbnNmb3JtT3JpZ2luID0gYGxlZnQgdG9wYDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPVxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUubXNUcmFuc2Zvcm0gPVxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUud2Via2l0VHJhbnNmb3JtT3JpZ2luID1cbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5tc1RyYW5zZm9ybU9yaWdpbiA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWIneWni+WMllxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgICAgIHNldFNpemUoKTtcbiAgICAgICAgICAgIF9zZXRPcGFjaXR5KCk7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICAgICAgfVxuICAgIH1cbn1cblxuIl0sImZpbGUiOiJyZW5kZXJlcnMvZ2VuZXJhbEJhc2VSZW5kZXJlci5qcyJ9
