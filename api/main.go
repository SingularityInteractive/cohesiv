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
	"crypto/tls"
	"flag"
	"net/http"
	"os"

	"golang.org/x/crypto/acme/autocert"

	pb "github.com/SingularityInteractive/cohesiv/cohesiv"
	"github.com/SingularityInteractive/cohesiv/version"
	"github.com/auth0/go-jwt-middleware"
	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/pkg/errors"
	logrus "github.com/sirupsen/logrus"
	"google.golang.org/grpc"
	"google.golang.org/grpc/grpclog"
)

var (
	addr                = flag.String("addr", ":8000", "[host]:port to listen")
	tagDirectoryBackend = flag.String("tag-directory-addr", "", "address of tag directory backend")
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
	defer func() {
		log.Info("closing connection to user directory")
		tagSvcConn.Close()
	}()

	host := os.Getenv("HOST")
	if host == "" {
		log.Fatal("HOST environment variable is not set")
	}

	secretAuthJWT := os.Getenv("SECRET_AUTH_JWT")
	if secretAuthJWT == "" {
		log.Fatal("SECRET_AUTH_JWT environment variable is not set")
	}

	jwtMiddleware := jwtmiddleware.New(jwtmiddleware.Options{
		ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
			return []byte(secretAuthJWT), nil
		},
		// When set, the middleware verifies that tokens are signed with the specific signing algorithm
		// If the signing method is not constant the ValidationKeyGetter callback can be used to implement additional checks
		// Important to avoid security issues described here: https://auth0.com/blog/2015/03/31/critical-vulnerabilities-in-json-web-token-libraries/
		SigningMethod: jwt.SigningMethodHS256,
	})

	s := &server{
		tagSvc: pb.NewTagDirectoryClient(tagSvcConn),
	}

	// set up server
	r := mux.NewRouter()
	r.HandleFunc("/health", s.Status).Methods(http.MethodGet)
	r.HandleFunc("/entity/{relationID}/tags", s.GetTags).Methods(http.MethodGet)
	r.HandleFunc("/tags", s.CreateTags).Methods(http.MethodPost)
	r.HandleFunc("/tags/{name}/entities", s.GetEntitiesByTagName).Methods(http.MethodGet)

	handler := handlers.CompressHandler(
		logHandler(
			jwtMiddleware.Handler(r),
		),
	)

	if host == "localhost" {
		srv := http.Server{
			Addr:    *addr, // TODO make configurable
			Handler: handler,
		}

		log.WithFields(logrus.Fields{"addr": *addr,
			"tagdirectory": *tagDirectoryBackend}).Info("starting to listen on http")
		log.Fatal(errors.Wrap(srv.ListenAndServe(), "failed to listen/serve"))
	} else {
		certManager := autocert.Manager{
			Prompt:     autocert.AcceptTOS,
			HostPolicy: autocert.HostWhitelist(host), //your domain here
			Cache:      autocert.DirCache("certs"),   //folder for storing certificates
		}

		srv := http.Server{
			Addr:    *addr, // TODO make configurable
			Handler: handler,
			TLSConfig: &tls.Config{
				GetCertificate: certManager.GetCertificate,
			},
		}

		log.WithFields(logrus.Fields{"addr": *addr,
			"tagdirectory": *tagDirectoryBackend}).Info("starting to listen on http")
		log.Fatal(errors.Wrap(srv.ListenAndServeTLS("", ""), "failed to listen/serve"))
	}

}
