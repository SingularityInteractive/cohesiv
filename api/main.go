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
	"flag"
	"os"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"

	pb "github.com/SingularityInteractive/cohesiv/cohesiv"
	"github.com/SingularityInteractive/cohesiv/version"
	"github.com/pkg/errors"
	logrus "github.com/sirupsen/logrus"
	"google.golang.org/grpc"
	"google.golang.org/grpc/grpclog"
)

var (
	addr                = flag.String("addr", ":8000", "[host]:port to listen")
	tagDirectoryBackend = flag.String("tag-directory-addr", "", "address of tag directory backend")
	accessBackend       = flag.String("access-addr", "", "address of access service")
	secretAuthJWT       string
)

var log *logrus.Entry

func main() {
	flag.Parse()
	hostname, err := os.Hostname()
	if err != nil {
		log.Fatal(errors.Wrap(err, "cannot get hostname"))
	}
	logrus.SetLevel(logrus.DebugLevel)
	logrus.SetFormatter(&logrus.JSONFormatter{FieldMap: logrus.FieldMap{logrus.FieldKeyLevel: "severity"}})
	log = logrus.WithFields(logrus.Fields{
		"service": "api",
		"host":    hostname,
		"v":       version.Version(),
	})
	grpclog.SetLogger(log.WithField("facility", "grpc"))

	if *tagDirectoryBackend == "" {
		log.Fatal("tag directory address flag not specified")
	}
	tagSvcConn, err := grpc.Dial(*tagDirectoryBackend,
		grpc.WithInsecure(),
	)
	if err != nil {
		log.Fatal(errors.Wrap(err, "cannot connect tag service"))
	}
	if *accessBackend == "" {
		log.Fatal("tag directory address flag not specified")
	}
	accessSvcConn, err := grpc.Dial(*accessBackend,
		grpc.WithInsecure(),
	)
	if err != nil {
		log.Fatal(errors.Wrap(err, "cannot connect access service"))
	}
	defer func() {
		log.Info("closing connection to tag directory")
		tagSvcConn.Close()
		log.Info("closing connection to access directory")
		accessSvcConn.Close()
	}()

	secretAuthJWT = os.Getenv("SECRET_AUTH_JWT")
	if secretAuthJWT == "" {
		log.Fatal("SECRET_AUTH_JWT environment variable is not set")
	}

	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	s := &server{
		tagSvc:    pb.NewTagDirectoryClient(tagSvcConn),
		accessSvc: pb.NewAccessClient(accessSvcConn),
	}

	s.Route(e)

	log.WithFields(logrus.Fields{"addr": *addr,
		"tagdirectory": *tagDirectoryBackend}).Info("starting to listen on http")
	e.Logger.Fatal(e.Start(*addr))

}
