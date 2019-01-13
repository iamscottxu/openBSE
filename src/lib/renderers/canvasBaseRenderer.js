import { BaseRenderer } from './baseRenderer'
import { Linklist, LinkedList } from '../linkedList'

/**
 * Canvas 渲染器抽象类
 */
class CanvasBaseRenderer extends BaseRenderer {
    /**
     * 实例化一个 Canvas 渲染器抽象类
     * @param {object} element - Element 元素
     * @param {openBSE~Options} options - 全局选项
     * @param {object} elementSize - 元素大小
     * @param {function} eventTrigger - 事件引发方法
     */
    constructor(element, options, elementSize, eventTrigger) {
        if (new.target === CanvasBaseRenderer) {
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
        let _devicePixelRatio = typeof window.devicePixelRatio === 'undefined' ? 1 : window.devicePixelRatio;
        _devicePixelRatio *= options.scaling;
        /**
         * 画布元素
         * @private @type {Element}
         */
        let _canvas = init();
        super(_canvas, options, elementSize);

        /**
         * 创建弹幕元素
         * @override
         * @param {object} bulletScreenOnScreen - 屏幕弹幕对象
         */
        this.creatAndgetWidth = function (bulletScreenOnScreen) {
            let bulletScreen = bulletScreenOnScreen.bulletScreen;
            let hideCanvas = document.createElement('canvas');
            let hideCanvasContext = hideCanvas.getContext('2d');

            hideCanvasContext.font = `${bulletScreen.style.fontWeight} ${bulletScreenOnScreen.size}px ${bulletScreen.style.fontFamily}`;
            bulletScreenOnScreen.width = hideCanvasContext.measureText(bulletScreen.text).width; //弹幕的宽度：像素

            hideCanvas.width = (bulletScreenOnScreen.width + 8) * _devicePixelRatio;
            hideCanvas.height = (bulletScreenOnScreen.height + 8) * _devicePixelRatio;

            hideCanvasContext.shadowColor = 'black';
            hideCanvasContext.font = `${bulletScreen.style.fontWeight} ${bulletScreenOnScreen.size * _devicePixelRatio}px ${bulletScreen.style.fontFamily}`;
            let textX = 4 * _devicePixelRatio;
            let textY = (4 + bulletScreenOnScreen.size * 0.8) * _devicePixelRatio;
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
            bulletScreenOnScreen.hideCanvas = hideCanvas;

            if (_bulletScreensOnScreen.getLength() === 0) _bulletScreensOnScreen.push(bulletScreenOnScreen, true);
            let flag = false;
            _bulletScreensOnScreen.forEach((_bulletScreenOnScreen) => {
                if (_bulletScreenOnScreen.bulletScreen.layer <= bulletScreen.layer) {
                    flag = true;
                    return {
                        add: { element: bulletScreenOnScreen, addToUp: false },
                        stop: true
                    }
                }
            }, false);
            if (!flag) _bulletScreensOnScreen.push(bulletScreenOnScreen, false);
        }

        /**
         * 删除弹幕元素
         * @override
         * @param {object} bulletScreenOnScreen - 屏幕弹幕对象
         */
        this.delete = (bulletScreenOnScreen) => _bulletScreensOnScreen.forEach((_bulletScreenOnScreen) =>
            _bulletScreenOnScreen === bulletScreenOnScreen ? { remove: true, stop: true } : null
        );

        /**
         * 重新添加弹幕
         * @override
         * @param {object} bulletScreenOnScreen - 屏幕弹幕对象
         */
        this.reCreatAndgetWidth = function (bulletScreenOnScreen) {
            this.delete(bulletScreenOnScreen);
            this.creatAndgetWidth(bulletScreenOnScreen);
        }

        let _setSize = this.setSize;
        /**
         * 设置尺寸
         * @override
         */
        this.setSize = function () {
            _setSize();
            _devicePixelRatio = typeof window.devicePixelRatio === 'undefined' ? 1 : window.devicePixelRatio;
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
         * 获取屏幕弹幕对象
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
            element.innerHTML = '';
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
            function getBulletScreenOnScreenByLocation(location) {
                let _bulletScreenOnScreen = null;
                _bulletScreensOnScreen.forEach(function (bulletScreenOnScreen) {
                    if (_checkWhetherHide(bulletScreenOnScreen)) return;
                    let x1 = bulletScreenOnScreen.x - 4;
                    let x2 = x1 + bulletScreenOnScreen.width + 8;
                    let y1 = bulletScreenOnScreen.actualY - 4;
                    let y2 = y1 + bulletScreenOnScreen.height + 8;
                    if (location.x >= x1 && location.x <= x2 && location.y >= y1 && location.y <= y2) {
                        _bulletScreenOnScreen = bulletScreenOnScreen;
                        return { stop: true };
                    }
                }, false);
                return _bulletScreenOnScreen;
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
                let bulletScreenOnScreen = getBulletScreenOnScreenByLocation(getLocation(e));
                if (bulletScreenOnScreen)
                    eventTrigger('contextmenu', bulletScreenOnScreen);
                return false;
            };
            //单击
            element.onclick = function (e) {
                let bulletScreenOnScreen = getBulletScreenOnScreenByLocation(getLocation(e));
                if (bulletScreenOnScreen)
                    eventTrigger('click', bulletScreenOnScreen);
                return false;
            };
            //鼠标移动
            element.onmousemove = function (e) {
                let bulletScreenOnScreen = getBulletScreenOnScreenByLocation(getLocation(e));
                _bulletScreensOnScreen.forEach((_bulletScreenOnScreen) => {
                    if (bulletScreenOnScreen != _bulletScreenOnScreen && _bulletScreenOnScreen.mousein) {
                        _bulletScreenOnScreen.mousein = false;
                        eventTrigger('mouseleave', _bulletScreenOnScreen);
                    }
                }, true);
                if (bulletScreenOnScreen === null || bulletScreenOnScreen.mousein) return false;
                bulletScreenOnScreen.mousein = true;
                eventTrigger('mouseenter', bulletScreenOnScreen);
                return false;
            }
            //鼠标离开
            element.onmouseout = function (e) {
                _bulletScreensOnScreen.forEach((_bulletScreenOnScreen) => {
                    if (_bulletScreenOnScreen.mousein) {
                        _bulletScreenOnScreen.mousein = false;
                        eventTrigger('mouseleave', _bulletScreenOnScreen);
                    }
                }, true);
            }
        }
    }
}

export { CanvasBaseRenderer };