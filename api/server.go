package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"cloud.google.com/go/trace"
	pb "github.com/SingularityInteractive/cohesiv/cohesiv"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

type server struct {
	// userSvc pb.UserDirectoryClient
	tagSvc pb.TagDirectoryClient
	tc     *trace.Client
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
			"method":     r.Method,
			"path":       r.URL.Path,
			"request.id": trace.FromContext(r.Context()).TraceID(),
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

// // traceHandler wraps the HTTP handler with tracing that automatically finishes
// // the span. It adds additional fields to the trace span about the response and
// // adds correlation header to the headers.
// func (s *server) traceHandler(h func(http.ResponseWriter, *http.Request)) http.Handler {
// 	return traceutil.HTTPHandler(s.tc, func(w http.ResponseWriter, r *http.Request) {
// 		ww := &proxyResponseWriter{w: w}
// 		span := trace.FromContext(r.Context())
// 		defer func() {
// 			code := ww.code
// 			if code == 0 {
// 				code = http.StatusOK
// 			}
// 			span.SetLabel("http/resp/status_code", fmt.Sprint(code))
// 			span.SetLabel("http/response/content_length", fmt.Sprint(ww.length))
// 			span.SetLabel("http/req/id", span.TraceID())
// 			span.SetLabel("app/version", version.Version())
// 			span.Finish()
// 		}()
// 		ww.Header().Set("X-Cloud-Trace-Context", span.TraceID())
// 		ww.Header().Set("X-App-Version", version.Version())
// 		h(ww, r)
// 	})
// }
