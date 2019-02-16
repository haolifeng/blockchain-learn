// generated at  2018/5/10 下午4:38:41 .
const Web3 = require("web3")
var keythereum = require('keythereum');
const crypto = require("crypto");
keythereum.constants.quiet = true;
const wanUtil = require('wanchain-util');
var ethUtil = require('ethereumjs-util');
var wanTx = wanUtil.wanchainTx;
const utils = require('web3/lib/utils/utils');
var Tx = require('ethereumjs-tx');

function WLOfflineSDK() {
    this.privateKey = undefined;
    this.address = undefined;
}

WLOfflineSDK.prototype.GenerateAccount = function (password) {
    let privateKey = crypto.randomBytes(32);
    let params = {keyBytes: 32, ivBytes: 16};
    let dk = keythereum.create(params);
    let options = {
        kdf: "scrypt",
        cipher: "aes-128-ctr",
        kdfparams: {
            c: 262144,
            dklen: 32,
            prf: "hmac-sha256"
        }
    };

    // iOS 系统调整加密方法参数，解决慢问题 请打开
    // var u = navigator.userAgent;
    // var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    // if (isIOS) {
    //     options.kdf = "pbkdf2";
    //     options.kdfparams.c = 10000;
    // }

    //
    let keyObject = keythereum.dump(password, privateKey, dk.salt, dk.iv, options);
    let keyObject2 = keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, options);
    keyObject.crypto2 = keyObject2.crypto;
    keyObject.waddress = wanUtil.generateWaddrFromPriv(privateKey, dk.privateKey).slice(2);
    console.log("Your address is 0x" + keyObject.address);
    this.address = keyObject.address;
    console.log(JSON.stringify(keyObject));
    return JSON.stringify(keyObject);
}

WLOfflineSDK.prototype.loadWalletFile = function (keystoreContent, password) {
    var keystore = JSON.parse(keystoreContent)
    let keyObj = {version: keystore.version, crypto: keystore.crypto};
    try {
        this.privateKey = keythereum.recover(password, keyObj);
        this.address = ethUtil.bufferToHex(ethUtil.privateToAddress(this.privateKey))
        return 'true'
    } catch (error) {
        console.log('wan_refundCoin', 'wrong password', error);
        return 'false'
    }
}

WLOfflineSDK.prototype.unloadWalletFile = function () {
    //?
    this.privateKey = null;
    this.address = null;
}

WLOfflineSDK.prototype.walletAddress = function () {
    return this.address;
}

WLOfflineSDK.prototype.signTx = function (tx) {
    var err = '';
    var signtx = '';
    try {
        if (tx == undefined || tx == null) {
            throw "transactionSign tx is empty"
        }

        if (this.privateKey == undefined || this.privateKey == null) {
            throw "privateKey is  empty"
        }
        //console.log("sigtx function tx:" + tx);
        var json = JSON.parse(tx);
        //console.log(json.Txtype+"|"+json.nonce+"|"+json.gasPrice+"|"+json.gasLimit+"|"+json.to+"|"+json.data);
        var signtx = new wanTx({
            Txtype: json.Txtype,
            nonce: json.nonce,
            gasPrice: json.gasPrice,
            gasLimit: json.gasLimit,
            to: json.to,
            value: json.value,
            data: json.data,
        });
        //var signtx = new wanTx(tx);
        //console.log("sigtx function signtx:"+signtx.toJSON());

        signtx.sign(this.privateKey);

        //var str = JSON.stringify(signtx);
        signtx = '0x' + signtx.serialize().toString('hex');
    }catch (e) {
        err = e.toString();
        console.error("err:",err);
    }

    var result = {
        "err":err,
        "signtx":signtx
    };
    return result;
}


WLOfflineSDK.prototype.WLOfflineSDK = WLOfflineSDK;
//param list:contract abi,contract byte code
//such as "[]","0xxxxx"
module.exports = exports = WLOfflineSDK;

