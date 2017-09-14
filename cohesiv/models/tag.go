package models

import (
	"time"

	pb "github.com/SingularityInteractive/cohesiv/cohesiv"
)

// TagModel as represented in datastore
type TagModel struct {
	Name      string          `gorm:"primary_key"`
	Resources []ResourceModel `gorm:"many2many:tag_resources;"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

// TableName renames the table on migration with gorm
func (TagModel) TableName() string {
	return "tags"
}

// ToProto converts a db tag to grpc tag
func (t *TagModel) ToProto() *pb.Tag {
	return &pb.Tag{
		Name: t.Name,
	}
}
