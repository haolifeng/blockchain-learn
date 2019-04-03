package main
import (
	"./config"
	"context"
	"crypto/ecdsa"
	"fmt"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/accounts/keystore"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"io/ioutil"
	"log"
	"math/big"
	"./store"
	"time"
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


	publicKey := privateKey.Public()
	publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
	if !ok {
		log.Fatal("cannot assert type: publicKey is not of type *ecdsa.PublicKey")
	}
	fromAddress := crypto.PubkeyToAddress(*publicKeyECDSA)
	/*fromAddress := common.HexToAddress(config.Account);*/

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

	scaddress := common.HexToAddress(config.Scaddr)
	instance, err := store.NewStore(scaddress,client)
	if err != nil {
		log.Fatal(err)
	}

	key1 := [32]byte{}
	value := [32]byte{}
	copy(key1[:],[]byte("foo4"))
	copy(value[:],[]byte("bar-haolifeng-good-1"))

	tx, err := instance.SetItem(auth, key1,value)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("tx sent: %s\n", tx.Hash().Hex())

	time.Sleep(5 * time.Second)

	result, err := instance.Items(nil, key1)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("result is :",string(result[:]))

}