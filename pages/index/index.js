const encoding = require('text-encoding');
const constant = require('../../utils/constants')
const command = require('../../utils/command')
var tcpSocket = null
var isSocketConnected = false;
var msgType = "";
//第一页数据
var currentPageData = "";
Page({
  data: {
    volumeImage: '/assets/volumeCross.png',
    globleButton: {},
    contextButton: {}
    // text: "",//测试数据
    // profileName: tampJson.ProfileName,
    // globalPageCount: tampJson.GlobalPageCount,
    // globalPageIndex: tampJson.GlobalPageIndex,
    // contextPageCount: tampJson.ContextPageCount,
    // contextPageIndex: tampJson.ContextPageIndex,
  },
  onShow: () => {
    if (isSocketConnected && tcpSocket) {
      sendMessage(command.command(constant.RESEND_STATE))
    }
  },
  onShareAppMessage: function () {
    return {
      title: 'Quicker',
      path: '/pages/scan/index',
      imageUrl: '/assets/share_image.png'
    }
  },
  onLoad: function (options) {
    // this.updateButtons();
    const ip = options.ip;
    const port = options.port;
    const code = options.code;
    if (ip && port && code) {
      this.setData({
        ip: ip,
        port: port,
        code: {
          ConnectionCode: code,
          Version: "1.0",
          DeviceName: "miniprogram",
          messageType: constant.loginMessageType
        }
      })
      this.connect();
    }

  },
  onUnload: function () {
    tcpSocket.close();
    tcpSocket = null;
    isSocketConnected = false;
  },
  connect: function (event) {
    let that = this;
    this.setData({
      text: "开始连接"
    })
    tcpSocket = wx.createTCPSocket();
    tcpSocket.connect({
      address: this.data.ip,
      port: this.data.port
    });

    // 监听连接成功事件
    tcpSocket.onConnect(() => {
      isSocketConnected = true;
      // 发送数据给服务器
      sendMessage(that.data.code);
    })

    // 监听接收到数据事件
    tcpSocket.onMessage(function (result) {
      let decoder = new encoding.TextDecoder('utf8');
      //获取arraybuffer
      const buffer = result.message;
      if (buffer.byteLength < 12) {
        return;
      }
      const header = new DataView(buffer, 0, 4).getInt32();
      const tail = new DataView(buffer, buffer.byteLength - 4, 4).getInt32();
      if (header == -0x1) { //第一次加载
        msgType = new DataView(buffer, 4, 4).getInt32();
        let chartTotalLength = new DataView(buffer, 8, 4).getInt32();
        // if (chartTotalLength + 16 <= buffer.byteLength) {
        if (tail == 0) { //一页加载全部
          const msgView = new DataView(buffer, 12, chartTotalLength);
          const msg = decoder.decode(msgView);
          that.parseData(msgType, msg)
        } else {
          //还有N页
          const msgView = new DataView(buffer, 12);
          currentPageData = decoder.decode(msgView);
        }
      } else { //加载第二页数据，并拼接数据
        if (tail != 0) {
          //还不是最后一页
          const msgView = new DataView(buffer);
          currentPageData = currentPageData + decoder.decode(msgView)
        } else { //最后一页
          const msgView = new DataView(buffer, 0, buffer.byteLength - 4);
          const msg = currentPageData + decoder.decode(msgView);
          that.parseData(msgType, msg)
          currentPageData = "";
        }
      }
    })

    // 监听发生错误事件
    tcpSocket.onError((res) => {
      isSocketConnected = false;
      // 打印错误信息
      console.log("onError", res)
      wx.showToast({
        title: '连接错误请重试',
        icon: 'error'
      })
      this.backToScan();
    })
    // 监听连接关闭事件
    tcpSocket.onClose(() => {
      isSocketConnected = false;
      this.backToScan();
    })
  },
  disconnect: function () {
    if (isSocketConnected && tcpSocket) {
      tcpSocket.close();
    }
  },
  //转化解析过的json数据
  parseData: function (type, data) {
    try {
      const message = JSON.parse(data);
      console.log(message)
      const messageType = message.MessageType;
      switch (messageType) {
        case constant.updateButtonMessageType: //更新按钮
          this.updateButtons(message.Buttons, message)
          break;
        case constant.loginSuccessMessageType: //登录相关
          if (message.IsLoggedIn) { //登录成功
            sendMessage(command.command(constant.RESEND_STATE))
            wx.setStorage({
              key: constant.ipKey,
              data: this.data.ip
            });
            wx.setStorage({
              key: constant.portKey,
              data: this.data.port
            });
            wx.setStorage({
              key: constant.codeKey,
              data: this.data.code.ConnectionCode
            });
          } else {
            const errorMessage = message.ErrorMessage;
            if (errorMessage) {
              wx.showToast({
                title: errorMessage,
                icon: 'error'
              })
            }
            this.backToScan()
          }
          break;
        case constant.volumeType: //声音相关
          const mute = message.Mute
          const volume = message.MasterVolume
          var volumeImage = '/assets/volumeCross.png';
          if (!mute) { //非静音
            if (volume < 34) {
              volumeImage = '/assets/volumeLow.png'
            } else if (volume < 66) {
              volumeImage = '/assets/volumeMiddle.png'
            } else {
              volumeImage = '/assets/volumeHigh.png'
            }
          }
          this.setData({
            volume: volume,
            volumeImage: volumeImage
          })
          break;
      }
    } catch (error) {}
  },
  backToScan: function () {
    wx.navigateBack();
  },
  updateButtons: function (buttons, message) {
    let globleButtons = [];
    let contextButtons = [];
    buttons.forEach(element => {
      if (element.IconFileName && element.IconFileName.startsWith('fa:')) {
        const split = element.IconFileName.substring(3).split(/_|:/)
        if (split.length >= 2) {
          const style = split[0].toLocaleLowerCase()
          const name = split[1].replace(/([a-z])([A-Z]+)/g, "$1-$2").toLocaleLowerCase();
          const src = `https://files.getquicker.net/fa/5.15.3/svgs/${style}/${name}.svg`
          element.IconFileName = src;
        }
      }
      if (element.Index < 1000000) { //globle button
        globleButtons.push(element);
      } else { //context
        contextButtons.push(element);
      }
    });
    const tampGlobleButton = this.data.globleButton
    const tampContextButton = this.data.contextButton
    if (globleButtons.length != 0) tampGlobleButton[message.GlobalPageIndex] = globleButtons;
    if (contextButtons.length != 0) tampContextButton[message.ContextPageIndex] = contextButtons;
    this.setData({
      globleButton: tampGlobleButton,
      contextButton: tampContextButton,
      profileName: message.ProfileName,
      globalPageCount: message.GlobalPageCount,
      globalPageIndex: message.GlobalPageIndex,
      contextPageCount: message.ContextPageCount,
      contextPageIndex: message.ContextPageIndex,
      isContextPanelLocked: message.IsContextPanelLocked
    });
  },
  changeGloblePage: function (event) {
    const source = event.detail.source;
    const current = event.detail.current;
    if (source == 'touch') { //手动滚动
      if (this.data.globalPageIndex < current) { //向右滚动
        sendMessage(command.command(constant.CHANGE_PAGE, constant.DATA_PAGE_GLOBAL_RIGHT));
      } else if (this.data.globalPageIndex > current) { //向左滚动
        sendMessage(command.command(constant.CHANGE_PAGE, constant.DATA_PAGE_GLOBAL_LEFT));
      }
    }
  },
  changeContextPage: function (event) { //页面滚动监听
    const source = event.detail.source;
    const current = event.detail.current;
    if (source == 'touch') { //手动滚动
      if (this.data.contextPageIndex < current) { //向右滚动
        sendMessage(command.command(constant.CHANGE_PAGE, constant.DATA_PAGE_CONTEXT_RIGHT));
      } else if (this.data.contextPageIndex > current) { //向左滚动
        sendMessage(command.command(constant.CHANGE_PAGE, constant.DATA_PAGE_CONTEXT_LEFT));
      }
    }
  },
  butonClick: function (event) { //点击按钮监听
    const index = event.currentTarget.dataset.index;
    sendMessage(command.buttonClick(index))
  },
  lockTap: function (event) {
    sendMessage(command.command(constant.LOCK_PANEL))
  },
  volumeChange: function (event) { //手动滑动音量滑块
    sendMessage(command.updateVolume(event.detail.value))
  },
  mainWindow: function (event) { //显示主面板
    sendMessage(command.command(constant.OPEN_MAINWIN))
  },
  toggleMute: function (event) { //切换静音
    sendMessage(command.toggleMute())
  }
})
//发送json字符串到客户端
function sendMessage(msgObj) {
  if (isSocketConnected && tcpSocket && msgObj) {
    try {
      const messageType = msgObj.messageType;
      const message = JSON.stringify(msgObj);
      // 创建一个 ArrayBuffer 对象
      let array = new encoding.TextEncoder('utf8').encode(message);
      const buffer = new ArrayBuffer(array.length + 16);

      const view = new DataView(buffer);
      view.setInt32(0, -0x1);
      view.setInt32(4, messageType);
      view.setInt32(8, array.length);
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        view.setInt8(12 + index, element);
      }
      view.setInt32(12 + array.length, 0);
      // 将 ArrayBuffer 写入 Socket
      tcpSocket.write(buffer);
    } catch (error) {}
  } else {
    wx.navigateBack();
  }
}