window.qbian = window.qbian || {};

window.qbian.ImageCache = (function(qbian) {
    'use strict';

    var localCache = [], imgBox,
        imgNode = '<div class="image-item-box">'+
                    '<span class="image-item-delete" data-url={{url}} title="删除图片"></span>'+
                    '<image src={{url}} title="设置为背景" alt="图片" class="image-item" />'+
                '</div>';

    function ImageCache(pathname, imgBx) {
        this.key = pathname || 'undefined';
        var cache = localStorage.getItem(this.key);
        localCache = cache && cache != '[]' ? JSON.parse(cache) : [new qbian.Image(qbian.config.whiteBgImgUrl)];
        imgBox = imgBx;

        reShow();
    }

    ImageCache.prototype = {
        getImages: function() {
            return localCache;
        },
        addImage: function(image) {
            for(var i = 0, len = localCache.length; i < len; ++ i) {
                if(image.url === localCache[i].url) {
                    return;
                }
            }
            imgBox.innerHTML += imgNode.replace(/\{\{url\}\}/g, image.url);
            localCache.push(image);
            localStorage.setItem(this.key, JSON.stringify(localCache));
            window.qbian.bus.emit('updateImages');
        },
        removeImage: function(deleteImage) {
            for(var i = 0, len = localCache.length; i < len; ++ i) {
                if(deleteImage.url === localCache[i].url) {
                    localCache.splice(i, 1);
                    localStorage.setItem(this.key, JSON.stringify(localCache));
                    reShow();
                    window.qbian.bus.emit('updateImages');
                    break;
                }
            }
        }
    };

    // ==========================================================================
    // ==========================================================================
    // ==========================================================================

    function reShow() {
        var html = '';
        imgBox.innerHTML = '';
        for(var i = 0, len = localCache.length; i < len; ++ i) {
            html += imgNode.replace(/\{\{url\}\}/g, localCache[i].url);
        }
        imgBox.innerHTML += html;
    }


    return ImageCache;
})(window.qbian);
