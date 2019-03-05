"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BulletScreenType = void 0;

/**
 * 弹幕类型枚举
 * @alias openBSE.BulletScreenType
 * @readonly
 * @enum {number}
 */
var BulletScreenType = {
  /** 
   * 从右到左弹幕
   * @readonly
   */
  rightToLeft: 1,

  /** 
   * 从左到右弹幕（逆向弹幕）
   * @readonly
   */
  leftToRight: 2,

  /** 
   * 顶部弹幕
   * @readonly
   */
  top: 4,

  /** 
   * 底部弹幕
   * @readonly
   */
  bottom: 8
};
exports.BulletScreenType = BulletScreenType;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1bGxldFNjcmVlblR5cGUuanMiXSwibmFtZXMiOlsiQnVsbGV0U2NyZWVuVHlwZSIsInJpZ2h0VG9MZWZ0IiwibGVmdFRvUmlnaHQiLCJ0b3AiLCJib3R0b20iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFNQSxJQUFNQSxnQkFBZ0IsR0FBRztBQUNyQjs7OztBQUlBQyxFQUFBQSxXQUFXLEVBQUUsQ0FMUTs7QUFNckI7Ozs7QUFJQUMsRUFBQUEsV0FBVyxFQUFFLENBVlE7O0FBV3JCOzs7O0FBSUFDLEVBQUFBLEdBQUcsRUFBRSxDQWZnQjs7QUFnQnJCOzs7O0FBSUFDLEVBQUFBLE1BQU0sRUFBRTtBQXBCYSxDQUF6QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICog5by55bmV57G75Z6L5p6a5Li+XG4gKiBAYWxpYXMgb3BlbkJTRS5CdWxsZXRTY3JlZW5UeXBlXG4gKiBAcmVhZG9ubHlcbiAqIEBlbnVtIHtudW1iZXJ9XG4gKi9cbmNvbnN0IEJ1bGxldFNjcmVlblR5cGUgPSB7XG4gICAgLyoqIFxuICAgICAqIOS7juWPs+WIsOW3puW8ueW5lVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHJpZ2h0VG9MZWZ0OiAxLFxuICAgIC8qKiBcbiAgICAgKiDku47lt6bliLDlj7PlvLnluZXvvIjpgIblkJHlvLnluZXvvIlcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBsZWZ0VG9SaWdodDogMixcbiAgICAvKiogXG4gICAgICog6aG26YOo5by55bmVXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgdG9wOiA0LFxuICAgIC8qKiBcbiAgICAgKiDlupXpg6jlvLnluZVcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBib3R0b206IDhcbn1cblxuZXhwb3J0IHsgQnVsbGV0U2NyZWVuVHlwZSB9Il0sImZpbGUiOiJidWxsZXRTY3JlZW5UeXBlLmpzIn0=
