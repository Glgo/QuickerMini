const pushUrl = "https://push.getquicker.cn/to/quicker";
const emailKey = "email";
const codeKey = "code";
const buttonsKey = "buttons";
Page({
  data: {
    inputAction: "",
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
      "txt": false
    },
    buttons: []
  },
  onLoad: function (query) {
    let that = this;
    wx.getStorage({
      key: emailKey,
      success(res) {
        that.data.pushData.toUser = res.data;
      }
    });
    wx.getStorage({
      key: codeKey,
      encrypt: true,
      success(res) {
        that.data.pushData.code = res.data;
      }
    });
    wx.getStorage({
      key: buttonsKey,
      success(res) {
        that.setData({
          buttons: res.data
        })
      }
    });
  },
  setEmail: function (event) {
    let that = this;
    wx.showModal({
      title: '请输入邮箱',
      editable: true,
      content: this.data.pushData.toUser,
      success: (res) => {
        if (res.confirm) {
          that.data.pushData.toUser = res.content
          wx.setStorage({
            key: emailKey,
            data: res.content
          });
        }
      }
    })
  },
  setCode: function (event) {
    let that = this;
    wx.showModal({
      title: '请输入验证码',
      editable: true,
      content: this.data.pushData.code,
      success: (res) => {
        if (res.confirm) {
          that.data.pushData.code = res.content
          wx.setStorage({
            key: codeKey,
            encrypt: true,
            data: res.content
          });
        }
      }
    })
  },
  addAction: function (event) {
    const actionName = this.data.inputAction
    if (actionName.length > 0) {
      let index = this.data.buttons.indexOf(actionName);
      if (index != -1) {
        this.data.buttons.splice(index, 1)
      }
      this.data.buttons.unshift(actionName)
      this.setData({
        buttons: this.data.buttons
      });
      wx.setStorage({
        key: buttonsKey,
        data: this.data.buttons
      })
    } else {
      wx.showToast({
        title: '请输入动作名称',
      })
    }
  },
  pushTap: function (event) {
    let toUser = this.data.pushData.toUser;
    if (!toUser) {
      wx.showToast({
        title: '请输入邮箱',
        icon: 'error'
      })
      return;
    }
    this.data.pushData.toUser = toUser;
    let code = this.data.pushData.code;
    if (!code) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'error'
      })
      return;
    }
    this.data.pushData.code = code;
    let actionName = event.currentTarget.dataset.action;
    this.data.pushData.operation = "action";
    this.data.pushData.action = actionName;
    push(this.data.pushData);
  },
  longTap: function (event) {
    wx.vibrateShort({type:"medium"})
    let that = this;
    let actionName = event.currentTarget.dataset.action;
    wx.showModal({
      title: '确认删除此动作',
      content: actionName,
      complete: (res) => {
        if (res.confirm) {
          let buttons = that.data.buttons;
          let index = buttons.indexOf(actionName);
          buttons.splice(index, 1);
          that.setData({
            buttons: buttons
          })
        }
      }
    })
  }
})

let push = function (data) {
  wx.request({
    url: pushUrl,
    data: data,
    method: "POST",
    success: function (res) {
      console.log("code:" + res.statusCode + "\n" + "data:" + JSON.stringify(res.data));
      if (!res.data.isSuccess) {
        let errorMessage = res.data.errorMessage;
        if (errorMessage) {
          wx.showToast({
            title: errorMessage,
            icon: "error"
          })
        }
      }
    }
  })
}