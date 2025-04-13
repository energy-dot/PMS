@echo off
echo "Stopping system..."
docker-compose -f docker-compose-dev.yml down
echo "System stopped"
pause
