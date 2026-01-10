# ddangit

심심할 때 하는 미니게임 모음

**Live:** https://ddangit.vercel.app

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
- [ ] 실제 광고 코드 AdSlot에 적용
- [ ] 광고 성과 모니터링

### 3. Games

| Game | Description | Status |
|------|-------------|--------|
| ⚡ Reaction | 반응속도 테스트 | ✅ |
| 🎯 Aim | 타겟 맞추기 | ✅ |
| 🔢 Memory | 숫자 기억하기 | ✅ |
| ⌨️ Typing | 타이핑 속도 | ✅ |
| 🧱 Sand Tetris | 같은 색을 좌→우로 연결 | 🚧 |

### 4. 추가 게임 아이디어

**클래식 게임 변형:**
| 게임 | 설명 | 원작 |
|------|------|------|
| Sand Tetris | 같은 색을 좌우 벽으로 연결하면 삭제 | 테트리스 + Falling Sand |
| Snake Puzzle | 뱀 게임인데 퍼즐 형식 | Snake |
| Breakout Tap | 원탭 벽돌깨기 | Breakout |
| Flappy Tap | 간단한 플래피버드 | Flappy Bird |
| 2048 Hex | 육각형 그리드의 2048 | 2048 |
| Minesweeper Mini | 5x5 빠른 지뢰찾기 | Minesweeper |

**반사신경 & 속도 게임:**
| 게임 | 설명 |
|------|------|
| Color Match | 색이 맞으면 탭 |
| Word Flash | 깜빡이는 단어 기억 |
| Math Speed | 빠른 암산 |
| Pattern Copy | 보여준 패턴 따라하기 |
| Sequence Memory | 점점 길어지는 시퀀스 기억 |
| Sound Memory | 소리로 하는 기억력 게임 |

**퍼즐 & 두뇌 게임:**
| 게임 | 설명 |
|------|------|
| Sliding Puzzle | 클래식 15퍼즐 |
| Connect Dots | 선 겹치지 않게 점 연결 |
| Color Sort | 색깔 공을 튜브별로 정리 |
| Word Search | 숨은 단어 찾기 |
| Sudoku Mini | 4x4 빠른 스도쿠 |
| Match 3 | 간단한 3매치 퍼즐 |

**캐주얼 & 재미:**
| 게임 | 설명 |
|------|------|
| Doodle Jump | 끝없는 점프 게임 |
| Stack Tower | 블록 최대한 높이 쌓기 |
| Fruit Slice | 스와이프로 과일 자르기 |
| Bubble Pop | 풍선 터뜨리기 |
| Paper Toss | 종이 쓰레기통에 던지기 |
| Fishing | 간단한 낚시 게임 |

---

## Development Log

### 2025-01-10
- Sand Tetris 대규모 업데이트
  - 새 메카닉: 같은 색을 왼쪽 벽에서 오른쪽 벽까지 연결하면 삭제
  - 클리어 애니메이션 (깜빡임 효과)
  - 4가지 색상으로 정리
  - 블록이 상단에서 시작, 위험 구역에 모래가 차면 게임오버
  - 모바일 터치 버그 수정 (더블 드롭 방지)
  - 게임 시작 시 자동 스크롤 (모바일 UX)
  - 게임오버 시 다른 게임으로 이동 버튼 추가

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
