# Cohesiv

Cohesiv is a multi-tier, microservice architecture monorepo built to supplement Gloo's monolith
with services useful to third-party clients, without modifying Gloo's core codebase.

This is intended to be a cloud-native application, deployed to `AWS` to showcase the best
practices in application deployment, utilizing a modern stack including `Docker`, `Kubernetes`,
 `GRPC`, `Golang`, and `Node`.

## Table of Contents
- [Dependencies](#dependencies)
- [Installation](#installation)
- [Usage](#usage)
- [Updating GRPC Spec](#updating-proto)
- [Support](#support)
- [Contributing](#contributing)
- [Deploying](#Deploying)

## Dependencies
- `npm i -g yarn`
- `yarn global add tslint typescript`
- Add to ~/.bash_profile, ~/.bashrc, etc. (your shell startup script): `export GOPATH=$HOME/go`

## Installation

- Clone into `$GOPATH/src/github.com/SingularityInteractive/cohesiv`
- `$ brew install dep`
- `dep ensure`
- `yarn`
- `./installCli.sh`

*__Note:__ This project must exist in your GOPATH to use vscode language features like intellisense. The path above works with a default Golang setup*

## Usage
- `cohesiv -c mypds generate`
Generate client kube configs
- `cohesiv run server`
Build all Go and Typescript services, then docker-compose
- `cohesiv run web`
Run localhost client app in browser
- `cohesiv run android`
Run app on connected android device or first emulator
- `cohesiv run ios`
Run app on ios simulator
- `cohesiv build #PLATFORM`
Build release for platform (server, web, android, ios)
- `cohesiv test #PLATFORM`
Run tests for platform
- `cohesiv deploy #PLATFORM`
Deploy for platform

## Updating GRPC Spec

- Learn about [GRPC](https://grpc.io/)
- Grab the protoc binary from [here](https://github.com/golang/protobuf), and put it in your $PATH
- Modify `cohesiv/cohesiv.proto`, and update existing code if necessary.
- To compile new Go interfaces or Typescript definitions from the proto spec, run:

```
  sh gen-protos.sh
```

or

```bash
  # Go types and interfaces
  protoc -I cohesiv/ cohesiv/cohesiv.proto --go_out=plugins=grpc:cohesiv
  # TS defintitions and modules
  ./node_modules/.bin/rxjs-grpc -o cohesiv/cohesiv.ts cohesiv/*.proto
```

## Support

Please [open an issue](https://github.com/SingularityInteractive/base/issues/new) for feature tracking or support.

## Contributing

 1. Branch off develop, adding issue number in the branch name

 ![branch](https://s3.amazonaws.com/uploads.intercomcdn.com/i/o/14743103/6b8e946debf9f16748e76893/git-checkout-1.png)

 2. Push it to your remote

  ![push](https://s3.amazonaws.com/uploads.intercomcdn.com/i/o/14743104/7b7e5017ae107b9a2da384d5/git-push-1.png)

 3. Add commits
 4. Open a pull request into `develop` with the issue number in the title eg `closes #42`

  ![open a pull request](https://s3.amazonaws.com/uploads.intercomcdn.com/i/o/14743110/69258075509958bac8288799/merge-pr.png)
 
  5. To release to our staging environment, merge `develop` into `staging`, which will trigger a ci deployment.
  6. To release to production, merge `staging` into `master`. 

## Deploying

The following steps will walk you through on how to prepare requirements, deploy
and run this application.

> **Note:** If you see any issues with the steps below, please [open an
issue](https://github.com/SingularityInteractive/cohesiv/issues/new).

1. [Requirements](docs/requirements.md)
1. [Set up service credentials](docs/set-up-service-credentials.md)
1. [Set up a Kubernetes cluster on AWS using KOPS](docs/set-up-cluster.md)
1. [Set up storage](docs/set-up-storage.md)
1. [Set up continuous deployment on CircleCI](docs/set-up-continuous-build.md)