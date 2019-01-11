class BaseRenderer {
    constructor(element, options, elementSize) {
        if (new.target === BaseRenderer) {
            throw new Error();
        }

        init(); //初始化

        /**
         * 隐藏弹幕
         * @private @type {Boolean}
         */
        let _hide = false;

        /**
         * 透明度
         * @private @type {Float}
         */
        let _opacity = 0.0;

        this.cleanScreen = function () {
            throw new Error();
        }

        /**
         * 隐藏弹幕。
         * @function
         */
        this.hide = function () {
            _hide = true;
            element.style.visibility = 'hidden';
        }

        /**
         * 显示弹幕。
         * @function
         */
        this.show = function () {
            _hide = false;
            element.style.visibility = 'visible';
        }

        /**
         * 设置弹幕不透明度。
         * @function
         * @param {Float} opacity 弹幕不透明度：取值范围 0.0 到 1.0，0.0 全透明；1.0 不透明。
         */
        this.setOpacity = function (opacity) {
            if (typeof (opacity) != 'number') throw new Error();
            _opacity = opacity;
            element.style.opacity = _opacity;
        }

        /**
         * 获取弹幕不透明度。
         * @function
         * @returns {Float} 弹幕不透明度：取值范围 0.0 到 1.0，0.0 全透明；1.0 不透明。
         */
        this.getOpacity = () => _opacity;

        /**
         * 获取弹幕可见性。
         * @function
         * @returns {Boolean}  指示弹幕是否可见。
         * @description 获取弹幕可见性。如要显示弹幕请调用 [bulletScreenEngine.show();]{@link BulletScreenEngine#show} ，要隐藏弹幕请调用 [bulletScreenEngine.hide();]{{@link BulletScreenEngine#hide}} 。
         */
        this.getVisibility = () => !_hide;

        /**
         * 绘制函数
         * @function
         */
        this.draw = function () {
            throw new Error();
        }

        /**
         * 创建弹幕元素
         * @function
         * @property {Object} bulletScreenOnScreen 屏幕弹幕对象
         */
        this.creatAndgetWidth = function (bulletScreenOnScreen) {
            throw new Error();
        }

        /**
         * 删除弹幕元素
         * @function
         * @property {Object} bulletScreenOnScreen 屏幕弹幕对象
         */
        this.delete = function (bulletScreenOnScreen) {
            throw new Error();
        }

        /**
         * 设置尺寸
         * @function
         */
        this.setSize = setSize;

        function setSize() {
            element.style.width = `${elementSize.width}px`;
            element.style.height = `${elementSize.height}px`;
            if (options.scaling != 1) {
                element.style.transform =
                    element.style.webkitTransform =
                    element.style.msTransform = `scale(${options.scaling},${options.scaling})`;
                element.style.transformOrigin =
                    element.style.webkitTransformOrigin =
                    element.style.msTransformOrigin = `left top`;
            } else {
                element.style.transform =
                    element.style.webkitTransform =
                    element.style.msTransform =
                    element.style.transformOrigin =
                    element.style.webkitTransformOrigin =
                    element.style.msTransformOrigin = '';
            }
        }

        /**
         * 初始化
         * @function
         * @private
         */
        function init() {
            setSize();
            element.style.position = 'relative';
        }
    }
}

export { BaseRenderer };