# Replit Object Storage 비디오 스트리밍 아키텍처

## 🏗️ 시스템 아키텍처

**Flask 백엔드 + Replit Object Storage 통합**
- **서버**: Flask 웹 서버 (포트 5000)
- **스토리지**: Replit Object Storage API
- **프론트엔드**: 바닐라 JavaScript + HTML

## 📁 파일 구조

```
replit/
├── server.py           # Flask 백엔드 서버
├── index.html         # 비디오 갤러리 UI
├── style.css          # 스타일시트
├── check_videos.py    # 비디오 체크 유틸리티
└── script.js          # 추가 JavaScript 로직
```

### 1. server.py - Flask 백엔드
- **엔드포인트**:
  - `/`: 메인 페이지 제공
  - `/api/videos`: Object Storage의 비디오 목록 JSON 반환
  - `/download/<filename>`: 스트리밍 지원 비디오 다운로드
- **핵심 기능**:
  - Range 헤더 처리로 부분 콘텐츠 제공 (HTTP 206)
  - 비디오 스트리밍 최적화
  - 캐시 컨트롤 헤더 설정

### 2. index.html - 프론트엔드
- **기능**:
  - 동적 비디오 목록 로딩
  - 로딩 인디케이터 표시
  - HTML5 video 태그로 재생 컨트롤
- **이벤트 처리**:
  - `loadedmetadata`: 메타데이터 로드 완료
  - `loadstart`: 로딩 시작
  - `canplay`: 재생 준비 완료

## 🔄 데이터 플로우

```mermaid
graph LR
    A[브라우저] -->|GET /api/videos| B[Flask Server]
    B -->|client.list()| C[Replit Object Storage]
    C -->|파일 목록| B
    B -->|JSON 응답| A
    A -->|GET /download/file| B
    B -->|download_as_bytes()| C
    C -->|비디오 데이터| B
    B -->|스트리밍 응답| A
```

### 상세 플로우:
1. **비디오 목록 조회**
   - 브라우저 → GET /api/videos
   - Flask → Replit Object Storage (client.list())
   - 비디오 파일 필터링 (.mp4, .avi, .mov, .mkv, .webm, .flv, .wmv, .m4v)
   - JSON 응답: `[{name: "video.mp4", url: "/download/video.mp4"}]`

2. **비디오 스트리밍**
   - 브라우저 → GET /download/filename (Range 헤더 포함)
   - Flask → Object Storage (download_as_bytes)
   - Range 처리: 요청된 바이트 범위만 전송
   - 응답: 206 Partial Content 또는 200 OK

## ⚡ 핵심 기능

### 비디오 스트리밍 최적화
- **Range 헤더 지원**: 부분 콘텐츠 요청 처리
- **HTTP 206 응답**: Partial Content로 효율적 스트리밍
- **Accept-Ranges**: bytes 헤더로 범위 요청 가능 표시
- **캐싱**: 1시간 캐시 헤더 설정 (max-age=3600)

### 지원 비디오 포맷
- MP4 (권장)
- AVI
- MOV
- MKV
- WebM
- FLV
- WMV
- M4V

### 로딩 상태 관리
- 메타데이터 로드 중: 로딩 인디케이터 표시
- 로드 완료: 인디케이터 숨김
- 에러 처리: 사용자 친화적 에러 메시지

## 🚀 배포 체크리스트

### 1. Replit 환경 설정
```python
# requirements.txt
flask
replit
```

### 2. Object Storage 설정
- Replit 프로젝트에서 Object Storage 활성화
- 비디오 파일 업로드

### 3. 서버 실행
```bash
python server.py
```

### 4. 환경 변수 (필요시)
```python
# .env
PORT=5000
DEBUG=False
```

## 📝 코드 예제

### Object Storage 파일 목록 가져오기
```python
from replit.object_storage import Client

client = Client()
files = list(client.list())
for obj in files:
    print(f"File: {obj.name}")
```

### 파일 다운로드
```python
file_data = client.download_as_bytes(filename)
```

### Range 헤더 처리
```python
range_header = request.headers.get('Range', None)
if range_header:
    # bytes=0-1024 형식 파싱
    range_match = range_header.replace('bytes=', '').split('-')
    byte_start = int(range_match[0]) if range_match[0] else 0
    byte_end = int(range_match[1]) if range_match[1] else content_length - 1
    
    # 부분 콘텐츠 반환
    chunk_data = file_data[byte_start:byte_end + 1]
    return Response(chunk_data, 206, headers={
        'Content-Range': f'bytes {byte_start}-{byte_end}/{content_length}',
        'Accept-Ranges': 'bytes'
    })
```

## 🔧 문제 해결

### 일반적인 문제들

1. **비디오가 로드되지 않음**
   - Object Storage에 파일이 업로드되었는지 확인
   - 파일 확장자가 지원 목록에 있는지 확인
   - 브라우저 콘솔에서 에러 메시지 확인

2. **스트리밍이 끊김**
   - Range 헤더 처리가 올바른지 확인
   - Content-Length 헤더가 정확한지 확인
   - 네트워크 속도 확인

3. **Object Storage 연결 실패**
   - Replit 프로젝트에서 Object Storage가 활성화되었는지 확인
   - `from replit.object_storage import Client` 임포트 확인

## 🎯 최적화 팁

1. **비디오 파일 최적화**
   - H.264 코덱 사용 (최고 호환성)
   - 적절한 비트레이트 설정
   - 웹 최적화된 MP4 생성 (moov atom을 파일 앞쪽에 배치)

2. **성능 개선**
   - `preload="metadata"` 사용으로 초기 로딩 최소화
   - 썸네일 이미지 사용 고려
   - 지연 로딩(lazy loading) 구현

3. **사용자 경험**
   - 로딩 인디케이터 제공
   - 에러 상태 명확히 표시
   - 반응형 디자인 적용

## 📚 참고 자료

- [Replit Object Storage 문서](https://docs.replit.com/hosting/storage-and-databases/object-storage)
- [Flask 문서](https://flask.palletsprojects.com/)
- [HTTP Range Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests)
- [HTML5 Video API](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)