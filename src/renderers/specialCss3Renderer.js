import SpecialBaseRenderer from './specialBaseRenderer'
import BrowserNotSupportError from '../errors/browserNotSupportError'
import Helper from '../lib/helper';

/**
 * CSS3 渲染器类
 */
export default class SpecialCss3Renderer extends SpecialBaseRenderer {
    /**
     * 实例化一个 CSS3 渲染器类
     * @param {object} element - Element 元素
     * @param {openBSE~Options} options - 全局选项
     * @param {object} elementSize - 元素大小
     * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
     */
    constructor(element, options, elementSize) {
        supportCheck(); //浏览器支持检测
        let _div = init();
        super(_div, options, elementSize);

        /**
         * 清除屏幕内容
         * @override
         */
        this.cleanScreen = function () {
            Helper.cleanElement(_div);
        }

        /**
         * 绘制函数
         * @override
         */
        this.draw = function () {

        }

        /**
         * 刷新弹幕样式 
         * @override
         * @param {object} realTimeBulletScreen - 实时弹幕对象
        */
        this.refresh = function (realTimeBulletScreen) {
            let bulletScreenDiv = realTimeBulletScreen.div;
            bulletScreenDiv.style.position = 'absolute';
            bulletScreenDiv.style.whiteSpace = 'nowrap';
            bulletScreenDiv.style.fontWeight = realTimeBulletScreen.style.fontWeight;
            bulletScreenDiv.style.fontSize = `${realTimeBulletScreen.style.size}px`;
            bulletScreenDiv.style.fontFamily = realTimeBulletScreen.style.fontFamily;
            bulletScreenDiv.style.lineHeight = `${realTimeBulletScreen.style.size}px`;
            bulletScreenDiv.style.color = realTimeBulletScreen.style.color;
            if (realTimeBulletScreen.style.shadowBlur != null)
                bulletScreenDiv.style.textShadow = `0 0 ${realTimeBulletScreen.style.shadowBlur}px black`;
            if (realTimeBulletScreen.style.borderColor != null) {
                bulletScreenDiv.style.textStroke = bulletScreenDiv.style.webkitTextStroke = `0.5px`;
                bulletScreenDiv.style.textStrokeColor = bulletScreenDiv.style.webkitTextStrokeColor = realTimeBulletScreen.style.borderColor;
            }
            if (realTimeBulletScreen.style.boxColor != null) {
                bulletScreenDiv.style.padding = '3px';
                bulletScreenDiv.style.border = '1px solid';
                bulletScreenDiv.style.borderColor = realTimeBulletScreen.style.boxColor;
            }
            else {
                bulletScreenDiv.style.padding = '4px';
            }
            bulletScreenDiv.style.transform = realTimeBulletScreen.style.transform;
            Helper.cleanElement(bulletScreenDiv);
            bulletScreenDiv.appendChild(document.createTextNode(realTimeBulletScreen.style.text));
        }

        /**
         * 创建弹幕元素
         * @override
         * @param {object} realTimeBulletScreen - 实时弹幕对象
         */
        this.creat = function (realTimeBulletScreen) {
            let bulletScreenDiv = document.createElement('div');
            realTimeBulletScreen.div = bulletScreenDiv;
            this.refresh(realTimeBulletScreen);
            _div.appendChild(bulletScreenDiv);
        }

        /**
        * 删除弹幕元素
        * @override
        * @param {object} realTimeBulletScreen - 实时弹幕对象
        */
        this.delete = function (realTimeBulletScreen) {
            _div.removeChild(realTimeBulletScreen.div);
        }

        /**
         * 添加Div
         * @private
         * @returns {Element} Div
         */
        function init() {
            let div = document.createElement('div'); //DIV
            Helper.cleanElement(element);
            element.appendChild(div);
            div.style.overflow = 'hidden';
            div.style.padding = '0';
            div.style.margin = '0';
            div.style.userSelect =
                div.style.webkitUserSelect =
                div.style.msUserSelect = 'none';
            div.style.cursor = 'default';
            return div;
        }

        /**
         * 浏览器支持检测
         * @private
         * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
         */
        function supportCheck() {
            let style = document.createElement('div').style;
            if (
                typeof style.transform === 'undefined' &&
                typeof style.msTransform === 'undefined' &&
                typeof style.webkitTransform === 'undefined'
            ) throw new BrowserNotSupportError('CSS3 transform');
        }
    }
}

