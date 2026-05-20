import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { CornerDownRight, Database, Lock } from 'lucide-react';
import Header from './Header';
import Sidebar from './Sidebar';
import Modal from './Modal';
import { THEME } from '../data/anomalies';

const Layout = () => {
  const [modal, setModal] = useState({ open: false, title: '', message: '' });
  const location = useLocation();

  // 모달 열기 함수
  const handleOpenModal = (title, message) => {
    setModal({ open: true, title, message });
  };

  // 현재 경로 표시용 헬퍼 (상단 주소줄)
  const getCurrentPathLabel = () => {
    if (location.pathname === '/') return 'DASHBOARD';
    if (location.pathname.startsWith('/anomalies')) {
      return location.pathname.includes('/') && location.pathname !== '/anomalies' 
        ? 'DOC VIEW' 
        : 'LIST ANOMALY';
    }
    return 'UNKNOWN';
  };

  return (
    <div className={`flex flex-col h-screen ${THEME.bg} ${THEME.text} overflow-hidden select-none`}>
      {/* CRT 모니터 스캔라인 효과 */}
      <div className="scanline absolute inset-0 pointer-events-none z-50"></div>
      
      <Header />
      <div className="crt-overlay"></div>
      <div className="flex flex-1 overflow-hidden relative z-0">
        <Sidebar onOpenModal={handleOpenModal} />

        <main className="flex-1 bg-[#808080] p-2 md:p-3 overflow-hidden relative flex flex-col">
          {/* 상단 경로 표시줄 (터미널 스타일) */}
          
          <div className="bg-[#E0E0E0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-600 px-2 py-1 mb-2 text-xs font-mono flex items-center gap-2 shadow-sm shrink-0">
            <span className="text-gray-600">ROOT</span>
            <span>{'>'}</span>
            <span className="font-bold text-[#322659]">{getCurrentPathLabel()}</span>
            {location.pathname !== '/' && location.pathname !== '/anomalies' && (
              <span className="truncate max-w-[150px] opacity-50">{'>'} {location.pathname.split('/').pop()}</span>
            )}
          </div>

          {/* 메인 콘텐츠 영역 (Outlet) */}
          <div className="flex-1 bg-white border-2 border-gray-600 border-t-gray-800 border-l-gray-800 border-r-white border-b-white overflow-auto custom-scrollbar relative shadow-inner">
            {/* 하위 페이지에 모달 제어 함수 전달 (Context 대용) */}
            <Outlet context={{ onOpenModal: handleOpenModal }} />
          </div>
        </main>
      </div>

      <Modal 
        isOpen={modal.open} 
        onClose={() => setModal({ ...modal, open: false })} 
        title={modal.title} 
        message={modal.message} 
      />
      
      {/* 모바일 하단 네비게이션 */}
      <div className="md:hidden bg-[#322659] text-white flex justify-around p-2 text-xs shrink-0 relative z-50 border-t-4 border-[#1a1333]">
        <Link to="/" className="flex flex-col items-center gap-1 w-16">
          <CornerDownRight size={20}/> <span className="scale-90">홈</span>
        </Link>
        <Link to="/anomalies" className="flex flex-col items-center gap-1 w-16">
          <Database size={20}/> <span className="scale-90">DB</span>
        </Link>
        <button 
          onClick={() => handleOpenModal('오류', '모바일 환경에서는 로그아웃이 불가능합니다.')} 
          className="flex flex-col items-center gap-1 opacity-50 w-16"
        >
          <Lock size={20}/> <span className="scale-90">잠금</span>
        </button>
      </div>
    </div>
  );
};

export default Layout;