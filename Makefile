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
	set -x; BINARIES=(api tagdirectory); \
	  GOOS=linux GOARCH=amd64 go install \
	  -a -tags netgo \
	  -ldflags="-w -X github.com/SingularityInteractive/cohesiv/version.version=$$(git describe --always --dirty)" \
	    $(patsubst %, ./%, $(BINARIES)) && \
	rm -rf ${BIN_DIR} && mkdir -p ${BIN_DIR} && \
	cp $(patsubst %, $$GOPATH/bin/linux_amd64/%, $(BINARIES)) ${BIN_DIR}
docker-push-ecr: configure_aws_cli
	eval $(aws ecr get-login --region us-east-1 --no-include-email)
	BINS=(${BINARIES}); for b in $${BINS[*]}; do \
	  docker push -f=Dockerfile.$$b \
		-t ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/singularity/cohesiv/$$b:${CIRCLE_SHA1} \
		-t ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/singularity/cohesiv/$$b:${CIRCLE_BRANCH} . ;\
	done
configure_aws_cli:
	aws --version
	aws configure set default.region us-east-1
	aws configure set default.output json