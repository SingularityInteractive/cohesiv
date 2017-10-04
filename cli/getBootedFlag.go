package main

import (
	"fmt"
	"os/exec"
	"strconv"
	"strings"

	"github.com/urfave/cli"
)

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
