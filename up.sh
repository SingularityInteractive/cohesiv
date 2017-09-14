#!/bin/bash

make binaries &&
make tsc &&
docker-compose up --build --abort-on-container-exit