const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    detailInfo: {},
    visible: false,
    password: '',
    isPwd: '',
    callbackInfo: {}
  },
  /**
   * 页面的初始数据
   */
  onShareAppMessage: function (res) {
    var _this = this;
    const { callbackInfo, password, isPwd} = this.data
    var psw = password.length === 11 ? password : '';
    return {
      title: "发送祝福", 
      path: '/pages/detail/detail?benison_id=' + callbackInfo.id + '&template_id=' + callbackInfo.template_id + '&password=' + psw ,
      success: function(res){
        if (!res.shareTickets.length){
          _this.isDeleteTemplate()
        }
        wx.navigateTo({
          url: '/pages/detail/detail?benison_id=' + callbackInfo.id + '&template_id=' + callbackInfo.template_id
        })
      },
      fail: function(event){
        _this.isDeleteTemplate()
        console.log(event, "fail")
      },
      complete: function(event){
        console.log(event, "complete")
      }
    }
  },
  //是否删除发送的祝福模板
  isDeleteTemplate: function(){
    const { callbackInfo } = this.data
    const options = {
      url: '/benison/' + callbackInfo.id,
      method: 'delete'
    }
    util.fetch(options, function(res){},true)
  },
  saveBlessTemplate: function(opt){
    var _this = this;
    const { isPwd } = this.data
    const userInfo = wx.getStorageSync('userInfo') || {}
    const options = {
      url: '/benison',
      method: 'post',
      data: {
        benisons_txt: opt.benisons_txt,
        template_id: opt.template_id,
        user_id: userInfo.id,
        password: isPwd?this.data.password:''
      }
    }
    util.fetch(options, function(res){
      _this.setData({ callbackInfo: res })
    },true)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetail(options)
    wx.showShareMenu({
      withShareTicket: true,
      success: function (res) {
        console.log(res)
      }
    })
  },
  getDetail: function(opt){
    var _this = this
    const options = {
      url: "/benison/detail",
      data: {
        benison_id: opt.benison_id
      }
    }

    util.fetch(options, function(res){
      res["template"]["top"] = res["template"]["top"] * 589 / 750;
      console.log(res, 8888)
      _this.setData({ detailInfo: res })
    })
  },
  textareaChange(event){
    var content = event.detail.value
    const { detailInfo } = this.data
    detailInfo.benisons_txt = content
    this.setData({ detailInfo })
  },
  sendBless(event){
    this.setData({visible: true})
    this.saveBlessTemplate(this.data.detailInfo)
  },
  getPaassword: function(event){
    this.setData({password: event.detail.value})
  },
  //点击有密无密分享
  shareHandle: function(event){
    const { password } = this.data
    this.setData({ isPwd: event.currentTarget.dataset.id })
  },
  enShareHandle: function (event){
    const {password} = this.data
    if (password.length !== 11){
      wx.showToast({
        title: '密码不能为空或格式不正确~',
        icon: 'none',
        duration: 2000,
      })
      return
    }
    this.setData({ isPwd: event.currentTarget.dataset.id})
  }

})