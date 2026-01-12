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
		export $$(grep -v '^#' .env.local | grep -v '^$$' | xargs) && \
		vercel --prod --token $$VERCEL_TOKEN --yes && \
		echo "Cleaning up old deployments..." && \
		vercel ls --token $$VERCEL_TOKEN 2>&1 | grep 'https://' | tail -n +6 | awk '{print $$2}' > /tmp/vercel_urls.txt && \
		while read url; do [ -n "$$url" ] && vercel rm "$$url" --token $$VERCEL_TOKEN --yes 2>/dev/null || true; done < /tmp/vercel_urls.txt && \
		rm -f /tmp/vercel_urls.txt && \
		echo "Done! Kept latest 5 deployments."; \
	else \
		echo "Error: .env.local not found. Create it with VERCEL_TOKEN=your_token"; \
	fi

deploy-preview:
	@if [ -f .env.local ]; then \
		export $$(grep -v '^#' .env.local | grep -v '^$$' | xargs) && \
		vercel --token $$VERCEL_TOKEN --yes; \
	else \
		echo "Error: .env.local not found. Create it with VERCEL_TOKEN=your_token"; \
	fi
