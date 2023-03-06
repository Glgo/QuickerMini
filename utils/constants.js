// socket面板 保存的数据key
export const ipKey = 'ip'
export const portKey = 'port'
export const codeKey = 'code'
//推送key
export const pushEmailKey = 'pushEmail'
export const pushCodeKey = 'pushCode'
//websocket key
export const webSocketIpKey = 'websocketIp'
export const webSocketPortKey = 'websocketPort'
export const webSocketCodeKey = 'websocketCode'
//pages
// {
//   "id": 1,
//   "name": "",
//   "icon": ""
// }
export const pagesKey = 'pages'
//buttons
// {
//   "name": "",
//   "icon": "",
//   "operation": "",
//   "action": "",
//   "data": "",
//   "type": 0
// }
export const buttonKey = 'buttons'

export const pushUrl = "https://push.getquicker.cn/to/quicker"

export const loginMessageType = 200
export const loginSuccessMessageType = 201
export const updateButtonMessageType = 1
export const commonCommandType = 110
export const buttonClickedCommandType = 101
export const volumeType = 2
export const updateVolumeType = 103
export const toggleMuteType = 102

export const RESEND_STATE = "RESEND_STATE"; // 客户端请求pc重新发送状态（按钮、音量等）
export const OPEN_MAINWIN = "OPEN_MAINWIN"; //显示主面板
export const LOCK_PANEL = "LOCK_PANEL"; //锁定/解锁面板
export const CHANGE_PAGE = "CHANGE_PAGE"; //面板翻页;

export const DATA_PAGE_GLOBAL_LEFT = "DATA_GLOBAL_LEFT"; //全局面板向左翻页;
export const DATA_PAGE_GLOBAL_RIGHT = "DATA_GLOBAL_RIGHT"; //全局面板向右翻页;
export const DATA_PAGE_CONTEXT_LEFT = "DATA_CONTEXT_LEFT"; //上下文面板向左翻页;
export const DATA_PAGE_CONTEXT_RIGHT = "DATA_CONTEXT_RIGHT"; //上下文面板向右翻页;

export const guideText = `1. 手机和电脑需要连接同一个WIFI
2. 确保在PC端的Quicker打开APP连接功能
3. 打开Quicker面板，点击右上角头像再点击连接手机APP
4. 出现二维码后点击上面的扫码按钮
5. 禁止与以下端口号连接：1024以下 1099 1433 1521 1719 1720 1723 2049 2375 3128 3306 3389 3659 4045 5060 5061 5432 5984 6379 6000 6566 7001 7002 8000-8100 8443 8888 9200 9300 10051 10080 11211 27017 27018 27019`

export const operation = {
  copy: 'copy将内容复制到剪贴板',
  paste: 'paste将内容粘贴到当前窗口',
  action: 'action运行动作',
  open: 'open打开网址',
  sendkeys: 'sendkeys模拟输入内容',
  inputtext: 'inputtext模拟输入文本（原样输入）',
  inputscript: 'inputscript多步骤输入',
}
export const inputType = {
  noparam: '无参数',
  paste: '手机剪贴板',
  write: '手写输入',
  fixed: '固定参数'
}