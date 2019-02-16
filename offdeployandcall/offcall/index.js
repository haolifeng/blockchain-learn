const env = require('./env');

const Tx = require('ethereumjs-tx');

const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(env.blockchainurl));
const keythereum = require('keythereum');

//1 get private key from keystore file

const keystoreFileContent = fs.readFileSync(env.keystorefile).toString();

const keystore = JSON.parse(keystoreFileContent);
const keyObje = {version: keystore.version, crypto:keystore.crypto};

const privatekey = keythereum.recover(env.Man.passwd,keyObje);

//2 get abi from abj json file

const abifileContent = fs.readFileSync(env.abifile).toString();
const abifileContentObj = JSON.parse(abifileContent);
const abi=abifileContentObj.abi;


//3 constract instance and get payload data
const constract = web3.eth.contract(abi).at(env.scaddr);

let payloadData = constract.SetNum.getData.apply(null,[1200, 2400]);

//4 get nonce

let gasPrice = web3.eth.gasPrice;
let gasPriceHex = web3.toHex(gasPrice);
let gasLimitHex = web3.toHex(3500000);

let nonce = web3.eth.getTransactionCount(env.Man.address,'pending');
let nonceHex = web3.toHex(nonce);

//5 construct raw transaction

let rawTx = {
    nonce: nonceHex,
    gasPrice: gasPriceHex,
    gasLimit: gasLimitHex,
    to: env.scaddr,
    from: env.Man.address,
    value: '0x00',
    data: payloadData
};
//6 send RawTransaction
let tx = new Tx(rawTx);
tx.sign(privatekey);
let serializedTx = tx.serialize();

let serializedData = '0x' + serializedTx.toString('hex'); //

web3.eth.sendRawTransaction(serializedData, function(err, hash){
    if(err){
        console.log('Error:');
        console.log(err);
    }
    else {
        console.log('Transaction receipt hash pending');
        console.log(hash);
    }
});
