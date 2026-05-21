import React, { useState, useEffect, useRef } from 'react';
import { Power } from 'lucide-react';

const BootScreen = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef(null);

  // 부팅 시퀀스 텍스트 (더 길게 수정됨)
  const fullBootSequence = [
    "APMB BIOS v4.0.2 (c) 1999-2023 Bureau Systems Inc.",
    "CPU: Intel(R) Quantum-Core(TM) i9-9900K @ 4.00GHz",
    "Memory Test: 65536K OK",
    "Detecting Primary Master ... IDE Hard Disk",
    "Booting from Hard Disk...",
    "Loading Kernel...",
    "Mounting root file system...",
    "[OK] Mounted /dev/sda1 as /",
    "Loading security modules:",
    "  > modprobe k_sec_shield ... [OK]",
    "  > modprobe k_cognition_filter ... [OK]",
    "Initializing network interfaces...",
    "  eth0: Link is up at 1000 Mbps",
    "Establishing secure tunnel to KR-SEOUL-HQ...",
    "Handshake: [SYN] -> [SYN, ACK] -> [ACK]",
    "Connection established. Latency: 4ms",
    "Verifying User Token...",
    "Reading Biometrics...",
    "........................................",
    "Identity matched: TEMPORARY INVESTIGATOR (IG)",
    "Applying clearance level: IG (Investigator)",
    "Warning: This session is monitored.",
    "Starting Window Manager...",
    "Welcome to APMB Intranet."
  ];

  useEffect(() => {
    if (!isReady) return;
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex >= fullBootSequence.length) {
        clearInterval(interval);
        setTimeout(onComplete, 800);
        return;
      }
      setLines(prev => [...prev, fullBootSequence[currentIndex]]);
      currentIndex++;
    }, 60); // 타이핑 속도 조절

    return () => clearInterval(interval);
  }, [isReady]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-[#322659] p-4 cursor-pointer select-none" onClick={() => setIsReady(true)}>
        <div className="mb-6 opacity-80 animate-pulse">
           <Power size={64} className="text-[#322659]" />
        </div>
        <h1 className="font-mono text-xl md:text-2xl tracking-[0.5em] text-white mb-4 text-center font-bold">
            A.P.M.B
        </h1>
        <p className="font-serif text-gray-500 text-sm mb-12">초상현상관리국 보안 인트라넷 접속 터미널</p>
        
        <div className="border border-[#322659] bg-[#322659]/10 px-8 py-3 hover:bg-[#322659] hover:text-white transition-all duration-300 group relative overflow-hidden">
            <span className="font-mono text-lg font-bold tracking-widest">CLICK TO CONNECT</span>
        </div>
        
        <div className="mt-12 text-[10px] md:text-xs text-gray-700 font-mono text-center leading-relaxed">
            WARNING: UNAUTHORIZED ACCESS IS A FELONY.<br/>
            ALL ACTIVITIES ARE LOGGED AND MONITORED.
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-screen bg-black text-green-600 font-mono p-4 overflow-y-auto text-xs md:text-sm leading-snug">
      {lines.map((line, i) => (
        <div key={i} className="mb-0.5 whitespace-pre-wrap break-all">
          <span className="text-gray-600 mr-2">[{new Date().toLocaleTimeString('en-US',{hour12:false})}]</span>
          {line}
        </div>
      ))}
      <div className="animate-pulse text-green-400 mt-2">_</div>
    </div>
  );
};

export default BootScreen;