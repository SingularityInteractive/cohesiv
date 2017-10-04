go build -o $GOPATH/bin/cohesiv github.com/SingularityInteractive/cohesiv/cli
[ -z "$GOBIN" ] && export GOBIN=$GOPATH/bin
go install cohesiv.go
echo "cohesiv Command Line Interface has been installed"
cohesiv