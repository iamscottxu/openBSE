import { LinkedList } from './linkedList'
import { Event } from './event'
import { VERSION, BUILE_DATE } from './version'
//弹幕引擎对象（参数：加载到的元素，选项, 渲染模式：默认为canvas, 可选css3， webgl）
const BulletScreenEngine = function (element, option, renderMode = 'canvas') {
    //变量初始化
    let startTime; //开始时间
    let pauseTime = 0; //暂停时间
    let bulletScreens = new LinkedList(), bulletScreensOnScreen = new LinkedList(); //剩余弹幕，屏幕上的弹幕
    let delayBulletScreensCount = 0; //延迟弹幕总数
    let delay = 0; //延迟（单位：毫秒）
    let playing; //播放标志
    let refreshRate = 0.06; //初始刷新频率
    let lastRefreshTime; //上一次刷新时间
    let hide = false; //隐藏弹幕
    let opacity = 0.0; //透明度

    //默认参数
    option = setValue(option, {});
    option.verticalInterval = setValue(option.verticalInterval, 8); //垂直间距
    option.playSpeed = setValue(option.playSpeed, 1); //播放速度倍数
    option.clock = setValue(option.clock, time => new Date().getTime() - startTime); //时间基准
    option.shadowBlur = setValue(option.shadowBlur, 2); //阴影的模糊级别，0为不显示阴影
    option.scaling = setValue(option.scaling, 1); //缩放比例
    option.timeOutDiscard = setValue(option.timeOutDiscard, true); //超时丢弃
    option.fontWeight = setValue(option.fontWeight, 600); //字体粗细
    option.fontFamily = setValue(option.fontFamily, 'sans-serif'); //字体系列
    this.option = option;

    //事件初始化
    let event = new Event();
    event.add('click');
    event.add('contextmenu');
    this.bind = event.bind;
    this.unbind = event.unbind;

    //初始化
    let canvas;
    let div;
    let webgl;
    let elementWidth = element.clientWidth;
    let elementHeight = element.clientHeight;
    if (renderMode == 'css3') div = initDIV(element); //添加DIV
    else if (renderMode == 'canvas') canvas = initCanvas(element); //添加Canvas
    else if (renderMode == 'webgl') webgl = initWebGLCanvas(element); //添加WebGL Canvas

    setInterval(setSize, 100);

    console.info(
        '%cBulletScreenEngine%c now loaded.\n' +
        '\n' +
        '%cVersion: %s\n' +
        'Build Date: %s\n' +
        '\n' +
        '%cBulletScreenEngine is a high-performance JavaScript bullet-screen (danmaku) engine.\n' +
        'Home: https://iamscottxu.github.io/BulletScreenEngine/'
        , 'font-weight:bold; color:#0099FF;', '', 'font-style:italic;', VERSION, BUILE_DATE, '');

    //公共函数
    //添加弹幕
    this.addBulletScreen = function (bulletScreen) {
        bulletScreen = setValue(bulletScreen, {});
        bulletScreen.text = setValue(bulletScreen.text, 'Empty'); //弹幕文本
        bulletScreen.boxColor = setValue(bulletScreen.boxColor, null); //方框颜色
        bulletScreen.speed = setValue(bulletScreen.speed, 0.15); //弹幕速度（单位：像素/毫秒） 仅类型0、1有效
        bulletScreen.size = setValue(bulletScreen.size, 19); //字体大小（单位：像素）
        bulletScreen.color = setValue(bulletScreen.color, null); //字体颜色
        bulletScreen.borderColor = setValue(bulletScreen.borderColor, null); //边框颜色
        bulletScreen.type = setValue(bulletScreen.type, 0); //类型：0：从右到左 1:从左到右 2:顶部固定 3:底部固定
        bulletScreen.startTime = setValue(bulletScreen.startTime, option.clock()); //弹幕进入时间
        bulletScreen.residenceTime = setValue(bulletScreen.endTime, 5000); //弹幕停留时间 仅类型2、3有效
        bulletScreen.canDiscard = setValue(bulletScreen.canDiscard, true); //是否允许丢弃
        if (bulletScreen.type <= 3) {
            let oldLength = bulletScreens.getLength();
            bulletScreens.forEach(function (lastBulletScreen) {
                if (bulletScreen.startTime > lastBulletScreen.startTime)
                    return {
                        add: {
                            addToUp: true,
                            element: bulletScreen
                        },
                        stop: true
                    }
            }, true)
            if (oldLength == bulletScreens.getLength()) bulletScreens.push(bulletScreen, false);
        }
    }

    //开始播放函数
    this.play = function () {
        if (!playing) {
            if (!startTime) startTime = new Date().getTime();
            if (pauseTime) startTime += option.clock() - pauseTime;
            lastRefreshTime = null;
            playing = true;
            requestAnimationFrame(refresh);
        }
    }

    //暂停播放函数
    this.pause = function () {
        if (playing) {
            pauseTime = option.clock();
            playing = false;
        }
    }

    //清空弹幕列表
    this.cleanBulletScreenList = function () {
        bulletScreens.clean();
    }

    //清空屏幕弹幕
    this.cleanBulletScreenListOnScreen = function () {
        bulletScreensOnScreen.clean();
        if (renderMode === 'css3') div.innerHTML = '';
        else if (renderMode === 'canvas') canvas.getContext('2d').clearRect(0, 0, elementWidth, elementHeight);
        else if (renderMode === 'webgl') webgl.webglContext.clear(webglContext.COLOR_BUFFER_BIT);
    }

    //停止播放函数
    this.stop = function () {
        if (playing) {
            this.pause();
        }
        this.cleanBulletScreenList();
        this.cleanBulletScreenListOnScreen();
        pauseTime = 0;
        startTime = null;
    }

    //隐藏弹幕
    this.hide = function () {
        hide = true;
        if (renderMode === 'css3') div.style.visibility = 'hidden';
        else if (renderMode === 'canvas') canvas.style.visibility = 'hidden';
        else if (renderMode === 'webgl') webgl.canvas.style.visibility = 'hidden';
    }

    //显示弹幕
    this.show = function () {
        hide = false;
        if (renderMode === 'css3') div.style.visibility = 'visible';
        else if (renderMode === 'canvas') canvas.style.visibility = 'visible';
        else if (renderMode === 'webgl') webgl.canvas.style.visibility = 'visible';
    }

    //设置透明度
    this.setOpacity = function (_opacity) {
        opacity = _opacity;
        if (renderMode === 'css3') div.style.opacity = _opacity;
        else if (renderMode === 'canvas') canvas.style.opacity = _opacity;
        else if (renderMode === 'webgl') webgl.canvas.style.opacity = _opacity;
    }

    //获取透明度
    this.getOpacity = function () {
        return opacity;
    }

    //获取可见性
    this.getVisibility = function () {
        return !hide;
    }

    //获取渲染模式
    this.getRenderMode = function () {
        return renderMode;
    }

    //获取播放状态
    this.getPlayState = function () {
        return playing;
    }

    //获取调试信息
    this.getDebugInfo = function () {
        return {
            time: playing ? option.clock() : pauseTime,
            bulletScreensOnScreenCount: bulletScreensOnScreen.getLength(), //实时弹幕总数
            bulletScreensCount: bulletScreens.getLength(), //剩余弹幕总数
            delay: delay, //延迟（单位：毫秒）
            delayBulletScreensCount: delayBulletScreensCount, //延迟弹幕总数
            fps: playing ? parseInt(refreshRate * 1000) : 0 //帧频
        }
    }

    //获取版本号
    this.getVersion = function () {
        return {
            version: VERSION,
            buildDate: BUILE_DATE
        }
    }

    //内部函数
    function setValue(value, defaultBalue) {
        if (typeof (value) === 'undefined') return defaultBalue;
        if (typeof (value) === 'number' && isNaN(value)) return defaultBalue;
        if (value === null) return defaultBalue;
        return value;
    }
    //刷新弹幕函数
    function refresh() {
        let nowTime = new Date().getTime();
        if (lastRefreshTime != null) refreshRate = 1 / (nowTime - lastRefreshTime);
        lastRefreshTime = nowTime;
        addBulletScreensToScreen();
        moveBulletScreenOnScreen();
        if (renderMode === 'css3') drawOnTheDIV();
        else if (renderMode === 'canvas') drawOnTheCanvas();
        else if (renderMode === 'webgl') drawOnTheWebGLCanvas();
        if (playing) requestAnimationFrame(refresh);
    }

    //绘制函数CSS3
    function drawOnTheDIV() {
        bulletScreensOnScreen.forEach((bulletScreenOnScreen) => {
            bulletScreenOnScreen.element.style.transform =
                'translate(' + (bulletScreenOnScreen.x - 4) + 'px,' + (bulletScreenOnScreen.actualY - 4) + 'px)';
        }, true);
    }

    //绘制函数Canvas
    function drawOnTheCanvas() {
        //离屏渲染
        let hideCanvas = document.createElement('canvas');
        hideCanvas.width = canvas.width;
        hideCanvas.height = canvas.height;
        let hideCanvasContext = hideCanvas.getContext('2d');
        bulletScreensOnScreen.forEach((bulletScreenOnScreen) => {
            hideCanvasContext.drawImage(bulletScreenOnScreen.hideCanvas, bulletScreenOnScreen.x - 4, bulletScreenOnScreen.actualY - 4);
        }, true);

        let canvasContext = canvas.getContext('2d');
        canvasContext.clearRect(0, 0, elementWidth, elementHeight);
        canvasContext.drawImage(hideCanvas, 0, 0);
    }

    //绘制函数WebGL Canvas
    function drawOnTheWebGLCanvas() {
        let webglContext = webgl.webglContext;
        // 清空画布
        webglContext.clear(webglContext.COLOR_BUFFER_BIT);
        bulletScreensOnScreen.forEach((bulletScreenOnScreen) => {
            // 四个顶点坐标
            let x1 = bulletScreenOnScreen.x - 4;
            let x2 = x1 + bulletScreenOnScreen.width + 8;
            let y1 = bulletScreenOnScreen.actualY - 4;
            let y2 = y1 + bulletScreenOnScreen.height + 8;
            //绑定纹理
            webglContext.bindTexture(webglContext.TEXTURE_2D, bulletScreenOnScreen.texture2D);
            //绑定范围
            let positionBuffer = webglContext.createBuffer();
            // 将绑定点绑定到缓冲数据（positionBuffer）
            webglContext.bindBuffer(webglContext.ARRAY_BUFFER, positionBuffer);
            webglContext.enableVertexAttribArray(webgl.positionAttributeLocation);
            // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
            webglContext.vertexAttribPointer(
                webgl.positionAttributeLocation,
                2,                   //size 每次迭代运行提取两个单位数据
                webglContext.FLOAT,  //type 每个单位的数据类型是32位浮点型
                false,               //normalize 不需要归一化数据
                0,                   //stride 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
                // 每次迭代运行运动多少内存到下一个数据开始点
                0                    //offset 从缓冲起始位置开始读取
            );
            webglContext.bufferData(webglContext.ARRAY_BUFFER, new Float32Array(
                [x1, y1,
                    x2, y1,
                    x1, y2,
                    x1, y2,
                    x2, y1,
                    x2, y2]
            ), webglContext.STATIC_DRAW);
            //绘制
            webglContext.drawArrays(
                webglContext.TRIANGLES, //primitiveType
                0,                      //offset
                6                       //count
            );
        }, true);
    }

    //移动弹幕函数
    function moveBulletScreenOnScreen() {
        bulletScreensOnScreen.forEach((bulletScreenOnScreen) => {
            let nowTime = option.clock();
            switch (bulletScreenOnScreen.bulletScreen.type) {
                case 0:
                    if (bulletScreenOnScreen.x > -bulletScreenOnScreen.width) {
                        bulletScreenOnScreen.x -= bulletScreenOnScreen.bulletScreen.speed * option.playSpeed / refreshRate;
                    } else {
                        if (renderMode === 'css3') div.removeChild(bulletScreenOnScreen.element);
                        return { remove: true };
                    }
                    break;
                case 1:
                    if (bulletScreenOnScreen.x < elementWidth) {
                        bulletScreenOnScreen.x += bulletScreenOnScreen.bulletScreen.speed * option.playSpeed / refreshRate;
                    } else {
                        if (renderMode === 'css3') div.removeChild(bulletScreenOnScreen.element);
                        return { remove: true };
                    }
                    break;
                case 2:
                case 3:
                    if (bulletScreenOnScreen.endTime < nowTime) {
                        if (renderMode === 'css3') div.removeChild(bulletScreenOnScreen.element);
                        return { remove: true };
                    }
                    break;
            }
        }, true);
    }

    //添加弹幕到屏幕函数
    function addBulletScreensToScreen() {
        if (bulletScreensOnScreen.getLength() == 0) delay = 0;
        let times = refreshRate > 0.02 ? Math.ceil(1 / refreshRate) : 1;
        do {
            let bulletScreen = bulletScreens.pop(false, false);
            if (bulletScreen == null) return;
            let nowTime = option.clock();
            if (bulletScreen.startTime > nowTime) return;
            if (!option.timeOutDiscard || !bulletScreen.canDiscard || bulletScreen.startTime > nowTime - 1 / refreshRate * 1.5)
                getBulletScreenOnScreen(nowTime, bulletScreen); //生成屏幕弹幕对象并添加到屏幕弹幕集合
            else
                delayBulletScreensCount++;
            bulletScreens.pop(true, false);
            times--;
        } while (bulletScreensOnScreen.getLength() == 0 || times > 0)
    }

    //CSS3:创建弹幕元素
    function creatBulletScreenDiv(bulletScreenOnScreen) {
        let bulletScreen = bulletScreenOnScreen.bulletScreen;
        let element = document.createElement('div');
        element.style.position = 'absolute';
        element.style.whiteSpace = 'nowrap';
        element.style.fontWeight = option.fontWeight;
        element.style.fontSize = bulletScreenOnScreen.size.toString() + 'px';
        element.style.fontFamily = option.fontFamily;
        element.style.lineHeight = bulletScreenOnScreen.size.toString() + 'px';
        element.style.textShadow = '0 0 ' + option.shadowBlur.toString() + 'px black';
        if (bulletScreen.color == null) element.style.color = 'rgba(0,0,0,0)';
        else element.style.color = bulletScreen.color;
        if (bulletScreen.borderColor != null) {
            element.style.webkitTextStroke = '0.5px';
            element.style.webkitTextStrokeColor = bulletScreen.borderColor;
        }
        if (bulletScreen.boxColor != null) {
            element.style.padding = '3px';
            element.style.border = '1px solid';
            element.style.borderColor = bulletScreen.boxColor;
        } else {
            element.style.padding = '4px';
        }
        element.innerText = bulletScreen.text;
        element.bulletScreen = bulletScreen;
        div.appendChild(element);
        return element;
    }

    //Canvas:创建弹幕画布
    function creatBulletScreenHideCanvas(bulletScreenOnScreen) {
        let hideCanvas = document.createElement('canvas');
        hideCanvas.width = bulletScreenOnScreen.width + 8;
        hideCanvas.height = bulletScreenOnScreen.height + 8;
        let hideCanvasContext = hideCanvas.getContext('2d');
        hideCanvasContext.textBaseline = 'top';
        hideCanvasContext.shadowColor = 'black';
        hideCanvasContext.font = option.fontWeight + ' ' + bulletScreenOnScreen.size.toString() + 'px ' + option.fontFamily;
        if (bulletScreenOnScreen.bulletScreen.color != null) {
            hideCanvasContext.shadowBlur = option.shadowBlur + 0.5;
            hideCanvasContext.fillStyle = bulletScreenOnScreen.bulletScreen.color;
            hideCanvasContext.fillText(bulletScreenOnScreen.bulletScreen.text, 4, 4);
        }
        if (bulletScreenOnScreen.bulletScreen.borderColor != null) {
            hideCanvasContext.shadowBlur = 0;
            hideCanvasContext.lineWidth = 0.5;
            hideCanvasContext.strokeStyle = bulletScreenOnScreen.bulletScreen.borderColor;
            hideCanvasContext.strokeText(bulletScreenOnScreen.bulletScreen.text, 4, 4);
        }
        if (bulletScreenOnScreen.bulletScreen.boxColor != null) {
            hideCanvasContext.shadowBlur = 0;
            hideCanvasContext.lineWidth = 2;
            hideCanvasContext.strokeStyle = bulletScreenOnScreen.BulletScreen.boxColor;
            hideCanvasContext.strokeRect(0, 0, bulletScreenOnScreen.width + 8, bulletScreenOnScreen.height + 8);
        }
        return hideCanvas;
    }

    //WebGL：创建弹幕纹理
    function creatBulletScreenHideTexture2D(bulletScreenOnScreen) {
        let _canvas = creatBulletScreenHideCanvas(bulletScreenOnScreen);
        let webglContext = webgl.webglContext;
        let texture = webglContext.createTexture();
        webglContext.bindTexture(webglContext.TEXTURE_2D, texture);
        // 设置参数
        webglContext.texParameteri(webglContext.TEXTURE_2D, webglContext.TEXTURE_MIN_FILTER, webglContext.NEAREST);
        webglContext.texParameteri(webglContext.TEXTURE_2D, webglContext.TEXTURE_MAG_FILTER, webglContext.NEAREST);
        webglContext.texParameteri(webglContext.TEXTURE_2D, webglContext.TEXTURE_WRAP_S, webglContext.CLAMP_TO_EDGE);
        webglContext.texParameteri(webglContext.TEXTURE_2D, webglContext.TEXTURE_WRAP_T, webglContext.CLAMP_TO_EDGE);

        webglContext.texImage2D(webglContext.TEXTURE_2D, 0, webglContext.RGBA, webglContext.RGBA, webglContext.UNSIGNED_BYTE, _canvas);
        return texture;
    }

    //生成屏幕弹幕对象函数
    function getBulletScreenOnScreen(nowTime, bulletScreen) {
        delay = nowTime - bulletScreen.startTime;
        let bulletScreenOnScreen = {};
        bulletScreenOnScreen.bulletScreen = bulletScreen;
        bulletScreenOnScreen.startTime = nowTime; //弹幕头部进屏幕时间
        bulletScreenOnScreen.size = bulletScreenOnScreen.bulletScreen.size * option.scaling;
        bulletScreenOnScreen.height = bulletScreenOnScreen.size; //弹幕的高度：像素
        if (renderMode === 'css3') {
            bulletScreenOnScreen.element = creatBulletScreenDiv(bulletScreenOnScreen); //创建Div
            bulletScreenOnScreen.width = bulletScreenOnScreen.element.clientWidth - 8; //弹幕的宽度：像素
        }
        else if (renderMode === 'canvas' || renderMode === 'webgl') {
            //计算宽度
            let hideCanvas = document.createElement('canvas');
            let hideCanvasContext = hideCanvas.getContext('2d');
            hideCanvasContext.font = option.fontWeight + ' ' + bulletScreenOnScreen.size.toString() + 'px ' + option.fontFamily;
            bulletScreenOnScreen.width = hideCanvasContext.measureText(bulletScreen.text).width; //弹幕的宽度：像素
            if (renderMode === 'canvas')
                bulletScreenOnScreen.hideCanvas = creatBulletScreenHideCanvas(bulletScreenOnScreen); //创建Canvas
            else
                bulletScreenOnScreen.texture2D = creatBulletScreenHideTexture2D(bulletScreenOnScreen); //创建Texture2D
        }
        bulletScreenOnScreen.endTime = parseInt(nowTime + (elementWidth + bulletScreenOnScreen.width) / (bulletScreen.speed * option.playSpeed)); //弹幕尾部出屏幕的时间
        switch (bulletScreen.type) {
            case 0:
                bulletScreenOnScreen.endTime = parseInt(nowTime + (elementWidth + bulletScreenOnScreen.width) / (bulletScreen.speed * option.playSpeed)); //弹幕尾部出屏幕的时间
                bulletScreenOnScreen.x = elementWidth; //弹幕初始X坐标
                bulletScreenOnScreen.y = option.verticalInterval * option.scaling; //弹幕初始Y坐标
                break;
            case 1:
                bulletScreenOnScreen.endTime = parseInt(nowTime + (elementWidth + bulletScreenOnScreen.width) / (bulletScreen.speed * option.playSpeed)); //弹幕尾部出屏幕的时间
                bulletScreenOnScreen.x = -bulletScreenOnScreen.width; //弹幕初始X坐标
                bulletScreenOnScreen.y = option.verticalInterval * option.scaling; //弹幕初始Y坐标
                break;
            case 2:
                bulletScreenOnScreen.endTime = bulletScreenOnScreen.startTime + bulletScreen.residenceTime;
                bulletScreenOnScreen.x = parseInt((elementWidth - bulletScreenOnScreen.width) / 2); //弹幕初始X坐标
                bulletScreenOnScreen.y = option.verticalInterval * option.scaling; //弹幕初始Y坐标
                break;
            case 3:
                bulletScreenOnScreen.endTime = bulletScreenOnScreen.startTime + bulletScreen.residenceTime;
                bulletScreenOnScreen.x = parseInt((elementWidth - bulletScreenOnScreen.width) / 2); //弹幕初始X坐标
                bulletScreenOnScreen.y = - option.verticalInterval * option.scaling - bulletScreenOnScreen.height; //弹幕初始Y坐标
                break;
        }
        let oldLength = bulletScreensOnScreen.getLength();
        if (bulletScreen.type > 1) {
            bulletScreensOnScreen.forEach((nextBulletScreenOnScreen) => {
                //弹幕不在流中，是固定弹幕
                if (nextBulletScreenOnScreen.bulletScreen.type != bulletScreen.type) return; //不是同一种类型的弹幕
                if (bulletScreen.type == 2) {
                    //如果新弹幕在当前弹幕上方且未与当前弹幕重叠
                    if (bulletScreenOnScreen.y + bulletScreenOnScreen.height < nextBulletScreenOnScreen.y)
                        return { add: { addToUp: true, element: setActualY(bulletScreenOnScreen) }, stop: true };
                    //如果上一条弹幕的消失时间小于当前弹幕的出现时间
                    if (nextBulletScreenOnScreen.endTime < nowTime) bulletScreenOnScreen.y = nextBulletScreenOnScreen.y;
                    else bulletScreenOnScreen.y = nextBulletScreenOnScreen.y + nextBulletScreenOnScreen.height + option.verticalInterval * option.scaling;
                } else {
                    //如果新弹幕在当前弹幕下方且未与当前弹幕重叠
                    if (bulletScreenOnScreen.y > nextBulletScreenOnScreen.y + nextBulletScreenOnScreen.height) {
                        return { add: { addToUp: true, element: setActualY(bulletScreenOnScreen) }, stop: true };
                    }
                    //如果上一条弹幕的消失时间小于当前弹幕的出现时间
                    if (nextBulletScreenOnScreen.endTime < nowTime) bulletScreenOnScreen.y = nextBulletScreenOnScreen.y;
                    else bulletScreenOnScreen.y = nextBulletScreenOnScreen.y - bulletScreenOnScreen.height - option.verticalInterval * option.scaling;
                }
            }, true);
        } else {
            //当前弹幕经过一个点需要的总时长
            let bulletScreenOnScreenWidthTime = bulletScreenOnScreen.width / (bulletScreenOnScreen.bulletScreen.speed * option.playSpeed);
            bulletScreensOnScreen.forEach((nextBulletScreenOnScreen) => {
                //弹幕在流中，是移动弹幕
                if (nextBulletScreenOnScreen.bulletScreen.type > 1) return; //弹幕不在流中，为固定弹幕
                //如果新弹幕在当前弹幕上方且未与当前弹幕重叠
                if (bulletScreenOnScreen.y + bulletScreenOnScreen.height < nextBulletScreenOnScreen.y)
                    return { add: { addToUp: true, element: setActualY(bulletScreenOnScreen) }, stop: true };
                //上一条弹幕经过一个点需要的总时长
                let nextBulletScreenOnScreenWidthTime = nextBulletScreenOnScreen.width / (nextBulletScreenOnScreen.bulletScreen.speed * option.playSpeed);
                //如果上一条弹幕的消失时间小于当前弹幕的出现时间
                if (nextBulletScreenOnScreen.startTime + nextBulletScreenOnScreenWidthTime >= nowTime || //如果上一条弹幕的头进入了，但是尾还没进入
                    nextBulletScreenOnScreen.endTime >= bulletScreenOnScreen.endTime - bulletScreenOnScreenWidthTime) //如果当前弹幕头出去了，上一条弹幕尾还没出去
                    bulletScreenOnScreen.y = nextBulletScreenOnScreen.y + nextBulletScreenOnScreen.height + option.verticalInterval * option.scaling;
                else bulletScreenOnScreen.y = nextBulletScreenOnScreen.y;
            }, true);
        }
        if (bulletScreensOnScreen.getLength() == oldLength) bulletScreensOnScreen.push(setActualY(bulletScreenOnScreen), false);
    }

    //设置真实的Y坐标
    function setActualY(bulletScreenOnScreen) {
        let bulletScreen = bulletScreenOnScreen.bulletScreen;
        if (bulletScreen.type < 3) {
            bulletScreenOnScreen.actualY = bulletScreenOnScreen.y % (elementHeight - bulletScreenOnScreen.height);
        } else if (bulletScreen.type == 3) {
            bulletScreenOnScreen.actualY = elementHeight + bulletScreenOnScreen.y % elementHeight;
        }
        return bulletScreenOnScreen;
    }

    //添加Canvas
    function initCanvas(element) {
        let canvas = document.createElement('canvas'); //canvas对象
        canvas.style.width = elementWidth + 'px';
        canvas.style.height = elementHeight + 'px';
        canvas.style.position = 'relative';
        canvas.width = elementWidth;
        canvas.height = elementHeight;
        registerEvent(canvas, false); //注册事件响应程序
        element.innerHTML = '';
        element.appendChild(canvas);
        return canvas;
    }

    //添加WebGL Canvas
    function initWebGLCanvas(element) {
        // 创建着色器方法，输入参数：渲染上下文，着色器类型，数据源
        let createShader = function (gl, type, source) {
            let shader = gl.createShader(type); // 创建着色器对象
            gl.shaderSource(shader, source); // 提供数据源
            gl.compileShader(shader); // 编译 -> 生成着色器
            let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (success) {
                return shader;
            }
            gl.deleteShader(shader);
        }
        // 创建着色程序，输入参数：渲染上下文，顶点着色器，片段着色器
        let createProgram = function (gl, vertexShader, fragmentShader) {
            let program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            let success = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (success) {
                return program;
            }
            gl.deleteProgram(program);
        }
        //顶点着色器代码
        let vertexShaderSource = 'attribute vec2 a_position;';
        vertexShaderSource += 'attribute vec2 a_texcoord;';
        vertexShaderSource += 'uniform vec2 u_resolution;';
        vertexShaderSource += 'varying vec2 v_texcoord;';
        vertexShaderSource += 'void main() {';
        // 从像素坐标转换到 0.0 到 1.0
        vertexShaderSource += 'vec2 zeroToOne = a_position / u_resolution;';
        // 再把 0->1 转换 0->2
        vertexShaderSource += 'vec2 zeroToTwo = zeroToOne * 2.0;';
        // 把 0->2 转换到 -1->+1 (裁剪空间)
        vertexShaderSource += 'vec2 clipSpace = zeroToTwo - 1.0;';
        vertexShaderSource += 'gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);';
        // 传递纹理坐标到片断着色器
        vertexShaderSource += 'v_texcoord = a_texcoord;';
        vertexShaderSource += '}';

        //片段着色器代码
        let fragmentShaderSource = 'precision mediump float;';
        // 从顶点着色器中传入的值
        fragmentShaderSource += 'varying vec2 v_texcoord;';
        // 纹理
        fragmentShaderSource += 'uniform sampler2D u_texture;';
        fragmentShaderSource += 'void main() {';
        fragmentShaderSource += 'gl_FragColor = texture2D(u_texture, v_texcoord);';
        fragmentShaderSource += '}';

        let canvas = initCanvas(element);
        let webglContext = canvas.getContext('webgl');
        webglContext.enable(webglContext.BLEND); //开启混合功能
        webglContext.clearColor(0, 0, 0, 0); //设置清除颜色
        webglContext.blendFunc(webglContext.SRC_ALPHA, webglContext.ONE_MINUS_SRC_ALPHA);
        let vertexShader = createShader(webglContext, webglContext.VERTEX_SHADER, vertexShaderSource); //创建顶点着色器
        let fragmentShader = createShader(webglContext, webglContext.FRAGMENT_SHADER, fragmentShaderSource); //创建片段着色器
        let program = createProgram(webglContext, vertexShader, fragmentShader); //创建着色程序
        webglContext.useProgram(program);
        let positionAttributeLocation = webglContext.getAttribLocation(program, 'a_position');
        let texcoordAttributeLocation = webglContext.getAttribLocation(program, 'a_texcoord');
        let resolutionUniformLocation = webglContext.getUniformLocation(program, 'u_resolution');

        webglContext.viewport(0, 0, elementWidth, elementHeight);
        webglContext.uniform2f(resolutionUniformLocation, elementWidth, elementHeight); // 设置全局变量 分辨率
        //绑定范围
        let texcoordBuffer = webglContext.createBuffer();
        // 将绑定点绑定到缓冲数据（texcoordBuffer）
        webglContext.bindBuffer(webglContext.ARRAY_BUFFER, texcoordBuffer);
        webglContext.enableVertexAttribArray(texcoordAttributeLocation);
        // 以浮点型格式传递纹理坐标
        webglContext.vertexAttribPointer(
            texcoordAttributeLocation,
            2,                   //size 每次迭代运行提取两个单位数据
            webglContext.FLOAT,  //type 每个单位的数据类型是32位浮点型
            false,               //normalize 不需要归一化数据 
            0,                   //stride 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
            // 每次迭代运行运动多少内存到下一个数据开始点
            0                    //offset 从缓冲起始位置开始读取
        );
        webglContext.bufferData(webglContext.ARRAY_BUFFER, new Float32Array(
            [0, 0,
                1, 0,
                0, 1,
                0, 1,
                1, 0,
                1, 1]
        ), webglContext.STATIC_DRAW);
        return {
            canvas: canvas,
            positionAttributeLocation: positionAttributeLocation,
            resolutionUniformLocation: resolutionUniformLocation,
            webglContext: webglContext
        };
    }

    //添加DIV
    function initDIV(element) {
        let div = document.createElement('div'); //DIV
        div.style.width = elementWidth + 'px';
        div.style.height = elementHeight + 'px';
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

    //注册事件响应程序
    function registerEvent(element, css3) {
        function getBulletScreenOnScreenByLocation(location) {
            let bulletScreen = null;
            bulletScreensOnScreen.forEach(function (bulletScreenOnScreen) {
                let x1 = bulletScreenOnScreen.x - 4;
                let x2 = x1 + bulletScreenOnScreen.width + 8;
                let y1 = bulletScreenOnScreen.actualY - 4;
                let y2 = y1 + bulletScreenOnScreen.height + 8;
                if (location.x >= x1 && location.x <= x2 && location.y >= y1 && location.y <= y2) {
                    bulletScreen = bulletScreenOnScreen.bulletScreen;
                    return { stop: true }
                }
            }, false);
            return bulletScreen;
        }
        function getLocation(e) {
            function getOffsetTop(element) {
                let offsetTop = 0;
                do { offsetTop += element.offsetTop; }
                while ((element = element.offsetParent) != null)
                return offsetTop;
            }
            function getOffsetLeft(element) {
                let offsetLeft = 0;
                do { offsetLeft += element.offsetLeft; }
                while ((element = element.offsetParent) != null)
                return offsetLeft;
            }

            if (typeof (e.offsetX) === 'undefined' || e.offsetX === null) {
                if (typeof (e.layerX) === 'undefined' || e.layerX === null) {
                    if (typeof (e.pageX) === 'undefined' || e.pageX === null) {
                        let doc = document.documentElement, body = document.body;
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
            }
        }
        if (css3) {
            //上下文菜单
            element.oncontextmenu = function (e) {
                if (e.target != this) event.trigger('contextmenu', {
                    bulletScreen: e.target.bulletScreen
                });
                return false;
            }
            //单击
            element.onclick = function (e) {
                if (e.target != this) event.trigger('click', {
                    bulletScreen: e.target.bulletScreen
                });
                return false;
            }
        } else {
            //上下文菜单
            element.oncontextmenu = function (e) {
                let bulletScreen = getBulletScreenOnScreenByLocation(getLocation(e));
                if (bulletScreen) event.trigger('contextmenu', {
                    bulletScreen: bulletScreen
                });
                return false;
            }
            //单击
            element.onclick = function (e) {
                let bulletScreen = getBulletScreenOnScreenByLocation(getLocation(e));
                if (bulletScreen) event.trigger('click', {
                    bulletScreen: bulletScreen
                });
                return false;
            }
        }
    }

    //设置尺寸
    function setSize() {
        if (elementWidth != element.clientWidth ||
            elementHeight != element.clientHeight) {
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
}
export { BulletScreenEngine }