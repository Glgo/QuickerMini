// pages/scan/index.js
const constant = require('../../utils/constants')
const util = require('../../utils/util')
Page({
  data: {
    guideText: constant.guideText
  },
  onShow: function (option) {
    const ip = wx.getStorageSync(constant.ipKey);
    if (!ip) return
    const port = wx.getStorageSync(constant.portKey);
    const code = wx.getStorageSync(constant.codeKey);
    if (ip && port && code) {
      this.setData({
        showHistory: true,
        ip: ip,
        port: port,
        code: code
      })
    }
  },
  scan: function (event) {
    util.isWifiConnected(function () {
      wx.scanCode({
        onlyFromCamera: true,
        scanType: ["qrCode"],
        success: function (res) {
          if (res.result.startsWith("PB:")) {
            const split = res.result.split("\n");
            if (split.length >= 4) {
              const ip = split[1]
              const port = split[2]
              const code = split[3]
              wx.navigateTo({
                url: `../index/index?ip=${ip}&port=${port}&code=${code}`,
              })
            }
          } else {
            wx.showToast({
              title: '二维码格式错误',
              icon: "error"
            })
          }
        }
      })
    })
  },
  goHistory: function (event) {
    const that = this;
    util.isWifiConnected(function () {
      wx.navigateTo({
        url: `../index/index?ip=${that.data.ip}&port=${that.data.port}&code=${that.data.code}`
      })
    })
  },
  onShareAppMessage: function () {
    return {
      title: 'Quicker',
      path: '/pages/scan/index',
      imageUrl: '/assets/share_image.png'
    }
  }
})