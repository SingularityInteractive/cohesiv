package main

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/imdario/mergo"
	"github.com/urfave/cli"
	"gopkg.in/yaml.v2"
)

const ANDROID_IDENTIFIER string = "com.github.SingularityInteractive.cohesiv"

type Configs struct {
	Clients []ClientConfig `yaml:"clients"`
}

type NameKeyPair struct {
	Name string `yaml:"name,omitempty"`
	Key  string `yaml:"key,omitempty"`
}

type ContainerConfig struct {
	Name            string `yaml:"name"`
	Image           string `yaml:"image"`
	ImagePullPolicy string `yaml:"imagePullPolicy"`
	Ports           []struct {
		ContainerPort int `yaml:"containerPort"`
	} `yaml:"ports"`
	Args []string `yaml:"args,omitempty"`
	Env  []struct {
		Name      string `yaml:"name"`
		Value     string `yaml:"value,omitempty"`
		ValueFrom struct {
			ConfigMapKeyRef NameKeyPair `yaml:"configMapKeyRef,omitempty"`
			SecretKeyRef    NameKeyPair `yaml:"secretKeyRef,omitempty"`
		} `yaml:"valueFrom,omitempty"`
	} `yaml:"env"`
	Resources struct {
		Requests struct {
			CPU    string `yaml:"cpu"`
			Memory string `yaml:"memory"`
		} `yaml:"requests"`
		Limits struct {
			Memory string `yaml:"memory"`
		} `yaml:"limits"`
	} `yaml:"resources"`
	LivenessProbe struct {
		InitialDelaySeconds int `yaml:"initialDelaySeconds"`
		TCPSocket           struct {
			Port int `yaml:"port"`
		} `yaml:"tcpSocket"`
	} `yaml:"livenessProbe"`
}

type DeploymentConfig struct {
	APIVersion string `yaml:"apiVersion,omitempty"`
	Kind       string `yaml:"kind,omitempty"`
	Metadata   struct {
		Namespace   string `yaml:"namespace,omitempty"`
		Name        string `yaml:"name,omitempty"`
		Annotations struct {
			IngressClass string `yaml:"kubernetes.io/ingress.class,omitempty"`
			SSLRedirect  string `yaml:"ingress.kubernetes.io/ssl-redirect,omitempty"`
			TLSAcme      string `yaml:"kubernetes.io/tls-acme,omitempty"`
		} `yaml:"annotations,omitempty"`
		Labels struct {
			Application string `yaml:"application,omitempty"`
		} `yaml:"labels,omitempty"`
	} `yaml:"metadata,omitempty"`
	Spec struct {
		RevisionHistoryLimit int `yaml:"revisionHistoryLimit,omitempty"`
		Replicas             int `yaml:"replicas,omitempty"`
		Strategy             struct {
			RollingUpdate struct {
				MaxUnavailable string `yaml:"maxUnavailable,omitempty"`
			} `yaml:"rollingUpdate,omitempty"`
		} `yaml:"strategy,omitempty"`
		Template struct {
			Metadata struct {
				Labels struct {
					App string `yaml:"app,omitempty"`
				} `yaml:"labels,omitempty"`
			} `yaml:"metadata,omitempty"`
			Spec struct {
				Containers []ContainerConfig `yaml:"containers,omitempty"`
			} `yaml:"spec,omitempty"`
		} `yaml:"template,omitempty"`
		TLS []struct {
			Hosts      []string `yaml:"hosts,omitempty"`
			SecretName string   `yaml:"secretName,omitempty"`
		} `yaml:"tls,omitempty"`
		Rules []struct {
			Host string `yaml:"host,omitempty"`
			Http struct {
				Paths []struct {
					Path    string `yaml:"path,omitempty"`
					Backend struct {
						ServiceName string `yaml:"serviceName,omitempty"`
						ServicePort int    `yaml:"servicePort,omitempty"`
					} `yaml:"backend,omitempty"`
				} `yaml:"paths,omitempty"`
			} `yaml:"http,omitempty"`
		} `yaml:"rules,omitempty"`
		Type     string `yaml:"type,omitempty"`
		Selector struct {
			App string `yaml:"app,omitempty"`
		} `yaml:"selector,omitempty"`
		Ports []struct {
			Protocol   string `yaml:"protocol,omitempty"`
			Port       int    `yaml:"port,omitempty"`
			TargetPort int    `yaml:"targetPort,omitempty"`
		} `yaml:"ports,omitempty"`
		//... continue
	} `yaml:"spec,omitempty"`
}

type TargetConfig struct {
	Deployment DeploymentConfig `yaml:"deployment,omitempty"`
	Ingress    DeploymentConfig `yaml:"ingress,omitempty"`
	Service    DeploymentConfig `yaml:"service,omitempty"`
}

type ClientConfig struct {
	Name       string       `yaml:"name"`
	Develop    TargetConfig `yaml:"develop"`
	Staging    TargetConfig `yaml:"staging"`
	Production TargetConfig `yaml:"production"`
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

type YamlVars struct {
	Find    []string
	Replace []string
}

func getReplacedBytes(data []byte, client string, target string) []byte {
	hostTarget := ""
	if target != "production" {
		hostTarget = fmt.Sprintf("%s.", target)
	}
	vars := YamlVars{[]string{
		"${CLIENT}",
		"${TARGET}",
		"${HOST_TARGET}"},
		[]string{
			client,
			target,
			hostTarget}}
	for i := 0; i < len(vars.Find); i++ {
		data = bytes.Replace(data, []byte(vars.Find[i]), []byte(vars.Replace[i]), -1)
	}
	return data
}

func getDeploymentConfig(clientConfig ClientConfig, target string, script string, client string) (error, DeploymentConfig) {
	defaultsFilePath, _ := filepath.Abs(fmt.Sprintf("./defaults/%s.yaml", script))
	defaultsYaml, err := ioutil.ReadFile(defaultsFilePath)
	if err != nil {
		return cli.NewExitError(fmt.Sprintf("unable to read defaults/%s.yaml", script), 50), DeploymentConfig{}
	}
	var defaultsConfig DeploymentConfig
	if err := yaml.Unmarshal(getReplacedBytes(defaultsYaml, client, target), &defaultsConfig); err != nil {
		return cli.NewExitError(fmt.Sprintf("unable to parse defaults/%s.yaml", script), 51), DeploymentConfig{}
	}

	if script == "deployment" {
		defaultContainerFile, _ := filepath.Abs("./defaults/container.yaml")
		defaultContainerYaml, err := ioutil.ReadFile(defaultContainerFile)
		if err != nil {
			return cli.NewExitError("unable to read defaults/container.yaml", 50), DeploymentConfig{}
		}
		var defaultContainerConfig ContainerConfig
		err = yaml.Unmarshal(getReplacedBytes(defaultContainerYaml, client, target), &defaultContainerConfig)
		if err != nil {
			return cli.NewExitError("unable to parse defaults/container.yaml", 52), DeploymentConfig{}
		}
		//take defaults and overwrite them with clientConfig
		var newConfig DeploymentConfig
		switch target {
		case "develop":
			newConfig = clientConfig.Develop.Deployment
			break
		case "staging":
			newConfig = clientConfig.Staging.Deployment
			break
		case "production":
			newConfig = clientConfig.Production.Deployment
			break
		default:
			return cli.NewExitError("target does not exist, valid: develop, staging, production", 11), DeploymentConfig{}
		}
		if err := mergo.MergeWithOverwrite(&defaultsConfig, newConfig); err != nil {
			return cli.NewExitError("unable to merge client deployment config for target", 53), DeploymentConfig{}
		}
		for i := 0; i < len(newConfig.Spec.Template.Spec.Containers); i++ {
			newContainer := newConfig.Spec.Template.Spec.Containers[i]
			var defaultContainerPointer *ContainerConfig = &defaultContainerConfig
			var defaultContainerCopy = *defaultContainerPointer
			for k := 0; k < len(newContainer.Env); k++ {
				found := false
				for j := 0; j < len(defaultContainerCopy.Env); j++ {
					if newContainer.Env[k].Name == defaultContainerCopy.Env[j].Name {
						defaultContainerCopy.Env[j] = newContainer.Env[k]
						found = true
					}
				}
				if !found {
					defaultContainerCopy.Env = append(defaultContainerCopy.Env, newContainer.Env[k])
				}
			}
			newContainer.Env = defaultContainerCopy.Env
			if err := mergo.MergeWithOverwrite(&defaultContainerCopy, newContainer); err != nil {
				return cli.NewExitError("unable to merge container config for target", 54), DeploymentConfig{}
			}
			if i == 0 {
				defaultsConfig.Spec.Template.Spec.Containers = []ContainerConfig{defaultContainerCopy}
			} else {
				defaultsConfig.Spec.Template.Spec.Containers = append(defaultsConfig.Spec.Template.Spec.Containers, defaultContainerCopy)
			}
		}
	}
	return nil, defaultsConfig

}

func replaceVars(inputFilepath string, outputFilepath string, client string, target string) error {
	inputPath, _ := filepath.Abs(inputFilepath)
	inputFile, err := ioutil.ReadFile(inputPath)
	if err != nil {
		return cli.NewExitError(fmt.Sprintf("unable to read %s", inputPath), 50)
	}
	outputFile := getReplacedBytes(inputFile, client, target)
	outputPath, _ := filepath.Abs(outputFilepath)
	if err := ioutil.WriteFile(outputPath, outputFile, 0644); err != nil {
		fmt.Println(err)
		return cli.NewExitError(fmt.Sprintf("unable to write to %s", outputPath), 61)
	}
	fmt.Printf("Wrote to %s\n", outputFilepath)
	return nil
}

func getNumberAdbDevices() (int, error) {
	adbDevices, err := exec.Command("bash", "-c", "adb devices | grep device | wc -l").Output()
	if err != nil {
		return 0, cli.NewExitError("Unable to get number of adb devices", 35)
	}
	adbOutputInt, err := strconv.Atoi(strings.TrimSpace(string(adbDevices)))
	if err != nil {
		return 0, cli.NewExitError("Unable to parse number of adb devices", 36)
	}
	numberOfDevices := adbOutputInt - 1
	fmt.Printf("Number of adb devices: %d\n", numberOfDevices)
	return numberOfDevices, nil
}

func getBootedFlag() (bool, error) {
	adbBootCheck, err := exec.Command("bash", "-c", "adb shell getprop sys.boot_completed").Output()
	if err != nil {
		return false, cli.NewExitError("Unable to get adb boot completed flag", 42)
	}
	fmt.Printf("boot flag output: %s\n", adbBootCheck)
	adbOutputInt, err := strconv.Atoi(strings.TrimSpace(string(adbBootCheck)))
	if err != nil {
		return false, nil //output is blank when not booted, so don't return error
	}
	fmt.Printf("Boot flag: %d\n", adbOutputInt)
	return adbOutputInt == 1, nil
}

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

func startAndroidApp() error {
	runCmd := exec.Command("adb", "shell", "am", "start", "-n", fmt.Sprintf("%s/.MainActivity", ANDROID_IDENTIFIER))
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

func dispatch(command string, platform string, flags Flags) error {
	fmt.Printf("%s for %s, client: %s\n", command, platform, flags.Client)
	switch command {
	case "clean":
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
		break
	case "build":
		switch platform {
		case "server":
			err := runClientNpmScript("build:server")
			if err != nil {
				return err
			}
			break
		case "web":
			err := runClientNpmScript("build:web")
			if err != nil {
				return err
			}
			break
		case "android":
			if err := performGradleTask("assembleRelease"); err != nil {
				return err
			}
		case "ios":
			//TODO build release build
			return cli.NewExitError("iOS release build has not yet been configured", 58)
		default:
			return cli.NewExitError("Unrecognized platform", 12)
		}
		break
	case "deploy":
		switch platform {
		case "server":
			fmt.Println("In order to deploy to server, please make a pull request into staging, and then staging into master (production)")
			break
		case "web":
			fmt.Println("In order to deploy to web, please make a pull request into staging, and then staging into master (production)")
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
		default:
			return cli.NewExitError("Unrecognized platform", 4)
		}
		break
	case "run":
		switch platform {
		case "server":
			serverStart := exec.Command("sh", "up.sh")
			serverStart.Stdout = os.Stdout
			serverStart.Stderr = os.Stderr
			err := serverStart.Start()
			if err != nil {
				return cli.NewExitError("Unable to start server", 47)
			}
			err = serverStart.Wait()
			if err != nil {
				return cli.NewExitError("Error starting server", 48)
			}
			break
		case "web":
			err := runClientNpmScript("start:web")
			if err != nil {
				return err
			}
			break
		case "android":
			numberOfDevices, err := getNumberAdbDevices()
			if err != nil {
				return err
			}
			if numberOfDevices == 0 {
				avdCmd := exec.Command("bash", "-c", "$ANDROID_SDK/tools/emulator -list-avds")
				avdDevices, err := avdCmd.Output()
				if err != nil {
					return cli.NewExitError("Unable to get number of avd devices", 37)
				}
				emulators := strings.Split(string(avdDevices), "\n")
				numberOfEmulators := len(emulators) - 1
				fmt.Printf("Number of avd emulators: %d\n", numberOfEmulators)
				if numberOfEmulators <= 0 {
					// TODO: create AVD wizard
					return cli.NewExitError("No emulators present, please create one in AVD Manager", 38)
				}
				var inputInt int
				if numberOfEmulators == 1 {
					inputInt = 1
				} else {
					fmt.Println("Pick an emulator")
					for i := 0; i < numberOfEmulators; i++ {
						fmt.Printf("%d: %s\n", i+1, emulators[i])
					}
					fmt.Printf("Enter a number: ")
					var input string
					fmt.Scanln(&input)
					inputInt, err = strconv.Atoi(strings.TrimSpace(string(input)))
					if err != nil {
						return cli.NewExitError("Unable to parse input", 39)
					}
					if len(emulators) < inputInt || inputInt < 1 {
						return cli.NewExitError("Index out of range", 40)
					}
				}
				fmt.Printf("Chose emulator: %s\n", emulators[inputInt-1])
				avdRunCmd := exec.Command("bash", "-c", "$ANDROID_SDK/tools/emulator @"+emulators[inputInt-1])
				avdRunCmd.Start()
				for timeoutCounter := 0; timeoutCounter < 20; timeoutCounter++ {
					numberOfDevices, err = getNumberAdbDevices()
					if err != nil {
						return err
					}
					if numberOfDevices > 0 {
						fmt.Println("Waiting for emulator to boot")
						for bootCounter := 0; bootCounter < 20; bootCounter++ {
							bootFlag, err := getBootedFlag()
							if err != nil {
								return err
							}
							if bootFlag == true {
								break
							}
							if bootCounter == 19 {
								return cli.NewExitError("wait for adb boot flag timeout reached", 44)
							}
							time.Sleep(time.Second * 2)
						}
						break
					}
					if timeoutCounter == 19 {
						return cli.NewExitError("wait for adb device timeout reached", 41)
					}
					time.Sleep(time.Second * 2)
				}
			}
			if err := performGradleTask("installDebug"); err != nil {
				return err
			}
			if err := startAndroidApp(); err != nil {
				return err
			}
			break
		case "ios":
			getSimulatorsCmd := exec.Command("xcrun", "instruments", "-s", "devices")
			getSimulatorsOutput, err := getSimulatorsCmd.Output()
			if err != nil {
				return cli.NewExitError("Get simulators failed", 56)
			}
			iosDevices := strings.Split(strings.Split(string(getSimulatorsOutput), "Known Devices:\n")[1], "\n")
			iosDevices = iosDevices[:len(iosDevices)-1]
			fmt.Println("Choose iOS Device")
			for i := 0; i < len(iosDevices); i++ {
				fmt.Printf("%d: %s\n", i+1, iosDevices[i])
			}
			fmt.Printf("Enter a number: ")
			var input string
			fmt.Scanln(&input)
			inputInt, err := strconv.Atoi(strings.TrimSpace(string(input)))
			if err != nil {
				return cli.NewExitError("Unable to parse input", 39)
			}
			if len(iosDevices) < inputInt || inputInt < 1 {
				return cli.NewExitError("Index out of range", 40)
			}

			xcrunLaunchSimulator := exec.Command("xcrun", "instruments", "-w", iosDevices[inputInt-1])
			xcrunLaunchSimulator.Stdout = os.Stdout
			xcrunLaunchSimulator.Stderr = os.Stderr
			err = xcrunLaunchSimulator.Start()
			if err != nil {
				return cli.NewExitError("Start launching simulator failed", 34)
			}
			err = xcrunLaunchSimulator.Wait()
			/*if err != nil { // Don't fail on error, it worked
				return cli.NewExitError("Launch simulator failed", 35)
			}*/
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
	case "test":
		fmt.Println("Test cohesiv")
		switch platform {
		case "web":
			break
		case "server":
			break
		case "android":
			break
		case "ios":
			break
		}
		break
	case "generate":
		err, clientConfig := getClientConfig(flags.Client)
		if err != nil {
			return err
		}
		if err := replaceVars("./defaults/Makefile", "./client/Makefile", flags.Client, flags.Target); err != nil {
			return cli.NewExitError("unable to generate client Makefile", 55)
		}
		var targets []string = []string{"develop", "staging", "production"}
		var scripts []string = []string{"deployment", "ingress", "service"}
		for _, target := range targets {
			for _, script := range scripts {
				err, config := getDeploymentConfig(clientConfig, target, script, flags.Client)
				if err != nil {
					return cli.NewExitError(fmt.Sprintf("%s configuration not found", script), 9)
				}
				file, err := yaml.Marshal(&config)
				if err != nil {
					return cli.NewExitError(fmt.Sprintf("unable to parse %s config into yaml", script), 60)
				}
				path := fmt.Sprintf("./client/kube/%s/%s.yaml", target, script)
				if err := ioutil.WriteFile(path, file, 0644); err != nil {
					fmt.Println(err)
					return cli.NewExitError(fmt.Sprintf("unable to write %s yaml to file", script), 61)
				}
				fmt.Printf("Wrote to %s\n", path)
			}
		}
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
			Value:       "develop",
			Usage:       "Development target (develop, staging, production)",
			Destination: &flags.Target,
		},
	}
	getAction := func(command string) func(c *cli.Context) error {
		return func(c *cli.Context) error {
			if len(c.Args()) == 0 && command != "generate" {
				return cli.NewExitError("No platform specified", 3)
			}
			platform := c.Args().Get(0)
			return dispatch(command, platform, flags)
		}
	}
	app.Commands = []cli.Command{
		{
			Name:    "clean",
			Aliases: []string{"c"},
			Usage:   "Clean cohesiv",
			Action:  getAction("clean"),
		},
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
		{
			Name:    "test",
			Aliases: []string{"t"},
			Usage:   "Test cohesiv",
			Action:  getAction("test"),
		},
		{
			Name:    "generate",
			Aliases: []string{"g"},
			Usage:   "Generate client deployment files",
			Action:  getAction("generate"),
		},
	}
}

func main() {
	app := cli.NewApp()
	var flags Flags
	info(app, flags)
	app.Run(os.Args)
}
