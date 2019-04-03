package config

import (
	"fmt"

	"testing"
)

func TestParseConfig(t *testing.T) {
	gc := ParseConfig()

	fmt.Println(gc.Password)

}