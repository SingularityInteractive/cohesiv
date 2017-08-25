#!/bin/bash

export SECRET_AUTH_JWT=fgL8y7-ABYLZyudHBxwUXQaNsNdzJtfYjsUw_cBefJQj8s8G9s1ZWJDmNmmgG1qy
export TAG_SVC_ADDR=:8002
export DB_CONNECTION_STRING="postgres://dev:1mm3rs10n@127.0.0.1:5432/cohesiv"
export TLS_KEY_PATH="./tls/server.key"
export TLS_CRT_PATH="./tls/server.crt"

if [ ! -d ./tls ]; then
    mkdir tls && cd tls \
    && openssl genrsa -des3 -passout pass:x -out server.pass.key 2048 \
    && openssl rsa -passin pass:x -in server.pass.key -out server.key \
    && rm server.pass.key \
    && openssl req -new -key server.key -out server.csr \
    && openssl x509 -req -sha256 -days 365 -in server.csr -signkey server.key -out server.crt \
    && cd ../
fi

go run ./tagdirectory/*.go --addr=:8002 &
sleep 2 &&
go run ./api/*.go --addr=:8000 \
    --tag-directory-addr=$(echo $TAG_SVC_ADDR)
