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

  # .env.local에서 API 키 로드
  if [ -f .env.local ]; then
    export $(grep -v '^#' .env.local | grep PROMO_API_KEY | xargs 2>/dev/null)
  fi

  if [ -z "$PROMO_API_KEY" ]; then
    echo -e "${RED}❌ PROMO_API_KEY not found${NC}"
    echo "Set it in .env.local or export PROMO_API_KEY=your_key"
    exit 1
  fi
else
  echo -e "${RED}❌ Unknown environment: $ENV${NC}"
  echo "Usage: ./scripts/promo.sh [local|prod] [platform]"
  exit 1
fi

# API 호출
ENDPOINT="/api/promo/all"
URL="${BASE_URL}${ENDPOINT}"

# 플랫폼별 JSON body 설정
if [ "$PLATFORM" = "all" ]; then
  BODY='{"platforms":["twitter","bluesky"]}'
elif [ "$PLATFORM" = "twitter" ]; then
  BODY='{"platforms":["twitter"]}'
elif [ "$PLATFORM" = "bluesky" ]; then
  BODY='{"platforms":["bluesky"]}'
else
  echo -e "${RED}❌ Unknown platform: $PLATFORM${NC}"
  echo "Available: all, twitter, bluesky"
  exit 1
fi

echo "Calling: POST $URL"
echo "Body: $BODY"
echo ""

# 프로덕션이면 API 키 헤더 추가
if [ "$ENV" = "prod" ]; then
  RESPONSE=$(curl -s -X POST "$URL" \
    -H "Content-Type: application/json" \
    -H "x-api-key: $PROMO_API_KEY" \
    -d "$BODY")
else
  RESPONSE=$(curl -s -X POST "$URL" \
    -H "Content-Type: application/json" \
    -d "$BODY")
fi

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
