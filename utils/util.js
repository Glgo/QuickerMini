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
    icon:'success'
  })
}