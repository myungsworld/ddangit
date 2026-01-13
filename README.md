# ddangit(딴짓)

심심할 때 하는 미니게임 모음

[**딴짓하러가기**](https://ddangit.vercel.app)

---

## Games

| Game | Description |
|------|-------------|
| 🧱 Sand Tetris | 같은 색을 좌→우로 연결 |
| 🧩 Block Blast | 블록을 배치해서 줄을 완성 |
| ⚡ Reaction Speed | 반응속도 테스트 |
| 🔗 Color Chain | 같은 색 연속 터치로 콤보 2배 |
| 📦 Tariff Dodge | 관세 피하기 서바이벌 |
| 🎨 Color Match | 스트룹 테스트 - 글자색 맞추기 |
| 🪜 Infinite Stairs | 무한 계단 오르기 - 땅에서 우주까지 |

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Upstash Redis (랭킹)
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── games/[gameId]/     # 동적 라우트
│   └── api/                # API 라우트
├── games/                  # 게임별 모듈
│   ├── registry.tsx        # 게임 컴포넌트 레지스트리
│   └── [game-id]/          # 각 게임 구현
├── shared/                 # 공용 모듈
│   ├── constants/games.ts  # 게임 메타데이터 (SSoT)
│   ├── components/         # 공용 컴포넌트
│   └── i18n/               # 다국어 (ko/en)
└── infrastructure/         # 인프라 어댑터
    ├── social/             # SNS 홍보 (Twitter, Bluesky)
    └── storage/            # 랭킹 저장소
```

---

## Documentation

- [CLAUDE.md](CLAUDE.md) - 개발 가이드 & 체크리스트
- [docs/game-ideas.md](docs/game-ideas.md) - 게임 아이디어
- [docs/cron-jobs.md](docs/cron-jobs.md) - 자동 홍보 시스템
