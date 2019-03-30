function makeSalt(len) {
    var str = 'qwertyuiop[]asdfghjkl;zxcvbnm,./';
    var salt = '';
    for(var i=0; i<len; i++){
        salt += str.charAt(Math.floor(Math.random(0, str.length)));
    }
    return salt;
}

function toChinaDate(date) {
    var localTime = date.getTime();//毫秒
    var localOffset = date.getTimezoneOffset()*60000; //获得当地时区偏移的毫秒数
    var utc = localTime + localOffset; //还原成utc时间

    var offset = 8; //中国，东+8区
    var time = utc + (3600000*offset);//时间毫秒
    return new Date(time);
}
function toChinaDate(date) {
    var localTime = date.getTime();//毫秒
    var localOffset = date.getTimezoneOffset()*60000; //获得当地时区偏移的毫秒数
    var utc = localTime + localOffset; //还原成utc时间

    var offset = 8; //中国，东+8区
    var time = utc + (3600000*offset);//时间毫秒
    return new Date(time);
}

function getPadStr(num) {
    return num >= 10 ? num : '0'+num;
}

function getDateString(date) {
    return date.getFullYear()
        + '-' + getPadStr(date.getMonth()+1)
        + '-' + getPadStr(date.getDate())
        + ' ' + getPadStr(date.getHours())
        + ':' + getPadStr(date.getMinutes())
        + ':' + getPadStr(date.getSeconds());
}

function toDateStr(date) {
    return getDateString(toChinaDate(date));
}

function getCnDate() {
    return toChinaDate(new Date());
}

exports.makeSalt = makeSalt;
exports.toDateStr = toDateStr;
exports.toChinaDate = toChinaDate;
exports.getDateString = getDateString;
exports.getCnDate = getCnDate;