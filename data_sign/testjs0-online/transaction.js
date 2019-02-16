const env = require('./env');
const ContractMod = require('./createcontract');
const PrivateKey = require('./privatekey');
const ethUtil = require('ethereumjs-util');
const leftPad = require('left-pad');

const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(env.gwanUrl));

/*A B C
A approve B
B transferfrom C
A transfer C

-- c total 2
*/




let addrA = '0x88eDFD5fa648b166Fb6c9dAF3DAC749F55E87A44';
let addrB = '0x291c6a11db62bca2ce8d160a99d86fab4604d286';
let addrC = '0x7e0bdad2277450d93a305a6d251f5104f2cb70fa';

let cardid1='5c3321dff64c2e29a01522dc';
let cardid2='5c3321dff64c2e29a01522dd';

let contractInst = ContractMod.contractInstance;
/*
contractInst.approve.sendTransaction(addrB,1,{from:addrA, gas:3000000},function(err, result){
    if(err){
        console.log(err);
        return;
    }
    console.log(result);
});
*/
/*
contractInst.transferFrom.sendTransaction(addrA,addrC,1,{from:addrB,gas:3000000},function(err, result){
    if(err){
        console.log(err);
        return;
    }
    console.log(result);
});
*/
/*
contractInst.transfer.sendTransaction(addrC,2,{from:addrA, gas:300000},function(err, result){
    if(err){
        console.log(err);
        return;
    }
    console.log(result);

});
*/
/*let cardSum = contractInst.balanceOf.call(addrC);
console.log('cardsum is:' + cardSum);

let carsuma = contractInst.balanceOf.call(addrA);
console.log('a balance is :' + carsuma);*/
let acards = contractInst.tokensOfOwner.call(addrA);
console.log(acards);

let ccards = contractInst.tokensOfOwner.call(addrC);
console.log(ccards);

/*
let eventTransfer=contractInst['Transfer']({},{fromBlock:1,toBlock:'latest'});
eventTransfer.watch(function(err, result){
    if(!err){
        console.log(result);
    }

}); */

let eventApproval = contractInst['Approval']({},{fromBlock:1,toBlock:'latest'});
eventApproval.watch(
    function(err, result){
        if(!err){
            console.log(result);
        }

    }
);