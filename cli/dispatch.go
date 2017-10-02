package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"

	"github.com/urfave/cli"
)

// exists returns whether the given file or directory exists or not
func exists(path string) (bool, error) {
	_, err := os.Stat(path)
	if err == nil {
		return true, nil
	}
	if os.IsNotExist(err) {
		return false, nil
	}
	return true, err
}

func dispatch(command string, flags *Flags) func(c *cli.Context) error {
	return func(c *cli.Context) error {
		var clientConfig ClientConfig
		clients := strings.Split(flags.client, ",")
		targets := strings.Split(flags.target, ",")
		file, err := filepath.Abs("./clients.json")
		if err != nil {
			fmt.Println(err)
			return cli.NewExitError("unable to locate clients.json", 5)
		}
		bytes, err := ioutil.ReadFile(file)
		if err != nil {
			fmt.Println(err)
			return cli.NewExitError("unable to read clients.json", 5)
		}
		err = json.Unmarshal(bytes, &clientConfig)
		if err != nil {
			fmt.Println(err)
			return cli.NewExitError("unable to parse clients.json", 6)
		}
		switch command {
		case "clean":
			return clean(c)
		case "build":
			return build(c, clients)
		case "deploy":
			return deploy(c)
		case "run":
			fmt.Printf("Running client: %s\n", clients[0])
			return run(c, clients[0])
		case "test":
			return test(c, clients)
		case "generate":
			return generate(clients, targets, &clientConfig)
		case "get":
			return get(&clientConfig)
		}
		return nil
	}
}
