package main

// Client is the master configuration struct for new and existing clients,
// values to be injected into templates and build/deployed
type Client struct {
	Name   string `json:"name"`
	Target Target `json:"target"`
}

func getTargetDefaults(target string, config *ClientConfig) *Client {
	defaultTarget := config.TargetDefaults[target]
	return &Client{
		Name:   "",
		Target: defaultTarget,
	}
}

// Clients are an array of client objects to be parsed and iterated over
type Clients []Client

// ClientConfig represents the JSON structure as it's checked into the repo
type ClientConfig struct {
	Clients        Clients           `json:"clients"`
	TargetDefaults map[string]Target `json:"target_defaults"`
}
