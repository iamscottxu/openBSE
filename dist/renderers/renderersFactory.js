"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _resources = _interopRequireDefault(require("../lib/resources"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 渲染器
 * @private @constant
 */
var RENDERERS = {
  /**
   * CSS3 渲染模式（普通弹幕引擎和特殊弹幕引擎）
   * @private @readonly
   */
  css3: {
    general: require('./generalCss3Renderer')["default"],
    special: require('./generalCss3Renderer')["default"]
  },

  /**
   * SVG 渲染模式（仅普通弹幕引擎）
   * @private @readonly
   */
  svg: {
    general: require('./generalSvgRenderer')["default"]
  },

  /**
   * WebGL 渲染模式（仅普通弹幕引擎）
   * @private @readonly
   */
  webgl: {
    general: require('./generalWebglRenderer')["default"]
  },

  /**
   * Canvas 2D 渲染模式（普通弹幕引擎和特殊弹幕引擎）
   * @private @readonly
   */
  canvas: {
    general: require('./generalCanvasRenderer')["default"],
    special: require('./generalCanvasRenderer')["default"]
  }
  /**
   * 渲染器工厂
   */

};

var RenderersFactory =
/**
 * 实例化一个渲染器工厂
 * @param {object} element - Element 元素
 * @param {openBSE~Options} options - 全局选项
 * @param {object} elementSize - 元素大小
 * @param {Event} eventTrigger - 事件引发方法
 */
function RenderersFactory(element, options, elementSize, eventTrigger) {
  var _this = this;

  _classCallCheck(this, RenderersFactory);

  /**
   * 获取渲染器
   * @param {string} renderMode - 渲染模式
   * @param {string} engineType - 引擎类型
   * @returns {BaseRenderer} 渲染器的实例
   * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
   * @throws {TypeError} 传入的参数错误时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
   */
  this.getRenderer = function (renderMode, engineType) {
    var renderer = RENDERERS[renderMode][engineType];
    if (typeof renderer === 'undefined') throw new TypeError(_resources["default"].RENDER_MODE_ERROR.fillData({
      renderMode: renderMode
    }));
    return new renderer(element, options, elementSize, eventTrigger);
  },
  /**
   * 获取普通弹幕渲染器
   * @param {string} renderMode - 渲染模式
   * @returns {BaseRenderer} 渲染器的实例
   * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
   * @throws {TypeError} 传入的参数错误时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
   */
  this.getGeneralRenderer = function (renderMode) {
    return _this.getRenderer(renderMode, 'general');
  };
  /**
   * 获取特殊弹幕渲染器
   * @param {string} renderMode - 渲染模式
   * @returns {BaseRenderer} 渲染器的实例
   * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
   * @throws {TypeError} 传入的参数错误时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
   */

  this.getSpecialRenderer = function (renderMode) {
    return _this.getRenderer(renderMode, 'special');
  };
};

exports["default"] = RenderersFactory;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbmRlcmVycy9yZW5kZXJlcnNGYWN0b3J5LmpzIl0sIm5hbWVzIjpbIlJFTkRFUkVSUyIsImNzczMiLCJnZW5lcmFsIiwicmVxdWlyZSIsInNwZWNpYWwiLCJzdmciLCJ3ZWJnbCIsImNhbnZhcyIsIlJlbmRlcmVyc0ZhY3RvcnkiLCJlbGVtZW50Iiwib3B0aW9ucyIsImVsZW1lbnRTaXplIiwiZXZlbnRUcmlnZ2VyIiwiZ2V0UmVuZGVyZXIiLCJyZW5kZXJNb2RlIiwiZW5naW5lVHlwZSIsInJlbmRlcmVyIiwiVHlwZUVycm9yIiwiUmVzb3VyY2VzIiwiUkVOREVSX01PREVfRVJST1IiLCJmaWxsRGF0YSIsImdldEdlbmVyYWxSZW5kZXJlciIsImdldFNwZWNpYWxSZW5kZXJlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUVBOzs7O0FBSUEsSUFBTUEsU0FBUyxHQUFHO0FBQ2Q7Ozs7QUFJQUMsRUFBQUEsSUFBSSxFQUFFO0FBQ0ZDLElBQUFBLE9BQU8sRUFBRUMsT0FBTyxDQUFDLHVCQUFELENBQVAsV0FEUDtBQUVGQyxJQUFBQSxPQUFPLEVBQUVELE9BQU8sQ0FBQyx1QkFBRCxDQUFQO0FBRlAsR0FMUTs7QUFTZDs7OztBQUlBRSxFQUFBQSxHQUFHLEVBQUU7QUFDREgsSUFBQUEsT0FBTyxFQUFFQyxPQUFPLENBQUMsc0JBQUQsQ0FBUDtBQURSLEdBYlM7O0FBZ0JkOzs7O0FBSUFHLEVBQUFBLEtBQUssRUFBRTtBQUNISixJQUFBQSxPQUFPLEVBQUVDLE9BQU8sQ0FBQyx3QkFBRCxDQUFQO0FBRE4sR0FwQk87O0FBdUJkOzs7O0FBSUFJLEVBQUFBLE1BQU0sRUFBRTtBQUNKTCxJQUFBQSxPQUFPLEVBQUVDLE9BQU8sQ0FBQyx5QkFBRCxDQUFQLFdBREw7QUFFSkMsSUFBQUEsT0FBTyxFQUFFRCxPQUFPLENBQUMseUJBQUQsQ0FBUDtBQUZMO0FBTVo7Ozs7QUFqQ2tCLENBQWxCOztJQW9DcUJLLGdCO0FBQ2pCOzs7Ozs7O0FBT0EsMEJBQVlDLE9BQVosRUFBcUJDLE9BQXJCLEVBQThCQyxXQUE5QixFQUEyQ0MsWUFBM0MsRUFBeUQ7QUFBQTs7QUFBQTs7QUFDckQ7Ozs7Ozs7O0FBUUEsT0FBS0MsV0FBTCxHQUFtQixVQUFVQyxVQUFWLEVBQXNCQyxVQUF0QixFQUFrQztBQUNqRCxRQUFJQyxRQUFRLEdBQUdoQixTQUFTLENBQUNjLFVBQUQsQ0FBVCxDQUFzQkMsVUFBdEIsQ0FBZjtBQUNBLFFBQUksT0FBUUMsUUFBUixLQUFzQixXQUExQixFQUF1QyxNQUFNLElBQUlDLFNBQUosQ0FBY0Msc0JBQVVDLGlCQUFWLENBQTRCQyxRQUE1QixDQUFxQztBQUFFTixNQUFBQSxVQUFVLEVBQUVBO0FBQWQsS0FBckMsQ0FBZCxDQUFOO0FBQ3ZDLFdBQU8sSUFBSUUsUUFBSixDQUFhUCxPQUFiLEVBQXNCQyxPQUF0QixFQUErQkMsV0FBL0IsRUFBNENDLFlBQTVDLENBQVA7QUFDSCxHQUpEO0FBS0E7Ozs7Ozs7QUFPQSxPQUFLUyxrQkFBTCxHQUEwQixVQUFDUCxVQUFEO0FBQUEsV0FBZ0IsS0FBSSxDQUFDRCxXQUFMLENBQWlCQyxVQUFqQixFQUE2QixTQUE3QixDQUFoQjtBQUFBLEdBWjFCO0FBYUE7Ozs7Ozs7O0FBT0EsT0FBS1Esa0JBQUwsR0FBMEIsVUFBQ1IsVUFBRDtBQUFBLFdBQWdCLEtBQUksQ0FBQ0QsV0FBTCxDQUFpQkMsVUFBakIsRUFBNkIsU0FBN0IsQ0FBaEI7QUFBQSxHQUExQjtBQUNILEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVzb3VyY2VzIGZyb20gJy4uL2xpYi9yZXNvdXJjZXMnXG5cbi8qKlxuICog5riy5p+T5ZmoXG4gKiBAcHJpdmF0ZSBAY29uc3RhbnRcbiAqL1xuY29uc3QgUkVOREVSRVJTID0ge1xuICAgIC8qKlxuICAgICAqIENTUzMg5riy5p+T5qih5byP77yI5pmu6YCa5by55bmV5byV5pOO5ZKM54m55q6K5by55bmV5byV5pOO77yJXG4gICAgICogQHByaXZhdGUgQHJlYWRvbmx5XG4gICAgICovXG4gICAgY3NzMzoge1xuICAgICAgICBnZW5lcmFsOiByZXF1aXJlKCcuL2dlbmVyYWxDc3MzUmVuZGVyZXInKS5kZWZhdWx0LFxuICAgICAgICBzcGVjaWFsOiByZXF1aXJlKCcuL2dlbmVyYWxDc3MzUmVuZGVyZXInKS5kZWZhdWx0XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBTVkcg5riy5p+T5qih5byP77yI5LuF5pmu6YCa5by55bmV5byV5pOO77yJXG4gICAgICogQHByaXZhdGUgQHJlYWRvbmx5XG4gICAgICovXG4gICAgc3ZnOiB7XG4gICAgICAgIGdlbmVyYWw6IHJlcXVpcmUoJy4vZ2VuZXJhbFN2Z1JlbmRlcmVyJykuZGVmYXVsdFxuICAgIH0sXG4gICAgLyoqXG4gICAgICogV2ViR0wg5riy5p+T5qih5byP77yI5LuF5pmu6YCa5by55bmV5byV5pOO77yJXG4gICAgICogQHByaXZhdGUgQHJlYWRvbmx5XG4gICAgICovXG4gICAgd2ViZ2w6IHtcbiAgICAgICAgZ2VuZXJhbDogcmVxdWlyZSgnLi9nZW5lcmFsV2ViZ2xSZW5kZXJlcicpLmRlZmF1bHRcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIENhbnZhcyAyRCDmuLLmn5PmqKHlvI/vvIjmma7pgJrlvLnluZXlvJXmk47lkoznibnmrorlvLnluZXlvJXmk47vvIlcbiAgICAgKiBAcHJpdmF0ZSBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBjYW52YXM6IHtcbiAgICAgICAgZ2VuZXJhbDogcmVxdWlyZSgnLi9nZW5lcmFsQ2FudmFzUmVuZGVyZXInKS5kZWZhdWx0LFxuICAgICAgICBzcGVjaWFsOiByZXF1aXJlKCcuL2dlbmVyYWxDYW52YXNSZW5kZXJlcicpLmRlZmF1bHRcbiAgICB9XG59XG5cbi8qKlxuICog5riy5p+T5Zmo5bel5Y6CXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbmRlcmVyc0ZhY3Rvcnkge1xuICAgIC8qKlxuICAgICAqIOWunuS+i+WMluS4gOS4qua4suafk+WZqOW3peWOglxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbGVtZW50IC0gRWxlbWVudCDlhYPntKBcbiAgICAgKiBAcGFyYW0ge29wZW5CU0V+T3B0aW9uc30gb3B0aW9ucyAtIOWFqOWxgOmAiemhuVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbGVtZW50U2l6ZSAtIOWFg+e0oOWkp+Wwj1xuICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50VHJpZ2dlciAtIOS6i+S7tuW8leWPkeaWueazlVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMsIGVsZW1lbnRTaXplLCBldmVudFRyaWdnZXIpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPlua4suafk+WZqFxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gcmVuZGVyTW9kZSAtIOa4suafk+aooeW8j1xuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gZW5naW5lVHlwZSAtIOW8leaTjuexu+Wei1xuICAgICAgICAgKiBAcmV0dXJucyB7QmFzZVJlbmRlcmVyfSDmuLLmn5PlmajnmoTlrp7kvotcbiAgICAgICAgICogQHRocm93cyB7b3BlbkJTRS5Ccm93c2VyTm90U3VwcG9ydEVycm9yfSDmtY/op4jlmajkuI3mlK/mjIHnibnlrprmuLLmn5PmqKHlvI/ml7blvJXlj5HplJnor69cbiAgICAgICAgICogQHRocm93cyB7VHlwZUVycm9yfSDkvKDlhaXnmoTlj4LmlbDplJnor6/ml7blvJXlj5HplJnor6/jgILor7flj4LpmIUgTUROIFtUeXBlRXJyb3Jde0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3poLUNOL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1R5cGVFcnJvcn0g44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmdldFJlbmRlcmVyID0gZnVuY3Rpb24gKHJlbmRlck1vZGUsIGVuZ2luZVR5cGUpIHtcbiAgICAgICAgICAgIGxldCByZW5kZXJlciA9IFJFTkRFUkVSU1tyZW5kZXJNb2RlXVtlbmdpbmVUeXBlXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgKHJlbmRlcmVyKSA9PT0gJ3VuZGVmaW5lZCcpIHRocm93IG5ldyBUeXBlRXJyb3IoUmVzb3VyY2VzLlJFTkRFUl9NT0RFX0VSUk9SLmZpbGxEYXRhKHsgcmVuZGVyTW9kZTogcmVuZGVyTW9kZSB9KSk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IHJlbmRlcmVyKGVsZW1lbnQsIG9wdGlvbnMsIGVsZW1lbnRTaXplLCBldmVudFRyaWdnZXIpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W5pmu6YCa5by55bmV5riy5p+T5ZmoXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSByZW5kZXJNb2RlIC0g5riy5p+T5qih5byPXG4gICAgICAgICAqIEByZXR1cm5zIHtCYXNlUmVuZGVyZXJ9IOa4suafk+WZqOeahOWunuS+i1xuICAgICAgICAgKiBAdGhyb3dzIHtvcGVuQlNFLkJyb3dzZXJOb3RTdXBwb3J0RXJyb3J9IOa1j+iniOWZqOS4jeaUr+aMgeeJueWumua4suafk+aooeW8j+aXtuW8leWPkemUmeivr1xuICAgICAgICAgKiBAdGhyb3dzIHtUeXBlRXJyb3J9IOS8oOWFpeeahOWPguaVsOmUmeivr+aXtuW8leWPkemUmeivr+OAguivt+WPgumYhSBNRE4gW1R5cGVFcnJvcl17QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvemgtQ04vZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvVHlwZUVycm9yfSDjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZ2V0R2VuZXJhbFJlbmRlcmVyID0gKHJlbmRlck1vZGUpID0+IHRoaXMuZ2V0UmVuZGVyZXIocmVuZGVyTW9kZSwgJ2dlbmVyYWwnKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPlueJueauiuW8ueW5lea4suafk+WZqFxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gcmVuZGVyTW9kZSAtIOa4suafk+aooeW8j1xuICAgICAgICAgKiBAcmV0dXJucyB7QmFzZVJlbmRlcmVyfSDmuLLmn5PlmajnmoTlrp7kvotcbiAgICAgICAgICogQHRocm93cyB7b3BlbkJTRS5Ccm93c2VyTm90U3VwcG9ydEVycm9yfSDmtY/op4jlmajkuI3mlK/mjIHnibnlrprmuLLmn5PmqKHlvI/ml7blvJXlj5HplJnor69cbiAgICAgICAgICogQHRocm93cyB7VHlwZUVycm9yfSDkvKDlhaXnmoTlj4LmlbDplJnor6/ml7blvJXlj5HplJnor6/jgILor7flj4LpmIUgTUROIFtUeXBlRXJyb3Jde0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3poLUNOL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1R5cGVFcnJvcn0g44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmdldFNwZWNpYWxSZW5kZXJlciA9IChyZW5kZXJNb2RlKSA9PiB0aGlzLmdldFJlbmRlcmVyKHJlbmRlck1vZGUsICdzcGVjaWFsJyk7XG4gICAgfVxufVxuXG4iXSwiZmlsZSI6InJlbmRlcmVycy9yZW5kZXJlcnNGYWN0b3J5LmpzIn0=
