# 🎬 비디오 최적화 가이드

## 📊 Replit Object Storage 최적화

### 1. 비디오 파일 최적화 (FFmpeg 사용)

#### 웹 스트리밍용 최적화
```bash
# Fast Start 활성화 (moov atom을 파일 앞쪽으로 이동)
ffmpeg -i input.mp4 -movflags faststart -acodec copy -vcodec copy output.mp4

# H.264 코덱으로 재인코딩 + 웹 최적화
ffmpeg -i input.mp4 -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k -movflags +faststart output.mp4

# 해상도 조정 + 비트레이트 제한
ffmpeg -i input.mp4 -vf scale=1280:720 -c:v libx264 -preset medium -b:v 2M -maxrate 2.5M -bufsize 5M -c:a aac -b:a 128k -movflags +faststart output.mp4
```

#### 다중 해상도 버전 생성
```bash
# 720p 버전
ffmpeg -i input.mp4 -vf scale=1280:720 -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k -movflags +faststart output_720p.mp4

# 480p 버전 (모바일용)
ffmpeg -i input.mp4 -vf scale=854:480 -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 96k -movflags +faststart output_480p.mp4

# 1080p 버전 (고화질)
ffmpeg -i input.mp4 -vf scale=1920:1080 -c:v libx264 -preset medium -crf 21 -c:a aac -b:a 192k -movflags +faststart output_1080p.mp4
```

### 2. 파일 크기 최적화

#### 타겟 파일 크기로 압축
```bash
# 50MB 타겟 (30초 비디오 기준)
# 비트레이트 계산: (50MB * 8192) / 30초 = 약 13,653 kbps
ffmpeg -i input.mp4 -b:v 13000k -b:a 128k -movflags +faststart output_50mb.mp4

# 2-pass 인코딩으로 품질 향상
ffmpeg -i input.mp4 -c:v libx264 -b:v 13000k -pass 1 -an -f mp4 /dev/null
ffmpeg -i input.mp4 -c:v libx264 -b:v 13000k -pass 2 -c:a aac -b:a 128k -movflags +faststart output_50mb.mp4
```

### 3. 브라우저 호환성 최적화

#### 모든 브라우저 지원 코덱
```bash
# H.264 Baseline Profile (최고 호환성)
ffmpeg -i input.mp4 -c:v libx264 -profile:v baseline -level 3.0 -c:a aac -movflags +faststart output_compatible.mp4

# WebM 대안 (Chrome/Firefox)
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus output.webm
```

## 🚀 프론트엔드 최적화 전략

### 1. 프리로딩 전략
```typescript
// 현재 구현된 기능
- 메타데이터 프리로딩: 주변 2개 비디오 미리 로드
- LRU 캐시: 최대 5개 비디오 메모리 캐싱
- AbortController: 불필요한 로딩 즉시 취소
```

### 2. 스트리밍 최적화
```typescript
// Range 요청 활용
- Partial Content (206) 응답 처리
- 버퍼링 진행률 실시간 모니터링
- 네트워크 상태에 따른 품질 조정 (구현 예정)
```

### 3. 사용자 경험 최적화
```typescript
// 현재 구현된 UX 기능
- 페이드 트랜지션: 부드러운 비디오 전환
- 버퍼링 인디케이터: 로딩 상태 시각화
- 자동 재생: 섹션 진입 시 자동 시작
```

## 📈 성능 메트릭

### 목표 성능 지표
- **초기 로딩**: < 2초 (메타데이터)
- **비디오 전환**: < 500ms
- **버퍼링 시작**: < 1초
- **메모리 사용**: < 200MB

### 측정 방법
```javascript
// Chrome DevTools에서 측정
// 1. Network 탭: 로딩 시간 확인
// 2. Performance 탭: 렌더링 성능 확인
// 3. Memory 탭: 메모리 사용량 확인

// 코드로 측정
const measureVideoLoad = () => {
  const startTime = performance.now();
  video.addEventListener('loadedmetadata', () => {
    console.log(`Metadata loaded in ${performance.now() - startTime}ms`);
  });
  video.addEventListener('canplay', () => {
    console.log(`Ready to play in ${performance.now() - startTime}ms`);
  });
};
```

## 🔧 Replit 배포 체크리스트

### 비디오 준비
- [ ] 모든 비디오 H.264 코덱 사용
- [ ] Fast Start 활성화 확인
- [ ] 각 파일 50MB 이하
- [ ] 파일명 1.mp4 ~ 20.mp4

### Object Storage 설정
- [ ] Storage 활성화
- [ ] videos/ 폴더 생성
- [ ] 모든 비디오 업로드
- [ ] CORS 설정 확인

### 환경 변수
- [ ] REACT_APP_STORAGE_URL 설정
- [ ] REACT_APP_USE_CLOUD_STORAGE=true
- [ ] NODE_ENV=production

### 성능 테스트
- [ ] 모든 비디오 로딩 확인
- [ ] 스크롤 전환 부드러움 확인
- [ ] 모바일 테스트
- [ ] 느린 네트워크 테스트

## 🛠️ 문제 해결

### 비디오가 느리게 로드될 때
1. Fast Start 활성화 확인
2. 파일 크기 확인 (50MB 이하)
3. 네트워크 속도 확인
4. 브라우저 캐시 활용

### CORS 에러 발생 시
1. Object Storage CORS 설정 확인
2. crossOrigin="anonymous" 속성 확인
3. Storage URL 정확성 확인

### 모바일에서 자동재생 안 될 때
1. muted 속성 확인
2. playsInline 속성 확인
3. 사용자 인터랙션 후 재생 구현