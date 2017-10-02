package main

import (
	"os"
	"os/exec"

	"github.com/urfave/cli"
)

func runClientNpmScript(script string) error {
	cmd := exec.Command("npm", "run", script)
	cmd.Dir = "client"
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	err := cmd.Start()
	if err != nil {
		return cli.NewExitError("Unable to start process", 45)
	}
	err = cmd.Wait()
	if err != nil {
		return cli.NewExitError("Error while running process", 46)
	}
	return nil
}
