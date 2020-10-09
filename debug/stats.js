/**
 * @author mrdoob / http://mrdoob.com/
 * @author jetienne / http://jetienne.com/
 * @author paulirish / http://paulirish.com/
 */
window.stats = function (statsTitle, min, max, color, container) {

    var GRAPH_HEIGHT = container.clientHeight - 15;
    var GRAPH_WIDTH = container.clientWidth;
    var COLOR = color;
    var values = [];
    var _min = min;
    var _max = max;


    var statsDiv = document.createElement('div');
    statsDiv.style.cssText = 'text-align:left;';
    container.appendChild(statsDiv);



    var statsGraph;
    var statsText;
    var getDevicePixelRatio = function() {
        if (typeof window.devicePixelRatio === 'number') return window.devicePixelRatio;
        if (typeof window.screen.deviceXDPI === 'number' && typeof window.screen.logicalXDPI === 'number') return screen.deviceXDPI / screen.logicalXDPI;
        return 1;
    }
    var load = function () {
        while(statsDiv.hasChildNodes()) statsDiv.removeChild(statsDiv.firstChild);
        statsText = document.createElement('div');
        statsText.style.cssText = 'color:' + COLOR + ';font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
        statsText.innerHTML = statsTitle;
        statsDiv.appendChild(statsText);

        statsGraph = document.createElement('canvas');
        statsGraph.style.cssText = 'position:relative;width:' + GRAPH_WIDTH + 'px;height:' + GRAPH_HEIGHT + 'px;background-color:' + COLOR;
        statsDiv.appendChild(statsGraph);
    }
    load();

    var redrawGraph = function (dom) {
        var devicePixelRatio = getDevicePixelRatio();
        dom.width = GRAPH_WIDTH * devicePixelRatio;
        dom.height = GRAPH_HEIGHT * devicePixelRatio;
        var ctx = dom.getContext("2d");
        ctx.scale(devicePixelRatio, devicePixelRatio);
        ctx.fillStyle = "rgba(0,0,0,.7)";
        ctx.beginPath();
        ctx.moveTo(0 ,0);
        /*var _length = GRAPH_WIDTH + 1 - values.length;
        for (var i = 0; i <= GRAPH_WIDTH; i++) {
            var percent = 1;
            if (i >= _length) {
                var value = values[i - _length];
                percent = 1 - (value - _min) / (_max - _min);
            }
            ctx.lineTo(i, GRAPH_HEIGHT * percent);
        };*/
        values.forEach(function(value, index) {
            ctx.lineTo(index, GRAPH_HEIGHT * (1 - (value - _min) / (_max - _min)));
        });
        if (values.length < GRAPH_WIDTH) {
            ctx.lineTo(values.length - 1, GRAPH_HEIGHT);
            ctx.lineTo(GRAPH_WIDTH, GRAPH_HEIGHT);
        }
        ctx.lineTo(GRAPH_WIDTH, 0);
        ctx.fill();
    };

    var setMaxAndMin = function () {
        _min = min;
        _max = max;
        for (var index = 0; index < values.length; index++) {
            if (values[index] < _min) _min = values[index];
            if (values[index] > _max) _max = values[index];
        }
    }

    return {
        domElement: container,

        update: function (value, showValue) {

            if (values.push(value) > GRAPH_WIDTH + 1) values.shift();

            statsText.textContent = statsTitle + ": " + showValue;

            setMaxAndMin();
            redrawGraph(statsGraph);

        },

        clean: function () {

            values = [];

            setMaxAndMin();
            redrawGraph(statsGraph);
        },

        reSize: function () {

            GRAPH_HEIGHT = container.clientHeight - 18;
            GRAPH_WIDTH = container.clientWidth;

            load();
            redrawGraph(statsGraph);
        }

    };

};
