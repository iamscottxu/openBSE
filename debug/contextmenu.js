window.contextmenu = function (bindElement, contextmenuElement) {
    let _getContextmenuState = function () {
        return contextmenuElement.style.display != 'none';
    }
    /**
     * 获取上下文菜单的状态
     * @function
     * @returns {boolean} 指示上下文菜单是否正处于激活/显示状态。
     */
    this.getContextmenuState = _getContextmenuState;
    /**
     * 关闭上下文菜单：如果当前上下文菜单正处于激活/显示状态则立即关闭。
     */
    this.closeContextmenu = () => {
        if (_getContextmenuState()) {
            contextmenuElement.style.display = 'none';
        }
    }

    contextmenuElement.style.position = 'fixed';
    contextmenuElement.style.display = 'none';
    contextmenuElement.oncontextmenu = () => false;

    let isParent = function(element, parentElement) {
        do if (element === parentElement) return true;
        while(element !== null && document != (element = element.parentNode))
        return false;
    }

    let _closeContextmenu = function (e) {
        if (_getContextmenuState() && !isParent(e.target, contextmenuElement)) {
            e.stopPropagation();
            e.preventDefault();
            contextmenuElement.style.display = 'none';
        }
    }

    window.addEventListener('click', _closeContextmenu, true);
    window.addEventListener('contextmenu', _closeContextmenu, true);
    window.addEventListener('scroll', _closeContextmenu, true);
    window.addEventListener('touchmove', _closeContextmenu, true);

    
    bindElement.oncontextmenu = function (e) {
        e.stopPropagation();
        contextmenuElement.style.display = '';
        let top = e.clientY, left = e.clientX;
        if (top + contextmenuElement.clientHeight > document.documentElement.clientHeight) top -= contextmenuElement.clientHeight;
        if (left + contextmenuElement.clientWidth > document.documentElement.clientWidth) left -= contextmenuElement.clientWidth;
        contextmenuElement.style.top = `${top}px`;
        contextmenuElement.style.left = `${left}px`;
        return false;
    }
}