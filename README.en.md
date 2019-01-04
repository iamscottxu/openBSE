# BulletScreenEngine
[![Version 1.0](https://img.shields.io/badge/version-1.0-brightgreen.svg?style=flat-square)](https://github.com/iamscottxu/BulletScreenEngine/releases/tag/1.0)
[![NPM](https://img.shields.io/npm/v/bullet-screen-engine.svg?style=flat-square)](https://www.npmjs.com/package/bullet-screen-engine)
[![MIT](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://github.com/iamscottxu/BulletScreenEngine/blob/master/LICENSE)

[中文版本](https://github.com/iamscottxu/BulletScreenEngine/blob/master/README.md)
[See wiki for detailed instructions](https://github.com/iamscottxu/BulletScreenEngine/wiki)

A high-performance JavaScript bullet-screen (danmaku) engine. 1000+ at the same time

## Summary
This is a high-performance JavaScript bullet-screen (danmaku) engine and it is very simple and easy to use. This bullet-screen engine can render bullet-screen by using CSS3, Canvas 2D and WebGL. This bullet-screen engine can render top, bottom and backward bullet-screen. Using Canvas 2D can render at lest 1000 bullet-screens at the same time. (some times can render 1600 ullet-screens at the same time)

## Installation and use
### Installation
You can click [here](https://github.com/iamscottxu/BulletScreenEngine/releases/tag/1.0) to download latest release version. You also can install NPM package using following commands and build it.
```Bash
> npm install bullet-screen-engine
> cd node_modules/bullet-screen-engine
> npm install
> npm run build
```
You need to installed gulp globally before building it. 
```Bash
> npm install --global gulp
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
For display bullet-screen, you need add a fixed-size div tag in the html page and the id is `BulletScreensDiv`. Then add following JavaScript codes.
```JavaScript
var bulletScreenEngine = new BulletScreenEngine(document.getElementById('BulletScreensDiv'));
let _startTime = 5000;
for (let i = 0; i < 10000; i++) {
    bulletScreenEngine.addBulletScreen({
        text: "This is a long long long long long long long long long test(^_^)",
        color: 'white',
        borderCorol: 'black',
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
This project is an open source project and it is use MIT License. If you want to read this license, please click [here](https://github.com/iamscottxu/BulletScreenEngine/blob/master/LICENSE).