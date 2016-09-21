'use strict'

var Promise = require('bluebird')

var request = Promise.promisify(require('request'))

var util = require('./util')
var fs = require('fs')

var prefix = 'https://api.weixin.qq.com/cgi-bin/'

var api = {
	accessToken: prefix + 'token?grant_type=client_credential',
  menu: {
    create: prefix + 'menu/create?',
    del: prefix + 'menu/delete?'
  }
}

function Wechat(opts){
	this.appID = opts.appID
	this.appSecret = opts.appSecret
	this.getAccessToken = opts.getAccessToken
	this.saveAccessToken = opts.saveAccessToken

	this.fetchAccessToken()
}

Wechat.prototype.fetchAccessToken = function(){
	var that = this

	return this.getAccessToken()
    .then(function(data) {
      try {
        data = JSON.parse(data)
      }
      catch(e) {
        return that.updateAccessToken()
      }

      if (that.isValidAccessToken(data)) {
        return Promise.resolve(data)
      }
      else {
        return that.updateAccessToken()
      }
    })
    .then(function(data) {
      that.saveAccessToken(data)

      return Promise.resolve(data)
    })
}

Wechat.prototype.isValidAccessToken = function(data) {
  if (!data || !data.access_token || !data.expires_in) {
    return false
  }

  var access_token = data.access_token
  var expires_in = data.expires_in
  var now = (new Date().getTime())

  if (now < expires_in) {
    return true
  }
  else {
    return false
  }
}

Wechat.prototype.updateAccessToken = function() {
  var appID = this.appID
  var appSecret = this.appSecret
  var url = api.accessToken + '&appid=' + appID + '&secret=' + appSecret

  return new Promise(function(resolve, reject) {
    request({url: url, json: true}).then(function(response) {
      var data = response.body
      var now = (new Date().getTime())
      var expires_in = now + (data.expires_in - 20) * 1000

      data.expires_in = expires_in

      resolve(data)
    })
  })
}

Wechat.prototype.reply = function() {
  var content = this.body
  var message = this.weixin
  var xml = util.tpl(content, message)

 

  this.status = 200
  this.type = 'application/xml'
  this.body = xml
}

Wechat.prototype.createMenu = function(menu) {
  var that = this

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken()
      .then(function(data) {
        var url = api.menu.create + 'access_token=' + data.access_token

        request({method: 'POST', url: url, body: menu, json: true}).then(function(response) {
          var _data = response.body

          if (_data) {
            resolve(_data)
          }
          else {
            throw new Error('Create menu fails')
          }
        })
        .catch(function(err) {
          reject(err)
        })
      })
  })
}

Wechat.prototype.deleteMenu = function() {
  var that = this

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken()
      .then(function(data) {
        var url = api.menu.del + 'access_token=' + data.access_token

        request({url: url, json: true}).then(function(response) {
          var _data = response.body

          if (_data) {
            resolve(_data)
          }
          else {
            throw new Error('Delete menu fails')
          }
        })
        .catch(function(err) {
          reject(err)
        })
      })
  })
}

module.exports = Wechat




