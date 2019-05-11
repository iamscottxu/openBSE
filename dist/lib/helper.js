"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.slice");

require("core-js/modules/es.date.to-string");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _resources = _interopRequireDefault(require("./resources"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

/**
 * 设置值
 * @alias Helper.setValue
 * @param {*} value - 值
 * @param {*} defaultValue - 默认值
 * @param {string} type - 类型
 * @returns {*} - 值
 */
function setValue(value, defaultValue, type) {
  var returnValue;
  if (isEmpty(value)) returnValue = clone(defaultValue);else returnValue = clone(value);
  if (!isEmpty(type)) checkType(returnValue, type);else if (!isEmpty(defaultValue)) checkType(returnValue, _typeof(defaultValue));
  return returnValue;
}
/**
 * 设置多个值
 * @alias Helper.setValues
 * @param {object} values - 值
 * @param {object} defaultValues - 默认值
 * @param {object} types - 类型
 * @returns {object} - 值
 */


function setValues(values, defaultValues, types) {
  var clone = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var returnValues = clone ? setValue(values, {}) : defaultValues;

  var _values = clone ? returnValues : setValue(values, {});

  for (var key in defaultValues) {
    if (_typeof(defaultValues[key]) === 'object') returnValues[key] = setValues(_values[key], defaultValues[key], types[key]);else returnValues[key] = setValue(_values[key], defaultValues[key], types[key]);
  }

  return returnValues;
}
/**
 * 检查类型
 * @alias Helper.checkType
 * @param {string} value - 值
 * @param {string} type - 类型
 * @param {boolean} canBeNull - 可以为空
 */


function checkType(value, type) {
  var canBeNull = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  if (typeof type != 'string' && _typeof(type) != 'array') throw new TypeError(_resources["default"].PARAMETERS_TYPE_ERROR);
  if (canBeNull && isEmpty(value)) return;

  if (_typeof(type) === 'array') {
    var flat = false;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = type[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;
        if (typeof item != 'string') throw new TypeError(_resources["default"].PARAMETERS_TYPE_ERROR);

        if (_typeof(value) === item) {
          flat = true;
          break;
        }
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

    if (!flat) throw new TypeError(_resources["default"].PARAMETERS_TYPE_ERROR);
  } else if (_typeof(value) != type) throw new TypeError(_resources["default"].PARAMETERS_TYPE_ERROR);
}
/**
 * 检查多个值
 * @alias Helper.checkTypes
 * @param {object} values - 值
 * @param {object} types - 类型
 * @returns {object} - 值
 */


function checkTypes(values, types) {
  var canBeNull = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  if (canBeNull && isEmpty(values)) return;

  for (var key in types) {
    if (_typeof(types[key]) === 'object') checkTypes(values[key], types[key]);else checkType(values[key], types[key], canBeNull);
  }
}
/**
 * 检查是否为空
 * @alias Helper.isEmpty
 * @param {*} value - 值
 */


function isEmpty(value) {
  return typeof value === 'undefined' || typeof value === 'number' && isNaN(value) || value === null;
}
/**
 * 获取对象的类型（可区分数组等）
 * @alias Helper._typeof
 * @param {*} object - 对象
 */


function _typeof(object) {
  return Object.prototype.toString.call(object).slice(8, -1).toLowerCase();
}
/**
 * 克隆对象
 * @param {*} object 
 */


function clone(object) {
  var result,
      type = _typeof(object);

  if (type === 'object') result = {};else if (type === 'array') result = [];else return object;

  for (var key in object) {
    result[key] = clone(object[key]);
  }

  return result;
}
/**
 * 清空元素
 * @param {Element} element 
 */


function cleanElement(element) {
  var lastChild;

  while ((lastChild = element.lastChild) != null) {
    element.removeChild(lastChild);
  }
}
/**
 * 获取屏幕的设备像素比
 * @param {boolean} showWarn - 显示警告
 */


function getDevicePixelRatio() {
  var showWarn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  if (typeof window.devicePixelRatio === 'number') return window.devicePixelRatio;
  if (typeof window.screen.deviceXDPI === 'number' && typeof window.screen.logicalXDPI === 'number') return screen.deviceXDPI / screen.logicalXDPI;
  if (showWarn) console.warn(_resources["default"].DEVICEPIXELRATIO_NOT_SUPPORT_WARN);
  return 1;
}
/**
 * 浅比较
 * @param {*} objectA - 对象A
 * @param {*} objectB - 对象B
 * @returns {bool} - 相等为 true，不等为 false
 */


function shallowEqual(objectA, objectB) {
  if (objectA === objectB) return true;

  if (_typeof2(objectA) === 'object' && _typeof2(objectB) === 'object') {
    for (var key in objectA) {
      if (!shallowEqual(objectA[key], objectB[key])) return false;
    }

    return true;
  }

  return false;
}
/**
 * 帮助对象
 * @namespace
 */


var Helper = {
  setValue: setValue,
  setValues: setValues,
  checkType: checkType,
  checkTypes: checkTypes,
  isEmpty: isEmpty,
  _typeof: _typeof,
  clone: clone,
  cleanElement: cleanElement,
  getDevicePixelRatio: getDevicePixelRatio,
  shallowEqual: shallowEqual
};
var _default = Helper;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9oZWxwZXIuanMiXSwibmFtZXMiOlsic2V0VmFsdWUiLCJ2YWx1ZSIsImRlZmF1bHRWYWx1ZSIsInR5cGUiLCJyZXR1cm5WYWx1ZSIsImlzRW1wdHkiLCJjbG9uZSIsImNoZWNrVHlwZSIsIl90eXBlb2YiLCJzZXRWYWx1ZXMiLCJ2YWx1ZXMiLCJkZWZhdWx0VmFsdWVzIiwidHlwZXMiLCJyZXR1cm5WYWx1ZXMiLCJfdmFsdWVzIiwia2V5IiwiY2FuQmVOdWxsIiwiVHlwZUVycm9yIiwiUmVzb3VyY2VzIiwiUEFSQU1FVEVSU19UWVBFX0VSUk9SIiwiZmxhdCIsIml0ZW0iLCJjaGVja1R5cGVzIiwiaXNOYU4iLCJvYmplY3QiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJzbGljZSIsInRvTG93ZXJDYXNlIiwicmVzdWx0IiwiY2xlYW5FbGVtZW50IiwiZWxlbWVudCIsImxhc3RDaGlsZCIsInJlbW92ZUNoaWxkIiwiZ2V0RGV2aWNlUGl4ZWxSYXRpbyIsInNob3dXYXJuIiwid2luZG93IiwiZGV2aWNlUGl4ZWxSYXRpbyIsInNjcmVlbiIsImRldmljZVhEUEkiLCJsb2dpY2FsWERQSSIsImNvbnNvbGUiLCJ3YXJuIiwiREVWSUNFUElYRUxSQVRJT19OT1RfU1VQUE9SVF9XQVJOIiwic2hhbGxvd0VxdWFsIiwib2JqZWN0QSIsIm9iamVjdEIiLCJIZWxwZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUVBOzs7Ozs7OztBQVFBLFNBQVNBLFFBQVQsQ0FBa0JDLEtBQWxCLEVBQXlCQyxZQUF6QixFQUF1Q0MsSUFBdkMsRUFBNkM7QUFDekMsTUFBSUMsV0FBSjtBQUNBLE1BQUlDLE9BQU8sQ0FBQ0osS0FBRCxDQUFYLEVBQW9CRyxXQUFXLEdBQUdFLEtBQUssQ0FBQ0osWUFBRCxDQUFuQixDQUFwQixLQUNLRSxXQUFXLEdBQUdFLEtBQUssQ0FBQ0wsS0FBRCxDQUFuQjtB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LFlBQVksQ0FBQ0MsT0FBTyxDQUFDaEMsR0FBRCxDQUFSLEVBQWVpQyxPQUFPLENBQUNqQyxHQUFELENBQXRCLENBQWpCLEVBQStDLE9BQU8sS0FBUDtBQURuRDs7QUFFQSxXQUFPLElBQVA7QUFDSDs7QUFDRCxTQUFPLEtBQVA7QUFDSDtBQUVEOzs7Ozs7QUFJQSxJQUFNa0MsTUFBTSxHQUFHO0FBQ1hqRCxFQUFBQSxRQUFRLEVBQUVBLFFBREM7QUFFWFMsRUFBQUEsU0FBUyxFQUFFQSxTQUZBO0FBR1hGLEVBQUFBLFNBQVMsRUFBRUEsU0FIQTtBQUlYZSxFQUFBQSxVQUFVLEVBQUVBLFVBSkQ7QUFLWGpCLEVBQUFBLE9BQU8sRUFBRUEsT0FMRTtBQU1YRyxFQUFBQSxPQUFPLEVBQUVBLE9BTkU7QUFPWEYsRUFBQUEsS0FBSyxFQUFFQSxLQVBJO0FBUVgwQixFQUFBQSxZQUFZLEVBQUVBLFlBUkg7QUFTWEksRUFBQUEsbUJBQW1CLEVBQUVBLG1CQVRWO0FBVVhVLEVBQUFBLFlBQVksRUFBRUE7QUFWSCxDQUFmO2VBWWVHLE0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVzb3VyY2VzIGZyb20gJy4vcmVzb3VyY2VzJ1xuXG4vKipcbiAqIOiuvue9ruWAvFxuICogQGFsaWFzIEhlbHBlci5zZXRWYWx1ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSAtIOWAvFxuICogQHBhcmFtIHsqfSBkZWZhdWx0VmFsdWUgLSDpu5jorqTlgLxcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIC0g57G75Z6LXG4gKiBAcmV0dXJucyB7Kn0gLSDlgLxcbiAqL1xuZnVuY3Rpb24gc2V0VmFsdWUodmFsdWUsIGRlZmF1bHRWYWx1ZSwgdHlwZSkge1xuICAgIGxldCByZXR1cm5WYWx1ZTtcbiAgICBpZiAoaXNFbXB0eSh2YWx1ZSkpIHJldHVyblZhbHVlID0gY2xvbmUoZGVmYXVsdFZhbHVlKTtcbiAgICBlbHNlIHJldHVyblZhbHVlID0gY2xvbmUodmFsdWUpO1xuICAgIGlmICghaXNFbXB0eSh0eXBlKSkgY2hlY2tUeXBlKHJldHVyblZhbHVlLCB0eXBlKTtcbiAgICBlbHNlIGlmICghaXNFbXB0eShkZWZhdWx0VmFsdWUpKSBjaGVja1R5cGUocmV0dXJuVmFsdWUsIF90eXBlb2YoZGVmYXVsdFZhbHVlKSk7XG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xufVxuXG4vKipcbiAqIOiuvue9ruWkmuS4quWAvFxuICogQGFsaWFzIEhlbHBlci5zZXRWYWx1ZXNcbiAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZXMgLSDlgLxcbiAqIEBwYXJhbSB7b2JqZWN0fSBkZWZhdWx0VmFsdWVzIC0g6buY6K6k5YC8XG4gKiBAcGFyYW0ge29iamVjdH0gdHlwZXMgLSDnsbvlnotcbiAqIEByZXR1cm5zIHtvYmplY3R9IC0g5YC8XG4gKi9cbmZ1bmN0aW9uIHNldFZhbHVlcyh2YWx1ZXMsIGRlZmF1bHRWYWx1ZXMsIHR5cGVzLCBjbG9uZSA9IHRydWUpIHtcbiAgICBsZXQgcmV0dXJuVmFsdWVzID0gY2xvbmUgPyBzZXRWYWx1ZSh2YWx1ZXMsIHt9KSA6IGRlZmF1bHRWYWx1ZXM7XG4gICAgbGV0IF92YWx1ZXMgPSBjbG9uZSA/IHJldHVyblZhbHVlcyA6IHNldFZhbHVlKHZhbHVlcywge30pO1xuICAgIGZvciAobGV0IGtleSBpbiBkZWZhdWx0VmFsdWVzKSB7XG4gICAgICAgIGlmIChfdHlwZW9mKGRlZmF1bHRWYWx1ZXNba2V5XSkgPT09ICdvYmplY3QnKVxuICAgICAgICAgICAgcmV0dXJuVmFsdWVzW2tleV0gPSBzZXRWYWx1ZXMoX3ZhbHVlc1trZXldLCBkZWZhdWx0VmFsdWVzW2tleV0sIHR5cGVzW2tleV0pO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm5WYWx1ZXNba2V5XSA9IHNldFZhbHVlKF92YWx1ZXNba2V5XSwgZGVmYXVsdFZhbHVlc1trZXldLCB0eXBlc1trZXldKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldHVyblZhbHVlcztcbn1cblxuLyoqXG4gKiDmo4Dmn6XnsbvlnotcbiAqIEBhbGlhcyBIZWxwZXIuY2hlY2tUeXBlXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSDlgLxcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIC0g57G75Z6LXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGNhbkJlTnVsbCAtIOWPr+S7peS4uuepulxuICovXG5mdW5jdGlvbiBjaGVja1R5cGUodmFsdWUsIHR5cGUsIGNhbkJlTnVsbCA9IHRydWUpIHtcbiAgICBpZiAodHlwZW9mIHR5cGUgIT0gJ3N0cmluZycgJiYgX3R5cGVvZih0eXBlKSAhPSAnYXJyYXknKSB0aHJvdyBuZXcgVHlwZUVycm9yKFJlc291cmNlcy5QQVJBTUVURVJTX1RZUEVfRVJST1IpO1xuICAgIGlmIChjYW5CZU51bGwgJiYgaXNFbXB0eSh2YWx1ZSkpIHJldHVybjtcbiAgICBpZiAoX3R5cGVvZih0eXBlKSA9PT0gJ2FycmF5Jykge1xuICAgICAgICBsZXQgZmxhdCA9IGZhbHNlO1xuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHR5cGUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaXRlbSAhPSAnc3RyaW5nJykgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuUEFSQU1FVEVSU19UWVBFX0VSUk9SKTtcbiAgICAgICAgICAgIGlmIChfdHlwZW9mKHZhbHVlKSA9PT0gaXRlbSkge1xuICAgICAgICAgICAgICAgIGZsYXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghZmxhdCkgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuUEFSQU1FVEVSU19UWVBFX0VSUk9SKTtcbiAgICB9IGVsc2UgaWYgKF90eXBlb2YodmFsdWUpICE9IHR5cGUpIHRocm93IG5ldyBUeXBlRXJyb3IoUmVzb3VyY2VzLlBBUkFNRVRFUlNfVFlQRV9FUlJPUik7XG59XG5cbi8qKlxuICog5qOA5p+l5aSa5Liq5YC8XG4gKiBAYWxpYXMgSGVscGVyLmNoZWNrVHlwZXNcbiAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZXMgLSDlgLxcbiAqIEBwYXJhbSB7b2JqZWN0fSB0eXBlcyAtIOexu+Wei1xuICogQHJldHVybnMge29iamVjdH0gLSDlgLxcbiAqL1xuZnVuY3Rpb24gY2hlY2tUeXBlcyh2YWx1ZXMsIHR5cGVzLCBjYW5CZU51bGwgPSB0cnVlKSB7XG4gICAgaWYgKGNhbkJlTnVsbCAmJiBpc0VtcHR5KHZhbHVlcykpIHJldHVybjtcbiAgICBmb3IgKGxldCBrZXkgaW4gdHlwZXMpIHtcbiAgICAgICAgaWYgKF90eXBlb2YodHlwZXNba2V5XSkgPT09ICdvYmplY3QnKVxuICAgICAgICAgICAgY2hlY2tUeXBlcyh2YWx1ZXNba2V5XSwgdHlwZXNba2V5XSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGNoZWNrVHlwZSh2YWx1ZXNba2V5XSwgdHlwZXNba2V5XSwgY2FuQmVOdWxsKTtcbiAgICB9XG59XG5cbi8qKlxuICog5qOA5p+l5piv5ZCm5Li656m6XG4gKiBAYWxpYXMgSGVscGVyLmlzRW1wdHlcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgLSDlgLxcbiAqL1xuZnVuY3Rpb24gaXNFbXB0eSh2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnIHx8XG4gICAgICAgICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGlzTmFOKHZhbHVlKSkgfHxcbiAgICAgICAgdmFsdWUgPT09IG51bGxcbn1cblxuLyoqXG4gKiDojrflj5blr7nosaHnmoTnsbvlnovvvIjlj6/ljLrliIbmlbDnu4TnrYnvvIlcbiAqIEBhbGlhcyBIZWxwZXIuX3R5cGVvZlxuICogQHBhcmFtIHsqfSBvYmplY3QgLSDlr7nosaFcbiAqL1xuZnVuY3Rpb24gX3R5cGVvZihvYmplY3QpIHtcbiAgICAvL2VnOiBbT2JqZWN0IEZ1bmN0aW9uXSAtPiBGdW5jdGlvbiAtPiBmdW5jdGlvblxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqZWN0KS5zbGljZSg4LCAtMSkudG9Mb3dlckNhc2UoKTtcbn1cblxuLyoqXG4gKiDlhYvpmoblr7nosaFcbiAqIEBwYXJhbSB7Kn0gb2JqZWN0IFxuICovXG5mdW5jdGlvbiBjbG9uZShvYmplY3QpIHtcbiAgICBsZXQgcmVzdWx0LCB0eXBlID0gX3R5cGVvZihvYmplY3QpO1xuICAgIC8v56Gu5a6acmVzdWx055qE57G75Z6LXG4gICAgaWYgKHR5cGUgPT09ICdvYmplY3QnKSByZXN1bHQgPSB7fTtcbiAgICBlbHNlIGlmICh0eXBlID09PSAnYXJyYXknKSByZXN1bHQgPSBbXTtcbiAgICBlbHNlIHJldHVybiBvYmplY3Q7XG4gICAgZm9yIChsZXQga2V5IGluIG9iamVjdCkge1xuICAgICAgICByZXN1bHRba2V5XSA9IGNsb25lKG9iamVjdFtrZXldKTsgLy/pgJLlvZLosIPnlKhcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiDmuIXnqbrlhYPntKBcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBcbiAqL1xuZnVuY3Rpb24gY2xlYW5FbGVtZW50KGVsZW1lbnQpIHtcbiAgICBsZXQgbGFzdENoaWxkO1xuICAgIHdoaWxlICgobGFzdENoaWxkID0gZWxlbWVudC5sYXN0Q2hpbGQpICE9IG51bGwpIGVsZW1lbnQucmVtb3ZlQ2hpbGQobGFzdENoaWxkKTtcbn1cblxuLyoqXG4gKiDojrflj5blsY/luZXnmoTorr7lpIflg4/ntKDmr5RcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gc2hvd1dhcm4gLSDmmL7npLrorablkYpcbiAqL1xuZnVuY3Rpb24gZ2V0RGV2aWNlUGl4ZWxSYXRpbyhzaG93V2FybiA9IGZhbHNlKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyA9PT0gJ251bWJlcicpIHJldHVybiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICBpZiAodHlwZW9mIHdpbmRvdy5zY3JlZW4uZGV2aWNlWERQSSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHdpbmRvdy5zY3JlZW4ubG9naWNhbFhEUEkgPT09ICdudW1iZXInKSByZXR1cm4gc2NyZWVuLmRldmljZVhEUEkgLyBzY3JlZW4ubG9naWNhbFhEUEk7XG4gICAgLy/kuI3mlK/mjIEgZGV2aWNlUGl4ZWxSYXRpbyDnmoTorablkYpcbiAgICBpZihzaG93V2FybikgY29uc29sZS53YXJuKFJlc291cmNlcy5ERVZJQ0VQSVhFTFJBVElPX05PVF9TVVBQT1JUX1dBUk4pO1xuICAgIHJldHVybiAxO1xufVxuXG4vKipcbiAqIOa1heavlOi+g1xuICogQHBhcmFtIHsqfSBvYmplY3RBIC0g5a+56LGhQVxuICogQHBhcmFtIHsqfSBvYmplY3RCIC0g5a+56LGhQlxuICogQHJldHVybnMge2Jvb2x9IC0g55u4562J5Li6IHRydWXvvIzkuI3nrYnkuLogZmFsc2VcbiAqL1xuZnVuY3Rpb24gc2hhbGxvd0VxdWFsKG9iamVjdEEsIG9iamVjdEIpIHtcbiAgICBpZiAob2JqZWN0QSA9PT0gb2JqZWN0QikgcmV0dXJuIHRydWU7XG4gICAgaWYgKHR5cGVvZiBvYmplY3RBID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygb2JqZWN0QiA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIG9iamVjdEEpXG4gICAgICAgICAgICBpZiAoIXNoYWxsb3dFcXVhbChvYmplY3RBW2tleV0sIG9iamVjdEJba2V5XSkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiDluK7liqnlr7nosaFcbiAqIEBuYW1lc3BhY2VcbiAqL1xuY29uc3QgSGVscGVyID0ge1xuICAgIHNldFZhbHVlOiBzZXRWYWx1ZSxcbiAgICBzZXRWYWx1ZXM6IHNldFZhbHVlcyxcbiAgICBjaGVja1R5cGU6IGNoZWNrVHlwZSxcbiAgICBjaGVja1R5cGVzOiBjaGVja1R5cGVzLFxuICAgIGlzRW1wdHk6IGlzRW1wdHksXG4gICAgX3R5cGVvZjogX3R5cGVvZixcbiAgICBjbG9uZTogY2xvbmUsXG4gICAgY2xlYW5FbGVtZW50OiBjbGVhbkVsZW1lbnQsXG4gICAgZ2V0RGV2aWNlUGl4ZWxSYXRpbzogZ2V0RGV2aWNlUGl4ZWxSYXRpbyxcbiAgICBzaGFsbG93RXF1YWw6IHNoYWxsb3dFcXVhbFxufVxuZXhwb3J0IGRlZmF1bHQgSGVscGVyXG5cbiJdLCJmaWxlIjoibGliL2hlbHBlci5qcyJ9
