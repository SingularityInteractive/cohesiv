package main

import (
	"net/http"

	pb "github.com/SingularityInteractive/cohesiv/cohesiv"
	"github.com/labstack/echo"
	"github.com/pkg/errors"
)

func (s *server) GetTags(c echo.Context) error {
	ctx := c.Request().Context()
	resourceID := c.Param("resourceID")
	if relationID == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "Bad Relation ID")
	}

	tags, err := s.tagSvc.GetTags(ctx, &pb.GetTagsRequest{ResourceID: resourceID})
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

func (s *server) GetResourcesByTagName(c echo.Context) error {
	ctx := c.Request().Context()
	name := c.Param("name")
	if name == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "Bad Name in request")
	}
	resources, err := s.tagSvc.GetResourcesByTagName(ctx, &pb.GetResourcesByTagNameRequest{Name: name})
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, errors.Wrap(err, "Failed to get entities").Error())
	}
	log.WithField("count", len(resources.GetResults())).Debug("succesfully retrieved resources")
	return c.JSON(http.StatusOK, &resources)
}
