import React from 'react';
import { X, Copy, Check } from 'lucide-react';

interface SqlModalProps {
  isOpen: boolean;
  onClose: () => void;
  sql: string;
}

export const SqlModal: React.FC<SqlModalProps> = ({ isOpen, onClose, sql }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-gray-100">Generated SQL DDL</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-100 transition-colors p-1 rounded-md hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-hidden relative bg-gray-950 p-4">
          <button 
            onClick={handleCopy}
            className="absolute top-6 right-6 flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1.5 rounded-md text-sm transition-colors border border-gray-700"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy SQL'}
          </button>
          <pre className="h-full overflow-auto text-sm font-mono text-gray-300 custom-scrollbar pb-8">
            <code>{sql}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
