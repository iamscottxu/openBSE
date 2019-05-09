import Resources from './lib/resources'
/**
 * 上下文菜单类
 * @alias openBSE.Contextmenu
 * @description 上下文菜单对象。用于实现一个弹幕上下文菜单。
 */
export default class Contextmenu {
    /**
     * 创建弹幕引擎对象的上下文菜单。
     * @param {openBSE.BulletScreenEngine} bulletScreenEngine - 弹幕引擎对象：一个弹幕 {@link openBSE.BulletScreenEngine} 对象。要添加上下文菜单的
     * @param {Element} element - 上下文菜单元素：当显示上下文菜单时要显示的 div 。有关 Element 接口的信息请参阅MDN [Element]{@link https://developer.mozilla.org/zh-CN/docs/Web/API/Element} 。
     * @param {number} [layer=10] - 弹幕层级：当显示上下文菜单或鼠标指向弹幕时弹幕要移动到的层级。有关弹幕层级的详细说明请参阅 {@link openBSE~options} 结构。
     * @param {boolean} [pause=true] - 是否暂停：当鼠标指向弹幕或单开上下文菜单时弹幕是否暂停移动/播放。
     */
    constructor(bulletScreenEngine, element, layer = 10, pause = true) {
        if (
            typeof bulletScreenEngine != 'object' ||
            typeof element != 'object' ||
            typeof pause != 'boolean' ||
            (typeof layer != 'number' && layer != null)
        ) throw new TypeError(Resources.PARAMETERS_TYPE_ERROR);

        element.bulletScreenEvent = null;

        let _getContextmenuState = () => contextmenu.style.display != 'none';
        /**
         * 获取上下文菜单的状态
         * @function
         * @returns {boolean} 指示上下文菜单是否正处于激活/显示状态。
         */
        this.getContextmenuState = _getContextmenuState;
        /**
         * 获取激活上下文菜单的弹幕的弹幕事件结构
         * @returns {openBSE~BulletScreenEvent} 弹幕事件结构：一个 {@link openBSE~BulletScreenEvent} 结构。
         */
        this.getBulletScreenEvent = () => element.bulletScreenEvent;
        /**
         * 关闭上下文菜单：如果当前上下文菜单正处于激活/显示状态则立即关闭。
         */
        this.closeContextmenu = () => {
            if (_getContextmenuState()) {
                element.style.display = 'none';
                if (pause) element.bulletScreenEvent.setPlayState(true);
                element.bulletScreenEvent.setBulletScreen({ _contextmenu: false }, false);
                element.bulletScreenEvent = null;
            }
        }

        element.style.position = 'fixed';
        element.style.display = 'none';
        element.oncontextmenu = () => false;

        let _closeContextmenu = function (e) {
            if (_getContextmenuState() && e.target != element) {
                element.style.display = 'none';
                if (pause) element.bulletScreenEvent.setPlayState(true);
                element.bulletScreenEvent.setBulletScreen({ _contextmenu: false }, false);
                element.bulletScreenEvent = null;
                if (e.type === 'click') e.stopPropagation();
            }
        }
        window.addEventListener('click', _closeContextmenu, true);
        window.addEventListener('contextmenu', _closeContextmenu, true);
        window.addEventListener('scroll', _closeContextmenu, true);

        bulletScreenEngine.bind('contextmenu', function (e) {
            e.setBulletScreen({ layer: layer, _contextmenu: true }, layer != null);
            if (pause) e.setPlayState(false);
            element.style.display = '';
            let top = e.clientY, left = e.clientX;
            if (top + element.clientHeight > document.documentElement.clientHeight) top -= element.clientHeight;
            if (left + element.clientWidth > document.documentElement.clientWidth) left -= element.clientWidth;
            element.style.top = `${top}px`;
            element.style.left = `${left}px`;
            element.bulletScreenEvent = e;
        });

        bulletScreenEngine.bind('mouseenter', function (e) {
            if (layer != null) e.setBulletScreen({ layer: layer }, true);
            if (pause) e.setPlayState(false);
        });

        bulletScreenEngine.bind('mouseleave', function (e) {
            if (!e.getBulletScreen()._contextmenu && pause) e.setPlayState(true);
        });
    }
}

