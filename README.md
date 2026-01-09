# ddangit

Quick mini-games to kill time.

**Live:** https://ddangit.vercel.app

## Games

| Game | Description | Status |
|------|-------------|--------|
| ⚡ Reaction | Test your reflexes | ✅ |
| 🎯 Aim | Hit the targets | ✅ |
| 🔢 Memory | Remember the numbers | ✅ |
| ⌨️ Typing | Type as fast as you can | ✅ |
| 🧱 Sand Tetris | Tetris with sand physics | ✅ |

## Project Structure

```
src/
├── app/                      # Next.js App Router
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
└── shared/                   # 공용 모듈
    ├── components/
    │   ├── ui/               # Button 등 기본 UI
    │   ├── game/             # GameLayout, GameCard 등
    │   └── ad/               # AdSlot (광고)
    ├── hooks/
    ├── types/
    └── constants/

public/
└── ads.txt                   # AdSense 인증 파일
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
   - `components/` - 게임 UI 컴포넌트
   - `hooks/` - 게임 로직 (useXxxGame.ts)
   - `types/` - 타입 정의
   - `constants/` - 설정값
   - `utils/` - 유틸리티 함수 (선택)
   - `index.ts` - export
2. `src/app/games/[game-name]/page.tsx` 라우트 생성
3. `src/shared/constants/games.ts`에 게임 정보 추가

## AdSense

- 스크립트: `src/app/layout.tsx`
- 광고 컴포넌트: `src/shared/components/ad/AdSlot.tsx`
- ads.txt: `public/ads.txt`

광고 위치:
- 홈: 상단, 게임 사이, 하단
- 게임 페이지: 상단, 하단

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Canvas 2D (Sand Tetris)
- Vercel
- Google AdSense

## Development Log

### 2025-01-09
- 프로젝트 초기 설정 (Next.js + TypeScript + Tailwind)
- 클린 아키텍처 기반 폴더 구조 설계
- Docker + Makefile 설정
- 4개 게임 구현 (Reaction, Aim, Memory, Typing)
- AdSlot 컴포넌트로 광고 위치 확장 가능하게 설계
- Vercel 배포 설정 (make deploy)
- Privacy Policy 페이지 추가
- Google AdSense 연동
- Sand Tetris 구현 (Falling Sand 물리 + 테트리스)

---

## TODO (다음에 할 일)

### 1. 홍보 자동화 시스템
무료 홍보를 위한 자동 포스팅 스케줄러 구축

**대상 플랫폼:**
- Reddit (r/WebGames, r/indiegames 등)
- Twitter/X API
- Product Hunt
- Hacker News
- 디시인사이드, 클리앙 등 국내 커뮤니티

**구현 방향:**
- Vercel Cron Jobs 또는 GitHub Actions로 스케줄링
- 각 플랫폼 API 연동
- 게임별 홍보 문구 템플릿
- 포스팅 로그 관리

### 2. AdSense 승인 후
- 실제 광고 코드 AdSlot에 적용
- 광고 성과 모니터링

### 3. 추가 게임 아이디어
- Color Match (색상 매칭)
- Sequence Memory (시퀀스 기억)
- Math Speed (암산 속도)
