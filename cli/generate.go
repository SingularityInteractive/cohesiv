package main

import (
	"fmt"
	"html/template"
	"os"
	"strings"

	"github.com/imdario/mergo"
	"github.com/urfave/cli"
)

func generate(clients []string, targets []string, clientConfig *ClientConfig) error {
	templateFuncs := template.FuncMap{
		"buildSubdomain": func(client string, targetSubdomain string) string {
			if targetSubdomain == "" {
				return client
			}
			return strings.Join([]string{client, targetSubdomain}, ".")
		},
	}
	for _, c := range clients {
		for _, t := range targets {
			client := &Client{
				Name: c,
			}
			targetDefaults := getTargetDefaults(t, clientConfig)
			if err := mergo.MergeWithOverwrite(client, targetDefaults); err != nil {
				fmt.Println(err)
				return cli.NewExitError(fmt.Sprintf("Unable to merge configurations for %s <- %s", client.Name, client.Target.BranchName), 5)
			}
			kubeDir := fmt.Sprintf("./client/builds/%s/kube/%s", client.Name, t)
			kubePath := fmt.Sprintf("%s/kube.yaml", kubeDir)
			exists, err := exists(kubeDir)
			if err != nil {
				fmt.Println(err)
				return cli.NewExitError(fmt.Sprintf("Unable to read/write %s", kubeDir), 5)
			}
			if !exists {
				fmt.Println(err)
				err = os.MkdirAll(kubeDir, os.FileMode(0777))
			}
			templ := template.Must(template.New("kube.yaml").Funcs(templateFuncs).ParseFiles("./templates/kube.yaml"))
			file, err := os.Create(kubePath)
			if err != nil {
				fmt.Println(err)
				return cli.NewExitError(fmt.Sprintf("Unable to write %s", kubePath), 5)
			}
			err = templ.Execute(file, client)
			if err != nil {
				fmt.Println(err)
				return cli.NewExitError(fmt.Sprintf("Unable to execute template %s", kubePath), 5)
			}
			err = file.Close()
			if err != nil {
				fmt.Println(err)
				return cli.NewExitError(fmt.Sprintf("Unable to close file %s", kubePath), 5)
			}
		}
	}
	return nil
}
