# openBSE
[![NPM](https://img.shields.io/npm/v/openbse.svg?style=flat-square)](https://www.npmjs.com/package/openbse)
[![MIT](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://github.com/iamscottxu/openBSE/blob/master/LICENSE)
[![Node.js Package](https://img.shields.io/github/workflow/status/iamscottxu/openBSE/Node.js%20Package?label=Node.js%20Package&logo=github&style=flat-square)](https://github.com/iamscottxu/openBSE/actions?query=workflow%3A%22Node.js+Package%22)

[English Version](https://github.com/iamscottxu/openBSE/blob/master/README.en.md) |
[wiki](https://github.com/iamscottxu/openBSE/wiki) |
[Demo](https://scott-xu.gitee.io/openbse-demo/openBSEDemo.html) |
[Docs](https://iamscottxu.github.io/openBSE-docs/)

高性能 JavaScript 弹幕引擎。同屏弹幕1000+

## 简介
一个高性能 JavaScript 弹幕引擎，简单易用。支持 CSS3 、 Canvas 2D 、 WebGL 和 SVG 渲染方式。支持顶部、底部、逆向弹幕渲染。使用 Canvas 2D 渲染方式可同屏渲染至少1000条弹幕（可达1600条，与电脑配置有关）。

## 安装和使用
### 安装
你可以直接点击[这里](https://github.com/iamscottxu/openBSE/releases)下载最新发行版本，也可以用以下命令安装NPM包。
```Bash
> npm install openbse
```

### 使用
安装完成后，在 Html 页面引入。

压缩版：
```Html
<script src="openBSE.all.min.js"></script>
```
调试版：
```Html
<script src="openBSE.all.js"></script>
```
添加一个 id 为 `BulletScreensDiv` 的固定大小的 div 标签用于显示弹幕，并插入以下 JavaScript 代码。
```JavaScript
var bulletScreenEngine = new openBSE.BulletScreenEngine(document.getElementById('BulletScreensDiv'));
var _startTime = 5000;
for (var i = 0; i < 10000; i++) {
    bulletScreenEngine.addBulletScreen({
        text: "这是一个长长长长长长长长长长长长长长长长长长长长长长长长的测试(^_^)",
        startTime: _startTime
    });
    _startTime += Math.round(Math.random() * 300);
}
bulletScreenEngine.play();
```

用浏览器打开网页即可显示弹幕。

详细使用说明请查看 [wiki](https://github.com/iamscottxu/openBSE/wiki) 。

## 联系作者
如果有任何问题请写下 [issues](https://github.com/iamscottxu/openBSE/issues) 。<br/>
E-mail：[scottxu@scottxublog.com](mailto:scottxu@scottxublog.com)

## 版权声明
这个项目是一个开源项目，遵循 MIT 开源协议。要查看协议，请点击[这里](https://github.com/iamscottxu/openBSE/blob/master/LICENSE)。
