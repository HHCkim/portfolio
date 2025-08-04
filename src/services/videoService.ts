/**
 * 비디오 서비스 - Replit Object Storage 최적화
 * Range 요청과 스트리밍을 지원하는 비디오 로딩 서비스
 */

import { getVideoPath } from '../utils/videoUtils';

interface VideoLoadOptions {
  preload?: 'none' | 'metadata' | 'auto';
  crossOrigin?: 'anonymous' | 'use-credentials';
  withCredentials?: boolean;
}

/**
 * 비디오 메타데이터 프리페치
 * 비디오의 메타데이터만 미리 로드하여 duration, dimensions 등 정보 획득
 */
export const prefetchVideoMetadata = async (videoUrl: string): Promise<VideoMetadata> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    const cleanup = () => {
      video.removeEventListener('loadedmetadata', onMetadata);
      video.removeEventListener('error', onError);
      video.src = '';
    };
    
    const onMetadata = () => {
      const metadata: VideoMetadata = {
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
        url: videoUrl
      };
      cleanup();
      resolve(metadata);
    };
    
    const onError = () => {
      cleanup();
      reject(new Error(`Failed to load metadata for ${videoUrl}`));
    };
    
    video.addEventListener('loadedmetadata', onMetadata);
    video.addEventListener('error', onError);
    video.src = videoUrl;
  });
};

/**
 * 비디오 스트림 로더
 * Range 요청을 활용한 점진적 로딩
 */
export class VideoStreamLoader {
  private videoElement: HTMLVideoElement;
  private abortController: AbortController | null = null;
  
  constructor(videoElement: HTMLVideoElement) {
    this.videoElement = videoElement;
  }
  
  /**
   * 비디오 로드 시작
   */
  async load(videoPath: string, options: VideoLoadOptions = {}): Promise<void> {
    // 이전 로드 취소
    this.abort();
    
    const url = getVideoPath(videoPath);
    
    // 새 AbortController 생성
    this.abortController = new AbortController();
    
    try {
      // 비디오 엘리먼트 설정
      this.videoElement.preload = options.preload || 'metadata';
      
      if (options.crossOrigin) {
        this.videoElement.crossOrigin = options.crossOrigin;
      }
      
      // Range 요청 지원 확인을 위한 HEAD 요청
      const headResponse = await fetch(url, {
        method: 'HEAD',
        signal: this.abortController.signal
      });
      
      const acceptsRanges = headResponse.headers.get('Accept-Ranges') === 'bytes';
      const contentLength = headResponse.headers.get('Content-Length');
      
      console.log(`Video ${videoPath}: Range support=${acceptsRanges}, Size=${contentLength}`);
      
      // 비디오 소스 설정
      this.videoElement.src = url;
      
      // 로드 시작
      return new Promise((resolve, reject) => {
        const onCanPlay = () => {
          this.videoElement.removeEventListener('canplay', onCanPlay);
          this.videoElement.removeEventListener('error', onError);
          resolve();
        };
        
        const onError = () => {
          this.videoElement.removeEventListener('canplay', onCanPlay);
          this.videoElement.removeEventListener('error', onError);
          reject(new Error(`Failed to load video: ${videoPath}`));
        };
        
        this.videoElement.addEventListener('canplay', onCanPlay);
        this.videoElement.addEventListener('error', onError);
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log(`Video load aborted: ${videoPath}`);
      } else {
        throw error;
      }
    }
  }
  
  /**
   * 로딩 중단
   */
  abort(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    
    // 비디오 소스 제거로 로딩 중단
    this.videoElement.src = '';
  }
  
  /**
   * 버퍼링 상태 확인
   */
  getBufferedRanges(): TimeRanges | null {
    return this.videoElement.buffered;
  }
  
  /**
   * 버퍼링 진행률 (0-1)
   */
  getBufferedProgress(): number {
    const buffered = this.videoElement.buffered;
    const duration = this.videoElement.duration;
    
    if (buffered.length === 0 || !duration) {
      return 0;
    }
    
    // 현재 재생 위치에서의 버퍼링 진행률
    const currentTime = this.videoElement.currentTime;
    
    for (let i = 0; i < buffered.length; i++) {
      const start = buffered.start(i);
      const end = buffered.end(i);
      
      if (currentTime >= start && currentTime <= end) {
        return end / duration;
      }
    }
    
    return 0;
  }
}

/**
 * 비디오 캐시 매니저
 * 메모리 효율적인 비디오 캐싱
 */
export class VideoCacheManager {
  private cache: Map<string, HTMLVideoElement> = new Map();
  private maxCacheSize: number;
  private accessOrder: string[] = [];
  
  constructor(maxCacheSize: number = 5) {
    this.maxCacheSize = maxCacheSize;
  }
  
  /**
   * 캐시에서 비디오 가져오기
   */
  get(videoPath: string): HTMLVideoElement | null {
    const cached = this.cache.get(videoPath);
    
    if (cached) {
      // LRU 업데이트
      this.updateAccessOrder(videoPath);
      return cached;
    }
    
    return null;
  }
  
  /**
   * 캐시에 비디오 추가
   */
  set(videoPath: string, video: HTMLVideoElement): void {
    // 캐시 크기 제한 확인
    if (this.cache.size >= this.maxCacheSize && !this.cache.has(videoPath)) {
      // LRU 제거
      const lru = this.accessOrder[0];
      const lruVideo = this.cache.get(lru);
      
      if (lruVideo) {
        lruVideo.src = '';
      }
      
      this.cache.delete(lru);
      this.accessOrder.shift();
    }
    
    this.cache.set(videoPath, video);
    this.updateAccessOrder(videoPath);
  }
  
  /**
   * 캐시 클리어
   */
  clear(): void {
    this.cache.forEach(video => {
      video.src = '';
    });
    
    this.cache.clear();
    this.accessOrder = [];
  }
  
  private updateAccessOrder(videoPath: string): void {
    const index = this.accessOrder.indexOf(videoPath);
    
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
    
    this.accessOrder.push(videoPath);
  }
}

// 타입 정의
interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  url: string;
}

// 싱글톤 인스턴스
export const videoCacheManager = new VideoCacheManager(5);