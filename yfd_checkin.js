/******************
奕辅导健康打卡QauntumultX脚本
理论上支持Surge, Loon, 未测试
update:20220209

免责声明：

本脚本仅供交流学习，

瞒报疫情属于违法犯罪！！！可按刑法判处危害公共安全罪，请勿瞒报疫情、危害社会和他人。

本脚本没有修改打卡的数据，而是根据用户手动打卡的数据进行自动打卡。

因使用此脚本而出现的问题，由使用者自行承担，用作者无关。


使用方法：
1、事先在小程序上手动完成一次打卡（无需使用脚本，无需开启Quantumult X）。
2、启用rewrite和mitm功能，并设置好规则。开启QuantumultX，打开健康打卡，脚本自动获取accessToken和UA。
3、手动运行脚本，脚本会自动获取已打卡的数据并保存。
4、配置Quantumult X的task功能或者ios的自动化快捷指令，实现每天自动打卡。
（5、脚本正常运行后，可关闭rewrite，避免使用正常小程序时，脚本反复运行。）


*******************
【Quantumult X配置】

[rewrite_local]
#重写规则，点击健康打卡时，自动获取accessToken和User-Agent
https://yfd.ly-sky.com/ly-pd-mb/form/api/healthCheckIn/client/stu/index url script-request-header yfd_checkin.js

[mitm]
hostname = yfd.ly-sky.com

#task_local规则，每天定时自动执行脚本
[task_local]
5 0 * * * yfd_checkin.js, tag=奕辅导, enabled=true

******************/

//###########	Config		####################

var clear_data = false;	//当为true时，清除已保存的打卡数据，重新获取。默认值应为false

//###########	手动设置数据并持久化，如无需要请勿改动。(方便调试,或无rewrite和mitm)
var user_token = "";	//accessToken
var user_UA = "";		//User-Agent
var user_data = "";		//完整的打卡数据body，以字符串方式传入。
//###########

//以下全局变量，不要改动。
const lx = init("奕辅导健康上报");
const token = "yfd_accessToken";
const UA = "yfd_User-Agent";
const data = "yfd_checkin_data";
var id = "questionnairePublishEntityId";
var title = "title";
var hadFill = "hadFill";
var header = {};

async function getInfo() {//获取打卡的信息，id每天不一样
	url = {
		url: "https://yfd.ly-sky.com/ly-pd-mb/form/api/healthCheckIn/client/stu/index",
		headers: header
	};
	await lx.get(url, function (err, response, body) {
		let res = JSON.parse(body);
		if (res.code === 200) {
			id = res.data.questionnairePublishEntityId;
			title = res.data.title;
			hadFill = res.data.hadFill
		};
		lx.log("getInfo(),code:" + res.code + ",message:" + res.message)
	});
};
async function checkIn() {//打卡主体
	lx.log("checkIn()");
	dt = JSON.parse(lx.r(data));
	dt["questionnairePublishEntityId"] = id;//id
	dt = JSON.stringify(dt);
	let url = {
		url: "https://yfd.ly-sky.com/ly-pd-mb/form/api/answerSheet/saveNormal",
		headers: header,
		body: dt
	};
	await lx.post(url, function (err, response, body) {
		let res = JSON.parse(body);
		//lx.log(JSON.stringify(res));
		if (res.code == 200) {
			lx.log(title + ",打卡成功,code:" + res.code + ",message:" + res.message);
			lx.msg(title, "打卡成功", res.code + ":" + res.message)
		} else {
			lx.log(title + ",打卡失败,code:" + res.code + ",message:" + res.message);
			lx.msg(title, "打卡失败", res.code + ":" + res.message)
		}
	})
};
async function main() {
	lx.log("main()");
	//lx.msg("奕辅导健康打卡QauntumultX", "", "");
	if (clear_data) {
		lx.w("", data);
		lx.log("打卡数据已清除")
	};
	if (user_token) { lx.w(user_token, token) };
	if (user_UA) { lx.w(user_UA, UA) };
	if (user_data) { lx.w(user_data, data) };
	header = {
		"Host": "yfd.ly-sky.com",
		"Connection": "keep-alive",
		"accessToken": lx.r(token),
		"userAuthType": "MS",
		"Accept-Encoding": "gzip,compress,br,deflate",
		"User-Agent": lx.r(UA),
		"content-type": "application/json",
		"Referer": "https://servicewechat.com/wx217628c7eb8ec43c/20/page-frame.html"
	}
	await getInfo();//获取打卡id和打卡状态
	lx.log("id:" + id + "\ntitle:" + title + "\nhadfill:" + hadFill);
	if (lx.r(data)) {
		lx.log("打卡数据已存在");
		if (hadFill) {
			lx.log(title + "今天已打卡");
			lx.msg(title, "", "今天已打卡")
		} else {
			await checkIn()//执行打卡
		};
	} else {
		lx.log("打卡数据不存在");
		if (hadFill) {
			lx.log("开始获取打卡数据");
			await getAnswer();
		} else {
			lx.log("今天未打卡，无法获取打卡数据。请在小程序中手动打卡");
			lx.msg("今天未打卡，无法获取打卡数据。", "", "请在小程序中手动打卡");
		}
	};
	lx.done()
};
function getToken() {//获取accessToken和User-Agent，并持久化
	if ($request.headers) {
		const t = $request.headers["accessToken"];
		lx.w(t, token);
		lx.msg("获取accessToken成功", "", t);
		lx.log("获取accessToken成功" + t);
		const ua = $request.headers["User-Agent"];
		lx.w(ua, UA);
		lx.msg("获取User-Agent成功", "", ua);
		lx.log("获取User-Agent成功" + ua);
		lx.done()
	}
};
/* function getSaveNormal() {//抓包手动打卡的数据，并持久化
	if ($request.body) {
		const dt = $request.body;
		lx.w(dt, data);
		lx.msg("获取data成功", "", dt);
		lx.log("获取data成功" + dt);
		lx.done()
	}
}; */
async function getAnswer() {	//获取已打卡的数据，并持久化
	lx.log("getAnswer()");
	let url = {
		url: "https://yfd.ly-sky.com/ly-pd-mb/form/api/questionnairePublish/" + id + "/getDetailWithAnswer",
		headers: header
	};
	url.headers["content-type"] = "application/x-www-form-urlencoded";
	url.headers["Referer"] = "https://servicewechat.com/wx217628c7eb8ec43c/29/page-frame.html";
	await lx.get(url, function (err, response, body) {
		let res = JSON.parse(body);
		if (res.code == 200) {
			res = res["data"]["answerInfoList"];
			var answerInfoList = new Array();
			for (var x in res) {
				var obj = {};
				var subjectType = res[x]["subjectType"];
				obj["subjectId"] = res[x]["subjectId"];
				obj["subjectType"] = subjectType;
				obj[subjectType] = res[x][subjectType];
				answerInfoList.push(obj);
				//lx.log(JSON.stringify(obj));
			};
			if (answerInfoList.length == 0) {
				lx.msg("获取打卡数据data失败", "获取到" + answerInfoList.length + "个问题,请手动打卡后重试。", dt);
				lx.log("获取打卡数据data失败，获取到" + answerInfoList.length + "个问题,请手动打卡后重试。" + dt);
			} else {
				var dt = {
					"questionnairePublishEntityId": id,
					"answerInfoList": answerInfoList
				};
				dt = JSON.stringify(dt);
				lx.w(dt, data);
				lx.msg("获取打卡数据data成功", "获取到" + answerInfoList.length + "个问题", dt);
				lx.log("获取打卡数据data成功，获取到" + answerInfoList.length + "个问题。" + dt);
			};
		} else {
			lx.log("获取打卡数据data失败，code:" + res.code + ",message:" + res.message);
			lx.msg("获取打卡数据data失败", res.code + ":" + res.message);
		}
	})
};
function start() {
	if (lx.isRequest()) {
		if (lx.isGet()) {
			getToken()//获取accessToken和User-Agent
		};
		if (lx.isPost()) {
			//getSaveNormal()//获取手动打卡的数据
			lx.done()
		} else {
			lx.done()
		}
	};
	main()
};

function init(name){const startTime=new Date().getTime();const isRequest=function(){return"undefined"!==typeof $request};const isResponse=function(){return"undefined"!==typeof $response};const isPost=function(){return"POST"===$request.method};const isGet=function(){return"GET"===$request.method};const isNode=function(){return'undefined'!==typeof module&&!!module.exports};const isQuanX=function(){return'undefined'!==typeof $task};const isSurge=function(){return'undefined'!==typeof $httpClient&&'undefined'===typeof $loon};const isLoon=function(){return'undefined'!==typeof $loon};const toObj=function(str,defaultValue=null){try{return JSON.parse(str)}catch{return defaultValue}};const toStr=function(obj,defaultValue=null){try{return JSON.stringify(obj)}catch{return defaultValue}};const msg=function(title,subtitle='',desc=''){if(isQuanX()){$notify(title,subtitle,desc)}else if(isSurge()||isLoon()){$notification.post(title,subtitle,desc)}};const log=function(...logs){if(logs.length>0){logs=[...logs]};console.log(logs.join("\n"))};const get=async function(opts,callback){if(isSurge()||isLoon()){await $httpClient.get(opts,function(err,res,body){if(!err&&res){res.body=body;res.statusCode=res.status};callback(err,res,body)})}else if(isQuanX()){opts.method="GET";await $task.fetch(opts).then(function(res){const{statusCode:status,statusCode,headers,body}=res;callback(null,{status,statusCode,headers,body},body)},function(err){callback(err)})}};const post=async function(opts,callback=function(){}){if(isSurge()||isLoon()){await $httpClient.post(opts,function(err,res,body){if(!err&&res){res.body=body;res.statusCode=res.status};callback(err,res,body)})}else if(isQuanX()){opts.method="POST";await $task.fetch(opts).then(function(res){const{statusCode:status,statusCode,headers,body}=res;callback(null,{status,statusCode,headers,body},body)},function(err){callback(err)})}};const r=function(key){if(isQuanX()){return $prefs.valueForKey(key)}else if(isSurge()||isLoon()){return $persistentStore.read(key)}};const w=function(val,key){if(isQuanX()){return $prefs.setValueForKey(val,key)}else if(isSurge()||isLoon()){return $persistentStore.write(val,key)}};const wait=function(time){return new Promise(function(resolve){setTimeout(resolve,time)})};const done=function(val={}){const endTime=new Date().getTime();const costTime=(endTime-startTime)/1000;log(name+" 结束运行，耗时："+costTime);if(isQuanX()||isSurge()||isLoon()){$done(val)}};return{msg,log,get,post,done,r,w,wait,toObj,toStr,isLoon,isNode,isQuanX,isSurge,isRequest,isResponse,isPost,isGet};};

start();
