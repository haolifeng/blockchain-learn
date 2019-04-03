package main

import (
	"./config"
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/core/types"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)


func main(){
	config := config.ParseConfig()
	if(config == nil){
		fmt.Println("fail to parse config")
		return
	}
	//client, err := ethclient.Dial(config.Chainhttp)
	client, err :=ethclient.Dial("ws://127.0.0.1:8546")  //geth要启动websocket服务--ws --wsport
	if err != nil {
		fmt.Println("err dial ",err)
		return
	}
	contractAddress := common.HexToAddress(config.Scaddr)
	query := ethereum.FilterQuery{
		Addresses:[]common.Address{contractAddress},
	}
	logs := make(chan types.Log)
	sub, err := client.SubscribeFilterLogs(context.Background(),query, logs)
	if err != nil {
		fmt.Println("err subscribe: ", err)
		return
	}
	for {
		select {
			case err := <-sub.Err():
				fmt.Println("in select ",err)
			case vLog:=<-logs:
				fmt.Println("vLog",vLog) //还要自己解析
		}
	}
}