#!/bin/bash

RELEASE_VERSION=$(node -e "console.log(require('./package.json').version)")
PACKAGE_NAME=$(node -e "console.log(require('./package.json').name)")
RELEASE_NAME=$PACKAGE_NAME@$RELEASE_VERSION

echo "RELEASE_NAME: $RELEASE_NAME"

npx sentry-cli releases new $RELEASE_NAME
npx sentry-cli releases files $RELEASE_NAME upload-sourcemaps .next --rewrite --url-prefix "~/_next"
npx sentry-cli releases finalize $RELEASE_NAME
