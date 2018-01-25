window.qbian = window.qbian || {};

// 线条类
window.qbian.Line = function(lineColor, lineWidth, points) {
    this.type = 'line';
    this.id = uuid.v1();
    this.time = Date.now();
    this.lineColor = lineColor;
    this.lineWidth = lineWidth;
    this.points = points;
};

// 直线类
window.qbian.StraightLine = function(lineColor, lineWidth, startDot, endDot) {
    this.type = 'straightLine';
    this.id = uuid.v1();
    this.time = Date.now();
    this.lineColor = lineColor;
    this.lineWidth = lineWidth;
    this.startDot = startDot;
    this.endDot = endDot;
};

// 矩形类
window.qbian.Rect = function(lineColor, lineWidth, startDot, endDot, sideLength) {
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
window.qbian.Round = function(lineColor, lineWidth, startDot, endDot, sideLength, r) {
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
window.qbian.Text = function(lineColor, lineWidth, content, startDot) {
    this.type = 'text';
    this.id = uuid.v1();
    this.time = Date.now();
    this.lineColor = lineColor;
    this.lineWidth = lineWidth;
    this.content = content;
    this.startDot = startDot;
};

// 背景图
window.qbian.Image = function(url) {
    this.type = 'image';
    this.id = uuid.v1();
    this.time = Date.now();
    this.url = url;
};

// 删除
window.qbian.Delete = function(id) {
    this.type = 'delete';
    this.id = id;
};