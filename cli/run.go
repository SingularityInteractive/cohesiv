package main

import (
	"fmt"
	"html/template"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"time"

	"github.com/urfave/cli"
)

func run(c *cli.Context, client string) error {
	platform := c.Args().Get(0)
	switch platform {
	case "server":
		os.Setenv("CLIENT", client)
		clientTempl := &Client{
			Name: client,
		}
		templ := template.Must(template.ParseFiles("./templates/docker-compose.yml"))
		f, err := os.OpenFile("docker-compose.yml", os.O_WRONLY, 0777)
		if err != nil {
			fmt.Println(err)
			return cli.NewExitError("Unable to open docker-compose.yml", 5)
		}
		err = templ.Execute(f, clientTempl)
		if err != nil {
			fmt.Println(err)
			return cli.NewExitError("Unable to execute template ./templates/docker-compose.yml", 5)
		}
		serverStart := exec.Command("sh", "up.sh")
		serverStart.Stdout = os.Stdout
		serverStart.Stderr = os.Stderr
		err = serverStart.Start()
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
		if err := overwriteAppJSON(client); err != nil {
			return err
		}
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
		if err := startAndroidApp(client); err != nil {
			return err
		}
		break
	case "ios":
		if err := overwriteAppJSON(client); err != nil {
			return err
		}
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
		appPath = fmt.Sprintf("build/Build/Products/Debug-iphonesimulator/%s.app", client)
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
		clientBundleIdentifier := fmt.Sprintf("%s.%s", BUNDLE_IDENTIFIER, client)
		xcrunSimulator := exec.Command("xcrun", "simctl", "launch", "booted", clientBundleIdentifier)
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
	return nil
}
