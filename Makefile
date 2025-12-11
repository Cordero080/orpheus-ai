# Pneuma Development Commands

# Start backend server
s:
	cd server && node index.js

# Start frontend dev server
c:
	cd client && npm run dev

# Install all dependencies
install:
	cd server && npm install
	cd client && npm install

# Start both (run in separate terminals or use 'make dev')
dev:
	@echo "Starting backend and frontend..."
	@make server & make client

.PHONY: server client install dev
