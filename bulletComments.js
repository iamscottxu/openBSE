//弹幕对象（参数：加载到的元素，选项, 渲染模式：默认为css3, 可选canvas）
let BulletComments = function (element, option, renderMode = "css3") {
    //变量初始化
    let startTime; //开始时间
    let pauseTime = 0; //暂停时间
    let bulletComments = new LinkedList(), bulletCommentsOnScreen = new LinkedList(); //剩余弹幕，屏幕上的弹幕
    let delayBulletCommentsCount = 0; //延迟弹幕总数
    let delay = 0; //延迟（单位：毫秒）
    let playing; //播放标志
    let refreshRate = 0.06; //初始刷新频率
    let lastRefreshTime; //上一次刷新时间
    let hide = false; //隐藏弹幕

    //默认参数
    option = setValue(option, new Object());
    option.verticalInterval = setValue(option.verticalInterval, 8); //垂直间距
    option.playSpeed = setValue(option.playSpeed, 1); //播放速度倍数
    option.clock = setValue(option.clock, time => new Date().getTime() - startTime); //时间基准
    option.shadowBlur = setValue(option.shadowBlur, 2); //阴影的模糊级别，0为不显示阴影
    option.scaling = setValue(option.scaling, 1); //缩放比例
    option.timeOutDiscard = setValue(option.timeOutDiscard, true); //超时丢弃
    this.option = option;

    //初始化
    let canvas;
    let div;
    let elementWidth = element.clientWidth;
    let elementHeight = element.clientHeight
    if (renderMode == "css3") div = initDIV(element); //添加DIV
    else canvas = initCanvas(element); //添加canvas

    setInterval(setSize, 100);

    //公共函数
    //添加弹幕
    this.addBulletComment = function (bulletComment) {
        bulletComment = setValue(bulletComment, new Object());
        bulletComment.uuid = setValue(''); //uuid
        bulletComment.text = setValue(bulletComment.text, '空弹幕'); //弹幕文本
        bulletComment.boxColor = setValue(bulletComment.boxColor, null); //方框颜色
        bulletComment.speed = setValue(bulletComment.speed, 0.15); //弹幕速度（单位：像素/毫秒） 仅类型0、1有效
        bulletComment.size = setValue(bulletComment.size, 19); //字体大小（单位：像素）
        bulletComment.color = setValue(bulletComment.color, null); //字体颜色
        bulletComment.borderColor = setValue(bulletComment.borderColor, null); //边框颜色
        bulletComment.type = setValue(bulletComment.type, 0); //类型：0：从右到左 1:从左到右 2:顶部固定 3:底部固定
        bulletComment.startTime = setValue(bulletComment.startTime, option.clock()); //弹幕进入时间
        bulletComment.residenceTime = setValue(bulletComment.endTime, 5000); //弹幕停留时间 仅类型2、3有效
        bulletComment.canDiscard = setValue(bulletComment.canDiscard, true); //是否允许丢弃
        if (bulletComment.type <= 3) {
            let oldLength = bulletComments.getLength();
            bulletComments.forEach(function (lastBulletComment) {
                if (bulletComment.startTime > lastBulletComment.startTime)
                    return {
                        add: {
                            addToUp: true,
                            element: bulletComment
                        },
                        stop: true
                    }
            }, true)
            if (oldLength == bulletComments.getLength()) bulletComments.push(bulletComment, false);
        }
    }

    //开始播放函数
    this.play = function () {
        if (!playing) {
            if (!startTime) startTime = new Date().getTime();
            if (pauseTime) startTime += option.clock() - pauseTime;
            lastRefreshTime = null;
            playing = true;
            stop = false;
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
    this.cleanBulletCommentList = function () {
        bulletComments.clean();
    }

    //清空屏幕弹幕
    this.cleanBulletCommentListOnScreen = function () {
        bulletCommentsOnScreen.clean();
        if (div) div.innerHTML = '';
    }

    //停止播放函数
    this.stop = function () {
        if (playing) {
            this.pause();
        }
        pauseTime = 0;
        startTime = null;
        this.cleanBulletCommentList();
        this.cleanBulletCommentListOnScreen();
        //重新加载
        if (renderMode === 'css3') div = initDIV(element); //添加DIV
        else if (renderMode === 'canvas' || renderMode === 'webgl') canvas = initCanvas(element); //添加canvas
    }

    //隐藏弹幕
    this.hide = function () {
        hide = true;
        if (canvas) canvas.style.visibility = "hidden";
        else div.style.visibility = "hidden";
    }

    //显示弹幕
    this.show = function () {
        hide = false;
        if (canvas) canvas.style.visibility = "visible";
        else div.style.visibility = "visible";
    }

    //获取可见性
    this.getVisibility = function () {
        return !hide;
    }

    //获取播放状态
    this.getPlayState = function () {
        return playing;
    }

    this.getDebugInfo = function () {
        return {
            time: playing ? option.clock() : pauseTime,
            bulletCommentsOnScreenCount: bulletCommentsOnScreen.getLength(), //实时弹幕总数
            bulletCommentsCount: bulletComments.getLength(), //剩余弹幕总数
            delay: delay, //延迟（单位：毫秒）
            delayBulletCommentsCount: delayBulletCommentsCount, //延迟弹幕总数
            fps: playing ? parseInt(refreshRate * 1000) : 0 //帧频
        }
    }

    //内部函数
    function setValue(value, defaultBalue) {
        if (typeof (value) == 'undefined') return defaultBalue;
        if (typeof (value) == 'number' && isNaN(value)) return defaultBalue;
        if (value == null) return defaultBalue;
        return value;
    }
    //刷新弹幕函数
    function refresh() {
        let nowTime = new Date().getTime();
        if (lastRefreshTime != null) refreshRate = 1 / (nowTime - lastRefreshTime);
        lastRefreshTime = nowTime;
        addBulletCommentsToScreen();
        moveBulletCommentOnScreen();
        if (renderMode === 'css3') drawOnTheDIV();
        else if (renderMode === 'canvas') drawOnTheCanvas();
        else if (renderMode === 'webgl') drawOnTheWebGLCanvas();
        if (playing) requestAnimationFrame(refresh);
    }

    //绘制函数CSS3
    function drawOnTheDIV() {
        bulletCommentsOnScreen.forEach((bulletCommentOnScreen) => {
            bulletCommentOnScreen.element.style.transform =
                'translate(' + (bulletCommentOnScreen.x - 4) + 'px,' + (bulletCommentOnScreen.actualY - 4) + 'px)';
        }, true);
    }

    //绘制函数Canvas
    function drawOnTheCanvas() {
        //离屏渲染
        let hideCanvas = document.createElement('canvas');
        hideCanvas.width = canvas.width;
        hideCanvas.height = canvas.height;
        let hideCanvasContext = hideCanvas.getContext("2d");
        bulletCommentsOnScreen.forEach((bulletCommentOnScreen) => {
            hideCanvasContext.drawImage(bulletCommentOnScreen.hideCanvas, bulletCommentOnScreen.x - 4, bulletCommentOnScreen.actualY - 4);
        }, true);

        let canvasContext = canvas.getContext("2d");
        canvasContext.clearRect(0, 0, elementWidth, elementHeight);
        canvasContext.drawImage(hideCanvas, 0, 0);
    }

    //绘制函数WebGL Canvas
    function drawOnTheWebGLCanvas() {
        let webglContext = canvas.getContext("webgl");
        webglContext.clear(webglContext.COLOR_BUFFER_BIT | webglContext.DEPTH_BUFFER_BIT);
        bulletCommentsOnScreen.forEach((bulletCommentOnScreen) => {
            webglContext.textBaseline = "top";
            webglContext.shadowColor = "black";
            webglContext.font = "700 " + bulletCommentOnScreen.size + "px sans-serif";
            if (bulletCommentOnScreen.bulletComment.color != null) {
                webglContext.shadowBlur = option.shadowBlur + 0.5;
                webglContext.fillStyle = bulletCommentOnScreen.bulletComment.color;
                webglContext.fillText(bulletCommentOnScreen.bulletComment.text, bulletCommentOnScreen.x, bulletCommentOnScreen.actualY);
            }
            if (bulletCommentOnScreen.bulletComment.borderColor != null) {
                webglContext.shadowBlur = 0;
                webglContext.lineWidth = 0.5;
                webglContext.strokeStyle = bulletCommentOnScreen.bulletComment.borderColor;
                webglContext.strokeText(bulletCommentOnScreen.bulletComment.text, bulletCommentOnScreen.x, bulletCommentOnScreen.actualY);
            }
            if (bulletCommentOnScreen.bulletComment.boxColor != null) {
                webglContext.shadowBlur = 0;
                webglContext.lineWidth = 1;
                webglContext.strokeStyle = bulletCommentOnScreen.bulletComment.boxColor;
                webglContext.strokeRect(bulletCommentOnScreen.x - 4, bulletCommentOnScreen.actualY - 4,
                    bulletCommentOnScreen.width + 8, bulletCommentOnScreen.height + 8);
            }

        }, true);
    }

    //移动弹幕函数
    function moveBulletCommentOnScreen() {
        bulletCommentsOnScreen.forEach((bulletCommentOnScreen) => {
            let nowTime = option.clock();
            switch (bulletCommentOnScreen.bulletComment.type) {
                case 0:
                    if (bulletCommentOnScreen.x > -bulletCommentOnScreen.width) {
                        bulletCommentOnScreen.x -= bulletCommentOnScreen.bulletComment.speed * option.playSpeed / refreshRate;
                    } else {
                        if (canvas == null) div.removeChild(bulletCommentOnScreen.element);
                        return { remove: true };
                    }
                    break;
                case 1:
                    if (bulletCommentOnScreen.x < elementWidth) {
                        bulletCommentOnScreen.x += bulletCommentOnScreen.bulletComment.speed * option.playSpeed / refreshRate;
                    } else {
                        if (canvas == null) div.removeChild(bulletCommentOnScreen.element);
                        return { remove: true };
                    }
                    break;
                case 2:
                case 3:
                    if (bulletCommentOnScreen.endTime < nowTime) {
                        if (canvas == null) div.removeChild(bulletCommentOnScreen.element);
                        return { remove: true };
                    }
                    break;
            }
        }, true);
    }

    //添加弹幕到屏幕函数
    function addBulletCommentsToScreen() {
        if (bulletCommentsOnScreen.getLength() == 0) delay = 0;
        let times = refreshRate > 0.02 ? Math.ceil(1 / refreshRate) : 1;
        do {
            let bulletComment = bulletComments.pop(false, false);
            if (bulletComment == null) return;
            let nowTime = option.clock();
            if (bulletComment.startTime > nowTime) return;
            if (!option.timeOutDiscard || !bulletComment.canDiscard || bulletComment.startTime > nowTime - 1 / refreshRate * 1.5)
                getBulletCommentOnScreen(nowTime, bulletComment); //生成屏幕弹幕对象并添加到屏幕弹幕集合
            else
                delayBulletCommentsCount++;
            bulletComments.pop(true, false);
            times--;
        } while (bulletCommentsOnScreen.getLength() == 0 || times > 0)
    }

    //CSS3:创建弹幕元素
    function creatBulletCommentDiv(bulletCommentOnScreen) {
        let bulletComment = bulletCommentOnScreen.bulletComment;
        let element = document.createElement('div');
        element.className = "bulletCommentDiv";
        element.setAttribute('data-uuid', bulletComment.uuid);
        element.style.position = 'absolute';
        element.style.webkitUserSelect = 'none';
        element.style.whiteSpace = 'nowrap';
        element.style.font = '700 ' + bulletCommentOnScreen.size.toString() + 'px sans-serif';
        element.style.lineHeight = bulletCommentOnScreen.size.toString() + 'px';
        element.style.padding = '3px';
        element.style.textShadow = '0 0 ' + option.shadowBlur.toString() + 'px black';
        if (bulletComment.color == null) element.style.color = 'rgba(0,0,0,0)';
        else element.style.color = bulletComment.color;
        if (bulletComment.borderColor != null) {
            element.style.webkitTextStroke = '0.5px';
            element.style.webkitTextStrokeColor = bulletComment.borderColor;
        }
        if (bulletComment.boxColor != null) {
            element.style.border = '1px solid';
            element.style.borderColor = bulletComment.boxColor;
        }
        element.innerText = bulletComment.text;
        div.appendChild(element);
        return element;
    }

    //Canvas:创建弹幕画布
    function creatBulletCommentHideCanvas(bulletCommentOnScreen) {
        let hideCanvas = document.createElement('canvas');
        hideCanvas.width = bulletCommentOnScreen.width + 8;
        hideCanvas.height = bulletCommentOnScreen.height + 8;
        let hideCanvasContext = hideCanvas.getContext("2d");
        hideCanvasContext.textBaseline = "top";
        hideCanvasContext.shadowColor = "black";
        hideCanvasContext.font = "700 " + bulletCommentOnScreen.size + "px sans-serif";
        if (bulletCommentOnScreen.bulletComment.color != null) {
            hideCanvasContext.shadowBlur = option.shadowBlur + 0.5;
            hideCanvasContext.fillStyle = bulletCommentOnScreen.bulletComment.color;
            hideCanvasContext.fillText(bulletCommentOnScreen.bulletComment.text, 4, 4);
        }
        if (bulletCommentOnScreen.bulletComment.borderColor != null) {
            hideCanvasContext.shadowBlur = 0;
            hideCanvasContext.lineWidth = 0.5;
            hideCanvasContext.strokeStyle = bulletCommentOnScreen.bulletComment.borderColor;
            hideCanvasContext.strokeText(bulletCommentOnScreen.bulletComment.text, 4, 4);
        }
        if (bulletCommentOnScreen.bulletComment.boxColor != null) {
            hideCanvasContext.shadowBlur = 0;
            hideCanvasContext.lineWidth = 2;
            hideCanvasContext.strokeStyle = bulletCommentOnScreen.bulletComment.boxColor;
            hideCanvasContext.strokeRect(0, 0, bulletCommentOnScreen.width + 8, bulletCommentOnScreen.height + 8);
        }
        return hideCanvas;
    }

    //生成屏幕弹幕对象函数
    function getBulletCommentOnScreen(nowTime, bulletComment) {
        delay = nowTime - bulletComment.startTime;
        let bulletCommentOnScreen = new Object();
        bulletCommentOnScreen.bulletComment = bulletComment;
        bulletCommentOnScreen.startTime = nowTime; //弹幕头部进屏幕时间
        bulletCommentOnScreen.size = bulletCommentOnScreen.bulletComment.size * option.scaling;
        bulletCommentOnScreen.height = bulletCommentOnScreen.size; //弹幕的高度：像素
        if (renderMode === 'css3') {
            bulletCommentOnScreen.element = creatBulletCommentDiv(bulletCommentOnScreen); //创建Div
            bulletCommentOnScreen.width = bulletCommentOnScreen.element.clientWidth - 8; //弹幕的宽度：像素
        }
        else if (renderMode === 'canvas' || renderMode === 'webgl') {
            //计算宽度
            let canvasContext = canvas.getContext("2d");
            canvasContext.font = "700 " + bulletCommentOnScreen.size + "px sans-serif";
            bulletCommentOnScreen.width = canvasContext.measureText(bulletComment.text).width; //弹幕的宽度：像素
            bulletCommentOnScreen.hideCanvas = creatBulletCommentHideCanvas(bulletCommentOnScreen); //创建Canvas
        }
        bulletCommentOnScreen.endTime = parseInt(nowTime + (elementWidth + bulletCommentOnScreen.width) / (bulletComment.speed * option.playSpeed)); //弹幕尾部出屏幕的时间
        switch (bulletComment.type) {
            case 0:
                bulletCommentOnScreen.endTime = parseInt(nowTime + (elementWidth + bulletCommentOnScreen.width) / (bulletComment.speed * option.playSpeed)); //弹幕尾部出屏幕的时间
                bulletCommentOnScreen.x = elementWidth; //弹幕初始X坐标
                bulletCommentOnScreen.y = option.verticalInterval; //弹幕初始Y坐标
                break;
            case 1:
                bulletCommentOnScreen.endTime = parseInt(nowTime + (elementWidth + bulletCommentOnScreen.width) / (bulletComment.speed * option.playSpeed)); //弹幕尾部出屏幕的时间
                bulletCommentOnScreen.x = -bulletCommentOnScreen.width; //弹幕初始X坐标
                bulletCommentOnScreen.y = option.verticalInterval; //弹幕初始Y坐标
                break;
            case 2:
                bulletCommentOnScreen.endTime = bulletCommentOnScreen.startTime + bulletComment.residenceTime;
                bulletCommentOnScreen.x = parseInt((elementWidth - bulletCommentOnScreen.width) / 2); //弹幕初始X坐标
                bulletCommentOnScreen.y = option.verticalInterval; //弹幕初始Y坐标
                break;
            case 3:
                bulletCommentOnScreen.endTime = bulletCommentOnScreen.startTime + bulletComment.residenceTime;
                bulletCommentOnScreen.x = parseInt((elementWidth - bulletCommentOnScreen.width) / 2); //弹幕初始X坐标
                bulletCommentOnScreen.y = - option.verticalInterval - bulletCommentOnScreen.height; //弹幕初始Y坐标
                break;
        }
        let oldLength = bulletCommentsOnScreen.getLength();
        if (bulletComment.type > 1) {
            bulletCommentsOnScreen.forEach((nextBulletCommentOnScreen) => {
                //弹幕不在流中，是固定弹幕
                if (nextBulletCommentOnScreen.bulletComment.type != bulletComment.type) return; //不是同一种类型的弹幕
                if (bulletComment.type == 2) {
                    //如果新弹幕在当前弹幕上方且未与当前弹幕重叠
                    if (bulletCommentOnScreen.y + bulletCommentOnScreen.height < nextBulletCommentOnScreen.y)
                        return { add: { addToUp: true, element: setActualY(bulletCommentOnScreen) }, stop: true };
                    //如果上一条弹幕的消失时间小于当前弹幕的出现时间
                    if (nextBulletCommentOnScreen.endTime < nowTime) bulletCommentOnScreen.y = nextBulletCommentOnScreen.y;
                    else bulletCommentOnScreen.y = nextBulletCommentOnScreen.y + nextBulletCommentOnScreen.height + option.verticalInterval;
                } else {
                    //如果新弹幕在当前弹幕下方且未与当前弹幕重叠
                    if (bulletCommentOnScreen.y > nextBulletCommentOnScreen.y + nextBulletCommentOnScreen.height) {
                        return { add: { addToUp: true, element: setActualY(bulletCommentOnScreen) }, stop: true };
                    }
                    //如果上一条弹幕的消失时间小于当前弹幕的出现时间
                    if (nextBulletCommentOnScreen.endTime < nowTime) bulletCommentOnScreen.y = nextBulletCommentOnScreen.y;
                    else bulletCommentOnScreen.y = nextBulletCommentOnScreen.y - bulletCommentOnScreen.height - option.verticalInterval;
                }
            }, true);
        } else {
            //当前弹幕经过一个点需要的总时长
            let bulletCommentOnScreenWidthTime = bulletCommentOnScreen.width / (bulletCommentOnScreen.bulletComment.speed * option.playSpeed);
            bulletCommentsOnScreen.forEach((nextBulletCommentOnScreen) => {
                //弹幕在流中，是移动弹幕
                if (nextBulletCommentOnScreen.bulletComment.type > 1) return; //弹幕不在流中，为固定弹幕
                //如果新弹幕在当前弹幕上方且未与当前弹幕重叠
                if (bulletCommentOnScreen.y + bulletCommentOnScreen.height < nextBulletCommentOnScreen.y)
                    return { add: { addToUp: true, element: setActualY(bulletCommentOnScreen) }, stop: true };
                //上一条弹幕经过一个点需要的总时长
                let nextBulletCommentOnScreenWidthTime = nextBulletCommentOnScreen.width / (nextBulletCommentOnScreen.bulletComment.speed * option.playSpeed);
                //如果上一条弹幕的消失时间小于当前弹幕的出现时间
                if (nextBulletCommentOnScreen.startTime + nextBulletCommentOnScreenWidthTime >= nowTime || //如果上一条弹幕的头进入了，但是尾还没进入
                    nextBulletCommentOnScreen.endTime >= bulletCommentOnScreen.endTime - bulletCommentOnScreenWidthTime) //如果当前弹幕头出去了，上一条弹幕尾还没出去
                    bulletCommentOnScreen.y = nextBulletCommentOnScreen.y + nextBulletCommentOnScreen.height + option.verticalInterval;
                else bulletCommentOnScreen.y = nextBulletCommentOnScreen.y;
            }, true);
        }
        if (bulletCommentsOnScreen.getLength() == oldLength) bulletCommentsOnScreen.push(setActualY(bulletCommentOnScreen), false);
    }

    //设置真实的Y坐标
    function setActualY(bulletCommentOnScreen) {
        let bulletComment = bulletCommentOnScreen.bulletComment;
        if (bulletComment.type < 3) {
            bulletCommentOnScreen.actualY = bulletCommentOnScreen.y % (elementHeight - bulletCommentOnScreen.height);
        } else if (bulletComment.type == 3) {
            bulletCommentOnScreen.actualY = elementHeight + bulletCommentOnScreen.y % elementHeight;
        }
        return bulletCommentOnScreen;
    }

    //添加canvas
    function initCanvas(element) {
        let canvas = document.createElement('canvas'); //canvas对象
        canvas.style.width = element.clientWidth + 'px';
        canvas.style.height = element.clientHeight + 'px';
        canvas.width = element.clientWidth;
        canvas.height = element.clientHeight;
        element.innerHTML = '';
        element.appendChild(canvas);
        return canvas;
    }

    //添加DIV
    function initDIV(element) {
        let div = document.createElement('div'); //DIV
        div.style.width = element.clientWidth + 'px';
        div.style.height = element.clientHeight + 'px';
        div.style.overflow = 'hidden';
        div.style.position = 'relative';
        div.style.padding = '0';
        div.style.margin = '0';
        element.innerHTML = '';
        element.appendChild(div);
        return div;
    }

    //设置尺寸
    function setSize() {
        if (elementWidth != element.clientWidth ||
            elementHeight != element.clientHeight) {
            elementWidth = element.clientWidth;
            elementHeight = element.clientHeight;
            if (canvas == null) {
                div.style.width = elementWidth + 'px';
                div.style.height = elementHeight + 'px';
            } else {
                canvas.style.width = elementWidth + 'px';
                canvas.style.height = elementHeight + 'px';
                canvas.width = elementWidth;
                canvas.height = elementHeight;
            }
        }
    }
}
window.BulletComments = BulletComments;