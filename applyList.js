const lx = init('applyList.js');
const ID = 'applyRecordId';

/****************
1. 务必遵守疫情防控、法律法规、校规！
2. 至少正常请假一次，本脚本才能运行。
3. 脚本没有对服务器上的数据进行操作。
4. 仅供交流学习，请在下载后24小时内删除。一切责任由使用者自负，与作者无关。

Quantumult X 配置参考，其他软件类似
[rewrite]
脚本: applyList.js
类型: script-response-body
url: https://yfd.ly-sky.com/ly-ms/application/api/oa/applyList

[Mitm]
主机名: yfd.ly-sky.com

****************/

if (!lx.isResponse()) {
    lx.log('$response不存在，启动方式错误，应以rewrite和mitm方式启动');
    lx.done();
}

let body = lx.toObj($response.body);
let dt = body.data[0];
const timenow = new Date().setMinutes(0, 0);
if(dt.oaType>2){lx.done();}
lx.w(dt.id, ID);

//dt.id = "applyRecordId";	// 如果不理解此项用途，不要修改此项
//dt.oaType = 1;			// 1 请假，2 外出
//dt.reason = "";
dt.beginTime = timenow - 3600000;
dt.endTime = timenow + 7200000;
dt.recordStatus = 4;
//dt.leaveIntroVo = null;
//dt.now = null;

function init(name){const startTime=new Date().getTime();const isRequest=function(){return'undefined'!==typeof $request;};const isResponse=function(){return'undefined'!==typeof $response;};const isPost=function(){return'POST'===$request.method;};const isGet=function(){return'GET'===$request.method;};const isNode=function(){return'undefined'!==typeof module&&!!module.exports;};const isQuanX=function(){return'undefined'!==typeof $task;};const isSurge=function(){return'undefined'!==typeof $httpClient&&'undefined'===typeof $loon;};const isLoon=function(){return'undefined'!==typeof $loon;};const toObj=function(str,defaultValue=null){try{return JSON.parse(str);}catch{return defaultValue;}};const toStr=function(obj,defaultValue=null){try{return JSON.stringify(obj);}catch{return defaultValue;}};const msg=function(title,subtitle='',desc=''){if(isQuanX()){$notify(title,subtitle,desc);}else if(isSurge()||isLoon()){$notification.post(title,subtitle,desc);}};const log=function(...logs){if(logs.length>0){logs=[...logs];}console.log(logs.join('\n'));};const get=async function(opts,callback){if(isSurge()||isLoon()){await $httpClient.get(opts,function(err,res,body){if(!err&&res){res.body=body;res.statusCode=res.status;}callback(err,res,body);});}else if(isQuanX()){opts.method='GET';await $task.fetch(opts).then(function(res){const{statusCode:status,statusCode,headers,body}=res;callback(null,{status,statusCode,headers,body},body);},function(err){callback(err);});}};const post=async function(opts,callback=function(){}){if(isSurge()||isLoon()){await $httpClient.post(opts,function(err,res,body){if(!err&&res){res.body=body;res.statusCode=res.status;}callback(err,res,body);});}else if(isQuanX()){opts.method='POST';await $task.fetch(opts).then(function(res){const{statusCode:status,statusCode,headers,body}=res;callback(null,{status,statusCode,headers,body},body);},function(err){callback(err);});}};const r=function(key){if(isQuanX()){return $prefs.valueForKey(key);}else if(isSurge()||isLoon()){return $persistentStore.read(key);}};const w=function(val,key){if(isQuanX()){return $prefs.setValueForKey(val,key);}else if(isSurge()||isLoon()){return $persistentStore.write(val,key);}};const wait=function(time){return new Promise(function(resolve){setTimeout(resolve,time);});};const done=function(val={}){const endTime=new Date().getTime();const costTime=(endTime-startTime)/1000;log(name+' 结束运行，耗时：'+costTime);if(isQuanX()||isSurge()||isLoon()){$done(val);}};return{msg,log,get,post,done,r,w,wait,toObj,toStr,isLoon,isNode,isQuanX,isSurge,isRequest,isResponse,isPost,isGet};}

lx.done({ body: lx.toStr(body) });
