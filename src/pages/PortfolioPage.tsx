import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ScrollSection from '../components/ScrollSection';
import VideoPlayer from '../components/VideoPlayer';
import HeaderTextDisplay from '../components/HeaderTextDisplay';
import ScrollInstruction from '../components/ScrollInstruction';
import BackToTopButton from '../components/BackToTopButton';
import { getVideoPath } from '../utils/videoUtils';
import { useVideoPreloader } from '../hooks/useVideoPreloader';

interface PortfolioSection {
  id: number;
  title: string;
  description: string;
  videoSrc: string;
}

const portfolioSections: PortfolioSection[] = [
  // 편집 기초 스킬
  { id: 1, title: '스토리텔링 구성', description: '기승전결 구조를 만들어 시청자의 몰입을 유도하는 능력입니다. 의도된 순서로 컷을 배열하여 감정선을 만들고 메시지를 효과적으로 전달한 프로젝트를 보여주세요.', videoSrc: '/videos/1.mp4' },
  { id: 2, title: '리드미컬 편집', description: '음악의 비트나 영상의 호흡에 맞춰 컷을 전환하여 속도감과 역동성을 만드는 기술입니다. 뮤직비디오, 광고, 스포츠 하이라이트 영상에서 강점을 보여줄 수 있습니다.', videoSrc: '/videos/2.mp4' },
  { id: 3, title: '멀티캠 편집', description: '여러 각도에서 촬영된 영상을 동기화하고, 최적의 샷을 선택하여 편집하는 기술입니다. 인터뷰, 공연, 라이브 이벤트 영상 편집 경험을 어필할 수 있습니다.', videoSrc: '/videos/3.mp4' },
  { id: 4, title: '인서트/컷어웨이 활용', description: '메인 영상 위에 관련 영상을 덮어 시각적 단조로움을 피하고 추가 정보를 제공하는 능력입니다. 인터뷰나 정보 전달 영상에서 활용 능력을 보여주세요.', videoSrc: '/videos/4.mp4' },
  
  // 색 보정 및 그레이딩
  { id: 5, title: '기초 색 보정', description: '촬영 원본의 노출, 화이트 밸런스, 대비를 조정하여 일관되고 안정적인 화면을 만드는 기본 기술입니다. Before & After를 통해 기본기를 보여줄 수 있습니다.', videoSrc: '/videos/5.mp4' },
  { id: 6, title: '색 그레이딩 (톤앤매너)', description: '영상에 특정 색감을 입혀 감성적인 분위기와 의도된 톤을 연출하는 예술적 기술입니다. 영화적, 드라마틱, 청량한 느낌 등 다양한 톤을 연출한 프로젝트를 강조하세요.', videoSrc: '/videos/6.mp4' },
  { id: 7, title: 'LUT 활용', description: 'Look-Up Table을 사용하여 빠르고 일관된 색감 작업을 하는 능력입니다. Log 촬영 소스를 활용한 작업 경험이나 자신만의 LUT 제작 능력을 어필할 수 있습니다.', videoSrc: '/videos/7.mp4' },
  { id: 8, title: '스키톤 보정', description: '인물의 피부톤을 자연스럽고 화사하게 보정하는 디테일한 기술입니다. 뷰티, 인물 중심의 인터뷰 영상에서 전문성을 보여줄 수 있습니다.', videoSrc: '/videos/8.mp4' },
  
  // 사운드 디자인
  { id: 9, title: '배경음악(BGM) 믹싱', description: '영상의 분위기에 맞는 음악을 선곡하고, 대사나 효과음을 방해하지 않도록 볼륨을 조절하는 능력입니다.', videoSrc: '/videos/9.mp4' },
  { id: 10, title: '효과음(SFX) 디자인', description: '화면의 움직임이나 상황에 맞는 효과음을 배치하여 영상의 생동감과 몰입감을 높이는 기술입니다.', videoSrc: '/videos/10.mp4' },
  { id: 11, title: '오디오 클리닝', description: '인터뷰나 현장음의 노이즈(바람 소리, 잡음)를 제거하여 음성을 선명하게 만드는 기술입니다.', videoSrc: '/videos/11.mp4' },
  { id: 12, title: '대사/나레이션 믹싱', description: '배경음악, 효과음 사이에서 대사나 나레이션이 명확하게 들리도록 전체적인 사운드 밸런스를 맞추는 능력입니다.', videoSrc: '/videos/12.mp4' },
  
  // 그래픽 및 효과
  { id: 13, title: '자막/키네틱 타이포그래피', description: '가독성 높은 기본 자막부터, 텍스트에 움직임을 주어 시각적 효과를 극대화하는 키네틱 타이포그래피까지의 능력을 보여줍니다.', videoSrc: '/videos/13.mp4' },
  { id: 14, title: '2D 모션 그래픽', description: '로고 애니메이션, 인포그래픽, 아이콘 등 영상에 정보를 더하고 시각적 재미를 주는 그래픽 작업 능력입니다.', videoSrc: '/videos/14.mp4' },
  { id: 15, title: '크로마키/합성', description: '그린 스크린에서 촬영한 인물이나 사물을 다른 배경과 자연스럽게 합성하는 기술입니다.', videoSrc: '/videos/15.mp4' },
  { id: 16, title: '트래킹/개체제거', description: '화면 속 특정 움직임을 추적하여 그래픽을 입히거나, 불필요한 사물을 감쪽같이 지우는 고급 기술입니다.', videoSrc: '/videos/16.mp4' },
  
  // 플랫폼별 전문성
  { id: 17, title: '유튜브 콘텐츠', description: '빠른 호흡, 밈(meme) 활용, 효과음/자막 등 유튜브 플랫폼의 특성을 이해하고 시청자의 이탈을 막는 편집 경험을 보여줍니다.', videoSrc: '/videos/17.mp4' },
  { id: 18, title: '숏폼 (릴스/쇼츠/틱톡)', description: '짧은 시간 안에 시선을 사로잡는 자극적인 인트로, 빠른 컷 전환, 트렌디한 음악과 효과를 활용하는 세로형 영상 편집 능력입니다.', videoSrc: '/videos/18.mp4' },
  { id: 19, title: '광고/홍보 영상', description: '제품이나 브랜드의 메시지를 짧고 임팩트 있게 전달하는 상업 영상 편집 경험입니다. 높은 퀄리티의 영상미와 설득력 있는 스토리 구성 능력을 강조하세요.', videoSrc: '/videos/19.mp4' },
  { id: 20, title: '다큐/인터뷰', description: '긴 호흡의 스토리를 논리적으로 구성하고, 인물의 감정을 섬세하게 전달하는 편집 능력입니다. 방대한 소스를 다루는 능력과 진정성 있는 스토리텔링을 어필할 수 있습니다.', videoSrc: '/videos/20.mp4' }
];

// 다크톤 색상 배열 - 스크롤에 따라 전환될 배경색
const BGS = ["#0f172a", "#1e293b", "#334155", "#1e293b", "#0f172a"];

const PortfolioPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState(-1); // -1 represents header
  const [isVideoChanging, setIsVideoChanging] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // 비디오 프리로더 훅 사용 - 현재 비디오 주변 2개씩 미리 로드
  const preloadedVideos = useVideoPreloader(
    activeSection + 1, // 비디오 ID는 1부터 시작
    portfolioSections.length,
    { preloadCount: 2, preloadType: 'metadata' }
  );
  
  // 스크롤 컨테이너의 진행률 추적
  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
  });
  
  // 스크롤 진행률을 배경색으로 변환
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    BGS
  );

  useEffect(() => {
    // Intersection Observer 설정 - 각 섹션이 뷰포트에 들어올 때 감지
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px', // 화면 중앙 근처에서 트리거
      threshold: 0.5
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Check if it's the header
          if (entry.target === headerRef.current) {
            if (activeSection !== -1) {
              setActiveSection(-1);
              setShowBackToTop(false);
            }
          } else {
            const index = sectionRefs.current.findIndex(ref => ref === entry.target);
            if (index !== -1 && index !== activeSection) {
              // 이전 전환 타이머를 취소
              if (transitionTimeoutRef.current) {
                clearTimeout(transitionTimeoutRef.current);
              }
              
              setIsVideoChanging(true);
              transitionTimeoutRef.current = setTimeout(() => {
                setActiveSection(index);
                setIsVideoChanging(false);
                setShowBackToTop(true); // Show back to top button when not on header
              }, 300); // 페이드 트랜지션 시간
            }
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // 헤더를 옵저버에 등록
    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    // 모든 섹션을 옵저버에 등록
    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      if (headerRef.current) {
        observer.unobserve(headerRef.current);
      }
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
      // 타이머 정리
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [activeSection]);

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };


  return (
    <motion.div 
      className="h-screen text-gray-100 overflow-hidden"
      style={{ backgroundColor }}
    >
      <ScrollInstruction />
      <div className="flex h-full">
        {/* 왼쪽: 스크롤 가능한 텍스트 섹션 */}
        <div 
          ref={scrollContainerRef}
          className="w-2/5 h-screen overflow-y-auto scroll-smooth" 
          style={{ scrollSnapType: 'y mandatory' }}
        >
          {/* 헤더 - 스크롤 영역 내부에 위치 */}
          <div 
            ref={headerRef}
            className="h-screen flex items-center justify-center px-16" 
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="flex items-baseline">
              <h1 className="text-5xl font-bold text-gray-100 mr-6">Video Editor Portfolio</h1>
              <p className="text-xl text-gray-400">전문 영상 편집자의 20가지 핵심 스킬</p>
            </div>
          </div>
          
          {portfolioSections.map((section, index) => (
            <ScrollSection
              key={section.id}
              ref={(el) => (sectionRefs.current[index] = el)}
              title={section.title}
              description={section.description}
              isActive={activeSection === index}
            />
          ))}
          
          {/* Back to Top Button */}
          <BackToTopButton 
            isVisible={showBackToTop} 
            onClick={scrollToTop}
          />
        </div>

        {/* 오른쪽: 헤더일 때는 텍스트, 그 외에는 비디오 플레이어 */}
        {activeSection === -1 ? (
          <HeaderTextDisplay isActive={true} />
        ) : (
          <VideoPlayer 
            videoSrc={getVideoPath(portfolioSections[activeSection].videoSrc)}
            isVideoChanging={isVideoChanging}
          />
        )}
      </div>
    </motion.div>
  );
};

export default PortfolioPage;