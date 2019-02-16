const createKeccakHash = require('keccak');
let fs = require('fs');
let leftPad = require('left-pad');
let env = require('./env.js');
let Web3 = require('web3');
let web3 = new Web3(new Web3.providers.HttpProvider(env.gwanUrl));

let events = require('events');
let cardBaseEmitter = new events.EventEmitter();

cardBaseEmitter.on('CreateCard',function(tokenid,cardid,  cardtype, nerror){
    console.log('in CreateCard ----------------------------------------------------------- 0');
	console.log(tokenid);
	console.log(cardid);
	console.log(cardtype);
	console.log(nerror);
});

cardBaseEmitter.on('SignEvent',function(hashv,singer, owner,cardid,cardtype){
    console.log('in SignEvent ------------------------------------------------------------ 1 ');
    console.log(hashv);
    console.log(singer);
    console.log(owner);
    console.log(cardid);
    console.log(cardtype);

});



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

let cardbasejosnfile = env.abifile;

let cardbasejosn = fs.readFileSync(cardbasejosnfile).toString();
let cardbasabi = JSON.parse(cardbasejosn).abi;

let cardBaseContract = web3.eth.contract(cardbasabi);
let cardBaseAddress = env.ContractAddr;

let cardBaseInst = cardBaseContract.at(cardBaseAddress);
let Man = env.Man;

//create card

let hashval = T_keccak256('56064886ade2f21f36b03134',10,Man.Account);

console.log(hashval);

web3.personal.unlockAccount(Man.Account,Man.Password);

let bb = web3.eth.sign(Man.Account,hashval);



cardBaseInst.createCard.sendTransaction("56064886ade2f21f36b03134",10,bb,{from:Man.Account, gas:300000},function(error, result){
	if(error){
		console.log(error);
		return;
	}
	console.log(result);

});

let eventcardBaseInfo = cardBaseInst["CreateCard"]({},{fromBlock:1, toBlock:'latest'});
eventcardBaseInfo.watch(function(error, result){
	if(!error){
		var tokenid = result.args.tokenid.toNumber();
		var cardid = result.args.cardid.toString();
		var cardtype = result.args.cardtype.toNumber();
		var nerror = result.args.nerror.toNumber();
		cardBaseEmitter.emit('CreateCard',tokenid, cardid, cardtype, nerror);

	}else {
		console.log(error);
	}
});

const eventSignInfo = cardBaseInst['SignEvent']({},{fromBlock:1, toBlock:'latest'});
eventSignInfo.watch(function(err, result){ //event SignEvent(bytes32 hashv, bytes singer, address owner, bytes24 cardid, uint256 cardtype);
    if(!err){
        var hashv = result.args.hashv.toString();
        var singer = result.args.singer.toString();
        var owner = result.args.owner.toString();
        var cardid = result.args.cardid.toString();
        var cardtype = result.args.cardtype.toNumber();
        cardBaseEmitter.emit('SignEvent', hashv,singer, owner,cardid,cardtype);
    }
});
