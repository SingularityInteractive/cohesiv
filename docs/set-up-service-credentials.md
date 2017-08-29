# Set up service credentials

## Create an [IAM Group](https://console.aws.amazon.com/iam/home?region=us-east-1#/groups)

This gives kops all the permissions it needs to manage your k8s cluster.

- Click "Create New Group"
- Give it a name like 'kops', and choose policies:
  - [x] AmazonEC2FullAccess
  - [x] IAMFullAccess
  - [x] AmazonS3FullAccess
  - [x] AmazonVPCFullAccess
  - [x] AmazonRoute53FullAccess

Add your user to this group so kops can manage clusters on your behalf.

## Create an [IAM Policy](https://console.aws.amazon.com/iam/home?region=us-east-1#/policies)

You'll need to create a custom route53 policy so your Kubernetes cluster can change DNS records as you modify external facing services.

You will use this policy in "Set up a Kubernetes cluster" section later.

- Click "Create Policy"
- Give it a name like 'Kube-External-DNS', and paste in:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "route53:ChangeResourceRecordSets"
            ],
            "Resource": [
                "arn:aws:route53:::hostedzone/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "route53:ListHostedZones",
                "route53:ListResourceRecordSets"
            ],
            "Resource": [
                "*"
            ]
        }
    ]
}
````