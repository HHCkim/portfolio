# 🚀 Replit 빠른 시작 가이드

## 1️⃣ Replit에 업로드
1. [Replit.com](https://replit.com) 접속 → 로그인
2. "Create Repl" 클릭 → "Import from ZIP" 선택
3. 이 `deploy-ready` 폴더를 ZIP으로 압축하여 업로드

## 2️⃣ Object Storage 설정 (중요!)
1. Replit 프로젝트에서 왼쪽 메뉴 → "Object Storage" 클릭
2. "Enable Object Storage" 활성화
3. `videos` 폴더 생성
4. 비디오 파일 업로드 (1.mp4 ~ 20.mp4)
   - 각 파일은 50MB 이하 권장
   - 총 20개 파일 필요

## 3️⃣ Storage URL 설정
1. Object Storage 탭에서 Storage URL 복사
2. `.env.production` 파일 열기
3. `REACT_APP_STORAGE_URL` 값을 복사한 URL로 변경:
```
REACT_APP_STORAGE_URL=https://storage.googleapis.com/replit-objstore-[YOUR-ID]
```

## 4️⃣ 실행
Shell에서 실행:
```bash
chmod +x start.sh
./start.sh
```

또는 직접 실행:
```bash
npm install
npm run build
npm run serve
```

## 5️⃣ 배포
1. "Deploy" 버튼 클릭
2. "Static Site" 선택
3. 설정:
   - Build command: `npm run build`
   - Public directory: `build`
4. "Deploy" 클릭

## ✅ 체크리스트
- [ ] Object Storage 활성화됨
- [ ] 20개 비디오 파일 업로드됨
- [ ] Storage URL 설정됨
- [ ] 빌드 성공
- [ ] 사이트 접속 가능

## 🆘 문제 해결

### 비디오가 안 나올 때:
1. 브라우저 개발자 도구(F12) → Console 확인
2. Storage URL이 올바른지 확인
3. 비디오 파일명이 1.mp4 ~ 20.mp4인지 확인

### 빌드 에러:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 포트 에러:
Replit은 자동으로 포트를 할당합니다. 
기본적으로 3000번 포트를 사용합니다.