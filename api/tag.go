package main

import (
	"encoding/json"
	"net/http"

	pb "github.com/SingularityInteractive/cohesiv/cohesiv"
	"github.com/gorilla/mux"
	"github.com/pkg/errors"
)

func (s *server) GetTags(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	relationID := mux.Vars(r)["relationID"]
	if relationID == "" {
		badRequest(w, errors.Wrap(errors.New("Null Name"), "bad reference id"))
		return
	}

	tags, err := s.tagSvc.GetTags(ctx, &pb.GetTagsRequest{RelationID: relationID})
	if err != nil {
		serverError(w, errors.Wrap(err, "cannot get tag"))
		return
	}
	log.WithField("count", len(tags.GetResults())).Debug("succesfully retrieved tags")

	if err := json.NewEncoder(w).Encode(&tags); err != nil {
		serverError(w, errors.Wrap(err, "cannot encode response"))
		return
	}
}

func (s *server) CreateTags(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	decoder := json.NewDecoder(r.Body)
	defer r.Body.Close()
	var createTagsRequest pb.CreateTagsRequest
	err := decoder.Decode(&createTagsRequest)
	if err != nil {
		badRequest(w, errors.Wrap(err, "cannot decode body"))
		return
	}

	tags, err := s.tagSvc.CreateTags(ctx, &createTagsRequest)
	if err != nil {
		serverError(w, errors.Wrap(err, "cannot create tag"))
		return
	}
	log.WithField("count", len(tags.GetResults())).Debug("succesfully created tags")
	if err := json.NewEncoder(w).Encode(&tags); err != nil {
		serverError(w, errors.Wrap(err, "cannot encode response"))
		return
	}
}

func (s *server) GetEntitiesByTagName(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	name := mux.Vars(r)["name"]
	if name == "" {
		badRequest(w, errors.Wrap(errors.New("Null Name"), "bad name"))
		return
	}

	entities, err := s.tagSvc.GetEntitiesByTagName(ctx, &pb.GetEntitiesByTagNameRequest{Name: name})
	if err != nil {
		serverError(w, errors.Wrap(err, "cannot get tag"))
		return
	}
	log.WithField("count", len(entities.GetResults())).Debug("succesfully retrieved tags")

	if err := json.NewEncoder(w).Encode(&entities); err != nil {
		serverError(w, errors.Wrap(err, "cannot encode response"))
		return
	}
}
