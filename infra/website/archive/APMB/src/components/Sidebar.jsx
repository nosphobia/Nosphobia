import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { Shield, FileText, CornerDownRight, Database, ChevronRight, ChevronDown } from 'lucide-react';
import { THEME, getGroupedAnomalies, RISK_LEVELS } from '../data/anomalies';

// 내부용 사이드바 아이템 컴포넌트
const SidebarItem = ({ icon: Icon, label, active, onClick, hasSub, indent, to, isOpen }) => {
  const content = (
    <div 
      className={`
        w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors text-xs md:text-sm font-medium
        ${active ? 'bg-[#322659] text-white' : 'hover:bg-gray-300 text-black'}
        ${indent ? 'pl-8 text-xs' : ''}
      `}
    >
      {Icon && <Icon size={14} />}
      <span className={`${THEME.fontKr} truncate flex-1`}>{label}</span>
      {/* 화살표 아이콘 처리 */}
      {hasSub && (
        isOpen ? <ChevronDown size={12} className="opacity-70" /> : <ChevronRight size={12} className="opacity-50" />
      )}
    </div>
  );

  if (to) return <Link to={to} className="w-full block">{content}</Link>;
  return <button onClick={onClick} className="w-full block">{content}</button>;
};

const Sidebar = ({ onOpenModal }) => {
  const location = useLocation();
  const params = useParams(); // URL 파라미터 확인용 (상세 페이지)
  const navigate = useNavigate();
  const groupedData = getGroupedAnomalies();

  // 상태 관리
  const [isDbOpen, setDbOpen] = useState(true); // '사상체 목록' 메뉴 자체가 열려있는지
  const [openRisk, setOpenRisk] = useState(null); // 어떤 등급이 열려있는지

  useEffect(() => {
    if (location.pathname.startsWith('/anomalies')) {
      setDbOpen(true);
      const parts = location.pathname.split('/');
      // URL이 /anomalies/Aj/... 형식이면 'Aj'를 자동으로 열어줌
      if (parts[2] && RISK_LEVELS[parts[2]]) {
        setOpenRisk(parts[2]);
      }
    }
  }, [location.pathname]);

  const toggleDb = () => {
    navigate('/anomalies'); // 클릭 시 전체 목록으로 이동
    setDbOpen(!isDbOpen);
  };

  const toggleRisk = (e, code) => {
    e.preventDefault(); // Link 이동과 클릭 이벤트 충돌 방지
    e.stopPropagation();
    navigate(`/anomalies/${code}`); // 클릭 시 해당 등급 페이지로 이동
    setOpenRisk(prev => prev === code ? null : code);
  };

  // 현재 경로 확인 함수
  const isPathActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-[#E0E0E0] border-r-2 border-white border-l-gray-500 shadow-xl flex-col hidden md:flex z-20">
      {/* 사용자 프로필 영역 */}
      <div className="p-4 border-b border-gray-400 bg-gray-200 mb-2">
        <div className="text-[10px] font-bold text-gray-500 mb-1 tracking-widest">USER PROFILE</div>
        <div className="font-mono text-sm font-bold truncate">TEMP_INVESTIGATOR</div>
        <div className="text-xs text-[#322659] mt-1 flex items-center gap-1 font-bold">
          <Shield size={10} /> CLEARANCE: IG
        </div>
      </div>
      
      {/* 네비게이션 영역 */}
      <nav className="flex-1 py-2 space-y-0.5 overflow-y-auto custom-scrollbar">
        <SidebarItem 
          icon={CornerDownRight} 
          label="대시보드" 
          to="/" 
          active={isPathActive('/')} 
        />
        
        <div className="px-3 py-2 mt-4 text-[10px] font-bold text-gray-500 tracking-wider border-t border-gray-300 pt-4">HUB DIRECTORY</div>
        
        {/* 모달 트리거용 아이템 (Link 아님) */}
        <SidebarItem 
          icon={FileText} 
          label="내부 규정 목록" 
          hasSub 
          onClick={() => onOpenModal('접근 제한', '현재 보안 등급으로는\n목록 페이지만 열람할 수 있습니다.')} 
        />
        <SidebarItem indent label="- 보안 인가 등급" />
        <SidebarItem indent label="- 표준 대응 지침(SOP)" />
        <SidebarItem indent label="- 변칙성 분류" />
        
        <div className="h-2"></div>
        
        {/* [1단계] 사상체 목록 (최상위) */}
        <SidebarItem 
          icon={Database} 
          label="사상체 목록" 
          onClick={toggleDb}
          active={location.pathname === '/anomalies'}
          hasSub
          isOpen={isDbOpen}
        />

        {/* [2단계] 등급 목록 (아코디언) */}
        {isDbOpen && (
          <div className="bg-gray-300/50 pb-2">
            {Object.entries(RISK_LEVELS).map(([code, info]) => (
              <div key={code}>
                <SidebarItem 
                  indent
                  label={`${info.name}`} 
                  onClick={(e) => toggleRisk(e, code)}
                  active={location.pathname === `/anomalies/${code}`}
                  hasSub
                  isOpen={openRisk === code}
                />
                
                {/* [3단계] 문서 목록 (아코디언 내부) */}
                {openRisk === code && (
                  <div className="bg-[#322659]/10 border-l-4 border-[#322659] ml-4">
                    {groupedData[code].map(doc => {
                      // 식별코드 뒤 4자리 추출
                      const shortId = doc.id.split('-').pop();
                      return (
                        <SidebarItem
                          key={doc.id}
                          indent
                          //label={`${doc.name} (${shortId})`} 
                          label={`${doc.id} (${doc.name})`} 
                          to={`/anomalies/${code}/${shortId}`} // 상세 페이지 링크
                          active={location.pathname.includes(shortId)}
                        />
                      );
                    })}
                    {groupedData[code].length === 0 && (
                      <div className="text-[10px] text-gray-500 pl-8 py-1">데이터 없음</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* 하단 상태바 */}
      <div className="p-3 border-t border-gray-400 bg-gray-200 text-[10px] text-center text-gray-500 font-mono">
        APMB Secure OS v4.0.2<br/>Connection Secure
      </div>

      

    </aside>
  );
};

export default Sidebar;