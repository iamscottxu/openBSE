import { LinkedList } from './linkedList'
import { Event } from './event'
import { VERSION, BUILE_DATE } from './version'
import { RenderersFactory } from './renderers/renderersFactory'

/** 弹幕引擎对象类 */
class BulletScreenEngine {
    /**
     * 创建一个弹幕引擎对象。
     * @param {Element} element - 要加载弹幕的元素：有关 Element 接口的信息请参阅MDN [Element]{@link https://developer.mozilla.org/zh-CN/docs/Web/API/Element} 。
     * @param {BulletScreenEngine~Options} [options] - 全局选项：一个 {@link BulletScreenEngine~Options} 结构。
     * @param {String} [renderMode="canvas"] - 渲染模式：默认为“canvas”, “可选css3”， “webgl”。
     */
    constructor(element, options, renderMode = 'canvas') {
        //变量初始化
        /**
         * 开始时间
         * @private @type {Integer}
         */
        let _startTime;
        /**
         * 暂停时间
         * @private @type {Integer}
         */
        let _pauseTime = 0;
        /**
         * 剩余弹幕，屏幕上的弹幕
         * @private @type {Integer}
         */
        let _bulletScreens = new LinkedList(), _bulletScreensOnScreen = new LinkedList();
        /**
         * 延迟弹幕总数
         * @private @type {Integer}
         */
        let _delayBulletScreensCount = 0;
        /**
         * 延迟（单位：毫秒）
         * @private @type {Integer}
         */
        let _delay = 0;
        /**
         * 播放标志
         * @private @type {Boolean}
         */
        let _playing;
        /**
         * 刷新频率
         * @private @type {Float}
         */
        let _refreshRate = 0.06; //初始刷新频率
        /**
         * 上一次刷新时间
         * @private @type {Integer}
         */
        let _lastRefreshTime;
        //默认参数
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
        options.clock = setValue(options.clock, time => new Date().getTime() - _startTime); //时间基准
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
        this.options = options;
        //事件初始化
        let _event = new Event();
        /**
         * 弹幕单击事件。当单击弹幕时触发。
         * @event BulletScreenEngine#click
         * @property {BulletScreenEngine~BulletScreen} e.bulletScreen - 被单击的弹幕的数据：一个 {@link BulletScreenEngine~BulletScreen} 结构。
         */
        _event.add('click');
        /**
         * 弹幕上下文菜单事件。当触发弹幕上下文菜单时触发。
         * @event BulletScreenEngine#contextmenu
         * @property {BulletScreenEngine~BulletScreen} e.bulletScreen - 被单击的弹幕的数据：一个 {@link BulletScreenEngine~BulletScreen} 结构。
         */
        _event.add('contextmenu');
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
        this.bind = _event.bind;
        /**
         * 解绑事件处理程序（fun为空解绑所有事件处理程序）
         * @function
         * @param {String} name 事件名称
         * @param {Function} fun 事件处理程序
         * @returns true: 成功 false: 失败 数字: 删除后的事件数
         */
        this.unbind = _event.unbind;
        //初始化
        let _elementSize = {
            width: element.clientWidth / options.scaling,
            height: element.clientHeight / options.scaling
        }
        let _oldDevicePixelRatio = window.devicePixelRatio;
        let _oldScaling = options.scaling;
        let _oldClientWidth = element.clientWidth;
        let _oldClientHeight = element.clientHeight;
        //渲染器工厂
        let renderersFactory = new RenderersFactory(element, this.options, _elementSize, _event, _bulletScreensOnScreen);
        let _renderer = renderersFactory.getRenderer(renderMode); //实例化渲染器
        setInterval(setSize, 100);
        console.info('%cBulletScreenEngine%c now loaded.\n' +
            '\n' +
            '%cVersion: %s\n' +
            'Build Date: %s\n' +
            '\n' +
            '%cBulletScreenEngine is a high-performance JavaScript bullet-screen (danmaku) engine.\n' +
            'Home: https://iamscottxu.github.io/BulletScreenEngine/', 'font-weight:bold; color:#0099FF;', '', 'font-style:italic;', VERSION, BUILE_DATE, '');
        //公共函数
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
                let oldLength = _bulletScreens.getLength();
                _bulletScreens.forEach(function (lastBulletScreen) {
                    if (bulletScreen.startTime > lastBulletScreen.startTime)
                        return {
                            add: {
                                addToUp: true,
                                element: bulletScreen
                            },
                            stop: true
                        };
                }, true);
                if (oldLength === _bulletScreens.getLength())
                    _bulletScreens.push(bulletScreen, false);
            }
        };

        /**
         * 开始播放弹幕。
         * @function
         */
        this.play = function () {
            if (!_playing) {
                if (!_startTime)
                    _startTime = new Date().getTime();
                if (_pauseTime)
                    _startTime += options.clock() - _pauseTime;
                _lastRefreshTime = null;
                _playing = true;
                requestAnimationFrame(refresh);
            }
        };

        /**
         * 暂停播放弹幕。
         * @function
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
         * @function
         * @description 清空弹幕列表，但屏幕上已经出现的弹幕不会被清除。
         */
        this.cleanBulletScreenList = function () {
            _bulletScreens.clean();
        };

        /**
         * 清空屏幕弹幕。
         * @function
         * @description 清空屏幕弹幕。清空屏幕上已经出现的弹幕，不包括弹幕列表中的弹幕。
         */
        this.cleanBulletScreenListOnScreen = function () {
            _bulletScreensOnScreen.clean();
            _renderer.cleanScreen();
        };

        /**
         * 停止播放弹幕。
         * @function
         * @description 停止播放弹幕。停止播放弹幕是指停止播放弹幕，默认[时间基准（options.clock）]{@link BulletScreenEngine~BulletScreenStyle}归零，并[清空弹幕列表]{@link BulletScreenEngine#cleanBulletScreenList}、[清空屏幕弹幕]{@link BulletScreenEngine#cleanBulletScreenListOnScreen}。
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
         * @function
         */
        this.hide = _renderer.hide;

        /**
         * 显示弹幕。
         * @function
         */
        this.show = _renderer.show;

        /**
         * 设置弹幕不透明度。
         * @function
         * @param {Float} opacity 弹幕不透明度：取值范围 0.0 到 1.0，0.0 全透明；1.0 不透明。
         */
        this.setOpacity = _renderer.setOpacity;

        /**
         * 获取弹幕不透明度。
         * @function
         * @returns {Float} 弹幕不透明度：取值范围 0.0 到 1.0，0.0 全透明；1.0 不透明。
         */
        this.getOpacity = _renderer.getOpacity;

        /**
         * 获取弹幕可见性。
         * @function
         * @returns {Boolean}  指示弹幕是否可见。
         * @description 获取弹幕可见性。如要显示弹幕请调用 [bulletScreenEngine.show();]{@link BulletScreenEngine#show} ，要隐藏弹幕请调用 [bulletScreenEngine.hide();]{{@link BulletScreenEngine#hide}} 。
         */
        this.getVisibility = _renderer.getVisibility;
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
            return _playing;
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
                version: VERSION,
                buildDate: BUILE_DATE
            };
        };

        //内部函数
        /**
         * 设置值
         * @function
         * @private
         * @property {String} value 值
         * @property {String} defaultBalue 默认值
         * @returns {Object} 值
         */
        function setValue(value, defaultBalue) {
            if (typeof (value) === 'undefined')
                return defaultBalue;
            if (typeof (value) === 'number' && isNaN(value))
                return defaultBalue;
            if (value === null)
                return defaultBalue;
            return value;
        }

        /**
         * 刷新弹幕函数
         * @function
         * @private
         */
        function refresh() {
            let nowTime = new Date().getTime();
            if (_lastRefreshTime != null)
                _refreshRate = 1 / (nowTime - _lastRefreshTime);
            _lastRefreshTime = nowTime;
            addBulletScreensToScreen();
            moveBulletScreenOnScreen();
            _renderer.draw(); //绘制弹幕
            if (_playing)
                requestAnimationFrame(refresh);
        }

        /**
         * 移动弹幕函数
         * @function
         * @private
         */
        function moveBulletScreenOnScreen() {
            _bulletScreensOnScreen.forEach((bulletScreenOnScreen) => {
                let nowTime = options.clock();
                switch (bulletScreenOnScreen.bulletScreen.type) {
                    case 0:
                        if (bulletScreenOnScreen.x > -bulletScreenOnScreen.width) {
                            bulletScreenOnScreen.x -= bulletScreenOnScreen.bulletScreen.style.speed * options.playSpeed / _refreshRate;
                        }
                        else {
                            _renderer.delete(bulletScreenOnScreen);
                            return { remove: true };
                        }
                        break;
                    case 1:
                        if (bulletScreenOnScreen.x < _elementSize.width) {
                            bulletScreenOnScreen.x += bulletScreenOnScreen.bulletScreen.style.speed * options.playSpeed / _refreshRate;
                        }
                        else {
                            _renderer.delete(bulletScreenOnScreen);
                            return { remove: true };
                        }
                        break;
                    case 2:
                    case 3:
                        if (bulletScreenOnScreen.endTime < nowTime) {
                            _renderer.delete(bulletScreenOnScreen);
                            return { remove: true };
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
            if (_bulletScreensOnScreen.getLength() === 0)
                _delay = 0;
            let times = Math.floor(_refreshRate * 2000);
            do {
                let bulletScreen = _bulletScreens.pop(false, false);
                if (bulletScreen === null)
                    return;
                let nowTime = options.clock();
                if (bulletScreen.startTime > nowTime)
                    return;
                if (!options.timeOutDiscard || !bulletScreen.canDiscard || bulletScreen.startTime > nowTime - Math.floor(1 / _refreshRate) * 60) {
                    setDefaultStyle(bulletScreen); //填充默认样式
                    getBulletScreenOnScreen(nowTime, bulletScreen); //生成屏幕弹幕对象并添加到屏幕弹幕集合
                }
                else
                    _delayBulletScreensCount++;
                _bulletScreens.pop(true, false);
                times--;
            } while (_bulletScreensOnScreen.getLength() === 0 || times > 0);
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
            _delay = nowTime - bulletScreen.startTime;
            let bulletScreenOnScreen = {};
            bulletScreenOnScreen.bulletScreen = bulletScreen;
            bulletScreenOnScreen.startTime = nowTime; //弹幕头部进屏幕时间
            bulletScreenOnScreen.size = bulletScreenOnScreen.bulletScreen.style.size;
            bulletScreenOnScreen.height = bulletScreenOnScreen.size; //弹幕的高度：像素
            _renderer.creatAndgetWidth(bulletScreenOnScreen); //创建弹幕元素并计算宽度
            switch (bulletScreen.type) {
                case 0:
                    bulletScreenOnScreen.endTime = parseInt(nowTime + (_elementSize.width + bulletScreenOnScreen.width) / (bulletScreen.style.speed * options.playSpeed)); //弹幕尾部出屏幕的时间
                    bulletScreenOnScreen.x = _elementSize.width; //弹幕初始X坐标
                    bulletScreenOnScreen.y = options.verticalInterval; //弹幕初始Y坐标
                    break;
                case 1:
                    bulletScreenOnScreen.endTime = parseInt(nowTime + (_elementSize.width + bulletScreenOnScreen.width) / (bulletScreen.style.speed * options.playSpeed)); //弹幕尾部出屏幕的时间
                    bulletScreenOnScreen.x = -bulletScreenOnScreen.width; //弹幕初始X坐标
                    bulletScreenOnScreen.y = options.verticalInterval; //弹幕初始Y坐标
                    break;
                case 2:
                    bulletScreenOnScreen.endTime = bulletScreenOnScreen.startTime + bulletScreen.style.residenceTime * options.playSpeed;
                    bulletScreenOnScreen.x = parseInt((_elementSize.width - bulletScreenOnScreen.width) / 2); //弹幕初始X坐标
                    bulletScreenOnScreen.y = options.verticalInterval; //弹幕初始Y坐标
                    break;
                case 3:
                    bulletScreenOnScreen.endTime = bulletScreenOnScreen.startTime + bulletScreen.style.residenceTime * options.playSpeed;
                    bulletScreenOnScreen.x = parseInt((_elementSize.width - bulletScreenOnScreen.width) / 2); //弹幕初始X坐标
                    bulletScreenOnScreen.y = -options.verticalInterval - bulletScreenOnScreen.height; //弹幕初始Y坐标
                    break;
            }
            let oldLength = _bulletScreensOnScreen.getLength();
            if (bulletScreen.type > 1) {
                _bulletScreensOnScreen.forEach((nextBulletScreenOnScreen) => {
                    //弹幕不在流中，是固定弹幕
                    if (nextBulletScreenOnScreen.bulletScreen.type != bulletScreen.type)
                        return; //不是同一种类型的弹幕
                    if (bulletScreen.type === 2) {
                        //如果新弹幕在当前弹幕上方且未与当前弹幕重叠
                        if (bulletScreenOnScreen.y + bulletScreenOnScreen.height < nextBulletScreenOnScreen.y)
                            return { add: { addToUp: true, element: setActualY(bulletScreenOnScreen) }, stop: true };
                        //如果上一条弹幕的消失时间小于当前弹幕的出现时间
                        if (nextBulletScreenOnScreen.endTime < nowTime)
                            bulletScreenOnScreen.y = nextBulletScreenOnScreen.y;
                        else
                            bulletScreenOnScreen.y = nextBulletScreenOnScreen.y + nextBulletScreenOnScreen.height + options.verticalInterval;
                    }
                    else {
                        //如果新弹幕在当前弹幕下方且未与当前弹幕重叠
                        if (bulletScreenOnScreen.y > nextBulletScreenOnScreen.y + nextBulletScreenOnScreen.height) {
                            return { add: { addToUp: true, element: setActualY(bulletScreenOnScreen) }, stop: true };
                        }
                        //如果上一条弹幕的消失时间小于当前弹幕的出现时间
                        if (nextBulletScreenOnScreen.endTime < nowTime)
                            bulletScreenOnScreen.y = nextBulletScreenOnScreen.y;
                        else
                            bulletScreenOnScreen.y = nextBulletScreenOnScreen.y - bulletScreenOnScreen.height - options.verticalInterval;
                    }
                }, true);
            }
            else {
                //当前弹幕经过一个点需要的总时长
                let bulletScreenOnScreenWidthTime = bulletScreenOnScreen.width / (bulletScreen.style.speed * options.playSpeed);
                _bulletScreensOnScreen.forEach((nextBulletScreenOnScreen) => {
                    //弹幕在流中，是移动弹幕
                    if (nextBulletScreenOnScreen.bulletScreen.type > 1)
                        return; //弹幕不在流中，为固定弹幕
                    //如果新弹幕在当前弹幕上方且未与当前弹幕重叠
                    if (bulletScreenOnScreen.y + bulletScreenOnScreen.height < nextBulletScreenOnScreen.y)
                        return { add: { addToUp: true, element: setActualY(bulletScreenOnScreen) }, stop: true };
                    //上一条弹幕经过一个点需要的总时长
                    let nextBulletScreenOnScreenWidthTime = nextBulletScreenOnScreen.width / (nextBulletScreenOnScreen.bulletScreen.style.speed * options.playSpeed);
                    //如果上一条弹幕的消失时间小于当前弹幕的出现时间
                    if (nextBulletScreenOnScreen.startTime + nextBulletScreenOnScreenWidthTime >= nowTime || //如果上一条弹幕的头进入了，但是尾还没进入
                        nextBulletScreenOnScreen.endTime >= bulletScreenOnScreen.endTime - bulletScreenOnScreenWidthTime) //如果当前弹幕头出去了，上一条弹幕尾还没出去
                        bulletScreenOnScreen.y = nextBulletScreenOnScreen.y + nextBulletScreenOnScreen.height + options.verticalInterval;
                    else
                        bulletScreenOnScreen.y = nextBulletScreenOnScreen.y;
                }, true);
            }
            if (_bulletScreensOnScreen.getLength() === oldLength)
                _bulletScreensOnScreen.push(setActualY(bulletScreenOnScreen), false);
        }

        /**
         * 设置真实的Y坐标
         * @function
         * @private
         * @property {Object} bulletScreenOnScreen 屏幕弹幕事件
         * @returns {Object} 屏幕弹幕事件
         */
        function setActualY(bulletScreenOnScreen) {
            let bulletScreen = bulletScreenOnScreen.bulletScreen;
            if (bulletScreen.type < 3) {
                bulletScreenOnScreen.actualY = bulletScreenOnScreen.y % (_elementSize.height - bulletScreenOnScreen.height);
            }
            else if (bulletScreen.type === 3) {
                bulletScreenOnScreen.actualY = _elementSize.height + bulletScreenOnScreen.y % _elementSize.height;
            }
            return bulletScreenOnScreen;
        }

        /**
         * 设置尺寸
         * @function
         * @private
         */
        function setSize() {
            if (_oldDevicePixelRatio != window.devicePixelRatio ||
                _oldScaling != options.scaling ||
                _oldClientWidth != element.clientWidth ||
                _oldClientHeight != element.clientHeight) {
                _elementSize.width = element.clientWidth / options.scaling;
                _elementSize.height = element.clientHeight / options.scaling;
                _oldDevicePixelRatio = window.devicePixelRatio;
                _oldScaling = options.scaling;
                _oldClientWidth = element.clientWidth;
                _oldClientHeight = element.clientHeight;
                _renderer.setSize();
            }
        }
    }
}
export { BulletScreenEngine }