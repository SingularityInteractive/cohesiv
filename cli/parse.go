package main

import (
	"github.com/urfave/cli"
)

// func parseGitTag(tag string) ([]string, []string) {
// 	if tag == "" {
// 		return nil, nil
// 	}
// 	tagParts := strings.Split(tag, "-")
// 	clientsPart, exists := tagParts[0]
// 	return nil, nil
// }

func parse(c *cli.Context) error {
	platform := c.Args().Get(0)
	switch platform {
	case "tag":
		// TODO Parse a circle tag and run build/deploy scripts for tag
		return cli.NewExitError("parse tag is not yet implemented", 58)
		// clients, targets := parseGitTag(os.Getenv("CIRCLE_TAG"))
		// if clients == nil {
		// 	return cli.NewExitError("No clients found in CIRCLE_TAG env var", 58)
		// }
	}
	return nil
}
