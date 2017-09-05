#!/bin/bash

protoc -I cohesiv/ cohesiv/cohesiv.proto --go_out=plugins=grpc:cohesiv &&
./node_modules/.bin/rxjs-grpc -o cohesiv/cohesiv.ts cohesiv/*.proto