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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9yZXNvdXJjZXMuanMiXSwibmFtZXMiOlsiZmlsbERhdGEiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJwYXJhbSIsInN0ciIsImtleSIsInJlcGxhY2UiLCJSZWdFeHAiLCJpIiwiUmVzb3VyY2VzIiwiU3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7OztBQUVBOzs7O0FBSUEsU0FBU0EsUUFBVCxHQUFvQjtBQUNoQixNQUFJQyxTQUFTLENBQUNDLE1BQVYsS0FBcUIsQ0FBekIsRUFBNEIsT0FBTyxJQUFQO0FBQzVCLE1BQUlDLEtBQUssR0FBR0YsU0FBUyxDQUFDLENBQUQsQ0FBckI7QUFBQSxNQUEwQkcsR0FBRyxHQUFHLElBQWhDOztBQUNBLE1BQUksUUFBUUQsS0FBUixNQUFtQixRQUF2QixFQUFpQztBQUM3QixTQUFLLElBQUlFLEdBQVQsSUFBZ0JGLEtBQWhCO0FBQ0lDLE1BQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUFDRSxPQUFKLENBQVksSUFBSUMsTUFBSixDQUFXLFFBQVFGLEdBQVIsR0FBYyxLQUF6QixFQUFnQyxHQUFoQyxDQUFaLEVBQWtERixLQUFLLENBQUNFLEdBQUQsQ0FBdkQsQ0FBTjtBQURKOztBQUVBLFdBQU9ELEdBQVA7QUFDSCxHQUpELE1BSU87QUFDSCxTQUFLLElBQUlJLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdQLFNBQVMsQ0FBQ0MsTUFBOUIsRUFBc0NNLENBQUMsRUFBdkM7QUFDSUosTUFBQUEsR0FBRyxHQUFHQSxHQUFHLENBQUNFLE9BQUosQ0FBWSxJQUFJQyxNQUFKLENBQVcsUUFBUUMsQ0FBUixHQUFZLEtBQXZCLEVBQThCLEdBQTlCLENBQVosRUFBZ0RQLFNBQVMsQ0FBQ08sQ0FBRCxDQUF6RCxDQUFOO0FBREo7O0FBRUEsV0FBT0osR0FBUDtBQUNIO0FBQ0o7O0FBRUQsS0FBSyxJQUFJQyxHQUFULElBQWdCSSxTQUFoQixFQUEyQjtBQUN2QixNQUFJLE9BQU9BLFNBQVMsQ0FBQ0osR0FBRCxDQUFoQixLQUEwQixRQUE5QixFQUF3QztBQUNwQ0ksSUFBQUEsU0FBUyxDQUFDSixHQUFELENBQVQsR0FBaUIsSUFBSUssTUFBSixDQUFXRCxTQUFTLENBQUNKLEdBQUQsQ0FBcEIsQ0FBakI7QUFDQUksSUFBQUEsU0FBUyxDQUFDSixHQUFELENBQVQsQ0FBZUwsUUFBZixHQUEwQkEsUUFBMUI7QUFDSDtBQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVzb3VyY2VzIGZyb20gJy4vcmVzb3VyY2VzLmpzb24nXG5cbi8qKlxuICog5pWw5o2u5aGr5YWF77yI5Y2g5L2N56ym5ou85o6l77yJXG4gKiBAcGFyYW0ge29iamVjdHwuLi5zdHJpbmd9IHNpZ24gLSDkuIDnu4TlrZfnrKbkuLLmiJbkuIDkuKrlr7nosaFcbiAqL1xuZnVuY3Rpb24gZmlsbERhdGEoKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiB0aGlzO1xuICAgIHZhciBwYXJhbSA9IGFyZ3VtZW50c1swXSwgc3RyID0gdGhpcztcbiAgICBpZiAodHlwZW9mIChwYXJhbSkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwYXJhbSlcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKG5ldyBSZWdFeHAoXCJcXFxce1wiICsga2V5ICsgXCJcXFxcfVwiLCBcImdcIiksIHBhcmFtW2tleV0pO1xuICAgICAgICByZXR1cm4gc3RyO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UobmV3IFJlZ0V4cChcIlxcXFx7XCIgKyBpICsgXCJcXFxcfVwiLCBcImdcIiksIGFyZ3VtZW50c1tpXSk7XG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgfVxufVxuXG5mb3IgKGxldCBrZXkgaW4gUmVzb3VyY2VzKSB7XG4gICAgaWYgKHR5cGVvZiBSZXNvdXJjZXNba2V5XSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgUmVzb3VyY2VzW2tleV0gPSBuZXcgU3RyaW5nKFJlc291cmNlc1trZXldKTtcbiAgICAgICAgUmVzb3VyY2VzW2tleV0uZmlsbERhdGEgPSBmaWxsRGF0YTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IFJlc291cmNlcyB9Il0sImZpbGUiOiJsaWIvcmVzb3VyY2VzLmpzIn0=
