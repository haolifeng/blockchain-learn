package config

import (
	"fmt"
)

type Server struct {
	XMLName    xml.Name `xml:"server"`
	ServerType string   `xml:"servertype"`
	ServerId   string   `xml:"serverid"`
}
type Item struct {
	XMLName   xml.Name `xml:"item"`
	Param_grp string   `xml:"param_grp"`
	Interval  string   `xml:"interval"`
}
type Cycle struct {
	XMLName  xml.Name `xml:"cycle"`
	Interval int      `xml:"interval,attr"`
	Items    []Item   `xml:"item"`
}
type Proxy struct {
	XMLName  xml.Name `xml:"proxy"`
	server   Server   `xml:"server"`
	cycle    Cycle    `xml:"cycle"`
	facility int      `xml:"facility"`
}
