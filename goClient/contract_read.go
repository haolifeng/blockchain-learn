package main

import (
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"./config"
	"fmt"
	"github.com/miguelmota/ethereum-development-with-go-book/code/contracts"
	"log"
)

func main(){
	config := config.ParseConfig()
	if(config == nil){
		fmt.Println("fail to parse config")
		return
	}
	client, err := ethclient.Dial(config.Chainhttp)
	if err != nil {
		log.Fatal("Dial", err)
	}
	scaddr := common.HexToAddress(config.Scaddr)
	instance, err := store.NewStore(scaddr,client)
	if err != nil {
		log.Fatal("new store", err)
	}
	version, err := instance.Version(nil)
	if err != nil {
		log.Fatal("version", err)
	}

	fmt.Println("version is: ",version)

	key1 := [32]byte{}

	copy(key1[:],[]byte("foo3"))


	result, err := instance.Items(nil, key1)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("result is :",string(result[:]))
}