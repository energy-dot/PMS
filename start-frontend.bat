@echo off
echo "Starting frontend server..."
cd %~dp0\frontend
call npm run dev
