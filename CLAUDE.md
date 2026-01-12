# Claude 작업 가이드

이 파일은 Claude가 세션마다 참고하는 프로젝트 규칙과 체크리스트입니다.

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── games/[game-id]/    # 게임 페이지
│   ├── api/                # API 라우트
│   ├── sitemap.ts          # 자동 생성 (GAMES 사용)
│   └── robots.ts           # 자동 생성
├── games/                  # 게임별 로직
│   └── [game-id]/
│       ├── components/
│       ├── hooks/
│       ├── constants/
│       └── types/
├── shared/
│   ├── constants/
│   │   ├── games.ts        # ⭐ 게임 레지스트리 (Single Source of Truth)
│   │   └── metadata.ts     # SEO 메타데이터 생성
│   ├── i18n/
│   │   ├── ko.json         # 한국어 번역
│   │   └── en.json         # 영어 번역
│   └── components/
└── infrastructure/
    ├── social/             # Twitter/Bluesky 홍보
    │   └── templates.ts    # 홍보 메시지 (GAMES 사용)
    └── storage/            # 랭킹 저장소
```

## 게임 추가 체크리스트

새 게임을 추가할 때 반드시 아래 항목을 모두 완료해야 합니다:

### 1. 게임 레지스트리 등록 (필수)
- [ ] `src/shared/constants/games.ts`에 게임 정보 추가
  ```typescript
  {
    id: 'new-game',
    name: 'New Game',
    description: 'Game description',
    icon: '🎮',
    path: '/games/new-game',
    color: '#HEX',
    estimatedTime: '1m',
    seo: {
      title: 'New Game | ddangit',
      description: 'SEO description for search engines',
    },
  }
  ```

### 2. 게임 로직 구현 (필수)
- [ ] `src/games/[game-id]/` 폴더 생성
  - `components/` - 게임 컴포넌트
  - `hooks/` - 게임 로직 훅
  - `constants/` - 게임 상수
  - `types/` - 타입 정의
  - `index.ts` - 내보내기

### 3. 페이지 생성 (필수)
- [ ] `src/app/games/[game-id]/page.tsx` 생성
  ```typescript
  import { GameLayout } from '@/shared/components/game';
  import { NewGame } from '@/games/new-game';
  import { generateGameMetadata, getGameById } from '@/shared/constants';

  const GAME_ID = 'new-game';
  const game = getGameById(GAME_ID)!;

  export const metadata = generateGameMetadata(GAME_ID);

  export default function NewGamePage() {
    return (
      <GameLayout gameId={game.id} color={game.color}>
        <div className="w-full max-w-lg mx-auto">
          <NewGame />
        </div>
      </GameLayout>
    );
  }
  ```

### 4. 번역 추가 (필수)
- [ ] `src/shared/i18n/ko.json`에 게임 번역 추가
- [ ] `src/shared/i18n/en.json`에 게임 번역 추가
  ```json
  "games": {
    "new-game": {
      "name": "게임 이름",
      "description": "게임 설명",
      "ranks": {
        "godlike": "최고 등급",
        "insane": "...",
        "fast": "...",
        "good": "...",
        "average": "...",
        "slow": "...",
        "verySlow": "최저 등급"
      }
    }
  }
  ```

### 자동으로 적용되는 것들
위 체크리스트를 완료하면 아래는 자동으로 적용됩니다:
- ✅ 메인 페이지 게임 목록
- ✅ sitemap.xml
- ✅ Twitter/Bluesky 홍보 메시지
- ✅ SEO 메타데이터 (Open Graph, Twitter Card)

## 기능 추가 시 주의사항

### 새 기능이 게임과 연관될 때
게임별로 적용되어야 하는 새 기능을 추가할 경우:
1. `GameMeta` 타입 확장 (`src/shared/types/game.ts`)
2. `GAMES` 배열의 각 게임에 새 필드 추가
3. 이 문서의 체크리스트 업데이트

### 예시: 게임별 난이도 추가
```typescript
// 1. 타입 확장
interface GameMeta {
  // ... 기존 필드
  difficulty: 'easy' | 'medium' | 'hard';
}

// 2. games.ts 업데이트
{
  id: 'reaction-speed',
  // ... 기존 필드
  difficulty: 'easy',
}
```

## 참고 링크
- 개발일지: `docs/dev-log.md`
- 기능 로드맵: `docs/todo-features.md`
