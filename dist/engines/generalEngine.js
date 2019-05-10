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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZXMvZ2VuZXJhbEVuZ2luZS5qcyJdLCJuYW1lcyI6WyJHZW5lcmFsRW5naW5lIiwiZWxlbWVudCIsIm9wdGlvbnMiLCJyZW5kZXJNb2RlIiwiX3N0YXJ0VGltZSIsIl9wYXVzZVRpbWUiLCJfYnVsbGV0U2NyZWVuQnVmZmVyIiwiTGlua2VkTGlzdCIsIl9yZWFsVGltZUJ1bGxldFNjcmVlbnMiLCJfZGVsYXlCdWxsZXRTY3JlZW5Db3VudCIsIl9kZWxheSIsIl9wbGF5aW5nIiwiX3JlZnJlc2hSYXRlIiwiX2xhc3RSZWZyZXNoVGltZSIsIl9vcHRpb25zIiwiX2RlZmF1bHRPcHRpb25zIiwidmVydGljYWxJbnRlcnZhbCIsInBsYXlTcGVlZCIsImNsb2NrIiwidGltZSIsIkRhdGUiLCJnZXRUaW1lIiwic2NhbGluZyIsInRpbWVPdXREaXNjYXJkIiwiaGlkZGVuVHlwZXMiLCJvcGFjaXR5IiwiY3Vyc29yT25Nb3VzZU92ZXIiLCJkZWZhdWx0U3R5bGUiLCJzaGFkb3dCbHVyIiwiZm9udFdlaWdodCIsImZvbnRGYW1pbHkiLCJzaXplIiwiYm94Q29sb3IiLCJjb2xvciIsImJvcmRlckNvbG9yIiwic3BlZWQiLCJyZXNpZGVuY2VUaW1lIiwiX29wdGlvbnNUeXBlIiwiX2RlZmF1bHRCdWxsZXRTY3JlZW4iLCJ0ZXh0IiwiY2FuRGlzY2FyZCIsInN0YXJ0VGltZSIsInR5cGUiLCJHZW5lcmFsVHlwZSIsInJpZ2h0VG9MZWZ0IiwibGF5ZXIiLCJfYnVsbGV0U2NyZWVuVHlwZSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIndpbmRvdyIsImNvbnNvbGUiLCJ3YXJuIiwiUmVzb3VyY2VzIiwiUkVRVUVTVEFOSU1BVElPTkZSQU1FX05PVF9TVVBQT1JUX1dBUk4iLCJmdW4iLCJzZXRUaW1lb3V0IiwiSGVscGVyIiwic2V0VmFsdWVzIiwiX2V2ZW50IiwiRXZlbnQiLCJhZGQiLCJiaW5kIiwidW5iaW5kIiwiX2VsZW1lbnRTaXplIiwid2lkdGgiLCJjbGllbnRXaWR0aCIsImhlaWdodCIsImNsaWVudEhlaWdodCIsIl9vbGREZXZpY2VQaXhlbFJhdGlvIiwiZ2V0RGV2aWNlUGl4ZWxSYXRpbyIsIl9vbGRTY2FsaW5nIiwiX29sZENsaWVudFdpZHRoIiwiX29sZENsaWVudEhlaWdodCIsIl9vbGRIaWRkZW5UeXBlcyIsIl9vbGRPcGFjaXR5IiwicmVuZGVyZXJzRmFjdG9yeSIsIlJlbmRlcmVyc0ZhY3RvcnkiLCJidWxsZXRTY3JlZW5FdmVudFRyaWdnZXIiLCJfcmVuZGVyZXIiLCJnZXRHZW5lcmFsUmVuZGVyZXIiLCJzZXRJbnRlcnZhbCIsInNldFNpemUiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldCIsImNsb25lIiwic2V0IiwiZHJhdyIsInNldE9wYWNpdHkiLCJidWxsZXRTY3JlZW4iLCJsZWZ0VG9SaWdodCIsInRvcCIsImJvdHRvbSIsIlR5cGVFcnJvciIsIlBBUkFNRVRFUlNfVFlQRV9FUlJPUiIsImNoZWNrVHlwZXMiLCJzdHlsZSIsIm5ld05vZGUiLCJub2RlIiwiZm9yRWFjaCIsImxhc3RCdWxsZXRTY3JlZW4iLCJmbGFnIiwiYWRkVG9VcCIsInN0b3AiLCJsaW5rZWRMaXN0IiwicHVzaCIsInBsYXkiLCJyZWZyZXNoIiwicGxheUFsbEJ1bGxldFNjcmVlbnMiLCJwYXVzZSIsImNsZWFuQnVmZmVyIiwiY2xlYW4iLCJjbGVhblNjcmVlbiIsInJlbmRlcmVyIiwiZ2V0VmlzaWJpbGl0eSIsInZpc2liaWxpdHkiLCJzaG93IiwiaGlkZSIsInJlYWxUaW1lQnVsbGV0U2NyZWVuQ291bnQiLCJsZW5ndGgiLCJidWZmZXJCdWxsZXRTY3JlZW5Db3VudCIsImRlbGF5IiwiZGVsYXlCdWxsZXRTY3JlZW5Db3VudCIsImZwcyIsIk1hdGgiLCJmbG9vciIsIm5hbWUiLCJyZWFsVGltZUJ1bGxldFNjcmVlbiIsImUiLCJwYWdlWCIsImRvYyIsImRvY3VtZW50IiwiZG9jdW1lbnRFbGVtZW50IiwiYm9keSIsImNsaWVudFgiLCJzY3JvbGxMZWZ0IiwiY2xpZW50TGVmdCIsInBhZ2VZIiwiY2xpZW50WSIsInNjcm9sbFRvcCIsImNsaWVudFRvcCIsInRyaWdnZXIiLCJnZXRCdWxsZXRTY3JlZW4iLCJzZXRCdWxsZXRTY3JlZW4iLCJyZWRyYXciLCJidWxsZXRTY3JlZW5UeXBlIiwicmVDcmVhdEFuZGdldFdpZHRoIiwiZ2V0UGxheVN0YXRlIiwic2V0UGxheVN0YXRlIiwic2NyZWVuWCIsInNjcmVlblkiLCJub3dUaW1lIiwiYWRkcmVhbFRpbWVCdWxsZXRTY3JlZW5zIiwibW92ZXJlYWxUaW1lQnVsbGV0U2NyZWVuIiwieCIsInJlbW92ZSIsImVuZFRpbWUiLCJ0aW1lcyIsInBvcCIsImdldFJlYWxUaW1lQnVsbGV0U2NyZWVuIiwiY3JlYXRBbmRnZXRXaWR0aCIsInJvdW5kIiwieSIsIm5leHRyZWFsVGltZUJ1bGxldFNjcmVlbiIsInNldEFjdHVhbFkiLCJyZWFsVGltZUJ1bGxldFNjcmVlbldpZHRoVGltZSIsIm5leHRyZWFsVGltZUJ1bGxldFNjcmVlbldpZHRoVGltZSIsImFjdHVhbFkiLCJkZXZpY2VQaXhlbFJhdGlvIiwiQWN0aXZlWE9iamVjdCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsImluZGV4T2YiLCJpbmZvIiwiTE9BREVEX0lORk9fSUUiLCJmaWxsRGF0YSIsImJ1aWxkIiwiTE9BREVEX0lORk8iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7O0lBV3FCQSxhO0FBQ2pCOzs7Ozs7QUFNQSx1QkFBWUMsT0FBWixFQUFxQkMsT0FBckIsRUFBcUQ7QUFBQSxNQUF2QkMsVUFBdUIsdUVBQVYsUUFBVTs7QUFBQTs7QUFFakQ7Ozs7QUFJQSxNQUFJQyxVQUFKO0FBQ0E7Ozs7OztBQUlBLE1BQUlDLFVBQVUsR0FBRyxDQUFqQjtBQUNBOzs7OztBQUlBLE1BQUlDLG1CQUFtQixHQUFHLElBQUlDLHNCQUFKLEVBQTFCO0FBQ0E7Ozs7OztBQUlBLE1BQUlDLHNCQUFzQixHQUFHLElBQUlELHNCQUFKLEVBQTdCO0FBQ0E7Ozs7OztBQUlBLE1BQUlFLHVCQUF1QixHQUFHLENBQTlCO0FBQ0E7Ozs7O0FBSUEsTUFBSUMsTUFBTSxHQUFHLENBQWI7QUFDQTs7Ozs7QUFJQSxNQUFJQyxRQUFKO0FBQ0E7Ozs7OztBQUlBLE1BQUlDLFlBQVksR0FBRyxJQUFuQjtBQUNBOzs7OztBQUlBLE1BQUlDLGdCQUFKO0FBQ0E7Ozs7OztBQUlBLE1BQUlDLFFBQUo7QUFDQTs7Ozs7O0FBSUEsTUFBTUMsZUFBZSxHQUFHO0FBQ3BCO0FBQ0FDLElBQUFBLGdCQUFnQixFQUFFLENBRkU7O0FBR3BCO0FBQ0FDLElBQUFBLFNBQVMsRUFBRSxDQUpTOztBQUtwQjtBQUNBQyxJQUFBQSxLQUFLLEVBQUUsZUFBQUMsSUFBSTtBQUFBLGFBQUksSUFBSUMsSUFBSixHQUFXQyxPQUFYLEtBQXVCakIsVUFBM0I7QUFBQSxLQU5TOztBQU9wQjtBQUNBa0IsSUFBQUEsT0FBTyxFQUFFLENBUlc7O0FBU3BCO0FBQ0FDLElBQUFBLGNBQWMsRUFBRSxJQVZJOztBQVdwQjtBQUNBQyxJQUFBQSxXQUFXLEVBQUUsQ0FaTzs7QUFhcEI7QUFDQUMsSUFBQUEsT0FBTyxFQUFFLENBZFc7O0FBZXBCO0FBQ0FDLElBQUFBLGlCQUFpQixFQUFFLFNBaEJDOztBQWlCcEI7QUFDQUMsSUFBQUEsWUFBWSxFQUFFO0FBQ1Y7QUFDQUMsTUFBQUEsVUFBVSxFQUFFLENBRkY7O0FBR1Y7QUFDQUMsTUFBQUEsVUFBVSxFQUFFLEtBSkY7O0FBS1Y7QUFDQUMsTUFBQUEsVUFBVSxFQUFFLFlBTkY7O0FBT1Y7QUFDQUMsTUFBQUEsSUFBSSxFQUFFLEVBUkk7O0FBU1Y7QUFDQUMsTUFBQUEsUUFBUSxFQUFFLElBVkE7O0FBV1Y7QUFDQUMsTUFBQUEsS0FBSyxFQUFFLE9BWkc7O0FBYVY7QUFDQUMsTUFBQUEsV0FBVyxFQUFFLElBZEg7O0FBZVY7QUFDQUMsTUFBQUEsS0FBSyxFQUFFLElBaEJHOztBQWlCVjtBQUNBQyxNQUFBQSxhQUFhLEVBQUU7QUFsQkw7QUFzQmxCOzs7OztBQXhDd0IsR0FBeEI7QUE0Q0EsTUFBTUMsWUFBWSxHQUFHO0FBQ2pCckIsSUFBQUEsZ0JBQWdCLEVBQUUsUUFERDtBQUVqQkMsSUFBQUEsU0FBUyxFQUFFLFFBRk07QUFHakJDLElBQUFBLEtBQUssRUFBRSxVQUhVO0FBSWpCSSxJQUFBQSxPQUFPLEVBQUUsUUFKUTtBQUtqQkMsSUFBQUEsY0FBYyxFQUFFLFNBTEM7QUFNakJDLElBQUFBLFdBQVcsRUFBRSxRQU5JO0FBT2pCQyxJQUFBQSxPQUFPLEVBQUUsUUFQUTtBQVFqQkMsSUFBQUEsaUJBQWlCLEVBQUUsUUFSRjtBQVNqQkMsSUFBQUEsWUFBWSxFQUFFO0FBQ1ZDLE1BQUFBLFVBQVUsRUFBRSxRQURGO0FBRVZDLE1BQUFBLFVBQVUsRUFBRSxDQUFDLFFBQUQsRUFBVyxRQUFYLENBRkY7QUFHVkMsTUFBQUEsVUFBVSxFQUFFLFFBSEY7QUFJVkMsTUFBQUEsSUFBSSxFQUFFLFFBSkk7QUFLVkMsTUFBQUEsUUFBUSxFQUFFLENBQUMsUUFBRCxFQUFXLE1BQVgsQ0FMQTtBQU1WQyxNQUFBQSxLQUFLLEVBQUUsUUFORztBQU9WQyxNQUFBQSxXQUFXLEVBQUUsQ0FBQyxRQUFELEVBQVcsTUFBWCxDQVBIO0FBUVZDLE1BQUFBLEtBQUssRUFBRSxRQVJHO0FBU1ZDLE1BQUFBLGFBQWEsRUFBRTtBQVRMO0FBYWxCOzs7OztBQXRCcUIsR0FBckI7QUEwQkEsTUFBTUUsb0JBQW9CLEdBQUc7QUFDekI7QUFDQUMsSUFBQUEsSUFBSSxFQUFFLElBRm1COztBQUd6QjtBQUNBQyxJQUFBQSxVQUFVLEVBQUUsSUFKYTs7QUFLekI7QUFDQUMsSUFBQUEsU0FBUyxFQUFFLElBTmM7O0FBT3pCO0FBQ0FDLElBQUFBLElBQUksRUFBRUMsd0JBQVlDLFdBUk87O0FBU3pCO0FBQ0FDLElBQUFBLEtBQUssRUFBRTtBQUdYOzs7OztBQWI2QixHQUE3QjtBQWlCQSxNQUFNQyxpQkFBaUIsR0FBRztBQUN0QlAsSUFBQUEsSUFBSSxFQUFFLFFBRGdCO0FBRXRCQyxJQUFBQSxVQUFVLEVBQUUsU0FGVTtBQUd0QkMsSUFBQUEsU0FBUyxFQUFFLFFBSFc7QUFJdEJDLElBQUFBLElBQUksRUFBRSxRQUpnQjtBQUt0QkcsSUFBQUEsS0FBSyxFQUFFO0FBR1g7Ozs7OztBQVIwQixHQUExQjtBQWFBLE1BQUlFLHFCQUFKO0FBQ0EsTUFBSSxPQUFPQyxNQUFNLENBQUNELHFCQUFkLEtBQXdDLFVBQTVDLEVBQXdEQSxxQkFBcUIsR0FBR0MsTUFBTSxDQUFDRCxxQkFBL0IsQ0FBeEQsS0FDSztBQUNERSxJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYUMsc0JBQVVDLHNDQUF2Qjs7QUFDQUwsSUFBQUEscUJBQXFCLEdBQUcsK0JBQUNNLEdBQUQ7QUFBQSxhQUFTTCxNQUFNLENBQUNNLFVBQVAsQ0FBa0JELEdBQWxCLEVBQXVCLEVBQXZCLENBQVQ7QUFBQSxLQUF4QjtBQUNIO0FBRUR2QyxFQUFBQSxRQUFRLEdBQUd5QyxtQkFBT0MsU0FBUCxDQUFpQnRELE9BQWpCLEVBQTBCYSxlQUExQixFQUEyQ3NCLFlBQTNDLENBQVg7O0FBR0EsTUFBSW9CLE1BQU0sR0FBRyxJQUFJQyxrQkFBSixFQUFiO0FBQ0E7Ozs7Ozs7QUFLQUQsRUFBQUEsTUFBTSxDQUFDRSxHQUFQLENBQVcsT0FBWDtBQUNBOzs7Ozs7O0FBS0FGLEVBQUFBLE1BQU0sQ0FBQ0UsR0FBUCxDQUFXLGFBQVg7QUFDQTs7Ozs7OztBQUtBRixFQUFBQSxNQUFNLENBQUNFLEdBQVAsQ0FBVyxZQUFYO0FBQ0E7Ozs7Ozs7QUFLQUYsRUFBQUEsTUFBTSxDQUFDRSxHQUFQLENBQVcsWUFBWDtBQUNBOzs7Ozs7Ozs7Ozs7OztBQVlBLE9BQUtDLElBQUwsR0FBWUgsTUFBTSxDQUFDRyxJQUFuQjtBQUNBOzs7Ozs7OztBQU9BLE9BQUtDLE1BQUwsR0FBY0osTUFBTSxDQUFDSSxNQUFyQjtBQUVBLE1BQUlDLFlBQVksR0FBRztBQUNmQyxJQUFBQSxLQUFLLEVBQUU5RCxPQUFPLENBQUMrRCxXQUFSLEdBQXNCbEQsUUFBUSxDQUFDUSxPQUR2QjtBQUVmMkMsSUFBQUEsTUFBTSxFQUFFaEUsT0FBTyxDQUFDaUUsWUFBUixHQUF1QnBELFFBQVEsQ0FBQ1E7QUFGekIsR0FBbkI7O0FBSUEsTUFBSTZDLG9CQUFvQixHQUFHWixtQkFBT2EsbUJBQVAsRUFBM0I7O0FBQ0EsTUFBSUMsV0FBVyxHQUFHdkQsUUFBUSxDQUFDUSxPQUEzQjtBQUNBLE1BQUlnRCxlQUFlLEdBQUdyRSxPQUFPLENBQUMrRCxXQUE5QjtBQUNBLE1BQUlPLGdCQUFnQixHQUFHdEUsT0FBTyxDQUFDaUUsWUFBL0I7QUFDQSxNQUFJTSxlQUFlLEdBQUcxRCxRQUFRLENBQUNVLFdBQS9CO0FBQ0EsTUFBSWlELFdBQVcsR0FBRzNELFFBQVEsQ0FBQ1csT0FBM0I7QUFFQSxNQUFJaUQsZ0JBQWdCLEdBQUcsSUFBSUMsNEJBQUosQ0FBcUIxRSxPQUFyQixFQUE4QmEsUUFBOUIsRUFBd0NnRCxZQUF4QyxFQUFzRGMsd0JBQXRELENBQXZCOztBQUNBLE1BQUlDLFNBQVMsR0FBR0gsZ0JBQWdCLENBQUNJLGtCQUFqQixDQUFvQzNFLFVBQXBDLENBQWhCOztBQUNBNEUsRUFBQUEsV0FBVyxDQUFDQyxPQUFELEVBQVUsR0FBVixDQUFYO0FBR0E7Ozs7O0FBSUFDLEVBQUFBLE1BQU0sQ0FBQ0MsY0FBUCxDQUFzQixJQUF0QixFQUE0QixTQUE1QixFQUF1QztBQUNuQ0MsSUFBQUEsR0FBRyxFQUFFLGVBQVk7QUFDYixhQUFPNUIsbUJBQU82QixLQUFQLENBQWF0RSxRQUFiLENBQVA7QUFDSCxLQUhrQztBQUluQ3VFLElBQUFBLEdBQUcsRUFBRSxhQUFVbkYsT0FBVixFQUFtQjtBQUNwQlksTUFBQUEsUUFBUSxHQUFHeUMsbUJBQU9DLFNBQVAsQ0FBaUJ0RCxPQUFqQixFQUEwQlksUUFBMUIsRUFBb0N1QixZQUFwQyxFQUFrRCxLQUFsRCxDQUFYOztBQUNBLFVBQUltQyxlQUFlLElBQUkxRCxRQUFRLENBQUNVLFdBQWhDLEVBQTZDO0FBQ3pDZ0QsUUFBQUEsZUFBZSxHQUFHMUQsUUFBUSxDQUFDVSxXQUEzQjtBQUNBLFlBQUksQ0FBQ2IsUUFBTCxFQUFla0UsU0FBUyxDQUFDUyxJQUFWO0FBQ2xCOztBQUNELFVBQUliLFdBQVcsSUFBSTNELFFBQVEsQ0FBQ1csT0FBNUIsRUFBcUM7QUFDakNnRCxRQUFBQSxXQUFXLEdBQUczRCxRQUFRLENBQUNXLE9BQXZCOztBQUNBb0QsUUFBQUEsU0FBUyxDQUFDVSxVQUFWO0FBQ0g7QUFDSjtBQWRrQyxHQUF2QztBQWlCQTs7Ozs7OztBQU1BLE9BQUs1QixHQUFMLEdBQVcsVUFBVTZCLFlBQVYsRUFBd0I7QUFDL0JsRCxJQUFBQSxvQkFBb0IsQ0FBQ0csU0FBckIsR0FBaUMzQixRQUFRLENBQUNJLEtBQVQsRUFBakM7QUFDQXNFLElBQUFBLFlBQVksR0FBR2pDLG1CQUFPQyxTQUFQLENBQWlCZ0MsWUFBakIsRUFBK0JsRCxvQkFBL0IsRUFBcURRLGlCQUFyRCxDQUFmO0FBRUEsUUFDSTBDLFlBQVksQ0FBQzlDLElBQWIsSUFBcUJDLHdCQUFZOEMsV0FBakMsSUFDQUQsWUFBWSxDQUFDOUMsSUFBYixJQUFxQkMsd0JBQVlDLFdBRGpDLElBRUE0QyxZQUFZLENBQUM5QyxJQUFiLElBQXFCQyx3QkFBWStDLEdBRmpDLElBR0FGLFlBQVksQ0FBQzlDLElBQWIsSUFBcUJDLHdCQUFZZ0QsTUFKckMsRUFLRSxNQUFNLElBQUlDLFNBQUosQ0FBY3pDLHNCQUFVMEMscUJBQXhCLENBQU47O0FBRUZ0Qyx1QkFBT3VDLFVBQVAsQ0FBa0JOLFlBQVksQ0FBQ08sS0FBL0IsRUFBc0MxRCxZQUFZLENBQUNWLFlBQW5EOztBQUVBLFFBQUlxRSxPQUFPLEdBQUcsSUFBSXpGLHVCQUFXMEYsSUFBZixDQUFvQlQsWUFBcEIsQ0FBZDs7QUFDQWxGLElBQUFBLG1CQUFtQixDQUFDNEYsT0FBcEIsQ0FBNEIsVUFBVUQsSUFBVixFQUFnQjtBQUN4QyxVQUFJRSxnQkFBZ0IsR0FBR0YsSUFBSSxDQUFDaEcsT0FBNUI7O0FBQ0EsVUFBSXVGLFlBQVksQ0FBQy9DLFNBQWIsR0FBeUIwRCxnQkFBZ0IsQ0FBQzFELFNBQTlDLEVBQXlEO0FBQ3JEMkQsUUFBQUEsSUFBSSxHQUFHLElBQVA7QUFDQSxlQUFPO0FBQ0h6QyxVQUFBQSxHQUFHLEVBQUU7QUFBRTBDLFlBQUFBLE9BQU8sRUFBRSxJQUFYO0FBQWlCSixZQUFBQSxJQUFJLEVBQUVEO0FBQXZCLFdBREY7QUFFSE0sVUFBQUEsSUFBSSxFQUFFO0FBRkgsU0FBUDtBQUlIO0FBQ0osS0FURCxFQVNHLElBVEg7O0FBVUEsUUFBSU4sT0FBTyxDQUFDTyxVQUFSLEtBQXVCLElBQTNCLEVBQWlDakcsbUJBQW1CLENBQUNrRyxJQUFwQixDQUF5QlIsT0FBekIsRUFBa0MsS0FBbEM7QUFFcEMsR0ExQkQ7QUE0QkE7Ozs7O0FBR0EsT0FBS1MsSUFBTCxHQUFZLFlBQVk7QUFDcEIsUUFBSSxDQUFDOUYsUUFBTCxFQUFlO0FBQ1gsVUFBSSxDQUFDUCxVQUFMLEVBQ0lBLFVBQVUsR0FBRyxJQUFJZ0IsSUFBSixHQUFXQyxPQUFYLEVBQWI7QUFDSixVQUFJaEIsVUFBSixFQUNJRCxVQUFVLElBQUlVLFFBQVEsQ0FBQ0ksS0FBVCxLQUFtQmIsVUFBakM7QUFDSlEsTUFBQUEsZ0JBQWdCLEdBQUcsSUFBbkI7QUFDQUYsTUFBQUEsUUFBUSxHQUFHLElBQVg7QUFDQW9DLE1BQUFBLHFCQUFxQixDQUFDMkQsT0FBRCxDQUFyQjtBQUNIO0FBQ0osR0FWRDtBQVlBOzs7OztBQUdBLE9BQUtDLG9CQUFMLEdBQTRCO0FBQUEsV0FDeEJuRyxzQkFBc0IsQ0FBQzBGLE9BQXZCLENBQStCLFVBQUNELElBQUQ7QUFBQSxhQUFVQSxJQUFJLENBQUNoRyxPQUFMLENBQWEyRyxLQUFiLEdBQXFCLEtBQS9CO0FBQUEsS0FBL0IsQ0FEd0I7QUFBQSxHQUE1QjtBQUdBOzs7Ozs7QUFJQSxPQUFLQSxLQUFMLEdBQWEsWUFBWTtBQUNyQixRQUFJakcsUUFBSixFQUFjO0FBQ1ZOLE1BQUFBLFVBQVUsR0FBR1MsUUFBUSxDQUFDSSxLQUFULEVBQWI7QUFDQVAsTUFBQUEsUUFBUSxHQUFHLEtBQVg7QUFDSDtBQUNKLEdBTEQ7QUFPQTs7Ozs7O0FBSUEsT0FBS2tHLFdBQUwsR0FBbUIsWUFBWTtBQUMzQnZHLElBQUFBLG1CQUFtQixDQUFDd0csS0FBcEI7QUFDSCxHQUZEO0FBSUE7Ozs7OztBQUlBLE9BQUtDLFdBQUwsR0FBbUIsWUFBWTtBQUMzQnZHLElBQUFBLHNCQUFzQixDQUFDc0csS0FBdkI7O0FBQ0FqQyxJQUFBQSxTQUFTLENBQUNrQyxXQUFWO0FBQ0gsR0FIRDtBQUtBOzs7Ozs7QUFJQSxPQUFLVCxJQUFMLEdBQVksWUFBWTtBQUNwQixRQUFJM0YsUUFBSixFQUFjO0FBQ1YsV0FBS2lHLEtBQUw7QUFDSDs7QUFDRCxTQUFLQyxXQUFMO0FBQ0EsU0FBS0UsV0FBTDtBQUNBMUcsSUFBQUEsVUFBVSxHQUFHLENBQWI7QUFDQUQsSUFBQUEsVUFBVSxHQUFHLElBQWI7QUFDSCxHQVJEO0FBVUE7Ozs7OztBQUlBNkUsRUFBQUEsTUFBTSxDQUFDQyxjQUFQLENBQXNCLElBQXRCLEVBQTRCLFlBQTVCLEVBQTBDO0FBQ3RDQyxJQUFBQSxHQUFHLEVBQUUsZUFBWTtBQUNiLGFBQU82QixRQUFRLENBQUNDLGFBQVQsRUFBUDtBQUNILEtBSHFDO0FBSXRDNUIsSUFBQUEsR0FBRyxFQUFFLGFBQVU2QixVQUFWLEVBQXNCO0FBQ3ZCLFVBQUlBLFVBQUosRUFBZ0JyQyxTQUFTLENBQUNzQyxJQUFWLEdBQWhCLEtBQ0t0QyxTQUFTLENBQUN1QyxJQUFWO0FBQ1I7QUFQcUMsR0FBMUM7QUFVQTs7Ozs7QUFJQW5DLEVBQUFBLE1BQU0sQ0FBQ0MsY0FBUCxDQUFzQixJQUF0QixFQUE0QixZQUE1QixFQUEwQztBQUN0Q0MsSUFBQUEsR0FBRyxFQUFFLGVBQVk7QUFDYixhQUFPaEYsVUFBUDtBQUNIO0FBSHFDLEdBQTFDO0FBTUE7Ozs7O0FBSUE4RSxFQUFBQSxNQUFNLENBQUNDLGNBQVAsQ0FBc0IsSUFBdEIsRUFBNEIsV0FBNUIsRUFBeUM7QUFDckNDLElBQUFBLEdBQUcsRUFBRSxlQUFZO0FBQ2IsYUFBT3hFLFFBQVA7QUFDSDtBQUhvQyxHQUF6QztBQU1BOzs7OztBQUlBc0UsRUFBQUEsTUFBTSxDQUFDQyxjQUFQLENBQXNCLElBQXRCLEVBQTRCLFdBQTVCLEVBQXlDO0FBQ3JDQyxJQUFBQSxHQUFHLEVBQUUsZUFBWTtBQUNiLGFBQU87QUFDSGhFLFFBQUFBLElBQUksRUFBRVIsUUFBUSxHQUFHRyxRQUFRLENBQUNJLEtBQVQsRUFBSCxHQUFzQmIsVUFEakM7QUFFSGdILFFBQUFBLHlCQUF5QixFQUFFN0csc0JBQXNCLENBQUM4RyxNQUYvQztBQUdIQyxRQUFBQSx1QkFBdUIsRUFBRWpILG1CQUFtQixDQUFDZ0gsTUFIMUM7QUFJSEUsUUFBQUEsS0FBSyxFQUFFOUcsTUFKSjtBQUtIK0csUUFBQUEsc0JBQXNCLEVBQUVoSCx1QkFMckI7QUFNSGlILFFBQUFBLEdBQUcsRUFBRS9HLFFBQVEsR0FBR2dILElBQUksQ0FBQ0MsS0FBTCxDQUFXaEgsWUFBWSxHQUFHLElBQTFCLENBQUgsR0FBcUM7QUFOL0MsT0FBUDtBQVFIO0FBVm9DLEdBQXpDO0FBY0E7Ozs7Ozs7QUFNQSxXQUFTZ0Usd0JBQVQsQ0FBa0NpRCxJQUFsQyxFQUF3Q0Msb0JBQXhDLEVBQThEQyxDQUE5RCxFQUFpRTtBQUM3RCxRQUFJLE9BQU9BLENBQUMsQ0FBQ0MsS0FBVCxLQUFtQixXQUFuQixJQUFrQ0QsQ0FBQyxDQUFDQyxLQUFGLEtBQVksSUFBbEQsRUFBd0Q7QUFDcEQsVUFBSUMsR0FBRyxHQUFHQyxRQUFRLENBQUNDLGVBQW5CO0FBQUEsVUFBb0NDLElBQUksR0FBR0YsUUFBUSxDQUFDRSxJQUFwRDtBQUNBTCxNQUFBQSxDQUFDLENBQUNDLEtBQUYsR0FBVUQsQ0FBQyxDQUFDTSxPQUFGLElBQWFKLEdBQUcsSUFBSUEsR0FBRyxDQUFDSyxVQUFYLElBQXlCRixJQUFJLElBQUlBLElBQUksQ0FBQ0UsVUFBdEMsSUFBb0QsQ0FBakUsS0FBdUVMLEdBQUcsSUFBSUEsR0FBRyxDQUFDTSxVQUFYLElBQXlCSCxJQUFJLElBQUlBLElBQUksQ0FBQ0csVUFBdEMsSUFBb0QsQ0FBM0gsQ0FBVjtBQUNBUixNQUFBQSxDQUFDLENBQUNTLEtBQUYsR0FBVVQsQ0FBQyxDQUFDVSxPQUFGLElBQWFSLEdBQUcsSUFBSUEsR0FBRyxDQUFDUyxTQUFYLElBQXdCTixJQUFJLElBQUlBLElBQUksQ0FBQ00sU0FBckMsSUFBa0QsQ0FBL0QsS0FBcUVULEdBQUcsSUFBSUEsR0FBRyxDQUFDVSxTQUFYLElBQXdCUCxJQUFJLElBQUlBLElBQUksQ0FBQ08sU0FBckMsSUFBa0QsQ0FBdkgsQ0FBVjtBQUNIOztBQUNEbEYsSUFBQUEsTUFBTSxDQUFDbUYsT0FBUCxDQUFlZixJQUFmLEVBQXFCO0FBQ2pCOzs7OztBQUtBZ0IsTUFBQUEsZUFBZSxFQUFFO0FBQUEsZUFBTXRGLG1CQUFPNkIsS0FBUCxDQUFhMEMsb0JBQW9CLENBQUN0QyxZQUFsQyxDQUFOO0FBQUEsT0FOQTs7QUFPakI7Ozs7OztBQU1Bc0QsTUFBQUEsZUFBZSxFQUFFLHlCQUFDdEQsWUFBRCxFQUFrQztBQUFBLFlBQW5CdUQsTUFBbUIsdUVBQVYsS0FBVTtBQUMvQyxZQUFJLE9BQU9BLE1BQVAsSUFBaUIsU0FBckIsRUFBZ0MsTUFBTSxJQUFJbkQsU0FBSixDQUFjekMsc0JBQVUwQyxxQkFBeEIsQ0FBTjs7QUFDaEMsWUFBSW1ELGdCQUFnQixHQUFHekYsbUJBQU82QixLQUFQLENBQWF0QyxpQkFBYixDQUF2Qjs7QUFDQWtHLFFBQUFBLGdCQUFnQixDQUFDakQsS0FBakIsR0FBeUIxRCxZQUFZLENBQUNWLFlBQXRDO0FBQ0FtRyxRQUFBQSxvQkFBb0IsQ0FBQ3RDLFlBQXJCLEdBQW9DakMsbUJBQU9DLFNBQVAsQ0FBaUJnQyxZQUFqQixFQUErQnNDLG9CQUFvQixDQUFDdEMsWUFBcEQsRUFBa0V3RCxnQkFBbEUsQ0FBcEM7QUFDQSxZQUFJRCxNQUFNLEtBQUssSUFBZixFQUFxQmxFLFNBQVMsQ0FBQ29FLGtCQUFWLENBQTZCbkIsb0JBQTdCO0FBQ3JCLFlBQUksQ0FBQ25ILFFBQUQsSUFBYW9JLE1BQWpCLEVBQXlCbEUsU0FBUyxDQUFDUyxJQUFWO0FBQzVCLE9BcEJnQjs7QUFxQmpCOzs7OztBQUtBNEQsTUFBQUEsWUFBWSxFQUFFO0FBQUEsZUFBTSxDQUFDcEIsb0JBQW9CLENBQUNsQixLQUE1QjtBQUFBLE9BMUJHOztBQTJCakI7Ozs7O0FBS0F1QyxNQUFBQSxZQUFZLEVBQUUsc0JBQUMxQyxJQUFELEVBQVU7QUFDcEIsWUFBSSxPQUFPQSxJQUFQLElBQWUsU0FBbkIsRUFBOEIsTUFBTSxJQUFJYixTQUFKLENBQWN6QyxzQkFBVTBDLHFCQUF4QixDQUFOO0FBQzlCaUMsUUFBQUEsb0JBQW9CLENBQUNsQixLQUFyQixHQUE2QixDQUFDSCxJQUE5QjtBQUNILE9BbkNnQjtBQW9DakIyQyxNQUFBQSxPQUFPLEVBQUVyQixDQUFDLENBQUNxQixPQXBDTTtBQW9DR0MsTUFBQUEsT0FBTyxFQUFFdEIsQ0FBQyxDQUFDc0IsT0FwQ2Q7QUFxQ2pCckIsTUFBQUEsS0FBSyxFQUFFRCxDQUFDLENBQUNDLEtBckNRO0FBcUNEUSxNQUFBQSxLQUFLLEVBQUVULENBQUMsQ0FBQ1MsS0FyQ1I7QUFzQ2pCSCxNQUFBQSxPQUFPLEVBQUVOLENBQUMsQ0FBQ00sT0F0Q007QUFzQ0dJLE1BQUFBLE9BQU8sRUFBRVYsQ0FBQyxDQUFDVTtBQXRDZCxLQUFyQjtBQXdDSDtBQUVEOzs7Ozs7QUFJQSxXQUFTL0IsT0FBVCxHQUFtQjtBQUNmLFFBQUk0QyxPQUFPLEdBQUcsSUFBSWxJLElBQUosR0FBV0MsT0FBWCxFQUFkO0FBQ0EsUUFBSVIsZ0JBQWdCLElBQUksSUFBeEIsRUFDSUQsWUFBWSxHQUFHLEtBQUswSSxPQUFPLEdBQUd6SSxnQkFBZixDQUFmO0FBQ0pBLElBQUFBLGdCQUFnQixHQUFHeUksT0FBbkI7QUFDQUMsSUFBQUEsd0JBQXdCO0FBQ3hCQyxJQUFBQSx3QkFBd0I7O0FBQ3hCM0UsSUFBQUEsU0FBUyxDQUFDUyxJQUFWOztBQUNBLFFBQUkzRSxRQUFKLEVBQ0lvQyxxQkFBcUIsQ0FBQzJELE9BQUQsQ0FBckI7QUFDUDtBQUVEOzs7Ozs7QUFJQSxXQUFTOEMsd0JBQVQsR0FBb0M7QUFDaENoSixJQUFBQSxzQkFBc0IsQ0FBQzBGLE9BQXZCLENBQStCLFVBQUNELElBQUQsRUFBVTtBQUNyQyxVQUFJNkIsb0JBQW9CLEdBQUc3QixJQUFJLENBQUNoRyxPQUFoQztBQUNBLFVBQUk2SCxvQkFBb0IsQ0FBQ2xCLEtBQXpCLEVBQWdDOztBQUNoQyxVQUFJMEMsT0FBTyxHQUFHeEksUUFBUSxDQUFDSSxLQUFULEVBQWQ7O0FBQ0EsY0FBUTRHLG9CQUFvQixDQUFDcEYsSUFBN0I7QUFDSSxhQUFLQyx3QkFBWUMsV0FBakI7QUFDSSxjQUFJa0Ysb0JBQW9CLENBQUMyQixDQUFyQixHQUF5QixDQUFDM0Isb0JBQW9CLENBQUMvRCxLQUFuRCxFQUEwRDtBQUN0RCtELFlBQUFBLG9CQUFvQixDQUFDMkIsQ0FBckIsSUFBMEIzQixvQkFBb0IsQ0FBQ3RDLFlBQXJCLENBQWtDTyxLQUFsQyxDQUF3QzVELEtBQXhDLEdBQWdEckIsUUFBUSxDQUFDRyxTQUF6RCxHQUFxRUwsWUFBL0Y7QUFDSCxXQUZELE1BR0s7QUFDRGlFLFlBQUFBLFNBQVMsVUFBVCxDQUFpQmlELG9CQUFqQjs7QUFDQSxtQkFBTztBQUFFNEIsY0FBQUEsTUFBTSxFQUFFO0FBQVYsYUFBUDtBQUNIOztBQUNEOztBQUNKLGFBQUsvRyx3QkFBWThDLFdBQWpCO0FBQ0ksY0FBSXFDLG9CQUFvQixDQUFDMkIsQ0FBckIsR0FBeUIzRixZQUFZLENBQUNDLEtBQTFDLEVBQWlEO0FBQzdDK0QsWUFBQUEsb0JBQW9CLENBQUMyQixDQUFyQixJQUEwQjNCLG9CQUFvQixDQUFDdEMsWUFBckIsQ0FBa0NPLEtBQWxDLENBQXdDNUQsS0FBeEMsR0FBZ0RyQixRQUFRLENBQUNHLFNBQXpELEdBQXFFTCxZQUEvRjtBQUNILFdBRkQsTUFHSztBQUNEaUUsWUFBQUEsU0FBUyxVQUFULENBQWlCaUQsb0JBQWpCOztBQUNBLG1CQUFPO0FBQUU0QixjQUFBQSxNQUFNLEVBQUU7QUFBVixhQUFQO0FBQ0g7O0FBQ0Q7O0FBQ0osYUFBSy9HLHdCQUFZK0MsR0FBakI7QUFDQSxhQUFLL0Msd0JBQVlnRCxNQUFqQjtBQUNJLGNBQUltQyxvQkFBb0IsQ0FBQzZCLE9BQXJCLEdBQStCTCxPQUFuQyxFQUE0QztBQUN4Q3pFLFlBQUFBLFNBQVMsVUFBVCxDQUFpQmlELG9CQUFqQjs7QUFDQSxtQkFBTztBQUFFNEIsY0FBQUEsTUFBTSxFQUFFO0FBQVYsYUFBUDtBQUNIOztBQUNEO0FBekJSO0FBMkJILEtBL0JELEVBK0JHLElBL0JIO0FBZ0NIO0FBRUQ7Ozs7OztBQUlBLFdBQVNILHdCQUFULEdBQW9DO0FBQ2hDLFFBQUkvSSxzQkFBc0IsQ0FBQzhHLE1BQXZCLEtBQWtDLENBQXRDLEVBQ0k1RyxNQUFNLEdBQUcsQ0FBVDtBQUNKLFFBQUlrSixLQUFLLEdBQUdqQyxJQUFJLENBQUNDLEtBQUwsQ0FBV2hILFlBQVksR0FBRyxJQUExQixDQUFaOztBQUNBLE9BQUc7QUFDQyxVQUFJcUYsSUFBSSxHQUFHM0YsbUJBQW1CLENBQUN1SixHQUFwQixDQUF3QixLQUF4QixFQUErQixLQUEvQixDQUFYOztBQUNBLFVBQUk1RCxJQUFJLEtBQUssSUFBYixFQUFtQjtBQUNuQixVQUFJVCxZQUFZLEdBQUdTLElBQUksQ0FBQ2hHLE9BQXhCOztBQUNBLFVBQUlxSixPQUFPLEdBQUd4SSxRQUFRLENBQUNJLEtBQVQsRUFBZDs7QUFDQSxVQUFJc0UsWUFBWSxDQUFDL0MsU0FBYixHQUF5QjZHLE9BQTdCLEVBQXNDOztBQUN0QyxVQUFJLENBQUN4SSxRQUFRLENBQUNTLGNBQVYsSUFBNEIsQ0FBQ2lFLFlBQVksQ0FBQ2hELFVBQTFDLElBQXdEZ0QsWUFBWSxDQUFDL0MsU0FBYixHQUF5QjZHLE9BQU8sR0FBRzNCLElBQUksQ0FBQ0MsS0FBTCxDQUFXLElBQUloSCxZQUFmLElBQStCLEVBQTlILEVBQWtJO0FBQzlINEUsUUFBQUEsWUFBWSxDQUFDTyxLQUFiLEdBQXFCeEMsbUJBQU9DLFNBQVAsQ0FBaUJnQyxZQUFZLENBQUNPLEtBQTlCLEVBQXFDakYsUUFBUSxDQUFDYSxZQUE5QyxFQUE0RFUsWUFBWSxDQUFDVixZQUF6RSxDQUFyQjtBQUNBbUksUUFBQUEsdUJBQXVCLENBQUNSLE9BQUQsRUFBVTlELFlBQVYsQ0FBdkI7QUFDSCxPQUhELE1BSUsvRSx1QkFBdUI7O0FBQzVCd0YsTUFBQUEsSUFBSSxDQUFDeUQsTUFBTDtBQUNBRSxNQUFBQSxLQUFLO0FBQ1IsS0FiRCxRQWFTcEosc0JBQXNCLENBQUM4RyxNQUF2QixLQUFrQyxDQUFsQyxJQUF1Q3NDLEtBQUssR0FBRyxDQWJ4RDtBQWNIO0FBRUQ7Ozs7Ozs7O0FBTUEsV0FBU0UsdUJBQVQsQ0FBaUNSLE9BQWpDLEVBQTBDOUQsWUFBMUMsRUFBd0Q7QUFDcEQ5RSxJQUFBQSxNQUFNLEdBQUc0SSxPQUFPLEdBQUc5RCxZQUFZLENBQUMvQyxTQUFoQztBQUNBLFFBQUlxRixvQkFBb0IsR0FBRyxFQUEzQjtBQUNBQSxJQUFBQSxvQkFBb0IsQ0FBQ2xCLEtBQXJCLEdBQTZCLEtBQTdCO0FBQ0FrQixJQUFBQSxvQkFBb0IsQ0FBQ3RDLFlBQXJCLEdBQW9DQSxZQUFwQztBQUNBc0MsSUFBQUEsb0JBQW9CLENBQUNyRixTQUFyQixHQUFpQzZHLE9BQWpDO0FBQ0F4QixJQUFBQSxvQkFBb0IsQ0FBQy9GLElBQXJCLEdBQTRCeUQsWUFBWSxDQUFDTyxLQUFiLENBQW1CaEUsSUFBL0M7QUFDQStGLElBQUFBLG9CQUFvQixDQUFDcEYsSUFBckIsR0FBNEI4QyxZQUFZLENBQUM5QyxJQUF6QztBQUNBb0YsSUFBQUEsb0JBQW9CLENBQUM3RCxNQUFyQixHQUE4QjZELG9CQUFvQixDQUFDL0YsSUFBbkQ7O0FBQ0E4QyxJQUFBQSxTQUFTLENBQUNrRixnQkFBVixDQUEyQmpDLG9CQUEzQjs7QUFDQSxZQUFRdEMsWUFBWSxDQUFDOUMsSUFBckI7QUFDSSxXQUFLQyx3QkFBWUMsV0FBakI7QUFDSWtGLFFBQUFBLG9CQUFvQixDQUFDNkIsT0FBckIsR0FBK0JoQyxJQUFJLENBQUNxQyxLQUFMLENBQVdWLE9BQU8sR0FBRyxDQUFDeEYsWUFBWSxDQUFDQyxLQUFiLEdBQXFCK0Qsb0JBQW9CLENBQUMvRCxLQUEzQyxLQUFxRHlCLFlBQVksQ0FBQ08sS0FBYixDQUFtQjVELEtBQW5CLEdBQTJCckIsUUFBUSxDQUFDRyxTQUF6RixDQUFyQixDQUEvQjtBQUNBNkcsUUFBQUEsb0JBQW9CLENBQUMyQixDQUFyQixHQUF5QjNGLFlBQVksQ0FBQ0MsS0FBdEM7QUFDQStELFFBQUFBLG9CQUFvQixDQUFDbUMsQ0FBckIsR0FBeUJuSixRQUFRLENBQUNFLGdCQUFsQztBQUNBOztBQUNKLFdBQUsyQix3QkFBWThDLFdBQWpCO0FBQ0lxQyxRQUFBQSxvQkFBb0IsQ0FBQzZCLE9BQXJCLEdBQStCaEMsSUFBSSxDQUFDcUMsS0FBTCxDQUFXVixPQUFPLEdBQUcsQ0FBQ3hGLFlBQVksQ0FBQ0MsS0FBYixHQUFxQitELG9CQUFvQixDQUFDL0QsS0FBM0MsS0FBcUR5QixZQUFZLENBQUNPLEtBQWIsQ0FBbUI1RCxLQUFuQixHQUEyQnJCLFFBQVEsQ0FBQ0csU0FBekYsQ0FBckIsQ0FBL0I7QUFDQTZHLFFBQUFBLG9CQUFvQixDQUFDMkIsQ0FBckIsR0FBeUIsQ0FBQzNCLG9CQUFvQixDQUFDL0QsS0FBL0M7QUFDQStELFFBQUFBLG9CQUFvQixDQUFDbUMsQ0FBckIsR0FBeUJuSixRQUFRLENBQUNFLGdCQUFsQztBQUNBOztBQUNKLFdBQUsyQix3QkFBWStDLEdBQWpCO0FBQ0lvQyxRQUFBQSxvQkFBb0IsQ0FBQzZCLE9BQXJCLEdBQStCN0Isb0JBQW9CLENBQUNyRixTQUFyQixHQUFpQytDLFlBQVksQ0FBQ08sS0FBYixDQUFtQjNELGFBQW5CLEdBQW1DdEIsUUFBUSxDQUFDRyxTQUE1RztBQUNBNkcsUUFBQUEsb0JBQW9CLENBQUMyQixDQUFyQixHQUF5QjlCLElBQUksQ0FBQ3FDLEtBQUwsQ0FBVyxDQUFDbEcsWUFBWSxDQUFDQyxLQUFiLEdBQXFCK0Qsb0JBQW9CLENBQUMvRCxLQUEzQyxJQUFvRCxDQUEvRCxDQUF6QjtBQUNBK0QsUUFBQUEsb0JBQW9CLENBQUNtQyxDQUFyQixHQUF5Qm5KLFFBQVEsQ0FBQ0UsZ0JBQWxDO0FBQ0E7O0FBQ0osV0FBSzJCLHdCQUFZZ0QsTUFBakI7QUFDSW1DLFFBQUFBLG9CQUFvQixDQUFDNkIsT0FBckIsR0FBK0I3QixvQkFBb0IsQ0FBQ3JGLFNBQXJCLEdBQWlDK0MsWUFBWSxDQUFDTyxLQUFiLENBQW1CM0QsYUFBbkIsR0FBbUN0QixRQUFRLENBQUNHLFNBQTVHO0FBQ0E2RyxRQUFBQSxvQkFBb0IsQ0FBQzJCLENBQXJCLEdBQXlCOUIsSUFBSSxDQUFDcUMsS0FBTCxDQUFXLENBQUNsRyxZQUFZLENBQUNDLEtBQWIsR0FBcUIrRCxvQkFBb0IsQ0FBQy9ELEtBQTNDLElBQW9ELENBQS9ELENBQXpCO0FBQ0ErRCxRQUFBQSxvQkFBb0IsQ0FBQ21DLENBQXJCLEdBQXlCLENBQUNuSixRQUFRLENBQUNFLGdCQUFWLEdBQTZCOEcsb0JBQW9CLENBQUM3RCxNQUEzRTtBQUNBO0FBcEJSOztBQXVCQSxRQUFJK0IsT0FBTyxHQUFHLElBQUl6Rix1QkFBVzBGLElBQWYsQ0FBb0I2QixvQkFBcEIsQ0FBZDs7QUFDQSxRQUFJdEMsWUFBWSxDQUFDOUMsSUFBYixLQUFzQkMsd0JBQVkrQyxHQUFsQyxJQUF5Q0YsWUFBWSxDQUFDOUMsSUFBYixLQUFzQkMsd0JBQVlnRCxNQUEvRSxFQUF1RjtBQUNuRm5GLE1BQUFBLHNCQUFzQixDQUFDMEYsT0FBdkIsQ0FBK0IsVUFBQ0QsSUFBRCxFQUFVO0FBQ3JDLFlBQUlpRSx3QkFBd0IsR0FBR2pFLElBQUksQ0FBQ2hHLE9BQXBDO0FBRUEsWUFBSWlLLHdCQUF3QixDQUFDMUUsWUFBekIsQ0FBc0M5QyxJQUF0QyxJQUE4QzhDLFlBQVksQ0FBQzlDLElBQS9ELEVBQ0k7O0FBQ0osWUFBSThDLFlBQVksQ0FBQzlDLElBQWIsS0FBc0JDLHdCQUFZK0MsR0FBdEMsRUFBMkM7QUFFdkMsY0FBSW9DLG9CQUFvQixDQUFDbUMsQ0FBckIsR0FBeUJuQyxvQkFBb0IsQ0FBQzdELE1BQTlDLEdBQXVEaUcsd0JBQXdCLENBQUNELENBQXBGLEVBQXVGO0FBQ25GRSxZQUFBQSxVQUFVLENBQUNyQyxvQkFBRCxDQUFWO0FBQ0EsbUJBQU87QUFBRW5FLGNBQUFBLEdBQUcsRUFBRTtBQUFFMEMsZ0JBQUFBLE9BQU8sRUFBRSxJQUFYO0FBQWlCSixnQkFBQUEsSUFBSSxFQUFFRDtBQUF2QixlQUFQO0FBQXlDTSxjQUFBQSxJQUFJLEVBQUU7QUFBL0MsYUFBUDtBQUNIOztBQUVELGNBQUk0RCx3QkFBd0IsQ0FBQ1AsT0FBekIsR0FBbUNMLE9BQXZDLEVBQ0l4QixvQkFBb0IsQ0FBQ21DLENBQXJCLEdBQXlCQyx3QkFBd0IsQ0FBQ0QsQ0FBbEQsQ0FESixLQUdJbkMsb0JBQW9CLENBQUNtQyxDQUFyQixHQUF5QkMsd0JBQXdCLENBQUNELENBQXpCLEdBQTZCQyx3QkFBd0IsQ0FBQ2pHLE1BQXRELEdBQStEbkQsUUFBUSxDQUFDRSxnQkFBakc7QUFDUCxTQVhELE1BWUs7QUFFRCxjQUFJOEcsb0JBQW9CLENBQUNtQyxDQUFyQixHQUF5QkMsd0JBQXdCLENBQUNELENBQXpCLEdBQTZCQyx3QkFBd0IsQ0FBQ2pHLE1BQW5GLEVBQTJGO0FBQ3ZGa0csWUFBQUEsVUFBVSxDQUFDckMsb0JBQUQsQ0FBVjtBQUNBLG1CQUFPO0FBQUVuRSxjQUFBQSxHQUFHLEVBQUU7QUFBRTBDLGdCQUFBQSxPQUFPLEVBQUUsSUFBWDtBQUFpQkosZ0JBQUFBLElBQUksRUFBRUQ7QUFBdkIsZUFBUDtBQUF5Q00sY0FBQUEsSUFBSSxFQUFFO0FBQS9DLGFBQVA7QUFDSDs7QUFFRCxjQUFJNEQsd0JBQXdCLENBQUNQLE9BQXpCLEdBQW1DTCxPQUF2QyxFQUNJeEIsb0JBQW9CLENBQUNtQyxDQUFyQixHQUF5QkMsd0JBQXdCLENBQUNELENBQWxELENBREosS0FHSW5DLG9CQUFvQixDQUFDbUMsQ0FBckIsR0FBeUJDLHdCQUF3QixDQUFDRCxDQUF6QixHQUE2Qm5DLG9CQUFvQixDQUFDN0QsTUFBbEQsR0FBMkRuRCxRQUFRLENBQUNFLGdCQUE3RjtBQUNQO0FBQ0osT0E3QkQsRUE2QkcsSUE3Qkg7QUE4QkgsS0EvQkQsTUFnQ0s7QUFFRCxVQUFJb0osNkJBQTZCLEdBQUd0QyxvQkFBb0IsQ0FBQy9ELEtBQXJCLElBQThCeUIsWUFBWSxDQUFDTyxLQUFiLENBQW1CNUQsS0FBbkIsR0FBMkJyQixRQUFRLENBQUNHLFNBQWxFLENBQXBDOztBQUNBVCxNQUFBQSxzQkFBc0IsQ0FBQzBGLE9BQXZCLENBQStCLFVBQUNELElBQUQsRUFBVTtBQUNyQyxZQUFJaUUsd0JBQXdCLEdBQUdqRSxJQUFJLENBQUNoRyxPQUFwQztBQUVBLFlBQUlpSyx3QkFBd0IsQ0FBQzFFLFlBQXpCLENBQXNDOUMsSUFBdEMsS0FBK0NDLHdCQUFZK0MsR0FBM0QsSUFBa0V3RSx3QkFBd0IsQ0FBQzFFLFlBQXpCLENBQXNDOUMsSUFBdEMsS0FBK0NDLHdCQUFZZ0QsTUFBakksRUFDSTs7QUFFSixZQUFJbUMsb0JBQW9CLENBQUNtQyxDQUFyQixHQUF5Qm5DLG9CQUFvQixDQUFDN0QsTUFBOUMsR0FBdURpRyx3QkFBd0IsQ0FBQ0QsQ0FBcEYsRUFBdUY7QUFDbkZFLFVBQUFBLFVBQVUsQ0FBQ3JDLG9CQUFELENBQVY7QUFDQSxpQkFBTztBQUFFbkUsWUFBQUEsR0FBRyxFQUFFO0FBQUUwQyxjQUFBQSxPQUFPLEVBQUUsSUFBWDtBQUFpQkosY0FBQUEsSUFBSSxFQUFFRDtBQUF2QixhQUFQO0FBQXlDTSxZQUFBQSxJQUFJLEVBQUU7QUFBL0MsV0FBUDtBQUNIOztBQUVELFlBQUkrRCxpQ0FBaUMsR0FBR0gsd0JBQXdCLENBQUNuRyxLQUF6QixJQUFrQ21HLHdCQUF3QixDQUFDMUUsWUFBekIsQ0FBc0NPLEtBQXRDLENBQTRDNUQsS0FBNUMsR0FBb0RyQixRQUFRLENBQUNHLFNBQS9GLENBQXhDO0FBRUEsWUFBSWlKLHdCQUF3QixDQUFDekgsU0FBekIsR0FBcUM0SCxpQ0FBckMsSUFBMEVmLE9BQTFFLElBQ0FZLHdCQUF3QixDQUFDUCxPQUF6QixJQUFvQzdCLG9CQUFvQixDQUFDNkIsT0FBckIsR0FBK0JTLDZCQUR2RSxFQUVJdEMsb0JBQW9CLENBQUNtQyxDQUFyQixHQUF5QkMsd0JBQXdCLENBQUNELENBQXpCLEdBQTZCQyx3QkFBd0IsQ0FBQ2pHLE1BQXRELEdBQStEbkQsUUFBUSxDQUFDRSxnQkFBakcsQ0FGSixLQUlJOEcsb0JBQW9CLENBQUNtQyxDQUFyQixHQUF5QkMsd0JBQXdCLENBQUNELENBQWxEO0FBQ1AsT0FsQkQsRUFrQkcsSUFsQkg7QUFtQkg7O0FBQ0QsUUFBSWpFLE9BQU8sQ0FBQ08sVUFBUixLQUF1QixJQUEzQixFQUFpQztBQUM3QjRELE1BQUFBLFVBQVUsQ0FBQ3JDLG9CQUFELENBQVY7O0FBQ0F0SCxNQUFBQSxzQkFBc0IsQ0FBQ2dHLElBQXZCLENBQTRCUixPQUE1QixFQUFxQyxLQUFyQztBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozs7QUFNQSxXQUFTbUUsVUFBVCxDQUFvQnJDLG9CQUFwQixFQUEwQztBQUN0QyxRQUFJdEMsWUFBWSxHQUFHc0Msb0JBQW9CLENBQUN0QyxZQUF4Qzs7QUFDQSxRQUNJQSxZQUFZLENBQUM5QyxJQUFiLEtBQXNCQyx3QkFBWThDLFdBQWxDLElBQ0FELFlBQVksQ0FBQzlDLElBQWIsS0FBc0JDLHdCQUFZQyxXQURsQyxJQUVBNEMsWUFBWSxDQUFDOUMsSUFBYixLQUFzQkMsd0JBQVkrQyxHQUh0QyxFQUlFO0FBQ0VvQyxNQUFBQSxvQkFBb0IsQ0FBQ3dDLE9BQXJCLEdBQStCeEMsb0JBQW9CLENBQUNtQyxDQUFyQixJQUEwQm5HLFlBQVksQ0FBQ0csTUFBYixHQUFzQjZELG9CQUFvQixDQUFDN0QsTUFBckUsQ0FBL0I7QUFDSCxLQU5ELE1BT0ssSUFBSXVCLFlBQVksQ0FBQzlDLElBQWIsS0FBc0JDLHdCQUFZZ0QsTUFBdEMsRUFBOEM7QUFDL0NtQyxNQUFBQSxvQkFBb0IsQ0FBQ3dDLE9BQXJCLEdBQStCeEcsWUFBWSxDQUFDRyxNQUFiLEdBQXNCNkQsb0JBQW9CLENBQUNtQyxDQUFyQixHQUF5Qm5HLFlBQVksQ0FBQ0csTUFBM0Y7QUFDSDtBQUNKO0FBRUQ7Ozs7OztBQUlBLFdBQVNlLE9BQVQsR0FBbUI7QUFDZixRQUFJdUYsZ0JBQWdCLEdBQUdoSCxtQkFBT2EsbUJBQVAsRUFBdkI7O0FBQ0EsUUFBSUQsb0JBQW9CLElBQUlvRyxnQkFBeEIsSUFDQWpHLGVBQWUsSUFBSXJFLE9BQU8sQ0FBQytELFdBRDNCLElBRUFPLGdCQUFnQixJQUFJdEUsT0FBTyxDQUFDaUUsWUFGNUIsSUFHQUcsV0FBVyxJQUFJdkQsUUFBUSxDQUFDUSxPQUg1QixFQUdxQztBQUNqQytDLE1BQUFBLFdBQVcsR0FBR3ZELFFBQVEsQ0FBQ1EsT0FBdkI7QUFDQXdDLE1BQUFBLFlBQVksQ0FBQ0MsS0FBYixHQUFxQjlELE9BQU8sQ0FBQytELFdBQVIsR0FBc0JsRCxRQUFRLENBQUNRLE9BQXBEO0FBQ0F3QyxNQUFBQSxZQUFZLENBQUNHLE1BQWIsR0FBc0JoRSxPQUFPLENBQUNpRSxZQUFSLEdBQXVCcEQsUUFBUSxDQUFDUSxPQUF0RDtBQUNBZ0QsTUFBQUEsZUFBZSxHQUFHckUsT0FBTyxDQUFDK0QsV0FBMUI7QUFDQU8sTUFBQUEsZ0JBQWdCLEdBQUd0RSxPQUFPLENBQUNpRSxZQUEzQjtBQUNBQyxNQUFBQSxvQkFBb0IsR0FBR29HLGdCQUF2Qjs7QUFDQTFGLE1BQUFBLFNBQVMsQ0FBQ0csT0FBVjs7QUFDQSxVQUFJLENBQUNyRSxRQUFMLEVBQWVrRSxTQUFTLENBQUNTLElBQVY7QUFDbEI7QUFDSjs7QUFHRCxNQUFJLENBQUMsQ0FBQ3RDLE1BQU0sQ0FBQ3dILGFBQVQsSUFBMEIsbUJBQW1CeEgsTUFBN0MsSUFBdUR5SCxTQUFTLENBQUNDLFNBQVYsQ0FBb0JDLE9BQXBCLENBQTRCLFNBQTVCLElBQXlDLENBQUMsQ0FBakcsSUFDQUYsU0FBUyxDQUFDQyxTQUFWLENBQW9CQyxPQUFwQixDQUE0QixNQUE1QixJQUFzQyxDQUFDLENBRHZDLElBQzRDRixTQUFTLENBQUNDLFNBQVYsQ0FBb0JDLE9BQXBCLENBQTRCLE1BQTVCLElBQXNDLENBQUMsQ0FEdkYsRUFDMEYxSCxPQUFPLENBQUMySCxJQUFSLENBQ2xGekgsc0JBQVUwSCxjQUFWLENBQXlCQyxRQUF6QixDQUFrQ0MsS0FBbEMsQ0FEa0YsRUFEMUYsS0FLSzlILE9BQU8sQ0FBQzJILElBQVIsQ0FDRHpILHNCQUFVNkgsV0FBVixDQUFzQkYsUUFBdEIsQ0FBK0JDLEtBQS9CLENBREMsRUFFRCxrQ0FGQyxFQUVtQyxFQUZuQyxFQUV1QyxvQkFGdkMsRUFFNkQsRUFGN0Q7QUFJUixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExpbmtlZExpc3QgZnJvbSAnLi4vbGliL2xpbmtlZExpc3QnXG5pbXBvcnQgRXZlbnQgZnJvbSAnLi4vbGliL2V2ZW50J1xuaW1wb3J0IFJlbmRlcmVyc0ZhY3RvcnkgZnJvbSAnLi4vcmVuZGVyZXJzL3JlbmRlcmVyc0ZhY3RvcnknXG5pbXBvcnQgR2VuZXJhbFR5cGUgZnJvbSAnLi9nZW5lcmFsVHlwZSdcbmltcG9ydCBIZWxwZXIgZnJvbSAnLi4vbGliL2hlbHBlcidcbmltcG9ydCBSZXNvdXJjZXMgZnJvbSAnLi4vbGliL3Jlc291cmNlcydcbmltcG9ydCAqIGFzIGJ1aWxkIGZyb20gJy4uL2J1aWxkLmpzb24nXG5cbi8qKiBcbiAqIOW8ueW5leW8leaTjuWvueixoeexuyBcbiAqIEBhbGlhcyBvcGVuQlNFLkdlbmVyYWxFbmdpbmVcbiAqIEBwcm9wZXJ0eSB7b3BlbkJTRX5PcHRpb25zfSBvcHRpb25zIC0g6K6+572u5oiW6I635Y+W5YWo5bGA6YCJ6aG544CCXG4gKiBAcHJvcGVydHkge2Jvb2x9IHZpc2liaWxpdHkgLSDojrflj5bmiJborr7nva7lvLnluZXlj6/op4HmgKfjgIJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSByZW5kZXJNb2RlIC0g6I635Y+W5riy5p+T5qih5byP44CC5Y+W5YC85Li64oCcY2FudmFz4oCd44CB4oCcY3NzM+KAneOAgeKAnHdlYmds4oCd5oiW4oCcc3Zn4oCd44CCXG4gKiBAcHJvcGVydHkge2Jvb2x9IHBsYXlTdGF0ZSAtIOiOt+WPluaSreaUvueKtuaAgeOAgnRydWXvvJrmraPlnKjmkq3mlL7vvJtmYWxzZe+8muW3suaaguWBnC/lgZzmraLmkq3mlL7jgIJcbiAqIEBwcm9wZXJ0eSB7b3BlbkJTRX5EZWJ1Z0luZm99IGRlYnVnSW5mbyAtIOiOt+WPluiwg+ivleS/oeaBr+OAglxuICogQHRocm93cyB7b3BlbkJTRS5Ccm93c2VyTm90U3VwcG9ydEVycm9yfSDmtY/op4jlmajkuI3mlK/mjIHnibnlrprmuLLmn5PmqKHlvI/ml7blvJXlj5HplJnor6/jgIJcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn0g5Lyg5YWl55qE5Y+C5pWw6ZSZ6K+v5pe25byV5Y+R6ZSZ6K+v44CC6K+35Y+C6ZiFIE1ETiBbVHlwZUVycm9yXXtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy96aC1DTi9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9UeXBlRXJyb3J9IOOAglxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHZW5lcmFsRW5naW5lIHtcbiAgICAvKipcbiAgICAgKiDliJvlu7rkuIDkuKrlvLnluZXlvJXmk47lr7nosaHjgIJcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgLSDopoHliqDovb3lvLnluZXnmoTlhYPntKDvvJrmnInlhbMgRWxlbWVudCDmjqXlj6PnmoTkv6Hmga/or7flj4LpmIVNRE4gW0VsZW1lbnRde0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3poLUNOL2RvY3MvV2ViL0FQSS9FbGVtZW50fSDjgIJcbiAgICAgKiBAcGFyYW0ge29wZW5CU0V+T3B0aW9uc30gW19vcHRpb25zXSAtIOWFqOWxgOmAiemhue+8muS4gOS4qiB7QGxpbmsgb3BlbkJTRX5PcHRpb25zfSDnu5PmnoTjgIJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3JlbmRlck1vZGU9XCJjYW52YXNcIl0gLSDmuLLmn5PmqKHlvI/vvJrpu5jorqTkuLrigJxjYW52YXPigJ0sIOKAnOWPr+mAiWNzczPigJ3vvIwg4oCcd2ViZ2zigJ3lkozigJxzdmfigJ3jgILkuIDoiKzlu7rorq7kvb/nlKjigJxjYW52YXPigJ3vvIjnibnliKvmmK8gRmlyZUZveCDmtY/op4jlmaggQ1NTMyDmuLLmn5PmlYjnjofovoPkvY7vvInjgILlnKjkuIDkupvniYjmnKzovoPogIHnmoTmtY/op4jlmajkuK3igJx3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpb+KAneWPmOmHj+S4jeiiq+aUr+aMgeaIluaUr+aMgeS4jeWujOaVtO+8jOi/meS8muWvvOiHtOWcqOmrmERQSeWSjOmhtemdouiiq+e8qeaUvueahOaDheWGteS4i+KAnGNhbnZhc+KAneWSjOKAnHdlYmds4oCd5riy5p+T5qih5byP5by55bmV5pi+56S65LiN5q2j5bi455qE5oOF5Ya177yI5by55bmV5qih57OK77yJ77yM5q2k5pe25bu66K6u5L2/55So4oCcY3NzM+KAnea4suafk+aooeW8j+OAglxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMsIHJlbmRlck1vZGUgPSAnY2FudmFzJykge1xuICAgICAgICAvL+WPmOmHj+WIneWni+WMllxuICAgICAgICAvKipcbiAgICAgICAgICog5byA5aeL5pe26Ze0XG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgX3N0YXJ0VGltZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaaguWBnOaXtumXtFxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9wYXVzZVRpbWUgPSAwO1xuICAgICAgICAvKipcbiAgICAgICAgICog5by55bmV57yT5Yay5Yy6XG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtMaW5rZWRMaXN0fVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9idWxsZXRTY3JlZW5CdWZmZXIgPSBuZXcgTGlua2VkTGlzdCgpO1xuICAgICAgICAvKipcbiAgICAgICAgICog5a6e5pe25by55bmV5YiX6KGoXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtMaW5rZWRMaXN0fVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9yZWFsVGltZUJ1bGxldFNjcmVlbnMgPSBuZXcgTGlua2VkTGlzdCgpO1xuICAgICAgICAvKipcbiAgICAgICAgICog5bu26L+f5by55bmV5oC75pWwXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgX2RlbGF5QnVsbGV0U2NyZWVuQ291bnQgPSAwO1xuICAgICAgICAvKipcbiAgICAgICAgICog5bu26L+f77yI5Y2V5L2N77ya5q+r56eS77yJXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgX2RlbGF5ID0gMDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaSreaUvuagh+W/l1xuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgICAgICovXG4gICAgICAgIGxldCBfcGxheWluZztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWIt+aWsOmikeeOh1xuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9yZWZyZXNoUmF0ZSA9IDAuMDY7IC8v5Yid5aeL5Yi35paw6aKR546HXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDkuIrkuIDmrKHliLfmlrDml7bpl7RcbiAgICAgICAgICogQHByaXZhdGUgQHR5cGUge251bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIGxldCBfbGFzdFJlZnJlc2hUaW1lO1xuICAgICAgICAvKipcbiAgICAgICAgICog5YWo5bGA6YCJ6aG5XG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtvcGVuQlNFfmdlbmVyYWxPcHRpb25zfVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9vcHRpb25zO1xuICAgICAgICAvKipcbiAgICAgICAgICog6buY6K6k5YWo5bGA5Y+Y6YePXG4gICAgICAgICAqIEBwcml2YXRlIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX2RlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICAgICAgLyoqIOWeguebtOmXtOi3nSAqL1xuICAgICAgICAgICAgdmVydGljYWxJbnRlcnZhbDogOCxcbiAgICAgICAgICAgIC8qKiDmkq3mlL7pgJ/luqYo5YCN5pWwKSAqL1xuICAgICAgICAgICAgcGxheVNwZWVkOiAxLFxuICAgICAgICAgICAgLyoqIOaXtumXtOWfuuWHhiAqL1xuICAgICAgICAgICAgY2xvY2s6IHRpbWUgPT4gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBfc3RhcnRUaW1lLFxuICAgICAgICAgICAgLyoqIOe8qeaUvuavlOS+iyAqL1xuICAgICAgICAgICAgc2NhbGluZzogMSxcbiAgICAgICAgICAgIC8qKiDotoXml7bkuKLlvIMgKi9cbiAgICAgICAgICAgIHRpbWVPdXREaXNjYXJkOiB0cnVlLFxuICAgICAgICAgICAgLyoqIOimgemakOiXj+eahOW8ueW5leexu+WeiyAqL1xuICAgICAgICAgICAgaGlkZGVuVHlwZXM6IDAsXG4gICAgICAgICAgICAvKiog5by55bmV5LiN6YCP5piO5bqmICovXG4gICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgLyoqIOm8oOagh+e7j+i/h+agt+W8jyAqL1xuICAgICAgICAgICAgY3Vyc29yT25Nb3VzZU92ZXI6ICdwb2ludGVyJyxcbiAgICAgICAgICAgIC8qKiDpu5jorqTlvLnluZXmoLflvI8gKi9cbiAgICAgICAgICAgIGRlZmF1bHRTdHlsZToge1xuICAgICAgICAgICAgICAgIC8qKiDpmLTlvbHnmoTmqKHns4rnuqfliKvvvIww5Li65LiN5pi+56S66Zi05b2xICovXG4gICAgICAgICAgICAgICAgc2hhZG93Qmx1cjogMixcbiAgICAgICAgICAgICAgICAvKiog5a2X5L2T57KX57uGICovXG4gICAgICAgICAgICAgICAgZm9udFdlaWdodDogJzYwMCcsXG4gICAgICAgICAgICAgICAgLyoqIOWtl+S9k+ezu+WIlyAqL1xuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICdzYW5zLXNlcmlmJyxcbiAgICAgICAgICAgICAgICAvKiog5a2X5L2T5aSn5bCP77yI5Y2V5L2N77ya5YOP57Sg77yJICovXG4gICAgICAgICAgICAgICAgc2l6ZTogMjUsXG4gICAgICAgICAgICAgICAgLyoqIOWkluahhuminOiJsiAqL1xuICAgICAgICAgICAgICAgIGJveENvbG9yOiBudWxsLFxuICAgICAgICAgICAgICAgIC8qKiDlrZfkvZPpopzoibIgKi9cbiAgICAgICAgICAgICAgICBjb2xvcjogJ3doaXRlJyxcbiAgICAgICAgICAgICAgICAvKiog5o+P6L656aKc6ImyICovXG4gICAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6IG51bGwsXG4gICAgICAgICAgICAgICAgLyoqIOW8ueW5lemAn+W6pu+8iOWNleS9je+8muWDj+e0oC/mr6vnp5LvvIkg5LuF5rWB5by55bmV57G75Z6L5pyJ5pWIICovXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDAuMTUsXG4gICAgICAgICAgICAgICAgLyoqIOW8ueW5leWBnOeVmeaXtumXtCDku4Xlm7rlrprlvLnluZXnsbvlnovmnInmlYggKi9cbiAgICAgICAgICAgICAgICByZXNpZGVuY2VUaW1lOiA1MDAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5YWo5bGA6YCJ6aG557G75Z6LXG4gICAgICAgICAqIEBwcml2YXRlIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX29wdGlvbnNUeXBlID0ge1xuICAgICAgICAgICAgdmVydGljYWxJbnRlcnZhbDogJ251bWJlcicsXG4gICAgICAgICAgICBwbGF5U3BlZWQ6ICdudW1iZXInLFxuICAgICAgICAgICAgY2xvY2s6ICdmdW5jdGlvbicsXG4gICAgICAgICAgICBzY2FsaW5nOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIHRpbWVPdXREaXNjYXJkOiAnYm9vbGVhbicsXG4gICAgICAgICAgICBoaWRkZW5UeXBlczogJ251bWJlcicsXG4gICAgICAgICAgICBvcGFjaXR5OiAnbnVtYmVyJyxcbiAgICAgICAgICAgIGN1cnNvck9uTW91c2VPdmVyOiAnc3RyaW5nJyxcbiAgICAgICAgICAgIGRlZmF1bHRTdHlsZToge1xuICAgICAgICAgICAgICAgIHNoYWRvd0JsdXI6ICdudW1iZXInLFxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IFsnc3RyaW5nJywgJ251bWJlciddLFxuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgIHNpemU6ICdudW1iZXInLFxuICAgICAgICAgICAgICAgIGJveENvbG9yOiBbJ3N0cmluZycsICdudWxsJ10sXG4gICAgICAgICAgICAgICAgY29sb3I6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiBbJ3N0cmluZycsICdudWxsJ10sXG4gICAgICAgICAgICAgICAgc3BlZWQ6ICdudW1iZXInLFxuICAgICAgICAgICAgICAgIHJlc2lkZW5jZVRpbWU6ICdudW1iZXInXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog6buY6K6k5by55bmV5pWw5o2uXG4gICAgICAgICAqIEBwcml2YXRlIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX2RlZmF1bHRCdWxsZXRTY3JlZW4gPSB7XG4gICAgICAgICAgICAvKiog5by55bmV5paH5pysICovXG4gICAgICAgICAgICB0ZXh0OiBudWxsLFxuICAgICAgICAgICAgLyoqIOaYr+WQpuWFgeiuuOS4ouW8gyAqL1xuICAgICAgICAgICAgY2FuRGlzY2FyZDogdHJ1ZSxcbiAgICAgICAgICAgIC8qKiDlvLnluZXov5vlhaXml7bpl7QgKi9cbiAgICAgICAgICAgIHN0YXJ0VGltZTogbnVsbCxcbiAgICAgICAgICAgIC8qKiDlvLnluZXnsbvlnosgKi9cbiAgICAgICAgICAgIHR5cGU6IEdlbmVyYWxUeXBlLnJpZ2h0VG9MZWZ0LFxuICAgICAgICAgICAgLyoqIOW8ueW5leWxgue6p++8iOi2iuWkp+i2iuWJje+8iSAqL1xuICAgICAgICAgICAgbGF5ZXI6IDBcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlvLnluZXmlbDmja7nsbvlnotcbiAgICAgICAgICogQHByaXZhdGUgQHJlYWRvbmx5XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfYnVsbGV0U2NyZWVuVHlwZSA9IHtcbiAgICAgICAgICAgIHRleHQ6ICdzdHJpbmcnLFxuICAgICAgICAgICAgY2FuRGlzY2FyZDogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgc3RhcnRUaW1lOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgICAgbGF5ZXI6ICdudW1iZXInXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogcmVxdWVzdEFuaW1hdGlvbkZyYW1lIOWumuS5ie+8iOS4gOS6m+iAgeW8j+a1j+iniOWZqOS4jeaUr+aMgSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUg77yJXG4gICAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZ1biAtIOWbnuiwg+aWueazlSBcbiAgICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICBsZXQgcmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09ICdmdW5jdGlvbicpIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFJlc291cmNlcy5SRVFVRVNUQU5JTUFUSU9ORlJBTUVfTk9UX1NVUFBPUlRfV0FSTik7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSAoZnVuKSA9PiB3aW5kb3cuc2V0VGltZW91dChmdW4sIDE3KTsgLy82MGZwc1xuICAgICAgICB9XG5cbiAgICAgICAgX29wdGlvbnMgPSBIZWxwZXIuc2V0VmFsdWVzKG9wdGlvbnMsIF9kZWZhdWx0T3B0aW9ucywgX29wdGlvbnNUeXBlKTsgLy/orr7nva7pu5jorqTlgLxcblxuICAgICAgICAvL+S6i+S7tuWIneWni+WMllxuICAgICAgICBsZXQgX2V2ZW50ID0gbmV3IEV2ZW50KCk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlvLnluZXljZXlh7vkuovku7bjgILlvZPljZXlh7vlvLnluZXml7bop6blj5HjgIJcbiAgICAgICAgICogQGV2ZW50IG9wZW5CU0UuR2VuZXJhbEVuZ2luZSNjbGlja1xuICAgICAgICAgKiBAcHJvcGVydHkge29wZW5CU0V+R2VuZXJhbEV2ZW50fSBlIC0g5by55bmV5LqL5Lu257uT5p6EXG4gICAgICAgICAqL1xuICAgICAgICBfZXZlbnQuYWRkKCdjbGljaycpO1xuICAgICAgICAvKipcbiAgICAgICAgICog5by55bmV5LiK5LiL5paH6I+c5Y2V5LqL5Lu244CC5b2T6Kem5Y+R5by55bmV5LiK5LiL5paH6I+c5Y2V5pe26Kem5Y+R44CCXG4gICAgICAgICAqIEBldmVudCBvcGVuQlNFLkdlbmVyYWxFbmdpbmUjY29udGV4dG1lbnVcbiAgICAgICAgICogQHByb3BlcnR5IHtvcGVuQlNFfkdlbmVyYWxCdWxsZXRTY3JlZW5FdmVudH0gZSAtIOW8ueW5leS6i+S7tue7k+aehFxuICAgICAgICAgKi9cbiAgICAgICAgX2V2ZW50LmFkZCgnY29udGV4dG1lbnUnKTtcbiAgICAgICAgLyoqXG4gICAgICAgICog5by55bmV6byg5qCH56a75byA5LqL5Lu244CC5b2T6byg5qCH56a75byA5by55bmV5pe26Kem5Y+R44CCXG4gICAgICAgICogQGV2ZW50IG9wZW5CU0UuR2VuZXJhbEVuZ2luZSNtb3VzZWxlYXZlXG4gICAgICAgICogQHByb3BlcnR5IHtvcGVuQlNFfkdlbmVyYWxCdWxsZXRTY3JlZW5FdmVudH0gZSAtIOW8ueW5leS6i+S7tue7k+aehFxuICAgICAgICAqL1xuICAgICAgICBfZXZlbnQuYWRkKCdtb3VzZWxlYXZlJyk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlvLnluZXpvKDmoIfov5vlhaXkuovku7bjgILlvZPpvKDmoIfov5vlhaXlvLnluZXml7bop6blj5HjgIJcbiAgICAgICAgICogQGV2ZW50IG9wZW5CU0UuR2VuZXJhbEVuZ2luZSNtb3VzZWVudGVyXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7b3BlbkJTRX5HZW5lcmFsQnVsbGV0U2NyZWVuRXZlbnR9IGUgLSDlvLnluZXkuovku7bnu5PmnoRcbiAgICAgICAgICovXG4gICAgICAgIF9ldmVudC5hZGQoJ21vdXNlZW50ZXInKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOe7keWumuS6i+S7tuWkhOeQhueoi+W6j1xuICAgICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAgICogQGRlc2NyaXB0aW9uIOe7keWumuS6i+S7tuWkhOeQhueoi+W6j+OAguW9k+S6i+S7tuWkhOeQhueoi+W6j+i/lOWbnuWAvOS4uiBmYWxzZSDml7blgZzmraLlhpLms6HjgIJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSDkuovku7blkI3np7BcbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZnVuIC0g5LqL5Lu25aSE55CG56iL5bqPXG4gICAgICAgICAqIEBsaXN0ZW5zIG9wZW5CU0UuR2VuZXJhbEVuZ2luZSNjbGlja1xuICAgICAgICAgKiBAbGlzdGVucyBvcGVuQlNFLkdlbmVyYWxFbmdpbmUjY29udGV4dG1lbnVcbiAgICAgICAgICogQGxpc3RlbnMgb3BlbkJTRS5HZW5lcmFsRW5naW5lI21vdXNlbGVhdmVcbiAgICAgICAgICogQGxpc3RlbnMgb3BlbkJTRS5HZW5lcmFsRW5naW5lI21vdXNlZW50ZXJcbiAgICAgICAgICogQHRocm93cyB7VHlwZUVycm9yfSDkvKDlhaXnmoTlj4LmlbDplJnor6/miJbkuovku7bkuI3lrZjlnKjml7blvJXlj5HplJnor6/jgILor7flj4LpmIUgTUROIFtUeXBlRXJyb3Jde0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3poLUNOL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1R5cGVFcnJvcn0g44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmJpbmQgPSBfZXZlbnQuYmluZDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOino+e7keS6i+S7tuWkhOeQhueoi+W6j++8iGZ1buS4uuepuuino+e7keaJgOacieS6i+S7tuWkhOeQhueoi+W6j++8iVxuICAgICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSDkuovku7blkI3np7BcbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZnVuIC0g5LqL5Lu25aSE55CG56iL5bqPXG4gICAgICAgICAqIEB0aHJvd3Mge1R5cGVFcnJvcn0g5Lyg5YWl55qE5Y+C5pWw6ZSZ6K+v5oiW5LqL5Lu25LiN5a2Y5Zyo5pe25byV5Y+R6ZSZ6K+v44CC6K+35Y+C6ZiFIE1ETiBbVHlwZUVycm9yXXtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy96aC1DTi9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9UeXBlRXJyb3J9IOOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy51bmJpbmQgPSBfZXZlbnQudW5iaW5kO1xuICAgICAgICAvL+WIneWni+WMllxuICAgICAgICBsZXQgX2VsZW1lbnRTaXplID0ge1xuICAgICAgICAgICAgd2lkdGg6IGVsZW1lbnQuY2xpZW50V2lkdGggLyBfb3B0aW9ucy5zY2FsaW5nLFxuICAgICAgICAgICAgaGVpZ2h0OiBlbGVtZW50LmNsaWVudEhlaWdodCAvIF9vcHRpb25zLnNjYWxpbmdcbiAgICAgICAgfVxuICAgICAgICBsZXQgX29sZERldmljZVBpeGVsUmF0aW8gPSBIZWxwZXIuZ2V0RGV2aWNlUGl4ZWxSYXRpbygpO1xuICAgICAgICBsZXQgX29sZFNjYWxpbmcgPSBfb3B0aW9ucy5zY2FsaW5nO1xuICAgICAgICBsZXQgX29sZENsaWVudFdpZHRoID0gZWxlbWVudC5jbGllbnRXaWR0aDtcbiAgICAgICAgbGV0IF9vbGRDbGllbnRIZWlnaHQgPSBlbGVtZW50LmNsaWVudEhlaWdodDtcbiAgICAgICAgbGV0IF9vbGRIaWRkZW5UeXBlcyA9IF9vcHRpb25zLmhpZGRlblR5cGVzO1xuICAgICAgICBsZXQgX29sZE9wYWNpdHkgPSBfb3B0aW9ucy5vcGFjaXR5O1xuICAgICAgICAvL+a4suafk+WZqOW3peWOglxuICAgICAgICBsZXQgcmVuZGVyZXJzRmFjdG9yeSA9IG5ldyBSZW5kZXJlcnNGYWN0b3J5KGVsZW1lbnQsIF9vcHRpb25zLCBfZWxlbWVudFNpemUsIGJ1bGxldFNjcmVlbkV2ZW50VHJpZ2dlcik7XG4gICAgICAgIGxldCBfcmVuZGVyZXIgPSByZW5kZXJlcnNGYWN0b3J5LmdldEdlbmVyYWxSZW5kZXJlcihyZW5kZXJNb2RlKTsgLy/lrp7kvovljJbmuLLmn5PlmahcbiAgICAgICAgc2V0SW50ZXJ2YWwoc2V0U2l6ZSwgMTAwKTtcblxuICAgICAgICAvL+WFrOWFseWHveaVsFxuICAgICAgICAvKipcbiAgICAgICAgICog6K6+572u5oiW6I635Y+W5YWo5bGA6YCJ6aG5XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqKi9cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdvcHRpb25zJywge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEhlbHBlci5jbG9uZShfb3B0aW9ucyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgICAgIF9vcHRpb25zID0gSGVscGVyLnNldFZhbHVlcyhvcHRpb25zLCBfb3B0aW9ucywgX29wdGlvbnNUeXBlLCBmYWxzZSk7IC8v6K6+572u6buY6K6k5YC8XG4gICAgICAgICAgICAgICAgaWYgKF9vbGRIaWRkZW5UeXBlcyAhPSBfb3B0aW9ucy5oaWRkZW5UeXBlcykge1xuICAgICAgICAgICAgICAgICAgICBfb2xkSGlkZGVuVHlwZXMgPSBfb3B0aW9ucy5oaWRkZW5UeXBlcztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFfcGxheWluZykgX3JlbmRlcmVyLmRyYXcoKTsgLy/pnZ7mkq3mlL7nirbmgIHliJnph43nu5hcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKF9vbGRPcGFjaXR5ICE9IF9vcHRpb25zLm9wYWNpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgX29sZE9wYWNpdHkgPSBfb3B0aW9ucy5vcGFjaXR5O1xuICAgICAgICAgICAgICAgICAgICBfcmVuZGVyZXIuc2V0T3BhY2l0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa3u+WKoOW8ueW5leWIsOW8ueW5leWIl+ihqOOAglxuICAgICAgICAgKiBAZGVzY3JpcHRpb24g5re75Yqg5by55bmV5Yiw5by55bmV5YiX6KGo44CC55Sx5LqO5by55bmV5Zyo5bGP5bmV5LiK5Ye6546w6L+H5ZCO77yM5by55bmV5byV5pOO5bCG5LuO5YiX6KGo5Lit5b275bqV5Yig6Zmk5q2k5by55bmV44CC5omA5Lul77yM5Zyo5pS55Y+Y5pKt5pS+6L+b5bqm5pe277yM5Y+v6IO96ZyA6KaB5YWIW+a4heepuuW8ueW5leWIl+ihqF17QGxpbmsgb3BlbkJTRS5CdWxsZXRTY3JlZW5FbmdpbmUjY2xlYW5CdWxsZXRTY3JlZW5MaXN0fe+8jOeEtuWQjumHjeaWsOWKoOi9veatpOaSreaUvui/m+W6puS7peWQjueahOW8ueW5leOAglxuICAgICAgICAgKiBAcGFyYW0ge29wZW5CU0V+R2VuZXJhbEJ1bGxldFNjcmVlbn0gYnVsbGV0U2NyZWVuIC0g5Y2V5p2h5by55bmV5pWw5o2u77ya5LiA5LiqIHtAbGluayBvcGVuQlNFfkdlbmVyYWxCdWxsZXRTY3JlZW59IOe7k+aehOOAglxuICAgICAgICAgKiBAdGhyb3dzIHtUeXBlRXJyb3J9IOS8oOWFpeeahOWPguaVsOmUmeivr+aXtuW8leWPkemUmeivr+OAguivt+WPgumYhSBNRE4gW1R5cGVFcnJvcl17QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvemgtQ04vZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvVHlwZUVycm9yfSDjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuYWRkID0gZnVuY3Rpb24gKGJ1bGxldFNjcmVlbikge1xuICAgICAgICAgICAgX2RlZmF1bHRCdWxsZXRTY3JlZW4uc3RhcnRUaW1lID0gX29wdGlvbnMuY2xvY2soKTtcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbiA9IEhlbHBlci5zZXRWYWx1ZXMoYnVsbGV0U2NyZWVuLCBfZGVmYXVsdEJ1bGxldFNjcmVlbiwgX2J1bGxldFNjcmVlblR5cGUpOyAvL+iuvue9rum7mOiupOWAvFxuXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuLnR5cGUgIT0gR2VuZXJhbFR5cGUubGVmdFRvUmlnaHQgJiZcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW4udHlwZSAhPSBHZW5lcmFsVHlwZS5yaWdodFRvTGVmdCAmJlxuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbi50eXBlICE9IEdlbmVyYWxUeXBlLnRvcCAmJlxuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbi50eXBlICE9IEdlbmVyYWxUeXBlLmJvdHRvbVxuICAgICAgICAgICAgKSB0aHJvdyBuZXcgVHlwZUVycm9yKFJlc291cmNlcy5QQVJBTUVURVJTX1RZUEVfRVJST1IpO1xuXG4gICAgICAgICAgICBIZWxwZXIuY2hlY2tUeXBlcyhidWxsZXRTY3JlZW4uc3R5bGUsIF9vcHRpb25zVHlwZS5kZWZhdWx0U3R5bGUpOyAvL+ajgOafpeW8ueW5leagt+W8j+exu+Wei1xuXG4gICAgICAgICAgICBsZXQgbmV3Tm9kZSA9IG5ldyBMaW5rZWRMaXN0Lm5vZGUoYnVsbGV0U2NyZWVuKTtcbiAgICAgICAgICAgIF9idWxsZXRTY3JlZW5CdWZmZXIuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgIGxldCBsYXN0QnVsbGV0U2NyZWVuID0gbm9kZS5lbGVtZW50O1xuICAgICAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW4uc3RhcnRUaW1lID4gbGFzdEJ1bGxldFNjcmVlbi5zdGFydFRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmxhZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGQ6IHsgYWRkVG9VcDogdHJ1ZSwgbm9kZTogbmV3Tm9kZSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRydWUpO1xuICAgICAgICAgICAgaWYgKG5ld05vZGUubGlua2VkTGlzdCA9PT0gbnVsbCkgX2J1bGxldFNjcmVlbkJ1ZmZlci5wdXNoKG5ld05vZGUsIGZhbHNlKTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlvIDlp4vmkq3mlL7lvLnluZXjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucGxheSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghX3BsYXlpbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAoIV9zdGFydFRpbWUpXG4gICAgICAgICAgICAgICAgICAgIF9zdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICBpZiAoX3BhdXNlVGltZSlcbiAgICAgICAgICAgICAgICAgICAgX3N0YXJ0VGltZSArPSBfb3B0aW9ucy5jbG9jaygpIC0gX3BhdXNlVGltZTtcbiAgICAgICAgICAgICAgICBfbGFzdFJlZnJlc2hUaW1lID0gbnVsbDtcbiAgICAgICAgICAgICAgICBfcGxheWluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlZnJlc2gpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDnu6fnu63miYDmnInlnKjkuovku7blk43lupTkuK3orr7nva7kuoYgZS5wYXVzZSA9IHRydWU7IOW8ueW5leeahOaSreaUvuOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5wbGF5QWxsQnVsbGV0U2NyZWVucyA9ICgpID0+XG4gICAgICAgICAgICBfcmVhbFRpbWVCdWxsZXRTY3JlZW5zLmZvckVhY2goKG5vZGUpID0+IG5vZGUuZWxlbWVudC5wYXVzZSA9IGZhbHNlKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5pqC5YGc5pKt5pS+5by55bmV44CCXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiDmmoLlgZzmkq3mlL7lvLnluZXjgILmmoLlgZzmkq3mlL7lvLnluZXmmK/mjIflvLnluZXmkq3mlL7mmoLlgZzvvIzmiYDmnInmnKrlh7rnjrDnmoTlvLnluZXlsIblgZzmraLlh7rnjrDvvIzlt7Llh7rnjrDnmoTlvLnluZXlgZzmraLov5DliqjvvIzlgZzmraLmtojlpLHjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucGF1c2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoX3BsYXlpbmcpIHtcbiAgICAgICAgICAgICAgICBfcGF1c2VUaW1lID0gX29wdGlvbnMuY2xvY2soKTtcbiAgICAgICAgICAgICAgICBfcGxheWluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmuIXnqbrlvLnluZXnvJPlhrLljLrjgIJcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIOa4heepuuW8ueW5leWIl+ihqO+8jOS9huWxj+W5leS4iuW3sue7j+WHuueOsOeahOW8ueW5leS4jeS8muiiq+a4hemZpOOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jbGVhbkJ1ZmZlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF9idWxsZXRTY3JlZW5CdWZmZXIuY2xlYW4oKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5riF56m65bGP5bmV5YaF5a6544CCXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiDmuIXnqbrlsY/luZXlhoXlrrnjgILmuIXnqbrlsY/luZXkuIrlt7Lnu4/lh7rnjrDnmoTlvLnluZXvvIzkuI3ljIXmi6zlvLnluZXliJfooajkuK3nmoTlvLnluZXjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY2xlYW5TY3JlZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfcmVhbFRpbWVCdWxsZXRTY3JlZW5zLmNsZWFuKCk7XG4gICAgICAgICAgICBfcmVuZGVyZXIuY2xlYW5TY3JlZW4oKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5YGc5q2i5pKt5pS+5by55bmV44CCXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiDlgZzmraLmkq3mlL7lvLnluZXjgILlgZzmraLmkq3mlL7lvLnluZXmmK/mjIflgZzmraLmkq3mlL7lvLnluZXvvIzpu5jorqRb5pe26Ze05Z+65YeG77yIb3B0aW9ucy5jbG9ja++8iV17QGxpbmsgb3BlbkJTRX5CdWxsZXRTY3JlZW5TdHlsZX3lvZLpm7bvvIzlubZb5riF56m65by55bmV5YiX6KGoXXtAbGluayBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZSNjbGVhbkJ1bGxldFNjcmVlbkxpc3R944CBW+a4heepuuWxj+W5leWGheWuuV17QGxpbmsgb3BlbkJTRS5CdWxsZXRTY3JlZW5FbmdpbmUjY2xlYW5TY3JlZW5944CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoX3BsYXlpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhdXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNsZWFuQnVmZmVyKCk7XG4gICAgICAgICAgICB0aGlzLmNsZWFuU2NyZWVuKCk7XG4gICAgICAgICAgICBfcGF1c2VUaW1lID0gMDtcbiAgICAgICAgICAgIF9zdGFydFRpbWUgPSBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bmiJborr7nva7lvLnluZXlj6/op4HmgKfjgIJcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAndmlzaWJpbGl0eScsIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZW5kZXJlci5nZXRWaXNpYmlsaXR5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmlzaWJpbGl0eSkge1xuICAgICAgICAgICAgICAgIGlmICh2aXNpYmlsaXR5KSBfcmVuZGVyZXIuc2hvdygpO1xuICAgICAgICAgICAgICAgIGVsc2UgX3JlbmRlcmVyLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPlua4suafk+aooeW8j+OAglxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdyZW5kZXJNb2RlJywge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbmRlck1vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bmkq3mlL7nirbmgIHjgIJcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAncGxheVN0YXRlJywge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9wbGF5aW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgKiDojrflj5bosIPor5Xkv6Hmga/jgIJcbiAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAqL1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2RlYnVnSW5mbycsIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHRpbWU6IF9wbGF5aW5nID8gX29wdGlvbnMuY2xvY2soKSA6IF9wYXVzZVRpbWUsXG4gICAgICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuQ291bnQ6IF9yZWFsVGltZUJ1bGxldFNjcmVlbnMubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICBidWZmZXJCdWxsZXRTY3JlZW5Db3VudDogX2J1bGxldFNjcmVlbkJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgIGRlbGF5OiBfZGVsYXksXG4gICAgICAgICAgICAgICAgICAgIGRlbGF5QnVsbGV0U2NyZWVuQ291bnQ6IF9kZWxheUJ1bGxldFNjcmVlbkNvdW50LFxuICAgICAgICAgICAgICAgICAgICBmcHM6IF9wbGF5aW5nID8gTWF0aC5mbG9vcihfcmVmcmVzaFJhdGUgKiAxMDAwKSA6IDAgLy/luKfpopFcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvL+WGhemDqOWHveaVsFxuICAgICAgICAvKipcbiAgICAgICAgICog5by55bmV5LqL5Lu25ZON5bqUXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0g5LqL5Lu25ZCN56ewXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZWFsVGltZUJ1bGxldFNjcmVlbiAtIOWunuaXtuW8ueW5leWvueixoVxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZSAtIOS6i+S7tuS/oeaBr1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gYnVsbGV0U2NyZWVuRXZlbnRUcmlnZ2VyKG5hbWUsIHJlYWxUaW1lQnVsbGV0U2NyZWVuLCBlKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGUucGFnZVggPT09ICd1bmRlZmluZWQnIHx8IGUucGFnZVggPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsZXQgZG9jID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBib2R5ID0gZG9jdW1lbnQuYm9keTtcbiAgICAgICAgICAgICAgICBlLnBhZ2VYID0gZS5jbGllbnRYICsgKGRvYyAmJiBkb2Muc2Nyb2xsTGVmdCB8fCBib2R5ICYmIGJvZHkuc2Nyb2xsTGVmdCB8fCAwKSAtIChkb2MgJiYgZG9jLmNsaWVudExlZnQgfHwgYm9keSAmJiBib2R5LmNsaWVudExlZnQgfHwgMCk7XG4gICAgICAgICAgICAgICAgZS5wYWdlWSA9IGUuY2xpZW50WSArIChkb2MgJiYgZG9jLnNjcm9sbFRvcCB8fCBib2R5ICYmIGJvZHkuc2Nyb2xsVG9wIHx8IDApIC0gKGRvYyAmJiBkb2MuY2xpZW50VG9wIHx8IGJvZHkgJiYgYm9keS5jbGllbnRUb3AgfHwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfZXZlbnQudHJpZ2dlcihuYW1lLCB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICog6I635Y+W5byV5Y+R5LqL5Lu255qE5by55bmV5by55bmV55qE5pWw5o2uXG4gICAgICAgICAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7b3BlbkJTRX5CdWxsZXRTY3JlZW59IOW8leWPkeS6i+S7tueahOW8ueW5leeahOaVsOaNru+8muS4gOS4qiB7QGxpbmsgb3BlbkJTRX5CdWxsZXRTY3JlZW59IOe7k+aehOOAgu+8iOazqOaEj++8muS4jeimgeivleWbvuS4jlvmt7vliqDlvLnluZVde0BsaW5rIG9wZW5CU0UuQnVsbGV0U2NyZWVuRW5naW5lI2FkZEJ1bGxldFNjcmVlbn3ml7bliJvlu7rnmoTlr7nosaHov5vooYzmr5TovoPvvIzov5nkuKrlr7nosaHmmK/lhYvpmoblvpfliLDnmoTvvIzlubbkuI3nm7jnrYnjgILmraPnoa7nmoTmlrnms5XmmK/lnKjmt7vliqDlvLnluZXml7bkuIDlubbmj5LlhaUgaWQg562J6Ieq5a6a5LmJ5a2X5q615p2l5ZSv5LiA5qCH6K+G5LiA5p2h5by55bmV44CC77yJXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZ2V0QnVsbGV0U2NyZWVuOiAoKSA9PiBIZWxwZXIuY2xvbmUocmVhbFRpbWVCdWxsZXRTY3JlZW4uYnVsbGV0U2NyZWVuKSxcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiDorr7nva7lvJXlj5Hkuovku7bnmoTlvLnluZXlvLnluZXnmoTmlbDmja5cbiAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7b3BlbkJTRX5CdWxsZXRTY3JlZW59IGJ1bGxldFNjcmVlbiAtIOW8leWPkeS6i+S7tueahOW8ueW5leeahOaVsOaNru+8muS4gOS4qiB7QGxpbmsgb3BlbkJTRX5CdWxsZXRTY3JlZW59IOe7k+aehOOAguiuvue9ruatpOWPguaVsOS7peS+v+WKqOaAgeiwg+aVtOW8ueW5leagt+W8j++8jOS9huaYr+S4gOS6m+WPguaVsOWcqOS6i+S7tuS4reS/ruaUueaXoOaViO+8jOafpeeci+atpOe7k+aehOeahOivtOaYjuS7peS6huino+ivpuaDheOAglxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3JlZHJhdz1mYWxzZV0gLSDmmK/lkKbph43nu5jlvLnluZXvvJrmraTlj4LmlbDlnKjmr4/mrKHlvJXlj5Hkuovku7bml7bnmoTliJ3lp4vlgLzkuLogZmFsc2Ug77yM5aaC5p6c5L+u5pS55LqGIGJ1bGxldFNjcmVlbiDkuK3nmoTlgLzvvIzmraTlj4LmlbDlv4Xpobvorr7kuLogdHJ1ZSDjgIJcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBzZXRCdWxsZXRTY3JlZW46IChidWxsZXRTY3JlZW4sIHJlZHJhdyA9IGZhbHNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVkcmF3ICE9ICdib29sZWFuJykgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuUEFSQU1FVEVSU19UWVBFX0VSUk9SKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJ1bGxldFNjcmVlblR5cGUgPSBIZWxwZXIuY2xvbmUoX2J1bGxldFNjcmVlblR5cGUpO1xuICAgICAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5UeXBlLnN0eWxlID0gX29wdGlvbnNUeXBlLmRlZmF1bHRTdHlsZTtcbiAgICAgICAgICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4uYnVsbGV0U2NyZWVuID0gSGVscGVyLnNldFZhbHVlcyhidWxsZXRTY3JlZW4sIHJlYWxUaW1lQnVsbGV0U2NyZWVuLmJ1bGxldFNjcmVlbiwgYnVsbGV0U2NyZWVuVHlwZSk7IC8v6K6+572u5YC8XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWRyYXcgPT09IHRydWUpIF9yZW5kZXJlci5yZUNyZWF0QW5kZ2V0V2lkdGgocmVhbFRpbWVCdWxsZXRTY3JlZW4pOyAvL+mHjeaWsOWIm+W7uuW5tue7mOWItuW8ueW5lVxuICAgICAgICAgICAgICAgICAgICBpZiAoIV9wbGF5aW5nICYmIHJlZHJhdykgX3JlbmRlcmVyLmRyYXcoKTsgLy/pnZ7mkq3mlL7nirbmgIHliJnph43nu5hcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIOiOt+WPluW8leWPkeS6i+S7tueahOW8ueW5leeahOaSreaUvueKtuaAgVxuICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IOWPluW8leWPkeS6i+S7tueahOW8ueW5leaYr+WQpuWcqOaSreaUvi/np7vliqjvvJrlpoLmnpzorr7nva7kuLogdHJ1ZSDliJnor6XlvLnluZXmmoLlgZzvvIznm7TliLDlsIbmraTlj4LmlbDorr7kuLogZmFsc2Ug5oiW6LCD55SoIHtAbGluayBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZSNwbGF5QWxsQnVsbGV0U2NyZWVuc30g5pa55rOV44CCXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZ2V0UGxheVN0YXRlOiAoKSA9PiAhcmVhbFRpbWVCdWxsZXRTY3JlZW4ucGF1c2UsXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICog6K6+572u5byV5Y+R5LqL5Lu255qE5by55bmV55qE5pKt5pS+54q25oCBXG4gICAgICAgICAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHBhbHkgLSDmmK/lkKbnu6fnu63mkq3mlL4v56e75Yqo5byV5Y+R5LqL5Lu255qE5by55bmV77ya6K+75Y+W5q2k5Y+C5pWw5Y+v5Yik5pat6L+Z5p2h5by55bmV5piv5ZCm5aSE5LqO5pqC5YGc54q25oCB44CCXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgc2V0UGxheVN0YXRlOiAocGxheSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHBsYXkgIT0gJ2Jvb2xlYW4nKSB0aHJvdyBuZXcgVHlwZUVycm9yKFJlc291cmNlcy5QQVJBTUVURVJTX1RZUEVfRVJST1IpO1xuICAgICAgICAgICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi5wYXVzZSA9ICFwbGF5O1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2NyZWVuWDogZS5zY3JlZW5YLCBzY3JlZW5ZOiBlLnNjcmVlblksXG4gICAgICAgICAgICAgICAgcGFnZVg6IGUucGFnZVgsIHBhZ2VZOiBlLnBhZ2VZLFxuICAgICAgICAgICAgICAgIGNsaWVudFg6IGUuY2xpZW50WCwgY2xpZW50WTogZS5jbGllbnRZXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliLfmlrDlvLnluZXlh73mlbBcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG4gICAgICAgICAgICBsZXQgbm93VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgaWYgKF9sYXN0UmVmcmVzaFRpbWUgIT0gbnVsbClcbiAgICAgICAgICAgICAgICBfcmVmcmVzaFJhdGUgPSAxIC8gKG5vd1RpbWUgLSBfbGFzdFJlZnJlc2hUaW1lKTtcbiAgICAgICAgICAgIF9sYXN0UmVmcmVzaFRpbWUgPSBub3dUaW1lO1xuICAgICAgICAgICAgYWRkcmVhbFRpbWVCdWxsZXRTY3JlZW5zKCk7XG4gICAgICAgICAgICBtb3ZlcmVhbFRpbWVCdWxsZXRTY3JlZW4oKTtcbiAgICAgICAgICAgIF9yZW5kZXJlci5kcmF3KCk7IC8v57uY5Yi25by55bmVXG4gICAgICAgICAgICBpZiAoX3BsYXlpbmcpXG4gICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlZnJlc2gpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOenu+WKqOW8ueW5leWHveaVsFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gbW92ZXJlYWxUaW1lQnVsbGV0U2NyZWVuKCkge1xuICAgICAgICAgICAgX3JlYWxUaW1lQnVsbGV0U2NyZWVucy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHJlYWxUaW1lQnVsbGV0U2NyZWVuID0gbm9kZS5lbGVtZW50O1xuICAgICAgICAgICAgICAgIGlmIChyZWFsVGltZUJ1bGxldFNjcmVlbi5wYXVzZSkgcmV0dXJuOyAvL+aaguWBnOenu+WKqFxuICAgICAgICAgICAgICAgIGxldCBub3dUaW1lID0gX29wdGlvbnMuY2xvY2soKTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHJlYWxUaW1lQnVsbGV0U2NyZWVuLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBHZW5lcmFsVHlwZS5yaWdodFRvTGVmdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWFsVGltZUJ1bGxldFNjcmVlbi54ID4gLXJlYWxUaW1lQnVsbGV0U2NyZWVuLndpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4ueCAtPSByZWFsVGltZUJ1bGxldFNjcmVlbi5idWxsZXRTY3JlZW4uc3R5bGUuc3BlZWQgKiBfb3B0aW9ucy5wbGF5U3BlZWQgLyBfcmVmcmVzaFJhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVuZGVyZXIuZGVsZXRlKHJlYWxUaW1lQnVsbGV0U2NyZWVuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyByZW1vdmU6IHRydWUgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIEdlbmVyYWxUeXBlLmxlZnRUb1JpZ2h0OlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlYWxUaW1lQnVsbGV0U2NyZWVuLnggPCBfZWxlbWVudFNpemUud2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi54ICs9IHJlYWxUaW1lQnVsbGV0U2NyZWVuLmJ1bGxldFNjcmVlbi5zdHlsZS5zcGVlZCAqIF9vcHRpb25zLnBsYXlTcGVlZCAvIF9yZWZyZXNoUmF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZW5kZXJlci5kZWxldGUocmVhbFRpbWVCdWxsZXRTY3JlZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHJlbW92ZTogdHJ1ZSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgR2VuZXJhbFR5cGUudG9wOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIEdlbmVyYWxUeXBlLmJvdHRvbTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWFsVGltZUJ1bGxldFNjcmVlbi5lbmRUaW1lIDwgbm93VGltZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZW5kZXJlci5kZWxldGUocmVhbFRpbWVCdWxsZXRTY3JlZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHJlbW92ZTogdHJ1ZSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5re75Yqg5by55bmV5Yiw5a6e5pe25by55bmV5YiX6KGoXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhZGRyZWFsVGltZUJ1bGxldFNjcmVlbnMoKSB7XG4gICAgICAgICAgICBpZiAoX3JlYWxUaW1lQnVsbGV0U2NyZWVucy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAgICAgX2RlbGF5ID0gMDtcbiAgICAgICAgICAgIGxldCB0aW1lcyA9IE1hdGguZmxvb3IoX3JlZnJlc2hSYXRlICogMjAwMCk7XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgbGV0IG5vZGUgPSBfYnVsbGV0U2NyZWVuQnVmZmVyLnBvcChmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGlmIChub2RlID09PSBudWxsKSByZXR1cm47XG4gICAgICAgICAgICAgICAgbGV0IGJ1bGxldFNjcmVlbiA9IG5vZGUuZWxlbWVudDtcbiAgICAgICAgICAgICAgICBsZXQgbm93VGltZSA9IF9vcHRpb25zLmNsb2NrKCk7XG4gICAgICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbi5zdGFydFRpbWUgPiBub3dUaW1lKSByZXR1cm47XG4gICAgICAgICAgICAgICAgaWYgKCFfb3B0aW9ucy50aW1lT3V0RGlzY2FyZCB8fCAhYnVsbGV0U2NyZWVuLmNhbkRpc2NhcmQgfHwgYnVsbGV0U2NyZWVuLnN0YXJ0VGltZSA+IG5vd1RpbWUgLSBNYXRoLmZsb29yKDEgLyBfcmVmcmVzaFJhdGUpICogNjApIHtcbiAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuLnN0eWxlID0gSGVscGVyLnNldFZhbHVlcyhidWxsZXRTY3JlZW4uc3R5bGUsIF9vcHRpb25zLmRlZmF1bHRTdHlsZSwgX29wdGlvbnNUeXBlLmRlZmF1bHRTdHlsZSk7IC8v5aGr5YWF6buY6K6k5qC35byPXG4gICAgICAgICAgICAgICAgICAgIGdldFJlYWxUaW1lQnVsbGV0U2NyZWVuKG5vd1RpbWUsIGJ1bGxldFNjcmVlbik7IC8v55Sf5oiQ5a6e5pe25by55bmV5a+56LGh5bm25re75Yqg5Yiw5a6e5pe25by55bmV6ZuG5ZCIICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgX2RlbGF5QnVsbGV0U2NyZWVuQ291bnQrKztcbiAgICAgICAgICAgICAgICBub2RlLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIHRpbWVzLS07XG4gICAgICAgICAgICB9IHdoaWxlIChfcmVhbFRpbWVCdWxsZXRTY3JlZW5zLmxlbmd0aCA9PT0gMCB8fCB0aW1lcyA+IDApO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOeUn+aIkOWunuaXtuW8ueW5leWvueixoVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gbm93VGltZSAtIOW9k+WJjeaXtumXtFxuICAgICAgICAgKiBAcGFyYW0ge29wZW5CU0V+QnVsbGV0U2NyZWVufSBidWxsZXRTY3JlZW4gLSDlvLnluZXnmoTpk77ooajoioLngrlcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdldFJlYWxUaW1lQnVsbGV0U2NyZWVuKG5vd1RpbWUsIGJ1bGxldFNjcmVlbikge1xuICAgICAgICAgICAgX2RlbGF5ID0gbm93VGltZSAtIGJ1bGxldFNjcmVlbi5zdGFydFRpbWU7XG4gICAgICAgICAgICBsZXQgcmVhbFRpbWVCdWxsZXRTY3JlZW4gPSB7fTtcbiAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLnBhdXNlID0gZmFsc2U7IC8v5piv5ZCm5pqC5YGc56e75YqoXG4gICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi5idWxsZXRTY3JlZW4gPSBidWxsZXRTY3JlZW47XG4gICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi5zdGFydFRpbWUgPSBub3dUaW1lOyAvL+W8ueW5leWktOmDqOi/m+Wxj+W5leaXtumXtFxuICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4uc2l6ZSA9IGJ1bGxldFNjcmVlbi5zdHlsZS5zaXplOyAvL+Wtl+S9k+Wkp+Wwj++8muWDj+e0oFxuICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4udHlwZSA9IGJ1bGxldFNjcmVlbi50eXBlOyAvL+W8ueW5leexu+Wei1xuICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4uaGVpZ2h0ID0gcmVhbFRpbWVCdWxsZXRTY3JlZW4uc2l6ZTsgLy/lvLnluZXnmoTpq5jluqbvvJrlg4/ntKBcbiAgICAgICAgICAgIF9yZW5kZXJlci5jcmVhdEFuZGdldFdpZHRoKHJlYWxUaW1lQnVsbGV0U2NyZWVuKTsgLy/liJvlu7rlvLnluZXlhYPntKDlubborqHnrpflrr3luqZcbiAgICAgICAgICAgIHN3aXRjaCAoYnVsbGV0U2NyZWVuLnR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIEdlbmVyYWxUeXBlLnJpZ2h0VG9MZWZ0OlxuICAgICAgICAgICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi5lbmRUaW1lID0gTWF0aC5yb3VuZChub3dUaW1lICsgKF9lbGVtZW50U2l6ZS53aWR0aCArIHJlYWxUaW1lQnVsbGV0U2NyZWVuLndpZHRoKSAvIChidWxsZXRTY3JlZW4uc3R5bGUuc3BlZWQgKiBfb3B0aW9ucy5wbGF5U3BlZWQpKTsgLy/lvLnluZXlsL7pg6jlh7rlsY/luZXnmoTml7bpl7RcbiAgICAgICAgICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4ueCA9IF9lbGVtZW50U2l6ZS53aWR0aDsgLy/lvLnluZXliJ3lp4tY5Z2Q5qCHXG4gICAgICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLnkgPSBfb3B0aW9ucy52ZXJ0aWNhbEludGVydmFsOyAvL+W8ueW5leWIneWni1nlnZDmoIdcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBHZW5lcmFsVHlwZS5sZWZ0VG9SaWdodDpcbiAgICAgICAgICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4uZW5kVGltZSA9IE1hdGgucm91bmQobm93VGltZSArIChfZWxlbWVudFNpemUud2lkdGggKyByZWFsVGltZUJ1bGxldFNjcmVlbi53aWR0aCkgLyAoYnVsbGV0U2NyZWVuLnN0eWxlLnNwZWVkICogX29wdGlvbnMucGxheVNwZWVkKSk7IC8v5by55bmV5bC+6YOo5Ye65bGP5bmV55qE5pe26Ze0XG4gICAgICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLnggPSAtcmVhbFRpbWVCdWxsZXRTY3JlZW4ud2lkdGg7IC8v5by55bmV5Yid5aeLWOWdkOagh1xuICAgICAgICAgICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi55ID0gX29wdGlvbnMudmVydGljYWxJbnRlcnZhbDsgLy/lvLnluZXliJ3lp4tZ5Z2Q5qCHXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgR2VuZXJhbFR5cGUudG9wOlxuICAgICAgICAgICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi5lbmRUaW1lID0gcmVhbFRpbWVCdWxsZXRTY3JlZW4uc3RhcnRUaW1lICsgYnVsbGV0U2NyZWVuLnN0eWxlLnJlc2lkZW5jZVRpbWUgKiBfb3B0aW9ucy5wbGF5U3BlZWQ7XG4gICAgICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLnggPSBNYXRoLnJvdW5kKChfZWxlbWVudFNpemUud2lkdGggLSByZWFsVGltZUJ1bGxldFNjcmVlbi53aWR0aCkgLyAyKTsgLy/lvLnluZXliJ3lp4tY5Z2Q5qCHXG4gICAgICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLnkgPSBfb3B0aW9ucy52ZXJ0aWNhbEludGVydmFsOyAvL+W8ueW5leWIneWni1nlnZDmoIdcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBHZW5lcmFsVHlwZS5ib3R0b206XG4gICAgICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLmVuZFRpbWUgPSByZWFsVGltZUJ1bGxldFNjcmVlbi5zdGFydFRpbWUgKyBidWxsZXRTY3JlZW4uc3R5bGUucmVzaWRlbmNlVGltZSAqIF9vcHRpb25zLnBsYXlTcGVlZDtcbiAgICAgICAgICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4ueCA9IE1hdGgucm91bmQoKF9lbGVtZW50U2l6ZS53aWR0aCAtIHJlYWxUaW1lQnVsbGV0U2NyZWVuLndpZHRoKSAvIDIpOyAvL+W8ueW5leWIneWni1jlnZDmoIdcbiAgICAgICAgICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4ueSA9IC1fb3B0aW9ucy52ZXJ0aWNhbEludGVydmFsIC0gcmVhbFRpbWVCdWxsZXRTY3JlZW4uaGVpZ2h0OyAvL+W8ueW5leWIneWni1nlnZDmoIdcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBuZXdOb2RlID0gbmV3IExpbmtlZExpc3Qubm9kZShyZWFsVGltZUJ1bGxldFNjcmVlbik7XG4gICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuLnR5cGUgPT09IEdlbmVyYWxUeXBlLnRvcCB8fCBidWxsZXRTY3JlZW4udHlwZSA9PT0gR2VuZXJhbFR5cGUuYm90dG9tKSB7XG4gICAgICAgICAgICAgICAgX3JlYWxUaW1lQnVsbGV0U2NyZWVucy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4gPSBub2RlLmVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIC8v5by55bmV5LiN5Zyo5rWB5Lit77yM5piv5Zu65a6a5by55bmVXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4uYnVsbGV0U2NyZWVuLnR5cGUgIT0gYnVsbGV0U2NyZWVuLnR5cGUpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8v5LiN5piv5ZCM5LiA56eN57G75Z6L55qE5by55bmVXG4gICAgICAgICAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW4udHlwZSA9PT0gR2VuZXJhbFR5cGUudG9wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WmguaenOaWsOW8ueW5leWcqOW9k+WJjeW8ueW5leS4iuaWueS4lOacquS4juW9k+WJjeW8ueW5lemHjeWPoFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlYWxUaW1lQnVsbGV0U2NyZWVuLnkgKyByZWFsVGltZUJ1bGxldFNjcmVlbi5oZWlnaHQgPCBuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4ueSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEFjdHVhbFkocmVhbFRpbWVCdWxsZXRTY3JlZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGFkZDogeyBhZGRUb1VwOiB0cnVlLCBub2RlOiBuZXdOb2RlIH0sIHN0b3A6IHRydWUgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5aaC5p6c5LiK5LiA5p2h5by55bmV55qE5raI5aSx5pe26Ze05bCP5LqO5b2T5YmN5by55bmV55qE5Ye6546w5pe26Ze0XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dHJlYWxUaW1lQnVsbGV0U2NyZWVuLmVuZFRpbWUgPCBub3dUaW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLnkgPSBuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4ueTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi55ID0gbmV4dHJlYWxUaW1lQnVsbGV0U2NyZWVuLnkgKyBuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4uaGVpZ2h0ICsgX29wdGlvbnMudmVydGljYWxJbnRlcnZhbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5aaC5p6c5paw5by55bmV5Zyo5b2T5YmN5by55bmV5LiL5pa55LiU5pyq5LiO5b2T5YmN5by55bmV6YeN5Y+gXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVhbFRpbWVCdWxsZXRTY3JlZW4ueSA+IG5leHRyZWFsVGltZUJ1bGxldFNjcmVlbi55ICsgbmV4dHJlYWxUaW1lQnVsbGV0U2NyZWVuLmhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEFjdHVhbFkocmVhbFRpbWVCdWxsZXRTY3JlZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGFkZDogeyBhZGRUb1VwOiB0cnVlLCBub2RlOiBuZXdOb2RlIH0sIHN0b3A6IHRydWUgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5aaC5p6c5LiK5LiA5p2h5by55bmV55qE5raI5aSx5pe26Ze05bCP5LqO5b2T5YmN5by55bmV55qE5Ye6546w5pe26Ze0XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dHJlYWxUaW1lQnVsbGV0U2NyZWVuLmVuZFRpbWUgPCBub3dUaW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLnkgPSBuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4ueTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi55ID0gbmV4dHJlYWxUaW1lQnVsbGV0U2NyZWVuLnkgLSByZWFsVGltZUJ1bGxldFNjcmVlbi5oZWlnaHQgLSBfb3B0aW9ucy52ZXJ0aWNhbEludGVydmFsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL+W9k+WJjeW8ueW5lee7j+i/h+S4gOS4queCuemcgOimgeeahOaAu+aXtumVv1xuICAgICAgICAgICAgICAgIGxldCByZWFsVGltZUJ1bGxldFNjcmVlbldpZHRoVGltZSA9IHJlYWxUaW1lQnVsbGV0U2NyZWVuLndpZHRoIC8gKGJ1bGxldFNjcmVlbi5zdHlsZS5zcGVlZCAqIF9vcHRpb25zLnBsYXlTcGVlZCk7XG4gICAgICAgICAgICAgICAgX3JlYWxUaW1lQnVsbGV0U2NyZWVucy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4gPSBub2RlLmVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIC8v5by55bmV5Zyo5rWB5Lit77yM5piv56e75Yqo5by55bmVXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4uYnVsbGV0U2NyZWVuLnR5cGUgPT09IEdlbmVyYWxUeXBlLnRvcCB8fCBuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4uYnVsbGV0U2NyZWVuLnR5cGUgPT09IEdlbmVyYWxUeXBlLmJvdHRvbSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjsgLy/lvLnluZXkuI3lnKjmtYHkuK3vvIzkuLrlm7rlrprlvLnluZVcbiAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpzmlrDlvLnluZXlnKjlvZPliY3lvLnluZXkuIrmlrnkuJTmnKrkuI7lvZPliY3lvLnluZXph43lj6BcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlYWxUaW1lQnVsbGV0U2NyZWVuLnkgKyByZWFsVGltZUJ1bGxldFNjcmVlbi5oZWlnaHQgPCBuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4ueSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0QWN0dWFsWShyZWFsVGltZUJ1bGxldFNjcmVlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBhZGQ6IHsgYWRkVG9VcDogdHJ1ZSwgbm9kZTogbmV3Tm9kZSB9LCBzdG9wOiB0cnVlIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy/kuIrkuIDmnaHlvLnluZXnu4/ov4fkuIDkuKrngrnpnIDopoHnmoTmgLvml7bplb9cbiAgICAgICAgICAgICAgICAgICAgbGV0IG5leHRyZWFsVGltZUJ1bGxldFNjcmVlbldpZHRoVGltZSA9IG5leHRyZWFsVGltZUJ1bGxldFNjcmVlbi53aWR0aCAvIChuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4uYnVsbGV0U2NyZWVuLnN0eWxlLnNwZWVkICogX29wdGlvbnMucGxheVNwZWVkKTtcbiAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpzkuIrkuIDmnaHlvLnluZXnmoTmtojlpLHml7bpl7TlsI/kuo7lvZPliY3lvLnluZXnmoTlh7rnjrDml7bpl7RcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRyZWFsVGltZUJ1bGxldFNjcmVlbi5zdGFydFRpbWUgKyBuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW5XaWR0aFRpbWUgPj0gbm93VGltZSB8fCAvL+WmguaenOS4iuS4gOadoeW8ueW5leeahOWktOi/m+WFpeS6hu+8jOS9huaYr+Wwvui/mOayoei/m+WFpVxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dHJlYWxUaW1lQnVsbGV0U2NyZWVuLmVuZFRpbWUgPj0gcmVhbFRpbWVCdWxsZXRTY3JlZW4uZW5kVGltZSAtIHJlYWxUaW1lQnVsbGV0U2NyZWVuV2lkdGhUaW1lKSAvL+WmguaenOW9k+WJjeW8ueW5leWktOWHuuWOu+S6hu+8jOS4iuS4gOadoeW8ueW5leWwvui/mOayoeWHuuWOu1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVhbFRpbWVCdWxsZXRTY3JlZW4ueSA9IG5leHRyZWFsVGltZUJ1bGxldFNjcmVlbi55ICsgbmV4dHJlYWxUaW1lQnVsbGV0U2NyZWVuLmhlaWdodCArIF9vcHRpb25zLnZlcnRpY2FsSW50ZXJ2YWw7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLnkgPSBuZXh0cmVhbFRpbWVCdWxsZXRTY3JlZW4ueTtcbiAgICAgICAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChuZXdOb2RlLmxpbmtlZExpc3QgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBzZXRBY3R1YWxZKHJlYWxUaW1lQnVsbGV0U2NyZWVuKTtcbiAgICAgICAgICAgICAgICBfcmVhbFRpbWVCdWxsZXRTY3JlZW5zLnB1c2gobmV3Tm9kZSwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiuvue9ruecn+WunueahFnlnZDmoIdcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IHJlYWxUaW1lQnVsbGV0U2NyZWVuIC0g5a6e5pe25by55bmV5LqL5Lu2XG4gICAgICAgICAqIEByZXR1cm5zIHtvYmplY3R9IOWunuaXtuW8ueW5leS6i+S7tlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc2V0QWN0dWFsWShyZWFsVGltZUJ1bGxldFNjcmVlbikge1xuICAgICAgICAgICAgbGV0IGJ1bGxldFNjcmVlbiA9IHJlYWxUaW1lQnVsbGV0U2NyZWVuLmJ1bGxldFNjcmVlbjtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW4udHlwZSA9PT0gR2VuZXJhbFR5cGUubGVmdFRvUmlnaHQgfHxcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW4udHlwZSA9PT0gR2VuZXJhbFR5cGUucmlnaHRUb0xlZnQgfHxcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW4udHlwZSA9PT0gR2VuZXJhbFR5cGUudG9wXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi5hY3R1YWxZID0gcmVhbFRpbWVCdWxsZXRTY3JlZW4ueSAlIChfZWxlbWVudFNpemUuaGVpZ2h0IC0gcmVhbFRpbWVCdWxsZXRTY3JlZW4uaGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGJ1bGxldFNjcmVlbi50eXBlID09PSBHZW5lcmFsVHlwZS5ib3R0b20pIHtcbiAgICAgICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi5hY3R1YWxZID0gX2VsZW1lbnRTaXplLmhlaWdodCArIHJlYWxUaW1lQnVsbGV0U2NyZWVuLnkgJSBfZWxlbWVudFNpemUuaGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiuvue9ruWwuuWvuFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc2V0U2l6ZSgpIHtcbiAgICAgICAgICAgIGxldCBkZXZpY2VQaXhlbFJhdGlvID0gSGVscGVyLmdldERldmljZVBpeGVsUmF0aW8oKTtcbiAgICAgICAgICAgIGlmIChfb2xkRGV2aWNlUGl4ZWxSYXRpbyAhPSBkZXZpY2VQaXhlbFJhdGlvIHx8XG4gICAgICAgICAgICAgICAgX29sZENsaWVudFdpZHRoICE9IGVsZW1lbnQuY2xpZW50V2lkdGggfHxcbiAgICAgICAgICAgICAgICBfb2xkQ2xpZW50SGVpZ2h0ICE9IGVsZW1lbnQuY2xpZW50SGVpZ2h0IHx8XG4gICAgICAgICAgICAgICAgX29sZFNjYWxpbmcgIT0gX29wdGlvbnMuc2NhbGluZykge1xuICAgICAgICAgICAgICAgIF9vbGRTY2FsaW5nID0gX29wdGlvbnMuc2NhbGluZztcbiAgICAgICAgICAgICAgICBfZWxlbWVudFNpemUud2lkdGggPSBlbGVtZW50LmNsaWVudFdpZHRoIC8gX29wdGlvbnMuc2NhbGluZztcbiAgICAgICAgICAgICAgICBfZWxlbWVudFNpemUuaGVpZ2h0ID0gZWxlbWVudC5jbGllbnRIZWlnaHQgLyBfb3B0aW9ucy5zY2FsaW5nO1xuICAgICAgICAgICAgICAgIF9vbGRDbGllbnRXaWR0aCA9IGVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgICAgICAgICAgX29sZENsaWVudEhlaWdodCA9IGVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgICAgIF9vbGREZXZpY2VQaXhlbFJhdGlvID0gZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICAgICAgICBfcmVuZGVyZXIuc2V0U2l6ZSgpO1xuICAgICAgICAgICAgICAgIGlmICghX3BsYXlpbmcpIF9yZW5kZXJlci5kcmF3KCk7IC8v6Z2e5pKt5pS+54q25oCB5YiZ6YeN57uYXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL0lFIEVkZ2Ug5rWP6KeI5Zmo5LiN5pSv5oyBICVjXG4gICAgICAgIGlmICghIXdpbmRvdy5BY3RpdmVYT2JqZWN0IHx8IFwiQWN0aXZlWE9iamVjdFwiIGluIHdpbmRvdyB8fCBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJUcmlkZW50XCIpID4gLTEgfHxcbiAgICAgICAgICAgIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUVcIikgPiAtMSB8fCBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJFZGdlXCIpID4gLTEpIGNvbnNvbGUuaW5mbyhcbiAgICAgICAgICAgICAgICBSZXNvdXJjZXMuTE9BREVEX0lORk9fSUUuZmlsbERhdGEoYnVpbGQpXG4gICAgICAgICAgICApO1xuICAgICAgICAvL090aGVyXG4gICAgICAgIGVsc2UgY29uc29sZS5pbmZvKFxuICAgICAgICAgICAgUmVzb3VyY2VzLkxPQURFRF9JTkZPLmZpbGxEYXRhKGJ1aWxkKSxcbiAgICAgICAgICAgICdmb250LXdlaWdodDpib2xkOyBjb2xvcjojMDA5OUZGOycsICcnLCAnZm9udC1zdHlsZTppdGFsaWM7JywgJydcbiAgICAgICAgKTtcbiAgICB9XG59XG4iXSwiZmlsZSI6ImVuZ2luZXMvZ2VuZXJhbEVuZ2luZS5qcyJ9
