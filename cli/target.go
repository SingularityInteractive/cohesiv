package main

// Target represents a build configuration
type Target struct {
	BranchName           string `json:"branch_name"`
	ReplicaCount         int    `json:"replica_count"`
	RevisionHistoryLimit int    `json:"revision_history_limit"`
	Subdomain            string `json:"subdomain"`
}
