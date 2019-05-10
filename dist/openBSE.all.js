/*!
MIT License

Copyright (c) 2018-2019 Scott Xu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Home: https://iamscottxu.github.io/openBSE/
*/
require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

/**
 * openBSE 根命名空间
 * @namespace
 */
var openBSE = require('./openBSE');

window.openBSE = openBSE;


},{"./openBSE":"openbse"}],2:[function(require,module,exports){
module.exports={"version":"3.0","home":"https://iamscottxu.github.io/openBSE/","name":"openBSE","description":"openBSE is a high-performance JavaScript bullet-screen (danmaku) engine.","buildDate":"Fri, 10 May 2019 13:09:42 GMT"}

},{}],3:[function(require,module,exports){
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


},{"./lib/resources":11,"core-js/modules/es.array.iterator":133,"core-js/modules/es.function.bind":137,"core-js/modules/es.object.define-property":142,"core-js/modules/es.object.to-string":146,"core-js/modules/es.string.iterator":151,"core-js/modules/es.symbol":155,"core-js/modules/es.symbol.description":153,"core-js/modules/es.symbol.iterator":154,"core-js/modules/web.dom-collections.iterator":181}],4:[function(require,module,exports){
"use strict";

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.date.to-string");

require("core-js/modules/es.function.bind");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.timers");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _linkedList = _interopRequireDefault(require("../lib/linkedList"));

var _event2 = _interopRequireDefault(require("../lib/event"));

var _renderersFactory = _interopRequireDefault(require("../renderers/renderersFactory"));

var _generalType = _interopRequireDefault(require("./generalType"));

var _helper = _interopRequireDefault(require("../lib/helper"));

var _resources = _interopRequireDefault(require("../lib/resources"));

var build = _interopRequireWildcard(require("../build.json"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** 
 * 弹幕引擎对象类 
 * @alias openBSE.GeneralEngine
 * @property {openBSE~Options} options - 设置或获取全局选项。
 * @property {bool} visibility - 获取或设置弹幕可见性。
 * @property {string} renderMode - 获取渲染模式。取值为“canvas”、“css3”、“webgl”或“svg”。
 * @property {bool} playState - 获取播放状态。true：正在播放；false：已暂停/停止播放。
 * @property {openBSE~DebugInfo} debugInfo - 获取调试信息。
 * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误。
 * @throws {TypeError} 传入的参数错误时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
 */
var GeneralEngine =
/**
 * 创建一个弹幕引擎对象。
 * @param {Element} element - 要加载弹幕的元素：有关 Element 接口的信息请参阅MDN [Element]{@link https://developer.mozilla.org/zh-CN/docs/Web/API/Element} 。
 * @param {openBSE~Options} [_options] - 全局选项：一个 {@link openBSE~Options} 结构。
 * @param {string} [renderMode="canvas"] - 渲染模式：默认为“canvas”, “可选css3”， “webgl”和“svg”。一般建议使用“canvas”（特别是 FireFox 浏览器 CSS3 渲染效率较低）。在一些版本较老的浏览器中“window.devicePixelRatio”变量不被支持或支持不完整，这会导致在高DPI和页面被缩放的情况下“canvas”和“webgl”渲染模式弹幕显示不正常的情况（弹幕模糊），此时建议使用“css3”渲染模式。
 */
function GeneralEngine(element, options) {
  var renderMode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'canvas';

  _classCallCheck(this, GeneralEngine);

  /**
   * 开始时间
   * @private @type {number}
   */
  var _startTime;
  /**
   * 暂停时间
   * @private @type {number}
   */


  var _pauseTime = 0;
  /**
   * 弹幕缓冲区
   * @private @type {LinkedList}
   */

  var _bulletScreenBuffer = new _linkedList["default"]();
  /**
   * 实时弹幕列表
   * @private @type {LinkedList}
   */


  var _realTimeBulletScreens = new _linkedList["default"]();
  /**
   * 延迟弹幕总数
   * @private @type {number}
   */


  var _delayBulletScreenCount = 0;
  /**
   * 延迟（单位：毫秒）
   * @private @type {number}
   */

  var _delay = 0;
  /**
   * 播放标志
   * @private @type {boolean}
   */

  var _playing;
  /**
   * 刷新频率
   * @private @type {number}
   */


  var _refreshRate = 0.06;
  /**
   * 上一次刷新时间
   * @private @type {number}
   */

  var _lastRefreshTime;
  /**
   * 全局选项
   * @private @type {openBSE~generalOptions}
   */


  var _options;
  /**
   * 默认全局变量
   * @private @readonly
   */


  var _defaultOptions = {
    /** 垂直间距 */
    verticalInterval: 8,

    /** 播放速度(倍数) */
    playSpeed: 1,

    /** 时间基准 */
    clock: function clock(time) {
      return new Date().getTime() - _startTime;
    },

    /** 缩放比例 */
    scaling: 1,

    /** 超时丢弃 */
    timeOutDiscard: true,

    /** 要隐藏的弹幕类型 */
    hiddenTypes: 0,

    /** 弹幕不透明度 */
    opacity: 1,

    /** 鼠标经过样式 */
    cursorOnMouseOver: 'pointer',

    /** 默认弹幕样式 */
    defaultStyle: {
      /** 阴影的模糊级别，0为不显示阴影 */
      shadowBlur: 2,

      /** 字体粗细 */
      fontWeight: '600',

      /** 字体系列 */
      fontFamily: 'sans-serif',

      /** 字体大小（单位：像素） */
      size: 25,

      /** 外框颜色 */
      boxColor: null,

      /** 字体颜色 */
      color: 'white',

      /** 描边颜色 */
      borderColor: null,

      /** 弹幕速度（单位：像素/毫秒） 仅流弹幕类型有效 */
      speed: 0.15,

      /** 弹幕停留时间 仅固定弹幕类型有效 */
      residenceTime: 5000
    }
    /**
     * 全局选项类型
     * @private @readonly
     */

  };
  var _optionsType = {
    verticalInterval: 'number',
    playSpeed: 'number',
    clock: 'function',
    scaling: 'number',
    timeOutDiscard: 'boolean',
    hiddenTypes: 'number',
    opacity: 'number',
    cursorOnMouseOver: 'string',
    defaultStyle: {
      shadowBlur: 'number',
      fontWeight: ['string', 'number'],
      fontFamily: 'string',
      size: 'number',
      boxColor: ['string', 'null'],
      color: 'string',
      borderColor: ['string', 'null'],
      speed: 'number',
      residenceTime: 'number'
    }
    /**
     * 默认弹幕数据
     * @private @readonly
     */

  };
  var _defaultBulletScreen = {
    /** 弹幕文本 */
    text: null,

    /** 是否允许丢弃 */
    canDiscard: true,

    /** 弹幕进入时间 */
    startTime: null,

    /** 弹幕类型 */
    type: _generalType["default"].rightToLeft,

    /** 弹幕层级（越大越前） */
    layer: 0
    /**
     * 弹幕数据类型
     * @private @readonly
     */

  };
  var _bulletScreenType = {
    text: 'string',
    canDiscard: 'boolean',
    startTime: 'number',
    type: 'number',
    layer: 'number'
    /**
     * requestAnimationFrame 定义（一些老式浏览器不支持 requestAnimationFrame ）
     * @param {function} fun - 回调方法 
     * @function
     */

  };
  var requestAnimationFrame;
  if (typeof window.requestAnimationFrame === 'function') requestAnimationFrame = window.requestAnimationFrame;else {
    console.warn(_resources["default"].REQUESTANIMATIONFRAME_NOT_SUPPORT_WARN);

    requestAnimationFrame = function requestAnimationFrame(fun) {
      return window.setTimeout(fun, 17);
    };
  }
  _options = _helper["default"].setValues(options, _defaultOptions, _optionsType);

  var _event = new _event2["default"]();
  /**
   * 弹幕单击事件。当单击弹幕时触发。
   * @event openBSE.GeneralEngine#click
   * @property {openBSE~GeneralEvent} e - 弹幕事件结构
   */


  _event.add('click');
  /**
   * 弹幕上下文菜单事件。当触发弹幕上下文菜单时触发。
   * @event openBSE.GeneralEngine#contextmenu
   * @property {openBSE~GeneralBulletScreenEvent} e - 弹幕事件结构
   */


  _event.add('contextmenu');
  /**
  * 弹幕鼠标离开事件。当鼠标离开弹幕时触发。
  * @event openBSE.GeneralEngine#mouseleave
  * @property {openBSE~GeneralBulletScreenEvent} e - 弹幕事件结构
  */


  _event.add('mouseleave');
  /**
   * 弹幕鼠标进入事件。当鼠标进入弹幕时触发。
   * @event openBSE.GeneralEngine#mouseenter
   * @property {openBSE~GeneralBulletScreenEvent} e - 弹幕事件结构
   */


  _event.add('mouseenter');
  /**
   * 绑定事件处理程序
   * @function
   * @description 绑定事件处理程序。当事件处理程序返回值为 false 时停止冒泡。
   * @param {string} name - 事件名称
   * @param {function} fun - 事件处理程序
   * @listens openBSE.GeneralEngine#click
   * @listens openBSE.GeneralEngine#contextmenu
   * @listens openBSE.GeneralEngine#mouseleave
   * @listens openBSE.GeneralEngine#mouseenter
   * @throws {TypeError} 传入的参数错误或事件不存在时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
   */


  this.bind = _event.bind;
  /**
   * 解绑事件处理程序（fun为空解绑所有事件处理程序）
   * @function
   * @param {string} name - 事件名称
   * @param {function} fun - 事件处理程序
   * @throws {TypeError} 传入的参数错误或事件不存在时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
   */

  this.unbind = _event.unbind;
  var _elementSize = {
    width: element.clientWidth / _options.scaling,
    height: element.clientHeight / _options.scaling
  };

  var _oldDevicePixelRatio = _helper["default"].getDevicePixelRatio();

  var _oldScaling = _options.scaling;
  var _oldClientWidth = element.clientWidth;
  var _oldClientHeight = element.clientHeight;
  var _oldHiddenTypes = _options.hiddenTypes;
  var _oldOpacity = _options.opacity;
  var renderersFactory = new _renderersFactory["default"](element, _options, _elementSize, bulletScreenEventTrigger);

  var _renderer = renderersFactory.getGeneralRenderer(renderMode);

  setInterval(setSize, 100);
  /**
   * 设置或获取全局选项
   * @private
   **/

  Object.defineProperty(this, 'options', {
    get: function get() {
      return _helper["default"].clone(_options);
    },
    set: function set(options) {
      _options = _helper["default"].setValues(options, _options, _optionsType, false);

      if (_oldHiddenTypes != _options.hiddenTypes) {
        _oldHiddenTypes = _options.hiddenTypes;
        if (!_playing) _renderer.draw();
      }

      if (_oldOpacity != _options.opacity) {
        _oldOpacity = _options.opacity;

        _renderer.setOpacity();
      }
    }
  });
  /**
   * 添加弹幕到弹幕列表。
   * @description 添加弹幕到弹幕列表。由于弹幕在屏幕上出现过后，弹幕引擎将从列表中彻底删除此弹幕。所以，在改变播放进度时，可能需要先[清空弹幕列表]{@link openBSE.BulletScreenEngine#cleanBulletScreenList}，然后重新加载此播放进度以后的弹幕。
   * @param {openBSE~GeneralBulletScreen} bulletScreen - 单条弹幕数据：一个 {@link openBSE~GeneralBulletScreen} 结构。
   * @throws {TypeError} 传入的参数错误时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
   */

  this.add = function (bulletScreen) {
    _defaultBulletScreen.startTime = _options.clock();
    bulletScreen = _helper["default"].setValues(bulletScreen, _defaultBulletScreen, _bulletScreenType);
    if (bulletScreen.type != _generalType["default"].leftToRight && bulletScreen.type != _generalType["default"].rightToLeft && bulletScreen.type != _generalType["default"].top && bulletScreen.type != _generalType["default"].bottom) throw new TypeError(_resources["default"].PARAMETERS_TYPE_ERROR);

    _helper["default"].checkTypes(bulletScreen.style, _optionsType.defaultStyle);

    var newNode = new _linkedList["default"].node(bulletScreen);

    _bulletScreenBuffer.forEach(function (node) {
      var lastBulletScreen = node.element;

      if (bulletScreen.startTime > lastBulletScreen.startTime) {
        flag = true;
        return {
          add: {
            addToUp: true,
            node: newNode
          },
          stop: true
        };
      }
    }, true);

    if (newNode.linkedList === null) _bulletScreenBuffer.push(newNode, false);
  };
  /**
   * 开始播放弹幕。
   */


  this.play = function () {
    if (!_playing) {
      if (!_startTime) _startTime = new Date().getTime();
      if (_pauseTime) _startTime += _options.clock() - _pauseTime;
      _lastRefreshTime = null;
      _playing = true;
      requestAnimationFrame(refresh);
    }
  };
  /**
   * 继续所有在事件响应中设置了 e.pause = true; 弹幕的播放。
   */


  this.playAllBulletScreens = function () {
    return _realTimeBulletScreens.forEach(function (node) {
      return node.element.pause = false;
    });
  };
  /**
   * 暂停播放弹幕。
   * @description 暂停播放弹幕。暂停播放弹幕是指弹幕播放暂停，所有未出现的弹幕将停止出现，已出现的弹幕停止运动，停止消失。
   */


  this.pause = function () {
    if (_playing) {
      _pauseTime = _options.clock();
      _playing = false;
    }
  };
  /**
   * 清空弹幕缓冲区。
   * @description 清空弹幕列表，但屏幕上已经出现的弹幕不会被清除。
   */


  this.cleanBuffer = function () {
    _bulletScreenBuffer.clean();
  };
  /**
   * 清空屏幕内容。
   * @description 清空屏幕内容。清空屏幕上已经出现的弹幕，不包括弹幕列表中的弹幕。
   */


  this.cleanScreen = function () {
    _realTimeBulletScreens.clean();

    _renderer.cleanScreen();
  };
  /**
   * 停止播放弹幕。
   * @description 停止播放弹幕。停止播放弹幕是指停止播放弹幕，默认[时间基准（options.clock）]{@link openBSE~BulletScreenStyle}归零，并[清空弹幕列表]{@link openBSE.BulletScreenEngine#cleanBulletScreenList}、[清空屏幕内容]{@link openBSE.BulletScreenEngine#cleanScreen}。
   */


  this.stop = function () {
    if (_playing) {
      this.pause();
    }

    this.cleanBuffer();
    this.cleanScreen();
    _pauseTime = 0;
    _startTime = null;
  };
  /**
   * 获取或设置弹幕可见性。
   * @private
   */


  Object.defineProperty(this, 'visibility', {
    get: function get() {
      return renderer.getVisibility();
    },
    set: function set(visibility) {
      if (visibility) _renderer.show();else _renderer.hide();
    }
  });
  /**
   * 获取渲染模式。
   * @private
   */

  Object.defineProperty(this, 'renderMode', {
    get: function get() {
      return renderMode;
    }
  });
  /**
   * 获取播放状态。
   * @private
   */

  Object.defineProperty(this, 'playState', {
    get: function get() {
      return _playing;
    }
  });
  /**
  * 获取调试信息。
  * @private
  */

  Object.defineProperty(this, 'debugInfo', {
    get: function get() {
      return {
        time: _playing ? _options.clock() : _pauseTime,
        realTimeBulletScreenCount: _realTimeBulletScreens.length,
        bufferBulletScreenCount: _bulletScreenBuffer.length,
        delay: _delay,
        delayBulletScreenCount: _delayBulletScreenCount,
        fps: _playing ? Math.floor(_refreshRate * 1000) : 0
      };
    }
  });
  /**
   * 弹幕事件响应
   * @param {string} name - 事件名称
   * @param {object} realTimeBulletScreen - 实时弹幕对象
   * @param {object} e - 事件信息
   */

  function bulletScreenEventTrigger(name, realTimeBulletScreen, e) {
    if (typeof e.pageX === 'undefined' || e.pageX === null) {
      var doc = document.documentElement,
          body = document.body;
      e.pageX = e.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
      e.pageY = e.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
    }

    _event.trigger(name, {
      /**
       * 获取引发事件的弹幕弹幕的数据
       * @private
       * @returns {openBSE~BulletScreen} 引发事件的弹幕的数据：一个 {@link openBSE~BulletScreen} 结构。（注意：不要试图与[添加弹幕]{@link openBSE.BulletScreenEngine#addBulletScreen}时创建的对象进行比较，这个对象是克隆得到的，并不相等。正确的方法是在添加弹幕时一并插入 id 等自定义字段来唯一标识一条弹幕。）
       */
      getBulletScreen: function getBulletScreen() {
        return _helper["default"].clone(realTimeBulletScreen.bulletScreen);
      },

      /**
       * 设置引发事件的弹幕弹幕的数据
       * @private
       * @param {openBSE~BulletScreen} bulletScreen - 引发事件的弹幕的数据：一个 {@link openBSE~BulletScreen} 结构。设置此参数以便动态调整弹幕样式，但是一些参数在事件中修改无效，查看此结构的说明以了解详情。
       * @param {boolean} [redraw=false] - 是否重绘弹幕：此参数在每次引发事件时的初始值为 false ，如果修改了 bulletScreen 中的值，此参数必须设为 true 。
       */
      setBulletScreen: function setBulletScreen(bulletScreen) {
        var redraw = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        if (typeof redraw != 'boolean') throw new TypeError(_resources["default"].PARAMETERS_TYPE_ERROR);

        var bulletScreenType = _helper["default"].clone(_bulletScreenType);

        bulletScreenType.style = _optionsType.defaultStyle;
        realTimeBulletScreen.bulletScreen = _helper["default"].setValues(bulletScreen, realTimeBulletScreen.bulletScreen, bulletScreenType);
        if (redraw === true) _renderer.reCreatAndgetWidth(realTimeBulletScreen);
        if (!_playing && redraw) _renderer.draw();
      },

      /**
       * 获取引发事件的弹幕的播放状态
       * @private
       * @returns {boolean} 取引发事件的弹幕是否在播放/移动：如果设置为 true 则该弹幕暂停，直到将此参数设为 false 或调用 {@link openBSE.BulletScreenEngine#playAllBulletScreens} 方法。
       */
      getPlayState: function getPlayState() {
        return !realTimeBulletScreen.pause;
      },

      /**
       * 设置引发事件的弹幕的播放状态
       * @private
       * @param {boolean} paly - 是否继续播放/移动引发事件的弹幕：读取此参数可判断这条弹幕是否处于暂停状态。
       */
      setPlayState: function setPlayState(play) {
        if (typeof play != 'boolean') throw new TypeError(_resources["default"].PARAMETERS_TYPE_ERROR);
        realTimeBulletScreen.pause = !play;
      },
      screenX: e.screenX,
      screenY: e.screenY,
      pageX: e.pageX,
      pageY: e.pageY,
      clientX: e.clientX,
      clientY: e.clientY
    });
  }
  /**
   * 刷新弹幕函数
   * @private
   */


  function refresh() {
    var nowTime = new Date().getTime();
    if (_lastRefreshTime != null) _refreshRate = 1 / (nowTime - _lastRefreshTime);
    _lastRefreshTime = nowTime;
    addrealTimeBulletScreens();
    moverealTimeBulletScreen();

    _renderer.draw();

    if (_playing) requestAnimationFrame(refresh);
  }
  /**
   * 移动弹幕函数
   * @private
   */


  function moverealTimeBulletScreen() {
    _realTimeBulletScreens.forEach(function (node) {
      var realTimeBulletScreen = node.element;
      if (realTimeBulletScreen.pause) return;

      var nowTime = _options.clock();

      switch (realTimeBulletScreen.type) {
        case _generalType["default"].rightToLeft:
          if (realTimeBulletScreen.x > -realTimeBulletScreen.width) {
            realTimeBulletScreen.x -= realTimeBulletScreen.bulletScreen.style.speed * _options.playSpeed / _refreshRate;
          } else {
            _renderer["delete"](realTimeBulletScreen);

            return {
              remove: true
            };
          }

          break;

        case _generalType["default"].leftToRight:
          if (realTimeBulletScreen.x < _elementSize.width) {
            realTimeBulletScreen.x += realTimeBulletScreen.bulletScreen.style.speed * _options.playSpeed / _refreshRate;
          } else {
            _renderer["delete"](realTimeBulletScreen);

            return {
              remove: true
            };
          }

          break;

        case _generalType["default"].top:
        case _generalType["default"].bottom:
          if (realTimeBulletScreen.endTime < nowTime) {
            _renderer["delete"](realTimeBulletScreen);

            return {
              remove: true
            };
          }

          break;
      }
    }, true);
  }
  /**
   * 添加弹幕到实时弹幕列表
   * @private
   */


  function addrealTimeBulletScreens() {
    if (_realTimeBulletScreens.length === 0) _delay = 0;
    var times = Math.floor(_refreshRate * 2000);

    do {
      var node = _bulletScreenBuffer.pop(false, false);

      if (node === null) return;
      var bulletScreen = node.element;

      var nowTime = _options.clock();

      if (bulletScreen.startTime > nowTime) return;

      if (!_options.timeOutDiscard || !bulletScreen.canDiscard || bulletScreen.startTime > nowTime - Math.floor(1 / _refreshRate) * 60) {
        bulletScreen.style = _helper["default"].setValues(bulletScreen.style, _options.defaultStyle, _optionsType.defaultStyle);
        getRealTimeBulletScreen(nowTime, bulletScreen);
      } else _delayBulletScreenCount++;

      node.remove();
      times--;
    } while (_realTimeBulletScreens.length === 0 || times > 0);
  }
  /**
   * 生成实时弹幕对象
   * @private
   * @param {number} nowTime - 当前时间
   * @param {openBSE~BulletScreen} bulletScreen - 弹幕的链表节点
   */


  function getRealTimeBulletScreen(nowTime, bulletScreen) {
    _delay = nowTime - bulletScreen.startTime;
    var realTimeBulletScreen = {};
    realTimeBulletScreen.pause = false;
    realTimeBulletScreen.bulletScreen = bulletScreen;
    realTimeBulletScreen.startTime = nowTime;
    realTimeBulletScreen.size = bulletScreen.style.size;
    realTimeBulletScreen.type = bulletScreen.type;
    realTimeBulletScreen.height = realTimeBulletScreen.size;

    _renderer.creatAndgetWidth(realTimeBulletScreen);

    switch (bulletScreen.type) {
      case _generalType["default"].rightToLeft:
        realTimeBulletScreen.endTime = Math.round(nowTime + (_elementSize.width + realTimeBulletScreen.width) / (bulletScreen.style.speed * _options.playSpeed));
        realTimeBulletScreen.x = _elementSize.width;
        realTimeBulletScreen.y = _options.verticalInterval;
        break;

      case _generalType["default"].leftToRight:
        realTimeBulletScreen.endTime = Math.round(nowTime + (_elementSize.width + realTimeBulletScreen.width) / (bulletScreen.style.speed * _options.playSpeed));
        realTimeBulletScreen.x = -realTimeBulletScreen.width;
        realTimeBulletScreen.y = _options.verticalInterval;
        break;

      case _generalType["default"].top:
        realTimeBulletScreen.endTime = realTimeBulletScreen.startTime + bulletScreen.style.residenceTime * _options.playSpeed;
        realTimeBulletScreen.x = Math.round((_elementSize.width - realTimeBulletScreen.width) / 2);
        realTimeBulletScreen.y = _options.verticalInterval;
        break;

      case _generalType["default"].bottom:
        realTimeBulletScreen.endTime = realTimeBulletScreen.startTime + bulletScreen.style.residenceTime * _options.playSpeed;
        realTimeBulletScreen.x = Math.round((_elementSize.width - realTimeBulletScreen.width) / 2);
        realTimeBulletScreen.y = -_options.verticalInterval - realTimeBulletScreen.height;
        break;
    }

    var newNode = new _linkedList["default"].node(realTimeBulletScreen);

    if (bulletScreen.type === _generalType["default"].top || bulletScreen.type === _generalType["default"].bottom) {
      _realTimeBulletScreens.forEach(function (node) {
        var nextrealTimeBulletScreen = node.element;
        if (nextrealTimeBulletScreen.bulletScreen.type != bulletScreen.type) return;

        if (bulletScreen.type === _generalType["default"].top) {
          if (realTimeBulletScreen.y + realTimeBulletScreen.height < nextrealTimeBulletScreen.y) {
            setActualY(realTimeBulletScreen);
            return {
              add: {
                addToUp: true,
                node: newNode
              },
              stop: true
            };
          }

          if (nextrealTimeBulletScreen.endTime < nowTime) realTimeBulletScreen.y = nextrealTimeBulletScreen.y;else realTimeBulletScreen.y = nextrealTimeBulletScreen.y + nextrealTimeBulletScreen.height + _options.verticalInterval;
        } else {
          if (realTimeBulletScreen.y > nextrealTimeBulletScreen.y + nextrealTimeBulletScreen.height) {
            setActualY(realTimeBulletScreen);
            return {
              add: {
                addToUp: true,
                node: newNode
              },
              stop: true
            };
          }

          if (nextrealTimeBulletScreen.endTime < nowTime) realTimeBulletScreen.y = nextrealTimeBulletScreen.y;else realTimeBulletScreen.y = nextrealTimeBulletScreen.y - realTimeBulletScreen.height - _options.verticalInterval;
        }
      }, true);
    } else {
      var realTimeBulletScreenWidthTime = realTimeBulletScreen.width / (bulletScreen.style.speed * _options.playSpeed);

      _realTimeBulletScreens.forEach(function (node) {
        var nextrealTimeBulletScreen = node.element;
        if (nextrealTimeBulletScreen.bulletScreen.type === _generalType["default"].top || nextrealTimeBulletScreen.bulletScreen.type === _generalType["default"].bottom) return;

        if (realTimeBulletScreen.y + realTimeBulletScreen.height < nextrealTimeBulletScreen.y) {
          setActualY(realTimeBulletScreen);
          return {
            add: {
              addToUp: true,
              node: newNode
            },
            stop: true
          };
        }

        var nextrealTimeBulletScreenWidthTime = nextrealTimeBulletScreen.width / (nextrealTimeBulletScreen.bulletScreen.style.speed * _options.playSpeed);
        if (nextrealTimeBulletScreen.startTime + nextrealTimeBulletScreenWidthTime >= nowTime || nextrealTimeBulletScreen.endTime >= realTimeBulletScreen.endTime - realTimeBulletScreenWidthTime) realTimeBulletScreen.y = nextrealTimeBulletScreen.y + nextrealTimeBulletScreen.height + _options.verticalInterval;else realTimeBulletScreen.y = nextrealTimeBulletScreen.y;
      }, true);
    }

    if (newNode.linkedList === null) {
      setActualY(realTimeBulletScreen);

      _realTimeBulletScreens.push(newNode, false);
    }
  }
  /**
   * 设置真实的Y坐标
   * @private
   * @param {object} realTimeBulletScreen - 实时弹幕事件
   * @returns {object} 实时弹幕事件
   */


  function setActualY(realTimeBulletScreen) {
    var bulletScreen = realTimeBulletScreen.bulletScreen;

    if (bulletScreen.type === _generalType["default"].leftToRight || bulletScreen.type === _generalType["default"].rightToLeft || bulletScreen.type === _generalType["default"].top) {
      realTimeBulletScreen.actualY = realTimeBulletScreen.y % (_elementSize.height - realTimeBulletScreen.height);
    } else if (bulletScreen.type === _generalType["default"].bottom) {
      realTimeBulletScreen.actualY = _elementSize.height + realTimeBulletScreen.y % _elementSize.height;
    }
  }
  /**
   * 设置尺寸
   * @private
   */


  function setSize() {
    var devicePixelRatio = _helper["default"].getDevicePixelRatio();

    if (_oldDevicePixelRatio != devicePixelRatio || _oldClientWidth != element.clientWidth || _oldClientHeight != element.clientHeight || _oldScaling != _options.scaling) {
      _oldScaling = _options.scaling;
      _elementSize.width = element.clientWidth / _options.scaling;
      _elementSize.height = element.clientHeight / _options.scaling;
      _oldClientWidth = element.clientWidth;
      _oldClientHeight = element.clientHeight;
      _oldDevicePixelRatio = devicePixelRatio;

      _renderer.setSize();

      if (!_playing) _renderer.draw();
    }
  }

  if (!!window.ActiveXObject || "ActiveXObject" in window || navigator.userAgent.indexOf("Trident") > -1 || navigator.userAgent.indexOf("MSIE") > -1 || navigator.userAgent.indexOf("Edge") > -1) console.info(_resources["default"].LOADED_INFO_IE.fillData(build));else console.info(_resources["default"].LOADED_INFO.fillData(build), 'font-weight:bold; color:#0099FF;', '', 'font-style:italic;', '');
};

exports["default"] = GeneralEngine;


},{"../build.json":2,"../lib/event":7,"../lib/helper":8,"../lib/linkedList":9,"../lib/resources":11,"../renderers/renderersFactory":18,"./generalType":5,"core-js/modules/es.array.for-each":131,"core-js/modules/es.array.index-of":132,"core-js/modules/es.date.to-string":136,"core-js/modules/es.function.bind":137,"core-js/modules/es.object.define-property":142,"core-js/modules/es.object.get-own-property-descriptor":143,"core-js/modules/web.dom-collections.for-each":180,"core-js/modules/web.timers":182}],5:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * 弹幕类型枚举
 * @alias openBSE.GeneralType
 * @readonly
 * @enum {number}
 */
var GeneralType = {
  /** 
   * 从右到左弹幕
   * @readonly
   */
  rightToLeft: 1,

  /** 
   * 从左到右弹幕（逆向弹幕）
   * @readonly
   */
  leftToRight: 2,

  /** 
   * 顶部弹幕
   * @readonly
   */
  top: 4,

  /** 
   * 底部弹幕
   * @readonly
   */
  bottom: 8
};
var _default = GeneralType;
exports["default"] = _default;


},{"core-js/modules/es.object.define-property":142}],6:[function(require,module,exports){
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.date.to-string");

require("core-js/modules/es.function.bind");

require("core-js/modules/es.function.name");

require("core-js/modules/es.map");

require("core-js/modules/es.object.create");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-prototype-of");

require("core-js/modules/es.object.set-prototype-of");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.reflect.construct");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _resources = _interopRequireDefault(require("../lib/resources"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/** 
 * 浏览器不支持所引发的错误
 * @deprecated 浏览器不支持所引发的错误。有关基类的详细信息，请参阅 MDN [Error]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error} 。
 * @alias openBSE.BrowserNotSupportError
 * @extends Error
 */
var BrowserNotSupportError = function (_Error) {
  _inherits(BrowserNotSupportError, _Error);

  /**
   * 创建一个异常对象
   * @param {string} message - 消息
   */
  function BrowserNotSupportError(message) {
    var _this;

    _classCallCheck(this, BrowserNotSupportError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BrowserNotSupportError).call(this, _resources["default"].BROWSER_NOT_SUPPORT_ERROR.fillData({
      message: message
    })));
    _this.name = "BrowserNotSupportError";
    return _this;
  }

  return BrowserNotSupportError;
}(_wrapNativeSuper(Error));

exports["default"] = BrowserNotSupportError;


},{"../lib/resources":11,"core-js/modules/es.array.index-of":132,"core-js/modules/es.array.iterator":133,"core-js/modules/es.date.to-string":136,"core-js/modules/es.function.bind":137,"core-js/modules/es.function.name":138,"core-js/modules/es.map":139,"core-js/modules/es.object.create":141,"core-js/modules/es.object.define-property":142,"core-js/modules/es.object.get-prototype-of":144,"core-js/modules/es.object.set-prototype-of":145,"core-js/modules/es.object.to-string":146,"core-js/modules/es.reflect.construct":147,"core-js/modules/es.regexp.to-string":150,"core-js/modules/es.string.iterator":151,"core-js/modules/es.symbol":155,"core-js/modules/es.symbol.description":153,"core-js/modules/es.symbol.iterator":154,"core-js/modules/web.dom-collections.iterator":181}],7:[function(require,module,exports){
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.splice");

require("core-js/modules/es.function.bind");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _resources = _interopRequireDefault(require("./resources"));

var _helper = _interopRequireDefault(require("./helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 事件模型类
 */
var Event =
/**
 * 创建一个新的事件模型。
 */
function Event() {
  _classCallCheck(this, Event);

  /**
   * 事件列表
   * @private
   */
  var eventList = {};
  /**
   * 添加事件
   * @public
   * @param {string} name - 事件名称
   * @throws {TypeError} 传入的参数错误或事件已存在时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
   */

  this.add = function (name) {
    if (typeof name != 'string') throw new TypeError(_resources["default"].PARAMETERS_TYPE_ERROR);
    if (typeof eventList[name] != 'undefined') throw new TypeError(_resources["default"].EVENT_ALREADY_EXISTS_ERROR);
    eventList[name] = [];
  };
  /**
   * 删除事件
   * @public
   * @param {string} name - 事件名称
   * @throws {TypeError} 传入的参数错误或事件不存在时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
   */


  this.remove = function (name) {
    if (typeof name != 'string') throw new TypeError(_resources["default"].PARAMETERS_TYPE_ERROR);
    if (typeof eventList[name] === 'undefined') throw new TypeError(_resources["default"].EVENT_NAME_NOT_FOUND);
    delete eventList[name];
  };
  /**
   * 绑定事件处理程序
   * @public
   * @param {string} name - 事件名称
   * @param {function} fun - 事件处理程序
   * @returns {number} 添加后的事件数
   * @throws {TypeError} 传入的参数错误或事件不存在时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
   */


  this.bind = function (name, fun) {
    if (typeof name != 'string' || typeof fun != 'function') throw new TypeError(_resources["default"].PARAMETERS_TYPE_ERROR);
    var event = eventList[name];
    if (typeof event === 'undefined') throw new TypeError(_resources["default"].EVENT_NAME_NOT_FOUND);

    for (var index in event) {
      if (event[index] === fun) return false;
    }

    return event.unshift(fun);
  };
  /**
   * 解绑事件处理程序（fun为空解绑所有事件处理程序）
   * @public
   * @param {string} name - 事件名称
   * @param {function} fun - 事件处理程序
   * @returns {number} 删除后的事件数
   * @throws {TypeError} 传入的参数错误或事件不存在时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
   */


  this.unbind = function (name, fun) {
    if (typeof name != 'string') throw new TypeError(_resources["default"].PARAMETERS_TYPE_ERROR);
    var event = eventList[name];
    if (typeof event === 'undefined') throw new TypeError(_resources["default"].EVENT_NAME_NOT_FOUND);
    if (typeof fun == 'function') for (var index in event) {
      if (event[index] === fun) {
        event.splice(fun, 1);
        return event.length;
      }
    } else eventList[name] = [];
  };
  /**
   * 触发事件
   * @public
   * @param {string} name - 事件名称
   * @param {object} e - 事件数据
   * @throws {TypeError} 传入的参数错误或事件不存在时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
   */


  this.trigger = function (name, e) {
    if (typeof name != 'string' || _helper["default"]._typeof(e) != 'object') throw new TypeError(_resources["default"].PARAMETERS_TYPE_ERROR);
    var event = eventList[name];
    if (typeof event === 'undefined') throw new TypeError(_resources["default"].EVENT_NAME_NOT_FOUND);
    e.type = name;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = event[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var fun = _step.value;
        if (!fun(e)) return;
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

    return;
  };
};

exports["default"] = Event;


},{"./helper":8,"./resources":11,"core-js/modules/es.array.iterator":133,"core-js/modules/es.array.splice":135,"core-js/modules/es.function.bind":137,"core-js/modules/es.object.define-property":142,"core-js/modules/es.object.to-string":146,"core-js/modules/es.string.iterator":151,"core-js/modules/es.symbol":155,"core-js/modules/es.symbol.description":153,"core-js/modules/es.symbol.iterator":154,"core-js/modules/web.dom-collections.iterator":181}],8:[function(require,module,exports){
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.slice");

require("core-js/modules/es.date.to-string");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _resources = _interopRequireDefault(require("./resources"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * 设置值
 * @alias Helper.setValue
 * @param {*} value - 值
 * @param {*} defaultValue - 默认值
 * @param {string} type - 类型
 * @returns {*} - 值
 */
function setValue(value, defaultValue, type) {
  var returnValue;
  if (isEmpty(value)) returnValue = clone(defaultValue);else returnValue = clone(value);
  if (!isEmpty(type)) checkType(returnValue, type);else if (!isEmpty(defaultValue)) checkType(returnValue, _typeof(defaultValue));
  return returnValue;
}
/**
 * 设置多个值
 * @alias Helper.setValues
 * @param {object} values - 值
 * @param {object} defaultValues - 默认值
 * @param {object} types - 类型
 * @returns {object} - 值
 */


function setValues(values, defaultValues, types) {
  var clone = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var returnValues = clone ? setValue(values, {}) : defaultValues;

  var _values = clone ? returnValues : setValue(values, {});

  for (var key in defaultValues) {
    if (_typeof(defaultValues[key]) === 'object') returnValues[key] = setValues(_values[key], defaultValues[key], types[key]);else returnValues[key] = setValue(_values[key], defaultValues[key], types[key]);
  }

  return returnValues;
}
/**
 * 检查类型
 * @alias Helper.checkType
 * @param {string} value - 值
 * @param {string} type - 类型
 * @param {boolean} canBeNull - 可以为空
 */


function checkType(value, type) {
  var canBeNull = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  if (typeof type != 'string' && _typeof(type) != 'array') throw new TypeError(_resources["default"].PARAMETERS_TYPE_ERROR);
  if (canBeNull && isEmpty(value)) return;

  if (_typeof(type) === 'array') {
    var flat = false;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = type[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;
        if (typeof item != 'string') throw new TypeError(_resources["default"].PARAMETERS_TYPE_ERROR);

        if (_typeof(value) === item) {
          flat = true;
          break;
        }
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

    if (!flat) throw new TypeError(_resources["default"].PARAMETERS_TYPE_ERROR);
  } else if (_typeof(value) != type) throw new TypeError(_resources["default"].PARAMETERS_TYPE_ERROR);
}
/**
 * 检查多个值
 * @alias Helper.checkTypes
 * @param {object} values - 值
 * @param {object} types - 类型
 * @returns {object} - 值
 */


function checkTypes(values, types) {
  var canBeNull = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  if (canBeNull && isEmpty(values)) return;

  for (var key in types) {
    if (_typeof(types[key]) === 'object') checkTypes(values[key], types[key]);else checkType(values[key], types[key], canBeNull);
  }
}
/**
 * 检查是否为空
 * @alias Helper.isEmpty
 * @param {*} value - 值
 */


function isEmpty(value) {
  return typeof value === 'undefined' || typeof value === 'number' && isNaN(value) || value === null;
}
/**
 * 获取对象的类型（可区分数组等）
 * @alias Helper._typeof
 * @param {*} object - 对象
 */


function _typeof(object) {
  return Object.prototype.toString.call(object).slice(8, -1).toLowerCase();
}
/**
 * 克隆对象
 * @param {*} object 
 */


function clone(object) {
  var result,
      type = _typeof(object);

  if (type === 'object') result = {};else if (type === 'array') result = [];else return object;

  for (var key in object) {
    result[key] = clone(object[key]);
  }

  return result;
}
/**
 * 清空元素
 * @param {Element} element 
 */


function cleanElement(element) {
  var lastChild;

  while ((lastChild = element.lastChild) != null) {
    element.removeChild(lastChild);
  }
}
/**
 * 获取屏幕的设备像素比
 * @param {boolean} showWarn - 显示警告
 */


function getDevicePixelRatio() {
  var showWarn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  if (typeof window.devicePixelRatio === 'number') return window.devicePixelRatio;
  if (typeof window.screen.deviceXDPI === 'number' && typeof window.screen.logicalXDPI === 'number') return screen.deviceXDPI / screen.logicalXDPI;
  if (showWarn) console.warn(_resources["default"].DEVICEPIXELRATIO_NOT_SUPPORT_WARN);
  return 1;
}
/**
 * 帮助对象
 * @namespace
 */


var Helper = {
  setValue: setValue,
  setValues: setValues,
  checkType: checkType,
  checkTypes: checkTypes,
  isEmpty: isEmpty,
  _typeof: _typeof,
  clone: clone,
  cleanElement: cleanElement,
  getDevicePixelRatio: getDevicePixelRatio
};
var _default = Helper;
exports["default"] = _default;


},{"./resources":11,"core-js/modules/es.array.iterator":133,"core-js/modules/es.array.slice":134,"core-js/modules/es.date.to-string":136,"core-js/modules/es.object.define-property":142,"core-js/modules/es.object.to-string":146,"core-js/modules/es.regexp.to-string":150,"core-js/modules/es.string.iterator":151,"core-js/modules/es.symbol":155,"core-js/modules/es.symbol.description":153,"core-js/modules/es.symbol.iterator":154,"core-js/modules/web.dom-collections.iterator":181}],9:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * 双向链表类
 */
var LinkedList = function () {
  /**
   * 创建一个双向链表。
   */
  function LinkedList() {
    _classCallCheck(this, LinkedList);

    this._topNode = new LinkedList.node(null);
    this._bottomNode = new LinkedList.node(null);
    this._length = 0;
    this._topNode._next = this._bottomNode;
    this._bottomNode._previous = this._topNode;
    this._topNode._linkedList = this._bottomNode._linkedList = this;
  }
  /**
   * 获取元素个数
   * @returns {number} 元素个数
   */


  _createClass(LinkedList, [{
    key: "push",

    /**
     * 插入节点
     * @param {*} node - 节点
     * @param {boolean} top - true: 插入到顶部 false: 插入到底部
     */
    value: function push(node) {
      var top = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      if (node._linkedList != null && node._linkedList != this) return false;
      if (top) return this._topNode.add(node, false);else return this._bottomNode.add(node, true);
    }
    /**
     * 读取元素
     * @param {boolean} remove - 读取后是否删除
     * @param {boolean} top - true: 读取顶部 false: 读取底部
     * @returns {*} 节点
     */

  }, {
    key: "pop",
    value: function pop() {
      var remove = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var top = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var thisNode;
      if (top) thisNode = this._topNode.next;else thisNode = this._bottomNode.previous;
      if (thisNode != null && remove) thisNode.remove();
      return thisNode;
    }
    /**
     * 清空链表
     */

  }, {
    key: "clean",
    value: function clean() {
      this._topNode._next = this._bottomNode;
      this._bottomNode._previous = this._topNode;
      this._length = 0;
    }
    /**
     * 遍历链表
     * @param {function} fun - 遍历回调函数
     * 回调函数（参数：元素，返回：{remove：删除此元素，add:插入节点(add.addToUp:插入到上方, add.node:节点), stop：停止遍历}）
     * @param {boolean} topToBottom - true: 从顶到底 false: 从底到顶
     */

  }, {
    key: "forEach",
    value: function forEach(fun, topToBottom) {
      var thisNode = topToBottom ? this._topNode : this._bottomNode;
      var nextNode = topToBottom ? thisNode._next : thisNode._previous;

      while (topToBottom ? (thisNode = nextNode) != this._bottomNode : (thisNode = nextNode) != this._topNode) {
        nextNode = topToBottom ? thisNode._next : thisNode._previous;

        var _return = fun(thisNode);

        if (_return) {
          if (_return.add) thisNode.add(_return.add.node, _return.add.addToUp);
          if (_return.remove) thisNode.remove();
          if (_return.stop) return;
        }
      }
    }
  }, {
    key: "length",
    get: function get() {
      return this._length;
    }
  }], [{
    key: "node",

    /**
     * 双向链表节点
     * @private
    */
    get: function get() {
      return function () {
        /**
         * 创建一个双向链表节点。
         * @param {*} element - 元素
         */
        function _class(element) {
          _classCallCheck(this, _class);

          this._element = element;
          this._next = null;
          this._previous = null;
          this._linkedList = null;
        }
        /**
         * 获取元素。
         */


        _createClass(_class, [{
          key: "add",

          /**
           * 添加双向链表节点。
           * @param {*} node - 节点
           * @param {*} addToUp - 插入到上方
           */
          value: function add(node) {
            var addToUp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
            node.remove();

            if (addToUp) {
              node._previous = this._previous;
              node._next = this;
              this._previous._next = node;
              this._previous = node;
            } else {
              node._previous = this;
              node._next = this._next;
              this._next._previous = node;
              this._next = node;
            }

            node._linkedList = this._linkedList;
            this._linkedList._length++;
            return true;
          }
        }, {
          key: "remove",
          value: function remove() {
            if (this._next == null || this._previous == null || this._linkedList == null) return false;
            this._previous._next = this._next;
            this._next._previous = this._previous;
            this._next = this._previous = null;
            this._linkedList._length--;
            this._linkedList = null;
            return true;
          }
        }, {
          key: "element",
          get: function get() {
            return this._element;
          }
          /**
           * 获取双向链表。
           */

        }, {
          key: "linkedList",
          get: function get() {
            return this._linkedList;
          }
          /**
           * 获取上一个双向链表节点。
           */

        }, {
          key: "previous",
          get: function get() {
            if (this._linkedList === null || this._previous === this._linkedList._topNode) return null;else return this._previous;
          }
          /**
           * 获取下一个双向链表节点。
           */

        }, {
          key: "next",
          get: function get() {
            if (this._linkedList === null || this._next === this._linkedList._bottomNode) return null;else return this._next;
          }
        }]);

        return _class;
      }();
    }
  }]);

  return LinkedList;
}();

exports["default"] = LinkedList;


},{"core-js/modules/es.object.define-property":142}],10:[function(require,module,exports){
module.exports={
    "EVENT_NAME_NOT_FOUND_ERROR": "Event name not found.",
    "EVENT_ALREADY_EXISTS_ERROR": "Event already exists.",
    "PARAMETERS_TYPE_ERROR": "Parameters type error.",
    "RENDER_MODE_ERROR": "The render mode \"{renderMode}\" is undefined.",
    "BROWSER_NOT_SUPPORT_ERROR": "This browser does not support \"{message}\".",
    "REQUESTANIMATIONFRAME_NOT_SUPPORT_WARN": "Your browser does not support method \"requestAnimationFrame\" and will switch to method \"setTimeout\", which may affect performance.",
    "DEVICEPIXELRATIO_NOT_SUPPORT_WARN": "Your browser does not support variable \"devicePixelRatio\", which may cause canvas unable to display properly in high DPI mode. It is recommended to use CSS3 render mode.",
    "LOADED_INFO": "%c{name}%c now loaded.\n\n%cVersion: {version}\nBuild Date: {buildDate}\n\n%c{description}\nHome: {home}",
    "LOADED_INFO_IE": "{name} now loaded.\n\nVersion: {version}\nBuild Date: {buildDate}\n\n{description}\nHome: {home}"
}
},{}],11:[function(require,module,exports){
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.constructor");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.string.replace");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Resources = _interopRequireWildcard(require("./resources.json"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * 数据填充（占位符拼接）
 * @param {object|...string} sign - 一组字符串或一个对象
 */
function fillData() {
  if (arguments.length === 0) return this;
  var param = arguments[0],
      str = this;

  if (_typeof(param) === 'object') {
    for (var key in param) {
      str = str.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
    }

    return str;
  } else {
    for (var i = 0; i < arguments.length; i++) {
      str = str.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
    }

    return str;
  }
}

for (var key in Resources) {
  if (typeof Resources[key] === 'string') {
    Resources[key] = new String(Resources[key]);
    Resources[key].fillData = fillData;
  }
}

var _default = Resources;
exports["default"] = _default;


},{"./resources.json":10,"core-js/modules/es.array.iterator":133,"core-js/modules/es.object.define-property":142,"core-js/modules/es.object.get-own-property-descriptor":143,"core-js/modules/es.object.to-string":146,"core-js/modules/es.regexp.constructor":148,"core-js/modules/es.regexp.exec":149,"core-js/modules/es.regexp.to-string":150,"core-js/modules/es.string.iterator":151,"core-js/modules/es.string.replace":152,"core-js/modules/es.symbol":155,"core-js/modules/es.symbol.description":153,"core-js/modules/es.symbol.iterator":154,"core-js/modules/web.dom-collections.iterator":181}],12:[function(require,module,exports){
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
   * @param {object} realTimeBulletScreen - 实时弹幕对象
   */


  this.creatAndgetWidth = function (realTimeBulletScreen) {
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
   * 重新添加弹幕
   * @abstract
   * @param {object} realTimeBulletScreen - 实时弹幕对象
   */


  this.reCreatAndgetWidth = function (realTimeBulletScreen) {
    throw new SyntaxError();
  };
  /**
   * 检查弹幕是否被隐藏
   * @param {object} realTimeBulletScreen - 实时弹幕对象
   */


  this.checkWhetherHide = function (realTimeBulletScreen) {
    return (realTimeBulletScreen.bulletScreen.type & options.hiddenTypes) === realTimeBulletScreen.bulletScreen.type;
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


},{"core-js/modules/es.array.concat":130,"core-js/modules/es.object.define-property":142}],13:[function(require,module,exports){
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.create");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-prototype-of");

require("core-js/modules/es.object.set-prototype-of");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _generalBaseRenderer = _interopRequireDefault(require("./generalBaseRenderer"));

var _linkedList = _interopRequireDefault(require("../lib/linkedList"));

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
 * Canvas 渲染器抽象类
 */
var GeneralCanvasBaseRenderer = function (_GeneralBaseRenderer) {
  _inherits(GeneralCanvasBaseRenderer, _GeneralBaseRenderer);

  /**
   * 实例化一个 Canvas 渲染器抽象类
   * @param {object} element - Element 元素
   * @param {openBSE~Options} options - 全局选项
   * @param {object} elementSize - 元素大小
   * @param {function} eventTrigger - 事件引发方法
   */
  function GeneralCanvasBaseRenderer(element, options, elementSize, eventTrigger) {
    var _this;

    _classCallCheck(this, GeneralCanvasBaseRenderer);

    if ((this instanceof GeneralCanvasBaseRenderer ? this.constructor : void 0) === GeneralCanvasBaseRenderer) {
      throw new SyntaxError();
    }
    /**
     * 屏幕上的弹幕
     * @private @type {LinkedList}
     */


    var _bulletScreensOnScreen = new _linkedList["default"]();
    /**
     * DPI 缩放比例（倍数）
     * @private @type {number}
     */


    var _devicePixelRatio = _helper["default"].getDevicePixelRatio(true);

    _devicePixelRatio *= options.scaling;
    /**
     * 画布元素
     * @private @type {Element}
     */

    var _canvas = init();

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GeneralCanvasBaseRenderer).call(this, _canvas, options, elementSize));
    /**
     * 清除屏幕内容
     * @function
     * @override
     */

    _this.cleanScreen = function () {
      return _bulletScreensOnScreen.clean();
    };
    /**
     * 创建弹幕元素
     * @override
     * @param {object} realTimeBulletScreen - 实时弹幕对象
     */


    _this.creatAndgetWidth = function (realTimeBulletScreen) {
      var bulletScreen = realTimeBulletScreen.bulletScreen;
      var hideCanvas = document.createElement('canvas');
      var hideCanvasContext = hideCanvas.getContext('2d');
      hideCanvasContext.font = "".concat(bulletScreen.style.fontWeight, " ").concat(realTimeBulletScreen.size, "px ").concat(bulletScreen.style.fontFamily);
      realTimeBulletScreen.width = hideCanvasContext.measureText(bulletScreen.text).width;
      hideCanvas.width = (realTimeBulletScreen.width + 8) * _devicePixelRatio;
      hideCanvas.height = (realTimeBulletScreen.height + 8) * _devicePixelRatio;
      hideCanvasContext.shadowColor = 'black';
      hideCanvasContext.font = "".concat(bulletScreen.style.fontWeight, " ").concat(realTimeBulletScreen.size * _devicePixelRatio, "px ").concat(bulletScreen.style.fontFamily);
      var textX = 4 * _devicePixelRatio;
      var textY = (4 + realTimeBulletScreen.size * 0.8) * _devicePixelRatio;

      if (bulletScreen.style.color != null) {
        hideCanvasContext.shadowBlur = (bulletScreen.style.shadowBlur + 0.5) * _devicePixelRatio;
        hideCanvasContext.fillStyle = bulletScreen.style.color;
        hideCanvasContext.fillText(bulletScreen.text, textX, textY);
      }

      if (bulletScreen.style.borderColor != null) {
        hideCanvasContext.shadowBlur = 0;
        hideCanvasContext.lineWidth = 0.5 * _devicePixelRatio;
        hideCanvasContext.strokeStyle = bulletScreen.style.borderColor;
        hideCanvasContext.strokeText(bulletScreen.text, textX, textY);
      }

      if (bulletScreen.style.boxColor != null) {
        hideCanvasContext.shadowBlur = 0;
        hideCanvasContext.lineWidth = _devicePixelRatio;
        hideCanvasContext.strokeStyle = bulletScreen.style.boxColor;
        hideCanvasContext.strokeRect(_devicePixelRatio, _devicePixelRatio, hideCanvas.width - _devicePixelRatio, hideCanvas.height - _devicePixelRatio);
      }

      realTimeBulletScreen.hideCanvas = hideCanvas;
      realTimeBulletScreen.linkedListNode = new _linkedList["default"].node(realTimeBulletScreen);

      _bulletScreensOnScreen.forEach(function (node) {
        var _realTimeBulletScreen = node.element;
        if (_realTimeBulletScreen.bulletScreen.layer <= bulletScreen.layer) return {
          add: {
            node: realTimeBulletScreen.linkedListNode,
            addToUp: false
          },
          stop: true
        };
      }, false);

      if (realTimeBulletScreen.linkedListNode.linkedList === null) _bulletScreensOnScreen.push(realTimeBulletScreen.linkedListNode, false);
    };
    /**
     * 删除弹幕元素
     * @override
     * @param {object} realTimeBulletScreen - 实时弹幕对象
     */


    _this["delete"] = function (realTimeBulletScreen) {
      return realTimeBulletScreen.linkedListNode.remove();
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

    var _setSize = _this.setSize;
    /**
     * 设置尺寸
     * @override
     */

    _this.setSize = function () {
      _setSize();

      _devicePixelRatio = _helper["default"].getDevicePixelRatio();
      _devicePixelRatio *= options.scaling;
      _canvas.width = elementSize.width * _devicePixelRatio;
      _canvas.height = elementSize.height * _devicePixelRatio;
    };
    /**
     * 获取缩放比例
     * @returns {number} 缩放比例
     */


    _this.getDevicePixelRatio = function () {
      return _devicePixelRatio;
    };
    /**
     * 获取画布对象
     * @returns {Element} 画布对象
     */


    _this.getCanvas = function () {
      return _canvas;
    };
    /**
     * 获取实时弹幕对象
     * @returns {LinkedList} 画布对象
     */


    _this.getBulletScreensOnScreen = function () {
      return _bulletScreensOnScreen;
    };
    /**
     * 添加Canvas
     * @private
     * @returns {Element} 画布对象
     */


    function init() {
      var canvas = document.createElement('canvas');

      _helper["default"].cleanElement(element);

      element.appendChild(canvas);
      canvas.width = elementSize.width * _devicePixelRatio;
      canvas.height = elementSize.height * _devicePixelRatio;
      registerEvent(canvas);
      return canvas;
    }

    var _checkWhetherHide = _this.checkWhetherHide;
    /**
     * 注册事件响应程序
     * @private
     * @param {Element} element - 元素
     */

    function registerEvent(element) {
      function getrealTimeBulletScreenByLocation(location) {
        var _realTimeBulletScreen = null;

        _bulletScreensOnScreen.forEach(function (node) {
          var realTimeBulletScreen = node.element;
          if (_checkWhetherHide(realTimeBulletScreen)) return;
          var x1 = realTimeBulletScreen.x - 4;
          var x2 = x1 + realTimeBulletScreen.width + 8;
          var y1 = realTimeBulletScreen.actualY - 4;
          var y2 = y1 + realTimeBulletScreen.height + 8;

          if (location.x >= x1 && location.x <= x2 && location.y >= y1 && location.y <= y2) {
            _realTimeBulletScreen = realTimeBulletScreen;
            return {
              stop: true
            };
          }
        }, false);

        return _realTimeBulletScreen;
      }

      function getLocation(e) {
        function getOffsetTop(element) {
          var offsetTop = 0;

          do {
            offsetTop += element.offsetTop;
          } while ((element = element.offsetParent) != null);

          return offsetTop;
        }

        function getOffsetLeft(element) {
          var offsetLeft = 0;

          do {
            offsetLeft += element.offsetLeft;
          } while ((element = element.offsetParent) != null);

          return offsetLeft;
        }

        if (typeof e.offsetX === 'undefined' || e.offsetX === null) {
          if (typeof e.layerX === 'undefined' || e.layerX === null) {
            if (typeof e.pageX === 'undefined' || e.pageX === null) {
              var doc = document.documentElement,
                  body = document.body;
              e.pageX = e.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
              e.pageY = e.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
            }

            e.layerX = e.pageX - getOffsetLeft(e.target);
            e.layerY = e.pageY - getOffsetTop(e.target);
          }

          e.offsetX = e.layerX - e.target.clientLeft;
          e.offsetY = e.layerY - e.target.clientTop;
        }

        return {
          x: e.offsetX,
          y: e.offsetY
        };
      }

      element.oncontextmenu = function (e) {
        var realTimeBulletScreen = getrealTimeBulletScreenByLocation(getLocation(e));
        if (realTimeBulletScreen) eventTrigger('contextmenu', realTimeBulletScreen, e);
        return false;
      };

      element.onclick = function (e) {
        var realTimeBulletScreen = getrealTimeBulletScreenByLocation(getLocation(e));
        if (realTimeBulletScreen) eventTrigger('click', realTimeBulletScreen, e);
        return false;
      };

      element.onmousemove = function (e) {
        var realTimeBulletScreen = getrealTimeBulletScreenByLocation(getLocation(e));

        _bulletScreensOnScreen.forEach(function (node) {
          var _realTimeBulletScreen = node.element;

          if (realTimeBulletScreen != _realTimeBulletScreen && _realTimeBulletScreen.mousein) {
            _realTimeBulletScreen.mousein = false;
            element.style.cursor = '';
            eventTrigger('mouseleave', _realTimeBulletScreen, e);
          }
        }, true);

        if (realTimeBulletScreen === null || realTimeBulletScreen.mousein) return false;
        realTimeBulletScreen.mousein = true;
        element.style.cursor = options.cursorOnMouseOver;
        eventTrigger('mouseenter', realTimeBulletScreen, e);
        return false;
      };

      element.onmouseout = function (e) {
        _bulletScreensOnScreen.forEach(function (node) {
          var _realTimeBulletScreen = node.element;

          if (_realTimeBulletScreen.mousein) {
            _realTimeBulletScreen.mousein = false;
            element.style.cursor = '';
            eventTrigger('mouseleave', _realTimeBulletScreen, e);
          }
        }, true);
      };
    }

    return _this;
  }

  return GeneralCanvasBaseRenderer;
}(_generalBaseRenderer["default"]);

exports["default"] = GeneralCanvasBaseRenderer;


},{"../lib/helper":8,"../lib/linkedList":9,"./generalBaseRenderer":12,"core-js/modules/es.array.concat":130,"core-js/modules/es.array.for-each":131,"core-js/modules/es.array.iterator":133,"core-js/modules/es.object.create":141,"core-js/modules/es.object.define-property":142,"core-js/modules/es.object.get-prototype-of":144,"core-js/modules/es.object.set-prototype-of":145,"core-js/modules/es.object.to-string":146,"core-js/modules/es.string.iterator":151,"core-js/modules/es.symbol":155,"core-js/modules/es.symbol.description":153,"core-js/modules/es.symbol.iterator":154,"core-js/modules/web.dom-collections.for-each":180,"core-js/modules/web.dom-collections.iterator":181}],14:[function(require,module,exports){
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.number.to-fixed");

require("core-js/modules/es.object.create");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-prototype-of");

require("core-js/modules/es.object.set-prototype-of");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _generalCanvasBaseRenderer = _interopRequireDefault(require("./generalCanvasBaseRenderer"));

var _browserNotSupportError = _interopRequireDefault(require("../errors/browserNotSupportError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * Canvas 渲染器类
 */
var GeneralCanvasRenderer = function (_GeneralCanvasBaseRen) {
  _inherits(GeneralCanvasRenderer, _GeneralCanvasBaseRen);

  /**
   * 实例化一个 Canvas 渲染器类
   * @param {object} element - Element 元素
   * @param {openBSE~Options} options - 全局选项
   * @param {object} elementSize - 元素大小
   * @param {Event} eventTrigger - 事件引发方法
   * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
   */
  function GeneralCanvasRenderer(element, options, elementSize, eventTrigger) {
    var _this;

    _classCallCheck(this, GeneralCanvasRenderer);

    supportCheck();
    _this = _possibleConstructorReturn(this, _getPrototypeOf(GeneralCanvasRenderer).call(this, element, options, elementSize, eventTrigger));
    /**
     * 屏幕上的弹幕
     * @private @type {LinkedList}
     */

    var _bulletScreensOnScreen = _this.getBulletScreensOnScreen();

    var _cleanScreen = _this.cleanScreen;
    /**
     * 清除屏幕内容
     * @override
     */

    _this.cleanScreen = function () {
      _cleanScreen();

      var canvas = this.getCanvas();
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    };
    /**
     * 绘制函数
     * @override
     */


    _this.draw = function () {
      var _this2 = this;

      var canvas = this.getCanvas();
      var devicePixelRatio = this.getDevicePixelRatio();
      var canvasContext = canvas.getContext('2d');
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);

      _bulletScreensOnScreen.forEach(function (node) {
        var realTimeBulletScreen = node.element;
        if (_this2.checkWhetherHide(realTimeBulletScreen)) return;
        canvasContext.drawImage(realTimeBulletScreen.hideCanvas, ((realTimeBulletScreen.x - 4) * devicePixelRatio).toFixed(1), ((realTimeBulletScreen.actualY - 4) * devicePixelRatio).toFixed(1), ((realTimeBulletScreen.width + 8) * devicePixelRatio).toFixed(1), ((realTimeBulletScreen.height + 8) * devicePixelRatio).toFixed(1));
      }, true);
    };
    /**
     * 浏览器支持检测
     * @private
     * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
     */


    function supportCheck() {
      var canvas = document.createElement('canvas');
      if (typeof canvas.getContext != 'function') throw new _browserNotSupportError["default"]('Canvas');
      var context = canvas.getContext('2d');
      if (context === null) throw new _browserNotSupportError["default"]('Canvas 2D');
      if (typeof context.fillText != 'function') throw new _browserNotSupportError["default"]('Canvas 2D fillText Function');
    }

    return _this;
  }

  return GeneralCanvasRenderer;
}(_generalCanvasBaseRenderer["default"]);

exports["default"] = GeneralCanvasRenderer;


},{"../errors/browserNotSupportError":6,"./generalCanvasBaseRenderer":13,"core-js/modules/es.array.for-each":131,"core-js/modules/es.array.iterator":133,"core-js/modules/es.number.to-fixed":140,"core-js/modules/es.object.create":141,"core-js/modules/es.object.define-property":142,"core-js/modules/es.object.get-prototype-of":144,"core-js/modules/es.object.set-prototype-of":145,"core-js/modules/es.object.to-string":146,"core-js/modules/es.string.iterator":151,"core-js/modules/es.symbol":155,"core-js/modules/es.symbol.description":153,"core-js/modules/es.symbol.iterator":154,"core-js/modules/web.dom-collections.for-each":180,"core-js/modules/web.dom-collections.iterator":181}],15:[function(require,module,exports){
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


},{"../errors/browserNotSupportError":6,"../lib/helper":8,"./generalBaseRenderer":12,"core-js/modules/es.array.concat":130,"core-js/modules/es.array.iterator":133,"core-js/modules/es.number.to-fixed":140,"core-js/modules/es.object.create":141,"core-js/modules/es.object.define-property":142,"core-js/modules/es.object.get-prototype-of":144,"core-js/modules/es.object.set-prototype-of":145,"core-js/modules/es.object.to-string":146,"core-js/modules/es.string.iterator":151,"core-js/modules/es.symbol":155,"core-js/modules/es.symbol.description":153,"core-js/modules/es.symbol.iterator":154,"core-js/modules/web.dom-collections.iterator":181}],16:[function(require,module,exports){
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
 * SVG 渲染器类
 */
var GeneralSvgRenderer = function (_GeneralBaseRenderer) {
  _inherits(GeneralSvgRenderer, _GeneralBaseRenderer);

  /**
   * 实例化一个 SVG 渲染器类
   * @param {object} element - Element 元素
   * @param {openBSE~Options} options - 全局选项
   * @param {object} elementSize - 元素大小
   * @param {Event} eventTrigger - 事件引发方法
   * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
   */
  function GeneralSvgRenderer(element, options, elementSize, eventTrigger) {
    var _this;

    _classCallCheck(this, GeneralSvgRenderer);

    supportCheck();

    var _svg;

    var _defsSvg;

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GeneralSvgRenderer).call(this, init(), options, elementSize));
    /**
     * 清除屏幕内容
     * @override
     */

    _this.cleanScreen = function () {
      _helper["default"].cleanElement(_svg);

      _defsSvg = createElementSVG('defs');

      _svg.appendChild(_defsSvg);
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
        for (var _iterator = _svg.getElementsByTagName('text')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var textSvg = _step.value;
          var realTimeBulletScreen = textSvg.realTimeBulletScreen;

          for (var key in realTimeBulletScreen.svg) {
            var item = realTimeBulletScreen.svg[key];
            if (this.checkWhetherHide(realTimeBulletScreen)) item.setAttribute('opacity', '0');else item.setAttribute('opacity', '1');
            item.setAttribute('transform', "translate(".concat((realTimeBulletScreen.x - 4).toFixed(1), ",").concat((realTimeBulletScreen.actualY - 4).toFixed(1), ")"));
          }
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
      realTimeBulletScreen.svg = _typeof(realTimeBulletScreen.svg) === 'object' ? realTimeBulletScreen.svg : {};
      var textSvg = _typeof(realTimeBulletScreen.svg.text) === 'object' ? realTimeBulletScreen.svg.text : createElementSVG('text');
      textSvg.setAttribute('x', 0);
      textSvg.setAttribute('y', realTimeBulletScreen.size * 0.8);
      textSvg.setAttribute('font-family', bulletScreen.style.fontFamily);
      textSvg.setAttribute('font-size', realTimeBulletScreen.size);
      textSvg.setAttribute('font-weight', bulletScreen.style.fontWeight);
      textSvg.setAttribute('fill', bulletScreen.style.color);

      _helper["default"].cleanElement(textSvg);

      textSvg.appendChild(document.createTextNode(bulletScreen.text));

      if (bulletScreen.style.borderColor != null) {
        textSvg.setAttribute('stroke', bulletScreen.borderColor);
        textSvg.setAttribute('stroke-width', 0.5);
      }

      if (bulletScreen.style.shadowBlur != null) {
        var filterId = "bulletScreenEngine_svgFilter_shadow_".concat(bulletScreen.style.shadowBlur);
        var filterSvg = document.getElementById(filterId);

        if (filterSvg === null) {
          filterSvg = createElementSVG('filter');
          filterSvg.id = filterId;
          filterSvg.setAttribute('x', '-100%');
          filterSvg.setAttribute('y', '-100%');
          filterSvg.setAttribute('width', '300%');
          filterSvg.setAttribute('height', '300%');
          var feOffsetSvg = createElementSVG('feOffset');
          feOffsetSvg.setAttribute('result', 'offOut');
          feOffsetSvg.setAttribute('in', 'SourceAlpha');
          filterSvg.appendChild(feOffsetSvg);
          var feGaussianBlurSvg = createElementSVG('feGaussianBlur');
          feGaussianBlurSvg.setAttribute('result', 'blurOut');
          feGaussianBlurSvg.setAttribute('in', 'offOut');
          feGaussianBlurSvg.setAttribute('stdDeviation', bulletScreen.style.shadowBlur);
          filterSvg.appendChild(feGaussianBlurSvg);
          var feBlendSvg = createElementSVG('feBlend');
          feBlendSvg.setAttribute('in', 'SourceGraphic');
          feBlendSvg.setAttribute('in2', 'blurOut');
          feBlendSvg.setAttribute('mode', 'normal');
          filterSvg.appendChild(feBlendSvg);
          filterSvg.bulletScreenCount = 0;

          _defsSvg.appendChild(filterSvg);
        }

        filterSvg.bulletScreenCount++;
        textSvg.setAttribute('filter', "url(#".concat(filterId, ")"));
        realTimeBulletScreen.filterId = filterId;
      }

      realTimeBulletScreen.svg.text = textSvg;
      textSvg.realTimeBulletScreen = realTimeBulletScreen;
      insertElement(textSvg);
      realTimeBulletScreen.width = textSvg.getComputedTextLength();

      if (bulletScreen.style.boxColor != null) {
        var rectSvg = _typeof(realTimeBulletScreen.svg.rect) === 'object' ? realTimeBulletScreen.svg.rect : createElementSVG('rect');
        rectSvg.setAttribute('x', -3);
        rectSvg.setAttribute('y', -3);
        rectSvg.setAttribute('fill', 'none');
        rectSvg.setAttribute('height', realTimeBulletScreen.height + 7);
        rectSvg.setAttribute('width', realTimeBulletScreen.width + 7);
        rectSvg.setAttribute('stroke', bulletScreen.style.boxColor);
        rectSvg.setAttribute('stroke-width', 1);
        realTimeBulletScreen.svg.rect = rectSvg;
        rectSvg.realTimeBulletScreen = realTimeBulletScreen;

        _svg.insertBefore(rectSvg, textSvg);
      }
    };
    /**
    * 删除弹幕元素
    * @override
    * @param {object} realTimeBulletScreen - 实时弹幕对象
    */


    _this["delete"] = function (realTimeBulletScreen) {
      if (typeof realTimeBulletScreen.filterId != 'undefined') {
        var filterSvg = document.getElementById(realTimeBulletScreen.filterId);
        if (filterSvg != null && --filterSvg.bulletScreenCount === 0) _defsSvg.removeChild(filterSvg);
      }

      for (var index in realTimeBulletScreen.svg) {
        _svg.removeChild(realTimeBulletScreen.svg[index]);
      }
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

    var _setSize = _this.setSize;
    /**
     * 设置尺寸
     * @override
     */

    _this.setSize = function () {
      _setSize();

      _svg.setAttribute('height', elementSize.height);

      _svg.setAttribute('width', elementSize.width);
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
      div.style.padding = '0';
      div.style.margin = '0';
      _svg = createElementSVG('svg');
      _defsSvg = createElementSVG('defs');

      _svg.appendChild(_defsSvg);

      _svg.setAttribute('height', elementSize.height);

      _svg.setAttribute('width', elementSize.width);

      div.appendChild(_svg);
      var eventDiv = document.createElement('div');
      eventDiv.style.position = 'absolute';
      eventDiv.style.top = eventDiv.style.right = eventDiv.style.bottom = eventDiv.style.left = '0';
      div.appendChild(eventDiv);
      registerEvent(eventDiv);
      return div;
    }
    /**
     * 浏览器支持检测
     * @private
     * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
     */


    function supportCheck() {
      if (typeof document.createElementNS != 'function') throw new _browserNotSupportError["default"]('createElementNS Function');
      if (typeof createElementSVG('svg').createSVGRect != 'function') throw new _browserNotSupportError["default"]('SVG');
    }

    var _checkWhetherHide = _this.checkWhetherHide;
    /**
     * 注册事件响应程序
     * @private
     * @param {Element} element - 元素
     */

    function registerEvent(element) {
      function getrealTimeBulletScreenByLocation(location) {
        var textSvgs = _svg.getElementsByTagName('text');

        for (var index = textSvgs.length - 1; index > 0; index--) {
          var realTimeBulletScreen = textSvgs[index].realTimeBulletScreen;
          if (_checkWhetherHide(realTimeBulletScreen)) return;
          var x1 = realTimeBulletScreen.x - 4;
          var x2 = x1 + realTimeBulletScreen.width + 8;
          var y1 = realTimeBulletScreen.actualY - 4;
          var y2 = y1 + realTimeBulletScreen.height + 8;
          if (location.x >= x1 && location.x <= x2 && location.y >= y1 && location.y <= y2) return realTimeBulletScreen;
        }

        return null;
      }

      function getLocation(e) {
        function getOffsetTop(element) {
          var offsetTop = 0;

          do {
            offsetTop += element.offsetTop;
          } while ((element = element.offsetParent) != null);

          return offsetTop;
        }

        function getOffsetLeft(element) {
          var offsetLeft = 0;

          do {
            offsetLeft += element.offsetLeft;
          } while ((element = element.offsetParent) != null);

          return offsetLeft;
        }

        if (typeof e.offsetX === 'undefined' || e.offsetX === null) {
          if (typeof e.layerX === 'undefined' || e.layerX === null) {
            if (typeof e.pageX === 'undefined' || e.pageX === null) {
              var doc = document.documentElement,
                  body = document.body;
              e.pageX = e.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
              e.pageY = e.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
            }

            e.layerX = e.pageX - getOffsetLeft(e.target);
            e.layerY = e.pageY - getOffsetTop(e.target);
          }

          e.offsetX = e.layerX - e.target.clientLeft;
          e.offsetY = e.layerY - e.target.clientTop;
        }

        return {
          x: e.offsetX,
          y: e.offsetY
        };
      }

      element.oncontextmenu = function (e) {
        var realTimeBulletScreen = getrealTimeBulletScreenByLocation(getLocation(e));
        if (realTimeBulletScreen) eventTrigger('contextmenu', realTimeBulletScreen, e);
        return false;
      };

      element.onclick = function (e) {
        var realTimeBulletScreen = getrealTimeBulletScreenByLocation(getLocation(e));
        if (realTimeBulletScreen) eventTrigger('click', realTimeBulletScreen, e);
        return false;
      };

      element.onmousemove = function (e) {
        var realTimeBulletScreen = getrealTimeBulletScreenByLocation(getLocation(e));
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = _svg.getElementsByTagName('text')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var textSvg = _step2.value;
            var _realTimeBulletScreen = textSvg.realTimeBulletScreen;

            if (_realTimeBulletScreen != realTimeBulletScreen && _realTimeBulletScreen.mousein) {
              _realTimeBulletScreen.mousein = false;
              element.style.cursor = '';
              eventTrigger('mouseleave', _realTimeBulletScreen, e);
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        if (realTimeBulletScreen === null || realTimeBulletScreen.mousein) return false;
        realTimeBulletScreen.mousein = true;
        element.style.cursor = options.cursorOnMouseOver;
        eventTrigger('mouseenter', realTimeBulletScreen, e);
        return false;
      };

      element.onmouseout = function (e) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = _svg.getElementsByTagName('text')[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var textSvg = _step3.value;
            var _realTimeBulletScreen = textSvg.realTimeBulletScreen;

            if (_realTimeBulletScreen.mousein) {
              _realTimeBulletScreen.mousein = false;
              element.style.cursor = '';
              eventTrigger('mouseleave', _realTimeBulletScreen, e);
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
              _iterator3["return"]();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      };
    }
    /**
     * 创建 SVG 元素
     * @private
     * @param {string} qualifiedName - Element 名称
     * @param {object} options - 选项
     */


    function createElementSVG(qualifiedName, options) {
      return document.createElementNS('http://www.w3.org/2000/svg', qualifiedName, options);
    }
    /**
     * 按 layer 插入元素
     * @param {Element} element - 元素
     */


    function insertElement(element) {
      var elements = _svg.getElementsByTagName(element.tagName);

      if (elements.length === 0) _svg.appendChild(element);
      var index;

      for (index = elements.length - 1; index > 0; index--) {
        var _layer = elements[index].realTimeBulletScreen.bulletScreen.layer;
        if (_layer <= element.realTimeBulletScreen.bulletScreen.layer) break;
      }

      if (++index === elements.length) _svg.appendChild(element);else _svg.insertBefore(element, elements[index]);
    }

    return _this;
  }

  return GeneralSvgRenderer;
}(_generalBaseRenderer["default"]);

exports["default"] = GeneralSvgRenderer;


},{"../errors/browserNotSupportError":6,"../lib/helper":8,"./generalBaseRenderer":12,"core-js/modules/es.array.concat":130,"core-js/modules/es.array.iterator":133,"core-js/modules/es.number.to-fixed":140,"core-js/modules/es.object.create":141,"core-js/modules/es.object.define-property":142,"core-js/modules/es.object.get-prototype-of":144,"core-js/modules/es.object.set-prototype-of":145,"core-js/modules/es.object.to-string":146,"core-js/modules/es.string.iterator":151,"core-js/modules/es.symbol":155,"core-js/modules/es.symbol.description":153,"core-js/modules/es.symbol.iterator":154,"core-js/modules/web.dom-collections.iterator":181}],17:[function(require,module,exports){
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array-buffer.slice");

require("core-js/modules/es.object.create");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-prototype-of");

require("core-js/modules/es.object.set-prototype-of");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.typed-array.float32-array");

require("core-js/modules/es.typed-array.copy-within");

require("core-js/modules/es.typed-array.every");

require("core-js/modules/es.typed-array.fill");

require("core-js/modules/es.typed-array.filter");

require("core-js/modules/es.typed-array.find");

require("core-js/modules/es.typed-array.find-index");

require("core-js/modules/es.typed-array.for-each");

require("core-js/modules/es.typed-array.includes");

require("core-js/modules/es.typed-array.index-of");

require("core-js/modules/es.typed-array.iterator");

require("core-js/modules/es.typed-array.join");

require("core-js/modules/es.typed-array.last-index-of");

require("core-js/modules/es.typed-array.map");

require("core-js/modules/es.typed-array.reduce");

require("core-js/modules/es.typed-array.reduce-right");

require("core-js/modules/es.typed-array.reverse");

require("core-js/modules/es.typed-array.set");

require("core-js/modules/es.typed-array.slice");

require("core-js/modules/es.typed-array.some");

require("core-js/modules/es.typed-array.sort");

require("core-js/modules/es.typed-array.subarray");

require("core-js/modules/es.typed-array.to-locale-string");

require("core-js/modules/es.typed-array.to-string");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _generalCanvasBaseRenderer = _interopRequireDefault(require("./generalCanvasBaseRenderer"));

var _browserNotSupportError = _interopRequireDefault(require("../errors/browserNotSupportError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * WebGL 渲染器类
 */
var GeneralWebglRenderer = function (_GeneralCanvasBaseRen) {
  _inherits(GeneralWebglRenderer, _GeneralCanvasBaseRen);

  /**
   * 实例化一个 WebGL 渲染器类
   * @param {object} element - Element 元素
   * @param {openBSE~Options} options - 全局选项
   * @param {object} elementSize - 元素大小
   * @param {Event} eventTrigger - 事件引发方法
   * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
   */
  function GeneralWebglRenderer(element, options, elementSize, eventTrigger) {
    var _this;

    _classCallCheck(this, GeneralWebglRenderer);

    supportCheck();
    _this = _possibleConstructorReturn(this, _getPrototypeOf(GeneralWebglRenderer).call(this, element, options, elementSize, eventTrigger));
    /**
     * 屏幕上的弹幕
     * @private @type {LinkedList}
     */

    var _bulletScreensOnScreen = _this.getBulletScreensOnScreen();
    /**
     * WebGL 上下文对象
     * @private @type {object}
     */


    var _webglContext;

    var _positionAttributeLocation;

    var _resolutionUniformLocation;
    /**
     * Canvas 元素
     * @private @type {object}
     */


    var _canvas = _this.getCanvas();

    init();
    var _cleanScreen = _this.cleanScreen;
    /**
     * 清除屏幕内容
     * @override
     */

    _this.cleanScreen = function () {
      _cleanScreen();

      _webglContext.clear(_webglContext.COLOR_BUFFER_BIT);
    };
    /**
     * 绘制函数
     * @override
     */


    _this.draw = function () {
      var _this2 = this;

      var devicePixelRatio = this.getDevicePixelRatio();

      _webglContext.clear(_webglContext.COLOR_BUFFER_BIT);

      _bulletScreensOnScreen.forEach(function (node) {
        var realTimeBulletScreen = node.element;
        if (_this2.checkWhetherHide(realTimeBulletScreen)) return;
        var x1 = (realTimeBulletScreen.x - 4) * devicePixelRatio;
        var x2 = x1 + (realTimeBulletScreen.width + 8) * devicePixelRatio;
        var y1 = (realTimeBulletScreen.actualY - 4) * devicePixelRatio;
        var y2 = y1 + (realTimeBulletScreen.height + 8) * devicePixelRatio;

        _webglContext.bindTexture(_webglContext.TEXTURE_2D, realTimeBulletScreen.texture2D);

        var positionBuffer = _webglContext.createBuffer();

        _webglContext.bindBuffer(_webglContext.ARRAY_BUFFER, positionBuffer);

        _webglContext.enableVertexAttribArray(_positionAttributeLocation);

        _webglContext.vertexAttribPointer(_positionAttributeLocation, 2, _webglContext.FLOAT, false, 0, 0);

        _webglContext.bufferData(_webglContext.ARRAY_BUFFER, new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]), _webglContext.STATIC_DRAW);

        _webglContext.drawArrays(_webglContext.TRIANGLES, 0, 6);
      }, true);
    };

    var _creatAndgetWidth = _this.creatAndgetWidth;
    /**
     * 创建弹幕元素
     * @override
     * @param {object} realTimeBulletScreen - 实时弹幕对象
     */

    _this.creatAndgetWidth = function (realTimeBulletScreen) {
      _creatAndgetWidth(realTimeBulletScreen);

      var texture = _webglContext.createTexture();

      _webglContext.bindTexture(_webglContext.TEXTURE_2D, texture);

      _webglContext.texParameteri(_webglContext.TEXTURE_2D, _webglContext.TEXTURE_MIN_FILTER, _webglContext.NEAREST);

      _webglContext.texParameteri(_webglContext.TEXTURE_2D, _webglContext.TEXTURE_MAG_FILTER, _webglContext.NEAREST);

      _webglContext.texParameteri(_webglContext.TEXTURE_2D, _webglContext.TEXTURE_WRAP_S, _webglContext.CLAMP_TO_EDGE);

      _webglContext.texParameteri(_webglContext.TEXTURE_2D, _webglContext.TEXTURE_WRAP_T, _webglContext.CLAMP_TO_EDGE);

      _webglContext.texImage2D(_webglContext.TEXTURE_2D, 0, _webglContext.RGBA, _webglContext.RGBA, _webglContext.UNSIGNED_BYTE, realTimeBulletScreen.hideCanvas);

      realTimeBulletScreen.texture2D = texture;
    };

    var _setSize = _this.setSize;
    /**
     * 设置尺寸
     * @override
     */

    _this.setSize = function () {
      _setSize();

      _webglContext.viewport(0, 0, _canvas.width, _canvas.height);

      _webglContext.uniform2f(_resolutionUniformLocation, _canvas.width, _canvas.height);
    };
    /**
     * 初始化
     */


    function init() {
      var createShader = function createShader(gl, type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

        if (success) {
          return shader;
        }

        gl.deleteShader(shader);
      };

      var createProgram = function createProgram(gl, vertexShader, fragmentShader) {
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);

        if (success) {
          return program;
        }

        gl.deleteProgram(program);
      };

      var vertexShaderSource = 'attribute vec2 a_position;';
      vertexShaderSource += 'attribute vec2 a_texcoord;';
      vertexShaderSource += 'uniform vec2 u_resolution;';
      vertexShaderSource += 'varying vec2 v_texcoord;';
      vertexShaderSource += 'void main() {';
      vertexShaderSource += 'vec2 zeroToOne = a_position / u_resolution;';
      vertexShaderSource += 'vec2 zeroToTwo = zeroToOne * 2.0;';
      vertexShaderSource += 'vec2 clipSpace = zeroToTwo - 1.0;';
      vertexShaderSource += 'gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);';
      vertexShaderSource += 'v_texcoord = a_texcoord;';
      vertexShaderSource += '}';
      var fragmentShaderSource = 'precision mediump float;';
      fragmentShaderSource += 'varying vec2 v_texcoord;';
      fragmentShaderSource += 'uniform sampler2D u_texture;';
      fragmentShaderSource += 'void main() {';
      fragmentShaderSource += 'gl_FragColor = texture2D(u_texture, v_texcoord);';
      fragmentShaderSource += '}';
      _webglContext = _canvas.getContext('webgl');

      _webglContext.enable(_webglContext.BLEND);

      _webglContext.clearColor(0, 0, 0, 0);

      _webglContext.blendFunc(_webglContext.SRC_ALPHA, _webglContext.ONE_MINUS_SRC_ALPHA);

      var vertexShader = createShader(_webglContext, _webglContext.VERTEX_SHADER, vertexShaderSource);
      var fragmentShader = createShader(_webglContext, _webglContext.FRAGMENT_SHADER, fragmentShaderSource);
      var program = createProgram(_webglContext, vertexShader, fragmentShader);

      _webglContext.useProgram(program);

      _positionAttributeLocation = _webglContext.getAttribLocation(program, 'a_position');

      var texcoordAttributeLocation = _webglContext.getAttribLocation(program, 'a_texcoord');

      _resolutionUniformLocation = _webglContext.getUniformLocation(program, 'u_resolution');

      _webglContext.viewport(0, 0, _canvas.width, _canvas.height);

      _webglContext.uniform2f(_resolutionUniformLocation, _canvas.width, _canvas.height);

      var texcoordBuffer = _webglContext.createBuffer();

      _webglContext.bindBuffer(_webglContext.ARRAY_BUFFER, texcoordBuffer);

      _webglContext.enableVertexAttribArray(texcoordAttributeLocation);

      _webglContext.vertexAttribPointer(texcoordAttributeLocation, 2, _webglContext.FLOAT, false, 0, 0);

      _webglContext.bufferData(_webglContext.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), _webglContext.STATIC_DRAW);
    }
    /**
     * 浏览器支持检测
     * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
     */


    function supportCheck() {
      var canvas = document.createElement('canvas');
      if (typeof canvas.getContext != 'function') throw new _browserNotSupportError["default"]('Canvas');
      var context = canvas.getContext('2d');
      if (context === null) throw new _browserNotSupportError["default"]('Canvas 2D');
      if (typeof context.fillText != 'function') throw new _browserNotSupportError["default"]('Canvas 2D fillText Function');
      canvas = document.createElement('canvas');
      context = canvas.getContext('webgl');
      if (context === null) throw new _browserNotSupportError["default"]('WebGL');
    }

    return _this;
  }

  return GeneralWebglRenderer;
}(_generalCanvasBaseRenderer["default"]);

exports["default"] = GeneralWebglRenderer;


},{"../errors/browserNotSupportError":6,"./generalCanvasBaseRenderer":13,"core-js/modules/es.array-buffer.slice":129,"core-js/modules/es.array.for-each":131,"core-js/modules/es.array.iterator":133,"core-js/modules/es.object.create":141,"core-js/modules/es.object.define-property":142,"core-js/modules/es.object.get-prototype-of":144,"core-js/modules/es.object.set-prototype-of":145,"core-js/modules/es.object.to-string":146,"core-js/modules/es.string.iterator":151,"core-js/modules/es.symbol":155,"core-js/modules/es.symbol.description":153,"core-js/modules/es.symbol.iterator":154,"core-js/modules/es.typed-array.copy-within":156,"core-js/modules/es.typed-array.every":157,"core-js/modules/es.typed-array.fill":158,"core-js/modules/es.typed-array.filter":159,"core-js/modules/es.typed-array.find":161,"core-js/modules/es.typed-array.find-index":160,"core-js/modules/es.typed-array.float32-array":162,"core-js/modules/es.typed-array.for-each":163,"core-js/modules/es.typed-array.includes":164,"core-js/modules/es.typed-array.index-of":165,"core-js/modules/es.typed-array.iterator":166,"core-js/modules/es.typed-array.join":167,"core-js/modules/es.typed-array.last-index-of":168,"core-js/modules/es.typed-array.map":169,"core-js/modules/es.typed-array.reduce":171,"core-js/modules/es.typed-array.reduce-right":170,"core-js/modules/es.typed-array.reverse":172,"core-js/modules/es.typed-array.set":173,"core-js/modules/es.typed-array.slice":174,"core-js/modules/es.typed-array.some":175,"core-js/modules/es.typed-array.sort":176,"core-js/modules/es.typed-array.subarray":177,"core-js/modules/es.typed-array.to-locale-string":178,"core-js/modules/es.typed-array.to-string":179,"core-js/modules/web.dom-collections.for-each":180,"core-js/modules/web.dom-collections.iterator":181}],18:[function(require,module,exports){
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


},{"../lib/resources":11,"./generalCanvasRenderer":14,"./generalCss3Renderer":15,"./generalSvgRenderer":16,"./generalWebglRenderer":17,"core-js/modules/es.object.define-property":142}],19:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};

},{}],20:[function(require,module,exports){
var UNSCOPABLES = require('../internals/well-known-symbol')('unscopables');
var create = require('../internals/object-create');
var hide = require('../internals/hide');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  hide(ArrayPrototype, UNSCOPABLES, create(null));
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};

},{"../internals/hide":64,"../internals/object-create":82,"../internals/well-known-symbol":127}],21:[function(require,module,exports){
'use strict';
var codePointAt = require('../internals/string-at');

// `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? codePointAt(S, index, true).length : 1);
};

},{"../internals/string-at":110}],22:[function(require,module,exports){
module.exports = function (it, Constructor, name) {
  if (!(it instanceof Constructor)) {
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  } return it;
};

},{}],23:[function(require,module,exports){
var isObject = require('../internals/is-object');

module.exports = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};

},{"../internals/is-object":74}],24:[function(require,module,exports){
'use strict';
var DESCRIPTORS = require('../internals/descriptors');
var global = require('../internals/global');
var isObject = require('../internals/is-object');
var has = require('../internals/has');
var classof = require('../internals/classof');
var hide = require('../internals/hide');
var redefine = require('../internals/redefine');
var defineProperty = require('../internals/object-define-property').f;
var getPrototypeOf = require('../internals/object-get-prototype-of');
var setPrototypeOf = require('../internals/object-set-prototype-of');
var TO_STRING_TAG = require('../internals/well-known-symbol')('toStringTag');
var TYPED_ARRAY_TAG = require('../internals/uid')('TYPED_ARRAY_TAG');

var DataView = global.DataView;
var DataViewPrototype = DataView && DataView.prototype;
var Int8Array = global.Int8Array;
var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
var Uint8ClampedArray = global.Uint8ClampedArray;
var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
var TypedArray = Int8Array && getPrototypeOf(Int8Array);
var TypedArrayPrototype = Int8ArrayPrototype && getPrototypeOf(Int8ArrayPrototype);
var ObjectPrototype = Object.prototype;
var isPrototypeOf = ObjectPrototype.isPrototypeOf;

var NATIVE_ARRAY_BUFFER = !!(global.ArrayBuffer && global.DataView);
var NATIVE_ARRAY_BUFFER_VIEWS = NATIVE_ARRAY_BUFFER && !!setPrototypeOf;
var TYPED_ARRAY_TAG_REQIRED = false;
var NAME;

var TypedArrayConstructorsList = {
  Int8Array: 1,
  Uint8Array: 1,
  Uint8ClampedArray: 1,
  Int16Array: 2,
  Uint16Array: 2,
  Int32Array: 4,
  Uint32Array: 4,
  Float32Array: 4,
  Float64Array: 8
};

var isView = function isView(it) {
  var klass = classof(it);
  return klass === 'DataView' || has(TypedArrayConstructorsList, klass);
};

var isTypedArray = function (it) {
  return isObject(it) && has(TypedArrayConstructorsList, classof(it));
};

var aTypedArray = function (it) {
  if (isTypedArray(it)) return it;
  throw TypeError('Target is not a typed array');
};

var aTypedArrayConstructor = function (C) {
  if (setPrototypeOf) {
    if (isPrototypeOf.call(TypedArray, C)) return C;
  } else for (var ARRAY in TypedArrayConstructorsList) if (has(TypedArrayConstructorsList, NAME)) {
    var TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && (C === TypedArrayConstructor || isPrototypeOf.call(TypedArrayConstructor, C))) {
      return C;
    }
  } throw TypeError('Target is not a typed array constructor');
};

var exportProto = function (KEY, property, forced) {
  if (!DESCRIPTORS) return;
  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
    var TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && has(TypedArrayConstructor.prototype, KEY)) {
      delete TypedArrayConstructor.prototype[KEY];
    }
  }
  if (!TypedArrayPrototype[KEY] || forced) {
    redefine(TypedArrayPrototype, KEY, forced ? property
      : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property);
  }
};

var exportStatic = function (KEY, property, forced) {
  var ARRAY, TypedArrayConstructor;
  if (!DESCRIPTORS) return;
  if (setPrototypeOf) {
    if (forced) for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global[ARRAY];
      if (TypedArrayConstructor && has(TypedArrayConstructor, KEY)) {
        delete TypedArrayConstructor[KEY];
      }
    }
    if (!TypedArray[KEY] || forced) {
      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
      try {
        return redefine(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && Int8Array[KEY] || property);
      } catch (error) { /* empty */ }
    } else return;
  }
  for (ARRAY in TypedArrayConstructorsList) {
    TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
      redefine(TypedArrayConstructor, KEY, property);
    }
  }
};

for (NAME in TypedArrayConstructorsList) {
  if (!global[NAME]) NATIVE_ARRAY_BUFFER_VIEWS = false;
}

// WebKit bug - typed arrays constructors prototype is Object.prototype
if (!NATIVE_ARRAY_BUFFER_VIEWS || typeof TypedArray != 'function' || TypedArray === Function.prototype) {
  // eslint-disable-next-line no-shadow
  TypedArray = function TypedArray() {
    throw TypeError('Incorrect invocation');
  };
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME], TypedArray);
  }
}

if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype) {
  TypedArrayPrototype = TypedArray.prototype;
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME].prototype, TypedArrayPrototype);
  }
}

// WebKit bug - one more object in Uint8ClampedArray prototype chain
if (NATIVE_ARRAY_BUFFER_VIEWS && getPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
  setPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
}

if (DESCRIPTORS && !has(TypedArrayPrototype, TO_STRING_TAG)) {
  TYPED_ARRAY_TAG_REQIRED = true;
  defineProperty(TypedArrayPrototype, TO_STRING_TAG, { get: function () {
    return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
  } });
  for (NAME in TypedArrayConstructorsList) if (global[NAME]) {
    hide(global[NAME], TYPED_ARRAY_TAG, NAME);
  }
}

// WebKit bug - the same parent prototype for typed arrays and data view
if (NATIVE_ARRAY_BUFFER && setPrototypeOf && getPrototypeOf(DataViewPrototype) !== ObjectPrototype) {
  setPrototypeOf(DataViewPrototype, ObjectPrototype);
}

module.exports = {
  NATIVE_ARRAY_BUFFER: NATIVE_ARRAY_BUFFER,
  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG,
  aTypedArray: aTypedArray,
  aTypedArrayConstructor: aTypedArrayConstructor,
  exportProto: exportProto,
  exportStatic: exportStatic,
  isView: isView,
  isTypedArray: isTypedArray,
  TypedArray: TypedArray,
  TypedArrayPrototype: TypedArrayPrototype
};

},{"../internals/classof":38,"../internals/descriptors":48,"../internals/global":61,"../internals/has":62,"../internals/hide":64,"../internals/is-object":74,"../internals/object-define-property":84,"../internals/object-get-prototype-of":89,"../internals/object-set-prototype-of":93,"../internals/redefine":98,"../internals/uid":124,"../internals/well-known-symbol":127}],25:[function(require,module,exports){
'use strict';
var global = require('../internals/global');
var DESCRIPTORS = require('../internals/descriptors');
var NATIVE_ARRAY_BUFFER = require('../internals/array-buffer-view-core').NATIVE_ARRAY_BUFFER;
var hide = require('../internals/hide');
var redefineAll = require('../internals/redefine-all');
var fails = require('../internals/fails');
var anInstance = require('../internals/an-instance');
var toInteger = require('../internals/to-integer');
var toLength = require('../internals/to-length');
var toIndex = require('../internals/to-index');
var getOwnPropertyNames = require('../internals/object-get-own-property-names').f;
var defineProperty = require('../internals/object-define-property').f;
var arrayFill = require('../internals/array-fill');
var setToStringTag = require('../internals/set-to-string-tag');
var InternalStateModule = require('../internals/internal-state');
var getInternalState = InternalStateModule.get;
var setInternalState = InternalStateModule.set;
var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH = 'Wrong length';
var WRONG_INDEX = 'Wrong index';
var NativeArrayBuffer = global[ARRAY_BUFFER];
var $ArrayBuffer = NativeArrayBuffer;
var $DataView = global[DATA_VIEW];
var Math = global.Math;
var RangeError = global.RangeError;
// eslint-disable-next-line no-shadow-restricted-names
var Infinity = 1 / 0;
var abs = Math.abs;
var pow = Math.pow;
var floor = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;

// IEEE754 conversions based on https://github.com/feross/ieee754
var packIEEE754 = function (number, mantissaLength, bytes) {
  var buffer = new Array(bytes);
  var exponentLength = bytes * 8 - mantissaLength - 1;
  var eMax = (1 << exponentLength) - 1;
  var eBias = eMax >> 1;
  var rt = mantissaLength === 23 ? pow(2, -24) - pow(2, -77) : 0;
  var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
  var index = 0;
  var exponent, mantissa, c;
  number = abs(number);
  // eslint-disable-next-line no-self-compare
  if (number != number || number === Infinity) {
    // eslint-disable-next-line no-self-compare
    mantissa = number != number ? 1 : 0;
    exponent = eMax;
  } else {
    exponent = floor(log(number) / LN2);
    if (number * (c = pow(2, -exponent)) < 1) {
      exponent--;
      c *= 2;
    }
    if (exponent + eBias >= 1) {
      number += rt / c;
    } else {
      number += rt * pow(2, 1 - eBias);
    }
    if (number * c >= 2) {
      exponent++;
      c /= 2;
    }
    if (exponent + eBias >= eMax) {
      mantissa = 0;
      exponent = eMax;
    } else if (exponent + eBias >= 1) {
      mantissa = (number * c - 1) * pow(2, mantissaLength);
      exponent = exponent + eBias;
    } else {
      mantissa = number * pow(2, eBias - 1) * pow(2, mantissaLength);
      exponent = 0;
    }
  }
  for (; mantissaLength >= 8; buffer[index++] = mantissa & 255, mantissa /= 256, mantissaLength -= 8);
  exponent = exponent << mantissaLength | mantissa;
  exponentLength += mantissaLength;
  for (; exponentLength > 0; buffer[index++] = exponent & 255, exponent /= 256, exponentLength -= 8);
  buffer[--index] |= sign * 128;
  return buffer;
};

var unpackIEEE754 = function (buffer, mantissaLength) {
  var bytes = buffer.length;
  var exponentLength = bytes * 8 - mantissaLength - 1;
  var eMax = (1 << exponentLength) - 1;
  var eBias = eMax >> 1;
  var nBits = exponentLength - 7;
  var index = bytes - 1;
  var sign = buffer[index--];
  var exponent = sign & 127;
  var mantissa;
  sign >>= 7;
  for (; nBits > 0; exponent = exponent * 256 + buffer[index], index--, nBits -= 8);
  mantissa = exponent & (1 << -nBits) - 1;
  exponent >>= -nBits;
  nBits += mantissaLength;
  for (; nBits > 0; mantissa = mantissa * 256 + buffer[index], index--, nBits -= 8);
  if (exponent === 0) {
    exponent = 1 - eBias;
  } else if (exponent === eMax) {
    return mantissa ? NaN : sign ? -Infinity : Infinity;
  } else {
    mantissa = mantissa + pow(2, mantissaLength);
    exponent = exponent - eBias;
  } return (sign ? -1 : 1) * mantissa * pow(2, exponent - mantissaLength);
};

var unpackInt32 = function (buffer) {
  return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
};

var packInt8 = function (number) {
  return [number & 0xFF];
};

var packInt16 = function (number) {
  return [number & 0xFF, number >> 8 & 0xFF];
};

var packInt32 = function (number) {
  return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
};

var packFloat32 = function (number) {
  return packIEEE754(number, 23, 4);
};

var packFloat64 = function (number) {
  return packIEEE754(number, 52, 8);
};

var addGetter = function (Constructor, key) {
  defineProperty(Constructor[PROTOTYPE], key, { get: function () { return getInternalState(this)[key]; } });
};

var get = function (view, count, index, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  var store = getInternalState(view);
  if (intIndex + count > store.byteLength) throw RangeError(WRONG_INDEX);
  var bytes = getInternalState(store.buffer).bytes;
  var start = intIndex + store.byteOffset;
  var pack = bytes.slice(start, start + count);
  return isLittleEndian ? pack : pack.reverse();
};

var set = function (view, count, index, conversion, value, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  var store = getInternalState(view);
  if (intIndex + count > store.byteLength) throw RangeError(WRONG_INDEX);
  var bytes = getInternalState(store.buffer).bytes;
  var start = intIndex + store.byteOffset;
  var pack = conversion(+value);
  for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
};

if (!NATIVE_ARRAY_BUFFER) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
    var byteLength = toIndex(length);
    setInternalState(this, {
      bytes: arrayFill.call(new Array(byteLength), 0),
      byteLength: byteLength
    });
    if (!DESCRIPTORS) this.byteLength = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = getInternalState(buffer).byteLength;
    var offset = toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    setInternalState(this, {
      buffer: buffer,
      byteLength: byteLength,
      byteOffset: offset
    });
    if (!DESCRIPTORS) {
      this.buffer = buffer;
      this.byteLength = byteLength;
      this.byteOffset = offset;
    }
  };

  if (DESCRIPTORS) {
    addGetter($ArrayBuffer, 'byteLength');
    addGetter($DataView, 'buffer');
    addGetter($DataView, 'byteLength');
    addGetter($DataView, 'byteOffset');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackInt32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackInt32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packInt8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packInt8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packInt16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packInt16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packInt32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packInt32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packFloat32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set(this, 8, byteOffset, packFloat64, value, arguments[2]);
    }
  });
} else {
  if (!fails(function () {
    NativeArrayBuffer(1);
  }) || !fails(function () {
    new NativeArrayBuffer(-1); // eslint-disable-line no-new
  }) || fails(function () {
    new NativeArrayBuffer(); // eslint-disable-line no-new
    new NativeArrayBuffer(1.5); // eslint-disable-line no-new
    new NativeArrayBuffer(NaN); // eslint-disable-line no-new
    return NativeArrayBuffer.name != ARRAY_BUFFER;
  })) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer);
      return new NativeArrayBuffer(toIndex(length));
    };
    var ArrayBufferPrototype = $ArrayBuffer[PROTOTYPE] = NativeArrayBuffer[PROTOTYPE];
    for (var keys = getOwnPropertyNames(NativeArrayBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) hide($ArrayBuffer, key, NativeArrayBuffer[key]);
    }
    ArrayBufferPrototype.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var testView = new $DataView(new $ArrayBuffer(2));
  var nativeSetInt8 = $DataView[PROTOTYPE].setInt8;
  testView.setInt8(0, 2147483648);
  testView.setInt8(1, 2147483649);
  if (testView.getInt8(0) || !testView.getInt8(1)) redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value) {
      nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, { unsafe: true });
}

setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;

},{"../internals/an-instance":22,"../internals/array-buffer-view-core":24,"../internals/array-fill":27,"../internals/descriptors":48,"../internals/fails":54,"../internals/global":61,"../internals/hide":64,"../internals/internal-state":70,"../internals/object-define-property":84,"../internals/object-get-own-property-names":87,"../internals/redefine-all":97,"../internals/set-to-string-tag":105,"../internals/to-index":114,"../internals/to-integer":116,"../internals/to-length":117}],26:[function(require,module,exports){
'use strict';
var toObject = require('../internals/to-object');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var toLength = require('../internals/to-length');

// `Array.prototype.copyWithin` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.copywithin
module.exports = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
  var O = toObject(this);
  var len = toLength(O.length);
  var to = toAbsoluteIndex(target, len);
  var from = toAbsoluteIndex(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = Math.min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
  var inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];
    else delete O[to];
    to += inc;
    from += inc;
  } return O;
};

},{"../internals/to-absolute-index":113,"../internals/to-length":117,"../internals/to-object":118}],27:[function(require,module,exports){
'use strict';
var toObject = require('../internals/to-object');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var toLength = require('../internals/to-length');

// `Array.prototype.fill` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.fill
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var argumentsLength = arguments.length;
  var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
  var end = argumentsLength > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};

},{"../internals/to-absolute-index":113,"../internals/to-length":117,"../internals/to-object":118}],28:[function(require,module,exports){
'use strict';
var nativeForEach = [].forEach;
var internalForEach = require('../internals/array-methods')(0);

var SLOPPY_METHOD = require('../internals/sloppy-array-method')('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
module.exports = SLOPPY_METHOD ? function forEach(callbackfn /* , thisArg */) {
  return internalForEach(this, callbackfn, arguments[1]);
} : nativeForEach;

},{"../internals/array-methods":32,"../internals/sloppy-array-method":108}],29:[function(require,module,exports){
var toIndexedObject = require('../internals/to-indexed-object');
var toLength = require('../internals/to-length');
var toAbsoluteIndex = require('../internals/to-absolute-index');

// `Array.prototype.{ indexOf, includes }` methods implementation
// false -> Array#indexOf
// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
// true  -> Array#includes
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"../internals/to-absolute-index":113,"../internals/to-indexed-object":115,"../internals/to-length":117}],30:[function(require,module,exports){
'use strict';
var toIndexedObject = require('../internals/to-indexed-object');
var toInteger = require('../internals/to-integer');
var toLength = require('../internals/to-length');
var nativeLastIndexOf = [].lastIndexOf;

var NEGATIVE_ZERO = !!nativeLastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0;
var SLOPPY_METHOD = require('../internals/sloppy-array-method')('lastIndexOf');

// `Array.prototype.lastIndexOf` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.lastindexof
module.exports = (NEGATIVE_ZERO || SLOPPY_METHOD) ? function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
  // convert -0 to +0
  if (NEGATIVE_ZERO) return nativeLastIndexOf.apply(this, arguments) || 0;
  var O = toIndexedObject(this);
  var length = toLength(O.length);
  var index = length - 1;
  if (arguments.length > 1) index = Math.min(index, toInteger(arguments[1]));
  if (index < 0) index = length + index;
  for (;index >= 0; index--) if (index in O) if (O[index] === searchElement) return index || 0;
  return -1;
} : nativeLastIndexOf;

},{"../internals/sloppy-array-method":108,"../internals/to-indexed-object":115,"../internals/to-integer":116,"../internals/to-length":117}],31:[function(require,module,exports){
var fails = require('../internals/fails');
var SPECIES = require('../internals/well-known-symbol')('species');

module.exports = function (METHOD_NAME) {
  return !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};

},{"../internals/fails":54,"../internals/well-known-symbol":127}],32:[function(require,module,exports){
var bind = require('../internals/bind-context');
var IndexedObject = require('../internals/indexed-object');
var toObject = require('../internals/to-object');
var toLength = require('../internals/to-length');
var arraySpeciesCreate = require('../internals/array-species-create');

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
// 0 -> Array#forEach
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
// 1 -> Array#map
// https://tc39.github.io/ecma262/#sec-array.prototype.map
// 2 -> Array#filter
// https://tc39.github.io/ecma262/#sec-array.prototype.filter
// 3 -> Array#some
// https://tc39.github.io/ecma262/#sec-array.prototype.some
// 4 -> Array#every
// https://tc39.github.io/ecma262/#sec-array.prototype.every
// 5 -> Array#find
// https://tc39.github.io/ecma262/#sec-array.prototype.find
// 6 -> Array#findIndex
// https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
module.exports = function (TYPE, specificCreate) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = specificCreate || arraySpeciesCreate;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: target.push(value);       // filter
        } else if (IS_EVERY) return false;  // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

},{"../internals/array-species-create":33,"../internals/bind-context":34,"../internals/indexed-object":67,"../internals/to-length":117,"../internals/to-object":118}],33:[function(require,module,exports){
var isObject = require('../internals/is-object');
var isArray = require('../internals/is-array');
var SPECIES = require('../internals/well-known-symbol')('species');

// `ArraySpeciesCreate` abstract operation
// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
};

},{"../internals/is-array":72,"../internals/is-object":74,"../internals/well-known-symbol":127}],34:[function(require,module,exports){
var aFunction = require('../internals/a-function');

// optional / simple context binding
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"../internals/a-function":19}],35:[function(require,module,exports){
var anObject = require('../internals/an-object');

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (error) {
    var returnMethod = iterator['return'];
    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
    throw error;
  }
};

},{"../internals/an-object":23}],36:[function(require,module,exports){
var ITERATOR = require('../internals/well-known-symbol')('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line no-throw-literal
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};

},{"../internals/well-known-symbol":127}],37:[function(require,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],38:[function(require,module,exports){
var classofRaw = require('../internals/classof-raw');
var TO_STRING_TAG = require('../internals/well-known-symbol')('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};

},{"../internals/classof-raw":37,"../internals/well-known-symbol":127}],39:[function(require,module,exports){
'use strict';
var defineProperty = require('../internals/object-define-property').f;
var create = require('../internals/object-create');
var redefineAll = require('../internals/redefine-all');
var bind = require('../internals/bind-context');
var anInstance = require('../internals/an-instance');
var iterate = require('../internals/iterate');
var defineIterator = require('../internals/define-iterator');
var setSpecies = require('../internals/set-species');
var DESCRIPTORS = require('../internals/descriptors');
var fastKey = require('../internals/internal-metadata').fastKey;
var InternalStateModule = require('../internals/internal-state');
var setInternalState = InternalStateModule.set;
var internalStateGetterFor = InternalStateModule.getterFor;

module.exports = {
  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, CONSTRUCTOR_NAME);
      setInternalState(that, {
        type: CONSTRUCTOR_NAME,
        index: create(null),
        first: undefined,
        last: undefined,
        size: 0
      });
      if (!DESCRIPTORS) that.size = 0;
      if (iterable != undefined) iterate(iterable, that[ADDER], that, IS_MAP);
    });

    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

    var define = function (that, key, value) {
      var state = getInternalState(that);
      var entry = getEntry(that, key);
      var previous, index;
      // change existing entry
      if (entry) {
        entry.value = value;
      // create new entry
      } else {
        state.last = entry = {
          index: index = fastKey(key, true),
          key: key,
          value: value,
          previous: previous = state.last,
          next: undefined,
          removed: false
        };
        if (!state.first) state.first = entry;
        if (previous) previous.next = entry;
        if (DESCRIPTORS) state.size++;
        else that.size++;
        // add to index
        if (index !== 'F') state.index[index] = entry;
      } return that;
    };

    var getEntry = function (that, key) {
      var state = getInternalState(that);
      // fast case
      var index = fastKey(key);
      var entry;
      if (index !== 'F') return state.index[index];
      // frozen object case
      for (entry = state.first; entry; entry = entry.next) {
        if (entry.key == key) return entry;
      }
    };

    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        var that = this;
        var state = getInternalState(that);
        var data = state.index;
        var entry = state.first;
        while (entry) {
          entry.removed = true;
          if (entry.previous) entry.previous = entry.previous.next = undefined;
          delete data[entry.index];
          entry = entry.next;
        }
        state.first = state.last = undefined;
        if (DESCRIPTORS) state.size = 0;
        else that.size = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = this;
        var state = getInternalState(that);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.next;
          var prev = entry.previous;
          delete state.index[entry.index];
          entry.removed = true;
          if (prev) prev.next = next;
          if (next) next.previous = prev;
          if (state.first == entry) state.first = next;
          if (state.last == entry) state.last = prev;
          if (DESCRIPTORS) state.size--;
          else that.size--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        var state = getInternalState(this);
        var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.next : state.first) {
          boundFunction(entry.value, entry.key, this);
          // revert to the last existing entry
          while (entry && entry.removed) entry = entry.previous;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(this, key);
      }
    });

    redefineAll(C.prototype, IS_MAP ? {
      // 23.1.3.6 Map.prototype.get(key)
      get: function get(key) {
        var entry = getEntry(this, key);
        return entry && entry.value;
      },
      // 23.1.3.9 Map.prototype.set(key, value)
      set: function set(key, value) {
        return define(this, key === 0 ? 0 : key, value);
      }
    } : {
      // 23.2.3.1 Set.prototype.add(value)
      add: function add(value) {
        return define(this, value = value === 0 ? 0 : value, value);
      }
    });
    if (DESCRIPTORS) defineProperty(C.prototype, 'size', {
      get: function () {
        return getInternalState(this).size;
      }
    });
    return C;
  },
  setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
    var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
    var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    defineIterator(C, CONSTRUCTOR_NAME, function (iterated, kind) {
      setInternalState(this, {
        type: ITERATOR_NAME,
        target: iterated,
        state: getInternalCollectionState(iterated),
        kind: kind,
        last: undefined
      });
    }, function () {
      var state = getInternalIteratorState(this);
      var kind = state.kind;
      var entry = state.last;
      // revert to the last existing entry
      while (entry && entry.removed) entry = entry.previous;
      // get next entry
      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
        // or finish the iteration
        state.target = undefined;
        return { value: undefined, done: true };
      }
      // return step by kind
      if (kind == 'keys') return { value: entry.key, done: false };
      if (kind == 'values') return { value: entry.value, done: false };
      return { value: [entry.key, entry.value], done: false };
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(CONSTRUCTOR_NAME);
  }
};

},{"../internals/an-instance":22,"../internals/bind-context":34,"../internals/define-iterator":46,"../internals/descriptors":48,"../internals/internal-metadata":69,"../internals/internal-state":70,"../internals/iterate":77,"../internals/object-create":82,"../internals/object-define-property":84,"../internals/redefine-all":97,"../internals/set-species":104}],40:[function(require,module,exports){
'use strict';
var global = require('../internals/global');
var isForced = require('../internals/is-forced');
var $export = require('../internals/export');
var redefine = require('../internals/redefine');
var InternalMetadataModule = require('../internals/internal-metadata');
var iterate = require('../internals/iterate');
var anInstance = require('../internals/an-instance');
var isObject = require('../internals/is-object');
var fails = require('../internals/fails');
var checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration');
var setToStringTag = require('../internals/set-to-string-tag');
var inheritIfRequired = require('../internals/inherit-if-required');

module.exports = function (CONSTRUCTOR_NAME, wrapper, common, IS_MAP, IS_WEAK) {
  var NativeConstructor = global[CONSTRUCTOR_NAME];
  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
  var Constructor = NativeConstructor;
  var ADDER = IS_MAP ? 'set' : 'add';
  var exported = {};

  var fixMethod = function (KEY) {
    var nativeMethod = NativePrototype[KEY];
    redefine(NativePrototype, KEY,
      KEY == 'add' ? function add(a) {
        nativeMethod.call(this, a === 0 ? 0 : a);
        return this;
      } : KEY == 'delete' ? function (a) {
        return IS_WEAK && !isObject(a) ? false : nativeMethod.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a) {
        return IS_WEAK && !isObject(a) ? undefined : nativeMethod.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a) {
        return IS_WEAK && !isObject(a) ? false : nativeMethod.call(this, a === 0 ? 0 : a);
      } : function set(a, b) {
        nativeMethod.call(this, a === 0 ? 0 : a, b);
        return this;
      }
    );
  };

  // eslint-disable-next-line max-len
  if (isForced(CONSTRUCTOR_NAME, typeof NativeConstructor != 'function' || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
    new NativeConstructor().entries().next();
  })))) {
    // create collection constructor
    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
    InternalMetadataModule.REQUIRED = true;
  } else if (isForced(CONSTRUCTOR_NAME, true)) {
    var instance = new Constructor();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    // eslint-disable-next-line no-new
    var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new NativeConstructor();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });

    if (!ACCEPT_ITERABLES) {
      Constructor = wrapper(function (target, iterable) {
        anInstance(target, Constructor, CONSTRUCTOR_NAME);
        var that = inheritIfRequired(new NativeConstructor(), target, Constructor);
        if (iterable != undefined) iterate(iterable, that[ADDER], that, IS_MAP);
        return that;
      });
      Constructor.prototype = NativePrototype;
      NativePrototype.constructor = Constructor;
    }

    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }

    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

    // weak collections should not contains .clear method
    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
  }

  exported[CONSTRUCTOR_NAME] = Constructor;
  $export({ global: true, forced: Constructor != NativeConstructor }, exported);

  setToStringTag(Constructor, CONSTRUCTOR_NAME);

  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

  return Constructor;
};

},{"../internals/an-instance":22,"../internals/check-correctness-of-iteration":36,"../internals/export":53,"../internals/fails":54,"../internals/global":61,"../internals/inherit-if-required":68,"../internals/internal-metadata":69,"../internals/is-forced":73,"../internals/is-object":74,"../internals/iterate":77,"../internals/redefine":98,"../internals/set-to-string-tag":105}],41:[function(require,module,exports){
var has = require('../internals/has');
var ownKeys = require('../internals/own-keys');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var definePropertyModule = require('../internals/object-define-property');

module.exports = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};

},{"../internals/has":62,"../internals/object-define-property":84,"../internals/object-get-own-property-descriptor":85,"../internals/own-keys":95}],42:[function(require,module,exports){
module.exports = !require('../internals/fails')(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

},{"../internals/fails":54}],43:[function(require,module,exports){
'use strict';
var IteratorPrototype = require('../internals/iterators-core').IteratorPrototype;
var create = require('../internals/object-create');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var setToStringTag = require('../internals/set-to-string-tag');
var Iterators = require('../internals/iterators');

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};

},{"../internals/create-property-descriptor":44,"../internals/iterators":79,"../internals/iterators-core":78,"../internals/object-create":82,"../internals/set-to-string-tag":105}],44:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],45:[function(require,module,exports){
'use strict';
var toPrimitive = require('../internals/to-primitive');
var definePropertyModule = require('../internals/object-define-property');
var createPropertyDescriptor = require('../internals/create-property-descriptor');

module.exports = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};

},{"../internals/create-property-descriptor":44,"../internals/object-define-property":84,"../internals/to-primitive":120}],46:[function(require,module,exports){
'use strict';
var $export = require('../internals/export');
var createIteratorConstructor = require('../internals/create-iterator-constructor');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var setPrototypeOf = require('../internals/object-set-prototype-of');
var setToStringTag = require('../internals/set-to-string-tag');
var hide = require('../internals/hide');
var redefine = require('../internals/redefine');
var IS_PURE = require('../internals/is-pure');
var ITERATOR = require('../internals/well-known-symbol')('iterator');
var Iterators = require('../internals/iterators');
var IteratorsCore = require('../internals/iterators-core');
var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (IteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (typeof CurrentIteratorPrototype[ITERATOR] != 'function') {
          hide(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;
    defaultIterator = function values() { return nativeIterator.call(this); };
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    hide(IterablePrototype, ITERATOR, defaultIterator);
  }
  Iterators[NAME] = defaultIterator;

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else $export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  return methods;
};

},{"../internals/create-iterator-constructor":43,"../internals/export":53,"../internals/hide":64,"../internals/is-pure":75,"../internals/iterators":79,"../internals/iterators-core":78,"../internals/object-get-prototype-of":89,"../internals/object-set-prototype-of":93,"../internals/redefine":98,"../internals/set-to-string-tag":105,"../internals/well-known-symbol":127}],47:[function(require,module,exports){
var path = require('../internals/path');
var has = require('../internals/has');
var wrappedWellKnownSymbolModule = require('../internals/wrapped-well-known-symbol');
var defineProperty = require('../internals/object-define-property').f;

module.exports = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!has(Symbol, NAME)) defineProperty(Symbol, NAME, {
    value: wrappedWellKnownSymbolModule.f(NAME)
  });
};

},{"../internals/has":62,"../internals/object-define-property":84,"../internals/path":96,"../internals/wrapped-well-known-symbol":128}],48:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('../internals/fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"../internals/fails":54}],49:[function(require,module,exports){
var isObject = require('../internals/is-object');
var document = require('../internals/global').document;
// typeof document.createElement is 'object' in old IE
var exist = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return exist ? document.createElement(it) : {};
};

},{"../internals/global":61,"../internals/is-object":74}],50:[function(require,module,exports){
// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

},{}],51:[function(require,module,exports){
// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

},{}],52:[function(require,module,exports){
var objectKeys = require('../internals/object-keys');
var getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols');
var propertyIsEnumerableModule = require('../internals/object-property-is-enumerable');

// all enumerable object keys, includes symbols
module.exports = function (it) {
  var result = objectKeys(it);
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  if (getOwnPropertySymbols) {
    var symbols = getOwnPropertySymbols(it);
    var propertyIsEnumerable = propertyIsEnumerableModule.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (propertyIsEnumerable.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

},{"../internals/object-get-own-property-symbols":88,"../internals/object-keys":91,"../internals/object-property-is-enumerable":92}],53:[function(require,module,exports){
var global = require('../internals/global');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var hide = require('../internals/hide');
var redefine = require('../internals/redefine');
var setGlobal = require('../internals/set-global');
var copyConstructorProperties = require('../internals/copy-constructor-properties');
var isForced = require('../internals/is-forced');

/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty === typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      hide(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};

},{"../internals/copy-constructor-properties":41,"../internals/global":61,"../internals/hide":64,"../internals/is-forced":73,"../internals/object-get-own-property-descriptor":85,"../internals/redefine":98,"../internals/set-global":103}],54:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

},{}],55:[function(require,module,exports){
'use strict';
var hide = require('../internals/hide');
var redefine = require('../internals/redefine');
var fails = require('../internals/fails');
var wellKnownSymbol = require('../internals/well-known-symbol');
var regexpExec = require('../internals/regexp-exec');

var SPECIES = wellKnownSymbol('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
// Weex JS has frozen built-in prototypes, so use try / catch wrapper
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
});

module.exports = function (KEY, length, exec, sham) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };

    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      if (regexp.exec === regexpExec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
        }
        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
      }
      return { done: false };
    });
    var stringMethod = methods[0];
    var regexMethod = methods[1];

    redefine(String.prototype, KEY, stringMethod);
    redefine(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return regexMethod.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return regexMethod.call(string, this); }
    );
    if (sham) hide(RegExp.prototype[SYMBOL], 'sham', true);
  }
};

},{"../internals/fails":54,"../internals/hide":64,"../internals/redefine":98,"../internals/regexp-exec":100,"../internals/well-known-symbol":127}],56:[function(require,module,exports){
module.exports = !require('../internals/fails')(function () {
  return Object.isExtensible(Object.preventExtensions({}));
});

},{"../internals/fails":54}],57:[function(require,module,exports){
'use strict';
var aFunction = require('../internals/a-function');
var isObject = require('../internals/is-object');
var arraySlice = [].slice;
var factories = {};

var construct = function (C, argsLength, args) {
  if (!(argsLength in factories)) {
    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func
    factories[argsLength] = Function('C,a', 'return new C(' + list.join(',') + ')');
  } return factories[argsLength](C, args);
};

// `Function.prototype.bind` method implementation
// https://tc39.github.io/ecma262/#sec-function.prototype.bind
module.exports = Function.bind || function bind(that /* , ...args */) {
  var fn = aFunction(this);
  var partArgs = arraySlice.call(arguments, 1);
  var boundFunction = function bound(/* args... */) {
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof boundFunction ? construct(fn, args.length, args) : fn.apply(that, args);
  };
  if (isObject(fn.prototype)) boundFunction.prototype = fn.prototype;
  return boundFunction;
};

},{"../internals/a-function":19,"../internals/is-object":74}],58:[function(require,module,exports){
module.exports = require('../internals/shared')('native-function-to-string', Function.toString);

},{"../internals/shared":107}],59:[function(require,module,exports){
var path = require('../internals/path');
var global = require('../internals/global');

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global[namespace])
    : path[namespace] && path[namespace][method] || global[namespace] && global[namespace][method];
};

},{"../internals/global":61,"../internals/path":96}],60:[function(require,module,exports){
var classof = require('../internals/classof');
var ITERATOR = require('../internals/well-known-symbol')('iterator');
var Iterators = require('../internals/iterators');

module.exports = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"../internals/classof":38,"../internals/iterators":79,"../internals/well-known-symbol":127}],61:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports = typeof window == 'object' && window && window.Math == Math ? window
  : typeof self == 'object' && self && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();

},{}],62:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;

module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],63:[function(require,module,exports){
module.exports = {};

},{}],64:[function(require,module,exports){
var definePropertyModule = require('../internals/object-define-property');
var createPropertyDescriptor = require('../internals/create-property-descriptor');

module.exports = require('../internals/descriptors') ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"../internals/create-property-descriptor":44,"../internals/descriptors":48,"../internals/object-define-property":84}],65:[function(require,module,exports){
var document = require('../internals/global').document;

module.exports = document && document.documentElement;

},{"../internals/global":61}],66:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('../internals/descriptors') && !require('../internals/fails')(function () {
  return Object.defineProperty(require('../internals/document-create-element')('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

},{"../internals/descriptors":48,"../internals/document-create-element":49,"../internals/fails":54}],67:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var fails = require('../internals/fails');
var classof = require('../internals/classof-raw');
var split = ''.split;

module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;

},{"../internals/classof-raw":37,"../internals/fails":54}],68:[function(require,module,exports){
var isObject = require('../internals/is-object');
var setPrototypeOf = require('../internals/object-set-prototype-of');

module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};

},{"../internals/is-object":74,"../internals/object-set-prototype-of":93}],69:[function(require,module,exports){
var METADATA = require('../internals/uid')('meta');
var FREEZING = require('../internals/freezing');
var isObject = require('../internals/is-object');
var has = require('../internals/has');
var defineProperty = require('../internals/object-define-property').f;
var id = 0;

var isExtensible = Object.isExtensible || function () {
  return true;
};

var setMetadata = function (it) {
  defineProperty(it, METADATA, { value: {
    objectID: 'O' + ++id, // object ID
    weakData: {}          // weak collections IDs
  } });
};

var fastKey = function (it, create) {
  // return a primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMetadata(it);
  // return object ID
  } return it[METADATA].objectID;
};

var getWeakData = function (it, create) {
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMetadata(it);
  // return the store of weak collections IDs
  } return it[METADATA].weakData;
};

// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZING && meta.REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
  return it;
};

var meta = module.exports = {
  REQUIRED: false,
  fastKey: fastKey,
  getWeakData: getWeakData,
  onFreeze: onFreeze
};

require('../internals/hidden-keys')[METADATA] = true;

},{"../internals/freezing":56,"../internals/has":62,"../internals/hidden-keys":63,"../internals/is-object":74,"../internals/object-define-property":84,"../internals/uid":124}],70:[function(require,module,exports){
var NATIVE_WEAK_MAP = require('../internals/native-weak-map');
var isObject = require('../internals/is-object');
var hide = require('../internals/hide');
var objectHas = require('../internals/has');
var sharedKey = require('../internals/shared-key');
var hiddenKeys = require('../internals/hidden-keys');
var WeakMap = require('../internals/global').WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP) {
  var store = new WeakMap();
  var wmget = store.get;
  var wmhas = store.has;
  var wmset = store.set;
  set = function (it, metadata) {
    wmset.call(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store, it) || {};
  };
  has = function (it) {
    return wmhas.call(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    hide(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return objectHas(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return objectHas(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};

},{"../internals/global":61,"../internals/has":62,"../internals/hidden-keys":63,"../internals/hide":64,"../internals/is-object":74,"../internals/native-weak-map":81,"../internals/shared-key":106}],71:[function(require,module,exports){
// check on default Array iterator
var Iterators = require('../internals/iterators');
var ITERATOR = require('../internals/well-known-symbol')('iterator');
var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};

},{"../internals/iterators":79,"../internals/well-known-symbol":127}],72:[function(require,module,exports){
var classof = require('../internals/classof-raw');

// `IsArray` abstract operation
// https://tc39.github.io/ecma262/#sec-isarray
module.exports = Array.isArray || function isArray(arg) {
  return classof(arg) == 'Array';
};

},{"../internals/classof-raw":37}],73:[function(require,module,exports){
var fails = require('../internals/fails');
var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;

},{"../internals/fails":54}],74:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],75:[function(require,module,exports){
module.exports = false;

},{}],76:[function(require,module,exports){
var isObject = require('../internals/is-object');
var classof = require('../internals/classof-raw');
var MATCH = require('../internals/well-known-symbol')('match');

// `IsRegExp` abstract operation
// https://tc39.github.io/ecma262/#sec-isregexp
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof(it) == 'RegExp');
};

},{"../internals/classof-raw":37,"../internals/is-object":74,"../internals/well-known-symbol":127}],77:[function(require,module,exports){
var anObject = require('../internals/an-object');
var isArrayIteratorMethod = require('../internals/is-array-iterator-method');
var toLength = require('../internals/to-length');
var bind = require('../internals/bind-context');
var getIteratorMethod = require('../internals/get-iterator-method');
var callWithSafeIterationClosing = require('../internals/call-with-safe-iteration-closing');
var BREAK = {};

var exports = module.exports = function (iterable, fn, that, ENTRIES, ITERATOR) {
  var boundFunction = bind(fn, that, ENTRIES ? 2 : 1);
  var iterator, iterFn, index, length, result, step;

  if (ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = toLength(iterable.length); length > index; index++) {
        result = ENTRIES ? boundFunction(anObject(step = iterable[index])[0], step[1]) : boundFunction(iterable[index]);
        if (result === BREAK) return BREAK;
      } return;
    }
    iterator = iterFn.call(iterable);
  }

  while (!(step = iterator.next()).done) {
    if (callWithSafeIterationClosing(iterator, boundFunction, step.value, ENTRIES) === BREAK) return BREAK;
  }
};

exports.BREAK = BREAK;

},{"../internals/an-object":23,"../internals/bind-context":34,"../internals/call-with-safe-iteration-closing":35,"../internals/get-iterator-method":60,"../internals/is-array-iterator-method":71,"../internals/to-length":117}],78:[function(require,module,exports){
'use strict';
var getPrototypeOf = require('../internals/object-get-prototype-of');
var hide = require('../internals/hide');
var has = require('../internals/has');
var IS_PURE = require('../internals/is-pure');
var ITERATOR = require('../internals/well-known-symbol')('iterator');
var BUGGY_SAFARI_ITERATORS = false;

var returnThis = function () { return this; };

// `%IteratorPrototype%` object
// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

if (IteratorPrototype == undefined) IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
if (!IS_PURE && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};

},{"../internals/has":62,"../internals/hide":64,"../internals/is-pure":75,"../internals/object-get-prototype-of":89,"../internals/well-known-symbol":127}],79:[function(require,module,exports){
arguments[4][63][0].apply(exports,arguments)
},{"dup":63}],80:[function(require,module,exports){
// Chrome 38 Symbol has incorrect toString conversion
module.exports = !require('../internals/fails')(function () {
  // eslint-disable-next-line no-undef
  return !String(Symbol());
});

},{"../internals/fails":54}],81:[function(require,module,exports){
var nativeFunctionToString = require('../internals/function-to-string');
var WeakMap = require('../internals/global').WeakMap;

module.exports = typeof WeakMap === 'function' && /native code/.test(nativeFunctionToString.call(WeakMap));

},{"../internals/function-to-string":58,"../internals/global":61}],82:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('../internals/an-object');
var defineProperties = require('../internals/object-define-properties');
var enumBugKeys = require('../internals/enum-bug-keys');
var html = require('../internals/html');
var documentCreateElement = require('../internals/document-create-element');
var IE_PROTO = require('../internals/shared-key')('IE_PROTO');
var PROTOTYPE = 'prototype';
var Empty = function () { /* empty */ };

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var length = enumBugKeys.length;
  var lt = '<';
  var script = 'script';
  var gt = '>';
  var js = 'java' + script + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  iframe.src = String(js);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + script + gt + 'document.F=Object' + lt + '/' + script + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (length--) delete createDict[PROTOTYPE][enumBugKeys[length]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : defineProperties(result, Properties);
};

require('../internals/hidden-keys')[IE_PROTO] = true;

},{"../internals/an-object":23,"../internals/document-create-element":49,"../internals/enum-bug-keys":51,"../internals/hidden-keys":63,"../internals/html":65,"../internals/object-define-properties":83,"../internals/shared-key":106}],83:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var definePropertyModule = require('../internals/object-define-property');
var anObject = require('../internals/an-object');
var objectKeys = require('../internals/object-keys');

module.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var i = 0;
  var key;
  while (length > i) definePropertyModule.f(O, key = keys[i++], Properties[key]);
  return O;
};

},{"../internals/an-object":23,"../internals/descriptors":48,"../internals/object-define-property":84,"../internals/object-keys":91}],84:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var IE8_DOM_DEFINE = require('../internals/ie8-dom-define');
var anObject = require('../internals/an-object');
var toPrimitive = require('../internals/to-primitive');
var nativeDefineProperty = Object.defineProperty;

exports.f = DESCRIPTORS ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return nativeDefineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"../internals/an-object":23,"../internals/descriptors":48,"../internals/ie8-dom-define":66,"../internals/to-primitive":120}],85:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var propertyIsEnumerableModule = require('../internals/object-property-is-enumerable');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var toIndexedObject = require('../internals/to-indexed-object');
var toPrimitive = require('../internals/to-primitive');
var has = require('../internals/has');
var IE8_DOM_DEFINE = require('../internals/ie8-dom-define');
var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

exports.f = DESCRIPTORS ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return nativeGetOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O, P), O[P]);
};

},{"../internals/create-property-descriptor":44,"../internals/descriptors":48,"../internals/has":62,"../internals/ie8-dom-define":66,"../internals/object-property-is-enumerable":92,"../internals/to-indexed-object":115,"../internals/to-primitive":120}],86:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIndexedObject = require('../internals/to-indexed-object');
var nativeGetOwnPropertyNames = require('../internals/object-get-own-property-names').f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return nativeGetOwnPropertyNames(it);
  } catch (error) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]'
    ? getWindowNames(it)
    : nativeGetOwnPropertyNames(toIndexedObject(it));
};

},{"../internals/object-get-own-property-names":87,"../internals/to-indexed-object":115}],87:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var internalObjectKeys = require('../internals/object-keys-internal');
var hiddenKeys = require('../internals/enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};

},{"../internals/enum-bug-keys":51,"../internals/object-keys-internal":90}],88:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;

},{}],89:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('../internals/has');
var toObject = require('../internals/to-object');
var IE_PROTO = require('../internals/shared-key')('IE_PROTO');
var CORRECT_PROTOTYPE_GETTER = require('../internals/correct-prototype-getter');
var ObjectPrototype = Object.prototype;

module.exports = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype : null;
};

},{"../internals/correct-prototype-getter":42,"../internals/has":62,"../internals/shared-key":106,"../internals/to-object":118}],90:[function(require,module,exports){
var has = require('../internals/has');
var toIndexedObject = require('../internals/to-indexed-object');
var arrayIndexOf = require('../internals/array-includes')(false);
var hiddenKeys = require('../internals/hidden-keys');

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"../internals/array-includes":29,"../internals/has":62,"../internals/hidden-keys":63,"../internals/to-indexed-object":115}],91:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var internalObjectKeys = require('../internals/object-keys-internal');
var enumBugKeys = require('../internals/enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};

},{"../internals/enum-bug-keys":51,"../internals/object-keys-internal":90}],92:[function(require,module,exports){
'use strict';
var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = nativeGetOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = nativeGetOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : nativePropertyIsEnumerable;

},{}],93:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var validateSetPrototypeOfArguments = require('../internals/validate-set-prototype-of-arguments');

module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var correctSetter = false;
  var test = {};
  var setter;
  try {
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    correctSetter = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    validateSetPrototypeOfArguments(O, proto);
    if (correctSetter) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

},{"../internals/validate-set-prototype-of-arguments":126}],94:[function(require,module,exports){
'use strict';
var classof = require('../internals/classof');
var TO_STRING_TAG = require('../internals/well-known-symbol')('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

// `Object.prototype.toString` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
module.exports = String(test) !== '[object z]' ? function toString() {
  return '[object ' + classof(this) + ']';
} : test.toString;

},{"../internals/classof":38,"../internals/well-known-symbol":127}],95:[function(require,module,exports){
var getOwnPropertyNamesModule = require('../internals/object-get-own-property-names');
var getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols');
var anObject = require('../internals/an-object');
var Reflect = require('../internals/global').Reflect;

// all object keys, includes non-enumerable and symbols
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};

},{"../internals/an-object":23,"../internals/global":61,"../internals/object-get-own-property-names":87,"../internals/object-get-own-property-symbols":88}],96:[function(require,module,exports){
module.exports = require('../internals/global');

},{"../internals/global":61}],97:[function(require,module,exports){
var redefine = require('../internals/redefine');

module.exports = function (target, src, options) {
  for (var key in src) redefine(target, key, src[key], options);
  return target;
};

},{"../internals/redefine":98}],98:[function(require,module,exports){
var global = require('../internals/global');
var hide = require('../internals/hide');
var has = require('../internals/has');
var setGlobal = require('../internals/set-global');
var nativeFunctionToString = require('../internals/function-to-string');
var InternalStateModule = require('../internals/internal-state');
var getInternalState = InternalStateModule.get;
var enforceInternalState = InternalStateModule.enforce;
var TEMPLATE = String(nativeFunctionToString).split('toString');

require('../internals/shared')('inspectSource', function (it) {
  return nativeFunctionToString.call(it);
});

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  if (typeof value == 'function') {
    if (typeof key == 'string' && !has(value, 'name')) hide(value, 'name', key);
    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
  }
  if (O === global) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else hide(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return typeof this == 'function' && getInternalState(this).source || nativeFunctionToString.call(this);
});

},{"../internals/function-to-string":58,"../internals/global":61,"../internals/has":62,"../internals/hide":64,"../internals/internal-state":70,"../internals/set-global":103,"../internals/shared":107}],99:[function(require,module,exports){
var classof = require('./classof-raw');
var regexpExec = require('./regexp-exec');

// `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }

  if (classof(R) !== 'RegExp') {
    throw TypeError('RegExp#exec called on incompatible receiver');
  }

  return regexpExec.call(R, S);
};


},{"./classof-raw":37,"./regexp-exec":100}],100:[function(require,module,exports){
'use strict';

var regexpFlags = require('./regexp-flags');

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;

},{"./regexp-flags":101}],101:[function(require,module,exports){
'use strict';
var anObject = require('../internals/an-object');

// `RegExp.prototype.flags` getter implementation
// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

},{"../internals/an-object":23}],102:[function(require,module,exports){
// `RequireObjectCoercible` abstract operation
// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};

},{}],103:[function(require,module,exports){
var global = require('../internals/global');
var hide = require('../internals/hide');

module.exports = function (key, value) {
  try {
    hide(global, key, value);
  } catch (error) {
    global[key] = value;
  } return value;
};

},{"../internals/global":61,"../internals/hide":64}],104:[function(require,module,exports){
'use strict';
var getBuiltIn = require('../internals/get-built-in');
var definePropertyModule = require('../internals/object-define-property');
var DESCRIPTORS = require('../internals/descriptors');
var SPECIES = require('../internals/well-known-symbol')('species');

module.exports = function (CONSTRUCTOR_NAME) {
  var C = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = definePropertyModule.f;
  if (DESCRIPTORS && C && !C[SPECIES]) defineProperty(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};

},{"../internals/descriptors":48,"../internals/get-built-in":59,"../internals/object-define-property":84,"../internals/well-known-symbol":127}],105:[function(require,module,exports){
var defineProperty = require('../internals/object-define-property').f;
var has = require('../internals/has');
var TO_STRING_TAG = require('../internals/well-known-symbol')('toStringTag');

module.exports = function (it, TAG, STATIC) {
  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
    defineProperty(it, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};

},{"../internals/has":62,"../internals/object-define-property":84,"../internals/well-known-symbol":127}],106:[function(require,module,exports){
var shared = require('../internals/shared')('keys');
var uid = require('../internals/uid');

module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"../internals/shared":107,"../internals/uid":124}],107:[function(require,module,exports){
var global = require('../internals/global');
var setGlobal = require('../internals/set-global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || setGlobal(SHARED, {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.0.1',
  mode: require('../internals/is-pure') ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});

},{"../internals/global":61,"../internals/is-pure":75,"../internals/set-global":103}],108:[function(require,module,exports){
'use strict';
var fails = require('../internals/fails');

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !method || !fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal
    method.call(null, argument || function () { throw 1; }, 1);
  });
};

},{"../internals/fails":54}],109:[function(require,module,exports){
var anObject = require('../internals/an-object');
var aFunction = require('../internals/a-function');
var SPECIES = require('../internals/well-known-symbol')('species');

// `SpeciesConstructor` abstract operation
// https://tc39.github.io/ecma262/#sec-speciesconstructor
module.exports = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? defaultConstructor : aFunction(S);
};

},{"../internals/a-function":19,"../internals/an-object":23,"../internals/well-known-symbol":127}],110:[function(require,module,exports){
var toInteger = require('../internals/to-integer');
var requireObjectCoercible = require('../internals/require-object-coercible');
// CONVERT_TO_STRING: true  -> String#at
// CONVERT_TO_STRING: false -> String#codePointAt
module.exports = function (that, pos, CONVERT_TO_STRING) {
  var S = String(requireObjectCoercible(that));
  var position = toInteger(pos);
  var size = S.length;
  var first, second;
  if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
  first = S.charCodeAt(position);
  return first < 0xD800 || first > 0xDBFF || position + 1 === size
    || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
      ? CONVERT_TO_STRING ? S.charAt(position) : first
      : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
};

},{"../internals/require-object-coercible":102,"../internals/to-integer":116}],111:[function(require,module,exports){
'use strict';
var toInteger = require('../internals/to-integer');
var requireObjectCoercible = require('../internals/require-object-coercible');

// `String.prototype.repeat` method implementation
// https://tc39.github.io/ecma262/#sec-string.prototype.repeat
module.exports = ''.repeat || function repeat(count) {
  var str = String(requireObjectCoercible(this));
  var result = '';
  var n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError('Wrong number of repetitions');
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
  return result;
};

},{"../internals/require-object-coercible":102,"../internals/to-integer":116}],112:[function(require,module,exports){
var classof = require('../internals/classof-raw');

// `thisNumberValue` abstract operation
// https://tc39.github.io/ecma262/#sec-thisnumbervalue
module.exports = function (value) {
  if (typeof value != 'number' && classof(value) != 'Number') {
    throw TypeError('Incorrect invocation');
  }
  return +value;
};

},{"../internals/classof-raw":37}],113:[function(require,module,exports){
var toInteger = require('../internals/to-integer');
var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(length, length).
module.exports = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};

},{"../internals/to-integer":116}],114:[function(require,module,exports){
var toInteger = require('../internals/to-integer');
var toLength = require('../internals/to-length');

// `ToIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-toindex
module.exports = function (it) {
  if (it === undefined) return 0;
  var number = toInteger(it);
  var length = toLength(number);
  if (number !== length) throw RangeError('Wrong length or index');
  return length;
};

},{"../internals/to-integer":116,"../internals/to-length":117}],115:[function(require,module,exports){
// toObject with fallback for non-array-like ES3 strings
var IndexedObject = require('../internals/indexed-object');
var requireObjectCoercible = require('../internals/require-object-coercible');

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};

},{"../internals/indexed-object":67,"../internals/require-object-coercible":102}],116:[function(require,module,exports){
var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.github.io/ecma262/#sec-tointeger
module.exports = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};

},{}],117:[function(require,module,exports){
var toInteger = require('../internals/to-integer');
var min = Math.min;

// `ToLength` abstract operation
// https://tc39.github.io/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

},{"../internals/to-integer":116}],118:[function(require,module,exports){
var requireObjectCoercible = require('../internals/require-object-coercible');

// `ToObject` abstract operation
// https://tc39.github.io/ecma262/#sec-toobject
module.exports = function (argument) {
  return Object(requireObjectCoercible(argument));
};

},{"../internals/require-object-coercible":102}],119:[function(require,module,exports){
var toInteger = require('../internals/to-integer');

module.exports = function (it, BYTES) {
  var offset = toInteger(it);
  if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset');
  return offset;
};

},{"../internals/to-integer":116}],120:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('../internals/is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"../internals/is-object":74}],121:[function(require,module,exports){
'use strict';
if (require('../internals/descriptors')) {
  var global = require('../internals/global');
  var $export = require('../internals/export');
  var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS = require('../internals/typed-arrays-constructors-requires-wrappers');
  var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
  var ArrayBufferModule = require('../internals/array-buffer');
  var anInstance = require('../internals/an-instance');
  var createPropertyDescriptor = require('../internals/create-property-descriptor');
  var hide = require('../internals/hide');
  var toLength = require('../internals/to-length');
  var toIndex = require('../internals/to-index');
  var toOffset = require('../internals/to-offset');
  var toPrimitive = require('../internals/to-primitive');
  var has = require('../internals/has');
  var classof = require('../internals/classof');
  var isObject = require('../internals/is-object');
  var create = require('../internals/object-create');
  var setPrototypeOf = require('../internals/object-set-prototype-of');
  var getOwnPropertyNames = require('../internals/object-get-own-property-names').f;
  var typedArrayFrom = require('../internals/typed-array-from');
  var arrayForEach = require('../internals/array-methods')(0);
  var setSpecies = require('../internals/set-species');
  var definePropertyModule = require('../internals/object-define-property');
  var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
  var InternalStateModule = require('../internals/internal-state');
  var getInternalState = InternalStateModule.get;
  var setInternalState = InternalStateModule.set;
  var nativeDefineProperty = definePropertyModule.f;
  var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  var RangeError = global.RangeError;
  var ArrayBuffer = ArrayBufferModule.ArrayBuffer;
  var DataView = ArrayBufferModule.DataView;
  var NATIVE_ARRAY_BUFFER_VIEWS = ArrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
  var TYPED_ARRAY_TAG = ArrayBufferViewCore.TYPED_ARRAY_TAG;
  var TypedArray = ArrayBufferViewCore.TypedArray;
  var TypedArrayPrototype = ArrayBufferViewCore.TypedArrayPrototype;
  var aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor;
  var isTypedArray = ArrayBufferViewCore.isTypedArray;
  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
  var WRONG_LENGTH = 'Wrong length';

  var fromList = function (C, list) {
    var index = 0;
    var length = list.length;
    var result = new (aTypedArrayConstructor(C))(length);
    while (length > index) result[index] = list[index++];
    return result;
  };

  var addGetter = function (it, key) {
    nativeDefineProperty(it, key, { get: function () {
      return getInternalState(this)[key];
    } });
  };

  var isArrayBuffer = function (it) {
    var klass;
    return it instanceof ArrayBuffer || (klass = classof(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
  };

  var isTypedArrayIndex = function (target, key) {
    return isTypedArray(target)
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };

  var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
    return isTypedArrayIndex(target, key = toPrimitive(key, true))
      ? createPropertyDescriptor(2, target[key])
      : nativeGetOwnPropertyDescriptor(target, key);
  };

  var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
    if (isTypedArrayIndex(target, key = toPrimitive(key, true))
      && isObject(descriptor)
      && has(descriptor, 'value')
      && !has(descriptor, 'get')
      && !has(descriptor, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !descriptor.configurable
      && (!has(descriptor, 'writable') || descriptor.writable)
      && (!has(descriptor, 'enumerable') || descriptor.enumerable)
    ) {
      target[key] = descriptor.value;
      return target;
    } return nativeDefineProperty(target, key, descriptor);
  };

  if (!NATIVE_ARRAY_BUFFER_VIEWS) {
    getOwnPropertyDescriptorModule.f = wrappedGetOwnPropertyDescriptor;
    definePropertyModule.f = wrappedDefineProperty;
    addGetter(TypedArrayPrototype, 'buffer');
    addGetter(TypedArrayPrototype, 'byteOffset');
    addGetter(TypedArrayPrototype, 'byteLength');
    addGetter(TypedArrayPrototype, 'length');
  }

  $export({ target: 'Object', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
    getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
    defineProperty: wrappedDefineProperty
  });

  // eslint-disable-next-line max-statements
  module.exports = function (TYPE, BYTES, wrapper, CLAMPED) {
    var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + TYPE;
    var SETTER = 'set' + TYPE;
    var NativeTypedArrayConstructor = global[CONSTRUCTOR_NAME];
    var TypedArrayConstructor = NativeTypedArrayConstructor;
    var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
    var exported = {};

    var getter = function (that, index) {
      var data = getInternalState(that);
      return data.view[GETTER](index * BYTES + data.byteOffset, true);
    };

    var setter = function (that, index, value) {
      var data = getInternalState(that);
      if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
      data.view[SETTER](index * BYTES + data.byteOffset, value, true);
    };

    var addElement = function (that, index) {
      nativeDefineProperty(that, index, {
        get: function () {
          return getter(this, index);
        },
        set: function (value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };

    if (!NATIVE_ARRAY_BUFFER_VIEWS) {
      TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
        anInstance(that, TypedArrayConstructor, CONSTRUCTOR_NAME);
        var index = 0;
        var byteOffset = 0;
        var buffer, byteLength, length;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new ArrayBuffer(byteLength);
        } else if (isArrayBuffer(data)) {
          buffer = data;
          byteOffset = toOffset(offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - byteOffset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + byteOffset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (isTypedArray(data)) {
          return fromList(TypedArrayConstructor, data);
        } else {
          return typedArrayFrom.call(TypedArrayConstructor, data);
        }
        setInternalState(that, {
          buffer: buffer,
          byteOffset: byteOffset,
          byteLength: byteLength,
          length: length,
          view: new DataView(buffer)
        });
        while (index < length) addElement(that, index++);
      });

      if (setPrototypeOf) setPrototypeOf(TypedArrayConstructor, TypedArray);
      TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = create(TypedArrayPrototype);
    } else if (TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS) {
      TypedArrayConstructor = wrapper(function (that, data, typedArrayOffset, $length) {
        anInstance(that, TypedArrayConstructor, CONSTRUCTOR_NAME);
        if (!isObject(data)) return new NativeTypedArrayConstructor(toIndex(data));
        if (isArrayBuffer(data)) return $length !== undefined
          ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES), $length)
          : typedArrayOffset !== undefined
            ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES))
            : new NativeTypedArrayConstructor(data);
        if (isTypedArray(data)) return fromList(TypedArrayConstructor, data);
        return typedArrayFrom.call(TypedArrayConstructor, data);
      });

      if (setPrototypeOf) setPrototypeOf(TypedArrayConstructor, TypedArray);
      arrayForEach(getOwnPropertyNames(NativeTypedArrayConstructor), function (key) {
        if (!(key in TypedArrayConstructor)) hide(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
      });
      TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
    }

    if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
      hide(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
    }

    if (TYPED_ARRAY_TAG) hide(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);

    exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;

    $export({
      global: true, forced: TypedArrayConstructor != NativeTypedArrayConstructor, sham: !NATIVE_ARRAY_BUFFER_VIEWS
    }, exported);

    if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
      hide(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
    }

    if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
      hide(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
    }

    setSpecies(CONSTRUCTOR_NAME);
  };
} else module.exports = function () { /* empty */ };

},{"../internals/an-instance":22,"../internals/array-buffer":25,"../internals/array-buffer-view-core":24,"../internals/array-methods":32,"../internals/classof":38,"../internals/create-property-descriptor":44,"../internals/descriptors":48,"../internals/export":53,"../internals/global":61,"../internals/has":62,"../internals/hide":64,"../internals/internal-state":70,"../internals/is-object":74,"../internals/object-create":82,"../internals/object-define-property":84,"../internals/object-get-own-property-descriptor":85,"../internals/object-get-own-property-names":87,"../internals/object-set-prototype-of":93,"../internals/set-species":104,"../internals/to-index":114,"../internals/to-length":117,"../internals/to-offset":119,"../internals/to-primitive":120,"../internals/typed-array-from":122,"../internals/typed-arrays-constructors-requires-wrappers":123}],122:[function(require,module,exports){
var toObject = require('../internals/to-object');
var toLength = require('../internals/to-length');
var getIteratorMethod = require('../internals/get-iterator-method');
var isArrayIteratorMethod = require('../internals/is-array-iterator-method');
var bind = require('../internals/bind-context');
var aTypedArrayConstructor = require('../internals/array-buffer-view-core').aTypedArrayConstructor;

module.exports = function from(source /* , mapfn, thisArg */) {
  var O = toObject(source);
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var i, length, result, step, iterator;
  if (iteratorMethod != undefined && !isArrayIteratorMethod(iteratorMethod)) {
    iterator = iteratorMethod.call(O);
    O = [];
    while (!(step = iterator.next()).done) {
      O.push(step.value);
    }
  }
  if (mapping && argumentsLength > 2) {
    mapfn = bind(mapfn, arguments[2], 2);
  }
  length = toLength(O.length);
  result = new (aTypedArrayConstructor(this))(length);
  for (i = 0; length > i; i++) {
    result[i] = mapping ? mapfn(O[i], i) : O[i];
  }
  return result;
};

},{"../internals/array-buffer-view-core":24,"../internals/bind-context":34,"../internals/get-iterator-method":60,"../internals/is-array-iterator-method":71,"../internals/to-length":117,"../internals/to-object":118}],123:[function(require,module,exports){
/* eslint-disable no-new */
var global = require('../internals/global');
var fails = require('../internals/fails');
var checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration');
var NATIVE_ARRAY_BUFFER_VIEWS = require('../internals/array-buffer-view-core').NATIVE_ARRAY_BUFFER_VIEWS;
var ArrayBuffer = global.ArrayBuffer;
var Int8Array = global.Int8Array;

module.exports = !NATIVE_ARRAY_BUFFER_VIEWS || !fails(function () {
  Int8Array(1);
}) || !fails(function () {
  new Int8Array(-1);
}) || !checkCorrectnessOfIteration(function (iterable) {
  new Int8Array();
  new Int8Array(null);
  new Int8Array(1.5);
  new Int8Array(iterable);
}, true) || fails(function () {
  // Safari 11 bug
  return new Int8Array(new ArrayBuffer(2), 1, undefined).length !== 1;
});

},{"../internals/array-buffer-view-core":24,"../internals/check-correctness-of-iteration":36,"../internals/fails":54,"../internals/global":61}],124:[function(require,module,exports){
var id = 0;
var postfix = Math.random();

module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + postfix).toString(36));
};

},{}],125:[function(require,module,exports){
var global = require('../internals/global');
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';

},{"../internals/global":61}],126:[function(require,module,exports){
var isObject = require('../internals/is-object');
var anObject = require('../internals/an-object');

module.exports = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) {
    throw TypeError("Can't set " + String(proto) + ' as a prototype');
  }
};

},{"../internals/an-object":23,"../internals/is-object":74}],127:[function(require,module,exports){
var store = require('../internals/shared')('wks');
var uid = require('../internals/uid');
var Symbol = require('../internals/global').Symbol;
var NATIVE_SYMBOL = require('../internals/native-symbol');

module.exports = function (name) {
  return store[name] || (store[name] = NATIVE_SYMBOL && Symbol[name]
    || (NATIVE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

},{"../internals/global":61,"../internals/native-symbol":80,"../internals/shared":107,"../internals/uid":124}],128:[function(require,module,exports){
exports.f = require('../internals/well-known-symbol');

},{"../internals/well-known-symbol":127}],129:[function(require,module,exports){
'use strict';
var ArrayBufferModule = require('../internals/array-buffer');
var anObject = require('../internals/an-object');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var toLength = require('../internals/to-length');
var speciesConstructor = require('../internals/species-constructor');
var ArrayBuffer = ArrayBufferModule.ArrayBuffer;
var DataView = ArrayBufferModule.DataView;
var nativeArrayBufferSlice = ArrayBuffer.prototype.slice;

var INCORRECT_SLICE = require('../internals/fails')(function () {
  return !new ArrayBuffer(2).slice(1, undefined).byteLength;
});

// `ArrayBuffer.prototype.slice` method
// https://tc39.github.io/ecma262/#sec-arraybuffer.prototype.slice
require('../internals/export')({ target: 'ArrayBuffer', proto: true, unsafe: true, forced: INCORRECT_SLICE }, {
  slice: function slice(start, end) {
    if (nativeArrayBufferSlice !== undefined && end === undefined) {
      return nativeArrayBufferSlice.call(anObject(this), start); // FF fix
    }
    var length = anObject(this).byteLength;
    var first = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    var result = new (speciesConstructor(this, ArrayBuffer))(toLength(fin - first));
    var viewSource = new DataView(this);
    var viewTarget = new DataView(result);
    var index = 0;
    while (first < fin) {
      viewTarget.setUint8(index++, viewSource.getUint8(first++));
    } return result;
  }
});

},{"../internals/an-object":23,"../internals/array-buffer":25,"../internals/export":53,"../internals/fails":54,"../internals/species-constructor":109,"../internals/to-absolute-index":113,"../internals/to-length":117}],130:[function(require,module,exports){
'use strict';
var isArray = require('../internals/is-array');
var isObject = require('../internals/is-object');
var toObject = require('../internals/to-object');
var toLength = require('../internals/to-length');
var createProperty = require('../internals/create-property');
var arraySpeciesCreate = require('../internals/array-species-create');
var IS_CONCAT_SPREADABLE = require('../internals/well-known-symbol')('isConcatSpreadable');
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

var IS_CONCAT_SPREADABLE_SUPPORT = !require('../internals/fails')(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = require('../internals/array-method-has-species-support')('concat');

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.github.io/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
require('../internals/export')({ target: 'Array', proto: true, forced: FORCED }, {
  concat: function concat(arg) { // eslint-disable-line no-unused-vars
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = toLength(E.length);
        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});

},{"../internals/array-method-has-species-support":31,"../internals/array-species-create":33,"../internals/create-property":45,"../internals/export":53,"../internals/fails":54,"../internals/is-array":72,"../internals/is-object":74,"../internals/to-length":117,"../internals/to-object":118,"../internals/well-known-symbol":127}],131:[function(require,module,exports){
'use strict';
var forEach = require('../internals/array-for-each');

// `Array.prototype.forEach` method
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
require('../internals/export')({ target: 'Array', proto: true, forced: [].forEach != forEach }, { forEach: forEach });

},{"../internals/array-for-each":28,"../internals/export":53}],132:[function(require,module,exports){
'use strict';
var internalIndexOf = require('../internals/array-includes')(false);
var nativeIndexOf = [].indexOf;

var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
var SLOPPY_METHOD = require('../internals/sloppy-array-method')('indexOf');

// `Array.prototype.indexOf` method
// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
require('../internals/export')({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || SLOPPY_METHOD }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? nativeIndexOf.apply(this, arguments) || 0
      : internalIndexOf(this, searchElement, arguments[1]);
  }
});

},{"../internals/array-includes":29,"../internals/export":53,"../internals/sloppy-array-method":108}],133:[function(require,module,exports){
'use strict';
var toIndexedObject = require('../internals/to-indexed-object');
var addToUnscopables = require('../internals/add-to-unscopables');
var Iterators = require('../internals/iterators');
var InternalStateModule = require('../internals/internal-state');
var defineIterator = require('../internals/define-iterator');
var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.github.io/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.github.io/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.github.io/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.github.io/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
Iterators.Arguments = Iterators.Array;

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"../internals/add-to-unscopables":20,"../internals/define-iterator":46,"../internals/internal-state":70,"../internals/iterators":79,"../internals/to-indexed-object":115}],134:[function(require,module,exports){
'use strict';
var isObject = require('../internals/is-object');
var isArray = require('../internals/is-array');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var toLength = require('../internals/to-length');
var toIndexedObject = require('../internals/to-indexed-object');
var createProperty = require('../internals/create-property');
var SPECIES = require('../internals/well-known-symbol')('species');
var nativeSlice = [].slice;
var max = Math.max;

var SPECIES_SUPPORT = require('../internals/array-method-has-species-support')('slice');

// `Array.prototype.slice` method
// https://tc39.github.io/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
require('../internals/export')({ target: 'Array', proto: true, forced: !SPECIES_SUPPORT }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = toLength(O.length);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === Array || Constructor === undefined) {
        return nativeSlice.call(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? Array : Constructor)(max(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});

},{"../internals/array-method-has-species-support":31,"../internals/create-property":45,"../internals/export":53,"../internals/is-array":72,"../internals/is-object":74,"../internals/to-absolute-index":113,"../internals/to-indexed-object":115,"../internals/to-length":117,"../internals/well-known-symbol":127}],135:[function(require,module,exports){
'use strict';
var toAbsoluteIndex = require('../internals/to-absolute-index');
var toInteger = require('../internals/to-integer');
var toLength = require('../internals/to-length');
var toObject = require('../internals/to-object');
var arraySpeciesCreate = require('../internals/array-species-create');
var createProperty = require('../internals/create-property');
var max = Math.max;
var min = Math.min;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

var SPECIES_SUPPORT = require('../internals/array-method-has-species-support')('splice');

// `Array.prototype.splice` method
// https://tc39.github.io/ecma262/#sec-array.prototype.splice
// with adding support of @@species
require('../internals/export')({ target: 'Array', proto: true, forced: !SPECIES_SUPPORT }, {
  splice: function splice(start, deleteCount /* , ...items */) {
    var O = toObject(this);
    var len = toLength(O.length);
    var actualStart = toAbsoluteIndex(start, len);
    var argumentsLength = arguments.length;
    var insertCount, actualDeleteCount, A, k, from, to;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min(max(toInteger(deleteCount), 0), len - actualStart);
    }
    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
    }
    A = arraySpeciesCreate(O, actualDeleteCount);
    for (k = 0; k < actualDeleteCount; k++) {
      from = actualStart + k;
      if (from in O) createProperty(A, k, O[from]);
    }
    A.length = actualDeleteCount;
    if (insertCount < actualDeleteCount) {
      for (k = actualStart; k < len - actualDeleteCount; k++) {
        from = k + actualDeleteCount;
        to = k + insertCount;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
    } else if (insertCount > actualDeleteCount) {
      for (k = len - actualDeleteCount; k > actualStart; k--) {
        from = k + actualDeleteCount - 1;
        to = k + insertCount - 1;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
    }
    for (k = 0; k < insertCount; k++) {
      O[k + actualStart] = arguments[k + 2];
    }
    O.length = len - actualDeleteCount + insertCount;
    return A;
  }
});

},{"../internals/array-method-has-species-support":31,"../internals/array-species-create":33,"../internals/create-property":45,"../internals/export":53,"../internals/to-absolute-index":113,"../internals/to-integer":116,"../internals/to-length":117,"../internals/to-object":118}],136:[function(require,module,exports){
var DatePrototype = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var nativeDateToString = DatePrototype[TO_STRING];
var getTime = DatePrototype.getTime;

// `Date.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-date.prototype.tostring
if (new Date(NaN) + '' != INVALID_DATE) {
  require('../internals/redefine')(DatePrototype, TO_STRING, function toString() {
    var value = getTime.call(this);
    // eslint-disable-next-line no-self-compare
    return value === value ? nativeDateToString.call(this) : INVALID_DATE;
  });
}

},{"../internals/redefine":98}],137:[function(require,module,exports){
// `Function.prototype.bind` method
// https://tc39.github.io/ecma262/#sec-function.prototype.bind
require('../internals/export')({ target: 'Function', proto: true }, {
  bind: require('../internals/function-bind')
});

},{"../internals/export":53,"../internals/function-bind":57}],138:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var defineProperty = require('../internals/object-define-property').f;
var FunctionPrototype = Function.prototype;
var FunctionPrototypeToString = FunctionPrototype.toString;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// Function instances `.name` property
// https://tc39.github.io/ecma262/#sec-function-instances-name
if (DESCRIPTORS && !(NAME in FunctionPrototype)) {
  defineProperty(FunctionPrototype, NAME, {
    configurable: true,
    get: function () {
      try {
        return FunctionPrototypeToString.call(this).match(nameRE)[1];
      } catch (error) {
        return '';
      }
    }
  });
}

},{"../internals/descriptors":48,"../internals/object-define-property":84}],139:[function(require,module,exports){
'use strict';
// `Map` constructor
// https://tc39.github.io/ecma262/#sec-map-objects
module.exports = require('../internals/collection')('Map', function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, require('../internals/collection-strong'), true);

},{"../internals/collection":40,"../internals/collection-strong":39}],140:[function(require,module,exports){
'use strict';
var toInteger = require('../internals/to-integer');
var thisNumberValue = require('../internals/this-number-value');
var repeat = require('../internals/string-repeat');
var nativeToFixed = 1.0.toFixed;
var floor = Math.floor;
var data = [0, 0, 0, 0, 0, 0];

var multiply = function (n, c) {
  var i = -1;
  var c2 = c;
  while (++i < 6) {
    c2 += n * data[i];
    data[i] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};

var divide = function (n) {
  var i = 6;
  var c = 0;
  while (--i >= 0) {
    c += data[i];
    data[i] = floor(c / n);
    c = (c % n) * 1e7;
  }
};

var numToString = function () {
  var i = 6;
  var s = '';
  while (--i >= 0) {
    if (s !== '' || i === 0 || data[i] !== 0) {
      var t = String(data[i]);
      s = s === '' ? t : s + repeat.call('0', 7 - t.length) + t;
    }
  } return s;
};

var pow = function (x, n, acc) {
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};

var log = function (x) {
  var n = 0;
  var x2 = x;
  while (x2 >= 4096) {
    n += 12;
    x2 /= 4096;
  }
  while (x2 >= 2) {
    n += 1;
    x2 /= 2;
  } return n;
};

// `Number.prototype.toFixed` method
// https://tc39.github.io/ecma262/#sec-number.prototype.tofixed
require('../internals/export')({ target: 'Number', proto: true, forced: nativeToFixed && (
  0.00008.toFixed(3) !== '0.000' ||
  0.9.toFixed(0) !== '1' ||
  1.255.toFixed(2) !== '1.25' ||
  1000000000000000128.0.toFixed(0) !== '1000000000000000128'
) || !require('../internals/fails')(function () {
  // V8 ~ Android 4.3-
  nativeToFixed.call({});
}) }, {
  toFixed: function toFixed(fractionDigits) {
    var x = thisNumberValue(this);
    var f = toInteger(fractionDigits);
    var s = '';
    var m = '0';
    var e, z, j, k;
    if (f < 0 || f > 20) throw RangeError('Incorrect fraction digits');
    // eslint-disable-next-line no-self-compare
    if (x != x) return 'NaN';
    if (x <= -1e21 || x >= 1e21) return String(x);
    if (x < 0) {
      s = '-';
      x = -x;
    }
    if (x > 1e-21) {
      e = log(x * pow(2, 69, 1)) - 69;
      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if (e > 0) {
        multiply(0, z);
        j = f;
        while (j >= 7) {
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow(10, j, 1), 0);
        j = e - 1;
        while (j >= 23) {
          divide(1 << 23);
          j -= 23;
        }
        divide(1 << j);
        multiply(1, 1);
        divide(2);
        m = numToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        m = numToString() + repeat.call('0', f);
      }
    }
    if (f > 0) {
      k = m.length;
      m = s + (k <= f ? '0.' + repeat.call('0', f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
    } else {
      m = s + m;
    } return m;
  }
});

},{"../internals/export":53,"../internals/fails":54,"../internals/string-repeat":111,"../internals/this-number-value":112,"../internals/to-integer":116}],141:[function(require,module,exports){
// `Object.create` method
// https://tc39.github.io/ecma262/#sec-object.create
require('../internals/export')({
  target: 'Object', stat: true, sham: !require('../internals/descriptors')
}, { create: require('../internals/object-create') });

},{"../internals/descriptors":48,"../internals/export":53,"../internals/object-create":82}],142:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');

// `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
require('../internals/export')({ target: 'Object', stat: true, forced: !DESCRIPTORS, sham: !DESCRIPTORS }, {
  defineProperty: require('../internals/object-define-property').f
});

},{"../internals/descriptors":48,"../internals/export":53,"../internals/object-define-property":84}],143:[function(require,module,exports){
var toIndexedObject = require('../internals/to-indexed-object');
var nativeGetOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var DESCRIPTORS = require('../internals/descriptors');
var FAILS_ON_PRIMITIVES = require('../internals/fails')(function () { nativeGetOwnPropertyDescriptor(1); });
var FORCED = !DESCRIPTORS || FAILS_ON_PRIMITIVES;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
require('../internals/export')({ target: 'Object', stat: true, forced: FORCED, sham: !DESCRIPTORS }, {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
    return nativeGetOwnPropertyDescriptor(toIndexedObject(it), key);
  }
});

},{"../internals/descriptors":48,"../internals/export":53,"../internals/fails":54,"../internals/object-get-own-property-descriptor":85,"../internals/to-indexed-object":115}],144:[function(require,module,exports){
var toObject = require('../internals/to-object');
var nativeGetPrototypeOf = require('../internals/object-get-prototype-of');
var CORRECT_PROTOTYPE_GETTER = require('../internals/correct-prototype-getter');
var FAILS_ON_PRIMITIVES = require('../internals/fails')(function () { nativeGetPrototypeOf(1); });

// `Object.getPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.getprototypeof
require('../internals/export')({
  target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !CORRECT_PROTOTYPE_GETTER
}, {
  getPrototypeOf: function getPrototypeOf(it) {
    return nativeGetPrototypeOf(toObject(it));
  }
});


},{"../internals/correct-prototype-getter":42,"../internals/export":53,"../internals/fails":54,"../internals/object-get-prototype-of":89,"../internals/to-object":118}],145:[function(require,module,exports){
// `Object.setPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.setprototypeof
require('../internals/export')({ target: 'Object', stat: true }, {
  setPrototypeOf: require('../internals/object-set-prototype-of')
});

},{"../internals/export":53,"../internals/object-set-prototype-of":93}],146:[function(require,module,exports){
var toString = require('../internals/object-to-string');
var ObjectPrototype = Object.prototype;

// `Object.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
if (toString !== ObjectPrototype.toString) {
  require('../internals/redefine')(ObjectPrototype, 'toString', toString, { unsafe: true });
}

},{"../internals/object-to-string":94,"../internals/redefine":98}],147:[function(require,module,exports){
var create = require('../internals/object-create');
var aFunction = require('../internals/a-function');
var anObject = require('../internals/an-object');
var isObject = require('../internals/is-object');
var fails = require('../internals/fails');
var bind = require('../internals/function-bind');
var nativeConstruct = (require('../internals/global').Reflect || {}).construct;

// `Reflect.construct` method
// https://tc39.github.io/ecma262/#sec-reflect.construct
// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() { /* empty */ }
  return !(nativeConstruct(function () { /* empty */ }, [], F) instanceof F);
});
var ARGS_BUG = !fails(function () {
  nativeConstruct(function () { /* empty */ });
});
var FORCED = NEW_TARGET_BUG || ARGS_BUG;

require('../internals/export')({ target: 'Reflect', stat: true, forced: FORCED, sham: FORCED }, {
  construct: function construct(Target, args /* , newTarget */) {
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = create(isObject(proto) ? proto : Object.prototype);
    var result = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});

},{"../internals/a-function":19,"../internals/an-object":23,"../internals/export":53,"../internals/fails":54,"../internals/function-bind":57,"../internals/global":61,"../internals/is-object":74,"../internals/object-create":82}],148:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var MATCH = require('../internals/well-known-symbol')('match');
var global = require('../internals/global');
var isForced = require('../internals/is-forced');
var inheritIfRequired = require('../internals/inherit-if-required');
var defineProperty = require('../internals/object-define-property').f;
var getOwnPropertyNames = require('../internals/object-get-own-property-names').f;
var isRegExp = require('../internals/is-regexp');
var getFlags = require('../internals/regexp-flags');
var redefine = require('../internals/redefine');
var fails = require('../internals/fails');
var NativeRegExp = global.RegExp;
var RegExpPrototype = NativeRegExp.prototype;
var re1 = /a/g;
var re2 = /a/g;

// "new" should create a new object, old webkit bug
var CORRECT_NEW = new NativeRegExp(re1) !== re1;

var FORCED = isForced('RegExp', DESCRIPTORS && (!CORRECT_NEW || fails(function () {
  re2[MATCH] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
})));

// `RegExp` constructor
// https://tc39.github.io/ecma262/#sec-regexp-constructor
if (FORCED) {
  var RegExpWrapper = function RegExp(pattern, flags) {
    var thisIsRegExp = this instanceof RegExpWrapper;
    var patternIsRegExp = isRegExp(pattern);
    var flagsAreUndefined = flags === undefined;
    return !thisIsRegExp && patternIsRegExp && pattern.constructor === RegExpWrapper && flagsAreUndefined ? pattern
      : inheritIfRequired(CORRECT_NEW
        ? new NativeRegExp(patternIsRegExp && !flagsAreUndefined ? pattern.source : pattern, flags)
        : NativeRegExp((patternIsRegExp = pattern instanceof RegExpWrapper)
          ? pattern.source
          : pattern, patternIsRegExp && flagsAreUndefined ? getFlags.call(pattern) : flags)
      , thisIsRegExp ? this : RegExpPrototype, RegExpWrapper);
  };
  var proxy = function (key) {
    key in RegExpWrapper || defineProperty(RegExpWrapper, key, {
      configurable: true,
      get: function () { return NativeRegExp[key]; },
      set: function (it) { NativeRegExp[key] = it; }
    });
  };
  var keys = getOwnPropertyNames(NativeRegExp);
  var i = 0;
  while (i < keys.length) proxy(keys[i++]);
  RegExpPrototype.constructor = RegExpWrapper;
  RegExpWrapper.prototype = RegExpPrototype;
  redefine(global, 'RegExp', RegExpWrapper);
}

// https://tc39.github.io/ecma262/#sec-get-regexp-@@species
require('../internals/set-species')('RegExp');

},{"../internals/descriptors":48,"../internals/fails":54,"../internals/global":61,"../internals/inherit-if-required":68,"../internals/is-forced":73,"../internals/is-regexp":76,"../internals/object-define-property":84,"../internals/object-get-own-property-names":87,"../internals/redefine":98,"../internals/regexp-flags":101,"../internals/set-species":104,"../internals/well-known-symbol":127}],149:[function(require,module,exports){
'use strict';

var regexpExec = require('../internals/regexp-exec');

require('../internals/export')({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
  exec: regexpExec
});

},{"../internals/export":53,"../internals/regexp-exec":100}],150:[function(require,module,exports){
'use strict';
var anObject = require('../internals/an-object');
var fails = require('../internals/fails');
var flags = require('../internals/regexp-flags');
var DESCRIPTORS = require('../internals/descriptors');
var TO_STRING = 'toString';
var nativeToString = /./[TO_STRING];

var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = nativeToString.name != TO_STRING;

// `RegExp.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  require('../internals/redefine')(RegExp.prototype, TO_STRING, function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? flags.call(R) : undefined);
  }, { unsafe: true });
}

},{"../internals/an-object":23,"../internals/descriptors":48,"../internals/fails":54,"../internals/redefine":98,"../internals/regexp-flags":101}],151:[function(require,module,exports){
'use strict';
var codePointAt = require('../internals/string-at');
var InternalStateModule = require('../internals/internal-state');
var defineIterator = require('../internals/define-iterator');
var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: String(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = codePointAt(string, index, true);
  state.index += point.length;
  return { value: point, done: false };
});

},{"../internals/define-iterator":46,"../internals/internal-state":70,"../internals/string-at":110}],152:[function(require,module,exports){
'use strict';

var anObject = require('../internals/an-object');
var toObject = require('../internals/to-object');
var toLength = require('../internals/to-length');
var toInteger = require('../internals/to-integer');
var requireObjectCoercible = require('../internals/require-object-coercible');
var advanceStringIndex = require('../internals/advance-string-index');
var regExpExec = require('../internals/regexp-exec-abstract');
var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
require('../internals/fix-regexp-well-known-symbol-logic')(
  'replace',
  2,
  function (REPLACE, nativeReplace, maybeCallNative) {
    return [
      // `String.prototype.replace` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.replace
      function replace(searchValue, replaceValue) {
        var O = requireObjectCoercible(this);
        var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
        return replacer !== undefined
          ? replacer.call(searchValue, O, replaceValue)
          : nativeReplace.call(String(O), searchValue, replaceValue);
      },
      // `RegExp.prototype[@@replace]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
      function (regexp, replaceValue) {
        var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
        if (res.done) return res.value;

        var rx = anObject(regexp);
        var S = String(this);

        var functionalReplace = typeof replaceValue === 'function';
        if (!functionalReplace) replaceValue = String(replaceValue);

        var global = rx.global;
        if (global) {
          var fullUnicode = rx.unicode;
          rx.lastIndex = 0;
        }
        var results = [];
        while (true) {
          var result = regExpExec(rx, S);
          if (result === null) break;

          results.push(result);
          if (!global) break;

          var matchStr = String(result[0]);
          if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        }

        var accumulatedResult = '';
        var nextSourcePosition = 0;
        for (var i = 0; i < results.length; i++) {
          result = results[i];

          var matched = String(result[0]);
          var position = max(min(toInteger(result.index), S.length), 0);
          var captures = [];
          // NOTE: This is equivalent to
          //   captures = result.slice(1).map(maybeToString)
          // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
          // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
          // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
          for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
          var namedCaptures = result.groups;
          if (functionalReplace) {
            var replacerArgs = [matched].concat(captures, position, S);
            if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
            var replacement = String(replaceValue.apply(undefined, replacerArgs));
          } else {
            replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
          }
          if (position >= nextSourcePosition) {
            accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
            nextSourcePosition = position + matched.length;
          }
        }
        return accumulatedResult + S.slice(nextSourcePosition);
      }
    ];

    // https://tc39.github.io/ecma262/#sec-getsubstitution
    function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
      var tailPos = position + matched.length;
      var m = captures.length;
      var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
      if (namedCaptures !== undefined) {
        namedCaptures = toObject(namedCaptures);
        symbols = SUBSTITUTION_SYMBOLS;
      }
      return nativeReplace.call(replacement, symbols, function (match, ch) {
        var capture;
        switch (ch.charAt(0)) {
          case '$': return '$';
          case '&': return matched;
          case '`': return str.slice(0, position);
          case "'": return str.slice(tailPos);
          case '<':
            capture = namedCaptures[ch.slice(1, -1)];
            break;
          default: // \d\d?
            var n = +ch;
            if (n === 0) return match;
            if (n > m) {
              var f = floor(n / 10);
              if (f === 0) return match;
              if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
              return match;
            }
            capture = captures[n - 1];
        }
        return capture === undefined ? '' : capture;
      });
    }
  }
);

},{"../internals/advance-string-index":21,"../internals/an-object":23,"../internals/fix-regexp-well-known-symbol-logic":55,"../internals/regexp-exec-abstract":99,"../internals/require-object-coercible":102,"../internals/to-integer":116,"../internals/to-length":117,"../internals/to-object":118}],153:[function(require,module,exports){
// `Symbol.prototype.description` getter
// https://tc39.github.io/ecma262/#sec-symbol.prototype.description
'use strict';
var DESCRIPTORS = require('../internals/descriptors');
var has = require('../internals/has');
var isObject = require('../internals/is-object');
var defineProperty = require('../internals/object-define-property').f;
var copyConstructorProperties = require('../internals/copy-constructor-properties');
var NativeSymbol = require('../internals/global').Symbol;

if (DESCRIPTORS && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined
)) {
  var EmptyStringDescriptionStore = {};
  // wrap Symbol constructor for correct work with undefined description
  var SymbolWrapper = function Symbol() {
    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
    var result = this instanceof SymbolWrapper
      ? new NativeSymbol(description)
      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') EmptyStringDescriptionStore[result] = true;
    return result;
  };
  copyConstructorProperties(SymbolWrapper, NativeSymbol);
  var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
  symbolPrototype.constructor = SymbolWrapper;

  var symbolToString = symbolPrototype.toString;
  var native = String(NativeSymbol('test')) == 'Symbol(test)';
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  defineProperty(symbolPrototype, 'description', {
    configurable: true,
    get: function description() {
      var symbol = isObject(this) ? this.valueOf() : this;
      var string = symbolToString.call(symbol);
      if (has(EmptyStringDescriptionStore, symbol)) return '';
      var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
      return desc === '' ? undefined : desc;
    }
  });

  require('../internals/export')({ global: true, forced: true }, { Symbol: SymbolWrapper });
}

},{"../internals/copy-constructor-properties":41,"../internals/descriptors":48,"../internals/export":53,"../internals/global":61,"../internals/has":62,"../internals/is-object":74,"../internals/object-define-property":84}],154:[function(require,module,exports){
// `Symbol.iterator` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.iterator
require('../internals/define-well-known-symbol')('iterator');

},{"../internals/define-well-known-symbol":47}],155:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global = require('../internals/global');
var has = require('../internals/has');
var DESCRIPTORS = require('../internals/descriptors');
var IS_PURE = require('../internals/is-pure');
var $export = require('../internals/export');
var redefine = require('../internals/redefine');
var hiddenKeys = require('../internals/hidden-keys');
var fails = require('../internals/fails');
var shared = require('../internals/shared');
var setToStringTag = require('../internals/set-to-string-tag');
var uid = require('../internals/uid');
var wellKnownSymbol = require('../internals/well-known-symbol');
var wrappedWellKnownSymbolModule = require('../internals/wrapped-well-known-symbol');
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');
var enumKeys = require('../internals/enum-keys');
var isArray = require('../internals/is-array');
var anObject = require('../internals/an-object');
var isObject = require('../internals/is-object');
var toIndexedObject = require('../internals/to-indexed-object');
var toPrimitive = require('../internals/to-primitive');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var nativeObjectCreate = require('../internals/object-create');
var getOwnPropertyNamesExternal = require('../internals/object-get-own-property-names-external');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var definePropertyModule = require('../internals/object-define-property');
var propertyIsEnumerableModule = require('../internals/object-property-is-enumerable');
var hide = require('../internals/hide');
var objectKeys = require('../internals/object-keys');
var HIDDEN = require('../internals/shared-key')('hidden');
var InternalStateModule = require('../internals/internal-state');
var SYMBOL = 'Symbol';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(SYMBOL);
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
var $Symbol = global.Symbol;
var JSON = global.JSON;
var nativeJSONStringify = JSON && JSON.stringify;
var PROTOTYPE = 'prototype';
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var WellKnownSymbolsStore = shared('wks');
var ObjectPrototype = Object[PROTOTYPE];
var QObject = global.QObject;
var NATIVE_SYMBOL = require('../internals/native-symbol');
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = DESCRIPTORS && fails(function () {
  return nativeObjectCreate(nativeDefineProperty({}, 'a', {
    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, key);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype[key];
  nativeDefineProperty(it, key, D);
  if (ObjectPrototypeDescriptor && it !== ObjectPrototype) {
    nativeDefineProperty(ObjectPrototype, key, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty;

var wrap = function (tag, description) {
  var symbol = AllSymbols[tag] = nativeObjectCreate($Symbol[PROTOTYPE]);
  setInternalState(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!DESCRIPTORS) symbol.description = description;
  return symbol;
};

var isSymbol = NATIVE_SYMBOL && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return Object(it) instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) nativeDefineProperty(it, HIDDEN, createPropertyDescriptor(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = nativeObjectCreate(D, { enumerable: createPropertyDescriptor(0, false) });
    } return setSymbolDescriptor(it, key, D);
  } return nativeDefineProperty(it, key, D);
};

var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIndexedObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};

var $create = function create(it, P) {
  return P === undefined ? nativeObjectCreate(it) : $defineProperties(nativeObjectCreate(it), P);
};

var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = nativePropertyIsEnumerable.call(this, key = toPrimitive(key, true));
  if (this === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIndexedObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
  var D = nativeGetOwnPropertyDescriptor(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};

var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = nativeGetOwnPropertyNames(toIndexedObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && !has(hiddenKeys, key)) result.push(key);
  } return result;
};

var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectPrototype;
  var names = nativeGetOwnPropertyNames(IS_OP ? ObjectPrototypeSymbols : toIndexedObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectPrototype, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// `Symbol` constructor
// https://tc39.github.io/ecma262/#sec-symbol-constructor
if (!NATIVE_SYMBOL) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
    var description = arguments[0] === undefined ? undefined : String(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (DESCRIPTORS && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
    return wrap(tag, description);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return getInternalState(this).tag;
  });

  propertyIsEnumerableModule.f = $propertyIsEnumerable;
  definePropertyModule.f = $defineProperty;
  getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
  require('../internals/object-get-own-property-names').f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  require('../internals/object-get-own-property-symbols').f = $getOwnPropertySymbols;

  if (DESCRIPTORS) {
    // https://github.com/tc39/proposal-Symbol-description
    nativeDefineProperty($Symbol[PROTOTYPE], 'description', {
      configurable: true,
      get: function description() {
        return getInternalState(this).description;
      }
    });
    if (!IS_PURE) {
      redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
    }
  }

  wrappedWellKnownSymbolModule.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };
}

$export({ global: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, { Symbol: $Symbol });

for (var wellKnownSymbols = objectKeys(WellKnownSymbolsStore), k = 0; wellKnownSymbols.length > k;) {
  defineWellKnownSymbol(wellKnownSymbols[k++]);
}

$export({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
  // `Symbol.for` method
  // https://tc39.github.io/ecma262/#sec-symbol.for
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // `Symbol.keyFor` method
  // https://tc39.github.io/ecma262/#sec-symbol.keyfor
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

$export({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS }, {
  // `Object.create` method
  // https://tc39.github.io/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty,
  // `Object.defineProperties` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});

$export({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames,
  // `Object.getOwnPropertySymbols` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// `JSON.stringify` method behavior with symbols
// https://tc39.github.io/ecma262/#sec-json.stringify
JSON && $export({ target: 'JSON', stat: true, forced: !NATIVE_SYMBOL || fails(function () {
  var symbol = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  return nativeJSONStringify([symbol]) != '[null]'
    // WebKit converts symbol values to JSON as null
    || nativeJSONStringify({ a: symbol }) != '{}'
    // V8 throws on boxed symbols
    || nativeJSONStringify(Object(symbol)) != '{}';
}) }, {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return nativeJSONStringify.apply(JSON, args);
  }
});

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
if (!$Symbol[PROTOTYPE][TO_PRIMITIVE]) hide($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// `Symbol.prototype[@@toStringTag]` property
// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys[HIDDEN] = true;

},{"../internals/an-object":23,"../internals/create-property-descriptor":44,"../internals/define-well-known-symbol":47,"../internals/descriptors":48,"../internals/enum-keys":52,"../internals/export":53,"../internals/fails":54,"../internals/global":61,"../internals/has":62,"../internals/hidden-keys":63,"../internals/hide":64,"../internals/internal-state":70,"../internals/is-array":72,"../internals/is-object":74,"../internals/is-pure":75,"../internals/native-symbol":80,"../internals/object-create":82,"../internals/object-define-property":84,"../internals/object-get-own-property-descriptor":85,"../internals/object-get-own-property-names":87,"../internals/object-get-own-property-names-external":86,"../internals/object-get-own-property-symbols":88,"../internals/object-keys":91,"../internals/object-property-is-enumerable":92,"../internals/redefine":98,"../internals/set-to-string-tag":105,"../internals/shared":107,"../internals/shared-key":106,"../internals/to-indexed-object":115,"../internals/to-primitive":120,"../internals/uid":124,"../internals/well-known-symbol":127,"../internals/wrapped-well-known-symbol":128}],156:[function(require,module,exports){
'use strict';
var arrayCopyWithin = require('../internals/array-copy-within');
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var aTypedArray = ArrayBufferViewCore.aTypedArray;

// `%TypedArray%.prototype.copyWithin` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.copywithin
ArrayBufferViewCore.exportProto('copyWithin', function copyWithin(target, start /* , end */) {
  return arrayCopyWithin.call(aTypedArray(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
});

},{"../internals/array-buffer-view-core":24,"../internals/array-copy-within":26}],157:[function(require,module,exports){
'use strict';
var arrayEvery = require('../internals/array-methods')(4);
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var aTypedArray = ArrayBufferViewCore.aTypedArray;

// `%TypedArray%.prototype.every` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.every
ArrayBufferViewCore.exportProto('every', function every(callbackfn /* , thisArg */) {
  return arrayEvery(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":24,"../internals/array-methods":32}],158:[function(require,module,exports){
'use strict';
var arrayFill = require('../internals/array-fill');
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var aTypedArray = ArrayBufferViewCore.aTypedArray;

// `%TypedArray%.prototype.fill` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.fill
// eslint-disable-next-line no-unused-vars
ArrayBufferViewCore.exportProto('fill', function fill(value /* , start, end */) {
  return arrayFill.apply(aTypedArray(this), arguments);
});

},{"../internals/array-buffer-view-core":24,"../internals/array-fill":27}],159:[function(require,module,exports){
'use strict';
var speciesConstructor = require('../internals/species-constructor');
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var arrayFilter = require('../internals/array-methods')(2);
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor;

// `%TypedArray%.prototype.filter` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.filter
ArrayBufferViewCore.exportProto('filter', function filter(callbackfn /* , thisArg */) {
  var list = arrayFilter(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  var C = speciesConstructor(this, this.constructor);
  var index = 0;
  var length = list.length;
  var result = new (aTypedArrayConstructor(C))(length);
  while (length > index) result[index] = list[index++];
  return result;
});

},{"../internals/array-buffer-view-core":24,"../internals/array-methods":32,"../internals/species-constructor":109}],160:[function(require,module,exports){
'use strict';
var arrayFindIndex = require('../internals/array-methods')(6);
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var aTypedArray = ArrayBufferViewCore.aTypedArray;

// `%TypedArray%.prototype.findIndex` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.findindex
ArrayBufferViewCore.exportProto('findIndex', function findIndex(predicate /* , thisArg */) {
  return arrayFindIndex(aTypedArray(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":24,"../internals/array-methods":32}],161:[function(require,module,exports){
'use strict';
var arrayFind = require('../internals/array-methods')(5);
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var aTypedArray = ArrayBufferViewCore.aTypedArray;

// `%TypedArray%.prototype.find` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.find
ArrayBufferViewCore.exportProto('find', function find(predicate /* , thisArg */) {
  return arrayFind(aTypedArray(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":24,"../internals/array-methods":32}],162:[function(require,module,exports){
// `Float32Array` constructor
// https://tc39.github.io/ecma262/#sec-typedarray-objects
require('../internals/typed-array-constructor')('Float32', 4, function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"../internals/typed-array-constructor":121}],163:[function(require,module,exports){
'use strict';
var arrayForEach = require('../internals/array-methods')(0);
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var aTypedArray = ArrayBufferViewCore.aTypedArray;

// `%TypedArray%.prototype.forEach` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.foreach
ArrayBufferViewCore.exportProto('forEach', function forEach(callbackfn /* , thisArg */) {
  arrayForEach(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":24,"../internals/array-methods":32}],164:[function(require,module,exports){
'use strict';
var arrayIncludes = require('../internals/array-includes')(true);
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var aTypedArray = ArrayBufferViewCore.aTypedArray;

// `%TypedArray%.prototype.includes` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.includes
ArrayBufferViewCore.exportProto('includes', function includes(searchElement /* , fromIndex */) {
  return arrayIncludes(aTypedArray(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":24,"../internals/array-includes":29}],165:[function(require,module,exports){
'use strict';
var arrayIndexOf = require('../internals/array-includes')(false);
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var aTypedArray = ArrayBufferViewCore.aTypedArray;

// `%TypedArray%.prototype.indexOf` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.indexof
ArrayBufferViewCore.exportProto('indexOf', function indexOf(searchElement /* , fromIndex */) {
  return arrayIndexOf(aTypedArray(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":24,"../internals/array-includes":29}],166:[function(require,module,exports){
'use strict';
var ArrayIterators = require('../modules/es.array.iterator');
var Uint8Array = require('../internals/global').Uint8Array;
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var ITERATOR = require('../internals/well-known-symbol')('iterator');
var arrayValues = ArrayIterators.values;
var arrayKeys = ArrayIterators.keys;
var arrayEntries = ArrayIterators.entries;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportProto = ArrayBufferViewCore.exportProto;
var nativeTypedArrayIterator = Uint8Array && Uint8Array.prototype[ITERATOR];

var CORRECT_ITER_NAME = !!nativeTypedArrayIterator
  && (nativeTypedArrayIterator.name == 'values' || nativeTypedArrayIterator.name == undefined);

var typedArrayValues = function values() {
  return arrayValues.call(aTypedArray(this));
};

// `%TypedArray%.prototype.entries` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.entries
exportProto('entries', function entries() {
  return arrayEntries.call(aTypedArray(this));
});
// `%TypedArray%.prototype.keys` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.keys
exportProto('keys', function keys() {
  return arrayKeys.call(aTypedArray(this));
});
// `%TypedArray%.prototype.values` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.values
exportProto('values', typedArrayValues, !CORRECT_ITER_NAME);
// `%TypedArray%.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype-@@iterator
exportProto(ITERATOR, typedArrayValues, !CORRECT_ITER_NAME);

},{"../internals/array-buffer-view-core":24,"../internals/global":61,"../internals/well-known-symbol":127,"../modules/es.array.iterator":133}],167:[function(require,module,exports){
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var arrayJoin = [].join;

// `%TypedArray%.prototype.join` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.join
// eslint-disable-next-line no-unused-vars
ArrayBufferViewCore.exportProto('join', function join(separator) {
  return arrayJoin.apply(aTypedArray(this), arguments);
});

},{"../internals/array-buffer-view-core":24}],168:[function(require,module,exports){
'use strict';
var arrayLastIndexOf = require('../internals/array-last-index-of');
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var aTypedArray = ArrayBufferViewCore.aTypedArray;

// `%TypedArray%.prototype.lastIndexOf` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.lastindexof
// eslint-disable-next-line no-unused-vars
ArrayBufferViewCore.exportProto('lastIndexOf', function lastIndexOf(searchElement /* , fromIndex */) {
  return arrayLastIndexOf.apply(aTypedArray(this), arguments);
});

},{"../internals/array-buffer-view-core":24,"../internals/array-last-index-of":30}],169:[function(require,module,exports){
'use strict';
var speciesConstructor = require('../internals/species-constructor');
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor;

var internalTypedArrayMap = require('../internals/array-methods')(1, function (O, length) {
  return new (aTypedArrayConstructor(speciesConstructor(O, O.constructor)))(length);
});

// `%TypedArray%.prototype.map` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.map
ArrayBufferViewCore.exportProto('map', function map(mapfn /* , thisArg */) {
  return internalTypedArrayMap(aTypedArray(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":24,"../internals/array-methods":32,"../internals/species-constructor":109}],170:[function(require,module,exports){
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var arrayReduceRight = [].reduceRight;

// `%TypedArray%.prototype.reduceRicht` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduceright
// eslint-disable-next-line no-unused-vars
ArrayBufferViewCore.exportProto('reduceRight', function reduceRight(callbackfn /* , initialValue */) {
  return arrayReduceRight.apply(aTypedArray(this), arguments);
});

},{"../internals/array-buffer-view-core":24}],171:[function(require,module,exports){
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var arrayReduce = [].reduce;

// `%TypedArray%.prototype.reduce` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduce
// eslint-disable-next-line no-unused-vars
ArrayBufferViewCore.exportProto('reduce', function reduce(callbackfn /* , initialValue */) {
  return arrayReduce.apply(aTypedArray(this), arguments);
});

},{"../internals/array-buffer-view-core":24}],172:[function(require,module,exports){
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var aTypedArray = ArrayBufferViewCore.aTypedArray;

// `%TypedArray%.prototype.reverse` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reverse
ArrayBufferViewCore.exportProto('reverse', function reverse() {
  var that = this;
  var length = aTypedArray(that).length;
  var middle = Math.floor(length / 2);
  var index = 0;
  var value;
  while (index < middle) {
    value = that[index];
    that[index++] = that[--length];
    that[length] = value;
  } return that;
});

},{"../internals/array-buffer-view-core":24}],173:[function(require,module,exports){
'use strict';
var toLength = require('../internals/to-length');
var toOffset = require('../internals/to-offset');
var toObject = require('../internals/to-object');
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var aTypedArray = ArrayBufferViewCore.aTypedArray;

var FORCED = require('../internals/fails')(function () {
  // eslint-disable-next-line no-undef
  new Int8Array(1).set({});
});

// `%TypedArray%.prototype.set` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.set
ArrayBufferViewCore.exportProto('set', function set(arrayLike /* , offset */) {
  aTypedArray(this);
  var offset = toOffset(arguments[1], 1);
  var length = this.length;
  var src = toObject(arrayLike);
  var len = toLength(src.length);
  var index = 0;
  if (len + offset > length) throw RangeError('Wrong length');
  while (index < len) this[offset + index] = src[index++];
}, FORCED);

},{"../internals/array-buffer-view-core":24,"../internals/fails":54,"../internals/to-length":117,"../internals/to-object":118,"../internals/to-offset":119}],174:[function(require,module,exports){
'use strict';
var speciesConstructor = require('../internals/species-constructor');
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor;
var arraySlice = [].slice;

var FORCED = require('../internals/fails')(function () {
  // eslint-disable-next-line no-undef
  new Int8Array(1).slice();
});

// `%TypedArray%.prototype.slice` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.slice
ArrayBufferViewCore.exportProto('slice', function slice(start, end) {
  var list = arraySlice.call(aTypedArray(this), start, end);
  var C = speciesConstructor(this, this.constructor);
  var index = 0;
  var length = list.length;
  var result = new (aTypedArrayConstructor(C))(length);
  while (length > index) result[index] = list[index++];
  return result;
}, FORCED);

},{"../internals/array-buffer-view-core":24,"../internals/fails":54,"../internals/species-constructor":109}],175:[function(require,module,exports){
'use strict';
var arraySome = require('../internals/array-methods')(3);
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var aTypedArray = ArrayBufferViewCore.aTypedArray;

// `%TypedArray%.prototype.some` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.some
ArrayBufferViewCore.exportProto('some', function some(callbackfn /* , thisArg */) {
  return arraySome(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":24,"../internals/array-methods":32}],176:[function(require,module,exports){
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var arraySort = [].sort;

// `%TypedArray%.prototype.sort` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.sort
ArrayBufferViewCore.exportProto('sort', function sort(comparefn) {
  return arraySort.call(aTypedArray(this), comparefn);
});

},{"../internals/array-buffer-view-core":24}],177:[function(require,module,exports){
'use strict';
var toLength = require('../internals/to-length');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var speciesConstructor = require('../internals/species-constructor');
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var aTypedArray = ArrayBufferViewCore.aTypedArray;

// `%TypedArray%.prototype.subarray` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.subarray
ArrayBufferViewCore.exportProto('subarray', function subarray(begin, end) {
  var O = aTypedArray(this);
  var length = O.length;
  var beginIndex = toAbsoluteIndex(begin, length);
  return new (speciesConstructor(O, O.constructor))(
    O.buffer,
    O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT,
    toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - beginIndex)
  );
});

},{"../internals/array-buffer-view-core":24,"../internals/species-constructor":109,"../internals/to-absolute-index":113,"../internals/to-length":117}],178:[function(require,module,exports){
'use strict';
var Int8Array = require('../internals/global').Int8Array;
var fails = require('../internals/fails');
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var arrayToLocaleString = [].toLocaleString;
var arraySlice = [].slice;

// iOS Safari 6.x fails here
var TO_LOCALE_BUG = !!Int8Array && fails(function () {
  arrayToLocaleString.call(new Int8Array(1));
});
var FORCED = fails(function () {
  return [1, 2].toLocaleString() != new Int8Array([1, 2]).toLocaleString();
}) || !fails(function () {
  Int8Array.prototype.toLocaleString.call([1, 2]);
});

// `%TypedArray%.prototype.toLocaleString` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tolocalestring
ArrayBufferViewCore.exportProto('toLocaleString', function toLocaleString() {
  return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(aTypedArray(this)) : aTypedArray(this), arguments);
}, FORCED);

},{"../internals/array-buffer-view-core":24,"../internals/fails":54,"../internals/global":61}],179:[function(require,module,exports){
'use strict';
var Uint8Array = require('../internals/global').Uint8Array;
var Uint8ArrayPrototype = Uint8Array && Uint8Array.prototype;
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var arrayToString = [].toString;
var arrayJoin = [].join;

if (require('../internals/fails')(function () { arrayToString.call({}); })) {
  arrayToString = function toString() {
    return arrayJoin.call(this);
  };
}

// `%TypedArray%.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tostring
ArrayBufferViewCore.exportProto('toString', arrayToString, (Uint8ArrayPrototype || {}).toString != arrayToString);

},{"../internals/array-buffer-view-core":24,"../internals/fails":54,"../internals/global":61}],180:[function(require,module,exports){
var DOMIterables = require('../internals/dom-iterables');
var forEach = require('../internals/array-for-each');
var hide = require('../internals/hide');
var global = require('../internals/global');

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
    hide(CollectionPrototype, 'forEach', forEach);
  } catch (error) {
    CollectionPrototype.forEach = forEach;
  }
}

},{"../internals/array-for-each":28,"../internals/dom-iterables":50,"../internals/global":61,"../internals/hide":64}],181:[function(require,module,exports){
var DOMIterables = require('../internals/dom-iterables');
var ArrayIteratorMethods = require('../modules/es.array.iterator');
var global = require('../internals/global');
var hide = require('../internals/hide');
var wellKnownSymbol = require('../internals/well-known-symbol');
var ITERATOR = wellKnownSymbol('iterator');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ArrayValues = ArrayIteratorMethods.values;

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
      hide(CollectionPrototype, ITERATOR, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG]) hide(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
        hide(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
      }
    }
  }
}

},{"../internals/dom-iterables":50,"../internals/global":61,"../internals/hide":64,"../internals/well-known-symbol":127,"../modules/es.array.iterator":133}],182:[function(require,module,exports){
// ie9- setTimeout & setInterval additional parameters fix
var global = require('../internals/global');
var userAgent = require('../internals/user-agent');
var slice = [].slice;

var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check

var wrap = function (set) {
  return function (fn, time /* , ...args */) {
    var boundArgs = arguments.length > 2;
    var args = boundArgs ? slice.call(arguments, 2) : false;
    return set(boundArgs ? function () {
      // eslint-disable-next-line no-new-func
      (typeof fn == 'function' ? fn : Function(fn)).apply(this, args);
    } : fn, time);
  };
};

require('../internals/export')({ global: true, bind: true, forced: MSIE }, {
  setTimeout: wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});

},{"../internals/export":53,"../internals/global":61,"../internals/user-agent":125}],"openbse":[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-own-property-descriptor");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getVersion = getVersion;
Object.defineProperty(exports, "GeneralEngine", {
  enumerable: true,
  get: function get() {
    return _generalEngine["default"];
  }
});
Object.defineProperty(exports, "BrowserNotSupportError", {
  enumerable: true,
  get: function get() {
    return _browserNotSupportError["default"];
  }
});
Object.defineProperty(exports, "GeneralType", {
  enumerable: true,
  get: function get() {
    return _generalType["default"];
  }
});
Object.defineProperty(exports, "Contextmenu", {
  enumerable: true,
  get: function get() {
    return _contextmenu["default"];
  }
});

var _helper = _interopRequireDefault(require("./lib/helper"));

var _generalEngine = _interopRequireDefault(require("./engines/generalEngine"));

var _browserNotSupportError = _interopRequireDefault(require("./errors/browserNotSupportError"));

var _generalType = _interopRequireDefault(require("./engines/generalType"));

var _contextmenu = _interopRequireDefault(require("./contextmenu"));

var build = _interopRequireWildcard(require("./build.json"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * 获取版本信息。
 * @alias openBSE.getVersion
 * @returns {openBSE~VersionInfo} 版本信息：一个 {@link openBSE~VersionInfo} 结构。
 */
function getVersion() {
  return _helper["default"].clone(build);
}
/**
 * 普通弹幕全局选项
 * @typedef {object} openBSE~generalOptions
 * @description Option 结构用于存放全局选项。
 * @property {number} [verticalInterval=8] - 弹幕垂直行间距
 * @property {number} [verticalInterval=1] - 弹幕播放速度（倍数）
 * @property {openBSE~clockCallback} [clock=time => new Date().getTime() - startTime] - 时间基准：此时间基准可指向一个方法用于获取播放器当前进度，这个方法返回值即为播放进度（单位：毫秒）。
 * @property {number} [scaling=1] 弹幕缩放比例（倍数）
 * @property {openBSE~BulletScreenStyle} [defaultStyle] 默认弹幕样式：一个 {@link openBSE~BulletScreenStyle} 结构。
 * @property {openBSE.GeneralType} [hiddenTypes=0] 隐藏的弹幕类型：一个 {@link openBSE.GeneralType} 枚举。将要隐藏的弹幕类型相加，0为不隐藏任何类型的弹幕。
 * @property {number} [opacity=1.0] 弹幕不透明度：取值范围 0.0 到 1.0，0.0 全透明；1.0 不透明。
 * @property {string} [cursorOnMouseOver='pointer'] 鼠标经过样式：当鼠标经过弹幕时的样式，可设置的值可参考 MDN [cursor] {@link https://developer.mozilla.org/zh-CN/docs/Web/CSS/cursor} 。
 */

/**
 * 时间基准回调方法
 * @callback openBSE~clockCallback
 * @description ClockCallback 回调方法用于播放器当前进度。
 * @returns {number} 播放进度：单位：毫秒。
 */

/**
 * 单条弹幕数据
 * @typedef {object} openBSE~GeneralBulletScreen
 * @description BulletScreen 结构用于存放单条弹幕数据。
 * @property {string} text 弹幕文本
 * @property {boolean} [canDiscard=true] 是否允许丢弃：（此参数在事件中修改无效）在弹幕过多时，程序将自动丢弃一些延迟过高的弹幕。此选项为 false 时本条弹幕无论如何都不会被丢弃，使用本选项的场景如本用户发送的弹幕。（注意：不要将太多的弹幕的 canDiscard 设为 false， 否则会因超时的弹幕不会被丢弃而造成意外的问题。）
 * @property {number} [startTime=options.clock()] 弹幕进入时间：（此参数在事件中修改无效）单位：毫秒，默认为[时间基准（options.clock）]{@link openBSE~Options}当前时间。
 * @property {openBSE.GeneralType} [type=openBSE.GeneralType.rightToLeft] 弹幕类型：（此参数在事件中修改无效）一个类型为 {@link openBSE.BulletScreenType} 的枚举。
 * @property {openBSE~BulletScreenStyle} style 弹幕样式：一个 {@link openBSE~BulletScreenStyle} 结构。设置此选项中的任何一个值，将覆盖对应的全局设置。
 * @property {number} [layer=0] 弹幕层级：此参数越大，弹幕越靠前。一条弹幕在比它层级小的弹幕前面，在比它层级大的弹幕后面。如果层级相同按照进入时间确定层级顺序。
 * @property {any} more... 其他自定义字段：（在事件中修改修改此参数无需将 e.redraw 设置为 true）例如 uuid 、 id 等。（注意：因为在事件响应方法中返回的弹幕对象是原对象克隆的，所以无法直接比较，必须使用自定义字段唯一标识一条弹幕。）
 */

/**
 * 弹幕样式
 * @typedef {object} openBSE~GeneralBulletScreenStyle
 * @description BulletScreenStyle 结构用于存放弹幕样式信息。
 * @property {number} [shadowBlur=2] 弹幕阴影的模糊级别：0为不显示阴影。
 * @property {string} [fontWeight="600"] 字体粗细：可选值：lighter：更细；normal：标准；bold：粗体；bolder: 更粗；100、200、300、400、500、600、700、800、900：定义由粗到细的字符（400 等同于 normal；700 等同于 bold）。
 * @property {string} [fontFamily="sans-serif"] 字体系列：弹幕的字体族名称或/及类族名称的一个优先表。（注意：如果使用了用“@font-face”定义的字体，请确保在使用前完全加载完成，否则弹幕可能无法显示。如果要预加载这些字体，建议使用 [Web Font Loader]{@link https://github.com/typekit/webfontloader} 。）
 * @property {number} [size=19] 字体大小：单位：像素。
 * @property {string} [boxColor] 外框颜色：参照CSS颜色设置方法，为 null 不显示外框。
 * @property {string} [color="white"] 弹幕颜色：参照CSS颜色设置方法，为 null 不显示此弹幕。
 * @property {string} [borderColor] 描边颜色：参照CSS颜色设置方法，为 null 没有描边。
 * @property {number} [speed=0.15] 弹幕速度：（在事件中修改修改此参数无需将 e.redraw 设置为 true）单位：像素/毫秒，仅弹幕类型为0、1时有效。
 * @property {number} [residenceTime=5000] 弹幕停留时间：（此参数在事件中修改无效）单位：毫秒，仅弹幕类型2、3时有效。
 */

/**
 * 弹幕事件
 * @typedef {object} openBSE~GeneralBulletScreenEvent
 * @property {function} getBulletScreen() - 获取引发事件的弹幕弹幕的数据：retun: {@link openBSE~BulletScreen} 引发事件的弹幕的数据：一个 {@link openBSE~BulletScreen} 结构。（注意：不要试图与[添加弹幕]{@link openBSE.BulletScreenEngine#addBulletScreen}时创建的对象进行比较，这个对象是克隆得到的，并不相等。正确的方法是在添加弹幕时一并插入 id 等自定义字段来唯一标识一条弹幕。）
 * @property {function} setBulletScreen(bulletScreen,redraw) - 设置引发事件的弹幕弹幕的数据：params: {@link openBSE~BulletScreen} bulletScreen - 引发事件的弹幕的数据：一个 {@link openBSE~BulletScreen} 结构。设置此参数以便动态调整弹幕样式，但是一些参数在事件中修改无效，查看此结构的说明以了解详情。 boolean [redraw=false] - 是否重绘弹幕：此参数在每次引发事件时的初始值为 false ，如果修改了 bulletScreen 中的值，此参数必须设为 true 。
 * @property {function} getPlayState() - 获取引发事件的弹幕的播放状态：retun: boolean 取引发事件的弹幕是否在播放/移动：如果设置为 true 则该弹幕暂停，直到将此参数设为 false 或调用 {@link openBSE.BulletScreenEngine#playAllBulletScreens} 方法。
 * @property {function} setPlayState(play) - 设置引发事件的弹幕的播放状态：params: boolean paly - 是否继续播放/移动引发事件的弹幕：读取此参数可判断这条弹幕是否处于暂停状态。
 * @property {string} type - 事件类型（事件名称）
 * @property {number} screenX - 当事件发生时，鼠标相对于显示器屏的 X 坐标。
 * @property {number} screenY - 当事件发生时，鼠标相对于显示器屏的 Y 坐标。
 * @property {number} clientX - 当事件发生时，鼠标相对于浏览器有效区域的 X 坐标。
 * @property {number} pageX - 当事件发生时，鼠标相对于页面的 X 坐标。
 * @property {number} pageY - 当事件发生时，鼠标相对于页面的 Y 坐标。
 * @property {number} pageY - 当事件发生时，鼠标相对于页面的 Y 坐标。
 */

/**
 * 调试信息
 * @typedef {object} openBSE~DebugInfo
 * @description DebugInfo 结构用于存放调试信息。
 * @property {number} time - [时间基准（options.clock）]{@link openBSE~Options}当前时间。
 * @property {number} realTimeBulletScreenCount - 实时弹幕总数
 * @property {number} bufferBulletScreenCount - 缓冲区弹幕总数
 * @property {number} delay - 延迟：单位：毫秒。
 * @property {number} delayBulletScreenCount - 丢弃弹幕数：因延迟过高而丢弃的弹幕总数。
 * @property {number} fps - 帧频：单位：帧/秒。
 */

/**
 * 版本信息
 * @typedef {object} openBSE~VersionInfo
 * @description VersionInfo 结构用于存放版本信息。
 * @property {string} version 版本号
 * @property {string} buildDate 构建日期：时区：UTC。
 * @property {string} name 名称
 * @property {string} description 描述
 * @property {string} home 主页
 */


},{"./build.json":2,"./contextmenu":3,"./engines/generalEngine":4,"./engines/generalType":5,"./errors/browserNotSupportError":6,"./lib/helper":8,"core-js/modules/es.object.define-property":142,"core-js/modules/es.object.get-own-property-descriptor":143}]},{},[1])


//# sourceMappingURL=openBSE.all.js.map
