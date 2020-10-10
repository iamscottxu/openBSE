window.onload = function () {
    window.renderMode = "canvas";
    window.fpsStats = new stats("FPS", 55, 65, "#75F8FB", document.getElementById('fps'));
    window.delayStats = new stats("Delay", 0, 10, "#7DEE3A", document.getElementById('delay'));
    window.realTimeBulletScreenCountStats = new stats("Real Time Bullet-Screen Count", 0, 10, "#EA5798", document.getElementById('realTimeBulletScreenCount'));

    var versionInfo = openBSE.getVersion();
    document.getElementById("version").innerText = document.getElementById("contextmenu_item_version").innerText = versionInfo.version;
    document.getElementById("buildDate").innerText = versionInfo.buildDate;

    window.generalEngine = new openBSE.GeneralEngine(document.getElementById('BulletScreensDiv'), {
        defaultStyle: {
            fontFamily: '"Microsoft YaHei","PingFang SC",SimHei,"Heiti SC",sans-serif',
            borderColor: 'rgba(0,0,0,0.4)',
            fontWeight: 'normal',
            shadowBlur: 4
        }
    }, getRenderMode());

    setRenderModeRadioDefault();

    var bulletScreenContextmenu = new openBSE.Contextmenu(generalEngine, document.getElementById('bullet_screen_contextmenu'));
    var stageContextmenu = new contextmenu(document.getElementById('stage'), document.getElementById('stage_contextmenu'));

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
    fpsStats.update(debugInfo.fps, debugInfo.fps.toFixed(2));
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

function getRenderMode() {
    switch (location.hash) {
        case "#css3":
            return "css3";
        case "#webgl":
            return "webgl";
        case "#svg":
            return "svg";
        default:
            return "canvas";
    }
}

function setRenderModeRadioDefault() {
    var renderMode = getRenderMode();
    var radios = document.getElementById("renderModes");
    for (var index = 0;index < radios.length; index++)
    {
        if(radios[index].value == renderMode)
            radios[index].checked = "checked";
    }    
}

function setRenderModes() {
    var formData = new FormData(document.getElementById("renderModes"));
    location.replace("#" + formData.get('renderModes'));
    location.reload();
}

function set(key, value) {
    var object = {};
    object[key] = value;
    generalEngine.options = object;
}
