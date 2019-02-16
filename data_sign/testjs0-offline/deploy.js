let env = require('./env');
const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
console.log(env.gWanUrl);
const web3 = new Web3(new Web3.providers.HttpProvider(env.gWanUrl));

const offlinesdk = require('./offlinesdk');

const cardBasefile = fs.readFileSync(env.contractSourceDir+'CardBase.sol');
const ERC721file = fs.readFileSync(env.contractSourceDir+'ERC721.sol');
const LibSignDecodefile = fs.readFileSync(env.contractSourceDir +'LibSignDecode.sol');

let input = {
    language:'Solidity',
    sources:{
        'CardBase.sol':{
            content:""
        },
        'ERC721.sol':{
            content:""
        },
        'LibSignDecode.sol':{
            content:""
        }
    },
    settings:{
        outputSelection:{
            '*':{
                '*':[ '*' ]
            }
        }
    }
};

input["sources"]["CardBase.sol"]["content"] = cardBasefile.toString();
input["sources"]["ERC721.sol"]["content"] = ERC721file.toString();
input["sources"]["LibSignDecode.sol"]["content"] = LibSignDecodefile.toString();

//var output = solc.compile({sources:input},1);
var outputstr = solc.compile(JSON.stringify(input));
//console.log(outputstr);
var output = JSON.parse(outputstr);
console.log(output);
const abi = output.contracts['CardBase.sol']['CardBase'].abi;

//console.log(abi);

console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');

const bytecode = output.contracts['CardBase.sol']['CardBase']["evm"].bytecode.object;
//console.log(bytecode);


const keystoreContent = fs.readFileSync(env.privateKeyfile).toString();
const olsdk = new offlinesdk();
olsdk.loadWalletFile(keystoreContent,"123456");


var nonce_map={};
if (fs.existsSync('./nonce')) {
    try {
        let noncedata = fs.readFileSync('./nonce');
        if (noncedata) {
            nonce_map = JSON.parse(noncedata);
        }
    } catch (error) {

    }

}

function getNonce(web3, address) {
    // if (!utils.isStrictAddress(address)) {
    //     throw "addresss invalid"
    // }
    //var nonce = web3.eth.getTransactionCount(address);
    var nonce = web3.eth.getTransactionCount(address,'pending');
   /* try {
        var txpoolContent = web3.currentProvider.send({
            method: "txpool_content",
            params: [],
            jsonrpc: "2.0",
            id: new Date().getTime()
        })
        console.log("nonce *:" + nonce);
        if (txpoolContent && txpoolContent.result && txpoolContent.result.pending) {
            var keys = Object.keys(txpoolContent.result.pending);
            var totalCount = keys.length;
            console.log("keys.length *:" + totalCount);
            for (var i = 0; i < totalCount; i++) {
                if (keys[i].toLowerCase() == address.toLowerCase()) {
                    nonce += Object.values(txpoolContent.result.pending[keys[i]]).length;
                    console.log("nonce ->:" + nonce);
                    break;
                }
            }
        }
    } catch (error) {
        //console.error(error.message);
        //console.error(error);
        //fs.writeFileSync('./error.txt',error.message+'\n'+error.stack);
    }*/
    // if (nonce <= nonce_map[address]) {
    //     nonce = nonce_map[address] + 1;
    // }
    // nonce_map[address] = nonce;
    // fs.writeFileSync('./nonce', JSON.stringify(nonce_map));
    // console.log("before return get nonce");
    return nonce;
}


function deploy_contract_by_offline(contract_compilered_output, args, web3, wallet, gas, gasLimit, callback) {
    const instanceContract = web3.eth.contract(contract_compilered_output.abi);
    args.push({ data: contract_compilered_output.evm.bytecode.object });
    let txdata = '0x' + instanceContract.new.getData.apply(null, args);
    let tx = {
        Txtype: '0x01',
        nonce: getNonce(web3, wallet.address),
        gas: gas,
        gasPrice: 180000000000,
        gasLimit: gasLimit,
        to: '',
        from: wallet.address,
        value: '0x00',
        data: txdata,
    }
    let result = wallet.signTx(JSON.stringify(tx));
    console.assert(result.err === '');
    return web3.eth.sendRawTransaction(result.signtx, callback);
}

deploy_contract_by_offline(output.contracts['CardBase.sol']['CardBase'],[],web3,olsdk,3000000,3000000,function(err, res){
    if(err){
        console.log(err);
        return;
    }
    let reception = web3.eth.getTransactionReceipt(res);
    while(reception === null) {
        reception = web3.eth.getTransactionReceipt(res);
    }
    if(reception){
        console.log('Contract address: ' + reception.contractAddress);
        console.log('deploy contract, reception:\n', reception);
    }
});






