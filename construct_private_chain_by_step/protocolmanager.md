# ProtocolManager 
```
type ProtocolManager struct {
    newworkID uint64
    fastSync uint32
    acceptTxs uint32
    
    checkpointNumber uint64
    checkpointHash common.Hash

    txpool txPool
    blockchain *core.BlockChain
    maxPeers int

    downloader *downloader.Downloader
    fetcher *fetcher.Fetcher
    peers *peerSet

    eventMux *event.TypeMux
    txsCh chan core.NewTxsEvent
    txsSub event.Subscription
    whitelist map[uint64]common.Hash

    newPeerCh chan* peer
    txsyncCh chan *txsync
    quitSync chan struct{}
    noMorePeers chan struct{}

    wg sync.WaitGroup
}
```

# protocolManager Start

```
func (pm *ProtoclManager) Start(maxPeers int){
    pm.maxPeers = maxPeers
    //broadcast transactions

    pm.txsCh = make(chan core.NewTxsEvent, txChanSize) //新交易事件
    pm.txsSub = pm.txpool.SubscribeNewTxsEvent(pm.txsCh) //
    go pm.txBroadcastLoop()  //用于广播新的交易

    pm.minedBlockSub = pm.eventMux.Subscribe(core.NewMineBlockEvent{})
    go pm.minedBroadcastLoop() //用于广播挖矿出的块

    go pm.syncer() // 块同步
    go pm.txsyncLoop() //交易同步，交易在内存中

}
```