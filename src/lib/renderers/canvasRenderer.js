import { CanvasBaseRenderer } from './canvasBaseRenderer'
import { BrowserNotSupportError } from '../../browserNotSupportError'

/**
 * Canvas 渲染器类
 */
class CanvasRenderer extends CanvasBaseRenderer {
    /**
     * 实例化一个 Canvas 渲染器类
     * @param {object} element - Element 元素
     * @param {openBSE~Options} options - 全局选项
     * @param {object} elementSize - 元素大小
     * @param {Event} event - 事件对象
     * @param {object} bulletScreensOnScreen - 屏幕弹幕列表对象
     * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
     */
    constructor(element, options, elementSize, event, bulletScreensOnScreen) {
        supportCheck(); //浏览器支持检测
        super(element, options, elementSize, event, bulletScreensOnScreen);

        /**
         * 清除屏幕内容
         * @override
         */
        this.cleanScreen = function () {
            let canvas = this.getCanvas();
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        }

        /**
         * 绘制函数
         * @override
         */
        this.draw = function () {
            let canvas = this.getCanvas();
            let devicePixelRatio = this.getDevicePixelRatio();
            //离屏渲染
            let hideCanvas = document.createElement('canvas');
            hideCanvas.width = canvas.width;
            hideCanvas.height = canvas.height;
            let hideCanvasContext = hideCanvas.getContext('2d');
            bulletScreensOnScreen.forEach((bulletScreenOnScreen) => {
                if (this.checkWhetherHide(bulletScreenOnScreen)) return;
                hideCanvasContext.drawImage(bulletScreenOnScreen.hideCanvas, (bulletScreenOnScreen.x - 4) * devicePixelRatio, (bulletScreenOnScreen.actualY - 4) * devicePixelRatio, (bulletScreenOnScreen.width + 8) * devicePixelRatio, (bulletScreenOnScreen.height + 8) * devicePixelRatio);
            }, true);
            let canvasContext = canvas.getContext('2d');
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);
            canvasContext.drawImage(hideCanvas, 0, 0);
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

export { CanvasRenderer };