import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 기존 부팅 스크린 컴포넌트
import BootScreen from './components/BootScreen';

// 레이아웃 및 페이지 컴포넌트
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AnomalyList from './pages/AnomalyList';
import DocView from './pages/DocView';
import Security from './pages/Security';
import SOP from './pages/SOP';
import Classification from './pages/Classification';

function App() {
  // 부팅 상태 관리 (false: 부팅 중, true: 메인 화면 진입)
  const [booted, setBooted] = useState(false);

  // 1. 부팅이 완료되지 않았으면 BootScreen 표시
  if (!booted) {
    return <BootScreen onComplete={() => setBooted(true)} />;
  }

  // 2. 부팅 완료 후 라우팅 화면 표시
  return (
    <Routes>
      {/* Layout 컴포넌트가 모든 페이지의 공통 껍데기(Header + Sidebar) 역할 */}
      <Route path="/" element={<Layout />}>
        
        {/* 기본 경로: 대시보드 */}
        <Route index element={<Dashboard />} />
        
        {/* 사상체 목록 (전체 보기) */}
        <Route path="anomalies" element={<AnomalyList />} />
        
        {/* 등급별 목록 보기 (예: /anomalies/Aj) */}
        <Route path="anomalies/:riskId" element={<AnomalyList />} />

        {/* 사상체 상세 보기 (예: /anomalies/Aj/0341) */}
        <Route path="anomalies/:riskId/:shortId" element={<DocView />} />

        {/* 보안 인가 등급 페이지 */}
        <Route path="security" element={<Security />} />

        {/* 표준 대응 지침 페이지 */}
        <Route path="sop" element={<SOP />} />

        {/* 변칙성 분류 페이지 */}
        <Route path="classification" element={<Classification />} />

        {/* 그 외 정의되지 않은 주소로 접근 시 메인으로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" replace />} />

        
      </Route>
    </Routes>
  );
}

export default App;