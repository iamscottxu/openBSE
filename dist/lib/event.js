"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.splice");

require("core-js/modules/es.function.bind");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _resources = _interopRequireDefault(require("./resources"));

var _helper = _interopRequireDefault(require("./helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
    if (typeof name != 'string') throw new TypeError(_resources["default"].PARAMETERS_TYPE_ERROR);
    if (typeof eventList[name] != 'undefined') throw new TypeError(_resources["default"].EVENT_ALREADY_EXISTS_ERROR);
    eventList[name] = [];
  };
  /**
   * 删除事件
   * @public
   * @param {string} name - 事件名称
   * @throws {TypeError} 传入的参数错误或事件不存在时引发错误。请参阅 MDN [TypeError]{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError} 。
   */


  this.remove = function (name) {
    if (typeof name != 'string') throw new TypeError(_resources["default"].PARAMETERS_TYPE_ERROR);
    if (typeof eventList[name] === 'undefined') throw new TypeError(_resources["default"].EVENT_NAME_NOT_FOUND);
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
    if (typeof name != 'string' || typeof fun != 'function') throw new TypeError(_resources["default"].PARAMETERS_TYPE_ERROR);
    var event = eventList[name];
    if (typeof event === 'undefined') throw new TypeError(_resources["default"].EVENT_NAME_NOT_FOUND);

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
    if (typeof name != 'string') throw new TypeError(_resources["default"].PARAMETERS_TYPE_ERROR);
    var event = eventList[name];
    if (typeof event === 'undefined') throw new TypeError(_resources["default"].EVENT_NAME_NOT_FOUND);
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
    if (typeof name != 'string' || _helper["default"]._typeof(e) != 'object') throw new TypeError(_resources["default"].PARAMETERS_TYPE_ERROR);
    var event = eventList[name];
    if (typeof event === 'undefined') throw new TypeError(_resources["default"].EVENT_NAME_NOT_FOUND);
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
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
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

exports["default"] = Event;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9ldmVudC5qcyJdLCJuYW1lcyI6WyJFdmVudCIsImV2ZW50TGlzdCIsImFkZCIsIm5hbWUiLCJUeXBlRXJyb3IiLCJSZXNvdXJjZXMiLCJQQVJBTUVURVJTX1RZUEVfRVJST1IiLCJFVkVOVF9BTFJFQURZX0VYSVNUU19FUlJPUiIsInJlbW92ZSIsIkVWRU5UX05BTUVfTk9UX0ZPVU5EIiwiYmluZCIsImZ1biIsImV2ZW50IiwiaW5kZXgiLCJ1bnNoaWZ0IiwidW5iaW5kIiwic3BsaWNlIiwibGVuZ3RoIiwidHJpZ2dlciIsImUiLCJIZWxwZXIiLCJfdHlwZW9mIiwidHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7OztBQUVBOzs7SUFHcUJBLEs7QUFDakI7OztBQUdBLGlCQUFjO0FBQUE7O0FBQ1Y7Ozs7QUFJQSxNQUFJQyxTQUFTLEdBQUcsRUFBaEI7QUFDQTs7Ozs7OztBQU1BLE9BQUtDLEdBQUwsR0FBVyxVQUFVQyxJQUFWLEVBQWdCO0FBQ3ZCLFFBQUksT0FBT0EsSUFBUCxJQUFlLFFBQW5CLEVBQTZCLE1BQU0sSUFBSUMsU0FBSixDQUFjQyxzQkFBVUMscUJBQXhCLENBQU47QUFDN0IsUUFBSSxPQUFPTCxTQUFTLENBQUNFLElBQUQsQ0FBaEIsSUFBMEIsV0FBOUIsRUFBMkMsTUFBTSxJQUFJQyxTQUFKLENBQWNDLHNCQUFVRSwwQkFBeEIsQ0FBTjtBQUMzQ04sSUFBQUEsU0FBUyxDQUFDRSxJQUFELENBQVQsR0FBa0IsRUFBbEI7QUFDSCxHQUpEO0FBS0E7Ozs7Ozs7O0FBTUEsT0FBS0ssTUFBTCxHQUFjLFVBQVVMLElBQVYsRUFBZ0I7QUFDMUIsUUFBSSxPQUFPQSxJQUFQLElBQWUsUUFBbkIsRUFBNkIsTUFBTSxJQUFJQyxTQUFKLENBQWNDLHNCQUFVQyxxQkFBeEIsQ0FBTjtBQUM3QixRQUFJLE9BQU9MLFNBQVMsQ0FBQ0UsSUFBRCxDQUFoQixLQUEyQixXQUEvQixFQUE0QyxNQUFNLElBQUlDLFNBQUosQ0FBY0Msc0JBQVVJLG9CQUF4QixDQUFOO0FBQzVDLFdBQVFSLFNBQVMsQ0FBQ0UsSUFBRCxDQUFqQjtBQUNILEdBSkQ7QUFLQTs7Ozs7Ozs7OztBQVFBLE9BQUtPLElBQUwsR0FBWSxVQUFVUCxJQUFWLEVBQWdCUSxHQUFoQixFQUFxQjtBQUM3QixRQUFJLE9BQU9SLElBQVAsSUFBZSxRQUFmLElBQTJCLE9BQU9RLEdBQVAsSUFBYyxVQUE3QyxFQUF5RCxNQUFNLElBQUlQLFNBQUosQ0FBY0Msc0JBQVVDLHFCQUF4QixDQUFOO0FBQ3pELFFBQUlNLEtBQUssR0FBR1gsU0FBUyxDQUFDRSxJQUFELENBQXJCO0FBQ0EsUUFBSSxPQUFPUyxLQUFQLEtBQWlCLFdBQXJCLEVBQWtDLE1BQU0sSUFBSVIsU0FBSixDQUFjQyxzQkFBVUksb0JBQXhCLENBQU47O0FBQ2xDLFNBQUssSUFBSUksS0FBVCxJQUFrQkQsS0FBbEIsRUFBeUI7QUFDckIsVUFBSUEsS0FBSyxDQUFDQyxLQUFELENBQUwsS0FBaUJGLEdBQXJCLEVBQ0ksT0FBTyxLQUFQO0FBQ1A7O0FBQ0QsV0FBT0MsS0FBSyxDQUFDRSxPQUFOLENBQWNILEdBQWQsQ0FBUDtBQUNILEdBVEQ7QUFVQTs7Ozs7Ozs7OztBQVFBLE9BQUtJLE1BQUwsR0FBYyxVQUFVWixJQUFWLEVBQWdCUSxHQUFoQixFQUFxQjtBQUMvQixRQUFJLE9BQU9SLElBQVAsSUFBZSxRQUFuQixFQUE2QixNQUFNLElBQUlDLFNBQUosQ0FBY0Msc0JBQVVDLHFCQUF4QixDQUFOO0FBQzdCLFFBQUlNLEtBQUssR0FBR1gsU0FBUyxDQUFDRSxJQUFELENBQXJCO0FBQ0EsUUFBSSxPQUFPUyxLQUFQLEtBQWlCLFdBQXJCLEVBQWtDLE1BQU0sSUFBSVIsU0FBSixDQUFjQyxzQkFBVUksb0JBQXhCLENBQU47QUFDbEMsUUFBSSxPQUFPRSxHQUFQLElBQWMsVUFBbEIsRUFBOEIsS0FBSyxJQUFJRSxLQUFULElBQWtCRCxLQUFsQixFQUF5QjtBQUNuRCxVQUFJQSxLQUFLLENBQUNDLEtBQUQsQ0FBTCxLQUFpQkYsR0FBckIsRUFBMEI7QUFDdEJDLFFBQUFBLEtBQUssQ0FBQ0ksTUFBTixDQUFhTCxHQUFiLEVBQWtCLENBQWxCO0FBQ0EsZUFBT0MsS0FBSyxDQUFDSyxNQUFiO0FBQ0g7QUFDSixLQUxELE1BS09oQixTQUFTLENBQUNFLElBQUQsQ0FBVCxHQUFrQixFQUFsQjtBQUNWLEdBVkQ7QUFXQTs7Ozs7Ozs7O0FBT0EsT0FBS2UsT0FBTCxHQUFlLFVBQVVmLElBQVYsRUFBZ0JnQixDQUFoQixFQUFtQjtBQUM5QixRQUFJLE9BQU9oQixJQUFQLElBQWUsUUFBZixJQUEyQmlCLG1CQUFPQyxPQUFQLENBQWVGLENBQWYsS0FBcUIsUUFBcEQsRUFBOEQsTUFBTSxJQUFJZixTQUFKLENBQWNDLHNCQUFVQyxxQkFBeEIsQ0FBTjtBQUM5RCxRQUFJTSxLQUFLLEdBQUdYLFNBQVMsQ0FBQ0UsSUFBRCxDQUFyQjtBQUNBLFFBQUksT0FBT1MsS0FBUCxLQUFpQixXQUFyQixFQUFrQyxNQUFNLElBQUlSLFNBQUosQ0FBY0Msc0JBQVVJLG9CQUF4QixDQUFOO0FBQ2xDVSxJQUFBQSxDQUFDLENBQUNHLElBQUYsR0FBU25CLElBQVQ7QUFKOEI7QUFBQTtBQUFBOztBQUFBO0FBSzlCLDJCQUFnQlMsS0FBaEIsOEhBQXVCO0FBQUEsWUFBZEQsR0FBYztBQUNuQixZQUFJLENBQUNBLEdBQUcsQ0FBQ1EsQ0FBRCxDQUFSLEVBQ0k7QUFDUDtBQVI2QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVM5QjtBQUNILEdBVkQ7QUFXSCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlc291cmNlcyBmcm9tICcuL3Jlc291cmNlcydcbmltcG9ydCBIZWxwZXIgZnJvbSAnLi9oZWxwZXInO1xuXG4vKipcbiAqIOS6i+S7tuaooeWei+exu1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudCB7XG4gICAgLyoqXG4gICAgICog5Yib5bu65LiA5Liq5paw55qE5LqL5Lu25qih5Z6L44CCXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDkuovku7bliJfooahcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGxldCBldmVudExpc3QgPSB7fTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa3u+WKoOS6i+S7tlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0g5LqL5Lu25ZCN56ewXG4gICAgICAgICAqIEB0aHJvd3Mge1R5cGVFcnJvcn0g5Lyg5YWl55qE5Y+C5pWw6ZSZ6K+v5oiW5LqL5Lu25bey5a2Y5Zyo5pe25byV5Y+R6ZSZ6K+v44CC6K+35Y+C6ZiFIE1ETiBbVHlwZUVycm9yXXtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy96aC1DTi9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9UeXBlRXJyb3J9IOOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5hZGQgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBuYW1lICE9ICdzdHJpbmcnKSB0aHJvdyBuZXcgVHlwZUVycm9yKFJlc291cmNlcy5QQVJBTUVURVJTX1RZUEVfRVJST1IpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBldmVudExpc3RbbmFtZV0gIT0gJ3VuZGVmaW5lZCcpIHRocm93IG5ldyBUeXBlRXJyb3IoUmVzb3VyY2VzLkVWRU5UX0FMUkVBRFlfRVhJU1RTX0VSUk9SKTtcbiAgICAgICAgICAgIGV2ZW50TGlzdFtuYW1lXSA9IFtdO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICog5Yig6Zmk5LqL5Lu2XG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSDkuovku7blkI3np7BcbiAgICAgICAgICogQHRocm93cyB7VHlwZUVycm9yfSDkvKDlhaXnmoTlj4LmlbDplJnor6/miJbkuovku7bkuI3lrZjlnKjml7blvJXlj5HplJnor6/jgILor7flj4LpmIUgTUROIFtUeXBlRXJyb3Jde0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3poLUNOL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1R5cGVFcnJvcn0g44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnJlbW92ZSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG5hbWUgIT0gJ3N0cmluZycpIHRocm93IG5ldyBUeXBlRXJyb3IoUmVzb3VyY2VzLlBBUkFNRVRFUlNfVFlQRV9FUlJPUik7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGV2ZW50TGlzdFtuYW1lXSA9PT0gJ3VuZGVmaW5lZCcpIHRocm93IG5ldyBUeXBlRXJyb3IoUmVzb3VyY2VzLkVWRU5UX05BTUVfTk9UX0ZPVU5EKTtcbiAgICAgICAgICAgIGRlbGV0ZSAoZXZlbnRMaXN0W25hbWVdKTtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOe7keWumuS6i+S7tuWkhOeQhueoi+W6j1xuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0g5LqL5Lu25ZCN56ewXG4gICAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZ1biAtIOS6i+S7tuWkhOeQhueoi+W6j1xuICAgICAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSDmt7vliqDlkI7nmoTkuovku7bmlbBcbiAgICAgICAgICogQHRocm93cyB7VHlwZUVycm9yfSDkvKDlhaXnmoTlj4LmlbDplJnor6/miJbkuovku7bkuI3lrZjlnKjml7blvJXlj5HplJnor6/jgILor7flj4LpmIUgTUROIFtUeXBlRXJyb3Jde0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3poLUNOL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1R5cGVFcnJvcn0g44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmJpbmQgPSBmdW5jdGlvbiAobmFtZSwgZnVuKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG5hbWUgIT0gJ3N0cmluZycgfHwgdHlwZW9mIGZ1biAhPSAnZnVuY3Rpb24nKSB0aHJvdyBuZXcgVHlwZUVycm9yKFJlc291cmNlcy5QQVJBTUVURVJTX1RZUEVfRVJST1IpO1xuICAgICAgICAgICAgbGV0IGV2ZW50ID0gZXZlbnRMaXN0W25hbWVdO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBldmVudCA9PT0gJ3VuZGVmaW5lZCcpIHRocm93IG5ldyBUeXBlRXJyb3IoUmVzb3VyY2VzLkVWRU5UX05BTUVfTk9UX0ZPVU5EKTtcbiAgICAgICAgICAgIGZvciAobGV0IGluZGV4IGluIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50W2luZGV4XSA9PT0gZnVuKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZXZlbnQudW5zaGlmdChmdW4pO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICog6Kej57uR5LqL5Lu25aSE55CG56iL5bqP77yIZnVu5Li656m66Kej57uR5omA5pyJ5LqL5Lu25aSE55CG56iL5bqP77yJXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSDkuovku7blkI3np7BcbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZnVuIC0g5LqL5Lu25aSE55CG56iL5bqPXG4gICAgICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IOWIoOmZpOWQjueahOS6i+S7tuaVsFxuICAgICAgICAgKiBAdGhyb3dzIHtUeXBlRXJyb3J9IOS8oOWFpeeahOWPguaVsOmUmeivr+aIluS6i+S7tuS4jeWtmOWcqOaXtuW8leWPkemUmeivr+OAguivt+WPgumYhSBNRE4gW1R5cGVFcnJvcl17QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvemgtQ04vZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvVHlwZUVycm9yfSDjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudW5iaW5kID0gZnVuY3Rpb24gKG5hbWUsIGZ1bikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBuYW1lICE9ICdzdHJpbmcnKSB0aHJvdyBuZXcgVHlwZUVycm9yKFJlc291cmNlcy5QQVJBTUVURVJTX1RZUEVfRVJST1IpO1xuICAgICAgICAgICAgbGV0IGV2ZW50ID0gZXZlbnRMaXN0W25hbWVdO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBldmVudCA9PT0gJ3VuZGVmaW5lZCcpIHRocm93IG5ldyBUeXBlRXJyb3IoUmVzb3VyY2VzLkVWRU5UX05BTUVfTk9UX0ZPVU5EKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZnVuID09ICdmdW5jdGlvbicpIGZvciAobGV0IGluZGV4IGluIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50W2luZGV4XSA9PT0gZnVuKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnNwbGljZShmdW4sIDEpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnQubGVuZ3RoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBldmVudExpc3RbbmFtZV0gPSBbXTtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOinpuWPkeS6i+S7tlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0g5LqL5Lu25ZCN56ewXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlIC0g5LqL5Lu25pWw5o2uXG4gICAgICAgICAqIEB0aHJvd3Mge1R5cGVFcnJvcn0g5Lyg5YWl55qE5Y+C5pWw6ZSZ6K+v5oiW5LqL5Lu25LiN5a2Y5Zyo5pe25byV5Y+R6ZSZ6K+v44CC6K+35Y+C6ZiFIE1ETiBbVHlwZUVycm9yXXtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy96aC1DTi9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9UeXBlRXJyb3J9IOOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy50cmlnZ2VyID0gZnVuY3Rpb24gKG5hbWUsIGUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbmFtZSAhPSAnc3RyaW5nJyB8fCBIZWxwZXIuX3R5cGVvZihlKSAhPSAnb2JqZWN0JykgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuUEFSQU1FVEVSU19UWVBFX0VSUk9SKTtcbiAgICAgICAgICAgIGxldCBldmVudCA9IGV2ZW50TGlzdFtuYW1lXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXZlbnQgPT09ICd1bmRlZmluZWQnKSB0aHJvdyBuZXcgVHlwZUVycm9yKFJlc291cmNlcy5FVkVOVF9OQU1FX05PVF9GT1VORCk7XG4gICAgICAgICAgICBlLnR5cGUgPSBuYW1lO1xuICAgICAgICAgICAgZm9yIChsZXQgZnVuIG9mIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFmdW4oZSkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbiJdLCJmaWxlIjoibGliL2V2ZW50LmpzIn0=
