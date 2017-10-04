package main

import (
	"fmt"
	"os"
	"os/exec"

	"github.com/urfave/cli"
)

func deploy(c *cli.Context, clients []string, targets []string) error {
	platform := c.Args().Get(0)
	switch platform {
	case "k8s":
		for _, c := range clients {
			for _, t := range targets {
				kubeApplyCmd := exec.Command("kubectl", "apply", "-f", fmt.Sprintf("./client/builds/%s/kube/%s", c, t))
				kubeApplyCmd.Stdout = os.Stdout
				kubeApplyCmd.Stderr = os.Stderr
				if err := kubeApplyCmd.Start(); err != nil {
					return cli.NewExitError("Unable to start kubectl", 47)
				}
				if err := kubeApplyCmd.Wait(); err != nil {
					return cli.NewExitError(fmt.Sprintf("Error running kubectl apply -f ./client/builds/%s/kube/%s", c, t), 48)
				}
			}
		}
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
	case "docker":
		for _, c := range clients {
			os.Setenv("CLIENT", c)
			if err := runMake(c, "client-docker-push-ecr"); err != nil {
				return err
			}
		}
	default:
		return cli.NewExitError("Unrecognized platform", 4)
	}
	return nil
}
