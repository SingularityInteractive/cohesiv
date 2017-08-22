BIN_DIR=./gopath/bin
BINARIES=api tagdirectory
SECURITY_GROUP_ID?=sg-792e8309
IP_ADDRESS=`curl -s icanhazip.com`

SHELL=/usr/bin/env bash

docker-images: binaries
	BINS=(${BINARIES}); for b in $${BINS[*]}; do \
	  docker build -f=Dockerfile.$$b -t singularity/cohesiv/$$b --rm=false . ;\
		docker tag singularity/cohesiv/$$b ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/singularity/cohesiv/$$b:${CIRCLE_SHA1} ;\
		docker tag singularity/cohesiv/$$b ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/singularity/cohesiv/$$b:${CIRCLE_BRANCH} ;\
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
		docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/singularity/cohesiv/$$b:${CIRCLE_SHA1} ;\
		docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/singularity/cohesiv/$$b:${CIRCLE_BRANCH} ;\
	done
configure_aws_cli:
	aws --version
	aws configure set default.region us-east-1
	aws configure set default.output json
get_ip:
	echo "Getting container/machine IP address..."
  IP_ADDRESS=`curl -s icanhazip.com`
  if [ -z "$IP_ADDRESS" ];then \
  		IP_ADDRESS=$(wget -qO- http://checkip.amazonaws.com) ;\
    if [ -z "$IP_ADDRESS" ];then \
    @echo "Cannot get IP address, fubar'd" ;\
    exit 1 ;\
    fi \
  else \
  	@echo "Got IP address of ${IP_ADDRESS}" ;\
  fi
authorize-circle-ip: get_ip
	aws --region=${AWS_DEFAULT_REGION} ec2 authorize-security-group-ingress --group-id ${SECURITY_GROUP_ID} --protocol tcp --port 443 --cidr ${IP_ADDRESS}/32
deauthorize-circle-ip:
	aws --region=${AWS_DEFAULT_REGION} ec2 revoke-security-group-ingress --group-id ${SECURITY_GROUP_ID} --protocol tcp --port 443 --cidr ${IP_ADDRESS}/32