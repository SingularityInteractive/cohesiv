#!/bin/bash

make binaries &&
make tsc &&
cd mypds && yarn build:web &&
docker-compose up --build --abort-on-container-exit