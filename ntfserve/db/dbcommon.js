var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var setting = require('../config/setting');
mongoose.connect(setting.db.uri);
var db = mongoose.connection;

db.on('error',function(err){
    global.mLogger.error(__filename, err.message);
});

exports = module.exports = mongoose;
