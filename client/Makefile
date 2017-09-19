CONTAINER_NAME=mypds
PUBLIC_URL=/

SHELL=/usr/bin/env bash

docker-image:
	docker build -f=Dockerfile -t singularity/${CONTAINER_NAME} --rm=false .
	docker tag singularity/${CONTAINER_NAME} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/singularity/${CONTAINER_NAME}:${CIRCLE_SHA1}
	docker tag singularity/${CONTAINER_NAME} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/singularity/${CONTAINER_NAME}:${CIRCLE_BRANCH}
docker-push-ecr: configure_aws_cli
	docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/singularity/${CONTAINER_NAME}:${CIRCLE_SHA1}
	docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/singularity/${CONTAINER_NAME}:${CIRCLE_BRANCH}