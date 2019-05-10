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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZXMvZ2VuZXJhbEVuZ2luZS5qcyJdLCJuYW1lcyI6WyJHZW5lcmFsRW5naW5lIiwiZWxlbWVudCIsIm9wdGlvbnMiLCJyZW5kZXJNb2RlIiwiX3N0YXJ0VGltZSIsIl9wYXVzZVRpbWUiLCJfYnVsbGV0U2NyZWVuQnVmZmVyIiwiTGlua2VkTGlzdCIsIl9yZWFsVGltZUJ1bGxldFNjcmVlbnMiLCJfZGVsYXlCdWxsZXRTY3JlZW5Db3VudCIsIl9kZWxheSIsIl9wbGF5aW5nIiwiX3JlZnJlc2hSYXRlIiwiX2xhc3RSZWZyZXNoVGltZSIsIl9vcHRpb25zIiwiX2RlZmF1bHRPcHRpb25zIiwidmVydGljYWxJbnRlcnZhbCIsInBsYXlTcGVlZCIsImNsb2NrIiwidGltZSIsIkRhdGUiLCJnZXRUaW1lIiwic2NhbGluZyIsInRpbWVPdXREaXNjYXJkIiwiaGlkZGVuVHlwZXMiLCJvcGFjaXR5IiwiY3Vyc29yT25Nb3VzZU92ZXIiLCJkZWZhdWx0U3R5bGUiLCJzaGFkb3dCbHVyIiwiZm9udFdlaWdodCIsImZvbnRGYW1pbHkiLCJzaXplIiwiYm94Q29sb3IiLCJjb2xvciIsImJvcmRlckNvbG9yIiwic3BlZWQiLCJyZXNpZGVuY2VUaW1lIiwiX29wdGlvbnNUeXBlIiwiX2RlZmF1bHRCdWxsZXRTY3JlZW4iLCJ0ZXh0IiwiY2FuRGlzY2FyZCIsInN0YXJ0VGltZSIsInR5cGUiLCJHZW5lcmFsVHlwZSIsInJpZ2h0VG9MZWZ0IiwibGF5ZXIiLCJfYnVsbGV0U2NyZWVuVHlwZSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIndpbmRvdyIsImNvbnNvbGUiLCJ3YXJuIiwiUmVzb3VyY2VzIiwiUkVRVUVTVEFOSU1BVElPTkZSQU1FX05PVF9TVVBQT1JUX1dBUk4iLCJmdW4iLCJzZXRUaW1lb3V0IiwiSGVscGVyIiwic2V0VmFsdWVzIiwiX2V2ZW50IiwiRXZlbnQiLCJhZGQiLCJiaW5kIiwidW5iaW5kIiwiX2VsZW1lbnRTaXplIiwid2lkdGgiLCJjbGllbnRXaWR0aCIsImhlaWdodCIsImNsaWVudEhlaWdodCIsIl9vbGREZXZpY2VQaXhlbFJhdGlvIiwiZ2V0RGV2aWNlUGl4ZWxSYXRpbyIsIl9vbGRTY2FsaW5nIiwiX29sZENsaWVudFdpZHRoIiwiX29sZENsaWVudEhlaWdodCIsIl9vbGRIaWRkZW5UeXBlcyIsIl9vbGRPcGFjaXR5IiwicmVuZGVyZXJzRmFjdG9yeSIsIlJlbmRlcmVyc0ZhY3RvcnkiLCJidWxsZXRTY3JlZW5FdmVudFRyaWdnZXIiLCJfcmVuZGVyZXIiLCJnZXRHZW5lcmFsUmVuZGVyZXIiLCJzZXRJbnRlcnZhbCIsInNldFNpemUiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldCIsImNsb25lIiwic2V0IiwiZHJhdyIsInNldE9wYWNpdHkiLCJidWxsZXRTY3JlZW4iLCJsZWZ0VG9SaWdodCIsInRvcCIsImJvdHRvbSIsIlR5cGVFcnJvciIsIlBBUkFNRVRFUlNfVFlQRV9FUlJPUiIsImNoZWNrVHlwZXMiLCJzdHlsZSIsIm5ld05vZGUiLCJub2RlIiwiZm9yRWFjaCIsImxhc3RCdWxsZXRTY3JlZW4iLCJhZGRUb1VwIiwic3RvcCIsImxpbmtlZExpc3QiLCJwdXNoIiwicGxheSIsInJlZnJlc2giLCJwbGF5QWxsQnVsbGV0U2NyZWVucyIsInBhdXNlIiwiY2xlYW5CdWZmZXIiLCJjbGVhbiIsImNsZWFuU2NyZWVuIiwicmVuZGVyZXIiLCJnZXRWaXNpYmlsaXR5IiwidmlzaWJpbGl0eSIsInNob3ciLCJoaWRlIiwicmVhbFRpbWVCdWxsZXRTY3JlZW5Db3VudCIsImxlbmd0aCIsImJ1ZmZlckJ1bGxldFNjcmVlbkNvdW50IiwiZGVsYXkiLCJkZWxheUJ1bGxldFNjcmVlbkNvdW50IiwiZnBzIiwiTWF0aCIsImZsb29yIiwibmFtZSIsInJlYWxUaW1lQnVsbGV0U2NyZWVuIiwiZSIsInBhZ2VYIiwiZG9jIiwiZG9jdW1lbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJib2R5IiwiY2xpZW50WCIsInNjcm9sbExlZnQiLCJjbGllbnRMZWZ0IiwicGFnZVkiLCJjbGllbnRZIiwic2Nyb2xsVG9wIiwiY2xpZW50VG9wIiwidHJpZ2dlciIsImdldEJ1bGxldFNjcmVlbiIsInNldEJ1bGxldFNjcmVlbiIsInJlZHJhdyIsImJ1bGxldFNjcmVlblR5cGUiLCJyZUNyZWF0QW5kZ2V0V2lkdGgiLCJnZXRQbGF5U3RhdGUiLCJzZXRQbGF5U3RhdGUiLCJzY3JlZW5YIiwic2NyZWVuWSIsIm5vd1RpbWUiLCJhZGRyZWFsVGltZUJ1bGxldFNjcmVlbnMiLCJtb3ZlcmVhbFRpbWVCdWxsZXRTY3JlZW4iLCJ4IiwicmVtb3ZlIiwiZW5kVGltZSIsInRpbWVzIiwicG9wIiwiZ2V0UmVhbFRpbWVCdWxsZXRTY3JlZW4iLCJjcmVhdEFuZGdldFdpZHRoIiwicm91bmQiLCJ5IiwibmV4dHJlYWxUaW1lQnVsbGV0U2NyZWVuIiwic2V0QWN0dWFsWSIsInJlYWxUaW1lQnVsbGV0U2NyZWVuV2lkdGhUaW1lIiwibmV4dHJlYWxUaW1lQnVsbGV0U2NyZWVuV2lkdGhUaW1lIiwiYWN0dWFsWSIsImRldmljZVBpeGVsUmF0aW8iLCJBY3RpdmVYT2JqZWN0IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwiaW5kZXhPZiIsImluZm8iLCJMT0FERURfSU5GT19JRSIsImZpbGxEYXRhIiwiYnVpbGQiLCJMT0FERURfSU5GTyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7SUFXcUJBLGE7QUFDakI7Ozs7OztBQU1BLHVCQUFZQyxPQUFaLEVBQXFCQyxPQUFyQixFQUFxRDtBQUFBLE1BQXZCQyxVQUF1Qix1RUFBVixRQUFVOztBQUFBOztBQUVqRDs7OztBQUlBLE1BQUlDLFVBQUo7QUFDQTs7Ozs7O0FBSUEsTUFBSUMsVUFBVSxHQUFHLENBQWpCO0FBQ0E7Ozs7O0FBSUEsTUFBSUMsbUJBQW1CLEdBQUcsSUFBSUMsc0JBQUosRUFBMUI7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QW9CQyxPQUFwQixDQUE0QixNQUE1QixJQUFzQyxDQUFDLENBRHZGLEVBQzBGekgsT0FBTyxDQUFDMEgsSUFBUixDQUNsRnhILHNCQUFVeUgsY0FBVixDQUF5QkMsUUFBekIsQ0FBa0NDLEtBQWxDLENBRGtGLEVBRDFGLEtBS0s3SCxPQUFPLENBQUMwSCxJQUFSLENBQ0R4SCxzQkFBVTRILFdBQVYsQ0FBc0JGLFFBQXRCLENBQStCQyxLQUEvQixDQURDLEVBRUQsa0NBRkMsRUFFbUMsRUFGbkMsRUFFdUMsb0JBRnZDLEVBRTZELEVBRjdEO0FBSVIsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMaW5rZWRMaXN0IGZyb20gJy4uL2xpYi9saW5rZWRMaXN0J1xuaW1wb3J0IEV2ZW50IGZyb20gJy4uL2xpYi9ldmVudCdcbmltcG9ydCBSZW5kZXJlcnNGYWN0b3J5IGZyb20gJy4uL3JlbmRlcmVycy9yZW5kZXJlcnNGYWN0b3J5J1xuaW1wb3J0IEdlbmVyYWxUeXBlIGZyb20gJy4vZ2VuZXJhbFR5cGUnXG5pbXBvcnQgSGVscGVyIGZyb20gJy4uL2xpYi9oZWxwZXInXG5pbXBvcnQgUmVzb3VyY2VzIGZyb20gJy4uL2xpYi9yZXNvdXJjZXMnXG5pbXBvcnQgKiBhcyBidWlsZCBmcm9tICcuLi9idWlsZC5qc29uJ1xuXG4vKiogXG4gKiDlvLnluZXlvJXmk47lr7nosaHnsbsgXG4gKiBAYWxpYXMgb3BlbkJTRS5HZW5lcmFsRW5naW5lXG4gKiBAcHJvcGVydHkge29wZW5CU0V+T3B0aW9uc30gb3B0aW9ucyAtIOiuvue9ruaIluiOt+WPluWFqOWxgOmAiemhueOAglxuICogQHByb3BlcnR5IHtib29sfSB2aXNpYmlsaXR5IC0g6I635Y+W5oiW6K6+572u5by55bmV5Y+v6KeB5oCn44CCXG4gKiBAcHJvcGVydHkge3N0cmluZ30gcmVuZGVyTW9kZSAtIOiOt+WPlua4suafk+aooeW8j+OAguWPluWAvOS4uuKAnGNhbnZhc+KAneOAgeKAnGNzczPigJ3jgIHigJx3ZWJnbOKAneaIluKAnHN2Z+KAneOAglxuICogQHByb3BlcnR5IHtib29sfSBwbGF5U3RhdGUgLSDojrflj5bmkq3mlL7nirbmgIHjgIJ0cnVl77ya5q2j5Zyo5pKt5pS+77ybZmFsc2XvvJrlt7LmmoLlgZwv5YGc5q2i5pKt5pS+44CCXG4gKiBAcHJvcGVydHkge29wZW5CU0V+RGVidWdJbmZvfSBkZWJ1Z0luZm8gLSDojrflj5bosIPor5Xkv6Hmga/jgIJcbiAqIEB0aHJvd3Mge29wZW5CU0UuQnJvd3Nlck5vdFN1cHBvcnRFcnJvcn0g5rWP6KeI5Zmo5LiN5pSv5oyB54m55a6a5riy5p+T5qih5byP5pe25byV5Y+R6ZSZ6K+v44CCXG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9IOS8oOWFpeeahOWPguaVsOmUmeivr+aXtuW8leWPkemUmeivr+OAguivt+WPgumYhSBNRE4gW1R5cGVFcnJvcl17QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvemgtQ04vZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvVHlwZUVycm9yfSDjgIJcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2VuZXJhbEVuZ2luZSB7XG4gICAgLyoqXG4gICAgICog5Yib5bu65LiA5Liq5by55bmV5byV5pOO5a+56LGh44CCXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IC0g6KaB5Yqg6L295by55bmV55qE5YWD57Sg77ya5pyJ5YWzIEVsZW1lbnQg5o6l5Y+j55qE5L+h5oGv6K+35Y+C6ZiFTUROIFtFbGVtZW50XXtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy96aC1DTi9kb2NzL1dlYi9BUEkvRWxlbWVudH0g44CCXG4gICAgICogQHBhcmFtIHtvcGVuQlNFfk9wdGlvbnN9IFtfb3B0aW9uc10gLSDlhajlsYDpgInpobnvvJrkuIDkuKoge0BsaW5rIG9wZW5CU0V+T3B0aW9uc30g57uT5p6E44CCXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtyZW5kZXJNb2RlPVwiY2FudmFzXCJdIC0g5riy5p+T5qih5byP77ya6buY6K6k5Li64oCcY2FudmFz4oCdLCDigJzlj6/pgIljc3Mz4oCd77yMIOKAnHdlYmds4oCd5ZKM4oCcc3Zn4oCd44CC5LiA6Iis5bu66K6u5L2/55So4oCcY2FudmFz4oCd77yI54m55Yir5pivIEZpcmVGb3gg5rWP6KeI5ZmoIENTUzMg5riy5p+T5pWI546H6L6D5L2O77yJ44CC5Zyo5LiA5Lqb54mI5pys6L6D6ICB55qE5rWP6KeI5Zmo5Lit4oCcd2luZG93LmRldmljZVBpeGVsUmF0aW/igJ3lj5jph4/kuI3ooqvmlK/mjIHmiJbmlK/mjIHkuI3lrozmlbTvvIzov5nkvJrlr7zoh7TlnKjpq5hEUEnlkozpobXpnaLooqvnvKnmlL7nmoTmg4XlhrXkuIvigJxjYW52YXPigJ3lkozigJx3ZWJnbOKAnea4suafk+aooeW8j+W8ueW5leaYvuekuuS4jeato+W4uOeahOaDheWGte+8iOW8ueW5leaooeeziu+8ie+8jOatpOaXtuW7uuiuruS9v+eUqOKAnGNzczPigJ3muLLmn5PmqKHlvI/jgIJcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBvcHRpb25zLCByZW5kZXJNb2RlID0gJ2NhbnZhcycpIHtcbiAgICAgICAgLy/lj5jph4/liJ3lp4vljJZcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOW8gOWni+aXtumXtFxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9zdGFydFRpbWU7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmmoLlgZzml7bpl7RcbiAgICAgICAgICogQHByaXZhdGUgQHR5cGUge251bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIGxldCBfcGF1c2VUaW1lID0gMDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOW8ueW5lee8k+WGsuWMulxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7TGlua2VkTGlzdH1cbiAgICAgICAgICovXG4gICAgICAgIGxldCBfYnVsbGV0U2NyZWVuQnVmZmVyID0gbmV3IExpbmtlZExpc3QoKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWunuaXtuW8ueW5leWIl+ihqFxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7TGlua2VkTGlzdH1cbiAgICAgICAgICovXG4gICAgICAgIGxldCBfcmVhbFRpbWVCdWxsZXRTY3JlZW5zID0gbmV3IExpbmtlZExpc3QoKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOW7tui/n+W8ueW5leaAu+aVsFxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9kZWxheUJ1bGxldFNjcmVlbkNvdW50ID0gMDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOW7tui/n++8iOWNleS9je+8muavq+enku+8iVxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9kZWxheSA9IDA7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmkq3mlL7moIflv5dcbiAgICAgICAgICogQHByaXZhdGUgQHR5cGUge2Jvb2xlYW59XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgX3BsYXlpbmc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliLfmlrDpopHnjodcbiAgICAgICAgICogQHByaXZhdGUgQHR5cGUge251bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIGxldCBfcmVmcmVzaFJhdGUgPSAwLjA2OyAvL+WIneWni+WIt+aWsOmikeeOh1xuICAgICAgICAvKipcbiAgICAgICAgICog5LiK5LiA5qyh5Yi35paw5pe26Ze0XG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgX2xhc3RSZWZyZXNoVGltZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWFqOWxgOmAiemhuVxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7b3BlbkJTRX5nZW5lcmFsT3B0aW9uc31cbiAgICAgICAgICovXG4gICAgICAgIGxldCBfb3B0aW9ucztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOm7mOiupOWFqOWxgOWPmOmHj1xuICAgICAgICAgKiBAcHJpdmF0ZSBAcmVhZG9ubHlcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9kZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgICAgIC8qKiDlnoLnm7Tpl7Tot50gKi9cbiAgICAgICAgICAgIHZlcnRpY2FsSW50ZXJ2YWw6IDgsXG4gICAgICAgICAgICAvKiog5pKt5pS+6YCf5bqmKOWAjeaVsCkgKi9cbiAgICAgICAgICAgIHBsYXlTcGVlZDogMSxcbiAgICAgICAgICAgIC8qKiDml7bpl7Tln7rlh4YgKi9cbiAgICAgICAgICAgIGNsb2NrOiB0aW1lID0+IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gX3N0YXJ0VGltZSxcbiAgICAgICAgICAgIC8qKiDnvKnmlL7mr5TkvosgKi9cbiAgICAgICAgICAgIHNjYWxpbmc6IDEsXG4gICAgICAgICAgICAvKiog6LaF5pe25Lii5byDICovXG4gICAgICAgICAgICB0aW1lT3V0RGlzY2FyZDogdHJ1ZSxcbiAgICAgICAgICAgIC8qKiDopoHpmpDol4/nmoTlvLnluZXnsbvlnosgKi9cbiAgICAgICAgICAgIGhpZGRlblR5cGVzOiAwLFxuICAgICAgICAgICAgLyoqIOW8ueW5leS4jemAj+aYjuW6piAqL1xuICAgICAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgICAgIC8qKiDpvKDmoIfnu4/ov4fmoLflvI8gKi9cbiAgICAgICAgICAgIGN1cnNvck9uTW91c2VPdmVyOiAncG9pbnRlcicsXG4gICAgICAgICAgICAvKiog6buY6K6k5by55bmV5qC35byPICovXG4gICAgICAgICAgICBkZWZhdWx0U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAvKiog6Zi05b2x55qE5qih57OK57qn5Yir77yMMOS4uuS4jeaYvuekuumYtOW9sSAqL1xuICAgICAgICAgICAgICAgIHNoYWRvd0JsdXI6IDIsXG4gICAgICAgICAgICAgICAgLyoqIOWtl+S9k+eyl+e7hiAqL1xuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICc2MDAnLFxuICAgICAgICAgICAgICAgIC8qKiDlrZfkvZPns7vliJcgKi9cbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAnc2Fucy1zZXJpZicsXG4gICAgICAgICAgICAgICAgLyoqIOWtl+S9k+Wkp+Wwj++8iOWNleS9je+8muWDj+e0oO+8iSAqL1xuICAgICAgICAgICAgICAgIHNpemU6IDI1LFxuICAgICAgICAgICAgICAgIC8qKiDlpJbmoYbpopzoibIgKi9cbiAgICAgICAgICAgICAgICBib3hDb2xvcjogbnVsbCxcbiAgICAgICAgICAgICAgICAvKiog5a2X5L2T6aKc6ImyICovXG4gICAgICAgICAgICAgICAgY29sb3I6ICd3aGl0ZScsXG4gICAgICAgICAgICAgICAgLyoqIOaPj+i+ueminOiJsiAqL1xuICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiBudWxsLFxuICAgICAgICAgICAgICAgIC8qKiDlvLnluZXpgJ/luqbvvIjljZXkvY3vvJrlg4/ntKAv5q+r56eS77yJIOS7hea1geW8ueW5leexu+Wei+acieaViCAqL1xuICAgICAgICAgICAgICAgIHNwZWVkOiAwLjE1LFxuICAgICAgICAgICAgICAgIC8qKiDlvLnluZXlgZznlZnml7bpl7Qg5LuF5Zu65a6a5by55bmV57G75Z6L5pyJ5pWIICovXG4gICAgICAgICAgICAgICAgcmVzaWRlbmNlVGltZTogNTAwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWFqOWxgOmAiemhueexu+Wei1xuICAgICAgICAgKiBAcHJpdmF0ZSBAcmVhZG9ubHlcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9vcHRpb25zVHlwZSA9IHtcbiAgICAgICAgICAgIHZlcnRpY2FsSW50ZXJ2YWw6ICdudW1iZXInLFxuICAgICAgICAgICAgcGxheVNwZWVkOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIGNsb2NrOiAnZnVuY3Rpb24nLFxuICAgICAgICAgICAgc2NhbGluZzogJ251bWJlcicsXG4gICAgICAgICAgICB0aW1lT3V0RGlzY2FyZDogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgaGlkZGVuVHlwZXM6ICdudW1iZXInLFxuICAgICAgICAgICAgb3BhY2l0eTogJ251bWJlcicsXG4gICAgICAgICAgICBjdXJzb3JPbk1vdXNlT3ZlcjogJ3N0cmluZycsXG4gICAgICAgICAgICBkZWZhdWx0U3R5bGU6IHtcbiAgICAgICAgICAgICAgICBzaGFkb3dCbHVyOiAnbnVtYmVyJyxcbiAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBbJ3N0cmluZycsICdudW1iZXInXSxcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICBzaXplOiAnbnVtYmVyJyxcbiAgICAgICAgICAgICAgICBib3hDb2xvcjogWydzdHJpbmcnLCAnbnVsbCddLFxuICAgICAgICAgICAgICAgIGNvbG9yOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogWydzdHJpbmcnLCAnbnVsbCddLFxuICAgICAgICAgICAgICAgIHNwZWVkOiAnbnVtYmVyJyxcbiAgICAgICAgICAgICAgICByZXNpZGVuY2VUaW1lOiAnbnVtYmVyJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOm7mOiupOW8ueW5leaVsOaNrlxuICAgICAgICAgKiBAcHJpdmF0ZSBAcmVhZG9ubHlcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9kZWZhdWx0QnVsbGV0U2NyZWVuID0ge1xuICAgICAgICAgICAgLyoqIOW8ueW5leaWh+acrCAqL1xuICAgICAgICAgICAgdGV4dDogbnVsbCxcbiAgICAgICAgICAgIC8qKiDmmK/lkKblhYHorrjkuKLlvIMgKi9cbiAgICAgICAgICAgIGNhbkRpc2NhcmQ6IHRydWUsXG4gICAgICAgICAgICAvKiog5by55bmV6L+b5YWl5pe26Ze0ICovXG4gICAgICAgICAgICBzdGFydFRpbWU6IG51bGwsXG4gICAgICAgICAgICAvKiog5by55bmV57G75Z6LICovXG4gICAgICAgICAgICB0eXBlOiBHZW5lcmFsVHlwZS5yaWdodFRvTGVmdCxcbiAgICAgICAgICAgIC8qKiDlvLnluZXlsYLnuqfvvIjotorlpKfotorliY3vvIkgKi9cbiAgICAgICAgICAgIGxheWVyOiAwXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5by55bmV5pWw5o2u57G75Z6LXG4gICAgICAgICAqIEBwcml2YXRlIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX2J1bGxldFNjcmVlblR5cGUgPSB7XG4gICAgICAgICAgICB0ZXh0OiAnc3RyaW5nJyxcbiAgICAgICAgICAgIGNhbkRpc2NhcmQ6ICdib29sZWFuJyxcbiAgICAgICAgICAgIHN0YXJ0VGltZTogJ251bWJlcicsXG4gICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIGxheWVyOiAnbnVtYmVyJ1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHJlcXVlc3RBbmltYXRpb25GcmFtZSDlrprkuYnvvIjkuIDkupvogIHlvI/mtY/op4jlmajkuI3mlK/mjIEgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIO+8iVxuICAgICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmdW4gLSDlm57osIPmlrnms5UgXG4gICAgICAgICAqIEBmdW5jdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IHJlcXVlc3RBbmltYXRpb25GcmFtZTtcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSAnZnVuY3Rpb24nKSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihSZXNvdXJjZXMuUkVRVUVTVEFOSU1BVElPTkZSQU1FX05PVF9TVVBQT1JUX1dBUk4pO1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gKGZ1bikgPT4gd2luZG93LnNldFRpbWVvdXQoZnVuLCAxNyk7IC8vNjBmcHNcbiAgICAgICAgfVxuXG4gICAgICAgIF9vcHRpb25zID0gSGVscGVyLnNldFZhbHVlcyhvcHRpb25zLCBfZGVmYXVsdE9wdGlvbnMsIF9vcHRpb25zVHlwZSk7IC8v6K6+572u6buY6K6k5YC8XG5cbiAgICAgICAgLy/kuovku7bliJ3lp4vljJZcbiAgICAgICAgbGV0IF9ldmVudCA9IG5ldyBFdmVudCgpO1xuICAgICAgICAvKipcbiAgICAgICAgICog5by55bmV5Y2V5Ye75LqL5Lu244CC5b2T5Y2V5Ye75by55bmV5pe26Kem5Y+R44CCXG4gICAgICAgICAqIEBldmVudCBvcGVuQlNFLkdlbmVyYWxFbmdpbmUjY2xpY2tcbiAgICAgICAgICogQHByb3BlcnR5IHtvcGVuQlNFfkdlbmVyYWxFdmVudH0gZSAtIOW8ueW5leS6i+S7tue7k+aehFxuICAgICAgICAgKi9cbiAgICAgICAgX2V2ZW50LmFkZCgnY2xpY2snKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOW8ueW5leS4iuS4i+aWh+iPnOWNleS6i+S7tuOAguW9k+inpuWPkeW8ueW5leS4iuS4i+aWh+iPnOWNleaXtuinpuWPkeOAglxuICAgICAgICAgKiBAZXZlbnQgb3BlbkJTRS5HZW5lcmFsRW5naW5lI2NvbnRleHRtZW51XG4gICAgICAgICAqIEBwcm9wZXJ0eSB7b3BlbkJTRX5HZW5lcmFsQnVsbGV0U2NyZWVuRXZlbnR9IGUgLSDlvLnluZXkuovku7bnu5PmnoRcbiAgICAgICAgICovXG4gICAgICAgIF9ldmVudC5hZGQoJ2NvbnRleHRtZW51Jyk7XG4gICAgICAgIC8qKlxuICAgICAgICAqIOW8ueW5lem8oOagh+emu+W8gOS6i+S7tuOAguW9k+m8oOagh+emu+W8gOW8ueW5leaXtuinpuWPkeOAglxuICAgICAgICAqIEBldmVudCBvcGVuQlNFLkdlbmVyYWxFbmdpbmUjbW91c2VsZWF2ZVxuICAgICAgICAqIEBwcm9wZXJ0eSB7b3BlbkJTRX5HZW5lcmFsQnVsbGV0U2NyZWVuRXZlbnR9IGUgLSDlvLnluZXkuovku7bnu5PmnoRcbiAgICAgICAgKi9cbiAgICAgICAgX2V2ZW50LmFkZCgnbW91c2VsZWF2ZScpO1xuICAgICAgICAvKipcbiAgICAgICAgICog5by55bmV6byg5qCH6L+b5YWl5LqL5Lu244CC5b2T6byg5qCH6L+b5YWl5by55bmV5pe26Kem5Y+R44CCXG4gICAgICAgICAqIEBldmVudCBvcGVuQlNFLkdlbmVyYWxFbmdpbmUjbW91c2VlbnRlclxuICAgICAgICAgKiBAcHJvcGVydHkge29wZW5CU0V+R2VuZXJhbEJ1bGxldFNjcmVlbkV2ZW50fSBlIC0g5by55bmV5LqL5Lu257uT5p6EXG4gICAgICAgICAqL1xuICAgICAgICBfZXZlbnQuYWRkKCdtb3VzZWVudGVyJyk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDnu5Hlrprkuovku7blpITnkIbnqIvluo9cbiAgICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiDnu5Hlrprkuovku7blpITnkIbnqIvluo/jgILlvZPkuovku7blpITnkIbnqIvluo/ov5Tlm57lgLzkuLogZmFsc2Ug5pe25YGc5q2i5YaS5rOh44CCXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0g5LqL5Lu25ZCN56ewXG4gICAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZ1biAtIOS6i+S7tuWkhOeQhueoi+W6j1xuICAgICAgICAgKiBAbGlzdGVucyBvcGVuQlNFLkdlbmVyYWxFbmdpbmUjY2xpY2tcbiAgICAgICAgICogQGxpc3RlbnMgb3BlbkJTRS5HZW5lcmFsRW5naW5lI2NvbnRleHRtZW51XG4gICAgICAgICAqIEBsaXN0ZW5zIG9wZW5CU0UuR2VuZXJhbEVuZ2luZSNtb3VzZWxlYXZlXG4gICAgICAgICAqIEBsaXN0ZW5zIG9wZW5CU0UuR2VuZXJhbEVuZ2luZSNtb3VzZWVudGVyXG4gICAgICAgICAqIEB0aHJvd3Mge1R5cGVFcnJvcn0g5Lyg5YWl55qE5Y+C5pWw6ZSZ6K+v5oiW5LqL5Lu25LiN5a2Y5Zyo5pe25byV5Y+R6ZSZ6K+v44CC6K+35Y+C6ZiFIE1ETiBbVHlwZUVycm9yXXtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy96aC1DTi9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9UeXBlRXJyb3J9IOOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5iaW5kID0gX2V2ZW50LmJpbmQ7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDop6Pnu5Hkuovku7blpITnkIbnqIvluo/vvIhmdW7kuLrnqbrop6Pnu5HmiYDmnInkuovku7blpITnkIbnqIvluo/vvIlcbiAgICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0g5LqL5Lu25ZCN56ewXG4gICAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZ1biAtIOS6i+S7tuWkhOeQhueoi+W6j1xuICAgICAgICAgKiBAdGhyb3dzIHtUeXBlRXJyb3J9IOS8oOWFpeeahOWPguaVsOmUmeivr+aIluS6i+S7tuS4jeWtmOWcqOaXtuW8leWPkemUmeivr+OAguivt+WPgumYhSBNRE4gW1R5cGVFcnJvcl17QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvemgtQ04vZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvVHlwZUVycm9yfSDjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudW5iaW5kID0gX2V2ZW50LnVuYmluZDtcbiAgICAgICAgLy/liJ3lp4vljJZcbiAgICAgICAgbGV0IF9lbGVtZW50U2l6ZSA9IHtcbiAgICAgICAgICAgIHdpZHRoOiBlbGVtZW50LmNsaWVudFdpZHRoIC8gX29wdGlvbnMuc2NhbGluZyxcbiAgICAgICAgICAgIGhlaWdodDogZWxlbWVudC5jbGllbnRIZWlnaHQgLyBfb3B0aW9ucy5zY2FsaW5nXG4gICAgICAgIH1cbiAgICAgICAgbGV0IF9vbGREZXZpY2VQaXhlbFJhdGlvID0gSGVscGVyLmdldERldmljZVBpeGVsUmF0aW8oKTtcbiAgICAgICAgbGV0IF9vbGRTY2FsaW5nID0gX29wdGlvbnMuc2NhbGluZztcbiAgICAgICAgbGV0IF9vbGRDbGllbnRXaWR0aCA9IGVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgIGxldCBfb2xkQ2xpZW50SGVpZ2h0ID0gZWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gICAgICAgIGxldCBfb2xkSGlkZGVuVHlwZXMgPSBfb3B0aW9ucy5oaWRkZW5UeXBlcztcbiAgICAgICAgbGV0IF9vbGRPcGFjaXR5ID0gX29wdGlvbnMub3BhY2l0eTtcbiAgICAgICAgLy/muLLmn5Plmajlt6XljoJcbiAgICAgICAgbGV0IHJlbmRlcmVyc0ZhY3RvcnkgPSBuZXcgUmVuZGVyZXJzRmFjdG9yeShlbGVtZW50LCBfb3B0aW9ucywgX2VsZW1lbnRTaXplLCBidWxsZXRTY3JlZW5FdmVudFRyaWdnZXIpO1xuICAgICAgICBsZXQgX3JlbmRlcmVyID0gcmVuZGVyZXJzRmFjdG9yeS5nZXRHZW5lcmFsUmVuZGVyZXIocmVuZGVyTW9kZSk7IC8v5a6e5L6L5YyW5riy5p+T5ZmoXG4gICAgICAgIHNldEludGVydmFsKHNldFNpemUsIDEwMCk7XG5cbiAgICAgICAgLy/lhazlhbHlh73mlbBcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiuvue9ruaIluiOt+WPluWFqOWxgOmAiemhuVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiovXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnb3B0aW9ucycsIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBIZWxwZXIuY2xvbmUoX29wdGlvbnMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBfb3B0aW9ucyA9IEhlbHBlci5zZXRWYWx1ZXMob3B0aW9ucywgX29wdGlvbnMsIF9vcHRpb25zVHlwZSwgZmFsc2UpOyAvL+iuvue9rum7mOiupOWAvFxuICAgICAgICAgICAgICAgIGlmIChfb2xkSGlkZGVuVHlwZXMgIT0gX29wdGlvbnMuaGlkZGVuVHlwZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgX29sZEhpZGRlblR5cGVzID0gX29wdGlvbnMuaGlkZGVuVHlwZXM7XG4gICAgICAgICAgICAgICAgICAgIGlmICghX3BsYXlpbmcpIF9yZW5kZXJlci5kcmF3KCk7IC8v6Z2e5pKt5pS+54q25oCB5YiZ6YeN57uYXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChfb2xkT3BhY2l0eSAhPSBfb3B0aW9ucy5vcGFjaXR5KSB7XG4gICAgICAgICAgICAgICAgICAgIF9vbGRPcGFjaXR5ID0gX29wdGlvbnMub3BhY2l0eTtcbiAgICAgICAgICAgICAgICAgICAgX3JlbmRlcmVyLnNldE9wYWNpdHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmt7vliqDlvLnluZXliLDlvLnluZXliJfooajjgIJcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIOa3u+WKoOW8ueW5leWIsOW8ueW5leWIl+ihqOOAgueUseS6juW8ueW5leWcqOWxj+W5leS4iuWHuueOsOi/h+WQju+8jOW8ueW5leW8leaTjuWwhuS7juWIl+ihqOS4reW9u+W6leWIoOmZpOatpOW8ueW5leOAguaJgOS7pe+8jOWcqOaUueWPmOaSreaUvui/m+W6puaXtu+8jOWPr+iDvemcgOimgeWFiFvmuIXnqbrlvLnluZXliJfooahde0BsaW5rIG9wZW5CU0UuQnVsbGV0U2NyZWVuRW5naW5lI2NsZWFuQnVsbGV0U2NyZWVuTGlzdH3vvIznhLblkI7ph43mlrDliqDovb3mraTmkq3mlL7ov5vluqbku6XlkI7nmoTlvLnluZXjgIJcbiAgICAgICAgICogQHBhcmFtIHtvcGVuQlNFfkdlbmVyYWxCdWxsZXRTY3JlZW59IGJ1bGxldFNjcmVlbiAtIOWNleadoeW8ueW5leaVsOaNru+8muS4gOS4qiB7QGxpbmsgb3BlbkJTRX5HZW5lcmFsQnVsbGV0U2NyZWVufSDnu5PmnoTjgIJcbiAgICAgICAgICogQHRocm93cyB7VHlwZUVycm9yfSDkvKDlhaXnmoTlj4LmlbDplJnor6/ml7blvJXlj5HplJnor6/jgILor7flj4LpmIUgTUROIFtUeXBlRXJyb3Jde0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3poLUNOL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1R5cGVFcnJvcn0g44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmFkZCA9IGZ1bmN0aW9uIChidWxsZXRTY3JlZW4pIHtcbiAgICAgICAgICAgIF9kZWZhdWx0QnVsbGV0U2NyZWVuLnN0YXJ0VGltZSA9IF9vcHRpb25zLmNsb2NrKCk7XG4gICAgICAgICAgICBidWxsZXRTY3JlZW4gPSBIZWxwZXIuc2V0VmFsdWVzKGJ1bGxldFNjcmVlbiwgX2RlZmF1bHRCdWxsZXRTY3JlZW4sIF9idWxsZXRTY3JlZW5UeXBlKTsgLy/orr7nva7pu5jorqTlgLxcblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbi50eXBlICE9IEdlbmVyYWxUeXBlLmxlZnRUb1JpZ2h0ICYmXG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuLnR5cGUgIT0gR2VuZXJhbFR5cGUucmlnaHRUb0xlZnQgJiZcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW4udHlwZSAhPSBHZW5lcmFsVHlwZS50b3AgJiZcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW4udHlwZSAhPSBHZW5lcmFsVHlwZS5ib3R0b21cbiAgICAgICAgICAgICkgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuUEFSQU1FVEVSU19UWVBFX0VSUk9SKTtcblxuICAgICAgICAgICAgSGVscGVyLmNoZWNrVHlwZXMoYnVsbGV0U2NyZWVuLnN0eWxlLCBfb3B0aW9uc1R5cGUuZGVmYXVsdFN0eWxlKTsgLy/mo4Dmn6XlvLnluZXmoLflvI/nsbvlnotcblxuICAgICAgICAgICAgbGV0IG5ld05vZGUgPSBuZXcgTGlua2VkTGlzdC5ub2RlKGJ1bGxldFNjcmVlbik7XG4gICAgICAgICAgICBfYnVsbGV0U2NyZWVuQnVmZmVyLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgbGFzdEJ1bGxldFNjcmVlbiA9IG5vZGUuZWxlbWVudDtcbiAgICAgICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuLnN0YXJ0VGltZSA+IGxhc3RCdWxsZXRTY3JlZW4uc3RhcnRUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGQ6IHsgYWRkVG9VcDogdHJ1ZSwgbm9kZTogbmV3Tm9kZSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRydWUpO1xuICAgICAgICAgICAgaWYgKG5ld05vZGUubGlua2VkTGlzdCA9PT0gbnVsbCkgX2J1bGxldFNjcmVlbkJ1ZmZlci5wdXNoKG5ld05vZGUsIGZhbHNlKTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlvIDlp4vmkq3mlL7lvLnluZXjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucGxheSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghX3BsYXlpbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAoIV9zdGFydFRpbWUpXG4gICAgICAgICAgICAgICAgICAgIF9zdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICBpZiAoX3BhdXNlVGltZSlcbiAgICAgICAgICAgICAgICAgICAgX3N0YXJ0VGltZSArPSBfb3B0aW9ucy5jbG9jaygpIC0gX3BhdXNlVGltZTtcbiAgICAgICAgICAgICAgICBfbGFzdFJlZnJlc2hUaW1lID0gbnVsbDtcbiAgICAgICAgICAgICAgICBfcGxheWluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlZnJlc2gpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDnu6fnu63miYDmnInlnKjkuovku7blk43lupTkuK3orr7nva7kuoYgZS5wYXVzZSA9IHRydWU7IOW8ueW5leeahOaSreaUvuOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5wbGF5QWxsQnVsbGV0U2NyZWVucyA9ICgpID0+XG4gICAgICAgICAgICBfcmVhbFRpbWVCdWxsZXRTY3JlZW5zLmZvckVhY2goKG5vZGUpID0+IG5vZGUuZWxlbWVudC5wYXVzZSA9IGZhbHNlKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5pqC5YGc5pKt5pS+5by55bmV44CCXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiDmmoLlgZzmkq3mlL7lvLnluZXjgILmmoLlgZzmkq3mlL7lvLnluZXmmK/mjIflvLnluZXmkq3mlL7mmoLlgZzvvIzmiYDmnInmnKrlh7rnjrDnmoTlvLnluZXlsIblgZzmraLlh7rnjrDvvIzlt7Llh7rnjrDnmoTlvLnluZXlgZzmraLov5DliqjvvIzlgZzmraLmtojlpLHjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucGF1c2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoX3BsYXlpbmcpIHtcbiAgICAgICAgICAgICAgICBfcGF1c2VUaW1lID0gX29wdGlvbnMuY2xvY2soKTtcbiAgICAgICAgICAgICAgICBfcGxheWluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmuIXnqbrlvLnluZXnvJPlhrLljLrjgIJcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIOa4heepuuW8ueW5leWIl+ihqO+8jOS9huWxj+W5leS4iuW3sue7j+WHuueOsOeahOW8ueW5leS4jeS8muiiq+a4hemZpOOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jbGVhbkJ1ZmZlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF9idWxsZXRTY3JlZW5CdWZmZXIuY2xlYW4oKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5riF56m65bGP5bmV5YaF5a6544CCXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiDmuIXnqbrlsY/luZXlhoXlrrnjgILmuIXnqbrlsY/luZXkuIrlt7Lnu4/lh7rnjrDnmoTlvLnluZXvvIzkuI3ljIXmi6zlvLnluZXliJfooajkuK3nmoTlvLnluZXjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY2xlYW5TY3JlZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfcmVhbFRpbWVCdWxsZXRTY3JlZW5zLmNsZWFuKCk7XG4gICAgICAgICAgICBfcmVuZGVyZXIuY2xlYW5TY3JlZW4oKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5YGc5q2i5pKt5pS+5by55bmV44CCXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiDlgZzmraLmkq3mlL7lvLnluZXjgILlgZzmraLmkq3mlL7lvLnluZXmmK/mjIflgZzmraLmkq3mlL7lvLnluZXvvIzpu5jorqRb5pe26Ze05Z+65YeG77yIb3B0aW9ucy5jbG9ja++8iV17QGxpbmsgb3BlbkJTRX5CdWxsZXRTY3JlZW5TdHlsZX3lvZLpm7bvvIzlubZb5riF56m65by55bmV5YiX6KGoXXtAbGluayBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZSNjbGVhbkJ1bGxldFNjcmVlbkxpc3R944CBW+a4heepuuWxj+W5leWGheWuuV17QGxpbmsgb3BlbkJTRS5CdWxsZXRTY3JlZW5FbmdpbmUjY2xlYW5TY3JlZW5944CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoX3BsYXlpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhdXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNsZWFuQnVmZmVyKCk7XG4gICAgICAgICAgICB0aGlzLmNsZWFuU2NyZWVuKCk7XG4gICAgICAgICAgICBfcGF1c2VUaW1lID0gMDtcbiAgICAgICAgICAgIF9zdGFydFRpbWUgPSBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bmiJborr7nva7lvLnluZXlj6/op4HmgKfjgIJcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAndmlzaWJpbGl0eScsIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZW5kZXJlci5nZXRWaXNpYmlsaXR5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmlzaWJpbGl0eSkge1xuICAgICAgICAgICAgICAgIGlmICh2aXNpYmlsaXR5KSBfcmVuZGVyZXIuc2hvdygpO1xuICAgICAgICAgICAgICAgIGVsc2UgX3JlbmRlcmVyLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPlua4suafk+aooeW8j+OAglxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdyZW5kZXJNb2RlJywge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbmRlck1vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bmkq3mlL7nirbmgIHjgIJcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAncGxheVN0YXRlJywge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9wbGF5aW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgKiDojrflj5bosIPor5Xkv6Hmga/jgIJcbiAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAqL1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2RlYnVnSW5mbycsIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHRpbWU6IF9wbGF5aW5nID8gX29wdGlvbnMuY2xvY2soKSA6IF9wYXVzZVRpbWUsXG4gICAgICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuQ291bnQ6IF9yZWFsVGltZUJ1bGxldFNjcmVlbnMubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICBidWZmZXJCdWxsZXRTY3JlZW5Db3VudDogX2J1bGxldFNjcmVlbkJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgIGRlbGF5OiBfZGVsYXksXG4gICAgICAgICAgICAgICAgICAgIGRlbGF5QnVsbGV0U2NyZWVuQ291bnQ6IF9kZWxheUJ1bGxldFNjcmVlbkNvdW50LFxuICAgICAgICAgICAgICAgICAgICBmcHM6IF9wbGF5aW5nID8gTWF0aC5mbG9vcihfcmVmcmVzaFJhdGUgKiAxMDAwKSA6IDAgLy/luKfpopFcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvL+WGhemDqOWHveaVsFxuICAgICAgICAvKipcbiAgICAgICAgICog5by55bmV5LqL5Lu25ZON5bqUXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0g5LqL5Lu25ZCN56ewXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZWFsVGltZUJ1bGxldFNjcmVlbiAtIOWunuaXtuW8ueW5leWvueixoVxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZSAtIOS6i+S7tuS/oeaBr1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gYnVsbGV0U2NyZWVuRXZlbnRUcmlnZ2VyKG5hbWUsIHJlYWxUaW1lQnVsbGV0U2NyZWVuLCBlKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGUucGFnZVggPT09ICd1bmRlZmluZWQnIHx8IGUucGFnZVggPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsZXQgZG9jID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBib2R5ID0gZG9jdW1lbnQuYm9keTtcbiAgICAgICAgICAgICAgICBlLnBhZ2VYID0gZS5jbGllbnRYICsgKGRvYyAmJiBkb2Muc2Nyb2xsTGVmdCB8fCBib2R5ICYmIGJvZHkuc2Nyb2xsTGVmdCB8fCAwKSAtIChkb2MgJiYgZG9jLmNsaWVudExlZnQgfHwgYm9keSAmJiBib2R5LmNsaWVudExlZnQgfHwgMCk7XG4gICAgICAgICAgICAgICAgZS5wYWdlWSA9IGUuY2xpZW50WSArIChkb2MgJiYgZG9jLnNjcm9sbFRvcCB8fCBib2R5ICYmIGJvZHkuc2Nyb2xsVG9wIHx8IDApIC0gKGRvYyAmJiBkb2MuY2xpZW50VG9wIHx8IGJvZHkgJiYgYm9keS5jbGllbnRUb3AgfHwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfZXZlbnQudHJpZ2dlcihuYW1lLCB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICog6I635Y+W5byV5Y+R5LqL5Lu255qE5by55bmV5by55bmV55qE5pWw5o2uXG4gICAgICAgICAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7b3BlbkJTRX5CdWxsZXRTY3JlZW59IOW8leWPkeS6i+S7tueahOW8ueW5leeahOaVsOaNru+8muS4gOS4qiB7QGxpbmsgb3BlbkJTRX5CdWxsZXRTY3JlZW59IOe7k+aehOOAgu+8iOazqOaEj++8muS4jeimgeivleWbvuS4jlvmt7vliqDlvLnluZVde0BsaW5rIG9wZW5CU0UuQnVsbGV0U2NyZWVuRW5naW5lI2FkZEJ1bGxldFNjcmVlbn3ml7bliJvlu7rnmoTlr7nosaHov5vooYzmr5TovoPvvIzov5nkuKrlr7nosaHmmK/lhYvpmoblvpfliLDnmoTvvIzlubbkuI3nm7jnrYnjgILmraPnoa7nmoTmlrnms5XmmK/lnKjmt7vliqDlvLnluZXml7bkuIDlubbmj5LlhaUgaWQg562J6Ieq5a6a5LmJ5a2X5q615p2l5ZSv5LiA5qCH6K+G5LiA5p2h5by55bmV44CC77yJXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZ2V0QnVsbGV0U2NyZWVuOiAoKSA9PiBIZWxwZXIuY2xvbmUocmVhbFRpbWVCdWxsZXRTY3JlZW4uYnVsbGV0U2NyZWVuKSxcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiDorr7nva7lvJXlj5Hkuovku7bnmoTlvLnluZXlvLnluZXnmoTmlbDmja5cbiAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7b3BlbkJTRX5CdWxsZXRTY3JlZW59IGJ1bGxldFNjcmVlbiAtIOW8leWPkeS6i+S7tueahOW8ueW5leeahOaVsOaNru+8muS4gOS4qiB7QGxpbmsgb3BlbkJTRX5CdWxsZXRTY3JlZW59IOe7k+aehOOAguiuvue9ruatpOWPguaVsOS7peS+v+WKqOaAgeiwg+aVtOW8ueW5leagt+W8j++8jOS9huaYr+S4gOS6m+WPguaVsOWcqOS6i+S7tuS4reS/ruaUueaXoOaViO+8jOafpeeci+atpOe7k+aehOeahOivtOaYjuS7peS6huino+ivpuaDheOAglxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3JlZHJhdz1mYWxzZV0gLSDmmK/lkKbph43nu5jlvLnluZXvvJrmraTlj4LmlbDlnKjmr4/mrKHlvJXlj5Hkuovku7bml7bnmoTliJ3lp4vlgLzkuLogZmFsc2Ug77yM5aaC5p6c5L+u5pS55LqGIGJ1bGxldFNjcmVlbiDkuK3nmoTlgLzvvIzmraTlj4LmlbDlv4Xpobvorr7kuLogdHJ1ZSDjgIJcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBzZXRCdWxsZXRTY3JlZW46IChidWxsZXRTY3JlZW4sIHJlZHJhdyA9IGZhbHNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVkcmF3ICE9ICdib29sZWFuJykgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuUEFSQU1FVEVSU19UWVBFX0VSUk9SKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJ1bGxldFNjcmVlblR5cGUgPSBIZWxwZXIuY2xvbmUoX2J1bGxldFNjcmVlblR5cGUpO1xuICAgICAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5UeXBlLnN0eWxlID0gX29wdGlvbnNUeXBlLmRlZmF1bHRTdHlsZTtcbiAgICAgICAgICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4uYnVsbGV0U2NyZWVuID0gSGVscGVyLnNldFZhbHVlcyhidWxsZXRTY3JlZW4sIHJlYWxUaW1lQnVsbGV0U2NyZWVuLmJ1bGxldFNjcmVlbiwgYnVsbGV0U2NyZWVuVHlwZSk7IC8v6K6+572u5YC8XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWRyYXcgPT09IHRydWUpIF9yZW5kZXJlci5yZUNyZWF0QW5kZ2V0V2lkdGgocmVhbFRpbWVCdWxsZXRTY3JlZW4pOyAvL+mHjeaWsOWIm+W7uuW5tue7mOWItuW8ueW5lVxuICAgICAgICAgICAgICAgICAgICBpZiAoIV9wbGF5aW5nICYmIHJlZHJhdykgX3JlbmRlcmVyLmRyYXcoKTsgLy/pnZ7mkq3mlL7nirbmgIHliJnph43nu5hcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIOiOt+WPluW8leWPkeS6i+S7tueahOW8ueW5leeahOaSreaUvueKtuaAgVxuICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IOWPluW8leWPkeS6i+S7tueahOW8ueW5leaYr+WQpuWcqOaSreaUvi/np7vliqjvvJrlpoLmnpzorr7nva7kuLogdHJ1ZSDliJnor6XlvLnluZXmmoLlgZzvvIznm7TliLDlsIbmraTlj4LmlbDorr7kuLogZmFsc2Ug5oiW6LCD55SoIHtAbGluayBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZSNwbGF5QWxsQnVsbGV0U2NyZWVuc30g5pa55rOV44CCXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZ2V0UGxheVN0YXRlOiAoKSA9PiAhcmVhbFRpbWVCdWxsZXRTY3JlZW4ucGF1c2UsXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICog6K6+572u5byV5Y+R5LqL5Lu255qE5by55bmV55qE5pKt5pS+54q25oCBXG4gICAgICAgICAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHBhbHkgLSDmmK/lkKbnu6fnu63mkq3mlL4v56e75Yqo5byV5Y+R5LqL5Lu255qE5by55bmV77ya6K+75Y+W5q2k5Y+C5pWw5Y+v5Yik5pat6L+Z5p2h5by55bmV5piv5ZCm5aSE5LqO5pqC5YGc54q25oCB44CCXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgc2V0UGxheVN0YXRlOiAocGxheSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHBsYXkgIT0gJ2Jvb2xlYW4nKSB0aHJvdyBuZXcgVHlwZUVycm9yKFJlc291cmNlcy5QQVJBTUVURVJTX1RZUEVfRVJST1IpO1xuICAgICAgICAgICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi5wYXVzZSA9ICFwbGF5O1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2NyZWVuWDogZS5zY3JlZW5YLCBzY3JlZW5ZOiBlLnNjcmVlblksXG4gICAgICAgICAgICAgICAgcGFnZVg6IGUucGFnZVgsIHBhZ2VZOiBlLnBhZ2VZLFxuICAgICAgICAgICAgICAgIGNsaWVudFg6IGUuY2xpZW50WCwgY2xpZW50WTogZS5jbGllbnRZXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliLfmlrDlvLnluZXlh73mlbBcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG4gICAgICAgICAgICBsZXQgbm93VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgaWYgKF9sYXN0UmVmcmVzaFRpbWUgIT0gbnVsbClcbiAgICAgICAgICAgICAgICBfcmVmcmVzaFJhdGUgPSAxIC8gKG5vd1RpbWUgLSBfbGFzdFJlZnJlc2hUaW1lKTtcbiAgICAgICAgICAgIF9sYXN0UmVmcmVzaFRpbWUgPSBub3dUaW1lO1xuICAgICAgICAgICAgYWRkcmVhbFRpbWVCdWxsZXRTY3JlZW5zKCk7XG4gICAgICAgICAgICBtb3ZlcmVhbFRpbWVCdWxsZXRTY3JlZW4oKTtcbiAgICAgICAgICAgIF9yZW5kZXJlci5kcmF3KCk7IC8v57uY5Yi25by55bmVXG4gICAgICAgICAgICBpZiAoX3BsYXlpbmcpXG4gICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlZnJlc2gpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOenu+WKqOW8ueW5leWHveaVsFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gbW92ZXJlYWxUaW1lQnVsbGV0U2NyZWVuKCkge1xuICAgICAgICAgICAgX3JlYWxUaW1lQnVsbGV0U2NyZWVucy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHJlYWxUaW1lQnVsbGV0U2NyZWVuID0gbm9kZS5lbGVtZW50O1xuICAgICAgICAgICAgICAgIGlmIChyZWFsVGltZUJ1bGxldFNjcmVlbi5wYXVzZSkgcmV0dXJuOyAvL+aaguWBnOenu+WKqFxuICAgICAgICAgICAgICAgIGxldCBub3dUaW1lID0gX29wdGlvbnMuY2xvY2soKTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHJlYWxUaW1lQnVsbGV0U2NyZWVuLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBHZW5lcmFsVHlwZS5yaWdodFRvTGVmdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWFsVGltZUJ1bGxldFNjcmVlbi54ID4gLXJlYWxUaW1lQnVsbGV0U2NyZWVuLndpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4ueCAtPSByZWFsVGltZUJ1bGxldFNjcmVlbi5idWxsZXRTY3JlZW4uc3R5bGUuc3BlZWQgKiBfb3B0aW9ucy5wbGF5U3BlZWQgLyBfcmVmcmVzaFJhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVuZGVyZXIuZGVsZXRlKHJlYWxUaW1lQnVsbGV0U2NyZWVuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyByZW1vdmU6IHRydWUgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIEdlbmVyYWxUeXBlLmxlZnRUb1JpZ2h0OlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlYWxUaW1lQnVsbGV0U2NyZWVuLnggPCBfZWxlbWVudFNpemUud2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi54ICs9IHJlYWxUaW1lQnVsbGV0U2NyZWVuLmJ1bGxldFNjcmVlbi5zdHlsZS5zcGVlZCAqIF9vcHRpb25zLnBsYXlTcGVlZCAvIF9yZWZyZXNoUmF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZW5kZXJlci5kZWxldGUocmVhbFRpbWVCdWxsZXRTY3JlZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHJlbW92ZTogdHJ1ZSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgR2VuZXJhbFR5cGUudG9wOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIEdlbmVyYWxUeXBlLmJvdHRvbTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWFsVGltZUJ1bGxldFNjcmVlbi5lbmRUaW1lIDwgbm93VGltZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZW5kZXJlci5kZWxldGUocmVhbFRpbWVCdWxsZXRTY3JlZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHJlbW92ZTogdHJ1ZSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5re75Yqg5by55bmV5Yiw5a6e5pe25by55bmV5YiX6KGoXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhZGRyZWFsVGltZUJ1bGxldFNjcmVlbnMoKSB7XG4gICAgICAgICAgICBpZiAoX3JlYWxUaW1lQnVsbGV0U2NyZWVucy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAgICAgX2RlbGF5ID0gMDtcbiAgICAgICAgICAgIGxldCB0aW1lcyA9IE1hdGguZmxvb3IoX3JlZnJlc2hSYXRlICogMjAwMCk7XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgbGV0IG5vZGUgPSBfYnVsbGV0U2NyZWVuQnVmZmVyLnBvcChmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGlmIChub2RlID09PSBudWxsKSByZXR1cm47XG4gICAgICAgICAgICAgICAgbGV0IGJ1bGxldFNjcmVlbiA9IG5vZGUuZWxlbWVudDtcbiAgICAgICAgICAgICAgICBsZXQgbm93VGltZSA9IF9vcHRpb25zLmNsb2NrKCk7XG4gICAgICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbi5zdGFydFRpbWUgPiBub3dUaW1lKSByZXR1cm47XG4gICAgICAgICAgICAgICAgaWYgKCFfb3B0aW9ucy50aW1lT3V0RGlzY2FyZCB8fCAhYnVsbGV0U2NyZWVuLmNhbkRpc2NhcmQgfHwgYnVsbGV0U2NyZWVuLnN0YXJ0VGltZSA+IG5vd1RpbWUgLSBNYXRoLmZsb29yKDEgLyBfcmVmcmVzaFJhdGUpICogNjApIHtcbiAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuLnN0eWxlID0gSGVscGVyLnNldFZhbHVlcyhidWxsZXRTY3JlZW4uc3R5bGUsIF9vcHRpb25zLmRlZmF1bHRTdHlsZSwgX29wdGlvbnNUeXBlLmRlZmF1bHRTdHlsZSk7IC8v5aGr5YWF6buY6K6k5qC35byPXG4gICAgICAgICAgICAgICAgICAgIGdldFJlYWxUaW1lQnVsbGV0U2NyZWVuKG5vd1RpbWUsIGJ1bGxldFNjcmVlbik7IC8v55Sf5oiQ5a6e5pe25by55bmV5a+56LGh5bm25re75Yqg5Yiw5a6e5pe25by55bmV6ZuG5ZCIICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgX2RlbGF5QnVsbGV0U2NyZWVuQ291bnQrKztcbiAgICAgICAgICAgICAgICBub2RlLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIHRpbWVzLS07XG4gICAgICAgICAgICB9IHdoaWxlIChfcmVhbFRpbWVCdWxsZXRTY3JlZW5zLmxlbmd0aCA9PT0gMCB8fCB0aW1lcyA+IDApO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOeUn+aIkOWunuaXtuW8ueW5leWvueixoVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gbm93VGltZSAtIOW9k+WJjeaXtumXtFxuICAgICAgICAgKiBAcGFyYW0ge29wZW5CU0V+QnVsbGV0U2NyZWVufSBidWxsZXRTY3JlZW4gLSDlvLnluZXnmoTpk77ooajoioLngrlcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdldFJlYWxUaW1lQnVsbGV0U2NyZWVuKG5vd1RpbWUsIGJ1bGxldFNjcmVlbikge1xuICAgICAgICAgICAgX2RlbGF5ID0gbm93VGltZSAtIGJ1bGxldFNjcmVlbi5zdGFydFRpbWU7XG4gICAgICAgICAgICBsZXQgcmVhbFRpbWVCdWxsZXRTY3JlZW4gPSB7fTtcbiAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLnBhdXNlID0gZmFsc2U7IC8v5piv5ZCm5pqC5YGc56e75YqoXG4gICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi5idWxsZXRTY3JlZW4gPSBidWxsZXRTY3JlZW47XG4gICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi5zdGFydFRpbWUgPSBub3dUaW1lOyAvL+W8ueW5leWktOmDqOi/m+Wxj+W5leaXtumXtFxuICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4uc2l6ZSA9IGJ1bGxldFNjcmVlbi5zdHlsZS5zaXplOyAvL+Wtl+S9k+Wkp+Wwj++8muWDj+e0oFxuICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4udHlwZSA9IGJ1bGxldFNjcmVlbi50eXBlOyAvL+W8ueW5leexu+Wei1xuICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4uaGVpZ2h0ID0gcmVhbFRpbWVCdWxsZXRTY3JlZW4uc2l6ZTsgLy/lvLnluZXnmoTpq5jluqbvvJrlg4/ntKBcbiAgICAgICAgICAgIF9yZW5kZXJlci5jcmVhdEFuZGdldFdpZHRoKHJlYWxUaW1lQnVsbGV0U2NyZWVuKTsgLy/liJvlu7rlvLnluZXlhYPntKDlubborqHnrpflrr3luqZcbiAgICAgICAgICAgIHN3aXRjaCAoYnVsbGV0U2NyZWVuLnR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIEdlbmVyYWxUeXBlLnJpZ2h0VG9MZWZ0OlxuICAgICAgICAgICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi5lbmRUaW1lID0gTWF0aC5yb3VuZChub3dUaW1lICsgKF9lbGVtZW50U2l6ZS53aWR0aCArIHJlYWxUaW1lQnVsbGV0U2NyZWVuLndpZHRoKSAvIChidWxsZXRTY3JlZW4uc3R5bGUuc3BlZWQgKiBfb3B0aW9ucy5wbGF5U3BlZWQpKTsgLy/lvLnluZXlsL7pg6jlh7rlsY/luZXnmoTml7bpl7RcbiAgICAgICAgICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4ueCA9IF9lbGVtZW50U2l6ZS53aWR0aDsgLy/lvLnluZXliJ3lp4tY5Z2Q5qCHXG4gICAgICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLnkgPSBfb3B0aW9ucy52ZXJ0aWNhbEludGVydmFsOyAvL+W8ueW5leWIneWni1nlnZDmoIdcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBHZW5lcmFsVHlwZS5sZWZ0VG9SaWdodDpcbiAgICAgICAgICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4uZW5kVGltZSA9IE1hdGgucm91bmQobm93VGltZSArIChfZWxlbWVudFNpemUud2lkdGggKyByZWFsVGltZUJ1bGxldFNjcmVlbi53aWR0aCkgLyAoYnVsbGV0U2NyZWVuLnN0eWxlLnNwZWVkICogX29wdGlvbnMucGxheVNwZWVkKSk7IC8v5by55bmV5bC+6YOo5Ye65bGP5bmV55qE5pe26Ze0XG4gICAgICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLnggPSAtcmVhbFRpbWVCdWxsZXRTY3JlZW4ud2lkdGg7IC8v5by55bmV5Yid5aeLWOWdkOagh1xuICAgICAgICAgICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi55ID0gX29wdGlvbnMudmVydGljYWxJbnRlcnZhbDsgLy/lvLnluZXliJ3lp4tZ5Z2Q5qCHXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgR2VuZXJhbFR5cGUudG9wOlxuICAgICAgICAgICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi5lbmRUaW1lID0gcmVhbFRpbWVCdWxsZXRTY3JlZW4uc3RhcnRUaW1lICsgYnVsbGV0U2NyZWVuLnN0eWxlLnJlc2lkZW5jZVRpbWUgKiBfb3B0aW9ucy5wbGF5U3BlZWQ7XG4gICAgICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLnggPSBNYXRoLnJvdW5kKChfZWxlbWVudFNpemUud2lkdGggLSByZWFsVGltZUJ1bGxldFNjcmVlbi53aWR0aCkgLyAyKTsgLy/lvLnluZXliJ3lp4tY5Z2Q5qCHXG4gICAgICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLnkgPSBfb3B0aW9ucy52ZXJ0aWNhbEludGVydmFsOyAvL+W8ueW5leWIneWni1nlnZDmoIdcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBHZW5lcmFsVHlwZS5ib3R0b206XG4gICAgICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLmVuZFRpbWUgPSByZWFsVGltZUJ1bGxldFNjcmVlbi5zdGFydFRpbWUgKyBidWxsZXRTY3JlZW4uc3R5bGUucmVzaWRlbmNlVGltZSAqIF9vcHRpb25zLnBsYXlTcGVlZDtcbiAgICAgICAgICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4ueCA9IE1hdGgucm91bmQoKF9lbGVtZW50U2l6ZS53aWR0aCAtIHJlYWxUaW1lQnVsbGV0U2NyZWVuLndpZHRoKSAvIDIpOyAvL+W8ueW5leWIneWni1jlnZDmoIdcbiAgICAgICAgICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4ueSA9IC1fb3B0aW9ucy52ZXJ0aWNhbEludGVydmFsIC0gcmVhbFRpbWVCdWxsZXRTY3JlZW4uaGVpZ2h0OyAvL+W8ueW5leWIneWni1nlnZDmoIdcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBuZXdOb2RlID0gbmV3IExpbmtlZExpc3Qubm9kZShyZWFsVGltZUJ1bGxldFNjcmVlbik7XG4gICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuLnR5cGUgPT09IEdlbmVyYWxUeXBlLnRvcCB8fCBidWxsZXRTY3JlZW4udHlwZSA9PT0gR2VuZXJhbFR5cGUuYm90dG9tKSB7XG4gICAgICAgICAgICAgICAgX3JlYWxUaW1lQnVsbGV0U2NyZWVucy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4gPSBub2RlLmVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIC8v5by55bmV5LiN5Zyo5rWB5Lit77yM5piv5Zu65a6a5by55bmVXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4uYnVsbGV0U2NyZWVuLnR5cGUgIT0gYnVsbGV0U2NyZWVuLnR5cGUpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8v5LiN5piv5ZCM5LiA56eN57G75Z6L55qE5by55bmVXG4gICAgICAgICAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW4udHlwZSA9PT0gR2VuZXJhbFR5cGUudG9wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WmguaenOaWsOW8ueW5leWcqOW9k+WJjeW8ueW5leS4iuaWueS4lOacquS4juW9k+WJjeW8ueW5lemHjeWPoFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlYWxUaW1lQnVsbGV0U2NyZWVuLnkgKyByZWFsVGltZUJ1bGxldFNjcmVlbi5oZWlnaHQgPCBuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4ueSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEFjdHVhbFkocmVhbFRpbWVCdWxsZXRTY3JlZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGFkZDogeyBhZGRUb1VwOiB0cnVlLCBub2RlOiBuZXdOb2RlIH0sIHN0b3A6IHRydWUgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5aaC5p6c5LiK5LiA5p2h5by55bmV55qE5raI5aSx5pe26Ze05bCP5LqO5b2T5YmN5by55bmV55qE5Ye6546w5pe26Ze0XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dHJlYWxUaW1lQnVsbGV0U2NyZWVuLmVuZFRpbWUgPCBub3dUaW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLnkgPSBuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4ueTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi55ID0gbmV4dHJlYWxUaW1lQnVsbGV0U2NyZWVuLnkgKyBuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4uaGVpZ2h0ICsgX29wdGlvbnMudmVydGljYWxJbnRlcnZhbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5aaC5p6c5paw5by55bmV5Zyo5b2T5YmN5by55bmV5LiL5pa55LiU5pyq5LiO5b2T5YmN5by55bmV6YeN5Y+gXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVhbFRpbWVCdWxsZXRTY3JlZW4ueSA+IG5leHRyZWFsVGltZUJ1bGxldFNjcmVlbi55ICsgbmV4dHJlYWxUaW1lQnVsbGV0U2NyZWVuLmhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEFjdHVhbFkocmVhbFRpbWVCdWxsZXRTY3JlZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGFkZDogeyBhZGRUb1VwOiB0cnVlLCBub2RlOiBuZXdOb2RlIH0sIHN0b3A6IHRydWUgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5aaC5p6c5LiK5LiA5p2h5by55bmV55qE5raI5aSx5pe26Ze05bCP5LqO5b2T5YmN5by55bmV55qE5Ye6546w5pe26Ze0XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dHJlYWxUaW1lQnVsbGV0U2NyZWVuLmVuZFRpbWUgPCBub3dUaW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLnkgPSBuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4ueTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi55ID0gbmV4dHJlYWxUaW1lQnVsbGV0U2NyZWVuLnkgLSByZWFsVGltZUJ1bGxldFNjcmVlbi5oZWlnaHQgLSBfb3B0aW9ucy52ZXJ0aWNhbEludGVydmFsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL+W9k+WJjeW8ueW5lee7j+i/h+S4gOS4queCuemcgOimgeeahOaAu+aXtumVv1xuICAgICAgICAgICAgICAgIGxldCByZWFsVGltZUJ1bGxldFNjcmVlbldpZHRoVGltZSA9IHJlYWxUaW1lQnVsbGV0U2NyZWVuLndpZHRoIC8gKGJ1bGxldFNjcmVlbi5zdHlsZS5zcGVlZCAqIF9vcHRpb25zLnBsYXlTcGVlZCk7XG4gICAgICAgICAgICAgICAgX3JlYWxUaW1lQnVsbGV0U2NyZWVucy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4gPSBub2RlLmVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIC8v5by55bmV5Zyo5rWB5Lit77yM5piv56e75Yqo5by55bmVXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4uYnVsbGV0U2NyZWVuLnR5cGUgPT09IEdlbmVyYWxUeXBlLnRvcCB8fCBuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4uYnVsbGV0U2NyZWVuLnR5cGUgPT09IEdlbmVyYWxUeXBlLmJvdHRvbSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjsgLy/lvLnluZXkuI3lnKjmtYHkuK3vvIzkuLrlm7rlrprlvLnluZVcbiAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpzmlrDlvLnluZXlnKjlvZPliY3lvLnluZXkuIrmlrnkuJTmnKrkuI7lvZPliY3lvLnluZXph43lj6BcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlYWxUaW1lQnVsbGV0U2NyZWVuLnkgKyByZWFsVGltZUJ1bGxldFNjcmVlbi5oZWlnaHQgPCBuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4ueSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0QWN0dWFsWShyZWFsVGltZUJ1bGxldFNjcmVlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBhZGQ6IHsgYWRkVG9VcDogdHJ1ZSwgbm9kZTogbmV3Tm9kZSB9LCBzdG9wOiB0cnVlIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy/kuIrkuIDmnaHlvLnluZXnu4/ov4fkuIDkuKrngrnpnIDopoHnmoTmgLvml7bplb9cbiAgICAgICAgICAgICAgICAgICAgbGV0IG5leHRyZWFsVGltZUJ1bGxldFNjcmVlbldpZHRoVGltZSA9IG5leHRyZWFsVGltZUJ1bGxldFNjcmVlbi53aWR0aCAvIChuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4uYnVsbGV0U2NyZWVuLnN0eWxlLnNwZWVkICogX29wdGlvbnMucGxheVNwZWVkKTtcbiAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpzkuIrkuIDmnaHlvLnluZXnmoTmtojlpLHml7bpl7TlsI/kuo7lvZPliY3lvLnluZXnmoTlh7rnjrDml7bpl7RcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRyZWFsVGltZUJ1bGxldFNjcmVlbi5zdGFydFRpbWUgKyBuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW5XaWR0aFRpbWUgPj0gbm93VGltZSB8fCAvL+WmguaenOS4iuS4gOadoeW8ueW5leeahOWktOi/m+WFpeS6hu+8jOS9huaYr+Wwvui/mOayoei/m+WFpVxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dHJlYWxUaW1lQnVsbGV0U2NyZWVuLmVuZFRpbWUgPj0gcmVhbFRpbWVCdWxsZXRTY3JlZW4uZW5kVGltZSAtIHJlYWxUaW1lQnVsbGV0U2NyZWVuV2lkdGhUaW1lKSAvL+WmguaenOW9k+WJjeW8ueW5leWktOWHuuWOu+S6hu+8jOS4iuS4gOadoeW8ueW5leWwvui/mOayoeWHuuWOu1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4ueSA9IG5leHRyZWFsVGltZUJ1bGxldFNjcmVlbi55ICsgbmV4dHJlYWxUaW1lQnVsbGV0U2NyZWVuLmhlaWdodCArIF9vcHRpb25zLnZlcnRpY2FsSW50ZXJ2YWw7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLnkgPSBuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4ueTtcbiAgICAgICAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChuZXdOb2RlLmxpbmtlZExpc3QgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBzZXRBY3R1YWxZKHJlYWxUaW1lQnVsbGV0U2NyZWVuKTtcbiAgICAgICAgICAgICAgICBfcmVhbFRpbWVCdWxsZXRTY3JlZW5zLnB1c2gobmV3Tm9kZSwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiuvue9ruecn+WunueahFnlnZDmoIdcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IHJlYWxUaW1lQnVsbGV0U2NyZWVuIC0g5a6e5pe25by55bmV5LqL5Lu2XG4gICAgICAgICAqIEByZXR1cm5zIHtvYmplY3R9IOWunuaXtuW8ueW5leS6i+S7tlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc2V0QWN0dWFsWShyZWFsVGltZUJ1bGxldFNjcmVlbikge1xuICAgICAgICAgICAgbGV0IGJ1bGxldFNjcmVlbiA9IHJlYWxUaW1lQnVsbGV0U2NyZWVuLmJ1bGxldFNjcmVlbjtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW4udHlwZSA9PT0gR2VuZXJhbFR5cGUubGVmdFRvUmlnaHQgfHxcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW4udHlwZSA9PT0gR2VuZXJhbFR5cGUucmlnaHRUb0xlZnQgfHxcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW4udHlwZSA9PT0gR2VuZXJhbFR5cGUudG9wXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi5hY3R1YWxZID0gcmVhbFRpbWVCdWxsZXRTY3JlZW4ueSAlIChfZWxlbWVudFNpemUuaGVpZ2h0IC0gcmVhbFRpbWVCdWxsZXRTY3JlZW4uaGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGJ1bGxldFNjcmVlbi50eXBlID09PSBHZW5lcmFsVHlwZS5ib3R0b20pIHtcbiAgICAgICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi5hY3R1YWxZID0gX2VsZW1lbnRTaXplLmhlaWdodCArIHJlYWxUaW1lQnVsbGV0U2NyZWVuLnkgJSBfZWxlbWVudFNpemUuaGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiuvue9ruWwuuWvuFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc2V0U2l6ZSgpIHtcbiAgICAgICAgICAgIGxldCBkZXZpY2VQaXhlbFJhdGlvID0gSGVscGVyLmdldERldmljZVBpeGVsUmF0aW8oKTtcbiAgICAgICAgICAgIGlmIChfb2xkRGV2aWNlUGl4ZWxSYXRpbyAhPSBkZXZpY2VQaXhlbFJhdGlvIHx8XG4gICAgICAgICAgICAgICAgX29sZENsaWVudFdpZHRoICE9IGVsZW1lbnQuY2xpZW50V2lkdGggfHxcbiAgICAgICAgICAgICAgICBfb2xkQ2xpZW50SGVpZ2h0ICE9IGVsZW1lbnQuY2xpZW50SGVpZ2h0IHx8XG4gICAgICAgICAgICAgICAgX29sZFNjYWxpbmcgIT0gX29wdGlvbnMuc2NhbGluZykge1xuICAgICAgICAgICAgICAgIF9vbGRTY2FsaW5nID0gX29wdGlvbnMuc2NhbGluZztcbiAgICAgICAgICAgICAgICBfZWxlbWVudFNpemUud2lkdGggPSBlbGVtZW50LmNsaWVudFdpZHRoIC8gX29wdGlvbnMuc2NhbGluZztcbiAgICAgICAgICAgICAgICBfZWxlbWVudFNpemUuaGVpZ2h0ID0gZWxlbWVudC5jbGllbnRIZWlnaHQgLyBfb3B0aW9ucy5zY2FsaW5nO1xuICAgICAgICAgICAgICAgIF9vbGRDbGllbnRXaWR0aCA9IGVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgICAgICAgICAgX29sZENsaWVudEhlaWdodCA9IGVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgICAgIF9vbGREZXZpY2VQaXhlbFJhdGlvID0gZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICAgICAgICBfcmVuZGVyZXIuc2V0U2l6ZSgpO1xuICAgICAgICAgICAgICAgIGlmICghX3BsYXlpbmcpIF9yZW5kZXJlci5kcmF3KCk7IC8v6Z2e5pKt5pS+54q25oCB5YiZ6YeN57uYXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL0lFIEVkZ2Ug5rWP6KeI5Zmo5LiN5pSv5oyBICVjXG4gICAgICAgIGlmICghIXdpbmRvdy5BY3RpdmVYT2JqZWN0IHx8IFwiQWN0aXZlWE9iamVjdFwiIGluIHdpbmRvdyB8fCBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJUcmlkZW50XCIpID4gLTEgfHxcbiAgICAgICAgICAgIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUVcIikgPiAtMSB8fCBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJFZGdlXCIpID4gLTEpIGNvbnNvbGUuaW5mbyhcbiAgICAgICAgICAgICAgICBSZXNvdXJjZXMuTE9BREVEX0lORk9fSUUuZmlsbERhdGEoYnVpbGQpXG4gICAgICAgICAgICApO1xuICAgICAgICAvL090aGVyXG4gICAgICAgIGVsc2UgY29uc29sZS5pbmZvKFxuICAgICAgICAgICAgUmVzb3VyY2VzLkxPQURFRF9JTkZPLmZpbGxEYXRhKGJ1aWxkKSxcbiAgICAgICAgICAgICdmb250LXdlaWdodDpib2xkOyBjb2xvcjojMDA5OUZGOycsICcnLCAnZm9udC1zdHlsZTppdGFsaWM7JywgJydcbiAgICAgICAgKTtcbiAgICB9XG59XG4iXSwiZmlsZSI6ImVuZ2luZXMvZ2VuZXJhbEVuZ2luZS5qcyJ9
