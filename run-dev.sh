#!/bin/bash
# Script to run both backend and frontend servers concurrently

# Run backend
echo "Starting backend server..."
(cd backend && npm run dev) &

# Run frontend
echo "Starting frontend server..."
npm run dev
