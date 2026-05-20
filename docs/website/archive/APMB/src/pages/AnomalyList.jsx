import React from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { Database, Lock } from 'lucide-react';
import { getGroupedAnomalies, ANOMALIES, RISK_LEVELS, THEME } from '../data/anomalies';

const AnomalyList = () => {
  const navigate = useNavigate();
  const { onOpenModal } = useOutletContext();
  const { riskId } = useParams(); // URL에서 등급 코드 가져오기 (예: Aj)
  const groupedData = getGroupedAnomalies();

  const targetRisks = riskId 
    ? [[riskId, RISK_LEVELS[riskId]]] 
    : Object.entries(RISK_LEVELS);

const handleDocClick = (doc, riskCode) => {
    if (doc.access) {
      // 식별코드 뒤 4자리 추출
      const shortId = doc.id.split('-').pop();
      // URL 이동 방식 변경: /anomalies/등급/4자리번호
      navigate(`/anomalies/${riskCode}/${shortId}`);
    } else {
      onOpenModal('ACCESS DENIED', `[${doc.name}]\n접근 권한이 없습니다.`);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${THEME.fontKr} border-b-2 border-black pb-2`}>
        <Database size={24} /> 
        {/* 제목 동적 변경 */}
        {riskId ? `${RISK_LEVELS[riskId]?.name} 목록` : '사상체 데이터베이스 전체'}
      </h2>
      
      {/* 필터링된 등급들만 반복 렌더링 */}
      {targetRisks.map(([code, info]) => {
        const docs = groupedData[code];
        if (!docs || docs.length === 0) return null;

        return (
          <div key={code} className="mb-8 animate-[fadeIn_0.3s_ease-out]">
            <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${info.color}`}>
              ■ {info.name} ({docs.length})
            </h3>
            {/* 테이블 렌더링 (기존 코드 활용하되 onClick 부분만 위 handleDocClick 사용) */}
            <div className="bg-white border border-gray-400 shadow-sm overflow-x-auto">
               <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                 {/* thead 생략 (기존과 동일) */}
                 <thead className="bg-[#322659] text-white">
                    <tr>
                      <th className="p-3 w-32">식별코드</th>
                      <th className="p-3">명칭</th>
                      <th className="p-3 w-24 text-center">등급</th>
                      <th className="p-3 w-24 text-center">상태</th>
                    </tr>
                 </thead>
                 <tbody className="font-mono text-xs md:text-sm">
                    {docs.map(item => (
                      <tr 
                        key={item.id} 
                        onClick={() => handleDocClick(item, code)} // 클릭 핸들러 변경됨
                        className="border-b border-gray-300 hover:bg-[#322659]/10 cursor-pointer h-10"
                      >
                         <td className="p-3 border-r font-bold">{item.id}</td>
                         <td className="p-3 border-r font-bold text-gray-800">{item.name}</td>
                         <td className={`p-3 border-r text-center font-bold ${info.color}`}>{item.risk}</td>
                         <td className="p-3 text-center">{item.access ? '열람 가능' : '접근 불가'}</td>
                      </tr>
                    ))}
                 </tbody>
               </table>
            </div>
          </div>
        );
      })}
       
    </div>
  );
};

export default AnomalyList;