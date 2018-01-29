window.qbian = window.qbian || {};

(function(qbian) {
    'use strict';

    // 自定义日志
    var log = window.qbian.logger('index');

    // ========================== 获取页面 id
    var pathname = window.qbian.config.pathname;
    
    var canvasDom = document.getElementById('canvas'),
        cvsW, cvsH,
        canvas = new window.qbian.Canvas(canvasDom, canvasDom.getContext('2d')),
        imageCache = new window.qbian.ImageCache(pathname, document.getElementById('imgBox')),
        socket = io.connect(qbian.config.wsUrl);

    log('id=' +pathname+ ' 缓存的本地图片：', imageCache.getImages());

    window.qbian.socket = socket;

    socket.on('clearAll', function(d) {
        if(pathname !== d.pathname) return;
        canvas.clearAll(d);
    });

    socket.on('drawing', function(d) {
        if(pathname !== d.pathname) return;
        if(d.type === 'image') {
            canvasDom.style.background = 'url('+ d.url +') no-repeat center';
            canvasDom.style.backgroundSize = 'contain';
            return imageCache.addImage(d);
        }
        if(d.type === 'deleteImage') {
            return imageCache.removeImage(d);
        }
        canvas.drawing(d);
    });
    
    // ========================== 清空画板
    document.getElementById('clearAll').addEventListener('click', function() {
        socket.emit('clearAll', {pathname});
    }, false);

    // ========================== 改变线条颜色、更新画笔颜色
    var lineColor = '#000',
        setColorDom = document.getElementById('setColor'),
        colorDom =  document.getElementById('color'),
        colorDoms = document.getElementsByClassName('color-item');
    setColorDom.style.backgroundColor = lineColor;

    setColorDom.addEventListener('click', function(e) {
        colorDom.style.display = colorDom.style.display === 'block' ? 'none' : 'block';
    }, false);

    for (var i = 0; i < colorDoms.length; i++){
        colorDoms[i].addEventListener('click', function(e) {
            lineColor = e.target.style.backgroundColor;
            setColorDom.style.backgroundColor = lineColor;
            hideAll();
        }, false);
    }

    // ========================== 改变线条粗细
    var lineWidth = 2,
        setLineWidth = document.getElementById('setLineWidth'),
        lineWidthDom = document.getElementById('lineWidth'),
        lineDoms = document.getElementsByClassName('line-item');
    setLineWidth.innerHTML = lineWidth;

    setLineWidth.addEventListener('click', function() {
        lineWidthDom.style.display = lineWidthDom.style.display === 'block' ? 'none' : 'block';
    }, false);

    for (var i = 0; i < lineDoms.length; i++){
        lineDoms[i].addEventListener('click', function(e) {
            lineWidth = e.target.innerHTML;
            setLineWidth.innerHTML = lineWidth;
            hideAll();
        }, false);
    }

    // ========================== 线条
    var polygon = 0;
    document.getElementById('line').addEventListener('click', function() {
        polygon = 0;
        delet = false;
        className = 'canvas-line';
        updateCursor();
    }, false);

    // ========================== 直线
    document.getElementById('straightLine').addEventListener('click', function() {
        polygon = 2;
        delet = false;
        className = 'canvas-straightLine';
        updateCursor();
    }, false);

    // ========================== 矩形
    document.getElementById('rect').addEventListener('click', function() {
        polygon = 4;
        delet = false;
        className = 'canvas-rect';
        updateCursor();
    }, false);
    
    // ========================== 圆形
    document.getElementById('round').addEventListener('click', function() {
        polygon = 100;
        delet = false;
        className = 'canvas-round';
        updateCursor();
    }, false);

    // ========================== 文本
    var content = '';
    document.getElementById('text').addEventListener('click', function() {
        content = prompt('在下面输入你想写的内容');
        if(!content) return content = '';
        updateCursor('canvas-text');
        log('输入的文本内容', content);
    }, false);

    // ========================== 在 canvas 内，按下鼠标事件
    var drawing = false;
    canvasDom.addEventListener('mousedown', function(event) {
        hideAll();

        // 删除
        if(delet && container.selected.id) {
            return emit(new qbian.Delete(container.selected.id));
        }
        var startDot ={
            x: (event.clientX+document.documentElement.scrollLeft+document.body.scrollLeft - canvasDom.offsetLeft)/cvsW,
            y: (event.clientY+document.documentElement.scrollTop+document.body.scrollTop - canvasDom.offsetTop)/cvsH
        }, straightLine, rect, round, line;
        
        // 文本
        if(content != '') {
            emit(new qbian.Text(lineColor, lineWidth, content, startDot));
            updateCursor(className);
            return content = '';
        }
        // 直线
        else if(polygon === 2) {
            straightLine = new qbian.StraightLine(lineColor, lineWidth, startDot, startDot);
        }
        // 矩形
        else if(polygon === 4) {
            rect = new qbian.Rect(lineColor, lineWidth, startDot, startDot, {x: 0, y: 0});
        }
        // 圆形
        else if(polygon === 100) {
            round = new qbian.Round(lineColor, lineWidth, startDot, startDot, {x: 0, y: 0}, 0);
        }
        // 线条
        else {
            line = new qbian.Line(lineColor, lineWidth, [startDot]);
        }

        drawing = true;
        var lastTime = Date.now();
        // ========================== 在 canvas 内，按下鼠标 且 移动事件
        window.onmousemove = function(event){
            if(delet) {// 点击下去，并且移动，删除操作将取消
                delet = false; 
                updateCursor(tempClass);
            }

            if(!drawing) return;
            if((Date.now() - lastTime) < 20) return;
            lastTime = Date.now();

            event = event || window.event;
            var endDot = {
                x: (event.clientX+document.documentElement.scrollLeft+document.body.scrollLeft - canvasDom.offsetLeft)/cvsW,
                y: (event.clientY+document.documentElement.scrollTop+document.body.scrollTop - canvasDom.offsetTop)/cvsH
            };
            // log('onmousemove endDot ==>', endDot);
            
            // 直线
            if(polygon === 2) {
                straightLine.endDot = endDot;
                return emit(straightLine);
            }
            // 矩形
            else if(polygon === 4) {
                rect.endDot = endDot;
                rect.sideLength = {
                    x: Math.abs(rect.endDot.x - rect.startDot.x),
                    y: Math.abs(rect.endDot.y - rect.startDot.y)
                };
                return emit(rect);
            } 
            // 圆形
            else if(polygon === 100) {
                round.endDot = endDot;
                round.sideLength = {
                    x: Math.abs(endDot.x - startDot.x),
                    y: Math.abs(endDot.y - startDot.y)
                };
                round.startDot = {
                    x: (startDot.x + endDot.x) / 2,
                    y: (startDot.y + endDot.y) / 2
                };
                round.r = Math.sqrt( Math.pow(round.sideLength.x*cvsW, 2) + Math.pow(round.sideLength.y*cvsH, 2) )/(cvsW/cvsH)/2;
                return emit(round);
            }
            // 线条
            else {
                line.points.push(endDot);
                emit(line);
                return startDot = endDot;
            }
        };

        // ========================== 在 canvas 内，松开鼠标事件
        window.onmouseup = function(event){
            if(!drawing) return;
            window.onmousemove = null;
        };

    }, false);

    // ========================== 移出 canvas 事件
    canvasDom.addEventListener('mouseout', function onMouseUp(e){
        if (!drawing) { return; }
        drawing = false;
    }, false);


    // ========================== 选中
    var delet = false,
        tempClass = 'canvas-line',
        container;
    document.getElementById('delete').addEventListener('click', function() {
        delet = !delet;
        if(delet) {
            container = canvas.getContainer();
            if(className && className != 'canvas-delete') tempClass = className;
            className = 'canvas-delete';
        } else {
            className = tempClass;
        }
        updateCursor();
    }, false);

    // ========================== 撤销
    document.getElementById('undo').addEventListener('click', function() {
        var id = canvas.getLastOptId();
        if(id) emit(new qbian.Delete(id));
    }, false);
    
    // ========================== 更换背景
    var imgDom = document.getElementById('imgs');
    document.getElementById('setImage').addEventListener('click', function() {
        imgDom.style.display = imgDom.style.display === 'block' ? 'none' : 'block';
        filePathDom.focus();
    }, false);

    var filePathDom = document.getElementById('filePath');
    document.getElementById('uploadBtn').addEventListener('click', function() {
        var filePath = filePathDom.value;
        if(qbian.isNetWorkPicUrl(filePath))  return emit(new window.qbian.Image(filePath));
        alert('添加的网络图片地址不在定义范围（jpg, png, jpeg）内');
    }, false);

    function imageDomClick(e) {
        log('更换背景图, url=' + e.target.src);
        e.stopPropagation();
        var src = e.target.src;
        if(!src) return; 
        emit(new qbian.Image(src));
        hideAll();
    }
    function imageDltDomClick(e) {
        log('删除背景图, url=' + e.target.dataset.url);
        e.stopPropagation();
        imageCache.removeImage(new qbian.DeleteImage(e.target.dataset.url));
    }
    function bindImagesEv() {
        var imageDoms = document.getElementsByClassName('image-item');
        var imagedltDoms = document.getElementsByClassName('image-item-delete');
        
        for (var i = 0; i < imageDoms.length; i++){
            imageDoms[i].removeEventListener('click', imageDomClick, false);
            imageDoms[i].addEventListener('click', imageDomClick, false);
            
            
            (function(i) {
                if(imageDoms[i].src === window.qbian.config.whiteBgImgUrl) return; // 默认图片不显示可删除按钮

                imageDoms[i].addEventListener('mouseover', function(e) {
                    imagedltDoms[i].style.display = 'block';
                }, false);
    
                imageDoms[i].addEventListener('mouseout', function(e) {
                    imagedltDoms[i].style.display = 'none';
                }, false);

                imagedltDoms[i].addEventListener('mouseover', function(e) {
                    imagedltDoms[i].style.display = 'block';
                }, false);

                imagedltDoms[i].addEventListener('mouseout', function(e) {
                    imagedltDoms[i].style.display = 'none';
                }, false);
            })(i);

            imagedltDoms[i].removeEventListener('click', imageDltDomClick, false);
            imagedltDoms[i].addEventListener('click', imageDltDomClick, false);
        }
    }
    bindImagesEv();
    window.qbian.bus.on('updateImages', bindImagesEv);

    // 移动鼠标，选中画布上元素
    canvasDom.addEventListener('mousemove', function(event) {
        if(!delet) return;
        // console.info('选中操作', container);
        var x = event.clientX+document.documentElement.scrollLeft+document.body.scrollLeft - canvasDom.offsetLeft;
        var y = event.clientY+document.documentElement.scrollTop+document.body.scrollTop - canvasDom.offsetTop;
        var mHalf = 5;
        var dot = {
            x0: x - mHalf,
            y0: y - mHalf,
            x1: x + mHalf,
            y1: y + mHalf
        };
        var o,has = false;
        for(var key in container.session) {
            if(has) break;

            o = container.session[key];
            switch(o.type) {
                case 'line' : { // 线条
                    for(var i = 0, len = o.points.length; i < len; i ++) {
                        if(dot.x0 - mHalf < o.points[i].x*cvsW && dot.x1 + mHalf > o.points[i].x*cvsW 
                            && dot.y0 - mHalf < o.points[i].y*cvsH && dot.y1 + mHalf > o.points[i].y*cvsH) {
                            container.selected.id = o.id;
                            has = true;
                        }
                    }
                    break;
                }
                case 'straightLine' : { // 直线
                    var lineLength = Math.sqrt( Math.pow( Math.abs(o.startDot.x*cvsW - o.endDot.x*cvsW) , 2) + Math.pow( Math.abs(o.startDot.y*cvsH - o.endDot.y*cvsH) , 2) ),
                        mStartLength = Math.sqrt( Math.pow( Math.abs(x - o.startDot.x*cvsW) , 2) + Math.pow( Math.abs(y - o.startDot.y*cvsH) , 2) ),
                        mEndLength = Math.sqrt( Math.pow( Math.abs(x - o.endDot.x*cvsW) , 2) + Math.pow( Math.abs(y - o.endDot.y*cvsH) , 2) ),
                        ratio = 1.01;
                    if(lineLength < 100) {
                        ratio = 1.01
                    } else if(lineLength < 200) {
                        ratio = 1.005;
                    } else if(lineLength < 400) {
                        ratio = 1.001;
                    } else if(lineLength < 800) {
                        ratio = 1.0005;
                    } else {
                        ratio = 1.0001;
                    }
                    if( (mStartLength + mEndLength) / lineLength > 1 && (mStartLength + mEndLength) / lineLength < ratio ) {
                        container.selected.id = o.id;
                        has = true;
                    }
                    break;
                }
                case 'round' : { // 圆形
                    if( Math.sqrt( Math.pow( Math.abs(o.startDot.x*cvsW - x) , 2) + Math.pow( Math.abs(o.startDot.y*cvsH - y) , 2) ) < o.r*(cvsW/cvsH)) {
                        container.selected.id = o.id;
                        has = true;
                    }
                    break;
                }
                case 'rect' : { // 矩形
                    var oHalfWidth = o.sideLength.x*cvsW / 2,
                        oHalfHeight = o.sideLength.y*cvsH / 2,
                        oCenter = {
                            x: o.startDot.x < o.endDot.x ? o.startDot.x*cvsW + oHalfWidth : o.startDot.x*cvsW - oHalfWidth,
                            y: o.startDot.y < o.endDot.y ? o.startDot.y*cvsH + oHalfHeight : o.startDot.y*cvsH - oHalfHeight
                        },
                        distance = {
                            x: Math.abs(oCenter.x - x),
                            y: Math.abs(oCenter.y - y)
                        };
                    if(distance.x < (oHalfWidth + mHalf) && distance.y < (oHalfHeight + mHalf)) {
                        container.selected.id = o.id;
                        has = true;
                    }
                    break;
                }
                case 'text' : { // 文本
                    if(dot.x0 < o.startDot.x*cvsW && dot.x1+10 > o.startDot.x*cvsW 
                        && dot.y0 < o.startDot.y*cvsH && dot.y1+o.lineWidth*9 > o.startDot.y*cvsH) {
                        container.selected.id = o.id;
                        has = true;
                    }

                    break;
                }
                default: continue;
            }
        }
        
        if(has) {
            canvas.redraw();
        } else if(container.selected.id !== '') {
            container.selected.id = '';
            canvas.redraw();
        }
    });

    // ========================== 监听窗口重置大小事件
    var wh = 6/3;
    window.addEventListener('resize', onResize, false);
    function onResize() {
        if(window.visualViewport.width / window.innerHeight > wh) { // 太宽了，以高为基准
            canvasDom.height = window.innerHeight;
            canvasDom.width = window.innerHeight * wh;
        } else { // 太高了，以宽为基准
            canvasDom.width = window.visualViewport.width;
            canvasDom.height = window.visualViewport.width / wh;
        }
        canvasDom.style.marginLeft = (window.visualViewport.width - canvasDom.width) / 2 +'px';
        
        log('canvasDom.width='+canvasDom.width,'canvasDom.height='+canvasDom.height);
        cvsW = canvasDom.width;
        cvsH = canvasDom.height;
        canvas.setWH(cvsW, cvsH); // 设置 画布 宽高
        canvas.redraw(); // 窗口重置时，画布重新绘制
    }
    onResize();

    // ========================== 发送数据
    function emit(data) {
        data.pathname = pathname;

        socket.emit('drawing', data);
    }

    // ========================== 更新鼠标样式
    var className = '';
    function updateCursor(clazzName) {
        if(clazzName) {
            canvasDom.className = clazzName + ' canvas';
        } else {
            canvasDom.className = className + ' canvas';
        }
    }

    // ========================== 隐藏全部弹出框
    function hideAll() {
        lineWidthDom.style.display = 'none';
        colorDom.style.display = 'none';
        imgDom.style.display = 'none';
    }


})(window.qbian);