"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Helper = void 0;

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

var _resources = require("./resources");

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
  if (typeof type != 'string' && _typeof(type) != 'array') throw new TypeError(_resources.Resources.PARAMETERS_TYPE_ERROR);
  if (canBeNull && isEmpty(value)) return;

  if (_typeof(type) === 'array') {
    var flat = false;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = type[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;
        if (typeof item != 'string') throw new TypeError(_resources.Resources.PARAMETERS_TYPE_ERROR);

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
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    if (!flat) throw new TypeError(_resources.Resources.PARAMETERS_TYPE_ERROR);
  } else if (_typeof(value) != type) throw new TypeError(_resources.Resources.PARAMETERS_TYPE_ERROR);
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
  if (showWarn) console.warn(_resources.Resources.DEVICEPIXELRATIO_NOT_SUPPORT_WARN);
  return 1;
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
  getDevicePixelRatio: getDevicePixelRatio
};
exports.Helper = Helper;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9oZWxwZXIuanMiXSwibmFtZXMiOlsic2V0VmFsdWUiLCJ2YWx1ZSIsImRlZmF1bHRWYWx1ZSIsInR5cGUiLCJyZXR1cm5WYWx1ZSIsImlzRW1wdHkiLCJjbG9uZSIsImNoZWNrVHlwZSIsIl90eXBlb2YiLCJzZXRWYWx1ZXMiLCJ2YWx1ZXMiLCJkZWZhdWx0VmFsdWVzIiwidHlwZXMiLCJyZXR1cm5WYWx1ZXMiLCJfdmFsdWVzIiwia2V5IiwiY2FuQmVOdWxsIiwiVHlwZUVycm9yIiwiUmVzb3VyY2VzIiwiUEFSQU1FVEVSU19UWVBFX0VSUk9SIiwiZmxhdCIsIml0ZW0iLCJjaGVja1R5cGVzIiwiaXNOYU4iLCJvYmplY3QiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJzbGljZSIsInRvTG93ZXJDYXNlIiwicmVzdWx0IiwiY2xlYW5FbGVtZW50IiwiZWxlbWVudCIsImxhc3RDaGlsZCIsInJlbW92ZUNoaWxkIiwiZ2V0RGV2aWNlUGl4ZWxSYXRpbyIsInNob3dXYXJuIiwid2luZG93IiwiZGV2aWNlUGl4ZWxSYXRpbyIsInNjcmVlbiIsImRldmljZVhEUEkiLCJsb2dpY2FsWERQSSIsImNvbnNvbGUiLCJ3YXJuIiwiREVWSUNFUElYRUxSQVRJT19OT1RfU1VQUE9SVF9XQVJOIiwiSGVscGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBRUE7Ozs7Ozs7O0FBUUEsU0FBU0EsUUFBVCxDQUFrQkMsS0FBbEIsRUFBeUJDLFlBQXpCLEVBQXVDQyxJQUF2QyxFQUE2QztBQUN6QyxNQUFJQyxXQUFKO0FBQ0EsTUFBSUMsT0FBTyxDQUFDSixLQUFELENBQVgsRUFBb0JHLFdBQVcsR0FBR0UsS0FBSyxDQUFDSixZQUFELENBQW5CLENBQXBCLEtBQ0tFLFdBQVcsR0FBR0UsS0FBSyxDQUFDTCxLQUFELENBQW5CO0FBQ0wsTUFBSSxDQUFDSSxPQUFPLENBQUNGLElBQUQsQ0FBWixFQUFvQkksU0FBUyxD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LEVBQUVBO0FBVFYsQ0FBZiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlc291cmNlcyB9IGZyb20gJy4vcmVzb3VyY2VzJ1xuXG4vKipcbiAqIOiuvue9ruWAvFxuICogQGFsaWFzIEhlbHBlci5zZXRWYWx1ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSAtIOWAvFxuICogQHBhcmFtIHsqfSBkZWZhdWx0VmFsdWUgLSDpu5jorqTlgLxcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIC0g57G75Z6LXG4gKiBAcmV0dXJucyB7Kn0gLSDlgLxcbiAqL1xuZnVuY3Rpb24gc2V0VmFsdWUodmFsdWUsIGRlZmF1bHRWYWx1ZSwgdHlwZSkge1xuICAgIGxldCByZXR1cm5WYWx1ZTtcbiAgICBpZiAoaXNFbXB0eSh2YWx1ZSkpIHJldHVyblZhbHVlID0gY2xvbmUoZGVmYXVsdFZhbHVlKTtcbiAgICBlbHNlIHJldHVyblZhbHVlID0gY2xvbmUodmFsdWUpO1xuICAgIGlmICghaXNFbXB0eSh0eXBlKSkgY2hlY2tUeXBlKHJldHVyblZhbHVlLCB0eXBlKTtcbiAgICBlbHNlIGlmICghaXNFbXB0eShkZWZhdWx0VmFsdWUpKSBjaGVja1R5cGUocmV0dXJuVmFsdWUsIF90eXBlb2YoZGVmYXVsdFZhbHVlKSk7XG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xufVxuXG4vKipcbiAqIOiuvue9ruWkmuS4quWAvFxuICogQGFsaWFzIEhlbHBlci5zZXRWYWx1ZXNcbiAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZXMgLSDlgLxcbiAqIEBwYXJhbSB7b2JqZWN0fSBkZWZhdWx0VmFsdWVzIC0g6buY6K6k5YC8XG4gKiBAcGFyYW0ge29iamVjdH0gdHlwZXMgLSDnsbvlnotcbiAqIEByZXR1cm5zIHtvYmplY3R9IC0g5YC8XG4gKi9cbmZ1bmN0aW9uIHNldFZhbHVlcyh2YWx1ZXMsIGRlZmF1bHRWYWx1ZXMsIHR5cGVzLCBjbG9uZSA9IHRydWUpIHtcbiAgICBsZXQgcmV0dXJuVmFsdWVzID0gY2xvbmUgPyBzZXRWYWx1ZSh2YWx1ZXMsIHt9KSA6IGRlZmF1bHRWYWx1ZXM7XG4gICAgbGV0IF92YWx1ZXMgPSBjbG9uZSA/IHJldHVyblZhbHVlcyA6IHNldFZhbHVlKHZhbHVlcywge30pO1xuICAgIGZvciAobGV0IGtleSBpbiBkZWZhdWx0VmFsdWVzKSB7XG4gICAgICAgIGlmIChfdHlwZW9mKGRlZmF1bHRWYWx1ZXNba2V5XSkgPT09ICdvYmplY3QnKVxuICAgICAgICAgICAgcmV0dXJuVmFsdWVzW2tleV0gPSBzZXRWYWx1ZXMoX3ZhbHVlc1trZXldLCBkZWZhdWx0VmFsdWVzW2tleV0sIHR5cGVzW2tleV0pO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm5WYWx1ZXNba2V5XSA9IHNldFZhbHVlKF92YWx1ZXNba2V5XSwgZGVmYXVsdFZhbHVlc1trZXldLCB0eXBlc1trZXldKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldHVyblZhbHVlcztcbn1cblxuLyoqXG4gKiDmo4Dmn6XnsbvlnotcbiAqIEBhbGlhcyBIZWxwZXIuY2hlY2tUeXBlXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSDlgLxcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIC0g57G75Z6LXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGNhbkJlTnVsbCAtIOWPr+S7peS4uuepulxuICovXG5mdW5jdGlvbiBjaGVja1R5cGUodmFsdWUsIHR5cGUsIGNhbkJlTnVsbCA9IHRydWUpIHtcbiAgICBpZiAodHlwZW9mIHR5cGUgIT0gJ3N0cmluZycgJiYgX3R5cGVvZih0eXBlKSAhPSAnYXJyYXknKSB0aHJvdyBuZXcgVHlwZUVycm9yKFJlc291cmNlcy5QQVJBTUVURVJTX1RZUEVfRVJST1IpO1xuICAgIGlmIChjYW5CZU51bGwgJiYgaXNFbXB0eSh2YWx1ZSkpIHJldHVybjtcbiAgICBpZiAoX3R5cGVvZih0eXBlKSA9PT0gJ2FycmF5Jykge1xuICAgICAgICBsZXQgZmxhdCA9IGZhbHNlO1xuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHR5cGUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaXRlbSAhPSAnc3RyaW5nJykgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuUEFSQU1FVEVSU19UWVBFX0VSUk9SKTtcbiAgICAgICAgICAgIGlmIChfdHlwZW9mKHZhbHVlKSA9PT0gaXRlbSkge1xuICAgICAgICAgICAgICAgIGZsYXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghZmxhdCkgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuUEFSQU1FVEVSU19UWVBFX0VSUk9SKTtcbiAgICB9IGVsc2UgaWYgKF90eXBlb2YodmFsdWUpICE9IHR5cGUpIHRocm93IG5ldyBUeXBlRXJyb3IoUmVzb3VyY2VzLlBBUkFNRVRFUlNfVFlQRV9FUlJPUik7XG59XG5cbi8qKlxuICog5qOA5p+l5aSa5Liq5YC8XG4gKiBAYWxpYXMgSGVscGVyLmNoZWNrVHlwZXNcbiAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZXMgLSDlgLxcbiAqIEBwYXJhbSB7b2JqZWN0fSB0eXBlcyAtIOexu+Wei1xuICogQHJldHVybnMge29iamVjdH0gLSDlgLxcbiAqL1xuZnVuY3Rpb24gY2hlY2tUeXBlcyh2YWx1ZXMsIHR5cGVzLCBjYW5CZU51bGwgPSB0cnVlKSB7XG4gICAgaWYgKGNhbkJlTnVsbCAmJiBpc0VtcHR5KHZhbHVlcykpIHJldHVybjtcbiAgICBmb3IgKGxldCBrZXkgaW4gdHlwZXMpIHtcbiAgICAgICAgaWYgKF90eXBlb2YodHlwZXNba2V5XSkgPT09ICdvYmplY3QnKVxuICAgICAgICAgICAgY2hlY2tUeXBlcyh2YWx1ZXNba2V5XSwgdHlwZXNba2V5XSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGNoZWNrVHlwZSh2YWx1ZXNba2V5XSwgdHlwZXNba2V5XSwgY2FuQmVOdWxsKTtcbiAgICB9XG59XG5cbi8qKlxuICog5qOA5p+l5piv5ZCm5Li656m6XG4gKiBAYWxpYXMgSGVscGVyLmlzRW1wdHlcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgLSDlgLxcbiAqL1xuZnVuY3Rpb24gaXNFbXB0eSh2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnIHx8XG4gICAgICAgICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGlzTmFOKHZhbHVlKSkgfHxcbiAgICAgICAgdmFsdWUgPT09IG51bGxcbn1cblxuLyoqXG4gKiDojrflj5blr7nosaHnmoTnsbvlnovvvIjlj6/ljLrliIbmlbDnu4TnrYnvvIlcbiAqIEBhbGlhcyBIZWxwZXIuX3R5cGVvZlxuICogQHBhcmFtIHsqfSBvYmplY3QgLSDlr7nosaFcbiAqL1xuZnVuY3Rpb24gX3R5cGVvZihvYmplY3QpIHtcbiAgICAvL2VnOiBbT2JqZWN0IEZ1bmN0aW9uXSAtPiBGdW5jdGlvbiAtPiBmdW5jdGlvblxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqZWN0KS5zbGljZSg4LCAtMSkudG9Mb3dlckNhc2UoKTtcbn1cblxuLyoqXG4gKiDlhYvpmoblr7nosaFcbiAqIEBwYXJhbSB7Kn0gb2JqZWN0IFxuICovXG5mdW5jdGlvbiBjbG9uZShvYmplY3QpIHtcbiAgICBsZXQgcmVzdWx0LCB0eXBlID0gX3R5cGVvZihvYmplY3QpO1xuICAgIC8v56Gu5a6acmVzdWx055qE57G75Z6LXG4gICAgaWYgKHR5cGUgPT09ICdvYmplY3QnKSByZXN1bHQgPSB7fTtcbiAgICBlbHNlIGlmICh0eXBlID09PSAnYXJyYXknKSByZXN1bHQgPSBbXTtcbiAgICBlbHNlIHJldHVybiBvYmplY3Q7XG4gICAgZm9yIChsZXQga2V5IGluIG9iamVjdCkge1xuICAgICAgICByZXN1bHRba2V5XSA9IGNsb25lKG9iamVjdFtrZXldKTsgLy/pgJLlvZLosIPnlKhcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiDmuIXnqbrlhYPntKBcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBcbiAqL1xuZnVuY3Rpb24gY2xlYW5FbGVtZW50KGVsZW1lbnQpIHtcbiAgICBsZXQgbGFzdENoaWxkO1xuICAgIHdoaWxlICgobGFzdENoaWxkID0gZWxlbWVudC5sYXN0Q2hpbGQpICE9IG51bGwpIGVsZW1lbnQucmVtb3ZlQ2hpbGQobGFzdENoaWxkKTtcbn1cblxuLyoqXG4gKiDojrflj5blsY/luZXnmoTorr7lpIflg4/ntKDmr5RcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gc2hvd1dhcm4gLSDmmL7npLrorablkYpcbiAqL1xuZnVuY3Rpb24gZ2V0RGV2aWNlUGl4ZWxSYXRpbyhzaG93V2FybiA9IGZhbHNlKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyA9PT0gJ251bWJlcicpIHJldHVybiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICBpZiAodHlwZW9mIHdpbmRvdy5zY3JlZW4uZGV2aWNlWERQSSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHdpbmRvdy5zY3JlZW4ubG9naWNhbFhEUEkgPT09ICdudW1iZXInKSByZXR1cm4gc2NyZWVuLmRldmljZVhEUEkgLyBzY3JlZW4ubG9naWNhbFhEUEk7XG4gICAgLy/kuI3mlK/mjIEgZGV2aWNlUGl4ZWxSYXRpbyDnmoTorablkYpcbiAgICBpZihzaG93V2FybikgY29uc29sZS53YXJuKFJlc291cmNlcy5ERVZJQ0VQSVhFTFJBVElPX05PVF9TVVBQT1JUX1dBUk4pO1xuICAgIHJldHVybiAxO1xufVxuXG4vKipcbiAqIOW4ruWKqeWvueixoVxuICogQG5hbWVzcGFjZVxuICovXG5jb25zdCBIZWxwZXIgPSB7XG4gICAgc2V0VmFsdWU6IHNldFZhbHVlLFxuICAgIHNldFZhbHVlczogc2V0VmFsdWVzLFxuICAgIGNoZWNrVHlwZTogY2hlY2tUeXBlLFxuICAgIGNoZWNrVHlwZXM6IGNoZWNrVHlwZXMsXG4gICAgaXNFbXB0eTogaXNFbXB0eSxcbiAgICBfdHlwZW9mOiBfdHlwZW9mLFxuICAgIGNsb25lOiBjbG9uZSxcbiAgICBjbGVhbkVsZW1lbnQ6IGNsZWFuRWxlbWVudCxcbiAgICBnZXREZXZpY2VQaXhlbFJhdGlvOiBnZXREZXZpY2VQaXhlbFJhdGlvXG59XG5cbmV4cG9ydCB7IEhlbHBlciB9Il0sImZpbGUiOiJsaWIvaGVscGVyLmpzIn0=
