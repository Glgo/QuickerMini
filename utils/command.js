const constant = require('./constants')

export const command = function (command, data) {
  return {
    Command: command,
    Data: data,
    messageType: constant.commonCommandType
  }
}
export const buttonClick = function (buttonIndex) {
  return {
    ButtonIndex: buttonIndex,
    messageType: constant.buttonClickedCommandType
  }
}
export const updateVolume = function (volume) {
  return {
    MasterVolume: volume,
    messageType: constant.updateVolumeType
  }
}
export const toggleMute = function () {
  return {
    messageType: constant.toggleMuteType
  }
}