/**
 * 비디오 URL 유틸리티
 * 로컬 개발과 Replit Object Storage 환경을 자동으로 감지하여 적절한 URL 반환
 */

// 환경 변수에서 Storage URL 가져오기
const STORAGE_URL = process.env.REACT_APP_STORAGE_URL || '';
const USE_CLOUD_STORAGE = process.env.REACT_APP_USE_CLOUD_STORAGE === 'true';

// Replit 환경 감지 - 더 넓은 범위의 Replit 도메인 지원
const isReplit = typeof window !== 'undefined' && (
  window.location.hostname.includes('repl.co') ||
  window.location.hostname.includes('replit.dev') ||
  window.location.hostname.includes('replit.app') ||
  window.location.hostname.includes('repl.it') ||
  window.location.hostname.includes('replitusercontent.com')
);

/**
 * 비디오 번호를 받아서 적절한 URL 반환
 * @param videoNumber - 비디오 번호 (1-20)
 * @returns 완전한 비디오 URL
 */
export const getVideoUrl = (videoNumber: number): string => {
  // Replit 환경이거나 클라우드 스토리지 사용이 활성화된 경우
  if (isReplit || USE_CLOUD_STORAGE) {
    // Replit Object Storage URL 사용
    const storageUrl = STORAGE_URL || 'https://storage.googleapis.com/replit-objstore-2671be20-ff2f-4b45-b882-bc823dc5b905';
    return `${storageUrl}/videos/${videoNumber}.mp4`;
  }
  
  // 로컬 개발 환경
  return `/videos/${videoNumber}.mp4`;
};

/**
 * 비디오 경로를 받아서 적절한 URL 반환
 * @param path - 비디오 경로 (예: '/videos/1.mp4')
 * @returns 완전한 비디오 URL
 */
export const getVideoPath = (path: string): string => {
  // 이미 완전한 URL인 경우 그대로 반환
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Replit 환경이거나 클라우드 스토리지 사용이 활성화된 경우
  if (isReplit || USE_CLOUD_STORAGE) {
    const storageUrl = STORAGE_URL || 'https://storage.googleapis.com/replit-objstore-2671be20-ff2f-4b45-b882-bc823dc5b905';
    // '/videos/1.mp4' -> 'videos/1.mp4'로 변환
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${storageUrl}/${cleanPath}`;
  }
  
  // 로컬 개발 환경
  return path;
};

/**
 * 현재 환경 정보 반환
 */
export const getEnvironmentInfo = () => {
  return {
    isReplit,
    useCloudStorage: isReplit || USE_CLOUD_STORAGE,
    storageUrl: STORAGE_URL,
    environment: isReplit ? 'replit' : 'local'
  };
};