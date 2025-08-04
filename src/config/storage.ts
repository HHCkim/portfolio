// Storage configuration for video files
export const getVideoUrl = (videoNumber: number): string => {
  const useCloudStorage = process.env.REACT_APP_USE_CLOUD_STORAGE === 'true';
  const storageUrl = process.env.REACT_APP_STORAGE_URL;
  
  if (useCloudStorage && storageUrl) {
    // Replit Object Storage URL format
    return `${storageUrl}/videos/${videoNumber}.mp4`;
  }
  
  // Fallback to local videos
  return `/videos/${videoNumber}.mp4`;
};

// Check if running in production (Replit)
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production' || 
         process.env.REACT_APP_USE_CLOUD_STORAGE === 'true';
};

// Video preloading configuration
export const videoConfig = {
  preloadCount: 2, // Number of videos to preload ahead
  maxRetries: 3,   // Maximum retry attempts for failed loads
  retryDelay: 1000, // Delay between retries in ms
};