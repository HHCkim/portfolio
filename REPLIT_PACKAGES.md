# 📦 Replit 설치 패키지 가이드

## 🔧 자동 설치되는 패키지들

Replit에 프로젝트를 업로드하면 `npm install` 명령으로 자동 설치됩니다.

### 🎯 핵심 의존성 (dependencies)

#### React 관련
- **react** (^18.2.0) - React 라이브러리 코어
- **react-dom** (^18.2.0) - React DOM 렌더링
- **react-router-dom** (^6.20.1) - React 라우팅 (SPA)
- **react-scripts** (5.0.1) - Create React App 빌드 도구

#### TypeScript 관련
- **typescript** (^4.9.5) - TypeScript 컴파일러
- **@types/react** (^18.2.45) - React 타입 정의
- **@types/react-dom** (^18.2.18) - React DOM 타입 정의
- **@types/node** (^16.18.68) - Node.js 타입 정의
- **@types/jest** (^27.5.2) - Jest 테스트 타입 정의

#### 애니메이션
- **framer-motion** (^11.0.0) ⭐ - 스크롤 애니메이션, 페이드 효과
  - 스크롤 기반 배경색 전환
  - 텍스트 스태거 애니메이션
  - 부드러운 트랜지션 효과

#### 테스팅 (선택적)
- **@testing-library/react** (^13.4.0) - React 테스트 유틸
- **@testing-library/jest-dom** (^5.17.0) - Jest DOM 매처
- **@testing-library/user-event** (^13.5.0) - 사용자 이벤트 시뮬레이션

#### 기타
- **web-vitals** (^2.1.4) - 성능 메트릭 측정

### 🛠️ 개발 의존성 (devDependencies)

#### 스타일링
- **tailwindcss** (^3.3.6) ⭐ - 유틸리티 CSS 프레임워크
- **autoprefixer** (^10.4.16) - CSS 벤더 프리픽스 자동 추가
- **postcss** (^8.4.32) - CSS 변환 도구

#### 프로덕션 서버
- **serve** (^14.2.1) ⭐ - 정적 파일 서빙 (프로덕션용)

## 📝 설치 명령어

### 기본 설치 (Replit이 자동 실행)
```bash
npm install
```

### 수동 설치가 필요한 경우
```bash
# 모든 패키지 재설치
rm -rf node_modules package-lock.json
npm install

# 특정 패키지 재설치
npm install framer-motion@^11.0.0
npm install tailwindcss@^3.3.6 --save-dev
```

## ⚠️ 중요 패키지 설명

### 1. **framer-motion** (필수)
- 스크롤 기반 배경 애니메이션
- 텍스트 word-by-word 애니메이션
- 페이지 전환 효과
- 없으면: 애니메이션이 작동하지 않음

### 2. **tailwindcss** (필수)
- 모든 스타일링 담당
- 반응형 디자인
- 다크 테마 색상
- 없으면: 스타일이 완전히 깨짐

### 3. **serve** (프로덕션 필수)
- 빌드된 파일 서빙
- Replit 배포 시 사용
- 없으면: 프로덕션 실행 불가

### 4. **react-scripts** (필수)
- 빌드 및 개발 서버
- Webpack 설정 포함
- 없으면: 빌드/실행 불가

## 🚀 Replit 설치 순서

1. **프로젝트 업로드 후 자동 실행**:
   ```bash
   npm install  # Replit이 자동으로 실행
   ```

2. **빌드 실행**:
   ```bash
   npm run build  # 프로덕션 빌드 생성
   ```

3. **서버 시작**:
   ```bash
   npm run serve  # serve로 정적 파일 서빙
   ```

## 💡 Node.js 버전 요구사항

```json
"engines": {
  "node": ">=18.0.0",  // Node.js 18 이상
  "npm": ">=8.0.0"     // npm 8 이상
}
```

**Replit 기본 Node.js**: 20.x (replit.nix에 설정됨)

## 🔍 패키지 확인 방법

### 설치 확인
```bash
# 설치된 패키지 목록
npm list

# 특정 패키지 확인
npm list framer-motion
npm list tailwindcss

# 누락된 패키지 확인
npm ls
```

### 버전 확인
```bash
# Node.js 버전
node --version

# npm 버전
npm --version

# 특정 패키지 버전
npm list framer-motion --depth=0
```

## 🆘 트러블슈팅

### 패키지 설치 실패 시
```bash
# 캐시 클리어
npm cache clean --force

# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### 특정 패키지 에러 시
```bash
# framer-motion 에러
npm uninstall framer-motion
npm install framer-motion@11.0.0

# tailwindcss 에러
npm uninstall tailwindcss autoprefixer postcss
npm install -D tailwindcss@3.3.6 autoprefixer@10.4.16 postcss@8.4.32
```

### 빌드 에러 시
```bash
# react-scripts 재설치
npm uninstall react-scripts
npm install react-scripts@5.0.1
```

## ✅ 최종 체크리스트

- [ ] Node.js 18+ 설치됨
- [ ] 모든 dependencies 설치됨
- [ ] 모든 devDependencies 설치됨
- [ ] `npm run build` 성공
- [ ] `npm run serve` 실행 가능
- [ ] framer-motion 애니메이션 작동
- [ ] Tailwind CSS 스타일 적용됨