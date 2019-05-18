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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9ldmVudC5qcyJdLCJuYW1lcyI6WyJFdmVudCIsImV2ZW50TGlzdCIsImFkZCIsIm5hbWUiLCJUeXBlRXJyb3IiLCJSZXNvdXJjZXMiLCJQQVJBTUVURVJTX1RZUEVfRVJST1IiLCJFVkVOVF9BTFJFQURZX0VYSVNUU19FUlJPUiIsInJlbW92ZSIsIkVWRU5UX05BTUVfTk9UX0ZPVU5EIiwiYmluZCIsImZ1biIsImV2ZW50IiwiaW5kZXgiLCJ1bnNoaWZ0IiwidW5iaW5kIiwic3BsaWNlIiwibGVuZ3RoIiwidHJpZ2dlciIsImUiLCJIZWxwZXIiLCJfdHlwZW9mIiwidHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7OztBQUVBOzs7SUFHcUJBLEs7QUFDakI7OztBQUdBLGlCQUFjO0FBQUE7O0FBQ1Y7Ozs7QUFJQSxNQUFJQyxTQUFTLEdBQUcsRUFBaEI7QUFDQTs7Ozs7OztBQU1BLE9BQUtDLEdBQUwsR0FBVyxVQUFVQyxJQUFWLEVBQWdCO0FBQ3ZCLFFBQUksT0FBT0EsSUFBUCxJQUFlLFFBQW5CLEVBQTZCLE1BQU0sSUFBSUMsU0FBSixDQUFjQyxzQkFBVUMscUJBQXhCLENBQU47QUFDN0IsUUFBSSxPQUFPTCxTQUFTLENBQUNFLElBQUQsQ0FBaEIsSUFBMEIsV0FBOUIsRUFBMkMsTUFBTSxJQUFJQyxTQUFKLENBQWNDLHNCQUFVRSwwQkFBeEIsQ0FBTjtBQUMzQ04sSUFBQUEsU0FBUyxDQUFDRSxJQUFELENBQVQsR0FBa0IsRUFBbEI7QUFDSCxHQUpEO0FBS0E7Ozs7Ozs7O0FBTUEsT0FBS0ssTUFBTCxHQUFjLFVBQVVMLElBQVYsRUFBZ0I7QUFDMUIsUUFBSSxPQUFPQSxJQUFQLElBQWUsUUFBbkIsRUFBNkIsTUFBTSxJQUFJQyxTQUFKLENBQWNDLHNCQUFVQyxxQkFBeEIsQ0FBTjtBQUM3QixRQUFJLE9BQU9MLFNBQVMsQ0FBQ0UsSUFBRCxDQUFoQixLQUEyQixXQUEvQixFQUE0QyxNQUFNLElBQUlDLFNBQUosQ0FBY0Msc0JBQVVJLG9CQUF4QixDQUFOO0FBQzVDLFdBQVFSLFNBQVMsQ0FBQ0UsSUFBRCxDQUFqQjtBQUNILEdBSkQ7QUFLQTs7Ozs7Ozs7OztBQVFBLE9BQUtPLElBQUwsR0FBWSxVQUFVUCxJQUFWLEVBQWdCUSxHQUFoQixFQUFxQjtBQUM3QixRQUFJLE9BQU9SLElBQVAsSUFBZSxRQUFmLElBQTJCLE9BQU9RLEdBQVAsSUFBYyxVQUE3QyxFQUF5RCxNQUFNLElBQUlQLFNBQUosQ0FBY0Msc0JBQVVDLHFCQUF4QixDQUFOO0FBQ3pELFFBQUlNLEtBQUssR0FBR1gsU0FBUyxDQUFDRSxJQUFELENBQXJCO0FBQ0EsUUFBSSxPQUFPUyxLQUFQLEtBQWlCLFdBQXJCLEVBQWtDLE1BQU0sSUFBSVIsU0FBSixDQUFjQyxzQkFBVUksb0JBQXhCLENBQU47O0FBQ2xDLFNBQUssSUFBSUksS0FBVCxJQUFrQkQsS0FBbEIsRUFBeUI7QUFDckIsVUFBSUEsS0FBSyxDQUFDQyxLQUFELENBQUwsS0FBaUJGLEdBQXJCLEVBQ0ksT0FBTyxLQUFQO0FBQ1A7O0FBQ0QsV0FBT0MsS0FBSyxDQUFDRSxPQUFOLENBQWNILEdBQWQsQ0FBUDtBQUNILEdBVEQ7QUFVQTs7Ozs7Ozs7OztBQVFBLE9BQUtJLE1BQUwsR0FBYyxVQUFVWixJQUFWLEVBQWdCUSxHQUFoQixFQUFxQjtBQUMvQixRQUFJLE9BQU9SLElBQVAsSUFBZSxRQUFuQixFQUE2QixNQUFNLElBQUlDLFNBQUosQ0FBY0Msc0JBQVVDLHFCQUF4QixDQUFOO0FBQzdCLFFBQUlNLEtBQUssR0FBR1gsU0FBUyxDQUFDRSxJQUFELENBQXJCO0FBQ0EsUUFBSSxPQUFPUyxLQUFQLEtBQWlCLFdBQXJCLEVBQWtDLE1BQU0sSUFBSVIsU0FBSixDQUFjQyxzQkFBVUksb0JBQXhCLENBQU47QUFDbEMsUUFBSSxPQUFPRSxHQUFQLElBQWMsVUFBbEIsRUFBOEIsS0FBSyxJQUFJRSxLQUFULElBQWtCRCxLQUFsQixFQUF5QjtBQUNuRCxVQUFJQSxLQUFLLENBQUNDLEtBQUQsQ0FBTCxLQUFpQkYsR0FBckIsRUFBMEI7QUFDdEJDLFFBQUFBLEtBQUssQ0FBQ0ksTUFBTixDQUFhTCxHQUFiLEVBQWtCLENBQWxCO0FBQ0EsZUFBT0MsS0FBSyxDQUFDSyxNQUFiO0FBQ0g7QUFDSixLQUxELE1BS09oQixTQUFTLENBQUNFLElBQUQsQ0FBVCxHQUFrQixFQUFsQjtBQUNWLEdBVkQ7QUFXQTs7Ozs7Ozs7O0FBT0EsT0FBS2UsT0FBTCxHQUFlLFVBQVVmLElBQVYsRUFBZ0JnQixDQUFoQixFQUFtQjtBQUM5QixRQUFJLE9BQU9oQixJQUFQLElBQWUsUUFBZixJQUEyQmlCLG1CQUFPQyxPQUFQLENBQWVGLENBQWYsS0FBcUIsUUFBcEQsRUFBOEQsTUFBTSxJQUFJZixTQUFKLENBQWNDLHNCQUFVQyxxQkFBeEIsQ0FBTjtBQUM5RCxRQUFJTSxLQUFLLEdBQUdYLFNBQVMsQ0FBQ0UsSUFBRCxDQUFyQjtBQUNBLFFBQUksT0FBT1MsS0FBUCxLQUFpQixXQUFyQixFQUFrQyxNQUFNLElBQUlSLFNBQUosQ0FBY0Msc0JBQVVJLG9CQUF4QixDQUFOO0FBQ2xDVSxJQUFBQSxDQUFDLENBQUNHLElBQUYsR0FBU25CLElBQVQ7QUFKOEI7QUFBQTtBQUFBOztBQUFBO0FBSzlCLDJCQUFnQlMsS0FBaEIsOEhBQXVCO0FBQUEsWUFBZEQsR0FBYztBQUNuQixZQUFJLENBQUNBLEdBQUcsQ0FBQ1EsQ0FBRCxDQUFSLEVBQ0k7QUFDUDtBQVI2QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVM5QjtBQUNILEdBVkQ7QUFXSCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlc291cmNlcyBmcm9tICcuL3Jlc291cmNlcydcbmltcG9ydCBIZWxwZXIgZnJvbSAnLi9oZWxwZXInXG5cbi8qKlxuICog5LqL5Lu25qih5Z6L57G7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50IHtcbiAgICAvKipcbiAgICAgKiDliJvlu7rkuIDkuKrmlrDnmoTkuovku7bmqKHlnovjgIJcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOS6i+S7tuWIl+ihqFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IGV2ZW50TGlzdCA9IHt9O1xuICAgICAgICAvKipcbiAgICAgICAgICog5re75Yqg5LqL5Lu2XG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSDkuovku7blkI3np7BcbiAgICAgICAgICogQHRocm93cyB7VHlwZUVycm9yfSDkvKDlhaXnmoTlj4LmlbDplJnor6/miJbkuovku7blt7LlrZjlnKjml7blvJXlj5HplJnor6/jgILor7flj4LpmIUgTUROIFtUeXBlRXJyb3Jde0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3poLUNOL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1R5cGVFcnJvcn0g44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmFkZCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG5hbWUgIT0gJ3N0cmluZycpIHRocm93IG5ldyBUeXBlRXJyb3IoUmVzb3VyY2VzLlBBUkFNRVRFUlNfVFlQRV9FUlJPUik7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGV2ZW50TGlzdFtuYW1lXSAhPSAndW5kZWZpbmVkJykgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuRVZFTlRfQUxSRUFEWV9FWElTVFNfRVJST1IpO1xuICAgICAgICAgICAgZXZlbnRMaXN0W25hbWVdID0gW107XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliKDpmaTkuovku7ZcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIOS6i+S7tuWQjeensFxuICAgICAgICAgKiBAdGhyb3dzIHtUeXBlRXJyb3J9IOS8oOWFpeeahOWPguaVsOmUmeivr+aIluS6i+S7tuS4jeWtmOWcqOaXtuW8leWPkemUmeivr+OAguivt+WPgumYhSBNRE4gW1R5cGVFcnJvcl17QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvemgtQ04vZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvVHlwZUVycm9yfSDjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucmVtb3ZlID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbmFtZSAhPSAnc3RyaW5nJykgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuUEFSQU1FVEVSU19UWVBFX0VSUk9SKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXZlbnRMaXN0W25hbWVdID09PSAndW5kZWZpbmVkJykgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuRVZFTlRfTkFNRV9OT1RfRk9VTkQpO1xuICAgICAgICAgICAgZGVsZXRlIChldmVudExpc3RbbmFtZV0pO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICog57uR5a6a5LqL5Lu25aSE55CG56iL5bqPXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSDkuovku7blkI3np7BcbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZnVuIC0g5LqL5Lu25aSE55CG56iL5bqPXG4gICAgICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IOa3u+WKoOWQjueahOS6i+S7tuaVsFxuICAgICAgICAgKiBAdGhyb3dzIHtUeXBlRXJyb3J9IOS8oOWFpeeahOWPguaVsOmUmeivr+aIluS6i+S7tuS4jeWtmOWcqOaXtuW8leWPkemUmeivr+OAguivt+WPgumYhSBNRE4gW1R5cGVFcnJvcl17QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvemgtQ04vZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvVHlwZUVycm9yfSDjgIJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuYmluZCA9IGZ1bmN0aW9uIChuYW1lLCBmdW4pIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbmFtZSAhPSAnc3RyaW5nJyB8fCB0eXBlb2YgZnVuICE9ICdmdW5jdGlvbicpIHRocm93IG5ldyBUeXBlRXJyb3IoUmVzb3VyY2VzLlBBUkFNRVRFUlNfVFlQRV9FUlJPUik7XG4gICAgICAgICAgICBsZXQgZXZlbnQgPSBldmVudExpc3RbbmFtZV07XG4gICAgICAgICAgICBpZiAodHlwZW9mIGV2ZW50ID09PSAndW5kZWZpbmVkJykgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuRVZFTlRfTkFNRV9OT1RfRk9VTkQpO1xuICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggaW4gZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnRbaW5kZXhdID09PSBmdW4pXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBldmVudC51bnNoaWZ0KGZ1bik7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDop6Pnu5Hkuovku7blpITnkIbnqIvluo/vvIhmdW7kuLrnqbrop6Pnu5HmiYDmnInkuovku7blpITnkIbnqIvluo/vvIlcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIOS6i+S7tuWQjeensFxuICAgICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmdW4gLSDkuovku7blpITnkIbnqIvluo9cbiAgICAgICAgICogQHJldHVybnMge251bWJlcn0g5Yig6Zmk5ZCO55qE5LqL5Lu25pWwXG4gICAgICAgICAqIEB0aHJvd3Mge1R5cGVFcnJvcn0g5Lyg5YWl55qE5Y+C5pWw6ZSZ6K+v5oiW5LqL5Lu25LiN5a2Y5Zyo5pe25byV5Y+R6ZSZ6K+v44CC6K+35Y+C6ZiFIE1ETiBbVHlwZUVycm9yXXtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy96aC1DTi9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9UeXBlRXJyb3J9IOOAglxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy51bmJpbmQgPSBmdW5jdGlvbiAobmFtZSwgZnVuKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG5hbWUgIT0gJ3N0cmluZycpIHRocm93IG5ldyBUeXBlRXJyb3IoUmVzb3VyY2VzLlBBUkFNRVRFUlNfVFlQRV9FUlJPUik7XG4gICAgICAgICAgICBsZXQgZXZlbnQgPSBldmVudExpc3RbbmFtZV07XG4gICAgICAgICAgICBpZiAodHlwZW9mIGV2ZW50ID09PSAndW5kZWZpbmVkJykgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuRVZFTlRfTkFNRV9OT1RfRk9VTkQpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBmdW4gPT0gJ2Z1bmN0aW9uJykgZm9yIChsZXQgaW5kZXggaW4gZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnRbaW5kZXhdID09PSBmdW4pIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3BsaWNlKGZ1biwgMSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBldmVudC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGV2ZW50TGlzdFtuYW1lXSA9IFtdO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICog6Kem5Y+R5LqL5Lu2XG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSDkuovku7blkI3np7BcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGUgLSDkuovku7bmlbDmja5cbiAgICAgICAgICogQHRocm93cyB7VHlwZUVycm9yfSDkvKDlhaXnmoTlj4LmlbDplJnor6/miJbkuovku7bkuI3lrZjlnKjml7blvJXlj5HplJnor6/jgILor7flj4LpmIUgTUROIFtUeXBlRXJyb3Jde0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3poLUNOL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1R5cGVFcnJvcn0g44CCXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnRyaWdnZXIgPSBmdW5jdGlvbiAobmFtZSwgZSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBuYW1lICE9ICdzdHJpbmcnIHx8IEhlbHBlci5fdHlwZW9mKGUpICE9ICdvYmplY3QnKSB0aHJvdyBuZXcgVHlwZUVycm9yKFJlc291cmNlcy5QQVJBTUVURVJTX1RZUEVfRVJST1IpO1xuICAgICAgICAgICAgbGV0IGV2ZW50ID0gZXZlbnRMaXN0W25hbWVdO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBldmVudCA9PT0gJ3VuZGVmaW5lZCcpIHRocm93IG5ldyBUeXBlRXJyb3IoUmVzb3VyY2VzLkVWRU5UX05BTUVfTk9UX0ZPVU5EKTtcbiAgICAgICAgICAgIGUudHlwZSA9IG5hbWU7XG4gICAgICAgICAgICBmb3IgKGxldCBmdW4gb2YgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWZ1bihlKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuICAgIH1cbn1cblxuIl0sImZpbGUiOiJsaWIvZXZlbnQuanMifQ==
