const env = require('./env');
const ContractMod = require('./createcontract');
const PrivateKey = require('./privatekey');
const ethUtil = require('ethereumjs-util');
const leftPad = require('left-pad');

const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(env.gwanUrl));

//0. sign data
//bytes24 _cardid, uint256 _cardtype,address _cardowner,uint8 v, bytes32 r, bytes32 s)

//let cardid='5c3321dff64c2e29a01522dc';
let cardid='5c3321dff64c2e29a01522dd';
let cardty= 0;
let cardower = env.Man.Account;

function T_keccak256(...args){
    args = args.map(arg => {
        if(typeof arg === 'string'){
            if(arg.substring(0,2) === '0x'){
                return arg.slice(2)
            }else {
                return web3.fromAscii(arg).slice(2)
            }
        }
        if(typeof arg === 'number'){
            return leftPad((arg).toString(16),64,0)

        }else {
            return ''
        }
    })
    args = args.join('');
    console.log('args:'+args);
    return web3.sha3(args, { encoding: 'hex'});

}

let msghash = T_keccak256(cardid, cardty,cardower);
let msghashBuf = Buffer.from(msghash.slice(2),'hex');
let privatekeyBuf = PrivateKey.privatekey;

let vsr = ethUtil.ecsign(msghashBuf,privatekeyBuf);

let v = vsr.v;
let s = '0x'+vsr.s.toString('hex');
let r = '0x' + vsr.r.toString('hex');

let contractInst = ContractMod.contractInstance;
/*
contractInst.createNtfCard.sendTransaction(cardid,cardty,cardower,v,r,s,{from:env.Man.Account, gas:3000000},function(error, result){
    if(error){
        console.log(error);
    }else{
        console.log(result);
    }
});
*/

let contractEvent = contractInst['CreateCard']({},{fromBlock:1,toBlock:'latest'});
//event CreateCard(uint256 tokenid,bytes24 cardid,  uint256 cardtype, uint256 nerror);
contractEvent.watch(function(err, result){
    if(!err){
        let tokenid = result.args.tokenid.toNumber();
        //let cardid = String.fromCharCode(result.args.cardid);
        let cardid = result.args.cardid.toString();
        let cardtype = result.args.cardtype.toNumber();
        let nerror = result.args.nerror.toNumber();
        console.log('result is :' );
        console.log('tokenid:' + tokenid);
        console.log('cardid:' + cardid);
        console.log(web3.toAscii(cardid));
        console.log('cardtype:' + cardtype);
        console.log('nerror:' + nerror);

    }

});




