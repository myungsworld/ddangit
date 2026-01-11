#!/bin/bash

# ddangit 프로모션 스크립트
# Usage: ./scripts/promo.sh [local|prod] [platform]

ENV=${1:-local}
PLATFORM=${2:-all}

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 ddangit Promo Script${NC}"
echo "Environment: $ENV"
echo "Platform: $PLATFORM"
echo ""

if [ "$ENV" = "local" ]; then
  BASE_URL="http://localhost:3000"
elif [ "$ENV" = "prod" ]; then
  BASE_URL="https://ddangit.vercel.app"
else
  echo -e "${RED}❌ Unknown environment: $ENV${NC}"
  echo "Usage: ./scripts/promo.sh [local|prod] [platform]"
  exit 1
fi

# API 호출
if [ "$PLATFORM" = "all" ]; then
  ENDPOINT="/api/promo/all"
elif [ "$PLATFORM" = "twitter" ]; then
  ENDPOINT="/api/promo/twitter"
else
  echo -e "${RED}❌ Unknown platform: $PLATFORM${NC}"
  echo "Available: all, twitter"
  exit 1
fi

URL="${BASE_URL}${ENDPOINT}"
echo "Calling: POST $URL"
echo ""

RESPONSE=$(curl -s -X POST "$URL" \
  -H "Content-Type: application/json" \
  -d '{}')

# 결과 출력
echo "Response:"
echo "$RESPONSE"

# 성공/실패 확인 (jq 없이 grep 사용)
if echo "$RESPONSE" | grep -q '"success":true'; then
  echo ""
  echo -e "${GREEN}✅ Promo sent successfully!${NC}"
else
  echo ""
  echo -e "${RED}❌ Promo failed${NC}"
  exit 1
fi
