const constant = require("../../utils/constants")
const util = require("../../utils/util")
Page({
  data: {
    pushHidden: true,
    socketHidden: true,
    email: "",
    pushCode: "",
    ip: "",
    port: "",
    socketCode: ""
  },
  onLoad: function (params) {
    const that = this;
    this.setStorage(constant.pushEmailKey, 'email')
    this.setStorage(constant.pushCodeKey, 'pushCode', true)
    this.setStorage(constant.webSocketIpKey, 'ip', false, function () {
      that.setStorage(constant.ipKey, 'ip')
    })
    this.setStorage(constant.webSocketPortKey, 'port')
    this.setStorage(constant.webSocketCodeKey, 'socketCode')
  },
  bindInput() {},
  setStorage(key, data, encrypt = false, fail = null) {
    const that = this;
    wx.getStorage({
      key: key,
      encrypt: encrypt,
      success(res) {
        that.setData(function (params) {
          const dataObj = {}
          dataObj[data] = params.data
          return dataObj
        }(res))
      },
      fail(res) {
        if (fail) {
          fail()
        }
      }
    })
  },
  setPush(event) {
    this.setData({
      pushHidden: false
    })
  },
  setSocket(event) {
    this.setData({
      socketHidden: false
    })
  },
  savePush(event) {
    // if (!this.data.email) {
    //   util.showErrorToast("请设置邮箱");
    //   return;
    // }
    // if (!this.data.pushCode) {
    //   util.showErrorToast("请设置验证码")
    //   return;
    // }
    wx.setStorage({
      key: constant.pushEmailKey,
      data: this.data.email
    })
    wx.setStorage({
      key: constant.pushCodeKey,
      data: this.data.pushCode,
      encrypt: true
    })

    this.setData({
      pushHidden: true
    })
  },
  saveSocket(event) {
    // if (!this.data.ip) {
    //   util.showErrorToast("请设置IP");
    //   return;
    // }
    // if (!this.data.port) {
    //   util.showErrorToast("请设置端口号")
    //   return;
    // }
    wx.setStorage({
      key: constant.webSocketIpKey,
      data: this.data.ip
    })
    wx.setStorage({
      key: constant.webSocketPortKey,
      data: this.data.port,
    })
    wx.setStorage({
      key: constant.webSocketCodeKey,
      data: this.data.socketCode
    })
    this.setData({
      socketHidden: true
    })
  },
  hidden(e) {
    this.setData({
      pushHidden: true,
      socketHidden: true
    })
  }
})