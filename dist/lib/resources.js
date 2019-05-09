"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.constructor");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.string.replace");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Resources = _interopRequireWildcard(require("./resources.json"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

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

var _default = Resources;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9yZXNvdXJjZXMuanMiXSwibmFtZXMiOlsiZmlsbERhdGEiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJwYXJhbSIsInN0ciIsImtleSIsInJlcGxhY2UiLCJSZWdFeHAiLCJpIiwiUmVzb3VyY2VzIiwiU3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUE7Ozs7QUFJQSxTQUFTQSxRQUFULEdBQW9CO0FBQ2hCLE1BQUlDLFNBQVMsQ0FBQ0MsTUFBVixLQUFxQixDQUF6QixFQUE0QixPQUFPLElBQVA7QUFDNUIsTUFBSUMsS0FBSyxHQUFHRixTQUFTLENBQUMsQ0FBRCxDQUFyQjtBQUFBLE1BQTBCRyxHQUFHLEdBQUcsSUFBaEM7O0FBQ0EsTUFBSSxRQUFRRCxLQUFSLE1BQW1CLFFBQXZCLEVBQWlDO0FBQzdCLFNBQUssSUFBSUUsR0FBVCxJQUFnQkYsS0FBaEI7QUFDSUMsTUFBQUEsR0FBRyxHQUFHQSxHQUFHLENBQUNFLE9BQUosQ0FBWSxJQUFJQyxNQUFKLENBQVcsUUFBUUYsR0FBUixHQUFjLEtBQXpCLEVBQWdDLEdBQWhDLENBQVosRUFBa0RGLEtBQUssQ0FBQ0UsR0FBRCxDQUF2RCxDQUFOO0FBREo7O0FBRUEsV0FBT0QsR0FBUDtBQUNILEdBSkQsTUFJTztBQUNILFNBQUssSUFBSUksQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR1AsU0FBUyxDQUFDQyxNQUE5QixFQUFzQ00sQ0FBQyxFQUF2QztBQUNJSixNQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQ0UsT0FBSixDQUFZLElBQUlDLE1BQUosQ0FBVyxRQUFRQyxDQUFSLEdBQVksS0FBdkIsRUFBOEIsR0FBOUIsQ0FBWixFQUFnRFAsU0FBUyxDQUFDTyxDQUFELENBQXpELENBQU47QUFESjs7QUFFQSxXQUFPSixHQUFQO0FBQ0g7QUFDSjs7QUFFRCxLQUFLLElBQUlDLEdBQVQsSUFBZ0JJLFNBQWhCLEVBQTJCO0FBQ3ZCLE1BQUksT0FBT0EsU0FBUyxDQUFDSixHQUFELENBQWhCLEtBQTBCLFFBQTlCLEVBQXdDO0FBQ3BDSSxJQUFBQSxTQUFTLENBQUNKLEdBQUQsQ0FBVCxHQUFpQixJQUFJSyxNQUFKLENBQVdELFNBQVMsQ0FBQ0osR0FBRCxDQUFwQixDQUFqQjtBQUNBSSxJQUFBQSxTQUFTLENBQUNKLEdBQUQsQ0FBVCxDQUFlTCxRQUFmLEdBQTBCQSxRQUExQjtBQUNIO0FBQ0o7O2VBRWNTLFMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZXNvdXJjZXMgZnJvbSAnLi9yZXNvdXJjZXMuanNvbidcblxuLyoqXG4gKiDmlbDmja7loavlhYXvvIjljaDkvY3nrKbmi7zmjqXvvIlcbiAqIEBwYXJhbSB7b2JqZWN0fC4uLnN0cmluZ30gc2lnbiAtIOS4gOe7hOWtl+espuS4suaIluS4gOS4quWvueixoVxuICovXG5mdW5jdGlvbiBmaWxsRGF0YSgpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHRoaXM7XG4gICAgdmFyIHBhcmFtID0gYXJndW1lbnRzWzBdLCBzdHIgPSB0aGlzO1xuICAgIGlmICh0eXBlb2YgKHBhcmFtKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHBhcmFtKVxuICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UobmV3IFJlZ0V4cChcIlxcXFx7XCIgKyBrZXkgKyBcIlxcXFx9XCIsIFwiZ1wiKSwgcGFyYW1ba2V5XSk7XG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShuZXcgUmVnRXhwKFwiXFxcXHtcIiArIGkgKyBcIlxcXFx9XCIsIFwiZ1wiKSwgYXJndW1lbnRzW2ldKTtcbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG59XG5cbmZvciAobGV0IGtleSBpbiBSZXNvdXJjZXMpIHtcbiAgICBpZiAodHlwZW9mIFJlc291cmNlc1trZXldID09PSAnc3RyaW5nJykge1xuICAgICAgICBSZXNvdXJjZXNba2V5XSA9IG5ldyBTdHJpbmcoUmVzb3VyY2VzW2tleV0pO1xuICAgICAgICBSZXNvdXJjZXNba2V5XS5maWxsRGF0YSA9IGZpbGxEYXRhO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVzb3VyY2VzIl0sImZpbGUiOiJsaWIvcmVzb3VyY2VzLmpzIn0=
