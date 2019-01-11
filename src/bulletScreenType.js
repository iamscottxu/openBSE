/**
 * 弹幕类型枚举
 * @alias openBSE.BulletScreenType
 * @readonly
 * @enum {number}
 */
const BulletScreenType = {
    /** 从右到左弹幕 */
    rightToLeft: 1,
    /** 从左到右弹幕（逆向弹幕） */
    leftToRight: 2,
    /** 顶部弹幕 */
    top: 4,
    /** 底部弹幕 */
    bottom: 8
}

export { BulletScreenType }