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

Home: https://iamscottxu.github.io/BulletScreenEngine/
*/
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BulletScreenEngine = void 0;

var _linkedList = require("./linkedList");

var _event = require("./event");

var _version = require("./version");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 渲染模式
 * @private @constant
 */
var RENDER_MODE = {
  /**
   * CSS3 渲染模式
   * @private @readonly
   */
  css3: 'css3',

  /**
   * WebGL 渲染模式
   * @private @readonly
   */
  webgl: 'webgl',

  /**
   * Canvas 2D 渲染模式
   * @private @readonly
   */
  canvas: 'canvas'
  /** 弹幕引擎对象类 */

};

var BulletScreenEngine =
/**
 * 创建一个弹幕引擎对象。
 * @param {Element} element - 要加载弹幕的元素：有关 Element 接口的信息请参阅MDN [Element]{@link https://developer.mozilla.org/zh-CN/docs/Web/API/Element} 。
 * @param {BulletScreenEngine~Options} [options] - 全局选项：一个 {@link BulletScreenEngine~Options} 结构。
 * @param {String} [renderMode="canvas"] - 渲染模式：默认为“canvas”, “可选css3”， “webgl”。
 */
function BulletScreenEngine(element, options) {
  var renderMode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : RENDER_MODE.canvas;

  _classCallCheck(this, BulletScreenEngine);

  //变量初始化

  /**
   * 开始时间
   * @private @type {Integer}
   */
  var startTime;
  /**
   * 暂停时间
   * @private @type {Integer}
   */

  var pauseTime = 0;
  /**
   * 剩余弹幕，屏幕上的弹幕
   * @private @type {Integer}
   */

  var bulletScreens = new _linkedList.LinkedList(),
      bulletScreensOnScreen = new _linkedList.LinkedList();
  /**
   * 延迟弹幕总数
   * @private @type {Integer}
   */

  var delayBulletScreensCount = 0;
  /**
   * 延迟（单位：毫秒）
   * @private @type {Integer}
   */

  var delay = 0;
  /**
   * 播放标志
   * @private @type {Boolean}
   */

  var playing;
  /**
   * 刷新频率
   * @private @type {Float}
   */

  var refreshRate = 0.06; //初始刷新频率

  /**
   * 上一次刷新时间
   * @private @type {Integer}
   */

  var lastRefreshTime;
  /**
   * 隐藏弹幕
   * @private @type {Boolean}
   */

  var hide = false;
  /**
   * 透明度
   * @private @type {Float}
   */

  var opacity = 0.0; //默认参数

  /**
   * 全局选项
   * @typedef {Object} BulletScreenEngine~Options
   * @description Option 结构用于存放全局选项。
   * @property {Integer} [verticalInterval=8] - 弹幕垂直行间距
   * @property {Float} [verticalInterval=1] - 弹幕播放速度（倍数）
   * @property {BulletScreenEngine~clockCallback} [clock=time => new Date().getTime() - startTime] - 时间基准：此时间基准可指向一个方法用于获取播放器当前进度，这个方法返回值即为播放进度（单位：毫秒）。
   * @property {Float} [scaling=1] 弹幕缩放比例（倍数）
   * @property {BulletScreenEngine~BulletScreenStyle} [defaultStyle] 默认弹幕样式：一个 {@link BulletScreenEngine~BulletScreenStyle} 结构。
   */

  /**
   * 时间基准回调方法
   * @callback BulletScreenEngine~clockCallback
   * @description ClockCallback 回调方法用于播放器当前进度。
   * @returns {Integer} 播放进度：单位：毫秒。
   */

  options = setValue(options, {});
  options.verticalInterval = setValue(options.verticalInterval, 8); //垂直间距

  options.playSpeed = setValue(options.playSpeed, 1); //播放速度倍数

  options.clock = setValue(options.clock, function (time) {
    return new Date().getTime() - startTime;
  }); //时间基准

  options.scaling = setValue(options.scaling, 1); //缩放比例

  options.timeOutDiscard = setValue(options.timeOutDiscard, true); //超时丢弃

  /**
   * 弹幕样式
   * @typedef {Object} BulletScreenEngine~BulletScreenStyle
   * @description BulletScreenStyle 结构用于存放弹幕样式信息。
   * @property {Integer} [shadowBlur=2] 弹幕阴影的模糊级别：0为不显示阴影。
   * @property {String} [fontWeight="600"] 字体粗细：可选值：lighter：更细；normal：标准；bold：粗体；bolder: 更粗；100、200、300、400、500、600、700、800、900：定义由粗到细的字符（400 等同于 normal；700 等同于 bold）。
   * @property {String} [fontFamily="sans-serif"] 字体系列：弹幕的字体族名称或/及类族名称的一个优先表。
   * @property {Integer} [size=19] 字体大小：单位：像素。
   * @property {String} [boxColor] 外框颜色：参照CSS颜色设置方法，为 null 不显示外框。
   * @property {String} [color="white"] 弹幕颜色：参照CSS颜色设置方法，为 null 不显示此弹幕。
   * @property {String} [borderColor] 描边颜色：参照CSS颜色设置方法，为 null 没有描边。
   * @property {Float} [speed=0.15] 弹幕速度：单位：像素/毫秒，仅弹幕类型为0、1时有效。
   * @property {Integer} [residenceTime=5000] 弹幕停留时间：单位：毫秒，仅弹幕类型2、3时有效。
   */

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

  /**
   * 全局选项：一个 {@link BulletScreenEngine~Options} 结构。
   * @readonly
   * @type {BulletScreenEngine~Options}
   */

  this.options = options; //事件初始化

  var event = new _event.Event();
  /**
   * 弹幕单击事件。当单击弹幕时触发。
   * @event BulletScreenEngine#click
   * @property {BulletScreenEngine~BulletScreen} e.bulletScreen - 被单击的弹幕的数据：一个 {@link BulletScreenEngine~BulletScreen} 结构。
   */

  event.add('click');
  /**
   * 弹幕上下文菜单事件。当触发弹幕上下文菜单时触发。
   * @event BulletScreenEngine#contextmenu
   * @property {BulletScreenEngine~BulletScreen} e.bulletScreen - 被单击的弹幕的数据：一个 {@link BulletScreenEngine~BulletScreen} 结构。
   */

  event.add('contextmenu');
  /**
   * 绑定事件处理程序
   * @function
   * @description 绑定事件处理程序。当事件处理程序返回值为 false 时停止冒泡。
   * @param {String} name 事件名称
   * @param {Function} fun 事件处理程序
   * @listens BulletScreenEngine#click
   * @listens BulletScreenEngine#contextmenu
   * @returns false: 失败 数字: 添加后的事件数
   */

  this.bind = event.bind;
  /**
   * 解绑事件处理程序（fun为空解绑所有事件处理程序）
   * @function
   * @param {String} name 事件名称
   * @param {Function} fun 事件处理程序
   * @returns true: 成功 false: 失败 数字: 删除后的事件数
   */

  this.unbind = event.unbind; //初始化

  var canvas;
  var div;
  var webgl;
  var elementWidth = element.clientWidth / options.scaling;
  var elementHeight = element.clientHeight / options.scaling;
  var devicePixelRatio = typeof window.devicePixelRatio === 'undefined' ? 1 : window.devicePixelRatio;
  devicePixelRatio *= options.scaling;
  if (renderMode === RENDER_MODE.css3) div = initDIV(element); //添加DIV
  else if (renderMode === RENDER_MODE.canvas) canvas = initCanvas(element); //添加Canvas
    else if (renderMode === RENDER_MODE.webgl) webgl = initWebGLCanvas(element); //添加WebGL Canvas

  setInterval(setSize, 100);
  console.info('%cBulletScreenEngine%c now loaded.\n' + '\n' + '%cVersion: %s\n' + 'Build Date: %s\n' + '\n' + '%cBulletScreenEngine is a high-performance JavaScript bullet-screen (danmaku) engine.\n' + 'Home: https://iamscottxu.github.io/BulletScreenEngine/', 'font-weight:bold; color:#0099FF;', '', 'font-style:italic;', _version.VERSION, _version.BUILE_DATE, ''); //公共函数

  /**
   * 添加弹幕到弹幕列表。
   * @function
   * @param {BulletScreenEngine~BulletScreen} bulletScreen - 单条弹幕数据：一个 {@link BulletScreenEngine~BulletScreen} 结构。
   * @description 添加弹幕到弹幕列表。由于弹幕在屏幕上出现过后，弹幕引擎将从列表中彻底删除此弹幕。所以，在改变播放进度时，可能需要先[清空弹幕列表]{@link BulletScreenEngine#cleanBulletScreenList}，然后重新加载此播放进度以后的弹幕。
   */

  this.addBulletScreen = function (bulletScreen) {
    /**
     * 单条弹幕数据
     * @typedef {Object} BulletScreenEngine~BulletScreen
     * @description BulletScreen 结构用于存放单条弹幕数据。
     * @property {String} text 弹幕文本
     * @property {Boolean} [canDiscard=true] 是否允许丢弃：在弹幕过多时，程序将自动丢弃一些延迟过高的弹幕。此选项为 false 时本条弹幕无论如何都不会被丢弃，使用本选项的场景如本用户发送的弹幕。注意：不要将太多的弹幕的 canDiscard 设为 false， 否则会因超时的弹幕不会被丢弃而造成意外的问题。
     * @property {Integer} [startTime=options.clock()] 弹幕进入时间：单位：毫秒，默认为[时间基准（options.clock）]{@link BulletScreenEngine~Options}当前时间。
     * @property {Integer} [type=0] 弹幕类型：0：从右到左（普通）；1：从左到右（逆向）；2：顶部固定；3：底部固定。
     * @property {BulletScreenEngine~BulletScreenStyle} style 弹幕样式：一个 {@link BulletScreenEngine~BulletScreenStyle} 结构。设置此选项中的任何一个值，将覆盖对应的全局设置。
     */
    bulletScreen = setValue(bulletScreen, {});
    bulletScreen.text = setValue(bulletScreen.text, 'Empty'); //弹幕文本

    bulletScreen.canDiscard = setValue(bulletScreen.canDiscard, true); //是否允许丢弃

    bulletScreen.startTime = setValue(bulletScreen.startTime, options.clock()); //弹幕进入时间

    bulletScreen.type = setValue(bulletScreen.type, 0); //类型：0：从右到左 1:从左到右 2:顶部固定 3:底部固定

    if (bulletScreen.type <= 3) {
      var oldLength = bulletScreens.getLength();
      bulletScreens.forEach(function (lastBulletScreen) {
        if (bulletScreen.startTime > lastBulletScreen.startTime) return {
          add: {
            addToUp: true,
            element: bulletScreen
          },
          stop: true
        };
      }, true);
      if (oldLength === bulletScreens.getLength()) bulletScreens.push(bulletScreen, false);
    }
  };
  /**
   * 开始播放弹幕。
   * @function
   */


  this.play = function () {
    if (!playing) {
      if (!startTime) startTime = new Date().getTime();
      if (pauseTime) startTime += options.clock() - pauseTime;
      lastRefreshTime = null;
      playing = true;
      requestAnimationFrame(refresh);
    }
  };
  /**
   * 暂停播放弹幕。
   * @function
   * @description 暂停播放弹幕。暂停播放弹幕是指弹幕播放暂停，所有未出现的弹幕将停止出现，已出现的弹幕停止运动，停止消失。
   */


  this.pause = function () {
    if (playing) {
      pauseTime = options.clock();
      playing = false;
    }
  };
  /**
   * 清空弹幕列表。
   * @function
   * @description 清空弹幕列表，但屏幕上已经出现的弹幕不会被清除。
   */


  this.cleanBulletScreenList = function () {
    bulletScreens.clean();
  };
  /**
   * 清空屏幕弹幕。
   * @function
   * @description 清空屏幕弹幕。清空屏幕上已经出现的弹幕，不包括弹幕列表中的弹幕。
   */


  this.cleanBulletScreenListOnScreen = function () {
    bulletScreensOnScreen.clean();
    if (renderMode === RENDER_MODE.css3) div.innerHTML = '';else if (renderMode === RENDER_MODE.canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);else if (renderMode === RENDER_MODE.webgl) webgl.webglContext.clear(webglContext.COLOR_BUFFER_BIT);
  };
  /**
   * 停止播放弹幕。
   * @function
   * @description 停止播放弹幕。停止播放弹幕是指停止播放弹幕，默认[时间基准（options.clock）]{@link BulletScreenEngine~BulletScreenStyle}归零，并[清空弹幕列表]{@link BulletScreenEngine#cleanBulletScreenList}、[清空屏幕弹幕]{@link BulletScreenEngine#cleanBulletScreenListOnScreen}。
   */


  this.stop = function () {
    if (playing) {
      this.pause();
    }

    this.cleanBulletScreenList();
    this.cleanBulletScreenListOnScreen();
    pauseTime = 0;
    startTime = null;
  };
  /**
   * 隐藏弹幕。
   * @function
   */


  this.hide = function () {
    hide = true;
    if (renderMode === RENDER_MODE.css3) div.style.visibility = 'hidden';else if (renderMode === RENDER_MODE.canvas) canvas.style.visibility = 'hidden';else if (renderMode === RENDER_MODE.webgl) webgl.canvas.style.visibility = 'hidden';
  };
  /**
   * 显示弹幕。
   * @function
   */


  this.show = function () {
    hide = false;
    if (renderMode === RENDER_MODE.css3) div.style.visibility = 'visible';else if (renderMode === RENDER_MODE.canvas) canvas.style.visibility = 'visible';else if (renderMode === RENDER_MODE.webgl) webgl.canvas.style.visibility = 'visible';
  };
  /**
   * 设置弹幕不透明度。
   * @function
   * @param {Float} _opacity 弹幕不透明度：取值范围 0.0 到 1.0，0.0 全透明；1.0 不透明。
   */


  this.setOpacity = function (_opacity) {
    opacity = _opacity;
    if (renderMode === RENDER_MODE.css3) div.style.opacity = _opacity;else if (renderMode === RENDER_MODE.canvas) canvas.style.opacity = _opacity;else if (renderMode === RENDER_MODE.webgl) webgl.canvas.style.opacity = _opacity;
  };
  /**
   * 获取弹幕不透明度。
   * @function
   * @returns {Float} 弹幕不透明度：取值范围 0.0 到 1.0，0.0 全透明；1.0 不透明。
   */


  this.getOpacity = function () {
    return opacity;
  };
  /**
   * 获取弹幕可见性。
   * @function
   * @returns {Boolean}  指示弹幕是否可见。
   * @description 获取弹幕可见性。如要显示弹幕请调用 [bulletScreenEngine.show();]{@link BulletScreenEngine#show} ，要隐藏弹幕请调用 [bulletScreenEngine.hide();]{{@link BulletScreenEngine#hide}} 。
   */


  this.getVisibility = function () {
    return !hide;
  };
  /**
   * 获取渲染模式。
   * @function
   * @returns {String} 弹幕渲染模式： 取值为“canvas”、“css3”或“webgl”。
   */


  this.getRenderMode = function () {
    return renderMode;
  };
  /**
   * 获取播放状态。
   * @function
   * @returns {Boolean} 正在播放标志：true：正在播放；false：已暂停/停止播放。
   */


  this.getPlayState = function () {
    return playing;
  };
  /**
  * 获取调试信息。
  * @function
  * @returns {BulletScreenEngine~DebugInfo} 调试信息：一个 {@link BulletScreenEngine~DebugInfo} 结构。
  */


  this.getDebugInfo = function () {
    /**
     * 调试信息
     * @typedef {Object} BulletScreenEngine~DebugInfo
     * @description DebugInfo 结构用于存放调试信息。
     * @property {Integer} time [时间基准（options.clock）]{@link BulletScreenEngine~Options}当前时间。
     * @property {Integer} bulletScreensOnScreenCount 实时弹幕总数
     * @property {Integer} bulletScreensCount 剩余弹幕总数
     * @property {Integer} delay 延迟：单位：毫秒。
     * @property {Integer} delayBulletScreensCount 丢弃弹幕数：因延迟过高而丢弃的弹幕总数。
     * @property {Integer} fps 帧频：单位：帧/秒。
     */
    return {
      time: playing ? options.clock() : pauseTime,
      bulletScreensOnScreenCount: bulletScreensOnScreen.getLength(),
      bulletScreensCount: bulletScreens.getLength(),
      delay: delay,
      delayBulletScreensCount: delayBulletScreensCount,
      fps: playing ? Math.floor(refreshRate * 1000) : 0 //帧频

    };
  };
  /**
   * 获取版本信息。
   * @function
   * @returns {BulletScreenEngine~VersionInfo} 版本信息：一个 {@link BulletScreenEngine~VersionInfo} 结构。
   */


  this.getVersion = function () {
    /**
     * 版本信息
     * @typedef {Object} BulletScreenEngine~VersionInfo
     * @description VersionInfo 结构用于存放版本信息。
     * @property {String} version 版本号
     * @property {String} buildDate 构建日期：时区：UTC。
     */
    return {
      version: _version.VERSION,
      buildDate: _version.BUILE_DATE
    };
  }; //内部函数

  /**
   * 设置值
   * @function
   * @private
   * @property {String} value 值
   * @property {String} defaultBalue 默认值
   * @returns {Object} 值
   */


  function setValue(value, defaultBalue) {
    if (typeof value === 'undefined') return defaultBalue;
    if (typeof value === 'number' && isNaN(value)) return defaultBalue;
    if (value === null) return defaultBalue;
    return value;
  }
  /**
   * 刷新弹幕函数
   * @function
   * @private
   */


  function refresh() {
    var nowTime = new Date().getTime();
    if (lastRefreshTime != null) refreshRate = 1 / (nowTime - lastRefreshTime);
    lastRefreshTime = nowTime;
    addBulletScreensToScreen();
    moveBulletScreenOnScreen();
    if (renderMode === RENDER_MODE.css3) drawOnTheDIV();else if (renderMode === RENDER_MODE.canvas) drawOnTheCanvas();else if (renderMode === RENDER_MODE.webgl) drawOnTheWebGLCanvas();
    if (playing) requestAnimationFrame(refresh);
  }
  /**
   * 绘制函数CSS3
   * @function
   * @private
   */


  function drawOnTheDIV() {
    bulletScreensOnScreen.forEach(function (bulletScreenOnScreen) {
      bulletScreenOnScreen.element.style.transform = bulletScreenOnScreen.element.style.webkitTransform = bulletScreenOnScreen.element.style.msTransform = "translate(".concat(bulletScreenOnScreen.x - 4, "px,").concat(bulletScreenOnScreen.actualY - 4, "px)");
    }, true);
  }
  /**
   * 绘制函数Canvas
   * @function
   * @private
   */


  function drawOnTheCanvas() {
    //离屏渲染
    var hideCanvas = document.createElement('canvas');
    hideCanvas.width = canvas.width;
    hideCanvas.height = canvas.height;
    var hideCanvasContext = hideCanvas.getContext('2d');
    bulletScreensOnScreen.forEach(function (bulletScreenOnScreen) {
      hideCanvasContext.drawImage(bulletScreenOnScreen.hideCanvas, (bulletScreenOnScreen.x - 4) * devicePixelRatio, (bulletScreenOnScreen.actualY - 4) * devicePixelRatio, (bulletScreenOnScreen.width + 8) * devicePixelRatio, (bulletScreenOnScreen.height + 8) * devicePixelRatio);
    }, true);
    var canvasContext = canvas.getContext('2d');
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.drawImage(hideCanvas, 0, 0);
  }
  /**
   * 绘制函数WebGL Canvas
   * @function
   * @private
   */


  function drawOnTheWebGLCanvas() {
    var webglContext = webgl.webglContext; // 清空画布

    webglContext.clear(webglContext.COLOR_BUFFER_BIT);
    bulletScreensOnScreen.forEach(function (bulletScreenOnScreen) {
      // 四个顶点坐标
      var x1 = (bulletScreenOnScreen.x - 4) * devicePixelRatio;
      var x2 = x1 + (bulletScreenOnScreen.width + 8) * devicePixelRatio;
      var y1 = (bulletScreenOnScreen.actualY - 4) * devicePixelRatio;
      var y2 = y1 + (bulletScreenOnScreen.height + 8) * devicePixelRatio; //绑定纹理

      webglContext.bindTexture(webglContext.TEXTURE_2D, bulletScreenOnScreen.texture2D); //绑定范围

      var positionBuffer = webglContext.createBuffer(); // 将绑定点绑定到缓冲数据（positionBuffer）

      webglContext.bindBuffer(webglContext.ARRAY_BUFFER, positionBuffer);
      webglContext.enableVertexAttribArray(webgl.positionAttributeLocation); // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)

      webglContext.vertexAttribPointer(webgl.positionAttributeLocation, 2, //size 每次迭代运行提取两个单位数据
      webglContext.FLOAT, //type 每个单位的数据类型是32位浮点型
      false, //normalize 不需要归一化数据
      0, //stride 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
      // 每次迭代运行运动多少内存到下一个数据开始点
      0 //offset 从缓冲起始位置开始读取
      );
      webglContext.bufferData(webglContext.ARRAY_BUFFER, new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]), webglContext.STATIC_DRAW); //绘制

      webglContext.drawArrays(webglContext.TRIANGLES, //primitiveType
      0, //offset
      6 //count
      );
    }, true);
  }
  /**
   * 移动弹幕函数
   * @function
   * @private
   */


  function moveBulletScreenOnScreen() {
    bulletScreensOnScreen.forEach(function (bulletScreenOnScreen) {
      var nowTime = options.clock();

      switch (bulletScreenOnScreen.bulletScreen.type) {
        case 0:
          if (bulletScreenOnScreen.x > -bulletScreenOnScreen.width) {
            bulletScreenOnScreen.x -= bulletScreenOnScreen.bulletScreen.style.speed * options.playSpeed / refreshRate;
          } else {
            if (renderMode === RENDER_MODE.css3) div.removeChild(bulletScreenOnScreen.element);
            return {
              remove: true
            };
          }

          break;

        case 1:
          if (bulletScreenOnScreen.x < elementWidth) {
            bulletScreenOnScreen.x += bulletScreenOnScreen.bulletScreen.style.speed * options.playSpeed / refreshRate;
          } else {
            if (renderMode === RENDER_MODE.css3) div.removeChild(bulletScreenOnScreen.element);
            return {
              remove: true
            };
          }

          break;

        case 2:
        case 3:
          if (bulletScreenOnScreen.endTime < nowTime) {
            if (renderMode === RENDER_MODE.css3) div.removeChild(bulletScreenOnScreen.element);
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
   * @function
   * @private
   */


  function addBulletScreensToScreen() {
    if (bulletScreensOnScreen.getLength() === 0) delay = 0;
    var times = Math.floor(refreshRate * 2000);

    do {
      var bulletScreen = bulletScreens.pop(false, false);
      if (bulletScreen === null) return;
      var nowTime = options.clock();
      if (bulletScreen.startTime > nowTime) return;

      if (!options.timeOutDiscard || !bulletScreen.canDiscard || bulletScreen.startTime > nowTime - Math.floor(1 / refreshRate) * 60) {
        setDefaultStyle(bulletScreen); //填充默认样式

        getBulletScreenOnScreen(nowTime, bulletScreen); //生成屏幕弹幕对象并添加到屏幕弹幕集合
      } else delayBulletScreensCount++;

      bulletScreens.pop(true, false);
      times--;
    } while (bulletScreensOnScreen.getLength() === 0 || times > 0);
  }
  /**
   * CSS3:创建弹幕元素
   * @function
   * @private
   * @property {Object} bulletScreenOnScreen 屏幕弹幕对象
   * @returns {Object} 元素
   */


  function creatBulletScreenDiv(bulletScreenOnScreen) {
    var bulletScreen = bulletScreenOnScreen.bulletScreen;
    var element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.whiteSpace = 'nowrap';
    element.style.fontWeight = bulletScreen.style.fontWeight;
    element.style.fontSize = "".concat(bulletScreenOnScreen.size, "px");
    element.style.fontFamily = bulletScreen.style.fontFamily;
    element.style.lineHeight = "".concat(bulletScreenOnScreen.size, "px");
    element.style.textShadow = "0 0 ".concat(bulletScreen.style.shadowBlur, "px black");
    element.style.color = bulletScreen.style.color;

    if (bulletScreen.style.borderColor != null) {
      element.style.textStroke = element.style.webkitTextStroke = '0.5px';
      element.style.textStrokeColor = element.style.webkitTextStrokeColor = bulletScreen.borderColor;
    }

    if (bulletScreen.style.boxColor != null) {
      element.style.padding = '3px';
      element.style.border = '1px solid';
      element.style.borderColor = bulletScreen.style.boxColor;
    } else {
      element.style.padding = '4px';
    }

    element.innerText = bulletScreen.text;
    element.bulletScreen = bulletScreen;
    div.appendChild(element);
    return element;
  }
  /**
   * Canvas:创建弹幕画布
   * @function
   * @private
   * @property {Object} bulletScreenOnScreen 屏幕弹幕对象
   * @returns {Object} 元素
   */


  function creatBulletScreenHideCanvas(bulletScreenOnScreen) {
    var bulletScreen = bulletScreenOnScreen.bulletScreen;
    var hideCanvas = document.createElement('canvas');
    hideCanvas.width = (bulletScreenOnScreen.width + 8) * devicePixelRatio;
    hideCanvas.height = (bulletScreenOnScreen.height + 8) * devicePixelRatio;
    var hideCanvasContext = hideCanvas.getContext('2d');
    hideCanvasContext.textBaseline = 'top';
    hideCanvasContext.shadowColor = 'black';
    hideCanvasContext.font = "".concat(bulletScreen.style.fontWeight, " ").concat(bulletScreenOnScreen.size * devicePixelRatio, "px ").concat(bulletScreen.style.fontFamily);

    if (bulletScreen.style.color != null) {
      hideCanvasContext.shadowBlur = (bulletScreen.style.shadowBlur + 0.5) * devicePixelRatio;
      hideCanvasContext.fillStyle = bulletScreen.style.color;
      hideCanvasContext.fillText(bulletScreen.text, 4 * devicePixelRatio, 4 * devicePixelRatio);
    }

    if (bulletScreen.style.borderColor != null) {
      hideCanvasContext.shadowBlur = 0;
      hideCanvasContext.lineWidth = 0.5 * devicePixelRatio;
      hideCanvasContext.strokeStyle = bulletScreen.style.borderColor;
      hideCanvasContext.strokeText(bulletScreen.text, 4 * devicePixelRatio, 4 * devicePixelRatio);
    }

    if (bulletScreen.style.boxColor != null) {
      hideCanvasContext.shadowBlur = 0;
      hideCanvasContext.lineWidth = devicePixelRatio;
      hideCanvasContext.strokeStyle = bulletScreen.style.boxColor;
      hideCanvasContext.strokeRect(devicePixelRatio, devicePixelRatio, hideCanvas.width - devicePixelRatio, hideCanvas.height - devicePixelRatio);
    }

    return hideCanvas;
  }
  /**
   * WebGL：创建弹幕纹理
   * @function
   * @private
   * @property {Object} bulletScreenOnScreen 屏幕弹幕对象
   * @returns {Object} 纹理
   */


  function creatBulletScreenHideTexture2D(bulletScreenOnScreen) {
    var _canvas = creatBulletScreenHideCanvas(bulletScreenOnScreen);

    var webglContext = webgl.webglContext;
    var texture = webglContext.createTexture();
    webglContext.bindTexture(webglContext.TEXTURE_2D, texture); // 设置参数

    webglContext.texParameteri(webglContext.TEXTURE_2D, webglContext.TEXTURE_MIN_FILTER, webglContext.NEAREST);
    webglContext.texParameteri(webglContext.TEXTURE_2D, webglContext.TEXTURE_MAG_FILTER, webglContext.NEAREST);
    webglContext.texParameteri(webglContext.TEXTURE_2D, webglContext.TEXTURE_WRAP_S, webglContext.CLAMP_TO_EDGE);
    webglContext.texParameteri(webglContext.TEXTURE_2D, webglContext.TEXTURE_WRAP_T, webglContext.CLAMP_TO_EDGE);
    webglContext.texImage2D(webglContext.TEXTURE_2D, 0, webglContext.RGBA, webglContext.RGBA, webglContext.UNSIGNED_BYTE, _canvas);
    return texture;
  }
  /**
   * 填充默认样式
   * @function
   * @private
   * @property {BulletScreenEngine~BulletScreen} bulletScreen 弹幕
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
   * @function
   * @private
   * @property {Number} nowTime 当前时间
   * @property {BulletScreenEngine~BulletScreen} bulletScreen 弹幕
   */


  function getBulletScreenOnScreen(nowTime, bulletScreen) {
    delay = nowTime - bulletScreen.startTime;
    var bulletScreenOnScreen = {};
    bulletScreenOnScreen.bulletScreen = bulletScreen;
    bulletScreenOnScreen.startTime = nowTime; //弹幕头部进屏幕时间

    bulletScreenOnScreen.size = bulletScreenOnScreen.bulletScreen.style.size;
    bulletScreenOnScreen.height = bulletScreenOnScreen.size; //弹幕的高度：像素

    if (renderMode === RENDER_MODE.css3) {
      bulletScreenOnScreen.element = creatBulletScreenDiv(bulletScreenOnScreen); //创建Div

      bulletScreenOnScreen.width = bulletScreenOnScreen.element.clientWidth - 8; //弹幕的宽度：像素
    } else if (renderMode === RENDER_MODE.canvas || renderMode === RENDER_MODE.webgl) {
      //计算宽度
      var hideCanvas = document.createElement('canvas');
      var hideCanvasContext = hideCanvas.getContext('2d');
      hideCanvasContext.font = "".concat(bulletScreen.style.fontWeight, " ").concat(bulletScreenOnScreen.size, "px ").concat(bulletScreen.style.fontFamily);
      bulletScreenOnScreen.width = hideCanvasContext.measureText(bulletScreen.text).width; //弹幕的宽度：像素

      if (renderMode === RENDER_MODE.canvas) bulletScreenOnScreen.hideCanvas = creatBulletScreenHideCanvas(bulletScreenOnScreen); //创建Canvas
      else bulletScreenOnScreen.texture2D = creatBulletScreenHideTexture2D(bulletScreenOnScreen); //创建Texture2D
    }

    switch (bulletScreen.type) {
      case 0:
        bulletScreenOnScreen.endTime = parseInt(nowTime + (elementWidth + bulletScreenOnScreen.width) / (bulletScreen.style.speed * options.playSpeed)); //弹幕尾部出屏幕的时间

        bulletScreenOnScreen.x = elementWidth; //弹幕初始X坐标

        bulletScreenOnScreen.y = options.verticalInterval; //弹幕初始Y坐标

        break;

      case 1:
        bulletScreenOnScreen.endTime = parseInt(nowTime + (elementWidth + bulletScreenOnScreen.width) / (bulletScreen.style.speed * options.playSpeed)); //弹幕尾部出屏幕的时间

        bulletScreenOnScreen.x = -bulletScreenOnScreen.width; //弹幕初始X坐标

        bulletScreenOnScreen.y = options.verticalInterval; //弹幕初始Y坐标

        break;

      case 2:
        bulletScreenOnScreen.endTime = bulletScreenOnScreen.startTime + bulletScreen.style.residenceTime * options.playSpeed;
        bulletScreenOnScreen.x = parseInt((elementWidth - bulletScreenOnScreen.width) / 2); //弹幕初始X坐标

        bulletScreenOnScreen.y = options.verticalInterval; //弹幕初始Y坐标

        break;

      case 3:
        bulletScreenOnScreen.endTime = bulletScreenOnScreen.startTime + bulletScreen.style.residenceTime * options.playSpeed;
        bulletScreenOnScreen.x = parseInt((elementWidth - bulletScreenOnScreen.width) / 2); //弹幕初始X坐标

        bulletScreenOnScreen.y = -options.verticalInterval - bulletScreenOnScreen.height; //弹幕初始Y坐标

        break;
    }

    var oldLength = bulletScreensOnScreen.getLength();

    if (bulletScreen.type > 1) {
      bulletScreensOnScreen.forEach(function (nextBulletScreenOnScreen) {
        //弹幕不在流中，是固定弹幕
        if (nextBulletScreenOnScreen.bulletScreen.type != bulletScreen.type) return; //不是同一种类型的弹幕

        if (bulletScreen.type === 2) {
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
      bulletScreensOnScreen.forEach(function (nextBulletScreenOnScreen) {
        //弹幕在流中，是移动弹幕
        if (nextBulletScreenOnScreen.bulletScreen.type > 1) return; //弹幕不在流中，为固定弹幕
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

    if (bulletScreensOnScreen.getLength() === oldLength) bulletScreensOnScreen.push(setActualY(bulletScreenOnScreen), false);
  }
  /**
   * 设置真实的Y坐标
   * @function
   * @private
   * @property {Object} bulletScreenOnScreen 屏幕弹幕事件
   * @returns {Object} 屏幕弹幕事件
   */


  function setActualY(bulletScreenOnScreen) {
    var bulletScreen = bulletScreenOnScreen.bulletScreen;

    if (bulletScreen.type < 3) {
      bulletScreenOnScreen.actualY = bulletScreenOnScreen.y % (elementHeight - bulletScreenOnScreen.height);
    } else if (bulletScreen.type === 3) {
      bulletScreenOnScreen.actualY = elementHeight + bulletScreenOnScreen.y % elementHeight;
    }

    return bulletScreenOnScreen;
  }
  /**
   * 添加Canvas
   * @function
   * @private
   * @property {Object} element 元素
   * @returns {Object} 画布对象
   */


  function initCanvas(element) {
    var canvas = document.createElement('canvas'); //canvas对象

    canvas.style.width = "".concat(elementWidth, "px");
    canvas.style.height = "".concat(elementHeight, "px");
    canvas.style.transform = canvas.style.webkitTransform = canvas.style.msTransform = "scale(".concat(options.scaling, ",").concat(options.scaling, ")");
    canvas.style.transformOrigin = canvas.style.webkitTransformOrigin = canvas.style.msTransformOrigin = "left top";
    canvas.style.position = 'relative';
    canvas.width = elementWidth * devicePixelRatio;
    canvas.height = elementHeight * devicePixelRatio;
    registerEvent(canvas, false); //注册事件响应程序

    element.innerHTML = '';
    element.appendChild(canvas);
    return canvas;
  }
  /**
   * 添加WebGL Canvas
   * @function
   * @private
   * @property {Object} element 元素
   * @returns {Object} webgl信息对象
   */


  function initWebGLCanvas(element) {
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
    var canvas = initCanvas(element);
    var webglContext = canvas.getContext('webgl');
    webglContext.enable(webglContext.BLEND); //开启混合功能

    webglContext.clearColor(0, 0, 0, 0); //设置清除颜色

    webglContext.blendFunc(webglContext.SRC_ALPHA, webglContext.ONE_MINUS_SRC_ALPHA);
    var vertexShader = createShader(webglContext, webglContext.VERTEX_SHADER, vertexShaderSource); //创建顶点着色器

    var fragmentShader = createShader(webglContext, webglContext.FRAGMENT_SHADER, fragmentShaderSource); //创建片段着色器

    var program = createProgram(webglContext, vertexShader, fragmentShader); //创建着色程序

    webglContext.useProgram(program);
    var positionAttributeLocation = webglContext.getAttribLocation(program, 'a_position');
    var texcoordAttributeLocation = webglContext.getAttribLocation(program, 'a_texcoord');
    var resolutionUniformLocation = webglContext.getUniformLocation(program, 'u_resolution');
    webglContext.viewport(0, 0, canvas.width, canvas.height);
    webglContext.uniform2f(resolutionUniformLocation, canvas.width, canvas.height); // 设置全局变量 分辨率
    //绑定范围

    var texcoordBuffer = webglContext.createBuffer(); // 将绑定点绑定到缓冲数据（texcoordBuffer）

    webglContext.bindBuffer(webglContext.ARRAY_BUFFER, texcoordBuffer);
    webglContext.enableVertexAttribArray(texcoordAttributeLocation); // 以浮点型格式传递纹理坐标

    webglContext.vertexAttribPointer(texcoordAttributeLocation, 2, //size 每次迭代运行提取两个单位数据
    webglContext.FLOAT, //type 每个单位的数据类型是32位浮点型
    false, //normalize 不需要归一化数据 
    0, //stride 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
    // 每次迭代运行运动多少内存到下一个数据开始点
    0 //offset 从缓冲起始位置开始读取
    );
    webglContext.bufferData(webglContext.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), webglContext.STATIC_DRAW);
    return {
      canvas: canvas,
      positionAttributeLocation: positionAttributeLocation,
      resolutionUniformLocation: resolutionUniformLocation,
      webglContext: webglContext
    };
  }
  /**
   * 添加DIV
   * @function
   * @private
   * @property {Object} element 元素
   * @returns {Object} DIV对象
   */


  function initDIV(element) {
    var div = document.createElement('div'); //DIV

    div.style.width = "".concat(elementWidth, "px");
    div.style.height = "".concat(elementHeight, "px");
    div.style.transform = div.style.webkitTransform = div.style.msTransform = "scale(".concat(options.scaling, ",").concat(options.scaling, ")");
    div.style.transformOrigin = div.style.webkitTransformOrigin = div.style.msTransformOrigin = "left top";
    div.style.overflow = 'hidden';
    div.style.position = 'relative';
    div.style.padding = '0';
    div.style.margin = '0';
    div.style.webkitUserSelect = 'none';
    registerEvent(div, true); //注册事件响应程序

    element.innerHTML = '';
    element.appendChild(div);
    return div;
  }
  /**
   * 注册事件响应程序
   * @function
   * @private
   * @property {Object} element 元素
   * @property {Boolean} 是否css3渲染模式
   */


  function registerEvent(element, css3) {
    function getBulletScreenOnScreenByLocation(location) {
      var bulletScreen = null;
      bulletScreensOnScreen.forEach(function (bulletScreenOnScreen) {
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
    }

    if (css3) {
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
    } else {
      //上下文菜单
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
  }
  /**
   * 设置尺寸
   * @function
   * @private
   */


  function setSize() {
    var _devicePixelRatio = typeof window.devicePixelRatio === 'undefined' ? 1 : window.devicePixelRatio;

    _devicePixelRatio *= options.scaling;

    if (elementWidth != element.clientWidth / options.scaling || elementHeight != element.clientHeight / options.scaling || devicePixelRatio != _devicePixelRatio) {
      elementWidth = element.clientWidth / options.scaling;
      elementHeight = element.clientHeight / options.scaling;
      devicePixelRatio = _devicePixelRatio;

      if (renderMode === RENDER_MODE.css3) {
        div.style.width = "".concat(elementWidth, "px");
        div.style.height = "".concat(elementHeight, "px");
        div.style.transform = div.style.webkitTransform = div.style.msTransform = "scale(".concat(options.scaling, ",").concat(options.scaling, ")");
      } else if (renderMode === RENDER_MODE.canvas) {
        canvas.style.width = "".concat(elementWidth, "px");
        canvas.style.height = "".concat(elementHeight, "px");
        canvas.style.transform = canvas.style.webkitTransform = canvas.style.msTransform = "scale(".concat(options.scaling, ",").concat(options.scaling, ")");
        canvas.width = elementWidth * devicePixelRatio;
        canvas.height = elementHeight * devicePixelRatio;
      } else if (renderMode === RENDER_MODE.webgl) {
        webgl.canvas.style.width = "".concat(elementWidth, "px");
        webgl.canvas.style.height = "".concat(elementHeight, "px");
        webgl.canvas.style.transform = webgl.canvas.style.webkitTransform = webgl.canvas.style.msTransform = "scale(".concat(options.scaling, ",").concat(options.scaling, ")");
        webgl.canvas.width = elementWidth * devicePixelRatio;
        webgl.canvas.height = elementHeight * devicePixelRatio;
        webgl.webglContext.viewport(0, 0, elementWidth, elementHeight);
        webgl.webglContext.uniform2f(webgl.resolutionUniformLocation, webgl.canvas.width, webgl.canvas.height); // 设置全局变量 分辨率
      }
    }
  }
};

exports.BulletScreenEngine = BulletScreenEngine;

},{"./event":4,"./linkedList":5,"./version":6}],2:[function(require,module,exports){
"use strict";

var _BulletScreenEngine = require("./BulletScreenEngine");

window.BulletScreenEngine = _BulletScreenEngine.BulletScreenEngine;

},{"./BulletScreenEngine":1}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BulletScreenEngine = void 0;

var _linkedList = require("./linkedList");

var _event = require("./event");

var _version = require("./version");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 渲染模式
 * @private @constant
 */
var RENDER_MODE = {
  /**
   * CSS3 渲染模式
   * @private @readonly
   */
  css3: 'css3',

  /**
   * WebGL 渲染模式
   * @private @readonly
   */
  webgl: 'webgl',

  /**
   * Canvas 2D 渲染模式
   * @private @readonly
   */
  canvas: 'canvas'
  /** 弹幕引擎对象类 */

};

var BulletScreenEngine =
/**
 * 创建一个弹幕引擎对象。
 * @param {Element} element - 要加载弹幕的元素：有关 Element 接口的信息请参阅MDN [Element]{@link https://developer.mozilla.org/zh-CN/docs/Web/API/Element} 。
 * @param {BulletScreenEngine~Options} [options] - 全局选项：一个 {@link BulletScreenEngine~Options} 结构。
 * @param {String} [renderMode="canvas"] - 渲染模式：默认为“canvas”, “可选css3”， “webgl”。
 */
function BulletScreenEngine(element, options) {
  var renderMode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : RENDER_MODE.canvas;

  _classCallCheck(this, BulletScreenEngine);

  //变量初始化

  /**
   * 开始时间
   * @private @type {Integer}
   */
  var startTime;
  /**
   * 暂停时间
   * @private @type {Integer}
   */

  var pauseTime = 0;
  /**
   * 剩余弹幕，屏幕上的弹幕
   * @private @type {Integer}
   */

  var bulletScreens = new _linkedList.LinkedList(),
      bulletScreensOnScreen = new _linkedList.LinkedList();
  /**
   * 延迟弹幕总数
   * @private @type {Integer}
   */

  var delayBulletScreensCount = 0;
  /**
   * 延迟（单位：毫秒）
   * @private @type {Integer}
   */

  var delay = 0;
  /**
   * 播放标志
   * @private @type {Boolean}
   */

  var playing;
  /**
   * 刷新频率
   * @private @type {Float}
   */

  var refreshRate = 0.06; //初始刷新频率

  /**
   * 上一次刷新时间
   * @private @type {Integer}
   */

  var lastRefreshTime;
  /**
   * 隐藏弹幕
   * @private @type {Boolean}
   */

  var hide = false;
  /**
   * 透明度
   * @private @type {Float}
   */

  var opacity = 0.0; //默认参数

  /**
   * 全局选项
   * @typedef {Object} BulletScreenEngine~Options
   * @description Option 结构用于存放全局选项。
   * @property {Integer} [verticalInterval=8] - 弹幕垂直行间距
   * @property {Float} [verticalInterval=1] - 弹幕播放速度（倍数）
   * @property {BulletScreenEngine~clockCallback} [clock=time => new Date().getTime() - startTime] - 时间基准：此时间基准可指向一个方法用于获取播放器当前进度，这个方法返回值即为播放进度（单位：毫秒）。
   * @property {Float} [scaling=1] 弹幕缩放比例（倍数）
   * @property {BulletScreenEngine~BulletScreenStyle} [defaultStyle] 默认弹幕样式：一个 {@link BulletScreenEngine~BulletScreenStyle} 结构。
   */

  /**
   * 时间基准回调方法
   * @callback BulletScreenEngine~clockCallback
   * @description ClockCallback 回调方法用于播放器当前进度。
   * @returns {Integer} 播放进度：单位：毫秒。
   */

  options = setValue(options, {});
  options.verticalInterval = setValue(options.verticalInterval, 8); //垂直间距

  options.playSpeed = setValue(options.playSpeed, 1); //播放速度倍数

  options.clock = setValue(options.clock, function (time) {
    return new Date().getTime() - startTime;
  }); //时间基准

  options.scaling = setValue(options.scaling, 1); //缩放比例

  options.timeOutDiscard = setValue(options.timeOutDiscard, true); //超时丢弃

  /**
   * 弹幕样式
   * @typedef {Object} BulletScreenEngine~BulletScreenStyle
   * @description BulletScreenStyle 结构用于存放弹幕样式信息。
   * @property {Integer} [shadowBlur=2] 弹幕阴影的模糊级别：0为不显示阴影。
   * @property {String} [fontWeight="600"] 字体粗细：可选值：lighter：更细；normal：标准；bold：粗体；bolder: 更粗；100、200、300、400、500、600、700、800、900：定义由粗到细的字符（400 等同于 normal；700 等同于 bold）。
   * @property {String} [fontFamily="sans-serif"] 字体系列：弹幕的字体族名称或/及类族名称的一个优先表。
   * @property {Integer} [size=19] 字体大小：单位：像素。
   * @property {String} [boxColor] 外框颜色：参照CSS颜色设置方法，为 null 不显示外框。
   * @property {String} [color="white"] 弹幕颜色：参照CSS颜色设置方法，为 null 不显示此弹幕。
   * @property {String} [borderColor] 描边颜色：参照CSS颜色设置方法，为 null 没有描边。
   * @property {Float} [speed=0.15] 弹幕速度：单位：像素/毫秒，仅弹幕类型为0、1时有效。
   * @property {Integer} [residenceTime=5000] 弹幕停留时间：单位：毫秒，仅弹幕类型2、3时有效。
   */

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

  /**
   * 全局选项：一个 {@link BulletScreenEngine~Options} 结构。
   * @readonly
   * @type {BulletScreenEngine~Options}
   */

  this.options = options; //事件初始化

  var event = new _event.Event();
  /**
   * 弹幕单击事件。当单击弹幕时触发。
   * @event BulletScreenEngine#click
   * @property {BulletScreenEngine~BulletScreen} e.bulletScreen - 被单击的弹幕的数据：一个 {@link BulletScreenEngine~BulletScreen} 结构。
   */

  event.add('click');
  /**
   * 弹幕上下文菜单事件。当触发弹幕上下文菜单时触发。
   * @event BulletScreenEngine#contextmenu
   * @property {BulletScreenEngine~BulletScreen} e.bulletScreen - 被单击的弹幕的数据：一个 {@link BulletScreenEngine~BulletScreen} 结构。
   */

  event.add('contextmenu');
  /**
   * 绑定事件处理程序
   * @function
   * @description 绑定事件处理程序。当事件处理程序返回值为 false 时停止冒泡。
   * @param {String} name 事件名称
   * @param {Function} fun 事件处理程序
   * @listens BulletScreenEngine#click
   * @listens BulletScreenEngine#contextmenu
   * @returns false: 失败 数字: 添加后的事件数
   */

  this.bind = event.bind;
  /**
   * 解绑事件处理程序（fun为空解绑所有事件处理程序）
   * @function
   * @param {String} name 事件名称
   * @param {Function} fun 事件处理程序
   * @returns true: 成功 false: 失败 数字: 删除后的事件数
   */

  this.unbind = event.unbind; //初始化

  var canvas;
  var div;
  var webgl;
  var elementWidth = element.clientWidth / options.scaling;
  var elementHeight = element.clientHeight / options.scaling;
  var devicePixelRatio = typeof window.devicePixelRatio === 'undefined' ? 1 : window.devicePixelRatio;
  devicePixelRatio *= options.scaling;
  if (renderMode === RENDER_MODE.css3) div = initDIV(element); //添加DIV
  else if (renderMode === RENDER_MODE.canvas) canvas = initCanvas(element); //添加Canvas
    else if (renderMode === RENDER_MODE.webgl) webgl = initWebGLCanvas(element); //添加WebGL Canvas

  setInterval(setSize, 100);
  console.info('%cBulletScreenEngine%c now loaded.\n' + '\n' + '%cVersion: %s\n' + 'Build Date: %s\n' + '\n' + '%cBulletScreenEngine is a high-performance JavaScript bullet-screen (danmaku) engine.\n' + 'Home: https://iamscottxu.github.io/BulletScreenEngine/', 'font-weight:bold; color:#0099FF;', '', 'font-style:italic;', _version.VERSION, _version.BUILE_DATE, ''); //公共函数

  /**
   * 添加弹幕到弹幕列表。
   * @function
   * @param {BulletScreenEngine~BulletScreen} bulletScreen - 单条弹幕数据：一个 {@link BulletScreenEngine~BulletScreen} 结构。
   * @description 添加弹幕到弹幕列表。由于弹幕在屏幕上出现过后，弹幕引擎将从列表中彻底删除此弹幕。所以，在改变播放进度时，可能需要先[清空弹幕列表]{@link BulletScreenEngine#cleanBulletScreenList}，然后重新加载此播放进度以后的弹幕。
   */

  this.addBulletScreen = function (bulletScreen) {
    /**
     * 单条弹幕数据
     * @typedef {Object} BulletScreenEngine~BulletScreen
     * @description BulletScreen 结构用于存放单条弹幕数据。
     * @property {String} text 弹幕文本
     * @property {Boolean} [canDiscard=true] 是否允许丢弃：在弹幕过多时，程序将自动丢弃一些延迟过高的弹幕。此选项为 false 时本条弹幕无论如何都不会被丢弃，使用本选项的场景如本用户发送的弹幕。注意：不要将太多的弹幕的 canDiscard 设为 false， 否则会因超时的弹幕不会被丢弃而造成意外的问题。
     * @property {Integer} [startTime=options.clock()] 弹幕进入时间：单位：毫秒，默认为[时间基准（options.clock）]{@link BulletScreenEngine~Options}当前时间。
     * @property {Integer} [type=0] 弹幕类型：0：从右到左（普通）；1：从左到右（逆向）；2：顶部固定；3：底部固定。
     * @property {BulletScreenEngine~BulletScreenStyle} style 弹幕样式：一个 {@link BulletScreenEngine~BulletScreenStyle} 结构。设置此选项中的任何一个值，将覆盖对应的全局设置。
     */
    bulletScreen = setValue(bulletScreen, {});
    bulletScreen.text = setValue(bulletScreen.text, 'Empty'); //弹幕文本

    bulletScreen.canDiscard = setValue(bulletScreen.canDiscard, true); //是否允许丢弃

    bulletScreen.startTime = setValue(bulletScreen.startTime, options.clock()); //弹幕进入时间

    bulletScreen.type = setValue(bulletScreen.type, 0); //类型：0：从右到左 1:从左到右 2:顶部固定 3:底部固定

    if (bulletScreen.type <= 3) {
      var oldLength = bulletScreens.getLength();
      bulletScreens.forEach(function (lastBulletScreen) {
        if (bulletScreen.startTime > lastBulletScreen.startTime) return {
          add: {
            addToUp: true,
            element: bulletScreen
          },
          stop: true
        };
      }, true);
      if (oldLength === bulletScreens.getLength()) bulletScreens.push(bulletScreen, false);
    }
  };
  /**
   * 开始播放弹幕。
   * @function
   */


  this.play = function () {
    if (!playing) {
      if (!startTime) startTime = new Date().getTime();
      if (pauseTime) startTime += options.clock() - pauseTime;
      lastRefreshTime = null;
      playing = true;
      requestAnimationFrame(refresh);
    }
  };
  /**
   * 暂停播放弹幕。
   * @function
   * @description 暂停播放弹幕。暂停播放弹幕是指弹幕播放暂停，所有未出现的弹幕将停止出现，已出现的弹幕停止运动，停止消失。
   */


  this.pause = function () {
    if (playing) {
      pauseTime = options.clock();
      playing = false;
    }
  };
  /**
   * 清空弹幕列表。
   * @function
   * @description 清空弹幕列表，但屏幕上已经出现的弹幕不会被清除。
   */


  this.cleanBulletScreenList = function () {
    bulletScreens.clean();
  };
  /**
   * 清空屏幕弹幕。
   * @function
   * @description 清空屏幕弹幕。清空屏幕上已经出现的弹幕，不包括弹幕列表中的弹幕。
   */


  this.cleanBulletScreenListOnScreen = function () {
    bulletScreensOnScreen.clean();
    if (renderMode === RENDER_MODE.css3) div.innerHTML = '';else if (renderMode === RENDER_MODE.canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);else if (renderMode === RENDER_MODE.webgl) webgl.webglContext.clear(webglContext.COLOR_BUFFER_BIT);
  };
  /**
   * 停止播放弹幕。
   * @function
   * @description 停止播放弹幕。停止播放弹幕是指停止播放弹幕，默认[时间基准（options.clock）]{@link BulletScreenEngine~BulletScreenStyle}归零，并[清空弹幕列表]{@link BulletScreenEngine#cleanBulletScreenList}、[清空屏幕弹幕]{@link BulletScreenEngine#cleanBulletScreenListOnScreen}。
   */


  this.stop = function () {
    if (playing) {
      this.pause();
    }

    this.cleanBulletScreenList();
    this.cleanBulletScreenListOnScreen();
    pauseTime = 0;
    startTime = null;
  };
  /**
   * 隐藏弹幕。
   * @function
   */


  this.hide = function () {
    hide = true;
    if (renderMode === RENDER_MODE.css3) div.style.visibility = 'hidden';else if (renderMode === RENDER_MODE.canvas) canvas.style.visibility = 'hidden';else if (renderMode === RENDER_MODE.webgl) webgl.canvas.style.visibility = 'hidden';
  };
  /**
   * 显示弹幕。
   * @function
   */


  this.show = function () {
    hide = false;
    if (renderMode === RENDER_MODE.css3) div.style.visibility = 'visible';else if (renderMode === RENDER_MODE.canvas) canvas.style.visibility = 'visible';else if (renderMode === RENDER_MODE.webgl) webgl.canvas.style.visibility = 'visible';
  };
  /**
   * 设置弹幕不透明度。
   * @function
   * @param {Float} _opacity 弹幕不透明度：取值范围 0.0 到 1.0，0.0 全透明；1.0 不透明。
   */


  this.setOpacity = function (_opacity) {
    opacity = _opacity;
    if (renderMode === RENDER_MODE.css3) div.style.opacity = _opacity;else if (renderMode === RENDER_MODE.canvas) canvas.style.opacity = _opacity;else if (renderMode === RENDER_MODE.webgl) webgl.canvas.style.opacity = _opacity;
  };
  /**
   * 获取弹幕不透明度。
   * @function
   * @returns {Float} 弹幕不透明度：取值范围 0.0 到 1.0，0.0 全透明；1.0 不透明。
   */


  this.getOpacity = function () {
    return opacity;
  };
  /**
   * 获取弹幕可见性。
   * @function
   * @returns {Boolean}  指示弹幕是否可见。
   * @description 获取弹幕可见性。如要显示弹幕请调用 [bulletScreenEngine.show();]{@link BulletScreenEngine#show} ，要隐藏弹幕请调用 [bulletScreenEngine.hide();]{{@link BulletScreenEngine#hide}} 。
   */


  this.getVisibility = function () {
    return !hide;
  };
  /**
   * 获取渲染模式。
   * @function
   * @returns {String} 弹幕渲染模式： 取值为“canvas”、“css3”或“webgl”。
   */


  this.getRenderMode = function () {
    return renderMode;
  };
  /**
   * 获取播放状态。
   * @function
   * @returns {Boolean} 正在播放标志：true：正在播放；false：已暂停/停止播放。
   */


  this.getPlayState = function () {
    return playing;
  };
  /**
  * 获取调试信息。
  * @function
  * @returns {BulletScreenEngine~DebugInfo} 调试信息：一个 {@link BulletScreenEngine~DebugInfo} 结构。
  */


  this.getDebugInfo = function () {
    /**
     * 调试信息
     * @typedef {Object} BulletScreenEngine~DebugInfo
     * @description DebugInfo 结构用于存放调试信息。
     * @property {Integer} time [时间基准（options.clock）]{@link BulletScreenEngine~Options}当前时间。
     * @property {Integer} bulletScreensOnScreenCount 实时弹幕总数
     * @property {Integer} bulletScreensCount 剩余弹幕总数
     * @property {Integer} delay 延迟：单位：毫秒。
     * @property {Integer} delayBulletScreensCount 丢弃弹幕数：因延迟过高而丢弃的弹幕总数。
     * @property {Integer} fps 帧频：单位：帧/秒。
     */
    return {
      time: playing ? options.clock() : pauseTime,
      bulletScreensOnScreenCount: bulletScreensOnScreen.getLength(),
      bulletScreensCount: bulletScreens.getLength(),
      delay: delay,
      delayBulletScreensCount: delayBulletScreensCount,
      fps: playing ? Math.floor(refreshRate * 1000) : 0 //帧频

    };
  };
  /**
   * 获取版本信息。
   * @function
   * @returns {BulletScreenEngine~VersionInfo} 版本信息：一个 {@link BulletScreenEngine~VersionInfo} 结构。
   */


  this.getVersion = function () {
    /**
     * 版本信息
     * @typedef {Object} BulletScreenEngine~VersionInfo
     * @description VersionInfo 结构用于存放版本信息。
     * @property {String} version 版本号
     * @property {String} buildDate 构建日期：时区：UTC。
     */
    return {
      version: _version.VERSION,
      buildDate: _version.BUILE_DATE
    };
  }; //内部函数

  /**
   * 设置值
   * @function
   * @private
   * @property {String} value 值
   * @property {String} defaultBalue 默认值
   * @returns {Object} 值
   */


  function setValue(value, defaultBalue) {
    if (typeof value === 'undefined') return defaultBalue;
    if (typeof value === 'number' && isNaN(value)) return defaultBalue;
    if (value === null) return defaultBalue;
    return value;
  }
  /**
   * 刷新弹幕函数
   * @function
   * @private
   */


  function refresh() {
    var nowTime = new Date().getTime();
    if (lastRefreshTime != null) refreshRate = 1 / (nowTime - lastRefreshTime);
    lastRefreshTime = nowTime;
    addBulletScreensToScreen();
    moveBulletScreenOnScreen();
    if (renderMode === RENDER_MODE.css3) drawOnTheDIV();else if (renderMode === RENDER_MODE.canvas) drawOnTheCanvas();else if (renderMode === RENDER_MODE.webgl) drawOnTheWebGLCanvas();
    if (playing) requestAnimationFrame(refresh);
  }
  /**
   * 绘制函数CSS3
   * @function
   * @private
   */


  function drawOnTheDIV() {
    bulletScreensOnScreen.forEach(function (bulletScreenOnScreen) {
      bulletScreenOnScreen.element.style.transform = bulletScreenOnScreen.element.style.webkitTransform = bulletScreenOnScreen.element.style.msTransform = "translate(".concat(bulletScreenOnScreen.x - 4, "px,").concat(bulletScreenOnScreen.actualY - 4, "px)");
    }, true);
  }
  /**
   * 绘制函数Canvas
   * @function
   * @private
   */


  function drawOnTheCanvas() {
    //离屏渲染
    var hideCanvas = document.createElement('canvas');
    hideCanvas.width = canvas.width;
    hideCanvas.height = canvas.height;
    var hideCanvasContext = hideCanvas.getContext('2d');
    bulletScreensOnScreen.forEach(function (bulletScreenOnScreen) {
      hideCanvasContext.drawImage(bulletScreenOnScreen.hideCanvas, (bulletScreenOnScreen.x - 4) * devicePixelRatio, (bulletScreenOnScreen.actualY - 4) * devicePixelRatio, (bulletScreenOnScreen.width + 8) * devicePixelRatio, (bulletScreenOnScreen.height + 8) * devicePixelRatio);
    }, true);
    var canvasContext = canvas.getContext('2d');
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.drawImage(hideCanvas, 0, 0);
  }
  /**
   * 绘制函数WebGL Canvas
   * @function
   * @private
   */


  function drawOnTheWebGLCanvas() {
    var webglContext = webgl.webglContext; // 清空画布

    webglContext.clear(webglContext.COLOR_BUFFER_BIT);
    bulletScreensOnScreen.forEach(function (bulletScreenOnScreen) {
      // 四个顶点坐标
      var x1 = (bulletScreenOnScreen.x - 4) * devicePixelRatio;
      var x2 = x1 + (bulletScreenOnScreen.width + 8) * devicePixelRatio;
      var y1 = (bulletScreenOnScreen.actualY - 4) * devicePixelRatio;
      var y2 = y1 + (bulletScreenOnScreen.height + 8) * devicePixelRatio; //绑定纹理

      webglContext.bindTexture(webglContext.TEXTURE_2D, bulletScreenOnScreen.texture2D); //绑定范围

      var positionBuffer = webglContext.createBuffer(); // 将绑定点绑定到缓冲数据（positionBuffer）

      webglContext.bindBuffer(webglContext.ARRAY_BUFFER, positionBuffer);
      webglContext.enableVertexAttribArray(webgl.positionAttributeLocation); // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)

      webglContext.vertexAttribPointer(webgl.positionAttributeLocation, 2, //size 每次迭代运行提取两个单位数据
      webglContext.FLOAT, //type 每个单位的数据类型是32位浮点型
      false, //normalize 不需要归一化数据
      0, //stride 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
      // 每次迭代运行运动多少内存到下一个数据开始点
      0 //offset 从缓冲起始位置开始读取
      );
      webglContext.bufferData(webglContext.ARRAY_BUFFER, new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]), webglContext.STATIC_DRAW); //绘制

      webglContext.drawArrays(webglContext.TRIANGLES, //primitiveType
      0, //offset
      6 //count
      );
    }, true);
  }
  /**
   * 移动弹幕函数
   * @function
   * @private
   */


  function moveBulletScreenOnScreen() {
    bulletScreensOnScreen.forEach(function (bulletScreenOnScreen) {
      var nowTime = options.clock();

      switch (bulletScreenOnScreen.bulletScreen.type) {
        case 0:
          if (bulletScreenOnScreen.x > -bulletScreenOnScreen.width) {
            bulletScreenOnScreen.x -= bulletScreenOnScreen.bulletScreen.style.speed * options.playSpeed / refreshRate;
          } else {
            if (renderMode === RENDER_MODE.css3) div.removeChild(bulletScreenOnScreen.element);
            return {
              remove: true
            };
          }

          break;

        case 1:
          if (bulletScreenOnScreen.x < elementWidth) {
            bulletScreenOnScreen.x += bulletScreenOnScreen.bulletScreen.style.speed * options.playSpeed / refreshRate;
          } else {
            if (renderMode === RENDER_MODE.css3) div.removeChild(bulletScreenOnScreen.element);
            return {
              remove: true
            };
          }

          break;

        case 2:
        case 3:
          if (bulletScreenOnScreen.endTime < nowTime) {
            if (renderMode === RENDER_MODE.css3) div.removeChild(bulletScreenOnScreen.element);
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
   * @function
   * @private
   */


  function addBulletScreensToScreen() {
    if (bulletScreensOnScreen.getLength() === 0) delay = 0;
    var times = Math.floor(refreshRate * 2000);

    do {
      var bulletScreen = bulletScreens.pop(false, false);
      if (bulletScreen === null) return;
      var nowTime = options.clock();
      if (bulletScreen.startTime > nowTime) return;

      if (!options.timeOutDiscard || !bulletScreen.canDiscard || bulletScreen.startTime > nowTime - Math.floor(1 / refreshRate) * 60) {
        setDefaultStyle(bulletScreen); //填充默认样式

        getBulletScreenOnScreen(nowTime, bulletScreen); //生成屏幕弹幕对象并添加到屏幕弹幕集合
      } else delayBulletScreensCount++;

      bulletScreens.pop(true, false);
      times--;
    } while (bulletScreensOnScreen.getLength() === 0 || times > 0);
  }
  /**
   * CSS3:创建弹幕元素
   * @function
   * @private
   * @property {Object} bulletScreenOnScreen 屏幕弹幕对象
   * @returns {Object} 元素
   */


  function creatBulletScreenDiv(bulletScreenOnScreen) {
    var bulletScreen = bulletScreenOnScreen.bulletScreen;
    var element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.whiteSpace = 'nowrap';
    element.style.fontWeight = bulletScreen.style.fontWeight;
    element.style.fontSize = "".concat(bulletScreenOnScreen.size, "px");
    element.style.fontFamily = bulletScreen.style.fontFamily;
    element.style.lineHeight = "".concat(bulletScreenOnScreen.size, "px");
    element.style.textShadow = "0 0 ".concat(bulletScreen.style.shadowBlur, "px black");
    element.style.color = bulletScreen.style.color;

    if (bulletScreen.style.borderColor != null) {
      element.style.textStroke = element.style.webkitTextStroke = '0.5px';
      element.style.textStrokeColor = element.style.webkitTextStrokeColor = bulletScreen.borderColor;
    }

    if (bulletScreen.style.boxColor != null) {
      element.style.padding = '3px';
      element.style.border = '1px solid';
      element.style.borderColor = bulletScreen.style.boxColor;
    } else {
      element.style.padding = '4px';
    }

    element.innerText = bulletScreen.text;
    element.bulletScreen = bulletScreen;
    div.appendChild(element);
    return element;
  }
  /**
   * Canvas:创建弹幕画布
   * @function
   * @private
   * @property {Object} bulletScreenOnScreen 屏幕弹幕对象
   * @returns {Object} 元素
   */


  function creatBulletScreenHideCanvas(bulletScreenOnScreen) {
    var bulletScreen = bulletScreenOnScreen.bulletScreen;
    var hideCanvas = document.createElement('canvas');
    hideCanvas.width = (bulletScreenOnScreen.width + 8) * devicePixelRatio;
    hideCanvas.height = (bulletScreenOnScreen.height + 8) * devicePixelRatio;
    var hideCanvasContext = hideCanvas.getContext('2d');
    hideCanvasContext.textBaseline = 'top';
    hideCanvasContext.shadowColor = 'black';
    hideCanvasContext.font = "".concat(bulletScreen.style.fontWeight, " ").concat(bulletScreenOnScreen.size * devicePixelRatio, "px ").concat(bulletScreen.style.fontFamily);

    if (bulletScreen.style.color != null) {
      hideCanvasContext.shadowBlur = (bulletScreen.style.shadowBlur + 0.5) * devicePixelRatio;
      hideCanvasContext.fillStyle = bulletScreen.style.color;
      hideCanvasContext.fillText(bulletScreen.text, 4 * devicePixelRatio, 4 * devicePixelRatio);
    }

    if (bulletScreen.style.borderColor != null) {
      hideCanvasContext.shadowBlur = 0;
      hideCanvasContext.lineWidth = 0.5 * devicePixelRatio;
      hideCanvasContext.strokeStyle = bulletScreen.style.borderColor;
      hideCanvasContext.strokeText(bulletScreen.text, 4 * devicePixelRatio, 4 * devicePixelRatio);
    }

    if (bulletScreen.style.boxColor != null) {
      hideCanvasContext.shadowBlur = 0;
      hideCanvasContext.lineWidth = devicePixelRatio;
      hideCanvasContext.strokeStyle = bulletScreen.style.boxColor;
      hideCanvasContext.strokeRect(devicePixelRatio, devicePixelRatio, hideCanvas.width - devicePixelRatio, hideCanvas.height - devicePixelRatio);
    }

    return hideCanvas;
  }
  /**
   * WebGL：创建弹幕纹理
   * @function
   * @private
   * @property {Object} bulletScreenOnScreen 屏幕弹幕对象
   * @returns {Object} 纹理
   */


  function creatBulletScreenHideTexture2D(bulletScreenOnScreen) {
    var _canvas = creatBulletScreenHideCanvas(bulletScreenOnScreen);

    var webglContext = webgl.webglContext;
    var texture = webglContext.createTexture();
    webglContext.bindTexture(webglContext.TEXTURE_2D, texture); // 设置参数

    webglContext.texParameteri(webglContext.TEXTURE_2D, webglContext.TEXTURE_MIN_FILTER, webglContext.NEAREST);
    webglContext.texParameteri(webglContext.TEXTURE_2D, webglContext.TEXTURE_MAG_FILTER, webglContext.NEAREST);
    webglContext.texParameteri(webglContext.TEXTURE_2D, webglContext.TEXTURE_WRAP_S, webglContext.CLAMP_TO_EDGE);
    webglContext.texParameteri(webglContext.TEXTURE_2D, webglContext.TEXTURE_WRAP_T, webglContext.CLAMP_TO_EDGE);
    webglContext.texImage2D(webglContext.TEXTURE_2D, 0, webglContext.RGBA, webglContext.RGBA, webglContext.UNSIGNED_BYTE, _canvas);
    return texture;
  }
  /**
   * 填充默认样式
   * @function
   * @private
   * @property {BulletScreenEngine~BulletScreen} bulletScreen 弹幕
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
   * @function
   * @private
   * @property {Number} nowTime 当前时间
   * @property {BulletScreenEngine~BulletScreen} bulletScreen 弹幕
   */


  function getBulletScreenOnScreen(nowTime, bulletScreen) {
    delay = nowTime - bulletScreen.startTime;
    var bulletScreenOnScreen = {};
    bulletScreenOnScreen.bulletScreen = bulletScreen;
    bulletScreenOnScreen.startTime = nowTime; //弹幕头部进屏幕时间

    bulletScreenOnScreen.size = bulletScreenOnScreen.bulletScreen.style.size;
    bulletScreenOnScreen.height = bulletScreenOnScreen.size; //弹幕的高度：像素

    if (renderMode === RENDER_MODE.css3) {
      bulletScreenOnScreen.element = creatBulletScreenDiv(bulletScreenOnScreen); //创建Div

      bulletScreenOnScreen.width = bulletScreenOnScreen.element.clientWidth - 8; //弹幕的宽度：像素
    } else if (renderMode === RENDER_MODE.canvas || renderMode === RENDER_MODE.webgl) {
      //计算宽度
      var hideCanvas = document.createElement('canvas');
      var hideCanvasContext = hideCanvas.getContext('2d');
      hideCanvasContext.font = "".concat(bulletScreen.style.fontWeight, " ").concat(bulletScreenOnScreen.size, "px ").concat(bulletScreen.style.fontFamily);
      bulletScreenOnScreen.width = hideCanvasContext.measureText(bulletScreen.text).width; //弹幕的宽度：像素

      if (renderMode === RENDER_MODE.canvas) bulletScreenOnScreen.hideCanvas = creatBulletScreenHideCanvas(bulletScreenOnScreen); //创建Canvas
      else bulletScreenOnScreen.texture2D = creatBulletScreenHideTexture2D(bulletScreenOnScreen); //创建Texture2D
    }

    switch (bulletScreen.type) {
      case 0:
        bulletScreenOnScreen.endTime = parseInt(nowTime + (elementWidth + bulletScreenOnScreen.width) / (bulletScreen.style.speed * options.playSpeed)); //弹幕尾部出屏幕的时间

        bulletScreenOnScreen.x = elementWidth; //弹幕初始X坐标

        bulletScreenOnScreen.y = options.verticalInterval; //弹幕初始Y坐标

        break;

      case 1:
        bulletScreenOnScreen.endTime = parseInt(nowTime + (elementWidth + bulletScreenOnScreen.width) / (bulletScreen.style.speed * options.playSpeed)); //弹幕尾部出屏幕的时间

        bulletScreenOnScreen.x = -bulletScreenOnScreen.width; //弹幕初始X坐标

        bulletScreenOnScreen.y = options.verticalInterval; //弹幕初始Y坐标

        break;

      case 2:
        bulletScreenOnScreen.endTime = bulletScreenOnScreen.startTime + bulletScreen.style.residenceTime * options.playSpeed;
        bulletScreenOnScreen.x = parseInt((elementWidth - bulletScreenOnScreen.width) / 2); //弹幕初始X坐标

        bulletScreenOnScreen.y = options.verticalInterval; //弹幕初始Y坐标

        break;

      case 3:
        bulletScreenOnScreen.endTime = bulletScreenOnScreen.startTime + bulletScreen.style.residenceTime * options.playSpeed;
        bulletScreenOnScreen.x = parseInt((elementWidth - bulletScreenOnScreen.width) / 2); //弹幕初始X坐标

        bulletScreenOnScreen.y = -options.verticalInterval - bulletScreenOnScreen.height; //弹幕初始Y坐标

        break;
    }

    var oldLength = bulletScreensOnScreen.getLength();

    if (bulletScreen.type > 1) {
      bulletScreensOnScreen.forEach(function (nextBulletScreenOnScreen) {
        //弹幕不在流中，是固定弹幕
        if (nextBulletScreenOnScreen.bulletScreen.type != bulletScreen.type) return; //不是同一种类型的弹幕

        if (bulletScreen.type === 2) {
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
      bulletScreensOnScreen.forEach(function (nextBulletScreenOnScreen) {
        //弹幕在流中，是移动弹幕
        if (nextBulletScreenOnScreen.bulletScreen.type > 1) return; //弹幕不在流中，为固定弹幕
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

    if (bulletScreensOnScreen.getLength() === oldLength) bulletScreensOnScreen.push(setActualY(bulletScreenOnScreen), false);
  }
  /**
   * 设置真实的Y坐标
   * @function
   * @private
   * @property {Object} bulletScreenOnScreen 屏幕弹幕事件
   * @returns {Object} 屏幕弹幕事件
   */


  function setActualY(bulletScreenOnScreen) {
    var bulletScreen = bulletScreenOnScreen.bulletScreen;

    if (bulletScreen.type < 3) {
      bulletScreenOnScreen.actualY = bulletScreenOnScreen.y % (elementHeight - bulletScreenOnScreen.height);
    } else if (bulletScreen.type === 3) {
      bulletScreenOnScreen.actualY = elementHeight + bulletScreenOnScreen.y % elementHeight;
    }

    return bulletScreenOnScreen;
  }
  /**
   * 添加Canvas
   * @function
   * @private
   * @property {Object} element 元素
   * @returns {Object} 画布对象
   */


  function initCanvas(element) {
    var canvas = document.createElement('canvas'); //canvas对象

    canvas.style.width = "".concat(elementWidth, "px");
    canvas.style.height = "".concat(elementHeight, "px");
    canvas.style.transform = canvas.style.webkitTransform = canvas.style.msTransform = "scale(".concat(options.scaling, ",").concat(options.scaling, ")");
    canvas.style.transformOrigin = canvas.style.webkitTransformOrigin = canvas.style.msTransformOrigin = "left top";
    canvas.style.position = 'relative';
    canvas.width = elementWidth * devicePixelRatio;
    canvas.height = elementHeight * devicePixelRatio;
    registerEvent(canvas, false); //注册事件响应程序

    element.innerHTML = '';
    element.appendChild(canvas);
    return canvas;
  }
  /**
   * 添加WebGL Canvas
   * @function
   * @private
   * @property {Object} element 元素
   * @returns {Object} webgl信息对象
   */


  function initWebGLCanvas(element) {
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
    var canvas = initCanvas(element);
    var webglContext = canvas.getContext('webgl');
    webglContext.enable(webglContext.BLEND); //开启混合功能

    webglContext.clearColor(0, 0, 0, 0); //设置清除颜色

    webglContext.blendFunc(webglContext.SRC_ALPHA, webglContext.ONE_MINUS_SRC_ALPHA);
    var vertexShader = createShader(webglContext, webglContext.VERTEX_SHADER, vertexShaderSource); //创建顶点着色器

    var fragmentShader = createShader(webglContext, webglContext.FRAGMENT_SHADER, fragmentShaderSource); //创建片段着色器

    var program = createProgram(webglContext, vertexShader, fragmentShader); //创建着色程序

    webglContext.useProgram(program);
    var positionAttributeLocation = webglContext.getAttribLocation(program, 'a_position');
    var texcoordAttributeLocation = webglContext.getAttribLocation(program, 'a_texcoord');
    var resolutionUniformLocation = webglContext.getUniformLocation(program, 'u_resolution');
    webglContext.viewport(0, 0, canvas.width, canvas.height);
    webglContext.uniform2f(resolutionUniformLocation, canvas.width, canvas.height); // 设置全局变量 分辨率
    //绑定范围

    var texcoordBuffer = webglContext.createBuffer(); // 将绑定点绑定到缓冲数据（texcoordBuffer）

    webglContext.bindBuffer(webglContext.ARRAY_BUFFER, texcoordBuffer);
    webglContext.enableVertexAttribArray(texcoordAttributeLocation); // 以浮点型格式传递纹理坐标

    webglContext.vertexAttribPointer(texcoordAttributeLocation, 2, //size 每次迭代运行提取两个单位数据
    webglContext.FLOAT, //type 每个单位的数据类型是32位浮点型
    false, //normalize 不需要归一化数据 
    0, //stride 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
    // 每次迭代运行运动多少内存到下一个数据开始点
    0 //offset 从缓冲起始位置开始读取
    );
    webglContext.bufferData(webglContext.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), webglContext.STATIC_DRAW);
    return {
      canvas: canvas,
      positionAttributeLocation: positionAttributeLocation,
      resolutionUniformLocation: resolutionUniformLocation,
      webglContext: webglContext
    };
  }
  /**
   * 添加DIV
   * @function
   * @private
   * @property {Object} element 元素
   * @returns {Object} DIV对象
   */


  function initDIV(element) {
    var div = document.createElement('div'); //DIV

    div.style.width = "".concat(elementWidth, "px");
    div.style.height = "".concat(elementHeight, "px");
    div.style.transform = div.style.webkitTransform = div.style.msTransform = "scale(".concat(options.scaling, ",").concat(options.scaling, ")");
    div.style.transformOrigin = div.style.webkitTransformOrigin = div.style.msTransformOrigin = "left top";
    div.style.overflow = 'hidden';
    div.style.position = 'relative';
    div.style.padding = '0';
    div.style.margin = '0';
    div.style.webkitUserSelect = 'none';
    registerEvent(div, true); //注册事件响应程序

    element.innerHTML = '';
    element.appendChild(div);
    return div;
  }
  /**
   * 注册事件响应程序
   * @function
   * @private
   * @property {Object} element 元素
   * @property {Boolean} 是否css3渲染模式
   */


  function registerEvent(element, css3) {
    function getBulletScreenOnScreenByLocation(location) {
      var bulletScreen = null;
      bulletScreensOnScreen.forEach(function (bulletScreenOnScreen) {
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
    }

    if (css3) {
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
    } else {
      //上下文菜单
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
  }
  /**
   * 设置尺寸
   * @function
   * @private
   */


  function setSize() {
    var _devicePixelRatio = typeof window.devicePixelRatio === 'undefined' ? 1 : window.devicePixelRatio;

    _devicePixelRatio *= options.scaling;

    if (elementWidth != element.clientWidth / options.scaling || elementHeight != element.clientHeight / options.scaling || devicePixelRatio != _devicePixelRatio) {
      elementWidth = element.clientWidth / options.scaling;
      elementHeight = element.clientHeight / options.scaling;
      devicePixelRatio = _devicePixelRatio;

      if (renderMode === RENDER_MODE.css3) {
        div.style.width = "".concat(elementWidth, "px");
        div.style.height = "".concat(elementHeight, "px");
        div.style.transform = div.style.webkitTransform = div.style.msTransform = "scale(".concat(options.scaling, ",").concat(options.scaling, ")");
      } else if (renderMode === RENDER_MODE.canvas) {
        canvas.style.width = "".concat(elementWidth, "px");
        canvas.style.height = "".concat(elementHeight, "px");
        canvas.style.transform = canvas.style.webkitTransform = canvas.style.msTransform = "scale(".concat(options.scaling, ",").concat(options.scaling, ")");
        canvas.width = elementWidth * devicePixelRatio;
        canvas.height = elementHeight * devicePixelRatio;
      } else if (renderMode === RENDER_MODE.webgl) {
        webgl.canvas.style.width = "".concat(elementWidth, "px");
        webgl.canvas.style.height = "".concat(elementHeight, "px");
        webgl.canvas.style.transform = webgl.canvas.style.webkitTransform = webgl.canvas.style.msTransform = "scale(".concat(options.scaling, ",").concat(options.scaling, ")");
        webgl.canvas.width = elementWidth * devicePixelRatio;
        webgl.canvas.height = elementHeight * devicePixelRatio;
        webgl.webglContext.viewport(0, 0, elementWidth, elementHeight);
        webgl.webglContext.uniform2f(webgl.resolutionUniformLocation, webgl.canvas.width, webgl.canvas.height); // 设置全局变量 分辨率
      }
    }
  }
};

exports.BulletScreenEngine = BulletScreenEngine;

},{"./event":4,"./linkedList":5,"./version":6}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BUILE_DATE = exports.VERSION = void 0;
var VERSION = "2.0-Alpha";
exports.VERSION = VERSION;
var BUILE_DATE = "Tue, 08 Jan 2019 14:59:26 GMT";
exports.BUILE_DATE = BUILE_DATE;

},{}]},{},[2,3]);
