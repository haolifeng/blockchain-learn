const fs = require('fs');

const env = require('./env');

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(env.blockchainurl));

const abifileContent = fs.readFileSync(env.abifile).toString();
const abifileContentObj = JSON.parse(abifileContent);
const abi=abifileContentObj.abi;

const constractInst = web3.eth.contract(abi).at(env.scaddr);
/*
web3.personal.unlockAccount(env.Man.address, env.Man.passwd);

constractInst.SetNum.sendTransaction(250,260,{from:env.Man.address, gas:3500000},function(err, result){
    if(err){
        console.log(err);
    }else{
        console.log("result:" + result);
    }
});
*/
let eventSetNum = constractInst["eventSetNum"]({},{fromBlock:1, toBlock:'latest'});

eventSetNum.watch(function(err, result){
    if(err){
        console.log(err);
    }else{
        console.log(result.args.n1.toNumber());
        console.log(result.args.n2.toNumber());
    }
});

