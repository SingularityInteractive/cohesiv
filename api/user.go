package main

import (
	"net/http"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gorilla/context"
)

func getUserID(r *http.Request) string {
	user := context.Get(r, "user")
	jwtClaims := user.(*jwt.Token).Claims.(jwt.StandardClaims)
	id := jwtClaims.Subject
	if id == "" {
		return ""
	}
	return id
}

// func (s *server) Me(w http.ResponseWriter, r *http.Request) {
// 	ctx := r.Context()
// 	span := trace.FromContext(ctx).NewChild("rpc.Sent/GetUser")
// 	defer span.Finish()
// 	id := getUserID(r)
// 	if id == "" {
// 		badRequest(w, errors.Wrap(errors.New("Null ID"), "bad user id"))
// 		return
// 	}
// 	u, err := s.userSvc.GetUser(ctx.TODO(), &pb.UserRequest{
// 		Query: &pb.UserRequest_ID{
// 			ID: id,
// 		},
// 	})
// 	if err != nil {
// 		serverError(w, errors.Wrap(err, "cannot get user"))
// 		return
// 	}
// 	log.WithField("user.id", u.GetID()).Debug("retrieved user")

// 	if err := json.NewEncoder(w).Encode(&u); err != nil {
// 		serverError(w, errors.Wrap(err, "cannot encode response"))
// 	}
// }

// func (s *server) UpsertUser(w http.ResponseWriter, r *http.Request) {
// 	ctx := r.Context()
// 	span := trace.FromContext(ctx).NewChild("rpc.Sent/UpsertUser")
// 	defer span.finish()
// 	decoder := json.NewDecoder(r.Body)
// 	defer r.Body.Close()
// 	var userReq pb.UserRequest
// 	err := decoder.Decode(&userReq)
// 	if err != nil {
// 		serverError(w, errors.Wrap(err, "cannot decode body"))
// 		return
// 	}
// 	u, err := s.userSvc.UpsertUser(ctx.TODO(), &userReq)
// 	if err != nil {
// 		serverError(w, errors.Wrap(err, "cannot create user"))
// 		return
// 	}
// 	log.WithField("user.id", u.GetID()).Debug("user upserted")
// 	if err := json.NewEncoder(w).Encode(&u); err != nil {
// 		serverError(w, errors.Wrap(err, "cannot encode response"))
// 	}
// }
