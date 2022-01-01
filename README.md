# 奕辅导 Quantumult X 脚本
>奕辅导 Quantumult X 脚本

-------------------
- [奕辅导 Quantumult X 脚本](#奕辅导-quantumult-x-脚本)
  - [**！免责声明！**](#免责声明)
  - [说明](#说明)
    - [2022-01-22更新](#2022-01-22更新)
  - [使用方法（一）软件自动抓包（推荐）](#使用方法一软件自动抓包推荐)
    - [0. 手动完成当天的打卡](#0-手动完成当天的打卡)
    - [1. Quantumult X](#1-quantumult-x)
    - [2. 配置QuantumultX](#2-配置quantumultx)
    - [3. 自动抓取数据](#3-自动抓取数据)
    - [4. 运行一次脚本以获取打卡数据](#4-运行一次脚本以获取打卡数据)
    - [5. 自动运行（可选）](#5-自动运行可选)
    - [6. 正常运行](#6-正常运行)
    - [7. 更新数据](#7-更新数据)
  - [使用方法（二）手动抓包](#使用方法二手动抓包)
  - [多账户打卡](#多账户打卡)
  - [Todo](#todo)
- [./caught/  抓包数据](./caught)
--------------------

## **！免责声明！**

- 仅供学习交流，不要用于非法、盈利、商业等用途！
- **不要瞒报疫情！**
- 产生的问题和后果，使用者自行负责，与作者无关。

## 说明

### 2022-01-22更新

- 实现从服务器自动抓取已打卡的数据，而不是打卡时通过软件自动抓包。这样理论上就可以支持所有学校的不同问卷。

- 增加了手动设置数据。方便调试，以及无rewrite和mitm也可通过其他方式自行抓包使用，也可以手动修改打卡数据。

## 使用方法（一）软件自动抓包（推荐）
### 0. 手动完成当天的打卡
正常在小程序完成打卡

### 1. Quantumult X

需要外区apple store账号购买并安装Quantumult X，（共享账号无法使用rewrite和mitm）

注意要启动mitm证书。

### 2. 配置QuantumultX

#### 添加rewrite重写规则：

（用途：点击健康打卡时，获取`accessToken`）
```
 类型: script-request-header

 url: https://yfd.ly-sky.com/ly-pd-mb/form/api/healthCheckIn/client/stu/index
```


#### 添加mitim主机名：
```
 yfd.ly-sky.com
```

#### Quantumult X配置文件参考示例
```
[rewrite_local]
#重写规则，点击健康打卡时，自动获取accessToken和User-Agent
https://yfd.ly-sky.com/ly-pd-mb/form/api/healthCheckIn/client/stu/index url script-request-header yfd_checkin.js

[mitm]
hostname = yfd.ly-sky.com

#task_local规则，每天定时自动执行脚本
[task_local]
5 0 * * * yfd_checkin.js, tag=奕辅导, enabled=true
```

### 3. 自动抓取数据

配置好rewrite和mitm，启动QuantumultX

小程序中点击健康打卡图标，脚本会获取`accessToken`和`UA`并保存。

### 4. 运行一次脚本以获取打卡数据
（无需rewrite和mitm，无需开启Quantumult X）
在`accessToken`配置正确且已完成完成手动打卡的情况下，手动执行脚本即可获取打卡所需要提交的数据。

### 5. 自动运行（可选）

- 配置QuantumultX的定时任务，即可定时运行脚本（需要保持QuantumultX后台运行）

- 通过ios的快捷指令，并设置自动化快捷指令，实现定时运行（推荐）（需将脚本下载到本地目录/Qauntumult X/scripts/）

### 6. 正常运行

- 当脚本可以正常运行后，建议关闭rewirte和mitm，避免影响正常使用。

### 7. 更新数据
- 当`accessToken`失效时，重新执行步骤[3. 自动抓取数据](#3-自动抓取数据)。
- 当问卷问题失效时，配置脚本中低42行，[yfd_checkin.js#L42](./yfd_checkin.js#L42)为true，重新执行步骤[4. 运行一次脚本以获取打卡数据](#4-运行一次脚本以获取打卡数据)。
```JavaScript
//###########	Config		####################

var clear_data = false;	//当为true时，清除已保存的打卡数据，重新获取。默认值应为false
```

## 使用方法（二）手动抓包

需要自己学习抓包。如无特殊需要不建议使用。

适合调试使用或者无rewrite和mitm，或者自定义打卡数据。

该方法相当自由，可以手动配置`accessToken`和`UA`，让脚本自动获取打卡数据。

也可以全部数据都手动配置。

有需要的人自行折腾，这里不赘述。

## 多账户打卡

本脚本的初衷是自用，不会考虑加入多账户打卡的功能。

不过笔者可以提供一个简单的思路，有需要的人自行折腾

1. 将脚本复制多份。
2. 修改每份脚本的三个全局常量，以此类推，每份脚本不重复即可。
```JavaScript
const token = "yfd_accessToken_1";
const UA = "yfd_User-Agent_1";
const data = "yfd_checkin_data_1";
```
3. 通过自动抓包或手动抓包的方式，配置每个账号的数据。

## Todo

 - [x] 实现自动抓取“已打卡”的数据，而不是手动打卡的数据
 - [ ] 生成一定范围内的随机位置数据，避免被识别
 - [ ] 适配Surge, Loon等其他软件

 [回到顶部](#readme)
