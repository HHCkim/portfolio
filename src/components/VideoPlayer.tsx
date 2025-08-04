import React, { useRef, useEffect, useState } from 'react';
import { VideoStreamLoader } from '../services/videoService';
import { getVideoPath } from '../utils/videoUtils';

interface VideoPlayerProps {
  videoSrc: string;
  isVideoChanging: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoSrc, isVideoChanging }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamLoaderRef = useRef<VideoStreamLoader | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [bufferProgress, setBufferProgress] = useState(0);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      // StreamLoader 초기화
      if (!streamLoaderRef.current) {
        streamLoaderRef.current = new VideoStreamLoader(video);
      }
      
      // 비디오 소스가 변경되면 페이드 아웃
      setIsVideoLoaded(false);
      setIsPlaying(true);
      setBufferProgress(0);
      
      // 볼륨 설정
      video.volume = volume;
      video.muted = isMuted;
      
      // Replit Object Storage 최적화된 로딩
      const loadVideo = async () => {
        try {
          const videoPath = getVideoPath(videoSrc);
          
          // 스트림 로더로 비디오 로드
          await streamLoaderRef.current?.load(videoSrc, {
            preload: 'metadata',
            crossOrigin: 'anonymous'
          });
          
          // 비디오가 재생 준비되면 페이드 인
          video.play().catch((error) => {
            if (error.name !== 'AbortError') {
              console.error('Video playback failed:', error);
            }
          });
          
          setTimeout(() => {
            setIsVideoLoaded(true);
          }, 100);
        } catch (error) {
          console.error('Video loading error:', error);
        }
      };
      
      loadVideo();
      
      // 버퍼링 진행 상황 모니터링
      const bufferInterval = setInterval(() => {
        if (streamLoaderRef.current) {
          const progress = streamLoaderRef.current.getBufferedProgress();
          setBufferProgress(progress);
        }
      }, 1000);
      
      return () => {
        clearInterval(bufferInterval);
        streamLoaderRef.current?.abort();
      };
    }
  }, [videoSrc, volume, isMuted]);

  // 비디오 메타데이터 및 시간 업데이트 핸들러
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  // 컨트롤 표시/숨김 처리
  const handleMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
  };

  // 재생/일시정지 토글
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  // 시크바 변경 처리
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // 볼륨 변경 처리
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    
    // 볼륨이 0보다 크면 음소거 해제
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
      video.muted = false;
    }
  };

  // 음소거 토글
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const newMuted = !isMuted;
    setIsMuted(newMuted);
    video.muted = newMuted;
  };

  // 시간 포맷팅 함수
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-3/5 h-screen sticky top-0 bg-black flex items-center justify-center">
      <div 
        className="relative w-full h-full flex items-center justify-center"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isVideoChanging ? 'opacity-100' : 'opacity-0'
          } pointer-events-none z-10`}
        />
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ${
              isVideoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            autoPlay
            loop={false}
            muted={isMuted}
            playsInline
            preload="metadata"
            crossOrigin="anonymous"
          >
            Your browser does not support the video tag.
          </video>
          
          {/* 버퍼링 인디케이터 */}
          {bufferProgress < 0.9 && !isVideoLoaded && (
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="w-24 h-1 bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${bufferProgress * 100}%` }}
                  />
                </div>
                <span className="text-white text-xs">
                  {Math.round(bufferProgress * 100)}%
                </span>
              </div>
            </div>
          )}
            
          {/* 비디오 컨트롤 오버레이 */}
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={togglePlay}
          >
            {/* 재생/일시정지 버튼 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors"
              >
                {isPlaying ? (
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>
            </div>
              
              {/* 하단 컨트롤 바 */}
              <div 
                className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 시크바 */}
                <div className="mb-3">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, #4b5563 ${(currentTime / duration) * 100}%, #4b5563 100%)`
                    }}
                  />
                </div>
                
                {/* 하단 컨트롤 버튼들 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* 재생/일시정지 버튼 */}
                    <button
                      onClick={togglePlay}
                      className="text-white hover:text-gray-300 transition-colors"
                    >
                      {isPlaying ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      )}
                    </button>
                    
                    {/* 시간 표시 */}
                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  
                  {/* 볼륨 컨트롤 */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMute}
                      className="text-white hover:text-gray-300 transition-colors"
                    >
                      {isMuted || volume === 0 ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                        </svg>
                      ) : volume < 0.5 ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                        </svg>
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(isMuted ? 0 : volume) * 100}%, #4b5563 ${(isMuted ? 0 : volume) * 100}%, #4b5563 100%)`
                      }}
                    />
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;