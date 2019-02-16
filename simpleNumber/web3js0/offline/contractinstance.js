const env = require('./env');
const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(env.gwanUrl));

const abifile = env.abifile;
const contractAddr = env.ContractAddr;
let abiContent = fs.readFileSync(abifile).toString();
let abi = JSON.parse(abiContent).abi;
let contractInstance = web3.eth.contract(abi).at(contractAddr);

exports.contractInstance = contractInstance;