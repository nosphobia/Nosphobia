import React from 'react';
import { Activity, AlertTriangle } from 'lucide-react';
import { THEME } from '../data/anomalies';

const Dashboard = () => {
  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* 공지사항 섹션 */}
      <div className="border-l-4 border-[#322659] bg-white p-4 shadow-sm">
        <h2 className={`${THEME.fontKr} font-bold text-lg mb-4 text-[#322659] flex items-center gap-2`}>
          <Activity size={20}/> 메인 공지사항
        </h2>
        <ul className="space-y-3 text-sm">
          <li className="flex flex-col md:flex-row gap-1 md:gap-4 border-b border-gray-200 pb-2">
            <span className="font-mono text-gray-500 bg-gray-100 px-1 w-fit">[2023-11-25]</span>
            <span className="font-bold">외부 탐사자(IG) 접속 허용 지침 하달</span>
          </li>
          <li className="flex flex-col md:flex-row gap-1 md:gap-4 border-b border-gray-200 pb-2">
              <span className="font-mono text-gray-500 bg-gray-100 px-1 w-fit">[2023-11-20]</span>
              <span className="text-gray-600">보안 규정 업데이트 (v3.11) - 변칙성 분류 개정</span>
          </li>
        </ul>
      </div>
      
      {/* 시스템 경고 배너 */}
      <div className="bg-[#D9534F]/5 border border-[#D9534F] p-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#D9534F] mb-1 font-bold text-sm">
            <AlertTriangle size={16} />
            <span>SYSTEM ALERT</span>
          </div>
          <div className="text-xs text-[#D9534F]">본 사이트의 모든 접속 기록은 감시되고 있습니다.</div>
        </div>
        <div className="font-mono font-bold text-[#D9534F] text-xl">CODE: YELLOW</div>
      </div>
    </div>
  );
};

export default Dashboard;