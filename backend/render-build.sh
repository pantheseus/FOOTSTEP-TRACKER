#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build
npx prisma generate
npx prisma migrate deploy # Correct way to apply migrations to production
