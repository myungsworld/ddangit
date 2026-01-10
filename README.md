# ddangit

심심할 때 하는 미니게임 모음

**Live:** https://ddangit.vercel.app

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── api/
│   │   ├── promo/            # 홍보 자동화 API
│   │   │   ├── route.ts      # 전체 플랫폼 통합
│   │   │   └── twitter/      # Twitter API
│   │   └── ranking/          # 랭킹 API
│   ├── games/
│   │   ├── reaction-speed/
│   │   ├── aim-trainer/
│   │   ├── number-memory/
│   │   ├── typing-speed/
│   │   └── sand-tetris/
│   ├── privacy/              # 개인정보처리방침 (AdSense용)
│   ├── layout.tsx
│   └── page.tsx
│
├── games/                    # 게임 모듈 (독립적)
│   └── [game-name]/
│       ├── components/       # 게임 UI
│       ├── hooks/            # 게임 로직
│       ├── types/            # 타입 정의
│       ├── constants/        # 설정값
│       └── utils/            # 유틸리티 (sand-tetris: 물리 엔진)
│
├── infrastructure/           # 인프라 추상화 레이어
│   ├── storage/              # 스토리지 어댑터 (Memory, Upstash)
│   │   ├── adapters/
│   │   │   └── memory.ts     # 인메모리 (개발용)
│   │   ├── types/
│   │   └── index.ts          # 팩토리 + Upstash 어댑터
│   └── social/               # SNS 플랫폼 어댑터
│       ├── adapters/
│       │   ├── twitter.ts
│       │   └── discord.ts
│       ├── types/
│       └── templates.ts      # 메시지 템플릿
│
├── lib/                      # 비즈니스 로직
│   └── ranking/              # 랭킹 서비스
│       ├── service.ts        # 랭킹 체크/제출/조회
│       └── types.ts          # 게임별 점수 정렬 규칙
│
└── shared/                   # 공용 모듈
    ├── components/
    │   ├── ui/               # Button 등 기본 UI
    │   ├── game/             # GameLayout, GameResult, RankingBoard
    │   └── ad/               # AdSlot (광고)
    ├── hooks/
    │   └── useRanking.ts     # 랭킹 API 훅
    ├── types/
    └── constants/

docs/
└── dev-log.md                # 개발일지

public/
└── ads.txt                   # AdSense 인증 파일
```

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

## Tech Stack

- **Framework:** Next.js 16, TypeScript
- **Styling:** Tailwind CSS
- **Storage:** Upstash Redis (prod), In-memory (dev)
- **Hosting:** Vercel
- **Graphics:** Canvas 2D (Sand Tetris)
- **Ads:** Google AdSense

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

---

## Adding a New Game

1. `src/games/[game-name]/` 폴더 구조 생성
2. `src/app/games/[game-name]/page.tsx` 라우트 생성
3. `src/shared/constants/games.ts`에 게임 정보 추가
4. `src/lib/ranking/types.ts`에 점수 정렬 규칙 추가

---

## Games

| Game | Description | Status |
|------|-------------|--------|
| ⚡ Reaction Speed | 반응속도 테스트 | ✅ |
| 🎯 Aim Trainer | 움직이는 타겟 맞추기 | ✅ |
| 🔢 Number Memory | 숫자 기억하기 | ✅ |
| ⌨️ Typing Speed | 타이핑 속도 | ✅ |
| 🧱 Sand Tetris | 같은 색을 좌→우로 연결 | ✅ |

---

## Documentation

- [개발일지](docs/dev-log.md) - 진행상황 및 다음 할 일
