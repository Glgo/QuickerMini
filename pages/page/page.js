const constant = require("../../utils/constants")
const util = require("../../utils/util")
const socketUtil = require("../../utils/socket-util")
let id; //id就是button的key,存储到本地
var socketTask;
let isShow = false;
Page({
  data: {
    buttons: []
  },
  onLoad: function (options) {
    const that = this;
    socketTask = getApp.socketTask;
    if (!socketTask) {
      util.showErrorToast("初始化失败");
      wx.navigateBack();
      return
    }
    socketTask.onMessage(this.onMessage)
    wx.setNavigationBarTitle({
      title: options.name,
    });
    id = options.id;
    wx.getStorage({
      key: id,
      success(res) {
        const buttons = res.data;
        that.setData({
          buttons: buttons
        })
      }
    });
  },
  onMessage: (listener) => {
    if (!isShow) return;
    const result = listener.data;
    //   {
    //     "replyTo": 0,
    //     "isSuccess": true,
    //     "messageType": 4,
    //     "data": "",
    //     "serial": 0
    // }
    console.log(result);
    if (result) {
      try {
        const response = JSON.parse(result);
        if (response.messageType == "4" && response.isSuccess) {
          const data = response.data;
          if (data && data != 'Ok.') { //有返回值的内容
            wx.showModal({
              title: '返回成功',
              content: data,
              confirmText: '复制',
              success: (res) => {
                if (res.confirm) {
                  wx.setClipboardData({
                    data: data,
                    success:()=>{
                      util.showSuccessToast('复制成功');
                    }
                  })
                }
              }
            })
          }
        }
      } catch (error) {}
    }
  },
  onShow: () => {
    isShow = true;
  },
  onHide: () => {
    isShow = false;
  },
  onUnload: () => {
    socketTask = null;
    isShow = false;
  },
  newButton(event) {
    wx.navigateTo({
      url: '/pages/page/newbutton',
      events: {
        'button': data => {
          const buttons = this.data.buttons;
          buttons.push(data);
          this.setData({
            buttons: buttons
          });
          wx.setStorage({
            key: id,
            data: buttons
          })
        }
      }
    })
  },
  buttonTap(event) {
    const index = event.currentTarget.dataset.index;
    const button = this.data.buttons[index];
    socketUtil.convertButonToMsg(socketTask, button);
  },
  buttonLongPress(event) {
    const index = event.currentTarget.dataset.index;
    const name = event.currentTarget.dataset.name;

    wx.showModal({
      title: '确认删除',
      content: `动作:${name}`,
      success: (res) => {
        if (res.confirm) {
          const buttons = this.data.buttons;
          buttons.splice(index, 1);
          this.setData({
            buttons: buttons
          })
          wx.setStorage({
            key: id,
            data: buttons
          })
        }
      }
    })
  }
})