#!/bin/bash

export SECRET_AUTH_JWT=fgL8y7-ABYLZyudHBxwUXQaNsNdzJtfYjsUw_cBefJQj8s8G9s1ZWJDmNmmgG1qy
export TAG_SVC_ADDR=:8002
export DB_CONNECTION_STRING="postgres://dev:1mm3rs10n@127.0.0.1:5432/cohesiv"

go run ./tagdirectory/*.go --addr=:8002 &
sleep 2 &&
go run ./api/*.go --addr=:8000 \
    --tag-directory-addr=$(echo $TAG_SVC_ADDR)
