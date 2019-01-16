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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9oZWxwZXIuanMiXSwibmFtZXMiOlsic2V0VmFsdWUiLCJ2YWx1ZSIsImRlZmF1bHRWYWx1ZSIsInR5cGUiLCJyZXR1cm5WYWx1ZSIsImlzRW1wdHkiLCJjbG9uZSIsImNoZWNrVHlwZSIsIl90eXBlb2YiLCJzZXRWYWx1ZXMiLCJ2YWx1ZXMiLCJkZWZhdWx0VmFsdWVzIiwidHlwZXMiLCJyZXR1cm5WYWx1ZXMiLCJfdmFsdWVzIiwia2V5IiwiY2FuQmVOdWxsIiwiVHlwZUVycm9yIiwiUmVzb3VyY2VzIiwiUEFSQU1FVEVSU19UWVBFX0VSUk9SIiwiZmxhdCIsIml0ZW0iLCJjaGVja1R5cGVzIiwiaXNOYU4iLCJvYmplY3QiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJzbGljZSIsInRvTG93ZXJDYXNlIiwicmVzdWx0IiwiY2xlYW5FbGVtZW50IiwiZWxlbWVudCIsImxhc3RDaGlsZCIsInJlbW92ZUNoaWxkIiwiZ2V0RGV2aWNlUGl4ZWxSYXRpbyIsInNob3dXYXJuIiwid2luZG93IiwiZGV2aWNlUGl4ZWxSYXRpbyIsInNjcmVlbiIsImRldmljZVhEUEkiLCJsb2dpY2FsWERQSSIsImNvbnNvbGUiLCJ3YXJuIiwiREVWSUNFUElYRUxSQVRJT19OT1RfU1VQUE9SVF9XQVJOIiwiSGVscGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBRUE7Ozs7Ozs7O0FBUUEsU0FBU0EsUUFBVCxDQUFrQkMsS0FBbEIsRUFBeUJDLFlBQXpCLEVBQXVDQyxJQUF2QyxFQUE2QztBQUN6QyxNQUFJQyxXQUFKO0FBQ0EsTUFBSUMsT0FBTyxDQUFDSixLQUFELENBQVgsRUFBb0JHLFdBQVcsR0FBR0UsS0FBSyxDQUFDSixZQUFELENBQW5CLENBQXBCLEtBQ0tFLFdBQVcsR0FBR0UsS0FBSyxDQUFDTCxLQUFELENBQW5CO0FBQ0wsTUFBSSxDQUFDSSxPQUFPLENBQUNGLElBQUQsQ0FBWixFQUFvQkksU0FBUyxD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LEVBQUVBO0FBVFYsQ0FBZiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlc291cmNlcyB9IGZyb20gJy4vcmVzb3VyY2VzJ1xyXG5cclxuLyoqXHJcbiAqIOiuvue9ruWAvFxyXG4gKiBAYWxpYXMgSGVscGVyLnNldFZhbHVlXHJcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgLSDlgLxcclxuICogQHBhcmFtIHsqfSBkZWZhdWx0VmFsdWUgLSDpu5jorqTlgLxcclxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgLSDnsbvlnotcclxuICogQHJldHVybnMgeyp9IC0g5YC8XHJcbiAqL1xyXG5mdW5jdGlvbiBzZXRWYWx1ZSh2YWx1ZSwgZGVmYXVsdFZhbHVlLCB0eXBlKSB7XHJcbiAgICBsZXQgcmV0dXJuVmFsdWU7XHJcbiAgICBpZiAoaXNFbXB0eSh2YWx1ZSkpIHJldHVyblZhbHVlID0gY2xvbmUoZGVmYXVsdFZhbHVlKTtcclxuICAgIGVsc2UgcmV0dXJuVmFsdWUgPSBjbG9uZSh2YWx1ZSk7XHJcbiAgICBpZiAoIWlzRW1wdHkodHlwZSkpIGNoZWNrVHlwZShyZXR1cm5WYWx1ZSwgdHlwZSk7XHJcbiAgICBlbHNlIGlmICghaXNFbXB0eShkZWZhdWx0VmFsdWUpKSBjaGVja1R5cGUocmV0dXJuVmFsdWUsIF90eXBlb2YoZGVmYXVsdFZhbHVlKSk7XHJcbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDorr7nva7lpJrkuKrlgLxcclxuICogQGFsaWFzIEhlbHBlci5zZXRWYWx1ZXNcclxuICogQHBhcmFtIHtvYmplY3R9IHZhbHVlcyAtIOWAvFxyXG4gKiBAcGFyYW0ge29iamVjdH0gZGVmYXVsdFZhbHVlcyAtIOm7mOiupOWAvFxyXG4gKiBAcGFyYW0ge29iamVjdH0gdHlwZXMgLSDnsbvlnotcclxuICogQHJldHVybnMge29iamVjdH0gLSDlgLxcclxuICovXHJcbmZ1bmN0aW9uIHNldFZhbHVlcyh2YWx1ZXMsIGRlZmF1bHRWYWx1ZXMsIHR5cGVzLCBjbG9uZSA9IHRydWUpIHtcclxuICAgIGxldCByZXR1cm5WYWx1ZXMgPSBjbG9uZSA/IHNldFZhbHVlKHZhbHVlcywge30pIDogZGVmYXVsdFZhbHVlcztcclxuICAgIGxldCBfdmFsdWVzID0gY2xvbmUgPyByZXR1cm5WYWx1ZXMgOiBzZXRWYWx1ZSh2YWx1ZXMsIHt9KTtcclxuICAgIGZvciAobGV0IGtleSBpbiBkZWZhdWx0VmFsdWVzKSB7XHJcbiAgICAgICAgaWYgKF90eXBlb2YoZGVmYXVsdFZhbHVlc1trZXldKSA9PT0gJ29iamVjdCcpXHJcbiAgICAgICAgICAgIHJldHVyblZhbHVlc1trZXldID0gc2V0VmFsdWVzKF92YWx1ZXNba2V5XSwgZGVmYXVsdFZhbHVlc1trZXldLCB0eXBlc1trZXldKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVyblZhbHVlc1trZXldID0gc2V0VmFsdWUoX3ZhbHVlc1trZXldLCBkZWZhdWx0VmFsdWVzW2tleV0sIHR5cGVzW2tleV0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJldHVyblZhbHVlcztcclxufVxyXG5cclxuLyoqXHJcbiAqIOajgOafpeexu+Wei1xyXG4gKiBAYWxpYXMgSGVscGVyLmNoZWNrVHlwZVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSDlgLxcclxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgLSDnsbvlnotcclxuICogQHBhcmFtIHtib29sZWFufSBjYW5CZU51bGwgLSDlj6/ku6XkuLrnqbpcclxuICovXHJcbmZ1bmN0aW9uIGNoZWNrVHlwZSh2YWx1ZSwgdHlwZSwgY2FuQmVOdWxsID0gdHJ1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiB0eXBlICE9ICdzdHJpbmcnICYmIF90eXBlb2YodHlwZSkgIT0gJ2FycmF5JykgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuUEFSQU1FVEVSU19UWVBFX0VSUk9SKTtcclxuICAgIGlmIChjYW5CZU51bGwgJiYgaXNFbXB0eSh2YWx1ZSkpIHJldHVybjtcclxuICAgIGlmIChfdHlwZW9mKHR5cGUpID09PSAnYXJyYXknKSB7XHJcbiAgICAgICAgbGV0IGZsYXQgPSBmYWxzZTtcclxuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHR5cGUpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBpdGVtICE9ICdzdHJpbmcnKSB0aHJvdyBuZXcgVHlwZUVycm9yKFJlc291cmNlcy5QQVJBTUVURVJTX1RZUEVfRVJST1IpO1xyXG4gICAgICAgICAgICBpZiAoX3R5cGVvZih2YWx1ZSkgPT09IGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGZsYXQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFmbGF0KSB0aHJvdyBuZXcgVHlwZUVycm9yKFJlc291cmNlcy5QQVJBTUVURVJTX1RZUEVfRVJST1IpO1xyXG4gICAgfSBlbHNlIGlmIChfdHlwZW9mKHZhbHVlKSAhPSB0eXBlKSB0aHJvdyBuZXcgVHlwZUVycm9yKFJlc291cmNlcy5QQVJBTUVURVJTX1RZUEVfRVJST1IpO1xyXG59XHJcblxyXG4vKipcclxuICog5qOA5p+l5aSa5Liq5YC8XHJcbiAqIEBhbGlhcyBIZWxwZXIuY2hlY2tUeXBlc1xyXG4gKiBAcGFyYW0ge29iamVjdH0gdmFsdWVzIC0g5YC8XHJcbiAqIEBwYXJhbSB7b2JqZWN0fSB0eXBlcyAtIOexu+Wei1xyXG4gKiBAcmV0dXJucyB7b2JqZWN0fSAtIOWAvFxyXG4gKi9cclxuZnVuY3Rpb24gY2hlY2tUeXBlcyh2YWx1ZXMsIHR5cGVzLCBjYW5CZU51bGwgPSB0cnVlKSB7XHJcbiAgICBpZiAoY2FuQmVOdWxsICYmIGlzRW1wdHkodmFsdWVzKSkgcmV0dXJuO1xyXG4gICAgZm9yIChsZXQga2V5IGluIHR5cGVzKSB7XHJcbiAgICAgICAgaWYgKF90eXBlb2YodHlwZXNba2V5XSkgPT09ICdvYmplY3QnKVxyXG4gICAgICAgICAgICBjaGVja1R5cGVzKHZhbHVlc1trZXldLCB0eXBlc1trZXldKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGNoZWNrVHlwZSh2YWx1ZXNba2V5XSwgdHlwZXNba2V5XSwgY2FuQmVOdWxsKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOajgOafpeaYr+WQpuS4uuepulxyXG4gKiBAYWxpYXMgSGVscGVyLmlzRW1wdHlcclxuICogQHBhcmFtIHsqfSB2YWx1ZSAtIOWAvFxyXG4gKi9cclxuZnVuY3Rpb24gaXNFbXB0eSh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgfHxcclxuICAgICAgICAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBpc05hTih2YWx1ZSkpIHx8XHJcbiAgICAgICAgdmFsdWUgPT09IG51bGxcclxufVxyXG5cclxuLyoqXHJcbiAqIOiOt+WPluWvueixoeeahOexu+Wei++8iOWPr+WMuuWIhuaVsOe7hOetie+8iVxyXG4gKiBAYWxpYXMgSGVscGVyLl90eXBlb2ZcclxuICogQHBhcmFtIHsqfSBvYmplY3QgLSDlr7nosaFcclxuICovXHJcbmZ1bmN0aW9uIF90eXBlb2Yob2JqZWN0KSB7XHJcbiAgICAvL2VnOiBbT2JqZWN0IEZ1bmN0aW9uXSAtPiBGdW5jdGlvbiAtPiBmdW5jdGlvblxyXG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmplY3QpLnNsaWNlKDgsIC0xKS50b0xvd2VyQ2FzZSgpO1xyXG59XHJcblxyXG4vKipcclxuICog5YWL6ZqG5a+56LGhXHJcbiAqIEBwYXJhbSB7Kn0gb2JqZWN0IFxyXG4gKi9cclxuZnVuY3Rpb24gY2xvbmUob2JqZWN0KSB7XHJcbiAgICBsZXQgcmVzdWx0LCB0eXBlID0gX3R5cGVvZihvYmplY3QpO1xyXG4gICAgLy/noa7lrppyZXN1bHTnmoTnsbvlnotcclxuICAgIGlmICh0eXBlID09PSAnb2JqZWN0JykgcmVzdWx0ID0ge307XHJcbiAgICBlbHNlIGlmICh0eXBlID09PSAnYXJyYXknKSByZXN1bHQgPSBbXTtcclxuICAgIGVsc2UgcmV0dXJuIG9iamVjdDtcclxuICAgIGZvciAobGV0IGtleSBpbiBvYmplY3QpIHtcclxuICAgICAgICByZXN1bHRba2V5XSA9IGNsb25lKG9iamVjdFtrZXldKTsgLy/pgJLlvZLosIPnlKhcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmuIXnqbrlhYPntKBcclxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IFxyXG4gKi9cclxuZnVuY3Rpb24gY2xlYW5FbGVtZW50KGVsZW1lbnQpIHtcclxuICAgIGxldCBsYXN0Q2hpbGQ7XHJcbiAgICB3aGlsZSAoKGxhc3RDaGlsZCA9IGVsZW1lbnQubGFzdENoaWxkKSAhPSBudWxsKSBlbGVtZW50LnJlbW92ZUNoaWxkKGxhc3RDaGlsZCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDojrflj5blsY/luZXnmoTorr7lpIflg4/ntKDmr5RcclxuICogQHBhcmFtIHtib29sZWFufSBzaG93V2FybiAtIOaYvuekuuitpuWRilxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0RGV2aWNlUGl4ZWxSYXRpbyhzaG93V2FybiA9IGZhbHNlKSB7XHJcbiAgICBpZiAodHlwZW9mIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvID09PSAnbnVtYmVyJykgcmV0dXJuIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xyXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuc2NyZWVuLmRldmljZVhEUEkgPT09ICdudW1iZXInICYmIHR5cGVvZiB3aW5kb3cuc2NyZWVuLmxvZ2ljYWxYRFBJID09PSAnbnVtYmVyJykgcmV0dXJuIHNjcmVlbi5kZXZpY2VYRFBJIC8gc2NyZWVuLmxvZ2ljYWxYRFBJO1xyXG4gICAgLy/kuI3mlK/mjIEgZGV2aWNlUGl4ZWxSYXRpbyDnmoTorablkYpcclxuICAgIGlmKHNob3dXYXJuKSBjb25zb2xlLndhcm4oUmVzb3VyY2VzLkRFVklDRVBJWEVMUkFUSU9fTk9UX1NVUFBPUlRfV0FSTik7XHJcbiAgICByZXR1cm4gMTtcclxufVxyXG5cclxuLyoqXHJcbiAqIOW4ruWKqeWvueixoVxyXG4gKiBAbmFtZXNwYWNlXHJcbiAqL1xyXG5jb25zdCBIZWxwZXIgPSB7XHJcbiAgICBzZXRWYWx1ZTogc2V0VmFsdWUsXHJcbiAgICBzZXRWYWx1ZXM6IHNldFZhbHVlcyxcclxuICAgIGNoZWNrVHlwZTogY2hlY2tUeXBlLFxyXG4gICAgY2hlY2tUeXBlczogY2hlY2tUeXBlcyxcclxuICAgIGlzRW1wdHk6IGlzRW1wdHksXHJcbiAgICBfdHlwZW9mOiBfdHlwZW9mLFxyXG4gICAgY2xvbmU6IGNsb25lLFxyXG4gICAgY2xlYW5FbGVtZW50OiBjbGVhbkVsZW1lbnQsXHJcbiAgICBnZXREZXZpY2VQaXhlbFJhdGlvOiBnZXREZXZpY2VQaXhlbFJhdGlvXHJcbn1cclxuXHJcbmV4cG9ydCB7IEhlbHBlciB9Il0sImZpbGUiOiJsaWIvaGVscGVyLmpzIn0=
