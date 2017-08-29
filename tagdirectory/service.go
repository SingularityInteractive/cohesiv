package main

import (
	"time"

	pb "github.com/SingularityInteractive/cohesiv/cohesiv"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
	"golang.org/x/net/context"
)

type service struct {
	db *gorm.DB
}

// Tag as represented in datastore
type tag struct {
	Name      string     `gorm:"primary_key"`
	Resources []resource `gorm:"many2many:tag_entities;"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time
}

func (t *tag) toProto() *pb.Tag {
	return &pb.Tag{
		Name: t.Name,
	}
}

// Resource as represented in datastore
type resource struct {
	ID   string `gorm:"primary_key"`
	Tags []tag  `gorm:"many2many:tag_entities;"`
}

func (e *resource) toProto() *pb.Resource {
	return &pb.Resource{
		ID: e.ID,
	}
}

func (s *service) GetTags(ctx context.Context, req *pb.GetTagsRequest) (*pb.Tags, error) {
	e := log.WithField("q.resourceID", req.GetResourceID())
	e.Debug("querying tags")

	var resource resource
	var tags []tag
	resource.ID = req.GetResourceID()

	s.db.Model(&resource).Related(&tags, "Tags")
	errs := s.db.GetErrors()
	if len(errs) > 0 {
		e.Error(errs)
		return nil, errors.Wrap(errs[0], "error retrieving tags")
	}
	response := &pb.Tags{
		Results: make([]*pb.Tag, len(tags)),
	}
	for i, t := range tags {
		response.Results[i] = t.toProto()
	}
	e.WithField("count", len(tags)).Debug("results retrieved")
	return response, nil
}

func (s *service) CreateTags(ctx context.Context, req *pb.CreateTagsRequest) (*pb.Tags, error) {
	e := log.WithField("count", len(req.GetTags()))
	e.Debug("creating tags")

	response := &pb.Tags{
		Results: make([]*pb.Tag, len(req.GetTags())),
	}
	for i, t := range req.GetTags() {
		// Find or create tag
		var tagModel tag
		s.db.Where(tag{Name: t.GetName()}).FirstOrCreate(&tagModel)

		// Find or create resource
		var relationModel resource
		s.db.Where(resource{ID: t.GetResourceID()}).FirstOrCreate(&relationModel)

		// Join the two
		s.db.Model(&tagModel).Association("Resources").Append(&relationModel)

		// Fill response
		response.Results[i] = tagModel.toProto()
	}
	errs := s.db.GetErrors()
	if len(errs) > 0 {
		e.Error(errs)
		return nil, errors.Wrap(errs[0], "error creating tags")
	}
	return response, nil
}

func (s *service) GetResourcesByTagName(ctx context.Context, req *pb.GetResourcesByTagNameRequest) (*pb.Resources, error) {

	e := log.WithField("q.tagName", req.GetName())
	e.Debug("querying tags")

	tag := &tag{Name: req.GetName()}
	var resources []resource

	s.db.First(tag).Related(&resources, "Resources")
	errs := s.db.GetErrors()
	if len(errs) > 0 {
		e.Error(errs)
		return nil, errors.Wrap(errs[0], "error retrieving tags")
	}
	response := &pb.Resources{
		Results: make([]*pb.Resource, len(resources)),
	}
	for i, e := range resources {
		response.Results[i] = e.toProto()
	}
	e.WithField("count", len(resources)).Debug("results retrieved")
	return response, nil
}
