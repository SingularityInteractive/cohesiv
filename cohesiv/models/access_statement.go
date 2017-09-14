package models

import (
	"time"

	pb "github.com/SingularityInteractive/cohesiv/cohesiv"
	"github.com/lib/pq"
)

// AccessStatementModel as represented in database
type AccessStatementModel struct {
	Sid       string         `gorm:"primary_key;column:sid"`
	Effect    string         `gorm:"column:effect"`
	Action    pq.StringArray `gorm:"column:action;type:varchar(64)[]"`
	Resource  pq.StringArray `gorm:"column:resource;type:varchar(64)[]"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

// TableName renames the table on migration with gorm
func (AccessStatementModel) TableName() string {
	return "access_statements"
}

// ToProto converts a db access statement to grpc access statement
func (a *AccessStatementModel) ToProto() *pb.AccessStatement {
	return &pb.AccessStatement{
		Sid:      a.Sid,
		Effect:   a.Effect,
		Action:   a.Action,
		Resource: a.Resource,
	}
}
