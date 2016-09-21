'use strict'

var path = require('path')
var util = require('../utils/util')
var Wechat = require('../init/wechat')
var wechat_file = path.join(__dirname, '../utils/wechat_token.txt')
var wechat_ticket_file = path.join(__dirname, '../utils/wechat_ticket.txt')

var config = {
  wechat: {
    appID: 'wx98b52aaf3a58bae0',
    appSecret: '72efe2ede3b2e0fa85d3acb87b35cedd',
    token: 'tqboywuwei',
    getAccessToken: function() {
      return util.readFileAsync(wechat_file)
    },
    saveAccessToken: function(data) {
      data = JSON.stringify(data)
      return util.writeFileAsync(wechat_file, data)
    },
    getTicket: function() {
      return util.readFileAsync(wechat_ticket_file)
    },
    saveTicket: function(data) {
      data = JSON.stringify(data)

      return util.writeFileAsync(wechat_ticket_file, data)
    }
  }
}

exports.wechatOptions = config


exports.getWechat = function() {
  var wechatApi = new Wechat(config.wechat)

  return wechatApi
}
