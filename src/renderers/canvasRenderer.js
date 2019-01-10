import { CanvasBaseRenderer } from './canvasBaseRenderer'

class CanvasRenderer extends CanvasBaseRenderer {
    constructor(element, options, elementSize, event, bulletScreensOnScreen) {
        supportCheck();
        super(element, options, elementSize, event, bulletScreensOnScreen);

        this.cleanScreen = function () {
            let canvas = this.getCanvas();
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        }

        /**
         * 绘制函数
         * @function
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
                hideCanvasContext.drawImage(bulletScreenOnScreen.hideCanvas, (bulletScreenOnScreen.x - 4) * devicePixelRatio, (bulletScreenOnScreen.actualY - 4) * devicePixelRatio, (bulletScreenOnScreen.width + 8) * devicePixelRatio, (bulletScreenOnScreen.height + 8) * devicePixelRatio);
            }, true);
            let canvasContext = canvas.getContext('2d');
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);
            canvasContext.drawImage(hideCanvas, 0, 0);
        }

        /**
         * 支持检测
         * @function
         */
        function supportCheck(){
            let canvas = document.createElement('canvas'); //canvas对象
            if (typeof(canvas.getContext) != 'function') throw new Error('This browser does not support Canvas.');
            let context = canvas.getContext('2d');
            if (context === null) throw new Error('This browser does not support Canvas 2D.');
            if (typeof(context.fillText).fillText != 'function') throw new Error('This browser does not support Canvas 2D fillText function.');
        }
    }
}

export { CanvasRenderer };