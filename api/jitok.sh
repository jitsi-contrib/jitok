#!/bin/bash
set -e

BASEDIR=$(dirname $0)

deno run --allow-net --allow-run $BASEDIR/jitok.ts
