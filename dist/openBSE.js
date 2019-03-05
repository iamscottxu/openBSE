"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getVersion = getVersion;
Object.defineProperty(exports, "BulletScreenEngine", {
  enumerable: true,
  get: function get() {
    return _bulletScreenEngine.BulletScreenEngine;
  }
});
Object.defineProperty(exports, "BrowserNotSupportError", {
  enumerable: true,
  get: function get() {
    return _browserNotSupportError.BrowserNotSupportError;
  }
});
Object.defineProperty(exports, "BulletScreenType", {
  enumerable: true,
  get: function get() {
    return _bulletScreenType.BulletScreenType;
  }
});
Object.defineProperty(exports, "Contextmenu", {
  enumerable: true,
  get: function get() {
    return _contextmenu.Contextmenu;
  }
});

var _helper = require("./lib/helper");

var _bulletScreenEngine = require("./bulletScreenEngine");

var _browserNotSupportError = require("./browserNotSupportError");

var _bulletScreenType = require("./bulletScreenType");

var _contextmenu = require("./contextmenu");

var build = _interopRequireWildcard(require("./build.json"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/**
 * 获取版本信息。
 * @alias openBSE.getVersion
 * @returns {openBSE~VersionInfo} 版本信息：一个 {@link openBSE~VersionInfo} 结构。
 */
function getVersion() {
  return _helper.Helper.clone(build);
}
/**
 * 全局选项
 * @typedef {object} openBSE~Options
 * @description Option 结构用于存放全局选项。
 * @property {number} [verticalInterval=8] - 弹幕垂直行间距
 * @property {number} [verticalInterval=1] - 弹幕播放速度（倍数）
 * @property {openBSE~clockCallback} [clock=time => new Date().getTime() - startTime] - 时间基准：此时间基准可指向一个方法用于获取播放器当前进度，这个方法返回值即为播放进度（单位：毫秒）。
 * @property {number} [scaling=1] 弹幕缩放比例（倍数）
 * @property {openBSE~BulletScreenStyle} [defaultStyle] 默认弹幕样式：一个 {@link openBSE~BulletScreenStyle} 结构。
 * @property {openBSE.BulletScreenType} [hiddenTypes=0] 隐藏的弹幕类型：一个 {@link openBSE.BulletScreenType} 枚举。将要隐藏的弹幕类型相加，0为不隐藏任何类型的弹幕。
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
 * @typedef {object} openBSE~BulletScreen
 * @description BulletScreen 结构用于存放单条弹幕数据。
 * @property {string} text 弹幕文本
 * @property {boolean} [canDiscard=true] 是否允许丢弃：（此参数在事件中修改无效）在弹幕过多时，程序将自动丢弃一些延迟过高的弹幕。此选项为 false 时本条弹幕无论如何都不会被丢弃，使用本选项的场景如本用户发送的弹幕。（注意：不要将太多的弹幕的 canDiscard 设为 false， 否则会因超时的弹幕不会被丢弃而造成意外的问题。）
 * @property {number} [startTime=options.clock()] 弹幕进入时间：（此参数在事件中修改无效）单位：毫秒，默认为[时间基准（options.clock）]{@link openBSE~Options}当前时间。
 * @property {openBSE.BulletScreenType} [type=openBSE.BulletScreenType.rightToLeft] 弹幕类型：（此参数在事件中修改无效）一个类型为 {@link openBSE.BulletScreenType} 的枚举。
 * @property {openBSE~BulletScreenStyle} style 弹幕样式：一个 {@link openBSE~BulletScreenStyle} 结构。设置此选项中的任何一个值，将覆盖对应的全局设置。
 * @property {number} [layer=0] 弹幕层级：此参数越大，弹幕越靠前。一条弹幕在比它层级小的弹幕前面，在比它层级大的弹幕后面。如果层级相同按照进入时间确定层级顺序。
 * @property {any} more... 其他自定义字段：（在事件中修改修改此参数无需将 e.redraw 设置为 true）例如 uuid 、 id 等。（注意：因为在事件响应方法中返回的弹幕对象是原对象克隆的，所以无法直接比较，必须使用自定义字段唯一标识一条弹幕。）
 */

/**
 * 弹幕样式
 * @typedef {object} openBSE~BulletScreenStyle
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
 * @typedef {object} openBSE~BulletScreenEvent
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
 * @property {number} time [时间基准（options.clock）]{@link openBSE~Options}当前时间。
 * @property {number} bulletScreensOnScreenCount 实时弹幕总数
 * @property {number} bulletScreensCount 剩余弹幕总数
 * @property {number} delay 延迟：单位：毫秒。
 * @property {number} delayBulletScreensCount 丢弃弹幕数：因延迟过高而丢弃的弹幕总数。
 * @property {number} fps 帧频：单位：帧/秒。
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9wZW5CU0UuanMiXSwibmFtZXMiOlsiZ2V0VmVyc2lvbiIsIkhlbHBlciIsImNsb25lIiwiYnVpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUE7Ozs7O0FBS0EsU0FBU0EsVUFBVCxHQUFzQjtBQUNsQixTQUFPQyxlQUFPQyxLQUFQLENBQWFDLEtBQWIsQ0FBUDtBQUNIO0FBSUQ7Ozs7Ozs7Ozs7Ozs7O0FBY0E7Ozs7Ozs7QUFPQTs7Ozs7Ozs7Ozs7OztBQWFBOzs7Ozs7Ozs7Ozs7Ozs7QUFlQTs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQTs7Ozs7Ozs7Ozs7O0FBWUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIZWxwZXIgfSBmcm9tICcuL2xpYi9oZWxwZXInXG5pbXBvcnQgeyBCdWxsZXRTY3JlZW5FbmdpbmUgfSBmcm9tICcuL2J1bGxldFNjcmVlbkVuZ2luZSdcbmltcG9ydCB7IEJyb3dzZXJOb3RTdXBwb3J0RXJyb3IgfSBmcm9tICcuL2Jyb3dzZXJOb3RTdXBwb3J0RXJyb3InXG5pbXBvcnQgeyBCdWxsZXRTY3JlZW5UeXBlIH0gZnJvbSAnLi9idWxsZXRTY3JlZW5UeXBlJ1xuaW1wb3J0IHsgQ29udGV4dG1lbnUgfSBmcm9tICcuL2NvbnRleHRtZW51J1xuaW1wb3J0ICogYXMgYnVpbGQgZnJvbSAnLi9idWlsZC5qc29uJ1xuXG4vKipcbiAqIOiOt+WPlueJiOacrOS/oeaBr+OAglxuICogQGFsaWFzIG9wZW5CU0UuZ2V0VmVyc2lvblxuICogQHJldHVybnMge29wZW5CU0V+VmVyc2lvbkluZm99IOeJiOacrOS/oeaBr++8muS4gOS4qiB7QGxpbmsgb3BlbkJTRX5WZXJzaW9uSW5mb30g57uT5p6E44CCXG4gKi9cbmZ1bmN0aW9uIGdldFZlcnNpb24oKSB7XG4gICAgcmV0dXJuIEhlbHBlci5jbG9uZShidWlsZCk7XG59XG5cbmV4cG9ydCB7IEJ1bGxldFNjcmVlbkVuZ2luZSwgQnJvd3Nlck5vdFN1cHBvcnRFcnJvciwgQnVsbGV0U2NyZWVuVHlwZSwgQ29udGV4dG1lbnUsIGdldFZlcnNpb24gfVxuXG4vKipcbiAqIOWFqOWxgOmAiemhuVxuICogQHR5cGVkZWYge29iamVjdH0gb3BlbkJTRX5PcHRpb25zXG4gKiBAZGVzY3JpcHRpb24gT3B0aW9uIOe7k+aehOeUqOS6juWtmOaUvuWFqOWxgOmAiemhueOAglxuICogQHByb3BlcnR5IHtudW1iZXJ9IFt2ZXJ0aWNhbEludGVydmFsPThdIC0g5by55bmV5Z6C55u06KGM6Ze06LedXG4gKiBAcHJvcGVydHkge251bWJlcn0gW3ZlcnRpY2FsSW50ZXJ2YWw9MV0gLSDlvLnluZXmkq3mlL7pgJ/luqbvvIjlgI3mlbDvvIlcbiAqIEBwcm9wZXJ0eSB7b3BlbkJTRX5jbG9ja0NhbGxiYWNrfSBbY2xvY2s9dGltZSA9PiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHN0YXJ0VGltZV0gLSDml7bpl7Tln7rlh4bvvJrmraTml7bpl7Tln7rlh4blj6/mjIflkJHkuIDkuKrmlrnms5XnlKjkuo7ojrflj5bmkq3mlL7lmajlvZPliY3ov5vluqbvvIzov5nkuKrmlrnms5Xov5Tlm57lgLzljbPkuLrmkq3mlL7ov5vluqbvvIjljZXkvY3vvJrmr6vnp5LvvInjgIJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbc2NhbGluZz0xXSDlvLnluZXnvKnmlL7mr5TkvovvvIjlgI3mlbDvvIlcbiAqIEBwcm9wZXJ0eSB7b3BlbkJTRX5CdWxsZXRTY3JlZW5TdHlsZX0gW2RlZmF1bHRTdHlsZV0g6buY6K6k5by55bmV5qC35byP77ya5LiA5LiqIHtAbGluayBvcGVuQlNFfkJ1bGxldFNjcmVlblN0eWxlfSDnu5PmnoTjgIJcbiAqIEBwcm9wZXJ0eSB7b3BlbkJTRS5CdWxsZXRTY3JlZW5UeXBlfSBbaGlkZGVuVHlwZXM9MF0g6ZqQ6JeP55qE5by55bmV57G75Z6L77ya5LiA5LiqIHtAbGluayBvcGVuQlNFLkJ1bGxldFNjcmVlblR5cGV9IOaemuS4vuOAguWwhuimgemakOiXj+eahOW8ueW5leexu+Wei+ebuOWKoO+8jDDkuLrkuI3pmpDol4/ku7vkvZXnsbvlnovnmoTlvLnluZXjgIJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbb3BhY2l0eT0xLjBdIOW8ueW5leS4jemAj+aYjuW6pu+8muWPluWAvOiMg+WbtCAwLjAg5YiwIDEuMO+8jDAuMCDlhajpgI/mmI7vvJsxLjAg5LiN6YCP5piO44CCXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2N1cnNvck9uTW91c2VPdmVyPSdwb2ludGVyJ10g6byg5qCH57uP6L+H5qC35byP77ya5b2T6byg5qCH57uP6L+H5by55bmV5pe255qE5qC35byP77yM5Y+v6K6+572u55qE5YC85Y+v5Y+C6ICDIE1ETiBbY3Vyc29yXSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvemgtQ04vZG9jcy9XZWIvQ1NTL2N1cnNvcn0g44CCXG4gKi9cblxuLyoqXG4gKiDml7bpl7Tln7rlh4blm57osIPmlrnms5VcbiAqIEBjYWxsYmFjayBvcGVuQlNFfmNsb2NrQ2FsbGJhY2tcbiAqIEBkZXNjcmlwdGlvbiBDbG9ja0NhbGxiYWNrIOWbnuiwg+aWueazleeUqOS6juaSreaUvuWZqOW9k+WJjei/m+W6puOAglxuICogQHJldHVybnMge251bWJlcn0g5pKt5pS+6L+b5bqm77ya5Y2V5L2N77ya5q+r56eS44CCXG4gKi9cblxuLyoqXG4gKiDljZXmnaHlvLnluZXmlbDmja5cbiAqIEB0eXBlZGVmIHtvYmplY3R9IG9wZW5CU0V+QnVsbGV0U2NyZWVuXG4gKiBAZGVzY3JpcHRpb24gQnVsbGV0U2NyZWVuIOe7k+aehOeUqOS6juWtmOaUvuWNleadoeW8ueW5leaVsOaNruOAglxuICogQHByb3BlcnR5IHtzdHJpbmd9IHRleHQg5by55bmV5paH5pysXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFtjYW5EaXNjYXJkPXRydWVdIOaYr+WQpuWFgeiuuOS4ouW8g++8mu+8iOatpOWPguaVsOWcqOS6i+S7tuS4reS/ruaUueaXoOaViO+8ieWcqOW8ueW5lei/h+WkmuaXtu+8jOeoi+W6j+WwhuiHquWKqOS4ouW8g+S4gOS6m+W7tui/n+i/h+mrmOeahOW8ueW5leOAguatpOmAiemhueS4uiBmYWxzZSDml7bmnKzmnaHlvLnluZXml6DorrrlpoLkvZXpg73kuI3kvJrooqvkuKLlvIPvvIzkvb/nlKjmnKzpgInpobnnmoTlnLrmma/lpoLmnKznlKjmiLflj5HpgIHnmoTlvLnluZXjgILvvIjms6jmhI/vvJrkuI3opoHlsIblpKrlpJrnmoTlvLnluZXnmoQgY2FuRGlzY2FyZCDorr7kuLogZmFsc2XvvIwg5ZCm5YiZ5Lya5Zug6LaF5pe255qE5by55bmV5LiN5Lya6KKr5Lii5byD6ICM6YCg5oiQ5oSP5aSW55qE6Zeu6aKY44CC77yJXG4gKiBAcHJvcGVydHkge251bWJlcn0gW3N0YXJ0VGltZT1vcHRpb25zLmNsb2NrKCldIOW8ueW5lei/m+WFpeaXtumXtO+8mu+8iOatpOWPguaVsOWcqOS6i+S7tuS4reS/ruaUueaXoOaViO+8ieWNleS9je+8muavq+enku+8jOm7mOiupOS4ulvml7bpl7Tln7rlh4bvvIhvcHRpb25zLmNsb2Nr77yJXXtAbGluayBvcGVuQlNFfk9wdGlvbnN95b2T5YmN5pe26Ze044CCXG4gKiBAcHJvcGVydHkge29wZW5CU0UuQnVsbGV0U2NyZWVuVHlwZX0gW3R5cGU9b3BlbkJTRS5CdWxsZXRTY3JlZW5UeXBlLnJpZ2h0VG9MZWZ0XSDlvLnluZXnsbvlnovvvJrvvIjmraTlj4LmlbDlnKjkuovku7bkuK3kv67mlLnml6DmlYjvvInkuIDkuKrnsbvlnovkuLoge0BsaW5rIG9wZW5CU0UuQnVsbGV0U2NyZWVuVHlwZX0g55qE5p6a5Li+44CCXG4gKiBAcHJvcGVydHkge29wZW5CU0V+QnVsbGV0U2NyZWVuU3R5bGV9IHN0eWxlIOW8ueW5leagt+W8j++8muS4gOS4qiB7QGxpbmsgb3BlbkJTRX5CdWxsZXRTY3JlZW5TdHlsZX0g57uT5p6E44CC6K6+572u5q2k6YCJ6aG55Lit55qE5Lu75L2V5LiA5Liq5YC877yM5bCG6KaG55uW5a+55bqU55qE5YWo5bGA6K6+572u44CCXG4gKiBAcHJvcGVydHkge251bWJlcn0gW2xheWVyPTBdIOW8ueW5leWxgue6p++8muatpOWPguaVsOi2iuWkp++8jOW8ueW5lei2iumdoOWJjeOAguS4gOadoeW8ueW5leWcqOavlOWug+Wxgue6p+Wwj+eahOW8ueW5leWJjemdou+8jOWcqOavlOWug+Wxgue6p+Wkp+eahOW8ueW5leWQjumdouOAguWmguaenOWxgue6p+ebuOWQjOaMieeFp+i/m+WFpeaXtumXtOehruWumuWxgue6p+mhuuW6j+OAglxuICogQHByb3BlcnR5IHthbnl9IG1vcmUuLi4g5YW25LuW6Ieq5a6a5LmJ5a2X5q6177ya77yI5Zyo5LqL5Lu25Lit5L+u5pS55L+u5pS55q2k5Y+C5pWw5peg6ZyA5bCGIGUucmVkcmF3IOiuvue9ruS4uiB0cnVl77yJ5L6L5aaCIHV1aWQg44CBIGlkIOetieOAgu+8iOazqOaEj++8muWboOS4uuWcqOS6i+S7tuWTjeW6lOaWueazleS4rei/lOWbnueahOW8ueW5leWvueixoeaYr+WOn+WvueixoeWFi+mahueahO+8jOaJgOS7peaXoOazleebtOaOpeavlOi+g++8jOW/hemhu+S9v+eUqOiHquWumuS5ieWtl+auteWUr+S4gOagh+ivhuS4gOadoeW8ueW5leOAgu+8iVxuICovXG5cbi8qKlxuICog5by55bmV5qC35byPXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBvcGVuQlNFfkJ1bGxldFNjcmVlblN0eWxlXG4gKiBAZGVzY3JpcHRpb24gQnVsbGV0U2NyZWVuU3R5bGUg57uT5p6E55So5LqO5a2Y5pS+5by55bmV5qC35byP5L+h5oGv44CCXG4gKiBAcHJvcGVydHkge251bWJlcn0gW3NoYWRvd0JsdXI9Ml0g5by55bmV6Zi05b2x55qE5qih57OK57qn5Yir77yaMOS4uuS4jeaYvuekuumYtOW9seOAglxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtmb250V2VpZ2h0PVwiNjAwXCJdIOWtl+S9k+eyl+e7hu+8muWPr+mAieWAvO+8mmxpZ2h0ZXLvvJrmm7Tnu4bvvJtub3JtYWzvvJrmoIflh4bvvJtib2xk77ya57KX5L2T77ybYm9sZGVyOiDmm7TnspfvvJsxMDDjgIEyMDDjgIEzMDDjgIE0MDDjgIE1MDDjgIE2MDDjgIE3MDDjgIE4MDDjgIE5MDDvvJrlrprkuYnnlLHnspfliLDnu4bnmoTlrZfnrKbvvIg0MDAg562J5ZCM5LqOIG5vcm1hbO+8mzcwMCDnrYnlkIzkuo4gYm9sZO+8ieOAglxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtmb250RmFtaWx5PVwic2Fucy1zZXJpZlwiXSDlrZfkvZPns7vliJfvvJrlvLnluZXnmoTlrZfkvZPml4/lkI3np7DmiJYv5Y+K57G75peP5ZCN56ew55qE5LiA5Liq5LyY5YWI6KGo44CC77yI5rOo5oSP77ya5aaC5p6c5L2/55So5LqG55So4oCcQGZvbnQtZmFjZeKAneWumuS5ieeahOWtl+S9k++8jOivt+ehruS/neWcqOS9v+eUqOWJjeWujOWFqOWKoOi9veWujOaIkO+8jOWQpuWImeW8ueW5leWPr+iDveaXoOazleaYvuekuuOAguWmguaenOimgemihOWKoOi9vei/meS6m+Wtl+S9k++8jOW7uuiuruS9v+eUqCBbV2ViIEZvbnQgTG9hZGVyXXtAbGluayBodHRwczovL2dpdGh1Yi5jb20vdHlwZWtpdC93ZWJmb250bG9hZGVyfSDjgILvvIlcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbc2l6ZT0xOV0g5a2X5L2T5aSn5bCP77ya5Y2V5L2N77ya5YOP57Sg44CCXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2JveENvbG9yXSDlpJbmoYbpopzoibLvvJrlj4LnhadDU1PpopzoibLorr7nva7mlrnms5XvvIzkuLogbnVsbCDkuI3mmL7npLrlpJbmoYbjgIJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbY29sb3I9XCJ3aGl0ZVwiXSDlvLnluZXpopzoibLvvJrlj4LnhadDU1PpopzoibLorr7nva7mlrnms5XvvIzkuLogbnVsbCDkuI3mmL7npLrmraTlvLnluZXjgIJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbYm9yZGVyQ29sb3JdIOaPj+i+ueminOiJsu+8muWPgueFp0NTU+minOiJsuiuvue9ruaWueazle+8jOS4uiBudWxsIOayoeacieaPj+i+ueOAglxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtzcGVlZD0wLjE1XSDlvLnluZXpgJ/luqbvvJrvvIjlnKjkuovku7bkuK3kv67mlLnkv67mlLnmraTlj4LmlbDml6DpnIDlsIYgZS5yZWRyYXcg6K6+572u5Li6IHRydWXvvInljZXkvY3vvJrlg4/ntKAv5q+r56eS77yM5LuF5by55bmV57G75Z6L5Li6MOOAgTHml7bmnInmlYjjgIJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbcmVzaWRlbmNlVGltZT01MDAwXSDlvLnluZXlgZznlZnml7bpl7TvvJrvvIjmraTlj4LmlbDlnKjkuovku7bkuK3kv67mlLnml6DmlYjvvInljZXkvY3vvJrmr6vnp5LvvIzku4XlvLnluZXnsbvlnosy44CBM+aXtuacieaViOOAglxuICovXG5cbi8qKlxuICog5by55bmV5LqL5Lu2XG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBvcGVuQlNFfkJ1bGxldFNjcmVlbkV2ZW50XG4gKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBnZXRCdWxsZXRTY3JlZW4oKSAtIOiOt+WPluW8leWPkeS6i+S7tueahOW8ueW5leW8ueW5leeahOaVsOaNru+8mnJldHVuOiB7QGxpbmsgb3BlbkJTRX5CdWxsZXRTY3JlZW59IOW8leWPkeS6i+S7tueahOW8ueW5leeahOaVsOaNru+8muS4gOS4qiB7QGxpbmsgb3BlbkJTRX5CdWxsZXRTY3JlZW59IOe7k+aehOOAgu+8iOazqOaEj++8muS4jeimgeivleWbvuS4jlvmt7vliqDlvLnluZVde0BsaW5rIG9wZW5CU0UuQnVsbGV0U2NyZWVuRW5naW5lI2FkZEJ1bGxldFNjcmVlbn3ml7bliJvlu7rnmoTlr7nosaHov5vooYzmr5TovoPvvIzov5nkuKrlr7nosaHmmK/lhYvpmoblvpfliLDnmoTvvIzlubbkuI3nm7jnrYnjgILmraPnoa7nmoTmlrnms5XmmK/lnKjmt7vliqDlvLnluZXml7bkuIDlubbmj5LlhaUgaWQg562J6Ieq5a6a5LmJ5a2X5q615p2l5ZSv5LiA5qCH6K+G5LiA5p2h5by55bmV44CC77yJXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBzZXRCdWxsZXRTY3JlZW4oYnVsbGV0U2NyZWVuLHJlZHJhdykgLSDorr7nva7lvJXlj5Hkuovku7bnmoTlvLnluZXlvLnluZXnmoTmlbDmja7vvJpwYXJhbXM6IHtAbGluayBvcGVuQlNFfkJ1bGxldFNjcmVlbn0gYnVsbGV0U2NyZWVuIC0g5byV5Y+R5LqL5Lu255qE5by55bmV55qE5pWw5o2u77ya5LiA5LiqIHtAbGluayBvcGVuQlNFfkJ1bGxldFNjcmVlbn0g57uT5p6E44CC6K6+572u5q2k5Y+C5pWw5Lul5L6/5Yqo5oCB6LCD5pW05by55bmV5qC35byP77yM5L2G5piv5LiA5Lqb5Y+C5pWw5Zyo5LqL5Lu25Lit5L+u5pS55peg5pWI77yM5p+l55yL5q2k57uT5p6E55qE6K+05piO5Lul5LqG6Kej6K+m5oOF44CCIGJvb2xlYW4gW3JlZHJhdz1mYWxzZV0gLSDmmK/lkKbph43nu5jlvLnluZXvvJrmraTlj4LmlbDlnKjmr4/mrKHlvJXlj5Hkuovku7bml7bnmoTliJ3lp4vlgLzkuLogZmFsc2Ug77yM5aaC5p6c5L+u5pS55LqGIGJ1bGxldFNjcmVlbiDkuK3nmoTlgLzvvIzmraTlj4LmlbDlv4Xpobvorr7kuLogdHJ1ZSDjgIJcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IGdldFBsYXlTdGF0ZSgpIC0g6I635Y+W5byV5Y+R5LqL5Lu255qE5by55bmV55qE5pKt5pS+54q25oCB77yacmV0dW46IGJvb2xlYW4g5Y+W5byV5Y+R5LqL5Lu255qE5by55bmV5piv5ZCm5Zyo5pKt5pS+L+enu+WKqO+8muWmguaenOiuvue9ruS4uiB0cnVlIOWImeivpeW8ueW5leaaguWBnO+8jOebtOWIsOWwhuatpOWPguaVsOiuvuS4uiBmYWxzZSDmiJbosIPnlKgge0BsaW5rIG9wZW5CU0UuQnVsbGV0U2NyZWVuRW5naW5lI3BsYXlBbGxCdWxsZXRTY3JlZW5zfSDmlrnms5XjgIJcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IHNldFBsYXlTdGF0ZShwbGF5KSAtIOiuvue9ruW8leWPkeS6i+S7tueahOW8ueW5leeahOaSreaUvueKtuaAge+8mnBhcmFtczogYm9vbGVhbiBwYWx5IC0g5piv5ZCm57un57ut5pKt5pS+L+enu+WKqOW8leWPkeS6i+S7tueahOW8ueW5le+8muivu+WPluatpOWPguaVsOWPr+WIpOaWrei/meadoeW8ueW5leaYr+WQpuWkhOS6juaaguWBnOeKtuaAgeOAglxuICogQHByb3BlcnR5IHtzdHJpbmd9IHR5cGUgLSDkuovku7bnsbvlnovvvIjkuovku7blkI3np7DvvIlcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzY3JlZW5YIC0g5b2T5LqL5Lu25Y+R55Sf5pe277yM6byg5qCH55u45a+55LqO5pi+56S65Zmo5bGP55qEIFgg5Z2Q5qCH44CCXG4gKiBAcHJvcGVydHkge251bWJlcn0gc2NyZWVuWSAtIOW9k+S6i+S7tuWPkeeUn+aXtu+8jOm8oOagh+ebuOWvueS6juaYvuekuuWZqOWxj+eahCBZIOWdkOagh+OAglxuICogQHByb3BlcnR5IHtudW1iZXJ9IGNsaWVudFggLSDlvZPkuovku7blj5HnlJ/ml7bvvIzpvKDmoIfnm7jlr7nkuo7mtY/op4jlmajmnInmlYjljLrln5/nmoQgWCDlnZDmoIfjgIJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBwYWdlWCAtIOW9k+S6i+S7tuWPkeeUn+aXtu+8jOm8oOagh+ebuOWvueS6jumhtemdoueahCBYIOWdkOagh+OAglxuICogQHByb3BlcnR5IHtudW1iZXJ9IHBhZ2VZIC0g5b2T5LqL5Lu25Y+R55Sf5pe277yM6byg5qCH55u45a+55LqO6aG16Z2i55qEIFkg5Z2Q5qCH44CCXG4gKiBAcHJvcGVydHkge251bWJlcn0gcGFnZVkgLSDlvZPkuovku7blj5HnlJ/ml7bvvIzpvKDmoIfnm7jlr7nkuo7pobXpnaLnmoQgWSDlnZDmoIfjgIJcbiAqL1xuXG4vKipcbiAqIOiwg+ivleS/oeaBr1xuICogQHR5cGVkZWYge29iamVjdH0gb3BlbkJTRX5EZWJ1Z0luZm9cbiAqIEBkZXNjcmlwdGlvbiBEZWJ1Z0luZm8g57uT5p6E55So5LqO5a2Y5pS+6LCD6K+V5L+h5oGv44CCXG4gKiBAcHJvcGVydHkge251bWJlcn0gdGltZSBb5pe26Ze05Z+65YeG77yIb3B0aW9ucy5jbG9ja++8iV17QGxpbmsgb3BlbkJTRX5PcHRpb25zfeW9k+WJjeaXtumXtOOAglxuICogQHByb3BlcnR5IHtudW1iZXJ9IGJ1bGxldFNjcmVlbnNPblNjcmVlbkNvdW50IOWunuaXtuW8ueW5leaAu+aVsFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGJ1bGxldFNjcmVlbnNDb3VudCDliankvZnlvLnluZXmgLvmlbBcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBkZWxheSDlu7bov5/vvJrljZXkvY3vvJrmr6vnp5LjgIJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBkZWxheUJ1bGxldFNjcmVlbnNDb3VudCDkuKLlvIPlvLnluZXmlbDvvJrlm6Dlu7bov5/ov4fpq5jogIzkuKLlvIPnmoTlvLnluZXmgLvmlbDjgIJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBmcHMg5bin6aKR77ya5Y2V5L2N77ya5binL+enkuOAglxuICovXG5cbi8qKlxuICog54mI5pys5L+h5oGvXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBvcGVuQlNFflZlcnNpb25JbmZvXG4gKiBAZGVzY3JpcHRpb24gVmVyc2lvbkluZm8g57uT5p6E55So5LqO5a2Y5pS+54mI5pys5L+h5oGv44CCXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdmVyc2lvbiDniYjmnKzlj7dcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBidWlsZERhdGUg5p6E5bu65pel5pyf77ya5pe25Yy677yaVVRD44CCXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbmFtZSDlkI3np7BcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBkZXNjcmlwdGlvbiDmj4/ov7BcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBob21lIOS4u+mhtVxuICovIl0sImZpbGUiOiJvcGVuQlNFLmpzIn0=
