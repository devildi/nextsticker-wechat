'use strict'

var path = require('path')

var wx = require('../wx/index')

var wechatApi = wx.getWechat()

var help = '亲爱的，欢迎关注NextSticker\n' +
   '回复 1，搜索国际航班\n' +
   '回复 2，搜索酒店民居\n' +
   '回复 3，购买手机SIM卡\n' +
   '回复 4，查询航班状态\n' +
   '也可以回复 国家 或 城市名\n' +
   '也欢迎吐槽'

exports.reply = function* (next) {
  var message = this.weixin


  if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      this.body = help
    }
    else if (message.Event === 'unsubscribe') {
      this.body = ''
    }
    else if (message.Event === 'LOCATION') {
      //this.body = '您上报的位置是： ' + message.Latitude + '/' + message.Longitude + '-' + message.Precision
      this.body = ''
    }
    else if (message.Event === 'SCAN') {
      console.log('关注后扫二维码' + message.EventKey + ' ' + message.Ticket)

      this.body = '看到你扫了一下哦'
    }
    else if (message.Event === 'VIEW') {
      this.body = '您点击了菜单中的链接 ： ' + message.EventKey
    }
    else if (message.Event === 'scancode_push') {
      console.log(message.ScanCodeInfo.ScanType)
      console.log(message.ScanCodeInfo.ScanResult)
      this.body = '您点击了菜单中 ： ' + message.EventKey
    }
    else if (message.Event === 'scancode_waitmsg') {
      console.log(message.ScanCodeInfo.ScanType)
      console.log(message.ScanCodeInfo.ScanResult)
      this.body = '您点击了菜单中 ： ' + message.EventKey
    }
    else if (message.Event === 'pic_sysphoto') {
      console.log(message.SendPicsInfo.PicList)
      console.log(message.SendPicsInfo.Count)
      this.body = '您点击了菜单中 ： ' + message.EventKey
    }
    else if (message.Event === 'pic_photo_or_album') {
      console.log(message.SendPicsInfo.PicList)
      console.log(message.SendPicsInfo.Count)
      this.body = '您点击了菜单中 ： ' + message.EventKey
    }
    else if (message.Event === 'pic_weixin') {
      console.log(message.SendPicsInfo.PicList)
      console.log(message.SendPicsInfo.Count)
      this.body = '您点击了菜单中 ： ' + message.EventKey
    }
    else if (message.Event === 'location_select') {
      console.log(message.SendLocationInfo.Location_X)
      console.log(message.SendLocationInfo.Location_Y)
      console.log(message.SendLocationInfo.Scale)
      console.log(message.SendLocationInfo.Label)
      console.log(message.SendLocationInfo.Poiname)
      this.body = '您点击了菜单中 ： ' + message.EventKey
    }
    else if (message.Event === 'CLICK') {
      var news = []

      if (message.EventKey === 'movie_hot') {
        let movies = yield Movie.findHotMovies(-1, 10)

        movies.forEach(function(movie) {
          news.push({
            title: movie.title,
            description: movie.title,
            picUrl: movie.poster,
            url: 'http://fqrsu5a1ls.proxy.qqbrowser.cc/wechat/jump/' + movie._id
          })
        })
      }
      else if (message.EventKey === 'movie_cold') {
        let movies = yield Movie.findHotMovies(1, 10)

        movies.forEach(function(movie) {
          news.push({
            title: movie.title,
            description: movie.title,
            picUrl: movie.poster,
            url: 'http://fqrsu5a1ls.proxy.qqbrowser.cc/wechat/jump/' + movie._id
          })
        })
      }
      else if (message.EventKey === 'movie_crime') {
        let cat = yield Movie.findMoviesByCate('犯罪')

        cat.movies.forEach(function(movie) {
          news.push({
            title: movie.title,
            description: movie.title,
            picUrl: movie.poster,
            url: 'http://fqrsu5a1ls.proxy.qqbrowser.cc/wechat/jump/' + movie._id
          })
        })
      }
      else if (message.EventKey === 'movie_cartoon') {
        let cat = yield Movie.findMoviesByCate('动画')

        cat.movies.forEach(function(movie) {
          news.push({
            title: movie.title,
            description: movie.title,
            picUrl: movie.poster,
            url: 'http://fqrsu5a1ls.proxy.qqbrowser.cc/wechat/jump/' + movie._id
          })
        })
      }
      else if (message.EventKey === 'help') {
        news = help
      }

      this.body = news
    }
  }
  else if (message.MsgType === 'voice') {
    var voiceText = message.Recognition
    var movies = yield Movie.searchByName(voiceText)

    if (!movies || movies.length === 0) {
      movies = yield Movie.searchByDouban(voiceText)
    }

    if (movies && movies.length > 0) {
      reply = []

      movies = movies.slice(0, 10)

      movies.forEach(function(movie) {
        reply.push({
          title: movie.title,
          description: movie.title,
          picUrl: movie.poster,
          url: 'http://fqrsu5a1ls.proxy.qqbrowser.cc/wechat/jump/' + movie._id
        })
      })
    }
    else {
      reply = '没有查询到与 ' + voiceText + ' 匹配的电影，要不要换一个名字试试'
    }

    this.body = reply
  }
  else if (message.MsgType === 'text') {
    var content = message.Content
    var reply = help

    if (content === '1') {
      reply = [{
        title: '技术改变世界',
        description: '只是个描述而已',
        picUrl: 'http://res.cloudinary.com/moveha/image/upload/v1441184110/assets/images/Mask-min.png',
        url: 'https://github.com/'
      }]
    }
    else if (content === '2') {
      reply = [{
        title: '技术改变世界',
        description: '快快快快快快',
        picUrl: 'http://res.cloudinary.com/dnfhsjz8u/image/upload/v1468295285/%E6%BE%B3%E5%A4%A7%E5%88%A9%E4%BA%9A/%E6%82%89%E5%B0%BC/DSC03699.jpg',
        url: 'https://github.com/'
      }]
    }
    else if (content === '3') {
      reply = [{
        title: '技术改变世界',
        description: '只是个描述而已',
        picUrl: 'http://res.cloudinary.com/moveha/image/upload/v1441184110/assets/images/Mask-min.png',
        url: 'https://github.com/'
      }]
    }
    else if (content === '4') {
      reply = [{
        title: '技术改变世界',
        description: '只是个描述而已',
        picUrl: 'http://res.cloudinary.com/moveha/image/upload/v1441184110/assets/images/Mask-min.png',
        url: 'https://github.com/'
      }]
    }

    this.body = reply
  }

  yield next
}