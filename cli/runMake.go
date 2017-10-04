package main

import (
	"fmt"
	"os"
	"os/exec"

	"github.com/urfave/cli"
)

func runMake(client string, command string) error {
	makeCmd := exec.Command("make", command)
	makeCmd.Stdout = os.Stdout
	makeCmd.Stderr = os.Stderr
	err := makeCmd.Start()
	if err != nil {
		return cli.NewExitError("Start make failed", 23)
	}
	err = makeCmd.Wait()
	if err != nil {
		return cli.NewExitError(fmt.Sprintf("Make %s failed", command), 24)
	}
	return nil
}
