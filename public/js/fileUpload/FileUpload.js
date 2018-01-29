;(function () {
    /**
     * Created by ZhangPeng on 2017/7/27.
     *XMLHttpRequest上传文件封装
     * @param fileObj 文件对象
     * @param url    服务器地址
     * @param success  成功的回调
     * @param error   失败的回调
     * @param progress 进度的回调
     * @param cancel  取消的回调
     */
    window.butel = {};
    window.butel.token = '';
    window.butel.fileUploadUrl = '';
    window.butel.FileUpload = function () {
        EventEmitter.call(this);
    };
    util.inherits(window.butel.FileUpload, EventEmitter);
    window.butel.FileUpload.prototype.fileUpload = function (fileObj, index) {
        var thiz = this;
        if (window.butel.token !== '' && window.butel.token !== null && window.butel.token !== undefined && window.butel.fileUploadUrl !== '' && window.butel.fileUploadUrl !== null && window.butel.fileUploadUrl !== undefined) {
            upload(window.butel.fileUploadUrl);
        }
        if (window.butel.token === '' || window.butel.token === null || window.butel.token === undefined) {
            getToken();
        }

        //1.获取token
        function getToken() {
            var tXhr = createXmlHttpRequest222();
            if (tXhr == null) {
                console.info(tXhr);
            }
            tXhr.open('post', ConstConfig.POST_URL2, true);
            tXhr.onload = function (evt) {
                var response = evt.target.responseText;
                var reObj = JSON.parse(response);
                if (reObj && reObj.state && reObj.state.rc === 0) {
                    window.butel.token = reObj.result.token;
                    console.info('token', window.butel.token);
                    getUploadUrl(window.butel.token);
                    // window.butel.fileUploadUrl = 'http://222.73.29.13:1210/fileupload';
                    // console.info('fileUpload', window.butel.fileUploadUrl);
                    // upload(window.butel.fileUploadUrl);
                } else {
                    throw new Error('服务器返回token异常');
                }

            };
            tXhr.onerror = function (evt) {
                throw new Error('获取token error', evt);
            };
            var postData = {
                "appid": ConstConfig.CDN_APPID2
            };
            tXhr.send(JSON.stringify(postData));
        }


        // 2.获取上传文件的服务器地址
        function getUploadUrl(token) {
            var gXhr = createXmlHttpRequest222();
            gXhr.open('get', ConstConfig.GET_URL2 + "token=" + window.butel.token, true);
            gXhr.onload = function (evt) {
                var response = evt.target.responseText;
                var reObj = JSON.parse(response);
                window.butel.fileUploadUrl = 'http://' + reObj.result.fileuploadurl + '/fileupload';
                console.info('fileUpload', window.butel.fileUploadUrl);
                upload(window.butel.fileUploadUrl);
            };
            gXhr.onerror = function (evt) {
                throw new Error('获取上传地址 error', evt);
            };
            var postData = {
                "token": window.butel.token
            };
            gXhr.send(JSON.stringify(postData));
        }

        //3.上传
        function upload(url) {
            //定义变量
            var xhr = null;
            var ot;
            var oloaded;


            //1,创建FormData对象,并将文件对象push到表单
            var form = new FormData();
            form.append('mf', fileObj);

            //2.创建XmlHttpRequest对象
            xhr = createXmlHttpRequest222();

            //3,post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
            xhr.open('post', url, true);

            // cancelFn(xhr);

            //4,请求状态

            //  请求成功
            xhr.onload = function (evt) {
                thiz.emit('success', evt.target.responseText, index);
                // successFn(evt.target.responseText);
            };
            //  请求失败
            xhr.onerror = function (evt) {
                thiz.emit('error', evt);
                // errorFn(evt);
            };
            //  上传的进度
            xhr.upload.onprogress = function (evt) {
                //获取当前时间
                var nt = new Date().getTime();
                //计算出上次调用该方法时到现在的时间差，单位为s
                var pertime = (nt - ot) / 1000;
                //重新赋值时间，用于下次计算
                ot = new Date().getTime();
                //计算该分段上传的文件大小，单位b
                var perload = evt.loaded - oloaded;
                //重新赋值已上传文件大小，用以下次计算
                oloaded = evt.loaded;
                //上传速度计算 单位b/s
                var speed = perload / pertime;
                var bspeed = speed;
                var units = 'b/s';//单位名称
                if (speed / 1024 > 1) {
                    speed = speed / 1024;
                    units = 'k/s';
                }
                if (speed / 1024 > 1) {
                    speed = speed / 1024;
                    units = 'M/s';
                }
                speed = speed.toFixed(1);
                //剩余时间
                var resttime = ((evt.total - evt.loaded) / bspeed).toFixed(1);
                // progressFn(evt, speed, bspeed, units, resttime);
                thiz.emit('progress', evt, speed, bspeed, units, resttime);
            };
            //5,上传开始执行方法
            xhr.upload.onloadstart = function () {
                //设置上传开始时间
                ot = new Date().getTime();
                //设置上传开始时，以上传的文件大小为0
                oloaded = 0;
            };

            window.butel.FileUpload.prototype.cancel = function () {
                if (xhr && xhr.abort) {
                    xhr.abort();
                } else {
                    throw new Error("xhr 还未被初始化!");
                }
            };
            // xhr.setRequestHeader("Content-Type", "image/jpeg");
            // thiz.emit('cancel', xhr);
            //6,开始上传，发送form数据
            xhr.send(form);
        }
    };

    /**
     * 创建xmlhttpRequest对象
     * @returns {*}
     */
    function createXmlHttpRequest222() {
        var xmlhttp;
        if (window.XMLHttpRequest) {
            //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
            xmlhttp = new XMLHttpRequest();
            console.info('not IE', xmlhttp);
        } else {
            // IE6, IE5 浏览器执行代码
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            console.info('IE', xmlhttp);
        }
        return xmlhttp;
    }

    // console.info(window.butel);
})();
