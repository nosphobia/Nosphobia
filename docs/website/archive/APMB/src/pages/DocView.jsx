import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ANOMALIES, RISK_LEVELS, THEME } from '../data/anomalies';

const DocView = () => {
  const { riskId, shortId } = useParams(); // URL 파라미터 받기
  const navigate = useNavigate();

  // "ID가 shortId(예: 0341)로 끝나는" 문서를 찾습니다.
  const selectedDoc = ANOMALIES.find(d => d.id.endsWith(shortId));

  // 문서가 없거나, URL의 등급(riskId)과 문서의 실제 등급이 안 맞으면 에러 처리
  if (!selectedDoc || selectedDoc.risk !== riskId) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">ERROR: INVALID ACCESS PATH</h2>
        <button onClick={() => navigate('/anomalies')} className="underline">
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 bg-white min-h-full">
      {/* 종이 질감 배경 컨테이너 */}
      <div className="border-2 border-black p-6 md:p-10 relative shadow-lg max-w-4xl mx-auto bg-[url('https://www.transparenttextures.com/patterns/paper.png')]">
        

        {/* 문서 헤더 - 공문서 양식 */}
        <div className="border-4 border-double border-black mb-8">
          {/* 상단 문서 정보 바 */}
          <div className="bg-gray-200 border-b-2 border-black px-4 py-2 flex justify-between items-center text-xs font-mono">
            <span className="font-bold">문서번호: {selectedDoc.id}</span>
            <span className="text-gray-600">보안등급: TS (Top Secret)</span>
          </div>

          {/* 제목 영역 + 정보 테이블 - SCP 스타일 통합 헤더 */}
          <div className="bg-[#322659]/10 border-l-4 border-[#322659]">
            <div className="flex">
              {/* 좌측 큰 칸 - 사상체 명칭 */}
              <div className="flex-1 px-6 py-5 border-r-2 border-[#322659]/30">
                <div className="text-[10px] text-gray-600 font-mono tracking-wider mb-1">
                  사상체 명칭:
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-[#322659] tracking-tight">
                  {selectedDoc.name}
                </h1>
              </div>

              {/* 우측 2칸 영역 */}
              <div className="w-48 md:w-56 flex flex-col">
                {/* 우측 상단 - 변칙 유형 */}
                <div className="flex-1 px-4 py-2.5 border-b border-[#322659]/30">
                  <div className="text-[10px] text-gray-600 font-mono tracking-wider mb-0.5">
                    변칙 유형:
                  </div>
                  <div className="text-lg md:text-xl font-bold text-gray-800">
                    {selectedDoc.type}
                  </div>
                </div>

                {/* 우측 하단 - 위험 등급 */}
                <div className="flex-1 px-4 py-2.5">
                  <div className="text-[10px] text-gray-600 font-mono tracking-wider mb-0.5">
                    위험 등급:
                  </div>
                  <div className="text-lg md:text-xl font-bold text-yellow-700">
                    {RISK_LEVELS[selectedDoc.risk]?.name}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 경고 바 */}
          <div className="bg-[#322659] text-white px-4 py-1.5 text-[10px] font-mono flex items-center justify-between">
            <span>⚠ UNAUTHORIZED DISCLOSURE IS PROHIBITED</span>
            <span className="opacity-70">본 문서의 무단 유출은 엄격히 금지됨</span>
          </div>
        </div>

        {/* 문서 본문 (HTML 문자열 주입) */}
        <div 
          className={`prose max-w-none font-serif text-sm md:text-base leading-relaxed ${THEME.fontKr}`}
          dangerouslySetInnerHTML={{ __html: selectedDoc.content }}
        />

        {/* 문서 푸터 */}
        <div className="mt-16 pt-4 border-t border-dashed border-gray-400 text-xs text-gray-500 font-mono text-center flex flex-col gap-1">
          <span>문서 생성일: 2002-XX-XX | 최종 갱신: 2023-11-20</span>
          <span>작성자: 연구원 ███ | 승인: 관리국장 [데이터 말소]</span>
        </div>
      </div>

      {/* 목록으로 돌아가기 버튼 */}
      <div className="flex justify-center mt-8 mb-8">
        <button 
          onClick={() => navigate(`/anomalies/${riskId}`)} 
          className="text-[#322659] hover:bg-[#322659] hover:text-white px-4 py-2 border border-[#322659] transition-colors text-sm font-bold"
        >
          ← 목록으로
        </button>
      </div>
    </div>
  );
};

export default DocView;