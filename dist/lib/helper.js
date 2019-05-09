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
var _default = Helper;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9oZWxwZXIuanMiXSwibmFtZXMiOlsic2V0VmFsdWUiLCJ2YWx1ZSIsImRlZmF1bHRWYWx1ZSIsInR5cGUiLCJyZXR1cm5WYWx1ZSIsImlzRW1wdHkiLCJjbG9uZSIsImNoZWNrVHlwZSIsIl90eXBlb2YiLCJzZXRWYWx1ZXMiLCJ2YWx1ZXMiLCJkZWZhdWx0VmFsdWVzIiwidHlwZXMiLCJyZXR1cm5WYWx1ZXMiLCJfdmFsdWVzIiwia2V5IiwiY2FuQmVOdWxsIiwiVHlwZUVycm9yIiwiUmVzb3VyY2VzIiwiUEFSQU1FVEVSU19UWVBFX0VSUk9SIiwiZmxhdCIsIml0ZW0iLCJjaGVja1R5cGVzIiwiaXNOYU4iLCJvYmplY3QiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJzbGljZSIsInRvTG93ZXJDYXNlIiwicmVzdWx0IiwiY2xlYW5FbGVtZW50IiwiZWxlbWVudCIsImxhc3RDaGlsZCIsInJlbW92ZUNoaWxkIiwiZ2V0RGV2aWNlUGl4ZWxSYXRpbyIsInNob3dXYXJuIiwid2luZG93IiwiZGV2aWNlUGl4ZWxSYXRpbyIsInNjcmVlbiIsImRldmljZVhEUEkiLCJsb2dpY2FsWERQSSIsImNvbnNvbGUiLCJ3YXJuIiwiREVWSUNFUElYRUxSQVRJT19OT1RfU1VQUE9SVF9XQVJOIiwiSGVscGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBRUE7Ozs7Ozs7O0FBUUEsU0FBU0EsUUFBVCxDQUFrQkMsS0FBbEIsRUFBeUJDLFlBQXpCLEVBQXVDQyxJQUF2QyxFQUE2QztBQUN6QyxNQUFJQyxXQUFKO0FBQ0EsTUFBSUMsT0FBTyxDQUFDSixLQUFELENBQVgsRUFBb0JHLFdBQVcsR0FBR0UsS0FBSyxDQUFDSixZQUFELENBQW5CLENBQXBCLEtBQ0tFLFdBQVcsR0FBR0UsS0FBSyxDQUFDTCxLQUFELENBQW5CO0FBQ0wsTUFBSSxDQUFDSSxPQUFPLENBQUNGLElBQUQsQ0FBWixF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RUFBQUEsbUJBQW1CLEVBQUVBO0FBVFYsQ0FBZjtlQVdlVSxNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlc291cmNlcyBmcm9tICcuL3Jlc291cmNlcydcblxuLyoqXG4gKiDorr7nva7lgLxcbiAqIEBhbGlhcyBIZWxwZXIuc2V0VmFsdWVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgLSDlgLxcbiAqIEBwYXJhbSB7Kn0gZGVmYXVsdFZhbHVlIC0g6buY6K6k5YC8XG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZSAtIOexu+Wei1xuICogQHJldHVybnMgeyp9IC0g5YC8XG4gKi9cbmZ1bmN0aW9uIHNldFZhbHVlKHZhbHVlLCBkZWZhdWx0VmFsdWUsIHR5cGUpIHtcbiAgICBsZXQgcmV0dXJuVmFsdWU7XG4gICAgaWYgKGlzRW1wdHkodmFsdWUpKSByZXR1cm5WYWx1ZSA9IGNsb25lKGRlZmF1bHRWYWx1ZSk7XG4gICAgZWxzZSByZXR1cm5WYWx1ZSA9IGNsb25lKHZhbHVlKTtcbiAgICBpZiAoIWlzRW1wdHkodHlwZSkpIGNoZWNrVHlwZShyZXR1cm5WYWx1ZSwgdHlwZSk7XG4gICAgZWxzZSBpZiAoIWlzRW1wdHkoZGVmYXVsdFZhbHVlKSkgY2hlY2tUeXBlKHJldHVyblZhbHVlLCBfdHlwZW9mKGRlZmF1bHRWYWx1ZSkpO1xuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbn1cblxuLyoqXG4gKiDorr7nva7lpJrkuKrlgLxcbiAqIEBhbGlhcyBIZWxwZXIuc2V0VmFsdWVzXG4gKiBAcGFyYW0ge29iamVjdH0gdmFsdWVzIC0g5YC8XG4gKiBAcGFyYW0ge29iamVjdH0gZGVmYXVsdFZhbHVlcyAtIOm7mOiupOWAvFxuICogQHBhcmFtIHtvYmplY3R9IHR5cGVzIC0g57G75Z6LXG4gKiBAcmV0dXJucyB7b2JqZWN0fSAtIOWAvFxuICovXG5mdW5jdGlvbiBzZXRWYWx1ZXModmFsdWVzLCBkZWZhdWx0VmFsdWVzLCB0eXBlcywgY2xvbmUgPSB0cnVlKSB7XG4gICAgbGV0IHJldHVyblZhbHVlcyA9IGNsb25lID8gc2V0VmFsdWUodmFsdWVzLCB7fSkgOiBkZWZhdWx0VmFsdWVzO1xuICAgIGxldCBfdmFsdWVzID0gY2xvbmUgPyByZXR1cm5WYWx1ZXMgOiBzZXRWYWx1ZSh2YWx1ZXMsIHt9KTtcbiAgICBmb3IgKGxldCBrZXkgaW4gZGVmYXVsdFZhbHVlcykge1xuICAgICAgICBpZiAoX3R5cGVvZihkZWZhdWx0VmFsdWVzW2tleV0pID09PSAnb2JqZWN0JylcbiAgICAgICAgICAgIHJldHVyblZhbHVlc1trZXldID0gc2V0VmFsdWVzKF92YWx1ZXNba2V5XSwgZGVmYXVsdFZhbHVlc1trZXldLCB0eXBlc1trZXldKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuVmFsdWVzW2tleV0gPSBzZXRWYWx1ZShfdmFsdWVzW2tleV0sIGRlZmF1bHRWYWx1ZXNba2V5XSwgdHlwZXNba2V5XSk7XG4gICAgfVxuICAgIHJldHVybiByZXR1cm5WYWx1ZXM7XG59XG5cbi8qKlxuICog5qOA5p+l57G75Z6LXG4gKiBAYWxpYXMgSGVscGVyLmNoZWNrVHlwZVxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0g5YC8XG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZSAtIOexu+Wei1xuICogQHBhcmFtIHtib29sZWFufSBjYW5CZU51bGwgLSDlj6/ku6XkuLrnqbpcbiAqL1xuZnVuY3Rpb24gY2hlY2tUeXBlKHZhbHVlLCB0eXBlLCBjYW5CZU51bGwgPSB0cnVlKSB7XG4gICAgaWYgKHR5cGVvZiB0eXBlICE9ICdzdHJpbmcnICYmIF90eXBlb2YodHlwZSkgIT0gJ2FycmF5JykgdGhyb3cgbmV3IFR5cGVFcnJvcihSZXNvdXJjZXMuUEFSQU1FVEVSU19UWVBFX0VSUk9SKTtcbiAgICBpZiAoY2FuQmVOdWxsICYmIGlzRW1wdHkodmFsdWUpKSByZXR1cm47XG4gICAgaWYgKF90eXBlb2YodHlwZSkgPT09ICdhcnJheScpIHtcbiAgICAgICAgbGV0IGZsYXQgPSBmYWxzZTtcbiAgICAgICAgZm9yIChsZXQgaXRlbSBvZiB0eXBlKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGl0ZW0gIT0gJ3N0cmluZycpIHRocm93IG5ldyBUeXBlRXJyb3IoUmVzb3VyY2VzLlBBUkFNRVRFUlNfVFlQRV9FUlJPUik7XG4gICAgICAgICAgICBpZiAoX3R5cGVvZih2YWx1ZSkgPT09IGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBmbGF0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIWZsYXQpIHRocm93IG5ldyBUeXBlRXJyb3IoUmVzb3VyY2VzLlBBUkFNRVRFUlNfVFlQRV9FUlJPUik7XG4gICAgfSBlbHNlIGlmIChfdHlwZW9mKHZhbHVlKSAhPSB0eXBlKSB0aHJvdyBuZXcgVHlwZUVycm9yKFJlc291cmNlcy5QQVJBTUVURVJTX1RZUEVfRVJST1IpO1xufVxuXG4vKipcbiAqIOajgOafpeWkmuS4quWAvFxuICogQGFsaWFzIEhlbHBlci5jaGVja1R5cGVzXG4gKiBAcGFyYW0ge29iamVjdH0gdmFsdWVzIC0g5YC8XG4gKiBAcGFyYW0ge29iamVjdH0gdHlwZXMgLSDnsbvlnotcbiAqIEByZXR1cm5zIHtvYmplY3R9IC0g5YC8XG4gKi9cbmZ1bmN0aW9uIGNoZWNrVHlwZXModmFsdWVzLCB0eXBlcywgY2FuQmVOdWxsID0gdHJ1ZSkge1xuICAgIGlmIChjYW5CZU51bGwgJiYgaXNFbXB0eSh2YWx1ZXMpKSByZXR1cm47XG4gICAgZm9yIChsZXQga2V5IGluIHR5cGVzKSB7XG4gICAgICAgIGlmIChfdHlwZW9mKHR5cGVzW2tleV0pID09PSAnb2JqZWN0JylcbiAgICAgICAgICAgIGNoZWNrVHlwZXModmFsdWVzW2tleV0sIHR5cGVzW2tleV0pO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBjaGVja1R5cGUodmFsdWVzW2tleV0sIHR5cGVzW2tleV0sIGNhbkJlTnVsbCk7XG4gICAgfVxufVxuXG4vKipcbiAqIOajgOafpeaYr+WQpuS4uuepulxuICogQGFsaWFzIEhlbHBlci5pc0VtcHR5XG4gKiBAcGFyYW0geyp9IHZhbHVlIC0g5YC8XG4gKi9cbmZ1bmN0aW9uIGlzRW1wdHkodmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyB8fFxuICAgICAgICAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBpc05hTih2YWx1ZSkpIHx8XG4gICAgICAgIHZhbHVlID09PSBudWxsXG59XG5cbi8qKlxuICog6I635Y+W5a+56LGh55qE57G75Z6L77yI5Y+v5Yy65YiG5pWw57uE562J77yJXG4gKiBAYWxpYXMgSGVscGVyLl90eXBlb2ZcbiAqIEBwYXJhbSB7Kn0gb2JqZWN0IC0g5a+56LGhXG4gKi9cbmZ1bmN0aW9uIF90eXBlb2Yob2JqZWN0KSB7XG4gICAgLy9lZzogW09iamVjdCBGdW5jdGlvbl0gLT4gRnVuY3Rpb24gLT4gZnVuY3Rpb25cbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkuc2xpY2UoOCwgLTEpLnRvTG93ZXJDYXNlKCk7XG59XG5cbi8qKlxuICog5YWL6ZqG5a+56LGhXG4gKiBAcGFyYW0geyp9IG9iamVjdCBcbiAqL1xuZnVuY3Rpb24gY2xvbmUob2JqZWN0KSB7XG4gICAgbGV0IHJlc3VsdCwgdHlwZSA9IF90eXBlb2Yob2JqZWN0KTtcbiAgICAvL+ehruWumnJlc3VsdOeahOexu+Wei1xuICAgIGlmICh0eXBlID09PSAnb2JqZWN0JykgcmVzdWx0ID0ge307XG4gICAgZWxzZSBpZiAodHlwZSA9PT0gJ2FycmF5JykgcmVzdWx0ID0gW107XG4gICAgZWxzZSByZXR1cm4gb2JqZWN0O1xuICAgIGZvciAobGV0IGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSBjbG9uZShvYmplY3Rba2V5XSk7IC8v6YCS5b2S6LCD55SoXG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICog5riF56m65YWD57SgXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgXG4gKi9cbmZ1bmN0aW9uIGNsZWFuRWxlbWVudChlbGVtZW50KSB7XG4gICAgbGV0IGxhc3RDaGlsZDtcbiAgICB3aGlsZSAoKGxhc3RDaGlsZCA9IGVsZW1lbnQubGFzdENoaWxkKSAhPSBudWxsKSBlbGVtZW50LnJlbW92ZUNoaWxkKGxhc3RDaGlsZCk7XG59XG5cbi8qKlxuICog6I635Y+W5bGP5bmV55qE6K6+5aSH5YOP57Sg5q+UXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHNob3dXYXJuIC0g5pi+56S66K2m5ZGKXG4gKi9cbmZ1bmN0aW9uIGdldERldmljZVBpeGVsUmF0aW8oc2hvd1dhcm4gPSBmYWxzZSkge1xuICAgIGlmICh0eXBlb2Ygd2luZG93LmRldmljZVBpeGVsUmF0aW8gPT09ICdudW1iZXInKSByZXR1cm4gd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuc2NyZWVuLmRldmljZVhEUEkgPT09ICdudW1iZXInICYmIHR5cGVvZiB3aW5kb3cuc2NyZWVuLmxvZ2ljYWxYRFBJID09PSAnbnVtYmVyJykgcmV0dXJuIHNjcmVlbi5kZXZpY2VYRFBJIC8gc2NyZWVuLmxvZ2ljYWxYRFBJO1xuICAgIC8v5LiN5pSv5oyBIGRldmljZVBpeGVsUmF0aW8g55qE6K2m5ZGKXG4gICAgaWYoc2hvd1dhcm4pIGNvbnNvbGUud2FybihSZXNvdXJjZXMuREVWSUNFUElYRUxSQVRJT19OT1RfU1VQUE9SVF9XQVJOKTtcbiAgICByZXR1cm4gMTtcbn1cblxuLyoqXG4gKiDluK7liqnlr7nosaFcbiAqIEBuYW1lc3BhY2VcbiAqL1xuY29uc3QgSGVscGVyID0ge1xuICAgIHNldFZhbHVlOiBzZXRWYWx1ZSxcbiAgICBzZXRWYWx1ZXM6IHNldFZhbHVlcyxcbiAgICBjaGVja1R5cGU6IGNoZWNrVHlwZSxcbiAgICBjaGVja1R5cGVzOiBjaGVja1R5cGVzLFxuICAgIGlzRW1wdHk6IGlzRW1wdHksXG4gICAgX3R5cGVvZjogX3R5cGVvZixcbiAgICBjbG9uZTogY2xvbmUsXG4gICAgY2xlYW5FbGVtZW50OiBjbGVhbkVsZW1lbnQsXG4gICAgZ2V0RGV2aWNlUGl4ZWxSYXRpbzogZ2V0RGV2aWNlUGl4ZWxSYXRpb1xufVxuZXhwb3J0IGRlZmF1bHQgSGVscGVyXG5cbiJdLCJmaWxlIjoibGliL2hlbHBlci5qcyJ9
