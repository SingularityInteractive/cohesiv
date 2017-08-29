# Set up a Kubernetes cluster

Cohesiv consists of several microservices, which are deployed
as [Docker](https://docker.com) containers.

To orchestrate deployment, lifecycle and replication of these services
on a pool of [EC@ instances](https://aws.amazon.com/ec2/), we
use [Kubernetes](https://kubernetes.io).

## Create the Cluster with KOPS

[Follow steps 1-3 here](https://kubernetes.io/docs/getting-started-guides/kops/) using the name `something.cohesiv.io`.
Once you can run `dig NS something.cohesiv.io` and see the nameservers created with the hosted zone and copied to `cohesiv.io`, you can proceed.

And finally, run:
```bash
export KOPS_STATE_STORE=s3://kops.cohesiv.io
export NAME=staging.cohesiv.io

kops create cluster \
  --name=${NAME} \
  --cloud=aws \
  --kubernetes-version=1.7.3 \
  --zones=us-east-1b,us-east-1c,us-east-1d \
  --ssh-public-key=~/.ssh/id_rsa.pub \
  --network-cidr=172.30.0.0/16 \
  --admin-access=172.30.0.0/16 \
  --master-zones=us-east-1b,us-east-1c,us-east-1d
```

Once you are satisfied with your configuration, run `kops update cluster ${NAME} --yes` to actually create the resources in AWS.

After a few moments, you should be able to run `kops export kubecfg --name=${NAME} --state=${KOPS_STATE_STORE}` to get the cluster's k8s context and set it as default so all future `kubectl` commands will target your new cluster.

## Whitelist your IP and access your cluster

- Go to [EC2 Security Groups](https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#SecurityGroups:sort=groupId)
- Find `masters.staging.cohesiv.io` and go to its `Inbound` rules, then click `Edit`
- Click `Add Rule` in the modal, of `type=HTTPS` and `source=My Ip` in the dropdown.
- Click `Save`

Once you've done that, `kubectl` will be allowed to access
the cluster from your machine. Run the following command to verify:

    kubectl get nodes

## Deploy foundation config and verify

To start, deploy the default k8s dashboard, which is very cool.

    kubectl create -f https://git.io/kube-dashboard
    kubectl proxy
  
You should be able to go to [127.0.0.1:8001/ui](127.0.0.1:8001/ui) and see a nice UI describing your cluster. Next, run

    kubectl apply -f kube/00-namespace.yaml

...and verify you've created the `cohesiv` namespace in your cluster by visiting [the namespaces section](http://127.0.0.1:8001/api/v1/namespaces/kube-system/services/kubernetes-dashboard/proxy/#!/namespace?namespace=default)


## Create secrets

Make note of your `RDS Endpoint` from the “Set up RDS” step at [Set Up Storage](docs/set-up-storage).

    touch kube/secrets/cohesiv-secrets.yaml
    echo -n "postgres://USER:PASSWORD@YOUR_RDS_ENDPOINT/cohesiv" | base64

Copy this yaml template into your newly created k8s secret, and replace the `staging-db-connection-string` with your base64 encoded one so we can use the value in our deployments as environment variables.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: cohesiv-secrets
  namespace: cohesiv
type: Opaque
data:
  staging-db-connection-string: BASE64ENCODEDSTRING=
```

Run this command to securely create your secret in your cluster

    kubectl apply -f kube/secrets/cohesiv-secrets.yaml

You should be able to see a `cohesiv-secrets` secret [here](http://127.0.0.1:8001/api/v1/namespaces/kube-system/services/kubernetes-dashboard/proxy/#!/secret?namespace=cohesiv)

## Initial deployment

Ideally, you should set up automated [continuous
deployments](docs/set-up-continuous-build.md).

Apply your k8s configs:

    # create some namespaces
    kubectl apply -f kube/lego/00-namespace.yaml
    kubectl apply -f kube/nginx/00-namespace.yaml

    # Create an external-dns deployment to watch ingress controllers and modify Route53 DNS settings on your behalf
    kubectl apply -f kube/misc/external-dns.yaml

    # Create a default http backend
    kubectl apply -f kube/nginx/default-deployment.yaml
    kubectl apply -f kube/nginx/default-service.yaml

    # Create nginx ingress
    kubectl apply -f kube/nginx/configmap.yaml
    kubectl apply -f kube/nginx/service-staging.yaml
    kubectl apply -f kube/nginx/deployment.yaml

The nginx service uses a LoadBalancer to publish the service. A few minutes after you have added the nginx service, you will get it's public IP address or domain via kubectl:

    kubectl describe svc nginx --namespace nginx-ingress

    # Enable kube-lego for automatic TLS with LetsEncrypt
    kubectl apply -f lego/configmap.yaml
    kubectl apply -f lego/deployment.yaml

#### (Optional) Create an echoserver deployment to test that everything's working

    kubectl apply -f kube/misc/echoserver-staging/00-namespace
    kubectl apply -f kube/misc/echoserver # to apply all files recursively, namespace must exist first

- Make sure the echo service is available at [https://staging.cohesiv.io/]([https://staging.cohesiv.io/])