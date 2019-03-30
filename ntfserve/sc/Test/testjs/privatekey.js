let fs = require('fs');
let keythereum = require('keythereum');
let ethUtil = require('ethereumjs-util');


let keystoredir = '/home/hlf/Software/eth/data/00/keystore/';
let keystorefile = keystoredir + "UTC--2018-04-25T08-57-11.280795135Z--2a04129f0c9d8c62ab639952d9f9bb4919d96bdf";
let addr="0x2a04129f0c9d8c62ab639952d9f9bb4919d96bdf";
let password = "123456";

let keystoreContent = fs.readFileSync(keystorefile).toString();
let keystore = JSON.parse(keystoreContent);
let keyObj = { version: keystore.version, crypto:keystore.crypto};

let privatekey =  keythereum.recover(password, keyObj);
let address = ethUtil.bufferToHex(ethUtil.privateToAddress(privatekey));

/*
console.log(address);
if(address == addr){
    console.log(true);
}else{
    console.log(false);
}
*/
exports.privatekey = privatekey;
exports.address = addr;