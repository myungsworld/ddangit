# SEO & 검색 노출

## 완료

- [x] Open Graph 메타태그 (링크 공유 미리보기)
- [x] Twitter Card 메타태그
- [x] sitemap.xml (게임 자동 포함)
- [x] robots.txt
- [x] 게임별 SEO 메타데이터 (games.ts에서 관리)
- [x] generateGameMetadata 헬퍼 함수
- [x] Google Search Console 등록 + sitemap 제출
- [x] Naver Search Advisor 등록 + sitemap 제출
- [x] Bing Webmaster 등록 + sitemap 제출 (Yahoo, DuckDuckGo 포함)
- [x] Yandex Webmaster 등록 + sitemap 제출

## TODO

### 구조화 데이터

| 항목 | 설명 | 상태 |
|------|------|------|
| JSON-LD | 리치 스니펫 (게임, 평점 등) | [ ] |
| BreadcrumbList | 검색결과에 경로 표시 | [ ] |

### 이미지 최적화

| 항목 | 설명 | 상태 |
|------|------|------|
| 동적 OG 이미지 | 점수 포함 공유 이미지 자동 생성 | [ ] |
| 게임별 OG 이미지 | 각 게임 썸네일 | [ ] |

## 참고

- sitemap: `src/app/sitemap.ts` (GAMES 배열에서 자동 생성)
- 메타데이터: `src/shared/constants/metadata.ts`
- 게임 등록: `src/shared/constants/games.ts`
