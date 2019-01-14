import { LinkedList } from './lib/linkedList'
import { Event } from './lib/event'
import { RenderersFactory } from './lib/renderers/renderersFactory'
import { BulletScreenType } from './bulletScreenType'
import { Helper } from './lib/helper'
import { Resources } from './lib/resources'
import * as build from './build.json'

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
     * @param {openBSE~Options} [_options] - 全局选项：一个 {@link openBSE~Options} 结构。
     * @param {string} [renderMode="canvas"] - 渲染模式：默认为“canvas”, “可选css3”， “webgl”和“svg”。一般建议使用“canvas”（特别是 FireFox 浏览器 CSS3 渲染效率较低）。在一些版本较老的浏览器中“window.devicePixelRatio”变量不被支持或支持不完整，这会导致在高DPI和页面被缩放的情况下“canvas”和“webgl”渲染模式弹幕显示不正常的情况（弹幕模糊），此时建议使用“css3”渲染模式。
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
         * 剩余弹幕
         * @private @type {LinkedList}
         */
        let _bulletScreens = new LinkedList();
        /**
         * 屏幕上的弹幕
         * @private @type {LinkedList}
         */
        let _bulletScreensOnScreen = new LinkedList();
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
        /**
         * 全局选项
         * @private @type {openBSE~Options}
         */
        let _options;
        /**
         * 默认全局变量
         * @private @readonly
         */
        const _defaultOptions = {
            /** 垂直间距 */
            verticalInterval: 8,
            /** 播放速度(倍数) */
            playSpeed: 1,
            /** 时间基准 */
            clock: time => new Date().getTime() - _startTime,
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
                size: 19,
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
        }

        /**
         * 全局选项类型
         * @private @readonly
         */
        const _optionsType = {
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
        }

        /**
         * 默认弹幕数据
         * @private @readonly
         */
        const _defaultBulletScreen = {
            /** 弹幕文本 */
            text: null,
            /** 是否允许丢弃 */
            canDiscard: true,
            /** 弹幕进入时间 */
            startTime: null,
            /** 弹幕类型 */
            type: BulletScreenType.rightToLeft,
            /** 弹幕层级（越大越前） */
            layer: 0
        }

        /**
         * 弹幕数据类型
         * @private @readonly
         */
        const _bulletScreenType = {
            text: 'string',
            canDiscard: 'boolean',
            startTime: 'number',
            type: 'number',
            layer: 'number'
        }

        /**
         * requestAnimationFrame 定义（一些老式浏览器不支持 requestAnimationFrame ）
         * @param {function} fun - 回调方法 
         * @function
         */
        let requestAnimationFrame;
        if (typeof window.requestAnimationFrame === 'function') requestAnimationFrame = window.requestAnimationFrame;
        else {
            console.warn(Resources.REQUESTANIMATIONFRAME_NOT_SUPPORT_WARN);
            requestAnimationFrame = (fun) => window.setTimeout(fun, 17); //60fps
        }

        _options = Helper.setValues(options, _defaultOptions, _optionsType); //设置默认值

        //事件初始化
        let _event = new Event();
        /**
         * 弹幕单击事件。当单击弹幕时触发。
         * @event openBSE.BulletScreenEngine#click
         * @param {openBSE~BulletScreen} [e.bulletScreen] - 被单击的弹幕的数据：一个 {@link openBSE~BulletScreen} 结构。可修改其中的参数，以便动态调整弹幕样式，但是一些参数在事件中修改无效，查看此结构的说明以了解详情。（注意：不要试图与[添加弹幕]{@link openBSE.BulletScreenEngine#addBulletScreen}时创建的对象进行比较，这个对象是克隆得到的，并不相等。正确的方法是在添加弹幕时一并插入 id 等自定义字段来唯一标识一条弹幕。）
         * @param {boolean} [e.redraw=false] - 是否重绘弹幕：此参数在每次引发事件时的初始值为 false ，如果修改了 e.bulletScreen 中的值，此参数必须设为 true ，否则修改无法生效。
         * @param {boolean} [e.pause=false] - 是否暂停：读取此参数可判断这条弹幕是否处于暂停状态，也可以设置此参数。如果设置为 true 则该弹幕暂停，直到下次引发任意弹幕事件时将此参数设为 false 或调用 {@link openBSE.BulletScreenEngine#playAllBulletScreens} 方法。
         * @param {string} e.type - 事件类型（事件名称）
         * @param {number} e.screenX - 当事件发生时，鼠标相对于显示器屏的 X 坐标。
         * @param {number} e.screenY - 当事件发生时，鼠标相对于显示器屏的 Y 坐标。
         * @param {number} e.clientX - 当事件发生时，鼠标相对于浏览器有效区域的 X 坐标。
         * @param {number} e.pageX - 当事件发生时，鼠标相对于页面的 X 坐标。
         * @param {number} e.pageY - 当事件发生时，鼠标相对于页面的 Y 坐标。
         * @param {number} e.pageY - 当事件发生时，鼠标相对于页面的 Y 坐标。
         */
        _event.add('click');
        /**
         * 弹幕上下文菜单事件。当触发弹幕上下文菜单时触发。
         * @event openBSE.BulletScreenEngine#contextmenu
         * @param {openBSE~BulletScreen} [e.bulletScreen] - 被单击的弹幕的数据：一个 {@link openBSE~BulletScreen} 结构。可修改其中的参数，以便动态调整弹幕样式，但是一些参数在事件中修改无效，查看此结构的说明以了解详情。（注意：不要试图与[添加弹幕]{@link openBSE.BulletScreenEngine#addBulletScreen}时创建的对象进行比较，这个对象是克隆得到的，并不相等。正确的方法是在添加弹幕时一并插入 id 等自定义字段来唯一标识一条弹幕。）
         * @param {boolean} [e.redraw=false] - 是否重绘弹幕：此参数在每次引发事件时的初始值为 false ，如果修改了 e.bulletScreen 中的值，此参数必须设为 true 。
         * @param {boolean} [e.pause=false] - 是否暂停：读取此参数可判断这条弹幕是否处于暂停状态，也可以设置此参数。如果设置为 true 则该弹幕暂停，直到下次引发任意弹幕事件时将此参数设为 false 或调用 {@link openBSE.BulletScreenEngine#playAllBulletScreens} 方法。
         * @param {string} e.type - 事件类型（事件名称）
         * @param {number} e.screenX - 当事件发生时，鼠标相对于显示器屏的 X 坐标。
         * @param {number} e.screenY - 当事件发生时，鼠标相对于显示器屏的 Y 坐标。
         * @param {number} e.clientX - 当事件发生时，鼠标相对于浏览器有效区域的 X 坐标。
         * @param {number} e.pageX - 当事件发生时，鼠标相对于页面的 X 坐标。
         * @param {number} e.pageY - 当事件发生时，鼠标相对于页面的 Y 坐标。
         * @param {number} e.pageY - 当事件发生时，鼠标相对于页面的 Y 坐标。
         */
        _event.add('contextmenu');
        /**
        * 弹幕鼠标离开事件。当鼠标离开弹幕时触发。
        * @event openBSE.BulletScreenEngine#mouseleave
        * @param {openBSE~BulletScreen} [e.bulletScreen] - 被单击的弹幕的数据：一个 {@link openBSE~BulletScreen} 结构。可修改其中的参数，以便动态调整弹幕样式，但是一些参数在事件中修改无效，查看此结构的说明以了解详情。（注意：不要试图与[添加弹幕]{@link openBSE.BulletScreenEngine#addBulletScreen}时创建的对象进行比较，这个对象是克隆得到的，并不相等。正确的方法是在添加弹幕时一并插入 id 等自定义字段来唯一标识一条弹幕。）
        * @param {boolean} [e.redraw=false] - 是否重绘弹幕：此参数在每次引发事件时的初始值为 false ，如果修改了 e.bulletScreen 中的值，此参数必须设为 true 。
        * @param {boolean} [e.pause=false] - 是否暂停：读取此参数可判断这条弹幕是否处于暂停状态，也可以设置此参数。如果设置为 true 则该弹幕暂停，直到下次引发任意弹幕事件时将此参数设为 false 或调用 {@link openBSE.BulletScreenEngine#playAllBulletScreens} 方法。
        * @param {string} e.type - 事件类型（事件名称）
        * @param {number} e.screenX - 当事件发生时，鼠标相对于显示器屏的 X 坐标。
        * @param {number} e.screenY - 当事件发生时，鼠标相对于显示器屏的 Y 坐标。
        * @param {number} e.clientX - 当事件发生时，鼠标相对于浏览器有效区域的 X 坐标。
        * @param {number} e.pageX - 当事件发生时，鼠标相对于页面的 X 坐标。
        * @param {number} e.pageY - 当事件发生时，鼠标相对于页面的 Y 坐标。
        * @param {number} e.pageY - 当事件发生时，鼠标相对于页面的 Y 坐标。
        */
        _event.add('mouseleave');
        /**
         * 弹幕鼠标进入事件。当鼠标进入弹幕时触发。
         * @event openBSE.BulletScreenEngine#mouseenter
         * @param {openBSE~BulletScreen} [e.bulletScreen] - 被单击的弹幕的数据：一个 {@link openBSE~BulletScreen} 结构。可修改其中的参数，以便动态调整弹幕样式，但是一些参数在事件中修改无效，查看此结构的说明以了解详情。（注意：不要试图与[添加弹幕]{@link openBSE.BulletScreenEngine#addBulletScreen}时创建的对象进行比较，这个对象是克隆得到的，并不相等。正确的方法是在添加弹幕时一并插入 id 等自定义字段来唯一标识一条弹幕。）
         * @param {boolean} [e.redraw=false] - 是否重绘弹幕：此参数在每次引发事件时的初始值为 false ，如果修改了 e.bulletScreen 中的值，此参数必须设为 true 。
         * @param {boolean} [e.pause=false] - 是否暂停：读取此参数可判断这条弹幕是否处于暂停状态，也可以设置此参数。如果设置为 true 则该弹幕暂停，直到下次引发任意弹幕事件时将此参数设为 false 或调用 {@link openBSE.BulletScreenEngine#playAllBulletScreens} 方法。
         * @param {string} e.type - 事件类型（事件名称）
         * @param {number} e.screenX - 当事件发生时，鼠标相对于显示器屏的 X 坐标。
         * @param {number} e.screenY - 当事件发生时，鼠标相对于显示器屏的 Y 坐标。
         * @param {number} e.clientX - 当事件发生时，鼠标相对于浏览器有效区域的 X 坐标。
         * @param {number} e.pageX - 当事件发生时，鼠标相对于页面的 X 坐标。
         * @param {number} e.pageY - 当事件发生时，鼠标相对于页面的 Y 坐标。
         * @param {number} e.pageY - 当事件发生时，鼠标相对于页面的 Y 坐标。
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
        //初始化
        let _elementSize = {
            width: element.clientWidth / _options.scaling,
            height: element.clientHeight / _options.scaling
        }
        let _oldDevicePixelRatio = window.devicePixelRatio;
        let _oldScaling = _options.scaling;
        let _oldClientWidth = element.clientWidth;
        let _oldClientHeight = element.clientHeight;
        let _oldHiddenTypes = _options.hiddenTypes;
        let _oldOpacity = _options.opacity;
        //渲染器工厂
        let renderersFactory = new RenderersFactory(element, _options, _elementSize, bulletScreenEventTrigger);
        let _renderer = renderersFactory.getRenderer(renderMode); //实例化渲染器
        setInterval(setSize, 100);

        //公共函数

        /**
         * 设置全局选项
         * @param {openBSE~Options} options - 全局选项：一个 {@link openBSE~Options} 结构。
         * @throws {TypeError} 传入的参数错误时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
         */
        this.setOptions = function (options) {
            _options = Helper.setValues(options, _options, _optionsType, false); //设置默认值
            if (_oldHiddenTypes != _options.hiddenTypes) {
                _oldHiddenTypes = _options.hiddenTypes;
                if (!_playing) _renderer.draw(); //非播放状态则重绘
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
        this.getOptions = () => _options;

        /**
         * 添加弹幕到弹幕列表。
         * @description 添加弹幕到弹幕列表。由于弹幕在屏幕上出现过后，弹幕引擎将从列表中彻底删除此弹幕。所以，在改变播放进度时，可能需要先[清空弹幕列表]{@link openBSE.BulletScreenEngine#cleanBulletScreenList}，然后重新加载此播放进度以后的弹幕。
         * @param {openBSE~BulletScreen} bulletScreen - 单条弹幕数据：一个 {@link openBSE~BulletScreen} 结构。
         * @throws {TypeError} 传入的参数错误时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
         */
        this.addBulletScreen = function (bulletScreen) {
            _defaultBulletScreen.startTime = _options.clock();
            bulletScreen = Helper.setValues(bulletScreen, _defaultBulletScreen, _bulletScreenType); //设置默认值

            if (
                bulletScreen.type != BulletScreenType.leftToRight &&
                bulletScreen.type != BulletScreenType.rightToLeft &&
                bulletScreen.type != BulletScreenType.top &&
                bulletScreen.type != BulletScreenType.bottom
            ) throw new TypeError(Resources.PARAMETERS_TYPE_ERROR);

            Helper.checkTypes(bulletScreen.style, _optionsType.defaultStyle); //检查弹幕样式类型

            let oldLength = _bulletScreens.getLength();
            _bulletScreens.forEach(function (lastBulletScreen) {
                if (bulletScreen.startTime > lastBulletScreen.startTime)
                    return {
                        add: { addToUp: true, element: bulletScreen },
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
                    _startTime += _options.clock() - _pauseTime;
                _lastRefreshTime = null;
                _playing = true;
                requestAnimationFrame(refresh);
            }
        };

        /**
         * 继续所有在事件响应中设置了 e.pause = true; 弹幕的播放。
         */
        this.playAllBulletScreens = () =>
            _bulletScreensOnScreen.forEach((bulletScreenOnScreen) => bulletScreenOnScreen.pause = false);

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
        this.getRenderMode = () => renderMode;

        /**
         * 获取播放状态。
         * @returns {boolean} - 正在播放标志：true：正在播放；false：已暂停/停止播放。
         */
        this.getPlayState = () => _playing;

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
                fps: _playing ? Math.floor(_refreshRate * 1000) : 0 //帧频
            };
        };

        //内部函数

        /**
         * 弹幕事件响应
         * @param {string} name - 事件名称
         * @param {object} bulletScreenOnScreen - 屏幕弹幕对象
         * @param {object} e - 事件信息
         */
        function bulletScreenEventTrigger(name, bulletScreenOnScreen, e) {
            if (typeof e.pageX === 'undefined' || e.pageX === null) {
                let doc = document.documentElement, body = document.body;
                e.pageX = e.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                e.pageY = e.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
            }
            _event.trigger(name, {
                getBulletScreen: () => Helper.clone(bulletScreenOnScreen.bulletScreen),
                setBulletScreen: (bulletScreen, redraw = false) => {
                    if (typeof redraw != 'boolean') new TypeError(Resources.PARAMETERS_TYPE_ERROR);
                    let bulletScreenType = Helper.clone(_bulletScreenType);
                    bulletScreenType.style = _optionsType.defaultStyle;
                    bulletScreenOnScreen.bulletScreen = Helper.setValues(bulletScreen, bulletScreenOnScreen.bulletScreen, bulletScreenType); //设置值
                    if (redraw === true) _renderer.reCreatAndgetWidth(bulletScreenOnScreen); //重新创建并绘制弹幕
                    if (!_playing && (_e.redraw || _e.bringToTop)) _renderer.draw(); //非播放状态则重绘
                },
                getPlayState: () => !bulletScreenOnScreen.pause,
                setPlayState: (play) => {
                    if (typeof pause != 'boolean') new TypeError(Resources.PARAMETERS_TYPE_ERROR);
                    bulletScreenOnScreen.pause = !play;
                },
                screenX: e.screenX, screenY: e.screenY,
                pageX: e.pageX, pageY: e.pageY,
                clientX: e.clientX, clientY: e.clientY
            });
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
                if (bulletScreenOnScreen.pause) return; //暂停移动
                let nowTime = _options.clock();
                switch (bulletScreenOnScreen.type) {
                    case BulletScreenType.rightToLeft:
                        if (bulletScreenOnScreen.x > -bulletScreenOnScreen.width) {
                            bulletScreenOnScreen.x -= bulletScreenOnScreen.bulletScreen.style.speed * _options.playSpeed / _refreshRate;
                        }
                        else {
                            _renderer.delete(bulletScreenOnScreen);
                            return { remove: true };
                        }
                        break;
                    case BulletScreenType.leftToRight:
                        if (bulletScreenOnScreen.x < _elementSize.width) {
                            bulletScreenOnScreen.x += bulletScreenOnScreen.bulletScreen.style.speed * _options.playSpeed / _refreshRate;
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
                if (bulletScreen === null) return;
                let nowTime = _options.clock();
                if (bulletScreen.startTime > nowTime) return;
                if (!_options.timeOutDiscard || !bulletScreen.canDiscard || bulletScreen.startTime > nowTime - Math.floor(1 / _refreshRate) * 60) {
                    bulletScreen.style = Helper.setValues(bulletScreen.style, _options.defaultStyle, _optionsType.defaultStyle); //填充默认样式
                    getBulletScreenOnScreen(nowTime, bulletScreen); //生成屏幕弹幕对象并添加到屏幕弹幕集合            
                }
                else _delayBulletScreensCount++;
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
            let bulletScreenOnScreen = {};
            bulletScreenOnScreen.pause = false; //是否暂停移动
            bulletScreenOnScreen.bulletScreen = bulletScreen;
            bulletScreenOnScreen.startTime = nowTime; //弹幕头部进屏幕时间
            bulletScreenOnScreen.size = bulletScreen.style.size; //字体大小：像素
            bulletScreenOnScreen.type = bulletScreen.type; //弹幕类型
            bulletScreenOnScreen.height = bulletScreenOnScreen.size; //弹幕的高度：像素
            _renderer.creatAndgetWidth(bulletScreenOnScreen); //创建弹幕元素并计算宽度
            switch (bulletScreen.type) {
                case BulletScreenType.rightToLeft:
                    bulletScreenOnScreen.endTime = parseInt(nowTime + (_elementSize.width + bulletScreenOnScreen.width) / (bulletScreen.style.speed * _options.playSpeed)); //弹幕尾部出屏幕的时间
                    bulletScreenOnScreen.x = _elementSize.width; //弹幕初始X坐标
                    bulletScreenOnScreen.y = _options.verticalInterval; //弹幕初始Y坐标
                    break;
                case BulletScreenType.leftToRight:
                    bulletScreenOnScreen.endTime = parseInt(nowTime + (_elementSize.width + bulletScreenOnScreen.width) / (bulletScreen.style.speed * _options.playSpeed)); //弹幕尾部出屏幕的时间
                    bulletScreenOnScreen.x = -bulletScreenOnScreen.width; //弹幕初始X坐标
                    bulletScreenOnScreen.y = _options.verticalInterval; //弹幕初始Y坐标
                    break;
                case BulletScreenType.top:
                    bulletScreenOnScreen.endTime = bulletScreenOnScreen.startTime + bulletScreen.style.residenceTime * _options.playSpeed;
                    bulletScreenOnScreen.x = parseInt((_elementSize.width - bulletScreenOnScreen.width) / 2); //弹幕初始X坐标
                    bulletScreenOnScreen.y = _options.verticalInterval; //弹幕初始Y坐标
                    break;
                case BulletScreenType.bottom:
                    bulletScreenOnScreen.endTime = bulletScreenOnScreen.startTime + bulletScreen.style.residenceTime * _options.playSpeed;
                    bulletScreenOnScreen.x = parseInt((_elementSize.width - bulletScreenOnScreen.width) / 2); //弹幕初始X坐标
                    bulletScreenOnScreen.y = -_options.verticalInterval - bulletScreenOnScreen.height; //弹幕初始Y坐标
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
                            bulletScreenOnScreen.y = nextBulletScreenOnScreen.y + nextBulletScreenOnScreen.height + _options.verticalInterval;
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
                            bulletScreenOnScreen.y = nextBulletScreenOnScreen.y - bulletScreenOnScreen.height - _options.verticalInterval;
                    }
                }, true);
            }
            else {
                //当前弹幕经过一个点需要的总时长
                let bulletScreenOnScreenWidthTime = bulletScreenOnScreen.width / (bulletScreen.style.speed * _options.playSpeed);
                _bulletScreensOnScreen.forEach((nextBulletScreenOnScreen) => {
                    //弹幕在流中，是移动弹幕
                    if (nextBulletScreenOnScreen.bulletScreen.type === BulletScreenType.top || nextBulletScreenOnScreen.bulletScreen.type === BulletScreenType.bottom)
                        return; //弹幕不在流中，为固定弹幕
                    //如果新弹幕在当前弹幕上方且未与当前弹幕重叠
                    if (bulletScreenOnScreen.y + bulletScreenOnScreen.height < nextBulletScreenOnScreen.y)
                        return { add: { addToUp: true, element: setActualY(bulletScreenOnScreen) }, stop: true };
                    //上一条弹幕经过一个点需要的总时长
                    let nextBulletScreenOnScreenWidthTime = nextBulletScreenOnScreen.width / (nextBulletScreenOnScreen.bulletScreen.style.speed * _options.playSpeed);
                    //如果上一条弹幕的消失时间小于当前弹幕的出现时间
                    if (nextBulletScreenOnScreen.startTime + nextBulletScreenOnScreenWidthTime >= nowTime || //如果上一条弹幕的头进入了，但是尾还没进入
                        nextBulletScreenOnScreen.endTime >= bulletScreenOnScreen.endTime - bulletScreenOnScreenWidthTime) //如果当前弹幕头出去了，上一条弹幕尾还没出去
                        bulletScreenOnScreen.y = nextBulletScreenOnScreen.y + nextBulletScreenOnScreen.height + _options.verticalInterval;
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
         * @param {object} bulletScreenOnScreen - 屏幕弹幕事件
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
                _oldClientWidth != element.clientWidth ||
                _oldClientHeight != element.clientHeight ||
                _oldScaling != _options.scaling) {
                _oldScaling = _options.scaling;
                _elementSize.width = element.clientWidth / _options.scaling;
                _elementSize.height = element.clientHeight / _options.scaling;
                _oldClientWidth = element.clientWidth;
                _oldClientHeight = element.clientHeight;
                _oldDevicePixelRatio = window.devicePixelRatio;
                _renderer.setSize();
                if (!_playing) _renderer.draw(); //非播放状态则重绘
            }
        }

        //IE Edge 浏览器不支持 %c
        if (!!window.ActiveXObject || "ActiveXObject" in window || navigator.userAgent.indexOf("Trident") > -1 ||
            navigator.userAgent.indexOf("MSIE") > -1 || navigator.userAgent.indexOf("Edge") > -1) console.info(
                Resources.LOADED_INFO_IE.fillData(build)
            );
        //Other
        else console.info(
            Resources.LOADED_INFO.fillData(build),
            'font-weight:bold; color:#0099FF;', '', 'font-style:italic;', ''
        );
    }
}
export { BulletScreenEngine }