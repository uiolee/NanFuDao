/******************
奕辅导健康打卡QauntumultX脚本
update:20220121

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
const lx = QuanX_init();
const token = "yfd_accessToken";
const UA = "yfd_User-Agent";
const data = "yfd_checkin_data";
var id = "questionnairePublishEntityId";
var title = "title";
var hadFill = "hadFill";
var header = {};

async function getInfo() {//获取打卡的信息，id每天不一样
	let a = function() {
		let url = {
			url: "https://yfd.ly-sky.com/ly-pd-mb/form/api/healthCheckIn/client/stu/index",
			headers: header
		};
		return lx.get(url)
	};
	let response = await a();
	let res = JSON.parse(response.body);
	if (res.code === 200) {
		id = res.data.questionnairePublishEntityId;
		title = res.data.title;
		hadFill = res.data.hadFill
	};
	lx.log("getInfo(),code:" + res.code + ",message:" + res.message)
};
async function checkIn() {//打卡主体
	lx.log("checkIn()");
	dt = JSON.parse(lx.r(data));
	dt["questionnairePublishEntityId"] = id;//id
	dt = JSON.stringify(dt);
	let b = function() {
		let url = {
			url: "https://yfd.ly-sky.com/ly-pd-mb/form/api/answerSheet/saveNormal",
			headers: header,
			body: dt
		};
		return lx.post(url)
	};
	let response = await b();
	let res = JSON.parse(response.body);
	lx.log(JSON.stringify(res));
	if (res.code == 200) {
		lx.log(title + ",打卡成功,code:" + res.code + ",message:" + res.message);
		lx.msg(title, "打卡成功", res.code + ":" + res.message)
	} else {
		lx.log(title + ",打卡失败,code:" + res.code + ",message:" + res.message);
		lx.msg(title, "打卡失败", res.code + ":" + res.message)
	}
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
	lx.log("id:"+id+"\ntitle:"+title+"\nhadfill:"+hadFill);	
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
function getVal() {//获取accessToken和User-Agent，并持久化
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
/* function getSaveNormal() {//获取手动打卡的数据，并持久化
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
	let c = function () {
		let url = {
			url: "https://yfd.ly-sky.com/ly-pd-mb/form/api/questionnairePublish/" + id + "/getDetailWithAnswer",
			headers: header
		};
		url.headers["content-type"] = "application/x-www-form-urlencoded";
		url.headers["Referer"] = "https://servicewechat.com/wx217628c7eb8ec43c/29/page-frame.html";
		return lx.get(url)
	};
	let response = await c();
	let res = JSON.parse(response.body);
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
	};
};
function start() {
	const isRequest = typeof $request != "undefined";
	if (isRequest) {
		const isPost = $request.method == "POST";
		const isGet = $request.method == "GET";
		if (isGet) {
			getVal()//获取accessToken和User-Agent
		};
		if (isPost) {
			//getSaveNormal()//获取手动打卡的数据
			lx.done()
		} else {
			lx.done()
		}
	};
	main()
};
function QuanX_init() {
	const msg = function(title, subtitle, body) {
		return $notify(title, subtitle, body)
	};
	const log = function(message) {
		return console.log(message)
	};
	const get = function(url) {
		url.method = 'GET';
		return $task.fetch(url)
	};
	const post = function(url) {
		url.method = 'POST';
		return $task.fetch(url)
	};
	const done = function() {
		return $done()
	};
	const fetch = $task.fetch;
	const r = function(key) {
		return $prefs.valueForKey(key)
	};
	const w = function(val, key) {
		return $prefs.setValueForKey(val, key)
	};
	return {
		msg,
		log,
		get,
		post,
		done,
		fetch,
		r,
		w
	}
};
start();