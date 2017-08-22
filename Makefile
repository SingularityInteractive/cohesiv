BIN_DIR=./gopath/bin
BINARIES=api tagdirectory

SHELL=/usr/bin/env bash

docker-images: binaries
	BINS=(${BINARIES}); for b in $${BINS[*]}; do \
	  docker build -f=Dockerfile.$$b \
		-t ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/singularity/cohesiv/$$b:${CIRCLE_SHA1} \
		-t ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/singularity/cohesiv/$$b:${CIRCLE_BRANCH} . ;\
	done
binaries:
	if [ -z "$$GOPATH" ]; then echo "GOPATH is not set"; exit 1; fi
	@echo "Building statically compiled linux/amd64 binaries"
	rm -rf ${BIN_DIR} && mkdir -p ${BIN_DIR}
	BINS=(${BINARIES}); for b in $${BINS[*]}; do \
	  GOOS=linux GOARCH=amd64 go build -tags netgo -o ${BIN_DIR}/$$b ./$$b ;\
	done
docker-push-ecr: configure_aws_cli
	BINS=(${BINARIES}); for b in $${BINS[*]}; do \
		docker push ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/singularity/cohesiv/$$b:${CIRCLE_SHA1} ;\
		docker push ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/singularity/cohesiv/$$b:${CIRCLE_BRANCH} ;\
	done
configure_aws_cli:
	aws --version
	aws configure set default.region us-east-1
	aws configure set default.output json