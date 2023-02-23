export const ipKey = 'ip'
export const portKey = 'port'
export const codeKey = 'code'
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

export const guideText = `1.手机和电脑需要连接同一个WIFI
2.确保在PC端的Quicker打开APP连接功能
3.打开Quicker面板，点击右上角头像再点击连接手机APP
4.出现二维码后点击上面的扫码按钮
5.禁止与以下端口号连接：1024以下 1099 1433 1521 1719 1720 1723 2049 2375 3128 3306 3389 3659 4045 5060 5061 5432 5984 6379 6000 6566 7001 7002 8000-8100 8443 8888 9200 9300 10051 10080 11211 27017 27018 27019`