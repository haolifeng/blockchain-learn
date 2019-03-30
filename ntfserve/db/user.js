const mongoose = require('./dbcommon');
var Schema = mongoose.Schema;

const userSchema = new Schema({
	userName: String,
    passWord:String,
    salt:String
});

var UserModel = mongoose.model('user',userSchema);
exports = module.exports = UserModel;
