import LinkedList from '../lib/linkedList'
import RenderersFactory from '../renderers/renderersFactory'
import Helper from '../lib/helper'
import Resources from '../lib/resources'
import * as build from '../build.json'
import { Interpreter } from '../lib/JS-Interpreter/acorn_interpreter'

export default class SpecialEngine {
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
         * 弹幕缓冲区
         * @private @type {LinkedList}
         */
        let _bulletScreenBuffer = new LinkedList();
        /**
         * 实时弹幕列表
         * @private @type {LinkedList}
         */
        let _realTimeBulletScreens = new LinkedList();
        /**
         * 延迟弹幕总数
         * @private @type {number}
         */
        let _delayBulletScreenCount = 0;
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
         * @private @type {openBSE~specialOptions}
         */
        let _options;
        /**
         * 默认全局变量
         * @private @readonly
         */
        const _defaultOptions = {
            /** 播放速度(倍数) */
            playSpeed: 1,
            /** 时间基准 */
            clock: time => new Date().getTime() - _startTime,
            /** 缩放比例 */
            scaling: 1,
            /** 超时丢弃 */
            timeOutDiscard: true,
            /** 弹幕不透明度 */
            opacity: 1
        }

        /**
         * 全局选项类型
         * @private @readonly
         */
        const _optionsType = {
            playSpeed: 'number',
            clock: 'function',
            scaling: 'number',
            timeOutDiscard: 'boolean',
            opacity: 'number',
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
            /** 弹幕退出时间 */
            endTime: null,
            /** 弹幕渲染代码 */
            renderCode: null
        }

        /**
         * 弹幕数据类型
         * @private @readonly
         */
        const _bulletScreenType = {
            text: 'string',
            canDiscard: 'boolean',
            startTime: 'number',
            endTime: 'number',
            renderCode: 'string'
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
        //初始化
        let _elementSize = {
            width: element.clientWidth / _options.scaling,
            height: element.clientHeight / _options.scaling
        }
        let _oldDevicePixelRatio = Helper.getDevicePixelRatio();
        let _oldScaling = _options.scaling;
        let _oldClientWidth = element.clientWidth;
        let _oldClientHeight = element.clientHeight;
        let _oldOpacity = _options.opacity;
        //渲染器工厂
        let renderersFactory = new RenderersFactory(element, _options, _elementSize, bulletScreenEventTrigger);
        let _renderer = renderersFactory.getGeneralRenderer(renderMode); //实例化渲染器
        setInterval(setSize, 100);

        //公共函数
        /**
         * 设置或获取全局选项
         * @private
         **/
        Object.defineProperty(this, 'options', {
            get: function () {
                return Helper.clone(_options);
            },
            set: function (options) {
                _options = Helper.setValues(options, _options, _optionsType, false); //设置默认值
                if (_oldOpacity != _options.opacity) {
                    _oldOpacity = _options.opacity;
                    _renderer.setOpacity();
                }
            }
        });

        /**
         * 添加弹幕到弹幕列表。
         * @description 添加弹幕到弹幕列表。由于弹幕在屏幕上出现过后，弹幕引擎将从列表中彻底删除此弹幕。所以，在改变播放进度时，可能需要先[清空弹幕列表]{@link openBSE.BulletScreenEngine#cleanBulletScreenList}，然后重新加载此播放进度以后的弹幕。
         * @param {openBSE~SpecialBulletScreen} bulletScreen - 单条弹幕数据：一个 {@link openBSE~SpecialBulletScreen} 结构。
         * @throws {TypeError} 传入的参数错误时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
         */
        this.add = function (bulletScreen) {
            _defaultBulletScreen.startTime = _options.clock();
            bulletScreen = Helper.setValues(bulletScreen, _defaultBulletScreen, _bulletScreenType); //设置默认值

            //创建解释器对象
            bulletScreen.interpreter = new Interpreter(bulletScreen.renderCode, (interpreter, scope) => {
                interpreter.setProperty
            });

            let newNode = new LinkedList.node(bulletScreen);
            _bulletScreenBuffer.forEach(function (node) {
                let lastBulletScreen = node.element;
                if (bulletScreen.startTime > lastBulletScreen.startTime) {
                    return {
                        add: { addToUp: true, node: newNode },
                        stop: true
                    };
                }
            }, true);
            if (newNode.linkedList === null) _bulletScreenBuffer.push(newNode, false);
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
         * 清空弹幕缓冲区。
         * @description 清空弹幕列表，但屏幕上已经出现的弹幕不会被清除。
         */
        this.cleanBuffer = function () {
            _bulletScreenBuffer.clean();
        };

        /**
         * 清空屏幕内容。
         * @description 清空屏幕内容。清空屏幕上已经出现的弹幕，不包括弹幕列表中的弹幕。
         */
        this.cleanScreen = function () {
            _realTimeBulletScreens.clean();
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
            this.cleanBuffer();
            this.cleanScreen();
            _pauseTime = 0;
            _startTime = null;
        };

        /**
         * 获取或设置弹幕可见性。
         * @private
         */
        Object.defineProperty(this, 'visibility', {
            get: function () {
                return renderer.getVisibility();
            },
            set: function (visibility) {
                if (visibility) _renderer.show();
                else _renderer.hide();
            }
        });

        /**
         * 获取渲染模式。
         * @private
         */
        Object.defineProperty(this, 'renderMode', {
            get: function () {
                return renderMode;
            }
        });

        /**
         * 获取播放状态。
         * @private
         */
        Object.defineProperty(this, 'playState', {
            get: function () {
                return _playing;
            }
        });

        /**
        * 获取调试信息。
        * @private
        */
        Object.defineProperty(this, 'debugInfo', {
            get: function () {
                return {
                    time: _playing ? _options.clock() : _pauseTime,
                    realTimeBulletScreenCount: _realTimeBulletScreens.length,
                    bufferBulletScreenCount: _bulletScreenBuffer.length,
                    delay: _delay,
                    delayBulletScreenCount: _delayBulletScreenCount,
                    fps: _playing ? Math.floor(_refreshRate * 1000) : 0 //帧频
                };
            }
        });

        //内部函数

        /**
         * 设置尺寸
         * @private
         */
        function setSize() {
            let devicePixelRatio = Helper.getDevicePixelRatio();
            if (_oldDevicePixelRatio != devicePixelRatio ||
                _oldClientWidth != element.clientWidth ||
                _oldClientHeight != element.clientHeight ||
                _oldScaling != _options.scaling) {
                _oldScaling = _options.scaling;
                _elementSize.width = element.clientWidth / _options.scaling;
                _elementSize.height = element.clientHeight / _options.scaling;
                _oldClientWidth = element.clientWidth;
                _oldClientHeight = element.clientHeight;
                _oldDevicePixelRatio = devicePixelRatio;
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