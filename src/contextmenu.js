import { Resources } from './lib/resources'

class Contextmenu {
    constructor(bulletScreenEngine, element, layer = 10, pause = true) {
        if (
            typeof bulletScreenEngine != 'object' ||
            typeof element != 'object' ||
            typeof pause != 'boolean' ||
            (typeof layer != 'number' && layer != null)
        ) throw new TypeError(Resources.PARAMETERS_TYPE_ERROR);

        element.bulletScreenEvent = null;

        let _getContextmenuState = () => contextmenu.style.display != 'none';
        this.getContextmenuState = _getContextmenuState;
        this.getBulletScreenEvent = () => element.bulletScreenEvent;

        element.style.position = 'fixed';
        element.style.display = 'none';
        element.oncontextmenu = () => false;

        let closeContextmenu = function (e) {
            if (_getContextmenuState() && e.target != element) {
                element.style.display = 'none';
                if (pause) element.bulletScreenEvent.setPlayState(true);
                element.bulletScreenEvent.setBulletScreen({ _contextmenu: false }, false);
                element.bulletScreenEvent = null;
                if (e.type === 'click') e.stopPropagation();
            }
        }
        window.addEventListener('click', closeContextmenu, true);
        window.addEventListener('contextmenu', closeContextmenu, true);
        window.addEventListener('scroll', closeContextmenu, true);

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

export { Contextmenu }