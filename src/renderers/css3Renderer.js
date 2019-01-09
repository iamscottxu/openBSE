import { BaseRenderer } from './baseRenderer'

class CSS3Renderer extends BaseRenderer {
    constructor(element, options, elementSize, event, bulletScreensOnScreen) {
        let _div = init();
        super(_div, options, elementSize);

        this.cleanScreen = function () {
            _div.innerHTML = '';
        }

        /**
         * 绘制函数
         * @function
         */
        this.draw = function () {
            bulletScreensOnScreen.forEach((bulletScreenOnScreen) => {
                bulletScreenOnScreen.div.style.transform =
                    bulletScreenOnScreen.div.style.webkitTransform =
                    bulletScreenOnScreen.div.style.msTransform =
                    `translate(${(bulletScreenOnScreen.x - 4)}px,${(bulletScreenOnScreen.actualY - 4)}px)`;
            }, true);
        }

        /**
         * 创建弹幕元素
         * @function
         * @property {Object} bulletScreenOnScreen 屏幕弹幕对象
         */
        this.creatAndgetWidth = function (bulletScreenOnScreen) {
            let bulletScreen = bulletScreenOnScreen.bulletScreen;
            let bulletScreenDiv = document.createElement('div');
            bulletScreenDiv.style.position = 'absolute';
            bulletScreenDiv.style.whiteSpace = 'nowrap';
            bulletScreenDiv.style.fontWeight = bulletScreen.style.fontWeight;
            bulletScreenDiv.style.fontSize = `${bulletScreenOnScreen.size}px`;
            bulletScreenDiv.style.fontFamily = bulletScreen.style.fontFamily;
            bulletScreenDiv.style.lineHeight = `${bulletScreenOnScreen.size}px`;
            bulletScreenDiv.style.textShadow = `0 0 ${bulletScreen.style.shadowBlur}px black`;
            bulletScreenDiv.style.color = bulletScreen.style.color;
            if (bulletScreen.style.borderColor != null) {
                bulletScreenDiv.style.textStroke = bulletScreenDiv.style.webkitTextStroke = '0.5px';
                bulletScreenDiv.style.textStrokeColor = bulletScreenDiv.style.webkitTextStrokeColor = bulletScreen.borderColor;
            }
            if (bulletScreen.style.boxColor != null) {
                bulletScreenDiv.style.padding = '3px';
                bulletScreenDiv.style.border = '1px solid';
                bulletScreenDiv.style.borderColor = bulletScreen.style.boxColor;
            }
            else {
                bulletScreenDiv.style.padding = '4px';
            }
            bulletScreenDiv.innerText = bulletScreen.text;
            bulletScreenDiv.bulletScreen = bulletScreen;
            _div.appendChild(bulletScreenDiv);
            bulletScreenOnScreen.width = bulletScreenDiv.clientWidth - 8; //弹幕的宽度：像素
            bulletScreenOnScreen.div = bulletScreenDiv;
        }

         /**
         * 删除弹幕元素
         * @function
         * @property {Object} bulletScreenOnScreen 屏幕弹幕对象
         */
        this.delete = function (bulletScreenOnScreen) {
            _div.removeChild(bulletScreenOnScreen.div);
        }

        /**
         * 添加Div
         * @function
         * @private
         * @returns {Element} Div
         */
        function init() {
            let div = document.createElement('div'); //DIV
            element.innerHTML = '';
            element.appendChild(div);
            div.style.overflow = 'hidden';
            div.style.padding = '0';
            div.style.margin = '0';
            div.style.userSelect = 
            div.style.webkitUserSelect = 
            div.style.msUserSelect = 'none';
            div.style.cursor = 'default';
            registerEvent(div); //注册事件响应程序
            return div;
        }

        /**
         * 注册事件响应程序
         * @function
         * @private
         * @property {Element} element 元素
         */
        function registerEvent(element) {
            //上下文菜单
            element.oncontextmenu = function (e) {
                if (e.target != this)
                    event.trigger('contextmenu', {
                        bulletScreen: e.target.bulletScreen
                    });
                return false;
            };
            //单击
            element.onclick = function (e) {
                if (e.target != this)
                    event.trigger('click', {
                        bulletScreen: e.target.bulletScreen
                    });
                return false;
            };
        }
    }
}

export { CSS3Renderer };