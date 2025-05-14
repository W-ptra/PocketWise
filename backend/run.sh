#!/bin/sh

echo "Waiting for PostgreSQL..."
until nc -z postgres-capstone 5432; do
  sleep 1
done
echo "PostgreSQL is up!"

echo "Waiting for Redis..."
until nc -z redis-capstone 6379; do
  sleep 1
done
echo "Redis is up!"

# ADD THIS LINE to wait extra time after DB is technically reachable
sleep 10

echo "Running Prisma migration..."
npx prisma migrate dev --name init || echo "Migration failed, continuing..."

echo "Generating Prisma client..."
npx prisma generate

echo "Starting app..."
npm run start
