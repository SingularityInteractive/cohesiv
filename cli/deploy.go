package main

import (
	"fmt"
	"os"
	"os/exec"

	"github.com/urfave/cli"
)

func deploy(c *cli.Context) error {
	platform := c.Args().Get(0)
	switch platform {
	case "server":
		fmt.Println("In order to deploy to server, please make a pull request into staging, and then staging into master (production)")
		break
	case "web":
		fmt.Println("In order to deploy to web, please make a pull request into staging, and then staging into master (production)")
		break
	case "ios":
		fallthrough
	case "android":
		expPublish := exec.Command("exp", "publish")
		expPublish.Dir = "client/app"
		expPublish.Stdout = os.Stdout
		expPublish.Stderr = os.Stderr
		expPublish.Start()
		expPublish.Wait()
		break
	default:
		return cli.NewExitError("Unrecognized platform", 4)
	}
	return nil
}
