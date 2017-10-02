package main

import (
	"fmt"
	"os"
	"os/exec"

	"github.com/urfave/cli"
)

func startAndroidApp(client string) error {
	runCmd := exec.Command("adb", "shell", "am", "start", "-n", fmt.Sprintf("%s.%s/%s.cohesiv.MainActivity", BUNDLE_IDENTIFIER, client, BUNDLE_IDENTIFIER))
	runCmd.Stdout = os.Stdout
	runCmd.Stderr = os.Stderr
	err := runCmd.Start()
	if err != nil {
		return cli.NewExitError("Start running on android failed", 19)
	}
	err = runCmd.Wait()
	if err != nil {
		return cli.NewExitError("Run on android failed", 20)
	}
	fmt.Println("Run on Android success")
	return nil
}
