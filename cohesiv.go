package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/urfave/cli"
	"gopkg.in/yaml.v2"
)

type Configs struct {
	Clients []ClientConfig `yaml:"clients"`
}

type ContainerConfig struct {
	Name            string `yaml:"name"`
	Image           string `yaml:"image"`
	ImagePullPolicy string `yaml:"imagePullPolicy"`
	Ports           []struct {
		ContainerPort int `yaml:"containerPort"`
	} `yaml:"ports"`
	Args []string `yaml:"args"`
	Env  []struct {
		Name      string `yaml:"name"`
		Value     string `yaml:"value"`
		ValueFrom struct {
			ConfigMapKeyRef struct {
				Name string `yaml:"name"`
				Key  string `yaml:"key"`
			} `yaml:"configMapKeyRef"`
		} `yaml:"valueFrom"`
	} `yaml:"env"`
	Resources struct {
		Requests struct {
			CPU    string `yaml:"cpu"`
			Memory string `yaml:"memory"`
		} `yaml:"requests"`
		Limits struct {
			Memory string `yaml:"memory"`
		} `yaml:"limits"`
	} `yaml:"resources`
	LivenessProbe struct {
		InitialDelaySeconds int `yaml:"initialDelaySeconds"`
		TCPSocket           struct {
			Port int `yaml:"port"`
		} `yaml:"tcpSocket"`
	} `yaml:"livenessProbe"`
}

type DeploymentConfig struct {
	APIVersion string `yaml:"apiVersion"`
	Kind       string `yaml:"kind"`
	Metadata   struct {
		Namespace string `yaml:"namespace"`
		Name      string `yaml:"name"`
	} `yaml:"metadata"`
	Spec struct {
		RevisionHistoryLimit int `yaml:"revisionHistoryLimit"`
		Replicas             int `yaml:"replicas"`
		Strategy             struct {
			RollingUpdate struct {
				MaxUnavailable string `yaml:"maxUnavailable"`
			} `yaml:"rollingUpdate"`
		} `yaml"strategy"`
		Template struct {
			Metadata struct {
				Labels struct {
					App string `yaml:"app"`
				} `yaml:"labels"`
			} `yaml:"metadata"`
			Spec struct {
				Containers []ContainerConfig `yaml:"containers"`
			} `yaml:"spec"`
		} `yaml:"template"`
		//... continue
	} `yaml:"spec"`
}

type ClientConfig struct {
	Name   string `yaml:"name"`
	Server struct {
		Develop    []DeploymentConfig `yaml:"develop"`
		Staging    []DeploymentConfig `yaml:"staging"`
		Production []DeploymentConfig `yaml:"production"`
	} `yaml:"server"`
	Client struct {
		Staging    DeploymentConfig `yaml:"staging"`
		Production DeploymentConfig `yaml:"production"`
	} `yaml:"client"`
}

func getClientConfig(client string) (error, ClientConfig) {
	configFile, _ := filepath.Abs("./configs.yaml")
	yamlFile, err := ioutil.ReadFile(configFile)
	var configs Configs
	if err != nil {
		fmt.Println(err)
		return cli.NewExitError("unable to read configs.yaml", 5), ClientConfig{}
	}
	err = yaml.Unmarshal(yamlFile, &configs)
	if err != nil {
		fmt.Println(err)
		return cli.NewExitError("unable to parse configs.yaml", 6), ClientConfig{}
	}
	for i := 0; i < len(configs.Clients); i++ {
		if configs.Clients[i].Name == client {
			return nil, configs.Clients[i]
		}
	}
	return cli.NewExitError("client not found in configs", 7), ClientConfig{}
}

func getDeploymentConfig(clientConfig ClientConfig, target string) (error, DeploymentConfig) {
	switch target {
	case "staging":
		return nil, clientConfig.Client.Staging
	case "production":
		return nil, clientConfig.Client.Production
	}
	return cli.NewExitError("target does not exist, valid: develop, staging, production", 11), DeploymentConfig{}
}

func getDeploymentConfigs(clientConfig ClientConfig, target string) (error, []DeploymentConfig) {
	switch target {
	case "develop":
		return nil, clientConfig.Server.Develop
	case "staging":
		return nil, clientConfig.Server.Staging
	case "production":
		return nil, clientConfig.Server.Production
	}
	return cli.NewExitError("target does not exist, valid: develop, staging, production", 10), []DeploymentConfig{DeploymentConfig{}}
}

func dispatch(command string, platform string, flags Flags) error {
	fmt.Printf("%s for %s, client: %s\n", command, platform, flags.Client)
	err, clientConfig := getClientConfig(flags.Client)
	if err != nil {
		return err
	}
	fmt.Println("client configuration found")
	switch command {
	case "build":
		switch platform {
		case "server":
		case "web":
		case "android":
			cmd := exec.Command("./gradlew", ":app:build")
			cmd.Stdout = os.Stdout
			cmd.Stderr = os.Stderr
			cmd.Dir = "client/app/android"
			err := cmd.Start()
			if err != nil {
				return cli.NewExitError("Start building for android failed", 15)
			}
			err = cmd.Wait()
			if err != nil {
				return cli.NewExitError("Build for android failed", 16)
			}
			fmt.Println("Android build finished")
		case "ios":
			podCmd := exec.Command("pod", "install")
			podCmd.Stdout = os.Stdout
			podCmd.Stderr = os.Stderr
			podCmd.Dir = "client/app/ios"
			err = podCmd.Start()
			if err != nil {
				return cli.NewExitError("Start pod install failed", 21)
			}
			err = podCmd.Wait()
			if err != nil {
				return cli.NewExitError("Pod install failed", 22)
			}
			fmt.Println("Pod install finished")
			buildCmd := exec.Command("xcodebuild", "-sdk", "iphonesimulator", "-destination", "platform=iOS Simulator,name=iPhone 8", "-derivedDataPath", "build", "-configuration", "Debug", "-workspace", "cohesiv.xcworkspace", "-scheme", "cohesiv", "build")
			buildCmd.Stdout = os.Stdout
			buildCmd.Stderr = os.Stderr
			buildCmd.Dir = "client/app/ios"
			err = buildCmd.Start()
			if err != nil {
				return cli.NewExitError("Start iOS build failed", 23)
			}
			err = buildCmd.Wait()
			if err != nil {
				return cli.NewExitError("iOS build failed", 24)
			}
			fmt.Println("iOS build finished")

		default:
			return cli.NewExitError("Unrecognized platform", 12)
		}
		break
	case "deploy":
		switch platform {
		case "server":
			err, deploymentConfigs := getDeploymentConfigs(clientConfig, flags.Target)
			if err != nil {
				return err
			}
			fmt.Printf("deployment configurations found %s", deploymentConfigs)
			//deploy server using deploymentConfigs
			break
		case "web":
			err, deploymentConfig := getDeploymentConfig(clientConfig, flags.Target)
			if err != nil {
				return cli.NewExitError("deployment configuration not found", 9)
			}
			fmt.Printf("deployment configuration found %s", deploymentConfig)
			//deploy web client using deploymentConfig
			break
		case "ios":
			fallthrough
		case "android":
			// deploy expo app
			break
		default:
			return cli.NewExitError("Unrecognized platform", 4)
		}
		break
	case "run":
		switch platform {
		case "server":
			// start localhost server
			break
		case "web":
			// start localhost server
			break
		case "android":
			cmd := exec.Command("./gradlew", ":app:installDebug")
			cmd.Stdout = os.Stdout
			cmd.Stderr = os.Stderr
			cmd.Dir = "client/app/android"
			err := cmd.Start()
			if err != nil {
				return cli.NewExitError("Start installing on android failed", 17)
			}
			err = cmd.Wait()
			if err != nil {
				return cli.NewExitError("Install on android failed", 18)
			}
			fmt.Println("Android install finished")
			runCmd := exec.Command("adb", "shell", "am", "start", "-n", "com.github.SingularityInteractive.cohesiv/.MainActivity")
			runCmd.Stdout = os.Stdout
			runCmd.Stderr = os.Stderr
			err = runCmd.Start()
			if err != nil {
				return cli.NewExitError("Start running on android failed", 19)
			}
			err = runCmd.Wait()
			if err != nil {
				return cli.NewExitError("Run on android failed", 20)
			}
			fmt.Println("Run on Android success")
		case "ios":
			xcrunLaunchSimulator := exec.Command("xcrun", "instruments", "-w", "iPhone X (11.0)")
			xcrunLaunchSimulator.Stdout = os.Stdout
			xcrunLaunchSimulator.Stderr = os.Stderr
			err = xcrunLaunchSimulator.Start()
			if err != nil {
				return cli.NewExitError("Start launching simulator failed", 34)
			}
			err = xcrunLaunchSimulator.Wait()
			/*if err != nil {
				return cli.NewExitError("Launch simulator failed", 35)
			}*/
			var appPath string
			appPath = fmt.Sprintf("build/Build/Products/Debug-iphonesimulator/%s.app", flags.Client)
			fmt.Printf("installing app from: %s\n", appPath)
			xcrunInstall := exec.Command("xcrun", "simctl", "install", "booted", appPath)
			xcrunInstall.Dir = "client/app/ios"
			xcrunInstall.Stdout = os.Stdout
			xcrunInstall.Stderr = os.Stderr
			err = xcrunInstall.Start()
			if err != nil {
				return cli.NewExitError("Start installing app failed", 30)
			}
			err = xcrunInstall.Wait()
			if err != nil {
				return cli.NewExitError("Installing app failed", 31)
			}
			fmt.Println("app installed")
			xcrunSimulator := exec.Command("xcrun", "simctl", "launch", "booted", "com.github.SingularityInteractive.cohesiv")
			xcrunSimulator.Dir = "client/app/ios"
			xcrunSimulator.Stdout = os.Stdout
			xcrunSimulator.Stderr = os.Stderr
			err = xcrunSimulator.Start()
			if err != nil {
				return cli.NewExitError("Start running app failed", 32)
			}
			err = xcrunSimulator.Wait()
			if err != nil {
				return cli.NewExitError("Run app failed", 33)
			}
		default:
			return cli.NewExitError("Unrecognized platform", 13)
		}
		break
	}
	return nil
}

type Flags struct {
	Client string
	Target string
}

func info(app *cli.App, flags Flags) {
	app.Name = "Cohesiv Command Line Interface"
	app.Version = "0.0.1"
	app.Usage = "Add clients, generate build configurations, perform builds, run tests, deploy infrastructure and apps."
	app.Flags = []cli.Flag{
		cli.StringFlag{
			Name:        "client, c",
			Value:       "cohesiv",
			Usage:       "Use client",
			Destination: &flags.Client,
		},
		cli.StringFlag{
			Name:        "target, t",
			Value:       "staging",
			Usage:       "Development target (develop, staging, production)",
			Destination: &flags.Target,
		},
	}
	getAction := func(command string) func(c *cli.Context) error {
		return func(c *cli.Context) error {
			if len(c.Args()) == 0 {
				return cli.NewExitError("No platform specified", 3)
			}
			platform := c.Args().Get(0)
			return dispatch(command, platform, flags)
		}
	}
	app.Commands = []cli.Command{
		{
			Name:    "build",
			Aliases: []string{"b"},
			Usage:   "Build cohesiv",
			Action:  getAction("build"),
		},
		{
			Name:    "deploy",
			Aliases: []string{"d"},
			Usage:   "Deploy cohesiv",
			Action:  getAction("deploy"),
		},
		{
			Name:    "run",
			Aliases: []string{"r"},
			Usage:   "Run cohesiv",
			Action:  getAction("run"),
		},
	}
}

func main() {
	app := cli.NewApp()
	var flags Flags
	info(app, flags)
	app.Run(os.Args)
}
