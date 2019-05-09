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
   * 剩余弹幕
   * @private @type {LinkedList}
   */

  var _bulletScreens = new _linkedList["default"]();
  /**
   * 屏幕上的弹幕
   * @private @type {LinkedList}
   */


  var _bulletScreensOnScreen = new _linkedList["default"]();
  /**
   * 延迟弹幕总数
   * @private @type {number}
   */


  var _delayBulletScreensCount = 0;
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
   * @private @type {openBSE~Options}
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
   * @event openBSE.BulletScreenEngine#click
   * @property {openBSE~BulletScreenEvent} e - 弹幕事件结构
   */


  _event.add('click');
  /**
   * 弹幕上下文菜单事件。当触发弹幕上下文菜单时触发。
   * @event openBSE.BulletScreenEngine#contextmenu
   * @property {openBSE~BulletScreenEvent} e - 弹幕事件结构
   */


  _event.add('contextmenu');
  /**
  * 弹幕鼠标离开事件。当鼠标离开弹幕时触发。
  * @event openBSE.BulletScreenEngine#mouseleave
  * @property {openBSE~BulletScreenEvent} e - 弹幕事件结构
  */


  _event.add('mouseleave');
  /**
   * 弹幕鼠标进入事件。当鼠标进入弹幕时触发。
   * @event openBSE.BulletScreenEngine#mouseenter
   * @property {openBSE~BulletScreenEvent} e - 弹幕事件结构
   */


  _event.add('mouseenter');
  /**
   * 绑定事件处理程序
   * @function
   * @description 绑定事件处理程序。当事件处理程序返回值为 false 时停止冒泡。
   * @param {string} name - 事件名称
   * @param {function} fun - 事件处理程序
   * @listens openBSE.BulletScreenEngine#click
   * @listens openBSE.BulletScreenEngine#contextmenu
   * @listens openBSE.BulletScreenEngine#mouseleave
   * @listens openBSE.BulletScreenEngine#mouseenter
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
   * 设置全局选项
   * @param {openBSE~Options} options - 全局选项：一个 {@link openBSE~Options} 结构。
   * @throws {TypeError} 传入的参数错误时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
   */

  this.setOptions = function (options) {
    _options = _helper["default"].setValues(options, _options, _optionsType, false);

    if (_oldHiddenTypes != _options.hiddenTypes) {
      _oldHiddenTypes = _options.hiddenTypes;
      if (!_playing) _renderer.draw();
    }

    if (_oldOpacity != _options.opacity) {
      _oldOpacity = _options.opacity;

      _renderer.setOpacity();
    }
  };
  /**
   * 获取全局选项
   * @returns {openBSE~Options} 全局选项：一个 {@link openBSE~Options} 结构。
   */


  this.getOptions = function () {
    return _options;
  };
  /**
   * 添加弹幕到弹幕列表。
   * @description 添加弹幕到弹幕列表。由于弹幕在屏幕上出现过后，弹幕引擎将从列表中彻底删除此弹幕。所以，在改变播放进度时，可能需要先[清空弹幕列表]{@link openBSE.BulletScreenEngine#cleanBulletScreenList}，然后重新加载此播放进度以后的弹幕。
   * @param {openBSE~BulletScreen} bulletScreen - 单条弹幕数据：一个 {@link openBSE~BulletScreen} 结构。
   * @throws {TypeError} 传入的参数错误时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
   */


  this.addBulletScreen = function (bulletScreen) {
    _defaultBulletScreen.startTime = _options.clock();
    bulletScreen = _helper["default"].setValues(bulletScreen, _defaultBulletScreen, _bulletScreenType);
    if (bulletScreen.type != _generalType["default"].leftToRight && bulletScreen.type != _generalType["default"].rightToLeft && bulletScreen.type != _generalType["default"].top && bulletScreen.type != _generalType["default"].bottom) throw new TypeError(_resources["default"].PARAMETERS_TYPE_ERROR);

    _helper["default"].checkTypes(bulletScreen.style, _optionsType.defaultStyle);

    var oldLength = _bulletScreens.getLength();

    _bulletScreens.forEach(function (lastBulletScreen) {
      if (bulletScreen.startTime > lastBulletScreen.startTime) return {
        add: {
          addToUp: true,
          element: bulletScreen
        },
        stop: true
      };
    }, true);

    if (oldLength === _bulletScreens.getLength()) _bulletScreens.push(bulletScreen, false);
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
    return _bulletScreensOnScreen.forEach(function (bulletScreenOnScreen) {
      return bulletScreenOnScreen.pause = false;
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
   * 清空弹幕列表。
   * @description 清空弹幕列表，但屏幕上已经出现的弹幕不会被清除。
   */


  this.cleanBulletScreenList = function () {
    _bulletScreens.clean();
  };
  /**
   * 清空屏幕内容。
   * @description 清空屏幕内容。清空屏幕上已经出现的弹幕，不包括弹幕列表中的弹幕。
   */


  this.cleanScreen = function () {
    _bulletScreensOnScreen.clean();

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

    this.cleanBulletScreenList();
    this.cleanScreen();
    _pauseTime = 0;
    _startTime = null;
  };
  /**
   * 隐藏弹幕。
   * @function
   */


  this.hide = _renderer.hide;
  /**
   * 显示弹幕。
   * @function
   */

  this.show = _renderer.show;
  /**
   * 获取弹幕可见性。
   * @function
   * @returns {boolean} - 指示弹幕是否可见。
   * @description 获取弹幕可见性。如要显示弹幕请调用 [bulletScreenEngine.show();]{@link openBSE.BulletScreenEngine#show} ，要隐藏弹幕请调用 [bulletScreenEngine.hide();]{@link openBSE.BulletScreenEngine#hide} 。
   */

  this.getVisibility = _renderer.getVisibility;
  /**
   * 获取渲染模式。
   * @returns {string} - 弹幕渲染模式： 取值为“canvas”、“css3”、“webgl”或“svg”。
   */

  this.getRenderMode = function () {
    return renderMode;
  };
  /**
   * 获取播放状态。
   * @returns {boolean} - 正在播放标志：true：正在播放；false：已暂停/停止播放。
   */


  this.getPlayState = function () {
    return _playing;
  };
  /**
  * 获取调试信息。
  * @returns {openBSE~DebugInfo} - 调试信息：一个 {@link openBSE~DebugInfo} 结构。
  */


  this.getDebugInfo = function () {
    return {
      time: _playing ? _options.clock() : _pauseTime,
      bulletScreensOnScreenCount: _bulletScreensOnScreen.getLength(),
      bulletScreensCount: _bulletScreens.getLength(),
      delay: _delay,
      delayBulletScreensCount: _delayBulletScreensCount,
      fps: _playing ? Math.floor(_refreshRate * 1000) : 0
    };
  };
  /**
   * 弹幕事件响应
   * @param {string} name - 事件名称
   * @param {object} bulletScreenOnScreen - 屏幕弹幕对象
   * @param {object} e - 事件信息
   */


  function bulletScreenEventTrigger(name, bulletScreenOnScreen, e) {
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
        return _helper["default"].clone(bulletScreenOnScreen.bulletScreen);
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
        bulletScreenOnScreen.bulletScreen = _helper["default"].setValues(bulletScreen, bulletScreenOnScreen.bulletScreen, bulletScreenType);
        if (redraw === true) _renderer.reCreatAndgetWidth(bulletScreenOnScreen);
        if (!_playing && redraw) _renderer.draw();
      },

      /**
       * 获取引发事件的弹幕的播放状态
       * @private
       * @returns {boolean} 取引发事件的弹幕是否在播放/移动：如果设置为 true 则该弹幕暂停，直到将此参数设为 false 或调用 {@link openBSE.BulletScreenEngine#playAllBulletScreens} 方法。
       */
      getPlayState: function getPlayState() {
        return !bulletScreenOnScreen.pause;
      },

      /**
       * 设置引发事件的弹幕的播放状态
       * @private
       * @param {boolean} paly - 是否继续播放/移动引发事件的弹幕：读取此参数可判断这条弹幕是否处于暂停状态。
       */
      setPlayState: function setPlayState(play) {
        if (typeof play != 'boolean') throw new TypeError(_resources["default"].PARAMETERS_TYPE_ERROR);
        bulletScreenOnScreen.pause = !play;
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
    addBulletScreensToScreen();
    moveBulletScreenOnScreen();

    _renderer.draw();

    if (_playing) requestAnimationFrame(refresh);
  }
  /**
   * 移动弹幕函数
   * @private
   */


  function moveBulletScreenOnScreen() {
    _bulletScreensOnScreen.forEach(function (bulletScreenOnScreen) {
      if (bulletScreenOnScreen.pause) return;

      var nowTime = _options.clock();

      switch (bulletScreenOnScreen.type) {
        case _generalType["default"].rightToLeft:
          if (bulletScreenOnScreen.x > -bulletScreenOnScreen.width) {
            bulletScreenOnScreen.x -= bulletScreenOnScreen.bulletScreen.style.speed * _options.playSpeed / _refreshRate;
          } else {
            _renderer["delete"](bulletScreenOnScreen);

            return {
              remove: true
            };
          }

          break;

        case _generalType["default"].leftToRight:
          if (bulletScreenOnScreen.x < _elementSize.width) {
            bulletScreenOnScreen.x += bulletScreenOnScreen.bulletScreen.style.speed * _options.playSpeed / _refreshRate;
          } else {
            _renderer["delete"](bulletScreenOnScreen);

            return {
              remove: true
            };
          }

          break;

        case _generalType["default"].top:
        case _generalType["default"].bottom:
          if (bulletScreenOnScreen.endTime < nowTime) {
            _renderer["delete"](bulletScreenOnScreen);

            return {
              remove: true
            };
          }

          break;
      }
    }, true);
  }
  /**
   * 添加弹幕到屏幕函数
   * @private
   */


  function addBulletScreensToScreen() {
    if (_bulletScreensOnScreen.getLength() === 0) _delay = 0;
    var times = Math.floor(_refreshRate * 2000);

    do {
      var bulletScreen = _bulletScreens.pop(false, false);

      if (bulletScreen === null) return;

      var nowTime = _options.clock();

      if (bulletScreen.startTime > nowTime) return;

      if (!_options.timeOutDiscard || !bulletScreen.canDiscard || bulletScreen.startTime > nowTime - Math.floor(1 / _refreshRate) * 60) {
        bulletScreen.style = _helper["default"].setValues(bulletScreen.style, _options.defaultStyle, _optionsType.defaultStyle);
        getBulletScreenOnScreen(nowTime, bulletScreen);
      } else _delayBulletScreensCount++;

      _bulletScreens.pop(true, false);

      times--;
    } while (_bulletScreensOnScreen.getLength() === 0 || times > 0);
  }
  /**
   * 生成屏幕弹幕对象函数
   * @private
   * @param {number} nowTime - 当前时间
   * @param {openBSE~BulletScreen} bulletScreen - 弹幕
   */


  function getBulletScreenOnScreen(nowTime, bulletScreen) {
    _delay = nowTime - bulletScreen.startTime;
    var bulletScreenOnScreen = {};
    bulletScreenOnScreen.pause = false;
    bulletScreenOnScreen.bulletScreen = bulletScreen;
    bulletScreenOnScreen.startTime = nowTime;
    bulletScreenOnScreen.size = bulletScreen.style.size;
    bulletScreenOnScreen.type = bulletScreen.type;
    bulletScreenOnScreen.height = bulletScreenOnScreen.size;

    _renderer.creatAndgetWidth(bulletScreenOnScreen);

    switch (bulletScreen.type) {
      case _generalType["default"].rightToLeft:
        bulletScreenOnScreen.endTime = Math.round(nowTime + (_elementSize.width + bulletScreenOnScreen.width) / (bulletScreen.style.speed * _options.playSpeed));
        bulletScreenOnScreen.x = _elementSize.width;
        bulletScreenOnScreen.y = _options.verticalInterval;
        break;

      case _generalType["default"].leftToRight:
        bulletScreenOnScreen.endTime = Math.round(nowTime + (_elementSize.width + bulletScreenOnScreen.width) / (bulletScreen.style.speed * _options.playSpeed));
        bulletScreenOnScreen.x = -bulletScreenOnScreen.width;
        bulletScreenOnScreen.y = _options.verticalInterval;
        break;

      case _generalType["default"].top:
        bulletScreenOnScreen.endTime = bulletScreenOnScreen.startTime + bulletScreen.style.residenceTime * _options.playSpeed;
        bulletScreenOnScreen.x = Math.round((_elementSize.width - bulletScreenOnScreen.width) / 2);
        bulletScreenOnScreen.y = _options.verticalInterval;
        break;

      case _generalType["default"].bottom:
        bulletScreenOnScreen.endTime = bulletScreenOnScreen.startTime + bulletScreen.style.residenceTime * _options.playSpeed;
        bulletScreenOnScreen.x = Math.round((_elementSize.width - bulletScreenOnScreen.width) / 2);
        bulletScreenOnScreen.y = -_options.verticalInterval - bulletScreenOnScreen.height;
        break;
    }

    var oldLength = _bulletScreensOnScreen.getLength();

    if (bulletScreen.type === _generalType["default"].top || bulletScreen.type === _generalType["default"].bottom) {
      _bulletScreensOnScreen.forEach(function (nextBulletScreenOnScreen) {
        if (nextBulletScreenOnScreen.bulletScreen.type != bulletScreen.type) return;

        if (bulletScreen.type === _generalType["default"].top) {
          if (bulletScreenOnScreen.y + bulletScreenOnScreen.height < nextBulletScreenOnScreen.y) return {
            add: {
              addToUp: true,
              element: setActualY(bulletScreenOnScreen)
            },
            stop: true
          };
          if (nextBulletScreenOnScreen.endTime < nowTime) bulletScreenOnScreen.y = nextBulletScreenOnScreen.y;else bulletScreenOnScreen.y = nextBulletScreenOnScreen.y + nextBulletScreenOnScreen.height + _options.verticalInterval;
        } else {
          if (bulletScreenOnScreen.y > nextBulletScreenOnScreen.y + nextBulletScreenOnScreen.height) {
            return {
              add: {
                addToUp: true,
                element: setActualY(bulletScreenOnScreen)
              },
              stop: true
            };
          }

          if (nextBulletScreenOnScreen.endTime < nowTime) bulletScreenOnScreen.y = nextBulletScreenOnScreen.y;else bulletScreenOnScreen.y = nextBulletScreenOnScreen.y - bulletScreenOnScreen.height - _options.verticalInterval;
        }
      }, true);
    } else {
      var bulletScreenOnScreenWidthTime = bulletScreenOnScreen.width / (bulletScreen.style.speed * _options.playSpeed);

      _bulletScreensOnScreen.forEach(function (nextBulletScreenOnScreen) {
        if (nextBulletScreenOnScreen.bulletScreen.type === _generalType["default"].top || nextBulletScreenOnScreen.bulletScreen.type === _generalType["default"].bottom) return;
        if (bulletScreenOnScreen.y + bulletScreenOnScreen.height < nextBulletScreenOnScreen.y) return {
          add: {
            addToUp: true,
            element: setActualY(bulletScreenOnScreen)
          },
          stop: true
        };
        var nextBulletScreenOnScreenWidthTime = nextBulletScreenOnScreen.width / (nextBulletScreenOnScreen.bulletScreen.style.speed * _options.playSpeed);
        if (nextBulletScreenOnScreen.startTime + nextBulletScreenOnScreenWidthTime >= nowTime || nextBulletScreenOnScreen.endTime >= bulletScreenOnScreen.endTime - bulletScreenOnScreenWidthTime) bulletScreenOnScreen.y = nextBulletScreenOnScreen.y + nextBulletScreenOnScreen.height + _options.verticalInterval;else bulletScreenOnScreen.y = nextBulletScreenOnScreen.y;
      }, true);
    }

    if (_bulletScreensOnScreen.getLength() === oldLength) _bulletScreensOnScreen.push(setActualY(bulletScreenOnScreen), false);
  }
  /**
   * 设置真实的Y坐标
   * @private
   * @param {object} bulletScreenOnScreen - 屏幕弹幕事件
   * @returns {object} 屏幕弹幕事件
   */


  function setActualY(bulletScreenOnScreen) {
    var bulletScreen = bulletScreenOnScreen.bulletScreen;

    if (bulletScreen.type === _generalType["default"].leftToRight || bulletScreen.type === _generalType["default"].rightToLeft || bulletScreen.type === _generalType["default"].top) {
      bulletScreenOnScreen.actualY = bulletScreenOnScreen.y % (_elementSize.height - bulletScreenOnScreen.height);
    } else if (bulletScreen.type === _generalType["default"].bottom) {
      bulletScreenOnScreen.actualY = _elementSize.height + bulletScreenOnScreen.y % _elementSize.height;
    }

    return bulletScreenOnScreen;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZXMvZ2VuZXJhbEVuZ2luZS5qcyJdLCJuYW1lcyI6WyJHZW5lcmFsRW5naW5lIiwiZWxlbWVudCIsIm9wdGlvbnMiLCJyZW5kZXJNb2RlIiwiX3N0YXJ0VGltZSIsIl9wYXVzZVRpbWUiLCJfYnVsbGV0U2NyZWVucyIsIkxpbmtlZExpc3QiLCJfYnVsbGV0U2NyZWVuc09uU2NyZWVuIiwiX2RlbGF5QnVsbGV0U2NyZWVuc0NvdW50IiwiX2RlbGF5IiwiX3BsYXlpbmciLCJfcmVmcmVzaFJhdGUiLCJfbGFzdFJlZnJlc2hUaW1lIiwiX29wdGlvbnMiLCJfZGVmYXVsdE9wdGlvbnMiLCJ2ZXJ0aWNhbEludGVydmFsIiwicGxheVNwZWVkIiwiY2xvY2siLCJ0aW1lIiwiRGF0ZSIsImdldFRpbWUiLCJzY2FsaW5nIiwidGltZU91dERpc2NhcmQiLCJoaWRkZW5UeXBlcyIsIm9wYWNpdHkiLCJjdXJzb3JPbk1vdXNlT3ZlciIsImRlZmF1bHRTdHlsZSIsInNoYWRvd0JsdXIiLCJmb250V2VpZ2h0IiwiZm9udEZhbWlseSIsInNpemUiLCJib3hDb2xvciIsImNvbG9yIiwiYm9yZGVyQ29sb3IiLCJzcGVlZCIsInJlc2lkZW5jZVRpbWUiLCJfb3B0aW9uc1R5cGUiLCJfZGVmYXVsdEJ1bGxldFNjcmVlbiIsInRleHQiLCJjYW5EaXNjYXJkIiwic3RhcnRUaW1lIiwidHlwZSIsIkdlbmVyYWxUeXBlIiwicmlnaHRUb0xlZnQiLCJsYXllciIsIl9idWxsZXRTY3JlZW5UeXBlIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwid2luZG93IiwiY29uc29sZSIsIndhcm4iLCJSZXNvdXJjZXMiLCJSRVFVRVNUQU5JTUFUSU9ORlJBTUVfTk9UX1NVUFBPUlRfV0FSTiIsImZ1biIsInNldFRpbWVvdXQiLCJIZWxwZXIiLCJzZXRWYWx1ZXMiLCJfZXZlbnQiLCJFdmVudCIsImFkZCIsImJpbmQiLCJ1bmJpbmQiLCJfZWxlbWVudFNpemUiLCJ3aWR0aCIsImNsaWVudFdpZHRoIiwiaGVpZ2h0IiwiY2xpZW50SGVpZ2h0IiwiX29sZERldmljZVBpeGVsUmF0aW8iLCJnZXREZXZpY2VQaXhlbFJhdGlvIiwiX29sZFNjYWxpbmciLCJfb2xkQ2xpZW50V2lkdGgiLCJfb2xkQ2xpZW50SGVpZ2h0IiwiX29sZEhpZGRlblR5cGVzIiwiX29sZE9wYWNpdHkiLCJyZW5kZXJlcnNGYWN0b3J5IiwiUmVuZGVyZXJzRmFjdG9yeSIsImJ1bGxldFNjcmVlbkV2ZW50VHJpZ2dlciIsIl9yZW5kZXJlciIsImdldEdlbmVyYWxSZW5kZXJlciIsInNldEludGVydmFsIiwic2V0U2l6ZSIsInNldE9wdGlvbnMiLCJkcmF3Iiwic2V0T3BhY2l0eSIsImdldE9wdGlvbnMiLCJhZGRCdWxsZXRTY3JlZW4iLCJidWxsZXRTY3JlZW4iLCJsZWZ0VG9SaWdodCIsInRvcCIsImJvdHRvbSIsIlR5cGVFcnJvciIsIlBBUkFNRVRFUlNfVFlQRV9FUlJPUiIsImNoZWNrVHlwZXMiLCJzdHlsZSIsIm9sZExlbmd0aCIsImdldExlbmd0aCIsImZvckVhY2giLCJsYXN0QnVsbGV0U2NyZWVuIiwiYWRkVG9VcCIsInN0b3AiLCJwdXNoIiwicGxheSIsInJlZnJlc2giLCJwbGF5QWxsQnVsbGV0U2NyZWVucyIsImJ1bGxldFNjcmVlbk9uU2NyZWVuIiwicGF1c2UiLCJjbGVhbkJ1bGxldFNjcmVlbkxpc3QiLCJjbGVhbiIsImNsZWFuU2NyZWVuIiwiaGlkZSIsInNob3ciLCJnZXRWaXNpYmlsaXR5IiwiZ2V0UmVuZGVyTW9kZSIsImdldFBsYXlTdGF0ZSIsImdldERlYnVnSW5mbyIsImJ1bGxldFNjcmVlbnNPblNjcmVlbkNvdW50IiwiYnVsbGV0U2NyZWVuc0NvdW50IiwiZGVsYXkiLCJkZWxheUJ1bGxldFNjcmVlbnNDb3VudCIsImZwcyIsIk1hdGgiLCJmbG9vciIsIm5hbWUiLCJlIiwicGFnZVgiLCJkb2MiLCJkb2N1bWVudCIsImRvY3VtZW50RWxlbWVudCIsImJvZHkiLCJjbGllbnRYIiwic2Nyb2xsTGVmdCIsImNsaWVudExlZnQiLCJwYWdlWSIsImNsaWVudFkiLCJzY3JvbGxUb3AiLCJjbGllbnRUb3AiLCJ0cmlnZ2VyIiwiZ2V0QnVsbGV0U2NyZWVuIiwiY2xvbmUiLCJzZXRCdWxsZXRTY3JlZW4iLCJyZWRyYXciLCJidWxsZXRTY3JlZW5UeXBlIiwicmVDcmVhdEFuZGdldFdpZHRoIiwic2V0UGxheVN0YXRlIiwic2NyZWVuWCIsInNjcmVlblkiLCJub3dUaW1lIiwiYWRkQnVsbGV0U2NyZWVuc1RvU2NyZWVuIiwibW92ZUJ1bGxldFNjcmVlbk9uU2NyZWVuIiwieCIsInJlbW92ZSIsImVuZFRpbWUiLCJ0aW1lcyIsInBvcCIsImdldEJ1bGxldFNjcmVlbk9uU2NyZWVuIiwiY3JlYXRBbmRnZXRXaWR0aCIsInJvdW5kIiwieSIsIm5leHRCdWxsZXRTY3JlZW5PblNjcmVlbiIsInNldEFjdHVhbFkiLCJidWxsZXRTY3JlZW5PblNjcmVlbldpZHRoVGltZSIsIm5leHRCdWxsZXRTY3JlZW5PblNjcmVlbldpZHRoVGltZSIsImFjdHVhbFkiLCJkZXZpY2VQaXhlbFJhdGlvIiwiQWN0aXZlWE9iamVjdCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsImluZGV4T2YiLCJpbmZvIiwiTE9BREVEX0lORk9fSUUiLCJmaWxsRGF0YSIsImJ1aWxkIiwiTE9BREVEX0lORk8iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUE7Ozs7OztJQU1xQkEsYTtBQUNqQjs7Ozs7O0FBTUEsdUJBQVlDLE9BQVosRUFBcUJDLE9BQXJCLEVBQXFEO0FBQUEsTUFBdkJDLFVBQXVCLHVFQUFWLFFBQVU7O0FBQUE7O0FBRWpEOzs7O0FBSUEsTUFBSUMsVUFBSjtBQUNBOzs7Ozs7QUFJQSxNQUFJQyxVQUFVLEdBQUcsQ0FBakI7QUFDQTs7Ozs7QUFJQSxNQUFJQyxjQUFjLEdBQUcsSUFBSUMsc0JBQUosRUFBckI7QUFDQTs7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SCxNQUE3QyxJQUF1RHFILFNBQVMsQ0FBQ0MsU0FBVixDQUFvQkMsT0FBcEIsQ0FBNEIsU0FBNUIsSUFBeUMsQ0FBQyxDQUFqRyxJQUNBRixTQUFTLENBQUNDLFNBQVYsQ0FBb0JDLE9BQXBCLENBQTRCLE1BQTVCLElBQXNDLENBQUMsQ0FEdkMsSUFDNENGLFNBQVMsQ0FBQ0MsU0FBVixDQUFvQkMsT0FBcEIsQ0FBNEIsTUFBNUIsSUFBc0MsQ0FBQyxDQUR2RixFQUMwRnRILE9BQU8sQ0FBQ3VILElBQVIsQ0FDbEZySCxzQkFBVXNILGNBQVYsQ0FBeUJDLFFBQXpCLENBQWtDQyxLQUFsQyxDQURrRixFQUQxRixLQUtLMUgsT0FBTyxDQUFDdUgsSUFBUixDQUNEckgsc0JBQVV5SCxXQUFWLENBQXNCRixRQUF0QixDQUErQkMsS0FBL0IsQ0FEQyxFQUVELGtDQUZDLEVBRW1DLEVBRm5DLEVBRXVDLG9CQUZ2QyxFQUU2RCxFQUY3RDtBQUlSLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGlua2VkTGlzdCBmcm9tICcuLi9saWIvbGlua2VkTGlzdCdcbmltcG9ydCBFdmVudCBmcm9tICcuLi9saWIvZXZlbnQnXG5pbXBvcnQgUmVuZGVyZXJzRmFjdG9yeSBmcm9tICcuLi9yZW5kZXJlcnMvcmVuZGVyZXJzRmFjdG9yeSdcbmltcG9ydCBHZW5lcmFsVHlwZSBmcm9tICcuL2dlbmVyYWxUeXBlJ1xuaW1wb3J0IEhlbHBlciBmcm9tICcuLi9saWIvaGVscGVyJ1xuaW1wb3J0IFJlc291cmNlcyBmcm9tICcuLi9saWIvcmVzb3VyY2VzJ1xuaW1wb3J0ICogYXMgYnVpbGQgZnJvbSAnLi4vYnVpbGQuanNvbidcblxuLyoqIFxuICog5by55bmV5byV5pOO5a+56LGh57G7IFxuICogQGFsaWFzIG9wZW5CU0UuR2VuZXJhbEVuZ2luZVxuICogQHRocm93cyB7b3BlbkJTRS5Ccm93c2VyTm90U3VwcG9ydEVycm9yfSDmtY/op4jlmajkuI3mlK/mjIHnibnlrprmuLLmn5PmqKHlvI/ml7blvJXlj5HplJnor6/jgIJcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn0g5Lyg5YWl55qE5Y+C5pWw6ZSZ6K+v5pe25byV5Y+R6ZSZ6K+v44CC6K+35Y+C6ZiFIE1ETiBbVHlwZUVycm9yXXtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy96aC1DTi9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9UeXBlRXJyb3J9IOOAglxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHZW5lcmFsRW5naW5lIHtcbiAgICAvKipcbiAgICAgKiDliJvlu7rkuIDkuKrlvLnluZXlvJXmk47lr7nosaHjgIJcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgLSDopoHliqDovb3lvLnluZXnmoTlhYPntKDvvJrmnInlhbMgRWxlbWVudCDmjqXlj6PnmoTkv6Hmga/or7flj4LpmIVNRE4gW0VsZW1lbnRde0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3poLUNOL2RvY3MvV2ViL0FQSS9FbGVtZW50fSDjgIJcbiAgICAgKiBAcGFyYW0ge29wZW5CU0V+T3B0aW9uc30gW19vcHRpb25zXSAtIOWFqOWxgOmAiemhue+8muS4gOS4qiB7QGxpbmsgb3BlbkJTRX5PcHRpb25zfSDnu5PmnoTjgIJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3JlbmRlck1vZGU9XCJjYW52YXNcIl0gLSDmuLLmn5PmqKHlvI/vvJrpu5jorqTkuLrigJxjYW52YXPigJ0sIOKAnOWPr+mAiWNzczPigJ3vvIwg4oCcd2ViZ2zigJ3lkozigJxzdmfigJ3jgILkuIDoiKzlu7rorq7kvb/nlKjigJxjYW52YXPigJ3vvIjnibnliKvmmK8gRmlyZUZveCDmtY/op4jlmaggQ1NTMyDmuLLmn5PmlYjnjofovoPkvY7vvInjgILlnKjkuIDkupvniYjmnKzovoPogIHnmoTmtY/op4jlmajkuK3igJx3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpb+KAneWPmOmHj+S4jeiiq+aUr+aMgeaIluaUr+aMgeS4jeWujOaVtO+8jOi/meS8muWvvOiHtOWcqOmrmERQSeWSjOmhtemdouiiq+e8qeaUvueahOaDheWGteS4i+KAnGNhbnZhc+KAneWSjOKAnHdlYmds4oCd5riy5p+T5qih5byP5by55bmV5pi+56S65LiN5q2j5bi455qE5oOF5Ya177yI5by55bmV5qih57OK77yJ77yM5q2k5pe25bu66K6u5L2/55So4oCcY3NzM+KAnea4suafk+aooeW8j+OAglxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMsIHJlbmRlck1vZGUgPSAnY2FudmFzJykge1xuICAgICAgICAvL+WPmOmHj+WIneWni+WMllxuICAgICAgICAvKipcbiAgICAgICAgICog5byA5aeL5pe26Ze0XG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgX3N0YXJ0VGltZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaaguWBnOaXtumXtFxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9wYXVzZVRpbWUgPSAwO1xuICAgICAgICAvKipcbiAgICAgICAgICog5Ymp5L2Z5by55bmVXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtMaW5rZWRMaXN0fVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9idWxsZXRTY3JlZW5zID0gbmV3IExpbmtlZExpc3QoKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWxj+W5leS4iueahOW8ueW5lVxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7TGlua2VkTGlzdH1cbiAgICAgICAgICovXG4gICAgICAgIGxldCBfYnVsbGV0U2NyZWVuc09uU2NyZWVuID0gbmV3IExpbmtlZExpc3QoKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOW7tui/n+W8ueW5leaAu+aVsFxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9kZWxheUJ1bGxldFNjcmVlbnNDb3VudCA9IDA7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlu7bov5/vvIjljZXkvY3vvJrmr6vnp5LvvIlcbiAgICAgICAgICogQHByaXZhdGUgQHR5cGUge251bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIGxldCBfZGVsYXkgPSAwO1xuICAgICAgICAvKipcbiAgICAgICAgICog5pKt5pS+5qCH5b+XXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtib29sZWFufVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9wbGF5aW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICog5Yi35paw6aKR546HXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgX3JlZnJlc2hSYXRlID0gMC4wNjsgLy/liJ3lp4vliLfmlrDpopHnjodcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOS4iuS4gOasoeWIt+aWsOaXtumXtFxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9sYXN0UmVmcmVzaFRpbWU7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlhajlsYDpgInpoblcbiAgICAgICAgICogQHByaXZhdGUgQHR5cGUge29wZW5CU0V+T3B0aW9uc31cbiAgICAgICAgICovXG4gICAgICAgIGxldCBfb3B0aW9ucztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOm7mOiupOWFqOWxgOWPmOmHj1xuICAgICAgICAgKiBAcHJpdmF0ZSBAcmVhZG9ubHlcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9kZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgICAgIC8qKiDlnoLnm7Tpl7Tot50gKi9cbiAgICAgICAgICAgIHZlcnRpY2FsSW50ZXJ2YWw6IDgsXG4gICAgICAgICAgICAvKiog5pKt5pS+6YCf5bqmKOWAjeaVsCkgKi9cbiAgICAgICAgICAgIHBsYXlTcGVlZDogMSxcbiAgICAgICAgICAgIC8qKiDml7bpl7Tln7rlh4YgKi9cbiAgICAgICAgICAgIGNsb2NrOiB0aW1lID0+IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gX3N0YXJ0VGltZSxcbiAgICAgICAgICAgIC8qKiDnvKnmlL7mr5TkvosgKi9cbiAgICAgICAgICAgIHNjYWxpbmc6IDEsXG4gICAgICAgICAgICAvKiog6LaF5pe25Lii5byDICovXG4gICAgICAgICAgICB0aW1lT3V0RGlzY2FyZDogdHJ1ZSxcbiAgICAgICAgICAgIC8qKiDopoHpmpDol4/nmoTlvLnluZXnsbvlnosgKi9cbiAgICAgICAgICAgIGhpZGRlblR5cGVzOiAwLFxuICAgICAgICAgICAgLyoqIOW8ueW5leS4jemAj+aYjuW6piAqL1xuICAgICAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgICAgIC8qKiDpvKDmoIfnu4/ov4fmoLflvI8gKi9cbiAgICAgICAgICAgIGN1cnNvck9uTW91c2VPdmVyOiAncG9pbnRlcicsXG4gICAgICAgICAgICAvKiog6buY6K6k5by55bmV5qC35byPICovXG4gICAgICAgICAgICBkZWZhdWx0U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAvKiog6Zi05b2x55qE5qih57OK57qn5Yir77yMMOS4uuS4jeaYvuekuumYtOW9sSAqL1xuICAgICAgICAgICAgICAgIHNoYWRvd0JsdXI6IDIsXG4gICAgICAgICAgICAgICAgLyoqIOWtl+S9k+eyl+e7hiAqL1xuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICc2MDAnLFxuICAgICAgICAgICAgICAgIC8qKiDlrZfkvZPns7vliJcgKi9cbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAnc2Fucy1zZXJpZicsXG4gICAgICAgICAgICAgICAgLyoqIOWtl+S9k+Wkp+Wwj++8iOWNleS9je+8muWDj+e0oO+8iSAqL1xuICAgICAgICAgICAgICAgIHNpemU6IDI1LFxuICAgICAgICAgICAgICAgIC8qKiDlpJbmoYbpopzoibIgKi9cbiAgICAgICAgICAgICAgICBib3hDb2xvcjogbnVsbCxcbiAgICAgICAgICAgICAgICAvKiog5a2X5L2T6aKc6ImyICovXG4gICAgICAgICAgICAgICAgY29sb3I6ICd3aGl0ZScsXG4gICAgICAgICAgICAgICAgLyoqIOaPj+i+ueminOiJsiAqL1xuICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiBudWxsLFxuICAgICAgICAgICAgICAgIC8qKiDlvLnluZXpgJ/luqbvvIjljZXkvY3vvJrlg4/ntKAv5q+r56eS77yJIOS7hea1geW8ueW5leexu+Wei+acieaViCAqL1xuICAgICAgICAgICAgICAgIHNwZWVkOiAwLjE1LFxuICAgICAgICAgICAgICAgIC8qKiDlvLnluZXlgZznlZnml7bpl7Qg5LuF5Zu65a6a5by55bmV57G75Z6L5pyJ5pWIICovXG4gICAgICAgICAgICAgICAgcmVzaWRlbmNlVGltZTogNTAwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWFqOWxgOmAiemhueexu+Wei1xuICAgICAgICAgKiBAcHJpdmF0ZSBAcmVhZG9ubHlcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9vcHRpb25zVHlwZSA9IHtcbiAgICAgICAgICAgIHZlcnRpY2FsSW50ZXJ2YWw6ICdudW1iZXInLFxuICAgICAgICAgICAgcGxheVNwZWVkOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIGNsb2NrOiAnZnVuY3Rpb24nLFxuICAgICAgICAgICAgc2NhbGluZzogJ251bWJlcicsXG4gICAgICAgICAgICB0aW1lT3V0RGlzY2FyZDogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgaGlkZGVuVHlwZXM6ICdudW1iZXInLFxuICAgICAgICAgICAgb3BhY2l0eTogJ251bWJlcicsXG4gICAgICAgICAgICBjdXJzb3JPbk1vdXNlT3ZlcjogJ3N0cmluZycsXG4gICAgICAgICAgICBkZWZhdWx0U3R5bGU6IHtcbiAgICAgICAgICAgICAgICBzaGFkb3dCbHVyOiAnbnVtYmVyJyxcbiAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBbJ3N0cmluZycsICdudW1iZXInXSxcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICBzaXplOiAnbnVtYmVyJyxcbiAgICAgICAgICAgICAgICBib3hDb2xvcjogWydzdHJpbmcnLCAnbnVsbCddLFxuICAgICAgICAgICAgICAgIGNvbG9yOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogWydzdHJpbmcnLCAnbnVsbCddLFxuICAgICAgICAgICAgICAgIHNwZWVkOiAnbnVtYmVyJyxcbiAgICAgICAgICAgICAgICByZXNpZGVuY2VUaW1lOiAnbnVtYmVyJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOm7mOiupOW8ueW5leaVsOaNrlxuICAgICAgICAgKiBAcHJpdmF0ZSBAcmVhZG9ubHlcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9kZWZhdWx0QnVsbGV0U2NyZWVuID0ge1xuICAgICAgICAgICAgLyoqIOW8ueW5leaWh+acrCAqL1xuICAgICAgICAgICAgdGV4dDogbnVsbCxcbiAgICAgICAgICAgIC8qKiDmmK/lkKblhYHorrjkuKLlvIMgKi9cbiAgICAgICAgICAgIGNhbkRpc2NhcmQ6IHRydWUsXG4gICAgICAgICAgICAvKiog5by55bmV6L+b5YWl5pe26Ze0ICovXG4gICAgICAgICAgICBzdGFydFRpbWU6IG51bGwsXG4gICAgICAgICAgICAvKiog5by55bmV57G75Z6LICovXG4gICAgICAgICAgICB0eXBlOiBHZW5lcmFsVHlwZS5yaWdodFRvTGVmdCxcbiAgICAgICAgICAgIC8qKiDlvLnluZXlsYLnuqfvvIjotorlpKfotorliY3vvIkgKi9cbiAgICAgICAgICAgIGxheWVyOiAwXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5by55bmV5pWw5o2u57G75Z6LXG4gICAgICAgICAqIEBwcml2YXRlIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX2J1bGxldFNjcmVlblR5cGUgPSB7XG4gICAgICAgICAgICB0ZXh0OiAnc3RyaW5nJyxcbiAgICAgICAgICAgIGNhbkRpc2NhcmQ6ICdib29sZWFuJyxcbiAgICAgICAgICAgIHN0YXJ0VGltZTogJ251bWJlcicsXG4gICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIGxheWVyOiAnbnVtYmVyJ1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHJlcXVlc3RBbmltYXRpb25GcmFtZSDlrprkuYnvvIjkuIDkupvogIHlvI/mtY/op4jlmajkuI3mlK/mjIEgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIO+8iVxuICAgICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmdW4gLSDlm57osIPmlrnms5UgXG4gICAgICAgICAqIEBmdW5jdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IHJlcXVlc3RBbmltYXRpb25GcmFtZTtcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSAnZnVuY3Rpb24nKSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihSZXNvdXJjZXMuUkVRVUVTVEFOSU1BVElPTkZSQU1FX05PVF9TVVBQT1JUX1dBUk4pO1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gKGZ1bikgPT4gd2luZG93LnNldFRpbWVvdXQoZnVuLCAxNyk7IC8vNjBmcHNcbiAgICAgICAgfVxuXG4gICAgICAgIF9vcHRpb25zID0gSGVscGVyLnNldFZhbHVlcyhvcHRpb25zLCBfZGVmYXVsdE9wdGlvbnMsIF9vcHRpb25zVHlwZSk7IC8v6K6+572u6buY6K6k5YC8XG5cbiAgICAgICAgLy/kuovku7bliJ3lp4vljJZcbiAgICAgICAgbGV0IF9ldmVudCA9IG5ldyBFdmVudCgpO1xuICAgICAgICAvKipcbiAgICAgICAgICog5by55bmV5Y2V5Ye75LqL5Lu244CC5b2T5Y2V5Ye75by55bmV5pe26Kem5Y+R44CCXG4gICAgICAgICAqIEBldmVudCBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZSNjbGlja1xuICAgICAgICAgKiBAcHJvcGVydHkge29wZW5CU0V+QnVsbGV0U2NyZWVuRXZlbnR9IGUgLSDlvLnluZXkuovku7bnu5PmnoRcbiAgICAgICAgICovXG4gICAgICAgIF9ldmVudC5hZGQoJ2NsaWNrJyk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlvLnluZXkuIrkuIvmlofoj5zljZXkuovku7bjgILlvZPop6blj5HlvLnluZXkuIrkuIvmlofoj5zljZXml7bop6blj5HjgIJcbiAgICAgICAgICogQGV2ZW50IG9wZW5CU0UuQnVsbGV0U2NyZWVuRW5naW5lI2NvbnRleHRtZW51XG4gICAgICAgICAqIEBwcm9wZXJ0eSB7b3BlbkJTRX5CdWxsZXRTY3JlZW5FdmVudH0gZSAtIOW8ueW5leS6i+S7tue7k+aehFxuICAgICAgICAgKi9cbiAgICAgICAgX2V2ZW50LmFkZCgnY29udGV4dG1lbnUnKTtcbiAgICAgICAgLyoqXG4gICAgICAgICog5by55bmV6byg5qCH56a75byA5LqL5Lu244CC5b2T6byg5qCH56a75byA5by55bmV5pe26Kem5Y+R44CCXG4gICAgICAgICogQGV2ZW50IG9wZW5CU0UuQnVsbGV0U2NyZWVuRW5naW5lI21vdXNlbGVhdmVcbiAgICAgICAgKiBAcHJvcGVydHkge29wZW5CU0V+QnVsbGV0U2NyZWVuRXZlbnR9IGUgLSDlvLnluZXkuovku7bnu5PmnoRcbiAgICAgICAgKi9cbiAgICAgICAgX2V2ZW50LmFkZCgnbW91c2VsZWF2ZScpO1xuICAgICAgICAvKipcbiAgICAgICAgICog5by55bmV6byg5qCH6L+b5YWl5LqL5Lu244CC5b2T6byg5qCH6L+b5YWl5by55bmV5pe26Kem5Y+R44CCXG4gICAgICAgICAqIEBldmVudCBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZSNtb3VzZWVudGVyXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7b3BlbkJTRX5CdWxsZXRTY3JlZW5FdmVudH0gZSAtIOW8ueW5leS6i+S7tue7k+aehFxuICAgICAgICAgKi9cbiAgICAgICAgX2V2ZW50LmFkZCgnbW91c2VlbnRlcicpO1xuICAgICAgICAvKipcbiAgICAgICAgICog57uR5a6a5LqL5Lu25aSE55CG56iL5bqPXG4gICAgICAgICAqIEBmdW5jdGlvblxuICAgICAgICAgKiBAZGVzY3JpcHRpb24g57uR5a6a5LqL5Lu25aSE55CG56iL5bqP44CC5b2T5LqL5Lu25aSE55CG56iL5bqP6L+U5Zue5YC85Li6IGZhbHNlIOaXtuWBnOatouWGkuazoeOAglxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIOS6i+S7tuWQjeensFxuICAgICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmdW4gLSDkuovku7blpITnkIbnqIvluo9cbiAgICAgICAgICogQGxpc3RlbnMgb3BlbkJTRS5CdWxsZXRTY3JlZW5FbmdpbmUjY2xpY2tcbiAgICAgICAgICogQGxpc3RlbnMgb3BlbkJTRS5CdWxsZXRTY3JlZW5FbmdpbmUjY29udGV4dG1lbnVcbiAgICAgICAgICogQGxpc3RlbnMgb3BlbkJTRS5CdWxsZXRTY3JlZW5FbmdpbmUjbW91c2VsZWF2ZVxuICAgICAgICAgKiBAbGlzdGVucyBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZSNtb3VzZWVudGVyXG4gICAgICAgICAqIEB0aHJvd3Mge1R5cGVFcnJvcn0g5Lyg5YWl55qE5Y+C5pWw6ZSZ6K+v5oiW5LqL5Lu25LiN5a2Y5Zyo5pe25byV5Y+R6ZSZ6K+v44CC6K+35Y+C6ZiFIE1ETiBbVHlwZUVycm9yXXtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy96aC1DTi9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9UeXBlRXJyb3J9IOOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5iaW5kID0gX2V2ZW50LmJpbmQ7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDop6Pnu5Hkuovku7blpITnkIbnqIvluo/vvIhmdW7kuLrnqbrop6Pnu5HmiYDmnInkuovku7blpITnkIbnqIvluo/vvIlcbiAgICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0g5LqL5Lu25ZCN56ewXG4gICAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZ1biAtIOS6i+S7tuWkhOeQhueoi+W6j1xuICAgICAgICAgKiBAdGhyb3dzIHtUeXBlRXJyb3J9IOS8oOWFpeeahOWPguaVsOmUmeivr+aIluS6i+S7tuS4jeWtmOWcqOaXtuW8leWPkemUmeivr+OAguivt+WPgumYhSBNRE4gW1R5cGVFcnJvcl17QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvemgtQ04vZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvVHlwZUVycm9yfSDjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudW5iaW5kID0gX2V2ZW50LnVuYmluZDtcbiAgICAgICAgLy/liJ3lp4vljJZcbiAgICAgICAgbGV0IF9lbGVtZW50U2l6ZSA9IHtcbiAgICAgICAgICAgIHdpZHRoOiBlbGVtZW50LmNsaWVudFdpZHRoIC8gX29wdGlvbnMuc2NhbGluZyxcbiAgICAgICAgICAgIGhlaWdodDogZWxlbWVudC5jbGllbnRIZWlnaHQgLyBfb3B0aW9ucy5zY2FsaW5nXG4gICAgICAgIH1cbiAgICAgICAgbGV0IF9vbGREZXZpY2VQaXhlbFJhdGlvID0gSGVscGVyLmdldERldmljZVBpeGVsUmF0aW8oKTtcbiAgICAgICAgbGV0IF9vbGRTY2FsaW5nID0gX29wdGlvbnMuc2NhbGluZztcbiAgICAgICAgbGV0IF9vbGRDbGllbnRXaWR0aCA9IGVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgIGxldCBfb2xkQ2xpZW50SGVpZ2h0ID0gZWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gICAgICAgIGxldCBfb2xkSGlkZGVuVHlwZXMgPSBfb3B0aW9ucy5oaWRkZW5UeXBlcztcbiAgICAgICAgbGV0IF9vbGRPcGFjaXR5ID0gX29wdGlvbnMub3BhY2l0eTtcbiAgICAgICAgLy/muLLmn5Plmajlt6XljoJcbiAgICAgICAgbGV0IHJlbmRlcmVyc0ZhY3RvcnkgPSBuZXcgUmVuZGVyZXJzRmFjdG9yeShlbGVtZW50LCBfb3B0aW9ucywgX2VsZW1lbnRTaXplLCBidWxsZXRTY3JlZW5FdmVudFRyaWdnZXIpO1xuICAgICAgICBsZXQgX3JlbmRlcmVyID0gcmVuZGVyZXJzRmFjdG9yeS5nZXRHZW5lcmFsUmVuZGVyZXIocmVuZGVyTW9kZSk7IC8v5a6e5L6L5YyW5riy5p+T5ZmoXG4gICAgICAgIHNldEludGVydmFsKHNldFNpemUsIDEwMCk7XG5cbiAgICAgICAgLy/lhazlhbHlh73mlbBcblxuICAgICAgICAvKipcbiAgICAgICAgICog6K6+572u5YWo5bGA6YCJ6aG5XG4gICAgICAgICAqIEBwYXJhbSB7b3BlbkJTRX5PcHRpb25zfSBvcHRpb25zIC0g5YWo5bGA6YCJ6aG577ya5LiA5LiqIHtAbGluayBvcGVuQlNFfk9wdGlvbnN9IOe7k+aehOOAglxuICAgICAgICAgKiBAdGhyb3dzIHtUeXBlRXJyb3J9IOS8oOWFpeeahOWPguaVsOmUmeivr+aXtuW8leWPkemUmeivr+OAguivt+WPgumYhSBNRE4gW1R5cGVFcnJvcl17QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvemgtQ04vZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvVHlwZUVycm9yfSDjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICBfb3B0aW9ucyA9IEhlbHBlci5zZXRWYWx1ZXMob3B0aW9ucywgX29wdGlvbnMsIF9vcHRpb25zVHlwZSwgZmFsc2UpOyAvL+iuvue9rum7mOiupOWAvFxuICAgICAgICAgICAgaWYgKF9vbGRIaWRkZW5UeXBlcyAhPSBfb3B0aW9ucy5oaWRkZW5UeXBlcykge1xuICAgICAgICAgICAgICAgIF9vbGRIaWRkZW5UeXBlcyA9IF9vcHRpb25zLmhpZGRlblR5cGVzO1xuICAgICAgICAgICAgICAgIGlmICghX3BsYXlpbmcpIF9yZW5kZXJlci5kcmF3KCk7IC8v6Z2e5pKt5pS+54q25oCB5YiZ6YeN57uYXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoX29sZE9wYWNpdHkgIT0gX29wdGlvbnMub3BhY2l0eSkge1xuICAgICAgICAgICAgICAgIF9vbGRPcGFjaXR5ID0gX29wdGlvbnMub3BhY2l0eTtcbiAgICAgICAgICAgICAgICBfcmVuZGVyZXIuc2V0T3BhY2l0eSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5blhajlsYDpgInpoblcbiAgICAgICAgICogQHJldHVybnMge29wZW5CU0V+T3B0aW9uc30g5YWo5bGA6YCJ6aG577ya5LiA5LiqIHtAbGluayBvcGVuQlNFfk9wdGlvbnN9IOe7k+aehOOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5nZXRPcHRpb25zID0gKCkgPT4gX29wdGlvbnM7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa3u+WKoOW8ueW5leWIsOW8ueW5leWIl+ihqOOAglxuICAgICAgICAgKiBAZGVzY3JpcHRpb24g5re75Yqg5by55bmV5Yiw5by55bmV5YiX6KGo44CC55Sx5LqO5by55bmV5Zyo5bGP5bmV5LiK5Ye6546w6L+H5ZCO77yM5by55bmV5byV5pOO5bCG5LuO5YiX6KGo5Lit5b275bqV5Yig6Zmk5q2k5by55bmV44CC5omA5Lul77yM5Zyo5pS55Y+Y5pKt5pS+6L+b5bqm5pe277yM5Y+v6IO96ZyA6KaB5YWIW+a4heepuuW8ueW5leWIl+ihqF17QGxpbmsgb3BlbkJTRS5CdWxsZXRTY3JlZW5FbmdpbmUjY2xlYW5CdWxsZXRTY3JlZW5MaXN0fe+8jOeEtuWQjumHjeaWsOWKoOi9veatpOaSreaUvui/m+W6puS7peWQjueahOW8ueW5leOAglxuICAgICAgICAgKiBAcGFyYW0ge29wZW5CU0V+QnVsbGV0U2NyZWVufSBidWxsZXRTY3JlZW4gLSDljZXmnaHlvLnluZXmlbDmja7vvJrkuIDkuKoge0BsaW5rIG9wZW5CU0V+QnVsbGV0U2NyZWVufSDnu5PmnoTjgIJcbiAgICAgICAgICogQHRocm93cyB7VHlwZUVycm9yfSDkvKDlhaXnmoTlj4LmlbDplJnor6/ml7blvJXlj5HplJnor6/jgILor7flj4LpmIUgTUROIFtUeXBlRXJyb3Jde0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3poLUNOL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1R5cGVFcnJvcn0g44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmFkZEJ1bGxldFNjcmVlbiA9IGZ1bmN0aW9uIChidWxsZXRTY3JlZW4pIHtcbiAgICAgICAgICAgIF9kZWZhdWx0QnVsbGV0U2NyZWVuLnN0YXJ0VGltZSA9IF9vcHRpb25zLmNsb2NrKCk7XG4gICAgICAgICAgICBidWxsZXRTY3JlZW4gPSBIZWxwZXIuc2V0VmFsdWVzKGJ1bGxldFNjcmVlbiwgX2RlZmF1bHRCdWxsZXRTY3JlZW4sIF9idWxsZXRTY3JlZW5UeXBlKTsgLy/orr7nva7pu5jorqTlgLxcblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbi50eXBlICE9IEdlbmVyYWxUeXBlLmxlZnRUb1JpZ2h0ICYmXG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuLnR5cGUgIT0gR2VuZXJhbFR5cGUucmlnaHRUb0xlZnQgJiZcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW4udHlwZSAhPSBHZW5lcmFsVHlwZS50b3AgJiZcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW4udHlwZSAhPSBHZW5lcmFsVHlwZS5ib3R0b21cbiAgICAgICAgICAgICkgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuUEFSQU1FVEVSU19UWVBFX0VSUk9SKTtcblxuICAgICAgICAgICAgSGVscGVyLmNoZWNrVHlwZXMoYnVsbGV0U2NyZWVuLnN0eWxlLCBfb3B0aW9uc1R5cGUuZGVmYXVsdFN0eWxlKTsgLy/mo4Dmn6XlvLnluZXmoLflvI/nsbvlnotcblxuICAgICAgICAgICAgbGV0IG9sZExlbmd0aCA9IF9idWxsZXRTY3JlZW5zLmdldExlbmd0aCgpO1xuICAgICAgICAgICAgX2J1bGxldFNjcmVlbnMuZm9yRWFjaChmdW5jdGlvbiAobGFzdEJ1bGxldFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW4uc3RhcnRUaW1lID4gbGFzdEJ1bGxldFNjcmVlbi5zdGFydFRpbWUpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGQ6IHsgYWRkVG9VcDogdHJ1ZSwgZWxlbWVudDogYnVsbGV0U2NyZWVuIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9wOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgICAgIGlmIChvbGRMZW5ndGggPT09IF9idWxsZXRTY3JlZW5zLmdldExlbmd0aCgpKVxuICAgICAgICAgICAgICAgIF9idWxsZXRTY3JlZW5zLnB1c2goYnVsbGV0U2NyZWVuLCBmYWxzZSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5byA5aeL5pKt5pS+5by55bmV44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnBsYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIV9wbGF5aW5nKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFfc3RhcnRUaW1lKVxuICAgICAgICAgICAgICAgICAgICBfc3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgaWYgKF9wYXVzZVRpbWUpXG4gICAgICAgICAgICAgICAgICAgIF9zdGFydFRpbWUgKz0gX29wdGlvbnMuY2xvY2soKSAtIF9wYXVzZVRpbWU7XG4gICAgICAgICAgICAgICAgX2xhc3RSZWZyZXNoVGltZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgX3BsYXlpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZWZyZXNoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog57un57ut5omA5pyJ5Zyo5LqL5Lu25ZON5bqU5Lit6K6+572u5LqGIGUucGF1c2UgPSB0cnVlOyDlvLnluZXnmoTmkq3mlL7jgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucGxheUFsbEJ1bGxldFNjcmVlbnMgPSAoKSA9PlxuICAgICAgICAgICAgX2J1bGxldFNjcmVlbnNPblNjcmVlbi5mb3JFYWNoKChidWxsZXRTY3JlZW5PblNjcmVlbikgPT4gYnVsbGV0U2NyZWVuT25TY3JlZW4ucGF1c2UgPSBmYWxzZSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaaguWBnOaSreaUvuW8ueW5leOAglxuICAgICAgICAgKiBAZGVzY3JpcHRpb24g5pqC5YGc5pKt5pS+5by55bmV44CC5pqC5YGc5pKt5pS+5by55bmV5piv5oyH5by55bmV5pKt5pS+5pqC5YGc77yM5omA5pyJ5pyq5Ye6546w55qE5by55bmV5bCG5YGc5q2i5Ye6546w77yM5bey5Ye6546w55qE5by55bmV5YGc5q2i6L+Q5Yqo77yM5YGc5q2i5raI5aSx44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnBhdXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKF9wbGF5aW5nKSB7XG4gICAgICAgICAgICAgICAgX3BhdXNlVGltZSA9IF9vcHRpb25zLmNsb2NrKCk7XG4gICAgICAgICAgICAgICAgX3BsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5riF56m65by55bmV5YiX6KGo44CCXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiDmuIXnqbrlvLnluZXliJfooajvvIzkvYblsY/luZXkuIrlt7Lnu4/lh7rnjrDnmoTlvLnluZXkuI3kvJrooqvmuIXpmaTjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY2xlYW5CdWxsZXRTY3JlZW5MaXN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX2J1bGxldFNjcmVlbnMuY2xlYW4oKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5riF56m65bGP5bmV5YaF5a6544CCXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiDmuIXnqbrlsY/luZXlhoXlrrnjgILmuIXnqbrlsY/luZXkuIrlt7Lnu4/lh7rnjrDnmoTlvLnluZXvvIzkuI3ljIXmi6zlvLnluZXliJfooajkuK3nmoTlvLnluZXjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY2xlYW5TY3JlZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfYnVsbGV0U2NyZWVuc09uU2NyZWVuLmNsZWFuKCk7XG4gICAgICAgICAgICBfcmVuZGVyZXIuY2xlYW5TY3JlZW4oKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5YGc5q2i5pKt5pS+5by55bmV44CCXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiDlgZzmraLmkq3mlL7lvLnluZXjgILlgZzmraLmkq3mlL7lvLnluZXmmK/mjIflgZzmraLmkq3mlL7lvLnluZXvvIzpu5jorqRb5pe26Ze05Z+65YeG77yIb3B0aW9ucy5jbG9ja++8iV17QGxpbmsgb3BlbkJTRX5CdWxsZXRTY3JlZW5TdHlsZX3lvZLpm7bvvIzlubZb5riF56m65by55bmV5YiX6KGoXXtAbGluayBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZSNjbGVhbkJ1bGxldFNjcmVlbkxpc3R944CBW+a4heepuuWxj+W5leWGheWuuV17QGxpbmsgb3BlbkJTRS5CdWxsZXRTY3JlZW5FbmdpbmUjY2xlYW5TY3JlZW5944CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoX3BsYXlpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhdXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNsZWFuQnVsbGV0U2NyZWVuTGlzdCgpO1xuICAgICAgICAgICAgdGhpcy5jbGVhblNjcmVlbigpO1xuICAgICAgICAgICAgX3BhdXNlVGltZSA9IDA7XG4gICAgICAgICAgICBfc3RhcnRUaW1lID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog6ZqQ6JeP5by55bmV44CCXG4gICAgICAgICAqIEBmdW5jdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5oaWRlID0gX3JlbmRlcmVyLmhpZGU7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaYvuekuuW8ueW5leOAglxuICAgICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc2hvdyA9IF9yZW5kZXJlci5zaG93O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5blvLnluZXlj6/op4HmgKfjgIJcbiAgICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSAtIOaMh+ekuuW8ueW5leaYr+WQpuWPr+ingeOAglxuICAgICAgICAgKiBAZGVzY3JpcHRpb24g6I635Y+W5by55bmV5Y+v6KeB5oCn44CC5aaC6KaB5pi+56S65by55bmV6K+36LCD55SoIFtidWxsZXRTY3JlZW5FbmdpbmUuc2hvdygpO117QGxpbmsgb3BlbkJTRS5CdWxsZXRTY3JlZW5FbmdpbmUjc2hvd30g77yM6KaB6ZqQ6JeP5by55bmV6K+36LCD55SoIFtidWxsZXRTY3JlZW5FbmdpbmUuaGlkZSgpO117QGxpbmsgb3BlbkJTRS5CdWxsZXRTY3JlZW5FbmdpbmUjaGlkZX0g44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmdldFZpc2liaWxpdHkgPSBfcmVuZGVyZXIuZ2V0VmlzaWJpbGl0eTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPlua4suafk+aooeW8j+OAglxuICAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIOW8ueW5lea4suafk+aooeW8j++8miDlj5blgLzkuLrigJxjYW52YXPigJ3jgIHigJxjc3Mz4oCd44CB4oCcd2ViZ2zigJ3miJbigJxzdmfigJ3jgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZ2V0UmVuZGVyTW9kZSA9ICgpID0+IHJlbmRlck1vZGU7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPluaSreaUvueKtuaAgeOAglxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSDmraPlnKjmkq3mlL7moIflv5fvvJp0cnVl77ya5q2j5Zyo5pKt5pS+77ybZmFsc2XvvJrlt7LmmoLlgZwv5YGc5q2i5pKt5pS+44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmdldFBsYXlTdGF0ZSA9ICgpID0+IF9wbGF5aW5nO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAqIOiOt+WPluiwg+ivleS/oeaBr+OAglxuICAgICAgICAqIEByZXR1cm5zIHtvcGVuQlNFfkRlYnVnSW5mb30gLSDosIPor5Xkv6Hmga/vvJrkuIDkuKoge0BsaW5rIG9wZW5CU0V+RGVidWdJbmZvfSDnu5PmnoTjgIJcbiAgICAgICAgKi9cbiAgICAgICAgdGhpcy5nZXREZWJ1Z0luZm8gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRpbWU6IF9wbGF5aW5nID8gX29wdGlvbnMuY2xvY2soKSA6IF9wYXVzZVRpbWUsXG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuc09uU2NyZWVuQ291bnQ6IF9idWxsZXRTY3JlZW5zT25TY3JlZW4uZ2V0TGVuZ3RoKCksXG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuc0NvdW50OiBfYnVsbGV0U2NyZWVucy5nZXRMZW5ndGgoKSxcbiAgICAgICAgICAgICAgICBkZWxheTogX2RlbGF5LFxuICAgICAgICAgICAgICAgIGRlbGF5QnVsbGV0U2NyZWVuc0NvdW50OiBfZGVsYXlCdWxsZXRTY3JlZW5zQ291bnQsXG4gICAgICAgICAgICAgICAgZnBzOiBfcGxheWluZyA/IE1hdGguZmxvb3IoX3JlZnJlc2hSYXRlICogMTAwMCkgOiAwIC8v5bin6aKRXG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuXG4gICAgICAgIC8v5YaF6YOo5Ye95pWwXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOW8ueW5leS6i+S7tuWTjeW6lFxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIOS6i+S7tuWQjeensFxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gYnVsbGV0U2NyZWVuT25TY3JlZW4gLSDlsY/luZXlvLnluZXlr7nosaFcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGUgLSDkuovku7bkv6Hmga9cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGJ1bGxldFNjcmVlbkV2ZW50VHJpZ2dlcihuYW1lLCBidWxsZXRTY3JlZW5PblNjcmVlbiwgZSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBlLnBhZ2VYID09PSAndW5kZWZpbmVkJyB8fCBlLnBhZ2VYID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbGV0IGRvYyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgYm9keSA9IGRvY3VtZW50LmJvZHk7XG4gICAgICAgICAgICAgICAgZS5wYWdlWCA9IGUuY2xpZW50WCArIChkb2MgJiYgZG9jLnNjcm9sbExlZnQgfHwgYm9keSAmJiBib2R5LnNjcm9sbExlZnQgfHwgMCkgLSAoZG9jICYmIGRvYy5jbGllbnRMZWZ0IHx8IGJvZHkgJiYgYm9keS5jbGllbnRMZWZ0IHx8IDApO1xuICAgICAgICAgICAgICAgIGUucGFnZVkgPSBlLmNsaWVudFkgKyAoZG9jICYmIGRvYy5zY3JvbGxUb3AgfHwgYm9keSAmJiBib2R5LnNjcm9sbFRvcCB8fCAwKSAtIChkb2MgJiYgZG9jLmNsaWVudFRvcCB8fCBib2R5ICYmIGJvZHkuY2xpZW50VG9wIHx8IDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX2V2ZW50LnRyaWdnZXIobmFtZSwge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIOiOt+WPluW8leWPkeS6i+S7tueahOW8ueW5leW8ueW5leeahOaVsOaNrlxuICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAgICAgICAgICogQHJldHVybnMge29wZW5CU0V+QnVsbGV0U2NyZWVufSDlvJXlj5Hkuovku7bnmoTlvLnluZXnmoTmlbDmja7vvJrkuIDkuKoge0BsaW5rIG9wZW5CU0V+QnVsbGV0U2NyZWVufSDnu5PmnoTjgILvvIjms6jmhI/vvJrkuI3opoHor5Xlm77kuI5b5re75Yqg5by55bmVXXtAbGluayBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZSNhZGRCdWxsZXRTY3JlZW595pe25Yib5bu655qE5a+56LGh6L+b6KGM5q+U6L6D77yM6L+Z5Liq5a+56LGh5piv5YWL6ZqG5b6X5Yiw55qE77yM5bm25LiN55u4562J44CC5q2j56Gu55qE5pa55rOV5piv5Zyo5re75Yqg5by55bmV5pe25LiA5bm25o+S5YWlIGlkIOetieiHquWumuS5ieWtl+auteadpeWUr+S4gOagh+ivhuS4gOadoeW8ueW5leOAgu+8iVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGdldEJ1bGxldFNjcmVlbjogKCkgPT4gSGVscGVyLmNsb25lKGJ1bGxldFNjcmVlbk9uU2NyZWVuLmJ1bGxldFNjcmVlbiksXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICog6K6+572u5byV5Y+R5LqL5Lu255qE5by55bmV5by55bmV55qE5pWw5o2uXG4gICAgICAgICAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge29wZW5CU0V+QnVsbGV0U2NyZWVufSBidWxsZXRTY3JlZW4gLSDlvJXlj5Hkuovku7bnmoTlvLnluZXnmoTmlbDmja7vvJrkuIDkuKoge0BsaW5rIG9wZW5CU0V+QnVsbGV0U2NyZWVufSDnu5PmnoTjgILorr7nva7mraTlj4LmlbDku6Xkvr/liqjmgIHosIPmlbTlvLnluZXmoLflvI/vvIzkvYbmmK/kuIDkupvlj4LmlbDlnKjkuovku7bkuK3kv67mlLnml6DmlYjvvIzmn6XnnIvmraTnu5PmnoTnmoTor7TmmI7ku6Xkuobop6Por6bmg4XjgIJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtyZWRyYXc9ZmFsc2VdIC0g5piv5ZCm6YeN57uY5by55bmV77ya5q2k5Y+C5pWw5Zyo5q+P5qyh5byV5Y+R5LqL5Lu25pe255qE5Yid5aeL5YC85Li6IGZhbHNlIO+8jOWmguaenOS/ruaUueS6hiBidWxsZXRTY3JlZW4g5Lit55qE5YC877yM5q2k5Y+C5pWw5b+F6aG76K6+5Li6IHRydWUg44CCXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgc2V0QnVsbGV0U2NyZWVuOiAoYnVsbGV0U2NyZWVuLCByZWRyYXcgPSBmYWxzZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlZHJhdyAhPSAnYm9vbGVhbicpIHRocm93IG5ldyBUeXBlRXJyb3IoUmVzb3VyY2VzLlBBUkFNRVRFUlNfVFlQRV9FUlJPUik7XG4gICAgICAgICAgICAgICAgICAgIGxldCBidWxsZXRTY3JlZW5UeXBlID0gSGVscGVyLmNsb25lKF9idWxsZXRTY3JlZW5UeXBlKTtcbiAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuVHlwZS5zdHlsZSA9IF9vcHRpb25zVHlwZS5kZWZhdWx0U3R5bGU7XG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLmJ1bGxldFNjcmVlbiA9IEhlbHBlci5zZXRWYWx1ZXMoYnVsbGV0U2NyZWVuLCBidWxsZXRTY3JlZW5PblNjcmVlbi5idWxsZXRTY3JlZW4sIGJ1bGxldFNjcmVlblR5cGUpOyAvL+iuvue9ruWAvFxuICAgICAgICAgICAgICAgICAgICBpZiAocmVkcmF3ID09PSB0cnVlKSBfcmVuZGVyZXIucmVDcmVhdEFuZGdldFdpZHRoKGJ1bGxldFNjcmVlbk9uU2NyZWVuKTsgLy/ph43mlrDliJvlu7rlubbnu5jliLblvLnluZVcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFfcGxheWluZyAmJiByZWRyYXcpIF9yZW5kZXJlci5kcmF3KCk7IC8v6Z2e5pKt5pS+54q25oCB5YiZ6YeN57uYXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiDojrflj5blvJXlj5Hkuovku7bnmoTlvLnluZXnmoTmkq3mlL7nirbmgIFcbiAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSDlj5blvJXlj5Hkuovku7bnmoTlvLnluZXmmK/lkKblnKjmkq3mlL4v56e75Yqo77ya5aaC5p6c6K6+572u5Li6IHRydWUg5YiZ6K+l5by55bmV5pqC5YGc77yM55u05Yiw5bCG5q2k5Y+C5pWw6K6+5Li6IGZhbHNlIOaIluiwg+eUqCB7QGxpbmsgb3BlbkJTRS5CdWxsZXRTY3JlZW5FbmdpbmUjcGxheUFsbEJ1bGxldFNjcmVlbnN9IOaWueazleOAglxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGdldFBsYXlTdGF0ZTogKCkgPT4gIWJ1bGxldFNjcmVlbk9uU2NyZWVuLnBhdXNlLFxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIOiuvue9ruW8leWPkeS6i+S7tueahOW8ueW5leeahOaSreaUvueKtuaAgVxuICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtib29sZWFufSBwYWx5IC0g5piv5ZCm57un57ut5pKt5pS+L+enu+WKqOW8leWPkeS6i+S7tueahOW8ueW5le+8muivu+WPluatpOWPguaVsOWPr+WIpOaWrei/meadoeW8ueW5leaYr+WQpuWkhOS6juaaguWBnOeKtuaAgeOAglxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHNldFBsYXlTdGF0ZTogKHBsYXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwbGF5ICE9ICdib29sZWFuJykgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuUEFSQU1FVEVSU19UWVBFX0VSUk9SKTtcbiAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4ucGF1c2UgPSAhcGxheTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNjcmVlblg6IGUuc2NyZWVuWCwgc2NyZWVuWTogZS5zY3JlZW5ZLFxuICAgICAgICAgICAgICAgIHBhZ2VYOiBlLnBhZ2VYLCBwYWdlWTogZS5wYWdlWSxcbiAgICAgICAgICAgICAgICBjbGllbnRYOiBlLmNsaWVudFgsIGNsaWVudFk6IGUuY2xpZW50WVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yi35paw5by55bmV5Ye95pWwXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiByZWZyZXNoKCkge1xuICAgICAgICAgICAgbGV0IG5vd1RpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIGlmIChfbGFzdFJlZnJlc2hUaW1lICE9IG51bGwpXG4gICAgICAgICAgICAgICAgX3JlZnJlc2hSYXRlID0gMSAvIChub3dUaW1lIC0gX2xhc3RSZWZyZXNoVGltZSk7XG4gICAgICAgICAgICBfbGFzdFJlZnJlc2hUaW1lID0gbm93VGltZTtcbiAgICAgICAgICAgIGFkZEJ1bGxldFNjcmVlbnNUb1NjcmVlbigpO1xuICAgICAgICAgICAgbW92ZUJ1bGxldFNjcmVlbk9uU2NyZWVuKCk7XG4gICAgICAgICAgICBfcmVuZGVyZXIuZHJhdygpOyAvL+e7mOWItuW8ueW5lVxuICAgICAgICAgICAgaWYgKF9wbGF5aW5nKVxuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZWZyZXNoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDnp7vliqjlvLnluZXlh73mlbBcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIG1vdmVCdWxsZXRTY3JlZW5PblNjcmVlbigpIHtcbiAgICAgICAgICAgIF9idWxsZXRTY3JlZW5zT25TY3JlZW4uZm9yRWFjaCgoYnVsbGV0U2NyZWVuT25TY3JlZW4pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuT25TY3JlZW4ucGF1c2UpIHJldHVybjsgLy/mmoLlgZznp7vliqhcbiAgICAgICAgICAgICAgICBsZXQgbm93VGltZSA9IF9vcHRpb25zLmNsb2NrKCk7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChidWxsZXRTY3JlZW5PblNjcmVlbi50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgR2VuZXJhbFR5cGUucmlnaHRUb0xlZnQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuT25TY3JlZW4ueCA+IC1idWxsZXRTY3JlZW5PblNjcmVlbi53aWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnggLT0gYnVsbGV0U2NyZWVuT25TY3JlZW4uYnVsbGV0U2NyZWVuLnN0eWxlLnNwZWVkICogX29wdGlvbnMucGxheVNwZWVkIC8gX3JlZnJlc2hSYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JlbmRlcmVyLmRlbGV0ZShidWxsZXRTY3JlZW5PblNjcmVlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgcmVtb3ZlOiB0cnVlIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBHZW5lcmFsVHlwZS5sZWZ0VG9SaWdodDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW5PblNjcmVlbi54IDwgX2VsZW1lbnRTaXplLndpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4ueCArPSBidWxsZXRTY3JlZW5PblNjcmVlbi5idWxsZXRTY3JlZW4uc3R5bGUuc3BlZWQgKiBfb3B0aW9ucy5wbGF5U3BlZWQgLyBfcmVmcmVzaFJhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVuZGVyZXIuZGVsZXRlKGJ1bGxldFNjcmVlbk9uU2NyZWVuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyByZW1vdmU6IHRydWUgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIEdlbmVyYWxUeXBlLnRvcDpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBHZW5lcmFsVHlwZS5ib3R0b206XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuT25TY3JlZW4uZW5kVGltZSA8IG5vd1RpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVuZGVyZXIuZGVsZXRlKGJ1bGxldFNjcmVlbk9uU2NyZWVuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyByZW1vdmU6IHRydWUgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa3u+WKoOW8ueW5leWIsOWxj+W5leWHveaVsFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gYWRkQnVsbGV0U2NyZWVuc1RvU2NyZWVuKCkge1xuICAgICAgICAgICAgaWYgKF9idWxsZXRTY3JlZW5zT25TY3JlZW4uZ2V0TGVuZ3RoKCkgPT09IDApXG4gICAgICAgICAgICAgICAgX2RlbGF5ID0gMDtcbiAgICAgICAgICAgIGxldCB0aW1lcyA9IE1hdGguZmxvb3IoX3JlZnJlc2hSYXRlICogMjAwMCk7XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgbGV0IGJ1bGxldFNjcmVlbiA9IF9idWxsZXRTY3JlZW5zLnBvcChmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW4gPT09IG51bGwpIHJldHVybjtcbiAgICAgICAgICAgICAgICBsZXQgbm93VGltZSA9IF9vcHRpb25zLmNsb2NrKCk7XG4gICAgICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbi5zdGFydFRpbWUgPiBub3dUaW1lKSByZXR1cm47XG4gICAgICAgICAgICAgICAgaWYgKCFfb3B0aW9ucy50aW1lT3V0RGlzY2FyZCB8fCAhYnVsbGV0U2NyZWVuLmNhbkRpc2NhcmQgfHwgYnVsbGV0U2NyZWVuLnN0YXJ0VGltZSA+IG5vd1RpbWUgLSBNYXRoLmZsb29yKDEgLyBfcmVmcmVzaFJhdGUpICogNjApIHtcbiAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuLnN0eWxlID0gSGVscGVyLnNldFZhbHVlcyhidWxsZXRTY3JlZW4uc3R5bGUsIF9vcHRpb25zLmRlZmF1bHRTdHlsZSwgX29wdGlvbnNUeXBlLmRlZmF1bHRTdHlsZSk7IC8v5aGr5YWF6buY6K6k5qC35byPXG4gICAgICAgICAgICAgICAgICAgIGdldEJ1bGxldFNjcmVlbk9uU2NyZWVuKG5vd1RpbWUsIGJ1bGxldFNjcmVlbik7IC8v55Sf5oiQ5bGP5bmV5by55bmV5a+56LGh5bm25re75Yqg5Yiw5bGP5bmV5by55bmV6ZuG5ZCIICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgX2RlbGF5QnVsbGV0U2NyZWVuc0NvdW50Kys7XG4gICAgICAgICAgICAgICAgX2J1bGxldFNjcmVlbnMucG9wKHRydWUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB0aW1lcy0tO1xuICAgICAgICAgICAgfSB3aGlsZSAoX2J1bGxldFNjcmVlbnNPblNjcmVlbi5nZXRMZW5ndGgoKSA9PT0gMCB8fCB0aW1lcyA+IDApO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOeUn+aIkOWxj+W5leW8ueW5leWvueixoeWHveaVsFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gbm93VGltZSAtIOW9k+WJjeaXtumXtFxuICAgICAgICAgKiBAcGFyYW0ge29wZW5CU0V+QnVsbGV0U2NyZWVufSBidWxsZXRTY3JlZW4gLSDlvLnluZVcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdldEJ1bGxldFNjcmVlbk9uU2NyZWVuKG5vd1RpbWUsIGJ1bGxldFNjcmVlbikge1xuICAgICAgICAgICAgX2RlbGF5ID0gbm93VGltZSAtIGJ1bGxldFNjcmVlbi5zdGFydFRpbWU7XG4gICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuT25TY3JlZW4gPSB7fTtcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnBhdXNlID0gZmFsc2U7IC8v5piv5ZCm5pqC5YGc56e75YqoXG4gICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi5idWxsZXRTY3JlZW4gPSBidWxsZXRTY3JlZW47XG4gICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi5zdGFydFRpbWUgPSBub3dUaW1lOyAvL+W8ueW5leWktOmDqOi/m+Wxj+W5leaXtumXtFxuICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4uc2l6ZSA9IGJ1bGxldFNjcmVlbi5zdHlsZS5zaXplOyAvL+Wtl+S9k+Wkp+Wwj++8muWDj+e0oFxuICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4udHlwZSA9IGJ1bGxldFNjcmVlbi50eXBlOyAvL+W8ueW5leexu+Wei1xuICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4uaGVpZ2h0ID0gYnVsbGV0U2NyZWVuT25TY3JlZW4uc2l6ZTsgLy/lvLnluZXnmoTpq5jluqbvvJrlg4/ntKBcbiAgICAgICAgICAgIF9yZW5kZXJlci5jcmVhdEFuZGdldFdpZHRoKGJ1bGxldFNjcmVlbk9uU2NyZWVuKTsgLy/liJvlu7rlvLnluZXlhYPntKDlubborqHnrpflrr3luqZcbiAgICAgICAgICAgIHN3aXRjaCAoYnVsbGV0U2NyZWVuLnR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIEdlbmVyYWxUeXBlLnJpZ2h0VG9MZWZ0OlxuICAgICAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi5lbmRUaW1lID0gTWF0aC5yb3VuZChub3dUaW1lICsgKF9lbGVtZW50U2l6ZS53aWR0aCArIGJ1bGxldFNjcmVlbk9uU2NyZWVuLndpZHRoKSAvIChidWxsZXRTY3JlZW4uc3R5bGUuc3BlZWQgKiBfb3B0aW9ucy5wbGF5U3BlZWQpKTsgLy/lvLnluZXlsL7pg6jlh7rlsY/luZXnmoTml7bpl7RcbiAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4ueCA9IF9lbGVtZW50U2l6ZS53aWR0aDsgLy/lvLnluZXliJ3lp4tY5Z2Q5qCHXG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnkgPSBfb3B0aW9ucy52ZXJ0aWNhbEludGVydmFsOyAvL+W8ueW5leWIneWni1nlnZDmoIdcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBHZW5lcmFsVHlwZS5sZWZ0VG9SaWdodDpcbiAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4uZW5kVGltZSA9IE1hdGgucm91bmQobm93VGltZSArIChfZWxlbWVudFNpemUud2lkdGggKyBidWxsZXRTY3JlZW5PblNjcmVlbi53aWR0aCkgLyAoYnVsbGV0U2NyZWVuLnN0eWxlLnNwZWVkICogX29wdGlvbnMucGxheVNwZWVkKSk7IC8v5by55bmV5bC+6YOo5Ye65bGP5bmV55qE5pe26Ze0XG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnggPSAtYnVsbGV0U2NyZWVuT25TY3JlZW4ud2lkdGg7IC8v5by55bmV5Yid5aeLWOWdkOagh1xuICAgICAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi55ID0gX29wdGlvbnMudmVydGljYWxJbnRlcnZhbDsgLy/lvLnluZXliJ3lp4tZ5Z2Q5qCHXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgR2VuZXJhbFR5cGUudG9wOlxuICAgICAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi5lbmRUaW1lID0gYnVsbGV0U2NyZWVuT25TY3JlZW4uc3RhcnRUaW1lICsgYnVsbGV0U2NyZWVuLnN0eWxlLnJlc2lkZW5jZVRpbWUgKiBfb3B0aW9ucy5wbGF5U3BlZWQ7XG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnggPSBNYXRoLnJvdW5kKChfZWxlbWVudFNpemUud2lkdGggLSBidWxsZXRTY3JlZW5PblNjcmVlbi53aWR0aCkgLyAyKTsgLy/lvLnluZXliJ3lp4tY5Z2Q5qCHXG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnkgPSBfb3B0aW9ucy52ZXJ0aWNhbEludGVydmFsOyAvL+W8ueW5leWIneWni1nlnZDmoIdcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBHZW5lcmFsVHlwZS5ib3R0b206XG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLmVuZFRpbWUgPSBidWxsZXRTY3JlZW5PblNjcmVlbi5zdGFydFRpbWUgKyBidWxsZXRTY3JlZW4uc3R5bGUucmVzaWRlbmNlVGltZSAqIF9vcHRpb25zLnBsYXlTcGVlZDtcbiAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4ueCA9IE1hdGgucm91bmQoKF9lbGVtZW50U2l6ZS53aWR0aCAtIGJ1bGxldFNjcmVlbk9uU2NyZWVuLndpZHRoKSAvIDIpOyAvL+W8ueW5leWIneWni1jlnZDmoIdcbiAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4ueSA9IC1fb3B0aW9ucy52ZXJ0aWNhbEludGVydmFsIC0gYnVsbGV0U2NyZWVuT25TY3JlZW4uaGVpZ2h0OyAvL+W8ueW5leWIneWni1nlnZDmoIdcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgb2xkTGVuZ3RoID0gX2J1bGxldFNjcmVlbnNPblNjcmVlbi5nZXRMZW5ndGgoKTtcbiAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW4udHlwZSA9PT0gR2VuZXJhbFR5cGUudG9wIHx8IGJ1bGxldFNjcmVlbi50eXBlID09PSBHZW5lcmFsVHlwZS5ib3R0b20pIHtcbiAgICAgICAgICAgICAgICBfYnVsbGV0U2NyZWVuc09uU2NyZWVuLmZvckVhY2goKG5leHRCdWxsZXRTY3JlZW5PblNjcmVlbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvL+W8ueW5leS4jeWcqOa1geS4re+8jOaYr+WbuuWumuW8ueW5lVxuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEJ1bGxldFNjcmVlbk9uU2NyZWVuLmJ1bGxldFNjcmVlbi50eXBlICE9IGJ1bGxldFNjcmVlbi50eXBlKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuOyAvL+S4jeaYr+WQjOS4gOenjeexu+Wei+eahOW8ueW5lVxuICAgICAgICAgICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuLnR5cGUgPT09IEdlbmVyYWxUeXBlLnRvcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpzmlrDlvLnluZXlnKjlvZPliY3lvLnluZXkuIrmlrnkuJTmnKrkuI7lvZPliY3lvLnluZXph43lj6BcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW5PblNjcmVlbi55ICsgYnVsbGV0U2NyZWVuT25TY3JlZW4uaGVpZ2h0IDwgbmV4dEJ1bGxldFNjcmVlbk9uU2NyZWVuLnkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgYWRkOiB7IGFkZFRvVXA6IHRydWUsIGVsZW1lbnQ6IHNldEFjdHVhbFkoYnVsbGV0U2NyZWVuT25TY3JlZW4pIH0sIHN0b3A6IHRydWUgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5aaC5p6c5LiK5LiA5p2h5by55bmV55qE5raI5aSx5pe26Ze05bCP5LqO5b2T5YmN5by55bmV55qE5Ye6546w5pe26Ze0XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEJ1bGxldFNjcmVlbk9uU2NyZWVuLmVuZFRpbWUgPCBub3dUaW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnkgPSBuZXh0QnVsbGV0U2NyZWVuT25TY3JlZW4ueTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi55ID0gbmV4dEJ1bGxldFNjcmVlbk9uU2NyZWVuLnkgKyBuZXh0QnVsbGV0U2NyZWVuT25TY3JlZW4uaGVpZ2h0ICsgX29wdGlvbnMudmVydGljYWxJbnRlcnZhbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5aaC5p6c5paw5by55bmV5Zyo5b2T5YmN5by55bmV5LiL5pa55LiU5pyq5LiO5b2T5YmN5by55bmV6YeN5Y+gXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuT25TY3JlZW4ueSA+IG5leHRCdWxsZXRTY3JlZW5PblNjcmVlbi55ICsgbmV4dEJ1bGxldFNjcmVlbk9uU2NyZWVuLmhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGFkZDogeyBhZGRUb1VwOiB0cnVlLCBlbGVtZW50OiBzZXRBY3R1YWxZKGJ1bGxldFNjcmVlbk9uU2NyZWVuKSB9LCBzdG9wOiB0cnVlIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WmguaenOS4iuS4gOadoeW8ueW5leeahOa2iOWkseaXtumXtOWwj+S6juW9k+WJjeW8ueW5leeahOWHuueOsOaXtumXtFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRCdWxsZXRTY3JlZW5PblNjcmVlbi5lbmRUaW1lIDwgbm93VGltZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi55ID0gbmV4dEJ1bGxldFNjcmVlbk9uU2NyZWVuLnk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4ueSA9IG5leHRCdWxsZXRTY3JlZW5PblNjcmVlbi55IC0gYnVsbGV0U2NyZWVuT25TY3JlZW4uaGVpZ2h0IC0gX29wdGlvbnMudmVydGljYWxJbnRlcnZhbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy/lvZPliY3lvLnluZXnu4/ov4fkuIDkuKrngrnpnIDopoHnmoTmgLvml7bplb9cbiAgICAgICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuT25TY3JlZW5XaWR0aFRpbWUgPSBidWxsZXRTY3JlZW5PblNjcmVlbi53aWR0aCAvIChidWxsZXRTY3JlZW4uc3R5bGUuc3BlZWQgKiBfb3B0aW9ucy5wbGF5U3BlZWQpO1xuICAgICAgICAgICAgICAgIF9idWxsZXRTY3JlZW5zT25TY3JlZW4uZm9yRWFjaCgobmV4dEJ1bGxldFNjcmVlbk9uU2NyZWVuKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8v5by55bmV5Zyo5rWB5Lit77yM5piv56e75Yqo5by55bmVXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0QnVsbGV0U2NyZWVuT25TY3JlZW4uYnVsbGV0U2NyZWVuLnR5cGUgPT09IEdlbmVyYWxUeXBlLnRvcCB8fCBuZXh0QnVsbGV0U2NyZWVuT25TY3JlZW4uYnVsbGV0U2NyZWVuLnR5cGUgPT09IEdlbmVyYWxUeXBlLmJvdHRvbSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjsgLy/lvLnluZXkuI3lnKjmtYHkuK3vvIzkuLrlm7rlrprlvLnluZVcbiAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpzmlrDlvLnluZXlnKjlvZPliY3lvLnluZXkuIrmlrnkuJTmnKrkuI7lvZPliY3lvLnluZXph43lj6BcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbk9uU2NyZWVuLnkgKyBidWxsZXRTY3JlZW5PblNjcmVlbi5oZWlnaHQgPCBuZXh0QnVsbGV0U2NyZWVuT25TY3JlZW4ueSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGFkZDogeyBhZGRUb1VwOiB0cnVlLCBlbGVtZW50OiBzZXRBY3R1YWxZKGJ1bGxldFNjcmVlbk9uU2NyZWVuKSB9LCBzdG9wOiB0cnVlIH07XG4gICAgICAgICAgICAgICAgICAgIC8v5LiK5LiA5p2h5by55bmV57uP6L+H5LiA5Liq54K56ZyA6KaB55qE5oC75pe26ZW/XG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXh0QnVsbGV0U2NyZWVuT25TY3JlZW5XaWR0aFRpbWUgPSBuZXh0QnVsbGV0U2NyZWVuT25TY3JlZW4ud2lkdGggLyAobmV4dEJ1bGxldFNjcmVlbk9uU2NyZWVuLmJ1bGxldFNjcmVlbi5zdHlsZS5zcGVlZCAqIF9vcHRpb25zLnBsYXlTcGVlZCk7XG4gICAgICAgICAgICAgICAgICAgIC8v5aaC5p6c5LiK5LiA5p2h5by55bmV55qE5raI5aSx5pe26Ze05bCP5LqO5b2T5YmN5by55bmV55qE5Ye6546w5pe26Ze0XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0QnVsbGV0U2NyZWVuT25TY3JlZW4uc3RhcnRUaW1lICsgbmV4dEJ1bGxldFNjcmVlbk9uU2NyZWVuV2lkdGhUaW1lID49IG5vd1RpbWUgfHwgLy/lpoLmnpzkuIrkuIDmnaHlvLnluZXnmoTlpLTov5vlhaXkuobvvIzkvYbmmK/lsL7ov5jmsqHov5vlhaVcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRCdWxsZXRTY3JlZW5PblNjcmVlbi5lbmRUaW1lID49IGJ1bGxldFNjcmVlbk9uU2NyZWVuLmVuZFRpbWUgLSBidWxsZXRTY3JlZW5PblNjcmVlbldpZHRoVGltZSkgLy/lpoLmnpzlvZPliY3lvLnluZXlpLTlh7rljrvkuobvvIzkuIrkuIDmnaHlvLnluZXlsL7ov5jmsqHlh7rljrtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnkgPSBuZXh0QnVsbGV0U2NyZWVuT25TY3JlZW4ueSArIG5leHRCdWxsZXRTY3JlZW5PblNjcmVlbi5oZWlnaHQgKyBfb3B0aW9ucy52ZXJ0aWNhbEludGVydmFsO1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi55ID0gbmV4dEJ1bGxldFNjcmVlbk9uU2NyZWVuLnk7XG4gICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoX2J1bGxldFNjcmVlbnNPblNjcmVlbi5nZXRMZW5ndGgoKSA9PT0gb2xkTGVuZ3RoKVxuICAgICAgICAgICAgICAgIF9idWxsZXRTY3JlZW5zT25TY3JlZW4ucHVzaChzZXRBY3R1YWxZKGJ1bGxldFNjcmVlbk9uU2NyZWVuKSwgZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiuvue9ruecn+WunueahFnlnZDmoIdcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGJ1bGxldFNjcmVlbk9uU2NyZWVuIC0g5bGP5bmV5by55bmV5LqL5Lu2XG4gICAgICAgICAqIEByZXR1cm5zIHtvYmplY3R9IOWxj+W5leW8ueW5leS6i+S7tlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc2V0QWN0dWFsWShidWxsZXRTY3JlZW5PblNjcmVlbikge1xuICAgICAgICAgICAgbGV0IGJ1bGxldFNjcmVlbiA9IGJ1bGxldFNjcmVlbk9uU2NyZWVuLmJ1bGxldFNjcmVlbjtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW4udHlwZSA9PT0gR2VuZXJhbFR5cGUubGVmdFRvUmlnaHQgfHxcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW4udHlwZSA9PT0gR2VuZXJhbFR5cGUucmlnaHRUb0xlZnQgfHxcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW4udHlwZSA9PT0gR2VuZXJhbFR5cGUudG9wXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi5hY3R1YWxZID0gYnVsbGV0U2NyZWVuT25TY3JlZW4ueSAlIChfZWxlbWVudFNpemUuaGVpZ2h0IC0gYnVsbGV0U2NyZWVuT25TY3JlZW4uaGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGJ1bGxldFNjcmVlbi50eXBlID09PSBHZW5lcmFsVHlwZS5ib3R0b20pIHtcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi5hY3R1YWxZID0gX2VsZW1lbnRTaXplLmhlaWdodCArIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnkgJSBfZWxlbWVudFNpemUuaGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGJ1bGxldFNjcmVlbk9uU2NyZWVuO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiuvue9ruWwuuWvuFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc2V0U2l6ZSgpIHtcbiAgICAgICAgICAgIGxldCBkZXZpY2VQaXhlbFJhdGlvID0gSGVscGVyLmdldERldmljZVBpeGVsUmF0aW8oKTtcbiAgICAgICAgICAgIGlmIChfb2xkRGV2aWNlUGl4ZWxSYXRpbyAhPSBkZXZpY2VQaXhlbFJhdGlvIHx8XG4gICAgICAgICAgICAgICAgX29sZENsaWVudFdpZHRoICE9IGVsZW1lbnQuY2xpZW50V2lkdGggfHxcbiAgICAgICAgICAgICAgICBfb2xkQ2xpZW50SGVpZ2h0ICE9IGVsZW1lbnQuY2xpZW50SGVpZ2h0IHx8XG4gICAgICAgICAgICAgICAgX29sZFNjYWxpbmcgIT0gX29wdGlvbnMuc2NhbGluZykge1xuICAgICAgICAgICAgICAgIF9vbGRTY2FsaW5nID0gX29wdGlvbnMuc2NhbGluZztcbiAgICAgICAgICAgICAgICBfZWxlbWVudFNpemUud2lkdGggPSBlbGVtZW50LmNsaWVudFdpZHRoIC8gX29wdGlvbnMuc2NhbGluZztcbiAgICAgICAgICAgICAgICBfZWxlbWVudFNpemUuaGVpZ2h0ID0gZWxlbWVudC5jbGllbnRIZWlnaHQgLyBfb3B0aW9ucy5zY2FsaW5nO1xuICAgICAgICAgICAgICAgIF9vbGRDbGllbnRXaWR0aCA9IGVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgICAgICAgICAgX29sZENsaWVudEhlaWdodCA9IGVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgICAgIF9vbGREZXZpY2VQaXhlbFJhdGlvID0gZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICAgICAgICBfcmVuZGVyZXIuc2V0U2l6ZSgpO1xuICAgICAgICAgICAgICAgIGlmICghX3BsYXlpbmcpIF9yZW5kZXJlci5kcmF3KCk7IC8v6Z2e5pKt5pS+54q25oCB5YiZ6YeN57uYXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL0lFIEVkZ2Ug5rWP6KeI5Zmo5LiN5pSv5oyBICVjXG4gICAgICAgIGlmICghIXdpbmRvdy5BY3RpdmVYT2JqZWN0IHx8IFwiQWN0aXZlWE9iamVjdFwiIGluIHdpbmRvdyB8fCBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJUcmlkZW50XCIpID4gLTEgfHxcbiAgICAgICAgICAgIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUVcIikgPiAtMSB8fCBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJFZGdlXCIpID4gLTEpIGNvbnNvbGUuaW5mbyhcbiAgICAgICAgICAgICAgICBSZXNvdXJjZXMuTE9BREVEX0lORk9fSUUuZmlsbERhdGEoYnVpbGQpXG4gICAgICAgICAgICApO1xuICAgICAgICAvL090aGVyXG4gICAgICAgIGVsc2UgY29uc29sZS5pbmZvKFxuICAgICAgICAgICAgUmVzb3VyY2VzLkxPQURFRF9JTkZPLmZpbGxEYXRhKGJ1aWxkKSxcbiAgICAgICAgICAgICdmb250LXdlaWdodDpib2xkOyBjb2xvcjojMDA5OUZGOycsICcnLCAnZm9udC1zdHlsZTppdGFsaWM7JywgJydcbiAgICAgICAgKTtcbiAgICB9XG59XG4iXSwiZmlsZSI6ImVuZ2luZXMvZ2VuZXJhbEVuZ2luZS5qcyJ9
