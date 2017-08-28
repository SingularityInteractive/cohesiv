package main

import (
	"net/http"

	pb "github.com/SingularityInteractive/cohesiv/cohesiv"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

type server struct {
	// userSvc pb.UserDirectoryClient
	tagSvc pb.TagDirectoryClient
}

func (s *server) Route(e *echo.Echo) {
	// Mount a healthcheck endpoint
	e.GET("/health", health)
	// Separate api endpoints for middleware
	api := e.Group("/v1")
	api.Use(middleware.JWT([]byte(secretAuthJWT)))
	// Tags
	api.GET("/entity/:relationID/tags", s.GetTags)
	api.POST("/tags", s.CreateTags)
	api.GET("/tags/:name/entities", s.GetEntitiesByTagName)
}

func health(c echo.Context) error {
	return c.String(http.StatusOK, "OK")
}
