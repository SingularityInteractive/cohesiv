package main

import (
	"os"

	"github.com/urfave/cli"
)

func test(c *cli.Context, clients []string) error {
	platform := c.Args().Get(0)
	switch platform {
	case "server":
		for _, c := range clients {
			os.Setenv("CLIENT", c)
			err := runClientNpmScript("test:server")
			if err != nil {
				return err
			}
		}
		break
	case "web":
		for _, c := range clients {
			os.Setenv("CLIENT", c)
			err := runClientNpmScript("test:web")
			if err != nil {
				return err
			}
		}
		break
	case "android":
		break
	case "ios":
		break
	default:
		for _, c := range clients {
			os.Setenv("CLIENT", c)
			err := runClientNpmScript("test")
			if err != nil {
				return err
			}
		}
		break
	}
	return nil
}
