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
	"net"
	"os"

	"flag"

	pb "github.com/SingularityInteractive/cohesiv/cohesiv"
	"github.com/SingularityInteractive/cohesiv/version"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
	"google.golang.org/grpc"
	"google.golang.org/grpc/grpclog"
)

var (
	addr = flag.String("addr", ":8002", "[host]:port to listen")
	log  *logrus.Entry
)

func main() {
	flag.Parse()
	host, err := os.Hostname()
	if err != nil {
		log.Fatal(errors.Wrap(err, "cannot get hostname"))
	}
	logrus.SetLevel(logrus.DebugLevel)
	logrus.SetFormatter(&logrus.JSONFormatter{FieldMap: logrus.FieldMap{logrus.FieldKeyLevel: "severity"}})
	log = logrus.WithFields(logrus.Fields{
		"service": "tagdirectory",
		"host":    host,
		"v":       version.Version(),
	})
	grpclog.SetLogger(log.WithField("facility", "grpc"))

	DBConnectionString := os.Getenv("DB_CONNECTION_STRING")
	if DBConnectionString == "" {
		log.Fatal("DB_CONNECTION_STRING environment variable is not set")
	}

	db, err := gorm.Open("postgres", DBConnectionString)
	defer db.Close()
	if err != nil {
		log.Fatal(errors.Wrap(err, "failed to connect to db instance"))
	}
	err = db.DB().Ping()
	if err != nil {
		log.Fatal(errors.Wrap(err, "failed to ping db instance"))
	}
	db.AutoMigrate(&tag{}, &entity{})

	lis, err := net.Listen("tcp", *addr)
	if err != nil {
		log.Fatal(err)
	}
	grpcServer := grpc.NewServer()
	svc := &service{db}
	pb.RegisterTagDirectoryServer(grpcServer, svc)
	log.WithFields(logrus.Fields{"addr": *addr,
		"service": "tagdirectory",
	}).Info("starting to listen on grpc")
	log.Fatal(grpcServer.Serve(lis))
}
