/**
 * 创建一个新的事件模型。
 * @class
 * @public
 */
class Event {
    constructor() {
        /**
         * 事件列表
         * @private
         */
        let eventList = {};
        /**
         * 添加事件
         * @function
         * @public
         * @param {String} name 事件名称
         * @returns {Boolean} true: 成功 false: 失败
         */
        this.add = function (name) {
            if (typeof (eventList[name]) != 'undefined')
                return false;
            eventList[name] = [];
            return true;
        };
        /**
         * 删除事件
         * @function
         * @public
         * @param {String} name 事件名称
         * @returns {Boolean} true: 成功 false: 失败
         */
        this.remove = function (name) {
            if (typeof (eventList[name]) === 'undefined')
                return false;
            delete (eventList[name]);
            return true;
        };
        /**
         * 绑定事件处理程序
         * @function
         * @public
         * @param {String} name 事件名称
         * @param {Function} fun 事件处理程序
         * @returns false: 失败 数字: 添加后的事件数
         */
        this.bind = function (name, fun) {
            let event = eventList[name];
            if (typeof (event) === 'undefined' || typeof (fun) != 'function')
                return false;
            for (let index in event) {
                if (event[index] === fun)
                    return false;
            }
            return event.push(fun);
        };
        /**
         * 解绑事件处理程序（fun为空解绑所有事件处理程序）
         * @function
         * @public
         * @param {String} name 事件名称
         * @param {Function} fun 事件处理程序
         * @returns true: 成功 false: 失败 数字: 删除后的事件数
         */
        this.unbind = function (name, fun) {
            let event = eventList[name];
            if (typeof (event) === 'undefined')
                return false;
            if (typeof (fun) != 'function') {
                eventList[name] = [];
                return true;
            }
            else {
                for (let index in event) {
                    if (event[index] === fun) {
                        event.splice(fun, 1);
                        return event.length;
                    }
                }
            }
        };
        /**
         * 触发事件
         * @function
         * @public
         * @param {String} name 事件名称
         * @param {Object} e 事件数据
         * @returns {Boolean} true: 成功 false: 失败
         */
        this.trigger = function (name, e) {
            let event = eventList[name];
            if (typeof (event) === 'undefined')
                return false;
            for (let fun of event) {
                if (!fun(e))
                    return true;
            }
            return true;
        };
    }
}
export { Event }