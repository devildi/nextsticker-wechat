'use strict'

var Koa = require('koa')
var mongoose = require('mongoose')
var session = require('koa-session')
var bodyParser = require('koa-bodyparser')
var app = new Koa()


/*var dbUrl = 'mongodb://localhost/nextsticker'
mongoose.connect(dbUrl)*/

var menu = require('./init/menu')
var wx = require('./wx/index')
var wechatApi = wx.getWechat()

wechatApi.deleteMenu()
.then(function() {
  return wechatApi.createMenu(menu)
})
.then(function(msg) {
  console.log(msg)
})

app.keys = ['nextsticker']
app.use(session(app))

var views = require('koa-views')
var moment = require('moment')
app.use(views(__dirname + '/views', {
  extension: 'jade',
  locals: {
    moment: moment
  }
}))

var router = require('koa-router')()
require('./router/routes')(router)
app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(1234)
console.log('Listening: 1234')