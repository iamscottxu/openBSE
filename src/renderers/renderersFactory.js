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

class RenderersFactory {
    constructor(element, options, elementSize, event, bulletScreensOnScreen) {
        /**
         * 获取渲染器
         * @function
         * @param {String} renderMode - 渲染模式
         */
        this.getRenderer = function (renderMode) {
            let renderer = RENDERERS[renderMode];
            if (typeof(renderer) === 'undefined') throw new TypeError(`The render mode "${renderMode}" is undefined.`);
            return new renderer(element, options, elementSize, event, bulletScreensOnScreen);
        }
    }
}

export { RenderersFactory };