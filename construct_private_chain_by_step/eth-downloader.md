# eth-downloader
```
type Downloader struct {
    rttEstimate uint64
    rttConfidence uint64

    mode SyncMode
    mux *event.TypeMux

    checkpoint uint64
    genesis uint64
    queue *queue
    peers *peerSet

    stateDB  ethdb.Database
    stateBloom *trie.SyncBloom

    syncStatsChainOrigin uint64
    syncStatsChainHeight uint64
    syncStatsState stateSyncStates
    syncStatesLock sync.RWMutex

    lightchain LightChain
    blockchain BlockChain

    dropPeer peerDropFn

    synchroniseMock func(id string, hash common.Hash) error
    synchronising int32
    notified int32
    committed int32
    ancientLimit uint64

    headerCh chan dataPack
    bodyCh chan dataPack
    receiptCh chan dataPack
    bodyWakeCh chan bool
    receiptWakeCh chan bool
    headerProch chan []*types.Header

    stateSyncStart chan* stateSync
    trackStateReq chan *stateReq
    stateCh chan dataPack

    cancelPeer string
    cancelCh chan struct{}
    cancelLock sync.RWMutex
    cancelWG  sync.WaitGroup

    quitCh chan struct{}
    quitLock sync.RWMutex

    syncInitHook func(uint64, uint64)
    bodyFetchHook func([]*types.Header)
    receiptFetchHook func([]*types.Header)
    chainInsertHook func([]*fetchResult)
}
```
