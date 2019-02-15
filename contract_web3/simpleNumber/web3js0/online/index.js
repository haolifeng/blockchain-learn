const fs = require('fs');
const env = require('./env');
const Web3 = require('web3');

let web3 = new Web3(new Web3.providers.HttpProvider(env.gwanUrl));

const abifile = fs.readFileSync(env.abifile).toString();
const abi= JSON.parse(abifile).abi;

const constractInstance = web3.eth.contract(abi).at(env.scaddr);

const account = env.Man.address;
const passwd = env.Man.passWd;

//web3.personal.unlockAccount(account, passwd);
/*
constractInstance.SetNum.sendTransaction(30,{from:account,gas:3500000},function(err, result){
    if(err){
        console.log(err);
    }else{
        console.log("result" + result);
    }
});
*/
const evenSetNum = constractInstance["eventSetNum"]({},{fromBlock:1, toBlock:'latest'});

evenSetNum.watch(function(err, result){
    if(err){
        console.log(err);
    }else{
        console.log(result.args.n.toNumber());
        let num = constractInstance.GetNum.call();
        console.log("num is : " + num);
    }
});
