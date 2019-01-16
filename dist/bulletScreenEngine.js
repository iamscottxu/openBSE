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
        bulletScreenOnScreen.endTime = parseInt(nowTime + (_elementSize.width + bulletScreenOnScreen.width) / (bulletScreen.style.speed * _options.playSpeed));
        bulletScreenOnScreen.x = _elementSize.width;
        bulletScreenOnScreen.y = _options.verticalInterval;
        break;

      case _bulletScreenType2.BulletScreenType.leftToRight:
        bulletScreenOnScreen.endTime = parseInt(nowTime + (_elementSize.width + bulletScreenOnScreen.width) / (bulletScreen.style.speed * _options.playSpeed));
        bulletScreenOnScreen.x = -bulletScreenOnScreen.width;
        bulletScreenOnScreen.y = _options.verticalInterval;
        break;

      case _bulletScreenType2.BulletScreenType.top:
        bulletScreenOnScreen.endTime = bulletScreenOnScreen.startTime + bulletScreen.style.residenceTime * _options.playSpeed;
        bulletScreenOnScreen.x = parseInt((_elementSize.width - bulletScreenOnScreen.width) / 2);
        bulletScreenOnScreen.y = _options.verticalInterval;
        break;

      case _bulletScreenType2.BulletScreenType.bottom:
        bulletScreenOnScreen.endTime = bulletScreenOnScreen.startTime + bulletScreen.style.residenceTime * _options.playSpeed;
        bulletScreenOnScreen.x = parseInt((_elementSize.width - bulletScreenOnScreen.width) / 2);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1bGxldFNjcmVlbkVuZ2luZS5qcyJdLCJuYW1lcyI6WyJCdWxsZXRTY3JlZW5FbmdpbmUiLCJlbGVtZW50Iiwib3B0aW9ucyIsInJlbmRlck1vZGUiLCJfc3RhcnRUaW1lIiwiX3BhdXNlVGltZSIsIl9idWxsZXRTY3JlZW5zIiwiTGlua2VkTGlzdCIsIl9idWxsZXRTY3JlZW5zT25TY3JlZW4iLCJfZGVsYXlCdWxsZXRTY3JlZW5zQ291bnQiLCJfZGVsYXkiLCJfcGxheWluZyIsIl9yZWZyZXNoUmF0ZSIsIl9sYXN0UmVmcmVzaFRpbWUiLCJfb3B0aW9ucyIsIl9kZWZhdWx0T3B0aW9ucyIsInZlcnRpY2FsSW50ZXJ2YWwiLCJwbGF5U3BlZWQiLCJjbG9jayIsInRpbWUiLCJEYXRlIiwiZ2V0VGltZSIsInNjYWxpbmciLCJ0aW1lT3V0RGlzY2FyZCIsImhpZGRlblR5cGVzIiwib3BhY2l0eSIsImN1cnNvck9uTW91c2VPdmVyIiwiZGVmYXVsdFN0eWxlIiwic2hhZG93Qmx1ciIsImZvbnRXZWlnaHQiLCJmb250RmFtaWx5Iiwic2l6ZSIsImJveENvbG9yIiwiY29sb3IiLCJib3JkZXJDb2xvciIsInNwZWVkIiwicmVzaWRlbmNlVGltZSIsIl9vcHRpb25zVHlwZSIsIl9kZWZhdWx0QnVsbGV0U2NyZWVuIiwidGV4dCIsImNhbkRpc2NhcmQiLCJzdGFydFRpbWUiLCJ0eXBlIiwiQnVsbGV0U2NyZWVuVHlwZSIsInJpZ2h0VG9MZWZ0IiwibGF5ZXIiLCJfYnVsbGV0U2NyZWVuVHlwZSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIndpbmRvdyIsImNvbnNvbGUiLCJ3YXJuIiwiUmVzb3VyY2VzIiwiUkVRVUVTVEFOSU1BVElPTkZSQU1FX05PVF9TVVBQT1JUX1dBUk4iLCJmdW4iLCJzZXRUaW1lb3V0IiwiSGVscGVyIiwic2V0VmFsdWVzIiwiX2V2ZW50IiwiRXZlbnQiLCJhZGQiLCJiaW5kIiwidW5iaW5kIiwiX2VsZW1lbnRTaXplIiwid2lkdGgiLCJjbGllbnRXaWR0aCIsImhlaWdodCIsImNsaWVudEhlaWdodCIsIl9vbGREZXZpY2VQaXhlbFJhdGlvIiwiZ2V0RGV2aWNlUGl4ZWxSYXRpbyIsIl9vbGRTY2FsaW5nIiwiX29sZENsaWVudFdpZHRoIiwiX29sZENsaWVudEhlaWdodCIsIl9vbGRIaWRkZW5UeXBlcyIsIl9vbGRPcGFjaXR5IiwicmVuZGVyZXJzRmFjdG9yeSIsIlJlbmRlcmVyc0ZhY3RvcnkiLCJidWxsZXRTY3JlZW5FdmVudFRyaWdnZXIiLCJfcmVuZGVyZXIiLCJnZXRSZW5kZXJlciIsInNldEludGVydmFsIiwic2V0U2l6ZSIsInNldE9wdGlvbnMiLCJkcmF3Iiwic2V0T3BhY2l0eSIsImdldE9wdGlvbnMiLCJhZGRCdWxsZXRTY3JlZW4iLCJidWxsZXRTY3JlZW4iLCJsZWZ0VG9SaWdodCIsInRvcCIsImJvdHRvbSIsIlR5cGVFcnJvciIsIlBBUkFNRVRFUlNfVFlQRV9FUlJPUiIsImNoZWNrVHlwZXMiLCJzdHlsZSIsIm9sZExlbmd0aCIsImdldExlbmd0aCIsImZvckVhY2giLCJsYXN0QnVsbGV0U2NyZWVuIiwiYWRkVG9VcCIsInN0b3AiLCJwdXNoIiwicGxheSIsInJlZnJlc2giLCJwbGF5QWxsQnVsbGV0U2NyZWVucyIsImJ1bGxldFNjcmVlbk9uU2NyZWVuIiwicGF1c2UiLCJjbGVhbkJ1bGxldFNjcmVlbkxpc3QiLCJjbGVhbiIsImNsZWFuU2NyZWVuIiwiaGlkZSIsInNob3ciLCJnZXRWaXNpYmlsaXR5IiwiZ2V0UmVuZGVyTW9kZSIsImdldFBsYXlTdGF0ZSIsImdldERlYnVnSW5mbyIsImJ1bGxldFNjcmVlbnNPblNjcmVlbkNvdW50IiwiYnVsbGV0U2NyZWVuc0NvdW50IiwiZGVsYXkiLCJkZWxheUJ1bGxldFNjcmVlbnNDb3VudCIsImZwcyIsIk1hdGgiLCJmbG9vciIsIm5hbWUiLCJlIiwicGFnZVgiLCJkb2MiLCJkb2N1bWVudCIsImRvY3VtZW50RWxlbWVudCIsImJvZHkiLCJjbGllbnRYIiwic2Nyb2xsTGVmdCIsImNsaWVudExlZnQiLCJwYWdlWSIsImNsaWVudFkiLCJzY3JvbGxUb3AiLCJjbGllbnRUb3AiLCJ0cmlnZ2VyIiwiZ2V0QnVsbGV0U2NyZWVuIiwiY2xvbmUiLCJzZXRCdWxsZXRTY3JlZW4iLCJyZWRyYXciLCJidWxsZXRTY3JlZW5UeXBlIiwicmVDcmVhdEFuZGdldFdpZHRoIiwic2V0UGxheVN0YXRlIiwic2NyZWVuWCIsInNjcmVlblkiLCJub3dUaW1lIiwiYWRkQnVsbGV0U2NyZWVuc1RvU2NyZWVuIiwibW92ZUJ1bGxldFNjcmVlbk9uU2NyZWVuIiwieCIsImRlbGV0ZSIsInJlbW92ZSIsImVuZFRpbWUiLCJ0aW1lcyIsInBvcCIsImdldEJ1bGxldFNjcmVlbk9uU2NyZWVuIiwiY3JlYXRBbmRnZXRXaWR0aCIsInBhcnNlSW50IiwieSIsIm5leHRCdWxsZXRTY3JlZW5PblNjcmVlbiIsInNldEFjdHVhbFkiLCJidWxsZXRTY3JlZW5PblNjcmVlbldpZHRoVGltZSIsIm5leHRCdWxsZXRTY3JlZW5PblNjcmVlbldpZHRoVGltZSIsImFjdHVhbFkiLCJkZXZpY2VQaXhlbFJhdGlvIiwiQWN0aXZlWE9iamVjdCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsImluZGV4T2YiLCJpbmZvIiwiTE9BREVEX0lORk9fSUUiLCJmaWxsRGF0YSIsImJ1aWxkIiwiTE9BREVEX0lORk8iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7SUFNTUEsa0I7QUFDRjs7Ozs7O0FBTUEsNEJBQVlDLE9BQVosRUFBcUJDLE9BQXJCLEVBQXFEO0FBQUEsTUFBdkJDLFVBQXVCLHVFQUFWLFFBQVU7O0FBQUE7O0FBRWpEOzs7O0FBSUEsTUFBSUMsVUFBSjtBQUNBOzs7Ozs7QUFJQSxNQUFJQyxVQUFVLEdBQUcsQ0FBakI7QUFDQTs7Ozs7QUFJQSxNQUFJQyxjQUFjLEdBQUcsSUFBSUMsc0JBQUosRUFBckI7QUFD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QVMsQ0FBQ0MsU0FBVixDQUFvQkMsT0FBcEIsQ0FBNEIsU0FBNUIsSUFBeUMsQ0FBQyxDQUFqRyxJQUNBRixTQUFTLENBQUNDLFNBQVYsQ0FBb0JDLE9BQXBCLENBQTRCLE1BQTVCLElBQXNDLENBQUMsQ0FEdkMsSUFDNENGLFNBQVMsQ0FBQ0MsU0FBVixDQUFvQkMsT0FBcEIsQ0FBNEIsTUFBNUIsSUFBc0MsQ0FBQyxDQUR2RixFQUMwRnZILE9BQU8sQ0FBQ3dILElBQVIsQ0FDbEZ0SCxxQkFBVXVILGNBQVYsQ0FBeUJDLFFBQXpCLENBQWtDQyxLQUFsQyxDQURrRixFQUQxRixLQUtLM0gsT0FBTyxDQUFDd0gsSUFBUixDQUNEdEgscUJBQVUwSCxXQUFWLENBQXNCRixRQUF0QixDQUErQkMsS0FBL0IsQ0FEQyxFQUVELGtDQUZDLEVBRW1DLEVBRm5DLEVBRXVDLG9CQUZ2QyxFQUU2RCxFQUY3RDtBQUlSLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMaW5rZWRMaXN0IH0gZnJvbSAnLi9saWIvbGlua2VkTGlzdCdcclxuaW1wb3J0IHsgRXZlbnQgfSBmcm9tICcuL2xpYi9ldmVudCdcclxuaW1wb3J0IHsgUmVuZGVyZXJzRmFjdG9yeSB9IGZyb20gJy4vbGliL3JlbmRlcmVycy9yZW5kZXJlcnNGYWN0b3J5J1xyXG5pbXBvcnQgeyBCdWxsZXRTY3JlZW5UeXBlIH0gZnJvbSAnLi9idWxsZXRTY3JlZW5UeXBlJ1xyXG5pbXBvcnQgeyBIZWxwZXIgfSBmcm9tICcuL2xpYi9oZWxwZXInXHJcbmltcG9ydCB7IFJlc291cmNlcyB9IGZyb20gJy4vbGliL3Jlc291cmNlcydcclxuaW1wb3J0ICogYXMgYnVpbGQgZnJvbSAnLi9idWlsZC5qc29uJ1xyXG5cclxuLyoqIFxyXG4gKiDlvLnluZXlvJXmk47lr7nosaHnsbsgXHJcbiAqIEBhbGlhcyBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZVxyXG4gKiBAdGhyb3dzIHtvcGVuQlNFLkJyb3dzZXJOb3RTdXBwb3J0RXJyb3J9IOa1j+iniOWZqOS4jeaUr+aMgeeJueWumua4suafk+aooeW8j+aXtuW8leWPkemUmeivr+OAglxyXG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9IOS8oOWFpeeahOWPguaVsOmUmeivr+aXtuW8leWPkemUmeivr+OAguivt+WPgumYhSBNRE4gW1R5cGVFcnJvcl17QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvemgtQ04vZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvVHlwZUVycm9yfSDjgIJcclxuICovXHJcbmNsYXNzIEJ1bGxldFNjcmVlbkVuZ2luZSB7XHJcbiAgICAvKipcclxuICAgICAqIOWIm+W7uuS4gOS4quW8ueW5leW8leaTjuWvueixoeOAglxyXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IC0g6KaB5Yqg6L295by55bmV55qE5YWD57Sg77ya5pyJ5YWzIEVsZW1lbnQg5o6l5Y+j55qE5L+h5oGv6K+35Y+C6ZiFTUROIFtFbGVtZW50XXtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy96aC1DTi9kb2NzL1dlYi9BUEkvRWxlbWVudH0g44CCXHJcbiAgICAgKiBAcGFyYW0ge29wZW5CU0V+T3B0aW9uc30gW19vcHRpb25zXSAtIOWFqOWxgOmAiemhue+8muS4gOS4qiB7QGxpbmsgb3BlbkJTRX5PcHRpb25zfSDnu5PmnoTjgIJcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbcmVuZGVyTW9kZT1cImNhbnZhc1wiXSAtIOa4suafk+aooeW8j++8mum7mOiupOS4uuKAnGNhbnZhc+KAnSwg4oCc5Y+v6YCJY3NzM+KAne+8jCDigJx3ZWJnbOKAneWSjOKAnHN2Z+KAneOAguS4gOiIrOW7uuiuruS9v+eUqOKAnGNhbnZhc+KAne+8iOeJueWIq+aYryBGaXJlRm94IOa1j+iniOWZqCBDU1MzIOa4suafk+aViOeOh+i+g+S9ju+8ieOAguWcqOS4gOS6m+eJiOacrOi+g+iAgeeahOa1j+iniOWZqOS4reKAnHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlv4oCd5Y+Y6YeP5LiN6KKr5pSv5oyB5oiW5pSv5oyB5LiN5a6M5pW077yM6L+Z5Lya5a+86Ie05Zyo6auYRFBJ5ZKM6aG16Z2i6KKr57yp5pS+55qE5oOF5Ya15LiL4oCcY2FudmFz4oCd5ZKM4oCcd2ViZ2zigJ3muLLmn5PmqKHlvI/lvLnluZXmmL7npLrkuI3mraPluLjnmoTmg4XlhrXvvIjlvLnluZXmqKHns4rvvInvvIzmraTml7blu7rorq7kvb/nlKjigJxjc3Mz4oCd5riy5p+T5qih5byP44CCXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMsIHJlbmRlck1vZGUgPSAnY2FudmFzJykge1xyXG4gICAgICAgIC8v5Y+Y6YeP5Yid5aeL5YyWXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5byA5aeL5pe26Ze0XHJcbiAgICAgICAgICogQHByaXZhdGUgQHR5cGUge251bWJlcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgX3N0YXJ0VGltZTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmmoLlgZzml7bpl7RcclxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCBfcGF1c2VUaW1lID0gMDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDliankvZnlvLnluZVcclxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7TGlua2VkTGlzdH1cclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgX2J1bGxldFNjcmVlbnMgPSBuZXcgTGlua2VkTGlzdCgpO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWxj+W5leS4iueahOW8ueW5lVxyXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtMaW5rZWRMaXN0fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCBfYnVsbGV0U2NyZWVuc09uU2NyZWVuID0gbmV3IExpbmtlZExpc3QoKTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDlu7bov5/lvLnluZXmgLvmlbBcclxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCBfZGVsYXlCdWxsZXRTY3JlZW5zQ291bnQgPSAwO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOW7tui/n++8iOWNleS9je+8muavq+enku+8iVxyXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IF9kZWxheSA9IDA7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5pKt5pS+5qCH5b+XXHJcbiAgICAgICAgICogQHByaXZhdGUgQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IF9wbGF5aW5nO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWIt+aWsOmikeeOh1xyXG4gICAgICAgICAqIEBwcml2YXRlIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IF9yZWZyZXNoUmF0ZSA9IDAuMDY7IC8v5Yid5aeL5Yi35paw6aKR546HXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5LiK5LiA5qyh5Yi35paw5pe26Ze0XHJcbiAgICAgICAgICogQHByaXZhdGUgQHR5cGUge251bWJlcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgX2xhc3RSZWZyZXNoVGltZTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDlhajlsYDpgInpoblcclxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7b3BlbkJTRX5PcHRpb25zfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCBfb3B0aW9ucztcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDpu5jorqTlhajlsYDlj5jph49cclxuICAgICAgICAgKiBAcHJpdmF0ZSBAcmVhZG9ubHlcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdCBfZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIC8qKiDlnoLnm7Tpl7Tot50gKi9cclxuICAgICAgICAgICAgdmVydGljYWxJbnRlcnZhbDogOCxcclxuICAgICAgICAgICAgLyoqIOaSreaUvumAn+W6pijlgI3mlbApICovXHJcbiAgICAgICAgICAgIHBsYXlTcGVlZDogMSxcclxuICAgICAgICAgICAgLyoqIOaXtumXtOWfuuWHhiAqL1xyXG4gICAgICAgICAgICBjbG9jazogdGltZSA9PiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIF9zdGFydFRpbWUsXHJcbiAgICAgICAgICAgIC8qKiDnvKnmlL7mr5TkvosgKi9cclxuICAgICAgICAgICAgc2NhbGluZzogMSxcclxuICAgICAgICAgICAgLyoqIOi2heaXtuS4ouW8gyAqL1xyXG4gICAgICAgICAgICB0aW1lT3V0RGlzY2FyZDogdHJ1ZSxcclxuICAgICAgICAgICAgLyoqIOimgemakOiXj+eahOW8ueW5leexu+WeiyAqL1xyXG4gICAgICAgICAgICBoaWRkZW5UeXBlczogMCxcclxuICAgICAgICAgICAgLyoqIOW8ueW5leS4jemAj+aYjuW6piAqL1xyXG4gICAgICAgICAgICBvcGFjaXR5OiAxLFxyXG4gICAgICAgICAgICAvKiog6byg5qCH57uP6L+H5qC35byPICovXHJcbiAgICAgICAgICAgIGN1cnNvck9uTW91c2VPdmVyOiAncG9pbnRlcicsXHJcbiAgICAgICAgICAgIC8qKiDpu5jorqTlvLnluZXmoLflvI8gKi9cclxuICAgICAgICAgICAgZGVmYXVsdFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAvKiog6Zi05b2x55qE5qih57OK57qn5Yir77yMMOS4uuS4jeaYvuekuumYtOW9sSAqL1xyXG4gICAgICAgICAgICAgICAgc2hhZG93Qmx1cjogMixcclxuICAgICAgICAgICAgICAgIC8qKiDlrZfkvZPnspfnu4YgKi9cclxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICc2MDAnLFxyXG4gICAgICAgICAgICAgICAgLyoqIOWtl+S9k+ezu+WIlyAqL1xyXG4gICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ3NhbnMtc2VyaWYnLFxyXG4gICAgICAgICAgICAgICAgLyoqIOWtl+S9k+Wkp+Wwj++8iOWNleS9je+8muWDj+e0oO+8iSAqL1xyXG4gICAgICAgICAgICAgICAgc2l6ZTogMjUsXHJcbiAgICAgICAgICAgICAgICAvKiog5aSW5qGG6aKc6ImyICovXHJcbiAgICAgICAgICAgICAgICBib3hDb2xvcjogbnVsbCxcclxuICAgICAgICAgICAgICAgIC8qKiDlrZfkvZPpopzoibIgKi9cclxuICAgICAgICAgICAgICAgIGNvbG9yOiAnd2hpdGUnLFxyXG4gICAgICAgICAgICAgICAgLyoqIOaPj+i+ueminOiJsiAqL1xyXG4gICAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAvKiog5by55bmV6YCf5bqm77yI5Y2V5L2N77ya5YOP57SgL+avq+enku+8iSDku4XmtYHlvLnluZXnsbvlnovmnInmlYggKi9cclxuICAgICAgICAgICAgICAgIHNwZWVkOiAwLjE1LFxyXG4gICAgICAgICAgICAgICAgLyoqIOW8ueW5leWBnOeVmeaXtumXtCDku4Xlm7rlrprlvLnluZXnsbvlnovmnInmlYggKi9cclxuICAgICAgICAgICAgICAgIHJlc2lkZW5jZVRpbWU6IDUwMDBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5YWo5bGA6YCJ6aG557G75Z6LXHJcbiAgICAgICAgICogQHByaXZhdGUgQHJlYWRvbmx5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3QgX29wdGlvbnNUeXBlID0ge1xyXG4gICAgICAgICAgICB2ZXJ0aWNhbEludGVydmFsOiAnbnVtYmVyJyxcclxuICAgICAgICAgICAgcGxheVNwZWVkOiAnbnVtYmVyJyxcclxuICAgICAgICAgICAgY2xvY2s6ICdmdW5jdGlvbicsXHJcbiAgICAgICAgICAgIHNjYWxpbmc6ICdudW1iZXInLFxyXG4gICAgICAgICAgICB0aW1lT3V0RGlzY2FyZDogJ2Jvb2xlYW4nLFxyXG4gICAgICAgICAgICBoaWRkZW5UeXBlczogJ251bWJlcicsXHJcbiAgICAgICAgICAgIG9wYWNpdHk6ICdudW1iZXInLFxyXG4gICAgICAgICAgICBjdXJzb3JPbk1vdXNlT3ZlcjogJ3N0cmluZycsXHJcbiAgICAgICAgICAgIGRlZmF1bHRTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgc2hhZG93Qmx1cjogJ251bWJlcicsXHJcbiAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBbJ3N0cmluZycsICdudW1iZXInXSxcclxuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICdzdHJpbmcnLFxyXG4gICAgICAgICAgICAgICAgc2l6ZTogJ251bWJlcicsXHJcbiAgICAgICAgICAgICAgICBib3hDb2xvcjogWydzdHJpbmcnLCAnbnVsbCddLFxyXG4gICAgICAgICAgICAgICAgY29sb3I6ICdzdHJpbmcnLFxyXG4gICAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6IFsnc3RyaW5nJywgJ251bGwnXSxcclxuICAgICAgICAgICAgICAgIHNwZWVkOiAnbnVtYmVyJyxcclxuICAgICAgICAgICAgICAgIHJlc2lkZW5jZVRpbWU6ICdudW1iZXInXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOm7mOiupOW8ueW5leaVsOaNrlxyXG4gICAgICAgICAqIEBwcml2YXRlIEByZWFkb25seVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0IF9kZWZhdWx0QnVsbGV0U2NyZWVuID0ge1xyXG4gICAgICAgICAgICAvKiog5by55bmV5paH5pysICovXHJcbiAgICAgICAgICAgIHRleHQ6IG51bGwsXHJcbiAgICAgICAgICAgIC8qKiDmmK/lkKblhYHorrjkuKLlvIMgKi9cclxuICAgICAgICAgICAgY2FuRGlzY2FyZDogdHJ1ZSxcclxuICAgICAgICAgICAgLyoqIOW8ueW5lei/m+WFpeaXtumXtCAqL1xyXG4gICAgICAgICAgICBzdGFydFRpbWU6IG51bGwsXHJcbiAgICAgICAgICAgIC8qKiDlvLnluZXnsbvlnosgKi9cclxuICAgICAgICAgICAgdHlwZTogQnVsbGV0U2NyZWVuVHlwZS5yaWdodFRvTGVmdCxcclxuICAgICAgICAgICAgLyoqIOW8ueW5leWxgue6p++8iOi2iuWkp+i2iuWJje+8iSAqL1xyXG4gICAgICAgICAgICBsYXllcjogMFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5by55bmV5pWw5o2u57G75Z6LXHJcbiAgICAgICAgICogQHByaXZhdGUgQHJlYWRvbmx5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3QgX2J1bGxldFNjcmVlblR5cGUgPSB7XHJcbiAgICAgICAgICAgIHRleHQ6ICdzdHJpbmcnLFxyXG4gICAgICAgICAgICBjYW5EaXNjYXJkOiAnYm9vbGVhbicsXHJcbiAgICAgICAgICAgIHN0YXJ0VGltZTogJ251bWJlcicsXHJcbiAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxyXG4gICAgICAgICAgICBsYXllcjogJ251bWJlcidcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHJlcXVlc3RBbmltYXRpb25GcmFtZSDlrprkuYnvvIjkuIDkupvogIHlvI/mtY/op4jlmajkuI3mlK/mjIEgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIO+8iVxyXG4gICAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZ1biAtIOWbnuiwg+aWueazlSBcclxuICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgcmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xyXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gJ2Z1bmN0aW9uJykgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFJlc291cmNlcy5SRVFVRVNUQU5JTUFUSU9ORlJBTUVfTk9UX1NVUFBPUlRfV0FSTik7XHJcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IChmdW4pID0+IHdpbmRvdy5zZXRUaW1lb3V0KGZ1biwgMTcpOyAvLzYwZnBzXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfb3B0aW9ucyA9IEhlbHBlci5zZXRWYWx1ZXMob3B0aW9ucywgX2RlZmF1bHRPcHRpb25zLCBfb3B0aW9uc1R5cGUpOyAvL+iuvue9rum7mOiupOWAvFxyXG5cclxuICAgICAgICAvL+S6i+S7tuWIneWni+WMllxyXG4gICAgICAgIGxldCBfZXZlbnQgPSBuZXcgRXZlbnQoKTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDlvLnluZXljZXlh7vkuovku7bjgILlvZPljZXlh7vlvLnluZXml7bop6blj5HjgIJcclxuICAgICAgICAgKiBAZXZlbnQgb3BlbkJTRS5CdWxsZXRTY3JlZW5FbmdpbmUjY2xpY2tcclxuICAgICAgICAgKiBAcHJvcGVydHkge29wZW5CU0V+QnVsbGV0U2NyZWVuRXZlbnR9IGUgLSDlvLnluZXkuovku7bnu5PmnoRcclxuICAgICAgICAgKi9cclxuICAgICAgICBfZXZlbnQuYWRkKCdjbGljaycpO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOW8ueW5leS4iuS4i+aWh+iPnOWNleS6i+S7tuOAguW9k+inpuWPkeW8ueW5leS4iuS4i+aWh+iPnOWNleaXtuinpuWPkeOAglxyXG4gICAgICAgICAqIEBldmVudCBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZSNjb250ZXh0bWVudVxyXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7b3BlbkJTRX5CdWxsZXRTY3JlZW5FdmVudH0gZSAtIOW8ueW5leS6i+S7tue7k+aehFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIF9ldmVudC5hZGQoJ2NvbnRleHRtZW51Jyk7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiDlvLnluZXpvKDmoIfnprvlvIDkuovku7bjgILlvZPpvKDmoIfnprvlvIDlvLnluZXml7bop6blj5HjgIJcclxuICAgICAgICAqIEBldmVudCBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZSNtb3VzZWxlYXZlXHJcbiAgICAgICAgKiBAcHJvcGVydHkge29wZW5CU0V+QnVsbGV0U2NyZWVuRXZlbnR9IGUgLSDlvLnluZXkuovku7bnu5PmnoRcclxuICAgICAgICAqL1xyXG4gICAgICAgIF9ldmVudC5hZGQoJ21vdXNlbGVhdmUnKTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDlvLnluZXpvKDmoIfov5vlhaXkuovku7bjgILlvZPpvKDmoIfov5vlhaXlvLnluZXml7bop6blj5HjgIJcclxuICAgICAgICAgKiBAZXZlbnQgb3BlbkJTRS5CdWxsZXRTY3JlZW5FbmdpbmUjbW91c2VlbnRlclxyXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7b3BlbkJTRX5CdWxsZXRTY3JlZW5FdmVudH0gZSAtIOW8ueW5leS6i+S7tue7k+aehFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIF9ldmVudC5hZGQoJ21vdXNlZW50ZXInKTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnu5Hlrprkuovku7blpITnkIbnqIvluo9cclxuICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgKiBAZGVzY3JpcHRpb24g57uR5a6a5LqL5Lu25aSE55CG56iL5bqP44CC5b2T5LqL5Lu25aSE55CG56iL5bqP6L+U5Zue5YC85Li6IGZhbHNlIOaXtuWBnOatouWGkuazoeOAglxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0g5LqL5Lu25ZCN56ewXHJcbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZnVuIC0g5LqL5Lu25aSE55CG56iL5bqPXHJcbiAgICAgICAgICogQGxpc3RlbnMgb3BlbkJTRS5CdWxsZXRTY3JlZW5FbmdpbmUjY2xpY2tcclxuICAgICAgICAgKiBAbGlzdGVucyBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZSNjb250ZXh0bWVudVxyXG4gICAgICAgICAqIEBsaXN0ZW5zIG9wZW5CU0UuQnVsbGV0U2NyZWVuRW5naW5lI21vdXNlbGVhdmVcclxuICAgICAgICAgKiBAbGlzdGVucyBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZSNtb3VzZWVudGVyXHJcbiAgICAgICAgICogQHRocm93cyB7VHlwZUVycm9yfSDkvKDlhaXnmoTlj4LmlbDplJnor6/miJbkuovku7bkuI3lrZjlnKjml7blvJXlj5HplJnor6/jgILor7flj4LpmIUgTUROIFtUeXBlRXJyb3Jde0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3poLUNOL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1R5cGVFcnJvcn0g44CCXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5iaW5kID0gX2V2ZW50LmJpbmQ7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog6Kej57uR5LqL5Lu25aSE55CG56iL5bqP77yIZnVu5Li656m66Kej57uR5omA5pyJ5LqL5Lu25aSE55CG56iL5bqP77yJXHJcbiAgICAgICAgICogQGZ1bmN0aW9uXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSDkuovku7blkI3np7BcclxuICAgICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmdW4gLSDkuovku7blpITnkIbnqIvluo9cclxuICAgICAgICAgKiBAdGhyb3dzIHtUeXBlRXJyb3J9IOS8oOWFpeeahOWPguaVsOmUmeivr+aIluS6i+S7tuS4jeWtmOWcqOaXtuW8leWPkemUmeivr+OAguivt+WPgumYhSBNRE4gW1R5cGVFcnJvcl17QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvemgtQ04vZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvVHlwZUVycm9yfSDjgIJcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnVuYmluZCA9IF9ldmVudC51bmJpbmQ7XHJcbiAgICAgICAgLy/liJ3lp4vljJZcclxuICAgICAgICBsZXQgX2VsZW1lbnRTaXplID0ge1xyXG4gICAgICAgICAgICB3aWR0aDogZWxlbWVudC5jbGllbnRXaWR0aCAvIF9vcHRpb25zLnNjYWxpbmcsXHJcbiAgICAgICAgICAgIGhlaWdodDogZWxlbWVudC5jbGllbnRIZWlnaHQgLyBfb3B0aW9ucy5zY2FsaW5nXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBfb2xkRGV2aWNlUGl4ZWxSYXRpbyA9IEhlbHBlci5nZXREZXZpY2VQaXhlbFJhdGlvKCk7XHJcbiAgICAgICAgbGV0IF9vbGRTY2FsaW5nID0gX29wdGlvbnMuc2NhbGluZztcclxuICAgICAgICBsZXQgX29sZENsaWVudFdpZHRoID0gZWxlbWVudC5jbGllbnRXaWR0aDtcclxuICAgICAgICBsZXQgX29sZENsaWVudEhlaWdodCA9IGVsZW1lbnQuY2xpZW50SGVpZ2h0O1xyXG4gICAgICAgIGxldCBfb2xkSGlkZGVuVHlwZXMgPSBfb3B0aW9ucy5oaWRkZW5UeXBlcztcclxuICAgICAgICBsZXQgX29sZE9wYWNpdHkgPSBfb3B0aW9ucy5vcGFjaXR5O1xyXG4gICAgICAgIC8v5riy5p+T5Zmo5bel5Y6CXHJcbiAgICAgICAgbGV0IHJlbmRlcmVyc0ZhY3RvcnkgPSBuZXcgUmVuZGVyZXJzRmFjdG9yeShlbGVtZW50LCBfb3B0aW9ucywgX2VsZW1lbnRTaXplLCBidWxsZXRTY3JlZW5FdmVudFRyaWdnZXIpO1xyXG4gICAgICAgIGxldCBfcmVuZGVyZXIgPSByZW5kZXJlcnNGYWN0b3J5LmdldFJlbmRlcmVyKHJlbmRlck1vZGUpOyAvL+WunuS+i+WMlua4suafk+WZqFxyXG4gICAgICAgIHNldEludGVydmFsKHNldFNpemUsIDEwMCk7XHJcblxyXG4gICAgICAgIC8v5YWs5YWx5Ye95pWwXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOiuvue9ruWFqOWxgOmAiemhuVxyXG4gICAgICAgICAqIEBwYXJhbSB7b3BlbkJTRX5PcHRpb25zfSBvcHRpb25zIC0g5YWo5bGA6YCJ6aG577ya5LiA5LiqIHtAbGluayBvcGVuQlNFfk9wdGlvbnN9IOe7k+aehOOAglxyXG4gICAgICAgICAqIEB0aHJvd3Mge1R5cGVFcnJvcn0g5Lyg5YWl55qE5Y+C5pWw6ZSZ6K+v5pe25byV5Y+R6ZSZ6K+v44CC6K+35Y+C6ZiFIE1ETiBbVHlwZUVycm9yXXtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy96aC1DTi9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9UeXBlRXJyb3J9IOOAglxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIF9vcHRpb25zID0gSGVscGVyLnNldFZhbHVlcyhvcHRpb25zLCBfb3B0aW9ucywgX29wdGlvbnNUeXBlLCBmYWxzZSk7IC8v6K6+572u6buY6K6k5YC8XHJcbiAgICAgICAgICAgIGlmIChfb2xkSGlkZGVuVHlwZXMgIT0gX29wdGlvbnMuaGlkZGVuVHlwZXMpIHtcclxuICAgICAgICAgICAgICAgIF9vbGRIaWRkZW5UeXBlcyA9IF9vcHRpb25zLmhpZGRlblR5cGVzO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFfcGxheWluZykgX3JlbmRlcmVyLmRyYXcoKTsgLy/pnZ7mkq3mlL7nirbmgIHliJnph43nu5hcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoX29sZE9wYWNpdHkgIT0gX29wdGlvbnMub3BhY2l0eSkge1xyXG4gICAgICAgICAgICAgICAgX29sZE9wYWNpdHkgPSBfb3B0aW9ucy5vcGFjaXR5O1xyXG4gICAgICAgICAgICAgICAgX3JlbmRlcmVyLnNldE9wYWNpdHkoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOiOt+WPluWFqOWxgOmAiemhuVxyXG4gICAgICAgICAqIEByZXR1cm5zIHtvcGVuQlNFfk9wdGlvbnN9IOWFqOWxgOmAiemhue+8muS4gOS4qiB7QGxpbmsgb3BlbkJTRX5PcHRpb25zfSDnu5PmnoTjgIJcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmdldE9wdGlvbnMgPSAoKSA9PiBfb3B0aW9ucztcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5re75Yqg5by55bmV5Yiw5by55bmV5YiX6KGo44CCXHJcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIOa3u+WKoOW8ueW5leWIsOW8ueW5leWIl+ihqOOAgueUseS6juW8ueW5leWcqOWxj+W5leS4iuWHuueOsOi/h+WQju+8jOW8ueW5leW8leaTjuWwhuS7juWIl+ihqOS4reW9u+W6leWIoOmZpOatpOW8ueW5leOAguaJgOS7pe+8jOWcqOaUueWPmOaSreaUvui/m+W6puaXtu+8jOWPr+iDvemcgOimgeWFiFvmuIXnqbrlvLnluZXliJfooahde0BsaW5rIG9wZW5CU0UuQnVsbGV0U2NyZWVuRW5naW5lI2NsZWFuQnVsbGV0U2NyZWVuTGlzdH3vvIznhLblkI7ph43mlrDliqDovb3mraTmkq3mlL7ov5vluqbku6XlkI7nmoTlvLnluZXjgIJcclxuICAgICAgICAgKiBAcGFyYW0ge29wZW5CU0V+QnVsbGV0U2NyZWVufSBidWxsZXRTY3JlZW4gLSDljZXmnaHlvLnluZXmlbDmja7vvJrkuIDkuKoge0BsaW5rIG9wZW5CU0V+QnVsbGV0U2NyZWVufSDnu5PmnoTjgIJcclxuICAgICAgICAgKiBAdGhyb3dzIHtUeXBlRXJyb3J9IOS8oOWFpeeahOWPguaVsOmUmeivr+aXtuW8leWPkemUmeivr+OAguivt+WPgumYhSBNRE4gW1R5cGVFcnJvcl17QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvemgtQ04vZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvVHlwZUVycm9yfSDjgIJcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmFkZEJ1bGxldFNjcmVlbiA9IGZ1bmN0aW9uIChidWxsZXRTY3JlZW4pIHtcclxuICAgICAgICAgICAgX2RlZmF1bHRCdWxsZXRTY3JlZW4uc3RhcnRUaW1lID0gX29wdGlvbnMuY2xvY2soKTtcclxuICAgICAgICAgICAgYnVsbGV0U2NyZWVuID0gSGVscGVyLnNldFZhbHVlcyhidWxsZXRTY3JlZW4sIF9kZWZhdWx0QnVsbGV0U2NyZWVuLCBfYnVsbGV0U2NyZWVuVHlwZSk7IC8v6K6+572u6buY6K6k5YC8XHJcblxyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW4udHlwZSAhPSBCdWxsZXRTY3JlZW5UeXBlLmxlZnRUb1JpZ2h0ICYmXHJcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW4udHlwZSAhPSBCdWxsZXRTY3JlZW5UeXBlLnJpZ2h0VG9MZWZ0ICYmXHJcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW4udHlwZSAhPSBCdWxsZXRTY3JlZW5UeXBlLnRvcCAmJlxyXG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuLnR5cGUgIT0gQnVsbGV0U2NyZWVuVHlwZS5ib3R0b21cclxuICAgICAgICAgICAgKSB0aHJvdyBuZXcgVHlwZUVycm9yKFJlc291cmNlcy5QQVJBTUVURVJTX1RZUEVfRVJST1IpO1xyXG5cclxuICAgICAgICAgICAgSGVscGVyLmNoZWNrVHlwZXMoYnVsbGV0U2NyZWVuLnN0eWxlLCBfb3B0aW9uc1R5cGUuZGVmYXVsdFN0eWxlKTsgLy/mo4Dmn6XlvLnluZXmoLflvI/nsbvlnotcclxuXHJcbiAgICAgICAgICAgIGxldCBvbGRMZW5ndGggPSBfYnVsbGV0U2NyZWVucy5nZXRMZW5ndGgoKTtcclxuICAgICAgICAgICAgX2J1bGxldFNjcmVlbnMuZm9yRWFjaChmdW5jdGlvbiAobGFzdEJ1bGxldFNjcmVlbikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbi5zdGFydFRpbWUgPiBsYXN0QnVsbGV0U2NyZWVuLnN0YXJ0VGltZSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGQ6IHsgYWRkVG9VcDogdHJ1ZSwgZWxlbWVudDogYnVsbGV0U2NyZWVuIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3A6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9LCB0cnVlKTtcclxuICAgICAgICAgICAgaWYgKG9sZExlbmd0aCA9PT0gX2J1bGxldFNjcmVlbnMuZ2V0TGVuZ3RoKCkpXHJcbiAgICAgICAgICAgICAgICBfYnVsbGV0U2NyZWVucy5wdXNoKGJ1bGxldFNjcmVlbiwgZmFsc2UpO1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDlvIDlp4vmkq3mlL7lvLnluZXjgIJcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnBsYXkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICghX3BsYXlpbmcpIHtcclxuICAgICAgICAgICAgICAgIGlmICghX3N0YXJ0VGltZSlcclxuICAgICAgICAgICAgICAgICAgICBfc3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoX3BhdXNlVGltZSlcclxuICAgICAgICAgICAgICAgICAgICBfc3RhcnRUaW1lICs9IF9vcHRpb25zLmNsb2NrKCkgLSBfcGF1c2VUaW1lO1xyXG4gICAgICAgICAgICAgICAgX2xhc3RSZWZyZXNoVGltZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBfcGxheWluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVmcmVzaCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnu6fnu63miYDmnInlnKjkuovku7blk43lupTkuK3orr7nva7kuoYgZS5wYXVzZSA9IHRydWU7IOW8ueW5leeahOaSreaUvuOAglxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMucGxheUFsbEJ1bGxldFNjcmVlbnMgPSAoKSA9PlxyXG4gICAgICAgICAgICBfYnVsbGV0U2NyZWVuc09uU2NyZWVuLmZvckVhY2goKGJ1bGxldFNjcmVlbk9uU2NyZWVuKSA9PiBidWxsZXRTY3JlZW5PblNjcmVlbi5wYXVzZSA9IGZhbHNlKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5pqC5YGc5pKt5pS+5by55bmV44CCXHJcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIOaaguWBnOaSreaUvuW8ueW5leOAguaaguWBnOaSreaUvuW8ueW5leaYr+aMh+W8ueW5leaSreaUvuaaguWBnO+8jOaJgOacieacquWHuueOsOeahOW8ueW5leWwhuWBnOatouWHuueOsO+8jOW3suWHuueOsOeahOW8ueW5leWBnOatoui/kOWKqO+8jOWBnOatoua2iOWkseOAglxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMucGF1c2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChfcGxheWluZykge1xyXG4gICAgICAgICAgICAgICAgX3BhdXNlVGltZSA9IF9vcHRpb25zLmNsb2NrKCk7XHJcbiAgICAgICAgICAgICAgICBfcGxheWluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5riF56m65by55bmV5YiX6KGo44CCXHJcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIOa4heepuuW8ueW5leWIl+ihqO+8jOS9huWxj+W5leS4iuW3sue7j+WHuueOsOeahOW8ueW5leS4jeS8muiiq+a4hemZpOOAglxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY2xlYW5CdWxsZXRTY3JlZW5MaXN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBfYnVsbGV0U2NyZWVucy5jbGVhbigpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOa4heepuuWxj+W5leWGheWuueOAglxyXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiDmuIXnqbrlsY/luZXlhoXlrrnjgILmuIXnqbrlsY/luZXkuIrlt7Lnu4/lh7rnjrDnmoTlvLnluZXvvIzkuI3ljIXmi6zlvLnluZXliJfooajkuK3nmoTlvLnluZXjgIJcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNsZWFuU2NyZWVuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBfYnVsbGV0U2NyZWVuc09uU2NyZWVuLmNsZWFuKCk7XHJcbiAgICAgICAgICAgIF9yZW5kZXJlci5jbGVhblNjcmVlbigpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWBnOatouaSreaUvuW8ueW5leOAglxyXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiDlgZzmraLmkq3mlL7lvLnluZXjgILlgZzmraLmkq3mlL7lvLnluZXmmK/mjIflgZzmraLmkq3mlL7lvLnluZXvvIzpu5jorqRb5pe26Ze05Z+65YeG77yIb3B0aW9ucy5jbG9ja++8iV17QGxpbmsgb3BlbkJTRX5CdWxsZXRTY3JlZW5TdHlsZX3lvZLpm7bvvIzlubZb5riF56m65by55bmV5YiX6KGoXXtAbGluayBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZSNjbGVhbkJ1bGxldFNjcmVlbkxpc3R944CBW+a4heepuuWxj+W5leWGheWuuV17QGxpbmsgb3BlbkJTRS5CdWxsZXRTY3JlZW5FbmdpbmUjY2xlYW5TY3JlZW5944CCXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5zdG9wID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoX3BsYXlpbmcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGF1c2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNsZWFuQnVsbGV0U2NyZWVuTGlzdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmNsZWFuU2NyZWVuKCk7XHJcbiAgICAgICAgICAgIF9wYXVzZVRpbWUgPSAwO1xyXG4gICAgICAgICAgICBfc3RhcnRUaW1lID0gbnVsbDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDpmpDol4/lvLnluZXjgIJcclxuICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmhpZGUgPSBfcmVuZGVyZXIuaGlkZTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5pi+56S65by55bmV44CCXHJcbiAgICAgICAgICogQGZ1bmN0aW9uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5zaG93ID0gX3JlbmRlcmVyLnNob3c7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOiOt+WPluW8ueW5leWPr+ingeaAp+OAglxyXG4gICAgICAgICAqIEBmdW5jdGlvblxyXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSAtIOaMh+ekuuW8ueW5leaYr+WQpuWPr+ingeOAglxyXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiDojrflj5blvLnluZXlj6/op4HmgKfjgILlpoLopoHmmL7npLrlvLnluZXor7fosIPnlKggW2J1bGxldFNjcmVlbkVuZ2luZS5zaG93KCk7XXtAbGluayBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZSNzaG93fSDvvIzopoHpmpDol4/lvLnluZXor7fosIPnlKggW2J1bGxldFNjcmVlbkVuZ2luZS5oaWRlKCk7XXtAbGluayBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZSNoaWRlfSDjgIJcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmdldFZpc2liaWxpdHkgPSBfcmVuZGVyZXIuZ2V0VmlzaWJpbGl0eTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDojrflj5bmuLLmn5PmqKHlvI/jgIJcclxuICAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIOW8ueW5lea4suafk+aooeW8j++8miDlj5blgLzkuLrigJxjYW52YXPigJ3jgIHigJxjc3Mz4oCd44CB4oCcd2ViZ2zigJ3miJbigJxzdmfigJ3jgIJcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmdldFJlbmRlck1vZGUgPSAoKSA9PiByZW5kZXJNb2RlO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDojrflj5bmkq3mlL7nirbmgIHjgIJcclxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSDmraPlnKjmkq3mlL7moIflv5fvvJp0cnVl77ya5q2j5Zyo5pKt5pS+77ybZmFsc2XvvJrlt7LmmoLlgZwv5YGc5q2i5pKt5pS+44CCXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5nZXRQbGF5U3RhdGUgPSAoKSA9PiBfcGxheWluZztcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiDojrflj5bosIPor5Xkv6Hmga/jgIJcclxuICAgICAgICAqIEByZXR1cm5zIHtvcGVuQlNFfkRlYnVnSW5mb30gLSDosIPor5Xkv6Hmga/vvJrkuIDkuKoge0BsaW5rIG9wZW5CU0V+RGVidWdJbmZvfSDnu5PmnoTjgIJcclxuICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuZ2V0RGVidWdJbmZvID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgdGltZTogX3BsYXlpbmcgPyBfb3B0aW9ucy5jbG9jaygpIDogX3BhdXNlVGltZSxcclxuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbnNPblNjcmVlbkNvdW50OiBfYnVsbGV0U2NyZWVuc09uU2NyZWVuLmdldExlbmd0aCgpLFxyXG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuc0NvdW50OiBfYnVsbGV0U2NyZWVucy5nZXRMZW5ndGgoKSxcclxuICAgICAgICAgICAgICAgIGRlbGF5OiBfZGVsYXksXHJcbiAgICAgICAgICAgICAgICBkZWxheUJ1bGxldFNjcmVlbnNDb3VudDogX2RlbGF5QnVsbGV0U2NyZWVuc0NvdW50LFxyXG4gICAgICAgICAgICAgICAgZnBzOiBfcGxheWluZyA/IE1hdGguZmxvb3IoX3JlZnJlc2hSYXRlICogMTAwMCkgOiAwIC8v5bin6aKRXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy/lhoXpg6jlh73mlbBcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5by55bmV5LqL5Lu25ZON5bqUXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSDkuovku7blkI3np7BcclxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gYnVsbGV0U2NyZWVuT25TY3JlZW4gLSDlsY/luZXlvLnluZXlr7nosaFcclxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZSAtIOS6i+S7tuS/oeaBr1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGJ1bGxldFNjcmVlbkV2ZW50VHJpZ2dlcihuYW1lLCBidWxsZXRTY3JlZW5PblNjcmVlbiwgZSkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGUucGFnZVggPT09ICd1bmRlZmluZWQnIHx8IGUucGFnZVggPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGxldCBkb2MgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGJvZHkgPSBkb2N1bWVudC5ib2R5O1xyXG4gICAgICAgICAgICAgICAgZS5wYWdlWCA9IGUuY2xpZW50WCArIChkb2MgJiYgZG9jLnNjcm9sbExlZnQgfHwgYm9keSAmJiBib2R5LnNjcm9sbExlZnQgfHwgMCkgLSAoZG9jICYmIGRvYy5jbGllbnRMZWZ0IHx8IGJvZHkgJiYgYm9keS5jbGllbnRMZWZ0IHx8IDApO1xyXG4gICAgICAgICAgICAgICAgZS5wYWdlWSA9IGUuY2xpZW50WSArIChkb2MgJiYgZG9jLnNjcm9sbFRvcCB8fCBib2R5ICYmIGJvZHkuc2Nyb2xsVG9wIHx8IDApIC0gKGRvYyAmJiBkb2MuY2xpZW50VG9wIHx8IGJvZHkgJiYgYm9keS5jbGllbnRUb3AgfHwgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgX2V2ZW50LnRyaWdnZXIobmFtZSwge1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiDojrflj5blvJXlj5Hkuovku7bnmoTlvLnluZXlvLnluZXnmoTmlbDmja5cclxuICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7b3BlbkJTRX5CdWxsZXRTY3JlZW59IOW8leWPkeS6i+S7tueahOW8ueW5leeahOaVsOaNru+8muS4gOS4qiB7QGxpbmsgb3BlbkJTRX5CdWxsZXRTY3JlZW59IOe7k+aehOOAgu+8iOazqOaEj++8muS4jeimgeivleWbvuS4jlvmt7vliqDlvLnluZVde0BsaW5rIG9wZW5CU0UuQnVsbGV0U2NyZWVuRW5naW5lI2FkZEJ1bGxldFNjcmVlbn3ml7bliJvlu7rnmoTlr7nosaHov5vooYzmr5TovoPvvIzov5nkuKrlr7nosaHmmK/lhYvpmoblvpfliLDnmoTvvIzlubbkuI3nm7jnrYnjgILmraPnoa7nmoTmlrnms5XmmK/lnKjmt7vliqDlvLnluZXml7bkuIDlubbmj5LlhaUgaWQg562J6Ieq5a6a5LmJ5a2X5q615p2l5ZSv5LiA5qCH6K+G5LiA5p2h5by55bmV44CC77yJXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGdldEJ1bGxldFNjcmVlbjogKCkgPT4gSGVscGVyLmNsb25lKGJ1bGxldFNjcmVlbk9uU2NyZWVuLmJ1bGxldFNjcmVlbiksXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIOiuvue9ruW8leWPkeS6i+S7tueahOW8ueW5leW8ueW5leeahOaVsOaNrlxyXG4gICAgICAgICAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7b3BlbkJTRX5CdWxsZXRTY3JlZW59IGJ1bGxldFNjcmVlbiAtIOW8leWPkeS6i+S7tueahOW8ueW5leeahOaVsOaNru+8muS4gOS4qiB7QGxpbmsgb3BlbkJTRX5CdWxsZXRTY3JlZW59IOe7k+aehOOAguiuvue9ruatpOWPguaVsOS7peS+v+WKqOaAgeiwg+aVtOW8ueW5leagt+W8j++8jOS9huaYr+S4gOS6m+WPguaVsOWcqOS6i+S7tuS4reS/ruaUueaXoOaViO+8jOafpeeci+atpOe7k+aehOeahOivtOaYjuS7peS6huino+ivpuaDheOAglxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtib29sZWFufSBbcmVkcmF3PWZhbHNlXSAtIOaYr+WQpumHjee7mOW8ueW5le+8muatpOWPguaVsOWcqOavj+asoeW8leWPkeS6i+S7tuaXtueahOWIneWni+WAvOS4uiBmYWxzZSDvvIzlpoLmnpzkv67mlLnkuoYgYnVsbGV0U2NyZWVuIOS4reeahOWAvO+8jOatpOWPguaVsOW/hemhu+iuvuS4uiB0cnVlIOOAglxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBzZXRCdWxsZXRTY3JlZW46IChidWxsZXRTY3JlZW4sIHJlZHJhdyA9IGZhbHNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByZWRyYXcgIT0gJ2Jvb2xlYW4nKSB0aHJvdyBuZXcgVHlwZUVycm9yKFJlc291cmNlcy5QQVJBTUVURVJTX1RZUEVfRVJST1IpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBidWxsZXRTY3JlZW5UeXBlID0gSGVscGVyLmNsb25lKF9idWxsZXRTY3JlZW5UeXBlKTtcclxuICAgICAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5UeXBlLnN0eWxlID0gX29wdGlvbnNUeXBlLmRlZmF1bHRTdHlsZTtcclxuICAgICAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi5idWxsZXRTY3JlZW4gPSBIZWxwZXIuc2V0VmFsdWVzKGJ1bGxldFNjcmVlbiwgYnVsbGV0U2NyZWVuT25TY3JlZW4uYnVsbGV0U2NyZWVuLCBidWxsZXRTY3JlZW5UeXBlKTsgLy/orr7nva7lgLxcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVkcmF3ID09PSB0cnVlKSBfcmVuZGVyZXIucmVDcmVhdEFuZGdldFdpZHRoKGJ1bGxldFNjcmVlbk9uU2NyZWVuKTsgLy/ph43mlrDliJvlu7rlubbnu5jliLblvLnluZVcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIV9wbGF5aW5nICYmIHJlZHJhdykgX3JlbmRlcmVyLmRyYXcoKTsgLy/pnZ7mkq3mlL7nirbmgIHliJnph43nu5hcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIOiOt+WPluW8leWPkeS6i+S7tueahOW8ueW5leeahOaSreaUvueKtuaAgVxyXG4gICAgICAgICAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSDlj5blvJXlj5Hkuovku7bnmoTlvLnluZXmmK/lkKblnKjmkq3mlL4v56e75Yqo77ya5aaC5p6c6K6+572u5Li6IHRydWUg5YiZ6K+l5by55bmV5pqC5YGc77yM55u05Yiw5bCG5q2k5Y+C5pWw6K6+5Li6IGZhbHNlIOaIluiwg+eUqCB7QGxpbmsgb3BlbkJTRS5CdWxsZXRTY3JlZW5FbmdpbmUjcGxheUFsbEJ1bGxldFNjcmVlbnN9IOaWueazleOAglxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBnZXRQbGF5U3RhdGU6ICgpID0+ICFidWxsZXRTY3JlZW5PblNjcmVlbi5wYXVzZSxcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICog6K6+572u5byV5Y+R5LqL5Lu255qE5by55bmV55qE5pKt5pS+54q25oCBXHJcbiAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtib29sZWFufSBwYWx5IC0g5piv5ZCm57un57ut5pKt5pS+L+enu+WKqOW8leWPkeS6i+S7tueahOW8ueW5le+8muivu+WPluatpOWPguaVsOWPr+WIpOaWrei/meadoeW8ueW5leaYr+WQpuWkhOS6juaaguWBnOeKtuaAgeOAglxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBzZXRQbGF5U3RhdGU6IChwbGF5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwbGF5ICE9ICdib29sZWFuJykgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuUEFSQU1FVEVSU19UWVBFX0VSUk9SKTtcclxuICAgICAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi5wYXVzZSA9ICFwbGF5O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNjcmVlblg6IGUuc2NyZWVuWCwgc2NyZWVuWTogZS5zY3JlZW5ZLFxyXG4gICAgICAgICAgICAgICAgcGFnZVg6IGUucGFnZVgsIHBhZ2VZOiBlLnBhZ2VZLFxyXG4gICAgICAgICAgICAgICAgY2xpZW50WDogZS5jbGllbnRYLCBjbGllbnRZOiBlLmNsaWVudFlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDliLfmlrDlvLnluZXlh73mlbBcclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHJlZnJlc2goKSB7XHJcbiAgICAgICAgICAgIGxldCBub3dUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgIGlmIChfbGFzdFJlZnJlc2hUaW1lICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICBfcmVmcmVzaFJhdGUgPSAxIC8gKG5vd1RpbWUgLSBfbGFzdFJlZnJlc2hUaW1lKTtcclxuICAgICAgICAgICAgX2xhc3RSZWZyZXNoVGltZSA9IG5vd1RpbWU7XHJcbiAgICAgICAgICAgIGFkZEJ1bGxldFNjcmVlbnNUb1NjcmVlbigpO1xyXG4gICAgICAgICAgICBtb3ZlQnVsbGV0U2NyZWVuT25TY3JlZW4oKTtcclxuICAgICAgICAgICAgX3JlbmRlcmVyLmRyYXcoKTsgLy/nu5jliLblvLnluZVcclxuICAgICAgICAgICAgaWYgKF9wbGF5aW5nKVxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlZnJlc2gpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog56e75Yqo5by55bmV5Ye95pWwXHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBtb3ZlQnVsbGV0U2NyZWVuT25TY3JlZW4oKSB7XHJcbiAgICAgICAgICAgIF9idWxsZXRTY3JlZW5zT25TY3JlZW4uZm9yRWFjaCgoYnVsbGV0U2NyZWVuT25TY3JlZW4pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW5PblNjcmVlbi5wYXVzZSkgcmV0dXJuOyAvL+aaguWBnOenu+WKqFxyXG4gICAgICAgICAgICAgICAgbGV0IG5vd1RpbWUgPSBfb3B0aW9ucy5jbG9jaygpO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChidWxsZXRTY3JlZW5PblNjcmVlbi50eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCdWxsZXRTY3JlZW5UeXBlLnJpZ2h0VG9MZWZ0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuT25TY3JlZW4ueCA+IC1idWxsZXRTY3JlZW5PblNjcmVlbi53aWR0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4ueCAtPSBidWxsZXRTY3JlZW5PblNjcmVlbi5idWxsZXRTY3JlZW4uc3R5bGUuc3BlZWQgKiBfb3B0aW9ucy5wbGF5U3BlZWQgLyBfcmVmcmVzaFJhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVuZGVyZXIuZGVsZXRlKGJ1bGxldFNjcmVlbk9uU2NyZWVuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHJlbW92ZTogdHJ1ZSB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQnVsbGV0U2NyZWVuVHlwZS5sZWZ0VG9SaWdodDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbk9uU2NyZWVuLnggPCBfZWxlbWVudFNpemUud2lkdGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnggKz0gYnVsbGV0U2NyZWVuT25TY3JlZW4uYnVsbGV0U2NyZWVuLnN0eWxlLnNwZWVkICogX29wdGlvbnMucGxheVNwZWVkIC8gX3JlZnJlc2hSYXRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JlbmRlcmVyLmRlbGV0ZShidWxsZXRTY3JlZW5PblNjcmVlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyByZW1vdmU6IHRydWUgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJ1bGxldFNjcmVlblR5cGUudG9wOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQnVsbGV0U2NyZWVuVHlwZS5ib3R0b206XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW5PblNjcmVlbi5lbmRUaW1lIDwgbm93VGltZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JlbmRlcmVyLmRlbGV0ZShidWxsZXRTY3JlZW5PblNjcmVlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyByZW1vdmU6IHRydWUgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmt7vliqDlvLnluZXliLDlsY/luZXlh73mlbBcclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGFkZEJ1bGxldFNjcmVlbnNUb1NjcmVlbigpIHtcclxuICAgICAgICAgICAgaWYgKF9idWxsZXRTY3JlZW5zT25TY3JlZW4uZ2V0TGVuZ3RoKCkgPT09IDApXHJcbiAgICAgICAgICAgICAgICBfZGVsYXkgPSAwO1xyXG4gICAgICAgICAgICBsZXQgdGltZXMgPSBNYXRoLmZsb29yKF9yZWZyZXNoUmF0ZSAqIDIwMDApO1xyXG4gICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuID0gX2J1bGxldFNjcmVlbnMucG9wKGZhbHNlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuID09PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBsZXQgbm93VGltZSA9IF9vcHRpb25zLmNsb2NrKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYnVsbGV0U2NyZWVuLnN0YXJ0VGltZSA+IG5vd1RpbWUpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIGlmICghX29wdGlvbnMudGltZU91dERpc2NhcmQgfHwgIWJ1bGxldFNjcmVlbi5jYW5EaXNjYXJkIHx8IGJ1bGxldFNjcmVlbi5zdGFydFRpbWUgPiBub3dUaW1lIC0gTWF0aC5mbG9vcigxIC8gX3JlZnJlc2hSYXRlKSAqIDYwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuLnN0eWxlID0gSGVscGVyLnNldFZhbHVlcyhidWxsZXRTY3JlZW4uc3R5bGUsIF9vcHRpb25zLmRlZmF1bHRTdHlsZSwgX29wdGlvbnNUeXBlLmRlZmF1bHRTdHlsZSk7IC8v5aGr5YWF6buY6K6k5qC35byPXHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0QnVsbGV0U2NyZWVuT25TY3JlZW4obm93VGltZSwgYnVsbGV0U2NyZWVuKTsgLy/nlJ/miJDlsY/luZXlvLnluZXlr7nosaHlubbmt7vliqDliLDlsY/luZXlvLnluZXpm4blkIggICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgX2RlbGF5QnVsbGV0U2NyZWVuc0NvdW50Kys7XHJcbiAgICAgICAgICAgICAgICBfYnVsbGV0U2NyZWVucy5wb3AodHJ1ZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgdGltZXMtLTtcclxuICAgICAgICAgICAgfSB3aGlsZSAoX2J1bGxldFNjcmVlbnNPblNjcmVlbi5nZXRMZW5ndGgoKSA9PT0gMCB8fCB0aW1lcyA+IDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog55Sf5oiQ5bGP5bmV5by55bmV5a+56LGh5Ye95pWwXHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gbm93VGltZSAtIOW9k+WJjeaXtumXtFxyXG4gICAgICAgICAqIEBwYXJhbSB7b3BlbkJTRX5CdWxsZXRTY3JlZW59IGJ1bGxldFNjcmVlbiAtIOW8ueW5lVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldEJ1bGxldFNjcmVlbk9uU2NyZWVuKG5vd1RpbWUsIGJ1bGxldFNjcmVlbikge1xyXG4gICAgICAgICAgICBfZGVsYXkgPSBub3dUaW1lIC0gYnVsbGV0U2NyZWVuLnN0YXJ0VGltZTtcclxuICAgICAgICAgICAgbGV0IGJ1bGxldFNjcmVlbk9uU2NyZWVuID0ge307XHJcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnBhdXNlID0gZmFsc2U7IC8v5piv5ZCm5pqC5YGc56e75YqoXHJcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLmJ1bGxldFNjcmVlbiA9IGJ1bGxldFNjcmVlbjtcclxuICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4uc3RhcnRUaW1lID0gbm93VGltZTsgLy/lvLnluZXlpLTpg6jov5vlsY/luZXml7bpl7RcclxuICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4uc2l6ZSA9IGJ1bGxldFNjcmVlbi5zdHlsZS5zaXplOyAvL+Wtl+S9k+Wkp+Wwj++8muWDj+e0oFxyXG4gICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi50eXBlID0gYnVsbGV0U2NyZWVuLnR5cGU7IC8v5by55bmV57G75Z6LXHJcbiAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLmhlaWdodCA9IGJ1bGxldFNjcmVlbk9uU2NyZWVuLnNpemU7IC8v5by55bmV55qE6auY5bqm77ya5YOP57SgXHJcbiAgICAgICAgICAgIF9yZW5kZXJlci5jcmVhdEFuZGdldFdpZHRoKGJ1bGxldFNjcmVlbk9uU2NyZWVuKTsgLy/liJvlu7rlvLnluZXlhYPntKDlubborqHnrpflrr3luqZcclxuICAgICAgICAgICAgc3dpdGNoIChidWxsZXRTY3JlZW4udHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBCdWxsZXRTY3JlZW5UeXBlLnJpZ2h0VG9MZWZ0OlxyXG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLmVuZFRpbWUgPSBwYXJzZUludChub3dUaW1lICsgKF9lbGVtZW50U2l6ZS53aWR0aCArIGJ1bGxldFNjcmVlbk9uU2NyZWVuLndpZHRoKSAvIChidWxsZXRTY3JlZW4uc3R5bGUuc3BlZWQgKiBfb3B0aW9ucy5wbGF5U3BlZWQpKTsgLy/lvLnluZXlsL7pg6jlh7rlsY/luZXnmoTml7bpl7RcclxuICAgICAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi54ID0gX2VsZW1lbnRTaXplLndpZHRoOyAvL+W8ueW5leWIneWni1jlnZDmoIdcclxuICAgICAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi55ID0gX29wdGlvbnMudmVydGljYWxJbnRlcnZhbDsgLy/lvLnluZXliJ3lp4tZ5Z2Q5qCHXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIEJ1bGxldFNjcmVlblR5cGUubGVmdFRvUmlnaHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4uZW5kVGltZSA9IHBhcnNlSW50KG5vd1RpbWUgKyAoX2VsZW1lbnRTaXplLndpZHRoICsgYnVsbGV0U2NyZWVuT25TY3JlZW4ud2lkdGgpIC8gKGJ1bGxldFNjcmVlbi5zdHlsZS5zcGVlZCAqIF9vcHRpb25zLnBsYXlTcGVlZCkpOyAvL+W8ueW5leWwvumDqOWHuuWxj+W5leeahOaXtumXtFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnggPSAtYnVsbGV0U2NyZWVuT25TY3JlZW4ud2lkdGg7IC8v5by55bmV5Yid5aeLWOWdkOagh1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnkgPSBfb3B0aW9ucy52ZXJ0aWNhbEludGVydmFsOyAvL+W8ueW5leWIneWni1nlnZDmoIdcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgQnVsbGV0U2NyZWVuVHlwZS50b3A6XHJcbiAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4uZW5kVGltZSA9IGJ1bGxldFNjcmVlbk9uU2NyZWVuLnN0YXJ0VGltZSArIGJ1bGxldFNjcmVlbi5zdHlsZS5yZXNpZGVuY2VUaW1lICogX29wdGlvbnMucGxheVNwZWVkO1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnggPSBwYXJzZUludCgoX2VsZW1lbnRTaXplLndpZHRoIC0gYnVsbGV0U2NyZWVuT25TY3JlZW4ud2lkdGgpIC8gMik7IC8v5by55bmV5Yid5aeLWOWdkOagh1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnkgPSBfb3B0aW9ucy52ZXJ0aWNhbEludGVydmFsOyAvL+W8ueW5leWIneWni1nlnZDmoIdcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgQnVsbGV0U2NyZWVuVHlwZS5ib3R0b206XHJcbiAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4uZW5kVGltZSA9IGJ1bGxldFNjcmVlbk9uU2NyZWVuLnN0YXJ0VGltZSArIGJ1bGxldFNjcmVlbi5zdHlsZS5yZXNpZGVuY2VUaW1lICogX29wdGlvbnMucGxheVNwZWVkO1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnggPSBwYXJzZUludCgoX2VsZW1lbnRTaXplLndpZHRoIC0gYnVsbGV0U2NyZWVuT25TY3JlZW4ud2lkdGgpIC8gMik7IC8v5by55bmV5Yid5aeLWOWdkOagh1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnkgPSAtX29wdGlvbnMudmVydGljYWxJbnRlcnZhbCAtIGJ1bGxldFNjcmVlbk9uU2NyZWVuLmhlaWdodDsgLy/lvLnluZXliJ3lp4tZ5Z2Q5qCHXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IG9sZExlbmd0aCA9IF9idWxsZXRTY3JlZW5zT25TY3JlZW4uZ2V0TGVuZ3RoKCk7XHJcbiAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW4udHlwZSA9PT0gQnVsbGV0U2NyZWVuVHlwZS50b3AgfHwgYnVsbGV0U2NyZWVuLnR5cGUgPT09IEJ1bGxldFNjcmVlblR5cGUuYm90dG9tKSB7XHJcbiAgICAgICAgICAgICAgICBfYnVsbGV0U2NyZWVuc09uU2NyZWVuLmZvckVhY2goKG5leHRCdWxsZXRTY3JlZW5PblNjcmVlbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8v5by55bmV5LiN5Zyo5rWB5Lit77yM5piv5Zu65a6a5by55bmVXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRCdWxsZXRTY3JlZW5PblNjcmVlbi5idWxsZXRTY3JlZW4udHlwZSAhPSBidWxsZXRTY3JlZW4udHlwZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuOyAvL+S4jeaYr+WQjOS4gOenjeexu+Wei+eahOW8ueW5lVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW4udHlwZSA9PT0gQnVsbGV0U2NyZWVuVHlwZS50b3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpzmlrDlvLnluZXlnKjlvZPliY3lvLnluZXkuIrmlrnkuJTmnKrkuI7lvZPliY3lvLnluZXph43lj6BcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbk9uU2NyZWVuLnkgKyBidWxsZXRTY3JlZW5PblNjcmVlbi5oZWlnaHQgPCBuZXh0QnVsbGV0U2NyZWVuT25TY3JlZW4ueSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGFkZDogeyBhZGRUb1VwOiB0cnVlLCBlbGVtZW50OiBzZXRBY3R1YWxZKGJ1bGxldFNjcmVlbk9uU2NyZWVuKSB9LCBzdG9wOiB0cnVlIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5aaC5p6c5LiK5LiA5p2h5by55bmV55qE5raI5aSx5pe26Ze05bCP5LqO5b2T5YmN5by55bmV55qE5Ye6546w5pe26Ze0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXh0QnVsbGV0U2NyZWVuT25TY3JlZW4uZW5kVGltZSA8IG5vd1RpbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW5PblNjcmVlbi55ID0gbmV4dEJ1bGxldFNjcmVlbk9uU2NyZWVuLnk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnkgPSBuZXh0QnVsbGV0U2NyZWVuT25TY3JlZW4ueSArIG5leHRCdWxsZXRTY3JlZW5PblNjcmVlbi5oZWlnaHQgKyBfb3B0aW9ucy52ZXJ0aWNhbEludGVydmFsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpzmlrDlvLnluZXlnKjlvZPliY3lvLnluZXkuIvmlrnkuJTmnKrkuI7lvZPliY3lvLnluZXph43lj6BcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJ1bGxldFNjcmVlbk9uU2NyZWVuLnkgPiBuZXh0QnVsbGV0U2NyZWVuT25TY3JlZW4ueSArIG5leHRCdWxsZXRTY3JlZW5PblNjcmVlbi5oZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGFkZDogeyBhZGRUb1VwOiB0cnVlLCBlbGVtZW50OiBzZXRBY3R1YWxZKGJ1bGxldFNjcmVlbk9uU2NyZWVuKSB9LCBzdG9wOiB0cnVlIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpzkuIrkuIDmnaHlvLnluZXnmoTmtojlpLHml7bpl7TlsI/kuo7lvZPliY3lvLnluZXnmoTlh7rnjrDml7bpl7RcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRCdWxsZXRTY3JlZW5PblNjcmVlbi5lbmRUaW1lIDwgbm93VGltZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnkgPSBuZXh0QnVsbGV0U2NyZWVuT25TY3JlZW4ueTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4ueSA9IG5leHRCdWxsZXRTY3JlZW5PblNjcmVlbi55IC0gYnVsbGV0U2NyZWVuT25TY3JlZW4uaGVpZ2h0IC0gX29wdGlvbnMudmVydGljYWxJbnRlcnZhbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCB0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8v5b2T5YmN5by55bmV57uP6L+H5LiA5Liq54K56ZyA6KaB55qE5oC75pe26ZW/XHJcbiAgICAgICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuT25TY3JlZW5XaWR0aFRpbWUgPSBidWxsZXRTY3JlZW5PblNjcmVlbi53aWR0aCAvIChidWxsZXRTY3JlZW4uc3R5bGUuc3BlZWQgKiBfb3B0aW9ucy5wbGF5U3BlZWQpO1xyXG4gICAgICAgICAgICAgICAgX2J1bGxldFNjcmVlbnNPblNjcmVlbi5mb3JFYWNoKChuZXh0QnVsbGV0U2NyZWVuT25TY3JlZW4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvL+W8ueW5leWcqOa1geS4re+8jOaYr+enu+WKqOW8ueW5lVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0QnVsbGV0U2NyZWVuT25TY3JlZW4uYnVsbGV0U2NyZWVuLnR5cGUgPT09IEJ1bGxldFNjcmVlblR5cGUudG9wIHx8IG5leHRCdWxsZXRTY3JlZW5PblNjcmVlbi5idWxsZXRTY3JlZW4udHlwZSA9PT0gQnVsbGV0U2NyZWVuVHlwZS5ib3R0b20pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjsgLy/lvLnluZXkuI3lnKjmtYHkuK3vvIzkuLrlm7rlrprlvLnluZVcclxuICAgICAgICAgICAgICAgICAgICAvL+WmguaenOaWsOW8ueW5leWcqOW9k+WJjeW8ueW5leS4iuaWueS4lOacquS4juW9k+WJjeW8ueW5lemHjeWPoFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChidWxsZXRTY3JlZW5PblNjcmVlbi55ICsgYnVsbGV0U2NyZWVuT25TY3JlZW4uaGVpZ2h0IDwgbmV4dEJ1bGxldFNjcmVlbk9uU2NyZWVuLnkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGFkZDogeyBhZGRUb1VwOiB0cnVlLCBlbGVtZW50OiBzZXRBY3R1YWxZKGJ1bGxldFNjcmVlbk9uU2NyZWVuKSB9LCBzdG9wOiB0cnVlIH07XHJcbiAgICAgICAgICAgICAgICAgICAgLy/kuIrkuIDmnaHlvLnluZXnu4/ov4fkuIDkuKrngrnpnIDopoHnmoTmgLvml7bplb9cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbmV4dEJ1bGxldFNjcmVlbk9uU2NyZWVuV2lkdGhUaW1lID0gbmV4dEJ1bGxldFNjcmVlbk9uU2NyZWVuLndpZHRoIC8gKG5leHRCdWxsZXRTY3JlZW5PblNjcmVlbi5idWxsZXRTY3JlZW4uc3R5bGUuc3BlZWQgKiBfb3B0aW9ucy5wbGF5U3BlZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8v5aaC5p6c5LiK5LiA5p2h5by55bmV55qE5raI5aSx5pe26Ze05bCP5LqO5b2T5YmN5by55bmV55qE5Ye6546w5pe26Ze0XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRCdWxsZXRTY3JlZW5PblNjcmVlbi5zdGFydFRpbWUgKyBuZXh0QnVsbGV0U2NyZWVuT25TY3JlZW5XaWR0aFRpbWUgPj0gbm93VGltZSB8fCAvL+WmguaenOS4iuS4gOadoeW8ueW5leeahOWktOi/m+WFpeS6hu+8jOS9huaYr+Wwvui/mOayoei/m+WFpVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0QnVsbGV0U2NyZWVuT25TY3JlZW4uZW5kVGltZSA+PSBidWxsZXRTY3JlZW5PblNjcmVlbi5lbmRUaW1lIC0gYnVsbGV0U2NyZWVuT25TY3JlZW5XaWR0aFRpbWUpIC8v5aaC5p6c5b2T5YmN5by55bmV5aS05Ye65Y675LqG77yM5LiK5LiA5p2h5by55bmV5bC+6L+Y5rKh5Ye65Y67XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLnkgPSBuZXh0QnVsbGV0U2NyZWVuT25TY3JlZW4ueSArIG5leHRCdWxsZXRTY3JlZW5PblNjcmVlbi5oZWlnaHQgKyBfb3B0aW9ucy52ZXJ0aWNhbEludGVydmFsO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4ueSA9IG5leHRCdWxsZXRTY3JlZW5PblNjcmVlbi55O1xyXG4gICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKF9idWxsZXRTY3JlZW5zT25TY3JlZW4uZ2V0TGVuZ3RoKCkgPT09IG9sZExlbmd0aClcclxuICAgICAgICAgICAgICAgIF9idWxsZXRTY3JlZW5zT25TY3JlZW4ucHVzaChzZXRBY3R1YWxZKGJ1bGxldFNjcmVlbk9uU2NyZWVuKSwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog6K6+572u55yf5a6e55qEWeWdkOagh1xyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGJ1bGxldFNjcmVlbk9uU2NyZWVuIC0g5bGP5bmV5by55bmV5LqL5Lu2XHJcbiAgICAgICAgICogQHJldHVybnMge29iamVjdH0g5bGP5bmV5by55bmV5LqL5Lu2XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gc2V0QWN0dWFsWShidWxsZXRTY3JlZW5PblNjcmVlbikge1xyXG4gICAgICAgICAgICBsZXQgYnVsbGV0U2NyZWVuID0gYnVsbGV0U2NyZWVuT25TY3JlZW4uYnVsbGV0U2NyZWVuO1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICBidWxsZXRTY3JlZW4udHlwZSA9PT0gQnVsbGV0U2NyZWVuVHlwZS5sZWZ0VG9SaWdodCB8fFxyXG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuLnR5cGUgPT09IEJ1bGxldFNjcmVlblR5cGUucmlnaHRUb0xlZnQgfHxcclxuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbi50eXBlID09PSBCdWxsZXRTY3JlZW5UeXBlLnRvcFxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIGJ1bGxldFNjcmVlbk9uU2NyZWVuLmFjdHVhbFkgPSBidWxsZXRTY3JlZW5PblNjcmVlbi55ICUgKF9lbGVtZW50U2l6ZS5oZWlnaHQgLSBidWxsZXRTY3JlZW5PblNjcmVlbi5oZWlnaHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGJ1bGxldFNjcmVlbi50eXBlID09PSBCdWxsZXRTY3JlZW5UeXBlLmJvdHRvbSkge1xyXG4gICAgICAgICAgICAgICAgYnVsbGV0U2NyZWVuT25TY3JlZW4uYWN0dWFsWSA9IF9lbGVtZW50U2l6ZS5oZWlnaHQgKyBidWxsZXRTY3JlZW5PblNjcmVlbi55ICUgX2VsZW1lbnRTaXplLmhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYnVsbGV0U2NyZWVuT25TY3JlZW47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDorr7nva7lsLrlr7hcclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHNldFNpemUoKSB7XHJcbiAgICAgICAgICAgIGxldCBkZXZpY2VQaXhlbFJhdGlvID0gSGVscGVyLmdldERldmljZVBpeGVsUmF0aW8oKTtcclxuICAgICAgICAgICAgaWYgKF9vbGREZXZpY2VQaXhlbFJhdGlvICE9IGRldmljZVBpeGVsUmF0aW8gfHxcclxuICAgICAgICAgICAgICAgIF9vbGRDbGllbnRXaWR0aCAhPSBlbGVtZW50LmNsaWVudFdpZHRoIHx8XHJcbiAgICAgICAgICAgICAgICBfb2xkQ2xpZW50SGVpZ2h0ICE9IGVsZW1lbnQuY2xpZW50SGVpZ2h0IHx8XHJcbiAgICAgICAgICAgICAgICBfb2xkU2NhbGluZyAhPSBfb3B0aW9ucy5zY2FsaW5nKSB7XHJcbiAgICAgICAgICAgICAgICBfb2xkU2NhbGluZyA9IF9vcHRpb25zLnNjYWxpbmc7XHJcbiAgICAgICAgICAgICAgICBfZWxlbWVudFNpemUud2lkdGggPSBlbGVtZW50LmNsaWVudFdpZHRoIC8gX29wdGlvbnMuc2NhbGluZztcclxuICAgICAgICAgICAgICAgIF9lbGVtZW50U2l6ZS5oZWlnaHQgPSBlbGVtZW50LmNsaWVudEhlaWdodCAvIF9vcHRpb25zLnNjYWxpbmc7XHJcbiAgICAgICAgICAgICAgICBfb2xkQ2xpZW50V2lkdGggPSBlbGVtZW50LmNsaWVudFdpZHRoO1xyXG4gICAgICAgICAgICAgICAgX29sZENsaWVudEhlaWdodCA9IGVsZW1lbnQuY2xpZW50SGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgX29sZERldmljZVBpeGVsUmF0aW8gPSBkZXZpY2VQaXhlbFJhdGlvO1xyXG4gICAgICAgICAgICAgICAgX3JlbmRlcmVyLnNldFNpemUoKTtcclxuICAgICAgICAgICAgICAgIGlmICghX3BsYXlpbmcpIF9yZW5kZXJlci5kcmF3KCk7IC8v6Z2e5pKt5pS+54q25oCB5YiZ6YeN57uYXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vSUUgRWRnZSDmtY/op4jlmajkuI3mlK/mjIEgJWNcclxuICAgICAgICBpZiAoISF3aW5kb3cuQWN0aXZlWE9iamVjdCB8fCBcIkFjdGl2ZVhPYmplY3RcIiBpbiB3aW5kb3cgfHwgbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiVHJpZGVudFwiKSA+IC0xIHx8XHJcbiAgICAgICAgICAgIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUVcIikgPiAtMSB8fCBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJFZGdlXCIpID4gLTEpIGNvbnNvbGUuaW5mbyhcclxuICAgICAgICAgICAgICAgIFJlc291cmNlcy5MT0FERURfSU5GT19JRS5maWxsRGF0YShidWlsZClcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAvL090aGVyXHJcbiAgICAgICAgZWxzZSBjb25zb2xlLmluZm8oXHJcbiAgICAgICAgICAgIFJlc291cmNlcy5MT0FERURfSU5GTy5maWxsRGF0YShidWlsZCksXHJcbiAgICAgICAgICAgICdmb250LXdlaWdodDpib2xkOyBjb2xvcjojMDA5OUZGOycsICcnLCAnZm9udC1zdHlsZTppdGFsaWM7JywgJydcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCB7IEJ1bGxldFNjcmVlbkVuZ2luZSB9Il0sImZpbGUiOiJidWxsZXRTY3JlZW5FbmdpbmUuanMifQ==
