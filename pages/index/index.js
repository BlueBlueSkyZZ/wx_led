//index.js
//见https://open.iot.10086.cn/doc/art665.html
//获取应用实例
const app = getApp()
// const apikey = "eNIzhrJ8mW0Pol4phyvUZj6EKRA="//我的
// const deviceid = '501311474'//我的
const apikey = 'STfQ2EuyYWiLmSKecLiRFXI8PTs='//徐
const deviceid = '46195844'//徐

var deviceConnected = false

const deviceInfoURL = "https://api.heclouds.com/devices/" + deviceid
const getDataStreamURL = "https://api.heclouds.com/devices/" + deviceid + "/datastreams"
const sendCommandURL = "https://api.heclouds.com/cmds"

function getDeviceInfo(that) {
  //查看设备连接状态，并刷新按钮状态
  wx.request({
    url: deviceInfoURL,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      "api-key": apikey
    },
    data: {

    },
    success(res) {
      // console.log(res)
      if (res.data.data.online) {
        console.log("设备已经连接")
        deviceInit(that)//初始化按钮
        deviceConnected = true
      } else {
        console.log("设备还未连接")
        deviceConnected = false
      }
    },
    fail(res) {
      console.log("请求失败")
      deviceConnected = false
    },
    complete() {
      if (deviceConnected) {
        that.setData({ deviceConnected: true })
      } else {
        that.setData({ deviceConnected: false })
      }
    }
  })
}

function deviceInit(that) {
  console.log("开始初始化按钮")
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
              that.setData({ blue_checked : true})
            } else {
              that.setData({ blue_checked : false})
            }
            break
          case "Beep":
            if (info.current_value == 1) {
              that.setData({ beep_checked: true })
            } else {
              that.setData({ beep_checked: false })
            }
            break
          case "Red_Led":
            if (info.current_value == 1) {
              that.setData({ red_checked: true })
            } else {
              that.setData({ red_checked: false })
            }
            break
          case "Tempreture":
            break
          case "Yellow_Led":
            if (info.current_value == 1) {
              that.setData({ yellow_checked: true })
            } else {
              that.setData({ yellow_checked: false })
            }
            break
          case "Green_Led":
            if (info.current_value == 1) {
              that.setData({ green_checked: true })
            } else {
              that.setData({ green_checked: false })
            }
            break
          case "Humidity":
            break
        }
      }
    }
  })
}

function controlLED(hardware_id ,switch_value) {
  // console.log("发送命令：" + hardware_id + ":{" + switch_value + "}")
  console.log("发送命令：" + hardware_id + ":" +switch_value )
  //按钮发送命令控制硬件
  wx.request({
    url: sendCommandURL + "?device_id=" + deviceid,
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      "api-key": apikey
    },
    // data: hardware_id + ":{" + switch_value + "}",      //TODO 设计自定义语言 blueled:{V}, 预感这边可能会有问题
    data: hardware_id + ":" + switch_value ,
    success(res) {
      console.log("控制成功")
      console.log(res)
      // if(1) {
      //   alert("控制成功")
      // } else {
      //   alert("设备不在线")
      // }
    }
  })
}

Page({
  onLoad: function () {
    //加载时完成1.检查设备是否连接2.连接成功将数据显示在界面
    var that = this //将当前对象赋值
    getDeviceInfo(that)
  },
  onShow: function() {
    //TODO依旧有问题
    var that = this
    
    var timer = setInterval(function(){
      getDeviceInfo(that)
    }, 3000)
  },
  change: function (event) {
    var cmdData = event.detail.value == true ? 1 : 0 //修改为约定的数据
    switch(event.currentTarget.id) {
      case 'blue_led':
        console.log('蓝')
        controlLED('blueled', cmdData)
        break;
      case 'yellow_led':
        console.log('黄')
        controlLED('yellowled', cmdData)
        break;
      case 'green_led':
        console.log('绿')
        controlLED('greenled', cmdData)
        break;
      case 'red_led':
        console.log('红')
        controlLED('redled', cmdData)
        break;
      case 'beep':
        console.log('喇叭')
        controlLED('beep', cmdData)
        break;
    }
  }
})
