let env = require('./env');
const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(env.gwanUrl));


let abifile = env.abifile;
let contractaddr = env.ContractAddr;

let abiContent = fs.readFileSync(abifile).toString();

let abi = JSON.parse(abiContent).abi;
let OneContract = web3.eth.contract(abi);
let contractInstance = OneContract.at(contractaddr);

exports.contractInstance = contractInstance;