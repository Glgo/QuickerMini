// pages/page/newbutton.js
const constant = require("../../utils/constants")
const util = require("../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    operation: constant.operation,
    inputType: constant.inputType
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  operationChange(event) {
    const value = event.detail.value;
    console.log(value)
    if (value != "action") {
      this.setData({
        typeChecked: false
      })
    }
    this.setData({
      operationValue: event.detail.value
    })
  },
  inputTypeChange(event) {
    this.setData({
      inputTypeValue: event.detail.value
    })
  },
  newButton(event) {
    const operationValue = this.data.operationValue;
    if (!operationValue) {
      util.showErrorToast("请选择操作方式");
      return;
    }
    const inputTypeValue = this.data.inputTypeValue;
    if (!inputTypeValue) {
      util.showErrorToast("请选择输入方式");
      return;
    }
    let fixedData;
    if (inputTypeValue == 'fixed') {
      fixedData = this.data.fixedData;
    } else {
      fixedData = "";
    }
    if (inputTypeValue == 'fixed' && !fixedData) {
      util.showErrorToast('请输入固定参数');
      return;
    }
    if (operationValue == 'action') {
      const actionName = this.data.actionName
      const buttonName = this.data.buttonName
      if (!buttonName) {
        buttonName = actionName;
      }
      if (!actionName) {
        util.showErrorToast('请输入动作名称');
        return;
      }
      const button = {
        "name": buttonName,
        "icon": "",
        "operation": operationValue,
        "action": actionName,
        "data": fixedData,
        "type": inputTypeValue
      }
      this.sendMsgAndBack(button);
    } else {
      const buttonName = this.data.buttonName
      if (!buttonName) {
        util.showErrorToast('请输入按钮名称');
        return;
      }
      const button = {
        "name": buttonName,
        "icon": "",
        "operation": operationValue,
        "data": fixedData,
        "type": inputTypeValue
      }
      this.sendMsgAndBack(button);
    }
  },
  sendMsgAndBack(button) {
    const channel = this.getOpenerEventChannel();
    wx.navigateBack({
      success: function (res) {
        channel.emit("button", button);
      }
    });
  }
})