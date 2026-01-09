.PHONY: dev build prod down clean logs

dev:
	docker compose up dev

build:
	docker compose build prod

prod:
	docker compose up prod

down:
	docker compose down

clean:
	docker compose down -v --rmi local

logs:
	docker compose logs -f
