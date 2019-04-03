package  main

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/accounts/keystore"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"io/ioutil"
	"log"
	"./config"
	"math/big"
	"./store"
)

func main(){
	config := config.ParseConfig()
	if(config == nil){
		fmt.Println("fail to parse config")
		return
	}

	client, err := ethclient.Dial(config.Chainhttp)
	if err != nil {
		log.Fatal(err)
	}

	keyjson, err := ioutil.ReadFile(config.Keystorefile)
	if err != nil {
		log.Fatal(err)
	}

	key, err := keystore.DecryptKey(keyjson,config.Password)
	if err != nil {
		log.Fatal(err)
	}

	privateKey := key.PrivateKey
	/*
	publicKey := privateKey.Public()
	publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
	if !ok {
		log.Fatal("cannot assert type: publicKey is not of type *ecdsa.PublicKey")
	}
	fromAddress := crypto.PubkeyToAddress(*publicKeyECDSA)

	*/
	fromAddress := common.HexToAddress(config.Account);
    nonce, err := client.PendingNonceAt(context.Background(), fromAddress)
	if err != nil {
		log.Fatal(err)
	}

	gasPrice, err := client.SuggestGasPrice(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	auth := bind.NewKeyedTransactor(privateKey)
	auth.Nonce = big.NewInt(int64(nonce))
	auth.Value = big.NewInt(0)
	auth.GasLimit = uint64(300000)
	auth.GasPrice = gasPrice

	input:= "1.0"
	address, tx, instance, err := store.DeployStore(auth,client,input)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(address.Hex())
	fmt.Println(tx.Hash().Hex())

	_ = instance









}