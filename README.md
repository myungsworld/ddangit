# ddangit(딴짓)

심심할 때 하는 미니게임 모음

[**딴짓하러가기**](https://ddangit.vercel.app)

---

## Games

| Game              | Description                  |
| ----------------- | ---------------------------- |
| 🧱 Sand Tetris    | 같은 색을 좌→우로 연결       |
| 🧩 Block Blast    | 블록을 배치해서 줄을 완성    |
| ⚡ Reaction Speed | 반응속도 테스트              |
| 🔗 Color Chain    | 같은 색 연속 터치로 콤보 2배 |

---

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── api/
│   │   ├── promo/            # 홍보 자동화 API
│   │   │   ├── all/          # 전체 플랫폼 (Cron용)
│   │   │   └── twitter/      # Twitter 단독
│   │   └── ranking/          # 랭킹 API
│   ├── games/
│   │   ├── sand-tetris/
│   │   ├── block-blast/
│   │   ├── reaction-speed/
│   │   └── color-chain/
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
│   ├── social/               # SNS 플랫폼 어댑터
│   │   ├── adapters/
│   │   │   ├── twitter.ts    # Twitter/X
│   │   │   └── bluesky.ts    # Bluesky
│   │   ├── auth.ts           # API 인증 유틸리티
│   │   ├── types/
│   │   └── templates.ts      # 메시지 템플릿
│   └── notification/         # 알림 서비스
│       └── email.ts          # Resend 이메일
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
    ├── contexts/
    │   └── LanguageContext   # 다국어 지원 (ko/en)
    ├── i18n/                 # 번역 파일
    │   ├── ko.json
    │   └── en.json
    ├── hooks/
    │   └── useRanking.ts     # 랭킹 API 훅
    ├── types/
    └── constants/
        └── games.ts          # 게임 레지스트리 (SSoT)

scripts/
└── promo.sh                  # 수동 홍보 스크립트

docs/                         # 문서
├── development.md            # 개발 가이드
├── cron-jobs.md              # 자동 홍보
└── dev-log.md                # 개발일지

public/
└── ads.txt                   # AdSense 인증 파일
```

---

## Documentation

- [Development Guide](docs/development.md) - 개발 환경 설정, 배포, 게임 추가 방법
- [Cron Jobs](docs/cron-jobs.md) - 자동 홍보 시스템
- [Dev Log](docs/dev-log.md) - 개발일지
