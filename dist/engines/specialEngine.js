"use strict";

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.date.to-string");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.timers");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _linkedList = _interopRequireDefault(require("../lib/linkedList"));

var _renderersFactory = _interopRequireDefault(require("../renderers/renderersFactory"));

var _helper = _interopRequireDefault(require("../lib/helper"));

var _resources = _interopRequireDefault(require("../lib/resources"));

var build = _interopRequireWildcard(require("../build.json"));

var _interpreter = _interopRequireDefault(require("../lib/JS-Interpreter/interpreter"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SpecialEngine = function SpecialEngine(element, options) {
  var renderMode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'canvas';

  _classCallCheck(this, SpecialEngine);

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
   * @private @type {openBSE~specialOptions}
   */


  var _options;
  /**
   * 默认全局变量
   * @private @readonly
   */


  var _defaultOptions = {
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

    /** 弹幕不透明度 */
    opacity: 1
    /**
     * 全局选项类型
     * @private @readonly
     */

  };
  var _optionsType = {
    playSpeed: 'number',
    clock: 'function',
    scaling: 'number',
    timeOutDiscard: 'boolean',
    opacity: 'number'
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

    /** 弹幕退出时间 */
    endTime: null,

    /** 弹幕渲染代码 */
    renderCode: null
    /** 
     * 默认弹幕样式 
     * @private @readonly
     * */

  };
  var _defaultStyle = {
    /** 弹幕文本 */
    text: null,

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

    /** 变换 */
    transform: null
    /**
     * 弹幕数据类型
     * @private @readonly
     */

  };
  var _bulletScreenType = {
    text: 'string',
    canDiscard: 'boolean',
    startTime: 'number',
    endTime: 'number',
    renderCode: 'string'
    /** 
     * 默认弹幕样式数据类型 
     * @private @readonly
     * */

  };
  var _defaultStyleType = {
    /** 弹幕文本 */
    text: 'string',

    /** 阴影的模糊级别，0为不显示阴影 */
    shadowBlur: 'number',

    /** 字体粗细 */
    fontWeight: ['string', 'number'],

    /** 字体系列 */
    fontFamily: 'string',

    /** 字体大小（单位：像素） */
    size: 'number',

    /** 外框颜色 */
    boxColor: ['string', 'null'],

    /** 字体颜色 */
    color: 'string',

    /** 描边颜色 */
    borderColor: ['string', 'null'],

    /** 变换 */
    transform: ['string', 'null']
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
  var _elementSize = {
    width: element.clientWidth / _options.scaling,
    height: element.clientHeight / _options.scaling
  };

  var _oldDevicePixelRatio = _helper["default"].getDevicePixelRatio();

  var _oldScaling = _options.scaling;
  var _oldClientWidth = element.clientWidth;
  var _oldClientHeight = element.clientHeight;
  var _oldOpacity = _options.opacity;
  var renderersFactory = new _renderersFactory["default"](element, _options, _elementSize);

  var _renderer = renderersFactory.getSpecialRenderer(renderMode);

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

      if (_oldOpacity != _options.opacity) {
        _oldOpacity = _options.opacity;

        _renderer.setOpacity();
      }
    }
  });
  /**
   * 添加弹幕到弹幕列表。
   * @description 添加弹幕到弹幕列表。由于弹幕在屏幕上出现过后，弹幕引擎将从列表中彻底删除此弹幕。所以，在改变播放进度时，可能需要先[清空弹幕列表]{@link openBSE.BulletScreenEngine#cleanBulletScreenList}，然后重新加载此播放进度以后的弹幕。
   * @param {openBSE~SpecialBulletScreen} bulletScreen - 单条弹幕数据：一个 {@link openBSE~SpecialBulletScreen} 结构。
   * @throws {TypeError} 传入的参数错误时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
   */

  this.add = function (bulletScreen) {
    _defaultBulletScreen.startTime = _options.clock();
    bulletScreen = _helper["default"].setValues(bulletScreen, _defaultBulletScreen, _bulletScreenType);
    var newNode = new _linkedList["default"].node(bulletScreen);

    _bulletScreenBuffer.forEach(function (node) {
      var lastBulletScreen = node.element;
      if (bulletScreen.startTime > lastBulletScreen.startTime) return {
        add: {
          addToUp: true,
          node: newNode
        },
        stop: true
      };
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
   * 刷新弹幕函数
   * @private
   */

  function refresh() {
    var nowTime = new Date().getTime();
    if (_lastRefreshTime != null) _refreshRate = 1 / (nowTime - _lastRefreshTime);
    _lastRefreshTime = nowTime;
    addRealTimeBulletScreens();
    moveRealTimeBulletScreen();

    _renderer.draw();

    if (_playing) requestAnimationFrame(refresh);
  }
  /**
   * 移动弹幕函数
   * @private
   */


  function moveRealTimeBulletScreen() {
    _realTimeBulletScreens.forEach(function (node) {
      var realTimeBulletScreen = node.element;

      var nowTime = _options.clock();

      if (realTimeBulletScreen.bulletScreen.endTime > nowTime) {
        try {
          var interpreter = new _interpreter["default"](realTimeBulletScreen.bulletScreen.renderCode, function (interpreter, scope) {
            return InterpreterInit(interpreter, scope, realTimeBulletScreen);
          });
          interpreter.run();
        } catch (ex) {
          console.error(ex);

          _renderer["delete"](realTimeBulletScreen);

          return {
            remove: true
          };
        }
      } else {
        _renderer["delete"](realTimeBulletScreen);

        return {
          remove: true
        };
      }
    }, true);
  }
  /**
   * 添加弹幕到实时弹幕列表
   * @private
   */


  function addRealTimeBulletScreens() {
    if (_realTimeBulletScreens.length === 0) _delay = 0;
    var times = Math.floor(_refreshRate * 2000);

    do {
      var node = _bulletScreenBuffer.pop(false, false);

      if (node === null) return;
      var bulletScreen = node.element;

      var nowTime = _options.clock();

      if (bulletScreen.startTime > nowTime) return;

      if (!_options.timeOutDiscard || !bulletScreen.canDiscard || bulletScreen.startTime > nowTime - Math.floor(1 / _refreshRate) * 60) {
        getRealTimeBulletScreen(bulletScreen);
      } else _delayBulletScreenCount++;

      node.remove();
      times--;
    } while (_realTimeBulletScreens.length === 0 || times > 0);
  }
  /**
   * 生成实时弹幕对象
   * @private
   * @param {openBSE~BulletScreen} bulletScreen - 弹幕的链表节点
   */


  function getRealTimeBulletScreen(bulletScreen) {
    var realTimeBulletScreen = {};
    realTimeBulletScreen.bulletScreen = bulletScreen;
    realTimeBulletScreen.style = _helper["default"].clone(_defaultStyle);
    realTimeBulletScreen.style.text = bulletScreen.text;
    var newNode = new _linkedList["default"].node(realTimeBulletScreen);

    _realTimeBulletScreens.push(newNode, false);

    _renderer.creat(realTimeBulletScreen);
  }
  /**
   * 解释器加载
   * @private
   * @param {*} interpreter - 解释器对象
   * @param {*} scope - scope
   * @param {*} realTimeBulletScreen - 弹幕对象
   */


  function InterpreterInit(interpreter, scope, realTimeBulletScreen) {
    interpreter.setProperty(scope, 'time', _options.clock());
    interpreter.setProperty(scope, 'startTime', realTimeBulletScreen.startTime);
    interpreter.setProperty(scope, 'endTime', realTimeBulletScreen.endTime);
    interpreter.setProperty(scope, 'elementWidth', _elementSize.width);
    interpreter.setProperty(scope, 'elementHeight', _elementSize.height);
    interpreter.setProperty(scope, 'scaling', devicePixelRatio * options.scaling);
    interpreter.setProperty(scope, 'setStyle', interpreter.createNativeFunction(function (obj) {
      return setStyle(obj.properties, realTimeBulletScreen);
    }));
  }
  /**
   * 设置弹幕样式
   * @private
   * @param {*} style - 弹幕样式
   * @param {*} realTimeBulletScreen - 弹幕对象
   */


  function setStyle(style, realTimeBulletScreen) {
    if (_helper["default"].isEmpty(style) || style === {}) return;
    var oldStyle = realTimeBulletScreen.style;
    realTimeBulletScreen.style = _helper["default"].setValues(style, realTimeBulletScreen.style, _defaultStyleType, true);
    if (_helper["default"].shallowEqual(oldStyle, realTimeBulletScreen.style)) return;

    _renderer.refresh(oldStyle, realTimeBulletScreen);
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

exports["default"] = SpecialEngine;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZXMvc3BlY2lhbEVuZ2luZS5qcyJdLCJuYW1lcyI6WyJTcGVjaWFsRW5naW5lIiwiZWxlbWVudCIsIm9wdGlvbnMiLCJyZW5kZXJNb2RlIiwiX3N0YXJ0VGltZSIsIl9wYXVzZVRpbWUiLCJfYnVsbGV0U2NyZWVuQnVmZmVyIiwiTGlua2VkTGlzdCIsIl9yZWFsVGltZUJ1bGxldFNjcmVlbnMiLCJfZGVsYXlCdWxsZXRTY3JlZW5Db3VudCIsIl9kZWxheSIsIl9wbGF5aW5nIiwiX3JlZnJlc2hSYXRlIiwiX2xhc3RSZWZyZXNoVGltZSIsIl9vcHRpb25zIiwiX2RlZmF1bHRPcHRpb25zIiwicGxheVNwZWVkIiwiY2xvY2siLCJ0aW1lIiwiRGF0ZSIsImdldFRpbWUiLCJzY2FsaW5nIiwidGltZU91dERpc2NhcmQiLCJvcGFjaXR5IiwiX29wdGlvbnNUeXBlIiwiX2RlZmF1bHRCdWxsZXRTY3JlZW4iLCJ0ZXh0IiwiY2FuRGlzY2FyZCIsInN0YXJ0VGltZSIsImVuZFRpbWUiLCJyZW5kZXJDb2RlIiwiX2RlZmF1bHRTdHlsZSIsInNoYWRvd0JsdXIiLCJmb250V2VpZ2h0IiwiZm9udEZhbWlseSIsInNpemUiLCJib3hDb2xvciIsImNvbG9yIiwiYm9yZGVyQ29sb3IiLCJ0cmFuc2Zvcm0iLCJfYnVsbGV0U2NyZWVuVHlwZSIsIl9kZWZhdWx0U3R5bGVUeXBlIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwid2luZG93IiwiY29uc29sZSIsIndhcm4iLCJSZXNvdXJjZXMiLCJSRVFVRVNUQU5JTUFUSU9ORlJBTUVfTk9UX1NVUFBPUlRfV0FSTiIsImZ1biIsInNldFRpbWVvdXQiLCJIZWxwZXIiLCJzZXRWYWx1ZXMiLCJfZWxlbWVudFNpemUiLCJ3aWR0aCIsImNsaWVudFdpZHRoIiwiaGVpZ2h0IiwiY2xpZW50SGVpZ2h0IiwiX29sZERldmljZVBpeGVsUmF0aW8iLCJnZXREZXZpY2VQaXhlbFJhdGlvIiwiX29sZFNjYWxpbmciLCJfb2xkQ2xpZW50V2lkdGgiLCJfb2xkQ2xpZW50SGVpZ2h0IiwiX29sZE9wYWNpdHkiLCJyZW5kZXJlcnNGYWN0b3J5IiwiUmVuZGVyZXJzRmFjdG9yeSIsIl9yZW5kZXJlciIsImdldFNwZWNpYWxSZW5kZXJlciIsInNldEludGVydmFsIiwic2V0U2l6ZSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZ2V0IiwiY2xvbmUiLCJzZXQiLCJzZXRPcGFjaXR5IiwiYWRkIiwiYnVsbGV0U2NyZWVuIiwibmV3Tm9kZSIsIm5vZGUiLCJmb3JFYWNoIiwibGFzdEJ1bGxldFNjcmVlbiIsImFkZFRvVXAiLCJzdG9wIiwibGlua2VkTGlzdCIsInB1c2giLCJwbGF5IiwicmVmcmVzaCIsInBhdXNlIiwiY2xlYW5CdWZmZXIiLCJjbGVhbiIsImNsZWFuU2NyZWVuIiwicmVuZGVyZXIiLCJnZXRWaXNpYmlsaXR5IiwidmlzaWJpbGl0eSIsInNob3ciLCJoaWRlIiwicmVhbFRpbWVCdWxsZXRTY3JlZW5Db3VudCIsImxlbmd0aCIsImJ1ZmZlckJ1bGxldFNjcmVlbkNvdW50IiwiZGVsYXkiLCJkZWxheUJ1bGxldFNjcmVlbkNvdW50IiwiZnBzIiwiTWF0aCIsImZsb29yIiwibm93VGltZSIsImFkZFJlYWxUaW1lQnVsbGV0U2NyZWVucyIsIm1vdmVSZWFsVGltZUJ1bGxldFNjcmVlbiIsImRyYXciLCJyZWFsVGltZUJ1bGxldFNjcmVlbiIsImludGVycHJldGVyIiwiSW50ZXJwcmV0ZXIiLCJzY29wZSIsIkludGVycHJldGVySW5pdCIsInJ1biIsImV4IiwiZXJyb3IiLCJyZW1vdmUiLCJ0aW1lcyIsInBvcCIsImdldFJlYWxUaW1lQnVsbGV0U2NyZWVuIiwic3R5bGUiLCJjcmVhdCIsInNldFByb3BlcnR5IiwiZGV2aWNlUGl4ZWxSYXRpbyIsImNyZWF0ZU5hdGl2ZUZ1bmN0aW9uIiwib2JqIiwic2V0U3R5bGUiLCJwcm9wZXJ0aWVzIiwiaXNFbXB0eSIsIm9sZFN0eWxlIiwic2hhbGxvd0VxdWFsIiwiQWN0aXZlWE9iamVjdCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsImluZGV4T2YiLCJpbmZvIiwiTE9BREVEX0lORk9fSUUiLCJmaWxsRGF0YSIsImJ1aWxkIiwiTE9BREVEX0lORk8iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7OztJQUVxQkEsYSxHQUNqQix1QkFBWUMsT0FBWixFQUFxQkMsT0FBckIsRUFBcUQ7QUFBQSxNQUF2QkMsVUFBdUIsdUVBQVYsUUFBVTs7QUFBQTs7QUFFakQ7Ozs7QUFJQSxNQUFJQyxVQUFKO0FBQ0E7Ozs7OztBQUlBLE1BQUlDLFVBQVUsR0FBRyxDQUFqQjtBQUNBOzs7OztBQUlBLE1BQUlDLG1CQUFtQixHQUFHLElBQUlDLHNCQUFKLEVBQTFCO0FBQ0E7Ozs7OztBQUlBLE1BQUlDLHNCQUFzQixHQUFHLElBQUlELHNCQUFKLEVBQTdCO0FBQ0E7Ozs7OztBQUlBLE1BQUlFLHVCQUF1QixHQUFHLENBQTlCO0FBQ0E7Ozs7O0FBSUEsTUFBSUMsTUFBTSxHQUFHLENBQWI7QUFDQTs7Ozs7QUFJQSxNQUFJQyxRQUFKO0FBQ0E7Ozs7OztBQUlBLE1BQUlDLFlBQVksR0FBRyxJQUFuQjtBQUNBOzs7OztBQUlBLE1BQUlDLGdCQUFKO0FBQ0E7Ozs7OztBQUlBLE1BQUlDLFFBQUo7QUFDQTs7Ozs7O0FBSUEsTUFBTUMsZUFBZSxHQUFHO0FBQ3BCO0FBQ0FDLElBQUFBLFNBQVMsRUFBRSxDQUZTOztBQUdwQjtBQUNBQyxJQUFBQSxLQUFLLEVBQUUsZUFBQUMsSUFBSTtBQUFBLGFBQUksSUFBSUMsSUFBSixHQUFXQyxPQUFYLEtBQXVCaEIsVUFBM0I7QUFBQSxLQUpTOztBQUtwQjtBQUNBaUIsSUFBQUEsT0FBTyxFQUFFLENBTlc7O0FBT3BCO0FBQ0FDLElBQUFBLGNBQWMsRUFBRSxJQVJJOztBQVNwQjtBQUNBQyxJQUFBQSxPQUFPLEVBQUU7QUFHYjs7Ozs7QUFid0IsR0FBeEI7QUFpQkEsTUFBTUMsWUFBWSxHQUFH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UixHQUF1QjFDLFFBQVEsQ0FBQ08sT0FBdEQ7QUFDQXVDLE1BQUFBLGVBQWUsR0FBRzNELE9BQU8sQ0FBQ3FELFdBQTFCO0FBQ0FPLE1BQUFBLGdCQUFnQixHQUFHNUQsT0FBTyxDQUFDdUQsWUFBM0I7QUFDQUMsTUFBQUEsb0JBQW9CLEdBQUdrRSxnQkFBdkI7O0FBQ0ExRCxNQUFBQSxTQUFTLENBQUNHLE9BQVY7O0FBQ0EsVUFBSSxDQUFDekQsUUFBTCxFQUFlc0QsU0FBUyxDQUFDMEMsSUFBVjtBQUNsQjtBQUNKOztBQUdELE1BQUksQ0FBQyxDQUFDaEUsTUFBTSxDQUFDd0YsYUFBVCxJQUEwQixtQkFBbUJ4RixNQUE3QyxJQUF1RHlGLFNBQVMsQ0FBQ0MsU0FBVixDQUFvQkMsT0FBcEIsQ0FBNEIsU0FBNUIsSUFBeUMsQ0FBQyxDQUFqRyxJQUNBRixTQUFTLENBQUNDLFNBQVYsQ0FBb0JDLE9BQXBCLENBQTRCLE1BQTVCLElBQXNDLENBQUMsQ0FEdkMsSUFDNENGLFNBQVMsQ0FBQ0MsU0FBVixDQUFvQkMsT0FBcEIsQ0FBNEIsTUFBNUIsSUFBc0MsQ0FBQyxDQUR2RixFQUMwRjFGLE9BQU8sQ0FBQzJGLElBQVIsQ0FDbEZ6RixzQkFBVTBGLGNBQVYsQ0FBeUJDLFFBQXpCLENBQWtDQyxLQUFsQyxDQURrRixFQUQxRixLQUtLOUYsT0FBTyxDQUFDMkYsSUFBUixDQUNEekYsc0JBQVU2RixXQUFWLENBQXNCRixRQUF0QixDQUErQkMsS0FBL0IsQ0FEQyxFQUVELGtDQUZDLEVBRW1DLEVBRm5DLEVBRXVDLG9CQUZ2QyxFQUU2RCxFQUY3RDtBQUlSLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGlua2VkTGlzdCBmcm9tICcuLi9saWIvbGlua2VkTGlzdCdcbmltcG9ydCBSZW5kZXJlcnNGYWN0b3J5IGZyb20gJy4uL3JlbmRlcmVycy9yZW5kZXJlcnNGYWN0b3J5J1xuaW1wb3J0IEhlbHBlciBmcm9tICcuLi9saWIvaGVscGVyJ1xuaW1wb3J0IFJlc291cmNlcyBmcm9tICcuLi9saWIvcmVzb3VyY2VzJ1xuaW1wb3J0ICogYXMgYnVpbGQgZnJvbSAnLi4vYnVpbGQuanNvbidcbmltcG9ydCBJbnRlcnByZXRlciBmcm9tICcuLi9saWIvSlMtSW50ZXJwcmV0ZXIvaW50ZXJwcmV0ZXInXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNwZWNpYWxFbmdpbmUge1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMsIHJlbmRlck1vZGUgPSAnY2FudmFzJykge1xuICAgICAgICAvL+WPmOmHj+WIneWni+WMllxuICAgICAgICAvKipcbiAgICAgICAgICog5byA5aeL5pe26Ze0XG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgX3N0YXJ0VGltZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaaguWBnOaXtumXtFxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9wYXVzZVRpbWUgPSAwO1xuICAgICAgICAvKipcbiAgICAgICAgICog5by55bmV57yT5Yay5Yy6XG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtMaW5rZWRMaXN0fVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9idWxsZXRTY3JlZW5CdWZmZXIgPSBuZXcgTGlua2VkTGlzdCgpO1xuICAgICAgICAvKipcbiAgICAgICAgICog5a6e5pe25by55bmV5YiX6KGoXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtMaW5rZWRMaXN0fVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9yZWFsVGltZUJ1bGxldFNjcmVlbnMgPSBuZXcgTGlua2VkTGlzdCgpO1xuICAgICAgICAvKipcbiAgICAgICAgICog5bu26L+f5by55bmV5oC75pWwXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgX2RlbGF5QnVsbGV0U2NyZWVuQ291bnQgPSAwO1xuICAgICAgICAvKipcbiAgICAgICAgICog5bu26L+f77yI5Y2V5L2N77ya5q+r56eS77yJXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgX2RlbGF5ID0gMDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaSreaUvuagh+W/l1xuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgICAgICovXG4gICAgICAgIGxldCBfcGxheWluZztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWIt+aWsOmikeeOh1xuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9yZWZyZXNoUmF0ZSA9IDAuMDY7IC8v5Yid5aeL5Yi35paw6aKR546HXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDkuIrkuIDmrKHliLfmlrDml7bpl7RcbiAgICAgICAgICogQHByaXZhdGUgQHR5cGUge251bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIGxldCBfbGFzdFJlZnJlc2hUaW1lO1xuICAgICAgICAvKipcbiAgICAgICAgICog5YWo5bGA6YCJ6aG5XG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtvcGVuQlNFfnNwZWNpYWxPcHRpb25zfVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9vcHRpb25zO1xuICAgICAgICAvKipcbiAgICAgICAgICog6buY6K6k5YWo5bGA5Y+Y6YePXG4gICAgICAgICAqIEBwcml2YXRlIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX2RlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICAgICAgLyoqIOaSreaUvumAn+W6pijlgI3mlbApICovXG4gICAgICAgICAgICBwbGF5U3BlZWQ6IDEsXG4gICAgICAgICAgICAvKiog5pe26Ze05Z+65YeGICovXG4gICAgICAgICAgICBjbG9jazogdGltZSA9PiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIF9zdGFydFRpbWUsXG4gICAgICAgICAgICAvKiog57yp5pS+5q+U5L6LICovXG4gICAgICAgICAgICBzY2FsaW5nOiAxLFxuICAgICAgICAgICAgLyoqIOi2heaXtuS4ouW8gyAqL1xuICAgICAgICAgICAgdGltZU91dERpc2NhcmQ6IHRydWUsXG4gICAgICAgICAgICAvKiog5by55bmV5LiN6YCP5piO5bqmICovXG4gICAgICAgICAgICBvcGFjaXR5OiAxXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5YWo5bGA6YCJ6aG557G75Z6LXG4gICAgICAgICAqIEBwcml2YXRlIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX29wdGlvbnNUeXBlID0ge1xuICAgICAgICAgICAgcGxheVNwZWVkOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIGNsb2NrOiAnZnVuY3Rpb24nLFxuICAgICAgICAgICAgc2NhbGluZzogJ251bWJlcicsXG4gICAgICAgICAgICB0aW1lT3V0RGlzY2FyZDogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgb3BhY2l0eTogJ251bWJlcicsXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog6buY6K6k5by55bmV5pWw5o2uXG4gICAgICAgICAqIEBwcml2YXRlIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX2RlZmF1bHRCdWxsZXRTY3JlZW4gPSB7XG4gICAgICAgICAgICAvKiog5by55bmV5paH5pysICovXG4gICAgICAgICAgICB0ZXh0OiBudWxsLFxuICAgICAgICAgICAgLyoqIOaYr+WQpuWFgeiuuOS4ouW8gyAqL1xuICAgICAgICAgICAgY2FuRGlzY2FyZDogdHJ1ZSxcbiAgICAgICAgICAgIC8qKiDlvLnluZXov5vlhaXml7bpl7QgKi9cbiAgICAgICAgICAgIHN0YXJ0VGltZTogbnVsbCxcbiAgICAgICAgICAgIC8qKiDlvLnluZXpgIDlh7rml7bpl7QgKi9cbiAgICAgICAgICAgIGVuZFRpbWU6IG51bGwsXG4gICAgICAgICAgICAvKiog5by55bmV5riy5p+T5Luj56CBICovXG4gICAgICAgICAgICByZW5kZXJDb2RlOiBudWxsXG4gICAgICAgIH1cblxuICAgICAgICAvKiogXG4gICAgICAgICAqIOm7mOiupOW8ueW5leagt+W8jyBcbiAgICAgICAgICogQHByaXZhdGUgQHJlYWRvbmx5XG4gICAgICAgICAqICovXG4gICAgICAgIGNvbnN0IF9kZWZhdWx0U3R5bGUgPSB7XG4gICAgICAgICAgICAvKiog5by55bmV5paH5pysICovXG4gICAgICAgICAgICB0ZXh0OiBudWxsLFxuICAgICAgICAgICAgLyoqIOmYtOW9seeahOaooeeziue6p+WIq++8jDDkuLrkuI3mmL7npLrpmLTlvbEgKi9cbiAgICAgICAgICAgIHNoYWRvd0JsdXI6IDIsXG4gICAgICAgICAgICAvKiog5a2X5L2T57KX57uGICovXG4gICAgICAgICAgICBmb250V2VpZ2h0OiAnNjAwJyxcbiAgICAgICAgICAgIC8qKiDlrZfkvZPns7vliJcgKi9cbiAgICAgICAgICAgIGZvbnRGYW1pbHk6ICdzYW5zLXNlcmlmJyxcbiAgICAgICAgICAgIC8qKiDlrZfkvZPlpKflsI/vvIjljZXkvY3vvJrlg4/ntKDvvIkgKi9cbiAgICAgICAgICAgIHNpemU6IDI1LFxuICAgICAgICAgICAgLyoqIOWkluahhuminOiJsiAqL1xuICAgICAgICAgICAgYm94Q29sb3I6IG51bGwsXG4gICAgICAgICAgICAvKiog5a2X5L2T6aKc6ImyICovXG4gICAgICAgICAgICBjb2xvcjogJ3doaXRlJyxcbiAgICAgICAgICAgIC8qKiDmj4/ovrnpopzoibIgKi9cbiAgICAgICAgICAgIGJvcmRlckNvbG9yOiBudWxsLFxuICAgICAgICAgICAgLyoqIOWPmOaNoiAqL1xuICAgICAgICAgICAgdHJhbnNmb3JtOiBudWxsXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5by55bmV5pWw5o2u57G75Z6LXG4gICAgICAgICAqIEBwcml2YXRlIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX2J1bGxldFNjcmVlblR5cGUgPSB7XG4gICAgICAgICAgICB0ZXh0OiAnc3RyaW5nJyxcbiAgICAgICAgICAgIGNhbkRpc2NhcmQ6ICdib29sZWFuJyxcbiAgICAgICAgICAgIHN0YXJ0VGltZTogJ251bWJlcicsXG4gICAgICAgICAgICBlbmRUaW1lOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIHJlbmRlckNvZGU6ICdzdHJpbmcnXG4gICAgICAgIH1cblxuICAgICAgICAvKiogXG4gICAgICAgICAqIOm7mOiupOW8ueW5leagt+W8j+aVsOaNruexu+WeiyBcbiAgICAgICAgICogQHByaXZhdGUgQHJlYWRvbmx5XG4gICAgICAgICAqICovXG4gICAgICAgIGNvbnN0IF9kZWZhdWx0U3R5bGVUeXBlID0ge1xuICAgICAgICAgICAgLyoqIOW8ueW5leaWh+acrCAqL1xuICAgICAgICAgICAgdGV4dDogJ3N0cmluZycsXG4gICAgICAgICAgICAvKiog6Zi05b2x55qE5qih57OK57qn5Yir77yMMOS4uuS4jeaYvuekuumYtOW9sSAqL1xuICAgICAgICAgICAgc2hhZG93Qmx1cjogJ251bWJlcicsXG4gICAgICAgICAgICAvKiog5a2X5L2T57KX57uGICovXG4gICAgICAgICAgICBmb250V2VpZ2h0OiBbJ3N0cmluZycsICdudW1iZXInXSxcbiAgICAgICAgICAgIC8qKiDlrZfkvZPns7vliJcgKi9cbiAgICAgICAgICAgIGZvbnRGYW1pbHk6ICdzdHJpbmcnLFxuICAgICAgICAgICAgLyoqIOWtl+S9k+Wkp+Wwj++8iOWNleS9je+8muWDj+e0oO+8iSAqL1xuICAgICAgICAgICAgc2l6ZTogJ251bWJlcicsXG4gICAgICAgICAgICAvKiog5aSW5qGG6aKc6ImyICovXG4gICAgICAgICAgICBib3hDb2xvcjogWydzdHJpbmcnLCAnbnVsbCddLFxuICAgICAgICAgICAgLyoqIOWtl+S9k+minOiJsiAqL1xuICAgICAgICAgICAgY29sb3I6ICdzdHJpbmcnLFxuICAgICAgICAgICAgLyoqIOaPj+i+ueminOiJsiAqL1xuICAgICAgICAgICAgYm9yZGVyQ29sb3I6IFsnc3RyaW5nJywgJ251bGwnXSxcbiAgICAgICAgICAgIC8qKiDlj5jmjaIgKi9cbiAgICAgICAgICAgIHRyYW5zZm9ybTogWydzdHJpbmcnLCAnbnVsbCddXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogcmVxdWVzdEFuaW1hdGlvbkZyYW1lIOWumuS5ie+8iOS4gOS6m+iAgeW8j+a1j+iniOWZqOS4jeaUr+aMgSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUg77yJXG4gICAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZ1biAtIOWbnuiwg+aWueazlSBcbiAgICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICBsZXQgcmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09ICdmdW5jdGlvbicpIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFJlc291cmNlcy5SRVFVRVNUQU5JTUFUSU9ORlJBTUVfTk9UX1NVUFBPUlRfV0FSTik7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSAoZnVuKSA9PiB3aW5kb3cuc2V0VGltZW91dChmdW4sIDE3KTsgLy82MGZwc1xuICAgICAgICB9XG5cbiAgICAgICAgX29wdGlvbnMgPSBIZWxwZXIuc2V0VmFsdWVzKG9wdGlvbnMsIF9kZWZhdWx0T3B0aW9ucywgX29wdGlvbnNUeXBlKTsgLy/orr7nva7pu5jorqTlgLxcbiAgICAgICAgLy/liJ3lp4vljJZcbiAgICAgICAgbGV0IF9lbGVtZW50U2l6ZSA9IHtcbiAgICAgICAgICAgIHdpZHRoOiBlbGVtZW50LmNsaWVudFdpZHRoIC8gX29wdGlvbnMuc2NhbGluZyxcbiAgICAgICAgICAgIGhlaWdodDogZWxlbWVudC5jbGllbnRIZWlnaHQgLyBfb3B0aW9ucy5zY2FsaW5nXG4gICAgICAgIH1cbiAgICAgICAgbGV0IF9vbGREZXZpY2VQaXhlbFJhdGlvID0gSGVscGVyLmdldERldmljZVBpeGVsUmF0aW8oKTtcbiAgICAgICAgbGV0IF9vbGRTY2FsaW5nID0gX29wdGlvbnMuc2NhbGluZztcbiAgICAgICAgbGV0IF9vbGRDbGllbnRXaWR0aCA9IGVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgIGxldCBfb2xkQ2xpZW50SGVpZ2h0ID0gZWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gICAgICAgIGxldCBfb2xkT3BhY2l0eSA9IF9vcHRpb25zLm9wYWNpdHk7XG4gICAgICAgIC8v5riy5p+T5Zmo5bel5Y6CXG4gICAgICAgIGxldCByZW5kZXJlcnNGYWN0b3J5ID0gbmV3IFJlbmRlcmVyc0ZhY3RvcnkoZWxlbWVudCwgX29wdGlvbnMsIF9lbGVtZW50U2l6ZSk7XG4gICAgICAgIGxldCBfcmVuZGVyZXIgPSByZW5kZXJlcnNGYWN0b3J5LmdldFNwZWNpYWxSZW5kZXJlcihyZW5kZXJNb2RlKTsgLy/lrp7kvovljJbmuLLmn5PlmahcbiAgICAgICAgc2V0SW50ZXJ2YWwoc2V0U2l6ZSwgMTAwKTtcblxuICAgICAgICAvL+WFrOWFseWHveaVsFxuICAgICAgICAvKipcbiAgICAgICAgICog6K6+572u5oiW6I635Y+W5YWo5bGA6YCJ6aG5XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqKi9cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdvcHRpb25zJywge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEhlbHBlci5jbG9uZShfb3B0aW9ucyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgICAgIF9vcHRpb25zID0gSGVscGVyLnNldFZhbHVlcyhvcHRpb25zLCBfb3B0aW9ucywgX29wdGlvbnNUeXBlLCBmYWxzZSk7IC8v6K6+572u6buY6K6k5YC8XG4gICAgICAgICAgICAgICAgaWYgKF9vbGRPcGFjaXR5ICE9IF9vcHRpb25zLm9wYWNpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgX29sZE9wYWNpdHkgPSBfb3B0aW9ucy5vcGFjaXR5O1xuICAgICAgICAgICAgICAgICAgICBfcmVuZGVyZXIuc2V0T3BhY2l0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa3u+WKoOW8ueW5leWIsOW8ueW5leWIl+ihqOOAglxuICAgICAgICAgKiBAZGVzY3JpcHRpb24g5re75Yqg5by55bmV5Yiw5by55bmV5YiX6KGo44CC55Sx5LqO5by55bmV5Zyo5bGP5bmV5LiK5Ye6546w6L+H5ZCO77yM5by55bmV5byV5pOO5bCG5LuO5YiX6KGo5Lit5b275bqV5Yig6Zmk5q2k5by55bmV44CC5omA5Lul77yM5Zyo5pS55Y+Y5pKt5pS+6L+b5bqm5pe277yM5Y+v6IO96ZyA6KaB5YWIW+a4heepuuW8ueW5leWIl+ihqF17QGxpbmsgb3BlbkJTRS5CdWxsZXRTY3JlZW5FbmdpbmUjY2xlYW5CdWxsZXRTY3JlZW5MaXN0fe+8jOeEtuWQjumHjeaWsOWKoOi9veatpOaSreaUvui/m+W6puS7peWQjueahOW8ueW5leOAglxuICAgICAgICAgKiBAcGFyYW0ge29wZW5CU0V+U3BlY2lhbEJ1bGxldFNjcmVlbn0gYnVsbGV0U2NyZWVuIC0g5Y2V5p2h5by55bmV5pWw5o2u77ya5LiA5LiqIHtAbGluayBvcGVuQlNFflNwZWNpYWxCdWxsZXRTY3JlZW59IOe7k+aehOOAglxuICAgICAgICAgKiBAdGhyb3dzIHtUeXBlRXJyb3J9IOS8oOWFpeeahOWPguaVsOmUmeivr+aXtuW8leWPkemUmeivr+OAguivt+WPgumYhSBNRE4gW1R5cGVFcnJvcl17QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvemgtQ04vZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvVHlwZUVycm9yfSDjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuYWRkID0gZnVuY3Rpb24gKGJ1bGxldFNjcmVlbikge1xuICAgICAgICAgICAgX2RlZmF1bHRCdWxsZXRTY3JlZW4uc3RhcnRUaW1lID0gX29wdGlvbnMuY2xvY2soKTtcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbiA9IEhlbHBlci5zZXRWYWx1ZXMoYnVsbGV0U2NyZWVuLCBfZGVmYXVsdEJ1bGxldFNjcmVlbiwgX2J1bGxldFNjcmVlblR5cGUpOyAvL+iuvue9rum7mOiupOWAvFxuXG4gICAgICAgICAgICBsZXQgbmV3Tm9kZSA9IG5ldyBMaW5rZWRMaXN0Lm5vZGUoYnVsbGV0U2NyZWVuKTtcbiAgICAgICAgICAgIF9idWxsZXRTY3JlZW5CdWZmZXIuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgIGxldCBsYXN0QnVsbGV0U2NyZWVuID0gbm9kZS5lbGVtZW50O1xuICAgICAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW4uc3RhcnRUaW1lID4gbGFzdEJ1bGxldFNjcmVlbi5zdGFydFRpbWUpIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGFkZDogeyBhZGRUb1VwOiB0cnVlLCBub2RlOiBuZXdOb2RlIH0sXG4gICAgICAgICAgICAgICAgICAgIHN0b3A6IHRydWVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgICAgICBpZiAobmV3Tm9kZS5saW5rZWRMaXN0ID09PSBudWxsKSBfYnVsbGV0U2NyZWVuQnVmZmVyLnB1c2gobmV3Tm9kZSwgZmFsc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlvIDlp4vmkq3mlL7lvLnluZXjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucGxheSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghX3BsYXlpbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAoIV9zdGFydFRpbWUpXG4gICAgICAgICAgICAgICAgICAgIF9zdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICBpZiAoX3BhdXNlVGltZSlcbiAgICAgICAgICAgICAgICAgICAgX3N0YXJ0VGltZSArPSBfb3B0aW9ucy5jbG9jaygpIC0gX3BhdXNlVGltZTtcbiAgICAgICAgICAgICAgICBfbGFzdFJlZnJlc2hUaW1lID0gbnVsbDtcbiAgICAgICAgICAgICAgICBfcGxheWluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlZnJlc2gpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmmoLlgZzmkq3mlL7lvLnluZXjgIJcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIOaaguWBnOaSreaUvuW8ueW5leOAguaaguWBnOaSreaUvuW8ueW5leaYr+aMh+W8ueW5leaSreaUvuaaguWBnO+8jOaJgOacieacquWHuueOsOeahOW8ueW5leWwhuWBnOatouWHuueOsO+8jOW3suWHuueOsOeahOW8ueW5leWBnOatoui/kOWKqO+8jOWBnOatoua2iOWkseOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5wYXVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChfcGxheWluZykge1xuICAgICAgICAgICAgICAgIF9wYXVzZVRpbWUgPSBfb3B0aW9ucy5jbG9jaygpO1xuICAgICAgICAgICAgICAgIF9wbGF5aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa4heepuuW8ueW5lee8k+WGsuWMuuOAglxuICAgICAgICAgKiBAZGVzY3JpcHRpb24g5riF56m65by55bmV5YiX6KGo77yM5L2G5bGP5bmV5LiK5bey57uP5Ye6546w55qE5by55bmV5LiN5Lya6KKr5riF6Zmk44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmNsZWFuQnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX2J1bGxldFNjcmVlbkJ1ZmZlci5jbGVhbigpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmuIXnqbrlsY/luZXlhoXlrrnjgIJcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIOa4heepuuWxj+W5leWGheWuueOAgua4heepuuWxj+W5leS4iuW3sue7j+WHuueOsOeahOW8ueW5le+8jOS4jeWMheaLrOW8ueW5leWIl+ihqOS4reeahOW8ueW5leOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jbGVhblNjcmVlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF9yZWFsVGltZUJ1bGxldFNjcmVlbnMuY2xlYW4oKTtcbiAgICAgICAgICAgIF9yZW5kZXJlci5jbGVhblNjcmVlbigpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlgZzmraLmkq3mlL7lvLnluZXjgIJcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIOWBnOatouaSreaUvuW8ueW5leOAguWBnOatouaSreaUvuW8ueW5leaYr+aMh+WBnOatouaSreaUvuW8ueW5le+8jOm7mOiupFvml7bpl7Tln7rlh4bvvIhvcHRpb25zLmNsb2Nr77yJXXtAbGluayBvcGVuQlNFfkJ1bGxldFNjcmVlblN0eWxlfeW9kumbtu+8jOW5tlvmuIXnqbrlvLnluZXliJfooahde0BsaW5rIG9wZW5CU0UuQnVsbGV0U2NyZWVuRW5naW5lI2NsZWFuQnVsbGV0U2NyZWVuTGlzdH3jgIFb5riF56m65bGP5bmV5YaF5a65XXtAbGluayBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZSNjbGVhblNjcmVlbn3jgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChfcGxheWluZykge1xuICAgICAgICAgICAgICAgIHRoaXMucGF1c2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY2xlYW5CdWZmZXIoKTtcbiAgICAgICAgICAgIHRoaXMuY2xlYW5TY3JlZW4oKTtcbiAgICAgICAgICAgIF9wYXVzZVRpbWUgPSAwO1xuICAgICAgICAgICAgX3N0YXJ0VGltZSA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPluaIluiuvue9ruW8ueW5leWPr+ingeaAp+OAglxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICd2aXNpYmlsaXR5Jywge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbmRlcmVyLmdldFZpc2liaWxpdHkoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2aXNpYmlsaXR5KSB7XG4gICAgICAgICAgICAgICAgaWYgKHZpc2liaWxpdHkpIF9yZW5kZXJlci5zaG93KCk7XG4gICAgICAgICAgICAgICAgZWxzZSBfcmVuZGVyZXIuaGlkZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W5riy5p+T5qih5byP44CCXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3JlbmRlck1vZGUnLCB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVuZGVyTW9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPluaSreaUvueKtuaAgeOAglxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdwbGF5U3RhdGUnLCB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3BsYXlpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAqIOiOt+WPluiwg+ivleS/oeaBr+OAglxuICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICovXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnZGVidWdJbmZvJywge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdGltZTogX3BsYXlpbmcgPyBfb3B0aW9ucy5jbG9jaygpIDogX3BhdXNlVGltZSxcbiAgICAgICAgICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW5Db3VudDogX3JlYWxUaW1lQnVsbGV0U2NyZWVucy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlckJ1bGxldFNjcmVlbkNvdW50OiBfYnVsbGV0U2NyZWVuQnVmZmVyLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6IF9kZWxheSxcbiAgICAgICAgICAgICAgICAgICAgZGVsYXlCdWxsZXRTY3JlZW5Db3VudDogX2RlbGF5QnVsbGV0U2NyZWVuQ291bnQsXG4gICAgICAgICAgICAgICAgICAgIGZwczogX3BsYXlpbmcgPyBNYXRoLmZsb29yKF9yZWZyZXNoUmF0ZSAqIDEwMDApIDogMCAvL+W4p+mikVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8v5YaF6YOo5Ye95pWwXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliLfmlrDlvLnluZXlh73mlbBcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG4gICAgICAgICAgICBsZXQgbm93VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgaWYgKF9sYXN0UmVmcmVzaFRpbWUgIT0gbnVsbClcbiAgICAgICAgICAgICAgICBfcmVmcmVzaFJhdGUgPSAxIC8gKG5vd1RpbWUgLSBfbGFzdFJlZnJlc2hUaW1lKTtcbiAgICAgICAgICAgIF9sYXN0UmVmcmVzaFRpbWUgPSBub3dUaW1lO1xuICAgICAgICAgICAgYWRkUmVhbFRpbWVCdWxsZXRTY3JlZW5zKCk7XG4gICAgICAgICAgICBtb3ZlUmVhbFRpbWVCdWxsZXRTY3JlZW4oKTtcbiAgICAgICAgICAgIF9yZW5kZXJlci5kcmF3KCk7IC8v57uY5Yi25by55bmVXG4gICAgICAgICAgICBpZiAoX3BsYXlpbmcpXG4gICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlZnJlc2gpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOenu+WKqOW8ueW5leWHveaVsFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gbW92ZVJlYWxUaW1lQnVsbGV0U2NyZWVuKCkge1xuICAgICAgICAgICAgX3JlYWxUaW1lQnVsbGV0U2NyZWVucy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHJlYWxUaW1lQnVsbGV0U2NyZWVuID0gbm9kZS5lbGVtZW50O1xuICAgICAgICAgICAgICAgIGxldCBub3dUaW1lID0gX29wdGlvbnMuY2xvY2soKTtcbiAgICAgICAgICAgICAgICBpZiAocmVhbFRpbWVCdWxsZXRTY3JlZW4uYnVsbGV0U2NyZWVuLmVuZFRpbWUgPiBub3dUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WIm+W7uuino+mHiuWZqOWvueixoVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGludGVycHJldGVyID0gbmV3IEludGVycHJldGVyKHJlYWxUaW1lQnVsbGV0U2NyZWVuLmJ1bGxldFNjcmVlbi5yZW5kZXJDb2RlLCAoaW50ZXJwcmV0ZXIsIHNjb3BlKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgSW50ZXJwcmV0ZXJJbml0KGludGVycHJldGVyLCBzY29wZSwgcmVhbFRpbWVCdWxsZXRTY3JlZW4pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVycHJldGVyLnJ1bigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhdGNoKGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9yZW5kZXJlci5kZWxldGUocmVhbFRpbWVCdWxsZXRTY3JlZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgcmVtb3ZlOiB0cnVlIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfcmVuZGVyZXIuZGVsZXRlKHJlYWxUaW1lQnVsbGV0U2NyZWVuKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgcmVtb3ZlOiB0cnVlIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5re75Yqg5by55bmV5Yiw5a6e5pe25by55bmV5YiX6KGoXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhZGRSZWFsVGltZUJ1bGxldFNjcmVlbnMoKSB7XG4gICAgICAgICAgICBpZiAoX3JlYWxUaW1lQnVsbGV0U2NyZWVucy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAgICAgX2RlbGF5ID0gMDtcbiAgICAgICAgICAgIGxldCB0aW1lcyA9IE1hdGguZmxvb3IoX3JlZnJlc2hSYXRlICogMjAwMCk7XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgbGV0IG5vZGUgPSBfYnVsbGV0U2NyZWVuQnVmZmVyLnBvcChmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGlmIChub2RlID09PSBudWxsKSByZXR1cm47XG4gICAgICAgICAgICAgICAgbGV0IGJ1bGxldFNjcmVlbiA9IG5vZGUuZWxlbWVudDtcbiAgICAgICAgICAgICAgICBsZXQgbm93VGltZSA9IF9vcHRpb25zLmNsb2NrKCk7XG4gICAgICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbi5zdGFydFRpbWUgPiBub3dUaW1lKSByZXR1cm47XG4gICAgICAgICAgICAgICAgaWYgKCFfb3B0aW9ucy50aW1lT3V0RGlzY2FyZCB8fCAhYnVsbGV0U2NyZWVuLmNhbkRpc2NhcmQgfHwgYnVsbGV0U2NyZWVuLnN0YXJ0VGltZSA+IG5vd1RpbWUgLSBNYXRoLmZsb29yKDEgLyBfcmVmcmVzaFJhdGUpICogNjApIHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0UmVhbFRpbWVCdWxsZXRTY3JlZW4oYnVsbGV0U2NyZWVuKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgX2RlbGF5QnVsbGV0U2NyZWVuQ291bnQrKztcbiAgICAgICAgICAgICAgICBub2RlLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIHRpbWVzLS07XG4gICAgICAgICAgICB9IHdoaWxlIChfcmVhbFRpbWVCdWxsZXRTY3JlZW5zLmxlbmd0aCA9PT0gMCB8fCB0aW1lcyA+IDApO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOeUn+aIkOWunuaXtuW8ueW5leWvueixoVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAcGFyYW0ge29wZW5CU0V+QnVsbGV0U2NyZWVufSBidWxsZXRTY3JlZW4gLSDlvLnluZXnmoTpk77ooajoioLngrlcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdldFJlYWxUaW1lQnVsbGV0U2NyZWVuKGJ1bGxldFNjcmVlbikge1xuICAgICAgICAgICAgbGV0IHJlYWxUaW1lQnVsbGV0U2NyZWVuID0ge307XG4gICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi5idWxsZXRTY3JlZW4gPSBidWxsZXRTY3JlZW47XG4gICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi5zdHlsZSA9IEhlbHBlci5jbG9uZShfZGVmYXVsdFN0eWxlKTtcbiAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLnN0eWxlLnRleHQgPSBidWxsZXRTY3JlZW4udGV4dDtcbiAgICAgICAgICAgIGxldCBuZXdOb2RlID0gbmV3IExpbmtlZExpc3Qubm9kZShyZWFsVGltZUJ1bGxldFNjcmVlbik7XG4gICAgICAgICAgICBfcmVhbFRpbWVCdWxsZXRTY3JlZW5zLnB1c2gobmV3Tm9kZSwgZmFsc2UpO1xuICAgICAgICAgICAgX3JlbmRlcmVyLmNyZWF0KHJlYWxUaW1lQnVsbGV0U2NyZWVuKTsgLy/liJvlu7rlvLnluZXlhYPntKBcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDop6Pph4rlmajliqDovb1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQHBhcmFtIHsqfSBpbnRlcnByZXRlciAtIOino+mHiuWZqOWvueixoVxuICAgICAgICAgKiBAcGFyYW0geyp9IHNjb3BlIC0gc2NvcGVcbiAgICAgICAgICogQHBhcmFtIHsqfSByZWFsVGltZUJ1bGxldFNjcmVlbiAtIOW8ueW5leWvueixoVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gSW50ZXJwcmV0ZXJJbml0KGludGVycHJldGVyLCBzY29wZSwgcmVhbFRpbWVCdWxsZXRTY3JlZW4pIHtcbiAgICAgICAgICAgIGludGVycHJldGVyLnNldFByb3BlcnR5KHNjb3BlLCAndGltZScsIF9vcHRpb25zLmNsb2NrKCkpO1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXIuc2V0UHJvcGVydHkoc2NvcGUsICdzdGFydFRpbWUnLCByZWFsVGltZUJ1bGxldFNjcmVlbi5zdGFydFRpbWUpO1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXIuc2V0UHJvcGVydHkoc2NvcGUsICdlbmRUaW1lJywgcmVhbFRpbWVCdWxsZXRTY3JlZW4uZW5kVGltZSk7XG4gICAgICAgICAgICBpbnRlcnByZXRlci5zZXRQcm9wZXJ0eShzY29wZSwgJ2VsZW1lbnRXaWR0aCcsIF9lbGVtZW50U2l6ZS53aWR0aCk7XG4gICAgICAgICAgICBpbnRlcnByZXRlci5zZXRQcm9wZXJ0eShzY29wZSwgJ2VsZW1lbnRIZWlnaHQnLCBfZWxlbWVudFNpemUuaGVpZ2h0KTtcbiAgICAgICAgICAgIGludGVycHJldGVyLnNldFByb3BlcnR5KHNjb3BlLCAnc2NhbGluZycsIGRldmljZVBpeGVsUmF0aW8gKiBvcHRpb25zLnNjYWxpbmcpO1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXIuc2V0UHJvcGVydHkoc2NvcGUsICdzZXRTdHlsZScsIGludGVycHJldGVyLmNyZWF0ZU5hdGl2ZUZ1bmN0aW9uKChvYmopID0+IHNldFN0eWxlKG9iai5wcm9wZXJ0aWVzLCByZWFsVGltZUJ1bGxldFNjcmVlbikpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDorr7nva7lvLnluZXmoLflvI9cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQHBhcmFtIHsqfSBzdHlsZSAtIOW8ueW5leagt+W8j1xuICAgICAgICAgKiBAcGFyYW0geyp9IHJlYWxUaW1lQnVsbGV0U2NyZWVuIC0g5by55bmV5a+56LGhXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBzZXRTdHlsZShzdHlsZSwgcmVhbFRpbWVCdWxsZXRTY3JlZW4pIHtcbiAgICAgICAgICAgIGlmIChIZWxwZXIuaXNFbXB0eShzdHlsZSkgfHwgc3R5bGUgPT09IHt9KSByZXR1cm47XG4gICAgICAgICAgICBsZXQgb2xkU3R5bGUgPSByZWFsVGltZUJ1bGxldFNjcmVlbi5zdHlsZTtcbiAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLnN0eWxlID0gSGVscGVyLnNldFZhbHVlcyhzdHlsZSwgcmVhbFRpbWVCdWxsZXRTY3JlZW4uc3R5bGUsIF9kZWZhdWx0U3R5bGVUeXBlLCB0cnVlKTtcbiAgICAgICAgICAgIGlmIChIZWxwZXIuc2hhbGxvd0VxdWFsKG9sZFN0eWxlLCByZWFsVGltZUJ1bGxldFNjcmVlbi5zdHlsZSkpIHJldHVybjtcbiAgICAgICAgICAgIF9yZW5kZXJlci5yZWZyZXNoKG9sZFN0eWxlLCByZWFsVGltZUJ1bGxldFNjcmVlbik7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog6K6+572u5bC65a+4XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBzZXRTaXplKCkge1xuICAgICAgICAgICAgbGV0IGRldmljZVBpeGVsUmF0aW8gPSBIZWxwZXIuZ2V0RGV2aWNlUGl4ZWxSYXRpbygpO1xuICAgICAgICAgICAgaWYgKF9vbGREZXZpY2VQaXhlbFJhdGlvICE9IGRldmljZVBpeGVsUmF0aW8gfHxcbiAgICAgICAgICAgICAgICBfb2xkQ2xpZW50V2lkdGggIT0gZWxlbWVudC5jbGllbnRXaWR0aCB8fFxuICAgICAgICAgICAgICAgIF9vbGRDbGllbnRIZWlnaHQgIT0gZWxlbWVudC5jbGllbnRIZWlnaHQgfHxcbiAgICAgICAgICAgICAgICBfb2xkU2NhbGluZyAhPSBfb3B0aW9ucy5zY2FsaW5nKSB7XG4gICAgICAgICAgICAgICAgX29sZFNjYWxpbmcgPSBfb3B0aW9ucy5zY2FsaW5nO1xuICAgICAgICAgICAgICAgIF9lbGVtZW50U2l6ZS53aWR0aCA9IGVsZW1lbnQuY2xpZW50V2lkdGggLyBfb3B0aW9ucy5zY2FsaW5nO1xuICAgICAgICAgICAgICAgIF9lbGVtZW50U2l6ZS5oZWlnaHQgPSBlbGVtZW50LmNsaWVudEhlaWdodCAvIF9vcHRpb25zLnNjYWxpbmc7XG4gICAgICAgICAgICAgICAgX29sZENsaWVudFdpZHRoID0gZWxlbWVudC5jbGllbnRXaWR0aDtcbiAgICAgICAgICAgICAgICBfb2xkQ2xpZW50SGVpZ2h0ID0gZWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgX29sZERldmljZVBpeGVsUmF0aW8gPSBkZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgICAgIF9yZW5kZXJlci5zZXRTaXplKCk7XG4gICAgICAgICAgICAgICAgaWYgKCFfcGxheWluZykgX3JlbmRlcmVyLmRyYXcoKTsgLy/pnZ7mkq3mlL7nirbmgIHliJnph43nu5hcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vSUUgRWRnZSDmtY/op4jlmajkuI3mlK/mjIEgJWNcbiAgICAgICAgaWYgKCEhd2luZG93LkFjdGl2ZVhPYmplY3QgfHwgXCJBY3RpdmVYT2JqZWN0XCIgaW4gd2luZG93IHx8IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIlRyaWRlbnRcIikgPiAtMSB8fFxuICAgICAgICAgICAgbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRVwiKSA+IC0xIHx8IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIkVkZ2VcIikgPiAtMSkgY29uc29sZS5pbmZvKFxuICAgICAgICAgICAgICAgIFJlc291cmNlcy5MT0FERURfSU5GT19JRS5maWxsRGF0YShidWlsZClcbiAgICAgICAgICAgICk7XG4gICAgICAgIC8vT3RoZXJcbiAgICAgICAgZWxzZSBjb25zb2xlLmluZm8oXG4gICAgICAgICAgICBSZXNvdXJjZXMuTE9BREVEX0lORk8uZmlsbERhdGEoYnVpbGQpLFxuICAgICAgICAgICAgJ2ZvbnQtd2VpZ2h0OmJvbGQ7IGNvbG9yOiMwMDk5RkY7JywgJycsICdmb250LXN0eWxlOml0YWxpYzsnLCAnJ1xuICAgICAgICApO1xuICAgIH1cbn0iXSwiZmlsZSI6ImVuZ2luZXMvc3BlY2lhbEVuZ2luZS5qcyJ9
