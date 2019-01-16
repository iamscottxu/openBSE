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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1bGxldFNjcmVlblR5cGUuanMiXSwibmFtZXMiOlsiQnVsbGV0U2NyZWVuVHlwZSIsInJpZ2h0VG9MZWZ0IiwibGVmdFRvUmlnaHQiLCJ0b3AiLCJib3R0b20iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFNQSxJQUFNQSxnQkFBZ0IsR0FBRztBQUNyQjs7OztBQUlBQyxFQUFBQSxXQUFXLEVBQUUsQ0FMUTs7QUFNckI7Ozs7QUFJQUMsRUFBQUEsV0FBVyxFQUFFLENBVlE7O0FBV3JCOzs7O0FBSUFDLEVBQUFBLEdBQUcsRUFBRSxDQWZnQjs7QUFnQnJCOzs7O0FBSUFDLEVBQUFBLE1BQU0sRUFBRTtBQXBCYSxDQUF6QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiDlvLnluZXnsbvlnovmnprkuL5cclxuICogQGFsaWFzIG9wZW5CU0UuQnVsbGV0U2NyZWVuVHlwZVxyXG4gKiBAcmVhZG9ubHlcclxuICogQGVudW0ge251bWJlcn1cclxuICovXHJcbmNvbnN0IEJ1bGxldFNjcmVlblR5cGUgPSB7XHJcbiAgICAvKiogXHJcbiAgICAgKiDku47lj7PliLDlt6blvLnluZVcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICByaWdodFRvTGVmdDogMSxcclxuICAgIC8qKiBcclxuICAgICAqIOS7juW3puWIsOWPs+W8ueW5le+8iOmAhuWQkeW8ueW5le+8iVxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIGxlZnRUb1JpZ2h0OiAyLFxyXG4gICAgLyoqIFxyXG4gICAgICog6aG26YOo5by55bmVXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgdG9wOiA0LFxyXG4gICAgLyoqIFxyXG4gICAgICog5bqV6YOo5by55bmVXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgYm90dG9tOiA4XHJcbn1cclxuXHJcbmV4cG9ydCB7IEJ1bGxldFNjcmVlblR5cGUgfSJdLCJmaWxlIjoiYnVsbGV0U2NyZWVuVHlwZS5qcyJ9
