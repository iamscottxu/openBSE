/**
 * @license
 * JavaScript Interpreter
 *
 * Copyright 2013 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Interpreting JavaScript in JavaScript.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';
/**
 * Create a new interpreter.
 * @param {string|!Object} code Raw JavaScript text or AST.
 * @param {Function=} opt_initFunc Optional initialization function.  Used to
 *     define APIs.  When called it is passed the interpreter object and the
 *     global scope object.
 * @constructor
 */

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.is-array");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.join");

require("core-js/modules/es.array.last-index-of");

require("core-js/modules/es.array.map");

require("core-js/modules/es.array.slice");

require("core-js/modules/es.array.sort");

require("core-js/modules/es.array.splice");

require("core-js/modules/es.date.now");

require("core-js/modules/es.date.to-string");

require("core-js/modules/es.function.bind");

require("core-js/modules/es.function.name");

require("core-js/modules/es.number.constructor");

require("core-js/modules/es.number.to-fixed");

require("core-js/modules/es.number.to-precision");

require("core-js/modules/es.object.create");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.get-own-property-names");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.parse-float");

require("core-js/modules/es.parse-int");

require("core-js/modules/es.regexp.constructor");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.string.match");

require("core-js/modules/es.string.replace");

require("core-js/modules/es.string.search");

require("core-js/modules/es.string.split");

require("core-js/modules/es.string.trim");

require("core-js/modules/web.dom-collections.iterator");

require("core-js/modules/web.timers");

require("core-js/modules/web.url");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _acorn = _interopRequireDefault(require("./acorn"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var Interpreter = function Interpreter(code, opt_initFunc) {
  if (typeof code === 'string') {
    code = _acorn["default"].parse(code, Interpreter.PARSE_OPTIONS);
  }

  this.ast = code;
  this.initFunc_ = opt_initFunc;
  this.paused_ = false;
  this.polyfills_ = [];
  this.functionCounter_ = 0;
  this.stepFunctions_ = Object.create(null);
  var stepMatch = /^step([A-Z]\w*)$/;
  var m;

  for (var methodName in this) {
    if (typeof this[methodName] === 'function' && (m = methodName.match(stepMatch))) {
      this.stepFunctions_[m[1]] = this[methodName].bind(this);
    }
  }

  this.global = this.createScope(this.ast, null);
  this.ast = _acorn["default"].parse(this.polyfills_.join('\n'), Interpreter.PARSE_OPTIONS);
  this.polyfills_ = undefined;
  this.stripLocations_(this.ast, undefined, undefined);
  var state = new Interpreter.State(this.ast, this.global);
  state.done = false;
  this.stateStack = [state];
  this.run();
  this.value = undefined;
  this.ast = code;
  var state = new Interpreter.State(this.ast, this.global);
  state.done = false;
  this.stateStack.length = 0;
  this.stateStack[0] = state;
  this.nodeConstructor = state.node.constructor;
  this['stateStack'] = this.stateStack;
};
/**
 * @const {!Object} Configuration used for all Acorn parsing.
 */


Interpreter.PARSE_OPTIONS = {
  ecmaVersion: 5
};
/**
 * Property descriptor of readonly properties.
 */

Interpreter.READONLY_DESCRIPTOR = {
  configurable: true,
  enumerable: true,
  writable: false
};
/**
 * Property descriptor of non-enumerable properties.
 */

Interpreter.NONENUMERABLE_DESCRIPTOR = {
  configurable: true,
  enumerable: false,
  writable: true
};
/**
 * Property descriptor of readonly, non-enumerable properties.
 */

Interpreter.READONLY_NONENUMERABLE_DESCRIPTOR = {
  configurable: true,
  enumerable: false,
  writable: false
};
/**
 * Property descriptor of variables.
 */

Interpreter.VARIABLE_DESCRIPTOR = {
  configurable: false,
  enumerable: true,
  writable: true
};
/**
 * Unique symbol for indicating that a step has encountered an error, has
 * added it to the stack, and will be thrown within the user's program.
 * When STEP_ERROR is thrown in the JS-Interpreter, the error can be ignored.
 */

Interpreter.STEP_ERROR = {
  'STEP_ERROR': true
};
/**
 * Unique symbol for indicating that a reference is a variable on the scope,
 * not an object property.
 */

Interpreter.SCOPE_REFERENCE = {
  'SCOPE_REFERENCE': true
};
/**
 * Unique symbol for indicating, when used as the value of the value
 * parameter in calls to setProperty and friends, that the value
 * should be taken from the property descriptor instead.
 */

Interpreter.VALUE_IN_DESCRIPTOR = {
  'VALUE_IN_DESCRIPTOR': true
};
/**
 * Unique symbol for indicating that a RegExp timeout has occurred in a VM.
 */

Interpreter.REGEXP_TIMEOUT = {
  'REGEXP_TIMEOUT': true
};
/**
 * For cycle detection in array to string and error conversion;
 * see spec bug github.com/tc39/ecma262/issues/289
 * Since this is for atomic actions only, it can be a class property.
 */

Interpreter.toStringCycles_ = [];
/**
 * Node's vm module, if loaded and required.
 * @type {Object}
 */

Interpreter.vm = null;
/**
 * Code for executing regular expressions in a thread.
 */

Interpreter.WORKER_CODE = ["onmessage = function(e) {", "var result;", "var data = e.data;", "switch (data[0]) {", "case 'split':", "result = data[1].split(data[2], data[3]);", "break;", "case 'match':", "result = data[1].match(data[2]);", "break;", "case 'search':", "result = data[1].search(data[2]);", "break;", "case 'replace':", "result = data[1].replace(data[2], data[3]);", "break;", "case 'exec':", "var regexp = data[1];", "regexp.lastIndex = data[2];", "result = [regexp.exec(data[3]), data[1].lastIndex];", "break;", "default:", "throw 'Unknown RegExp operation: ' + data[0];", "}", "postMessage(result);", "};"];
/**
 * Some pathological regular expressions can take geometric time.
 * Regular expressions are handled in one of three ways:
 * 0 - throw as invalid.
 * 1 - execute natively (risk of unresponsive program).
 * 2 - execute in separate thread (not supported by IE 9).
 */

Interpreter.prototype.REGEXP_MODE = 2;
/**
 * If REGEXP_MODE = 2, the length of time (in ms) to allow a RegExp
 * thread to execute before terminating it.
 */

Interpreter.prototype.REGEXP_THREAD_TIMEOUT = 1000;
/**
 * Add more code to the interpreter.
 * @param {string|!Object} code Raw JavaScript text or AST.
 */

Interpreter.prototype.appendCode = function (code) {
  var state = this.stateStack[0];

  if (!state || state.node['type'] !== 'Program') {
    throw Error('Expecting original AST to start with a Program node.');
  }

  if (typeof code === 'string') {
    code = _acorn["default"].parse(code, Interpreter.PARSE_OPTIONS);
  }

  if (!code || code['type'] !== 'Program') {
    throw Error('Expecting new AST to start with a Program node.');
  }

  this.populateScope_(code, state.scope);

  for (var i = 0, node; node = code['body'][i]; i++) {
    state.node['body'].push(node);
  }

  state.done = false;
};
/**
 * Execute one step of the interpreter.
 * @return {boolean} True if a step was executed, false if no more instructions.
 */


Interpreter.prototype.step = function () {
  var stack = this.stateStack;
  var state = stack[stack.length - 1];

  if (!state) {
    return false;
  }

  var node = state.node,
      type = node['type'];

  if (type === 'Program' && state.done) {
    return false;
  } else if (this.paused_) {
    return true;
  }

  try {
    var nextState = this.stepFunctions_[type](stack, state, node);
  } catch (e) {
    if (e !== Interpreter.STEP_ERROR) {
      throw e;
    }
  }

  if (nextState) {
    stack.push(nextState);
  }

  if (!node['end']) {
    return this.step();
  }

  return true;
};
/**
 * Execute the interpreter to program completion.  Vulnerable to infinite loops.
 * @return {boolean} True if a execution is asynchronously blocked,
 *     false if no more instructions.
 */


Interpreter.prototype.run = function () {
  while (!this.paused_ && this.step()) {}

  return this.paused_;
};
/**
 * Initialize the global scope with buitin properties and functions.
 * @param {!Interpreter.Object} scope Global scope.
 */


Interpreter.prototype.initGlobalScope = function (scope) {
  this.setProperty(scope, 'NaN', NaN, Interpreter.READONLY_DESCRIPTOR);
  this.setProperty(scope, 'Infinity', Infinity, Interpreter.READONLY_DESCRIPTOR);
  this.setProperty(scope, 'undefined', undefined, Interpreter.READONLY_DESCRIPTOR);
  this.setProperty(scope, 'window', scope, Interpreter.READONLY_DESCRIPTOR);
  this.setProperty(scope, 'this', scope, Interpreter.READONLY_DESCRIPTOR);
  this.setProperty(scope, 'self', scope);
  this.OBJECT_PROTO = new Interpreter.Object(null);
  this.FUNCTION_PROTO = new Interpreter.Object(this.OBJECT_PROTO);
  this.initFunction(scope);
  this.initObject(scope);
  scope.proto = this.OBJECT_PROTO;
  this.setProperty(scope, 'constructor', this.OBJECT, Interpreter.NONENUMERABLE_DESCRIPTOR);
  this.initArray(scope);
  this.initString(scope);
  this.initBoolean(scope);
  this.initNumber(scope);
  this.initDate(scope);
  this.initRegExp(scope);
  this.initError(scope);
  this.initMath(scope);
  this.initJSON(scope);
  var thisInterpreter = this;
  var func = this.createNativeFunction(function (x) {
    throw EvalError("Can't happen");
  }, false);
  func.eval = true;
  this.setProperty(scope, 'eval', func);
  this.setProperty(scope, 'parseInt', this.createNativeFunction(parseInt, false));
  this.setProperty(scope, 'parseFloat', this.createNativeFunction(parseFloat, false));
  this.setProperty(scope, 'isNaN', this.createNativeFunction(isNaN, false));
  this.setProperty(scope, 'isFinite', this.createNativeFunction(isFinite, false));
  var strFunctions = [[escape, 'escape'], [unescape, 'unescape'], [decodeURI, 'decodeURI'], [decodeURIComponent, 'decodeURIComponent'], [encodeURI, 'encodeURI'], [encodeURIComponent, 'encodeURIComponent']];

  for (var i = 0; i < strFunctions.length; i++) {
    var wrapper = function (nativeFunc) {
      return function (str) {
        try {
          return nativeFunc(str);
        } catch (e) {
          thisInterpreter.throwException(thisInterpreter.URI_ERROR, e.message);
        }
      };
    }(strFunctions[i][0]);

    this.setProperty(scope, strFunctions[i][1], this.createNativeFunction(wrapper, false), Interpreter.NONENUMERABLE_DESCRIPTOR);
  }

  this['OBJECT'] = this.OBJECT;
  this['OBJECT_PROTO'] = this.OBJECT_PROTO;
  this['FUNCTION'] = this.FUNCTION;
  this['FUNCTION_PROTO'] = this.FUNCTION_PROTO;
  this['ARRAY'] = this.ARRAY;
  this['ARRAY_PROTO'] = this.ARRAY_PROTO;
  this['REGEXP'] = this.REGEXP;
  this['REGEXP_PROTO'] = this.REGEXP_PROTO;
  this['DATE'] = this.DATE;
  this['DATE_PROTO'] = this.DATE_PROTO;
  this['UNDEFINED'] = undefined;
  this['NULL'] = null;
  this['NAN'] = NaN;
  this['TRUE'] = true;
  this['FALSE'] = false;
  this['STRING_EMPTY'] = '';
  this['NUMBER_ZERO'] = 0;
  this['NUMBER_ONE'] = 1;

  if (this.initFunc_) {
    this.initFunc_(this, scope);
  }
};
/**
 * Initialize the Function class.
 * @param {!Interpreter.Object} scope Global scope.
 */


Interpreter.prototype.initFunction = function (scope) {
  var thisInterpreter = this;
  var wrapper;
  var identifierRegexp = /^[A-Za-z_$][\w$]*$/;

  wrapper = function wrapper(var_args) {
    if (thisInterpreter.calledWithNew()) {
      var newFunc = this;
    } else {
      var newFunc = thisInterpreter.createObjectProto(thisInterpreter.FUNCTION_PROTO);
    }

    if (arguments.length) {
      var code = String(arguments[arguments.length - 1]);
    } else {
      var code = '';
    }

    var argsStr = Array.prototype.slice.call(arguments, 0, -1).join(',').trim();

    if (argsStr) {
      var args = argsStr.split(/\s*,\s*/);

      for (var i = 0; i < args.length; i++) {
        var name = args[i];

        if (!identifierRegexp.test(name)) {
          thisInterpreter.throwException(thisInterpreter.SYNTAX_ERROR, 'Invalid function argument: ' + name);
        }
      }

      argsStr = args.join(', ');
    }

    newFunc.parentScope = thisInterpreter.global;

    try {
      var ast = _acorn["default"].parse('(function(' + argsStr + ') {' + code + '})', Interpreter.PARSE_OPTIONS);
    } catch (e) {
      thisInterpreter.throwException(thisInterpreter.SYNTAX_ERROR, 'Invalid code: ' + e.message);
    }

    if (ast['body'].length !== 1) {
      thisInterpreter.throwException(thisInterpreter.SYNTAX_ERROR, 'Invalid code in function body.');
    }

    newFunc.node = ast['body'][0]['expression'];
    thisInterpreter.setProperty(newFunc, 'length', newFunc.node['length'], Interpreter.READONLY_NONENUMERABLE_DESCRIPTOR);
    return newFunc;
  };

  wrapper.id = this.functionCounter_++;
  this.FUNCTION = this.createObjectProto(this.FUNCTION_PROTO);
  this.setProperty(scope, 'Function', this.FUNCTION);
  this.setProperty(this.FUNCTION, 'prototype', this.FUNCTION_PROTO, Interpreter.NONENUMERABLE_DESCRIPTOR);
  this.FUNCTION.nativeFunc = wrapper;
  this.setProperty(this.FUNCTION_PROTO, 'constructor', this.FUNCTION, Interpreter.NONENUMERABLE_DESCRIPTOR);

  this.FUNCTION_PROTO.nativeFunc = function () {};

  this.FUNCTION_PROTO.nativeFunc.id = this.functionCounter_++;
  this.setProperty(this.FUNCTION_PROTO, 'length', 0, Interpreter.READONLY_NONENUMERABLE_DESCRIPTOR);

  var boxThis = function boxThis(value) {
    if ((!value || !value.isObject) && !thisInterpreter.getScope().strict) {
      if (value === undefined || value === null) {
        value = thisInterpreter.global;
      } else {
        var box = thisInterpreter.createObjectProto(thisInterpreter.getPrototype(value));
        box.data = value;
        value = box;
      }
    }

    return value;
  };

  wrapper = function wrapper(thisArg, args) {
    var state = thisInterpreter.stateStack[thisInterpreter.stateStack.length - 1];
    state.func_ = this;
    state.funcThis_ = boxThis(thisArg);
    state.arguments_ = [];

    if (args !== null && args !== undefined) {
      if (args.isObject) {
        state.arguments_ = thisInterpreter.arrayPseudoToNative(args);
      } else {
        thisInterpreter.throwException(thisInterpreter.TYPE_ERROR, 'CreateListFromArrayLike called on non-object');
      }
    }

    state.doneExec_ = false;
  };

  this.setNativeFunctionPrototype(this.FUNCTION, 'apply', wrapper);

  wrapper = function wrapper(thisArg) {
    var state = thisInterpreter.stateStack[thisInterpreter.stateStack.length - 1];
    state.func_ = this;
    state.funcThis_ = boxThis(thisArg);
    state.arguments_ = [];

    for (var i = 1; i < arguments.length; i++) {
      state.arguments_.push(arguments[i]);
    }

    state.doneExec_ = false;
  };

  this.setNativeFunctionPrototype(this.FUNCTION, 'call', wrapper);
  this.polyfills_.push("Object.defineProperty(Function.prototype, 'bind',", "{configurable: true, writable: true, value:", "function(oThis) {", "if (typeof this !== 'function') {", "throw TypeError('What is trying to be bound is not callable');", "}", "var aArgs   = Array.prototype.slice.call(arguments, 1),", "fToBind = this,", "fNOP    = function() {},", "fBound  = function() {", "return fToBind.apply(this instanceof fNOP", "? this", ": oThis,", "aArgs.concat(Array.prototype.slice.call(arguments)));", "};", "if (this.prototype) {", "fNOP.prototype = this.prototype;", "}", "fBound.prototype = new fNOP();", "return fBound;", "}", "});", "");

  wrapper = function wrapper() {
    return String(this);
  };

  this.setNativeFunctionPrototype(this.FUNCTION, 'toString', wrapper);
  this.setProperty(this.FUNCTION, 'toString', this.createNativeFunction(wrapper, false), Interpreter.NONENUMERABLE_DESCRIPTOR);

  wrapper = function wrapper() {
    return this.valueOf();
  };

  this.setNativeFunctionPrototype(this.FUNCTION, 'valueOf', wrapper);
  this.setProperty(this.FUNCTION, 'valueOf', this.createNativeFunction(wrapper, false), Interpreter.NONENUMERABLE_DESCRIPTOR);
};
/**
 * Initialize the Object class.
 * @param {!Interpreter.Object} scope Global scope.
 */


Interpreter.prototype.initObject = function (scope) {
  var thisInterpreter = this;
  var wrapper;

  wrapper = function wrapper(value) {
    if (value === undefined || value === null) {
      if (thisInterpreter.calledWithNew()) {
        return this;
      } else {
        return thisInterpreter.createObjectProto(thisInterpreter.OBJECT_PROTO);
      }
    }

    if (!value.isObject) {
      var box = thisInterpreter.createObjectProto(thisInterpreter.getPrototype(value));
      box.data = value;
      return box;
    }

    return value;
  };

  this.OBJECT = this.createNativeFunction(wrapper, true);
  this.setProperty(this.OBJECT, 'prototype', this.OBJECT_PROTO, Interpreter.NONENUMERABLE_DESCRIPTOR);
  this.setProperty(this.OBJECT_PROTO, 'constructor', this.OBJECT, Interpreter.NONENUMERABLE_DESCRIPTOR);
  this.setProperty(scope, 'Object', this.OBJECT);
  /**
   * Checks if the provided value is null or undefined.
   * If so, then throw an error in the call stack.
   * @param {Interpreter.Value} value Value to check.
   */

  var throwIfNullUndefined = function throwIfNullUndefined(value) {
    if (value === undefined || value === null) {
      thisInterpreter.throwException(thisInterpreter.TYPE_ERROR, "Cannot convert '" + value + "' to object");
    }
  };

  wrapper = function wrapper(obj) {
    throwIfNullUndefined(obj);
    var props = obj.isObject ? obj.properties : obj;
    return thisInterpreter.arrayNativeToPseudo(Object.getOwnPropertyNames(props));
  };

  this.setProperty(this.OBJECT, 'getOwnPropertyNames', this.createNativeFunction(wrapper, false), Interpreter.NONENUMERABLE_DESCRIPTOR);

  wrapper = function wrapper(obj) {
    throwIfNullUndefined(obj);

    if (obj.isObject) {
      obj = obj.properties;
    }

    return thisInterpreter.arrayNativeToPseudo(Object.keys(obj));
  };

  this.setProperty(this.OBJECT, 'keys', this.createNativeFunction(wrapper, false), Interpreter.NONENUMERABLE_DESCRIPTOR);

  wrapper = function wrapper(proto) {
    if (proto === null) {
      return thisInterpreter.createObjectProto(null);
    }

    if (proto === undefined || !proto.isObject) {
      thisInterpreter.throwException(thisInterpreter.TYPE_ERROR, 'Object prototype may only be an Object or null');
    }

    return thisInterpreter.createObjectProto(proto);
  };

  this.setProperty(this.OBJECT, 'create', this.createNativeFunction(wrapper, false), Interpreter.NONENUMERABLE_DESCRIPTOR);
  this.polyfills_.push("(function() {", "var create_ = Object.create;", "Object.create = function(proto, props) {", "var obj = create_(proto);", "props && Object.defineProperties(obj, props);", "return obj;", "};", "})();", "");

  wrapper = function wrapper(obj, prop, descriptor) {
    prop = String(prop);

    if (!obj || !obj.isObject) {
      thisInterpreter.throwException(thisInterpreter.TYPE_ERROR, 'Object.defineProperty called on non-object');
    }

    if (!descriptor || !descriptor.isObject) {
      thisInterpreter.throwException(thisInterpreter.TYPE_ERROR, 'Property description must be an object');
    }

    if (!obj.properties[prop] && obj.preventExtensions) {
      thisInterpreter.throwException(thisInterpreter.TYPE_ERROR, "Can't define property '" + prop + "', object is not extensible");
    }

    thisInterpreter.setProperty(obj, prop, Interpreter.VALUE_IN_DESCRIPTOR, descriptor.properties);
    return obj;
  };

  this.setProperty(this.OBJECT, 'defineProperty', this.createNativeFunction(wrapper, false), Interpreter.NONENUMERABLE_DESCRIPTOR);
  this.polyfills_.push("(function() {", "var defineProperty_ = Object.defineProperty;", "Object.defineProperty = function(obj, prop, d1) {", "var d2 = {};", "if ('configurable' in d1) d2.configurable = d1.configurable;", "if ('enumerable' in d1) d2.enumerable = d1.enumerable;", "if ('writable' in d1) d2.writable = d1.writable;", "if ('value' in d1) d2.value = d1.value;", "if ('get' in d1) d2.get = d1.get;", "if ('set' in d1) d2.set = d1.set;", "return defineProperty_(obj, prop, d2);", "};", "})();", "Object.defineProperty(Object, 'defineProperties',", "{configurable: true, writable: true, value:", "function(obj, props) {", "var keys = Object.keys(props);", "for (var i = 0; i < keys.length; i++) {", "Object.defineProperty(obj, keys[i], props[keys[i]]);", "}", "return obj;", "}", "});", "");

  wrapper = function wrapper(obj, prop) {
    if (!obj || !obj.isObject) {
      thisInterpreter.throwException(thisInterpreter.TYPE_ERROR, 'Object.getOwnPropertyDescriptor called on non-object');
    }

    prop = String(prop);

    if (!(prop in obj.properties)) {
      return undefined;
    }

    var descriptor = Object.getOwnPropertyDescriptor(obj.properties, prop);
    var getter = obj.getter[prop];
    var setter = obj.setter[prop];

    if (getter || setter) {
      descriptor.get = getter;
      descriptor.set = setter;
      delete descriptor.value;
      delete descriptor.writable;
    }

    var value = descriptor.value;
    var hasValue = 'value' in descriptor;
    delete descriptor.value;
    var pseudoDescriptor = thisInterpreter.nativeToPseudo(descriptor);

    if (hasValue) {
      thisInterpreter.setProperty(pseudoDescriptor, 'value', value);
    }

    return pseudoDescriptor;
  };

  this.setProperty(this.OBJECT, 'getOwnPropertyDescriptor', this.createNativeFunction(wrapper, false), Interpreter.NONENUMERABLE_DESCRIPTOR);

  wrapper = function wrapper(obj) {
    throwIfNullUndefined(obj);
    return thisInterpreter.getPrototype(obj);
  };

  this.setProperty(this.OBJECT, 'getPrototypeOf', this.createNativeFunction(wrapper, false), Interpreter.NONENUMERABLE_DESCRIPTOR);

  wrapper = function wrapper(obj) {
    return Boolean(obj) && !obj.preventExtensions;
  };

  this.setProperty(this.OBJECT, 'isExtensible', this.createNativeFunction(wrapper, false), Interpreter.NONENUMERABLE_DESCRIPTOR);

  wrapper = function wrapper(obj) {
    if (obj && obj.isObject) {
      obj.preventExtensions = true;
    }

    return obj;
  };

  this.setProperty(this.OBJECT, 'preventExtensions', this.createNativeFunction(wrapper, false), Interpreter.NONENUMERABLE_DESCRIPTOR);
  this.setNativeFunctionPrototype(this.OBJECT, 'toString', Interpreter.Object.prototype.toString);
  this.setNativeFunctionPrototype(this.OBJECT, 'toLocaleString', Interpreter.Object.prototype.toString);
  this.setNativeFunctionPrototype(this.OBJECT, 'valueOf', Interpreter.Object.prototype.valueOf);

  wrapper = function wrapper(prop) {
    throwIfNullUndefined(this);

    if (!this.isObject) {
      return this.hasOwnProperty(prop);
    }

    return String(prop) in this.properties;
  };

  this.setNativeFunctionPrototype(this.OBJECT, 'hasOwnProperty', wrapper);

  wrapper = function wrapper(prop) {
    throwIfNullUndefined(this);

    if (!this.isObject) {
      return this.propertyIsEnumerable(prop);
    }

    return Object.prototype.propertyIsEnumerable.call(this.properties, prop);
  };

  this.setNativeFunctionPrototype(this.OBJECT, 'propertyIsEnumerable', wrapper);

  wrapper = function wrapper(obj) {
    while (true) {
      obj = thisInterpreter.getPrototype(obj);

      if (!obj) {
        return false;
      }

      if (obj === this) {
        return true;
      }
    }
  };

  this.setNativeFunctionPrototype(this.OBJECT, 'isPrototypeOf', wrapper);
};
/**
 * Initialize the Array class.
 * @param {!Interpreter.Object} scope Global scope.
 */


Interpreter.prototype.initArray = function (scope) {
  var thisInterpreter = this;
  var wrapper;

  wrapper = function wrapper(var_args) {
    if (thisInterpreter.calledWithNew()) {
      var newArray = this;
    } else {
      var newArray = thisInterpreter.createObjectProto(thisInterpreter.ARRAY_PROTO);
    }

    var first = arguments[0];

    if (arguments.length === 1 && typeof first === 'number') {
      if (isNaN(Interpreter.legalArrayLength(first))) {
        thisInterpreter.throwException(thisInterpreter.RANGE_ERROR, 'Invalid array length');
      }

      newArray.properties.length = first;
    } else {
      for (var i = 0; i < arguments.length; i++) {
        newArray.properties[i] = arguments[i];
      }

      newArray.properties.length = i;
    }

    return newArray;
  };

  this.ARRAY = this.createNativeFunction(wrapper, true);
  this.ARRAY_PROTO = this.ARRAY.properties['prototype'];
  this.setProperty(scope, 'Array', this.ARRAY);

  wrapper = function wrapper(obj) {
    return obj && obj["class"] === 'Array';
  };

  this.setProperty(this.ARRAY, 'isArray', this.createNativeFunction(wrapper, false), Interpreter.NONENUMERABLE_DESCRIPTOR);

  wrapper = function wrapper() {
    return Array.prototype.pop.call(this.properties);
  };

  this.setNativeFunctionPrototype(this.ARRAY, 'pop', wrapper);

  wrapper = function wrapper(var_args) {
    return Array.prototype.push.apply(this.properties, arguments);
  };

  this.setNativeFunctionPrototype(this.ARRAY, 'push', wrapper);

  wrapper = function wrapper() {
    return Array.prototype.shift.call(this.properties);
  };

  this.setNativeFunctionPrototype(this.ARRAY, 'shift', wrapper);

  wrapper = function wrapper(var_args) {
    return Array.prototype.unshift.apply(this.properties, arguments);
  };

  this.setNativeFunctionPrototype(this.ARRAY, 'unshift', wrapper);

  wrapper = function wrapper() {
    Array.prototype.reverse.call(this.properties);
    return this;
  };

  this.setNativeFunctionPrototype(this.ARRAY, 'reverse', wrapper);

  wrapper = function wrapper(index, howmany) {
    var list = Array.prototype.splice.apply(this.properties, arguments);
    return thisInterpreter.arrayNativeToPseudo(list);
  };

  this.setNativeFunctionPrototype(this.ARRAY, 'splice', wrapper);

  wrapper = function wrapper(opt_begin, opt_end) {
    var list = Array.prototype.slice.call(this.properties, opt_begin, opt_end);
    return thisInterpreter.arrayNativeToPseudo(list);
  };

  this.setNativeFunctionPrototype(this.ARRAY, 'slice', wrapper);

  wrapper = function wrapper(opt_separator) {
    return Array.prototype.join.call(this.properties, opt_separator);
  };

  this.setNativeFunctionPrototype(this.ARRAY, 'join', wrapper);

  wrapper = function wrapper(var_args) {
    var list = [];
    var length = 0;
    var iLength = thisInterpreter.getProperty(this, 'length');

    for (var i = 0; i < iLength; i++) {
      if (thisInterpreter.hasProperty(this, i)) {
        var element = thisInterpreter.getProperty(this, i);
        list[length] = element;
      }

      length++;
    }

    for (var i = 0; i < arguments.length; i++) {
      var value = arguments[i];

      if (thisInterpreter.isa(value, thisInterpreter.ARRAY)) {
        var jLength = thisInterpreter.getProperty(value, 'length');

        for (var j = 0; j < jLength; j++) {
          if (thisInterpreter.hasProperty(value, j)) {
            list[length] = thisInterpreter.getProperty(value, j);
          }

          length++;
        }
      } else {
        list[length] = value;
      }
    }

    return thisInterpreter.arrayNativeToPseudo(list);
  };

  this.setNativeFunctionPrototype(this.ARRAY, 'concat', wrapper);

  wrapper = function wrapper(searchElement, opt_fromIndex) {
    return Array.prototype.indexOf.apply(this.properties, arguments);
  };

  this.setNativeFunctionPrototype(this.ARRAY, 'indexOf', wrapper);

  wrapper = function wrapper(searchElement, opt_fromIndex) {
    return Array.prototype.lastIndexOf.apply(this.properties, arguments);
  };

  this.setNativeFunctionPrototype(this.ARRAY, 'lastIndexOf', wrapper);

  wrapper = function wrapper() {
    Array.prototype.sort.call(this.properties);
    return this;
  };

  this.setNativeFunctionPrototype(this.ARRAY, 'sort', wrapper);
  this.polyfills_.push("Object.defineProperty(Array.prototype, 'every',", "{configurable: true, writable: true, value:", "function(callbackfn, thisArg) {", "if (!this || typeof callbackfn !== 'function') throw TypeError();", "var T, k;", "var O = Object(this);", "var len = O.length >>> 0;", "if (arguments.length > 1) T = thisArg;", "k = 0;", "while (k < len) {", "if (k in O && !callbackfn.call(T, O[k], k, O)) return false;", "k++;", "}", "return true;", "}", "});", "Object.defineProperty(Array.prototype, 'filter',", "{configurable: true, writable: true, value:", "function(fun/*, thisArg*/) {", "if (this === void 0 || this === null || typeof fun !== 'function') throw TypeError();", "var t = Object(this);", "var len = t.length >>> 0;", "var res = [];", "var thisArg = arguments.length >= 2 ? arguments[1] : void 0;", "for (var i = 0; i < len; i++) {", "if (i in t) {", "var val = t[i];", "if (fun.call(thisArg, val, i, t)) res.push(val);", "}", "}", "return res;", "}", "});", "Object.defineProperty(Array.prototype, 'forEach',", "{configurable: true, writable: true, value:", "function(callback, thisArg) {", "if (!this || typeof callback !== 'function') throw TypeError();", "var T, k;", "var O = Object(this);", "var len = O.length >>> 0;", "if (arguments.length > 1) T = thisArg;", "k = 0;", "while (k < len) {", "if (k in O) callback.call(T, O[k], k, O);", "k++;", "}", "}", "});", "Object.defineProperty(Array.prototype, 'map',", "{configurable: true, writable: true, value:", "function(callback, thisArg) {", "if (!this || typeof callback !== 'function') new TypeError;", "var T, A, k;", "var O = Object(this);", "var len = O.length >>> 0;", "if (arguments.length > 1) T = thisArg;", "A = new Array(len);", "k = 0;", "while (k < len) {", "if (k in O) A[k] = callback.call(T, O[k], k, O);", "k++;", "}", "return A;", "}", "});", "Object.defineProperty(Array.prototype, 'reduce',", "{configurable: true, writable: true, value:", "function(callback /*, initialValue*/) {", "if (!this || typeof callback !== 'function') throw TypeError();", "var t = Object(this), len = t.length >>> 0, k = 0, value;", "if (arguments.length === 2) {", "value = arguments[1];", "} else {", "while (k < len && !(k in t)) k++;", "if (k >= len) {", "throw TypeError('Reduce of empty array with no initial value');", "}", "value = t[k++];", "}", "for (; k < len; k++) {", "if (k in t) value = callback(value, t[k], k, t);", "}", "return value;", "}", "});", "Object.defineProperty(Array.prototype, 'reduceRight',", "{configurable: true, writable: true, value:", "function(callback /*, initialValue*/) {", "if (null === this || 'undefined' === typeof this || 'function' !== typeof callback) throw TypeError();", "var t = Object(this), len = t.length >>> 0, k = len - 1, value;", "if (arguments.length >= 2) {", "value = arguments[1];", "} else {", "while (k >= 0 && !(k in t)) k--;", "if (k < 0) {", "throw TypeError('Reduce of empty array with no initial value');", "}", "value = t[k--];", "}", "for (; k >= 0; k--) {", "if (k in t) value = callback(value, t[k], k, t);", "}", "return value;", "}", "});", "Object.defineProperty(Array.prototype, 'some',", "{configurable: true, writable: true, value:", "function(fun/*, thisArg*/) {", "if (!this || typeof fun !== 'function') throw TypeError();", "var t = Object(this);", "var len = t.length >>> 0;", "var thisArg = arguments.length >= 2 ? arguments[1] : void 0;", "for (var i = 0; i < len; i++) {", "if (i in t && fun.call(thisArg, t[i], i, t)) {", "return true;", "}", "}", "return false;", "}", "});", "(function() {", "var sort_ = Array.prototype.sort;", "Array.prototype.sort = function(opt_comp) {", "if (typeof opt_comp !== 'function') {", "return sort_.call(this);", "}", "for (var i = 0; i < this.length; i++) {", "var changes = 0;", "for (var j = 0; j < this.length - i - 1; j++) {", "if (opt_comp(this[j], this[j + 1]) > 0) {", "var swap = this[j];", "this[j] = this[j + 1];", "this[j + 1] = swap;", "changes++;", "}", "}", "if (!changes) break;", "}", "return this;", "};", "})();", "Object.defineProperty(Array.prototype, 'toLocaleString',", "{configurable: true, writable: true, value:", "function() {", "var out = [];", "for (var i = 0; i < this.length; i++) {", "out[i] = (this[i] === null || this[i] === undefined) ? '' : this[i].toLocaleString();", "}", "return out.join(',');", "}", "});", "");
};
/**
 * Initialize the String class.
 * @param {!Interpreter.Object} scope Global scope.
 */


Interpreter.prototype.initString = function (scope) {
  var thisInterpreter = this;
  var wrapper;

  wrapper = function wrapper(value) {
    value = String(value);

    if (thisInterpreter.calledWithNew()) {
      this.data = value;
      return this;
    } else {
      return value;
    }
  };

  this.STRING = this.createNativeFunction(wrapper, true);
  this.setProperty(scope, 'String', this.STRING);
  this.setProperty(this.STRING, 'fromCharCode', this.createNativeFunction(String.fromCharCode, false), Interpreter.NONENUMERABLE_DESCRIPTOR);
  var functions = ['charAt', 'charCodeAt', 'concat', 'indexOf', 'lastIndexOf', 'slice', 'substr', 'substring', 'toLocaleLowerCase', 'toLocaleUpperCase', 'toLowerCase', 'toUpperCase', 'trim'];

  for (var i = 0; i < functions.length; i++) {
    this.setNativeFunctionPrototype(this.STRING, functions[i], String.prototype[functions[i]]);
  }

  wrapper = function wrapper(compareString, locales, options) {
    locales = locales ? thisInterpreter.pseudoToNative(locales) : undefined;
    options = options ? thisInterpreter.pseudoToNative(options) : undefined;
    return String(this).localeCompare(compareString, locales, options);
  };

  this.setNativeFunctionPrototype(this.STRING, 'localeCompare', wrapper);

  wrapper = function wrapper(separator, limit, callback) {
    var string = String(this);
    limit = limit ? Number(limit) : undefined;

    if (thisInterpreter.isa(separator, thisInterpreter.REGEXP)) {
      separator = separator.data;
      thisInterpreter.maybeThrowRegExp(separator, callback);

      if (thisInterpreter.REGEXP_MODE === 2) {
        if (Interpreter.vm) {
          var sandbox = {
            'string': string,
            'separator': separator,
            'limit': limit
          };
          var code = 'string.split(separator, limit)';
          var jsList = thisInterpreter.vmCall(code, sandbox, separator, callback);

          if (jsList !== Interpreter.REGEXP_TIMEOUT) {
            callback(thisInterpreter.arrayNativeToPseudo(jsList));
          }
        } else {
          var splitWorker = thisInterpreter.createWorker();
          var pid = thisInterpreter.regExpTimeout(separator, splitWorker, callback);

          splitWorker.onmessage = function (e) {
            clearTimeout(pid);
            callback(thisInterpreter.arrayNativeToPseudo(e.data));
          };

          splitWorker.postMessage(['split', string, separator, limit]);
        }

        return;
      }
    }

    var jsList = string.split(separator, limit);
    callback(thisInterpreter.arrayNativeToPseudo(jsList));
  };

  this.setAsyncFunctionPrototype(this.STRING, 'split', wrapper);

  wrapper = function wrapper(regexp, callback) {
    var string = String(this);

    if (thisInterpreter.isa(regexp, thisInterpreter.REGEXP)) {
      regexp = regexp.data;
    } else {
      regexp = new RegExp(regexp);
    }

    thisInterpreter.maybeThrowRegExp(regexp, callback);

    if (thisInterpreter.REGEXP_MODE === 2) {
      if (Interpreter.vm) {
        var sandbox = {
          'string': string,
          'regexp': regexp
        };
        var code = 'string.match(regexp)';
        var m = thisInterpreter.vmCall(code, sandbox, regexp, callback);

        if (m !== Interpreter.REGEXP_TIMEOUT) {
          callback(m && thisInterpreter.arrayNativeToPseudo(m));
        }
      } else {
        var matchWorker = thisInterpreter.createWorker();
        var pid = thisInterpreter.regExpTimeout(regexp, matchWorker, callback);

        matchWorker.onmessage = function (e) {
          clearTimeout(pid);
          callback(e.data && thisInterpreter.arrayNativeToPseudo(e.data));
        };

        matchWorker.postMessage(['match', string, regexp]);
      }

      return;
    }

    var m = string.match(regexp);
    callback(m && thisInterpreter.arrayNativeToPseudo(m));
  };

  this.setAsyncFunctionPrototype(this.STRING, 'match', wrapper);

  wrapper = function wrapper(regexp, callback) {
    var string = String(this);

    if (thisInterpreter.isa(regexp, thisInterpreter.REGEXP)) {
      regexp = regexp.data;
    } else {
      regexp = new RegExp(regexp);
    }

    thisInterpreter.maybeThrowRegExp(regexp, callback);

    if (thisInterpreter.REGEXP_MODE === 2) {
      if (Interpreter.vm) {
        var sandbox = {
          'string': string,
          'regexp': regexp
        };
        var code = 'string.search(regexp)';
        var n = thisInterpreter.vmCall(code, sandbox, regexp, callback);

        if (n !== Interpreter.REGEXP_TIMEOUT) {
          callback(n);
        }
      } else {
        var searchWorker = thisInterpreter.createWorker();
        var pid = thisInterpreter.regExpTimeout(regexp, searchWorker, callback);

        searchWorker.onmessage = function (e) {
          clearTimeout(pid);
          callback(e.data);
        };

        searchWorker.postMessage(['search', string, regexp]);
      }

      return;
    }

    callback(string.search(regexp));
  };

  this.setAsyncFunctionPrototype(this.STRING, 'search', wrapper);

  wrapper = function wrapper(substr, newSubstr, callback) {
    var string = String(this);
    newSubstr = String(newSubstr);

    if (thisInterpreter.isa(substr, thisInterpreter.REGEXP)) {
      substr = substr.data;
      thisInterpreter.maybeThrowRegExp(substr, callback);

      if (thisInterpreter.REGEXP_MODE === 2) {
        if (Interpreter.vm) {
          var sandbox = {
            'string': string,
            'substr': substr,
            'newSubstr': newSubstr
          };
          var code = 'string.replace(substr, newSubstr)';
          var str = thisInterpreter.vmCall(code, sandbox, substr, callback);

          if (str !== Interpreter.REGEXP_TIMEOUT) {
            callback(str);
          }
        } else {
          var replaceWorker = thisInterpreter.createWorker();
          var pid = thisInterpreter.regExpTimeout(substr, replaceWorker, callback);

          replaceWorker.onmessage = function (e) {
            clearTimeout(pid);
            callback(e.data);
          };

          replaceWorker.postMessage(['replace', string, substr, newSubstr]);
        }

        return;
      }
    }

    callback(string.replace(substr, newSubstr));
  };

  this.setAsyncFunctionPrototype(this.STRING, 'replace', wrapper);
  this.polyfills_.push("(function() {", "var replace_ = String.prototype.replace;", "String.prototype.replace = function(substr, newSubstr) {", "if (typeof newSubstr !== 'function') {", "return replace_.call(this, substr, newSubstr);", "}", "var str = this;", "if (substr instanceof RegExp) {", "var subs = [];", "var m = substr.exec(str);", "while (m) {", "m.push(m.index, str);", "var inject = newSubstr.apply(null, m);", "subs.push([m.index, m[0].length, inject]);", "m = substr.global ? substr.exec(str) : null;", "}", "for (var i = subs.length - 1; i >= 0; i--) {", "str = str.substring(0, subs[i][0]) + subs[i][2] + " + "str.substring(subs[i][0] + subs[i][1]);", "}", "} else {", "var i = str.indexOf(substr);", "if (i !== -1) {", "var inject = newSubstr(str.substr(i, substr.length), i, str);", "str = str.substring(0, i) + inject + " + "str.substring(i + substr.length);", "}", "}", "return str;", "};", "})();", "");
};
/**
 * Initialize the Boolean class.
 * @param {!Interpreter.Object} scope Global scope.
 */


Interpreter.prototype.initBoolean = function (scope) {
  var thisInterpreter = this;
  var wrapper;

  wrapper = function wrapper(value) {
    value = Boolean(value);

    if (thisInterpreter.calledWithNew()) {
      this.data = value;
      return this;
    } else {
      return value;
    }
  };

  this.BOOLEAN = this.createNativeFunction(wrapper, true);
  this.setProperty(scope, 'Boolean', this.BOOLEAN);
};
/**
 * Initialize the Number class.
 * @param {!Interpreter.Object} scope Global scope.
 */


Interpreter.prototype.initNumber = function (scope) {
  var thisInterpreter = this;
  var wrapper;

  wrapper = function wrapper(value) {
    value = Number(value);

    if (thisInterpreter.calledWithNew()) {
      this.data = value;
      return this;
    } else {
      return value;
    }
  };

  this.NUMBER = this.createNativeFunction(wrapper, true);
  this.setProperty(scope, 'Number', this.NUMBER);
  var numConsts = ['MAX_VALUE', 'MIN_VALUE', 'NaN', 'NEGATIVE_INFINITY', 'POSITIVE_INFINITY'];

  for (var i = 0; i < numConsts.length; i++) {
    this.setProperty(this.NUMBER, numConsts[i], Number[numConsts[i]], Interpreter.READONLY_NONENUMERABLE_DESCRIPTOR);
  }

  wrapper = function wrapper(fractionDigits) {
    try {
      return Number(this).toExponential(fractionDigits);
    } catch (e) {
      thisInterpreter.throwException(thisInterpreter.ERROR, e.message);
    }
  };

  this.setNativeFunctionPrototype(this.NUMBER, 'toExponential', wrapper);

  wrapper = function wrapper(digits) {
    try {
      return Number(this).toFixed(digits);
    } catch (e) {
      thisInterpreter.throwException(thisInterpreter.ERROR, e.message);
    }
  };

  this.setNativeFunctionPrototype(this.NUMBER, 'toFixed', wrapper);

  wrapper = function wrapper(precision) {
    try {
      return Number(this).toPrecision(precision);
    } catch (e) {
      thisInterpreter.throwException(thisInterpreter.ERROR, e.message);
    }
  };

  this.setNativeFunctionPrototype(this.NUMBER, 'toPrecision', wrapper);

  wrapper = function wrapper(radix) {
    try {
      return Number(this).toString(radix);
    } catch (e) {
      thisInterpreter.throwException(thisInterpreter.ERROR, e.message);
    }
  };

  this.setNativeFunctionPrototype(this.NUMBER, 'toString', wrapper);

  wrapper = function wrapper(locales, options) {
    locales = locales ? thisInterpreter.pseudoToNative(locales) : undefined;
    options = options ? thisInterpreter.pseudoToNative(options) : undefined;
    return Number(this).toLocaleString(locales, options);
  };

  this.setNativeFunctionPrototype(this.NUMBER, 'toLocaleString', wrapper);
};
/**
 * Initialize the Date class.
 * @param {!Interpreter.Object} scope Global scope.
 */


Interpreter.prototype.initDate = function (scope) {
  var thisInterpreter = this;
  var wrapper;

  wrapper = function wrapper(value, var_args) {
    if (!thisInterpreter.calledWithNew()) {
      return Date();
    }

    var args = [null].concat(Array.from(arguments));
    this.data = new (Function.prototype.bind.apply(Date, args))();
    return this;
  };

  this.DATE = this.createNativeFunction(wrapper, true);
  this.DATE_PROTO = this.DATE.properties['prototype'];
  this.setProperty(scope, 'Date', this.DATE);
  this.setProperty(this.DATE, 'now', this.createNativeFunction(Date.now, false), Interpreter.NONENUMERABLE_DESCRIPTOR);
  this.setProperty(this.DATE, 'parse', this.createNativeFunction(Date.parse, false), Interpreter.NONENUMERABLE_DESCRIPTOR);
  this.setProperty(this.DATE, 'UTC', this.createNativeFunction(Date.UTC, false), Interpreter.NONENUMERABLE_DESCRIPTOR);
  var functions = ['getDate', 'getDay', 'getFullYear', 'getHours', 'getMilliseconds', 'getMinutes', 'getMonth', 'getSeconds', 'getTime', 'getTimezoneOffset', 'getUTCDate', 'getUTCDay', 'getUTCFullYear', 'getUTCHours', 'getUTCMilliseconds', 'getUTCMinutes', 'getUTCMonth', 'getUTCSeconds', 'getYear', 'setDate', 'setFullYear', 'setHours', 'setMilliseconds', 'setMinutes', 'setMonth', 'setSeconds', 'setTime', 'setUTCDate', 'setUTCFullYear', 'setUTCHours', 'setUTCMilliseconds', 'setUTCMinutes', 'setUTCMonth', 'setUTCSeconds', 'setYear', 'toDateString', 'toISOString', 'toJSON', 'toGMTString', 'toLocaleDateString', 'toLocaleString', 'toLocaleTimeString', 'toTimeString', 'toUTCString'];

  for (var i = 0; i < functions.length; i++) {
    wrapper = function (nativeFunc) {
      return function (var_args) {
        var args = [];

        for (var i = 0; i < arguments.length; i++) {
          args[i] = thisInterpreter.pseudoToNative(arguments[i]);
        }

        return this.data[nativeFunc].apply(this.data, args);
      };
    }(functions[i]);

    this.setNativeFunctionPrototype(this.DATE, functions[i], wrapper);
  }
};
/**
 * Initialize Regular Expression object.
 * @param {!Interpreter.Object} scope Global scope.
 */


Interpreter.prototype.initRegExp = function (scope) {
  var thisInterpreter = this;
  var wrapper;

  wrapper = function wrapper(pattern, flags) {
    if (thisInterpreter.calledWithNew()) {
      var rgx = this;
    } else {
      var rgx = thisInterpreter.createObjectProto(thisInterpreter.REGEXP_PROTO);
    }

    pattern = pattern ? String(pattern) : '';
    flags = flags ? String(flags) : '';
    thisInterpreter.populateRegExp(rgx, new RegExp(pattern, flags));
    return rgx;
  };

  this.REGEXP = this.createNativeFunction(wrapper, true);
  this.REGEXP_PROTO = this.REGEXP.properties['prototype'];
  this.setProperty(scope, 'RegExp', this.REGEXP);
  this.setProperty(this.REGEXP.properties['prototype'], 'global', undefined, Interpreter.READONLY_NONENUMERABLE_DESCRIPTOR);
  this.setProperty(this.REGEXP.properties['prototype'], 'ignoreCase', undefined, Interpreter.READONLY_NONENUMERABLE_DESCRIPTOR);
  this.setProperty(this.REGEXP.properties['prototype'], 'multiline', undefined, Interpreter.READONLY_NONENUMERABLE_DESCRIPTOR);
  this.setProperty(this.REGEXP.properties['prototype'], 'source', '(?:)', Interpreter.READONLY_NONENUMERABLE_DESCRIPTOR);
  this.polyfills_.push("Object.defineProperty(RegExp.prototype, 'test',", "{configurable: true, writable: true, value:", "function(str) {", "return String(str).search(this) !== -1", "}", "});");

  wrapper = function wrapper(string, callback) {
    var thisPseudoRegExp = this;
    var regexp = thisPseudoRegExp.data;
    string = String(string);
    regexp.lastIndex = Number(thisInterpreter.getProperty(this, 'lastIndex'));
    thisInterpreter.maybeThrowRegExp(regexp, callback);

    if (thisInterpreter.REGEXP_MODE === 2) {
      if (Interpreter.vm) {
        var sandbox = {
          'string': string,
          'regexp': regexp
        };
        var code = 'regexp.exec(string)';
        var match = thisInterpreter.vmCall(code, sandbox, regexp, callback);

        if (match !== Interpreter.REGEXP_TIMEOUT) {
          thisInterpreter.setProperty(thisPseudoRegExp, 'lastIndex', regexp.lastIndex);
          callback(matchToPseudo(match));
        }
      } else {
        var execWorker = thisInterpreter.createWorker();
        var pid = thisInterpreter.regExpTimeout(regexp, execWorker, callback);

        execWorker.onmessage = function (e) {
          clearTimeout(pid);
          thisInterpreter.setProperty(thisPseudoRegExp, 'lastIndex', e.data[1]);
          callback(matchToPseudo(e.data[0]));
        };

        execWorker.postMessage(['exec', regexp, regexp.lastIndex, string]);
      }

      return;
    }

    var match = regexp.exec(string);
    thisInterpreter.setProperty(thisPseudoRegExp, 'lastIndex', regexp.lastIndex);
    callback(matchToPseudo(match));

    function matchToPseudo(match) {
      if (match) {
        var result = thisInterpreter.arrayNativeToPseudo(match);
        thisInterpreter.setProperty(result, 'index', match.index);
        thisInterpreter.setProperty(result, 'input', match.input);
        return result;
      }

      return null;
    }
  };

  this.setAsyncFunctionPrototype(this.REGEXP, 'exec', wrapper);
};
/**
 * Initialize the Error class.
 * @param {!Interpreter.Object} scope Global scope.
 */


Interpreter.prototype.initError = function (scope) {
  var thisInterpreter = this;
  this.ERROR = this.createNativeFunction(function (opt_message) {
    if (thisInterpreter.calledWithNew()) {
      var newError = this;
    } else {
      var newError = thisInterpreter.createObject(thisInterpreter.ERROR);
    }

    if (opt_message) {
      thisInterpreter.setProperty(newError, 'message', String(opt_message), Interpreter.NONENUMERABLE_DESCRIPTOR);
    }

    return newError;
  }, true);
  this.setProperty(scope, 'Error', this.ERROR);
  this.setProperty(this.ERROR.properties['prototype'], 'message', '', Interpreter.NONENUMERABLE_DESCRIPTOR);
  this.setProperty(this.ERROR.properties['prototype'], 'name', 'Error', Interpreter.NONENUMERABLE_DESCRIPTOR);

  var createErrorSubclass = function createErrorSubclass(name) {
    var constructor = thisInterpreter.createNativeFunction(function (opt_message) {
      if (thisInterpreter.calledWithNew()) {
        var newError = this;
      } else {
        var newError = thisInterpreter.createObject(constructor);
      }

      if (opt_message) {
        thisInterpreter.setProperty(newError, 'message', String(opt_message), Interpreter.NONENUMERABLE_DESCRIPTOR);
      }

      return newError;
    }, true);
    thisInterpreter.setProperty(constructor, 'prototype', thisInterpreter.createObject(thisInterpreter.ERROR), Interpreter.NONENUMERABLE_DESCRIPTOR);
    thisInterpreter.setProperty(constructor.properties['prototype'], 'name', name, Interpreter.NONENUMERABLE_DESCRIPTOR);
    thisInterpreter.setProperty(scope, name, constructor);
    return constructor;
  };

  this.EVAL_ERROR = createErrorSubclass('EvalError');
  this.RANGE_ERROR = createErrorSubclass('RangeError');
  this.REFERENCE_ERROR = createErrorSubclass('ReferenceError');
  this.SYNTAX_ERROR = createErrorSubclass('SyntaxError');
  this.TYPE_ERROR = createErrorSubclass('TypeError');
  this.URI_ERROR = createErrorSubclass('URIError');
};
/**
 * Initialize Math object.
 * @param {!Interpreter.Object} scope Global scope.
 */


Interpreter.prototype.initMath = function (scope) {
  var thisInterpreter = this;
  var myMath = this.createObjectProto(this.OBJECT_PROTO);
  this.setProperty(scope, 'Math', myMath);
  var mathConsts = ['E', 'LN2', 'LN10', 'LOG2E', 'LOG10E', 'PI', 'SQRT1_2', 'SQRT2'];

  for (var i = 0; i < mathConsts.length; i++) {
    this.setProperty(myMath, mathConsts[i], Math[mathConsts[i]], Interpreter.READONLY_NONENUMERABLE_DESCRIPTOR);
  }

  var numFunctions = ['abs', 'acos', 'asin', 'atan', 'atan2', 'ceil', 'cos', 'exp', 'floor', 'log', 'max', 'min', 'pow', 'random', 'round', 'sin', 'sqrt', 'tan'];

  for (var i = 0; i < numFunctions.length; i++) {
    this.setProperty(myMath, numFunctions[i], this.createNativeFunction(Math[numFunctions[i]], false), Interpreter.NONENUMERABLE_DESCRIPTOR);
  }
};
/**
 * Initialize JSON object.
 * @param {!Interpreter.Object} scope Global scope.
 */


Interpreter.prototype.initJSON = function (scope) {
  var thisInterpreter = this;
  var myJSON = thisInterpreter.createObjectProto(this.OBJECT_PROTO);
  this.setProperty(scope, 'JSON', myJSON);

  var wrapper = function wrapper(text) {
    try {
      var nativeObj = JSON.parse(String(text));
    } catch (e) {
      thisInterpreter.throwException(thisInterpreter.SYNTAX_ERROR, e.message);
    }

    return thisInterpreter.nativeToPseudo(nativeObj);
  };

  this.setProperty(myJSON, 'parse', this.createNativeFunction(wrapper, false));

  wrapper = function wrapper(value) {
    var nativeObj = thisInterpreter.pseudoToNative(value);

    try {
      var str = JSON.stringify(nativeObj);
    } catch (e) {
      thisInterpreter.throwException(thisInterpreter.TYPE_ERROR, e.message);
    }

    return str;
  };

  this.setProperty(myJSON, 'stringify', this.createNativeFunction(wrapper, false));
};
/**
 * Is an object of a certain class?
 * @param {Interpreter.Value} child Object to check.
 * @param {Interpreter.Object} constructor Constructor of object.
 * @return {boolean} True if object is the class or inherits from it.
 *     False otherwise.
 */


Interpreter.prototype.isa = function (child, constructor) {
  if (child === null || child === undefined || !constructor) {
    return false;
  }

  var proto = constructor.properties['prototype'];

  if (child === proto) {
    return true;
  }

  child = this.getPrototype(child);

  while (child) {
    if (child === proto) {
      return true;
    }

    child = child.proto;
  }

  return false;
};
/**
 * Initialize a pseudo regular expression object based on a native regular
 * expression object.
 * @param {!Interpreter.Object} pseudoRegexp The existing object to set.
 * @param {!RegExp} nativeRegexp The native regular expression.
 */


Interpreter.prototype.populateRegExp = function (pseudoRegexp, nativeRegexp) {
  pseudoRegexp.data = nativeRegexp;
  this.setProperty(pseudoRegexp, 'lastIndex', nativeRegexp.lastIndex, Interpreter.NONENUMERABLE_DESCRIPTOR);
  this.setProperty(pseudoRegexp, 'source', nativeRegexp.source, Interpreter.READONLY_NONENUMERABLE_DESCRIPTOR);
  this.setProperty(pseudoRegexp, 'global', nativeRegexp.global, Interpreter.READONLY_NONENUMERABLE_DESCRIPTOR);
  this.setProperty(pseudoRegexp, 'ignoreCase', nativeRegexp.ignoreCase, Interpreter.READONLY_NONENUMERABLE_DESCRIPTOR);
  this.setProperty(pseudoRegexp, 'multiline', nativeRegexp.multiline, Interpreter.READONLY_NONENUMERABLE_DESCRIPTOR);
};
/**
 * Create a Web Worker to execute regular expressions.
 * Using a separate file fails in Chrome when run locally on a file:// URI.
 * Using a data encoded URI fails in IE and Edge.
 * Using a blob works in IE11 and all other browsers.
 * @return {!Worker} Web Worker with regexp execution code loaded.
 */


Interpreter.prototype.createWorker = function () {
  var blob = this.createWorker.blob_;

  if (!blob) {
    blob = new Blob([Interpreter.WORKER_CODE.join('\n')], {
      type: 'application/javascript'
    });
    this.createWorker.blob_ = blob;
  }

  return new Worker(URL.createObjectURL(blob));
};
/**
 * Execute regular expressions in a node vm.
 * @param {string} code Code to execute.
 * @param {!Object} sandbox Global variables for new vm.
 * @param {!RegExp} nativeRegExp Regular expression.
 * @param {!Function} callback Asynchronous callback function.
 */


Interpreter.prototype.vmCall = function (code, sandbox, nativeRegExp, callback) {
  var options = {
    'timeout': this.REGEXP_THREAD_TIMEOUT
  };

  try {
    return Interpreter.vm['runInNewContext'](code, sandbox, options);
  } catch (e) {
    callback(null);
    this.throwException(this.ERROR, 'RegExp Timeout: ' + nativeRegExp);
  }

  return Interpreter.REGEXP_TIMEOUT;
};
/**
 * If REGEXP_MODE is 0, then throw an error.
 * Also throw if REGEXP_MODE is 2 and JS doesn't support Web Workers or vm.
 * @param {!RegExp} nativeRegExp Regular expression.
 * @param {!Function} callback Asynchronous callback function.
 */


Interpreter.prototype.maybeThrowRegExp = function (nativeRegExp, callback) {
  var ok;

  if (this.REGEXP_MODE === 0) {
    ok = false;
  } else if (this.REGEXP_MODE === 1) {
    ok = true;
  } else {
    if (Interpreter.vm) {
      ok = true;
    } else if (typeof Worker === 'function' && typeof URL === 'function') {
      ok = true;
    } else if (typeof require === 'function') {
      try {
        Interpreter.vm = require('vm');
      } catch (e) {}

      ;
      ok = !!Interpreter.vm;
    } else {
      ok = false;
    }
  }

  if (!ok) {
    callback(null);
    this.throwException(this.ERROR, 'Regular expressions not supported: ' + nativeRegExp);
  }
};
/**
 * Set a timeout for regular expression threads.  Unless cancelled, this will
 * terminate the thread and throw an error.
 * @param {!RegExp} nativeRegExp Regular expression (used for error message).
 * @param {!Worker} worker Thread to terminate.
 * @param {!Function} callback Async callback function to continue execution.
 * @return {number} PID of timeout.  Used to cancel if thread completes.
 */


Interpreter.prototype.regExpTimeout = function (nativeRegExp, worker, callback) {
  var thisInterpreter = this;
  return setTimeout(function () {
    worker.terminate();
    callback(null);

    try {
      thisInterpreter.throwException(thisInterpreter.ERROR, 'RegExp Timeout: ' + nativeRegExp);
    } catch (e) {}
  }, this.REGEXP_THREAD_TIMEOUT);
};
/**
 * Is a value a legal integer for an array length?
 * @param {Interpreter.Value} x Value to check.
 * @return {number} Zero, or a positive integer if the value can be
 *     converted to such.  NaN otherwise.
 */


Interpreter.legalArrayLength = function (x) {
  var n = x >>> 0;
  return n === Number(x) ? n : NaN;
};
/**
 * Is a value a legal integer for an array index?
 * @param {Interpreter.Value} x Value to check.
 * @return {number} Zero, or a positive integer if the value can be
 *     converted to such.  NaN otherwise.
 */


Interpreter.legalArrayIndex = function (x) {
  var n = x >>> 0;
  return String(n) === String(x) && n !== 0xffffffff ? n : NaN;
};
/**
 * Typedef for JS values.
 * @typedef {!Interpreter.Object|boolean|number|string|undefined|null}
 */


Interpreter.Value;
/**
 * Class for an object.
 * @param {Interpreter.Object} proto Prototype object or null.
 * @constructor
 */

Interpreter.Object = function (proto) {
  this.getter = Object.create(null);
  this.setter = Object.create(null);
  this.properties = Object.create(null);
  this.proto = proto;
};
/** @type {Interpreter.Object} */


Interpreter.Object.prototype.proto = null;
/** @type {boolean} */

Interpreter.Object.prototype.isObject = true;
/** @type {string} */

Interpreter.Object.prototype["class"] = 'Object';
/** @type {Date|RegExp|boolean|number|string|undefined|null} */

Interpreter.Object.prototype.data = null;
/**
 * Convert this object into a string.
 * @return {string} String value.
 * @override
 */

Interpreter.Object.prototype.toString = function () {
  if (this["class"] === 'Array') {
    var cycles = Interpreter.toStringCycles_;
    cycles.push(this);

    try {
      var strs = [];

      for (var i = 0; i < this.properties.length; i++) {
        var value = this.properties[i];
        strs[i] = value && value.isObject && cycles.indexOf(value) !== -1 ? '...' : value;
      }
    } finally {
      cycles.pop();
    }

    return strs.join(',');
  }

  if (this["class"] === 'Error') {
    var cycles = Interpreter.toStringCycles_;

    if (cycles.indexOf(this) !== -1) {
      return '[object Error]';
    }

    var name, message;
    var obj = this;

    do {
      if ('name' in obj.properties) {
        name = obj.properties['name'];
        break;
      }
    } while (obj = obj.proto);

    var obj = this;

    do {
      if ('message' in obj.properties) {
        message = obj.properties['message'];
        break;
      }
    } while (obj = obj.proto);

    cycles.push(this);

    try {
      name = name && String(name);
      message = message && String(message);
    } finally {
      cycles.pop();
    }

    return message ? name + ': ' + message : String(name);
  }

  if (this.data !== null) {
    return String(this.data);
  }

  return '[object ' + this["class"] + ']';
};
/**
 * Return the object's value.
 * @return {Interpreter.Value} Value.
 * @override
 */


Interpreter.Object.prototype.valueOf = function () {
  if (this.data === undefined || this.data === null || this.data instanceof RegExp) {
    return this;
  }

  if (this.data instanceof Date) {
    return this.data.valueOf();
  }

  return (
    /** @type {(boolean|number|string)} */
    this.data
  );
};
/**
 * Create a new data object based on a constructor's prototype.
 * @param {Interpreter.Object} constructor Parent constructor function,
 *     or null if scope object.
 * @return {!Interpreter.Object} New data object.
 */


Interpreter.prototype.createObject = function (constructor) {
  return this.createObjectProto(constructor && constructor.properties['prototype']);
};
/**
 * Create a new data object based on a prototype.
 * @param {Interpreter.Object} proto Prototype object.
 * @return {!Interpreter.Object} New data object.
 */


Interpreter.prototype.createObjectProto = function (proto) {
  if (_typeof(proto) !== 'object') {
    throw Error('Non object prototype');
  }

  var obj = new Interpreter.Object(proto);

  if (this.isa(obj, this.FUNCTION)) {
    this.setProperty(obj, 'prototype', this.createObjectProto(this.OBJECT_PROTO || null), Interpreter.NONENUMERABLE_DESCRIPTOR);
    obj["class"] = 'Function';
  }

  if (this.isa(obj, this.ARRAY)) {
    this.setProperty(obj, 'length', 0, {
      configurable: false,
      enumerable: false,
      writable: true
    });
    obj["class"] = 'Array';
  }

  if (this.isa(obj, this.ERROR)) {
    obj["class"] = 'Error';
  }

  return obj;
};
/**
 * Create a new function.
 * @param {!Object} node AST node defining the function.
 * @param {!Object} scope Parent scope.
 * @return {!Interpreter.Object} New function.
 */


Interpreter.prototype.createFunction = function (node, scope) {
  var func = this.createObjectProto(this.FUNCTION_PROTO);
  func.parentScope = scope;
  func.node = node;
  this.setProperty(func, 'length', func.node['params'].length, Interpreter.READONLY_NONENUMERABLE_DESCRIPTOR);
  return func;
};
/**
 * Create a new native function.
 * @param {!Function} nativeFunc JavaScript function.
 * @param {boolean=} opt_constructor If true, the function's
 * prototype will have its constructor property set to the function.
 * If false, the function cannot be called as a constructor (e.g. escape).
 * Defaults to undefined.
 * @return {!Interpreter.Object} New function.
 */


Interpreter.prototype.createNativeFunction = function (nativeFunc, opt_constructor) {
  var func = this.createObjectProto(this.FUNCTION_PROTO);
  func.nativeFunc = nativeFunc;
  nativeFunc.id = this.functionCounter_++;
  this.setProperty(func, 'length', nativeFunc.length, Interpreter.READONLY_NONENUMERABLE_DESCRIPTOR);

  if (opt_constructor) {
    this.setProperty(func.properties['prototype'], 'constructor', func, Interpreter.NONENUMERABLE_DESCRIPTOR);
  } else if (opt_constructor === false) {
    func.illegalConstructor = true;
    this.setProperty(func, 'prototype', undefined, Interpreter.NONENUMERABLE_DESCRIPTOR);
  }

  return func;
};
/**
 * Create a new native asynchronous function.
 * @param {!Function} asyncFunc JavaScript function.
 * @return {!Interpreter.Object} New function.
 */


Interpreter.prototype.createAsyncFunction = function (asyncFunc) {
  var func = this.createObjectProto(this.FUNCTION_PROTO);
  func.asyncFunc = asyncFunc;
  asyncFunc.id = this.functionCounter_++;
  this.setProperty(func, 'length', asyncFunc.length, Interpreter.READONLY_NONENUMERABLE_DESCRIPTOR);
  return func;
};
/**
 * Converts from a native JS object or value to a JS interpreter object.
 * Can handle JSON-style values, does NOT handle cycles.
 * @param {*} nativeObj The native JS object to be converted.
 * @return {Interpreter.Value} The equivalent JS interpreter object.
 */


Interpreter.prototype.nativeToPseudo = function (nativeObj) {
  if (_typeof(nativeObj) !== 'object' && typeof nativeObj !== 'function' || nativeObj === null) {
    return nativeObj;
  }

  if (nativeObj instanceof RegExp) {
    var pseudoRegexp = this.createObjectProto(this.REGEXP_PROTO);
    this.populateRegExp(pseudoRegexp, nativeObj);
    return pseudoRegexp;
  }

  if (nativeObj instanceof Date) {
    var pseudoDate = this.createObjectProto(this.DATE_PROTO);
    pseudoDate.data = nativeObj;
    return pseudoDate;
  }

  if (nativeObj instanceof Function) {
    var interpreter = this;

    var wrapper = function wrapper() {
      return interpreter.nativeToPseudo(nativeObj.apply(interpreter, Array.prototype.slice.call(arguments).map(function (i) {
        return interpreter.pseudoToNative(i);
      })));
    };

    return this.createNativeFunction(wrapper, undefined);
  }

  var pseudoObj;

  if (Array.isArray(nativeObj)) {
    pseudoObj = this.createObjectProto(this.ARRAY_PROTO);

    for (var i = 0; i < nativeObj.length; i++) {
      if (i in nativeObj) {
        this.setProperty(pseudoObj, i, this.nativeToPseudo(nativeObj[i]));
      }
    }
  } else {
    pseudoObj = this.createObjectProto(this.OBJECT_PROTO);

    for (var key in nativeObj) {
      this.setProperty(pseudoObj, key, this.nativeToPseudo(nativeObj[key]));
    }
  }

  return pseudoObj;
};
/**
 * Converts from a JS interpreter object to native JS object.
 * Can handle JSON-style values, plus cycles.
 * @param {Interpreter.Value} pseudoObj The JS interpreter object to be
 * converted.
 * @param {Object=} opt_cycles Cycle detection (used in recursive calls).
 * @return {*} The equivalent native JS object or value.
 */


Interpreter.prototype.pseudoToNative = function (pseudoObj, opt_cycles) {
  if (_typeof(pseudoObj) !== 'object' && typeof pseudoObj !== 'function' || pseudoObj === null) {
    return pseudoObj;
  }

  if (this.isa(pseudoObj, this.REGEXP)) {
    return pseudoObj.data;
  }

  if (this.isa(pseudoObj, this.DATE)) {
    return pseudoObj.data;
  }

  var cycles = opt_cycles || {
    pseudo: [],
    "native": []
  };
  var i = cycles.pseudo.indexOf(pseudoObj);

  if (i !== -1) {
    return cycles["native"][i];
  }

  cycles.pseudo.push(pseudoObj);
  var nativeObj;

  if (this.isa(pseudoObj, this.ARRAY)) {
    nativeObj = [];
    cycles["native"].push(nativeObj);
    var length = this.getProperty(pseudoObj, 'length');

    for (var i = 0; i < length; i++) {
      if (this.hasProperty(pseudoObj, i)) {
        nativeObj[i] = this.pseudoToNative(this.getProperty(pseudoObj, i), cycles);
      }
    }
  } else {
    nativeObj = {};
    cycles["native"].push(nativeObj);
    var val;

    for (var key in pseudoObj.properties) {
      val = pseudoObj.properties[key];
      nativeObj[key] = this.pseudoToNative(val, cycles);
    }
  }

  cycles.pseudo.pop();
  cycles["native"].pop();
  return nativeObj;
};
/**
 * Converts from a native JS array to a JS interpreter array.
 * Does handle non-numeric properties (like str.match's index prop).
 * Does NOT recurse into the array's contents.
 * @param {!Array} nativeArray The JS array to be converted.
 * @return {!Interpreter.Object} The equivalent JS interpreter array.
 */


Interpreter.prototype.arrayNativeToPseudo = function (nativeArray) {
  var pseudoArray = this.createObjectProto(this.ARRAY_PROTO);
  var props = Object.getOwnPropertyNames(nativeArray);

  for (var i = 0; i < props.length; i++) {
    this.setProperty(pseudoArray, props[i], nativeArray[props[i]]);
  }

  return pseudoArray;
};
/**
 * Converts from a JS interpreter array to native JS array.
 * Does handle non-numeric properties (like str.match's index prop).
 * Does NOT recurse into the array's contents.
 * @param {!Interpreter.Object} pseudoArray The JS interpreter array,
 *     or JS interpreter object pretending to be an array.
 * @return {!Array} The equivalent native JS array.
 */


Interpreter.prototype.arrayPseudoToNative = function (pseudoArray) {
  var nativeArray = [];

  for (var key in pseudoArray.properties) {
    nativeArray[key] = this.getProperty(pseudoArray, key);
  }

  nativeArray.length = Interpreter.legalArrayLength(this.getProperty(pseudoArray, 'length')) || 0;
  return nativeArray;
};
/**
 * Look up the prototype for this value.
 * @param {Interpreter.Value} value Data object.
 * @return {Interpreter.Object} Prototype object, null if none.
 */


Interpreter.prototype.getPrototype = function (value) {
  switch (_typeof(value)) {
    case 'number':
      return this.NUMBER.properties['prototype'];

    case 'boolean':
      return this.BOOLEAN.properties['prototype'];

    case 'string':
      return this.STRING.properties['prototype'];
  }

  if (value) {
    return value.proto;
  }

  return null;
};
/**
 * Fetch a property value from a data object.
 * @param {Interpreter.Value} obj Data object.
 * @param {Interpreter.Value} name Name of property.
 * @return {Interpreter.Value} Property value (may be undefined).
 */


Interpreter.prototype.getProperty = function (obj, name) {
  name = String(name);

  if (obj === undefined || obj === null) {
    this.throwException(this.TYPE_ERROR, "Cannot read property '" + name + "' of " + obj);
  }

  if (name === 'length') {
    if (this.isa(obj, this.STRING)) {
      return String(obj).length;
    }
  } else if (name.charCodeAt(0) < 0x40) {
    if (this.isa(obj, this.STRING)) {
      var n = Interpreter.legalArrayIndex(name);

      if (!isNaN(n) && n < String(obj).length) {
        return String(obj)[n];
      }
    }
  }

  do {
    if (obj.properties && name in obj.properties) {
      var getter = obj.getter[name];

      if (getter) {
        getter.isGetter = true;
        return getter;
      }

      return obj.properties[name];
    }
  } while (obj = this.getPrototype(obj));

  return undefined;
};
/**
 * Does the named property exist on a data object.
 * @param {Interpreter.Value} obj Data object.
 * @param {Interpreter.Value} name Name of property.
 * @return {boolean} True if property exists.
 */


Interpreter.prototype.hasProperty = function (obj, name) {
  if (!obj.isObject) {
    throw TypeError('Primitive data type has no properties');
  }

  name = String(name);

  if (name === 'length' && this.isa(obj, this.STRING)) {
    return true;
  }

  if (this.isa(obj, this.STRING)) {
    var n = Interpreter.legalArrayIndex(name);

    if (!isNaN(n) && n < String(obj).length) {
      return true;
    }
  }

  do {
    if (obj.properties && name in obj.properties) {
      return true;
    }
  } while (obj = this.getPrototype(obj));

  return false;
};
/**
 * Set a property value on a data object.
 * @param {!Interpreter.Object} obj Data object.
 * @param {Interpreter.Value} name Name of property.
 * @param {Interpreter.Value} value New property value.
 *     Use Interpreter.VALUE_IN_DESCRIPTOR if value is handled by
 *     descriptor instead.
 * @param {Object=} opt_descriptor Optional descriptor object.
 * @return {!Interpreter.Object|undefined} Returns a setter function if one
 *     needs to be called, otherwise undefined.
 */


Interpreter.prototype.setProperty = function (obj, name, value, opt_descriptor) {
  name = String(name);

  if (obj === undefined || obj === null) {
    this.throwException(this.TYPE_ERROR, "Cannot set property '" + name + "' of " + obj);
  }

  if (opt_descriptor && ('get' in opt_descriptor || 'set' in opt_descriptor) && ('value' in opt_descriptor || 'writable' in opt_descriptor)) {
    this.throwException(this.TYPE_ERROR, 'Invalid property descriptor. ' + 'Cannot both specify accessors and a value or writable attribute');
  }

  var strict = !this.stateStack || this.getScope().strict;

  if (!obj.isObject) {
    if (strict) {
      this.throwException(this.TYPE_ERROR, "Can't create property '" + name + "' on '" + obj + "'");
    }

    return;
  }

  if (this.isa(obj, this.STRING)) {
    var n = Interpreter.legalArrayIndex(name);

    if (name === 'length' || !isNaN(n) && n < String(obj).length) {
      if (strict) {
        this.throwException(this.TYPE_ERROR, "Cannot assign to read only " + "property '" + name + "' of String '" + obj.data + "'");
      }

      return;
    }
  }

  if (obj["class"] === 'Array') {
    var length = obj.properties.length;
    var i;

    if (name === 'length') {
      if (opt_descriptor) {
        if (!('value' in opt_descriptor)) {
          return;
        }

        value = opt_descriptor.value;
      }

      value = Interpreter.legalArrayLength(value);

      if (isNaN(value)) {
        this.throwException(this.RANGE_ERROR, 'Invalid array length');
      }

      if (value < length) {
        for (i in obj.properties) {
          i = Interpreter.legalArrayIndex(i);

          if (!isNaN(i) && value <= i) {
            delete obj.properties[i];
          }
        }
      }
    } else if (!isNaN(i = Interpreter.legalArrayIndex(name))) {
      obj.properties.length = Math.max(length, i + 1);
    }
  }

  if (obj.preventExtensions && !(name in obj.properties)) {
    if (strict) {
      this.throwException(this.TYPE_ERROR, "Can't add property '" + name + "', object is not extensible");
    }

    return;
  }

  if (opt_descriptor) {
    if ('get' in opt_descriptor) {
      if (opt_descriptor.get) {
        obj.getter[name] = opt_descriptor.get;
      } else {
        delete obj.getter[name];
      }
    }

    if ('set' in opt_descriptor) {
      if (opt_descriptor.set) {
        obj.setter[name] = opt_descriptor.set;
      } else {
        delete obj.setter[name];
      }
    }

    var descriptor = {};

    if ('configurable' in opt_descriptor) {
      descriptor.configurable = opt_descriptor.configurable;
    }

    if ('enumerable' in opt_descriptor) {
      descriptor.enumerable = opt_descriptor.enumerable;
    }

    if ('writable' in opt_descriptor) {
      descriptor.writable = opt_descriptor.writable;
      delete obj.getter[name];
      delete obj.setter[name];
    }

    if ('value' in opt_descriptor) {
      descriptor.value = opt_descriptor.value;
      delete obj.getter[name];
      delete obj.setter[name];
    } else if (value !== Interpreter.VALUE_IN_DESCRIPTOR) {
      descriptor.value = value;
      delete obj.getter[name];
      delete obj.setter[name];
    }

    try {
      Object.defineProperty(obj.properties, name, descriptor);
    } catch (e) {
      this.throwException(this.TYPE_ERROR, 'Cannot redefine property: ' + name);
    }
  } else {
    if (value === Interpreter.VALUE_IN_DESCRIPTOR) {
      throw ReferenceError('Value not specified.');
    }

    var defObj = obj;

    while (!(name in defObj.properties)) {
      defObj = this.getPrototype(defObj);

      if (!defObj) {
        defObj = obj;
        break;
      }
    }

    if (defObj.setter && defObj.setter[name]) {
      return defObj.setter[name];
    }

    if (defObj.getter && defObj.getter[name]) {
      if (strict) {
        this.throwException(this.TYPE_ERROR, "Cannot set property '" + name + "' of object '" + obj + "' which only has a getter");
      }
    } else {
      try {
        obj.properties[name] = value;
      } catch (e) {
        if (strict) {
          this.throwException(this.TYPE_ERROR, "Cannot assign to read only " + "property '" + name + "' of object '" + obj + "'");
        }
      }
    }
  }
};
/**
 * Convenience method for adding a native function as a non-enumerable property
 * onto an object's prototype.
 * @param {!Interpreter.Object} obj Data object.
 * @param {Interpreter.Value} name Name of property.
 * @param {!Function} wrapper Function object.
 */


Interpreter.prototype.setNativeFunctionPrototype = function (obj, name, wrapper) {
  this.setProperty(obj.properties['prototype'], name, this.createNativeFunction(wrapper, false), Interpreter.NONENUMERABLE_DESCRIPTOR);
};
/**
 * Convenience method for adding an async function as a non-enumerable property
 * onto an object's prototype.
 * @param {!Interpreter.Object} obj Data object.
 * @param {Interpreter.Value} name Name of property.
 * @param {!Function} wrapper Function object.
 */


Interpreter.prototype.setAsyncFunctionPrototype = function (obj, name, wrapper) {
  this.setProperty(obj.properties['prototype'], name, this.createAsyncFunction(wrapper), Interpreter.NONENUMERABLE_DESCRIPTOR);
};
/**
 * Returns the current scope from the stateStack.
 * @return {!Interpreter.Object} Current scope dictionary.
 */


Interpreter.prototype.getScope = function () {
  var scope = this.stateStack[this.stateStack.length - 1].scope;

  if (!scope) {
    throw Error('No scope found.');
  }

  return scope;
};
/**
 * Create a new scope dictionary.
 * @param {!Object} node AST node defining the scope container
 *     (e.g. a function).
 * @param {Interpreter.Object} parentScope Scope to link to.
 * @return {!Interpreter.Object} New scope.
 */


Interpreter.prototype.createScope = function (node, parentScope) {
  var scope = this.createObjectProto(null);
  scope.parentScope = parentScope;

  if (!parentScope) {
    this.initGlobalScope(scope);
  }

  this.populateScope_(node, scope);
  scope.strict = false;

  if (parentScope && parentScope.strict) {
    scope.strict = true;
  } else {
    var firstNode = node['body'] && node['body'][0];

    if (firstNode && firstNode.expression && firstNode.expression['type'] === 'Literal' && firstNode.expression.value === 'use strict') {
      scope.strict = true;
    }
  }

  return scope;
};
/**
 * Create a new special scope dictionary. Similar to createScope(), but
 * doesn't assume that the scope is for a function body.
 * This is used for 'catch' clauses and 'with' statements.
 * @param {!Interpreter.Object} parentScope Scope to link to.
 * @param {Interpreter.Object=} opt_scope Optional object to transform into
 *     scope.
 * @return {!Interpreter.Object} New scope.
 */


Interpreter.prototype.createSpecialScope = function (parentScope, opt_scope) {
  if (!parentScope) {
    throw Error('parentScope required');
  }

  var scope = opt_scope || this.createObjectProto(null);
  scope.parentScope = parentScope;
  scope.strict = parentScope.strict;
  return scope;
};
/**
 * Retrieves a value from the scope chain.
 * @param {string} name Name of variable.
 * @return {Interpreter.Value} Any value.
 *   May be flagged as being a getter and thus needing immediate execution
 *   (rather than being the value of the property).
 */


Interpreter.prototype.getValueFromScope = function (name) {
  var scope = this.getScope();

  while (scope && scope !== this.global) {
    if (name in scope.properties) {
      return scope.properties[name];
    }

    scope = scope.parentScope;
  }

  if (scope === this.global && this.hasProperty(scope, name)) {
    return this.getProperty(scope, name);
  }

  var prevNode = this.stateStack[this.stateStack.length - 1].node;

  if (prevNode['type'] === 'UnaryExpression' && prevNode['operator'] === 'typeof') {
    return undefined;
  }

  this.throwException(this.REFERENCE_ERROR, name + ' is not defined');
};
/**
 * Sets a value to the current scope.
 * @param {string} name Name of variable.
 * @param {Interpreter.Value} value Value.
 * @return {!Interpreter.Object|undefined} Returns a setter function if one
 *     needs to be called, otherwise undefined.
 */


Interpreter.prototype.setValueToScope = function (name, value) {
  var scope = this.getScope();
  var strict = scope.strict;

  while (scope && scope !== this.global) {
    if (name in scope.properties) {
      scope.properties[name] = value;
      return undefined;
    }

    scope = scope.parentScope;
  }

  if (scope === this.global && (!strict || this.hasProperty(scope, name))) {
    return this.setProperty(scope, name, value);
  }

  this.throwException(this.REFERENCE_ERROR, name + ' is not defined');
};
/**
 * Create a new scope for the given node.
 * @param {!Object} node AST node (program or function).
 * @param {!Interpreter.Object} scope Scope dictionary to populate.
 * @private
 */


Interpreter.prototype.populateScope_ = function (node, scope) {
  if (node['type'] === 'VariableDeclaration') {
    for (var i = 0; i < node['declarations'].length; i++) {
      this.setProperty(scope, node['declarations'][i]['id']['name'], undefined, Interpreter.VARIABLE_DESCRIPTOR);
    }
  } else if (node['type'] === 'FunctionDeclaration') {
    this.setProperty(scope, node['id']['name'], this.createFunction(node, scope), Interpreter.VARIABLE_DESCRIPTOR);
    return;
  } else if (node['type'] === 'FunctionExpression') {
    return;
  } else if (node['type'] === 'ExpressionStatement') {
    return;
  }

  var nodeClass = node['constructor'];

  for (var name in node) {
    var prop = node[name];

    if (prop && _typeof(prop) === 'object') {
      if (Array.isArray(prop)) {
        for (var i = 0; i < prop.length; i++) {
          if (prop[i] && prop[i].constructor === nodeClass) {
            this.populateScope_(prop[i], scope);
          }
        }
      } else {
        if (prop.constructor === nodeClass) {
          this.populateScope_(prop, scope);
        }
      }
    }
  }
};
/**
 * Remove start and end values from AST, or set start and end values to a
 * constant value.  Used to remove highlighting from polyfills and to set
 * highlighting in an eval to cover the entire eval expression.
 * @param {!Object} node AST node.
 * @param {number=} start Starting character of all nodes, or undefined.
 * @param {number=} end Ending character of all nodes, or undefined.
 * @private
 */


Interpreter.prototype.stripLocations_ = function (node, start, end) {
  if (start) {
    node['start'] = start;
  } else {
    delete node['start'];
  }

  if (end) {
    node['end'] = end;
  } else {
    delete node['end'];
  }

  for (var name in node) {
    if (node.hasOwnProperty(name)) {
      var prop = node[name];

      if (prop && _typeof(prop) === 'object') {
        this.stripLocations_(prop, start, end);
      }
    }
  }
};
/**
 * Is the current state directly being called with as a construction with 'new'.
 * @return {boolean} True if 'new foo()', false if 'foo()'.
 */


Interpreter.prototype.calledWithNew = function () {
  return this.stateStack[this.stateStack.length - 1].isConstructor;
};
/**
 * Gets a value from the scope chain or from an object property.
 * @param {!Array} ref Name of variable or object/propname tuple.
 * @return {Interpreter.Value} Any value.
 *   May be flagged as being a getter and thus needing immediate execution
 *   (rather than being the value of the property).
 */


Interpreter.prototype.getValue = function (ref) {
  if (ref[0] === Interpreter.SCOPE_REFERENCE) {
    return this.getValueFromScope(ref[1]);
  } else {
    return this.getProperty(ref[0], ref[1]);
  }
};
/**
 * Sets a value to the scope chain or to an object property.
 * @param {!Array} ref Name of variable or object/propname tuple.
 * @param {Interpreter.Value} value Value.
 * @return {!Interpreter.Object|undefined} Returns a setter function if one
 *     needs to be called, otherwise undefined.
 */


Interpreter.prototype.setValue = function (ref, value) {
  if (ref[0] === Interpreter.SCOPE_REFERENCE) {
    return this.setValueToScope(ref[1], value);
  } else {
    return this.setProperty(ref[0], ref[1], value);
  }
};
/**
  * Completion Value Types.
  * @enum {number}
  */


Interpreter.Completion = {
  NORMAL: 0,
  BREAK: 1,
  CONTINUE: 2,
  RETURN: 3,
  THROW: 4
};
/**
 * Throw an exception in the interpreter that can be handled by an
 * interpreter try/catch statement.  If unhandled, a real exception will
 * be thrown.  Can be called with either an error class and a message, or
 * with an actual object to be thrown.
 * @param {!Interpreter.Object} errorClass Type of error (if message is
 *   provided) or the value to throw (if no message).
 * @param {string=} opt_message Message being thrown.
 */

Interpreter.prototype.throwException = function (errorClass, opt_message) {
  if (opt_message === undefined) {
    var error = errorClass;
  } else {
    var error = this.createObject(errorClass);
    this.setProperty(error, 'message', opt_message, Interpreter.NONENUMERABLE_DESCRIPTOR);
  }

  this.unwind(Interpreter.Completion.THROW, error, undefined);
  throw Interpreter.STEP_ERROR;
};
/**
 * Unwind the stack to the innermost relevant enclosing TryStatement,
 * For/ForIn/WhileStatement or Call/NewExpression.  If this results in
 * the stack being completely unwound the thread will be terminated
 * and the appropriate error being thrown.
 * @param {Interpreter.Completion} type Completion type.
 * @param {Interpreter.Value} value Value computed, returned or thrown.
 * @param {string|undefined} label Target label for break or return.
 */


Interpreter.prototype.unwind = function (type, value, label) {
  if (type === Interpreter.Completion.NORMAL) {
    throw TypeError('Should not unwind for NORMAL completions');
  }

  for (var stack = this.stateStack; stack.length > 0; stack.pop()) {
    var state = stack[stack.length - 1];

    switch (state.node['type']) {
      case 'TryStatement':
        state.cv = {
          type: type,
          value: value,
          label: label
        };
        return;

      case 'CallExpression':
      case 'NewExpression':
        if (type === Interpreter.Completion.RETURN) {
          state.value = value;
          return;
        } else if (type !== Interpreter.Completion.THROW) {
          throw Error('Unsynatctic break/continue not rejected by Acorn');
        }

    }

    if (type === Interpreter.Completion.BREAK) {
      if (label ? state.labels && state.labels.indexOf(label) !== -1 : state.isLoop || state.isSwitch) {
        stack.pop();
        return;
      }
    } else if (type === Interpreter.Completion.CONTINUE) {
      if (label ? state.labels && state.labels.indexOf(label) !== -1 : state.isLoop) {
        return;
      }
    }
  }

  var realError;

  if (this.isa(value, this.ERROR)) {
    var errorTable = {
      'EvalError': EvalError,
      'RangeError': RangeError,
      'ReferenceError': ReferenceError,
      'SyntaxError': SyntaxError,
      'TypeError': TypeError,
      'URIError': URIError
    };
    var name = String(this.getProperty(value, 'name'));
    var message = this.getProperty(value, 'message').valueOf();
    var errorConstructor = errorTable[name] || Error;
    realError = errorConstructor(message);
  } else {
    realError = String(value);
  }

  throw realError;
};
/**
 * Create a call to a getter function.
 * @param {!Interpreter.Object} func Function to execute.
 * @param {!Interpreter.Object|!Array} left
 *     Name of variable or object/propname tuple.
 * @private
 */


Interpreter.prototype.createGetter_ = function (func, left) {
  var funcThis = Array.isArray(left) ? left[0] : left;
  var node = new this.nodeConstructor({
    options: {}
  });
  node['type'] = 'CallExpression';
  var state = new Interpreter.State(node, this.stateStack[this.stateStack.length - 1].scope);
  state.doneCallee_ = true;
  state.funcThis_ = funcThis;
  state.func_ = func;
  state.doneArgs_ = true;
  state.arguments_ = [];
  return state;
};
/**
 * Create a call to a setter function.
 * @param {!Interpreter.Object} func Function to execute.
 * @param {!Interpreter.Object|!Array} left
 *     Name of variable or object/propname tuple.
 * @param {Interpreter.Value} value Value to set.
 * @private
 */


Interpreter.prototype.createSetter_ = function (func, left, value) {
  var funcThis = Array.isArray(left) ? left[0] : this.global;
  var node = new this.nodeConstructor({
    options: {}
  });
  node['type'] = 'CallExpression';
  var state = new Interpreter.State(node, this.stateStack[this.stateStack.length - 1].scope);
  state.doneCallee_ = true;
  state.funcThis_ = funcThis;
  state.func_ = func;
  state.doneArgs_ = true;
  state.arguments_ = [value];
  return state;
};
/**
 * Class for a state.
 * @param {!Object} node AST node for the state.
 * @param {!Interpreter.Object} scope Scope object for the state.
 * @constructor
 */


Interpreter.State = function (node, scope) {
  this.node = node;
  this.scope = scope;
};

Interpreter.prototype['stepArrayExpression'] = function (stack, state, node) {
  var elements = node['elements'];
  var n = state.n_ || 0;

  if (!state.array_) {
    state.array_ = this.createObjectProto(this.ARRAY_PROTO);
    state.array_.properties.length = elements.length;
  } else {
    this.setProperty(state.array_, n, state.value);
    n++;
  }

  while (n < elements.length) {
    if (elements[n]) {
      state.n_ = n;
      return new Interpreter.State(elements[n], state.scope);
    }

    n++;
  }

  stack.pop();
  stack[stack.length - 1].value = state.array_;
};

Interpreter.prototype['stepAssignmentExpression'] = function (stack, state, node) {
  if (!state.doneLeft_) {
    state.doneLeft_ = true;
    var nextState = new Interpreter.State(node['left'], state.scope);
    nextState.components = true;
    return nextState;
  }

  if (!state.doneRight_) {
    if (!state.leftReference_) {
      state.leftReference_ = state.value;
    }

    if (state.doneGetter_) {
      state.leftValue_ = state.value;
    }

    if (!state.doneGetter_ && node['operator'] !== '=') {
      var leftValue = this.getValue(state.leftReference_);
      state.leftValue_ = leftValue;

      if (leftValue && _typeof(leftValue) === 'object' && leftValue.isGetter) {
        leftValue.isGetter = false;
        state.doneGetter_ = true;
        var func =
        /** @type {!Interpreter.Object} */
        leftValue;
        return this.createGetter_(func, state.leftReference_);
      }
    }

    state.doneRight_ = true;
    return new Interpreter.State(node['right'], state.scope);
  }

  if (state.doneSetter_) {
    stack.pop();
    stack[stack.length - 1].value = state.setterValue_;
    return;
  }

  var value = state.leftValue_;
  var rightValue = state.value;

  switch (node['operator']) {
    case '=':
      value = rightValue;
      break;

    case '+=':
      value += rightValue;
      break;

    case '-=':
      value -= rightValue;
      break;

    case '*=':
      value *= rightValue;
      break;

    case '/=':
      value /= rightValue;
      break;

    case '%=':
      value %= rightValue;
      break;

    case '<<=':
      value <<= rightValue;
      break;

    case '>>=':
      value >>= rightValue;
      break;

    case '>>>=':
      value >>>= rightValue;
      break;

    case '&=':
      value &= rightValue;
      break;

    case '^=':
      value ^= rightValue;
      break;

    case '|=':
      value |= rightValue;
      break;

    default:
      throw SyntaxError('Unknown assignment expression: ' + node['operator']);
  }

  var setter = this.setValue(state.leftReference_, value);

  if (setter) {
    state.doneSetter_ = true;
    state.setterValue_ = value;
    return this.createSetter_(setter, state.leftReference_, value);
  }

  stack.pop();
  stack[stack.length - 1].value = value;
};

Interpreter.prototype['stepBinaryExpression'] = function (stack, state, node) {
  if (!state.doneLeft_) {
    state.doneLeft_ = true;
    return new Interpreter.State(node['left'], state.scope);
  }

  if (!state.doneRight_) {
    state.doneRight_ = true;
    state.leftValue_ = state.value;
    return new Interpreter.State(node['right'], state.scope);
  }

  stack.pop();
  var leftValue = state.leftValue_;
  var rightValue = state.value;
  var value;

  switch (node['operator']) {
    case '==':
      value = leftValue == rightValue;
      break;

    case '!=':
      value = leftValue != rightValue;
      break;

    case '===':
      value = leftValue === rightValue;
      break;

    case '!==':
      value = leftValue !== rightValue;
      break;

    case '>':
      value = leftValue > rightValue;
      break;

    case '>=':
      value = leftValue >= rightValue;
      break;

    case '<':
      value = leftValue < rightValue;
      break;

    case '<=':
      value = leftValue <= rightValue;
      break;

    case '+':
      value = leftValue + rightValue;
      break;

    case '-':
      value = leftValue - rightValue;
      break;

    case '*':
      value = leftValue * rightValue;
      break;

    case '/':
      value = leftValue / rightValue;
      break;

    case '%':
      value = leftValue % rightValue;
      break;

    case '&':
      value = leftValue & rightValue;
      break;

    case '|':
      value = leftValue | rightValue;
      break;

    case '^':
      value = leftValue ^ rightValue;
      break;

    case '<<':
      value = leftValue << rightValue;
      break;

    case '>>':
      value = leftValue >> rightValue;
      break;

    case '>>>':
      value = leftValue >>> rightValue;
      break;

    case 'in':
      if (!rightValue || !rightValue.isObject) {
        this.throwException(this.TYPE_ERROR, "'in' expects an object, not '" + rightValue + "'");
      }

      value = this.hasProperty(rightValue, leftValue);
      break;

    case 'instanceof':
      if (!this.isa(rightValue, this.FUNCTION)) {
        this.throwException(this.TYPE_ERROR, 'Right-hand side of instanceof is not an object');
      }

      value = leftValue.isObject ? this.isa(leftValue, rightValue) : false;
      break;

    default:
      throw SyntaxError('Unknown binary operator: ' + node['operator']);
  }

  stack[stack.length - 1].value = value;
};

Interpreter.prototype['stepBlockStatement'] = function (stack, state, node) {
  var n = state.n_ || 0;
  var expression = node['body'][n];

  if (expression) {
    state.n_ = n + 1;
    return new Interpreter.State(expression, state.scope);
  }

  stack.pop();
};

Interpreter.prototype['stepBreakStatement'] = function (stack, state, node) {
  var label = node['label'] && node['label']['name'];
  this.unwind(Interpreter.Completion.BREAK, undefined, label);
};

Interpreter.prototype['stepCallExpression'] = function (stack, state, node) {
  if (!state.doneCallee_) {
    state.doneCallee_ = 1;
    var nextState = new Interpreter.State(node['callee'], state.scope);
    nextState.components = true;
    return nextState;
  }

  if (state.doneCallee_ === 1) {
    state.doneCallee_ = 2;
    var func = state.value;

    if (Array.isArray(func)) {
      state.func_ = this.getValue(func);

      if (func[0] === Interpreter.SCOPE_REFERENCE) {
        state.directEval_ = func[1] === 'eval';
      } else {
        state.funcThis_ = func[0];
      }

      func = state.func_;

      if (func && _typeof(func) === 'object' && func.isGetter) {
        func.isGetter = false;
        state.doneCallee_ = 1;
        return this.createGetter_(
        /** @type {!Interpreter.Object} */
        func, state.value);
      }
    } else {
      state.func_ = func;
    }

    state.arguments_ = [];
    state.n_ = 0;
  }

  var func = state.func_;

  if (!state.doneArgs_) {
    if (state.n_ !== 0) {
      state.arguments_.push(state.value);
    }

    if (node['arguments'][state.n_]) {
      return new Interpreter.State(node['arguments'][state.n_++], state.scope);
    }

    if (node['type'] === 'NewExpression') {
      if (func.illegalConstructor) {
        this.throwException(this.TYPE_ERROR, func + ' is not a constructor');
      }

      var proto = func.properties['prototype'];

      if (_typeof(proto) !== 'object' || proto === null) {
        proto = this.OBJECT_PROTO;
      }

      state.funcThis_ = this.createObjectProto(proto);
      state.isConstructor = true;
    } else if (state.funcThis_ === undefined) {
      state.funcThis_ = state.scope.strict ? undefined : this.global;
    }

    state.doneArgs_ = true;
  }

  if (!state.doneExec_) {
    state.doneExec_ = true;

    if (!func || !func.isObject) {
      this.throwException(this.TYPE_ERROR, func + ' is not a function');
    }

    var funcNode = func.node;

    if (funcNode) {
      var scope = this.createScope(funcNode['body'], func.parentScope);

      for (var i = 0; i < funcNode['params'].length; i++) {
        var paramName = funcNode['params'][i]['name'];
        var paramValue = state.arguments_.length > i ? state.arguments_[i] : undefined;
        this.setProperty(scope, paramName, paramValue);
      }

      var argsList = this.createObjectProto(this.ARRAY_PROTO);

      for (var i = 0; i < state.arguments_.length; i++) {
        this.setProperty(argsList, i, state.arguments_[i]);
      }

      this.setProperty(scope, 'arguments', argsList);
      var name = funcNode['id'] && funcNode['id']['name'];

      if (name) {
        this.setProperty(scope, name, func);
      }

      this.setProperty(scope, 'this', state.funcThis_, Interpreter.READONLY_DESCRIPTOR);
      state.value = undefined;
      return new Interpreter.State(funcNode['body'], scope);
    } else if (func.eval) {
      var code = state.arguments_[0];

      if (typeof code !== 'string') {
        state.value = code;
      } else {
        try {
          var ast = _acorn["default"].parse(String(code), Interpreter.PARSE_OPTIONS);
        } catch (e) {
          this.throwException(this.SYNTAX_ERROR, 'Invalid code: ' + e.message);
        }

        var evalNode = new this.nodeConstructor({
          options: {}
        });
        evalNode['type'] = 'EvalProgram_';
        evalNode['body'] = ast['body'];
        this.stripLocations_(evalNode, node['start'], node['end']);
        var scope = state.directEval_ ? state.scope : this.global;

        if (scope.strict) {
          scope = this.createScope(ast, scope);
        } else {
          this.populateScope_(ast, scope);
        }

        this.value = undefined;
        return new Interpreter.State(evalNode, scope);
      }
    } else if (func.nativeFunc) {
      state.value = func.nativeFunc.apply(state.funcThis_, state.arguments_);
    } else if (func.asyncFunc) {
      var thisInterpreter = this;

      var callback = function callback(value) {
        state.value = value;
        thisInterpreter.paused_ = false;
      };

      var argLength = func.asyncFunc.length - 1;
      var argsWithCallback = state.arguments_.concat(new Array(argLength)).slice(0, argLength);
      argsWithCallback.push(callback);
      this.paused_ = true;
      func.asyncFunc.apply(state.funcThis_, argsWithCallback);
      return;
    } else {
      this.throwException(this.TYPE_ERROR, func["class"] + ' is not a function');
    }
  } else {
    stack.pop();

    if (state.isConstructor && _typeof(state.value) !== 'object') {
      stack[stack.length - 1].value = state.funcThis_;
    } else {
      stack[stack.length - 1].value = state.value;
    }
  }
};

Interpreter.prototype['stepCatchClause'] = function (stack, state, node) {
  if (!state.done_) {
    state.done_ = true;
    var scope = this.createSpecialScope(state.scope);
    this.setProperty(scope, node['param']['name'], state.throwValue);
    return new Interpreter.State(node['body'], scope);
  } else {
    stack.pop();
  }
};

Interpreter.prototype['stepConditionalExpression'] = function (stack, state, node) {
  var mode = state.mode_ || 0;

  if (mode === 0) {
    state.mode_ = 1;
    return new Interpreter.State(node['test'], state.scope);
  }

  if (mode === 1) {
    state.mode_ = 2;
    var value = Boolean(state.value);

    if (value && node['consequent']) {
      return new Interpreter.State(node['consequent'], state.scope);
    } else if (!value && node['alternate']) {
      return new Interpreter.State(node['alternate'], state.scope);
    }

    this.value = undefined;
  }

  stack.pop();

  if (node['type'] === 'ConditionalExpression') {
    stack[stack.length - 1].value = state.value;
  }
};

Interpreter.prototype['stepContinueStatement'] = function (stack, state, node) {
  var label = node['label'] && node['label']['name'];
  this.unwind(Interpreter.Completion.CONTINUE, undefined, label);
};

Interpreter.prototype['stepDebuggerStatement'] = function (stack, state, node) {
  stack.pop();
};

Interpreter.prototype['stepDoWhileStatement'] = function (stack, state, node) {
  if (node['type'] === 'DoWhileStatement' && state.test_ === undefined) {
    state.value = true;
    state.test_ = true;
  }

  if (!state.test_) {
    state.test_ = true;
    return new Interpreter.State(node['test'], state.scope);
  }

  if (!state.value) {
    stack.pop();
  } else if (node['body']) {
    state.test_ = false;
    state.isLoop = true;
    return new Interpreter.State(node['body'], state.scope);
  }
};

Interpreter.prototype['stepEmptyStatement'] = function (stack, state, node) {
  stack.pop();
};

Interpreter.prototype['stepEvalProgram_'] = function (stack, state, node) {
  var n = state.n_ || 0;
  var expression = node['body'][n];

  if (expression) {
    state.n_ = n + 1;
    return new Interpreter.State(expression, state.scope);
  }

  stack.pop();
  stack[stack.length - 1].value = this.value;
};

Interpreter.prototype['stepExpressionStatement'] = function (stack, state, node) {
  if (!state.done_) {
    state.done_ = true;
    return new Interpreter.State(node['expression'], state.scope);
  }

  stack.pop();
  this.value = state.value;
};

Interpreter.prototype['stepForInStatement'] = function (stack, state, node) {
  if (!state.doneInit_) {
    state.doneInit_ = true;

    if (node['left']['declarations'] && node['left']['declarations'][0]['init']) {
      if (state.scope.strict) {
        this.throwException(this.SYNTAX_ERROR, 'for-in loop variable declaration may not have an initializer.');
      }

      return new Interpreter.State(node['left'], state.scope);
    }
  }

  if (!state.doneObject_) {
    state.doneObject_ = true;

    if (!state.variable_) {
      state.variable_ = state.value;
    }

    return new Interpreter.State(node['right'], state.scope);
  }

  if (!state.isLoop) {
    state.isLoop = true;
    state.object_ = state.value;
    state.visited_ = Object.create(null);
  }

  if (state.name_ === undefined) {
    gotPropName: while (true) {
      if (state.object_ && state.object_.isObject) {
        if (!state.props_) {
          state.props_ = Object.getOwnPropertyNames(state.object_.properties);
        }

        while (true) {
          var prop = state.props_.shift();

          if (prop === undefined) {
            break;
          }

          if (!Object.prototype.hasOwnProperty.call(state.object_.properties, prop)) {
            continue;
          }

          if (state.visited_[prop]) {
            continue;
          }

          state.visited_[prop] = true;

          if (!Object.prototype.propertyIsEnumerable.call(state.object_.properties, prop)) {
            continue;
          }

          state.name_ = prop;
          break gotPropName;
        }
      } else if (state.object_ !== null && state.object_ !== undefined) {
        if (!state.props_) {
          state.props_ = Object.getOwnPropertyNames(state.object_);
        }

        while (true) {
          var prop = state.props_.shift();

          if (prop === undefined) {
            break;
          }

          state.visited_[prop] = true;

          if (!Object.prototype.propertyIsEnumerable.call(state.object_, prop)) {
            continue;
          }

          state.name_ = prop;
          break gotPropName;
        }
      }

      state.object_ = this.getPrototype(state.object_);
      state.props_ = null;

      if (state.object_ === null) {
        stack.pop();
        return;
      }
    }
  }

  if (!state.doneVariable_) {
    state.doneVariable_ = true;
    var left = node['left'];

    if (left['type'] === 'VariableDeclaration') {
      state.variable_ = [Interpreter.SCOPE_REFERENCE, left['declarations'][0]['id']['name']];
    } else {
      state.variable_ = null;
      var nextState = new Interpreter.State(left, state.scope);
      nextState.components = true;
      return nextState;
    }
  }

  if (!state.variable_) {
    state.variable_ = state.value;
  }

  if (!state.doneSetter_) {
    state.doneSetter_ = true;
    var value = state.name_;
    var setter = this.setValue(state.variable_, value);

    if (setter) {
      return this.createSetter_(setter, state.variable_, value);
    }
  }

  state.name_ = undefined;
  state.doneVariable_ = false;
  state.doneSetter_ = false;

  if (node['body']) {
    return new Interpreter.State(node['body'], state.scope);
  }
};

Interpreter.prototype['stepForStatement'] = function (stack, state, node) {
  var mode = state.mode_ || 0;

  if (mode === 0) {
    state.mode_ = 1;

    if (node['init']) {
      return new Interpreter.State(node['init'], state.scope);
    }
  } else if (mode === 1) {
    state.mode_ = 2;

    if (node['test']) {
      return new Interpreter.State(node['test'], state.scope);
    }
  } else if (mode === 2) {
    state.mode_ = 3;

    if (node['test'] && !state.value) {
      stack.pop();
    } else {
      state.isLoop = true;
      return new Interpreter.State(node['body'], state.scope);
    }
  } else if (mode === 3) {
    state.mode_ = 1;

    if (node['update']) {
      return new Interpreter.State(node['update'], state.scope);
    }
  }
};

Interpreter.prototype['stepFunctionDeclaration'] = function (stack, state, node) {
  stack.pop();
};

Interpreter.prototype['stepFunctionExpression'] = function (stack, state, node) {
  stack.pop();
  stack[stack.length - 1].value = this.createFunction(node, state.scope);
};

Interpreter.prototype['stepIdentifier'] = function (stack, state, node) {
  stack.pop();

  if (state.components) {
    stack[stack.length - 1].value = [Interpreter.SCOPE_REFERENCE, node['name']];
    return;
  }

  var value = this.getValueFromScope(node['name']);

  if (value && _typeof(value) === 'object' && value.isGetter) {
    value.isGetter = false;
    var scope = state.scope;

    while (!this.hasProperty(scope, node['name'])) {
      scope = scope.parentScope;
    }

    var func =
    /** @type {!Interpreter.Object} */
    value;
    return this.createGetter_(func, this.global);
  }

  stack[stack.length - 1].value = value;
};

Interpreter.prototype['stepIfStatement'] = Interpreter.prototype['stepConditionalExpression'];

Interpreter.prototype['stepLabeledStatement'] = function (stack, state, node) {
  stack.pop();
  var labels = state.labels || [];
  labels.push(node['label']['name']);
  var nextState = new Interpreter.State(node['body'], state.scope);
  nextState.labels = labels;
  return nextState;
};

Interpreter.prototype['stepLiteral'] = function (stack, state, node) {
  stack.pop();
  var value = node['value'];

  if (value instanceof RegExp) {
    var pseudoRegexp = this.createObjectProto(this.REGEXP_PROTO);
    this.populateRegExp(pseudoRegexp, value);
    value = pseudoRegexp;
  }

  stack[stack.length - 1].value = value;
};

Interpreter.prototype['stepLogicalExpression'] = function (stack, state, node) {
  if (node['operator'] !== '&&' && node['operator'] !== '||') {
    throw SyntaxError('Unknown logical operator: ' + node['operator']);
  }

  if (!state.doneLeft_) {
    state.doneLeft_ = true;
    return new Interpreter.State(node['left'], state.scope);
  }

  if (!state.doneRight_) {
    if (node['operator'] === '&&' && !state.value || node['operator'] === '||' && state.value) {
      stack.pop();
      stack[stack.length - 1].value = state.value;
    } else {
      state.doneRight_ = true;
      return new Interpreter.State(node['right'], state.scope);
    }
  } else {
    stack.pop();
    stack[stack.length - 1].value = state.value;
  }
};

Interpreter.prototype['stepMemberExpression'] = function (stack, state, node) {
  if (!state.doneObject_) {
    state.doneObject_ = true;
    return new Interpreter.State(node['object'], state.scope);
  }

  var propName;

  if (!node['computed']) {
    state.object_ = state.value;
    propName = node['property']['name'];
  } else if (!state.doneProperty_) {
    state.object_ = state.value;
    state.doneProperty_ = true;
    return new Interpreter.State(node['property'], state.scope);
  } else {
    propName = state.value;
  }

  stack.pop();

  if (state.components) {
    stack[stack.length - 1].value = [state.object_, propName];
  } else {
    var value = this.getProperty(state.object_, propName);

    if (value && _typeof(value) === 'object' && value.isGetter) {
      value.isGetter = false;
      var func =
      /** @type {!Interpreter.Object} */
      value;
      return this.createGetter_(func, state.object_);
    }

    stack[stack.length - 1].value = value;
  }
};

Interpreter.prototype['stepNewExpression'] = Interpreter.prototype['stepCallExpression'];

Interpreter.prototype['stepObjectExpression'] = function (stack, state, node) {
  var n = state.n_ || 0;
  var property = node['properties'][n];

  if (!state.object_) {
    state.object_ = this.createObjectProto(this.OBJECT_PROTO);
    state.properties_ = Object.create(null);
  } else {
    var key = property['key'];

    if (key['type'] === 'Identifier') {
      var propName = key['name'];
    } else if (key['type'] === 'Literal') {
      var propName = key['value'];
    } else {
      throw SyntaxError('Unknown object structure: ' + key['type']);
    }

    if (!state.properties_[propName]) {
      state.properties_[propName] = {};
    }

    state.properties_[propName][property['kind']] = state.value;
    state.n_ = ++n;
    property = node['properties'][n];
  }

  if (property) {
    return new Interpreter.State(property['value'], state.scope);
  }

  for (var key in state.properties_) {
    var kinds = state.properties_[key];

    if ('get' in kinds || 'set' in kinds) {
      var descriptor = {
        configurable: true,
        enumerable: true,
        get: kinds['get'],
        set: kinds['set']
      };
      this.setProperty(state.object_, key, null, descriptor);
    } else {
      this.setProperty(state.object_, key, kinds['init']);
    }
  }

  stack.pop();
  stack[stack.length - 1].value = state.object_;
};

Interpreter.prototype['stepProgram'] = function (stack, state, node) {
  var expression = node['body'].shift();

  if (expression) {
    state.done = false;
    return new Interpreter.State(expression, state.scope);
  }

  state.done = true;
};

Interpreter.prototype['stepReturnStatement'] = function (stack, state, node) {
  if (node['argument'] && !state.done_) {
    state.done_ = true;
    return new Interpreter.State(node['argument'], state.scope);
  }

  this.unwind(Interpreter.Completion.RETURN, state.value, undefined);
};

Interpreter.prototype['stepSequenceExpression'] = function (stack, state, node) {
  var n = state.n_ || 0;
  var expression = node['expressions'][n];

  if (expression) {
    state.n_ = n + 1;
    return new Interpreter.State(expression, state.scope);
  }

  stack.pop();
  stack[stack.length - 1].value = state.value;
};

Interpreter.prototype['stepSwitchStatement'] = function (stack, state, node) {
  if (!state.test_) {
    state.test_ = 1;
    return new Interpreter.State(node['discriminant'], state.scope);
  }

  if (state.test_ === 1) {
    state.test_ = 2;
    state.switchValue_ = state.value;
    state.defaultCase_ = -1;
  }

  while (true) {
    var index = state.index_ || 0;
    var switchCase = node['cases'][index];

    if (!state.matched_ && switchCase && !switchCase['test']) {
      state.defaultCase_ = index;
      state.index_ = index + 1;
      continue;
    }

    if (!switchCase && !state.matched_ && state.defaultCase_ !== -1) {
      state.matched_ = true;
      state.index_ = state.defaultCase_;
      continue;
    }

    if (switchCase) {
      if (!state.matched_ && !state.tested_ && switchCase['test']) {
        state.tested_ = true;
        return new Interpreter.State(switchCase['test'], state.scope);
      }

      if (state.matched_ || state.value === state.switchValue_) {
        state.matched_ = true;
        var n = state.n_ || 0;

        if (switchCase['consequent'][n]) {
          state.isSwitch = true;
          state.n_ = n + 1;
          return new Interpreter.State(switchCase['consequent'][n], state.scope);
        }
      }

      state.tested_ = false;
      state.n_ = 0;
      state.index_ = index + 1;
    } else {
      stack.pop();
      return;
    }
  }
};

Interpreter.prototype['stepThisExpression'] = function (stack, state, node) {
  stack.pop();
  stack[stack.length - 1].value = this.getValueFromScope('this');
};

Interpreter.prototype['stepThrowStatement'] = function (stack, state, node) {
  if (!state.done_) {
    state.done_ = true;
    return new Interpreter.State(node['argument'], state.scope);
  } else {
    this.throwException(state.value);
  }
};

Interpreter.prototype['stepTryStatement'] = function (stack, state, node) {
  if (!state.doneBlock_) {
    state.doneBlock_ = true;
    return new Interpreter.State(node['block'], state.scope);
  }

  if (state.cv && state.cv.type === Interpreter.Completion.THROW && !state.doneHandler_ && node['handler']) {
    state.doneHandler_ = true;
    var nextState = new Interpreter.State(node['handler'], state.scope);
    nextState.throwValue = state.cv.value;
    state.cv = undefined;
    return nextState;
  }

  if (!state.doneFinalizer_ && node['finalizer']) {
    state.doneFinalizer_ = true;
    return new Interpreter.State(node['finalizer'], state.scope);
  }

  stack.pop();

  if (state.cv) {
    this.unwind(state.cv.type, state.cv.value, state.cv.label);
  }
};

Interpreter.prototype['stepUnaryExpression'] = function (stack, state, node) {
  if (!state.done_) {
    state.done_ = true;
    var nextState = new Interpreter.State(node['argument'], state.scope);
    nextState.components = node['operator'] === 'delete';
    return nextState;
  }

  stack.pop();
  var value = state.value;

  if (node['operator'] === '-') {
    value = -value;
  } else if (node['operator'] === '+') {
    value = +value;
  } else if (node['operator'] === '!') {
    value = !value;
  } else if (node['operator'] === '~') {
    value = ~value;
  } else if (node['operator'] === 'delete') {
    var result = true;

    if (Array.isArray(value)) {
      var obj = value[0];

      if (obj === Interpreter.SCOPE_REFERENCE) {
        obj = state.scope;
      }

      var name = String(value[1]);

      try {
        delete obj.properties[name];
      } catch (e) {
        if (state.scope.strict) {
          this.throwException(this.TYPE_ERROR, "Cannot delete property '" + name + "' of '" + obj + "'");
        } else {
          result = false;
        }
      }
    }

    value = result;
  } else if (node['operator'] === 'typeof') {
    value = value && value["class"] === 'Function' ? 'function' : _typeof(value);
  } else if (node['operator'] === 'void') {
    value = undefined;
  } else {
    throw SyntaxError('Unknown unary operator: ' + node['operator']);
  }

  stack[stack.length - 1].value = value;
};

Interpreter.prototype['stepUpdateExpression'] = function (stack, state, node) {
  if (!state.doneLeft_) {
    state.doneLeft_ = true;
    var nextState = new Interpreter.State(node['argument'], state.scope);
    nextState.components = true;
    return nextState;
  }

  if (!state.leftSide_) {
    state.leftSide_ = state.value;
  }

  if (state.doneGetter_) {
    state.leftValue_ = state.value;
  }

  if (!state.doneGetter_) {
    var leftValue = this.getValue(state.leftSide_);
    state.leftValue_ = leftValue;

    if (leftValue && _typeof(leftValue) === 'object' && leftValue.isGetter) {
      leftValue.isGetter = false;
      state.doneGetter_ = true;
      var func =
      /** @type {!Interpreter.Object} */
      leftValue;
      return this.createGetter_(func, state.leftSide_);
    }
  }

  if (state.doneSetter_) {
    stack.pop();
    stack[stack.length - 1].value = state.setterValue_;
    return;
  }

  var leftValue = Number(state.leftValue_);
  var changeValue;

  if (node['operator'] === '++') {
    changeValue = leftValue + 1;
  } else if (node['operator'] === '--') {
    changeValue = leftValue - 1;
  } else {
    throw SyntaxError('Unknown update expression: ' + node['operator']);
  }

  var returnValue = node['prefix'] ? changeValue : leftValue;
  var setter = this.setValue(state.leftSide_, changeValue);

  if (setter) {
    state.doneSetter_ = true;
    state.setterValue_ = returnValue;
    return this.createSetter_(setter, state.leftSide_, changeValue);
  }

  stack.pop();
  stack[stack.length - 1].value = returnValue;
};

Interpreter.prototype['stepVariableDeclaration'] = function (stack, state, node) {
  var declarations = node['declarations'];
  var n = state.n_ || 0;
  var declarationNode = declarations[n];

  if (state.init_ && declarationNode) {
    this.setValueToScope(declarationNode['id']['name'], state.value);
    state.init_ = false;
    declarationNode = declarations[++n];
  }

  while (declarationNode) {
    if (declarationNode['init']) {
      state.n_ = n;
      state.init_ = true;
      return new Interpreter.State(declarationNode['init'], state.scope);
    }

    declarationNode = declarations[++n];
  }

  stack.pop();
};

Interpreter.prototype['stepWithStatement'] = function (stack, state, node) {
  if (!state.doneObject_) {
    state.doneObject_ = true;
    return new Interpreter.State(node['object'], state.scope);
  } else if (!state.doneBody_) {
    state.doneBody_ = true;
    var scope = this.createSpecialScope(state.scope, state.value);
    return new Interpreter.State(node['body'], scope);
  } else {
    stack.pop();
  }
};

Interpreter.prototype['stepWhileStatement'] = Interpreter.prototype['stepDoWhileStatement'];
var _default = Interpreter;
exports["default"] = _default;
Interpreter.prototype['step'] = Interpreter.prototype.step;
Interpreter.prototype['run'] = Interpreter.prototype.run;
Interpreter.prototype['appendCode'] = Interpreter.prototype.appendCode;
Interpreter.prototype['createObject'] = Interpreter.prototype.createObject;
Interpreter.prototype['createObjectProto'] = Interpreter.prototype.createObjectProto;
Interpreter.prototype['createAsyncFunction'] = Interpreter.prototype.createAsyncFunction;
Interpreter.prototype['createNativeFunction'] = Interpreter.prototype.createNativeFunction;
Interpreter.prototype['getProperty'] = Interpreter.prototype.getProperty;
Interpreter.prototype['setProperty'] = Interpreter.prototype.setProperty;
Interpreter.prototype['nativeToPseudo'] = Interpreter.prototype.nativeToPseudo;
Interpreter.prototype['pseudoToNative'] = Interpreter.prototype.pseudoToNative;

Interpreter.prototype['createPrimitive'] = function (x) {
  return x;
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9KUy1JbnRlcnByZXRlci9pbnRlcnByZXRlci5qcyJdLCJuYW1lcyI6WyJJbnRlcnByZXRlciIsImNvZGUiLCJvcHRfaW5pdEZ1bmMiLCJhY29ybiIsInBhcnNlIiwiUEFSU0VfT1BUSU9OUyIsImFzdCIsImluaXRGdW5jXyIsInBhdXNlZF8iLCJwb2x5ZmlsbHNfIiwiZnVuY3Rpb25Db3VudGVyXyIsInN0ZXBGdW5jdGlvbnNfIiwiT2JqZWN0IiwiY3JlYXRlIiwic3RlcE1hdGNoIiwibSIsIm1ldGhvZE5hbWUiLCJtYXRjaCIsImJpbmQiLCJnbG9iYWwiLCJjcmVhdGVTY29wZSIsImpvaW4iLCJ1bmRlZmluZWQiLCJzdHJpcExvY2F0aW9uc18iLCJzdGF0ZSIsIlN0YXRlIiwiZG9uZSIsInN0YXRlU3RhY2siLCJydW4iLCJ2YWx1ZSIsImxlbmd0aCIsIm5vZGVDb25zdHJ1Y3RvciIsIm5vZGUiLCJjb25zdHJ1Y3RvciIsImVjbWFWZXJzaW9uIiwiUkVBRE9OTFlfREVTQ1JJUFRPUiIsImNvbmZpZ3VyYWJsZSIsImVudW1lcmFibGUiLCJ3cml0YWJsZSIsIk5PTkVOVU1FUkFCTEVfREVTQ1JJUFRPUiIsIlJFQURPTkxZX05PTkVOVU1FUkFCTEVfREVTQ1JJUFRPUiIsIlZBUklBQkxFX0RFU0NSSVBUT1IiLCJTVEVQX0VSUk9SIiwiU0NPUEVfUkVGRVJFTkNFIiwiVkFMVUVfSU5fREVTQ1JJUFRPUiIsIlJFR0VYUF9USU1FT1VUIiwidG9TdHJpbmdDeWNsZXNfIiwidm0iLCJXT1JLRVJfQ09ERSIsInByb3RvdHlwZSIsIlJFR0VYUF9NT0RFIiwiUkVHRVhQX1RIUkVBRF9USU1FT1VUIiwiYXBwZW5kQ29kZSIsIkVycm9yIiwicG9wdWxhdGVTY29wZV8iLCJzY29wZSIsImkiLCJwdXNoIiwic3RlcCIsInN0YWNrIiwidHlwZSIsIm5leHRTdGF0ZSIsImUiLCJpbml0R2xvYmFsU2NvcGUiLCJzZXRQcm9wZXJ0eSIsIk5hTiIsIkluZmluaXR5IiwiT0JKRUNUX1BST1RPIiwiRlVOQ1RJT05fUFJPVE8iLCJpbml0RnVuY3Rpb24iLCJpbml0T2JqZWN0IiwicHJvdG8iLCJPQkpFQ1QiLCJpbml0QXJyYXkiLCJpbml0U3RyaW5nIiwiaW5pdEJvb2xlYW4iLCJpbml0TnVtYmVyIiwiaW5pdERhdGUiLCJpbml0UmVnRXhwIiwiaW5pdEVycm9yIiwiaW5pdE1hdGgiLCJpbml0SlNPTiIsInRoaXNJbnRlcnByZXRlciIsImZ1bmMiLCJjcmVhdGVOYXRpdmVGdW5jdGlvbiIsIngiLCJFdmFsRXJyb3IiLCJldmFsIiwicGFyc2VJbnQiLCJwYXJzZUZsb2F0IiwiaXNOYU4iLCJpc0Zpbml0ZSIsInN0ckZ1bmN0aW9ucyIsImVzY2FwZSIsInVuZXNjYXBlIiwiZGVjb2RlVVJJIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwiZW5jb2RlVVJJIiwiZW5jb2RlVVJJQ29tcG9uZW50Iiwid3JhcHBlciIsIm5hdGl2ZUZ1bmMiLCJzdHIiLCJ0aHJvd0V4Y2VwdGlvbiIsIlVSSV9FUlJPUiIsIm1lc3NhZ2UiLCJGVU5DVElPTiIsIkFSUkFZIiwiQVJSQVlfUFJPVE8iLCJSRUdFWFAiLCJSRUdFWFBfUFJPVE8iLCJEQVRFIiwiREFURV9QUk9UTyIsImlkZW50aWZpZXJSZWdleHAiLCJ2YXJfYXJncyIsImNhbGxlZFdpdGhOZXciLCJuZXdGdW5jIiwiY3JlYXRlT2JqZWN0UHJvdG8iLCJhcmd1bWVudHMiLCJTdHJpbmciLCJhcmdzU3RyIiwiQXJyYXkiLCJzbGljZSIsImNhbGwiLCJ0cmltIiwiYXJncyIsInNwbGl0IiwibmFtZSIsInRlc3QiLCJTWU5UQVhfRVJST1IiLCJwYXJlbnRTY29wZSIsImlkIiwiYm94VGhpcyIsImlzT2JqZWN0IiwiZ2V0U2NvcGUiLCJzdHJpY3QiLCJib3giLCJnZXRQcm90b3R5cGUiLCJkYXRhIiwidGhpc0FyZyIsImZ1bmNfIiwiZnVuY1RoaXNfIiwiYXJndW1lbnRzXyIsImFycmF5UHNldWRvVG9OYXRpdmUiLCJUWVBFX0VSUk9SIiwiZG9uZUV4ZWNfIiwic2V0TmF0aXZlRnVuY3Rpb25Qcm90b3R5cGUiLCJ2YWx1ZU9mIiwidGhyb3dJZk51bGxVbmRlZmluZWQiLCJvYmoiLCJwcm9wcyIsInByb3BlcnRpZXMiLCJhcnJheU5hdGl2ZVRvUHNldWRvIiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsImtleXMiLCJwcm9wIiwiZGVzY3JpcHRvciIsInByZXZlbnRFeHRlbnNpb25zIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiZ2V0dGVyIiwic2V0dGVyIiwiZ2V0Iiwic2V0IiwiaGFzVmFsdWUiLCJwc2V1ZG9EZXNjcmlwdG9yIiwibmF0aXZlVG9Qc2V1ZG8iLCJCb29sZWFuIiwidG9TdHJpbmciLCJoYXNPd25Qcm9wZXJ0eSIsInByb3BlcnR5SXNFbnVtZXJhYmxlIiwibmV3QXJyYXkiLCJmaXJzdCIsImxlZ2FsQXJyYXlMZW5ndGgiLCJSQU5HRV9FUlJPUiIsInBvcCIsImFwcGx5Iiwic2hpZnQiLCJ1bnNoaWZ0IiwicmV2ZXJzZSIsImluZGV4IiwiaG93bWFueSIsImxpc3QiLCJzcGxpY2UiLCJvcHRfYmVnaW4iLCJvcHRfZW5kIiwib3B0X3NlcGFyYXRvciIsImlMZW5ndGgiLCJnZXRQcm9wZXJ0eSIsImhhc1Byb3BlcnR5IiwiZWxlbWVudCIsImlzYSIsImpMZW5ndGgiLCJqIiwic2VhcmNoRWxlbWVudCIsIm9wdF9mcm9tSW5kZXgiLCJpbmRleE9mIiwibGFzdEluZGV4T2YiLCJzb3J0IiwiU1RSSU5HIiwiZnJvbUNoYXJDb2RlIiwiZnVuY3Rpb25zIiwiY29tcGFyZVN0cmluZyIsImxvY2FsZXMiLCJvcHRpb25zIiwicHNldWRvVG9OYXRpdmUiLCJsb2NhbGVDb21wYXJlIiwic2VwYXJhdG9yIiwibGltaXQiLCJjYWxsYmFjayIsInN0cmluZyIsIk51bWJlciIsIm1heWJlVGhyb3dSZWdFeHAiLCJzYW5kYm94IiwianNMaXN0Iiwidm1DYWxsIiwic3BsaXRXb3JrZXIiLCJjcmVhdGVXb3JrZXIiLCJwaWQiLCJyZWdFeHBUaW1lb3V0Iiwib25tZXNzYWdlIiwiY2xlYXJUaW1lb3V0IiwicG9zdE1lc3NhZ2UiLCJzZXRBc3luY0Z1bmN0aW9uUHJvdG90eXBlIiwicmVnZXhwIiwiUmVnRXhwIiwibWF0Y2hXb3JrZXIiLCJuIiwic2VhcmNoV29ya2VyIiwic2VhcmNoIiwic3Vic3RyIiwibmV3U3Vic3RyIiwicmVwbGFjZVdvcmtlciIsInJlcGxhY2UiLCJCT09MRUFOIiwiTlVNQkVSIiwibnVtQ29uc3RzIiwiZnJhY3Rpb25EaWdpdHMiLCJ0b0V4cG9uZW50aWFsIiwiRVJST1IiLCJkaWdpdHMiLCJ0b0ZpeGVkIiwicHJlY2lzaW9uIiwidG9QcmVjaXNpb24iLCJyYWRpeCIsInRvTG9jYWxlU3RyaW5nIiwiRGF0ZSIsImNvbmNhdCIsImZyb20iLCJGdW5jdGlvbiIsIm5vdyIsIlVUQyIsInBhdHRlcm4iLCJmbGFncyIsInJneCIsInBvcHVsYXRlUmVnRXhwIiwidGhpc1BzZXVkb1JlZ0V4cCIsImxhc3RJbmRleCIsIm1hdGNoVG9Qc2V1ZG8iLCJleGVjV29ya2VyIiwiZXhlYyIsInJlc3VsdCIsImlucHV0Iiwib3B0X21lc3NhZ2UiLCJuZXdFcnJvciIsImNyZWF0ZU9iamVjdCIsImNyZWF0ZUVycm9yU3ViY2xhc3MiLCJFVkFMX0VSUk9SIiwiUkVGRVJFTkNFX0VSUk9SIiwibXlNYXRoIiwibWF0aENvbnN0cyIsIk1hdGgiLCJudW1GdW5jdGlvbnMiLCJteUpTT04iLCJ0ZXh0IiwibmF0aXZlT2JqIiwiSlNPTiIsInN0cmluZ2lmeSIsImNoaWxkIiwicHNldWRvUmVnZXhwIiwibmF0aXZlUmVnZXhwIiwic291cmNlIiwiaWdub3JlQ2FzZSIsIm11bHRpbGluZSIsImJsb2IiLCJibG9iXyIsIkJsb2IiLCJXb3JrZXIiLCJVUkwiLCJjcmVhdGVPYmplY3RVUkwiLCJuYXRpdmVSZWdFeHAiLCJvayIsInJlcXVpcmUiLCJ3b3JrZXIiLCJzZXRUaW1lb3V0IiwidGVybWluYXRlIiwibGVnYWxBcnJheUluZGV4IiwiVmFsdWUiLCJjeWNsZXMiLCJzdHJzIiwiY3JlYXRlRnVuY3Rpb24iLCJvcHRfY29uc3RydWN0b3IiLCJpbGxlZ2FsQ29uc3RydWN0b3IiLCJjcmVhdGVBc3luY0Z1bmN0aW9uIiwiYXN5bmNGdW5jIiwicHNldWRvRGF0ZSIsImludGVycHJldGVyIiwibWFwIiwicHNldWRvT2JqIiwiaXNBcnJheSIsImtleSIsIm9wdF9jeWNsZXMiLCJwc2V1ZG8iLCJ2YWwiLCJuYXRpdmVBcnJheSIsInBzZXVkb0FycmF5IiwiY2hhckNvZGVBdCIsImlzR2V0dGVyIiwiVHlwZUVycm9yIiwib3B0X2Rlc2NyaXB0b3IiLCJtYXgiLCJkZWZpbmVQcm9wZXJ0eSIsIlJlZmVyZW5jZUVycm9yIiwiZGVmT2JqIiwiZmlyc3ROb2RlIiwiZXhwcmVzc2lvbiIsImNyZWF0ZVNwZWNpYWxTY29wZSIsIm9wdF9zY29wZSIsImdldFZhbHVlRnJvbVNjb3BlIiwicHJldk5vZGUiLCJzZXRWYWx1ZVRvU2NvcGUiLCJub2RlQ2xhc3MiLCJzdGFydCIsImVuZCIsImlzQ29uc3RydWN0b3IiLCJnZXRWYWx1ZSIsInJlZiIsInNldFZhbHVlIiwiQ29tcGxldGlvbiIsIk5PUk1BTCIsIkJSRUFLIiwiQ09OVElOVUUiLCJSRVRVUk4iLCJUSFJPVyIsImVycm9yQ2xhc3MiLCJlcnJvciIsInVud2luZCIsImxhYmVsIiwiY3YiLCJsYWJlbHMiLCJpc0xvb3AiLCJpc1N3aXRjaCIsInJlYWxFcnJvciIsImVycm9yVGFibGUiLCJSYW5nZUVycm9yIiwiU3ludGF4RXJyb3IiLCJVUklFcnJvciIsImVycm9yQ29uc3RydWN0b3IiLCJjcmVhdGVHZXR0ZXJfIiwibGVmdCIsImZ1bmNUaGlzIiwiZG9uZUNhbGxlZV8iLCJkb25lQXJnc18iLCJjcmVhdGVTZXR0ZXJfIiwiZWxlbWVudHMiLCJuXyIsImFycmF5XyIsImRvbmVMZWZ0XyIsImNvbXBvbmVudHMiLCJkb25lUmlnaHRfIiwibGVmdFJlZmVyZW5jZV8iLCJkb25lR2V0dGVyXyIsImxlZnRWYWx1ZV8iLCJsZWZ0VmFsdWUiLCJkb25lU2V0dGVyXyIsInNldHRlclZhbHVlXyIsInJpZ2h0VmFsdWUiLCJkaXJlY3RFdmFsXyIsImZ1bmNOb2RlIiwicGFyYW1OYW1lIiwicGFyYW1WYWx1ZSIsImFyZ3NMaXN0IiwiZXZhbE5vZGUiLCJhcmdMZW5ndGgiLCJhcmdzV2l0aENhbGxiYWNrIiwiZG9uZV8iLCJ0aHJvd1ZhbHVlIiwibW9kZSIsIm1vZGVfIiwidGVzdF8iLCJkb25lSW5pdF8iLCJkb25lT2JqZWN0XyIsInZhcmlhYmxlXyIsIm9iamVjdF8iLCJ2aXNpdGVkXyIsIm5hbWVfIiwiZ290UHJvcE5hbWUiLCJwcm9wc18iLCJkb25lVmFyaWFibGVfIiwicHJvcE5hbWUiLCJkb25lUHJvcGVydHlfIiwicHJvcGVydHkiLCJwcm9wZXJ0aWVzXyIsImtpbmRzIiwic3dpdGNoVmFsdWVfIiwiZGVmYXVsdENhc2VfIiwiaW5kZXhfIiwic3dpdGNoQ2FzZSIsIm1hdGNoZWRfIiwidGVzdGVkXyIsImRvbmVCbG9ja18iLCJkb25lSGFuZGxlcl8iLCJkb25lRmluYWxpemVyXyIsImxlZnRTaWRlXyIsImNoYW5nZVZhbHVlIiwicmV0dXJuVmFsdWUiLCJkZWNsYXJhdGlvbnMiLCJkZWNsYXJhdGlvbk5vZGUiLCJpbml0XyIsImRvbmVCb2R5XyJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkE7Ozs7QUFJQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRQTs7Ozs7O0FBQ0EsSUFBSUEsV0FBVyxHQUFHLFNBQWRBLFdBQWMsQ0FBU0MsSUFBVCxFQUFlQyxZQUFmLEVBQTZCO0FBQzdDLE1BQUksT0FBT0QsSUFBUCxLQUFnQixRQUFwQixFQUE4QjtBQUM1QkEsSUFBQUEsSUFBSSxHQUFHRSxrQkFBTUMsS0FBTixDQUFZSCxJQUFaLEVBQWtCRCxXQUFXLENBQUNLLGFBQTlCLENBQVA7QUFD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c0IsS0FBdEIsSUFBK0JqRCxXQUFXLENBQUNpRCxTQUFaLENBQXNCckIsR0FBckQ7QUFDQTVCLFdBQVcsQ0FBQ2lELFNBQVosQ0FBc0IsWUFBdEIsSUFBc0NqRCxXQUFXLENBQUNpRCxTQUFaLENBQXNCRyxVQUE1RDtBQUNBcEQsV0FBVyxDQUFDaUQsU0FBWixDQUFzQixjQUF0QixJQUF3Q2pELFdBQVcsQ0FBQ2lELFNBQVosQ0FBc0JzTixZQUE5RDtBQUNBdlEsV0FBVyxDQUFDaUQsU0FBWixDQUFzQixtQkFBdEIsSUFDSWpELFdBQVcsQ0FBQ2lELFNBQVosQ0FBc0JtRSxpQkFEMUI7QUFFQXBILFdBQVcsQ0FBQ2lELFNBQVosQ0FBc0IscUJBQXRCLElBQ0lqRCxXQUFXLENBQUNpRCxTQUFaLENBQXNCNFAsbUJBRDFCO0FBRUE3UyxXQUFXLENBQUNpRCxTQUFaLENBQXNCLHNCQUF0QixJQUNJakQsV0FBVyxDQUFDaUQsU0FBWixDQUFzQm1DLG9CQUQxQjtBQUVBcEYsV0FBVyxDQUFDaUQsU0FBWixDQUFzQixhQUF0QixJQUF1Q2pELFdBQVcsQ0FBQ2lELFNBQVosQ0FBc0J5SSxXQUE3RDtBQUNBMUwsV0FBVyxDQUFDaUQsU0FBWixDQUFzQixhQUF0QixJQUF1Q2pELFdBQVcsQ0FBQ2lELFNBQVosQ0FBc0JlLFdBQTdEO0FBQ0FoRSxXQUFXLENBQUNpRCxTQUFaLENBQXNCLGdCQUF0QixJQUEwQ2pELFdBQVcsQ0FBQ2lELFNBQVosQ0FBc0JtSCxjQUFoRTtBQUNBcEssV0FBVyxDQUFDaUQsU0FBWixDQUFzQixnQkFBdEIsSUFBMENqRCxXQUFXLENBQUNpRCxTQUFaLENBQXNCMEosY0FBaEU7O0FBRUEzTSxXQUFXLENBQUNpRCxTQUFaLENBQXNCLGlCQUF0QixJQUEyQyxVQUFTb0MsQ0FBVCxFQUFZO0FBQUMsU0FBT0EsQ0FBUDtBQUFVLENBQWxFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogSmF2YVNjcmlwdCBJbnRlcnByZXRlclxuICpcbiAqIENvcHlyaWdodCAyMDEzIEdvb2dsZSBJbmMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgSW50ZXJwcmV0aW5nIEphdmFTY3JpcHQgaW4gSmF2YVNjcmlwdC5cbiAqIEBhdXRob3IgZnJhc2VyQGdvb2dsZS5jb20gKE5laWwgRnJhc2VyKVxuICovXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IGludGVycHJldGVyLlxuICogQHBhcmFtIHtzdHJpbmd8IU9iamVjdH0gY29kZSBSYXcgSmF2YVNjcmlwdCB0ZXh0IG9yIEFTVC5cbiAqIEBwYXJhbSB7RnVuY3Rpb249fSBvcHRfaW5pdEZ1bmMgT3B0aW9uYWwgaW5pdGlhbGl6YXRpb24gZnVuY3Rpb24uICBVc2VkIHRvXG4gKiAgICAgZGVmaW5lIEFQSXMuICBXaGVuIGNhbGxlZCBpdCBpcyBwYXNzZWQgdGhlIGludGVycHJldGVyIG9iamVjdCBhbmQgdGhlXG4gKiAgICAgZ2xvYmFsIHNjb3BlIG9iamVjdC5cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5pbXBvcnQgYWNvcm4gZnJvbSAnLi9hY29ybidcbnZhciBJbnRlcnByZXRlciA9IGZ1bmN0aW9uKGNvZGUsIG9wdF9pbml0RnVuYykge1xuICBpZiAodHlwZW9mIGNvZGUgPT09ICdzdHJpbmcnKSB7XG4gICAgY29kZSA9IGFjb3JuLnBhcnNlKGNvZGUsIEludGVycHJldGVyLlBBUlNFX09QVElPTlMpO1xuICB9XG4gIHRoaXMuYXN0ID0gY29kZTtcbiAgdGhpcy5pbml0RnVuY18gPSBvcHRfaW5pdEZ1bmM7XG4gIHRoaXMucGF1c2VkXyA9IGZhbHNlO1xuICB0aGlzLnBvbHlmaWxsc18gPSBbXTtcbiAgLy8gVW5pcXVlIGlkZW50aWZpZXIgZm9yIG5hdGl2ZSBmdW5jdGlvbnMuICBVc2VkIGluIHNlcmlhbGl6YXRpb24uXG4gIHRoaXMuZnVuY3Rpb25Db3VudGVyXyA9IDA7XG4gIC8vIE1hcCBub2RlIHR5cGVzIHRvIG91ciBzdGVwIGZ1bmN0aW9uIG5hbWVzOyBhIHByb3BlcnR5IGxvb2t1cCBpcyBmYXN0ZXJcbiAgLy8gdGhhbiBzdHJpbmcgY29uY2F0ZW5hdGlvbiB3aXRoIFwic3RlcFwiIHByZWZpeC5cbiAgdGhpcy5zdGVwRnVuY3Rpb25zXyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHZhciBzdGVwTWF0Y2ggPSAvXnN0ZXAoW0EtWl1cXHcqKSQvO1xuICB2YXIgbTtcbiAgZm9yICh2YXIgbWV0aG9kTmFtZSBpbiB0aGlzKSB7XG4gICAgaWYgKCh0eXBlb2YgdGhpc1ttZXRob2ROYW1lXSA9PT0gJ2Z1bmN0aW9uJykgJiZcbiAgICAgICAgKG0gPSBtZXRob2ROYW1lLm1hdGNoKHN0ZXBNYXRjaCkpKSB7XG4gICAgICB0aGlzLnN0ZXBGdW5jdGlvbnNfW21bMV1dID0gdGhpc1ttZXRob2ROYW1lXS5iaW5kKHRoaXMpO1xuICAgIH1cbiAgfVxuICAvLyBDcmVhdGUgYW5kIGluaXRpYWxpemUgdGhlIGdsb2JhbCBzY29wZS5cbiAgdGhpcy5nbG9iYWwgPSB0aGlzLmNyZWF0ZVNjb3BlKHRoaXMuYXN0LCBudWxsKTtcbiAgLy8gUnVuIHRoZSBwb2x5ZmlsbHMuXG4gIHRoaXMuYXN0ID0gYWNvcm4ucGFyc2UodGhpcy5wb2x5ZmlsbHNfLmpvaW4oJ1xcbicpLCBJbnRlcnByZXRlci5QQVJTRV9PUFRJT05TKTtcbiAgdGhpcy5wb2x5ZmlsbHNfID0gdW5kZWZpbmVkOyAgLy8gQWxsb3cgcG9seWZpbGwgc3RyaW5ncyB0byBnYXJiYWdlIGNvbGxlY3QuXG4gIHRoaXMuc3RyaXBMb2NhdGlvbnNfKHRoaXMuYXN0LCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gIHZhciBzdGF0ZSA9IG5ldyBJbnRlcnByZXRlci5TdGF0ZSh0aGlzLmFzdCwgdGhpcy5nbG9iYWwpO1xuICBzdGF0ZS5kb25lID0gZmFsc2U7XG4gIHRoaXMuc3RhdGVTdGFjayA9IFtzdGF0ZV07XG4gIHRoaXMucnVuKCk7XG4gIHRoaXMudmFsdWUgPSB1bmRlZmluZWQ7XG4gIC8vIFBvaW50IGF0IHRoZSBtYWluIHByb2dyYW0uXG4gIHRoaXMuYXN0ID0gY29kZTtcbiAgdmFyIHN0YXRlID0gbmV3IEludGVycHJldGVyLlN0YXRlKHRoaXMuYXN0LCB0aGlzLmdsb2JhbCk7XG4gIHN0YXRlLmRvbmUgPSBmYWxzZTtcbiAgdGhpcy5zdGF0ZVN0YWNrLmxlbmd0aCA9IDA7XG4gIHRoaXMuc3RhdGVTdGFja1swXSA9IHN0YXRlO1xuICAvLyBHZXQgYSBoYW5kbGUgb24gQWNvcm4ncyBub2RlX3Qgb2JqZWN0LiAgSXQncyB0cmlja3kgdG8gYWNjZXNzLlxuICB0aGlzLm5vZGVDb25zdHJ1Y3RvciA9IHN0YXRlLm5vZGUuY29uc3RydWN0b3I7XG4gIC8vIFByZXNlcnZlIHB1YmxpY2x5IHByb3BlcnRpZXMgZnJvbSBiZWluZyBwcnVuZWQvcmVuYW1lZCBieSBKUyBjb21waWxlcnMuXG4gIC8vIEFkZCBvdGhlcnMgYXMgbmVlZGVkLlxuICB0aGlzWydzdGF0ZVN0YWNrJ10gPSB0aGlzLnN0YXRlU3RhY2s7XG59O1xuXG4vKipcbiAqIEBjb25zdCB7IU9iamVjdH0gQ29uZmlndXJhdGlvbiB1c2VkIGZvciBhbGwgQWNvcm4gcGFyc2luZy5cbiAqL1xuSW50ZXJwcmV0ZXIuUEFSU0VfT1BUSU9OUyA9IHtcbiAgZWNtYVZlcnNpb246IDVcbn07XG5cbi8qKlxuICogUHJvcGVydHkgZGVzY3JpcHRvciBvZiByZWFkb25seSBwcm9wZXJ0aWVzLlxuICovXG5JbnRlcnByZXRlci5SRUFET05MWV9ERVNDUklQVE9SID0ge1xuICBjb25maWd1cmFibGU6IHRydWUsXG4gIGVudW1lcmFibGU6IHRydWUsXG4gIHdyaXRhYmxlOiBmYWxzZVxufTtcblxuLyoqXG4gKiBQcm9wZXJ0eSBkZXNjcmlwdG9yIG9mIG5vbi1lbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKi9cbkludGVycHJldGVyLk5PTkVOVU1FUkFCTEVfREVTQ1JJUFRPUiA9IHtcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxuICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgd3JpdGFibGU6IHRydWVcbn07XG5cbi8qKlxuICogUHJvcGVydHkgZGVzY3JpcHRvciBvZiByZWFkb25seSwgbm9uLWVudW1lcmFibGUgcHJvcGVydGllcy5cbiAqL1xuSW50ZXJwcmV0ZXIuUkVBRE9OTFlfTk9ORU5VTUVSQUJMRV9ERVNDUklQVE9SID0ge1xuICBjb25maWd1cmFibGU6IHRydWUsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICB3cml0YWJsZTogZmFsc2Vcbn07XG5cbi8qKlxuICogUHJvcGVydHkgZGVzY3JpcHRvciBvZiB2YXJpYWJsZXMuXG4gKi9cbkludGVycHJldGVyLlZBUklBQkxFX0RFU0NSSVBUT1IgPSB7XG4gIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gIGVudW1lcmFibGU6IHRydWUsXG4gIHdyaXRhYmxlOiB0cnVlXG59O1xuXG4vKipcbiAqIFVuaXF1ZSBzeW1ib2wgZm9yIGluZGljYXRpbmcgdGhhdCBhIHN0ZXAgaGFzIGVuY291bnRlcmVkIGFuIGVycm9yLCBoYXNcbiAqIGFkZGVkIGl0IHRvIHRoZSBzdGFjaywgYW5kIHdpbGwgYmUgdGhyb3duIHdpdGhpbiB0aGUgdXNlcidzIHByb2dyYW0uXG4gKiBXaGVuIFNURVBfRVJST1IgaXMgdGhyb3duIGluIHRoZSBKUy1JbnRlcnByZXRlciwgdGhlIGVycm9yIGNhbiBiZSBpZ25vcmVkLlxuICovXG5JbnRlcnByZXRlci5TVEVQX0VSUk9SID0geydTVEVQX0VSUk9SJzogdHJ1ZX07XG5cbi8qKlxuICogVW5pcXVlIHN5bWJvbCBmb3IgaW5kaWNhdGluZyB0aGF0IGEgcmVmZXJlbmNlIGlzIGEgdmFyaWFibGUgb24gdGhlIHNjb3BlLFxuICogbm90IGFuIG9iamVjdCBwcm9wZXJ0eS5cbiAqL1xuSW50ZXJwcmV0ZXIuU0NPUEVfUkVGRVJFTkNFID0geydTQ09QRV9SRUZFUkVOQ0UnOiB0cnVlfTtcblxuLyoqXG4gKiBVbmlxdWUgc3ltYm9sIGZvciBpbmRpY2F0aW5nLCB3aGVuIHVzZWQgYXMgdGhlIHZhbHVlIG9mIHRoZSB2YWx1ZVxuICogcGFyYW1ldGVyIGluIGNhbGxzIHRvIHNldFByb3BlcnR5IGFuZCBmcmllbmRzLCB0aGF0IHRoZSB2YWx1ZVxuICogc2hvdWxkIGJlIHRha2VuIGZyb20gdGhlIHByb3BlcnR5IGRlc2NyaXB0b3IgaW5zdGVhZC5cbiAqL1xuSW50ZXJwcmV0ZXIuVkFMVUVfSU5fREVTQ1JJUFRPUiA9IHsnVkFMVUVfSU5fREVTQ1JJUFRPUic6IHRydWV9O1xuXG4vKipcbiAqIFVuaXF1ZSBzeW1ib2wgZm9yIGluZGljYXRpbmcgdGhhdCBhIFJlZ0V4cCB0aW1lb3V0IGhhcyBvY2N1cnJlZCBpbiBhIFZNLlxuICovXG5JbnRlcnByZXRlci5SRUdFWFBfVElNRU9VVCA9IHsnUkVHRVhQX1RJTUVPVVQnOiB0cnVlfTtcblxuLyoqXG4gKiBGb3IgY3ljbGUgZGV0ZWN0aW9uIGluIGFycmF5IHRvIHN0cmluZyBhbmQgZXJyb3IgY29udmVyc2lvbjtcbiAqIHNlZSBzcGVjIGJ1ZyBnaXRodWIuY29tL3RjMzkvZWNtYTI2Mi9pc3N1ZXMvMjg5XG4gKiBTaW5jZSB0aGlzIGlzIGZvciBhdG9taWMgYWN0aW9ucyBvbmx5LCBpdCBjYW4gYmUgYSBjbGFzcyBwcm9wZXJ0eS5cbiAqL1xuSW50ZXJwcmV0ZXIudG9TdHJpbmdDeWNsZXNfID0gW107XG5cbi8qKlxuICogTm9kZSdzIHZtIG1vZHVsZSwgaWYgbG9hZGVkIGFuZCByZXF1aXJlZC5cbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbkludGVycHJldGVyLnZtID0gbnVsbDtcblxuLyoqXG4gKiBDb2RlIGZvciBleGVjdXRpbmcgcmVndWxhciBleHByZXNzaW9ucyBpbiBhIHRocmVhZC5cbiAqL1xuSW50ZXJwcmV0ZXIuV09SS0VSX0NPREUgPSBbXG4gIFwib25tZXNzYWdlID0gZnVuY3Rpb24oZSkge1wiLFxuICAgIFwidmFyIHJlc3VsdDtcIixcbiAgICBcInZhciBkYXRhID0gZS5kYXRhO1wiLFxuICAgIFwic3dpdGNoIChkYXRhWzBdKSB7XCIsXG4gICAgICBcImNhc2UgJ3NwbGl0JzpcIixcbiAgICAgICAgLy8gWydzcGxpdCcsIHN0cmluZywgc2VwYXJhdG9yLCBsaW1pdF1cbiAgICAgICAgXCJyZXN1bHQgPSBkYXRhWzFdLnNwbGl0KGRhdGFbMl0sIGRhdGFbM10pO1wiLFxuICAgICAgICBcImJyZWFrO1wiLFxuICAgICAgXCJjYXNlICdtYXRjaCc6XCIsXG4gICAgICAgIC8vIFsnbWF0Y2gnLCBzdHJpbmcsIHJlZ2V4cF1cbiAgICAgICAgXCJyZXN1bHQgPSBkYXRhWzFdLm1hdGNoKGRhdGFbMl0pO1wiLFxuICAgICAgICBcImJyZWFrO1wiLFxuICAgICAgXCJjYXNlICdzZWFyY2gnOlwiLFxuICAgICAgICAvLyBbJ3NlYXJjaCcsIHN0cmluZywgcmVnZXhwXVxuICAgICAgICBcInJlc3VsdCA9IGRhdGFbMV0uc2VhcmNoKGRhdGFbMl0pO1wiLFxuICAgICAgICBcImJyZWFrO1wiLFxuICAgICAgXCJjYXNlICdyZXBsYWNlJzpcIixcbiAgICAgICAgLy8gWydyZXBsYWNlJywgc3RyaW5nLCByZWdleHAsIG5ld1N1YnN0cl1cbiAgICAgICAgXCJyZXN1bHQgPSBkYXRhWzFdLnJlcGxhY2UoZGF0YVsyXSwgZGF0YVszXSk7XCIsXG4gICAgICAgIFwiYnJlYWs7XCIsXG4gICAgICBcImNhc2UgJ2V4ZWMnOlwiLFxuICAgICAgICAvLyBbJ2V4ZWMnLCByZWdleHAsIGxhc3RJbmRleCwgc3RyaW5nXVxuICAgICAgICBcInZhciByZWdleHAgPSBkYXRhWzFdO1wiLFxuICAgICAgICBcInJlZ2V4cC5sYXN0SW5kZXggPSBkYXRhWzJdO1wiLFxuICAgICAgICBcInJlc3VsdCA9IFtyZWdleHAuZXhlYyhkYXRhWzNdKSwgZGF0YVsxXS5sYXN0SW5kZXhdO1wiLFxuICAgICAgICBcImJyZWFrO1wiLFxuICAgICAgXCJkZWZhdWx0OlwiLFxuICAgICAgICBcInRocm93ICdVbmtub3duIFJlZ0V4cCBvcGVyYXRpb246ICcgKyBkYXRhWzBdO1wiLFxuICAgIFwifVwiLFxuICAgIFwicG9zdE1lc3NhZ2UocmVzdWx0KTtcIixcbiAgXCJ9O1wiXTtcblxuLyoqXG4gKiBTb21lIHBhdGhvbG9naWNhbCByZWd1bGFyIGV4cHJlc3Npb25zIGNhbiB0YWtlIGdlb21ldHJpYyB0aW1lLlxuICogUmVndWxhciBleHByZXNzaW9ucyBhcmUgaGFuZGxlZCBpbiBvbmUgb2YgdGhyZWUgd2F5czpcbiAqIDAgLSB0aHJvdyBhcyBpbnZhbGlkLlxuICogMSAtIGV4ZWN1dGUgbmF0aXZlbHkgKHJpc2sgb2YgdW5yZXNwb25zaXZlIHByb2dyYW0pLlxuICogMiAtIGV4ZWN1dGUgaW4gc2VwYXJhdGUgdGhyZWFkIChub3Qgc3VwcG9ydGVkIGJ5IElFIDkpLlxuICovXG5JbnRlcnByZXRlci5wcm90b3R5cGUuUkVHRVhQX01PREUgPSAyO1xuXG4vKipcbiAqIElmIFJFR0VYUF9NT0RFID0gMiwgdGhlIGxlbmd0aCBvZiB0aW1lIChpbiBtcykgdG8gYWxsb3cgYSBSZWdFeHBcbiAqIHRocmVhZCB0byBleGVjdXRlIGJlZm9yZSB0ZXJtaW5hdGluZyBpdC5cbiAqL1xuSW50ZXJwcmV0ZXIucHJvdG90eXBlLlJFR0VYUF9USFJFQURfVElNRU9VVCA9IDEwMDA7XG5cbi8qKlxuICogQWRkIG1vcmUgY29kZSB0byB0aGUgaW50ZXJwcmV0ZXIuXG4gKiBAcGFyYW0ge3N0cmluZ3whT2JqZWN0fSBjb2RlIFJhdyBKYXZhU2NyaXB0IHRleHQgb3IgQVNULlxuICovXG5JbnRlcnByZXRlci5wcm90b3R5cGUuYXBwZW5kQ29kZSA9IGZ1bmN0aW9uKGNvZGUpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5zdGF0ZVN0YWNrWzBdO1xuICBpZiAoIXN0YXRlIHx8IHN0YXRlLm5vZGVbJ3R5cGUnXSAhPT0gJ1Byb2dyYW0nKSB7XG4gICAgdGhyb3cgRXJyb3IoJ0V4cGVjdGluZyBvcmlnaW5hbCBBU1QgdG8gc3RhcnQgd2l0aCBhIFByb2dyYW0gbm9kZS4nKTtcbiAgfVxuICBpZiAodHlwZW9mIGNvZGUgPT09ICdzdHJpbmcnKSB7XG4gICAgY29kZSA9IGFjb3JuLnBhcnNlKGNvZGUsIEludGVycHJldGVyLlBBUlNFX09QVElPTlMpO1xuICB9XG4gIGlmICghY29kZSB8fCBjb2RlWyd0eXBlJ10gIT09ICdQcm9ncmFtJykge1xuICAgIHRocm93IEVycm9yKCdFeHBlY3RpbmcgbmV3IEFTVCB0byBzdGFydCB3aXRoIGEgUHJvZ3JhbSBub2RlLicpO1xuICB9XG4gIHRoaXMucG9wdWxhdGVTY29wZV8oY29kZSwgc3RhdGUuc2NvcGUpO1xuICAvLyBBcHBlbmQgdGhlIG5ldyBwcm9ncmFtIHRvIHRoZSBvbGQgb25lLlxuICBmb3IgKHZhciBpID0gMCwgbm9kZTsgKG5vZGUgPSBjb2RlWydib2R5J11baV0pOyBpKyspIHtcbiAgICBzdGF0ZS5ub2RlWydib2R5J10ucHVzaChub2RlKTtcbiAgfVxuICBzdGF0ZS5kb25lID0gZmFsc2U7XG59O1xuXG4vKipcbiAqIEV4ZWN1dGUgb25lIHN0ZXAgb2YgdGhlIGludGVycHJldGVyLlxuICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiBhIHN0ZXAgd2FzIGV4ZWN1dGVkLCBmYWxzZSBpZiBubyBtb3JlIGluc3RydWN0aW9ucy5cbiAqL1xuSW50ZXJwcmV0ZXIucHJvdG90eXBlLnN0ZXAgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHN0YWNrID0gdGhpcy5zdGF0ZVN0YWNrO1xuICB2YXIgc3RhdGUgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgaWYgKCFzdGF0ZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgbm9kZSA9IHN0YXRlLm5vZGUsIHR5cGUgPSBub2RlWyd0eXBlJ107XG4gIGlmICh0eXBlID09PSAnUHJvZ3JhbScgJiYgc3RhdGUuZG9uZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIGlmICh0aGlzLnBhdXNlZF8pIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICB0cnkge1xuICAgIHZhciBuZXh0U3RhdGUgPSB0aGlzLnN0ZXBGdW5jdGlvbnNfW3R5cGVdKHN0YWNrLCBzdGF0ZSwgbm9kZSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBFYXQgYW55IHN0ZXAgZXJyb3JzLiAgVGhleSBoYXZlIGJlZW4gdGhyb3duIG9uIHRoZSBzdGFjay5cbiAgICBpZiAoZSAhPT0gSW50ZXJwcmV0ZXIuU1RFUF9FUlJPUikge1xuICAgICAgLy8gVWggb2guICBUaGlzIGlzIGEgcmVhbCBlcnJvciBpbiB0aGUgSlMtSW50ZXJwcmV0ZXIuICBSZXRocm93LlxuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gIH1cbiAgaWYgKG5leHRTdGF0ZSkge1xuICAgIHN0YWNrLnB1c2gobmV4dFN0YXRlKTtcbiAgfVxuICBpZiAoIW5vZGVbJ2VuZCddKSB7XG4gICAgLy8gVGhpcyBpcyBwb2x5ZmlsbCBjb2RlLiAgS2VlcCBleGVjdXRpbmcgdW50aWwgd2UgYXJyaXZlIGF0IHVzZXIgY29kZS5cbiAgICByZXR1cm4gdGhpcy5zdGVwKCk7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vKipcbiAqIEV4ZWN1dGUgdGhlIGludGVycHJldGVyIHRvIHByb2dyYW0gY29tcGxldGlvbi4gIFZ1bG5lcmFibGUgdG8gaW5maW5pdGUgbG9vcHMuXG4gKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIGEgZXhlY3V0aW9uIGlzIGFzeW5jaHJvbm91c2x5IGJsb2NrZWQsXG4gKiAgICAgZmFsc2UgaWYgbm8gbW9yZSBpbnN0cnVjdGlvbnMuXG4gKi9cbkludGVycHJldGVyLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbigpIHtcbiAgd2hpbGUgKCF0aGlzLnBhdXNlZF8gJiYgdGhpcy5zdGVwKCkpIHt9XG4gIHJldHVybiB0aGlzLnBhdXNlZF87XG59O1xuXG4vKipcbiAqIEluaXRpYWxpemUgdGhlIGdsb2JhbCBzY29wZSB3aXRoIGJ1aXRpbiBwcm9wZXJ0aWVzIGFuZCBmdW5jdGlvbnMuXG4gKiBAcGFyYW0geyFJbnRlcnByZXRlci5PYmplY3R9IHNjb3BlIEdsb2JhbCBzY29wZS5cbiAqL1xuSW50ZXJwcmV0ZXIucHJvdG90eXBlLmluaXRHbG9iYWxTY29wZSA9IGZ1bmN0aW9uKHNjb3BlKSB7XG4gIC8vIEluaXRpYWxpemUgdW5lZGl0YWJsZSBnbG9iYWwgcHJvcGVydGllcy5cbiAgdGhpcy5zZXRQcm9wZXJ0eShzY29wZSwgJ05hTicsIE5hTixcbiAgICAgICAgICAgICAgICAgICBJbnRlcnByZXRlci5SRUFET05MWV9ERVNDUklQVE9SKTtcbiAgdGhpcy5zZXRQcm9wZXJ0eShzY29wZSwgJ0luZmluaXR5JywgSW5maW5pdHksXG4gICAgICAgICAgICAgICAgICAgSW50ZXJwcmV0ZXIuUkVBRE9OTFlfREVTQ1JJUFRPUik7XG4gIHRoaXMuc2V0UHJvcGVydHkoc2NvcGUsICd1bmRlZmluZWQnLCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgSW50ZXJwcmV0ZXIuUkVBRE9OTFlfREVTQ1JJUFRPUik7XG4gIHRoaXMuc2V0UHJvcGVydHkoc2NvcGUsICd3aW5kb3cnLCBzY29wZSxcbiAgICAgICAgICAgICAgICAgICBJbnRlcnByZXRlci5SRUFET05MWV9ERVNDUklQVE9SKTtcbiAgdGhpcy5zZXRQcm9wZXJ0eShzY29wZSwgJ3RoaXMnLCBzY29wZSxcbiAgICAgICAgICAgICAgICAgICBJbnRlcnByZXRlci5SRUFET05MWV9ERVNDUklQVE9SKTtcbiAgdGhpcy5zZXRQcm9wZXJ0eShzY29wZSwgJ3NlbGYnLCBzY29wZSk7IC8vIEVkaXRhYmxlLlxuXG4gIC8vIENyZWF0ZSB0aGUgb2JqZWN0cyB3aGljaCB3aWxsIGJlY29tZSBPYmplY3QucHJvdG90eXBlIGFuZFxuICAvLyBGdW5jdGlvbi5wcm90b3R5cGUsIHdoaWNoIGFyZSBuZWVkZWQgdG8gYm9vdHN0cmFwIGV2ZXJ5dGhpbmcgZWxzZS5cbiAgdGhpcy5PQkpFQ1RfUFJPVE8gPSBuZXcgSW50ZXJwcmV0ZXIuT2JqZWN0KG51bGwpO1xuICB0aGlzLkZVTkNUSU9OX1BST1RPID0gbmV3IEludGVycHJldGVyLk9iamVjdCh0aGlzLk9CSkVDVF9QUk9UTyk7XG4gIC8vIEluaXRpYWxpemUgZ2xvYmFsIG9iamVjdHMuXG4gIHRoaXMuaW5pdEZ1bmN0aW9uKHNjb3BlKTtcbiAgdGhpcy5pbml0T2JqZWN0KHNjb3BlKTtcbiAgLy8gVW5hYmxlIHRvIHNldCBzY29wZSdzIHBhcmVudCBwcmlvciAoT0JKRUNUIGRpZCBub3QgZXhpc3QpLlxuICAvLyBOb3RlIHRoYXQgaW4gYSBicm93c2VyIHRoaXMgd291bGQgYmUgJ1dpbmRvdycsIHdoZXJlYXMgaW4gTm9kZS5qcyBpdCB3b3VsZFxuICAvLyBiZSAnT2JqZWN0Jy4gIFRoaXMgaW50ZXJwcmV0ZXIgaXMgY2xvc2VyIHRvIE5vZGUgaW4gdGhhdCBpdCBoYXMgbm8gRE9NLlxuICBzY29wZS5wcm90byA9IHRoaXMuT0JKRUNUX1BST1RPO1xuICB0aGlzLnNldFByb3BlcnR5KHNjb3BlLCAnY29uc3RydWN0b3InLCB0aGlzLk9CSkVDVCxcbiAgICAgICAgICAgICAgICAgICBJbnRlcnByZXRlci5OT05FTlVNRVJBQkxFX0RFU0NSSVBUT1IpO1xuICB0aGlzLmluaXRBcnJheShzY29wZSk7XG4gIHRoaXMuaW5pdFN0cmluZyhzY29wZSk7XG4gIHRoaXMuaW5pdEJvb2xlYW4oc2NvcGUpO1xuICB0aGlzLmluaXROdW1iZXIoc2NvcGUpO1xuICB0aGlzLmluaXREYXRlKHNjb3BlKTtcbiAgdGhpcy5pbml0UmVnRXhwKHNjb3BlKTtcbiAgdGhpcy5pbml0RXJyb3Ioc2NvcGUpO1xuICB0aGlzLmluaXRNYXRoKHNjb3BlKTtcbiAgdGhpcy5pbml0SlNPTihzY29wZSk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBnbG9iYWwgZnVuY3Rpb25zLlxuICB2YXIgdGhpc0ludGVycHJldGVyID0gdGhpcztcbiAgdmFyIGZ1bmMgPSB0aGlzLmNyZWF0ZU5hdGl2ZUZ1bmN0aW9uKFxuICAgICAgZnVuY3Rpb24oeCkge3Rocm93IEV2YWxFcnJvcihcIkNhbid0IGhhcHBlblwiKTt9LCBmYWxzZSk7XG4gIGZ1bmMuZXZhbCA9IHRydWU7XG4gIHRoaXMuc2V0UHJvcGVydHkoc2NvcGUsICdldmFsJywgZnVuYyk7XG5cbiAgdGhpcy5zZXRQcm9wZXJ0eShzY29wZSwgJ3BhcnNlSW50JyxcbiAgICAgIHRoaXMuY3JlYXRlTmF0aXZlRnVuY3Rpb24ocGFyc2VJbnQsIGZhbHNlKSk7XG4gIHRoaXMuc2V0UHJvcGVydHkoc2NvcGUsICdwYXJzZUZsb2F0JyxcbiAgICAgIHRoaXMuY3JlYXRlTmF0aXZlRnVuY3Rpb24ocGFyc2VGbG9hdCwgZmFsc2UpKTtcblxuICB0aGlzLnNldFByb3BlcnR5KHNjb3BlLCAnaXNOYU4nLFxuICAgICAgdGhpcy5jcmVhdGVOYXRpdmVGdW5jdGlvbihpc05hTiwgZmFsc2UpKTtcblxuICB0aGlzLnNldFByb3BlcnR5KHNjb3BlLCAnaXNGaW5pdGUnLFxuICAgICAgdGhpcy5jcmVhdGVOYXRpdmVGdW5jdGlvbihpc0Zpbml0ZSwgZmFsc2UpKTtcblxuICB2YXIgc3RyRnVuY3Rpb25zID0gW1xuICAgIFtlc2NhcGUsICdlc2NhcGUnXSwgW3VuZXNjYXBlLCAndW5lc2NhcGUnXSxcbiAgICBbZGVjb2RlVVJJLCAnZGVjb2RlVVJJJ10sIFtkZWNvZGVVUklDb21wb25lbnQsICdkZWNvZGVVUklDb21wb25lbnQnXSxcbiAgICBbZW5jb2RlVVJJLCAnZW5jb2RlVVJJJ10sIFtlbmNvZGVVUklDb21wb25lbnQsICdlbmNvZGVVUklDb21wb25lbnQnXVxuICBdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ckZ1bmN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgIHZhciB3cmFwcGVyID0gKGZ1bmN0aW9uKG5hdGl2ZUZ1bmMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gbmF0aXZlRnVuYyhzdHIpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgLy8gZGVjb2RlVVJJKCcleHknKSB3aWxsIHRocm93IGFuIGVycm9yLiAgQ2F0Y2ggYW5kIHJldGhyb3cuXG4gICAgICAgICAgdGhpc0ludGVycHJldGVyLnRocm93RXhjZXB0aW9uKHRoaXNJbnRlcnByZXRlci5VUklfRVJST1IsIGUubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSkoc3RyRnVuY3Rpb25zW2ldWzBdKTtcbiAgICB0aGlzLnNldFByb3BlcnR5KHNjb3BlLCBzdHJGdW5jdGlvbnNbaV1bMV0sXG4gICAgICAgIHRoaXMuY3JlYXRlTmF0aXZlRnVuY3Rpb24od3JhcHBlciwgZmFsc2UpLFxuICAgICAgICBJbnRlcnByZXRlci5OT05FTlVNRVJBQkxFX0RFU0NSSVBUT1IpO1xuICB9XG4gIC8vIFByZXNlcnZlIHB1YmxpY2x5IHByb3BlcnRpZXMgZnJvbSBiZWluZyBwcnVuZWQvcmVuYW1lZCBieSBKUyBjb21waWxlcnMuXG4gIC8vIEFkZCBvdGhlcnMgYXMgbmVlZGVkLlxuICB0aGlzWydPQkpFQ1QnXSA9IHRoaXMuT0JKRUNUOyB0aGlzWydPQkpFQ1RfUFJPVE8nXSA9IHRoaXMuT0JKRUNUX1BST1RPO1xuICB0aGlzWydGVU5DVElPTiddID0gdGhpcy5GVU5DVElPTjsgdGhpc1snRlVOQ1RJT05fUFJPVE8nXSA9IHRoaXMuRlVOQ1RJT05fUFJPVE87XG4gIHRoaXNbJ0FSUkFZJ10gPSB0aGlzLkFSUkFZOyB0aGlzWydBUlJBWV9QUk9UTyddID0gdGhpcy5BUlJBWV9QUk9UTztcbiAgdGhpc1snUkVHRVhQJ10gPSB0aGlzLlJFR0VYUDsgdGhpc1snUkVHRVhQX1BST1RPJ10gPSB0aGlzLlJFR0VYUF9QUk9UTztcbiAgdGhpc1snREFURSddID0gdGhpcy5EQVRFOyB0aGlzWydEQVRFX1BST1RPJ10gPSB0aGlzLkRBVEVfUFJPVE87XG4gIC8vIFRoZSBmb2xsb3dpbmcgcHJvcGVydGllcyBhcmUgb2Jzb2xldGUuICBEbyBub3QgdXNlLlxuICB0aGlzWydVTkRFRklORUQnXSA9IHVuZGVmaW5lZDsgdGhpc1snTlVMTCddID0gbnVsbDsgdGhpc1snTkFOJ10gPSBOYU47XG4gIHRoaXNbJ1RSVUUnXSA9IHRydWU7IHRoaXNbJ0ZBTFNFJ10gPSBmYWxzZTsgdGhpc1snU1RSSU5HX0VNUFRZJ10gPSAnJztcbiAgdGhpc1snTlVNQkVSX1pFUk8nXSA9IDA7IHRoaXNbJ05VTUJFUl9PTkUnXSA9IDE7XG5cbiAgLy8gUnVuIGFueSB1c2VyLXByb3ZpZGVkIGluaXRpYWxpemF0aW9uLlxuICBpZiAodGhpcy5pbml0RnVuY18pIHtcbiAgICB0aGlzLmluaXRGdW5jXyh0aGlzLCBzY29wZSk7XG4gIH1cbn07XG5cbi8qKlxuICogSW5pdGlhbGl6ZSB0aGUgRnVuY3Rpb24gY2xhc3MuXG4gKiBAcGFyYW0geyFJbnRlcnByZXRlci5PYmplY3R9IHNjb3BlIEdsb2JhbCBzY29wZS5cbiAqL1xuSW50ZXJwcmV0ZXIucHJvdG90eXBlLmluaXRGdW5jdGlvbiA9IGZ1bmN0aW9uKHNjb3BlKSB7XG4gIHZhciB0aGlzSW50ZXJwcmV0ZXIgPSB0aGlzO1xuICB2YXIgd3JhcHBlcjtcbiAgdmFyIGlkZW50aWZpZXJSZWdleHAgPSAvXltBLVphLXpfJF1bXFx3JF0qJC87XG4gIC8vIEZ1bmN0aW9uIGNvbnN0cnVjdG9yLlxuICB3cmFwcGVyID0gZnVuY3Rpb24odmFyX2FyZ3MpIHtcbiAgICBpZiAodGhpc0ludGVycHJldGVyLmNhbGxlZFdpdGhOZXcoKSkge1xuICAgICAgLy8gQ2FsbGVkIGFzIG5ldyBGdW5jdGlvbigpLlxuICAgICAgdmFyIG5ld0Z1bmMgPSB0aGlzO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBDYWxsZWQgYXMgRnVuY3Rpb24oKS5cbiAgICAgIHZhciBuZXdGdW5jID1cbiAgICAgICAgICB0aGlzSW50ZXJwcmV0ZXIuY3JlYXRlT2JqZWN0UHJvdG8odGhpc0ludGVycHJldGVyLkZVTkNUSU9OX1BST1RPKTtcbiAgICB9XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIHZhciBjb2RlID0gU3RyaW5nKGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoIC0gMV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgY29kZSA9ICcnO1xuICAgIH1cbiAgICB2YXIgYXJnc1N0ciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCwgLTEpLmpvaW4oJywnKS50cmltKCk7XG4gICAgaWYgKGFyZ3NTdHIpIHtcbiAgICAgIHZhciBhcmdzID0gYXJnc1N0ci5zcGxpdCgvXFxzKixcXHMqLyk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5hbWUgPSBhcmdzW2ldO1xuICAgICAgICBpZiAoIWlkZW50aWZpZXJSZWdleHAudGVzdChuYW1lKSkge1xuICAgICAgICAgIHRoaXNJbnRlcnByZXRlci50aHJvd0V4Y2VwdGlvbih0aGlzSW50ZXJwcmV0ZXIuU1lOVEFYX0VSUk9SLFxuICAgICAgICAgICAgICAnSW52YWxpZCBmdW5jdGlvbiBhcmd1bWVudDogJyArIG5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBhcmdzU3RyID0gYXJncy5qb2luKCcsICcpO1xuICAgIH1cbiAgICAvLyBJbnRlcmVzdGluZ2x5LCB0aGUgc2NvcGUgZm9yIGNvbnN0cnVjdGVkIGZ1bmN0aW9ucyBpcyB0aGUgZ2xvYmFsIHNjb3BlLFxuICAgIC8vIGV2ZW4gaWYgdGhleSB3ZXJlIGNvbnN0cnVjdGVkIGluIHNvbWUgb3RoZXIgc2NvcGUuXG4gICAgbmV3RnVuYy5wYXJlbnRTY29wZSA9IHRoaXNJbnRlcnByZXRlci5nbG9iYWw7XG4gICAgLy8gQWNvcm4gbmVlZHMgdG8gcGFyc2UgY29kZSBpbiB0aGUgY29udGV4dCBvZiBhIGZ1bmN0aW9uIG9yIGVsc2UgJ3JldHVybidcbiAgICAvLyBzdGF0ZW1lbnRzIHdpbGwgYmUgc3ludGF4IGVycm9ycy5cbiAgICB0cnkge1xuICAgICAgdmFyIGFzdCA9IGFjb3JuLnBhcnNlKCcoZnVuY3Rpb24oJyArIGFyZ3NTdHIgKyAnKSB7JyArIGNvZGUgKyAnfSknLFxuICAgICAgICAgIEludGVycHJldGVyLlBBUlNFX09QVElPTlMpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIEFjb3JuIHRocmV3IGEgU3ludGF4RXJyb3IuICBSZXRocm93IGFzIGEgdHJhcHBhYmxlIGVycm9yLlxuICAgICAgdGhpc0ludGVycHJldGVyLnRocm93RXhjZXB0aW9uKHRoaXNJbnRlcnByZXRlci5TWU5UQVhfRVJST1IsXG4gICAgICAgICAgJ0ludmFsaWQgY29kZTogJyArIGUubWVzc2FnZSk7XG4gICAgfVxuICAgIGlmIChhc3RbJ2JvZHknXS5sZW5ndGggIT09IDEpIHtcbiAgICAgIC8vIEZ1bmN0aW9uKCdhJywgJ3JldHVybiBhICsgNjt9OyB7YWxlcnQoMSk7Jyk7XG4gICAgICB0aGlzSW50ZXJwcmV0ZXIudGhyb3dFeGNlcHRpb24odGhpc0ludGVycHJldGVyLlNZTlRBWF9FUlJPUixcbiAgICAgICAgICAnSW52YWxpZCBjb2RlIGluIGZ1bmN0aW9uIGJvZHkuJyk7XG4gICAgfVxuICAgIG5ld0Z1bmMubm9kZSA9IGFzdFsnYm9keSddWzBdWydleHByZXNzaW9uJ107XG4gICAgdGhpc0ludGVycHJldGVyLnNldFByb3BlcnR5KG5ld0Z1bmMsICdsZW5ndGgnLCBuZXdGdW5jLm5vZGVbJ2xlbmd0aCddLFxuICAgICAgICBJbnRlcnByZXRlci5SRUFET05MWV9OT05FTlVNRVJBQkxFX0RFU0NSSVBUT1IpO1xuICAgIHJldHVybiBuZXdGdW5jO1xuICB9O1xuICB3cmFwcGVyLmlkID0gdGhpcy5mdW5jdGlvbkNvdW50ZXJfKys7XG4gIHRoaXMuRlVOQ1RJT04gPSB0aGlzLmNyZWF0ZU9iamVjdFByb3RvKHRoaXMuRlVOQ1RJT05fUFJPVE8pO1xuXG4gIHRoaXMuc2V0UHJvcGVydHkoc2NvcGUsICdGdW5jdGlvbicsIHRoaXMuRlVOQ1RJT04pO1xuICAvLyBNYW51YWxseSBzZXR1cCB0eXBlIGFuZCBwcm90b3R5cGUgYmVjYXVzZSBjcmVhdGVPYmogZG9lc24ndCByZWNvZ25pemVcbiAgLy8gdGhpcyBvYmplY3QgYXMgYSBmdW5jdGlvbiAodGhpcy5GVU5DVElPTiBkaWQgbm90IGV4aXN0KS5cbiAgdGhpcy5zZXRQcm9wZXJ0eSh0aGlzLkZVTkNUSU9OLCAncHJvdG90eXBlJywgdGhpcy5GVU5DVElPTl9QUk9UTyxcbiAgICAgICAgICAgICAgICAgICBJbnRlcnByZXRlci5OT05FTlVNRVJBQkxFX0RFU0NSSVBUT1IpO1xuICB0aGlzLkZVTkNUSU9OLm5hdGl2ZUZ1bmMgPSB3cmFwcGVyO1xuXG4gIC8vIENvbmZpZ3VyZSBGdW5jdGlvbi5wcm90b3R5cGUuXG4gIHRoaXMuc2V0UHJvcGVydHkodGhpcy5GVU5DVElPTl9QUk9UTywgJ2NvbnN0cnVjdG9yJywgdGhpcy5GVU5DVElPTixcbiAgICAgICAgICAgICAgICAgICBJbnRlcnByZXRlci5OT05FTlVNRVJBQkxFX0RFU0NSSVBUT1IpO1xuICB0aGlzLkZVTkNUSU9OX1BST1RPLm5hdGl2ZUZ1bmMgPSBmdW5jdGlvbigpIHt9O1xuICB0aGlzLkZVTkNUSU9OX1BST1RPLm5hdGl2ZUZ1bmMuaWQgPSB0aGlzLmZ1bmN0aW9uQ291bnRlcl8rKztcbiAgdGhpcy5zZXRQcm9wZXJ0eSh0aGlzLkZVTkNUSU9OX1BST1RPLCAnbGVuZ3RoJywgMCxcbiAgICAgIEludGVycHJldGVyLlJFQURPTkxZX05PTkVOVU1FUkFCTEVfREVTQ1JJUFRPUik7XG5cbiAgdmFyIGJveFRoaXMgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIC8vIEluIG5vbi1zdHJpY3QgbW9kZSAndGhpcycgbXVzdCBiZSBhbiBvYmplY3QuXG4gICAgaWYgKCghdmFsdWUgfHwgIXZhbHVlLmlzT2JqZWN0KSAmJiAhdGhpc0ludGVycHJldGVyLmdldFNjb3BlKCkuc3RyaWN0KSB7XG4gICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAvLyAnVW5kZWZpbmVkJyBhbmQgJ251bGwnIGFyZSBjaGFuZ2VkIHRvIGdsb2JhbCBvYmplY3QuXG4gICAgICAgIHZhbHVlID0gdGhpc0ludGVycHJldGVyLmdsb2JhbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFByaW1pdGl2ZXMgbXVzdCBiZSBib3hlZCBpbiBub24tc3RyaWN0IG1vZGUuXG4gICAgICAgIHZhciBib3ggPSB0aGlzSW50ZXJwcmV0ZXIuY3JlYXRlT2JqZWN0UHJvdG8oXG4gICAgICAgICAgICB0aGlzSW50ZXJwcmV0ZXIuZ2V0UHJvdG90eXBlKHZhbHVlKSk7XG4gICAgICAgIGJveC5kYXRhID0gdmFsdWU7XG4gICAgICAgIHZhbHVlID0gYm94O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgd3JhcHBlciA9IGZ1bmN0aW9uKHRoaXNBcmcsIGFyZ3MpIHtcbiAgICB2YXIgc3RhdGUgPVxuICAgICAgICB0aGlzSW50ZXJwcmV0ZXIuc3RhdGVTdGFja1t0aGlzSW50ZXJwcmV0ZXIuc3RhdGVTdGFjay5sZW5ndGggLSAxXTtcbiAgICAvLyBSZXdyaXRlIHRoZSBjdXJyZW50ICdDYWxsRXhwcmVzc2lvbicgdG8gYXBwbHkgYSBkaWZmZXJlbnQgZnVuY3Rpb24uXG4gICAgc3RhdGUuZnVuY18gPSB0aGlzO1xuICAgIC8vIEFzc2lnbiB0aGUgJ3RoaXMnIG9iamVjdC5cbiAgICBzdGF0ZS5mdW5jVGhpc18gPSBib3hUaGlzKHRoaXNBcmcpO1xuICAgIC8vIEJpbmQgYW55IHByb3ZpZGVkIGFyZ3VtZW50cy5cbiAgICBzdGF0ZS5hcmd1bWVudHNfID0gW107XG4gICAgaWYgKGFyZ3MgIT09IG51bGwgJiYgYXJncyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoYXJncy5pc09iamVjdCkge1xuICAgICAgICBzdGF0ZS5hcmd1bWVudHNfID0gdGhpc0ludGVycHJldGVyLmFycmF5UHNldWRvVG9OYXRpdmUoYXJncyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzSW50ZXJwcmV0ZXIudGhyb3dFeGNlcHRpb24odGhpc0ludGVycHJldGVyLlRZUEVfRVJST1IsXG4gICAgICAgICAgICAnQ3JlYXRlTGlzdEZyb21BcnJheUxpa2UgY2FsbGVkIG9uIG5vbi1vYmplY3QnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgc3RhdGUuZG9uZUV4ZWNfID0gZmFsc2U7XG4gIH07XG4gIHRoaXMuc2V0TmF0aXZlRnVuY3Rpb25Qcm90b3R5cGUodGhpcy5GVU5DVElPTiwgJ2FwcGx5Jywgd3JhcHBlcik7XG5cbiAgd3JhcHBlciA9IGZ1bmN0aW9uKHRoaXNBcmcgLyosIHZhcl9hcmdzICovKSB7XG4gICAgdmFyIHN0YXRlID1cbiAgICAgICAgdGhpc0ludGVycHJldGVyLnN0YXRlU3RhY2tbdGhpc0ludGVycHJldGVyLnN0YXRlU3RhY2subGVuZ3RoIC0gMV07XG4gICAgLy8gUmV3cml0ZSB0aGUgY3VycmVudCAnQ2FsbEV4cHJlc3Npb24nIHRvIGNhbGwgYSBkaWZmZXJlbnQgZnVuY3Rpb24uXG4gICAgc3RhdGUuZnVuY18gPSB0aGlzO1xuICAgIC8vIEFzc2lnbiB0aGUgJ3RoaXMnIG9iamVjdC5cbiAgICBzdGF0ZS5mdW5jVGhpc18gPSBib3hUaGlzKHRoaXNBcmcpO1xuICAgIC8vIEJpbmQgYW55IHByb3ZpZGVkIGFyZ3VtZW50cy5cbiAgICBzdGF0ZS5hcmd1bWVudHNfID0gW107XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHN0YXRlLmFyZ3VtZW50c18ucHVzaChhcmd1bWVudHNbaV0pO1xuICAgIH1cbiAgICBzdGF0ZS5kb25lRXhlY18gPSBmYWxzZTtcbiAgfTtcbiAgdGhpcy5zZXROYXRpdmVGdW5jdGlvblByb3RvdHlwZSh0aGlzLkZVTkNUSU9OLCAnY2FsbCcsIHdyYXBwZXIpO1xuXG4gIHRoaXMucG9seWZpbGxzXy5wdXNoKFxuLy8gUG9seWZpbGwgY29waWVkIGZyb206XG4vLyBkZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX29iamVjdHMvRnVuY3Rpb24vYmluZFxuXCJPYmplY3QuZGVmaW5lUHJvcGVydHkoRnVuY3Rpb24ucHJvdG90eXBlLCAnYmluZCcsXCIsXG4gICAgXCJ7Y29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSwgdmFsdWU6XCIsXG4gIFwiZnVuY3Rpb24ob1RoaXMpIHtcIixcbiAgICBcImlmICh0eXBlb2YgdGhpcyAhPT0gJ2Z1bmN0aW9uJykge1wiLFxuICAgICAgXCJ0aHJvdyBUeXBlRXJyb3IoJ1doYXQgaXMgdHJ5aW5nIHRvIGJlIGJvdW5kIGlzIG5vdCBjYWxsYWJsZScpO1wiLFxuICAgIFwifVwiLFxuICAgIFwidmFyIGFBcmdzICAgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLFwiLFxuICAgICAgICBcImZUb0JpbmQgPSB0aGlzLFwiLFxuICAgICAgICBcImZOT1AgICAgPSBmdW5jdGlvbigpIHt9LFwiLFxuICAgICAgICBcImZCb3VuZCAgPSBmdW5jdGlvbigpIHtcIixcbiAgICAgICAgICBcInJldHVybiBmVG9CaW5kLmFwcGx5KHRoaXMgaW5zdGFuY2VvZiBmTk9QXCIsXG4gICAgICAgICAgICAgICAgIFwiPyB0aGlzXCIsXG4gICAgICAgICAgICAgICAgIFwiOiBvVGhpcyxcIixcbiAgICAgICAgICAgICAgICAgXCJhQXJncy5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1wiLFxuICAgICAgICBcIn07XCIsXG4gICAgXCJpZiAodGhpcy5wcm90b3R5cGUpIHtcIixcbiAgICAgIFwiZk5PUC5wcm90b3R5cGUgPSB0aGlzLnByb3RvdHlwZTtcIixcbiAgICBcIn1cIixcbiAgICBcImZCb3VuZC5wcm90b3R5cGUgPSBuZXcgZk5PUCgpO1wiLFxuICAgIFwicmV0dXJuIGZCb3VuZDtcIixcbiAgXCJ9XCIsXG5cIn0pO1wiLFxuXCJcIik7XG5cbiAgLy8gRnVuY3Rpb24gaGFzIG5vIHBhcmVudCB0byBpbmhlcml0IGZyb20sIHNvIGl0IG5lZWRzIGl0cyBvd24gbWFuZGF0b3J5XG4gIC8vIHRvU3RyaW5nIGFuZCB2YWx1ZU9mIGZ1bmN0aW9ucy5cbiAgd3JhcHBlciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBTdHJpbmcodGhpcyk7XG4gIH07XG4gIHRoaXMuc2V0TmF0aXZlRnVuY3Rpb25Qcm90b3R5cGUodGhpcy5GVU5DVElPTiwgJ3RvU3RyaW5nJywgd3JhcHBlcik7XG4gIHRoaXMuc2V0UHJvcGVydHkodGhpcy5GVU5DVElPTiwgJ3RvU3RyaW5nJyxcbiAgICAgIHRoaXMuY3JlYXRlTmF0aXZlRnVuY3Rpb24od3JhcHBlciwgZmFsc2UpLFxuICAgICAgSW50ZXJwcmV0ZXIuTk9ORU5VTUVSQUJMRV9ERVNDUklQVE9SKTtcbiAgd3JhcHBlciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlT2YoKTtcbiAgfTtcbiAgdGhpcy5zZXROYXRpdmVGdW5jdGlvblByb3RvdHlwZSh0aGlzLkZVTkNUSU9OLCAndmFsdWVPZicsIHdyYXBwZXIpO1xuICB0aGlzLnNldFByb3BlcnR5KHRoaXMuRlVOQ1RJT04sICd2YWx1ZU9mJyxcbiAgICAgIHRoaXMuY3JlYXRlTmF0aXZlRnVuY3Rpb24od3JhcHBlciwgZmFsc2UpLFxuICAgICAgSW50ZXJwcmV0ZXIuTk9ORU5VTUVSQUJMRV9ERVNDUklQVE9SKTtcbn07XG5cbi8qKlxuICogSW5pdGlhbGl6ZSB0aGUgT2JqZWN0IGNsYXNzLlxuICogQHBhcmFtIHshSW50ZXJwcmV0ZXIuT2JqZWN0fSBzY29wZSBHbG9iYWwgc2NvcGUuXG4gKi9cbkludGVycHJldGVyLnByb3RvdHlwZS5pbml0T2JqZWN0ID0gZnVuY3Rpb24oc2NvcGUpIHtcbiAgdmFyIHRoaXNJbnRlcnByZXRlciA9IHRoaXM7XG4gIHZhciB3cmFwcGVyO1xuICAvLyBPYmplY3QgY29uc3RydWN0b3IuXG4gIHdyYXBwZXIgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKSB7XG4gICAgICAvLyBDcmVhdGUgYSBuZXcgb2JqZWN0LlxuICAgICAgaWYgKHRoaXNJbnRlcnByZXRlci5jYWxsZWRXaXRoTmV3KCkpIHtcbiAgICAgICAgLy8gQ2FsbGVkIGFzIG5ldyBPYmplY3QoKS5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBDYWxsZWQgYXMgT2JqZWN0KCkuXG4gICAgICAgIHJldHVybiB0aGlzSW50ZXJwcmV0ZXIuY3JlYXRlT2JqZWN0UHJvdG8odGhpc0ludGVycHJldGVyLk9CSkVDVF9QUk9UTyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghdmFsdWUuaXNPYmplY3QpIHtcbiAgICAgIC8vIFdyYXAgdGhlIHZhbHVlIGFzIGFuIG9iamVjdC5cbiAgICAgIHZhciBib3ggPSB0aGlzSW50ZXJwcmV0ZXIuY3JlYXRlT2JqZWN0UHJvdG8oXG4gICAgICAgICAgdGhpc0ludGVycHJldGVyLmdldFByb3RvdHlwZSh2YWx1ZSkpO1xuICAgICAgYm94LmRhdGEgPSB2YWx1ZTtcbiAgICAgIHJldHVybiBib3g7XG4gICAgfVxuICAgIC8vIFJldHVybiB0aGUgcHJvdmlkZWQgb2JqZWN0LlxuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcbiAgdGhpcy5PQkpFQ1QgPSB0aGlzLmNyZWF0ZU5hdGl2ZUZ1bmN0aW9uKHdyYXBwZXIsIHRydWUpO1xuICAvLyBUaHJvdyBhd2F5IHRoZSBjcmVhdGVkIHByb3RvdHlwZSBhbmQgdXNlIHRoZSByb290IHByb3RvdHlwZS5cbiAgdGhpcy5zZXRQcm9wZXJ0eSh0aGlzLk9CSkVDVCwgJ3Byb3RvdHlwZScsIHRoaXMuT0JKRUNUX1BST1RPLFxuICAgICAgICAgICAgICAgICAgIEludGVycHJldGVyLk5PTkVOVU1FUkFCTEVfREVTQ1JJUFRPUik7XG4gIHRoaXMuc2V0UHJvcGVydHkodGhpcy5PQkpFQ1RfUFJPVE8sICdjb25zdHJ1Y3RvcicsIHRoaXMuT0JKRUNULFxuICAgICAgICAgICAgICAgICAgIEludGVycHJldGVyLk5PTkVOVU1FUkFCTEVfREVTQ1JJUFRPUik7XG4gIHRoaXMuc2V0UHJvcGVydHkoc2NvcGUsICdPYmplY3QnLCB0aGlzLk9CSkVDVCk7XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgcHJvdmlkZWQgdmFsdWUgaXMgbnVsbCBvciB1bmRlZmluZWQuXG4gICAqIElmIHNvLCB0aGVuIHRocm93IGFuIGVycm9yIGluIHRoZSBjYWxsIHN0YWNrLlxuICAgKiBAcGFyYW0ge0ludGVycHJldGVyLlZhbHVlfSB2YWx1ZSBWYWx1ZSB0byBjaGVjay5cbiAgICovXG4gIHZhciB0aHJvd0lmTnVsbFVuZGVmaW5lZCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHRoaXNJbnRlcnByZXRlci50aHJvd0V4Y2VwdGlvbih0aGlzSW50ZXJwcmV0ZXIuVFlQRV9FUlJPUixcbiAgICAgICAgICBcIkNhbm5vdCBjb252ZXJ0ICdcIiArIHZhbHVlICsgXCInIHRvIG9iamVjdFwiKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gU3RhdGljIG1ldGhvZHMgb24gT2JqZWN0LlxuICB3cmFwcGVyID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdGhyb3dJZk51bGxVbmRlZmluZWQob2JqKTtcbiAgICB2YXIgcHJvcHMgPSBvYmouaXNPYmplY3QgPyBvYmoucHJvcGVydGllcyA6IG9iajtcbiAgICByZXR1cm4gdGhpc0ludGVycHJldGVyLmFycmF5TmF0aXZlVG9Qc2V1ZG8oXG4gICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHByb3BzKSk7XG4gIH07XG4gIHRoaXMuc2V0UHJvcGVydHkodGhpcy5PQkpFQ1QsICdnZXRPd25Qcm9wZXJ0eU5hbWVzJyxcbiAgICAgIHRoaXMuY3JlYXRlTmF0aXZlRnVuY3Rpb24od3JhcHBlciwgZmFsc2UpLFxuICAgICAgSW50ZXJwcmV0ZXIuTk9ORU5VTUVSQUJMRV9ERVNDUklQVE9SKTtcblxuICB3cmFwcGVyID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdGhyb3dJZk51bGxVbmRlZmluZWQob2JqKTtcbiAgICBpZiAob2JqLmlzT2JqZWN0KSB7XG4gICAgICBvYmogPSBvYmoucHJvcGVydGllcztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNJbnRlcnByZXRlci5hcnJheU5hdGl2ZVRvUHNldWRvKE9iamVjdC5rZXlzKG9iaikpO1xuICB9O1xuICB0aGlzLnNldFByb3BlcnR5KHRoaXMuT0JKRUNULCAna2V5cycsXG4gICAgICB0aGlzLmNyZWF0ZU5hdGl2ZUZ1bmN0aW9uKHdyYXBwZXIsIGZhbHNlKSxcbiAgICAgIEludGVycHJldGVyLk5PTkVOVU1FUkFCTEVfREVTQ1JJUFRPUik7XG5cbiAgd3JhcHBlciA9IGZ1bmN0aW9uKHByb3RvKSB7XG4gICAgLy8gU3VwcG9ydCBmb3IgdGhlIHNlY29uZCBhcmd1bWVudCBpcyB0aGUgcmVzcG9uc2liaWxpdHkgb2YgYSBwb2x5ZmlsbC5cbiAgICBpZiAocHJvdG8gPT09IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzSW50ZXJwcmV0ZXIuY3JlYXRlT2JqZWN0UHJvdG8obnVsbCk7XG4gICAgfVxuICAgIGlmIChwcm90byA9PT0gdW5kZWZpbmVkIHx8ICFwcm90by5pc09iamVjdCkge1xuICAgICAgdGhpc0ludGVycHJldGVyLnRocm93RXhjZXB0aW9uKHRoaXNJbnRlcnByZXRlci5UWVBFX0VSUk9SLFxuICAgICAgICAgICdPYmplY3QgcHJvdG90eXBlIG1heSBvbmx5IGJlIGFuIE9iamVjdCBvciBudWxsJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzSW50ZXJwcmV0ZXIuY3JlYXRlT2JqZWN0UHJvdG8ocHJvdG8pO1xuICB9O1xuICB0aGlzLnNldFByb3BlcnR5KHRoaXMuT0JKRUNULCAnY3JlYXRlJyxcbiAgICAgIHRoaXMuY3JlYXRlTmF0aXZlRnVuY3Rpb24od3JhcHBlciwgZmFsc2UpLFxuICAgICAgSW50ZXJwcmV0ZXIuTk9ORU5VTUVSQUJMRV9ERVNDUklQVE9SKTtcblxuICAvLyBBZGQgYSBwb2x5ZmlsbCB0byBoYW5kbGUgY3JlYXRlJ3Mgc2Vjb25kIGFyZ3VtZW50LlxuICB0aGlzLnBvbHlmaWxsc18ucHVzaChcblwiKGZ1bmN0aW9uKCkge1wiLFxuICBcInZhciBjcmVhdGVfID0gT2JqZWN0LmNyZWF0ZTtcIixcbiAgXCJPYmplY3QuY3JlYXRlID0gZnVuY3Rpb24ocHJvdG8sIHByb3BzKSB7XCIsXG4gICAgXCJ2YXIgb2JqID0gY3JlYXRlXyhwcm90byk7XCIsXG4gICAgXCJwcm9wcyAmJiBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhvYmosIHByb3BzKTtcIixcbiAgICBcInJldHVybiBvYmo7XCIsXG4gIFwifTtcIixcblwifSkoKTtcIixcblwiXCIpO1xuXG4gIHdyYXBwZXIgPSBmdW5jdGlvbihvYmosIHByb3AsIGRlc2NyaXB0b3IpIHtcbiAgICBwcm9wID0gU3RyaW5nKHByb3ApO1xuICAgIGlmICghb2JqIHx8ICFvYmouaXNPYmplY3QpIHtcbiAgICAgIHRoaXNJbnRlcnByZXRlci50aHJvd0V4Y2VwdGlvbih0aGlzSW50ZXJwcmV0ZXIuVFlQRV9FUlJPUixcbiAgICAgICAgICAnT2JqZWN0LmRlZmluZVByb3BlcnR5IGNhbGxlZCBvbiBub24tb2JqZWN0Jyk7XG4gICAgfVxuICAgIGlmICghZGVzY3JpcHRvciB8fCAhZGVzY3JpcHRvci5pc09iamVjdCkge1xuICAgICAgdGhpc0ludGVycHJldGVyLnRocm93RXhjZXB0aW9uKHRoaXNJbnRlcnByZXRlci5UWVBFX0VSUk9SLFxuICAgICAgICAgICdQcm9wZXJ0eSBkZXNjcmlwdGlvbiBtdXN0IGJlIGFuIG9iamVjdCcpO1xuICAgIH1cbiAgICBpZiAoIW9iai5wcm9wZXJ0aWVzW3Byb3BdICYmIG9iai5wcmV2ZW50RXh0ZW5zaW9ucykge1xuICAgICAgdGhpc0ludGVycHJldGVyLnRocm93RXhjZXB0aW9uKHRoaXNJbnRlcnByZXRlci5UWVBFX0VSUk9SLFxuICAgICAgICAgIFwiQ2FuJ3QgZGVmaW5lIHByb3BlcnR5ICdcIiArIHByb3AgKyBcIicsIG9iamVjdCBpcyBub3QgZXh0ZW5zaWJsZVwiKTtcbiAgICB9XG4gICAgLy8gVGhlIHBvbHlmaWxsIGd1YXJhbnRlZXMgbm8gaW5oZXJpdGFuY2UgYW5kIG5vIGdldHRlciBmdW5jdGlvbnMuXG4gICAgLy8gVGhlcmVmb3JlIHRoZSBkZXNjcmlwdG9yIHByb3BlcnRpZXMgbWFwIGlzIHRoZSBuYXRpdmUgb2JqZWN0IG5lZWRlZC5cbiAgICB0aGlzSW50ZXJwcmV0ZXIuc2V0UHJvcGVydHkob2JqLCBwcm9wLCBJbnRlcnByZXRlci5WQUxVRV9JTl9ERVNDUklQVE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdG9yLnByb3BlcnRpZXMpO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG4gIHRoaXMuc2V0UHJvcGVydHkodGhpcy5PQkpFQ1QsICdkZWZpbmVQcm9wZXJ0eScsXG4gICAgICB0aGlzLmNyZWF0ZU5hdGl2ZUZ1bmN0aW9uKHdyYXBwZXIsIGZhbHNlKSxcbiAgICAgIEludGVycHJldGVyLk5PTkVOVU1FUkFCTEVfREVTQ1JJUFRPUik7XG5cbiAgdGhpcy5wb2x5ZmlsbHNfLnB1c2goXG4vLyBGbGF0dGVuIHRoZSBkZXNjcmlwdG9yIHRvIHJlbW92ZSBhbnkgaW5oZXJpdGFuY2Ugb3IgZ2V0dGVyIGZ1bmN0aW9ucy5cblwiKGZ1bmN0aW9uKCkge1wiLFxuICBcInZhciBkZWZpbmVQcm9wZXJ0eV8gPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XCIsXG4gIFwiT2JqZWN0LmRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24ob2JqLCBwcm9wLCBkMSkge1wiLFxuICAgIFwidmFyIGQyID0ge307XCIsXG4gICAgXCJpZiAoJ2NvbmZpZ3VyYWJsZScgaW4gZDEpIGQyLmNvbmZpZ3VyYWJsZSA9IGQxLmNvbmZpZ3VyYWJsZTtcIixcbiAgICBcImlmICgnZW51bWVyYWJsZScgaW4gZDEpIGQyLmVudW1lcmFibGUgPSBkMS5lbnVtZXJhYmxlO1wiLFxuICAgIFwiaWYgKCd3cml0YWJsZScgaW4gZDEpIGQyLndyaXRhYmxlID0gZDEud3JpdGFibGU7XCIsXG4gICAgXCJpZiAoJ3ZhbHVlJyBpbiBkMSkgZDIudmFsdWUgPSBkMS52YWx1ZTtcIixcbiAgICBcImlmICgnZ2V0JyBpbiBkMSkgZDIuZ2V0ID0gZDEuZ2V0O1wiLFxuICAgIFwiaWYgKCdzZXQnIGluIGQxKSBkMi5zZXQgPSBkMS5zZXQ7XCIsXG4gICAgXCJyZXR1cm4gZGVmaW5lUHJvcGVydHlfKG9iaiwgcHJvcCwgZDIpO1wiLFxuICBcIn07XCIsXG5cIn0pKCk7XCIsXG5cblwiT2JqZWN0LmRlZmluZVByb3BlcnR5KE9iamVjdCwgJ2RlZmluZVByb3BlcnRpZXMnLFwiLFxuICAgIFwie2NvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUsIHZhbHVlOlwiLFxuICBcImZ1bmN0aW9uKG9iaiwgcHJvcHMpIHtcIixcbiAgICBcInZhciBrZXlzID0gT2JqZWN0LmtleXMocHJvcHMpO1wiLFxuICAgIFwiZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XCIsXG4gICAgICBcIk9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleXNbaV0sIHByb3BzW2tleXNbaV1dKTtcIixcbiAgICBcIn1cIixcbiAgICBcInJldHVybiBvYmo7XCIsXG4gIFwifVwiLFxuXCJ9KTtcIixcblwiXCIpO1xuXG4gIHdyYXBwZXIgPSBmdW5jdGlvbihvYmosIHByb3ApIHtcbiAgICBpZiAoIW9iaiB8fCAhb2JqLmlzT2JqZWN0KSB7XG4gICAgICB0aGlzSW50ZXJwcmV0ZXIudGhyb3dFeGNlcHRpb24odGhpc0ludGVycHJldGVyLlRZUEVfRVJST1IsXG4gICAgICAgICAgJ09iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgY2FsbGVkIG9uIG5vbi1vYmplY3QnKTtcbiAgICB9XG4gICAgcHJvcCA9IFN0cmluZyhwcm9wKTtcbiAgICBpZiAoIShwcm9wIGluIG9iai5wcm9wZXJ0aWVzKSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iai5wcm9wZXJ0aWVzLCBwcm9wKTtcbiAgICB2YXIgZ2V0dGVyID0gb2JqLmdldHRlcltwcm9wXTtcbiAgICB2YXIgc2V0dGVyID0gb2JqLnNldHRlcltwcm9wXTtcblxuICAgIGlmIChnZXR0ZXIgfHwgc2V0dGVyKSB7XG4gICAgICBkZXNjcmlwdG9yLmdldCA9IGdldHRlcjtcbiAgICAgIGRlc2NyaXB0b3Iuc2V0ID0gc2V0dGVyO1xuICAgICAgZGVsZXRlIGRlc2NyaXB0b3IudmFsdWU7XG4gICAgICBkZWxldGUgZGVzY3JpcHRvci53cml0YWJsZTtcbiAgICB9XG4gICAgLy8gUHJlc2VydmUgdmFsdWUsIGJ1dCByZW1vdmUgaXQgZm9yIHRoZSBuYXRpdmVUb1BzZXVkbyBjYWxsLlxuICAgIHZhciB2YWx1ZSA9IGRlc2NyaXB0b3IudmFsdWU7XG4gICAgdmFyIGhhc1ZhbHVlID0gJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yO1xuICAgIGRlbGV0ZSBkZXNjcmlwdG9yLnZhbHVlO1xuICAgIHZhciBwc2V1ZG9EZXNjcmlwdG9yID0gdGhpc0ludGVycHJldGVyLm5hdGl2ZVRvUHNldWRvKGRlc2NyaXB0b3IpO1xuICAgIGlmIChoYXNWYWx1ZSkge1xuICAgICAgdGhpc0ludGVycHJldGVyLnNldFByb3BlcnR5KHBzZXVkb0Rlc2NyaXB0b3IsICd2YWx1ZScsIHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHBzZXVkb0Rlc2NyaXB0b3I7XG4gIH07XG4gIHRoaXMuc2V0UHJvcGVydHkodGhpcy5PQkpFQ1QsICdnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3InLFxuICAgICAgdGhpcy5jcmVhdGVOYXRpdmVGdW5jdGlvbih3cmFwcGVyLCBmYWxzZSksXG4gICAgICBJbnRlcnByZXRlci5OT05FTlVNRVJBQkxFX0RFU0NSSVBUT1IpO1xuXG4gIHdyYXBwZXIgPSBmdW5jdGlvbihvYmopIHtcbiAgICB0aHJvd0lmTnVsbFVuZGVmaW5lZChvYmopO1xuICAgIHJldHVybiB0aGlzSW50ZXJwcmV0ZXIuZ2V0UHJvdG90eXBlKG9iaik7XG4gIH07XG4gIHRoaXMuc2V0UHJvcGVydHkodGhpcy5PQkpFQ1QsICdnZXRQcm90b3R5cGVPZicsXG4gICAgICB0aGlzLmNyZWF0ZU5hdGl2ZUZ1bmN0aW9uKHdyYXBwZXIsIGZhbHNlKSxcbiAgICAgIEludGVycHJldGVyLk5PTkVOVU1FUkFCTEVfREVTQ1JJUFRPUik7XG5cbiAgd3JhcHBlciA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBCb29sZWFuKG9iaikgJiYgIW9iai5wcmV2ZW50RXh0ZW5zaW9ucztcbiAgfTtcbiAgdGhpcy5zZXRQcm9wZXJ0eSh0aGlzLk9CSkVDVCwgJ2lzRXh0ZW5zaWJsZScsXG4gICAgICB0aGlzLmNyZWF0ZU5hdGl2ZUZ1bmN0aW9uKHdyYXBwZXIsIGZhbHNlKSxcbiAgICAgIEludGVycHJldGVyLk5PTkVOVU1FUkFCTEVfREVTQ1JJUFRPUik7XG5cbiAgd3JhcHBlciA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogJiYgb2JqLmlzT2JqZWN0KSB7XG4gICAgICBvYmoucHJldmVudEV4dGVuc2lvbnMgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9O1xuICB0aGlzLnNldFByb3BlcnR5KHRoaXMuT0JKRUNULCAncHJldmVudEV4dGVuc2lvbnMnLFxuICAgICAgdGhpcy5jcmVhdGVOYXRpdmVGdW5jdGlvbih3cmFwcGVyLCBmYWxzZSksXG4gICAgICBJbnRlcnByZXRlci5OT05FTlVNRVJBQkxFX0RFU0NSSVBUT1IpO1xuXG4gIC8vIEluc3RhbmNlIG1ldGhvZHMgb24gT2JqZWN0LlxuICB0aGlzLnNldE5hdGl2ZUZ1bmN0aW9uUHJvdG90eXBlKHRoaXMuT0JKRUNULCAndG9TdHJpbmcnLFxuICAgICAgSW50ZXJwcmV0ZXIuT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyk7XG4gIHRoaXMuc2V0TmF0aXZlRnVuY3Rpb25Qcm90b3R5cGUodGhpcy5PQkpFQ1QsICd0b0xvY2FsZVN0cmluZycsXG4gICAgICBJbnRlcnByZXRlci5PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKTtcbiAgdGhpcy5zZXROYXRpdmVGdW5jdGlvblByb3RvdHlwZSh0aGlzLk9CSkVDVCwgJ3ZhbHVlT2YnLFxuICAgICAgSW50ZXJwcmV0ZXIuT2JqZWN0LnByb3RvdHlwZS52YWx1ZU9mKTtcblxuICB3cmFwcGVyID0gZnVuY3Rpb24ocHJvcCkge1xuICAgIHRocm93SWZOdWxsVW5kZWZpbmVkKHRoaXMpO1xuICAgIGlmICghdGhpcy5pc09iamVjdCkge1xuICAgICAgcmV0dXJuIHRoaXMuaGFzT3duUHJvcGVydHkocHJvcCk7XG4gICAgfVxuICAgIHJldHVybiBTdHJpbmcocHJvcCkgaW4gdGhpcy5wcm9wZXJ0aWVzO1xuICB9O1xuICB0aGlzLnNldE5hdGl2ZUZ1bmN0aW9uUHJvdG90eXBlKHRoaXMuT0JKRUNULCAnaGFzT3duUHJvcGVydHknLCB3cmFwcGVyKTtcblxuICB3cmFwcGVyID0gZnVuY3Rpb24ocHJvcCkge1xuICAgIHRocm93SWZOdWxsVW5kZWZpbmVkKHRoaXMpO1xuICAgIGlmICghdGhpcy5pc09iamVjdCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcGVydHlJc0VudW1lcmFibGUocHJvcCk7XG4gICAgfVxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodGhpcy5wcm9wZXJ0aWVzLCBwcm9wKTtcbiAgfTtcbiAgdGhpcy5zZXROYXRpdmVGdW5jdGlvblByb3RvdHlwZSh0aGlzLk9CSkVDVCwgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJywgd3JhcHBlcik7XG5cbiAgd3JhcHBlciA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAvLyBOb3RlLCBjaXJjdWxhciBsb29wcyBzaG91bGRuJ3QgYmUgcG9zc2libGUuXG4gICAgICBvYmogPSB0aGlzSW50ZXJwcmV0ZXIuZ2V0UHJvdG90eXBlKG9iaik7XG4gICAgICBpZiAoIW9iaikge1xuICAgICAgICAvLyBObyBwYXJlbnQ7IHJlYWNoZWQgdGhlIHRvcC5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKG9iaiA9PT0gdGhpcykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIHRoaXMuc2V0TmF0aXZlRnVuY3Rpb25Qcm90b3R5cGUodGhpcy5PQkpFQ1QsICdpc1Byb3RvdHlwZU9mJywgIHdyYXBwZXIpO1xufTtcblxuLyoqXG4gKiBJbml0aWFsaXplIHRoZSBBcnJheSBjbGFzcy5cbiAqIEBwYXJhbSB7IUludGVycHJldGVyLk9iamVjdH0gc2NvcGUgR2xvYmFsIHNjb3BlLlxuICovXG5JbnRlcnByZXRlci5wcm90b3R5cGUuaW5pdEFycmF5ID0gZnVuY3Rpb24oc2NvcGUpIHtcbiAgdmFyIHRoaXNJbnRlcnByZXRlciA9IHRoaXM7XG4gIHZhciB3cmFwcGVyO1xuICAvLyBBcnJheSBjb25zdHJ1Y3Rvci5cbiAgd3JhcHBlciA9IGZ1bmN0aW9uKHZhcl9hcmdzKSB7XG4gICAgaWYgKHRoaXNJbnRlcnByZXRlci5jYWxsZWRXaXRoTmV3KCkpIHtcbiAgICAgIC8vIENhbGxlZCBhcyBuZXcgQXJyYXkoKS5cbiAgICAgIHZhciBuZXdBcnJheSA9IHRoaXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIENhbGxlZCBhcyBBcnJheSgpLlxuICAgICAgdmFyIG5ld0FycmF5ID1cbiAgICAgICAgICB0aGlzSW50ZXJwcmV0ZXIuY3JlYXRlT2JqZWN0UHJvdG8odGhpc0ludGVycHJldGVyLkFSUkFZX1BST1RPKTtcbiAgICB9XG4gICAgdmFyIGZpcnN0ID0gYXJndW1lbnRzWzBdO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxICYmIHR5cGVvZiBmaXJzdCA9PT0gJ251bWJlcicpIHtcbiAgICAgIGlmIChpc05hTihJbnRlcnByZXRlci5sZWdhbEFycmF5TGVuZ3RoKGZpcnN0KSkpIHtcbiAgICAgICAgdGhpc0ludGVycHJldGVyLnRocm93RXhjZXB0aW9uKHRoaXNJbnRlcnByZXRlci5SQU5HRV9FUlJPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdJbnZhbGlkIGFycmF5IGxlbmd0aCcpO1xuICAgICAgfVxuICAgICAgbmV3QXJyYXkucHJvcGVydGllcy5sZW5ndGggPSBmaXJzdDtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbmV3QXJyYXkucHJvcGVydGllc1tpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgIH1cbiAgICAgIG5ld0FycmF5LnByb3BlcnRpZXMubGVuZ3RoID0gaTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld0FycmF5O1xuICB9O1xuICB0aGlzLkFSUkFZID0gdGhpcy5jcmVhdGVOYXRpdmVGdW5jdGlvbih3cmFwcGVyLCB0cnVlKTtcbiAgdGhpcy5BUlJBWV9QUk9UTyA9IHRoaXMuQVJSQVkucHJvcGVydGllc1sncHJvdG90eXBlJ107XG4gIHRoaXMuc2V0UHJvcGVydHkoc2NvcGUsICdBcnJheScsIHRoaXMuQVJSQVkpO1xuXG4gIC8vIFN0YXRpYyBtZXRob2RzIG9uIEFycmF5LlxuICB3cmFwcGVyID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiAmJiBvYmouY2xhc3MgPT09ICdBcnJheSc7XG4gIH07XG4gIHRoaXMuc2V0UHJvcGVydHkodGhpcy5BUlJBWSwgJ2lzQXJyYXknLFxuICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlTmF0aXZlRnVuY3Rpb24od3JhcHBlciwgZmFsc2UpLFxuICAgICAgICAgICAgICAgICAgIEludGVycHJldGVyLk5PTkVOVU1FUkFCTEVfREVTQ1JJUFRPUik7XG5cbiAgLy8gSW5zdGFuY2UgbWV0aG9kcyBvbiBBcnJheS5cbiAgd3JhcHBlciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUucG9wLmNhbGwodGhpcy5wcm9wZXJ0aWVzKTtcbiAgfTtcbiAgdGhpcy5zZXROYXRpdmVGdW5jdGlvblByb3RvdHlwZSh0aGlzLkFSUkFZLCAncG9wJywgd3JhcHBlcik7XG5cbiAgd3JhcHBlciA9IGZ1bmN0aW9uKHZhcl9hcmdzKSB7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHRoaXMucHJvcGVydGllcywgYXJndW1lbnRzKTtcbiAgfTtcbiAgdGhpcy5zZXROYXRpdmVGdW5jdGlvblByb3RvdHlwZSh0aGlzLkFSUkFZLCAncHVzaCcsIHdyYXBwZXIpO1xuXG4gIHdyYXBwZXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNoaWZ0LmNhbGwodGhpcy5wcm9wZXJ0aWVzKTtcbiAgfTtcbiAgdGhpcy5zZXROYXRpdmVGdW5jdGlvblByb3RvdHlwZSh0aGlzLkFSUkFZLCAnc2hpZnQnLCB3cmFwcGVyKTtcblxuICB3cmFwcGVyID0gZnVuY3Rpb24odmFyX2FyZ3MpIHtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnVuc2hpZnQuYXBwbHkodGhpcy5wcm9wZXJ0aWVzLCBhcmd1bWVudHMpO1xuICB9O1xuICB0aGlzLnNldE5hdGl2ZUZ1bmN0aW9uUHJvdG90eXBlKHRoaXMuQVJSQVksICd1bnNoaWZ0Jywgd3JhcHBlcik7XG5cbiAgd3JhcHBlciA9IGZ1bmN0aW9uKCkge1xuICAgIEFycmF5LnByb3RvdHlwZS5yZXZlcnNlLmNhbGwodGhpcy5wcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgdGhpcy5zZXROYXRpdmVGdW5jdGlvblByb3RvdHlwZSh0aGlzLkFSUkFZLCAncmV2ZXJzZScsIHdyYXBwZXIpO1xuXG4gIHdyYXBwZXIgPSBmdW5jdGlvbihpbmRleCwgaG93bWFueSAvKiwgdmFyX2FyZ3MqLykge1xuICAgIHZhciBsaXN0ID0gQXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseSh0aGlzLnByb3BlcnRpZXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXNJbnRlcnByZXRlci5hcnJheU5hdGl2ZVRvUHNldWRvKGxpc3QpO1xuICB9O1xuICB0aGlzLnNldE5hdGl2ZUZ1bmN0aW9uUHJvdG90eXBlKHRoaXMuQVJSQVksICdzcGxpY2UnLCB3cmFwcGVyKTtcblxuICB3cmFwcGVyID0gZnVuY3Rpb24ob3B0X2JlZ2luLCBvcHRfZW5kKSB7XG4gICAgdmFyIGxpc3QgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLnByb3BlcnRpZXMsIG9wdF9iZWdpbiwgb3B0X2VuZCk7XG4gICAgcmV0dXJuIHRoaXNJbnRlcnByZXRlci5hcnJheU5hdGl2ZVRvUHNldWRvKGxpc3QpO1xuICB9O1xuICB0aGlzLnNldE5hdGl2ZUZ1bmN0aW9uUHJvdG90eXBlKHRoaXMuQVJSQVksICdzbGljZScsIHdyYXBwZXIpO1xuXG4gIHdyYXBwZXIgPSBmdW5jdGlvbihvcHRfc2VwYXJhdG9yKSB7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5qb2luLmNhbGwodGhpcy5wcm9wZXJ0aWVzLCBvcHRfc2VwYXJhdG9yKTtcbiAgfTtcbiAgdGhpcy5zZXROYXRpdmVGdW5jdGlvblByb3RvdHlwZSh0aGlzLkFSUkFZLCAnam9pbicsIHdyYXBwZXIpO1xuXG4gIHdyYXBwZXIgPSBmdW5jdGlvbih2YXJfYXJncykge1xuICAgIHZhciBsaXN0ID0gW107XG4gICAgdmFyIGxlbmd0aCA9IDA7XG4gICAgLy8gU3RhcnQgYnkgY29weWluZyB0aGUgY3VycmVudCBhcnJheS5cbiAgICB2YXIgaUxlbmd0aCA9IHRoaXNJbnRlcnByZXRlci5nZXRQcm9wZXJ0eSh0aGlzLCAnbGVuZ3RoJyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpTGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0aGlzSW50ZXJwcmV0ZXIuaGFzUHJvcGVydHkodGhpcywgaSkpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzSW50ZXJwcmV0ZXIuZ2V0UHJvcGVydHkodGhpcywgaSk7XG4gICAgICAgIGxpc3RbbGVuZ3RoXSA9IGVsZW1lbnQ7XG4gICAgICB9XG4gICAgICBsZW5ndGgrKztcbiAgICB9XG4gICAgLy8gTG9vcCB0aHJvdWdoIGFsbCBhcmd1bWVudHMgYW5kIGNvcHkgdGhlbSBpbi5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHZhbHVlID0gYXJndW1lbnRzW2ldO1xuICAgICAgaWYgKHRoaXNJbnRlcnByZXRlci5pc2EodmFsdWUsIHRoaXNJbnRlcnByZXRlci5BUlJBWSkpIHtcbiAgICAgICAgdmFyIGpMZW5ndGggPSB0aGlzSW50ZXJwcmV0ZXIuZ2V0UHJvcGVydHkodmFsdWUsICdsZW5ndGgnKTtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBqTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBpZiAodGhpc0ludGVycHJldGVyLmhhc1Byb3BlcnR5KHZhbHVlLCBqKSkge1xuICAgICAgICAgICAgbGlzdFtsZW5ndGhdID0gdGhpc0ludGVycHJldGVyLmdldFByb3BlcnR5KHZhbHVlLCBqKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbGVuZ3RoKys7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpc3RbbGVuZ3RoXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpc0ludGVycHJldGVyLmFycmF5TmF0aXZlVG9Qc2V1ZG8obGlzdCk7XG4gIH07XG4gIHRoaXMuc2V0TmF0aXZlRnVuY3Rpb25Qcm90b3R5cGUodGhpcy5BUlJBWSwgJ2NvbmNhdCcsIHdyYXBwZXIpO1xuXG4gIHdyYXBwZXIgPSBmdW5jdGlvbihzZWFyY2hFbGVtZW50LCBvcHRfZnJvbUluZGV4KSB7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmFwcGx5KHRoaXMucHJvcGVydGllcywgYXJndW1lbnRzKTtcbiAgfTtcbiAgdGhpcy5zZXROYXRpdmVGdW5jdGlvblByb3RvdHlwZSh0aGlzLkFSUkFZLCAnaW5kZXhPZicsIHdyYXBwZXIpO1xuXG4gIHdyYXBwZXIgPSBmdW5jdGlvbihzZWFyY2hFbGVtZW50LCBvcHRfZnJvbUluZGV4KSB7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5sYXN0SW5kZXhPZi5hcHBseSh0aGlzLnByb3BlcnRpZXMsIGFyZ3VtZW50cyk7XG4gIH07XG4gIHRoaXMuc2V0TmF0aXZlRnVuY3Rpb25Qcm90b3R5cGUodGhpcy5BUlJBWSwgJ2xhc3RJbmRleE9mJywgd3JhcHBlcik7XG5cbiAgd3JhcHBlciA9IGZ1bmN0aW9uKCkge1xuICAgIEFycmF5LnByb3RvdHlwZS5zb3J0LmNhbGwodGhpcy5wcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgdGhpcy5zZXROYXRpdmVGdW5jdGlvblByb3RvdHlwZSh0aGlzLkFSUkFZLCAnc29ydCcsIHdyYXBwZXIpO1xuXG4gIHRoaXMucG9seWZpbGxzXy5wdXNoKFxuLy8gUG9seWZpbGwgY29waWVkIGZyb206XG4vLyBkZXZlbG9wZXIubW96aWxsYS5vcmcvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvZXZlcnlcblwiT2JqZWN0LmRlZmluZVByb3BlcnR5KEFycmF5LnByb3RvdHlwZSwgJ2V2ZXJ5JyxcIixcbiAgICBcIntjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlLCB2YWx1ZTpcIixcbiAgXCJmdW5jdGlvbihjYWxsYmFja2ZuLCB0aGlzQXJnKSB7XCIsXG4gICAgXCJpZiAoIXRoaXMgfHwgdHlwZW9mIGNhbGxiYWNrZm4gIT09ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcigpO1wiLFxuICAgIFwidmFyIFQsIGs7XCIsXG4gICAgXCJ2YXIgTyA9IE9iamVjdCh0aGlzKTtcIixcbiAgICBcInZhciBsZW4gPSBPLmxlbmd0aCA+Pj4gMDtcIixcbiAgICBcImlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkgVCA9IHRoaXNBcmc7XCIsXG4gICAgXCJrID0gMDtcIixcbiAgICBcIndoaWxlIChrIDwgbGVuKSB7XCIsXG4gICAgICBcImlmIChrIGluIE8gJiYgIWNhbGxiYWNrZm4uY2FsbChULCBPW2tdLCBrLCBPKSkgcmV0dXJuIGZhbHNlO1wiLFxuICAgICAgXCJrKys7XCIsXG4gICAgXCJ9XCIsXG4gICAgXCJyZXR1cm4gdHJ1ZTtcIixcbiAgXCJ9XCIsXG5cIn0pO1wiLFxuXG4vLyBQb2x5ZmlsbCBjb3BpZWQgZnJvbTpcbi8vIGRldmVsb3Blci5tb3ppbGxhLm9yZy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9maWx0ZXJcblwiT2JqZWN0LmRlZmluZVByb3BlcnR5KEFycmF5LnByb3RvdHlwZSwgJ2ZpbHRlcicsXCIsXG4gICAgXCJ7Y29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSwgdmFsdWU6XCIsXG4gIFwiZnVuY3Rpb24oZnVuLyosIHRoaXNBcmcqLykge1wiLFxuICAgIFwiaWYgKHRoaXMgPT09IHZvaWQgMCB8fCB0aGlzID09PSBudWxsIHx8IHR5cGVvZiBmdW4gIT09ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcigpO1wiLFxuICAgIFwidmFyIHQgPSBPYmplY3QodGhpcyk7XCIsXG4gICAgXCJ2YXIgbGVuID0gdC5sZW5ndGggPj4+IDA7XCIsXG4gICAgXCJ2YXIgcmVzID0gW107XCIsXG4gICAgXCJ2YXIgdGhpc0FyZyA9IGFyZ3VtZW50cy5sZW5ndGggPj0gMiA/IGFyZ3VtZW50c1sxXSA6IHZvaWQgMDtcIixcbiAgICBcImZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcIixcbiAgICAgIFwiaWYgKGkgaW4gdCkge1wiLFxuICAgICAgICBcInZhciB2YWwgPSB0W2ldO1wiLFxuICAgICAgICBcImlmIChmdW4uY2FsbCh0aGlzQXJnLCB2YWwsIGksIHQpKSByZXMucHVzaCh2YWwpO1wiLFxuICAgICAgXCJ9XCIsXG4gICAgXCJ9XCIsXG4gICAgXCJyZXR1cm4gcmVzO1wiLFxuICBcIn1cIixcblwifSk7XCIsXG5cbi8vIFBvbHlmaWxsIGNvcGllZCBmcm9tOlxuLy8gZGV2ZWxvcGVyLm1vemlsbGEub3JnL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2ZvckVhY2hcblwiT2JqZWN0LmRlZmluZVByb3BlcnR5KEFycmF5LnByb3RvdHlwZSwgJ2ZvckVhY2gnLFwiLFxuICAgIFwie2NvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUsIHZhbHVlOlwiLFxuICBcImZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XCIsXG4gICAgXCJpZiAoIXRoaXMgfHwgdHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB0aHJvdyBUeXBlRXJyb3IoKTtcIixcbiAgICBcInZhciBULCBrO1wiLFxuICAgIFwidmFyIE8gPSBPYmplY3QodGhpcyk7XCIsXG4gICAgXCJ2YXIgbGVuID0gTy5sZW5ndGggPj4+IDA7XCIsXG4gICAgXCJpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIFQgPSB0aGlzQXJnO1wiLFxuICAgIFwiayA9IDA7XCIsXG4gICAgXCJ3aGlsZSAoayA8IGxlbikge1wiLFxuICAgICAgXCJpZiAoayBpbiBPKSBjYWxsYmFjay5jYWxsKFQsIE9ba10sIGssIE8pO1wiLFxuICAgICAgXCJrKys7XCIsXG4gICAgXCJ9XCIsXG4gIFwifVwiLFxuXCJ9KTtcIixcblxuLy8gUG9seWZpbGwgY29waWVkIGZyb206XG4vLyBkZXZlbG9wZXIubW96aWxsYS5vcmcvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvbWFwXG5cIk9iamVjdC5kZWZpbmVQcm9wZXJ0eShBcnJheS5wcm90b3R5cGUsICdtYXAnLFwiLFxuICAgIFwie2NvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUsIHZhbHVlOlwiLFxuICBcImZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XCIsXG4gICAgXCJpZiAoIXRoaXMgfHwgdHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSBuZXcgVHlwZUVycm9yO1wiLFxuICAgIFwidmFyIFQsIEEsIGs7XCIsXG4gICAgXCJ2YXIgTyA9IE9iamVjdCh0aGlzKTtcIixcbiAgICBcInZhciBsZW4gPSBPLmxlbmd0aCA+Pj4gMDtcIixcbiAgICBcImlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkgVCA9IHRoaXNBcmc7XCIsXG4gICAgXCJBID0gbmV3IEFycmF5KGxlbik7XCIsXG4gICAgXCJrID0gMDtcIixcbiAgICBcIndoaWxlIChrIDwgbGVuKSB7XCIsXG4gICAgICBcImlmIChrIGluIE8pIEFba10gPSBjYWxsYmFjay5jYWxsKFQsIE9ba10sIGssIE8pO1wiLFxuICAgICAgXCJrKys7XCIsXG4gICAgXCJ9XCIsXG4gICAgXCJyZXR1cm4gQTtcIixcbiAgXCJ9XCIsXG5cIn0pO1wiLFxuXG4vLyBQb2x5ZmlsbCBjb3BpZWQgZnJvbTpcbi8vIGRldmVsb3Blci5tb3ppbGxhLm9yZy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9SZWR1Y2VcblwiT2JqZWN0LmRlZmluZVByb3BlcnR5KEFycmF5LnByb3RvdHlwZSwgJ3JlZHVjZScsXCIsXG4gICAgXCJ7Y29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSwgdmFsdWU6XCIsXG4gIFwiZnVuY3Rpb24oY2FsbGJhY2sgLyosIGluaXRpYWxWYWx1ZSovKSB7XCIsXG4gICAgXCJpZiAoIXRoaXMgfHwgdHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB0aHJvdyBUeXBlRXJyb3IoKTtcIixcbiAgICBcInZhciB0ID0gT2JqZWN0KHRoaXMpLCBsZW4gPSB0Lmxlbmd0aCA+Pj4gMCwgayA9IDAsIHZhbHVlO1wiLFxuICAgIFwiaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcIixcbiAgICAgIFwidmFsdWUgPSBhcmd1bWVudHNbMV07XCIsXG4gICAgXCJ9IGVsc2Uge1wiLFxuICAgICAgXCJ3aGlsZSAoayA8IGxlbiAmJiAhKGsgaW4gdCkpIGsrKztcIixcbiAgICAgIFwiaWYgKGsgPj0gbGVuKSB7XCIsXG4gICAgICAgIFwidGhyb3cgVHlwZUVycm9yKCdSZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlJyk7XCIsXG4gICAgICBcIn1cIixcbiAgICAgIFwidmFsdWUgPSB0W2srK107XCIsXG4gICAgXCJ9XCIsXG4gICAgXCJmb3IgKDsgayA8IGxlbjsgaysrKSB7XCIsXG4gICAgICBcImlmIChrIGluIHQpIHZhbHVlID0gY2FsbGJhY2sodmFsdWUsIHRba10sIGssIHQpO1wiLFxuICAgIFwifVwiLFxuICAgIFwicmV0dXJuIHZhbHVlO1wiLFxuICBcIn1cIixcblwifSk7XCIsXG5cbi8vIFBvbHlmaWxsIGNvcGllZCBmcm9tOlxuLy8gZGV2ZWxvcGVyLm1vemlsbGEub3JnL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L1JlZHVjZVJpZ2h0XG5cIk9iamVjdC5kZWZpbmVQcm9wZXJ0eShBcnJheS5wcm90b3R5cGUsICdyZWR1Y2VSaWdodCcsXCIsXG4gICAgXCJ7Y29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSwgdmFsdWU6XCIsXG4gIFwiZnVuY3Rpb24oY2FsbGJhY2sgLyosIGluaXRpYWxWYWx1ZSovKSB7XCIsXG4gICAgXCJpZiAobnVsbCA9PT0gdGhpcyB8fCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIHRoaXMgfHwgJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIGNhbGxiYWNrKSB0aHJvdyBUeXBlRXJyb3IoKTtcIixcbiAgICBcInZhciB0ID0gT2JqZWN0KHRoaXMpLCBsZW4gPSB0Lmxlbmd0aCA+Pj4gMCwgayA9IGxlbiAtIDEsIHZhbHVlO1wiLFxuICAgIFwiaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMikge1wiLFxuICAgICAgXCJ2YWx1ZSA9IGFyZ3VtZW50c1sxXTtcIixcbiAgICBcIn0gZWxzZSB7XCIsXG4gICAgICBcIndoaWxlIChrID49IDAgJiYgIShrIGluIHQpKSBrLS07XCIsXG4gICAgICBcImlmIChrIDwgMCkge1wiLFxuICAgICAgICBcInRocm93IFR5cGVFcnJvcignUmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZScpO1wiLFxuICAgICAgXCJ9XCIsXG4gICAgICBcInZhbHVlID0gdFtrLS1dO1wiLFxuICAgIFwifVwiLFxuICAgIFwiZm9yICg7IGsgPj0gMDsgay0tKSB7XCIsXG4gICAgICBcImlmIChrIGluIHQpIHZhbHVlID0gY2FsbGJhY2sodmFsdWUsIHRba10sIGssIHQpO1wiLFxuICAgIFwifVwiLFxuICAgIFwicmV0dXJuIHZhbHVlO1wiLFxuICBcIn1cIixcblwifSk7XCIsXG5cbi8vIFBvbHlmaWxsIGNvcGllZCBmcm9tOlxuLy8gZGV2ZWxvcGVyLm1vemlsbGEub3JnL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L3NvbWVcblwiT2JqZWN0LmRlZmluZVByb3BlcnR5KEFycmF5LnByb3RvdHlwZSwgJ3NvbWUnLFwiLFxuICAgIFwie2NvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUsIHZhbHVlOlwiLFxuICBcImZ1bmN0aW9uKGZ1bi8qLCB0aGlzQXJnKi8pIHtcIixcbiAgICBcImlmICghdGhpcyB8fCB0eXBlb2YgZnVuICE9PSAnZnVuY3Rpb24nKSB0aHJvdyBUeXBlRXJyb3IoKTtcIixcbiAgICBcInZhciB0ID0gT2JqZWN0KHRoaXMpO1wiLFxuICAgIFwidmFyIGxlbiA9IHQubGVuZ3RoID4+PiAwO1wiLFxuICAgIFwidmFyIHRoaXNBcmcgPSBhcmd1bWVudHMubGVuZ3RoID49IDIgPyBhcmd1bWVudHNbMV0gOiB2b2lkIDA7XCIsXG4gICAgXCJmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XCIsXG4gICAgICBcImlmIChpIGluIHQgJiYgZnVuLmNhbGwodGhpc0FyZywgdFtpXSwgaSwgdCkpIHtcIixcbiAgICAgICAgXCJyZXR1cm4gdHJ1ZTtcIixcbiAgICAgIFwifVwiLFxuICAgIFwifVwiLFxuICAgIFwicmV0dXJuIGZhbHNlO1wiLFxuICBcIn1cIixcblwifSk7XCIsXG5cblxuXCIoZnVuY3Rpb24oKSB7XCIsXG4gIFwidmFyIHNvcnRfID0gQXJyYXkucHJvdG90eXBlLnNvcnQ7XCIsXG4gIFwiQXJyYXkucHJvdG90eXBlLnNvcnQgPSBmdW5jdGlvbihvcHRfY29tcCkge1wiLFxuICAgIC8vIEZhc3QgbmF0aXZlIHNvcnQuXG4gICAgXCJpZiAodHlwZW9mIG9wdF9jb21wICE9PSAnZnVuY3Rpb24nKSB7XCIsXG4gICAgICBcInJldHVybiBzb3J0Xy5jYWxsKHRoaXMpO1wiLFxuICAgIFwifVwiLFxuICAgIC8vIFNsb3cgYnViYmxlIHNvcnQuXG4gICAgXCJmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcIixcbiAgICAgIFwidmFyIGNoYW5nZXMgPSAwO1wiLFxuICAgICAgXCJmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMubGVuZ3RoIC0gaSAtIDE7IGorKykge1wiLFxuICAgICAgICBcImlmIChvcHRfY29tcCh0aGlzW2pdLCB0aGlzW2ogKyAxXSkgPiAwKSB7XCIsXG4gICAgICAgICAgXCJ2YXIgc3dhcCA9IHRoaXNbal07XCIsXG4gICAgICAgICAgXCJ0aGlzW2pdID0gdGhpc1tqICsgMV07XCIsXG4gICAgICAgICAgXCJ0aGlzW2ogKyAxXSA9IHN3YXA7XCIsXG4gICAgICAgICAgXCJjaGFuZ2VzKys7XCIsXG4gICAgICAgIFwifVwiLFxuICAgICAgXCJ9XCIsXG4gICAgICBcImlmICghY2hhbmdlcykgYnJlYWs7XCIsXG4gICAgXCJ9XCIsXG4gICAgXCJyZXR1cm4gdGhpcztcIixcbiAgXCJ9O1wiLFxuXCJ9KSgpO1wiLFxuXG5cIk9iamVjdC5kZWZpbmVQcm9wZXJ0eShBcnJheS5wcm90b3R5cGUsICd0b0xvY2FsZVN0cmluZycsXCIsXG4gICAgXCJ7Y29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSwgdmFsdWU6XCIsXG4gIFwiZnVuY3Rpb24oKSB7XCIsXG4gICAgXCJ2YXIgb3V0ID0gW107XCIsXG4gICAgXCJmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcIixcbiAgICAgIFwib3V0W2ldID0gKHRoaXNbaV0gPT09IG51bGwgfHwgdGhpc1tpXSA9PT0gdW5kZWZpbmVkKSA/ICcnIDogdGhpc1tpXS50b0xvY2FsZVN0cmluZygpO1wiLFxuICAgIFwifVwiLFxuICAgIFwicmV0dXJuIG91dC5qb2luKCcsJyk7XCIsXG4gIFwifVwiLFxuXCJ9KTtcIixcblwiXCIpO1xufTtcblxuLyoqXG4gKiBJbml0aWFsaXplIHRoZSBTdHJpbmcgY2xhc3MuXG4gKiBAcGFyYW0geyFJbnRlcnByZXRlci5PYmplY3R9IHNjb3BlIEdsb2JhbCBzY29wZS5cbiAqL1xuSW50ZXJwcmV0ZXIucHJvdG90eXBlLmluaXRTdHJpbmcgPSBmdW5jdGlvbihzY29wZSkge1xuICB2YXIgdGhpc0ludGVycHJldGVyID0gdGhpcztcbiAgdmFyIHdyYXBwZXI7XG4gIC8vIFN0cmluZyBjb25zdHJ1Y3Rvci5cbiAgd3JhcHBlciA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpO1xuICAgIGlmICh0aGlzSW50ZXJwcmV0ZXIuY2FsbGVkV2l0aE5ldygpKSB7XG4gICAgICAvLyBDYWxsZWQgYXMgbmV3IFN0cmluZygpLlxuICAgICAgdGhpcy5kYXRhID0gdmFsdWU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQ2FsbGVkIGFzIFN0cmluZygpLlxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgfTtcbiAgdGhpcy5TVFJJTkcgPSB0aGlzLmNyZWF0ZU5hdGl2ZUZ1bmN0aW9uKHdyYXBwZXIsIHRydWUpO1xuICB0aGlzLnNldFByb3BlcnR5KHNjb3BlLCAnU3RyaW5nJywgdGhpcy5TVFJJTkcpO1xuXG4gIC8vIFN0YXRpYyBtZXRob2RzIG9uIFN0cmluZy5cbiAgdGhpcy5zZXRQcm9wZXJ0eSh0aGlzLlNUUklORywgJ2Zyb21DaGFyQ29kZScsXG4gICAgICB0aGlzLmNyZWF0ZU5hdGl2ZUZ1bmN0aW9uKFN0cmluZy5mcm9tQ2hhckNvZGUsIGZhbHNlKSxcbiAgICAgIEludGVycHJldGVyLk5PTkVOVU1FUkFCTEVfREVTQ1JJUFRPUik7XG5cbiAgLy8gSW5zdGFuY2UgbWV0aG9kcyBvbiBTdHJpbmcuXG4gIC8vIE1ldGhvZHMgd2l0aCBleGNsdXNpdmVseSBwcmltaXRpdmUgYXJndW1lbnRzLlxuICB2YXIgZnVuY3Rpb25zID0gWydjaGFyQXQnLCAnY2hhckNvZGVBdCcsICdjb25jYXQnLCAnaW5kZXhPZicsICdsYXN0SW5kZXhPZicsXG4gICAgICAnc2xpY2UnLCAnc3Vic3RyJywgJ3N1YnN0cmluZycsICd0b0xvY2FsZUxvd2VyQ2FzZScsICd0b0xvY2FsZVVwcGVyQ2FzZScsXG4gICAgICAndG9Mb3dlckNhc2UnLCAndG9VcHBlckNhc2UnLCAndHJpbSddO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGZ1bmN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgIHRoaXMuc2V0TmF0aXZlRnVuY3Rpb25Qcm90b3R5cGUodGhpcy5TVFJJTkcsIGZ1bmN0aW9uc1tpXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0cmluZy5wcm90b3R5cGVbZnVuY3Rpb25zW2ldXSk7XG4gIH1cblxuICB3cmFwcGVyID0gZnVuY3Rpb24oY29tcGFyZVN0cmluZywgbG9jYWxlcywgb3B0aW9ucykge1xuICAgIGxvY2FsZXMgPSBsb2NhbGVzID8gdGhpc0ludGVycHJldGVyLnBzZXVkb1RvTmF0aXZlKGxvY2FsZXMpIDogdW5kZWZpbmVkO1xuICAgIG9wdGlvbnMgPSBvcHRpb25zID8gdGhpc0ludGVycHJldGVyLnBzZXVkb1RvTmF0aXZlKG9wdGlvbnMpIDogdW5kZWZpbmVkO1xuICAgIHJldHVybiBTdHJpbmcodGhpcykubG9jYWxlQ29tcGFyZShjb21wYXJlU3RyaW5nLCBsb2NhbGVzLCBvcHRpb25zKTtcbiAgfTtcbiAgdGhpcy5zZXROYXRpdmVGdW5jdGlvblByb3RvdHlwZSh0aGlzLlNUUklORywgJ2xvY2FsZUNvbXBhcmUnLCB3cmFwcGVyKTtcblxuICB3cmFwcGVyID0gZnVuY3Rpb24oc2VwYXJhdG9yLCBsaW1pdCwgY2FsbGJhY2spIHtcbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIGxpbWl0ID0gbGltaXQgPyBOdW1iZXIobGltaXQpIDogdW5kZWZpbmVkO1xuICAgIC8vIEV4YW1wbGUgb2YgY2F0YXN0cm9waGljIHNwbGl0IFJlZ0V4cDpcbiAgICAvLyAnYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYycuc3BsaXQoL14oYSspK2IvKVxuICAgIGlmICh0aGlzSW50ZXJwcmV0ZXIuaXNhKHNlcGFyYXRvciwgdGhpc0ludGVycHJldGVyLlJFR0VYUCkpIHtcbiAgICAgIHNlcGFyYXRvciA9IHNlcGFyYXRvci5kYXRhO1xuICAgICAgdGhpc0ludGVycHJldGVyLm1heWJlVGhyb3dSZWdFeHAoc2VwYXJhdG9yLCBjYWxsYmFjayk7XG4gICAgICBpZiAodGhpc0ludGVycHJldGVyLlJFR0VYUF9NT0RFID09PSAyKSB7XG4gICAgICAgIGlmIChJbnRlcnByZXRlci52bSkge1xuICAgICAgICAgIC8vIFJ1biBzcGxpdCBpbiB2bS5cbiAgICAgICAgICB2YXIgc2FuZGJveCA9IHtcbiAgICAgICAgICAgICdzdHJpbmcnOiBzdHJpbmcsXG4gICAgICAgICAgICAnc2VwYXJhdG9yJzogc2VwYXJhdG9yLFxuICAgICAgICAgICAgJ2xpbWl0JzogbGltaXRcbiAgICAgICAgICB9O1xuICAgICAgICAgIHZhciBjb2RlID0gJ3N0cmluZy5zcGxpdChzZXBhcmF0b3IsIGxpbWl0KSc7XG4gICAgICAgICAgdmFyIGpzTGlzdCA9XG4gICAgICAgICAgICAgIHRoaXNJbnRlcnByZXRlci52bUNhbGwoY29kZSwgc2FuZGJveCwgc2VwYXJhdG9yLCBjYWxsYmFjayk7XG4gICAgICAgICAgaWYgKGpzTGlzdCAhPT0gSW50ZXJwcmV0ZXIuUkVHRVhQX1RJTUVPVVQpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKHRoaXNJbnRlcnByZXRlci5hcnJheU5hdGl2ZVRvUHNldWRvKGpzTGlzdCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBSdW4gc3BsaXQgaW4gc2VwYXJhdGUgdGhyZWFkLlxuICAgICAgICAgIHZhciBzcGxpdFdvcmtlciA9IHRoaXNJbnRlcnByZXRlci5jcmVhdGVXb3JrZXIoKTtcbiAgICAgICAgICB2YXIgcGlkID0gdGhpc0ludGVycHJldGVyLnJlZ0V4cFRpbWVvdXQoc2VwYXJhdG9yLCBzcGxpdFdvcmtlcixcbiAgICAgICAgICAgICAgY2FsbGJhY2spO1xuICAgICAgICAgIHNwbGl0V29ya2VyLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChwaWQpO1xuICAgICAgICAgICAgY2FsbGJhY2sodGhpc0ludGVycHJldGVyLmFycmF5TmF0aXZlVG9Qc2V1ZG8oZS5kYXRhKSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgICBzcGxpdFdvcmtlci5wb3N0TWVzc2FnZShbJ3NwbGl0Jywgc3RyaW5nLCBzZXBhcmF0b3IsIGxpbWl0XSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBSdW4gc3BsaXQgbmF0aXZlbHkuXG4gICAgdmFyIGpzTGlzdCA9IHN0cmluZy5zcGxpdChzZXBhcmF0b3IsIGxpbWl0KTtcbiAgICBjYWxsYmFjayh0aGlzSW50ZXJwcmV0ZXIuYXJyYXlOYXRpdmVUb1BzZXVkbyhqc0xpc3QpKTtcbiAgfTtcbiAgdGhpcy5zZXRBc3luY0Z1bmN0aW9uUHJvdG90eXBlKHRoaXMuU1RSSU5HLCAnc3BsaXQnLCB3cmFwcGVyKTtcblxuICB3cmFwcGVyID0gZnVuY3Rpb24ocmVnZXhwLCBjYWxsYmFjaykge1xuICAgIHZhciBzdHJpbmcgPSBTdHJpbmcodGhpcyk7XG4gICAgaWYgKHRoaXNJbnRlcnByZXRlci5pc2EocmVnZXhwLCB0aGlzSW50ZXJwcmV0ZXIuUkVHRVhQKSkge1xuICAgICAgcmVnZXhwID0gcmVnZXhwLmRhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlZ2V4cCA9IG5ldyBSZWdFeHAocmVnZXhwKTtcbiAgICB9XG4gICAgLy8gRXhhbXBsZSBvZiBjYXRhc3Ryb3BoaWMgbWF0Y2ggUmVnRXhwOlxuICAgIC8vICdhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFjJy5tYXRjaCgvXihhKykrYi8pXG4gICAgdGhpc0ludGVycHJldGVyLm1heWJlVGhyb3dSZWdFeHAocmVnZXhwLCBjYWxsYmFjayk7XG4gICAgaWYgKHRoaXNJbnRlcnByZXRlci5SRUdFWFBfTU9ERSA9PT0gMikge1xuICAgICAgaWYgKEludGVycHJldGVyLnZtKSB7XG4gICAgICAgIC8vIFJ1biBtYXRjaCBpbiB2bS5cbiAgICAgICAgdmFyIHNhbmRib3ggPSB7XG4gICAgICAgICAgJ3N0cmluZyc6IHN0cmluZyxcbiAgICAgICAgICAncmVnZXhwJzogcmVnZXhwXG4gICAgICAgIH07XG4gICAgICAgIHZhciBjb2RlID0gJ3N0cmluZy5tYXRjaChyZWdleHApJztcbiAgICAgICAgdmFyIG0gPSB0aGlzSW50ZXJwcmV0ZXIudm1DYWxsKGNvZGUsIHNhbmRib3gsIHJlZ2V4cCwgY2FsbGJhY2spO1xuICAgICAgICBpZiAobSAhPT0gSW50ZXJwcmV0ZXIuUkVHRVhQX1RJTUVPVVQpIHtcbiAgICAgICAgICBjYWxsYmFjayhtICYmIHRoaXNJbnRlcnByZXRlci5hcnJheU5hdGl2ZVRvUHNldWRvKG0pKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gUnVuIG1hdGNoIGluIHNlcGFyYXRlIHRocmVhZC5cbiAgICAgICAgdmFyIG1hdGNoV29ya2VyID0gdGhpc0ludGVycHJldGVyLmNyZWF0ZVdvcmtlcigpO1xuICAgICAgICB2YXIgcGlkID0gdGhpc0ludGVycHJldGVyLnJlZ0V4cFRpbWVvdXQocmVnZXhwLCBtYXRjaFdvcmtlciwgY2FsbGJhY2spO1xuICAgICAgICBtYXRjaFdvcmtlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHBpZCk7XG4gICAgICAgICAgY2FsbGJhY2soZS5kYXRhICYmIHRoaXNJbnRlcnByZXRlci5hcnJheU5hdGl2ZVRvUHNldWRvKGUuZGF0YSkpO1xuICAgICAgICB9O1xuICAgICAgICBtYXRjaFdvcmtlci5wb3N0TWVzc2FnZShbJ21hdGNoJywgc3RyaW5nLCByZWdleHBdKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gUnVuIG1hdGNoIG5hdGl2ZWx5LlxuICAgIHZhciBtID0gc3RyaW5nLm1hdGNoKHJlZ2V4cCk7XG4gICAgY2FsbGJhY2sobSAmJiB0aGlzSW50ZXJwcmV0ZXIuYXJyYXlOYXRpdmVUb1BzZXVkbyhtKSk7XG4gIH07XG4gIHRoaXMuc2V0QXN5bmNGdW5jdGlvblByb3RvdHlwZSh0aGlzLlNUUklORywgJ21hdGNoJywgd3JhcHBlcik7XG5cbiAgd3JhcHBlciA9IGZ1bmN0aW9uKHJlZ2V4cCwgY2FsbGJhY2spIHtcbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIGlmICh0aGlzSW50ZXJwcmV0ZXIuaXNhKHJlZ2V4cCwgdGhpc0ludGVycHJldGVyLlJFR0VYUCkpIHtcbiAgICAgIHJlZ2V4cCA9IHJlZ2V4cC5kYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWdleHAgPSBuZXcgUmVnRXhwKHJlZ2V4cCk7XG4gICAgfVxuICAgIC8vIEV4YW1wbGUgb2YgY2F0YXN0cm9waGljIHNlYXJjaCBSZWdFeHA6XG4gICAgLy8gJ2FhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWMnLnNlYXJjaCgvXihhKykrYi8pXG4gICAgdGhpc0ludGVycHJldGVyLm1heWJlVGhyb3dSZWdFeHAocmVnZXhwLCBjYWxsYmFjayk7XG4gICAgaWYgKHRoaXNJbnRlcnByZXRlci5SRUdFWFBfTU9ERSA9PT0gMikge1xuICAgICAgaWYgKEludGVycHJldGVyLnZtKSB7XG4gICAgICAgIC8vIFJ1biBzZWFyY2ggaW4gdm0uXG4gICAgICAgIHZhciBzYW5kYm94ID0ge1xuICAgICAgICAgICdzdHJpbmcnOiBzdHJpbmcsXG4gICAgICAgICAgJ3JlZ2V4cCc6IHJlZ2V4cFxuICAgICAgICB9O1xuICAgICAgICB2YXIgY29kZSA9ICdzdHJpbmcuc2VhcmNoKHJlZ2V4cCknO1xuICAgICAgICB2YXIgbiA9IHRoaXNJbnRlcnByZXRlci52bUNhbGwoY29kZSwgc2FuZGJveCwgcmVnZXhwLCBjYWxsYmFjayk7XG4gICAgICAgIGlmIChuICE9PSBJbnRlcnByZXRlci5SRUdFWFBfVElNRU9VVCkge1xuICAgICAgICAgIGNhbGxiYWNrKG4pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBSdW4gc2VhcmNoIGluIHNlcGFyYXRlIHRocmVhZC5cbiAgICAgICAgdmFyIHNlYXJjaFdvcmtlciA9IHRoaXNJbnRlcnByZXRlci5jcmVhdGVXb3JrZXIoKTtcbiAgICAgICAgdmFyIHBpZCA9IHRoaXNJbnRlcnByZXRlci5yZWdFeHBUaW1lb3V0KHJlZ2V4cCwgc2VhcmNoV29ya2VyLCBjYWxsYmFjayk7XG4gICAgICAgIHNlYXJjaFdvcmtlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHBpZCk7XG4gICAgICAgICAgY2FsbGJhY2soZS5kYXRhKTtcbiAgICAgICAgfTtcbiAgICAgICAgc2VhcmNoV29ya2VyLnBvc3RNZXNzYWdlKFsnc2VhcmNoJywgc3RyaW5nLCByZWdleHBdKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gUnVuIHNlYXJjaCBuYXRpdmVseS5cbiAgICBjYWxsYmFjayhzdHJpbmcuc2VhcmNoKHJlZ2V4cCkpO1xuICB9O1xuICB0aGlzLnNldEFzeW5jRnVuY3Rpb25Qcm90b3R5cGUodGhpcy5TVFJJTkcsICdzZWFyY2gnLCB3cmFwcGVyKTtcblxuICB3cmFwcGVyID0gZnVuY3Rpb24oc3Vic3RyLCBuZXdTdWJzdHIsIGNhbGxiYWNrKSB7XG4gICAgLy8gU3VwcG9ydCBmb3IgZnVuY3Rpb24gcmVwbGFjZW1lbnRzIGlzIHRoZSByZXNwb25zaWJpbGl0eSBvZiBhIHBvbHlmaWxsLlxuICAgIHZhciBzdHJpbmcgPSBTdHJpbmcodGhpcyk7XG4gICAgbmV3U3Vic3RyID0gU3RyaW5nKG5ld1N1YnN0cik7XG4gICAgLy8gRXhhbXBsZSBvZiBjYXRhc3Ryb3BoaWMgcmVwbGFjZSBSZWdFeHA6XG4gICAgLy8gJ2FhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWMnLnJlcGxhY2UoL14oYSspK2IvLCAnJylcbiAgICBpZiAodGhpc0ludGVycHJldGVyLmlzYShzdWJzdHIsIHRoaXNJbnRlcnByZXRlci5SRUdFWFApKSB7XG4gICAgICBzdWJzdHIgPSBzdWJzdHIuZGF0YTtcbiAgICAgIHRoaXNJbnRlcnByZXRlci5tYXliZVRocm93UmVnRXhwKHN1YnN0ciwgY2FsbGJhY2spO1xuICAgICAgaWYgKHRoaXNJbnRlcnByZXRlci5SRUdFWFBfTU9ERSA9PT0gMikge1xuICAgICAgICBpZiAoSW50ZXJwcmV0ZXIudm0pIHtcbiAgICAgICAgICAvLyBSdW4gcmVwbGFjZSBpbiB2bS5cbiAgICAgICAgICB2YXIgc2FuZGJveCA9IHtcbiAgICAgICAgICAgICdzdHJpbmcnOiBzdHJpbmcsXG4gICAgICAgICAgICAnc3Vic3RyJzogc3Vic3RyLFxuICAgICAgICAgICAgJ25ld1N1YnN0cic6IG5ld1N1YnN0clxuICAgICAgICAgIH07XG4gICAgICAgICAgdmFyIGNvZGUgPSAnc3RyaW5nLnJlcGxhY2Uoc3Vic3RyLCBuZXdTdWJzdHIpJztcbiAgICAgICAgICB2YXIgc3RyID0gdGhpc0ludGVycHJldGVyLnZtQ2FsbChjb2RlLCBzYW5kYm94LCBzdWJzdHIsIGNhbGxiYWNrKTtcbiAgICAgICAgICBpZiAoc3RyICE9PSBJbnRlcnByZXRlci5SRUdFWFBfVElNRU9VVCkge1xuICAgICAgICAgICAgY2FsbGJhY2soc3RyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gUnVuIHJlcGxhY2UgaW4gc2VwYXJhdGUgdGhyZWFkLlxuICAgICAgICAgIHZhciByZXBsYWNlV29ya2VyID0gdGhpc0ludGVycHJldGVyLmNyZWF0ZVdvcmtlcigpO1xuICAgICAgICAgIHZhciBwaWQgPSB0aGlzSW50ZXJwcmV0ZXIucmVnRXhwVGltZW91dChzdWJzdHIsIHJlcGxhY2VXb3JrZXIsXG4gICAgICAgICAgICAgIGNhbGxiYWNrKTtcbiAgICAgICAgICByZXBsYWNlV29ya2VyLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChwaWQpO1xuICAgICAgICAgICAgY2FsbGJhY2soZS5kYXRhKTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJlcGxhY2VXb3JrZXIucG9zdE1lc3NhZ2UoWydyZXBsYWNlJywgc3RyaW5nLCBzdWJzdHIsIG5ld1N1YnN0cl0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gUnVuIHJlcGxhY2UgbmF0aXZlbHkuXG4gICAgY2FsbGJhY2soc3RyaW5nLnJlcGxhY2Uoc3Vic3RyLCBuZXdTdWJzdHIpKTtcbiAgfTtcbiAgdGhpcy5zZXRBc3luY0Z1bmN0aW9uUHJvdG90eXBlKHRoaXMuU1RSSU5HLCAncmVwbGFjZScsIHdyYXBwZXIpO1xuICAvLyBBZGQgYSBwb2x5ZmlsbCB0byBoYW5kbGUgcmVwbGFjZSdzIHNlY29uZCBhcmd1bWVudCBiZWluZyBhIGZ1bmN0aW9uLlxuICB0aGlzLnBvbHlmaWxsc18ucHVzaChcblwiKGZ1bmN0aW9uKCkge1wiLFxuICBcInZhciByZXBsYWNlXyA9IFN0cmluZy5wcm90b3R5cGUucmVwbGFjZTtcIixcbiAgXCJTdHJpbmcucHJvdG90eXBlLnJlcGxhY2UgPSBmdW5jdGlvbihzdWJzdHIsIG5ld1N1YnN0cikge1wiLFxuICAgIFwiaWYgKHR5cGVvZiBuZXdTdWJzdHIgIT09ICdmdW5jdGlvbicpIHtcIixcbiAgICAgIC8vIHN0cmluZy5yZXBsYWNlKHN0cmluZ3xyZWdleHAsIHN0cmluZylcbiAgICAgIFwicmV0dXJuIHJlcGxhY2VfLmNhbGwodGhpcywgc3Vic3RyLCBuZXdTdWJzdHIpO1wiLFxuICAgIFwifVwiLFxuICAgIFwidmFyIHN0ciA9IHRoaXM7XCIsXG4gICAgXCJpZiAoc3Vic3RyIGluc3RhbmNlb2YgUmVnRXhwKSB7XCIsICAvLyBzdHJpbmcucmVwbGFjZShyZWdleHAsIGZ1bmN0aW9uKVxuICAgICAgXCJ2YXIgc3VicyA9IFtdO1wiLFxuICAgICAgXCJ2YXIgbSA9IHN1YnN0ci5leGVjKHN0cik7XCIsXG4gICAgICBcIndoaWxlIChtKSB7XCIsXG4gICAgICAgIFwibS5wdXNoKG0uaW5kZXgsIHN0cik7XCIsXG4gICAgICAgIFwidmFyIGluamVjdCA9IG5ld1N1YnN0ci5hcHBseShudWxsLCBtKTtcIixcbiAgICAgICAgXCJzdWJzLnB1c2goW20uaW5kZXgsIG1bMF0ubGVuZ3RoLCBpbmplY3RdKTtcIixcbiAgICAgICAgXCJtID0gc3Vic3RyLmdsb2JhbCA/IHN1YnN0ci5leGVjKHN0cikgOiBudWxsO1wiLFxuICAgICAgXCJ9XCIsXG4gICAgICBcImZvciAodmFyIGkgPSBzdWJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XCIsXG4gICAgICAgIFwic3RyID0gc3RyLnN1YnN0cmluZygwLCBzdWJzW2ldWzBdKSArIHN1YnNbaV1bMl0gKyBcIiArXG4gICAgICAgICAgICBcInN0ci5zdWJzdHJpbmcoc3Vic1tpXVswXSArIHN1YnNbaV1bMV0pO1wiLFxuICAgICAgXCJ9XCIsXG4gICAgXCJ9IGVsc2Uge1wiLCAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzdHJpbmcucmVwbGFjZShzdHJpbmcsIGZ1bmN0aW9uKVxuICAgICAgXCJ2YXIgaSA9IHN0ci5pbmRleE9mKHN1YnN0cik7XCIsXG4gICAgICBcImlmIChpICE9PSAtMSkge1wiLFxuICAgICAgICBcInZhciBpbmplY3QgPSBuZXdTdWJzdHIoc3RyLnN1YnN0cihpLCBzdWJzdHIubGVuZ3RoKSwgaSwgc3RyKTtcIixcbiAgICAgICAgXCJzdHIgPSBzdHIuc3Vic3RyaW5nKDAsIGkpICsgaW5qZWN0ICsgXCIgK1xuICAgICAgICAgICAgXCJzdHIuc3Vic3RyaW5nKGkgKyBzdWJzdHIubGVuZ3RoKTtcIixcbiAgICAgIFwifVwiLFxuICAgIFwifVwiLFxuICAgIFwicmV0dXJuIHN0cjtcIixcbiAgXCJ9O1wiLFxuXCJ9KSgpO1wiLFxuXCJcIik7XG59O1xuXG4vKipcbiAqIEluaXRpYWxpemUgdGhlIEJvb2xlYW4gY2xhc3MuXG4gKiBAcGFyYW0geyFJbnRlcnByZXRlci5PYmplY3R9IHNjb3BlIEdsb2JhbCBzY29wZS5cbiAqL1xuSW50ZXJwcmV0ZXIucHJvdG90eXBlLmluaXRCb29sZWFuID0gZnVuY3Rpb24oc2NvcGUpIHtcbiAgdmFyIHRoaXNJbnRlcnByZXRlciA9IHRoaXM7XG4gIHZhciB3cmFwcGVyO1xuICAvLyBCb29sZWFuIGNvbnN0cnVjdG9yLlxuICB3cmFwcGVyID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YWx1ZSA9IEJvb2xlYW4odmFsdWUpO1xuICAgIGlmICh0aGlzSW50ZXJwcmV0ZXIuY2FsbGVkV2l0aE5ldygpKSB7XG4gICAgICAvLyBDYWxsZWQgYXMgbmV3IEJvb2xlYW4oKS5cbiAgICAgIHRoaXMuZGF0YSA9IHZhbHVlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIENhbGxlZCBhcyBCb29sZWFuKCkuXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICB9O1xuICB0aGlzLkJPT0xFQU4gPSB0aGlzLmNyZWF0ZU5hdGl2ZUZ1bmN0aW9uKHdyYXBwZXIsIHRydWUpO1xuICB0aGlzLnNldFByb3BlcnR5KHNjb3BlLCAnQm9vbGVhbicsIHRoaXMuQk9PTEVBTik7XG59O1xuXG4vKipcbiAqIEluaXRpYWxpemUgdGhlIE51bWJlciBjbGFzcy5cbiAqIEBwYXJhbSB7IUludGVycHJldGVyLk9iamVjdH0gc2NvcGUgR2xvYmFsIHNjb3BlLlxuICovXG5JbnRlcnByZXRlci5wcm90b3R5cGUuaW5pdE51bWJlciA9IGZ1bmN0aW9uKHNjb3BlKSB7XG4gIHZhciB0aGlzSW50ZXJwcmV0ZXIgPSB0aGlzO1xuICB2YXIgd3JhcHBlcjtcbiAgLy8gTnVtYmVyIGNvbnN0cnVjdG9yLlxuICB3cmFwcGVyID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YWx1ZSA9IE51bWJlcih2YWx1ZSk7XG4gICAgaWYgKHRoaXNJbnRlcnByZXRlci5jYWxsZWRXaXRoTmV3KCkpIHtcbiAgICAgIC8vIENhbGxlZCBhcyBuZXcgTnVtYmVyKCkuXG4gICAgICB0aGlzLmRhdGEgPSB2YWx1ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBDYWxsZWQgYXMgTnVtYmVyKCkuXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICB9O1xuICB0aGlzLk5VTUJFUiA9IHRoaXMuY3JlYXRlTmF0aXZlRnVuY3Rpb24od3JhcHBlciwgdHJ1ZSk7XG4gIHRoaXMuc2V0UHJvcGVydHkoc2NvcGUsICdOdW1iZXInLCB0aGlzLk5VTUJFUik7XG5cbiAgdmFyIG51bUNvbnN0cyA9IFsnTUFYX1ZBTFVFJywgJ01JTl9WQUxVRScsICdOYU4nLCAnTkVHQVRJVkVfSU5GSU5JVFknLFxuICAgICAgICAgICAgICAgICAgICdQT1NJVElWRV9JTkZJTklUWSddO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG51bUNvbnN0cy5sZW5ndGg7IGkrKykge1xuICAgIHRoaXMuc2V0UHJvcGVydHkodGhpcy5OVU1CRVIsIG51bUNvbnN0c1tpXSwgTnVtYmVyW251bUNvbnN0c1tpXV0sXG4gICAgICAgIEludGVycHJldGVyLlJFQURPTkxZX05PTkVOVU1FUkFCTEVfREVTQ1JJUFRPUik7XG4gIH1cblxuICAvLyBJbnN0YW5jZSBtZXRob2RzIG9uIE51bWJlci5cbiAgd3JhcHBlciA9IGZ1bmN0aW9uKGZyYWN0aW9uRGlnaXRzKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBOdW1iZXIodGhpcykudG9FeHBvbmVudGlhbChmcmFjdGlvbkRpZ2l0cyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gVGhyb3dzIGlmIGZyYWN0aW9uRGlnaXRzIGlzbid0IHdpdGhpbiAwLTIwLlxuICAgICAgdGhpc0ludGVycHJldGVyLnRocm93RXhjZXB0aW9uKHRoaXNJbnRlcnByZXRlci5FUlJPUiwgZS5tZXNzYWdlKTtcbiAgICB9XG4gIH07XG4gIHRoaXMuc2V0TmF0aXZlRnVuY3Rpb25Qcm90b3R5cGUodGhpcy5OVU1CRVIsICd0b0V4cG9uZW50aWFsJywgd3JhcHBlcik7XG5cbiAgd3JhcHBlciA9IGZ1bmN0aW9uKGRpZ2l0cykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gTnVtYmVyKHRoaXMpLnRvRml4ZWQoZGlnaXRzKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBUaHJvd3MgaWYgZGlnaXRzIGlzbid0IHdpdGhpbiAwLTIwLlxuICAgICAgdGhpc0ludGVycHJldGVyLnRocm93RXhjZXB0aW9uKHRoaXNJbnRlcnByZXRlci5FUlJPUiwgZS5tZXNzYWdlKTtcbiAgICB9XG4gIH07XG4gIHRoaXMuc2V0TmF0aXZlRnVuY3Rpb25Qcm90b3R5cGUodGhpcy5OVU1CRVIsICd0b0ZpeGVkJywgd3JhcHBlcik7XG5cbiAgd3JhcHBlciA9IGZ1bmN0aW9uKHByZWNpc2lvbikge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gTnVtYmVyKHRoaXMpLnRvUHJlY2lzaW9uKHByZWNpc2lvbik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gVGhyb3dzIGlmIHByZWNpc2lvbiBpc24ndCB3aXRoaW4gcmFuZ2UgKGRlcGVuZHMgb24gaW1wbGVtZW50YXRpb24pLlxuICAgICAgdGhpc0ludGVycHJldGVyLnRocm93RXhjZXB0aW9uKHRoaXNJbnRlcnByZXRlci5FUlJPUiwgZS5tZXNzYWdlKTtcbiAgICB9XG4gIH07XG4gIHRoaXMuc2V0TmF0aXZlRnVuY3Rpb25Qcm90b3R5cGUodGhpcy5OVU1CRVIsICd0b1ByZWNpc2lvbicsIHdyYXBwZXIpO1xuXG4gIHdyYXBwZXIgPSBmdW5jdGlvbihyYWRpeCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gTnVtYmVyKHRoaXMpLnRvU3RyaW5nKHJhZGl4KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBUaHJvd3MgaWYgcmFkaXggaXNuJ3Qgd2l0aGluIDItMzYuXG4gICAgICB0aGlzSW50ZXJwcmV0ZXIudGhyb3dFeGNlcHRpb24odGhpc0ludGVycHJldGVyLkVSUk9SLCBlLm1lc3NhZ2UpO1xuICAgIH1cbiAgfTtcbiAgdGhpcy5zZXROYXRpdmVGdW5jdGlvblByb3RvdHlwZSh0aGlzLk5VTUJFUiwgJ3RvU3RyaW5nJywgd3JhcHBlcik7XG5cbiAgd3JhcHBlciA9IGZ1bmN0aW9uKGxvY2FsZXMsIG9wdGlvbnMpIHtcbiAgICBsb2NhbGVzID0gbG9jYWxlcyA/IHRoaXNJbnRlcnByZXRlci5wc2V1ZG9Ub05hdGl2ZShsb2NhbGVzKSA6IHVuZGVmaW5lZDtcbiAgICBvcHRpb25zID0gb3B0aW9ucyA/IHRoaXNJbnRlcnByZXRlci5wc2V1ZG9Ub05hdGl2ZShvcHRpb25zKSA6IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gTnVtYmVyKHRoaXMpLnRvTG9jYWxlU3RyaW5nKGxvY2FsZXMsIG9wdGlvbnMpO1xuICB9O1xuICB0aGlzLnNldE5hdGl2ZUZ1bmN0aW9uUHJvdG90eXBlKHRoaXMuTlVNQkVSLCAndG9Mb2NhbGVTdHJpbmcnLCB3cmFwcGVyKTtcbn07XG5cbi8qKlxuICogSW5pdGlhbGl6ZSB0aGUgRGF0ZSBjbGFzcy5cbiAqIEBwYXJhbSB7IUludGVycHJldGVyLk9iamVjdH0gc2NvcGUgR2xvYmFsIHNjb3BlLlxuICovXG5JbnRlcnByZXRlci5wcm90b3R5cGUuaW5pdERhdGUgPSBmdW5jdGlvbihzY29wZSkge1xuICB2YXIgdGhpc0ludGVycHJldGVyID0gdGhpcztcbiAgdmFyIHdyYXBwZXI7XG4gIC8vIERhdGUgY29uc3RydWN0b3IuXG4gIHdyYXBwZXIgPSBmdW5jdGlvbih2YWx1ZSwgdmFyX2FyZ3MpIHtcbiAgICBpZiAoIXRoaXNJbnRlcnByZXRlci5jYWxsZWRXaXRoTmV3KCkpIHtcbiAgICAgIC8vIENhbGxlZCBhcyBEYXRlKCkuXG4gICAgICAvLyBDYWxsaW5nIERhdGUoKSBhcyBhIGZ1bmN0aW9uIHJldHVybnMgYSBzdHJpbmcsIG5vIGFyZ3VtZW50cyBhcmUgaGVlZGVkLlxuICAgICAgcmV0dXJuIERhdGUoKTtcbiAgICB9XG4gICAgLy8gQ2FsbGVkIGFzIG5ldyBEYXRlKCkuXG4gICAgdmFyIGFyZ3MgPSBbbnVsbF0uY29uY2F0KEFycmF5LmZyb20oYXJndW1lbnRzKSk7XG4gICAgdGhpcy5kYXRhID0gbmV3IChGdW5jdGlvbi5wcm90b3R5cGUuYmluZC5hcHBseShEYXRlLCBhcmdzKSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHRoaXMuREFURSA9IHRoaXMuY3JlYXRlTmF0aXZlRnVuY3Rpb24od3JhcHBlciwgdHJ1ZSk7XG4gIHRoaXMuREFURV9QUk9UTyA9IHRoaXMuREFURS5wcm9wZXJ0aWVzWydwcm90b3R5cGUnXTtcbiAgdGhpcy5zZXRQcm9wZXJ0eShzY29wZSwgJ0RhdGUnLCB0aGlzLkRBVEUpO1xuXG4gIC8vIFN0YXRpYyBtZXRob2RzIG9uIERhdGUuXG4gIHRoaXMuc2V0UHJvcGVydHkodGhpcy5EQVRFLCAnbm93JywgdGhpcy5jcmVhdGVOYXRpdmVGdW5jdGlvbihEYXRlLm5vdywgZmFsc2UpLFxuICAgICAgSW50ZXJwcmV0ZXIuTk9ORU5VTUVSQUJMRV9ERVNDUklQVE9SKTtcblxuICB0aGlzLnNldFByb3BlcnR5KHRoaXMuREFURSwgJ3BhcnNlJyxcbiAgICAgIHRoaXMuY3JlYXRlTmF0aXZlRnVuY3Rpb24oRGF0ZS5wYXJzZSwgZmFsc2UpLFxuICAgICAgSW50ZXJwcmV0ZXIuTk9ORU5VTUVSQUJMRV9ERVNDUklQVE9SKTtcblxuICB0aGlzLnNldFByb3BlcnR5KHRoaXMuREFURSwgJ1VUQycsIHRoaXMuY3JlYXRlTmF0aXZlRnVuY3Rpb24oRGF0ZS5VVEMsIGZhbHNlKSxcbiAgICAgIEludGVycHJldGVyLk5PTkVOVU1FUkFCTEVfREVTQ1JJUFRPUik7XG5cbiAgLy8gSW5zdGFuY2UgbWV0aG9kcyBvbiBEYXRlLlxuICB2YXIgZnVuY3Rpb25zID0gWydnZXREYXRlJywgJ2dldERheScsICdnZXRGdWxsWWVhcicsICdnZXRIb3VycycsXG4gICAgICAnZ2V0TWlsbGlzZWNvbmRzJywgJ2dldE1pbnV0ZXMnLCAnZ2V0TW9udGgnLCAnZ2V0U2Vjb25kcycsICdnZXRUaW1lJyxcbiAgICAgICdnZXRUaW1lem9uZU9mZnNldCcsICdnZXRVVENEYXRlJywgJ2dldFVUQ0RheScsICdnZXRVVENGdWxsWWVhcicsXG4gICAgICAnZ2V0VVRDSG91cnMnLCAnZ2V0VVRDTWlsbGlzZWNvbmRzJywgJ2dldFVUQ01pbnV0ZXMnLCAnZ2V0VVRDTW9udGgnLFxuICAgICAgJ2dldFVUQ1NlY29uZHMnLCAnZ2V0WWVhcicsXG4gICAgICAnc2V0RGF0ZScsICdzZXRGdWxsWWVhcicsICdzZXRIb3VycycsICdzZXRNaWxsaXNlY29uZHMnLFxuICAgICAgJ3NldE1pbnV0ZXMnLCAnc2V0TW9udGgnLCAnc2V0U2Vjb25kcycsICdzZXRUaW1lJywgJ3NldFVUQ0RhdGUnLFxuICAgICAgJ3NldFVUQ0Z1bGxZZWFyJywgJ3NldFVUQ0hvdXJzJywgJ3NldFVUQ01pbGxpc2Vjb25kcycsICdzZXRVVENNaW51dGVzJyxcbiAgICAgICdzZXRVVENNb250aCcsICdzZXRVVENTZWNvbmRzJywgJ3NldFllYXInLFxuICAgICAgJ3RvRGF0ZVN0cmluZycsICd0b0lTT1N0cmluZycsICd0b0pTT04nLCAndG9HTVRTdHJpbmcnLFxuICAgICAgJ3RvTG9jYWxlRGF0ZVN0cmluZycsICd0b0xvY2FsZVN0cmluZycsICd0b0xvY2FsZVRpbWVTdHJpbmcnLFxuICAgICAgJ3RvVGltZVN0cmluZycsICd0b1VUQ1N0cmluZyddO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGZ1bmN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgIHdyYXBwZXIgPSAoZnVuY3Rpb24obmF0aXZlRnVuYykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhcl9hcmdzKSB7XG4gICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgYXJnc1tpXSA9IHRoaXNJbnRlcnByZXRlci5wc2V1ZG9Ub05hdGl2ZShhcmd1bWVudHNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFbbmF0aXZlRnVuY10uYXBwbHkodGhpcy5kYXRhLCBhcmdzKTtcbiAgICAgIH07XG4gICAgfSkoZnVuY3Rpb25zW2ldKTtcbiAgICB0aGlzLnNldE5hdGl2ZUZ1bmN0aW9uUHJvdG90eXBlKHRoaXMuREFURSwgZnVuY3Rpb25zW2ldLCB3cmFwcGVyKTtcbiAgfVxufTtcblxuLyoqXG4gKiBJbml0aWFsaXplIFJlZ3VsYXIgRXhwcmVzc2lvbiBvYmplY3QuXG4gKiBAcGFyYW0geyFJbnRlcnByZXRlci5PYmplY3R9IHNjb3BlIEdsb2JhbCBzY29wZS5cbiAqL1xuSW50ZXJwcmV0ZXIucHJvdG90eXBlLmluaXRSZWdFeHAgPSBmdW5jdGlvbihzY29wZSkge1xuICB2YXIgdGhpc0ludGVycHJldGVyID0gdGhpcztcbiAgdmFyIHdyYXBwZXI7XG4gIC8vIFJlZ0V4cCBjb25zdHJ1Y3Rvci5cbiAgd3JhcHBlciA9IGZ1bmN0aW9uKHBhdHRlcm4sIGZsYWdzKSB7XG4gICAgaWYgKHRoaXNJbnRlcnByZXRlci5jYWxsZWRXaXRoTmV3KCkpIHtcbiAgICAgIC8vIENhbGxlZCBhcyBuZXcgUmVnRXhwKCkuXG4gICAgICB2YXIgcmd4ID0gdGhpcztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQ2FsbGVkIGFzIFJlZ0V4cCgpLlxuICAgICAgdmFyIHJneCA9IHRoaXNJbnRlcnByZXRlci5jcmVhdGVPYmplY3RQcm90byh0aGlzSW50ZXJwcmV0ZXIuUkVHRVhQX1BST1RPKTtcbiAgICB9XG4gICAgcGF0dGVybiA9IHBhdHRlcm4gPyBTdHJpbmcocGF0dGVybikgOiAnJztcbiAgICBmbGFncyA9IGZsYWdzID8gU3RyaW5nKGZsYWdzKSA6ICcnO1xuICAgIHRoaXNJbnRlcnByZXRlci5wb3B1bGF0ZVJlZ0V4cChyZ3gsIG5ldyBSZWdFeHAocGF0dGVybiwgZmxhZ3MpKTtcbiAgICByZXR1cm4gcmd4O1xuICB9O1xuICB0aGlzLlJFR0VYUCA9IHRoaXMuY3JlYXRlTmF0aXZlRnVuY3Rpb24od3JhcHBlciwgdHJ1ZSk7XG4gIHRoaXMuUkVHRVhQX1BST1RPID0gdGhpcy5SRUdFWFAucHJvcGVydGllc1sncHJvdG90eXBlJ107XG4gIHRoaXMuc2V0UHJvcGVydHkoc2NvcGUsICdSZWdFeHAnLCB0aGlzLlJFR0VYUCk7XG5cbiAgdGhpcy5zZXRQcm9wZXJ0eSh0aGlzLlJFR0VYUC5wcm9wZXJ0aWVzWydwcm90b3R5cGUnXSwgJ2dsb2JhbCcsIHVuZGVmaW5lZCxcbiAgICAgIEludGVycHJldGVyLlJFQURPTkxZX05PTkVOVU1FUkFCTEVfREVTQ1JJUFRPUik7XG4gIHRoaXMuc2V0UHJvcGVydHkodGhpcy5SRUdFWFAucHJvcGVydGllc1sncHJvdG90eXBlJ10sICdpZ25vcmVDYXNlJywgdW5kZWZpbmVkLFxuICAgICAgSW50ZXJwcmV0ZXIuUkVBRE9OTFlfTk9ORU5VTUVSQUJMRV9ERVNDUklQVE9SKTtcbiAgdGhpcy5zZXRQcm9wZXJ0eSh0aGlzLlJFR0VYUC5wcm9wZXJ0aWVzWydwcm90b3R5cGUnXSwgJ211bHRpbGluZScsIHVuZGVmaW5lZCxcbiAgICAgIEludGVycHJldGVyLlJFQURPTkxZX05PTkVOVU1FUkFCTEVfREVTQ1JJUFRPUik7XG4gIHRoaXMuc2V0UHJvcGVydHkodGhpcy5SRUdFWFAucHJvcGVydGllc1sncHJvdG90eXBlJ10sICdzb3VyY2UnLCAnKD86KScsXG4gICAgICBJbnRlcnByZXRlci5SRUFET05MWV9OT05FTlVNRVJBQkxFX0RFU0NSSVBUT1IpO1xuXG4gIC8vIFVzZSBwb2x5ZmlsbCB0byBhdm9pZCBjb21wbGV4aXR5IG9mIHJlZ2V4cCB0aHJlYWRzLlxuICB0aGlzLnBvbHlmaWxsc18ucHVzaChcblwiT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlZ0V4cC5wcm90b3R5cGUsICd0ZXN0JyxcIixcbiAgICBcIntjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlLCB2YWx1ZTpcIixcbiAgXCJmdW5jdGlvbihzdHIpIHtcIixcbiAgICBcInJldHVybiBTdHJpbmcoc3RyKS5zZWFyY2godGhpcykgIT09IC0xXCIsXG4gIFwifVwiLFxuXCJ9KTtcIik7XG5cbiAgd3JhcHBlciA9IGZ1bmN0aW9uKHN0cmluZywgY2FsbGJhY2spIHtcbiAgICB2YXIgdGhpc1BzZXVkb1JlZ0V4cCA9IHRoaXM7XG4gICAgdmFyIHJlZ2V4cCA9IHRoaXNQc2V1ZG9SZWdFeHAuZGF0YTtcbiAgICBzdHJpbmcgPSBTdHJpbmcoc3RyaW5nKTtcbiAgICAvLyBHZXQgbGFzdEluZGV4IGZyb20gd3JhcHBlZCByZWdleCwgc2luY2UgdGhpcyBpcyBzZXR0YWJsZS5cbiAgICByZWdleHAubGFzdEluZGV4ID1cbiAgICAgICAgTnVtYmVyKHRoaXNJbnRlcnByZXRlci5nZXRQcm9wZXJ0eSh0aGlzLCAnbGFzdEluZGV4JykpO1xuICAgIC8vIEV4YW1wbGUgb2YgY2F0YXN0cm9waGljIGV4ZWMgUmVnRXhwOlxuICAgIC8vIC9eKGErKStiLy5leGVjKCdhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFjJylcbiAgICB0aGlzSW50ZXJwcmV0ZXIubWF5YmVUaHJvd1JlZ0V4cChyZWdleHAsIGNhbGxiYWNrKTtcbiAgICBpZiAodGhpc0ludGVycHJldGVyLlJFR0VYUF9NT0RFID09PSAyKSB7XG4gICAgICBpZiAoSW50ZXJwcmV0ZXIudm0pIHtcbiAgICAgICAgLy8gUnVuIGV4ZWMgaW4gdm0uXG4gICAgICAgIHZhciBzYW5kYm94ID0ge1xuICAgICAgICAgICdzdHJpbmcnOiBzdHJpbmcsXG4gICAgICAgICAgJ3JlZ2V4cCc6IHJlZ2V4cFxuICAgICAgICB9O1xuICAgICAgICB2YXIgY29kZSA9ICdyZWdleHAuZXhlYyhzdHJpbmcpJztcbiAgICAgICAgdmFyIG1hdGNoID0gdGhpc0ludGVycHJldGVyLnZtQ2FsbChjb2RlLCBzYW5kYm94LCByZWdleHAsIGNhbGxiYWNrKTtcbiAgICAgICAgaWYgKG1hdGNoICE9PSBJbnRlcnByZXRlci5SRUdFWFBfVElNRU9VVCkge1xuICAgICAgICAgIHRoaXNJbnRlcnByZXRlci5zZXRQcm9wZXJ0eSh0aGlzUHNldWRvUmVnRXhwLCAnbGFzdEluZGV4JyxcbiAgICAgICAgICAgICAgcmVnZXhwLmxhc3RJbmRleCk7XG4gICAgICAgICAgY2FsbGJhY2sobWF0Y2hUb1BzZXVkbyhtYXRjaCkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBSdW4gZXhlYyBpbiBzZXBhcmF0ZSB0aHJlYWQuXG4gICAgICAgIC8vIE5vdGUgdGhhdCBsYXN0SW5kZXggaXMgbm90IHByZXNlcnZlZCB3aGVuIGEgUmVnRXhwIGlzIHBhc3NlZCB0byBhXG4gICAgICAgIC8vIFdlYiBXb3JrZXIuICBUaHVzIGl0IG5lZWRzIHRvIGJlIHBhc3NlZCBiYWNrIGFuZCBmb3J0aCBzZXBhcmF0ZWx5LlxuICAgICAgICB2YXIgZXhlY1dvcmtlciA9IHRoaXNJbnRlcnByZXRlci5jcmVhdGVXb3JrZXIoKTtcbiAgICAgICAgdmFyIHBpZCA9IHRoaXNJbnRlcnByZXRlci5yZWdFeHBUaW1lb3V0KHJlZ2V4cCwgZXhlY1dvcmtlciwgY2FsbGJhY2spO1xuICAgICAgICBleGVjV29ya2VyLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQocGlkKTtcbiAgICAgICAgICAvLyBSZXR1cm4gdHVwbGU6IFtyZXN1bHQsIGxhc3RJbmRleF1cbiAgICAgICAgICB0aGlzSW50ZXJwcmV0ZXIuc2V0UHJvcGVydHkodGhpc1BzZXVkb1JlZ0V4cCwgJ2xhc3RJbmRleCcsXG4gICAgICAgICAgICAgIGUuZGF0YVsxXSk7XG4gICAgICAgICAgY2FsbGJhY2sobWF0Y2hUb1BzZXVkbyhlLmRhdGFbMF0pKTtcbiAgICAgICAgfTtcbiAgICAgICAgZXhlY1dvcmtlci5wb3N0TWVzc2FnZShbJ2V4ZWMnLCByZWdleHAsIHJlZ2V4cC5sYXN0SW5kZXgsIHN0cmluZ10pO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBSdW4gZXhlYyBuYXRpdmVseS5cbiAgICB2YXIgbWF0Y2ggPSByZWdleHAuZXhlYyhzdHJpbmcpO1xuICAgIHRoaXNJbnRlcnByZXRlci5zZXRQcm9wZXJ0eSh0aGlzUHNldWRvUmVnRXhwLCAnbGFzdEluZGV4JyxcbiAgICAgICAgcmVnZXhwLmxhc3RJbmRleCk7XG4gICAgY2FsbGJhY2sobWF0Y2hUb1BzZXVkbyhtYXRjaCkpO1xuXG4gICAgZnVuY3Rpb24gbWF0Y2hUb1BzZXVkbyhtYXRjaCkge1xuICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSB0aGlzSW50ZXJwcmV0ZXIuYXJyYXlOYXRpdmVUb1BzZXVkbyhtYXRjaCk7XG4gICAgICAgIC8vIG1hdGNoIGhhcyBhZGRpdGlvbmFsIHByb3BlcnRpZXMuXG4gICAgICAgIHRoaXNJbnRlcnByZXRlci5zZXRQcm9wZXJ0eShyZXN1bHQsICdpbmRleCcsIG1hdGNoLmluZGV4KTtcbiAgICAgICAgdGhpc0ludGVycHJldGVyLnNldFByb3BlcnR5KHJlc3VsdCwgJ2lucHV0JywgbWF0Y2guaW5wdXQpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9O1xuICB0aGlzLnNldEFzeW5jRnVuY3Rpb25Qcm90b3R5cGUodGhpcy5SRUdFWFAsICdleGVjJywgd3JhcHBlcik7XG59O1xuXG4vKipcbiAqIEluaXRpYWxpemUgdGhlIEVycm9yIGNsYXNzLlxuICogQHBhcmFtIHshSW50ZXJwcmV0ZXIuT2JqZWN0fSBzY29wZSBHbG9iYWwgc2NvcGUuXG4gKi9cbkludGVycHJldGVyLnByb3RvdHlwZS5pbml0RXJyb3IgPSBmdW5jdGlvbihzY29wZSkge1xuICB2YXIgdGhpc0ludGVycHJldGVyID0gdGhpcztcbiAgLy8gRXJyb3IgY29uc3RydWN0b3IuXG4gIHRoaXMuRVJST1IgPSB0aGlzLmNyZWF0ZU5hdGl2ZUZ1bmN0aW9uKGZ1bmN0aW9uKG9wdF9tZXNzYWdlKSB7XG4gICAgaWYgKHRoaXNJbnRlcnByZXRlci5jYWxsZWRXaXRoTmV3KCkpIHtcbiAgICAgIC8vIENhbGxlZCBhcyBuZXcgRXJyb3IoKS5cbiAgICAgIHZhciBuZXdFcnJvciA9IHRoaXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIENhbGxlZCBhcyBFcnJvcigpLlxuICAgICAgdmFyIG5ld0Vycm9yID0gdGhpc0ludGVycHJldGVyLmNyZWF0ZU9iamVjdCh0aGlzSW50ZXJwcmV0ZXIuRVJST1IpO1xuICAgIH1cbiAgICBpZiAob3B0X21lc3NhZ2UpIHtcbiAgICAgIHRoaXNJbnRlcnByZXRlci5zZXRQcm9wZXJ0eShuZXdFcnJvciwgJ21lc3NhZ2UnLCBTdHJpbmcob3B0X21lc3NhZ2UpLFxuICAgICAgICAgIEludGVycHJldGVyLk5PTkVOVU1FUkFCTEVfREVTQ1JJUFRPUik7XG4gICAgfVxuICAgIHJldHVybiBuZXdFcnJvcjtcbiAgfSwgdHJ1ZSk7XG4gIHRoaXMuc2V0UHJvcGVydHkoc2NvcGUsICdFcnJvcicsIHRoaXMuRVJST1IpO1xuICB0aGlzLnNldFByb3BlcnR5KHRoaXMuRVJST1IucHJvcGVydGllc1sncHJvdG90eXBlJ10sICdtZXNzYWdlJywgJycsXG4gICAgICBJbnRlcnByZXRlci5OT05FTlVNRVJBQkxFX0RFU0NSSVBUT1IpO1xuICB0aGlzLnNldFByb3BlcnR5KHRoaXMuRVJST1IucHJvcGVydGllc1sncHJvdG90eXBlJ10sICduYW1lJywgJ0Vycm9yJyxcbiAgICAgIEludGVycHJldGVyLk5PTkVOVU1FUkFCTEVfREVTQ1JJUFRPUik7XG5cbiAgdmFyIGNyZWF0ZUVycm9yU3ViY2xhc3MgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGNvbnN0cnVjdG9yID0gdGhpc0ludGVycHJldGVyLmNyZWF0ZU5hdGl2ZUZ1bmN0aW9uKFxuICAgICAgICBmdW5jdGlvbihvcHRfbWVzc2FnZSkge1xuICAgICAgICAgIGlmICh0aGlzSW50ZXJwcmV0ZXIuY2FsbGVkV2l0aE5ldygpKSB7XG4gICAgICAgICAgICAvLyBDYWxsZWQgYXMgbmV3IFh5ekVycm9yKCkuXG4gICAgICAgICAgICB2YXIgbmV3RXJyb3IgPSB0aGlzO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBDYWxsZWQgYXMgWHl6RXJyb3IoKS5cbiAgICAgICAgICAgIHZhciBuZXdFcnJvciA9IHRoaXNJbnRlcnByZXRlci5jcmVhdGVPYmplY3QoY29uc3RydWN0b3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAob3B0X21lc3NhZ2UpIHtcbiAgICAgICAgICAgIHRoaXNJbnRlcnByZXRlci5zZXRQcm9wZXJ0eShuZXdFcnJvciwgJ21lc3NhZ2UnLFxuICAgICAgICAgICAgICAgIFN0cmluZyhvcHRfbWVzc2FnZSksIEludGVycHJldGVyLk5PTkVOVU1FUkFCTEVfREVTQ1JJUFRPUik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBuZXdFcnJvcjtcbiAgICAgICAgfSwgdHJ1ZSk7XG4gICAgdGhpc0ludGVycHJldGVyLnNldFByb3BlcnR5KGNvbnN0cnVjdG9yLCAncHJvdG90eXBlJyxcbiAgICAgICAgdGhpc0ludGVycHJldGVyLmNyZWF0ZU9iamVjdCh0aGlzSW50ZXJwcmV0ZXIuRVJST1IpLFxuICAgICAgICBJbnRlcnByZXRlci5OT05FTlVNRVJBQkxFX0RFU0NSSVBUT1IpO1xuICAgIHRoaXNJbnRlcnByZXRlci5zZXRQcm9wZXJ0eShjb25zdHJ1Y3Rvci5wcm9wZXJ0aWVzWydwcm90b3R5cGUnXSwgJ25hbWUnLFxuICAgICAgICBuYW1lLCBJbnRlcnByZXRlci5OT05FTlVNRVJBQkxFX0RFU0NSSVBUT1IpO1xuICAgIHRoaXNJbnRlcnByZXRlci5zZXRQcm9wZXJ0eShzY29wZSwgbmFtZSwgY29uc3RydWN0b3IpO1xuXG4gICAgcmV0dXJuIGNvbnN0cnVjdG9yO1xuICB9O1xuXG4gIHRoaXMuRVZBTF9FUlJPUiA9IGNyZWF0ZUVycm9yU3ViY2xhc3MoJ0V2YWxFcnJvcicpO1xuICB0aGlzLlJBTkdFX0VSUk9SID0gY3JlYXRlRXJyb3JTdWJjbGFzcygnUmFuZ2VFcnJvcicpO1xuICB0aGlzLlJFRkVSRU5DRV9FUlJPUiA9IGNyZWF0ZUVycm9yU3ViY2xhc3MoJ1JlZmVyZW5jZUVycm9yJyk7XG4gIHRoaXMuU1lOVEFYX0VSUk9SID0gY3JlYXRlRXJyb3JTdWJjbGFzcygnU3ludGF4RXJyb3InKTtcbiAgdGhpcy5UWVBFX0VSUk9SID0gY3JlYXRlRXJyb3JTdWJjbGFzcygnVHlwZUVycm9yJyk7XG4gIHRoaXMuVVJJX0VSUk9SID0gY3JlYXRlRXJyb3JTdWJjbGFzcygnVVJJRXJyb3InKTtcbn07XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBNYXRoIG9iamVjdC5cbiAqIEBwYXJhbSB7IUludGVycHJldGVyLk9iamVjdH0gc2NvcGUgR2xvYmFsIHNjb3BlLlxuICovXG5JbnRlcnByZXRlci5wcm90b3R5cGUuaW5pdE1hdGggPSBmdW5jdGlvbihzY29wZSkge1xuICB2YXIgdGhpc0ludGVycHJldGVyID0gdGhpcztcbiAgdmFyIG15TWF0aCA9IHRoaXMuY3JlYXRlT2JqZWN0UHJvdG8odGhpcy5PQkpFQ1RfUFJPVE8pO1xuICB0aGlzLnNldFByb3BlcnR5KHNjb3BlLCAnTWF0aCcsIG15TWF0aCk7XG4gIHZhciBtYXRoQ29uc3RzID0gWydFJywgJ0xOMicsICdMTjEwJywgJ0xPRzJFJywgJ0xPRzEwRScsICdQSScsXG4gICAgICAgICAgICAgICAgICAgICdTUVJUMV8yJywgJ1NRUlQyJ107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbWF0aENvbnN0cy5sZW5ndGg7IGkrKykge1xuICAgIHRoaXMuc2V0UHJvcGVydHkobXlNYXRoLCBtYXRoQ29uc3RzW2ldLCBNYXRoW21hdGhDb25zdHNbaV1dLFxuICAgICAgICBJbnRlcnByZXRlci5SRUFET05MWV9OT05FTlVNRVJBQkxFX0RFU0NSSVBUT1IpO1xuICB9XG4gIHZhciBudW1GdW5jdGlvbnMgPSBbJ2FicycsICdhY29zJywgJ2FzaW4nLCAnYXRhbicsICdhdGFuMicsICdjZWlsJywgJ2NvcycsXG4gICAgICAgICAgICAgICAgICAgICAgJ2V4cCcsICdmbG9vcicsICdsb2cnLCAnbWF4JywgJ21pbicsICdwb3cnLCAncmFuZG9tJyxcbiAgICAgICAgICAgICAgICAgICAgICAncm91bmQnLCAnc2luJywgJ3NxcnQnLCAndGFuJ107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtRnVuY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgdGhpcy5zZXRQcm9wZXJ0eShteU1hdGgsIG51bUZ1bmN0aW9uc1tpXSxcbiAgICAgICAgdGhpcy5jcmVhdGVOYXRpdmVGdW5jdGlvbihNYXRoW251bUZ1bmN0aW9uc1tpXV0sIGZhbHNlKSxcbiAgICAgICAgSW50ZXJwcmV0ZXIuTk9ORU5VTUVSQUJMRV9ERVNDUklQVE9SKTtcbiAgfVxufTtcblxuLyoqXG4gKiBJbml0aWFsaXplIEpTT04gb2JqZWN0LlxuICogQHBhcmFtIHshSW50ZXJwcmV0ZXIuT2JqZWN0fSBzY29wZSBHbG9iYWwgc2NvcGUuXG4gKi9cbkludGVycHJldGVyLnByb3RvdHlwZS5pbml0SlNPTiA9IGZ1bmN0aW9uKHNjb3BlKSB7XG4gIHZhciB0aGlzSW50ZXJwcmV0ZXIgPSB0aGlzO1xuICB2YXIgbXlKU09OID0gdGhpc0ludGVycHJldGVyLmNyZWF0ZU9iamVjdFByb3RvKHRoaXMuT0JKRUNUX1BST1RPKTtcbiAgdGhpcy5zZXRQcm9wZXJ0eShzY29wZSwgJ0pTT04nLCBteUpTT04pO1xuXG4gIHZhciB3cmFwcGVyID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHRyeSB7XG4gICAgICB2YXIgbmF0aXZlT2JqID0gSlNPTi5wYXJzZShTdHJpbmcodGV4dCkpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXNJbnRlcnByZXRlci50aHJvd0V4Y2VwdGlvbih0aGlzSW50ZXJwcmV0ZXIuU1lOVEFYX0VSUk9SLCBlLm1lc3NhZ2UpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpc0ludGVycHJldGVyLm5hdGl2ZVRvUHNldWRvKG5hdGl2ZU9iaik7XG4gIH07XG4gIHRoaXMuc2V0UHJvcGVydHkobXlKU09OLCAncGFyc2UnLCB0aGlzLmNyZWF0ZU5hdGl2ZUZ1bmN0aW9uKHdyYXBwZXIsIGZhbHNlKSk7XG5cbiAgd3JhcHBlciA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIG5hdGl2ZU9iaiA9IHRoaXNJbnRlcnByZXRlci5wc2V1ZG9Ub05hdGl2ZSh2YWx1ZSk7XG4gICAgdHJ5IHtcbiAgICAgIHZhciBzdHIgPSBKU09OLnN0cmluZ2lmeShuYXRpdmVPYmopO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXNJbnRlcnByZXRlci50aHJvd0V4Y2VwdGlvbih0aGlzSW50ZXJwcmV0ZXIuVFlQRV9FUlJPUiwgZS5tZXNzYWdlKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0cjtcbiAgfTtcbiAgdGhpcy5zZXRQcm9wZXJ0eShteUpTT04sICdzdHJpbmdpZnknLFxuICAgICAgdGhpcy5jcmVhdGVOYXRpdmVGdW5jdGlvbih3cmFwcGVyLCBmYWxzZSkpO1xufTtcblxuLyoqXG4gKiBJcyBhbiBvYmplY3Qgb2YgYSBjZXJ0YWluIGNsYXNzP1xuICogQHBhcmFtIHtJbnRlcnByZXRlci5WYWx1ZX0gY2hpbGQgT2JqZWN0IHRvIGNoZWNrLlxuICogQHBhcmFtIHtJbnRlcnByZXRlci5PYmplY3R9IGNvbnN0cnVjdG9yIENvbnN0cnVjdG9yIG9mIG9iamVjdC5cbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgb2JqZWN0IGlzIHRoZSBjbGFzcyBvciBpbmhlcml0cyBmcm9tIGl0LlxuICogICAgIEZhbHNlIG90aGVyd2lzZS5cbiAqL1xuSW50ZXJwcmV0ZXIucHJvdG90eXBlLmlzYSA9IGZ1bmN0aW9uKGNoaWxkLCBjb25zdHJ1Y3Rvcikge1xuICBpZiAoY2hpbGQgPT09IG51bGwgfHwgY2hpbGQgPT09IHVuZGVmaW5lZCB8fCAhY29uc3RydWN0b3IpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHByb3RvID0gY29uc3RydWN0b3IucHJvcGVydGllc1sncHJvdG90eXBlJ107XG4gIGlmIChjaGlsZCA9PT0gcHJvdG8pIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICAvLyBUaGUgZmlyc3Qgc3RlcCB1cCB0aGUgcHJvdG90eXBlIGNoYWluIGlzIGhhcmRlciBzaW5jZSB0aGUgY2hpbGQgbWlnaHQgYmVcbiAgLy8gYSBwcmltaXRpdmUgdmFsdWUuICBTdWJzZXF1ZW50IHN0ZXBzIGNhbiBqdXN0IGZvbGxvdyB0aGUgLnByb3RvIHByb3BlcnR5LlxuICBjaGlsZCA9IHRoaXMuZ2V0UHJvdG90eXBlKGNoaWxkKTtcbiAgd2hpbGUgKGNoaWxkKSB7XG4gICAgaWYgKGNoaWxkID09PSBwcm90bykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGNoaWxkID0gY2hpbGQucHJvdG87XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgcHNldWRvIHJlZ3VsYXIgZXhwcmVzc2lvbiBvYmplY3QgYmFzZWQgb24gYSBuYXRpdmUgcmVndWxhclxuICogZXhwcmVzc2lvbiBvYmplY3QuXG4gKiBAcGFyYW0geyFJbnRlcnByZXRlci5PYmplY3R9IHBzZXVkb1JlZ2V4cCBUaGUgZXhpc3Rpbmcgb2JqZWN0IHRvIHNldC5cbiAqIEBwYXJhbSB7IVJlZ0V4cH0gbmF0aXZlUmVnZXhwIFRoZSBuYXRpdmUgcmVndWxhciBleHByZXNzaW9uLlxuICovXG5JbnRlcnByZXRlci5wcm90b3R5cGUucG9wdWxhdGVSZWdFeHAgPSBmdW5jdGlvbihwc2V1ZG9SZWdleHAsIG5hdGl2ZVJlZ2V4cCkge1xuICBwc2V1ZG9SZWdleHAuZGF0YSA9IG5hdGl2ZVJlZ2V4cDtcbiAgLy8gbGFzdEluZGV4IGlzIHNldHRhYmxlLCBhbGwgb3RoZXJzIGFyZSByZWFkLW9ubHkgYXR0cmlidXRlc1xuICB0aGlzLnNldFByb3BlcnR5KHBzZXVkb1JlZ2V4cCwgJ2xhc3RJbmRleCcsIG5hdGl2ZVJlZ2V4cC5sYXN0SW5kZXgsXG4gICAgICBJbnRlcnByZXRlci5OT05FTlVNRVJBQkxFX0RFU0NSSVBUT1IpO1xuICB0aGlzLnNldFByb3BlcnR5KHBzZXVkb1JlZ2V4cCwgJ3NvdXJjZScsIG5hdGl2ZVJlZ2V4cC5zb3VyY2UsXG4gICAgICBJbnRlcnByZXRlci5SRUFET05MWV9OT05FTlVNRVJBQkxFX0RFU0NSSVBUT1IpO1xuICB0aGlzLnNldFByb3BlcnR5KHBzZXVkb1JlZ2V4cCwgJ2dsb2JhbCcsIG5hdGl2ZVJlZ2V4cC5nbG9iYWwsXG4gICAgICBJbnRlcnByZXRlci5SRUFET05MWV9OT05FTlVNRVJBQkxFX0RFU0NSSVBUT1IpO1xuICB0aGlzLnNldFByb3BlcnR5KHBzZXVkb1JlZ2V4cCwgJ2lnbm9yZUNhc2UnLCBuYXRpdmVSZWdleHAuaWdub3JlQ2FzZSxcbiAgICAgIEludGVycHJldGVyLlJFQURPTkxZX05PTkVOVU1FUkFCTEVfREVTQ1JJUFRPUik7XG4gIHRoaXMuc2V0UHJvcGVydHkocHNldWRvUmVnZXhwLCAnbXVsdGlsaW5lJywgbmF0aXZlUmVnZXhwLm11bHRpbGluZSxcbiAgICAgIEludGVycHJldGVyLlJFQURPTkxZX05PTkVOVU1FUkFCTEVfREVTQ1JJUFRPUik7XG59O1xuXG4vKipcbiAqIENyZWF0ZSBhIFdlYiBXb3JrZXIgdG8gZXhlY3V0ZSByZWd1bGFyIGV4cHJlc3Npb25zLlxuICogVXNpbmcgYSBzZXBhcmF0ZSBmaWxlIGZhaWxzIGluIENocm9tZSB3aGVuIHJ1biBsb2NhbGx5IG9uIGEgZmlsZTovLyBVUkkuXG4gKiBVc2luZyBhIGRhdGEgZW5jb2RlZCBVUkkgZmFpbHMgaW4gSUUgYW5kIEVkZ2UuXG4gKiBVc2luZyBhIGJsb2Igd29ya3MgaW4gSUUxMSBhbmQgYWxsIG90aGVyIGJyb3dzZXJzLlxuICogQHJldHVybiB7IVdvcmtlcn0gV2ViIFdvcmtlciB3aXRoIHJlZ2V4cCBleGVjdXRpb24gY29kZSBsb2FkZWQuXG4gKi9cbkludGVycHJldGVyLnByb3RvdHlwZS5jcmVhdGVXb3JrZXIgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGJsb2IgPSB0aGlzLmNyZWF0ZVdvcmtlci5ibG9iXztcbiAgaWYgKCFibG9iKSB7XG4gICAgYmxvYiA9IG5ldyBCbG9iKFtJbnRlcnByZXRlci5XT1JLRVJfQ09ERS5qb2luKCdcXG4nKV0sXG4gICAgICAgIHt0eXBlOiAnYXBwbGljYXRpb24vamF2YXNjcmlwdCd9KTtcbiAgICAvLyBDYWNoZSB0aGUgYmxvYiwgc28gaXQgZG9lc24ndCBuZWVkIHRvIGJlIGNyZWF0ZWQgbmV4dCB0aW1lLlxuICAgIHRoaXMuY3JlYXRlV29ya2VyLmJsb2JfID0gYmxvYjtcbiAgfVxuICByZXR1cm4gbmV3IFdvcmtlcihVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpKTtcbn07XG5cbi8qKlxuICogRXhlY3V0ZSByZWd1bGFyIGV4cHJlc3Npb25zIGluIGEgbm9kZSB2bS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjb2RlIENvZGUgdG8gZXhlY3V0ZS5cbiAqIEBwYXJhbSB7IU9iamVjdH0gc2FuZGJveCBHbG9iYWwgdmFyaWFibGVzIGZvciBuZXcgdm0uXG4gKiBAcGFyYW0geyFSZWdFeHB9IG5hdGl2ZVJlZ0V4cCBSZWd1bGFyIGV4cHJlc3Npb24uXG4gKiBAcGFyYW0geyFGdW5jdGlvbn0gY2FsbGJhY2sgQXN5bmNocm9ub3VzIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICovXG5JbnRlcnByZXRlci5wcm90b3R5cGUudm1DYWxsID0gZnVuY3Rpb24oY29kZSwgc2FuZGJveCwgbmF0aXZlUmVnRXhwLCBjYWxsYmFjaykge1xuICB2YXIgb3B0aW9ucyA9IHsndGltZW91dCc6IHRoaXMuUkVHRVhQX1RIUkVBRF9USU1FT1VUfTtcbiAgdHJ5IHtcbiAgICByZXR1cm4gSW50ZXJwcmV0ZXIudm1bJ3J1bkluTmV3Q29udGV4dCddKGNvZGUsIHNhbmRib3gsIG9wdGlvbnMpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY2FsbGJhY2sobnVsbCk7XG4gICAgdGhpcy50aHJvd0V4Y2VwdGlvbih0aGlzLkVSUk9SLCAnUmVnRXhwIFRpbWVvdXQ6ICcgKyBuYXRpdmVSZWdFeHApO1xuICB9XG4gIHJldHVybiBJbnRlcnByZXRlci5SRUdFWFBfVElNRU9VVDtcbn07XG5cbi8qKlxuICogSWYgUkVHRVhQX01PREUgaXMgMCwgdGhlbiB0aHJvdyBhbiBlcnJvci5cbiAqIEFsc28gdGhyb3cgaWYgUkVHRVhQX01PREUgaXMgMiBhbmQgSlMgZG9lc24ndCBzdXBwb3J0IFdlYiBXb3JrZXJzIG9yIHZtLlxuICogQHBhcmFtIHshUmVnRXhwfSBuYXRpdmVSZWdFeHAgUmVndWxhciBleHByZXNzaW9uLlxuICogQHBhcmFtIHshRnVuY3Rpb259IGNhbGxiYWNrIEFzeW5jaHJvbm91cyBjYWxsYmFjayBmdW5jdGlvbi5cbiAqL1xuSW50ZXJwcmV0ZXIucHJvdG90eXBlLm1heWJlVGhyb3dSZWdFeHAgPSBmdW5jdGlvbihuYXRpdmVSZWdFeHAsIGNhbGxiYWNrKSB7XG4gIHZhciBvaztcbiAgaWYgKHRoaXMuUkVHRVhQX01PREUgPT09IDApIHtcbiAgICAvLyBGYWlsOiBObyBSZWdFeHAgc3VwcG9ydC5cbiAgICBvayA9IGZhbHNlO1xuICB9IGVsc2UgaWYgKHRoaXMuUkVHRVhQX01PREUgPT09IDEpIHtcbiAgICAvLyBPazogTmF0aXZlIFJlZ0V4cCBzdXBwb3J0LlxuICAgIG9rID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICAvLyBTYW5kYm94ZWQgUmVnRXhwIGhhbmRsaW5nLlxuICAgIGlmIChJbnRlcnByZXRlci52bSkge1xuICAgICAgLy8gT2s6IE5vZGUncyB2bSBtb2R1bGUgYWxyZWFkeSBsb2FkZWQuXG4gICAgICBvayA9IHRydWU7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgV29ya2VyID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBVUkwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIE9rOiBXZWIgV29ya2VycyBhdmFpbGFibGUuXG4gICAgICBvayA9IHRydWU7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gVHJ5IHRvIGxvYWQgTm9kZSdzIHZtIG1vZHVsZS5cbiAgICAgIHRyeSB7XG4gICAgICAgIEludGVycHJldGVyLnZtID0gcmVxdWlyZSgndm0nKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHt9O1xuICAgICAgb2sgPSAhIUludGVycHJldGVyLnZtO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBGYWlsOiBOZWl0aGVyIFdlYiBXb3JrZXJzIG5vciB2bSBhdmFpbGFibGUuXG4gICAgICBvayA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICBpZiAoIW9rKSB7XG4gICAgY2FsbGJhY2sobnVsbCk7XG4gICAgdGhpcy50aHJvd0V4Y2VwdGlvbih0aGlzLkVSUk9SLCAnUmVndWxhciBleHByZXNzaW9ucyBub3Qgc3VwcG9ydGVkOiAnICtcbiAgICAgICAgbmF0aXZlUmVnRXhwKTtcbiAgfVxufTtcblxuLyoqXG4gKiBTZXQgYSB0aW1lb3V0IGZvciByZWd1bGFyIGV4cHJlc3Npb24gdGhyZWFkcy4gIFVubGVzcyBjYW5jZWxsZWQsIHRoaXMgd2lsbFxuICogdGVybWluYXRlIHRoZSB0aHJlYWQgYW5kIHRocm93IGFuIGVycm9yLlxuICogQHBhcmFtIHshUmVnRXhwfSBuYXRpdmVSZWdFeHAgUmVndWxhciBleHByZXNzaW9uICh1c2VkIGZvciBlcnJvciBtZXNzYWdlKS5cbiAqIEBwYXJhbSB7IVdvcmtlcn0gd29ya2VyIFRocmVhZCB0byB0ZXJtaW5hdGUuXG4gKiBAcGFyYW0geyFGdW5jdGlvbn0gY2FsbGJhY2sgQXN5bmMgY2FsbGJhY2sgZnVuY3Rpb24gdG8gY29udGludWUgZXhlY3V0aW9uLlxuICogQHJldHVybiB7bnVtYmVyfSBQSUQgb2YgdGltZW91dC4gIFVzZWQgdG8gY2FuY2VsIGlmIHRocmVhZCBjb21wbGV0ZXMuXG4gKi9cbkludGVycHJldGVyLnByb3RvdHlwZS5yZWdFeHBUaW1lb3V0ID0gZnVuY3Rpb24obmF0aXZlUmVnRXhwLCB3b3JrZXIsIGNhbGxiYWNrKSB7XG4gIHZhciB0aGlzSW50ZXJwcmV0ZXIgPSB0aGlzO1xuICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIHdvcmtlci50ZXJtaW5hdGUoKTtcbiAgICAgIGNhbGxiYWNrKG51bGwpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpc0ludGVycHJldGVyLnRocm93RXhjZXB0aW9uKHRoaXNJbnRlcnByZXRlci5FUlJPUixcbiAgICAgICAgICAgICdSZWdFeHAgVGltZW91dDogJyArIG5hdGl2ZVJlZ0V4cCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIEVhdCB0aGUgZXhwZWN0ZWQgSW50ZXJwcmV0ZXIuU1RFUF9FUlJPUi5cbiAgICAgIH1cbiAgfSwgdGhpcy5SRUdFWFBfVEhSRUFEX1RJTUVPVVQpO1xufTtcblxuLyoqXG4gKiBJcyBhIHZhbHVlIGEgbGVnYWwgaW50ZWdlciBmb3IgYW4gYXJyYXkgbGVuZ3RoP1xuICogQHBhcmFtIHtJbnRlcnByZXRlci5WYWx1ZX0geCBWYWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm4ge251bWJlcn0gWmVybywgb3IgYSBwb3NpdGl2ZSBpbnRlZ2VyIGlmIHRoZSB2YWx1ZSBjYW4gYmVcbiAqICAgICBjb252ZXJ0ZWQgdG8gc3VjaC4gIE5hTiBvdGhlcndpc2UuXG4gKi9cbkludGVycHJldGVyLmxlZ2FsQXJyYXlMZW5ndGggPSBmdW5jdGlvbih4KSB7XG4gIHZhciBuID0geCA+Pj4gMDtcbiAgLy8gQXJyYXkgbGVuZ3RoIG11c3QgYmUgYmV0d2VlbiAwIGFuZCAyXjMyLTEgKGluY2x1c2l2ZSkuXG4gIHJldHVybiAobiA9PT0gTnVtYmVyKHgpKSA/IG4gOiBOYU47XG59O1xuXG4vKipcbiAqIElzIGEgdmFsdWUgYSBsZWdhbCBpbnRlZ2VyIGZvciBhbiBhcnJheSBpbmRleD9cbiAqIEBwYXJhbSB7SW50ZXJwcmV0ZXIuVmFsdWV9IHggVmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJuIHtudW1iZXJ9IFplcm8sIG9yIGEgcG9zaXRpdmUgaW50ZWdlciBpZiB0aGUgdmFsdWUgY2FuIGJlXG4gKiAgICAgY29udmVydGVkIHRvIHN1Y2guICBOYU4gb3RoZXJ3aXNlLlxuICovXG5JbnRlcnByZXRlci5sZWdhbEFycmF5SW5kZXggPSBmdW5jdGlvbih4KSB7XG4gIHZhciBuID0geCA+Pj4gMDtcbiAgLy8gQXJyYXkgaW5kZXggY2Fubm90IGJlIDJeMzItMSwgb3RoZXJ3aXNlIGxlbmd0aCB3b3VsZCBiZSAyXjMyLlxuICAvLyAweGZmZmZmZmZmIGlzIDJeMzItMS5cbiAgcmV0dXJuIChTdHJpbmcobikgPT09IFN0cmluZyh4KSAmJiBuICE9PSAweGZmZmZmZmZmKSA/IG4gOiBOYU47XG59O1xuXG4vKipcbiAqIFR5cGVkZWYgZm9yIEpTIHZhbHVlcy5cbiAqIEB0eXBlZGVmIHshSW50ZXJwcmV0ZXIuT2JqZWN0fGJvb2xlYW58bnVtYmVyfHN0cmluZ3x1bmRlZmluZWR8bnVsbH1cbiAqL1xuSW50ZXJwcmV0ZXIuVmFsdWU7XG5cbi8qKlxuICogQ2xhc3MgZm9yIGFuIG9iamVjdC5cbiAqIEBwYXJhbSB7SW50ZXJwcmV0ZXIuT2JqZWN0fSBwcm90byBQcm90b3R5cGUgb2JqZWN0IG9yIG51bGwuXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuSW50ZXJwcmV0ZXIuT2JqZWN0ID0gZnVuY3Rpb24ocHJvdG8pIHtcbiAgdGhpcy5nZXR0ZXIgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB0aGlzLnNldHRlciA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHRoaXMucHJvcGVydGllcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHRoaXMucHJvdG8gPSBwcm90bztcbn07XG5cbi8qKiBAdHlwZSB7SW50ZXJwcmV0ZXIuT2JqZWN0fSAqL1xuSW50ZXJwcmV0ZXIuT2JqZWN0LnByb3RvdHlwZS5wcm90byA9IG51bGw7XG5cbi8qKiBAdHlwZSB7Ym9vbGVhbn0gKi9cbkludGVycHJldGVyLk9iamVjdC5wcm90b3R5cGUuaXNPYmplY3QgPSB0cnVlO1xuXG4vKiogQHR5cGUge3N0cmluZ30gKi9cbkludGVycHJldGVyLk9iamVjdC5wcm90b3R5cGUuY2xhc3MgPSAnT2JqZWN0JztcblxuLyoqIEB0eXBlIHtEYXRlfFJlZ0V4cHxib29sZWFufG51bWJlcnxzdHJpbmd8dW5kZWZpbmVkfG51bGx9ICovXG5JbnRlcnByZXRlci5PYmplY3QucHJvdG90eXBlLmRhdGEgPSBudWxsO1xuXG4vKipcbiAqIENvbnZlcnQgdGhpcyBvYmplY3QgaW50byBhIHN0cmluZy5cbiAqIEByZXR1cm4ge3N0cmluZ30gU3RyaW5nIHZhbHVlLlxuICogQG92ZXJyaWRlXG4gKi9cbkludGVycHJldGVyLk9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuY2xhc3MgPT09ICdBcnJheScpIHtcbiAgICAvLyBBcnJheVxuICAgIHZhciBjeWNsZXMgPSBJbnRlcnByZXRlci50b1N0cmluZ0N5Y2xlc187XG4gICAgY3ljbGVzLnB1c2godGhpcyk7XG4gICAgdHJ5IHtcbiAgICAgIHZhciBzdHJzID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLnByb3BlcnRpZXNbaV07XG4gICAgICAgIHN0cnNbaV0gPSAodmFsdWUgJiYgdmFsdWUuaXNPYmplY3QgJiYgY3ljbGVzLmluZGV4T2YodmFsdWUpICE9PSAtMSkgP1xuICAgICAgICAgICAgJy4uLicgOiB2YWx1ZTtcbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgY3ljbGVzLnBvcCgpO1xuICAgIH1cbiAgICByZXR1cm4gc3Rycy5qb2luKCcsJyk7XG4gIH1cbiAgaWYgKHRoaXMuY2xhc3MgPT09ICdFcnJvcicpIHtcbiAgICB2YXIgY3ljbGVzID0gSW50ZXJwcmV0ZXIudG9TdHJpbmdDeWNsZXNfO1xuICAgIGlmIChjeWNsZXMuaW5kZXhPZih0aGlzKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiAnW29iamVjdCBFcnJvcl0nO1xuICAgIH1cbiAgICB2YXIgbmFtZSwgbWVzc2FnZTtcbiAgICAvLyBCdWc6IERvZXMgbm90IHN1cHBvcnQgZ2V0dGVycyBhbmQgc2V0dGVycyBmb3IgbmFtZSBvciBtZXNzYWdlLlxuICAgIHZhciBvYmogPSB0aGlzO1xuICAgIGRvIHtcbiAgICAgIGlmICgnbmFtZScgaW4gb2JqLnByb3BlcnRpZXMpIHtcbiAgICAgICAgbmFtZSA9IG9iai5wcm9wZXJ0aWVzWyduYW1lJ107XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKChvYmogPSBvYmoucHJvdG8pKTtcbiAgICB2YXIgb2JqID0gdGhpcztcbiAgICBkbyB7XG4gICAgICBpZiAoJ21lc3NhZ2UnIGluIG9iai5wcm9wZXJ0aWVzKSB7XG4gICAgICAgIG1lc3NhZ2UgPSBvYmoucHJvcGVydGllc1snbWVzc2FnZSddO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IHdoaWxlICgob2JqID0gb2JqLnByb3RvKSk7XG4gICAgY3ljbGVzLnB1c2godGhpcyk7XG4gICAgdHJ5IHtcbiAgICAgIG5hbWUgPSBuYW1lICYmIFN0cmluZyhuYW1lKTtcbiAgICAgIG1lc3NhZ2UgPSBtZXNzYWdlICYmIFN0cmluZyhtZXNzYWdlKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgY3ljbGVzLnBvcCgpO1xuICAgIH1cbiAgICByZXR1cm4gbWVzc2FnZSA/IG5hbWUgKyAnOiAnICsgbWVzc2FnZSA6IFN0cmluZyhuYW1lKTtcbiAgfVxuXG4gIC8vIFJlZ0V4cCwgRGF0ZSwgYW5kIGJveGVkIHByaW1pdGl2ZXMuXG4gIGlmICh0aGlzLmRhdGEgIT09IG51bGwpIHtcbiAgICByZXR1cm4gU3RyaW5nKHRoaXMuZGF0YSk7XG4gIH1cblxuICByZXR1cm4gJ1tvYmplY3QgJyArIHRoaXMuY2xhc3MgKyAnXSc7XG59O1xuXG4vKipcbiAqIFJldHVybiB0aGUgb2JqZWN0J3MgdmFsdWUuXG4gKiBAcmV0dXJuIHtJbnRlcnByZXRlci5WYWx1ZX0gVmFsdWUuXG4gKiBAb3ZlcnJpZGVcbiAqL1xuSW50ZXJwcmV0ZXIuT2JqZWN0LnByb3RvdHlwZS52YWx1ZU9mID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmRhdGEgPT09IHVuZGVmaW5lZCB8fCB0aGlzLmRhdGEgPT09IG51bGwgfHxcbiAgICAgIHRoaXMuZGF0YSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgIHJldHVybiB0aGlzOyAvLyBBbiBPYmplY3QuXG4gIH1cbiAgaWYgKHRoaXMuZGF0YSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhLnZhbHVlT2YoKTsgIC8vIE1pbGxpc2Vjb25kcy5cbiAgfVxuICByZXR1cm4gLyoqIEB0eXBlIHsoYm9vbGVhbnxudW1iZXJ8c3RyaW5nKX0gKi8gKHRoaXMuZGF0YSk7ICAvLyBCb3hlZCBwcmltaXRpdmUuXG59O1xuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyBkYXRhIG9iamVjdCBiYXNlZCBvbiBhIGNvbnN0cnVjdG9yJ3MgcHJvdG90eXBlLlxuICogQHBhcmFtIHtJbnRlcnByZXRlci5PYmplY3R9IGNvbnN0cnVjdG9yIFBhcmVudCBjb25zdHJ1Y3RvciBmdW5jdGlvbixcbiAqICAgICBvciBudWxsIGlmIHNjb3BlIG9iamVjdC5cbiAqIEByZXR1cm4geyFJbnRlcnByZXRlci5PYmplY3R9IE5ldyBkYXRhIG9iamVjdC5cbiAqL1xuSW50ZXJwcmV0ZXIucHJvdG90eXBlLmNyZWF0ZU9iamVjdCA9IGZ1bmN0aW9uKGNvbnN0cnVjdG9yKSB7XG4gIHJldHVybiB0aGlzLmNyZWF0ZU9iamVjdFByb3RvKGNvbnN0cnVjdG9yICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yLnByb3BlcnRpZXNbJ3Byb3RvdHlwZSddKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IGRhdGEgb2JqZWN0IGJhc2VkIG9uIGEgcHJvdG90eXBlLlxuICogQHBhcmFtIHtJbnRlcnByZXRlci5PYmplY3R9IHByb3RvIFByb3RvdHlwZSBvYmplY3QuXG4gKiBAcmV0dXJuIHshSW50ZXJwcmV0ZXIuT2JqZWN0fSBOZXcgZGF0YSBvYmplY3QuXG4gKi9cbkludGVycHJldGVyLnByb3RvdHlwZS5jcmVhdGVPYmplY3RQcm90byA9IGZ1bmN0aW9uKHByb3RvKSB7XG4gIGlmICh0eXBlb2YgcHJvdG8gIT09ICdvYmplY3QnKSB7XG4gICAgdGhyb3cgRXJyb3IoJ05vbiBvYmplY3QgcHJvdG90eXBlJyk7XG4gIH1cbiAgdmFyIG9iaiA9IG5ldyBJbnRlcnByZXRlci5PYmplY3QocHJvdG8pO1xuICAvLyBGdW5jdGlvbnMgaGF2ZSBwcm90b3R5cGUgb2JqZWN0cy5cbiAgaWYgKHRoaXMuaXNhKG9iaiwgdGhpcy5GVU5DVElPTikpIHtcbiAgICB0aGlzLnNldFByb3BlcnR5KG9iaiwgJ3Byb3RvdHlwZScsXG4gICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZU9iamVjdFByb3RvKHRoaXMuT0JKRUNUX1BST1RPIHx8IG51bGwpLFxuICAgICAgICAgICAgICAgICAgICAgSW50ZXJwcmV0ZXIuTk9ORU5VTUVSQUJMRV9ERVNDUklQVE9SKTtcbiAgICBvYmouY2xhc3MgPSAnRnVuY3Rpb24nO1xuICB9XG4gIC8vIEFycmF5cyBoYXZlIGxlbmd0aC5cbiAgaWYgKHRoaXMuaXNhKG9iaiwgdGhpcy5BUlJBWSkpIHtcbiAgICB0aGlzLnNldFByb3BlcnR5KG9iaiwgJ2xlbmd0aCcsIDAsXG4gICAgICAgIHtjb25maWd1cmFibGU6IGZhbHNlLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWV9KTtcbiAgICBvYmouY2xhc3MgPSAnQXJyYXknO1xuICB9XG4gIGlmICh0aGlzLmlzYShvYmosIHRoaXMuRVJST1IpKSB7XG4gICAgb2JqLmNsYXNzID0gJ0Vycm9yJztcbiAgfVxuICByZXR1cm4gb2JqO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgZnVuY3Rpb24uXG4gKiBAcGFyYW0geyFPYmplY3R9IG5vZGUgQVNUIG5vZGUgZGVmaW5pbmcgdGhlIGZ1bmN0aW9uLlxuICogQHBhcmFtIHshT2JqZWN0fSBzY29wZSBQYXJlbnQgc2NvcGUuXG4gKiBAcmV0dXJuIHshSW50ZXJwcmV0ZXIuT2JqZWN0fSBOZXcgZnVuY3Rpb24uXG4gKi9cbkludGVycHJldGVyLnByb3RvdHlwZS5jcmVhdGVGdW5jdGlvbiA9IGZ1bmN0aW9uKG5vZGUsIHNjb3BlKSB7XG4gIHZhciBmdW5jID0gdGhpcy5jcmVhdGVPYmplY3RQcm90byh0aGlzLkZVTkNUSU9OX1BST1RPKTtcbiAgZnVuYy5wYXJlbnRTY29wZSA9IHNjb3BlO1xuICBmdW5jLm5vZGUgPSBub2RlO1xuICB0aGlzLnNldFByb3BlcnR5KGZ1bmMsICdsZW5ndGgnLCBmdW5jLm5vZGVbJ3BhcmFtcyddLmxlbmd0aCxcbiAgICAgIEludGVycHJldGVyLlJFQURPTkxZX05PTkVOVU1FUkFCTEVfREVTQ1JJUFRPUik7XG4gIHJldHVybiBmdW5jO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgbmF0aXZlIGZ1bmN0aW9uLlxuICogQHBhcmFtIHshRnVuY3Rpb259IG5hdGl2ZUZ1bmMgSmF2YVNjcmlwdCBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7Ym9vbGVhbj19IG9wdF9jb25zdHJ1Y3RvciBJZiB0cnVlLCB0aGUgZnVuY3Rpb24nc1xuICogcHJvdG90eXBlIHdpbGwgaGF2ZSBpdHMgY29uc3RydWN0b3IgcHJvcGVydHkgc2V0IHRvIHRoZSBmdW5jdGlvbi5cbiAqIElmIGZhbHNlLCB0aGUgZnVuY3Rpb24gY2Fubm90IGJlIGNhbGxlZCBhcyBhIGNvbnN0cnVjdG9yIChlLmcuIGVzY2FwZSkuXG4gKiBEZWZhdWx0cyB0byB1bmRlZmluZWQuXG4gKiBAcmV0dXJuIHshSW50ZXJwcmV0ZXIuT2JqZWN0fSBOZXcgZnVuY3Rpb24uXG4gKi9cbkludGVycHJldGVyLnByb3RvdHlwZS5jcmVhdGVOYXRpdmVGdW5jdGlvbiA9XG4gICAgZnVuY3Rpb24obmF0aXZlRnVuYywgb3B0X2NvbnN0cnVjdG9yKSB7XG4gIHZhciBmdW5jID0gdGhpcy5jcmVhdGVPYmplY3RQcm90byh0aGlzLkZVTkNUSU9OX1BST1RPKTtcbiAgZnVuYy5uYXRpdmVGdW5jID0gbmF0aXZlRnVuYztcbiAgbmF0aXZlRnVuYy5pZCA9IHRoaXMuZnVuY3Rpb25Db3VudGVyXysrO1xuICB0aGlzLnNldFByb3BlcnR5KGZ1bmMsICdsZW5ndGgnLCBuYXRpdmVGdW5jLmxlbmd0aCxcbiAgICAgIEludGVycHJldGVyLlJFQURPTkxZX05PTkVOVU1FUkFCTEVfREVTQ1JJUFRPUik7XG4gIGlmIChvcHRfY29uc3RydWN0b3IpIHtcbiAgICB0aGlzLnNldFByb3BlcnR5KGZ1bmMucHJvcGVydGllc1sncHJvdG90eXBlJ10sICdjb25zdHJ1Y3RvcicsIGZ1bmMsXG4gICAgICAgICAgICAgICAgICAgICBJbnRlcnByZXRlci5OT05FTlVNRVJBQkxFX0RFU0NSSVBUT1IpO1xuICB9IGVsc2UgaWYgKG9wdF9jb25zdHJ1Y3RvciA9PT0gZmFsc2UpIHtcbiAgICBmdW5jLmlsbGVnYWxDb25zdHJ1Y3RvciA9IHRydWU7XG4gICAgdGhpcy5zZXRQcm9wZXJ0eShmdW5jLCAncHJvdG90eXBlJywgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgSW50ZXJwcmV0ZXIuTk9ORU5VTUVSQUJMRV9ERVNDUklQVE9SKTtcbiAgfVxuICByZXR1cm4gZnVuYztcbn07XG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IG5hdGl2ZSBhc3luY2hyb25vdXMgZnVuY3Rpb24uXG4gKiBAcGFyYW0geyFGdW5jdGlvbn0gYXN5bmNGdW5jIEphdmFTY3JpcHQgZnVuY3Rpb24uXG4gKiBAcmV0dXJuIHshSW50ZXJwcmV0ZXIuT2JqZWN0fSBOZXcgZnVuY3Rpb24uXG4gKi9cbkludGVycHJldGVyLnByb3RvdHlwZS5jcmVhdGVBc3luY0Z1bmN0aW9uID0gZnVuY3Rpb24oYXN5bmNGdW5jKSB7XG4gIHZhciBmdW5jID0gdGhpcy5jcmVhdGVPYmplY3RQcm90byh0aGlzLkZVTkNUSU9OX1BST1RPKTtcbiAgZnVuYy5hc3luY0Z1bmMgPSBhc3luY0Z1bmM7XG4gIGFzeW5jRnVuYy5pZCA9IHRoaXMuZnVuY3Rpb25Db3VudGVyXysrO1xuICB0aGlzLnNldFByb3BlcnR5KGZ1bmMsICdsZW5ndGgnLCBhc3luY0Z1bmMubGVuZ3RoLFxuICAgICAgSW50ZXJwcmV0ZXIuUkVBRE9OTFlfTk9ORU5VTUVSQUJMRV9ERVNDUklQVE9SKTtcbiAgcmV0dXJuIGZ1bmM7XG59O1xuXG4vKipcbiAqIENvbnZlcnRzIGZyb20gYSBuYXRpdmUgSlMgb2JqZWN0IG9yIHZhbHVlIHRvIGEgSlMgaW50ZXJwcmV0ZXIgb2JqZWN0LlxuICogQ2FuIGhhbmRsZSBKU09OLXN0eWxlIHZhbHVlcywgZG9lcyBOT1QgaGFuZGxlIGN5Y2xlcy5cbiAqIEBwYXJhbSB7Kn0gbmF0aXZlT2JqIFRoZSBuYXRpdmUgSlMgb2JqZWN0IHRvIGJlIGNvbnZlcnRlZC5cbiAqIEByZXR1cm4ge0ludGVycHJldGVyLlZhbHVlfSBUaGUgZXF1aXZhbGVudCBKUyBpbnRlcnByZXRlciBvYmplY3QuXG4gKi9cbkludGVycHJldGVyLnByb3RvdHlwZS5uYXRpdmVUb1BzZXVkbyA9IGZ1bmN0aW9uKG5hdGl2ZU9iaikge1xuICBpZiAoKHR5cGVvZiBuYXRpdmVPYmogIT09ICdvYmplY3QnICYmIHR5cGVvZiBuYXRpdmVPYmogIT09ICdmdW5jdGlvbicpIHx8XG4gICAgICBuYXRpdmVPYmogPT09IG51bGwpIHtcbiAgICByZXR1cm4gbmF0aXZlT2JqO1xuICB9XG5cbiAgaWYgKG5hdGl2ZU9iaiBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgIHZhciBwc2V1ZG9SZWdleHAgPSB0aGlzLmNyZWF0ZU9iamVjdFByb3RvKHRoaXMuUkVHRVhQX1BST1RPKTtcbiAgICB0aGlzLnBvcHVsYXRlUmVnRXhwKHBzZXVkb1JlZ2V4cCwgbmF0aXZlT2JqKTtcbiAgICByZXR1cm4gcHNldWRvUmVnZXhwO1xuICB9XG5cbiAgaWYgKG5hdGl2ZU9iaiBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICB2YXIgcHNldWRvRGF0ZSA9IHRoaXMuY3JlYXRlT2JqZWN0UHJvdG8odGhpcy5EQVRFX1BST1RPKTtcbiAgICBwc2V1ZG9EYXRlLmRhdGEgPSBuYXRpdmVPYmo7XG4gICAgcmV0dXJuIHBzZXVkb0RhdGU7XG4gIH1cblxuICBpZiAobmF0aXZlT2JqIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICB2YXIgaW50ZXJwcmV0ZXIgPSB0aGlzO1xuICAgIHZhciB3cmFwcGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gaW50ZXJwcmV0ZXIubmF0aXZlVG9Qc2V1ZG8oXG4gICAgICAgIG5hdGl2ZU9iai5hcHBseShpbnRlcnByZXRlcixcbiAgICAgICAgICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpXG4gICAgICAgICAgLm1hcChmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICByZXR1cm4gaW50ZXJwcmV0ZXIucHNldWRvVG9OYXRpdmUoaSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9O1xuICAgIHJldHVybiB0aGlzLmNyZWF0ZU5hdGl2ZUZ1bmN0aW9uKHdyYXBwZXIsIHVuZGVmaW5lZCk7XG4gIH1cblxuICB2YXIgcHNldWRvT2JqO1xuICBpZiAoQXJyYXkuaXNBcnJheShuYXRpdmVPYmopKSB7ICAvLyBBcnJheS5cbiAgICBwc2V1ZG9PYmogPSB0aGlzLmNyZWF0ZU9iamVjdFByb3RvKHRoaXMuQVJSQVlfUFJPVE8pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmF0aXZlT2JqLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoaSBpbiBuYXRpdmVPYmopIHtcbiAgICAgICAgdGhpcy5zZXRQcm9wZXJ0eShwc2V1ZG9PYmosIGksIHRoaXMubmF0aXZlVG9Qc2V1ZG8obmF0aXZlT2JqW2ldKSk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgeyAgLy8gT2JqZWN0LlxuICAgIHBzZXVkb09iaiA9IHRoaXMuY3JlYXRlT2JqZWN0UHJvdG8odGhpcy5PQkpFQ1RfUFJPVE8pO1xuICAgIGZvciAodmFyIGtleSBpbiBuYXRpdmVPYmopIHtcbiAgICAgIHRoaXMuc2V0UHJvcGVydHkocHNldWRvT2JqLCBrZXksIHRoaXMubmF0aXZlVG9Qc2V1ZG8obmF0aXZlT2JqW2tleV0pKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBzZXVkb09iajtcbn07XG5cbi8qKlxuICogQ29udmVydHMgZnJvbSBhIEpTIGludGVycHJldGVyIG9iamVjdCB0byBuYXRpdmUgSlMgb2JqZWN0LlxuICogQ2FuIGhhbmRsZSBKU09OLXN0eWxlIHZhbHVlcywgcGx1cyBjeWNsZXMuXG4gKiBAcGFyYW0ge0ludGVycHJldGVyLlZhbHVlfSBwc2V1ZG9PYmogVGhlIEpTIGludGVycHJldGVyIG9iamVjdCB0byBiZVxuICogY29udmVydGVkLlxuICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfY3ljbGVzIEN5Y2xlIGRldGVjdGlvbiAodXNlZCBpbiByZWN1cnNpdmUgY2FsbHMpLlxuICogQHJldHVybiB7Kn0gVGhlIGVxdWl2YWxlbnQgbmF0aXZlIEpTIG9iamVjdCBvciB2YWx1ZS5cbiAqL1xuSW50ZXJwcmV0ZXIucHJvdG90eXBlLnBzZXVkb1RvTmF0aXZlID0gZnVuY3Rpb24ocHNldWRvT2JqLCBvcHRfY3ljbGVzKSB7XG4gIGlmICgodHlwZW9mIHBzZXVkb09iaiAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIHBzZXVkb09iaiAhPT0gJ2Z1bmN0aW9uJykgfHxcbiAgICAgIHBzZXVkb09iaiA9PT0gbnVsbCkge1xuICAgIHJldHVybiBwc2V1ZG9PYmo7XG4gIH1cblxuICBpZiAodGhpcy5pc2EocHNldWRvT2JqLCB0aGlzLlJFR0VYUCkpIHsgIC8vIFJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAgICByZXR1cm4gcHNldWRvT2JqLmRhdGE7XG4gIH1cblxuICBpZiAodGhpcy5pc2EocHNldWRvT2JqLCB0aGlzLkRBVEUpKSB7ICAvLyBEYXRlLlxuICAgIHJldHVybiBwc2V1ZG9PYmouZGF0YTtcbiAgfVxuXG4gIHZhciBjeWNsZXMgPSBvcHRfY3ljbGVzIHx8IHtcbiAgICBwc2V1ZG86IFtdLFxuICAgIG5hdGl2ZTogW11cbiAgfTtcbiAgdmFyIGkgPSBjeWNsZXMucHNldWRvLmluZGV4T2YocHNldWRvT2JqKTtcbiAgaWYgKGkgIT09IC0xKSB7XG4gICAgcmV0dXJuIGN5Y2xlcy5uYXRpdmVbaV07XG4gIH1cbiAgY3ljbGVzLnBzZXVkby5wdXNoKHBzZXVkb09iaik7XG4gIHZhciBuYXRpdmVPYmo7XG4gIGlmICh0aGlzLmlzYShwc2V1ZG9PYmosIHRoaXMuQVJSQVkpKSB7ICAvLyBBcnJheS5cbiAgICBuYXRpdmVPYmogPSBbXTtcbiAgICBjeWNsZXMubmF0aXZlLnB1c2gobmF0aXZlT2JqKTtcbiAgICB2YXIgbGVuZ3RoID0gdGhpcy5nZXRQcm9wZXJ0eShwc2V1ZG9PYmosICdsZW5ndGgnKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5oYXNQcm9wZXJ0eShwc2V1ZG9PYmosIGkpKSB7XG4gICAgICAgIG5hdGl2ZU9ialtpXSA9XG4gICAgICAgICAgICB0aGlzLnBzZXVkb1RvTmF0aXZlKHRoaXMuZ2V0UHJvcGVydHkocHNldWRvT2JqLCBpKSwgY3ljbGVzKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7ICAvLyBPYmplY3QuXG4gICAgbmF0aXZlT2JqID0ge307XG4gICAgY3ljbGVzLm5hdGl2ZS5wdXNoKG5hdGl2ZU9iaik7XG4gICAgdmFyIHZhbDtcbiAgICBmb3IgKHZhciBrZXkgaW4gcHNldWRvT2JqLnByb3BlcnRpZXMpIHtcbiAgICAgIHZhbCA9IHBzZXVkb09iai5wcm9wZXJ0aWVzW2tleV07XG4gICAgICBuYXRpdmVPYmpba2V5XSA9IHRoaXMucHNldWRvVG9OYXRpdmUodmFsLCBjeWNsZXMpO1xuICAgIH1cbiAgfVxuICBjeWNsZXMucHNldWRvLnBvcCgpO1xuICBjeWNsZXMubmF0aXZlLnBvcCgpO1xuICByZXR1cm4gbmF0aXZlT2JqO1xufTtcblxuLyoqXG4gKiBDb252ZXJ0cyBmcm9tIGEgbmF0aXZlIEpTIGFycmF5IHRvIGEgSlMgaW50ZXJwcmV0ZXIgYXJyYXkuXG4gKiBEb2VzIGhhbmRsZSBub24tbnVtZXJpYyBwcm9wZXJ0aWVzIChsaWtlIHN0ci5tYXRjaCdzIGluZGV4IHByb3ApLlxuICogRG9lcyBOT1QgcmVjdXJzZSBpbnRvIHRoZSBhcnJheSdzIGNvbnRlbnRzLlxuICogQHBhcmFtIHshQXJyYXl9IG5hdGl2ZUFycmF5IFRoZSBKUyBhcnJheSB0byBiZSBjb252ZXJ0ZWQuXG4gKiBAcmV0dXJuIHshSW50ZXJwcmV0ZXIuT2JqZWN0fSBUaGUgZXF1aXZhbGVudCBKUyBpbnRlcnByZXRlciBhcnJheS5cbiAqL1xuSW50ZXJwcmV0ZXIucHJvdG90eXBlLmFycmF5TmF0aXZlVG9Qc2V1ZG8gPSBmdW5jdGlvbihuYXRpdmVBcnJheSkge1xuICB2YXIgcHNldWRvQXJyYXkgPSB0aGlzLmNyZWF0ZU9iamVjdFByb3RvKHRoaXMuQVJSQVlfUFJPVE8pO1xuICB2YXIgcHJvcHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhuYXRpdmVBcnJheSk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICB0aGlzLnNldFByb3BlcnR5KHBzZXVkb0FycmF5LCBwcm9wc1tpXSwgbmF0aXZlQXJyYXlbcHJvcHNbaV1dKTtcbiAgfVxuICByZXR1cm4gcHNldWRvQXJyYXk7XG59O1xuXG4vKipcbiAqIENvbnZlcnRzIGZyb20gYSBKUyBpbnRlcnByZXRlciBhcnJheSB0byBuYXRpdmUgSlMgYXJyYXkuXG4gKiBEb2VzIGhhbmRsZSBub24tbnVtZXJpYyBwcm9wZXJ0aWVzIChsaWtlIHN0ci5tYXRjaCdzIGluZGV4IHByb3ApLlxuICogRG9lcyBOT1QgcmVjdXJzZSBpbnRvIHRoZSBhcnJheSdzIGNvbnRlbnRzLlxuICogQHBhcmFtIHshSW50ZXJwcmV0ZXIuT2JqZWN0fSBwc2V1ZG9BcnJheSBUaGUgSlMgaW50ZXJwcmV0ZXIgYXJyYXksXG4gKiAgICAgb3IgSlMgaW50ZXJwcmV0ZXIgb2JqZWN0IHByZXRlbmRpbmcgdG8gYmUgYW4gYXJyYXkuXG4gKiBAcmV0dXJuIHshQXJyYXl9IFRoZSBlcXVpdmFsZW50IG5hdGl2ZSBKUyBhcnJheS5cbiAqL1xuSW50ZXJwcmV0ZXIucHJvdG90eXBlLmFycmF5UHNldWRvVG9OYXRpdmUgPSBmdW5jdGlvbihwc2V1ZG9BcnJheSkge1xuICB2YXIgbmF0aXZlQXJyYXkgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIHBzZXVkb0FycmF5LnByb3BlcnRpZXMpIHtcbiAgICBuYXRpdmVBcnJheVtrZXldID0gdGhpcy5nZXRQcm9wZXJ0eShwc2V1ZG9BcnJheSwga2V5KTtcbiAgfVxuICAvLyBwc2V1ZG9BcnJheSBtaWdodCBiZSBhbiBvYmplY3QgcHJldGVuZGluZyB0byBiZSBhbiBhcnJheS4gIEluIHRoaXMgY2FzZVxuICAvLyBpdCdzIHBvc3NpYmxlIHRoYXQgbGVuZ3RoIGlzIG5vbi1leGlzdGVudCwgaW52YWxpZCwgb3Igc21hbGxlciB0aGFuIHRoZVxuICAvLyBsYXJnZXN0IGRlZmluZWQgbnVtZXJpYyBwcm9wZXJ0eS4gIFNldCBsZW5ndGggZXhwbGljaXRseSBoZXJlLlxuICBuYXRpdmVBcnJheS5sZW5ndGggPSBJbnRlcnByZXRlci5sZWdhbEFycmF5TGVuZ3RoKFxuICAgICAgdGhpcy5nZXRQcm9wZXJ0eShwc2V1ZG9BcnJheSwgJ2xlbmd0aCcpKSB8fCAwO1xuICByZXR1cm4gbmF0aXZlQXJyYXk7XG59O1xuXG4vKipcbiAqIExvb2sgdXAgdGhlIHByb3RvdHlwZSBmb3IgdGhpcyB2YWx1ZS5cbiAqIEBwYXJhbSB7SW50ZXJwcmV0ZXIuVmFsdWV9IHZhbHVlIERhdGEgb2JqZWN0LlxuICogQHJldHVybiB7SW50ZXJwcmV0ZXIuT2JqZWN0fSBQcm90b3R5cGUgb2JqZWN0LCBudWxsIGlmIG5vbmUuXG4gKi9cbkludGVycHJldGVyLnByb3RvdHlwZS5nZXRQcm90b3R5cGUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xuICAgIGNhc2UgJ251bWJlcic6XG4gICAgICByZXR1cm4gdGhpcy5OVU1CRVIucHJvcGVydGllc1sncHJvdG90eXBlJ107XG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gdGhpcy5CT09MRUFOLnByb3BlcnRpZXNbJ3Byb3RvdHlwZSddO1xuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gdGhpcy5TVFJJTkcucHJvcGVydGllc1sncHJvdG90eXBlJ107XG4gIH1cbiAgaWYgKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlLnByb3RvO1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuLyoqXG4gKiBGZXRjaCBhIHByb3BlcnR5IHZhbHVlIGZyb20gYSBkYXRhIG9iamVjdC5cbiAqIEBwYXJhbSB7SW50ZXJwcmV0ZXIuVmFsdWV9IG9iaiBEYXRhIG9iamVjdC5cbiAqIEBwYXJhbSB7SW50ZXJwcmV0ZXIuVmFsdWV9IG5hbWUgTmFtZSBvZiBwcm9wZXJ0eS5cbiAqIEByZXR1cm4ge0ludGVycHJldGVyLlZhbHVlfSBQcm9wZXJ0eSB2YWx1ZSAobWF5IGJlIHVuZGVmaW5lZCkuXG4gKi9cbkludGVycHJldGVyLnByb3RvdHlwZS5nZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uKG9iaiwgbmFtZSkge1xuICBuYW1lID0gU3RyaW5nKG5hbWUpO1xuICBpZiAob2JqID09PSB1bmRlZmluZWQgfHwgb2JqID09PSBudWxsKSB7XG4gICAgdGhpcy50aHJvd0V4Y2VwdGlvbih0aGlzLlRZUEVfRVJST1IsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNhbm5vdCByZWFkIHByb3BlcnR5ICdcIiArIG5hbWUgKyBcIicgb2YgXCIgKyBvYmopO1xuICB9XG4gIGlmIChuYW1lID09PSAnbGVuZ3RoJykge1xuICAgIC8vIFNwZWNpYWwgY2FzZXMgZm9yIG1hZ2ljIGxlbmd0aCBwcm9wZXJ0eS5cbiAgICBpZiAodGhpcy5pc2Eob2JqLCB0aGlzLlNUUklORykpIHtcbiAgICAgIHJldHVybiBTdHJpbmcob2JqKS5sZW5ndGg7XG4gICAgfVxuICB9IGVsc2UgaWYgKG5hbWUuY2hhckNvZGVBdCgwKSA8IDB4NDApIHtcbiAgICAvLyBNaWdodCBoYXZlIG51bWJlcnMgaW4gdGhlcmU/XG4gICAgLy8gU3BlY2lhbCBjYXNlcyBmb3Igc3RyaW5nIGFycmF5IGluZGV4aW5nXG4gICAgaWYgKHRoaXMuaXNhKG9iaiwgdGhpcy5TVFJJTkcpKSB7XG4gICAgICB2YXIgbiA9IEludGVycHJldGVyLmxlZ2FsQXJyYXlJbmRleChuYW1lKTtcbiAgICAgIGlmICghaXNOYU4obikgJiYgbiA8IFN0cmluZyhvYmopLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gU3RyaW5nKG9iailbbl07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGRvIHtcbiAgICBpZiAob2JqLnByb3BlcnRpZXMgJiYgbmFtZSBpbiBvYmoucHJvcGVydGllcykge1xuICAgICAgdmFyIGdldHRlciA9IG9iai5nZXR0ZXJbbmFtZV07XG4gICAgICBpZiAoZ2V0dGVyKSB7XG4gICAgICAgIC8vIEZsYWcgdGhpcyBmdW5jdGlvbiBhcyBiZWluZyBhIGdldHRlciBhbmQgdGh1cyBuZWVkaW5nIGltbWVkaWF0ZVxuICAgICAgICAvLyBleGVjdXRpb24gKHJhdGhlciB0aGFuIGJlaW5nIHRoZSB2YWx1ZSBvZiB0aGUgcHJvcGVydHkpLlxuICAgICAgICBnZXR0ZXIuaXNHZXR0ZXIgPSB0cnVlO1xuICAgICAgICByZXR1cm4gZ2V0dGVyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9iai5wcm9wZXJ0aWVzW25hbWVdO1xuICAgIH1cbiAgfSB3aGlsZSAoKG9iaiA9IHRoaXMuZ2V0UHJvdG90eXBlKG9iaikpKTtcbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn07XG5cbi8qKlxuICogRG9lcyB0aGUgbmFtZWQgcHJvcGVydHkgZXhpc3Qgb24gYSBkYXRhIG9iamVjdC5cbiAqIEBwYXJhbSB7SW50ZXJwcmV0ZXIuVmFsdWV9IG9iaiBEYXRhIG9iamVjdC5cbiAqIEBwYXJhbSB7SW50ZXJwcmV0ZXIuVmFsdWV9IG5hbWUgTmFtZSBvZiBwcm9wZXJ0eS5cbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgcHJvcGVydHkgZXhpc3RzLlxuICovXG5JbnRlcnByZXRlci5wcm90b3R5cGUuaGFzUHJvcGVydHkgPSBmdW5jdGlvbihvYmosIG5hbWUpIHtcbiAgaWYgKCFvYmouaXNPYmplY3QpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ1ByaW1pdGl2ZSBkYXRhIHR5cGUgaGFzIG5vIHByb3BlcnRpZXMnKTtcbiAgfVxuICBuYW1lID0gU3RyaW5nKG5hbWUpO1xuICBpZiAobmFtZSA9PT0gJ2xlbmd0aCcgJiYgdGhpcy5pc2Eob2JqLCB0aGlzLlNUUklORykpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAodGhpcy5pc2Eob2JqLCB0aGlzLlNUUklORykpIHtcbiAgICB2YXIgbiA9IEludGVycHJldGVyLmxlZ2FsQXJyYXlJbmRleChuYW1lKTtcbiAgICBpZiAoIWlzTmFOKG4pICYmIG4gPCBTdHJpbmcob2JqKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICBkbyB7XG4gICAgaWYgKG9iai5wcm9wZXJ0aWVzICYmIG5hbWUgaW4gb2JqLnByb3BlcnRpZXMpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSB3aGlsZSAoKG9iaiA9IHRoaXMuZ2V0UHJvdG90eXBlKG9iaikpKTtcbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBTZXQgYSBwcm9wZXJ0eSB2YWx1ZSBvbiBhIGRhdGEgb2JqZWN0LlxuICogQHBhcmFtIHshSW50ZXJwcmV0ZXIuT2JqZWN0fSBvYmogRGF0YSBvYmplY3QuXG4gKiBAcGFyYW0ge0ludGVycHJldGVyLlZhbHVlfSBuYW1lIE5hbWUgb2YgcHJvcGVydHkuXG4gKiBAcGFyYW0ge0ludGVycHJldGVyLlZhbHVlfSB2YWx1ZSBOZXcgcHJvcGVydHkgdmFsdWUuXG4gKiAgICAgVXNlIEludGVycHJldGVyLlZBTFVFX0lOX0RFU0NSSVBUT1IgaWYgdmFsdWUgaXMgaGFuZGxlZCBieVxuICogICAgIGRlc2NyaXB0b3IgaW5zdGVhZC5cbiAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X2Rlc2NyaXB0b3IgT3B0aW9uYWwgZGVzY3JpcHRvciBvYmplY3QuXG4gKiBAcmV0dXJuIHshSW50ZXJwcmV0ZXIuT2JqZWN0fHVuZGVmaW5lZH0gUmV0dXJucyBhIHNldHRlciBmdW5jdGlvbiBpZiBvbmVcbiAqICAgICBuZWVkcyB0byBiZSBjYWxsZWQsIG90aGVyd2lzZSB1bmRlZmluZWQuXG4gKi9cbkludGVycHJldGVyLnByb3RvdHlwZS5zZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uKG9iaiwgbmFtZSwgdmFsdWUsIG9wdF9kZXNjcmlwdG9yKSB7XG4gIG5hbWUgPSBTdHJpbmcobmFtZSk7XG4gIGlmIChvYmogPT09IHVuZGVmaW5lZCB8fCBvYmogPT09IG51bGwpIHtcbiAgICB0aGlzLnRocm93RXhjZXB0aW9uKHRoaXMuVFlQRV9FUlJPUixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ2Fubm90IHNldCBwcm9wZXJ0eSAnXCIgKyBuYW1lICsgXCInIG9mIFwiICsgb2JqKTtcbiAgfVxuICBpZiAob3B0X2Rlc2NyaXB0b3IgJiYgKCdnZXQnIGluIG9wdF9kZXNjcmlwdG9yIHx8ICdzZXQnIGluIG9wdF9kZXNjcmlwdG9yKSAmJlxuICAgICAgKCd2YWx1ZScgaW4gb3B0X2Rlc2NyaXB0b3IgfHwgJ3dyaXRhYmxlJyBpbiBvcHRfZGVzY3JpcHRvcikpIHtcbiAgICB0aGlzLnRocm93RXhjZXB0aW9uKHRoaXMuVFlQRV9FUlJPUiwgJ0ludmFsaWQgcHJvcGVydHkgZGVzY3JpcHRvci4gJyArXG4gICAgICAgICdDYW5ub3QgYm90aCBzcGVjaWZ5IGFjY2Vzc29ycyBhbmQgYSB2YWx1ZSBvciB3cml0YWJsZSBhdHRyaWJ1dGUnKTtcbiAgfVxuICB2YXIgc3RyaWN0ID0gIXRoaXMuc3RhdGVTdGFjayB8fCB0aGlzLmdldFNjb3BlKCkuc3RyaWN0O1xuICBpZiAoIW9iai5pc09iamVjdCkge1xuICAgIGlmIChzdHJpY3QpIHtcbiAgICAgIHRoaXMudGhyb3dFeGNlcHRpb24odGhpcy5UWVBFX0VSUk9SLCBcIkNhbid0IGNyZWF0ZSBwcm9wZXJ0eSAnXCIgKyBuYW1lICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCInIG9uICdcIiArIG9iaiArIFwiJ1wiKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICh0aGlzLmlzYShvYmosIHRoaXMuU1RSSU5HKSkge1xuICAgIHZhciBuID0gSW50ZXJwcmV0ZXIubGVnYWxBcnJheUluZGV4KG5hbWUpO1xuICAgIGlmIChuYW1lID09PSAnbGVuZ3RoJyB8fCAoIWlzTmFOKG4pICYmIG4gPCBTdHJpbmcob2JqKS5sZW5ndGgpKSB7XG4gICAgICAvLyBDYW4ndCBzZXQgbGVuZ3RoIG9yIGxldHRlcnMgb24gU3RyaW5nIG9iamVjdHMuXG4gICAgICBpZiAoc3RyaWN0KSB7XG4gICAgICAgIHRoaXMudGhyb3dFeGNlcHRpb24odGhpcy5UWVBFX0VSUk9SLCBcIkNhbm5vdCBhc3NpZ24gdG8gcmVhZCBvbmx5IFwiICtcbiAgICAgICAgICAgIFwicHJvcGVydHkgJ1wiICsgbmFtZSArIFwiJyBvZiBTdHJpbmcgJ1wiICsgb2JqLmRhdGEgKyBcIidcIik7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIGlmIChvYmouY2xhc3MgPT09ICdBcnJheScpIHtcbiAgICAvLyBBcnJheXMgaGF2ZSBhIG1hZ2ljIGxlbmd0aCB2YXJpYWJsZSB0aGF0IGlzIGJvdW5kIHRvIHRoZSBlbGVtZW50cy5cbiAgICB2YXIgbGVuZ3RoID0gb2JqLnByb3BlcnRpZXMubGVuZ3RoO1xuICAgIHZhciBpO1xuICAgIGlmIChuYW1lID09PSAnbGVuZ3RoJykge1xuICAgICAgLy8gRGVsZXRlIGVsZW1lbnRzIGlmIGxlbmd0aCBpcyBzbWFsbGVyLlxuICAgICAgaWYgKG9wdF9kZXNjcmlwdG9yKSB7XG4gICAgICAgIGlmICghKCd2YWx1ZScgaW4gb3B0X2Rlc2NyaXB0b3IpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhbHVlID0gb3B0X2Rlc2NyaXB0b3IudmFsdWU7XG4gICAgICB9XG4gICAgICB2YWx1ZSA9IEludGVycHJldGVyLmxlZ2FsQXJyYXlMZW5ndGgodmFsdWUpO1xuICAgICAgaWYgKGlzTmFOKHZhbHVlKSkge1xuICAgICAgICB0aGlzLnRocm93RXhjZXB0aW9uKHRoaXMuUkFOR0VfRVJST1IsICdJbnZhbGlkIGFycmF5IGxlbmd0aCcpO1xuICAgICAgfVxuICAgICAgaWYgKHZhbHVlIDwgbGVuZ3RoKSB7XG4gICAgICAgIGZvciAoaSBpbiBvYmoucHJvcGVydGllcykge1xuICAgICAgICAgIGkgPSBJbnRlcnByZXRlci5sZWdhbEFycmF5SW5kZXgoaSk7XG4gICAgICAgICAgaWYgKCFpc05hTihpKSAmJiB2YWx1ZSA8PSBpKSB7XG4gICAgICAgICAgICBkZWxldGUgb2JqLnByb3BlcnRpZXNbaV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghaXNOYU4oaSA9IEludGVycHJldGVyLmxlZ2FsQXJyYXlJbmRleChuYW1lKSkpIHtcbiAgICAgIC8vIEluY3JlYXNlIGxlbmd0aCBpZiB0aGlzIGluZGV4IGlzIGxhcmdlci5cbiAgICAgIG9iai5wcm9wZXJ0aWVzLmxlbmd0aCA9IE1hdGgubWF4KGxlbmd0aCwgaSArIDEpO1xuICAgIH1cbiAgfVxuICBpZiAob2JqLnByZXZlbnRFeHRlbnNpb25zICYmICEobmFtZSBpbiBvYmoucHJvcGVydGllcykpIHtcbiAgICBpZiAoc3RyaWN0KSB7XG4gICAgICB0aGlzLnRocm93RXhjZXB0aW9uKHRoaXMuVFlQRV9FUlJPUiwgXCJDYW4ndCBhZGQgcHJvcGVydHkgJ1wiICsgbmFtZSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiJywgb2JqZWN0IGlzIG5vdCBleHRlbnNpYmxlXCIpO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKG9wdF9kZXNjcmlwdG9yKSB7XG4gICAgLy8gRGVmaW5lIHRoZSBwcm9wZXJ0eS5cbiAgICBpZiAoJ2dldCcgaW4gb3B0X2Rlc2NyaXB0b3IpIHtcbiAgICAgIGlmIChvcHRfZGVzY3JpcHRvci5nZXQpIHtcbiAgICAgICAgb2JqLmdldHRlcltuYW1lXSA9IG9wdF9kZXNjcmlwdG9yLmdldDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlbGV0ZSBvYmouZ2V0dGVyW25hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoJ3NldCcgaW4gb3B0X2Rlc2NyaXB0b3IpIHtcbiAgICAgIGlmIChvcHRfZGVzY3JpcHRvci5zZXQpIHtcbiAgICAgICAgb2JqLnNldHRlcltuYW1lXSA9IG9wdF9kZXNjcmlwdG9yLnNldDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlbGV0ZSBvYmouc2V0dGVyW25hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgICB2YXIgZGVzY3JpcHRvciA9IHt9O1xuICAgIGlmICgnY29uZmlndXJhYmxlJyBpbiBvcHRfZGVzY3JpcHRvcikge1xuICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSBvcHRfZGVzY3JpcHRvci5jb25maWd1cmFibGU7XG4gICAgfVxuICAgIGlmICgnZW51bWVyYWJsZScgaW4gb3B0X2Rlc2NyaXB0b3IpIHtcbiAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IG9wdF9kZXNjcmlwdG9yLmVudW1lcmFibGU7XG4gICAgfVxuICAgIGlmICgnd3JpdGFibGUnIGluIG9wdF9kZXNjcmlwdG9yKSB7XG4gICAgICBkZXNjcmlwdG9yLndyaXRhYmxlID0gb3B0X2Rlc2NyaXB0b3Iud3JpdGFibGU7XG4gICAgICBkZWxldGUgb2JqLmdldHRlcltuYW1lXTtcbiAgICAgIGRlbGV0ZSBvYmouc2V0dGVyW25hbWVdO1xuICAgIH1cbiAgICBpZiAoJ3ZhbHVlJyBpbiBvcHRfZGVzY3JpcHRvcikge1xuICAgICAgZGVzY3JpcHRvci52YWx1ZSA9IG9wdF9kZXNjcmlwdG9yLnZhbHVlO1xuICAgICAgZGVsZXRlIG9iai5nZXR0ZXJbbmFtZV07XG4gICAgICBkZWxldGUgb2JqLnNldHRlcltuYW1lXTtcbiAgICB9IGVsc2UgaWYgKHZhbHVlICE9PSBJbnRlcnByZXRlci5WQUxVRV9JTl9ERVNDUklQVE9SKSB7XG4gICAgICBkZXNjcmlwdG9yLnZhbHVlID0gdmFsdWU7XG4gICAgICBkZWxldGUgb2JqLmdldHRlcltuYW1lXTtcbiAgICAgIGRlbGV0ZSBvYmouc2V0dGVyW25hbWVdO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iai5wcm9wZXJ0aWVzLCBuYW1lLCBkZXNjcmlwdG9yKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLnRocm93RXhjZXB0aW9uKHRoaXMuVFlQRV9FUlJPUiwgJ0Nhbm5vdCByZWRlZmluZSBwcm9wZXJ0eTogJyArIG5hbWUpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBTZXQgdGhlIHByb3BlcnR5LlxuICAgIGlmICh2YWx1ZSA9PT0gSW50ZXJwcmV0ZXIuVkFMVUVfSU5fREVTQ1JJUFRPUikge1xuICAgICAgdGhyb3cgUmVmZXJlbmNlRXJyb3IoJ1ZhbHVlIG5vdCBzcGVjaWZpZWQuJyk7XG4gICAgfVxuICAgIC8vIERldGVybWluZSB0aGUgcGFyZW50IChwb3NzaWJseSBzZWxmKSB3aGVyZSB0aGUgcHJvcGVydHkgaXMgZGVmaW5lZC5cbiAgICB2YXIgZGVmT2JqID0gb2JqO1xuICAgIHdoaWxlICghKG5hbWUgaW4gZGVmT2JqLnByb3BlcnRpZXMpKSB7XG4gICAgICBkZWZPYmogPSB0aGlzLmdldFByb3RvdHlwZShkZWZPYmopO1xuICAgICAgaWYgKCFkZWZPYmopIHtcbiAgICAgICAgLy8gVGhpcyBpcyBhIG5ldyBwcm9wZXJ0eS5cbiAgICAgICAgZGVmT2JqID0gb2JqO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGRlZk9iai5zZXR0ZXIgJiYgZGVmT2JqLnNldHRlcltuYW1lXSkge1xuICAgICAgcmV0dXJuIGRlZk9iai5zZXR0ZXJbbmFtZV07XG4gICAgfVxuICAgIGlmIChkZWZPYmouZ2V0dGVyICYmIGRlZk9iai5nZXR0ZXJbbmFtZV0pIHtcbiAgICAgIGlmIChzdHJpY3QpIHtcbiAgICAgICAgdGhpcy50aHJvd0V4Y2VwdGlvbih0aGlzLlRZUEVfRVJST1IsIFwiQ2Fubm90IHNldCBwcm9wZXJ0eSAnXCIgKyBuYW1lICtcbiAgICAgICAgICAgIFwiJyBvZiBvYmplY3QgJ1wiICsgb2JqICsgXCInIHdoaWNoIG9ubHkgaGFzIGEgZ2V0dGVyXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBObyBzZXR0ZXIsIHNpbXBsZSBhc3NpZ25tZW50LlxuICAgICAgdHJ5IHtcbiAgICAgICAgb2JqLnByb3BlcnRpZXNbbmFtZV0gPSB2YWx1ZTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKHN0cmljdCkge1xuICAgICAgICAgIHRoaXMudGhyb3dFeGNlcHRpb24odGhpcy5UWVBFX0VSUk9SLCBcIkNhbm5vdCBhc3NpZ24gdG8gcmVhZCBvbmx5IFwiICtcbiAgICAgICAgICAgICAgXCJwcm9wZXJ0eSAnXCIgKyBuYW1lICsgXCInIG9mIG9iamVjdCAnXCIgKyBvYmogKyBcIidcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogQ29udmVuaWVuY2UgbWV0aG9kIGZvciBhZGRpbmcgYSBuYXRpdmUgZnVuY3Rpb24gYXMgYSBub24tZW51bWVyYWJsZSBwcm9wZXJ0eVxuICogb250byBhbiBvYmplY3QncyBwcm90b3R5cGUuXG4gKiBAcGFyYW0geyFJbnRlcnByZXRlci5PYmplY3R9IG9iaiBEYXRhIG9iamVjdC5cbiAqIEBwYXJhbSB7SW50ZXJwcmV0ZXIuVmFsdWV9IG5hbWUgTmFtZSBvZiBwcm9wZXJ0eS5cbiAqIEBwYXJhbSB7IUZ1bmN0aW9ufSB3cmFwcGVyIEZ1bmN0aW9uIG9iamVjdC5cbiAqL1xuSW50ZXJwcmV0ZXIucHJvdG90eXBlLnNldE5hdGl2ZUZ1bmN0aW9uUHJvdG90eXBlID1cbiAgICBmdW5jdGlvbihvYmosIG5hbWUsIHdyYXBwZXIpIHtcbiAgdGhpcy5zZXRQcm9wZXJ0eShvYmoucHJvcGVydGllc1sncHJvdG90eXBlJ10sIG5hbWUsXG4gICAgICB0aGlzLmNyZWF0ZU5hdGl2ZUZ1bmN0aW9uKHdyYXBwZXIsIGZhbHNlKSxcbiAgICAgIEludGVycHJldGVyLk5PTkVOVU1FUkFCTEVfREVTQ1JJUFRPUik7XG59O1xuXG4vKipcbiAqIENvbnZlbmllbmNlIG1ldGhvZCBmb3IgYWRkaW5nIGFuIGFzeW5jIGZ1bmN0aW9uIGFzIGEgbm9uLWVudW1lcmFibGUgcHJvcGVydHlcbiAqIG9udG8gYW4gb2JqZWN0J3MgcHJvdG90eXBlLlxuICogQHBhcmFtIHshSW50ZXJwcmV0ZXIuT2JqZWN0fSBvYmogRGF0YSBvYmplY3QuXG4gKiBAcGFyYW0ge0ludGVycHJldGVyLlZhbHVlfSBuYW1lIE5hbWUgb2YgcHJvcGVydHkuXG4gKiBAcGFyYW0geyFGdW5jdGlvbn0gd3JhcHBlciBGdW5jdGlvbiBvYmplY3QuXG4gKi9cbkludGVycHJldGVyLnByb3RvdHlwZS5zZXRBc3luY0Z1bmN0aW9uUHJvdG90eXBlID1cbiAgICBmdW5jdGlvbihvYmosIG5hbWUsIHdyYXBwZXIpIHtcbiAgdGhpcy5zZXRQcm9wZXJ0eShvYmoucHJvcGVydGllc1sncHJvdG90eXBlJ10sIG5hbWUsXG4gICAgICB0aGlzLmNyZWF0ZUFzeW5jRnVuY3Rpb24od3JhcHBlciksXG4gICAgICBJbnRlcnByZXRlci5OT05FTlVNRVJBQkxFX0RFU0NSSVBUT1IpO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBjdXJyZW50IHNjb3BlIGZyb20gdGhlIHN0YXRlU3RhY2suXG4gKiBAcmV0dXJuIHshSW50ZXJwcmV0ZXIuT2JqZWN0fSBDdXJyZW50IHNjb3BlIGRpY3Rpb25hcnkuXG4gKi9cbkludGVycHJldGVyLnByb3RvdHlwZS5nZXRTY29wZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2NvcGUgPSB0aGlzLnN0YXRlU3RhY2tbdGhpcy5zdGF0ZVN0YWNrLmxlbmd0aCAtIDFdLnNjb3BlO1xuICBpZiAoIXNjb3BlKSB7XG4gICAgdGhyb3cgRXJyb3IoJ05vIHNjb3BlIGZvdW5kLicpO1xuICB9XG4gIHJldHVybiBzY29wZTtcbn07XG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IHNjb3BlIGRpY3Rpb25hcnkuXG4gKiBAcGFyYW0geyFPYmplY3R9IG5vZGUgQVNUIG5vZGUgZGVmaW5pbmcgdGhlIHNjb3BlIGNvbnRhaW5lclxuICogICAgIChlLmcuIGEgZnVuY3Rpb24pLlxuICogQHBhcmFtIHtJbnRlcnByZXRlci5PYmplY3R9IHBhcmVudFNjb3BlIFNjb3BlIHRvIGxpbmsgdG8uXG4gKiBAcmV0dXJuIHshSW50ZXJwcmV0ZXIuT2JqZWN0fSBOZXcgc2NvcGUuXG4gKi9cbkludGVycHJldGVyLnByb3RvdHlwZS5jcmVhdGVTY29wZSA9IGZ1bmN0aW9uKG5vZGUsIHBhcmVudFNjb3BlKSB7XG4gIHZhciBzY29wZSA9IHRoaXMuY3JlYXRlT2JqZWN0UHJvdG8obnVsbCk7XG4gIHNjb3BlLnBhcmVudFNjb3BlID0gcGFyZW50U2NvcGU7XG4gIGlmICghcGFyZW50U2NvcGUpIHtcbiAgICB0aGlzLmluaXRHbG9iYWxTY29wZShzY29wZSk7XG4gIH1cbiAgdGhpcy5wb3B1bGF0ZVNjb3BlXyhub2RlLCBzY29wZSk7XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIHRoaXMgc2NvcGUgc3RhcnRzIHdpdGggJ3VzZSBzdHJpY3QnLlxuICBzY29wZS5zdHJpY3QgPSBmYWxzZTtcbiAgaWYgKHBhcmVudFNjb3BlICYmIHBhcmVudFNjb3BlLnN0cmljdCkge1xuICAgIHNjb3BlLnN0cmljdCA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGZpcnN0Tm9kZSA9IG5vZGVbJ2JvZHknXSAmJiBub2RlWydib2R5J11bMF07XG4gICAgaWYgKGZpcnN0Tm9kZSAmJiBmaXJzdE5vZGUuZXhwcmVzc2lvbiAmJlxuICAgICAgICBmaXJzdE5vZGUuZXhwcmVzc2lvblsndHlwZSddID09PSAnTGl0ZXJhbCcgJiZcbiAgICAgICAgZmlyc3ROb2RlLmV4cHJlc3Npb24udmFsdWUgPT09ICd1c2Ugc3RyaWN0Jykge1xuICAgICAgc2NvcGUuc3RyaWN0ID0gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHNjb3BlO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgc3BlY2lhbCBzY29wZSBkaWN0aW9uYXJ5LiBTaW1pbGFyIHRvIGNyZWF0ZVNjb3BlKCksIGJ1dFxuICogZG9lc24ndCBhc3N1bWUgdGhhdCB0aGUgc2NvcGUgaXMgZm9yIGEgZnVuY3Rpb24gYm9keS5cbiAqIFRoaXMgaXMgdXNlZCBmb3IgJ2NhdGNoJyBjbGF1c2VzIGFuZCAnd2l0aCcgc3RhdGVtZW50cy5cbiAqIEBwYXJhbSB7IUludGVycHJldGVyLk9iamVjdH0gcGFyZW50U2NvcGUgU2NvcGUgdG8gbGluayB0by5cbiAqIEBwYXJhbSB7SW50ZXJwcmV0ZXIuT2JqZWN0PX0gb3B0X3Njb3BlIE9wdGlvbmFsIG9iamVjdCB0byB0cmFuc2Zvcm0gaW50b1xuICogICAgIHNjb3BlLlxuICogQHJldHVybiB7IUludGVycHJldGVyLk9iamVjdH0gTmV3IHNjb3BlLlxuICovXG5JbnRlcnByZXRlci5wcm90b3R5cGUuY3JlYXRlU3BlY2lhbFNjb3BlID0gZnVuY3Rpb24ocGFyZW50U2NvcGUsIG9wdF9zY29wZSkge1xuICBpZiAoIXBhcmVudFNjb3BlKSB7XG4gICAgdGhyb3cgRXJyb3IoJ3BhcmVudFNjb3BlIHJlcXVpcmVkJyk7XG4gIH1cbiAgdmFyIHNjb3BlID0gb3B0X3Njb3BlIHx8IHRoaXMuY3JlYXRlT2JqZWN0UHJvdG8obnVsbCk7XG4gIHNjb3BlLnBhcmVudFNjb3BlID0gcGFyZW50U2NvcGU7XG4gIHNjb3BlLnN0cmljdCA9IHBhcmVudFNjb3BlLnN0cmljdDtcbiAgcmV0dXJuIHNjb3BlO1xufTtcblxuLyoqXG4gKiBSZXRyaWV2ZXMgYSB2YWx1ZSBmcm9tIHRoZSBzY29wZSBjaGFpbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIE5hbWUgb2YgdmFyaWFibGUuXG4gKiBAcmV0dXJuIHtJbnRlcnByZXRlci5WYWx1ZX0gQW55IHZhbHVlLlxuICogICBNYXkgYmUgZmxhZ2dlZCBhcyBiZWluZyBhIGdldHRlciBhbmQgdGh1cyBuZWVkaW5nIGltbWVkaWF0ZSBleGVjdXRpb25cbiAqICAgKHJhdGhlciB0aGFuIGJlaW5nIHRoZSB2YWx1ZSBvZiB0aGUgcHJvcGVydHkpLlxuICovXG5JbnRlcnByZXRlci5wcm90b3R5cGUuZ2V0VmFsdWVGcm9tU2NvcGUgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBzY29wZSA9IHRoaXMuZ2V0U2NvcGUoKTtcbiAgd2hpbGUgKHNjb3BlICYmIHNjb3BlICE9PSB0aGlzLmdsb2JhbCkge1xuICAgIGlmIChuYW1lIGluIHNjb3BlLnByb3BlcnRpZXMpIHtcbiAgICAgIHJldHVybiBzY29wZS5wcm9wZXJ0aWVzW25hbWVdO1xuICAgIH1cbiAgICBzY29wZSA9IHNjb3BlLnBhcmVudFNjb3BlO1xuICB9XG4gIC8vIFRoZSByb290IHNjb3BlIGlzIGFsc28gYW4gb2JqZWN0IHdoaWNoIGhhcyBpbmhlcml0ZWQgcHJvcGVydGllcyBhbmRcbiAgLy8gY291bGQgYWxzbyBoYXZlIGdldHRlcnMuXG4gIGlmIChzY29wZSA9PT0gdGhpcy5nbG9iYWwgJiYgdGhpcy5oYXNQcm9wZXJ0eShzY29wZSwgbmFtZSkpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQcm9wZXJ0eShzY29wZSwgbmFtZSk7XG4gIH1cbiAgLy8gVHlwZW9mIG9wZXJhdG9yIGlzIHVuaXF1ZTogaXQgY2FuIHNhZmVseSBsb29rIGF0IG5vbi1kZWZpbmVkIHZhcmlhYmxlcy5cbiAgdmFyIHByZXZOb2RlID0gdGhpcy5zdGF0ZVN0YWNrW3RoaXMuc3RhdGVTdGFjay5sZW5ndGggLSAxXS5ub2RlO1xuICBpZiAocHJldk5vZGVbJ3R5cGUnXSA9PT0gJ1VuYXJ5RXhwcmVzc2lvbicgJiZcbiAgICAgIHByZXZOb2RlWydvcGVyYXRvciddID09PSAndHlwZW9mJykge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgdGhpcy50aHJvd0V4Y2VwdGlvbih0aGlzLlJFRkVSRU5DRV9FUlJPUiwgbmFtZSArICcgaXMgbm90IGRlZmluZWQnKTtcbn07XG5cbi8qKlxuICogU2V0cyBhIHZhbHVlIHRvIHRoZSBjdXJyZW50IHNjb3BlLlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgTmFtZSBvZiB2YXJpYWJsZS5cbiAqIEBwYXJhbSB7SW50ZXJwcmV0ZXIuVmFsdWV9IHZhbHVlIFZhbHVlLlxuICogQHJldHVybiB7IUludGVycHJldGVyLk9iamVjdHx1bmRlZmluZWR9IFJldHVybnMgYSBzZXR0ZXIgZnVuY3Rpb24gaWYgb25lXG4gKiAgICAgbmVlZHMgdG8gYmUgY2FsbGVkLCBvdGhlcndpc2UgdW5kZWZpbmVkLlxuICovXG5JbnRlcnByZXRlci5wcm90b3R5cGUuc2V0VmFsdWVUb1Njb3BlID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgdmFyIHNjb3BlID0gdGhpcy5nZXRTY29wZSgpO1xuICB2YXIgc3RyaWN0ID0gc2NvcGUuc3RyaWN0O1xuICB3aGlsZSAoc2NvcGUgJiYgc2NvcGUgIT09IHRoaXMuZ2xvYmFsKSB7XG4gICAgaWYgKG5hbWUgaW4gc2NvcGUucHJvcGVydGllcykge1xuICAgICAgc2NvcGUucHJvcGVydGllc1tuYW1lXSA9IHZhbHVlO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgc2NvcGUgPSBzY29wZS5wYXJlbnRTY29wZTtcbiAgfVxuICAvLyBUaGUgcm9vdCBzY29wZSBpcyBhbHNvIGFuIG9iamVjdCB3aGljaCBoYXMgcmVhZG9ubHkgcHJvcGVydGllcyBhbmRcbiAgLy8gY291bGQgYWxzbyBoYXZlIHNldHRlcnMuXG4gIGlmIChzY29wZSA9PT0gdGhpcy5nbG9iYWwgJiYgKCFzdHJpY3QgfHwgdGhpcy5oYXNQcm9wZXJ0eShzY29wZSwgbmFtZSkpKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0UHJvcGVydHkoc2NvcGUsIG5hbWUsIHZhbHVlKTtcbiAgfVxuICB0aGlzLnRocm93RXhjZXB0aW9uKHRoaXMuUkVGRVJFTkNFX0VSUk9SLCBuYW1lICsgJyBpcyBub3QgZGVmaW5lZCcpO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgc2NvcGUgZm9yIHRoZSBnaXZlbiBub2RlLlxuICogQHBhcmFtIHshT2JqZWN0fSBub2RlIEFTVCBub2RlIChwcm9ncmFtIG9yIGZ1bmN0aW9uKS5cbiAqIEBwYXJhbSB7IUludGVycHJldGVyLk9iamVjdH0gc2NvcGUgU2NvcGUgZGljdGlvbmFyeSB0byBwb3B1bGF0ZS5cbiAqIEBwcml2YXRlXG4gKi9cbkludGVycHJldGVyLnByb3RvdHlwZS5wb3B1bGF0ZVNjb3BlXyA9IGZ1bmN0aW9uKG5vZGUsIHNjb3BlKSB7XG4gIGlmIChub2RlWyd0eXBlJ10gPT09ICdWYXJpYWJsZURlY2xhcmF0aW9uJykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZVsnZGVjbGFyYXRpb25zJ10ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuc2V0UHJvcGVydHkoc2NvcGUsIG5vZGVbJ2RlY2xhcmF0aW9ucyddW2ldWydpZCddWyduYW1lJ10sXG4gICAgICAgICAgdW5kZWZpbmVkLCBJbnRlcnByZXRlci5WQVJJQUJMRV9ERVNDUklQVE9SKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAobm9kZVsndHlwZSddID09PSAnRnVuY3Rpb25EZWNsYXJhdGlvbicpIHtcbiAgICB0aGlzLnNldFByb3BlcnR5KHNjb3BlLCBub2RlWydpZCddWyduYW1lJ10sXG4gICAgICAgIHRoaXMuY3JlYXRlRnVuY3Rpb24obm9kZSwgc2NvcGUpLCBJbnRlcnByZXRlci5WQVJJQUJMRV9ERVNDUklQVE9SKTtcbiAgICByZXR1cm47ICAvLyBEbyBub3QgcmVjdXJzZSBpbnRvIGZ1bmN0aW9uLlxuICB9IGVsc2UgaWYgKG5vZGVbJ3R5cGUnXSA9PT0gJ0Z1bmN0aW9uRXhwcmVzc2lvbicpIHtcbiAgICByZXR1cm47ICAvLyBEbyBub3QgcmVjdXJzZSBpbnRvIGZ1bmN0aW9uLlxuICB9IGVsc2UgaWYgKG5vZGVbJ3R5cGUnXSA9PT0gJ0V4cHJlc3Npb25TdGF0ZW1lbnQnKSB7XG4gICAgcmV0dXJuOyAgLy8gRXhwcmVzc2lvbnMgY2FuJ3QgY29udGFpbiB2YXJpYWJsZS9mdW5jdGlvbiBkZWNsYXJhdGlvbnMuXG4gIH1cbiAgdmFyIG5vZGVDbGFzcyA9IG5vZGVbJ2NvbnN0cnVjdG9yJ107XG4gIGZvciAodmFyIG5hbWUgaW4gbm9kZSkge1xuICAgIHZhciBwcm9wID0gbm9kZVtuYW1lXTtcbiAgICBpZiAocHJvcCAmJiB0eXBlb2YgcHJvcCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHByb3ApKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChwcm9wW2ldICYmIHByb3BbaV0uY29uc3RydWN0b3IgPT09IG5vZGVDbGFzcykge1xuICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZVNjb3BlXyhwcm9wW2ldLCBzY29wZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocHJvcC5jb25zdHJ1Y3RvciA9PT0gbm9kZUNsYXNzKSB7XG4gICAgICAgICAgdGhpcy5wb3B1bGF0ZVNjb3BlXyhwcm9wLCBzY29wZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogUmVtb3ZlIHN0YXJ0IGFuZCBlbmQgdmFsdWVzIGZyb20gQVNULCBvciBzZXQgc3RhcnQgYW5kIGVuZCB2YWx1ZXMgdG8gYVxuICogY29uc3RhbnQgdmFsdWUuICBVc2VkIHRvIHJlbW92ZSBoaWdobGlnaHRpbmcgZnJvbSBwb2x5ZmlsbHMgYW5kIHRvIHNldFxuICogaGlnaGxpZ2h0aW5nIGluIGFuIGV2YWwgdG8gY292ZXIgdGhlIGVudGlyZSBldmFsIGV4cHJlc3Npb24uXG4gKiBAcGFyYW0geyFPYmplY3R9IG5vZGUgQVNUIG5vZGUuXG4gKiBAcGFyYW0ge251bWJlcj19IHN0YXJ0IFN0YXJ0aW5nIGNoYXJhY3RlciBvZiBhbGwgbm9kZXMsIG9yIHVuZGVmaW5lZC5cbiAqIEBwYXJhbSB7bnVtYmVyPX0gZW5kIEVuZGluZyBjaGFyYWN0ZXIgb2YgYWxsIG5vZGVzLCBvciB1bmRlZmluZWQuXG4gKiBAcHJpdmF0ZVxuICovXG5JbnRlcnByZXRlci5wcm90b3R5cGUuc3RyaXBMb2NhdGlvbnNfID0gZnVuY3Rpb24obm9kZSwgc3RhcnQsIGVuZCkge1xuICBpZiAoc3RhcnQpIHtcbiAgICBub2RlWydzdGFydCddID0gc3RhcnQ7XG4gIH0gZWxzZSB7XG4gICAgZGVsZXRlIG5vZGVbJ3N0YXJ0J107XG4gIH1cbiAgaWYgKGVuZCkge1xuICAgIG5vZGVbJ2VuZCddID0gZW5kO1xuICB9IGVsc2Uge1xuICAgIGRlbGV0ZSBub2RlWydlbmQnXTtcbiAgfVxuICBmb3IgKHZhciBuYW1lIGluIG5vZGUpIHtcbiAgICBpZiAobm9kZS5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgdmFyIHByb3AgPSBub2RlW25hbWVdO1xuICAgICAgaWYgKHByb3AgJiYgdHlwZW9mIHByb3AgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHRoaXMuc3RyaXBMb2NhdGlvbnNfKHByb3AsIHN0YXJ0LCBlbmQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBJcyB0aGUgY3VycmVudCBzdGF0ZSBkaXJlY3RseSBiZWluZyBjYWxsZWQgd2l0aCBhcyBhIGNvbnN0cnVjdGlvbiB3aXRoICduZXcnLlxuICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiAnbmV3IGZvbygpJywgZmFsc2UgaWYgJ2ZvbygpJy5cbiAqL1xuSW50ZXJwcmV0ZXIucHJvdG90eXBlLmNhbGxlZFdpdGhOZXcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuc3RhdGVTdGFja1t0aGlzLnN0YXRlU3RhY2subGVuZ3RoIC0gMV0uaXNDb25zdHJ1Y3Rvcjtcbn07XG5cbi8qKlxuICogR2V0cyBhIHZhbHVlIGZyb20gdGhlIHNjb3BlIGNoYWluIG9yIGZyb20gYW4gb2JqZWN0IHByb3BlcnR5LlxuICogQHBhcmFtIHshQXJyYXl9IHJlZiBOYW1lIG9mIHZhcmlhYmxlIG9yIG9iamVjdC9wcm9wbmFtZSB0dXBsZS5cbiAqIEByZXR1cm4ge0ludGVycHJldGVyLlZhbHVlfSBBbnkgdmFsdWUuXG4gKiAgIE1heSBiZSBmbGFnZ2VkIGFzIGJlaW5nIGEgZ2V0dGVyIGFuZCB0aHVzIG5lZWRpbmcgaW1tZWRpYXRlIGV4ZWN1dGlvblxuICogICAocmF0aGVyIHRoYW4gYmVpbmcgdGhlIHZhbHVlIG9mIHRoZSBwcm9wZXJ0eSkuXG4gKi9cbkludGVycHJldGVyLnByb3RvdHlwZS5nZXRWYWx1ZSA9IGZ1bmN0aW9uKHJlZikge1xuICBpZiAocmVmWzBdID09PSBJbnRlcnByZXRlci5TQ09QRV9SRUZFUkVOQ0UpIHtcbiAgICAvLyBBIG51bGwvdmFybmFtZSB2YXJpYWJsZSBsb29rdXAuXG4gICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWVGcm9tU2NvcGUocmVmWzFdKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBBbiBvYmovcHJvcCBjb21wb25lbnRzIHR1cGxlIChmb28uYmFyKS5cbiAgICByZXR1cm4gdGhpcy5nZXRQcm9wZXJ0eShyZWZbMF0sIHJlZlsxXSk7XG4gIH1cbn07XG5cbi8qKlxuICogU2V0cyBhIHZhbHVlIHRvIHRoZSBzY29wZSBjaGFpbiBvciB0byBhbiBvYmplY3QgcHJvcGVydHkuXG4gKiBAcGFyYW0geyFBcnJheX0gcmVmIE5hbWUgb2YgdmFyaWFibGUgb3Igb2JqZWN0L3Byb3BuYW1lIHR1cGxlLlxuICogQHBhcmFtIHtJbnRlcnByZXRlci5WYWx1ZX0gdmFsdWUgVmFsdWUuXG4gKiBAcmV0dXJuIHshSW50ZXJwcmV0ZXIuT2JqZWN0fHVuZGVmaW5lZH0gUmV0dXJucyBhIHNldHRlciBmdW5jdGlvbiBpZiBvbmVcbiAqICAgICBuZWVkcyB0byBiZSBjYWxsZWQsIG90aGVyd2lzZSB1bmRlZmluZWQuXG4gKi9cbkludGVycHJldGVyLnByb3RvdHlwZS5zZXRWYWx1ZSA9IGZ1bmN0aW9uKHJlZiwgdmFsdWUpIHtcbiAgaWYgKHJlZlswXSA9PT0gSW50ZXJwcmV0ZXIuU0NPUEVfUkVGRVJFTkNFKSB7XG4gICAgLy8gQSBudWxsL3Zhcm5hbWUgdmFyaWFibGUgbG9va3VwLlxuICAgIHJldHVybiB0aGlzLnNldFZhbHVlVG9TY29wZShyZWZbMV0sIHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBBbiBvYmovcHJvcCBjb21wb25lbnRzIHR1cGxlIChmb28uYmFyKS5cbiAgICByZXR1cm4gdGhpcy5zZXRQcm9wZXJ0eShyZWZbMF0sIHJlZlsxXSwgdmFsdWUpO1xuICB9XG59O1xuXG4vKipcbiAgKiBDb21wbGV0aW9uIFZhbHVlIFR5cGVzLlxuICAqIEBlbnVtIHtudW1iZXJ9XG4gICovXG4gSW50ZXJwcmV0ZXIuQ29tcGxldGlvbiA9IHtcbiAgIE5PUk1BTDogMCxcbiAgIEJSRUFLOiAxLFxuICAgQ09OVElOVUU6IDIsXG4gICBSRVRVUk46IDMsXG4gICBUSFJPVzogNFxuIH07XG5cbi8qKlxuICogVGhyb3cgYW4gZXhjZXB0aW9uIGluIHRoZSBpbnRlcnByZXRlciB0aGF0IGNhbiBiZSBoYW5kbGVkIGJ5IGFuXG4gKiBpbnRlcnByZXRlciB0cnkvY2F0Y2ggc3RhdGVtZW50LiAgSWYgdW5oYW5kbGVkLCBhIHJlYWwgZXhjZXB0aW9uIHdpbGxcbiAqIGJlIHRocm93bi4gIENhbiBiZSBjYWxsZWQgd2l0aCBlaXRoZXIgYW4gZXJyb3IgY2xhc3MgYW5kIGEgbWVzc2FnZSwgb3JcbiAqIHdpdGggYW4gYWN0dWFsIG9iamVjdCB0byBiZSB0aHJvd24uXG4gKiBAcGFyYW0geyFJbnRlcnByZXRlci5PYmplY3R9IGVycm9yQ2xhc3MgVHlwZSBvZiBlcnJvciAoaWYgbWVzc2FnZSBpc1xuICogICBwcm92aWRlZCkgb3IgdGhlIHZhbHVlIHRvIHRocm93IChpZiBubyBtZXNzYWdlKS5cbiAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0X21lc3NhZ2UgTWVzc2FnZSBiZWluZyB0aHJvd24uXG4gKi9cbkludGVycHJldGVyLnByb3RvdHlwZS50aHJvd0V4Y2VwdGlvbiA9IGZ1bmN0aW9uKGVycm9yQ2xhc3MsIG9wdF9tZXNzYWdlKSB7XG4gIGlmIChvcHRfbWVzc2FnZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIGVycm9yID0gZXJyb3JDbGFzczsgIC8vIFRoaXMgaXMgYSB2YWx1ZSB0byB0aHJvdywgbm90IGFuIGVycm9yIGNsYXNzLlxuICB9IGVsc2Uge1xuICAgIHZhciBlcnJvciA9IHRoaXMuY3JlYXRlT2JqZWN0KGVycm9yQ2xhc3MpO1xuICAgIHRoaXMuc2V0UHJvcGVydHkoZXJyb3IsICdtZXNzYWdlJywgb3B0X21lc3NhZ2UsXG4gICAgICAgIEludGVycHJldGVyLk5PTkVOVU1FUkFCTEVfREVTQ1JJUFRPUik7XG4gIH1cbiAgdGhpcy51bndpbmQoSW50ZXJwcmV0ZXIuQ29tcGxldGlvbi5USFJPVywgZXJyb3IsIHVuZGVmaW5lZCk7XG4gIC8vIEFib3J0IGFueXRoaW5nIHJlbGF0ZWQgdG8gdGhlIGN1cnJlbnQgc3RlcC5cbiAgdGhyb3cgSW50ZXJwcmV0ZXIuU1RFUF9FUlJPUjtcbn07XG5cbi8qKlxuICogVW53aW5kIHRoZSBzdGFjayB0byB0aGUgaW5uZXJtb3N0IHJlbGV2YW50IGVuY2xvc2luZyBUcnlTdGF0ZW1lbnQsXG4gKiBGb3IvRm9ySW4vV2hpbGVTdGF0ZW1lbnQgb3IgQ2FsbC9OZXdFeHByZXNzaW9uLiAgSWYgdGhpcyByZXN1bHRzIGluXG4gKiB0aGUgc3RhY2sgYmVpbmcgY29tcGxldGVseSB1bndvdW5kIHRoZSB0aHJlYWQgd2lsbCBiZSB0ZXJtaW5hdGVkXG4gKiBhbmQgdGhlIGFwcHJvcHJpYXRlIGVycm9yIGJlaW5nIHRocm93bi5cbiAqIEBwYXJhbSB7SW50ZXJwcmV0ZXIuQ29tcGxldGlvbn0gdHlwZSBDb21wbGV0aW9uIHR5cGUuXG4gKiBAcGFyYW0ge0ludGVycHJldGVyLlZhbHVlfSB2YWx1ZSBWYWx1ZSBjb21wdXRlZCwgcmV0dXJuZWQgb3IgdGhyb3duLlxuICogQHBhcmFtIHtzdHJpbmd8dW5kZWZpbmVkfSBsYWJlbCBUYXJnZXQgbGFiZWwgZm9yIGJyZWFrIG9yIHJldHVybi5cbiAqL1xuSW50ZXJwcmV0ZXIucHJvdG90eXBlLnVud2luZCA9IGZ1bmN0aW9uKHR5cGUsIHZhbHVlLCBsYWJlbCkge1xuICBpZiAodHlwZSA9PT0gSW50ZXJwcmV0ZXIuQ29tcGxldGlvbi5OT1JNQUwpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ1Nob3VsZCBub3QgdW53aW5kIGZvciBOT1JNQUwgY29tcGxldGlvbnMnKTtcbiAgfVxuXG4gIGZvciAodmFyIHN0YWNrID0gdGhpcy5zdGF0ZVN0YWNrOyBzdGFjay5sZW5ndGggPiAwOyBzdGFjay5wb3AoKSkge1xuICAgIHZhciBzdGF0ZSA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICAgIHN3aXRjaCAoc3RhdGUubm9kZVsndHlwZSddKSB7XG4gICAgICBjYXNlICdUcnlTdGF0ZW1lbnQnOlxuICAgICAgICBzdGF0ZS5jdiA9IHt0eXBlOiB0eXBlLCB2YWx1ZTogdmFsdWUsIGxhYmVsOiBsYWJlbH07XG4gICAgICAgIHJldHVybjtcbiAgICAgIGNhc2UgJ0NhbGxFeHByZXNzaW9uJzpcbiAgICAgIGNhc2UgJ05ld0V4cHJlc3Npb24nOlxuICAgICAgICBpZiAodHlwZSA9PT0gSW50ZXJwcmV0ZXIuQ29tcGxldGlvbi5SRVRVUk4pIHtcbiAgICAgICAgICBzdGF0ZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlICE9PSBJbnRlcnByZXRlci5Db21wbGV0aW9uLlRIUk9XKSB7XG4gICAgICAgICAgdGhyb3cgRXJyb3IoJ1Vuc3luYXRjdGljIGJyZWFrL2NvbnRpbnVlIG5vdCByZWplY3RlZCBieSBBY29ybicpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICh0eXBlID09PSBJbnRlcnByZXRlci5Db21wbGV0aW9uLkJSRUFLKSB7XG4gICAgICBpZiAobGFiZWwgPyAoc3RhdGUubGFiZWxzICYmIHN0YXRlLmxhYmVscy5pbmRleE9mKGxhYmVsKSAhPT0gLTEpIDpcbiAgICAgICAgICAoc3RhdGUuaXNMb29wIHx8IHN0YXRlLmlzU3dpdGNoKSkge1xuICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gSW50ZXJwcmV0ZXIuQ29tcGxldGlvbi5DT05USU5VRSkge1xuICAgICAgaWYgKGxhYmVsID8gKHN0YXRlLmxhYmVscyAmJiBzdGF0ZS5sYWJlbHMuaW5kZXhPZihsYWJlbCkgIT09IC0xKSA6XG4gICAgICAgICAgc3RhdGUuaXNMb29wKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBVbmhhbmRsZWQgY29tcGxldGlvbi4gIFRocm93IGEgcmVhbCBlcnJvci5cbiAgdmFyIHJlYWxFcnJvcjtcbiAgaWYgKHRoaXMuaXNhKHZhbHVlLCB0aGlzLkVSUk9SKSkge1xuICAgIHZhciBlcnJvclRhYmxlID0ge1xuICAgICAgJ0V2YWxFcnJvcic6IEV2YWxFcnJvcixcbiAgICAgICdSYW5nZUVycm9yJzogUmFuZ2VFcnJvcixcbiAgICAgICdSZWZlcmVuY2VFcnJvcic6IFJlZmVyZW5jZUVycm9yLFxuICAgICAgJ1N5bnRheEVycm9yJzogU3ludGF4RXJyb3IsXG4gICAgICAnVHlwZUVycm9yJzogVHlwZUVycm9yLFxuICAgICAgJ1VSSUVycm9yJzogVVJJRXJyb3JcbiAgICB9O1xuICAgIHZhciBuYW1lID0gU3RyaW5nKHRoaXMuZ2V0UHJvcGVydHkodmFsdWUsICduYW1lJykpO1xuICAgIHZhciBtZXNzYWdlID0gdGhpcy5nZXRQcm9wZXJ0eSh2YWx1ZSwgJ21lc3NhZ2UnKS52YWx1ZU9mKCk7XG4gICAgdmFyIGVycm9yQ29uc3RydWN0b3IgPSBlcnJvclRhYmxlW25hbWVdIHx8IEVycm9yO1xuICAgIHJlYWxFcnJvciA9IGVycm9yQ29uc3RydWN0b3IobWVzc2FnZSk7XG4gIH0gZWxzZSB7XG4gICAgcmVhbEVycm9yID0gU3RyaW5nKHZhbHVlKTtcbiAgfVxuICB0aHJvdyByZWFsRXJyb3I7XG59O1xuXG4vKipcbiAqIENyZWF0ZSBhIGNhbGwgdG8gYSBnZXR0ZXIgZnVuY3Rpb24uXG4gKiBAcGFyYW0geyFJbnRlcnByZXRlci5PYmplY3R9IGZ1bmMgRnVuY3Rpb24gdG8gZXhlY3V0ZS5cbiAqIEBwYXJhbSB7IUludGVycHJldGVyLk9iamVjdHwhQXJyYXl9IGxlZnRcbiAqICAgICBOYW1lIG9mIHZhcmlhYmxlIG9yIG9iamVjdC9wcm9wbmFtZSB0dXBsZS5cbiAqIEBwcml2YXRlXG4gKi9cbkludGVycHJldGVyLnByb3RvdHlwZS5jcmVhdGVHZXR0ZXJfID0gZnVuY3Rpb24oZnVuYywgbGVmdCkge1xuICAvLyBOb3JtYWxseSAndGhpcycgd2lsbCBiZSBzcGVjaWZpZWQgYXMgdGhlIG9iamVjdCBjb21wb25lbnQgKG8ueCkuXG4gIC8vIFNvbWV0aW1lcyAndGhpcycgaXMgZXhwbGljaXRseSBwcm92aWRlZCAobykuXG4gIHZhciBmdW5jVGhpcyA9IEFycmF5LmlzQXJyYXkobGVmdCkgPyBsZWZ0WzBdIDogbGVmdDtcbiAgdmFyIG5vZGUgPSBuZXcgdGhpcy5ub2RlQ29uc3RydWN0b3Ioe29wdGlvbnM6e319KTtcbiAgbm9kZVsndHlwZSddID0gJ0NhbGxFeHByZXNzaW9uJztcbiAgdmFyIHN0YXRlID0gbmV3IEludGVycHJldGVyLlN0YXRlKG5vZGUsXG4gICAgICB0aGlzLnN0YXRlU3RhY2tbdGhpcy5zdGF0ZVN0YWNrLmxlbmd0aCAtIDFdLnNjb3BlKTtcbiAgc3RhdGUuZG9uZUNhbGxlZV8gPSB0cnVlO1xuICBzdGF0ZS5mdW5jVGhpc18gPSBmdW5jVGhpcztcbiAgc3RhdGUuZnVuY18gPSBmdW5jO1xuICBzdGF0ZS5kb25lQXJnc18gPSB0cnVlO1xuICBzdGF0ZS5hcmd1bWVudHNfID0gW107XG4gIHJldHVybiBzdGF0ZTtcbn07XG5cbi8qKlxuICogQ3JlYXRlIGEgY2FsbCB0byBhIHNldHRlciBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7IUludGVycHJldGVyLk9iamVjdH0gZnVuYyBGdW5jdGlvbiB0byBleGVjdXRlLlxuICogQHBhcmFtIHshSW50ZXJwcmV0ZXIuT2JqZWN0fCFBcnJheX0gbGVmdFxuICogICAgIE5hbWUgb2YgdmFyaWFibGUgb3Igb2JqZWN0L3Byb3BuYW1lIHR1cGxlLlxuICogQHBhcmFtIHtJbnRlcnByZXRlci5WYWx1ZX0gdmFsdWUgVmFsdWUgdG8gc2V0LlxuICogQHByaXZhdGVcbiAqL1xuSW50ZXJwcmV0ZXIucHJvdG90eXBlLmNyZWF0ZVNldHRlcl8gPSBmdW5jdGlvbihmdW5jLCBsZWZ0LCB2YWx1ZSkge1xuICAvLyBOb3JtYWxseSAndGhpcycgd2lsbCBiZSBzcGVjaWZpZWQgYXMgdGhlIG9iamVjdCBjb21wb25lbnQgKG8ueCkuXG4gIC8vIFNvbWV0aW1lcyAndGhpcycgaXMgaW1wbGljaXRseSB0aGUgZ2xvYmFsIG9iamVjdCAoeCkuXG4gIHZhciBmdW5jVGhpcyA9IEFycmF5LmlzQXJyYXkobGVmdCkgPyBsZWZ0WzBdIDogdGhpcy5nbG9iYWw7XG4gIHZhciBub2RlID0gbmV3IHRoaXMubm9kZUNvbnN0cnVjdG9yKHtvcHRpb25zOnt9fSk7XG4gIG5vZGVbJ3R5cGUnXSA9ICdDYWxsRXhwcmVzc2lvbic7XG4gIHZhciBzdGF0ZSA9IG5ldyBJbnRlcnByZXRlci5TdGF0ZShub2RlLFxuICAgICAgdGhpcy5zdGF0ZVN0YWNrW3RoaXMuc3RhdGVTdGFjay5sZW5ndGggLSAxXS5zY29wZSk7XG4gIHN0YXRlLmRvbmVDYWxsZWVfID0gdHJ1ZTtcbiAgc3RhdGUuZnVuY1RoaXNfID0gZnVuY1RoaXM7XG4gIHN0YXRlLmZ1bmNfID0gZnVuYztcbiAgc3RhdGUuZG9uZUFyZ3NfID0gdHJ1ZTtcbiAgc3RhdGUuYXJndW1lbnRzXyA9IFt2YWx1ZV07XG4gIHJldHVybiBzdGF0ZTtcbn07XG5cbi8qKlxuICogQ2xhc3MgZm9yIGEgc3RhdGUuXG4gKiBAcGFyYW0geyFPYmplY3R9IG5vZGUgQVNUIG5vZGUgZm9yIHRoZSBzdGF0ZS5cbiAqIEBwYXJhbSB7IUludGVycHJldGVyLk9iamVjdH0gc2NvcGUgU2NvcGUgb2JqZWN0IGZvciB0aGUgc3RhdGUuXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuSW50ZXJwcmV0ZXIuU3RhdGUgPSBmdW5jdGlvbihub2RlLCBzY29wZSkge1xuICB0aGlzLm5vZGUgPSBub2RlO1xuICB0aGlzLnNjb3BlID0gc2NvcGU7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIEZ1bmN0aW9ucyB0byBoYW5kbGUgZWFjaCBub2RlIHR5cGUuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbkludGVycHJldGVyLnByb3RvdHlwZVsnc3RlcEFycmF5RXhwcmVzc2lvbiddID0gZnVuY3Rpb24oc3RhY2ssIHN0YXRlLCBub2RlKSB7XG4gIHZhciBlbGVtZW50cyA9IG5vZGVbJ2VsZW1lbnRzJ107XG4gIHZhciBuID0gc3RhdGUubl8gfHwgMDtcbiAgaWYgKCFzdGF0ZS5hcnJheV8pIHtcbiAgICBzdGF0ZS5hcnJheV8gPSB0aGlzLmNyZWF0ZU9iamVjdFByb3RvKHRoaXMuQVJSQVlfUFJPVE8pO1xuICAgIHN0YXRlLmFycmF5Xy5wcm9wZXJ0aWVzLmxlbmd0aCA9IGVsZW1lbnRzLmxlbmd0aDtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnNldFByb3BlcnR5KHN0YXRlLmFycmF5Xywgbiwgc3RhdGUudmFsdWUpO1xuICAgIG4rKztcbiAgfVxuICB3aGlsZSAobiA8IGVsZW1lbnRzLmxlbmd0aCkge1xuICAgIC8vIFNraXAgbWlzc2luZyBlbGVtZW50cyAtIHRoZXkncmUgbm90IGRlZmluZWQsIG5vdCB1bmRlZmluZWQuXG4gICAgaWYgKGVsZW1lbnRzW25dKSB7XG4gICAgICBzdGF0ZS5uXyA9IG47XG4gICAgICByZXR1cm4gbmV3IEludGVycHJldGVyLlN0YXRlKGVsZW1lbnRzW25dLCBzdGF0ZS5zY29wZSk7XG4gICAgfVxuICAgIG4rKztcbiAgfVxuICBzdGFjay5wb3AoKTtcbiAgc3RhY2tbc3RhY2subGVuZ3RoIC0gMV0udmFsdWUgPSBzdGF0ZS5hcnJheV87XG59O1xuXG5JbnRlcnByZXRlci5wcm90b3R5cGVbJ3N0ZXBBc3NpZ25tZW50RXhwcmVzc2lvbiddID1cbiAgICBmdW5jdGlvbihzdGFjaywgc3RhdGUsIG5vZGUpIHtcbiAgaWYgKCFzdGF0ZS5kb25lTGVmdF8pIHtcbiAgICBzdGF0ZS5kb25lTGVmdF8gPSB0cnVlO1xuICAgIHZhciBuZXh0U3RhdGUgPSBuZXcgSW50ZXJwcmV0ZXIuU3RhdGUobm9kZVsnbGVmdCddLCBzdGF0ZS5zY29wZSk7XG4gICAgbmV4dFN0YXRlLmNvbXBvbmVudHMgPSB0cnVlO1xuICAgIHJldHVybiBuZXh0U3RhdGU7XG4gIH1cbiAgaWYgKCFzdGF0ZS5kb25lUmlnaHRfKSB7XG4gICAgaWYgKCFzdGF0ZS5sZWZ0UmVmZXJlbmNlXykge1xuICAgICAgc3RhdGUubGVmdFJlZmVyZW5jZV8gPSBzdGF0ZS52YWx1ZTtcbiAgICB9XG4gICAgaWYgKHN0YXRlLmRvbmVHZXR0ZXJfKSB7XG4gICAgICBzdGF0ZS5sZWZ0VmFsdWVfID0gc3RhdGUudmFsdWU7XG4gICAgfVxuICAgIGlmICghc3RhdGUuZG9uZUdldHRlcl8gJiYgbm9kZVsnb3BlcmF0b3InXSAhPT0gJz0nKSB7XG4gICAgICB2YXIgbGVmdFZhbHVlID0gdGhpcy5nZXRWYWx1ZShzdGF0ZS5sZWZ0UmVmZXJlbmNlXyk7XG4gICAgICBzdGF0ZS5sZWZ0VmFsdWVfID0gbGVmdFZhbHVlO1xuICAgICAgaWYgKGxlZnRWYWx1ZSAmJiB0eXBlb2YgbGVmdFZhbHVlID09PSAnb2JqZWN0JyAmJiBsZWZ0VmFsdWUuaXNHZXR0ZXIpIHtcbiAgICAgICAgLy8gQ2xlYXIgdGhlIGdldHRlciBmbGFnIGFuZCBjYWxsIHRoZSBnZXR0ZXIgZnVuY3Rpb24uXG4gICAgICAgIGxlZnRWYWx1ZS5pc0dldHRlciA9IGZhbHNlO1xuICAgICAgICBzdGF0ZS5kb25lR2V0dGVyXyA9IHRydWU7XG4gICAgICAgIHZhciBmdW5jID0gLyoqIEB0eXBlIHshSW50ZXJwcmV0ZXIuT2JqZWN0fSAqLyAobGVmdFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlR2V0dGVyXyhmdW5jLCBzdGF0ZS5sZWZ0UmVmZXJlbmNlXyk7XG4gICAgICB9XG4gICAgfVxuICAgIHN0YXRlLmRvbmVSaWdodF8gPSB0cnVlO1xuICAgIHJldHVybiBuZXcgSW50ZXJwcmV0ZXIuU3RhdGUobm9kZVsncmlnaHQnXSwgc3RhdGUuc2NvcGUpO1xuICB9XG4gIGlmIChzdGF0ZS5kb25lU2V0dGVyXykge1xuICAgIC8vIFJldHVybiBpZiBzZXR0ZXIgZnVuY3Rpb24uXG4gICAgLy8gU2V0dGVyIG1ldGhvZCBvbiBwcm9wZXJ0eSBoYXMgY29tcGxldGVkLlxuICAgIC8vIElnbm9yZSBpdHMgcmV0dXJuIHZhbHVlLCBhbmQgdXNlIHRoZSBvcmlnaW5hbCBzZXQgdmFsdWUgaW5zdGVhZC5cbiAgICBzdGFjay5wb3AoKTtcbiAgICBzdGFja1tzdGFjay5sZW5ndGggLSAxXS52YWx1ZSA9IHN0YXRlLnNldHRlclZhbHVlXztcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIHZhbHVlID0gc3RhdGUubGVmdFZhbHVlXztcbiAgdmFyIHJpZ2h0VmFsdWUgPSBzdGF0ZS52YWx1ZTtcbiAgc3dpdGNoIChub2RlWydvcGVyYXRvciddKSB7XG4gICAgY2FzZSAnPSc6ICAgIHZhbHVlID0gICAgcmlnaHRWYWx1ZTsgYnJlYWs7XG4gICAgY2FzZSAnKz0nOiAgIHZhbHVlICs9ICAgcmlnaHRWYWx1ZTsgYnJlYWs7XG4gICAgY2FzZSAnLT0nOiAgIHZhbHVlIC09ICAgcmlnaHRWYWx1ZTsgYnJlYWs7XG4gICAgY2FzZSAnKj0nOiAgIHZhbHVlICo9ICAgcmlnaHRWYWx1ZTsgYnJlYWs7XG4gICAgY2FzZSAnLz0nOiAgIHZhbHVlIC89ICAgcmlnaHRWYWx1ZTsgYnJlYWs7XG4gICAgY2FzZSAnJT0nOiAgIHZhbHVlICU9ICAgcmlnaHRWYWx1ZTsgYnJlYWs7XG4gICAgY2FzZSAnPDw9JzogIHZhbHVlIDw8PSAgcmlnaHRWYWx1ZTsgYnJlYWs7XG4gICAgY2FzZSAnPj49JzogIHZhbHVlID4+PSAgcmlnaHRWYWx1ZTsgYnJlYWs7XG4gICAgY2FzZSAnPj4+PSc6IHZhbHVlID4+Pj0gcmlnaHRWYWx1ZTsgYnJlYWs7XG4gICAgY2FzZSAnJj0nOiAgIHZhbHVlICY9ICAgcmlnaHRWYWx1ZTsgYnJlYWs7XG4gICAgY2FzZSAnXj0nOiAgIHZhbHVlIF49ICAgcmlnaHRWYWx1ZTsgYnJlYWs7XG4gICAgY2FzZSAnfD0nOiAgIHZhbHVlIHw9ICAgcmlnaHRWYWx1ZTsgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IFN5bnRheEVycm9yKCdVbmtub3duIGFzc2lnbm1lbnQgZXhwcmVzc2lvbjogJyArIG5vZGVbJ29wZXJhdG9yJ10pO1xuICB9XG4gIHZhciBzZXR0ZXIgPSB0aGlzLnNldFZhbHVlKHN0YXRlLmxlZnRSZWZlcmVuY2VfLCB2YWx1ZSk7XG4gIGlmIChzZXR0ZXIpIHtcbiAgICBzdGF0ZS5kb25lU2V0dGVyXyA9IHRydWU7XG4gICAgc3RhdGUuc2V0dGVyVmFsdWVfID0gdmFsdWU7XG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlU2V0dGVyXyhzZXR0ZXIsIHN0YXRlLmxlZnRSZWZlcmVuY2VfLCB2YWx1ZSk7XG4gIH1cbiAgLy8gUmV0dXJuIGlmIG5vIHNldHRlciBmdW5jdGlvbi5cbiAgc3RhY2sucG9wKCk7XG4gIHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdLnZhbHVlID0gdmFsdWU7XG59O1xuXG5JbnRlcnByZXRlci5wcm90b3R5cGVbJ3N0ZXBCaW5hcnlFeHByZXNzaW9uJ10gPSBmdW5jdGlvbihzdGFjaywgc3RhdGUsIG5vZGUpIHtcbiAgaWYgKCFzdGF0ZS5kb25lTGVmdF8pIHtcbiAgICBzdGF0ZS5kb25lTGVmdF8gPSB0cnVlO1xuICAgIHJldHVybiBuZXcgSW50ZXJwcmV0ZXIuU3RhdGUobm9kZVsnbGVmdCddLCBzdGF0ZS5zY29wZSk7XG4gIH1cbiAgaWYgKCFzdGF0ZS5kb25lUmlnaHRfKSB7XG4gICAgc3RhdGUuZG9uZVJpZ2h0XyA9IHRydWU7XG4gICAgc3RhdGUubGVmdFZhbHVlXyA9IHN0YXRlLnZhbHVlO1xuICAgIHJldHVybiBuZXcgSW50ZXJwcmV0ZXIuU3RhdGUobm9kZVsncmlnaHQnXSwgc3RhdGUuc2NvcGUpO1xuICB9XG4gIHN0YWNrLnBvcCgpO1xuICB2YXIgbGVmdFZhbHVlID0gc3RhdGUubGVmdFZhbHVlXztcbiAgdmFyIHJpZ2h0VmFsdWUgPSBzdGF0ZS52YWx1ZTtcbiAgdmFyIHZhbHVlO1xuICBzd2l0Y2ggKG5vZGVbJ29wZXJhdG9yJ10pIHtcbiAgICBjYXNlICc9PSc6ICB2YWx1ZSA9IGxlZnRWYWx1ZSA9PSAgcmlnaHRWYWx1ZTsgYnJlYWs7XG4gICAgY2FzZSAnIT0nOiAgdmFsdWUgPSBsZWZ0VmFsdWUgIT0gIHJpZ2h0VmFsdWU7IGJyZWFrO1xuICAgIGNhc2UgJz09PSc6IHZhbHVlID0gbGVmdFZhbHVlID09PSByaWdodFZhbHVlOyBicmVhaztcbiAgICBjYXNlICchPT0nOiB2YWx1ZSA9IGxlZnRWYWx1ZSAhPT0gcmlnaHRWYWx1ZTsgYnJlYWs7XG4gICAgY2FzZSAnPic6ICAgdmFsdWUgPSBsZWZ0VmFsdWUgPiAgIHJpZ2h0VmFsdWU7IGJyZWFrO1xuICAgIGNhc2UgJz49JzogIHZhbHVlID0gbGVmdFZhbHVlID49ICByaWdodFZhbHVlOyBicmVhaztcbiAgICBjYXNlICc8JzogICB2YWx1ZSA9IGxlZnRWYWx1ZSA8ICAgcmlnaHRWYWx1ZTsgYnJlYWs7XG4gICAgY2FzZSAnPD0nOiAgdmFsdWUgPSBsZWZ0VmFsdWUgPD0gIHJpZ2h0VmFsdWU7IGJyZWFrO1xuICAgIGNhc2UgJysnOiAgIHZhbHVlID0gbGVmdFZhbHVlICsgICByaWdodFZhbHVlOyBicmVhaztcbiAgICBjYXNlICctJzogICB2YWx1ZSA9IGxlZnRWYWx1ZSAtICAgcmlnaHRWYWx1ZTsgYnJlYWs7XG4gICAgY2FzZSAnKic6ICAgdmFsdWUgPSBsZWZ0VmFsdWUgKiAgIHJpZ2h0VmFsdWU7IGJyZWFrO1xuICAgIGNhc2UgJy8nOiAgIHZhbHVlID0gbGVmdFZhbHVlIC8gICByaWdodFZhbHVlOyBicmVhaztcbiAgICBjYXNlICclJzogICB2YWx1ZSA9IGxlZnRWYWx1ZSAlICAgcmlnaHRWYWx1ZTsgYnJlYWs7XG4gICAgY2FzZSAnJic6ICAgdmFsdWUgPSBsZWZ0VmFsdWUgJiAgIHJpZ2h0VmFsdWU7IGJyZWFrO1xuICAgIGNhc2UgJ3wnOiAgIHZhbHVlID0gbGVmdFZhbHVlIHwgICByaWdodFZhbHVlOyBicmVhaztcbiAgICBjYXNlICdeJzogICB2YWx1ZSA9IGxlZnRWYWx1ZSBeICAgcmlnaHRWYWx1ZTsgYnJlYWs7XG4gICAgY2FzZSAnPDwnOiAgdmFsdWUgPSBsZWZ0VmFsdWUgPDwgIHJpZ2h0VmFsdWU7IGJyZWFrO1xuICAgIGNhc2UgJz4+JzogIHZhbHVlID0gbGVmdFZhbHVlID4+ICByaWdodFZhbHVlOyBicmVhaztcbiAgICBjYXNlICc+Pj4nOiB2YWx1ZSA9IGxlZnRWYWx1ZSA+Pj4gcmlnaHRWYWx1ZTsgYnJlYWs7XG4gICAgY2FzZSAnaW4nOlxuICAgICAgaWYgKCFyaWdodFZhbHVlIHx8ICFyaWdodFZhbHVlLmlzT2JqZWN0KSB7XG4gICAgICAgIHRoaXMudGhyb3dFeGNlcHRpb24odGhpcy5UWVBFX0VSUk9SLFxuICAgICAgICAgICAgXCInaW4nIGV4cGVjdHMgYW4gb2JqZWN0LCBub3QgJ1wiICsgcmlnaHRWYWx1ZSArIFwiJ1wiKTtcbiAgICAgIH1cbiAgICAgIHZhbHVlID0gdGhpcy5oYXNQcm9wZXJ0eShyaWdodFZhbHVlLCBsZWZ0VmFsdWUpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnaW5zdGFuY2VvZic6XG4gICAgICBpZiAoIXRoaXMuaXNhKHJpZ2h0VmFsdWUsIHRoaXMuRlVOQ1RJT04pKSB7XG4gICAgICAgIHRoaXMudGhyb3dFeGNlcHRpb24odGhpcy5UWVBFX0VSUk9SLFxuICAgICAgICAgICAgJ1JpZ2h0LWhhbmQgc2lkZSBvZiBpbnN0YW5jZW9mIGlzIG5vdCBhbiBvYmplY3QnKTtcbiAgICAgIH1cbiAgICAgIHZhbHVlID0gbGVmdFZhbHVlLmlzT2JqZWN0ID8gdGhpcy5pc2EobGVmdFZhbHVlLCByaWdodFZhbHVlKSA6IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IFN5bnRheEVycm9yKCdVbmtub3duIGJpbmFyeSBvcGVyYXRvcjogJyArIG5vZGVbJ29wZXJhdG9yJ10pO1xuICB9XG4gIHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdLnZhbHVlID0gdmFsdWU7XG59O1xuXG5JbnRlcnByZXRlci5wcm90b3R5cGVbJ3N0ZXBCbG9ja1N0YXRlbWVudCddID0gZnVuY3Rpb24oc3RhY2ssIHN0YXRlLCBub2RlKSB7XG4gIHZhciBuID0gc3RhdGUubl8gfHwgMDtcbiAgdmFyIGV4cHJlc3Npb24gPSBub2RlWydib2R5J11bbl07XG4gIGlmIChleHByZXNzaW9uKSB7XG4gICAgc3RhdGUubl8gPSBuICsgMTtcbiAgICByZXR1cm4gbmV3IEludGVycHJldGVyLlN0YXRlKGV4cHJlc3Npb24sIHN0YXRlLnNjb3BlKTtcbiAgfVxuICBzdGFjay5wb3AoKTtcbn07XG5cbkludGVycHJldGVyLnByb3RvdHlwZVsnc3RlcEJyZWFrU3RhdGVtZW50J10gPSBmdW5jdGlvbihzdGFjaywgc3RhdGUsIG5vZGUpIHtcbiAgdmFyIGxhYmVsID0gbm9kZVsnbGFiZWwnXSAmJiBub2RlWydsYWJlbCddWyduYW1lJ107XG4gIHRoaXMudW53aW5kKEludGVycHJldGVyLkNvbXBsZXRpb24uQlJFQUssIHVuZGVmaW5lZCwgbGFiZWwpO1xufTtcblxuSW50ZXJwcmV0ZXIucHJvdG90eXBlWydzdGVwQ2FsbEV4cHJlc3Npb24nXSA9IGZ1bmN0aW9uKHN0YWNrLCBzdGF0ZSwgbm9kZSkge1xuICBpZiAoIXN0YXRlLmRvbmVDYWxsZWVfKSB7XG4gICAgc3RhdGUuZG9uZUNhbGxlZV8gPSAxO1xuICAgIC8vIENvbXBvbmVudHMgbmVlZGVkIHRvIGRldGVybWluZSB2YWx1ZSBvZiAndGhpcycuXG4gICAgdmFyIG5leHRTdGF0ZSA9IG5ldyBJbnRlcnByZXRlci5TdGF0ZShub2RlWydjYWxsZWUnXSwgc3RhdGUuc2NvcGUpO1xuICAgIG5leHRTdGF0ZS5jb21wb25lbnRzID0gdHJ1ZTtcbiAgICByZXR1cm4gbmV4dFN0YXRlO1xuICB9XG4gIGlmIChzdGF0ZS5kb25lQ2FsbGVlXyA9PT0gMSkge1xuICAgIC8vIERldGVybWluZSB2YWx1ZSBvZiB0aGUgZnVuY3Rpb24uXG4gICAgc3RhdGUuZG9uZUNhbGxlZV8gPSAyO1xuICAgIHZhciBmdW5jID0gc3RhdGUudmFsdWU7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZnVuYykpIHtcbiAgICAgIHN0YXRlLmZ1bmNfID0gdGhpcy5nZXRWYWx1ZShmdW5jKTtcbiAgICAgIGlmIChmdW5jWzBdID09PSBJbnRlcnByZXRlci5TQ09QRV9SRUZFUkVOQ0UpIHtcbiAgICAgICAgLy8gKEdsb2JhbGx5IG9yIGxvY2FsbHkpIG5hbWVkIGZ1bmN0aW9uLiAgSXMgaXQgbmFtZWQgJ2V2YWwnP1xuICAgICAgICBzdGF0ZS5kaXJlY3RFdmFsXyA9IChmdW5jWzFdID09PSAnZXZhbCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTWV0aG9kIGZ1bmN0aW9uLCAndGhpcycgaXMgb2JqZWN0IChpZ25vcmVkIGlmIGludm9rZWQgYXMgJ25ldycpLlxuICAgICAgICBzdGF0ZS5mdW5jVGhpc18gPSBmdW5jWzBdO1xuICAgICAgfVxuICAgICAgZnVuYyA9IHN0YXRlLmZ1bmNfO1xuICAgICAgaWYgKGZ1bmMgJiYgdHlwZW9mIGZ1bmMgPT09ICdvYmplY3QnICYmIGZ1bmMuaXNHZXR0ZXIpIHtcbiAgICAgICAgLy8gQ2xlYXIgdGhlIGdldHRlciBmbGFnIGFuZCBjYWxsIHRoZSBnZXR0ZXIgZnVuY3Rpb24uXG4gICAgICAgIGZ1bmMuaXNHZXR0ZXIgPSBmYWxzZTtcbiAgICAgICAgc3RhdGUuZG9uZUNhbGxlZV8gPSAxO1xuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVHZXR0ZXJfKC8qKiBAdHlwZSB7IUludGVycHJldGVyLk9iamVjdH0gKi8gKGZ1bmMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQWxyZWFkeSBldmFsdWF0ZWQgZnVuY3Rpb246IChmdW5jdGlvbigpey4uLn0pKCk7XG4gICAgICBzdGF0ZS5mdW5jXyA9IGZ1bmM7XG4gICAgfVxuICAgIHN0YXRlLmFyZ3VtZW50c18gPSBbXTtcbiAgICBzdGF0ZS5uXyA9IDA7XG4gIH1cbiAgdmFyIGZ1bmMgPSBzdGF0ZS5mdW5jXztcbiAgaWYgKCFzdGF0ZS5kb25lQXJnc18pIHtcbiAgICBpZiAoc3RhdGUubl8gIT09IDApIHtcbiAgICAgIHN0YXRlLmFyZ3VtZW50c18ucHVzaChzdGF0ZS52YWx1ZSk7XG4gICAgfVxuICAgIGlmIChub2RlWydhcmd1bWVudHMnXVtzdGF0ZS5uX10pIHtcbiAgICAgIHJldHVybiBuZXcgSW50ZXJwcmV0ZXIuU3RhdGUobm9kZVsnYXJndW1lbnRzJ11bc3RhdGUubl8rK10sIHN0YXRlLnNjb3BlKTtcbiAgICB9XG4gICAgLy8gRGV0ZXJtaW5lIHZhbHVlIG9mICd0aGlzJyBpbiBmdW5jdGlvbi5cbiAgICBpZiAobm9kZVsndHlwZSddID09PSAnTmV3RXhwcmVzc2lvbicpIHtcbiAgICAgIGlmIChmdW5jLmlsbGVnYWxDb25zdHJ1Y3Rvcikge1xuICAgICAgICAvLyBJbGxlZ2FsOiBuZXcgZXNjYXBlKCk7XG4gICAgICAgIHRoaXMudGhyb3dFeGNlcHRpb24odGhpcy5UWVBFX0VSUk9SLCBmdW5jICsgJyBpcyBub3QgYSBjb25zdHJ1Y3RvcicpO1xuICAgICAgfVxuICAgICAgLy8gQ29uc3RydWN0b3IsICd0aGlzJyBpcyBuZXcgb2JqZWN0LlxuICAgICAgdmFyIHByb3RvID0gZnVuYy5wcm9wZXJ0aWVzWydwcm90b3R5cGUnXTtcbiAgICAgIGlmICh0eXBlb2YgcHJvdG8gIT09ICdvYmplY3QnIHx8IHByb3RvID09PSBudWxsKSB7XG4gICAgICAgIC8vIE5vbi1vYmplY3QgcHJvdG90eXBlcyBkZWZhdWx0IHRvIE9iamVjdC5wcm90b3R5cGUuXG4gICAgICAgIHByb3RvID0gdGhpcy5PQkpFQ1RfUFJPVE87XG4gICAgICB9XG4gICAgICBzdGF0ZS5mdW5jVGhpc18gPSB0aGlzLmNyZWF0ZU9iamVjdFByb3RvKHByb3RvKTtcbiAgICAgIHN0YXRlLmlzQ29uc3RydWN0b3IgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoc3RhdGUuZnVuY1RoaXNfID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEdsb2JhbCBmdW5jdGlvbiwgJ3RoaXMnIGlzIGdsb2JhbCBvYmplY3QgKG9yICd1bmRlZmluZWQnIGlmIHN0cmljdCkuXG4gICAgICBzdGF0ZS5mdW5jVGhpc18gPSBzdGF0ZS5zY29wZS5zdHJpY3QgPyB1bmRlZmluZWQgOiB0aGlzLmdsb2JhbDtcbiAgICB9XG4gICAgc3RhdGUuZG9uZUFyZ3NfID0gdHJ1ZTtcbiAgfVxuICBpZiAoIXN0YXRlLmRvbmVFeGVjXykge1xuICAgIHN0YXRlLmRvbmVFeGVjXyA9IHRydWU7XG4gICAgaWYgKCFmdW5jIHx8ICFmdW5jLmlzT2JqZWN0KSB7XG4gICAgICB0aGlzLnRocm93RXhjZXB0aW9uKHRoaXMuVFlQRV9FUlJPUiwgZnVuYyArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcbiAgICB9XG4gICAgdmFyIGZ1bmNOb2RlID0gZnVuYy5ub2RlO1xuICAgIGlmIChmdW5jTm9kZSkge1xuICAgICAgdmFyIHNjb3BlID0gdGhpcy5jcmVhdGVTY29wZShmdW5jTm9kZVsnYm9keSddLCBmdW5jLnBhcmVudFNjb3BlKTtcbiAgICAgIC8vIEFkZCBhbGwgYXJndW1lbnRzLlxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmdW5jTm9kZVsncGFyYW1zJ10ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBhcmFtTmFtZSA9IGZ1bmNOb2RlWydwYXJhbXMnXVtpXVsnbmFtZSddO1xuICAgICAgICB2YXIgcGFyYW1WYWx1ZSA9IHN0YXRlLmFyZ3VtZW50c18ubGVuZ3RoID4gaSA/IHN0YXRlLmFyZ3VtZW50c19baV0gOlxuICAgICAgICAgICAgdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLnNldFByb3BlcnR5KHNjb3BlLCBwYXJhbU5hbWUsIHBhcmFtVmFsdWUpO1xuICAgICAgfVxuICAgICAgLy8gQnVpbGQgYXJndW1lbnRzIHZhcmlhYmxlLlxuICAgICAgdmFyIGFyZ3NMaXN0ID0gdGhpcy5jcmVhdGVPYmplY3RQcm90byh0aGlzLkFSUkFZX1BST1RPKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGUuYXJndW1lbnRzXy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLnNldFByb3BlcnR5KGFyZ3NMaXN0LCBpLCBzdGF0ZS5hcmd1bWVudHNfW2ldKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0UHJvcGVydHkoc2NvcGUsICdhcmd1bWVudHMnLCBhcmdzTGlzdCk7XG4gICAgICAvLyBBZGQgdGhlIGZ1bmN0aW9uJ3MgbmFtZSAodmFyIHggPSBmdW5jdGlvbiBmb28oKXt9OylcbiAgICAgIHZhciBuYW1lID0gZnVuY05vZGVbJ2lkJ10gJiYgZnVuY05vZGVbJ2lkJ11bJ25hbWUnXTtcbiAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgIHRoaXMuc2V0UHJvcGVydHkoc2NvcGUsIG5hbWUsIGZ1bmMpO1xuICAgICAgfVxuICAgICAgdGhpcy5zZXRQcm9wZXJ0eShzY29wZSwgJ3RoaXMnLCBzdGF0ZS5mdW5jVGhpc18sXG4gICAgICAgICAgICAgICAgICAgICAgIEludGVycHJldGVyLlJFQURPTkxZX0RFU0NSSVBUT1IpO1xuICAgICAgc3RhdGUudmFsdWUgPSB1bmRlZmluZWQ7ICAvLyBEZWZhdWx0IHZhbHVlIGlmIG5vIGV4cGxpY2l0IHJldHVybi5cbiAgICAgIHJldHVybiBuZXcgSW50ZXJwcmV0ZXIuU3RhdGUoZnVuY05vZGVbJ2JvZHknXSwgc2NvcGUpO1xuICAgIH0gZWxzZSBpZiAoZnVuYy5ldmFsKSB7XG4gICAgICB2YXIgY29kZSA9IHN0YXRlLmFyZ3VtZW50c19bMF07XG4gICAgICBpZiAodHlwZW9mIGNvZGUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIC8vIEpTIGRvZXMgbm90IHBhcnNlIFN0cmluZyBvYmplY3RzOlxuICAgICAgICAvLyBldmFsKG5ldyBTdHJpbmcoJzEgKyAxJykpIC0+ICcxICsgMSdcbiAgICAgICAgc3RhdGUudmFsdWUgPSBjb2RlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgYXN0ID0gYWNvcm4ucGFyc2UoU3RyaW5nKGNvZGUpLCBJbnRlcnByZXRlci5QQVJTRV9PUFRJT05TKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIC8vIEFjb3JuIHRocmV3IGEgU3ludGF4RXJyb3IuICBSZXRocm93IGFzIGEgdHJhcHBhYmxlIGVycm9yLlxuICAgICAgICAgIHRoaXMudGhyb3dFeGNlcHRpb24odGhpcy5TWU5UQVhfRVJST1IsICdJbnZhbGlkIGNvZGU6ICcgKyBlLm1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBldmFsTm9kZSA9IG5ldyB0aGlzLm5vZGVDb25zdHJ1Y3Rvcih7b3B0aW9uczp7fX0pO1xuICAgICAgICBldmFsTm9kZVsndHlwZSddID0gJ0V2YWxQcm9ncmFtXyc7XG4gICAgICAgIGV2YWxOb2RlWydib2R5J10gPSBhc3RbJ2JvZHknXTtcbiAgICAgICAgdGhpcy5zdHJpcExvY2F0aW9uc18oZXZhbE5vZGUsIG5vZGVbJ3N0YXJ0J10sIG5vZGVbJ2VuZCddKTtcbiAgICAgICAgLy8gQ3JlYXRlIG5ldyBzY29wZSBhbmQgdXBkYXRlIGl0IHdpdGggZGVmaW5pdGlvbnMgaW4gZXZhbCgpLlxuICAgICAgICB2YXIgc2NvcGUgPSBzdGF0ZS5kaXJlY3RFdmFsXyA/IHN0YXRlLnNjb3BlIDogdGhpcy5nbG9iYWw7XG4gICAgICAgIGlmIChzY29wZS5zdHJpY3QpIHtcbiAgICAgICAgICAvLyBTdHJpY3QgbW9kZSBnZXQgaXRzIG93biBzY29wZSBpbiBldmFsLlxuICAgICAgICAgIHNjb3BlID0gdGhpcy5jcmVhdGVTY29wZShhc3QsIHNjb3BlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBOb24tc3RyaWN0IG1vZGUgcG9sbHV0ZXMgdGhlIGN1cnJlbnQgc2NvcGUuXG4gICAgICAgICAgdGhpcy5wb3B1bGF0ZVNjb3BlXyhhc3QsIHNjb3BlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnZhbHVlID0gdW5kZWZpbmVkOyAgLy8gRGVmYXVsdCB2YWx1ZSBpZiBubyBjb2RlLlxuICAgICAgICByZXR1cm4gbmV3IEludGVycHJldGVyLlN0YXRlKGV2YWxOb2RlLCBzY29wZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmdW5jLm5hdGl2ZUZ1bmMpIHtcbiAgICAgIHN0YXRlLnZhbHVlID0gZnVuYy5uYXRpdmVGdW5jLmFwcGx5KHN0YXRlLmZ1bmNUaGlzXywgc3RhdGUuYXJndW1lbnRzXyk7XG4gICAgfSBlbHNlIGlmIChmdW5jLmFzeW5jRnVuYykge1xuICAgICAgdmFyIHRoaXNJbnRlcnByZXRlciA9IHRoaXM7XG4gICAgICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBzdGF0ZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzSW50ZXJwcmV0ZXIucGF1c2VkXyA9IGZhbHNlO1xuICAgICAgfTtcbiAgICAgIC8vIEZvcmNlIHRoZSBhcmd1bWVudCBsZW5ndGhzIHRvIG1hdGNoLCB0aGVuIGFwcGVuZCB0aGUgY2FsbGJhY2suXG4gICAgICB2YXIgYXJnTGVuZ3RoID0gZnVuYy5hc3luY0Z1bmMubGVuZ3RoIC0gMTtcbiAgICAgIHZhciBhcmdzV2l0aENhbGxiYWNrID0gc3RhdGUuYXJndW1lbnRzXy5jb25jYXQoXG4gICAgICAgICAgbmV3IEFycmF5KGFyZ0xlbmd0aCkpLnNsaWNlKDAsIGFyZ0xlbmd0aCk7XG4gICAgICBhcmdzV2l0aENhbGxiYWNrLnB1c2goY2FsbGJhY2spO1xuICAgICAgdGhpcy5wYXVzZWRfID0gdHJ1ZTtcbiAgICAgIGZ1bmMuYXN5bmNGdW5jLmFwcGx5KHN0YXRlLmZ1bmNUaGlzXywgYXJnc1dpdGhDYWxsYmFjayk7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIC8qIEEgY2hpbGQgb2YgYSBmdW5jdGlvbiBpcyBhIGZ1bmN0aW9uIGJ1dCBpcyBub3QgY2FsbGFibGUuICBGb3IgZXhhbXBsZTpcbiAgICAgIHZhciBGID0gZnVuY3Rpb24oKSB7fTtcbiAgICAgIEYucHJvdG90eXBlID0gZXNjYXBlO1xuICAgICAgdmFyIGYgPSBuZXcgRigpO1xuICAgICAgZigpO1xuICAgICAgKi9cbiAgICAgIHRoaXMudGhyb3dFeGNlcHRpb24odGhpcy5UWVBFX0VSUk9SLCBmdW5jLmNsYXNzICsgJyBpcyBub3QgYSBmdW5jdGlvbicpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBFeGVjdXRpb24gY29tcGxldGUuICBQdXQgdGhlIHJldHVybiB2YWx1ZSBvbiB0aGUgc3RhY2suXG4gICAgc3RhY2sucG9wKCk7XG4gICAgaWYgKHN0YXRlLmlzQ29uc3RydWN0b3IgJiYgdHlwZW9mIHN0YXRlLnZhbHVlICE9PSAnb2JqZWN0Jykge1xuICAgICAgc3RhY2tbc3RhY2subGVuZ3RoIC0gMV0udmFsdWUgPSBzdGF0ZS5mdW5jVGhpc187XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdLnZhbHVlID0gc3RhdGUudmFsdWU7XG4gICAgfVxuICB9XG59O1xuXG5JbnRlcnByZXRlci5wcm90b3R5cGVbJ3N0ZXBDYXRjaENsYXVzZSddID0gZnVuY3Rpb24oc3RhY2ssIHN0YXRlLCBub2RlKSB7XG4gIGlmICghc3RhdGUuZG9uZV8pIHtcbiAgICBzdGF0ZS5kb25lXyA9IHRydWU7XG4gICAgLy8gQ3JlYXRlIGFuIGVtcHR5IHNjb3BlLlxuICAgIHZhciBzY29wZSA9IHRoaXMuY3JlYXRlU3BlY2lhbFNjb3BlKHN0YXRlLnNjb3BlKTtcbiAgICAvLyBBZGQgdGhlIGFyZ3VtZW50LlxuICAgIHRoaXMuc2V0UHJvcGVydHkoc2NvcGUsIG5vZGVbJ3BhcmFtJ11bJ25hbWUnXSwgc3RhdGUudGhyb3dWYWx1ZSk7XG4gICAgLy8gRXhlY3V0ZSBjYXRjaCBjbGF1c2UuXG4gICAgcmV0dXJuIG5ldyBJbnRlcnByZXRlci5TdGF0ZShub2RlWydib2R5J10sIHNjb3BlKTtcbiAgfSBlbHNlIHtcbiAgICBzdGFjay5wb3AoKTtcbiAgfVxufTtcblxuSW50ZXJwcmV0ZXIucHJvdG90eXBlWydzdGVwQ29uZGl0aW9uYWxFeHByZXNzaW9uJ10gPVxuICAgIGZ1bmN0aW9uKHN0YWNrLCBzdGF0ZSwgbm9kZSkge1xuICB2YXIgbW9kZSA9IHN0YXRlLm1vZGVfIHx8IDA7XG4gIGlmIChtb2RlID09PSAwKSB7XG4gICAgc3RhdGUubW9kZV8gPSAxO1xuICAgIHJldHVybiBuZXcgSW50ZXJwcmV0ZXIuU3RhdGUobm9kZVsndGVzdCddLCBzdGF0ZS5zY29wZSk7XG4gIH1cbiAgaWYgKG1vZGUgPT09IDEpIHtcbiAgICBzdGF0ZS5tb2RlXyA9IDI7XG4gICAgdmFyIHZhbHVlID0gQm9vbGVhbihzdGF0ZS52YWx1ZSk7XG4gICAgaWYgKHZhbHVlICYmIG5vZGVbJ2NvbnNlcXVlbnQnXSkge1xuICAgICAgLy8gRXhlY3V0ZSAnaWYnIGJsb2NrLlxuICAgICAgcmV0dXJuIG5ldyBJbnRlcnByZXRlci5TdGF0ZShub2RlWydjb25zZXF1ZW50J10sIHN0YXRlLnNjb3BlKTtcbiAgICB9IGVsc2UgaWYgKCF2YWx1ZSAmJiBub2RlWydhbHRlcm5hdGUnXSkge1xuICAgICAgLy8gRXhlY3V0ZSAnZWxzZScgYmxvY2suXG4gICAgICByZXR1cm4gbmV3IEludGVycHJldGVyLlN0YXRlKG5vZGVbJ2FsdGVybmF0ZSddLCBzdGF0ZS5zY29wZSk7XG4gICAgfVxuICAgIC8vIGV2YWwoJzE7aWYoZmFsc2UpezJ9JykgLT4gdW5kZWZpbmVkXG4gICAgdGhpcy52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgfVxuICBzdGFjay5wb3AoKTtcbiAgaWYgKG5vZGVbJ3R5cGUnXSA9PT0gJ0NvbmRpdGlvbmFsRXhwcmVzc2lvbicpIHtcbiAgICBzdGFja1tzdGFjay5sZW5ndGggLSAxXS52YWx1ZSA9IHN0YXRlLnZhbHVlO1xuICB9XG59O1xuXG5JbnRlcnByZXRlci5wcm90b3R5cGVbJ3N0ZXBDb250aW51ZVN0YXRlbWVudCddID0gZnVuY3Rpb24oc3RhY2ssIHN0YXRlLCBub2RlKSB7XG4gIHZhciBsYWJlbCA9IG5vZGVbJ2xhYmVsJ10gJiYgbm9kZVsnbGFiZWwnXVsnbmFtZSddO1xuICB0aGlzLnVud2luZChJbnRlcnByZXRlci5Db21wbGV0aW9uLkNPTlRJTlVFLCB1bmRlZmluZWQsIGxhYmVsKTtcbn07XG5cbkludGVycHJldGVyLnByb3RvdHlwZVsnc3RlcERlYnVnZ2VyU3RhdGVtZW50J10gPSBmdW5jdGlvbihzdGFjaywgc3RhdGUsIG5vZGUpIHtcbiAgLy8gRG8gbm90aGluZy4gIE1heSBiZSBvdmVycmlkZGVuIGJ5IGRldmVsb3BlcnMuXG4gIHN0YWNrLnBvcCgpO1xufTtcblxuSW50ZXJwcmV0ZXIucHJvdG90eXBlWydzdGVwRG9XaGlsZVN0YXRlbWVudCddID0gZnVuY3Rpb24oc3RhY2ssIHN0YXRlLCBub2RlKSB7XG4gIGlmIChub2RlWyd0eXBlJ10gPT09ICdEb1doaWxlU3RhdGVtZW50JyAmJiBzdGF0ZS50ZXN0XyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gRmlyc3QgaXRlcmF0aW9uIG9mIGRvL3doaWxlIGV4ZWN1dGVzIHdpdGhvdXQgY2hlY2tpbmcgdGVzdC5cbiAgICBzdGF0ZS52YWx1ZSA9IHRydWU7XG4gICAgc3RhdGUudGVzdF8gPSB0cnVlO1xuICB9XG4gIGlmICghc3RhdGUudGVzdF8pIHtcbiAgICBzdGF0ZS50ZXN0XyA9IHRydWU7XG4gICAgcmV0dXJuIG5ldyBJbnRlcnByZXRlci5TdGF0ZShub2RlWyd0ZXN0J10sIHN0YXRlLnNjb3BlKTtcbiAgfVxuICBpZiAoIXN0YXRlLnZhbHVlKSB7ICAvLyBEb25lLCBleGl0IGxvb3AuXG4gICAgc3RhY2sucG9wKCk7XG4gIH0gZWxzZSBpZiAobm9kZVsnYm9keSddKSB7ICAvLyBFeGVjdXRlIHRoZSBib2R5LlxuICAgIHN0YXRlLnRlc3RfID0gZmFsc2U7XG4gICAgc3RhdGUuaXNMb29wID0gdHJ1ZTtcbiAgICByZXR1cm4gbmV3IEludGVycHJldGVyLlN0YXRlKG5vZGVbJ2JvZHknXSwgc3RhdGUuc2NvcGUpO1xuICB9XG59O1xuXG5JbnRlcnByZXRlci5wcm90b3R5cGVbJ3N0ZXBFbXB0eVN0YXRlbWVudCddID0gZnVuY3Rpb24oc3RhY2ssIHN0YXRlLCBub2RlKSB7XG4gIHN0YWNrLnBvcCgpO1xufTtcblxuSW50ZXJwcmV0ZXIucHJvdG90eXBlWydzdGVwRXZhbFByb2dyYW1fJ10gPSBmdW5jdGlvbihzdGFjaywgc3RhdGUsIG5vZGUpIHtcbiAgdmFyIG4gPSBzdGF0ZS5uXyB8fCAwO1xuICB2YXIgZXhwcmVzc2lvbiA9IG5vZGVbJ2JvZHknXVtuXTtcbiAgaWYgKGV4cHJlc3Npb24pIHtcbiAgICBzdGF0ZS5uXyA9IG4gKyAxO1xuICAgIHJldHVybiBuZXcgSW50ZXJwcmV0ZXIuU3RhdGUoZXhwcmVzc2lvbiwgc3RhdGUuc2NvcGUpO1xuICB9XG4gIHN0YWNrLnBvcCgpO1xuICBzdGFja1tzdGFjay5sZW5ndGggLSAxXS52YWx1ZSA9IHRoaXMudmFsdWU7XG59O1xuXG5JbnRlcnByZXRlci5wcm90b3R5cGVbJ3N0ZXBFeHByZXNzaW9uU3RhdGVtZW50J10gPSBmdW5jdGlvbihzdGFjaywgc3RhdGUsIG5vZGUpIHtcbiAgaWYgKCFzdGF0ZS5kb25lXykge1xuICAgIHN0YXRlLmRvbmVfID0gdHJ1ZTtcbiAgICByZXR1cm4gbmV3IEludGVycHJldGVyLlN0YXRlKG5vZGVbJ2V4cHJlc3Npb24nXSwgc3RhdGUuc2NvcGUpO1xuICB9XG4gIHN0YWNrLnBvcCgpO1xuICAvLyBTYXZlIHRoaXMgdmFsdWUgdG8gaW50ZXJwcmV0ZXIudmFsdWUgZm9yIHVzZSBhcyBhIHJldHVybiB2YWx1ZSBpZlxuICAvLyB0aGlzIGNvZGUgaXMgaW5zaWRlIGFuIGV2YWwgZnVuY3Rpb24uXG4gIHRoaXMudmFsdWUgPSBzdGF0ZS52YWx1ZTtcbn07XG5cbkludGVycHJldGVyLnByb3RvdHlwZVsnc3RlcEZvckluU3RhdGVtZW50J10gPSBmdW5jdGlvbihzdGFjaywgc3RhdGUsIG5vZGUpIHtcbiAgLy8gRmlyc3QsIGluaXRpYWxpemUgYSB2YXJpYWJsZSBpZiBleGlzdHMuICBPbmx5IGRvIHNvIG9uY2UsIGV2ZXIuXG4gIGlmICghc3RhdGUuZG9uZUluaXRfKSB7XG4gICAgc3RhdGUuZG9uZUluaXRfID0gdHJ1ZTtcbiAgICBpZiAobm9kZVsnbGVmdCddWydkZWNsYXJhdGlvbnMnXSAmJlxuICAgICAgICBub2RlWydsZWZ0J11bJ2RlY2xhcmF0aW9ucyddWzBdWydpbml0J10pIHtcbiAgICAgIGlmIChzdGF0ZS5zY29wZS5zdHJpY3QpIHtcbiAgICAgICAgdGhpcy50aHJvd0V4Y2VwdGlvbih0aGlzLlNZTlRBWF9FUlJPUixcbiAgICAgICAgICAgICdmb3ItaW4gbG9vcCB2YXJpYWJsZSBkZWNsYXJhdGlvbiBtYXkgbm90IGhhdmUgYW4gaW5pdGlhbGl6ZXIuJyk7XG4gICAgICB9XG4gICAgICAvLyBWYXJpYWJsZSBpbml0aWFsaXphdGlvbjogZm9yICh2YXIgeCA9IDQgaW4geSlcbiAgICAgIHJldHVybiBuZXcgSW50ZXJwcmV0ZXIuU3RhdGUobm9kZVsnbGVmdCddLCBzdGF0ZS5zY29wZSk7XG4gICAgfVxuICB9XG4gIC8vIFNlY29uZCwgbG9vayB1cCB0aGUgb2JqZWN0LiAgT25seSBkbyBzbyBvbmNlLCBldmVyLlxuICBpZiAoIXN0YXRlLmRvbmVPYmplY3RfKSB7XG4gICAgc3RhdGUuZG9uZU9iamVjdF8gPSB0cnVlO1xuICAgIGlmICghc3RhdGUudmFyaWFibGVfKSB7XG4gICAgICBzdGF0ZS52YXJpYWJsZV8gPSBzdGF0ZS52YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBJbnRlcnByZXRlci5TdGF0ZShub2RlWydyaWdodCddLCBzdGF0ZS5zY29wZSk7XG4gIH1cbiAgaWYgKCFzdGF0ZS5pc0xvb3ApIHtcbiAgICAvLyBGaXJzdCBpdGVyYXRpb24uXG4gICAgc3RhdGUuaXNMb29wID0gdHJ1ZTtcbiAgICBzdGF0ZS5vYmplY3RfID0gc3RhdGUudmFsdWU7XG4gICAgc3RhdGUudmlzaXRlZF8gPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB9XG4gIC8vIFRoaXJkLCBmaW5kIHRoZSBwcm9wZXJ0eSBuYW1lIGZvciB0aGlzIGl0ZXJhdGlvbi5cbiAgaWYgKHN0YXRlLm5hbWVfID09PSB1bmRlZmluZWQpIHtcbiAgICBnb3RQcm9wTmFtZTogd2hpbGUgKHRydWUpIHtcbiAgICAgIGlmIChzdGF0ZS5vYmplY3RfICYmIHN0YXRlLm9iamVjdF8uaXNPYmplY3QpIHtcbiAgICAgICAgaWYgKCFzdGF0ZS5wcm9wc18pIHtcbiAgICAgICAgICBzdGF0ZS5wcm9wc18gPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhzdGF0ZS5vYmplY3RfLnByb3BlcnRpZXMpO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgdmFyIHByb3AgPSBzdGF0ZS5wcm9wc18uc2hpZnQoKTtcbiAgICAgICAgICBpZiAocHJvcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBicmVhazsgIC8vIFJlYWNoZWQgZW5kIG9mIHRoaXMgb2JqZWN0J3MgcHJvcGVydGllcy5cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc3RhdGUub2JqZWN0Xy5wcm9wZXJ0aWVzLFxuICAgICAgICAgICAgICAgIHByb3ApKSB7XG4gICAgICAgICAgICBjb250aW51ZTsgIC8vIFByb3BlcnR5IGhhcyBiZWVuIGRlbGV0ZWQgaW4gdGhlIGxvb3AuXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzdGF0ZS52aXNpdGVkX1twcm9wXSkge1xuICAgICAgICAgICAgY29udGludWU7ICAvLyBBbHJlYWR5IHNlZW4gdGhpcyBwcm9wZXJ0eSBvbiBhIGNoaWxkLlxuICAgICAgICAgIH1cbiAgICAgICAgICBzdGF0ZS52aXNpdGVkX1twcm9wXSA9IHRydWU7XG4gICAgICAgICAgaWYgKCFPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwoXG4gICAgICAgICAgICAgICAgc3RhdGUub2JqZWN0Xy5wcm9wZXJ0aWVzLCBwcm9wKSkge1xuICAgICAgICAgICAgY29udGludWU7ICAvLyBTa2lwIG5vbi1lbnVtZXJhYmxlIHByb3BlcnR5LlxuICAgICAgICAgIH1cbiAgICAgICAgICBzdGF0ZS5uYW1lXyA9IHByb3A7XG4gICAgICAgICAgYnJlYWsgZ290UHJvcE5hbWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUub2JqZWN0XyAhPT0gbnVsbCAmJiBzdGF0ZS5vYmplY3RfICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gUHJpbWl0aXZlIHZhbHVlIChvdGhlciB0aGFuIG51bGwgb3IgdW5kZWZpbmVkKS5cbiAgICAgICAgaWYgKCFzdGF0ZS5wcm9wc18pIHtcbiAgICAgICAgICBzdGF0ZS5wcm9wc18gPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhzdGF0ZS5vYmplY3RfKTtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgIHZhciBwcm9wID0gc3RhdGUucHJvcHNfLnNoaWZ0KCk7XG4gICAgICAgICAgaWYgKHByb3AgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgYnJlYWs7ICAvLyBSZWFjaGVkIGVuZCBvZiB0aGlzIHZhbHVlJ3MgcHJvcGVydGllcy5cbiAgICAgICAgICB9XG4gICAgICAgICAgc3RhdGUudmlzaXRlZF9bcHJvcF0gPSB0cnVlO1xuICAgICAgICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKFxuICAgICAgICAgICAgICAgIHN0YXRlLm9iamVjdF8sIHByb3ApKSB7XG4gICAgICAgICAgICBjb250aW51ZTsgIC8vIFNraXAgbm9uLWVudW1lcmFibGUgcHJvcGVydHkuXG4gICAgICAgICAgfVxuICAgICAgICAgIHN0YXRlLm5hbWVfID0gcHJvcDtcbiAgICAgICAgICBicmVhayBnb3RQcm9wTmFtZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc3RhdGUub2JqZWN0XyA9IHRoaXMuZ2V0UHJvdG90eXBlKHN0YXRlLm9iamVjdF8pO1xuICAgICAgc3RhdGUucHJvcHNfID0gbnVsbDtcbiAgICAgIGlmIChzdGF0ZS5vYmplY3RfID09PSBudWxsKSB7XG4gICAgICAgIC8vIERvbmUsIGV4aXQgbG9vcC5cbiAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gRm91cnRoLCBmaW5kIHRoZSB2YXJpYWJsZVxuICBpZiAoIXN0YXRlLmRvbmVWYXJpYWJsZV8pIHtcbiAgICBzdGF0ZS5kb25lVmFyaWFibGVfID0gdHJ1ZTtcbiAgICB2YXIgbGVmdCA9IG5vZGVbJ2xlZnQnXTtcbiAgICBpZiAobGVmdFsndHlwZSddID09PSAnVmFyaWFibGVEZWNsYXJhdGlvbicpIHtcbiAgICAgIC8vIElubGluZSB2YXJpYWJsZSBkZWNsYXJhdGlvbjogZm9yICh2YXIgeCBpbiB5KVxuICAgICAgc3RhdGUudmFyaWFibGVfID1cbiAgICAgICAgICBbSW50ZXJwcmV0ZXIuU0NPUEVfUkVGRVJFTkNFLCBsZWZ0WydkZWNsYXJhdGlvbnMnXVswXVsnaWQnXVsnbmFtZSddXTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQXJiaXRyYXJ5IGxlZnQgc2lkZTogZm9yIChmb28oKS5iYXIgaW4geSlcbiAgICAgIHN0YXRlLnZhcmlhYmxlXyA9IG51bGw7XG4gICAgICB2YXIgbmV4dFN0YXRlID0gbmV3IEludGVycHJldGVyLlN0YXRlKGxlZnQsIHN0YXRlLnNjb3BlKTtcbiAgICAgIG5leHRTdGF0ZS5jb21wb25lbnRzID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXh0U3RhdGU7XG4gICAgfVxuICB9XG4gIGlmICghc3RhdGUudmFyaWFibGVfKSB7XG4gICAgc3RhdGUudmFyaWFibGVfID0gc3RhdGUudmFsdWU7XG4gIH1cbiAgLy8gRmlmdGgsIHNldCB0aGUgdmFyaWFibGUuXG4gIGlmICghc3RhdGUuZG9uZVNldHRlcl8pIHtcbiAgICBzdGF0ZS5kb25lU2V0dGVyXyA9IHRydWU7XG4gICAgdmFyIHZhbHVlID0gc3RhdGUubmFtZV87XG4gICAgdmFyIHNldHRlciA9IHRoaXMuc2V0VmFsdWUoc3RhdGUudmFyaWFibGVfLCB2YWx1ZSk7XG4gICAgaWYgKHNldHRlcikge1xuICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlU2V0dGVyXyhzZXR0ZXIsIHN0YXRlLnZhcmlhYmxlXywgdmFsdWUpO1xuICAgIH1cbiAgfVxuICAvLyBOZXh0IHN0ZXAgd2lsbCBiZSBzdGVwIHRocmVlLlxuICBzdGF0ZS5uYW1lXyA9IHVuZGVmaW5lZDtcbiAgLy8gUmVldmFsdWF0ZSB0aGUgdmFyaWFibGUgc2luY2UgaXQgY291bGQgYmUgYSBzZXR0ZXIgb24gdGhlIGdsb2JhbCBvYmplY3QuXG4gIHN0YXRlLmRvbmVWYXJpYWJsZV8gPSBmYWxzZTtcbiAgc3RhdGUuZG9uZVNldHRlcl8gPSBmYWxzZTtcbiAgLy8gU2l4dGggYW5kIGZpbmFsbHksIGV4ZWN1dGUgdGhlIGJvZHkgaWYgdGhlcmUgd2FzIG9uZS4gIHRoaXMuXG4gIGlmIChub2RlWydib2R5J10pIHtcbiAgICByZXR1cm4gbmV3IEludGVycHJldGVyLlN0YXRlKG5vZGVbJ2JvZHknXSwgc3RhdGUuc2NvcGUpO1xuICB9XG59O1xuXG5JbnRlcnByZXRlci5wcm90b3R5cGVbJ3N0ZXBGb3JTdGF0ZW1lbnQnXSA9IGZ1bmN0aW9uKHN0YWNrLCBzdGF0ZSwgbm9kZSkge1xuICB2YXIgbW9kZSA9IHN0YXRlLm1vZGVfIHx8IDA7XG4gIGlmIChtb2RlID09PSAwKSB7XG4gICAgc3RhdGUubW9kZV8gPSAxO1xuICAgIGlmIChub2RlWydpbml0J10pIHtcbiAgICAgIHJldHVybiBuZXcgSW50ZXJwcmV0ZXIuU3RhdGUobm9kZVsnaW5pdCddLCBzdGF0ZS5zY29wZSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKG1vZGUgPT09IDEpIHtcbiAgICBzdGF0ZS5tb2RlXyA9IDI7XG4gICAgaWYgKG5vZGVbJ3Rlc3QnXSkge1xuICAgICAgcmV0dXJuIG5ldyBJbnRlcnByZXRlci5TdGF0ZShub2RlWyd0ZXN0J10sIHN0YXRlLnNjb3BlKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAobW9kZSA9PT0gMikge1xuICAgIHN0YXRlLm1vZGVfID0gMztcbiAgICBpZiAobm9kZVsndGVzdCddICYmICFzdGF0ZS52YWx1ZSkge1xuICAgICAgLy8gRG9uZSwgZXhpdCBsb29wLlxuICAgICAgc3RhY2sucG9wKCk7XG4gICAgfSBlbHNlIHsgIC8vIEV4ZWN1dGUgdGhlIGJvZHkuXG4gICAgICBzdGF0ZS5pc0xvb3AgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5ldyBJbnRlcnByZXRlci5TdGF0ZShub2RlWydib2R5J10sIHN0YXRlLnNjb3BlKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAobW9kZSA9PT0gMykge1xuICAgIHN0YXRlLm1vZGVfID0gMTtcbiAgICBpZiAobm9kZVsndXBkYXRlJ10pIHtcbiAgICAgIHJldHVybiBuZXcgSW50ZXJwcmV0ZXIuU3RhdGUobm9kZVsndXBkYXRlJ10sIHN0YXRlLnNjb3BlKTtcbiAgICB9XG4gIH1cbn07XG5cbkludGVycHJldGVyLnByb3RvdHlwZVsnc3RlcEZ1bmN0aW9uRGVjbGFyYXRpb24nXSA9XG4gICAgZnVuY3Rpb24oc3RhY2ssIHN0YXRlLCBub2RlKSB7XG4gIC8vIFRoaXMgd2FzIGZvdW5kIGFuZCBoYW5kbGVkIHdoZW4gdGhlIHNjb3BlIHdhcyBwb3B1bGF0ZWQuXG4gIHN0YWNrLnBvcCgpO1xufTtcblxuSW50ZXJwcmV0ZXIucHJvdG90eXBlWydzdGVwRnVuY3Rpb25FeHByZXNzaW9uJ10gPSBmdW5jdGlvbihzdGFjaywgc3RhdGUsIG5vZGUpIHtcbiAgc3RhY2sucG9wKCk7XG4gIHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdLnZhbHVlID0gdGhpcy5jcmVhdGVGdW5jdGlvbihub2RlLCBzdGF0ZS5zY29wZSk7XG59O1xuXG5JbnRlcnByZXRlci5wcm90b3R5cGVbJ3N0ZXBJZGVudGlmaWVyJ10gPSBmdW5jdGlvbihzdGFjaywgc3RhdGUsIG5vZGUpIHtcbiAgc3RhY2sucG9wKCk7XG4gIGlmIChzdGF0ZS5jb21wb25lbnRzKSB7XG4gICAgc3RhY2tbc3RhY2subGVuZ3RoIC0gMV0udmFsdWUgPSBbSW50ZXJwcmV0ZXIuU0NPUEVfUkVGRVJFTkNFLCBub2RlWyduYW1lJ11dO1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgdmFsdWUgPSB0aGlzLmdldFZhbHVlRnJvbVNjb3BlKG5vZGVbJ25hbWUnXSk7XG4gIC8vIEFuIGlkZW50aWZpZXIgY291bGQgYmUgYSBnZXR0ZXIgaWYgaXQncyBhIHByb3BlcnR5IG9uIHRoZSBnbG9iYWwgb2JqZWN0LlxuICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZS5pc0dldHRlcikge1xuICAgIC8vIENsZWFyIHRoZSBnZXR0ZXIgZmxhZyBhbmQgY2FsbCB0aGUgZ2V0dGVyIGZ1bmN0aW9uLlxuICAgIHZhbHVlLmlzR2V0dGVyID0gZmFsc2U7XG4gICAgdmFyIHNjb3BlID0gc3RhdGUuc2NvcGU7XG4gICAgd2hpbGUgKCF0aGlzLmhhc1Byb3BlcnR5KHNjb3BlLCBub2RlWyduYW1lJ10pKSB7XG4gICAgICBzY29wZSA9IHNjb3BlLnBhcmVudFNjb3BlO1xuICAgIH1cbiAgICB2YXIgZnVuYyA9IC8qKiBAdHlwZSB7IUludGVycHJldGVyLk9iamVjdH0gKi8gKHZhbHVlKTtcbiAgICByZXR1cm4gdGhpcy5jcmVhdGVHZXR0ZXJfKGZ1bmMsIHRoaXMuZ2xvYmFsKTtcbiAgfVxuICBzdGFja1tzdGFjay5sZW5ndGggLSAxXS52YWx1ZSA9IHZhbHVlO1xufTtcblxuSW50ZXJwcmV0ZXIucHJvdG90eXBlWydzdGVwSWZTdGF0ZW1lbnQnXSA9XG4gICAgSW50ZXJwcmV0ZXIucHJvdG90eXBlWydzdGVwQ29uZGl0aW9uYWxFeHByZXNzaW9uJ107XG5cbkludGVycHJldGVyLnByb3RvdHlwZVsnc3RlcExhYmVsZWRTdGF0ZW1lbnQnXSA9IGZ1bmN0aW9uKHN0YWNrLCBzdGF0ZSwgbm9kZSkge1xuICAvLyBObyBuZWVkIHRvIGhpdCB0aGlzIG5vZGUgYWdhaW4gb24gdGhlIHdheSBiYWNrIHVwIHRoZSBzdGFjay5cbiAgc3RhY2sucG9wKCk7XG4gIC8vIE5vdGUgdGhhdCBhIHN0YXRlbWVudCBtaWdodCBoYXZlIG11bHRpcGxlIGxhYmVscy5cbiAgdmFyIGxhYmVscyA9IHN0YXRlLmxhYmVscyB8fCBbXTtcbiAgbGFiZWxzLnB1c2gobm9kZVsnbGFiZWwnXVsnbmFtZSddKTtcbiAgdmFyIG5leHRTdGF0ZSA9IG5ldyBJbnRlcnByZXRlci5TdGF0ZShub2RlWydib2R5J10sIHN0YXRlLnNjb3BlKTtcbiAgbmV4dFN0YXRlLmxhYmVscyA9IGxhYmVscztcbiAgcmV0dXJuIG5leHRTdGF0ZTtcbn07XG5cbkludGVycHJldGVyLnByb3RvdHlwZVsnc3RlcExpdGVyYWwnXSA9IGZ1bmN0aW9uKHN0YWNrLCBzdGF0ZSwgbm9kZSkge1xuICBzdGFjay5wb3AoKTtcbiAgdmFyIHZhbHVlID0gbm9kZVsndmFsdWUnXTtcbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgdmFyIHBzZXVkb1JlZ2V4cCA9IHRoaXMuY3JlYXRlT2JqZWN0UHJvdG8odGhpcy5SRUdFWFBfUFJPVE8pO1xuICAgIHRoaXMucG9wdWxhdGVSZWdFeHAocHNldWRvUmVnZXhwLCB2YWx1ZSk7XG4gICAgdmFsdWUgPSBwc2V1ZG9SZWdleHA7XG4gIH1cbiAgc3RhY2tbc3RhY2subGVuZ3RoIC0gMV0udmFsdWUgPSB2YWx1ZTtcbn07XG5cbkludGVycHJldGVyLnByb3RvdHlwZVsnc3RlcExvZ2ljYWxFeHByZXNzaW9uJ10gPSBmdW5jdGlvbihzdGFjaywgc3RhdGUsIG5vZGUpIHtcbiAgaWYgKG5vZGVbJ29wZXJhdG9yJ10gIT09ICcmJicgJiYgbm9kZVsnb3BlcmF0b3InXSAhPT0gJ3x8Jykge1xuICAgIHRocm93IFN5bnRheEVycm9yKCdVbmtub3duIGxvZ2ljYWwgb3BlcmF0b3I6ICcgKyBub2RlWydvcGVyYXRvciddKTtcbiAgfVxuICBpZiAoIXN0YXRlLmRvbmVMZWZ0Xykge1xuICAgIHN0YXRlLmRvbmVMZWZ0XyA9IHRydWU7XG4gICAgcmV0dXJuIG5ldyBJbnRlcnByZXRlci5TdGF0ZShub2RlWydsZWZ0J10sIHN0YXRlLnNjb3BlKTtcbiAgfVxuICBpZiAoIXN0YXRlLmRvbmVSaWdodF8pIHtcbiAgICBpZiAoKG5vZGVbJ29wZXJhdG9yJ10gPT09ICcmJicgJiYgIXN0YXRlLnZhbHVlKSB8fFxuICAgICAgICAobm9kZVsnb3BlcmF0b3InXSA9PT0gJ3x8JyAmJiBzdGF0ZS52YWx1ZSkpIHtcbiAgICAgIC8vIFNob3J0Y3V0IGV2YWx1YXRpb24uXG4gICAgICBzdGFjay5wb3AoKTtcbiAgICAgIHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdLnZhbHVlID0gc3RhdGUudmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXRlLmRvbmVSaWdodF8gPSB0cnVlO1xuICAgICAgcmV0dXJuIG5ldyBJbnRlcnByZXRlci5TdGF0ZShub2RlWydyaWdodCddLCBzdGF0ZS5zY29wZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHN0YWNrLnBvcCgpO1xuICAgIHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdLnZhbHVlID0gc3RhdGUudmFsdWU7XG4gIH1cbn07XG5cbkludGVycHJldGVyLnByb3RvdHlwZVsnc3RlcE1lbWJlckV4cHJlc3Npb24nXSA9IGZ1bmN0aW9uKHN0YWNrLCBzdGF0ZSwgbm9kZSkge1xuICBpZiAoIXN0YXRlLmRvbmVPYmplY3RfKSB7XG4gICAgc3RhdGUuZG9uZU9iamVjdF8gPSB0cnVlO1xuICAgIHJldHVybiBuZXcgSW50ZXJwcmV0ZXIuU3RhdGUobm9kZVsnb2JqZWN0J10sIHN0YXRlLnNjb3BlKTtcbiAgfVxuICB2YXIgcHJvcE5hbWU7XG4gIGlmICghbm9kZVsnY29tcHV0ZWQnXSkge1xuICAgIHN0YXRlLm9iamVjdF8gPSBzdGF0ZS52YWx1ZTtcbiAgICAvLyBvYmouZm9vIC0tIEp1c3QgYWNjZXNzICdmb28nIGRpcmVjdGx5LlxuICAgIHByb3BOYW1lID0gbm9kZVsncHJvcGVydHknXVsnbmFtZSddO1xuICB9IGVsc2UgaWYgKCFzdGF0ZS5kb25lUHJvcGVydHlfKSB7XG4gICAgc3RhdGUub2JqZWN0XyA9IHN0YXRlLnZhbHVlO1xuICAgIC8vIG9ialtmb29dIC0tIENvbXB1dGUgdmFsdWUgb2YgJ2ZvbycuXG4gICAgc3RhdGUuZG9uZVByb3BlcnR5XyA9IHRydWU7XG4gICAgcmV0dXJuIG5ldyBJbnRlcnByZXRlci5TdGF0ZShub2RlWydwcm9wZXJ0eSddLCBzdGF0ZS5zY29wZSk7XG4gIH0gZWxzZSB7XG4gICAgcHJvcE5hbWUgPSBzdGF0ZS52YWx1ZTtcbiAgfVxuICBzdGFjay5wb3AoKTtcbiAgaWYgKHN0YXRlLmNvbXBvbmVudHMpIHtcbiAgICBzdGFja1tzdGFjay5sZW5ndGggLSAxXS52YWx1ZSA9IFtzdGF0ZS5vYmplY3RfLCBwcm9wTmFtZV07XG4gIH0gZWxzZSB7XG4gICAgdmFyIHZhbHVlID0gdGhpcy5nZXRQcm9wZXJ0eShzdGF0ZS5vYmplY3RfLCBwcm9wTmFtZSk7XG4gICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUuaXNHZXR0ZXIpIHtcbiAgICAgIC8vIENsZWFyIHRoZSBnZXR0ZXIgZmxhZyBhbmQgY2FsbCB0aGUgZ2V0dGVyIGZ1bmN0aW9uLlxuICAgICAgdmFsdWUuaXNHZXR0ZXIgPSBmYWxzZTtcbiAgICAgIHZhciBmdW5jID0gLyoqIEB0eXBlIHshSW50ZXJwcmV0ZXIuT2JqZWN0fSAqLyAodmFsdWUpO1xuICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlR2V0dGVyXyhmdW5jLCBzdGF0ZS5vYmplY3RfKTtcbiAgICB9XG4gICAgc3RhY2tbc3RhY2subGVuZ3RoIC0gMV0udmFsdWUgPSB2YWx1ZTtcbiAgfVxufTtcblxuSW50ZXJwcmV0ZXIucHJvdG90eXBlWydzdGVwTmV3RXhwcmVzc2lvbiddID1cbiAgICBJbnRlcnByZXRlci5wcm90b3R5cGVbJ3N0ZXBDYWxsRXhwcmVzc2lvbiddO1xuXG5JbnRlcnByZXRlci5wcm90b3R5cGVbJ3N0ZXBPYmplY3RFeHByZXNzaW9uJ10gPSBmdW5jdGlvbihzdGFjaywgc3RhdGUsIG5vZGUpIHtcbiAgdmFyIG4gPSBzdGF0ZS5uXyB8fCAwO1xuICB2YXIgcHJvcGVydHkgPSBub2RlWydwcm9wZXJ0aWVzJ11bbl07XG4gIGlmICghc3RhdGUub2JqZWN0Xykge1xuICAgIC8vIEZpcnN0IGV4ZWN1dGlvbi5cbiAgICBzdGF0ZS5vYmplY3RfID0gdGhpcy5jcmVhdGVPYmplY3RQcm90byh0aGlzLk9CSkVDVF9QUk9UTyk7XG4gICAgc3RhdGUucHJvcGVydGllc18gPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB9IGVsc2Uge1xuICAgIC8vIERldGVybWluZSBwcm9wZXJ0eSBuYW1lLlxuICAgIHZhciBrZXkgPSBwcm9wZXJ0eVsna2V5J107XG4gICAgaWYgKGtleVsndHlwZSddID09PSAnSWRlbnRpZmllcicpIHtcbiAgICAgIHZhciBwcm9wTmFtZSA9IGtleVsnbmFtZSddO1xuICAgIH0gZWxzZSBpZiAoa2V5Wyd0eXBlJ10gPT09ICdMaXRlcmFsJykge1xuICAgICAgdmFyIHByb3BOYW1lID0ga2V5Wyd2YWx1ZSddO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBTeW50YXhFcnJvcignVW5rbm93biBvYmplY3Qgc3RydWN0dXJlOiAnICsga2V5Wyd0eXBlJ10pO1xuICAgIH1cbiAgICAvLyBTZXQgdGhlIHByb3BlcnR5IGNvbXB1dGVkIGluIHRoZSBwcmV2aW91cyBleGVjdXRpb24uXG4gICAgaWYgKCFzdGF0ZS5wcm9wZXJ0aWVzX1twcm9wTmFtZV0pIHtcbiAgICAgIC8vIENyZWF0ZSB0ZW1wIG9iamVjdCB0byBjb2xsZWN0IHZhbHVlLCBnZXR0ZXIsIGFuZC9vciBzZXR0ZXIuXG4gICAgICBzdGF0ZS5wcm9wZXJ0aWVzX1twcm9wTmFtZV0gPSB7fTtcbiAgICB9XG4gICAgc3RhdGUucHJvcGVydGllc19bcHJvcE5hbWVdW3Byb3BlcnR5WydraW5kJ11dID0gc3RhdGUudmFsdWU7XG4gICAgc3RhdGUubl8gPSArK247XG4gICAgcHJvcGVydHkgPSBub2RlWydwcm9wZXJ0aWVzJ11bbl07XG4gIH1cbiAgaWYgKHByb3BlcnR5KSB7XG4gICAgcmV0dXJuIG5ldyBJbnRlcnByZXRlci5TdGF0ZShwcm9wZXJ0eVsndmFsdWUnXSwgc3RhdGUuc2NvcGUpO1xuICB9XG4gIGZvciAodmFyIGtleSBpbiBzdGF0ZS5wcm9wZXJ0aWVzXykge1xuICAgIHZhciBraW5kcyA9IHN0YXRlLnByb3BlcnRpZXNfW2tleV07XG4gICAgaWYgKCdnZXQnIGluIGtpbmRzIHx8ICdzZXQnIGluIGtpbmRzKSB7XG4gICAgICAvLyBTZXQgYSBwcm9wZXJ0eSB3aXRoIGEgZ2V0dGVyIG9yIHNldHRlci5cbiAgICAgIHZhciBkZXNjcmlwdG9yID0ge1xuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGdldDoga2luZHNbJ2dldCddLFxuICAgICAgICBzZXQ6IGtpbmRzWydzZXQnXVxuICAgICAgfTtcbiAgICAgIHRoaXMuc2V0UHJvcGVydHkoc3RhdGUub2JqZWN0Xywga2V5LCBudWxsLCBkZXNjcmlwdG9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU2V0IGEgbm9ybWFsIHByb3BlcnR5IHdpdGggYSB2YWx1ZS5cbiAgICAgIHRoaXMuc2V0UHJvcGVydHkoc3RhdGUub2JqZWN0Xywga2V5LCBraW5kc1snaW5pdCddKTtcbiAgICB9XG4gIH1cbiAgc3RhY2sucG9wKCk7XG4gIHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdLnZhbHVlID0gc3RhdGUub2JqZWN0Xztcbn07XG5cbkludGVycHJldGVyLnByb3RvdHlwZVsnc3RlcFByb2dyYW0nXSA9IGZ1bmN0aW9uKHN0YWNrLCBzdGF0ZSwgbm9kZSkge1xuICB2YXIgZXhwcmVzc2lvbiA9IG5vZGVbJ2JvZHknXS5zaGlmdCgpO1xuICBpZiAoZXhwcmVzc2lvbikge1xuICAgIHN0YXRlLmRvbmUgPSBmYWxzZTtcbiAgICByZXR1cm4gbmV3IEludGVycHJldGVyLlN0YXRlKGV4cHJlc3Npb24sIHN0YXRlLnNjb3BlKTtcbiAgfVxuICBzdGF0ZS5kb25lID0gdHJ1ZTtcbiAgLy8gRG9uJ3QgcG9wIHRoZSBzdGF0ZVN0YWNrLlxuICAvLyBMZWF2ZSB0aGUgcm9vdCBzY29wZSBvbiB0aGUgdHJlZSBpbiBjYXNlIHRoZSBwcm9ncmFtIGlzIGFwcGVuZGVkIHRvLlxufTtcblxuSW50ZXJwcmV0ZXIucHJvdG90eXBlWydzdGVwUmV0dXJuU3RhdGVtZW50J10gPSBmdW5jdGlvbihzdGFjaywgc3RhdGUsIG5vZGUpIHtcbiAgaWYgKG5vZGVbJ2FyZ3VtZW50J10gJiYgIXN0YXRlLmRvbmVfKSB7XG4gICAgc3RhdGUuZG9uZV8gPSB0cnVlO1xuICAgIHJldHVybiBuZXcgSW50ZXJwcmV0ZXIuU3RhdGUobm9kZVsnYXJndW1lbnQnXSwgc3RhdGUuc2NvcGUpO1xuICB9XG4gIHRoaXMudW53aW5kKEludGVycHJldGVyLkNvbXBsZXRpb24uUkVUVVJOLCBzdGF0ZS52YWx1ZSwgdW5kZWZpbmVkKTtcbn07XG5cbkludGVycHJldGVyLnByb3RvdHlwZVsnc3RlcFNlcXVlbmNlRXhwcmVzc2lvbiddID0gZnVuY3Rpb24oc3RhY2ssIHN0YXRlLCBub2RlKSB7XG4gIHZhciBuID0gc3RhdGUubl8gfHwgMDtcbiAgdmFyIGV4cHJlc3Npb24gPSBub2RlWydleHByZXNzaW9ucyddW25dO1xuICBpZiAoZXhwcmVzc2lvbikge1xuICAgIHN0YXRlLm5fID0gbiArIDE7XG4gICAgcmV0dXJuIG5ldyBJbnRlcnByZXRlci5TdGF0ZShleHByZXNzaW9uLCBzdGF0ZS5zY29wZSk7XG4gIH1cbiAgc3RhY2sucG9wKCk7XG4gIHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdLnZhbHVlID0gc3RhdGUudmFsdWU7XG59O1xuXG5JbnRlcnByZXRlci5wcm90b3R5cGVbJ3N0ZXBTd2l0Y2hTdGF0ZW1lbnQnXSA9IGZ1bmN0aW9uKHN0YWNrLCBzdGF0ZSwgbm9kZSkge1xuICBpZiAoIXN0YXRlLnRlc3RfKSB7XG4gICAgc3RhdGUudGVzdF8gPSAxO1xuICAgIHJldHVybiBuZXcgSW50ZXJwcmV0ZXIuU3RhdGUobm9kZVsnZGlzY3JpbWluYW50J10sIHN0YXRlLnNjb3BlKTtcbiAgfVxuICBpZiAoc3RhdGUudGVzdF8gPT09IDEpIHtcbiAgICBzdGF0ZS50ZXN0XyA9IDI7XG4gICAgLy8gUHJlc2VydmUgc3dpdGNoIHZhbHVlIGJldHdlZW4gY2FzZSB0ZXN0cy5cbiAgICBzdGF0ZS5zd2l0Y2hWYWx1ZV8gPSBzdGF0ZS52YWx1ZTtcbiAgICBzdGF0ZS5kZWZhdWx0Q2FzZV8gPSAtMTtcbiAgfVxuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgdmFyIGluZGV4ID0gc3RhdGUuaW5kZXhfIHx8IDA7XG4gICAgdmFyIHN3aXRjaENhc2UgPSBub2RlWydjYXNlcyddW2luZGV4XTtcbiAgICBpZiAoIXN0YXRlLm1hdGNoZWRfICYmIHN3aXRjaENhc2UgJiYgIXN3aXRjaENhc2VbJ3Rlc3QnXSkge1xuICAgICAgLy8gVGVzdCBvbiB0aGUgZGVmYXVsdCBjYXNlIGlzIG51bGwuXG4gICAgICAvLyBCeXBhc3MgKGJ1dCBzdG9yZSkgdGhlIGRlZmF1bHQgY2FzZSwgYW5kIGdldCBiYWNrIHRvIGl0IGxhdGVyLlxuICAgICAgc3RhdGUuZGVmYXVsdENhc2VfID0gaW5kZXg7XG4gICAgICBzdGF0ZS5pbmRleF8gPSBpbmRleCArIDE7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKCFzd2l0Y2hDYXNlICYmICFzdGF0ZS5tYXRjaGVkXyAmJiBzdGF0ZS5kZWZhdWx0Q2FzZV8gIT09IC0xKSB7XG4gICAgICAvLyBSYW4gdGhyb3VnaCBhbGwgY2FzZXMsIG5vIG1hdGNoLiAgSnVtcCB0byB0aGUgZGVmYXVsdC5cbiAgICAgIHN0YXRlLm1hdGNoZWRfID0gdHJ1ZTtcbiAgICAgIHN0YXRlLmluZGV4XyA9IHN0YXRlLmRlZmF1bHRDYXNlXztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoc3dpdGNoQ2FzZSkge1xuICAgICAgaWYgKCFzdGF0ZS5tYXRjaGVkXyAmJiAhc3RhdGUudGVzdGVkXyAmJiBzd2l0Y2hDYXNlWyd0ZXN0J10pIHtcbiAgICAgICAgc3RhdGUudGVzdGVkXyA9IHRydWU7XG4gICAgICAgIHJldHVybiBuZXcgSW50ZXJwcmV0ZXIuU3RhdGUoc3dpdGNoQ2FzZVsndGVzdCddLCBzdGF0ZS5zY29wZSk7XG4gICAgICB9XG4gICAgICBpZiAoc3RhdGUubWF0Y2hlZF8gfHwgc3RhdGUudmFsdWUgPT09IHN0YXRlLnN3aXRjaFZhbHVlXykge1xuICAgICAgICBzdGF0ZS5tYXRjaGVkXyA9IHRydWU7XG4gICAgICAgIHZhciBuID0gc3RhdGUubl8gfHwgMDtcbiAgICAgICAgaWYgKHN3aXRjaENhc2VbJ2NvbnNlcXVlbnQnXVtuXSkge1xuICAgICAgICAgIHN0YXRlLmlzU3dpdGNoID0gdHJ1ZTtcbiAgICAgICAgICBzdGF0ZS5uXyA9IG4gKyAxO1xuICAgICAgICAgIHJldHVybiBuZXcgSW50ZXJwcmV0ZXIuU3RhdGUoc3dpdGNoQ2FzZVsnY29uc2VxdWVudCddW25dLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuc2NvcGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBNb3ZlIG9uIHRvIG5leHQgY2FzZS5cbiAgICAgIHN0YXRlLnRlc3RlZF8gPSBmYWxzZTtcbiAgICAgIHN0YXRlLm5fID0gMDtcbiAgICAgIHN0YXRlLmluZGV4XyA9IGluZGV4ICsgMTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhY2sucG9wKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG59O1xuXG5JbnRlcnByZXRlci5wcm90b3R5cGVbJ3N0ZXBUaGlzRXhwcmVzc2lvbiddID0gZnVuY3Rpb24oc3RhY2ssIHN0YXRlLCBub2RlKSB7XG4gIHN0YWNrLnBvcCgpO1xuICBzdGFja1tzdGFjay5sZW5ndGggLSAxXS52YWx1ZSA9IHRoaXMuZ2V0VmFsdWVGcm9tU2NvcGUoJ3RoaXMnKTtcbn07XG5cbkludGVycHJldGVyLnByb3RvdHlwZVsnc3RlcFRocm93U3RhdGVtZW50J10gPSBmdW5jdGlvbihzdGFjaywgc3RhdGUsIG5vZGUpIHtcbiAgaWYgKCFzdGF0ZS5kb25lXykge1xuICAgIHN0YXRlLmRvbmVfID0gdHJ1ZTtcbiAgICByZXR1cm4gbmV3IEludGVycHJldGVyLlN0YXRlKG5vZGVbJ2FyZ3VtZW50J10sIHN0YXRlLnNjb3BlKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnRocm93RXhjZXB0aW9uKHN0YXRlLnZhbHVlKTtcbiAgfVxufTtcblxuSW50ZXJwcmV0ZXIucHJvdG90eXBlWydzdGVwVHJ5U3RhdGVtZW50J10gPSBmdW5jdGlvbihzdGFjaywgc3RhdGUsIG5vZGUpIHtcbiAgaWYgKCFzdGF0ZS5kb25lQmxvY2tfKSB7XG4gICAgc3RhdGUuZG9uZUJsb2NrXyA9IHRydWU7XG4gICAgcmV0dXJuIG5ldyBJbnRlcnByZXRlci5TdGF0ZShub2RlWydibG9jayddLCBzdGF0ZS5zY29wZSk7XG4gIH1cbiAgaWYgKHN0YXRlLmN2ICYmIHN0YXRlLmN2LnR5cGUgPT09IEludGVycHJldGVyLkNvbXBsZXRpb24uVEhST1cgJiZcbiAgICAgICFzdGF0ZS5kb25lSGFuZGxlcl8gJiYgbm9kZVsnaGFuZGxlciddKSB7XG4gICAgc3RhdGUuZG9uZUhhbmRsZXJfID0gdHJ1ZTtcbiAgICB2YXIgbmV4dFN0YXRlID0gbmV3IEludGVycHJldGVyLlN0YXRlKG5vZGVbJ2hhbmRsZXInXSwgc3RhdGUuc2NvcGUpO1xuICAgIG5leHRTdGF0ZS50aHJvd1ZhbHVlID0gc3RhdGUuY3YudmFsdWU7XG4gICAgc3RhdGUuY3YgPSB1bmRlZmluZWQ7ICAvLyBUaGlzIGVycm9yIGhhcyBiZWVuIGhhbmRsZWQsIGRvbid0IHJldGhyb3cuXG4gICAgcmV0dXJuIG5leHRTdGF0ZTtcbiAgfVxuICBpZiAoIXN0YXRlLmRvbmVGaW5hbGl6ZXJfICYmIG5vZGVbJ2ZpbmFsaXplciddKSB7XG4gICAgc3RhdGUuZG9uZUZpbmFsaXplcl8gPSB0cnVlO1xuICAgIHJldHVybiBuZXcgSW50ZXJwcmV0ZXIuU3RhdGUobm9kZVsnZmluYWxpemVyJ10sIHN0YXRlLnNjb3BlKTtcbiAgfVxuICBzdGFjay5wb3AoKTtcbiAgaWYgKHN0YXRlLmN2KSB7XG4gICAgLy8gVGhlcmUgd2FzIG5vIGNhdGNoIGhhbmRsZXIsIG9yIHRoZSBjYXRjaC9maW5hbGx5IHRocmV3IGFuIGVycm9yLlxuICAgIC8vIFRocm93IHRoZSBlcnJvciB1cCB0byBhIGhpZ2hlciB0cnkuXG4gICAgdGhpcy51bndpbmQoc3RhdGUuY3YudHlwZSwgc3RhdGUuY3YudmFsdWUsIHN0YXRlLmN2LmxhYmVsKTtcbiAgfVxufTtcblxuSW50ZXJwcmV0ZXIucHJvdG90eXBlWydzdGVwVW5hcnlFeHByZXNzaW9uJ10gPSBmdW5jdGlvbihzdGFjaywgc3RhdGUsIG5vZGUpIHtcbiAgaWYgKCFzdGF0ZS5kb25lXykge1xuICAgIHN0YXRlLmRvbmVfID0gdHJ1ZTtcbiAgICB2YXIgbmV4dFN0YXRlID0gbmV3IEludGVycHJldGVyLlN0YXRlKG5vZGVbJ2FyZ3VtZW50J10sIHN0YXRlLnNjb3BlKTtcbiAgICBuZXh0U3RhdGUuY29tcG9uZW50cyA9IG5vZGVbJ29wZXJhdG9yJ10gPT09ICdkZWxldGUnO1xuICAgIHJldHVybiBuZXh0U3RhdGU7XG4gIH1cbiAgc3RhY2sucG9wKCk7XG4gIHZhciB2YWx1ZSA9IHN0YXRlLnZhbHVlO1xuICBpZiAobm9kZVsnb3BlcmF0b3InXSA9PT0gJy0nKSB7XG4gICAgdmFsdWUgPSAtdmFsdWU7XG4gIH0gZWxzZSBpZiAobm9kZVsnb3BlcmF0b3InXSA9PT0gJysnKSB7XG4gICAgdmFsdWUgPSArdmFsdWU7XG4gIH0gZWxzZSBpZiAobm9kZVsnb3BlcmF0b3InXSA9PT0gJyEnKSB7XG4gICAgdmFsdWUgPSAhdmFsdWU7XG4gIH0gZWxzZSBpZiAobm9kZVsnb3BlcmF0b3InXSA9PT0gJ34nKSB7XG4gICAgdmFsdWUgPSB+dmFsdWU7XG4gIH0gZWxzZSBpZiAobm9kZVsnb3BlcmF0b3InXSA9PT0gJ2RlbGV0ZScpIHtcbiAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgICAvLyBJZiB2YWx1ZSBpcyBub3QgYW4gYXJyYXksIHRoZW4gaXQgaXMgYSBwcmltaXRpdmUsIG9yIHNvbWUgb3RoZXIgdmFsdWUuXG4gICAgLy8gSWYgc28sIHNraXAgdGhlIGRlbGV0ZSBhbmQgcmV0dXJuIHRydWUuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICB2YXIgb2JqID0gdmFsdWVbMF07XG4gICAgICBpZiAob2JqID09PSBJbnRlcnByZXRlci5TQ09QRV9SRUZFUkVOQ0UpIHtcbiAgICAgICAgLy8gJ2RlbGV0ZSBmb287JyBpcyB0aGUgc2FtZSBhcyAnZGVsZXRlIHdpbmRvdy5mb28nLlxuICAgICAgICBvYmogPSBzdGF0ZS5zY29wZTtcbiAgICAgIH1cbiAgICAgIHZhciBuYW1lID0gU3RyaW5nKHZhbHVlWzFdKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRlbGV0ZSBvYmoucHJvcGVydGllc1tuYW1lXTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKHN0YXRlLnNjb3BlLnN0cmljdCkge1xuICAgICAgICAgIHRoaXMudGhyb3dFeGNlcHRpb24odGhpcy5UWVBFX0VSUk9SLCBcIkNhbm5vdCBkZWxldGUgcHJvcGVydHkgJ1wiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgKyBcIicgb2YgJ1wiICsgb2JqICsgXCInXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHZhbHVlID0gcmVzdWx0O1xuICB9IGVsc2UgaWYgKG5vZGVbJ29wZXJhdG9yJ10gPT09ICd0eXBlb2YnKSB7XG4gICAgdmFsdWUgPSAodmFsdWUgJiYgdmFsdWUuY2xhc3MgPT09ICdGdW5jdGlvbicpID8gJ2Z1bmN0aW9uJyA6IHR5cGVvZiB2YWx1ZTtcbiAgfSBlbHNlIGlmIChub2RlWydvcGVyYXRvciddID09PSAndm9pZCcpIHtcbiAgICB2YWx1ZSA9IHVuZGVmaW5lZDtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBTeW50YXhFcnJvcignVW5rbm93biB1bmFyeSBvcGVyYXRvcjogJyArIG5vZGVbJ29wZXJhdG9yJ10pO1xuICB9XG4gIHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdLnZhbHVlID0gdmFsdWU7XG59O1xuXG5JbnRlcnByZXRlci5wcm90b3R5cGVbJ3N0ZXBVcGRhdGVFeHByZXNzaW9uJ10gPSBmdW5jdGlvbihzdGFjaywgc3RhdGUsIG5vZGUpIHtcbiAgaWYgKCFzdGF0ZS5kb25lTGVmdF8pIHtcbiAgICBzdGF0ZS5kb25lTGVmdF8gPSB0cnVlO1xuICAgIHZhciBuZXh0U3RhdGUgPSBuZXcgSW50ZXJwcmV0ZXIuU3RhdGUobm9kZVsnYXJndW1lbnQnXSwgc3RhdGUuc2NvcGUpO1xuICAgIG5leHRTdGF0ZS5jb21wb25lbnRzID0gdHJ1ZTtcbiAgICByZXR1cm4gbmV4dFN0YXRlO1xuICB9XG4gIGlmICghc3RhdGUubGVmdFNpZGVfKSB7XG4gICAgc3RhdGUubGVmdFNpZGVfID0gc3RhdGUudmFsdWU7XG4gIH1cbiAgaWYgKHN0YXRlLmRvbmVHZXR0ZXJfKSB7XG4gICAgc3RhdGUubGVmdFZhbHVlXyA9IHN0YXRlLnZhbHVlO1xuICB9XG4gIGlmICghc3RhdGUuZG9uZUdldHRlcl8pIHtcbiAgICB2YXIgbGVmdFZhbHVlID0gdGhpcy5nZXRWYWx1ZShzdGF0ZS5sZWZ0U2lkZV8pO1xuICAgIHN0YXRlLmxlZnRWYWx1ZV8gPSBsZWZ0VmFsdWU7XG4gICAgaWYgKGxlZnRWYWx1ZSAmJiB0eXBlb2YgbGVmdFZhbHVlID09PSAnb2JqZWN0JyAmJiBsZWZ0VmFsdWUuaXNHZXR0ZXIpIHtcbiAgICAgIC8vIENsZWFyIHRoZSBnZXR0ZXIgZmxhZyBhbmQgY2FsbCB0aGUgZ2V0dGVyIGZ1bmN0aW9uLlxuICAgICAgbGVmdFZhbHVlLmlzR2V0dGVyID0gZmFsc2U7XG4gICAgICBzdGF0ZS5kb25lR2V0dGVyXyA9IHRydWU7XG4gICAgICB2YXIgZnVuYyA9IC8qKiBAdHlwZSB7IUludGVycHJldGVyLk9iamVjdH0gKi8gKGxlZnRWYWx1ZSk7XG4gICAgICByZXR1cm4gdGhpcy5jcmVhdGVHZXR0ZXJfKGZ1bmMsIHN0YXRlLmxlZnRTaWRlXyk7XG4gICAgfVxuICB9XG4gIGlmIChzdGF0ZS5kb25lU2V0dGVyXykge1xuICAgIC8vIFJldHVybiBpZiBzZXR0ZXIgZnVuY3Rpb24uXG4gICAgLy8gU2V0dGVyIG1ldGhvZCBvbiBwcm9wZXJ0eSBoYXMgY29tcGxldGVkLlxuICAgIC8vIElnbm9yZSBpdHMgcmV0dXJuIHZhbHVlLCBhbmQgdXNlIHRoZSBvcmlnaW5hbCBzZXQgdmFsdWUgaW5zdGVhZC5cbiAgICBzdGFjay5wb3AoKTtcbiAgICBzdGFja1tzdGFjay5sZW5ndGggLSAxXS52YWx1ZSA9IHN0YXRlLnNldHRlclZhbHVlXztcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGxlZnRWYWx1ZSA9IE51bWJlcihzdGF0ZS5sZWZ0VmFsdWVfKTtcbiAgdmFyIGNoYW5nZVZhbHVlO1xuICBpZiAobm9kZVsnb3BlcmF0b3InXSA9PT0gJysrJykge1xuICAgIGNoYW5nZVZhbHVlID0gbGVmdFZhbHVlICsgMTtcbiAgfSBlbHNlIGlmIChub2RlWydvcGVyYXRvciddID09PSAnLS0nKSB7XG4gICAgY2hhbmdlVmFsdWUgPSBsZWZ0VmFsdWUgLSAxO1xuICB9IGVsc2Uge1xuICAgIHRocm93IFN5bnRheEVycm9yKCdVbmtub3duIHVwZGF0ZSBleHByZXNzaW9uOiAnICsgbm9kZVsnb3BlcmF0b3InXSk7XG4gIH1cbiAgdmFyIHJldHVyblZhbHVlID0gbm9kZVsncHJlZml4J10gPyBjaGFuZ2VWYWx1ZSA6IGxlZnRWYWx1ZTtcbiAgdmFyIHNldHRlciA9IHRoaXMuc2V0VmFsdWUoc3RhdGUubGVmdFNpZGVfLCBjaGFuZ2VWYWx1ZSk7XG4gIGlmIChzZXR0ZXIpIHtcbiAgICBzdGF0ZS5kb25lU2V0dGVyXyA9IHRydWU7XG4gICAgc3RhdGUuc2V0dGVyVmFsdWVfID0gcmV0dXJuVmFsdWU7XG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlU2V0dGVyXyhzZXR0ZXIsIHN0YXRlLmxlZnRTaWRlXywgY2hhbmdlVmFsdWUpO1xuICB9XG4gIC8vIFJldHVybiBpZiBubyBzZXR0ZXIgZnVuY3Rpb24uXG4gIHN0YWNrLnBvcCgpO1xuICBzdGFja1tzdGFjay5sZW5ndGggLSAxXS52YWx1ZSA9IHJldHVyblZhbHVlO1xufTtcblxuSW50ZXJwcmV0ZXIucHJvdG90eXBlWydzdGVwVmFyaWFibGVEZWNsYXJhdGlvbiddID0gZnVuY3Rpb24oc3RhY2ssIHN0YXRlLCBub2RlKSB7XG4gIHZhciBkZWNsYXJhdGlvbnMgPSBub2RlWydkZWNsYXJhdGlvbnMnXTtcbiAgdmFyIG4gPSBzdGF0ZS5uXyB8fCAwO1xuICB2YXIgZGVjbGFyYXRpb25Ob2RlID0gZGVjbGFyYXRpb25zW25dO1xuICBpZiAoc3RhdGUuaW5pdF8gJiYgZGVjbGFyYXRpb25Ob2RlKSB7XG4gICAgLy8gVGhpcyBzZXRWYWx1ZSBjYWxsIG5ldmVyIG5lZWRzIHRvIGRlYWwgd2l0aCBjYWxsaW5nIGEgc2V0dGVyIGZ1bmN0aW9uLlxuICAgIC8vIE5vdGUgdGhhdCB0aGlzIGlzIHNldHRpbmcgdGhlIGluaXQgdmFsdWUsIG5vdCBkZWZpbmluZyB0aGUgdmFyaWFibGUuXG4gICAgLy8gVmFyaWFibGUgZGVmaW5pdGlvbiBpcyBkb25lIHdoZW4gc2NvcGUgaXMgcG9wdWxhdGVkLlxuICAgIHRoaXMuc2V0VmFsdWVUb1Njb3BlKGRlY2xhcmF0aW9uTm9kZVsnaWQnXVsnbmFtZSddLCBzdGF0ZS52YWx1ZSk7XG4gICAgc3RhdGUuaW5pdF8gPSBmYWxzZTtcbiAgICBkZWNsYXJhdGlvbk5vZGUgPSBkZWNsYXJhdGlvbnNbKytuXTtcbiAgfVxuICB3aGlsZSAoZGVjbGFyYXRpb25Ob2RlKSB7XG4gICAgLy8gU2tpcCBhbnkgZGVjbGFyYXRpb25zIHRoYXQgYXJlIG5vdCBpbml0aWFsaXplZC4gIFRoZXkgaGF2ZSBhbHJlYWR5XG4gICAgLy8gYmVlbiBkZWZpbmVkIGFzIHVuZGVmaW5lZCBpbiBwb3B1bGF0ZVNjb3BlXy5cbiAgICBpZiAoZGVjbGFyYXRpb25Ob2RlWydpbml0J10pIHtcbiAgICAgIHN0YXRlLm5fID0gbjtcbiAgICAgIHN0YXRlLmluaXRfID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXcgSW50ZXJwcmV0ZXIuU3RhdGUoZGVjbGFyYXRpb25Ob2RlWydpbml0J10sIHN0YXRlLnNjb3BlKTtcbiAgICB9XG4gICAgZGVjbGFyYXRpb25Ob2RlID0gZGVjbGFyYXRpb25zWysrbl07XG4gIH1cbiAgc3RhY2sucG9wKCk7XG59O1xuXG5JbnRlcnByZXRlci5wcm90b3R5cGVbJ3N0ZXBXaXRoU3RhdGVtZW50J10gPSBmdW5jdGlvbihzdGFjaywgc3RhdGUsIG5vZGUpIHtcbiAgaWYgKCFzdGF0ZS5kb25lT2JqZWN0Xykge1xuICAgIHN0YXRlLmRvbmVPYmplY3RfID0gdHJ1ZTtcbiAgICByZXR1cm4gbmV3IEludGVycHJldGVyLlN0YXRlKG5vZGVbJ29iamVjdCddLCBzdGF0ZS5zY29wZSk7XG4gIH0gZWxzZSBpZiAoIXN0YXRlLmRvbmVCb2R5Xykge1xuICAgIHN0YXRlLmRvbmVCb2R5XyA9IHRydWU7XG4gICAgdmFyIHNjb3BlID0gdGhpcy5jcmVhdGVTcGVjaWFsU2NvcGUoc3RhdGUuc2NvcGUsIHN0YXRlLnZhbHVlKTtcbiAgICByZXR1cm4gbmV3IEludGVycHJldGVyLlN0YXRlKG5vZGVbJ2JvZHknXSwgc2NvcGUpO1xuICB9IGVsc2Uge1xuICAgIHN0YWNrLnBvcCgpO1xuICB9XG59O1xuXG5JbnRlcnByZXRlci5wcm90b3R5cGVbJ3N0ZXBXaGlsZVN0YXRlbWVudCddID1cbiAgICBJbnRlcnByZXRlci5wcm90b3R5cGVbJ3N0ZXBEb1doaWxlU3RhdGVtZW50J107XG5cbi8vIFByZXNlcnZlIHRvcC1sZXZlbCBBUEkgZnVuY3Rpb25zIGZyb20gYmVpbmcgcHJ1bmVkL3JlbmFtZWQgYnkgSlMgY29tcGlsZXJzLlxuLy8gQWRkIG90aGVycyBhcyBuZWVkZWQuXG4vLyBUaGUgZ2xvYmFsIG9iamVjdCAoJ3dpbmRvdycgaW4gYSBicm93c2VyLCAnZ2xvYmFsJyBpbiBub2RlLmpzKSBpcyAndGhpcycuXG4vL3RoaXNbJ0ludGVycHJldGVyJ10gPSBJbnRlcnByZXRlcjtcbmV4cG9ydCBkZWZhdWx0IEludGVycHJldGVyXG5JbnRlcnByZXRlci5wcm90b3R5cGVbJ3N0ZXAnXSA9IEludGVycHJldGVyLnByb3RvdHlwZS5zdGVwO1xuSW50ZXJwcmV0ZXIucHJvdG90eXBlWydydW4nXSA9IEludGVycHJldGVyLnByb3RvdHlwZS5ydW47XG5JbnRlcnByZXRlci5wcm90b3R5cGVbJ2FwcGVuZENvZGUnXSA9IEludGVycHJldGVyLnByb3RvdHlwZS5hcHBlbmRDb2RlO1xuSW50ZXJwcmV0ZXIucHJvdG90eXBlWydjcmVhdGVPYmplY3QnXSA9IEludGVycHJldGVyLnByb3RvdHlwZS5jcmVhdGVPYmplY3Q7XG5JbnRlcnByZXRlci5wcm90b3R5cGVbJ2NyZWF0ZU9iamVjdFByb3RvJ10gPVxuICAgIEludGVycHJldGVyLnByb3RvdHlwZS5jcmVhdGVPYmplY3RQcm90bztcbkludGVycHJldGVyLnByb3RvdHlwZVsnY3JlYXRlQXN5bmNGdW5jdGlvbiddID1cbiAgICBJbnRlcnByZXRlci5wcm90b3R5cGUuY3JlYXRlQXN5bmNGdW5jdGlvbjtcbkludGVycHJldGVyLnByb3RvdHlwZVsnY3JlYXRlTmF0aXZlRnVuY3Rpb24nXSA9XG4gICAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLmNyZWF0ZU5hdGl2ZUZ1bmN0aW9uO1xuSW50ZXJwcmV0ZXIucHJvdG90eXBlWydnZXRQcm9wZXJ0eSddID0gSW50ZXJwcmV0ZXIucHJvdG90eXBlLmdldFByb3BlcnR5O1xuSW50ZXJwcmV0ZXIucHJvdG90eXBlWydzZXRQcm9wZXJ0eSddID0gSW50ZXJwcmV0ZXIucHJvdG90eXBlLnNldFByb3BlcnR5O1xuSW50ZXJwcmV0ZXIucHJvdG90eXBlWyduYXRpdmVUb1BzZXVkbyddID0gSW50ZXJwcmV0ZXIucHJvdG90eXBlLm5hdGl2ZVRvUHNldWRvO1xuSW50ZXJwcmV0ZXIucHJvdG90eXBlWydwc2V1ZG9Ub05hdGl2ZSddID0gSW50ZXJwcmV0ZXIucHJvdG90eXBlLnBzZXVkb1RvTmF0aXZlO1xuLy8gT2Jzb2xldGUuICBEbyBub3QgdXNlLlxuSW50ZXJwcmV0ZXIucHJvdG90eXBlWydjcmVhdGVQcmltaXRpdmUnXSA9IGZ1bmN0aW9uKHgpIHtyZXR1cm4geDt9O1xuIl0sImZpbGUiOiJsaWIvSlMtSW50ZXJwcmV0ZXIvaW50ZXJwcmV0ZXIuanMifQ==
