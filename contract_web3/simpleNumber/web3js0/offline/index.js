const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

const env = require('./env');

const privateKeyModule = require('./privatekey');
const privateKey = privateKeyModule.privatekey;

const contractInstModule = require('./contractinstance');
const contractInst = contractInstModule.contractInstance;

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

let paras = 123;

let payloadData = contractInst["SetNum"].getData.apply(null,[paras]);
let gasPrice = web3.eth.gasPrice;
let gasPriceHex = web3.toHex(gasPrice);
let gasLimitHex = web3.toHex(300000);

let nonce = web3.eth.getTransactionCount(env.Man.Account,'pending');
let nonceHex = web3.toHex(nonce);

var rawTx = {
	nonce: nonceHex,
	gasPrice: gasPriceHex,
	gasLimit: gasLimitHex,
	to:env.ContractAddr,
	from: env.Man.Account,
	value: '0x00',
	data: payloadData

}

var tx = new Tx(rawTx);
tx.sign(privateKey);
var serializedTx = tx.serialize();

web3.eth.sendRawTransaction('0x'+serializedTx.toString('hex'), function(err, hash){
	if(err){
		console.log('Error:');
		console.log(err);
	}
	else{
		console.log('Transaction receipt hash pending');
		console.log(hash);
	}
});


