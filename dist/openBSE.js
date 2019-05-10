"use strict";

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-own-property-descriptor");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getVersion = getVersion;
Object.defineProperty(exports, "GeneralEngine", {
  enumerable: true,
  get: function get() {
    return _generalEngine["default"];
  }
});
Object.defineProperty(exports, "BrowserNotSupportError", {
  enumerable: true,
  get: function get() {
    return _browserNotSupportError["default"];
  }
});
Object.defineProperty(exports, "GeneralType", {
  enumerable: true,
  get: function get() {
    return _generalType["default"];
  }
});
Object.defineProperty(exports, "Contextmenu", {
  enumerable: true,
  get: function get() {
    return _contextmenu["default"];
  }
});

var _helper = _interopRequireDefault(require("./lib/helper"));

var _generalEngine = _interopRequireDefault(require("./engines/generalEngine"));

var _browserNotSupportError = _interopRequireDefault(require("./errors/browserNotSupportError"));

var _generalType = _interopRequireDefault(require("./engines/generalType"));

var _contextmenu = _interopRequireDefault(require("./contextmenu"));

var build = _interopRequireWildcard(require("./build.json"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * 获取版本信息。
 * @alias openBSE.getVersion
 * @returns {openBSE~VersionInfo} 版本信息：一个 {@link openBSE~VersionInfo} 结构。
 */
function getVersion() {
  return _helper["default"].clone(build);
}
/**
 * 普通弹幕全局选项
 * @typedef {object} openBSE~generalOptions
 * @description Option 结构用于存放全局选项。
 * @property {number} [verticalInterval=8] - 弹幕垂直行间距
 * @property {number} [verticalInterval=1] - 弹幕播放速度（倍数）
 * @property {openBSE~clockCallback} [clock=time => new Date().getTime() - startTime] - 时间基准：此时间基准可指向一个方法用于获取播放器当前进度，这个方法返回值即为播放进度（单位：毫秒）。
 * @property {number} [scaling=1] 弹幕缩放比例（倍数）
 * @property {openBSE~BulletScreenStyle} [defaultStyle] 默认弹幕样式：一个 {@link openBSE~BulletScreenStyle} 结构。
 * @property {openBSE.GeneralType} [hiddenTypes=0] 隐藏的弹幕类型：一个 {@link openBSE.GeneralType} 枚举。将要隐藏的弹幕类型相加，0为不隐藏任何类型的弹幕。
 * @property {number} [opacity=1.0] 弹幕不透明度：取值范围 0.0 到 1.0，0.0 全透明；1.0 不透明。
 * @property {string} [cursorOnMouseOver='pointer'] 鼠标经过样式：当鼠标经过弹幕时的样式，可设置的值可参考 MDN [cursor] {@link https://developer.mozilla.org/zh-CN/docs/Web/CSS/cursor} 。
 */

/**
 * 时间基准回调方法
 * @callback openBSE~clockCallback
 * @description ClockCallback 回调方法用于播放器当前进度。
 * @returns {number} 播放进度：单位：毫秒。
 */

/**
 * 单条弹幕数据
 * @typedef {object} openBSE~GeneralBulletScreen
 * @description BulletScreen 结构用于存放单条弹幕数据。
 * @property {string} text 弹幕文本
 * @property {boolean} [canDiscard=true] 是否允许丢弃：（此参数在事件中修改无效）在弹幕过多时，程序将自动丢弃一些延迟过高的弹幕。此选项为 false 时本条弹幕无论如何都不会被丢弃，使用本选项的场景如本用户发送的弹幕。（注意：不要将太多的弹幕的 canDiscard 设为 false， 否则会因超时的弹幕不会被丢弃而造成意外的问题。）
 * @property {number} [startTime=options.clock()] 弹幕进入时间：（此参数在事件中修改无效）单位：毫秒，默认为[时间基准（options.clock）]{@link openBSE~Options}当前时间。
 * @property {openBSE.GeneralType} [type=openBSE.GeneralType.rightToLeft] 弹幕类型：（此参数在事件中修改无效）一个类型为 {@link openBSE.BulletScreenType} 的枚举。
 * @property {openBSE~BulletScreenStyle} style 弹幕样式：一个 {@link openBSE~BulletScreenStyle} 结构。设置此选项中的任何一个值，将覆盖对应的全局设置。
 * @property {number} [layer=0] 弹幕层级：此参数越大，弹幕越靠前。一条弹幕在比它层级小的弹幕前面，在比它层级大的弹幕后面。如果层级相同按照进入时间确定层级顺序。
 * @property {any} more... 其他自定义字段：（在事件中修改修改此参数无需将 e.redraw 设置为 true）例如 uuid 、 id 等。（注意：因为在事件响应方法中返回的弹幕对象是原对象克隆的，所以无法直接比较，必须使用自定义字段唯一标识一条弹幕。）
 */

/**
 * 弹幕样式
 * @typedef {object} openBSE~GeneralBulletScreenStyle
 * @description BulletScreenStyle 结构用于存放弹幕样式信息。
 * @property {number} [shadowBlur=2] 弹幕阴影的模糊级别：0为不显示阴影。
 * @property {string} [fontWeight="600"] 字体粗细：可选值：lighter：更细；normal：标准；bold：粗体；bolder: 更粗；100、200、300、400、500、600、700、800、900：定义由粗到细的字符（400 等同于 normal；700 等同于 bold）。
 * @property {string} [fontFamily="sans-serif"] 字体系列：弹幕的字体族名称或/及类族名称的一个优先表。（注意：如果使用了用“@font-face”定义的字体，请确保在使用前完全加载完成，否则弹幕可能无法显示。如果要预加载这些字体，建议使用 [Web Font Loader]{@link https://github.com/typekit/webfontloader} 。）
 * @property {number} [size=19] 字体大小：单位：像素。
 * @property {string} [boxColor] 外框颜色：参照CSS颜色设置方法，为 null 不显示外框。
 * @property {string} [color="white"] 弹幕颜色：参照CSS颜色设置方法，为 null 不显示此弹幕。
 * @property {string} [borderColor] 描边颜色：参照CSS颜色设置方法，为 null 没有描边。
 * @property {number} [speed=0.15] 弹幕速度：（在事件中修改修改此参数无需将 e.redraw 设置为 true）单位：像素/毫秒，仅弹幕类型为0、1时有效。
 * @property {number} [residenceTime=5000] 弹幕停留时间：（此参数在事件中修改无效）单位：毫秒，仅弹幕类型2、3时有效。
 */

/**
 * 弹幕事件
 * @typedef {object} openBSE~GeneralBulletScreenEvent
 * @property {function} getBulletScreen() - 获取引发事件的弹幕弹幕的数据：retun: {@link openBSE~BulletScreen} 引发事件的弹幕的数据：一个 {@link openBSE~BulletScreen} 结构。（注意：不要试图与[添加弹幕]{@link openBSE.BulletScreenEngine#addBulletScreen}时创建的对象进行比较，这个对象是克隆得到的，并不相等。正确的方法是在添加弹幕时一并插入 id 等自定义字段来唯一标识一条弹幕。）
 * @property {function} setBulletScreen(bulletScreen,redraw) - 设置引发事件的弹幕弹幕的数据：params: {@link openBSE~BulletScreen} bulletScreen - 引发事件的弹幕的数据：一个 {@link openBSE~BulletScreen} 结构。设置此参数以便动态调整弹幕样式，但是一些参数在事件中修改无效，查看此结构的说明以了解详情。 boolean [redraw=false] - 是否重绘弹幕：此参数在每次引发事件时的初始值为 false ，如果修改了 bulletScreen 中的值，此参数必须设为 true 。
 * @property {function} getPlayState() - 获取引发事件的弹幕的播放状态：retun: boolean 取引发事件的弹幕是否在播放/移动：如果设置为 true 则该弹幕暂停，直到将此参数设为 false 或调用 {@link openBSE.BulletScreenEngine#playAllBulletScreens} 方法。
 * @property {function} setPlayState(play) - 设置引发事件的弹幕的播放状态：params: boolean paly - 是否继续播放/移动引发事件的弹幕：读取此参数可判断这条弹幕是否处于暂停状态。
 * @property {string} type - 事件类型（事件名称）
 * @property {number} screenX - 当事件发生时，鼠标相对于显示器屏的 X 坐标。
 * @property {number} screenY - 当事件发生时，鼠标相对于显示器屏的 Y 坐标。
 * @property {number} clientX - 当事件发生时，鼠标相对于浏览器有效区域的 X 坐标。
 * @property {number} pageX - 当事件发生时，鼠标相对于页面的 X 坐标。
 * @property {number} pageY - 当事件发生时，鼠标相对于页面的 Y 坐标。
 * @property {number} pageY - 当事件发生时，鼠标相对于页面的 Y 坐标。
 */

/**
 * 调试信息
 * @typedef {object} openBSE~DebugInfo
 * @description DebugInfo 结构用于存放调试信息。
 * @property {number} time - [时间基准（options.clock）]{@link openBSE~Options}当前时间。
 * @property {number} realTimeBulletScreenCount - 实时弹幕总数
 * @property {number} bufferBulletScreenCount - 缓冲区弹幕总数
 * @property {number} delay - 延迟：单位：毫秒。
 * @property {number} delayBulletScreenCount - 丢弃弹幕数：因延迟过高而丢弃的弹幕总数。
 * @property {number} fps - 帧频：单位：帧/秒。
 */

/**
 * 版本信息
 * @typedef {object} openBSE~VersionInfo
 * @description VersionInfo 结构用于存放版本信息。
 * @property {string} version 版本号
 * @property {string} buildDate 构建日期：时区：UTC。
 * @property {string} name 名称
 * @property {string} description 描述
 * @property {string} home 主页
 */
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9wZW5CU0UuanMiXSwibmFtZXMiOlsiZ2V0VmVyc2lvbiIsIkhlbHBlciIsImNsb25lIiwiYnVpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBOzs7OztBQUtBLFNBQVNBLFVBQVQsR0FBc0I7QUFDbEIsU0FBT0MsbUJBQU9DLEtBQVAsQ0FBYUMsS0FBYixDQUFQO0FBQ0g7QUFJRDs7Ozs7Ozs7Ozs7Ozs7QUFjQTs7Ozs7OztBQU9BOzs7Ozs7Ozs7Ozs7O0FBYUE7Ozs7Ozs7Ozs7Ozs7OztBQWVBOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBOzs7Ozs7Ozs7Ozs7QUFZQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBIZWxwZXIgZnJvbSAnLi9saWIvaGVscGVyJ1xuaW1wb3J0IEdlbmVyYWxFbmdpbmUgZnJvbSAnLi9lbmdpbmVzL2dlbmVyYWxFbmdpbmUnXG5pbXBvcnQgQnJvd3Nlck5vdFN1cHBvcnRFcnJvciBmcm9tICcuL2Vycm9ycy9icm93c2VyTm90U3VwcG9ydEVycm9yJ1xuaW1wb3J0IEdlbmVyYWxUeXBlIGZyb20gJy4vZW5naW5lcy9nZW5lcmFsVHlwZSdcbmltcG9ydCBDb250ZXh0bWVudSBmcm9tICcuL2NvbnRleHRtZW51J1xuaW1wb3J0ICogYXMgYnVpbGQgZnJvbSAnLi9idWlsZC5qc29uJ1xuXG4vKipcbiAqIOiOt+WPlueJiOacrOS/oeaBr+OAglxuICogQGFsaWFzIG9wZW5CU0UuZ2V0VmVyc2lvblxuICogQHJldHVybnMge29wZW5CU0V+VmVyc2lvbkluZm99IOeJiOacrOS/oeaBr++8muS4gOS4qiB7QGxpbmsgb3BlbkJTRX5WZXJzaW9uSW5mb30g57uT5p6E44CCXG4gKi9cbmZ1bmN0aW9uIGdldFZlcnNpb24oKSB7XG4gICAgcmV0dXJuIEhlbHBlci5jbG9uZShidWlsZCk7XG59XG5cbmV4cG9ydCB7IEdlbmVyYWxFbmdpbmUsIEJyb3dzZXJOb3RTdXBwb3J0RXJyb3IsIEdlbmVyYWxUeXBlLCBDb250ZXh0bWVudSwgZ2V0VmVyc2lvbiB9XG5cbi8qKlxuICog5pmu6YCa5by55bmV5YWo5bGA6YCJ6aG5XG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBvcGVuQlNFfmdlbmVyYWxPcHRpb25zXG4gKiBAZGVzY3JpcHRpb24gT3B0aW9uIOe7k+aehOeUqOS6juWtmOaUvuWFqOWxgOmAiemhueOAglxuICogQHByb3BlcnR5IHtudW1iZXJ9IFt2ZXJ0aWNhbEludGVydmFsPThdIC0g5by55bmV5Z6C55u06KGM6Ze06LedXG4gKiBAcHJvcGVydHkge251bWJlcn0gW3ZlcnRpY2FsSW50ZXJ2YWw9MV0gLSDlvLnluZXmkq3mlL7pgJ/luqbvvIjlgI3mlbDvvIlcbiAqIEBwcm9wZXJ0eSB7b3BlbkJTRX5jbG9ja0NhbGxiYWNrfSBbY2xvY2s9dGltZSA9PiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHN0YXJ0VGltZV0gLSDml7bpl7Tln7rlh4bvvJrmraTml7bpl7Tln7rlh4blj6/mjIflkJHkuIDkuKrmlrnms5XnlKjkuo7ojrflj5bmkq3mlL7lmajlvZPliY3ov5vluqbvvIzov5nkuKrmlrnms5Xov5Tlm57lgLzljbPkuLrmkq3mlL7ov5vluqbvvIjljZXkvY3vvJrmr6vnp5LvvInjgIJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbc2NhbGluZz0xXSDlvLnluZXnvKnmlL7mr5TkvovvvIjlgI3mlbDvvIlcbiAqIEBwcm9wZXJ0eSB7b3BlbkJTRX5CdWxsZXRTY3JlZW5TdHlsZX0gW2RlZmF1bHRTdHlsZV0g6buY6K6k5by55bmV5qC35byP77ya5LiA5LiqIHtAbGluayBvcGVuQlNFfkJ1bGxldFNjcmVlblN0eWxlfSDnu5PmnoTjgIJcbiAqIEBwcm9wZXJ0eSB7b3BlbkJTRS5HZW5lcmFsVHlwZX0gW2hpZGRlblR5cGVzPTBdIOmakOiXj+eahOW8ueW5leexu+Wei++8muS4gOS4qiB7QGxpbmsgb3BlbkJTRS5HZW5lcmFsVHlwZX0g5p6a5Li+44CC5bCG6KaB6ZqQ6JeP55qE5by55bmV57G75Z6L55u45Yqg77yMMOS4uuS4jemakOiXj+S7u+S9leexu+Wei+eahOW8ueW5leOAglxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtvcGFjaXR5PTEuMF0g5by55bmV5LiN6YCP5piO5bqm77ya5Y+W5YC86IyD5Zu0IDAuMCDliLAgMS4w77yMMC4wIOWFqOmAj+aYju+8mzEuMCDkuI3pgI/mmI7jgIJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbY3Vyc29yT25Nb3VzZU92ZXI9J3BvaW50ZXInXSDpvKDmoIfnu4/ov4fmoLflvI/vvJrlvZPpvKDmoIfnu4/ov4flvLnluZXml7bnmoTmoLflvI/vvIzlj6/orr7nva7nmoTlgLzlj6/lj4LogIMgTUROIFtjdXJzb3JdIHtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy96aC1DTi9kb2NzL1dlYi9DU1MvY3Vyc29yfSDjgIJcbiAqL1xuXG4vKipcbiAqIOaXtumXtOWfuuWHhuWbnuiwg+aWueazlVxuICogQGNhbGxiYWNrIG9wZW5CU0V+Y2xvY2tDYWxsYmFja1xuICogQGRlc2NyaXB0aW9uIENsb2NrQ2FsbGJhY2sg5Zue6LCD5pa55rOV55So5LqO5pKt5pS+5Zmo5b2T5YmN6L+b5bqm44CCXG4gKiBAcmV0dXJucyB7bnVtYmVyfSDmkq3mlL7ov5vluqbvvJrljZXkvY3vvJrmr6vnp5LjgIJcbiAqL1xuXG4vKipcbiAqIOWNleadoeW8ueW5leaVsOaNrlxuICogQHR5cGVkZWYge29iamVjdH0gb3BlbkJTRX5HZW5lcmFsQnVsbGV0U2NyZWVuXG4gKiBAZGVzY3JpcHRpb24gQnVsbGV0U2NyZWVuIOe7k+aehOeUqOS6juWtmOaUvuWNleadoeW8ueW5leaVsOaNruOAglxuICogQHByb3BlcnR5IHtzdHJpbmd9IHRleHQg5by55bmV5paH5pysXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFtjYW5EaXNjYXJkPXRydWVdIOaYr+WQpuWFgeiuuOS4ouW8g++8mu+8iOatpOWPguaVsOWcqOS6i+S7tuS4reS/ruaUueaXoOaViO+8ieWcqOW8ueW5lei/h+WkmuaXtu+8jOeoi+W6j+WwhuiHquWKqOS4ouW8g+S4gOS6m+W7tui/n+i/h+mrmOeahOW8ueW5leOAguatpOmAiemhueS4uiBmYWxzZSDml7bmnKzmnaHlvLnluZXml6DorrrlpoLkvZXpg73kuI3kvJrooqvkuKLlvIPvvIzkvb/nlKjmnKzpgInpobnnmoTlnLrmma/lpoLmnKznlKjmiLflj5HpgIHnmoTlvLnluZXjgILvvIjms6jmhI/vvJrkuI3opoHlsIblpKrlpJrnmoTlvLnluZXnmoQgY2FuRGlzY2FyZCDorr7kuLogZmFsc2XvvIwg5ZCm5YiZ5Lya5Zug6LaF5pe255qE5by55bmV5LiN5Lya6KKr5Lii5byD6ICM6YCg5oiQ5oSP5aSW55qE6Zeu6aKY44CC77yJXG4gKiBAcHJvcGVydHkge251bWJlcn0gW3N0YXJ0VGltZT1vcHRpb25zLmNsb2NrKCldIOW8ueW5lei/m+WFpeaXtumXtO+8mu+8iOatpOWPguaVsOWcqOS6i+S7tuS4reS/ruaUueaXoOaViO+8ieWNleS9je+8muavq+enku+8jOm7mOiupOS4ulvml7bpl7Tln7rlh4bvvIhvcHRpb25zLmNsb2Nr77yJXXtAbGluayBvcGVuQlNFfk9wdGlvbnN95b2T5YmN5pe26Ze044CCXG4gKiBAcHJvcGVydHkge29wZW5CU0UuR2VuZXJhbFR5cGV9IFt0eXBlPW9wZW5CU0UuR2VuZXJhbFR5cGUucmlnaHRUb0xlZnRdIOW8ueW5leexu+Wei++8mu+8iOatpOWPguaVsOWcqOS6i+S7tuS4reS/ruaUueaXoOaViO+8ieS4gOS4quexu+Wei+S4uiB7QGxpbmsgb3BlbkJTRS5CdWxsZXRTY3JlZW5UeXBlfSDnmoTmnprkuL7jgIJcbiAqIEBwcm9wZXJ0eSB7b3BlbkJTRX5CdWxsZXRTY3JlZW5TdHlsZX0gc3R5bGUg5by55bmV5qC35byP77ya5LiA5LiqIHtAbGluayBvcGVuQlNFfkJ1bGxldFNjcmVlblN0eWxlfSDnu5PmnoTjgILorr7nva7mraTpgInpobnkuK3nmoTku7vkvZXkuIDkuKrlgLzvvIzlsIbopobnm5blr7nlupTnmoTlhajlsYDorr7nva7jgIJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbbGF5ZXI9MF0g5by55bmV5bGC57qn77ya5q2k5Y+C5pWw6LaK5aSn77yM5by55bmV6LaK6Z2g5YmN44CC5LiA5p2h5by55bmV5Zyo5q+U5a6D5bGC57qn5bCP55qE5by55bmV5YmN6Z2i77yM5Zyo5q+U5a6D5bGC57qn5aSn55qE5by55bmV5ZCO6Z2i44CC5aaC5p6c5bGC57qn55u45ZCM5oyJ54Wn6L+b5YWl5pe26Ze056Gu5a6a5bGC57qn6aG65bqP44CCXG4gKiBAcHJvcGVydHkge2FueX0gbW9yZS4uLiDlhbbku5boh6rlrprkuYnlrZfmrrXvvJrvvIjlnKjkuovku7bkuK3kv67mlLnkv67mlLnmraTlj4LmlbDml6DpnIDlsIYgZS5yZWRyYXcg6K6+572u5Li6IHRydWXvvInkvovlpoIgdXVpZCDjgIEgaWQg562J44CC77yI5rOo5oSP77ya5Zug5Li65Zyo5LqL5Lu25ZON5bqU5pa55rOV5Lit6L+U5Zue55qE5by55bmV5a+56LGh5piv5Y6f5a+56LGh5YWL6ZqG55qE77yM5omA5Lul5peg5rOV55u05o6l5q+U6L6D77yM5b+F6aG75L2/55So6Ieq5a6a5LmJ5a2X5q615ZSv5LiA5qCH6K+G5LiA5p2h5by55bmV44CC77yJXG4gKi9cblxuLyoqXG4gKiDlvLnluZXmoLflvI9cbiAqIEB0eXBlZGVmIHtvYmplY3R9IG9wZW5CU0V+R2VuZXJhbEJ1bGxldFNjcmVlblN0eWxlXG4gKiBAZGVzY3JpcHRpb24gQnVsbGV0U2NyZWVuU3R5bGUg57uT5p6E55So5LqO5a2Y5pS+5by55bmV5qC35byP5L+h5oGv44CCXG4gKiBAcHJvcGVydHkge251bWJlcn0gW3NoYWRvd0JsdXI9Ml0g5by55bmV6Zi05b2x55qE5qih57OK57qn5Yir77yaMOS4uuS4jeaYvuekuumYtOW9seOAglxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtmb250V2VpZ2h0PVwiNjAwXCJdIOWtl+S9k+eyl+e7hu+8muWPr+mAieWAvO+8mmxpZ2h0ZXLvvJrmm7Tnu4bvvJtub3JtYWzvvJrmoIflh4bvvJtib2xk77ya57KX5L2T77ybYm9sZGVyOiDmm7TnspfvvJsxMDDjgIEyMDDjgIEzMDDjgIE0MDDjgIE1MDDjgIE2MDDjgIE3MDDjgIE4MDDjgIE5MDDvvJrlrprkuYnnlLHnspfliLDnu4bnmoTlrZfnrKbvvIg0MDAg562J5ZCM5LqOIG5vcm1hbO+8mzcwMCDnrYnlkIzkuo4gYm9sZO+8ieOAglxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtmb250RmFtaWx5PVwic2Fucy1zZXJpZlwiXSDlrZfkvZPns7vliJfvvJrlvLnluZXnmoTlrZfkvZPml4/lkI3np7DmiJYv5Y+K57G75peP5ZCN56ew55qE5LiA5Liq5LyY5YWI6KGo44CC77yI5rOo5oSP77ya5aaC5p6c5L2/55So5LqG55So4oCcQGZvbnQtZmFjZeKAneWumuS5ieeahOWtl+S9k++8jOivt+ehruS/neWcqOS9v+eUqOWJjeWujOWFqOWKoOi9veWujOaIkO+8jOWQpuWImeW8ueW5leWPr+iDveaXoOazleaYvuekuuOAguWmguaenOimgemihOWKoOi9vei/meS6m+Wtl+S9k++8jOW7uuiuruS9v+eUqCBbV2ViIEZvbnQgTG9hZGVyXXtAbGluayBodHRwczovL2dpdGh1Yi5jb20vdHlwZWtpdC93ZWJmb250bG9hZGVyfSDjgILvvIlcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbc2l6ZT0xOV0g5a2X5L2T5aSn5bCP77ya5Y2V5L2N77ya5YOP57Sg44CCXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2JveENvbG9yXSDlpJbmoYbpopzoibLvvJrlj4LnhadDU1PpopzoibLorr7nva7mlrnms5XvvIzkuLogbnVsbCDkuI3mmL7npLrlpJbmoYbjgIJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbY29sb3I9XCJ3aGl0ZVwiXSDlvLnluZXpopzoibLvvJrlj4LnhadDU1PpopzoibLorr7nva7mlrnms5XvvIzkuLogbnVsbCDkuI3mmL7npLrmraTlvLnluZXjgIJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbYm9yZGVyQ29sb3JdIOaPj+i+ueminOiJsu+8muWPgueFp0NTU+minOiJsuiuvue9ruaWueazle+8jOS4uiBudWxsIOayoeacieaPj+i+ueOAglxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtzcGVlZD0wLjE1XSDlvLnluZXpgJ/luqbvvJrvvIjlnKjkuovku7bkuK3kv67mlLnkv67mlLnmraTlj4LmlbDml6DpnIDlsIYgZS5yZWRyYXcg6K6+572u5Li6IHRydWXvvInljZXkvY3vvJrlg4/ntKAv5q+r56eS77yM5LuF5by55bmV57G75Z6L5Li6MOOAgTHml7bmnInmlYjjgIJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbcmVzaWRlbmNlVGltZT01MDAwXSDlvLnluZXlgZznlZnml7bpl7TvvJrvvIjmraTlj4LmlbDlnKjkuovku7bkuK3kv67mlLnml6DmlYjvvInljZXkvY3vvJrmr6vnp5LvvIzku4XlvLnluZXnsbvlnosy44CBM+aXtuacieaViOOAglxuICovXG5cbi8qKlxuICog5by55bmV5LqL5Lu2XG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBvcGVuQlNFfkdlbmVyYWxCdWxsZXRTY3JlZW5FdmVudFxuICogQHByb3BlcnR5IHtmdW5jdGlvbn0gZ2V0QnVsbGV0U2NyZWVuKCkgLSDojrflj5blvJXlj5Hkuovku7bnmoTlvLnluZXlvLnluZXnmoTmlbDmja7vvJpyZXR1bjoge0BsaW5rIG9wZW5CU0V+QnVsbGV0U2NyZWVufSDlvJXlj5Hkuovku7bnmoTlvLnluZXnmoTmlbDmja7vvJrkuIDkuKoge0BsaW5rIG9wZW5CU0V+QnVsbGV0U2NyZWVufSDnu5PmnoTjgILvvIjms6jmhI/vvJrkuI3opoHor5Xlm77kuI5b5re75Yqg5by55bmVXXtAbGluayBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZSNhZGRCdWxsZXRTY3JlZW595pe25Yib5bu655qE5a+56LGh6L+b6KGM5q+U6L6D77yM6L+Z5Liq5a+56LGh5piv5YWL6ZqG5b6X5Yiw55qE77yM5bm25LiN55u4562J44CC5q2j56Gu55qE5pa55rOV5piv5Zyo5re75Yqg5by55bmV5pe25LiA5bm25o+S5YWlIGlkIOetieiHquWumuS5ieWtl+auteadpeWUr+S4gOagh+ivhuS4gOadoeW8ueW5leOAgu+8iVxuICogQHByb3BlcnR5IHtmdW5jdGlvbn0gc2V0QnVsbGV0U2NyZWVuKGJ1bGxldFNjcmVlbixyZWRyYXcpIC0g6K6+572u5byV5Y+R5LqL5Lu255qE5by55bmV5by55bmV55qE5pWw5o2u77yacGFyYW1zOiB7QGxpbmsgb3BlbkJTRX5CdWxsZXRTY3JlZW59IGJ1bGxldFNjcmVlbiAtIOW8leWPkeS6i+S7tueahOW8ueW5leeahOaVsOaNru+8muS4gOS4qiB7QGxpbmsgb3BlbkJTRX5CdWxsZXRTY3JlZW59IOe7k+aehOOAguiuvue9ruatpOWPguaVsOS7peS+v+WKqOaAgeiwg+aVtOW8ueW5leagt+W8j++8jOS9huaYr+S4gOS6m+WPguaVsOWcqOS6i+S7tuS4reS/ruaUueaXoOaViO+8jOafpeeci+atpOe7k+aehOeahOivtOaYjuS7peS6huino+ivpuaDheOAgiBib29sZWFuIFtyZWRyYXc9ZmFsc2VdIC0g5piv5ZCm6YeN57uY5by55bmV77ya5q2k5Y+C5pWw5Zyo5q+P5qyh5byV5Y+R5LqL5Lu25pe255qE5Yid5aeL5YC85Li6IGZhbHNlIO+8jOWmguaenOS/ruaUueS6hiBidWxsZXRTY3JlZW4g5Lit55qE5YC877yM5q2k5Y+C5pWw5b+F6aG76K6+5Li6IHRydWUg44CCXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBnZXRQbGF5U3RhdGUoKSAtIOiOt+WPluW8leWPkeS6i+S7tueahOW8ueW5leeahOaSreaUvueKtuaAge+8mnJldHVuOiBib29sZWFuIOWPluW8leWPkeS6i+S7tueahOW8ueW5leaYr+WQpuWcqOaSreaUvi/np7vliqjvvJrlpoLmnpzorr7nva7kuLogdHJ1ZSDliJnor6XlvLnluZXmmoLlgZzvvIznm7TliLDlsIbmraTlj4LmlbDorr7kuLogZmFsc2Ug5oiW6LCD55SoIHtAbGluayBvcGVuQlNFLkJ1bGxldFNjcmVlbkVuZ2luZSNwbGF5QWxsQnVsbGV0U2NyZWVuc30g5pa55rOV44CCXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBzZXRQbGF5U3RhdGUocGxheSkgLSDorr7nva7lvJXlj5Hkuovku7bnmoTlvLnluZXnmoTmkq3mlL7nirbmgIHvvJpwYXJhbXM6IGJvb2xlYW4gcGFseSAtIOaYr+WQpue7p+e7reaSreaUvi/np7vliqjlvJXlj5Hkuovku7bnmoTlvLnluZXvvJror7vlj5bmraTlj4LmlbDlj6/liKTmlq3ov5nmnaHlvLnluZXmmK/lkKblpITkuo7mmoLlgZznirbmgIHjgIJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0eXBlIC0g5LqL5Lu257G75Z6L77yI5LqL5Lu25ZCN56ew77yJXG4gKiBAcHJvcGVydHkge251bWJlcn0gc2NyZWVuWCAtIOW9k+S6i+S7tuWPkeeUn+aXtu+8jOm8oOagh+ebuOWvueS6juaYvuekuuWZqOWxj+eahCBYIOWdkOagh+OAglxuICogQHByb3BlcnR5IHtudW1iZXJ9IHNjcmVlblkgLSDlvZPkuovku7blj5HnlJ/ml7bvvIzpvKDmoIfnm7jlr7nkuo7mmL7npLrlmajlsY/nmoQgWSDlnZDmoIfjgIJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjbGllbnRYIC0g5b2T5LqL5Lu25Y+R55Sf5pe277yM6byg5qCH55u45a+55LqO5rWP6KeI5Zmo5pyJ5pWI5Yy65Z+f55qEIFgg5Z2Q5qCH44CCXG4gKiBAcHJvcGVydHkge251bWJlcn0gcGFnZVggLSDlvZPkuovku7blj5HnlJ/ml7bvvIzpvKDmoIfnm7jlr7nkuo7pobXpnaLnmoQgWCDlnZDmoIfjgIJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBwYWdlWSAtIOW9k+S6i+S7tuWPkeeUn+aXtu+8jOm8oOagh+ebuOWvueS6jumhtemdoueahCBZIOWdkOagh+OAglxuICogQHByb3BlcnR5IHtudW1iZXJ9IHBhZ2VZIC0g5b2T5LqL5Lu25Y+R55Sf5pe277yM6byg5qCH55u45a+55LqO6aG16Z2i55qEIFkg5Z2Q5qCH44CCXG4gKi9cblxuLyoqXG4gKiDosIPor5Xkv6Hmga9cbiAqIEB0eXBlZGVmIHtvYmplY3R9IG9wZW5CU0V+RGVidWdJbmZvXG4gKiBAZGVzY3JpcHRpb24gRGVidWdJbmZvIOe7k+aehOeUqOS6juWtmOaUvuiwg+ivleS/oeaBr+OAglxuICogQHByb3BlcnR5IHtudW1iZXJ9IHRpbWUgLSBb5pe26Ze05Z+65YeG77yIb3B0aW9ucy5jbG9ja++8iV17QGxpbmsgb3BlbkJTRX5PcHRpb25zfeW9k+WJjeaXtumXtOOAglxuICogQHByb3BlcnR5IHtudW1iZXJ9IHJlYWxUaW1lQnVsbGV0U2NyZWVuQ291bnQgLSDlrp7ml7blvLnluZXmgLvmlbBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBidWZmZXJCdWxsZXRTY3JlZW5Db3VudCAtIOe8k+WGsuWMuuW8ueW5leaAu+aVsFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGRlbGF5IC0g5bu26L+f77ya5Y2V5L2N77ya5q+r56eS44CCXG4gKiBAcHJvcGVydHkge251bWJlcn0gZGVsYXlCdWxsZXRTY3JlZW5Db3VudCAtIOS4ouW8g+W8ueW5leaVsO+8muWboOW7tui/n+i/h+mrmOiAjOS4ouW8g+eahOW8ueW5leaAu+aVsOOAglxuICogQHByb3BlcnR5IHtudW1iZXJ9IGZwcyAtIOW4p+mike+8muWNleS9je+8muW4py/np5LjgIJcbiAqL1xuXG4vKipcbiAqIOeJiOacrOS/oeaBr1xuICogQHR5cGVkZWYge29iamVjdH0gb3BlbkJTRX5WZXJzaW9uSW5mb1xuICogQGRlc2NyaXB0aW9uIFZlcnNpb25JbmZvIOe7k+aehOeUqOS6juWtmOaUvueJiOacrOS/oeaBr+OAglxuICogQHByb3BlcnR5IHtzdHJpbmd9IHZlcnNpb24g54mI5pys5Y+3XG4gKiBAcHJvcGVydHkge3N0cmluZ30gYnVpbGREYXRlIOaehOW7uuaXpeacn++8muaXtuWMuu+8mlVUQ+OAglxuICogQHByb3BlcnR5IHtzdHJpbmd9IG5hbWUg5ZCN56ewXG4gKiBAcHJvcGVydHkge3N0cmluZ30gZGVzY3JpcHRpb24g5o+P6L+wXG4gKiBAcHJvcGVydHkge3N0cmluZ30gaG9tZSDkuLvpobVcbiAqLyJdLCJmaWxlIjoib3BlbkJTRS5qcyJ9
