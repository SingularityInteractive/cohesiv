// Copyright 2017 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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

// tag as represented in datastore
type tag struct {
	Name      string   `gorm:"primary_key"`
	Entities  []entity `gorm:"many2many:tag_entities;"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time
}

func (t *tag) toProto() *pb.Tag {
	return &pb.Tag{
		Name: t.Name,
	}
}

type entity struct {
	ID   string `gorm:"primary_key"`
	Tags []tag  `gorm:"many2many:tag_entities;"`
}

func (e *entity) toProto() *pb.Entity {
	return &pb.Entity{
		ID: e.ID,
	}
}

func (s *service) GetTags(ctx context.Context, req *pb.GetTagsRequest) (*pb.Tags, error) {
	e := log.WithField("q.relationID", req.GetRelationID())
	e.Debug("querying tags")

	var entity entity
	var tags []tag
	entity.ID = req.GetRelationID()

	s.db.Model(&entity).Related(&tags, "Tags")
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

		// Find or create entity
		var relationModel entity
		s.db.Where(entity{ID: t.GetRelationID()}).FirstOrCreate(&relationModel)

		// Join the two
		s.db.Model(&tagModel).Association("Entities").Append(&relationModel)

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

func (s *service) GetEntitiesByTagName(ctx context.Context, req *pb.GetEntitiesByTagNameRequest) (*pb.Entities, error) {

	e := log.WithField("q.relationID", req.GetName())
	e.Debug("querying tags")

	tag := &tag{Name: req.GetName()}
	var entities []entity

	s.db.First(tag).Related(&entities, "Entities")
	errs := s.db.GetErrors()
	if len(errs) > 0 {
		e.Error(errs)
		return nil, errors.Wrap(errs[0], "error retrieving tags")
	}
	response := &pb.Entities{
		Results: make([]*pb.Entity, len(entities)),
	}
	for i, e := range entities {
		response.Results[i] = e.toProto()
	}
	e.WithField("count", len(entities)).Debug("results retrieved")
	return response, nil
}
