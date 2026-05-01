import Terminal from './components/Terminal';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#008080] p-4 sm:p-8 relative overflow-hidden font-sans">
      <div className="absolute top-4 left-4 flex flex-col gap-8 pointer-events-none opacity-80">
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 bg-gray-300 rounded border border-white flex items-center justify-center"><span className="text-xl">📁</span></div>
          <span className="text-white text-[10px]">My Computer</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 bg-gray-300 rounded border border-white flex items-center justify-center"><span className="text-xl">🗑️</span></div>
          <span className="text-white text-[10px]">Recycle Bin</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="z-10 w-full flex justify-center"
      >
        <Terminal />
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full h-10 bg-[#cccccc] border-t-2 border-white flex items-center px-1 gap-1">
        <button className="h-8 px-4 bg-[#cccccc] border-2 border-white border-b-gray-800 border-r-gray-800 flex items-center gap-2 font-bold text-sm">
          <span>🪟</span> Start
        </button>
        <div className="h-6 w-[2px] bg-gray-400 mx-1" />
        <div className="flex-1 flex gap-1 items-center">
          <div className="h-8 px-4 bg-[#eeeeee] border-2 border-gray-800 border-b-white border-r-white flex items-center gap-2 font-semibold text-xs min-w-[120px]">
             <span>⌨️ Command P...</span>
          </div>
        </div>
        <div className="h-8 px-4 bg-[#cccccc] border-2 border-gray-800 border-t-white border-l-white flex items-center gap-4 text-xs">
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
}
