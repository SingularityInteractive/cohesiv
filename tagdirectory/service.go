package main

import (
	pb "github.com/SingularityInteractive/cohesiv/cohesiv"
	"github.com/SingularityInteractive/cohesiv/cohesiv/models"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
	"golang.org/x/net/context"
)

type service struct {
	db *gorm.DB
}

func (s *service) GetTags(ctx context.Context, req *pb.GetTagsRequest) (*pb.Tags, error) {
	e := log.WithField("q.resourceID", req.GetResourceId())
	e.Debug("querying tags")

	var resource models.ResourceModel
	var tags []models.TagModel
	resource.ID = req.GetResourceId()

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
		response.Results[i] = t.ToProto()
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
		var tagModel models.TagModel
		s.db.Where(models.TagModel{Name: t.GetName()}).FirstOrCreate(&tagModel)

		// Find or create resource
		var relationModel models.ResourceModel
		s.db.Where(models.ResourceModel{ID: t.GetResourceId()}).FirstOrCreate(&relationModel)

		// Join the two
		s.db.Model(&tagModel).Association("Resources").Append(&relationModel)

		// Fill response
		response.Results[i] = tagModel.ToProto()
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

	tag := &models.TagModel{Name: req.GetName()}
	var resources []models.ResourceModel

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
		response.Results[i] = e.ToProto()
	}
	e.WithField("count", len(resources)).Debug("results retrieved")
	return response, nil
}
