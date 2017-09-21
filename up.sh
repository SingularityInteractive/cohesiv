#!/bin/bash

make binaries &&
make tsc &&
cd client && yarn build:web &&
docker-compose up --build --abort-on-container-exit