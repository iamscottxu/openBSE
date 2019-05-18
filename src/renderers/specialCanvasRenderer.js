import SpecialBaseRenderer from './specialBaseRenderer'
import BrowserNotSupportError from '../errors/browserNotSupportError'
import LinkedList from '../lib/linkedList'
import Helper from '../lib/helper';
import TransformFunctionsInterpreter from '../lib/transformFunctionsInterpreter'

/**
 * Canvas 渲染器类
 */
export default class SpecialCanvasRenderer extends SpecialBaseRenderer {
    /**
     * 实例化一个 Canvas 渲染器类
     * @param {object} element - Element 元素
     * @param {openBSE~Options} options - 全局选项
     * @param {object} elementSize - 元素大小
     * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
     */
    constructor(element, options, elementSize) {
        /**
         * 屏幕上的弹幕
         * @private @type {LinkedList}
         */
        let _bulletScreensOnScreen = new LinkedList();
        /**
         * transform-functions 解释器
         */
        let _transformFunctionsInterpreter = new TransformFunctionsInterpreter();
        /**
         * DPI 缩放比例（倍数）
         * @private @type {number}
         */
        let _devicePixelRatio = Helper.getDevicePixelRatio(true);
        _devicePixelRatio *= options.scaling;

        supportCheck(); //浏览器支持检测
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
        this.cleanScreen = function() {
            _bulletScreensOnScreen.clean();
            _canvas.getContext('2d').clearRect(0, 0, _canvas.width, _canvas.height);
        }

        /**
         * 绘制函数
         * @override
         */
        this.draw = function () {
            let canvasContext = _canvas.getContext('2d');
            canvasContext.clearRect(0, 0, _canvas.width, _canvas.height);
            _bulletScreensOnScreen.forEach((node) => {
                let realTimeBulletScreen = node.element;
                canvasContext.drawImage(realTimeBulletScreen.hideCanvas, 0, 0);
            }, true);
        }

        /**
         * 刷新弹幕样式 
         * @override
         * @param {object} realTimeBulletScreen - 实时弹幕对象
        */
        this.refresh = function (oldStyle, realTimeBulletScreen) {
            if (oldStyle === null ||
                // 弹幕文本
                oldStyle.text != realTimeBulletScreen.style.text ||
                // 阴影的模糊级别，0为不显示阴影
                oldStyle.shadowBlur != realTimeBulletScreen.style.shadowBlur ||
                // 字体粗细
                oldStyle.fontWeight != realTimeBulletScreen.style.fontWeight ||
                // 字体系列
                oldStyle.fontFamily != realTimeBulletScreen.style.fontFamily ||
                // 字体大小（单位：像素）
                oldStyle.size != realTimeBulletScreen.style.size ||
                // 外框颜色
                oldStyle.boxColor != realTimeBulletScreen.style.boxColor ||
                // 字体颜色
                oldStyle.color != realTimeBulletScreen.style.color ||
                // 描边颜色
                oldStyle.borderColor != realTimeBulletScreen.style.borderColor) drawHideTextCanvas(realTimeBulletScreen);
            if (oldStyle === null || oldStyle.transform != realTimeBulletScreen.style.transform) {
                let hideCanvas = document.createElement('canvas');
                let hideCanvasContext = hideCanvas.getContext('2d');
                hideCanvas.width = _canvas.width;
                hideCanvas.height = _canvas.height;
                setTransform(_transformFunctionsInterpreter.toObject(realTimeBulletScreen.style.transform), hideCanvasContext, realTimeBulletScreen.hideTextCanvas);
                realTimeBulletScreen.hideCanvas = hideCanvas;
            }
        }

        /**
         * 创建弹幕元素
         * @override
         * @param {object} realTimeBulletScreen - 实时弹幕对象
         */
        this.creat = function (realTimeBulletScreen) {
            this.refresh(null, realTimeBulletScreen);
            realTimeBulletScreen.linkedListNode = new LinkedList.node(realTimeBulletScreen);
            _bulletScreensOnScreen.push(realTimeBulletScreen.linkedListNode, false);
        }

        /**
         * 删除弹幕元素
         * @override
         * @param {object} realTimeBulletScreen - 实时弹幕对象
         */
        this.delete = (realTimeBulletScreen) => realTimeBulletScreen.linkedListNode.remove();

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

        function drawHideTextCanvas(realTimeBulletScreen) {
            let hideTextCanvas = document.createElement('canvas');
            let hideTextCanvasContext = hideTextCanvas.getContext('2d');

            hideTextCanvasContext.font = `${realTimeBulletScreen.style.fontWeight} ${realTimeBulletScreen.style.size * _devicePixelRatio}px ${realTimeBulletScreen.style.fontFamily}`;
            realTimeBulletScreen.width = hideTextCanvasContext.measureText(realTimeBulletScreen.style.text).width; //弹幕的宽度：像素

            hideTextCanvas.width = realTimeBulletScreen.width + 8 * _devicePixelRatio;
            hideTextCanvas.height = (realTimeBulletScreen.style.size + 8) * _devicePixelRatio;

            hideTextCanvasContext.shadowColor = 'black';
            hideTextCanvasContext.font = `${realTimeBulletScreen.style.fontWeight} ${realTimeBulletScreen.style.size * _devicePixelRatio}px ${realTimeBulletScreen.style.fontFamily}`;
            let textX = 4 * _devicePixelRatio;
            let textY = (4 + realTimeBulletScreen.style.size * 0.8) * _devicePixelRatio;
            if (realTimeBulletScreen.style.color != null) {
                hideTextCanvasContext.shadowBlur = (realTimeBulletScreen.style.shadowBlur + 0.5) * _devicePixelRatio;
                hideTextCanvasContext.fillStyle = realTimeBulletScreen.style.color;
                hideTextCanvasContext.fillText(realTimeBulletScreen.style.text, textX, textY);
            }
            if (realTimeBulletScreen.style.borderColor != null) {
                hideTextCanvasContext.shadowBlur = 0;
                hideTextCanvasContext.lineWidth = 0.5 * _devicePixelRatio;
                hideTextCanvasContext.strokeStyle = realTimeBulletScreen.style.borderColor;
                hideTextCanvasContext.strokeText(realTimeBulletScreen.style.text, textX, textY);
            }
            if (realTimeBulletScreen.style.boxColor != null) {
                hideTextCanvasContext.shadowBlur = 0;
                hideTextCanvasContext.lineWidth = _devicePixelRatio;
                hideTextCanvasContext.strokeStyle = realTimeBulletScreen.style.boxColor;
                hideTextCanvasContext.strokeRect(_devicePixelRatio, _devicePixelRatio, hideTextCanvas.width - _devicePixelRatio, hideTextCanvas.height - _devicePixelRatio);
            }

            realTimeBulletScreen.hideTextCanvas = hideTextCanvas;
        }

        function setTransform(transformObject, canvasContext, textCanvas) {
            let width = textCanvas.width, height = textCanvas.height;
            let tx = 0, ty = 0;
            if (transformObject.translate) {
                tx = transformObject.translate.tx.value;
                ty = transformObject.translate.ty.value;
            }
            if (transformObject.translateX) tx = transformObject.translate.t.value;
            if (transformObject.translateY) ty = transformObject.translate.t.value;
            if (transformObject.rotate) {
                let halfWidth = width / 2, halfHeight = height / 2;
                canvasContext.translate(tx + halfWidth, ty + halfHeight);
                tx = - halfWidth;
                ty = - halfHeight;
                canvasContext.rotate(TransformFunctionsInterpreter.getAngleValue(transformObject.rotate.a));
            }
            if (transformObject.matrix) {
                canvasContext.transform(
                    transformObject.matrix.a.value,
                    transformObject.matrix.b.value,
                    transformObject.matrix.c.value,
                    transformObject.matrix.d.value,
                    transformObject.matrix.tx.value,
                    transformObject.matrix.ty.value
                )
            }
            canvasContext.drawImage(textCanvas, tx, ty, width, height);
        }

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
            return canvas;
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

