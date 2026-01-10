.PHONY: dev build prod down clean logs deploy deploy-preview fresh

# Docker
dev:
	@rm -rf .next
	docker compose up dev

# 캐시 완전 정리 후 새로 빌드
fresh:
	@rm -rf .next
	docker compose down -v
	docker compose build --no-cache dev
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

# Vercel Deploy
deploy:
	@if [ -f .env.local ]; then \
		export $$(cat .env.local | xargs) && \
		vercel --prod --token $$VERCEL_TOKEN --yes; \
	else \
		echo "Error: .env.local not found. Create it with VERCEL_TOKEN=your_token"; \
	fi

deploy-preview:
	@if [ -f .env.local ]; then \
		export $$(cat .env.local | xargs) && \
		vercel --token $$VERCEL_TOKEN --yes; \
	else \
		echo "Error: .env.local not found. Create it with VERCEL_TOKEN=your_token"; \
	fi
