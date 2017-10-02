package main

import (
	"fmt"
	"os/exec"
	"strconv"
	"strings"

	"github.com/urfave/cli"
)

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
