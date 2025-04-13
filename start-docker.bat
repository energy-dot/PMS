@echo off
echo "Starting system with docker-compose..."
docker-compose -f docker-compose-dev.yml down
docker-compose -f docker-compose-dev.yml up --build -d
echo "System started at:"
echo "Frontend: http://localhost:3002"
echo "Backend: http://localhost:3001"
echo "To view logs, run: docker-compose -f docker-compose-dev.yml logs -f"
echo "To stop the system, run: docker-compose -f docker-compose-dev.yml down"
pause
