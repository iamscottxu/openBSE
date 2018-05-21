//弹幕对象（参数：加载到的元素，选项）
let BulletComments = function (element, option){
    //双向链表
    let LinkedList = function () {
        //双向链表结点
        let node = function (element) { 
            this.element = element;
            this.next = null;
            this.previous = null;
        }

        //初始化
        let topNode = new node(null);
        let bottomNode = new node(null);
        let length = 0;
        topNode.next = bottomNode;
        bottomNode.previous = topNode;

        //公共函数
        //获取元素个数
        this.getLength = l => length;

        //插入元素（参数：元素，插入到顶部或底部）
        this.push = function (element, top) {
            let thisNode = new node(element);
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
        }

        //读取元素（参数：读取后是否删除，读取顶部或底部元素）
        this.pop = function (remove, top) {
            let thisNode;
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
        }

        //清空链表
        this.clean = function(){
            topNode = new node(null);
            bottomNode = new node(null);
        }

        //遍历链表（参数：遍历回调函数，从顶到底或从底到顶）
        //回调函数（参数：元素，返回：{remove：删除此元素，stop：停止遍历}）
        this.forEach = function (fun, topToBottom) {
            let thisNode = topToBottom ? topNode : bottomNode;
            while (topToBottom ?
                (thisNode = thisNode.next) != bottomNode : (thisNode = thisNode.previous) != topNode) {
                let _return = fun(thisNode.element);
                if (_return) {
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
        }
    }

    //变量初始化
    let startTime; //开始时间
    let pauseTime = 0; //暂停时间
    let bulletComments = new LinkedList(), bulletCommentsOnScreen = new LinkedList(); //剩余弹幕，屏幕上的弹幕
    let delayBulletCommentsCount = 0; //延迟弹幕总数
    let timeOutBulletCommentsCount = 0; //超时弹幕总数
    let delay = 0; //延迟（单位：毫秒）
    let timeOut = 0; //超时（单位：毫秒）
    let refreshInterval; //播放标志
    let oldRefreshRate;

    //默认参数
    option = setValue(option, new Object());
    option.refreshRate = setValue(option.refreshRate, 0.06); //刷新频率
    option.verticalInterval = setValue(option.verticalInterval, 5); //垂直间距
    option.playSpeed = setValue(option.playSpeed, 1); //播放速度倍数
    option.clock = setValue(option.clock, time => new Date().getTime() - startTime); //时间基准
    this.option = option;

    //初始化
    //添加canvas
    let canvas = document.createElement('canvas'); //canvas对象
    canvas.style.width = canvas.style.height = '100%';
    canvas.width = element.clientWidth;
    canvas.height = element.clientHeight;
    element.innerHTML = '';
    element.appendChild(canvas);

    //公共函数
    //添加弹幕
    this.addBulletComment = function(bulletComment){
        bulletComment = setValue(bulletComment, new Object());
        bulletComment.text = setValue(bulletComment.text, '空弹幕'); //弹幕文本
        bulletComment.speed = setValue(bulletComment.speed, 0.15); //弹幕速度（单位：像素/毫秒）
        bulletComment.size = setValue(bulletComment.size, 19); //字体大小（单位：像素）
        bulletComment.color = setValue(bulletComment.color, 'white'); //字体颜色
        bulletComment.borderCorol = setValue(bulletComment.borderCorol, 'black'); //边框颜色
        bulletComment.rightToLeft = setValue(bulletComment.rightToLeft, true); //从右到左或从左到右
        bulletComment.startTime = setValue(bulletComment.startTime, option.clock()); //弹幕进入时间
        bulletComments.push(bulletComment, true);
    }
    
    //开始播放函数
    this.play = function () {
        if (!refreshInterval){
            if (!startTime) startTime = new Date().getTime();
            if (pauseTime) startTime += option.clock() - pauseTime;
            oldRefreshRate = option.refreshRate;
            refreshInterval = setInterval(refresh, 1 / option.refreshRate);
        }
    }

    //暂停播放函数
    this.pause = function() {
        if (refreshInterval){
            pauseTime = option.clock();
            clearInterval(refreshInterval);
            refreshInterval = null;
        }
    }

    //清空弹幕列表
    this.cleanDamuList = function() {
        bulletComment.clean();
    }

    this.getDebugInfo = function() {
        return {
            time: refreshInterval ? option.clock() : pauseTime,
            bulletCommentsOnScreenCount: bulletCommentsOnScreen.getLength(), //实时弹幕总数
            bulletCommentsCount: bulletComments.getLength(), //剩余弹幕总数
            delay: delay, //延迟（单位：毫秒）
            delayBulletCommentsCount: delayBulletCommentsCount, //延迟弹幕总数
            timeOut: timeOut, //超时（单位：毫秒）
            timeOutBulletCommentsCount: timeOutBulletCommentsCount //超时弹幕总数
        }
    }

    //内部函数
    function setValue(value, defaultBalue) {
        if (typeof(value) == 'undefined') return defaultBalue;
        if (typeof(value) == 'number' && isNaN(value)) return defaultBalue;
        if (value == null) return defaultBalue;
        return value;
    }
    //刷新弹幕函数
    function refresh() {
        addBulletCommentsToScreen();
        moveBulletCommentOnScreen();
        drawOnTheCanvas();
        if (oldRefreshRate != option.refreshRate){
            clearInterval(refreshInterval);
            refreshInterval = setInterval(refresh, 1 / option.refreshRate);
        }
    }

    //绘制函数
    function drawOnTheCanvas() {
        canvas.width = canvas.width;
        canvasContext = canvas.getContext("2d");
        bulletCommentsOnScreen.forEach((bulletCommentOnScreen) => {
            canvasContext.font = "700 " + bulletCommentOnScreen.bulletComment.size + "px sans-serif";
            canvasContext.lineWidth = 0.5;
            canvasContext.fillStyle = bulletCommentOnScreen.bulletComment.color;
            canvasContext.strokeStyle = bulletCommentOnScreen.bulletComment.borderCorol;
            canvasContext.fillText(bulletCommentOnScreen.bulletComment.text, bulletCommentOnScreen.x, bulletCommentOnScreen.y + bulletCommentOnScreen.bulletComment.size);
            canvasContext.strokeText(bulletCommentOnScreen.bulletComment.text, bulletCommentOnScreen.x, bulletCommentOnScreen.y + bulletCommentOnScreen.bulletComment.size);
        }, true);
    }

    //移动弹幕函数
    function moveBulletCommentOnScreen() {
        bulletCommentsOnScreen.forEach((bulletCommentOnScreen) => {
            let nowTime = option.clock();
            if (bulletCommentOnScreen.bulletComment.rightToLeft) {
                if (bulletCommentOnScreen.x > -bulletCommentOnScreen.width) {
                    bulletCommentOnScreen.x -= bulletCommentOnScreen.bulletComment.speed * option.playSpeed / option.refreshRate;
                } else {
                    return { remove: true };
                }
            } else {
                if (bulletCommentOnScreen.x < canvas.width) {
                    bulletCommentOnScreen.x += bulletCommentOnScreen.bulletComment.speed * option.playSpeed / option.refreshRate;
                } else {
                    return { remove: true };
                }
            }
            if (nowTime > bulletCommentOnScreen.endTime){
                timeOut = nowTime - bulletCommentOnScreen.endTime;
                if(nowTime - bulletCommentOnScreen.endTime > (bulletCommentOnScreen.endTime - bulletCommentOnScreen.startTime) * 0.4)
                {
                    timeOutBulletCommentsCount++;
                    return { remove: true };
                }
            } else timeOut = 0;
        }, true);
    }

    //添加弹幕到屏幕函数
    function addBulletCommentsToScreen() {
        if (bulletCommentsOnScreen.getLength() == 0) delay = timeOut = 0;
        let times = Math.ceil(1 / option.refreshRate);
        do {
            let nowTime = option.clock();
            let bulletComment = bulletComments.pop(false, false);
            if (bulletComment == null) return;
            if (bulletComment.startTime > nowTime) return;
            if (bulletComment.startTime > nowTime - 1 / option.refreshRate * 1.4)
                bulletCommentsOnScreen.push(getBulletCommentOnScreen(nowTime, bulletComment), false); //生成屏幕弹幕对象并添加到屏幕弹幕集合
            else
                delayBulletCommentsCount++;
            bulletComments.pop(true, false);
            times--;
        } while (bulletCommentsOnScreen.getLength() == 0 || times > 0)
    }

    //生成屏幕弹幕对象函数
    function getBulletCommentOnScreen(nowTime, bulletComment) {
        delay = nowTime - bulletComment.startTime;
        let bulletCommentOnScreen = new Object();
        bulletCommentOnScreen.bulletComment = bulletComment;
        bulletCommentOnScreen.startTime = nowTime;
        bulletCommentOnScreen.width = bulletComment.size * bulletComment.text.length;
        bulletCommentOnScreen.endTime = parseInt(nowTime + (canvas.width + bulletCommentOnScreen.width) / (bulletComment.speed * option.playSpeed));
        bulletCommentOnScreen.x = bulletComment.rightToLeft ? canvas.width : -bulletCommentOnScreen.width;
        bulletCommentOnScreen.y = option.verticalInterval;
        bulletCommentsOnScreen.forEach((lastBulletCommentOnScreen) => {
            if (lastBulletCommentOnScreen.startTime +
                lastBulletCommentOnScreen.width / (lastBulletCommentOnScreen.bulletComment.speed * option.playSpeed) > nowTime ||
                lastBulletCommentOnScreen.endTime >= bulletCommentOnScreen.endTime) {
                bulletCommentOnScreen.y = lastBulletCommentOnScreen.y + lastBulletCommentOnScreen.bulletComment.size + option.verticalInterval;
                return { stop: true };
            }
        }, false);
        if (bulletCommentOnScreen.y + bulletComment.size >= canvas.height) {
            bulletCommentOnScreen.y = Math.random() * 3 * option.verticalInterval;
        }
        return bulletCommentOnScreen;
    }
}