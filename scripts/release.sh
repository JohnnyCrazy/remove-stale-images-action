#!/bin/bash

set -e

exact_version="$1"
major_version="$2"

git tag "$exact_version"
git tag -fa "$major_version" -m "Update $major_version tag"

git push origin "$exact_version"
git push origin "$major_version" --force
