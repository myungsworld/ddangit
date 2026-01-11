# ddangit

심심할 때 하는 미니게임 모음

**Live:** https://ddangit.vercel.app

---

## Games

| Game | Description |
|------|-------------|
| ⚡ Reaction Speed | 반응속도 테스트 |
| 🎯 Aim Trainer | 움직이는 타겟 맞추기 |
| 🔢 Number Memory | 숫자 기억하기 |
| ⌨️ Typing Speed | 타이핑 속도 |
| 🧱 Sand Tetris | 같은 색을 좌→우로 연결 |

---

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── api/                  # API 라우트
│   └── games/                # 게임 페이지
│
├── games/                    # 게임 모듈 (독립적)
│   └── [game-name]/
│       ├── components/       # 게임 UI
│       ├── hooks/            # 게임 로직
│       ├── types/            # 타입 정의
│       └── constants/        # 설정값
│
├── infrastructure/           # 인프라 추상화
│   ├── storage/              # 스토리지 어댑터
│   └── social/               # SNS 플랫폼 어댑터
│
├── lib/                      # 비즈니스 로직
│
└── shared/                   # 공용 컴포넌트
```

---

## Documentation

- [Development Guide](docs/development.md) - 개발 환경 설정, 배포, 게임 추가 방법
- [Cron Jobs](docs/cron-jobs.md) - 자동 홍보 시스템
- [Dev Log](docs/dev-log.md) - 개발일지
