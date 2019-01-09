import { CanvasBaseRenderer } from './canvasBaseRenderer'

class CanvasRenderer extends CanvasBaseRenderer {
    constructor(element, options, elementSize, event, bulletScreensOnScreen) {
        super(element, options, elementSize, event, bulletScreensOnScreen);

        this.cleanScreen = function () {
            this.getCanvas().getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
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
    }
}

export { CanvasRenderer };