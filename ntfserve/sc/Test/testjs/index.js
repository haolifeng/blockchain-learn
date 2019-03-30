const EthUtil = require('ethereumjs-util');
const fs = require('fs');

const privateKey = require('./privatekey');


let Web3 = require('web3');
let web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

const message = EthUtil.keccak256('Message to sign here.');

const signature =  EthUtil.ecsign(message,privateKey.privatekey);



let scaddr = '0xd0d76adba72766d290a2b052ec412bff243b902e';

let abifile = '../build/contracts/Test.json';
let abifileContent = fs.readFileSync(abifile).toString();
let abi = JSON.parse(abifileContent).abi;

let signCheckContract = web3.eth.contract(abi);
let signCheckInstance = signCheckContract.at(scaddr);

let msghash = '0x' + message.toString('hex');
console.log(msghash);

let v = signature.v;
console.log(v);
let r = '0x' + signature.r.toString('hex');
let s = '0x' + signature.s.toString('hex');
console.log(r);
console.log(s);
/*
let addre = EthUtil.ecrecover(message, v,r,s);
let addrBuf = EthUtil.pubToAddress(addre);
let add1=EthUtil.bufferToHex(addrBuf);
console.log(add1);*/



signCheckInstance.k_ecrecover.sendTransaction(msghash,v, r,s,{from:privateKey.address,gas:300000},function(err, result){
    if(err){
        console.log("err is " + err);
    }else{
        console.log(result);
    }
});

let eventecrecover = signCheckInstance['ecrecoveEvent']({},{fromBlock:1, toBlock:'latest'});
eventecrecover.watch(function(err, result){
    if(!err){
        let a = result.args.a.toString();
        console.log(a);
    }else{
        console.log(err);
    }
});
