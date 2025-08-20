#!/bin/bash

# New Relic Dashboard Test Script
# This script tests various API endpoints to feed the dashboard

BASE_URL="http://localhost:3000"

echo "🚀 Starting New Relic Dashboard Test Script..."
echo "=================================="

# Home page tests
echo "📊 Home page tests..."
for i in {1..10}; do
  curl -s "$BASE_URL/" > /dev/null
  echo -n "."
done
echo " ✅ Completed"

# User list tests
echo "📊 User list tests..."
for i in {1..15}; do
  curl -s "$BASE_URL/api/users" > /dev/null
  echo -n "."
done
echo " ✅ Completed"

# User detail tests
echo "📊 User detail tests..."
for i in {1..20}; do
  USER_ID=$((RANDOM % 100 + 1))
  curl -s "$BASE_URL/api/user/$USER_ID" > /dev/null
  echo -n "."
done
echo " ✅ Completed"

# User creation tests (successful)
echo "📊 User creation tests (successful)..."
for i in {1..8}; do
  curl -s -X POST "$BASE_URL/api/users" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"Test User $i\", \"email\": \"test$i@example.com\"}" > /dev/null
  echo -n "."
done
echo " ✅ Completed"

# User creation tests (with errors)
echo "📊 User creation tests (with errors)..."
for i in {1..5}; do
  curl -s -X POST "$BASE_URL/api/users" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"Test User $i\"}" > /dev/null
  echo -n "."
done
echo " ✅ Completed"

# Load test
echo "📊 Running load test..."
curl -s "$BASE_URL/api/test/load?type=dashboard&iterations=50" > /dev/null
echo " ✅ Completed"

# Metrics display
echo "📊 Metrics tests..."
for i in {1..5}; do
  curl -s "$BASE_URL/api/metrics" > /dev/null
  echo -n "."
done
echo " ✅ Completed"

# Heavy traffic simulation
echo "📊 Heavy traffic simulation..."
for i in {1..30}; do
  # Random endpoint selection
  ENDPOINTS=("/" "/api/users" "/api/user/$((RANDOM % 50 + 1))" "/api/metrics")
  ENDPOINT=${ENDPOINTS[$((RANDOM % ${#ENDPOINTS[@]}))]}
  
  curl -s "$BASE_URL$ENDPOINT" > /dev/null &
  
  if (( i % 10 == 0 )); then
    echo -n " $i"
  else
    echo -n "."
  fi
  
  # Short wait
  sleep 0.1
done

# Wait for background jobs
wait

echo " ✅ Completed"

echo "=================================="
echo "🎉 Test completed! Check your dashboard:"
echo "   📈 New Relic Dashboard: https://one.newrelic.com"
echo "   🔍 Custom Events: HomePage, UserDetail, UsersList, UserCreationSuccess, UserCreationError"
echo "   📊 Custom Metrics: Custom/HomePage/Visits, Custom/UserDetail/Requests, etc."
echo "   ⚡ Load Test: Executed via API"
echo "=================================="
