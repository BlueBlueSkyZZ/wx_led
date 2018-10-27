//index.js
//见https://open.iot.10086.cn/doc/art665.html
//获取应用实例
const app = getApp()
const apikey = "eNIzhrJ8mW0Pol4phyvUZj6EKRA="
const deviceid = '501311474'
var deviceConnected = "false"

const deviceInfoURL = "https://api.heclouds.com/devices/" + deviceid
const getDataStreamURL = "https://api.heclouds.com/devices/" + deviceid + "/datastreams"
const sendCommandURL = "https://api.heclouds.com/cmds"

function deviceInit() {
  //初始化各个硬件的状态
  wx.request({
    url: getDataStreamURL,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      "api-key": apikey
    },
    data: {
      
    },
    success(res) {
      for(var i=0; i<res.data.data.length; i++) {
        var info = res.data.data[i]
        
        switch(info.id) {
          case "Blue_Led":
            if(info.current_value == 1) {
              this.setData({ blue_checked:'true'})
            } else {
              this.setData({ blue_checked: 'false' })
            }
            break
          case "Beep":
          //TODO
            break
          case "Red_Led":
            break
          case "Tempreture":
            break
          case "Yellow_Led":
            break
          case "Green_Led":
            break
          case "Humidity":
            break
        }
      }
    }
  })
}

function controlLED(hardware_id ,switch_value) {
  //按钮发送命令控制硬件
  wx.request({
    url: sendCommandURL + "?device_id=" + deviceid,
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      "api-key": apikey
    },
    data: {
      //TODO 设计自定义语言 blueled:{V}, 预感这边可能会有问题
      hardware_id: switch_value
    },
    success(res) {
      console.log("控制成功")
      console.log(res)
      if(1) {
        alert("控制成功")
      } else {
        alert("设备不在线")
      }
    }
  })
}

Page({
  onLoad: function () {
    //加载时完成1.检查设备是否连接2.连接成功将数据显示在界面
    wx.request({
      url: deviceInfoURL,
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
          deviceInit()//初始化按钮
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
    switch(event.currentTarget.id) {
      case 'blue_led':
        console.log('蓝')
        controlLED('blueled', event.detail.value)
        break;
      case 'yellow_led':
      //TODO
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
