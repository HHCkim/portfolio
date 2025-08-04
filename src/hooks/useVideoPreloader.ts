import { useEffect, useRef } from 'react';
import { getVideoPath } from '../utils/videoUtils';

interface VideoPreloaderOptions {
  preloadCount?: number;
  preloadType?: 'metadata' | 'auto' | 'none';
}

/**
 * 비디오 프리로딩 훅
 * 현재 비디오 주변의 비디오들을 미리 로드하여 전환 시 딜레이를 최소화
 */
export const useVideoPreloader = (
  currentVideoId: number,
  totalVideos: number,
  options: VideoPreloaderOptions = {}
) => {
  const { preloadCount = 2, preloadType = 'metadata' } = options;
  const preloadedVideos = useRef<Map<number, HTMLVideoElement>>(new Map());

  useEffect(() => {
    // 현재 비디오 주변의 비디오 ID 계산
    const videosToPreload: number[] = [];
    
    // 이전 비디오들
    for (let i = 1; i <= preloadCount; i++) {
      const prevId = currentVideoId - i;
      if (prevId >= 1) {
        videosToPreload.push(prevId);
      }
    }
    
    // 다음 비디오들
    for (let i = 1; i <= preloadCount; i++) {
      const nextId = currentVideoId + i;
      if (nextId <= totalVideos) {
        videosToPreload.push(nextId);
      }
    }

    // 프리로드 실행
    videosToPreload.forEach(videoId => {
      if (!preloadedVideos.current.has(videoId)) {
        const video = document.createElement('video');
        video.preload = preloadType;
        video.src = getVideoPath(`/videos/${videoId}.mp4`);
        
        // 메타데이터 로드 완료 시 로깅 (디버깅용)
        video.addEventListener('loadedmetadata', () => {
          console.log(`Preloaded metadata for video ${videoId}`);
        });
        
        preloadedVideos.current.set(videoId, video);
      }
    });

    // 너무 멀리 떨어진 비디오들 정리
    const minId = Math.max(1, currentVideoId - preloadCount - 1);
    const maxId = Math.min(totalVideos, currentVideoId + preloadCount + 1);
    
    preloadedVideos.current.forEach((video, id) => {
      if (id < minId || id > maxId) {
        video.src = '';
        preloadedVideos.current.delete(id);
        console.log(`Removed preload for video ${id}`);
      }
    });

    return () => {
      // 클린업: 컴포넌트 언마운트 시 모든 프리로드된 비디오 정리
      if (preloadedVideos.current.size > 10) {
        preloadedVideos.current.forEach(video => {
          video.src = '';
        });
        preloadedVideos.current.clear();
      }
    };
  }, [currentVideoId, totalVideos, preloadCount, preloadType]);

  return preloadedVideos.current;
};