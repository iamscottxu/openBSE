window.onload = function () {
    window.fpsStats = new stats("FPS", 55, 65, "#75F8FB", document.getElementById('fps'));
    window.delayStats = new stats("Delay", 0, 10, "#7DEE3A", document.getElementById('delay'));
    window.realTimeBulletScreenCountStats = new stats("Real Time Bullet-Screen Count", 0, 10, "#EA5798", document.getElementById('realTimeBulletScreenCount'));

    var versionInfo = openBSE.getVersion();
    document.getElementById("version").innerText = document.getElementById("contextmenu_item_version").innerText = versionInfo.version;
    document.getElementById("buildDate").innerText = versionInfo.buildDate;

    window.videoElement = document.getElementById('video');

    window.generalEngine = new openBSE.GeneralEngine(document.getElementById('BulletScreensDiv'), {
        defaultStyle: {
            fontFamily: '"Microsoft YaHei","PingFang SC",SimHei,"Heiti SC",sans-serif',
            borderColor: 'rgba(0,0,0,0.4)',
            fontWeight: 'normal',
            shadowBlur: 4
        },
        clock: () => videoElement.currentTime * 1000
    }, 'canvas');

    var bulletScreenContextmenu = new openBSE.Contextmenu(generalEngine, document.getElementById('bullet_screen_contextmenu'));
    var stageContextmenu = new contextmenu(document.getElementById('stage'), document.getElementById('stage_contextmenu'));

    videoElement.addEventListener('playing', () => {
        generalEngine.play();
    });
    videoElement.addEventListener('waiting', () => {
        generalEngine.pause();
    });
    videoElement.addEventListener('pause', () => {
        generalEngine.pause();
    });
    videoElement.addEventListener('ended', () => {
        generalEngine.stop();
        loadData();
    });
    videoElement.addEventListener('seeking', () => {
        generalEngine.cleanScreen();
        generalEngine.pause();
    });
    videoElement.addEventListener('seeked', () => {
        //addBulletScreenList(videoElement.currentTime * 1000);
        if (!videoElement.paused) generalEngine.play();
    });
    videoElement.addEventListener('ratechange', () => {
        window.generalEngine.setOptions({
            playSpeed: videoElement.playbackRate
        });
    });

    generalEngine.bind('click', function (e) {
        document.getElementById("clickText").innerText = e.getBulletScreen().text;
        e.setBulletScreen({
            style: { color: 'red' },
            layer: 2
        }, true);
    });

    

    document.getElementById('contextmenu_item_debug_info').onclick = function(e) {
        stageContextmenu.closeContextmenu();
        var debugInfo = document.getElementById('debug_info');
        if (debugInfo.style.display != 'none') return;
        debugInfo.style.display = '';
        fpsStats.reSize();fpsStats.clean();
        delayStats.reSize();delayStats.clean();
        realTimeBulletScreenCountStats.reSize();realTimeBulletScreenCountStats.clean();
        setTimeout(showDebugInfo, 0);
    }
    document.getElementById('debug_info_close').onclick = function(e) {
        document.getElementById('debug_info').style.display = 'none';
    }

    if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource('https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8');
        hls.attachMedia(videoElement);
    }
    
    loadData();
}

function loadData() {
    var _startTime = 1000;
    for (var i = 0; i < 10000; i++) {
        if (Math.random() > 0.6)
            generalEngine.add({
                text: "这是一个长长长长长长长长长长长长长长长长长长长长长长长长的测试(^_^)",
                startTime: _startTime,
                type: openBSE.GeneralType.rightToLeft,
                style: {
                    speed: 0.15 + Math.random() / 90,
                    size: 23,
                    color: 'white'
                }
            });
        else
            generalEngine.add({
                text: "橘里橘气",
                startTime: _startTime,
                type: (Math.random() > 0.4) ? openBSE.GeneralType.rightToLeft : openBSE.GeneralType.top,
                style: {
                    speed: 0.1 + Math.random() / 90,
                    color: '#FFCC66'
                }
            });
        _startTime += Math.round(Math.random() * 500);
    }
}

function showDebugInfo() {
    var debugInfo = generalEngine.debugInfo;
    document.getElementById("time").innerText = debugInfo.time.toFixed(2);
    document.getElementById("bufferBulletScreenCount").innerText = debugInfo.bufferBulletScreenCount;
    document.getElementById("delayBulletScreenCount").innerText = debugInfo.delayBulletScreenCount;
    delayStats.update(debugInfo.delay, debugInfo.delay.toFixed(2) + 'ms');
    fpsStats.update(debugInfo.fps, debugInfo.fps);
    realTimeBulletScreenCountStats.update(debugInfo.realTimeBulletScreenCount, debugInfo.realTimeBulletScreenCount);
    if (document.getElementById('debug_info').style.display != 'none') setTimeout(showDebugInfo, 100);
}

function sendBulletScreen() {
    var bulletScreenText = document.getElementById("BulletScreenText").value;
    document.getElementById("BulletScreenText").value = '';
    generalEngine.add({
        text: bulletScreenText,
        style: {
            boxColor: 'white'
        },
        layer: 1,
        canDiscard: false
    });
}

function sethiddenTypes() {
    var formData = new FormData(document.getElementById("hiddenTypes"));
    var hiddenTypesList = formData.getAll('hiddenTypes');
    var hiddenTypes = 0;
    for (var index in hiddenTypesList) hiddenTypes += parseInt(hiddenTypesList[index]);
    generalEngine.options = {
        hiddenTypes: hiddenTypes
    };
}

function set(key, value) {
    var object = {};
    object[key] = value;
    generalEngine.options = object;
}