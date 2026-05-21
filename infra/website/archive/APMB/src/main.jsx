import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 이 부분이 핵심입니다!
import App from './App.jsx'
import './index.css' // Tailwind CSS가 적용된 CSS 파일

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* App 컴포넌트를 BrowserRouter로 반드시 감싸야 라우팅이 작동합니다 */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)