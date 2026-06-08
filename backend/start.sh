#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma db push --accept-data-loss

echo "Seeding database..."
node -e "require('./prisma/seed.js')" 2>/dev/null || tsx prisma/seed.ts 2>/dev/null || echo "Seed skipped (already seeded)"

echo "Starting server..."
exec node server.js
