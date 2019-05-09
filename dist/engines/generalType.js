"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * 弹幕类型枚举
 * @alias openBSE.GeneralType
 * @readonly
 * @enum {number}
 */
var GeneralType = {
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
var _default = GeneralType;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZXMvZ2VuZXJhbFR5cGUuanMiXSwibmFtZXMiOlsiR2VuZXJhbFR5cGUiLCJyaWdodFRvTGVmdCIsImxlZnRUb1JpZ2h0IiwidG9wIiwiYm90dG9tIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7Ozs7O0FBTUEsSUFBTUEsV0FBVyxHQUFHO0FBQ2hCOzs7O0FBSUFDLEVBQUFBLFdBQVcsRUFBRSxDQUxHOztBQU1oQjs7OztBQUlBQyxFQUFBQSxXQUFXLEVBQUUsQ0FWRzs7QUFXaEI7Ozs7QUFJQUMsRUFBQUEsR0FBRyxFQUFFLENBZlc7O0FBZ0JoQjs7OztBQUlBQyxFQUFBQSxNQUFNLEVBQUU7QUFwQlEsQ0FBcEI7ZUFzQmVKLFciLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIOW8ueW5leexu+Wei+aemuS4vlxuICogQGFsaWFzIG9wZW5CU0UuR2VuZXJhbFR5cGVcbiAqIEByZWFkb25seVxuICogQGVudW0ge251bWJlcn1cbiAqL1xuY29uc3QgR2VuZXJhbFR5cGUgPSB7XG4gICAgLyoqIFxuICAgICAqIOS7juWPs+WIsOW3puW8ueW5lVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHJpZ2h0VG9MZWZ0OiAxLFxuICAgIC8qKiBcbiAgICAgKiDku47lt6bliLDlj7PlvLnluZXvvIjpgIblkJHlvLnluZXvvIlcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBsZWZ0VG9SaWdodDogMixcbiAgICAvKiogXG4gICAgICog6aG26YOo5by55bmVXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgdG9wOiA0LFxuICAgIC8qKiBcbiAgICAgKiDlupXpg6jlvLnluZVcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBib3R0b206IDhcbn1cbmV4cG9ydCBkZWZhdWx0IEdlbmVyYWxUeXBlXG5cbiJdLCJmaWxlIjoiZW5naW5lcy9nZW5lcmFsVHlwZS5qcyJ9
