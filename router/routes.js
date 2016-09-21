'use strict'

var Wechat = require('../controllers/wechat')

module.exports = function(router){

	router.get('/', Wechat.watch)
 	router.post('/', Wechat.watch)

 	
}

