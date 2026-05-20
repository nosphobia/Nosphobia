import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { THEME } from '../data/anomalies';

const Modal = ({ isOpen, onClose, title, message, type = 'alert' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#F4F4F4] border-2 border-t-white border-l-white border-b-black border-r-black shadow-2xl max-w-sm w-full p-1 animate-[turn-on_0.2s_ease-out]">
        <div className={`flex justify-between items-center px-2 py-1 mb-2 ${type === 'alert' ? 'bg-[#322659] text-white' : 'bg-gray-800 text-white'}`}>
          <span className={`font-bold text-sm ${THEME.fontEn}`}>{title}</span>
          <button onClick={onClose}><X size={16} /></button>
        </div>
        <div className="p-6 flex flex-col items-center gap-4">
          {type === 'alert' && <AlertTriangle size={48} className="text-[#D9534F]" />}
          <p className={`${THEME.fontKr} text-center whitespace-pre-line font-bold text-gray-800`}>{message}</p>
          <button 
            onClick={onClose}
            className="mt-2 border-2 border-gray-400 border-b-black border-r-black px-6 py-1 bg-gray-200 text-sm font-bold hover:bg-gray-300 w-full active:border-t-black active:border-l-black"
          >
            확인 (OK)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;