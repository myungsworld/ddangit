# ddangit (딴짓)

> 심심할 때 가볍게 즐기는 하이퍼 캐주얼 미니게임 모음

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://ddangit.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## Features

- **7개의 미니게임** - 30초~3분 내로 즐길 수 있는 캐주얼 게임
- **실시간 리더보드** - Upstash Redis 기반 일일 랭킹 시스템
- **다국어 지원** - 한국어 / English
- **반응형 디자인** - 모바일, 태블릿, 데스크톱 지원
- **SEO 최적화** - sitemap, robots.txt 자동 생성, 게임별 가이드 페이지
- **SNS 자동 홍보** - GitHub Actions로 Twitter/Bluesky 자동 포스팅
- **광고 수익화** - Google AdSense 연동

---

## Games

| Game | Type | Description | Time |
|:----:|:----:|-------------|:----:|
| 🧱 **Sand Tetris** | Puzzle | 물리 엔진 기반 샌드 테트리스 | ~3분 |
| 🧩 **Block Blast** | Puzzle | 8x8 그리드에 블록 배치하여 줄 완성 | ~3분 |
| ⚡ **Reaction Speed** | Reflex | 색상 변화 반응속도 테스트 | ~30초 |
| 🔗 **Color Chain** | Combo | 같은 색 연속 터치로 콤보 점수 획득 | ~30초 |
| 📦 **Tariff Dodge** | Survival | 떨어지는 장애물 피하기 서바이벌 | ~30초 |
| 🎨 **Color Match** | Cognitive | 스트룹 효과 테스트 - 글자색 맞추기 | ~30초 |
| 🪜 **Infinite Stairs** | Rhythm | 좌우 키로 무한 계단 오르기 | ~30초 |

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Database** | Upstash Redis |
| **Deployment** | Vercel |
| **CI/CD** | GitHub Actions |
| **Auth** | OAuth 1.0a (Twitter) |

---

## Project Structure

```
ddangit/
├── 📁 src/
│   ├── 📁 app/                      # Next.js App Router
│   │   ├── 📁 games/[gameId]/       # 동적 게임 라우트
│   │   │   ├── page.tsx             # 게임 플레이 페이지
│   │   │   └── guide/page.tsx       # 게임 가이드 페이지
│   │   ├── 📁 api/                  # API Routes
│   │   │   ├── ranking/route.ts     # 랭킹 조회/등록 API
│   │   │   └── promo/all/route.ts   # SNS 홍보 API
│   │   ├── layout.tsx               # 루트 레이아웃
│   │   ├── page.tsx                 # 홈페이지
│   │   ├── sitemap.ts               # 자동 생성 sitemap
│   │   └── robots.ts                # 자동 생성 robots.txt
│   │
│   ├── 📁 games/                    # 게임 모듈
│   │   ├── registry.tsx             # 게임 동적 import 레지스트리
│   │   ├── 📁 sand-tetris/          # 샌드 테트리스
│   │   ├── 📁 block-blast/          # 블록 블라스트
│   │   ├── 📁 reaction-speed/       # 반응속도 테스트
│   │   ├── 📁 color-chain/          # 컬러 체인
│   │   ├── 📁 tariff-dodge/         # 관세 피하기
│   │   ├── 📁 color-match/          # 컬러 매치
│   │   └── 📁 infinite-stairs/      # 무한 계단
│   │
│   ├── 📁 shared/                   # 공용 모듈
│   │   ├── 📁 constants/
│   │   │   └── games.ts             # ⭐ 게임 메타데이터 (SSoT)
│   │   ├── 📁 components/           # 공용 컴포넌트
│   │   │   ├── ui/                  # Button, etc.
│   │   │   ├── ad/                  # AdSense 컴포넌트
│   │   │   ├── game/                # GameCard, GameResult
│   │   │   └── layout/              # 레이아웃 컴포넌트
│   │   ├── 📁 i18n/                 # 다국어 번역
│   │   │   ├── ko.json              # 한국어
│   │   │   └── en.json              # English
│   │   ├── 📁 types/                # TypeScript 타입 정의
│   │   └── 📁 contexts/             # React Context
│   │
│   ├── 📁 infrastructure/           # 외부 연동
│   │   ├── 📁 social/               # SNS 어댑터
│   │   │   ├── adapters/            # Twitter, Bluesky
│   │   │   └── templates.ts         # 홍보 메시지 템플릿
│   │   └── 📁 storage/              # 저장소 어댑터
│   │
│   ├── 📁 features/                 # 기능 모듈
│   └── 📁 lib/                      # 유틸리티
│
├── 📁 docs/                         # 문서
│   ├── game-ideas.md                # 게임 아이디어
│   ├── cron-jobs.md                 # 자동화 작업
│   └── development.md               # 개발 가이드
│
├── 📁 .github/workflows/            # GitHub Actions
│   └── daily-promo.yml              # 일일 SNS 홍보
│
├── CLAUDE.md                        # AI 개발 가이드
├── package.json
├── tsconfig.json
└── next.config.ts
```

### 게임 모듈 구조

각 게임은 독립적인 모듈로 구성:

```
src/games/[game-id]/
├── index.ts              # 메인 export
├── 📁 components/        # 게임 UI 컴포넌트
├── 📁 hooks/             # 게임 로직 (useGame hook)
├── 📁 constants/         # 게임 설정값
├── 📁 types/             # 타입 정의
└── 📁 utils/             # 헬퍼 함수
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# 저장소 클론
git clone https://github.com/myungsworld/ddangit.git
cd ddangit

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일 편집

# 개발 서버 실행
npm run dev
```

http://localhost:3000 에서 확인

### Scripts

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버
npm run lint     # ESLint 검사
```

---

## Environment Variables

```env
# Upstash Redis (랭킹)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Twitter API (SNS 홍보)
TWITTER_API_KEY=
TWITTER_API_SECRET=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_SECRET=

# Bluesky (SNS 홍보)
BLUESKY_IDENTIFIER=
BLUESKY_PASSWORD=

# Google AdSense
NEXT_PUBLIC_ADSENSE_CLIENT_ID=
```

---

## Adding a New Game

새 게임 추가 시 체크리스트:

### 1. 메타데이터 등록
```typescript
// src/shared/constants/games.ts
export const GAMES: GameMeta[] = [
  // ... 기존 게임들
  {
    id: 'new-game',
    name: { ko: '새 게임', en: 'New Game' },
    description: { ko: '설명', en: 'Description' },
    estimatedTime: '30s',
    guide: { /* 800+ 단어 가이드 */ }
  }
]
```

### 2. 게임 구현
```
src/games/new-game/
├── index.ts
├── components/NewGame.tsx
├── hooks/useNewGame.ts
├── constants/index.ts
└── types/index.ts
```

### 3. 레지스트리 등록
```typescript
// src/games/registry.tsx
'new-game': dynamic(() => import('./new-game'))
```

### 4. 번역 추가
```json
// src/shared/i18n/ko.json & en.json
{
  "newGame": {
    "title": "새 게임",
    "ranks": { "godlike": "...", ... }
  }
}
```

> 자세한 내용은 [CLAUDE.md](CLAUDE.md) 참조

---

## Architecture

### Single Source of Truth (SSoT)

모든 게임 메타데이터는 `src/shared/constants/games.ts`에서 관리:

```
games.ts (SSoT)
    ├── 홈페이지 게임 목록
    ├── sitemap.xml 자동 생성
    ├── 게임 가이드 페이지
    ├── SEO 메타데이터
    └── SNS 홍보 메시지
```

### Dynamic Import (Code Splitting)

게임 컴포넌트는 `registry.tsx`를 통해 lazy loading:

```typescript
// 게임 선택 시에만 해당 코드 로드
const GameComponent = gameRegistry[gameId]
```

### Leaderboard System

```
Client → POST /api/ranking → Upstash Redis
         └── 점수 검증, 일일 랭킹 저장
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [CLAUDE.md](CLAUDE.md) | AI 개발 가이드 & 체크리스트 |
| [docs/game-ideas.md](docs/game-ideas.md) | 게임 아이디어 & 로드맵 |
| [docs/cron-jobs.md](docs/cron-jobs.md) | 자동화 작업 설정 |
| [docs/development.md](docs/development.md) | 개발 가이드 |
| [docs/seo.md](docs/seo.md) | SEO 최적화 |

---

## Deployment

### Vercel (권장)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/myungsworld/ddangit)

1. Vercel에 저장소 연결
2. 환경 변수 설정
3. 자동 배포 완료

### GitHub Actions

- **daily-promo.yml**: 매일 자동으로 랜덤 게임 SNS 홍보 (현재 비활성화)

---

## License

MIT License - 자유롭게 사용, 수정, 배포 가능

---

<p align="center">
  <a href="https://ddangit.vercel.app">
    <strong>🎮 딴짓하러 가기 →</strong>
  </a>
</p>
