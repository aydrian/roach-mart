#!/bin/sh
# Check for CockroachDB local installation
command -v cockroach >/dev/null 2>&1 || { echo >&2 "cockroach binary not found\nPlease install CockroachDB and try again.\nhttps://www.cockroachlabs.com/docs/v23.1/install-cockroachdb"; exit 1; }
echo "🪳 Starting a local CockroachDB node in demo mode"
cockroach demo --insecure --no-example-database