# 1 下载代码
git clone https://github.com/ethereum/go-ethereum.git
# 2 编译
cd go-ethereum

make geth

mv  build/bin/geth  ~/Gopath/bin //Gopath/bin需要添加到PATH中。

# 3 创建操作目录
mkdir ～/BlockChain
cd ~/BlockChain

# 4 准备genesis.json文件
以下操作都在~/BlockChain

```
{
  "config": {
    "chainId": 1000,  //该chainId一定不要用0
    "homesteadBlock": 0,
    "ByzantiumBlock":0,
    "eip155Block": 0,
    "eip158Block": 0
  },
  "alloc": {},
  "coinbase": "0x0000000000000000000000000000000000000000",
  "difficulty": "0x20000",
  "extraData": "",
  "gasLimit": "0x2fefd8",
  "nonce": "0x0000000000000042",
  "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "timestamp": "0x00"
}
```
# 5 初始化文件init.sh

```
#!/bin/sh
geth --datadir ./data init ./genesis.json
```

# 6 启动脚本start.sh

```
#!/bin/sh
geth --datadir ./data --rpc --rpcapi "db,eth,net,web3" console
```

# 7 attach 脚本attach.sh
```
#!/bin/sh
geth attach ./data/geth.ipc
```
# 8 操作步骤
## 8.1 初始化
```
sh  init.sh


INFO [06-22|16:40:44.268] Bumping default cache on mainnet         provided=1024 updated=4096
WARN [06-22|16:40:44.268] Sanitizing cache to Go's GC limits       provided=4096 updated=2650
INFO [06-22|16:40:44.273] Maximum peer count                       ETH=50 LES=0 total=50
INFO [06-22|16:40:44.273] Smartcard socket not found, disabling    err="stat /run/pcscd/pcscd.comm: no such file or directory"
INFO [06-22|16:40:44.278] Allocated cache and file handles         database=/home/hlf/Eth/data/geth/chaindata cache=16.00MiB handles=16
INFO [06-22|16:40:44.294] Writing custom genesis block
INFO [06-22|16:40:44.294] Persisted trie from memory database      nodes=0 size=0.00B time=4.541µs gcnodes=0 gcsize=0.00B gctime=0s livenodes=1 livesize=0.00B
INFO [06-22|16:40:44.295] Successfully wrote genesis state         database=chaindata                         hash=b052b0…1553c1
INFO [06-22|16:40:44.295] Allocated cache and file handles         database=/home/hlf/Eth/data/geth/lightchaindata cache=16.00MiB handles=16
INFO [06-22|16:40:44.299] Writing custom genesis block
INFO [06-22|16:40:44.300] Persisted trie from memory database      nodes=0 size=0.00B time=5.06µs  gcnodes=0 gcsize=0.00B gctime=0s livenodes=1 livesize=0.00B
INFO [06-22|16:40:44.301] Successfully wrote genesis state         database=lightchaindata                         hash=b052b0…1553c1
```
## 8.2 启动

```
sh  start.sh

INFO [06-22|16:44:16.333] Bumping default cache on mainnet         provided=1024 updated=4096
WARN [06-22|16:44:16.333] Sanitizing cache to Go's GC limits       provided=4096 updated=2650
INFO [06-22|16:44:16.337] Maximum peer count                       ETH=50 LES=0 total=50
INFO [06-22|16:44:16.337] Smartcard socket not found, disabling    err="stat /run/pcscd/pcscd.comm: no such file or directory"
INFO [06-22|16:44:16.341] Starting peer-to-peer node               instance=Geth/v1.9.0-unstable-cdadf57b-20190621/linux-amd64/go1.12.1
INFO [06-22|16:44:16.341] Allocated trie memory caches             clean=662.00MiB dirty=662.00MiB
INFO [06-22|16:44:16.341] Allocated cache and file handles         database=/home/hlf/Eth/data/geth/chaindata cache=1.29GiB handles=524288
INFO [06-22|16:44:16.373] Opened ancient database                  database=/home/hlf/Eth/data/geth/chaindata/ancient
INFO [06-22|16:44:16.374] Initialised chain configuration          config="{ChainID: 168 Homestead: 0 DAO: <nil> DAOSupport: false EIP150: <nil> EIP155: 0 EIP158: 0 Byzantium: 0 Constantinople: <nil>  ConstantinopleFix: <nil> Engine: unknown}"
INFO [06-22|16:44:16.374] Disk storage enabled for ethash caches   dir=/home/hlf/Eth/data/geth/ethash count=3
INFO [06-22|16:44:16.374] Disk storage enabled for ethash DAGs     dir=/home/hlf/.ethash              count=2
INFO [06-22|16:44:16.374] Initialising Ethereum protocol           versions="[63 62]" network=1 dbversion=<nil>
WARN [06-22|16:44:16.374] Upgrade blockchain database version      from=<nil> to=7
INFO [06-22|16:44:16.604] Loaded most recent local header          number=0 hash=b052b0…1553c1 td=1024 age=50y2mo1w
INFO [06-22|16:44:16.604] Loaded most recent local full block      number=0 hash=b052b0…1553c1 td=1024 age=50y2mo1w
INFO [06-22|16:44:16.604] Loaded most recent local fast block      number=0 hash=b052b0…1553c1 td=1024 age=50y2mo1w
INFO [06-22|16:44:16.604] Regenerated local transaction journal    transactions=0 accounts=0
INFO [06-22|16:44:16.648] Allocated fast sync bloom                size=1.29GiB
INFO [06-22|16:44:16.649] Initialized fast sync bloom              items=0 errorrate=0.000 elapsed=73.146µs
INFO [06-22|16:44:16.659] New local node record                    seq=1 id=20f4b0e41435a4b5 ip=127.0.0.1 udp=30303 tcp=30303
INFO [06-22|16:44:16.659] Started P2P networking                   self=enode://d9d5a44c4349e742b6d321baf9a4898da53faddb2b7a58fb3c73a42fdcd1a35335c3601b998191f9e9e80cf9fc5364d4cd466182487db6f172ed616c7b139feb@127.0.0.1:30303
INFO [06-22|16:44:16.662] IPC endpoint opened                      url=/home/hlf/Eth/data/geth.ipc
INFO [06-22|16:44:16.663] HTTP endpoint opened                     url=http://127.0.0.1:8545       cors= vhosts=localhost
WARN [06-22|16:44:16.849] Served eth_coinbase                      reqid=3 t=15.261µs err="etherbase must be explicitly specified"
Welcome to the Geth JavaScript console!

instance: Geth/v1.9.0-unstable-cdadf57b-20190621/linux-amd64/go1.12.1
at block: 0 (Thu, 01 Jan 1970 08:00:00 CST)
 datadir: /home/hlf/Eth/data
 modules: admin:1.0 debug:1.0 eth:1.0 ethash:1.0 miner:1.0 net:1.0 personal:1.0 rpc:1.0 txpool:1.0 web3:1.0

> INFO [06-22|16:44:19.246] New local node record                    seq=2 id=20f4b0e41435a4b5 ip=125.35.95.94 udp=53924 tcp=30303

> --- 进入控制台，在这里输入控制台命令操作和查看区块链

```
## 8.3 attach
在另一命令行界面执行如下命令：
```
sh attach.sh

INFO [06-22|16:48:19.804] Bumping default cache on mainnet         provided=1024 updated=4096
WARN [06-22|16:48:19.805] Sanitizing cache to Go's GC limits       provided=4096 updated=2650
Welcome to the Geth JavaScript console!

instance: Geth/v1.9.0-unstable-cdadf57b-20190621/linux-amd64/go1.12.1
at block: 0 (Thu, 01 Jan 1970 08:00:00 CST)
 datadir: /home/hlf/Eth/data
 modules: admin:1.0 debug:1.0 eth:1.0 ethash:1.0 miner:1.0 net:1.0 personal:1.0 rpc:1.0 txpool:1.0 web3:1.0

> --- 进入控制台，在这里输入控制台命令操作和查看区块链

```
# 9 操作
在启动后，链上没有账户，第一步就是创建账户，并设置该账户为矿工。使用该矿工开始挖矿

# 9.1 创建账户
```
personal.newAccount('123456'); // --- 123456为密码
```
# 9.2 查看账户
```
eth.accounts
```
# 9.3 设置矿工

```
miner.setEtherbase(eth.accounts[0])
```

# 9.4 挖矿
```
miner.start()
```

# 10 总结

可以编写智能合约了
