# Running microservices directly outside containers

For quick dev-test cycle, you can locally run all three microservices
(each in a different terminal window) directly on your machine.

To download the source code:

    $ git clone https://github.com/SingularityInteractive/cohesiv ~/$GOPATH/src/github.com/SingularityInteractive/cohesiv
    $ cd ~/$GOPATH/src/github.com/SingularityInteractive/cohesiv
    $ export GOOGLE_APPLICATION_CREDENTIALS=./misc/secrets/google/credentials.json

Then using the `go` tool, you can run the microservices.

### Start CloudSQL Proxy

```
cloud_sql_proxy -instances=polished-bridge-169215:us-central1:development=tcp:3306 \
    -credential_file=./misc/secrets/google/credentials.json &
```

### Start tag/activity service

```
go run ./tagdirectory/*.go --addr=:8002
```

### Start the api

```
cd web 

go run *.go --addr=:8000 \
    --tag-directory-addr=:8002
```
