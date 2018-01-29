var ConstConfig = function () {
};

//现网文件上传服务器
// ConstConfig.CDN_HOST2 = 'ztv.butel.com';
ConstConfig.CDN_HOST2 = 'http://tv.butel.com';

//现网文件上传appid
// ConstConfig.CDN_APPID2 = '75ea6c88a270467c';
ConstConfig.CDN_APPID2 = 'd6187536bc93435b';


ConstConfig.POST_URL2 = ConstConfig.CDN_HOST2+'/webapi/account/authorize';
ConstConfig.GET_URL2 = ConstConfig.CDN_HOST2+'/webapi/config/getfileconfig?';
// http://{fileuploadurl}/filesliceupload?method=create&filename={filename}&token={token}
ConstConfig.breakPointUrl1='http://222.73.29.13:1210/filesliceupload?method=create';



