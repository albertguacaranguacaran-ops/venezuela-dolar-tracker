#!/bin/bash
echo "🚀 Iniciando Venezuela Dolar Tracker..."

# Start backend
echo "📦 Iniciando Backend..."
cd backend
npm install &>/dev/null
npm run start:dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Iniciando Frontend..."
cd ../frontend
npm install &>/dev/null
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Aplicación iniciada!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3000"
echo ""
echo "Presiona Ctrl+C para detener..."

wait
