# Set up AWS RDS

Cohesiv uses [AWS RDS](https://aws.amazon.com/rds/) with Postgres as its relational database of choice.

Before you proceed, you'll want to have a cluster created with KOPS, which has VPC's and security groups set up for you to use with new RDS instances.

- Visit [RDS Console](https://console.aws.amazon.com/rds/home?region=us-east-1) and click `Launch a DB Instance`
- Select `PostgreSQL`, then either Production or Dev/Test. (staging.cohesiv.io uses free tier elligible Dev/Test)
- Use a name like `cohesiv-staging`, and a username like `cohesiv`, then click `Next Step`

On the Advanced Settings Menu:
- Under `VPC`, select your `staging.cohesiv.io` VPC, or whatever name you used to create your cluster.
- Under `VPC Security Goup(s)`, select `nodes.staging.cohesiv.io`, this will allow your k8s deployments/containers to access the instance, but not the masters.
- When it has successfully spun up, make note of the endpoint and use it to create k8s secrets, which your deployments can then reference in their respective .yaml's.