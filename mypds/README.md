# Cohesiv Client

A boilerplate monolith designed to be deployed within a [Cohesiv](https://github.com/SingularityInteractive/cohesiv) cluster. Contains reasonable base setups for a `React Native/Expo app`, `React/Mobx PWA`, and `Express API/Static Content server`. Includes `Docker`, `circle-ci`, `k8s configs`, and `Sequelize`.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Deploying](#deploying)
- [Support](#support)
- [Contributing](#contributing)
- [Locations to Change Product Name](#locations-to-change-product-name)

## Installation

- `cd client && yarn`

*__Note:__ react-native is nested in client to prevent mixing native dependencies with web and server*


## Usage

After forking, you should change this repo's name to the product name of the client we're developing for, like `mypds`, also replacing pretty much all instances of the word _"base"_ or _"cohesiv-client"_ with your new product name, like `mypds` in k8s configs or url's. The full list of places to check can be found [here](#locations-to-change-product-name)

- Run `yarn start:web` to start webpack-dev-server for the `PWA`
- Open `client` folder with Expo XDE for rapid native development
- See the [Cohesiv](https://github.com/SingularityInteractive/cohesiv) repo for instructions on running the supporting microservices

#### Sharing Code between Web and Native

Native and Web can share MobX stores `client/src/stores`, `fetch` functionality, and configuration `client/src/config`, but not much else as to keep bundles small and the experience optimized per platform.

The library `react-native-web` implements react-native API's for a browser context, so packages like `AsyncStorage`, `Dimensions`, etc. can be safely built for the browser. The `client/src/components/MediaQuery` component is a good example of a cross-platform component.

If you're writing a file to be built cross-platform and needs platform specific modules like `react-native-joi` in `client/src/config/index`, import the native library, add the browser equivalent from the project root, `yarn add joi-browser`, and create an alias entry in `config/webpack.config` so react-native gets the actual import, but webpack gets the one for the browser.

#### Sequelize

Includes [sequelize-cli](https://github.com/sequelize/cli) for model/migration/seed management.

*__Note:__ It is highly recommended you use the cli to run migrations and initialize db resources.*

#### Server/PWA NPM Scripts

```json
{
    "serve": "Run a transpiled API server from server/dist",
    "start:server": "Run and watch server src, reloaded automatically",
    "start:web": "Start webpack-dev-server for the PWA",
    "start:debug": "Same as start:server, but in debug mode",
    "build:server": "Transpile ./server/src to ./server/dist",
    "build:web": "Create a minified PWA bundle into ./public",
    "lint": "eslint client and server src directories",
    "lint:watch": "Duh",
    "precommit": "Will run lint and test scripts",
    "test": "Test server && web",
    "test:watch": "Test and watch",
    "test:coverage": "Generate server test coverage report",
    "test:check-coverage": "Check server test coverage",
    "test:web": "Run web tests",
    "test:server": "Run server tests",
    "report-coverage": "Add coverage to coveralls"
}
```

## Deploying

In your fork, you'll probably want to uncomment the build stages in `circle.yml`.

The `circle.yml` file is configured to deploy `master` branch to production, and `staging` branch to `staging.cohesiv.io`. Manual deploys are discouraged. Read on if you're curious.

```bash
# Deploy to a running cohesiv cluster
export KOPS_STATE_STORE=s3://kops.cohesiv.io
export AWS_ACCESS_KEY_ID="ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="ACCESS_SECRET_KEY"
export AWS_DEFAULT_REGION=us-east-1
export NAME=staging.cohesiv.io
export AWS_ACCOUNT_ID=750213922035

echo -n "postgres://user:password@host:5432/cohesiv" | base64 
# And copy into an opaque kubernetes secret called base-secrets at /kube/secrets

kops export kubecfg --name=${NAME} --state=${KOPS_STATE_STORE} # Get kubernetes context for applying config
kubectl apply -f kube/staging # Applies configs for all files in folder
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

  ## Locations to Change Product Name

  ```json
{
    "package.json" : "No brainer here",
    "../docker-compose.yml" : "Mainly for console log differentiation purposes here",
    "client/package.json": "Just to keep consistent with the root package.json",
    "kube/**/*.yaml": "The k8s configs apply under the 'base' namespace, so all references should be changed.",
    "Makefile": "Change the CONTAINER_NAME variable for the AWS ECR image, and PUBLIC_URL so that it accurately reflects the host"
}
```