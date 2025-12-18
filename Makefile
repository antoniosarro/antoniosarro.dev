.PHONY: help dev build preview install format lint check docker

-include .env
export

# Development
help: ## Show this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-18s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	pnpm install

dev: ## Start dev server
	pnpm run dev

build: ## Build for production
	pnpm run build:prod

preview: ## Preview build
	pnpm run preview

format: ## Format code
	pnpm run format

lint: ## Lint code
	pnpm run lint

check: ## Type check
	pnpm run check

validate: ## Run all checks
	pnpm run validate

# Docker
docker-build: ## Build Docker image
	docker compose build

docker-up: ## Start containers
	docker compose up -d

docker-down: ## Stop containers
	docker compose down

docker-logs: ## Show logs
	docker compose logs -f

docker-clean: docker-down ## Clean up Docker
	docker compose down -v --rmi local

# Production
prod-build: ## Build production image
	docker compose -f docker-compose.prod.yaml build

prod-up: ## Start production
	docker compose -f docker-compose.prod.yaml up -d

prod-down: ## Stop production
	docker compose -f docker-compose.prod.yaml down