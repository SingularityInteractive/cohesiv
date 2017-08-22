# cohesiv

Adhesive is a multi-tier, microservice architecture built to supplement Gloo's monolith
with services useful to third-party clients, without modifying Gloo's core codebase.

This is intended to be a sample cloud-native application to showcase the best
practices in application deployment, products of [Google Cloud](https://cloud.google.com)
and test new features.

Adhesive is written in [Go](https://golang.org), but can host services in any language with docker, 
uses [gRPC](https://grpc.io) for communication between microservices. It runs on [Google
Cloud](https://cloud.google.com) and uses Cloud Datastore, Cloud Storage,
[Google Container Engine](https://cloud.google.com/container-engine/), [Cloud
Container Builder](https://cloud.google.com/container-builder/), [Stackdriver
Logging](https://cloud.google.com/logging/) and [Stackdriver
Trace](https://cloud.google.com/trace/).

**Local development**

1. [Running services outside containers](docs/run-directly.md)
1. [Running locally on Minikube](docs/run-minikube.md)

## Setup

The following steps will walk you through on how to prepare requirements, deploy
and run this application.

> **Note:** If you see any issues with the steps below, please [open an
issue](https://github.com/SingularityInteractive/cohesiv/issues/new).

1. [Requirements](docs/requirements.md)
1. [Set up service credentials](docs/set-up-service-credentials.md)
1. [Set up storage](docs/set-up-storage.md)
1. [Set up a Kubernetes cluster on Google Container Engine](docs/set-up-storage.md)
1. [Set up continuous image build on Google Container Builder](docs/set-up-image-build.md)
1. [Set up continuous deployment on CircleCI](docs/set-up-continuous-build.md)
1. [Try out the application!](docs/try-out.md)

**Monitoring:**

1. :soon: Set up distributed tracing with Stackdriver Trace
1. :soon: Browse application logs with Stackdriver Logging
1. :soon: Set up alerting with Stackdriver Monitoring

**Advanced topics:**

1. :soon: Set up a domain name
1. :soon: Set up TLS with Let’s Encrypt and kube-lego
1. :soon: Limit access to secrets with Kubernetes Service accounts
1. :soon: Set up TLS communication between microservices with linkerd

```
curl -o cloud_sql_proxy https://dl.google.com/cloudsql/cloud_sql_proxy.darwin.amd64
```
```
mv cloud_sql_proxy /usr/local/bin
```
```
./cloud_sql_proxy -instances=polished-bridge-169215:us-central1:development=tcp:3306 -credential_file=./misc/secrets/google/credentials &
```
