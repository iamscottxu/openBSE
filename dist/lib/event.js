"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Event = void 0;

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

var _resources = require("./resources");

var _helper = require("./helper");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 事件模型类
 */
var Event =
/**
 * 创建一个新的事件模型。
 */
function Event() {
  _classCallCheck(this, Event);

  /**
   * 事件列表
   * @private
   */
  var eventList = {};
  /**
   * 添加事件
   * @public
   * @param {string} name - 事件名称
   * @throws {TypeError} 传入的参数错误或事件已存在时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
   */

  this.add = function (name) {
    if (typeof name != 'string') throw new TypeError(_resources.Resources.PARAMETERS_TYPE_ERROR);
    if (typeof eventList[name] != 'undefined') throw new TypeError(_resources.Resources.EVENT_ALREADY_EXISTS_ERROR);
    eventList[name] = [];
  };
  /**
   * 删除事件
   * @public
   * @param {string} name - 事件名称
   * @throws {TypeError} 传入的参数错误或事件不存在时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
   */


  this.remove = function (name) {
    if (typeof name != 'string') throw new TypeError(_resources.Resources.PARAMETERS_TYPE_ERROR);
    if (typeof eventList[name] === 'undefined') throw new TypeError(_resources.Resources.EVENT_NAME_NOT_FOUND);
    delete eventList[name];
  };
  /**
   * 绑定事件处理程序
   * @public
   * @param {string} name - 事件名称
   * @param {function} fun - 事件处理程序
   * @returns {number} 添加后的事件数
   * @throws {TypeError} 传入的参数错误或事件不存在时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
   */


  this.bind = function (name, fun) {
    if (typeof name != 'string' || typeof fun != 'function') throw new TypeError(_resources.Resources.PARAMETERS_TYPE_ERROR);
    var event = eventList[name];
    if (typeof event === 'undefined') throw new TypeError(_resources.Resources.EVENT_NAME_NOT_FOUND);

    for (var index in event) {
      if (event[index] === fun) return false;
    }

    return event.unshift(fun);
  };
  /**
   * 解绑事件处理程序（fun为空解绑所有事件处理程序）
   * @public
   * @param {string} name - 事件名称
   * @param {function} fun - 事件处理程序
   * @returns {number} 删除后的事件数
   * @throws {TypeError} 传入的参数错误或事件不存在时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
   */


  this.unbind = function (name, fun) {
    if (typeof name != 'string') throw new TypeError(_resources.Resources.PARAMETERS_TYPE_ERROR);
    var event = eventList[name];
    if (typeof event === 'undefined') throw new TypeError(_resources.Resources.EVENT_NAME_NOT_FOUND);
    if (typeof fun == 'function') for (var index in event) {
      if (event[index] === fun) {
        event.splice(fun, 1);
        return event.length;
      }
    } else eventList[name] = [];
  };
  /**
   * 触发事件
   * @public
   * @param {string} name - 事件名称
   * @param {object} e - 事件数据
   * @throws {TypeError} 传入的参数错误或事件不存在时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
   */


  this.trigger = function (name, e) {
    if (typeof name != 'string' || _helper.Helper._typeof(e) != 'object') throw new TypeError(_resources.Resources.PARAMETERS_TYPE_ERROR);
    var event = eventList[name];
    if (typeof event === 'undefined') throw new TypeError(_resources.Resources.EVENT_NAME_NOT_FOUND);
    e.type = name;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = event[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var fun = _step.value;
        if (!fun(e)) return;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return;
  };
};

exports.Event = Event;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9ldmVudC5qcyJdLCJuYW1lcyI6WyJFdmVudCIsImV2ZW50TGlzdCIsImFkZCIsIm5hbWUiLCJUeXBlRXJyb3IiLCJSZXNvdXJjZXMiLCJQQVJBTUVURVJTX1RZUEVfRVJST1IiLCJFVkVOVF9BTFJFQURZX0VYSVNUU19FUlJPUiIsInJlbW92ZSIsIkVWRU5UX05BTUVfTk9UX0ZPVU5EIiwiYmluZCIsImZ1biIsImV2ZW50IiwiaW5kZXgiLCJ1bnNoaWZ0IiwidW5iaW5kIiwic3BsaWNlIiwibGVuZ3RoIiwidHJpZ2dlciIsImUiLCJIZWxwZXIiLCJfdHlwZW9mIiwidHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFFQTs7O0lBR01BLEs7QUFDRjs7O0FBR0EsaUJBQWM7QUFBQTs7QUFDVjs7OztBQUlBLE1BQUlDLFNBQVMsR0FBRyxFQUFoQjtBQUNBOzs7Ozs7O0FBTUEsT0FBS0MsR0FBTCxHQUFXLFVBQVVDLElBQVYsRUFBZ0I7QUFDdkIsUUFBSSxPQUFPQSxJQUFQLElBQWUsUUFBbkIsRUFBNkIsTUFBTSxJQUFJQyxTQUFKLENBQWNDLHFCQUFVQyxxQkFBeEIsQ0FBTjtBQUM3QixRQUFJLE9BQU9MLFNBQVMsQ0FBQ0UsSUFBRCxDQUFoQixJQUEwQixXQUE5QixFQUEyQyxNQUFNLElBQUlDLFNBQUosQ0FBY0MscUJBQVVFLDBCQUF4QixDQUFOO0FBQzNDTixJQUFBQSxTQUFTLENBQUNFLElBQUQsQ0FBVCxHQUFrQixFQUFsQjtBQUNILEdBSkQ7QUFLQTs7Ozs7Ozs7QUFNQSxPQUFLSyxNQUFMLEdBQWMsVUFBVUwsSUFBVixFQUFnQjtBQUMxQixRQUFJLE9BQU9BLElBQVAsSUFBZSxRQUFuQixFQUE2QixNQUFNLElBQUlDLFNBQUosQ0FBY0MscUJBQVVDLHFCQUF4QixDQUFOO0FBQzdCLFFBQUksT0FBT0wsU0FBUyxDQUFDRSxJQUFELENBQWhCLEtBQTJCLFdBQS9CLEVBQTRDLE1BQU0sSUFBSUMsU0FBSixDQUFjQyxxQkFBVUksb0JBQXhCLENBQU47QUFDNUMsV0FBUVIsU0FBUyxDQUFDRSxJQUFELENBQWpCO0FBQ0gsR0FKRDtBQUtBOzs7Ozs7Ozs7O0FBUUEsT0FBS08sSUFBTCxHQUFZLFVBQVVQLElBQVYsRUFBZ0JRLEdBQWhCLEVBQXFCO0FBQzdCLFFBQUksT0FBT1IsSUFBUCxJQUFlLFFBQWYsSUFBMkIsT0FBT1EsR0FBUCxJQUFjLFVBQTdDLEVBQXlELE1BQU0sSUFBSVAsU0FBSixDQUFjQyxxQkFBVUMscUJBQXhCLENBQU47QUFDekQsUUFBSU0sS0FBSyxHQUFHWCxTQUFTLENBQUNFLElBQUQsQ0FBckI7QUFDQSxRQUFJLE9BQU9TLEtBQVAsS0FBaUIsV0FBckIsRUFBa0MsTUFBTSxJQUFJUixTQUFKLENBQWNDLHFCQUFVSSxvQkFBeEIsQ0FBTjs7QUFDbEMsU0FBSyxJQUFJSSxLQUFULElBQWtCRCxLQUFsQixFQUF5QjtBQUNyQixVQUFJQSxLQUFLLENBQUNDLEtBQUQsQ0FBTCxLQUFpQkYsR0FBckIsRUFDSSxPQUFPLEtBQVA7QUFDUDs7QUFDRCxXQUFPQyxLQUFLLENBQUNFLE9BQU4sQ0FBY0gsR0FBZCxDQUFQO0FBQ0gsR0FURDtBQVVBOzs7Ozs7Ozs7O0FBUUEsT0FBS0ksTUFBTCxHQUFjLFVBQVVaLElBQVYsRUFBZ0JRLEdBQWhCLEVBQXFCO0FBQy9CLFFBQUksT0FBT1IsSUFBUCxJQUFlLFFBQW5CLEVBQTZCLE1BQU0sSUFBSUMsU0FBSixDQUFjQyxxQkFBVUMscUJBQXhCLENBQU47QUFDN0IsUUFBSU0sS0FBSyxHQUFHWCxTQUFTLENBQUNFLElBQUQsQ0FBckI7QUFDQSxRQUFJLE9BQU9TLEtBQVAsS0FBaUIsV0FBckIsRUFBa0MsTUFBTSxJQUFJUixTQUFKLENBQWNDLHFCQUFVSSxvQkFBeEIsQ0FBTjtBQUNsQyxRQUFJLE9BQU9FLEdBQVAsSUFBYyxVQUFsQixFQUE4QixLQUFLLElBQUlFLEtBQVQsSUFBa0JELEtBQWxCLEVBQXlCO0FBQ25ELFVBQUlBLEtBQUssQ0FBQ0MsS0FBRCxDQUFMLEtBQWlCRixHQUFyQixFQUEwQjtBQUN0QkMsUUFBQUEsS0FBSyxDQUFDSSxNQUFOLENBQWFMLEdBQWIsRUFBa0IsQ0FBbEI7QUFDQSxlQUFPQyxLQUFLLENBQUNLLE1BQWI7QUFDSDtBQUNKLEtBTEQsTUFLT2hCLFNBQVMsQ0FBQ0UsSUFBRCxDQUFULEdBQWtCLEVBQWxCO0FBQ1YsR0FWRDtBQVdBOzs7Ozs7Ozs7QUFPQSxPQUFLZSxPQUFMLEdBQWUsVUFBVWYsSUFBVixFQUFnQmdCLENBQWhCLEVBQW1CO0FBQzlCLFFBQUksT0FBT2hCLElBQVAsSUFBZSxRQUFmLElBQTJCaUIsZUFBT0MsT0FBUCxDQUFlRixDQUFmLEtBQXFCLFFBQXBELEVBQThELE1BQU0sSUFBSWYsU0FBSixDQUFjQyxxQkFBVUMscUJBQXhCLENBQU47QUFDOUQsUUFBSU0sS0FBSyxHQUFHWCxTQUFTLENBQUNFLElBQUQsQ0FBckI7QUFDQSxRQUFJLE9BQU9TLEtBQVAsS0FBaUIsV0FBckIsRUFBa0MsTUFBTSxJQUFJUixTQUFKLENBQWNDLHFCQUFVSSxvQkFBeEIsQ0FBTjtBQUNsQ1UsSUFBQUEsQ0FBQyxDQUFDRyxJQUFGLEdBQVNuQixJQUFUO0FBSjhCO0FBQUE7QUFBQTs7QUFBQTtBQUs5QiwyQkFBZ0JTLEtBQWhCLDhIQUF1QjtBQUFBLFlBQWRELEdBQWM7QUFDbkIsWUFBSSxDQUFDQSxHQUFHLENBQUNRLENBQUQsQ0FBUixFQUNJO0FBQ1A7QUFSNkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFTOUI7QUFDSCxHQVZEO0FBV0gsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlc291cmNlcyB9IGZyb20gJy4vcmVzb3VyY2VzJ1xuaW1wb3J0IHsgSGVscGVyIH0gZnJvbSAnLi9oZWxwZXInO1xuXG4vKipcbiAqIOS6i+S7tuaooeWei+exu1xuICovXG5jbGFzcyBFdmVudCB7XG4gICAgLyoqXG4gICAgICog5Yib5bu65LiA5Liq5paw55qE5LqL5Lu25qih5Z6L44CCXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDkuovku7bliJfooahcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGxldCBldmVudExpc3QgPSB7fTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa3u+WKoOS6i+S7tlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0g5LqL5Lu25ZCN56ewXG4gICAgICAgICAqIEB0aHJvd3Mge1R5cGVFcnJvcn0g5Lyg5YWl55qE5Y+C5pWw6ZSZ6K+v5oiW5LqL5Lu25bey5a2Y5Zyo5pe25byV5Y+R6ZSZ6K+v44CC6K+35Y+C6ZiFIE1ETiBbVHlwZUVycm9yXXtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy96aC1DTi9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9UeXBlRXJyb3J9IOOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5hZGQgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBuYW1lICE9ICdzdHJpbmcnKSB0aHJvdyBuZXcgVHlwZUVycm9yKFJlc291cmNlcy5QQVJBTUVURVJTX1RZUEVfRVJST1IpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBldmVudExpc3RbbmFtZV0gIT0gJ3VuZGVmaW5lZCcpIHRocm93IG5ldyBUeXBlRXJyb3IoUmVzb3VyY2VzLkVWRU5UX0FMUkVBRFlfRVhJU1RTX0VSUk9SKTtcbiAgICAgICAgICAgIGV2ZW50TGlzdFtuYW1lXSA9IFtdO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICog5Yig6Zmk5LqL5Lu2XG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSDkuovku7blkI3np7BcbiAgICAgICAgICogQHRocm93cyB7VHlwZUVycm9yfSDkvKDlhaXnmoTlj4LmlbDplJnor6/miJbkuovku7bkuI3lrZjlnKjml7blvJXlj5HplJnor6/jgILor7flj4LpmIUgTUROIFtUeXBlRXJyb3Jde0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3poLUNOL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1R5cGVFcnJvcn0g44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnJlbW92ZSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG5hbWUgIT0gJ3N0cmluZycpIHRocm93IG5ldyBUeXBlRXJyb3IoUmVzb3VyY2VzLlBBUkFNRVRFUlNfVFlQRV9FUlJPUik7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGV2ZW50TGlzdFtuYW1lXSA9PT0gJ3VuZGVmaW5lZCcpIHRocm93IG5ldyBUeXBlRXJyb3IoUmVzb3VyY2VzLkVWRU5UX05BTUVfTk9UX0ZPVU5EKTtcbiAgICAgICAgICAgIGRlbGV0ZSAoZXZlbnRMaXN0W25hbWVdKTtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOe7keWumuS6i+S7tuWkhOeQhueoi+W6j1xuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0g5LqL5Lu25ZCN56ewXG4gICAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZ1biAtIOS6i+S7tuWkhOeQhueoi+W6j1xuICAgICAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSDmt7vliqDlkI7nmoTkuovku7bmlbBcbiAgICAgICAgICogQHRocm93cyB7VHlwZUVycm9yfSDkvKDlhaXnmoTlj4LmlbDplJnor6/miJbkuovku7bkuI3lrZjlnKjml7blvJXlj5HplJnor6/jgILor7flj4LpmIUgTUROIFtUeXBlRXJyb3Jde0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3poLUNOL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1R5cGVFcnJvcn0g44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmJpbmQgPSBmdW5jdGlvbiAobmFtZSwgZnVuKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG5hbWUgIT0gJ3N0cmluZycgfHwgdHlwZW9mIGZ1biAhPSAnZnVuY3Rpb24nKSB0aHJvdyBuZXcgVHlwZUVycm9yKFJlc291cmNlcy5QQVJBTUVURVJTX1RZUEVfRVJST1IpO1xuICAgICAgICAgICAgbGV0IGV2ZW50ID0gZXZlbnRMaXN0W25hbWVdO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBldmVudCA9PT0gJ3VuZGVmaW5lZCcpIHRocm93IG5ldyBUeXBlRXJyb3IoUmVzb3VyY2VzLkVWRU5UX05BTUVfTk9UX0ZPVU5EKTtcbiAgICAgICAgICAgIGZvciAobGV0IGluZGV4IGluIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50W2luZGV4XSA9PT0gZnVuKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZXZlbnQudW5zaGlmdChmdW4pO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICog6Kej57uR5LqL5Lu25aSE55CG56iL5bqP77yIZnVu5Li656m66Kej57uR5omA5pyJ5LqL5Lu25aSE55CG56iL5bqP77yJXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSDkuovku7blkI3np7BcbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZnVuIC0g5LqL5Lu25aSE55CG56iL5bqPXG4gICAgICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IOWIoOmZpOWQjueahOS6i+S7tuaVsFxuICAgICAgICAgKiBAdGhyb3dzIHtUeXBlRXJyb3J9IOS8oOWFpeeahOWPguaVsOmUmeivr+aIluS6i+S7tuS4jeWtmOWcqOaXtuW8leWPkemUmeivr+OAguivt+WPgumYhSBNRE4gW1R5cGVFcnJvcl17QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvemgtQ04vZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvVHlwZUVycm9yfSDjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudW5iaW5kID0gZnVuY3Rpb24gKG5hbWUsIGZ1bikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBuYW1lICE9ICdzdHJpbmcnKSB0aHJvdyBuZXcgVHlwZUVycm9yKFJlc291cmNlcy5QQVJBTUVURVJTX1RZUEVfRVJST1IpO1xuICAgICAgICAgICAgbGV0IGV2ZW50ID0gZXZlbnRMaXN0W25hbWVdO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBldmVudCA9PT0gJ3VuZGVmaW5lZCcpIHRocm93IG5ldyBUeXBlRXJyb3IoUmVzb3VyY2VzLkVWRU5UX05BTUVfTk9UX0ZPVU5EKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZnVuID09ICdmdW5jdGlvbicpIGZvciAobGV0IGluZGV4IGluIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50W2luZGV4XSA9PT0gZnVuKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnNwbGljZShmdW4sIDEpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnQubGVuZ3RoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBldmVudExpc3RbbmFtZV0gPSBbXTtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOinpuWPkeS6i+S7tlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0g5LqL5Lu25ZCN56ewXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlIC0g5LqL5Lu25pWw5o2uXG4gICAgICAgICAqIEB0aHJvd3Mge1R5cGVFcnJvcn0g5Lyg5YWl55qE5Y+C5pWw6ZSZ6K+v5oiW5LqL5Lu25LiN5a2Y5Zyo5pe25byV5Y+R6ZSZ6K+v44CC6K+35Y+C6ZiFIE1ETiBbVHlwZUVycm9yXXtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy96aC1DTi9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9UeXBlRXJyb3J9IOOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy50cmlnZ2VyID0gZnVuY3Rpb24gKG5hbWUsIGUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbmFtZSAhPSAnc3RyaW5nJyB8fCBIZWxwZXIuX3R5cGVvZihlKSAhPSAnb2JqZWN0JykgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuUEFSQU1FVEVSU19UWVBFX0VSUk9SKTtcbiAgICAgICAgICAgIGxldCBldmVudCA9IGV2ZW50TGlzdFtuYW1lXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXZlbnQgPT09ICd1bmRlZmluZWQnKSB0aHJvdyBuZXcgVHlwZUVycm9yKFJlc291cmNlcy5FVkVOVF9OQU1FX05PVF9GT1VORCk7XG4gICAgICAgICAgICBlLnR5cGUgPSBuYW1lO1xuICAgICAgICAgICAgZm9yIChsZXQgZnVuIG9mIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFmdW4oZSkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcbiAgICB9XG59XG5leHBvcnQgeyBFdmVudCB9Il0sImZpbGUiOiJsaWIvZXZlbnQuanMifQ==
