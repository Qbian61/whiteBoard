window.qbian = window.qbian || {};

(function(qbian) {
    'use strict';

    // ========================= 消息 实体类 ========================

    // 线条类
    qbian.Line = function(lineColor, lineWidth, points) {
        this.type = 'line';
        this.id = uuid.v1();
        this.time = Date.now();
        this.lineColor = lineColor;
        this.lineWidth = lineWidth;
        this.points = points;
    };

    // 直线类
    qbian.StraightLine = function(lineColor, lineWidth, startDot, endDot) {
        this.type = 'straightLine';
        this.id = uuid.v1();
        this.time = Date.now();
        this.lineColor = lineColor;
        this.lineWidth = lineWidth;
        this.startDot = startDot;
        this.endDot = endDot;
    };

    // 矩形类
    qbian.Rect = function(lineColor, lineWidth, startDot, endDot, sideLength) {
        this.type = 'rect';
        this.id = uuid.v1();
        this.time = Date.now();
        this.lineColor = lineColor;
        this.lineWidth = lineWidth;
        this.startDot = startDot;
        this.endDot = endDot;
        this.sideLength = sideLength;
    };

    // 圆形类
    qbian.Round = function(lineColor, lineWidth, startDot, endDot, sideLength, r) {
        this.type = 'round';
        this.id = uuid.v1();
        this.time = Date.now();
        this.lineColor = lineColor;
        this.lineWidth = lineWidth;
        this.startDot = startDot;
        this.endDot = endDot;
        this.sideLength = sideLength;
        this.r = r;
    };

    // 文本类
    qbian.Text = function(lineColor, lineWidth, content, startDot) {
        this.type = 'text';
        this.id = uuid.v1();
        this.time = Date.now();
        this.lineColor = lineColor;
        this.lineWidth = lineWidth;
        this.content = content;
        this.startDot = startDot;
    };

    // 背景图
    qbian.Image = function(url) {
        this.type = 'image';
        this.id = uuid.v1();
        this.time = Date.now();
        this.url = url;
    };

    // 删除背景图
    qbian.DeleteImage = function(url) {
        this.type = 'deleteImage';
        this.id = uuid.v1();
        this.time = Date.now();
        this.url = url;
    };

    // 删除
    qbian.Delete = function(id) {
        this.type = 'delete';
        this.id = id;
    };

    // ========================= 功能类 对象 ========================

    // 观察者模式
    function Event() {
        this._events = {};
    }
    Event.prototype = {
        emit: function(name, obj) {
            if(name in this._events) {
                for(var i = 0, len = this._events[name].length; i < len; ++ i) {
                    this._events[name][i](obj);
                }
            }
        },
        on: function(name, callback) {
            if(!(name in this._events)) this._events[name] = [];
            this._events[name].push(callback);
        },
        remove: function(name, callback) {
            this._events[name] ? this._events[name].splice(this._events[name].indexOf(callback), 1) : void 0;
        },
        removeAll: function(name) {
            this._events[name] = [];
        }
    };

    // 用于不同闭包内之间消息通讯
    qbian.bus = new Event();

    // 日志
    qbian.logger = function(moduleName) {
        return function() {
            if(!qbian.config.outputLog) return;
            var args = Array.prototype.slice.call(arguments, 0);
            console.info('【' + new Date().toLocaleString() + '】[' + moduleName + ']', ...args);
        }
    };

    // 是否是网络图片地址
    qbian.isNetWorkPicUrl = function(strPicUrl) {
        if(strPicUrl.indexOf('http') === 0 && strPicUrl.indexOf('.') > 0) {
            var allPicTypes = ['jpg', 'png', 'jpeg'];

            var picUrls = strPicUrl.split('.');
            return allPicTypes.indexOf(picUrls[picUrls.length - 1]) > -1;
        }
        return false;
    };

    // ========================== 获取页面 id
    var search = location.search,
        pathname = '';
    if(search && search.indexOf('=') > 0) {
        var querys = search.substr(1, search.length).split('&');
        for(var i = 0, len = querys.length; i < len; ++ i) {
            if(querys[i].split('=')[0] === 'id') {
                pathname = querys[i].split('=')[1];
                break;
            }
        }
    }

    // 配置信息
    qbian.config = {
        wsUrl: 'ws://127.0.0.1:8082',
        whiteBgImgUrl: 'http://127.0.0.1:8082/images/white_bg.png',
        outputLog: true,
        pathname: pathname
    };
    

})(window.qbian);
