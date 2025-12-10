# NewsNow 한국어판 기여 가이드

NewsNow 한국어판에 기여해 주셔서 감사합니다. 이 문서는 새 소스 추가부터 PR 제출까지의 절차를 안내합니다.

## 새 소스 추가 절차

### 1. 브랜치 생성
```bash
git checkout -b feature-name
```
예) `git checkout -b bilibili-hot-video`

### 2. 소스 등록 (`/shared/pre-sources.ts`)
```typescript
"bilibili": {
  name: "빌리빌리",
  color: "blue",
  home: "https://www.bilibili.com",
  sub: {
    "hot-search": {
      title: "실시간 검색",
      column: "world",
      type: "hottest",
    },
    "hot-video": { // 새 하위 소스 추가
      title: "인기 동영상",
      column: "world",
      type: "hottest",
    },
  },
};
```

완전히 새로운 소스를 추가할 때:
```typescript
"newsource": {
  name: "새 소스",
  color: "blue",
  home: "https://www.example.com",
  column: "tech",   // 알맞은 컬럼 지정
  type: "hottest",  // 실시간 피드라면 "realtime"
};
```

### 3. 소스 페처 구현 (`/server/sources/`)
관련 파일을 만들거나 기존 파일을 수정합니다.
```typescript
// /server/sources/bilibili.ts
interface HotVideoRes {
  data: { list: Array<{
    bvid: string;
    title: string;
    pubdate: number;
    desc: string;
    pic: string;
    owner: { name: string };
    stat: { view: number; like: number };
  }>};
}

const hotVideo = defineSource(async () => {
  const res: HotVideoRes = await myFetch("https://api.bilibili.com/x/web-interface/popular");
  return res.data.list.map(video => ({
    id: video.bvid,
    title: video.title,
    url: `https://www.bilibili.com/video/${video.bvid}`,
    pubDate: video.pubdate * 1000,
    extra: {
      info: `${video.owner.name} · ${formatNumber(video.stat.view)}회 · ${formatNumber(video.stat.like)}좋아요`,
      hover: video.desc,
      icon: proxyPicture(video.pic),
    },
  }));
});

function formatNumber(num: number): string {
  if (num >= 10000) return `${Math.floor(num / 10000)}w+`;
  return num.toString();
}

export default defineSource({
  bilibili: hotSearch,
  "bilibili-hot-search": hotSearch,
  "bilibili-hot-video": hotVideo,
});
```

### 4. 소스 파일 재생성
```bash
pnpm run presource
```
`sources.json` 등 관련 설정이 갱신됩니다.

### 5. 로컬 테스트
```bash
pnpm dev
```
브라우저에서 새 소스가 정상 노출·동작하는지 확인합니다.

### 6. 커밋
```bash
git add .
git commit -m "Add new source: source-name"
```

### 7. PR 생성
```bash
git push origin feature-name
```
메인 저장소로 Pull Request를 생성합니다.

## 소스 반환 형태 (NewsItem)
각 소스는 아래 형태의 배열을 반환해야 합니다.
```typescript
interface NewsItem {
  id: string | number;    // 고유 ID
  title: string;          // 제목
  url: string;            // 본문 링크
  mobileUrl?: string;     // 선택: 모바일 전용 링크
  pubDate?: number | string; // 발행 시각
  extra?: {
    hover?: string;
    date?: number | string;
    info?: false | string;
    diff?: number;
    icon?: false | string | { url: string; scale: number; };
  };
}
```

## 코드 스타일
- TypeScript/ES6+ 컨벤션을 따릅니다.
- 기존 코드의 포맷과 패턴을 맞춰 주세요.

## 라이선스
이 프로젝트에 기여하면, 해당 기여물은 프로젝트 라이선스(MIT)에 따라 제공됨에 동의하는 것으로 간주됩니다.
