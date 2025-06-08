@echo off
echo Starting Backend...
cd backend
start "Backend" cmd /c "set PORT=3001 && npm run dev"

echo Starting Frontend...
cd ../frontend
start "Frontend" cmd /c "set REACT_APP_API_URL=http://localhost:3001/api && set PORT=3000 && npm start"     