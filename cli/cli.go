package main

import (
	"os"

	"github.com/urfave/cli"
)

// Flags are passed to the cli and used as global config variables
type Flags struct {
	client string
	target string
}

const BUNDLE_IDENTIFIER string = "com.github.SingularityInteractive"

var flags Flags

func main() {
	app := cli.NewApp()
	app.Name = "cohesiv"
	app.Version = VERSION
	app.Usage = "Add clients, generate build configurations, perform builds, run tests, deploy infrastructure and apps."
	app.Flags = []cli.Flag{
		cli.StringFlag{
			Name:        "clients, c",
			Value:       "cohesiv",
			Usage:       "Use client(s), comma separated",
			Destination: &flags.client,
		},
		cli.StringFlag{
			Name:        "targets, t",
			Value:       "develop",
			Usage:       "Development target (develop, staging, master)",
			Destination: &flags.target,
		},
	}
	app.Commands = []cli.Command{
		{
			Name:    "clean",
			Aliases: []string{"c"},
			Usage:   "Clean cohesiv",
			Action:  dispatch("clean", &flags),
		},
		{
			Name:    "build",
			Aliases: []string{"b"},
			Usage:   "Build cohesiv",
			Action:  dispatch("build", &flags),
		},
		{
			Name:    "deploy",
			Aliases: []string{"d"},
			Usage:   "Deploy cohesiv",
			Action:  dispatch("deploy", &flags),
		},
		{
			Name:    "run",
			Aliases: []string{"r"},
			Usage:   "Run cohesiv",
			Action:  dispatch("run", &flags),
		},
		{
			Name:    "test",
			Aliases: []string{"t"},
			Usage:   "Test cohesiv",
			Action:  dispatch("test", &flags),
		},
		{
			Name:    "generate",
			Aliases: []string{"g"},
			Usage:   "Generate client deployment files",
			Action:  dispatch("generate", &flags),
		},
		{
			Name:    "new",
			Aliases: []string{"n"},
			Usage:   "Create new client",
			Action:  dispatch("new", &flags),
		},
		{
			Name:   "get",
			Usage:  "Get all clients",
			Action: dispatch("get", &flags),
		},
	}
	app.Run(os.Args)
}
