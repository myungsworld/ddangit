# Claude 작업 가이드

이 파일은 Claude가 세션마다 참고하는 프로젝트 규칙과 체크리스트입니다.

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── games/[gameId]/     # 동적 라우트 (모든 게임 자동 처리)
│   ├── api/                # API 라우트
│   ├── sitemap.ts          # 자동 생성
│   └── robots.ts           # 자동 생성
├── games/                  # 게임별 로직
│   ├── registry.tsx        # ⭐ 게임 컴포넌트 레지스트리
│   └── [game-id]/
│       ├── components/
│       ├── hooks/
│       ├── constants/
│       └── types/
├── shared/
│   ├── constants/games.ts  # ⭐ 게임 메타데이터 (Single Source of Truth)
│   ├── i18n/               # ko.json, en.json
│   └── components/
└── infrastructure/
    ├── social/             # Twitter/Bluesky 홍보
    └── storage/            # 랭킹 저장소
```

## 게임 추가 체크리스트

새 게임 추가 시 **모든 항목**을 완료해야 합니다:

### 1. 메타데이터 등록
- [ ] `src/shared/constants/games.ts` - 게임 정보 추가
- [ ] `README.md` - Games 테이블에 추가

### 2. 게임 구현
- [ ] `src/games/[game-id]/` 폴더 생성
  - `components/` - UI 컴포넌트
  - `hooks/` - 게임 로직
  - `constants/` - 설정값
  - `types/` - 타입 정의
  - `index.ts` - export
- [ ] 등급 시스템 구현 (`getRankKey` 함수 + `GameResult` subtitle)

### 3. 레지스트리 등록
- [ ] `src/games/registry.tsx` - dynamic import 추가

### 4. 번역 추가
- [ ] `src/shared/i18n/ko.json` - 한국어
- [ ] `src/shared/i18n/en.json` - 영어
- [ ] `ranks` 객체 필수 (godlike ~ verySlow)

### 5. 문서 업데이트
- [ ] `docs/game-ideas.md` - 현재 게임 목록 업데이트

### 자동 적용 항목
- 메인 페이지 게임 목록
- sitemap.xml
- SNS 홍보 메시지
- SEO 메타데이터
- 게임 페이지 (동적 라우트)

---

## 홍보 플랫폼 추가 체크리스트

### 필수 항목
1. `src/infrastructure/social/types/index.ts` - Platform 타입 추가
2. `src/infrastructure/social/adapters/` - 어댑터 구현
3. `src/infrastructure/social/index.ts` - 레지스트리 등록
4. Vercel 환경변수 설정
5. GitHub Secrets 설정 (필요시)

### 자동 적용 항목
- GitHub Actions 일일 홍보
- 수동 발송 스크립트
- API 상태 확인

---

## 참고 링크

| 문서 | 경로 |
|------|------|
| 게임 아이디어 | `docs/game-ideas.md` |
| Cron/홍보 설정 | `docs/cron-jobs.md` |
| 개발 가이드 | `docs/development.md` |
