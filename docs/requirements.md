# Requirements to run cohesiv

Cohesiv requires a [Google Cloud Platform](https://cloud.google.com) account
as it uses services such as:

- [Google Cloud SQL](http://cloud.google.com/sql/)
- [Google Cloud Storage](http://cloud.google.com/storage)
- [Google Container Engine](https://cloud.google.com/container-engine/)
- [Google Cloud Container Builder](https://cloud.google.com/container-builder/)

1. Log into your @singularity-interactive account [Google Cloud Platform Console](https://console.cloud.google.com).

1. Download the [`gcloud` command-line tool(https://cloud.google.com/sdk/gcloud/) and
   authenticate:

       # to install on macOS:
       brew cask install google-cloud-sdk

       gcloud auth login

1. Download the [`kubectl` command-line tool](https://kubernetes.io/docs/user-guide/kubectl-overview/)

       # to install on macOS
       brew install kubectl 

       # or use gcloud (works on other platforms as well)
       gcloud components install kubectl

1. Download the [cloud_sql_proxy](https://cloud.google.com/sql/docs/mysql/connect-admin-proxy)