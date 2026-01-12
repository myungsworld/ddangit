# 홍보 플랫폼

## 완료

### Twitter/X
- [x] OAuth 1.0a 인증
- [x] 자동 홍보 (GitHub Actions)
- [x] 한국어/영어 랜덤 메시지
- [x] 랜덤 해시태그
- [x] 랜덤 3개 게임 목록 + 메인 링크 (Twitter Card용)

### Bluesky
- [x] AT Protocol REST API
- [x] 영어 전용 (짧은 메시지)
- [x] 클릭 가능한 링크 (facets)
- [x] 300자 제한 대응 (랜덤 3개 게임)

### 알림
- [x] 이메일 알림 (Resend API)
- [x] 성공/실패 결과 발송

## 진행 중

### Threads
- [x] Meta Developer App 생성 (ddangit)
- [x] App ID / App Secret 발급
- [ ] Access Token 발급 (계정 정지로 대기 중)
- [ ] ThreadsAdapter 구현

> **Note**: Threads 계정이 suspended 상태라 토큰 발급 불가. 계정 복구 후 진행 예정.

---

## TODO

### 플랫폼 추가

| 플랫폼 | 설명 | 상태 |
|--------|------|------|
| Discord | Webhook 방식, 게임 커뮤니티 타겟 | [ ] |
| Reddit | r/WebGames 등, 수동 권장 | [ ] |
| Product Hunt | 런칭용 일회성 | [ ] |
| Threads | Meta API 설정 완료, 계정 정지로 대기 중 | [~] |

### 기능 개선

| 항목 | 설명 | 상태 |
|------|------|------|
| 랭킹 포함 메시지 | 오늘의 Top 3 홍보 | [ ] |
| 신규 게임 알림 | 새 게임 추가 시 자동 홍보 | [ ] |
| A/B 테스트 | 메시지 효과 비교 | [ ] |

## 스크립트

```bash
# 전체 (모든 플랫폼)
./scripts/promo.sh prod

# Twitter만
./scripts/promo.sh prod twitter

# Bluesky만
./scripts/promo.sh prod bluesky
```

## 참고

- Cron 설정: [cron-jobs.md](cron-jobs.md)
- API: `src/app/api/promo/all/route.ts`
- 어댑터: `src/infrastructure/social/adapters/`
- 템플릿: `src/infrastructure/social/templates.ts`
