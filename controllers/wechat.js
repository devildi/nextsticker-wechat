'use strict'

var wechat = require('../init/dataflow')
var reply = require('../init/reply')
var wx = require('../wx/index')

exports.watch = function *(next) {
  this.middle = wechat(wx.wechatOptions.wechat, reply.reply)

  console.log(this.method)

  yield this.middle(next)
}
