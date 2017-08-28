package main

import (
	"net/http"

	pb "github.com/SingularityInteractive/cohesiv/cohesiv"
	"github.com/labstack/echo"
	"github.com/pkg/errors"
)

func (s *server) GetTags(c echo.Context) error {
	ctx := c.Request().Context()
	relationID := c.Param("relationID")
	if relationID == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "Bad Relation ID")
	}

	tags, err := s.tagSvc.GetTags(ctx, &pb.GetTagsRequest{RelationID: relationID})
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, errors.Wrap(err, "Failed to get tags").Error())
	}
	log.WithField("count", len(tags.GetResults())).Debug("succesfully retrieved tags")

	return c.JSON(http.StatusOK, &tags)
}

func (s *server) CreateTags(c echo.Context) error {
	ctx := c.Request().Context()
	var createTagsRequest pb.CreateTagsRequest
	if err := c.Bind(&createTagsRequest); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, errors.Wrap(err, "Failed to decode request body").Error())
	}

	tags, err := s.tagSvc.CreateTags(ctx, &createTagsRequest)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, errors.Wrap(err, "Failed to create tag(s)").Error())
	}
	log.WithField("count", len(tags.GetResults())).Debug("succesfully created tags")
	return c.JSON(http.StatusOK, &tags)
}

func (s *server) GetEntitiesByTagName(c echo.Context) error {
	ctx := c.Request().Context()
	name := c.Param("name")
	if name == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "Bad Name in request")
	}
	entities, err := s.tagSvc.GetEntitiesByTagName(ctx, &pb.GetEntitiesByTagNameRequest{Name: name})
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, errors.Wrap(err, "Failed to get entities").Error())
	}
	log.WithField("count", len(entities.GetResults())).Debug("succesfully retrieved entities")
	return c.JSON(http.StatusOK, &entities)
}
