let ethUtils = require('ethereumjs-util');
let keythereum = require('keythereum');
let fs = require('fs');
let Web3 = require('web3');
let web3util  = require('web3/lib/utils/utils');
let leftPad = require('left-pad');

let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8546"));



let keystoredir = '/home/hlf/Software/gwan/data/keystore/';
let keystorefile = 'UTC--2019-01-04T03-23-14.535885383Z--88Edfd5FA648B166fB6C9Daf3dac749f55e87a44';
let password = '123456';
let address = '0x88Edfd5FA648B166fB6C9Daf3dac749f55e87a44';
let keystorefileconten = fs.readFileSync(keystoredir+keystorefile);
let keystore = JSON.parse(keystorefileconten);
let keyObj = { version:keystore.version, crypto:keystore.crypto };
let privateKey = keythereum.recover(password,keyObj);

function T_keccak256(...args){
    args = args.map(arg => {
        if(typeof arg === 'string'){
            if(arg.substring(0,2) === '0x'){
                return arg.slice(2)
            }else {
                return web3util.fromAscii(arg).slice(2)
            }
        }
        if(typeof arg === 'number'){
            return leftPad((arg).toString(16),64,0)
            //return web3.fromDecimal(arg).slice(2);
        }else {
            return ''
        }
    })
    args = args.join('');
   // console.log('args:'+args);
   // return web3.sha3(args, { encoding: 'hex'});
    return args;

}


let data = T_keccak256('a',10,address);

var hashdata = ethUtils.sha256(data);
console.log('hashdata:'+ hashdata.toString('hex'));

var vrs = ethUtils.ecsign(hashdata,privateKey);

console.log('v:' + vrs.v);
console.log('r:' + vrs.r.toString('hex'));
console.log('s:' + vrs.s.toString('hex'));





