import GeneralCanvasBaseRenderer from './generalCanvasBaseRenderer'
import BrowserNotSupportError from '../errors/browserNotSupportError'

/**
 * Canvas 渲染器类
 */
class GeneralCanvasRenderer extends GeneralCanvasBaseRenderer {
    /**
     * 实例化一个 Canvas 渲染器类
     * @param {object} element - Element 元素
     * @param {openBSE~Options} options - 全局选项
     * @param {object} elementSize - 元素大小
     * @param {Event} eventTrigger - 事件引发方法
     * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
     */
    constructor(element, options, elementSize, eventTrigger) {
        supportCheck(); //浏览器支持检测
        super(element, options, elementSize, eventTrigger);
        /**
         * 屏幕上的弹幕
         * @private @type {LinkedList}
         */
        let _bulletScreensOnScreen = this.getBulletScreensOnScreen();

        let _cleanScreen = this.cleanScreen;

        /**
         * canvas 上下文
         * @private @type {object}
         */
        let _canvasContext;
        /**
         * Canvas 元素
         * @private @type {object}
         */
        let _canvas = this.getCanvas();
        init.call(this);

        /**
         * 清除屏幕内容
         * @override
         */
        this.cleanScreen = function () {
            _cleanScreen();
            _canvasContext.clearRect(0, 0, _canvas.width, _canvas.height);
        }

        let _setSize = this.setSize;
        /**
         * 设置尺寸
         * @override
         */
        this.setSize = function () {
            _setSize();
            let scale = this.getScale();
            _canvasContext.scale(scale, scale);
        }

        /**
         * 绘制函数
         * @override
         */
        this.draw = function () {
            _canvasContext.clearRect(0, 0, _canvas.width, _canvas.height);
            _bulletScreensOnScreen.forEach((node) => {
                let realTimeBulletScreen = node.element;
                if (this.checkWhetherHide(realTimeBulletScreen)) return;
                _canvasContext.drawImage(realTimeBulletScreen.hideCanvas, 
                    (realTimeBulletScreen.x - 4).toFixed(1), 
                    (realTimeBulletScreen.actualY - 4).toFixed(1), 
                    (realTimeBulletScreen.width + 8).toFixed(1), 
                    (realTimeBulletScreen.height + 8).toFixed(1)
                );
            }, true);
        }

        /**
         * 初始化
         */
        function init() {
            _canvasContext = _canvas.getContext('2d');
            let scale = this.getScale();
            _canvasContext.scale(scale, scale);
        }

        /**
         * 浏览器支持检测
         * @private
         * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
         */
        function supportCheck() {
            let canvas = document.createElement('canvas'); //canvas对象
            if (typeof canvas.getContext != 'function') throw new BrowserNotSupportError('Canvas');
            let context = canvas.getContext('2d');
            if (context === null) throw new BrowserNotSupportError('Canvas 2D');
            if (typeof context.fillText != 'function') throw new BrowserNotSupportError('Canvas 2D fillText Function');
        }
    }
}
export default GeneralCanvasRenderer
