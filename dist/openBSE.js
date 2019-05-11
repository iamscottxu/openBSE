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
Object.defineProperty(exports, "SpecialEngine", {
  enumerable: true,
  get: function get() {
    return _specialEngine["default"];
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

var _specialEngine = _interopRequireDefault(require("./engines/specialEngine"));

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9wZW5CU0UuanMiXSwibmFtZXMiOlsiZ2V0VmVyc2lvbiIsIkhlbHBlciIsImNsb25lIiwiYnVpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBOzs7OztBQUtBLFNBQVNBLFVBQVQsR0FBc0I7QUFDbEIsU0FBT0MsbUJBQU9DLEtBQVAsQ0FBYUMsS0FBYixDQUFQO0FBQ0g7QUFJRDs7Ozs7Ozs7Ozs7Ozs7QUFjQTs7Ozs7OztBQU9BOzs7Ozs7Ozs7Ozs7O0FBYUE7Ozs7Ozs7Ozs7Ozs7OztBQWVBOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBOzs7Ozs7Ozs7Ozs7QUFZQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBIZWxwZXIgZnJvbSAnLi9saWIvaGVscGVyJ1xuaW1wb3J0IEdlbmVyYWxFbmdpbmUgZnJvbSAnLi9lbmdpbmVzL2dlbmVyYWxFbmdpbmUnXG5pbXBvcnQgU3BlY2lhbEVuZ2luZSBmcm9tICcuL2VuZ2luZXMvc3BlY2lhbEVuZ2luZSdcbmltcG9ydCBCcm93c2VyTm90U3VwcG9ydEVycm9yIGZyb20gJy4vZXJyb3JzL2Jyb3dzZXJOb3RTdXBwb3J0RXJyb3InXG5pbXBvcnQgR2VuZXJhbFR5cGUgZnJvbSAnLi9lbmdpbmVzL2dlbmVyYWxUeXBlJ1xuaW1wb3J0IENvbnRleHRtZW51IGZyb20gJy4vY29udGV4dG1lbnUnXG5pbXBvcnQgKiBhcyBidWlsZCBmcm9tICcuL2J1aWxkLmpzb24nXG5cbi8qKlxuICog6I635Y+W54mI5pys5L+h5oGv44CCXG4gKiBAYWxpYXMgb3BlbkJTRS5nZXRWZXJzaW9uXG4gKiBAcmV0dXJucyB7b3BlbkJTRX5WZXJzaW9uSW5mb30g54mI5pys5L+h5oGv77ya5LiA5LiqIHtAbGluayBvcGVuQlNFflZlcnNpb25JbmZvfSDnu5PmnoTjgIJcbiAqL1xuZnVuY3Rpb24gZ2V0VmVyc2lvbigpIHtcbiAgICByZXR1cm4gSGVscGVyLmNsb25lKGJ1aWxkKTtcbn1cblxuZXhwb3J0IHsgR2VuZXJhbEVuZ2luZSwgU3BlY2lhbEVuZ2luZSwgQnJvd3Nlck5vdFN1cHBvcnRFcnJvciwgR2VuZXJhbFR5cGUsIENvbnRleHRtZW51LCBnZXRWZXJzaW9uIH1cblxuLyoqXG4gKiDmma7pgJrlvLnluZXlhajlsYDpgInpoblcbiAqIEB0eXBlZGVmIHtvYmplY3R9IG9wZW5CU0V+Z2VuZXJhbE9wdGlvbnNcbiAqIEBkZXNjcmlwdGlvbiBPcHRpb24g57uT5p6E55So5LqO5a2Y5pS+5YWo5bGA6YCJ6aG544CCXG4gKiBAcHJvcGVydHkge251bWJlcn0gW3ZlcnRpY2FsSW50ZXJ2YWw9OF0gLSDlvLnluZXlnoLnm7TooYzpl7Tot51cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbdmVydGljYWxJbnRlcnZhbD0xXSAtIOW8ueW5leaSreaUvumAn+W6pu+8iOWAjeaVsO+8iVxuICogQHByb3BlcnR5IHtvcGVuQlNFfmNsb2NrQ2FsbGJhY2t9IFtjbG9jaz10aW1lID0+IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gc3RhcnRUaW1lXSAtIOaXtumXtOWfuuWHhu+8muatpOaXtumXtOWfuuWHhuWPr+aMh+WQkeS4gOS4quaWueazleeUqOS6juiOt+WPluaSreaUvuWZqOW9k+WJjei/m+W6pu+8jOi/meS4quaWueazlei/lOWbnuWAvOWNs+S4uuaSreaUvui/m+W6pu+8iOWNleS9je+8muavq+enku+8ieOAglxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtzY2FsaW5nPTFdIOW8ueW5lee8qeaUvuavlOS+i++8iOWAjeaVsO+8iVxuICogQHByb3BlcnR5IHtvcGVuQlNFfkJ1bGxldFNjcmVlblN0eWxlfSBbZGVmYXVsdFN0eWxlXSDpu5jorqTlvLnluZXmoLflvI/vvJrkuIDkuKoge0BsaW5rIG9wZW5CU0V+QnVsbGV0U2NyZWVuU3R5bGV9IOe7k+aehOOAglxuICogQHByb3BlcnR5IHtvcGVuQlNFLkdlbmVyYWxUeXBlfSBbaGlkZGVuVHlwZXM9MF0g6ZqQ6JeP55qE5by55bmV57G75Z6L77ya5LiA5LiqIHtAbGluayBvcGVuQlNFLkdlbmVyYWxUeXBlfSDmnprkuL7jgILlsIbopoHpmpDol4/nmoTlvLnluZXnsbvlnovnm7jliqDvvIww5Li65LiN6ZqQ6JeP5Lu75L2V57G75Z6L55qE5by55bmV44CCXG4gKiBAcHJvcGVydHkge251bWJlcn0gW29wYWNpdHk9MS4wXSDlvLnluZXkuI3pgI/mmI7luqbvvJrlj5blgLzojIPlm7QgMC4wIOWIsCAxLjDvvIwwLjAg5YWo6YCP5piO77ybMS4wIOS4jemAj+aYjuOAglxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtjdXJzb3JPbk1vdXNlT3Zlcj0ncG9pbnRlciddIOm8oOagh+e7j+i/h+agt+W8j++8muW9k+m8oOagh+e7j+i/h+W8ueW5leaXtueahOagt+W8j++8jOWPr+iuvue9rueahOWAvOWPr+WPguiAgyBNRE4gW2N1cnNvcl0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3poLUNOL2RvY3MvV2ViL0NTUy9jdXJzb3J9IOOAglxuICovXG5cbi8qKlxuICog5pe26Ze05Z+65YeG5Zue6LCD5pa55rOVXG4gKiBAY2FsbGJhY2sgb3BlbkJTRX5jbG9ja0NhbGxiYWNrXG4gKiBAZGVzY3JpcHRpb24gQ2xvY2tDYWxsYmFjayDlm57osIPmlrnms5XnlKjkuo7mkq3mlL7lmajlvZPliY3ov5vluqbjgIJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IOaSreaUvui/m+W6pu+8muWNleS9je+8muavq+enkuOAglxuICovXG5cbi8qKlxuICog5Y2V5p2h5by55bmV5pWw5o2uXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBvcGVuQlNFfkdlbmVyYWxCdWxsZXRTY3JlZW5cbiAqIEBkZXNjcmlwdGlvbiBCdWxsZXRTY3JlZW4g57uT5p6E55So5LqO5a2Y5pS+5Y2V5p2h5by55bmV5pWw5o2u44CCXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdGV4dCDlvLnluZXmlofmnKxcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW2NhbkRpc2NhcmQ9dHJ1ZV0g5piv5ZCm5YWB6K645Lii5byD77ya77yI5q2k5Y+C5pWw5Zyo5LqL5Lu25Lit5L+u5pS55peg5pWI77yJ5Zyo5by55bmV6L+H5aSa5pe277yM56iL5bqP5bCG6Ieq5Yqo5Lii5byD5LiA5Lqb5bu26L+f6L+H6auY55qE5by55bmV44CC5q2k6YCJ6aG55Li6IGZhbHNlIOaXtuacrOadoeW8ueW5leaXoOiuuuWmguS9lemDveS4jeS8muiiq+S4ouW8g++8jOS9v+eUqOacrOmAiemhueeahOWcuuaZr+WmguacrOeUqOaIt+WPkemAgeeahOW8ueW5leOAgu+8iOazqOaEj++8muS4jeimgeWwhuWkquWkmueahOW8ueW5leeahCBjYW5EaXNjYXJkIOiuvuS4uiBmYWxzZe+8jCDlkKbliJnkvJrlm6DotoXml7bnmoTlvLnluZXkuI3kvJrooqvkuKLlvIPogIzpgKDmiJDmhI/lpJbnmoTpl67popjjgILvvIlcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbc3RhcnRUaW1lPW9wdGlvbnMuY2xvY2soKV0g5by55bmV6L+b5YWl5pe26Ze077ya77yI5q2k5Y+C5pWw5Zyo5LqL5Lu25Lit5L+u5pS55peg5pWI77yJ5Y2V5L2N77ya5q+r56eS77yM6buY6K6k5Li6W+aXtumXtOWfuuWHhu+8iG9wdGlvbnMuY2xvY2vvvIlde0BsaW5rIG9wZW5CU0V+T3B0aW9uc33lvZPliY3ml7bpl7TjgIJcbiAqIEBwcm9wZXJ0eSB7b3BlbkJTRS5HZW5lcmFsVHlwZX0gW3R5cGU9b3BlbkJTRS5HZW5lcmFsVHlwZS5yaWdodFRvTGVmdF0g5by55bmV57G75Z6L77ya77yI5q2k5Y+C5pWw5Zyo5LqL5Lu25Lit5L+u5pS55peg5pWI77yJ5LiA5Liq57G75Z6L5Li6IHtAbGluayBvcGVuQlNFLkJ1bGxldFNjcmVlblR5cGV9IOeahOaemuS4vuOAglxuICogQHByb3BlcnR5IHtvcGVuQlNFfkJ1bGxldFNjcmVlblN0eWxlfSBzdHlsZSDlvLnluZXmoLflvI/vvJrkuIDkuKoge0BsaW5rIG9wZW5CU0V+QnVsbGV0U2NyZWVuU3R5bGV9IOe7k+aehOOAguiuvue9ruatpOmAiemhueS4reeahOS7u+S9leS4gOS4quWAvO+8jOWwhuimhuebluWvueW6lOeahOWFqOWxgOiuvue9ruOAglxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtsYXllcj0wXSDlvLnluZXlsYLnuqfvvJrmraTlj4LmlbDotorlpKfvvIzlvLnluZXotorpnaDliY3jgILkuIDmnaHlvLnluZXlnKjmr5TlroPlsYLnuqflsI/nmoTlvLnluZXliY3pnaLvvIzlnKjmr5TlroPlsYLnuqflpKfnmoTlvLnluZXlkI7pnaLjgILlpoLmnpzlsYLnuqfnm7jlkIzmjInnhafov5vlhaXml7bpl7Tnoa7lrprlsYLnuqfpobrluo/jgIJcbiAqIEBwcm9wZXJ0eSB7YW55fSBtb3JlLi4uIOWFtuS7luiHquWumuS5ieWtl+aute+8mu+8iOWcqOS6i+S7tuS4reS/ruaUueS/ruaUueatpOWPguaVsOaXoOmcgOWwhiBlLnJlZHJhdyDorr7nva7kuLogdHJ1Ze+8ieS+i+WmgiB1dWlkIOOAgSBpZCDnrYnjgILvvIjms6jmhI/vvJrlm6DkuLrlnKjkuovku7blk43lupTmlrnms5XkuK3ov5Tlm57nmoTlvLnluZXlr7nosaHmmK/ljp/lr7nosaHlhYvpmobnmoTvvIzmiYDku6Xml6Dms5Xnm7TmjqXmr5TovoPvvIzlv4Xpobvkvb/nlKjoh6rlrprkuYnlrZfmrrXllK/kuIDmoIfor4bkuIDmnaHlvLnluZXjgILvvIlcbiAqL1xuXG4vKipcbiAqIOW8ueW5leagt+W8j1xuICogQHR5cGVkZWYge29iamVjdH0gb3BlbkJTRX5HZW5lcmFsQnVsbGV0U2NyZWVuU3R5bGVcbiAqIEBkZXNjcmlwdGlvbiBCdWxsZXRTY3JlZW5TdHlsZSDnu5PmnoTnlKjkuo7lrZjmlL7lvLnluZXmoLflvI/kv6Hmga/jgIJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbc2hhZG93Qmx1cj0yXSDlvLnluZXpmLTlvbHnmoTmqKHns4rnuqfliKvvvJow5Li65LiN5pi+56S66Zi05b2x44CCXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2ZvbnRXZWlnaHQ9XCI2MDBcIl0g5a2X5L2T57KX57uG77ya5Y+v6YCJ5YC877yabGlnaHRlcu+8muabtOe7hu+8m25vcm1hbO+8muagh+WHhu+8m2JvbGTvvJrnspfkvZPvvJtib2xkZXI6IOabtOeyl++8mzEwMOOAgTIwMOOAgTMwMOOAgTQwMOOAgTUwMOOAgTYwMOOAgTcwMOOAgTgwMOOAgTkwMO+8muWumuS5ieeUseeyl+WIsOe7hueahOWtl+espu+8iDQwMCDnrYnlkIzkuo4gbm9ybWFs77ybNzAwIOetieWQjOS6jiBib2xk77yJ44CCXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2ZvbnRGYW1pbHk9XCJzYW5zLXNlcmlmXCJdIOWtl+S9k+ezu+WIl++8muW8ueW5leeahOWtl+S9k+aXj+WQjeensOaIli/lj4rnsbvml4/lkI3np7DnmoTkuIDkuKrkvJjlhYjooajjgILvvIjms6jmhI/vvJrlpoLmnpzkvb/nlKjkuobnlKjigJxAZm9udC1mYWNl4oCd5a6a5LmJ55qE5a2X5L2T77yM6K+356Gu5L+d5Zyo5L2/55So5YmN5a6M5YWo5Yqg6L295a6M5oiQ77yM5ZCm5YiZ5by55bmV5Y+v6IO95peg5rOV5pi+56S644CC5aaC5p6c6KaB6aKE5Yqg6L296L+Z5Lqb5a2X5L2T77yM5bu66K6u5L2/55SoIFtXZWIgRm9udCBMb2FkZXJde0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS90eXBla2l0L3dlYmZvbnRsb2FkZXJ9IOOAgu+8iVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtzaXplPTE5XSDlrZfkvZPlpKflsI/vvJrljZXkvY3vvJrlg4/ntKDjgIJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbYm94Q29sb3JdIOWkluahhuminOiJsu+8muWPgueFp0NTU+minOiJsuiuvue9ruaWueazle+8jOS4uiBudWxsIOS4jeaYvuekuuWkluahhuOAglxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtjb2xvcj1cIndoaXRlXCJdIOW8ueW5leminOiJsu+8muWPgueFp0NTU+minOiJsuiuvue9ruaWueazle+8jOS4uiBudWxsIOS4jeaYvuekuuatpOW8ueW5leOAglxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtib3JkZXJDb2xvcl0g5o+P6L656aKc6Imy77ya5Y+C54WnQ1NT6aKc6Imy6K6+572u5pa55rOV77yM5Li6IG51bGwg5rKh5pyJ5o+P6L6544CCXG4gKiBAcHJvcGVydHkge251bWJlcn0gW3NwZWVkPTAuMTVdIOW8ueW5lemAn+W6pu+8mu+8iOWcqOS6i+S7tuS4reS/ruaUueS/ruaUueatpOWPguaVsOaXoOmcgOWwhiBlLnJlZHJhdyDorr7nva7kuLogdHJ1Ze+8ieWNleS9je+8muWDj+e0oC/mr6vnp5LvvIzku4XlvLnluZXnsbvlnovkuLow44CBMeaXtuacieaViOOAglxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtyZXNpZGVuY2VUaW1lPTUwMDBdIOW8ueW5leWBnOeVmeaXtumXtO+8mu+8iOatpOWPguaVsOWcqOS6i+S7tuS4reS/ruaUueaXoOaViO+8ieWNleS9je+8muavq+enku+8jOS7heW8ueW5leexu+WeizLjgIEz5pe25pyJ5pWI44CCXG4gKi9cblxuLyoqXG4gKiDlvLnluZXkuovku7ZcbiAqIEB0eXBlZGVmIHtvYmplY3R9IG9wZW5CU0V+R2VuZXJhbEJ1bGxldFNjcmVlbkV2ZW50XG4gKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBnZXRCdWxsZXRTY3JlZW4oKSAtIOiOt+WPluW8leWPkeS6i+S7tueahOW8ueW5leW8ueW5leeahOaVsOaNru+8mnJldHVuOiB7QGxpbmsgb3BlbkJTRX5CdWxsZXRTY3JlZW59IOW8leWPkeS6i+S7tueahOW8ueW5leeahOaVsOaNru+8muS4gOS4qiB7QGxpbmsgb3BlbkJTRX5CdWxsZXRTY3JlZW59IOe7k+aehOOAgu+8iOazqOaEj++8muS4jeimgeivleWbvuS4jlvmt7vliqDlvLnluZVde0BsaW5rIG9wZW5CU0UuQnVsbGV0U2NyZWVuRW5naW5lI2FkZEJ1bGxldFNjcmVlbn3ml7bliJvlu7rnmoTlr7nosaHov5vooYzmr5TovoPvvIzov5nkuKrlr7nosaHmmK/lhYvpmoblvpfliLDnmoTvvIzlubbkuI3nm7jnrYnjgILmraPnoa7nmoTmlrnms5XmmK/lnKjmt7vliqDlvLnluZXml7bkuIDlubbmj5LlhaUgaWQg562J6Ieq5a6a5LmJ5a2X5q615p2l5ZSv5LiA5qCH6K+G5LiA5p2h5by55bmV44CC77yJXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBzZXRCdWxsZXRTY3JlZW4oYnVsbGV0U2NyZWVuLHJlZHJhdykgLSDorr7nva7lvJXlj5Hkuovku7bnmoTlvLnluZXlvLnluZXnmoTmlbDmja7vvJpwYXJhbXM6IHtAbGluayBvcGVuQlNFfkJ1bGxldFNjcmVlbn0gYnVsbGV0U2NyZWVuIC0g5byV5Y+R5LqL5Lu255qE5by55bmV55qE5pWw5o2u77ya5LiA5LiqIHtAbGluayBvcGVuQlNFfkJ1bGxldFNjcmVlbn0g57uT5p6E44CC6K6+572u5q2k5Y+C5pWw5Lul5L6/5Yqo5oCB6LCD5pW05by55bmV5qC35byP77yM5L2G5piv5LiA5Lqb5Y+C5pWw5Zyo5LqL5Lu25Lit5L+u5pS55peg5pWI77yM5p+l55yL5q2k57uT5p6E55qE6K+05piO5Lul5LqG6Kej6K+m5oOF44CCIGJvb2xlYW4gW3JlZHJhdz1mYWxzZV0gLSDmmK/lkKbph43nu5jlvLnluZXvvJrmraTlj4LmlbDlnKjmr4/mrKHlvJXlj5Hkuovku7bml7bnmoTliJ3lp4vlgLzkuLogZmFsc2Ug77yM5aaC5p6c5L+u5pS55LqGIGJ1bGxldFNjcmVlbiDkuK3nmoTlgLzvvIzmraTlj4LmlbDlv4Xpobvorr7kuLogdHJ1ZSDjgIJcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IGdldFBsYXlTdGF0ZSgpIC0g6I635Y+W5byV5Y+R5LqL5Lu255qE5by55bmV55qE5pKt5pS+54q25oCB77yacmV0dW46IGJvb2xlYW4g5Y+W5byV5Y+R5LqL5Lu255qE5by55bmV5piv5ZCm5Zyo5pKt5pS+L+enu+WKqO+8muWmguaenOiuvue9ruS4uiB0cnVlIOWImeivpeW8ueW5leaaguWBnO+8jOebtOWIsOWwhuatpOWPguaVsOiuvuS4uiBmYWxzZSDmiJbosIPnlKgge0BsaW5rIG9wZW5CU0UuQnVsbGV0U2NyZWVuRW5naW5lI3BsYXlBbGxCdWxsZXRTY3JlZW5zfSDmlrnms5XjgIJcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IHNldFBsYXlTdGF0ZShwbGF5KSAtIOiuvue9ruW8leWPkeS6i+S7tueahOW8ueW5leeahOaSreaUvueKtuaAge+8mnBhcmFtczogYm9vbGVhbiBwYWx5IC0g5piv5ZCm57un57ut5pKt5pS+L+enu+WKqOW8leWPkeS6i+S7tueahOW8ueW5le+8muivu+WPluatpOWPguaVsOWPr+WIpOaWrei/meadoeW8ueW5leaYr+WQpuWkhOS6juaaguWBnOeKtuaAgeOAglxuICogQHByb3BlcnR5IHtzdHJpbmd9IHR5cGUgLSDkuovku7bnsbvlnovvvIjkuovku7blkI3np7DvvIlcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzY3JlZW5YIC0g5b2T5LqL5Lu25Y+R55Sf5pe277yM6byg5qCH55u45a+55LqO5pi+56S65Zmo5bGP55qEIFgg5Z2Q5qCH44CCXG4gKiBAcHJvcGVydHkge251bWJlcn0gc2NyZWVuWSAtIOW9k+S6i+S7tuWPkeeUn+aXtu+8jOm8oOagh+ebuOWvueS6juaYvuekuuWZqOWxj+eahCBZIOWdkOagh+OAglxuICogQHByb3BlcnR5IHtudW1iZXJ9IGNsaWVudFggLSDlvZPkuovku7blj5HnlJ/ml7bvvIzpvKDmoIfnm7jlr7nkuo7mtY/op4jlmajmnInmlYjljLrln5/nmoQgWCDlnZDmoIfjgIJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBwYWdlWCAtIOW9k+S6i+S7tuWPkeeUn+aXtu+8jOm8oOagh+ebuOWvueS6jumhtemdoueahCBYIOWdkOagh+OAglxuICogQHByb3BlcnR5IHtudW1iZXJ9IHBhZ2VZIC0g5b2T5LqL5Lu25Y+R55Sf5pe277yM6byg5qCH55u45a+55LqO6aG16Z2i55qEIFkg5Z2Q5qCH44CCXG4gKiBAcHJvcGVydHkge251bWJlcn0gcGFnZVkgLSDlvZPkuovku7blj5HnlJ/ml7bvvIzpvKDmoIfnm7jlr7nkuo7pobXpnaLnmoQgWSDlnZDmoIfjgIJcbiAqL1xuXG4vKipcbiAqIOiwg+ivleS/oeaBr1xuICogQHR5cGVkZWYge29iamVjdH0gb3BlbkJTRX5EZWJ1Z0luZm9cbiAqIEBkZXNjcmlwdGlvbiBEZWJ1Z0luZm8g57uT5p6E55So5LqO5a2Y5pS+6LCD6K+V5L+h5oGv44CCXG4gKiBAcHJvcGVydHkge251bWJlcn0gdGltZSAtIFvml7bpl7Tln7rlh4bvvIhvcHRpb25zLmNsb2Nr77yJXXtAbGluayBvcGVuQlNFfk9wdGlvbnN95b2T5YmN5pe26Ze044CCXG4gKiBAcHJvcGVydHkge251bWJlcn0gcmVhbFRpbWVCdWxsZXRTY3JlZW5Db3VudCAtIOWunuaXtuW8ueW5leaAu+aVsFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGJ1ZmZlckJ1bGxldFNjcmVlbkNvdW50IC0g57yT5Yay5Yy65by55bmV5oC75pWwXG4gKiBAcHJvcGVydHkge251bWJlcn0gZGVsYXkgLSDlu7bov5/vvJrljZXkvY3vvJrmr6vnp5LjgIJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBkZWxheUJ1bGxldFNjcmVlbkNvdW50IC0g5Lii5byD5by55bmV5pWw77ya5Zug5bu26L+f6L+H6auY6ICM5Lii5byD55qE5by55bmV5oC75pWw44CCXG4gKiBAcHJvcGVydHkge251bWJlcn0gZnBzIC0g5bin6aKR77ya5Y2V5L2N77ya5binL+enkuOAglxuICovXG5cbi8qKlxuICog54mI5pys5L+h5oGvXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBvcGVuQlNFflZlcnNpb25JbmZvXG4gKiBAZGVzY3JpcHRpb24gVmVyc2lvbkluZm8g57uT5p6E55So5LqO5a2Y5pS+54mI5pys5L+h5oGv44CCXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdmVyc2lvbiDniYjmnKzlj7dcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBidWlsZERhdGUg5p6E5bu65pel5pyf77ya5pe25Yy677yaVVRD44CCXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbmFtZSDlkI3np7BcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBkZXNjcmlwdGlvbiDmj4/ov7BcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBob21lIOS4u+mhtVxuICovIl0sImZpbGUiOiJvcGVuQlNFLmpzIn0=
