
window.qbian = window.qbian || {};
window.qbian.Canvas = (function() {

    var canvas,
        context,
        cvsW,
        cvsH,
        container = {
            selected: {
                id: '',
                extensionWidth: 1,
                lineColor: 'red'//'#00ff00'
            },
            backImages: [],
            session: {}
        };
        

    function Canvas(cvs, ctx) {
        canvas = cvs;
        context = ctx;
        cvsW = cvs.width;
        cvsH = cvs.height;
    }

    // ========================== 获取页面 id
    
    // 绘制图形
    Canvas.prototype = {
        drawing: function(d) {
            if(d.type === 'delete') {
                delete container.session[d.id];
            } else {
                container.session[d.id] = d;
            }

            redraw(); // 重新绘制画布
        },
        // 清空 画板
        clearAll: function(d) {
            canvas.width = canvas.width;
            container.session = {};
        },
        setWH: function(w, h) {
            cvsW = w;
            cvsH = h;
        },
        getContainer: function() {
            return container;
        },
        getLastOptId: function() {
            var lastTime = 0, id = '';
            for(var key in container.session) {
                if(lastTime < container.session[key].time) {
                    lastTime = container.session[key].time;
                    id = container.session[key].id;
                }
            }
            return id;
        },
        redraw: redraw
    };

    // ============================================================================================
    // ============================================================================================
    // ============================================================================================

    function redraw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        var o, lineColor, lineWidth;
        for(var key in container.session) {
            o = container.session[key];
            lineColor = o.lineColor;
            lineWidth = o.lineWidth;
            if(container.selected.id === o.id) {
                lineColor = container.selected.lineColor;
                lineWidth = o.lineWidth * 1 + container.selected.extensionWidth;
            }
            switch(o.type) {
                case 'line' : { // 线条
                    if(o.points.length < 2) break;
                    
                    context.beginPath(); // 起始一条路径，或重置当前路径
                    context.moveTo(o.points[0].x*cvsW, o.points[0].y*cvsH); // 把路径移动到画布中的指定点，不创建线条
                    for(var i = 1, len = o.points.length; i < len; i ++) {
                        context.lineTo(o.points[i].x*cvsW, o.points[i].y*cvsH); // 添加一个新点，然后在画布中创建从该点到最后指定点的线条
                    }
                    context.strokeStyle = lineColor; // 设置或返回用于笔触的颜色、渐变或模式
                    context.lineWidth = lineWidth; // 设置或返回当前的线条宽度
                    context.stroke(); // 绘制已定义的路径
                    context.closePath(); // 创建从当前点回到起始点的路径
                    break;
                }
                case 'straightLine' : { // 直线
                    context.beginPath();
                    context.moveTo(o.startDot.x*cvsW, o.startDot.y*cvsH);
                    context.lineTo(o.endDot.x*cvsW, o.endDot.y*cvsH);
                    context.strokeStyle = lineColor;
                    context.lineWidth = lineWidth;
                    context.stroke();
                    context.closePath();
                    break;
                }
                case 'rect' : { // 矩形
                    context.beginPath();
                    context.rect(o.startDot.x*cvsW, o.startDot.y*cvsH, o.endDot.x*cvsW - o.startDot.x*cvsW, o.endDot.y*cvsH - o.startDot.y*cvsH);
                    context.strokeStyle = lineColor;
                    context.lineWidth = lineWidth;
                    // context.fill();
                    context.stroke();
                    break;
                }
                case 'round' : { // 圆形
                    context.beginPath();
                    context.arc(o.startDot.x*cvsW, o.startDot.y*cvsH, o.r*(cvsW/cvsH), 0, 2 * Math.PI);
                    context.strokeStyle = lineColor;
                    context.lineWidth = lineWidth;
                    context.stroke();
                    break;
                }
                case 'text' : { // 文本
                    context.font = parseInt(lineWidth) * 10 + "px serif";
                    context.fillStyle = lineColor;
                    context.fillText(o.content, o.startDot.x*cvsW, o.startDot.y*cvsH);
                    break;
                }
                default: continue;
            }
        }
    }

    // 输出日志
    function log(...param) {
        // console.info(...param);
    }

    return Canvas;
})();
