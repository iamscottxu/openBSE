import Helper from './lib/helper'
import Resources from './lib/resources'
import * as build from './build.json'

/**
 * 获取版本信息。
 * @alias openBSE.getVersion
 * @returns {openBSE~VersionInfo} 版本信息：一个 {@link openBSE~VersionInfo} 结构。
 */
function getVersion() {
    return Helper.clone(build);
}

/**
 * 打印版本信息
 * @private
 */
function printInfo() {
    //IE Edge 浏览器不支持 %c
    if (!!window.ActiveXObject || "ActiveXObject" in window || navigator.userAgent.indexOf("Trident") > -1 ||
        navigator.userAgent.indexOf("MSIE") > -1 || navigator.userAgent.indexOf("Edge") > -1) console.info(
            Resources.LOADED_INFO_IE.fillData(build)
        );
    //Other
    else console.info(
        Resources.LOADED_INFO.fillData(build),
        'font-weight:bold; color:#0099FF;', '', 'font-style:italic;', ''
    );
}

export { getVersion, printInfo }