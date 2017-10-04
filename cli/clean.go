package main

import (
	"fmt"
	"os"
	"os/exec"

	"github.com/urfave/cli"
)

func clean(c *cli.Context) error {
	platform := c.Args().Get(0)
	switch platform {
	case "android":
		if err := performGradleTask("clean"); err != nil {
			return err
		}
	case "ios":
		podCmd := exec.Command("pod", "install")
		podCmd.Stdout = os.Stdout
		podCmd.Stderr = os.Stderr
		podCmd.Dir = "client/app/ios"
		err := podCmd.Start()
		if err != nil {
			return cli.NewExitError("Start pod install failed", 21)
		}
		err = podCmd.Wait()
		if err != nil {
			return cli.NewExitError("Pod install failed", 22)
		}
		fmt.Println("Pod install finished")
		cleanCmd := exec.Command("xcodebuild", "-sdk", "iphonesimulator", "-destination", "platform=iOS Simulator,name=iPhone 8", "-derivedDataPath", "build", "-configuration", "Debug", "-workspace", "cohesiv.xcworkspace", "-scheme", "cohesiv", "clean")
		cleanCmd.Stdout = os.Stdout
		cleanCmd.Stderr = os.Stderr
		cleanCmd.Dir = "client/app/ios"
		err = cleanCmd.Start()
		if err != nil {
			return cli.NewExitError("Start iOS build failed", 23)
		}
		err = cleanCmd.Wait()
		if err != nil {
			return cli.NewExitError("iOS build failed", 24)
		}
		fmt.Println("iOS clean finished")
	default:
		return cli.NewExitError("Clean is not configured for this platform", 57)
	}
	return nil
}
