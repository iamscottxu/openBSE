import GeneralBaseRenderer from './generalBaseRenderer'
import LinkedList from '../lib/linkedList'
import Helper from '../lib/helper'

/**
 * Canvas 渲染器抽象类
 */
export default class GeneralCanvasBaseRenderer extends GeneralBaseRenderer {
    /**
     * 实例化一个 Canvas 渲染器抽象类
     * @param {object} element - Element 元素
     * @param {openBSE~Options} options - 全局选项
     * @param {object} elementSize - 元素大小
     * @param {function} eventTrigger - 事件引发方法
     */
    constructor(element, options, elementSize, eventTrigger) {
        if (new.target === GeneralCanvasBaseRenderer) {
            throw new SyntaxError();
        }
        /**
         * 屏幕上的弹幕
         * @private @type {LinkedList}
         */
        let _bulletScreensOnScreen = new LinkedList();
        /**
         * DPI 缩放比例（倍数）
         * @private @type {number}
         */
        let _devicePixelRatio = Helper.getDevicePixelRatio(true);
        _devicePixelRatio *= options.scaling;
        /**
         * 画布元素
         * @private @type {Element}
         */
        let _canvas = init();
        super(_canvas, options, elementSize);

        /**
         * 清除屏幕内容
         * @function
         * @override
         */
        this.cleanScreen = () => _bulletScreensOnScreen.clean();

        /**
         * 创建弹幕元素
         * @override
         * @param {object} realTimeBulletScreen - 实时弹幕对象
         */
        this.creatAndgetWidth = function (realTimeBulletScreen) {
            let bulletScreen = realTimeBulletScreen.bulletScreen;
            let hideCanvas = document.createElement('canvas');
            let hideCanvasContext = hideCanvas.getContext('2d');

            hideCanvasContext.font = `${bulletScreen.style.fontWeight} ${realTimeBulletScreen.size}px ${bulletScreen.style.fontFamily}`;
            realTimeBulletScreen.width = hideCanvasContext.measureText(bulletScreen.text).width; //弹幕的宽度：像素

            hideCanvas.width = (realTimeBulletScreen.width + 8) * _devicePixelRatio;
            hideCanvas.height = (realTimeBulletScreen.height + 8) * _devicePixelRatio;

            hideCanvasContext.shadowColor = 'black';
            hideCanvasContext.font = `${bulletScreen.style.fontWeight} ${realTimeBulletScreen.size * _devicePixelRatio}px ${bulletScreen.style.fontFamily}`;
            let textX = 4 * _devicePixelRatio;
            let textY = (4 + realTimeBulletScreen.size * 0.8) * _devicePixelRatio;
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
            realTimeBulletScreen.hideCanvas = hideCanvas;

            realTimeBulletScreen.linkedListNode = new LinkedList.node(realTimeBulletScreen);
            _bulletScreensOnScreen.forEach((node) => {
                let _realTimeBulletScreen = node.element;
                if (_realTimeBulletScreen.bulletScreen.layer <= bulletScreen.layer) return {
                    add: { node: realTimeBulletScreen.linkedListNode, addToUp: false },
                    stop: true
                }
            }, false);
            if (realTimeBulletScreen.linkedListNode.linkedList === null)
                _bulletScreensOnScreen.push(realTimeBulletScreen.linkedListNode, false);
        }

        /**
         * 删除弹幕元素
         * @override
         * @param {object} realTimeBulletScreen - 实时弹幕对象
         */
        this.delete = (realTimeBulletScreen) => realTimeBulletScreen.linkedListNode.remove();

        /**
         * 重新添加弹幕
         * @override
         * @param {object} realTimeBulletScreen - 实时弹幕对象
         */
        this.reCreatAndgetWidth = function (realTimeBulletScreen) {
            this.delete(realTimeBulletScreen);
            this.creatAndgetWidth(realTimeBulletScreen);
        }

        let _setSize = this.setSize;
        /**
         * 设置尺寸
         * @override
         */
        this.setSize = function () {
            _setSize();
            _devicePixelRatio = Helper.getDevicePixelRatio();
            _devicePixelRatio *= options.scaling;
            _canvas.width = elementSize.width * _devicePixelRatio;
            _canvas.height = elementSize.height * _devicePixelRatio;
        }

        /**
         * 获取缩放比例
         * @returns {number} 缩放比例
         */
        this.getDevicePixelRatio = () => _devicePixelRatio;

        /**
         * 获取画布对象
         * @returns {Element} 画布对象
         */
        this.getCanvas = () => _canvas;

        /**
         * 获取实时弹幕对象
         * @returns {LinkedList} 画布对象
         */
        this.getBulletScreensOnScreen = () => _bulletScreensOnScreen;

        /**
         * 添加Canvas
         * @private
         * @returns {Element} 画布对象
         */
        function init() {
            let canvas = document.createElement('canvas'); //canvas对象
            Helper.cleanElement(element);
            element.appendChild(canvas);
            canvas.width = elementSize.width * _devicePixelRatio;
            canvas.height = elementSize.height * _devicePixelRatio;
            registerEvent(canvas); //注册事件响应程序
            return canvas;
        }

        let _checkWhetherHide = this.checkWhetherHide;
        /**
         * 注册事件响应程序
         * @private
         * @param {Element} element - 元素
         */
        function registerEvent(element) {
            function getrealTimeBulletScreenByLocation(location) {
                let _realTimeBulletScreen = null;
                _bulletScreensOnScreen.forEach(function (node) {
                    let realTimeBulletScreen = node.element;
                    if (_checkWhetherHide(realTimeBulletScreen)) return;
                    let x1 = realTimeBulletScreen.x - 4;
                    let x2 = x1 + realTimeBulletScreen.width + 8;
                    let y1 = realTimeBulletScreen.actualY - 4;
                    let y2 = y1 + realTimeBulletScreen.height + 8;
                    if (location.x >= x1 && location.x <= x2 && location.y >= y1 && location.y <= y2) {
                        _realTimeBulletScreen = realTimeBulletScreen;
                        return { stop: true };
                    }
                }, false);
                return _realTimeBulletScreen;
            }
            function getLocation(e) {
                function getOffsetTop(element) {
                    let offsetTop = 0;
                    do {
                        offsetTop += element.offsetTop;
                    } while ((element = element.offsetParent) != null);
                    return offsetTop;
                }
                function getOffsetLeft(element) {
                    let offsetLeft = 0;
                    do {
                        offsetLeft += element.offsetLeft;
                    } while ((element = element.offsetParent) != null);
                    return offsetLeft;
                }
                if (typeof e.offsetX === 'undefined' || e.offsetX === null) {
                    if (typeof e.layerX === 'undefined' || e.layerX === null) {
                        if (typeof e.pageX === 'undefined' || e.pageX === null) {
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
                };
            }

            //上下文菜单
            element.oncontextmenu = function (e) {
                let realTimeBulletScreen = getrealTimeBulletScreenByLocation(getLocation(e));
                if (realTimeBulletScreen)
                    eventTrigger('contextmenu', realTimeBulletScreen, e);
                return false;
            };
            //单击
            element.onclick = function (e) {
                let realTimeBulletScreen = getrealTimeBulletScreenByLocation(getLocation(e));
                if (realTimeBulletScreen)
                    eventTrigger('click', realTimeBulletScreen, e);
                return false;
            };
            //鼠标移动
            element.onmousemove = function (e) {
                let realTimeBulletScreen = getrealTimeBulletScreenByLocation(getLocation(e));
                _bulletScreensOnScreen.forEach((node) => {
                    let _realTimeBulletScreen = node.element;
                    if (realTimeBulletScreen != _realTimeBulletScreen && _realTimeBulletScreen.mousein) {
                        _realTimeBulletScreen.mousein = false;
                        element.style.cursor = '';
                        eventTrigger('mouseleave', _realTimeBulletScreen, e);
                    }
                }, true);
                if (realTimeBulletScreen === null || realTimeBulletScreen.mousein) return false;
                realTimeBulletScreen.mousein = true;
                element.style.cursor = options.cursorOnMouseOver;
                eventTrigger('mouseenter', realTimeBulletScreen, e);
                return false;
            }
            //鼠标离开
            element.onmouseout = function (e) {
                _bulletScreensOnScreen.forEach((node) => {
                    let _realTimeBulletScreen = node.element;
                    if (_realTimeBulletScreen.mousein) {
                        _realTimeBulletScreen.mousein = false;
                        element.style.cursor = '';
                        eventTrigger('mouseleave', _realTimeBulletScreen, e);
                    }
                }, true);
            }
        }
    }
}

