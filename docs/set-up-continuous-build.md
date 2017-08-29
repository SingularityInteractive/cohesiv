# Set up continuous build

Deploying this application is as simple as deploying all the manifests under
[`kube/staging`](/kube/staging) or [`kube/production`](/kube/production) using `kubectl` (requires changing the
hard-coded image names).

However ideally you want a new build to go live automatically when you push
a new commit to your GitHub repository. For that, we can use a third-party
Continuous Integration (CI) solution such as [CircleCI](http://circleci.com).

## Setting up CircleCI

[Create a new AWS IAM User](https://console.aws.amazon.com/iam/home?region=us-east-1#/users) on AWS
Console. Give it a name (e.g. `cirleci-deployment`) and add it to the group you created in [Set Up Service Credentials](/docs/set-up-service-credentials). CircleCI does not need a console login. Download the `credentials.csv`.

1. Sign up for an account on [CircleCI](http://circleci.com) with your GitHub
account.

1. Enable the builds on the `cohesiv` repository. This will use the
[`circle.yml`](/circle.yml).

1. Go to the settings of the repository on Circle CI and click "AWS Permissions", and enter the ID and Key from the IAM user you created above.

1. Go to settings of the repository on Circle CI and click "Environment Variables"
   &rarr; "Add Variable".

1. You'll need several environment variables

```json
{
    "AWS_ACCOUNT_ID": "The CircleCI user account ID generated above.",
    "AWS_DEFAULT_REGION": "The default AWS region, probably us-east-1",
    "KOPS_STATE_STORE":	"The s3 bucket url that holds the k8s states, like s3://kops.cohesiv.io",
    "STAGING_SECURITY_GROUP_ID": "The security group id for the master nodes, with a name like masters.staging.cohesiv.io"
}
```

1. Go to the Builds tab, and start a new build by clicking "Rebuild" on one of
   the previous builds.

1. Watch the logs, see if the build succeeds.


`circle.yml` file basically uses the AWS credentials to authenticate
to your ECR, then (on staging) modifies the `:latest` tag in the
`kube/staging/deployment.yaml` files with the Git commit ID and uses `kubectl apply -f`
command to deploy everything.

Since we use [Deployment
contoller](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
on Kubernetes, the deployment operation will be a rolling update and if
anything fails (e.g. image build that happens asynchronously can fail), existing
instances will keep running.
