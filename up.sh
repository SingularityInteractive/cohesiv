#!/bin/bash

export SECRET_AUTH_JWT=fgL8y7-ABYLZyudHBxwUXQaNsNdzJtfYjsUw_cBefJQj8s8G9s1ZWJDmNmmgG1qy
export TAG_SVC_ADDR=:8001
export DB_CONNECTION_STRING="postgres://samuelemccord:PASSWORD@127.0.0.1:5432/cohesiv?sslmode=disable"

go run ./tagdirectory/*.go --addr=:8002 &
sleep 2 &&
go run ./api/*.go --addr=:8000 \
   --tag-directory-addr=$(echo $TAG_SVC_ADDR)