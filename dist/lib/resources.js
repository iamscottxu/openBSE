"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Resources = void 0;

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.regexp.constructor");

require("core-js/modules/es6.regexp.replace");

var Resources = _interopRequireWildcard(require("./resources.json"));

exports.Resources = Resources;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * 数据填充（占位符拼接）
 * @param {object|...string} sign - 一组字符串或一个对象
 */
function fillData() {
  if (arguments.length === 0) return this;
  var param = arguments[0],
      str = this;

  if (_typeof(param) === 'object') {
    for (var key in param) {
      str = str.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
    }

    return str;
  } else {
    for (var i = 0; i < arguments.length; i++) {
      str = str.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
    }

    return str;
  }
}

for (var key in Resources) {
  if (typeof Resources[key] === 'string') {
    Resources[key] = new String(Resources[key]);
    Resources[key].fillData = fillData;
  }
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9yZXNvdXJjZXMuanMiXSwibmFtZXMiOlsiZmlsbERhdGEiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJwYXJhbSIsInN0ciIsImtleSIsInJlcGxhY2UiLCJSZWdFeHAiLCJpIiwiUmVzb3VyY2VzIiwiU3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7OztBQUVBOzs7O0FBSUEsU0FBU0EsUUFBVCxHQUFvQjtBQUNoQixNQUFJQyxTQUFTLENBQUNDLE1BQVYsS0FBcUIsQ0FBekIsRUFBNEIsT0FBTyxJQUFQO0FBQzVCLE1BQUlDLEtBQUssR0FBR0YsU0FBUyxDQUFDLENBQUQsQ0FBckI7QUFBQSxNQUEwQkcsR0FBRyxHQUFHLElBQWhDOztBQUNBLE1BQUksUUFBUUQsS0FBUixNQUFtQixRQUF2QixFQUFpQztBQUM3QixTQUFLLElBQUlFLEdBQVQsSUFBZ0JGLEtBQWhCO0FBQ0lDLE1BQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUFDRSxPQUFKLENBQVksSUFBSUMsTUFBSixDQUFXLFFBQVFGLEdBQVIsR0FBYyxLQUF6QixFQUFnQyxHQUFoQyxDQUFaLEVBQWtERixLQUFLLENBQUNFLEdBQUQsQ0FBdkQsQ0FBTjtBQURKOztBQUVBLFdBQU9ELEdBQVA7QUFDSCxHQUpELE1BSU87QUFDSCxTQUFLLElBQUlJLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdQLFNBQVMsQ0FBQ0MsTUFBOUIsRUFBc0NNLENBQUMsRUFBdkM7QUFDSUosTUFBQUEsR0FBRyxHQUFHQSxHQUFHLENBQUNFLE9BQUosQ0FBWSxJQUFJQyxNQUFKLENBQVcsUUFBUUMsQ0FBUixHQUFZLEtBQXZCLEVBQThCLEdBQTlCLENBQVosRUFBZ0RQLFNBQVMsQ0FBQ08sQ0FBRCxDQUF6RCxDQUFOO0FBREo7O0FBRUEsV0FBT0osR0FBUDtBQUNIO0FBQ0o7O0FBRUQsS0FBSyxJQUFJQyxHQUFULElBQWdCSSxTQUFoQixFQUEyQjtBQUN2QixNQUFJLE9BQU9BLFNBQVMsQ0FBQ0osR0FBRCxDQUFoQixLQUEwQixRQUE5QixFQUF3QztBQUNwQ0ksSUFBQUEsU0FBUyxDQUFDSixHQUFELENBQVQsR0FBaUIsSUFBSUssTUFBSixDQUFXRCxTQUFTLENBQUNKLEdBQUQsQ0FBcEIsQ0FBakI7QUFDQUksSUFBQUEsU0FBUyxDQUFDSixHQUFELENBQVQsQ0FBZUwsUUFBZixHQUEwQkEsUUFBMUI7QUFDSDtBQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVzb3VyY2VzIGZyb20gJy4vcmVzb3VyY2VzLmpzb24nXHJcblxyXG4vKipcclxuICog5pWw5o2u5aGr5YWF77yI5Y2g5L2N56ym5ou85o6l77yJXHJcbiAqIEBwYXJhbSB7b2JqZWN0fC4uLnN0cmluZ30gc2lnbiAtIOS4gOe7hOWtl+espuS4suaIluS4gOS4quWvueixoVxyXG4gKi9cclxuZnVuY3Rpb24gZmlsbERhdGEoKSB7XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHRoaXM7XHJcbiAgICB2YXIgcGFyYW0gPSBhcmd1bWVudHNbMF0sIHN0ciA9IHRoaXM7XHJcbiAgICBpZiAodHlwZW9mIChwYXJhbSkgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHBhcmFtKVxyXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShuZXcgUmVnRXhwKFwiXFxcXHtcIiArIGtleSArIFwiXFxcXH1cIiwgXCJnXCIpLCBwYXJhbVtrZXldKTtcclxuICAgICAgICByZXR1cm4gc3RyO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UobmV3IFJlZ0V4cChcIlxcXFx7XCIgKyBpICsgXCJcXFxcfVwiLCBcImdcIiksIGFyZ3VtZW50c1tpXSk7XHJcbiAgICAgICAgcmV0dXJuIHN0cjtcclxuICAgIH1cclxufVxyXG5cclxuZm9yIChsZXQga2V5IGluIFJlc291cmNlcykge1xyXG4gICAgaWYgKHR5cGVvZiBSZXNvdXJjZXNba2V5XSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICBSZXNvdXJjZXNba2V5XSA9IG5ldyBTdHJpbmcoUmVzb3VyY2VzW2tleV0pO1xyXG4gICAgICAgIFJlc291cmNlc1trZXldLmZpbGxEYXRhID0gZmlsbERhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7IFJlc291cmNlcyB9Il0sImZpbGUiOiJsaWIvcmVzb3VyY2VzLmpzIn0=
