"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RenderersFactory = void 0;

var _resources = require("../resources");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 渲染器
 * @private @constant
 */
var RENDERERS = {
  /**
   * CSS3 渲染模式
   * @private @readonly
   */
  css3: require('./css3Renderer').CSS3Renderer,

  /**
   * SVG 渲染模式
   * @private @readonly
   */
  svg: require('./svgRenderer').SVGRenderer,

  /**
   * WebGL 渲染模式
   * @private @readonly
   */
  webgl: require('./webglRenderer').WebGLRenderer,

  /**
   * Canvas 2D 渲染模式
   * @private @readonly
   */
  canvas: require('./canvasRenderer').CanvasRenderer
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
  _classCallCheck(this, RenderersFactory);

  /**
   * 获取渲染器
   * @param {string} renderMode - 渲染模式
   * @returns {BaseRenderer} 渲染器的实例
   * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
   * @throws {TypeError} 传入的参数错误时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
   */
  this.getRenderer = function (renderMode) {
    var renderer = RENDERERS[renderMode];
    if (typeof renderer === 'undefined') throw new TypeError(_resources.Resources.RENDER_MODE_ERROR.fillData({
      renderMode: renderMode
    }));
    return new renderer(element, options, elementSize, eventTrigger);
  };
};

exports.RenderersFactory = RenderersFactory;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9yZW5kZXJlcnMvcmVuZGVyZXJzRmFjdG9yeS5qcyJdLCJuYW1lcyI6WyJSRU5ERVJFUlMiLCJjc3MzIiwicmVxdWlyZSIsIkNTUzNSZW5kZXJlciIsInN2ZyIsIlNWR1JlbmRlcmVyIiwid2ViZ2wiLCJXZWJHTFJlbmRlcmVyIiwiY2FudmFzIiwiQ2FudmFzUmVuZGVyZXIiLCJSZW5kZXJlcnNGYWN0b3J5IiwiZWxlbWVudCIsIm9wdGlvbnMiLCJlbGVtZW50U2l6ZSIsImV2ZW50VHJpZ2dlciIsImdldFJlbmRlcmVyIiwicmVuZGVyTW9kZSIsInJlbmRlcmVyIiwiVHlwZUVycm9yIiwiUmVzb3VyY2VzIiwiUkVOREVSX01PREVfRVJST1IiLCJmaWxsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFFQTs7OztBQUlBLElBQU1BLFNBQVMsR0FBRztBQUNkOzs7O0FBSUFDLEVBQUFBLElBQUksRUFBRUMsT0FBTyxDQUFDLGdCQUFELENBQVAsQ0FBMEJDLFlBTGxCOztBQU1kOzs7O0FBSUFDLEVBQUFBLEdBQUcsRUFBRUYsT0FBTyxDQUFDLGVBQUQsQ0FBUCxDQUF5QkcsV0FWaEI7O0FBV2Q7Ozs7QUFJQUMsRUFBQUEsS0FBSyxFQUFFSixPQUFPLENBQUMsaUJBQUQsQ0FBUCxDQUEyQkssYUFmcEI7O0FBZ0JkOzs7O0FBSUFDLEVBQUFBLE1BQU0sRUFBRU4sT0FBTyxDQUFDLGtCQUFELENBQVAsQ0FBNEJPO0FBR3hDOzs7O0FBdkJrQixDQUFsQjs7SUEwQk1DLGdCO0FBQ0Y7Ozs7Ozs7QUFPQSwwQkFBWUMsT0FBWixFQUFxQkMsT0FBckIsRUFBOEJDLFdBQTlCLEVBQTJDQyxZQUEzQyxFQUF5RDtBQUFBOztBQUNyRDs7Ozs7OztBQU9BLE9BQUtDLFdBQUwsR0FBbUIsVUFBVUMsVUFBVixFQUFzQjtBQUNyQyxRQUFJQyxRQUFRLEdBQUdqQixTQUFTLENBQUNnQixVQUFELENBQXhCO0FBQ0EsUUFBSSxPQUFRQyxRQUFSLEtBQXNCLFdBQTFCLEVBQXVDLE1BQU0sSUFBSUMsU0FBSixDQUFjQyxxQkFBVUMsaUJBQVYsQ0FBNEJDLFFBQTVCLENBQXFDO0FBQUVMLE1BQUFBLFVBQVUsRUFBRUE7QUFBZCxLQUFyQyxDQUFkLENBQU47QUFDdkMsV0FBTyxJQUFJQyxRQUFKLENBQWFOLE9BQWIsRUFBc0JDLE9BQXRCLEVBQStCQyxXQUEvQixFQUE0Q0MsWUFBNUMsQ0FBUDtBQUNILEdBSkQ7QUFLSCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmVzb3VyY2VzIH0gZnJvbSAnLi4vcmVzb3VyY2VzJ1xuXG4vKipcbiAqIOa4suafk+WZqFxuICogQHByaXZhdGUgQGNvbnN0YW50XG4gKi9cbmNvbnN0IFJFTkRFUkVSUyA9IHtcbiAgICAvKipcbiAgICAgKiBDU1MzIOa4suafk+aooeW8j1xuICAgICAqIEBwcml2YXRlIEByZWFkb25seVxuICAgICAqL1xuICAgIGNzczM6IHJlcXVpcmUoJy4vY3NzM1JlbmRlcmVyJykuQ1NTM1JlbmRlcmVyLFxuICAgIC8qKlxuICAgICAqIFNWRyDmuLLmn5PmqKHlvI9cbiAgICAgKiBAcHJpdmF0ZSBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBzdmc6IHJlcXVpcmUoJy4vc3ZnUmVuZGVyZXInKS5TVkdSZW5kZXJlcixcbiAgICAvKipcbiAgICAgKiBXZWJHTCDmuLLmn5PmqKHlvI9cbiAgICAgKiBAcHJpdmF0ZSBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB3ZWJnbDogcmVxdWlyZSgnLi93ZWJnbFJlbmRlcmVyJykuV2ViR0xSZW5kZXJlcixcbiAgICAvKipcbiAgICAgKiBDYW52YXMgMkQg5riy5p+T5qih5byPXG4gICAgICogQHByaXZhdGUgQHJlYWRvbmx5XG4gICAgICovXG4gICAgY2FudmFzOiByZXF1aXJlKCcuL2NhbnZhc1JlbmRlcmVyJykuQ2FudmFzUmVuZGVyZXJcbn1cblxuLyoqXG4gKiDmuLLmn5Plmajlt6XljoJcbiAqL1xuY2xhc3MgUmVuZGVyZXJzRmFjdG9yeSB7XG4gICAgLyoqXG4gICAgICog5a6e5L6L5YyW5LiA5Liq5riy5p+T5Zmo5bel5Y6CXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGVsZW1lbnQgLSBFbGVtZW50IOWFg+e0oFxuICAgICAqIEBwYXJhbSB7b3BlbkJTRX5PcHRpb25zfSBvcHRpb25zIC0g5YWo5bGA6YCJ6aG5XG4gICAgICogQHBhcmFtIHtvYmplY3R9IGVsZW1lbnRTaXplIC0g5YWD57Sg5aSn5bCPXG4gICAgICogQHBhcmFtIHtFdmVudH0gZXZlbnRUcmlnZ2VyIC0g5LqL5Lu25byV5Y+R5pa55rOVXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgb3B0aW9ucywgZWxlbWVudFNpemUsIGV2ZW50VHJpZ2dlcikge1xuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W5riy5p+T5ZmoXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSByZW5kZXJNb2RlIC0g5riy5p+T5qih5byPXG4gICAgICAgICAqIEByZXR1cm5zIHtCYXNlUmVuZGVyZXJ9IOa4suafk+WZqOeahOWunuS+i1xuICAgICAgICAgKiBAdGhyb3dzIHtvcGVuQlNFLkJyb3dzZXJOb3RTdXBwb3J0RXJyb3J9IOa1j+iniOWZqOS4jeaUr+aMgeeJueWumua4suafk+aooeW8j+aXtuW8leWPkemUmeivr1xuICAgICAgICAgKiBAdGhyb3dzIHtUeXBlRXJyb3J9IOS8oOWFpeeahOWPguaVsOmUmeivr+aXtuW8leWPkemUmeivr+OAguivt+WPgumYhSBNRE4gW1R5cGVFcnJvcl17QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvemgtQ04vZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvVHlwZUVycm9yfSDjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZ2V0UmVuZGVyZXIgPSBmdW5jdGlvbiAocmVuZGVyTW9kZSkge1xuICAgICAgICAgICAgbGV0IHJlbmRlcmVyID0gUkVOREVSRVJTW3JlbmRlck1vZGVdO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiAocmVuZGVyZXIpID09PSAndW5kZWZpbmVkJykgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuUkVOREVSX01PREVfRVJST1IuZmlsbERhdGEoeyByZW5kZXJNb2RlOiByZW5kZXJNb2RlIH0pKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgcmVuZGVyZXIoZWxlbWVudCwgb3B0aW9ucywgZWxlbWVudFNpemUsIGV2ZW50VHJpZ2dlcik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7IFJlbmRlcmVyc0ZhY3RvcnkgfTsiXSwiZmlsZSI6ImxpYi9yZW5kZXJlcnMvcmVuZGVyZXJzRmFjdG9yeS5qcyJ9
