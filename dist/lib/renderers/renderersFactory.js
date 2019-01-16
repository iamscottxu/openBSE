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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9yZW5kZXJlcnMvcmVuZGVyZXJzRmFjdG9yeS5qcyJdLCJuYW1lcyI6WyJSRU5ERVJFUlMiLCJjc3MzIiwicmVxdWlyZSIsIkNTUzNSZW5kZXJlciIsInN2ZyIsIlNWR1JlbmRlcmVyIiwid2ViZ2wiLCJXZWJHTFJlbmRlcmVyIiwiY2FudmFzIiwiQ2FudmFzUmVuZGVyZXIiLCJSZW5kZXJlcnNGYWN0b3J5IiwiZWxlbWVudCIsIm9wdGlvbnMiLCJlbGVtZW50U2l6ZSIsImV2ZW50VHJpZ2dlciIsImdldFJlbmRlcmVyIiwicmVuZGVyTW9kZSIsInJlbmRlcmVyIiwiVHlwZUVycm9yIiwiUmVzb3VyY2VzIiwiUkVOREVSX01PREVfRVJST1IiLCJmaWxsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFFQTs7OztBQUlBLElBQU1BLFNBQVMsR0FBRztBQUNkOzs7O0FBSUFDLEVBQUFBLElBQUksRUFBRUMsT0FBTyxDQUFDLGdCQUFELENBQVAsQ0FBMEJDLFlBTGxCOztBQU1kOzs7O0FBSUFDLEVBQUFBLEdBQUcsRUFBRUYsT0FBTyxDQUFDLGVBQUQsQ0FBUCxDQUF5QkcsV0FWaEI7O0FBV2Q7Ozs7QUFJQUMsRUFBQUEsS0FBSyxFQUFFSixPQUFPLENBQUMsaUJBQUQsQ0FBUCxDQUEyQkssYUFmcEI7O0FBZ0JkOzs7O0FBSUFDLEVBQUFBLE1BQU0sRUFBRU4sT0FBTyxDQUFDLGtCQUFELENBQVAsQ0FBNEJPO0FBR3hDOzs7O0FBdkJrQixDQUFsQjs7SUEwQk1DLGdCO0FBQ0Y7Ozs7Ozs7QUFPQSwwQkFBWUMsT0FBWixFQUFxQkMsT0FBckIsRUFBOEJDLFdBQTlCLEVBQTJDQyxZQUEzQyxFQUF5RDtBQUFBOztBQUNyRDs7Ozs7OztBQU9BLE9BQUtDLFdBQUwsR0FBbUIsVUFBVUMsVUFBVixFQUFzQjtBQUNyQyxRQUFJQyxRQUFRLEdBQUdqQixTQUFTLENBQUNnQixVQUFELENBQXhCO0FBQ0EsUUFBSSxPQUFRQyxRQUFSLEtBQXNCLFdBQTFCLEVBQXVDLE1BQU0sSUFBSUMsU0FBSixDQUFjQyxxQkFBVUMsaUJBQVYsQ0FBNEJDLFFBQTVCLENBQXFDO0FBQUVMLE1BQUFBLFVBQVUsRUFBRUE7QUFBZCxLQUFyQyxDQUFkLENBQU47QUFDdkMsV0FBTyxJQUFJQyxRQUFKLENBQWFOLE9BQWIsRUFBc0JDLE9BQXRCLEVBQStCQyxXQUEvQixFQUE0Q0MsWUFBNUMsQ0FBUDtBQUNILEdBSkQ7QUFLSCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmVzb3VyY2VzIH0gZnJvbSAnLi4vcmVzb3VyY2VzJ1xyXG5cclxuLyoqXHJcbiAqIOa4suafk+WZqFxyXG4gKiBAcHJpdmF0ZSBAY29uc3RhbnRcclxuICovXHJcbmNvbnN0IFJFTkRFUkVSUyA9IHtcclxuICAgIC8qKlxyXG4gICAgICogQ1NTMyDmuLLmn5PmqKHlvI9cclxuICAgICAqIEBwcml2YXRlIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICBjc3MzOiByZXF1aXJlKCcuL2NzczNSZW5kZXJlcicpLkNTUzNSZW5kZXJlcixcclxuICAgIC8qKlxyXG4gICAgICogU1ZHIOa4suafk+aooeW8j1xyXG4gICAgICogQHByaXZhdGUgQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIHN2ZzogcmVxdWlyZSgnLi9zdmdSZW5kZXJlcicpLlNWR1JlbmRlcmVyLFxyXG4gICAgLyoqXHJcbiAgICAgKiBXZWJHTCDmuLLmn5PmqKHlvI9cclxuICAgICAqIEBwcml2YXRlIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICB3ZWJnbDogcmVxdWlyZSgnLi93ZWJnbFJlbmRlcmVyJykuV2ViR0xSZW5kZXJlcixcclxuICAgIC8qKlxyXG4gICAgICogQ2FudmFzIDJEIOa4suafk+aooeW8j1xyXG4gICAgICogQHByaXZhdGUgQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIGNhbnZhczogcmVxdWlyZSgnLi9jYW52YXNSZW5kZXJlcicpLkNhbnZhc1JlbmRlcmVyXHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmuLLmn5Plmajlt6XljoJcclxuICovXHJcbmNsYXNzIFJlbmRlcmVyc0ZhY3Rvcnkge1xyXG4gICAgLyoqXHJcbiAgICAgKiDlrp7kvovljJbkuIDkuKrmuLLmn5Plmajlt6XljoJcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbGVtZW50IC0gRWxlbWVudCDlhYPntKBcclxuICAgICAqIEBwYXJhbSB7b3BlbkJTRX5PcHRpb25zfSBvcHRpb25zIC0g5YWo5bGA6YCJ6aG5XHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZWxlbWVudFNpemUgLSDlhYPntKDlpKflsI9cclxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50VHJpZ2dlciAtIOS6i+S7tuW8leWPkeaWueazlVxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBvcHRpb25zLCBlbGVtZW50U2l6ZSwgZXZlbnRUcmlnZ2VyKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog6I635Y+W5riy5p+T5ZmoXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHJlbmRlck1vZGUgLSDmuLLmn5PmqKHlvI9cclxuICAgICAgICAgKiBAcmV0dXJucyB7QmFzZVJlbmRlcmVyfSDmuLLmn5PlmajnmoTlrp7kvotcclxuICAgICAgICAgKiBAdGhyb3dzIHtvcGVuQlNFLkJyb3dzZXJOb3RTdXBwb3J0RXJyb3J9IOa1j+iniOWZqOS4jeaUr+aMgeeJueWumua4suafk+aooeW8j+aXtuW8leWPkemUmeivr1xyXG4gICAgICAgICAqIEB0aHJvd3Mge1R5cGVFcnJvcn0g5Lyg5YWl55qE5Y+C5pWw6ZSZ6K+v5pe25byV5Y+R6ZSZ6K+v44CC6K+35Y+C6ZiFIE1ETiBbVHlwZUVycm9yXXtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy96aC1DTi9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9UeXBlRXJyb3J9IOOAglxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuZ2V0UmVuZGVyZXIgPSBmdW5jdGlvbiAocmVuZGVyTW9kZSkge1xyXG4gICAgICAgICAgICBsZXQgcmVuZGVyZXIgPSBSRU5ERVJFUlNbcmVuZGVyTW9kZV07XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgKHJlbmRlcmVyKSA9PT0gJ3VuZGVmaW5lZCcpIHRocm93IG5ldyBUeXBlRXJyb3IoUmVzb3VyY2VzLlJFTkRFUl9NT0RFX0VSUk9SLmZpbGxEYXRhKHsgcmVuZGVyTW9kZTogcmVuZGVyTW9kZSB9KSk7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgcmVuZGVyZXIoZWxlbWVudCwgb3B0aW9ucywgZWxlbWVudFNpemUsIGV2ZW50VHJpZ2dlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgeyBSZW5kZXJlcnNGYWN0b3J5IH07Il0sImZpbGUiOiJsaWIvcmVuZGVyZXJzL3JlbmRlcmVyc0ZhY3RvcnkuanMifQ==
