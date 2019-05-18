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
    var load = function () {
        while(statsDiv.hasChildNodes()) statsDiv.removeChild(statsDiv.firstChild);
        statsText = document.createElement('div');
        statsText.style.cssText = 'color:' + COLOR + ';font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
        statsText.innerHTML = statsTitle;
        statsDiv.appendChild(statsText);

        statsGraph = document.createElement('div');
        statsGraph.style.cssText = 'position:relative;width:' + GRAPH_WIDTH + 'px;height:' + GRAPH_HEIGHT + 'px;background-color:' + COLOR;
        statsDiv.appendChild(statsGraph);

        while (statsGraph.children.length < GRAPH_WIDTH) {

            var bar = document.createElement('span');
            bar.style.cssText = 'top:0;left:' + statsGraph.children.length + 'px;position:absolute;width:1px;height:100%;background-color:rgba(0, 0, 0, 0.7)';
            statsGraph.appendChild(bar);

        }
    }
    load();

    var redrawGraph = function (dom) {
        var _length = GRAPH_WIDTH - values.length;
        [].forEach.call(dom.children, function (c, i) {
            var percent = 100;
            if (i >= _length) {
                var value = values[i - _length];
                percent = 100 * (1 - (value - _min) / (_max - _min));
            }
            c.style.height = percent + '%';
        });
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

            if (values.push(value) > GRAPH_WIDTH) values.shift();

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
