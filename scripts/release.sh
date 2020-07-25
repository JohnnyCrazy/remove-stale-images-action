#!/bin/bash

set -e

exact_version="$1"
major_version="$2"

if [ -z "$(git status --porcelain)" ]; then
  yarn run all

  git add -A
  git commit -m "Prepare Release $exact_version"

  git tag "$exact_version"
  git tag -fa "$major_version" -m "Update $major_version tag"

  git push origin "$exact_version"
  git push origin "$major_version" --force
else
  echo "GIT workspace not clean - unable to release"
fi

