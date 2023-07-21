#!/usr/bin/bash
set -e

BASEDIR=$(dirname $0)

deno run --allow-net $BASEDIR/jitok.ts
