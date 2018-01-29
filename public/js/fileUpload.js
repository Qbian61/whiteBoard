
(function() {
    'use strict';

    var log = window.qbian.logger('fileUpload');

    //上传按钮
    document.getElementById("uploadBtn").onclick = function () {
        var mFileUpload = new window.butel.FileUpload();
        //js 获取文件对象
        var fileObj = null;

        if (getIEVersion() === 9) {
            fileObj = document.getElementById("file").value;
        } else {
            fileObj = document.getElementById("file").files[0];
        }
        if (fileObj === undefined || fileObj === null) {
            console.error('还未选择文件');
            return;
        }

        mFileUpload.on('success', function (success) {
            var result = JSON.parse(success);
            log('上传文件成功', result);

            var img = new window.qbian.Image(result.filepath);
            img.pathname = window.qbian.config.pathname;
            window.qbian.socket.emit('drawing', img);
            
            document.getElementById("file").value = '';
        });

        // mFileUpload.on('progress', function (evt, speed, bspeed, units, resttime) {
        //     if (evt.lengthComputable) {
        //         progressBar.max = evt.total;
        //         progressBar.value = evt.loaded;
        //         percentageDiv.innerHTML = Math.round(evt.loaded / evt.total * 100) + "%";
        //     }
        //     time.innerHTML = '，速度：' + speed + units + '，剩余时间：' + resttime + 's';
        //     if (bspeed === 0) {
        //         time.innerHTML = '上传已取消';
        //     }
        // });

        mFileUpload.on('error', function (error) {
            console.error(error);
        });

        mFileUpload.fileUpload(fileObj);
    };

    /**
     * 获取IE版本号
     * @returns {*}
     * @constructor
     */
    function getIEVersion() {
        var b_version = navigator.appVersion;
        var version = b_version.split(";");
        if (version.length > 1) {
            var trim_Version = parseInt(version[1].replace(/[ ]/g, "").replace(/MSIE/g, ""));
            return trim_Version;
        }
        return '^_^IE';
    }

})();