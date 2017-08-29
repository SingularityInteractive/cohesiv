# Requirements to deploy Cohesiv

Cohesiv requires an [AWS](https://console.aws.amazon.com) account
as it uses services such as:

- [AWS EC2](https://aws.amazon.com/ec2/)
- [AWS ECR](https://aws.amazon.com/ecr/)
- [AWS Route53](https://aws.amazon.com/route53/)
- [AWS RDS](https://aws.amazon.com/rds/)
- [KOPS](https://github.com/kubernetes/kops)
- [CircleCI](https://circleci.com/)

1. Log into your @singularity-interactive account [AWS Console](https://console.aws.amazon.com).

1. Download the [`aws` command-line tool(https://aws.amazon.com/cli/) and
   authenticate:

```bash
export AWS_ACCESS_KEY_ID="YOUR_ACCESS_ID"
export AWS_SECRET_ACCESS_KEY="YOUR_ACCESS_KEY"
export AWS_DEFAULT_REGION=us-east-1
export AWS_ACCOUNT_ID=750213922035

aws configure
```

1. Download the [`kubectl` command-line tool](https://kubernetes.io/docs/user-guide/kubectl-overview/)

       # to install on macOS
       brew install kubectl 

       # or use gcloud (works on other platforms as well)
       gcloud components install kubectl

1. Download the [`kops` command-line tool](https://github.com/kubernetes/kops)