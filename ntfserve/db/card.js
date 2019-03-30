var mongoose = require('./dbcommon.js');
var Schema = mongoose.Schema;
//mongodb提供的_id, 但卡也有自己的CardId
var CardSchema = mongoose.Schema ({
	card_id: String,
	card_address: String,
	card_img:String,  //图片地址
	card_own:String,
	card_qrcode: String}, //二维码地址
	{timestamps:true});

var CardModel = mongoose.model('card',CardSchema);

exports = module.exports = CardModel;


