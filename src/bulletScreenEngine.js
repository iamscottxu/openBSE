import { LinkedList } from './lib/linkedList'
import { Event } from './lib/event'
import { VERSION, BUILE_DATE } from './version'
import { RenderersFactory } from './lib/renderers/renderersFactory'
import { BulletScreenType } from './bulletScreenType';

const PARAMETERS_TYPE_ERROR = 'Parameters type error.';

/** 
 * 弹幕引擎对象类 
 * @alias openBSE.BulletScreenEngine
 * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误。
 * @throws {TypeError} 传入的参数错误时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
 */
class BulletScreenEngine {
    /**
     * 创建一个弹幕引擎对象。
     * @param {Element} element - 要加载弹幕的元素：有关 Element 接口的信息请参阅MDN [Element]{@link https://developer.mozilla.org/zh-CN/docs/Web/API/Element} 。
     * @param {openBSE~Options} [options] - 全局选项：一个 {@link openBSE~Options} 结构。
     * @param {string} [renderMode="canvas"] - 渲染模式：默认为“canvas”, “可选css3”， “webgl”和“svg”。
     */
    constructor(element, options, renderMode = 'canvas') {
        //变量初始化
        /**
         * 开始时间
         * @private @type {number}
         */
        let _startTime;
        /**
         * 暂停时间
         * @private @type {number}
         */
        let _pauseTime = 0;
        /**
         * 剩余弹幕，屏幕上的弹幕
         * @private @type {number}
         */
        let _bulletScreens = new LinkedList(), _bulletScreensOnScreen = new LinkedList();
        /**
         * 延迟弹幕总数
         * @private @type {number}
         */
        let _delayBulletScreensCount = 0;
        /**
         * 延迟（单位：毫秒）
         * @private @type {number}
         */
        let _delay = 0;
        /**
         * 播放标志
         * @private @type {boolean}
         */
        let _playing;
        /**
         * 刷新频率
         * @private @type {number}
         */
        let _refreshRate = 0.06; //初始刷新频率
        /**
         * 上一次刷新时间
         * @private @type {number}
         */
        let _lastRefreshTime;
        //默认参数
        options = setValue(options, {});
        options.verticalInterval = setValue(options.verticalInterval, 8, 'number'); //垂直间距
        options.playSpeed = setValue(options.playSpeed, 1, 'number'); //播放速度倍数
        options.clock = setValue(options.clock, time => new Date().getTime() - _startTime, 'function'); //时间基准
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
        this.options = options;
        //事件初始化
        let _event = new Event();
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
        let _oldHiddenTypes = options.hiddenTypes;
        //渲染器工厂
        let renderersFactory = new RenderersFactory(element, this.options, _elementSize, _event, _bulletScreensOnScreen);
        let _renderer = renderersFactory.getRenderer(renderMode); //实例化渲染器
        setInterval(setSize, 100);
        console.info('%copenBSE%c now loaded.\n' +
            '\n' +
            '%cVersion: %s\n' +
            'Build Date: %s\n' +
            '\n' +
            '%copenBSE is a high-performance JavaScript bullet-screen (danmaku) engine.\n' +
            'Home: https://iamscottxu.github.io/openBSE/', 'font-weight:bold; color:#0099FF;', '', 'font-style:italic;', VERSION, BUILE_DATE, '');
        //公共函数
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
            bulletScreen.type = setValue(bulletScreen.type, BulletScreenType.rightToLeft, 'number'); //类型

            if (
                bulletScreen.type != BulletScreenType.leftToRight &&
                bulletScreen.type != BulletScreenType.rightToLeft &&
                bulletScreen.type != BulletScreenType.top &&
                bulletScreen.type != BulletScreenType.bottom
            ) throw new TypeError(PARAMETERS_TYPE_ERROR);

            bulletScreenStyleCheckType(bulletScreen.style); //检查弹幕样式类型

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

        };

        /**
         * 开始播放弹幕。
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
                version: VERSION,
                buildDate: BUILE_DATE
            };
        };

        //内部函数
        /**
         * 设置值
         * @private
         * @param {string} value - 值
         * @param {string} defaultBalue - 默认值
         * @param {string} type 类型
         * @returns {object} - 值
         */
        function setValue(value, defaultBalue, type = null) {
            let returnValue = value;
            if (
                typeof (value) === 'undefined' ||
                (typeof (value) === 'number' && isNaN(value)) ||
                value === null
            ) returnValue = defaultBalue;
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
        function checkType(value, type, canBeNull = true) {
            if (type === null) return;
            if (canBeNull &&
                (typeof (value) === 'undefined' ||
                    (typeof (value) === 'number' && isNaN(value)) ||
                    value === null)
            ) return;
            if (typeof(type) === 'object') {
                let flat = false;
                for (let item of type) {
                    if (typeof (value) === item) flat = true;
                    break;
                }
                if (!flat) throw new TypeError(PARAMETERS_TYPE_ERROR);
            } else if (typeof (value) != type) throw new TypeError(PARAMETERS_TYPE_ERROR);
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
         * @private
         */
        function moveBulletScreenOnScreen() {
            _bulletScreensOnScreen.forEach((bulletScreenOnScreen) => {
                let nowTime = options.clock();
                switch (bulletScreenOnScreen.bulletScreen.type) {
                    case BulletScreenType.rightToLeft:
                        if (bulletScreenOnScreen.x > -bulletScreenOnScreen.width) {
                            bulletScreenOnScreen.x -= bulletScreenOnScreen.bulletScreen.style.speed * options.playSpeed / _refreshRate;
                        }
                        else {
                            _renderer.delete(bulletScreenOnScreen);
                            return { remove: true };
                        }
                        break;
                    case BulletScreenType.leftToRight:
                        if (bulletScreenOnScreen.x < _elementSize.width) {
                            bulletScreenOnScreen.x += bulletScreenOnScreen.bulletScreen.style.speed * options.playSpeed / _refreshRate;
                        }
                        else {
                            _renderer.delete(bulletScreenOnScreen);
                            return { remove: true };
                        }
                        break;
                    case BulletScreenType.top:
                    case BulletScreenType.bottom:
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
            let bulletScreenOnScreen = {};
            bulletScreenOnScreen.bulletScreen = bulletScreen;
            bulletScreenOnScreen.startTime = nowTime; //弹幕头部进屏幕时间
            bulletScreenOnScreen.size = bulletScreenOnScreen.bulletScreen.style.size;
            bulletScreenOnScreen.height = bulletScreenOnScreen.size; //弹幕的高度：像素
            _renderer.creatAndgetWidth(bulletScreenOnScreen); //创建弹幕元素并计算宽度
            switch (bulletScreen.type) {
                case BulletScreenType.rightToLeft:
                    bulletScreenOnScreen.endTime = parseInt(nowTime + (_elementSize.width + bulletScreenOnScreen.width) / (bulletScreen.style.speed * options.playSpeed)); //弹幕尾部出屏幕的时间
                    bulletScreenOnScreen.x = _elementSize.width; //弹幕初始X坐标
                    bulletScreenOnScreen.y = options.verticalInterval; //弹幕初始Y坐标
                    break;
                case BulletScreenType.leftToRight:
                    bulletScreenOnScreen.endTime = parseInt(nowTime + (_elementSize.width + bulletScreenOnScreen.width) / (bulletScreen.style.speed * options.playSpeed)); //弹幕尾部出屏幕的时间
                    bulletScreenOnScreen.x = -bulletScreenOnScreen.width; //弹幕初始X坐标
                    bulletScreenOnScreen.y = options.verticalInterval; //弹幕初始Y坐标
                    break;
                case BulletScreenType.top:
                    bulletScreenOnScreen.endTime = bulletScreenOnScreen.startTime + bulletScreen.style.residenceTime * options.playSpeed;
                    bulletScreenOnScreen.x = parseInt((_elementSize.width - bulletScreenOnScreen.width) / 2); //弹幕初始X坐标
                    bulletScreenOnScreen.y = options.verticalInterval; //弹幕初始Y坐标
                    break;
                case BulletScreenType.bottom:
                    bulletScreenOnScreen.endTime = bulletScreenOnScreen.startTime + bulletScreen.style.residenceTime * options.playSpeed;
                    bulletScreenOnScreen.x = parseInt((_elementSize.width - bulletScreenOnScreen.width) / 2); //弹幕初始X坐标
                    bulletScreenOnScreen.y = -options.verticalInterval - bulletScreenOnScreen.height; //弹幕初始Y坐标
                    break;
            }
            let oldLength = _bulletScreensOnScreen.getLength();
            if (bulletScreen.type === BulletScreenType.top || bulletScreen.type === BulletScreenType.bottom) {
                _bulletScreensOnScreen.forEach((nextBulletScreenOnScreen) => {
                    //弹幕不在流中，是固定弹幕
                    if (nextBulletScreenOnScreen.bulletScreen.type != bulletScreen.type)
                        return; //不是同一种类型的弹幕
                    if (bulletScreen.type === BulletScreenType.top) {
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
                    if (nextBulletScreenOnScreen.bulletScreen.type === BulletScreenType.top || nextBulletScreenOnScreen.bulletScreen.type === BulletScreenType.bottom)
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
         * @private
         * @param {object} bulletScreenOnScreen 屏幕弹幕事件
         * @returns {object} 屏幕弹幕事件
         */
        function setActualY(bulletScreenOnScreen) {
            let bulletScreen = bulletScreenOnScreen.bulletScreen;
            if (
                bulletScreen.type === BulletScreenType.leftToRight ||
                bulletScreen.type === BulletScreenType.rightToLeft ||
                bulletScreen.type === BulletScreenType.top
            ) {
                bulletScreenOnScreen.actualY = bulletScreenOnScreen.y % (_elementSize.height - bulletScreenOnScreen.height);
            }
            else if (bulletScreen.type === BulletScreenType.bottom) {
                bulletScreenOnScreen.actualY = _elementSize.height + bulletScreenOnScreen.y % _elementSize.height;
            }
            return bulletScreenOnScreen;
        }

        /**
         * 设置尺寸
         * @private
         */
        function setSize() {
            if (_oldDevicePixelRatio != window.devicePixelRatio ||
                _oldScaling != options.scaling ||
                _oldClientWidth != element.clientWidth ||
                _oldClientHeight != element.clientHeight ||
                _oldHiddenTypes != options.hiddenTypes) {
                _elementSize.width = element.clientWidth / options.scaling;
                _elementSize.height = element.clientHeight / options.scaling;
                _oldDevicePixelRatio = window.devicePixelRatio;
                _oldScaling = options.scaling;
                _oldClientWidth = element.clientWidth;
                _oldClientHeight = element.clientHeight;
                _oldHiddenTypes = options.hiddenTypes;
                _renderer.setSize();
                if(!_playing) _renderer.draw(); //非播放状态则重绘
            }
        }
    }
}
export { BulletScreenEngine }