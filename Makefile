.PHONY: help install install-backend install-frontend start start-mongo start-backend start-frontend dev stop clean check

# Default target
help:
	@echo "========================================"
	@echo "   DermAI - Makefile Commands"
	@echo "========================================"
	@echo ""
	@echo "Available commands:"
	@echo "  make install          - Install all dependencies (backend + frontend)"
	@echo "  make install-backend  - Install backend dependencies only"
	@echo "  make install-frontend - Install frontend dependencies only"
	@echo "  make start-mongo      - Start MongoDB service"
	@echo "  make start-backend    - Start backend server (port 3000)"
	@echo "  make start-frontend   - Start frontend server (port 3001)"
	@echo "  make dev              - Start everything (MongoDB + Backend + Frontend)"
	@echo "  make stop             - Stop all running services"
	@echo "  make clean            - Clean node_modules and build files"
	@echo "  make check            - Check if backend is running"
	@echo "  make restart-backend  - Restart backend server"
	@echo "  make start-backend-no-db - Start backend without MongoDB"
	@echo ""
	@echo "Quick start:"
	@echo "  make dev              - Start the entire project"
	@echo ""

# Detect OS
ifeq ($(OS),Windows_NT)
    DETECTED_OS := Windows
    NPM := npm
    MONGODB_START := net start MongoDB
    MONGODB_CHECK := sc query MongoDB | find "RUNNING"
else
    DETECTED_OS := $(shell uname -s)
    NPM := npm
    MONGODB_START := sudo systemctl start mongod || brew services start mongodb-community || mongod --fork --logpath /var/log/mongodb/mongod.log
    MONGODB_CHECK := pgrep mongod > /dev/null
endif

# Install all dependencies
install: install-backend install-frontend
	@echo "✅ All dependencies installed!"

# Install backend dependencies
install-backend:
	@echo "📦 Installing backend dependencies..."
	cd backend && $(NPM) install
	@echo "✅ Backend dependencies installed!"

# Install frontend dependencies
install-frontend:
	@echo "📦 Installing frontend dependencies..."
	cd frontend && $(NPM) install
	@echo "✅ Frontend dependencies installed!"

# Start MongoDB
start-mongo:
	@echo "🍃 Starting MongoDB..."
ifeq ($(DETECTED_OS),Windows)
	@powershell -Command "Get-Service MongoDB -ErrorAction SilentlyContinue | ForEach-Object { if ($$_.Status -ne 'Running') { Start-Service MongoDB; Start-Sleep -Seconds 2 } }" || echo "⚠️  MongoDB might not be installed as a service. Please start it manually."
	@echo "✅ MongoDB should be running!"
else
	@$(MONGODB_CHECK) || $(MONGODB_START)
	@echo "✅ MongoDB should be running!"
endif

# Start backend server
start-backend:
	@echo "🚀 Starting backend server (NestJS)..."
	@echo "   Backend will run on http://localhost:3000"
	cd backend && $(NPM) run start:dev

# Start backend without MongoDB
start-backend-no-db:
	@echo "🚀 Starting backend server (NestJS) without MongoDB..."
	@echo "   Backend will run on http://localhost:3000"
ifeq ($(DETECTED_OS),Windows)
	@powershell -ExecutionPolicy Bypass -File ./start-without-mongodb.ps1
else
	@NO_DB=true cd backend && $(NPM) run start:dev
endif

# Start frontend server
start-frontend:
	@echo "🎨 Starting frontend server (Next.js)..."
	@echo "   Frontend will run on http://localhost:3001"
	cd frontend && $(NPM) run dev

# Start everything (development mode)
dev: start-mongo
	@echo ""
	@echo "========================================"
	@echo "   Starting DermAI Development Servers"
	@echo "========================================"
	@echo ""
ifeq ($(DETECTED_OS),Windows)
	@powershell -ExecutionPolicy Bypass -File ./start.ps1
else
	@echo "Starting backend and frontend in parallel..."
	@cd backend && $(NPM) run start:dev & \
	cd frontend && $(NPM) run dev & \
	echo "" && \
	echo "========================================" && \
	echo "   Servers are starting!" && \
	echo "========================================" && \
	echo "" && \
	echo "Frontend: http://localhost:3001" && \
	echo "Backend:  http://localhost:3000" && \
	echo "" && \
	echo "Press Ctrl+C to stop all servers" && \
	wait
endif

# Stop all services
stop:
	@echo "🛑 Stopping services..."
ifeq ($(DETECTED_OS),Windows)
	@echo "Closing backend and frontend windows..."
	@taskkill /FI "WINDOWTITLE eq DermAI Backend*" /T /F 2>nul || echo "Backend not running"
	@taskkill /FI "WINDOWTITLE eq DermAI Frontend*" /T /F 2>nul || echo "Frontend not running"
	@echo "✅ Services stopped!"
else
	@pkill -f "nest start" || echo "Backend not running"
	@pkill -f "next dev" || echo "Frontend not running"
	@echo "✅ Services stopped!"
endif

# Restart backend
restart-backend:
	@echo "🔄 Restarting backend server..."
ifeq ($(DETECTED_OS),Windows)
	@powershell -ExecutionPolicy Bypass -File ./restart-backend.ps1
else
	@echo "Stopping backend..."
	@pkill -f "nest start" || echo "Backend not running"
	@sleep 2
	@echo "Starting backend..."
	@cd backend && $(NPM) run start:dev &
	@echo "✅ Backend restarted!"
endif

# Check backend status
check:
	@echo "🔍 Checking backend status..."
ifeq ($(DETECTED_OS),Windows)
	@powershell -ExecutionPolicy Bypass -File ./check-backend.ps1
else
	@echo "Checking if backend is running on port 3000..."
	@netstat -an | grep :3000 | grep LISTEN > /dev/null && echo "✅ Backend is running on port 3000" || echo "❌ Backend is NOT running on port 3000"
	@echo ""
	@echo "To start backend: make start-backend"
endif

# Clean build files and node_modules
clean:
	@echo "🧹 Cleaning project..."
	@echo "Removing node_modules..."
ifeq ($(DETECTED_OS),Windows)
	@powershell -Command "Remove-Item -Recurse -Force -ErrorAction SilentlyContinue backend/node_modules, frontend/node_modules"
	@echo "Removing build files..."
	@powershell -Command "Remove-Item -Recurse -Force -ErrorAction SilentlyContinue backend/dist, frontend/.next, frontend/out"
else
	@rm -rf backend/node_modules frontend/node_modules
	@echo "Removing build files..."
	@rm -rf backend/dist frontend/.next frontend/out
endif
	@echo "✅ Clean complete!"

