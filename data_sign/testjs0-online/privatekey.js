let fs = require('fs');
let keythereum = require('keythereum');
let ethUtil = require('ethereumjs-util');
const env = require('./env');




let keystorefile = env.PrivateKeyFile;
let addr = env.Man.Account;
let password = env.Man.Password;

let keystoreContent = fs.readFileSync(keystorefile).toString();
let keystore = JSON.parse(keystoreContent);
let keyObj = { version: keystore.version, crypto:keystore.crypto};

let privatekey =  keythereum.recover(password, keyObj);  //buffer
//let address = ethUtil.bufferToHex(ethUtil.privateToAddress(privatekey));

/*
console.log(address);
if(address == addr){
    console.log(true);
}else{
    console.log(false);
}
*/
exports.privatekey = privatekey;
//exports.address = addr;