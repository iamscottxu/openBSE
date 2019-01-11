import { BaseRenderer } from './baseRenderer'

class CanvasBaseRenderer extends BaseRenderer {
    constructor(element, options, elementSize, event, bulletScreensOnScreen) {
        if (new.target === CanvasBaseRenderer) {
            throw new Error();
        }

        let _devicePixelRatio = typeof (window.devicePixelRatio) === 'undefined' ? 1 : window.devicePixelRatio;
        _devicePixelRatio *= options.scaling;
        let _canvas = init();
        super(_canvas, options, elementSize);

        /**
         * 创建弹幕元素
         * @function
         * @property {Object} bulletScreenOnScreen 屏幕弹幕对象
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
        }

        /**
         * 删除弹幕元素
         * @function
         * @property {Object} bulletScreenOnScreen 屏幕弹幕对象
         */
        this.delete = function (bulletScreenOnScreen) {

        }

        let _setSize = this.setSize;
        /**
         * 设置尺寸
         * @function
         */
        this.setSize = function () {
            _setSize();
            _devicePixelRatio = typeof (window.devicePixelRatio) === 'undefined' ? 1 : window.devicePixelRatio;
            _devicePixelRatio *= options.scaling;
            _canvas.width = elementSize.width * _devicePixelRatio;
            _canvas.height = elementSize.height * _devicePixelRatio;
        }

        /**
         * 获取缩放比例
         * @function
         * @returns {Float} 缩放比例
         */
        this.getDevicePixelRatio = () => _devicePixelRatio;

        /**
         * 获取画布对象
         * @function
         * @returns {Element} 画布对象
         */
        this.getCanvas = () => _canvas;

        /**
         * 添加Canvas
         * @function
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

        /**
         * 注册事件响应程序
         * @function
         * @private
         * @property {Element} element 元素
         */
        function registerEvent(element) {
            function getBulletScreenOnScreenByLocation(location) {
                let bulletScreen = null;
                bulletScreensOnScreen.forEach(function (bulletScreenOnScreen) {
                    let x1 = bulletScreenOnScreen.x - 4;
                    let x2 = x1 + bulletScreenOnScreen.width + 8;
                    let y1 = bulletScreenOnScreen.actualY - 4;
                    let y2 = y1 + bulletScreenOnScreen.height + 8;
                    if (location.x >= x1 && location.x <= x2 && location.y >= y1 && location.y <= y2) {
                        bulletScreen = bulletScreenOnScreen.bulletScreen;
                        return { stop: true };
                    }
                }, false);
                return bulletScreen;
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
                };
            }

            //上下文菜单
            element.oncontextmenu = function (e) {
                let bulletScreen = getBulletScreenOnScreenByLocation(getLocation(e));
                if (bulletScreen)
                    event.trigger('contextmenu', {
                        bulletScreen: bulletScreen
                    });
                return false;
            };
            //单击
            element.onclick = function (e) {
                let bulletScreen = getBulletScreenOnScreenByLocation(getLocation(e));
                if (bulletScreen)
                    event.trigger('click', {
                        bulletScreen: bulletScreen
                    });
                return false;
            };
        }
    }
}

export { CanvasBaseRenderer };