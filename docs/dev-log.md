# 개발일지

## 2026-01-10

### 완료된 작업

#### 1. 랭킹 시스템 구현
- **Daily Top 3 랭킹**: 게임 종료 시 오늘의 랭킹 표시
- **닉네임 입력**: Top 3 진입 시 닉네임 모달 표시
- **스토리지 추상화**: `MemoryAdapter` (개발), `UpstashAdapter` (프로덕션)
- **게임별 점수 정렬**:
  - 낮을수록 좋음: `reaction-speed`, `aim-trainer` (ms 단위)
  - 높을수록 좋음: `number-memory`, `typing-speed`, `sand-tetris`

#### 2. 인프라 추상화 레이어
- **Storage Abstraction** (`/src/infrastructure/storage/`)
  - `STORAGE_TYPE` 환경변수로 어댑터 선택
  - Docker에서는 자동으로 `memory` 사용
  - Vercel에서는 `vercel-kv` → Upstash Redis 사용

- **Social Abstraction** (`/src/infrastructure/social/`)
  - `TwitterAdapter`, `DiscordAdapter` (Discord는 스텁)
  - 메시지 템플릿 + 랜덤 해시태그

#### 3. Twitter 홍보 자동화
- OAuth 1.0a 인증
- Vercel Cron (매일 09:00 UTC)
- `/api/promo/twitter` 엔드포인트

#### 4. Makefile 개선
- `make dev`: `.next` 캐시 자동 정리
- `make fresh`: 완전 재빌드 (볼륨 삭제 + `--no-cache`)
- `make deploy`: 주석이 있는 `.env.local` 처리 개선

### 해결한 이슈

1. **`@vercel/kv` import 에러 (Docker)**
   - 원인: Turbopack이 동적 import 경로도 분석
   - 해결: `@upstash/redis`로 교체, 환경변수로 완전 분기

2. **Vercel 환경변수 `\n` 문제**
   - 원인: `echo`로 환경변수 설정 시 줄바꿈 추가됨
   - 해결: `printf` 또는 `echo -n` 사용

3. **랭킹 데이터 사라짐**
   - 원인: `STORAGE_TYPE=vercel-kv\n` (개행문자 포함)으로 조건 불일치
   - 해결: 환경변수 재설정 (개행문자 제거)

---

## 다음에 할 일

### 우선순위 높음

- [ ] **랭킹 UI 개선**
  - 0점일 때도 랭킹 보드 표시 (현재 안 보이는 버그 확인)
  - 로딩 스피너 추가
  - 에러 상태 표시

- [ ] **디버그 엔드포인트 제거**
  - `/api/ranking?debug=env` 프로덕션 배포 전 제거

- [ ] **코드 정리**
  - `@vercel/kv` 패키지 제거 (사용 안 함)
  - 불필요한 console.log 정리

### 우선순위 중간

- [ ] **Discord Webhook 연동**
  - `DiscordAdapter` 구현 완료
  - `/api/promo/discord` 엔드포인트 생성

- [ ] **메시지 템플릿 다양화**
  - 게임별 홍보 문구
  - 시간대별 다른 메시지

- [ ] **랭킹 확장**
  - 주간/월간 랭킹
  - 전체 랭킹 (Top 10)

### 우선순위 낮음

- [ ] **새 게임 추가**
  - Color Match (색 맞추면 탭)
  - Math Speed (빠른 암산)
  - Pattern Copy (패턴 따라하기)

- [ ] **AdSense 최적화**
  - 광고 위치 A/B 테스트
  - 성과 모니터링

- [ ] **Analytics**
  - 게임별 플레이 횟수
  - 랭킹 참여율

---

## 메모

### 환경변수 설정 주의사항

Vercel CLI로 환경변수 설정 시 **반드시** `echo -n` 또는 `printf` 사용:

```bash
# 올바른 방법
echo -n "value" | vercel env add NAME production --token $TOKEN

# 또는
printf "value" | vercel env add NAME production --token $TOKEN

# 잘못된 방법 (줄바꿈 추가됨)
echo "value" | vercel env add NAME production --token $TOKEN
```

### 스토리지 어댑터 선택

| 환경 | STORAGE_TYPE | 어댑터 |
|------|--------------|--------|
| Docker (make dev) | memory (자동) | MemoryAdapter |
| Vercel | vercel-kv | UpstashAdapter |
| 로컬 (npm run dev) | 설정 필요 | 설정에 따름 |

### 게임 점수 정렬

```typescript
// src/lib/ranking/types.ts
export const GAME_SCORE_ORDER: Record<string, ScoreOrder> = {
  'reaction-speed': 'asc',   // 낮을수록 좋음 (ms)
  'aim-trainer': 'asc',      // 낮을수록 좋음 (ms)
  'number-memory': 'desc',   // 높을수록 좋음 (레벨)
  'typing-speed': 'desc',    // 높을수록 좋음 (WPM)
  'sand-tetris': 'desc',     // 높을수록 좋음 (점수)
};
```
