#!/bin/bash

set -e

amount="${1:-10}"

docker pull alpine:3.12.0

for i in $(seq 1 $amount); do
  docker tag alpine:3.12.0 docker.pkg.github.com/johnnycrazy/remove-stale-images-action/test:$i
  docker push docker.pkg.github.com/johnnycrazy/remove-stale-images-action/test:$i
  docker rmi docker.pkg.github.com/johnnycrazy/remove-stale-images-action/test:$i
done
