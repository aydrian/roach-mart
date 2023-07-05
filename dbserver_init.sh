#!/bin/sh
# Check that local CockroachDB is running
# command -v cockroachdb >/dev/null 2>&1 || { echo >&2 "Local CockroachDB Node isn't running.\nPlease first execute start_dbserver.sh in another terminal."; exit 1; }
echo "🪳 Creating the roach_mart database"
cockroach sql --insecure --execute "CREATE DATABASE roach_mart;"

echo "▵ Creating the database schema using Prisma"
npx prisma db push

echo "🌱 Seeding the database using Prisma"
npx prisma db seed

echo "⏳ Activating Row-Level TTL on the cart_items table"
npx prisma db execute --file ./prisma/row-level-ttl.sql

echo "🎉 Your local CockroachDB server is ready!"
echo "Use connection string: postgresql://root@localhost:26257/roach_mart"
echo "Connect using cockroach sql --insecure -d roach_mart"