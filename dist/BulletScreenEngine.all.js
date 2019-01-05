(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BulletScreenEngine = void 0;

var _linkedList = require("./linkedList");

var _version = require("./version");

//弹幕引擎对象（参数：加载到的元素，选项, 渲染模式：默认为canvas, 可选css3， webgl）
var BulletScreenEngine = function BulletScreenEngine(element, option) {
  var renderMode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'canvas';
  //变量初始化
  var startTime; //开始时间

  var pauseTime = 0; //暂停时间

  var BulletScreens = new _linkedList.LinkedList(),
      BulletScreensOnScreen = new _linkedList.LinkedList(); //剩余弹幕，屏幕上的弹幕

  var delayBulletScreensCount = 0; //延迟弹幕总数

  var delay = 0; //延迟（单位：毫秒）

  var playing; //播放标志

  var refreshRate = 0.06; //初始刷新频率

  var lastRefreshTime; //上一次刷新时间

  var hide = false; //隐藏弹幕
  //默认参数

  option = setValue(option, {});
  option.verticalInterval = setValue(option.verticalInterval, 8); //垂直间距

  option.playSpeed = setValue(option.playSpeed, 1); //播放速度倍数

  option.clock = setValue(option.clock, function (time) {
    return new Date().getTime() - startTime;
  }); //时间基准

  option.shadowBlur = setValue(option.shadowBlur, 2); //阴影的模糊级别，0为不显示阴影

  option.scaling = setValue(option.scaling, 1); //缩放比例

  option.timeOutDiscard = setValue(option.timeOutDiscard, true); //超时丢弃

  option.fontWeight = setValue(option.fontWeight, 600); //字体粗细

  option.fontFamily = setValue(option.fontFamily, 'sans-serif'); //字体系列

  this.option = option; //初始化

  var canvas;
  var div;
  var webgl;
  var elementWidth = element.clientWidth;
  var elementHeight = element.clientHeight;
  if (renderMode == 'css3') div = initDIV(element); //添加DIV
  else if (renderMode == 'canvas') canvas = initCanvas(element); //添加Canvas
    else if (renderMode == 'webgl') webgl = initWebGLCanvas(element); //添加WebGL Canvas

  setInterval(setSize, 100); //公共函数
  //添加弹幕

  this.addBulletScreen = function (BulletScreen) {
    BulletScreen = setValue(BulletScreen, {});
    BulletScreen.uuid = setValue(''); //uuid

    BulletScreen.text = setValue(BulletScreen.text, 'Empty'); //弹幕文本

    BulletScreen.boxColor = setValue(BulletScreen.boxColor, null); //方框颜色

    BulletScreen.speed = setValue(BulletScreen.speed, 0.15); //弹幕速度（单位：像素/毫秒） 仅类型0、1有效

    BulletScreen.size = setValue(BulletScreen.size, 19); //字体大小（单位：像素）

    BulletScreen.color = setValue(BulletScreen.color, null); //字体颜色

    BulletScreen.borderColor = setValue(BulletScreen.borderColor, null); //边框颜色

    BulletScreen.type = setValue(BulletScreen.type, 0); //类型：0：从右到左 1:从左到右 2:顶部固定 3:底部固定

    BulletScreen.startTime = setValue(BulletScreen.startTime, option.clock()); //弹幕进入时间

    BulletScreen.residenceTime = setValue(BulletScreen.endTime, 5000); //弹幕停留时间 仅类型2、3有效

    BulletScreen.canDiscard = setValue(BulletScreen.canDiscard, true); //是否允许丢弃

    if (BulletScreen.type <= 3) {
      var oldLength = BulletScreens.getLength();
      BulletScreens.forEach(function (lastBulletScreen) {
        if (BulletScreen.startTime > lastBulletScreen.startTime) return {
          add: {
            addToUp: true,
            element: BulletScreen
          },
          stop: true
        };
      }, true);
      if (oldLength == BulletScreens.getLength()) BulletScreens.push(BulletScreen, false);
    }
  }; //开始播放函数


  this.play = function () {
    if (!playing) {
      if (!startTime) startTime = new Date().getTime();
      if (pauseTime) startTime += option.clock() - pauseTime;
      lastRefreshTime = null;
      playing = true; //stop = false;

      requestAnimationFrame(refresh);
    }
  }; //暂停播放函数


  this.pause = function () {
    if (playing) {
      pauseTime = option.clock();
      playing = false;
    }
  }; //清空弹幕列表


  this.cleanBulletScreenList = function () {
    BulletScreens.clean();
  }; //清空屏幕弹幕


  this.cleanBulletScreenListOnScreen = function () {
    BulletScreensOnScreen.clean();
    if (div) div.innerHTML = '';
  }; //停止播放函数


  this.stop = function () {
    if (playing) {
      this.pause();
    }

    pauseTime = 0;
    startTime = null;
    this.cleanBulletScreenList();
    this.cleanBulletScreenListOnScreen(); //重新加载

    if (renderMode === 'css3') div = initDIV(element); //添加DIV
    else if (renderMode === 'canvas' || renderMode === 'webgl') canvas = initCanvas(element); //添加canvas
  }; //隐藏弹幕


  this.hide = function () {
    hide = true;
    if (canvas) canvas.style.visibility = 'hidden';else div.style.visibility = 'hidden';
  }; //显示弹幕


  this.show = function () {
    hide = false;
    if (canvas) canvas.style.visibility = 'visible';else div.style.visibility = 'visible';
  }; //获取可见性


  this.getVisibility = function () {
    return !hide;
  }; //获取播放状态


  this.getPlayState = function () {
    return playing;
  }; //获取调试信息


  this.getDebugInfo = function () {
    return {
      time: playing ? option.clock() : pauseTime,
      bulletScreensOnScreenCount: BulletScreensOnScreen.getLength(),
      //实时弹幕总数
      bulletScreensCount: BulletScreens.getLength(),
      //剩余弹幕总数
      delay: delay,
      //延迟（单位：毫秒）
      delayBulletScreensCount: delayBulletScreensCount,
      //延迟弹幕总数
      fps: playing ? parseInt(refreshRate * 1000) : 0 //帧频

    };
  }; //获取版本号


  this.getVersion = function () {
    return {
      version: _version.VERSION,
      buildDate: _version.BUILE_DATE
    };
  }; //内部函数


  function setValue(value, defaultBalue) {
    if (typeof value == 'undefined') return defaultBalue;
    if (typeof value == 'number' && isNaN(value)) return defaultBalue;
    if (value == null) return defaultBalue;
    return value;
  } //刷新弹幕函数


  function refresh() {
    var nowTime = new Date().getTime();
    if (lastRefreshTime != null) refreshRate = 1 / (nowTime - lastRefreshTime);
    lastRefreshTime = nowTime;
    addBulletScreensToScreen();
    moveBulletScreenOnScreen();
    if (renderMode === 'css3') drawOnTheDIV();else if (renderMode === 'canvas') drawOnTheCanvas();else if (renderMode === 'webgl') drawOnTheWebGLCanvas();
    if (playing) requestAnimationFrame(refresh);
  } //绘制函数CSS3


  function drawOnTheDIV() {
    BulletScreensOnScreen.forEach(function (BulletScreenOnScreen) {
      BulletScreenOnScreen.element.style.transform = 'translate(' + (BulletScreenOnScreen.x - 4) + 'px,' + (BulletScreenOnScreen.actualY - 4) + 'px)';
    }, true);
  } //绘制函数Canvas


  function drawOnTheCanvas() {
    //离屏渲染
    var hideCanvas = document.createElement('canvas');
    hideCanvas.width = canvas.width;
    hideCanvas.height = canvas.height;
    var hideCanvasContext = hideCanvas.getContext('2d');
    BulletScreensOnScreen.forEach(function (BulletScreenOnScreen) {
      hideCanvasContext.drawImage(BulletScreenOnScreen.hideCanvas, BulletScreenOnScreen.x - 4, BulletScreenOnScreen.actualY - 4);
    }, true);
    var canvasContext = canvas.getContext('2d');
    canvasContext.clearRect(0, 0, elementWidth, elementHeight);
    canvasContext.drawImage(hideCanvas, 0, 0);
  } //绘制函数WebGL Canvas


  function drawOnTheWebGLCanvas() {
    var webglContext = webgl.webglContext; // 清空画布

    webglContext.clear(webglContext.COLOR_BUFFER_BIT);
    BulletScreensOnScreen.forEach(function (BulletScreenOnScreen) {
      // 四个顶点坐标
      var x1 = BulletScreenOnScreen.x - 4;
      var x2 = x1 + BulletScreenOnScreen.width + 8;
      var y1 = BulletScreenOnScreen.actualY - 4;
      var y2 = y1 + BulletScreenOnScreen.height + 8; //绑定纹理

      webglContext.bindTexture(webglContext.TEXTURE_2D, BulletScreenOnScreen.texture2D); //绑定范围

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
  } //移动弹幕函数


  function moveBulletScreenOnScreen() {
    BulletScreensOnScreen.forEach(function (BulletScreenOnScreen) {
      var nowTime = option.clock();

      switch (BulletScreenOnScreen.BulletScreen.type) {
        case 0:
          if (BulletScreenOnScreen.x > -BulletScreenOnScreen.width) {
            BulletScreenOnScreen.x -= BulletScreenOnScreen.BulletScreen.speed * option.playSpeed / refreshRate;
          } else {
            if (renderMode === 'css3') div.removeChild(BulletScreenOnScreen.element);
            return {
              remove: true
            };
          }

          break;

        case 1:
          if (BulletScreenOnScreen.x < elementWidth) {
            BulletScreenOnScreen.x += BulletScreenOnScreen.BulletScreen.speed * option.playSpeed / refreshRate;
          } else {
            if (renderMode === 'css3') div.removeChild(BulletScreenOnScreen.element);
            return {
              remove: true
            };
          }

          break;

        case 2:
        case 3:
          if (BulletScreenOnScreen.endTime < nowTime) {
            if (renderMode === 'css3') div.removeChild(BulletScreenOnScreen.element);
            return {
              remove: true
            };
          }

          break;
      }
    }, true);
  } //添加弹幕到屏幕函数


  function addBulletScreensToScreen() {
    if (BulletScreensOnScreen.getLength() == 0) delay = 0;
    var times = refreshRate > 0.02 ? Math.ceil(1 / refreshRate) : 1;

    do {
      var BulletScreen = BulletScreens.pop(false, false);
      if (BulletScreen == null) return;
      var nowTime = option.clock();
      if (BulletScreen.startTime > nowTime) return;
      if (!option.timeOutDiscard || !BulletScreen.canDiscard || BulletScreen.startTime > nowTime - 1 / refreshRate * 1.5) getBulletScreenOnScreen(nowTime, BulletScreen); //生成屏幕弹幕对象并添加到屏幕弹幕集合
      else delayBulletScreensCount++;
      BulletScreens.pop(true, false);
      times--;
    } while (BulletScreensOnScreen.getLength() == 0 || times > 0);
  } //CSS3:创建弹幕元素


  function creatBulletScreenDiv(BulletScreenOnScreen) {
    var BulletScreen = BulletScreenOnScreen.BulletScreen;
    var element = document.createElement('div');
    element.className = 'BulletScreenDiv';
    element.setAttribute('data-uuid', BulletScreen.uuid);
    element.style.position = 'absolute';
    element.style.webkitUserSelect = 'none';
    element.style.whiteSpace = 'nowrap';
    element.style.fontWeight = option.fontWeight;
    element.style.fontSize = BulletScreenOnScreen.size.toString() + 'px';
    element.style.fontFamily = option.fontFamily;
    element.style.lineHeight = BulletScreenOnScreen.size.toString() + 'px';
    element.style.padding = '3px';
    element.style.textShadow = '0 0 ' + option.shadowBlur.toString() + 'px black';
    if (BulletScreen.color == null) element.style.color = 'rgba(0,0,0,0)';else element.style.color = BulletScreen.color;

    if (BulletScreen.borderColor != null) {
      element.style.webkitTextStroke = '0.5px';
      element.style.webkitTextStrokeColor = BulletScreen.borderColor;
    }

    if (BulletScreen.boxColor != null) {
      element.style.border = '1px solid';
      element.style.borderColor = BulletScreen.boxColor;
    }

    element.innerText = BulletScreen.text;
    div.appendChild(element);
    return element;
  } //Canvas:创建弹幕画布


  function creatBulletScreenHideCanvas(BulletScreenOnScreen) {
    var hideCanvas = document.createElement('canvas');
    hideCanvas.width = BulletScreenOnScreen.width + 8;
    hideCanvas.height = BulletScreenOnScreen.height + 8;
    var hideCanvasContext = hideCanvas.getContext('2d');
    hideCanvasContext.textBaseline = 'top';
    hideCanvasContext.shadowColor = 'black';
    hideCanvasContext.font = option.fontWeight + ' ' + BulletScreenOnScreen.size.toString() + 'px ' + option.fontFamily;

    if (BulletScreenOnScreen.BulletScreen.color != null) {
      hideCanvasContext.shadowBlur = option.shadowBlur + 0.5;
      hideCanvasContext.fillStyle = BulletScreenOnScreen.BulletScreen.color;
      hideCanvasContext.fillText(BulletScreenOnScreen.BulletScreen.text, 4, 4);
    }

    if (BulletScreenOnScreen.BulletScreen.borderColor != null) {
      hideCanvasContext.shadowBlur = 0;
      hideCanvasContext.lineWidth = 0.5;
      hideCanvasContext.strokeStyle = BulletScreenOnScreen.BulletScreen.borderColor;
      hideCanvasContext.strokeText(BulletScreenOnScreen.BulletScreen.text, 4, 4);
    }

    if (BulletScreenOnScreen.BulletScreen.boxColor != null) {
      hideCanvasContext.shadowBlur = 0;
      hideCanvasContext.lineWidth = 2;
      hideCanvasContext.strokeStyle = BulletScreenOnScreen.BulletScreen.boxColor;
      hideCanvasContext.strokeRect(0, 0, BulletScreenOnScreen.width + 8, BulletScreenOnScreen.height + 8);
    }

    return hideCanvas;
  } //WebGL：创建弹幕纹理


  function creatBulletScreenHideTexture2D(BulletScreenOnScreen) {
    var _canvas = creatBulletScreenHideCanvas(BulletScreenOnScreen);

    var webglContext = webgl.webglContext;
    var texture = webglContext.createTexture();
    webglContext.bindTexture(webglContext.TEXTURE_2D, texture); // 设置参数

    webglContext.texParameteri(webglContext.TEXTURE_2D, webglContext.TEXTURE_MIN_FILTER, webglContext.NEAREST);
    webglContext.texParameteri(webglContext.TEXTURE_2D, webglContext.TEXTURE_MAG_FILTER, webglContext.NEAREST);
    webglContext.texParameteri(webglContext.TEXTURE_2D, webglContext.TEXTURE_WRAP_S, webglContext.CLAMP_TO_EDGE);
    webglContext.texParameteri(webglContext.TEXTURE_2D, webglContext.TEXTURE_WRAP_T, webglContext.CLAMP_TO_EDGE);
    webglContext.texImage2D(webglContext.TEXTURE_2D, 0, webglContext.RGBA, webglContext.RGBA, webglContext.UNSIGNED_BYTE, _canvas);
    return texture;
  } //生成屏幕弹幕对象函数


  function getBulletScreenOnScreen(nowTime, BulletScreen) {
    delay = nowTime - BulletScreen.startTime;
    var BulletScreenOnScreen = {};
    BulletScreenOnScreen.BulletScreen = BulletScreen;
    BulletScreenOnScreen.startTime = nowTime; //弹幕头部进屏幕时间

    BulletScreenOnScreen.size = BulletScreenOnScreen.BulletScreen.size * option.scaling;
    BulletScreenOnScreen.height = BulletScreenOnScreen.size; //弹幕的高度：像素

    if (renderMode === 'css3') {
      BulletScreenOnScreen.element = creatBulletScreenDiv(BulletScreenOnScreen); //创建Div

      BulletScreenOnScreen.width = BulletScreenOnScreen.element.clientWidth - 8; //弹幕的宽度：像素
    } else if (renderMode === 'canvas' || renderMode === 'webgl') {
      //计算宽度
      var hideCanvas = document.createElement('canvas');
      var hideCanvasContext = hideCanvas.getContext('2d');
      hideCanvasContext.font = option.fontWeight + ' ' + BulletScreenOnScreen.size.toString() + 'px ' + option.fontFamily;
      BulletScreenOnScreen.width = hideCanvasContext.measureText(BulletScreen.text).width; //弹幕的宽度：像素

      if (renderMode === 'canvas') BulletScreenOnScreen.hideCanvas = creatBulletScreenHideCanvas(BulletScreenOnScreen); //创建Canvas
      else BulletScreenOnScreen.texture2D = creatBulletScreenHideTexture2D(BulletScreenOnScreen); //创建Texture2D
    }

    BulletScreenOnScreen.endTime = parseInt(nowTime + (elementWidth + BulletScreenOnScreen.width) / (BulletScreen.speed * option.playSpeed)); //弹幕尾部出屏幕的时间

    switch (BulletScreen.type) {
      case 0:
        BulletScreenOnScreen.endTime = parseInt(nowTime + (elementWidth + BulletScreenOnScreen.width) / (BulletScreen.speed * option.playSpeed)); //弹幕尾部出屏幕的时间

        BulletScreenOnScreen.x = elementWidth; //弹幕初始X坐标

        BulletScreenOnScreen.y = option.verticalInterval; //弹幕初始Y坐标

        break;

      case 1:
        BulletScreenOnScreen.endTime = parseInt(nowTime + (elementWidth + BulletScreenOnScreen.width) / (BulletScreen.speed * option.playSpeed)); //弹幕尾部出屏幕的时间

        BulletScreenOnScreen.x = -BulletScreenOnScreen.width; //弹幕初始X坐标

        BulletScreenOnScreen.y = option.verticalInterval; //弹幕初始Y坐标

        break;

      case 2:
        BulletScreenOnScreen.endTime = BulletScreenOnScreen.startTime + BulletScreen.residenceTime;
        BulletScreenOnScreen.x = parseInt((elementWidth - BulletScreenOnScreen.width) / 2); //弹幕初始X坐标

        BulletScreenOnScreen.y = option.verticalInterval; //弹幕初始Y坐标

        break;

      case 3:
        BulletScreenOnScreen.endTime = BulletScreenOnScreen.startTime + BulletScreen.residenceTime;
        BulletScreenOnScreen.x = parseInt((elementWidth - BulletScreenOnScreen.width) / 2); //弹幕初始X坐标

        BulletScreenOnScreen.y = -option.verticalInterval - BulletScreenOnScreen.height; //弹幕初始Y坐标

        break;
    }

    var oldLength = BulletScreensOnScreen.getLength();

    if (BulletScreen.type > 1) {
      BulletScreensOnScreen.forEach(function (nextBulletScreenOnScreen) {
        //弹幕不在流中，是固定弹幕
        if (nextBulletScreenOnScreen.BulletScreen.type != BulletScreen.type) return; //不是同一种类型的弹幕

        if (BulletScreen.type == 2) {
          //如果新弹幕在当前弹幕上方且未与当前弹幕重叠
          if (BulletScreenOnScreen.y + BulletScreenOnScreen.height < nextBulletScreenOnScreen.y) return {
            add: {
              addToUp: true,
              element: setActualY(BulletScreenOnScreen)
            },
            stop: true
          }; //如果上一条弹幕的消失时间小于当前弹幕的出现时间

          if (nextBulletScreenOnScreen.endTime < nowTime) BulletScreenOnScreen.y = nextBulletScreenOnScreen.y;else BulletScreenOnScreen.y = nextBulletScreenOnScreen.y + nextBulletScreenOnScreen.height + option.verticalInterval;
        } else {
          //如果新弹幕在当前弹幕下方且未与当前弹幕重叠
          if (BulletScreenOnScreen.y > nextBulletScreenOnScreen.y + nextBulletScreenOnScreen.height) {
            return {
              add: {
                addToUp: true,
                element: setActualY(BulletScreenOnScreen)
              },
              stop: true
            };
          } //如果上一条弹幕的消失时间小于当前弹幕的出现时间


          if (nextBulletScreenOnScreen.endTime < nowTime) BulletScreenOnScreen.y = nextBulletScreenOnScreen.y;else BulletScreenOnScreen.y = nextBulletScreenOnScreen.y - BulletScreenOnScreen.height - option.verticalInterval;
        }
      }, true);
    } else {
      //当前弹幕经过一个点需要的总时长
      var BulletScreenOnScreenWidthTime = BulletScreenOnScreen.width / (BulletScreenOnScreen.BulletScreen.speed * option.playSpeed);
      BulletScreensOnScreen.forEach(function (nextBulletScreenOnScreen) {
        //弹幕在流中，是移动弹幕
        if (nextBulletScreenOnScreen.BulletScreen.type > 1) return; //弹幕不在流中，为固定弹幕
        //如果新弹幕在当前弹幕上方且未与当前弹幕重叠

        if (BulletScreenOnScreen.y + BulletScreenOnScreen.height < nextBulletScreenOnScreen.y) return {
          add: {
            addToUp: true,
            element: setActualY(BulletScreenOnScreen)
          },
          stop: true
        }; //上一条弹幕经过一个点需要的总时长

        var nextBulletScreenOnScreenWidthTime = nextBulletScreenOnScreen.width / (nextBulletScreenOnScreen.BulletScreen.speed * option.playSpeed); //如果上一条弹幕的消失时间小于当前弹幕的出现时间

        if (nextBulletScreenOnScreen.startTime + nextBulletScreenOnScreenWidthTime >= nowTime || //如果上一条弹幕的头进入了，但是尾还没进入
        nextBulletScreenOnScreen.endTime >= BulletScreenOnScreen.endTime - BulletScreenOnScreenWidthTime) //如果当前弹幕头出去了，上一条弹幕尾还没出去
          BulletScreenOnScreen.y = nextBulletScreenOnScreen.y + nextBulletScreenOnScreen.height + option.verticalInterval;else BulletScreenOnScreen.y = nextBulletScreenOnScreen.y;
      }, true);
    }

    if (BulletScreensOnScreen.getLength() == oldLength) BulletScreensOnScreen.push(setActualY(BulletScreenOnScreen), false);
  } //设置真实的Y坐标


  function setActualY(BulletScreenOnScreen) {
    var BulletScreen = BulletScreenOnScreen.BulletScreen;

    if (BulletScreen.type < 3) {
      BulletScreenOnScreen.actualY = BulletScreenOnScreen.y % (elementHeight - BulletScreenOnScreen.height);
    } else if (BulletScreen.type == 3) {
      BulletScreenOnScreen.actualY = elementHeight + BulletScreenOnScreen.y % elementHeight;
    }

    return BulletScreenOnScreen;
  } //添加Canvas


  function initCanvas(element) {
    var canvas = document.createElement('canvas'); //canvas对象

    canvas.style.width = element.clientWidth + 'px';
    canvas.style.height = element.clientHeight + 'px';
    canvas.width = element.clientWidth;
    canvas.height = element.clientHeight;
    element.innerHTML = '';
    element.appendChild(canvas);
    return canvas;
  } //添加WebGL Canvas


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
    webglContext.viewport(0, 0, element.clientWidth, element.clientHeight);
    webglContext.uniform2f(resolutionUniformLocation, element.clientWidth, element.clientHeight); // 设置全局变量 分辨率
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
  } //添加DIV


  function initDIV(element) {
    var div = document.createElement('div'); //DIV

    div.style.width = element.clientWidth + 'px';
    div.style.height = element.clientHeight + 'px';
    div.style.overflow = 'hidden';
    div.style.position = 'relative';
    div.style.padding = '0';
    div.style.margin = '0';
    element.innerHTML = '';
    element.appendChild(div);
    return div;
  } //设置尺寸


  function setSize() {
    if (elementWidth != element.clientWidth || elementHeight != element.clientHeight) {
      elementWidth = element.clientWidth;
      elementHeight = element.clientHeight;

      if (renderMode == 'css3') {
        div.style.width = elementWidth + 'px';
        div.style.height = elementHeight + 'px';
      } else if (renderMode == 'canvas') {
        canvas.style.width = elementWidth + 'px';
        canvas.style.height = elementHeight + 'px';
        canvas.width = elementWidth;
        canvas.height = elementHeight;
      } else if (renderMode == 'webgl') {
        webgl.canvas.style.width = elementWidth + 'px';
        webgl.canvas.style.height = elementHeight + 'px';
        webgl.canvas.width = elementWidth;
        webgl.canvas.height = elementHeight;
        webgl.webglContext.viewport(0, 0, elementWidth, elementHeight);
        webgl.webglContext.uniform2f(webgl.resolutionUniformLocation, elementWidth, elementHeight); // 设置全局变量 分辨率
      }
    }
  }
};

exports.BulletScreenEngine = BulletScreenEngine;

},{"./linkedList":4,"./version":5}],2:[function(require,module,exports){
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

var _version = require("./version");

//弹幕引擎对象（参数：加载到的元素，选项, 渲染模式：默认为canvas, 可选css3， webgl）
var BulletScreenEngine = function BulletScreenEngine(element, option) {
  var renderMode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'canvas';
  //变量初始化
  var startTime; //开始时间

  var pauseTime = 0; //暂停时间

  var BulletScreens = new _linkedList.LinkedList(),
      BulletScreensOnScreen = new _linkedList.LinkedList(); //剩余弹幕，屏幕上的弹幕

  var delayBulletScreensCount = 0; //延迟弹幕总数

  var delay = 0; //延迟（单位：毫秒）

  var playing; //播放标志

  var refreshRate = 0.06; //初始刷新频率

  var lastRefreshTime; //上一次刷新时间

  var hide = false; //隐藏弹幕
  //默认参数

  option = setValue(option, {});
  option.verticalInterval = setValue(option.verticalInterval, 8); //垂直间距

  option.playSpeed = setValue(option.playSpeed, 1); //播放速度倍数

  option.clock = setValue(option.clock, function (time) {
    return new Date().getTime() - startTime;
  }); //时间基准

  option.shadowBlur = setValue(option.shadowBlur, 2); //阴影的模糊级别，0为不显示阴影

  option.scaling = setValue(option.scaling, 1); //缩放比例

  option.timeOutDiscard = setValue(option.timeOutDiscard, true); //超时丢弃

  option.fontWeight = setValue(option.fontWeight, 600); //字体粗细

  option.fontFamily = setValue(option.fontFamily, 'sans-serif'); //字体系列

  this.option = option; //初始化

  var canvas;
  var div;
  var webgl;
  var elementWidth = element.clientWidth;
  var elementHeight = element.clientHeight;
  if (renderMode == 'css3') div = initDIV(element); //添加DIV
  else if (renderMode == 'canvas') canvas = initCanvas(element); //添加Canvas
    else if (renderMode == 'webgl') webgl = initWebGLCanvas(element); //添加WebGL Canvas

  setInterval(setSize, 100); //公共函数
  //添加弹幕

  this.addBulletScreen = function (BulletScreen) {
    BulletScreen = setValue(BulletScreen, {});
    BulletScreen.uuid = setValue(''); //uuid

    BulletScreen.text = setValue(BulletScreen.text, 'Empty'); //弹幕文本

    BulletScreen.boxColor = setValue(BulletScreen.boxColor, null); //方框颜色

    BulletScreen.speed = setValue(BulletScreen.speed, 0.15); //弹幕速度（单位：像素/毫秒） 仅类型0、1有效

    BulletScreen.size = setValue(BulletScreen.size, 19); //字体大小（单位：像素）

    BulletScreen.color = setValue(BulletScreen.color, null); //字体颜色

    BulletScreen.borderColor = setValue(BulletScreen.borderColor, null); //边框颜色

    BulletScreen.type = setValue(BulletScreen.type, 0); //类型：0：从右到左 1:从左到右 2:顶部固定 3:底部固定

    BulletScreen.startTime = setValue(BulletScreen.startTime, option.clock()); //弹幕进入时间

    BulletScreen.residenceTime = setValue(BulletScreen.endTime, 5000); //弹幕停留时间 仅类型2、3有效

    BulletScreen.canDiscard = setValue(BulletScreen.canDiscard, true); //是否允许丢弃

    if (BulletScreen.type <= 3) {
      var oldLength = BulletScreens.getLength();
      BulletScreens.forEach(function (lastBulletScreen) {
        if (BulletScreen.startTime > lastBulletScreen.startTime) return {
          add: {
            addToUp: true,
            element: BulletScreen
          },
          stop: true
        };
      }, true);
      if (oldLength == BulletScreens.getLength()) BulletScreens.push(BulletScreen, false);
    }
  }; //开始播放函数


  this.play = function () {
    if (!playing) {
      if (!startTime) startTime = new Date().getTime();
      if (pauseTime) startTime += option.clock() - pauseTime;
      lastRefreshTime = null;
      playing = true; //stop = false;

      requestAnimationFrame(refresh);
    }
  }; //暂停播放函数


  this.pause = function () {
    if (playing) {
      pauseTime = option.clock();
      playing = false;
    }
  }; //清空弹幕列表


  this.cleanBulletScreenList = function () {
    BulletScreens.clean();
  }; //清空屏幕弹幕


  this.cleanBulletScreenListOnScreen = function () {
    BulletScreensOnScreen.clean();
    if (div) div.innerHTML = '';
  }; //停止播放函数


  this.stop = function () {
    if (playing) {
      this.pause();
    }

    pauseTime = 0;
    startTime = null;
    this.cleanBulletScreenList();
    this.cleanBulletScreenListOnScreen(); //重新加载

    if (renderMode === 'css3') div = initDIV(element); //添加DIV
    else if (renderMode === 'canvas' || renderMode === 'webgl') canvas = initCanvas(element); //添加canvas
  }; //隐藏弹幕


  this.hide = function () {
    hide = true;
    if (canvas) canvas.style.visibility = 'hidden';else div.style.visibility = 'hidden';
  }; //显示弹幕


  this.show = function () {
    hide = false;
    if (canvas) canvas.style.visibility = 'visible';else div.style.visibility = 'visible';
  }; //获取可见性


  this.getVisibility = function () {
    return !hide;
  }; //获取播放状态


  this.getPlayState = function () {
    return playing;
  }; //获取调试信息


  this.getDebugInfo = function () {
    return {
      time: playing ? option.clock() : pauseTime,
      bulletScreensOnScreenCount: BulletScreensOnScreen.getLength(),
      //实时弹幕总数
      bulletScreensCount: BulletScreens.getLength(),
      //剩余弹幕总数
      delay: delay,
      //延迟（单位：毫秒）
      delayBulletScreensCount: delayBulletScreensCount,
      //延迟弹幕总数
      fps: playing ? parseInt(refreshRate * 1000) : 0 //帧频

    };
  }; //获取版本号


  this.getVersion = function () {
    return {
      version: _version.VERSION,
      buildDate: _version.BUILE_DATE
    };
  }; //内部函数


  function setValue(value, defaultBalue) {
    if (typeof value == 'undefined') return defaultBalue;
    if (typeof value == 'number' && isNaN(value)) return defaultBalue;
    if (value == null) return defaultBalue;
    return value;
  } //刷新弹幕函数


  function refresh() {
    var nowTime = new Date().getTime();
    if (lastRefreshTime != null) refreshRate = 1 / (nowTime - lastRefreshTime);
    lastRefreshTime = nowTime;
    addBulletScreensToScreen();
    moveBulletScreenOnScreen();
    if (renderMode === 'css3') drawOnTheDIV();else if (renderMode === 'canvas') drawOnTheCanvas();else if (renderMode === 'webgl') drawOnTheWebGLCanvas();
    if (playing) requestAnimationFrame(refresh);
  } //绘制函数CSS3


  function drawOnTheDIV() {
    BulletScreensOnScreen.forEach(function (BulletScreenOnScreen) {
      BulletScreenOnScreen.element.style.transform = 'translate(' + (BulletScreenOnScreen.x - 4) + 'px,' + (BulletScreenOnScreen.actualY - 4) + 'px)';
    }, true);
  } //绘制函数Canvas


  function drawOnTheCanvas() {
    //离屏渲染
    var hideCanvas = document.createElement('canvas');
    hideCanvas.width = canvas.width;
    hideCanvas.height = canvas.height;
    var hideCanvasContext = hideCanvas.getContext('2d');
    BulletScreensOnScreen.forEach(function (BulletScreenOnScreen) {
      hideCanvasContext.drawImage(BulletScreenOnScreen.hideCanvas, BulletScreenOnScreen.x - 4, BulletScreenOnScreen.actualY - 4);
    }, true);
    var canvasContext = canvas.getContext('2d');
    canvasContext.clearRect(0, 0, elementWidth, elementHeight);
    canvasContext.drawImage(hideCanvas, 0, 0);
  } //绘制函数WebGL Canvas


  function drawOnTheWebGLCanvas() {
    var webglContext = webgl.webglContext; // 清空画布

    webglContext.clear(webglContext.COLOR_BUFFER_BIT);
    BulletScreensOnScreen.forEach(function (BulletScreenOnScreen) {
      // 四个顶点坐标
      var x1 = BulletScreenOnScreen.x - 4;
      var x2 = x1 + BulletScreenOnScreen.width + 8;
      var y1 = BulletScreenOnScreen.actualY - 4;
      var y2 = y1 + BulletScreenOnScreen.height + 8; //绑定纹理

      webglContext.bindTexture(webglContext.TEXTURE_2D, BulletScreenOnScreen.texture2D); //绑定范围

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
  } //移动弹幕函数


  function moveBulletScreenOnScreen() {
    BulletScreensOnScreen.forEach(function (BulletScreenOnScreen) {
      var nowTime = option.clock();

      switch (BulletScreenOnScreen.BulletScreen.type) {
        case 0:
          if (BulletScreenOnScreen.x > -BulletScreenOnScreen.width) {
            BulletScreenOnScreen.x -= BulletScreenOnScreen.BulletScreen.speed * option.playSpeed / refreshRate;
          } else {
            if (renderMode === 'css3') div.removeChild(BulletScreenOnScreen.element);
            return {
              remove: true
            };
          }

          break;

        case 1:
          if (BulletScreenOnScreen.x < elementWidth) {
            BulletScreenOnScreen.x += BulletScreenOnScreen.BulletScreen.speed * option.playSpeed / refreshRate;
          } else {
            if (renderMode === 'css3') div.removeChild(BulletScreenOnScreen.element);
            return {
              remove: true
            };
          }

          break;

        case 2:
        case 3:
          if (BulletScreenOnScreen.endTime < nowTime) {
            if (renderMode === 'css3') div.removeChild(BulletScreenOnScreen.element);
            return {
              remove: true
            };
          }

          break;
      }
    }, true);
  } //添加弹幕到屏幕函数


  function addBulletScreensToScreen() {
    if (BulletScreensOnScreen.getLength() == 0) delay = 0;
    var times = refreshRate > 0.02 ? Math.ceil(1 / refreshRate) : 1;

    do {
      var BulletScreen = BulletScreens.pop(false, false);
      if (BulletScreen == null) return;
      var nowTime = option.clock();
      if (BulletScreen.startTime > nowTime) return;
      if (!option.timeOutDiscard || !BulletScreen.canDiscard || BulletScreen.startTime > nowTime - 1 / refreshRate * 1.5) getBulletScreenOnScreen(nowTime, BulletScreen); //生成屏幕弹幕对象并添加到屏幕弹幕集合
      else delayBulletScreensCount++;
      BulletScreens.pop(true, false);
      times--;
    } while (BulletScreensOnScreen.getLength() == 0 || times > 0);
  } //CSS3:创建弹幕元素


  function creatBulletScreenDiv(BulletScreenOnScreen) {
    var BulletScreen = BulletScreenOnScreen.BulletScreen;
    var element = document.createElement('div');
    element.className = 'BulletScreenDiv';
    element.setAttribute('data-uuid', BulletScreen.uuid);
    element.style.position = 'absolute';
    element.style.webkitUserSelect = 'none';
    element.style.whiteSpace = 'nowrap';
    element.style.fontWeight = option.fontWeight;
    element.style.fontSize = BulletScreenOnScreen.size.toString() + 'px';
    element.style.fontFamily = option.fontFamily;
    element.style.lineHeight = BulletScreenOnScreen.size.toString() + 'px';
    element.style.padding = '3px';
    element.style.textShadow = '0 0 ' + option.shadowBlur.toString() + 'px black';
    if (BulletScreen.color == null) element.style.color = 'rgba(0,0,0,0)';else element.style.color = BulletScreen.color;

    if (BulletScreen.borderColor != null) {
      element.style.webkitTextStroke = '0.5px';
      element.style.webkitTextStrokeColor = BulletScreen.borderColor;
    }

    if (BulletScreen.boxColor != null) {
      element.style.border = '1px solid';
      element.style.borderColor = BulletScreen.boxColor;
    }

    element.innerText = BulletScreen.text;
    div.appendChild(element);
    return element;
  } //Canvas:创建弹幕画布


  function creatBulletScreenHideCanvas(BulletScreenOnScreen) {
    var hideCanvas = document.createElement('canvas');
    hideCanvas.width = BulletScreenOnScreen.width + 8;
    hideCanvas.height = BulletScreenOnScreen.height + 8;
    var hideCanvasContext = hideCanvas.getContext('2d');
    hideCanvasContext.textBaseline = 'top';
    hideCanvasContext.shadowColor = 'black';
    hideCanvasContext.font = option.fontWeight + ' ' + BulletScreenOnScreen.size.toString() + 'px ' + option.fontFamily;

    if (BulletScreenOnScreen.BulletScreen.color != null) {
      hideCanvasContext.shadowBlur = option.shadowBlur + 0.5;
      hideCanvasContext.fillStyle = BulletScreenOnScreen.BulletScreen.color;
      hideCanvasContext.fillText(BulletScreenOnScreen.BulletScreen.text, 4, 4);
    }

    if (BulletScreenOnScreen.BulletScreen.borderColor != null) {
      hideCanvasContext.shadowBlur = 0;
      hideCanvasContext.lineWidth = 0.5;
      hideCanvasContext.strokeStyle = BulletScreenOnScreen.BulletScreen.borderColor;
      hideCanvasContext.strokeText(BulletScreenOnScreen.BulletScreen.text, 4, 4);
    }

    if (BulletScreenOnScreen.BulletScreen.boxColor != null) {
      hideCanvasContext.shadowBlur = 0;
      hideCanvasContext.lineWidth = 2;
      hideCanvasContext.strokeStyle = BulletScreenOnScreen.BulletScreen.boxColor;
      hideCanvasContext.strokeRect(0, 0, BulletScreenOnScreen.width + 8, BulletScreenOnScreen.height + 8);
    }

    return hideCanvas;
  } //WebGL：创建弹幕纹理


  function creatBulletScreenHideTexture2D(BulletScreenOnScreen) {
    var _canvas = creatBulletScreenHideCanvas(BulletScreenOnScreen);

    var webglContext = webgl.webglContext;
    var texture = webglContext.createTexture();
    webglContext.bindTexture(webglContext.TEXTURE_2D, texture); // 设置参数

    webglContext.texParameteri(webglContext.TEXTURE_2D, webglContext.TEXTURE_MIN_FILTER, webglContext.NEAREST);
    webglContext.texParameteri(webglContext.TEXTURE_2D, webglContext.TEXTURE_MAG_FILTER, webglContext.NEAREST);
    webglContext.texParameteri(webglContext.TEXTURE_2D, webglContext.TEXTURE_WRAP_S, webglContext.CLAMP_TO_EDGE);
    webglContext.texParameteri(webglContext.TEXTURE_2D, webglContext.TEXTURE_WRAP_T, webglContext.CLAMP_TO_EDGE);
    webglContext.texImage2D(webglContext.TEXTURE_2D, 0, webglContext.RGBA, webglContext.RGBA, webglContext.UNSIGNED_BYTE, _canvas);
    return texture;
  } //生成屏幕弹幕对象函数


  function getBulletScreenOnScreen(nowTime, BulletScreen) {
    delay = nowTime - BulletScreen.startTime;
    var BulletScreenOnScreen = {};
    BulletScreenOnScreen.BulletScreen = BulletScreen;
    BulletScreenOnScreen.startTime = nowTime; //弹幕头部进屏幕时间

    BulletScreenOnScreen.size = BulletScreenOnScreen.BulletScreen.size * option.scaling;
    BulletScreenOnScreen.height = BulletScreenOnScreen.size; //弹幕的高度：像素

    if (renderMode === 'css3') {
      BulletScreenOnScreen.element = creatBulletScreenDiv(BulletScreenOnScreen); //创建Div

      BulletScreenOnScreen.width = BulletScreenOnScreen.element.clientWidth - 8; //弹幕的宽度：像素
    } else if (renderMode === 'canvas' || renderMode === 'webgl') {
      //计算宽度
      var hideCanvas = document.createElement('canvas');
      var hideCanvasContext = hideCanvas.getContext('2d');
      hideCanvasContext.font = option.fontWeight + ' ' + BulletScreenOnScreen.size.toString() + 'px ' + option.fontFamily;
      BulletScreenOnScreen.width = hideCanvasContext.measureText(BulletScreen.text).width; //弹幕的宽度：像素

      if (renderMode === 'canvas') BulletScreenOnScreen.hideCanvas = creatBulletScreenHideCanvas(BulletScreenOnScreen); //创建Canvas
      else BulletScreenOnScreen.texture2D = creatBulletScreenHideTexture2D(BulletScreenOnScreen); //创建Texture2D
    }

    BulletScreenOnScreen.endTime = parseInt(nowTime + (elementWidth + BulletScreenOnScreen.width) / (BulletScreen.speed * option.playSpeed)); //弹幕尾部出屏幕的时间

    switch (BulletScreen.type) {
      case 0:
        BulletScreenOnScreen.endTime = parseInt(nowTime + (elementWidth + BulletScreenOnScreen.width) / (BulletScreen.speed * option.playSpeed)); //弹幕尾部出屏幕的时间

        BulletScreenOnScreen.x = elementWidth; //弹幕初始X坐标

        BulletScreenOnScreen.y = option.verticalInterval; //弹幕初始Y坐标

        break;

      case 1:
        BulletScreenOnScreen.endTime = parseInt(nowTime + (elementWidth + BulletScreenOnScreen.width) / (BulletScreen.speed * option.playSpeed)); //弹幕尾部出屏幕的时间

        BulletScreenOnScreen.x = -BulletScreenOnScreen.width; //弹幕初始X坐标

        BulletScreenOnScreen.y = option.verticalInterval; //弹幕初始Y坐标

        break;

      case 2:
        BulletScreenOnScreen.endTime = BulletScreenOnScreen.startTime + BulletScreen.residenceTime;
        BulletScreenOnScreen.x = parseInt((elementWidth - BulletScreenOnScreen.width) / 2); //弹幕初始X坐标

        BulletScreenOnScreen.y = option.verticalInterval; //弹幕初始Y坐标

        break;

      case 3:
        BulletScreenOnScreen.endTime = BulletScreenOnScreen.startTime + BulletScreen.residenceTime;
        BulletScreenOnScreen.x = parseInt((elementWidth - BulletScreenOnScreen.width) / 2); //弹幕初始X坐标

        BulletScreenOnScreen.y = -option.verticalInterval - BulletScreenOnScreen.height; //弹幕初始Y坐标

        break;
    }

    var oldLength = BulletScreensOnScreen.getLength();

    if (BulletScreen.type > 1) {
      BulletScreensOnScreen.forEach(function (nextBulletScreenOnScreen) {
        //弹幕不在流中，是固定弹幕
        if (nextBulletScreenOnScreen.BulletScreen.type != BulletScreen.type) return; //不是同一种类型的弹幕

        if (BulletScreen.type == 2) {
          //如果新弹幕在当前弹幕上方且未与当前弹幕重叠
          if (BulletScreenOnScreen.y + BulletScreenOnScreen.height < nextBulletScreenOnScreen.y) return {
            add: {
              addToUp: true,
              element: setActualY(BulletScreenOnScreen)
            },
            stop: true
          }; //如果上一条弹幕的消失时间小于当前弹幕的出现时间

          if (nextBulletScreenOnScreen.endTime < nowTime) BulletScreenOnScreen.y = nextBulletScreenOnScreen.y;else BulletScreenOnScreen.y = nextBulletScreenOnScreen.y + nextBulletScreenOnScreen.height + option.verticalInterval;
        } else {
          //如果新弹幕在当前弹幕下方且未与当前弹幕重叠
          if (BulletScreenOnScreen.y > nextBulletScreenOnScreen.y + nextBulletScreenOnScreen.height) {
            return {
              add: {
                addToUp: true,
                element: setActualY(BulletScreenOnScreen)
              },
              stop: true
            };
          } //如果上一条弹幕的消失时间小于当前弹幕的出现时间


          if (nextBulletScreenOnScreen.endTime < nowTime) BulletScreenOnScreen.y = nextBulletScreenOnScreen.y;else BulletScreenOnScreen.y = nextBulletScreenOnScreen.y - BulletScreenOnScreen.height - option.verticalInterval;
        }
      }, true);
    } else {
      //当前弹幕经过一个点需要的总时长
      var BulletScreenOnScreenWidthTime = BulletScreenOnScreen.width / (BulletScreenOnScreen.BulletScreen.speed * option.playSpeed);
      BulletScreensOnScreen.forEach(function (nextBulletScreenOnScreen) {
        //弹幕在流中，是移动弹幕
        if (nextBulletScreenOnScreen.BulletScreen.type > 1) return; //弹幕不在流中，为固定弹幕
        //如果新弹幕在当前弹幕上方且未与当前弹幕重叠

        if (BulletScreenOnScreen.y + BulletScreenOnScreen.height < nextBulletScreenOnScreen.y) return {
          add: {
            addToUp: true,
            element: setActualY(BulletScreenOnScreen)
          },
          stop: true
        }; //上一条弹幕经过一个点需要的总时长

        var nextBulletScreenOnScreenWidthTime = nextBulletScreenOnScreen.width / (nextBulletScreenOnScreen.BulletScreen.speed * option.playSpeed); //如果上一条弹幕的消失时间小于当前弹幕的出现时间

        if (nextBulletScreenOnScreen.startTime + nextBulletScreenOnScreenWidthTime >= nowTime || //如果上一条弹幕的头进入了，但是尾还没进入
        nextBulletScreenOnScreen.endTime >= BulletScreenOnScreen.endTime - BulletScreenOnScreenWidthTime) //如果当前弹幕头出去了，上一条弹幕尾还没出去
          BulletScreenOnScreen.y = nextBulletScreenOnScreen.y + nextBulletScreenOnScreen.height + option.verticalInterval;else BulletScreenOnScreen.y = nextBulletScreenOnScreen.y;
      }, true);
    }

    if (BulletScreensOnScreen.getLength() == oldLength) BulletScreensOnScreen.push(setActualY(BulletScreenOnScreen), false);
  } //设置真实的Y坐标


  function setActualY(BulletScreenOnScreen) {
    var BulletScreen = BulletScreenOnScreen.BulletScreen;

    if (BulletScreen.type < 3) {
      BulletScreenOnScreen.actualY = BulletScreenOnScreen.y % (elementHeight - BulletScreenOnScreen.height);
    } else if (BulletScreen.type == 3) {
      BulletScreenOnScreen.actualY = elementHeight + BulletScreenOnScreen.y % elementHeight;
    }

    return BulletScreenOnScreen;
  } //添加Canvas


  function initCanvas(element) {
    var canvas = document.createElement('canvas'); //canvas对象

    canvas.style.width = element.clientWidth + 'px';
    canvas.style.height = element.clientHeight + 'px';
    canvas.width = element.clientWidth;
    canvas.height = element.clientHeight;
    element.innerHTML = '';
    element.appendChild(canvas);
    return canvas;
  } //添加WebGL Canvas


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
    webglContext.viewport(0, 0, element.clientWidth, element.clientHeight);
    webglContext.uniform2f(resolutionUniformLocation, element.clientWidth, element.clientHeight); // 设置全局变量 分辨率
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
  } //添加DIV


  function initDIV(element) {
    var div = document.createElement('div'); //DIV

    div.style.width = element.clientWidth + 'px';
    div.style.height = element.clientHeight + 'px';
    div.style.overflow = 'hidden';
    div.style.position = 'relative';
    div.style.padding = '0';
    div.style.margin = '0';
    element.innerHTML = '';
    element.appendChild(div);
    return div;
  } //设置尺寸


  function setSize() {
    if (elementWidth != element.clientWidth || elementHeight != element.clientHeight) {
      elementWidth = element.clientWidth;
      elementHeight = element.clientHeight;

      if (renderMode == 'css3') {
        div.style.width = elementWidth + 'px';
        div.style.height = elementHeight + 'px';
      } else if (renderMode == 'canvas') {
        canvas.style.width = elementWidth + 'px';
        canvas.style.height = elementHeight + 'px';
        canvas.width = elementWidth;
        canvas.height = elementHeight;
      } else if (renderMode == 'webgl') {
        webgl.canvas.style.width = elementWidth + 'px';
        webgl.canvas.style.height = elementHeight + 'px';
        webgl.canvas.width = elementWidth;
        webgl.canvas.height = elementHeight;
        webgl.webglContext.viewport(0, 0, elementWidth, elementHeight);
        webgl.webglContext.uniform2f(webgl.resolutionUniformLocation, elementWidth, elementHeight); // 设置全局变量 分辨率
      }
    }
  }
};

exports.BulletScreenEngine = BulletScreenEngine;

},{"./linkedList":4,"./version":5}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LinkedList = void 0;

//双向链表
var LinkedList = function LinkedList() {
  //双向链表结点
  var node = function node(element) {
    this.element = element;
    this.next = null;
    this.previous = null;
  }; //初始化


  var topNode = new node(null);
  var bottomNode = new node(null);
  var length = 0;
  topNode.next = bottomNode;
  bottomNode.previous = topNode; //公共函数
  //获取元素个数

  this.getLength = function (l) {
    return length;
  }; //插入元素（参数：元素，插入到顶部或底部）


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
  }; //读取元素（参数：读取后是否删除，读取顶部或底部元素）


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
  }; //清空链表


  this.clean = function () {
    topNode = new node(null);
    bottomNode = new node(null);
    topNode.next = bottomNode;
    bottomNode.previous = topNode;
    length = 0;
  }; //遍历链表（参数：遍历回调函数，从顶到底或从底到顶）
  //回调函数
  //（参数：元素，返回：{remove：删除此元素，add:插入元素(add.addToUp:插入到上方, add.element:元素), stop：停止遍历}）


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

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BUILE_DATE = exports.VERSION = void 0;
var VERSION = "1.1";
exports.VERSION = VERSION;
var BUILE_DATE = "Sat, 05 Jan 2019 07:03:39 GMT";
exports.BUILE_DATE = BUILE_DATE;

},{}]},{},[2,3]);
