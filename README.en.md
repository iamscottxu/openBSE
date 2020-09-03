# openBSE
[![Version 3.0](https://img.shields.io/badge/version-2.1-brightgreen.svg?style=flat-square)](https://github.com/iamscottxu/openBSE/releases/tag/v3.0)
[![NPM](https://img.shields.io/npm/v/openbse.svg?style=flat-square)](https://www.npmjs.com/package/openbse)
[![NPM](https://img.shields.io/npm/v/bullet-screen-engine.svg?style=flat-square)](https://www.npmjs.com/package/bullet-screen-engine)
[![MIT](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://github.com/iamscottxu/openBSE/blob/master/LICENSE)

[中文版本](https://github.com/iamscottxu/openBSE/blob/master/README.md) |
[wiki](https://github.com/iamscottxu/openBSE/wiki) |
[Demo](https://iamscottxu.github.io/openBSE/demo/openBSEDemo.html)
[Docs](https://iamscottxu.github.io/openBSE/docs/3.0/index.html)

A high-performance JavaScript bullet-screen (danmaku) engine. 1000+ at the same time

## Summary
This is a high-performance JavaScript bullet-screen (danmaku) engine and it is very simple and easy to use. This bullet-screen engine can render bullet-screen by using CSS3, Canvas 2D, WebGL and SVG. This bullet-screen engine can render top, bottom and backward bullet-screen. Using Canvas 2D can render at lest 1000 bullet-screens at the same time. (some times can render 1600 ullet-screens at the same time)

## Installation and use
### Installation
You can click [here](https://github.com/iamscottxu/openBSE/releases/tag/v3.0) to download latest release version. You also can install NPM package using following commands.
```Bash
> npm install openbse
```

### Use
After the installation, include the script in the html page.

Minimum Version:
```Html
<script src="openBSE.all.min.js"></script>
```
Debug Version:
```Html
<script src="openBSE.all.js"></script>
```
For display bullet-screen, you need add a fixed-size div tag in the html page and the id is `BulletScreensDiv`. Then add the following JavaScript code.
```JavaScript
var bulletScreenEngine = new openBSE.BulletScreenEngine(document.getElementById('BulletScreensDiv'));
var _startTime = 5000;
for (var i = 0; i < 10000; i++) {
    bulletScreenEngine.addBulletScreen({
        text: "This is a long long long long long long long long long test(^_^)",
        startTime: _startTime
    });
    _startTime += Math.round(Math.random() * 300);
}
bulletScreenEngine.play();
```
Open the web page with a browser to display the bullet-screen. 

See [wiki](https://github.com/iamscottxu/openBSE/wiki) for detailed instructions.

## Contact
If you have any issue please write [issues](https://github.com/iamscottxu/openBSE/issues).<br/>
E-mail：[scottxu@scottxublog.com](mailto:scottxu@scottxublog.com)

## Copyright
This project is an open source project and it is licensed under the MIT License. If you want to read this license, please click [here](https://github.com/iamscottxu/openBSE/blob/master/LICENSE).