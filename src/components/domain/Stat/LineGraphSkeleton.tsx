import React from "react";

// 대시보드와 통계 페이지의 기준점을 상수로 정의
export const CHART_BREAKPOINTS = {
  DASHBOARD:
    "w-[calc(100vw-20px)] h-[300px] [@media(min-width:425px)]:w-[400px]",
  STATISTICS: "w-[calc(100vw-20px)] h-[300px] md:w-[700px]",
} as const;

interface SkeletonProps {
  type?: keyof typeof CHART_BREAKPOINTS; // 대시보드용인지 통계용인지 선택
}

export default function LineGraphSkeleton({
  type = "STATISTICS",
}: SkeletonProps) {
  // 1. 논의한 반응형 CSS 너비 설정 적용
  const containerClassName = `mx-auto p-6 bg-white rounded-xl border border-gray-100 ${CHART_BREAKPOINTS[type]}`;

  return (
    <div
      className={`${containerClassName} relative animate-pulse overflow-hidden`}
    >
      {/* 3. 그래프 내부 영역 */}
      <div className="relative mt-6 h-full w-full">
        {/* Y축 가이드라인 & 라벨 */}
        <div className="absolute inset-y-0 left-0 flex flex-col justify-between border-r border-gray-100 py-2 pr-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-3 w-6 rounded-full bg-gray-100" />{" "}
              {/* 가짜 Y축 라벨 */}
              <div className="absolute right-0 left-10 w-[calc(100%-2.5rem)] border-t border-gray-50" />{" "}
              {/* 가이드라인 */}
            </div>
          ))}
        </div>

        {/* 4. 가짜 라인 그래프 (SVG shimmer 애니메이션) */}
        <svg
          className="absolute inset-y-0 left-10 h-full w-[calc(100%-2.5rem)] py-2"
          preserveAspectRatio="none"
          viewBox="0 0 100 100" // 상대 좌표 사용으로 반응형 대응
        >
          <defs>
            {/* 왼쪽에서 오른쪽으로 흐르는 shimmer 효과 */}
            <linearGradient
              id="shimmerGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#f3f4f6" />
              <stop offset="50%" stopColor="#e5e7eb" />
              <stop offset="100%" stopColor="#f3f4f6" />
              <animate
                attributeName="offset"
                values="-2; 2"
                dur="2s"
                repeatCount="indefinite"
              />
            </linearGradient>
          </defs>

          {/* 완만한 곡선으로 28개 데이터 포인트의 느낌을 흉내 냄 */}
          <path
            d="M 0 80 Q 10 20, 20 60 T 40 40 T 60 70 T 80 30 T 100 50"
            fill="none"
            stroke="url(#shimmerGradient)"
            strokeWidth="2"
            style={{ vectorEffect: "non-scaling-stroke" }} // 너비가 변해도 선 굵기 유지
          />
        </svg>

        {/* 5. X축 라벨 스켈레톤 */}
        <div className="absolute -bottom-8 left-10 flex w-[calc(100%-2.5rem)] justify-between px-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-3 w-10 rounded-full bg-gray-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
