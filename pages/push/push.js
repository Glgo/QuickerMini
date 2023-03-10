const constant = require('../../utils/constants')
const util = require('../../utils/util')

var socketTask = null;
let reConnect = true; //断开自动连接
let pageMaxId;
let ip;
let port;
let code;
Page({
  data: {
    connectState: "未连接",
    connectSocketButtonText: "连接WebSocket",
    textActive: null, //值为active，下同
    stateActive: null,
    ip: "",
    port: "",
    socketCode: "",
    pages: [],
    pushData: {
      "code": "",
      "toUser": "",
      "toDevice": "",
      /*
      operation（可选）：操作类型，默认为 copy 。可选值：
      copy  将内容复制到剪贴板
      paste  将内容粘贴到当前窗口
      action 运行动作。此时通过“action”参数传入动作名称或ID，通过“data”参数传入动作参数（可选）。
      open 打开网址。此时通过data参数传入要打开的网址。
      input sendkeys 模拟输入内容。此时通过data传入“模拟按键B”语法格式的内容。(1.27.3+版本请使用sendkeys)
      inputtext 模拟输入文本（原样输入）。
      inputscript 多步骤输入。组合多个键盘和鼠标输入步骤，参考文档。 （1.28.16+）
      downloadfile 下载文件。下载data参数中给定的文件网址（单个）。 （1.28.16+）
      */
      "operation": "",
      "data": "",
      "action": "", //动作名或ID
      "wait": false,
      "maxWaitMs": 5000,
      "messageType": 2,
      "txt": false
    }
  },
  onLoad(opt) {
    const that = this;
    wx.getStorage({
      key: constant.pagesKey,
      success(res) {
        const pages = res.data;
        if (pages) {
          pageMaxId = pages[0].id
          that.setData({
            pages: pages
          })
        }
      },
      fail(res) { //不存在
        console.log(pageMaxId)
      }
    })
  },
  onShow: function () {
    let that = this;
    wx.getStorage({
      key: constant.pushEmailKey,
      success(res) {
        that.data.pushData.toUser = res.data;
      }
    });
    wx.getStorage({
      key: constant.pushCodeKey,
      encrypt: true,
      success(res) {
        that.data.pushData.code = res.data;
      }
    });
  },
  copy(event) {
    this.commonPush("copy");
  },
  paste(event) {
    this.commonPush("paste");
  },
  open(event) {
    this.commonPush('open');
  },
  commonPush(operation) {
    if (this.checkConnetedSocket()) {
      const that = this;
      wx.getClipboardData({
        success(res) {
          if (res.data) {
            that.data.pushData.operation = operation;
            that.data.pushData.data = res.data;
            that.sendMessage(that.data.pushData)
          } else {
            util.showToast("获取剪贴 板失败");
          }
        }
      })
    } else {
      util.showErrorToast('未连接');
    }
  },
  connectSocket(event) { //连接WebSocket
    const that = this;
    util.isWifiConnected(() => that.doConnect(event))
  },
  doConnect(event) {
    if (socketTask && this.data.stateActive) {
      socketTask.close();
      reConnect = false;
      return;
    }
    const that = this;
    let uri;
    try {
      ip = wx.getStorageSync(constant.webSocketIpKey);
      if (ip) {
        port = wx.getStorageSync(constant.webSocketPortKey);
        code = wx.getStorageSync(constant.webSocketCodeKey);

        // const ipstr = ip.replaceAll('.', '-'); // 将ip地址中的.替换为-
        // uri = `wss://${ipstr}.lan.quicker.cc:${port}/ws`;
        uri = `ws://${ip}:${port}/ws`
        socketTask = wx.connectSocket({
          url: uri,
          fail: res => {
            util.showErrorToast(res.errMsg);
          }
        });
        socketTask.onOpen((listener) => {
          if (code) { //设置了验证码
            socketTask.send({
              data: JSON.stringify({
                messageType: 5, // 消息类型为5
                data: code, // data中放置验证密码
                serial: 0 //请求编号（不强制编号，可以直接写0）。
              })
            })
          }
        });
        socketTask.onMessage(res => {
          this.onMessage(res);
          if (getApp.onMessage) getApp.onMessage(res)
        });
        socketTask.onError((res) => {
          1
          that.disconnectSocket();
          socketTask = null;
          getApp.socketTask = null;
          util.showErrorToast(res.msg)
        });
        socketTask.onClose((code, reason) => {
          that.disconnectSocket();
          socketTask = null;
          getApp.socketTask = null;
          if (reConnect) {
            setTimeout(() => {
              this.connectSocket()
            }, 1000);
          }
          reConnect = true;
        })
      } else {
        util.showErrorToast("请配置WebSocke")
      }
    } catch (e) {
      util.showToast("请检查网络或配置WebSocket")
      console.log('connect to websocket failed.', e);
    }
  },
  disconnectSocket() {
    this.setData({
      connectState: "未连接",
      connectSocketButtonText: "连接WebSocket",
      textActive: null, //值为active，下同
      stateActive: null,
    })
  },
  onMessage: function (listener) {
    const data = listener.data
    console.log(data);
    const dataObj = JSON.parse(data);
    if (dataObj.messageType == 6 && dataObj.isSuccess) { //验证成功
      this.setData({
        connectState: "已连接",
        connectSocketButtonText: "断开WebSocket",
        textActive: "active",
        stateActive: "active",
        ip: ip,
        port: port,
        socketCode: code
      });
      getApp.socketTask = socketTask;
    }
  },
  sendMessage(data) {
    if (this.checkConnetedSocket()) {
      socketTask.send({
        data: JSON.stringify(data)
      });
    } else {
      util.showToast("未连接")
      return
    }
  },
  addPage(event) { //添加页面
    wx.showModal({
      title: '添加页面',
      placeholderText: '页面名称(最多10个字符)',
      editable: true,
      success: (res) => {
        if (res.confirm) {
          let content = res.content;
          if (!content) {
            util.showErrorToast('名称不能为空');
            return
          }
          if (content.length > 10) {
            util.showErrorToast('最多输10个字符');
            return
          }
          if (!pageMaxId) { //page从1开始编号
            pageMaxId = 0
          }
          const temPages = this.data.pages;
          temPages.push({
            id: ++pageMaxId,
            name: content,
            icon: ""
          });
          this.setData({
            pages: temPages
          })
          wx.setStorage({
            key: constant.pagesKey,
            data: temPages
          })
        }
      }
    })
  },
  removePage(event) {
    wx.showModal({
      title: '确认删除页面吗',
      success: (res) => {
        if (res.confirm) {
          const index = event.currentTarget.dataset.index;
          const tampPages = this.data.pages;
          const deletedPages = tampPages.splice(index, 1);
          this.setData({
            pages: tampPages
          })
          wx.setStorage({ //更新本地页面
            key: constant.pagesKey,
            data: tampPages
          })
          wx.removeStorage({
            key: deletedPages[0].id.toString()
          })
        }
      }
    })
  },
  checkConnetedSocket() {
    if (socketTask && this.data.stateActive) {
      return true;
    } else {
      return false;
    }
  },
  pageDetail(event) {
    if (this.checkConnetedSocket()) {
      const id = event.currentTarget.dataset.id;
      const name = event.currentTarget.dataset.name;
      wx.navigateTo({
        url: `/pages/page/page?id=${id}&name=${name}`,
      })
    } else {
      util.showErrorToast('未连接');
    }
  }
})