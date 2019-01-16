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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9ldmVudC5qcyJdLCJuYW1lcyI6WyJFdmVudCIsImV2ZW50TGlzdCIsImFkZCIsIm5hbWUiLCJUeXBlRXJyb3IiLCJSZXNvdXJjZXMiLCJQQVJBTUVURVJTX1RZUEVfRVJST1IiLCJFVkVOVF9BTFJFQURZX0VYSVNUU19FUlJPUiIsInJlbW92ZSIsIkVWRU5UX05BTUVfTk9UX0ZPVU5EIiwiYmluZCIsImZ1biIsImV2ZW50IiwiaW5kZXgiLCJ1bnNoaWZ0IiwidW5iaW5kIiwic3BsaWNlIiwibGVuZ3RoIiwidHJpZ2dlciIsImUiLCJIZWxwZXIiLCJfdHlwZW9mIiwidHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFFQTs7O0lBR01BLEs7QUFDRjs7O0FBR0EsaUJBQWM7QUFBQTs7QUFDVjs7OztBQUlBLE1BQUlDLFNBQVMsR0FBRyxFQUFoQjtBQUNBOzs7Ozs7O0FBTUEsT0FBS0MsR0FBTCxHQUFXLFVBQVVDLElBQVYsRUFBZ0I7QUFDdkIsUUFBSSxPQUFPQSxJQUFQLElBQWUsUUFBbkIsRUFBNkIsTUFBTSxJQUFJQyxTQUFKLENBQWNDLHFCQUFVQyxxQkFBeEIsQ0FBTjtBQUM3QixRQUFJLE9BQU9MLFNBQVMsQ0FBQ0UsSUFBRCxDQUFoQixJQUEwQixXQUE5QixFQUEyQyxNQUFNLElBQUlDLFNBQUosQ0FBY0MscUJBQVVFLDBCQUF4QixDQUFOO0FBQzNDTixJQUFBQSxTQUFTLENBQUNFLElBQUQsQ0FBVCxHQUFrQixFQUFsQjtBQUNILEdBSkQ7QUFLQTs7Ozs7Ozs7QUFNQSxPQUFLSyxNQUFMLEdBQWMsVUFBVUwsSUFBVixFQUFnQjtBQUMxQixRQUFJLE9BQU9BLElBQVAsSUFBZSxRQUFuQixFQUE2QixNQUFNLElBQUlDLFNBQUosQ0FBY0MscUJBQVVDLHFCQUF4QixDQUFOO0FBQzdCLFFBQUksT0FBT0wsU0FBUyxDQUFDRSxJQUFELENBQWhCLEtBQTJCLFdBQS9CLEVBQTRDLE1BQU0sSUFBSUMsU0FBSixDQUFjQyxxQkFBVUksb0JBQXhCLENBQU47QUFDNUMsV0FBUVIsU0FBUyxDQUFDRSxJQUFELENBQWpCO0FBQ0gsR0FKRDtBQUtBOzs7Ozs7Ozs7O0FBUUEsT0FBS08sSUFBTCxHQUFZLFVBQVVQLElBQVYsRUFBZ0JRLEdBQWhCLEVBQXFCO0FBQzdCLFFBQUksT0FBT1IsSUFBUCxJQUFlLFFBQWYsSUFBMkIsT0FBT1EsR0FBUCxJQUFjLFVBQTdDLEVBQXlELE1BQU0sSUFBSVAsU0FBSixDQUFjQyxxQkFBVUMscUJBQXhCLENBQU47QUFDekQsUUFBSU0sS0FBSyxHQUFHWCxTQUFTLENBQUNFLElBQUQsQ0FBckI7QUFDQSxRQUFJLE9BQU9TLEtBQVAsS0FBaUIsV0FBckIsRUFBa0MsTUFBTSxJQUFJUixTQUFKLENBQWNDLHFCQUFVSSxvQkFBeEIsQ0FBTjs7QUFDbEMsU0FBSyxJQUFJSSxLQUFULElBQWtCRCxLQUFsQixFQUF5QjtBQUNyQixVQUFJQSxLQUFLLENBQUNDLEtBQUQsQ0FBTCxLQUFpQkYsR0FBckIsRUFDSSxPQUFPLEtBQVA7QUFDUDs7QUFDRCxXQUFPQyxLQUFLLENBQUNFLE9BQU4sQ0FBY0gsR0FBZCxDQUFQO0FBQ0gsR0FURDtBQVVBOzs7Ozs7Ozs7O0FBUUEsT0FBS0ksTUFBTCxHQUFjLFVBQVVaLElBQVYsRUFBZ0JRLEdBQWhCLEVBQXFCO0FBQy9CLFFBQUksT0FBT1IsSUFBUCxJQUFlLFFBQW5CLEVBQTZCLE1BQU0sSUFBSUMsU0FBSixDQUFjQyxxQkFBVUMscUJBQXhCLENBQU47QUFDN0IsUUFBSU0sS0FBSyxHQUFHWCxTQUFTLENBQUNFLElBQUQsQ0FBckI7QUFDQSxRQUFJLE9BQU9TLEtBQVAsS0FBaUIsV0FBckIsRUFBa0MsTUFBTSxJQUFJUixTQUFKLENBQWNDLHFCQUFVSSxvQkFBeEIsQ0FBTjtBQUNsQyxRQUFJLE9BQU9FLEdBQVAsSUFBYyxVQUFsQixFQUE4QixLQUFLLElBQUlFLEtBQVQsSUFBa0JELEtBQWxCLEVBQXlCO0FBQ25ELFVBQUlBLEtBQUssQ0FBQ0MsS0FBRCxDQUFMLEtBQWlCRixHQUFyQixFQUEwQjtBQUN0QkMsUUFBQUEsS0FBSyxDQUFDSSxNQUFOLENBQWFMLEdBQWIsRUFBa0IsQ0FBbEI7QUFDQSxlQUFPQyxLQUFLLENBQUNLLE1BQWI7QUFDSDtBQUNKLEtBTEQsTUFLT2hCLFNBQVMsQ0FBQ0UsSUFBRCxDQUFULEdBQWtCLEVBQWxCO0FBQ1YsR0FWRDtBQVdBOzs7Ozs7Ozs7QUFPQSxPQUFLZSxPQUFMLEdBQWUsVUFBVWYsSUFBVixFQUFnQmdCLENBQWhCLEVBQW1CO0FBQzlCLFFBQUksT0FBT2hCLElBQVAsSUFBZSxRQUFmLElBQTJCaUIsZUFBT0MsT0FBUCxDQUFlRixDQUFmLEtBQXFCLFFBQXBELEVBQThELE1BQU0sSUFBSWYsU0FBSixDQUFjQyxxQkFBVUMscUJBQXhCLENBQU47QUFDOUQsUUFBSU0sS0FBSyxHQUFHWCxTQUFTLENBQUNFLElBQUQsQ0FBckI7QUFDQSxRQUFJLE9BQU9TLEtBQVAsS0FBaUIsV0FBckIsRUFBa0MsTUFBTSxJQUFJUixTQUFKLENBQWNDLHFCQUFVSSxvQkFBeEIsQ0FBTjtBQUNsQ1UsSUFBQUEsQ0FBQyxDQUFDRyxJQUFGLEdBQVNuQixJQUFUO0FBSjhCO0FBQUE7QUFBQTs7QUFBQTtBQUs5QiwyQkFBZ0JTLEtBQWhCLDhIQUF1QjtBQUFBLFlBQWRELEdBQWM7QUFDbkIsWUFBSSxDQUFDQSxHQUFHLENBQUNRLENBQUQsQ0FBUixFQUNJO0FBQ1A7QUFSNkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFTOUI7QUFDSCxHQVZEO0FBV0gsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlc291cmNlcyB9IGZyb20gJy4vcmVzb3VyY2VzJ1xyXG5pbXBvcnQgeyBIZWxwZXIgfSBmcm9tICcuL2hlbHBlcic7XHJcblxyXG4vKipcclxuICog5LqL5Lu25qih5Z6L57G7XHJcbiAqL1xyXG5jbGFzcyBFdmVudCB7XHJcbiAgICAvKipcclxuICAgICAqIOWIm+W7uuS4gOS4quaWsOeahOS6i+S7tuaooeWei+OAglxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDkuovku7bliJfooahcclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCBldmVudExpc3QgPSB7fTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmt7vliqDkuovku7ZcclxuICAgICAgICAgKiBAcHVibGljXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSDkuovku7blkI3np7BcclxuICAgICAgICAgKiBAdGhyb3dzIHtUeXBlRXJyb3J9IOS8oOWFpeeahOWPguaVsOmUmeivr+aIluS6i+S7tuW3suWtmOWcqOaXtuW8leWPkemUmeivr+OAguivt+WPgumYhSBNRE4gW1R5cGVFcnJvcl17QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvemgtQ04vZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvVHlwZUVycm9yfSDjgIJcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmFkZCA9IGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbmFtZSAhPSAnc3RyaW5nJykgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuUEFSQU1FVEVSU19UWVBFX0VSUk9SKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBldmVudExpc3RbbmFtZV0gIT0gJ3VuZGVmaW5lZCcpIHRocm93IG5ldyBUeXBlRXJyb3IoUmVzb3VyY2VzLkVWRU5UX0FMUkVBRFlfRVhJU1RTX0VSUk9SKTtcclxuICAgICAgICAgICAgZXZlbnRMaXN0W25hbWVdID0gW107XHJcbiAgICAgICAgfTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDliKDpmaTkuovku7ZcclxuICAgICAgICAgKiBAcHVibGljXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSDkuovku7blkI3np7BcclxuICAgICAgICAgKiBAdGhyb3dzIHtUeXBlRXJyb3J9IOS8oOWFpeeahOWPguaVsOmUmeivr+aIluS6i+S7tuS4jeWtmOWcqOaXtuW8leWPkemUmeivr+OAguivt+WPgumYhSBNRE4gW1R5cGVFcnJvcl17QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvemgtQ04vZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvVHlwZUVycm9yfSDjgIJcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnJlbW92ZSA9IGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbmFtZSAhPSAnc3RyaW5nJykgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuUEFSQU1FVEVSU19UWVBFX0VSUk9SKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBldmVudExpc3RbbmFtZV0gPT09ICd1bmRlZmluZWQnKSB0aHJvdyBuZXcgVHlwZUVycm9yKFJlc291cmNlcy5FVkVOVF9OQU1FX05PVF9GT1VORCk7XHJcbiAgICAgICAgICAgIGRlbGV0ZSAoZXZlbnRMaXN0W25hbWVdKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOe7keWumuS6i+S7tuWkhOeQhueoi+W6j1xyXG4gICAgICAgICAqIEBwdWJsaWNcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIOS6i+S7tuWQjeensFxyXG4gICAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZ1biAtIOS6i+S7tuWkhOeQhueoi+W6j1xyXG4gICAgICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IOa3u+WKoOWQjueahOS6i+S7tuaVsFxyXG4gICAgICAgICAqIEB0aHJvd3Mge1R5cGVFcnJvcn0g5Lyg5YWl55qE5Y+C5pWw6ZSZ6K+v5oiW5LqL5Lu25LiN5a2Y5Zyo5pe25byV5Y+R6ZSZ6K+v44CC6K+35Y+C6ZiFIE1ETiBbVHlwZUVycm9yXXtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy96aC1DTi9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9UeXBlRXJyb3J9IOOAglxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuYmluZCA9IGZ1bmN0aW9uIChuYW1lLCBmdW4pIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBuYW1lICE9ICdzdHJpbmcnIHx8IHR5cGVvZiBmdW4gIT0gJ2Z1bmN0aW9uJykgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuUEFSQU1FVEVSU19UWVBFX0VSUk9SKTtcclxuICAgICAgICAgICAgbGV0IGV2ZW50ID0gZXZlbnRMaXN0W25hbWVdO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGV2ZW50ID09PSAndW5kZWZpbmVkJykgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuRVZFTlRfTkFNRV9OT1RfRk9VTkQpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpbmRleCBpbiBldmVudCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50W2luZGV4XSA9PT0gZnVuKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZXZlbnQudW5zaGlmdChmdW4pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog6Kej57uR5LqL5Lu25aSE55CG56iL5bqP77yIZnVu5Li656m66Kej57uR5omA5pyJ5LqL5Lu25aSE55CG56iL5bqP77yJXHJcbiAgICAgICAgICogQHB1YmxpY1xyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0g5LqL5Lu25ZCN56ewXHJcbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZnVuIC0g5LqL5Lu25aSE55CG56iL5bqPXHJcbiAgICAgICAgICogQHJldHVybnMge251bWJlcn0g5Yig6Zmk5ZCO55qE5LqL5Lu25pWwXHJcbiAgICAgICAgICogQHRocm93cyB7VHlwZUVycm9yfSDkvKDlhaXnmoTlj4LmlbDplJnor6/miJbkuovku7bkuI3lrZjlnKjml7blvJXlj5HplJnor6/jgILor7flj4LpmIUgTUROIFtUeXBlRXJyb3Jde0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3poLUNOL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1R5cGVFcnJvcn0g44CCXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy51bmJpbmQgPSBmdW5jdGlvbiAobmFtZSwgZnVuKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbmFtZSAhPSAnc3RyaW5nJykgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuUEFSQU1FVEVSU19UWVBFX0VSUk9SKTtcclxuICAgICAgICAgICAgbGV0IGV2ZW50ID0gZXZlbnRMaXN0W25hbWVdO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGV2ZW50ID09PSAndW5kZWZpbmVkJykgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuRVZFTlRfTkFNRV9OT1RfRk9VTkQpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGZ1biA9PSAnZnVuY3Rpb24nKSBmb3IgKGxldCBpbmRleCBpbiBldmVudCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50W2luZGV4XSA9PT0gZnVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3BsaWNlKGZ1biwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50Lmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGV2ZW50TGlzdFtuYW1lXSA9IFtdO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog6Kem5Y+R5LqL5Lu2XHJcbiAgICAgICAgICogQHB1YmxpY1xyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0g5LqL5Lu25ZCN56ewXHJcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGUgLSDkuovku7bmlbDmja5cclxuICAgICAgICAgKiBAdGhyb3dzIHtUeXBlRXJyb3J9IOS8oOWFpeeahOWPguaVsOmUmeivr+aIluS6i+S7tuS4jeWtmOWcqOaXtuW8leWPkemUmeivr+OAguivt+WPgumYhSBNRE4gW1R5cGVFcnJvcl17QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvemgtQ04vZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvVHlwZUVycm9yfSDjgIJcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnRyaWdnZXIgPSBmdW5jdGlvbiAobmFtZSwgZSkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG5hbWUgIT0gJ3N0cmluZycgfHwgSGVscGVyLl90eXBlb2YoZSkgIT0gJ29iamVjdCcpIHRocm93IG5ldyBUeXBlRXJyb3IoUmVzb3VyY2VzLlBBUkFNRVRFUlNfVFlQRV9FUlJPUik7XHJcbiAgICAgICAgICAgIGxldCBldmVudCA9IGV2ZW50TGlzdFtuYW1lXTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBldmVudCA9PT0gJ3VuZGVmaW5lZCcpIHRocm93IG5ldyBUeXBlRXJyb3IoUmVzb3VyY2VzLkVWRU5UX05BTUVfTk9UX0ZPVU5EKTtcclxuICAgICAgICAgICAgZS50eXBlID0gbmFtZTtcclxuICAgICAgICAgICAgZm9yIChsZXQgZnVuIG9mIGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWZ1bihlKSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IHsgRXZlbnQgfSJdLCJmaWxlIjoibGliL2V2ZW50LmpzIn0=
