"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BulletScreenEngine = void 0;

require("core-js/modules/es6.array.index-of");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.for-each");

require("core-js/modules/es6.function.bind");

var _linkedList = require("./lib/linkedList");

var _event2 = require("./lib/event");

var _renderersFactory = require("./lib/renderers/renderersFactory");

var _bulletScreenType2 = require("./bulletScreenType");

var _helper = require("./lib/helper");

var _resources = require("./lib/resources");

var build = _interopRequireWildcard(require("./build.json"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** 
 * 弹幕引擎对象类 
 * @alias openBSE.BulletScreenEngine
 * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误。
 * @throws {TypeError} 传入的参数错误时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
 */
var BulletScreenEngine =
/**
 * 创建一个弹幕引擎对象。
 * @param {Element} element - 要加载弹幕的元素：有关 Element 接口的信息请参阅MDN [Element]{@link https://developer.mozilla.org/zh-CN/docs/Web/API/Element} 。
 * @param {openBSE~Options} [_options] - 全局选项：一个 {@link openBSE~Options} 结构。
 * @param {string} [renderMode="canvas"] - 渲染模式：默认为“canvas”, “可选css3”， “webgl”和“svg”。一般建议使用“canvas”（特别是 FireFox 浏览器 CSS3 渲染效率较低）。在一些版本较老的浏览器中“window.devicePixelRatio”变量不被支持或支持不完整，这会导致在高DPI和页面被缩放的情况下“canvas”和“webgl”渲染模式弹幕显示不正常的情况（弹幕模糊），此时建议使用“css3”渲染模式。
 */
function BulletScreenEngine(element, options) {
  var renderMode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'canvas';

  _classCallCheck(this, BulletScreenEngine);

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

  var _bulletScreens = new _linkedList.LinkedList();
  /**
   * 屏幕上的弹幕
   * @private @type {LinkedList}
   */


  var _bulletScreensOnScreen = new _linkedList.LinkedList();
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
    type: _bulletScreenType2.BulletScreenType.rightToLeft,

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
    console.warn(_resources.Resources.REQUESTANIMATIONFRAME_NOT_SUPPORT_WARN);

    requestAnimationFrame = function requestAnimationFrame(fun) {
      return window.setTimeout(fun, 17);
    };
  }
  _options = _helper.Helper.setValues(options, _defaultOptions, _optionsType);

  var _event = new _event2.Event();
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

  var _oldDevicePixelRatio = _helper.Helper.getDevicePixelRatio();

  var _oldScaling = _options.scaling;
  var _oldClientWidth = element.clientWidth;
  var _oldClientHeight = element.clientHeight;
  var _oldHiddenTypes = _options.hiddenTypes;
  var _oldOpacity = _options.opacity;
  var renderersFactory = new _renderersFactory.RenderersFactory(element, _options, _elementSize, bulletScreenEventTrigger);

  var _renderer = renderersFactory.getRenderer(renderMode);

  setInterval(setSize, 100);
  /**
   * 设置全局选项
   * @param {openBSE~Options} options - 全局选项：一个 {@link openBSE~Options} 结构。
   * @throws {TypeError} 传入的参数错误时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
   */

  this.setOptions = function (options) {
    _options = _helper.Helper.setValues(options, _options, _optionsType, false);

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
    bulletScreen = _helper.Helper.setValues(bulletScreen, _defaultBulletScreen, _bulletScreenType);
    if (bulletScreen.type != _bulletScreenType2.BulletScreenType.leftToRight && bulletScreen.type != _bulletScreenType2.BulletScreenType.rightToLeft && bulletScreen.type != _bulletScreenType2.BulletScreenType.top && bulletScreen.type != _bulletScreenType2.BulletScreenType.bottom) throw new TypeError(_resources.Resources.PARAMETERS_TYPE_ERROR);

    _helper.Helper.checkTypes(bulletScreen.style, _optionsType.defaultStyle);

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
        return _helper.Helper.clone(bulletScreenOnScreen.bulletScreen);
      },

      /**
       * 设置引发事件的弹幕弹幕的数据
       * @private
       * @param {openBSE~BulletScreen} bulletScreen - 引发事件的弹幕的数据：一个 {@link openBSE~BulletScreen} 结构。设置此参数以便动态调整弹幕样式，但是一些参数在事件中修改无效，查看此结构的说明以了解详情。
       * @param {boolean} [redraw=false] - 是否重绘弹幕：此参数在每次引发事件时的初始值为 false ，如果修改了 bulletScreen 中的值，此参数必须设为 true 。
       */
      setBulletScreen: function setBulletScreen(bulletScreen) {
        var redraw = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        if (typeof redraw != 'boolean') throw new TypeError(_resources.Resources.PARAMETERS_TYPE_ERROR);

        var bulletScreenType = _helper.Helper.clone(_bulletScreenType);

        bulletScreenType.style = _optionsType.defaultStyle;
        bulletScreenOnScreen.bulletScreen = _helper.Helper.setValues(bulletScreen, bulletScreenOnScreen.bulletScreen, bulletScreenType);
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
        if (typeof play != 'boolean') throw new TypeError(_resources.Resources.PARAMETERS_TYPE_ERROR);
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
        case _bulletScreenType2.BulletScreenType.rightToLeft:
          if (bulletScreenOnScreen.x > -bulletScreenOnScreen.width) {
            bulletScreenOnScreen.x -= bulletScreenOnScreen.bulletScreen.style.speed * _options.playSpeed / _refreshRate;
          } else {
            _renderer.delete(bulletScreenOnScreen);

            return {
              remove: true
            };
          }

          break;

        case _bulletScreenType2.BulletScreenType.leftToRight:
          if (bulletScreenOnScreen.x < _elementSize.width) {
            bulletScreenOnScreen.x += bulletScreenOnScreen.bulletScreen.style.speed * _options.playSpeed / _refreshRate;
          } else {
            _renderer.delete(bulletScreenOnScreen);

            return {
              remove: true
            };
          }

          break;

        case _bulletScreenType2.BulletScreenType.top:
        case _bulletScreenType2.BulletScreenType.bottom:
          if (bulletScreenOnScreen.endTime < nowTime) {
            _renderer.delete(bulletScreenOnScreen);

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
        bulletScreen.style = _helper.Helper.setValues(bulletScreen.style, _options.defaultStyle, _optionsType.defaultStyle);
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
      case _bulletScreenType2.BulletScreenType.rightToLeft:
        bulletScreenOnScreen.endTime = Math.round(nowTime + (_elementSize.width + bulletScreenOnScreen.width) / (bulletScreen.style.speed * _options.playSpeed));
        bulletScreenOnScreen.x = _elementSize.width;
        bulletScreenOnScreen.y = _options.verticalInterval;
        break;

      case _bulletScreenType2.BulletScreenType.leftToRight:
        bulletScreenOnScreen.endTime = Math.round(nowTime + (_elementSize.width + bulletScreenOnScreen.width) / (bulletScreen.style.speed * _options.playSpeed));
        bulletScreenOnScreen.x = -bulletScreenOnScreen.width;
        bulletScreenOnScreen.y = _options.verticalInterval;
        break;

      case _bulletScreenType2.BulletScreenType.top:
        bulletScreenOnScreen.endTime = bulletScreenOnScreen.startTime + bulletScreen.style.residenceTime * _options.playSpeed;
        bulletScreenOnScreen.x = Math.round((_elementSize.width - bulletScreenOnScreen.width) / 2);
        bulletScreenOnScreen.y = _options.verticalInterval;
        break;

      case _bulletScreenType2.BulletScreenType.bottom:
        bulletScreenOnScreen.endTime = bulletScreenOnScreen.startTime + bulletScreen.style.residenceTime * _options.playSpeed;
        bulletScreenOnScreen.x = Math.round((_elementSize.width - bulletScreenOnScreen.width) / 2);
        bulletScreenOnScreen.y = -_options.verticalInterval - bulletScreenOnScreen.height;
        break;
    }

    var oldLength = _bulletScreensOnScreen.getLength();

    if (bulletScreen.type === _bulletScreenType2.BulletScreenType.top || bulletScreen.type === _bulletScreenType2.BulletScreenType.bottom) {
      _bulletScreensOnScreen.forEach(function (nextBulletScreenOnScreen) {
        if (nextBulletScreenOnScreen.bulletScreen.type != bulletScreen.type) return;

        if (bulletScreen.type === _bulletScreenType2.BulletScreenType.top) {
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
        if (nextBulletScreenOnScreen.bulletScreen.type === _bulletScreenType2.BulletScreenType.top || nextBulletScreenOnScreen.bulletScreen.type === _bulletScreenType2.BulletScreenType.bottom) return;
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

    if (bulletScreen.type === _bulletScreenType2.BulletScreenType.leftToRight || bulletScreen.type === _bulletScreenType2.BulletScreenType.rightToLeft || bulletScreen.type === _bulletScreenType2.BulletScreenType.top) {
      bulletScreenOnScreen.actualY = bulletScreenOnScreen.y % (_elementSize.height - bulletScreenOnScreen.height);
    } else if (bulletScreen.type === _bulletScreenType2.BulletScreenType.bottom) {
      bulletScreenOnScreen.actualY = _elementSize.height + bulletScreenOnScreen.y % _elementSize.height;
    }

    return bulletScreenOnScreen;
  }
  /**
   * 设置尺寸
   * @private
   */


  function setSize() {
    var devicePixelRatio = _helper.Helper.getDevicePixelRatio();

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

  if (!!window.ActiveXObject || "ActiveXObject" in window || navigator.userAgent.indexOf("Trident") > -1 || navigator.userAgent.indexOf("MSIE") > -1 || navigator.userAgent.indexOf("Edge") > -1) console.info(_resources.Resources.LOADED_INFO_IE.fillData(build));else console.info(_resources.Resources.LOADED_INFO.fillData(build), 'font-weight:bold; color:#0099FF;', '', 'font-style:italic;', '');
};

exports.BulletScreenEngine = BulletScreenEngine;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1bGxldFNjcmVlbkVuZ2luZS5qcyJdLCJuYW1lcyI6WyJCdWxsZXRTY3JlZW5FbmdpbmUiLCJlbGVtZW50Iiwib3B0aW9ucyIsInJlbmRlck1vZGUiLCJfc3RhcnRUaW1lIiwiX3BhdXNlVGltZSIsIl9idWxsZXRTY3JlZW5zIiwiTGlua2VkTGlzdCIsIl9idWxsZXRTY3JlZW5zT25TY3JlZW4iLCJfZGVsYXlCdWxsZXRTY3JlZW5zQ291bnQiLCJfZGVsYXkiLCJfcGxheWluZyIsIl9yZWZyZXNoUmF0ZSIsIl9sYXN0UmVmcmVzaFRpbWUiLCJfb3B0aW9ucyIsIl9kZWZhdWx0T3B0aW9ucyIsInZlcnRpY2FsSW50ZXJ2YWwiLCJwbGF5U3BlZWQiLCJjbG9jayIsInRpbWUiLCJEYXRlIiwiZ2V0VGltZSIsInNjYWxpbmciLCJ0aW1lT3V0RGlzY2FyZCIsImhpZGRlblR5cGVzIiwib3BhY2l0eSIsImN1cnNvck9uTW91c2VPdmVyIiwiZGVmYXVsdFN0eWxlIiwic2hhZG93Qmx1ciIsImZvbnRXZWlnaHQiLCJmb250RmFtaWx5Iiwic2l6ZSIsImJveENvbG9yIiwiY29sb3IiLCJib3JkZXJDb2xvciIsInNwZWVkIiwicmVzaWRlbmNlVGltZSIsIl9vcHRpb25zVHlwZSIsIl9kZWZhdWx0QnVsbGV0U2NyZWVuIiwidGV4dCIsImNhbkRpc2NhcmQiLCJzdGFydFRpbWUiLCJ0eXBlIiwiQnVsbGV0U2NyZWVuVHlwZSIsInJpZ2h0VG9MZWZ0IiwibGF5ZXIiLCJfYnVsbGV0U2NyZWVuVHlwZSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIndpbmRvdyIsImNvbnNvbGUiLCJ3YXJuIiwiUmVzb3VyY2VzIiwiUkVRVUVTVEFOSU1BVElPTkZSQU1FX05PVF9TVVBQT1JUX1dBUk4iLCJmdW4iLCJzZXRUaW1lb3V0IiwiSGVscGVyIiwic2V0VmFsdWVzIiwiX2V2ZW50IiwiRXZlbnQiLCJhZGQiLCJiaW5kIiwidW5iaW5kIiwiX2VsZW1lbnRTaXplIiwid2lkdGgiLCJjbGllbnRXaWR0aCIsImhlaWdodCIsImNsaWVudEhlaWdodCIsIl9vbGREZXZpY2VQaXhlbFJhdGlvIiwiZ2V0RGV2aWNlUGl4ZWxSYXRpbyIsIl9vbGRTY2FsaW5nIiwiX29sZENsaWVudFdpZHRoIiwiX29sZENsaWVudEhlaWdodCIsIl9vbGRIaWRkZW5UeXBlcyIsIl9vbGRPcGFjaXR5IiwicmVuZGVyZXJzRmFjdG9yeSIsIlJlbmRlcmVyc0ZhY3RvcnkiLCJidWxsZXRTY3JlZW5FdmVudFRyaWdnZXIiLCJfcmVuZGVyZXIiLCJnZXRSZW5kZXJlciIsInNldEludGVydmFsIiwic2V0U2l6ZSIsInNldE9wdGlvbnMiLCJkcmF3Iiwic2V0T3BhY2l0eSIsImdldE9wdGlvbnMiLCJhZGRCdWxsZXRTY3JlZW4iLCJidWxsZXRTY3JlZW4iLCJsZWZ0VG9SaWdodCIsInRvcCIsImJvdHRvbSIsIlR5cGVFcnJvciIsIlBBUkFNRVRFUlNfVFlQRV9FUlJPUiIsImNoZWNrVHlwZXMiLCJzdHlsZSIsIm9sZExlbmd0aCIsImdldExlbmd0aCIsImZvckVhY2giLCJsYXN0QnVsbGV0U2NyZWVuIiwiYWRkVG9VcCIsInN0b3AiLCJwdXNoIiwicGxheSIsInJlZnJlc2giLCJwbGF5QWxsQnVsbGV0U2NyZWVucyIsImJ1bGxldFNjcmVlbk9uU2NyZWVuIiwicGF1c2UiLCJjbGVhbkJ1bGxldFNjcmVlbkxpc3QiLCJjbGVhbiIsImNsZWFuU2NyZWVuIiwiaGlkZSIsInNob3ciLCJnZXRWaXNpYmlsaXR5IiwiZ2V0UmVuZGVyTW9kZSIsImdldFBsYXlTdGF0ZSIsImdldERlYnVnSW5mbyIsImJ1bGxldFNjcmVlbnNPblNjcmVlbkNvdW50IiwiYnVsbGV0U2NyZWVuc0NvdW50IiwiZGVsYXkiLCJkZWxheUJ1bGxldFNjcmVlbnNDb3VudCIsImZwcyIsIk1hdGgiLCJmbG9vciIsIm5hbWUiLCJlIiwicGFnZVgiLCJkb2MiLCJkb2N1bWVudCIsImRvY3VtZW50RWxlbWVudCIsImJvZHkiLCJjbGllbnRYIiwic2Nyb2xsTGVmdCIsImNsaWVudExlZnQiLCJwYWdlWSIsImNsaWVudFkiLCJzY3JvbGxUb3AiLCJjbGllbnRUb3AiLCJ0cmlnZ2VyIiwiZ2V0QnVsbGV0U2NyZWVuIiwiY2xvbmUiLCJzZXRCdWxsZXRTY3JlZW4iLCJyZWRyYXciLCJidWxsZXRTY3JlZW5UeXBlIiwicmVDcmVhdEFuZGdldFdpZHRoIiwic2V0UGxheVN0YXRlIiwic2NyZWVuWCIsInNjcmVlblkiLCJub3dUaW1lIiwiYWRkQnVsbGV0U2NyZWVuc1RvU2NyZWVuIiwibW92ZUJ1bGxldFNjcmVlbk9uU2NyZWVuIiwieCIsImRlbGV0ZSIsInJlbW92ZSIsImVuZFRpbWUiLCJ0aW1lcyIsInBvcCIsImdldEJ1bGxldFNjcmVlbk9uU2NyZWVuIiwiY3JlYXRBbmRnZXRXaWR0aCIsInJvdW5kIiwieSIsIm5leHRCdWxsZXRTY3JlZW5PblNjcmVlbiIsInNldEFjdHVhbFkiLCJidWxsZXRTY3JlZW5PblNjcmVlbldpZHRoVGltZSIsIm5leHRCdWxsZXRTY3JlZW5PblNjcmVlbldpZHRoVGltZSIsImFjdHVhbFkiLCJkZXZpY2VQaXhlbFJhdGlvIiwiQWN0aXZlWE9iamVjdCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsImluZGV4T2YiLCJpbmZvIiwiTE9BREVEX0lORk9fSUUiLCJmaWxsRGF0YSIsImJ1aWxkIiwiTE9BREVEX0lORk8iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7SUFNTUEsa0I7QUFDRjs7Ozs7O0FBTUEsNEJBQVlDLE9BQVosRUFBcUJDLE9BQXJCLEVBQXFEO0FBQUEsTUFBdkJDLFVBQXVCLHVFQUFWLFFBQVU7O0FBQUE7O0FBRWpEOzs7O0FBSUEsTUFBSUMsVUFBSjtBQUNBOzs7Ozs7QUFJQSxNQUFJQyxVQUFVLEdBQUcsQ0FBakI7QUFDQTs7Ozs7QUFJQSxNQUFJQyxjQUFjLEdBQUcsSUFBSUMsc0JBQUosRUFBckI7QUFDQTs7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bEMsTUFBTSxDQUFDcUgsYUFBVCxJQUEwQixtQkFBbUJySCxNQUE3QyxJQUF1RHNILFNBQVMsQ0FBQ0MsU0FBVixDQUFvQkMsT0FBcEIsQ0FBNEIsU0FBNUIsSUFBeUMsQ0FBQyxDQUFqRyxJQUNBRixTQUFTLENBQUNDLFNBQVYsQ0FBb0JDLE9BQXBCLENBQTRCLE1BQTVCLElBQXNDLENBQUMsQ0FEdkMsSUFDNENGLFNBQVMsQ0FBQ0MsU0FBVixDQUFvQkMsT0FBcEIsQ0FBNEIsTUFBNUIsSUFBc0MsQ0FBQyxDQUR2RixFQUMwRnZILE9BQU8sQ0FBQ3dILElBQVIsQ0FDbEZ0SCxxQkFBVXVILGNBQVYsQ0FBeUJDLFFBQXpCLENBQWtDQyxLQUFsQyxDQURrRixFQUQxRixLQUtLM0gsT0FBTyxDQUFDd0gsSUFBUixDQUNEdEgscUJBQVUwSCxXQUFWLENBQXNCRixRQUF0QixDQUErQkMsS0FBL0IsQ0FEQyxFQUVELGtDQUZDLEVBRW1DLEVBRm5DLEVBRXVDLG9CQUZ2QyxFQUU2RCxFQUY3RDtBQUlSLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMaW5rZWRMaXN0IH0gZnJvbSAnLi9saWIvbGlua2VkTGlzdCdcbmltcG9ydCB7IEV2ZW50IH0gZnJvbSAnLi9saWIvZXZlbnQnXG5pbXBvcnQgeyBSZW5kZXJlcnNGYWN0b3J5IH0gZnJvbSAnLi9saWIvcmVuZGVyZXJzL3JlbmRlcmVyc0ZhY3RvcnknXG5pbXBvcnQgeyBCdWxsZXRTY3JlZW5UeXBlIH0gZnJvbSAnLi9idWxsZXRTY3JlZW5UeXBlJ1xuaW1wb3J0IHsgSGVscGVyIH0gZnJvbSAnLi9saWIvaGVscGVyJ1xuaW1wb3J0IHsgUmVzb3VyY2VzIH0gZnJvbSAnLi9saWIvcmVzb3VyY2VzJ1xuaW1wb3J0ICogYXMgYnVpbGQgZnJvbSAnLi9idWlsZC5qc29uJ1xuXG4vKiogXG4gKiDlvLnluZXlvJXmk47lr7nosaHnsbsgXG4gKiBAYWxpYXMgb3BlbkJTRS5CdWxsZXRTY3JlZW5FbmdpbmVcbiAqIEB0aHJvd3Mge29wZW5CU0UuQnJvd3Nlck5vdFN1cHBvcnRFcnJvcn0g5rWP6KeI5Zmo5LiN5pSv5oyB54m55a6a5riy5p+T5qih5byP5pe25byV5Y+R6ZSZ6K+v44CCXG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9IOS8oOWFpeeahOWPguaVsOmUmeivr+aXtuW8leWPkemUmeivr+OAguivt+WPgumYhSBNRE4gW1R5cGVFcnJvcl17QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvemgtQ04vZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvVHlwZUVycm9yfSDjgIJcbiAqL1xuY2xhc3MgQnVsbGV0U2NyZWVuRW5naW5lIHtcbiAgICAvKipcbiAgICAgKiDliJvlu7rkuIDkuKrlvLnluZXlvJXmk47lr7nosaHjgIJcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgLSDopoHliqDovb3lvLnluZXnmoTlhYPntKDvvJrmnInlhbMgRWxlbWVudCDmjqXlj6PnmoTkv6Hmga/or7flj4LpmIVNRE4gW0VsZW1lbnRde0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3poLUNOL2RvY3MvV2ViL0FQSS9FbGVtZW50fSDjgIJcbiAgICAgKiBAcGFyYW0ge29wZW5CU0V+T3B0aW9uc30gW19vcHRpb25zXSAtIOWFqOWxgOmAiemhue+8muS4gOS4qiB7QGxpbmsgb3BlbkJTRX5PcHRpb25zfSDnu5PmnoTjgIJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3JlbmRlck1vZGU9XCJjYW52YXNcIl0gLSDmuLLmn5PmqKHlvI/vvJrpu5jorqTkuLrigJxjYW52YXPigJ0sIOKAnOWPr+mAiWNzczPigJ3vvIwg4oCcd2ViZ2zigJ3lkozigJxzdmfigJ3jgILkuIDoiKzlu7rorq7kvb/nlKjigJxjYW52YXPigJ3vvIjnibnliKvmmK8gRmlyZUZveCDmtY/op4jlmaggQ1NTMyDmuLLmn5PmlYjnjofovoPkvY7vvInjgILlnKjkuIDkupvniYjmnKzovoPogIHnmoTmtY/op4jlmajkuK3igJx3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpb+KAneWPmOmHj+S4jeiiq+aUr+aMgeaIluaUr+aMgeS4jeWujOaVtO+8jOi/meS8muWvvOiHtOWcqOmrmERQSeWSjOmhtemdouiiq+e8qeaUvueahOaDheWGteS4i+KAnGNhbnZhc+KAneWSjOKAnHdlYmds4oCd5riy5p+T5qih5byP5by55bmV5pi+56S65LiN5q2j5bi455qE5oOF5Ya177yI5by55bmV5qih57OK77yJ77yM5q2k5pe25bu66K6u5L2/55So4oCcY3NzM+KAnea4suafk+aooeW8j+OAglxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMsIHJlbmRlck1vZGUgPSAnY2FudmFzJykge1xuICAgICAgICAvL+WPmOmHj+WIneWni+WMllxuICAgICAgICAvKipcbiAgICAgICAgICog5byA5aeL5pe26Ze0XG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgX3N0YXJ0VGltZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaaguWBnOaXtumXtFxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9wYXVzZVRpbWUgPSAwO1xuICAgICAgICAvKipcbiAgICAgICAgICog5Ymp5L2Z5by55bmVXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtMaW5rZWRMaXN0fVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9idWxsZXRTY3JlZW5zID0gbmV3IExpbmtlZExpc3QoKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWxj+W5leS4iueahOW8ueW5lVxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7TGlua2VkTGlzdH1cbiAgICAgICAgICovXG4gICAgICAgIGxldCBfYnVsbGV0U2NyZWVuc09uU2NyZWVuID0gbmV3IExpbmtlZExpc3QoKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOW7tui/n+W8ueW5leaAu+aVsFxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9kZWxheUJ1bGxldFNjcmVlbnNDb3VudCA9IDA7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlu7bov5/vvIjljZXkvY3vvJrmr6vnp5LvvIlcbiAgICAgICAgICogQHByaXZhdGUgQHR5cGUge251bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIGxldCBfZGVsYXkgPSAwO1xuICAgICAgICAvKipcbiAgICAgICAgICog5pKt5pS+5qCH5b+XXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtib29sZWFufVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9wbGF5aW5nO1xuICAgICAgICAvKipcbiAgICAgICAgICog5Yi35paw6aKR546HXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgX3JlZnJlc2hSYXRlID0gMC4wNjsgLy/liJ3lp4vliLfmlrDpopHnjodcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOS4iuS4gOasoeWIt+aWsOaXtumXtFxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9sYXN0UmVmcmVzaFRpbWU7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlhajlsYDpgInpoblcbiAgICAgICAgICogQHByaXZhdGUgQHR5cGUge29wZW5CU0V+T3B0aW9uc31cbiAgICAgICAgICovXG4gICAgICAgIGxldCBfb3B0aW9ucztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOm7mOiupOWFqOWxgOWPmOmHj1xuICAgICAgICAgKiBAcHJpdmF0ZSBAcmVhZG9ubHlcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9kZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgICAgIC8qKiDlnoLnm7Tpl7Tot50gKi9cbiAgICAgICAgICAgIHZlcnRpY2FsSW50ZXJ2YWw6IDgsXG4gICAgICAgICAgICAvKiog5pKt5pS+6YCf5bqmKOWAjeaVsCkgKi9cbiAgICAgICAgICAgIHBsYXlTcGVlZDogMSxcbiAgICAgICAgICAgIC8qKiDml7bpl7Tln7rlh4YgKi9cbiAgICAgICAgICAgIGNsb2NrOiB0aW1lID0+IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gX3N0YXJ0VGltZSxcbiAgICAgICAgICAgIC8qKiDnvKnmlL7mr5TkvosgKi9cbiAgICAgICAgICAgIHNjYWxpbmc6IDEsXG4gICAgICAgICAgICAvKiog6LaF5pe25Lii5byDICovXG4gICAgICAgICAgICB0aW1lT3V0RGlzY2FyZDogdHJ1ZSxcbiAgICAgICAgICAgIC8qKiDopoHpmpDol4/nmoTlvLnluZXnsbvlnosgKi9cbiAgICAgICAgICAgIGhpZGRlblR5cGVzOiAwLFxuICAgICAgICAgICAgLyoqIOW8ueW5leS4jemAj+aYjuW6piAqL1xuICAgICAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgICAgIC8qKiDpvKDmoIfnu4/ov4fmoLflvI8gKi9cbiAgICAgICAgICAgIGN1cnNvck9uTW91c2VPdmVyOiAncG9pbnRlcicsXG4gICAgICAgICAgICAvKiog6buY6K6k5by55bmV5qC35byPICovXG4gICAgICAgICAgICBkZWZhdWx0U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAvKiog6Zi05b2x55qE5qih57OK57qn5Yir77yMMOS4uuS4jeaYvuekuumYtOW9sSAqL1xuICAgICAgICAgICAgICAgIHNoYWRvd0JsdXI6IDIsXG4gICAgICAgICAgICAgICAgLyoqIOWtl+S9k+eyl+e7hiAqL1xuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICc2MDAnLFxuICAgICAgICAgICAgICAgIC8qKiDlrZfkvZPns7vliJcgKi9cbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAnc2Fucy1zZXJpZicsXG4gICAgICAgICAgICAgICAgLyoqIOWtl+S9k+Wkp+Wwj++8iOWNleS9je+8muWDj+e0oO+8iSAqL1xuICAgICAgICAgICAgICAgIHNpemU6IDI1LFxuICAgICAgICAgICAgICAgIC8qKiDlpJbmoYbpopzoibIgKi9cbiAgICAgICAgICAgICAgICBib3hDb2xvcjogbnVsbCxcbiAgICAgICAgICAgICAgICAvKiog5a2X5L2T6aKc6ImyICovXG4gICAgICAgICAgICAgICAgY29sb3I6ICd3aGl0ZScsXG4gICAgICAgICAgICAgICAgLyoqIOaPj+i+ueminOiJsiAqL1xuICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiBudWxsLFxuICAgICAgICAgICAgICAgIC8qKiDlvLnluZXpgJ/luqbvvIjljZXkvY3vvJrlg4/ntKAv5q+r56eS77yJIOS7hea1geW8ueW5leexu+Wei+acieaViCAqL1xuICAgICAgICAgICAgICAgIHNwZWVkOiAwLjE1LFxuICAgICAgICAgICAgICAgIC8qKiDlvLnluZXlgZznlZnml7bpl7Qg5LuF5Zu65a6a5by55bmV57G75Z6L5pyJ5pWIICovXG4gICAgICAgICAgICAgICAgcmVzaWRlbmNlVGltZTogNTAwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWFqOWxgOmAiemhueexu+Wei1xuICAgICAgICAgKiBAcHJpdmF0ZSBAcmVhZG9ubHlcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9vcHRpb25zVHlwZSA9IHtcbiAgICAgICAgICAgIHZlcnRpY2FsSW50ZXJ2YWw6ICdudW1iZXInLFxuICAgICAgICAgICAgcGxheVNwZWVkOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIGNsb2NrOiAnZnVuY3Rpb24nLFxuICAgICAgICAgICAgc2NhbGluZzogJ251bWJlcicsXG4gICAgICAgICAgICB0aW1lT3V0RGlzY2FyZDogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgaGlkZGVuVHlwZXM6ICdudW1iZXInLFxuICAgICAgICAgICAgb3BhY2l0eTogJ251bWJlcicsXG4gICAgICAgICAgICBjdXJzb3JPbk1vdXNlT3ZlcjogJ3N0cmluZycsXG4gICAgICAgICAgICBkZWZhdWx0U3R5bGU6IHtcbiAgICAgICAgICAgICAgICBzaGFkb3dCbHVyOiAnbnVtYmVyJyxcbiAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBbJ3N0cmluZycsICdudW1iZXInXSxcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICBzaXplOiAnbnVtYmVyJyxcbiAgICAgICAgICAgICAgICBib3hDb2xvcjogWydzdHJpbmcnLCAnbnVsbCddLFxuICAgICAgICAgICAgICAgIGNvbG9yOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogWydzdHJpbmcnLCAnbnVsbCddLFxuICAgICAgICAgICAgICAgIHNwZWVkOiAnbnVtYmVyJyxcbiAgICAgICAgICAgICAgICByZXNpZGVuY2VUaW1lOiAnbnVtYmVyJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOm7mOiupOW8ueW5leaVsOaNrlxuICAgICAgICAgKiBAcHJpdmF0ZSBAcmVhZG9ubHlcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9kZWZhdWx0QnVsbGV0U2NyZWVuID0ge1xuICAgICAgICAgICAgLyoqIOW8ueW5leaWh+acrCAqL1xuICAgICAgICAgICAgdGV4dDogbnVsbCxcbiAgICAgICAgICAgIC8qKiDmmK/lkKblhYHorrjkuKLlvIMgKi9cbiAgICAgICAgICAgIGNhbkRpc2NhcmQ6IHRydWUsXG4gICAgICAgICAgICAvKiog5by55bmV6L+b5YWl5pe26Ze0ICovXG4gICAgICAgICAgICBzdGFydFRpbWU6IG51bGwsXG4gICAgICAgICAgICAvKiog5by55bmV57G75Z6LICovXG4gICAgICAgICAgICB0eXBlOiBCdWxsZXRTY3JlZW5UeXBlLnJpZ2h0VG9MZWZ0LFxuICAgICAgICAgICAgLyoqIOW8ueW5leWxgue6p++8iOi2iuWkp+i2iuWJje+8iSAqL1xuICAgICAgICAgICAgbGF5ZXI6IDBcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlvLnluZXmlbDmja7nsbvlnotcbiAgICAgICAgICogQHByaXZhdGUgQHJlYWRvbmx5XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfYnVsbGV0U2NyZWVuVHlwZSA9IHtcbiAgICAgICAgICAgIHRleHQ6ICdzdHJpbmcnLFxuICAgICAgICAgICAgY2FuRGlzY2FyZDogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgc3RhcnRUaW1lOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgICAgbGF5ZXI6ICdudW1iZXInXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogcmVxdWVzdEFuaW1hdGlvbkZyYW1lIOWumuS5ie+8iOS4gOS6m+iAgeW8j+a1j+iniOWZqOS4jeaUr+aMgSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUg77yJXG4gICAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZ1biAtIOWbnuiwg+aWueazlSBcbiAgICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICBsZXQgcmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09ICdmdW5jdGlvbicpIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFJlc291cmNlcy5SRVFVRVNUQU5JTUFUSU9ORlJBTUVfTk9UX1NVUFBPUlRfV0FSTik7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSAoZnVuKSA9PiB3aW5kb3cuc2V0VGltZW91dChmdW4sIDE3KTsgLy82MGZwc1xuICAgICAgICB9XG5cbiAgICAgICAgX29wdGlvbnMgPSBIZWxwZXIuc2V0VmFsdWVzKG9wdGlvbnMsIF9kZWZhdWx0T3B0aW9ucywgX29wdGlvbnNUeXBlKTsgLy/orr7nva7pu5jorqTlgLxcblxuICAgICAgICAvL+S6i+S7tuWIneWni+WMllxuICAgICAgICBsZXQgX2V2ZW50ID0gbmV3IEV2ZW50KCk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlvLnluZXljZXlh7vkuovku7bjgILlvZPljZXlh7vlvLnluZXml7bop6blj5HjgIJcbiAgICAgICAgICogQGV2ZW50IG9wZW5CU0UuQnVsbGV0U2NyZWVuRW5naW5lI2NsaWNrXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7b3BlbkJTRX5CdWxsZXRTY3JlZW5FdmVudH0gZSAtIOW8ueW5leS6i+S7tue7k+aehFxuICAgICAgICAgKi9cbiAgICAgICAgX2V2ZW50LmFkZCgnY2xpY2snKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOW8ueW5leS4iuS4i+aWh+iPnOWNleS6i+S7tuOAguW9k+inpuWPkeW8ueW5leS4iuS4i+aWh+iPnOWNleaXtuinpuWPkeOAglxuICAgICAgICAgKiBAZXZlbnQgb3BlbkJTRS5CdWxsZXRTY3JlZW5FbmdpbmUjY29udGV4dG1lbnVcbiAgICAgICAgICogQHByb3BlcnR5IHtvcGVuQlNFfkJ1bGxldFNjcmVlbkV2ZW50fSBlIC0g5by55bmV5LqL5Lu257uT5p6EXG4gICAgICAgICAqL1xuICAgICAgICBfZXZlbnQuYWRkKCdjb250ZXh0bWVudScpO1xuICAgICAgICAvKipcbiAgICAgICAgKiDlvLnluZXpvKDmoIfnprvlvIDkuovku7bjgILlvZPpvKDmoIfnprvlvIDlvLnluZXml7bop6blj5HjgIJcbiAgICAgICAgKiBAZXZlbnQgb3BlbkJTRS5CdWxsZXRTY3JlZW5FbmdpbmUjbW91c2VsZWF2ZVxuICAgICAgICAqIEBwcm9wZXJ0eSB7b3BlbkJTRX5CdWxsZXRTY3JlZW5FdmVudH0gZSAtIOW8ueW5leS6i+S7tue7k+aehFxuICAgICAgICAqL1xuICAgICAgICBfZXZlbnQuYWRkKCdtb3VzZWxlYXZlJyk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlvLnluZXpvKDmoIfov5vlhaXkuovku7bjgILlvZPpvKDmoIfov5vlhaXlvLnluZXml7bop6blj5HjgIJcbiAgICAgICAgICogQGV2ZW50IG9wZW5CU0UuQnVsbGV0U2NyZWVuRW5naW5lI21vdXNlZW50ZXJcbiAgICAgICAgICogQHByb3BlcnR5IHtvcGVuQlNFfkJ1bGxldFNjcmVlbkV2ZW50fSBlIC0g5by55bmV5LqL5Lu257uT5p6EXG4gICAgICAgICAqL1xuICAgICAgICBfZXZlbnQuYWRkKCdtb3VzZWVudGVyJyk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDnu5Hlrprkuovku7blpITnkIbnqIvluo9cbiAgICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiDnu5Hlrprkuovku7blpITnkIbnqIvluo/jgILlvZPkuovku7blpITnkIbnqIvluo/ov5Tlm57lgLzkuLogZmFsc2Ug5pe25YGc5q2i5YaS5rOh44CCXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0g5LqL5Lu25ZCN56ewXG4gICAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZ1biAtIOS6i+S7tuWkhOeQhueoi+W6j1xuICAgICAgICAgKiBAbGlzdGVucyBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZSNjbGlja1xuICAgICAgICAgKiBAbGlzdGVucyBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZSNjb250ZXh0bWVudVxuICAgICAgICAgKiBAbGlzdGVucyBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZSNtb3VzZWxlYXZlXG4gICAgICAgICAqIEBsaXN0ZW5zIG9wZW5CU0UuQnVsbGV0U2NyZWVuRW5naW5lI21vdXNlZW50ZXJcbiAgICAgICAgICogQHRocm93cyB7VHlwZUVycm9yfSDkvKDlhaXnmoTlj4LmlbDplJnor6/miJbkuovku7bkuI3lrZjlnKjml7blvJXlj5HplJnor6/jgILor7flj4LpmIUgTUROIFtUeXBlRXJyb3Jde0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3poLUNOL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1R5cGVFcnJvcn0g44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmJpbmQgPSBfZXZlbnQuYmluZDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOino+e7keS6i+S7tuWkhOeQhueoi+W6j++8iGZ1buS4uuepuuino+e7keaJgOacieS6i+S7tuWkhOeQhueoi+W6j++8iVxuICAgICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSDkuovku7blkI3np7BcbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZnVuIC0g5LqL5Lu25aSE55CG56iL5bqPXG4gICAgICAgICAqIEB0aHJvd3Mge1R5cGVFcnJvcn0g5Lyg5YWl55qE5Y+C5pWw6ZSZ6K+v5oiW5LqL5Lu25LiN5a2Y5Zyo5pe25byV5Y+R6ZSZ6K+v44CC6K+35Y+C6ZiFIE1ETiBbVHlwZUVycm9yXXtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy96aC1DTi9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9UeXBlRXJyb3J9IOOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy51bmJpbmQgPSBfZXZlbnQudW5iaW5kO1xuICAgICAgICAvL+WIneWni+WMllxuICAgICAgICBsZXQgX2VsZW1lbnRTaXplID0ge1xuICAgICAgICAgICAgd2lkdGg6IGVsZW1lbnQuY2xpZW50V2lkdGggLyBfb3B0aW9ucy5zY2FsaW5nLFxuICAgICAgICAgICAgaGVpZ2h0OiBlbGVtZW50LmNsaWVudEhlaWdodCAvIF9vcHRpb25zLnNjYWxpbmdcbiAgICAgICAgfVxuICAgICAgICBsZXQgX29sZERldmljZVBpeGVsUmF0aW8gPSBIZWxwZXIuZ2V0RGV2aWNlUGl4ZWxSYXRpbygpO1xuICAgICAgICBsZXQgX29sZFNjYWxpbmcgPSBfb3B0aW9ucy5zY2FsaW5nO1xuICAgICAgICBsZXQgX29sZENsaWVudFdpZHRoID0gZWxlbWVudC5jbGllbnRXaWR0aDtcbiAgICAgICAgbGV0IF9vbGRDbGllbnRIZWlnaHQgPSBlbGVtZW50LmNsaWVudEhlaWdodDtcbiAgICAgICAgbGV0IF9vbGRIaWRkZW5UeXBlcyA9IF9vcHRpb25zLmhpZGRlblR5cGVzO1xuICAgICAgICBsZXQgX29sZE9wYWNpdHkgPSBfb3B0aW9ucy5vcGFjaXR5O1xuICAgICAgICAvL+a4suafk+WZqOW3peWOglxuICAgICAgICBsZXQgcmVuZGVyZXJzRmFjdG9yeSA9IG5ldyBSZW5kZXJlcnNGYWN0b3J5KGVsZW1lbnQsIF9vcHRpb25zLCBfZWxlbWVudFNpemUsIGJ1bGxldFNjcmVlbkV2ZW50VHJpZ2dlcik7XG4gICAgICAgIGxldCBfcmVuZGVyZXIgPSByZW5kZXJlcnNGYWN0b3J5LmdldFJlbmRlcmVyKHJlbmRlck1vZGUpOyAvL+WunuS+i+WMlua4suafk+WZqFxuICAgICAgICBzZXRJbnRlcnZhbChzZXRTaXplLCAxMDApO1xuXG4gICAgICAgIC8v5YWs5YWx5Ye95pWwXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiuvue9ruWFqOWxgOmAiemhuVxuICAgICAgICAgKiBAcGFyYW0ge29wZW5CU0V+T3B0aW9uc30gb3B0aW9ucyAtIOWFqOWxgOmAiemhue+8muS4gOS4qiB7QGxpbmsgb3BlbkJTRX5PcHRpb25zfSDnu5PmnoTjgIJcbiAgICAgICAgICogQHRocm93cyB7VHlwZUVycm9yfSDkvKDlhaXnmoTlj4LmlbDplJnor6/ml7blvJXlj5HplJnor6/jgILor7flj4LpmIUgTUROIFtUeXBlRXJyb3Jde0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3poLUNOL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1R5cGVFcnJvcn0g44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnNldE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgX29wdGlvbnMgPSBIZWxwZXIuc2V0VmFsdWVzKG9wdGlvbnMsIF9vcHRpb25zLCBfb3B0aW9uc1R5cGUsIGZhbHNlKTsgLy/orr7nva7pu5jorqTlgLxcbiAgICAgICAgICAgIGlmIChfb2xkSGlkZGVuVHlwZXMgIT0gX29wdGlvbnMuaGlkZGVuVHlwZXMpIHtcbiAgICAgICAgICAgICAgICBfb2xkSGlkZGVuVHlwZXMgPSBfb3B0aW9ucy5oaWRkZW5UeXBlcztcbiAgICAgICAgICAgICAgICBpZiAoIV9wbGF5aW5nKSBfcmVuZGVyZXIuZHJhdygpOyAvL+mdnuaSreaUvueKtuaAgeWImemHjee7mFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKF9vbGRPcGFjaXR5ICE9IF9vcHRpb25zLm9wYWNpdHkpIHtcbiAgICAgICAgICAgICAgICBfb2xkT3BhY2l0eSA9IF9vcHRpb25zLm9wYWNpdHk7XG4gICAgICAgICAgICAgICAgX3JlbmRlcmVyLnNldE9wYWNpdHkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W5YWo5bGA6YCJ6aG5XG4gICAgICAgICAqIEByZXR1cm5zIHtvcGVuQlNFfk9wdGlvbnN9IOWFqOWxgOmAiemhue+8muS4gOS4qiB7QGxpbmsgb3BlbkJTRX5PcHRpb25zfSDnu5PmnoTjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZ2V0T3B0aW9ucyA9ICgpID0+IF9vcHRpb25zO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmt7vliqDlvLnluZXliLDlvLnluZXliJfooajjgIJcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIOa3u+WKoOW8ueW5leWIsOW8ueW5leWIl+ihqOOAgueUseS6juW8ueW5leWcqOWxj+W5leS4iuWHuueOsOi/h+WQju+8jOW8ueW5leW8leaTjuWwhuS7juWIl+ihqOS4reW9u+W6leWIoOmZpOatpOW8ueW5leOAguaJgOS7pe+8jOWcqOaUueWPmOaSreaUvui/m+W6puaXtu+8jOWPr+iDvemcgOimgeWFiFvmuIXnqbrlvLnluZXliJfooahde0BsaW5rIG9wZW5CU0UuQnVsbGV0U2NyZWVuRW5naW5lI2NsZWFuQnVsbGV0U2NyZWVuTGlzdH3vvIznhLblkI7ph43mlrDliqDovb3mraTmkq3mlL7ov5vluqbku6XlkI7nmoTlvLnluZXjgIJcbiAgICAgICAgICogQHBhcmFtIHtvcGVuQlNFfkJ1bGxldFNjcmVlbn0gYnVsbGV0U2NyZWVuIC0g5Y2V5p2h5by55bmV5pWw5o2u77ya5LiA5LiqIHtAbGluayBvcGVuQlNFfkJ1bGxldFNjcmVlbn0g57uT5p6E44CCXG4gICAgICAgICAqIEB0aHJvd3Mge1R5cGVFcnJvcn0g5Lyg5YWl55qE5Y+C5pWw6ZSZ6K+v5pe25byV5Y+R6ZSZ6K+v44CC6K+35Y+C6ZiFIE1ETiBbVHlwZUVycm9yXXtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy96aC1DTi9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9UeXBlRXJyb3J9IOOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5hZGRCdWxsZXRTY3JlZW4gPSBmdW5jdGlvbiAoYnVsbGV0U2NyZWVuKSB7XG4gICAgICAgICAgICBfZGVmYXVsdEJ1bGxldFNjcmVlbi5zdGFydFRpbWUgPSBfb3B0aW9ucy5jbG9jaygpO1xuICAgICAgICAgICAgYnVsbGV0U2NyZWVuID0gSGVscGVyLnNldFZhbHVlcyhidWxsZXRTY3JlZW4sIF9kZWZhdWx0QnVsbGV0U2NyZWVuLCBfYnVsbGV0U2NyZWVuVHlwZSk7IC8v6K6+572u6buY6K6k5YC8XG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW4udHlwZSAhPSBCdWxsZXRTY3JlZW5UeXBlLmxlZnRUb1JpZ2h0ICYmXG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuLnR5cGUgIT0gQnVsbGV0U2NyZWVuVHlwZS5yaWdodFRvTGVmdCAmJlxuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbi50eXBlICE9IEJ1bGxldFNjcmVlblR5cGUudG9wICYmXG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuLnR5cGUgIT0gQnVsbGV0U2NyZWVuVHlwZS5ib3R0b21cbiAgICAgICAgICAgICkgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuUEFSQU1FVEVSU19UWVBFX0VSUk9SKTtcblxuICAgICAgICAgICAgSGVscGVyLmNoZWNrVHlwZXMoYnVsbGV0U2NyZWVuLnN0eWxlLCBfb3B0aW9uc1R5cGUuZGVmYXVsdFN0eWxlKTsgLy/mo4Dmn6XlvLnluZXmoLflvI/nsbvlnotcblxuICAgICAgICAgICAgbGV0IG9sZExlbmd0aCA9IF9idWxsZXRTY3JlZW5zLmdldExlbmd0aCgpO1xuICAgICAgICAgICAgX2J1bGxldFNjcmVlbnMuZm9yRWFjaChmdW5jdGlvbiAobGFzdEJ1bGxldFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW4uc3RhcnRUaW1lID4gbGFzdEJ1bGxldFNjcmVlbi5zdGFydFRpbWUpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGQ6IHsgYWRkVG9VcDogdHJ1ZSwgZWxlbWVudDogYnVsbGV0U2NyZWVuIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9wOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgICAgIGlmIChvbGRMZW5ndGggPT09IF9idWxsZXRTY3JlZW5zLmdldExlbmd0aCgpKVxuICAgICAgICAgICAgICAgIF9idWxsZXRTY3JlZW5zLnB1c2goYnVsbGV0U2NyZWVuLCBmYWxzZSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5byA5aeL5pKt5pS+5by55bmV44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnBsYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIV9wbGF5aW5nKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFfc3RhcnRUaW1lKVxuICAgICAgICAgICAgICAgICAgICBfc3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgaWYgKF9wYXVzZVRpbWUpXG4gICAgICAgICAgICAgICAgICAgIF9zdGFydFRpbWUgKz0gX29wdGlvbnMuY2xvY2soKSAtIF9wYXVzZVRpbWU7XG4gICAgICAgICAgICAgICAgX2xhc3RSZWZyZXNoVGltZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgX3BsYXlpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZWZyZXNoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog57un57ut5omA5pyJ5Zyo5LqL5Lu25ZON5bqU5Lit6K6+572u5LqGIGUucGF1c2UgPSB0cnVlOyDlvLnluZXnmoTmkq3mlL7jgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucGxheUFsbEJ1bGxldFNjcmVlbnMgPSAoKSA9PlxuICAgICAgICAgICAgX2J1bGxldFNjcmVlbnNPblNjcmVlbi5mb3JFYWNoKChidWxsZXRTY3JlZW5PblNjcmVlbikgPT4gYnVsbGV0U2NyZWVuT25TY3JlZW4ucGF1c2UgPSBmYWxzZSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaaguWBnOaSreaUvuW8ueW5leOAglxuICAgICAgICAgKiBAZGVzY3JpcHRpb24g5pqC5YGc5pKt5pS+5by55bmV44CC5pqC5YGc5pKt5pS+5by55bmV5piv5oyH5by55bmV5pKt5pS+5pqC5YGc77yM5omA5pyJ5pyq5Ye6546w55qE5by55bmV5bCG5YGc5q2i5Ye6546w77yM5bey5Ye6546w55qE5by55bmV5YGc5q2i6L+Q5Yqo77yM5YGc5q2i5raI5aSx44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnBhdXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKF9wbGF5aW5nKSB7XG4gICAgICAgICAgICAgICAgX3BhdXNlVGltZSA9IF9vcHRpb25zLmNsb2NrKCk7XG4gICAgICAgICAgICAgICAgX3BsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5riF56m65by55bmV5YiX6KGo44CCXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiDmuIXnqbrlvLnluZXliJfooajvvIzkvYblsY/luZXkuIrlt7Lnu4/lh7rnjrDnmoTlvLnluZXkuI3kvJrooqvmuIXpmaTjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY2xlYW5CdWxsZXRTY3JlZW5MaXN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX2J1bGxldFNjcmVlbnMuY2xlYW4oKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5riF56m65bGP5bmV5YaF5a6544CCXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiDmuIXnqbrlsY/luZXlhoXlrrnjgILmuIXnqbrlsY/luZXkuIrlt7Lnu4/lh7rnjrDnmoTlvLnluZXvvIzkuI3ljIXmi6zlvLnluZXliJfooajkuK3nmoTlvLnluZXjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY2xlYW5TY3JlZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfYnVsbGV0U2NyZWVuc09uU2NyZWVuLmNsZWFuKCk7XG4gICAgICAgICAgICBfcmVuZGVyZXIuY2xlYW5TY3JlZW4oKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5YGc5q2i5pKt5pS+5by55bmV44CCXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiDlgZzmraLmkq3mlL7lvLnluZXjgILlgZzmraLmkq3mlL7lvLnluZXmmK/mjIflgZzmraLmkq3mlL7lvLnluZXvvIzpu5jorqRb5pe26Ze05Z+65YeG77yIb3B0aW9ucy5jbG9ja++8iV17QGxpbmsgb3BlbkJTRX5CdWxsZXRTY3JlZW5TdHlsZX3lvZLpm7bvvIzlubZb5riF56m65by55bmV5YiX6KGoXXtAbGluayBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZSNjbGVhbkJ1bGxldFNjcmVlbkxpc3R944CBW+a4heepuuWxj+W5leWGheWuuV17QGxpbmsgb3BlbkJTRS5CdWxsZXRTY3JlZW5FbmdpbmUjY2xlYW5TY3JlZW5944CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoX3BsYXlpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhdXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNsZWFuQnVsbGV0U2NyZWVuTGlzdCgpO1xuICAgICAgICAgICAgdGhpcy5jbGVhblNjcmVlbigpO1xuICAgICAgICAgICAgX3BhdXNlVGltZSA9IDA7XG4gICAgICAgICAgICBfc3RhcnRUaW1lID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog6ZqQ6JeP5by55bmV44CCXG4gICAgICAgICAqIEBmdW5jdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5oaWRlID0gX3JlbmRlcmVyLmhpZGU7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaYvuekuuW8ueW5leOAglxuICAgICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc2hvdyA9IF9yZW5kZXJlci5zaG93O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5blvLnluZXlj6/op4HmgKfjgIJcbiAgICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSAtIOaMh+ekuuW8ueW5leaYr+WQpuWPr+ingeOAglxuICAgICAgICAgKiBAZGVzY3JpcHRpb24g6I635Y+W5by55bmV5Y+v6KeB5oCn44CC5aaC6KaB5pi+56S65by55bmV6K+36LCD55SoIFtidWxsZXRTY3JlZW5FbmdpbmUuc2hvdygpO117QGxpbmsgb3BlbkJTRS5CdWxsZXRTY3JlZW5FbmdpbmUjc2hvd30g77yM6KaB6ZqQ6JeP5by55bmV6K+36LCD55SoIFtidWxsZXRTY3JlZW5FbmdpbmUuaGlkZSgpO117QGxpbmsgb3BlbkJTRS5CdWxsZXRTY3JlZW5FbmdpbmUjaGlkZX0g44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmdldFZpc2liaWxpdHkgPSBfcmVuZGVyZXIuZ2V0VmlzaWJpbGl0eTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPlua4suafk+aooeW8j+OAglxuICAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIOW8ueW5lea4suafk+aooeW8j++8miDlj5blgLzkuLrigJxjYW52YXPigJ3jgIHigJxjc3Mz4oCd44CB4oCcd2ViZ2zigJ3miJbigJxzdmfigJ3jgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZ2V0UmVuZGVyTW9kZSA9ICgpID0+IHJlbmRlck1vZGU7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPluaSreaUvueKtuaAgeOAglxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSDmraPlnKjmkq3mlL7moIflv5fvvJp0cnVl77ya5q2j5Zyo5pKt5pS+77ybZmFsc2XvvJrlt7LmmoLlgZwv5YGc5q2i5pKt5pS+44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmdldFBsYXlTdGF0ZSA9ICgpID0+IF9wbGF5aW5nO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAqIOiOt+WPluiwg+ivleS/oeaBr+OAglxuICAgICAgICAqIEByZXR1cm5zIHtvcGVuQlNFfkRlYnVnSW5mb30gLSDosIPor5Xkv6Hmga/vvJrkuIDkuKoge0BsaW5rIG9wZW5CU0V+RGVidWdJbmZvfSDnu5PmnoTjgIJcbiAgICAgICAgKi9cbiAgICAgICAgdGhpcy5nZXREZWJ1Z0luZm8gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRpbWU6IF9wbGF5aW5nID8gX29wdGlvbnMuY2xvY2soKSA6IF9wYXVzZVRpbWUsXG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuc09uU2NyZWVuQ291bnQ6IF9idWxsZXRTY3JlZW5zT25TY3JlZW4uZ2V0TGVuZ3RoKCksXG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuc0NvdW50OiBfYnVsbGV0U2NyZWVucy5nZXRMZW5ndGgoKSxcbiAgICAgICAgICAgICAgICBkZWxheTogX2RlbGF5LFxuICAgICAgICAgICAgICAgIGRlbGF5QnVsbGV0U2NyZWVuc0NvdW50OiBfZGVsYXlCdWxsZXRTY3JlZW5zQ291bnQsXG4gICAgICAgICAgICAgICAgZnBzOiBfcGxheWluZyA/IE1hdGguZmxvb3IoX3JlZnJlc2hSYXRlICogMTAwMCkgOiAwIC8v5bin6aKRXG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuXG4gICAgICAgIC8v5YaF6YOo5Ye95pWwXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOW8ueW5leS6i+S7tuWTjeW6lFxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIOS6i+S7tuWQjeensFxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gYnVsbGV0U2NyZWVuT25TY3JlZW4gLSDlsY/luZXlvLnluZXlr7nosaFcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGUgLSDkuovku7bkv6Hmga9cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGJ1bGxldFNjcmVlbkV2ZW50VHJpZ2dlcihuYW1lLCBidWxsZXRTY3JlZW5PblNjcmVlbiwgZSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBlLnBhZ2VYID09PSAndW5kZWZpbmVkJyB8fCBlLnBhZ2VYID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbGV0IGRvYyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgYm9keSA9IGRvY3VtZW50LmJvZHk7XG4gICAgICAgICAgICAgICAgZS5wYWdlWCA9IGUuY2xpZW50WCArIChkb2MgJiYgZG9jLnNjcm9sbExlZnQgfHwgYm9keSAmJiBib2R5LnNjcm9sbExlZnQgfHwgMCkgLSAoZG9jICYmIGRvYy5jbGllbnRMZWZ0IHx8IGJvZHkgJiYgYm9keS5jbGllbnRMZWZ0IHx8IDApO1xuICAgICAgICAgICAgICAgIGUucGFnZVkgPSBlLmNsaWVudFkgKyAoZG9jICYmIGRvYy5zY3JvbGxUb3AgfHwgYm9keSAmJiBib2R5LnNjcm9sbFRvcCB8fCAwKSAtIChkb2MgJiYgZG9jLmNsaWVudFRvcCB8fCBib2R5ICYmIGJvZHkuY2xpZW50VG9wIHx8IDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX2V2ZW50LnRyaWdnZXIobmFtZSwge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIOiOt+WPluW8leWPkeS6i+S7tueahOW8ueW5leW8ueW5leeahOaVsOaNrlxuICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAgICAgICAgICogQHJldHVybnMge29wZW5CU0V+QnVsbGV0U2NyZWVufSDlvJXlj5Hkuovku7bnmoTlvLnluZXnmoTmlbDmja7vvJrkuIDkuKoge0BsaW5rIG9wZW5CU0V+QnVsbGV0U2NyZWVufSDnu5PmnoTjgILvvIjms6jmhI/vvJrkuI3opoHor5Xlm77kuI5b5re75Yqg5by55bmVXXtAbGluayBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZSNhZGRCdWxsZXRTY3JlZW595pe25Yib5bu655qE5a+56LGh6L+b6KGM5q+U6L6D77yM6L+Z5Liq5a+56LGh5piv5YWL6ZqG5b6X5Yiw55qE77yM5bm25LiN55u4562J44CC5q2j56Gu55qE5pa55rOV5piv5Zyo5re75Yqg5by55bmV5pe25LiA5bm25o+S5YWlIGlkIOetieiHquWumuS5ieWtl+auteadpeWUr+S4gOagh+ivhuS4gOadoeW8ueW5leOAgu+8iVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGdldEJ1bGxldFNjcmVlbjogKCkgPT4gSGVscGVyLmNsb25lKGJ1bGxldFNjcmVlbk9uU2NyZWVuLmJ1bGxldFNjcmVlbiksXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICog6K6+572u5byV5Y+R5LqL5Lu255qE5by55bmV5by55bmV55qE5pWw5o2uXG4gICAgICAgICAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge29wZW5CU0V+QnVsbGV0U2NyZWVufSBidWxsZXRTY3JlZW4gLSDlvJXlj5Hkuovku7bnmoTlvLnluZXnmoTmlbDmja7vvJrkuIDkuKoge0BsaW5rIG9wZW5CU0V+QnVsbGV0U2NyZWVufSDnu5PmnoTjgILorr7nva7mraTlj4LmlbDku6Xkvr/liqjmgIHosIPmlbTlvLnluZXmoLflvI/vvIzkvYbmmK/kuIDkupvlj4LmlbDlnKjkuovku7bkuK3kv67mlLnml6DmlYjvvIzmn6XnnIvmraTnu5PmnoTnmoTor7TmmI7ku6Xkuobop6Por6bmg4XjgIJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtyZWRyYXc9ZmFsc2VdIC0g5piv5ZCm6YeN57uY5by55bmV77ya5q2k5Y+C5pWw5Zyo5q+P5qyh5byV5Y+R5LqL5Lu25pe255qE5Yid5aeL5YC85Li6IGZhbHNlIO+8jOWmguaenOS/ruaUueS6hiBidWxsZXRTY3JlZW4g5Lit55qE5YC877yM5q2k5Y+C5pWw5b+F6aG76K6+5Li6IHRydWUg44CCXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgc2V0QnVsbGV0U2NyZWVuOiAoYnVsbGV0U2NyZWVuLCByZWRyYXcgPSBmYWxzZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlZHJhdyAhPSAnYm9vbGVhbicpIHRocm93IG5ldyBUeXBlRXJyb3IoUmVzb3VyY2VzLlBBUkFNRVRFUlNfVFlQRV9FUlJPUik7XG4gICAgICAgICAgICAgICAgICAgIGxldCBidWxsZXRTY3JlZW5UeXBlID0gSGVscGVyLmNsb25lKF9idWxsZXRTY3JlZW5UeXBlKTtcbiAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuVHlwZS5zdHlsZSA9IF9vcHRpb25zVHlwZS5kZWZhdWx0U3R5bGU7XG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLmJ1bGxldFNjcmVlbiA9IEhlbHBlci5zZXRWYWx1ZXMoYnVsbGV0U2NyZWVuLCBidWxsZXRTY3JlZW5PblNjcmVlbi5idWxsZXRTY3JlZW4sIGJ1bGxldFNjcmVlblR5cGUpOyAvL+iuvue9ruWAvFxuICAgICAgICAgICAgICAgICAgICBpZiAocmVkcmF3ID09PSB0cnVlKSBfcmVuZGVyZXIucmVDcmVhdEFuZGdldFdpZHRoKGJ1bGxldFNjcmVlbk9uU2NyZWVuKTsgLy/ph43mlrDliJvlu7rlubbnu5jliLblvLnluZVcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFfcGxheWluZyAmJiByZWRyYXcpIF9yZW5kZXJlci5kcmF3KCk7IC8v6Z2e5pKt5pS+54q25oCB5YiZ6YeN57uYXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiDojrflj5blvJXlj5Hkuovku7bnmoTlvLnluZXnmoTmkq3mlL7nirbmgIFcbiAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSDlj5blvJXlj5Hkuovku7bnmoTlvLnluZXmmK/lkKblnKjmkq3mlL4v56e75Yqo77ya5aaC5p6c6K6+572u5Li6IHRydWUg5YiZ6K+l5by55bmV5pqC5YGc77yM55u05Yiw5bCG5q2k5Y+C5pWw6K6+5Li6IGZhbHNlIOaIluiwg+eUqCB7QGxpbmsgb3BlbkJTRS5CdWxsZXRTY3JlZW5FbmdpbmUjcGxheUFsbEJ1bGxldFNjcmVlbnN9IOaWueazleOAglxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGdldFBsYXlTdGF0ZTogKCkgPT4gIWJ1bGxldFNjcmVlbk9uU2NyZWVuLnBhdXNlLFxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIOiuvue9ruW8leWPkeS6i+S7tueahOW8ueW5leeahOaSreaUvueKtuaAgVxuICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtib29sZWFufSBwYWx5IC0g5piv5ZCm57un57ut5pKt5pS+L+enu+WKqOW8leWPkeS6i+S7tueahOW8ueW5le+8muivu+WPluatpOWPguaVsOWPr+WIpOaWrei/meadoeW8ueW5leaYr+WQpuWkhOS6juaaguWBnOeKtuaAgeOAglxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHNldFBsYXlTdGF0ZTogKHBsYXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwbGF5ICE9ICdib29sZWFuJykgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuUEFSQU1FVEVSU19UWVBFX0VSUk9SKTtcbiAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4ucGF1c2UgPSAhcGxheTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNjcmVlblg6IGUuc2NyZWVuWCwgc2NyZWVuWTogZS5zY3JlZW5ZLFxuICAgICAgICAgICAgICAgIHBhZ2VYOiBlLnBhZ2VYLCBwYWdlWTogZS5wYWdlWSxcbiAgICAgICAgICAgICAgICBjbGllbnRYOiBlLmNsaWVudFgsIGNsaWVudFk6IGUuY2xpZW50WVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yi35paw5by55bmV5Ye95pWwXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiByZWZyZXNoKCkge1xuICAgICAgICAgICAgbGV0IG5vd1RpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIGlmIChfbGFzdFJlZnJlc2hUaW1lICE9IG51bGwpXG4gICAgICAgICAgICAgICAgX3JlZnJlc2hSYXRlID0gMSAvIChub3dUaW1lIC0gX2xhc3RSZWZyZXNoVGltZSk7XG4gICAgICAgICAgICBfbGFzdFJlZnJlc2hUaW1lID0gbm93VGltZTtcbiAgICAgICAgICAgIGFkZEJ1bGxldFNjcmVlbnNUb1NjcmVlbigpO1xuICAgICAgICAgICAgbW92ZUJ1bGxldFNjcmVlbk9uU2NyZWVuKCk7XG4gICAgICAgICAgICBfcmVuZGVyZXIuZHJhdygpOyAvL+e7mOWItuW8ueW5lVxuICAgICAgICAgICAgaWYgKF9wbGF5aW5nKVxuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZWZyZXNoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDnp7vliqjlvLnluZXlh73mlbBcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIG1vdmVCdWxsZXRTY3JlZW5PblNjcmVlbigpIHtcbiAgICAgICAgICAgIF9idWxsZXRTY3JlZW5zT25TY3JlZW4uZm9yRWFjaCgoYnVsbGV0U2NyZWVuT25TY3JlZW4pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuT25TY3JlZW4ucGF1c2UpIHJldHVybjsgLy/mmoLlgZznp7vliqhcbiAgICAgICAgICAgICAgICBsZXQgbm93VGltZSA9IF9vcHRpb25zLmNsb2NrKCk7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChidWxsZXRTY3JlZW5PblNjcmVlbi50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQnVsbGV0U2NyZWVuVHlwZS5yaWdodFRvTGVmdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW5PblNjcmVlbi54ID4gLWJ1bGxldFNjcmVlbk9uU2NyZWVuLndpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4ueCAtPSBidWxsZXRTY3JlZW5PblNjcmVlbi5idWxsZXRTY3JlZW4uc3R5bGUuc3BlZWQgKiBfb3B0aW9ucy5wbGF5U3BlZWQgLyBfcmVmcmVzaFJhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVuZGVyZXIuZGVsZXRlKGJ1bGxldFNjcmVlbk9uU2NyZWVuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyByZW1vdmU6IHRydWUgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIEJ1bGxldFNjcmVlblR5cGUubGVmdFRvUmlnaHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuT25TY3JlZW4ueCA8IF9lbGVtZW50U2l6ZS53aWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnggKz0gYnVsbGV0U2NyZWVuT25TY3JlZW4uYnVsbGV0U2NyZWVuLnN0eWxlLnNwZWVkICogX29wdGlvbnMucGxheVNwZWVkIC8gX3JlZnJlc2hSYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JlbmRlcmVyLmRlbGV0ZShidWxsZXRTY3JlZW5PblNjcmVlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgcmVtb3ZlOiB0cnVlIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCdWxsZXRTY3JlZW5UeXBlLnRvcDpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCdWxsZXRTY3JlZW5UeXBlLmJvdHRvbTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW5PblNjcmVlbi5lbmRUaW1lIDwgbm93VGltZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZW5kZXJlci5kZWxldGUoYnVsbGV0U2NyZWVuT25TY3JlZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHJlbW92ZTogdHJ1ZSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5re75Yqg5by55bmV5Yiw5bGP5bmV5Ye95pWwXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhZGRCdWxsZXRTY3JlZW5zVG9TY3JlZW4oKSB7XG4gICAgICAgICAgICBpZiAoX2J1bGxldFNjcmVlbnNPblNjcmVlbi5nZXRMZW5ndGgoKSA9PT0gMClcbiAgICAgICAgICAgICAgICBfZGVsYXkgPSAwO1xuICAgICAgICAgICAgbGV0IHRpbWVzID0gTWF0aC5mbG9vcihfcmVmcmVzaFJhdGUgKiAyMDAwKTtcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuID0gX2J1bGxldFNjcmVlbnMucG9wKGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbiA9PT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGxldCBub3dUaW1lID0gX29wdGlvbnMuY2xvY2soKTtcbiAgICAgICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuLnN0YXJ0VGltZSA+IG5vd1RpbWUpIHJldHVybjtcbiAgICAgICAgICAgICAgICBpZiAoIV9vcHRpb25zLnRpbWVPdXREaXNjYXJkIHx8ICFidWxsZXRTY3JlZW4uY2FuRGlzY2FyZCB8fCBidWxsZXRTY3JlZW4uc3RhcnRUaW1lID4gbm93VGltZSAtIE1hdGguZmxvb3IoMSAvIF9yZWZyZXNoUmF0ZSkgKiA2MCkge1xuICAgICAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW4uc3R5bGUgPSBIZWxwZXIuc2V0VmFsdWVzKGJ1bGxldFNjcmVlbi5zdHlsZSwgX29wdGlvbnMuZGVmYXVsdFN0eWxlLCBfb3B0aW9uc1R5cGUuZGVmYXVsdFN0eWxlKTsgLy/loavlhYXpu5jorqTmoLflvI9cbiAgICAgICAgICAgICAgICAgICAgZ2V0QnVsbGV0U2NyZWVuT25TY3JlZW4obm93VGltZSwgYnVsbGV0U2NyZWVuKTsgLy/nlJ/miJDlsY/luZXlvLnluZXlr7nosaHlubbmt7vliqDliLDlsY/luZXlvLnluZXpm4blkIggICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBfZGVsYXlCdWxsZXRTY3JlZW5zQ291bnQrKztcbiAgICAgICAgICAgICAgICBfYnVsbGV0U2NyZWVucy5wb3AodHJ1ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHRpbWVzLS07XG4gICAgICAgICAgICB9IHdoaWxlIChfYnVsbGV0U2NyZWVuc09uU2NyZWVuLmdldExlbmd0aCgpID09PSAwIHx8IHRpbWVzID4gMCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog55Sf5oiQ5bGP5bmV5by55bmV5a+56LGh5Ye95pWwXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBub3dUaW1lIC0g5b2T5YmN5pe26Ze0XG4gICAgICAgICAqIEBwYXJhbSB7b3BlbkJTRX5CdWxsZXRTY3JlZW59IGJ1bGxldFNjcmVlbiAtIOW8ueW5lVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZ2V0QnVsbGV0U2NyZWVuT25TY3JlZW4obm93VGltZSwgYnVsbGV0U2NyZWVuKSB7XG4gICAgICAgICAgICBfZGVsYXkgPSBub3dUaW1lIC0gYnVsbGV0U2NyZWVuLnN0YXJ0VGltZTtcbiAgICAgICAgICAgIGxldCBidWxsZXRTY3JlZW5PblNjcmVlbiA9IHt9O1xuICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4ucGF1c2UgPSBmYWxzZTsgLy/mmK/lkKbmmoLlgZznp7vliqhcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLmJ1bGxldFNjcmVlbiA9IGJ1bGxldFNjcmVlbjtcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnN0YXJ0VGltZSA9IG5vd1RpbWU7IC8v5by55bmV5aS06YOo6L+b5bGP5bmV5pe26Ze0XG4gICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi5zaXplID0gYnVsbGV0U2NyZWVuLnN0eWxlLnNpemU7IC8v5a2X5L2T5aSn5bCP77ya5YOP57SgXG4gICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi50eXBlID0gYnVsbGV0U2NyZWVuLnR5cGU7IC8v5by55bmV57G75Z6LXG4gICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi5oZWlnaHQgPSBidWxsZXRTY3JlZW5PblNjcmVlbi5zaXplOyAvL+W8ueW5leeahOmrmOW6pu+8muWDj+e0oFxuICAgICAgICAgICAgX3JlbmRlcmVyLmNyZWF0QW5kZ2V0V2lkdGgoYnVsbGV0U2NyZWVuT25TY3JlZW4pOyAvL+WIm+W7uuW8ueW5leWFg+e0oOW5tuiuoeeul+WuveW6plxuICAgICAgICAgICAgc3dpdGNoIChidWxsZXRTY3JlZW4udHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgQnVsbGV0U2NyZWVuVHlwZS5yaWdodFRvTGVmdDpcbiAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4uZW5kVGltZSA9IE1hdGgucm91bmQobm93VGltZSArIChfZWxlbWVudFNpemUud2lkdGggKyBidWxsZXRTY3JlZW5PblNjcmVlbi53aWR0aCkgLyAoYnVsbGV0U2NyZWVuLnN0eWxlLnNwZWVkICogX29wdGlvbnMucGxheVNwZWVkKSk7IC8v5by55bmV5bC+6YOo5Ye65bGP5bmV55qE5pe26Ze0XG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnggPSBfZWxlbWVudFNpemUud2lkdGg7IC8v5by55bmV5Yid5aeLWOWdkOagh1xuICAgICAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi55ID0gX29wdGlvbnMudmVydGljYWxJbnRlcnZhbDsgLy/lvLnluZXliJ3lp4tZ5Z2Q5qCHXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgQnVsbGV0U2NyZWVuVHlwZS5sZWZ0VG9SaWdodDpcbiAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4uZW5kVGltZSA9IE1hdGgucm91bmQobm93VGltZSArIChfZWxlbWVudFNpemUud2lkdGggKyBidWxsZXRTY3JlZW5PblNjcmVlbi53aWR0aCkgLyAoYnVsbGV0U2NyZWVuLnN0eWxlLnNwZWVkICogX29wdGlvbnMucGxheVNwZWVkKSk7IC8v5by55bmV5bC+6YOo5Ye65bGP5bmV55qE5pe26Ze0XG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnggPSAtYnVsbGV0U2NyZWVuT25TY3JlZW4ud2lkdGg7IC8v5by55bmV5Yid5aeLWOWdkOagh1xuICAgICAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi55ID0gX29wdGlvbnMudmVydGljYWxJbnRlcnZhbDsgLy/lvLnluZXliJ3lp4tZ5Z2Q5qCHXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgQnVsbGV0U2NyZWVuVHlwZS50b3A6XG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLmVuZFRpbWUgPSBidWxsZXRTY3JlZW5PblNjcmVlbi5zdGFydFRpbWUgKyBidWxsZXRTY3JlZW4uc3R5bGUucmVzaWRlbmNlVGltZSAqIF9vcHRpb25zLnBsYXlTcGVlZDtcbiAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4ueCA9IE1hdGgucm91bmQoKF9lbGVtZW50U2l6ZS53aWR0aCAtIGJ1bGxldFNjcmVlbk9uU2NyZWVuLndpZHRoKSAvIDIpOyAvL+W8ueW5leWIneWni1jlnZDmoIdcbiAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4ueSA9IF9vcHRpb25zLnZlcnRpY2FsSW50ZXJ2YWw7IC8v5by55bmV5Yid5aeLWeWdkOagh1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEJ1bGxldFNjcmVlblR5cGUuYm90dG9tOlxuICAgICAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi5lbmRUaW1lID0gYnVsbGV0U2NyZWVuT25TY3JlZW4uc3RhcnRUaW1lICsgYnVsbGV0U2NyZWVuLnN0eWxlLnJlc2lkZW5jZVRpbWUgKiBfb3B0aW9ucy5wbGF5U3BlZWQ7XG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnggPSBNYXRoLnJvdW5kKChfZWxlbWVudFNpemUud2lkdGggLSBidWxsZXRTY3JlZW5PblNjcmVlbi53aWR0aCkgLyAyKTsgLy/lvLnluZXliJ3lp4tY5Z2Q5qCHXG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnkgPSAtX29wdGlvbnMudmVydGljYWxJbnRlcnZhbCAtIGJ1bGxldFNjcmVlbk9uU2NyZWVuLmhlaWdodDsgLy/lvLnluZXliJ3lp4tZ5Z2Q5qCHXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IG9sZExlbmd0aCA9IF9idWxsZXRTY3JlZW5zT25TY3JlZW4uZ2V0TGVuZ3RoKCk7XG4gICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuLnR5cGUgPT09IEJ1bGxldFNjcmVlblR5cGUudG9wIHx8IGJ1bGxldFNjcmVlbi50eXBlID09PSBCdWxsZXRTY3JlZW5UeXBlLmJvdHRvbSkge1xuICAgICAgICAgICAgICAgIF9idWxsZXRTY3JlZW5zT25TY3JlZW4uZm9yRWFjaCgobmV4dEJ1bGxldFNjcmVlbk9uU2NyZWVuKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8v5by55bmV5LiN5Zyo5rWB5Lit77yM5piv5Zu65a6a5by55bmVXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0QnVsbGV0U2NyZWVuT25TY3JlZW4uYnVsbGV0U2NyZWVuLnR5cGUgIT0gYnVsbGV0U2NyZWVuLnR5cGUpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8v5LiN5piv5ZCM5LiA56eN57G75Z6L55qE5by55bmVXG4gICAgICAgICAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW4udHlwZSA9PT0gQnVsbGV0U2NyZWVuVHlwZS50b3ApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5aaC5p6c5paw5by55bmV5Zyo5b2T5YmN5by55bmV5LiK5pa55LiU5pyq5LiO5b2T5YmN5by55bmV6YeN5Y+gXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuT25TY3JlZW4ueSArIGJ1bGxldFNjcmVlbk9uU2NyZWVuLmhlaWdodCA8IG5leHRCdWxsZXRTY3JlZW5PblNjcmVlbi55KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGFkZDogeyBhZGRUb1VwOiB0cnVlLCBlbGVtZW50OiBzZXRBY3R1YWxZKGJ1bGxldFNjcmVlbk9uU2NyZWVuKSB9LCBzdG9wOiB0cnVlIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WmguaenOS4iuS4gOadoeW8ueW5leeahOa2iOWkseaXtumXtOWwj+S6juW9k+WJjeW8ueW5leeahOWHuueOsOaXtumXtFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRCdWxsZXRTY3JlZW5PblNjcmVlbi5lbmRUaW1lIDwgbm93VGltZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi55ID0gbmV4dEJ1bGxldFNjcmVlbk9uU2NyZWVuLnk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4ueSA9IG5leHRCdWxsZXRTY3JlZW5PblNjcmVlbi55ICsgbmV4dEJ1bGxldFNjcmVlbk9uU2NyZWVuLmhlaWdodCArIF9vcHRpb25zLnZlcnRpY2FsSW50ZXJ2YWw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WmguaenOaWsOW8ueW5leWcqOW9k+WJjeW8ueW5leS4i+aWueS4lOacquS4juW9k+WJjeW8ueW5lemHjeWPoFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbk9uU2NyZWVuLnkgPiBuZXh0QnVsbGV0U2NyZWVuT25TY3JlZW4ueSArIG5leHRCdWxsZXRTY3JlZW5PblNjcmVlbi5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBhZGQ6IHsgYWRkVG9VcDogdHJ1ZSwgZWxlbWVudDogc2V0QWN0dWFsWShidWxsZXRTY3JlZW5PblNjcmVlbikgfSwgc3RvcDogdHJ1ZSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpzkuIrkuIDmnaHlvLnluZXnmoTmtojlpLHml7bpl7TlsI/kuo7lvZPliY3lvLnluZXnmoTlh7rnjrDml7bpl7RcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXh0QnVsbGV0U2NyZWVuT25TY3JlZW4uZW5kVGltZSA8IG5vd1RpbWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4ueSA9IG5leHRCdWxsZXRTY3JlZW5PblNjcmVlbi55O1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnkgPSBuZXh0QnVsbGV0U2NyZWVuT25TY3JlZW4ueSAtIGJ1bGxldFNjcmVlbk9uU2NyZWVuLmhlaWdodCAtIF9vcHRpb25zLnZlcnRpY2FsSW50ZXJ2YWw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8v5b2T5YmN5by55bmV57uP6L+H5LiA5Liq54K56ZyA6KaB55qE5oC75pe26ZW/XG4gICAgICAgICAgICAgICAgbGV0IGJ1bGxldFNjcmVlbk9uU2NyZWVuV2lkdGhUaW1lID0gYnVsbGV0U2NyZWVuT25TY3JlZW4ud2lkdGggLyAoYnVsbGV0U2NyZWVuLnN0eWxlLnNwZWVkICogX29wdGlvbnMucGxheVNwZWVkKTtcbiAgICAgICAgICAgICAgICBfYnVsbGV0U2NyZWVuc09uU2NyZWVuLmZvckVhY2goKG5leHRCdWxsZXRTY3JlZW5PblNjcmVlbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvL+W8ueW5leWcqOa1geS4re+8jOaYr+enu+WKqOW8ueW5lVxuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEJ1bGxldFNjcmVlbk9uU2NyZWVuLmJ1bGxldFNjcmVlbi50eXBlID09PSBCdWxsZXRTY3JlZW5UeXBlLnRvcCB8fCBuZXh0QnVsbGV0U2NyZWVuT25TY3JlZW4uYnVsbGV0U2NyZWVuLnR5cGUgPT09IEJ1bGxldFNjcmVlblR5cGUuYm90dG9tKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuOyAvL+W8ueW5leS4jeWcqOa1geS4re+8jOS4uuWbuuWumuW8ueW5lVxuICAgICAgICAgICAgICAgICAgICAvL+WmguaenOaWsOW8ueW5leWcqOW9k+WJjeW8ueW5leS4iuaWueS4lOacquS4juW9k+WJjeW8ueW5lemHjeWPoFxuICAgICAgICAgICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuT25TY3JlZW4ueSArIGJ1bGxldFNjcmVlbk9uU2NyZWVuLmhlaWdodCA8IG5leHRCdWxsZXRTY3JlZW5PblNjcmVlbi55KVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgYWRkOiB7IGFkZFRvVXA6IHRydWUsIGVsZW1lbnQ6IHNldEFjdHVhbFkoYnVsbGV0U2NyZWVuT25TY3JlZW4pIH0sIHN0b3A6IHRydWUgfTtcbiAgICAgICAgICAgICAgICAgICAgLy/kuIrkuIDmnaHlvLnluZXnu4/ov4fkuIDkuKrngrnpnIDopoHnmoTmgLvml7bplb9cbiAgICAgICAgICAgICAgICAgICAgbGV0IG5leHRCdWxsZXRTY3JlZW5PblNjcmVlbldpZHRoVGltZSA9IG5leHRCdWxsZXRTY3JlZW5PblNjcmVlbi53aWR0aCAvIChuZXh0QnVsbGV0U2NyZWVuT25TY3JlZW4uYnVsbGV0U2NyZWVuLnN0eWxlLnNwZWVkICogX29wdGlvbnMucGxheVNwZWVkKTtcbiAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpzkuIrkuIDmnaHlvLnluZXnmoTmtojlpLHml7bpl7TlsI/kuo7lvZPliY3lvLnluZXnmoTlh7rnjrDml7bpl7RcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRCdWxsZXRTY3JlZW5PblNjcmVlbi5zdGFydFRpbWUgKyBuZXh0QnVsbGV0U2NyZWVuT25TY3JlZW5XaWR0aFRpbWUgPj0gbm93VGltZSB8fCAvL+WmguaenOS4iuS4gOadoeW8ueW5leeahOWktOi/m+WFpeS6hu+8jOS9huaYr+Wwvui/mOayoei/m+WFpVxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEJ1bGxldFNjcmVlbk9uU2NyZWVuLmVuZFRpbWUgPj0gYnVsbGV0U2NyZWVuT25TY3JlZW4uZW5kVGltZSAtIGJ1bGxldFNjcmVlbk9uU2NyZWVuV2lkdGhUaW1lKSAvL+WmguaenOW9k+WJjeW8ueW5leWktOWHuuWOu+S6hu+8jOS4iuS4gOadoeW8ueW5leWwvui/mOayoeWHuuWOu1xuICAgICAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4ueSA9IG5leHRCdWxsZXRTY3JlZW5PblNjcmVlbi55ICsgbmV4dEJ1bGxldFNjcmVlbk9uU2NyZWVuLmhlaWdodCArIF9vcHRpb25zLnZlcnRpY2FsSW50ZXJ2YWw7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnkgPSBuZXh0QnVsbGV0U2NyZWVuT25TY3JlZW4ueTtcbiAgICAgICAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfYnVsbGV0U2NyZWVuc09uU2NyZWVuLmdldExlbmd0aCgpID09PSBvbGRMZW5ndGgpXG4gICAgICAgICAgICAgICAgX2J1bGxldFNjcmVlbnNPblNjcmVlbi5wdXNoKHNldEFjdHVhbFkoYnVsbGV0U2NyZWVuT25TY3JlZW4pLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog6K6+572u55yf5a6e55qEWeWdkOagh1xuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gYnVsbGV0U2NyZWVuT25TY3JlZW4gLSDlsY/luZXlvLnluZXkuovku7ZcbiAgICAgICAgICogQHJldHVybnMge29iamVjdH0g5bGP5bmV5by55bmV5LqL5Lu2XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBzZXRBY3R1YWxZKGJ1bGxldFNjcmVlbk9uU2NyZWVuKSB7XG4gICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuID0gYnVsbGV0U2NyZWVuT25TY3JlZW4uYnVsbGV0U2NyZWVuO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbi50eXBlID09PSBCdWxsZXRTY3JlZW5UeXBlLmxlZnRUb1JpZ2h0IHx8XG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuLnR5cGUgPT09IEJ1bGxldFNjcmVlblR5cGUucmlnaHRUb0xlZnQgfHxcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW4udHlwZSA9PT0gQnVsbGV0U2NyZWVuVHlwZS50b3BcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLmFjdHVhbFkgPSBidWxsZXRTY3JlZW5PblNjcmVlbi55ICUgKF9lbGVtZW50U2l6ZS5oZWlnaHQgLSBidWxsZXRTY3JlZW5PblNjcmVlbi5oZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoYnVsbGV0U2NyZWVuLnR5cGUgPT09IEJ1bGxldFNjcmVlblR5cGUuYm90dG9tKSB7XG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4uYWN0dWFsWSA9IF9lbGVtZW50U2l6ZS5oZWlnaHQgKyBidWxsZXRTY3JlZW5PblNjcmVlbi55ICUgX2VsZW1lbnRTaXplLmhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBidWxsZXRTY3JlZW5PblNjcmVlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDorr7nva7lsLrlr7hcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHNldFNpemUoKSB7XG4gICAgICAgICAgICBsZXQgZGV2aWNlUGl4ZWxSYXRpbyA9IEhlbHBlci5nZXREZXZpY2VQaXhlbFJhdGlvKCk7XG4gICAgICAgICAgICBpZiAoX29sZERldmljZVBpeGVsUmF0aW8gIT0gZGV2aWNlUGl4ZWxSYXRpbyB8fFxuICAgICAgICAgICAgICAgIF9vbGRDbGllbnRXaWR0aCAhPSBlbGVtZW50LmNsaWVudFdpZHRoIHx8XG4gICAgICAgICAgICAgICAgX29sZENsaWVudEhlaWdodCAhPSBlbGVtZW50LmNsaWVudEhlaWdodCB8fFxuICAgICAgICAgICAgICAgIF9vbGRTY2FsaW5nICE9IF9vcHRpb25zLnNjYWxpbmcpIHtcbiAgICAgICAgICAgICAgICBfb2xkU2NhbGluZyA9IF9vcHRpb25zLnNjYWxpbmc7XG4gICAgICAgICAgICAgICAgX2VsZW1lbnRTaXplLndpZHRoID0gZWxlbWVudC5jbGllbnRXaWR0aCAvIF9vcHRpb25zLnNjYWxpbmc7XG4gICAgICAgICAgICAgICAgX2VsZW1lbnRTaXplLmhlaWdodCA9IGVsZW1lbnQuY2xpZW50SGVpZ2h0IC8gX29wdGlvbnMuc2NhbGluZztcbiAgICAgICAgICAgICAgICBfb2xkQ2xpZW50V2lkdGggPSBlbGVtZW50LmNsaWVudFdpZHRoO1xuICAgICAgICAgICAgICAgIF9vbGRDbGllbnRIZWlnaHQgPSBlbGVtZW50LmNsaWVudEhlaWdodDtcbiAgICAgICAgICAgICAgICBfb2xkRGV2aWNlUGl4ZWxSYXRpbyA9IGRldmljZVBpeGVsUmF0aW87XG4gICAgICAgICAgICAgICAgX3JlbmRlcmVyLnNldFNpemUoKTtcbiAgICAgICAgICAgICAgICBpZiAoIV9wbGF5aW5nKSBfcmVuZGVyZXIuZHJhdygpOyAvL+mdnuaSreaUvueKtuaAgeWImemHjee7mFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9JRSBFZGdlIOa1j+iniOWZqOS4jeaUr+aMgSAlY1xuICAgICAgICBpZiAoISF3aW5kb3cuQWN0aXZlWE9iamVjdCB8fCBcIkFjdGl2ZVhPYmplY3RcIiBpbiB3aW5kb3cgfHwgbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiVHJpZGVudFwiKSA+IC0xIHx8XG4gICAgICAgICAgICBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFXCIpID4gLTEgfHwgbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiRWRnZVwiKSA+IC0xKSBjb25zb2xlLmluZm8oXG4gICAgICAgICAgICAgICAgUmVzb3VyY2VzLkxPQURFRF9JTkZPX0lFLmZpbGxEYXRhKGJ1aWxkKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgLy9PdGhlclxuICAgICAgICBlbHNlIGNvbnNvbGUuaW5mbyhcbiAgICAgICAgICAgIFJlc291cmNlcy5MT0FERURfSU5GTy5maWxsRGF0YShidWlsZCksXG4gICAgICAgICAgICAnZm9udC13ZWlnaHQ6Ym9sZDsgY29sb3I6IzAwOTlGRjsnLCAnJywgJ2ZvbnQtc3R5bGU6aXRhbGljOycsICcnXG4gICAgICAgICk7XG4gICAgfVxufVxuZXhwb3J0IHsgQnVsbGV0U2NyZWVuRW5naW5lIH0iXSwiZmlsZSI6ImJ1bGxldFNjcmVlbkVuZ2luZS5qcyJ9
