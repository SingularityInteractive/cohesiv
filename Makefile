BIN_DIR=./gopath/bin
BINARIES=api tagdirectory
TS=access
IMAGES=api tagdirectory access

SHELL=/usr/bin/env bash

docker-images:
	BINS=(${IMAGES}); for b in $${BINS[*]}; do \
	  docker build -f=Dockerfile.$$b -t singularity/cohesiv/$$b --rm=false . ;\
		docker tag singularity/cohesiv/$$b ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/singularity/cohesiv/$$b:${CIRCLE_SHA1} ;\
		docker tag singularity/cohesiv/$$b ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/singularity/cohesiv/$$b:${CIRCLE_BRANCH} ;\
	done
tsc:
	BINS=(${TS}); for b in $${BINS[*]}; do \
		tsc -p $$b ;\
	done
binaries:
	if [ -z "$$GOPATH" ]; then echo "GOPATH is not set"; exit 1; fi
	@echo "Building statically compiled linux/amd64 binaries"
	rm -rf ${BIN_DIR} && mkdir -p ${BIN_DIR}
	BINS=(${BINARIES}); for b in $${BINS[*]}; do \
		CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o  ${BIN_DIR}/$$b ./$$b ;\
	done
docker-push-ecr: configure_aws_cli
	BINS=(${IMAGES}); for b in $${BINS[*]}; do \
		docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/singularity/cohesiv/$$b:${CIRCLE_SHA1} ;\
		docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/singularity/cohesiv/$$b:${CIRCLE_BRANCH} ;\
	done
copy-client-build-files:
	mkdir -p ./client/builds/${CLIENT}
	cp ./client/package.json ./client/Dockerfile ./client/yarn.lock ./client/builds/${CLIENT}
client-docker-image:
	docker build -t singularity/${CLIENT} --rm=false ./client/builds/${CLIENT}
	docker tag singularity/${CLIENT} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/singularity/${CLIENT}:${CIRCLE_SHA1}
	docker tag singularity/${CLIENT} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/singularity/${CLIENT}:${CIRCLE_BRANCH}
client-docker-push-ecr:
	docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/singularity/${CLIENT}:${CIRCLE_SHA1}
	docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/singularity/${CLIENT}:${CIRCLE_BRANCH}
configure_aws_cli:
	aws --version
	aws configure set default.region us-east-1
	aws configure set default.output json
authorize-develop-circle-ip:
	aws --region=${AWS_DEFAULT_REGION} ec2 authorize-security-group-ingress --group-id ${DEVELOP_SECURITY_GROUP_ID} --protocol tcp --port 443 --cidr `curl -s icanhazip.com`/32
	aws --region=${AWS_DEFAULT_REGION} ec2 authorize-security-group-ingress --group-id ${DEVELOP_SECURITY_GROUP_ID} --protocol tcp --port 5432 --cidr `curl -s icanhazip.com`/32
deauthorize-develop-circle-ip:
	aws --region=${AWS_DEFAULT_REGION} ec2 revoke-security-group-ingress --group-id ${DEVELOP_SECURITY_GROUP_ID} --protocol tcp --port 443 --cidr `curl -s icanhazip.com`/32
	aws --region=${AWS_DEFAULT_REGION} ec2 revoke-security-group-ingress --group-id ${DEVELOP_SECURITY_GROUP_ID} --protocol tcp --port 5432 --cidr `curl -s icanhazip.com`/32
authorize-staging-circle-ip:
	aws --region=${AWS_DEFAULT_REGION} ec2 authorize-security-group-ingress --group-id ${STAGING_SECURITY_GROUP_ID} --protocol tcp --port 443 --cidr `curl -s icanhazip.com`/32
	aws --region=${AWS_DEFAULT_REGION} ec2 authorize-security-group-ingress --group-id ${STAGING_SECURITY_GROUP_ID} --protocol tcp --port 5432 --cidr `curl -s icanhazip.com`/32
deauthorize-staging-circle-ip:
	aws --region=${AWS_DEFAULT_REGION} ec2 revoke-security-group-ingress --group-id ${STAGING_SECURITY_GROUP_ID} --protocol tcp --port 443 --cidr `curl -s icanhazip.com`/32
	aws --region=${AWS_DEFAULT_REGION} ec2 revoke-security-group-ingress --group-id ${STAGING_SECURITY_GROUP_ID} --protocol tcp --port 5432 --cidr `curl -s icanhazip.com`/32
authorize-master-circle-ip:
	aws --region=${AWS_DEFAULT_REGION} ec2 authorize-security-group-ingress --group-id ${MASTER_SECURITY_GROUP_ID} --protocol tcp --port 443 --cidr `curl -s icanhazip.com`/32
	aws --region=${AWS_DEFAULT_REGION} ec2 authorize-security-group-ingress --group-id ${MASTER_SECURITY_GROUP_ID} --protocol tcp --port 5432 --cidr `curl -s icanhazip.com`/32
deauthorize-master-circle-ip:
	aws --region=${AWS_DEFAULT_REGION} ec2 revoke-security-group-ingress --group-id ${MASTER_SECURITY_GROUP_ID} --protocol tcp --port 443 --cidr `curl -s icanhazip.com`/32
	aws --region=${AWS_DEFAULT_REGION} ec2 revoke-security-group-ingress --group-id ${MASTER_SECURITY_GROUP_ID} --protocol tcp --port 5432 --cidr `curl -s icanhazip.com`/32