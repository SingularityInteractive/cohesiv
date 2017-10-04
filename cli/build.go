package main

import (
	"os"

	"github.com/urfave/cli"
)

func build(c *cli.Context, clients []string) error {
	platform := c.Args().Get(0)
	switch platform {
	case "server":
		for _, c := range clients {
			os.Setenv("CLIENT", c)
			err := runMake(c, "copy-client-build-files")
			if err != nil {
				return err
			}
			err = runClientNpmScript("build:server")
			if err != nil {
				return err
			}
		}
		break
	case "web":
		for _, c := range clients {
			os.Setenv("CLIENT", c)
			err := runMake(c, "copy-client-build-files")
			if err != nil {
				return err
			}
			err = runClientNpmScript("build:web")
			if err != nil {
				return err
			}
		}
		break
	case "android":
		if err := performGradleTask("assembleRelease"); err != nil {
			return err
		}
	case "ios":
		return cli.NewExitError("iOS release build has not yet been configured", 58)
	case "docker":
		for _, c := range clients {
			os.Setenv("CLIENT", c)
			err := runMake(c, "client-docker-image")
			if err != nil {
				return err
			}
		}
		break
	default:
		for _, c := range clients {
			os.Setenv("CLIENT", c)
			err := runMake(c, "copy-client-build-files")
			if err != nil {
				return err
			}
			err = runClientNpmScript("build:server")
			if err != nil {
				return err
			}
			err = runClientNpmScript("build:web")
			if err != nil {
				return err
			}
		}
		break
	}
	return nil
}