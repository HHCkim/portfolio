# 🚀 배포 가이드 (Replit) - 최적화 버전

### ⚡ 성능 최적화 기능
- **Range 요청 지원**: HTTP 206 Partial Content로 효율적 스트리밍
- **비디오 프리로딩**: 주변 비디오 메타데이터 미리 로드
- **버퍼링 표시**: 실시간 버퍼링 진행률 인디케이터
- **캐시 관리**: LRU 캐시로 메모리 효율적 관리
- **스트림 로더**: AbortController로 불필요한 로딩 취소

## 📦 이 폴더에 포함된 파일들

✅ **포함됨:**
- `src/` - 모든 소스 코드
- `public/` - HTML 및 정적 파일
- `package.json` - 의존성 목록
- `package-lock.json` - 의존성 버전 고정
- `tsconfig.json` - TypeScript 설정
- `tailwind.config.js` - Tailwind CSS 설정
- `.env.production` - 프로덕션 환경 변수
- `.replit` - Replit 설정
- `replit.nix` - Replit 환경 설정
- `.gitignore` - Git 제외 파일 목록

❌ **제외됨 (배포 시 자동 생성):**
- `node_modules/` - npm 패키지들
- `build/` - 빌드 결과물
- `.env.local` - 로컬 환경 변수

## 🎬 Replit 배포 단계별 가이드

### 1단계: Replit 계정 및 프로젝트 생성
1. [Replit.com](https://replit.com) 접속
2. 로그인 또는 회원가입
3. "Create Repl" 클릭
4. "Import from GitHub" 또는 이 폴더 직접 업로드

### 2단계: 파일 업로드
1. `deploy-ready` 폴더의 모든 파일을 Replit에 업로드
2. 폴더 구조가 동일한지 확인

### 3단계: Object Storage 설정
1. Replit 프로젝트에서 "Object Storage" 탭 클릭
2. "Enable Object Storage" 활성화
3. `videos` 폴더 생성
4. 1.mp4 ~ 20.mp4 파일 업로드 (각각 압축된 비디오)

### 4단계: 환경 변수 업데이트
1. `.env.production` 파일 열기
2. `REACT_APP_STORAGE_URL` 값을 실제 Storage URL로 변경:
   ```
   REACT_APP_STORAGE_URL=https://storage.googleapis.com/replit-objstore-[YOUR-ID]
   ```
3. Storage URL은 Object Storage 탭에서 확인 가능

### 5단계: 의존성 설치 및 실행
Shell에서 다음 명령어 실행:
```bash
npm install
npm start
```

### 6단계: 배포
1. "Deploy" 버튼 클릭
2. Static Site 선택
3. Build command: `npm run build`
4. Public directory: `build`

## 📹 비디오 파일 준비

### 압축 권장 사항:
- 형식: MP4 (H.264 코덱)
- 크기: 각 파일 50-100MB 이하
- 해상도: 1920x1080 또는 1280x720
- 비트레이트: 2-5 Mbps
- **웹 최적화**: moov atom을 파일 앞쪽에 배치 (fast start)

### 압축 도구 사용:
원본 프로젝트의 `/incord` 폴더에 압축 도구 있음:
```bash
python3 quality_compress.py input.mp4 output.mp4 --quality=balanced
```

## 🔍 문제 해결

### 비디오가 로드되지 않을 때:
1. Object Storage URL이 올바른지 확인
2. 비디오 파일명이 1.mp4 ~ 20.mp4인지 확인
3. 브라우저 개발자 도구(F12)에서 에러 확인

### 빌드 에러:
1. `npm install` 다시 실행
2. Node.js 버전 확인 (18.x 권장)
3. `node_modules` 삭제 후 재설치

### 환경 변수 문제:
1. `.env.production` 파일 확인
2. `REACT_APP_` 접두사 확인
3. Replit에서 Secrets 탭 확인

## 📱 테스트

1. **로컬 테스트** (배포 전):
   ```bash
   npm start
   ```
   http://localhost:3000 접속

2. **프로덕션 빌드 테스트**:
   ```bash
   npm run build
   npx serve -s build
   ```

3. **Replit 테스트**:
   - 자동으로 미리보기 창에 표시
   - 또는 제공된 URL로 접속

## ✅ 체크리스트

배포 전 확인사항:
- [ ] 모든 파일이 `deploy-ready` 폴더에 있는가?
- [ ] 20개의 비디오 파일이 준비되었는가?
- [ ] 비디오 파일이 적절히 압축되었는가?
- [ ] `.env.production`의 Storage URL이 정확한가?
- [ ] 로컬에서 테스트했는가?

## 🎉 완료!

모든 단계를 완료하면 포트폴리오가 온라인에 공개됩니다.
Replit이 제공하는 URL을 통해 어디서든 접속 가능합니다.