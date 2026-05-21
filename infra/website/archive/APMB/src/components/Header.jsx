import React, { useState, useEffect } from 'react';
import { THEME } from '../data/anomalies';

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-12 bg-[#322659] text-white flex items-center justify-between px-4 border-b-4 border-[#1a1333] shadow-md z-30 shrink-0 relative">
      <div className="flex items-center gap-3">
        {/* 로고 아이콘 */}
        <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
          <div className="w-2 h-2 bg-[#322659] rounded-full animate-pulse"></div>
        </div>
        {/* 사이트 제목 */}
        <span className={`${THEME.fontEn} font-bold tracking-wider text-base md:text-lg`}>
          APMB INTRANET
        </span>
      </div>

      {/* 우측 정보 패널 */}
      <div className="flex items-center gap-4 text-xs font-mono opacity-80">
        <span className="hidden md:inline text-gray-300">LOC: KR-SEOUL-HQ</span>
        <span>{currentTime.toLocaleTimeString('en-US', { hour12: false })}</span>
        <span className="bg-red-600 px-2 py-0.5 text-white font-bold">IG-CLASS</span>
      </div>
    </header>
  );
};

export default Header;