# ddangit

Quick mini-games to kill time.

## Games

| Game | Description | Status |
|------|-------------|--------|
| ⚡ Reaction | Test your reflexes | ✅ |
| 🎯 Aim | Hit the targets | ✅ |
| 🔢 Memory | Remember the numbers | ✅ |
| ⌨️ Typing | Type as fast as you can | ✅ |

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── games/
│   │   ├── reaction-speed/
│   │   ├── aim-trainer/
│   │   ├── number-memory/
│   │   └── typing-speed/
│   ├── layout.tsx
│   └── page.tsx
│
├── games/                    # 게임 모듈 (독립적)
│   └── [game-name]/
│       ├── components/       # 게임 UI
│       ├── hooks/            # 게임 로직
│       ├── types/            # 타입 정의
│       └── constants/        # 설정값
│
└── shared/                   # 공용 모듈
    ├── components/
    │   ├── ui/               # Button 등 기본 UI
    │   ├── game/             # GameLayout, GameCard 등
    │   └── ad/               # AdSlot (광고)
    ├── hooks/
    ├── types/
    └── constants/
```

## Quick Start

### Local

```bash
npm install
npm run dev
```

### Docker

```bash
make dev        # 개발 서버
make build      # 프로덕션 빌드
make prod       # 프로덕션 서버
make down       # 컨테이너 중지
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

## Adding a New Game

1. `src/games/[game-name]/` 폴더 구조 생성
2. `src/app/games/[game-name]/page.tsx` 라우트 생성
3. `src/shared/constants/games.ts`에 게임 정보 추가

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Vercel
