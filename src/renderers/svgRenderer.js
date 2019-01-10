import { BaseRenderer } from './baseRenderer'

class SVGRenderer extends BaseRenderer {
    constructor(element, options, elementSize, event, bulletScreensOnScreen) {
        let _div = init();
        let _svg;
        let _defsSvg;
        super(_div, options, elementSize);

        this.cleanScreen = function () {
            _svg.innerHTML = '';
            _defsSvg = createElementSVG('defs'); //defs
            _svg.appendChild(_defsSvg);
        }

        /**
         * 绘制函数
         * @function
         */
        this.draw = function () {
            bulletScreensOnScreen.forEach((bulletScreenOnScreen) => {
                for (let index in bulletScreenOnScreen.svg) {
                    bulletScreenOnScreen.svg[index].setAttribute('transform', `translate(${(bulletScreenOnScreen.x - 4)},${(bulletScreenOnScreen.actualY - 4)})`);
                }
            }, true);
        }

        /**
         * 创建弹幕元素
         * @function
         * @property {Object} bulletScreenOnScreen 屏幕弹幕对象
         */
        this.creatAndgetWidth = function (bulletScreenOnScreen) {
            let bulletScreen = bulletScreenOnScreen.bulletScreen;
            bulletScreenOnScreen.svg = {};

            let textSvg = createElementSVG('text');
            textSvg.setAttribute('x', 0);
            textSvg.setAttribute('y', bulletScreenOnScreen.size * 0.8);
            textSvg.setAttribute('font-family', bulletScreen.style.fontFamily);
            textSvg.setAttribute('font-size', bulletScreenOnScreen.size);
            textSvg.setAttribute('font-weight', bulletScreen.style.fontWeight);
            textSvg.setAttribute('fill', bulletScreen.style.color);
            textSvg.appendChild(document.createTextNode(bulletScreen.text));
            if (bulletScreen.style.borderColor != null) {
                textSvg.setAttribute('stroke', bulletScreen.borderColor);
                textSvg.setAttribute('stroke-width', 0.5);
            }

            if (bulletScreen.style.shadowBlur != null) {
                let filterId = `bulletScreenEngine_svgFilter_shadow_${bulletScreen.style.shadowBlur}`;
                let filterSvg = document.getElementById(filterId);
                if (filterSvg === null) {
                    filterSvg = createElementSVG('filter');
                    filterSvg.id = filterId;
                    filterSvg.setAttribute('x', '-100%');
                    filterSvg.setAttribute('y', '-100%');
                    filterSvg.setAttribute('width', '300%');
                    filterSvg.setAttribute('height', '300%');
                    let feOffsetSvg = createElementSVG('feOffset');
                    feOffsetSvg.setAttribute('result', 'offOut');
                    feOffsetSvg.setAttribute('in', 'SourceAlpha');
                    filterSvg.appendChild(feOffsetSvg);
                    let feGaussianBlurSvg = createElementSVG('feGaussianBlur');
                    feGaussianBlurSvg.setAttribute('result', 'blurOut');
                    feGaussianBlurSvg.setAttribute('in', 'offOut');
                    feGaussianBlurSvg.setAttribute('stdDeviation', bulletScreen.style.shadowBlur);
                    filterSvg.appendChild(feGaussianBlurSvg);
                    let feBlendSvg = createElementSVG('feBlend');
                    feBlendSvg.setAttribute('in', 'SourceGraphic');
                    feBlendSvg.setAttribute('in2', 'blurOut');
                    feBlendSvg.setAttribute('mode', 'normal');
                    filterSvg.appendChild(feBlendSvg);
                    filterSvg.bulletScreenCount = 0;
                    _defsSvg.appendChild(filterSvg);
                }
                filterSvg.bulletScreenCount++;
                textSvg.setAttribute('filter', `url(#${filterId})`);
                bulletScreenOnScreen.filterId = filterId;
            }

            _svg.appendChild(textSvg);
            bulletScreenOnScreen.svg.text = textSvg;
            bulletScreenOnScreen.width = textSvg.getComputedTextLength(); //弹幕的宽度：像素

            if (bulletScreen.style.boxColor != null) {
                let rectSvg = createElementSVG('rect');
                rectSvg.setAttribute('x', -3);
                rectSvg.setAttribute('y', -3);
                rectSvg.setAttribute('fill', 'none');
                rectSvg.setAttribute('height', bulletScreenOnScreen.height + 7);
                rectSvg.setAttribute('width', bulletScreenOnScreen.width + 7);
                rectSvg.setAttribute('stroke', bulletScreen.style.boxColor);
                rectSvg.setAttribute('stroke-width', 1);
                _svg.appendChild(rectSvg);
                bulletScreenOnScreen.svg.rect = rectSvg;
            }
        }

        /**
        * 删除弹幕元素
        * @function
        * @property {Object} bulletScreenOnScreen 屏幕弹幕对象
        */
        this.delete = function (bulletScreenOnScreen) {
            if (typeof (bulletScreenOnScreen.filterId) != 'undefined') {
                let filterSvg = document.getElementById(bulletScreenOnScreen.filterId);
                if (filterSvg != null && --filterSvg.bulletScreenCount === 0)
                    _defsSvg.removeChild(filterSvg);
            }
            for (let index in bulletScreenOnScreen.svg) {
                _svg.removeChild(bulletScreenOnScreen.svg[index]);
            }
        }

        let _setSize = this.setSize;
        /**
         * 设置尺寸
         * @function
         */
        this.setSize = function () {
            _setSize();
            _svg.setAttribute('height', elementSize.height);
            _svg.setAttribute('width', elementSize.width);
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
            div.style.padding = '0';
            div.style.margin = '0';
            _svg = createElementSVG('svg'); //SVG
            _defsSvg = createElementSVG('defs'); //defs
            _svg.appendChild(_defsSvg);
            _svg.setAttribute('height', elementSize.height);
            _svg.setAttribute('width', elementSize.width);
            div.appendChild(_svg);
            let eventDiv = document.createElement('div'); //DIV
            eventDiv.style.position = 'absolute';
            eventDiv.style.top =
                eventDiv.style.right =
                eventDiv.style.bottom =
                eventDiv.style.left = '0';
            div.appendChild(eventDiv);
            registerEvent(eventDiv); //注册事件响应程序
            return div;
        }

        /**
         * 注册事件响应程序
         * @function
         * @private
         * @property {Element} element - 元素
         */
        function registerEvent(element) {
            function getBulletScreenOnScreenByLocation(location) {
                let bulletScreen = null;
                bulletScreensOnScreen.forEach(function (bulletScreenOnScreen) {
                    let x1 = bulletScreenOnScreen.x - 4;
                    let x2 = x1 + bulletScreenOnScreen.width + 8;
                    let y1 = bulletScreenOnScreen.actualY - 4;
                    let y2 = y1 + bulletScreenOnScreen.height + 8;
                    if (location.x >= x1 && location.x <= x2 && location.y >= y1 && location.y <= y2) {
                        bulletScreen = bulletScreenOnScreen.bulletScreen;
                        return { stop: true };
                    }
                }, false);
                return bulletScreen;
            }
            function getLocation(e) {
                function getOffsetTop(element) {
                    let offsetTop = 0;
                    do {
                        offsetTop += element.offsetTop;
                    } while ((element = element.offsetParent) != null);
                    return offsetTop;
                }
                function getOffsetLeft(element) {
                    let offsetLeft = 0;
                    do {
                        offsetLeft += element.offsetLeft;
                    } while ((element = element.offsetParent) != null);
                    return offsetLeft;
                }
                if (typeof (e.offsetX) === 'undefined' || e.offsetX === null) {
                    if (typeof (e.layerX) === 'undefined' || e.layerX === null) {
                        if (typeof (e.pageX) === 'undefined' || e.pageX === null) {
                            let doc = document.documentElement, body = document.body;
                            e.pageX = e.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                            e.pageY = e.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
                        }
                        e.layerX = e.pageX - getOffsetLeft(e.target);
                        e.layerY = e.pageY - getOffsetTop(e.target);
                    }
                    e.offsetX = e.layerX - e.target.clientLeft;
                    e.offsetY = e.layerY - e.target.clientTop;
                }
                return {
                    x: e.offsetX,
                    y: e.offsetY
                };
            }

            //上下文菜单
            element.oncontextmenu = function (e) {
                let bulletScreen = getBulletScreenOnScreenByLocation(getLocation(e));
                if (bulletScreen)
                    event.trigger('contextmenu', {
                        bulletScreen: bulletScreen
                    });
                return false;
            };
            //单击
            element.onclick = function (e) {
                let bulletScreen = getBulletScreenOnScreenByLocation(getLocation(e));
                if (bulletScreen)
                    event.trigger('click', {
                        bulletScreen: bulletScreen
                    });
                return false;
            };
        }

        /**
         * 创建 SVG 元素
         * @function
         * @private
         * @param {String} qualifiedName - Element 名称
         * @param {*} options - 选项
         */
        function createElementSVG(qualifiedName, options) {
            return document.createElementNS('http://www.w3.org/2000/svg', qualifiedName, options);
        }
    }
}

export { SVGRenderer };