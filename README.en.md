# BulletScreenEngine
[![Version 1.2](https://img.shields.io/badge/version-1.2-brightgreen.svg?style=flat-square)](https://github.com/iamscottxu/BulletScreenEngine/releases/tag/v1.2)
[![NPM](https://img.shields.io/npm/v/bullet-screen-engine.svg?style=flat-square)](https://www.npmjs.com/package/bullet-screen-engine)
[![MIT](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://github.com/iamscottxu/BulletScreenEngine/blob/master/LICENSE)

[中文版本](https://github.com/iamscottxu/BulletScreenEngine/blob/master/README.md) |
[wiki](https://github.com/iamscottxu/BulletScreenEngine/wiki) |
[Demo](https://iamscottxu.github.io/BulletScreenEngine/demo/bulletScreenEngineDemo.html)

A high-performance JavaScript bullet-screen (danmaku) engine. 1000+ at the same time

## Summary
This is a high-performance JavaScript bullet-screen (danmaku) engine and it is very simple and easy to use. This bullet-screen engine can render bullet-screen by using CSS3, Canvas 2D and WebGL. This bullet-screen engine can render top, bottom and backward bullet-screen. Using Canvas 2D can render at lest 1000 bullet-screens at the same time. (some times can render 1600 ullet-screens at the same time)

## Installation and use
### Installation
You can click [here](https://github.com/iamscottxu/BulletScreenEngine/releases/tag/v1.2) to download latest release version. You also can install NPM package using following commands.
```Bash
> npm install bullet-screen-engine
```

### Use
After the installation, include the script in the html page.

Minimum Version:
```Html
<script src="bulletScreenEngine.all.min.js"></script>
```
Debug Version:
```Html
<script src="bulletScreenEngine.all.js"></script>
```
For display bullet-screen, you need add a fixed-size div tag in the html page and the id is `BulletScreensDiv`. Then add the following JavaScript code.
```JavaScript
var bulletScreenEngine = new BulletScreenEngine(document.getElementById('BulletScreensDiv'));
var _startTime = 5000;
for (var i = 0; i < 10000; i++) {
    bulletScreenEngine.addBulletScreen({
        text: "This is a long long long long long long long long long test(^_^)",
        color: 'white',
        startTime: _startTime
    });
    _startTime += parseInt(Math.random() * 300);
}
bulletScreenEngine.play();
```
Open the web page with a browser to display the bullet-screen. 

See [wiki](https://github.com/iamscottxu/BulletScreenEngine/wiki) for detailed instructions.

## Contact
If you have any issue please write [issues](https://github.com/iamscottxu/BulletScreenEngine/issues).<br/>
E-mail：[scottxu@scottxublog.com](mailto:scottxu@scottxublog.com)

## Copyright
This project is an open source project and it is licensed under the MIT License. If you want to read this license, please click [here](https://github.com/iamscottxu/BulletScreenEngine/blob/master/LICENSE).