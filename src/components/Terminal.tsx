import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Terminal as TerminalIcon, X, Minus, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateCode } from '../services/geminiService';

interface LogEntry {
  id: string;
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
}

export default function Terminal() {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', type: 'system', content: 'WinGen Terminal [Version 1.0.420]' },
    { id: '2', type: 'system', content: '(c) WinGen Corporation. All rights reserved.' },
    { id: '3', type: 'system', content: '' },
    { id: '4', type: 'system', content: 'Type /help for a list of commands.' },
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [credits, setCredits] = useState(5);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const newLogs = [...logs, { id: Date.now().toString(), type: 'input' as const, content: `C:\\Users\\User> ${trimmed}` }];
    setLogs(newLogs);
    setInput('');

    if (trimmed.startsWith('/generate code')) {
      if (credits <= 0) {
        setLogs(prev => [...prev, { id: Date.now().toString() + 'err', type: 'error', content: 'Insufficient AI credits. Type /help to see how to potentially earn more, or try the secret code.' }]);
        return;
      }

      const prompt = trimmed.replace('/generate code', '').trim();
      if (!prompt) {
        setLogs(prev => [...prev, { id: Date.now().toString() + 'err', type: 'error', content: 'Error: Please provide a prompt. Usage: /generate code (prompt)' }]);
        return;
      }
      
      setIsGenerating(true);
      const tempId = 'gen-' + Date.now();
      setLogs(prev => [...prev, { id: tempId, type: 'system', content: 'Generating code... please wait...' }]);
      
      try {
        const result = await generateCode(prompt);
        setCredits(prev => prev - 1);
        setLogs(prev => {
          const filtered = prev.filter(l => l.id !== tempId);
          return [...filtered, { id: Date.now().toString() + 'res', type: 'output', content: result }];
        });
      } catch (err) {
        setLogs(prev => {
          const filtered = prev.filter(l => l.id !== tempId);
          return [...filtered, { id: Date.now().toString() + 'err', type: 'error', content: `Error: ${err instanceof Error ? err.message : 'Unknown error'}` }];
        });
      } finally {
        setIsGenerating(false);
      }
    } else if (trimmed === '/clear') {
      setLogs([]);
    } else if (trimmed === '/help') {
      setLogs(prev => [...prev, { 
        id: Date.now().toString() + 'help', 
        type: 'system', 
        content: `Available commands:
  /generate code (prompt) - Generate code using AI (Uses 1 Credit)
  /clear                   - Clear the screen
  /help                    - Show this help message
  
Note: AI generation is limited. Check the status bar for remaining credits.` 
      }]);
    } else if (trimmed === '/098') {
      setCredits(100);
      setLogs(prev => [...prev, { id: Date.now().toString() + 'sys', type: 'system', content: 'System Override: AI Credits restored to 100.' }]);
    } else if (trimmed === 'dir') {
      setLogs(prev => [...prev, { id: Date.now().toString() + 'dir', type: 'system', content: ' Volume in drive C has no label.\n Volume Serial Number is 420A-6969\n\n Directory of C:\\Users\\User\n\n05/01/2026  10:00 AM    <DIR>          .\n05/01/2026  10:00 AM    <DIR>          ..\n05/01/2026  10:00 AM                 0 secrets.txt\n               1 File(s)              0 bytes\n               2 Dir(s)  1,000,000,000 bytes free' }]);
    } else {
      setLogs(prev => [...prev, { id: Date.now().toString() + 'err', type: 'error', content: `'${trimmed.split(' ')[0]}' is not recognized as an internal or external command, operable program or batch file.` }]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;
    handleCommand(input);
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div 
      className="flex flex-col w-full max-w-4xl h-[600px] bg-[#0c0c0c] rounded shadow-2xl border-2 border-[#cccccc] font-mono text-sm leading-relaxed"
      onClick={focusInput}
    >
      <div className="flex items-center justify-between px-2 py-1 bg-gradient-to-r from-[#000080] to-[#1084d0] text-white">
        <div className="flex items-center gap-2">
          <TerminalIcon size={16} fill="currentColor" />
          <span className="text-xs font-bold font-sans">Command Prompt - WinGen Terminal</span>
        </div>
        <div className="flex items-center gap-1.5 px-0.5">
          <button className="w-5 h-5 flex items-center justify-center bg-[#cccccc] text-black border border-white shadow-[1px_1px_0px_black]"><Minus size={12} /></button>
          <button className="w-5 h-5 flex items-center justify-center bg-[#cccccc] text-black border border-white shadow-[1px_1px_0px_black]"><Square size={10} /></button>
          <button className="w-5 h-5 flex items-center justify-center bg-[#cccccc] text-black border border-white shadow-[1px_1px_0px_black] hover:bg-red-500 hover:text-white"><X size={12} /></button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="flex flex-col gap-1 whitespace-pre-wrap">
          {logs.map((log) => (
            <div key={log.id} className={
              log.type === 'input' ? 'text-gray-200' :
              log.type === 'output' ? 'text-white' :
              log.type === 'error' ? 'text-red-400' : 'text-gray-300'
            }>
              {log.type === 'output' ? (
                <div className="markdown-body prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{log.content}</ReactMarkdown>
                </div>
              ) : (
                <span className="capitalize">{log.content}</span>
              )}
            </div>
          ))}
          
          <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
            <span className="text-gray-200 shrink-0">C:\Users\User&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isGenerating}
              className="flex-1 bg-transparent border-none outline-none text-gray-200 caret-gray-100 focus:ring-0 p-0 m-0"
              spellCheck={false}
              autoComplete="off"
            />
          </form>
          {isGenerating && <div className="text-gray-400 animate-pulse mt-1">_</div>}
        </div>
      </div>

      <div className="bg-[#cccccc] px-2 py-0.5 text-[10px] text-black font-sans flex justify-between items-center border-t border-white">
        <div className="flex gap-4">
          <span>{isGenerating ? 'AI ACTIVE' : 'SYSTEM READY'}</span>
          <span className="hidden sm:inline">MEM: 512MB RAM</span>
          <span className="font-bold text-blue-800">[MOBILE MODE]</span>
          <span className={`font-bold ${credits <= 2 ? 'text-red-700 animate-pulse' : ''}`}>AI CREDITS: {credits}</span>
        </div>
        <div className="flex gap-4">
          <span>Ln 1, Col 1</span>
          <span>100%</span>
          <span>Mobile (vOS)</span>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 16px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #cccccc; border-left: 1px solid #7a7a7a; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #eeeeee; border: 1px solid #ffffff; box-shadow: inset -1px -1px 0px #7a7a7a, inset 1px 1px 0px #ffffff; }
        .prose pre { background-color: #1a1a1a !important; border: 1px solid #333; margin: 0.5rem 0; }
      `}</style>
    </div>
  );
}
