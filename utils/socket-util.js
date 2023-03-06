export const convertButonToMsg = function (socketTask, button) {
  button.messageType = 2;
  button.wait = true;
  switch (button.type) {
    case 'paste':
      wx.getClipboardData({
        success(res) {
          button.data = res.data
          socketTask.send({
            data: JSON.stringify(button)
          });
        }
      })
      break;
    case 'noparam':
    case 'fixed':
      console.log('发送了', button);
      socketTask.send({
        data: JSON.stringify(button)
      });
      break;
    case 'write':
      wx.showModal({
        title: '请输入参数',
        editable: true,
        success: (res) => {
          if (res.confirm) {
            button.data = res.content
            socketTask.send({
              data: JSON.stringify(button)
            });
          }
        }
      })
      break
  }
}