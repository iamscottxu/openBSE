import GeneralCanvasBaseRenderer from './generalCanvasBaseRenderer'
import BrowserNotSupportError from '../errors/browserNotSupportError'
import VertexShaderSource  from './glsl/generalVertexShader'
import FragmentShaderSource from './glsl/generalFragmentShader'

/**
 * WebGL 渲染器类
 */
class GeneralWebglRenderer extends GeneralCanvasBaseRenderer {
    /**
     * 实例化一个 WebGL 渲染器类
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
        /**
         * WebGL 上下文对象
         * @private @type {object}
         */
        let _webglContext;
        let _positionAttributeLocation;
        let _resolutionUniformLocation;
        /**
         * Canvas 元素
         * @private @type {object}
         */
        let _canvas = this.getCanvas();
        init();

        let _cleanScreen = this.cleanScreen;
        /**
         * 清除屏幕内容
         * @override
         */
        this.cleanScreen = function () {
            _cleanScreen();
            _webglContext.clear(_webglContext.COLOR_BUFFER_BIT);
        }

        /**
         * 绘制函数
         * @override
         */
        this.draw = function () {
            let devicePixelRatio = this.getDevicePixelRatio();
            // 清空画布
            _webglContext.clear(_webglContext.COLOR_BUFFER_BIT);
            _bulletScreensOnScreen.forEach((node) => {
                let realTimeBulletScreen = node.element;
                if (this.checkWhetherHide(realTimeBulletScreen)) return;
                // 四个顶点坐标
                let x1 = (realTimeBulletScreen.x - 4) * devicePixelRatio;
                let x2 = x1 + (realTimeBulletScreen.width + 8) * devicePixelRatio;
                let y1 = (realTimeBulletScreen.actualY - 4) * devicePixelRatio;
                let y2 = y1 + (realTimeBulletScreen.height + 8) * devicePixelRatio;
                //绑定纹理
                _webglContext.bindTexture(_webglContext.TEXTURE_2D, realTimeBulletScreen.texture2D);
                //绑定范围
                let positionBuffer = _webglContext.createBuffer();
                // 将绑定点绑定到缓冲数据（positionBuffer）
                _webglContext.bindBuffer(_webglContext.ARRAY_BUFFER, positionBuffer);
                _webglContext.enableVertexAttribArray(_positionAttributeLocation);
                // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
                _webglContext.vertexAttribPointer(_positionAttributeLocation, 2, //size 每次迭代运行提取两个单位数据
                    _webglContext.FLOAT, //type 每个单位的数据类型是32位浮点型
                    false, //normalize 不需要归一化数据
                    0, //stride 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
                    // 每次迭代运行运动多少内存到下一个数据开始点
                    0 //offset 从缓冲起始位置开始读取
                );
                _webglContext.bufferData(_webglContext.ARRAY_BUFFER, new Float32Array([x1, y1,
                    x2, y1,
                    x1, y2,
                    x1, y2,
                    x2, y1,
                    x2, y2]), _webglContext.STATIC_DRAW);
                //绘制
                _webglContext.drawArrays(_webglContext.TRIANGLES, //primitiveType
                    0, //offset
                    6 //count
                );
            }, true);
        }

        let _creatAndgetWidth = this.creatAndgetWidth;
        /**
         * 创建弹幕元素
         * @override
         * @param {object} realTimeBulletScreen - 实时弹幕对象
         */
        this.creatAndgetWidth = function (realTimeBulletScreen) {
            _creatAndgetWidth(realTimeBulletScreen);
            let texture = _webglContext.createTexture();
            _webglContext.bindTexture(_webglContext.TEXTURE_2D, texture);
            // 设置参数
            _webglContext.texParameteri(_webglContext.TEXTURE_2D, _webglContext.TEXTURE_MIN_FILTER, _webglContext.NEAREST);
            _webglContext.texParameteri(_webglContext.TEXTURE_2D, _webglContext.TEXTURE_MAG_FILTER, _webglContext.NEAREST);
            _webglContext.texParameteri(_webglContext.TEXTURE_2D, _webglContext.TEXTURE_WRAP_S, _webglContext.CLAMP_TO_EDGE);
            _webglContext.texParameteri(_webglContext.TEXTURE_2D, _webglContext.TEXTURE_WRAP_T, _webglContext.CLAMP_TO_EDGE);
            _webglContext.texImage2D(_webglContext.TEXTURE_2D, 0, _webglContext.RGBA, _webglContext.RGBA, _webglContext.UNSIGNED_BYTE, realTimeBulletScreen.hideCanvas);
            realTimeBulletScreen.texture2D = texture;
        }

        let _setSize = this.setSize;
        /**
         * 设置尺寸
         * @override
         */
        this.setSize = function () {
            _setSize();
            _webglContext.viewport(0, 0, _canvas.width, _canvas.height);
            _webglContext.uniform2f(_resolutionUniformLocation, _canvas.width, _canvas.height); // 设置全局变量 分辨率
        }

        /**
         * 初始化
         */
        function init() {
            // 创建着色器方法，输入参数：渲染上下文，着色器类型，数据源
            let createShader = function (gl, type, source) {
                let shader = gl.createShader(type); // 创建着色器对象
                gl.shaderSource(shader, source); // 提供数据源
                gl.compileShader(shader); // 编译 -> 生成着色器
                let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
                if (success) {
                    return shader;
                }
                gl.deleteShader(shader);
            };
            // 创建着色程序，输入参数：渲染上下文，顶点着色器，片段着色器
            let createProgram = function (gl, vertexShader, fragmentShader) {
                let program = gl.createProgram();
                gl.attachShader(program, vertexShader);
                gl.attachShader(program, fragmentShader);
                gl.linkProgram(program);
                let success = gl.getProgramParameter(program, gl.LINK_STATUS);
                if (success) {
                    return program;
                }
                gl.deleteProgram(program);
            };
            
            _webglContext = _canvas.getContext('webgl');
            _webglContext.enable(_webglContext.BLEND); //开启混合功能
            _webglContext.clearColor(0, 0, 0, 0); //设置清除颜色
            _webglContext.blendFunc(_webglContext.SRC_ALPHA, _webglContext.ONE_MINUS_SRC_ALPHA);
            let vertexShader = createShader(_webglContext, _webglContext.VERTEX_SHADER, VertexShaderSource); //创建顶点着色器
            let fragmentShader = createShader(_webglContext, _webglContext.FRAGMENT_SHADER, FragmentShaderSource); //创建片段着色器
            let program = createProgram(_webglContext, vertexShader, fragmentShader); //创建着色程序
            _webglContext.useProgram(program);
            _positionAttributeLocation = _webglContext.getAttribLocation(program, 'a_position');
            let texcoordAttributeLocation = _webglContext.getAttribLocation(program, 'a_texcoord');
            _resolutionUniformLocation = _webglContext.getUniformLocation(program, 'u_resolution');
            _webglContext.viewport(0, 0, _canvas.width, _canvas.height);
            _webglContext.uniform2f(_resolutionUniformLocation, _canvas.width, _canvas.height); // 设置全局变量 分辨率
            //绑定范围
            let texcoordBuffer = _webglContext.createBuffer();
            // 将绑定点绑定到缓冲数据（texcoordBuffer）
            _webglContext.bindBuffer(_webglContext.ARRAY_BUFFER, texcoordBuffer);
            _webglContext.enableVertexAttribArray(texcoordAttributeLocation);
            // 以浮点型格式传递纹理坐标
            _webglContext.vertexAttribPointer(texcoordAttributeLocation, 2, //size 每次迭代运行提取两个单位数据
                _webglContext.FLOAT, //type 每个单位的数据类型是32位浮点型
                false, //normalize 不需要归一化数据 
                0, //stride 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
                // 每次迭代运行运动多少内存到下一个数据开始点
                0 //offset 从缓冲起始位置开始读取
            );
            _webglContext.bufferData(_webglContext.ARRAY_BUFFER, new Float32Array([0, 0,
                1, 0,
                0, 1,
                0, 1,
                1, 0,
                1, 1]), _webglContext.STATIC_DRAW);
        }

        /**
         * 浏览器支持检测
         * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
         */
        function supportCheck() {
            let canvas = document.createElement('canvas'); //canvas对象
            if (typeof canvas.getContext != 'function') throw new BrowserNotSupportError('Canvas');
            let context = canvas.getContext('2d');
            if (context === null) throw new BrowserNotSupportError('Canvas 2D');
            if (typeof context.fillText != 'function') throw new BrowserNotSupportError('Canvas 2D fillText Function');
            canvas = document.createElement('canvas'); //canvas对象
            context = canvas.getContext('webgl');
            if (context === null) throw new BrowserNotSupportError('WebGL');
        }
    }
}
export default GeneralWebglRenderer
