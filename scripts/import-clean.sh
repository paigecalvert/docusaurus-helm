#!/usr/bin/env bash
set -e

ZIP_URL="https://github.com/helm/helm-www/archive/refs/heads/main.zip"
TMP="$(mktemp -d)"
ROOT="helm-www-main"

curl -LsS -o "$TMP/r.zip" "$ZIP_URL"
unzip -q "$TMP/r.zip" "${ROOT}/content/en/*" -d "$TMP"

rm -rf versioned_docs/version-3.0 blog
mv "$TMP/${ROOT}/content/en/docs" "versioned_docs/version-3.0"
mv "$TMP/${ROOT}/content/en/blog" "blog"

git restore blog/authors.yml
