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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9wZW5CU0UuanMiXSwibmFtZXMiOlsiZ2V0VmVyc2lvbiIsIkhlbHBlciIsImNsb25lIiwiYnVpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUE7Ozs7O0FBS0EsU0FBU0EsVUFBVCxHQUFzQjtBQUNsQixTQUFPQyxlQUFPQyxLQUFQLENBQWFDLEtBQWIsQ0FBUDtBQUNIO0FBSUQ7Ozs7Ozs7Ozs7Ozs7O0FBY0E7Ozs7Ozs7QUFPQTs7Ozs7Ozs7Ozs7OztBQWFBOzs7Ozs7Ozs7Ozs7Ozs7QUFlQTs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQTs7Ozs7Ozs7Ozs7O0FBWUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIZWxwZXIgfSBmcm9tICcuL2xpYi9oZWxwZXInXHJcbmltcG9ydCB7IEJ1bGxldFNjcmVlbkVuZ2luZSB9IGZyb20gJy4vYnVsbGV0U2NyZWVuRW5naW5lJ1xyXG5pbXBvcnQgeyBCcm93c2VyTm90U3VwcG9ydEVycm9yIH0gZnJvbSAnLi9icm93c2VyTm90U3VwcG9ydEVycm9yJ1xyXG5pbXBvcnQgeyBCdWxsZXRTY3JlZW5UeXBlIH0gZnJvbSAnLi9idWxsZXRTY3JlZW5UeXBlJ1xyXG5pbXBvcnQgeyBDb250ZXh0bWVudSB9IGZyb20gJy4vY29udGV4dG1lbnUnXHJcbmltcG9ydCAqIGFzIGJ1aWxkIGZyb20gJy4vYnVpbGQuanNvbidcclxuXHJcbi8qKlxyXG4gKiDojrflj5bniYjmnKzkv6Hmga/jgIJcclxuICogQGFsaWFzIG9wZW5CU0UuZ2V0VmVyc2lvblxyXG4gKiBAcmV0dXJucyB7b3BlbkJTRX5WZXJzaW9uSW5mb30g54mI5pys5L+h5oGv77ya5LiA5LiqIHtAbGluayBvcGVuQlNFflZlcnNpb25JbmZvfSDnu5PmnoTjgIJcclxuICovXHJcbmZ1bmN0aW9uIGdldFZlcnNpb24oKSB7XHJcbiAgICByZXR1cm4gSGVscGVyLmNsb25lKGJ1aWxkKTtcclxufVxyXG5cclxuZXhwb3J0IHsgQnVsbGV0U2NyZWVuRW5naW5lLCBCcm93c2VyTm90U3VwcG9ydEVycm9yLCBCdWxsZXRTY3JlZW5UeXBlLCBDb250ZXh0bWVudSwgZ2V0VmVyc2lvbiB9XHJcblxyXG4vKipcclxuICog5YWo5bGA6YCJ6aG5XHJcbiAqIEB0eXBlZGVmIHtvYmplY3R9IG9wZW5CU0V+T3B0aW9uc1xyXG4gKiBAZGVzY3JpcHRpb24gT3B0aW9uIOe7k+aehOeUqOS6juWtmOaUvuWFqOWxgOmAiemhueOAglxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gW3ZlcnRpY2FsSW50ZXJ2YWw9OF0gLSDlvLnluZXlnoLnm7TooYzpl7Tot51cclxuICogQHByb3BlcnR5IHtudW1iZXJ9IFt2ZXJ0aWNhbEludGVydmFsPTFdIC0g5by55bmV5pKt5pS+6YCf5bqm77yI5YCN5pWw77yJXHJcbiAqIEBwcm9wZXJ0eSB7b3BlbkJTRX5jbG9ja0NhbGxiYWNrfSBbY2xvY2s9dGltZSA9PiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHN0YXJ0VGltZV0gLSDml7bpl7Tln7rlh4bvvJrmraTml7bpl7Tln7rlh4blj6/mjIflkJHkuIDkuKrmlrnms5XnlKjkuo7ojrflj5bmkq3mlL7lmajlvZPliY3ov5vluqbvvIzov5nkuKrmlrnms5Xov5Tlm57lgLzljbPkuLrmkq3mlL7ov5vluqbvvIjljZXkvY3vvJrmr6vnp5LvvInjgIJcclxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtzY2FsaW5nPTFdIOW8ueW5lee8qeaUvuavlOS+i++8iOWAjeaVsO+8iVxyXG4gKiBAcHJvcGVydHkge29wZW5CU0V+QnVsbGV0U2NyZWVuU3R5bGV9IFtkZWZhdWx0U3R5bGVdIOm7mOiupOW8ueW5leagt+W8j++8muS4gOS4qiB7QGxpbmsgb3BlbkJTRX5CdWxsZXRTY3JlZW5TdHlsZX0g57uT5p6E44CCXHJcbiAqIEBwcm9wZXJ0eSB7b3BlbkJTRS5CdWxsZXRTY3JlZW5UeXBlfSBbaGlkZGVuVHlwZXM9MF0g6ZqQ6JeP55qE5by55bmV57G75Z6L77ya5LiA5LiqIHtAbGluayBvcGVuQlNFLkJ1bGxldFNjcmVlblR5cGV9IOaemuS4vuOAguWwhuimgemakOiXj+eahOW8ueW5leexu+Wei+ebuOWKoO+8jDDkuLrkuI3pmpDol4/ku7vkvZXnsbvlnovnmoTlvLnluZXjgIJcclxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtvcGFjaXR5PTEuMF0g5by55bmV5LiN6YCP5piO5bqm77ya5Y+W5YC86IyD5Zu0IDAuMCDliLAgMS4w77yMMC4wIOWFqOmAj+aYju+8mzEuMCDkuI3pgI/mmI7jgIJcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtjdXJzb3JPbk1vdXNlT3Zlcj0ncG9pbnRlciddIOm8oOagh+e7j+i/h+agt+W8j++8muW9k+m8oOagh+e7j+i/h+W8ueW5leaXtueahOagt+W8j++8jOWPr+iuvue9rueahOWAvOWPr+WPguiAgyBNRE4gW2N1cnNvcl0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3poLUNOL2RvY3MvV2ViL0NTUy9jdXJzb3J9IOOAglxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiDml7bpl7Tln7rlh4blm57osIPmlrnms5VcclxuICogQGNhbGxiYWNrIG9wZW5CU0V+Y2xvY2tDYWxsYmFja1xyXG4gKiBAZGVzY3JpcHRpb24gQ2xvY2tDYWxsYmFjayDlm57osIPmlrnms5XnlKjkuo7mkq3mlL7lmajlvZPliY3ov5vluqbjgIJcclxuICogQHJldHVybnMge251bWJlcn0g5pKt5pS+6L+b5bqm77ya5Y2V5L2N77ya5q+r56eS44CCXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIOWNleadoeW8ueW5leaVsOaNrlxyXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBvcGVuQlNFfkJ1bGxldFNjcmVlblxyXG4gKiBAZGVzY3JpcHRpb24gQnVsbGV0U2NyZWVuIOe7k+aehOeUqOS6juWtmOaUvuWNleadoeW8ueW5leaVsOaNruOAglxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdGV4dCDlvLnluZXmlofmnKxcclxuICogQHByb3BlcnR5IHtib29sZWFufSBbY2FuRGlzY2FyZD10cnVlXSDmmK/lkKblhYHorrjkuKLlvIPvvJrvvIjmraTlj4LmlbDlnKjkuovku7bkuK3kv67mlLnml6DmlYjvvInlnKjlvLnluZXov4flpJrml7bvvIznqIvluo/lsIboh6rliqjkuKLlvIPkuIDkupvlu7bov5/ov4fpq5jnmoTlvLnluZXjgILmraTpgInpobnkuLogZmFsc2Ug5pe25pys5p2h5by55bmV5peg6K665aaC5L2V6YO95LiN5Lya6KKr5Lii5byD77yM5L2/55So5pys6YCJ6aG555qE5Zy65pmv5aaC5pys55So5oi35Y+R6YCB55qE5by55bmV44CC77yI5rOo5oSP77ya5LiN6KaB5bCG5aSq5aSa55qE5by55bmV55qEIGNhbkRpc2NhcmQg6K6+5Li6IGZhbHNl77yMIOWQpuWImeS8muWboOi2heaXtueahOW8ueW5leS4jeS8muiiq+S4ouW8g+iAjOmAoOaIkOaEj+WklueahOmXrumimOOAgu+8iVxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gW3N0YXJ0VGltZT1vcHRpb25zLmNsb2NrKCldIOW8ueW5lei/m+WFpeaXtumXtO+8mu+8iOatpOWPguaVsOWcqOS6i+S7tuS4reS/ruaUueaXoOaViO+8ieWNleS9je+8muavq+enku+8jOm7mOiupOS4ulvml7bpl7Tln7rlh4bvvIhvcHRpb25zLmNsb2Nr77yJXXtAbGluayBvcGVuQlNFfk9wdGlvbnN95b2T5YmN5pe26Ze044CCXHJcbiAqIEBwcm9wZXJ0eSB7b3BlbkJTRS5CdWxsZXRTY3JlZW5UeXBlfSBbdHlwZT1vcGVuQlNFLkJ1bGxldFNjcmVlblR5cGUucmlnaHRUb0xlZnRdIOW8ueW5leexu+Wei++8mu+8iOatpOWPguaVsOWcqOS6i+S7tuS4reS/ruaUueaXoOaViO+8ieS4gOS4quexu+Wei+S4uiB7QGxpbmsgb3BlbkJTRS5CdWxsZXRTY3JlZW5UeXBlfSDnmoTmnprkuL7jgIJcclxuICogQHByb3BlcnR5IHtvcGVuQlNFfkJ1bGxldFNjcmVlblN0eWxlfSBzdHlsZSDlvLnluZXmoLflvI/vvJrkuIDkuKoge0BsaW5rIG9wZW5CU0V+QnVsbGV0U2NyZWVuU3R5bGV9IOe7k+aehOOAguiuvue9ruatpOmAiemhueS4reeahOS7u+S9leS4gOS4quWAvO+8jOWwhuimhuebluWvueW6lOeahOWFqOWxgOiuvue9ruOAglxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gW2xheWVyPTBdIOW8ueW5leWxgue6p++8muatpOWPguaVsOi2iuWkp++8jOW8ueW5lei2iumdoOWJjeOAguS4gOadoeW8ueW5leWcqOavlOWug+Wxgue6p+Wwj+eahOW8ueW5leWJjemdou+8jOWcqOavlOWug+Wxgue6p+Wkp+eahOW8ueW5leWQjumdouOAguWmguaenOWxgue6p+ebuOWQjOaMieeFp+i/m+WFpeaXtumXtOehruWumuWxgue6p+mhuuW6j+OAglxyXG4gKiBAcHJvcGVydHkge2FueX0gbW9yZS4uLiDlhbbku5boh6rlrprkuYnlrZfmrrXvvJrvvIjlnKjkuovku7bkuK3kv67mlLnkv67mlLnmraTlj4LmlbDml6DpnIDlsIYgZS5yZWRyYXcg6K6+572u5Li6IHRydWXvvInkvovlpoIgdXVpZCDjgIEgaWQg562J44CC77yI5rOo5oSP77ya5Zug5Li65Zyo5LqL5Lu25ZON5bqU5pa55rOV5Lit6L+U5Zue55qE5by55bmV5a+56LGh5piv5Y6f5a+56LGh5YWL6ZqG55qE77yM5omA5Lul5peg5rOV55u05o6l5q+U6L6D77yM5b+F6aG75L2/55So6Ieq5a6a5LmJ5a2X5q615ZSv5LiA5qCH6K+G5LiA5p2h5by55bmV44CC77yJXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIOW8ueW5leagt+W8j1xyXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBvcGVuQlNFfkJ1bGxldFNjcmVlblN0eWxlXHJcbiAqIEBkZXNjcmlwdGlvbiBCdWxsZXRTY3JlZW5TdHlsZSDnu5PmnoTnlKjkuo7lrZjmlL7lvLnluZXmoLflvI/kv6Hmga/jgIJcclxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtzaGFkb3dCbHVyPTJdIOW8ueW5lemYtOW9seeahOaooeeziue6p+WIq++8mjDkuLrkuI3mmL7npLrpmLTlvbHjgIJcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtmb250V2VpZ2h0PVwiNjAwXCJdIOWtl+S9k+eyl+e7hu+8muWPr+mAieWAvO+8mmxpZ2h0ZXLvvJrmm7Tnu4bvvJtub3JtYWzvvJrmoIflh4bvvJtib2xk77ya57KX5L2T77ybYm9sZGVyOiDmm7TnspfvvJsxMDDjgIEyMDDjgIEzMDDjgIE0MDDjgIE1MDDjgIE2MDDjgIE3MDDjgIE4MDDjgIE5MDDvvJrlrprkuYnnlLHnspfliLDnu4bnmoTlrZfnrKbvvIg0MDAg562J5ZCM5LqOIG5vcm1hbO+8mzcwMCDnrYnlkIzkuo4gYm9sZO+8ieOAglxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2ZvbnRGYW1pbHk9XCJzYW5zLXNlcmlmXCJdIOWtl+S9k+ezu+WIl++8muW8ueW5leeahOWtl+S9k+aXj+WQjeensOaIli/lj4rnsbvml4/lkI3np7DnmoTkuIDkuKrkvJjlhYjooajjgILvvIjms6jmhI/vvJrlpoLmnpzkvb/nlKjkuobnlKjigJxAZm9udC1mYWNl4oCd5a6a5LmJ55qE5a2X5L2T77yM6K+356Gu5L+d5Zyo5L2/55So5YmN5a6M5YWo5Yqg6L295a6M5oiQ77yM5ZCm5YiZ5by55bmV5Y+v6IO95peg5rOV5pi+56S644CC5aaC5p6c6KaB6aKE5Yqg6L296L+Z5Lqb5a2X5L2T77yM5bu66K6u5L2/55SoIFtXZWIgRm9udCBMb2FkZXJde0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS90eXBla2l0L3dlYmZvbnRsb2FkZXJ9IOOAgu+8iVxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gW3NpemU9MTldIOWtl+S9k+Wkp+Wwj++8muWNleS9je+8muWDj+e0oOOAglxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2JveENvbG9yXSDlpJbmoYbpopzoibLvvJrlj4LnhadDU1PpopzoibLorr7nva7mlrnms5XvvIzkuLogbnVsbCDkuI3mmL7npLrlpJbmoYbjgIJcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtjb2xvcj1cIndoaXRlXCJdIOW8ueW5leminOiJsu+8muWPgueFp0NTU+minOiJsuiuvue9ruaWueazle+8jOS4uiBudWxsIOS4jeaYvuekuuatpOW8ueW5leOAglxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2JvcmRlckNvbG9yXSDmj4/ovrnpopzoibLvvJrlj4LnhadDU1PpopzoibLorr7nva7mlrnms5XvvIzkuLogbnVsbCDmsqHmnInmj4/ovrnjgIJcclxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtzcGVlZD0wLjE1XSDlvLnluZXpgJ/luqbvvJrvvIjlnKjkuovku7bkuK3kv67mlLnkv67mlLnmraTlj4LmlbDml6DpnIDlsIYgZS5yZWRyYXcg6K6+572u5Li6IHRydWXvvInljZXkvY3vvJrlg4/ntKAv5q+r56eS77yM5LuF5by55bmV57G75Z6L5Li6MOOAgTHml7bmnInmlYjjgIJcclxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtyZXNpZGVuY2VUaW1lPTUwMDBdIOW8ueW5leWBnOeVmeaXtumXtO+8mu+8iOatpOWPguaVsOWcqOS6i+S7tuS4reS/ruaUueaXoOaViO+8ieWNleS9je+8muavq+enku+8jOS7heW8ueW5leexu+WeizLjgIEz5pe25pyJ5pWI44CCXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIOW8ueW5leS6i+S7tlxyXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBvcGVuQlNFfkJ1bGxldFNjcmVlbkV2ZW50XHJcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IGdldEJ1bGxldFNjcmVlbigpIC0g6I635Y+W5byV5Y+R5LqL5Lu255qE5by55bmV5by55bmV55qE5pWw5o2u77yacmV0dW46IHtAbGluayBvcGVuQlNFfkJ1bGxldFNjcmVlbn0g5byV5Y+R5LqL5Lu255qE5by55bmV55qE5pWw5o2u77ya5LiA5LiqIHtAbGluayBvcGVuQlNFfkJ1bGxldFNjcmVlbn0g57uT5p6E44CC77yI5rOo5oSP77ya5LiN6KaB6K+V5Zu+5LiOW+a3u+WKoOW8ueW5lV17QGxpbmsgb3BlbkJTRS5CdWxsZXRTY3JlZW5FbmdpbmUjYWRkQnVsbGV0U2NyZWVufeaXtuWIm+W7uueahOWvueixoei/m+ihjOavlOi+g++8jOi/meS4quWvueixoeaYr+WFi+mahuW+l+WIsOeahO+8jOW5tuS4jeebuOetieOAguato+ehrueahOaWueazleaYr+WcqOa3u+WKoOW8ueW5leaXtuS4gOW5tuaPkuWFpSBpZCDnrYnoh6rlrprkuYnlrZfmrrXmnaXllK/kuIDmoIfor4bkuIDmnaHlvLnluZXjgILvvIlcclxuICogQHByb3BlcnR5IHtmdW5jdGlvbn0gc2V0QnVsbGV0U2NyZWVuKGJ1bGxldFNjcmVlbixyZWRyYXcpIC0g6K6+572u5byV5Y+R5LqL5Lu255qE5by55bmV5by55bmV55qE5pWw5o2u77yacGFyYW1zOiB7QGxpbmsgb3BlbkJTRX5CdWxsZXRTY3JlZW59IGJ1bGxldFNjcmVlbiAtIOW8leWPkeS6i+S7tueahOW8ueW5leeahOaVsOaNru+8muS4gOS4qiB7QGxpbmsgb3BlbkJTRX5CdWxsZXRTY3JlZW59IOe7k+aehOOAguiuvue9ruatpOWPguaVsOS7peS+v+WKqOaAgeiwg+aVtOW8ueW5leagt+W8j++8jOS9huaYr+S4gOS6m+WPguaVsOWcqOS6i+S7tuS4reS/ruaUueaXoOaViO+8jOafpeeci+atpOe7k+aehOeahOivtOaYjuS7peS6huino+ivpuaDheOAgiBib29sZWFuIFtyZWRyYXc9ZmFsc2VdIC0g5piv5ZCm6YeN57uY5by55bmV77ya5q2k5Y+C5pWw5Zyo5q+P5qyh5byV5Y+R5LqL5Lu25pe255qE5Yid5aeL5YC85Li6IGZhbHNlIO+8jOWmguaenOS/ruaUueS6hiBidWxsZXRTY3JlZW4g5Lit55qE5YC877yM5q2k5Y+C5pWw5b+F6aG76K6+5Li6IHRydWUg44CCXHJcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IGdldFBsYXlTdGF0ZSgpIC0g6I635Y+W5byV5Y+R5LqL5Lu255qE5by55bmV55qE5pKt5pS+54q25oCB77yacmV0dW46IGJvb2xlYW4g5Y+W5byV5Y+R5LqL5Lu255qE5by55bmV5piv5ZCm5Zyo5pKt5pS+L+enu+WKqO+8muWmguaenOiuvue9ruS4uiB0cnVlIOWImeivpeW8ueW5leaaguWBnO+8jOebtOWIsOWwhuatpOWPguaVsOiuvuS4uiBmYWxzZSDmiJbosIPnlKgge0BsaW5rIG9wZW5CU0UuQnVsbGV0U2NyZWVuRW5naW5lI3BsYXlBbGxCdWxsZXRTY3JlZW5zfSDmlrnms5XjgIJcclxuICogQHByb3BlcnR5IHtmdW5jdGlvbn0gc2V0UGxheVN0YXRlKHBsYXkpIC0g6K6+572u5byV5Y+R5LqL5Lu255qE5by55bmV55qE5pKt5pS+54q25oCB77yacGFyYW1zOiBib29sZWFuIHBhbHkgLSDmmK/lkKbnu6fnu63mkq3mlL4v56e75Yqo5byV5Y+R5LqL5Lu255qE5by55bmV77ya6K+75Y+W5q2k5Y+C5pWw5Y+v5Yik5pat6L+Z5p2h5by55bmV5piv5ZCm5aSE5LqO5pqC5YGc54q25oCB44CCXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0eXBlIC0g5LqL5Lu257G75Z6L77yI5LqL5Lu25ZCN56ew77yJXHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzY3JlZW5YIC0g5b2T5LqL5Lu25Y+R55Sf5pe277yM6byg5qCH55u45a+55LqO5pi+56S65Zmo5bGP55qEIFgg5Z2Q5qCH44CCXHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzY3JlZW5ZIC0g5b2T5LqL5Lu25Y+R55Sf5pe277yM6byg5qCH55u45a+55LqO5pi+56S65Zmo5bGP55qEIFkg5Z2Q5qCH44CCXHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjbGllbnRYIC0g5b2T5LqL5Lu25Y+R55Sf5pe277yM6byg5qCH55u45a+55LqO5rWP6KeI5Zmo5pyJ5pWI5Yy65Z+f55qEIFgg5Z2Q5qCH44CCXHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBwYWdlWCAtIOW9k+S6i+S7tuWPkeeUn+aXtu+8jOm8oOagh+ebuOWvueS6jumhtemdoueahCBYIOWdkOagh+OAglxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gcGFnZVkgLSDlvZPkuovku7blj5HnlJ/ml7bvvIzpvKDmoIfnm7jlr7nkuo7pobXpnaLnmoQgWSDlnZDmoIfjgIJcclxuICogQHByb3BlcnR5IHtudW1iZXJ9IHBhZ2VZIC0g5b2T5LqL5Lu25Y+R55Sf5pe277yM6byg5qCH55u45a+55LqO6aG16Z2i55qEIFkg5Z2Q5qCH44CCXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIOiwg+ivleS/oeaBr1xyXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBvcGVuQlNFfkRlYnVnSW5mb1xyXG4gKiBAZGVzY3JpcHRpb24gRGVidWdJbmZvIOe7k+aehOeUqOS6juWtmOaUvuiwg+ivleS/oeaBr+OAglxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gdGltZSBb5pe26Ze05Z+65YeG77yIb3B0aW9ucy5jbG9ja++8iV17QGxpbmsgb3BlbkJTRX5PcHRpb25zfeW9k+WJjeaXtumXtOOAglxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gYnVsbGV0U2NyZWVuc09uU2NyZWVuQ291bnQg5a6e5pe25by55bmV5oC75pWwXHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBidWxsZXRTY3JlZW5zQ291bnQg5Ymp5L2Z5by55bmV5oC75pWwXHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBkZWxheSDlu7bov5/vvJrljZXkvY3vvJrmr6vnp5LjgIJcclxuICogQHByb3BlcnR5IHtudW1iZXJ9IGRlbGF5QnVsbGV0U2NyZWVuc0NvdW50IOS4ouW8g+W8ueW5leaVsO+8muWboOW7tui/n+i/h+mrmOiAjOS4ouW8g+eahOW8ueW5leaAu+aVsOOAglxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gZnBzIOW4p+mike+8muWNleS9je+8muW4py/np5LjgIJcclxuICovXHJcblxyXG4vKipcclxuICog54mI5pys5L+h5oGvXHJcbiAqIEB0eXBlZGVmIHtvYmplY3R9IG9wZW5CU0V+VmVyc2lvbkluZm9cclxuICogQGRlc2NyaXB0aW9uIFZlcnNpb25JbmZvIOe7k+aehOeUqOS6juWtmOaUvueJiOacrOS/oeaBr+OAglxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdmVyc2lvbiDniYjmnKzlj7dcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IGJ1aWxkRGF0ZSDmnoTlu7rml6XmnJ/vvJrml7bljLrvvJpVVEPjgIJcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IG5hbWUg5ZCN56ewXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBkZXNjcmlwdGlvbiDmj4/ov7BcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IGhvbWUg5Li76aG1XHJcbiAqLyJdLCJmaWxlIjoib3BlbkJTRS5qcyJ9
