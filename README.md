![](/public/og-image.png)

# NewsNow (Korean Edition)

한국어 사용자에 맞춰 현지화된 NewsNow입니다. 실시간·인기 뉴스를 깔끔한 UI로 모아 읽을 수 있으며, GitHub 로그인 기반 동기화와 캐시·스크래핑 최적화를 제공합니다.

## 미리보기

![NewsNow 미리보기1](/screenshots/preview-1.png)
![NewsNow 미리보기2](/screenshots/preview-2.png)

## 주요 특징

- 깔끔한 다크 기본 UI와 반응형 레이아웃
- 실시간/인기 뉴스 자동 갱신, 30분 기본 캐시 (로그인 사용자는 강제 새로고침 가능)
- 소스별 업데이트 주기에 맞춘 동적 스크래핑 간격(최소 2분)으로 리소스 최적화 및 IP 차단 방지
- GitHub OAuth 로그인 및 메타데이터 동기화
- MCP 서버 지원

### MCP 설정 예시

```json
{
  "mcpServers": {
    "newsnow": {
      "command": "npx",
      "args": [
        "-y",
        "newsnow-mcp-server"
      ],
      "env": {
        "BASE_URL": "https://newsnow.busiyi.world"
      }
    }
  }
}
```
`BASE_URL`은 배포한 도메인에 맞게 변경하세요.

## 배포

### 기본 배포 (로그인/캐시 없이)
1. 이 저장소를 포크
2. Cloudflare Pages 또는 Vercel 등에 가져오기

### Cloudflare Pages 설정
- Build command: `pnpm run build`
- Output directory: `dist/output/public`

### GitHub OAuth 설정
1. [GitHub App 생성](https://github.com/settings/applications/new)
2. 별도 권한 불필요
3. Callback URL: `https://your-domain.com/api/oauth/github` (도메인 대체)
4. Client ID, Client Secret 확보

### 환경 변수
`example.env.server`를 `.env.server`로 복사 후 값 설정:
```env
# Github Client ID
G_CLIENT_ID=
# Github Client Secret
G_CLIENT_SECRET=
# JWT Secret (보통 Client Secret과 동일)
JWT_SECRET=
# 최초 1회 DB 초기화용. 첫 실행 후 false로 꺼도 됨
INIT_TABLE=true
# 캐시 활성화 여부
ENABLE_CACHE=true
```

### 데이터베이스
지원 커넥터: https://db0.unjs.io/connectors
권장: **Cloudflare D1**

1. Cloudflare Worker 대시보드에서 D1 DB 생성
2. `wrangler.toml`에 `database_id`, `database_name` 설정
3. 없으면 `example.wrangler.toml`을 복사·수정
4. 다음 배포 시 적용

### Docker 배포
```sh
docker compose up
```
환경 변수는 `docker-compose.yml`에서도 설정 가능.

## 개발

> Node.js >= 20 필요

```sh
corepack enable
pnpm i
pnpm dev
```

### 데이터 소스 추가
`shared/sources`, `server/sources` 디렉터리를 참고하세요. 타입 정의와 아키텍처가 준비되어 있습니다. 자세한 작성 가이드는 [CONTRIBUTING.md](CONTRIBUTING.md)를 확인하세요.

## 로드맵
- 개인화 옵션 강화(카테고리 선호도, 저장된 설정)
- 글로벌 소스 추가 및 품질 향상

## Contributing
이슈/PR 모두 환영합니다. 특히 새로운 데이터 소스 제안이나 버그 리포트는 언제든 열어주세요. 상세 가이드는 [CONTRIBUTING.md](CONTRIBUTING.md) 참고.

## License
[MIT](./LICENSE) © ourongxing
