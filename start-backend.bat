@echo off
echo "Starting backend server..."
cd %~dp0\backend
call npm run start:dev
