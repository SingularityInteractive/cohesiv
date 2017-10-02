package main

import (
	"fmt"
	"os"
	"os/exec"

	"github.com/urfave/cli"
)

func performGradleTask(task string) error {
	cmd := exec.Command("./gradlew", fmt.Sprintf(":app:%s", task))
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Dir = "client/app/android"
	err := cmd.Start()
	if err != nil {
		return cli.NewExitError(fmt.Sprintf("Start %s for android failed", task), 15)
	}
	err = cmd.Wait()
	if err != nil {
		return cli.NewExitError(fmt.Sprintf("%s for android failed", task), 16)
	}
	fmt.Printf("Android %s finished\n", task)
	return nil
}
