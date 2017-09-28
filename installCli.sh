IFS=' ' read -r -a array <<< $(go list -f '{{ join .Imports " "}}' github.com/SingularityInteractive/cohesiv)
for element in "${array[@]}"
do
    echo "$element"
    go get "$element"
done
[ -z "$GOBIN" ] && export GOBINZ=$GOPATH/bin
go install cohesiv.go
echo "cohesiv Command Line Interface has been installed"
cohesiv