# 비디오 파일 가이드

이 폴더에는 포트폴리오 페이지에서 사용할 18개의 비디오 파일을 저장해야 합니다.

## 📹 필요한 비디오 파일 목록

각 스킬에 해당하는 비디오 파일을 준비하여 이 폴더에 저장하세요:

1. `rhythmical_edit.webm` - 리드미컬 편집 예시
2. `multicam_edit.webm` - 멀티캠 편집 예시
3. `insert_cutaway.webm` - 인서트/컷어웨이 활용 예시
4. `basic_color_correction.webm` - 기초 색 보정 예시
5. `color_grading.webm` - 색 그레이딩 예시
6. `lut_usage.webm` - LUT 활용 예시
7. `skintone_correction.webm` - 스킨톤 보정 예시
8. `bgm_mixing.webm` - 배경음악 믹싱 예시
9. `sfx_design.webm` - 효과음 디자인 예시
10. `dialogue_mixing.webm` - 대사/나레이션 믹싱 예시
11. `typography.webm` - 자막/키네틱 타이포그래피 예시
12. `motion_graphics.webm` - 2D 모션 그래픽 예시
13. `chromakey.webm` - 크로마키/합성 예시
14. `tracking_removal.webm` - 트래킹/개체제거 예시
15. `youtube_content.webm` - 유튜브 콘텐츠 편집 예시
16. `short_form.webm` - 숏폼 콘텐츠 예시
17. `advertisement.webm` - 광고/홍보 영상 예시
18. `documentary.webm` - 다큐/인터뷰 편집 예시

## 🎥 권장 비디오 사양

### 포맷
- **기본**: WebM (VP9 코덱)
- **대체**: MP4 (H.264 코덱)
- 두 포맷을 모두 준비하면 더 넓은 브라우저 호환성을 확보할 수 있습니다

### 해상도
- **권장**: 1920x1080 (Full HD)
- **최소**: 1280x720 (HD)

### 길이
- **권장**: 10-30초
- 루프 재생되므로 자연스러운 시작과 끝을 만들어주세요

### 파일 크기
- **권장**: 5-15MB
- **최대**: 20MB

### 비트레이트
- **비디오**: 2-5 Mbps
- **오디오**: 128-192 kbps (필요한 경우)

## 🛠 비디오 변환 도구

### FFmpeg를 사용한 WebM 변환
```bash
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus output.webm
```

### HandBrake
무료 오픈소스 비디오 변환 도구
- 다운로드: https://handbrake.fr/

### Online 변환 도구
- CloudConvert: https://cloudconvert.com/
- Convertio: https://convertio.co/

## 💡 팁

1. **루프 재생**: 비디오의 시작과 끝이 자연스럽게 이어지도록 편집하세요
2. **무음 처리**: 배경음악은 웹페이지에서 별도로 처리하므로 비디오는 무음으로 준비하는 것이 좋습니다
3. **압축**: 웹 성능을 위해 적절한 압축률을 사용하세요
4. **썸네일**: 비디오의 첫 프레임이 매력적인지 확인하세요

## 🚀 테스트용 임시 비디오

개발 중 테스트를 위해 다음 방법으로 임시 비디오를 생성할 수 있습니다:

### FFmpeg로 테스트 비디오 생성
```bash
# 단색 배경에 텍스트가 있는 10초 비디오 생성
ffmpeg -f lavfi -i color=c=black:s=1920x1080:d=10 -vf "drawtext=text='Rhythmical Edit':fontcolor=white:fontsize=60:x=(w-text_w)/2:y=(h-text_h)/2" -c:v libvpx-vp9 rhythmical_edit.webm
```

각 비디오 파일에 대해 위 명령어의 텍스트 부분만 변경하여 생성할 수 있습니다.