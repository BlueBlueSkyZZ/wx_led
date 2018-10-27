//index.js
//获取应用实例
const app = getApp()
const apikey = "eNIzhrJ8mW0Pol4phyvUZj6EKRA="
var deviceConnected = "false"

const deviceInfo = "https://api.heclouds.com/devices/501311474"
const getDataStream = "https://api.heclouds.com/devices/501311474/datastreams"

function deviceInit() {

}

Page({
  onLoad: function () {
    //加载时完成
    
    wx.request({
      url: deviceInfo,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        "api-key": apikey
      },
      data : {

      },
      success(res){
        console.log(res)
        console.log(res.data.data.online)
        if (res.data.data.online) {
          console.log("false怎么执行？？")
          deviceConnected = "true"
        } else {
          console.log("false执行")
          deviceConnected = "false"
        }
      },
      fail(res){
        console.log("请求失败")
        deviceConnected = "false"
      }
    })
    if(deviceConnected) {
      console.log("执行了")
      this.setData({ deviceConnected:"false"})
    } else {
      console.log("执行了2")
      this.setData({ deviceConnected: "false" })
    }
  },
  change: function (event) {
    console.log(event.detail.value)
    switch(event.currentTarget.id) {
      case 'blue_led':
        wx.request({
          url: getDataStream,
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            "api-key": apikey
          },
          data : {
            
          },
          success(res) {
            console.log('请求成功')
            console.log(res)
          }
        })
        console.log('蓝')
        break;
      case 'yellow_led':
        console.log('黄')
        break;
      case 'green_led':
        console.log('绿')
        break;
      case 'red_led':
        console.log('红')
        break;
      case 'beep':
        console.log('喇叭')
        break;
    }
  }
})
