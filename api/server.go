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
	api := e.Group("/api")
	// Mount a healthcheck endpoint
	api.GET("/health", health)
	// Separate api endpoints for middleware
	v1 := e.Group("/v1")
	v1.Use(middleware.JWT([]byte(secretAuthJWT)))
	// Tags
	v1.GET("/entity/:relationID/tags", s.GetTags)
	v1.POST("/tags", s.CreateTags)
	v1.GET("/tags/:name/entities", s.GetEntitiesByTagName)
}

func health(c echo.Context) error {
	return c.String(http.StatusOK, "OK")
}
