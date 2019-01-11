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
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

window.openBSE = require('./openBSE').openBSE;

},{"./openBSE":14}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BrowserNotSupportError = void 0;

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
var BrowserNotSupportError =
/*#__PURE__*/
function (_Error) {
  _inherits(BrowserNotSupportError, _Error);

  /**
   * 创建一个异常对象
   * @param {String} message 
   */
  function BrowserNotSupportError(message) {
    var _this;

    _classCallCheck(this, BrowserNotSupportError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BrowserNotSupportError).call(this, "This browser does not support \"".concat(message, "\".")));
    _this.name = "BrowserNotSupportError";
    return _this;
  }

  return BrowserNotSupportError;
}(_wrapNativeSuper(Error));

exports.BrowserNotSupportError = BrowserNotSupportError;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BulletScreenEngine = void 0;

var _linkedList = require("./lib/linkedList");

var _event2 = require("./lib/event");

var _version = require("./version");

var _renderersFactory = require("./lib/renderers/renderersFactory");

var _bulletScreenType = require("./bulletScreenType");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PARAMETERS_TYPE_ERROR = 'Parameters type error.';
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
 * @param {openBSE~Options} [options] - 全局选项：一个 {@link openBSE~Options} 结构。
 * @param {string} [renderMode="canvas"] - 渲染模式：默认为“canvas”, “可选css3”， “webgl”和“svg”。
 */
function BulletScreenEngine(element, options) {
  var renderMode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'canvas';

  _classCallCheck(this, BulletScreenEngine);

  //变量初始化

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
   * 剩余弹幕，屏幕上的弹幕
   * @private @type {number}
   */

  var _bulletScreens = new _linkedList.LinkedList(),
      _bulletScreensOnScreen = new _linkedList.LinkedList();
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


  var _refreshRate = 0.06; //初始刷新频率

  /**
   * 上一次刷新时间
   * @private @type {number}
   */

  var _lastRefreshTime; //默认参数


  options = setValue(options, {});
  options.verticalInterval = setValue(options.verticalInterval, 8, 'number'); //垂直间距

  options.playSpeed = setValue(options.playSpeed, 1, 'number'); //播放速度倍数

  options.clock = setValue(options.clock, function (time) {
    return new Date().getTime() - _startTime;
  }, 'function'); //时间基准

  options.scaling = setValue(options.scaling, 1, 'number'); //缩放比例

  options.timeOutDiscard = setValue(options.timeOutDiscard, true, 'boolean'); //超时丢弃

  options.hiddenTypes = setValue(options.hiddenTypes, 0, 'number'); //要隐藏的弹幕类型

  options.defaultStyle = setValue(options.defaultStyle, {});
  options.defaultStyle.shadowBlur = setValue(options.defaultStyle.shadowBlur, 2); //全局：阴影的模糊级别，0为不显示阴影

  options.defaultStyle.fontWeight = setValue(options.defaultStyle.fontWeight, '600'); //全局：字体粗细

  options.defaultStyle.fontFamily = setValue(options.defaultStyle.fontFamily, 'sans-serif'); //全局：字体系列

  options.defaultStyle.size = setValue(options.defaultStyle.size, 19); //全局：字体大小（单位：像素）

  options.defaultStyle.boxColor = setValue(options.defaultStyle.boxColor, null); //全局：外框颜色

  options.defaultStyle.color = setValue(options.defaultStyle.color, 'white'); //全局：字体颜色

  options.defaultStyle.borderColor = setValue(options.defaultStyle.borderColor, null); //全局：描边颜色

  options.defaultStyle.speed = setValue(options.defaultStyle.speed, 0.15); //全局：弹幕速度（单位：像素/毫秒） 仅类型0、1有效

  options.defaultStyle.residenceTime = setValue(options.defaultStyle.residenceTime, 5000); //全局：弹幕停留时间 仅类型2、3有效

  bulletScreenStyleCheckType(options.defaultStyle); //检查弹幕样式类型

  /**
   * 全局选项：一个 {@link openBSE~Options} 结构。
   * @readonly
   * @type {openBSE~Options}
   */

  this.options = options; //事件初始化

  var _event = new _event2.Event();
  /**
   * 弹幕单击事件。当单击弹幕时触发。
   * @event openBSE.BulletScreenEngine#click
   * @property {openBSE~BulletScreen} e.bulletScreen - 被单击的弹幕的数据：一个 {@link openBSE~BulletScreen} 结构。
   */


  _event.add('click');
  /**
   * 弹幕上下文菜单事件。当触发弹幕上下文菜单时触发。
   * @event openBSE.BulletScreenEngine#contextmenu
   * @property {openBSE~BulletScreen} e.bulletScreen - 被单击的弹幕的数据：一个 {@link openBSE~BulletScreen} 结构。
   */


  _event.add('contextmenu');
  /**
   * 绑定事件处理程序
   * @description 绑定事件处理程序。当事件处理程序返回值为 false 时停止冒泡。
   * @param {string} name 事件名称
   * @param {function} fun 事件处理程序
   * @listens openBSE.BulletScreenEngine#click
   * @listens openBSE.BulletScreenEngine#contextmenu
   * @returns false: 失败 数字: 添加后的事件数
   */


  this.bind = _event.bind;
  /**
   * 解绑事件处理程序（fun为空解绑所有事件处理程序）
   * @param {string} name 事件名称
   * @param {function} fun 事件处理程序
   * @returns true: 成功 false: 失败 数字: 删除后的事件数
   */

  this.unbind = _event.unbind; //初始化

  var _elementSize = {
    width: element.clientWidth / options.scaling,
    height: element.clientHeight / options.scaling
  };
  var _oldDevicePixelRatio = window.devicePixelRatio;
  var _oldScaling = options.scaling;
  var _oldClientWidth = element.clientWidth;
  var _oldClientHeight = element.clientHeight;
  var _oldHiddenTypes = options.hiddenTypes; //渲染器工厂

  var renderersFactory = new _renderersFactory.RenderersFactory(element, this.options, _elementSize, _event, _bulletScreensOnScreen);

  var _renderer = renderersFactory.getRenderer(renderMode); //实例化渲染器


  setInterval(setSize, 100);
  console.info('%copenBSE%c now loaded.\n' + '\n' + '%cVersion: %s\n' + 'Build Date: %s\n' + '\n' + '%copenBSE is a high-performance JavaScript bullet-screen (danmaku) engine.\n' + 'Home: https://iamscottxu.github.io/openBSE/', 'font-weight:bold; color:#0099FF;', '', 'font-style:italic;', _version.VERSION, _version.BUILE_DATE, ''); //公共函数

  /**
   * 添加弹幕到弹幕列表。
   * @description 添加弹幕到弹幕列表。由于弹幕在屏幕上出现过后，弹幕引擎将从列表中彻底删除此弹幕。所以，在改变播放进度时，可能需要先[清空弹幕列表]{@link BulletScreenEngine#cleanBulletScreenList}，然后重新加载此播放进度以后的弹幕。
   * @param {openBSE~BulletScreen} bulletScreen - 单条弹幕数据：一个 {@link openBSE~BulletScreen} 结构。
   */

  this.addBulletScreen = function (bulletScreen) {
    bulletScreen = setValue(bulletScreen, {}, 'object');
    bulletScreen.text = setValue(bulletScreen.text, null, 'string'); //弹幕文本

    bulletScreen.canDiscard = setValue(bulletScreen.canDiscard, true, 'boolean'); //是否允许丢弃

    bulletScreen.startTime = setValue(bulletScreen.startTime, options.clock(), 'number'); //弹幕进入时间

    bulletScreen.type = setValue(bulletScreen.type, _bulletScreenType.BulletScreenType.rightToLeft, 'number'); //类型

    if (bulletScreen.type != _bulletScreenType.BulletScreenType.leftToRight && bulletScreen.type != _bulletScreenType.BulletScreenType.rightToLeft && bulletScreen.type != _bulletScreenType.BulletScreenType.top && bulletScreen.type != _bulletScreenType.BulletScreenType.bottom) throw new TypeError(PARAMETERS_TYPE_ERROR);
    bulletScreenStyleCheckType(bulletScreen.style); //检查弹幕样式类型

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
      if (_pauseTime) _startTime += options.clock() - _pauseTime;
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
      _pauseTime = options.clock();
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
   * 清空屏幕弹幕。
   * @description 清空屏幕弹幕。清空屏幕上已经出现的弹幕，不包括弹幕列表中的弹幕。
   */


  this.cleanBulletScreenListOnScreen = function () {
    _bulletScreensOnScreen.clean();

    _renderer.cleanScreen();
  };
  /**
   * 停止播放弹幕。
   * @description 停止播放弹幕。停止播放弹幕是指停止播放弹幕，默认[时间基准（options.clock）]{@link openBSE~BulletScreenStyle}归零，并[清空弹幕列表]{@link BulletScreenEngine#cleanBulletScreenList}、[清空屏幕弹幕]{@link BulletScreenEngine#cleanBulletScreenListOnScreen}。
   */


  this.stop = function () {
    if (_playing) {
      this.pause();
    }

    this.cleanBulletScreenList();
    this.cleanBulletScreenListOnScreen();
    _pauseTime = 0;
    _startTime = null;
  };
  /**
   * 隐藏弹幕。
   */


  this.hide = _renderer.hide;
  /**
   * 显示弹幕。
   */

  this.show = _renderer.show;
  /**
   * 设置弹幕不透明度。
   * @param {number} opacity - 弹幕不透明度：取值范围 0.0 到 1.0，0.0 全透明；1.0 不透明。
   */

  this.setOpacity = _renderer.setOpacity;
  /**
   * 获取弹幕不透明度。
   * @returns {number} - 弹幕不透明度：取值范围 0.0 到 1.0，0.0 全透明；1.0 不透明。
   */

  this.getOpacity = _renderer.getOpacity;
  /**
   * 获取弹幕可见性。
   * @returns {boolean} - 指示弹幕是否可见。
   * @description 获取弹幕可见性。如要显示弹幕请调用 [bulletScreenEngine.show();]{@link BulletScreenEngine#show} ，要隐藏弹幕请调用 [bulletScreenEngine.hide();]{{@link BulletScreenEngine#hide}} 。
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
      time: _playing ? options.clock() : _pauseTime,
      bulletScreensOnScreenCount: _bulletScreensOnScreen.getLength(),
      bulletScreensCount: _bulletScreens.getLength(),
      delay: _delay,
      delayBulletScreensCount: _delayBulletScreensCount,
      fps: _playing ? Math.floor(_refreshRate * 1000) : 0 //帧频

    };
  };
  /**
   * 获取版本信息。
   * @returns {openBSE~VersionInfo} 版本信息：一个 {@link openBSE~VersionInfo} 结构。
   */


  this.getVersion = function () {
    return {
      version: _version.VERSION,
      buildDate: _version.BUILE_DATE
    };
  }; //内部函数

  /**
   * 设置值
   * @private
   * @param {string} value - 值
   * @param {string} defaultBalue - 默认值
   * @param {string} type 类型
   * @returns {object} - 值
   */


  function setValue(value, defaultBalue) {
    var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var returnValue = value;
    if (typeof value === 'undefined' || typeof value === 'number' && isNaN(value) || value === null) returnValue = defaultBalue;
    checkType(returnValue, type);
    return returnValue;
  }
  /**
   * 检查类型
   * @private
   * @param {string} value - 值
   * @param {string} type - 类型
   * @param {boolean} canBeNull - 可以为空
   */


  function checkType(value, type) {
    var canBeNull = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    if (type === null) return;
    if (canBeNull && (typeof value === 'undefined' || typeof value === 'number' && isNaN(value) || value === null)) return;

    if (_typeof(type) === 'object') {
      var flat = false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = type[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;
          if (_typeof(value) === item) flat = true;
          break;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (!flat) throw new TypeError(PARAMETERS_TYPE_ERROR);
    } else if (_typeof(value) != type) throw new TypeError(PARAMETERS_TYPE_ERROR);
  }
  /**
   * 检查弹幕样式类型
   * @private
   * @param {object} style - 弹幕样式
   */


  function bulletScreenStyleCheckType(style) {
    checkType(style, 'object', true);
    checkType(style.shadowBlur, 'number', true); //全局：阴影的模糊级别，0为不显示阴影

    checkType(style.fontWeight, ['string', 'number'], true); //全局：字体粗细

    checkType(style.fontFamily, 'string', true); //全局：字体系列

    checkType(style.size, 'number', true); //全局：字体大小（单位：像素）

    checkType(style.boxColor, 'string', true); //全局：外框颜色

    checkType(style.color, 'string', true); //全局：字体颜色

    checkType(style.borderColor, 'string', true); //全局：描边颜色

    checkType(style.speed, 'number', true); //全局：弹幕速度（单位：像素/毫秒） 仅类型0、1有效

    checkType(style.residenceTime, 'number', true); //全局：弹幕停留时间 仅类型2、3有效
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

    _renderer.draw(); //绘制弹幕


    if (_playing) requestAnimationFrame(refresh);
  }
  /**
   * 移动弹幕函数
   * @private
   */


  function moveBulletScreenOnScreen() {
    _bulletScreensOnScreen.forEach(function (bulletScreenOnScreen) {
      var nowTime = options.clock();

      switch (bulletScreenOnScreen.bulletScreen.type) {
        case _bulletScreenType.BulletScreenType.rightToLeft:
          if (bulletScreenOnScreen.x > -bulletScreenOnScreen.width) {
            bulletScreenOnScreen.x -= bulletScreenOnScreen.bulletScreen.style.speed * options.playSpeed / _refreshRate;
          } else {
            _renderer.delete(bulletScreenOnScreen);

            return {
              remove: true
            };
          }

          break;

        case _bulletScreenType.BulletScreenType.leftToRight:
          if (bulletScreenOnScreen.x < _elementSize.width) {
            bulletScreenOnScreen.x += bulletScreenOnScreen.bulletScreen.style.speed * options.playSpeed / _refreshRate;
          } else {
            _renderer.delete(bulletScreenOnScreen);

            return {
              remove: true
            };
          }

          break;

        case _bulletScreenType.BulletScreenType.top:
        case _bulletScreenType.BulletScreenType.bottom:
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
      var nowTime = options.clock();
      if (bulletScreen.startTime > nowTime) return;

      if (!options.timeOutDiscard || !bulletScreen.canDiscard || bulletScreen.startTime > nowTime - Math.floor(1 / _refreshRate) * 60) {
        setDefaultStyle(bulletScreen); //填充默认样式

        getBulletScreenOnScreen(nowTime, bulletScreen); //生成屏幕弹幕对象并添加到屏幕弹幕集合
      } else _delayBulletScreensCount++;

      _bulletScreens.pop(true, false);

      times--;
    } while (_bulletScreensOnScreen.getLength() === 0 || times > 0);
  }
  /**
   * 填充默认样式
   * @private
   * @param {openBSE~BulletScreen} bulletScreen 弹幕
   */


  function setDefaultStyle(bulletScreen) {
    bulletScreen.style = setValue(bulletScreen.style, {});
    bulletScreen.style.shadowBlur = setValue(bulletScreen.style.shadowBlur, options.defaultStyle.shadowBlur); //阴影的模糊级别，0为不显示阴影

    bulletScreen.style.fontWeight = setValue(bulletScreen.style.fontWeight, options.defaultStyle.fontWeight); //字体粗细

    bulletScreen.style.fontFamily = setValue(bulletScreen.style.fontFamily, options.defaultStyle.fontFamily); //字体系列

    bulletScreen.style.size = setValue(bulletScreen.style.size, options.defaultStyle.size); //字体大小（单位：像素）

    bulletScreen.style.boxColor = setValue(bulletScreen.style.boxColor, options.defaultStyle.boxColor); //方框颜色

    bulletScreen.style.color = setValue(bulletScreen.style.color, options.defaultStyle.color); //字体颜色

    bulletScreen.style.borderColor = setValue(bulletScreen.style.borderColor, options.defaultStyle.borderColor); //边框颜色

    bulletScreen.style.speed = setValue(bulletScreen.style.speed, options.defaultStyle.speed); //弹幕速度（单位：像素/毫秒） 仅类型0、1有效

    bulletScreen.style.residenceTime = setValue(bulletScreen.style.residenceTime, options.defaultStyle.residenceTime); //弹幕停留时间 仅类型2、3有效
  }
  /**
   * 生成屏幕弹幕对象函数
   * @private
   * @param {number} nowTime 当前时间
   * @param {openBSE~BulletScreen} bulletScreen 弹幕
   */


  function getBulletScreenOnScreen(nowTime, bulletScreen) {
    _delay = nowTime - bulletScreen.startTime;
    var bulletScreenOnScreen = {};
    bulletScreenOnScreen.bulletScreen = bulletScreen;
    bulletScreenOnScreen.startTime = nowTime; //弹幕头部进屏幕时间

    bulletScreenOnScreen.size = bulletScreenOnScreen.bulletScreen.style.size;
    bulletScreenOnScreen.height = bulletScreenOnScreen.size; //弹幕的高度：像素

    _renderer.creatAndgetWidth(bulletScreenOnScreen); //创建弹幕元素并计算宽度


    switch (bulletScreen.type) {
      case _bulletScreenType.BulletScreenType.rightToLeft:
        bulletScreenOnScreen.endTime = parseInt(nowTime + (_elementSize.width + bulletScreenOnScreen.width) / (bulletScreen.style.speed * options.playSpeed)); //弹幕尾部出屏幕的时间

        bulletScreenOnScreen.x = _elementSize.width; //弹幕初始X坐标

        bulletScreenOnScreen.y = options.verticalInterval; //弹幕初始Y坐标

        break;

      case _bulletScreenType.BulletScreenType.leftToRight:
        bulletScreenOnScreen.endTime = parseInt(nowTime + (_elementSize.width + bulletScreenOnScreen.width) / (bulletScreen.style.speed * options.playSpeed)); //弹幕尾部出屏幕的时间

        bulletScreenOnScreen.x = -bulletScreenOnScreen.width; //弹幕初始X坐标

        bulletScreenOnScreen.y = options.verticalInterval; //弹幕初始Y坐标

        break;

      case _bulletScreenType.BulletScreenType.top:
        bulletScreenOnScreen.endTime = bulletScreenOnScreen.startTime + bulletScreen.style.residenceTime * options.playSpeed;
        bulletScreenOnScreen.x = parseInt((_elementSize.width - bulletScreenOnScreen.width) / 2); //弹幕初始X坐标

        bulletScreenOnScreen.y = options.verticalInterval; //弹幕初始Y坐标

        break;

      case _bulletScreenType.BulletScreenType.bottom:
        bulletScreenOnScreen.endTime = bulletScreenOnScreen.startTime + bulletScreen.style.residenceTime * options.playSpeed;
        bulletScreenOnScreen.x = parseInt((_elementSize.width - bulletScreenOnScreen.width) / 2); //弹幕初始X坐标

        bulletScreenOnScreen.y = -options.verticalInterval - bulletScreenOnScreen.height; //弹幕初始Y坐标

        break;
    }

    var oldLength = _bulletScreensOnScreen.getLength();

    if (bulletScreen.type === _bulletScreenType.BulletScreenType.top || bulletScreen.type === _bulletScreenType.BulletScreenType.bottom) {
      _bulletScreensOnScreen.forEach(function (nextBulletScreenOnScreen) {
        //弹幕不在流中，是固定弹幕
        if (nextBulletScreenOnScreen.bulletScreen.type != bulletScreen.type) return; //不是同一种类型的弹幕

        if (bulletScreen.type === _bulletScreenType.BulletScreenType.top) {
          //如果新弹幕在当前弹幕上方且未与当前弹幕重叠
          if (bulletScreenOnScreen.y + bulletScreenOnScreen.height < nextBulletScreenOnScreen.y) return {
            add: {
              addToUp: true,
              element: setActualY(bulletScreenOnScreen)
            },
            stop: true
          }; //如果上一条弹幕的消失时间小于当前弹幕的出现时间

          if (nextBulletScreenOnScreen.endTime < nowTime) bulletScreenOnScreen.y = nextBulletScreenOnScreen.y;else bulletScreenOnScreen.y = nextBulletScreenOnScreen.y + nextBulletScreenOnScreen.height + options.verticalInterval;
        } else {
          //如果新弹幕在当前弹幕下方且未与当前弹幕重叠
          if (bulletScreenOnScreen.y > nextBulletScreenOnScreen.y + nextBulletScreenOnScreen.height) {
            return {
              add: {
                addToUp: true,
                element: setActualY(bulletScreenOnScreen)
              },
              stop: true
            };
          } //如果上一条弹幕的消失时间小于当前弹幕的出现时间


          if (nextBulletScreenOnScreen.endTime < nowTime) bulletScreenOnScreen.y = nextBulletScreenOnScreen.y;else bulletScreenOnScreen.y = nextBulletScreenOnScreen.y - bulletScreenOnScreen.height - options.verticalInterval;
        }
      }, true);
    } else {
      //当前弹幕经过一个点需要的总时长
      var bulletScreenOnScreenWidthTime = bulletScreenOnScreen.width / (bulletScreen.style.speed * options.playSpeed);

      _bulletScreensOnScreen.forEach(function (nextBulletScreenOnScreen) {
        //弹幕在流中，是移动弹幕
        if (nextBulletScreenOnScreen.bulletScreen.type === _bulletScreenType.BulletScreenType.top || nextBulletScreenOnScreen.bulletScreen.type === _bulletScreenType.BulletScreenType.bottom) return; //弹幕不在流中，为固定弹幕
        //如果新弹幕在当前弹幕上方且未与当前弹幕重叠

        if (bulletScreenOnScreen.y + bulletScreenOnScreen.height < nextBulletScreenOnScreen.y) return {
          add: {
            addToUp: true,
            element: setActualY(bulletScreenOnScreen)
          },
          stop: true
        }; //上一条弹幕经过一个点需要的总时长

        var nextBulletScreenOnScreenWidthTime = nextBulletScreenOnScreen.width / (nextBulletScreenOnScreen.bulletScreen.style.speed * options.playSpeed); //如果上一条弹幕的消失时间小于当前弹幕的出现时间

        if (nextBulletScreenOnScreen.startTime + nextBulletScreenOnScreenWidthTime >= nowTime || //如果上一条弹幕的头进入了，但是尾还没进入
        nextBulletScreenOnScreen.endTime >= bulletScreenOnScreen.endTime - bulletScreenOnScreenWidthTime) //如果当前弹幕头出去了，上一条弹幕尾还没出去
          bulletScreenOnScreen.y = nextBulletScreenOnScreen.y + nextBulletScreenOnScreen.height + options.verticalInterval;else bulletScreenOnScreen.y = nextBulletScreenOnScreen.y;
      }, true);
    }

    if (_bulletScreensOnScreen.getLength() === oldLength) _bulletScreensOnScreen.push(setActualY(bulletScreenOnScreen), false);
  }
  /**
   * 设置真实的Y坐标
   * @private
   * @param {object} bulletScreenOnScreen 屏幕弹幕事件
   * @returns {object} 屏幕弹幕事件
   */


  function setActualY(bulletScreenOnScreen) {
    var bulletScreen = bulletScreenOnScreen.bulletScreen;

    if (bulletScreen.type === _bulletScreenType.BulletScreenType.leftToRight || bulletScreen.type === _bulletScreenType.BulletScreenType.rightToLeft || bulletScreen.type === _bulletScreenType.BulletScreenType.top) {
      bulletScreenOnScreen.actualY = bulletScreenOnScreen.y % (_elementSize.height - bulletScreenOnScreen.height);
    } else if (bulletScreen.type === _bulletScreenType.BulletScreenType.bottom) {
      bulletScreenOnScreen.actualY = _elementSize.height + bulletScreenOnScreen.y % _elementSize.height;
    }

    return bulletScreenOnScreen;
  }
  /**
   * 设置尺寸
   * @private
   */


  function setSize() {
    if (_oldDevicePixelRatio != window.devicePixelRatio || _oldScaling != options.scaling || _oldClientWidth != element.clientWidth || _oldClientHeight != element.clientHeight || _oldHiddenTypes != options.hiddenTypes) {
      _elementSize.width = element.clientWidth / options.scaling;
      _elementSize.height = element.clientHeight / options.scaling;
      _oldDevicePixelRatio = window.devicePixelRatio;
      _oldScaling = options.scaling;
      _oldClientWidth = element.clientWidth;
      _oldClientHeight = element.clientHeight;
      _oldHiddenTypes = options.hiddenTypes;

      _renderer.setSize();

      if (!_playing) _renderer.draw(); //非播放状态则重绘
    }
  }
};

exports.BulletScreenEngine = BulletScreenEngine;

},{"./bulletScreenType":4,"./lib/event":5,"./lib/linkedList":6,"./lib/renderers/renderersFactory":11,"./version":15}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BulletScreenType = void 0;

/**
 * 弹幕类型枚举
 * @alias openBSE.BulletScreenType
 * @readonly
 * @enum {number}
 */
var BulletScreenType = {
  /** 从右到左弹幕 */
  rightToLeft: 1,

  /** 从左到右弹幕（逆向弹幕） */
  leftToRight: 2,

  /** 顶部弹幕 */
  top: 4,

  /** 底部弹幕 */
  bottom: 8
};
exports.BulletScreenType = BulletScreenType;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Event = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 创建一个新的事件模型。
 * @class
 * @public
 */
var Event = function Event() {
  _classCallCheck(this, Event);

  /**
   * 事件列表
   * @private
   */
  var eventList = {};
  /**
   * 添加事件
   * @function
   * @public
   * @param {String} name 事件名称
   * @returns {Boolean} true: 成功 false: 失败
   */

  this.add = function (name) {
    if (typeof eventList[name] != 'undefined') return false;
    eventList[name] = [];
    return true;
  };
  /**
   * 删除事件
   * @function
   * @public
   * @param {String} name 事件名称
   * @returns {Boolean} true: 成功 false: 失败
   */


  this.remove = function (name) {
    if (typeof eventList[name] === 'undefined') return false;
    delete eventList[name];
    return true;
  };
  /**
   * 绑定事件处理程序
   * @function
   * @public
   * @param {String} name 事件名称
   * @param {Function} fun 事件处理程序
   * @returns false: 失败 数字: 添加后的事件数
   */


  this.bind = function (name, fun) {
    var event = eventList[name];
    if (typeof event === 'undefined' || typeof fun != 'function') return false;

    for (var index in event) {
      if (event[index] === fun) return false;
    }

    return event.push(fun);
  };
  /**
   * 解绑事件处理程序（fun为空解绑所有事件处理程序）
   * @function
   * @public
   * @param {String} name 事件名称
   * @param {Function} fun 事件处理程序
   * @returns true: 成功 false: 失败 数字: 删除后的事件数
   */


  this.unbind = function (name, fun) {
    var event = eventList[name];
    if (typeof event === 'undefined') return false;

    if (typeof fun != 'function') {
      eventList[name] = [];
      return true;
    } else {
      for (var index in event) {
        if (event[index] === fun) {
          event.splice(fun, 1);
          return event.length;
        }
      }
    }
  };
  /**
   * 触发事件
   * @function
   * @public
   * @param {String} name 事件名称
   * @param {Object} e 事件数据
   * @returns {Boolean} true: 成功 false: 失败
   */


  this.trigger = function (name, e) {
    var event = eventList[name];
    if (typeof event === 'undefined') return false;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = event[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var fun = _step.value;
        if (!fun(e)) return true;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return true;
  };
};

exports.Event = Event;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LinkedList = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 创建一个双向链表。
 * @class
 * @public
 */
var LinkedList = function LinkedList() {
  _classCallCheck(this, LinkedList);

  /**
   * 双向链表节点
   * @class
   * @private
  */
  var node = function node(element) {
    _classCallCheck(this, node);

    this.element = element;
    this.next = null;
    this.previous = null;
  }; //初始化


  var topNode = new node(null);
  var bottomNode = new node(null);
  var length = 0;
  topNode.next = bottomNode;
  bottomNode.previous = topNode; //公共函数

  /**
   * 获取元素个数
   * @function
   * @public
   * @returns {Number} 元素个数
   */

  this.getLength = function (l) {
    return length;
  };
  /**
   * 插入元素
   * @function
   * @public
   * @param {Object} element 元素
   * @param {Boolean} top true: 插入到顶部 false: 插入到底部
   */


  this.push = function (element, top) {
    var thisNode = new node(element);

    if (top) {
      thisNode.next = topNode.next;
      thisNode.previous = topNode;
      topNode.next = topNode.next.previous = thisNode;
    } else {
      thisNode.previous = bottomNode.previous;
      thisNode.next = bottomNode;
      bottomNode.previous = bottomNode.previous.next = thisNode;
    }

    length++;
  };
  /**
   * 读取元素
   * @function
   * @public
   * @param {Boolean} remove 读取后是否删除
   * @param {Boolean} top true: 读取顶部 false: 读取底部
   * @returns {Object} 元素
   */


  this.pop = function (remove, top) {
    var thisNode;

    if (top) {
      thisNode = topNode.next;

      if (topNode.next != bottomNode && remove) {
        thisNode.next.previous = topNode;
        topNode.next = thisNode.next;
      }
    } else {
      thisNode = bottomNode.previous;

      if (bottomNode.previous != topNode && remove) {
        thisNode.previous.next = bottomNode;
        bottomNode.previous = thisNode.previous;
      }
    }

    if (remove) length--;
    return thisNode.element;
  };
  /**
   * 清空链表
   * @function
   * @public
   */


  this.clean = function () {
    topNode = new node(null);
    bottomNode = new node(null);
    topNode.next = bottomNode;
    bottomNode.previous = topNode;
    length = 0;
  };
  /**
   * 遍历链表
   * @function
   * @public
   * @param {Function} fun 遍历回调函数
   * 回调函数（参数：元素，返回：{remove：删除此元素，add:插入元素(add.addToUp:插入到上方, add.element:元素), stop：停止遍历}）
   * @param {boolean} topToBottom true: 从顶到底 false: 从底到顶
   */


  this.forEach = function (fun, topToBottom) {
    var thisNode = topToBottom ? topNode : bottomNode;

    while (topToBottom ? (thisNode = thisNode.next) != bottomNode : (thisNode = thisNode.previous) != topNode) {
      var _return = fun(thisNode.element);

      if (_return) {
        if (_return.add) {
          var newNode = new node(_return.add.element);

          if (_return.add.addToUp) {
            newNode.previous = thisNode.previous;
            newNode.next = thisNode;
            thisNode.previous.next = newNode;
            thisNode.previous = newNode;
          } else {
            newNode.previous = thisNode;
            newNode.next = thisNode.next;
            thisNode.next.previous = newNode;
            thisNode.next = newNode;
          }

          length++;
        }

        if (_return.remove) {
          thisNode.previous.next = thisNode.next;
          thisNode.next.previous = thisNode.previous;
          length--;
        }

        if (_return.stop) {
          return;
        }
      }
    }
  };
};

exports.LinkedList = LinkedList;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseRenderer = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseRenderer = function BaseRenderer(element, options, elementSize) {
  _classCallCheck(this, BaseRenderer);

  if ((this instanceof BaseRenderer ? this.constructor : void 0) === BaseRenderer) {
    throw new Error();
  }

  init(); //初始化

  /**
   * 隐藏弹幕
   * @private @type {Boolean}
   */

  var _hide = false;
  /**
   * 透明度
   * @private @type {Float}
   */

  var _opacity = 0.0;

  this.cleanScreen = function () {
    throw new Error();
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
    element.style.visibility = 'visible';
  };
  /**
   * 设置弹幕不透明度。
   * @param {Float} opacity 弹幕不透明度：取值范围 0.0 到 1.0，0.0 全透明；1.0 不透明。
   */


  this.setOpacity = function (opacity) {
    if (typeof opacity != 'number') throw new Error();
    _opacity = opacity;
    element.style.opacity = _opacity;
  };
  /**
   * 获取弹幕不透明度。
   * @returns {Float} 弹幕不透明度：取值范围 0.0 到 1.0，0.0 全透明；1.0 不透明。
   */


  this.getOpacity = function () {
    return _opacity;
  };
  /**
   * 获取弹幕可见性。
   * @returns {Boolean}  指示弹幕是否可见。
   * @description 获取弹幕可见性。如要显示弹幕请调用 [bulletScreenEngine.show();]{@link BulletScreenEngine#show} ，要隐藏弹幕请调用 [bulletScreenEngine.hide();]{{@link BulletScreenEngine#hide}} 。
   */


  this.getVisibility = function () {
    return !_hide;
  };
  /**
   * 绘制函数
   */


  this.draw = function () {
    throw new Error();
  };
  /**
   * 创建弹幕元素
   * @property {Object} bulletScreenOnScreen 屏幕弹幕对象
   */


  this.creatAndgetWidth = function (bulletScreenOnScreen) {
    throw new Error();
  };
  /**
   * 删除弹幕元素
   * @property {Object} bulletScreenOnScreen 屏幕弹幕对象
   */


  this.delete = function (bulletScreenOnScreen) {
    throw new Error();
  };
  /**
   * 设置尺寸
   */


  this.setSize = setSize;
  /**
   * 检查弹幕是否被隐藏
   * @param {object} - 屏幕弹幕对象
   */

  this.checkWhetherHide = function (bulletScreenOnScreen) {
    return (bulletScreenOnScreen.bulletScreen.type & options.hiddenTypes) === bulletScreenOnScreen.bulletScreen.type;
  };

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
    element.style.position = 'relative';
  }
};

exports.BaseRenderer = BaseRenderer;

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CanvasBaseRenderer = void 0;

var _baseRenderer = require("./baseRenderer");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var CanvasBaseRenderer =
/*#__PURE__*/
function (_BaseRenderer) {
  _inherits(CanvasBaseRenderer, _BaseRenderer);

  function CanvasBaseRenderer(element, options, elementSize, event, bulletScreensOnScreen) {
    var _this;

    _classCallCheck(this, CanvasBaseRenderer);

    if ((this instanceof CanvasBaseRenderer ? this.constructor : void 0) === CanvasBaseRenderer) {
      throw new Error();
    }

    var _devicePixelRatio = typeof window.devicePixelRatio === 'undefined' ? 1 : window.devicePixelRatio;

    _devicePixelRatio *= options.scaling;

    var _canvas = init();

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CanvasBaseRenderer).call(this, _canvas, options, elementSize));
    /**
     * 创建弹幕元素
     * @function
     * @property {Object} bulletScreenOnScreen 屏幕弹幕对象
     */

    _this.creatAndgetWidth = function (bulletScreenOnScreen) {
      var bulletScreen = bulletScreenOnScreen.bulletScreen;
      var hideCanvas = document.createElement('canvas');
      var hideCanvasContext = hideCanvas.getContext('2d');
      hideCanvasContext.font = "".concat(bulletScreen.style.fontWeight, " ").concat(bulletScreenOnScreen.size, "px ").concat(bulletScreen.style.fontFamily);
      bulletScreenOnScreen.width = hideCanvasContext.measureText(bulletScreen.text).width; //弹幕的宽度：像素

      hideCanvas.width = (bulletScreenOnScreen.width + 8) * _devicePixelRatio;
      hideCanvas.height = (bulletScreenOnScreen.height + 8) * _devicePixelRatio;
      hideCanvasContext.shadowColor = 'black';
      hideCanvasContext.font = "".concat(bulletScreen.style.fontWeight, " ").concat(bulletScreenOnScreen.size * _devicePixelRatio, "px ").concat(bulletScreen.style.fontFamily);
      var textX = 4 * _devicePixelRatio;
      var textY = (4 + bulletScreenOnScreen.size * 0.8) * _devicePixelRatio;

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

      bulletScreenOnScreen.hideCanvas = hideCanvas;
    };
    /**
     * 删除弹幕元素
     * @function
     * @property {Object} bulletScreenOnScreen 屏幕弹幕对象
     */


    _this.delete = function (bulletScreenOnScreen) {};

    var _setSize = _this.setSize;
    /**
     * 设置尺寸
     * @function
     */

    _this.setSize = function () {
      _setSize();

      _devicePixelRatio = typeof window.devicePixelRatio === 'undefined' ? 1 : window.devicePixelRatio;
      _devicePixelRatio *= options.scaling;
      _canvas.width = elementSize.width * _devicePixelRatio;
      _canvas.height = elementSize.height * _devicePixelRatio;
    };
    /**
     * 获取缩放比例
     * @function
     * @returns {Float} 缩放比例
     */


    _this.getDevicePixelRatio = function () {
      return _devicePixelRatio;
    };
    /**
     * 获取画布对象
     * @function
     * @returns {Element} 画布对象
     */


    _this.getCanvas = function () {
      return _canvas;
    };
    /**
     * 添加Canvas
     * @function
     * @private
     * @returns {Element} 画布对象
     */


    function init() {
      var canvas = document.createElement('canvas'); //canvas对象

      element.innerHTML = '';
      element.appendChild(canvas);
      canvas.width = elementSize.width * _devicePixelRatio;
      canvas.height = elementSize.height * _devicePixelRatio;
      registerEvent(canvas); //注册事件响应程序

      return canvas;
    }

    var _checkWhetherHide = _this.checkWhetherHide;
    /**
     * 注册事件响应程序
     * @function
     * @private
     * @property {Element} element 元素
     */

    function registerEvent(element) {
      function getBulletScreenOnScreenByLocation(location) {
        var bulletScreen = null;
        bulletScreensOnScreen.forEach(function (bulletScreenOnScreen) {
          if (_checkWhetherHide(bulletScreenOnScreen)) return null;
          var x1 = bulletScreenOnScreen.x - 4;
          var x2 = x1 + bulletScreenOnScreen.width + 8;
          var y1 = bulletScreenOnScreen.actualY - 4;
          var y2 = y1 + bulletScreenOnScreen.height + 8;

          if (location.x >= x1 && location.x <= x2 && location.y >= y1 && location.y <= y2) {
            bulletScreen = bulletScreenOnScreen.bulletScreen;
            return {
              stop: true
            };
          }
        }, false);
        return bulletScreen;
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
      } //上下文菜单


      element.oncontextmenu = function (e) {
        var bulletScreen = getBulletScreenOnScreenByLocation(getLocation(e));
        if (bulletScreen) event.trigger('contextmenu', {
          bulletScreen: bulletScreen
        });
        return false;
      }; //单击


      element.onclick = function (e) {
        var bulletScreen = getBulletScreenOnScreenByLocation(getLocation(e));
        if (bulletScreen) event.trigger('click', {
          bulletScreen: bulletScreen
        });
        return false;
      };
    }

    return _this;
  }

  return CanvasBaseRenderer;
}(_baseRenderer.BaseRenderer);

exports.CanvasBaseRenderer = CanvasBaseRenderer;

},{"./baseRenderer":7}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CanvasRenderer = void 0;

var _canvasBaseRenderer = require("./canvasBaseRenderer");

var _browserNotSupportError = require("../../browserNotSupportError");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var CanvasRenderer =
/*#__PURE__*/
function (_CanvasBaseRenderer) {
  _inherits(CanvasRenderer, _CanvasBaseRenderer);

  function CanvasRenderer(element, options, elementSize, event, bulletScreensOnScreen) {
    var _this;

    _classCallCheck(this, CanvasRenderer);

    supportCheck();
    _this = _possibleConstructorReturn(this, _getPrototypeOf(CanvasRenderer).call(this, element, options, elementSize, event, bulletScreensOnScreen));

    _this.cleanScreen = function () {
      var canvas = this.getCanvas();
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    };
    /**
     * 绘制函数
     * @function
     */


    _this.draw = function () {
      var _this2 = this;

      var canvas = this.getCanvas();
      var devicePixelRatio = this.getDevicePixelRatio(); //离屏渲染

      var hideCanvas = document.createElement('canvas');
      hideCanvas.width = canvas.width;
      hideCanvas.height = canvas.height;
      var hideCanvasContext = hideCanvas.getContext('2d');
      bulletScreensOnScreen.forEach(function (bulletScreenOnScreen) {
        if (_this2.checkWhetherHide(bulletScreenOnScreen)) return;
        hideCanvasContext.drawImage(bulletScreenOnScreen.hideCanvas, (bulletScreenOnScreen.x - 4) * devicePixelRatio, (bulletScreenOnScreen.actualY - 4) * devicePixelRatio, (bulletScreenOnScreen.width + 8) * devicePixelRatio, (bulletScreenOnScreen.height + 8) * devicePixelRatio);
      }, true);
      var canvasContext = canvas.getContext('2d');
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      canvasContext.drawImage(hideCanvas, 0, 0);
    };
    /**
     * 支持检测
     * @function
     */


    function supportCheck() {
      var canvas = document.createElement('canvas'); //canvas对象

      if (typeof canvas.getContext != 'function') throw new _browserNotSupportError.BrowserNotSupportError('Canvas');
      var context = canvas.getContext('2d');
      if (context === null) throw new _browserNotSupportError.BrowserNotSupportError('Canvas 2D');
      if (typeof context.fillText != 'function') throw new _browserNotSupportError.BrowserNotSupportError('Canvas 2D fillText Function');
    }

    return _this;
  }

  return CanvasRenderer;
}(_canvasBaseRenderer.CanvasBaseRenderer);

exports.CanvasRenderer = CanvasRenderer;

},{"../../browserNotSupportError":2,"./canvasBaseRenderer":8}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CSS3Renderer = void 0;

var _baseRenderer = require("./baseRenderer");

var _browserNotSupportError = require("../../browserNotSupportError");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var CSS3Renderer =
/*#__PURE__*/
function (_BaseRenderer) {
  _inherits(CSS3Renderer, _BaseRenderer);

  function CSS3Renderer(element, options, elementSize, event, bulletScreensOnScreen) {
    var _this;

    _classCallCheck(this, CSS3Renderer);

    supportCheck();

    var _div = init();

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CSS3Renderer).call(this, _div, options, elementSize));

    _this.cleanScreen = function () {
      _div.innerHTML = '';
    };
    /**
     * 绘制函数
     * @function
     */


    _this.draw = function () {
      var _this2 = this;

      bulletScreensOnScreen.forEach(function (bulletScreenOnScreen) {
        if (_this2.checkWhetherHide(bulletScreenOnScreen)) {
          bulletScreenOnScreen.div.style.visibility = 'hidden';
          return;
        }

        bulletScreenOnScreen.div.style.visibility = 'visible';
        bulletScreenOnScreen.div.style.transform = bulletScreenOnScreen.div.style.webkitTransform = bulletScreenOnScreen.div.style.msTransform = "translate(".concat(bulletScreenOnScreen.x - 4, "px,").concat(bulletScreenOnScreen.actualY - 4, "px)");
      }, true);
    };
    /**
     * 创建弹幕元素
     * @function
     * @property {Object} bulletScreenOnScreen 屏幕弹幕对象
     */


    _this.creatAndgetWidth = function (bulletScreenOnScreen) {
      var bulletScreen = bulletScreenOnScreen.bulletScreen;
      var bulletScreenDiv = document.createElement('div');
      bulletScreenDiv.style.position = 'absolute';
      bulletScreenDiv.style.whiteSpace = 'nowrap';
      bulletScreenDiv.style.fontWeight = bulletScreen.style.fontWeight;
      bulletScreenDiv.style.fontSize = "".concat(bulletScreenOnScreen.size, "px");
      bulletScreenDiv.style.fontFamily = bulletScreen.style.fontFamily;
      bulletScreenDiv.style.lineHeight = "".concat(bulletScreenOnScreen.size, "px");
      bulletScreenDiv.style.color = bulletScreen.style.color;
      if (bulletScreen.style.shadowBlur != null) bulletScreenDiv.style.textShadow = "0 0 ".concat(bulletScreen.style.shadowBlur, "px black");

      if (bulletScreen.style.borderColor != null) {
        bulletScreenDiv.style.textStroke = bulletScreenDiv.style.webkitTextStroke = '0.5px';
        bulletScreenDiv.style.textStrokeColor = bulletScreenDiv.style.webkitTextStrokeColor = bulletScreen.borderColor;
      }

      if (bulletScreen.style.boxColor != null) {
        bulletScreenDiv.style.padding = '3px';
        bulletScreenDiv.style.border = '1px solid';
        bulletScreenDiv.style.borderColor = bulletScreen.style.boxColor;
      } else {
        bulletScreenDiv.style.padding = '4px';
      }

      bulletScreenDiv.appendChild(document.createTextNode(bulletScreen.text));
      bulletScreenDiv.bulletScreen = bulletScreen;

      _div.appendChild(bulletScreenDiv);

      bulletScreenOnScreen.width = bulletScreenDiv.clientWidth - 8; //弹幕的宽度：像素

      bulletScreenOnScreen.div = bulletScreenDiv;
    };
    /**
    * 删除弹幕元素
    * @function
    * @property {Object} bulletScreenOnScreen 屏幕弹幕对象
    */


    _this.delete = function (bulletScreenOnScreen) {
      _div.removeChild(bulletScreenOnScreen.div);
    };
    /**
     * 添加Div
     * @function
     * @private
     * @returns {Element} Div
     */


    function init() {
      var div = document.createElement('div'); //DIV

      element.innerHTML = '';
      element.appendChild(div);
      div.style.overflow = 'hidden';
      div.style.padding = '0';
      div.style.margin = '0';
      div.style.userSelect = div.style.webkitUserSelect = div.style.msUserSelect = 'none';
      div.style.cursor = 'default';
      registerEvent(div); //注册事件响应程序

      return div;
    }
    /**
     * 支持检测
     * @function
     */


    function supportCheck() {
      var style = document.createElement('div').style;
      if (typeof style.transform === 'undefined' && typeof style.msTransform === 'undefined' && typeof style.webkitTransform === 'undefined') throw new _browserNotSupportError.BrowserNotSupportError('CSS3 transform');
    }
    /**
     * 注册事件响应程序
     * @function
     * @private
     * @property {Element} element 元素
     */


    function registerEvent(element) {
      //上下文菜单
      element.oncontextmenu = function (e) {
        if (e.target != this) event.trigger('contextmenu', {
          bulletScreen: e.target.bulletScreen
        });
        return false;
      }; //单击


      element.onclick = function (e) {
        if (e.target != this) event.trigger('click', {
          bulletScreen: e.target.bulletScreen
        });
        return false;
      };
    }

    return _this;
  }

  return CSS3Renderer;
}(_baseRenderer.BaseRenderer);

exports.CSS3Renderer = CSS3Renderer;

},{"../../browserNotSupportError":2,"./baseRenderer":7}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RenderersFactory = void 0;

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
};

var RenderersFactory = function RenderersFactory(element, options, elementSize, event, bulletScreensOnScreen) {
  _classCallCheck(this, RenderersFactory);

  /**
   * 获取渲染器
   * @function
   * @param {String} renderMode - 渲染模式
   */
  this.getRenderer = function (renderMode) {
    var renderer = RENDERERS[renderMode];
    if (typeof renderer === 'undefined') throw new TypeError("The render mode \"".concat(renderMode, "\" is undefined."));
    return new renderer(element, options, elementSize, event, bulletScreensOnScreen);
  };
};

exports.RenderersFactory = RenderersFactory;

},{"./canvasRenderer":9,"./css3Renderer":10,"./svgRenderer":12,"./webglRenderer":13}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SVGRenderer = void 0;

var _baseRenderer = require("./baseRenderer");

var _browserNotSupportError = require("../../browserNotSupportError");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var SVGRenderer =
/*#__PURE__*/
function (_BaseRenderer) {
  _inherits(SVGRenderer, _BaseRenderer);

  function SVGRenderer(element, options, elementSize, event, bulletScreensOnScreen) {
    var _this;

    _classCallCheck(this, SVGRenderer);

    supportCheck();

    var _div = init();

    var _svg;

    var _defsSvg;

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SVGRenderer).call(this, _div, options, elementSize));

    _this.cleanScreen = function () {
      _svg.innerHTML = '';
      _defsSvg = createElementSVG('defs'); //defs

      _svg.appendChild(_defsSvg);
    };
    /**
     * 绘制函数
     * @function
     */


    _this.draw = function () {
      var _this2 = this;

      bulletScreensOnScreen.forEach(function (bulletScreenOnScreen) {
        for (var index in bulletScreenOnScreen.svg) {
          var item = bulletScreenOnScreen.svg[index];
          if (_this2.checkWhetherHide(bulletScreenOnScreen)) item.setAttribute('opacity', '0');else item.setAttribute('opacity', '1');
          item.setAttribute('transform', "translate(".concat(bulletScreenOnScreen.x - 4, ",").concat(bulletScreenOnScreen.actualY - 4, ")"));
        }
      }, true);
    };
    /**
     * 创建弹幕元素
     * @function
     * @property {Object} bulletScreenOnScreen 屏幕弹幕对象
     */


    _this.creatAndgetWidth = function (bulletScreenOnScreen) {
      var bulletScreen = bulletScreenOnScreen.bulletScreen;
      bulletScreenOnScreen.svg = {};
      var textSvg = createElementSVG('text');
      textSvg.setAttribute('x', 0);
      textSvg.setAttribute('y', bulletScreenOnScreen.size * 0.8);
      textSvg.setAttribute('font-family', bulletScreen.style.fontFamily);
      textSvg.setAttribute('font-size', bulletScreenOnScreen.size);
      textSvg.setAttribute('font-weight', bulletScreen.style.fontWeight);
      textSvg.setAttribute('fill', bulletScreen.style.color);
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
        bulletScreenOnScreen.filterId = filterId;
      }

      _svg.appendChild(textSvg);

      bulletScreenOnScreen.svg.text = textSvg;
      bulletScreenOnScreen.width = textSvg.getComputedTextLength(); //弹幕的宽度：像素

      if (bulletScreen.style.boxColor != null) {
        var rectSvg = createElementSVG('rect');
        rectSvg.setAttribute('x', -3);
        rectSvg.setAttribute('y', -3);
        rectSvg.setAttribute('fill', 'none');
        rectSvg.setAttribute('height', bulletScreenOnScreen.height + 7);
        rectSvg.setAttribute('width', bulletScreenOnScreen.width + 7);
        rectSvg.setAttribute('stroke', bulletScreen.style.boxColor);
        rectSvg.setAttribute('stroke-width', 1);

        _svg.appendChild(rectSvg);

        bulletScreenOnScreen.svg.rect = rectSvg;
      }
    };
    /**
    * 删除弹幕元素
    * @function
    * @property {Object} bulletScreenOnScreen 屏幕弹幕对象
    */


    _this.delete = function (bulletScreenOnScreen) {
      if (typeof bulletScreenOnScreen.filterId != 'undefined') {
        var filterSvg = document.getElementById(bulletScreenOnScreen.filterId);
        if (filterSvg != null && --filterSvg.bulletScreenCount === 0) _defsSvg.removeChild(filterSvg);
      }

      for (var index in bulletScreenOnScreen.svg) {
        _svg.removeChild(bulletScreenOnScreen.svg[index]);
      }
    };

    var _setSize = _this.setSize;
    /**
     * 设置尺寸
     * @function
     */

    _this.setSize = function () {
      _setSize();

      _svg.setAttribute('height', elementSize.height);

      _svg.setAttribute('width', elementSize.width);
    };
    /**
     * 添加Div
     * @function
     * @private
     * @returns {Element} Div
     */


    function init() {
      var div = document.createElement('div'); //DIV

      element.innerHTML = '';
      element.appendChild(div);
      div.style.padding = '0';
      div.style.margin = '0';
      _svg = createElementSVG('svg'); //SVG

      _defsSvg = createElementSVG('defs'); //defs

      _svg.appendChild(_defsSvg);

      _svg.setAttribute('height', elementSize.height);

      _svg.setAttribute('width', elementSize.width);

      div.appendChild(_svg);
      var eventDiv = document.createElement('div'); //DIV

      eventDiv.style.position = 'absolute';
      eventDiv.style.top = eventDiv.style.right = eventDiv.style.bottom = eventDiv.style.left = '0';
      div.appendChild(eventDiv);
      registerEvent(eventDiv); //注册事件响应程序

      return div;
    }
    /**
     * 支持检测
     * @function
     */


    function supportCheck() {
      if (typeof document.createElementNS != 'function') throw new _browserNotSupportError.BrowserNotSupportError('createElementNS Function');
      if (typeof createElementSVG('svg').createSVGRect != 'function') throw new _browserNotSupportError.BrowserNotSupportError('SVG');
    }

    var _checkWhetherHide = _this.checkWhetherHide;
    /**
     * 注册事件响应程序
     * @function
     * @private
     * @property {Element} element - 元素
     */

    function registerEvent(element) {
      function getBulletScreenOnScreenByLocation(location) {
        var bulletScreen = null;
        bulletScreensOnScreen.forEach(function (bulletScreenOnScreen) {
          if (_checkWhetherHide(bulletScreenOnScreen)) return null;
          var x1 = bulletScreenOnScreen.x - 4;
          var x2 = x1 + bulletScreenOnScreen.width + 8;
          var y1 = bulletScreenOnScreen.actualY - 4;
          var y2 = y1 + bulletScreenOnScreen.height + 8;

          if (location.x >= x1 && location.x <= x2 && location.y >= y1 && location.y <= y2) {
            bulletScreen = bulletScreenOnScreen.bulletScreen;
            return {
              stop: true
            };
          }
        }, false);
        return bulletScreen;
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
      } //上下文菜单


      element.oncontextmenu = function (e) {
        var bulletScreen = getBulletScreenOnScreenByLocation(getLocation(e));
        if (bulletScreen) event.trigger('contextmenu', {
          bulletScreen: bulletScreen
        });
        return false;
      }; //单击


      element.onclick = function (e) {
        var bulletScreen = getBulletScreenOnScreenByLocation(getLocation(e));
        if (bulletScreen) event.trigger('click', {
          bulletScreen: bulletScreen
        });
        return false;
      };
    }
    /**
     * 创建 SVG 元素
     * @function
     * @private
     * @param {String} qualifiedName - Element 名称
     * @param {*} options - 选项
     */


    function createElementSVG(qualifiedName, options) {
      return document.createElementNS('http://www.w3.org/2000/svg', qualifiedName, options);
    }

    return _this;
  }

  return SVGRenderer;
}(_baseRenderer.BaseRenderer);

exports.SVGRenderer = SVGRenderer;

},{"../../browserNotSupportError":2,"./baseRenderer":7}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebGLRenderer = void 0;

var _canvasBaseRenderer = require("./canvasBaseRenderer");

var _browserNotSupportError = require("../../browserNotSupportError");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var WebGLRenderer =
/*#__PURE__*/
function (_CanvasBaseRenderer) {
  _inherits(WebGLRenderer, _CanvasBaseRenderer);

  function WebGLRenderer(element, options, elementSize, event, bulletScreensOnScreen) {
    var _this;

    _classCallCheck(this, WebGLRenderer);

    supportCheck();
    _this = _possibleConstructorReturn(this, _getPrototypeOf(WebGLRenderer).call(this, element, options, elementSize, event, bulletScreensOnScreen));

    var _webglContext;

    var _positionAttributeLocation;

    var _resolutionUniformLocation;

    var _canvas = _this.getCanvas();

    init();

    _this.cleanScreen = function () {
      _webglContext.clear(_webglContext.COLOR_BUFFER_BIT);
    };
    /**
     * 绘制函数
     * @function
     */


    _this.draw = function () {
      var _this2 = this;

      var devicePixelRatio = this.getDevicePixelRatio(); // 清空画布

      _webglContext.clear(_webglContext.COLOR_BUFFER_BIT);

      bulletScreensOnScreen.forEach(function (bulletScreenOnScreen) {
        if (_this2.checkWhetherHide(bulletScreenOnScreen)) return; // 四个顶点坐标

        var x1 = (bulletScreenOnScreen.x - 4) * devicePixelRatio;
        var x2 = x1 + (bulletScreenOnScreen.width + 8) * devicePixelRatio;
        var y1 = (bulletScreenOnScreen.actualY - 4) * devicePixelRatio;
        var y2 = y1 + (bulletScreenOnScreen.height + 8) * devicePixelRatio; //绑定纹理

        _webglContext.bindTexture(_webglContext.TEXTURE_2D, bulletScreenOnScreen.texture2D); //绑定范围


        var positionBuffer = _webglContext.createBuffer(); // 将绑定点绑定到缓冲数据（positionBuffer）


        _webglContext.bindBuffer(_webglContext.ARRAY_BUFFER, positionBuffer);

        _webglContext.enableVertexAttribArray(_positionAttributeLocation); // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)


        _webglContext.vertexAttribPointer(_positionAttributeLocation, 2, //size 每次迭代运行提取两个单位数据
        _webglContext.FLOAT, //type 每个单位的数据类型是32位浮点型
        false, //normalize 不需要归一化数据
        0, //stride 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
        // 每次迭代运行运动多少内存到下一个数据开始点
        0 //offset 从缓冲起始位置开始读取
        );

        _webglContext.bufferData(_webglContext.ARRAY_BUFFER, new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]), _webglContext.STATIC_DRAW); //绘制


        _webglContext.drawArrays(_webglContext.TRIANGLES, //primitiveType
        0, //offset
        6 //count
        );
      }, true);
    };

    var _creatAndgetWidth = _this.creatAndgetWidth;
    /**
     * 创建弹幕元素
     * @function
     * @property {Object} bulletScreenOnScreen 屏幕弹幕对象
     */

    _this.creatAndgetWidth = function (bulletScreenOnScreen) {
      _creatAndgetWidth(bulletScreenOnScreen);

      var texture = _webglContext.createTexture();

      _webglContext.bindTexture(_webglContext.TEXTURE_2D, texture); // 设置参数


      _webglContext.texParameteri(_webglContext.TEXTURE_2D, _webglContext.TEXTURE_MIN_FILTER, _webglContext.NEAREST);

      _webglContext.texParameteri(_webglContext.TEXTURE_2D, _webglContext.TEXTURE_MAG_FILTER, _webglContext.NEAREST);

      _webglContext.texParameteri(_webglContext.TEXTURE_2D, _webglContext.TEXTURE_WRAP_S, _webglContext.CLAMP_TO_EDGE);

      _webglContext.texParameteri(_webglContext.TEXTURE_2D, _webglContext.TEXTURE_WRAP_T, _webglContext.CLAMP_TO_EDGE);

      _webglContext.texImage2D(_webglContext.TEXTURE_2D, 0, _webglContext.RGBA, _webglContext.RGBA, _webglContext.UNSIGNED_BYTE, bulletScreenOnScreen.hideCanvas);

      bulletScreenOnScreen.texture2D = texture;
    };

    var _setSize = _this.setSize;
    /**
     * 设置尺寸
     * @function
     */

    _this.setSize = function () {
      _setSize();

      _webglContext.viewport(0, 0, _canvas.width, _canvas.height);

      _webglContext.uniform2f(_resolutionUniformLocation, _canvas.width, _canvas.height); // 设置全局变量 分辨率

    };
    /**
     * 初始化
     * @function
     */


    function init() {
      // 创建着色器方法，输入参数：渲染上下文，着色器类型，数据源
      var createShader = function createShader(gl, type, source) {
        var shader = gl.createShader(type); // 创建着色器对象

        gl.shaderSource(shader, source); // 提供数据源

        gl.compileShader(shader); // 编译 -> 生成着色器

        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

        if (success) {
          return shader;
        }

        gl.deleteShader(shader);
      }; // 创建着色程序，输入参数：渲染上下文，顶点着色器，片段着色器


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
      }; //顶点着色器代码


      var vertexShaderSource = 'attribute vec2 a_position;';
      vertexShaderSource += 'attribute vec2 a_texcoord;';
      vertexShaderSource += 'uniform vec2 u_resolution;';
      vertexShaderSource += 'varying vec2 v_texcoord;';
      vertexShaderSource += 'void main() {'; // 从像素坐标转换到 0.0 到 1.0

      vertexShaderSource += 'vec2 zeroToOne = a_position / u_resolution;'; // 再把 0->1 转换 0->2

      vertexShaderSource += 'vec2 zeroToTwo = zeroToOne * 2.0;'; // 把 0->2 转换到 -1->+1 (裁剪空间)

      vertexShaderSource += 'vec2 clipSpace = zeroToTwo - 1.0;';
      vertexShaderSource += 'gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);'; // 传递纹理坐标到片断着色器

      vertexShaderSource += 'v_texcoord = a_texcoord;';
      vertexShaderSource += '}'; //片段着色器代码

      var fragmentShaderSource = 'precision mediump float;'; // 从顶点着色器中传入的值

      fragmentShaderSource += 'varying vec2 v_texcoord;'; // 纹理

      fragmentShaderSource += 'uniform sampler2D u_texture;';
      fragmentShaderSource += 'void main() {';
      fragmentShaderSource += 'gl_FragColor = texture2D(u_texture, v_texcoord);';
      fragmentShaderSource += '}';
      _webglContext = _canvas.getContext('webgl');

      _webglContext.enable(_webglContext.BLEND); //开启混合功能


      _webglContext.clearColor(0, 0, 0, 0); //设置清除颜色


      _webglContext.blendFunc(_webglContext.SRC_ALPHA, _webglContext.ONE_MINUS_SRC_ALPHA);

      var vertexShader = createShader(_webglContext, _webglContext.VERTEX_SHADER, vertexShaderSource); //创建顶点着色器

      var fragmentShader = createShader(_webglContext, _webglContext.FRAGMENT_SHADER, fragmentShaderSource); //创建片段着色器

      var program = createProgram(_webglContext, vertexShader, fragmentShader); //创建着色程序

      _webglContext.useProgram(program);

      _positionAttributeLocation = _webglContext.getAttribLocation(program, 'a_position');

      var texcoordAttributeLocation = _webglContext.getAttribLocation(program, 'a_texcoord');

      _resolutionUniformLocation = _webglContext.getUniformLocation(program, 'u_resolution');

      _webglContext.viewport(0, 0, _canvas.width, _canvas.height);

      _webglContext.uniform2f(_resolutionUniformLocation, _canvas.width, _canvas.height); // 设置全局变量 分辨率
      //绑定范围


      var texcoordBuffer = _webglContext.createBuffer(); // 将绑定点绑定到缓冲数据（texcoordBuffer）


      _webglContext.bindBuffer(_webglContext.ARRAY_BUFFER, texcoordBuffer);

      _webglContext.enableVertexAttribArray(texcoordAttributeLocation); // 以浮点型格式传递纹理坐标


      _webglContext.vertexAttribPointer(texcoordAttributeLocation, 2, //size 每次迭代运行提取两个单位数据
      _webglContext.FLOAT, //type 每个单位的数据类型是32位浮点型
      false, //normalize 不需要归一化数据 
      0, //stride 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
      // 每次迭代运行运动多少内存到下一个数据开始点
      0 //offset 从缓冲起始位置开始读取
      );

      _webglContext.bufferData(_webglContext.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), _webglContext.STATIC_DRAW);
    }
    /**
     * 支持检测
     * @function
     */


    function supportCheck() {
      var canvas = document.createElement('canvas'); //canvas对象

      if (typeof canvas.getContext != 'function') throw new _browserNotSupportError.BrowserNotSupportError('Canvas');
      var context = canvas.getContext('2d');
      if (context === null) throw new _browserNotSupportError.BrowserNotSupportError('Canvas 2D');
      if (typeof context.fillText != 'function') throw new _browserNotSupportError.BrowserNotSupportError('Canvas 2D fillText Function');
      canvas = document.createElement('canvas'); //canvas对象

      context = canvas.getContext('webgl');
      if (context === null) throw new _browserNotSupportError.BrowserNotSupportError('WebGL');
    }

    return _this;
  }

  return WebGLRenderer;
}(_canvasBaseRenderer.CanvasBaseRenderer);

exports.WebGLRenderer = WebGLRenderer;

},{"../../browserNotSupportError":2,"./canvasBaseRenderer":8}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openBSE = void 0;

/**
 * openBSE 根命名空间
 * @namespace
 */
var openBSE = {
  BulletScreenEngine: require('./bulletScreenEngine').BulletScreenEngine,
  BrowserNotSupportError: require('./browserNotSupportError').BrowserNotSupportError,
  BulletScreenType: require('./bulletScreenType').BulletScreenType
};
/**
 * 全局选项
 * @typedef {object} openBSE~Options
 * @description Option 结构用于存放全局选项。
 * @property {number} [verticalInterval=8] - 弹幕垂直行间距
 * @property {number} [verticalInterval=1] - 弹幕播放速度（倍数）
 * @property {openBSE~clockCallback} [clock=time => new Date().getTime() - startTime] - 时间基准：此时间基准可指向一个方法用于获取播放器当前进度，这个方法返回值即为播放进度（单位：毫秒）。
 * @property {number} [scaling=1] 弹幕缩放比例（倍数）
 * @property {openBSE~BulletScreenStyle} [defaultStyle] 默认弹幕样式：一个 {@link openBSE~BulletScreenStyle} 结构。
 * @property {openBSE.BulletScreenType} [hiddenTypes] 隐藏的弹幕类型：一个 {@link openBSE.BulletScreenType} 枚举，将要隐藏的弹幕类型相加。
 */

/**
 * 时间基准回调方法
 * @callback openBSE~clockCallback
 * @description ClockCallback 回调方法用于播放器当前进度。
 * @returns {number} 播放进度：单位：毫秒。
 */

/**
 * 单条弹幕数据
 * @typedef {object} openBSE~BulletScreen
 * @description BulletScreen 结构用于存放单条弹幕数据。
 * @property {string} text 弹幕文本
 * @property {boolean} [canDiscard=true] 是否允许丢弃：在弹幕过多时，程序将自动丢弃一些延迟过高的弹幕。此选项为 false 时本条弹幕无论如何都不会被丢弃，使用本选项的场景如本用户发送的弹幕。注意：不要将太多的弹幕的 canDiscard 设为 false， 否则会因超时的弹幕不会被丢弃而造成意外的问题。
 * @property {number} [startTime=options.clock()] 弹幕进入时间：单位：毫秒，默认为[时间基准（options.clock）]{@link openBSE~Options}当前时间。
 * @property {openBSE.BulletScreenType} [type=openBSE.BulletScreenType.rightToLeft] 弹幕类型：一个类型为 {@link openBSE.BulletScreenType} 的枚举。
 * @property {openBSE~BulletScreenStyle} style 弹幕样式：一个 {@link openBSE~BulletScreenStyle} 结构。设置此选项中的任何一个值，将覆盖对应的全局设置。
 */

/**
 * 弹幕样式
 * @typedef {object} openBSE~BulletScreenStyle
 * @description BulletScreenStyle 结构用于存放弹幕样式信息。
 * @property {number} [shadowBlur=2] 弹幕阴影的模糊级别：0为不显示阴影。
 * @property {string} [fontWeight="600"] 字体粗细：可选值：lighter：更细；normal：标准；bold：粗体；bolder: 更粗；100、200、300、400、500、600、700、800、900：定义由粗到细的字符（400 等同于 normal；700 等同于 bold）。
 * @property {string} [fontFamily="sans-serif"] 字体系列：弹幕的字体族名称或/及类族名称的一个优先表。
 * @property {number} [size=19] 字体大小：单位：像素。
 * @property {string} [boxColor] 外框颜色：参照CSS颜色设置方法，为 null 不显示外框。
 * @property {string} [color="white"] 弹幕颜色：参照CSS颜色设置方法，为 null 不显示此弹幕。
 * @property {string} [borderColor] 描边颜色：参照CSS颜色设置方法，为 null 没有描边。
 * @property {number} [speed=0.15] 弹幕速度：单位：像素/毫秒，仅弹幕类型为0、1时有效。
 * @property {number} [residenceTime=5000] 弹幕停留时间：单位：毫秒，仅弹幕类型2、3时有效。
 */

/**
 * 调试信息
 * @typedef {object} openBSE~DebugInfo
 * @description DebugInfo 结构用于存放调试信息。
 * @property {number} time [时间基准（options.clock）]{@link openBSE~Options}当前时间。
 * @property {number} bulletScreensOnScreenCount 实时弹幕总数
 * @property {number} bulletScreensCount 剩余弹幕总数
 * @property {number} delay 延迟：单位：毫秒。
 * @property {number} delayBulletScreensCount 丢弃弹幕数：因延迟过高而丢弃的弹幕总数。
 * @property {number} fps 帧频：单位：帧/秒。
 */

/**
 * 版本信息
 * @typedef {object} openBSE~VersionInfo
 * @description VersionInfo 结构用于存放版本信息。
 * @property {string} version 版本号
 * @property {string} buildDate 构建日期：时区：UTC。
 */

exports.openBSE = openBSE;

},{"./browserNotSupportError":2,"./bulletScreenEngine":3,"./bulletScreenType":4}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BUILE_DATE = exports.VERSION = void 0;
var VERSION = '2.0-Alpha';
exports.VERSION = VERSION;
var BUILE_DATE = 'Fri, 11 Jan 2019 10:38:27 GMT';
exports.BUILE_DATE = BUILE_DATE;

},{}]},{},[1,14]);
