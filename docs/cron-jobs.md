# Cron Jobs

## 현재 설정

### Twitter 자동 홍보

| 항목 | 값 |
|------|-----|
| **경로** | `/api/promo/twitter` |
| **스케줄** | `0 9 * * *` (매일 09:00 UTC) |
| **한국시간** | 매일 18:00 KST |
| **설정 파일** | `vercel.json` |

```json
{
  "crons": [
    {
      "path": "/api/promo/twitter",
      "schedule": "0 9 * * *"
    }
  ]
}
```

---

## 작동 방식

1. Vercel이 스케줄에 따라 `/api/promo/twitter`에 GET 요청
2. 요청 헤더에 `x-vercel-cron: 1` 포함
3. 랜덤 메시지 + 해시태그 생성
4. Twitter API로 트윗 발송
5. 결과 로그 기록

---

## 모니터링

### Vercel Dashboard에서 확인

1. [Vercel Dashboard](https://vercel.com) 접속
2. 프로젝트 선택 → **Settings** → **Cron Jobs**
3. 실행 기록 및 상태 확인 가능

### CLI로 확인

```bash
# 상태 확인
curl https://ddangit.vercel.app/api/promo/twitter

# 응답 예시
{
  "platform": "twitter",
  "status": "ok",
  "configured": true,
  "schedule": "Daily at 09:00 UTC"
}
```

### 로그 확인

Vercel Dashboard → **Logs** → `[Promo][Twitter]` 검색

```
[Promo][Twitter] Cron triggered at 2026-01-10T09:00:00.000Z
[Promo][Twitter] ✅ Tweet posted successfully
```

---

## 수동 실행

```bash
# 일반 홍보
curl -X POST https://ddangit.vercel.app/api/promo/twitter \
  -H "Content-Type: application/json" \
  -d '{"type": "general"}'

# 커스텀 메시지
curl -X POST https://ddangit.vercel.app/api/promo/twitter \
  -H "Content-Type: application/json" \
  -d '{"customMessage": "Check out ddangit! https://ddangit.vercel.app"}'
```

---

## 홍보 플랫폼 확장 체크리스트

### SNS 플랫폼

| 플랫폼 | 상태 | API 문서 | 비고 |
|--------|------|----------|------|
| Twitter/X | ✅ 완료 | [Developer Portal](https://developer.twitter.com) | OAuth 1.0a |
| Discord | 🔲 준비됨 | [Webhook Guide](https://discord.com/developers/docs/resources/webhook) | Webhook 방식, 무료 |
| Reddit | �� 미정 | [API Docs](https://www.reddit.com/dev/api) | 스팸 정책 주의 |
| Facebook | 🔲 미정 | [Graph API](https://developers.facebook.com/docs/graph-api) | 페이지 필요 |
| Instagram | 🔲 미정 | [Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api) | 비즈니스 계정 필요 |

### 한국 플랫폼

| 플랫폼 | 상태 | API 문서 | 비고 |
|--------|------|----------|------|
| 네이버 블로그 | 🔲 미정 | [Naver Developers](https://developers.naver.com) | 블로그 API |
| 카카오 채널 | 🔲 미정 | [Kakao Developers](https://developers.kakao.com) | 채널 메시지 |
| 에브리타임 | 🔲 미정 | 공식 API 없음 | 대학생 커뮤니티 |

### 게임 커뮤니티

| 플랫폼 | 상태 | URL | 비고 |
|--------|------|-----|------|
| 인벤 | 🔲 미정 | [inven.co.kr](https://www.inven.co.kr) | 게시판 홍보 |
| 루리웹 | 🔲 미정 | [ruliweb.com](https://ruliweb.com) | 게시판 홍보 |
| 디시인사이드 | 🔲 미정 | [dcinside.com](https://dcinside.com) | 갤러리 홍보 |
| Indie Hackers | 🔲 미정 | [indiehackers.com](https://www.indiehackers.com) | 영문, 인디 개발자 |
| Product Hunt | 🔲 미정 | [producthunt.com](https://www.producthunt.com) | 영문, 런칭용 |
| Hacker News | 🔲 미정 | [news.ycombinator.com](https://news.ycombinator.com) | 영문, Show HN |

### 게임 배포 플랫폼

| 플랫폼 | 상태 | URL | 비고 |
|--------|------|-----|------|
| itch.io | 🔲 미정 | [itch.io](https://itch.io) | 웹게임 호스팅 가능 |
| Newgrounds | 🔲 미정 | [newgrounds.com](https://www.newgrounds.com) | 플래시 게임 커뮤니티 |
| Kongregate | 🔲 미정 | [kongregate.com](https://www.kongregate.com) | 웹게임 포털 |
| Game Jolt | 🔲 미정 | [gamejolt.com](https://gamejolt.com) | 인디게임 플랫폼 |
| Crazy Games | 🔲 미정 | [crazygames.com](https://www.crazygames.com) | 웹게임 포털 |

---

## 다음 작업

### 우선순위 높음
- [ ] Discord Webhook 연동 (`/api/promo/discord`)
- [ ] Cron 스케줄 다양화 (주 2-3회)
- [ ] 메시지 중복 방지 로직

### 우선순위 중간
- [ ] Product Hunt 런칭 준비
- [ ] itch.io 게임 등록
- [ ] 한국 커뮤니티 홍보 글 템플릿 작성

### 우선순위 낮음
- [ ] 카카오 채널 연동
- [ ] 네이버 블로그 자동 포스팅
- [ ] Reddit 연동 (정책 검토 후)

---

## Cron 표현식 참고

```
* * * * *
│ │ │ │ │
│ │ │ │ └── 요일 (0-7, 0과 7은 일요일)
│ │ │ └──── 월 (1-12)
│ │ └────── 일 (1-31)
│ └──────── 시 (0-23, UTC)
└────────── 분 (0-59)
```

**예시:**
- `0 9 * * *` - 매일 09:00 UTC
- `0 9 * * 1,4` - 월,목 09:00 UTC
- `0 9,21 * * *` - 매일 09:00, 21:00 UTC
- `0 */6 * * *` - 6시간마다
