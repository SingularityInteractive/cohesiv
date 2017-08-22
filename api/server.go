package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	pb "github.com/SingularityInteractive/cohesiv/cohesiv"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

type server struct {
	// userSvc pb.UserDirectoryClient
	tagSvc pb.TagDirectoryClient
}

func errorCode(w http.ResponseWriter, code int, msg string, err error) {
	log.WithField("http.status", code).WithField("error", err).Warn(msg)
	w.WriteHeader(code)
	fmt.Fprint(w, errors.Wrap(err, msg))
}

func unauthorized(w http.ResponseWriter, err error) {
	errorCode(w, http.StatusUnauthorized, "unauthorized", err)
}

func badRequest(w http.ResponseWriter, err error) {
	errorCode(w, http.StatusBadRequest, "bad request", err)
}

func serverError(w http.ResponseWriter, err error) {
	errorCode(w, http.StatusInternalServerError, "server error", err)
}

func respondJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		errorCode(w, http.StatusBadRequest, "bad request", err)
	}
}

func logHandler(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		e := log.WithFields(logrus.Fields{
			"method": r.Method,
			"path":   r.URL.Path,
		})
		e.Debug("request accepted")
		start := time.Now()
		defer func() {
			e.WithFields(logrus.Fields{
				"elapsed": time.Now().Sub(start).String(),
			}).Debug("request completed")
		}()
		h.ServeHTTP(w, r) // call original
	})
}
