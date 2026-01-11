# Development Guide

## Quick Start

### Docker (권장)

```bash
make dev        # 개발 서버 (캐시 자동 정리)
make fresh      # 완전 재빌드 (node_modules 포함)
make build      # 프로덕션 빌드
make prod       # 프로덕션 서버
make down       # 컨테이너 중지
```

### Local

```bash
npm install
npm run dev
```

---

## Deploy

### Setup

1. https://vercel.com/account/tokens 에서 토큰 발급
2. `.env.local` 생성:
```bash
VERCEL_TOKEN=your_token_here
```

### Commands

```bash
make deploy          # 프로덕션 배포
make deploy-preview  # 프리뷰 배포
```

---

## Environment Variables

### Production (Vercel Dashboard)

```bash
# Storage
STORAGE_TYPE=vercel-kv
KV_REST_API_URL=https://xxx.upstash.io
KV_REST_API_TOKEN=xxx

# Twitter Promo
TWITTER_API_KEY=xxx
TWITTER_API_SECRET=xxx
TWITTER_ACCESS_TOKEN=xxx
TWITTER_ACCESS_SECRET=xxx
```

### Development (Docker)

Docker 환경에서는 `STORAGE_TYPE=memory`가 자동 설정됨 (`docker-compose.yml`)

---

## Tech Stack

- **Framework:** Next.js 16, TypeScript
- **Styling:** Tailwind CSS
- **Storage:** Upstash Redis (prod), In-memory (dev)
- **Hosting:** Vercel
- **Graphics:** Canvas 2D (Sand Tetris)
- **Ads:** Google AdSense

---

## Adding a New Game

1. `src/games/[game-name]/` 폴더 구조 생성
2. `src/app/games/[game-name]/page.tsx` 라우트 생성
3. `src/shared/constants/games.ts`에 게임 정보 추가
4. `src/lib/ranking/types.ts`에 점수 정렬 규칙 추가

---

## Features

### Ranking System

게임 종료 시 Today's Top 3 랭킹 표시
- Top 3 진입 시 닉네임 입력 후 랭킹 등록
- 게임별 점수 정렬 규칙 (낮을수록 좋음: Reaction, Aim / 높을수록 좋음: Memory, Typing, Tetris)
- Upstash Redis에 저장 (일별 TTL 25시간)

### Promo System

Twitter 자동 홍보
- Vercel Cron (매일 09:00 UTC)
- 랜덤 해시태그 + 메시지 템플릿 (한/영)
- 자세한 내용: [cron-jobs.md](cron-jobs.md)
