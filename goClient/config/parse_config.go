package config

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
)

type Config struct {
	Account  string `json:"account"`
	Password string `json:"password"`
	Keystorefile string `json:"keystorefile"`
	Scaddr string `json:"scaddr"`
	Schash string `json:"schash"`
	Chainhttp string `json:"chainhttp"`
}

func ParseConfig() *Config {
	data, err :=ioutil.ReadFile("./config/config.json")
	if err != nil {
		fmt.Println("failt to read config.json", err)
		return nil
	}
	gc :=Config{}

	err = json.Unmarshal(data,&gc)
	if err != nil {
		fmt.Println("fail to Unmarshal", err)
		return nil
	}
	return &gc
}