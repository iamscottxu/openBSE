import { Resources } from '../resources'

/**
 * 渲染器
 * @private @constant
 */
const RENDERERS = {
    /**
     * CSS3 渲染模式
     * @private @readonly
     */
    css3: require('./css3Renderer').CSS3Renderer,
    /**
     * SVG 渲染模式
     * @private @readonly
     */
    svg: require('./svgRenderer').SVGRenderer,
    /**
     * WebGL 渲染模式
     * @private @readonly
     */
    webgl: require('./webglRenderer').WebGLRenderer,
    /**
     * Canvas 2D 渲染模式
     * @private @readonly
     */
    canvas: require('./canvasRenderer').CanvasRenderer
}

/**
 * 渲染器工厂
 */
class RenderersFactory {
    /**
     * 实例化一个渲染器工厂
     * @param {object} element - Element 元素
     * @param {openBSE~Options} options - 全局选项
     * @param {object} elementSize - 元素大小
     * @param {Event} eventTrigger - 事件引发方法
     */
    constructor(element, options, elementSize, eventTrigger) {
        /**
         * 获取渲染器
         * @param {string} renderMode - 渲染模式
         * @returns {BaseRenderer} 渲染器的实例
         * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
         * @throws {TypeError} 传入的参数错误时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
         */
        this.getRenderer = function (renderMode) {
            let renderer = RENDERERS[renderMode];
            if (typeof (renderer) === 'undefined') throw new TypeError(Resources.RENDER_MODE_ERROR.fillData({ renderMode: renderMode }));
            return new renderer(element, options, elementSize, eventTrigger);
        }
    }
}

export { RenderersFactory };