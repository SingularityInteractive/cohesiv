package models

import (
	"time"

	pb "github.com/SingularityInteractive/cohesiv/cohesiv"
)

// ResourceModel as represented in datastore
type ResourceModel struct {
	ID        string     `gorm:"primary_key;column:id"`
	Tags      []TagModel `gorm:"many2many:tag_resources;"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

// TableName renames the table on migration with gorm
func (ResourceModel) TableName() string {
	return "resources"
}

// ToProto converts a db resource to grpc resource
func (e *ResourceModel) ToProto() *pb.Resource {
	return &pb.Resource{
		Id: e.ID,
	}
}
