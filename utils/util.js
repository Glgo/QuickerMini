export const showErrorToast = function (msg) {
  wx.showToast({
    title: msg,
    icon: "error"
  })
}
export const showToast = function (msg) {
  wx.showToast({
    title: msg,
    icon: "none"
  })
}
export const showSuccessToast = function (msg) {
  wx.showToast({
    title: msg,
    icon: 'success'
  })
}
export const isWifiConnected = (connect, disConnect = () => showErrorToast('请连接WiFi')) => {
  wx.getNetworkType({
    success(res) {
      if ('wifi' == res.networkType) {
        connect();
      } else {
        disConnect();
      }
    },
    fail() {
      disConnect();
    }
  })
}