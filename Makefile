.PHONY: all setup run stop test lint docker-build docker-up migrate upgrade seed help

help:
	@echo "Commands:"
	@echo "  setup          : Install backend and frontend dependencies."
	@echo "  run            : Run backend and frontend in development mode (using docker-compose)."
	@echo "  stop           : Stop all running docker containers."
	@echo "  test           : Run backend tests."
	@echo "  lint           : Lint backend python code."
	@echo "  docker-build   : Build docker images for all services."
	@echo "  docker-up      : Start all services with docker-compose."
	@echo "  migrate        : Create a new database migration."
	@echo "  upgrade        : Apply database migrations."
	@echo "  seed           : Seed the database with initial data."

setup:
	@echo "--- Setting up backend ---"
	@python -m venv backend/venv
	@./backend/venv/bin/pip install -r backend/requirements.txt
	@echo "--- Setting up frontend ---"
	@npm install --prefix frontend

run: docker-up

stop:
	@docker-compose down

test:
	@echo "--- Running backend tests ---"
	@docker-compose run --rm api pytest

lint:
	@echo "--- Linting backend code ---"
	@docker-compose run --rm api flake8 src

docker-build:
	@docker-compose build

docker-up:
	@docker-compose up --build

migrate:
	@read -p "Enter migration message: " msg; \
	docker-compose run --rm api flask db migrate -m "$$msg"

upgrade:
	@docker-compose run --rm api flask db upgrade

seed:
	@docker-compose run --rm api flask seed