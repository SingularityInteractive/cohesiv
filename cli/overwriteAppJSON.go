package main

import (
	"fmt"
	"html/template"
	"os"

	"github.com/urfave/cli"
)

func overwriteAppJSON(client string) error {
	templ := template.Must(template.ParseFiles("./templates/app.json"))
	file, err := os.Create("./client/app/app.json")
	if err != nil {
		fmt.Println(err)
		return cli.NewExitError("unable to generate client app.json", 5)
	}
	err = templ.Execute(file, &Client{
		Name: client,
	})
	if err != nil {
		fmt.Println(err)
		return cli.NewExitError("Unable to execute template ./templates/app.json", 5)
	}
	err = file.Close()
	if err != nil {
		fmt.Println(err)
		return cli.NewExitError("Unable to close file ./client/app/app.json", 5)
	}
	return nil
}
