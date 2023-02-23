#!/bin/bash
set -e

BASEDIR=$(dirname $0)

if [[ -n "$API_URL" ]]; then
  sed -i "/^export .* API_URL/ s~=.*~= \"$API_URL\";~" \
    $BASEDIR/src/lib/config.ts
fi
