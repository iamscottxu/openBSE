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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZXMvZ2VuZXJhbEVuZ2luZS5qcyJdLCJuYW1lcyI6WyJHZW5lcmFsRW5naW5lIiwiZWxlbWVudCIsIm9wdGlvbnMiLCJyZW5kZXJNb2RlIiwiX3N0YXJ0VGltZSIsIl9wYXVzZVRpbWUiLCJfYnVsbGV0U2NyZWVuQnVmZmVyIiwiTGlua2VkTGlzdCIsIl9yZWFsVGltZUJ1bGxldFNjcmVlbnMiLCJfZGVsYXlCdWxsZXRTY3JlZW5Db3VudCIsIl9kZWxheSIsIl9wbGF5aW5nIiwiX3JlZnJlc2hSYXRlIiwiX2xhc3RSZWZyZXNoVGltZSIsIl9vcHRpb25zIiwiX2RlZmF1bHRPcHRpb25zIiwidmVydGljYWxJbnRlcnZhbCIsInBsYXlTcGVlZCIsImNsb2NrIiwidGltZSIsIkRhdGUiLCJnZXRUaW1lIiwic2NhbGluZyIsInRpbWVPdXREaXNjYXJkIiwiaGlkZGVuVHlwZXMiLCJvcGFjaXR5IiwiY3Vyc29yT25Nb3VzZU92ZXIiLCJkZWZhdWx0U3R5bGUiLCJzaGFkb3dCbHVyIiwiZm9udFdlaWdodCIsImZvbnRGYW1pbHkiLCJzaXplIiwiYm94Q29sb3IiLCJjb2xvciIsImJvcmRlckNvbG9yIiwic3BlZWQiLCJyZXNpZGVuY2VUaW1lIiwiX29wdGlvbnNUeXBlIiwiX2RlZmF1bHRCdWxsZXRTY3JlZW4iLCJ0ZXh0IiwiY2FuRGlzY2FyZCIsInN0YXJ0VGltZSIsInR5cGUiLCJHZW5lcmFsVHlwZSIsInJpZ2h0VG9MZWZ0IiwibGF5ZXIiLCJfYnVsbGV0U2NyZWVuVHlwZSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIndpbmRvdyIsImNvbnNvbGUiLCJ3YXJuIiwiUmVzb3VyY2VzIiwiUkVRVUVTVEFOSU1BVElPTkZSQU1FX05PVF9TVVBQT1JUX1dBUk4iLCJmdW4iLCJzZXRUaW1lb3V0IiwiSGVscGVyIiwic2V0VmFsdWVzIiwiX2V2ZW50IiwiRXZlbnQiLCJhZGQiLCJiaW5kIiwidW5iaW5kIiwiX2VsZW1lbnRTaXplIiwid2lkdGgiLCJjbGllbnRXaWR0aCIsImhlaWdodCIsImNsaWVudEhlaWdodCIsIl9vbGREZXZpY2VQaXhlbFJhdGlvIiwiZ2V0RGV2aWNlUGl4ZWxSYXRpbyIsIl9vbGRTY2FsaW5nIiwiX29sZENsaWVudFdpZHRoIiwiX29sZENsaWVudEhlaWdodCIsIl9vbGRIaWRkZW5UeXBlcyIsIl9vbGRPcGFjaXR5IiwicmVuZGVyZXJzRmFjdG9yeSIsIlJlbmRlcmVyc0ZhY3RvcnkiLCJidWxsZXRTY3JlZW5FdmVudFRyaWdnZXIiLCJfcmVuZGVyZXIiLCJnZXRHZW5lcmFsUmVuZGVyZXIiLCJzZXRJbnRlcnZhbCIsInNldFNpemUiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldCIsImNsb25lIiwic2V0IiwiZHJhdyIsInNldE9wYWNpdHkiLCJidWxsZXRTY3JlZW4iLCJsZWZ0VG9SaWdodCIsInRvcCIsImJvdHRvbSIsIlR5cGVFcnJvciIsIlBBUkFNRVRFUlNfVFlQRV9FUlJPUiIsImNoZWNrVHlwZXMiLCJzdHlsZSIsIm5ld05vZGUiLCJub2RlIiwiZm9yRWFjaCIsImxhc3RCdWxsZXRTY3JlZW4iLCJhZGRUb1VwIiwic3RvcCIsImxpbmtlZExpc3QiLCJwdXNoIiwicGxheSIsInJlZnJlc2giLCJwbGF5QWxsQnVsbGV0U2NyZWVucyIsInBhdXNlIiwiY2xlYW5CdWZmZXIiLCJjbGVhbiIsImNsZWFuU2NyZWVuIiwicmVuZGVyZXIiLCJnZXRWaXNpYmlsaXR5IiwidmlzaWJpbGl0eSIsInNob3ciLCJoaWRlIiwicmVhbFRpbWVCdWxsZXRTY3JlZW5Db3VudCIsImxlbmd0aCIsImJ1ZmZlckJ1bGxldFNjcmVlbkNvdW50IiwiZGVsYXkiLCJkZWxheUJ1bGxldFNjcmVlbkNvdW50IiwiZnBzIiwiTWF0aCIsImZsb29yIiwibmFtZSIsInJlYWxUaW1lQnVsbGV0U2NyZWVuIiwiZSIsInBhZ2VYIiwiZG9jIiwiZG9jdW1lbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJib2R5IiwiY2xpZW50WCIsInNjcm9sbExlZnQiLCJjbGllbnRMZWZ0IiwicGFnZVkiLCJjbGllbnRZIiwic2Nyb2xsVG9wIiwiY2xpZW50VG9wIiwidHJpZ2dlciIsImdldEJ1bGxldFNjcmVlbiIsInNldEJ1bGxldFNjcmVlbiIsInJlZHJhdyIsImJ1bGxldFNjcmVlblR5cGUiLCJyZUNyZWF0QW5kZ2V0V2lkdGgiLCJnZXRQbGF5U3RhdGUiLCJzZXRQbGF5U3RhdGUiLCJzY3JlZW5YIiwic2NyZWVuWSIsIm5vd1RpbWUiLCJhZGRSZWFsVGltZUJ1bGxldFNjcmVlbnMiLCJtb3ZlUmVhbFRpbWVCdWxsZXRTY3JlZW4iLCJ4IiwicmVtb3ZlIiwiZW5kVGltZSIsInRpbWVzIiwicG9wIiwiZ2V0UmVhbFRpbWVCdWxsZXRTY3JlZW4iLCJjcmVhdEFuZGdldFdpZHRoIiwicm91bmQiLCJ5IiwibmV4dHJlYWxUaW1lQnVsbGV0U2NyZWVuIiwic2V0QWN0dWFsWSIsInJlYWxUaW1lQnVsbGV0U2NyZWVuV2lkdGhUaW1lIiwibmV4dHJlYWxUaW1lQnVsbGV0U2NyZWVuV2lkdGhUaW1lIiwiYWN0dWFsWSIsImRldmljZVBpeGVsUmF0aW8iLCJBY3RpdmVYT2JqZWN0IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwiaW5kZXhPZiIsImluZm8iLCJMT0FERURfSU5GT19JRSIsImZpbGxEYXRhIiwiYnVpbGQiLCJMT0FERURfSU5GTyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7SUFXcUJBLGE7QUFDakI7Ozs7OztBQU1BLHVCQUFZQyxPQUFaLEVBQXFCQyxPQUFyQixFQUFxRDtBQUFBLE1BQXZCQyxVQUF1Qix1RUFBVixRQUFVOztBQUFBOztBQUVqRDs7OztBQUlBLE1BQUlDLFVBQUo7QUFDQTs7Ozs7O0FBSUEsTUFBSUMsVUFBVSxHQUFHLENBQWpCO0FBQ0E7Ozs7O0FBSUEsTUFBSUMsbUJBQW1CLEdBQUcsSUFBSUMsc0JBQUosRUFBMUI7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QXBCLENBQTRCLE1BQTVCLElBQXNDLENBQUMsQ0FEdkYsRUFDMEZ6SCxPQUFPLENBQUMwSCxJQUFSLENBQ2xGeEgsc0JBQVV5SCxjQUFWLENBQXlCQyxRQUF6QixDQUFrQ0MsS0FBbEMsQ0FEa0YsRUFEMUYsS0FLSzdILE9BQU8sQ0FBQzBILElBQVIsQ0FDRHhILHNCQUFVNEgsV0FBVixDQUFzQkYsUUFBdEIsQ0FBK0JDLEtBQS9CLENBREMsRUFFRCxrQ0FGQyxFQUVtQyxFQUZuQyxFQUV1QyxvQkFGdkMsRUFFNkQsRUFGN0Q7QUFJUixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExpbmtlZExpc3QgZnJvbSAnLi4vbGliL2xpbmtlZExpc3QnXG5pbXBvcnQgRXZlbnQgZnJvbSAnLi4vbGliL2V2ZW50J1xuaW1wb3J0IFJlbmRlcmVyc0ZhY3RvcnkgZnJvbSAnLi4vcmVuZGVyZXJzL3JlbmRlcmVyc0ZhY3RvcnknXG5pbXBvcnQgR2VuZXJhbFR5cGUgZnJvbSAnLi9nZW5lcmFsVHlwZSdcbmltcG9ydCBIZWxwZXIgZnJvbSAnLi4vbGliL2hlbHBlcidcbmltcG9ydCBSZXNvdXJjZXMgZnJvbSAnLi4vbGliL3Jlc291cmNlcydcbmltcG9ydCAqIGFzIGJ1aWxkIGZyb20gJy4uL2J1aWxkLmpzb24nXG5cbi8qKiBcbiAqIOW8ueW5leW8leaTjuWvueixoeexuyBcbiAqIEBhbGlhcyBvcGVuQlNFLkdlbmVyYWxFbmdpbmVcbiAqIEBwcm9wZXJ0eSB7b3BlbkJTRX5PcHRpb25zfSBvcHRpb25zIC0g6K6+572u5oiW6I635Y+W5YWo5bGA6YCJ6aG544CCXG4gKiBAcHJvcGVydHkge2Jvb2x9IHZpc2liaWxpdHkgLSDojrflj5bmiJborr7nva7lvLnluZXlj6/op4HmgKfjgIJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSByZW5kZXJNb2RlIC0g6I635Y+W5riy5p+T5qih5byP44CC5Y+W5YC85Li64oCcY2FudmFz4oCd44CB4oCcY3NzM+KAneOAgeKAnHdlYmds4oCd5oiW4oCcc3Zn4oCd44CCXG4gKiBAcHJvcGVydHkge2Jvb2x9IHBsYXlTdGF0ZSAtIOiOt+WPluaSreaUvueKtuaAgeOAgnRydWXvvJrmraPlnKjmkq3mlL7vvJtmYWxzZe+8muW3suaaguWBnC/lgZzmraLmkq3mlL7jgIJcbiAqIEBwcm9wZXJ0eSB7b3BlbkJTRX5EZWJ1Z0luZm99IGRlYnVnSW5mbyAtIOiOt+WPluiwg+ivleS/oeaBr+OAglxuICogQHRocm93cyB7b3BlbkJTRS5Ccm93c2VyTm90U3VwcG9ydEVycm9yfSDmtY/op4jlmajkuI3mlK/mjIHnibnlrprmuLLmn5PmqKHlvI/ml7blvJXlj5HplJnor6/jgIJcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn0g5Lyg5YWl55qE5Y+C5pWw6ZSZ6K+v5pe25byV5Y+R6ZSZ6K+v44CC6K+35Y+C6ZiFIE1ETiBbVHlwZUVycm9yXXtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy96aC1DTi9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9UeXBlRXJyb3J9IOOAglxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHZW5lcmFsRW5naW5lIHtcbiAgICAvKipcbiAgICAgKiDliJvlu7rkuIDkuKrlvLnluZXlvJXmk47lr7nosaHjgIJcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgLSDopoHliqDovb3lvLnluZXnmoTlhYPntKDvvJrmnInlhbMgRWxlbWVudCDmjqXlj6PnmoTkv6Hmga/or7flj4LpmIVNRE4gW0VsZW1lbnRde0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3poLUNOL2RvY3MvV2ViL0FQSS9FbGVtZW50fSDjgIJcbiAgICAgKiBAcGFyYW0ge29wZW5CU0V+T3B0aW9uc30gW19vcHRpb25zXSAtIOWFqOWxgOmAiemhue+8muS4gOS4qiB7QGxpbmsgb3BlbkJTRX5PcHRpb25zfSDnu5PmnoTjgIJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3JlbmRlck1vZGU9XCJjYW52YXNcIl0gLSDmuLLmn5PmqKHlvI/vvJrpu5jorqTkuLrigJxjYW52YXPigJ0sIOKAnOWPr+mAiWNzczPigJ3vvIwg4oCcd2ViZ2zigJ3lkozigJxzdmfigJ3jgILkuIDoiKzlu7rorq7kvb/nlKjigJxjYW52YXPigJ3vvIjnibnliKvmmK8gRmlyZUZveCDmtY/op4jlmaggQ1NTMyDmuLLmn5PmlYjnjofovoPkvY7vvInjgILlnKjkuIDkupvniYjmnKzovoPogIHnmoTmtY/op4jlmajkuK3igJx3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpb+KAneWPmOmHj+S4jeiiq+aUr+aMgeaIluaUr+aMgeS4jeWujOaVtO+8jOi/meS8muWvvOiHtOWcqOmrmERQSeWSjOmhtemdouiiq+e8qeaUvueahOaDheWGteS4i+KAnGNhbnZhc+KAneWSjOKAnHdlYmds4oCd5riy5p+T5qih5byP5by55bmV5pi+56S65LiN5q2j5bi455qE5oOF5Ya177yI5by55bmV5qih57OK77yJ77yM5q2k5pe25bu66K6u5L2/55So4oCcY3NzM+KAnea4suafk+aooeW8j+OAglxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMsIHJlbmRlck1vZGUgPSAnY2FudmFzJykge1xuICAgICAgICAvL+WPmOmHj+WIneWni+WMllxuICAgICAgICAvKipcbiAgICAgICAgICog5byA5aeL5pe26Ze0XG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgX3N0YXJ0VGltZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaaguWBnOaXtumXtFxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9wYXVzZVRpbWUgPSAwO1xuICAgICAgICAvKipcbiAgICAgICAgICog5by55bmV57yT5Yay5Yy6XG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtMaW5rZWRMaXN0fVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9idWxsZXRTY3JlZW5CdWZmZXIgPSBuZXcgTGlua2VkTGlzdCgpO1xuICAgICAgICAvKipcbiAgICAgICAgICog5a6e5pe25by55bmV5YiX6KGoXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtMaW5rZWRMaXN0fVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9yZWFsVGltZUJ1bGxldFNjcmVlbnMgPSBuZXcgTGlua2VkTGlzdCgpO1xuICAgICAgICAvKipcbiAgICAgICAgICog5bu26L+f5by55bmV5oC75pWwXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgX2RlbGF5QnVsbGV0U2NyZWVuQ291bnQgPSAwO1xuICAgICAgICAvKipcbiAgICAgICAgICog5bu26L+f77yI5Y2V5L2N77ya5q+r56eS77yJXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgX2RlbGF5ID0gMDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaSreaUvuagh+W/l1xuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgICAgICovXG4gICAgICAgIGxldCBfcGxheWluZztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWIt+aWsOmikeeOh1xuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9yZWZyZXNoUmF0ZSA9IDAuMDY7IC8v5Yid5aeL5Yi35paw6aKR546HXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDkuIrkuIDmrKHliLfmlrDml7bpl7RcbiAgICAgICAgICogQHByaXZhdGUgQHR5cGUge251bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIGxldCBfbGFzdFJlZnJlc2hUaW1lO1xuICAgICAgICAvKipcbiAgICAgICAgICog5YWo5bGA6YCJ6aG5XG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtvcGVuQlNFfmdlbmVyYWxPcHRpb25zfVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9vcHRpb25zO1xuICAgICAgICAvKipcbiAgICAgICAgICog6buY6K6k5YWo5bGA5Y+Y6YePXG4gICAgICAgICAqIEBwcml2YXRlIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX2RlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICAgICAgLyoqIOWeguebtOmXtOi3nSAqL1xuICAgICAgICAgICAgdmVydGljYWxJbnRlcnZhbDogOCxcbiAgICAgICAgICAgIC8qKiDmkq3mlL7pgJ/luqYo5YCN5pWwKSAqL1xuICAgICAgICAgICAgcGxheVNwZWVkOiAxLFxuICAgICAgICAgICAgLyoqIOaXtumXtOWfuuWHhiAqL1xuICAgICAgICAgICAgY2xvY2s6IHRpbWUgPT4gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBfc3RhcnRUaW1lLFxuICAgICAgICAgICAgLyoqIOe8qeaUvuavlOS+iyAqL1xuICAgICAgICAgICAgc2NhbGluZzogMSxcbiAgICAgICAgICAgIC8qKiDotoXml7bkuKLlvIMgKi9cbiAgICAgICAgICAgIHRpbWVPdXREaXNjYXJkOiB0cnVlLFxuICAgICAgICAgICAgLyoqIOimgemakOiXj+eahOW8ueW5leexu+WeiyAqL1xuICAgICAgICAgICAgaGlkZGVuVHlwZXM6IDAsXG4gICAgICAgICAgICAvKiog5by55bmV5LiN6YCP5piO5bqmICovXG4gICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgLyoqIOm8oOagh+e7j+i/h+agt+W8jyAqL1xuICAgICAgICAgICAgY3Vyc29yT25Nb3VzZU92ZXI6ICdwb2ludGVyJyxcbiAgICAgICAgICAgIC8qKiDpu5jorqTlvLnluZXmoLflvI8gKi9cbiAgICAgICAgICAgIGRlZmF1bHRTdHlsZToge1xuICAgICAgICAgICAgICAgIC8qKiDpmLTlvbHnmoTmqKHns4rnuqfliKvvvIww5Li65LiN5pi+56S66Zi05b2xICovXG4gICAgICAgICAgICAgICAgc2hhZG93Qmx1cjogMixcbiAgICAgICAgICAgICAgICAvKiog5a2X5L2T57KX57uGICovXG4gICAgICAgICAgICAgICAgZm9udFdlaWdodDogJzYwMCcsXG4gICAgICAgICAgICAgICAgLyoqIOWtl+S9k+ezu+WIlyAqL1xuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICdzYW5zLXNlcmlmJyxcbiAgICAgICAgICAgICAgICAvKiog5a2X5L2T5aSn5bCP77yI5Y2V5L2N77ya5YOP57Sg77yJICovXG4gICAgICAgICAgICAgICAgc2l6ZTogMjUsXG4gICAgICAgICAgICAgICAgLyoqIOWkluahhuminOiJsiAqL1xuICAgICAgICAgICAgICAgIGJveENvbG9yOiBudWxsLFxuICAgICAgICAgICAgICAgIC8qKiDlrZfkvZPpopzoibIgKi9cbiAgICAgICAgICAgICAgICBjb2xvcjogJ3doaXRlJyxcbiAgICAgICAgICAgICAgICAvKiog5o+P6L656aKc6ImyICovXG4gICAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6IG51bGwsXG4gICAgICAgICAgICAgICAgLyoqIOW8ueW5lemAn+W6pu+8iOWNleS9je+8muWDj+e0oC/mr6vnp5LvvIkg5LuF5rWB5by55bmV57G75Z6L5pyJ5pWIICovXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDAuMTUsXG4gICAgICAgICAgICAgICAgLyoqIOW8ueW5leWBnOeVmeaXtumXtCDku4Xlm7rlrprlvLnluZXnsbvlnovmnInmlYggKi9cbiAgICAgICAgICAgICAgICByZXNpZGVuY2VUaW1lOiA1MDAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5YWo5bGA6YCJ6aG557G75Z6LXG4gICAgICAgICAqIEBwcml2YXRlIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX29wdGlvbnNUeXBlID0ge1xuICAgICAgICAgICAgdmVydGljYWxJbnRlcnZhbDogJ251bWJlcicsXG4gICAgICAgICAgICBwbGF5U3BlZWQ6ICdudW1iZXInLFxuICAgICAgICAgICAgY2xvY2s6ICdmdW5jdGlvbicsXG4gICAgICAgICAgICBzY2FsaW5nOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIHRpbWVPdXREaXNjYXJkOiAnYm9vbGVhbicsXG4gICAgICAgICAgICBoaWRkZW5UeXBlczogJ251bWJlcicsXG4gICAgICAgICAgICBvcGFjaXR5OiAnbnVtYmVyJyxcbiAgICAgICAgICAgIGN1cnNvck9uTW91c2VPdmVyOiAnc3RyaW5nJyxcbiAgICAgICAgICAgIGRlZmF1bHRTdHlsZToge1xuICAgICAgICAgICAgICAgIHNoYWRvd0JsdXI6ICdudW1iZXInLFxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IFsnc3RyaW5nJywgJ251bWJlciddLFxuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgIHNpemU6ICdudW1iZXInLFxuICAgICAgICAgICAgICAgIGJveENvbG9yOiBbJ3N0cmluZycsICdudWxsJ10sXG4gICAgICAgICAgICAgICAgY29sb3I6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiBbJ3N0cmluZycsICdudWxsJ10sXG4gICAgICAgICAgICAgICAgc3BlZWQ6ICdudW1iZXInLFxuICAgICAgICAgICAgICAgIHJlc2lkZW5jZVRpbWU6ICdudW1iZXInXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog6buY6K6k5by55bmV5pWw5o2uXG4gICAgICAgICAqIEBwcml2YXRlIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX2RlZmF1bHRCdWxsZXRTY3JlZW4gPSB7XG4gICAgICAgICAgICAvKiog5by55bmV5paH5pysICovXG4gICAgICAgICAgICB0ZXh0OiBudWxsLFxuICAgICAgICAgICAgLyoqIOaYr+WQpuWFgeiuuOS4ouW8gyAqL1xuICAgICAgICAgICAgY2FuRGlzY2FyZDogdHJ1ZSxcbiAgICAgICAgICAgIC8qKiDlvLnluZXov5vlhaXml7bpl7QgKi9cbiAgICAgICAgICAgIHN0YXJ0VGltZTogbnVsbCxcbiAgICAgICAgICAgIC8qKiDlvLnluZXnsbvlnosgKi9cbiAgICAgICAgICAgIHR5cGU6IEdlbmVyYWxUeXBlLnJpZ2h0VG9MZWZ0LFxuICAgICAgICAgICAgLyoqIOW8ueW5leWxgue6p++8iOi2iuWkp+i2iuWJje+8iSAqL1xuICAgICAgICAgICAgbGF5ZXI6IDBcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlvLnluZXmlbDmja7nsbvlnotcbiAgICAgICAgICogQHByaXZhdGUgQHJlYWRvbmx5XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfYnVsbGV0U2NyZWVuVHlwZSA9IHtcbiAgICAgICAgICAgIHRleHQ6ICdzdHJpbmcnLFxuICAgICAgICAgICAgY2FuRGlzY2FyZDogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgc3RhcnRUaW1lOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgICAgbGF5ZXI6ICdudW1iZXInXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogcmVxdWVzdEFuaW1hdGlvbkZyYW1lIOWumuS5ie+8iOS4gOS6m+iAgeW8j+a1j+iniOWZqOS4jeaUr+aMgSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUg77yJXG4gICAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZ1biAtIOWbnuiwg+aWueazlSBcbiAgICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICBsZXQgcmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09ICdmdW5jdGlvbicpIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFJlc291cmNlcy5SRVFVRVNUQU5JTUFUSU9ORlJBTUVfTk9UX1NVUFBPUlRfV0FSTik7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSAoZnVuKSA9PiB3aW5kb3cuc2V0VGltZW91dChmdW4sIDE3KTsgLy82MGZwc1xuICAgICAgICB9XG5cbiAgICAgICAgX29wdGlvbnMgPSBIZWxwZXIuc2V0VmFsdWVzKG9wdGlvbnMsIF9kZWZhdWx0T3B0aW9ucywgX29wdGlvbnNUeXBlKTsgLy/orr7nva7pu5jorqTlgLxcblxuICAgICAgICAvL+S6i+S7tuWIneWni+WMllxuICAgICAgICBsZXQgX2V2ZW50ID0gbmV3IEV2ZW50KCk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlvLnluZXljZXlh7vkuovku7bjgILlvZPljZXlh7vlvLnluZXml7bop6blj5HjgIJcbiAgICAgICAgICogQGV2ZW50IG9wZW5CU0UuR2VuZXJhbEVuZ2luZSNjbGlja1xuICAgICAgICAgKiBAcHJvcGVydHkge29wZW5CU0V+R2VuZXJhbEV2ZW50fSBlIC0g5by55bmV5LqL5Lu257uT5p6EXG4gICAgICAgICAqL1xuICAgICAgICBfZXZlbnQuYWRkKCdjbGljaycpO1xuICAgICAgICAvKipcbiAgICAgICAgICog5by55bmV5LiK5LiL5paH6I+c5Y2V5LqL5Lu244CC5b2T6Kem5Y+R5by55bmV5LiK5LiL5paH6I+c5Y2V5pe26Kem5Y+R44CCXG4gICAgICAgICAqIEBldmVudCBvcGVuQlNFLkdlbmVyYWxFbmdpbmUjY29udGV4dG1lbnVcbiAgICAgICAgICogQHByb3BlcnR5IHtvcGVuQlNFfkdlbmVyYWxCdWxsZXRTY3JlZW5FdmVudH0gZSAtIOW8ueW5leS6i+S7tue7k+aehFxuICAgICAgICAgKi9cbiAgICAgICAgX2V2ZW50LmFkZCgnY29udGV4dG1lbnUnKTtcbiAgICAgICAgLyoqXG4gICAgICAgICog5by55bmV6byg5qCH56a75byA5LqL5Lu244CC5b2T6byg5qCH56a75byA5by55bmV5pe26Kem5Y+R44CCXG4gICAgICAgICogQGV2ZW50IG9wZW5CU0UuR2VuZXJhbEVuZ2luZSNtb3VzZWxlYXZlXG4gICAgICAgICogQHByb3BlcnR5IHtvcGVuQlNFfkdlbmVyYWxCdWxsZXRTY3JlZW5FdmVudH0gZSAtIOW8ueW5leS6i+S7tue7k+aehFxuICAgICAgICAqL1xuICAgICAgICBfZXZlbnQuYWRkKCdtb3VzZWxlYXZlJyk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlvLnluZXpvKDmoIfov5vlhaXkuovku7bjgILlvZPpvKDmoIfov5vlhaXlvLnluZXml7bop6blj5HjgIJcbiAgICAgICAgICogQGV2ZW50IG9wZW5CU0UuR2VuZXJhbEVuZ2luZSNtb3VzZWVudGVyXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7b3BlbkJTRX5HZW5lcmFsQnVsbGV0U2NyZWVuRXZlbnR9IGUgLSDlvLnluZXkuovku7bnu5PmnoRcbiAgICAgICAgICovXG4gICAgICAgIF9ldmVudC5hZGQoJ21vdXNlZW50ZXInKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOe7keWumuS6i+S7tuWkhOeQhueoi+W6j1xuICAgICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAgICogQGRlc2NyaXB0aW9uIOe7keWumuS6i+S7tuWkhOeQhueoi+W6j+OAguW9k+S6i+S7tuWkhOeQhueoi+W6j+i/lOWbnuWAvOS4uiBmYWxzZSDml7blgZzmraLlhpLms6HjgIJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSDkuovku7blkI3np7BcbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZnVuIC0g5LqL5Lu25aSE55CG56iL5bqPXG4gICAgICAgICAqIEBsaXN0ZW5zIG9wZW5CU0UuR2VuZXJhbEVuZ2luZSNjbGlja1xuICAgICAgICAgKiBAbGlzdGVucyBvcGVuQlNFLkdlbmVyYWxFbmdpbmUjY29udGV4dG1lbnVcbiAgICAgICAgICogQGxpc3RlbnMgb3BlbkJTRS5HZW5lcmFsRW5naW5lI21vdXNlbGVhdmVcbiAgICAgICAgICogQGxpc3RlbnMgb3BlbkJTRS5HZW5lcmFsRW5naW5lI21vdXNlZW50ZXJcbiAgICAgICAgICogQHRocm93cyB7VHlwZUVycm9yfSDkvKDlhaXnmoTlj4LmlbDplJnor6/miJbkuovku7bkuI3lrZjlnKjml7blvJXlj5HplJnor6/jgILor7flj4LpmIUgTUROIFtUeXBlRXJyb3Jde0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3poLUNOL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1R5cGVFcnJvcn0g44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmJpbmQgPSBfZXZlbnQuYmluZDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOino+e7keS6i+S7tuWkhOeQhueoi+W6j++8iGZ1buS4uuepuuino+e7keaJgOacieS6i+S7tuWkhOeQhueoi+W6j++8iVxuICAgICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSDkuovku7blkI3np7BcbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZnVuIC0g5LqL5Lu25aSE55CG56iL5bqPXG4gICAgICAgICAqIEB0aHJvd3Mge1R5cGVFcnJvcn0g5Lyg5YWl55qE5Y+C5pWw6ZSZ6K+v5oiW5LqL5Lu25LiN5a2Y5Zyo5pe25byV5Y+R6ZSZ6K+v44CC6K+35Y+C6ZiFIE1ETiBbVHlwZUVycm9yXXtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy96aC1DTi9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9UeXBlRXJyb3J9IOOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy51bmJpbmQgPSBfZXZlbnQudW5iaW5kO1xuICAgICAgICAvL+WIneWni+WMllxuICAgICAgICBsZXQgX2VsZW1lbnRTaXplID0ge1xuICAgICAgICAgICAgd2lkdGg6IGVsZW1lbnQuY2xpZW50V2lkdGggLyBfb3B0aW9ucy5zY2FsaW5nLFxuICAgICAgICAgICAgaGVpZ2h0OiBlbGVtZW50LmNsaWVudEhlaWdodCAvIF9vcHRpb25zLnNjYWxpbmdcbiAgICAgICAgfVxuICAgICAgICBsZXQgX29sZERldmljZVBpeGVsUmF0aW8gPSBIZWxwZXIuZ2V0RGV2aWNlUGl4ZWxSYXRpbygpO1xuICAgICAgICBsZXQgX29sZFNjYWxpbmcgPSBfb3B0aW9ucy5zY2FsaW5nO1xuICAgICAgICBsZXQgX29sZENsaWVudFdpZHRoID0gZWxlbWVudC5jbGllbnRXaWR0aDtcbiAgICAgICAgbGV0IF9vbGRDbGllbnRIZWlnaHQgPSBlbGVtZW50LmNsaWVudEhlaWdodDtcbiAgICAgICAgbGV0IF9vbGRIaWRkZW5UeXBlcyA9IF9vcHRpb25zLmhpZGRlblR5cGVzO1xuICAgICAgICBsZXQgX29sZE9wYWNpdHkgPSBfb3B0aW9ucy5vcGFjaXR5O1xuICAgICAgICAvL+a4suafk+WZqOW3peWOglxuICAgICAgICBsZXQgcmVuZGVyZXJzRmFjdG9yeSA9IG5ldyBSZW5kZXJlcnNGYWN0b3J5KGVsZW1lbnQsIF9vcHRpb25zLCBfZWxlbWVudFNpemUsIGJ1bGxldFNjcmVlbkV2ZW50VHJpZ2dlcik7XG4gICAgICAgIGxldCBfcmVuZGVyZXIgPSByZW5kZXJlcnNGYWN0b3J5LmdldEdlbmVyYWxSZW5kZXJlcihyZW5kZXJNb2RlKTsgLy/lrp7kvovljJbmuLLmn5PlmahcbiAgICAgICAgc2V0SW50ZXJ2YWwoc2V0U2l6ZSwgMTAwKTtcblxuICAgICAgICAvL+WFrOWFseWHveaVsFxuICAgICAgICAvKipcbiAgICAgICAgICog6K6+572u5oiW6I635Y+W5YWo5bGA6YCJ6aG5XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqKi9cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdvcHRpb25zJywge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEhlbHBlci5jbG9uZShfb3B0aW9ucyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgICAgIF9vcHRpb25zID0gSGVscGVyLnNldFZhbHVlcyhvcHRpb25zLCBfb3B0aW9ucywgX29wdGlvbnNUeXBlLCBmYWxzZSk7IC8v6K6+572u6buY6K6k5YC8XG4gICAgICAgICAgICAgICAgaWYgKF9vbGRIaWRkZW5UeXBlcyAhPSBfb3B0aW9ucy5oaWRkZW5UeXBlcykge1xuICAgICAgICAgICAgICAgICAgICBfb2xkSGlkZGVuVHlwZXMgPSBfb3B0aW9ucy5oaWRkZW5UeXBlcztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFfcGxheWluZykgX3JlbmRlcmVyLmRyYXcoKTsgLy/pnZ7mkq3mlL7nirbmgIHliJnph43nu5hcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKF9vbGRPcGFjaXR5ICE9IF9vcHRpb25zLm9wYWNpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgX29sZE9wYWNpdHkgPSBfb3B0aW9ucy5vcGFjaXR5O1xuICAgICAgICAgICAgICAgICAgICBfcmVuZGVyZXIuc2V0T3BhY2l0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa3u+WKoOW8ueW5leWIsOW8ueW5leWIl+ihqOOAglxuICAgICAgICAgKiBAZGVzY3JpcHRpb24g5re75Yqg5by55bmV5Yiw5by55bmV5YiX6KGo44CC55Sx5LqO5by55bmV5Zyo5bGP5bmV5LiK5Ye6546w6L+H5ZCO77yM5by55bmV5byV5pOO5bCG5LuO5YiX6KGo5Lit5b275bqV5Yig6Zmk5q2k5by55bmV44CC5omA5Lul77yM5Zyo5pS55Y+Y5pKt5pS+6L+b5bqm5pe277yM5Y+v6IO96ZyA6KaB5YWIW+a4heepuuW8ueW5leWIl+ihqF17QGxpbmsgb3BlbkJTRS5CdWxsZXRTY3JlZW5FbmdpbmUjY2xlYW5CdWxsZXRTY3JlZW5MaXN0fe+8jOeEtuWQjumHjeaWsOWKoOi9veatpOaSreaUvui/m+W6puS7peWQjueahOW8ueW5leOAglxuICAgICAgICAgKiBAcGFyYW0ge29wZW5CU0V+R2VuZXJhbEJ1bGxldFNjcmVlbn0gYnVsbGV0U2NyZWVuIC0g5Y2V5p2h5by55bmV5pWw5o2u77ya5LiA5LiqIHtAbGluayBvcGVuQlNFfkdlbmVyYWxCdWxsZXRTY3JlZW59IOe7k+aehOOAglxuICAgICAgICAgKiBAdGhyb3dzIHtUeXBlRXJyb3J9IOS8oOWFpeeahOWPguaVsOmUmeivr+aXtuW8leWPkemUmeivr+OAguivt+WPgumYhSBNRE4gW1R5cGVFcnJvcl17QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvemgtQ04vZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvVHlwZUVycm9yfSDjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuYWRkID0gZnVuY3Rpb24gKGJ1bGxldFNjcmVlbikge1xuICAgICAgICAgICAgX2RlZmF1bHRCdWxsZXRTY3JlZW4uc3RhcnRUaW1lID0gX29wdGlvbnMuY2xvY2soKTtcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbiA9IEhlbHBlci5zZXRWYWx1ZXMoYnVsbGV0U2NyZWVuLCBfZGVmYXVsdEJ1bGxldFNjcmVlbiwgX2J1bGxldFNjcmVlblR5cGUpOyAvL+iuvue9rum7mOiupOWAvFxuXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuLnR5cGUgIT0gR2VuZXJhbFR5cGUubGVmdFRvUmlnaHQgJiZcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW4udHlwZSAhPSBHZW5lcmFsVHlwZS5yaWdodFRvTGVmdCAmJlxuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbi50eXBlICE9IEdlbmVyYWxUeXBlLnRvcCAmJlxuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbi50eXBlICE9IEdlbmVyYWxUeXBlLmJvdHRvbVxuICAgICAgICAgICAgKSB0aHJvdyBuZXcgVHlwZUVycm9yKFJlc291cmNlcy5QQVJBTUVURVJTX1RZUEVfRVJST1IpO1xuXG4gICAgICAgICAgICBIZWxwZXIuY2hlY2tUeXBlcyhidWxsZXRTY3JlZW4uc3R5bGUsIF9vcHRpb25zVHlwZS5kZWZhdWx0U3R5bGUpOyAvL+ajgOafpeW8ueW5leagt+W8j+exu+Wei1xuXG4gICAgICAgICAgICBsZXQgbmV3Tm9kZSA9IG5ldyBMaW5rZWRMaXN0Lm5vZGUoYnVsbGV0U2NyZWVuKTtcbiAgICAgICAgICAgIF9idWxsZXRTY3JlZW5CdWZmZXIuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgIGxldCBsYXN0QnVsbGV0U2NyZWVuID0gbm9kZS5lbGVtZW50O1xuICAgICAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW4uc3RhcnRUaW1lID4gbGFzdEJ1bGxldFNjcmVlbi5zdGFydFRpbWUpIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGFkZDogeyBhZGRUb1VwOiB0cnVlLCBub2RlOiBuZXdOb2RlIH0sXG4gICAgICAgICAgICAgICAgICAgIHN0b3A6IHRydWVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgICAgICBpZiAobmV3Tm9kZS5saW5rZWRMaXN0ID09PSBudWxsKSBfYnVsbGV0U2NyZWVuQnVmZmVyLnB1c2gobmV3Tm9kZSwgZmFsc2UpO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOW8gOWni+aSreaUvuW8ueW5leOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5wbGF5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCFfcGxheWluZykge1xuICAgICAgICAgICAgICAgIGlmICghX3N0YXJ0VGltZSlcbiAgICAgICAgICAgICAgICAgICAgX3N0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgIGlmIChfcGF1c2VUaW1lKVxuICAgICAgICAgICAgICAgICAgICBfc3RhcnRUaW1lICs9IF9vcHRpb25zLmNsb2NrKCkgLSBfcGF1c2VUaW1lO1xuICAgICAgICAgICAgICAgIF9sYXN0UmVmcmVzaFRpbWUgPSBudWxsO1xuICAgICAgICAgICAgICAgIF9wbGF5aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVmcmVzaCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOe7p+e7reaJgOacieWcqOS6i+S7tuWTjeW6lOS4reiuvue9ruS6hiBlLnBhdXNlID0gdHJ1ZTsg5by55bmV55qE5pKt5pS+44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnBsYXlBbGxCdWxsZXRTY3JlZW5zID0gKCkgPT5cbiAgICAgICAgICAgIF9yZWFsVGltZUJ1bGxldFNjcmVlbnMuZm9yRWFjaCgobm9kZSkgPT4gbm9kZS5lbGVtZW50LnBhdXNlID0gZmFsc2UpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmmoLlgZzmkq3mlL7lvLnluZXjgIJcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIOaaguWBnOaSreaUvuW8ueW5leOAguaaguWBnOaSreaUvuW8ueW5leaYr+aMh+W8ueW5leaSreaUvuaaguWBnO+8jOaJgOacieacquWHuueOsOeahOW8ueW5leWwhuWBnOatouWHuueOsO+8jOW3suWHuueOsOeahOW8ueW5leWBnOatoui/kOWKqO+8jOWBnOatoua2iOWkseOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5wYXVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChfcGxheWluZykge1xuICAgICAgICAgICAgICAgIF9wYXVzZVRpbWUgPSBfb3B0aW9ucy5jbG9jaygpO1xuICAgICAgICAgICAgICAgIF9wbGF5aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa4heepuuW8ueW5lee8k+WGsuWMuuOAglxuICAgICAgICAgKiBAZGVzY3JpcHRpb24g5riF56m65by55bmV5YiX6KGo77yM5L2G5bGP5bmV5LiK5bey57uP5Ye6546w55qE5by55bmV5LiN5Lya6KKr5riF6Zmk44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmNsZWFuQnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX2J1bGxldFNjcmVlbkJ1ZmZlci5jbGVhbigpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmuIXnqbrlsY/luZXlhoXlrrnjgIJcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIOa4heepuuWxj+W5leWGheWuueOAgua4heepuuWxj+W5leS4iuW3sue7j+WHuueOsOeahOW8ueW5le+8jOS4jeWMheaLrOW8ueW5leWIl+ihqOS4reeahOW8ueW5leOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jbGVhblNjcmVlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF9yZWFsVGltZUJ1bGxldFNjcmVlbnMuY2xlYW4oKTtcbiAgICAgICAgICAgIF9yZW5kZXJlci5jbGVhblNjcmVlbigpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlgZzmraLmkq3mlL7lvLnluZXjgIJcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIOWBnOatouaSreaUvuW8ueW5leOAguWBnOatouaSreaUvuW8ueW5leaYr+aMh+WBnOatouaSreaUvuW8ueW5le+8jOm7mOiupFvml7bpl7Tln7rlh4bvvIhvcHRpb25zLmNsb2Nr77yJXXtAbGluayBvcGVuQlNFfkJ1bGxldFNjcmVlblN0eWxlfeW9kumbtu+8jOW5tlvmuIXnqbrlvLnluZXliJfooahde0BsaW5rIG9wZW5CU0UuQnVsbGV0U2NyZWVuRW5naW5lI2NsZWFuQnVsbGV0U2NyZWVuTGlzdH3jgIFb5riF56m65bGP5bmV5YaF5a65XXtAbGluayBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZSNjbGVhblNjcmVlbn3jgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChfcGxheWluZykge1xuICAgICAgICAgICAgICAgIHRoaXMucGF1c2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY2xlYW5CdWZmZXIoKTtcbiAgICAgICAgICAgIHRoaXMuY2xlYW5TY3JlZW4oKTtcbiAgICAgICAgICAgIF9wYXVzZVRpbWUgPSAwO1xuICAgICAgICAgICAgX3N0YXJ0VGltZSA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPluaIluiuvue9ruW8ueW5leWPr+ingeaAp+OAglxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICd2aXNpYmlsaXR5Jywge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbmRlcmVyLmdldFZpc2liaWxpdHkoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2aXNpYmlsaXR5KSB7XG4gICAgICAgICAgICAgICAgaWYgKHZpc2liaWxpdHkpIF9yZW5kZXJlci5zaG93KCk7XG4gICAgICAgICAgICAgICAgZWxzZSBfcmVuZGVyZXIuaGlkZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W5riy5p+T5qih5byP44CCXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3JlbmRlck1vZGUnLCB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVuZGVyTW9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPluaSreaUvueKtuaAgeOAglxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdwbGF5U3RhdGUnLCB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3BsYXlpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAqIOiOt+WPluiwg+ivleS/oeaBr+OAglxuICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICovXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnZGVidWdJbmZvJywge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdGltZTogX3BsYXlpbmcgPyBfb3B0aW9ucy5jbG9jaygpIDogX3BhdXNlVGltZSxcbiAgICAgICAgICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW5Db3VudDogX3JlYWxUaW1lQnVsbGV0U2NyZWVucy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlckJ1bGxldFNjcmVlbkNvdW50OiBfYnVsbGV0U2NyZWVuQnVmZmVyLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6IF9kZWxheSxcbiAgICAgICAgICAgICAgICAgICAgZGVsYXlCdWxsZXRTY3JlZW5Db3VudDogX2RlbGF5QnVsbGV0U2NyZWVuQ291bnQsXG4gICAgICAgICAgICAgICAgICAgIGZwczogX3BsYXlpbmcgPyBNYXRoLmZsb29yKF9yZWZyZXNoUmF0ZSAqIDEwMDApIDogMCAvL+W4p+mikVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8v5YaF6YOo5Ye95pWwXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlvLnluZXkuovku7blk43lupRcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSDkuovku7blkI3np7BcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IHJlYWxUaW1lQnVsbGV0U2NyZWVuIC0g5a6e5pe25by55bmV5a+56LGhXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlIC0g5LqL5Lu25L+h5oGvXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBidWxsZXRTY3JlZW5FdmVudFRyaWdnZXIobmFtZSwgcmVhbFRpbWVCdWxsZXRTY3JlZW4sIGUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZS5wYWdlWCA9PT0gJ3VuZGVmaW5lZCcgfHwgZS5wYWdlWCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGxldCBkb2MgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuICAgICAgICAgICAgICAgIGUucGFnZVggPSBlLmNsaWVudFggKyAoZG9jICYmIGRvYy5zY3JvbGxMZWZ0IHx8IGJvZHkgJiYgYm9keS5zY3JvbGxMZWZ0IHx8IDApIC0gKGRvYyAmJiBkb2MuY2xpZW50TGVmdCB8fCBib2R5ICYmIGJvZHkuY2xpZW50TGVmdCB8fCAwKTtcbiAgICAgICAgICAgICAgICBlLnBhZ2VZID0gZS5jbGllbnRZICsgKGRvYyAmJiBkb2Muc2Nyb2xsVG9wIHx8IGJvZHkgJiYgYm9keS5zY3JvbGxUb3AgfHwgMCkgLSAoZG9jICYmIGRvYy5jbGllbnRUb3AgfHwgYm9keSAmJiBib2R5LmNsaWVudFRvcCB8fCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9ldmVudC50cmlnZ2VyKG5hbWUsIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiDojrflj5blvJXlj5Hkuovku7bnmoTlvLnluZXlvLnluZXnmoTmlbDmja5cbiAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtvcGVuQlNFfkJ1bGxldFNjcmVlbn0g5byV5Y+R5LqL5Lu255qE5by55bmV55qE5pWw5o2u77ya5LiA5LiqIHtAbGluayBvcGVuQlNFfkJ1bGxldFNjcmVlbn0g57uT5p6E44CC77yI5rOo5oSP77ya5LiN6KaB6K+V5Zu+5LiOW+a3u+WKoOW8ueW5lV17QGxpbmsgb3BlbkJTRS5CdWxsZXRTY3JlZW5FbmdpbmUjYWRkQnVsbGV0U2NyZWVufeaXtuWIm+W7uueahOWvueixoei/m+ihjOavlOi+g++8jOi/meS4quWvueixoeaYr+WFi+mahuW+l+WIsOeahO+8jOW5tuS4jeebuOetieOAguato+ehrueahOaWueazleaYr+WcqOa3u+WKoOW8ueW5leaXtuS4gOW5tuaPkuWFpSBpZCDnrYnoh6rlrprkuYnlrZfmrrXmnaXllK/kuIDmoIfor4bkuIDmnaHlvLnluZXjgILvvIlcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBnZXRCdWxsZXRTY3JlZW46ICgpID0+IEhlbHBlci5jbG9uZShyZWFsVGltZUJ1bGxldFNjcmVlbi5idWxsZXRTY3JlZW4pLFxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIOiuvue9ruW8leWPkeS6i+S7tueahOW8ueW5leW8ueW5leeahOaVsOaNrlxuICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtvcGVuQlNFfkJ1bGxldFNjcmVlbn0gYnVsbGV0U2NyZWVuIC0g5byV5Y+R5LqL5Lu255qE5by55bmV55qE5pWw5o2u77ya5LiA5LiqIHtAbGluayBvcGVuQlNFfkJ1bGxldFNjcmVlbn0g57uT5p6E44CC6K6+572u5q2k5Y+C5pWw5Lul5L6/5Yqo5oCB6LCD5pW05by55bmV5qC35byP77yM5L2G5piv5LiA5Lqb5Y+C5pWw5Zyo5LqL5Lu25Lit5L+u5pS55peg5pWI77yM5p+l55yL5q2k57uT5p6E55qE6K+05piO5Lul5LqG6Kej6K+m5oOF44CCXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtib29sZWFufSBbcmVkcmF3PWZhbHNlXSAtIOaYr+WQpumHjee7mOW8ueW5le+8muatpOWPguaVsOWcqOavj+asoeW8leWPkeS6i+S7tuaXtueahOWIneWni+WAvOS4uiBmYWxzZSDvvIzlpoLmnpzkv67mlLnkuoYgYnVsbGV0U2NyZWVuIOS4reeahOWAvO+8jOatpOWPguaVsOW/hemhu+iuvuS4uiB0cnVlIOOAglxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHNldEJ1bGxldFNjcmVlbjogKGJ1bGxldFNjcmVlbiwgcmVkcmF3ID0gZmFsc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByZWRyYXcgIT0gJ2Jvb2xlYW4nKSB0aHJvdyBuZXcgVHlwZUVycm9yKFJlc291cmNlcy5QQVJBTUVURVJTX1RZUEVfRVJST1IpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuVHlwZSA9IEhlbHBlci5jbG9uZShfYnVsbGV0U2NyZWVuVHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlblR5cGUuc3R5bGUgPSBfb3B0aW9uc1R5cGUuZGVmYXVsdFN0eWxlO1xuICAgICAgICAgICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi5idWxsZXRTY3JlZW4gPSBIZWxwZXIuc2V0VmFsdWVzKGJ1bGxldFNjcmVlbiwgcmVhbFRpbWVCdWxsZXRTY3JlZW4uYnVsbGV0U2NyZWVuLCBidWxsZXRTY3JlZW5UeXBlKTsgLy/orr7nva7lgLxcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlZHJhdyA9PT0gdHJ1ZSkgX3JlbmRlcmVyLnJlQ3JlYXRBbmRnZXRXaWR0aChyZWFsVGltZUJ1bGxldFNjcmVlbik7IC8v6YeN5paw5Yib5bu65bm257uY5Yi25by55bmVXG4gICAgICAgICAgICAgICAgICAgIGlmICghX3BsYXlpbmcgJiYgcmVkcmF3KSBfcmVuZGVyZXIuZHJhdygpOyAvL+mdnuaSreaUvueKtuaAgeWImemHjee7mFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICog6I635Y+W5byV5Y+R5LqL5Lu255qE5by55bmV55qE5pKt5pS+54q25oCBXG4gICAgICAgICAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0g5Y+W5byV5Y+R5LqL5Lu255qE5by55bmV5piv5ZCm5Zyo5pKt5pS+L+enu+WKqO+8muWmguaenOiuvue9ruS4uiB0cnVlIOWImeivpeW8ueW5leaaguWBnO+8jOebtOWIsOWwhuatpOWPguaVsOiuvuS4uiBmYWxzZSDmiJbosIPnlKgge0BsaW5rIG9wZW5CU0UuQnVsbGV0U2NyZWVuRW5naW5lI3BsYXlBbGxCdWxsZXRTY3JlZW5zfSDmlrnms5XjgIJcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBnZXRQbGF5U3RhdGU6ICgpID0+ICFyZWFsVGltZUJ1bGxldFNjcmVlbi5wYXVzZSxcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiDorr7nva7lvJXlj5Hkuovku7bnmoTlvLnluZXnmoTmkq3mlL7nirbmgIFcbiAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gcGFseSAtIOaYr+WQpue7p+e7reaSreaUvi/np7vliqjlvJXlj5Hkuovku7bnmoTlvLnluZXvvJror7vlj5bmraTlj4LmlbDlj6/liKTmlq3ov5nmnaHlvLnluZXmmK/lkKblpITkuo7mmoLlgZznirbmgIHjgIJcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBzZXRQbGF5U3RhdGU6IChwbGF5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcGxheSAhPSAnYm9vbGVhbicpIHRocm93IG5ldyBUeXBlRXJyb3IoUmVzb3VyY2VzLlBBUkFNRVRFUlNfVFlQRV9FUlJPUik7XG4gICAgICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLnBhdXNlID0gIXBsYXk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzY3JlZW5YOiBlLnNjcmVlblgsIHNjcmVlblk6IGUuc2NyZWVuWSxcbiAgICAgICAgICAgICAgICBwYWdlWDogZS5wYWdlWCwgcGFnZVk6IGUucGFnZVksXG4gICAgICAgICAgICAgICAgY2xpZW50WDogZS5jbGllbnRYLCBjbGllbnRZOiBlLmNsaWVudFlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWIt+aWsOW8ueW5leWHveaVsFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcmVmcmVzaCgpIHtcbiAgICAgICAgICAgIGxldCBub3dUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICBpZiAoX2xhc3RSZWZyZXNoVGltZSAhPSBudWxsKVxuICAgICAgICAgICAgICAgIF9yZWZyZXNoUmF0ZSA9IDEgLyAobm93VGltZSAtIF9sYXN0UmVmcmVzaFRpbWUpO1xuICAgICAgICAgICAgX2xhc3RSZWZyZXNoVGltZSA9IG5vd1RpbWU7XG4gICAgICAgICAgICBhZGRSZWFsVGltZUJ1bGxldFNjcmVlbnMoKTtcbiAgICAgICAgICAgIG1vdmVSZWFsVGltZUJ1bGxldFNjcmVlbigpO1xuICAgICAgICAgICAgX3JlbmRlcmVyLmRyYXcoKTsgLy/nu5jliLblvLnluZVcbiAgICAgICAgICAgIGlmIChfcGxheWluZylcbiAgICAgICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVmcmVzaCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog56e75Yqo5by55bmV5Ye95pWwXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBtb3ZlUmVhbFRpbWVCdWxsZXRTY3JlZW4oKSB7XG4gICAgICAgICAgICBfcmVhbFRpbWVCdWxsZXRTY3JlZW5zLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcmVhbFRpbWVCdWxsZXRTY3JlZW4gPSBub2RlLmVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgaWYgKHJlYWxUaW1lQnVsbGV0U2NyZWVuLnBhdXNlKSByZXR1cm47IC8v5pqC5YGc56e75YqoXG4gICAgICAgICAgICAgICAgbGV0IG5vd1RpbWUgPSBfb3B0aW9ucy5jbG9jaygpO1xuICAgICAgICAgICAgICAgIHN3aXRjaCAocmVhbFRpbWVCdWxsZXRTY3JlZW4udHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIEdlbmVyYWxUeXBlLnJpZ2h0VG9MZWZ0OlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlYWxUaW1lQnVsbGV0U2NyZWVuLnggPiAtcmVhbFRpbWVCdWxsZXRTY3JlZW4ud2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi54IC09IHJlYWxUaW1lQnVsbGV0U2NyZWVuLmJ1bGxldFNjcmVlbi5zdHlsZS5zcGVlZCAqIF9vcHRpb25zLnBsYXlTcGVlZCAvIF9yZWZyZXNoUmF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZW5kZXJlci5kZWxldGUocmVhbFRpbWVCdWxsZXRTY3JlZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHJlbW92ZTogdHJ1ZSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgR2VuZXJhbFR5cGUubGVmdFRvUmlnaHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVhbFRpbWVCdWxsZXRTY3JlZW4ueCA8IF9lbGVtZW50U2l6ZS53aWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLnggKz0gcmVhbFRpbWVCdWxsZXRTY3JlZW4uYnVsbGV0U2NyZWVuLnN0eWxlLnNwZWVkICogX29wdGlvbnMucGxheVNwZWVkIC8gX3JlZnJlc2hSYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JlbmRlcmVyLmRlbGV0ZShyZWFsVGltZUJ1bGxldFNjcmVlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgcmVtb3ZlOiB0cnVlIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBHZW5lcmFsVHlwZS50b3A6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgR2VuZXJhbFR5cGUuYm90dG9tOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlYWxUaW1lQnVsbGV0U2NyZWVuLmVuZFRpbWUgPCBub3dUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JlbmRlcmVyLmRlbGV0ZShyZWFsVGltZUJ1bGxldFNjcmVlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgcmVtb3ZlOiB0cnVlIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmt7vliqDlvLnluZXliLDlrp7ml7blvLnluZXliJfooahcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGFkZFJlYWxUaW1lQnVsbGV0U2NyZWVucygpIHtcbiAgICAgICAgICAgIGlmIChfcmVhbFRpbWVCdWxsZXRTY3JlZW5zLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICAgICBfZGVsYXkgPSAwO1xuICAgICAgICAgICAgbGV0IHRpbWVzID0gTWF0aC5mbG9vcihfcmVmcmVzaFJhdGUgKiAyMDAwKTtcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBsZXQgbm9kZSA9IF9idWxsZXRTY3JlZW5CdWZmZXIucG9wKGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUgPT09IG51bGwpIHJldHVybjtcbiAgICAgICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuID0gbm9kZS5lbGVtZW50O1xuICAgICAgICAgICAgICAgIGxldCBub3dUaW1lID0gX29wdGlvbnMuY2xvY2soKTtcbiAgICAgICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuLnN0YXJ0VGltZSA+IG5vd1RpbWUpIHJldHVybjtcbiAgICAgICAgICAgICAgICBpZiAoIV9vcHRpb25zLnRpbWVPdXREaXNjYXJkIHx8ICFidWxsZXRTY3JlZW4uY2FuRGlzY2FyZCB8fCBidWxsZXRTY3JlZW4uc3RhcnRUaW1lID4gbm93VGltZSAtIE1hdGguZmxvb3IoMSAvIF9yZWZyZXNoUmF0ZSkgKiA2MCkge1xuICAgICAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW4uc3R5bGUgPSBIZWxwZXIuc2V0VmFsdWVzKGJ1bGxldFNjcmVlbi5zdHlsZSwgX29wdGlvbnMuZGVmYXVsdFN0eWxlLCBfb3B0aW9uc1R5cGUuZGVmYXVsdFN0eWxlKTsgLy/loavlhYXpu5jorqTmoLflvI9cbiAgICAgICAgICAgICAgICAgICAgZ2V0UmVhbFRpbWVCdWxsZXRTY3JlZW4obm93VGltZSwgYnVsbGV0U2NyZWVuKTsgLy/nlJ/miJDlrp7ml7blvLnluZXlr7nosaHlubbmt7vliqDliLDlrp7ml7blvLnluZXpm4blkIggICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBfZGVsYXlCdWxsZXRTY3JlZW5Db3VudCsrO1xuICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgdGltZXMtLTtcbiAgICAgICAgICAgIH0gd2hpbGUgKF9yZWFsVGltZUJ1bGxldFNjcmVlbnMubGVuZ3RoID09PSAwIHx8IHRpbWVzID4gMCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog55Sf5oiQ5a6e5pe25by55bmV5a+56LGhXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBub3dUaW1lIC0g5b2T5YmN5pe26Ze0XG4gICAgICAgICAqIEBwYXJhbSB7b3BlbkJTRX5CdWxsZXRTY3JlZW59IGJ1bGxldFNjcmVlbiAtIOW8ueW5leeahOmTvuihqOiKgueCuVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZ2V0UmVhbFRpbWVCdWxsZXRTY3JlZW4obm93VGltZSwgYnVsbGV0U2NyZWVuKSB7XG4gICAgICAgICAgICBfZGVsYXkgPSBub3dUaW1lIC0gYnVsbGV0U2NyZWVuLnN0YXJ0VGltZTtcbiAgICAgICAgICAgIGxldCByZWFsVGltZUJ1bGxldFNjcmVlbiA9IHt9O1xuICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4ucGF1c2UgPSBmYWxzZTsgLy/mmK/lkKbmmoLlgZznp7vliqhcbiAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLmJ1bGxldFNjcmVlbiA9IGJ1bGxldFNjcmVlbjtcbiAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLnN0YXJ0VGltZSA9IG5vd1RpbWU7IC8v5by55bmV5aS06YOo6L+b5bGP5bmV5pe26Ze0XG4gICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi5zaXplID0gYnVsbGV0U2NyZWVuLnN0eWxlLnNpemU7IC8v5a2X5L2T5aSn5bCP77ya5YOP57SgXG4gICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi50eXBlID0gYnVsbGV0U2NyZWVuLnR5cGU7IC8v5by55bmV57G75Z6LXG4gICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi5oZWlnaHQgPSByZWFsVGltZUJ1bGxldFNjcmVlbi5zaXplOyAvL+W8ueW5leeahOmrmOW6pu+8muWDj+e0oFxuICAgICAgICAgICAgX3JlbmRlcmVyLmNyZWF0QW5kZ2V0V2lkdGgocmVhbFRpbWVCdWxsZXRTY3JlZW4pOyAvL+WIm+W7uuW8ueW5leWFg+e0oOW5tuiuoeeul+WuveW6plxuICAgICAgICAgICAgc3dpdGNoIChidWxsZXRTY3JlZW4udHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgR2VuZXJhbFR5cGUucmlnaHRUb0xlZnQ6XG4gICAgICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLmVuZFRpbWUgPSBNYXRoLnJvdW5kKG5vd1RpbWUgKyAoX2VsZW1lbnRTaXplLndpZHRoICsgcmVhbFRpbWVCdWxsZXRTY3JlZW4ud2lkdGgpIC8gKGJ1bGxldFNjcmVlbi5zdHlsZS5zcGVlZCAqIF9vcHRpb25zLnBsYXlTcGVlZCkpOyAvL+W8ueW5leWwvumDqOWHuuWxj+W5leeahOaXtumXtFxuICAgICAgICAgICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi54ID0gX2VsZW1lbnRTaXplLndpZHRoOyAvL+W8ueW5leWIneWni1jlnZDmoIdcbiAgICAgICAgICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4ueSA9IF9vcHRpb25zLnZlcnRpY2FsSW50ZXJ2YWw7IC8v5by55bmV5Yid5aeLWeWdkOagh1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEdlbmVyYWxUeXBlLmxlZnRUb1JpZ2h0OlxuICAgICAgICAgICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi5lbmRUaW1lID0gTWF0aC5yb3VuZChub3dUaW1lICsgKF9lbGVtZW50U2l6ZS53aWR0aCArIHJlYWxUaW1lQnVsbGV0U2NyZWVuLndpZHRoKSAvIChidWxsZXRTY3JlZW4uc3R5bGUuc3BlZWQgKiBfb3B0aW9ucy5wbGF5U3BlZWQpKTsgLy/lvLnluZXlsL7pg6jlh7rlsY/luZXnmoTml7bpl7RcbiAgICAgICAgICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4ueCA9IC1yZWFsVGltZUJ1bGxldFNjcmVlbi53aWR0aDsgLy/lvLnluZXliJ3lp4tY5Z2Q5qCHXG4gICAgICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLnkgPSBfb3B0aW9ucy52ZXJ0aWNhbEludGVydmFsOyAvL+W8ueW5leWIneWni1nlnZDmoIdcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBHZW5lcmFsVHlwZS50b3A6XG4gICAgICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLmVuZFRpbWUgPSByZWFsVGltZUJ1bGxldFNjcmVlbi5zdGFydFRpbWUgKyBidWxsZXRTY3JlZW4uc3R5bGUucmVzaWRlbmNlVGltZSAqIF9vcHRpb25zLnBsYXlTcGVlZDtcbiAgICAgICAgICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4ueCA9IE1hdGgucm91bmQoKF9lbGVtZW50U2l6ZS53aWR0aCAtIHJlYWxUaW1lQnVsbGV0U2NyZWVuLndpZHRoKSAvIDIpOyAvL+W8ueW5leWIneWni1jlnZDmoIdcbiAgICAgICAgICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4ueSA9IF9vcHRpb25zLnZlcnRpY2FsSW50ZXJ2YWw7IC8v5by55bmV5Yid5aeLWeWdkOagh1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEdlbmVyYWxUeXBlLmJvdHRvbTpcbiAgICAgICAgICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4uZW5kVGltZSA9IHJlYWxUaW1lQnVsbGV0U2NyZWVuLnN0YXJ0VGltZSArIGJ1bGxldFNjcmVlbi5zdHlsZS5yZXNpZGVuY2VUaW1lICogX29wdGlvbnMucGxheVNwZWVkO1xuICAgICAgICAgICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi54ID0gTWF0aC5yb3VuZCgoX2VsZW1lbnRTaXplLndpZHRoIC0gcmVhbFRpbWVCdWxsZXRTY3JlZW4ud2lkdGgpIC8gMik7IC8v5by55bmV5Yid5aeLWOWdkOagh1xuICAgICAgICAgICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi55ID0gLV9vcHRpb25zLnZlcnRpY2FsSW50ZXJ2YWwgLSByZWFsVGltZUJ1bGxldFNjcmVlbi5oZWlnaHQ7IC8v5by55bmV5Yid5aeLWeWdkOagh1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IG5ld05vZGUgPSBuZXcgTGlua2VkTGlzdC5ub2RlKHJlYWxUaW1lQnVsbGV0U2NyZWVuKTtcbiAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW4udHlwZSA9PT0gR2VuZXJhbFR5cGUudG9wIHx8IGJ1bGxldFNjcmVlbi50eXBlID09PSBHZW5lcmFsVHlwZS5ib3R0b20pIHtcbiAgICAgICAgICAgICAgICBfcmVhbFRpbWVCdWxsZXRTY3JlZW5zLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5leHRyZWFsVGltZUJ1bGxldFNjcmVlbiA9IG5vZGUuZWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgLy/lvLnluZXkuI3lnKjmtYHkuK3vvIzmmK/lm7rlrprlvLnluZVcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRyZWFsVGltZUJ1bGxldFNjcmVlbi5idWxsZXRTY3JlZW4udHlwZSAhPSBidWxsZXRTY3JlZW4udHlwZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjsgLy/kuI3mmK/lkIzkuIDnp43nsbvlnovnmoTlvLnluZVcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbi50eXBlID09PSBHZW5lcmFsVHlwZS50b3ApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5aaC5p6c5paw5by55bmV5Zyo5b2T5YmN5by55bmV5LiK5pa55LiU5pyq5LiO5b2T5YmN5by55bmV6YeN5Y+gXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVhbFRpbWVCdWxsZXRTY3JlZW4ueSArIHJlYWxUaW1lQnVsbGV0U2NyZWVuLmhlaWdodCA8IG5leHRyZWFsVGltZUJ1bGxldFNjcmVlbi55KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0QWN0dWFsWShyZWFsVGltZUJ1bGxldFNjcmVlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgYWRkOiB7IGFkZFRvVXA6IHRydWUsIG5vZGU6IG5ld05vZGUgfSwgc3RvcDogdHJ1ZSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpzkuIrkuIDmnaHlvLnluZXnmoTmtojlpLHml7bpl7TlsI/kuo7lvZPliY3lvLnluZXnmoTlh7rnjrDml7bpl7RcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4uZW5kVGltZSA8IG5vd1RpbWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4ueSA9IG5leHRyZWFsVGltZUJ1bGxldFNjcmVlbi55O1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLnkgPSBuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4ueSArIG5leHRyZWFsVGltZUJ1bGxldFNjcmVlbi5oZWlnaHQgKyBfb3B0aW9ucy52ZXJ0aWNhbEludGVydmFsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpzmlrDlvLnluZXlnKjlvZPliY3lvLnluZXkuIvmlrnkuJTmnKrkuI7lvZPliY3lvLnluZXph43lj6BcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWFsVGltZUJ1bGxldFNjcmVlbi55ID4gbmV4dHJlYWxUaW1lQnVsbGV0U2NyZWVuLnkgKyBuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4uaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0QWN0dWFsWShyZWFsVGltZUJ1bGxldFNjcmVlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgYWRkOiB7IGFkZFRvVXA6IHRydWUsIG5vZGU6IG5ld05vZGUgfSwgc3RvcDogdHJ1ZSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpzkuIrkuIDmnaHlvLnluZXnmoTmtojlpLHml7bpl7TlsI/kuo7lvZPliY3lvLnluZXnmoTlh7rnjrDml7bpl7RcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4uZW5kVGltZSA8IG5vd1RpbWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4ueSA9IG5leHRyZWFsVGltZUJ1bGxldFNjcmVlbi55O1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLnkgPSBuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4ueSAtIHJlYWxUaW1lQnVsbGV0U2NyZWVuLmhlaWdodCAtIF9vcHRpb25zLnZlcnRpY2FsSW50ZXJ2YWw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8v5b2T5YmN5by55bmV57uP6L+H5LiA5Liq54K56ZyA6KaB55qE5oC75pe26ZW/XG4gICAgICAgICAgICAgICAgbGV0IHJlYWxUaW1lQnVsbGV0U2NyZWVuV2lkdGhUaW1lID0gcmVhbFRpbWVCdWxsZXRTY3JlZW4ud2lkdGggLyAoYnVsbGV0U2NyZWVuLnN0eWxlLnNwZWVkICogX29wdGlvbnMucGxheVNwZWVkKTtcbiAgICAgICAgICAgICAgICBfcmVhbFRpbWVCdWxsZXRTY3JlZW5zLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5leHRyZWFsVGltZUJ1bGxldFNjcmVlbiA9IG5vZGUuZWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgLy/lvLnluZXlnKjmtYHkuK3vvIzmmK/np7vliqjlvLnluZVcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRyZWFsVGltZUJ1bGxldFNjcmVlbi5idWxsZXRTY3JlZW4udHlwZSA9PT0gR2VuZXJhbFR5cGUudG9wIHx8IG5leHRyZWFsVGltZUJ1bGxldFNjcmVlbi5idWxsZXRTY3JlZW4udHlwZSA9PT0gR2VuZXJhbFR5cGUuYm90dG9tKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuOyAvL+W8ueW5leS4jeWcqOa1geS4re+8jOS4uuWbuuWumuW8ueW5lVxuICAgICAgICAgICAgICAgICAgICAvL+WmguaenOaWsOW8ueW5leWcqOW9k+WJjeW8ueW5leS4iuaWueS4lOacquS4juW9k+WJjeW8ueW5lemHjeWPoFxuICAgICAgICAgICAgICAgICAgICBpZiAocmVhbFRpbWVCdWxsZXRTY3JlZW4ueSArIHJlYWxUaW1lQnVsbGV0U2NyZWVuLmhlaWdodCA8IG5leHRyZWFsVGltZUJ1bGxldFNjcmVlbi55KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRBY3R1YWxZKHJlYWxUaW1lQnVsbGV0U2NyZWVuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGFkZDogeyBhZGRUb1VwOiB0cnVlLCBub2RlOiBuZXdOb2RlIH0sIHN0b3A6IHRydWUgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvL+S4iuS4gOadoeW8ueW5lee7j+i/h+S4gOS4queCuemcgOimgeeahOaAu+aXtumVv1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmV4dHJlYWxUaW1lQnVsbGV0U2NyZWVuV2lkdGhUaW1lID0gbmV4dHJlYWxUaW1lQnVsbGV0U2NyZWVuLndpZHRoIC8gKG5leHRyZWFsVGltZUJ1bGxldFNjcmVlbi5idWxsZXRTY3JlZW4uc3R5bGUuc3BlZWQgKiBfb3B0aW9ucy5wbGF5U3BlZWQpO1xuICAgICAgICAgICAgICAgICAgICAvL+WmguaenOS4iuS4gOadoeW8ueW5leeahOa2iOWkseaXtumXtOWwj+S6juW9k+WJjeW8ueW5leeahOWHuueOsOaXtumXtFxuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dHJlYWxUaW1lQnVsbGV0U2NyZWVuLnN0YXJ0VGltZSArIG5leHRyZWFsVGltZUJ1bGxldFNjcmVlbldpZHRoVGltZSA+PSBub3dUaW1lIHx8IC8v5aaC5p6c5LiK5LiA5p2h5by55bmV55qE5aS06L+b5YWl5LqG77yM5L2G5piv5bC+6L+Y5rKh6L+b5YWlXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4uZW5kVGltZSA+PSByZWFsVGltZUJ1bGxldFNjcmVlbi5lbmRUaW1lIC0gcmVhbFRpbWVCdWxsZXRTY3JlZW5XaWR0aFRpbWUpIC8v5aaC5p6c5b2T5YmN5by55bmV5aS05Ye65Y675LqG77yM5LiK5LiA5p2h5by55bmV5bC+6L+Y5rKh5Ye65Y67XG4gICAgICAgICAgICAgICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi55ID0gbmV4dHJlYWxUaW1lQnVsbGV0U2NyZWVuLnkgKyBuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4uaGVpZ2h0ICsgX29wdGlvbnMudmVydGljYWxJbnRlcnZhbDtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4ueSA9IG5leHRyZWFsVGltZUJ1bGxldFNjcmVlbi55O1xuICAgICAgICAgICAgICAgIH0sIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5ld05vZGUubGlua2VkTGlzdCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHNldEFjdHVhbFkocmVhbFRpbWVCdWxsZXRTY3JlZW4pO1xuICAgICAgICAgICAgICAgIF9yZWFsVGltZUJ1bGxldFNjcmVlbnMucHVzaChuZXdOb2RlLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog6K6+572u55yf5a6e55qEWeWdkOagh1xuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVhbFRpbWVCdWxsZXRTY3JlZW4gLSDlrp7ml7blvLnluZXkuovku7ZcbiAgICAgICAgICogQHJldHVybnMge29iamVjdH0g5a6e5pe25by55bmV5LqL5Lu2XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBzZXRBY3R1YWxZKHJlYWxUaW1lQnVsbGV0U2NyZWVuKSB7XG4gICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuID0gcmVhbFRpbWVCdWxsZXRTY3JlZW4uYnVsbGV0U2NyZWVuO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbi50eXBlID09PSBHZW5lcmFsVHlwZS5sZWZ0VG9SaWdodCB8fFxuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbi50eXBlID09PSBHZW5lcmFsVHlwZS5yaWdodFRvTGVmdCB8fFxuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbi50eXBlID09PSBHZW5lcmFsVHlwZS50b3BcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLmFjdHVhbFkgPSByZWFsVGltZUJ1bGxldFNjcmVlbi55ICUgKF9lbGVtZW50U2l6ZS5oZWlnaHQgLSByZWFsVGltZUJ1bGxldFNjcmVlbi5oZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoYnVsbGV0U2NyZWVuLnR5cGUgPT09IEdlbmVyYWxUeXBlLmJvdHRvbSkge1xuICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLmFjdHVhbFkgPSBfZWxlbWVudFNpemUuaGVpZ2h0ICsgcmVhbFRpbWVCdWxsZXRTY3JlZW4ueSAlIF9lbGVtZW50U2l6ZS5oZWlnaHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog6K6+572u5bC65a+4XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBzZXRTaXplKCkge1xuICAgICAgICAgICAgbGV0IGRldmljZVBpeGVsUmF0aW8gPSBIZWxwZXIuZ2V0RGV2aWNlUGl4ZWxSYXRpbygpO1xuICAgICAgICAgICAgaWYgKF9vbGREZXZpY2VQaXhlbFJhdGlvICE9IGRldmljZVBpeGVsUmF0aW8gfHxcbiAgICAgICAgICAgICAgICBfb2xkQ2xpZW50V2lkdGggIT0gZWxlbWVudC5jbGllbnRXaWR0aCB8fFxuICAgICAgICAgICAgICAgIF9vbGRDbGllbnRIZWlnaHQgIT0gZWxlbWVudC5jbGllbnRIZWlnaHQgfHxcbiAgICAgICAgICAgICAgICBfb2xkU2NhbGluZyAhPSBfb3B0aW9ucy5zY2FsaW5nKSB7XG4gICAgICAgICAgICAgICAgX29sZFNjYWxpbmcgPSBfb3B0aW9ucy5zY2FsaW5nO1xuICAgICAgICAgICAgICAgIF9lbGVtZW50U2l6ZS53aWR0aCA9IGVsZW1lbnQuY2xpZW50V2lkdGggLyBfb3B0aW9ucy5zY2FsaW5nO1xuICAgICAgICAgICAgICAgIF9lbGVtZW50U2l6ZS5oZWlnaHQgPSBlbGVtZW50LmNsaWVudEhlaWdodCAvIF9vcHRpb25zLnNjYWxpbmc7XG4gICAgICAgICAgICAgICAgX29sZENsaWVudFdpZHRoID0gZWxlbWVudC5jbGllbnRXaWR0aDtcbiAgICAgICAgICAgICAgICBfb2xkQ2xpZW50SGVpZ2h0ID0gZWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgX29sZERldmljZVBpeGVsUmF0aW8gPSBkZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgICAgIF9yZW5kZXJlci5zZXRTaXplKCk7XG4gICAgICAgICAgICAgICAgaWYgKCFfcGxheWluZykgX3JlbmRlcmVyLmRyYXcoKTsgLy/pnZ7mkq3mlL7nirbmgIHliJnph43nu5hcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vSUUgRWRnZSDmtY/op4jlmajkuI3mlK/mjIEgJWNcbiAgICAgICAgaWYgKCEhd2luZG93LkFjdGl2ZVhPYmplY3QgfHwgXCJBY3RpdmVYT2JqZWN0XCIgaW4gd2luZG93IHx8IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIlRyaWRlbnRcIikgPiAtMSB8fFxuICAgICAgICAgICAgbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRVwiKSA+IC0xIHx8IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIkVkZ2VcIikgPiAtMSkgY29uc29sZS5pbmZvKFxuICAgICAgICAgICAgICAgIFJlc291cmNlcy5MT0FERURfSU5GT19JRS5maWxsRGF0YShidWlsZClcbiAgICAgICAgICAgICk7XG4gICAgICAgIC8vT3RoZXJcbiAgICAgICAgZWxzZSBjb25zb2xlLmluZm8oXG4gICAgICAgICAgICBSZXNvdXJjZXMuTE9BREVEX0lORk8uZmlsbERhdGEoYnVpbGQpLFxuICAgICAgICAgICAgJ2ZvbnQtd2VpZ2h0OmJvbGQ7IGNvbG9yOiMwMDk5RkY7JywgJycsICdmb250LXN0eWxlOml0YWxpYzsnLCAnJ1xuICAgICAgICApO1xuICAgIH1cbn1cbiJdLCJmaWxlIjoiZW5naW5lcy9nZW5lcmFsRW5naW5lLmpzIn0=
