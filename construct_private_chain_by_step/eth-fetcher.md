# eth fetcher
## announce 
announce表示一个hash通知，说明网络上有合适的新区块出现
```
type announce struct {
    hash common.Hash  //新区块的hash
    number uint64 //新区块的高度值
    header *types.Header //重新组装的区块头
    time time.Time // 声明的时间

    origin string //
    fetchHeader headerRequesterFn // 获取区块头的函数指针，里面包含了peer的信息
    fetchBodies bodyRequesterFn // 获取区块体的函数
}
```
## headerFilterTask 
需要获取过滤的一批header
```
type headerFilterTask struct {
    peer string   //块头的源对手端
    headers []*types.Header  //要过滤的head的集合
    time   time.Time  //header到达时间
}
```
## bodyFilterTask, 同headerFilterTask
```
 bodyFilterTask struct {
    peer string
    transactions [][]*types.Transaction
    uncles [][]*types.Header
    time  time.Time
}
```
## inject
表示一个规划的导入操作
```
type inject struct {
    origin string
    block *types.Block
}
```
## Fetcher
负责从各个对手端收集accounts并做规划取回
```
type Fetcher struct {
    notify chan *announce   //接收新块
    inject chan *inject

    blockFilter chan chan []*types.Block
    headerFilter chan chan *headerFilterTask
    bodyFilter chan chan* bodyFilterTask

    done chan common.Hash
    quit chan struct{}

    announces map[string]int //每个对手端announce的数量避免内存耗尽
    announced map[common.Hash][]*announce //已经声明的块，做好了fetching计划
    fetching map[common.Hash]*announce //已经声明的块，正在fetching
    fetched map[common.Hash][]*announce //头部已经获取的块，做好body规划获取
    completing map[common.Hash]*announce // 头部已经获取的块，当前完成body

    queue *prque.Prque  //队列包含导入操作（块号排序）
    queues map[string]int //每一个对端块数量，避免内存耗尽
    queued map[common.Hash]* inject // 已经放入队列的区块。为了去重

    getBlock  blockRetrievalFn //从本地链中恢复一个块
    verifyHeader headerVerifierFn //检查一个块的头部是否有一个合法的工作量证明
    broadcastBlock blockBroadcasterFn // 广播一个块到连接的对手端
    chainHeight  chainHeightFn //获取当前块的高度
    insertChain  chainInsertFn //注入一批块到链
    dropPeer  peerDropFn //因为错误行为删除对手端

     // Testing hooks  仅供测试使用。
	announceChangeHook func(common.Hash, bool) // Method to call upon adding or deleting a hash from the announce list
	queueChangeHook    func(common.Hash, bool) // Method to call upon adding or deleting a block from the import queue
	fetchingHook       func([]common.Hash)     // Method to call upon starting a block (eth/61) or header (eth/62) fetch
	completingHook     func([]common.Hash)     // Method to call upon starting a block body fetch (eth/62)
	importedHook       func(*types.Block)      // Method to call upon successful block import (both eth/61 and eth/62)


}
```

