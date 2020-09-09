/**
 * requestAnimationFrame 定义（一些老式浏览器不支持 requestAnimationFrame ）
 * @param {function} fun - 回调方法 
 * @function
*/
let requestAnimationFrame;
let cancelAnimationFrame;
if (typeof window.requestAnimationFrame === 'function' &&
    typeof window.cancelAnimationFrame === 'function') {
    requestAnimationFrame = window.requestAnimationFrame;
    cancelAnimationFrame = window.cancelAnimationFrame;
}
else {
    console.warn(Resources.REQUESTANIMATIONFRAME_NOT_SUPPORT_WARN);
    requestAnimationFrame = (callback) => window.setTimeout(callback, 17); //60fps
    cancelAnimationFrame = (handle) => window.clearTimeout(handle);
}

export { requestAnimationFrame, cancelAnimationFrame };
