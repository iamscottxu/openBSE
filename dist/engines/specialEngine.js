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
    bulletScreen.style = _helper["default"].clone(_defaultStyle);
    bulletScreen.style.text = bulletScreen.text;
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

      var interpreter = new _interpreter["default"](realTimeBulletScreen.renderCode, function (interpreter, scope) {
        return InterpreterInit(interpreter, scope, realTimeBulletScreen);
      });
      if (realTimeBulletScreen.endTime > nowTime) interpreter.run();else {
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
        _renderer.creat(bulletScreen);

        _realTimeBulletScreens.push(node, false);
      } else {
        _delayBulletScreenCount++;
        node.remove();
      }

      times--;
    } while (_realTimeBulletScreens.length === 0 || times > 0);
  }
  /**
   * 解释器加载
   * @private
   * @param {*} interpreter - 解释器对象
   * @param {*} scope - scope
   * @param {*} bulletScreen - 弹幕对象
   */


  function InterpreterInit(interpreter, scope, bulletScreen) {
    interpreter.setProperty(scope, 'time', _options.clock());
    interpreter.setProperty(scope, 'startTime', bulletScreen.startTime);
    interpreter.setProperty(scope, 'endTime', bulletScreen.endTime);
    interpreter.setProperty(scope, 'elementWidth', _elementSize.width);
    interpreter.setProperty(scope, 'elementHeight', _elementSize.height);
    interpreter.setProperty(scope, 'scaling', devicePixelRatio * options.scaling);
    interpreter.setProperty(scope, 'setStyle', interpreter.createNativeFunction(function (obj) {
      return setStyle(obj.properties, bulletScreen);
    }));
  }
  /**
   * 设置弹幕样式
   * @private
   * @param {*} style - 弹幕样式
   * @param {*} bulletScreen - 弹幕对象
   */


  function setStyle(style, bulletScreen) {
    if (_helper["default"].isEmpty(style) || style === {}) return;
    var oldStyle = bulletScreen.style;
    bulletScreen.style = _helper["default"].setValues(style, bulletScreen.style, _defaultStyleType, true);
    if (_helper["default"].shallowEqual(oldStyle, bulletScreen.style)) return;

    _renderer.refresh(bulletScreen);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZXMvc3BlY2lhbEVuZ2luZS5qcyJdLCJuYW1lcyI6WyJTcGVjaWFsRW5naW5lIiwiZWxlbWVudCIsIm9wdGlvbnMiLCJyZW5kZXJNb2RlIiwiX3N0YXJ0VGltZSIsIl9wYXVzZVRpbWUiLCJfYnVsbGV0U2NyZWVuQnVmZmVyIiwiTGlua2VkTGlzdCIsIl9yZWFsVGltZUJ1bGxldFNjcmVlbnMiLCJfZGVsYXlCdWxsZXRTY3JlZW5Db3VudCIsIl9kZWxheSIsIl9wbGF5aW5nIiwiX3JlZnJlc2hSYXRlIiwiX2xhc3RSZWZyZXNoVGltZSIsIl9vcHRpb25zIiwiX2RlZmF1bHRPcHRpb25zIiwicGxheVNwZWVkIiwiY2xvY2siLCJ0aW1lIiwiRGF0ZSIsImdldFRpbWUiLCJzY2FsaW5nIiwidGltZU91dERpc2NhcmQiLCJvcGFjaXR5IiwiX29wdGlvbnNUeXBlIiwiX2RlZmF1bHRCdWxsZXRTY3JlZW4iLCJ0ZXh0IiwiY2FuRGlzY2FyZCIsInN0YXJ0VGltZSIsImVuZFRpbWUiLCJyZW5kZXJDb2RlIiwiX2RlZmF1bHRTdHlsZSIsInNoYWRvd0JsdXIiLCJmb250V2VpZ2h0IiwiZm9udEZhbWlseSIsInNpemUiLCJib3hDb2xvciIsImNvbG9yIiwiYm9yZGVyQ29sb3IiLCJ0cmFuc2Zvcm0iLCJfYnVsbGV0U2NyZWVuVHlwZSIsIl9kZWZhdWx0U3R5bGVUeXBlIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwid2luZG93IiwiY29uc29sZSIsIndhcm4iLCJSZXNvdXJjZXMiLCJSRVFVRVNUQU5JTUFUSU9ORlJBTUVfTk9UX1NVUFBPUlRfV0FSTiIsImZ1biIsInNldFRpbWVvdXQiLCJIZWxwZXIiLCJzZXRWYWx1ZXMiLCJfZWxlbWVudFNpemUiLCJ3aWR0aCIsImNsaWVudFdpZHRoIiwiaGVpZ2h0IiwiY2xpZW50SGVpZ2h0IiwiX29sZERldmljZVBpeGVsUmF0aW8iLCJnZXREZXZpY2VQaXhlbFJhdGlvIiwiX29sZFNjYWxpbmciLCJfb2xkQ2xpZW50V2lkdGgiLCJfb2xkQ2xpZW50SGVpZ2h0IiwiX29sZE9wYWNpdHkiLCJyZW5kZXJlcnNGYWN0b3J5IiwiUmVuZGVyZXJzRmFjdG9yeSIsIl9yZW5kZXJlciIsImdldFNwZWNpYWxSZW5kZXJlciIsInNldEludGVydmFsIiwic2V0U2l6ZSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZ2V0IiwiY2xvbmUiLCJzZXQiLCJzZXRPcGFjaXR5IiwiYWRkIiwiYnVsbGV0U2NyZWVuIiwic3R5bGUiLCJuZXdOb2RlIiwibm9kZSIsImZvckVhY2giLCJsYXN0QnVsbGV0U2NyZWVuIiwiYWRkVG9VcCIsInN0b3AiLCJsaW5rZWRMaXN0IiwicHVzaCIsInBsYXkiLCJyZWZyZXNoIiwicGF1c2UiLCJjbGVhbkJ1ZmZlciIsImNsZWFuIiwiY2xlYW5TY3JlZW4iLCJyZW5kZXJlciIsImdldFZpc2liaWxpdHkiLCJ2aXNpYmlsaXR5Iiwic2hvdyIsImhpZGUiLCJyZWFsVGltZUJ1bGxldFNjcmVlbkNvdW50IiwibGVuZ3RoIiwiYnVmZmVyQnVsbGV0U2NyZWVuQ291bnQiLCJkZWxheSIsImRlbGF5QnVsbGV0U2NyZWVuQ291bnQiLCJmcHMiLCJNYXRoIiwiZmxvb3IiLCJub3dUaW1lIiwiYWRkUmVhbFRpbWVCdWxsZXRTY3JlZW5zIiwibW92ZVJlYWxUaW1lQnVsbGV0U2NyZWVuIiwiZHJhdyIsInJlYWxUaW1lQnVsbGV0U2NyZWVuIiwiaW50ZXJwcmV0ZXIiLCJJbnRlcnByZXRlciIsInNjb3BlIiwiSW50ZXJwcmV0ZXJJbml0IiwicnVuIiwicmVtb3ZlIiwidGltZXMiLCJwb3AiLCJjcmVhdCIsInNldFByb3BlcnR5IiwiZGV2aWNlUGl4ZWxSYXRpbyIsImNyZWF0ZU5hdGl2ZUZ1bmN0aW9uIiwib2JqIiwic2V0U3R5bGUiLCJwcm9wZXJ0aWVzIiwiaXNFbXB0eSIsIm9sZFN0eWxlIiwic2hhbGxvd0VxdWFsIiwiQWN0aXZlWE9iamVjdCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsImluZGV4T2YiLCJpbmZv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TyxDQUFDd0YsSUFBUixDQUNsRnRGLHNCQUFVdUYsY0FBVixDQUF5QkMsUUFBekIsQ0FBa0NDLEtBQWxDLENBRGtGLEVBRDFGLEtBS0szRixPQUFPLENBQUN3RixJQUFSLENBQ0R0RixzQkFBVTBGLFdBQVYsQ0FBc0JGLFFBQXRCLENBQStCQyxLQUEvQixDQURDLEVBRUQsa0NBRkMsRUFFbUMsRUFGbkMsRUFFdUMsb0JBRnZDLEVBRTZELEVBRjdEO0FBSVIsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMaW5rZWRMaXN0IGZyb20gJy4uL2xpYi9saW5rZWRMaXN0J1xuaW1wb3J0IFJlbmRlcmVyc0ZhY3RvcnkgZnJvbSAnLi4vcmVuZGVyZXJzL3JlbmRlcmVyc0ZhY3RvcnknXG5pbXBvcnQgSGVscGVyIGZyb20gJy4uL2xpYi9oZWxwZXInXG5pbXBvcnQgUmVzb3VyY2VzIGZyb20gJy4uL2xpYi9yZXNvdXJjZXMnXG5pbXBvcnQgKiBhcyBidWlsZCBmcm9tICcuLi9idWlsZC5qc29uJ1xuaW1wb3J0IEludGVycHJldGVyIGZyb20gJy4uL2xpYi9KUy1JbnRlcnByZXRlci9pbnRlcnByZXRlcidcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3BlY2lhbEVuZ2luZSB7XG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgb3B0aW9ucywgcmVuZGVyTW9kZSA9ICdjYW52YXMnKSB7XG4gICAgICAgIC8v5Y+Y6YeP5Yid5aeL5YyWXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlvIDlp4vml7bpl7RcbiAgICAgICAgICogQHByaXZhdGUgQHR5cGUge251bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIGxldCBfc3RhcnRUaW1lO1xuICAgICAgICAvKipcbiAgICAgICAgICog5pqC5YGc5pe26Ze0XG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgX3BhdXNlVGltZSA9IDA7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlvLnluZXnvJPlhrLljLpcbiAgICAgICAgICogQHByaXZhdGUgQHR5cGUge0xpbmtlZExpc3R9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgX2J1bGxldFNjcmVlbkJ1ZmZlciA9IG5ldyBMaW5rZWRMaXN0KCk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlrp7ml7blvLnluZXliJfooahcbiAgICAgICAgICogQHByaXZhdGUgQHR5cGUge0xpbmtlZExpc3R9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgX3JlYWxUaW1lQnVsbGV0U2NyZWVucyA9IG5ldyBMaW5rZWRMaXN0KCk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlu7bov5/lvLnluZXmgLvmlbBcbiAgICAgICAgICogQHByaXZhdGUgQHR5cGUge251bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIGxldCBfZGVsYXlCdWxsZXRTY3JlZW5Db3VudCA9IDA7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlu7bov5/vvIjljZXkvY3vvJrmr6vnp5LvvIlcbiAgICAgICAgICogQHByaXZhdGUgQHR5cGUge251bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIGxldCBfZGVsYXkgPSAwO1xuICAgICAgICAvKipcbiAgICAgICAgICog5pKt5pS+5qCH5b+XXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtib29sZWFufVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9wbGF5aW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICog5Yi35paw6aKR546HXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgX3JlZnJlc2hSYXRlID0gMC4wNjsgLy/liJ3lp4vliLfmlrDpopHnjodcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOS4iuS4gOasoeWIt+aWsOaXtumXtFxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9sYXN0UmVmcmVzaFRpbWU7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlhajlsYDpgInpoblcbiAgICAgICAgICogQHByaXZhdGUgQHR5cGUge29wZW5CU0V+c3BlY2lhbE9wdGlvbnN9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgX29wdGlvbnM7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDpu5jorqTlhajlsYDlj5jph49cbiAgICAgICAgICogQHByaXZhdGUgQHJlYWRvbmx5XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAgICAgICAvKiog5pKt5pS+6YCf5bqmKOWAjeaVsCkgKi9cbiAgICAgICAgICAgIHBsYXlTcGVlZDogMSxcbiAgICAgICAgICAgIC8qKiDml7bpl7Tln7rlh4YgKi9cbiAgICAgICAgICAgIGNsb2NrOiB0aW1lID0+IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gX3N0YXJ0VGltZSxcbiAgICAgICAgICAgIC8qKiDnvKnmlL7mr5TkvosgKi9cbiAgICAgICAgICAgIHNjYWxpbmc6IDEsXG4gICAgICAgICAgICAvKiog6LaF5pe25Lii5byDICovXG4gICAgICAgICAgICB0aW1lT3V0RGlzY2FyZDogdHJ1ZSxcbiAgICAgICAgICAgIC8qKiDlvLnluZXkuI3pgI/mmI7luqYgKi9cbiAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlhajlsYDpgInpobnnsbvlnotcbiAgICAgICAgICogQHByaXZhdGUgQHJlYWRvbmx5XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfb3B0aW9uc1R5cGUgPSB7XG4gICAgICAgICAgICBwbGF5U3BlZWQ6ICdudW1iZXInLFxuICAgICAgICAgICAgY2xvY2s6ICdmdW5jdGlvbicsXG4gICAgICAgICAgICBzY2FsaW5nOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIHRpbWVPdXREaXNjYXJkOiAnYm9vbGVhbicsXG4gICAgICAgICAgICBvcGFjaXR5OiAnbnVtYmVyJyxcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDpu5jorqTlvLnluZXmlbDmja5cbiAgICAgICAgICogQHByaXZhdGUgQHJlYWRvbmx5XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfZGVmYXVsdEJ1bGxldFNjcmVlbiA9IHtcbiAgICAgICAgICAgIC8qKiDlvLnluZXmlofmnKwgKi9cbiAgICAgICAgICAgIHRleHQ6IG51bGwsXG4gICAgICAgICAgICAvKiog5piv5ZCm5YWB6K645Lii5byDICovXG4gICAgICAgICAgICBjYW5EaXNjYXJkOiB0cnVlLFxuICAgICAgICAgICAgLyoqIOW8ueW5lei/m+WFpeaXtumXtCAqL1xuICAgICAgICAgICAgc3RhcnRUaW1lOiBudWxsLFxuICAgICAgICAgICAgLyoqIOW8ueW5lemAgOWHuuaXtumXtCAqL1xuICAgICAgICAgICAgZW5kVGltZTogbnVsbCxcbiAgICAgICAgICAgIC8qKiDlvLnluZXmuLLmn5Pku6PnoIEgKi9cbiAgICAgICAgICAgIHJlbmRlckNvZGU6IG51bGxcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKiBcbiAgICAgICAgICog6buY6K6k5by55bmV5qC35byPIFxuICAgICAgICAgKiBAcHJpdmF0ZSBAcmVhZG9ubHlcbiAgICAgICAgICogKi9cbiAgICAgICAgY29uc3QgX2RlZmF1bHRTdHlsZSA9IHtcbiAgICAgICAgICAgIC8qKiDlvLnluZXmlofmnKwgKi9cbiAgICAgICAgICAgIHRleHQ6IG51bGwsXG4gICAgICAgICAgICAvKiog6Zi05b2x55qE5qih57OK57qn5Yir77yMMOS4uuS4jeaYvuekuumYtOW9sSAqL1xuICAgICAgICAgICAgc2hhZG93Qmx1cjogMixcbiAgICAgICAgICAgIC8qKiDlrZfkvZPnspfnu4YgKi9cbiAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICc2MDAnLFxuICAgICAgICAgICAgLyoqIOWtl+S9k+ezu+WIlyAqL1xuICAgICAgICAgICAgZm9udEZhbWlseTogJ3NhbnMtc2VyaWYnLFxuICAgICAgICAgICAgLyoqIOWtl+S9k+Wkp+Wwj++8iOWNleS9je+8muWDj+e0oO+8iSAqL1xuICAgICAgICAgICAgc2l6ZTogMjUsXG4gICAgICAgICAgICAvKiog5aSW5qGG6aKc6ImyICovXG4gICAgICAgICAgICBib3hDb2xvcjogbnVsbCxcbiAgICAgICAgICAgIC8qKiDlrZfkvZPpopzoibIgKi9cbiAgICAgICAgICAgIGNvbG9yOiAnd2hpdGUnLFxuICAgICAgICAgICAgLyoqIOaPj+i+ueminOiJsiAqL1xuICAgICAgICAgICAgYm9yZGVyQ29sb3I6IG51bGwsXG4gICAgICAgICAgICAvKiog5Y+Y5o2iICovXG4gICAgICAgICAgICB0cmFuc2Zvcm06IG51bGxcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlvLnluZXmlbDmja7nsbvlnotcbiAgICAgICAgICogQHByaXZhdGUgQHJlYWRvbmx5XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfYnVsbGV0U2NyZWVuVHlwZSA9IHtcbiAgICAgICAgICAgIHRleHQ6ICdzdHJpbmcnLFxuICAgICAgICAgICAgY2FuRGlzY2FyZDogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgc3RhcnRUaW1lOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIGVuZFRpbWU6ICdudW1iZXInLFxuICAgICAgICAgICAgcmVuZGVyQ29kZTogJ3N0cmluZydcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKiBcbiAgICAgICAgICog6buY6K6k5by55bmV5qC35byP5pWw5o2u57G75Z6LIFxuICAgICAgICAgKiBAcHJpdmF0ZSBAcmVhZG9ubHlcbiAgICAgICAgICogKi9cbiAgICAgICAgY29uc3QgX2RlZmF1bHRTdHlsZVR5cGUgPSB7XG4gICAgICAgICAgICAvKiog5by55bmV5paH5pysICovXG4gICAgICAgICAgICB0ZXh0OiAnc3RyaW5nJyxcbiAgICAgICAgICAgIC8qKiDpmLTlvbHnmoTmqKHns4rnuqfliKvvvIww5Li65LiN5pi+56S66Zi05b2xICovXG4gICAgICAgICAgICBzaGFkb3dCbHVyOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIC8qKiDlrZfkvZPnspfnu4YgKi9cbiAgICAgICAgICAgIGZvbnRXZWlnaHQ6IFsnc3RyaW5nJywgJ251bWJlciddLFxuICAgICAgICAgICAgLyoqIOWtl+S9k+ezu+WIlyAqL1xuICAgICAgICAgICAgZm9udEZhbWlseTogJ3N0cmluZycsXG4gICAgICAgICAgICAvKiog5a2X5L2T5aSn5bCP77yI5Y2V5L2N77ya5YOP57Sg77yJICovXG4gICAgICAgICAgICBzaXplOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIC8qKiDlpJbmoYbpopzoibIgKi9cbiAgICAgICAgICAgIGJveENvbG9yOiBbJ3N0cmluZycsICdudWxsJ10sXG4gICAgICAgICAgICAvKiog5a2X5L2T6aKc6ImyICovXG4gICAgICAgICAgICBjb2xvcjogJ3N0cmluZycsXG4gICAgICAgICAgICAvKiog5o+P6L656aKc6ImyICovXG4gICAgICAgICAgICBib3JkZXJDb2xvcjogWydzdHJpbmcnLCAnbnVsbCddLFxuICAgICAgICAgICAgLyoqIOWPmOaNoiAqL1xuICAgICAgICAgICAgdHJhbnNmb3JtOiBbJ3N0cmluZycsICdudWxsJ11cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUg5a6a5LmJ77yI5LiA5Lqb6ICB5byP5rWP6KeI5Zmo5LiN5pSv5oyBIHJlcXVlc3RBbmltYXRpb25GcmFtZSDvvIlcbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZnVuIC0g5Zue6LCD5pa55rOVIFxuICAgICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAgICovXG4gICAgICAgIGxldCByZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gJ2Z1bmN0aW9uJykgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oUmVzb3VyY2VzLlJFUVVFU1RBTklNQVRJT05GUkFNRV9OT1RfU1VQUE9SVF9XQVJOKTtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IChmdW4pID0+IHdpbmRvdy5zZXRUaW1lb3V0KGZ1biwgMTcpOyAvLzYwZnBzXG4gICAgICAgIH1cblxuICAgICAgICBfb3B0aW9ucyA9IEhlbHBlci5zZXRWYWx1ZXMob3B0aW9ucywgX2RlZmF1bHRPcHRpb25zLCBfb3B0aW9uc1R5cGUpOyAvL+iuvue9rum7mOiupOWAvFxuICAgICAgICAvL+WIneWni+WMllxuICAgICAgICBsZXQgX2VsZW1lbnRTaXplID0ge1xuICAgICAgICAgICAgd2lkdGg6IGVsZW1lbnQuY2xpZW50V2lkdGggLyBfb3B0aW9ucy5zY2FsaW5nLFxuICAgICAgICAgICAgaGVpZ2h0OiBlbGVtZW50LmNsaWVudEhlaWdodCAvIF9vcHRpb25zLnNjYWxpbmdcbiAgICAgICAgfVxuICAgICAgICBsZXQgX29sZERldmljZVBpeGVsUmF0aW8gPSBIZWxwZXIuZ2V0RGV2aWNlUGl4ZWxSYXRpbygpO1xuICAgICAgICBsZXQgX29sZFNjYWxpbmcgPSBfb3B0aW9ucy5zY2FsaW5nO1xuICAgICAgICBsZXQgX29sZENsaWVudFdpZHRoID0gZWxlbWVudC5jbGllbnRXaWR0aDtcbiAgICAgICAgbGV0IF9vbGRDbGllbnRIZWlnaHQgPSBlbGVtZW50LmNsaWVudEhlaWdodDtcbiAgICAgICAgbGV0IF9vbGRPcGFjaXR5ID0gX29wdGlvbnMub3BhY2l0eTtcbiAgICAgICAgLy/muLLmn5Plmajlt6XljoJcbiAgICAgICAgbGV0IHJlbmRlcmVyc0ZhY3RvcnkgPSBuZXcgUmVuZGVyZXJzRmFjdG9yeShlbGVtZW50LCBfb3B0aW9ucywgX2VsZW1lbnRTaXplKTtcbiAgICAgICAgbGV0IF9yZW5kZXJlciA9IHJlbmRlcmVyc0ZhY3RvcnkuZ2V0U3BlY2lhbFJlbmRlcmVyKHJlbmRlck1vZGUpOyAvL+WunuS+i+WMlua4suafk+WZqFxuICAgICAgICBzZXRJbnRlcnZhbChzZXRTaXplLCAxMDApO1xuXG4gICAgICAgIC8v5YWs5YWx5Ye95pWwXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDorr7nva7miJbojrflj5blhajlsYDpgInpoblcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICoqL1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ29wdGlvbnMnLCB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gSGVscGVyLmNsb25lKF9vcHRpb25zKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgX29wdGlvbnMgPSBIZWxwZXIuc2V0VmFsdWVzKG9wdGlvbnMsIF9vcHRpb25zLCBfb3B0aW9uc1R5cGUsIGZhbHNlKTsgLy/orr7nva7pu5jorqTlgLxcbiAgICAgICAgICAgICAgICBpZiAoX29sZE9wYWNpdHkgIT0gX29wdGlvbnMub3BhY2l0eSkge1xuICAgICAgICAgICAgICAgICAgICBfb2xkT3BhY2l0eSA9IF9vcHRpb25zLm9wYWNpdHk7XG4gICAgICAgICAgICAgICAgICAgIF9yZW5kZXJlci5zZXRPcGFjaXR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5re75Yqg5by55bmV5Yiw5by55bmV5YiX6KGo44CCXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiDmt7vliqDlvLnluZXliLDlvLnluZXliJfooajjgILnlLHkuo7lvLnluZXlnKjlsY/luZXkuIrlh7rnjrDov4flkI7vvIzlvLnluZXlvJXmk47lsIbku47liJfooajkuK3lvbvlupXliKDpmaTmraTlvLnluZXjgILmiYDku6XvvIzlnKjmlLnlj5jmkq3mlL7ov5vluqbml7bvvIzlj6/og73pnIDopoHlhYhb5riF56m65by55bmV5YiX6KGoXXtAbGluayBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZSNjbGVhbkJ1bGxldFNjcmVlbkxpc3R977yM54S25ZCO6YeN5paw5Yqg6L295q2k5pKt5pS+6L+b5bqm5Lul5ZCO55qE5by55bmV44CCXG4gICAgICAgICAqIEBwYXJhbSB7b3BlbkJTRX5TcGVjaWFsQnVsbGV0U2NyZWVufSBidWxsZXRTY3JlZW4gLSDljZXmnaHlvLnluZXmlbDmja7vvJrkuIDkuKoge0BsaW5rIG9wZW5CU0V+U3BlY2lhbEJ1bGxldFNjcmVlbn0g57uT5p6E44CCXG4gICAgICAgICAqIEB0aHJvd3Mge1R5cGVFcnJvcn0g5Lyg5YWl55qE5Y+C5pWw6ZSZ6K+v5pe25byV5Y+R6ZSZ6K+v44CC6K+35Y+C6ZiFIE1ETiBbVHlwZUVycm9yXXtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy96aC1DTi9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9UeXBlRXJyb3J9IOOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5hZGQgPSBmdW5jdGlvbiAoYnVsbGV0U2NyZWVuKSB7XG4gICAgICAgICAgICBfZGVmYXVsdEJ1bGxldFNjcmVlbi5zdGFydFRpbWUgPSBfb3B0aW9ucy5jbG9jaygpO1xuICAgICAgICAgICAgYnVsbGV0U2NyZWVuID0gSGVscGVyLnNldFZhbHVlcyhidWxsZXRTY3JlZW4sIF9kZWZhdWx0QnVsbGV0U2NyZWVuLCBfYnVsbGV0U2NyZWVuVHlwZSk7IC8v6K6+572u6buY6K6k5YC8XG5cbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbi5zdHlsZSA9IEhlbHBlci5jbG9uZShfZGVmYXVsdFN0eWxlKTtcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbi5zdHlsZS50ZXh0ID0gYnVsbGV0U2NyZWVuLnRleHQ7XG5cbiAgICAgICAgICAgIGxldCBuZXdOb2RlID0gbmV3IExpbmtlZExpc3Qubm9kZShidWxsZXRTY3JlZW4pO1xuICAgICAgICAgICAgX2J1bGxldFNjcmVlbkJ1ZmZlci5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgbGV0IGxhc3RCdWxsZXRTY3JlZW4gPSBub2RlLmVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbi5zdGFydFRpbWUgPiBsYXN0QnVsbGV0U2NyZWVuLnN0YXJ0VGltZSkgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkOiB7IGFkZFRvVXA6IHRydWUsIG5vZGU6IG5ld05vZGUgfSxcbiAgICAgICAgICAgICAgICAgICAgc3RvcDogdHJ1ZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgICAgIGlmIChuZXdOb2RlLmxpbmtlZExpc3QgPT09IG51bGwpIF9idWxsZXRTY3JlZW5CdWZmZXIucHVzaChuZXdOb2RlLCBmYWxzZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOW8gOWni+aSreaUvuW8ueW5leOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5wbGF5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCFfcGxheWluZykge1xuICAgICAgICAgICAgICAgIGlmICghX3N0YXJ0VGltZSlcbiAgICAgICAgICAgICAgICAgICAgX3N0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgIGlmIChfcGF1c2VUaW1lKVxuICAgICAgICAgICAgICAgICAgICBfc3RhcnRUaW1lICs9IF9vcHRpb25zLmNsb2NrKCkgLSBfcGF1c2VUaW1lO1xuICAgICAgICAgICAgICAgIF9sYXN0UmVmcmVzaFRpbWUgPSBudWxsO1xuICAgICAgICAgICAgICAgIF9wbGF5aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVmcmVzaCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaaguWBnOaSreaUvuW8ueW5leOAglxuICAgICAgICAgKiBAZGVzY3JpcHRpb24g5pqC5YGc5pKt5pS+5by55bmV44CC5pqC5YGc5pKt5pS+5by55bmV5piv5oyH5by55bmV5pKt5pS+5pqC5YGc77yM5omA5pyJ5pyq5Ye6546w55qE5by55bmV5bCG5YGc5q2i5Ye6546w77yM5bey5Ye6546w55qE5by55bmV5YGc5q2i6L+Q5Yqo77yM5YGc5q2i5raI5aSx44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnBhdXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKF9wbGF5aW5nKSB7XG4gICAgICAgICAgICAgICAgX3BhdXNlVGltZSA9IF9vcHRpb25zLmNsb2NrKCk7XG4gICAgICAgICAgICAgICAgX3BsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5riF56m65by55bmV57yT5Yay5Yy644CCXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiDmuIXnqbrlvLnluZXliJfooajvvIzkvYblsY/luZXkuIrlt7Lnu4/lh7rnjrDnmoTlvLnluZXkuI3kvJrooqvmuIXpmaTjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY2xlYW5CdWZmZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfYnVsbGV0U2NyZWVuQnVmZmVyLmNsZWFuKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa4heepuuWxj+W5leWGheWuueOAglxuICAgICAgICAgKiBAZGVzY3JpcHRpb24g5riF56m65bGP5bmV5YaF5a6544CC5riF56m65bGP5bmV5LiK5bey57uP5Ye6546w55qE5by55bmV77yM5LiN5YyF5ous5by55bmV5YiX6KGo5Lit55qE5by55bmV44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmNsZWFuU2NyZWVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3JlYWxUaW1lQnVsbGV0U2NyZWVucy5jbGVhbigpO1xuICAgICAgICAgICAgX3JlbmRlcmVyLmNsZWFuU2NyZWVuKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWBnOatouaSreaUvuW8ueW5leOAglxuICAgICAgICAgKiBAZGVzY3JpcHRpb24g5YGc5q2i5pKt5pS+5by55bmV44CC5YGc5q2i5pKt5pS+5by55bmV5piv5oyH5YGc5q2i5pKt5pS+5by55bmV77yM6buY6K6kW+aXtumXtOWfuuWHhu+8iG9wdGlvbnMuY2xvY2vvvIlde0BsaW5rIG9wZW5CU0V+QnVsbGV0U2NyZWVuU3R5bGV95b2S6Zu277yM5bm2W+a4heepuuW8ueW5leWIl+ihqF17QGxpbmsgb3BlbkJTRS5CdWxsZXRTY3JlZW5FbmdpbmUjY2xlYW5CdWxsZXRTY3JlZW5MaXN0feOAgVvmuIXnqbrlsY/luZXlhoXlrrlde0BsaW5rIG9wZW5CU0UuQnVsbGV0U2NyZWVuRW5naW5lI2NsZWFuU2NyZWVufeOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKF9wbGF5aW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXVzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jbGVhbkJ1ZmZlcigpO1xuICAgICAgICAgICAgdGhpcy5jbGVhblNjcmVlbigpO1xuICAgICAgICAgICAgX3BhdXNlVGltZSA9IDA7XG4gICAgICAgICAgICBfc3RhcnRUaW1lID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W5oiW6K6+572u5by55bmV5Y+v6KeB5oCn44CCXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3Zpc2liaWxpdHknLCB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVuZGVyZXIuZ2V0VmlzaWJpbGl0eSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZpc2liaWxpdHkpIHtcbiAgICAgICAgICAgICAgICBpZiAodmlzaWJpbGl0eSkgX3JlbmRlcmVyLnNob3coKTtcbiAgICAgICAgICAgICAgICBlbHNlIF9yZW5kZXJlci5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bmuLLmn5PmqKHlvI/jgIJcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAncmVuZGVyTW9kZScsIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZW5kZXJNb2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W5pKt5pS+54q25oCB44CCXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3BsYXlTdGF0ZScsIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfcGxheWluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICog6I635Y+W6LCD6K+V5L+h5oGv44CCXG4gICAgICAgICogQHByaXZhdGVcbiAgICAgICAgKi9cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdkZWJ1Z0luZm8nLCB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB0aW1lOiBfcGxheWluZyA/IF9vcHRpb25zLmNsb2NrKCkgOiBfcGF1c2VUaW1lLFxuICAgICAgICAgICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbkNvdW50OiBfcmVhbFRpbWVCdWxsZXRTY3JlZW5zLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyQnVsbGV0U2NyZWVuQ291bnQ6IF9idWxsZXRTY3JlZW5CdWZmZXIubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICBkZWxheTogX2RlbGF5LFxuICAgICAgICAgICAgICAgICAgICBkZWxheUJ1bGxldFNjcmVlbkNvdW50OiBfZGVsYXlCdWxsZXRTY3JlZW5Db3VudCxcbiAgICAgICAgICAgICAgICAgICAgZnBzOiBfcGxheWluZyA/IE1hdGguZmxvb3IoX3JlZnJlc2hSYXRlICogMTAwMCkgOiAwIC8v5bin6aKRXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy/lhoXpg6jlh73mlbBcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWIt+aWsOW8ueW5leWHveaVsFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcmVmcmVzaCgpIHtcbiAgICAgICAgICAgIGxldCBub3dUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICBpZiAoX2xhc3RSZWZyZXNoVGltZSAhPSBudWxsKVxuICAgICAgICAgICAgICAgIF9yZWZyZXNoUmF0ZSA9IDEgLyAobm93VGltZSAtIF9sYXN0UmVmcmVzaFRpbWUpO1xuICAgICAgICAgICAgX2xhc3RSZWZyZXNoVGltZSA9IG5vd1RpbWU7XG4gICAgICAgICAgICBhZGRSZWFsVGltZUJ1bGxldFNjcmVlbnMoKTtcbiAgICAgICAgICAgIG1vdmVSZWFsVGltZUJ1bGxldFNjcmVlbigpO1xuICAgICAgICAgICAgX3JlbmRlcmVyLmRyYXcoKTsgLy/nu5jliLblvLnluZVcbiAgICAgICAgICAgIGlmIChfcGxheWluZylcbiAgICAgICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVmcmVzaCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog56e75Yqo5by55bmV5Ye95pWwXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBtb3ZlUmVhbFRpbWVCdWxsZXRTY3JlZW4oKSB7XG4gICAgICAgICAgICBfcmVhbFRpbWVCdWxsZXRTY3JlZW5zLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcmVhbFRpbWVCdWxsZXRTY3JlZW4gPSBub2RlLmVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgbGV0IG5vd1RpbWUgPSBfb3B0aW9ucy5jbG9jaygpO1xuICAgICAgICAgICAgICAgIC8v5Yib5bu66Kej6YeK5Zmo5a+56LGhXG4gICAgICAgICAgICAgICAgbGV0IGludGVycHJldGVyID0gbmV3IEludGVycHJldGVyKHJlYWxUaW1lQnVsbGV0U2NyZWVuLnJlbmRlckNvZGUsIChpbnRlcnByZXRlciwgc2NvcGUpID0+XG4gICAgICAgICAgICAgICAgICAgIEludGVycHJldGVySW5pdChpbnRlcnByZXRlciwgc2NvcGUsIHJlYWxUaW1lQnVsbGV0U2NyZWVuKSk7XG4gICAgICAgICAgICAgICAgaWYgKHJlYWxUaW1lQnVsbGV0U2NyZWVuLmVuZFRpbWUgPiBub3dUaW1lKSBpbnRlcnByZXRlci5ydW4oKTtcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgX3JlbmRlcmVyLmRlbGV0ZShyZWFsVGltZUJ1bGxldFNjcmVlbik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHJlbW92ZTogdHJ1ZSB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa3u+WKoOW8ueW5leWIsOWunuaXtuW8ueW5leWIl+ihqFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gYWRkUmVhbFRpbWVCdWxsZXRTY3JlZW5zKCkge1xuICAgICAgICAgICAgaWYgKF9yZWFsVGltZUJ1bGxldFNjcmVlbnMubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgICAgIF9kZWxheSA9IDA7XG4gICAgICAgICAgICBsZXQgdGltZXMgPSBNYXRoLmZsb29yKF9yZWZyZXNoUmF0ZSAqIDIwMDApO1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIGxldCBub2RlID0gX2J1bGxldFNjcmVlbkJ1ZmZlci5wb3AoZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBpZiAobm9kZSA9PT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGxldCBidWxsZXRTY3JlZW4gPSBub2RlLmVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgbGV0IG5vd1RpbWUgPSBfb3B0aW9ucy5jbG9jaygpO1xuICAgICAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW4uc3RhcnRUaW1lID4gbm93VGltZSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGlmICghX29wdGlvbnMudGltZU91dERpc2NhcmQgfHwgIWJ1bGxldFNjcmVlbi5jYW5EaXNjYXJkIHx8IGJ1bGxldFNjcmVlbi5zdGFydFRpbWUgPiBub3dUaW1lIC0gTWF0aC5mbG9vcigxIC8gX3JlZnJlc2hSYXRlKSAqIDYwKSB7XG4gICAgICAgICAgICAgICAgICAgIF9yZW5kZXJlci5jcmVhdChidWxsZXRTY3JlZW4pOyAvL+WIm+W7uuW8ueW5leWFg+e0oFxuICAgICAgICAgICAgICAgICAgICBfcmVhbFRpbWVCdWxsZXRTY3JlZW5zLnB1c2gobm9kZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIF9kZWxheUJ1bGxldFNjcmVlbkNvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRpbWVzLS07XG4gICAgICAgICAgICB9IHdoaWxlIChfcmVhbFRpbWVCdWxsZXRTY3JlZW5zLmxlbmd0aCA9PT0gMCB8fCB0aW1lcyA+IDApO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOino+mHiuWZqOWKoOi9vVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAcGFyYW0geyp9IGludGVycHJldGVyIC0g6Kej6YeK5Zmo5a+56LGhXG4gICAgICAgICAqIEBwYXJhbSB7Kn0gc2NvcGUgLSBzY29wZVxuICAgICAgICAgKiBAcGFyYW0geyp9IGJ1bGxldFNjcmVlbiAtIOW8ueW5leWvueixoVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gSW50ZXJwcmV0ZXJJbml0KGludGVycHJldGVyLCBzY29wZSwgYnVsbGV0U2NyZWVuKSB7XG4gICAgICAgICAgICBpbnRlcnByZXRlci5zZXRQcm9wZXJ0eShzY29wZSwgJ3RpbWUnLCBfb3B0aW9ucy5jbG9jaygpKTtcbiAgICAgICAgICAgIGludGVycHJldGVyLnNldFByb3BlcnR5KHNjb3BlLCAnc3RhcnRUaW1lJywgYnVsbGV0U2NyZWVuLnN0YXJ0VGltZSk7XG4gICAgICAgICAgICBpbnRlcnByZXRlci5zZXRQcm9wZXJ0eShzY29wZSwgJ2VuZFRpbWUnLCBidWxsZXRTY3JlZW4uZW5kVGltZSk7XG4gICAgICAgICAgICBpbnRlcnByZXRlci5zZXRQcm9wZXJ0eShzY29wZSwgJ2VsZW1lbnRXaWR0aCcsIF9lbGVtZW50U2l6ZS53aWR0aCk7XG4gICAgICAgICAgICBpbnRlcnByZXRlci5zZXRQcm9wZXJ0eShzY29wZSwgJ2VsZW1lbnRIZWlnaHQnLCBfZWxlbWVudFNpemUuaGVpZ2h0KTtcbiAgICAgICAgICAgIGludGVycHJldGVyLnNldFByb3BlcnR5KHNjb3BlLCAnc2NhbGluZycsIGRldmljZVBpeGVsUmF0aW8gKiBvcHRpb25zLnNjYWxpbmcpO1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXIuc2V0UHJvcGVydHkoc2NvcGUsICdzZXRTdHlsZScsIGludGVycHJldGVyLmNyZWF0ZU5hdGl2ZUZ1bmN0aW9uKChvYmopID0+IHNldFN0eWxlKG9iai5wcm9wZXJ0aWVzLCBidWxsZXRTY3JlZW4pKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog6K6+572u5by55bmV5qC35byPXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEBwYXJhbSB7Kn0gc3R5bGUgLSDlvLnluZXmoLflvI9cbiAgICAgICAgICogQHBhcmFtIHsqfSBidWxsZXRTY3JlZW4gLSDlvLnluZXlr7nosaFcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHNldFN0eWxlKHN0eWxlLCBidWxsZXRTY3JlZW4pIHtcbiAgICAgICAgICAgIGlmIChIZWxwZXIuaXNFbXB0eShzdHlsZSkgfHwgc3R5bGUgPT09IHt9KSByZXR1cm47XG4gICAgICAgICAgICBsZXQgb2xkU3R5bGUgPSBidWxsZXRTY3JlZW4uc3R5bGU7XG4gICAgICAgICAgICBidWxsZXRTY3JlZW4uc3R5bGUgPSBIZWxwZXIuc2V0VmFsdWVzKHN0eWxlLCBidWxsZXRTY3JlZW4uc3R5bGUsIF9kZWZhdWx0U3R5bGVUeXBlLCB0cnVlKTtcbiAgICAgICAgICAgIGlmIChIZWxwZXIuc2hhbGxvd0VxdWFsKG9sZFN0eWxlLCBidWxsZXRTY3JlZW4uc3R5bGUpKSByZXR1cm47XG4gICAgICAgICAgICBfcmVuZGVyZXIucmVmcmVzaChidWxsZXRTY3JlZW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiuvue9ruWwuuWvuFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc2V0U2l6ZSgpIHtcbiAgICAgICAgICAgIGxldCBkZXZpY2VQaXhlbFJhdGlvID0gSGVscGVyLmdldERldmljZVBpeGVsUmF0aW8oKTtcbiAgICAgICAgICAgIGlmIChfb2xkRGV2aWNlUGl4ZWxSYXRpbyAhPSBkZXZpY2VQaXhlbFJhdGlvIHx8XG4gICAgICAgICAgICAgICAgX29sZENsaWVudFdpZHRoICE9IGVsZW1lbnQuY2xpZW50V2lkdGggfHxcbiAgICAgICAgICAgICAgICBfb2xkQ2xpZW50SGVpZ2h0ICE9IGVsZW1lbnQuY2xpZW50SGVpZ2h0IHx8XG4gICAgICAgICAgICAgICAgX29sZFNjYWxpbmcgIT0gX29wdGlvbnMuc2NhbGluZykge1xuICAgICAgICAgICAgICAgIF9vbGRTY2FsaW5nID0gX29wdGlvbnMuc2NhbGluZztcbiAgICAgICAgICAgICAgICBfZWxlbWVudFNpemUud2lkdGggPSBlbGVtZW50LmNsaWVudFdpZHRoIC8gX29wdGlvbnMuc2NhbGluZztcbiAgICAgICAgICAgICAgICBfZWxlbWVudFNpemUuaGVpZ2h0ID0gZWxlbWVudC5jbGllbnRIZWlnaHQgLyBfb3B0aW9ucy5zY2FsaW5nO1xuICAgICAgICAgICAgICAgIF9vbGRDbGllbnRXaWR0aCA9IGVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgICAgICAgICAgX29sZENsaWVudEhlaWdodCA9IGVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgICAgIF9vbGREZXZpY2VQaXhlbFJhdGlvID0gZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICAgICAgICBfcmVuZGVyZXIuc2V0U2l6ZSgpO1xuICAgICAgICAgICAgICAgIGlmICghX3BsYXlpbmcpIF9yZW5kZXJlci5kcmF3KCk7IC8v6Z2e5pKt5pS+54q25oCB5YiZ6YeN57uYXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL0lFIEVkZ2Ug5rWP6KeI5Zmo5LiN5pSv5oyBICVjXG4gICAgICAgIGlmICghIXdpbmRvdy5BY3RpdmVYT2JqZWN0IHx8IFwiQWN0aXZlWE9iamVjdFwiIGluIHdpbmRvdyB8fCBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJUcmlkZW50XCIpID4gLTEgfHxcbiAgICAgICAgICAgIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUVcIikgPiAtMSB8fCBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJFZGdlXCIpID4gLTEpIGNvbnNvbGUuaW5mbyhcbiAgICAgICAgICAgICAgICBSZXNvdXJjZXMuTE9BREVEX0lORk9fSUUuZmlsbERhdGEoYnVpbGQpXG4gICAgICAgICAgICApO1xuICAgICAgICAvL090aGVyXG4gICAgICAgIGVsc2UgY29uc29sZS5pbmZvKFxuICAgICAgICAgICAgUmVzb3VyY2VzLkxPQURFRF9JTkZPLmZpbGxEYXRhKGJ1aWxkKSxcbiAgICAgICAgICAgICdmb250LXdlaWdodDpib2xkOyBjb2xvcjojMDA5OUZGOycsICcnLCAnZm9udC1zdHlsZTppdGFsaWM7JywgJydcbiAgICAgICAgKTtcbiAgICB9XG59Il0sImZpbGUiOiJlbmdpbmVzL3NwZWNpYWxFbmdpbmUuanMifQ==
