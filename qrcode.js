// https://yfd.ly-sky.com/ly-ms/application/api/st/mine/inAndOutQrCode/baseInfo
const lx = init('qrcode.js');
const ID = 'applyRecordId';
const id = lx.r(ID);// 注意此处是要配合applyList.js使用。先打开applylist再打开qrcode才能获取到最新的applyRecordId

if (!lx.isResponse()) {
    lx.log('$response不存在，启动方式错误，应以rewrite和mitm方式启动');
    lx.done();
}

let body = lx.toObj($response.body);
const timenow = new Date().setMilliseconds(0);
const time = new Date().setMinutes(0, 0, 0);

var dt = body.data;
if (!dt.qrCodeOARecord) {
    dt.qrCodeOARecord={};
}

dt.now = timenow;
dt.qrCodeColor = 'red';
dt.qrCodeOARecord.applyId = ''; // 不显示
dt.qrCodeOARecord.oaType = '外出';
dt.qrCodeOARecord.beginTime = time - 3600000;
dt.qrCodeOARecord.endTime = time + 7200000;
dt.qrCodeOARecord.applyStatus = 4;
var applyId = id;
dt.qrCodeUrl = 'https://yfd.ly-sky.com/ly-ms/application/open/qrCode/1?t=ms_48&y=' + applyId;

// dt.qrCodeUserInfo.userName = "";
// dt.qrCodeUserInfo.avatar = "";// 不显示
// dt.qrCodeUserInfo.sex = "";// 不显示
// dt.qrCodeUserInfo.college = "";
// dt.qrCodeUserInfo.classes = "";
// dt.qrCodeUserInfo.classesManager = "";
// dt.qrCodeUserInfo.classesManagerPhone = "";

function init(name){const startTime=new Date().getTime();const isRequest=function(){return'undefined'!==typeof $request;};const isResponse=function(){return'undefined'!==typeof $response;};const isPost=function(){return'POST'===$request.method;};const isGet=function(){return'GET'===$request.method;};const isNode=function(){return'undefined'!==typeof module&&!!module.exports;};const isQuanX=function(){return'undefined'!==typeof $task;};const isSurge=function(){return'undefined'!==typeof $httpClient&&'undefined'===typeof $loon;};const isLoon=function(){return'undefined'!==typeof $loon;};const toObj=function(str,defaultValue=null){try{return JSON.parse(str);}catch{return defaultValue;}};const toStr=function(obj,defaultValue=null){try{return JSON.stringify(obj);}catch{return defaultValue;}};const msg=function(title,subtitle='',desc=''){if(isQuanX()){$notify(title,subtitle,desc);}else if(isSurge()||isLoon()){$notification.post(title,subtitle,desc);}};const log=function(...logs){if(logs.length>0){logs=[...logs];}console.log(logs.join('\n'));};const get=async function(opts,callback){if(isSurge()||isLoon()){await $httpClient.get(opts,function(err,res,body){if(!err&&res){res.body=body;res.statusCode=res.status;}callback(err,res,body);});}else if(isQuanX()){opts.method='GET';await $task.fetch(opts).then(function(res){const{statusCode:status,statusCode,headers,body}=res;callback(null,{status,statusCode,headers,body},body);},function(err){callback(err);});}};const post=async function(opts,callback=function(){}){if(isSurge()||isLoon()){await $httpClient.post(opts,function(err,res,body){if(!err&&res){res.body=body;res.statusCode=res.status;}callback(err,res,body);});}else if(isQuanX()){opts.method='POST';await $task.fetch(opts).then(function(res){const{statusCode:status,statusCode,headers,body}=res;callback(null,{status,statusCode,headers,body},body);},function(err){callback(err);});}};const r=function(key){if(isQuanX()){return $prefs.valueForKey(key);}else if(isSurge()||isLoon()){return $persistentStore.read(key);}};const w=function(val,key){if(isQuanX()){return $prefs.setValueForKey(val,key);}else if(isSurge()||isLoon()){return $persistentStore.write(val,key);}};const wait=function(time){return new Promise(function(resolve){setTimeout(resolve,time);});};const done=function(val={}){const endTime=new Date().getTime();const costTime=(endTime-startTime)/1000;log(name+' 结束运行，耗时：'+costTime);if(isQuanX()||isSurge()||isLoon()){$done(val);}};return{msg,log,get,post,done,r,w,wait,toObj,toStr,isLoon,isNode,isQuanX,isSurge,isRequest,isResponse,isPost,isGet};}

lx.done({ body: lx.toStr(body) });
