package main

import "fmt"

func get(clientConfig *ClientConfig) error {
	var str string
	for i := 0; i < len(clientConfig.Clients); i++ {
		str += clientConfig.Clients[i].Name
	}
	fmt.Printf(str)
	return nil
}
